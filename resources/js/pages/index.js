(() => {
  const card = document.getElementById('topMapsCard');
  if (!card) return;

  const toAbs = (u) => {
    try {
      const url = new URL(u, window.location.origin);
      if (url.hostname === window.location.hostname && url.protocol !== window.location.protocol) {
        return `${window.location.origin}${url.pathname}${url.search}${url.hash}`;
      }
      return url.toString();
    } catch {
      return u;
    }
  };

  const endpoint     = toAbs(card.dataset.endpoint);
  const fullEndpoint = toAbs(card.dataset.fullEndpoint || `${card.dataset.endpoint}`.replace(/limit=\d+/, 'limit=25'));
  const mapEndpoint  = toAbs(card.dataset.mapEndpoint);

  const translations = (window.INDEX_I18N && typeof window.INDEX_I18N === 'object') ? window.INDEX_I18N : {};

  /* ---------------- I18N helpers ---------------- */
  function t(path, params = {}) {
    const parts = String(path).split('.');
    let out = translations;
    for (const p of parts) out = out?.[p];
    if (typeof out !== 'string') out = path;
    for (const [k, v] of Object.entries(params)) {
      const val = String(v ?? '');
      out = out.replaceAll(`{${k}}`, val).replaceAll(`:${k}`, val);
    }
    return out;
  }

  const tOr = (path, fallback) => {
    const v = t(path);
    return v === path ? fallback : v;
  };

  const playLabel        = tOr('top_maps.play',              card.dataset.playLabel || 'Play');
  const copiedLabel      = tOr('top_maps.copied',            card.dataset.copiedLabel || 'Copied ✓');
  const scoreLabel       = tOr('top_maps.score',             card.dataset.scoreLabel || 'score');
  const completionsLabel = tOr('top_maps.completions',       card.dataset.completionsLabel || 'completions');
  const upvotesLabel     = tOr('top_maps.upvotes',           card.dataset.upvotesLabel || 'upvotes');
  const copyCodeLabel    = tOr('actions.copy_code',          card.dataset.copyCodeLabel || 'Copy code');

  const D_overview       = tOr('details.overview',    'Overview');
  const D_category       = tOr('details.category',    'Category');
  const D_difficulty     = tOr('details.difficulty',  'Difficulty');
  const D_checkpoints    = tOr('details.checkpoints', 'Checkpoints');
  const D_official       = tOr('details.official',    'Official');
  const D_yes            = tOr('details.yes',         'Yes');
  const D_no             = tOr('details.no',          'No');
  const D_playtesting    = tOr('details.playtesting', 'Playtesting');
  const D_mechanics      = tOr('details.mechanics',   'Mechanics');
  const D_restrictions   = tOr('details.restrictions','Restrictions');
  const D_creators       = tOr('details.creators',    'Creators');

  const listEl       = document.getElementById('topMapsList');
  const skeletonEl   = document.getElementById('topMapsSkeleton');
  const errorEl      = document.getElementById('topMapsError');

  const openBtn      = document.getElementById('openTrendingModal');
  const trendingModal= document.getElementById('trendingModal');
  const closeBtn     = document.getElementById('closeTrendingModal');
  const modalListEl  = document.getElementById('trendingModalList');
  const modalSkeleton= document.getElementById('trendingModalSkeleton');
  const modalError   = document.getElementById('trendingModalError');

  const mapModal     = document.getElementById('mapDetailModal');
  const mapCloseBtn  = document.getElementById('closeMapDetailModal');
  const mapContentEl = document.getElementById('mapDetailContent');
  const mapSkeleton  = document.getElementById('mapDetailSkeleton');
  const mapError     = document.getElementById('mapDetailError');

  const fmt2 = (n) => (typeof n === 'number' ? (Math.round(n * 100) / 100).toFixed(2) : '0.00');
  const esc  = (s) => String(s ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  /* ---------------- Copy log helpers ---------------- */
  let __myIpCache = { value: null, at: 0 };

  async function getClientIp(force = false) {
    const now = Date.now();
    if (!force && __myIpCache.value && now - __myIpCache.at < 5 * 60 * 1000) {
      return __myIpCache.value;
    }
    try {
      const res = await fetch('/api/my-ip', {
        method: 'GET',
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store',
      });
      const json = await res.json().catch(() => ({}));
      const ip = json?.client_ip ?? json?.ip ?? null;
      __myIpCache = { value: ip, at: now };
      return ip;
    } catch {
      return null;
    }
  }

  const normalizeMapCode = (raw) =>
    String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);

  async function logMapCopy(code, source = 'web') {
    try {
      const k = `logcc:${source}:${code}`;
      const now = Date.now();
      const last = Number(sessionStorage.getItem(k) || 0);
      if (now - last < 500) return;
      sessionStorage.setItem(k, String(now));
    } catch {}

    const ip_address = await getClientIp().catch(() => null);
    const payload = {
      code: normalizeMapCode(code),
      ip_address,
      user_id: window.user_id ?? null,
      source,
    };

    try {
      await fetch('/api/utilities/log-map-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-CSRF-TOKEN': CSRF,
        },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
        cache: 'no-store',
      });
    } catch {}
  }

  void getClientIp();

  /* ---------------- Animations / modal helpers ---------------- */
  function toggleModal(modalEl, show) {
    const overlay = modalEl.querySelector('[data-overlay]');
    const panel   = modalEl.querySelector('[data-modal-panel]');
    if (!overlay || !panel) { modalEl.hidden = !show; return; }
    if (show) {
      modalEl.hidden = false;
      requestAnimationFrame(() => {
        overlay.classList.remove('opacity-0');
        panel.classList.remove('opacity-0', 'translate-y-3', 'scale-95');
      });
    } else {
      overlay.classList.add('opacity-0');
      panel.classList.add('opacity-0', 'translate-y-3', 'scale-95');
      panel.addEventListener('transitionend', () => { modalEl.hidden = true; }, { once:true });
    }
  }
  function attachOutsideClose(modalEl) {
    modalEl.addEventListener('mousedown', (ev) => {
      const panel = modalEl.querySelector('[data-modal-panel]');
      if (panel && !panel.contains(ev.target)) toggleModal(modalEl, false);
    });
  }
  attachOutsideClose(trendingModal);
  attachOutsideClose(mapModal);

  /* Helper translate map name */
  function getMapName(m) {
    if (window.currentLang === 'cn' && window.MAPS_DATA) {
      const mapName = m.map_name;

      for (const [key, mapData] of Object.entries(window.MAPS_DATA)) {
        if (mapData && mapData['en-US'] === mapName && mapData['zh-CN']) {
          return mapData['zh-CN'];
        }
      }
    }
    return m.map_name;
  }

  /* ---------------- Renderers ---------------- */
  function renderInto(ul, items) {
    ul.innerHTML = '';
    for (const m of items) {
      const li = document.createElement('li');
      li.className =
        'min-h-[70px] flex items-center justify-between gap-3 rounded-xl border border-white/10 p-3 hover:bg-white/5 transition-colors';

      li.innerHTML = `
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <div class="truncate font-semibold">${esc(getMapName(m))}</div>

            <!-- Code pill cliquable pour copier -->
            <span
              role="button"
              tabindex="0"
              title="${esc(copyCodeLabel)}"
              aria-label="${esc(copyCodeLabel)}"
              class="cursor-pointer select-none shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] leading-none text-zinc-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              data-copy-code="${esc(m.code)}"
            >#${esc(m.code)}</span>
          </div>

          <div class="mt-1 text-xs text-zinc-400">
            ${esc(scoreLabel)} ${fmt2(m.trend_score)} · ${m.completions ?? 0} ${esc(completionsLabel)} · ${m.upvotes ?? 0} ${esc(upvotesLabel)}
          </div>
        </div>

        <button class="h-8 shrink-0 cursor-pointer rounded-lg border border-white/10 px-3 text-xs hover:bg-white/5"
                data-map-code="${esc(m.code)}">${esc(playLabel)}</button>
      `;
      ul.appendChild(li);
    }
  }

  async function loadTop3() {
    try {
      const res = await fetch(endpoint, { headers: { Accept: 'application/json' }, credentials: 'same-origin' });
      if (!res.ok) throw new Error(String(res.status));
      const data  = await res.json();
      renderInto(listEl, Array.isArray(data) ? data.slice(0,3) : []);
    } catch { errorEl.hidden = false; }
    finally { skeletonEl.hidden = true; }
  }

  async function loadAllIntoTrendingModal() {
    modalSkeleton.hidden = false;
    modalError.hidden = true;
    modalListEl.innerHTML = '';
    try {
      const res = await fetch(fullEndpoint, { headers: { Accept: 'application/json' }, credentials: 'same-origin' });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      renderInto(modalListEl, Array.isArray(data) ? data : []);
    } catch { modalError.hidden = false; }
    finally { modalSkeleton.hidden = true; }
  }

  function renderMapDetails(map) {
    const creators = Array.isArray(map.creators) ? map.creators.map(c => c.name).join(', ') : '—';

    const chip = (html) =>
      `<span class="inline-flex items-center rounded-full border border-white/10 bg-white/5/80 backdrop-blur px-2.5 py-1 text-[11px] leading-none text-zinc-200 hover:bg-white/10 transition">${html}</span>`;

    const pillRow = (arr) => (!Array.isArray(arr) || !arr.length)
      ? `<div class="text-xs text-zinc-500">—</div>`
      : `<div class="flex flex-wrap gap-2">${arr.map(x => chip(esc(x))).join('')}</div>`;

    const banner = map.map_banner
      ? `
        <div class="relative w-full h-40 sm:h-48 md:h-56 rounded-2xl overflow-hidden">
          <img
            src="${esc(map.map_banner)}"
            alt="${esc(getMapName(map))}"
            class="absolute inset-0 h-full w-full object-cover rounded-[inherit] [clip-path:inset(0_round_1rem)]"
            loading="lazy"
            decoding="async"
          />
        </div>
      `
      : '';

    const overview = `
      <section class="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h4 class="mb-3 text-xs font-semibold text-zinc-300">${esc(D_overview)}</h4>
        <ul class="divide-y divide-white/5">
          ${map.category   ? `<li class="flex items-center justify-between py-2"><span class="text-xs text-zinc-400">${esc(D_category)}</span><span class="text-sm text-zinc-200">${esc(map.category)}</span></li>` : ''}
          ${map.difficulty ? `<li class="flex items-center justify-between py-2"><span class="text-xs text-zinc-400">${esc(D_difficulty)}</span><span class="text-sm text-zinc-200">${esc(map.difficulty)}</span></li>` : ''}
          <li class="flex items-center justify-between py-2"><span class="text-xs text-zinc-400">${esc(D_checkpoints)}</span><span class="text-sm text-zinc-200">${esc(map.checkpoints ?? 0)}</span></li>
          ${map.official !== undefined ? `<li class="flex items-center justify-between py-2"><span class="text-xs text-zinc-400">${esc(D_official)}</span><span class="text-sm text-zinc-200">${map.official ? esc(D_yes) : esc(D_no)}</span></li>` : ''}
          ${map.playtesting ? `<li class="flex items-center justify-between py-2"><span class="text-xs text-zinc-400">${esc(D_playtesting)}</span><span class="text-sm text-zinc-200">${esc(map.playtesting)}</span></li>` : ''}
        </ul>
      </section>`;

    const techs = `
      <section class="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div class="grid gap-6 sm:grid-cols-2">
          <div>
            <h4 class="mb-2 text-xs font-semibold text-zinc-300">${esc(D_mechanics)}</h4>
            ${pillRow(map.mechanics)}
          </div>
          <div>
            <h4 class="mb-2 text-xs font-semibold text-zinc-300">${esc(D_restrictions)}</h4>
            ${pillRow(map.restrictions)}
          </div>
        </div>
      </section>`;

    const sidePanel = `
      <aside class="space-y-4 lg:sticky lg:top-6">
        <section class="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h4 class="mb-2 text-xs font-semibold text-zinc-300">${esc(D_creators)}</h4>
          <p class="text-xs text-zinc-200">${esc(creators)}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <button
              class="rounded-lg cursor-pointer bg-white text-zinc-900 px-3 py-1 text-xs font-medium hover:bg-zinc-100"
              data-copy-code="${esc(map.code ?? '')}">
              ${esc(copyCodeLabel)}
            </button>
          </div>
        </section>
      </aside>`;

    mapContentEl.innerHTML = `
      <div class="mb-4">
        <h2 class="text-2xl font-bold text-white">${esc(getMapName(map))}</h2>
      </div>
      <div class="space-y-6">
        ${banner}
        <div class="grid gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2 space-y-6">
            ${overview}
            ${techs}
          </div>
          ${sidePanel}
        </div>
      </div>
    `;
  }

  async function openMapDetail(code) {
    mapContentEl.innerHTML = '';
    mapError.hidden = true;
    mapSkeleton.hidden = false;
    toggleModal(mapModal, true);

    try {
      const url = `${mapEndpoint}?code=${encodeURIComponent(code)}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' }, credentials: 'same-origin' });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      const item = Array.isArray(data) ? data[0] : null;
      if (!item) throw new Error('no-data');
      renderMapDetails(item);
    } catch { mapError.hidden = false; }
    finally { mapSkeleton.hidden = true; }
  }

  /* ---------------- Events ---------------- */
  document.addEventListener('click', async (ev) => {
    const playBtn = ev.target.closest('[data-map-code]');
    if (playBtn) {
      ev.preventDefault();
      const code = playBtn.dataset.mapCode || '';
      if (code) openMapDetail(code);
      return;
    }

    const copyBtn = ev.target.closest('[data-copy-code]');
    if (copyBtn) {
      ev.preventDefault();
      const code = copyBtn.dataset.copyCode || '';
      if (code) copyMapCode(code);
      return;
    }
  });

  openBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    toggleModal(trendingModal, true);
    loadAllIntoTrendingModal();
  });
  closeBtn?.addEventListener('click', () => toggleModal(trendingModal, false));
  mapCloseBtn?.addEventListener('click', () => toggleModal(mapModal, false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!trendingModal.hidden) toggleModal(trendingModal, false);
      if (!mapModal.hidden) toggleModal(mapModal, false);
      return;
    }
    if (e.key === 'Enter') {
      const el = document.activeElement?.closest?.('[data-copy-code]');
      if (el) {
        e.preventDefault();
        const code = el.dataset.copyCode || '';
        if (code) copyMapCode(code);
      }
    }
  });

  loadTop3();

  /* ---------------- Copy / Toast helpers ---------------- */
  function copyMapCode(code) {
    void logMapCopy(code, 'web');
    const ok   = t('popup.map_code_copied', { code });
    const msgOk= ok === 'popup.map_code_copied' ? `Map code copied: ${code}` : ok;

    const ko   = t('popup.copy_failed');
    const msgKo= ko === 'popup.copy_failed' ? 'Unable to copy this code.' : ko;

    copyTextToClipboard(code).then((copied) => {
      if (copied) showConfirmationMessage(msgOk);
      else showToast(msgKo, 'error');
    });
  }

  async function copyTextToClipboard(text) {
    const value = String(text ?? '').trim();
    if (!value) return false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch (_) {}
    try {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch { return false; }
  }

  function showToast(message, type = 'ok', opts = {}) {
    const { duration = 1200, enter = 220, exit = 220, easing = 'cubic-bezier(0.4,0,0.2,1)' } = opts;

    let root = document.getElementById('toast-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'toast-root';
      root.className = 'pointer-events-none fixed inset-x-0 bottom-6 z-[200] flex justify-center px-3';
      document.body.appendChild(root);
    }
    while (root.firstElementChild) {
      const prev = root.firstElementChild;
      try { prev.getAnimations?.().forEach(a => a.cancel()); } catch {}
      prev.remove();
    }

    const palette =
      type === 'ok'   ? 'bg-emerald-500/90 text-white' :
      type === 'warn' ? 'bg-amber-500/90 text-zinc-900' :
                        'bg-red-600/90 text-white';

    const el = document.createElement('div');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.className = [
      'pointer-events-auto select-none rounded-xl px-4 py-2',
      'text-sm shadow-lg text-center transform-gpu',
      'w-auto max-w-[92vw] sm:max-w-[42rem]',
      palette
    ].join(' ');
    el.textContent = message;

    root.appendChild(el);

    const inAnim = el.animate(
      [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: enter, easing, fill: 'forwards' }
    );

    const close = () => {
      Promise.resolve(inAnim.finished).catch(() => {}).finally(() => {
        const outAnim = el.animate(
          [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(8px)' }],
          { duration: exit, easing, fill: 'forwards' }
        );
        outAnim.finished.then(() => el.remove()).catch(() => el.remove());
        setTimeout(() => el.remove(), exit + 120);
      });
    };

    const timer = setTimeout(close, Math.max(duration, enter + 50));
    el.addEventListener('click', () => { clearTimeout(timer); close(); });
  }

  const showConfirmationMessage = (m) => showToast(m, 'ok');
  const showErrorMessage        = (m) => showToast(m, 'error');
  const showWarningMessage      = (m) => showToast(m, 'warn');
})();
