import { cdnAsset } from "../utils/cdn";

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

/* ===== CSP helpers ===== */
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

// === Copy-code logging (Utilities) ==========================================
function normalizeMapCode(raw) {
  return String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
}

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

async function logMapCopy(code, source = 'web') {
  try {
    const k = `logcc:${code}`;
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

document.addEventListener('DOMContentLoaded', () => { void getClientIp(); });

/* ---------- Affichage vs. type canonique ---------- */
const FILTER_LABELS = translations?.tags
  ? {
      all: translations.tags.all,
      announcement: translations.tags.announcement,
      role: translations.tags.role,
      record: translations.tags.record,
      guide: translations.tags.guide,
      new_map: translations.tags.new_map,
      map_edit: translations.tags.map_edit,
      legacy_record: translations.tags.legacy_record,
      archive: translations.tags.archive,
      unarchive: translations.tags.unarchive,
      linked_map: translations.tags.linked_map,
      unlinked_map: translations.tags.unlinked_map,
    }
  : {
      all: 'All',
      announcement: 'Announcements',
      role: 'Roles',
      record: 'Records',
      guide: 'Guides',
      new_map: 'New maps',
      map_edit: 'Map edit',
      legacy_record: 'Legacy record',
      archive: 'Archive',
      unarchive: 'Unarchive',
      linked_map: 'Linked map',
      unlinked_map: 'Unlinked map',
    };

const FILTER_ORDER = ['all', 'new_map', 'announcement', 'role', 'record', 'guide', 'map_edit', 'legacy_record', 'archive', 'unarchive', 'linked_map', 'unlinked_map'];

const TYPE_CANON = {
  all: 'all',
  announcement: 'announcement',
  role: 'role',
  record: 'record',
  guide: 'guide',
  new_map: 'new_map',
  map_edit: 'map_edit',
  legacy_record: 'legacy_record',
  archive: 'archive',
  unarchive: 'unarchive',
  linked_map: 'linked_map',
  unlinked_map: 'unlinked_map',
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
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json', 'X-CSRF-TOKEN': CSRF, },
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
  const overlay = ensureDetailsModalShell();
  const box = document.getElementById('detailsModalBox');
  if (!overlay || !box) return;

  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  document.body.classList.add('overflow-hidden');

  box.classList.add('opacity-0', 'scale-95');

  requestAnimationFrame(() => {
    box.classList.remove('opacity-0', 'scale-95');
    box.classList.add('opacity-100', 'scale-100');
  });

  const closeBtn = overlay.querySelector('[data-close-details]');
  closeBtn?.focus({ preventScroll: true });
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
    document.body.classList.remove('overflow-hidden');
  }, 50);
}

/* ---------- Modal Map Details (PATCH) ---------- */
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-close-details]')) {
    closeDetailsModal();
    return;
  }

  const overlay = document.getElementById('detailsModalOverlay');
  const box = document.getElementById('detailsModalBox');
  if (!overlay || !box) return;
  if (overlay.classList.contains('hidden')) return;

  if (e.target === overlay) {
    closeDetailsModal();
  }
});

function closeDetailsModal() {
  twModalClose();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDetailsModal();
});

document.addEventListener('DOMContentLoaded', () => {
  ensureDetailsModalShell();
});

document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-open-map-details]');
  if (!a) return;
  e.preventDefault();
  const code = a.getAttribute('data-map-code');
  if (code) openMapDetailsModal(code);
});

async function _fetchMapDetailsByCode(mapCode) {
  const enc = encodeURIComponent(mapCode || '');
  const url = `/api/maps?code=${enc}`;
  const r = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
    cache: 'no-store',
  });
  const ct = r.headers.get('content-type') || '';
  if (!r.ok) throw new Error(`HTTP ${r.status} ${await r.text().catch(()=> '')}`);
  return ct.includes('application/json') ? r.json() : JSON.parse(await r.text());
}

const __mm = {
  esc: (s) =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;'),
  orNA: (v) => (v == null || v === '' ? (typeof t === 'function' ? t('common.na') : 'N/A') : v),
  secondsToText: (n) => {
    if (n == null || isNaN(Number(n))) return typeof t === 'function' ? t('common.na') : 'N/A';
    const s = Math.floor(Number(n));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, '0')}`;
  },
  fmtDate: (iso) => {
    if (!iso) return typeof t === 'function' ? t('common.na') : 'N/A';
    try {
      const d = new Date(iso);
      return d.toLocaleString(document.documentElement.lang || 'en', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  },
  starBar: (score, max = 6) => {
    const n = Math.max(0, Math.min(max, Number(score) || 0));
    const full = Math.floor(n);
    const half = n - full >= 0.5 ? 1 : 0;
    const empty = max - full - half;
    return (
      `<span class="text-amber-300">${'★'.repeat(full)}</span>` +
      (half ? `<span class="text-amber-300/60">★</span>` : '') +
      `<span class="text-zinc-600">${'☆'.repeat(empty)}</span>` +
      `<span class="ml-2 text-xs text-zinc-400 align-[1px]">(${n.toFixed(2)}/${max})</span>`
    );
  },
  badge: (label, tone = 'zinc') => {
    const toneMap = {
      emerald: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
      sky: 'border-sky-400/30 bg-sky-500/10 text-sky-200',
      amber: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
      red: 'border-rose-400/30 bg-rose-500/10 text-rose-200',
      violet: 'border-violet-400/30 bg-violet-500/10 text-violet-200',
      zinc: 'border-white/10 bg-white/10 text-zinc-200',
    };
    const cls = toneMap[tone] || toneMap.zinc;
    return `<span class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${cls}">${label}</span>`;
  },
  diffTint: (label) => {
    const k = (label || '').replace(/\s*[+-]$/, '').trim();
    return difficultyTextClasses?.[k] || 'text-zinc-200';
  },
  listChips: (arr) =>
    (arr || [])
      .map(
        (s) =>
          `<span class="rounded-md border border-white/10 bg-zinc-900/60 px-2 py-0.5 text-[11px] text-zinc-200">${__mm.esc(
            s
          )}</span>`
      )
      .join(''),
};

/* --- Shell / styles --- */
function ensureDetailsModalShell() {
  let overlay = document.getElementById('detailsModalOverlay');
  if (overlay) return overlay;

  overlay = document.createElement('div');
  overlay.id = 'detailsModalOverlay';
  overlay.className = 'hidden';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  overlay.innerHTML = `
    <div id="detailsModalBox" class="relative pointer-events-auto">
      <button type="button"
              class="absolute right-4 top-4 z-10 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-zinc-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              data-close-details aria-label="Close">✕</button>
      <div id="modalDetailsContainer"></div>
    </div>
  `;
  document.body.appendChild(overlay);
  twModalStyleShell();
  return overlay;
}

document.addEventListener('DOMContentLoaded', ensureDetailsModalShell);

/* --- Open modal --- */
function openMapDetailsModal(mapCode) {
  ensureDetailsModalShell();
  twModalStyleShell();

  const overlay   = document.getElementById('detailsModalOverlay');
  const box       = document.getElementById('detailsModalBox');
  const container = document.getElementById('modalDetailsContainer');
  if (!overlay || !box || !container) return;

  box.classList.add('w-full','max-w-4xl','max-h-[86vh]','flex','flex-col');
  container.classList.remove('overflow-hidden');
  container.classList.add('max-h-[78vh]','overflow-y-auto');

  container.innerHTML = `
    <div class="relative">
      <header class="relative">
        <div class="relative h-56 sm:h-64 md:h-72 lg:h-80 w-full overflow-hidden">
          <div class="absolute inset-0 animate-pulse bg-[linear-gradient(90deg,rgba(255,255,255,.04),rgba(255,255,255,.08),rgba(255,255,255,.04))] bg-[length:200%_100%]"></div>
        </div>
      </header>

      <div class="p-5 space-y-6">
        <div class="space-y-2">
          <div class="h-7 w-56 rounded bg-white/10 animate-pulse"></div>
          <div class="h-4 w-40 rounded bg-white/10 animate-pulse"></div>
        </div>

        <section class="grid gap-3 sm:grid-cols-3">
          <div class="h-16 rounded-xl border border-white/10 bg-white/5 animate-pulse"></div>
          <div class="h-16 rounded-xl border border-white/10 bg-white/5 animate-pulse"></div>
          <div class="h-16 rounded-xl border border-white/10 bg-white/5 animate-pulse"></div>
        </section>

        <section class="grid gap-5 lg:grid-cols-3">
          <div class="h-28 rounded-xl border border-white/10 bg-white/5 animate-pulse"></div>
          <div class="h-28 rounded-xl border border-white/10 bg-white/5 animate-pulse"></div>
          <div class="h-28 rounded-xl border border-white/10 bg-white/5 animate-pulse"></div>
        </section>

        <section class="grid gap-5 md:grid-cols-3">
          <div class="h-28 rounded-xl border border-white/10 bg-white/5 animate-pulse"></div>
          <div class="h-28 rounded-xl border border-white/10 bg-white/5 animate-pulse"></div>
        </section>

        <section class="rounded-xl border border-white/10 bg-white/5 p-4">
          <div class="h-5 w-24 rounded bg-white/10 animate-pulse"></div>
          <div class="mt-3 h-20 rounded bg-white/10 animate-pulse"></div>
        </section>
      </div>
    </div>
  `;

  twModalOpen();

  const medalItemSafe = (name, img, timeText) => `
    <div class="medal-item grid grid-cols-[auto,1fr] items-start gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 overflow-hidden">
      <img src="${img}" alt="${name}" class="h-6 w-6 shrink-0 rounded object-contain"/>
      <div class="min-w-0 text-left">
        <div class="font-semibold text-xs whitespace-normal break-words normal-case leading-tight">${name}</div>
        <div class="text-[11px] text-zinc-400 whitespace-normal break-words normal-case leading-tight">${timeText}</div>
      </div>
    </div>
  `;

  _fetchMapDetailsByCode(mapCode)
    .then((json) => {
      const map = Array.isArray(json) ? json[0] : json?.data?.[0] || json;
      if (!map) throw new Error('Map not found');

      const name        = __mm.orNA(map.map_name);
      const code        = __mm.orNA(map.code ?? map.map_code);
      const category    = __mm.orNA(map.category);
      const difficulty  = __mm.orNA(map.difficulty);
      const diffTint    = __mm.diffTint(map.difficulty);
      const cp          = map.checkpoints ?? (typeof t === 'function' ? t('common.na') : 'N/A');
      const rating      = map.ratings ?? null;
      const rawDiff     = map.raw_difficulty ?? null;
      const official    = !!map.official;
      const playtesting = map.playtesting || null;
      const archived    = !!map.archived;
      const hidden      = !!map.hidden;
      const banner =
        map.map_banner ||
        map.banner_url ||
        cdnAsset(
          `assets/map_banners/${String(map.map_name || '')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')}.png`
        );
      const mechanics    = Array.isArray(map.mechanics) ? map.mechanics : [];
      const restrictions = Array.isArray(map.restrictions) ? map.restrictions : [];
      const tags         = Array.isArray(map.tags) ? map.tags : [];
      const desc =
        (map.description && String(map.description).trim()) ||
        (typeof t === 'function' ? t('common.no_description') : 'No description');
      const createdAt = map.created_at ? __mm.fmtDate(map.created_at) : null;
      const updatedAt = map.updated_at ? __mm.fmtDate(map.updated_at) : null;

      const creators = (Array.isArray(map.creators) ? map.creators : [])
        .map((c) => {
          const star = c.is_primary ? '⭐ ' : '';
          return `<span class="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[12px] text-zinc-200">${star}${__mm.esc(
            c.name || c.id || ''
          )}</span>`;
        })
        .join('');

      const badges = [
        category ? __mm.badge(__mm.esc(category), 'sky') : '',
        difficulty ? __mm.badge(`<span class="${diffTint}">${__mm.esc(difficulty)}</span>`, 'zinc') : '',
        official ? __mm.badge('Official', 'emerald') : '',
        playtesting ? __mm.badge(__mm.esc(playtesting), playtesting === 'Approved' ? 'emerald' : 'amber') : '',
        archived ? __mm.badge('Archived', 'amber') : '',
        hidden ? __mm.badge('Hidden', 'red') : '',
      ].filter(Boolean).join('');

      const gold   = map.medals?.gold ?? null;
      const silver = map.medals?.silver ?? null;
      const bronze = map.medals?.bronze ?? null;

      const medalsHtml = `
        ${gold   != null ? medalItemSafe('Gold',   cdnAsset('assets/medals/gold.png'),   __mm.secondsToText(gold))   : ''}
        ${silver != null ? medalItemSafe('Silver', cdnAsset('assets/medals/silver.png'), __mm.secondsToText(silver)) : ''}
        ${bronze != null ? medalItemSafe('Bronze', cdnAsset('assets/medals/bronze.png'), __mm.secondsToText(bronze)) : ''}
      `;

      const firstGuide = Array.isArray(map.guides) && map.guides.length ? String(map.guides[0]) : '';
      const vidId = `videoContainer-modal-${__mm.esc(code).replace(/[^a-z0-9_-]/gi,'')}`;

      container.innerHTML = `
        <div class="relative">
          <!-- Bandeau : uniquement la bannière -->
          <header class="relative">
            <div class="relative h-56 sm:h-64 md:h-72 lg:h-80 w-full overflow-hidden">
              <img src="${__mm.esc(banner)}" alt="${__mm.esc(name)} Banner"
                   class="absolute inset-0 h-full w-full object-cover" data-hide-on-error>
              <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
            </div>
          </header>

          <!-- Contenu scrollable -->
          <div class="p-5 space-y-6">
            <!-- Titre + code + badges -->
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div class="min-w-0">
                <h2 class="text-2xl font-bold tracking-tight text-zinc-100">${__mm.esc(name)}</h2>
                <div class="mt-1 flex items-center gap-2 text-sm">
                  <code class="map-code cursor-pointer rounded bg-black/30 px-2 py-0.5 text-[12px] font-mono text-emerald-200"
                        data-copy-code="${__mm.esc(code)}">#${__mm.esc(code)}</code>
                  <span class="text-zinc-500">·</span>
                  <span class="text-zinc-300">
                    ${(typeof t === 'function' ? t('thead.mapCheckpoints') : 'Checkpoints')}:
                    <strong class="text-zinc-100">${__mm.esc(cp)}</strong>
                  </span>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2">${badges}</div>
            </div>

            <!-- Stats principales -->
            <section class="grid gap-3 sm:grid-cols-3">
              ${statCard((typeof t === 'function' ? t('thead.mapQuality') : 'Rating'), __mm.starBar(rating ?? 0))}
              ${statCard('Raw diff.', rawDiff == null ? __mm.orNA(null) : `<span class="font-mono">${Number(rawDiff).toFixed(2)}</span>`)}
              ${statCard((typeof t === 'function' ? t('thead.mapCategory') : 'Category'), __mm.esc(category))}
            </section>

            <!-- Créateurs + Médailles + Vidéo -->
            <section class="grid gap-5 lg:grid-cols-3">
              <!-- Créateurs -->
              <div class="rounded-xl border border-white/10 bg-white/5 p-4">
                <div class="mb-2 text-[11px] uppercase tracking-wide text-zinc-400">
                  ${(typeof t === 'function' ? t('thead.mapCreators') : 'Creators')}
                </div>
                ${
                  creators
                    ? `<div class="flex flex-wrap gap-2">${creators}</div>`
                    : `<div class="text-sm text-zinc-400">${(typeof t === 'function' ? t('common.na') : 'N/A')}</div>`
                }
              </div>

              <!-- Médailles (overflow-safe) -->
              <div class="rounded-xl border border-white/10 bg-white/5 p-4">
                <div class="mb-2 text-[11px] uppercase tracking-wide text-zinc-400">
                  ${(typeof t === 'function' ? t('thead.mapMedals') : 'Medals')}
                </div>
                ${
                  (gold != null || silver != null || bronze != null)
                    ? `<div class="grid grid-cols-3 gap-2">${medalsHtml}</div>`
                    : `<div class="text-sm text-zinc-400">${(typeof t === 'function' ? t('common.na') : 'N/A')}</div>`
                }
              </div>

              <!-- Guide vidéo -->
              <div class="rounded-xl border border-white/10 bg-white/5 p-4">
                <div class="mb-2 text-[11px] uppercase tracking-wide text-zinc-400">
                  ${(typeof t === 'function' ? t('newsfeed.video_label') : 'Video')}
                </div>
                ${
                  firstGuide
                    ? `
                      <div id="${vidId}"
                           class="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-zinc-900/60"
                           data-video-url="${__mm.esc(firstGuide)}">
                        <div class="absolute inset-0 animate-pulse bg-[linear-gradient(90deg,rgba(255,255,255,.04),rgba(255,255,255,.08),rgba(255,255,255,.04))] bg-[length:200%_100%]"></div>
                      </div>
                      <div class="mt-2">
                        <a href="${__mm.esc(firstGuide)}" target="_blank" rel="noopener"
                           class="inline-flex items-center justify-center rounded-md border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs text-sky-200 hover:bg-sky-500/20">
                          ${(typeof t === 'function' ? t('newsfeed.watch_guide') : 'Watch guide')}
                        </a>
                      </div>
                    `
                    : `<div class="text-sm text-zinc-400">${(typeof t === 'function' ? t('common.na') : 'N/A')}</div>`
                }
              </div>
            </section>

            <!-- Mécaniques & Restrictions -->
            <section class="grid gap-5 md:grid-cols-3">
              <div class="rounded-xl border border-white/10 bg-white/5 p-4">
                <div class="mb-2 text-[11px] uppercase tracking-wide text-zinc-400">
                  ${(typeof t === 'function' ? t('thead.mapMechanics') : 'Mechanics')}
                </div>
                ${
                  mechanics.length
                    ? `<div class="flex flex-wrap gap-1.5">${__mm.listChips(mechanics)}</div>`
                    : `<div class="text-sm text-zinc-400">${(typeof t === 'function' ? t('common.na') : 'N/A')}</div>`
                }
              </div>

              <div class="rounded-xl border border-white/10 bg-white/5 p-4">
                <div class="mb-2 text-[11px] uppercase tracking-wide text-zinc-400">
                  ${(typeof t === 'function' ? t('thead.mapRestrictions') : 'Restrictions')}
                </div>
                ${
                  restrictions.length
                    ? `<div class="flex flex-wrap gap-1.5">${__mm.listChips(restrictions)}</div>`
                    : `<div class="text-sm text-zinc-400">${(typeof t === 'function' ? t('common.na') : 'N/A')}</div>`
                }
              </div>

              <div class="rounded-xl border border-white/10 bg-white/5 p-4">
                <div class="mb-2 text-[11px] uppercase tracking-wide text-zinc-400">
                  ${(typeof t === 'function' ? (t('thead.mapTags') || t('common.tags')) : null) || 'Tags'}
                </div>
                ${
                  tags.length
                    ? `<div class="flex flex-wrap gap-1.5">${__mm.listChips(tags)}</div>`
                    : `<div class="text-sm text-zinc-400">${(typeof t === 'function' ? t('common.na') : 'N/A')}</div>`
                }
              </div>
            </section>

            <!-- Description -->
            <section class="rounded-xl border border-white/10 bg-white/5 p-4">
              <div class="mb-2 text-[11px] uppercase tracking-wide text-zinc-400">
                ${(typeof t === 'function' ? t('thead.mapDescription') : 'Description')}
              </div>
              <p class="whitespace-pre-wrap leading-relaxed text-zinc-200 break-words">${__mm.esc(desc)}</p>
            </section>

            <!-- Footer dates -->
            <footer class="flex flex-wrap items-center gap-3 border-t border-white/10 pt-3 text-[12px] text-zinc-400">
              ${createdAt ? `<span>${(typeof t === 'function' ? t('common.created_at') : 'Created')}: ${__mm.esc(createdAt)}</span>` : ''}
              ${updatedAt ? `<span>${(typeof t === 'function' ? t('common.updated_at') : 'Updated')}: ${__mm.esc(updatedAt)}</span>` : ''}
            </footer>
          </div>
        </div>
      `;

      if (firstGuide && typeof mountAllGuideVideos === 'function') {
        const scope = container.querySelector(`#${vidId}`)?.parentElement || container;
        mountAllGuideVideos(scope);
      }
    })
    .catch((err) => {
      container.innerHTML = `
        <div class="p-5">
          <p class="text-sm text-rose-300">${(typeof t === 'function' ? t('common.error') : 'Error')} fetching map details</p>
          <pre class="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-zinc-900/60 p-3 text-[12px] text-zinc-300">${__mm.esc(String(err))}</pre>
        </div>
      `;
      console.error(err);
    });
}

/* --- small pieces --- */
function statCard(label, valueHtml) {
  return `
    <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <div class="text-[11px] uppercase tracking-wide text-zinc-400">${label}</div>
      <div class="mt-1 text-sm text-zinc-100">${valueHtml}</div>
    </div>`;
}
function medalItem(name, img, timeText) {
  return `
    <div class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
      <img src="${img}" alt="${name}" class="h-6 w-6 rounded object-cover"/>
      <div class="text-xs">
        <div class="font-semibold">${name}</div>
        <div class="text-zinc-400">${timeText}</div>
      </div>
    </div>`;
}

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

    const serverTotal = Number(raw?.total_results ?? raw?.total);
    const hasMoreFromApi = typeof raw?.has_more === 'boolean' ? raw.has_more : null;
    const hasMoreFallback = items.length === pageSize;

    if (Number.isFinite(serverTotal)) {
      totalResults = serverTotal;
      totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
    } else {
      totalResults = currentPage * pageSize + (hasMoreFallback ? 1 : 0);
      totalPages = hasMoreFromApi === true || hasMoreFallback ? currentPage + 1 : currentPage;
    }

    window.__nfHasMore = hasMoreFromApi === null ? hasMoreFallback : hasMoreFromApi;

    const cardsHtml = await Promise.all(items.map(createNewsCard));

    const container = document.getElementById('newsfeedContainer');
    if (!container) return;

    if (append) container.insertAdjacentHTML('beforeend', cardsHtml.join(''));
    else container.innerHTML = cardsHtml.join('');
    mountAllGuideVideos(container);

    __cspInit();

    const animateCards = (cards) => {
      cards.forEach((card, i) => {
        if (card.dataset.animated === '1') return;
        card.classList.add('csp-fade-enter');
        setTimeout(() => {
          card.classList.add('csp-fade-active');
          card.classList.remove('csp-fade-enter');
          card.dataset.animated = '1';
        }, 16 + i * 60);
      });
    };

    if (append) {
      const newCards = Array.from(container.querySelectorAll('.news-card')).slice(-items.length);
      animateCards(newCards);
    } else {
      animateCards(container.querySelectorAll('.news-card'));
    }

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
  // ================== Helpers ==================
  const esc = (s)=>String(s??'')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  const escAttr = (s)=>String(s??'').replace(/["&<]/g,(m)=>({'"':'&quot;','&':'&amp;','<':'&lt;'}[m]));
  const hasFn = (fn)=> typeof fn === 'function';
  const pretty = (v)=>{
    if (v == null) return '<span class="text-zinc-400">N/A</span>';
    if (Array.isArray(v)) return esc(v.join(', '));
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    if (typeof v === 'number') return String(v);
    return esc(String(v));
  };
  const labelCase = (s)=> String(s||'').replace(/[_-]+/g,' ').replace(/\b\w/g, m=>m.toUpperCase());

  const formatTime = (raw)=>{
    if (raw == null || raw==='') return '';
    const n = Number(raw); if (Number.isNaN(n)) return esc(String(raw));
    const ms = Math.round((n%1)*1000);
    const total = Math.floor(n);
    const m = Math.floor(total/60);
    const s = total%60;
    const frac = String(ms).padStart(3,'0');
    return m>0 ? `${m}:${String(s).padStart(2,'0')}.${frac}` : `${s}.${frac}`;
  };

  const DIFF = {
    Easy:        { text:'text-lime-200',     ring:'ring-lime-400/30',     bg:'from-lime-400/10 via-lime-500/5 to-transparent',       glow:'bg-lime-500/20' },
    Medium:      { text:'text-yellow-200',   ring:'ring-yellow-400/30',   bg:'from-yellow-400/10 via-yellow-500/5 to-transparent',    glow:'bg-yellow-500/20' },
    Hard:        { text:'text-orange-200',   ring:'ring-orange-400/30',   bg:'from-orange-400/10 via-orange-500/5 to-transparent',    glow:'bg-orange-500/20' },
    Veryhard:    { text:'text-orange-300',   ring:'ring-orange-500/30',   bg:'from-orange-500/10 via-orange-600/5 to-transparent',    glow:'bg-orange-600/20' },
    Extreme:     { text:'text-red-200',      ring:'ring-red-500/35',      bg:'from-red-500/10 via-red-600/5 to-transparent',          glow:'bg-red-600/25' },
    Hell:        { text:'text-fuchsia-200',  ring:'ring-fuchsia-500/35',  bg:'from-fuchsia-500/10 via-fuchsia-600/5 to-transparent',  glow:'bg-fuchsia-600/25' },
  };
  const diffStyleFor = (d)=> DIFF[d] || { text:'text-zinc-200', ring:'ring-white/15', bg:'from-white/5 via-transparent to-transparent', glow:'bg-white/10' };
  const diffKeyOf = (val)=> hasFn(normalizeDifficulty) ? normalizeDifficulty(val) : String(val||'').toLowerCase();
  const formatImageName = (label) =>!label? 'default.png' : `${String(label).toLowerCase().replace(/[\s\-+]+/g, '')}.png`;

  const THEME = {
    announcement:   { ring:'ring-emerald-400/30', glow:'bg-emerald-500/15', badge:'border-emerald-400/30 bg-emerald-500/10 text-emerald-200' },
    new_map:        { ring:'ring-sky-400/30',     glow:'bg-sky-500/15',     badge:'border-sky-400/30 bg-sky-500/10 text-sky-200' },
    map_edit:       { ring:'ring-violet-400/30',  glow:'bg-violet-500/15',  badge:'border-violet-400/30 bg-violet-500/10 text-violet-200' },
    bulk_archive:   { ring:'ring-orange-400/30',  glow:'bg-orange-500/15',  badge:'border-orange-400/30 bg-orange-500/10 text-orange-200' },
    bulk_unarchive: { ring:'ring-lime-400/30',    glow:'bg-lime-500/15',    badge:'border-lime-400/30 bg-lime-500/10 text-lime-200' },
    guide:          { ring:'ring-cyan-400/30',    glow:'bg-cyan-500/15',    badge:'border-cyan-400/30 bg-cyan-500/10 text-cyan-200' },
    archive:        { ring:'ring-amber-400/30',   glow:'bg-amber-500/15',   badge:'border-amber-400/30 bg-amber-500/10 text-amber-200' },
    unarchive:      { ring:'ring-green-400/30',   glow:'bg-green-500/15',   badge:'border-green-400/30 bg-green-500/10 text-green-200' },
    role:           { ring:'ring-fuchsia-400/30', glow:'bg-fuchsia-500/15', badge:'border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-200' },
    record:         { ring:'ring-rose-400/30',    glow:'bg-rose-500/15',    badge:'border-rose-400/30 bg-rose-500/10 text-rose-200' },
    legacy_record:  { ring:'ring-yellow-400/30',  glow:'bg-yellow-500/15',  badge:'border-yellow-400/30 bg-yellow-500/10 text-yellow-200' },
    linked_map:     { ring:'ring-teal-400/30',    glow:'bg-teal-500/15',    badge:'border-teal-400/30 bg-teal-500/10 text-teal-200' },
    unlinked_map:   { ring:'ring-indigo-400/30',  glow:'bg-indigo-500/15',  badge:'border-indigo-400/30 bg-indigo-500/10 text-indigo-200' },
    unknown:        { ring:'ring-white/15',       glow:'bg-white/10',       badge:'border-white/15 bg-white/10 text-zinc-100' },
  };

  const typeLabel = (k)=>{
    const key = String(k||'unknown').toLowerCase();
    if (typeof t === 'function') {
      return t(`tags.${key}`) || t(`newsfeed.type_${key}`) || labelCase(key);
    }
    return labelCase(key);
  };

  const icon = {
    crown:'<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7l5 4 4-6 4 6 5-4v11H3V7z"/></svg>',
    play:'<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    copy:'<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14h13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>',
  };

  // ====== ROLES
  const ROLE_ORDER = ['Ninja','Jumper','Skilled','Pro','Master','Grandmaster','God'];
  const parseRole = (raw)=>{
    const label = String(raw??'').trim();
    const plus = (label.match(/\+/g)||[]).length;
    const base = label.replace(/\s*\+.*$/,'').trim();
    const clean = hasFn(normalizeRole) ? normalizeRole(base) : base;
    return { base: clean, plus: Math.min(plus,3), label };
  };
  const roleScore = (base,plus)=> Math.max(0, ROLE_ORDER.indexOf(base))*10 + plus;
  const roleImgFor = (base)=>{
    const file = String(base||'').toLowerCase();
    return cdnAsset(`assets/ranks/${file}.webp`);
  };
  const renderRoleChip = (raw, isPrimary=false)=>{
    const {base, plus, label} = parseRole(raw);
    const img = roleImgFor(base);
    const boost = plus===0?'': plus===1?' ring-2 ring-offset-1 ring-offset-zinc-950 shadow-sm'
                      : plus===2?' ring-2 ring-offset-2 ring-offset-zinc-950 shadow-md'
                                :' ring-2 ring-offset-2 ring-offset-zinc-950 shadow-lg';
    const primary = isPrimary ? ' scale-[1.02] ring-2 shadow-lg' : '';
    return `
      <li class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium
                 ring-1 shadow-sm bg-gradient-to-r from-white/10 to-transparent backdrop-blur-sm transition
                 hover:shadow-md hover:ring-2 ring-white/15 ${boost}${primary}"
          title="${esc(label)}" data-tier="${esc(base)}" data-plus="${plus}">
        <img src="${escAttr(img)}" alt="${escAttr(base)}" class="h-4 w-4 object-cover"/>
        <span class="tracking-tight">${esc(base)}</span>
        ${plus ? `<span class="opacity-80 ml-0.5">${'+'.repeat(plus)}</span>` : ''}
      </li>
    `;
  };

  // ====== MEDALS
  const medalImgFor = (medalRaw)=>{
    const m = String(medalRaw||'').toLowerCase();
    if (m.includes('gold'))   return cdnAsset('assets/verifications/new/verification/wr_gold.avif');
    if (m.includes('silver')) return cdnAsset('assets/verifications/new/verification/wr_silver.avif');
    if (m.includes('bronze')) return cdnAsset('assets/verifications/new/verification/wr_bronze.avif');
    return '';
  };

  const p  = item?.payload || item?.data || {};
  const typeRaw = item?.event_type || p?.type || item?.type || 'unknown';
  const type = String(typeRaw).toLowerCase();
  const ts = item?.timestamp;

  const userId = p?.user?.user_id ?? p?.user_id ?? null;
  let nickname = p?.user?.nickname || p?.name || 'GenjiBot';
  let profileImg = cdnAsset('assets/profile/genjibot.png');
  if (userId === 141372217677053952) profileImg = cdnAsset('assets/profile/joe.jpg');
  else if (userId === 273775694008549376) profileImg = cdnAsset('assets/profile/fishofire.jpg');

  let theme = THEME[type] || THEME.unknown;
  theme.badge = theme.badge || OFFICIAL_BADGE_CLS;
  const typeBadge = `<span class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${theme.badge}">
    ${esc(typeLabel(type))}
  </span>`;

  let html = `
    <article class="news-card relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 p-4 sm:p-5 ring-1 ${theme.ring}">
      <div class="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full ${theme.glow} blur-3xl"></div>
  `;

  // ====== NEW MAP
  const OFFICIAL_BADGE_CLS =
  'border border-emerald-400/50 bg-gradient-to-r from-emerald-600/25 via-emerald-500/15 to-teal-500/20 ' +
  'text-emerald-100 ring-1 ring-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.35)] backdrop-blur-[2px]';

  // ================== Header ==================
  if (type === 'announcement') {
    html += `
      <header class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <img class="h-10 w-10 rounded-lg object-cover ring-2 ring-white/10" src="${escAttr(profileImg)}" alt="${escAttr(nickname)}">
          <div class="leading-tight">
            <div class="font-semibold">${esc(nickname)}</div>
            <time class="timestamp text-xs text-zinc-400" data-timestamp="${escAttr(ts)}"></time>
          </div>
        </div>
        ${typeBadge}
      </header>
    `;
  } else {
    html += `
      <header class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <img class="h-10 w-10 rounded-full object-cover ring-2 ring-white/10" src="${cdnAsset('assets/profile/genjibot.png')}" alt="GenjiBot">
          <div class="leading-tight">
            <div class="flex items-center gap-2">
              <span class="font-semibold">GenjiBot</span>
              <span class="rounded-full border border-white/10 bg-white/10 px-1.5 py-0.5 text-[10px] text-zinc-200">BOT</span>
            </div>
            <time class="timestamp text-xs text-zinc-400" data-timestamp="${escAttr(ts)}"></time>
          </div>
        </div>
        ${typeBadge}
      </header>
    `;
  }

  html += `<div class="mt-3 space-y-3">`;

  // ================== Types ==================

  // ANNOUNCEMENT
  if (type === 'announcement') {
    let messageContent = p?.message?.content || p?.content || '';
    if (hasFn(convertTenorLinks))   messageContent = await convertTenorLinks(messageContent);
    if (hasFn(formatMessageContent)) messageContent = await formatMessageContent(messageContent);

    html += `
      <p class="announcement-content text-sm text-zinc-200 leading-relaxed">${messageContent}</p>
      <div id="loadingIndicator" class="loading-bar hidden items-center gap-2 text-xs text-zinc-400">
        <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" stroke-width="4" opacity=".25"/><path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" stroke-width="4"/></svg>
        ${hasFn(t)? (t('common.loading')||'Loading...') : 'Loading...'}
      </div>
      <div class="flex gap-2">
        <button class="translate-button inline-flex items-center justify-center rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5">
          ${hasFn(t)? t('newsfeed.translate_button') : 'Translate'}
        </button>
      </div>
      <p class="translated-text text-sm text-zinc-300"></p>
    `;
  }

  // NEW_MAP
  if (type === 'new_map') {
    const code = p?.code || '';
    const mapName = p?.map_name || '';
    const diffRaw = p?.difficulty || '';
    const diffKey = diffKeyOf(diffRaw);
    const diffTextCls = (typeof difficultyTextClasses==='object' && difficultyTextClasses[diffKey]) || 'text-zinc-200';
    const bannerSrc =
      p?.banner_url ||
      `${cdnAsset('assets/map_banners/')}${(mapName || '')
        .toLowerCase()
        .replace(/:/g, '')
        .replace(/\s+/g, '-')
      }.png`;
    const creators = Array.isArray(p?.creators) ? p.creators.join(', ') : (p?.creators || '');
    const isOfficial = !!p?.official;

    html += `
      <div class="mb-2 text-sm text-zinc-300">
        ${hasFn(t)? t('newsfeed.new_map', {
          nickname: nickname,
          difficulty: `<span class="${diffTextCls} font-semibold">${esc(diffRaw || (t('common.na')||'N/A'))}</span>`,
          map_name: esc(mapName || (t('common.na')||'N/A')),
        }) : `New map by ${esc(nickname)}: ${esc(mapName)} (${esc(diffRaw)})`}
      </div>

      <article class="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
        <div class="relative">
          <img class="h-44 w-full object-cover md:h-56" src="${escAttr(bannerSrc)}" alt="${escAttr(mapName)} Banner" loading="lazy" data-hide-on-error />
          <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>

          <div class="absolute left-3 top-3 flex flex-wrap items-center gap-2">
              ${isOfficial
                ? `<span
                      class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${OFFICIAL_BADGE_CLS}"
                      data-badge="official">
                      <span class="inline-block h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]"></span>
                      ${(hasFn(t)? (t('newsfeed.official')||'Official') : 'Official')}
                  </span>`
                : ''}
          </div>

          <div class="absolute right-3 top-3 rounded-lg bg-zinc-900/30 p-1 ring-1 ring-white/10 backdrop-blur-sm shadow-sm">
            <img
              class="h-8 w-8 rounded-md"
              src="${cdnAsset('assets/ranks/')}${escAttr(formatImageName(p?.difficulty||''))}"
              alt="${escAttr(diffRaw || '—')}"
              loading="lazy"
            />
          </div>

          <div class="absolute left-3 right-3 bottom-3">
            <div class="flex flex-wrap items-end justify-between gap-3">
              <div class="min-w-0">
                <div class="max-w-full overflow-hidden inline-block rounded-lg bg-zinc-900/20 ring-1 ring-white/10 backdrop-blur-sm px-3 py-2 shadow-sm">
                  <h3 class="truncate text-lg font-bold text-zinc-100">
                    ${esc(mapName || (hasFn(t)? t('common.na'):'N/A'))}
                  </h3>
                  ${ creators ? `
                    <p class="truncate text-sm text-zinc-300">
                      <span class="text-zinc-400 mr-1">
                        ${hasFn(t)? (t('newsfeed.creator')||'Creator') : 'Creator'}:
                      </span>${esc(creators)}
                    </p>` : '' }
                </div>
              </div>

              <div class="flex shrink-0 items-center gap-2">
                ${ code ? `
                  <button type="button" class="map-code cursor-pointer rounded-md border border-white/15 bg-black/40 px-2 py-1 text-[12px] font-mono text-emerald-200 shadow-sm"
                          title="${hasFn(t)? (t('newsfeed.copy_code')||'Copy code') : 'Copy code'}"
                          data-copy-code="${escAttr(code)}">#${esc(code)}</button>` : '' }

                ${ code ? `
                <button class="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-zinc-100 hover:bg-white/20"
                        data-open-map-details data-map-code="${escAttr(code)}">
                  ${(hasFn(t)? (t('newsfeed.details')||t('newsfeed.click_here')||'Details') : 'Details')}
                  <svg class="h-4 w-4" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M7 4l6 6-6 6"></path></svg>
                </button>` : '' }
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // MAP_EDIT
  if (type === 'map_edit') {
    const code    = p?.code || '';
    const changes = Array.isArray(p?.changes) ? p.changes : [];
    const reason  = (p?.reason || '').trim();

    const list = changes.map((ch) => {
      const field = esc(ch?.field ?? '');
      const oldV  = pretty(ch?.old);
      const newV  = pretty(ch?.new);

      if (/^medals?$/i.test(field)) {
        const parsed = parseMedalsText(String(ch?.new || ''));

        const chips = (parsed.length ? parsed : __MEDAL_ORDER.map(k => ({ kind: k, timeText: null })))
          .map(({ kind, timeText }) => {
            const img   = medalVerifiedImgFor(kind);
            const label = kind.charAt(0).toUpperCase() + kind.slice(1);
            const val   = (timeText == null || timeText === '')
              ? (typeof t === 'function' ? t('common.na') : 'N/A')
              : timeText;

            return `
              <div class="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2 py-1">
                <img src="${escAttr(img)}" alt="${escAttr(label)}" class="h-5 w-5 rounded object-cover"/>
                <span class="text-xs text-zinc-200">${esc(label)}</span>
                <span class="ml-auto font-mono text-sm">${esc(val)}</span>
              </div>
            `;
          }).join('');

        return `
          <li class="rounded-lg border border-white/10 bg-zinc-900/50 p-2.5">
            <div class="text-[11px] uppercase tracking-wide text-zinc-400">${field}</div>
            <div class="mt-2 grid gap-2 sm:grid-cols-3">
              ${chips}
            </div>
          </li>
        `;
      }

      const isDiff = /(^|\s)diffic/i.test(field);
      const diffCls = isDiff
        ? ((typeof difficultyTextClasses==='object' && difficultyTextClasses[diffKeyOf(ch?.new)]) || '')
        : '';

      return `
        <li class="rounded-lg border border-white/10 bg-zinc-900/50 p-2.5">
          <div class="text-[11px] uppercase tracking-wide text-zinc-400">${field}</div>
          <div class="mt-1 flex flex-wrap items-center gap-2 text-sm leading-relaxed">
            <span class="line-through text-zinc-400/90">${oldV}</span>
            <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20" aria-hidden="true">
              <path fill="currentColor" d="M7 4l6 6-6 6"></path>
            </svg>
            <span class="font-medium text-zinc-100 ${diffCls}">${newV}</span>
          </div>
        </li>
      `;
    }).join('');

    html += `
      <article class="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
        <header class="flex items-center justify-between gap-3 border-b border-white/10 bg-zinc-900/60 p-3 sm:p-4">
          <div class="min-w-0">
            <h3 class="truncate text-base sm:text-lg font-bold text-zinc-100">
              ${typeof t === 'function' ? t('newsfeed.map_updated', { map_code: esc(code) }) : `Map updated: ${esc(code)}`}
            </h3>
            ${ reason ? `
              <p class="mt-1 text-xs text-zinc-300">
                <span class="text-zinc-400">${typeof t === 'function' ? (t('common.reason')||'Reason') : 'Reason'}:</span> ${esc(reason)}
              </p>` : '' }
          </div>
          <div class="flex shrink-0 items-center gap-2">
            ${ code ? `
              <button class="cursor-pointer rounded-md border border-white/15 bg-black/40 px-2 py-1 text-[12px] font-mono text-emerald-200"
                      title="${typeof t === 'function' ? (t('newsfeed.copy_code')||'Copy code') : 'Copy code'}"
                      data-copy-code="${escAttr(code)}">${esc(code)}</button>` : '' }
          </div>
        </header>
        <div class="p-3 sm:p-4">
          ${ list ? `<ul class="grid gap-2 sm:gap-3">${list}</ul>` : `<p class="text-sm text-zinc-400">${typeof t === 'function' ? t('newsfeed.no_changes') : 'No changes'}</p>` }
        </div>
      </article>
    `;
  }

  // BULK ARCHIVE / UNARCHIVE
  if (type === 'bulk_archive' || type === 'bulk_unarchive') {
    const raw =
      (Array.isArray(p?.codes) && p.codes) ||
      (Array.isArray(p?.bulk) && p.bulk) ||
      (Array.isArray(p?.items) && p.items) || [];
    const codes = [...new Set(raw.map((x)=> typeof x === 'string' ? x : (x?.map_code || x?.code || '')).filter(Boolean))];
    const reason = (p?.reason || '').trim();
    const count  = codes.length;

    const chips = codes.map((code) => `
      <li class="group">
        <div class="w-full max-w-full overflow-hidden flex flex-wrap sm:flex-nowrap items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1">
          <code class="min-w-0 truncate rounded bg-black/30 px-2 py-0.5 text-[12px] font-mono text-emerald-200">#${esc(code)}</code>

          <div class="ml-auto flex shrink-0 items-center gap-2">
            <button type="button"
              class="inline-flex cursor-pointer items-center gap-1 rounded-md border border-white/10 bg-zinc-900/60 px-2 py-1 text-xs hover:bg-zinc-800"
              data-copy-code="${escAttr(code)}" title="Copy">
              ${icon.copy}
            </button>

            <button type="button"
              class="inline-flex cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs hover:bg-white/10"
              data-open-map-details data-map-code="${escAttr(code)}">
              Details
            </button>
          </div>
        </div>
      </li>
    `).join('');

    html += `
      <article class="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
        <header class="flex items-center justify-between gap-3 border-b border-white/10 bg-zinc-900/60 p-3 sm:p-4">
          <div class="min-w-0">
            <h3 class="truncate text-base sm:text-lg font-bold text-zinc-100">
              ${ hasFn(t)
                  ? (type === 'bulk_unarchive' ? (t('newsfeed.bulk_unarchived', { count }) || `Unarchived (${count})`)
                                               : (t('newsfeed.bulk_archived',   { count }) || `Archived (${count})`))
                  : (type === 'bulk_unarchive' ? `Unarchived (${count})` : `Archived (${count})`) }
              <span class="ml-2 text-xs text-zinc-400">(${count})</span>
            </h3>
            ${reason ? `<p class="mt-1 text-xs text-zinc-300"><span class="text-zinc-400">${hasFn(t)?(t('common.reason')||'Reason'):'Reason'}:</span> ${esc(reason)}</p>` : ''}
          </div>
        </header>
          ${ count
            ? `<ul class="grid [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] gap-2 p-3 sm:p-4">${chips}</ul>`
            : `<div class="p-4 text-sm text-zinc-400">${hasFn(t)? (t('newsfeed.no_items')||'No items') : 'No items'}</div>`
          }
      </article>
    `;
  }

  // LEGACY RECORD
  if (type === 'legacy_record') {
    const code     = p?.code || '';
    const affected = Number.isFinite(+p?.affected_count) ? +p.affected_count : 0;
    const reason   = (p?.reason || '').trim();

    html += `
      <article class="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
        <header class="flex items-center justify-between gap-3 border-b border-white/10 bg-zinc-900/60 p-3 sm:p-4">
          <div class="min-w-0">
            <h3 class="truncate text-base sm:text-lg font-bold text-zinc-100">
              ${hasFn(t) ? (t('newsfeed.converted_to_legacy') || 'Converted to legacy') : 'Converted to legacy'}
            </h3>
            ${reason ? `
              <p class="mt-1 text-xs text-zinc-300">
                <span class="text-zinc-400">${hasFn(t)? (t('common.reason') || 'Reason') : 'Reason'}:</span>
                ${esc(reason)}
              </p>` : ''}
          </div>

        </header>

        <div class="p-3 sm:p-4">
          <div class="w-full max-w-full overflow-hidden flex flex-wrap sm:flex-nowrap items-center gap-2">
            <code class="min-w-0 truncate rounded bg-black/30 px-2 py-0.5 text-[12px] font-mono text-emerald-200">
              #${esc(code || (hasFn(t)? t('common.na') : 'N/A'))}
            </code>

            <div class="ml-auto flex shrink-0 items-center gap-2">
              <button type="button"
                class="inline-flex cursor-pointer items-center gap-1 rounded-md border border-white/10 bg-zinc-900/60 px-2 py-1 text-xs hover:bg-zinc-800"
                data-copy-code="${escAttr(code)}"
                title="${hasFn(t)? (t('sidebar.copy_code') || 'Copy') : 'Copy'}">
                ${typeof icon !== 'undefined' && icon.copy
                  ? icon.copy
                  : '<svg class="h-3.5 w-3.5" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M5 5h7a2 2 0 0 1 2 2v7H7a2 2 0 0 1-2-2V5z"></path><path fill="currentColor" d="M7 7h7v7h2V7a4 4 0 0 0-4-4H7v2z"></path></svg>'}
              </button>

              ${code ? `
                <button type="button"
                  class="inline-flex cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs hover:bg-white/10"
                  data-open-map-details data-map-code="${escAttr(code)}">
                  ${hasFn(t)? (t('newsfeed.details') || t('newsfeed.click_here') || 'Details') : 'Details'}
                </button>` : ''}
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // GUIDE
  if (type === 'guide') {
    const code = p?.map_code || p?.code || '';
    const videoUrl =
      p?.guide_url ||
      (Array.isArray(p?.map?.guide) && p.map.guide[0]) ||
      (Array.isArray(p?.guide) && p.guide[0]) ||
      p?.video || p?.url || '';
    const poster = (p?.name || p?.author || nickname || '').trim();

    const platform = (() => {
      if (!videoUrl) return '';
      try {
        const host = new URL(videoUrl).hostname.replace(/^www\./,'');
        if (host.includes('youtube') || host.includes('youtu.be')) return 'YouTube';
        if (host.includes('twitch')) return 'Twitch';
        if (host.includes('bilibili') || host.includes('b23.tv')) return 'Bilibili';
        if (host.includes('vimeo')) return 'Vimeo';
        return host;
      } catch { return ''; }
    })();

    const videoContainerId = `videoContainer-${(code || Math.random().toString(36).slice(2)).replace(/[^a-z0-9_-]/gi,'')}`;

    const platformBadge = platform
      ? `<span class="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] text-zinc-300">${esc(platform)}</span>`
      : '';
    const codeChip = code
      ? `<code class="map-code cursor-pointer rounded bg-black/30 px-2 py-0.5 text-[12px] font-mono text-emerald-200" data-copy-code="${escAttr(code)}">#${esc(code)}</code>`
      : `<span class="rounded bg-black/30 px-2 py-0.5 text-[12px] text-zinc-400">N/A</span>`;

    const watchBtn = videoUrl
      ? `<a href="${escAttr(videoUrl)}" target="_blank" rel="noopener"
            class="inline-flex items-center justify-center rounded-md border ${theme.ring.replace('ring-','border-')} ${theme.glow.replace('bg-','bg-').replace('/15','/10')} px-2.5 py-1 text-xs hover:bg-white/10">
          ${hasFn(t)? (t('newsfeed.watch_guide') || 'Watch guide') : 'Watch guide'}
        </a>` : '';

    const detailsBtn = code
      ? `<button type="button"
            class="inline-flex cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-200 hover:bg-white/10"
            data-open-map-details data-map-code="${escAttr(code)}">Details</button>`
      : '';

    html += `
      <article class="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
        <header class="flex items-center justify-between gap-3 border-b border-white/10 bg-zinc-900/60 p-3 sm:p-4">
          <div class="min-w-0">
            <h3 class="text-base sm:text-lg font-bold text-zinc-100">
              ${hasFn(t)? t('newsfeed.has_posted_guide', { nickname: esc(poster||nickname), map_code: esc(code|| (t('common.na')||'N/A')) })
                         : `${esc(poster||nickname)} posted a guide (#${esc(code||'N/A')})`}
            </h3>
            <div class="mt-1 flex flex-wrap items-center gap-2">
              ${platformBadge}${codeChip}
            </div>
          </div>
        </header>

        <div class="flex items-center gap-2 p-3 sm:p-4 pt-3">${watchBtn}${detailsBtn}</div>
        <div class="p-3 sm:p-4 pt-0">
          <div id="${escAttr(videoContainerId)}" class="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-zinc-900/50"
               ${videoUrl ? `data-video-url="${escAttr(videoUrl)}"` : ''}>
            <div class="absolute inset-0 animate-pulse bg-[linear-gradient(90deg,rgba(255,255,255,.04),rgba(255,255,255,.08),rgba(255,255,255,.04))] bg-[length:200%_100%]"></div>
          </div>
        </div>
      </article>
    `;
  }

  // RECORD
  if (type === 'record') {
    const mapName   = p?.map_name || p?.map?.map_name || '';
    const code      = p?.map_code || p?.code || p?.map?.map_code || '';
    const recordRaw = p?.record?.record ?? p?.record ?? p?.time ?? '';
    const recordTxt = formatTime(recordRaw) || (hasFn(t)? t('common.na') : 'N/A');
    const video     = p?.record?.video ?? p?.video ?? '';
    const rankNum   = Number(p?.rank_num) || 0;
    const medal     = p?.medal || '';
    const diffLabel = p?.difficulty || '';
    const nickLocal = p?.name || p?.user?.nickname || nickname;

    // NOTE: on garde la couleur de TYPE au niveau carte, la difficulté colore les panneaux internes.
    const d = diffStyleFor(diffLabel);

    const crown = rankNum === 1
      ? `<span class="inline-flex items-center justify-center rounded-full bg-white/10 ring-1 ${d.ring} p-1 text-amber-300">${icon.crown}</span>`
      : '';

    const medalImg = medalImgFor(medal);
    const medalChip = medalImg ? `
      <span class="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px]">
        <img src="${escAttr(medalImg)}" alt="${escAttr(medal)}" class="h-4 w-4 rounded object-cover"/>
        <span class="text-zinc-200">${esc(medal)}</span>
      </span>` : '';

    html += `
      <h3 class="text-lg font-bold flex items-center gap-2">${crown}${hasFn(t)? t('newsfeed.new_wr', { nickname: nickLocal }) : `${esc(nickLocal)} set a new WR`}</h3>
      <p class="text-sm text-zinc-300"><strong>${
        hasFn(t)? t('newsfeed.new_wr_info', { map_name: mapName, creators: p?.creators || '', map_code: code })
                : `${esc(mapName)} (#${esc(code)})`
      }</strong></p>

      <div class="grid gap-2 sm:grid-cols-3">
        <div class="rounded-xl border border-white/10 bg-gradient-to-r ${d.bg} px-3 py-2 ring-1 ${d.ring}">
          <div class="flex items-center justify-between gap-3">
            <div>
              <span class="text-xs text-zinc-400 mr-1">${hasFn(t)? t('newsfeed.record_label'):'Record'}:</span>
              <span class="font-mono text-base">${recordTxt}</span>
            </div>
            <img class="inline h-5 w-5 align-[-3px]" src="${cdnAsset('assets/verifications/new/verification/wr_full.avif')}" alt="VRF" />
          </div>
        </div>

        <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-[11px] ring-1 ${d.ring} ${d.text}">
              ${esc(diffLabel || (hasFn(t)? t('common.na'):'N/A'))}
            </span>
            ${medalChip}
            ${ code ? `
              <button type="button" class="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-white/10 bg-zinc-900/60 px-2.5 py-1 text-xs hover:bg-zinc-800"
                      data-copy-code="${escAttr(code)}" aria-label="Copy code ${escAttr(code)}">
                ${icon.copy}<span>#${esc(code)}</span>
              </button>` : '' }
          </div>
        </div>

        ${ video ? `
        <a class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 transition flex items-center gap-2"
           href="${escAttr(video)}" target="_blank" rel="noopener noreferrer">
          <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 ring-1 ${theme.ring}">${icon.play}</span>
          <span class="text-sm ${d.text}">${hasFn(t)? t('newsfeed.video_label'):'Video'}</span>
        </a>` : `
        <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-400">
          ${hasFn(t)? t('newsfeed.video_label'):'Video'}: ${hasFn(t)? t('common.na'):'N/A'}
        </div>` }
      </div>
    `;
  }

  // ARCHIVE / UNARCHIVE
  if (type === 'archive' || type === 'unarchive') {
    const code     = p?.map_code || p?.code || '';
    const mapName  = p?.map_name || '';
    const creators = Array.isArray(p?.creators) ? p.creators.join(', ') : (p?.creators || '');
    const diffRaw  = p?.difficulty || p?.map?.difficulty || '';
    const reason   = (p?.reason || '').trim();

    const diffCls  = (typeof difficultyTextClasses==='object' && difficultyTextClasses[diffKeyOf(diffRaw)]) || 'text-zinc-200';
    const rankIcon = diffRaw ? `${cdnAsset('assets/ranks/')}${formatImageName(diffRaw)}` : '';

    html += `
      <article class="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
        <header class="flex items-center justify-between gap-3 border-b border-white/10 bg-zinc-900/60 p-3 sm:p-4">
          <div class="min-w-0">
            <h3 class="truncate text-base sm:text-lg font-bold text-zinc-100">
              ${ type === 'unarchive'
                  ? (hasFn(t)? t('newsfeed.unarchived_map', { map_code: esc(code) }) : `Unarchived #${esc(code)}`)
                  : (hasFn(t)? t('newsfeed.archived_map',   { map_code: esc(code) }) : `Archived #${esc(code)}`) }
            </h3>
            <p class="mt-1 text-xs text-zinc-300">${
              type === 'unarchive' ? (hasFn(t)? (t('newsfeed.unarchived_description')||'') : '')
                                   : (hasFn(t)? (t('newsfeed.archived_description')  ||'') : '')
            }</p>
          </div>
          <span class="rounded-full px-2 py-0.5 text-[11px] ${theme.badge}">${esc(typeLabel(type))}</span>
        </header>

        <div class="p-3 sm:p-4">
          <div class="grid gap-2 sm:gap-3">
            <div class="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
              <span class="text-zinc-400">${hasFn(t)? (t('newsfeed.map_code')||'Map code') : 'Map code'}:</span>
              <span class="font-medium text-zinc-100">${esc(code || (hasFn(t)? t('common.na'):'N/A'))}</span>
            </div>

            ${ mapName ? `
            <div class="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
              <span class="text-zinc-400">${hasFn(t)? (t('newsfeed.map_name')||'Map name') : 'Map name'}:</span>
              <span class="font-medium text-zinc-100 truncate">${esc(mapName)}</span>
            </div>` : '' }

            ${ creators ? `
            <div class="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
              <span class="text-zinc-400">${hasFn(t)? (t('newsfeed.creator')||'Creator') : 'Creator'}:</span>
              <span class="font-medium text-zinc-100 truncate">${esc(creators)}</span>
            </div>` : '' }

            ${ diffRaw ? `
            <div class="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
              <span class="text-zinc-400">${hasFn(t)? (t('newsfeed.difficulty')||'Difficulty') : 'Difficulty'}:</span>
              <span class="inline-flex items-center gap-2 font-medium text-zinc-100">
                ${ rankIcon ? `<img class="h-5 w-5 rounded ring-1 ring-white/10" src="${escAttr(rankIcon)}" alt="${escAttr(diffRaw)}">` : '' }
                <span class="${diffCls}">${esc(diffRaw)}</span>
              </span>
            </div>` : '' }

            ${ reason ? `
            <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
              <span class="text-zinc-400">${hasFn(t)? (t('common.reason')||'Reason') : 'Reason'}:</span>
              <span class="text-zinc-200">${esc(reason)}</span>
            </div>` : '' }
          </div>
        </div>
      </article>
    `;
  }

  // ROLE
  if (type === 'role') {
    const listRaw = Array.isArray(p?.added) && p.added.length
      ? p.added
      : (p?.user?.roles || p?.roles || []);
    const nickLocal = p?.name || p?.user?.nickname || nickname;

    let primaryIdx = 0, best = -1;
    listRaw.forEach((r,i)=>{ const {base,plus} = parseRole(r); const s = roleScore(base,plus); if (s>best){best=s; primaryIdx=i;} });
    const chips = listRaw.map((r,i)=> renderRoleChip(r, i===primaryIdx)).join('');

    html += `
      <h3 class="text-lg font-bold">${hasFn(t)? t('newsfeed.promoted', { nickname: nickLocal }) : `${esc(nickLocal)} has been promoted`}</h3>
      <div class="flex items-center justify-between">
        <ul class="flex flex-wrap items-center gap-2">${chips}</ul>
      </div>
    `;
  }

  if (type === 'linked_map') {
    const off  = p?.official_code   || '';
    const unof = p?.unofficial_code || '';
    const ptId = p?.playtest_id ?? null;

    const codeChip = (label, code) => `
      <div class="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
        <div class="mb-1 text-[11px] uppercase tracking-wide text-zinc-400">${label}</div>
        <div class="flex items-center gap-2">
          ${ code
            ? `<code class="map-code cursor-pointer rounded bg-black/30 px-2 py-0.5 text-[12px] font-mono text-emerald-200" data-copy-code="${escAttr(code)}">#${esc(code)}</code>`
            : `<span class="rounded bg-black/30 px-2 py-0.5 text-[12px] text-zinc-400">N/A</span>`
          }
          <div class="ml-auto flex items-center gap-2">
            ${ code ? `
              <button type="button"
                class="inline-flex cursor-pointer items-center gap-1 rounded-md border border-white/10 bg-zinc-900/60 px-2 py-1 text-xs hover:bg-zinc-800"
                data-copy-code="${escAttr(code)}" title="Copy">
                ${icon.copy}
              </button>
            ` : '' }
            ${ code ? `
              <button type="button"
                class="inline-flex cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs hover:bg-white/10"
                data-open-map-details data-map-code="${escAttr(code)}">Details</button>
            ` : '' }
          </div>
        </div>
      </div>
    `;

    html += `
      <article class="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
        <header class="flex items-center justify-between gap-3 border-b border-white/10 bg-zinc-900/60 p-3 sm:p-4">
          <div class="min-w-0">
            <h3 class="text-base sm:text-lg font-bold text-zinc-100">
              ${typeof t === 'function'
                ? (t('newsfeed.linked_map_title') || 'Linked maps')
                : 'Linked maps'}
            </h3>
            ${ ptId != null ? `
              <p class="mt-1 text-xs text-zinc-300">
                ${typeof t === 'function'
                  ? (t('newsfeed.playtest_id', { id: ptId }) || `Playtest ID: ${ptId}`)
                  : `Playtest ID: ${ptId}`}
              </p>` : '' }
          </div>
        </header>

        <div class="p-3 sm:p-4">
          <div class="grid gap-3 sm:grid-cols-2">
            ${codeChip((typeof t === 'function' ? (t('newsfeed.official_code') || 'Official code') : 'Official code'),   off)}
            ${codeChip((typeof t === 'function' ? (t('newsfeed.unofficial_code') || 'Unofficial code') : 'Unofficial code'), unof)}
          </div>

          ${ (off && unof) ? `
            <div class="mt-3 rounded-lg border border-teal-400/20 bg-teal-500/10 p-2.5 text-xs text-teal-200">
              ${typeof t === 'function'
                ? (t('newsfeed.linked_map_hint') || 'These two map codes are now linked together.')
                : 'These two map codes are now linked together.'}
            </div>` : '' }
        </div>
      </article>
    `;
  }

  if (type === 'unlinked_map') {
    const off    = p?.official_code   || '';
    const unof   = p?.unofficial_code || '';
    const reason = (p?.reason || '').trim();

    const codeChip = (label, code) => `
      <div class="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
        <div class="mb-1 text-[11px] uppercase tracking-wide text-zinc-400">${label}</div>
        <div class="flex items-center gap-2">
          ${ code
            ? `<code class="map-code cursor-pointer rounded bg-black/30 px-2 py-0.5 text-[12px] font-mono text-emerald-200" data-copy-code="${escAttr(code)}">#${esc(code)}</code>`
            : `<span class="rounded bg-black/30 px-2 py-0.5 text-[12px] text-zinc-400">N/A</span>`
          }
          <div class="ml-auto flex items-center gap-2">
            ${ code ? `
              <button type="button"
                class="inline-flex cursor-pointer items-center gap-1 rounded-md border border-white/10 bg-zinc-900/60 px-2 py-1 text-xs hover:bg-zinc-800"
                data-copy-code="${escAttr(code)}" title="Copy">
                ${icon.copy}
              </button>` : '' }
            ${ code ? `
              <button type="button"
                class="inline-flex cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs hover:bg-white/10"
                data-open-map-details data-map-code="${escAttr(code)}">Details</button>` : '' }
          </div>
        </div>
      </div>
    `;

    html += `
      <article class="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
        <header class="flex items-center justify-between gap-3 border-b border-white/10 bg-zinc-900/60 p-3 sm:p-4">
          <div class="min-w-0">
            <h3 class="text-base sm:text-lg font-bold text-zinc-100">
              ${typeof t === 'function'
                ? (t('newsfeed.unlinked_map_title') || 'Unlinked maps')
                : 'Unlinked maps'}
            </h3>
            ${ reason ? `
              <p class="mt-1 text-xs text-zinc-300">
                <span class="text-zinc-400">${hasFn(t)? (t('common.reason')||'Reason') : 'Reason'}:</span>
                ${esc(reason)}
              </p>` : '' }
          </div>
          <span class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${theme.badge}">
            ${esc(typeLabel(type))}
          </span>
        </header>

        <div class="p-3 sm:p-4">
          <div class="grid gap-3 sm:grid-cols-2">
            ${codeChip((hasFn(t)? (t('newsfeed.official_code')   || 'Official code')   : 'Official code'),   off)}
            ${codeChip((hasFn(t)? (t('newsfeed.unofficial_code') || 'Unofficial code') : 'Unofficial code'), unof)}
          </div>

          ${(off && unof) ? `
            <div class="mt-3 rounded-lg border border-red-400/20 bg-red-500/10 p-2.5 text-xs text-red-200">
              ${hasFn(t)
                ? (t('newsfeed.unlinked_map_hint') || 'These two map codes are no longer linked.')
                : 'These two map codes are no longer linked.'}
            </div>` : `
            <div class="mt-3 rounded-lg border border-white/10 bg-white/5 p-2.5 text-xs text-zinc-300">
              ${hasFn(t)? (t('newsfeed.unlinked_map_partial') || 'One of the codes is missing.') : 'One of the codes is missing.'}
            </div>`}
        </div>
      </article>
    `;
  }

  // Fallback
  if (!/^(announcement|new_map|map_edit|bulk_archive|bulk_unarchive|guide|record|archive|unarchive|role|legacy_record|linked_map|unlinked_map)$/.test(type)) {
    html += `<div class="flex items-center justify-between">
      <p class="text-sm text-zinc-300">Unknown event <code class="text-zinc-200">${esc(type)}</code></p>
      <span class="rounded-full px-2 py-0.5 text-[11px] ${THEME.unknown.badge}">${esc(typeLabel('unknown'))}</span>
    </div>`;
  }

  html += `</div></article>`;
  return html;
}

/* ---------- Medals ---------- */
const __MEDAL_ID_TO_KIND = {
  '1406302950443192320': 'gold',
  '1406302952263782466': 'silver',
  '1406300035624341604': 'bronze',
};
const __MEDAL_ORDER = ['gold','silver','bronze'];

function medalVerifiedImgFor(kind) {
  switch (String(kind).toLowerCase()) {
    case 'gold':   return cdnAsset('assets/verifications/new/verification/verified_gold.avif');
    case 'silver': return cdnAsset('assets/verifications/new/verification/verified_silver.avif');
    case 'bronze': return cdnAsset('assets/verifications/new/verification/verified_bronze.avif');
    default:       return '';
  }
}

function parseMedalsText(text) {
  const out = [];
  if (!text) return out;

  const re = /<a:[^:>]*:(\d+)>:\s*([0-9]+(?:\.[0-9]+)?)\s*/gi;
  let m;
  while ((m = re.exec(text))) {
    const id = m[1];
    const timeText = (m[2] ?? '').trim();
    const kind = __MEDAL_ID_TO_KIND[id] || '';
    if (kind) out.push({ kind, timeText });
  }
  if (out.length) {
    out.sort((a,b)=> __MEDAL_ORDER.indexOf(a.kind) - __MEDAL_ORDER.indexOf(b.kind));
    return out;
  }

  const lines = String(text).split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  for (const line of lines) {
    const m2 = line.match(/(gold|silver|bronze)\s*:\s*([0-9]+(?:\.[0-9]+)?)/i);
    if (m2) out.push({ kind: m2[1].toLowerCase(), timeText: m2[2] });
  }
  if (out.length) {
    out.sort((a,b)=> __MEDAL_ORDER.indexOf(a.kind) - __MEDAL_ORDER.indexOf(b.kind));
    return out;
  }

  const nums = (String(text).match(/([0-9]+(?:\.[0-9]+)?)/g) || []);
  __MEDAL_ORDER.forEach((k, i) => { if (nums[i]) out.push({ kind: k, timeText: nums[i] }); });
  return out;
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
  if (!container || !videoUrl) return;

  let embedUrl = '';
  let node = null;

  let u;
  try { u = new URL(videoUrl); } catch { u = null; }
  if (!u) {
    container.innerHTML = `<p class="p-3 text-sm text-rose-300">${t('common.video_embed_failed')}</p>`;
    return;
  }

  const host = u.hostname.replace(/^www\./, '');

  if (host.includes('youtube') || host === 'youtu.be') {
    let id = u.searchParams.get('v');
    if (!id && host === 'youtu.be') id = u.pathname.split('/')[1];
    if (!id && u.pathname.startsWith('/shorts/')) id = u.pathname.split('/')[2];
    if (id) embedUrl = `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
  }

  else if (host.includes('vimeo.com')) {
    const vid = (u.pathname.match(/\/(\d+)/) || [])[1];
    if (vid) embedUrl = `https://player.vimeo.com/video/${vid}`;
  }

  else if (host.includes('twitch.tv')) {
    const parent = location.hostname;
    const clip  = (u.pathname.match(/\/clip\/([^/?]+)/) || [])[1];
    const video = (u.pathname.match(/\/videos\/(\d+)/) || [])[1];
    const channel = (!clip && !video) ? (u.pathname.split('/').filter(Boolean)[0] || '') : '';

    if (clip)   embedUrl = `https://clips.twitch.tv/embed?clip=${encodeURIComponent(clip)}&parent=${encodeURIComponent(parent)}`;
    else if (video) embedUrl = `https://player.twitch.tv/?video=${encodeURIComponent(video)}&parent=${encodeURIComponent(parent)}&autoplay=false`;
    else if (channel) embedUrl = `https://player.twitch.tv/?channel=${encodeURIComponent(channel)}&parent=${encodeURIComponent(parent)}&autoplay=false`;
  }

  else if (host.includes('bilibili.com') || host.includes('b23.tv')) {
    const bv = (videoUrl.match(/(BV[0-9A-Za-z]+)/) || [])[1];
    const p = u.searchParams.get('p');
    if (bv) embedUrl = `https://player.bilibili.com/player.html?bvid=${bv}${p ? `&page=${encodeURIComponent(p)}` : ''}`;
  }

  else if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(u.pathname)) {
    node = document.createElement('video');
    node.src = videoUrl;
    node.controls = true;
    node.playsInline = true;
    node.className = 'absolute inset-0 h-full w-full';
  }

  container.innerHTML = '';
  if (node) {
    container.appendChild(node);
    return;
  }
  if (embedUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.className = 'absolute inset-0 h-full w-full';
    container.appendChild(iframe);
  } else {
    container.innerHTML = `<p class="p-3 text-sm text-rose-300">${t('common.video_embed_failed')}</p>`;
  }
}

function mountAllGuideVideos(root = document) {
  const nodes = root.querySelectorAll('[id^="videoContainer-"][data-video-url]');
  nodes.forEach((el) => {
    if (el.querySelector('iframe, video')) return;
    createEmbeddedVideo(el.id, el.getAttribute('data-video-url'));
  });
}

/* ---------- Pagination / Load more ---------- */
function renderPaginationButtons() {
  const loadMore = document.getElementById('nf-loadmore');
  if (loadMore) {
    const hasKnownTotal = Number.isFinite(Number(totalResults));
    const showByPages   = currentPage < totalPages;
    const showByHasMore = !!window.__nfHasMore;

    const shouldShow = hasKnownTotal ? showByPages : showByHasMore;
    loadMore.classList.toggle('hidden', !shouldShow);

    loadMore.onclick = () => {
      if (!shouldShow) return;
      currentPage += 1;
      loadNewsfeed(true);
    };
  }

  const pag = document.getElementById('paginationContainer');
  if (!pag) return;
  pag.innerHTML = '';
  if (!Number.isFinite(Number(totalResults)) || totalPages <= 1) return;

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
function showToast(message, type = 'ok', opts = {}) {
  const {
    duration = 1200,
    enter    = 220,
    exit     = 220,
    easing   = 'cubic-bezier(0.4,0,0.2,1)',
  } = opts;

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
    type === 'ok'
      ? 'bg-emerald-500/90 text-white'
      : type === 'warn'
        ? 'bg-amber-500/90 text-zinc-900'
        : 'bg-red-600/90 text-white';

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
    [{ opacity: 0, transform: 'translateY(8px)' },
     { opacity: 1, transform: 'translateY(0)' }],
    { duration: enter, easing, fill: 'forwards' }
  );

  const close = () => {
    Promise.resolve(inAnim.finished).catch(() => {}).finally(() => {
      const outAnim = el.animate(
        [{ opacity: 1, transform: 'translateY(0)' },
         { opacity: 0, transform: 'translateY(8px)' }],
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
  const btn = e.target.closest('[data-copy-code]');
  if (!btn) return;

  const raw    = btn.getAttribute('data-copy-code') || '';
  const toCopy = String(raw).trim().replace(/^#/, '');

  void logMapCopy(toCopy, 'web');

  const ok = await copyTextToClipboard(toCopy);
  if (ok) notifyCodeCopied(toCopy);
  else    showErrorMessage(t('newsfeed.copy_clipboard_error'));
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
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-CSRF-TOKEN': CSRF, },
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

    translatedTextElement.innerHTML = corrected || t('newsfeed.translation_failed');
  } catch (err) {
    console.error(err);
    translatedTextElement.innerHTML = t('newsfeed.translation_error');
  } finally {
    loadingIndicator.style.display = 'none';
    event.target.disabled = false;
  }
});

// ———————————————————————————————————————————————————————————————
// COMPLETIONS
function extractCompletions(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  if (Array.isArray(payload.data?.results)) return payload.data.results;
  if (Array.isArray(payload.data?.items))   return payload.data.items;
  if (Array.isArray(payload.data))          return payload.data;
  if (Array.isArray(payload.items))         return payload.items;
  if (Array.isArray(payload.results))       return payload.results;

  const numeric = Object.keys(payload)
    .filter(k => /^\d+$/.test(k))
    .sort((a,b)=>(+a)-(+b))
    .map(k => payload[k])
    .filter(v => v && typeof v === 'object');
  return numeric;
}

function extractTotalCount(payload, items) {
  if (Array.isArray(items) && items.length) {
    const n = Number(items[0]?.total_results);
    if (Number.isFinite(n)) return n;
  }
  const p = payload || {};
  const candidates = [p.total_results, p.total, p.count, p.data?.total_results, p.data?.total];
  for (const c of candidates) {
    const n = Number(c);
    if (Number.isFinite(n)) return n;
  }
  return items.length;
}

async function loadCompletions(append = false) {
  const container = document.getElementById('completionsContainer');
  if (!container) return;

  const skelCount = append ? Math.min(3, compPageSize) : Math.min(6, compPageSize);
  insertCompSkeleton(append, skelCount);

  try {
    const params = new URLSearchParams({
      page_size: String(compPageSize),
      page_number: String(compPage),
    });

    const payload = await fetchJsonStrict(`/api/completions/all?${params}`, {
      method: 'GET',
      headers: { Accept: 'application/json', 'X-CSRF-TOKEN': CSRF },
      cache: 'no-store',
      credentials: 'same-origin',
    });

    const items = extractCompletions(payload);

    compTotalResults = extractTotalCount(payload, items);
    compTotalPages   = Math.max(1, Math.ceil(compTotalResults / compPageSize));

    const cards = [];
    for (const it of items) {
      try {
        cards.push(await renderCompletionCard(it));
      } catch (err) {
        console.warn('renderCompletionCard failed for item:', it, err);
      }
    }
    const html = cards.join('');

    if (append) removeCompSkeleton();

    if (append) container.insertAdjacentHTML('beforeend', html);
    else container.innerHTML = html;

    const animateCompCards = (cards) => {
      cards.forEach((card, i) => {
        if (card.dataset.animated === '1') return;
        card.style.opacity = '0';
        card.style.transform = 'translateY(6px)';
        setTimeout(() => {
          card.style.transition = 'opacity .35s ease, transform .35s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
          setTimeout(() => { card.dataset.animated = '1'; }, 400);
        }, i * 50);
      });
    };

    if (append) {
      const newCards = Array.from(container.querySelectorAll('.comp-card')).slice(-items.length);
      animateCompCards(newCards);
    } else {
      animateCompCards(container.querySelectorAll('.comp-card'));
    }

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
    removeCompSkeleton();
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

  const base = cdnAsset('assets/verifications/new/verification/');

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
    return t('completions.status.verified_screenshot');
  if (item?.verified && item?.completion && item?.video)
    return t('completions.status.verified_completion_video');
  if (!item?.verified && item?.completion) return t('completions.status.pending_review');
  if (item?.verified && !item?.completion) return t('completions.status.verified_record');
  return t('completions.status.under_review');
}

async function fetchDiscordAvatar(user_id) {
  try {
    const response = await fetch(`/api/settings/user-avatar?user_id=${user_id}`);
    if (!response.ok) return cdnAsset('assets/profile/default-avatar.png');
    const json = await response.json();
    return json.avatar_url || cdnAsset('assets/profile/default-avatar.png');
  } catch (e) {
    return cdnAsset('assets/profile/default-avatar.png');
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
    showErrorMessage(t('common.missing_ids'));
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
    showErrorMessage(t('completions.upvote_failed'))
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
            aria-label="${t('common.upvote')}">
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
      ${t('completions.watch')}
    </a>
  `;
}

async function renderCompletionCard(item) {
  const nickname = item?.nickname || 'Unknown';
  const akaRaw = item?.also_known_as;
  const akaText = Array.isArray(akaRaw)
    ? akaRaw.filter(Boolean).join(', ')
    : String(akaRaw ?? '').trim();
  const mapName = item?.map_name || 'Unknown map';
  const mapDifficulty = item?.difficulty || 'Unknown difficulty';
  const code = String(item?.code ?? item?.map_code ?? '').trim();
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
              ${t('completions.new_submission_from', { nickname })}
            </h3>

            <div class="mt-2 flex flex-wrap gap-1.5">
              ${code ? kvLineCopyable(t('completions.kv.code'), code) : kvLine(t('completions.kv.code'), code)}
              ${kvLine(t('completions.kv.map'), mapName)}
              ${kvLineDiff(t('completions.kv.difficulty'), mapDifficulty)}
              ${kvLine(t('completions.kv.time'), timeFmt)}
              ${kvLine(t('completions.kv.aka'), akaText || '—')}
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
          title="${t('completions.open_screenshot')}"
        >
          <div class="relative aspect-[16/9] w-full">
            <img
              src="${sshot}"
              alt="Screenshot"
              class="absolute cursor-pointer inset-0 h-full w-full object-contain rounded-xl transition group-hover:opacity-95"
              data-hide-on-error
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
        <img id="ssModalImg" src="" alt="${t('completions.screenshot_alt')}"
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
  const el = e.target.closest('.map-code');
  if (!el) return;

  const raw = el.getAttribute('data-copy-code')
            || el.getAttribute('data-map-code')
            || el.textContent
            || '';
  const toCopy = String(raw).trim().replace(/^#/, '');

  void logMapCopy(toCopy, 'web');

  const ok = await copyToClipboard(toCopy);
  if (ok) notifyCodeCopied(toCopy);
  else    showErrorMessage(t('newsfeed.copy_clipboard_error'));
});

function notifyCodeCopied(raw) {
  const code = String(raw || '').trim().replace(/^#/, '');
  const msg  = typeof t === 'function'
    ? t('newsfeed.copy_code', { code })
    : `Map code copied : ${code}`;
  showConfirmationMessage(msg);
}

document.addEventListener('error', (e) => {
  const t = e.target;
  if (t && t.matches?.('[data-hide-on-error]')) {
    t.closest('[data-open-screenshot]')?.remove() || t.classList.add('hidden');
  }
}, true);

/* =========================
   COMPLETIONS SKELETON
   ========================= */
function compSkeletonCard() {
  return `
    <article class="comp-card comp-skel h-full rounded-2xl border border-white/10 bg-zinc-900/60 p-3 sm:p-4 animate-pulse" aria-hidden="true">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-start gap-3 min-w-0">
          <div class="h-10 w-10 rounded-full bg-white/10 ring-2 ring-white/10"></div>
          <div class="min-w-0 flex-1">
            <div class="h-4 w-48 rounded bg-white/10"></div>
            <div class="mt-2 flex flex-wrap gap-1.5">
              <div class="h-5 w-20 rounded-md bg-white/10"></div>
              <div class="h-5 w-28 rounded-md bg-white/10"></div>
              <div class="h-5 w-24 rounded-md bg-white/10"></div>
              <div class="h-5 w-16 rounded-md bg-white/10"></div>
            </div>
          </div>
        </div>
        <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 ring-1 ring-white/10"></div>
      </div>

      <div class="mt-2 h-4 w-3/4 rounded bg-white/10"></div>

      <div class="mt-3 w-full aspect-[16/9] rounded-xl border border-white/10 bg-white/5"></div>

      <div class="mt-3 flex items-center gap-2">
        <div class="h-9 w-14 rounded-full bg-white/10"></div>
      </div>
    </article>
  `;
}

function insertCompSkeleton(append = false, count = 3) {
  const container = document.getElementById('completionsContainer');
  if (!container) return;
  const html = Array.from({ length: Math.max(1, count) }, compSkeletonCard).join('');
  if (append) container.insertAdjacentHTML('beforeend', html);
  else container.innerHTML = html;
}

function removeCompSkeleton() {
  document.querySelectorAll('#completionsContainer .comp-skel').forEach((n) => n.remove());
}

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
          <span class="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">${t('changelogs.latest')}</span>
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
        ${t('changelogs.title')}
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
        wrap.innerHTML = `<p class="text-sm text-zinc-300">${t('changelogs.none')}</p>`;
        return
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
          ${rel.url ? `<a class="mt-3 inline-flex items-center gap-1.5 text-xs text-brand-300 hover:text-brand-200 underline underline-offset-2" href="${rel.url}" target="_blank" rel="noopener">${t('changelogs.view_on_github')}</a>` : ``}
        </article>
      `;
        })
        .join('');

      wrap.innerHTML = blocks;
    })
    .catch(() => {
      const wrap = document.getElementById('changelogsScroll');
      if (wrap) wrap.innerHTML = `<p class="text-sm text-rose-300">${t('changelogs.fetch_failed')}</p>`;
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

/* =========================
   COMMUNITY PICKS
   ========================= */
(() => {
  const card = document.getElementById('communityPicksCard');
  if (!card) return;

  const raw = card.dataset.endpoint;
  const endpoint = new URL(raw, window.location.origin).href;

  const rawFull = card.dataset.fullEndpoint || raw.replace(/limit=\d+/, 'limit=25');
  const fullEndpoint = new URL(rawFull, window.location.origin).href;

  const _i18n = window.NEWSFEED_I18N || {};
  const t = (path, params = {}) => {
    const parts = String(path).split('.');
    let out = _i18n;
    for (const p of parts) out = out?.[p];
    if (typeof out !== 'string') out = path;
    for (const [k, v] of Object.entries(params)) {
      const val = String(v ?? '');
      out = out.replaceAll(`{${k}}`, val).replaceAll(`:${k}`, val);
    }
    return out;
  };
  const tOr = (k, fb) => (t(k) === k ? fb : t(k));

  const labels = {
    upvotes: tOr('sidebar.upvotes', 'Upvotes'),
    details: tOr('sidebar.details', 'Details'),
    copyCode: tOr('sidebar.copy_code', 'Copy code'),
  };

  const listEl     = document.getElementById('cpList');
  const skeletonEl = document.getElementById('cpSkeleton');
  const errorEl    = document.getElementById('cpError');

  const openBtn    = document.getElementById('openCommunityPicksModal');
  const overlay    = document.getElementById('cpModalOverlay');
  const box        = document.getElementById('cpModalBox');
  const closeBtn   = document.getElementById('closeCpModal');
  const modalList  = document.getElementById('cpModalList');
  const modalSkel  = document.getElementById('cpModalSkeleton');
  const modalErr   = document.getElementById('cpModalError');

  const esc = (s) => String(s ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');

  function renderInto(ul, items, { dense = false } = {}) {
    ul.innerHTML = '';
    for (const m of items) {
      const banner = m.map_banner || m.banner_url || `${cdnAsset('assets/map_banners/')}${(m.map_name || '').toLowerCase().replace(/[^a-z0-9]/g,'')}.png`;
      const code   = m.code || m.map_code || '';
      const name   = m.map_name || m.name || '';
      const upv    = Number(m.upvotes ?? m.votes ?? 0) || 0;

      const li = document.createElement('li');
      li.className = dense
        ? 'flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2'
        : 'flex items-center justify-between';

      li.innerHTML = `
        <div class="flex min-w-0 items-center gap-2">
        <div class="h-9 w-20 shrink-0 rounded-md border border-white/10 bg-zinc-900/50 overflow-hidden">
          <img src="${esc(banner)}" alt="${esc(name)}"
                class="h-full w-full object-cover"
                data-hide-on-error />
        </div>
          <div class="min-w-0">
            <div class="truncate font-semibold">${esc(name)}</div>
            <button type="button"
              class="map-code mt-0.5 inline-flex items-center gap-1 rounded border border-white/10 bg-zinc-900/60 px-1.5 py-0.5 text-[11px] font-mono text-emerald-200 hover:bg-white/10 cursor-pointer"
              title="${esc(labels.copyCode)}"
              aria-label="${esc(labels.copyCode)}"
              data-copy-code="${esc(code)}">#${esc(code)}</button>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span class="text-zinc-300 text-sm" title="${esc(labels.upvotes)}">★ ${upv}</span>
        </div>
      `;
      ul.appendChild(li);
    }
  }

  /* --- skeleton & fetch --- */
  async function loadTop3() {
    skeletonEl.hidden = false; errorEl.hidden = true;
    try {
      const res = await fetch(endpoint, { headers: { Accept: 'application/json' }, credentials: 'same-origin', cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      const items = Array.isArray(data) ? data.slice(0,3) : (Array.isArray(data?.items) ? data.items.slice(0,3) : []);
      renderInto(listEl, items, { dense: false });
    } catch (e) {
      errorEl.hidden = false;
      console.error('Community picks failed:', e);
    } finally {
      skeletonEl.hidden = true;
    }
  }

  async function loadAllInModal() {
    modalSkel.hidden = false; modalErr.hidden = true; modalList.innerHTML = '';
    try {
      const res = await fetch(fullEndpoint, { headers: { Accept: 'application/json' }, credentials: 'same-origin', cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      const items = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
      renderInto(modalList, items, { dense: true });
    } catch (e) {
      modalErr.hidden = false;
    } finally {
      modalSkel.hidden = true;
    }
  }

  /* --- modal --- */
  function openModal() {
    overlay.classList.remove('hidden');
    requestAnimationFrame(() => {
      box.classList.remove('opacity-0','scale-95');
      box.classList.add('opacity-100','scale-100');
    });
    box.classList.add('mt-10','sm:mt-14');
    const card = box.querySelector('div.rounded-2xl.border');
    if (card) {
      card.classList.add('max-h-[70vh]', 'overflow-y-auto', 'overflow-x-hidden');
    }
    loadAllInModal();
  }
  function closeModal() {
    box.classList.add('opacity-0','scale-95');
    box.classList.remove('opacity-100','scale-100');
    setTimeout(() => overlay.classList.add('hidden'), 180);
  }

  openBtn?.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (!overlay.classList.contains('hidden') && e.key === 'Escape') closeModal(); });

  loadTop3();
})();