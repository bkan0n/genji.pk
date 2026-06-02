const API = '/api/tournaments';
const POLL_MS = 60_000;
const ARCHIVE_LIMIT = 10;
const USER_AUTOCOMPLETE_LIMIT = 8;
const AVATAR_CACHE_KEY = 'discord_avatar_cache_v5';
const AVATAR_CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
const MEDAL_URLS = {
  1: 'https://cdn.genji.pk/assets/medals/gold.png',
  2: 'https://cdn.genji.pk/assets/medals/silver.png',
  3: 'https://cdn.genji.pk/assets/medals/bronze.png',
};

const state = {
  edition: null,
  categories: [],
  activeCycles: new Map(),
  selectedCategoryId: '',
  currentSection: 'current',
  leaderboardEntries: [],
  leaderboardCycleId: null,
  leaderboardHash: '',
  leaderboardLoading: false,
  archiveCycles: [],
  archiveKey: '',
  archiveHash: '',
  archiveTotal: 0,
  archiveOffset: 0,
  countdownTimer: null,
  pollTimer: null,
  tabsApi: null,
  leaderboardRequestSeq: 0,
  archiveRequestSeq: 0,
  historyRequestSeq: 0,
};

const i18n = window.TOURNAMENTS_I18N || {};

const $ = (selector, root = document) => root.querySelector(selector);

function t(path, fallback = path) {
  return path.split('.').reduce((value, key) => value?.[key], i18n) ?? fallback;
}

function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function qs(params = {}) {
  const out = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      out.set(key, value);
    }
  });
  return out.toString();
}

async function api(path, params = {}) {
  const query = qs(params);
  const url = `${API}${path}${query ? `?${query}` : ''}`;
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  const data = await response
    .clone()
    .json()
    .catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    data: data ?? (await response.text().catch(() => '')),
  };
}

function formatDate(value) {
  if (!value) return '...';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatTime(seconds, { unit = true } = {}) {
  const n = Number(seconds);
  if (!Number.isFinite(n)) return '--';
  return `${n.toFixed(2)}${unit ? 's' : ''}`;
}

function formatCountdown(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const hms = [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':');
  return days > 0 ? `${days}d ${hms}` : hms;
}

function categoryName(id) {
  return state.categories.find((category) => String(category.id) === String(id))?.name || `#${id}`;
}

function selectedCycle() {
  return state.activeCycles.get(String(state.selectedCategoryId)) || null;
}

function statusPill(status) {
  const normalized = String(status || 'unknown').toLowerCase();
  const color =
    normalized === 'active'
      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
      : normalized === 'pending'
        ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300'
        : normalized === 'completed'
          ? 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-300'
          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300';

  return `<span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${color}">${esc(status || 'unknown')}</span>`;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function showToast(message, type = 'ok') {
  let root = document.getElementById('toast-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'toast-root';
    root.className = 'fixed right-4 top-4 z-[9999] flex w-[min(92vw,26rem)] flex-col gap-2';
    document.body.appendChild(root);
  }

  const tone =
    type === 'error'
      ? 'border-rose-500/30 bg-rose-600 text-white'
      : type === 'warn'
        ? 'border-amber-400/30 bg-amber-500 text-zinc-950'
        : 'border-emerald-400/30 bg-emerald-600 text-white';

  const toast = document.createElement('div');
  toast.className = `rounded-xl border px-4 py-3 text-sm font-semibold shadow-2xl ring-1 ring-black/10 transition duration-200 ${tone}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;
  root.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('translate-y-1', 'opacity-0');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    setTimeout(() => toast.remove(), 260);
  }, 2400);
}

async function copyTextToClipboard(value) {
  const text = String(value || '').trim();
  if (!text) return false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}

  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-9999px';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

async function copyMapCode(code) {
  const value = String(code || '').trim();
  if (!value || value === '...') return;
  const ok = await copyTextToClipboard(value);
  if (ok) {
    showToast(t('messages.map_code_copied', `Map code ${value} copied`).replace('{code}', value), 'ok');
  } else {
    showToast(t('messages.copy_failed', 'Failed to copy map code.'), 'error');
  }
}

function debounce(fn, ms = 160) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function tableSkeletonRows(columns = 5, rows = 6) {
  return Array.from({ length: rows })
    .map(
      () => `
        <tr class="border-t border-zinc-200/80 dark:border-white/10">
          ${Array.from({ length: columns })
            .map(
              () => `
                <td class="px-4 py-3">
                  <div class="h-4 w-full max-w-[10rem] animate-pulse rounded bg-zinc-200/80 dark:bg-white/10"></div>
                </td>
              `
            )
            .join('')}
        </tr>
      `
    )
    .join('');
}

function normalizeUserSuggestion(item) {
  if (Array.isArray(item) && item.length >= 2) {
    return { id: String(item[0] || ''), label: String(item[1] || item[0] || '') };
  }

  if (item && typeof item === 'object') {
    const id = item.id ?? item.user_id ?? item.value ?? '';
    const label = item.label ?? item.name ?? item.nickname ?? item.global_name ?? item.display ?? String(id);
    return { id: String(id || ''), label: String(label || id || '') };
  }

  return { id: String(item || ''), label: String(item || '') };
}

async function fetchUserSuggestions(query) {
  const value = String(query || '').trim();
  if (!value) return [];

  try {
    const url = new URL('/api/autocomplete/users', window.location.origin);
    url.searchParams.set('value', value);
    url.searchParams.set('page_size', String(USER_AUTOCOMPLETE_LIMIT));
    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'same-origin',
      cache: 'no-store',
    });
    const raw = response.ok ? await response.json().catch(() => []) : [];
    const items = Array.isArray(raw) ? raw : raw.items || raw.results || raw.data || [];
    return items.map(normalizeUserSuggestion).filter((item) => /^\d+$/.test(item.id));
  } catch {
    return [];
  }
}

function setStreakMessage(message, tone = 'neutral') {
  const root = $('#tournamentStreakResult');
  if (!root) return;
  const color =
    tone === 'error'
      ? 'text-rose-700 dark:text-rose-300'
      : 'text-zinc-600 dark:text-zinc-300';
  root.innerHTML = `<span class="${color}">${esc(message)}</span>`;
}

function wireStreakAutocomplete() {
  const input = $('#tournamentStreakUser');
  if (!input || input.dataset.autocompleteBound === '1') return;
  input.dataset.autocompleteBound = '1';

  const parent = input.parentElement;
  parent?.classList.add('relative');

  const list = document.createElement('div');
  list.className =
    'absolute left-0 right-0 top-full z-40 mt-1 hidden max-h-60 overflow-auto rounded-lg border border-zinc-200/80 bg-white/95 shadow-2xl ring-1 ring-zinc-300/60 backdrop-blur dark:border-white/10 dark:bg-zinc-900/95 dark:ring-white/10';
  parent?.appendChild(list);

  let items = [];
  let activeIndex = -1;

  const hide = () => list.classList.add('hidden');

  const render = () => {
    if (!items.length) {
      hide();
      return;
    }

    list.innerHTML = items
      .map(
        (item, index) => `
          <button
            type="button"
            data-user-index="${index}"
            class="block w-full cursor-pointer px-3 py-2 text-left text-sm ${index === activeIndex ? 'bg-zinc-100 dark:bg-white/10' : 'hover:bg-zinc-100 dark:hover:bg-white/10'}"
          >
            <span class="block truncate font-semibold">${esc(item.label)}</span>
            <span class="block text-[11px] text-zinc-500 dark:text-zinc-400">${esc(item.id)}</span>
          </button>
        `
      )
      .join('');
    list.classList.remove('hidden');
  };

  const pick = (index) => {
    const item = items[index];
    if (!item) return;
    input.value = item.label;
    input.dataset.uid = item.id;
    hide();
  };

  const search = debounce(async () => {
    const query = input.value.trim();
    if (!query) {
      items = [];
      activeIndex = -1;
      render();
      return;
    }

    items = await fetchUserSuggestions(query);
    activeIndex = items.length ? 0 : -1;
    render();
  }, 140);

  input.addEventListener('input', () => {
    delete input.dataset.uid;
    search();
  });

  input.addEventListener('keydown', (event) => {
    if (list.classList.contains('hidden')) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activeIndex = Math.min(items.length - 1, activeIndex + 1);
      render();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      activeIndex = Math.max(0, activeIndex - 1);
      render();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      pick(activeIndex);
    } else if (event.key === 'Escape') {
      hide();
    }
  });

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-user-index]');
    if (!button) return;
    pick(Number(button.dataset.userIndex));
  });

  document.addEventListener('click', (event) => {
    if (event.target !== input && !list.contains(event.target)) hide();
  });
}

async function resolveStreakUserId() {
  const input = $('#tournamentStreakUser');
  const raw = input?.value?.trim() || '';
  const picked = input?.dataset?.uid || '';

  if (/^\d+$/.test(picked)) return picked;
  if (/^\d+$/.test(raw)) return raw;
  if (!raw) return '';

  const suggestions = await fetchUserSuggestions(raw);
  const first = suggestions[0];
  if (!first) return '';

  input.value = first.label;
  input.dataset.uid = first.id;
  return first.id;
}

function setUrlSection(section) {
  const url = new URL(window.location);
  url.searchParams.set('section', section);
  history.replaceState(null, '', url);
}

function initTournamentTabs() {
  const tabsContainer = $('#tournamentTabs');
  const highlight = $('#tournamentTabsHighlight');
  if (!tabsContainer || !highlight) return null;

  const buttons = Array.from(tabsContainer.querySelectorAll('.tab-btn'));
  if (!buttons.length) return null;

  Object.assign(highlight.style, {
    position: 'absolute',
    top: '2px',
    bottom: '2px',
    left: '0',
    width: '0',
    borderRadius: '0.625rem',
    background: 'rgba(255,255,255,.92)',
    boxShadow: '0 1px 0 rgba(255,255,255,.16), 0 10px 28px rgba(0,0,0,.18)',
    transform: 'translate3d(0,0,0)',
    transition: 'none',
    willChange: 'transform,width',
    zIndex: '0',
  });

  buttons.forEach((button) => {
    button.style.position = 'relative';
    button.style.zIndex = '1';
    button.style.transition = 'color .16s ease, background-color .16s ease';
  });

  const moveHighlightTo = (button, { animate = true } = {}) => {
    if (!button) return;
    const buttonRect = button.getBoundingClientRect();
    const containerRect = tabsContainer.getBoundingClientRect();
    const left = Math.round(buttonRect.left - containerRect.left);
    const width = Math.round(buttonRect.width);
    const transition = 'transform .28s cubic-bezier(.22,.9,.24,1), width .28s cubic-bezier(.22,.9,.24,1)';

    const apply = () => {
      highlight.style.width = `${Math.max(0, width)}px`;
      highlight.style.transform = `translate3d(${Math.max(0, left)}px,0,0)`;
    };

    if (!animate) {
      highlight.style.transition = 'none';
      apply();
      requestAnimationFrame(() => {
        highlight.style.transition = transition;
      });
      return;
    }

    highlight.style.transition = transition;
    requestAnimationFrame(apply);
  };

  const setActive = (section, { animateHighlight = true } = {}) => {
    const active = buttons.find((button) => button.dataset.section === section) || buttons[0];
    buttons.forEach((button) => {
      const isActive = button === active;
      button.classList.toggle('is-active', isActive);
      button.classList.toggle('dark:text-zinc-900', isActive);
      button.classList.toggle('dark:text-white', !isActive);
      button.classList.toggle('hover:bg-zinc-100', !isActive);
      button.classList.toggle('dark:hover:bg-white/10', !isActive);
    });
    moveHighlightTo(active, { animate: animateHighlight });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => switchSection(button.dataset.section || 'current'));
  });

  state.tabsApi = { setActive, moveHighlightTo, buttons };
  requestAnimationFrame(() => setActive(state.currentSection, { animateHighlight: false }));
  window.addEventListener('resize', () => {
    const active = buttons.find((button) => button.classList.contains('is-active')) || buttons[0];
    moveHighlightTo(active, { animate: false });
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      const active = buttons.find((button) => button.classList.contains('is-active')) || buttons[0];
      moveHighlightTo(active, { animate: false });
    });
  }

  return state.tabsApi;
}

function switchSection(section, { updateUrl = true } = {}) {
  const normalized = ['current', 'leaderboard', 'history'].includes(section) ? section : 'current';
  state.currentSection = normalized;

  $('#panel-tournament-current')?.classList.toggle('hidden', normalized !== 'current');
  $('#panel-tournament-leaderboard')?.classList.toggle('hidden', normalized !== 'leaderboard');
  $('#panel-tournament-history')?.classList.toggle('hidden', normalized !== 'history');
  state.tabsApi?.setActive(normalized, { animateHighlight: true });

  if (updateUrl) setUrlSection(normalized);
  if (normalized === 'leaderboard') void renderLeaderboard({ silent: true });
  if (normalized === 'history') void renderArchives({ silent: true });
}

function renderEdition() {
  if (!state.edition) {
    setText('tournamentEditionWindow', t('empty.no_active_edition', 'No active edition.'));
    setText('tournamentEditionStatus', '');
    setText('tournamentCountdown', '00:00:00');
    return;
  }

  const start = formatDate(state.edition.started_at);
  const end = formatDate(state.edition.ends_at);
  setText('tournamentEditionWindow', `${start} - ${end}`);
  setText('tournamentEditionStatus', `${t('labels.status', 'Status')}: ${state.edition.status || '...'}`);
  tickCountdown();
}

function closeTournamentSelects(except = null) {
  document.querySelectorAll('[data-tournament-select]').forEach((root) => {
    if (root === except) return;
    root.querySelector('[data-select-menu]')?.classList.add('hidden');
    root.querySelector('[data-select-button]')?.setAttribute('aria-expanded', 'false');
  });
}

function renderSelectOptions(root) {
  if (!root) return;
  const label = root.querySelector('[data-select-label]');
  const menu = root.querySelector('[data-select-menu]');
  if (!label || !menu) return;

  if (!state.categories.length) {
    root.dataset.value = '';
    label.textContent = t('empty.loading', 'Loading tournaments...');
    menu.innerHTML = '';
    return;
  }

  const selected = state.categories.find((category) => String(category.id) === String(state.selectedCategoryId)) || state.categories[0];
  root.dataset.value = String(selected.id);
  label.textContent = selected.name || `#${selected.id}`;

  menu.innerHTML = state.categories
    .map(
      (category) => {
        const isSelected = String(category.id) === String(state.selectedCategoryId);
        return `
          <button
            type="button"
            data-select-option="${esc(category.id)}"
            class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
              isSelected
                ? 'bg-emerald-500/10 font-semibold text-emerald-800 dark:text-emerald-200'
                : 'text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-white/10'
            }"
          >
            <span class="truncate">${esc(category.name)}</span>
            ${isSelected ? '<span class="h-2 w-2 rounded-full bg-emerald-500"></span>' : ''}
          </button>
        `;
      }
    )
    .join('');
}

function renderCategories() {
  const chips = $('#tournamentCategoryChips');
  const selects = [
    $('#tournamentCategorySelect'),
    $('#tournamentLeaderboardCategorySelect'),
    $('#tournamentArchiveCategorySelect'),
  ];

  if (!state.categories.length) {
    selects.forEach(renderSelectOptions);
    if (chips) {
      chips.innerHTML = `<span class="text-sm text-zinc-500 dark:text-zinc-400">${esc(t('messages.request_failed', 'Unable to load tournament data.'))}</span>`;
    }
    return;
  }

  if (!state.selectedCategoryId || !state.categories.some((item) => String(item.id) === String(state.selectedCategoryId))) {
    state.selectedCategoryId = String(state.categories[0].id);
  }

  selects.forEach(renderSelectOptions);

  if (!chips) return;
  chips.innerHTML = state.categories
    .map((category) => {
      const difficulties = Array.isArray(category.difficulties) ? category.difficulties.join(', ') : '';
      const selected = String(category.id) === String(state.selectedCategoryId);
      return `
        <button
          type="button"
          data-category-id="${esc(category.id)}"
          class="rounded-lg border px-2.5 py-1.5 text-left text-xs transition ${
            selected
              ? 'border-emerald-500/40 bg-emerald-500/10'
              : 'border-zinc-200/80 bg-white/60 hover:bg-white dark:border-white/10 dark:bg-zinc-950/40 dark:hover:bg-white/10'
          }"
        >
          <span class="block font-semibold">${esc(category.name)}</span>
          <span class="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">${esc(difficulties || '...')}</span>
        </button>
      `;
    })
    .join('');
}

function renderActiveCycles() {
  const root = $('#tournamentActiveCycles');
  if (!root) return;

  if (!state.categories.length) {
    root.innerHTML = `<div class="rounded-xl border border-zinc-200/80 bg-zinc-100 p-3 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">${esc(t('empty.loading', 'Loading tournaments...'))}</div>`;
    return;
  }

  root.innerHTML = state.categories
    .map((category) => {
      const cycle = state.activeCycles.get(String(category.id));
      const isSelected = String(category.id) === String(state.selectedCategoryId);

      if (!cycle) {
        return `
          <article class="rounded-xl border ${isSelected ? 'border-emerald-500/40' : 'border-zinc-200/80 dark:border-white/10'} bg-zinc-100 p-3 dark:bg-white/5">
            <div class="flex items-center justify-between gap-2">
              <h3 class="text-sm font-semibold">${esc(category.name)}</h3>
              ${statusPill(category.is_active ? 'active' : 'inactive')}
            </div>
            <p class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">${esc(t('empty.no_active_cycle', 'No active cycle for this category.'))}</p>
          </article>
        `;
      }

      return `
        <article class="rounded-xl border ${isSelected ? 'border-emerald-500/40 ring-1 ring-emerald-400/20' : 'border-zinc-200/80 dark:border-white/10'} bg-zinc-100 p-3 dark:bg-white/5">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <h3 class="truncate text-sm font-semibold">${esc(category.name)}</h3>
              <p class="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">${esc(cycle.map_difficulty || '')}</p>
            </div>
            ${statusPill(cycle.status)}
          </div>
          <div class="mt-2 flex items-end justify-between gap-2">
            <div class="min-w-0">
              <div class="truncate text-base font-black">${esc(cycle.map_name || 'Unknown map')}</div>
              <button
                type="button"
                data-copy-map-code="${esc(cycle.map_code || '')}"
                class="mt-1 inline-flex cursor-pointer rounded-md border border-zinc-200/80 bg-white/70 px-1.5 py-0.5 font-mono text-xs transition hover:bg-white dark:border-white/10 dark:bg-zinc-950/50 dark:hover:bg-white/10"
                title="Copy map code"
              >
                ${esc(cycle.map_code || '...')}
              </button>
            </div>
            <button
              type="button"
              data-view-leaderboard="${esc(category.id)}"
              class="shrink-0 cursor-pointer rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 transition hover:bg-zinc-100"
            >
              ${esc(t('buttons.view_leaderboard', 'View leaderboard'))}
            </button>
          </div>
        </article>
      `;
    })
    .join('');
}

function readAvatarCache() {
  try {
    const cache = JSON.parse(localStorage.getItem(AVATAR_CACHE_KEY) || '{}');
    return cache && typeof cache === 'object' ? cache : {};
  } catch {
    return {};
  }
}

function writeAvatarCache(cache) {
  try {
    localStorage.setItem(AVATAR_CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

function defaultAvatarForId(id) {
  const digits = String(id || '').replace(/\D/g, '');
  if (!digits) return 'https://cdn.discordapp.com/embed/avatars/0.png?size=64';
  try {
    return `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(digits) % 5n)}.png?size=64`;
  } catch {
    return `https://cdn.discordapp.com/embed/avatars/${Number(digits.slice(-1)) % 5}.png?size=64`;
  }
}

function ensureAvatarSize(url) {
  const value = String(url || '').trim();
  if (!value) return '';
  if (!value.includes('cdn.discordapp.com')) return value;
  return value.replace(/\?size=\d+$/i, '') + '?size=64';
}

async function hydrateTopAvatars(root = document) {
  const images = Array.from(root.querySelectorAll('[data-tournament-avatar][data-user-id]'));
  const ids = [...new Set(images.map((img) => String(img.dataset.userId || '').replace(/\D/g, '')).filter(Boolean))];
  if (!ids.length) return;

  const cache = readAvatarCache();
  const now = Date.now();
  const urls = {};
  const missing = [];

  ids.forEach((id) => {
    const cached = cache[id];
    const cachedAt = Number(cached?.ts || cached?.at || 0);
    if (cached?.url && cachedAt + AVATAR_CACHE_TTL > now) {
      urls[id] = cached.url;
    } else {
      missing.push(id);
    }
  });

  if (missing.length) {
    try {
      const url = new URL('/api/settings/user-avatar', window.location.origin);
      url.searchParams.set('user_id', missing.join(','));
      const response = await fetch(url.toString(), {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store',
      });
      const data = response.ok ? await response.json().catch(() => null) : null;

      missing.forEach((id) => {
        const entry = data?.[id] || (String(data?.user_id) === id ? data : null);
        const avatarUrl = ensureAvatarSize(entry?.avatar_url) || defaultAvatarForId(id);
        urls[id] = avatarUrl;
        cache[id] = { url: avatarUrl, ts: now };
      });

      writeAvatarCache(cache);
    } catch {
      missing.forEach((id) => {
        urls[id] = defaultAvatarForId(id);
      });
    }
  }

  images.forEach((img) => {
    const id = String(img.dataset.userId || '').replace(/\D/g, '');
    img.src = urls[id] || defaultAvatarForId(id);
  });
}

function podiumSkin(rank) {
  if (Number(rank) === 1) {
    return {
      card: 'border-amber-400/50 bg-amber-500/10 shadow-[0_0_40px_rgba(245,158,11,0.22)]',
      badge: 'border-amber-300/60 bg-amber-300/20 text-amber-900 dark:text-amber-100',
      avatar: 'ring-amber-300/60',
      time: 'text-amber-700 dark:text-amber-200',
      size: 'top',
    };
  }
  if (Number(rank) === 2) {
    return {
      card: 'border-slate-300/60 bg-slate-400/10 shadow-[0_0_30px_rgba(148,163,184,0.18)]',
      badge: 'border-slate-300/70 bg-slate-300/20 text-slate-800 dark:text-slate-100',
      avatar: 'ring-slate-300/60',
      time: 'text-slate-700 dark:text-slate-200',
      size: 'mid',
    };
  }
  if (Number(rank) === 3) {
    return {
      card: 'border-orange-400/50 bg-orange-500/10 shadow-[0_0_30px_rgba(249,115,22,0.18)]',
      badge: 'border-orange-300/60 bg-orange-300/20 text-orange-900 dark:text-orange-100',
      avatar: 'ring-orange-300/60',
      time: 'text-orange-700 dark:text-orange-200',
      size: 'mid',
    };
  }
  return {
    card: 'border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_24px_rgba(34,211,238,0.10)]',
    badge: 'border-cyan-300/50 bg-cyan-300/15 text-cyan-800 dark:text-cyan-100',
    avatar: 'ring-cyan-300/50',
    time: 'text-cyan-700 dark:text-cyan-200',
    size: 'small',
  };
}

function topCard(entry, index) {
  const rank = Number(entry.rank || index + 1);
  const skin = podiumSkin(rank);
  const userId = entry.user_id || '';
  const name = entry.name || userId || 'Unknown';
  const sizeClasses =
    skin.size === 'top'
      ? 'min-h-[178px] p-5 sm:p-6'
      : skin.size === 'mid'
        ? 'min-h-[150px] p-4 sm:p-5'
        : 'min-h-[124px] p-4';
  const avatarSize = skin.size === 'top' ? 'h-24 w-24 sm:h-28 sm:w-28' : skin.size === 'mid' ? 'h-20 w-20' : 'h-16 w-16';
  const titleSize = skin.size === 'top' ? 'text-3xl sm:text-5xl' : skin.size === 'mid' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl';
  const timeSize = skin.size === 'top' ? 'text-3xl sm:text-5xl' : skin.size === 'mid' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl';
  const colSpan = skin.size === 'top' ? 'lg:col-span-12' : 'lg:col-span-6';
  const medalUrl = MEDAL_URLS[rank] || '';
  const medalSize = skin.size === 'top' ? 'h-6 w-6' : 'h-5 w-5';

  return `
    <article class="${colSpan} relative overflow-hidden rounded-2xl border ${skin.card} ${sizeClasses}">
      <div class="absolute right-4 top-4 inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-xs font-black uppercase tracking-wide ${skin.badge}">
        ${medalUrl ? `<img src="${esc(medalUrl)}" alt="" class="${medalSize} object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)]" loading="lazy" decoding="async" />` : ''}
        Top ${esc(rank)}
      </div>
      <div class="flex h-full items-center gap-4 sm:gap-5">
        <a
          href="/rank_card?user_id=${encodeURIComponent(userId)}"
          class="${avatarSize} shrink-0 overflow-hidden rounded-2xl bg-white/70 ring-2 ${skin.avatar} dark:bg-zinc-950/60"
          aria-label="${esc(name)}"
        >
          <img
            src="${esc(defaultAvatarForId(userId))}"
            alt="${esc(name)}"
            width="112"
            height="112"
            class="h-full w-full object-cover"
            decoding="async"
            data-tournament-avatar
            data-user-id="${esc(userId)}"
          />
        </a>
        <div class="min-w-0 flex-1 pt-8 sm:pt-7">
          <a
            href="/rank_card?user_id=${encodeURIComponent(userId)}"
            class="block truncate ${titleSize} font-black uppercase leading-none tracking-normal hover:text-emerald-500"
          >
            ${esc(name)}
          </a>
          <div class="mt-4 flex items-end justify-between gap-4 border-t border-zinc-200/70 pt-3 dark:border-white/10">
            <span class="text-xs font-black uppercase ${skin.time}">${esc(t('table.time', 'Time'))} :</span>
            <span class="${timeSize} text-right font-black leading-none tabular-nums ${skin.time}">${esc(formatTime(entry.time, { unit: false }))}</span>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderTopFive() {
  const root = $('#tournamentTopFive');
  const meta = $('#tournamentTopMeta');
  if (!root) return;

  const cycle = selectedCycle();
  if (!cycle) {
    if (meta) meta.textContent = '';
    root.innerHTML = `<div class="rounded-2xl border border-zinc-200/80 bg-zinc-100 p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">${esc(t('empty.no_active_cycle', 'No active cycle for this category.'))}</div>`;
    return;
  }

  if (meta) {
    const details = [categoryName(cycle.category_id || state.selectedCategoryId), cycle.map_name, cycle.map_code ? `#${cycle.map_code}` : ''].filter(Boolean);
    meta.textContent = details.join(' / ');
  }

  if (state.leaderboardLoading) {
    root.innerHTML = `
      <div class="grid gap-4 lg:grid-cols-12">
        ${Array.from({ length: 5 })
          .map(
            (_, index) => `
              <div class="${index === 0 ? 'lg:col-span-12 min-h-[178px]' : 'lg:col-span-6 min-h-[136px]'} animate-pulse rounded-2xl border border-zinc-200/80 bg-zinc-100 dark:border-white/10 dark:bg-white/5"></div>
            `
          )
          .join('')}
      </div>
    `;
    return;
  }

  const entries = [...state.leaderboardEntries]
    .sort((a, b) => Number(a.rank || 9999) - Number(b.rank || 9999))
    .slice(0, 5);

  if (!entries.length) {
    root.innerHTML = `<div class="rounded-2xl border border-zinc-200/80 bg-zinc-100 p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">${esc(t('empty.no_top', 'No player has entered this tournament yet.'))}</div>`;
    return;
  }

  root.innerHTML = `<div class="grid gap-4 lg:grid-cols-12">${entries.map(topCard).join('')}</div>`;
  void hydrateTopAvatars(root);
}

async function renderLeaderboard({ silent = false } = {}) {
  const rows = $('#tournamentLeaderboardRows');
  const meta = $('#tournamentLeaderboardMeta');
  if (!rows) return;

  const cycle = selectedCycle();
  if (!cycle) {
    state.leaderboardEntries = [];
    state.leaderboardCycleId = null;
    rows.innerHTML = `<tr><td colspan="5" class="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">${esc(t('messages.select_category', 'Select a category to view its leaderboard.'))}</td></tr>`;
    if (meta) meta.textContent = '';
    renderTopFive();
    return;
  }

  const requestSeq = ++state.leaderboardRequestSeq;
  const canKeepExisting =
    silent &&
    String(state.leaderboardCycleId || '') === String(cycle.id) &&
    rows.children.length > 0;

  state.leaderboardLoading = !canKeepExisting;
  if (meta) meta.textContent = `${cycle.map_code || ''} / ${cycle.map_name || ''}`;
  if (!canKeepExisting) {
    rows.innerHTML = tableSkeletonRows(5, 7);
  }
  renderTopFive();

  const response = await api(`/cycles/${encodeURIComponent(cycle.id)}/leaderboard`);
  if (requestSeq !== state.leaderboardRequestSeq) return;

  state.leaderboardLoading = false;
  state.leaderboardCycleId = cycle.id;

  if (!response.ok || !Array.isArray(response.data) || !response.data.length) {
    if (!response.ok && canKeepExisting) {
      return;
    }
    if (silent && canKeepExisting && state.leaderboardHash === '[]') {
      return;
    }
    state.leaderboardEntries = [];
    state.leaderboardHash = '[]';
    rows.innerHTML = `<tr><td colspan="5" class="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">${esc(t('empty.no_leaderboard', 'No leaderboard entries yet.'))}</td></tr>`;
    renderTopFive();
    return;
  }

  const nextHash = JSON.stringify(response.data);
  if (silent && canKeepExisting && nextHash === state.leaderboardHash) {
    return;
  }

  state.leaderboardEntries = response.data;
  state.leaderboardHash = nextHash;
  rows.innerHTML = response.data
    .map(
      (entry) => `
        <tr class="border-t border-zinc-200/80 dark:border-white/10">
          <td class="px-4 py-3 font-mono">${esc(entry.rank)}</td>
          <td class="px-4 py-3">
            <a class="font-semibold hover:text-emerald-500" href="/rank_card?user_id=${encodeURIComponent(entry.user_id)}">${esc(entry.name || entry.user_id)}</a>
          </td>
          <td class="px-4 py-3 font-mono">${esc(formatTime(entry.time))}</td>
          <td class="px-4 py-3">${entry.verified ? 'Yes' : 'No'}</td>
          <td class="px-4 py-3">${entry.completion ? 'Yes' : 'No'}</td>
        </tr>
      `
    )
    .join('');

  renderTopFive();
}

async function renderArchives({ silent = false } = {}) {
  const rows = $('#tournamentArchiveRows');
  const meta = $('#tournamentArchiveMeta');
  if (!rows) return;

  const requestSeq = ++state.archiveRequestSeq;
  const archiveKey = `${state.selectedCategoryId || ''}:${state.archiveOffset}`;
  const canKeepExisting = silent && state.archiveKey === archiveKey && rows.children.length > 0;
  if (!canKeepExisting) {
    rows.innerHTML = tableSkeletonRows(5, 7);
  }

  const response = await api('/cycles', {
    status: 'completed',
    category_id: state.selectedCategoryId,
    limit: ARCHIVE_LIMIT,
    offset: state.archiveOffset,
  });

  if (requestSeq !== state.archiveRequestSeq) return;

  const cycles = Array.isArray(response.data?.cycles) ? response.data.cycles : [];
  const total = Number(response.data?.total || 0);

  if (!response.ok || !cycles.length) {
    if (!response.ok && canKeepExisting) return;
    if (silent && canKeepExisting && state.archiveHash === '[]') return;
    state.archiveCycles = [];
    state.archiveKey = archiveKey;
    state.archiveHash = '[]';
    state.archiveTotal = total;
    rows.innerHTML = `<tr><td colspan="5" class="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">${esc(t('empty.no_archives', 'No completed cycles yet.'))}</td></tr>`;
  } else {
    const nextHash = JSON.stringify(cycles);
    if (silent && canKeepExisting && nextHash === state.archiveHash) {
      state.archiveTotal = total;
      if (meta) {
        const start = total ? state.archiveOffset + 1 : 0;
        const end = Math.min(state.archiveOffset + ARCHIVE_LIMIT, total);
        meta.textContent = `${start}-${end} / ${total}`;
      }
      const prev = $('#tournamentArchivePrev');
      const next = $('#tournamentArchiveNext');
      if (prev) prev.disabled = state.archiveOffset <= 0;
      if (next) next.disabled = state.archiveOffset + ARCHIVE_LIMIT >= total;
      return;
    }

    state.archiveCycles = cycles;
    state.archiveKey = archiveKey;
    state.archiveHash = nextHash;
    state.archiveTotal = total;
    rows.innerHTML = cycles
      .map(
        (cycle) => `
          <tr class="border-t border-zinc-200/80 dark:border-white/10">
            <td class="px-4 py-3">
              <div class="font-semibold">${esc(cycle.map_name || 'Unknown map')}</div>
              <div class="font-mono text-xs text-zinc-500 dark:text-zinc-400">${esc(cycle.map_code || '')}</div>
            </td>
            <td class="px-4 py-3">${esc(categoryName(cycle.category_id))}</td>
            <td class="px-4 py-3">${cycle.winner_user_id ? `<a class="font-semibold hover:text-emerald-500" href="/rank_card?user_id=${encodeURIComponent(cycle.winner_user_id)}">${esc(cycle.winner_name || cycle.winner_user_id)}</a>` : '-'}</td>
            <td class="px-4 py-3">${esc(formatDate(cycle.ended_at))}</td>
            <td class="px-4 py-3 text-right">
              <button
                type="button"
                data-view-cycle="${esc(cycle.id)}"
                class="cursor-pointer rounded-lg border border-zinc-200/80 bg-white/80 px-3 py-1.5 text-xs font-semibold text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                ${esc(t('buttons.view', 'View'))}
              </button>
            </td>
          </tr>
        `
      )
      .join('');
  }

  if (meta) {
    const start = total ? state.archiveOffset + 1 : 0;
    const end = Math.min(state.archiveOffset + ARCHIVE_LIMIT, total);
    meta.textContent = `${start}-${end} / ${total}`;
  }

  const prev = $('#tournamentArchivePrev');
  const next = $('#tournamentArchiveNext');
  if (prev) prev.disabled = state.archiveOffset <= 0;
  if (next) next.disabled = state.archiveOffset + ARCHIVE_LIMIT >= total;
}

function findArchiveCycle(cycleId) {
  return state.archiveCycles.find((cycle) => String(cycle.id) === String(cycleId)) || null;
}

function closeHistoryModal() {
  $('#tournamentHistoryModal')?.classList.add('hidden');
}

async function openHistoryModal(cycleId) {
  const modal = $('#tournamentHistoryModal');
  const rows = $('#tournamentHistoryModalRows');
  const title = $('#tournamentHistoryModalTitle');
  const meta = $('#tournamentHistoryModalMeta');
  if (!modal || !rows) return;

  const cycle = findArchiveCycle(cycleId);
  if (title) title.textContent = cycle?.map_name || t('labels.participation_history', 'Participation history');
  if (meta) {
    const parts = [
      cycle?.map_code ? `#${cycle.map_code}` : '',
      cycle?.category_id ? categoryName(cycle.category_id) : '',
      cycle?.ended_at ? formatDate(cycle.ended_at) : '',
    ].filter(Boolean);
    meta.textContent = parts.join(' / ');
  }

  modal.classList.remove('hidden');
  rows.innerHTML = tableSkeletonRows(5, 7);

  const requestSeq = ++state.historyRequestSeq;
  const response = await api(`/cycles/${encodeURIComponent(cycleId)}/leaderboard`);
  if (requestSeq !== state.historyRequestSeq) return;

  const entries = response.ok && Array.isArray(response.data) ? response.data : [];
  if (!entries.length) {
    rows.innerHTML = `<tr><td colspan="5" class="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">${esc(t('empty.no_participants', 'No participant details for this tournament.'))}</td></tr>`;
    return;
  }

  rows.innerHTML = entries
    .map(
      (entry) => `
        <tr class="border-t border-zinc-200/80 dark:border-white/10">
          <td class="px-4 py-3 font-mono">${esc(entry.rank)}</td>
          <td class="px-4 py-3">
            <a class="font-semibold hover:text-emerald-500" href="/rank_card?user_id=${encodeURIComponent(entry.user_id)}">${esc(entry.name || entry.user_id)}</a>
            <div class="mt-0.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">${esc(entry.user_id || '')}</div>
          </td>
          <td class="px-4 py-3 font-mono">${esc(formatTime(entry.time))}</td>
          <td class="px-4 py-3">${entry.verified ? 'Yes' : 'No'}</td>
          <td class="px-4 py-3">${entry.completion ? 'Yes' : 'No'}</td>
        </tr>
      `
    )
    .join('');
}

async function loadStreak(userId) {
  const root = $('#tournamentStreakResult');
  if (!root || !userId) return;
  root.textContent = t('empty.loading', 'Loading tournaments...');
  const response = await api(`/streaks/${encodeURIComponent(userId)}`);

  if (response.status === 404) {
    root.textContent = t('empty.no_streak', 'No streak yet.');
    return;
  }

  if (!response.ok || !response.data) {
    root.textContent = t('messages.request_failed', 'Unable to load tournament data.');
    return;
  }

  root.innerHTML = `
    <dl class="grid grid-cols-2 gap-3">
      <div>
        <dt class="text-xs text-zinc-500 dark:text-zinc-400">Current</dt>
        <dd class="text-lg font-black">${esc(response.data.current_streak ?? 0)}</dd>
      </div>
      <div>
        <dt class="text-xs text-zinc-500 dark:text-zinc-400">Max</dt>
        <dd class="text-lg font-black">${esc(response.data.max_streak ?? 0)}</dd>
      </div>
      <div class="col-span-2 text-xs text-zinc-500 dark:text-zinc-400">
        Last cycle: ${esc(response.data.last_cycle_id ?? '-')}
      </div>
    </dl>
  `;
}

function tickCountdown() {
  const target = state.edition?.ends_at ? new Date(state.edition.ends_at).getTime() : NaN;
  setText('tournamentCountdown', formatCountdown(target - Date.now()));
}

function startCountdown() {
  clearInterval(state.countdownTimer);
  state.countdownTimer = setInterval(tickCountdown, 1000);
  tickCountdown();
}

async function loadActiveCycles() {
  const pairs = await Promise.all(
    state.categories.map(async (category) => {
      const response = await api('/cycles', {
        status: 'active',
        category_id: category.id,
        limit: 1,
      });
      const cycle = response.ok && Array.isArray(response.data?.cycles) ? response.data.cycles[0] : null;
      return [String(category.id), cycle || null];
    })
  );

  state.activeCycles = new Map(pairs.filter(([, cycle]) => cycle));
}

async function loadAll({ keepArchive = false, silent = false } = {}) {
  const [categories, edition] = await Promise.all([
    api('/categories'),
    api('/editions/active'),
  ]);

  state.categories = categories.ok && Array.isArray(categories.data) ? categories.data : [];
  state.edition = edition.ok ? edition.data : null;

  if (!keepArchive) state.archiveOffset = 0;

  await loadActiveCycles();

  renderEdition();
  renderCategories();
  renderActiveCycles();
  await Promise.all([renderLeaderboard({ silent }), renderArchives({ silent })]);
  startCountdown();
}

function handleCategoryChange(value) {
  state.selectedCategoryId = value || '';
  state.archiveOffset = 0;
  state.leaderboardEntries = [];
  state.leaderboardCycleId = null;
  state.leaderboardHash = '';
  state.archiveKey = '';
  state.archiveHash = '';
  renderCategories();
  renderActiveCycles();
  void Promise.all([renderLeaderboard(), renderArchives()]);
}

function bindCategorySelect(selector) {
  const root = $(selector);
  if (!root || root.dataset.bound === '1') return;
  root.dataset.bound = '1';

  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-select-button]');
    const option = event.target.closest('[data-select-option]');

    if (button) {
      const menu = root.querySelector('[data-select-menu]');
      const isOpening = menu?.classList.contains('hidden');
      closeTournamentSelects(root);
      menu?.classList.toggle('hidden', !isOpening);
      button.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
      return;
    }

    if (option) {
      const value = option.dataset.selectOption || '';
      closeTournamentSelects();
      handleCategoryChange(value);
    }
  });
}

function bindEvents() {
  $('#tournamentRefresh')?.addEventListener('click', () => loadAll({ keepArchive: true }));
  $('#tournamentOpenLeaderboard')?.addEventListener('click', () => switchSection('leaderboard'));

  bindCategorySelect('#tournamentCategorySelect');
  bindCategorySelect('#tournamentLeaderboardCategorySelect');
  bindCategorySelect('#tournamentArchiveCategorySelect');

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-tournament-select]')) closeTournamentSelects();
  });

  $('#tournamentCategoryChips')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category-id]');
    if (!button) return;
    handleCategoryChange(button.dataset.categoryId || '');
  });

  $('#tournamentActiveCycles')?.addEventListener('click', (event) => {
    const copyButton = event.target.closest('[data-copy-map-code]');
    if (copyButton) {
      void copyMapCode(copyButton.dataset.copyMapCode || '');
      return;
    }

    const button = event.target.closest('[data-view-leaderboard]');
    if (!button) return;
    state.selectedCategoryId = button.dataset.viewLeaderboard || '';
    state.archiveOffset = 0;
    state.leaderboardEntries = [];
    state.leaderboardCycleId = null;
    state.leaderboardHash = '';
    state.archiveKey = '';
    state.archiveHash = '';
    renderCategories();
    renderActiveCycles();
    switchSection('leaderboard');
  });

  $('#tournamentArchivePrev')?.addEventListener('click', () => {
    state.archiveOffset = Math.max(0, state.archiveOffset - ARCHIVE_LIMIT);
    void renderArchives();
  });

  $('#tournamentArchiveNext')?.addEventListener('click', () => {
    state.archiveOffset += ARCHIVE_LIMIT;
    void renderArchives();
  });

  $('#tournamentArchiveRows')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-view-cycle]');
    if (!button) return;
    void openHistoryModal(button.dataset.viewCycle || '');
  });

  $('#tournamentHistoryModalClose')?.addEventListener('click', closeHistoryModal);
  $('#tournamentHistoryModal')?.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) closeHistoryModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeTournamentSelects();
    if (event.key === 'Escape' && !$('#tournamentHistoryModal')?.classList.contains('hidden')) {
      closeHistoryModal();
    }
  });

  $('#tournamentStreakForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const userId = await resolveStreakUserId();
    if (!userId) {
      setStreakMessage(t('messages.select_user', 'Select a player from the suggestions or enter a valid user ID.'), 'error');
      return;
    }
    void loadStreak(userId);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void loadAll({ keepArchive: true, silent: true });
  });

  window.addEventListener('focus', () => void loadAll({ keepArchive: true, silent: true }));
}

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const rawSection = (urlParams.get('section') || '').toLowerCase();
  state.currentSection = ['current', 'leaderboard', 'history'].includes(rawSection) ? rawSection : 'current';

  initTournamentTabs();
  switchSection(state.currentSection, { updateUrl: false });
  wireStreakAutocomplete();
  bindEvents();
  void loadAll();

  state.pollTimer = setInterval(() => {
    void loadAll({ keepArchive: true, silent: true });
  }, POLL_MS);
});
