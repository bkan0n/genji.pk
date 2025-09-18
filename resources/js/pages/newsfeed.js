const roleClasses = {
  Ninja: 'border border-green-900/30 bg-green-900/20 text-green-300',
  Jumper: 'border border-green-400/30 bg-green-400/20 text-green-200',
  Skilled: 'border border-yellow-400/30 bg-yellow-400/20 text-yellow-200',
  Pro: 'border border-orange-300/30 bg-orange-300/20 text-orange-200',
  Master: 'border border-orange-600/30 bg-orange-600/20 text-orange-300',
  Grandmaster: 'border border-red-500/30 bg-red-500/20 text-red-300',
  God: 'border border-red-800/30 bg-red-800/20 text-red-400',
};

const difficultyTextClasses = {
  Beginner: 'text-green-300',
  Easy: 'text-green-400',
  Medium: 'text-yellow-300',
  Hard: 'text-orange-400',
  'Very Hard': 'text-orange-600',
  Extreme: 'text-red-500',
  Hell: 'text-red-800',
};

const difficultyColors = {
  //"Beginner": "#00ff1a",
  Easy: '#cdff3a',
  Medium: '#fbdf00',
  Hard: '#ff9700',
  'Very Hard': '#ff4500',
  Extreme: '#ff0000',
  Hell: '#9a0000',
};

const UPVOTE_INACTIVE_CLASSES =
  'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-zinc-100 active:scale-[0.98]';

const UPVOTE_ACTIVE_CLASSES =
  'border-emerald-500/30 bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30';

let _nfAbortController = null;
let currentPage = 1;
const pageSize = 20;
let totalResults = 0;
let totalPages = 0;
const CURRENT_LANG = document.documentElement.lang || 'en';
let translations = window.NEWSFEED_I18N || {};
let selectedType = null;
let compPage = 1;
const compPageSize = 10;
let compTotalResults = 0;
let compTotalPages = 0;
let currentSection = 'newsfeed';

/* ===== CSP helpers (aucun inline style / event) ===== */
const CSP_NONCE = document.querySelector('meta[name="csp-nonce"]')?.content || '';
const __dynStyleEl = (() => {
  const el = document.createElement('style');
  if (CSP_NONCE) el.setAttribute('nonce', CSP_NONCE);
  document.head.appendChild(el);
  return el;
})();
const __sheet = __dynStyleEl.sheet;
function __addRule(sel, body) {
  try {
    __sheet.insertRule(`${sel}{${body}}`, __sheet.cssRules.length);
  } catch {}
}

const __cspInit = (() => {
  let done = false;
  return () => {
    if (done) return;
    done = true;
    __addRule('.csp-fade-enter', 'opacity:0;transform:translateY(6px)');
    __addRule(
      '.csp-fade-active',
      'opacity:1;transform:translateY(0);transition:opacity .35s ease,transform .35s ease'
    );

    __addRule('.csp-step-enter', 'opacity:0;transform:translateY(4px)');
    __addRule(
      '.csp-step-active',
      'opacity:1;transform:translateY(0);transition:opacity .35s ease,transform .35s ease'
    );

    __addRule(
      '.csp-lift-enter',
      'opacity:0;transform:translateY(-6px) scale(.98);transition:opacity .85s ease,transform .85s ease'
    );
    __addRule('.csp-lift-active', 'opacity:1;transform:translateY(0) scale(1)');

    __addRule('.min-h-auto', 'min-height:auto');
    __addRule('.csp-offscreen', 'position:fixed;top:-9999px;left:-9999px');
  };
})();

const __colorClassCache = new Map();
function __hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}
function ensureColorClass(hex) {
  const key = String(hex || '')
    .trim()
    .toLowerCase();
  if (!key) return '';
  if (__colorClassCache.has(key)) return __colorClassCache.get(key);
  const cn = `diffc-${__hash(key)}`;
  __addRule(`.${cn}`, `color:${key}`);
  __colorClassCache.set(key, cn);
  return cn;
}

document.addEventListener(
  'error',
  (e) => {
    const t = e.target;
    if (t && t.matches && t.matches('[data-hide-on-error]')) t.classList.add('hidden');
  },
  true
);

/* ---------- Affichage vs. type canonique ---------- */
const FILTER_LABELS = translations?.tags
  ? {
      all: translations.tags.all,
      announcement: translations.tags.announcement,
      role: translations.tags.role,
      record: translations.tags.record,
      guide: translations.tags.guide,
      new_map: translations.tags.new_map,
    }
  : {
      all: 'All',
      announcement: 'Announcements',
      role: 'Roles',
      record: 'Records',
      guide: 'Guides',
      new_map: 'New maps',
    };

const FILTER_ORDER = ['all', 'new_map', 'announcement', 'role', 'record', 'guide'];

const TYPE_CANON = {
  all: 'all',
  announcement: 'announcement',
  announcements: 'announcement',
  annnouncement: 'announcement',
  annnouncements: 'announcement',
  role: 'role',
  roles: 'role',
  record: 'record',
  records: 'record',
  guide: 'guide',
  guides: 'guide',
  new_map: 'new_map',
  'new maps': 'new_map',
};

/* ---------- i18n ---------- */
function t(path, params = {}) {
  const parts = path.split('.');
  let result = translations;
  for (const part of parts) {
    result = result?.[part];
    if (!result) break;
  }
  if (typeof result !== 'string') return path;
  for (const k in params) result = result.replace(`{${k}}`, params[k]);
  return result;
}

// ———————————————————————————————————————————————————————————————
// TABS & BOOT
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const rawSection = (urlParams.get('section') || '').toLowerCase();
  currentSection = rawSection === 'completions' ? 'completions' : 'newsfeed';

  document
    .getElementById('tabNewsfeed')
    ?.addEventListener('click', () => switchSection('newsfeed'));
  document
    .getElementById('tabCompletions')
    ?.addEventListener('click', () => switchSection('completions'));
  applyTabVisuals();

  if (currentSection === 'newsfeed') {
    bindFilters();
    animateFilterBarAndTweakReset();
    currentPage = 1;
    loadNewsfeed(false);
    hydrateChangelogsSidebar();
  } else {
    document.getElementById('panel-newsfeed')?.classList.add('hidden');
    document.getElementById('panel-completions')?.classList.remove('hidden');
    compPage = 1;
    loadCompletions(false);
  }
});

function applyTabVisuals() {
  const btnNews = document.getElementById('tabNewsfeed');
  const btnComp = document.getElementById('tabCompletions');

  const activeClasses = ['bg-white', 'text-zinc-900'];
  const inactiveClasses = ['text-white', 'hover:bg-white/10'];

  if (currentSection === 'newsfeed') {
    btnNews.classList.add(...activeClasses);
    btnNews.classList.remove(...inactiveClasses);
    btnComp.classList.remove(...activeClasses);
    btnComp.classList.add(...inactiveClasses);
  } else {
    btnComp.classList.add(...activeClasses);
    btnComp.classList.remove(...inactiveClasses);
    btnNews.classList.remove(...activeClasses);
    btnNews.classList.add(...inactiveClasses);
  }
}

function switchSection(section) {
  currentSection = section === 'completions' ? 'completions' : 'newsfeed';

  document
    .getElementById('panel-newsfeed')
    ?.classList.toggle('hidden', currentSection !== 'newsfeed');
  document
    .getElementById('panel-completions')
    ?.classList.toggle('hidden', currentSection !== 'completions');

  const url = new URL(window.location);
  url.searchParams.set('section', currentSection);
  history.replaceState(null, '', url);

  applyTabVisuals();

  if (currentSection === 'newsfeed') {
    currentPage = 1;
    loadNewsfeed(false);
  } else {
    compPage = 1;
    loadCompletions(false);
  }
}

async function fetchJsonResilient(input, init = {}, { timeout = 10000, retries = 2 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(new DOMException('Timeout', 'AbortError')), timeout);
    try {
      const res = await fetch(input, {
        ...init,
        signal: ctrl.signal,
        headers: { Accept: 'application/json', ...(init.headers || {}) },
        cache: 'no-store',
        credentials: 'same-origin',
      });
      clearTimeout(tid);

      const ct = res.headers.get('content-type') || '';
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!ct.includes('application/json')) {
        const txt = await res.text();
        throw new Error(`non_json: ${txt.slice(0, 200)}`);
      }
      return res.json();
    } catch (err) {
      clearTimeout(tid);
      const transient = err?.name === 'AbortError' || /HTTP 5\d\d/.test(err?.message || '');
      if (attempt < retries && transient) {
        await new Promise((r) => setTimeout(r, 400 * Math.pow(2, attempt) + Math.random() * 150));
        continue;
      }
      throw err;
    }
  }
}
// ———————————————————————————————————————————————————————————————
// NEWSFEED

/* ---------- time ---------- */
function updateTimestamps() {
  const timestamps = document.querySelectorAll('.timestamp');
  timestamps.forEach((el) => {
    const serverTimestamp = el.getAttribute('data-timestamp');
    if (!serverTimestamp) return;

    const date = new Date(serverTimestamp);
    if (isNaN(date.getTime())) return;

    const currentLang = document.documentElement.lang || 'en';
    const format =
      translations?.common?.timestamp_format || '{month} {day}, {year} at {hour}:{minute} {AMorPM}';
    const monthName = date.toLocaleString(currentLang, { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    let out;
    if (['fr', 'ru', 'de'].includes(currentLang)) {
      out = format
        .replace('{month}', monthName)
        .replace('{day}', day)
        .replace('{year}', year)
        .replace('{hour}', hours)
        .replace('{minute}', minutes)
        .replace('{AMorPM}', '');
    } else {
      const AMorPM = hours < 12 ? 'AM' : 'PM';
      const hour12 = hours % 12 || 12;
      out = format
        .replace('{month}', monthName)
        .replace('{day}', day)
        .replace('{year}', year)
        .replace('{hour}', hour12)
        .replace('{minute}', minutes)
        .replace('{AMorPM}', AMorPM);
    }
    el.textContent = out.trim();
  });
}

/* ---------- Helper fetch strict JSON ---------- */
async function fetchJsonStrict(input, init = {}) {
  const res = await fetch(input, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
    credentials: 'same-origin',
  });

  const ct = res.headers.get('content-type') || '';
  const isJson = ct.includes('application/json');

  if (!res.ok) {
    let payload;
    try {
      payload = isJson ? await res.json() : await res.text();
    } catch {
      payload = null;
    }
    const msg = payload && payload.error ? payload.error : `HTTP ${res.status}`;
    throw new Error(`Request failed: ${msg}`);
  }

  if (!isJson) {
    const text = await res.text();
    throw new Error(`Réponse non-JSON (ct=${ct}) : ${text.slice(0, 200)}…`);
  }

  return res.json();
}

/* ---------- Discord/Emoji helpers ---------- */
async function fetchEmoji(emojiName, emojiId) {
  try {
    const res = await fetch('/api/newsfeed/emoji', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: new URLSearchParams({ emojiName, emojiId }),
      cache: 'no-store',
      credentials: 'same-origin',
    });

    if (!res.ok) {
      try {
        await res.text();
      } catch {}
      return `<span class="inline-block align-[-2px] text-zinc-300">:${emojiName}:</span>`;
    }

    const data = await res.json();
    if (data && data.emoji) return data.emoji;
  } catch (_) {}
  return `<span class="inline-block align-[-2px] text-zinc-300">:${emojiName}:</span>`;
}

/* ---------- Helpers réponse getMapSearch.php ---------- */
function safeParseJson(text) {
  if (typeof text !== 'string') return null;
  let t = text.replace(/^\uFEFF/, '').trim();
  try {
    return JSON.parse(t);
  } catch {}
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(t.slice(start, end + 1));
    } catch {}
  }
  return null;
}

function pickFirstMapFromSearch(res) {
  if (!res) return null;
  if (!Array.isArray(res) && typeof res === 'object' && res.map_code) return res;
  if (Array.isArray(res)) return res[0] || null;
  const numericKeys = Object.keys(res)
    .filter((k) => /^\d+$/.test(k))
    .sort((a, b) => Number(a) - Number(b));
  if (numericKeys.length) return res[numericKeys[0]];
  if (Array.isArray(res.data)) return res.data[0] || null;
  return null;
}

/* ---------- Modal Map Details ---------- */
function normalizeDifficulty(d) {
  return (d || '').replace(/\s*[+-]$/, '').trim();
}

function extractMapFromSearch(result) {
  if (!result) return null;
  if (Array.isArray(result)) return result[0] || null;
  if (result.map_code) return result;
  if (Array.isArray(result.data)) return result.data[0] || null;
  const numKey = Object.keys(result)
    .filter((k) => /^\d+$/.test(k))
    .sort((a, b) => Number(a) - Number(b))[0];
  return numKey ? result[numKey] : null;
}

function toArray(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string')
    return v
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

function twModalStyleShell() {
  const overlay = document.getElementById('detailsModalOverlay');
  const box = document.getElementById('detailsModalBox');
  if (!overlay || !box) return;

  overlay.classList.add(
    'fixed',
    'inset-0',
    'z-50',
    'bg-black/60',
    'backdrop-blur-sm',
    'p-4',
    'flex',
    'items-center',
    'justify-center'
  );

  box.classList.add(
    'w-full',
    'max-w-4xl',
    'opacity-0',
    'scale-95',
    'transition',
    'duration-200',
    'ease-out'
  );

  const container = document.getElementById('modalDetailsContainer');
  if (container) {
    container.classList.add(
      'w-full',
      'rounded-2xl',
      'border',
      'border-white/10',
      'bg-zinc-950/90',
      'shadow-2xl',
      'ring-1',
      'ring-white/10',
      'overflow-hidden'
    );
  }
}

function twModalOpen() {
  const overlay = document.getElementById('detailsModalOverlay');
  const box = document.getElementById('detailsModalBox');
  if (!overlay || !box) return;
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  requestAnimationFrame(() => {
    box.classList.remove('opacity-0', 'scale-95');
    box.classList.add('opacity-100', 'scale-100');
  });
}

function twModalClose() {
  const overlay = document.getElementById('detailsModalOverlay');
  const box = document.getElementById('detailsModalBox');
  if (!overlay || !box) return;
  box.classList.add('opacity-0', 'scale-95');
  box.classList.remove('opacity-100', 'scale-100');
  setTimeout(() => {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
  }, 200);
}

/* ---------- Modal Map Details (PATCH) ---------- */
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-open-map-details]');
  if (!a) return;
  e.preventDefault();
  const code = a.getAttribute('data-map-code');
  if (code) openMapDetailsModal(code);
});

function openMapDetailsModal(mapCode) {
  const overlay = document.getElementById('detailsModalOverlay');
  const box = document.getElementById('detailsModalBox');
  const container = document.getElementById('modalDetailsContainer');
  if (!overlay || !box || !container) return;

  overlay.classList.add(
    'fixed',
    'inset-0',
    'z-50',
    'bg-black/60',
    'backdrop-blur-sm',
    'p-4',
    'flex',
    'items-center',
    'justify-center'
  );
  box.classList.add(
    'w-full',
    'max-w-4xl',
    'transition',
    'duration-200',
    'ease-out',
    'opacity-0',
    'scale-95'
  );
  container.className =
    'w-full rounded-2xl border border-white/10 bg-zinc-950/90 shadow-2xl ring-1 ring-white/10 overflow-hidden';

  container.innerHTML = `
    <header class="sticky top-0 bg-gradient-to-b from-zinc-950/95 to-zinc-950/80 backdrop-blur border-b border-white/10 px-4 sm:px-5 py-3 flex items-center justify-between">
      <h2 class="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
        <span class="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/5">
          <svg class="h-3.5 w-3.5 text-zinc-300" viewBox="0 0 24 24"><path fill="currentColor" d="M20 6H4v12h16V6Zm-2 2v2h-5V8h5ZM6 8h5v2H6V8Zm12 4v4h-5v-4h5ZM6 12h5v4H6v-4Z"/></svg>
        </span>
        ${t('thead.mapDetails')}
      </h2>
    </header>

    <div class="p-4 sm:p-5">
      <div class="animate-pulse space-y-4">
        <div class="h-5 w-2/3 rounded-md bg-white/5"></div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <div class="h-4 w-5/6 rounded bg-white/5"></div>
            <div class="h-4 w-4/6 rounded bg-white/5"></div>
            <div class="h-4 w-3/6 rounded bg-white/5"></div>
            <div class="h-4 w-5/6 rounded bg-white/5"></div>
          </div>
          <div class="h-40 w-full rounded-xl border border-white/10 bg-white/5"></div>
        </div>
      </div>
    </div>
  `;

  overlay.classList.remove('hidden');
  overlay.style.display = 'flex';
  requestAnimationFrame(() => {
    box.classList.remove('opacity-0', 'scale-95');
    box.classList.add('opacity-100', 'scale-100');
  });

  const getStars = (quality, max = 6) => {
    const q = quality == null ? null : Number(quality);
    if (q == null || Number.isNaN(q)) return t('common.na');
    const full = Math.max(0, Math.min(max, Math.floor(q)));
    const empty = Math.max(0, max - full);
    return `<span class="text-amber-300">${'★'.repeat(full)}</span><span class="text-zinc-600">${'☆'.repeat(empty)}</span>`;
  };

  const medal = (label, src, time) => `
    <div class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <img src="${src}" alt="${label}" class="h-6 w-6 rounded-md object-cover"/>
      <div class="text-xs">
        <div class="font-semibold">${label}</div>
        <div class="text-zinc-400">${time}</div>
      </div>
    </div>
  `;

  const safeFirst = (res) => {
    if (typeof pickFirstMapFromSearch === 'function') return pickFirstMapFromSearch(res);
    if (Array.isArray(res)) return res[0] || null;
    const numericKeys = Object.keys(res || {})
      .filter((k) => /^\d+$/.test(k))
      .sort((a, b) => Number(a) - Number(b));
    if (numericKeys.length) return res[numericKeys[0]];
    if (res && typeof res === 'object' && Array.isArray(res.data)) return res.data[0] || null;
    return null;
  };

  fetch('/api/search/map', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ map_code: mapCode }),
    credentials: 'same-origin',
    cache: 'no-store',
  })
    .then(async (r) => {
      const ct = r.headers.get('content-type') || '';
      if (!r.ok) {
        const body = await r.text().catch(() => '');
        throw new Error(`HTTP ${r.status} – ${body.slice(0, 400)}`);
      }
      if (ct.includes('application/json')) return r.json();
      const txt = await r.text();
      try {
        return JSON.parse(txt);
      } catch {
        throw new Error(`Invalid JSON response: ${txt.slice(0, 400)}`);
      }
    })
    .then((res) => {
      if (res?.error) {
        container.innerHTML = `
          <div class="p-4 sm:p-5">
            <p class="text-sm text-rose-300">${t('common.error')}: ${res.error}</p>
          </div>`;
        return;
      }

      const map = safeFirst(res) || res[0] || null;
      if (!map) {
        container.innerHTML = `
          <div class="p-4 sm:p-5">
            <p class="text-sm text-rose-300">${t('common.error')}: Not found</p>
          </div>`;
        return;
      }

      const lang = document.documentElement.lang || 'en';

      let mechanics = map.mechanics ?? [];
      let restrictions = map.restrictions ?? [];
      if (typeof mechanics === 'string')
        mechanics = mechanics
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      if (typeof restrictions === 'string')
        restrictions = restrictions
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

      if (lang === 'cn') {
        mechanics = mechanics.map((o) => t(`mechanics.${o.toLowerCase().replace(/ /g, '_')}`) || o);
        restrictions = restrictions.map(
          (o) => t(`restrictions.${o.toLowerCase().replace(/ /g, '_')}`) || o
        );
      }

      const mechText = mechanics.length ? mechanics.join(', ') : t('common.na');
      const restText = restrictions.length ? restrictions.join(', ') : t('common.na');
      const desc = map.desc || t('common.no_description');
      const bannerPath = `assets/banners/${(map.map_name || '').toLowerCase().replace(/[\s()]+/g, '')}.png`;
      const diffClass =
        typeof difficultyTextClasses !== 'undefined' && difficultyTextClasses
          ? difficultyTextClasses[normalizeDifficulty(map.difficulty)] || 'text-zinc-200'
          : 'text-zinc-200';

      const medals = [];
      if (map.gold && map.gold !== 'N/A')
        medals.push(medal('Gold', 'assets/verifications/gold_wr.gif', map.gold));
      if (map.silver && map.silver !== 'N/A')
        medals.push(medal('Silver', 'assets/verifications/silver_wr.gif', map.silver));
      if (map.bronze && map.bronze !== 'N/A')
        medals.push(medal('Bronze', 'assets/verifications/bronze_wr.gif', map.bronze));

      container.innerHTML = `
        <header class="sticky top-0 bg-gradient-to-b from-zinc-950/95 to-zinc-950/80 backdrop-blur border-b border-white/10 px-4 sm:px-5 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/5">
              <svg class="h-3.5 w-3.5 text-zinc-300" viewBox="0 0 24 24"><path fill="currentColor" d="M20 6H4v12h16V6Zm-2 2v2h-5V8h5ZM6 8h5v2H6V8Zm12 4v4h-5v-4h5ZM6 12h5v4H6v-4Z"/></svg>
            </span>
            <div class="text-sm">
              <div class="font-semibold leading-tight">${map.map_name || t('common.na')}</div>
              <div class="text-[11px] text-zinc-400">${map.map_code || ''}</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            ${map.difficulty ? `<span class="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs ${diffClass}">${map.difficulty}</span>` : ''}
            ${
              Array.isArray(map.map_type) && map.map_type.length
                ? map.map_type
                    .map(
                      (tp) =>
                        `<span class="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-zinc-300">${tp}</span>`
                    )
                    .join('')
                : map.map_type
                  ? `<span class="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-zinc-300">${map.map_type}</span>`
                  : ''
            }
          </div>
        </header>

        <div class="p-4 sm:p-5 space-y-4">
          <div class="grid sm:grid-cols-2 gap-4">
            <!-- Infos -->
            <div class="space-y-3 text-sm">
              <div class="flex flex-wrap gap-2">
                ${
                  map.creators
                    ? (Array.isArray(map.creators) ? map.creators : [map.creators])
                        .map(
                          (c) => `
                        <span class="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1">
                          <svg class="h-3.5 w-3.5 text-zinc-400" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5Z"/></svg>
                          <span>${c}</span>
                        </span>
                      `
                        )
                        .join('')
                    : ''
                }
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <div class="text-[11px] text-zinc-400">${t('thead.mapCheckpoints')}</div>
                  <div class="font-semibold">${map.checkpoints ?? t('common.na')}</div>
                </div>
                <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <div class="text-[11px] text-zinc-400">${t('thead.mapQuality')}</div>
                  <div class="font-semibold">${getStars(map.quality)}</div>
                </div>
              </div>

              <div>
                <div class="text-[11px] text-zinc-400 mb-1">${t('thead.mapMechanics')}</div>
                ${
                  mechText !== t('common.na')
                    ? `<div class="flex flex-wrap gap-1.5">
                        ${mechText
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map(
                            (s) => `
                          <span class="rounded-md border border-white/10 bg-zinc-900/60 px-2 py-0.5 text-[11px] text-zinc-200">${s}</span>
                        `
                          )
                          .join('')}
                       </div>`
                    : `<div class="text-sm text-zinc-400">${t('common.na')}</div>`
                }
              </div>

              <div>
                <div class="text-[11px] text-zinc-400 mb-1">${t('thead.mapRestrictions')}</div>
                ${
                  restText !== t('common.na')
                    ? `<div class="flex flex-wrap gap-1.5">
                        ${restText
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map(
                            (s) => `
                          <span class="rounded-md border border-white/10 bg-zinc-900/60 px-2 py-0.5 text-[11px] text-zinc-200">${s}</span>
                        `
                          )
                          .join('')}
                       </div>`
                    : `<div class="text-sm text-zinc-400">${t('common.na')}</div>`
                }
              </div>

              <div>
                <div class="text-[11px] text-zinc-400">${t('thead.mapDescription')}</div>
                <p class="mt-1 whitespace-pre-wrap leading-relaxed text-zinc-200">${map.desc || t('common.no_description')}</p>
              </div>
            </div>

            <!-- Image + médailles -->
            <div class="space-y-3">
              <img src="${bannerPath}" alt="${map.map_name} Banner"
                  class="w-full rounded-xl border border-white/10 bg-zinc-900/50 object-cover"
                  data-hide-on-error>
              ${medals.length ? `<div class="grid grid-cols-3 gap-2">${medals.join('')}</div>` : ''}
            </div>
          </div>
        </div>
      `;
    })
    .catch((err) => {
      container.innerHTML = `
        <div class="p-4 sm:p-5">
          <p class="text-sm text-rose-300">${t('common.error')} fetching map details</p>
          <pre class="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-zinc-900/60 p-3 text-[12px] text-zinc-300">${String(err)}</pre>
        </div>`;
      console.error(err);
    });
}

function closeDetailsModal() {
  twModalClose();
}

document.getElementById('detailsModalOverlay')?.addEventListener('click', (e) => {
  const box = document.getElementById('detailsModalBox');
  if (box && !box.contains(e.target)) closeDetailsModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDetailsModal();
});

/* ---------- API + render ---------- */
async function loadNewsfeed(append = false) {
  try {
    if (_nfAbortController)
      try {
        _nfAbortController.abort();
      } catch {}
    _nfAbortController = new AbortController();

    const params = new URLSearchParams({
      page_number: String(currentPage),
      page_size: String(pageSize),
    });
    if (selectedType) params.set('type', selectedType);

    const raw = await fetchJsonResilient(`/api/newsfeed?${params}`, {
      signal: _nfAbortController.signal,
    });

    const items = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.items)
          ? raw.items
          : [];

    totalResults = Number(raw?.total_results ?? raw?.total ?? items.length) || 0;
    totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

    const cardsHtml = await Promise.all(items.map(createNewsCard));

    const container = document.getElementById('newsfeedContainer');
    if (!container) return;

    if (append) container.insertAdjacentHTML('beforeend', cardsHtml.join(''));
    else container.innerHTML = cardsHtml.join('');

    __cspInit();
    container.querySelectorAll('.news-card').forEach((card, i) => {
      card.classList.add('csp-fade-enter');
      setTimeout(
        () => {
          card.classList.add('csp-fade-active');
          card.classList.remove('csp-fade-enter');
        },
        16 + i * 60
      );
    });

    items.forEach((it) => {
      const p = it?.payload || it?.data || {};
      const evType = (it?.event_type || p?.type || it?.type || '').toLowerCase();
      const guideUrl = p?.map?.guide?.[0] || p?.guide?.[0] || p?.video || p?.url;
      const key = p?.map_code || p?.code || p?.map?.map_code || it?.id;
      if (evType === 'guide' && guideUrl && key) {
        createEmbeddedVideo(`videoContainer-${key}`, guideUrl);
      }
    });

    updateTimestamps();
    renderPaginationButtons();
    applySearchFilter();
  } catch (e) {
    console.error('Erreur lors du chargement du fil :', e);
  } finally {
    _nfAbortController = null;
  }
}

async function createNewsCard(item) {
  const p = item?.payload || item?.data || {};
  const typeRaw = item?.event_type || p?.type || item?.type || 'unknown';
  const type = String(typeRaw).toLowerCase();
  const ts = item?.timestamp;

  const userId = p?.user?.user_id ?? null;
  let nickname = p?.user?.nickname || 'GenjiBot';
  let profileImg = 'assets/profile/genjibot.png';
  if (userId === 141372217677053952) profileImg = 'assets/profile/joe.jpg';
  else if (userId === 273775694008549376) profileImg = 'assets/profile/fishofire.jpg';

  if (type === 'announcement') {
    let messageContent = p?.message?.content || p?.content || '';
    messageContent = await convertTenorLinks(messageContent);
    const formatted = await formatMessageContent(messageContent);

    return `
      <article class="news-card rounded-2xl border border-white/10 bg-white/5 p-4">
        <header class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <img class="h-10 w-10 rounded-lg object-cover ring-2 ring-white/10" src="${profileImg}" alt="${nickname}">
            <div class="leading-tight">
              <div class="font-semibold">${nickname}</div>
              <time class="timestamp text-xs text-zinc-400" data-timestamp="${ts}"></time>
            </div>
          </div>
          <span class="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-200">Announcements</span>
        </header>

        <div class="mt-3 space-y-3">
          <p class="announcement-content text-sm text-zinc-200 leading-relaxed">${formatted}</p>

          <div id="loadingIndicator" class="loading-bar hidden items-center gap-2 text-xs text-zinc-400">
            <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" stroke-width="4" opacity=".25"/><path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" stroke-width="4"/></svg>
            ${t('common.loading') || 'Loading...'}
          </div>

          <div class="flex gap-2">
            <button class="translate-button inline-flex items-center justify-center rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5">
              ${t('newsfeed.translate_button')}
            </button>
          </div>
          <p class="translated-text text-sm text-zinc-300"></p>
        </div>
      </article>
    `;
  }

  // En-tête "GenjiBot"
  let html = `
    <article class="news-card rounded-2xl border border-white/10 bg-white/5 p-4">
      <header class="flex items-center gap-3">
        <img class="h-10 w-10 rounded-full object-cover ring-2 ring-white/10" src="assets/profile/genjibot.png" alt="GenjiBot">
        <div class="leading-tight">
          <div class="flex items-center gap-2">
            <span class="font-semibold">GenjiBot</span>
            <span class="rounded-full border border-white/10 bg-white/10 px-1.5 py-0.5 text-[10px] text-zinc-200">BOT</span>
          </div>
          <time class="timestamp text-xs text-zinc-400" data-timestamp="${ts}"></time>
        </div>
      </header>
      <div class="mt-3 space-y-3">
  `;

  // NEW_MAP (v3)
  if (type === 'new_map') {
    const code = p?.code || '';
    const mapName = p?.map_name || '';
    const diffRaw = p?.difficulty || '';
    const diffClass = difficultyTextClasses[normalizeDifficulty(diffRaw)] || 'text-zinc-200';
    const bannerSrc = p?.banner_url || `assets/banners/${formatMapName(mapName)}.png`;
    const creators = Array.isArray(p?.creators) ? p.creators.join(', ') : p?.creators || '';

    html += `
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold">
          ${t('newsfeed.new_map', {
            nickname: nickname,
            difficulty: `<span class="${diffClass}">${diffRaw || t('common.na')}</span>`,
            map_name: mapName || t('common.na'),
          })}
        </h3>
        <img class="h-9 w-9 rounded-md ring-1 ring-white/10" src="assets/ranks/${formatImageName(diffRaw)}" alt="${diffRaw}">
      </div>
      <p class="text-sm">
        ${creators ? `<span class="text-zinc-400 mr-1">${t('newsfeed.creator') || 'Creator'}:</span> ${creators}<br>` : ''}
        ${t('newsfeed.details_command')}
        <code class="map-code cursor-pointer rounded border border-white/10 bg-zinc-900/60 px-2 py-0.5 text-[12px] font-mono text-emerald-200"
              data-map-code="/map-search map_code:${code}">/map-search map_code:${code}</code>
        <a class="text-brand-300 hover:text-brand-200 text-sm"
           href="#" data-open-map-details data-map-code="${code}">
          ${t('newsfeed.click_here')}
        </a>
      </p>
      <img class="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900/50 object-cover"
          src="${bannerSrc}" alt="${mapName} Banner" data-hide-on-error>
    `;
  }

  // MAP_EDIT (v3)
  if (type === 'map_edit') {
    const code = p?.code || '';
    const changes = Array.isArray(p?.changes) ? p.changes : [];
    const reason = p?.reason || '';

    const list = changes
      .map((ch) => {
        const field = nfEscapeHtml(ch?.field ?? '');
        const oldV = nfPrettyVal(ch?.old);
        const newV = nfPrettyVal(ch?.new);
        return `
        <li class="flex items-start gap-2">
          <span class="mt-2 h-1.5 w-1.5 rounded-full bg-white/70"></span>
          <p class="text-sm leading-relaxed">
            <span class="font-semibold underline decoration-white/20">${field}</span>
            &nbsp;${oldV}
            <span class="mx-1 text-zinc-500">→</span>
            <span class="font-medium text-zinc-100">${newV}</span>
          </p>
        </li>
      `;
      })
      .join('');

    html += `
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold">${nfEscapeHtml(code)} was updated</h3>
        <img src="assets/verifications/new/icons/warning.avif"
            alt="warning" class="h-11 w-11 rounded-full ring-1 ring-white/10 select-none">
      </div>

      <hr class="my-2 border-white/10">

      ${
        reason
          ? `
        <p class="text-sm text-zinc-300">
          <span class="text-zinc-400">${t('common.reason') || 'Reason'}:</span> ${nfEscapeHtml(reason)}
        </p>`
          : ''
      }

      ${
        list
          ? `<ul class="mt-2 space-y-1.5">${list}</ul>`
          : `<p class="text-sm text-zinc-400">${t('newsfeed.no_changes') || 'No changes.'}</p>`
      }
    `;
  }

  // BULK ARCHIVE / UNARCHIVE (compatible v3)
  if (type === 'bulk_archive' || type === 'bulk_unarchive') {
    const actionText =
      type === 'bulk_archive' ? t('newsfeed.bulk_archived') : t('newsfeed.bulk_unarchived');
    const bulk = Array.isArray(p?.bulk) ? p.bulk : Array.isArray(p?.items) ? p.items : [];
    const bulkList = bulk
      .map(
        (x) =>
          `<li class="px-2 py-1 rounded-md border border-white/10 bg-white/5 text-xs">${x?.map_code || x?.code || String(x)}</li>`
      )
      .join('');
    html += `
      <h3 class="text-lg font-bold">${actionText}</h3>
      <ul class="grid grid-cols-2 sm:grid-cols-3 gap-2">${bulkList}</ul>
    `;
  }

  // GUIDE (fallback v3)
  if (type === 'guide') {
    const code = p?.map_code || p?.code || '';
    const video = p?.map?.guide?.[0] || p?.guide?.[0] || p?.video || p?.url || '';
    html += `
      <h3 class="text-lg font-bold">${t('newsfeed.has_posted_guide', { nickname, map_code: code })}</h3>
      ${video ? `<a class="text-brand-300 hover:text-brand-200 text-sm" href="${video}" target="_blank">${t('newsfeed.watch_guide')}</a>` : ''}
      <div id="videoContainer-${code || item.id}" class="aspect-video overflow-hidden rounded-lg border border-white/10 bg-zinc-900/50"></div>
    `;
  }

  // RECORD (fallback v3)
  if (type === 'record') {
    const mapName = p?.map_name || p?.map?.map_name || '';
    const code = p?.map_code || p?.code || p?.map?.map_code || '';
    const record = p?.record?.record ?? p?.record ?? p?.time ?? '';
    const video = p?.record?.video ?? p?.video ?? '';
    html += `
      <h3 class="text-lg font-bold">${t('newsfeed.new_wr', { nickname })}</h3>
      <p class="text-sm text-zinc-300"><strong>${t('newsfeed.new_wr_info', { map_name: mapName, creators: p?.creators || '', map_code: code })}</strong></p>
      <div class="grid sm:grid-cols-2 gap-2 text-sm">
        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
          <span class="text-zinc-400 mr-1">Record:</span> ${record || t('common.na')}
          <img class="inline h-5 w-5 align-[-3px]" src="assets/verifications/new_wr.gif" alt="VRF">
        </div>
        ${
          video
            ? `
        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
          <span class="text-zinc-400 mr-1">Video:</span>
          <a class="text-brand-300 hover:text-brand-200" href="${video}" target="_blank">${t('newsfeed.link')}</a>
        </div>`
            : ``
        }
      </div>
    `;
  }

  // ARCHIVE (fallback v3)
  if (type === 'archive') {
    const code = p?.map_code || p?.code || '';
    const creators = Array.isArray(p?.creators) ? p.creators.join(', ') : p?.creators || '';
    const diffRaw = p?.difficulty || p?.map?.difficulty || '';
    html += `
      <h3 class="text-lg font-bold">${t('newsfeed.archived_map', { map_code: code })}</h3>
      <p class="text-sm text-zinc-300">${t('newsfeed.archived_description')}</p>
      <div class="mt-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
        <p><span class="text-zinc-400">${t('newsfeed.map_code')}:</span> ${code}</p>
        ${creators ? `<p><span class="text-zinc-400">${t('newsfeed.creator')}:</span> ${creators}</p>` : ``}
        ${diffRaw ? `<p><span class="text-zinc-400">${t('newsfeed.difficulty')}:</span> ${diffRaw}</p>` : ``}
      </div>
    `;
  }

  // ROLE (v3)
  if (type === 'role') {
    const roles = (p?.user?.roles || p?.roles || [])
      .map((role) => {
        const clean = normalizeRole(role);
        const tw = roleClasses[clean] || 'border border-white/10 bg-white/5 text-zinc-200';
        return `<li class="px-2 py-1 rounded-md text-xs ${tw}">${role}</li>`;
      })
      .join('');
    html += `
      <h3 class="text-lg font-bold">${t('newsfeed.promoted', { nickname })}</h3>
      <ul class="flex flex-wrap gap-2">${roles}</ul>
    `;
  }

  html += `</div></article>`;
  return html;
}

/* ---------- Discord message formatting ---------- */
async function formatMessageContent(messageContent) {
  const emojiRegex = /<:(\w+):(\d+)>/g;
  const userIdRegex = /<@(\d+)>/g;

  const emojiPromises = [];
  const userPromises = [];

  let match;
  while ((match = emojiRegex.exec(messageContent)) !== null) {
    const [full, emojiName, emojiId] = match;
    emojiPromises.push(
      fetchEmoji(emojiName, emojiId).then((emojiHTML) => {
        messageContent = messageContent.replace(full, emojiHTML);
      })
    );
  }

  while ((match = userIdRegex.exec(messageContent)) !== null) {
    const userId = match[1];
    userPromises.push(
      fetch(`/api/discord/global-name?user_id=${encodeURIComponent(userId)}`)
        .then(async (r) => {
          const data = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
          return data;
        })
        .then((data) => {
          const displayName = userId === '969632729643753482' ? 'GenjiBot' : data.name || userId;
          messageContent = messageContent.replace(
            `<@${userId}>`,
            `<span class="text-sky-300 font-medium">@${displayName}</span>`
          );
        })
        .catch(() => {
          messageContent = messageContent.replace(
            `<@${userId}>`,
            `<span class="text-sky-300 font-medium">@${userId}</span>`
          );
        })
    );
  }

  await Promise.all([...emojiPromises, ...userPromises]);

  return (
    messageContent
      .replace(
        /<@&1072931972663476276>/g,
        '<span class="inline-flex items-center gap-1 rounded-md border border-rose-500/50 bg-rose-600/20 px-1.5 py-0.5 text-[12px] font-semibold text-rose-400">@God</span>'
      )
      .replace(
        /<@&868225134257897502>/g,
        '<span class="inline-flex items-center gap-1 rounded-md border border-rose-400/30 bg-rose-500/10 px-1.5 py-0.5 text-[12px] font-semibold text-rose-300">@Ancient God</span>'
      )
      .replace(
        /<@&1072932080691974155>/g,
        '<span class="inline-flex items-center gap-1 rounded-md border border-rose-400/30 bg-rose-500/10 px-1.5 py-0.5 text-[12px] font-semibold text-rose-300">@Grandmaster</span>'
      )

      /* rôles en gris (fond gris) */
      .replace(
        /<@&1073292414271356938>/g,
        '<span class="inline-flex items-center gap-1 rounded-md border border-zinc-400/20 bg-zinc-500/10 px-1.5 py-0.5 text-[12px] font-semibold text-zinc-300">@General Announcements</span>'
      )
      .replace(
        /<@&1001688523067371582>/g,
        '<span class="inline-flex items-center gap-1 rounded-md border border-zinc-400/20 bg-zinc-500/10 px-1.5 py-0.5 text-[12px] font-semibold text-zinc-300">@Mapmaker</span>'
      )

      /* rôle GenjiBot en vert (fond vert) */
      .replace(
        /<@&1072538245637865685>/g,
        '<span class="inline-flex items-center gap-1 rounded-md border border-emerald-400/40 bg-emerald-500/10 px-1.5 py-0.5 text-[12px] font-semibold text-emerald-300">@GenjiBot</span>'
      )

      /* salons en gris (fond gris) */
      .replace(
        /<#1316560101360013443>/g,
        '<span class="inline-flex items-center gap-1 rounded-md border border-zinc-400/20 bg-zinc-500/10 px-1.5 py-0.5 text-[12px] font-semibold text-zinc-300">#change-requests</span>'
      )
      .replace(
        /<#1342953312000934069>/g,
        '<span class="inline-flex items-center gap-1 rounded-md border border-zinc-400/20 bg-zinc-500/10 px-1.5 py-0.5 text-[12px] font-semibold text-zinc-300">#change-requests</span>'
      )
      .replace(
        /<#1326941087767462009>/g,
        '<span class="inline-flex items-center gap-1 rounded-md border border-zinc-400/20 bg-zinc-500/10 px-1.5 py-0.5 text-[12px] font-semibold text-zinc-300">#xp-info</span>'
      )
      .replace(
        /<#1326941138057429083>/g,
        '<span class="inline-flex items-center gap-1 rounded-md border border-zinc-400/20 bg-zinc-500/10 px-1.5 py-0.5 text-[12px] font-semibold text-zinc-300">#website-info</span>'
      )

      /* reste du formatage */
      .replace(
        /```([^`]+)```/gs,
        '<pre class="whitespace-pre-wrap rounded-lg border border-white/10 bg-zinc-900/60 p-3 text-[12px] font-mono text-zinc-200">$1</pre>'
      )
      .replace(
        /`([^`]+)`/g,
        '<code class="rounded border border-white/10 bg-zinc-900/60 px-1 py-0.5 text-[12px] font-mono text-emerald-200">$1</code>'
      )
      .replace(/\*\*\*([^*]+)\*\*\*/g, '<span class="font-extrabold italic">$1</span>')
      .replace(/\*\*([^*]+)\*\*/g, '<span class="font-bold">$1</span>')
      .replace(/\*([^*]+)\*/g, '<span class="italic">$1</span>')
      .replace(/__([^_]+)__/g, '<span class="underline">$1</span>')
      .replace(/~~([^~]+)~~/g, '<span class="line-through">$1</span>')
      .replace(
        /^>\s*(.+)$/gm,
        '<blockquote class="border-l border-white/10 pl-3 text-zinc-300">$1</blockquote>'
      )
      .replace(/###\s*([^\n]+)/g, '<h3 class="text-base font-semibold">$1</h3>')
      .replace(/\n/g, '<br>')
  );
}

/* ---------- Tenor ---------- */
async function convertTenorLinks(messageContent) {
  const tenorViewRegex = /https:\/\/tenor\.com\/view\/[\w-]+-(\d+)/g;
  const promises = [];
  let updated = messageContent;

  let match;
  while ((match = tenorViewRegex.exec(messageContent)) !== null) {
    const tenorUrl = match[0];
    const gifId = match[1];

    promises.push(
      fetchJsonStrict(`/api/newsfeed/gif?gifId=${encodeURIComponent(gifId)}`)
        .then((res) => {
          const u = res?.results?.[0]?.media_formats?.gif?.url;
          if (!u) return;
          const gifUrl = u
            .replace('https://media.tenor.com/', 'https://c.tenor.com/')
            .replace('.gif', '/tenor.gif');
          updated = updated.replace(
            tenorUrl,
            `<img src="${gifUrl}" alt="GIF Tenor" class="max-w-full h-auto rounded-lg border border-white/10">`
          );
        })
        .catch(() => {})
    );
  }

  await Promise.all(promises);
  return updated;
}

function nfEscapeHtml(s) {
  return String(s ?? '').replace(
    /[&<>"']/g,
    (m) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[m]
  );
}
function nfPrettyVal(v) {
  if (v === null || v === undefined) return '<span class="italic text-zinc-400">Empty</span>';
  const str = String(v).trim();
  if (!str || str.toLowerCase() === 'empty' || str === '—')
    return '<span class="italic text-zinc-400">Empty</span>';
  return nfEscapeHtml(str);
}

/* ---------- Video embed ---------- */
function createEmbeddedVideo(containerId, videoUrl) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let embedUrl = '';
  try {
    const url = new URL(videoUrl);
    const host = url.host;
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      const id = url.searchParams.get('v') || url.pathname.split('/')[1];
      if (id) embedUrl = `https://www.youtube.com/embed/${id}`;
    } else if (host.includes('bilibili.com')) {
      const seg = url.pathname.split('/')[1];
      if (seg) embedUrl = `https://player.bilibili.com/player.html?bvid=${seg}`;
    }
  } catch {}

  if (embedUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    );
    iframe.setAttribute('allowFullscreen', 'true');
    iframe.className = 'w-full h-full';
    container.innerHTML = '';
    container.appendChild(iframe);
  } else {
    container.innerHTML =
      '<p class="text-sm text-rose-300">La vidéo ne peut pas être intégrée.</p>';
  }
}

/* ---------- Pagination / Load more ---------- */
function renderPaginationButtons() {
  const loadMore = document.getElementById('nf-loadmore');
  if (loadMore) {
    loadMore.classList.toggle('hidden', currentPage >= totalPages);
    loadMore.onclick = () => {
      if (currentPage < totalPages) {
        currentPage += 1;
        loadNewsfeed(true);
      }
    };
  }

  const pag = document.getElementById('paginationContainer');
  if (!pag) return;
  pag.innerHTML = '';
  if (totalPages <= 1) return;

  const mkBtn = (label, disabled, cb) => {
    const b = document.createElement('button');
    b.className = `px-3 py-1.5 text-sm rounded-lg border ${disabled ? 'border-white/10 text-zinc-500 cursor-not-allowed' : 'border-white/10 hover:bg-white/5'}`;
    b.textContent = label;
    b.disabled = disabled;
    if (!disabled) b.addEventListener('click', cb);
    return b;
  };

  pag.appendChild(
    mkBtn(t('pagination.first'), currentPage === 1, () => {
      currentPage = 1;
      loadNewsfeed(false);
    })
  );
  pag.appendChild(
    mkBtn(t('pagination.prev'), currentPage === 1, () => {
      currentPage -= 1;
      loadNewsfeed(false);
    })
  );
  const span = document.createElement('span');
  span.className = 'text-sm text-zinc-400';
  span.textContent = t('pagination.page_of', { current: currentPage, total: totalPages });
  pag.appendChild(span);
  pag.appendChild(
    mkBtn(t('pagination.next'), currentPage === totalPages, () => {
      currentPage += 1;
      loadNewsfeed(false);
    })
  );
  pag.appendChild(
    mkBtn(t('pagination.last'), currentPage === totalPages, () => {
      currentPage = totalPages;
      loadNewsfeed(false);
    })
  );
}

/* ---------- Clipboard toast (Tailwind) ---------- */
function showToast(message, ok = true) {
  const el = document.createElement('div');
  el.className = `fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] rounded-xl px-4 py-2 text-sm shadow-2xl border transition-all duration-300 opacity-0 translate-y-2
    ${ok ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30' : 'bg-rose-500/20 text-rose-200 border-rose-400/30'}`;
  el.textContent = message;
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.classList.remove('opacity-0', 'translate-y-2');
  });
  setTimeout(() => {
    el.classList.add('opacity-0', 'translate-y-2');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
  }, 1200);
}
function showConfirmationMessage(m) {
  showToast(m, true);
}
function showErrorMessage(m) {
  showToast(m, false);
}

/* ---------- Utils ---------- */
function formatImageName(text) {
  return text ? text.toLowerCase().replace(/[+\-\s]/g, '') + '.png' : 'default.png';
}
function normalizeRole(role) {
  return (role || '').replace(/\s*\++$/, '');
}
function formatMapName(name) {
  return (name || 'default').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/* ---------- Filters (chips + search) ---------- */
function relabelFilterChips() {
  document.querySelectorAll('#nf-tags .nf-chip').forEach((btn) => {
    const key = (btn.dataset.filter || '').toLowerCase();
    const label = FILTER_LABELS[key];
    if (label) btn.textContent = label;
  });
}

function reorderFilterChips() {
  const wrap = document.getElementById('nf-tags');
  if (!wrap) return;
  const chipsByKey = {};
  Array.from(wrap.querySelectorAll('.nf-chip')).forEach((b) => {
    chipsByKey[(b.dataset.filter || '').toLowerCase()] = b;
  });

  Array.from(wrap.children).forEach((c) => c.classList.add('hidden'));

  FILTER_ORDER.forEach((key) => {
    const chip = chipsByKey[key];
    if (!chip) return;
    chip.classList.remove('hidden');
    wrap.appendChild(chip);
  });
}

/* ---------- Animation filtre + reset compact ---------- */
function animateFilterBarAndTweakReset() {
  __cspInit();
  const searchInput = document.getElementById('nf-search');
  const card = searchInput?.closest('.rounded-2xl');
  const searchRow = searchInput?.closest('.flex.items-center');
  const tagsRow = document.getElementById('nf-tags');
  const resetCol = document.getElementById('nf-reset')?.closest('.grid');

  if (card) {
    card.classList.add('csp-lift-enter');
    requestAnimationFrame(() => {
      card.classList.add('csp-lift-active');
      card.classList.remove('csp-lift-enter');
    });
    [searchRow, tagsRow, resetCol].filter(Boolean).forEach((el, idx) => {
      el.classList.add('csp-step-enter');
      setTimeout(
        () => {
          el.classList.add('csp-step-active');
          el.classList.remove('csp-step-enter');
        },
        120 + idx * 80
      );
    });
  }

  const resetBtn = document.getElementById('nf-reset');
  if (resetBtn) {
    resetBtn.classList.remove('text-sm', 'px-3', 'py-2', 'rounded-lg');
    resetBtn.classList.add('text-xs', 'px-2', 'py-1', 'rounded-md', 'min-h-auto');
    const svg = resetBtn.querySelector('svg');
    if (svg) {
      svg.classList.remove('h-4', 'w-4');
      svg.classList.add('h-3', 'w-3');
    }
  }
}

function bindFilters() {
  const chips = Array.from(document.querySelectorAll('.nf-chip'));
  const search = document.getElementById('nf-search');
  const resetBtn = document.getElementById('nf-reset');

  relabelFilterChips();
  reorderFilterChips();

  const urlParams = new URLSearchParams(window.location.search);
  const rawType = (urlParams.get('type') || '').toLowerCase().trim();
  selectedType = TYPE_CANON[rawType] || rawType || null;

  if (selectedType) {
    chips.forEach((ch) => {
      const isActive = ch.dataset.filter?.toLowerCase() === selectedType.toLowerCase();
      ch.toggleAttribute('data-active', isActive);
      ch.classList.toggle('bg-white/10', isActive);
    });
  }

  chips.forEach((chip) => {
    if (chip.classList.contains('hidden')) return;
    chip.addEventListener('click', () => {
      chips.forEach((c) => {
        c.removeAttribute('data-active');
        c.classList.remove('bg-white/10');
      });
      chip.setAttribute('data-active', 'true');
      chip.classList.add('bg-white/10');

      const val = chip.dataset.filter || '';
      selectedType = val && val !== 'all' ? val : null;

      const url = new URL(window.location);
      if (selectedType) url.searchParams.set('type', selectedType);
      else url.searchParams.delete('type');
      history.pushState(null, '', url);

      currentPage = 1;
      loadNewsfeed(false);
    });
  });

  search?.addEventListener('input', applySearchFilter);

  resetBtn?.addEventListener('click', () => {
    search.value = '';
    chips.forEach((c) => {
      c.removeAttribute('data-active');
      c.classList.remove('bg-white/10');
    });
    const all = chips.find(
      (c) => (c.dataset.filter || '').toLowerCase() === 'all' && !c.classList.contains('hidden')
    );
    all?.setAttribute('data-active', 'true');
    all?.classList.add('bg-white/10');

    selectedType = null;
    const url = new URL(window.location);
    url.searchParams.delete('type');
    history.pushState(null, '', url);

    currentPage = 1;
    loadNewsfeed(false);
  });
}

function applySearchFilter() {
  const q = (document.getElementById('nf-search')?.value || '').toLowerCase().trim();
  const cards = Array.from(document.querySelectorAll('#newsfeedContainer .news-card'));
  let shown = 0;
  cards.forEach((c) => {
    const text = c.textContent.toLowerCase();
    const visible = !q || text.includes(q);
    c.classList.toggle('hidden', !visible);
    if (visible) shown++;
  });

  const isEmpty = shown === 0;
  const emptyEl = document.getElementById('nf-empty');
  const loadMore = document.getElementById('nf-loadmore');

  if (emptyEl) emptyEl.classList.toggle('hidden', !isEmpty);
  if (loadMore) loadMore.classList.toggle('hidden', isEmpty);
}

/* ---------- Clipboard for map-code ---------- */
async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text ?? '');
      return true;
    } catch {}
  }
  __cspInit();
  const ta = document.createElement('textarea');
  ta.value = text ?? '';
  ta.setAttribute('readonly', '');
  ta.className = 'csp-offscreen';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  ta.setSelectionRange(0, ta.value.length);
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {}
  document.body.removeChild(ta);
  return ok;
}

document.addEventListener('click', async (e) => {
  const el = e.target.closest('.map-code');
  if (!el) return;

  const text = el.dataset.mapCode || el.textContent || '';

  const ok = await copyToClipboard(text);

  if (ok) {
    showConfirmationMessage(t('newsfeed.copy_clipboard') || 'Copié dans le presse-papiers');
  } else {
    showErrorMessage(t('newsfeed.copy_clipboard_error') || 'Échec de la copie');
  }
});

/* ---------- Translate button (Laravel API, anti-spam + cache) ---------- */
const _translateLocks = new WeakMap();
const _translateCache = new Map();

function _hashStr(s) {
  let h = 0,
    i = 0,
    len = s.length;
  while (i < len) {
    h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
  }
  return String(h >>> 0);
}

document.addEventListener('click', async (event) => {
  if (!event.target.classList.contains('translate-button')) return;

  const newsCard = event.target.closest('.news-card');
  const originalTextElement = newsCard?.querySelector('.announcement-content');
  const translatedTextElement = newsCard?.querySelector('.translated-text');
  const loadingIndicator = newsCard?.querySelector('.loading-bar');
  if (!originalTextElement || !translatedTextElement || !loadingIndicator) return;

  const originalText = originalTextElement.innerHTML.replace(/<br>/g, '\n');
  let targetLang = document.documentElement.lang || 'en';
  if (targetLang === 'jp') targetLang = 'ja';

  const emojiRegex = /https:\/\/cdn\.discordapp\.com\/emojis\/(\d+)\.png/g;
  const emojiMap = new Map();
  let match;
  while ((match = emojiRegex.exec(originalText)) !== null) {
    emojiMap.set(match[1], match[0]);
  }

  loadingIndicator.style.display = 'flex';
  event.target.disabled = true;

  try {
    const response = await fetch('/api/newsfeed/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ text: originalText, targetLang }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.message || 'Translate API error');

    const corrected = (data.translatedText || '')
      .replace(
        /https:\/\/cdn\.discordapp\.com\/emojis\/(\d+)\.png/g,
        (m, id) => emojiMap.get(id) || m
      )
      .replace(/\n/g, '<br>');

    translatedTextElement.innerHTML = corrected || 'Translation failed.';
  } catch (err) {
    console.error(err);
    translatedTextElement.innerHTML = 'Error occurred during translation.';
  } finally {
    loadingIndicator.style.display = 'none';
    event.target.disabled = false;
  }
});

// ———————————————————————————————————————————————————————————————
// COMPLETIONS
async function loadCompletions(append = false) {
  try {
    const params = new URLSearchParams({
      page_size: String(compPageSize),
      page_number: String(compPage),
    });

    const payload = await fetchJsonStrict(`/api/completions/all?${params}`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'X-CSRF-TOKEN': CSRF },
      cache: 'no-store',
      credentials: 'same-origin',
    });

    const items = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.items)
          ? payload.items
          : [];

    const firstTotal = Number(items?.[0]?.total_results);
    compTotalResults = Number.isFinite(firstTotal)
      ? firstTotal
      : Number(payload?.total_results ?? payload?.total ?? items.length) || items.length;

    compTotalPages = Math.max(1, Math.ceil(compTotalResults / compPageSize));

    const cards = await Promise.all(items.map(renderCompletionCard));
    const html = cards.join('');

    const container = document.getElementById('completionsContainer');
    if (!container) return;

    if (append) container.insertAdjacentHTML('beforeend', html);
    else container.innerHTML = html;

    container.querySelectorAll('.comp-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(6px)';
      setTimeout(() => {
        card.style.transition = 'opacity .35s ease, transform .35s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 50);
    });

    document.getElementById('comp-empty')?.classList.toggle('hidden', items.length > 0);

    const lm = document.getElementById('comp-loadmore');
    if (lm) {
      lm.classList.toggle('hidden', compPage >= compTotalPages);
      lm.onclick = () => {
        if (compPage < compTotalPages) {
          compPage += 1;
          loadCompletions(true);
        }
      };
    }
  } catch (e) {
    console.error('Erreur chargement completions:', e);
    document.getElementById('comp-empty')?.classList.remove('hidden');
  }
}

function formatSecondsRaw(val) {
  const n = Number(val);
  if (!Number.isFinite(n)) return '—';
  return Number.isInteger(n) ? n.toFixed(1) : String(n);
}

function safeUrl(u) {
  try {
    return new URL(u).href;
  } catch {
    return '';
  }
}

function kvLine(label, value) {
  return `
    <div class="inline-flex items-center gap-2 rounded-md border border-white/10 bg-zinc-900/60 px-2 py-1 text-[12px]">
      <span class="text-zinc-400">${label}</span>
      <span class="font-medium text-zinc-200">${value || '—'}</span>
    </div>`;
}

function kvLineDiff(label, diffRaw) {
  const clean = (diffRaw || '').replace(/\s*[+-]$/, '').trim();
  const color = difficultyColors[clean] || '#e5e7eb';
  const cn = ensureColorClass(color);
  return `
    <div class="inline-flex items-center gap-2 rounded-md border border-white/10 bg-zinc-900/60 px-2 py-1 text-[12px]">
      <span class="text-zinc-400">${label}</span>
      <span class="font-semibold ${cn}">${diffRaw || '—'}</span>
    </div>
  `;
}

function kvLineCopyable(label, value) {
  const safe = String(value || '').trim();
  return `
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-md border border-white/10 bg-zinc-900/60 px-2 py-1 text-[12px] hover:bg-white/10 active:scale-[0.99] transition cursor-pointer"
      data-copy-code="${safe}"
      aria-label="Copy ${label}"
      title="Copy ${label}"
    >
      <span class="text-zinc-400">${label}</span>
      <span class="font-medium text-zinc-200">${safe || '—'}</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-zinc-300 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    </button>
  `;
}

function chip(label, classes = '') {
  return `<span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${classes}">
    ${label}
  </span>`;
}

function avatarFromName(name) {
  const letter = (name || '?').trim().charAt(0).toUpperCase();
  return `<div class="h-10 w-10 rounded-lg border border-white/10 bg-white/10 flex items-center justify-center text-sm font-semibold">${letter}</div>`;
}

function resolveStatusIcon(item) {
  const m = (item?.medal || item?.legacy_medal || '').toLowerCase();
  const medal = m.includes('gold')
    ? 'gold'
    : m.includes('silver')
      ? 'silver'
      : m.includes('bronze')
        ? 'bronze'
        : '';

  const base = 'assets/verifications/new/verification/';

  if (Number(item?.rank) === 1) {
    if (medal) return `${base}wr_${medal}.avif`;
    return `${base}wr_full.avif`;
  }

  if (item?.verified) {
    if (medal) return `${base}verified_${medal}.avif`;
    return item?.completion ? `${base}verified_full.avif` : `${base}verified_completion.avif`;
  }

  if (medal) return `${base}pending_${medal}.avif`;
  return item?.completion ? `${base}pending_full.avif` : `${base}pending_completion.avif`;
}

function resolveStatusText(item) {
  if (item?.verified && item?.completion && !item?.video)
    return 'Verified screenshot submission! A clear has been confirmed without video proof.';
  if (item?.verified && item?.completion && item?.video)
    return 'Verified completion with video proof.';
  if (!item?.verified && item?.completion) return 'Submission pending review.';
  if (item?.verified && !item?.completion) return 'Verified record / time.';
  return 'Submission under review.';
}

async function fetchDiscordAvatar(user_id) {
  try {
    const response = await fetch(`/api/settings/user-avatar?user_id=${user_id}`);
    if (!response.ok) return 'assets/profile/default-avatar.png';
    const json = await response.json();
    return json.avatar_url || 'assets/profile/default-avatar.png';
  } catch (e) {
    return 'assets/profile/default-avatar.png';
  }
}

function voteKeyForItem(item) {
  return `comp:${item?.message_id ?? item?.code ?? crypto.randomUUID()}`;
}
function readSavedUpvote(key, fallback = 0) {
  try {
    const raw = localStorage.getItem(`upvote:${key}`);
    if (!raw) return { score: fallback, voted: false };
    const obj = JSON.parse(raw);
    return { score: Number(obj.score) || fallback, voted: !!obj.voted };
  } catch {
    return { score: fallback, voted: false };
  }
}
function writeSavedUpvote(key, state) {
  try {
    localStorage.setItem(`upvote:${key}`, JSON.stringify(state));
  } catch {}
}

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.nf-upvote-btn');
  if (!btn) return;
  if (btn.getAttribute('data-voted') === '1') return;

  const messageId = btn.getAttribute('data-message-id');
  const userId = String(window.user_id || '');
  if (!messageId || !userId) {
    showErrorMessage('Missing user or message id');
    return;
  }

  const prevScore = Number(btn.getAttribute('data-score') || '0');
  const scoreEl = btn.querySelector('.vote-score');
  scoreEl.textContent = String(prevScore + 1);
  btn.setAttribute('data-score', String(prevScore + 1));
  btn.setAttribute('data-voted', '1');
  btn.setAttribute('aria-pressed', 'true');

  btn.classList.remove(...UPVOTE_INACTIVE_CLASSES.split(' '));
  btn.classList.add(...UPVOTE_ACTIVE_CLASSES.split(' '));

  try {
    const res = await fetchJsonStrict('/api/completions/upvoting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRF-TOKEN': CSRF,
      },
      body: JSON.stringify({ message_id: messageId, user_id: userId }),
      cache: 'no-store',
      credentials: 'same-origin',
    });

    const newCount = Number(res?.count ?? res);
    if (Number.isFinite(newCount)) {
      scoreEl.textContent = String(newCount);
      btn.setAttribute('data-score', String(newCount));
    }
    writeSavedUpvote(voteKeyForItem({ message_id: messageId }), {
      score: Number(btn.getAttribute('data-score') || '0'),
      voted: true,
    });
  } catch (err) {
    btn.setAttribute('data-voted', '0');
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('data-score', String(prevScore));
    scoreEl.textContent = String(prevScore);
    btn.classList.remove(...UPVOTE_ACTIVE_CLASSES.split(' '));
    btn.classList.add(...UPVOTE_INACTIVE_CLASSES.split(' '));
    showErrorMessage('Upvote failed');
    console.error(err);
  }
});

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text ?? '');
      return true;
    } catch {}
  }
  __cspInit();
  const ta = document.createElement('textarea');
  ta.value = text ?? '';
  ta.setAttribute('readonly', '');
  ta.className = 'csp-offscreen';
  document.body.appendChild(ta);
  ta.select();
  ta.setSelectionRange(0, ta.value.length);
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {}
  document.body.removeChild(ta);
  return ok;
}

function upvotePillHtml(item) {
  const key = voteKeyForItem(item);
  const initial = Number(item?.upvotes ?? 0);
  const saved = readSavedUpvote(key, initial);
  const active = !!saved.voted;

  const base =
    'nf-upvote-btn group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 ' +
    'text-[12px] font-semibold tabular-nums select-none transition cursor-pointer';

  return `
    <button type="button"
            class="${base} ${active ? UPVOTE_ACTIVE_CLASSES : UPVOTE_INACTIVE_CLASSES}"
            data-upvotekey="${key}"
            data-score="${saved.score}"
            data-voted="${active ? '1' : '0'}"
            data-message-id="${item?.message_id ?? ''}"
            aria-pressed="${active ? 'true' : 'false'}"
            aria-label="Upvote">
      <span class="inline-flex h-5 w-5 items-center justify-center">
        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 16V20M6 4V8M7 18H3M8 6H4M13 4L14.7528 8.44437C14.9407 8.92083 15.0347 9.15906 15.1786 9.35994C15.3061 9.538 15.462 9.69391 15.6401 9.82143C15.8409 9.9653 16.0792 10.0593 16.5556 10.2472L21 12L16.5556 13.7528C16.0792 13.9407 15.8409 14.0347 15.6401 14.1786C15.462 14.3061 15.3061 14.462 15.1786 14.6401C15.0347 14.8409 14.9407 15.0792 14.7528 15.5556L13 20L11.2472 15.5556C11.0593 15.0792 10.9653 14.8409 10.8214 14.6401C10.6939 14.462 10.538 14.3061 10.3599 14.1786C10.1591 14.0347 9.92083 13.9407 9.44437 13.7528L5 12L9.44437 10.2472C9.92083 10.0593 10.1591 9.9653 10.3599 9.82143C10.538 9.69391 10.6939 9.538 10.8214 9.35994C10.9653 9.15906 11.0593 8.92083 11.2472 8.44437L13 4Z"/>
        </svg>
      </span>
      <span class="vote-score">${saved.score}</span>
    </button>
  `;
}

function watchPillHtml(videoUrl) {
  if (!videoUrl) return '';
  return `
    <a href="${videoUrl}" target="_blank" rel="noopener"
       class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5
              text-[12px] font-semibold text-zinc-200 hover:bg-white/10">
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M8 5v14l11-7z"></path>
      </svg>
      Watch
    </a>
  `;
}

async function renderCompletionCard(item) {
  const nickname = item?.name || 'Unknown';
  const aka = item?.also_known_as || '';
  const akaText = [aka].filter(Boolean).join(', ');
  const mapName = item?.map_name || 'Unknown map';
  const mapDifficulty = item?.difficulty || 'Unknown difficulty';
  const code = item?.code || '';
  const timeFmt = formatSecondsRaw(item?.time);
  const sshot = safeUrl(item?.screenshot);
  const video = safeUrl(item?.video);
  const userId = item?.user_id;

  const statusIcon = resolveStatusIcon(item);
  const statusText = resolveStatusText(item);
  const avatar = await fetchDiscordAvatar(userId);

  return `
    <article class="comp-card h-full rounded-2xl border border-white/10 bg-zinc-900/60 p-3 sm:p-4">
      <!-- HEADER compact -->
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-start gap-3 min-w-0">
          <img src="${avatar}" alt="${nickname}"
               class="h-10 w-10 rounded-full object-cover ring-2 ring-white/10">
          <div class="min-w-0">
            <h3 class="text-base sm:text-lg font-extrabold tracking-tight truncate">
              New Submission from ${nickname}
            </h3>

            <div class="mt-2 flex flex-wrap gap-1.5">
              ${code ? kvLineCopyable('Code', code) : kvLine('Code', code)}
              ${kvLine('Map', mapName)}
              ${kvLineDiff('Difficulty', mapDifficulty)}
              ${kvLine('Time', timeFmt)}
              ${kvLine('Also Known As', akaText || '—')}
            </div>
          </div>
        </div>
        <img src="${statusIcon}" alt="status" class="h-10 w-10 sm:h-12 sm:w-12 select-none">
      </div>

      <!-- STATUS LINE -->
      <p class="mt-2 text-xs sm:text-sm text-zinc-200 line-clamp-2">${statusText}</p>

      <!-- SCREENSHOT compact -->
      ${
        sshot
          ? `
        <button
          type="button"
          class="block mt-3 w-full group"
          data-open-screenshot="${sshot}"
          title="Open screenshot"
        >
          <div class="relative aspect-[16/9] w-full">
            <img
              src="${sshot}"
              alt="Screenshot"
              class="absolute cursor-pointer inset-0 h-full w-full object-contain rounded-xl transition group-hover:opacity-95"
              onerror="this.closest('button')?.remove()"
            >
          </div>
        </button>
      `
          : ``
      }

      <!-- FOOT compact -->
      <div class="mt-3 flex items-center gap-2">
        ${upvotePillHtml(item)}
        ${watchPillHtml(video)}
      </div>
    </article>
  `;
}

const ScreenshotLightbox = (() => {
  let overlay = document.getElementById('ssModalOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'ssModalOverlay';
    overlay.className = 'fixed inset-0 z-50 hidden p-4 bg-black/70 backdrop-blur-sm';
    overlay.innerHTML = `
      <div class="mx-auto max-w-5xl w-full h-full flex items-center justify-center">
        <img id="ssModalImg" src="" alt="Screenshot"
             class="max-h-[90vh] w-auto rounded-2xl shadow-2xl">
      </div>`;
    document.body.appendChild(overlay);
  }

  const img = overlay.querySelector('#ssModalImg');

  function open(url) {
    img.src = url || '';
    overlay.classList.remove('hidden');
  }
  function close() {
    overlay.classList.add('hidden');
    img.src = '';
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  return { open, close };
})();

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-open-screenshot]');
  if (!btn) return;
  const url = btn.getAttribute('data-open-screenshot');
  if (url) ScreenshotLightbox.open(url);
});

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-copy-code]');
  if (!btn) return;
  const val = btn.getAttribute('data-copy-code') || '';
  const ok = await copyTextToClipboard(val);
  if (ok) {
    showConfirmationMessage(t?.('newsfeed.copy_clipboard') || 'Copied to clipboard');
  } else {
    showErrorMessage(t?.('newsfeed.copy_clipboard_error') || 'Failed to copy');
  }
});

/* =========================
   RENDER CHANGELOGS
   ========================= */
async function hydrateChangelogsSidebar() {
  const box = document.getElementById('nf-changelogs');
  if (!box) return;

  try {
    const res = await fetch('/api/newsfeed/changelogs?limit=1', {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      credentials: 'same-origin',
    });

    const data = await res.json().catch(() => ({}));
    if (
      !res.ok ||
      !data ||
      !Array.isArray(data.releases) ||
      !data.releases.length ||
      data.rate_limited
    ) {
      return;
    }

    const r = data.releases[0];
    const date = r.published_at ? new Date(r.published_at) : null;
    const dateText = date
      ? date.toLocaleDateString(document.documentElement.lang || 'en', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        })
      : '';

    const rawHtml = r.html || '';
    const bodyHtml =
      rawHtml ||
      (Array.isArray(r.lines)
        ? `<ul>${r.lines.map((li) => `<li>${nfEscapeHtml(li)}</li>`).join('')}</ul>`
        : '');

    const decorated = decorateGithubHtml(bodyHtml);

    box.innerHTML = `
      <article class="rounded-xl border border-white/10 bg-zinc-900/50 p-3">
        <header class="flex items-center gap-2">
          <h4 class="text-xl font-extrabold tracking-tight">${nfEscapeHtml(r.name || r.tag || 'Release')}</h4>
          <span class="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">Latest</span>
        </header>
        ${dateText ? `<div class="mt-1 text-xs text-zinc-400">${dateText}</div>` : ''}

        <div class="mt-3 changelog-body prose prose-invert prose-sm max-w-none">
          ${decorated}
        </div>
      </article>
    `;
  } catch (e) {
    console.error('changelogs fetch failed', e);
  }
}

function decorateGithubHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';

  tmp.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) => {
    h.classList.add('font-semibold', 'text-zinc-100', 'mt-3', 'first:mt-0');
    if (h.tagName === 'H2') h.classList.add('text-lg');
    if (h.tagName === 'H3') h.classList.add('text-base');
  });
  tmp
    .querySelectorAll('ul')
    .forEach((ul) => ul.classList.add('list-disc', 'pl-5', 'space-y-1', 'marker:text-zinc-400'));
  tmp
    .querySelectorAll('ol')
    .forEach((ol) => ol.classList.add('list-decimal', 'pl-5', 'space-y-1', 'marker:text-zinc-400'));
  tmp.querySelectorAll('li').forEach((li) => li.classList.add('leading-relaxed'));
  tmp
    .querySelectorAll('p')
    .forEach((p) => p.classList.add('text-sm', 'text-zinc-300', 'leading-relaxed', 'mt-2'));
  tmp
    .querySelectorAll('code')
    .forEach((code) =>
      code.classList.add(
        'rounded',
        'border',
        'border-white/10',
        'bg-zinc-900/60',
        'px-1',
        'py-0.5',
        'text-[12px]',
        'font-mono',
        'text-emerald-200'
      )
    );
  tmp.querySelectorAll('a').forEach((a) => {
    a.classList.add('text-brand-300', 'hover:text-brand-200', 'underline', 'underline-offset-2');
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });

  return tmp.innerHTML;
}

/* =========================
   CHANGELOGS MODAL
   ========================= */
document.addEventListener('click', (e) => {
  const a = e.target.closest('#openChangelogsModal');
  if (!a) return;
  e.preventDefault();
  openChangelogsModal();
});

function openChangelogsModal() {
  const overlay = document.getElementById('changelogsModalOverlay');
  const box = document.getElementById('changelogsModalBox');
  const container = document.getElementById('changelogsModalContainer');
  if (!overlay || !box || !container) return;

  container.className =
    'w-full rounded-2xl border border-white/10 bg-zinc-950/90 ' +
    'shadow-2xl ring-1 ring-white/10 overflow-hidden';

  container.innerHTML = `
    <header class="sticky top-0 bg-gradient-to-b from-zinc-950/95 to-zinc-950/80
                   backdrop-blur border-b border-white/10 px-4 sm:px-5 py-3
                   flex items-center justify-between">
      <h2 class="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
        <span class="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/5">
          <svg class="h-3.5 w-3.5 text-zinc-300" viewBox="0 0 24 24"><path fill="currentColor" d="M20 6H4v12h16V6Zm-2 2v2h-5V8h5ZM6 8h5v2H6V8Zm12 4v4h-5v-4h5ZM6 12h5v4H6v-4Z"/></svg>
        </span>
        Changelogs
      </h2>
      <button type="button" class="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
              id="closeChangelogsModal">Esc</button>
    </header>

    <div id="changelogsScroll"
         class="max-h-[80vh] overflow-y-auto p-4 sm:p-5 space-y-5">
      <div class="animate-pulse space-y-3">
        <div class="h-5 w-1/3 rounded-md bg-white/5"></div>
        <div class="h-4 w-2/3 rounded-md bg-white/5"></div>
        <div class="h-4 w-1/2 rounded-md bg-white/5"></div>
      </div>
    </div>
  `;

  overlay.classList.remove('hidden');
  box.classList.add('opacity-0', 'scale-95', 'transition', 'duration-200', 'ease-out');
  requestAnimationFrame(() => {
    box.classList.remove('opacity-0', 'scale-95');
    box.classList.add('opacity-100', 'scale-100');
  });

  fetch('/api/newsfeed/changelogs?limit=10', {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    credentials: 'same-origin',
  })
    .then((r) => r.json())
    .then((data) => {
      const wrap = document.getElementById('changelogsScroll');
      if (!wrap) return;

      if (!data || data.rate_limited || !Array.isArray(data.releases) || !data.releases.length) {
        wrap.innerHTML = `<p class="text-sm text-zinc-300">No changelogs available.</p>`;
        return;
      }

      const lang = document.documentElement.lang || 'en';
      const blocks = data.releases
        .map((rel, idx) => {
          const name = rel.name || rel.tag || 'Release';
          const dt = rel.published_at ? new Date(rel.published_at) : null;
          const dateTxt = dt
            ? dt.toLocaleDateString(lang, { year: 'numeric', month: 'short', day: '2-digit' })
            : '';
          const html =
            rel.html ||
            (Array.isArray(rel.lines)
              ? `<ul>${rel.lines.map((li) => `<li>${nfEscapeHtml(li)}</li>`).join('')}</ul>`
              : '');
          const body = decorateGithubHtml(html);

          return `
        <article class="rounded-xl border border-white/10 bg-zinc-900/50 p-3 sm:p-4">
          <div class="flex items-center gap-2">
            <h4 class="text-lg font-extrabold tracking-tight">${nfEscapeHtml(name)}</h4>
            ${idx === 0 ? `<span class="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">Latest</span>` : ``}
          </div>
          ${dateTxt ? `<div class="mt-1 text-xs text-zinc-400">${dateTxt}</div>` : ``}
          <div class="mt-3 prose prose-invert prose-sm max-w-none changelog-body">${body}</div>
          ${rel.url ? `<a class="mt-3 inline-flex items-center gap-1.5 text-xs text-brand-300 hover:text-brand-200 underline underline-offset-2" href="${rel.url}" target="_blank" rel="noopener">View on GitHub</a>` : ``}
        </article>
      `;
        })
        .join('');

      wrap.innerHTML = blocks;
    })
    .catch(() => {
      const wrap = document.getElementById('changelogsScroll');
      if (wrap) wrap.innerHTML = `<p class="text-sm text-rose-300">Failed to load changelogs.</p>`;
    });

  document
    .getElementById('closeChangelogsModal')
    ?.addEventListener('click', closeChangelogsModal, { once: true });
  overlay.addEventListener('click', onOverlayClickOnce);
  document.addEventListener('keydown', onEscOnce);
}

function onOverlayClickOnce(e) {
  const overlay = document.getElementById('changelogsModalOverlay');
  const box = document.getElementById('changelogsModalBox');
  if (overlay && box && e.target === overlay) closeChangelogsModal();
}

function onEscOnce(e) {
  if (e.key === 'Escape') closeChangelogsModal();
}

function closeChangelogsModal() {
  const overlay = document.getElementById('changelogsModalOverlay');
  const box = document.getElementById('changelogsModalBox');
  if (!overlay || !box) return;

  box.classList.add('opacity-0', 'scale-95');
  box.classList.remove('opacity-100', 'scale-100');
  setTimeout(() => {
    overlay.classList.add('hidden');
    overlay.removeEventListener('click', onOverlayClickOnce);
    document.removeEventListener('keydown', onEscOnce);
  }, 180);
}
