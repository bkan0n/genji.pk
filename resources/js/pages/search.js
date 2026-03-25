import { cdnAsset, cdnImage } from "../utils/cdn";

/* =========================
   CONFIG & UTILS
   ========================= */
const filterOptions = {};
const selectedFilters = [];
let mechanicsOptions = [];
let restrictionsOptions = [];
let currentSection = '';
let currentPage = 1;
let cachedPages = {};
let filters = {};
let activeFilters = {};
let persistentFilters = {};
let icons = [];
let debounceTimeout;
const pageSize = 25;

function getEffectivePageSize(section = currentSection) {
  // Map Search: cards layout fits 27 items (3 x 9)
  if (section === 'map_search' && String(mapSearchView || '').toLowerCase() === 'cards') return 27;
  return pageSize;
}

let totalPages = 1;
let hideTimeout;
const resultsContainer = document.getElementById('resultsContainer');
const CURRENT_LANG = document.documentElement.lang || 'en';
let translations = window.SEARCH_I18N || {};

/* =========================
   MAP NAME TRANSLATIONS
   ========================= */
const MAPS_TRANSLATIONS_URL = '/translations/maps.json';

let __mapsJsonPromise = null;
let __mapsIndexPromise = null;
let __mapsIndex = null;

function __normalizeMapNameKey(input) {
  const s = String(input ?? '').trim();
  if (!s) return '';
  let out = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  out = out.replace(/[()]/g, ' ');
  out = out.replace(/[’'"]/g, '');
  out = out.replace(/[^a-zA-Z0-9\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7a3]+/g, ' ');
  out = out.replace(/\s+/g, ' ').trim().toLowerCase();
  return out;
}

async function __loadMapsJson() {
  if (!__mapsJsonPromise) {
    __mapsJsonPromise = fetch(MAPS_TRANSLATIONS_URL, { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}));
  }
  return __mapsJsonPromise;
}

async function ensureMapsIndex() {
  if (__mapsIndex) return __mapsIndex;
  if (!__mapsIndexPromise) {
    __mapsIndexPromise = (async () => {
      const data = await __loadMapsJson();
      const list = [];
      const enToZh = new Map();
      const enNormToZh = new Map();
      const zhToEn = new Map();
      const zhNormToEn = new Map();

      if (data && typeof data === 'object') {
        Object.entries(data).forEach(([key, v]) => {
          if (!v || typeof v !== 'object') return;
          const en = String(v['en-US'] || '').trim();
          const zh = String(v['zh-CN'] || '').trim();
          if (!en) return;

          const zhDisplay = zh || en;
          list.push({ key, en, zh: zhDisplay });

          enToZh.set(en, zhDisplay);
          const enNorm = __normalizeMapNameKey(en);
          if (enNorm) enNormToZh.set(enNorm, zhDisplay);

          if (zh) {
            zhToEn.set(zh, en);
            const zhNorm = __normalizeMapNameKey(zh);
            if (zhNorm) zhNormToEn.set(zhNorm, en);
          }
        });
      }

      __mapsIndex = { list, enToZh, enNormToZh, zhToEn, zhNormToEn };
      return __mapsIndex;
    })();
  }
  return __mapsIndexPromise;
}

function mapNameToCnDisplay(enName) {
  const raw = String(enName ?? '').trim();
  if (!raw) return raw;
  if (typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG !== 'cn') return raw;
  const idx = __mapsIndex;
  if (!idx) return raw;
  return idx.enToZh.get(raw) || idx.enNormToZh.get(__normalizeMapNameKey(raw)) || raw;
}

function mapNameCnToEnSmart(value) {
  const v = String(value ?? '').trim();
  if (!v) return v;
  const idx = __mapsIndex;
  if (!idx) return v;
  return idx.zhToEn.get(v) || idx.zhNormToEn.get(__normalizeMapNameKey(v)) || v;
}

async function resolveEnglishMapNameExact(name) {
  const raw = String(name ?? '').trim();
  if (!raw) return null;
  try {
    const url = buildAutocompleteUrl('map-names', { value: raw, locale: 'en', pageSize: 20 });
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data)) return null;

    const lower = raw.toLowerCase();
    const exact = data.find((x) => x && x.map_name && String(x.map_name).toLowerCase() === lower);
    if (exact && exact.map_name) return String(exact.map_name);

    const first = data.find((x) => x && x.map_name);
    return first && first.map_name ? String(first.map_name) : null;
  } catch {
    return null;
  }
}

async function canonicalizeMapNameForApi(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return raw;

  if (typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'cn') {
    await ensureMapsIndex().catch(() => {});
  }

  const cand = (typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'cn' && /[\u4e00-\u9fff]/.test(raw))
    ? mapNameCnToEnSmart(raw)
    : raw;

  const resolved = await resolveEnglishMapNameExact(cand);
  return resolved || cand;
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'cn') {
      ensureMapsIndex().catch(() => {});
    }
  });
}

const MAP_VIEW_LS_KEY = 'map_search_view';
const VIEW_DEFAULTS = {
  map_search: 'cards',
  completions: 'table',
  personal_records: 'cards',
};
const getStoredView = (key, fallback) => {
  const v = localStorage.getItem(key);
  if (v === 'table' || v === 'cards') return v;
  try { localStorage.setItem(key, fallback); } catch {}
  return fallback;
};
let mapSearchView = getStoredView(MAP_VIEW_LS_KEY, VIEW_DEFAULTS.map_search);
let lastMapRows = [];
const COMPLETIONS_VIEW_LS_KEY = 'completions_view';
let completionsView = getStoredView(COMPLETIONS_VIEW_LS_KEY, VIEW_DEFAULTS.completions);
let lastCompletionsRows = [];
const PERSONAL_RECORDS_VIEW_LS_KEY = 'personal_records_view';
let personalRecordsView = getStoredView(PERSONAL_RECORDS_VIEW_LS_KEY, VIEW_DEFAULTS.personal_records);
let lastPersonalRows = [];
const OFFICIAL_NOTICE_ID = 'officialCodeNotice';

const VIEW_LS_KEYS = {
  map_search: MAP_VIEW_LS_KEY,
  completions: COMPLETIONS_VIEW_LS_KEY,
  personal_records: PERSONAL_RECORDS_VIEW_LS_KEY,
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

const difficultyOptions = ['Easy', 'Medium', 'Hard', 'Very Hard', 'Extreme', 'Hell'];

function difficultyToolbarLabelKey(value) {
  switch (String(value || '').trim()) {
    case 'Easy': return 'easy';
    case 'Medium': return 'medium';
    case 'Hard': return 'hard';
    case 'Very Hard': return 'very_hard';
    case 'Extreme': return 'extreme';
    case 'Hell': return 'hell';
    default: return '';
  }
}

function getExactDifficultyFilterOptions() {
  return difficultyOptions.map((value) => {
    const labelKey = difficultyToolbarLabelKey(value);
    return {
      text: t(`filters_toolbar.${labelKey}`) || value,
      value,
      raw: value,
    };
  });
}

// Toolbar
const toolbar = document.querySelector('.toolbar');
const iconName = document.getElementById('icon-name');
const circle = document.querySelector('.selection-circle');

/* =========================
   Autocomplete URLs
   ========================= */
function buildAutocompleteUrl(kind, { value = '', locale = 'en', pageSize = 10 } = {}) {
  switch (kind) {
    case 'map-codes':
      return `/api/autocomplete/map-codes?search=${encodeURIComponent(value)}&limit=${pageSize}`;
    case 'users':
      return `/api/autocomplete/users?value=${encodeURIComponent(value)}&page_size=${pageSize}`;
    case 'map-names':
      return `/api/autocomplete/map-names/${encodeURIComponent(locale)}?value=${encodeURIComponent(value)}&page_size=${pageSize}`;
    default:
      return '';
  }
}

/* =========================
   Demo loaders
   ========================= */
const sectionLoadingOperations = {
  mapSearch: async () => {
    const params = new URLSearchParams({ page_size: '25', page_number: '1' });

    const uid = typeof window !== 'undefined' && window.user_id ? String(window.user_id) : '';
    if (uid) params.set('user_id', uid);

    const r = await fetch(`${apiUrls.mapSearch}?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    await r.json();
  },

  completions: async () => {
    const code = '008EX';
    const qp = new URLSearchParams({ page_number: '1', page_size: '25' });
    const r = await fetch(`${apiUrls.completions}/${encodeURIComponent(code)}?${qp.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    await r.json();
  },

  guide: async () => {
    const code = '008EX';
    const r = await fetch(
      `${apiUrls.guide}/${encodeURIComponent(code)}/guides?include_records=true`,
      { headers: { Accept: 'application/json' } }
    );
    await r.json();
  },

  personalRecords: async () => {
    const params = new URLSearchParams({ page_number: '1', page_size: '25' });

    const uid = typeof user_id !== 'undefined' && user_id ? String(user_id) : '';
    if (uid) params.set('user_id', uid);

    const r = await fetch(`${apiUrls.personalRecords}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    await r.json();
  },
};

/* =========================
   API endpoints
   ========================= */
const apiUrls = {
  mapSearch: '/api/maps',
  completions: '/api/completions',
  mapEdits: '/api/maps/map-edits',
  guide: '/api/maps',
  personalRecords: '/api/completions',
};

/* =========================
   HELPERS Inline
   ========================= */
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
function __clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
function __ms(n) {
  return Math.round(Number(n) || 0);
}

function showEl(el) {
  if (!el) return;
  el.classList.remove(...String('u-d-none').trim().split(/\s+/).filter(Boolean));
  el.classList.add(...String('u-d-block').trim().split(/\s+/).filter(Boolean));
}
function showFlex(el) {
  if (!el) return;
  el.classList.remove(...String('u-d-none').trim().split(/\s+/).filter(Boolean));
  el.classList.add(...String('u-flex').trim().split(/\s+/).filter(Boolean));
}
function hideEl(el) {
  if (!el) return;
  el.classList.remove(...String('u-d-block').trim().split(/\s+/).filter(Boolean), ...String('u-flex').trim().split(/\s+/).filter(Boolean));
  el.classList.add(...String('u-d-none').trim().split(/\s+/).filter(Boolean));
}

const __madeAnim = new Set();
function __clsAnimDelay(ms) {
  const v = __ms(ms),
    name = `anim-delay-${v}`;
  if (!__madeAnim.has(v)) {
    __addRule(`.${name}`, `animation-delay:${v}ms !important`);
    __madeAnim.add(v);
  }
  return name;
}
const __madeTrans = new Set();
function __clsTransDelay(ms) {
  const v = __ms(ms),
    name = `trans-delay-${v}`;
  if (!__madeTrans.has(v)) {
    __addRule(`.${name}`, `transition-delay:${v}ms !important`);
    __madeTrans.add(v);
  }
  return name;
}
const __madeSf = new Set();
function __clsSfDelay(ms) {
  const v = __ms(ms),
    name = `sf-delay-${v}`;
  if (!__madeSf.has(v)) {
    __addRule(`.${name}`, `--d:${v}ms`);
    __madeSf.add(v);
  }
  return name;
}

const __posCache = new Map();
function __clsPos(top, left, minW) {
  const t = Math.round(top),
    l = Math.round(left),
    w = Math.max(0, Math.round(minW || 0));
  const key = `${t}|${l}|${w}`;
  let cls = __posCache.get(key);
  if (!cls) {
    cls = `fl-${t}-${l}-${w}`;
    __addRule(`.${cls}`, `top:${t}px;left:${l}px;${w ? `min-width:${w}px;` : ''}`);
    __posCache.set(key, cls);
  }
  return cls;
}
function __applyPos(el, top, left, minW) {
  const prev = el.dataset.posCls;
  if (prev) el.classList.remove(...String(prev).trim().split(/\s+/).filter(Boolean));
  const cls = __clsPos(top, left, minW);
  el.classList.add(...String(cls).trim().split(/\s+/).filter(Boolean));
  el.dataset.posCls = cls;
}

const __colorCache = new Map();
function __clsTextColor(hex) {
  const key = String(hex || '#fff')
    .toLowerCase()
    .replace(/[^a-f0-9#]/g, '');
  if (!__colorCache.has(key)) {
    const cls = `tc-${key.replace(/#/g, '') || 'x'}`;
    __addRule(`.${cls}`, `color:${key} !important`);
    __colorCache.set(key, cls);
  }
  return __colorCache.get(key);
}

__addRule(
  '.qmb .qmb-fill',
  'width:0; transition:width .6s ease; display:block; height:6px; border-radius:9999px'
);
const __qmbW = new Map();
function __clsWidthPct(p) {
  const v = Math.max(0, Math.min(100, Math.round(p)));
  if (!__qmbW.has(v)) {
    const cls = `w-${v}`;
    __addRule(`.${cls} .qmb-fill, .qmb-fill.${cls}`, `width:${v}% !important`);
    __qmbW.set(v, cls);
  }
  return __qmbW.get(v);
}
const __qmbC = new Map();
function __clsQmbColor(color) {
  const key = String(color || '#22c55e')
    .toLowerCase()
    .replace(/[^a-f0-9#]/g, '');
  if (!__qmbC.has(key)) {
    const cls = `qmbc-${key.replace(/#/g, '') || 'x'}`;
    __addRule(`.${cls} .qmb-fill`, `background-color:${key} !important`);
    __qmbC.set(key, cls);
  }
  return __qmbC.get(key);
}

/* =========================
   Icônes
   ========================= */
function initializeIcons() {
  icons = [
    'code',
    'user',
    'creator',
    'map_name',
    'difficulty_exact',
    'category',
    'mechanics',
    'restrictions',
    'tags',
    'playtest_filter',
    'completion_filter',
    'medal_filter',
    'official', 
    'apply_filters',
    'clear_filters',
  ].map((id) => ({
    id,
    name:
     (id === 'official'
       ? t('filters_toolbar.server')
       : t(`filters_toolbar.${id}`)) || id.replace(/_/g, ' ').toUpperCase(),
    svg: getIconSVG(id),
  }));
}

function getIconSVG(id) {
  const svgs = {
    code: `<path d="M15 9H15.01M15 15C18.3137 15 21 12.3137 21 9C21 5.68629 18.3137 3 15 3C11.6863 3 9 5.68629 9 9C9 9.27368 9.01832 9.54308 9.05381 9.80704C9.11218 10.2412 9.14136 10.4583 9.12172 10.5956C9.10125 10.7387 9.0752 10.8157 9.00469 10.9419C8.937 11.063 8.81771 11.1823 8.57913 11.4209L3.46863 16.5314C3.29568 16.7043 3.2092 16.7908 3.14736 16.8917C3.09253 16.9812 3.05213 17.0787 3.02763 17.1808C3 17.2959 3 17.4182 3 17.6627V19.4C3 19.9601 3 20.2401 3.10899 20.454C3.20487 20.6422 3.35785 20.7951 3.54601 20.891C3.75992 21 4.03995 21 4.6 21H6.33726C6.58185 21 6.70414 21 6.81923 20.9724C6.92127 20.9479 7.01881 20.9075 7.10828 20.8526C7.2092 20.7908 7.29568 20.7043 7.46863 20.5314L12.5791 15.4209C12.8177 15.1823 12.937 15.063 13.0581 14.9953C13.1843 14.9248 13.2613 14.8987 13.4044 14.8783C13.5417 14.8586 13.7588 14.8878 14.193 14.9462C14.4569 14.9817 14.7263 15 15 15Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    creator: `<path d="M16.5 14C16.2164 12.8589 14.981 12 13.5 12C12.019 12 10.7836 12.8589 10.5 14M13.5 8H13.51M18 21H10.2C7.67976 21 6.41965 21 5.45704 20.5095C4.61031 20.0781 3.9219 19.3897 3.49047 18.543C3 17.5804 3 16.3202 3 13.8V6M9.2 18H17.8C18.9201 18 19.4802 18 19.908 17.782C20.2843 17.5903 20.5903 17.2843 20.782 16.908C21 16.4802 21 15.9201 21 14.8V6.2C21 5.0799 21 4.51984 20.782 4.09202C20.5903 3.71569 20.2843 3.40973 19.908 3.21799C19.4802 3 18.9201 3 17.8 3H9.2C8.0799 3 7.51984 3 7.09202 3.21799C6.71569 3.40973 6.40973 3.71569 6.21799 4.09202C6 4.51984 6 5.07989 6 6.2V14.8C6 15.9201 6 16.4802 6.21799 16.908C6.40973 17.2843 6.71569 17.5903 7.09202 17.782C7.51984 18 8.0799 18 9.2 18ZM14.5 8C14.5 8.55228 14.0523 9 13.5 9C12.9477 9 12.5 8.55228 12.5 8C12.5 7.44772 12.9477 7 13.5 7C14.0523 7 14.5 7.44772 14.5 8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    user: `<path d="M16.5 14C16.2164 12.8589 14.981 12 13.5 12C12.019 12 10.7836 12.8589 10.5 14M13.5 8H13.51M18 21H10.2C7.67976 21 6.41965 21 5.45704 20.5095C4.61031 20.0781 3.9219 19.3897 3.49047 18.543C3 17.5804 3 16.3202 3 13.8V6M9.2 18H17.8C18.9201 18 19.4802 18 19.908 17.782C20.2843 17.5903 20.5903 17.2843 20.782 16.908C21 16.4802 21 15.9201 21 14.8V6.2C21 5.0799 21 4.51984 20.782 4.09202C20.5903 3.71569 20.2843 3.40973 19.908 3.21799C19.4802 3 18.9201 3 17.8 3H9.2C8.0799 3 7.51984 3 7.09202 3.21799C6.71569 3.40973 6.40973 3.71569 6.21799 4.09202C6 4.51984 6 5.07989 6 6.2V14.8C6 15.9201 6 16.4802 6.21799 16.908C6.40973 17.2843 6.71569 17.5903 7.09202 17.782C7.51984 18 8.0799 18 9.2 18ZM14.5 8C14.5 8.55228 14.0523 9 13.5 9C12.9477 9 12.5 8.55228 12.5 8C12.5 7.44772 12.9477 7 13.5 7C14.0523 7 14.5 7.44772 14.5 8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    map_name: `<path d="M14.4996 8.5001H14.5096M16.2196 19.9601L10.5508 14.2705C9.7579 13.4747 9.36143 13.0768 8.90391 12.9277C8.50148 12.7966 8.06782 12.7965 7.66534 12.9275C7.20776 13.0764 6.81115 13.4742 6.01792 14.2697L4.30299 15.9897M12.2385 15.9644L12.6069 15.5951C13.4081 14.7996 13.8087 14.4018 14.2689 14.2554C14.6737 14.1267 15.109 14.1302 15.5117 14.2654C15.9696 14.4191 16.3638 14.8232 17.1522 15.6314L18.8889 17.3881M18.8889 17.3881L21.5377 12.8001C21.706 12.5087 21.7901 12.3629 21.823 12.208C21.8522 12.0709 21.8522 11.9293 21.823 11.7922C21.7901 11.6373 21.706 11.4915 21.5377 11.2001L17.4615 4.13984C17.2932 3.8484 17.2091 3.70268 17.0914 3.5967C16.9872 3.50293 16.8645 3.43209 16.7313 3.38879C16.5806 3.33984 16.4124 3.33984 16.0758 3.33984H7.92336C7.58683 3.33984 7.41856 3.33984 7.26793 3.38879C7.13465 3.43209 7.01196 3.50293 6.90782 3.5967C6.79011 3.70268 6.70598 3.8484 6.53772 4.13984L2.46148 11.2001C2.29321 11.4915 2.20908 11.6373 2.17615 11.7922C2.14701 11.9293 2.14701 12.0709 2.17615 12.208C2.20908 12.3629 2.29321 12.5087 2.46148 12.8001L4.30299 15.9897M18.8889 17.3881L17.4615 19.8604C17.2932 20.1518 17.2091 20.2975 17.0914 20.4035C16.9872 20.4973 16.8645 20.5681 16.7313 20.6114C16.5806 20.6604 16.4124 20.6604 16.0758 20.6604H7.92336C7.58683 20.6604 7.41856 20.6604 7.26793 20.6114C7.13465 20.5681 7.01196 20.4973 6.90782 20.4035C6.79011 20.2975 6.70598 19.1518 6.53772 19.8604L4.30299 15.9897M14.9996 8.5001C14.9996 8.77624 14.7757 9.0001 14.4996 9.0001C14.2235 9.0001 13.9996 8.77624 13.9996 8.5001C13.9996 8.22396 14.2235 8.0001 14.4996 8.0001C14.7757 8.0001 14.9996 8.22396 14.9996 8.5001Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    difficulty_exact: `<path d="M4 8L6 20H18L20 8M4 8L5.71624 9.37299C6.83218 10.2657 7.39014 10.7121 7.95256 10.7814C8.4453 10.8421 8.94299 10.7173 9.34885 10.4314C9.81211 10.1051 10.0936 9.4483 10.6565 8.13476L12 5M4 8C4.55228 8 5 7.55228 5 7C5 6.44772 4.55228 6 4 6C3.44772 6 3 6.44772 3 7C3 7.55228 3.44772 8 4 8ZM20 8L18.2838 9.373C17.1678 10.2657 16.6099 10.7121 16.0474 10.7814C15.5547 10.8421 15.057 10.7173 14.6511 10.4314C14.1879 10.1051 13.9064 9.4483 13.3435 8.13476L12 5M20 8C20.5523 8 21 7.55228 21 7C21 6.44772 20.5523 6 20 6C19.4477 6 19 6.44772 19 7C19 7.55228 19.4477 8 20 8ZM12 5C12.5523 5 13 4.55228 13 4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4C11 4.55228 11.4477 5 12 5ZM12 4H12.01M20 7H20.01M4 7H4.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    category: `<path d="M11 8L16 8.00053M11 12L16 12.0005M11 16L16 16.0005M8 16H8.01M8 12H8.01M8 8H8.01M7.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.0799 20 7.2V16.8C20 17.9201 20 18.4802 19.782 18.908C19.5903 19.2843 19.5903 19.5903 18.908 19.782C18.4802 20 17.9201 20 16.8 20H7.2C6.0799 20 5.51984 20 5.09202 19.782C4.71569 19.5903 4.40973 19.5903 4.21799 18.908C4 18.4802 4 17.9201 4 16.8V7.2C4 6.0799 4 5.51984 4.21799 5.09202C4.40973 4.71569 4.40973 4.40973 5.09202 4.21799C5.51984 4 6.0799 4 7.2 4Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    mechanics: `
      <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12.9046 3.06005C12.6988 3 12.4659 3 12 3C11.5341 3 11.3012 3 11.0954 3.06005C10.7942 3.14794 10.5281 3.32808 10.3346 3.57511C10.2024 3.74388 10.1159 3.96016 9.94291 4.39272C9.69419 5.01452 9.00393 5.33471 8.36857 5.123L7.79779 4.93281C7.3929 4.79785 7.19045 4.73036 6.99196 4.7188C6.70039 4.70181 6.4102 4.77032 6.15701 4.9159C5.98465 5.01501 5.83376 5.16591 5.53197 5.4677C5.21122 5.78845 5.05084 5.94882 4.94896 6.13189C4.79927 6.40084 4.73595 6.70934 4.76759 7.01551C4.78912 7.2239 4.87335 7.43449 5.04182 7.85566C5.30565 8.51523 5.05184 9.26878 4.44272 9.63433L4.16521 9.80087C3.74031 10.0558 3.52786 10.1833 3.37354 10.3588C3.23698 10.5141 3.13401 10.696 3.07109 10.893C3 11.1156 3 11.3658 3 11.8663C3 12.4589 3 12.7551 3.09462 13.0088C3.17823 13.2329 3.31422 13.4337 3.49124 13.5946C3.69158 13.7766 3.96395 13.8856 4.50866 14.1035C5.06534 14.3261 5.35196 14.9441 5.16236 15.5129L4.94721 16.1584C4.79819 16.6054 4.72367 16.829 4.7169 17.0486C4.70875 17.3127 4.77049 17.5742 4.89587 17.8067C5.00015 18.0002 5.16678 18.1668 5.5 18.5C5.83323 18.8332 5.99985 18.9998 6.19325 19.1041C6.4258 19.2295 6.68733 19.2913 6.9514 19.2831C7.17102 19.2763 7.39456 19.2018 7.84164 19.0528L8.36862 18.8771C9.00393 18.6654 9.6942 18.9855 9.94291 19.6073C10.1159 20.0398 10.2024 20.2561 10.3346 20.4249C10.5281 20.6719 10.7942 20.8521 11.0954 20.94C11.3012 21 11.5341 21 12 21C12.4659 21 12.6988 21 12.9046 20.94C13.2058 20.8521 13.4719 20.6719 13.6654 20.4249C13.7976 20.2561 13.8841 20.0398 14.0571 19.6073C14.3058 18.9855 14.9961 18.6654 15.6313 18.8773L16.1579 19.0529C16.605 19.2019 16.8286 19.2764 17.0482 19.2832C17.3123 19.2913 17.5738 19.2296 17.8063 19.1042C17.9997 18.9999 18.1664 18.8333 18.4996 18.5001C18.8328 18.1669 18.9994 18.0002 19.1037 17.8068C19.2291 17.5743 19.2908 17.3127 19.2827 17.0487C19.2759 16.8291 19.2014 16.6055 19.0524 16.1584L18.8374 15.5134C18.6477 14.9444 18.9344 14.3262 19.4913 14.1035C20.036 13.8856 20.3084 13.7766 20.5088 13.5946C20.6858 13.4337 20.8218 13.2329 20.9054 13.0088C21 12.7551 21 12.4589 21 11.8663C21 11.3658 21 11.1156 20.9289 10.893C20.866 10.696 20.763 10.5141 20.6265 10.3588C20.4721 10.1833 20.2597 10.0558 19.8348 9.80087L19.5569 9.63416C18.9478 9.26867 18.6939 8.51514 18.9578 7.85558C19.1262 7.43443 19.2105 7.22383 19.232 7.01543C19.2636 6.70926 19.2003 6.40077 19.0506 6.13181C18.9487 5.94875 18.7884 5.78837 18.4676 5.46762C18.1658 5.16584 18.0149 5.01494 17.8426 4.91583C17.5894 4.77024 17.2992 4.70174 17.0076 4.71872C16.8091 4.73029 16.6067 4.79777 16.2018 4.93273L15.6314 5.12287C14.9961 5.33464 14.3058 5.0145 14.0571 4.39272C13.8841 3.96016 13.7976 3.74388 13.6654 3.57511C13.4719 3.32808 13.2058 3.14794 12.9046 3.06005Z" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    `,
    restrictions: `<path d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    tags: `<path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3H4a1 1 0 0 0-1 1v5.59A2 2 0 0 0 3.83 11l9.59 9.59a2 2 0 0 0 2.83 0l4.34-4.34a2 2 0 0 0 0-2.83ZM7.5 8A1.5 1.5 0 1 1 9 6.5 1.5 1.5 0 0 1 7.5 8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    playtest_filter: `<path d="M14.2639 15.9376L12.5958 14.2835C11.7909 13.4852 11.3884 13.0861 10.9266 12.9402C10.5204 12.8119 10.0838 12.8166 9.68048 12.9537C9.22188 13.1096 8.82814 13.5173 8.04068 14.3327L4.04409 18.2802M14.2639 15.9376L14.6053 15.5991C15.4112 14.7999 15.8141 14.4003 16.2765 14.2544C16.6831 14.1262 17.12 14.1312 17.5236 14.2688C17.9824 14.4252 18.3761 14.834 19.1634 15.6515L20 16.4936M14.2639 15.9376L18.275 19.9566M18.275 19.9566C17.9176 20.0001 17.4543 20.0001 16.8 20.0001H7.2C6.07989 20.0001 5.51984 20.0001 5.09202 19.7821C4.71569 19.5904 4.40973 19.2844 4.21799 18.9081C4.12796 18.7314 4.07512 18.5322 4.04409 18.2802M18.275 19.9566C18.5293 19.9257 18.7301 19.8728 18.908 19.7821C19.2843 19.5904 19.5903 19.2844 19.782 18.9081C20 18.4803 20 17.9202 20 16.8001V16.4936M12.5 4L7.2 4.00011C6.07989 4.00011 5.51984 4.00011 5.09202 4.21809C4.71569 4.40984 4.40973 4.7158 4.21799 5.09213C4 5.51995 4 6.08 4 7.20011V16.8001C4 17.4576 4 17.9222 4.04409 18.2802M20 11.5V16.4936M14 10.0002L16.0249 9.59516C16.2015 9.55984 16.2898 9.54219 16.3721 9.5099C16.4452 9.48124 16.5146 9.44407 16.579 9.39917C16.6515 9.34859 16.7152 9.28492 16.8425 9.1576L21 5.00015C21.5522 4.44787 21.5522 3.55244 21 3.00015C20.4477 2.44787 19.5522 2.44787 19 3.00015L14.8425 7.1576C14.7152 7.28492 14.6515 7.34859 14.6009 7.42112C14.556 7.4855 14.5189 7.55494 14.4902 7.62801C14.4579 7.71033 14.4403 7.79862 14.4049 7.97518L14 10.0002Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    completion_filter: `<path d="M9 12L11 14L15 10M12 3L13.9101 4.87147L16.5 4.20577L17.2184 6.78155L19.7942 7.5L19.1285 10.0899L21 12L19.1285 13.9101L19.7942 16.5L17.2184 17.2184L16.5 19.7942L13.9101 19.1285L12 21L10.0899 19.1285L7.5 19.7942L6.78155 17.2184L4.20577 16.5L4.87147 13.9101L3 12L4.87147 10.0899L4.20577 7.5L6.78155 6.78155L7.5 4.20577L10.0899 4.87147L12 3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    medal_filter: `<path d="M12 11L8 3H4L8.5058 12.4622M12 11L16 3H20L15.4942 12.4622M12 11C13.344 11 14.5848 11.5635 15.4942 12.4622M12 11C10.656 11 9.41518 11.5635 8.5058 12.4622M15.4942 12.4622C16.4182 13.3753 17 14.6344 17 16C17 18.7614 14.7614 21 12 21C9.23858 21 7 18.7614 7 16C7 14.6344 7.58179 13.3753 8.5058 12.4622" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`,
    official: `<path d="M12 3L5 6V12C5 16.4183 8.13401 19.5 12 21C15.866 19.5 19 16.4183 19 12V6L12 3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path d="M9 12L11 14L15 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    apply_filters: `<path d="M4 12.6111L8.92308 17.5L20 6.5" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    clear_filters: `<path d="M6 6L18 18M18 6L6 18" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  };
  return svgs[id] || '';
}

/* =========================
   I18N
   ========================= */
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

/* =========================
   Autocomplete dynamiques
   ========================= */
async function loadDynamicOptions() {
  try {
    const q = new URLSearchParams({ search: '', limit: '50' });

    const mechanicsRes = await fetch(`/api/autocomplete/map-mechanics?${q}`, {
      headers: { Accept: 'application/json' },
    });
    if (!mechanicsRes.ok) throw new Error('Failed to fetch mechanics');
    const mechJson = await mechanicsRes.json();
    let mechanicsOptions = (Array.isArray(mechJson) ? mechJson : []).map(String);

    const restrictionsRes = await fetch(`/api/autocomplete/map-restrictions?${q}`, {
      headers: { Accept: 'application/json' },
    });
    if (!restrictionsRes.ok) throw new Error('Failed to fetch restrictions');
    const restJson = await restrictionsRes.json();
    let restrictionsOptions = (Array.isArray(restJson) ? restJson : []).map(String);

    if (CURRENT_LANG === 'cn') {
      mechanicsOptions = mechanicsOptions.map((option) => ({
        translated: t(`mechanics.${option.toLowerCase().replace(/ /g, '_')}`) || option,
        raw: option,
      }));
      restrictionsOptions = restrictionsOptions.map((option) => ({
        translated: t(`restrictions.${option.toLowerCase().replace(/ /g, '_')}`) || option,
        raw: option,
      }));
    } else {
      mechanicsOptions = mechanicsOptions.map((option) => ({ translated: option, raw: option }));
      restrictionsOptions = restrictionsOptions.map((option) => ({
        translated: option,
        raw: option,
      }));
    }

    window.mechanicsOptions = mechanicsOptions;
    window.restrictionsOptions = restrictionsOptions;
  } catch (error) {
    console.error('Error loading dynamic options:', error);
  }
}

/* =========================
   TAB SYSTEM
   ========================= */
const MAP_SEARCH_SORT_OPTIONS = [
  'difficulty:asc',
  'difficulty:desc',
  'checkpoints:asc',
  'checkpoints:desc',
  'ratings:asc',
  'ratings:desc',
  'map_name:asc',
  'map_name:desc',
  'title:asc',
  'title:desc',
  'code:asc',
  'code:desc',
];

function __formatMapSearchSortLabel(v) {
  const raw = String(v || '').trim() || 'difficulty:asc';
  const parts = raw.split(':');
  const field = parts[0] || 'difficulty';
  const dir = (parts[1] || 'asc').toLowerCase();

  const fieldMap = {
    difficulty: 'Difficulty',
    checkpoints: 'Checkpoints',
    ratings: 'Ratings',
    map_name: 'Map name',
    title: 'Title',
    code: 'Code',
  };

  const niceField =
    fieldMap[field] ||
    field
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const arrow = dir === 'desc' ? '↓' : '↑';
  return `${niceField} ${arrow}`;
}

function __syncMapSearchSortUI(v) {
  const val = String(v || '').trim() || 'difficulty:asc';

  const btn = document.getElementById('mapSearchSortButton');
  if (btn) btn.dataset.value = val;

  const valueEl = document.getElementById('mapSearchSortValue');
  if (valueEl) valueEl.textContent = __formatMapSearchSortLabel(val);

  const opts = document.getElementById('mapSearchSortOptions');
  if (!opts) return;

  // Mark selected
  opts.querySelectorAll('.custom-option').forEach((el) => el.classList.remove(...String('selected').trim().split(/\s+/).filter(Boolean)));
  opts.querySelectorAll('.custom-option [data-check]').forEach((c) => (c.style.opacity = '0'));

  let selected = null;
  opts.querySelectorAll('.custom-option').forEach((el) => {
    if (el.getAttribute('data-raw-value') === val) selected = el;
  });

  if (selected) {
    selected.classList.add(...String('selected').trim().split(/\s+/).filter(Boolean));
    const mark = selected.querySelector('[data-check]');
    if (mark) mark.style.opacity = '1';
  }
}

function __ensureMapSearchSortDropdown(anchorBtn) {
  if (!anchorBtn) return null;

  let opts = document.getElementById('mapSearchSortOptions');
  if (!opts) {
    opts = document.createElement('div');
    opts.id = 'mapSearchSortOptions';

    opts.className =
      'custom-options opacity-0 translate-y-1 transition p-2 mt-0 z-45 bg-white/95 dark:bg-zinc-900/95 backdrop-blur shadow-lg ring-1 ring-zinc-300/60 dark:ring-white/10 rounded-lg w-64 max-h-56 overflow-y-auto';
    opts.dataset.filterKeyRaw = 'sort';
    opts.dataset.anchorId = anchorBtn.id;

    // Build options
    for (const raw of MAP_SEARCH_SORT_OPTIONS) {
      const optionElement = document.createElement('div');
      optionElement.className =
        'custom-option cursor-pointer rounded-md px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 transition-colors duration-150 hover:bg-zinc-100 dark:hover:bg-white/10 flex items-center justify-between gap-3';
      optionElement.setAttribute('data-raw-value', raw);

      const displayText = __formatMapSearchSortLabel(raw);

      optionElement.innerHTML = `
        <span class="min-w-0 flex items-center gap-2">
          <span class="truncate">${displayText}</span>
        </span>
        <svg data-check viewBox="0 0 20 20" class="h-4 w-4 opacity-0 transition-opacity" aria-hidden="true">
          <path d="M5 10.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;

      optionElement.addEventListener('click', (event) => {
        event.stopPropagation();

        const v = optionElement.getAttribute('data-raw-value') || 'difficulty:asc';

        // Update state
        persistentFilters = { ...(persistentFilters || {}), sort: v };
        activeFilters = { ...(activeFilters || {}), sort: v };

        __syncMapSearchSortUI(v);

        // Close dropdown
        closeFloating(opts);

        // Apply immediately
        if (typeof currentSection !== 'undefined' && currentSection === 'map_search') {
          applyFilters(activeFilters, { pushUrl: false, syncUrl: true });
        } else if (typeof __urlSyncFiltersFromState === 'function') {
          __urlSyncFiltersFromState({ push: false });
        }
      });

      opts.appendChild(optionElement);
    }

    document.body.appendChild(opts);
  }

  return opts;
}


function __ensureMapSearchSortControl() {
  const tabsContainer = document.getElementById('searchTabs');
  if (!tabsContainer) return null;

  // Ensure flex row wrapper
  let row = document.getElementById('searchTabsRow');
  if (!row) {
    row = document.createElement('div');
    row.id = 'searchTabsRow';
    row.className = 'flex flex-wrap items-center gap-3';

    const parent = tabsContainer.parentElement;
    if (parent) parent.insertBefore(row, tabsContainer);
    row.appendChild(tabsContainer);
  }

  let wrap = document.getElementById('mapSearchSortWrap');

  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'mapSearchSortWrap';
  }

  wrap.classList.add(...String('ml-auto').trim().split(/\s+/).filter(Boolean), ...String('flex').trim().split(/\s+/).filter(Boolean), ...String('items-center').trim().split(/\s+/).filter(Boolean));
  if (wrap.parentElement !== row) row.appendChild(wrap);

  // Inject
  if (!wrap.querySelector('#mapSearchSortButton')) {
    const sortLbl =
      ((typeof t === 'function' && (t('filters_toolbar.sort') || t('filters.sort'))) || '').trim() || 'Sort';

    wrap.innerHTML = `
      <button type="button" id="mapSearchSortButton"
        class="toolbar-button cursor-pointer relative inline-flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 px-3 py-2 text-sm hover:bg-white/95 dark:hover:bg-white/10 hover:border-zinc-300/80 dark:hover:border-white/20 transition-colors duration-200 ease-out">
        <svg class="h-5 w-5 text-zinc-800 dark:text-zinc-200" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M6 6v12" />
          <path d="M3 9l3-3 3 3" />
          <path d="M21 18H11" />
          <path d="M21 12H13" />
          <path d="M21 6H15" />
        </svg>
        <div class="icon-name text-xs text-zinc-700 dark:text-zinc-300">${sortLbl}</div>
        <div id="mapSearchSortValue" class="text-xs font-semibold text-zinc-900 dark:text-zinc-100/90 truncate max-w-[11rem]"></div>
        <svg class="ml-0.5 h-4 w-4 text-zinc-700 dark:text-zinc-300/80" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M6 8l4 4 4-4" />
        </svg>
      </button>
    `;
  }

  const btn = document.getElementById('mapSearchSortButton');
  if (btn && btn.dataset.inited !== '1') {
    btn.dataset.inited = '1';

    const sp = new URL(location.href).searchParams;
    const initial = sp.get('sort') || (persistentFilters && persistentFilters.sort) || 'difficulty:asc';
    __syncMapSearchSortUI(initial);

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Create dropdown
      const opts = __ensureMapSearchSortDropdown(btn);
      if (!opts) return;

      // Keep UI in sync
      const currentVal =
        (persistentFilters && persistentFilters.sort) ||
        new URL(location.href).searchParams.get('sort') ||
        'difficulty:asc';
      __syncMapSearchSortUI(currentVal);

      // Toggle
      if (typeof __isFloatingOpen === 'function' && __isFloatingOpen(opts)) {
        closeFloating(opts);
      } else {
        showDropdown(opts);
      }
    });
  }

  // Visibility: only show on Map Search
  if (currentSection === 'map_search') wrap.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
  else wrap.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));

  return wrap;
}

function initSearchTabs(defaultSection = 'map_search') {
  const tabsContainer = document.getElementById('searchTabs');
  const highlight = document.getElementById('searchTabsHighlight');
  if (!tabsContainer || !highlight) return;

  if (highlight.parentElement !== tabsContainer) {
    tabsContainer.appendChild(highlight);
  }

  const buttons = Array.from(tabsContainer.querySelectorAll('.search-tab'));
  if (!buttons.length) return;

  const __sortWrap = __ensureMapSearchSortControl();

  if (getComputedStyle(tabsContainer).position === 'static') {
    tabsContainer.style.position = 'relative';
  }

  const HL_TRANSITION =
    'transform .28s cubic-bezier(.22,.9,.24,1), width .28s cubic-bezier(.22,.9,.24,1)';

  Object.assign(highlight.style, {
    position: 'absolute',
    top: '2px',
    bottom: '2px',
    left: '0',
    width: '0',
    borderRadius: '0.625rem',
    background: 'white',
    boxShadow: '0 1px 0 0 rgba(255,255,255,.06), 0 8px 30px rgba(0,0,0,.25)',
    transform: 'translate3d(0,0,0)',
    transition: 'none',
    willChange: 'transform,width',
    zIndex: '0'
  });
  buttons.forEach((b) => {
    b.style.position = 'relative';
    b.style.zIndex = '1';
  });

  const selectedModeEl = document.getElementById('selectedMode');

  const moveHighlightTo = (btn, { animate = true } = {}) => {
    if (!btn) return;

    const br = btn.getBoundingClientRect();
    const cr = tabsContainer.getBoundingClientRect();
    const left = Math.round(br.left - cr.left);
    const width = Math.round(br.width);

    const prevLeft = Number(highlight.dataset.hlLeft || NaN);
    const prevWidth = Number(highlight.dataset.hlWidth || NaN);
    if (left === prevLeft && width === prevWidth) return;

    highlight.dataset.hlLeft = String(left);
    highlight.dataset.hlWidth = String(width);

    const apply = () => {
      highlight.style.width = `${Math.max(0, width)}px`;
      highlight.style.transform = `translate3d(${Math.max(0, left)}px,0,0)`;
    };

    if (!animate) {
      const prev = highlight.style.transition;
      highlight.style.transition = 'none';
      apply();
      requestAnimationFrame(() => {
        highlight.style.transition = prev && prev !== 'none' ? prev : HL_TRANSITION;
      });
      return;
    }

    if (highlight.style.transition === 'none') {
      highlight.style.transition = HL_TRANSITION;
    }
    requestAnimationFrame(apply);
  };

  const setActive = (
    section,
    { updateUrl = true, triggerLoad = true, animateHighlight = true, userAction = false } = {}
  ) => {
    const activeBtn =
      buttons.find((b) => b.getAttribute('data-section') === section) || buttons[0];
    const activeSection = activeBtn?.getAttribute('data-section') || section;

    buttons.forEach((btn) => {
      const isActive = btn === activeBtn;
        (() => { const __obj = btn; let __last; for (const __c of String('bg-white').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, isActive); return __last; })();
        (() => { const __obj = btn; let __last; for (const __c of String('text-zinc-900').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, isActive); return __last; })();
        
        (() => { const __obj = btn; let __last; for (const __c of String('dark:text-zinc-900').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, isActive); return __last; })();
        (() => { const __obj = btn; let __last; for (const __c of String('text-zinc-900 dark:text-white').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !isActive); return __last; })();
        (() => { const __obj = btn; let __last; for (const __c of String('hover:bg-zinc-100 dark:hover:bg-white/10').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !isActive); return __last; })();
    });

    moveHighlightTo(activeBtn, { animate: animateHighlight });

    // Sort control
    if (__sortWrap) {
      (() => { const __obj = __sortWrap; let __last; for (const __c of String('hidden').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, String(activeSection) !== 'map_search'); return __last; })();
      const v =
        (persistentFilters && persistentFilters.sort) ||
        new URL(location.href).searchParams.get('sort') ||
        'difficulty:asc';
      __syncMapSearchSortUI(v);
    }

    if (selectedModeEl) {
      const label = activeBtn?.textContent?.trim() || '';
      selectedModeEl.textContent =
        label || (window.SEARCH_I18N?.select_mode ?? 'Select a mode');
    }

    if (updateUrl) {
      const url = new URL(window.location.href);

      // clean URL only when switching to a different section by user action
      const prevSection = url.searchParams.get('section') || (typeof currentSection !== 'undefined' ? currentSection : '') || defaultSection;
      if (userAction && String(prevSection) !== String(activeSection)) {
        __urlStripFiltersAndModals(url);
      }

      url.searchParams.set('section', activeSection);
      history.replaceState(
        { section: activeSection },
        '',
        url.pathname + '?' + url.searchParams.toString() + url.hash
      );
    }

    if (triggerLoad && typeof window.selectSection === 'function') {
      window.selectSection(activeSection, { push: false, replace: true, cleanOnChange: userAction });
    }
  };

  const getDesired = () => {
    const hash = new URL(window.location.href).hash || '';
    const hm = hash.match(/section=([^&]+)/);
    if (hm && hm[1]) return decodeURIComponent(hm[1]);
    const q = new URLSearchParams(window.location.search).get('section');
    if (q) return q;
    return defaultSection;
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const section = btn.getAttribute('data-section');
      if (section) {
        setActive(section, {
          updateUrl: true,
          triggerLoad: true,
          animateHighlight: true,
          userAction: true,
        });
      }
    });
  });

  const desired = getDesired();
  const initialBtn =
    buttons.find((b) => b.getAttribute('data-section') === desired) || buttons[0];

  requestAnimationFrame(() => {
    setActive(initialBtn.getAttribute('data-section'), {
      updateUrl: !new URLSearchParams(window.location.search).get('section'),
      triggerLoad: true,
      animateHighlight: false,
    });

    const recalc = () => {
      const active = buttons.find((b) => b.classList.contains('bg-white')) || initialBtn;
      moveHighlightTo(active, { animate: false });
    };

    window.addEventListener('resize', recalc);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(recalc);
    } else {
      setTimeout(recalc, 60);
    }
  });
}

async function selectSection(sectionId, opts = {}) {
  const { push = true, replace = false, fromUrl = false, cleanOnChange = false } = opts;

  if (sectionId === 'personal_records' && !user_id) {
    renderMessage(t('popup.login_required_pr'));
    hideLoadingBar();
    return;
  }

  const changing = currentSection !== sectionId;
  const userNav = (push && !fromUrl) || !!cleanOnChange;

  if (changing) {
    const rc = document.getElementById('resultsContainer');
    if (rc) rc.innerHTML = '';
    const pc = document.getElementById('paginationContainer');
    if (pc) pc.innerHTML = '';
  }

  // Set section early
  currentSection = sectionId;

  // Show sort only on Map Search
  {
    const sw = document.getElementById('mapSearchSortWrap');
    if (sw) {
      if (currentSection === 'map_search') sw.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
      else sw.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    }
  }

  // Defaults filters
  if (currentSection === 'map_search') {
    const lang = String(CURRENT_LANG || 'en').toLowerCase();
    const defOfficial = (lang === 'cn') ? 'False' : 'True';

    const hasUrlFilters = __urlHasAnyFilterParams();

    if (!hasUrlFilters) {
      if (persistentFilters.official == null || String(persistentFilters.official).trim() === '') {
        persistentFilters.official = defOfficial;
      }
      if (persistentFilters.playtest_filter == null || String(persistentFilters.playtest_filter).trim() === '') {
        persistentFilters.playtest_filter = 'All';
      }
      if (persistentFilters.sort == null || String(persistentFilters.sort).trim() === '') {
        persistentFilters.sort = 'difficulty:asc';
      }
    }

    activeFilters = { ...persistentFilters };
  }

  // clean slate
  if (changing && userNav) {
    clearFilters(true);
  }

  if (changing && cleanOnChange) {
    void __syncModalsFromUrl();
  }
  currentPage = 1;

  const selectedModeText = document.getElementById('selectedMode');
  const addFilterMessage = document.getElementById('addFilterMessage');
  if (addFilterMessage) hideEl(addFilterMessage);
  if (selectedModeText) hideEl(selectedModeText);

  document.querySelectorAll('.tab-buttons button').forEach((btn) => btn.classList.remove(...String('active').trim().split(/\s+/).filter(Boolean)));
  const tabBtn = document.getElementById(`${sectionId}Btn`);
  if (tabBtn) tabBtn.classList.add(...String('active').trim().split(/\s+/).filter(Boolean));

  //Server
  if (sectionId === 'map_search') {
    const lang = String(CURRENT_LANG || 'en').toLowerCase();
    const defaultOfficial = lang === 'cn' ? 'False' : 'True';

    const hasValue =
      Object.prototype.hasOwnProperty.call(activeFilters || {}, 'official') ||
      Object.prototype.hasOwnProperty.call(persistentFilters || {}, 'official');

    if (!hasValue || persistentFilters.official == null || String(persistentFilters.official).trim() === '') {
      persistentFilters.official = defaultOfficial;
    }

    if (persistentFilters.playtest_filter == null || String(persistentFilters.playtest_filter).trim() === '') {
      persistentFilters.playtest_filter = 'All';
    }
    if (persistentFilters.sort == null || String(persistentFilters.sort).trim() === '') {
      persistentFilters.sort = 'difficulty:asc';
    }

  }

  if (sectionId === 'personal_records') {
    persistentFilters = sanitizeFiltersForSection(sectionId, persistentFilters);
    activeFilters = sanitizeFiltersForSection(sectionId, activeFilters);
  }

  initializeToolbarButtons();

  // “Apply filters” url update
  applyFilters(undefined, { syncUrl: false });

  const fa = document.getElementById('filterActions');
  if (fa) showFlex(fa);

  if (push) {
    const url = new URL(location.href);

    // Clean URL only when switching section by user action
    if (changing && userNav) {
      __urlStripFiltersAndModals(url);
    }

    url.searchParams.set(SECTION_URL_PARAM, sectionId);

    const state = { ...(history.state || {}), section: sectionId };
    if (state.__modalOpen) delete state.__modalOpen;

    if (replace) history.replaceState(state, '', url);
    else history.pushState(state, '', url);

    // Close any open modal immediately
    if (changing && userNav) {
      void __syncModalsFromUrl();
    }
  }
}
window.selectSection = selectSection;

/* =========================
   URL
   ========================= */
const SECTION_URL_PARAM = 'section';
const VALID_SECTIONS = new Set(['map_search', 'completions', 'guide', 'personal_records']);

const URL_MODAL_PARAM = 'modal';
const URL_MODAL_CODE_PARAM = 'modal_code';
const URL_MODAL_USER_ID_PARAM = 'modal_user_id';
const URL_MODAL_TIME_PARAM = 'modal_time';

const URL_FILTER_KEYS = new Set([
  'code',
  'map_name',
  'creator_ids',
  'creator_names',
  'category',
  'difficulty_exact',
  'mechanics',
  'restrictions',
  'tags',
  'playtest_filter',
  'official',
  'user_id',
  'medal_filter',
  'completion_filter',
  'sort',
]);

const URL_FILTER_ALIASES = {
  map_code: 'code',
  mapCode: 'code',
  mapName: 'map_name',
  userId: 'user_id',
  user: 'user_id',
  creator_id: 'creator_ids',
  creatorIds: 'creator_ids',
  creator_name: 'creator_names',
  creatorNames: 'creator_names',
  creator: 'creator_names',
  difficulty: 'difficulty_exact',
  difficultyExact: 'difficulty_exact',
  playtestFilter: 'playtest_filter',
  medalFilter: 'medal_filter',
  completionFilter: 'completion_filter',
};

const URL_ARRAY_KEYS = new Set(['mechanics', 'restrictions', 'creator_ids', 'creator_names']);

let __urlBootstrapped = false;

function __urlNormalizeOfficial(v) {
  const s = String(v ?? '').trim().toLowerCase();
  if (!s) return '';
  if (['true', '1', 'yes', 'on', 'with', 'global'].includes(s)) return 'True';
  if (['false', '0', 'no', 'off', 'without', 'cn', 'china'].includes(s)) return 'False';
  return String(v ?? '').trim();
}

function __urlReadSection() {
  const s = new URL(location.href).searchParams.get(SECTION_URL_PARAM);
  return VALID_SECTIONS.has(s) ? s : 'map_search';
}

function normalizeUserCompletionsDifficultyFilter(value) {
  const normalized = normalizeDifficulty(value);
  return difficultyOptions.includes(normalized) ? normalized : '';
}

function sanitizeFiltersForSection(sectionId, source) {
  const filters = source && typeof source === 'object' ? source : {};

  if (sectionId !== 'personal_records') {
    return { ...filters };
  }

  const sanitized = {};
  const userIdValue = String(filters.user_id ?? '').trim();
  const difficultyValue = normalizeUserCompletionsDifficultyFilter(filters.difficulty_exact);

  if (userIdValue) sanitized.user_id = userIdValue;
  if (difficultyValue) sanitized.difficulty_exact = difficultyValue;

  return sanitized;
}

function __urlHasAnyFilterParams() {
  const sp = new URL(location.href).searchParams;
  for (const [rawKey] of sp.entries()) {
    const key = URL_FILTER_ALIASES[rawKey] || rawKey;
    if (URL_FILTER_KEYS.has(key)) return true;
  }
  return false;
}

function __urlReadFilters() {
  const sp = new URL(location.href).searchParams;

  const tmp = {};

  for (const [rawKey, rawVal] of sp.entries()) {
    const key = URL_FILTER_ALIASES[rawKey] || rawKey;
    if (!URL_FILTER_KEYS.has(key)) continue;

    const s0 = String(rawVal ?? '').trim();
    if (!s0) continue;

    const parts =
      URL_ARRAY_KEYS.has(key) && s0.includes(',')
        ? s0.split(',').map((x) => x.trim()).filter(Boolean)
        : [s0];

    if (!tmp[key]) tmp[key] = [];
    tmp[key].push(...parts);
  }

  const out = {};
  for (const [k, arrRaw] of Object.entries(tmp)) {
    const arr = (arrRaw || []).map((x) => String(x).trim()).filter(Boolean);
    if (!arr.length) continue;

    if (k === 'official') {
      const norm = __urlNormalizeOfficial(arr[0]);
      if (norm) out.official = norm;
      continue;
    }

    if (URL_ARRAY_KEYS.has(k)) out[k] = arr;
    else out[k] = arr[0];
  }

  return out;
}

function __urlBootstrapPersistentFilters() {
  if (__urlBootstrapped) return;

  const urlFilters = __urlReadFilters();
  if (urlFilters && Object.keys(urlFilters).length) {
    persistentFilters = { ...urlFilters };
  }

  __urlBootstrapped = true;
}


let __urlLastModalSig = null;

let __suppressUrlSync = false;

function __stableFilterSignature(obj) {
  if (!obj || typeof obj !== 'object') return '';
  const keys = Object.keys(obj).sort();
  const norm = {};
  for (const k of keys) {
    const v = obj[k];
    if (Array.isArray(v)) norm[k] = [...v].map(String).sort();
    else norm[k] = String(v);
  }
  return JSON.stringify(norm);
}

function __urlStripFiltersAndModals(url) {
  if (!url) return;

  for (const rawKey of Array.from(url.searchParams.keys())) {
    const key = URL_FILTER_ALIASES[rawKey] || rawKey;
    if (URL_FILTER_KEYS.has(key)) url.searchParams.delete(rawKey);
  }

  // Modal params
  url.searchParams.delete(URL_MODAL_PARAM);
  url.searchParams.delete(URL_MODAL_CODE_PARAM);
  url.searchParams.delete(URL_MODAL_USER_ID_PARAM);
  url.searchParams.delete(URL_MODAL_TIME_PARAM);

  // Pagination leftovers
  url.searchParams.delete('page');
  url.searchParams.delete('page_number');
  url.searchParams.delete('page_size');
}

function __urlSyncFiltersFromState({ push = false } = {}) {
  if (__suppressUrlSync) return;

  const url = new URL(location.href);
  url.searchParams.set(SECTION_URL_PARAM, currentSection || 'map_search');

  // reset keys
  for (const rawKey of Array.from(url.searchParams.keys())) {
    const key = URL_FILTER_ALIASES[rawKey] || rawKey;
    if (URL_FILTER_KEYS.has(key)) url.searchParams.delete(rawKey);
  }

  // write from persistentFilters
  const src = persistentFilters || {};
  for (const k of URL_FILTER_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(src, k)) continue;
    const v = src[k];
    if (v == null) continue;

    if (Array.isArray(v)) {
      const arr = v.map(String).map(s => s.trim()).filter(Boolean);
      for (const item of arr) url.searchParams.append(k, item);
    } else {
      const s = String(v).trim();
      if (s) url.searchParams.set(k, s);
    }
  }

  const state = { ...(history.state || {}), section: currentSection || 'map_search' };
  if (push) history.pushState(state, '', url);
  else history.replaceState(state, '', url);
}

function __urlOpenModal(type, { code, user_id, time } = {}, { push = true, replace = false } = {}) {
  if (__suppressUrlSync) return;
  const url = new URL(location.href);

  // clear old modal params
  url.searchParams.delete(URL_MODAL_PARAM);
  url.searchParams.delete(URL_MODAL_CODE_PARAM);
  url.searchParams.delete(URL_MODAL_USER_ID_PARAM);
  url.searchParams.delete(URL_MODAL_TIME_PARAM);

  url.searchParams.set(SECTION_URL_PARAM, currentSection || url.searchParams.get(SECTION_URL_PARAM) || 'map_search');

  if (type) {
    url.searchParams.set(URL_MODAL_PARAM, type);
    if (code) url.searchParams.set(URL_MODAL_CODE_PARAM, String(code));
    if (user_id) url.searchParams.set(URL_MODAL_USER_ID_PARAM, String(user_id));
    if (time != null && String(time).trim() !== '') url.searchParams.set(URL_MODAL_TIME_PARAM, String(time));
  }

  const st = { ...(history.state || {}), __modalOpen: type || null };
  if (replace) history.replaceState(st, '', url);
  else if (push) history.pushState(st, '', url);
  else history.replaceState(st, '', url);
}

function __urlHandleModalUserClose(expectedType) {
  if (__suppressUrlSync) return;

  const url = new URL(location.href);
  const cur = url.searchParams.get(URL_MODAL_PARAM);
  if (cur !== expectedType) return;

  // remove modal params
  url.searchParams.delete(URL_MODAL_PARAM);
  url.searchParams.delete(URL_MODAL_CODE_PARAM);
  url.searchParams.delete(URL_MODAL_USER_ID_PARAM);
  url.searchParams.delete(URL_MODAL_TIME_PARAM);

  const st = { ...(history.state || {}) };
  if (st.__modalOpen) delete st.__modalOpen;

  history.replaceState(st, '', url.pathname + '?' + url.searchParams.toString() + url.hash);

  __urlLastModalSig = null;
}

async function __fetchCompletionRowForModal({ code, user_id, time } = {}) {
  if (!code) return null;

  try {
    const params = new URLSearchParams({ page_size: '10', page_number: '1' });
    if (user_id) params.set('user_id', String(user_id));

    const res = await fetch(`${apiUrls.completions}/${encodeURIComponent(code)}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const rows = normalizeToRows(data, 'completion') || [];
    if (!rows.length) return null;

    let filtered = rows;
    if (user_id) filtered = filtered.filter(r => String(r.user_id) === String(user_id));

    if (time != null && String(time).trim() !== '') {
      const t = Number(time);
      const tol = 0.01;
      const found = filtered.find(r => Number(r.time) && Math.abs(Number(r.time) - t) <= tol);
      if (found) return found;
    }

    return filtered[0] || rows[0] || null;
  } catch {
    return null;
  }
}

async function __syncModalsFromUrl() {
  const url = new URL(location.href);
  const modal = url.searchParams.get(URL_MODAL_PARAM);
  const code = url.searchParams.get(URL_MODAL_CODE_PARAM) || '';
  const user_id = url.searchParams.get(URL_MODAL_USER_ID_PARAM) || '';
  const time = url.searchParams.get(URL_MODAL_TIME_PARAM) || '';

  // close all if no modal
  if (!modal) {
    __urlLastModalSig = null;
    __suppressUrlSync = true;
    try {
      const mapOv = document.getElementById('detailsModalOverlay');
      if (mapOv && !mapOv.classList.contains('hidden')) mapOv.__sfClose?.();

      const compOv = document.getElementById('completionModalOverlay');
      if (compOv && !compOv.classList.contains('hidden')) compOv.__sfClose?.();

      const mer = document.getElementById('mapEditRequestOverlay');
      if (mer && !mer.classList.contains('hidden')) mer.__merClose?.();
    } finally {
      __suppressUrlSync = false;
    }
    return;
  }

  const sig = `${modal}|${code}|${user_id}|${time}`;
  if (sig === __urlLastModalSig) return;
  __urlLastModalSig = sig;

  if (modal === 'map') {
    if (!code) return;
    const r = await __merFetchMapRowByCode(code);
    if (r?.ok && r.row) openSearchDetailsModal(r.row, { fromUrl: true, syncUrl: false });
    return;
  }

  if (modal === 'completion') {
    if (!code) return;
    const row = await __fetchCompletionRowForModal({ code, user_id, time });
    if (row) openCompletionsDetailsModal(row, { fromUrl: true, syncUrl: false });
    return;
  }

  if (modal === 'map_edit_request') {
    if (!code) return;
    const r = await __merFetchMapRowByCode(code);
    if (r?.ok && r.row) openMapEditRequestModal(r.row, { fromUrl: true, syncUrl: false });
    return;
  }
}

// popstate
window.addEventListener('popstate', () => {
  const s = new URL(location.href).searchParams.get(SECTION_URL_PARAM);
  const section = VALID_SECTIONS.has(s) ? s : 'map_search';

  const urlFilters = __urlReadFilters();
  const nextSig = __stableFilterSignature(urlFilters);
  const curSig = __stableFilterSignature(persistentFilters);

  if (section !== currentSection) {
    // Restore filters first
    __suppressUrlSync = true;
    try {
      selectedFilters.length = 0;
      filters = {};
      activeFilters = {};
      persistentFilters = { ...urlFilters };
    } finally {
      __suppressUrlSync = false;
    }

    selectSection(section, { push: false, replace: true });
    return;
  }

  if (nextSig !== curSig) {
    __suppressUrlSync = true;
    try {
      persistentFilters = { ...urlFilters };
      activeFilters = { ...urlFilters };
      filters = { ...urlFilters };
      applyFilters(urlFilters, { syncUrl: false });
    } finally {
      __suppressUrlSync = false;
    }
  }

  void __syncModalsFromUrl();
});


/* =========================
   GLOBAL INITS
   ========================= */
async function initializeApp() {
  const fa = document.getElementById('filterActions');
  if (fa) {
    fa.style.visibility = 'hidden';
    fa.style.pointerEvents = 'none';
  }

  initializeIcons();

  __urlBootstrapPersistentFilters();

  void loadDynamicOptions();
  initSearchTabs();
  hideOnClickOutside();

  if (fa) {
    fa.style.visibility = '';
    fa.style.pointerEvents = '';
  }
}
document.addEventListener('DOMContentLoaded', initializeApp);


/* =========================
   HELPERS TOOLBAR
   ========================= */
const _floatingRegistry = new Set();
function _clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
function _placeBelow(anchorRect, elWidth, elHeight, { offset = 8, pad = 8, align = 'left' } = {}) {
  const top = Math.round(anchorRect.bottom + window.scrollY + offset);
  let left;
  if (align === 'right') left = Math.round(anchorRect.right + window.scrollX - elWidth);
  else if (align === 'center')
    left = Math.round(anchorRect.left + window.scrollX + (anchorRect.width - elWidth) / 2);
  else left = Math.round(anchorRect.left + window.scrollX);
  left = _clamp(left, pad + window.scrollX, window.scrollX + window.innerWidth - elWidth - pad);
  return { top, left };
}

function _measure(el) {
  const prevClass = el.className;
  const prevDisp = el.classList.contains('u-d-block');
  el.classList.add(...String('is-measuring').trim().split(/\s+/).filter(Boolean), ...String('u-d-block').trim().split(/\s+/).filter(Boolean));
  const rect = el.getBoundingClientRect();
  const width = rect.width || el.offsetWidth || 0;
  const height = rect.height || el.offsetHeight || 0;
  el.classList.remove(...String('is-measuring').trim().split(/\s+/).filter(Boolean));
  if (!prevDisp) el.classList.remove(...String('u-d-block').trim().split(/\s+/).filter(Boolean));
  return { width, height };
}

function _ensureFloating(el, anchorEl, opts = {}) {
  if (!el || !anchorEl) return;
  if (el.parentElement !== document.body) document.body.appendChild(el);
  el.classList.add(...String('u-absolute').trim().split(/\s+/).filter(Boolean));
  el.dataset.anchorId = anchorEl.id || '';

  const doPosition = () => {
    const aRect = anchorEl.getBoundingClientRect();
    const m = _measure(el);
    const place = opts.place || {};
    const offset = place.offset ?? 8;
    const pad = place.pad ?? 8;
    const align = place.align ?? 'left';

    const top = Math.round(aRect.bottom + window.scrollY + offset);
    let left;
    if (align === 'right')
      left = Math.round(aRect.right + window.scrollX - (m.width || anchorEl.offsetWidth || 0));
    else if (align === 'center')
      left = Math.round(
        aRect.left + window.scrollX + (aRect.width - (m.width || anchorEl.offsetWidth || 0)) / 2
      );
    else left = Math.round(aRect.left + window.scrollX);
    left = __clamp(
      left,
      pad + window.scrollX,
      window.scrollX + window.innerWidth - (m.width || 0) - pad
    );

    const minW = opts.matchAnchorWidth ? aRect.width || anchorEl.offsetWidth || 0 : 0;
    __applyPos(el, top, left, minW);
  };

  if (el._floatingHandlers) {
    window.removeEventListener('scroll', el._floatingHandlers.onScroll, true);
    window.removeEventListener('resize', el._floatingHandlers.onResize, true);
  }
  el._floatingHandlers = { onScroll: doPosition, onResize: doPosition };
  window.addEventListener('scroll', doPosition, true);
  window.addEventListener('resize', doPosition, true);
  _floatingRegistry.add(el);

  el.classList.add(...String('u-d-block').trim().split(/\s+/).filter(Boolean));
  doPosition();
}

function _hideFloating(el) {
  if (!el) return;
  el.classList.remove(...String('u-d-block').trim().split(/\s+/).filter(Boolean));
  el.classList.add(...String('u-d-none').trim().split(/\s+/).filter(Boolean));
  if (el._floatingHandlers) {
    window.removeEventListener('scroll', el._floatingHandlers.onScroll, true);
    window.removeEventListener('resize', el._floatingHandlers.onResize, true);
    el._floatingHandlers = null;
  }
  _floatingRegistry.delete(el);
}

function _hideAllFloating() {
  _floatingRegistry.forEach((el) => _hideFloating(el));
}

function clearToolbarButtons() {
  const toolbar =
    document.querySelector('.toolbar-container .toolbar') ||
    document.querySelector('#filterActions .toolbar') ||
    document.querySelector('.toolbar');

  if (!toolbar) return;
  toolbar.querySelectorAll('.toolbar-button').forEach((btn) => btn.remove());
}

function hideOnClickOutside() {
  document.addEventListener(
    'pointerdown',
    (event) => {
      const t = event.target;
      const isInteractive = !!t.closest(
        '.toolbar-button, .custom-options, .filter-input, .suggestions-container'
      );
      if (!isInteractive) {
        hideAllFilters();
        hideAllActiveSuggestions();
        document
          .querySelectorAll('.selection-circle')
          .forEach((c) => c.classList.remove(...String('circle-visible').trim().split(/\s+/).filter(Boolean)));
        document
          .querySelectorAll('.toolbar-button')
          .forEach((btn) => btn.classList.remove(...String('selected').trim().split(/\s+/).filter(Boolean)));
      }
    },
    true
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideAllFilters();
      hideAllActiveSuggestions();
      document
        .querySelectorAll('.toolbar-button')
        .forEach((btn) => btn.classList.remove(...String('selected').trim().split(/\s+/).filter(Boolean)));
    }
  });
}

function showDropdown(el) {
  if (!el) return;

  ['pointerdown', 'mousedown', 'click'].forEach((type) =>
    el.addEventListener(type, (e) => e.stopPropagation())
  );

  const key = el.dataset.filterKeyRaw;
  if (key) syncOptionsWithFilters(el, key);

  const anchorId = el.dataset.anchorId || el.closest('.toolbar-button')?.id;
  const anchor = anchorId ? document.getElementById(anchorId) : el.closest('.toolbar-button');

  openDropdownAnimated(el, anchor);
}

function hideAllFilters(exceptEl = null) {
  document.querySelectorAll('.filter-input.u-d-block, .custom-options.u-d-block').forEach((el) => {
    if (exceptEl && el === exceptEl) return;
    closeFloating(el);
  });

  document.querySelectorAll('.toolbar-button').forEach((btn) => btn.classList.remove(...String('selected').trim().split(/\s+/).filter(Boolean)));
}

function hideAllActiveSuggestions() {
  document.querySelectorAll('.suggestions-container').forEach((el) => {
    el.classList.remove(...String('active').trim().split(/\s+/).filter(Boolean));
    closeFloating(el);
  });
}

function getOrCreateInput(id, placeholder, parentButton) {
  let input = document.getElementById(id);
  if (!input) {
    input = document.createElement('input');
    input.type = 'text';
    input.placeholder = t(placeholder) || placeholder;
    input.id = id;
    input.className =
      'filter-input mt-0 w-56 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 shadow-lg ring-1 ring-zinc-300/60 dark:ring-white/10 focus:outline-none u-d-none';
    input.autocomplete = 'off';
    input.autocorrect = 'off';
    input.autocapitalize = 'off';
    input.spellcheck = false;
    input.setAttribute('data-parent', parentButton.id || '');
    document.body.appendChild(input);

    ['pointerdown', 'mousedown', 'click', 'focus'].forEach((type) =>
      input.addEventListener(type, (e) => e.stopPropagation())
    );

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        input.blur();
        hideAllActiveSuggestions();
        closeFloating(input);
      }
    });

    input.addEventListener('focus', () => {
      const anchor = document.getElementById(input.getAttribute('data-parent'));
      if (anchor) openInputAnimated(input, anchor);
    });
  }

  const anchor = parentButton;
  openInputAnimated(input, anchor);
  return input;
}

function positionInputOrDropdown(input, optionsContainer) {
  const anchorId =
    (input && input.getAttribute('data-parent')) ||
    (optionsContainer && optionsContainer.dataset.anchorId) ||
    (optionsContainer && optionsContainer.closest('.toolbar-button')?.id) ||
    '';
  const anchor = anchorId ? document.getElementById(anchorId) : null;
  if (!anchor) return;

  if (input) openInputAnimated(input, anchor);
  if (optionsContainer) openDropdownAnimated(optionsContainer, anchor);
}

function createButton(icon) {
  const button = document.createElement('button');
  button.className =
    'toolbar-button cursor-pointer relative inline-flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 px-3 py-2 text-sm hover:bg-white/95 dark:hover:bg-white/10 hover:border-zinc-300/80 dark:hover:border-white/20 transition-colors duration-200 ease-out';
  button.setAttribute('data-name', icon.name);
  button.id = `${icon.id}FilterButton`;
  button.innerHTML = `
    <svg class="h-5 w-5 text-zinc-800 dark:text-zinc-200" viewBox="${icon.viewBox || '0 0 24 24'}" xmlns="http://www.w3.org/2000/svg">${icon.svg}</svg>
    <div class="icon-name text-xs text-zinc-700 dark:text-zinc-300">${icon.name}</div>
    <span class="filter-badge hidden absolute -top-1 -right-1 rounded-full bg-emerald-500/90 text-[10px] font-semibold text-zinc-900 dark:text-white leading-none ring-1 ring-zinc-400/60 dark:ring-white/20 px-1.5 py-0.5"></span>
  `;
  return button;
}

function showOptionsContainer(id, options, button, useWrapper = false) {
  let optionsContainer = button.querySelector('.custom-options');
  if (!optionsContainer) {
    optionsContainer = document.createElement('div');
    optionsContainer.id = id;
    optionsContainer.className =
      'custom-options opacity-0 translate-y-1 transition p-2 mt-0 z-45 bg-white/95 dark:bg-zinc-900/95 backdrop-blur shadow-lg ring-1 ring-zinc-300/60 dark:ring-white/10 rounded-lg w-60 max-h-56 overflow-y-auto';
    optionsContainer.classList.add(...String(useWrapper ? 'with-wrapper' : 'without-wrapper').trim().split(/\s+/).filter(Boolean));

    optionsContainer.dataset.filterKeyRaw = id.replace('Options', '');
    document.body.appendChild(optionsContainer);

    options.forEach((option) => {
      let wrapper = null;
      let optionElement = null;
      let checkbox = null;

      const displayText = option.translated || option.text || '';
      const rawValue = option.raw || 'default';
      const isDifficulty = id === 'difficulty_exactOptions';

      if (useWrapper) {
        wrapper = document.createElement('label');
        wrapper.className =
          'custom-option-wrapper group flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-colors duration-150 hover:bg-zinc-100 dark:hover:bg-white/10 focus-within:ring-1 focus-within:ring-brand-400/40';

        checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${id}_${rawValue.replace(/\s+/g, '_')}`;
        checkbox.className = 'custom-checkbox peer sr-only';

        const ui = document.createElement('span');
        ui.className = [
          'inline-flex h-4 w-4 items-center justify-center rounded',
          'border border-zinc-200/80 dark:border-white/15 bg-white dark:bg-zinc-900 ring-1 ring-inset ring-zinc-300/40 dark:ring-white/5',
          'transition',
          'group-hover:border-white/25 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-400/60',
          'peer-checked:bg-emerald-500 peer-checked:border-emerald-500 peer-checked:ring-emerald-500/30',
          'peer-checked:[&>svg]:opacity-100',
        ].join(' ');
        ui.innerHTML = `
          <svg viewBox="0 0 20 20" class="h-3 w-3 opacity-0 transition-opacity">
            <path d="M5 10.5l3 3 7-7" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;

        const label = document.createElement('span');
        label.className = 'custom-option flex-1 text-sm text-zinc-800 dark:text-zinc-200 transition-colors group-hover:text-zinc-900 dark:group-hover:text-white';
        label.textContent = displayText;
        label.setAttribute('data-raw-value', rawValue);

        wrapper.appendChild(checkbox);
        wrapper.appendChild(ui);
        wrapper.appendChild(label);
        optionsContainer.appendChild(wrapper);

        checkbox.addEventListener('change', () => updateActiveFilters());
        optionElement = label;
      } else {
        optionElement = document.createElement('div');
        optionElement.className =
          'custom-option cursor-pointer rounded-md px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 transition-colors duration-150 hover:bg-zinc-100 dark:hover:bg-white/10 flex items-center justify-between gap-3';
        optionElement.setAttribute('data-raw-value', rawValue);

        let dotHTML = '';
        if (isDifficulty) {
          const { dot } = difficultyClasses(rawValue);
          dotHTML = `<span class="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-zinc-400/60 dark:ring-white/20 shrink-0 ${dot}" aria-hidden="true"></span>`;
        }

        optionElement.innerHTML = `
          <span class="min-w-0 flex items-center gap-2">
            ${dotHTML}
            <span class="truncate">${displayText}</span>
          </span>
          <svg data-check viewBox="0 0 20 20" class="h-4 w-4 opacity-0 transition-opacity" aria-hidden="true">
            <path d="M5 10.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;

        optionsContainer.appendChild(optionElement);
      }

      optionElement.addEventListener('click', (event) => {
        event.stopPropagation();
        let labelId = '';
        switch (id.replace('Options', '')) {
          case 'mapType':           labelId = 'map type'; break;
          case 'difficulty_exact':  labelId = 'difficulty'; break;
          case 'mechanics':         labelId = 'mechanics'; break;
          case 'restrictions':      labelId = 'restrictions'; break;
          case 'tags':              labelId = 'tags'; break;
          case 'onlyPlaytest':      labelId = 'in playtest'; break;
          case 'ignoreCompletions': labelId = 'completed'; break;
          case 'onlyMedals':        labelId = 'medals'; break;
          default:                  labelId = id.replace('Options', '');
        }

        if (!useWrapper) {
          optionsContainer
            .querySelectorAll('.custom-option')
            .forEach((opt) => opt.classList.remove(...String('selected').trim().split(/\s+/).filter(Boolean)));
          optionElement.classList.add(...String('selected').trim().split(/\s+/).filter(Boolean));

          optionsContainer
            .querySelectorAll('.custom-option [data-check]')
            .forEach((c) => (c.style.opacity = '0'));
          const mark = optionElement.querySelector('[data-check]');
          if (mark) mark.style.opacity = '1';
        }

        if (id !== 'mechanicsOptions' && id !== 'restrictionsOptions' && id !== 'tagsOptions') {
          optionsContainer.style.display = 'none';
          optionsContainer.classList.remove(...String('show').trim().split(/\s+/).filter(Boolean));
          _hideFloating(optionsContainer);
        }

        const translatedMessage = t('popup.filter_applied', {
          filterId: labelId,
          value: displayText,
        });
        showConfirmationMessage(translatedMessage);
        updateActiveFilters();
      });
    });

    button.appendChild(optionsContainer);
  }

  const rawKey = id.replace('Options', '');
  syncOptionsWithFilters(optionsContainer, rawKey);
  return optionsContainer;
}

function openPlaytestStatusPanel(button) {
  const labelInProgress = (typeof t === 'function' && t('filters_toolbar.in_progress')) || 'In Progress';
  const labelApproved   = (typeof t === 'function' && t('filters_toolbar.approved'))   || 'Approved';
  const labelStatus     = (typeof t === 'function' && t('filters_toolbar.playtest_status')) || 'Playtest status';
  const hintTxt         = (typeof t === 'function' && t('filters_toolbar.unchecked_is_approved')) || 'Unchecked = Approved';

  let opts = document.getElementById('playtestStatusOptions');
  if (!opts) {
    opts = document.createElement('div');
    opts.id = 'playtestStatusOptions';
    opts.className =
      'custom-options opacity-0 translate-y-1 transition p-3 mt-0 z-45 bg-white/95 dark:bg-zinc-900/95 backdrop-blur shadow-lg ring-1 ring-zinc-300/60 dark:ring-white/10 rounded-lg w-56';
    opts.dataset.filterKeyRaw = 'playtestStatus';
    opts.dataset.anchorId = button.id;

    opts.innerHTML = `
      <label for="playtestStatusCheckbox" class="flex items-center justify-between gap-3 select-none">
        <span data-role="pt-status-label" class="text-sm text-zinc-800 dark:text-zinc-200">${labelInProgress}</span>
        <span class="relative inline-flex cursor-pointer items-center">
          <input id="playtestStatusCheckbox" type="checkbox" class="peer sr-only" />
          <span
            role="switch"
            aria-checked="false"
            class="relative h-5 w-9 rounded-full bg-zinc-700 transition-colors duration-200 ease-in-out
                   peer-checked:bg-emerald-500
                   after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:translate-x-0 after:rounded-full after:bg-white
                   after:transition-transform after:duration-200 after:ease-in-out after:content-['']
                   peer-checked:after:translate-x-4 active:after:scale-95">
          </span>
        </span>
      </label>
    `;
    document.body.appendChild(opts);

    const input   = opts.querySelector('#playtestStatusCheckbox');
    const track   = opts.querySelector('[role="switch"]');
    const lblNode = opts.querySelector('[data-role="pt-status-label"]');

    const currentOn = () =>
      String(activeFilters.playtest_status || persistentFilters.playtest_status || 'In Progress')
        .toLowerCase()
        .includes('progress');

    const applyState = (on) => {
      input.checked = on;
      track.setAttribute('aria-checked', String(on));
      lblNode.textContent = on ? labelInProgress : labelApproved;
      track.setAttribute('aria-label', on ? labelInProgress : labelApproved);
    };

    applyState(currentOn());

    input.addEventListener('change', () => {
      const isOn        = input.checked;
      const canonical   = isOn ? 'In Progress' : 'Approved';
      const displayName = isOn ? labelInProgress : labelApproved;

      activeFilters.playtest_status = canonical;
      persistentFilters.playtest_status = canonical;

      applyState(isOn);
      updateActiveFilters();
      updateToolbarButtonStates();
      showConfirmationMessage(`${labelStatus}: ${displayName}`);
    });

    track.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        input.checked = !input.checked;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    track.tabIndex = 0;
  } else {
    opts.dataset.anchorId = button.id;

    const input   = opts.querySelector('#playtestStatusCheckbox');
    const track   = opts.querySelector('[role="switch"]');
    const lblNode = opts.querySelector('[data-role="pt-status-label"]');

    const on = String(activeFilters.playtest_status || persistentFilters.playtest_status || 'In Progress')
      .toLowerCase()
      .includes('progress');

    input.checked = on;
    track.setAttribute('aria-checked', String(on));
    lblNode.textContent = on ? labelInProgress : labelApproved;
    track.setAttribute('aria-label', on ? labelInProgress : labelApproved);
  }

  positionInputOrDropdown(null, opts);
  showDropdown(opts);
}

function difficultyClasses(label, value) {
  const base = {
    text: 'text-zinc-800 dark:text-zinc-200',
    chip: 'border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 text-zinc-800 dark:text-zinc-200',
    dot: 'bg-white/75 dark:bg-zinc-900/60',
  };

  if (typeof label === 'string') {
    const L = label.toLowerCase();
    if (L.startsWith('easy'))
      return {
        text: 'text-emerald-300',
        chip: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
        dot: 'bg-emerald-400',
      };
    if (L.startsWith('medium'))
      return {
        text: 'text-yellow-300',
        chip: 'border-yellow-400/20 bg-yellow-500/10 text-yellow-200',
        dot: 'bg-yellow-400',
      };
    if (L.startsWith('hard') && !L.startsWith('very'))
      return {
        text: 'text-orange-300',
        chip: 'border-orange-400/20 bg-orange-500/10 text-orange-200',
        dot: 'bg-orange-400',
      };
    if (L.startsWith('very hard'))
      return {
        text: 'text-orange-400',
        chip: 'border-orange-500/20 bg-orange-600/10 text-orange-300',
        dot: 'bg-orange-500',
      };
    if (L.startsWith('extreme'))
      return {
        text: 'text-red-400',
        chip: 'border-red-500/20 bg-red-600/10 text-red-300',
        dot: 'bg-red-500',
      };
    if (L.startsWith('hell'))
      return {
        text: 'text-rose-400',
        chip: 'border-rose-500/20 bg-rose-600/10 text-rose-300',
        dot: 'bg-rose-500',
      };
  }

  if (Number.isFinite(value)) {
    if (value < 2.35)
      return {
        text: 'text-emerald-300',
        chip: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
        dot: 'bg-emerald-400',
      }; // Easy
    if (value < 4.12)
      return {
        text: 'text-yellow-300',
        chip: 'border-yellow-400/20 bg-yellow-500/10 text-yellow-200',
        dot: 'bg-yellow-400',
      }; // Medium
    if (value < 5.88)
      return {
        text: 'text-orange-300',
        chip: 'border-orange-400/20 bg-orange-500/10 text-orange-200',
        dot: 'bg-orange-400',
      }; // Hard
    if (value < 7.65)
      return {
        text: 'text-orange-400',
        chip: 'border-orange-500/20 bg-orange-600/10 text-orange-300',
        dot: 'bg-orange-500',
      }; // Very Hard
    if (value < 9.41)
      return {
        text: 'text-red-400',
        chip: 'border-red-500/20 bg-red-600/10 text-red-300',
        dot: 'bg-red-500',
      }; // Extreme
    return {
      text: 'text-rose-400',
      chip: 'border-rose-500/20 bg-rose-600/10 text-rose-300',
      dot: 'bg-rose-500',
    }; // Hell
  }

  return base;
} 

function mountMapViewSwitch() {
  const container = document.querySelector('.toolbar-container');
  if (!container) return;

  document.getElementById('completionsViewSwitch')?.remove();

  let wrap = document.getElementById('mapViewSwitch');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'mapViewSwitch';
    wrap.className =
      'ml-auto inline-flex items-center gap-0 rounded-lg border border-zinc-200/80 dark:border-white/10 overflow-hidden ' +
      'bg-white/75 dark:bg-zinc-900/60 backdrop-blur ring-1 ring-zinc-300/60 dark:ring-white/10';
    wrap.innerHTML = `
      <button type="button" data-view="cards"
        class="cursor-pointer px-2.5 py-1.5 text-xs flex items-center gap-1 ${mapSearchView==='cards'?'bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 ring-1 ring-zinc-300/60 dark:ring-white/10':''}"
        aria-pressed="${mapSearchView==='cards'}">
        <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/>
        </svg>
        <span class="hidden sm:inline"></span>
      </button>
      <button type="button" data-view="table"
        class="cursor-pointer px-2.5 py-1.5 text-xs flex items-center gap-1 ${mapSearchView==='table'?'bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 ring-1 ring-zinc-300/60 dark:ring-white/10':''}"
        aria-pressed="${mapSearchView==='table'}">
        <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M3 5h18v2H3zm0 6h18v2H3zm0 6h18v2H3z"/>
        </svg>
        <span class="hidden sm:inline"></span>
      </button>
    `;
    container.appendChild(wrap);
  }

  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-view]');
    if (!btn) return;
    const view = btn.dataset.view;
    if (view === mapSearchView) return;

    mapSearchView = view;
    localStorage.setItem(MAP_VIEW_LS_KEY, mapSearchView);

    wrap.querySelectorAll('button[data-view]').forEach(b => {
      const on = (b.dataset.view === mapSearchView);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
(() => { const __obj = b; let __last; for (const __c of String('bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, on); return __last; })();
(() => { const __obj = b; let __last; for (const __c of String('ring-1').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, on); return __last; })();
(() => { const __obj = b; let __last; for (const __c of String('ring-zinc-300/60 dark:ring-white/10').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, on); return __last; })();
    });

    const hasCache = Array.isArray(lastMapRows) && lastMapRows.length;

    //page size depending on section and mode
    const effPageSize = getEffectivePageSize('map_search');
    const cacheMismatch =
      hasCache &&
      currentSection === 'map_search' &&
      typeof currentPage !== 'undefined' &&
      currentPage === 1 &&
      (lastMapRows.length === 25 || lastMapRows.length === 27) &&
      lastMapRows.length !== effPageSize;

    if (hasCache && !cacheMismatch) {
      renderMapSearchResultsByMode(lastMapRows);
    } else {
      applyFilters(activeFilters, { syncUrl: false });
    }
  });
}

function mountCompletionsViewSwitch() {
  const container = document.querySelector('.toolbar-container');
  if (!container) return;

  document.getElementById('mapViewSwitch')?.remove();

  let wrap = document.getElementById('completionsViewSwitch');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'completionsViewSwitch';
    wrap.className =
      'ml-auto inline-flex items-center gap-0 rounded-lg border border-zinc-200/80 dark:border-white/10 overflow-hidden ' +
      'bg-white/75 dark:bg-zinc-900/60 backdrop-blur ring-1 ring-zinc-300/60 dark:ring-white/10';
    wrap.innerHTML = `
      <button type="button" data-view="cards"
        class="cursor-pointer px-2.5 py-1.5 text-xs flex items-center gap-1 ${completionsView==='cards'?'bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 ring-1 ring-zinc-300/60 dark:ring-white/10':''}"
        aria-pressed="${completionsView==='cards'}">
        <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/>
        </svg>
        <span class="hidden sm:inline"></span>
      </button>
      <button type="button" data-view="table"
        class="cursor-pointer px-2.5 py-1.5 text-xs flex items-center gap-1 ${completionsView==='table'?'bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 ring-1 ring-zinc-300/60 dark:ring-white/10':''}"
        aria-pressed="${completionsView==='table'}">
        <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M3 5h18v2H3zm0 6h18v2H3zm0 6h18v2H3z"/>
        </svg>
        <span class="hidden sm:inline"></span>
      </button>
    `;
    container.appendChild(wrap);
  }

  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-view]');
    if (!btn) return;
    const view = btn.dataset.view;
    if (view === completionsView) return;

    completionsView = view;
    localStorage.setItem(COMPLETIONS_VIEW_LS_KEY, completionsView);

    wrap.querySelectorAll('button[data-view]').forEach(b => {
      const on = (b.dataset.view === completionsView);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
(() => { const __obj = b; let __last; for (const __c of String('bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, on); return __last; })();
(() => { const __obj = b; let __last; for (const __c of String('ring-1').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, on); return __last; })();
(() => { const __obj = b; let __last; for (const __c of String('ring-zinc-300/60 dark:ring-white/10').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, on); return __last; })();
    });

    if (Array.isArray(lastCompletionsRows) && lastCompletionsRows.length) {
      renderCompletionsResultsByMode({ results: lastCompletionsRows });
    } else {
      applyFilters(activeFilters, { syncUrl: false });
    }
  });
}

function mountPersonalRecordsViewSwitch() {
  const container = document.querySelector('.toolbar-container');
  if (!container) return;

  document.getElementById('mapViewSwitch')?.remove();
  document.getElementById('completionsViewSwitch')?.remove();

  let wrap = document.getElementById('personalViewSwitch');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'personalViewSwitch';
    wrap.className =
      'ml-auto inline-flex items-center gap-0 rounded-lg border border-zinc-200/80 dark:border-white/10 overflow-hidden '+
      'bg-white/75 dark:bg-zinc-900/60 backdrop-blur ring-1 ring-zinc-300/60 dark:ring-white/10';
    wrap.innerHTML = `
      <button type="button" data-view="cards"
        class="cursor-pointer px-2.5 py-1.5 text-xs flex items-center gap-1 ${personalRecordsView==='cards'?'bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 ring-1 ring-zinc-300/60 dark:ring-white/10':''}"
        aria-pressed="${personalRecordsView==='cards'}">
        <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/>
        </svg>
        <span class="hidden sm:inline"></span>
      </button>
      <button type="button" data-view="table"
        class="cursor-pointer px-2.5 py-1.5 text-xs flex items-center gap-1 ${personalRecordsView==='table'?'bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 ring-1 ring-zinc-300/60 dark:ring-white/10':''}"
        aria-pressed="${personalRecordsView==='table'}">
        <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M3 5h18v2H3zm0 6h18v2H3zm0 6h18v2H3z"/>
        </svg>
        <span class="hidden sm:inline"></span>
      </button>
    `;
    container.appendChild(wrap);
  }

  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-view]');
    if (!btn) return;
    const view = btn.dataset.view;
    if (view === personalRecordsView) return;

    personalRecordsView = view;
    localStorage.setItem(PERSONAL_RECORDS_VIEW_LS_KEY, personalRecordsView);

    wrap.querySelectorAll('button[data-view]').forEach(b => {
      const on = (b.dataset.view === personalRecordsView);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
(() => { const __obj = b; let __last; for (const __c of String('bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, on); return __last; })();
(() => { const __obj = b; let __last; for (const __c of String('ring-1').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, on); return __last; })();
(() => { const __obj = b; let __last; for (const __c of String('ring-zinc-300/60 dark:ring-white/10').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, on); return __last; })();
    });

    if (Array.isArray(lastPersonalRows) && lastPersonalRows.length) {
      renderPersonalRecordsResultsByMode({ results: lastPersonalRows });
    } else {
      applyFilters(activeFilters, { syncUrl: false });
    }
  });
}

function getSectionView(section) {
  const key = VIEW_LS_KEYS[section];
  const fallback = VIEW_DEFAULTS[section] || 'cards';
  if (!key) return fallback;
  const v = localStorage.getItem(key);
  return (v === 'table' || v === 'cards') ? v : fallback;
}

function ensureOfficialNoticeElement() {
  let el = document.getElementById(OFFICIAL_NOTICE_ID);
  if (el) return el;

  const tabs = document.getElementById('searchTabs');
  if (!tabs || !tabs.parentElement) return null;

  el = document.createElement('div');
  el.id = OFFICIAL_NOTICE_ID;
  el.className = [
    'mt-3 sm:mt-0 sm:ml-4',
    'inline-flex items-stretch gap-3',
    'rounded-xl border border-amber-400/30 bg-amber-500/10',
    'px-3 py-2 sm:px-3.5 sm:py-2.5',
    'ring-1 ring-amber-400/20',
    'text-sm'
  ].join(' ');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.style.display = 'none';

  el.innerHTML = `
    <div class="flex items-start gap-2">
      <svg class="mt-0.5 h-4 w-4 shrink-0 text-amber-300" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 14h-2v-6h2v6Zm0-8h-2V6h2v2Z"></path>
      </svg>
      <div class="min-w-0">
        <div class="font-semibold text-amber-300 text-xs sm:text-sm">
          ${t('unofficial_notice.title')}
        </div>
        <div class="mt-0.5 text-[11px] sm:text-xs leading-5 text-amber-100">
          ${t('unofficial_notice.li1')}
        </div>
      </div>
    </div>
  `;

  tabs.insertAdjacentElement('afterend', el);
  return el;
}

function updateOfficialNotice() {
  const el = ensureOfficialNoticeElement();
  if (!el) return;

  const isUnofficial =
    currentSection === 'map_search' &&
    String((activeFilters && activeFilters.official) || '').toLowerCase() === 'false';

  el.style.display = isUnofficial ? '' : 'none';
}

/* =========================
   TOOLBAR INIT
   ========================= */
function initializeToolbarButtons() {
  clearToolbarButtons();
  document.getElementById('mapViewSwitch')?.remove();
  document.getElementById('completionsViewSwitch')?.remove();
  document.getElementById('personalViewSwitch')?.remove();

  const sectionIconsMap = {
    map_search: icons.filter((icon) => icon.id !== 'user'),
    completions: icons.filter((icon) =>
      ['code', 'user', 'apply_filters', 'clear_filters'].includes(icon.id)
    ),
    guide: icons.filter((icon) => ['code', 'apply_filters', 'clear_filters'].includes(icon.id)),
    personal_records: icons.filter((icon) =>
      ['user', 'difficulty_exact', 'apply_filters', 'clear_filters'].includes(icon.id)
    ),
  };
  const filteredIcons = sectionIconsMap[currentSection] || icons;

  filteredIcons.forEach((icon) => {
    const button = createButton(icon);
    toolbar.appendChild(button);

    button.addEventListener('click', () => {
      hideAllFilters();
      hideAllActiveSuggestions();

      button.classList.add(...String('selected').trim().split(/\s+/).filter(Boolean));

      let input, optionsContainer;
      switch (icon.id) {
        case 'code': {
          input = getOrCreateInput('mapCodeInput', t('filters_toolbar.enter_map_code'), button);
          input.addEventListener('input', (event) =>
            showSuggestions(event, 'map-codes', 'mapCodeSuggestionsContainer', 'code')
          );
          ['mousedown', 'click', 'focus'].forEach((type) =>
            input.addEventListener(type, (e) => e.stopPropagation())
          );
          break;
        }
        case 'creator': {
          input = getOrCreateInput('mapCreatorInput', t('filters_toolbar.enter_creator'), button);
          input.addEventListener('input', (event) =>
            showSuggestions(event, 'users', 'creatorSuggestionsContainer', 'creator')
          );
          ['mousedown', 'click', 'focus'].forEach((type) =>
            input.addEventListener(type, (e) => e.stopPropagation())
          );
          break;
        }
        case 'map_name': {
          input = getOrCreateInput('mapNameInput', t('filters_toolbar.enter_map_name'), button);
          input.addEventListener('input', (event) =>
            showSuggestions(event, 'map-names', 'mapNameSuggestionsContainer', 'map_name')
          );
          ['mousedown', 'click', 'focus'].forEach((type) =>
            input.addEventListener(type, (e) => e.stopPropagation())
          );
          break;
        }
        case 'user': {
          input = getOrCreateInput(
            'userNicknameInput',
            t('filters_toolbar.enter_nickname'),
            button
          );
          input.addEventListener('input', (event) =>
            showSuggestions(event, 'users', 'nicknameSuggestionsContainer', 'user')
          );
          ['mousedown', 'click', 'focus'].forEach((type) =>
            input.addEventListener(type, (e) => e.stopPropagation())
          );
          break;
        }
        case 'difficulty_exact':
          optionsContainer = showOptionsContainer(
            'difficulty_exactOptions',
            getExactDifficultyFilterOptions(),
            button,
            false
          );
          break;
        case 'category':
          optionsContainer = showOptionsContainer(
            'categoryOptions',
            [
              { text: t('filters_toolbar.classic'), value: 'Classic', raw: 'Classic' },
              {
                text: t('filters_toolbar.increasing_difficulty'),
                value: 'Increasing Difficulty',
                raw: 'Increasing Difficulty',
              },
              //{ text: t("filters_toolbar.tournament"), value: "Tournament", raw: "Tournament" }
            ],
            button,
            false /* multiples */
          );
          break;
        case 'mechanics':
          optionsContainer = showOptionsContainer(
            'mechanicsOptions',
            window.mechanicsOptions || [],
            button,
            true
          );
          break;
        case 'restrictions':
          optionsContainer = showOptionsContainer(
            'restrictionsOptions',
            window.restrictionsOptions || [],
            button,
            true
          );
          break;
        case 'completion_filter':
          optionsContainer = showOptionsContainer(
            'completionFilterOptions',
            [
              { text: 'True', value: 'With', raw: 'With' },
              { text: 'False', value: 'Without', raw: 'Without' },
            ],
            button,
            false
          );
          break;
        case 'medal_filter':
          optionsContainer = showOptionsContainer(
            'medalFilterOptions',
            [
              { text: 'True', value: 'With', raw: 'With' },
              { text: 'False', value: 'Without', raw: 'Without' },
            ],
            button,
            false
          );
          break;
        case 'official':
          optionsContainer = showOptionsContainer(
            'officialOptions',
            [
              { text: t('filters_toolbar.global_server'),  value: 'True',  raw: 'True' },
              { text: t('filters_toolbar.china_server'),   value: 'False', raw: 'False' },
            ],
            button,
            false
          );
          break;
        case 'tags':
          optionsContainer = showOptionsContainer(
            'tagsOptions',
            TAG_OPTIONS,
            button,
            true
          );
          break;
        case 'playtest_filter':
          optionsContainer = showOptionsContainer(
            'playtest_filterOptions',
            [
              { text: t('filters_toolbar.playtest_all')  || 'All',  value: 'All',  raw: 'All' },
              { text: t('filters_toolbar.playtest_only') || 'Only', value: 'Only', raw: 'Only' },
              { text: t('filters_toolbar.playtest_none') || 'None', value: 'None', raw: 'None' },
            ],
            button,
            false
          );
          break;
        case 'apply_filters':
          applyFilters(activeFilters, { pushUrl: true });
          break;
        case 'clear_filters':
          clearFilters();
          applyFilters(activeFilters, { pushUrl: true });
          break;
      }
      document.querySelectorAll('.toolbar-button').forEach((b) => {
        b.style.zIndex = '';
      });
      button.style.zIndex = '1000';
      positionInputOrDropdown(input, optionsContainer);
      if (optionsContainer) showDropdown(optionsContainer);
    });
  });

  if (currentSection === 'map_search') {
    mountMapViewSwitch();
  }
  if (currentSection === 'completions') {
    mountCompletionsViewSwitch();
  }
  if (currentSection === 'personal_records') {
    mountPersonalRecordsViewSwitch();
  }

  refreshToolbarAnimation();
}

/* =========================
   TOOLBAR FILTERS
   ========================= */
function updateActiveFilters() {
  const filterMappings = {
    mapCode: 'code',
    mapName: 'map_name',
    category: 'category',
    mapCreator: 'creator_ids',
    user_id: 'user_id',
    mapDifficulty: 'difficulty_exact',
    mapQuality: 'minimum_quality',
    playtest_filter: 'playtest_filter',
    medalFilter: 'medal_filter',
    mechanics: 'mechanics',
    restrictions: 'restrictions',
    tags: 'tags',
    completionFilter: 'completion_filter',
    official: 'official',
  };

  activeFilters = { ...persistentFilters };

  document.querySelectorAll('.custom-options').forEach((optionsContainer) => {
    const filterId = optionsContainer.id.replace('Options', '');
    const mappedFilterId = filterMappings[filterId] || filterId;

    if (filterId === 'mechanics' || filterId === 'restrictions' || filterId === 'tags') {
      const checkboxes = optionsContainer.querySelectorAll('.custom-checkbox:checked');

      if (checkboxes.length > 0) {
        activeFilters[mappedFilterId] = Array.from(checkboxes).map((cb) => {
          const wrapper = cb.closest('.custom-option-wrapper');
          const label = wrapper?.querySelector('.custom-option');
          const rawValue =
            (label && label.getAttribute('data-raw-value')) ||
            (label && label.textContent) ||
            '';
          return rawValue.trim();
        });
      } else {
        delete activeFilters[mappedFilterId];
      }

      return;
    }

    const selectedOption = optionsContainer.querySelector('.custom-option.selected');
    if (selectedOption) {
      const rawValue =
        selectedOption.getAttribute('data-raw-value') || selectedOption.textContent.trim();
      activeFilters[mappedFilterId] = rawValue;
    } else {
      delete activeFilters[mappedFilterId];
    }
  });

  const codeInput = document.getElementById('mapCodeInput');
  if (codeInput) {
    const raw = codeInput.getAttribute('data-selected-raw-value') || codeInput.value.trim();
    if (raw) activeFilters.code = raw;
    else delete activeFilters.code;
  }

  const mapNameInput = document.getElementById('mapNameInput');
  if (mapNameInput) {
    const selectedRaw = mapNameInput.getAttribute('data-selected-raw-value');
    let raw = selectedRaw || mapNameInput.value.trim();

    if (!selectedRaw && typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'cn' && raw) {
      raw = mapNameCnToEnSmart(raw);
    }

    if (raw) activeFilters.map_name = raw;
    else delete activeFilters.map_name;
  }

  const userInput = document.getElementById('userNicknameInput');
  if (userInput) {
    const raw = userInput.getAttribute('data-selected-raw-value') || '';
    if (raw) activeFilters.user_id = raw;
    else delete activeFilters.user_id;
  }

  const creatorInput = document.getElementById('mapCreatorInput');
  if (creatorInput) {
    const selectedId = creatorInput.getAttribute('data-selected-raw-value');
    const typed = creatorInput.value.trim();
    if (selectedId) {
      activeFilters.creator_ids = selectedId;
      delete activeFilters.creator_names;
    } else if (typed) {
      activeFilters.creator_names = typed;
      delete activeFilters.creator_ids;
    } else {
      delete activeFilters.creator_ids;
      delete activeFilters.creator_names;
    }
  }

  updateToolbarButtonStates();
}

function updateToolbarButtonStates() {
  const keyMap = {
    user: ['user_id'],
    creator: ['creator_ids', 'creator_names'],
  };

  const booleanLikeFilters = new Set(['completion_filter', 'medal_filter', 'official']);

  function boolBadgeLabel(v) {
    const s = String(v || '').trim();
    if (!s) return '✓';

    // CN: render compact yes/no
    if (typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'cn') {
      const map = { With: '是', Without: '否', True: '是', False: '否', Yes: '是', No: '否' };
      return map[s] || s;
    }

    // Default: keep existing behavior
    const map = { With: 'True', Without: 'False', True: 'True', False: 'False' };
    return map[s] || s;
  }

  function optionLabelFromWindowList(kind, rawValue) {
    const raw = String(rawValue || '').trim();
    if (!raw) return raw;

    const list =
      kind === 'mechanics'
        ? (window.mechanicsOptions || mechanicsOptions || [])
        : (window.restrictionsOptions || restrictionsOptions || []);

    const rawLower = raw.toLowerCase();

    const found = (Array.isArray(list) ? list : []).find((opt) => {
      const oRaw = String(opt?.raw ?? opt?.value ?? '').trim();
      const oText = String(opt?.text ?? '').trim();
      return (oRaw && oRaw.toLowerCase() === rawLower) || (oText && oText.toLowerCase() === rawLower);
    });

    return (found && (found.translated || found.text)) ? String(found.translated || found.text) : raw;
  }

  function translateBadgeValue(filterId, rawValue) {
    const v = String(rawValue || '').trim();
    if (!v) return v;

    // Map name
    if (filterId === 'map_name' && typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'cn') {
      return mapNameToCnDisplay(v);
    }

    if (filterId === 'official') {
      const isTrue =
        (typeof rawValue === 'boolean')
          ? rawValue
          : (() => {
              const s = String(rawValue ?? v).trim().toLowerCase();
              if (!s) return true;
              if (['true', 'with', 'yes', '1', 'on', 'global'].includes(s)) return true;
              if (['false', 'without', 'no', '0', 'off', 'china', 'cn'].includes(s)) return false;
              return true;
            })();

      return isTrue
        ? (t('filters_toolbar.global_server') || 'Global')
        : (t('filters_toolbar.china_server') || 'China');
    }

    // Boolean-like
    if (booleanLikeFilters.has(filterId)) {
      return boolBadgeLabel(v);
    }

    // Difficulty
    if (filterId === 'difficulty_exact') {
      const map = {
        'beginner': t('filters_toolbar.beginner') || 'Beginner',
        'easy': t('filters_toolbar.easy') || 'Easy',
        'medium': t('filters_toolbar.medium') || 'Medium',
        'hard': t('filters_toolbar.hard') || 'Hard',
        'very hard': t('filters_toolbar.very_hard') || 'Very Hard',
        'extreme': t('filters_toolbar.extreme') || 'Extreme',
        'hell': t('filters_toolbar.hell') || 'Hell',
      };
      return map[v.toLowerCase()] || v;
    }

    // Category
    if (filterId === 'category') {
      const map = {
        'classic': t('filters_toolbar.classic') || 'Classic',
        'increasing difficulty': t('filters_toolbar.increasing_difficulty') || 'Increasing Difficulty',
        'tournament': t('filters_toolbar.tournament') || 'Tournament',
      };
      return map[v.toLowerCase()] || v;
    }

    // Playtest filter
    if (filterId === 'playtest_filter') {
      const map = {
        'all': t('filters_toolbar.playtest_all') || 'All',
        'only': t('filters_toolbar.playtest_only') || 'Only',
        'none': t('filters_toolbar.playtest_none') || 'None',
      };
      return map[v.toLowerCase()] || v;
    }

    // Playtest status (persistent)
    if (filterId === 'playtest_status') {
      const map = {
        'in_progress': t('filters_toolbar.in_progress') || 'In progress',
        'approved': t('filters_toolbar.approved') || 'Approved',
      };
      return map[v.toLowerCase()] || v;
    }

    // Mechanics/Restrictions
    if (filterId === 'mechanics' || filterId === 'restrictions' || filterId === 'tags') {
      return optionLabelFromWindowList(filterId, v);
    }

    return v;
  }

  const codeIsActive =
    !!activeFilters.code && String(activeFilters.code).trim() !== '';

  const buttons = document.querySelectorAll('.toolbar-button');
  buttons.forEach((button) => {
    const iconId = button.id.replace('FilterButton', '');
    const filterId = iconId.toLowerCase();

    const keys = keyMap[filterId] || [filterId];

    let value = keys
      .map((k) => activeFilters[k])
      .find(
        (v) =>
          v !== undefined &&
          v !== null &&
          !(Array.isArray(v) && v.length === 0) &&
          v !== ''
      );

    const isLockedByCode =
      codeIsActive &&
      !['code', 'apply_filters', 'clear_filters'].includes(filterId);

    // reset value if locked
    if (isLockedByCode) {
      value = undefined;
    }

    const isActive =
      value !== undefined &&
      value !== null &&
      !(Array.isArray(value) && value.length === 0) &&
      value !== '';

    const effectiveActive = !isLockedByCode && isActive;

    if (effectiveActive) {
      button.classList.add(...String('active-filter').trim().split(/\s+/).filter(Boolean), ...String('border-brand-400/40').trim().split(/\s+/).filter(Boolean), ...String('ring-1').trim().split(/\s+/).filter(Boolean), ...String('ring-emerald-500/30').trim().split(/\s+/).filter(Boolean));
    } else {
      button.classList.remove(...String('active-filter').trim().split(/\s+/).filter(Boolean), ...String('border-brand-400/40').trim().split(/\s+/).filter(Boolean), ...String('ring-1').trim().split(/\s+/).filter(Boolean), ...String('ring-emerald-500/30').trim().split(/\s+/).filter(Boolean));
    }

    // ====== Lock ======
    if (isLockedByCode) {
      button.disabled = true;
      button.classList.add(...String('cursor-not-allowed').trim().split(/\s+/).filter(Boolean), ...String('pointer-events-none').trim().split(/\s+/).filter(Boolean), ...String('is-disabled-by-code').trim().split(/\s+/).filter(Boolean));

      button.classList.remove(...String('selected').trim().split(/\s+/).filter(Boolean));
      const circle = button.querySelector('.selection-circle');
      if (circle) circle.classList.remove(...String('circle-visible').trim().split(/\s+/).filter(Boolean));
    } else {
      button.disabled = false;
      button.classList.remove(...String('cursor-not-allowed').trim().split(/\s+/).filter(Boolean), ...String('pointer-events-none').trim().split(/\s+/).filter(Boolean), ...String('is-disabled-by-code').trim().split(/\s+/).filter(Boolean));
    }

    // ====== Badge ======
    const badge = button.querySelector('.filter-badge');
    if (!badge) return;

    if (!effectiveActive) {
      badge.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
      badge.textContent = '';
      return;
    }

    let text = '✓';

    if (Array.isArray(value)) {
      // Mechanics/Restrictions: if only one selected, show translated label; otherwise show count
      if ((filterId === 'mechanics' || filterId === 'restrictions') && value.length === 1) {
        const display = translateBadgeValue(filterId, value[0]);
        text = display.length > 6 ? display.slice(0, 6) + '…' : display;
      } else {
        text = `${value.length}`;
      }
    } else if (typeof value === 'boolean') {
      if (filterId === 'official') {
        const display = translateBadgeValue(filterId, value);
        text = display.length > 6 ? display.slice(0, 6) + '…' : display;
      } else {
        text = value ? 'ON' : 'OFF';
      }
    } else if (typeof value === 'string') {
      const display = translateBadgeValue(filterId, value);
      text = display.length > 6 ? display.slice(0, 6) + '…' : display;
    }

    badge.textContent = text;
    badge.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
  });
}

function syncOptionsWithFilters(optionsContainer, filterKeyRaw) {
  if (!optionsContainer) return;

  const map = {
    category: 'category',
    difficultyExact: 'difficulty_exact',
    mechanics: 'mechanics',
    restrictions: 'restrictions',
    tags: 'tags',
    playtest_filter: 'playtest_filter',
    completionFilter: 'completion_filter',
    medalFilter: 'medal_filter',
    official: 'official',
  };
  const mapped = map[filterKeyRaw] || filterKeyRaw;

  const source = { ...persistentFilters, ...activeFilters };
  const val = source[mapped];
  if (val == null) return;

  if (mapped === 'mechanics' || mapped === 'restrictions' || mapped === 'tags') {
    const selected = new Set(Array.isArray(val) ? val.map((v) => String(v).toLowerCase()) : []);
    optionsContainer.querySelectorAll('.custom-option-wrapper').forEach((w) => {
      const label = w.querySelector('.custom-option');
      const checkbox = w.querySelector('input[type="checkbox"]');
      if (!label || !checkbox) return;
      const raw = (label.getAttribute('data-raw-value') || '').toLowerCase();
      checkbox.checked = selected.has(raw);
    });
    return;
  }

  optionsContainer.querySelectorAll('.custom-option').forEach((opt) => {
    const raw = opt.getAttribute('data-raw-value');
    const match = String(val) === raw;
    if (match) opt.classList.add(...String('selected').trim().split(/\s+/).filter(Boolean));
    else opt.classList.remove(...String('selected').trim().split(/\s+/).filter(Boolean));
  });

  const allChecks = optionsContainer.querySelectorAll('.custom-option [data-check]');
  allChecks.forEach((c) => (c.style.opacity = '0'));
  const selectedCheck = optionsContainer.querySelector('.custom-option.selected [data-check]');
  if (selectedCheck) selectedCheck.style.opacity = '1';
}

function removeFilter(filterId, filterElement) {
  const index = selectedFilters.indexOf(filterId);
  if (index !== -1) {
    selectedFilters.splice(index, 1);
    filterElement.remove();
  }
}

function clearFilters(silent = false) {
  const hasActiveFilters =
    Object.keys(activeFilters).some((key) => key !== 'page_size' && key !== 'page_number') ||
    selectedFilters.length > 0;

  selectedFilters.length = 0;
  currentPage = 1;
  activeFilters = {};
  filters = {};
  persistentFilters = {};

  // Defaults filters
  if (currentSection === 'map_search') {
    const lang = String(CURRENT_LANG || '').toLowerCase();
    const defOfficial = (lang === 'cn') ? 'False' : 'True';

    activeFilters.official = defOfficial;
    persistentFilters.official = defOfficial;

    activeFilters.playtest_filter = 'All';
    persistentFilters.playtest_filter = 'All';

    activeFilters.sort = 'difficulty:asc';
    persistentFilters.sort = 'difficulty:asc';
    try { __syncMapSearchSortUI('difficulty:asc'); } catch {}
  }

  document.getElementById('filtersContainer').innerHTML = '';

  const paginationContainer = document.getElementById('paginationContainer');
  paginationContainer.innerHTML = '';

  ['mapCodeInput', 'mapNameInput', 'mapCreatorInput', 'userNicknameInput'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = '';
      el.removeAttribute('data-selected-raw-value');
    }
  });

  document.querySelectorAll('.custom-checkbox').forEach((cb) => (cb.checked = false));
  document
    .querySelectorAll('.custom-option.selected')
    .forEach((opt) => opt.classList.remove(...String('selected').trim().split(/\s+/).filter(Boolean)));
  document
    .querySelectorAll('.custom-option [data-check]')
    .forEach((svg) => (svg.style.opacity = '0'));

  document.querySelectorAll('.toolbar-button').forEach((btn) =>
    btn.classList.remove(...String('active-filter').trim().split(/\s+/).filter(Boolean), ...String('border-brand-400/40').trim().split(/\s+/).filter(Boolean), ...String('ring-1').trim().split(/\s+/).filter(Boolean), ...String('ring-emerald-500/30').trim().split(/\s+/).filter(Boolean))
  );

  // Server
  if (currentSection === 'map_search') {
    const lang = String(CURRENT_LANG || '').toLowerCase();
    const def = (lang === 'cn') ? 'False' : 'True';
    persistentFilters.official = def;
    activeFilters.official = def;
  }

  updateToolbarButtonStates();

  if (hasActiveFilters && !silent) {
    showWarningMessage(t('popup.filters_cleared'));
  }

  updateOfficialNotice();
}

async function applyFilters(filters, opts = {}) {
  const { pushUrl = false, syncUrl = true } = (opts || {});
  cachedPages = {};
  currentPage = 1;
  if (filters && typeof filters === 'object') {
    activeFilters = { ...filters };
  } else {
    activeFilters = { ...persistentFilters };
  }

  updateOfficialNotice();

  if (currentSection === 'guide') {
    const hasFilters = filters && Object.keys(filters).length > 0;
    const hasActiveMapCode = activeFilters && activeFilters.map_code;
    if (!hasFilters && !hasActiveMapCode) {
      activeFilters.map_code = '008EX';
    }
  }

  renderSkeletonForSection(currentSection);
  showLoadingBar();

  // CN
  if (typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'cn' && activeFilters.map_name) {
    activeFilters.map_name = await canonicalizeMapNameForApi(activeFilters.map_name);
  }

  try {
    const effPageSize = getEffectivePageSize(currentSection);
    const req = buildSectionRequest(currentSection, activeFilters, 1, effPageSize);

    const response = await fetch(req.url, {
      method: req.method,
      ...(req.headers ? { headers: req.headers } : {}),
      ...(req.body ? { body: req.body } : {}),
    });
    if (!response.ok) throw new Error('Erreur réseau : ' + response.statusText);

    const data = await response.json();

    persistentFilters = { ...activeFilters };
    if (syncUrl) __urlSyncFiltersFromState({ push: !!pushUrl });
    cachedPages[currentSection] = { 1: data };
    totalPages = computeTotalPagesFromData(data, effPageSize);

    updateToolbarButtonStates();
    displayResults(data);
    renderPaginationButtons();

    if (totalPages > 1) {
      await fetchPageData(2);
    }
  } catch (error) {
    console.error("Erreur lors de l'application des filtres :", error);
  } finally {
    hideLoadingBar();
    void __syncModalsFromUrl();
  }
}

/* =========================
   REQUESTS BY SECTION
   ========================= */
function buildSectionRequest(section, filters, pageNumber, pageSize) {
  const enc = encodeURIComponent;

  const toQuery = (obj = {}) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(obj)) {
      if (v == null || v === '') continue;
      if (Array.isArray(v)) {
        v.forEach((item) => {
          if (item != null && item !== '') p.append(k, item);
        });
      } else {
        p.set(k, v);
      }
    }
    return p.toString();
  };

  if (section === 'map_search') {
    const uid = typeof window !== 'undefined' && window.user_id ? String(window.user_id) : '';

    const effectiveFilters = {
      ...filters,
      ...(uid && !filters?.user_id ? { user_id: uid } : {}),
    };

    const query = toQuery({ ...effectiveFilters, page_number: pageNumber, page_size: pageSize });
    return { method: 'GET', url: `${apiUrls.mapSearch}?${query}` };
  }

  if (section === 'guide') {
    const code = decodeURIComponent(filters.code || '008EX');
    const query = toQuery({ include_records: true, page_size: pageSize, page_number: pageNumber });
    return { method: 'GET', url: `${apiUrls.guide}/${enc(code)}/guides?${query}` };
  }

  if (section === 'completions') {
    const hasUser = !!filters?.user_id;
    const hasCode = !!filters?.code;

    if (hasCode) {
      const code = decodeURIComponent(filters.code);
      const query = toQuery({
        page_number: pageNumber,
        page_size: pageSize,
        ...(hasUser ? { user_id: decodeURIComponent(filters.user_id) } : {}),
        ...(filters.difficulty_exact ? { difficulty: filters.difficulty_exact } : {}),
        ...(filters.medal_filter ? { medal_filter: filters.medal_filter } : {}),
        ...(filters.completion_filter ? { completion_filter: filters.completion_filter } : {}),
      });
      return { method: 'GET', url: `${apiUrls.completions}/${encodeURIComponent(code)}?${query}` };
    }

    if (hasUser) {
      const query = toQuery({
        page_number: pageNumber,
        page_size: pageSize,
        user_id: decodeURIComponent(filters.user_id),
        ...(filters.difficulty_exact ? { difficulty: filters.difficulty_exact } : {}),
        ...(filters.medal_filter ? { medal_filter: filters.medal_filter } : {}),
        ...(filters.completion_filter ? { completion_filter: filters.completion_filter } : {}),
      });
      return { method: 'GET', url: `${apiUrls.completions}?${query}` };
    }

    const defaultCode = '008EX';
    const query = toQuery({ page_number: pageNumber, page_size: pageSize });
    return {
      method: 'GET',
      url: `${apiUrls.completions}/${encodeURIComponent(defaultCode)}?${query}`,
    };
  }

  if (section === 'personal_records') {
    const requestedUserId = String(
      filters.user_id || (typeof user_id !== 'undefined' && user_id ? String(user_id) : '')
    ).trim();
    const requestedDifficulty = normalizeUserCompletionsDifficultyFilter(filters.difficulty_exact);
    const query = toQuery({
      user_id: requestedUserId,
      difficulty: requestedDifficulty,
      page_number: pageNumber,
      page_size: pageSize
    });
    return { method: 'GET', url: `${apiUrls.personalRecords}?${query}` };
  }

  const query = toQuery({ ...filters, page_number: pageNumber, page_size: pageSize });
  return { method: 'GET', url: `${apiUrls.mapSearch}?${query}` };
}

/* =========================
   DISPLAY RESULTS
   ========================= */
function displayResults(data) {
  const post = (r) => {
    if (r.map_name) {
      r.original_map_name = r.map_name;

      if (typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'cn') {
        r.map_name = mapNameToCnDisplay(r.map_name);
      } else if (typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG !== 'en') {
        const translatedName = t(
          `map_name.${r.map_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '')}`
        );
        if (typeof translatedName === 'string' && !translatedName.includes('map_name.')) {
          r.map_name = translatedName;
        }
      }
    }
    r.category = getTypesArray(r);
  };

  if (currentSection === 'map_search') {
    const rows = normalizeToRows(data, 'map');
    rows.forEach(post);
    renderMapSearchResultsByMode(rows);
    return;
  }

  if (currentSection === 'completions') {
    renderCompletionsResultsByMode(normalizeToRowsContainer(data));
    return;
  }

  if (currentSection === 'guide') {
    displayGuideResults(normalizeToRowsContainer(data));
    return;
  }

  if (currentSection === 'personal_records') {
    renderPersonalRecordsResultsByMode(normalizeToRowsContainer(data));
    return;
  }
}

/* =========================
   Suggestions (autocomplete)
   ========================= */
function getSuggestionsContainer(containerId, input) {
  let suggestionsContainer = document.getElementById(containerId);
  if (!suggestionsContainer) {
    suggestionsContainer = document.createElement('div');
    suggestionsContainer.id = containerId;
    suggestionsContainer.className = [
      'suggestions-container z-[1110]',
      'rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 text-sm text-zinc-900 dark:text-zinc-100',
      'shadow-xl ring-1 ring-zinc-300/60 dark:ring-white/10',
      'max-h-56 overflow-y-auto',
      'u-d-none',
    ].join(' ');
    document.body.appendChild(suggestionsContainer);
    ['pointerdown', 'mousedown', 'click'].forEach((type) =>
      suggestionsContainer.addEventListener(type, (e) => e.stopPropagation())
    );
  }

  if (input && !suggestionsContainer.__widthSync) {
    suggestionsContainer.style.boxSizing = 'border-box';
    const applyWidth = () => {
      const w = Math.round(input.getBoundingClientRect().width || input.offsetWidth || 0);
      if (w > 0) {
        suggestionsContainer.style.width = w + 'px';
        suggestionsContainer.style.minWidth = w + 'px';
      }
    };
    applyWidth();
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(applyWidth);
      ro.observe(input);
      suggestionsContainer.__ro = ro;
    } else {
      window.addEventListener('resize', applyWidth);
    }
    suggestionsContainer.__widthSync = true;
  }
  return suggestionsContainer;
}

function showSuggestions(event, apiEndpoint, containerId, propertyName) {
  const input = event.target;
  const filterValue = input.value.trim();
  input.removeAttribute('data-selected-raw-value');
  const suggestionsContainer = getSuggestionsContainer(containerId, input);

  clearTimeout(debounceTimeout);
  if (filterValue.length < 2) {
    closeFloating(suggestionsContainer);
    return;
  }

    debounceTimeout = setTimeout(async () => {
      const makeItem = (label, raw) => {
        const d = document.createElement('div');
        d.textContent = label;
        d.className =
          'suggestion-item cursor-pointer px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10';
        d.setAttribute('data-raw-value', raw);
        d.addEventListener('click', (e) => {
          e.stopPropagation();
          input.setAttribute('data-selected-raw-value', raw);
          input.value = label;

          let labelId = propertyName;
          if (propertyName === 'code') labelId = 'code';
          if (propertyName === 'map_name') labelId = 'map name';

          const translatedMessage = t('popup.filter_applied', {
            filterId: labelId,
            value: label,
          });
          showConfirmationMessage(translatedMessage);

          closeFloating(suggestionsContainer);
          updateActiveFilters();

          input.blur();
          closeFloating(input);

          const parentId = input.getAttribute('data-parent') || '';
          const parentBtn = parentId ? document.getElementById(parentId) : null;
          if (parentBtn) {
            parentBtn.classList.remove(...String('selected').trim().split(/\s+/).filter(Boolean));
            const circle = parentBtn.querySelector('.selection-circle');
            if (circle) circle.classList.remove(...String('circle-visible').trim().split(/\s+/).filter(Boolean));
          }
        });
        return d;
      };

      // CN
      if (
        typeof CURRENT_LANG !== 'undefined' &&
        CURRENT_LANG === 'cn' &&
        apiEndpoint === 'map-names' &&
        propertyName === 'map_name'
      ) {
        try {
          await ensureMapsIndex();
        } catch (_) {}

        suggestionsContainer.innerHTML = '';
        const list = Array.isArray(__mapsIndex?.list) ? __mapsIndex.list : [];
        const qLower = filterValue.toLowerCase();
        const qNorm = __normalizeMapNameKey(filterValue);

        const matches = list
          .filter((it) => {
            const zh = String(it?.zh || '');
            const en = String(it?.en || '');
            if (!zh && !en) return false;

            if (zh.toLowerCase().includes(qLower) || en.toLowerCase().includes(qLower)) return true;
            if (!qNorm) return false;

            return (
              __normalizeMapNameKey(zh).includes(qNorm) ||
              __normalizeMapNameKey(en).includes(qNorm)
            );
          })
          .slice(0, 10);

        matches.forEach((it) => {
          const label = String(it.zh || it.en);
          const raw = String(it.en || '');
          if (!raw) return;
          suggestionsContainer.appendChild(makeItem(label, raw));
        });

        if (suggestionsContainer.children.length > 0) {
          openFloating(suggestionsContainer, input, {
            matchAnchorWidth: true,
            offset: 4,
            origin: 'top left',
            dur: 140,
          });
        } else {
          closeFloating(suggestionsContainer);
        }
        return;
      }

      const locale = CURRENT_LANG === 'cn' ? 'cn' : CURRENT_LANG === 'jp' ? 'en' : 'en';
      const url = buildAutocompleteUrl(apiEndpoint, { value: filterValue, locale, pageSize: 10 });

      try {
        const r = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!r.ok) throw new Error(`API Error: ${r.status}`);

        const data = await r.json();
        suggestionsContainer.innerHTML = '';
        if (!Array.isArray(data) || data.length === 0) {
          closeFloating(suggestionsContainer);
          return;
        }

        data.forEach((item) => {
          if (propertyName === 'code' && typeof item === 'string') {
            suggestionsContainer.appendChild(makeItem(item, item));
            return;
          }
          if (
            (propertyName === 'creator' || propertyName === 'user') &&
            Array.isArray(item) &&
            item.length >= 1
          ) {
            const id = String(item[0]);
            const label = (item[1] || '').trim();
            if (label) suggestionsContainer.appendChild(makeItem(label, id));
            return;
          }
          if (item && item[propertyName]) {
            const rawValue = item[propertyName];
            const displayName =
              item.translated_map_name ||
              (typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'cn'
                ? mapNameToCnDisplay(rawValue)
                : rawValue) ||
              rawValue;

            suggestionsContainer.appendChild(makeItem(displayName, rawValue));
          }
        });

        if (suggestionsContainer.children.length > 0) {
          openFloating(suggestionsContainer, input, {
            matchAnchorWidth: true,
            offset: 4,
            origin: 'top left',
            dur: 140,
          });
        } else {
          closeFloating(suggestionsContainer);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des suggestions :', error);
        closeFloating(suggestionsContainer);
      }
    }, 220);
}

/* =========================
   Avatars (Discord)
   ========================= */
const CREATOR_AVATAR_LS_KEY = 'creator_avatar_cache_v1';
const CREATOR_AVATAR_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const creatorAvatarCache = new Map();

(function loadCreatorAvatarCache() {
  try {
    const raw = localStorage.getItem(CREATOR_AVATAR_LS_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    const now = Date.now();
    Object.entries(obj).forEach(([id, entry]) => {
      if (entry && entry.url && entry.ts && now - entry.ts < CREATOR_AVATAR_TTL_MS) {
        creatorAvatarCache.set(String(id), entry.url);
      }
    });
  } catch {}
})();
function persistCreatorAvatarCache() {
  const now = Date.now();
  const obj = {};
  creatorAvatarCache.forEach((url, id) => {
    obj[id] = { url, ts: now };
  });
  try {
    localStorage.setItem(CREATOR_AVATAR_LS_KEY, JSON.stringify(obj));
  } catch {}
}

function ensureSize64(url) {
  if (!url) return url;
  if (!/cdn\.discordapp\.com/.test(url)) return url;
  return url.includes('?') ? `${url}&size=64` : `${url}?size=64`;
}

function defaultAvatarFromId(id) {
  const s = String(id || '0');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  const idx = h % 5;
  return `https://cdn.discordapp.com/embed/avatars/${idx}.png?size=64`;
}

async function fetchAvatarUrlForUserId(userId) {
  try {
    const res = await fetch(`/api/settings/user-avatar?user_id=${encodeURIComponent(userId)}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.avatar_url ? ensureSize64(data.avatar_url) : null;
  } catch {
    return null;
  }
}

async function resolveCreatorAvatars(ids) {
  const out = new Map();
  const need = [];

  ids.forEach((id) => {
    const key = String(id);
    if (creatorAvatarCache.has(key)) out.set(key, creatorAvatarCache.get(key));
    else need.push(key);
  });

  const CONCURRENCY = 6;
  let i = 0;
  async function worker() {
    while (i < need.length) {
      const id = need[i++];
      const url = await fetchAvatarUrlForUserId(id);
      const finalUrl = url || defaultAvatarFromId(id);
      creatorAvatarCache.set(id, finalUrl);
      out.set(id, finalUrl);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, need.length) }, worker));
  persistCreatorAvatarCache();
  return out;
}

function pickCreatorIds(row) {
  if (Array.isArray(row.creators) && row.creators.length)
    return row.creators.map((c) => String(c.id)).filter(Boolean);
  if (Array.isArray(row.creator_ids) && row.creator_ids.length) return row.creator_ids.map(String);
  if (row.creator_id) return [String(row.creator_id)];
  return [];
}
function pickCreatorNames(row) {
  if (Array.isArray(row.creators) && row.creators.length)
    return row.creators.map((c) => c.name).filter(Boolean);
  if (Array.isArray(row.creator) && row.creator.length) return row.creator.map(String);
  if (row.creator) return [String(row.creator)];
  return [];
}

/* =========================
   Avatars Lazy Load
   ========================= */
const LAZY_AVATARS = true;

let __avatarIO = null;

function initAvatarLazyLoading() {
  if (!LAZY_AVATARS || __avatarIO) return;

  if ('IntersectionObserver' in window) {
    __avatarIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const img = entry.target;
        if (entry.isIntersecting) {
          __avatarIO.unobserve(img);
          loadAvatarFor(img);
        }
      });
    }, { rootMargin: '300px 0px', threshold: 0.01 });
  } else {
    __avatarIO = {
      observe: (img) => loadAvatarFor(img),
      unobserve: () => {},
    };
  }
}

function refreshAvatarLazyLoading(root = document) {
  if (!LAZY_AVATARS) return;
  initAvatarLazyLoading();
  const imgs = root.querySelectorAll('img[data-avatar-id]');
  imgs.forEach((img) => {
    if (!img.__fbBound) {
      img.__fbBound = true;
      const fb = img.getAttribute('data-fallback-src') || defaultAvatarFromId(img.dataset.avatarId || '0');
      img.addEventListener('error', () => { if (img.src !== fb) img.src = fb; }, { once: true });
    }
    __avatarIO.observe(img);
  });
}

async function loadAvatarFor(img) {
  if (!img || img.dataset.avatarLoaded === '1') return;
  const id = String(img.dataset.avatarId || '');
  const want64 = (img.dataset.avatarSize || '64') === '64';

  let url = id ? creatorAvatarCache.get(id) : null;
  if (!url && id) {
    try {
      url = await fetchAvatarUrlForUserId(id);
    } catch {}
    url = url || defaultAvatarFromId(id);
    creatorAvatarCache.set(id, url);
    persistCreatorAvatarCache();
  }
  if (!url) url = defaultAvatarFromId(id || '0');
  if (want64) url = ensureSize64(url);

  if (img.isConnected) {
    img.src = url;
    img.dataset.avatarLoaded = '1';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initAvatarLazyLoading();
  refreshAvatarLazyLoading(document);
});

/* =========================
   INTERACTIVITY
   ========================= */
function qualityMicroBarHTML(value, max = 6) {
  if (value == null || isNaN(value)) return '<span class="text-zinc-600 dark:text-zinc-500">N/A</span>';
  const vnum = Number(value);
  const v = Math.max(0, Math.min(max, vnum));
  const percent = (v / max) * 100;
  const ratio = v / max;
  const color =
    ratio >= 0.83
      ? '#22c55e'
      : ratio >= 0.66
        ? '#84cc16'
        : ratio >= 0.5
          ? '#eab308'
          : ratio >= 0.33
            ? '#f59e0b'
            : '#ef4444';
  const label = `${(Math.round(v * 10) / 10).toFixed(1)}/${max}`;
  return `
    <div class="qmb" role="img" aria-label="Rating ${label}"
      data-anim="pending" data-target="${percent}" data-color="${color}">
      <div class="qmb-track"><div class="qmb-fill"></div></div>
      <span class="qmb-text">${label}</span>
    </div>
  `;
}

function animateQualityBars() {
  const bars = document.querySelectorAll('.qmb[data-anim="pending"]');
  bars.forEach((bar, i) => {
    const fill = bar.querySelector('.qmb-fill');
    if (!fill) return;
    const target = parseFloat(bar.dataset.target) || 0;
    const color = bar.dataset.color || '#22c55e';
    bar.classList.add(...String(__clsQmbColor(color)).trim().split(/\s+/).filter(Boolean));
    const delayCls = __clsTransDelay(Math.min(i * 30, 300));
    fill.classList.add(...String(delayCls).trim().split(/\s+/).filter(Boolean));
    requestAnimationFrame(() => {
      bar.classList.add(...String(__clsWidthPct(target)).trim().split(/\s+/).filter(Boolean));
      bar.dataset.anim = 'done';
    });
  });
}

function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderSplitFlap(text) {
  const str = String(text ?? '');
  const n = Math.max(1, str.length);
  const maxDelay = 320;
  const wrapStart = `<span class="sf">`;
  const html = [...str]
    .map((ch, i) => {
      const d = Math.round((i / (n - 1 || 1)) * maxDelay);
      const dClass = __clsSfDelay(d);
      return `<span class="sf-char ${dClass}" data-delay><span class="sf-card">${esc(ch)}</span></span>`;
    })
    .join('');
  return wrapStart + html + `</span>`;
}

function applySplitFlap(root = document) {
  root.querySelectorAll('[data-sf]').forEach((el) => {
    const value = el.getAttribute('data-sf') || el.textContent.trim();
    el.innerHTML = renderSplitFlap(value);
  });
}

function cascadeRows() {
  document.querySelectorAll('tbody tr').forEach((tr, i) => {
    tr.classList.add(...String(__clsAnimDelay(__clamp(i * 30, 0, 250))).trim().split(/\s+/).filter(Boolean), ...String('tr-sf-enter').trim().split(/\s+/).filter(Boolean));
    tr.addEventListener('animationend', () => tr.classList.remove(...String('tr-sf-enter').trim().split(/\s+/).filter(Boolean)), { once: true });
  });
}

function mountToolbarAnimation() {
  const c = document.querySelector('.toolbar-container');
  if (!c) return;
  if (!c.classList.contains('is-mounted')) {
    requestAnimationFrame(() => {
      c.classList.add(...String('is-mounted').trim().split(/\s+/).filter(Boolean));
      const btns = c.querySelectorAll('.toolbar-button');
      btns.forEach((b, i) => {
        const delay = Math.min(220, i * 35);
        b.classList.add(...String(__clsTransDelay(delay)).trim().split(/\s+/).filter(Boolean));
        requestAnimationFrame(() => b.classList.add(...String('sf-in').trim().split(/\s+/).filter(Boolean)));
      });
    });
  }
}

function refreshToolbarAnimation() {
  const c = document.querySelector('.toolbar-container');
  if (!c) return;
  c.classList.remove(...String('is-mounted').trim().split(/\s+/).filter(Boolean));
  c.querySelectorAll('.toolbar-button').forEach((b) => {
    b.classList.remove(...String('sf-in').trim().split(/\s+/).filter(Boolean));
  });
  requestAnimationFrame(mountToolbarAnimation);
}

function escAttr(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function smoothRevealTableRows(rootEl) {
  const rows = rootEl.querySelectorAll('tbody tr');
  if (!rows.length) return;
  rows.forEach((tr) => tr.classList.add(...String('gp-reveal').trim().split(/\s+/).filter(Boolean)));
  requestAnimationFrame(() => {
    rows.forEach((tr, i) => {
      const delay = __clamp(i * 18, 0, 280);
      tr.classList.add(...String(__clsTransDelay(delay)).trim().split(/\s+/).filter(Boolean), ...String('gp-reveal-show').trim().split(/\s+/).filter(Boolean));
      tr.classList.remove(...String('gp-reveal').trim().split(/\s+/).filter(Boolean));
    });
  });
}

function setResultsHTML(html) {
  const container = document.getElementById('resultsContainer');
  container.innerHTML = html;
  smoothRevealTableRows(container);
}

const loadingEl = document.getElementById('loadingContainer');

function mountLoadingBar() {
  if (!loadingEl) return;
  if (loadingEl.dataset.mounted === '1') return;

  const track = document.createElement('div');
  track.className = 'loading-track rounded-full';

  const pill = document.createElement('div');
  pill.className = 'loading-pill';

  track.appendChild(pill);
  loadingEl.appendChild(track);
  loadingEl.dataset.mounted = '1';
}

function showLoadingBar() {
  mountLoadingBar();
  requestAnimationFrame(() => {
    loadingEl.classList.add(...String('is-visible').trim().split(/\s+/).filter(Boolean));
  });
}

function hideLoadingBar() {
  if (!loadingEl) return;
  loadingEl.classList.remove(...String('is-visible').trim().split(/\s+/).filter(Boolean));
}

function openFloating(
  el,
  anchor,
  { matchAnchorWidth = false, offset = 8, origin = 'top center', dur = 160 } = {}
) {
  if (!el || !anchor) return;

  ['pointerdown', 'mousedown', 'click'].forEach((type) =>
    el.addEventListener(type, (e) => e.stopPropagation())
  );
  const align = el?.id === 'mapSearchSortOptions' ? 'right' : 'left';

  if (__isFloatingOpen(el)) {
    _ensureFloating(el, anchor, { matchAnchorWidth, place: { offset, pad: 8, align } });
    return;
  }

  el.dataset.floatOpen = '1';
  el.style.transformOrigin = origin;

  el.classList.remove(...String('invisible').trim().split(/\s+/).filter(Boolean), ...String('u-invisible').trim().split(/\s+/).filter(Boolean));
  el.style.visibility = 'visible';

  el.style.transition = 'none';
  el.style.opacity = 0;
  el.style.transform = 'translateY(4px) scale(0.98)';

  _ensureFloating(el, anchor, { matchAnchorWidth, place: { offset, pad: 8, align } });
  el.classList.remove(...String('u-d-none').trim().split(/\s+/).filter(Boolean));
  el.classList.add(...String('u-d-block').trim().split(/\s+/).filter(Boolean));

  requestAnimationFrame(() => {
    el.style.transition = `opacity ${dur}ms ease-out, transform ${dur}ms ease-out`;
    el.style.opacity = 1;
    el.style.transform = 'translateY(0) scale(1)';
  });
}

function closeFloating(el, { dur = 120 } = {}) {
  if (!el) return;
  if (el.classList.contains('u-d-none')) return;

  el.dataset.floatOpen = '0';

  el.style.transition = `opacity ${dur}ms ease-in, transform ${dur}ms ease-in`;
  el.style.opacity = 0;
  el.style.transform = 'translateY(4px) scale(0.98)';

  const done = () => {
    el.classList.remove(...String('u-d-block').trim().split(/\s+/).filter(Boolean));
    el.classList.add(...String('u-d-none').trim().split(/\s+/).filter(Boolean));
    el.style.transition = '';
    el.style.opacity = '';
    el.style.transform = '';
    el.style.transformOrigin = '';
    _hideFloating(el);
    el.removeEventListener('transitionend', done);
  };
  el.addEventListener('transitionend', done, { once: true });
}

const openInputAnimated = (input, anchor) =>
  openFloating(input, anchor, { matchAnchorWidth: true, offset: 6, origin: 'top left', dur: 180 });
const openDropdownAnimated = (el, anchor) =>
  openFloating(el, anchor, { matchAnchorWidth: false, offset: 6, origin: 'top center', dur: 150 });

function __isFloatingOpen(el) {
  return el && el.classList.contains('u-d-block') && el.dataset.floatOpen === '1';
}

/* =========================
   Data helpers
   ========================= */
function getTypesArray(row) {
  const raw = row.category ?? row.map_type ?? null;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return list.map((type) => {
    const key = String(type)
      .toLowerCase()
      .replace(/[ ()']/g, '_');
    const tr = t(`map_type.${key}`);
    return typeof tr === 'string' && !tr.includes('map_type.') ? tr : String(type);
  });
}

function normalizeDifficulty(difficulty) {
  if (!difficulty) return '';
  return difficulty.replace(/\s*[+-]$/, '').trim();
}

function normalizeToRowsContainer(data) {
  if (Array.isArray(data)) return { results: data };
  if (Array.isArray(data?.results)) return data;
  if (data && typeof data === 'object') return { results: [data] };
  return { results: [] };
}

function normalizeToRows(data /*, kind */) {
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && (data.code || data.map_name || data.id)) return [data];
  return [];
}

/* =========================
   RENDER MAP SEARCH
   ========================= */
// ================== CARDS DISPLAY ============== //
async function displayMapSearchResultsCards(rowsInput) {
  const rows = Array.isArray(rowsInput) ? rowsInput : normalizeToRows(rowsInput, 'map');
  const filtered = rows.filter((r) => r && r.map_name && r.map_name !== 'N/A');

  if (filtered.length === 0) {
    const message = t('popup.no_results');
    renderMessage(message);
    const rc = document.getElementById('resultsContainer');
    if (rc) {
      rc.innerHTML = `
        <div class="mt-4 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 px-4 py-6 text-center text-sm text-zinc-700 dark:text-zinc-300">
          ${message}
        </div>
      `;
    }
    return;
  }

  const diffSlug = (d='') => {
    const L = String(d).toLowerCase();
    if (L.startsWith('very hard')) return 'veryhard';
    if (L.startsWith('extreme'))   return 'extreme';
    if (L.startsWith('hell'))      return 'hell';
    if (L.startsWith('hard'))      return 'hard';
    if (L.startsWith('medium'))    return 'medium';
    return 'easy';
  };

  const cardsHTML = filtered.map((r, idx) => {
    const types   = getTypesArray(r);
    const mapType = types.length ? types.join(', ') : 'N/A';

    const names = pickCreatorNames(r);
    const ids   = pickCreatorIds(r);
    if (names.length === 1 && ids.length === 0 && r.user_id) ids.push(String(r.user_id));

    const firstName  = names[0] || 'N/A';
    const firstId    = ids[0];
    const authorHref = firstId ? `rank_card?user_id=${encodeURIComponent(firstId)}` : '#';

    const creatorsAvatars = names.slice(0,3).map((name, i) => {
      const id = ids[i];
      const fallback = defaultAvatarFromId(id || name);
      const profileHref = id ? `rank_card?user_id=${encodeURIComponent(id)}` : '#';
      return `<a href="${escAttr(profileHref)}" title="${escAttr(name)}">
                <img class="mx-avatar" src="${escAttr(fallback)}" alt="" loading="lazy" decoding="async"
                     referrerpolicy="no-referrer" data-avatar-id="${escAttr(id || '')}" data-avatar-size="64"
                     data-fallback-src="${escAttr(fallback)}" />
              </a>`;
    }).join('');

    const code = r.code || 'N/A';
    const hasNonNullTime = r.time != null && String(r.time).trim().toLowerCase() !== 'null';
    const hasCheck = Boolean(user_id) && (r.user_has_completion || r.user_has_record || r.user_completed || hasNonNullTime);

    const diff    = r.difficulty || 'N/A';
    const diffCls = `mx-d-${diffSlug(diff)}`;

    const mapName     = r.original_map_name || r.map_name || 'N/A';
    const mapNameKey = (r.original_map_name || r.map_name || 'default')
      .toLowerCase()
      .replace(/[()\s':]/g, '');
    const bannerPath  = cdnImage(`assets/map_banners/${mapNameKey}.png`);
    const bannerFB    = cdnImage(`assets/map_banners/${mapNameKey}.png`);
    const checkpoints = (r.checkpoints != null && r.checkpoints !== 'N/A') ? String(r.checkpoints) : '';

    const medalClass =
      user_id && r.medal_type === 'Gold'   ? 'mx-card--gold'   :
      user_id && r.medal_type === 'Silver' ? 'mx-card--silver' :
      user_id && r.medal_type === 'Bronze' ? 'mx-card--bronze' : '';

    return `
      <article class="mx-card is-in ${diffCls} ${medalClass}">
        <div class="mx-hero">
          <div class="mx-skel"></div>
          <img src="${escAttr(bannerPath)}" alt="" data-fallback-src="${escAttr(bannerFB)}" />
          <div class="mx-grain"></div>

          <div class="mx-titlebar">
            <div class="mx-head">
              <h3 class="mx-title">${esc(mapName)}</h3>
              <span class="mx-status ${hasCheck ? 'ok' : ''}">
                <i class="mx-dot"></i>${hasCheck ? esc(t('card.completed')) : esc(t('card.not_completed'))}
              </span>
            </div>

            <div class="mx-meta">
              ${checkpoints ? `
                <span class="mx-meta-item" title="${escAttr(t('thead.mapCheckpoints'))}">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 3a1 1 0 0 0-1 1v16l7-3 7 3V4a1 1 0 0 0-1-1H5z"/></svg>
                  <span>${esc(checkpoints)}</span>
                  ${mapType && mapType !== 'N/A' ? `<span class="sep">•</span><span>${esc(mapType)}</span>` : ''}
                </span>
              ` : ''}
            </div>
          </div>

          <div class="mx-actions-vert">
            <button type="button"
                    class="mx-icon cursor-pointer"
                    data-role="like-button"
                    title="${escAttr(t('card.like'))}">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M12 21s-6.716-4.534-9.193-7.01A5.5 5.5 0 1 1 12 6.07a5.5 5.5 0 1 1 9.193 7.92C18.716 16.466 12 21 12 21z"/>
              </svg>
            </button>

            <button type="button" class="mx-icon mx-icon--primary js-open-map-details cursor-pointer"
                    data-index="${idx}" title="${escAttr(t('thead.mapView'))}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
          </div>

          <div class="mx-bottom">
            <div class="mx-b-left">
              ${creatorsAvatars}
              <span>${esc(t('card.mapped_by'))}: </span>
              <a href="${escAttr(authorHref)}">${esc(firstName)}</a>
            </div>

            <div class="mx-b-right">
              ${code && code !== 'N/A' ? `
                <button type="button" class="mx-code-inline copy-map-code" data-code="${escAttr(code)}"
                        aria-label="${escAttr(t('popup.copy_map_code'))}" title="${escAttr(t('popup.copy_map_code'))}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                    <rect x="3" y="3" width="13" height="13" rx="2"></rect>
                  </svg>
                  <span data-sf="${escAttr(code)}"></span>
                </button>
              ` : `<span class="mx-code-inline">N/A</span>`}

              <div class="mx-diff" title="${escAttr(t('thead.mapDifficulty'))}">
                <span>${esc(diff)}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  const shell = `
    <section class="mx-wrap">
      <div class="mx-grid mx-stagger">
        ${cardsHTML}
      </div>
    </section>
  `;
  setResultsHTML(shell);

  const resultsRoot = document.getElementById('resultsContainer');

  refreshAvatarLazyLoading(resultsRoot);
  applySplitFlap(resultsRoot);

  if (typeof registerMapCodeCopyTargets === 'function') {
    registerMapCodeCopyTargets(resultsRoot);
  } else if (resultsRoot && resultsRoot.dataset.copyDelegated !== '1') {
    resultsRoot.dataset.copyDelegated = '1';
    resultsRoot.addEventListener('click', (e) => {
      const btn = e.target.closest('.copy-map-code'); if (!btn) return;
      e.preventDefault();
      const code = btn.getAttribute('data-code') || btn.textContent.trim();
      if (code && code !== 'N/A') copyMapCode(code);
    });
    resultsRoot.addEventListener('keydown', (e) => {
      const btn = e.target.closest('.copy-map-code'); if (!btn) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const code = btn.getAttribute('data-code') || btn.textContent.trim();
        if (code && code !== 'N/A') copyMapCode(code);
      }
    });
  }

  resultsRoot.querySelectorAll('.mx-hero').forEach((hero) => {
    const img = hero.querySelector('img'); if (!img) return;
    const fb = img.getAttribute('data-fallback-src');
    if (img.complete && img.naturalWidth > 0) hero.classList.remove(...String('is-loading').trim().split(/\s+/).filter(Boolean));
    else img.addEventListener('load', () => hero.classList.remove(...String('is-loading').trim().split(/\s+/).filter(Boolean)), { once:true });
    img.addEventListener('error', () => { if (fb && img.src !== fb) img.src = fb; }, { once:true });
  });

  ensureSearchDetailsModal();
  resultsRoot.querySelectorAll('.js-open-map-details').forEach((btn) =>
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-index'));
      openSearchDetailsModal(filtered[idx]);
    })
  );

  }
// ================== TABLE DISPLAY ============== //
async function displayMapSearchResultsTable(rowsInput) {
  const rows = Array.isArray(rowsInput) ? rowsInput : normalizeToRows(rowsInput, 'map');
  const filtered = rows.filter((r) => r && r.map_name && r.map_name !== 'N/A');

  if (filtered.length === 0) {
    const message = t('popup.no_results');
    renderMessage(message);
    const rc = document.getElementById('resultsContainer');
    if (rc) {
      rc.innerHTML = `
        <div class="mt-4 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 px-4 py-6 text-center text-sm text-zinc-700 dark:text-zinc-300">
          ${message}
        </div>
      `;
    }
    return;
  }

  const safeHex = (c) => (/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(c)) ? c : '#ffffff');
  const starsHTML = (quality, max = 6) => {
    if (quality == null || isNaN(Number(quality))) return 'N/A';
    const q = Math.max(0, Math.min(max, Math.floor(Number(quality))));
    return `<span class="tracking-tight">${'★'.repeat(q)}${'☆'.repeat(max - q)}</span>`;
  };

  const headerHTML = `
    <div class="sticky top-0 z-10 bg-white/95 dark:bg-zinc-900/95 text-zinc-700 dark:text-zinc-300 font-semibold grid grid-map_search px-3 py-2">
      <div class="whitespace-nowrap">${t('thead.mapCode')}</div>
      <div class="whitespace-nowrap">${t('thead.mapName')}</div>
      <div class="whitespace-nowrap">${t('thead.mapType')}</div>
      <div class="whitespace-nowrap">${t('thead.mapCreator')}</div>
      <div class="whitespace-nowrap">${t('thead.mapDifficulty')}</div>
      <div class="whitespace-nowrap">${t('thead.mapQuality')}</div>
      <div class="whitespace-nowrap">${t('thead.mapDetails')}</div>
    </div>
  `;

  const rowsHTML = filtered.map((r, idx) => {
    const ringColor =
      user_id && r.medal_type === 'Gold'   ? 'after:ring-yellow-400/40' :
      user_id && r.medal_type === 'Silver' ? 'after:ring-zinc-200/30'  :
      user_id && r.medal_type === 'Bronze' ? 'after:ring-amber-600/40' : '';
    const halo = ringColor
      ? `relative after:content-[''] after:absolute after:inset-x-2 after:inset-y-0.5 after:rounded-lg after:ring-2 after:pointer-events-none after:z-0 ${ringColor}`
      : 'relative';

    const diffColor = safeHex(difficultyColors[normalizeDifficulty(r.difficulty)] || '#ffffff');

    const types = getTypesArray(r);
    const mapType = types.length ? types.join(', ') : 'N/A';

    const names = pickCreatorNames(r);
    const ids   = pickCreatorIds(r);
    if (names.length === 1 && ids.length === 0 && r.user_id) ids.push(String(r.user_id));

    const creatorsHTML = names.map((name, i) => {
      const id = ids[i];
      const fallback = defaultAvatarFromId(id || name);
      const profileHref = id ? `rank_card?user_id=${encodeURIComponent(id)}` : '#';
      return `
        <a href="${escAttr(profileHref)}"
          class="inline-flex items-center gap-2 rounded-md hover:bg-zinc-100 dark:hover:bg-white/10 px-1.5 py-0.5"
          title="${escAttr(name)}">
          <img
            src="${escAttr(fallback)}"
            alt=""
            class="h-6 w-6 rounded-full object-cover ring-1 ring-zinc-300/60 dark:ring-white/10 bg-zinc-100 dark:bg-zinc-800"
            loading="lazy" decoding="async" referrerpolicy="no-referrer"
            data-avatar-id="${escAttr(id || '')}" data-avatar-size="64"
            data-fallback-src="${escAttr(fallback)}"
          />
          <span data-sf="${escAttr(name)}"></span>
        </a>`;
    }).join('');

    const code = r.code || 'N/A';
    const hasNonNullTime = r.time != null && String(r.time).trim().toLowerCase() !== 'null';
    const hasCheck = Boolean(user_id) && (r.user_has_completion || r.user_has_record || r.user_completed || hasNonNullTime);
    const ratingValue = r.ratings != null ? r.ratings : r.quality;

    const codeChip = code !== 'N/A'
      ? `
        <button type="button"
                class="copy-map-code group relative z-10 inline-flex items-center gap-1 rounded-md border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 px-2 py-0.5
                       text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-white/85 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 cursor-pointer
                       w-full min-w-0"
                data-code="${escAttr(code)}"
                aria-label="${escAttr(t('popup.copy_map_code'))}"
                title="${escAttr(t('popup.copy_map_code'))}">
          <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2"></rect>
            <rect x="3" y="3" width="13" height="13" rx="2"></rect>
          </svg>
          <span class="min-w-0 truncate" data-sf="${escAttr(code)}"></span>
          ${hasCheck ? '<span class="ml-auto text-emerald-400 shrink-0">✓</span>' : ''}
        </button>`
      : `<span data-sf="N/A"></span>`;

    return `
      <div class="${halo} grid grid-map_search bg-white/70 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-white/10 transition px-3 py-2">
        <div class="min-w-0">${codeChip}</div>
        <div class="min-w-0"><span class="gp-td-mapname truncate block" data-sf="${escAttr(r.map_name || 'N/A')}"></span></div>
        <div class="min-w-0"><span class="truncate block" data-sf="${escAttr(mapType)}"></span></div>
        <div class="min-w-0 -ml-1 flex flex-wrap items-center gap-2">${creatorsHTML || 'N/A'}</div>
        <div class="min-w-0"><span class="${__clsTextColor(diffColor)}"><span data-sf="${escAttr(r.difficulty || 'N/A')}">${esc(r.difficulty || 'N/A')}</span></span></div>
        <div class="min-w-0">${qualityMicroBarHTML(ratingValue)}</div>
        <div class="min-w-0">
          <button
            type="button"
            class="js-open-map-details inline-flex items-center gap-2 rounded-md border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 px-2.5 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer"
            data-index="${idx}">
            ${esc(t('thead.mapView'))}
          </button>
        </div>
      </div>`;
  }).join('');

  const shell = `
    <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 gp-wrap">
      <div class="results-xscroll" tabindex="0">
        <div class="minw-map_search">
          ${headerHTML}
          <div class="row-gap-y">
            ${rowsHTML}
          </div>
        </div>
      </div>
    </div>
  `;

  setResultsHTML(shell);
  refreshAvatarLazyLoading(document.getElementById('resultsContainer'));

  const resultsRoot = document.getElementById('resultsContainer');
  applySplitFlap(resultsRoot);

  if (typeof registerMapCodeCopyTargets === 'function') {
    registerMapCodeCopyTargets(resultsRoot);
  } else if (resultsRoot && resultsRoot.dataset.copyDelegated !== '1') {
    resultsRoot.dataset.copyDelegated = '1';
    resultsRoot.addEventListener('click', (e) => {
      const btn = e.target.closest('.copy-map-code'); if (!btn) return;
      e.preventDefault();
      const code = btn.getAttribute('data-code') || btn.textContent.trim();
      if (code && code !== 'N/A') copyMapCode(code);
    });
    resultsRoot.addEventListener('keydown', (e) => {
      const btn = e.target.closest('.copy-map-code'); if (!btn) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const code = btn.getAttribute('data-code') || btn.textContent.trim();
        if (code && code !== 'N/A') copyMapCode(code);
      }
    });
  }

  resultsRoot.querySelectorAll('img[data-fallback-src]').forEach((img) => {
    const fallback = img.getAttribute('data-fallback-src');
    img.addEventListener('error', () => { if (img.src !== fallback) img.src = fallback; }, { once: true });
  });

  ensureSearchDetailsModal();
  resultsRoot.querySelectorAll('.js-open-map-details').forEach((btn) =>
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-index'));
      openSearchDetailsModal(filtered[idx]);
    })
  );

  animateQualityBars();
}

/* =========================
   RENDER MAP SEARCH MODAL
   ========================= */
function ensureSearchDetailsModal() {
  let overlay = document.getElementById('detailsModalOverlay');
  if (overlay && !overlay.querySelector('#mapCode')) {
    overlay.remove();
    overlay = null;
  }

  if (!overlay) {
    const tpl = document.createElement('div');
    tpl.innerHTML = `
    <div id="detailsModalOverlay"
         class="fixed inset-0 z-[90] hidden items-center justify-center bg-black/70 backdrop-blur-sm opacity-0 transition-opacity duration-200"
         role="dialog" aria-modal="true" aria-labelledby="mapModalTitle">
      <!-- Gradient border wrapper (no inline CSS) -->
      <div class="mx-4 w-[min(96vw,1080px)] max-h-[calc(100dvh-2rem)] p-px rounded-3xl bg-gradient-to-tr from-white/25 via-indigo-400/30 ring-1 ring-zinc-300/60 dark:ring-white/10 translate-y-3 opacity-0 transition-all duration-200">
        <div id="detailsModalBox"
             class="relative min-h-0 sm:min-h-[640px] max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden rounded-3xl bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 shadow-2xl ring-1 ring-zinc-300/60 dark:ring-white/10">

          <!-- Header / Cover -->
          <div class="relative h-56 w-full overflow-hidden rounded-t-3xl">
            <img id="mapModalCover" alt="" class="absolute inset-0 block h-full w-full min-w-full max-w-none object-cover opacity-80">
            <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-zinc-900/80"></div>

            <!-- Top actions -->
            <div class="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
              <span id="mapCompleted"
                    class="inline-flex items-center gap-2 rounded-full bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 px-3 py-1 text-sm font-medium text-zinc-900 dark:text-white/80 ring-1 ring-zinc-300/60 dark:ring-white/15">
                <span class="h-2 w-2 rounded-full bg-white/60"></span>
                ${t('card.completed')}
              </span>

              <div class="flex items-center gap-2">
                <!-- Change requests -->
                <button type="button" id="btnOpenMapEditRequest"
                  class="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-white/85 ring-1 ring-zinc-300/60 dark:ring-white/15 hover:bg-white/85 dark:bg-zinc-900/7 dark:bg-white/15 hover:text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/60">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-zinc-900 dark:text-white/80 group-hover:text-zinc-900 dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20h9"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
                  </svg>
                  <span id="btnOpenMapEditRequestText">${t('map_edit_request.title')}</span>
                </button>

                <!-- Close -->
                <button type="button" id="modalCloseBtn"
                  class="group inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-xl bg-zinc-900/7 dark:bg-black/40 ring-1 ring-zinc-300/60 dark:ring-white/15 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  aria-label="${t('popup.close')}">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-zinc-900 dark:text-white/85 group-hover:text-zinc-900 dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="grid gap-4 p-4 sm:gap-6 sm:p-6 md:grid-cols-12">
            <!-- Left -->
            <div class="md:col-span-7 min-w-0 space-y-6">
              <!-- Code + Copy + Guide -->
              <div class="rounded-2xl bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <div class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60">${t('thead.mapCode')}</div>
                  <div id="mapCode" class="mt-1 font-mono text-lg">—</div>
                </div>
                <div class="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:justify-start">
                  <!-- Guide button -->
                  <button id="btnGuide"
                          type="button"
                          class="hidden inline-flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm font-semibold
                              bg-indigo-100 text-indigo-900 ring-1 ring-indigo-300
                              hover:bg-indigo-200 hover:text-indigo-950
                              focus:outline-none focus:ring-2 focus:ring-indigo-500/40
                              dark:bg-indigo-500/15 dark:text-indigo-200 dark:ring-indigo-400/40
                              dark:hover:bg-indigo-500/25 dark:hover:text-indigo-100
                              dark:focus:ring-indigo-400/60
                              transition-colors duration-150"
                          aria-disabled="true">
                    <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M4 19.5V6a2 2 0 0 1 2-2h9.5A2.5 2.5 0 0 1 18 6.5V18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M4 8h10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M8 22l3-3-3-3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    ${t('guides') || 'Guides'}
                  </button>

                  <button id="btnCopyCode"
                          title="${t('popup.copy_map_code')}"
                          class="inline-flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm font-semibold
                              bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300
                              hover:bg-emerald-200 hover:text-emerald-950
                              focus:outline-none focus:ring-2 focus:ring-emerald-500/40
                              dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30
                              dark:hover:bg-emerald-500/20 dark:hover:text-emerald-200
                              dark:focus:ring-emerald-400/60
                              transition-colors duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    ${t('popup.copy_map_code')}
                  </button>
                </div>
              </div>

              <!-- Linked official/unofficial code -->
              <div id="linkedCodeContainer"
                  class="mt-3 hidden rounded-2xl bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 p-4 flex items-center justify-between gap-4">
                <div>
                  <div id="linkedCodeLabel" class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60">
                  </div>
                  <div id="linkedCode" class="mt-1 font-mono text-sm text-zinc-900 dark:text-white/90">—</div>
                </div>
                <button id="btnCopyLinkedCode"
                        title="${t('popup.copy_map_code')}"
                        class="inline-flex cursor-pointer items-center rounded-xl bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-500/30 hover:bg-emerald-500/20 hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/60">
                  <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  ${t('popup.copy_map_code')}
                </button>
              </div>

              <!-- Medals -->
              <div class="rounded-2xl bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 p-4">
                <div class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60">${t('thead.mapMedal')}</div>
                <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div class="rounded-xl p-3 ring-1 bg-yellow-500/10 ring-yellow-400/30">
                    <div class="text-xs text-zinc-900 dark:text-white/70">${t('thead.mapGold')}</div>
                    <div id="mapGold" class="text-lg font-semibold">—</div>
                  </div>
                  <div class="rounded-xl p-3 ring-1 bg-slate-300/10 ring-slate-300/30">
                    <div class="text-xs text-zinc-900 dark:text-white/70">${t('thead.mapSilver')}</div>
                    <div id="mapSilver" class="text-lg font-semibold">—</div>
                  </div>
                  <div class="rounded-xl p-3 ring-1 bg-amber-700/10 ring-amber-600/30">
                    <div class="text-xs text-zinc-900 dark:text-white/70">${t('thead.mapBronze')}</div>
                    <div id="mapBronze" class="text-lg font-semibold">—</div>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="rounded-2xl bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 p-4">
                <div class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60">${t('thead.mapDescription')}</div>
                <p id="mapDescription" class="mt-2 leading-relaxed text-zinc-900 dark:text-white/85">—</p>
              </div>

              <!-- Mechanics / Restrictions -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="rounded-2xl bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 p-4">
                  <div class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60">${t('thead.mapMechanics')}</div>
                  <div id="mapMechanics" class="mt-2 flex flex-wrap gap-2"></div>
                </div>
                <div class="rounded-2xl bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 p-4">
                  <div class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60">${t('thead.mapRestrictions')}</div>
                  <div id="mapRestrictions" class="mt-2 flex flex-wrap gap-2"></div>
                </div>
                <div class="sm:col-span-2 rounded-2xl bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 p-4">
                  <div class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60">${(typeof t==='function' ? (t('thead.mapTags') || t('filters_toolbar.tags') || 'Tags') : 'Tags')}</div>
                  <div id="mapTags" class="mt-2 flex flex-wrap gap-2"></div>
                </div>
              </div>
            </div>

            <!-- Right -->
            <div class="md:col-span-5 min-w-0 space-y-6">
              <div class="rounded-2xl bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 p-4">
                <div class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60">${t('thead.mapDetails')}</div>
                <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                  <dt class="text-xs text-zinc-900 dark:text-white/60">${t('thead.mapCreator')}</dt><dd id="mapCreator" class="min-w-0 break-words text-sm font-medium text-zinc-900 dark:text-white/90">—</dd>
                  <dt class="text-xs text-zinc-900 dark:text-white/60">${t('thead.mapCheckpoints')}</dt><dd id="mapCheckpoints" class="text-sm font-medium text-zinc-900 dark:text-white/90">—</dd>
                  <dt class="text-xs text-zinc-900 dark:text-white/60">${t('thead.mapUpvotes')}</dt><dd id="mapUpvotes" class="text-sm font-medium text-zinc-900 dark:text-white/90">—</dd>
                  <dt class="text-xs text-zinc-900 dark:text-white/60">${t('thead.mapType')}</dt><dd id="mapTypeDetail" class="text-sm font-medium text-zinc-900 dark:text-white/90">—</dd>
                  <dt class="text-xs text-zinc-900 dark:text-white/60">${t('thead.mapDifficulty')}</dt><dd id="mapDiffDetail" class="text-sm font-medium text-zinc-900 dark:text-white/90">—</dd>
                  <dt class="text-xs text-zinc-900 dark:text-white/60">${t('thead.mapStatus', 'Status')}</dt>
                  <dd id="mapStatus" class="text-sm font-medium text-zinc-900 dark:text-white/90">—</dd>
                  <dt class="text-xs text-zinc-900 dark:text-white/60">${t('thead.mapQuality')}</dt><dd id="mapQualityDetail" class="text-sm font-medium text-zinc-900 dark:text-white/90">—</dd>
                </dl>
              </div>

              <div class="rounded-2xl bg-gradient-to-b from-white/5 to-white/0 ring-1 ring-zinc-300/60 dark:ring-white/10 p-4">
                <div class="flex items-center justify-between">
                  <div class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60">${t('chart.record_progression_time')}</div>
                </div>
                <div id="chartContainer" class="mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
    document.body.appendChild(tpl.firstElementChild);
    overlay = document.getElementById('detailsModalOverlay');
  }

  if (!overlay.__copyBound) {
    overlay.__copyBound = true;

    const tFmt = (key, params = {}, fallback = '') => {
      let s = typeof t === 'function' ? t(key, params) : null;
      if (typeof s !== 'string' || s === key) s = fallback || key;
      return s.replace(/\{(\w+)\}/g, (_, p) => (params[p] != null ? params[p] : ''));
    };

    const getCode = () => (document.getElementById('mapCode')?.textContent || '').trim();

    const setBtnState = () => {
      const btn = document.getElementById('btnCopyCode');
      if (!btn) return;
      const code = getCode();
      const ok = !!code && code !== '—' && code !== 'N/A';
      btn.disabled = !ok;
      btn.setAttribute('aria-disabled', ok ? 'false' : 'true');
      btn.title = ok
        ? tFmt('popup.copy_map_code', {}, 'Copy map code')
        : tFmt('popup.map_code_required', {}, 'Enter a map code');
    };

    const getLinkedCode = () => (document.getElementById('linkedCode')?.textContent || '').trim();

    const setLinkedBtnState = () => {
      const btn = document.getElementById('btnCopyLinkedCode');
      if (!btn) return;
      const code = getLinkedCode();
      const ok = !!code && code !== '—' && code !== 'N/A';
      btn.disabled = !ok;
      btn.setAttribute('aria-disabled', ok ? 'false' : 'true');
      btn.title = ok
        ? tFmt('popup.copy_map_code', {}, 'Copy map code')
        : tFmt('popup.map_code_required', {}, 'Enter a map code');
    };

    const codeEl = document.getElementById('mapCode');
    if (window.MutationObserver && codeEl) {
      const mo = new MutationObserver(setBtnState);
      mo.observe(codeEl, { childList: true, subtree: true, characterData: true });
    }
    setBtnState();

    const linkedCodeEl = document.getElementById('linkedCode');
    if (window.MutationObserver && linkedCodeEl) {
      const mo2 = new MutationObserver(setLinkedBtnState);
      mo2.observe(linkedCodeEl, { childList: true, subtree: true, characterData: true });
    }
    setLinkedBtnState();

    const doCopy = async (code) => {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
        return;
      }
      const ta = document.createElement('textarea');
      ta.value = code;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    };

    let inFlight = false;

    const handleActivate = async (ev) => {
      const btnGuide = ev.target.closest('#btnGuide');
      if (btnGuide) {
        const href = btnGuide.getAttribute('data-href');
        if (href) {
          ev.preventDefault();
          ev.stopPropagation();
          window.open(href, '_blank', 'noopener,noreferrer');
        }
        return;
      }

      const btnMain   = ev.target.closest('#btnCopyCode');
      const btnLinked = ev.target.closest('#btnCopyLinkedCode');
      if (!btnMain && !btnLinked) return;

      ev.preventDefault();
      ev.stopPropagation();

      if (inFlight) return;
      inFlight = true;

      const code = btnLinked ? getLinkedCode() : getCode();
      if (!code || code === '—' || code === 'N/A') {
        if (typeof showWarningMessage === 'function') {
          showWarningMessage(tFmt('popup.map_code_required', {}, 'Enter a map code'));
        }
        inFlight = false;
        return;
      }

      try {
        await doCopy(code);

        if (typeof showConfirmationMessage === 'function') {
          showConfirmationMessage(
            tFmt('popup.map_code_copied', { code }, `Map code ${code} copied`)
          );
          void logMapCopy(code, 'web');
        }
      } catch {
        if (typeof showWarningMessage === 'function') {
          showWarningMessage(tFmt('popup.copy_failed', {}, 'Failed to copy map code'));
        }
      } finally {
        inFlight = false;
      }
    };

    overlay.addEventListener('click', handleActivate);
  }
}

/* =========================
   MAP EDIT REQUEST MODAL
   ========================= */
function ensureMapEditRequestModal() {
  if (document.getElementById('mapEditRequestOverlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'mapEditRequestOverlay';
  overlay.className =
  'fixed inset-0 z-[110] hidden items-center justify-center bg-black/70 backdrop-blur-sm p-6 sm:p-8';

  const title =
    (typeof t === 'function' && t('map_edit_request.title') && t('map_edit_request.title') !== 'map_edit_request.title')
      ? t('map_edit_request.title')
      : 'Map edit request';

  const subtitle =
    (typeof t === 'function' && t('map_edit_request.subtitle') && t('map_edit_request.subtitle') !== 'map_edit_request.subtitle')
      ? t('map_edit_request.subtitle')
      : 'Propose changes to a map';

  const reasonLabel =
    (typeof t === 'function' && t('map_edit_request.reason') && t('map_edit_request.reason') !== 'map_edit_request.reason')
      ? t('map_edit_request.reason')
      : 'Reason';

  const sendLabel =
    (typeof t === 'function' && t('map_edit_request.send') && t('map_edit_request.send') !== 'map_edit_request.send')
      ? t('map_edit_request.send')
      : 'Send map edit request';

  const closeLabel =
    (typeof t === 'function' && t('common.close') && t('common.close') !== 'common.close')
      ? t('common.close')
      : 'Close';

  overlay.innerHTML = `
    <div data-mer-box class="mx-4 flex w-[min(96vw,1100px)] max-h-full flex-col overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950/70 shadow-2xl ring-1 ring-zinc-300/60 dark:ring-white/10">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 border-b border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 px-5 py-4">
        <div class="min-w-0">
          <div class="text-lg font-semibold text-zinc-900 dark:text-white">${__merEsc(title)}</div>
          <div class="mt-0.5 text-sm text-zinc-700 dark:text-zinc-300">${__merEsc(subtitle)}</div>
        </div>

        <button type="button" data-mer-close
          class="inline-flex cursor-pointer items-center justify-center rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 p-2 text-zinc-900 dark:text-white/80 hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/60">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto px-5 py-5 space-y-6">
        <div id="merLoginNotice" class="hidden rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"></div>

        <!-- Request -->
        <div class="relative rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 p-4 space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 px-3 py-2">
              <div class="text-[11px] text-zinc-600 dark:text-zinc-400">${__merEsc(typeof t === 'function' ? (t('map_edit_request.code') || 'Code') : 'Code')}</div>
              <div id="merCode"
                class="mt-1 w-full select-none pointer-events-none cursor-default rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100">N/A</div>
            </div>

            <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 px-3 py-2">
              <div class="text-[11px] text-zinc-600 dark:text-zinc-400">${__merEsc(typeof t === 'function' ? (t('map_edit_request.created_by') || 'Created by') : 'Created by')}</div>
              <div id="merCreatedBy"
                class="mt-1 w-full select-none pointer-events-none cursor-default rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100">N/A</div>
            </div>

            <div class="sm:col-span-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 px-3 py-2">
              <div class="text-[11px] text-zinc-600 dark:text-zinc-400">${__merEsc(reasonLabel)}</div>
              <textarea id="merReason" rows="3"
                class="mt-1 w-full resize-y rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                placeholder="${__merEsc(typeof t === 'function' ? (t('map_edit_request.reason_placeholder') || 'Explain why you want to change this map…') : 'Explain why you want to change this map…')}"></textarea>
            </div>
          </div>
        </div>

        <!-- Proposed changes -->
        <div class="space-y-6">
          <div class="flex items-center justify-between gap-3">
            <div class="text-sm font-semibold text-zinc-900 dark:text-white/90">
              ${__merEsc(typeof t === 'function' ? (t('map_edit_request.proposed_changes') || 'Proposed changes') : 'Proposed changes')}
            </div>
            <div class="text-xs text-zinc-600 dark:text-zinc-400">
              ${__merEsc(typeof t === 'function' ? (t('map_edit_request.proposed_hint') || 'Only changed fields will be sent') : 'Only changed fields will be sent')}
            </div>
          </div>

          <!-- META (submitMapForm-like) -->
          <div class="relative rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 p-4 pt-card-anim pt-in">
            <div class="mb-4 flex flex-wrap items-center gap-3">

              <div id="merArchivedSwitch" class="inline-flex rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 p-1 relative" data-value="0">
                <span id="merArchivedSwitchHighlight" aria-hidden="true"></span>
                <button type="button" data-switch="archived" data-value="0"
                  class="mer-switch-btn cursor-pointer rounded-lg px-3 py-1.5 text-sm font-semibold relative z-1">
                  ${__merEsc(typeof t === 'function' ? (t('map_edit_request.active') || 'Active') : 'Active')}
                </button>
                <button type="button" data-switch="archived" data-value="1"
                  class="mer-switch-btn cursor-pointer rounded-lg px-3 py-1.5 text-sm font-semibold relative z-1">
                  ${__merEsc(typeof t === 'function' ? (t('map_edit_request.archived') || 'Archived') : 'Archived')}
                </button>
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 px-3 py-2">
                <div class="text-[11px] text-zinc-600 dark:text-zinc-400">${__merEsc(typeof t === 'function' ? (t('map_edit_request.new_code') || 'New code') : 'New code')}</div>
                <input id="merNewCode" type="text" inputmode="text" autocomplete="off"
                  class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                  placeholder="${__merEsc(typeof t === 'function' ? (t('map_edit_request.new_code_placeholder') || 'Leave empty to keep current') : 'Leave empty to keep current')}" />
              </div>

              <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 px-3 py-2">
                <div class="text-[11px] text-zinc-600 dark:text-zinc-400">${__merEsc(typeof t === 'function' ? (t('map_edit_request.map_name') || 'Map name') : 'Map name')}</div>
                <div class="relative mt-1">
                  <input id="merMapName" type="text" autocomplete="off"
                    class="w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60" />
                  <div id="merMapNameSuggestions"
                    class="absolute left-0 right-0 z-[120] mt-1 hidden rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl"></div>
                </div>
              </div>

              <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 px-3 py-2">
                <div class="text-[11px] text-zinc-600 dark:text-zinc-400">${__merEsc(typeof t === 'function' ? (t('map_edit_request.checkpoints') || 'Checkpoints') : 'Checkpoints')}</div>
                <input id="merCheckpoints" type="number" inputmode="numeric" min="0" step="1"
                  class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60" />
              </div>

              <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 px-3 py-2">
                <div class="text-[11px] text-zinc-600 dark:text-zinc-400">${__merEsc(typeof t === 'function' ? (t('map_edit_request.creators') || 'Creators') : 'Creators')}</div>
                <input id="merCreators" type="hidden" />

                <div id="merCreatorsChips" class="mt-2 flex flex-wrap gap-2"></div>

                <div class="relative mt-2">
                  <input id="merCreatorsSearch" type="text" autocomplete="off"
                    class="w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                    placeholder="${__merEsc(typeof t === 'function' ? (t('map_edit_request.creator_search') || 'Search a user…') : 'Search a user…')}" />
                  <div id="merCreatorSuggestions"
                    class="absolute left-0 right-0 z-[120] mt-1 hidden rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl max-h-[260px] overflow-auto"></div>
                </div>

                <div class="mt-2 text-[11px] text-zinc-600 dark:text-zinc-400">
                  ${__merEsc(typeof t === 'function' ? (t('map_edit_request.creator_hint') || 'Select users to add. First creator is primary.') : 'Select users to add. First creator is primary.')}
                </div>
              </div>
            </div>
          </div>

          <!-- REQUIRED (submitMapForm-like) -->
          <div class="relative rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 p-4 space-y-4 pt-card-anim pt-in">
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <div class="mb-1 text-xs text-zinc-600 dark:text-zinc-400">${__merEsc(typeof t === 'function' ? (t('map_edit_request.category') || 'Category') : 'Category')}</div>
                <div id="merCategoryDropdown" class="custom-multiselect relative">
                  <button type="button" id="merCategoryDropdownBtn"
                    class="custom-multiselect-btn cursor-pointer inline-flex w-full items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm"
                    data-placeholder="${__merEsc(typeof t === 'function' ? (t('map_edit_request.category') || 'Category') : 'Category')}">
                    <span class="cm-label truncate">${__merEsc(typeof t === 'function' ? (t('map_edit_request.select') || 'Select…') : 'Select…')}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-zinc-900 dark:text-white/70" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <div class="custom-multiselect-list hidden absolute left-0 right-0 mt-1 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl"></div>
                </div>
              </div>

              <div>
                <div class="mb-1 text-xs text-zinc-600 dark:text-zinc-400">${__merEsc(typeof t === 'function' ? (t('map_edit_request.difficulty') || 'Difficulty') : 'Difficulty')}</div>
                <div id="merDifficultyDropdown" class="custom-multiselect relative">
                  <button type="button" id="merDifficultyDropdownBtn"
                    class="custom-multiselect-btn cursor-pointer inline-flex w-full items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm"
                    data-placeholder="${__merEsc(typeof t === 'function' ? (t('map_edit_request.difficulty') || 'Difficulty') : 'Difficulty')}">
                    <span class="cm-label truncate">${__merEsc(typeof t === 'function' ? (t('map_edit_request.select') || 'Select…') : 'Select…')}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-zinc-900 dark:text-white/70" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <div class="custom-multiselect-list hidden absolute left-0 right-0 mt-1 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl max-h-[260px] overflow-auto"></div>
                </div>
              </div>

              <div>
                <div class="mb-1 text-xs text-zinc-600 dark:text-zinc-400">${__merEsc(typeof t === 'function' ? (t('map_edit_request.mechanics') || 'Mechanics') : 'Mechanics')}</div>
                <div id="merMechanicsDropdown" class="custom-multiselect relative">
                  <button type="button" id="merMechanicsDropdownBtn"
                    class="custom-multiselect-btn cursor-pointer inline-flex w-full items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm"
                    data-placeholder="${__merEsc(typeof t === 'function' ? (t('map_edit_request.mechanics') || 'Mechanics') : 'Mechanics')}">
                    <span class="cm-label truncate">${__merEsc(typeof t === 'function' ? (t('map_edit_request.select') || 'Select…') : 'Select…')}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-zinc-900 dark:text-white/70" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <div class="custom-multiselect-list hidden absolute left-0 right-0 mt-1 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl max-h-[260px] overflow-auto"></div>
                </div>
              </div>

              <div>
                <div class="mb-1 text-xs text-zinc-600 dark:text-zinc-400">${__merEsc(typeof t === 'function' ? (t('map_edit_request.restrictions') || 'Restrictions') : 'Restrictions')}</div>
                <div id="merRestrictionsDropdown" class="custom-multiselect relative">
                  <button type="button" id="merRestrictionsDropdownBtn"
                    class="custom-multiselect-btn cursor-pointer inline-flex w-full items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm"
                    data-placeholder="${__merEsc(typeof t === 'function' ? (t('map_edit_request.restrictions') || 'Restrictions') : 'Restrictions')}">
                    <span class="cm-label truncate">${__merEsc(typeof t === 'function' ? (t('map_edit_request.select') || 'Select…') : 'Select…')}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-zinc-900 dark:text-white/70" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <div class="custom-multiselect-list hidden absolute left-0 right-0 mt-1 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl max-h-[260px] overflow-auto"></div>
                </div>
                <div>
                  <div class="mb-1 text-xs text-zinc-600 dark:text-zinc-400">${__merEsc(typeof t === 'function' ? (t('filters_toolbar.tags') || 'Tags') : 'Tags')}</div>
                  <div id="merTagsDropdown" class="custom-multiselect relative">
                    <button type="button" id="merTagsDropdownBtn"
                      class="custom-multiselect-btn cursor-pointer inline-flex w-full items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm"
                      data-placeholder="${__merEsc(typeof t === 'function' ? (t('filters_toolbar.tags') || 'Tags') : 'Tags')}">
                      <span class="cm-label truncate">${__merEsc(typeof t === 'function' ? (t('map_edit_request.select') || 'Select…') : 'Select…')}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-zinc-900 dark:text-white/70" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <div class="custom-multiselect-list hidden absolute left-0 right-0 mt-1 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl max-h-[260px] overflow-auto"></div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- OPTIONAL -->
          <div class="relative rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 p-4 space-y-4 pt-card-anim pt-in">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 px-3 py-2">
                <div class="text-[11px] text-zinc-600 dark:text-zinc-400">${__merEsc(typeof t === 'function' ? (t('map_edit_request.optional_title') || 'Title') : 'Title')}</div>
                <input id="merTitle" type="text" autocomplete="off"
                  class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60" />
              </div>

              <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 px-3 py-2">
                <div class="text-[11px] text-zinc-600 dark:text-zinc-400 mb-1">${__merEsc(typeof t === 'function' ? (t('map_edit_request.custom_banner') || t('map.optional.custom_banner') || 'Custom banner') : 'Custom banner')}</div>
                <input id="merCustomBanner" type="hidden" autocomplete="off" />
                <div id="merBannerDrop" class="group relative flex h-36 items-center justify-center rounded-xl border border-dashed border-zinc-200/80 dark:border-white/15 bg-white/75 dark:bg-zinc-900/60 overflow-hidden cursor-pointer">
                  <input id="merBannerInput" type="file" accept="image/*" class="hidden">
                  <div id="merBannerPlaceholder" class="text-sm text-zinc-700 dark:text-zinc-300 px-3 text-center select-none">
                    ${__merEsc(typeof t === 'function' ? (t('map_edit_request.drag_and_drop') || 'Drag & drop or click to upload') : 'Drag & drop or click to upload')}
                    <div class="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">${__merEsc(typeof t === 'function' ? (t('map_edit_request.banner_hint') || 'Recommended 16:9. JPG/PNG/WebP/AVIF, max 10MB.') : 'Recommended 16:9. JPG/PNG/WebP/AVIF, max 10MB.')}</div>
                  </div>
                </div>
              </div>

              <div class="md:col-span-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 px-3 py-2">
                <div class="text-[11px] text-zinc-600 dark:text-zinc-400">${__merEsc(typeof t === 'function' ? (t('map_edit_request.optional_description') || 'Description') : 'Description')}</div>
                <textarea id="merDescription" rows="4"
                  class="mt-1 w-full resize-y rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"></textarea>
              </div>

              <div class="md:col-span-2 grid gap-3 sm:grid-cols-3">
                <div class="relative rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 px-3 py-2">
                  <div class="text-[11px] text-zinc-600 dark:text-zinc-400">${__merEsc(typeof t === 'function' ? (t('map_edit_request.medal_gold') || 'Gold medal') : 'Gold medal')}</div>
                  <input id="merMedalGold" type="text" autocomplete="off"
                    class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60" />
                </div>
                <div class="relative rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 px-3 py-2">
                  <div class="text-[11px] text-zinc-600 dark:text-zinc-400">${__merEsc(typeof t === 'function' ? (t('map_edit_request.medal_silver') || 'Silver medal') : 'Silver medal')}</div>
                  <input id="merMedalSilver" type="text" autocomplete="off"
                    class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60" />
                </div>
                <div class="relative rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 px-3 py-2">
                  <div class="text-[11px] text-zinc-600 dark:text-zinc-400">${__merEsc(typeof t === 'function' ? (t('map_edit_request.medal_bronze') || 'Bronze medal') : 'Bronze medal')}</div>
                  <input id="merMedalBronze" type="text" autocomplete="off"
                    class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="merStatus" class="hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200"></div>
      </div>

      <!-- Footer -->
      <div class="flex items-center gap-3 border-t border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/30 px-5 py-4">
        <button type="button" id="merSendBtn"
          class="ml-auto inline-flex cursor-pointer items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/60">
          ${__merEsc(sendLabel)}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const box = overlay.querySelector('[data-mer-box]');
  const statusEl = overlay.querySelector('#merStatus');

  const close = () => {
    overlay.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    overlay.classList.remove(...String('flex').trim().split(/\s+/).filter(Boolean));
    if (statusEl) statusEl.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    if (!__suppressUrlSync) __urlHandleModalUserClose('map_edit_request');
  };

  const show = () => {
    overlay.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
    overlay.classList.add(...String('flex').trim().split(/\s+/).filter(Boolean));
    if (statusEl) statusEl.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
  };

  const __moveHighlightTo = (switchId, btn, animate = true) => {
    const container = document.getElementById(switchId);
    if (!container || !btn) return;
    const highlight = document.getElementById(`${switchId}Highlight`);
    if (!highlight) return;

    const br = btn.getBoundingClientRect();
    const cr = container.getBoundingClientRect();
    const left = Math.round(br.left - cr.left);
    const width = Math.round(br.width);

    const HL_TRANSITION = 'transform .28s cubic-bezier(.22,.9,.24,1), width .28s cubic-bezier(.22,.9,.24,1)';

    const apply = () => {
      highlight.style.width = `${Math.max(0, width)}px`;
      highlight.style.transform = `translate3d(${Math.max(0, left)}px,0,0)`;
    };

    if (!animate) {
      const prev = highlight.style.transition;
      highlight.style.transition = 'none';
      apply();
      requestAnimationFrame(() => {
        highlight.style.transition = HL_TRANSITION;
      });
      return;
    }

    if (highlight.style.transition === 'none') {
      highlight.style.transition = HL_TRANSITION;
    }
    requestAnimationFrame(apply);
  };

  const setSwitch = (switchId, boolVal) => {
    const el = document.getElementById(switchId);
    if (!el) return;
    const value = boolVal ? '1' : '0';
    el.setAttribute('data-value', value);

    // Update button classes
    const activeBtn = el.querySelector(`button[data-value="${value}"]`);
    el.querySelectorAll('button[data-switch]').forEach((b) => {
      const isActive = b === activeBtn;
      (() => { const __obj = b; let __last; for (const __c of String('bg-white').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, isActive); return __last; })();
      (() => { const __obj = b; let __last; for (const __c of String('text-zinc-900').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, isActive); return __last; })();
      (() => { const __obj = b; let __last; for (const __c of String('dark:text-zinc-900').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, isActive); return __last; })();
      (() => { const __obj = b; let __last; for (const __c of String('text-zinc-900 dark:text-white').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !isActive); return __last; })();
      (() => { const __obj = b; let __last; for (const __c of String('hover:bg-zinc-100 dark:hover:bg-white/10').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !isActive); return __last; })();
    });

    // Move highlight
    if (activeBtn) {
      __moveHighlightTo(switchId, activeBtn, true);
    }
  };

  const getSwitch = (switchId) => {
    const el = document.getElementById(switchId);
    if (!el) return null;
    return el.getAttribute('data-value') === '1';
  };

  overlay.querySelectorAll('[data-mer-close]').forEach((btn) => btn.addEventListener('click', close));
  overlay.addEventListener('pointerdown', (e) => {
    if (!box.contains(e.target)) close();
  });

  overlay.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-switch]');
    if (!btn) return;
    const group = btn.getAttribute('data-switch');
    const val = btn.getAttribute('data-value') || '0';
    const switchId = `mer${group.charAt(0).toUpperCase()}${group.slice(1)}Switch`;

    setSwitch(switchId, val === '1');
  });

  overlay.__merMounted = overlay.__merMounted || {};
  overlay.__merMounted.dropdown = false;
  overlay.__merMounted.auto = false;
  overlay.__merMounted.send = false;

  overlay.__merShow = show;
  overlay.__merClose = close;
}

function __merEsc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function __merSameArray(a, b) {
  const aa = Array.isArray(a) ? a.filter(Boolean).map(String) : [];
  const bb = Array.isArray(b) ? b.filter(Boolean).map(String) : [];
  if (aa.length !== bb.length) return false;
  aa.sort(); bb.sort();
  for (let i = 0; i < aa.length; i++) if (aa[i] !== bb[i]) return false;
  return true;
}

function __merReadNumber(v) {
  const n = Number(String(v ?? '').trim());
  return Number.isFinite(n) ? n : null;
}

async function __merFetchMapRowByCode(code) {
  try {
    const params = new URLSearchParams({
      page_size: '10',
      page_number: '1',
      code: String(code ?? '').trim(),
    });
    const uid = (typeof window !== 'undefined' && window.user_id != null) ? String(window.user_id).trim() : '';
    if (uid) params.set('user_id', uid);
    const resp = await fetch(`${apiUrls.mapSearch}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    const status = resp.status;
    if (!resp.ok) {
      let txt = '';
      try { txt = await resp.text(); } catch {}
      return { ok: false, status, error: txt || 'Upstream error' };
    }
    const data = await resp.json();
    const rows = normalizeToRows(data, 'map');
    const row = rows && rows[0] ? rows[0] : null;
    return { ok: true, status, row };
  } catch (e) {
    return { ok: false, status: 0, error: e?.message || String(e) };
  }
}

function __merFillSelect(el, options, selectedRaw) {
  if (!el) return;
  const current = (selectedRaw ?? '').toString();
  el.innerHTML = options
    .map((o) => {
      const raw = o.raw ?? o.value ?? '';
      const label = o.label ?? o.text ?? raw;
      const sel = String(raw) === current ? ' selected' : '';
      return `<option value="${__merEsc(raw)}"${sel}>${__merEsc(label)}</option>`;
    })
    .join('');
}

function __merRenderChecklist(menuEl, options, selectedSet, onChange) {
  if (!menuEl) return;
  menuEl.innerHTML = options
    .map((opt) => {
      const raw = opt.raw ?? opt.value ?? '';
      const label = opt.translated ?? opt.label ?? opt.text ?? raw;
      const checked = selectedSet.has(String(raw)) ? 'checked' : '';
      return `
        <label class="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-white/10">
          <input type="checkbox" class="h-4 w-4 rounded border-zinc-300/80 dark:border-white/20 bg-zinc-900/5 dark:bg-black/30 text-emerald-400 focus:ring-emerald-400/30"
                 value="${__merEsc(raw)}" ${checked}>
          <span class="text-sm text-zinc-800 dark:text-zinc-200">${__merEsc(label)}</span>
        </label>
      `;
    })
    .join('');

  menuEl.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener('change', () => {
      const v = String(cb.value);
      if (cb.checked) selectedSet.add(v);
      else selectedSet.delete(v);
      onChange && onChange();
    });
  });
}

function __merSetMultiLabel(labelEl, selectedSet, emptyLabel) {
  if (!labelEl) return;
  const n = selectedSet.size;
  if (!n) labelEl.textContent = emptyLabel;
  else labelEl.textContent = `${n} selected`;
}

let TAG_OPTIONS = [];

// Autocomplete tags filters options
const __loadTagOptions = async () => {
  try {
    const resp = await fetch('/api/autocomplete/tags?search=&limit=20', { 
      headers: { 'Accept': 'application/json' } 
    });
    if (resp.ok) {
      const json = await resp.json().catch(() => null);
      if (Array.isArray(json) && json.length) {
        TAG_OPTIONS = json.map(tag => ({ 
          text: String(tag || ''), 
          value: String(tag || ''), 
          raw: String(tag || '') 
        }));
        return;
      }
    }
  } catch (e) {
    console.error('Failed to load tag options:', e);
  }
  // Fallback
  TAG_OPTIONS = [];
};

// Initialize tags on page load
__loadTagOptions().catch(e => console.error('Error loading tags:', e));

/* -------------------------------------------------------------------------
   Map Edit Request controls
   ------------------------------------------------------------------------- */

const __MER_CATEGORY_OPTIONS = [
  { text: () => t('filters_toolbar.classic') || 'Classic', value: 'Classic', raw: 'Classic' },
  {
    text: () => t('filters_toolbar.increasing_difficulty') || 'Increasing Difficulty',
    value: 'Increasing Difficulty',
    raw: 'Increasing Difficulty',
  },
  // { text: () => t('filters.tournament') || 'Tournament', value: 'Tournament', raw: 'Tournament' },
];

const __MER_DIFFICULTY_FINE_OPTIONS = [
  { text: () => `${t('filters_toolbar.easy') || 'Easy'} -`, value: 'Easy -', raw: 'Easy -' },
  { text: () => t('filters_toolbar.easy') || 'Easy', value: 'Easy', raw: 'Easy' },
  { text: () => `${t('filters_toolbar.easy') || 'Easy'} +`, value: 'Easy +', raw: 'Easy +' },

  { text: () => `${t('filters_toolbar.medium') || 'Medium'} -`, value: 'Medium -', raw: 'Medium -' },
  { text: () => t('filters_toolbar.medium') || 'Medium', value: 'Medium', raw: 'Medium' },
  { text: () => `${t('filters_toolbar.medium') || 'Medium'} +`, value: 'Medium +', raw: 'Medium +' },
  { text: () => `${t('filters_toolbar.hard') || 'Hard'} -`, value: 'Hard -', raw: 'Hard -' },
  { text: () => t('filters_toolbar.hard') || 'Hard', value: 'Hard', raw: 'Hard' },
  { text: () => `${t('filters_toolbar.hard') || 'Hard'} +`, value: 'Hard +', raw: 'Hard +' },

  { text: () => `${t('filters_toolbar.very_hard') || 'Very Hard'} -`, value: 'Very Hard -', raw: 'Very Hard -' },
  { text: () => t('filters_toolbar.very_hard') || 'Very Hard', value: 'Very Hard', raw: 'Very Hard' },
  { text: () => `${t('filters_toolbar.very_hard') || 'Very Hard'} +`, value: 'Very Hard +', raw: 'Very Hard +' },

  { text: () => `${t('filters_toolbar.extreme') || 'Extreme'} -`, value: 'Extreme -', raw: 'Extreme -' },
  { text: () => t('filters_toolbar.extreme') || 'Extreme', value: 'Extreme', raw: 'Extreme' },
  { text: () => `${t('filters_toolbar.extreme') || 'Extreme'} +`, value: 'Extreme +', raw: 'Extreme +' },

  { text: () => t('filters_toolbar.hell') || 'Hell', value: 'Hell', raw: 'Hell' },
];


// --- MER helpers
function __merDifficultyDotClass(labelOrRaw) {
  const L = String(labelOrRaw || '').toLowerCase();
  if (L.startsWith('easy')) return 'bg-emerald-400';
  if (L.startsWith('medium')) return 'bg-yellow-400';
  if (L.startsWith('very hard')) return 'bg-orange-500';
  if (L.startsWith('hard') && !L.startsWith('very')) return 'bg-orange-400';
  if (L.startsWith('extreme')) return 'bg-red-500';
  if (L.startsWith('hell')) return 'bg-rose-500';
  return 'bg-zinc-400';
}

let __merMechRestrCache = null;
let __merMechRestrInFlight = null;

function __merToNameArray(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.results)) return data.results;
  }
  return [];
}

async function __merFillMechanicsAndRestrictions() {
  if (__merMechRestrCache) return __merMechRestrCache;
  if (__merMechRestrInFlight) return __merMechRestrInFlight;

  const locale =
    (typeof CURRENT_LANG !== 'undefined' ? CURRENT_LANG : document.documentElement.lang || 'en');

  __merMechRestrInFlight = (async () => {
    try {
      const [mechResp, restrResp] = await Promise.all([
        fetch('/api/autocomplete/map-mechanics', { headers: { Accept: 'application/json' } }),
        fetch('/api/autocomplete/map-restrictions', { headers: { Accept: 'application/json' } }),
      ]);

      const mechanicsData = mechResp.ok ? await mechResp.json() : [];
      const restrictionsData = restrResp.ok ? await restrResp.json() : [];

      const toOpt = (data, keyPrefix) => {
        const base = __merToNameArray(data)
          .map((v) => (typeof v === 'string' ? v : v?.name ?? v?.value ?? v?.label ?? ''))
          .map((s) => String(s || '').trim())
          .filter(Boolean);

        const seen = new Set();
        const out = [];
        for (const raw of base) {
          if (seen.has(raw)) continue;
          seen.add(raw);

          let translated = raw;
          if (typeof t === 'function' && locale === 'cn') {
            const slug = raw.toLowerCase().replace(/\s+/g, '_');
            const k = `${keyPrefix}.${slug}`;
            const tr = t(k);
            if (tr && tr !== k) translated = tr;
          }

          out.push({ translated, value: raw, raw });
        }
        return out;
      };

      const mechanicsOptions = toOpt(mechanicsData, 'mechanics');
      const restrictionsOptions = toOpt(restrictionsData, 'restrictions');

      __merMechRestrCache = { mechanicsOptions, restrictionsOptions };
      return __merMechRestrCache;
    } catch {
      __merMechRestrCache = { mechanicsOptions: [], restrictionsOptions: [] };
      return __merMechRestrCache;
    } finally {
      __merMechRestrInFlight = null;
    }
  })();

  return __merMechRestrInFlight;
}

const __merUserCache = new Map();
async function __merFetchUserProfile(userId) {
  const id = String(userId || '').trim();
  if (!/^\d+$/.test(id)) return null;

  const cached = __merUserCache.get(id);
  if (cached) return cached instanceof Promise ? await cached : cached;

  const p = (async () => {
    try {
      const resp = await fetch(`/api/users/${encodeURIComponent(id)}`, {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
      });
      if (!resp.ok) return null;
      return await resp.json();
    } catch {
      return null;
    }
  })();

  __merUserCache.set(id, p);
  const data = await p;
  __merUserCache.set(id, data);
  return data;
}

function __merUserDisplayName(profile) {
  const name =
    profile?.coalesced_name ||
    profile?.global_name ||
    profile?.name ||
    profile?.nickname ||
    profile?.username ||
    '';
  return String(name || '').trim();
}

async function __merSetUserDisplayInto(el, userId, fallback = '') {
  if (!el) return;
  const id = String(userId || '').trim();
  if (!id) {
    el.textContent = fallback || '—';
    return;
  }

  el.textContent = fallback || '…';

  const profile = await __merFetchUserProfile(id);
  const name = __merUserDisplayName(profile);
  el.textContent = name || fallback || id;
}

function __merEnsureCreatorsState(overlay, creators) {
  if (!overlay) return;

  let list = Array.isArray(creators) ? creators.slice() : [];

  const seen = new Set();
  list = list
    .map((c) => ({
      id: String(c?.id ?? c?.user_id ?? '').trim(),
      name: String(c?.name ?? '').trim(),
      is_primary: !!c?.is_primary,
    }))
    .filter((c) => /^\d+$/.test(c.id))
    .filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });

  const firstId = list[0]?.id || null;
  const primaryId = list.find((c) => c.is_primary)?.id || firstId;
  list.forEach((c) => (c.is_primary = c.id === primaryId));

  overlay.__merCreatorsState = { list };
}

function __merSyncCreatorsHiddenInput(overlay) {
  const hidden = document.getElementById('merCreators');
  if (!hidden) return;

  const list = Array.isArray(overlay?.__merCreatorsState?.list) ? overlay.__merCreatorsState.list : [];
  hidden.value = list.map((c) => c.id).join(', ');
}

function __merRenderCreatorsChips(overlay) {
  const host = document.getElementById('merCreatorsChips');
  if (!host) return;

  const creators = Array.isArray(overlay?.__merCreatorsState?.list) ? overlay.__merCreatorsState.list : [];
  host.innerHTML = '';

  if (!creators.length) {
    const empty = document.createElement('div');
    empty.className = 'text-sm text-zinc-600 dark:text-zinc-400';
    empty.textContent = 'N/A';
    host.appendChild(empty);
    return;
  }

  for (const c of creators) {
    const chip = document.createElement('span');
    chip.className =
      'inline-flex items-center gap-2 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 backdrop-blur px-2.5 py-1 text-[11px] leading-none text-zinc-900 dark:text-white/85';

    const dot = document.createElement('span');
    dot.className = 'h-2 w-2 rounded-full ' + (c.is_primary ? 'bg-emerald-400' : 'bg-white/50');

    const name = document.createElement('span');
    name.className = 'max-w-[180px] truncate';
    name.textContent = c.name || c.id;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className =
      'ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-zinc-200/80 dark:border-white/10 bg-black/20 text-zinc-900 dark:text-white/80 hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer';
    remove.setAttribute('data-mer-remove-creator', c.id);
    remove.innerHTML = '&times;';

    chip.appendChild(dot);
    chip.appendChild(name);
    chip.appendChild(remove);
    host.appendChild(chip);
  }

  host.querySelectorAll('button[data-mer-remove-creator]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-mer-remove-creator');
      if (!id) return;
      overlay.__merCreatorsState.list = creators.filter((c) => c.id !== id);

      const firstId = overlay.__merCreatorsState.list[0]?.id || null;
      const primaryId = overlay.__merCreatorsState.list.find((c) => c.is_primary)?.id || firstId;
      overlay.__merCreatorsState.list.forEach((c) => (c.is_primary = c.id === primaryId));

      __merSyncCreatorsHiddenInput(overlay);
      __merRenderCreatorsChips(overlay);
    });
  });
}

function __merAddCreatorToState(overlay, { id, name }) {
  const uid = String(id || '').trim();
  if (!/^\d+$/.test(uid)) return;
  const nm = String(name || '').trim();

  overlay.__merCreatorsState = overlay.__merCreatorsState || { list: [] };
  const list = Array.isArray(overlay.__merCreatorsState.list) ? overlay.__merCreatorsState.list : (overlay.__merCreatorsState.list = []);

  if (list.some((c) => c.id === uid)) return;

  const isPrimary = list.length === 0;
  list.push({ id: uid, name: nm, is_primary: isPrimary });

  if (isPrimary) {
    list.forEach((c) => (c.is_primary = c.id === uid));
  }

  __merSyncCreatorsHiddenInput(overlay);
  __merRenderCreatorsChips(overlay);
}

// --- MER banner upload / dropzone
const __MER_BANNER_ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const __MER_BANNER_MAX_BYTES = 10 * 1024 * 1024; // 10MB
const __MER_IMAGE_UPLOAD_ENDPOINT = '/api/utilities/image';

function __merShowBusy(el) {
  if (!el) return () => {};
  const o = document.createElement('div');
  o.className = 'absolute inset-0 grid place-items-center bg-zinc-900/7 dark:bg-black/40 backdrop-blur-sm';
  o.innerHTML = `<div class="rounded-md bg-white/85 dark:bg-zinc-900/80 px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 ring-1 ring-emerald-500/60">${(typeof t === 'function' ? (t('record.uploading_screenshot') || 'Uploading…') : 'Uploading…')}</div>`;
  el.appendChild(o);
  return () => o.remove();
}

function __merFilenameWithExt(file, base = 'image') {
  const name = String(file?.name || '').trim();
  const ext = (name.match(/\.[a-z0-9]{2,5}$/i) || [''])[0];
  return ext ? `${base}${ext.toLowerCase()}` : base;
}

async function __merUploadImageGeneric(file) {
  if (!file) throw new Error('No file');
  if (!__MER_BANNER_ALLOWED_MIME.includes(file.type)) {
    throw new Error(typeof t === 'function' ? (t('errors.image_type') || 'Unsupported image type.') : 'Unsupported image type.');
  }
  if (file.size > __MER_BANNER_MAX_BYTES) {
    throw new Error(typeof t === 'function' ? (t('errors.image_too_large') || 'Image too large.') : 'Image too large.');
  }

  const fd = new FormData();
  fd.append('file', file, __merFilenameWithExt(file, 'banner'));

  const resp = await fetch(__MER_IMAGE_UPLOAD_ENDPOINT, {
    method: 'POST',
    headers: { Accept: 'text/plain' },
    body: fd,
    credentials: 'same-origin',
  });

  const text = await resp.text();
  if (!resp.ok) throw new Error(text || `HTTP ${resp.status}`);
  const url = (text || '').trim();
  if (!/^https?:\/\//i.test(url)) throw new Error('Invalid upload response.');
  return url;
}

function __merResetBannerDropzone(overlay) {
  const drop = document.getElementById('merBannerDrop');
  if (!drop) return;

  overlay.__merBannerFile = null;
  overlay.__merBannerUrl = null;

  const hidden = document.getElementById('merCustomBanner');
  if (hidden) hidden.value = '';

  drop.dataset.merBound = '0';
  drop.innerHTML = `
    <input id="merBannerInput" type="file" accept="image/*" class="hidden">
    <div id="merBannerPlaceholder" class="text-sm text-zinc-700 dark:text-zinc-300 px-3 text-center select-none">
      ${(typeof t === 'function' ? (t('map_edit_request.drag_and_drop') || 'Drag & drop or click to upload') : 'Drag & drop or click to upload')}
      <div class="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">${(typeof t === 'function' ? (t('map_edit_request.banner_hint') || 'Recommended 16:9. JPG/PNG/WebP/AVIF, max 10MB.') : 'Recommended 16:9. JPG/PNG/WebP/AVIF, max 10MB.')}</div>
    </div>
  `;

  __merSetupBannerDropzone(overlay);
}

function __merSetBannerPreviewFromUrl(overlay, url) {
  const drop = document.getElementById('merBannerDrop');
  if (!drop) return;

  overlay.__merBannerFile = null;
  overlay.__merBannerUrl = url;

  const hidden = document.getElementById('merCustomBanner');
  if (hidden) hidden.value = url || '';

  drop.dataset.merBound = '0';
  drop.innerHTML = `
    <div class="absolute inset-0"></div>
    <div class="absolute inset-x-0 bottom-0 p-2 flex items-center justify-between bg-zinc-900/7 dark:bg-black/40 backdrop-blur">
      <span class="text-xs text-zinc-900 dark:text-white/90 truncate px-1">${__merEsc(url || '')}</span>
      <button type="button" id="merBannerRemoveBtn" class="rounded-md cursor-pointer border border-zinc-300/80 dark:border-white/20 px-2 py-1 text-xs text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10">
        ${(typeof t === 'function' ? (t('map.remove') || 'Remove') : 'Remove')}
      </button>
    </div>
  `;

  const imgHost = drop.firstElementChild;
  const img = new Image();
  img.alt = '';
  img.decoding = 'async';
  img.loading = 'eager';
  img.draggable = false;
  img.className = 'absolute inset-0 h-full w-full object-cover select-none pointer-events-none';
  img.src = String(url || '');
  imgHost.appendChild(img);

  document.getElementById('merBannerRemoveBtn')?.addEventListener('click', () => __merResetBannerDropzone(overlay));
}

function __merSetupBannerDropzone(overlay) {
  const drop = document.getElementById('merBannerDrop');
  const input = document.getElementById('merBannerInput');
  if (!drop || !input) return;

  if (drop.dataset.merBound === '1') return;
  drop.dataset.merBound = '1';

  const pick = () => input.click();

  const readAsDataURL = (file) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });

  const setPreview = async (file) => {
    drop.dataset.merBound = '0';
    drop.innerHTML = `
      <div class="absolute inset-0"></div>
      <div class="absolute inset-x-0 bottom-0 p-2 flex items-center justify-between bg-zinc-900/7 dark:bg-black/40 backdrop-blur">
        <span class="text-xs text-zinc-900 dark:text-white/90 truncate px-1">${__merEsc(file.name || '')}</span>
        <button type="button" id="merBannerRemoveBtn" class="rounded-md cursor-pointer border border-zinc-300/80 dark:border-white/20 px-2 py-1 text-xs text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10">
          ${(typeof t === 'function' ? (t('map.remove') || 'Remove') : 'Remove')}
        </button>
      </div>
    `;

    const imgHost = drop.firstElementChild;
    const img = new Image();
    img.alt = '';
    img.decoding = 'async';
    img.loading = 'eager';
    img.draggable = false;
    img.className = 'absolute inset-0 h-full w-full object-cover select-none pointer-events-none';

    let blobUrl = null;
    try {
      blobUrl = URL.createObjectURL(file);
      img.src = blobUrl;

      img.onerror = async () => {
        try {
          const dataUrl = await readAsDataURL(file);
          img.src = dataUrl;
        } catch {
          /* ignore */
        } finally {
          if (blobUrl) URL.revokeObjectURL(blobUrl);
        }
      };

      img.onload = () => {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
      };
    } catch {
      try {
        const dataUrl = await readAsDataURL(file);
        img.src = dataUrl;
      } catch {
        /* ignore */
      }
    }

    imgHost.appendChild(img);

    document.getElementById('merBannerRemoveBtn')?.addEventListener('click', () => __merResetBannerDropzone(overlay));
  };

  const acceptFile = async (file) => {
    if (!file) return;

    if (!__MER_BANNER_ALLOWED_MIME.includes(file.type)) {
      if (typeof showErrorMessage === 'function') {
        showErrorMessage(typeof t === 'function' ? (t('errors.image_type') || 'Unsupported image type.') : 'Unsupported image type.');
      }
      return;
    }
    if (file.size > __MER_BANNER_MAX_BYTES) {
      if (typeof showWarningMessage === 'function') {
        showWarningMessage(typeof t === 'function' ? (t('errors.image_too_large') || 'Image too large.') : 'Image too large.');
      }
      return;
    }

    overlay.__merBannerFile = file;
    await setPreview(file);

    const endBusy = __merShowBusy(drop);
    try {
      const url = await __merUploadImageGeneric(file);
      overlay.__merBannerUrl = url;
      const hidden = document.getElementById('merCustomBanner');
      if (hidden) hidden.value = url || '';

      const ok = document.createElement('div');
      ok.className = 'absolute top-2 right-2 rounded bg-emerald-500/90 text-xs text-zinc-900 dark:text-white px-2 py-0.5 shadow';
      ok.textContent = 'Uploaded';
      drop.appendChild(ok);
      setTimeout(() => ok.remove(), 1500);
    } catch (e) {
      overlay.__merBannerUrl = null;
      const hidden = document.getElementById('merCustomBanner');
      if (hidden) hidden.value = '';
      if (typeof showErrorMessage === 'function') {
        showErrorMessage(e?.message || (typeof t === 'function' ? (t('errors.upload_failed') || 'Upload failed.') : 'Upload failed.'));
      }
    } finally {
      endBusy();
    }
  };

  input.addEventListener('change', (e) => acceptFile(e.target.files?.[0]));
  drop.addEventListener('click', pick);

  drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    drop.classList.add(...String('ring-2').trim().split(/\s+/).filter(Boolean), ...String('ring-emerald-500/60').trim().split(/\s+/).filter(Boolean));
  });
  drop.addEventListener('dragleave', () => {
    drop.classList.remove(...String('ring-2').trim().split(/\s+/).filter(Boolean), ...String('ring-emerald-500/60').trim().split(/\s+/).filter(Boolean));
  });
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.classList.remove(...String('ring-2').trim().split(/\s+/).filter(Boolean), ...String('ring-emerald-500/60').trim().split(/\s+/).filter(Boolean));
    const file = e.dataTransfer?.files?.[0];
    acceptFile(file);
  });
}

function __merGetSafeUserIdString() {
  const candidates = [];
  if (typeof window !== 'undefined') {
    candidates.push(window.user_id, window.userId, window.USER_ID, window.__USER_ID__);
    candidates.push(window?.user?.id, window?.user?.user_id);
  }

  try {
    const el = document.documentElement;
    if (el?.dataset) candidates.push(el.dataset.userId, el.dataset.user_id);
    const m = document.querySelector('meta[name="user-id"]');
    candidates.push(m?.content);
  } catch {}

  for (const c of candidates) {
    if (typeof c === 'string' && /^\d{5,25}$/.test(c)) return c;
    if (typeof c === 'number' && Number.isSafeInteger(c) && c > 0) return String(c);
  }
  return null;
}

function __merGetDropdownListEl(container) {
  return (
    container?.querySelector('.custom-multiselect-list') ||
    container?.querySelector('.fake-select-list') ||
    null
  );
}

function __merGetDropdownBtnEl(container) {
  return (
    container?.querySelector('.fake-select-btn, .custom-multiselect-btn') ||
    null
  );
}

function __merEnsureBtnLabelSpan(btn) {
  if (!btn) return null;
  let span = btn.querySelector('.cm-label');
  if (!span) {
    span = document.createElement('span');
    span.className = 'cm-label truncate';
    btn.insertBefore(span, btn.firstChild);
  }
  return span;
}

function __merHideDropdownList(list) {
  if (!list) return;
  if (list.classList.contains('dd-anim')) {
    list.classList.remove(...String('dd-in').trim().split(/\s+/).filter(Boolean));
    list.classList.add(...String('dd-out').trim().split(/\s+/).filter(Boolean));
    setTimeout(() => {
      list.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
      list.style.display = 'none';
    }, 120);
    return;
  }

  list.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
  list.style.display = 'none';
}

function __merShowDropdownList(list) {
  if (!list) return;
  list.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
  list.style.display = 'block';
  if (list.classList.contains('dd-anim')) {
    requestAnimationFrame(() => {
      list.classList.remove(...String('dd-out').trim().split(/\s+/).filter(Boolean));
      list.classList.add(...String('dd-in').trim().split(/\s+/).filter(Boolean));
    });
  }
}

function __merCloseAllFakeSelects(except) {
  document.querySelectorAll('.fake-select[data-open="1"], .custom-multiselect[data-open="1"]').forEach((el) => {
    if (except && el === except) return;
    const list = __merGetDropdownListEl(el);
    if (!list) return;
    el.setAttribute('data-open', '0');
    __merHideDropdownList(list);
  });
}

function __merUpdateFakeSelectLabel(container) {
  const btn = __merGetDropdownBtnEl(container);
  const labelEl = __merEnsureBtnLabelSpan(btn);
  const placeholder = btn?.getAttribute('data-placeholder') ||
    (typeof t === 'function' ? (t('map_edit_request.select') || 'Select…') : 'Select…');
  if (!btn || !labelEl) return;

  const isDifficulty = container?.id === 'merDifficultyDropdown';
  const radio = container.querySelector('input[type="radio"]:checked');
  if (radio) {
    const text = String(radio.getAttribute('data-label') || radio.value || '').trim();
    if (isDifficulty) {
      const dotCls = __merDifficultyDotClass(text);
      labelEl.innerHTML = `<span class="mr-2 inline-block h-2 w-2 rounded-full ${dotCls}"></span>${__merEsc(text)}`;
    } else {
      labelEl.textContent = text || placeholder;
    }
    return;
  }

  const checked = Array.from(container.querySelectorAll('input[type="checkbox"]:checked'));
  if (checked.length > 0) {
    const texts = checked
      .map((c) => String(c.getAttribute('data-label') || c.value || '').trim())
      .filter(Boolean);

    if (texts.length <= 2) {
      labelEl.textContent = texts.join(', ');
    } else {
      labelEl.textContent = `${texts.length} selected`;
    }
    return;
  }

  labelEl.textContent = placeholder;
}

function __merSetupFakeSelect(container) {
  if (!container || container.dataset.merBound === '1') return;
  container.dataset.merBound = '1';

  const btn = __merGetDropdownBtnEl(container);
  const list = __merGetDropdownListEl(container);
  if (!btn || !list) return;

  btn.classList.add(...String('cursor-pointer').trim().split(/\s+/).filter(Boolean));

  list.classList.add(...String('dropdown-list').trim().split(/\s+/).filter(Boolean), ...String('dd-anim').trim().split(/\s+/).filter(Boolean));
  list.style.display = 'none';

  const close = () => {
    container.setAttribute('data-open', '0');
    __merHideDropdownList(list);
  };

  const open = () => {
    __merCloseAllFakeSelects(container);
    container.setAttribute('data-open', '1');
    __merShowDropdownList(list);
  };

  __merUpdateFakeSelectLabel(container);

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = container.getAttribute('data-open') === '1';
    if (isOpen) close();
    else open();
  });

  container.addEventListener('change', (e) => {
    __merUpdateFakeSelectLabel(container);

    const isRadio = e?.target?.type === 'radio';
    const shouldAutoClose =
      isRadio && (container.id === 'merCategoryDropdown' || container.id === 'merDifficultyDropdown');

    if (shouldAutoClose) close();
  });

  const handleOutside = (e) => {
    if (!container.contains(e.target)) close();
  };
  document.addEventListener('pointerdown', handleOutside);

  container.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

function __merPopulateRadioDropdown(dropdownId, options, inputName) {
  const container = document.getElementById(dropdownId);
  const list = __merGetDropdownListEl(container);
  if (!container || !list) return;

  const isDifficulty = dropdownId === 'merDifficultyDropdown';

  list.innerHTML = '';
  (options || []).forEach((opt) => {
    const value = String(opt.raw ?? opt.value ?? '');
    const labelText = String(
      opt.translated ?? (typeof opt.text === 'function' ? opt.text() : (opt.text ?? opt.label ?? value))
    );

    const label = document.createElement('label');
    label.className = 'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10';

    if (isDifficulty) {
      const dotCls = __merDifficultyDotClass(labelText);
      label.innerHTML = `
        <input type="radio" name="${inputName}" value="${__merEsc(value)}" data-label="${__merEsc(labelText)}" class="sr-only">
        <span class="inline-block h-2 w-2 rounded-full ${dotCls}"></span>
        <span class="min-w-0 truncate">${__merEsc(labelText)}</span>
      `;
    } else {
      label.innerHTML = `
        <input type="radio" name="${inputName}" value="${__merEsc(value)}" data-label="${__merEsc(labelText)}" class="h-4 w-4 accent-emerald-500">
        <span class="min-w-0 truncate">${__merEsc(labelText)}</span>
      `;
    }
    list.appendChild(label);
  });

  __merSetupFakeSelect(container);
  __merUpdateFakeSelectLabel(container);
}

function __merPopulateCheckboxDropdown(dropdownId, options, inputName) {
  const container = document.getElementById(dropdownId);
  const list = __merGetDropdownListEl(container);
  if (!container || !list) return;

  list.innerHTML = '';
  (options || []).forEach((opt) => {
    const value = String(opt.raw ?? opt.value ?? '');
    const labelText = String(
      opt.translated ?? (typeof opt.text === 'function' ? opt.text() : (opt.text ?? opt.label ?? value))
    );

    const label = document.createElement('label');
    label.className = 'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10';

    label.innerHTML = `
      <input type="checkbox" name="${inputName}" value="${__merEsc(value)}" data-label="${__merEsc(labelText)}" class="h-4 w-4 accent-emerald-500">
      <span class="min-w-0 truncate">${__merEsc(labelText)}</span>
    `;
    list.appendChild(label);
  });

  __merSetupFakeSelect(container);
  __merUpdateFakeSelectLabel(container);
}

function __merSetRadioValue(dropdownId, rawValue) {
  const container = document.getElementById(dropdownId);
  if (!container) return;
  container.querySelectorAll('input[type="radio"]').forEach((r) => {
    r.checked = String(r.value) === String(rawValue ?? '');
  });
  __merUpdateFakeSelectLabel(container);
}

function __merGetRadioValue(dropdownId) {
  const container = document.getElementById(dropdownId);
  const r = container?.querySelector('input[type="radio"]:checked');
  return r ? String(r.value) : '';
}

function __merSetCheckboxValues(dropdownId, values) {
  const want = new Set((Array.isArray(values) ? values : []).map(String));
  const container = document.getElementById(dropdownId);
  if (!container) return;
  container.querySelectorAll('input[type="checkbox"]').forEach((c) => {
    c.checked = want.has(String(c.value));
  });
  __merUpdateFakeSelectLabel(container);
}

function __merGetCheckboxValues(dropdownId) {
  const container = document.getElementById(dropdownId);
  if (!container) return [];
  return Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map((c) => String(c.value));
}

function __merHideSuggestionBox(box) {
  if (!box) return;
  box.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
  box.innerHTML = '';
}

function __merRenderSuggestionBox(box, items, onPick) {
  if (!box) return;
  box.innerHTML = '';
  const max = Math.min(items.length, 12);

  for (let i = 0; i < max; i++) {
    const it = items[i];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'w-full cursor-pointer rounded-md px-2 py-2 text-left text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10';
    btn.textContent = it.label;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      onPick(it);
      __merHideSuggestionBox(box);
    });
    box.appendChild(btn);
  }

  if (max === 0) __merHideSuggestionBox(box);
  else box.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
}

function __merSetupAutocomplete({ inputEl, boxEl, kind, minChars = 1, onPick }) {
  if (!inputEl || !boxEl) return;
  let timer = null;

  document.addEventListener('pointerdown', (e) => {
    if (inputEl.contains(e.target) || boxEl.contains(e.target)) return;
    __merHideSuggestionBox(boxEl);
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') __merHideSuggestionBox(boxEl);
  });

  inputEl.addEventListener('input', () => {
    const q = String(inputEl.value || '').trim();
    if (q.length < minChars) return __merHideSuggestionBox(boxEl);

    if (timer) clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        const url = buildAutocompleteUrl(kind, { value: q, locale: (typeof CURRENT_LANG !== 'undefined' ? CURRENT_LANG : 'en'), pageSize: 12 });
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!res.ok) return __merHideSuggestionBox(boxEl);

        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.items || data.data || []);
        const isUsers = kind === 'users';
        const items = (list || [])
          .map((x) => {
            if (Array.isArray(x)) {
              const id = String(x[0] ?? '').trim();
              const label = String(x[1] ?? id).trim();
              return { label, raw: id, data: x };
            }

            if (typeof x === 'string') return { label: x, raw: x, data: x };

            const label =
              x.translated_map_name ||
              x.translated ||
              x.coalesced_name ||
              x.global_name ||
              x.name ||
              x.nickname ||
              x.username ||
              x.map_name ||
              x.value ||
              '';

            const isUsers = kind === 'users';
            const raw = isUsers
              ? (x.user_id ?? x.id ?? x.value ?? x.raw ?? label)
              : (x.map_name ?? x.raw ?? x.value ?? x.id ?? x.user_id ?? label);

            return { label: String(label), raw, data: x };
          })
          .filter((x) => x.label);

        __merRenderSuggestionBox(boxEl, items, onPick);
      } catch {
        __merHideSuggestionBox(boxEl);
      }
    }, 220);
  });
}

function openMapEditRequestModal(map, opts = {}) {
  const { fromUrl = false, syncUrl = true } = opts || {};
  const code = map?.code || '';
  if (syncUrl && !fromUrl && code) __urlOpenModal('map_edit_request', { code }, { push: true });
  ensureMapEditRequestModal();

  const overlay = document.getElementById('mapEditRequestOverlay');
  if (!overlay) return;

  // -------------------------
  // Helpers
  // -------------------------
  const get = (...keys) => {
    for (const k of keys) {
      if (k == null) continue;
      const v = map?.[k];
      if (v !== undefined && v !== null) return v;
    }
    return undefined;
  };

  const toStr = (v) => (v === undefined || v === null ? '' : String(v));
  const toBool = (v) => {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0;
    if (typeof v === 'string') {
      const s = v.trim().toLowerCase();
      if (s === 'true' || s === '1' || s === 'yes' || s === 'y') return true;
      if (s === 'false' || s === '0' || s === 'no' || s === 'n' || s === '') return false;
    }
    return false;
  };

  const normalizeStringList = (arr) =>
    (Array.isArray(arr) ? arr : [])
      .map((x) => (x == null ? '' : String(x)).trim())
      .filter(Boolean);

  const normalizeCreators = (v) => {
    if (Array.isArray(v)) {
      if (v.length === 0) return [];
      if (typeof v[0] === 'object' && v[0]) {
        return v
          .map((c) => ({
            id: String(c.id ?? c.user_id ?? '').trim(),
            is_primary: !!c.is_primary,
            name: String(c.name ?? c.coalesced_name ?? c.global_name ?? c.nickname ?? c.username ?? '').trim(),
          }))
          .filter((c) => /^\d+$/.test(c.id));
      }
      return v
        .map((x) => ({ id: String(x).trim(), is_primary: false, name: '' }))
        .filter((c) => /^\d+$/.test(c.id));
    }

    if (typeof v === 'string') {
      const ids = v
        .split(',')
        .map((x) => x.trim())
        .filter((x) => /^\d+$/.test(x));
      return ids.map((id) => ({ id, is_primary: false, name: '' }));
    }

    if (v && typeof v === 'object') {
      const primary = v.primary ?? v.primary_id ?? v.primary_user_id;
      const others = v.others ?? v.secondary ?? [];
      const out = [];
      if (primary && /^\d+$/.test(String(primary))) out.push({ id: String(primary), is_primary: true, name: '' });
      for (const x of (Array.isArray(others) ? others : [])) {
        if (/^\d+$/.test(String(x))) out.push({ id: String(x), is_primary: false, name: '' });
      }
      return out;
    }

    return [];
  };

  const equalScalar = (a, b) => {
    const na = (a === undefined || a === null) ? '' : String(a);
    const nb = (b === undefined || b === null) ? '' : String(b);
    return na === nb;
  };

  const equalArray = (a, b) => {
    const aa = normalizeStringList(a);
    const bb = normalizeStringList(b);
    if (aa.length !== bb.length) return false;
    for (let i = 0; i < aa.length; i++) if (aa[i] !== bb[i]) return false;
    return true;
  };

  const toSafeId = (s) => {
    const str = String(s ?? '').trim();
    const n = Number(str);
    if (Number.isSafeInteger(n) && String(n) === str) return n;
    return str;
  };

  function __merWarn(msg) {
    const m = String(msg || '').trim();
    if (!m) return;
    if (typeof showWarningMessage === 'function') return showWarningMessage(m);
    try { console.warn(m); } catch {}
  }

  function __merErr(msg) {
    const m = String(msg || '').trim();
    if (!m) return;
    if (typeof showErrorMessage === 'function') return showErrorMessage(m);
    try { console.error(m); } catch {}
  }

  function __merFormatApiError(data, status) {
    if (typeof data === 'string') return data || `HTTP ${status}`;

    const pickStr = (...vals) => {
      for (const v of vals) {
        if (typeof v === 'string') {
          const s = v.trim();
          if (s) return s;
        }
      }
      return '';
    };

    const topMsg = pickStr(data?.message, data?.error);
    const nestedMsg = pickStr(
      data?.error?.message,
      data?.error?.error,
      data?.error?.detail,
      data?.detail,
      data?.title
    );

    const isUpstream = topMsg.toLowerCase() === 'upstream error';
    const message = pickStr(isUpstream ? nestedMsg : topMsg, nestedMsg) || `HTTP ${status}`;

    const errors = data?.errors || data?.error?.errors;
    const lines = [];

    if (errors && typeof errors === 'object') {
      for (const [field, arr] of Object.entries(errors)) {
        if (Array.isArray(arr) && arr.length) {
          for (const one of arr) lines.push(`${field}: ${one}`);
        } else if (typeof arr === 'string' && arr.trim()) {
          lines.push(`${field}: ${arr.trim()}`);
        }
      }
    }

    return lines.length ? `${message}\n${lines.join('\n')}` : message;
  }

  // -------------------------
  // Resolve map fields
  // -------------------------
  const mapName = toStr(get('map_name', 'name', 'mapName', 'translated_map_name'));
  const category = toStr(get('category', 'type', 'map_type'));
  const checkpoints = get('checkpoints', 'checkpoint_count', 'cp_count');
  const difficulty = toStr(get('difficulty', 'diff', 'difficulty_name'));
  const mechanics = normalizeStringList(get('mechanics', 'map_mechanics'));
  const restrictions = normalizeStringList(get('restrictions', 'map_restrictions'));
  const tags = normalizeStringList(get('tags', 'map_tags', 'tag', 'tag_list'));
  const title = toStr(get('title'));
  const description = toStr(get('description', 'desc'));
  const customBanner = toStr(get('custom_banner', 'banner', 'banner_url'));

  const official = toBool(get('official', 'is_official'));
  const hidden = toBool(get('hidden', 'is_hidden'));
  const archived = toBool(get('archived', 'is_archived'));

  const medalsRaw = get('medals', 'medal_times', 'medals_times') || {};
  const medalGold = toStr(medalsRaw.gold ?? medalsRaw.Gold ?? medalsRaw.gold_time ?? '');
  const medalSilver = toStr(medalsRaw.silver ?? medalsRaw.Silver ?? medalsRaw.silver_time ?? '');
  const medalBronze = toStr(medalsRaw.bronze ?? medalsRaw.Bronze ?? medalsRaw.bronze_time ?? '');

  const creatorsRaw = get('creators', 'creator_ids', 'creator', 'authors');
  const creators = normalizeCreators(creatorsRaw);

  // -------------------------
  // Fill UI
  // -------------------------
  overlay.__merShow?.();

  const elCode = document.getElementById('merCode');
  const elCreatedBy = document.getElementById('merCreatedBy');

  // Grey
  if (elCode) {
    elCode.textContent = code || 'N/A';
    elCode.classList.add(...String('opacity-80').trim().split(/\s+/).filter(Boolean), ...String('text-zinc-700 dark:text-zinc-300/80').trim().split(/\s+/).filter(Boolean));
    elCode.classList.add(...String('pointer-events-none').trim().split(/\s+/).filter(Boolean), ...String('cursor-default').trim().split(/\s+/).filter(Boolean));
  }

  const createdByStr = __merGetSafeUserIdString?.() || null;
  if (elCreatedBy) {
    elCreatedBy.textContent = createdByStr || 'N/A';
    elCreatedBy.classList.add(...String('opacity-80').trim().split(/\s+/).filter(Boolean), ...String('text-zinc-700 dark:text-zinc-300/80').trim().split(/\s+/).filter(Boolean));
    elCreatedBy.classList.add(...String('pointer-events-none').trim().split(/\s+/).filter(Boolean), ...String('cursor-default').trim().split(/\s+/).filter(Boolean));
    // display coalesced_name
    if (createdByStr) __merSetUserDisplayInto(elCreatedBy, createdByStr);
  }

  const elReason = document.getElementById('merReason');
  if (elReason) elReason.value = '';

  const elNewCode = document.getElementById('merNewCode');
  const elMapName = document.getElementById('merMapName');
  const elCheckpoints = document.getElementById('merCheckpoints');
  const elTitle = document.getElementById('merTitle');
  const elDesc = document.getElementById('merDescription');

  if (elNewCode) elNewCode.value = '';
  if (elMapName) {
    elMapName.value = mapName;
    elMapName.setAttribute('data-raw-value', mapName || '');
  }
  if (elCheckpoints) elCheckpoints.value = checkpoints == null ? '' : String(checkpoints);
  if (elTitle) elTitle.value = title;
  if (elDesc) elDesc.value = description;

  // medals
  const elGold = document.getElementById('merMedalGold');
  const elSilver = document.getElementById('merMedalSilver');
  const elBronze = document.getElementById('merMedalBronze');
  if (elGold) elGold.value = medalGold;
  if (elSilver) elSilver.value = medalSilver;
  if (elBronze) elBronze.value = medalBronze;

  // banner
  const elBannerHidden = document.getElementById('merCustomBanner');
  if (elBannerHidden) elBannerHidden.value = customBanner || '';
  if (customBanner) __merSetBannerPreviewFromUrl(overlay, customBanner);
  else __merResetBannerDropzone(overlay);

  // switches
  const __initSwitchHighlight = (switchId) => {
    const container = document.getElementById(switchId);
    if (!container) return;
    const highlight = document.getElementById(`${switchId}Highlight`);
    if (!highlight) return;
    
    // Setup highlight
    Object.assign(highlight.style, {
      position: 'absolute',
      top: '2px',
      bottom: '2px',
      left: '0',
      width: '0',
      borderRadius: '0.625rem',
      background: 'white',
      boxShadow: '0 1px 0 0 rgba(255,255,255,.06), 0 8px 30px rgba(0,0,0,.25)',
      transform: 'translate3d(0,0,0)',
      transition: 'none',
      willChange: 'transform,width',
      zIndex: '0',
      pointerEvents: 'none'
    });

    container.querySelectorAll('button[data-switch]').forEach((b) => {
      b.style.position = 'relative';
      b.style.zIndex = '1';
    });
  };

  const __moveHighlightTo = (switchId, btn, animate = true) => {
    const container = document.getElementById(switchId);
    if (!container || !btn) return;
    const highlight = document.getElementById(`${switchId}Highlight`);
    if (!highlight) return;

    const br = btn.getBoundingClientRect();
    const cr = container.getBoundingClientRect();
    const left = Math.round(br.left - cr.left);
    const width = Math.round(br.width);

    const HL_TRANSITION = 'transform .28s cubic-bezier(.22,.9,.24,1), width .28s cubic-bezier(.22,.9,.24,1)';

    const apply = () => {
      highlight.style.width = `${Math.max(0, width)}px`;
      highlight.style.transform = `translate3d(${Math.max(0, left)}px,0,0)`;
    };

    if (!animate) {
      const prev = highlight.style.transition;
      highlight.style.transition = 'none';
      apply();
      requestAnimationFrame(() => {
        highlight.style.transition = HL_TRANSITION;
      });
      return;
    }

    if (highlight.style.transition === 'none') {
      highlight.style.transition = HL_TRANSITION;
    }
    requestAnimationFrame(apply);
  };

  const setSwitch = (switchId, boolVal) => {
    const el = document.getElementById(switchId);
    if (!el) return;
    const value = boolVal ? '1' : '0';
    el.setAttribute('data-value', value);

    // Update
    const activeBtn = el.querySelector(`button[data-value="${value}"]`);
    el.querySelectorAll('button[data-switch]').forEach((b) => {
      const isActive = b === activeBtn;
      (() => { const __obj = b; let __last; for (const __c of String('bg-white').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, isActive); return __last; })();
      (() => { const __obj = b; let __last; for (const __c of String('text-zinc-900').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, isActive); return __last; })();
      (() => { const __obj = b; let __last; for (const __c of String('dark:text-zinc-900').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, isActive); return __last; })();
      (() => { const __obj = b; let __last; for (const __c of String('text-zinc-900 dark:text-white').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !isActive); return __last; })();
      (() => { const __obj = b; let __last; for (const __c of String('hover:bg-zinc-100 dark:hover:bg-white/10').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !isActive); return __last; })();
    });

    // Move highlight
    if (activeBtn) {
      __moveHighlightTo(switchId, activeBtn, true);
    }
  };

  const getSwitch = (switchId) => {
    const el = document.getElementById(switchId);
    if (!el) return null;
    return el.getAttribute('data-value') === '1';
  };

  // Initialize highlights
  __initSwitchHighlight('merOfficialSwitch');
  __initSwitchHighlight('merHiddenSwitch');
  __initSwitchHighlight('merArchivedSwitch');

  // Set values
  setSwitch('merOfficialSwitch', !!official);
  setSwitch('merHiddenSwitch', !!hidden);
  setSwitch('merArchivedSwitch', !!archived);

  // creators chips state
  __merEnsureCreatorsState(overlay, creators);
  __merSyncCreatorsHiddenInput(overlay);
  __merRenderCreatorsChips(overlay);
  const elCreatorsSearch = document.getElementById('merCreatorsSearch');
  if (elCreatorsSearch) elCreatorsSearch.value = '';

  // hydrate creator names
  (async () => {
    const state = overlay?.__merCreatorsState;
    const list = Array.isArray(state?.list) ? state.list : [];
    if (!list.length) return;

    let changed = false;
    for (const c of list) {
      if (c?.name) continue;
      if (!/^\d+$/.test(String(c?.id || ''))) continue;
      const prof = await __merFetchUserProfile(String(c.id));
      const nm = __merUserDisplayName(prof);
      if (nm && nm !== c.name) {
        c.name = nm;
        changed = true;
      }
    }
    if (changed) __merRenderCreatorsChips(overlay);
  })();

  // dropdowns
  const categoryOptions =
    (typeof CATEGORY_OPTIONS !== 'undefined' && Array.isArray(CATEGORY_OPTIONS) && CATEGORY_OPTIONS.length)
      ? CATEGORY_OPTIONS
      : __MER_CATEGORY_OPTIONS;

  const difficultyOptions =
    (typeof DIFFICULTY_FINE_OPTIONS !== 'undefined' && Array.isArray(DIFFICULTY_FINE_OPTIONS) && DIFFICULTY_FINE_OPTIONS.length)
      ? DIFFICULTY_FINE_OPTIONS
      : __MER_DIFFICULTY_FINE_OPTIONS;

  __merPopulateRadioDropdown('merCategoryDropdown', categoryOptions, 'mer_category');
  __merPopulateRadioDropdown('merDifficultyDropdown', difficultyOptions, 'mer_difficulty');
  __merSetRadioValue('merCategoryDropdown', category || '');
  __merSetRadioValue('merDifficultyDropdown', difficulty || '');

  (async () => {
    let mechanicsOptions =
      (typeof MECHANICS_OPTIONS !== 'undefined' && Array.isArray(MECHANICS_OPTIONS) && MECHANICS_OPTIONS.length)
        ? MECHANICS_OPTIONS
        : null;
    let restrictionsOptions =
      (typeof RESTRICTIONS_OPTIONS !== 'undefined' && Array.isArray(RESTRICTIONS_OPTIONS) && RESTRICTIONS_OPTIONS.length)
        ? RESTRICTIONS_OPTIONS
        : null;

    if (!mechanicsOptions || !restrictionsOptions) {
      const filled = await __merFillMechanicsAndRestrictions();
      mechanicsOptions = filled.mechanicsOptions?.length ? filled.mechanicsOptions : mechanics.map((m) => ({ translated: m, value: m, raw: m }));
      restrictionsOptions = filled.restrictionsOptions?.length ? filled.restrictionsOptions : restrictions.map((r) => ({ translated: r, value: r, raw: r }));
    }

    __merPopulateCheckboxDropdown('merMechanicsDropdown', mechanicsOptions, 'mer_mechanics');
    __merPopulateCheckboxDropdown('merRestrictionsDropdown', restrictionsOptions, 'mer_restrictions');

    try {
      const resp = await fetch(`/api/autocomplete/tags?search=&limit=20`, { headers: { Accept: 'application/json' } });
      if (resp.ok) {
        const json = await resp.json().catch(() => null);
        if (Array.isArray(json) && json.length) {
          const opts = json.map((it) => ({ translated: String(it || ''), value: String(it || ''), raw: String(it || '') }));
          __merPopulateCheckboxDropdown('merTagsDropdown', opts, 'mer_tags');
        } else {
          __merPopulateCheckboxDropdown('merTagsDropdown', TAG_OPTIONS.map(o => ({ translated: o.text, value: o.value, raw: o.raw })), 'mer_tags');
        }
      } else {
        __merPopulateCheckboxDropdown('merTagsDropdown', TAG_OPTIONS.map(o => ({ translated: o.text, value: o.value, raw: o.raw })), 'mer_tags');
      }
    } catch (e) {
      __merPopulateCheckboxDropdown('merTagsDropdown', TAG_OPTIONS.map(o => ({ translated: o.text, value: o.value, raw: o.raw })), 'mer_tags');
    }
    __merSetCheckboxValues('merMechanicsDropdown', mechanics);
    __merSetCheckboxValues('merRestrictionsDropdown', restrictions);
    __merSetCheckboxValues('merTagsDropdown', tags);
  })();

  // autocomplete mount once
  const mapNameBox = document.getElementById('merMapNameSuggestions');
  if (overlay.__merMounted?.auto !== true) {
    __merSetupAutocomplete({
      inputEl: elMapName,
      boxEl: mapNameBox,
      kind: 'map-names',
      minChars: 1,
      onPick: async (it) => {
        if (!elMapName) return;
        const raw = String(it.raw || it.label || '').trim();
        const label = String(it.label || raw).trim();
        elMapName.value = label;

        let english = raw;
        try {
          const resolved = await resolveEnglishMapNameExact(raw);
          if (resolved) english = resolved;
        } catch {}
        elMapName.setAttribute('data-raw-value', english || raw || label);
      },
    });

    elMapName?.addEventListener('input', () => {
      if (!elMapName) return;
      elMapName.setAttribute('data-raw-value', elMapName.value || '');
    });

    const creatorBox = document.getElementById('merCreatorSuggestions');
    __merSetupAutocomplete({
      inputEl: elCreatorsSearch,
      boxEl: creatorBox,
      kind: 'users',
      minChars: 1,
      onPick: (it) => {
        const pickedId = String(it.raw ?? it.data?.user_id ?? it.data?.id ?? '').trim();
        if (!/^\d+$/.test(pickedId)) return;
        __merAddCreatorToState(overlay, { id: pickedId, name: it.label || '' });
        if (elCreatorsSearch) elCreatorsSearch.value = '';
      },
    });

    overlay.__merMounted = overlay.__merMounted || {};
    overlay.__merMounted.auto = true;
  }

  // -------------------------
  // Baseline snapshot
  // -------------------------
  const baseline = {
    code,
    official: !!official,
    hidden: !!hidden,
    archived: !!archived,
    new_code: '',
    map_name: mapName,
    category,
    checkpoints: checkpoints == null ? '' : String(checkpoints),
    difficulty,
    mechanics: mechanics.slice(),
    restrictions: restrictions.slice(),
    tags: tags.slice(),
    title,
    description,
    custom_banner: customBanner,
    medals: { gold: medalGold, silver: medalSilver, bronze: medalBronze },
    creators: creators.slice(),
  };

  overlay.__merBaseline = baseline;
  overlay.__merOpts = opts;

  // -------------------------
  // Send handler
  // -------------------------
  const sendBtn = document.getElementById('merSendBtn');
  if (sendBtn && overlay.__merMounted?.send !== true) {
    sendBtn.onclick = async () => {
      const baselineNow = overlay.__merBaseline;
      const optsNow = overlay.__merOpts || {};

      const createdBy = __merGetSafeUserIdString?.() || null;
      if (!createdBy) {
        __merWarn(
          (typeof t === 'function' && t('map_edit_request.login_required') && t('map_edit_request.login_required') !== 'map_edit_request.login_required')
            ? t('map_edit_request.login_required')
            : 'You must be logged in to send a map edit request.'
        );
        return;
      }

      const reasonEl = document.getElementById('merReason');
      const reason = (reasonEl?.value || '').trim();
      if (!reason) {
        __merWarn(
          (typeof t === 'function' && t('map_edit_request.reason_required') && t('map_edit_request.reason_required') !== 'map_edit_request.reason_required')
            ? t('map_edit_request.reason_required')
            : 'Please provide a reason.'
        );
        try { reasonEl?.focus?.(); } catch {}
        return;
      }

      // ---------- Build flat payload----------
      const payload = {
        code: String(baselineNow.code),
        created_by: String(createdBy),
        reason: String(reason),
      };

      // new_code
      const uiNewCode = (document.getElementById('merNewCode')?.value || '').trim();
      if (uiNewCode) payload.new_code = uiNewCode;

      // map_name
      const elMapNameNow = document.getElementById('merMapName');
      const uiMapName = String(elMapNameNow?.getAttribute('data-raw-value') || elMapNameNow?.value || '').trim();
      if (!equalScalar(uiMapName, baselineNow.map_name)) payload.map_name = uiMapName === '' ? null : uiMapName;

      // category/difficulty
      const uiCategory = __merGetRadioValue('merCategoryDropdown');
      if (!equalScalar(uiCategory, baselineNow.category)) payload.category = uiCategory === '' ? null : uiCategory;

      const uiDifficulty = __merGetRadioValue('merDifficultyDropdown');
      if (!equalScalar(uiDifficulty, baselineNow.difficulty)) payload.difficulty = uiDifficulty === '' ? null : uiDifficulty;

      // checkpoints
      const uiCheckpointsStr = String(document.getElementById('merCheckpoints')?.value ?? '').trim();
      if (!equalScalar(uiCheckpointsStr, baselineNow.checkpoints)) {
        const n = Number(uiCheckpointsStr);
        payload.checkpoints = uiCheckpointsStr === '' ? null : (Number.isFinite(n) ? Math.trunc(n) : null);
      }

      // switches
      const uiOfficial = getSwitch('merOfficialSwitch');
      const uiHidden   = getSwitch('merHiddenSwitch');
      const uiArchived = getSwitch('merArchivedSwitch');

      if (uiOfficial !== null && uiOfficial !== baselineNow.official) payload.official = uiOfficial;
      if (uiHidden   !== null && uiHidden   !== baselineNow.hidden)   payload.hidden   = uiHidden;
      if (uiArchived !== null && uiArchived !== baselineNow.archived) payload.archived = uiArchived;

      // mechanics/restrictions
      const uiMechanics = __merGetCheckboxValues('merMechanicsDropdown');
      if (!equalArray(uiMechanics, baselineNow.mechanics)) payload.mechanics = uiMechanics.length ? uiMechanics : null;

      const uiRestrictions = __merGetCheckboxValues('merRestrictionsDropdown');
      if (!equalArray(uiRestrictions, baselineNow.restrictions)) payload.restrictions = uiRestrictions.length ? uiRestrictions : null;

      const uiTags = __merGetCheckboxValues('merTagsDropdown');
      if (!equalArray(uiTags, baselineNow.tags)) payload.tags = uiTags.length ? uiTags : null;

      // title/description
      const uiTitle = (document.getElementById('merTitle')?.value || '').trim();
      if (!equalScalar(uiTitle, baselineNow.title)) payload.title = uiTitle === '' ? null : uiTitle;

      const uiDesc = (document.getElementById('merDescription')?.value || '').trim();
      if (!equalScalar(uiDesc, baselineNow.description)) payload.description = uiDesc === '' ? null : uiDesc;

      // custom_banner
      const uiBanner = (document.getElementById('merCustomBanner')?.value || '').trim();
      if (!equalScalar(uiBanner, baselineNow.custom_banner)) payload.custom_banner = uiBanner === '' ? null : uiBanner;

      // medals
      const uiGoldStr = (document.getElementById('merMedalGold')?.value || '').trim();
      const uiSilverStr = (document.getElementById('merMedalSilver')?.value || '').trim();
      const uiBronzeStr = (document.getElementById('merMedalBronze')?.value || '').trim();

      const medalsChanged =
        !equalScalar(uiGoldStr, baselineNow.medals.gold) ||
        !equalScalar(uiSilverStr, baselineNow.medals.silver) ||
        !equalScalar(uiBronzeStr, baselineNow.medals.bronze);

      if (medalsChanged) {
        const g = __merReadNumber(uiGoldStr);
        const s = __merReadNumber(uiSilverStr);
        const b = __merReadNumber(uiBronzeStr);
        payload.medals = (g == null && s == null && b == null) ? null : { gold: g, silver: s, bronze: b };
      }

      // creators
      const stateList = Array.isArray(overlay?.__merCreatorsState?.list) ? overlay.__merCreatorsState.list : [];
      const uiCreators = stateList
        .map((c) => ({ id: toSafeId(String(c.id || '').trim()), is_primary: !!c.is_primary }))
        .filter((c) => String(c.id).trim().length > 0);

      const baseCreatorsNorm = normalizeCreators(baselineNow.creators).map((c) => ({
        id: toSafeId(String(c.id).trim()),
        is_primary: !!c.is_primary,
      }));

      const sameCreators =
        baseCreatorsNorm.length === uiCreators.length &&
        baseCreatorsNorm.every((c, i) => String(c.id) === String(uiCreators[i].id) && !!c.is_primary === !!uiCreators[i].is_primary);

      if (!sameCreators) payload.creators = uiCreators.length ? uiCreators : null;

      // warn
      const keys = Object.keys(payload);
      if (keys.length <= 3) {
        __merWarn(
          (typeof t === 'function' && t('map_edit_request.no_changes') && t('map_edit_request.no_changes') !== 'map_edit_request.no_changes')
            ? t('map_edit_request.no_changes')
            : 'No changes detected.'
        );
        return;
      }

      // ---------- send ----------
      try {
        sendBtn.disabled = true;
        sendBtn.classList.add(...String('opacity-70').trim().split(/\s+/).filter(Boolean), ...String('cursor-not-allowed').trim().split(/\s+/).filter(Boolean));

        const endpoint = (optsNow.endpoint || '/api/maps/map-edits');
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const contentType = resp.headers.get('content-type') || '';
        const data = contentType.includes('application/json') ? await resp.json() : await resp.text();

        if (!resp.ok) {
          __merErr(__merFormatApiError(data, resp.status));
          return;
        }

        showConfirmationMessage(t('map_edit_request.sent') || 'Map edit request sent');

        const autoClose = optsNow.autoClose ?? true;
        if (autoClose) setTimeout(() => overlay.__merClose?.(), 700);
      } catch (e) {
        __merErr(e?.message || 'Network error');
      } finally {
        sendBtn.disabled = false;
        sendBtn.classList.remove(...String('opacity-70').trim().split(/\s+/).filter(Boolean), ...String('cursor-not-allowed').trim().split(/\s+/).filter(Boolean));
      }
    };

    overlay.__merMounted = overlay.__merMounted || {};
    overlay.__merMounted.send = true;
  }

  setTimeout(() => {
    try { document.getElementById('merReason')?.focus?.(); } catch {}
  }, 0);
}

async function openSearchDetailsModal(r, opts = {}) {
  if (!r) return;
  const { fromUrl = false, syncUrl = true } = opts || {};
  ensureSearchDetailsModal();

  const mapCode = r?.code || '';
  if (syncUrl && !fromUrl && mapCode) __urlOpenModal('map', { code: mapCode }, { push: true });

  const tSafe = (k, d) => (typeof t === 'function' ? t(k) : d);
  // Change requests
  const __merBtn = document.getElementById('btnOpenMapEditRequest');
  const __merBtnText = document.getElementById('btnOpenMapEditRequestText');
  if (__merBtnText) __merBtnText.textContent = t('map_edit_request.title');
  if (__merBtn) {
    const __logged = typeof window !== 'undefined' && window.user_id != null && String(window.user_id).trim() !== '';
    __merBtn.disabled = !__logged;
(() => { const __obj = __merBtn; let __last; for (const __c of String('opacity-50').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !__logged); return __last; })();
(() => { const __obj = __merBtn; let __last; for (const __c of String('cursor-not-allowed').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !__logged); return __last; })();
(() => { const __obj = __merBtn; let __last; for (const __c of String('cursor-pointer').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, __logged); return __last; })();
    __merBtn.title = __logged ? t('map_edit_request.map_edit_btn') : t('map_edit_request.map_edit_btn_login');
    __merBtn.onclick = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (!__logged) return;
      openMapEditRequestModal(r);
    };
  }

  const esc = (s) => String(s ?? "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
  const fmt = (n)=> typeof n==="number" ? new Intl.NumberFormat().format(n) : String(n ?? "0");
  const star5 = (val=0)=> {
    const on = Math.max(0, Math.min(5, Math.round(Number(val)||0)));
    return "★★★★★".slice(0,on) + "☆☆☆☆☆".slice(0,5-on);
  };
  const diffSlug = (d='') => {
    const L = String(d).toLowerCase();
    if (L.startsWith('very hard')) return 'veryhard';
    if (L.startsWith('extreme'))   return 'extreme';
    if (L.startsWith('hell'))      return 'hell';
    if (L.startsWith('hard'))      return 'hard';
    if (L.startsWith('medium'))    return 'medium';
    return 'easy';
  };
  const setCompletedChip = (el, isDone)=>{
    if (!el) return;
    if (isDone) {
      el.className = 'inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300 ring-1 ring-emerald-400/30';
      el.innerHTML = '<span class="h-2 w-2 rounded-full bg-emerald-400"></span> ' + esc(tSafe('card.completed','Completed'));
    } else {
      el.className = 'inline-flex items-center gap-2 rounded-full bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 px-3 py-1 text-sm font-medium text-zinc-900 dark:text-white/80 ring-1 ring-zinc-300/60 dark:ring-white/15';
      el.innerHTML = '<span class="h-2 w-2 rounded-full bg-white/60"></span> ' + esc(tSafe('card.not_completed','Not completed'));
    }
  };
  const mountPills = (container, items=[]) => {
    container.innerHTML = '';
    items.filter(Boolean).forEach(txt=>{
      const s = document.createElement('span');
      s.className = 'inline-flex items-center rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 backdrop-blur px-2.5 py-1 text-[11px] leading-none text-zinc-900 dark:text-white/85';
      s.textContent = txt;
      container.appendChild(s);
    });
  };

  // data
  const mapNameKey = (r.original_map_name || r.map_name || 'default')
    .toLowerCase()
    .replace(/[()\s':]/g, '');
  const cover = cdnImage(`assets/map_banners/${mapNameKey}.png`);
  const names = (typeof pickCreatorNames === 'function' ? pickCreatorNames(r) : []).filter(Boolean);
  const typeText = Array.isArray(r.category) ? r.category.join(', ') : (r.category || 'Classic');
  const difficulty = r.difficulty || 'Easy';
  const qualityRaw = r.ratings!=null ? r.ratings : r.quality;
  const qualityStars = qualityRaw!=null ? star5(qualityRaw) : '—';
  const medalGold   = r.medals?.gold   ?? r.gold   ?? '—';
  const medalSilver = r.medals?.silver ?? r.silver ?? '—';
  const medalBronze = r.medals?.bronze ?? r.bronze ?? '—';
  const code = r.code || '';
  const desc = r.description || r.desc || tSafe('no_description','No description available');
  const checkpoints = r.checkpoints ?? '—';
  const upvotes = r.upvotes ?? '—';
  const hasNonNullTime = r.time!=null && String(r.time).trim().toLowerCase()!=='null';
  const completed = Boolean(window.user_id) && (r.user_has_completion || r.user_has_record || r.user_completed || hasNonNullTime);
  const linkedCode = r.linked_code || r.linkedCode || '';
  const isOfficial = (()=>{
    if (typeof r.official !== 'undefined') return Boolean(r.official);
    if (typeof r.is_official !== 'undefined') return Boolean(r.is_official);
    return null;
  })();

  let guides = [];
  if (Array.isArray(r.guides)) {
    guides = r.guides.filter(Boolean);
  } else if (typeof r.guides === 'string' && r.guides.trim() !== '') {
    guides = [r.guides.trim()];
  }

  let mechanics = Array.isArray(r.mechanics) ? r.mechanics : [];
  let restrictions = Array.isArray(r.restrictions) ? r.restrictions : [];
  let tags = Array.isArray(r.tags) ? r.tags : [];
  if (typeof CURRENT_LANG!=='undefined' && CURRENT_LANG==='cn') {
    mechanics = mechanics.map(o=> (typeof t==='function' ? (t(`mechanics.${String(o).toLowerCase().replace(/ /g,'_')}`) || o) : o));
    restrictions = restrictions.map(o=> (typeof t==='function' ? (t(`restrictions.${String(o).toLowerCase().replace(/ /g,'_')}`) || o) : o));
  }

  const img = document.getElementById('mapModalCover');
  if (img) {
    img.src = cover;
    const fb = cdnImage(`assets/map_banners/${mapNameKey}.png`);
    img.addEventListener('error', ()=>{ if (img.src !== fb) img.src = fb; }, { once:true });
  }

  setCompletedChip(document.getElementById('mapCompleted'), completed);

  const g = (id, v)=> { const el=document.getElementById(id); if (el) el.textContent = v; };
  g('mapCode', code || '—');
  g('mapGold', medalGold);
  g('mapSilver', medalSilver);
  g('mapBronze', medalBronze);
  g('mapDescription', desc);
  mountPills(document.getElementById('mapMechanics'), mechanics);
  mountPills(document.getElementById('mapRestrictions'), restrictions);
  mountPills(document.getElementById('mapTags'), tags);

  g('mapCreator', names.join(', ') || 'N/A');
  g('mapCheckpoints', fmt(checkpoints));
  g('mapUpvotes', fmt(upvotes));
  g('mapTypeDetail', typeText || '—');
  g('mapDiffDetail', difficulty || '—');
  g('mapQualityDetail', qualityStars);
    const statusText =
    isOfficial === null
      ? '—'
      : (isOfficial ? t('card.official', 'Official') : t('card.unofficial', 'Unofficial'));

  g('mapStatus', statusText);

  const guideBtn = document.getElementById('btnGuide');
  if (guideBtn) {
    if (guides.length) {
      const href = String(guides[0]);
      guideBtn.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
      guideBtn.setAttribute('data-href', href);
      guideBtn.setAttribute('aria-disabled', 'false');
      guideBtn.title = tSafe('card.open_guide', 'Open guide');
    } else {
      guideBtn.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
      guideBtn.classList.remove(...String('inline-flex').trim().split(/\s+/).filter(Boolean));
      guideBtn.removeAttribute('data-href');
      guideBtn.setAttribute('aria-disabled', 'true');
      guideBtn.title = '';
    }
  }

  const linkedWrap     = document.getElementById('linkedCodeContainer');
  const linkedLabelEl  = document.getElementById('linkedCodeLabel');
  const linkedCodeEl   = document.getElementById('linkedCode');

  if (linkedWrap && linkedLabelEl && linkedCodeEl) {
    if (linkedCode && isOfficial !== null) {
      const label = isOfficial
        ? tSafe('thead.unofficialCode', 'Unofficial code')
        : tSafe('thead.officialCode',   'Official code');

      linkedLabelEl.textContent = label;
      linkedCodeEl.textContent  = linkedCode;

      linkedWrap.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
    } else {
      linkedWrap.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    }
  }

  const chartHost = document.getElementById('chartContainer');
  if (chartHost) {
    try {
      showProgressionLoading();
      const [stats, progressionData] = await Promise.all([
        fetchMapCompletionStatistics(r.code),
        fetchProgression(r.code),
      ]);
      renderProgressionChart(progressionData, stats);
    } catch (e) {
      console.error(e);
      chartHost.innerHTML = `<p class="text-center font-semibold text-red-500">An error occurred. Please try again later.</p>`;
    }
  }

  const overlay = document.getElementById('detailsModalOverlay');
  const gradientWrap = overlay.querySelector('.bg-gradient-to-tr');
  overlay.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean)); overlay.classList.add(...String('flex').trim().split(/\s+/).filter(Boolean));
  requestAnimationFrame(() => {
    overlay.classList.remove(...String('opacity-0').trim().split(/\s+/).filter(Boolean)); overlay.classList.add(...String('opacity-100').trim().split(/\s+/).filter(Boolean));
    gradientWrap.classList.remove(...String('translate-y-3').trim().split(/\s+/).filter(Boolean), ...String('opacity-0').trim().split(/\s+/).filter(Boolean)); gradientWrap.classList.add(...String('translate-y-0').trim().split(/\s+/).filter(Boolean), ...String('opacity-100').trim().split(/\s+/).filter(Boolean));
  });

  const closeBtn = document.getElementById('modalCloseBtn');
  const close = () => {
    overlay.classList.add(...String('opacity-0').trim().split(/\s+/).filter(Boolean)); overlay.classList.remove(...String('opacity-100').trim().split(/\s+/).filter(Boolean));
    gradientWrap.classList.add(...String('translate-y-3').trim().split(/\s+/).filter(Boolean), ...String('opacity-0').trim().split(/\s+/).filter(Boolean)); gradientWrap.classList.remove(...String('translate-y-0').trim().split(/\s+/).filter(Boolean), ...String('opacity-100').trim().split(/\s+/).filter(Boolean));
    setTimeout(() => { overlay.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean)); overlay.classList.remove(...String('flex').trim().split(/\s+/).filter(Boolean)); }, 180);
    document.removeEventListener('keydown', onEsc);
    overlay.removeEventListener('pointerdown', onOutside, true);
    if (!__suppressUrlSync) __urlHandleModalUserClose('map');
  };
  overlay.__sfClose = close;
  const onEsc = (e)=> { if (e.key==='Escape') close(); };
  const onOutside = (e)=> { const box = document.getElementById('detailsModalBox'); if (!box.contains(e.target)) close(); };

  closeBtn?.addEventListener('click', close, { once:true });
  document.addEventListener('keydown', onEsc);
  overlay.addEventListener('pointerdown', onOutside, true);
}

/* =========================
   RENDER PERSONAL RECORDS
   ========================= */
function prAccentColor(row) {
  const d = difficultyColors[normalizeDifficulty(row.difficulty || '')];
  return d || '#3b82f6';
}
const __prAxCache = new Map();
function prAccentClass(color) {
  const hex = String(color || '#3b82f6')
    .toLowerCase()
    .replace(/[^a-f0-9#]/g, '');
  if (!__prAxCache.has(hex)) {
    const cls = `pr-ax-${hex.replace(/#/g, '') || 'x'}`;
    __addRule(`.${cls}`, `--accent:${hex}`);
    __prAxCache.set(hex, cls);
  }
  return __prAxCache.get(hex);
}
async function displayPersonalRecordsResultsCards(rowsInput) {
  const rows = Array.isArray(rowsInput) ? rowsInput : normalizeToRows(rowsInput, 'personal');
  const filtered = rows.filter((r) => r && r.code && r.code !== 'N/A');

  if (filtered.length === 0) {
    const message = t('popup.no_results');
    renderMessage(message);
    const rc = document.getElementById('resultsContainer');
    if (rc) {
      rc.innerHTML = `
        <div class="mt-4 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 px-4 py-6 text-center text-sm text-zinc-700 dark:text-zinc-300">
          ${message}
        </div>
      `;
    }
    return;
  }

  const iconClock  = '<svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20Zm1 5v5.2l3 1.8a1 1 0 1 1-1 1.7l-3.6-2.1A1 1 0 0 1 10.5 13V7a1 1 0 1 1 2 0Z"/></svg>';
  const iconMedal  = '<svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true"><path fill="currentColor" d="M12 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8 3-6h8l3 6-5-2-4 2-5-2Z"/></svg>';
  const iconDiff   = '<svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true"><path fill="currentColor" d="M4 4h16v2H4zm0 7h16v2H4zm0 7h16v2H4z"/></svg>';
  const iconRank   = '<svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true"><path fill="currentColor" d="M7 17h10v2H7zM9 7h6v8H9z"/></svg>';
  const iconCheck  = '<svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true"><path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
  const iconCopy   = '<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"></rect><rect x="3" y="3" width="13" height="13" rx="2"></rect></svg>';
  const iconPlay   = '<svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';

  const cardsHTML = filtered.map((r) => {
    const code = r.code || 'N/A';
    const nickname = r.name || r.nickname || 'N/A';
    const also = r.also_known_as || r.discord_tag || '';
    const uid = r.user_id ? String(r.user_id) : '';
    const profileHref = uid ? `rank_card?user_id=${encodeURIComponent(uid)}` : '#';
    const avatarFB = defaultAvatarFromId(uid || '0');

    const isCompletion = r.completion === true;
    const timeVal = r.time;

    const CUTOFF = 15900;

    const timeNum = Number(timeVal);
    const hasNumericTime = timeVal != null && timeVal !== '' && Number.isFinite(timeNum);

    const timeDisplay =
      (hasNumericTime && timeNum <= CUTOFF)
        ? timeNum.toFixed(2)
        : (hasNumericTime && timeNum > CUTOFF)
          ? (t('completion') || 'Completion')
          : (isCompletion ? (t('completion') || 'Completion') : 'N/A');
    const medal = r.medal || '—';
    const diff  = r.difficulty || 'N/A';
    const rank  = r.rank != null ? String(r.rank) : null;
    const verified = r.verified === true;

    const accent = prAccentColor(r);
    const accentCls = prAccentClass(accent);

    const medalBadge =
      (String(medal).toLowerCase() === 'gold')   ? 'mx-card--gold'   :
      (String(medal).toLowerCase() === 'silver') ? 'mx-card--silver' :
      (String(medal).toLowerCase() === 'bronze') ? 'mx-card--bronze' : '';

    const medalKeyNorm = String(medal).trim().toLowerCase();
    const medalIcon =
      medalKeyNorm === 'gold'   ? cdnAsset('assets/medals/gold.png')   :
      medalKeyNorm === 'silver' ? cdnAsset('assets/medals/silver.png') :
      medalKeyNorm === 'bronze' ? cdnAsset('assets/medals/bronze.png') : null;

    const videoBtn = r.video
      ? `<a href="${escAttr(r.video)}" target="_blank" rel="noopener" class="pr-btn" title="${escAttr(t('watch')||'Watch')}">${iconPlay}<span>${esc(t('watch')||'Watch')}</span></a>`
      : '';

    return `
      <article class="pr-card ${medalBadge} ${accentCls}">
        <span class="pr-accent" aria-hidden="true"></span>

        <!-- Header -->
        <div class="pr-hd">
          <a href="${escAttr(profileHref)}" title="${escAttr(nickname)}">
            <img class="pr-avatar" src="${escAttr(avatarFB)}" alt="" loading="lazy" decoding="async"
                 referrerpolicy="no-referrer" data-avatar-id="${escAttr(uid)}" data-avatar-size="64"
                 data-fallback-src="${escAttr(avatarFB)}"/>
          </a>
          <div class="pr-names">
            <div class="pr-title" data-sf="${escAttr(nickname)}">${esc(nickname)}</div>
            ${also ? `<div class="pr-sub">${esc(also)}</div>` : ''}
          </div>
        </div>

        <!-- Stats -->
        <div class="pr-stats">
          <div class="pr-tile">
            <div class="pr-tk">${iconClock}<span>${esc(t('thead.mapTime')||'Time')}</span></div>
            <div class="pr-tv" data-sf="${escAttr(timeDisplay)}">${esc(timeDisplay)}</div>
          </div>
          <div class="pr-tile">
            <div class="pr-tk">${iconMedal}<span>${esc(t('thead.mapMedal')||'Medal')}</span></div>
            <div class="pr-tv">
              <span class="inline-flex items-center gap-1.5">
                ${medalIcon ? `<img src="${escAttr(medalIcon)}" alt="${escAttr(medal)}"
                                    class="h-4 w-4 object-contain rounded-[3px]" loading="lazy" decoding="async">` : ''}
                <span data-sf="${escAttr(medal)}">${esc(medal)}</span>
              </span>
            </div>
          </div>
          <div class="pr-tile">
            <div class="pr-tk">${iconDiff}<span>${esc(t('thead.mapDifficulty')||'Difficulty')}</span></div>
            <div class="pr-tv"><span data-sf="${escAttr(diff)}">${esc(diff)}</span></div>
          </div>
          ${rank ? `
          <div class="pr-tile">
            <div class="pr-tk">${iconRank}<span>Rank</span></div>
            <div class="pr-tv">#${esc(rank)}</div>
          </div>` : `
          <div class="pr-tile">
            <div class="pr-tk">${iconCheck}<span>${esc(t('thead.mapVerified')||'Verified')}</span></div>
            <div class="pr-tv">${verified ? '✓' : '—'}</div>
          </div>`}
        </div>

        <!-- Bottom -->
        <div class="pr-bottom">
          <div class="pr-actions">
            ${videoBtn}
          </div>
          <button type="button" class="pr-btn copy-map-code" data-code="${escAttr(code)}"
                  aria-label="${escAttr(t('popup.copy_map_code')||'Copy code')}" title="${escAttr(t('popup.copy_map_code')||'Copy code')}">
            ${iconCopy}<span class="pr-code" data-sf="${escAttr(code)}">${esc(code)}</span>
          </button>
        </div>
      </article>
    `;
  }).join('');

  const shell = `
    <section class="mx-wrap">
      <div class="pr-grid">
        ${cardsHTML}
      </div>
    </section>
  `;
  setResultsHTML(shell);

  const root = document.getElementById('resultsContainer');

  refreshAvatarLazyLoading(root);
  root.querySelectorAll('img[data-fallback-src]').forEach((img) => {
    const fb = img.getAttribute('data-fallback-src');
    img.addEventListener('error', () => { if (img.src !== fb) img.src = fb; }, { once:true });
  });

  applySplitFlap(root);

  if (root && root.dataset.copyDelegated !== '1') {
    root.dataset.copyDelegated = '1';
    root.addEventListener('click', (e) => {
      const btn = e.target.closest('.copy-map-code'); if (!btn) return;
      e.preventDefault();
      const code = btn.getAttribute('data-code') || btn.textContent.trim();
      if (code && code !== 'N/A') copyMapCode(code);
    });
    root.addEventListener('keydown', (e) => {
      const btn = e.target.closest('.copy-map-code'); if (!btn) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const code = btn.getAttribute('data-code') || btn.textContent.trim();
        if (code && code !== 'N/A') copyMapCode(code);
      }
    });
  }

  Array.from(root.querySelectorAll('.pr-card')).forEach((el, i) =>
    setTimeout(() => el.classList.add(...String('is-in').trim().split(/\s+/).filter(Boolean)), 24 * i)
  );
}


// ================== TABLE DISPLAY ============== //
async function displayPersonalRecordsResults(results) {
  const rows = Array.isArray(results.results) ? results.results : [];
  const filtered = rows.filter((r) => r.code && r.code !== 'N/A');

  if (filtered.length === 0) {
    const message = t('popup.no_results');
    renderMessage(message);
    const rc = document.getElementById('resultsContainer');
    if (rc) {
      rc.innerHTML = `
        <div class="mt-4 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 px-4 py-6 text-center text-sm text-zinc-700 dark:text-zinc-300">
          ${message}
        </div>
      `;
    }
    return;
  }

  let currentUserAvatar = null;
  let currentUid = null;

  try {
    if (window.user_id != null) {
      currentUid = String(window.user_id);
      const url = await fetchAvatarUrlForUserId(currentUid);
      currentUserAvatar = url || defaultAvatarFromId(currentUid);
    }
  } catch {
    currentUserAvatar = null;
  }

  let avatarMap = new Map();
  if (!currentUserAvatar) {
    const allIds = [...new Set(filtered.map((r) => r.user_id).filter(Boolean).map(String))];
    avatarMap = await resolveCreatorAvatars(allIds);
  }

  const headerHTML = `
    <div class="sticky top-0 z-10 bg-white/75 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 font-semibold grid grid-personal_records px-3 py-2">
      <div class="whitespace-nowrap">${t('thead.mapCode')}</div>
      <div class="whitespace-nowrap">${t('thead.mapNickname')}</div>
      <div class="whitespace-nowrap">${t('thead.mapDiscordTag')}</div>
      <div class="whitespace-nowrap">${t('thead.mapDifficulty')}</div>
      <div class="whitespace-nowrap">${t('thead.mapTime')}</div>
      <div class="whitespace-nowrap">${t('thead.mapMedal')}</div>
    </div>
  `;

  const rowsHTML = filtered.map((r) => {
    const diff = r.difficulty || 'N/A';
    const diffColor = difficultyColors[normalizeDifficulty(diff)] || '#fff';

    const isCompletion = r.completion === true;
    const timeVal = r.time;

    const CUTOFF = 15900;

    const timeNum = Number(timeVal);
    const hasNumericTime = timeVal != null && timeVal !== '' && Number.isFinite(timeNum);

    const timeDisplay =
      (hasNumericTime && timeNum <= CUTOFF)
        ? timeNum.toFixed(2)
        : (hasNumericTime && timeNum > CUTOFF)
          ? (t('completion') || 'Completion')
          : (isCompletion ? (t('completion') || 'Completion') : 'N/A');

    const uid = r.user_id ? String(r.user_id) : null;
    const fallback = currentUid ? defaultAvatarFromId(currentUid) : defaultAvatarFromId(uid || '0');

    const profileHref = uid ? `rank_card?user_id=${encodeURIComponent(uid)}` : null;
    const nickname = r.name || r.nickname || 'N/A';
    const also = r.also_known_as || r.discord_tag || 'N/A';

    const medalText = r.medal || 'N/A';
    const medalKey = String(medalText).trim().toLowerCase();
    const medalIcon =
      medalKey === 'gold'   ? cdnAsset('assets/medals/gold.png')   :
      medalKey === 'silver' ? cdnAsset('assets/medals/silver.png') :
      medalKey === 'bronze' ? cdnAsset('assets/medals/bronze.png') : null;

    const mapCodeCell = r.code
      ? `
        <button type="button"
          class="copy-map-code group relative z-10 inline-flex items-center gap-1 rounded-md border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 px-2 py-0.5
                 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-white/85 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 cursor-pointer
                 w-[6.5rem]"
          data-code="${escAttr(r.code)}"
          title="${escAttr(t('popup.copy_map_code'))}">
          <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2"></rect>
            <rect x="3" y="3" width="13" height="13" rx="2"></rect>
          </svg>
          <span data-sf="${escAttr(r.code)}"></span>
        </button>`
      : `<span data-sf="N/A">N/A</span>`;

  const nicknameBlock = profileHref
    ? `
      <a href="${escAttr(profileHref)}"
        class="inline-flex items-center gap-2 rounded-md hover:bg-zinc-100 dark:hover:bg-white/10 px-1.5 py-0.5"
        title="${escAttr(nickname)}">
        <img class="h-6 w-6 rounded-full object-cover ring-1 ring-zinc-300/60 dark:ring-white/10 bg-zinc-100 dark:bg-zinc-800"
            alt="" referrerpolicy="no-referrer" loading="lazy" decoding="async"
            src="${escAttr(fallback)}"
            data-avatar-id="${escAttr(uid || '')}" data-avatar-size="64"
            data-fallback-src="${escAttr(fallback)}"/>
        <span data-sf="${escAttr(nickname)}"></span>
      </a>`
    : `
      <div class="flex items-center gap-2">
        <img class="h-6 w-6 rounded-full object-cover ring-1 ring-zinc-300/60 dark:ring-white/10 bg-zinc-100 dark:bg-zinc-800"
            alt="" referrerpolicy="no-referrer" loading="lazy" decoding="async"
            src="${escAttr(fallback)}"
            data-avatar-id="${escAttr(uid || '')}" data-avatar-size="64"
            data-fallback-src="${escAttr(fallback)}"/>
        <span data-sf="${escAttr(nickname)}"></span>
      </div>`;

    return `
      <div class="grid grid-personal_records bg-white/70 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-white/10 transition px-3 py-2">
        <div class="min-w-0">${mapCodeCell}</div>
        <div class="min-w-0">${nicknameBlock}</div>
        <div class="min-w-0"><span class="truncate block" data-sf="${escAttr(also)}">${esc(also)}</span></div>
        <div class="min-w-0">
          <span class="${__clsTextColor(diffColor)}">
            <span data-sf="${escAttr(r.difficulty || 'N/A')}">${esc(r.difficulty || 'N/A')}</span>
          </span>
        </div>
        <div class="min-w-0"><span data-sf="${escAttr(timeDisplay)}">${esc(timeDisplay)}</span></div>
        <div class="min-w-0">
          <span class="inline-flex items-center gap-1.5">
            ${medalIcon ? `<img src="${escAttr(medalIcon)}" alt="${escAttr(medalText)}"
                                class="h-4 w-4 object-contain rounded-[3px]" loading="lazy" decoding="async">` : ''}
            <span data-sf="${escAttr(medalText)}">${esc(medalText)}</span>
          </span>
        </div>
      </div>`;
  }).join('');

  const shell = `
    <div class="overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5">
      <div class="overflow-auto">
        <div class="minw-personal_records">
          ${headerHTML}
          <div class="row-gap-y">
            ${rowsHTML}
          </div>
        </div>
      </div>
    </div>
  `;

  setResultsHTML(shell);
  refreshAvatarLazyLoading(document.getElementById('resultsContainer'));

  const root = document.getElementById('resultsContainer');
  applySplitFlap(root);
  if (typeof registerMapCodeCopyTargets === 'function') registerMapCodeCopyTargets(root);

  root.querySelectorAll('img[data-fallback-src]').forEach((img) => {
    const fallback = img.getAttribute('data-fallback-src');
    img.addEventListener('error', () => { if (img.src !== fallback) img.src = fallback; }, { once: true });
  });
}

/* =========================
   RENDER COMPLETIONS
   ========================= */
// ================== CARDS DISPLAY ============== //
async function displayCompletionsResultsCards(rowsInput){
  const rows = Array.isArray(rowsInput) ? rowsInput : normalizeToRows(rowsInput,'completion');
  const filtered = rows.filter(r => (r.map_code||r.code) && (r.map_code||r.code) !== 'N/A');

  if (filtered.length === 0) {
    const message = t('popup.no_results');
    renderMessage(message);
    const rc = document.getElementById('resultsContainer');
    if (rc) {
      rc.innerHTML = `
        <div class="mt-4 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 px-4 py-6 text-center text-sm text-zinc-700 dark:text-zinc-300">
          ${message}
        </div>
      `;
    }
    return;
  }

  const cardsHTML = filtered.map((r, idx) => {
    const code = r.map_code || r.code || 'N/A';
    const name = r.map_name || code;
    const nameKey = (r.map_name || code || 'default').toLowerCase().replace(/[()\s':]/g, '');
    const banner = cdnImage(`assets/map_banners/${nameKey}.png`);
    const fbBanner = cdnImage(`assets/map_banners/${nameKey}.png`);

    const uid = r.user_id ? String(r.user_id) : '';
    const nickname = r.nickname || r.name || 'N/A';
    const profileHref = uid ? `rank_card?user_id=${encodeURIComponent(uid)}` : '#';
    const fbAvatar = defaultAvatarFromId(uid || '0');

    const isCompletion = r.completion === true;
    const timeVal = r.time;

    const CUTOFF = 15900;

    const timeNum = Number(timeVal);
    const hasNumericTime = timeVal != null && timeVal !== '' && Number.isFinite(timeNum);

    const timeDisplay =
      (hasNumericTime && timeNum <= CUTOFF)
        ? timeNum.toFixed(2)
        : (hasNumericTime && timeNum > CUTOFF)
          ? (t('completion') || 'Completion')
          : (isCompletion ? (t('completion') || 'Completion') : 'N/A');

    const medalKey = String(r.medal || '').toLowerCase();
    const medalBadge =
      medalKey === 'gold'   ? 'mx-card--gold'   :
      medalKey === 'silver' ? 'mx-card--silver' :
      medalKey === 'bronze' ? 'mx-card--bronze' : '';
    const medalChip =
      medalKey === 'gold'   ? 'c-medal c-medal--gold'   :
      medalKey === 'silver' ? 'c-medal c-medal--silver' :
      medalKey === 'bronze' ? 'c-medal c-medal--bronze' : 'c-medal c-medal--neutral';
    const medalIcon =
      medalKey === 'gold'   ? cdnAsset('assets/medals/gold.png')   :
      medalKey === 'silver' ? cdnAsset('assets/medals/silver.png') :
      medalKey === 'bronze' ? cdnAsset('assets/medals/bronze.png') : null;

    const diffTxt = r.difficulty || 'N/A';
    const diffColor = difficultyColors[normalizeDifficulty(diffTxt)] || '#e5e7eb';

    const videoBtn = r.video ? `
      <a href="${escAttr(r.video)}" target="_blank" rel="noopener" class="mx-icon" title="${escAttr(t('watch')||'Watch')}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
      </a>` : '';

    const icClock = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20Zm1 5v5.2l3 1.8a1 1 0 11-1 1.7l-3.6-2.1A1 1 0 0 1 10.5 13V7a1 1 0 1 1 2 0Z"/></svg>';
    const icDiff  = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h16v2H4zm0 7h16v2H4zm0 7h16v2H4z"/></svg>';

    return `
      <article class="mx-card is-in ${medalBadge}">
        <div class="mx-hero is-loading">
          <div class="mx-skel"></div>
          <img src="${escAttr(banner)}" alt="" data-fallback-src="${escAttr(fbBanner)}"/>
          <div class="mx-grain"></div>

          <div class="c-topbar">
            <div class="c-chiprow">
              <span class="c-chip">${icClock}<span class="truncate">${esc(timeDisplay)}</span></span>
              <span class="c-chip">${icDiff}<span class="${__clsTextColor(diffColor)} truncate">${esc(diffTxt)}</span></span>
            </div>
          </div>

          <div class="mx-titlebar"><div class="mx-head"></div></div>

          <div class="mx-actions-vert">
            ${videoBtn}
            <button type="button" class="mx-icon cursor-pointer js-open-completion-details" data-index="${idx}"
                    title="${escAttr(t('thead.mapView')||'View details')}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </div>

          <div class="mx-bottom">
            <div class="mx-b-left">
              <a href="${escAttr(profileHref)}" title="${escAttr(nickname)}">
                <img class="mx-avatar" src="${escAttr(fbAvatar)}" alt="" loading="lazy" decoding="async"
                     referrerpolicy="no-referrer" data-avatar-id="${escAttr(uid)}" data-avatar-size="64"
                     data-fallback-src="${escAttr(fbAvatar)}"/>
              </a>
              <span class="truncate">${esc(nickname)}</span>
            </div>
            <div class="mx-b-right">
              <button type="button" class="mx-code-inline copy-map-code" data-code="${escAttr(code)}"
                aria-label="${escAttr(t('popup.copy_map_code')||'Copy code')}" title="${escAttr(t('popup.copy_map_code')||'Copy code')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                  <rect x="3" y="3" width="13" height="13" rx="2"></rect>
                </svg>
                <span data-sf="${escAttr(code)}"></span>
              </button>
              <div class="${medalChip} inline-flex items-center gap-1.5" title="${escAttr(t('thead.mapMedal')||'Medal')}">
                ${medalIcon ? `<img src="${escAttr(medalIcon)}" alt="${escAttr(r.medal||'')}"
                                  class="h-4 w-4 object-contain rounded-[3px]" loading="lazy" decoding="async">` : ''}
                <span>${esc(r.medal || '—')}</span>
              </div>
            </div>
          </div>
        </div>
      </article>`;
  }).join('');

  const shell = `<section class="mx-wrap"><div class="mx-grid mx-stagger">${cardsHTML}</div></section>`;
  setResultsHTML(shell);

  const root = document.getElementById('resultsContainer');

  ensureCompletionsDetailsModal();
  root.querySelectorAll('.js-open-completion-details').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const idx = Number(btn.getAttribute('data-index'));
      openCompletionsDetailsModal(filtered[idx]);
    });
  });

  root.querySelectorAll('.mx-hero').forEach(hero=>{
    const img = hero.querySelector('img'); if (!img) return;
    const fb = img.getAttribute('data-fallback-src');
    if (img.complete && img.naturalWidth>0) hero.classList.remove(...String('is-loading').trim().split(/\s+/).filter(Boolean));
    else img.addEventListener('load', ()=> hero.classList.remove(...String('is-loading').trim().split(/\s+/).filter(Boolean)), { once:true });
    img.addEventListener('error', ()=>{ if (fb && img.src!==fb) img.src = fb; }, { once:true });
  });

  refreshAvatarLazyLoading(root);
  applySplitFlap(root);

  if (root && root.dataset.copyDelegated !== '1'){
    root.dataset.copyDelegated = '1';
    root.addEventListener('click', e=>{
      const btn = e.target.closest('.copy-map-code'); if (!btn) return;
      e.preventDefault();
      const code = btn.getAttribute('data-code') || btn.textContent.trim();
      if (code && code !== 'N/A') copyMapCode(code);
    });
    root.addEventListener('keydown', e=>{
      const btn = e.target.closest('.copy-map-code'); if (!btn) return;
      if (e.key==='Enter' || e.key===' '){
        e.preventDefault();
        const code = btn.getAttribute('data-code') || btn.textContent.trim();
        if (code && code !== 'N/A') copyMapCode(code);
      }
    });
  }

}

// ================== TABLE DISPLAY ============== //
async function displayCompletionsResults(results){
  const rows = Array.isArray(results.results) ? results.results : [];
  const filtered = rows.filter(r => (r.map_code||r.code) && (r.map_code||r.code) !== 'N/A');

  if (filtered.length === 0) {
    const message = t('popup.no_results');
    renderMessage(message);
    const rc = document.getElementById('resultsContainer');
    if (rc) {
      rc.innerHTML = `
        <div class="mt-4 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 px-4 py-6 text-center text-sm text-zinc-700 dark:text-zinc-300">
          ${message}
        </div>
      `;
    }
    return;
  }

  const currentUid = window.user_id ? String(window.user_id) : null;

  const headerHTML = `
    <div class="sticky top-0 z-10 bg-white/95 dark:bg-zinc-900/95 text-zinc-700 dark:text-zinc-300 font-semibold grid grid-completions px-3 py-2">
      <div class="whitespace-nowrap">${t('thead.mapCode')}</div>
      <div class="whitespace-nowrap">${t('thead.mapNickname')}</div>
      <div class="whitespace-nowrap">${t('thead.mapDiscordTag')}</div>
      <div class="whitespace-nowrap">${t('thead.mapTime')}</div>
      <div class="whitespace-nowrap">${t('thead.mapMedal')}</div>
      <div class="whitespace-nowrap">${t('thead.mapVideo')}</div>
      <div class="whitespace-nowrap">${t('thead.mapDetails')}</div>
    </div>`;

  const rowsHTML = filtered.map((r, idx)=>{
    const mapCode = r.map_code || r.code || 'N/A';
    const isCompletion = r.completion === true;
    const timeVal = r.time;

    const CUTOFF = 15900;

    const timeNum = Number(timeVal);
    const hasNumericTime = timeVal != null && timeVal !== '' && Number.isFinite(timeNum);

    const timeDisplay =
      (hasNumericTime && timeNum <= CUTOFF)
        ? timeNum.toFixed(2)
        : (hasNumericTime && timeNum > CUTOFF)
          ? (t('completion') || 'Completion')
          : (isCompletion ? (t('completion') || 'Completion') : 'N/A');
    const uid = r.user_id ? String(r.user_id) : null;
    const fallback = defaultAvatarFromId(uid || '0');
    const profileHref = uid ? `rank_card?user_id=${encodeURIComponent(uid)}` : null;
    const nickname = r.nickname || r.name || 'N/A';
    const also = r.also_known_as ?? r.discord_tag ?? 'N/A';

    const codeCell = mapCode !== 'N/A' ? `
      <button type="button"
        class="copy-map-code group relative z-10 inline-flex items-center gap-1 rounded-md border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 px-2 py-0.5
               text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-white/85 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 cursor-pointer
               w-[6.5rem]"
        data-code="${escAttr(mapCode)}" title="${escAttr(t('popup.copy_map_code'))}">
        <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2"></rect>
          <rect x="3" y="3" width="13" height="13" rx="2"></rect>
        </svg>
        <span data-sf="${escAttr(mapCode)}"></span>
      </button>` : `<span data-sf="N/A">N/A</span>`;

    const nicknameBlock = profileHref ? `
      <a href="${escAttr(profileHref)}"
         class="inline-flex items-center gap-2 rounded-md hover:bg-zinc-100 dark:hover:bg-white/10 px-1.5 py-0.5"
         title="${currentUid && uid && currentUid===uid ? t('popup.you') : escAttr(nickname)}">
        <img class="h-6 w-6 rounded-full object-cover ring-1 ring-zinc-300/60 dark:ring-white/10 bg-zinc-100 dark:bg-zinc-800"
             alt="" referrerpolicy="no-referrer" loading="lazy" decoding="async"
             src="${escAttr(fallback)}"
             data-avatar-id="${escAttr(uid || '')}" data-avatar-size="64"
             data-fallback-src="${escAttr(fallback)}"/>
        <span data-sf="${escAttr(nickname)}"></span>
      </a>` : `
      <div class="flex items-center gap-2">
        <img class="h-6 w-6 rounded-full object-cover ring-1 ring-zinc-300/60 dark:ring-white/10 bg-zinc-100 dark:bg-zinc-800"
             alt="" referrerpolicy="no-referrer" loading="lazy" decoding="async"
             src="${escAttr(fallback)}"
             data-avatar-id="${escAttr(uid || '')}" data-avatar-size="64"
             data-fallback-src="${escAttr(fallback)}"/>
        <span data-sf="${escAttr(nickname)}"></span>
      </div>`;

    const videoCell = r.video
      ? `<a data-sf="Watch" href="${escAttr(r.video)}" target="_blank" rel="noopener"
           class="text-brand-300 hover:text-brand-200 underline">${esc(t('watch'))}</a>`
      : `<span data-sf="N/A">N/A</span>`;

    const medalKey = String(r.medal || '').trim().toLowerCase();
    const medalIcon =
      medalKey === 'gold'   ? cdnAsset('assets/medals/gold.png')   :
      medalKey === 'silver' ? cdnAsset('assets/medals/silver.png') :
      medalKey === 'bronze' ? cdnAsset('assets/medals/bronze.png') : null;

    return `
      <div class="grid grid-completions bg-white/70 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-white/10 transition px-3 py-2">
        <div class="min-w-0">${codeCell}</div>
        <div class="min-w-0">${nicknameBlock}</div>
        <div class="min-w-0"><span class="truncate block" data-sf="${escAttr(also)}">${esc(also)}</span></div>
        <div class="min-w-0"><span data-sf="${escAttr(timeDisplay)}">${esc(timeDisplay)}</span></div>
        <div class="min-w-0">
          <span class="inline-flex items-center gap-1.5">
            ${medalIcon ? `<img src="${escAttr(medalIcon)}" alt="${escAttr(r.medal||'')}"
                                class="h-4 w-4 object-contain rounded-[3px]" loading="lazy" decoding="async">` : ''}
            <span data-sf="${escAttr(r.medal || 'N/A')}">${esc(r.medal || 'N/A')}</span>
          </span>
        </div>
        <div class="min-w-0">${videoCell}</div>
        <div class="min-w-0">
          <button class="js-open-completion-details inline-flex items-center gap-2 rounded-md border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 px-2.5 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer"
                  data-index="${idx}">
            ${esc(t('thead.mapView') || 'View')}
          </button>
        </div>
      </div>`;
  }).join('');

  const shell = `
    <div class="overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5">
      <div class="overflow-auto">
        <div class="minw-completions">
          ${headerHTML}
          <div class="row-gap-y">${rowsHTML}</div>
        </div>
      </div>
    </div>`;
  setResultsHTML(shell);

  const root = document.getElementById('resultsContainer');

  ensureCompletionsDetailsModal();
  root.querySelectorAll('.js-open-completion-details').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const idx = Number(btn.getAttribute('data-index'));
      openCompletionsDetailsModal(filtered[idx]);
    });
  });

  refreshAvatarLazyLoading(root);
  applySplitFlap(root);
  if (typeof registerMapCodeCopyTargets==='function') registerMapCodeCopyTargets(root);

  root.querySelectorAll('img[data-fallback-src]').forEach(img=>{
    const fallback = img.getAttribute('data-fallback-src');
    img.addEventListener('error', ()=>{ if (img.src !== fallback) img.src = fallback; }, { once:true });
  });
}

/* =========================
   COMPLETIONS — DETAILS MODAL
   ========================= */
function ensureCompletionsDetailsModal(){
  let overlay = document.getElementById('completionModalOverlay');

  const TT = (k, fb='') => {
    const v = (typeof t === 'function') ? t(k) : null;
    return (typeof v === 'string' && v !== k) ? v : fb;
  };

  if (overlay && !overlay.querySelector('#completionCode')) { overlay.remove(); overlay = null; }

  if (!overlay){
    const tpl = document.createElement('div');
    tpl.innerHTML = `
    <div id="completionModalOverlay"
         class="fixed inset-0 z-[90] hidden items-center justify-center bg-black/70 backdrop-blur-sm opacity-0 transition-opacity duration-200"
         role="dialog" aria-modal="true" aria-labelledby="completionModalTitle">

      <div class="mx-4 w-[min(96vw,980px)] max-h-[calc(100dvh-2rem)] p-px rounded-3xl bg-gradient-to-tr from-white/25 via-indigo-400/30 ring-1 ring-zinc-300/60 dark:ring-white/10 translate-y-3 opacity-0 transition-all duration-200">
        <div id="completionModalBox" 
            class="relative min-h-0 sm:min-h-[520px] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 shadow-2xl ring-1 ring-zinc-300/60 dark:ring-white/10">

          <!-- cover -->
          <div class="relative h-56 overflow-hidden rounded-t-3xl">
            <img id="completionModalCover" alt="" class="h-full w-full object-cover opacity-80">
            <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-zinc-900/80"></div>

            <div class="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
              <span id="completionStatus"
                    class="inline-flex items-center gap-2 rounded-full bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 px-3 py-1 text-sm font-medium text-zinc-900 dark:text-white/80 ring-1 ring-zinc-300/60 dark:ring-white/15">
                <span class="h-2 w-2 rounded-full bg-white/60"></span>
                ${TT('completion','Completion')}
              </span>

              <div class="flex items-center gap-2">
                <!-- Change requests -->
                <button type="button" id="btnOpenMapEditRequestCompletion"
                  class="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-white/85 ring-1 ring-zinc-300/60 dark:ring-white/15 hover:bg-white/85 dark:bg-zinc-900/7 dark:bg-white/15 hover:text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/60">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-zinc-900 dark:text-white/80 group-hover:text-zinc-900 dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20h9"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
                  </svg>
                  <span id="btnOpenMapEditRequestCompletionText">${t('map_edit_request.title')}</span>
                </button>

                <button type="button" id="completionModalCloseBtn"
                  class="group inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-xl bg-zinc-900/7 dark:bg-black/40 ring-1 ring-zinc-300/60 dark:ring-white/15 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  aria-label="${TT('popup.close','Close')}">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-zinc-900 dark:text-white/85 group-hover:text-zinc-900 dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- contenu -->
          <div class="grid gap-6 p-6 md:grid-cols-12">
            <!-- gauche -->
            <div class="md:col-span-7 space-y-6">

              <!-- Map + Code -->
              <div class="rounded-2xl bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 p-4 flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <div class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60" id="completionMapLabel">${TT('thead.mapName','Name')}</div>
                  <div id="completionMapName" class="mt-1 font-semibold text-lg truncate">—</div>
                  <div class="mt-2 text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60" id="completionCodeLabel">${TT('thead.mapCode','Code')}</div>
                  <div id="completionCode" class="mt-1 font-mono text-lg break-all">—</div>
                </div>
                <div class="flex flex-col gap-2 shrink-0">
                  <a id="btnOpenCompletionVideo" href="#" target="_blank" rel="noopener"
                     class="hidden inline-flex items-center justify-center rounded-xl bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-white/85 ring-1 ring-zinc-300/60 dark:ring-white/15 hover:bg-white/85 dark:bg-zinc-900/7 dark:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/60">
                    <svg viewBox="0 0 24 24" class="mr-2 h-4 w-4" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
                    <span>${TT('watch','Watch')}</span>
                  </a>
                  <button id="btnCopyCompletionCode"
                          class="inline-flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm font-semibold
                              bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300
                              hover:bg-emerald-200 hover:text-emerald-950
                              focus:outline-none focus:ring-2 focus:ring-emerald-500/40
                              dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30
                              dark:hover:bg-emerald-500/20 dark:hover:text-emerald-200
                              dark:focus:ring-emerald-400/60
                              transition-colors duration-150"
                          title="${TT('popup.copy_map_code','Copy map code')}" aria-label="${TT('popup.copy_map_code','Copy map code')}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>${TT('popup.copy_map_code','Copy map code')}</span>
                  </button>
                </div>
              </div>

              <!-- Screenshot -->
              <div id="completionProofSection" class="rounded-2xl bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 p-4" hidden>
                <div class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60" id="completionProofLabel">${TT('screenshot','Screenshot')}</div>
                <button id="completionProofZoom" type="button"
                        class="group mt-2 relative w-full overflow-hidden rounded-xl bg-zinc-900/5 dark:bg-black/30 aspect-[16/9] ring-1 ring-zinc-300/60 dark:ring-white/10 hover:ring-emerald-400/40 focus:outline-none cursor-pointer hover:cursor-zoom-in">
                  <img id="completionProofImg" alt="" class="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-200" />
                  <span class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <span class="rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-zinc-900 dark:text-white/90">${TT('open_screenshot','Open screenshot')}</span>
                  </span>
                </button>
              </div>

            </div>

            <!-- droite -->
            <div class="md:col-span-5 space-y-6">
              <div class="rounded-2xl bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 p-4">
                <div class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60">${TT('thead.mapDetails','Details')}</div>
                <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                  <dt class="text-xs text-zinc-900 dark:text-white/60">${TT('filters.player_name','Player')}</dt><dd id="completionPlayer" class="text-sm font-medium text-zinc-900 dark:text-white/90">—</dd>
                  <dt class="text-xs text-zinc-900 dark:text-white/60">${TT('thead.mapTime','Time')}</dt><dd id="completionTime" class="text-sm font-medium text-zinc-900 dark:text-white/90">—</dd>
                  <dt class="text-xs text-zinc-900 dark:text-white/60">${TT('thead.mapMedal','Medal')}</dt><dd id="completionMedal" class="text-sm font-medium text-zinc-900 dark:text-white/90">—</dd>
                  <dt class="text-xs text-zinc-900 dark:text-white/60">${TT('thead.mapDifficulty','Difficulty')}</dt><dd id="completionDifficulty" class="text-sm font-medium text-zinc-900 dark:text-white/90">—</dd>
                  <dt class="text-xs text-zinc-900 dark:text-white/60">${TT('thead.mapType','Type')}</dt><dd id="completionCategory" class="text-sm font-medium text-zinc-900 dark:text-white/90">—</dd>
                </dl>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Lightbox -->
      <div id="imgZoomOverlay"
           class="fixed inset-0 z-[100] hidden items-center justify-center bg-black/80 backdrop-blur-sm opacity-0 transition-opacity duration-200">
        <button id="imgZoomClose"
                class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900/10 dark:bg-black/50 ring-1 ring-zinc-400/60 dark:ring-white/20 text-zinc-900 dark:text-white/90 hover:bg-black/70"
                aria-label="${TT('popup.close','Close')}" title="${TT('popup.close','Close')}">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <img id="imgZoomTarget" alt="" class="max-h-[92vh] max-w-[92vw] rounded-2xl shadow-2xl ring-1 ring-zinc-300/60 dark:ring-white/10"/>
      </div>
    </div>`;
    document.body.appendChild(tpl.firstElementChild);
    overlay = document.getElementById('completionModalOverlay');
  }

  if (!overlay.__copyBound){
    overlay.__copyBound = true;

    const tFmt = (key, params={}, fallback='')=>{
      let s = (typeof t==='function') ? t(key, params) : null;
      if (typeof s!=='string' || s===key) s = fallback || key;
      return s.replace(/\{(\w+)\}/g,(_,p)=> (params[p]!=null?params[p]:''));
    };

    const getCode = ()=> (document.getElementById('completionCode')?.textContent || '').trim();

    const setBtnState = ()=>{
      const btn = document.getElementById('btnCopyCompletionCode'); if (!btn) return;
      const code = getCode(); const ok = !!code && code!=='—' && code!=='N/A';
      btn.disabled = !ok; btn.setAttribute('aria-disabled', ok?'false':'true');
      btn.title = ok
        ? tFmt('popup.copy_map_code', {}, 'Copy map code')
        : tFmt('popup.map_code_required', {}, 'Enter a map code');
    };

    const codeEl = document.getElementById('completionCode');
    if (window.MutationObserver && codeEl){
      const mo = new MutationObserver(setBtnState);
      mo.observe(codeEl, { childList:true, subtree:true, characterData:true });
    }
    setBtnState();

    const doCopy = async(code)=>{
      if (navigator.clipboard?.writeText){ await navigator.clipboard.writeText(code); return; }
      const ta = document.createElement('textarea'); ta.value = code; ta.setAttribute('readonly','');
      ta.style.position='absolute'; ta.style.left='-9999px'; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy'); ta.remove();
    };

    let inFlight = false;
    overlay.addEventListener('click', async (ev)=>{
      const btn = ev.target.closest('#btnCopyCompletionCode'); if (!btn) return;
      ev.preventDefault(); ev.stopPropagation();
      if (inFlight) return; inFlight = true;
      const code = getCode();
      if (!code || code==='—' || code==='N/A'){
        if (typeof showWarningMessage==='function'){
          showWarningMessage(tFmt('popup.map_code_required',{},'Enter a map code'));
        }
        inFlight=false; return;
      }
      try{
        await doCopy(code);
        if (typeof showConfirmationMessage==='function'){
          showConfirmationMessage(tFmt('popup.map_code_copied',{code},`Map code ${code} copied`));
        }
      }catch{
        if (typeof showWarningMessage==='function'){
          showWarningMessage(tFmt('popup.copy_failed',{},'Failed to copy map code'));
        }
      }finally{ inFlight = false; }
    });
  }

  const zoomOverlay = document.getElementById('imgZoomOverlay');
  if (!zoomOverlay.__bound){
    zoomOverlay.__bound = true;

    const openZoom = (src)=>{
      const img = document.getElementById('imgZoomTarget');
      const ov  = document.getElementById('imgZoomOverlay');
      const modalOverlay = document.getElementById('completionModalOverlay');
      img.src = src;
      modalOverlay.dataset.zoom = '1';
      ov.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean)); ov.classList.add(...String('flex').trim().split(/\s+/).filter(Boolean));
      requestAnimationFrame(()=>{ ov.classList.remove(...String('opacity-0').trim().split(/\s+/).filter(Boolean)); ov.classList.add(...String('opacity-100').trim().split(/\s+/).filter(Boolean)); });
      const onEsc = (e)=>{ if (e.key==='Escape') closeZoom(); };
      ov.__esc = onEsc; document.addEventListener('keydown', onEsc);
    };

    const closeZoom = ()=>{
      const ov = document.getElementById('imgZoomOverlay');
      const modalOverlay = document.getElementById('completionModalOverlay');
      ov.classList.add(...String('opacity-0').trim().split(/\s+/).filter(Boolean)); ov.classList.remove(...String('opacity-100').trim().split(/\s+/).filter(Boolean));
      setTimeout(()=>{ ov.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean)); ov.classList.remove(...String('flex').trim().split(/\s+/).filter(Boolean)); }, 160);
      if (ov.__esc){ document.removeEventListener('keydown', ov.__esc); ov.__esc = null; }
      delete modalOverlay.dataset.zoom;
    };

    zoomOverlay.addEventListener('click', (e)=>{
      if (e.target.id==='imgZoomClose' || !e.target.closest('#imgZoomTarget')) closeZoom();
    });
    zoomOverlay.addEventListener('pointerdown', (e)=> e.stopPropagation(), true);

    overlay.addEventListener('click', (e)=>{
      const btn = e.target.closest('#completionProofZoom'); if (!btn) return;
      const src = btn.dataset.zoomSrc; if (!src) return;
      openZoom(src);
    });
  }
}

function openCompletionsDetailsModal(r, opts = {}){
  if (!r) return;
  const { fromUrl = false, syncUrl = true } = opts || {};
  ensureCompletionsDetailsModal();

  const code = r?.code || r?.map_code || '';
  if (syncUrl && !fromUrl && code) {
    __urlOpenModal('completion', { code, user_id: r.user_id, time: r.time }, { push: true });
  }

  const tSafe = (k, d) => (typeof t === 'function' ? t(k) : d);
  // Change requests
  const __merBtn = document.getElementById('btnOpenMapEditRequestCompletion');
  const __merBtnText = document.getElementById('btnOpenMapEditRequestCompletionText');
  if (__merBtnText) __merBtnText.textContent = t('map_edit_request.title');
  if (__merBtn) {
    const __logged = typeof window !== 'undefined' && window.user_id != null && String(window.user_id).trim() !== '';
    __merBtn.disabled = !__logged;
(() => { const __obj = __merBtn; let __last; for (const __c of String('opacity-50').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !__logged); return __last; })();
(() => { const __obj = __merBtn; let __last; for (const __c of String('cursor-not-allowed').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !__logged); return __last; })();
(() => { const __obj = __merBtn; let __last; for (const __c of String('cursor-pointer').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, __logged); return __last; })();
    __merBtn.title = __logged ? t('map_edit_request.map_edit_btn') : t('map_edit_request.map_edit_btn_login');
    __merBtn.onclick = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (!__logged) return;
      openMapEditRequestModal(r);
    };
  }

  const esc = (s) => String(s ?? "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
  const arrToText = (v)=> Array.isArray(v) ? v.filter(Boolean).join(', ') : (v || '—');

  const nameKey = (r.map_name || r.map_code || r.code || 'default').toLowerCase().replace(/[()\s':]/g, '');
  const cover = cdnImage(`assets/map_banners/${nameKey}.png`);
  const imgCover = document.getElementById('completionModalCover');
  if (imgCover){
    const fb = cdnImage(`assets/map_banners/${nameKey}.png`);
    imgCover.src = cover;
    imgCover.addEventListener('error', ()=>{ if (imgCover.src!==fb) imgCover.src = fb; }, { once:true });
  }

  const el = id => document.getElementById(id);
  el('completionMapLabel').textContent   = tSafe('thead.mapName','Map');
  el('completionCodeLabel').textContent  = tSafe('thead.mapCode','Code');
  el('completionProofLabel').textContent = tSafe('screenshot','Screenshot');
  el('completionStatus').innerHTML = `<span class="h-2 w-2 rounded-full bg-emerald-400"></span> ${esc(tSafe('completion','Completion'))}`;

  const mapName = r.map_name || r.map || r.map_code || r.code || '—';
  el('completionMapName').textContent = mapName;
  el('completionCode').textContent    = code;

  const player = r.nickname || r.name || 'N/A';
  const isCompletion = r.completion === true;
  const timeVal = r.time;

  const CUTOFF = 15900;

  const timeNum = Number(timeVal);
  const hasNumericTime = timeVal != null && timeVal !== '' && Number.isFinite(timeNum);

  const timeDisplay =
    (hasNumericTime && timeNum <= CUTOFF)
      ? timeNum.toFixed(2)
      : (hasNumericTime && timeNum > CUTOFF)
        ? (t('completion') || 'Completion')
        : (isCompletion ? (t('completion') || 'Completion') : 'N/A');
  const medal        = r.medal || '—';
  const difficulty   = r.difficulty || '—';
  const category     = arrToText(Array.isArray(r.category) ? r.category : r.category);
  el('completionPlayer').textContent     = player;
  el('completionTime').textContent       = timeDisplay;
  el('completionMedal').textContent      = medal;
  el('completionDifficulty').textContent = difficulty;
  el('completionCategory').textContent   = category;

  const videoBtn = el('btnOpenCompletionVideo');
  if (videoBtn){
    if (r.video){ videoBtn.href = r.video; videoBtn.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean)); videoBtn.querySelector('span').textContent = tSafe('watch','Watch'); }
    else { videoBtn.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean)); }
  }

  const proofSection = el('completionProofSection');
  const proofImg  = el('completionProofImg');
  const proofBtn  = el('completionProofZoom');

  let proof = (r.screenshot || r.proof || r.image || r.screenshot_url || r.proof_url || '').trim();
  const looksLikeImg = proof && (/^data:image\//.test(proof) || /\.(png|jpe?g|webp|gif|avif|bmp|svg)(\?.*)?$/i.test(proof));

  proofSection.hidden = true;
  proofImg.src = ''; proofImg.classList.add(...String('opacity-0').trim().split(/\s+/).filter(Boolean));
  if (proofBtn) proofBtn.dataset.zoomSrc = '';

  if (looksLikeImg){
    proofSection.hidden = false;
    const onLoad  = ()=>{ proofImg.classList.remove(...String('opacity-0').trim().split(/\s+/).filter(Boolean)); if (proofBtn) proofBtn.dataset.zoomSrc = proof; };
    const onError = ()=>{ proofSection.hidden = true; };
    proofImg.addEventListener('load', onLoad, { once:true });
    proofImg.addEventListener('error', onError, { once:true });
    proofImg.src = proof;
  }

  const modalOverlay = document.getElementById('completionModalOverlay');
  const gradientWrap = modalOverlay.querySelector('.bg-gradient-to-tr');
  modalOverlay.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean)); modalOverlay.classList.add(...String('flex').trim().split(/\s+/).filter(Boolean));
  requestAnimationFrame(()=>{
    modalOverlay.classList.remove(...String('opacity-0').trim().split(/\s+/).filter(Boolean)); modalOverlay.classList.add(...String('opacity-100').trim().split(/\s+/).filter(Boolean));
    gradientWrap.classList.remove(...String('translate-y-3').trim().split(/\s+/).filter(Boolean), ...String('opacity-0').trim().split(/\s+/).filter(Boolean)); gradientWrap.classList.add(...String('translate-y-0').trim().split(/\s+/).filter(Boolean), ...String('opacity-100').trim().split(/\s+/).filter(Boolean));
  });

  const closeBtn = document.getElementById('completionModalCloseBtn');
  const close = ()=>{
    modalOverlay.classList.add(...String('opacity-0').trim().split(/\s+/).filter(Boolean)); modalOverlay.classList.remove(...String('opacity-100').trim().split(/\s+/).filter(Boolean));
    gradientWrap.classList.add(...String('translate-y-3').trim().split(/\s+/).filter(Boolean), ...String('opacity-0').trim().split(/\s+/).filter(Boolean)); gradientWrap.classList.remove(...String('translate-y-0').trim().split(/\s+/).filter(Boolean), ...String('opacity-100').trim().split(/\s+/).filter(Boolean));
    setTimeout(()=>{ modalOverlay.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean)); modalOverlay.classList.remove(...String('flex').trim().split(/\s+/).filter(Boolean)); }, 180);
    document.removeEventListener('keydown', onEsc);
    modalOverlay.removeEventListener('pointerdown', onOutside, true);
    if (!__suppressUrlSync) __urlHandleModalUserClose('completion');
  };
  modalOverlay.__sfClose = close;
  const onEsc = e=>{ if (e.key==='Escape') close(); };

  const onOutside = (e)=>{
    if (modalOverlay.dataset.zoom === '1') return;
    if (e.target.closest('#imgZoomOverlay')) return;
    const box = document.getElementById('completionModalBox');
    if (!box.contains(e.target)) close();
  };

  closeBtn?.addEventListener('click', close, { once:true });
  document.addEventListener('keydown', onEsc);
  modalOverlay.addEventListener('pointerdown', onOutside, true);
}

/* =========================
   RENDER GUIDES
   ========================= */
function displayGuideResults(results) {
  const rows = Array.isArray(results.results) ? results.results : [];
  const filtered = rows.filter((r) => r.url);

  if (filtered.length === 0) {
    const message = t('popup.no_results');
    renderMessage(message);
    const rc = document.getElementById('resultsContainer');
    if (rc) {
      rc.innerHTML = `
        <div class="mt-4 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 px-4 py-6 text-center text-sm text-zinc-700 dark:text-zinc-300">
          ${message}
        </div>
      `;
    }
    return;
  }

  const headerHTML = `
    <div class="sticky top-0 z-10 bg-white/75 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 font-semibold grid grid-guide px-3 py-2">
      <div class="whitespace-nowrap text-center">${t('thead.mapVideo')}</div>
    </div>
  `;

  const rowsHTML = filtered.map((r) => {
    const embedUrl = getEmbedUrl(r.url);
    return `
      <div class="grid grid-guide bg-white/70 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-white/10 transition px-3 py-4">
        <div class="text-center">
          ${
            embedUrl
              ? ` <div class="mx-auto w-full max-w-3xl">
                  <div class="video-embed ring-1 ring-zinc-300/60 dark:ring-white/10">
                    <iframe src="${embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  </div>
                   ${
                     Array.isArray(r.usernames) && r.usernames.length > 1
                       ? `<div class="mt-2 text-center text-xs text-zinc-600 dark:text-zinc-400">
                            ${esc(t('thead.mapNickname'))}:
                            <span class="text-zinc-800 dark:text-zinc-200">${esc(r.usernames[1])}</span>
                          </div>`
                       : ``
                   }
                 </div>`
              : 'N/A'
          }
        </div>
      </div>`;
  }).join('');

  const shell = `
    <div class="overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5">
      <div class="overflow-auto">
        <div class="minw-guide">
          ${headerHTML}
          <div class="row-gap-y">
            ${rowsHTML}
          </div>
        </div>
      </div>
    </div>
  `;

  setResultsHTML(shell);
}

function getEmbedUrl(url) {
  if (!url) return null;
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const m = url.match(/(?:v=|embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
  }
  if (url.includes('bilibili.com')) {
    const m = url.match(/\/video\/([a-zA-Z0-9]+)/);
    return m ? `https://player.bilibili.com/player.html?bvid=${m[1]}` : null;
  }
  return null;
}

/* =========================
   SKELETONS
   ========================= */
let __skeletonCSSReady = false;
function ensureSkeletonCSS() {
  if (__skeletonCSSReady) return;
  try {
    __sheet.insertRule(
      '@keyframes skelShine{0%{background-position:-200% 0}100%{background-position:200% 0}}',
      __sheet.cssRules.length
    );
  } catch {}
  try {
    __sheet.insertRule('.hide-scrollbar{scrollbar-width:none;-ms-overflow-style:none}', __sheet.cssRules.length);
  } catch {}
  try {
    __sheet.insertRule('.hide-scrollbar::-webkit-scrollbar{width:0;height:0}', __sheet.cssRules.length);
  } catch {}

  __addRule('.skel', [
    'display:block',
    'position:relative',
    'overflow:hidden',
    'background:linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.14), rgba(255,255,255,0))',
    'background-size:200% 100%',
    'animation:skelShine 1.1s linear infinite',
    'border-radius:8px',
  ].join(';'));

  __addRule('.skel-table', '');
  __addRule('.skel-chip', 'height:1.25rem; width:6.5rem; border-radius:9999px');
  __addRule('.skel-avatar', 'height:24px; width:24px; border-radius:9999px');
  __addRule('.skel-btn', 'height:24px; width:72px; border-radius:8px');
  __addRule('.skel-bar-sm', 'height:10px; display:inline-block');
  __addRule('.skel-bar-md', 'height:14px; display:inline-block');
  __addRule('.skel-vid', 'border-radius:12px');
  __addRule('.skel-img', 'height:260px;width:100%;border-radius:12px');
  __addRule('.skel-graph-250', 'height:220px;width:100%;border-radius:12px');

  __skeletonCSSReady = true;
}

function showProgressionLoading() {
  const el = document.getElementById('chartContainer');
  if (!el) return;
  el.innerHTML = `
    <div class="rounded-xl bg-white/75 dark:bg-zinc-900/60 ring-1 ring-zinc-300/60 dark:ring-white/10 p-4">
      <div class="h-[280px] w-full grid place-items-center text-zinc-900 dark:text-white/60 text-sm">
        ${typeof t==='function' ? t('labels.loading') : 'Loading…'}
      </div>
    </div>`;
}

const __skelW = new Map();
function __clsSkelW(w) {
  const key = String(w);
  let cls = __skelW.get(key);
  if (!cls) {
    cls = `skw-${key.replace(/[^a-z0-9_-]/gi,'') || 'x'}`;
    __addRule(`.${cls}`, `width:${w};min-width:${w};flex:0 0 ${w};flex-shrink:0`);
    __skelW.set(key, cls);
  }
  return cls;
}

function sBar(width='100%', size='md') {
  const h = size === 'sm' ? 'skel-bar-sm' : 'skel-bar-md';
  const w = typeof width === 'number' ? `${width}px` : width;
  return `<div class="skel ${h} ${__clsSkelW(w)}"></div>`;
}
function sChip(width='6.5rem') {
  const w = typeof width === 'number' ? `${width}px` : width;
  return `<div class="skel skel-chip ${__clsSkelW(w)}"></div>`;
}
function sBtn(width=72) {
  const w = typeof width === 'number' ? `${width}px` : width;
  return `<div class="skel skel-btn ${__clsSkelW(w)}"></div>`;
}
function sAvatar() { return `<div class="skel skel-avatar"></div>`; }

function sNick(width = '12ch') {
  return `
    <div class="inline-flex items-center gap-2 rounded-md px-1.5 py-0.5">
      <div class="h-6 w-6 rounded-full ring-1 ring-zinc-300/60 dark:ring-white/10 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        ${sAvatar()}
      </div>
      ${sBar(width,'sm')}
    </div>
  `;
}

function skeletonTableShell(headHTML, bodyRowsHTML, colgroupHTML = '') {
  return `
    <div class="overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5">
      <div class="overflow-auto">
        <div class="overflow-hidden hide-scrollbar">
          ${colgroupHTML}
          <thead class="bg-white/75 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300">${headHTML}</thead>
          <tbody>${bodyRowsHTML}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderMapSearchCardsSkeleton(count = Math.min(pageSize || 12, 12)) {
  const oneCard = () => `
    <article class="mx-card overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 ring-1 ring-zinc-300/40 dark:ring-white/5">
      <div class="mx-hero relative">
        <div class="absolute inset-0 animate-pulse bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5"></div>

        <div class="mx-titlebar absolute inset-x-0 top-0 p-3 sm:p-1">
          <div class="mx-head flex items-center justify-between gap-3">
            <h3 class="mx-title">
              <span class="block h-5 w-40 rounded bg-white/45 dark:bg-zinc-900/10 dark:bg-white/20 animate-pulse"></span>
            </h3>
            <span class="mx-status inline-flex items-center gap-2 rounded-full bg-white/85 dark:bg-zinc-900/7 dark:bg-white/15 px-2.5 py-1 text-xs ring-1 ring-zinc-400/60 dark:ring-white/20">
              <i class="mx-dot h-2 w-2 rounded-full bg-white/70"></i>
              <span class="block h-3 w-16 rounded bg-white/30 animate-pulse"></span>
            </span>
          </div>
          <div class="mx-meta mt-2">
            <span class="mx-meta-item inline-flex items-center gap-2 text-sm">
              <svg viewBox="0 0 24 24" class="h-4 w-4 text-zinc-900 dark:text-white/60" aria-hidden="true">
                <path fill="currentColor" d="M5 3a1 1 0 0 0-1 1v16l7-3 7 3V4a1 1 0 0 0-1-1H5z"/>
              </svg>
              <span class="h-3 w-10 rounded bg-white/45 dark:bg-zinc-900/10 dark:bg-white/20 animate-pulse"></span>
              <span class="sep text-zinc-900 dark:text-white/40">•</span>
              <span class="h-3 w-14 rounded bg-white/45 dark:bg-zinc-900/10 dark:bg-white/20 animate-pulse"></span>
            </span>
          </div>
        </div>

        <div class="mx-actions-vert absolute right-2 top-2 flex flex-col gap-2">
          <span class="mx-icon h-8 w-8 rounded-xl bg-zinc-900/7 dark:bg-black/40 ring-1 ring-zinc-300/60 dark:ring-white/10 animate-pulse"></span>
          <span class="mx-icon mx-icon--primary h-8 w-8 rounded-xl bg-zinc-900/7 dark:bg-black/40 ring-1 ring-zinc-300/60 dark:ring-white/10 animate-pulse"></span>
        </div>

        <div class="mx-bottom absolute inset-x-0 bottom-0 p-1 sm:p-1">
          <div class="flex items-center justify-between gap-3">

            <div class="mx-b-left flex min-w-0 items-center gap-2">
              <div class="flex -space-x-2">
                <span class="h-6 w-6 rounded-full bg-white/45 dark:bg-zinc-900/10 dark:bg-white/20 ring-1 ring-zinc-300/60 dark:ring-white/10 animate-pulse"></span>
              </div>
              <span class="ml-1 h-4 w-24 rounded bg-white/45 dark:bg-zinc-900/10 dark:bg-white/20 animate-pulse"></span>
            </div>

            <div class="mx-b-right flex items-center gap-2">
              <span class="mx-code-inline inline-flex items-center gap-2 rounded-md border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 px-2.5 py-1.5">
                <span class="h-4 w-16 rounded bg-white/45 dark:bg-zinc-900/10 dark:bg-white/20 animate-pulse"></span>
              </span>
              <span class="mx-diff inline-flex h-4 w-12 items-center justify-center rounded-full bg-white/85 dark:bg-zinc-900/7 dark:bg-white/15 ring-1 ring-zinc-300/60 dark:ring-white/10 animate-pulse"></span>
            </div>

          </div>
        </div>
      </div>
    </article>
  `;

  const grid = `
    <section class="mx-wrap px-2 sm:px-3">
      <div class="mx-grid mx-stagger grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
        ${Array.from({ length: count }, oneCard).join('')}
      </div>
    </section>
  `;

  setResultsHTML(grid);

  const root = document.getElementById('resultsContainer');
  Array.from(root.querySelectorAll('.mx-card')).forEach((el, i) =>
    setTimeout(() => el.classList.add(...String('is-in').trim().split(/\s+/).filter(Boolean)), 22 * i)
  );
}


function renderMapSearchSkeleton(rows = 8) {
  ensureSkeletonCSS();
  const headerHTML = `
    <div class="sticky top-0 z-10 bg-white/75 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 font-semibold grid grid-map_search px-3 py-2">
      <div>${t('thead.mapCode')}</div>
      <div>${t('thead.mapName')}</div>
      <div>${t('thead.mapType')}</div>
      <div>${t('thead.mapCreator')}</div>
      <div>${t('thead.mapDifficulty')}</div>
      <div>${t('thead.mapQuality')}</div>
      <div>${t('thead.mapDetails')}</div>
    </div>
  `;

  const row = `
    <div class="grid grid-map_search bg-white/70 dark:bg-zinc-900/40 px-3 py-2">
      <div>${sChip(116)}</div>
      <div>${sBar(150,'sm')}</div>
      <div>${sBar(100,'sm')}</div>
      <div>${sNick('12ch')}</div>
      <div>${sBar(70,'sm')}</div>
      <div>${sBar(80,'sm')}</div>
      <div>${sBtn(55)}</div>
    </div>
  `;

  const body = new Array(rows).fill(row).join('');

  const shell = `
    <div class="overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5">
      <div class="overflow-auto">
        <div class="minw-map_search">
          ${headerHTML}
          <div class="row-gap-y">
            ${body}
          </div>
        </div>
      </div>
    </div>
  `;
  setResultsHTML(shell);
}

const __PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

function isDefaultBannerURL(u) {
  return /(?:^|\/)(?:default|placeholder|no(?:-|_)banner)\.(?:png|webp|jpe?g|gif)$/i.test(String(u||''));
}

function renderCompletionsSkeletonCards(count = Math.min(pageSize || 12, 12)) {
  const oneCard = () => `
    <article class="mx-card overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 ring-1 ring-zinc-300/40 dark:ring-white/5">
      <div class="mx-hero relative">
        <!-- Hero skeleton (aucune image réelle ici) -->
        <div class="absolute inset-0 animate-pulse bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5"></div>
        <div class="mx-grain pointer-events-none"></div>

        <!-- Barre supérieure : chips (temps + difficulté) -->
        <div class="c-topbar">
          <div class="c-chiprow">
            <span class="c-chip">
              <svg viewBox="0 0 24 24" aria-hidden="true" class="opacity-80">
                <path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20Zm1 5v5.2l3 1.8a1 1 0 11-1 1.7l-3.6-2.1A1 1 0 0 1 10.5 13V7a1 1 0 1 1 2 0Z"/>
              </svg>
              <span class="block h-3 w-16 rounded bg-white/45 dark:bg-zinc-900/10 dark:bg-white/20 animate-pulse"></span>
            </span>
            <span class="c-chip">
              <svg viewBox="0 0 24 24" aria-hidden="true" class="opacity-80">
                <path fill="currentColor" d="M4 4h16v2H4zm0 7h16v2H4zm0 7h16v2H4z"/>
              </svg>
              <span class="block h-3 w-14 rounded bg-white/45 dark:bg-zinc-900/10 dark:bg-white/20 animate-pulse"></span>
            </span>
          </div>
        </div>

        <!-- Titlebar (présente dans la vraie vue, on garde la structure) -->
        <div class="mx-titlebar">
          <div class="mx-head"></div>
        </div>

        <!-- Actions verticales (placeholders d'icônes) -->
        <div class="mx-actions-vert flex flex-col gap-2">
          <span class="mx-icon h-8 w-8 rounded-xl bg-zinc-900/7 dark:bg-black/40 ring-1 ring-zinc-300/60 dark:ring-white/10 animate-pulse"></span>
          <span class="mx-icon h-8 w-8 rounded-xl bg-zinc-900/7 dark:bg-black/40 ring-1 ring-zinc-300/60 dark:ring-white/10 animate-pulse"></span>
        </div>

        <!-- Footer -->
        <div class="mx-bottom p-1 sm:p-1">
          <div class="flex items-center justify-between gap-3">
            <!-- Left: avatar + nickname -->
            <div class="mx-b-left flex min-w-0 items-center gap-2">
              <span class="h-6 w-6 rounded-full bg-white/45 dark:bg-zinc-900/10 dark:bg-white/20 ring-1 ring-zinc-300/60 dark:ring-white/10 animate-pulse"></span>
              <span class="ml-1 h-4 w-24 rounded bg-white/45 dark:bg-zinc-900/10 dark:bg-white/20 animate-pulse"></span>
            </div>

            <!-- Right: code + médaille -->
            <div class="mx-b-right flex items-center gap-2">
              <span class="mx-code-inline inline-flex items-center gap-2 rounded-md border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 px-2.5 py-1.5">
                <span class="h-4 w-16 rounded bg-white/45 dark:bg-zinc-900/10 dark:bg-white/20 animate-pulse"></span>
              </span>
              <span class="c-medal inline-flex h-7 items-center justify-center rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 px-3 ring-0">
                <span class="h-3 w-10 rounded bg-white/45 dark:bg-zinc-900/10 dark:bg-white/20 animate-pulse"></span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  `;

  const grid = `
    <section class="mx-wrap px-2 sm:px-3">
      <div class="mx-grid mx-stagger grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
        ${Array.from({ length: count }, oneCard).join('')}
      </div>
    </section>
  `;

  setResultsHTML(grid);

  const root = document.getElementById('resultsContainer');
  Array.from(root.querySelectorAll('.mx-card')).forEach((el, i) =>
    setTimeout(() => el.classList.add(...String('is-in').trim().split(/\s+/).filter(Boolean)), 22 * i)
  );
}

function renderCompletionsSkeleton(rows = 8) {
  ensureSkeletonCSS();

  const headerHTML = `
    <div class="sticky top-0 z-10 bg-white/75 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 font-semibold grid grid-completions px-3 py-2">
      <div>${t('thead.mapCode')}</div>
      <div>${t('thead.mapNickname')}</div>
      <div>${t('thead.mapDiscordTag')}</div>
      <div>${t('thead.mapTime')}</div>
      <div>${t('thead.mapMedal')}</div>
      <div>${t('thead.mapVideo')}</div>
      <div>${t('thead.mapDetails')}</div>
    </div>
  `;

  const row = `
    <div class="grid grid-completions bg-white/70 dark:bg-zinc-900/40 px-3 py-2">
      <div>${sChip(116)}</div>
      <div>${sNick('12ch')}</div>
      <div>${sBar(130,'sm')}</div>
      <div>${sBar(80,'sm')}</div>
      <div>${sBar(70,'sm')}</div>
      <div>${sBar(60,'sm')}</div>
      <div>${sBtn(55)}</div>
    </div>
  `;

  const body = new Array(rows).fill(row).join('');

  const shell = `
    <div class="overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5">
      <div class="overflow-auto">
        <div class="minw-completions">
          ${headerHTML}
          <div class="row-gap-y">
            ${body}
          </div>
        </div>
      </div>
    </div>
  `;
  setResultsHTML(shell);
}

function renderPersonalRecordsSkeletonCards(count = 8) {
  const card = () => `
    <article class="skel-card">
      <span class="pr-accent"></span>

      <!-- header -->
      <div class="skel-sec">
        <div class="skel-row">
          <div class="skel-avatar skel-anim"></div>
          <div class="skel-col skel-minw-0">
            <div class="skel-line skel-anim skel-w-70"></div>
            <div class="skel-line sm skel-anim skel-w-50"></div>
          </div>
          <div class="skel-chiprow">
            <div class="skel-pill skel-anim skel-wp-64"></div>
            <div class="skel-pill skel-anim skel-wp-64"></div>
            <div class="skel-pill skel-anim skel-wp-64"></div>
          </div>
        </div>
      </div>

      <!-- stats -->
      <div class="skel-sec skel-pt-8">
        <div class="skel-grid-2">
          <div class="skel-tile skel-anim"></div>
          <div class="skel-tile skel-anim"></div>
          <div class="skel-tile skel-anim"></div>
          <div class="skel-tile skel-anim"></div>
        </div>
      </div>

      <!-- bottom -->
      <div class="skel-bottom">
        <div class="skel-row skel-gap-8">
          <div class="skel-pill skel-anim skel-wp-96"></div> <!-- watch -->
        </div>
        <div class="skel-pill skel-anim skel-wp-140"></div>   <!-- code -->
      </div>
    </article>
  `;

  const html = `
    <section class="mx-wrap">
      <div class="skel-grid">
        ${Array.from({length: count}).map(card).join('')}
      </div>
    </section>
  `;
  setResultsHTML(html);
}

function renderPersonalRecordsSkeleton(rows = 8) {
  ensureSkeletonCSS();

  const headerHTML = `
    <div class="sticky top-0 z-10 bg-white/75 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 font-semibold grid grid-personal_records px-3 py-2">
      <div>${t('thead.mapCode')}</div>
      <div>${t('thead.mapNickname')}</div>
      <div>${t('thead.mapDiscordTag')}</div>
      <div>${t('thead.mapDifficulty')}</div>
      <div>${t('thead.mapTime')}</div>
      <div>${t('thead.mapMedal')}</div>
    </div>
  `;

  const row = `
    <div class="grid grid-personal_records bg-white/70 dark:bg-zinc-900/40 px-3 py-2">
      <div>${sChip(116)}</div>
      <div>${sNick('12ch')}</div>
      <div>${sBar(130,'sm')}</div>
      <div>${sBar(80,'sm')}</div>
      <div>${sBar(80,'sm')}</div>
      <div>${sBar(70,'sm')}</div>
    </div>
  `;

  const body = new Array(rows).fill(row).join('');

  const shell = `
    <div class="overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5">
      <div class="overflow-auto">
        <div class="minw-personal_records">
          ${headerHTML}
          <div class="row-gap-y">
            ${body}
          </div>
        </div>
      </div>
    </div>
  `;
  setResultsHTML(shell);
}

function renderGuidesSkeleton(rows = 2) {
  ensureSkeletonCSS();

  const headerHTML = `
    <div class="sticky top-0 z-10 bg-white/75 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 font-semibold grid grid-guide px-3 py-2">
      <div class="text-center">${t('thead.mapVideo')}</div>
    </div>
  `;

  const row = `
    <div class="grid grid-guide bg-white/70 dark:bg-zinc-900/40 px-3 py-4">
      <div class="text-center">
        <div class="mx-auto w-full max-w-3xl">
          <div class="video-embed ring-1 ring-zinc-300/60 dark:ring-white/10">
            <div class="skel skel-vid"></div>
          </div>
          <div class="mt-2 flex justify-center">${sBar(160,'sm')}</div>
        </div>
      </div>
    </div>
  `;

  const body = new Array(rows).fill(row).join('');

  const shell = `
    <div class="overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5">
      <div class="overflow-auto">
        <div class="minw-guide">
          ${headerHTML}
          <div class="row-gap-y">
            ${body}
          </div>
        </div>
      </div>
    </div>
  `;
  setResultsHTML(shell);
}

function renderSkeletonForSection(sectionId) {
  const rc = document.getElementById('resultsContainer');
  if (!rc) return;
  rc.innerHTML = '';

  const view = getSectionView(sectionId);

  const basicFallback = () => {
    setResultsHTML(`
      <div class="grid gap-2">
        ${Array.from({ length: 10 }, () =>
          `<div class="h-10 rounded-lg bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 animate-pulse"></div>`
        ).join('')}
      </div>
    `);
  };

  if (sectionId === 'map_search') {
    if (view === 'cards' && typeof renderMapSearchCardsSkeleton === 'function') {
      renderMapSearchCardsSkeleton();
      return;
    }
    if (typeof renderMapSearchSkeleton === 'function') {
      renderMapSearchSkeleton();
      return;
    }
    basicFallback();
    return;
  }

  if (sectionId === 'completions') {

    if (view === 'cards' && typeof renderCompletionsSkeletonCards === 'function') {
      renderCompletionsSkeletonCards(8);
      return;
    }

    if (typeof renderCompletionsSkeleton === 'function') {
      renderCompletionsSkeleton();
      return;
    }
    basicFallback();
    return;
  }

  if (sectionId === 'personal_records') {

    if (view === 'cards' && typeof renderPersonalRecordsSkeletonCards === 'function') {
      renderPersonalRecordsSkeletonCards(8);
      return;
    }

    if (typeof renderPersonalRecordsSkeleton === 'function') {
      renderPersonalRecordsSkeleton();
      return;
    }
    basicFallback();
    return;
  }

  if (sectionId === 'guide') {
    if (typeof renderGuidesSkeleton === 'function') {
      renderGuidesSkeleton();
      return;
    }
    basicFallback();
    return;
  }

  if (view === 'cards' && typeof renderMapSearchCardsSkeleton === 'function') {
    renderMapSearchCardsSkeleton();
  } else if (typeof renderMapSearchSkeleton === 'function') {
    renderMapSearchSkeleton();
  } else {
    basicFallback();
  }
}

/* =========================
   PAGINATION
   ========================= */
function renderPaginationButtons() {
  const paginationContainer = document.getElementById('paginationContainer');
  if (!paginationContainer) return;
  paginationContainer.innerHTML = '';

  if (!totalPages || totalPages <= 1) return;

  const wrap = document.createElement('div');
  wrap.className = 'mt-4 flex items-center gap-2 justify-center';

  const mkBtn = (label, disabled, onClick) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.disabled = !!disabled;
    b.className = [
      'inline-flex items-center justify-center rounded-lg border border-zinc-200/80 dark:border-white/10 cursor-pointer',
      'bg-white/75 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-white/10 px-3 py-1.5 text-sm',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ].join(' ');
    b.addEventListener('click', onClick);
    return b;
  };

  wrap.appendChild(mkBtn(t('pagination.first'), currentPage === 1, () => changePage(1)));
  wrap.appendChild(
    mkBtn(t('pagination.prev'), currentPage === 1, () => changePage(currentPage - 1))
  );

  const indicator = document.createElement('span');
  indicator.className = 'px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-300';
  indicator.textContent = t('pagination.page_of', { current: currentPage, total: totalPages });
  wrap.appendChild(indicator);

  wrap.appendChild(
    mkBtn(t('pagination.next'), currentPage === totalPages, () => changePage(currentPage + 1))
  );
  wrap.appendChild(
    mkBtn(t('pagination.last'), currentPage === totalPages, () => changePage(totalPages))
  );

  paginationContainer.appendChild(wrap);
}

async function changePage(pageNumber) {
  const target = Math.max(1, Math.min(pageNumber, totalPages || 1));
  if (target === currentPage) return;

  currentPage = target;
  renderSkeletonForSection(currentSection);

  const data = await fetchPageData(currentPage);
  if (data) {
    const effPageSize = getEffectivePageSize(currentSection);
    const maybeNewTotalPages = computeTotalPagesFromData(data, effPageSize);
    if (maybeNewTotalPages !== totalPages) totalPages = maybeNewTotalPages;

    displayResults(data);
    renderPaginationButtons();

    if (currentPage < totalPages) fetchPageData(currentPage + 1);
    if (currentPage > 1) fetchPageData(currentPage - 1);
  }
}

async function fetchPageData(pageNumber) {
  if (totalPages && pageNumber > totalPages) return null;
  if (pageNumber < 1) return null;

  if (cachedPages[currentSection]?.[pageNumber]) {
    return cachedPages[currentSection][pageNumber];
  }

  const effPageSize = getEffectivePageSize(currentSection);
  const req = buildSectionRequest(currentSection, activeFilters, pageNumber, effPageSize);
  const response = await fetch(req.url, { method: req.method });
  if (!response.ok) throw new Error(`Erreur réseau : ${response.statusText}`);
  const data = await response.json();

  cachedPages[currentSection] ??= {};
  cachedPages[currentSection][pageNumber] = data;

  const maybe = computeTotalPagesFromData(data, effPageSize);
  if (maybe !== totalPages) totalPages = maybe;
  return data;
}

function extractTotalResults(data) {
  if (data && typeof data.total_results === 'number') return data.total_results;
  if (Array.isArray(data?.results) && data.results.length) {
    for (const item of data.results) {
      if (item && typeof item.total_results === 'number') return item.total_results;
    }
  }
  if (Array.isArray(data) && data.length) {
    const first = data.find((it) => it && typeof it.total_results === 'number');
    if (first) return first.total_results;
  }
  return null;
}
function computeTotalPagesFromData(data, size = pageSize) {
  const total = extractTotalResults(data);
  return typeof total === 'number' && isFinite(total) && total >= 0
    ? Math.max(1, Math.ceil(total / Math.max(1, size)))
    : 1;
}

/* =========================
   HELPERS POPUPS
   ========================= */
document.addEventListener('click', (event) => {
  const likeBtn = event.target.closest('[data-role="like-button"]');
  if (!likeBtn) return;

  if (typeof showWarningMessage === 'function') {
    showWarningMessage("I'm not working yet :(");
  } else {
    alert("I'm not working yet :(");
  }
});

function canCopy() {
  return !!(navigator.clipboard && navigator.clipboard.writeText);
}

async function copyTextToClipboard(text) {
  const value = String(text ?? '').trim();
  if (!value) return false;

  try {
    if (canCopy()) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch (e) {}
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
  } catch {
    return false;
  }
}

function copyMapCode(code) {
  const msgOk = t('popup.map_code_copied', { code }) || t('popup.copied');
  const msgKo = t('popup.copy_failed');

  copyTextToClipboard(code).then((ok) => {
    if (ok) {
      showConfirmationMessage(msgOk);
      void logMapCopy(code, 'web');
    }
    else showToast(msgKo, false);
  });
}

function registerMapCodeCopyTargets(root = document) {
  root.querySelectorAll('.copy-map-code').forEach((el) => {
    if (el.dataset.copyBound === '1') return;
    el.dataset.copyBound = '1';
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const code = el.getAttribute('data-code') || el.textContent.trim();
      if (code && code !== 'N/A') copyMapCode(code);
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const code = el.getAttribute('data-code') || el.textContent.trim();
        if (code && code !== 'N/A') copyMapCode(code);
      }
    });
  });
}

// === Copy-code logging (Utilities) ==========================================
function normalizeMapCode(raw) {
  return String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
}

let __myIpCache = { value: null, at: 0 };
async function getClientIp(force = false) {
  const now = Date.now();
  if (!force && __myIpCache.value && now - __myIpCache.at < 5 * 60 * 1000) return __myIpCache.value;
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

function showToast(message, type = 'ok', opts = {}) {
  const {
    duration = 2000,
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
      ? 'bg-emerald-500/90 text-zinc-900 dark:text-white'
      : type === 'warn'
        ? 'bg-amber-500/90 text-zinc-900'
        : 'bg-red-600/90 text-zinc-900 dark:text-white';

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

// --- Pills  ---
function showPill(message, { variant = 'info', duration = 1000 } = {}) {
  const palette = {
    info: 'bg-white/90 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 ring-zinc-300/60 dark:ring-white/10',
    success: 'bg-emerald-600 text-zinc-900 dark:text-white ring-zinc-300/60 dark:ring-white/10',
    error: 'bg-rose-500/20 text-rose-200 ring-zinc-300/60 dark:ring-white/10 border border-rose-400/30',
  };

  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.className = [
    'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[2147483647]',
    'rounded-full px-4 py-2 text-sm shadow-xl',
    'opacity-0 scale-90 transition-all duration-200',
    'pointer-events-none select-none',
    'ring-1',
    palette[variant] || palette.info,
  ].join(' ');
  el.textContent = message;

  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.classList.remove(...String('opacity-0').trim().split(/\s+/).filter(Boolean), ...String('scale-90').trim().split(/\s+/).filter(Boolean));
    el.classList.add(...String('opacity-100').trim().split(/\s+/).filter(Boolean), ...String('scale-100').trim().split(/\s+/).filter(Boolean));
  });

  setTimeout(() => {
    el.classList.remove(...String('opacity-100').trim().split(/\s+/).filter(Boolean), ...String('scale-100').trim().split(/\s+/).filter(Boolean));
    el.classList.add(...String('opacity-0').trim().split(/\s+/).filter(Boolean), ...String('scale-90').trim().split(/\s+/).filter(Boolean));
    el.addEventListener('transitionend', () => el.remove(), { once: true });
  }, duration);
}

function renderMessage(message) {
  showPill(message, { variant: 'error' });

  const resultsContainer = document.getElementById('resultsContainer');
  if (resultsContainer) resultsContainer.innerHTML = '';

  const paginationContainer = document.getElementById('paginationContainer');
  if (paginationContainer) paginationContainer.innerHTML = '';
}

/* =========================
   HELPERS MODALS
   ========================= */
function ensureImageLightbox() {
  let ov = document.getElementById('imageLightboxOverlay');
  if (ov) return ov;

  const shell = document.createElement('div');
  shell.innerHTML = `
    <div id="imageLightboxOverlay"
         class="fixed inset-0 z-[95] hidden flex items-center justify-center
                bg-black/80 backdrop-blur-sm opacity-0 transition-opacity duration-200">
      <button id="imageLightboxClose"
        class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center
               rounded-full bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-white/45 dark:bg-zinc-900/10 dark:bg-white/20
               focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
        aria-label="Close image">
        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6L18 18M18 6L6 18"/>
        </svg>
      </button>
      <div class="max-w-[96vw] max-h-[92vh] p-2">
        <div id="lightboxSkel" class="skel skel-vid"></div>
        <img id="imageLightboxImg"
             class="max-w-full max-h-[90vh] rounded-2xl ring-1 ring-zinc-300/60 dark:ring-white/10 object-contain hidden" alt="">
      </div>
    </div>`;
  document.body.appendChild(shell.firstElementChild);

  ov = document.getElementById('imageLightboxOverlay');
  const btn = document.getElementById('imageLightboxClose');
  const close = () => {
    ov.classList.add(...String('opacity-0').trim().split(/\s+/).filter(Boolean)); ov.classList.remove(...String('opacity-100').trim().split(/\s+/).filter(Boolean));
    setTimeout(() => ov.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean)), 180);
  };
  btn.addEventListener('click', close);
  ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !ov.classList.contains('hidden')) close();
  });

  return ov;
}

function openImageLightbox(src, alt = '') {
  const ov = ensureImageLightbox();
  const img = document.getElementById('imageLightboxImg');
  const sk  = document.getElementById('lightboxSkel');

  img.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
  sk.style.display = 'block';

  img.onload = () => { sk.style.display = 'none'; img.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean)); };
  img.onerror = () => { sk.style.display = 'none'; img.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean)); img.alt = 'Image failed to load'; };

  img.src = src;
  img.alt = alt || '';

  ov.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
  requestAnimationFrame(() => {
    ov.classList.remove(...String('opacity-0').trim().split(/\s+/).filter(Boolean)); ov.classList.add(...String('opacity-100').trim().split(/\s+/).filter(Boolean));
  });
}

/* =========================
   HELPERS MAP SEARCH
   ========================= */
function renderMapSearchResultsByMode(rows) {
  lastMapRows = Array.isArray(rows) ? rows : [];
  if (mapSearchView === 'table') {
    displayMapSearchResultsTable(lastMapRows);
  } else {
    displayMapSearchResultsCards(lastMapRows);
  }
}

function renderCompletionsResultsByMode(resultsContainer) {
  const container = normalizeToRowsContainer(resultsContainer);
  lastCompletionsRows = container.results || [];
  if (completionsView === 'cards') {
    return displayCompletionsResultsCards(container.results);
  }
  return displayCompletionsResults(container);
}

function renderPersonalRecordsResultsByMode(resultsContainer) {
  const container = normalizeToRowsContainer(resultsContainer);
  lastPersonalRows = container.results || [];
  if (personalRecordsView === 'cards') {
    return displayPersonalRecordsResultsCards(container.results);
  }
  return displayPersonalRecordsResults(container);
}

async function fetchMapCompletionStatistics(mapCode) {
  try {
    const url = `/api/community/statistics/maps/completions?code=${encodeURIComponent(mapCode)}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const row = data[0] || {};
    const toNum = (v) => (v == null || v === '' ? null : Number(v));
    return { min: toNum(row.min), max: toNum(row.max), avg: toNum(row.avg) };
  } catch (error) {
    console.error('Error fetching map completion statistics:', error);
    return null;
  }
}

async function fetchProgression(mapCode) {
  try {
    const chartContainer = document.getElementById('chartContainer');
    if (!chartContainer) return [];
    showProgressionLoading();

    const uid = typeof window !== 'undefined' && window.user_id ? String(window.user_id) : null;
    if (!uid) {
      chartContainer.innerHTML = `<p class="text-center font-semibold text-red-400">⚠️ ${t('popup.login_required_progression')}</p>`;
      return [];
    }

    const url = `/api/community/statistics/maps/${encodeURIComponent(mapCode)}/user/${encodeURIComponent(uid)}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });

    let data = null;
    try { data = await response.json(); } catch { data = null; }

    if (!response.ok) {
      const msg = data && data.message ? data.message : 'An error occurred. Please try again';
      chartContainer.innerHTML = `<p class="text-center font-semibold text-red-400">${msg}</p>`;
      return [];
    }

    if (!Array.isArray(data) || data.length === 0) {
      chartContainer.innerHTML = `<p class="text-center font-semibold text-zinc-900 dark:text-zinc-100">${t('popup.no_results')}</p>`;
      return [];
    }

    const sorted = data
      .map((item) => ({
        time: parseFloat(item.time),
        label: new Date(item.inserted_at).toLocaleString(),
        inserted_at: new Date(item.inserted_at),
      }))
      .sort((a, b) => a.inserted_at - b.inserted_at);

    return sorted;
  } catch (error) {
    console.error('Error fetching progression data:', error);
    const chartContainer = document.getElementById('chartContainer');
    if (chartContainer) {
      chartContainer.innerHTML = `<p class="text-center font-semibold text-red-500">An error occurred. Please try again later.</p>`;
    }
    return [];
  }
}

function renderProgressionChart(data, stats = { min: null, max: null, avg: null }) {
  const chartContainer = document.getElementById('chartContainer');
  chartContainer.innerHTML = `
    <div class="rounded-xl bg-white/75 dark:bg-zinc-900/60 ring-1 ring-zinc-300/60 dark:ring-white/10 p-4">
      <canvas id="progressionChart" class="w-full h-[280px]"></canvas>
    </div>
  `;

  if (!Array.isArray(data) || data.length === 0) {
    chartContainer.innerHTML = `<p class="text-center font-semibold text-zinc-900 dark:text-zinc-100">No valid progression data available to display</p>`;
    return;
  }
  if (typeof Chart === 'undefined') {
    chartContainer.innerHTML = `<p class="text-center font-semibold text-red-400">Chart.js missing</p>`;
    return;
  }

  const recent = data.slice(-20);
  let labels = recent.map(d => d.label || new Date(d.inserted_at).toLocaleString());
  let times  = recent.map(d => Number(d.time)).filter(v => Number.isFinite(v));

  if (times.length === 1) { times = [times[0], times[0]]; labels = [labels[0], labels[0]]; }

  const { min, max, avg } = stats || {};
  const lineOf = (val, len) => (val != null ? new Array(len).fill(val) : []);

  const ctx = document.getElementById('progressionChart').getContext('2d');

  const fmtTime = (s) => {
    if (s == null || isNaN(s)) return '—';
    const ms = Math.round((s % 1) * 100);
    const total = Math.floor(s);
    const m = Math.floor(total / 60);
    const sec = total % 60;
    return `${m}:${String(sec).padStart(2,'0')}.${String(ms).padStart(2,'0')}`;
  };

  const old = Chart.getChart(ctx.canvas);
  if (old) old.destroy();

  const datasets = [];

  times.forEach((v, i) => {
    const isLatest = i === times.length - 1;
    datasets.push({
      label: isLatest ? t('chart.user_record_progression') : '',
      data: lineOf(v, labels.length),
      borderColor: isLatest ? 'rgba(16,185,129,0.95)' : 'rgba(16,185,129,0.20)',
      borderWidth: isLatest ? 2 : 1,
      borderDash: isLatest ? [] : [],
      pointRadius: 0,
      fill: false,
    });
  });

  const addRef = (val, label, color) => {
    if (val == null) return;
    datasets.push({
      label,
      data: lineOf(val, labels.length),
      borderColor: color,
      borderDash: [6, 6],
      borderWidth: 2,
      pointRadius: 0,
      fill: false,
    });
  };
  addRef(avg, t('chart.average_time'), 'rgba(234,179,8,1)'); // amber-500
  addRef(min, t('chart.min_time'),     'rgba(59,130,246,1)'); // blue-500
  addRef(max, t('chart.max_time'),     'rgba(239,68,68,1)');  // red-500

  new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      interaction: { mode: 'nearest', intersect: false },
      layout: { padding: { left: 4, right: 8, top: 6, bottom: 0 } },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#E5E7EB',
            font: { family: 'Inter, ui-sans-serif, system-ui', weight: '600', size: 12 },
            padding: 16,
            usePointStyle: true,
            boxWidth: 8,
            filter: (item) => !!item.text,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(24,24,27,0.95)',
          titleColor: '#fff',
          bodyColor: '#E5E7EB',
          borderColor: 'rgba(255,255,255,0.12)',
          borderWidth: 1,
          padding: 10,
          displayColors: true,
          callbacks: {
            title: (items) => items[0]?.label ?? '',
            label: (ctx) => {
              const v = Number(ctx.parsed.y);
              if (!Number.isFinite(v)) return '';
              return `${ctx.dataset.label || t('chart.user_record_progression')}: ${v.toFixed(2)} s`;
            },
          },
        },
        title: { display: false },
        },
        elements: {
          point: { radius: 0 },
          line:  { stepped: false },
        },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#E5E7EB',
            font: { family: 'Inter, ui-sans-serif, system-ui', weight: 600, size: 12 },
            callback: (v) => {
              const n = Number(v);
              return Number.isFinite(n) ? `${n.toFixed(2)} s` : '';
            },
          },
          grid: { color: 'rgba(255,255,255,0.06)', drawBorder: false },
          border: { display: false },
        },
        x: {
          ticks: {
            color: '#E5E7EB',
            font: { family: 'Inter, ui-sans-serif, system-ui', weight: 600, size: 12 },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 6,
          },
          grid: { display: false },
          border: { display: false },
        },
      },
    },
  });
}
