(function () {
  const CONFIG = window.MOVEMENT_TECH_CONFIG || {};
  const ENDPOINTS = CONFIG.endpoints || {};
  const I18N = window.MOVEMENT_TECH_I18N || {};
  const TAB_HIGHLIGHT_TRANSITION = 'transform .28s cubic-bezier(.22,.9,.24,1), width .28s cubic-bezier(.22,.9,.24,1)';

  const state = {
    activeFilter: 'all',
    categories: [],
    difficulties: [],
    techniques: [],
  };
  const warmedVideoOrigins = new Set();
  const MAX_CONCURRENT_VIDEO_LOADS = 1;
  let videoLoadObserver = null;
  let activeVideoLoads = 0;
  let queuedVideoShells = [];

  function text(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  function integerOrNull(value) {
    const normalized = Number(value);
    return Number.isInteger(normalized) ? normalized : null;
  }

  function t(path, fallback) {
    const parts = String(path || '').split('.');
    let result = I18N;

    for (const part of parts) {
      result = result?.[part];

      if (result == null) {
        break;
      }
    }

    return typeof result === 'string' && result.trim() ? result : fallback;
  }

  function slugify(value) {
    const normalized = String(value || '')
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return normalized || 'technique';
  }

  function techniqueSlugSource(entry, name) {
    return (
      text(entry?.slug) ||
      text(entry?.url_slug) ||
      text(entry?.key) ||
      name
    );
  }

  function uniqueSlug(value, usedSlugs) {
    const baseSlug = slugify(value);
    let slug = baseSlug;
    let suffix = 2;

    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    usedSlugs.add(slug);
    return slug;
  }

  function createElement(tagName, className, content) {
    const element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (content !== undefined && content !== null) {
      element.textContent = String(content);
    }

    return element;
  }

  function showToast(message, ok = true) {
    if (!message) {
      return;
    }

    const toast = createElement(
      'div',
      `fixed bottom-4 left-1/2 z-[200] -translate-x-1/2 rounded-2xl border px-4 py-2 text-sm shadow-2xl transition-all duration-300 opacity-0 translate-y-2 ${
        ok
          ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100'
          : 'border-rose-400/30 bg-rose-500/15 text-rose-100'
      }`,
      message
    );

    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('opacity-0', 'translate-y-2');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 1600);
  }

  function copyTextRobust(value) {
    const textToCopy = String(value || '');

    if (!textToCopy) {
      return Promise.reject(new Error('No text to copy'));
    }

    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function' &&
      window.isSecureContext
    ) {
      return navigator.clipboard.writeText(textToCopy);
    }

    return new Promise((resolve, reject) => {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);

        const copied = document.execCommand('copy');
        textarea.remove();

        if (copied) {
          resolve();
          return;
        }

        reject(new Error('Copy failed'));
      } catch (error) {
        reject(error);
      }
    });
  }

  function movementTechErrorMessage(payload, fallback) {
    if (payload && typeof payload === 'object') {
      if (typeof payload.error === 'string' && payload.error.trim()) {
        return payload.error.trim();
      }

      if (typeof payload.message === 'string' && payload.message.trim()) {
        return payload.message.trim();
      }
    }

    return fallback;
  }

  async function fetchJson(url) {
    const response = await fetch(url, {
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    let payload = null;

    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok) {
      throw new Error(
        movementTechErrorMessage(payload, `${t('ui.load_failed', 'Unable to load movement tech.')} (${response.status})`)
      );
    }

    return payload || {};
  }

  function normalizeCategories(payload) {
    const categories = Array.isArray(payload?.categories) ? payload.categories : [];

    return categories
      .map((entry, index) => {
        const id = integerOrNull(entry?.id);
        const name = text(entry?.name);
        if (id == null || !name) {
          return null;
        }

        const sortOrder = integerOrNull(entry?.sort_order);

        return {
          id,
          name,
          sortOrder: sortOrder == null ? index + 1 : sortOrder,
        };
      })
      .filter(Boolean)
      .sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name));
  }

  function normalizeDifficulties(payload) {
    const difficulties = Array.isArray(payload?.difficulties) ? payload.difficulties : [];

    return difficulties
      .map((entry, index) => {
        const id = integerOrNull(entry?.id);
        const name = text(entry?.name);
        if (id == null || !name) {
          return null;
        }

        const sortOrder = integerOrNull(entry?.sort_order);

        return {
          id,
          name,
          sortOrder: sortOrder == null ? index + 1 : sortOrder,
        };
      })
      .filter(Boolean)
      .sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name));
  }

  function normalizeTips(tips) {
    const rows = Array.isArray(tips) ? tips : [];

    return rows
      .map((entry, index) => {
        const id = integerOrNull(entry?.id);
        const tipText = text(entry?.text);
        if (!tipText) {
          return null;
        }

        const sortOrder = integerOrNull(entry?.sort_order);

        return {
          id,
          text: tipText,
          sortOrder: sortOrder == null ? index + 1 : sortOrder,
        };
      })
      .filter(Boolean)
      .sort((left, right) => left.sortOrder - right.sortOrder || (left.id || 0) - (right.id || 0));
  }

  function normalizeVideos(videos) {
    const rows = Array.isArray(videos) ? videos : [];

    return rows
      .map((entry, index) => {
        const id = integerOrNull(entry?.id);
        const url = text(entry?.url);
        if (!url) {
          return null;
        }

        const caption = text(entry?.caption) || null;
        const sortOrder = integerOrNull(entry?.sort_order);

        return {
          id,
          url,
          caption,
          sortOrder: sortOrder == null ? index + 1 : sortOrder,
        };
      })
      .filter(Boolean)
      .sort((left, right) => left.sortOrder - right.sortOrder || (left.id || 0) - (right.id || 0));
  }

  function normalizeTechniques(payload, categoriesById, difficultiesById) {
    const techniques = Array.isArray(payload?.techniques) ? payload.techniques : [];
    const seenIds = new Set();
    const usedSlugs = new Set();

    return techniques
      .map((entry, index) => {
        const id = integerOrNull(entry?.id);
        const name = text(entry?.name);
        if (id == null || !name) {
          return null;
        }

        if (seenIds.has(id)) {
          return null;
        }

        seenIds.add(id);

        const categoryId = integerOrNull(entry?.category_id);
        const difficultyId = integerOrNull(entry?.difficulty_id);
        const categoryFromLookup = categoryId == null ? null : categoriesById.get(categoryId);
        const difficultyFromLookup = difficultyId == null ? null : difficultiesById.get(difficultyId);
        const displayOrder = integerOrNull(entry?.display_order);

        return {
          id,
          name,
          slug: uniqueSlug(techniqueSlugSource(entry, name), usedSlugs),
          description: text(entry?.description),
          instructions: text(entry?.instructions),
          displayOrder: displayOrder == null ? index + 1 : displayOrder,
          categoryId,
          categoryName: text(entry?.category_name) || categoryFromLookup?.name || t('ui.uncategorized', 'Uncategorized'),
          difficultyId,
          difficultyName: text(entry?.difficulty_name) || difficultyFromLookup?.name || t('ui.unknown_difficulty', 'No difficulty'),
          difficultySortOrder: difficultyFromLookup?.sortOrder || null,
          tips: normalizeTips(entry?.tips),
          videos: normalizeVideos(entry?.videos),
        };
      })
      .filter(Boolean)
      .sort((left, right) => left.displayOrder - right.displayOrder || left.name.localeCompare(right.name));
  }

  function categoryFilterKey(categoryId) {
    return categoryId == null ? 'uncategorized' : `category:${categoryId}`;
  }

  function buildRenderableCategories(categories, techniques) {
    const counts = new Map();

    techniques.forEach((technique) => {
      const key = categoryFilterKey(technique.categoryId);
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    const renderable = categories.map((category) => ({
      id: category.id,
      key: categoryFilterKey(category.id),
      name: category.name,
      sortOrder: category.sortOrder,
      count: counts.get(categoryFilterKey(category.id)) || 0,
    }));

    const knownIds = new Set(categories.map((category) => category.id));

    techniques.forEach((technique) => {
      if (technique.categoryId == null || knownIds.has(technique.categoryId)) {
        return;
      }

      knownIds.add(technique.categoryId);
      renderable.push({
        id: technique.categoryId,
        key: categoryFilterKey(technique.categoryId),
        name: technique.categoryName || `${t('ui.uncategorized', 'Uncategorized')} ${technique.categoryId}`,
        sortOrder: Number.MAX_SAFE_INTEGER - 1,
        count: counts.get(categoryFilterKey(technique.categoryId)) || 0,
      });
    });

    renderable.sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name));

    if ((counts.get('uncategorized') || 0) > 0) {
      renderable.push({
        id: null,
        key: 'uncategorized',
        name: t('ui.uncategorized', 'Uncategorized'),
        sortOrder: Number.MAX_SAFE_INTEGER,
        count: counts.get('uncategorized') || 0,
      });
    }

    return renderable;
  }

  function difficultyBadgeClasses(sortOrder) {
    if (sortOrder === 1) {
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
    }

    if (sortOrder === 2) {
      return 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300';
    }

    if (sortOrder != null && sortOrder >= 3) {
      return 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300';
    }

    return 'border-zinc-300/80 bg-zinc-200/60 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-200';
  }

  function safeHttpUrl(url) {
    try {
      const parsed = new URL(url, window.location.origin);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : null;
    } catch {
      return null;
    }
  }

  function buildVideoDescriptor(url, { autoplay = false } = {}) {
    const safeUrl = safeHttpUrl(url);
    if (!safeUrl) {
      return null;
    }

    let parsed;
    try {
      parsed = new URL(safeUrl);
    } catch {
      return null;
    }

    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    let embedUrl = '';
    let type = '';
    let thumbnailUrl = '';
    let preconnectOrigins = [];

    if (host.includes('youtube.com') || host === 'youtu.be') {
      let videoId = parsed.searchParams.get('v');

      if (!videoId && host === 'youtu.be') {
        videoId = parsed.pathname.split('/').filter(Boolean)[0] || '';
      }

      if (!videoId && parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.split('/')[2] || '';
      }

      if (!videoId && parsed.pathname.includes('/embed/')) {
        videoId = parsed.pathname.split('/').filter(Boolean)[1] || '';
      }

      if (videoId) {
        const embed = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
        embed.searchParams.set('rel', '0');
        embed.searchParams.set('modestbranding', '1');
        if (autoplay) {
          embed.searchParams.set('autoplay', '1');
        }

        type = 'iframe';
        embedUrl = embed.toString();
        thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        preconnectOrigins = ['https://www.youtube-nocookie.com', 'https://i.ytimg.com'];
      }
    } else if (host.includes('vimeo.com')) {
      const videoId = (parsed.pathname.match(/\/(?:video\/)?(\d+)/) || [])[1];

      if (videoId) {
        const embed = new URL(`https://player.vimeo.com/video/${videoId}`);
        if (autoplay) {
          embed.searchParams.set('autoplay', '1');
        }

        type = 'iframe';
        embedUrl = embed.toString();
        preconnectOrigins = ['https://player.vimeo.com'];
      }
    } else if (host.includes('twitch.tv')) {
      const parent = window.location.hostname;
      const clip = (parsed.pathname.match(/\/clip\/([^/?]+)/) || [])[1];
      const videoId = (parsed.pathname.match(/\/videos\/(\d+)/) || [])[1];
      const channel = !clip && !videoId ? parsed.pathname.split('/').filter(Boolean)[0] || '' : '';

      if (clip) {
        const embed = new URL('https://clips.twitch.tv/embed');
        embed.searchParams.set('clip', clip);
        embed.searchParams.set('parent', parent);
        embed.searchParams.set('autoplay', autoplay ? 'true' : 'false');
        type = 'iframe';
        embedUrl = embed.toString();
        preconnectOrigins = ['https://clips.twitch.tv'];
      } else if (videoId) {
        const embed = new URL('https://player.twitch.tv/');
        embed.searchParams.set('video', videoId);
        embed.searchParams.set('parent', parent);
        embed.searchParams.set('autoplay', autoplay ? 'true' : 'false');
        type = 'iframe';
        embedUrl = embed.toString();
        preconnectOrigins = ['https://player.twitch.tv'];
      } else if (channel) {
        const embed = new URL('https://player.twitch.tv/');
        embed.searchParams.set('channel', channel);
        embed.searchParams.set('parent', parent);
        embed.searchParams.set('autoplay', autoplay ? 'true' : 'false');
        type = 'iframe';
        embedUrl = embed.toString();
        preconnectOrigins = ['https://player.twitch.tv'];
      }
    } else if (host.includes('bilibili.com') || host.includes('b23.tv')) {
      const bv = (safeUrl.match(/(BV[0-9A-Za-z]+)/) || [])[1];
      const page = parsed.searchParams.get('p');

      if (bv) {
        const embed = new URL('https://player.bilibili.com/player.html');
        embed.searchParams.set('bvid', bv);
        if (page) {
          embed.searchParams.set('page', page);
        }
        if (autoplay) {
          embed.searchParams.set('autoplay', '1');
        }

        type = 'iframe';
        embedUrl = embed.toString();
        preconnectOrigins = ['https://player.bilibili.com'];
      }
    } else if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(parsed.pathname)) {
      type = 'video';
      preconnectOrigins = [parsed.origin];
    }

    if (!type && !embedUrl) {
      return null;
    }

    return {
      safeUrl,
      embedUrl,
      type,
      thumbnailUrl,
      preconnectOrigins,
    };
  }

  function warmVideoConnections(url) {
    const descriptor = buildVideoDescriptor(url);
    if (!descriptor) {
      return;
    }

    descriptor.preconnectOrigins.forEach((origin) => {
      if (!origin || warmedVideoOrigins.has(origin)) {
        return;
      }

      warmedVideoOrigins.add(origin);

      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      link.crossOrigin = '';
      document.head.appendChild(link);
    });
  }

  function createVideoPlayer(url, titleText, { autoplay = false } = {}) {
    const descriptor = buildVideoDescriptor(url, { autoplay });
    if (!descriptor) {
      return null;
    }

    const wrapper = createElement('div', 'relative mt-3 aspect-video overflow-hidden rounded-xl bg-zinc-950');

    if (descriptor.type === 'video') {
      const mediaNode = createElement('video', 'absolute inset-0 h-full w-full');
      mediaNode.src = descriptor.safeUrl;
      mediaNode.controls = true;
      mediaNode.playsInline = true;
      mediaNode.preload = 'metadata';
      mediaNode.autoplay = autoplay;
      wrapper.appendChild(mediaNode);

      if (autoplay) {
        requestAnimationFrame(() => {
          const playAttempt = mediaNode.play();
          if (playAttempt && typeof playAttempt.catch === 'function') {
            playAttempt.catch(() => {});
          }
        });
      }

      return wrapper;
    }

    const iframe = createElement('iframe', 'absolute inset-0 h-full w-full');
    iframe.src = descriptor.embedUrl;
    iframe.title = titleText || t('ui.embedded_video', 'Embedded video');
    iframe.loading = autoplay ? 'eager' : 'lazy';
    iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    );
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');

    wrapper.appendChild(iframe);
    return wrapper;
  }

  function createDeferredVideo(url, titleText) {
    const descriptor = buildVideoDescriptor(url);
    if (!descriptor) {
      return null;
    }

    const wrapper = createElement(
      'div',
      'relative mt-3 aspect-video overflow-hidden rounded-xl bg-zinc-950 ring-1 ring-black/15'
    );
    wrapper.dataset.techVideoShell = '1';
    wrapper.dataset.techVideoUrl = descriptor.safeUrl;
    wrapper.dataset.techVideoTitle = titleText || '';
    wrapper.setAttribute('aria-label', titleText || t('ui.video', 'Video'));

    if (descriptor.thumbnailUrl) {
      const thumbnail = createElement('img', 'absolute inset-0 h-full w-full object-cover');
      thumbnail.src = descriptor.thumbnailUrl;
      thumbnail.alt = '';
      thumbnail.loading = 'lazy';
      thumbnail.decoding = 'async';
      thumbnail.referrerPolicy = 'strict-origin-when-cross-origin';
      thumbnail.fetchPriority = 'low';
      wrapper.appendChild(thumbnail);
    }

    wrapper.appendChild(
      createElement(
        'div',
        'absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/45'
      )
    );

    const loader = createElement('div', 'absolute inset-x-0 bottom-0 flex justify-end p-3');
    const dots = createElement(
      'div',
      'inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1.5 backdrop-blur-sm'
    );
    ['delay-0', 'delay-150', 'delay-300'].forEach((delayClass) => {
      dots.appendChild(createElement('span', `h-1.5 w-1.5 rounded-full bg-white/85 animate-pulse ${delayClass}`));
    });
    loader.appendChild(dots);
    wrapper.appendChild(loader);

    return wrapper;
  }

  function compareDocumentOrder(left, right) {
    if (left === right) {
      return 0;
    }

    const position = left.compareDocumentPosition(right);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
      return -1;
    }

    if (position & Node.DOCUMENT_POSITION_PRECEDING) {
      return 1;
    }

    return 0;
  }

  function createQueueCompletion(callback) {
    let done = false;

    return () => {
      if (done) {
        return;
      }

      done = true;
      callback();
    };
  }

  function processVideoQueue() {
    while (activeVideoLoads < MAX_CONCURRENT_VIDEO_LOADS && queuedVideoShells.length > 0) {
      const shell = queuedVideoShells.shift();

      if (!shell || !document.body.contains(shell) || shell.dataset.techVideoLoaded === '1') {
        continue;
      }

      if (shell.closest('[data-tech-card].hidden')) {
        continue;
      }

      shell.dataset.techVideoQueued = '0';
      shell.dataset.techVideoLoading = '1';
      activeVideoLoads += 1;
      warmVideoConnections(shell.dataset.techVideoUrl || '');

      const url = shell.dataset.techVideoUrl || '';
      const titleText = shell.dataset.techVideoTitle || '';
      const player = createVideoPlayer(url, titleText);

      if (!player) {
        shell.dataset.techVideoLoaded = '1';
        shell.dataset.techVideoLoading = '0';
        activeVideoLoads = Math.max(0, activeVideoLoads - 1);
        continue;
      }

      const finish = createQueueCompletion(() => {
        activeVideoLoads = Math.max(0, activeVideoLoads - 1);
        processVideoQueue();
      });
      const iframe = player.querySelector('iframe');
      const video = player.querySelector('video');

      if (iframe) {
        iframe.addEventListener('load', finish, { once: true });
        window.setTimeout(finish, 2500);
      } else if (video) {
        if (video.readyState >= 1) {
          window.setTimeout(finish, 0);
        } else {
          video.addEventListener('loadedmetadata', finish, { once: true });
          video.addEventListener('error', finish, { once: true });
          window.setTimeout(finish, 1500);
        }
      } else {
        window.setTimeout(finish, 0);
      }

      shell.dataset.techVideoLoaded = '1';
      shell.replaceWith(player);
    }
  }

  function queueVideoShell(shell) {
    if (
      !shell ||
      shell.dataset.techVideoLoaded === '1' ||
      shell.dataset.techVideoQueued === '1' ||
      shell.dataset.techVideoLoading === '1'
    ) {
      return;
    }

    shell.dataset.techVideoQueued = '1';
    queuedVideoShells.push(shell);
    queuedVideoShells.sort(compareDocumentOrder);
    processVideoQueue();
  }

  function initVideoLoading() {
    if (videoLoadObserver) {
      videoLoadObserver.disconnect();
      videoLoadObserver = null;
    }

    activeVideoLoads = 0;
    queuedVideoShells = [];

    const shells = Array.from(document.querySelectorAll('[data-tech-video-shell]')).filter(
      (shell) => !shell.closest('[data-tech-card].hidden') && shell.dataset.techVideoLoaded !== '1'
    );

    shells.forEach((shell) => {
      shell.dataset.techVideoQueued = '0';
      shell.dataset.techVideoLoading = '0';
    });

    if (shells.length === 0) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      shells.forEach(queueVideoShell);
      return;
    }

    videoLoadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          videoLoadObserver?.unobserve(entry.target);
          queueVideoShell(entry.target);
        });
      },
      { rootMargin: '700px 0px', threshold: 0.01 }
    );

    shells.forEach((shell) => videoLoadObserver.observe(shell));
  }

  function statusNode() {
    return document.getElementById('movementTechStatus');
  }

  function gridNode() {
    return document.getElementById('movementTechGrid');
  }

  function emptyNode() {
    return document.getElementById('movementTechEmpty');
  }

  function summaryNode() {
    return document.getElementById('movementTechSummary');
  }

  function tabsWrapNode() {
    return document.getElementById('movementTechTabsWrap');
  }

  function tabsButtonsNode() {
    return document.getElementById('movementTechTabsButtons');
  }

  function tabsNode() {
    return document.getElementById('movementTechTabs');
  }

  function tabsHighlightNode() {
    return document.getElementById('movementTechTabsHighlight');
  }

  function renderLoadingState() {
    const status = statusNode();
    const grid = gridNode();
    const empty = emptyNode();
    const summary = summaryNode();
    const tabsWrap = tabsWrapNode();

    if (status) {
      status.classList.remove('hidden');
      status.textContent = t('ui.loading', 'Loading movement tech...');
    }

    grid?.classList.add('hidden');
    empty?.classList.add('hidden');
    summary?.classList.add('hidden');
    tabsWrap?.classList.add('hidden');
  }

  function renderErrorState(message) {
    const status = statusNode();
    const grid = gridNode();
    const empty = emptyNode();
    const summary = summaryNode();
    const tabsWrap = tabsWrapNode();

    if (!status) {
      return;
    }

    status.innerHTML = '';
    status.classList.remove('hidden');

    const messageNode = createElement(
      'div',
      'text-sm text-zinc-600 dark:text-zinc-300',
      message || t('ui.load_failed', 'Unable to load movement tech right now.')
    );

    const retryButton = createElement(
      'button',
      'mt-4 inline-flex cursor-pointer items-center rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 transition hover:bg-zinc-50',
      t('ui.retry', 'Retry')
    );
    retryButton.type = 'button';
    retryButton.dataset.techRetry = '1';

    status.appendChild(messageNode);
    status.appendChild(retryButton);

    grid?.classList.add('hidden');
    empty?.classList.add('hidden');
    summary?.classList.add('hidden');
    tabsWrap?.classList.add('hidden');
  }

  function renderSummary() {
    const summary = summaryNode();
    if (!summary) {
      return;
    }

    const items = [
      { label: t('summary.total_techs', 'Techniques'), value: state.techniques.length },
      { label: t('summary.categories', 'Categories'), value: state.categories.length },
      { label: t('summary.difficulties', 'Difficulties'), value: state.difficulties.length },
    ];

    summary.innerHTML = '';

    items.forEach((item) => {
      const card = createElement(
        'div',
        'rounded-2xl border border-zinc-200/80 bg-zinc-100/80 px-5 py-4 dark:border-white/10 dark:bg-white/5'
      );
      const label = createElement(
        'div',
        'text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400',
        item.label
      );
      const value = createElement(
        'div',
        'mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white',
        item.value
      );

      card.appendChild(label);
      card.appendChild(value);
      summary.appendChild(card);
    });

    summary.classList.remove('hidden');
  }

  function renderTabs() {
    const tabsWrap = tabsWrapNode();
    const buttonsHost = tabsButtonsNode();

    if (!tabsWrap || !buttonsHost) {
      return;
    }

    buttonsHost.innerHTML = '';

    const filters = [
      {
        key: 'all',
        name: t('ui.all', 'All'),
        count: state.techniques.length,
      },
      ...state.categories,
    ];

    filters.forEach((filter) => {
      const button = createElement(
        'button',
        'inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200',
        null
      );
      button.type = 'button';
      button.dataset.techFilter = filter.key;
      button.setAttribute('aria-pressed', filter.key === state.activeFilter ? 'true' : 'false');

      const label = createElement('span', '', filter.name);
      const count = createElement('span', 'text-xs opacity-70', filter.count);

      button.appendChild(label);
      button.appendChild(count);
      buttonsHost.appendChild(button);
    });

    tabsWrap.classList.remove('hidden');
    syncActiveTabStyles({ animateHighlight: false });
  }

  function syncActiveTabStyles({ animateHighlight = true } = {}) {
    Array.from(document.querySelectorAll('[data-tech-filter]')).forEach((button) => {
      const isActive = button.dataset.techFilter === state.activeFilter;

      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      button.classList.toggle('text-zinc-900', isActive);
      button.classList.toggle('dark:text-zinc-900', isActive);
      button.classList.toggle('text-zinc-700', !isActive);
      button.classList.toggle('dark:text-zinc-300', !isActive);
      button.classList.toggle('hover:text-zinc-900', !isActive);
      button.classList.toggle('dark:hover:text-white', !isActive);
    });

    moveActiveTabHighlight({ animate: animateHighlight });
  }

  function moveActiveTabHighlight({ animate = true } = {}) {
    const tabs = tabsNode();
    const tabsWrap = tabsWrapNode();
    const highlight = tabsHighlightNode();
    const activeButton = Array.from(document.querySelectorAll('[data-tech-filter]')).find(
      (button) => button.dataset.techFilter === state.activeFilter
    );

    if (!tabs || !tabsWrap || !highlight || !activeButton) {
      return;
    }

    const buttonRect = activeButton.getBoundingClientRect();
    const tabsRect = tabs.getBoundingClientRect();
    const left = Math.round(buttonRect.left - tabsRect.left);
    const width = Math.round(buttonRect.width);
    const apply = () => {
      highlight.style.width = `${Math.max(0, width)}px`;
      highlight.style.transform = `translate3d(${Math.max(0, left)}px,0,0)`;
    };
    const keepActiveButtonVisible = () => {
      if (tabsWrap.scrollWidth <= tabsWrap.clientWidth) {
        return;
      }

      activeButton.scrollIntoView({
        behavior: animate ? 'smooth' : 'auto',
        block: 'nearest',
        inline: 'nearest',
      });
    };

    if (!animate) {
      const previousTransition = highlight.style.transition;
      highlight.style.transition = 'none';
      apply();
      requestAnimationFrame(keepActiveButtonVisible);

      requestAnimationFrame(() => {
        highlight.style.transition = previousTransition && previousTransition !== 'none'
          ? previousTransition
          : TAB_HIGHLIGHT_TRANSITION;
      });

      return;
    }

    if (!highlight.style.transition || highlight.style.transition === 'none') {
      highlight.style.transition = TAB_HIGHLIGHT_TRANSITION;
    }

    requestAnimationFrame(apply);
    requestAnimationFrame(keepActiveButtonVisible);
  }

  function createCopyButton(slug) {
    const button = createElement(
      'button',
      'inline-flex cursor-pointer items-center justify-center rounded-md text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white'
    );
    button.type = 'button';
    button.dataset.copyTechLink = slug;
    button.title = t('ui.copy', 'Copy link');
    button.setAttribute('aria-label', t('ui.copy', 'Copy link'));

    button.innerHTML = `
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 1 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 1 0 7.07 7.07l1.71-1.71"></path>
      </svg>
    `;

    return button;
  }

  function createSectionCard(titleText = '') {
    const section = createElement(
      'div',
      'rounded-xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-900/60'
    );

    if (titleText) {
      const title = createElement(
        'div',
        'text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400',
        titleText
      );

      section.appendChild(title);
    }

    return section;
  }

  function createTechniqueCard(technique) {
    const article = createElement(
      'article',
      'group scroll-mt-24 rounded-2xl border border-zinc-200/80 bg-zinc-100 p-5 shadow-sm transition duration-200 hover:border-zinc-300/80 hover:bg-zinc-50 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:hover:border-white/15 dark:hover:bg-white/[0.07] sm:p-6'
    );
    article.id = technique.slug;
    article.dataset.techCard = '1';
    article.dataset.techCategory = categoryFilterKey(technique.categoryId);

    if ('contentVisibility' in article.style) {
      article.style.contentVisibility = 'auto';
      article.style.containIntrinsicSize = '720px';
    }

    const header = createElement('div', 'flex flex-wrap items-center gap-3');
    const title = createElement(
      'h2',
      'text-2xl font-extrabold uppercase tracking-tight text-zinc-900 dark:text-white',
      technique.name
    );
    const copyButton = createCopyButton(technique.slug);
    const difficultyBadge = createElement(
      'span',
      `inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${difficultyBadgeClasses(
        technique.difficultySortOrder
      )}`,
      technique.difficultyName
    );
    const categoryLabel = createElement(
      'span',
      `text-xs font-medium uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400${
        state.activeFilter === 'all' ? '' : ' hidden'
      }`,
      technique.categoryName
    );
    categoryLabel.dataset.techCategoryLabel = '1';

    header.appendChild(title);
    header.appendChild(copyButton);
    header.appendChild(difficultyBadge);
    header.appendChild(categoryLabel);
    article.appendChild(header);

    article.appendChild(
      createElement(
        'p',
        'mt-4 max-w-4xl whitespace-pre-wrap leading-relaxed text-zinc-600 dark:text-zinc-300',
        technique.description || t('ui.no_description', 'No description yet.')
      )
    );

    const infoGrid = createElement('div', 'mt-5 grid gap-4 lg:grid-cols-2');

    const instructionsTipsSection = createSectionCard();
    const instructionsTipsContent = createElement('div', 'space-y-4');

    const instructionsBlock = createElement('div', 'space-y-2');
    instructionsBlock.appendChild(
      createElement(
        'div',
        'text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400',
        t('ui.instructions', 'Instructions')
      )
    );

    if (technique.instructions) {
      instructionsBlock.appendChild(
        createElement(
          'p',
          'text-sm whitespace-pre-wrap leading-relaxed text-zinc-600 dark:text-zinc-300',
          technique.instructions
        )
      );
    } else {
      instructionsBlock.appendChild(
        createElement(
          'p',
          'text-sm leading-relaxed text-zinc-500 dark:text-zinc-400',
          t('ui.instructions_empty', 'No instructions yet.')
        )
      );
    }

    instructionsTipsContent.appendChild(instructionsBlock);

    if (technique.tips.length > 0) {
      const tipsBlock = createElement('div', 'space-y-2 border-t border-zinc-200/80 pt-4 dark:border-white/10');
      tipsBlock.appendChild(
        createElement(
          'div',
          'text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400',
          t('ui.tips', 'Tips')
        )
      );

      const tipsList = createElement('ul', 'space-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300');

      technique.tips.forEach((tip) => {
        const item = createElement('li', '');
        const value = createElement('span', 'whitespace-pre-wrap', tip.text);
        item.appendChild(value);
        tipsList.appendChild(item);
      });

      tipsBlock.appendChild(tipsList);
      instructionsTipsContent.appendChild(tipsBlock);
    }
    instructionsTipsSection.appendChild(instructionsTipsContent);
    infoGrid.appendChild(instructionsTipsSection);

    const videosSection = createSectionCard(t('ui.videos', 'Videos'));
    if (technique.videos.length > 0) {
      const videosList = createElement('div', 'mt-3 space-y-3');

      technique.videos.forEach((video, index) => {
        const safeUrl = safeHttpUrl(video.url);
        const accessibleVideoTitle = video.caption || `${t('ui.video', 'Video')} ${index + 1}`;
        const deferredVideo = createDeferredVideo(video.url, `${technique.name} - ${accessibleVideoTitle}`);
        const row = createElement(
          'div',
          'rounded-xl border border-zinc-200/80 bg-zinc-100/80 px-3 py-3 dark:border-white/10 dark:bg-white/5'
        );

        if (video.caption) {
          const title = createElement('div', 'text-sm font-semibold text-zinc-800 dark:text-zinc-100', video.caption);
          row.appendChild(title);
        }

        if (deferredVideo) {
          row.appendChild(deferredVideo);
        }

        if (!deferredVideo && safeUrl) {
          const link = createElement(
            'a',
            'mt-2 inline-flex break-all text-sm font-semibold text-orange-700 transition hover:text-orange-600 dark:text-orange-300 dark:hover:text-orange-200',
            safeUrl
          );
          link.href = safeUrl;
          link.target = '_blank';
          link.rel = 'noreferrer noopener';
          row.appendChild(link);
        } else if (!deferredVideo) {
          row.appendChild(
            createElement(
              'div',
              'mt-2 text-xs font-mono break-all text-zinc-500 dark:text-zinc-400',
              video.url
            )
          );
        }

        videosList.appendChild(row);
      });

      videosSection.appendChild(videosList);
    } else {
      videosSection.appendChild(
        createElement(
          'p',
          'mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400',
          t('ui.videos_empty', 'No videos yet.')
        )
      );
    }
    infoGrid.appendChild(videosSection);

    article.appendChild(infoGrid);

    return article;
  }

  function renderTechniques() {
    const status = statusNode();
    const grid = gridNode();

    if (!grid) {
      return;
    }

    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();

    state.techniques.forEach((technique) => {
      fragment.appendChild(createTechniqueCard(technique));
    });

    grid.appendChild(fragment);

    status?.classList.add('hidden');
    grid.classList.remove('hidden');
    syncGridVisibility();
    initReveal(Array.from(grid.querySelectorAll('[data-tech-card]')));
  }

  function syncGridVisibility() {
    const grid = gridNode();
    const empty = emptyNode();

    if (!grid || !empty) {
      return;
    }

    const cards = Array.from(grid.querySelectorAll('[data-tech-card]'));
    const hasVisibleCards = cards.some((card) => !card.classList.contains('hidden'));

    empty.classList.toggle('hidden', hasVisibleCards);
  }

  function applyFilter(filterKey) {
    state.activeFilter = filterKey || 'all';
    syncActiveTabStyles({ animateHighlight: true });

    const grid = gridNode();
    if (!grid) {
      return;
    }

    Array.from(grid.querySelectorAll('[data-tech-card]')).forEach((card) => {
      const matches =
        state.activeFilter === 'all' ||
        card.dataset.techCategory === state.activeFilter;

      card.classList.toggle('hidden', !matches);
    });

    Array.from(grid.querySelectorAll('[data-tech-category-label]')).forEach((label) => {
      label.classList.toggle('hidden', state.activeFilter !== 'all');
    });

    syncGridVisibility();
    initVideoLoading();
  }

  function flashCard(card) {
    if (!card) {
      return;
    }

    card.classList.add('ring-2', 'ring-emerald-400/30');
    window.clearTimeout(card.__movementTechFlashTimer);
    card.__movementTechFlashTimer = window.setTimeout(() => {
      card.classList.remove('ring-2', 'ring-emerald-400/30');
    }, 1800);
  }

  function openTechniqueFromHash(smooth = true) {
    const slug = window.location.hash.replace(/^#/, '');
    if (!slug) {
      applyFilter(state.activeFilter || 'all');
      return;
    }

    const card = document.getElementById(slug);
    if (!card) {
      return;
    }

    applyFilter(card.dataset.techCategory || 'all');

    requestAnimationFrame(() => {
      card.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      flashCard(card);
    });
  }

  function initReveal(cards) {
    if (!('IntersectionObserver' in window)) {
      return;
    }

    cards.forEach((card) => {
      if (card.dataset.techRevealBound === '1') {
        return;
      }

      card.dataset.techRevealBound = '1';
      card.style.opacity = '0';
      card.style.transform = 'translateY(12px)';
      card.style.transition = 'opacity .45s ease, transform .45s ease';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08 }
    );

    cards.forEach((card) => observer.observe(card));
  }

  async function loadMovementTech() {
    renderLoadingState();

    try {
      const [categoriesResult, difficultiesResult, techniquesResult] = await Promise.allSettled([
        fetchJson(ENDPOINTS.categories),
        fetchJson(ENDPOINTS.difficulties),
        fetchJson(ENDPOINTS.techniques),
      ]);

      if (techniquesResult.status !== 'fulfilled') {
        throw techniquesResult.reason;
      }

      const categories = categoriesResult.status === 'fulfilled'
        ? normalizeCategories(categoriesResult.value)
        : [];
      const difficulties = difficultiesResult.status === 'fulfilled'
        ? normalizeDifficulties(difficultiesResult.value)
        : [];

      const categoriesById = new Map(categories.map((category) => [category.id, category]));
      const difficultiesById = new Map(difficulties.map((difficulty) => [difficulty.id, difficulty]));
      const techniques = normalizeTechniques(techniquesResult.value, categoriesById, difficultiesById);

      state.difficulties = difficulties;
      state.techniques = techniques;
      state.categories = buildRenderableCategories(categories, techniques);
      state.activeFilter = 'all';

      renderSummary();
      renderTabs();
      renderTechniques();

      if (window.location.hash) {
        openTechniqueFromHash(false);
      } else {
        applyFilter('all');
      }
    } catch (error) {
      renderErrorState(error?.message || t('ui.load_failed', 'Unable to load movement tech right now.'));
    }
  }

  function bindEvents() {
    document.addEventListener('click', (event) => {
      const retryButton = event.target.closest('[data-tech-retry]');
      if (retryButton) {
        event.preventDefault();
        loadMovementTech();
        return;
      }

      const filterButton = event.target.closest('[data-tech-filter]');
      if (filterButton) {
        event.preventDefault();
        applyFilter(filterButton.dataset.techFilter || 'all');
        return;
      }

      const copyButton = event.target.closest('[data-copy-tech-link]');
      if (copyButton) {
        event.preventDefault();

        const slug = copyButton.dataset.copyTechLink;
        if (!slug) {
          return;
        }

        const url = new URL(window.location.href);
        url.hash = slug;

        copyTextRobust(url.toString())
          .then(() => {
            history.replaceState(null, '', url.toString());
            showToast(t('ui.copied', 'Link copied'), true);
            openTechniqueFromHash(false);
          })
          .catch(() => {
            showToast(t('ui.copy_failed', 'Copy failed'), false);
          });
      }
    });

    window.addEventListener('hashchange', () => {
      openTechniqueFromHash();
    });

    window.addEventListener('resize', () => {
      moveActiveTabHighlight({ animate: false });
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        moveActiveTabHighlight({ animate: false });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    loadMovementTech();
  });
})();
