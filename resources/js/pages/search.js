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
let totalPages = 1;
let hideTimeout;
const resultsContainer = document.getElementById('resultsContainer');
const CURRENT_LANG = document.documentElement.lang || 'en';
let translations = window.SEARCH_I18N || {};
const MAP_VIEW_LS_KEY = 'map_search_view';
let mapSearchView = (localStorage.getItem(MAP_VIEW_LS_KEY) === 'table') ? 'table' : 'cards';
let lastMapRows = [];
const COMPLETIONS_VIEW_LS_KEY = 'completions_view';
let completionsView = (localStorage.getItem(COMPLETIONS_VIEW_LS_KEY) === 'cards') ? 'cards' : 'table';
let lastCompletionsRows = [];
const PERSONAL_RECORDS_VIEW_LS_KEY = 'personal_records_view';
let personalRecordsView = (localStorage.getItem(PERSONAL_RECORDS_VIEW_LS_KEY) === 'cards') ? 'cards' : 'table';
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
  el.classList.remove('u-d-none');
  el.classList.add('u-d-block');
}
function showFlex(el) {
  if (!el) return;
  el.classList.remove('u-d-none');
  el.classList.add('u-flex');
}
function hideEl(el) {
  if (!el) return;
  el.classList.remove('u-d-block', 'u-flex');
  el.classList.add('u-d-none');
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
  if (prev) el.classList.remove(prev);
  const cls = __clsPos(top, left, minW);
  el.classList.add(cls);
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
    'playtest_filter',
    'completion_filter',
    'medal_filter',
    'official', 
    'apply_filters',
    'clear_filters',
  ].map((id) => ({
    id,
    name: t(`filters_toolbar.${id}`) || id.replace('_', ' ').toUpperCase(),
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
function initSearchTabs(defaultSection = 'map_search') {
  const tabsContainer = document.getElementById('searchTabs');
  const highlight = document.getElementById('searchTabsHighlight');
  if (!tabsContainer || !highlight) return;

  if (highlight.parentElement !== tabsContainer) {
    tabsContainer.appendChild(highlight);
  }

  const buttons = Array.from(tabsContainer.querySelectorAll('.search-tab'));
  if (!buttons.length) return;

  if (getComputedStyle(tabsContainer).position === 'static') {
    tabsContainer.style.position = 'relative';
  }

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
    transition: 'transform .28s cubic-bezier(.22,.9,.24,1), width .28s cubic-bezier(.22,.9,.24,1)',
    willChange: 'transform,width',
    zIndex: '0'
  });
  buttons.forEach(b => { b.style.position = 'relative'; b.style.zIndex = '1'; });

  const selectedModeEl = document.getElementById('selectedMode');

  const moveHighlightTo = (btn) => {
    if (!btn) return;
    const br = btn.getBoundingClientRect();
    const cr = tabsContainer.getBoundingClientRect();
    const left = br.left - cr.left;
    const width = br.width;
    requestAnimationFrame(() => {
      highlight.style.width = `${Math.max(0, width)}px`;
      highlight.style.transform = `translate3d(${Math.max(0, left)}px,0,0)`;
    });
  };

  const setActive = (section, { updateUrl = true, triggerLoad = true } = {}) => {
    let activeBtn = buttons.find(b => b.getAttribute('data-section') === section) || buttons[0];
    const activeSection = activeBtn?.getAttribute('data-section') || section;

    buttons.forEach((btn) => {
      const isActive = btn === activeBtn;
      btn.classList.toggle('bg-white', isActive);
      btn.classList.toggle('text-zinc-900', isActive);
      btn.classList.toggle('text-white', !isActive);
      btn.classList.toggle('hover:bg-white/10', !isActive);
    });

    moveHighlightTo(activeBtn);

    if (selectedModeEl) {
      const label = activeBtn?.textContent?.trim() || '';
      selectedModeEl.textContent = label || (window.SEARCH_I18N?.select_mode ?? 'Select a mode');
    }

    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('section', activeSection);
      history.replaceState(
        { section: activeSection },
        '',
        url.pathname + '?' + url.searchParams.toString() + url.hash
      );
    }

    if (triggerLoad && typeof window.selectSection === 'function') {
      window.selectSection(activeSection, { push: false, replace: true });
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
      if (section) setActive(section, { updateUrl: true, triggerLoad: true });
    });
  });

  const desired = getDesired();
  const initialBtn = buttons.find(b => b.getAttribute('data-section') === desired) || buttons[0];

  requestAnimationFrame(() => {
    moveHighlightTo(initialBtn);
    setActive(initialBtn.getAttribute('data-section'), {
      updateUrl: !new URLSearchParams(window.location.search).get('section'),
      triggerLoad: true
    });

    const recalc = () => {
      const active = buttons.find(b => b.classList.contains('bg-white')) || initialBtn;
      moveHighlightTo(active);
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
  const { push = true, replace = false } = opts;

  if (sectionId === 'personal_records' && !user_id) {
    renderMessage(t('popup.login_required_pr'));
    hideLoadingBar();
    return;
  }

  if (currentSection !== sectionId) {
    const rc = document.getElementById('resultsContainer');
    if (rc) rc.innerHTML = '';
    const pc = document.getElementById('paginationContainer');
    if (pc) pc.innerHTML = '';
  }

  currentSection = sectionId;

  if (Object.keys(filters).length > 0 || selectedFilters.length > 0) clearFilters(true);
  currentPage = 1;

  const selectedModeText = document.getElementById('selectedMode');
  const addFilterMessage = document.getElementById('addFilterMessage');
  if (addFilterMessage) hideEl(addFilterMessage);
  if (selectedModeText) hideEl(selectedModeText);

  document.querySelectorAll('.tab-buttons button').forEach((btn) => btn.classList.remove('active'));
  const tabBtn = document.getElementById(`${sectionId}Btn`);
  if (tabBtn) tabBtn.classList.add('active');

  initializeToolbarButtons();
  applyFilters();

  const fa = document.getElementById('filterActions');
  if (fa) showFlex(fa);

  if (push) {
    const url = new URL(location.href);
    url.searchParams.set(SECTION_URL_PARAM, sectionId);
    const state = { section: sectionId };
    if (replace) history.replaceState(state, '', url);
    else history.pushState(state, '', url);
  }
}
window.selectSection = selectSection;

/* =========================
   URL
   ========================= */
const SECTION_URL_PARAM = 'section';
const VALID_SECTIONS = new Set(['map_search','completions','guide','personal_records']);

window.addEventListener('popstate', () => {
  const s = new URL(location.href).searchParams.get(SECTION_URL_PARAM);
  const section = VALID_SECTIONS.has(s) ? s : 'map_search';
  if (section !== currentSection) selectSection(section, { push: false });
});

/* =========================
   GLOBAL INITS
   ========================= */
async function initializeApp() {
  const fa = document.getElementById('filterActions');
  if (fa) hideEl(fa);
  initSearchTabs();
  initializeIcons();
  await loadDynamicOptions();
  initializeToolbarButtons();
  hideOnClickOutside();
  if (fa) showFlex(fa);
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
  el.classList.add('is-measuring', 'u-d-block');
  const rect = el.getBoundingClientRect();
  const width = rect.width || el.offsetWidth || 0;
  const height = rect.height || el.offsetHeight || 0;
  el.classList.remove('is-measuring');
  if (!prevDisp) el.classList.remove('u-d-block');
  return { width, height };
}

function _ensureFloating(el, anchorEl, opts = {}) {
  if (!el || !anchorEl) return;
  if (el.parentElement !== document.body) document.body.appendChild(el);
  el.classList.add('u-absolute');
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

  el.classList.add('u-d-block');
  doPosition();
}

function _hideFloating(el) {
  if (!el) return;
  el.classList.remove('u-d-block');
  el.classList.add('u-d-none');
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
  document.querySelectorAll('.toolbar-button').forEach((btn) => btn.remove());
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
          .forEach((c) => c.classList.remove('circle-visible'));
        document
          .querySelectorAll('.toolbar-button')
          .forEach((btn) => btn.classList.remove('selected'));
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
        .forEach((btn) => btn.classList.remove('selected'));
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

  document.querySelectorAll('.toolbar-button').forEach((btn) => btn.classList.remove('selected'));
}

function hideAllActiveSuggestions() {
  document.querySelectorAll('.suggestions-container').forEach((el) => {
    el.classList.remove('active');
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
      'filter-input mt-0 w-56 rounded-lg border border-white/10 bg-zinc-900/90 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 shadow-lg ring-1 ring-white/10 focus:outline-none u-d-none';
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
    'toolbar-button cursor-pointer relative inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-2 text-sm hover:bg-white/5 transition-colors';
  button.setAttribute('data-name', icon.name);
  button.id = `${icon.id}FilterButton`;
  button.innerHTML = `
    <svg class="h-5 w-5 text-zinc-200" viewBox="${icon.viewBox || '0 0 24 24'}" xmlns="http://www.w3.org/2000/svg">${icon.svg}</svg>
    <div class="icon-name text-xs text-zinc-300">${icon.name}</div>
    <span class="filter-badge hidden absolute -top-1 -right-1 rounded-full bg-emerald-500/90 text-[10px] font-semibold text-white leading-none ring-1 ring-white/20 px-1.5 py-0.5"></span>
  `;
  return button;
}

function showOptionsContainer(id, options, button, useWrapper = false) {
  let optionsContainer = button.querySelector('.custom-options');
  if (!optionsContainer) {
    optionsContainer = document.createElement('div');
    optionsContainer.id = id;
    optionsContainer.className =
      'custom-options opacity-0 translate-y-1 transition p-2 mt-0 z-45 bg-zinc-900/95 backdrop-blur shadow-lg ring-1 ring-white/10 rounded-lg w-60 max-h-56 overflow-y-auto';
    optionsContainer.classList.add(useWrapper ? 'with-wrapper' : 'without-wrapper');

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
          'custom-option-wrapper group flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer hover:bg-white/5 focus-within:ring-1 focus-within:ring-brand-400/40';

        checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${id}_${rawValue.replace(/\s+/g, '_')}`;
        checkbox.className = 'custom-checkbox peer sr-only';

        const ui = document.createElement('span');
        ui.className = [
          'inline-flex h-4 w-4 items-center justify-center rounded',
          'border border-white/15 bg-zinc-900 ring-1 ring-inset ring-white/5',
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
        label.className = 'custom-option flex-1 text-sm text-zinc-200 group-hover:text-white';
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
          'custom-option cursor-pointer rounded-md px-3 py-2 text-sm text-zinc-200 hover:bg-white/10 flex items-center justify-between gap-3';
        optionElement.setAttribute('data-raw-value', rawValue);

        let dotHTML = '';
        if (isDifficulty) {
          const { dot } = difficultyClasses(rawValue);
          dotHTML = `<span class="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-white/20 shrink-0 ${dot}" aria-hidden="true"></span>`;
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
          case 'onlyPlaytest':      labelId = 'in playtest'; break;
          case 'ignoreCompletions': labelId = 'completed'; break;
          case 'onlyMedals':        labelId = 'medals'; break;
          default:                  labelId = id.replace('Options', '');
        }

        if (!useWrapper) {
          optionsContainer
            .querySelectorAll('.custom-option')
            .forEach((opt) => opt.classList.remove('selected'));
          optionElement.classList.add('selected');

          optionsContainer
            .querySelectorAll('.custom-option [data-check]')
            .forEach((c) => (c.style.opacity = '0'));
          const mark = optionElement.querySelector('[data-check]');
          if (mark) mark.style.opacity = '1';
        }

        if (id !== 'mechanicsOptions' && id !== 'restrictionsOptions') {
          optionsContainer.style.display = 'none';
          optionsContainer.classList.remove('show');
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
      'custom-options opacity-0 translate-y-1 transition p-3 mt-0 z-45 bg-zinc-900/95 backdrop-blur shadow-lg ring-1 ring-white/10 rounded-lg w-56';
    opts.dataset.filterKeyRaw = 'playtestStatus';
    opts.dataset.anchorId = button.id;

    opts.innerHTML = `
      <label for="playtestStatusCheckbox" class="flex items-center justify-between gap-3 select-none">
        <span data-role="pt-status-label" class="text-sm text-zinc-200">${labelInProgress}</span>
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
    text: 'text-zinc-200',
    chip: 'border-white/10 bg-white/5 text-zinc-200',
    dot: 'bg-zinc-900/60',
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
      'ml-auto inline-flex items-center gap-0 rounded-lg border border-white/10 overflow-hidden ' +
      'bg-zinc-900/60 backdrop-blur ring-1 ring-white/10';
    wrap.innerHTML = `
      <button type="button" data-view="cards"
        class="cursor-pointer px-2.5 py-1.5 text-xs flex items-center gap-1 ${mapSearchView==='cards'?'bg-white/10 ring-1 ring-white/10':''}"
        aria-pressed="${mapSearchView==='cards'}">
        <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/>
        </svg>
        <span class="hidden sm:inline"></span>
      </button>
      <button type="button" data-view="table"
        class="cursor-pointer px-2.5 py-1.5 text-xs flex items-center gap-1 ${mapSearchView==='table'?'bg-white/10 ring-1 ring-white/10':''}"
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
      b.classList.toggle('bg-white/10', on);
      b.classList.toggle('ring-1', on);
      b.classList.toggle('ring-white/10', on);
    });

    if (Array.isArray(lastMapRows) && lastMapRows.length) {
      renderMapSearchResultsByMode(lastMapRows);
    } else {
      applyFilters(activeFilters);
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
      'ml-auto inline-flex items-center gap-0 rounded-lg border border-white/10 overflow-hidden ' +
      'bg-zinc-900/60 backdrop-blur ring-1 ring-white/10';
    wrap.innerHTML = `
      <button type="button" data-view="cards"
        class="cursor-pointer px-2.5 py-1.5 text-xs flex items-center gap-1 ${completionsView==='cards'?'bg-white/10 ring-1 ring-white/10':''}"
        aria-pressed="${completionsView==='cards'}">
        <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/>
        </svg>
        <span class="hidden sm:inline"></span>
      </button>
      <button type="button" data-view="table"
        class="cursor-pointer px-2.5 py-1.5 text-xs flex items-center gap-1 ${completionsView==='table'?'bg-white/10 ring-1 ring-white/10':''}"
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
      b.classList.toggle('bg-white/10', on);
      b.classList.toggle('ring-1', on);
      b.classList.toggle('ring-white/10', on);
    });

    if (Array.isArray(lastCompletionsRows) && lastCompletionsRows.length) {
      renderCompletionsResultsByMode({ results: lastCompletionsRows });
    } else {
      applyFilters(activeFilters);
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
      'ml-auto inline-flex items-center gap-0 rounded-lg border border-white/10 overflow-hidden '+
      'bg-zinc-900/60 backdrop-blur ring-1 ring-white/10';
    wrap.innerHTML = `
      <button type="button" data-view="cards"
        class="cursor-pointer px-2.5 py-1.5 text-xs flex items-center gap-1 ${personalRecordsView==='cards'?'bg-white/10 ring-1 ring-white/10':''}"
        aria-pressed="${personalRecordsView==='cards'}">
        <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/>
        </svg>
        <span class="hidden sm:inline"></span>
      </button>
      <button type="button" data-view="table"
        class="cursor-pointer px-2.5 py-1.5 text-xs flex items-center gap-1 ${personalRecordsView==='table'?'bg-white/10 ring-1 ring-white/10':''}"
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
      b.classList.toggle('bg-white/10', on);
      b.classList.toggle('ring-1', on);
      b.classList.toggle('ring-white/10', on);
    });

    if (Array.isArray(lastPersonalRows) && lastPersonalRows.length) {
      renderPersonalRecordsResultsByMode({ results: lastPersonalRows });
    } else {
      applyFilters(activeFilters);
    }
  });
}

function getSectionView(section) {
  const key = VIEW_LS_KEYS[section];
  if (!key) return 'cards';
  const v = localStorage.getItem(key);
  return v === 'table' ? 'table' : 'cards';
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
      ['code', 'user', 'apply_filters', 'clear_filters'].includes(icon.id)
    ),
  };
  const filteredIcons = sectionIconsMap[currentSection] || icons;

  filteredIcons.forEach((icon) => {
    const button = createButton(icon);
    toolbar.appendChild(button);

    button.addEventListener('click', () => {
      hideAllFilters();
      hideAllActiveSuggestions();

      button.classList.add('selected');

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
            [
              //{ text: t("filters_toolbar.beginner"), value: "Beginner", raw: "Beginner" },
              { text: t('filters_toolbar.easy'), value: 'Easy', raw: 'Easy' },
              { text: t('filters_toolbar.medium'), value: 'Medium', raw: 'Medium' },
              { text: t('filters_toolbar.hard'), value: 'Hard', raw: 'Hard' },
              { text: t('filters_toolbar.very_hard'), value: 'Very Hard', raw: 'Very Hard' },
              { text: t('filters_toolbar.extreme'), value: 'Extreme', raw: 'Extreme' },
              { text: t('filters_toolbar.hell'), value: 'Hell', raw: 'Hell' },
            ],
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
              { text: 'True',  value: 'True',  raw: 'True' },
              { text: 'False', value: 'False', raw: 'False' },
            ],
            button,
            false
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
          applyFilters(activeFilters);
          break;
        case 'clear_filters':
          clearFilters();
          applyFilters();
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
    completionFilter: 'completion_filter',
    official: 'official',
  };

  activeFilters = { ...persistentFilters };

  document.querySelectorAll('.custom-options').forEach((optionsContainer) => {
    const filterId = optionsContainer.id.replace('Options', '');
    const mappedFilterId = filterMappings[filterId] || filterId;

    if (filterId === 'mechanics' || filterId === 'restrictions') {
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
    const raw = mapNameInput.getAttribute('data-selected-raw-value') || mapNameInput.value.trim();
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
    if (filterId === 'mechanics' || filterId === 'restrictions') {
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
      button.classList.add(
        'active-filter',
        'border-brand-400/40',
        'ring-1',
        'ring-emerald-500/30'
      );
    } else {
      button.classList.remove(
        'active-filter',
        'border-brand-400/40',
        'ring-1',
        'ring-emerald-500/30'
      );
    }

    // ====== Lock ======
    if (isLockedByCode) {
      button.disabled = true;
      button.classList.add(
        'cursor-not-allowed',
        'pointer-events-none',
        'is-disabled-by-code'
      );

      button.classList.remove('selected');
      const circle = button.querySelector('.selection-circle');
      if (circle) circle.classList.remove('circle-visible');
    } else {
      button.disabled = false;
      button.classList.remove(
        'cursor-not-allowed',
        'pointer-events-none',
        'is-disabled-by-code'
      );
    }

    // ====== Badge ======
    const badge = button.querySelector('.filter-badge');
    if (!badge) return;

    if (!effectiveActive) {
      badge.classList.add('hidden');
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
      text = value ? 'ON' : 'OFF';
    } else if (typeof value === 'string') {
      const display = translateBadgeValue(filterId, value);
      text = display.length > 6 ? display.slice(0, 6) + '…' : display;
    }

    badge.textContent = text;
    badge.classList.remove('hidden');
  });
}

function syncOptionsWithFilters(optionsContainer, filterKeyRaw) {
  if (!optionsContainer) return;

  const map = {
    category: 'category',
    difficultyExact: 'difficulty_exact',
    mechanics: 'mechanics',
    restrictions: 'restrictions',
    playtest_filter: 'playtest_filter',
    completionFilter: 'completion_filter',
    medalFilter: 'medal_filter',
    official: 'official',
  };
  const mapped = map[filterKeyRaw] || filterKeyRaw;

  const source = { ...persistentFilters, ...activeFilters };
  const val = source[mapped];
  if (val == null) return;

  if (mapped === 'mechanics' || mapped === 'restrictions') {
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
    if (match) opt.classList.add('selected');
    else opt.classList.remove('selected');
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
    .forEach((opt) => opt.classList.remove('selected'));
  document
    .querySelectorAll('.custom-option [data-check]')
    .forEach((svg) => (svg.style.opacity = '0'));
  document
    .querySelectorAll('.toolbar-button')
    .forEach((btn) => btn.classList.remove('active-filter', 'border-brand-400/40'));

  if (hasActiveFilters && !silent) {
    showWarningMessage(t('popup.filters_cleared'));
  }

  updateOfficialNotice();
}

async function applyFilters(filters) {
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

  if (currentSection === 'map_search' && !activeFilters.playtest_filter) {
    activeFilters.playtest_filter = 'All';
  }

  renderSkeletonForSection(currentSection);
  showLoadingBar();

  try {
    const req = buildSectionRequest(currentSection, activeFilters, 1, pageSize);

    const response = await fetch(req.url, {
      method: req.method,
      ...(req.headers ? { headers: req.headers } : {}),
      ...(req.body ? { body: req.body } : {}),
    });
    if (!response.ok) throw new Error('Erreur réseau : ' + response.statusText);

    const data = await response.json();

    persistentFilters = { ...activeFilters };
    cachedPages[currentSection] = { 1: data };
    totalPages = computeTotalPagesFromData(data, pageSize);

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
    const query = toQuery({
      user_id: (typeof user_id !== 'undefined' && user_id ? String(user_id) : (filters.user_id || '')),
      difficulty: filters.difficulty_exact || '',
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
      const translatedName = t(
        `map_name.${r.map_name.toLowerCase().replace(/ /g, '_').replace(/[()']/g, '')}`
      );
      if (typeof translatedName === 'string' && !translatedName.includes('map_name.')) {
        r.map_name = translatedName;
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
      'rounded-lg border border-white/10 bg-zinc-900/95 text-sm text-zinc-100',
      'shadow-xl ring-1 ring-white/10',
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

  debounceTimeout = setTimeout(() => {
    const locale = CURRENT_LANG === 'cn' ? 'cn' : CURRENT_LANG === 'jp' ? 'en' : 'en';
    const url = buildAutocompleteUrl(apiEndpoint, { value: filterValue, locale, pageSize: 10 });

    fetch(url, { headers: { Accept: 'application/json' } })
      .then((r) => {
        if (!r.ok) throw new Error(`API Error: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        suggestionsContainer.innerHTML = '';
        if (!Array.isArray(data) || data.length === 0) {
          closeFloating(suggestionsContainer);
          return;
        }

        const makeItem = (label, raw) => {
          const d = document.createElement('div');
          d.textContent = label;
          d.className =
            'suggestion-item cursor-pointer px-3 py-2 text-sm text-zinc-200 hover:bg-white/10';
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
              parentBtn.classList.remove('selected');
              const circle = parentBtn.querySelector('.selection-circle');
              if (circle) circle.classList.remove('circle-visible');
            }
          });
          return d;
        };

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
          if (item[propertyName]) {
            const rawValue = item[propertyName];
            const displayName = item.translated_map_name || rawValue;
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
      })
      .catch((error) => {
        console.error(`Error fetching ${apiEndpoint} suggestions:`, error);
        closeFloating(suggestionsContainer);
      });
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
  if (value == null || isNaN(value)) return '<span class="text-zinc-500">N/A</span>';
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
    bar.classList.add(__clsQmbColor(color));
    const delayCls = __clsTransDelay(Math.min(i * 30, 300));
    fill.classList.add(delayCls);
    requestAnimationFrame(() => {
      bar.classList.add(__clsWidthPct(target));
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
    tr.classList.add(__clsAnimDelay(__clamp(i * 30, 0, 250)), 'tr-sf-enter');
    tr.addEventListener('animationend', () => tr.classList.remove('tr-sf-enter'), { once: true });
  });
}

function mountToolbarAnimation() {
  const c = document.querySelector('.toolbar-container');
  if (!c) return;
  if (!c.classList.contains('is-mounted')) {
    requestAnimationFrame(() => {
      c.classList.add('is-mounted');
      const btns = c.querySelectorAll('.toolbar-button');
      btns.forEach((b, i) => {
        const delay = Math.min(220, i * 35);
        b.classList.add(__clsTransDelay(delay));
        requestAnimationFrame(() => b.classList.add('sf-in'));
      });
    });
  }
}

function refreshToolbarAnimation() {
  const c = document.querySelector('.toolbar-container');
  if (!c) return;
  c.classList.remove('is-mounted');
  c.querySelectorAll('.toolbar-button').forEach((b) => {
    b.classList.remove('sf-in');
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
  rows.forEach((tr) => tr.classList.add('gp-reveal'));
  requestAnimationFrame(() => {
    rows.forEach((tr, i) => {
      const delay = __clamp(i * 18, 0, 280);
      tr.classList.add(__clsTransDelay(delay), 'gp-reveal-show');
      tr.classList.remove('gp-reveal');
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
    loadingEl.classList.add('is-visible');
  });
}

function hideLoadingBar() {
  if (!loadingEl) return;
  loadingEl.classList.remove('is-visible');
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

  if (__isFloatingOpen(el)) {
    _ensureFloating(el, anchor, { matchAnchorWidth, place: { offset, pad: 8, align: 'left' } });
    return;
  }

  el.dataset.floatOpen = '1';
  el.style.transformOrigin = origin;

  el.classList.remove('invisible', 'u-invisible');
  el.style.visibility = 'visible';

  el.style.transition = 'none';
  el.style.opacity = 0;
  el.style.transform = 'translateY(4px) scale(0.98)';

  _ensureFloating(el, anchor, { matchAnchorWidth, place: { offset, pad: 8, align: 'left' } });
  el.classList.remove('u-d-none');
  el.classList.add('u-d-block');

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
    el.classList.remove('u-d-block');
    el.classList.add('u-d-none');
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
        <div class="mt-4 rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-6 text-center text-sm text-zinc-300">
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
    const mapNameKey  = (r.original_map_name || r.map_name || 'default').toLowerCase().replace(/[()\s']/g, '');
    const bannerPath  = r.map_banner || `assets/banners/${mapNameKey}.png`;
    const bannerFB    = `assets/banners/${mapNameKey}.png`;
    const checkpoints = (r.checkpoints != null && r.checkpoints !== 'N/A') ? String(r.checkpoints) : '';

    const medalClass =
      user_id && r.medal_type === 'Gold'   ? 'mx-card--gold'   :
      user_id && r.medal_type === 'Silver' ? 'mx-card--silver' :
      user_id && r.medal_type === 'Bronze' ? 'mx-card--bronze' : '';

    return `
      <article class="mx-card ${diffCls} ${medalClass}">
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
    if (img.complete && img.naturalWidth > 0) hero.classList.remove('is-loading');
    else img.addEventListener('load', () => hero.classList.remove('is-loading'), { once:true });
    img.addEventListener('error', () => { if (fb && img.src !== fb) img.src = fb; }, { once:true });
  });

  ensureSearchDetailsModal();
  resultsRoot.querySelectorAll('.js-open-map-details').forEach((btn) =>
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-index'));
      openSearchDetailsModal(filtered[idx]);
    })
  );

  Array.from(resultsRoot.querySelectorAll('.mx-card')).forEach((el, i) =>
    setTimeout(() => el.classList.add('is-in'), 24 * i)
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
        <div class="mt-4 rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-6 text-center text-sm text-zinc-300">
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
    <div class="sticky top-0 z-10 bg-zinc-900/95 text-zinc-300 font-semibold grid grid-map_search px-3 py-2">
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
          class="inline-flex items-center gap-2 rounded-md hover:bg-white/5 px-1.5 py-0.5"
          title="${escAttr(name)}">
          <img
            src="${escAttr(fallback)}"
            alt=""
            class="h-6 w-6 rounded-full object-cover ring-1 ring-white/10 bg-zinc-800"
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
                class="copy-map-code group relative z-10 inline-flex items-center gap-1 rounded-md border border-white/10 bg-zinc-900/60 px-2 py-0.5
                       text-xs font-semibold text-zinc-100 hover:bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 cursor-pointer
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
      <div class="${halo} grid grid-map_search bg-zinc-900/40 hover:bg-white/5 transition px-3 py-2">
        <div class="min-w-0">${codeChip}</div>
        <div class="min-w-0"><span class="gp-td-mapname truncate block" data-sf="${escAttr(r.map_name || 'N/A')}"></span></div>
        <div class="min-w-0"><span class="truncate block" data-sf="${escAttr(mapType)}"></span></div>
        <div class="min-w-0 -ml-1 flex flex-wrap items-center gap-2">${creatorsHTML || 'N/A'}</div>
        <div class="min-w-0"><span class="${__clsTextColor(diffColor)}"><span data-sf="${escAttr(r.difficulty || 'N/A')}">${esc(r.difficulty || 'N/A')}</span></span></div>
        <div class="min-w-0">${qualityMicroBarHTML(ratingValue)}</div>
        <div class="min-w-0">
          <button
            type="button"
            class="js-open-map-details inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs hover:bg-white/10 cursor-pointer"
            data-index="${idx}">
            ${esc(t('thead.mapView'))}
          </button>
        </div>
      </div>`;
  }).join('');

  const shell = `
    <div class="rounded-2xl border border-white/10 bg-white/5 gp-wrap">
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
      <div class="mx-4 w-[min(96vw,1080px)] max-h-[100vh] p-px rounded-3xl bg-gradient-to-tr from-white/25 via-indigo-400/30 ring-1 ring-white/10 translate-y-3 opacity-0 transition-all duration-200">
        <div id="detailsModalBox"
             class="relative min-h-[640px] overflow-y-auto rounded-3xl bg-zinc-900/90 text-zinc-100 shadow-2xl ring-1 ring-white/10">

          <!-- Header / Cover -->
          <div class="relative h-56 overflow-hidden rounded-t-3xl">
            <img id="mapModalCover" alt="" class="h-full w-full object-cover opacity-80">
            <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-zinc-900/80"></div>

            <!-- Top actions -->
            <div class="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
              <span id="mapCompleted"
                    class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/80 ring-1 ring-white/15">
                <span class="h-2 w-2 rounded-full bg-white/60"></span>
                ${t('card.completed')}
              </span>

              <!-- Close -->
              <button type="button" id="modalCloseBtn"
                class="group inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-xl bg-black/40 ring-1 ring-white/15 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                aria-label="${t('popup.close')}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white/85 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="grid gap-6 p-6 md:grid-cols-12">
            <!-- Left -->
            <div class="md:col-span-7 space-y-6">
              <!-- Code + Copy + Guide -->
              <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 flex items-center justify-between gap-4">
                <div>
                  <div class="text-xs uppercase tracking-widest text-white/60">${t('thead.mapCode')}</div>
                  <div id="mapCode" class="mt-1 font-mono text-lg">—</div>
                </div>
                <div class="flex items-center gap-2">
                  <!-- Guide button -->
                  <button id="btnGuide"
                          type="button"
                          class="hidden inline-flex cursor-pointer items-center rounded-xl bg-indigo-500/15 px-3 py-2 text-sm font-semibold text-indigo-200 ring-1 ring-indigo-400/40 hover:bg-indigo-500/25 hover:text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
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
                          class="inline-flex cursor-pointer items-center rounded-xl bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-500/30 hover:bg-emerald-500/20 hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/60">
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
                  class="mt-3 hidden rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 flex items-center justify-between gap-4">
                <div>
                  <div id="linkedCodeLabel" class="text-xs uppercase tracking-widest text-white/60">
                  </div>
                  <div id="linkedCode" class="mt-1 font-mono text-sm text-white/90">—</div>
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
              <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                <div class="text-xs uppercase tracking-widest text-white/60">${t('thead.mapMedal')}</div>
                <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div class="rounded-xl p-3 ring-1 bg-yellow-500/10 ring-yellow-400/30">
                    <div class="text-xs text-white/70">${t('thead.mapGold')}</div>
                    <div id="mapGold" class="text-lg font-semibold">—</div>
                  </div>
                  <div class="rounded-xl p-3 ring-1 bg-slate-300/10 ring-slate-300/30">
                    <div class="text-xs text-white/70">${t('thead.mapSilver')}</div>
                    <div id="mapSilver" class="text-lg font-semibold">—</div>
                  </div>
                  <div class="rounded-xl p-3 ring-1 bg-amber-700/10 ring-amber-600/30">
                    <div class="text-xs text-white/70">${t('thead.mapBronze')}</div>
                    <div id="mapBronze" class="text-lg font-semibold">—</div>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                <div class="text-xs uppercase tracking-widest text-white/60">${t('thead.mapDescription')}</div>
                <p id="mapDescription" class="mt-2 leading-relaxed text-white/85">—</p>
              </div>

              <!-- Mechanics / Restrictions -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                  <div class="text-xs uppercase tracking-widest text-white/60">${t('thead.mapMechanics')}</div>
                  <div id="mapMechanics" class="mt-2 flex flex-wrap gap-2"></div>
                </div>
                <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                  <div class="text-xs uppercase tracking-widest text-white/60">${t('thead.mapRestrictions')}</div>
                  <div id="mapRestrictions" class="mt-2 flex flex-wrap gap-2"></div>
                </div>
              </div>
            </div>

            <!-- Right -->
            <div class="md:col-span-5 space-y-6">
              <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                <div class="text-xs uppercase tracking-widest text-white/60">${t('thead.mapDetails')}</div>
                <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                  <dt class="text-xs text-white/60">${t('thead.mapCreator')}</dt><dd id="mapCreator" class="text-sm font-medium text-white/90">—</dd>
                  <dt class="text-xs text-white/60">${t('thead.mapCheckpoints')}</dt><dd id="mapCheckpoints" class="text-sm font-medium text-white/90">—</dd>
                  <dt class="text-xs text-white/60">${t('thead.mapUpvotes')}</dt><dd id="mapUpvotes" class="text-sm font-medium text-white/90">—</dd>
                  <dt class="text-xs text-white/60">${t('thead.mapType')}</dt><dd id="mapTypeDetail" class="text-sm font-medium text-white/90">—</dd>
                  <dt class="text-xs text-white/60">${t('thead.mapDifficulty')}</dt><dd id="mapDiffDetail" class="text-sm font-medium text-white/90">—</dd>
                  <dt class="text-xs text-white/60">${t('thead.mapStatus', 'Status')}</dt>
                  <dd id="mapStatus" class="text-sm font-medium text-white/90">—</dd>
                  <dt class="text-xs text-white/60">${t('thead.mapQuality')}</dt><dd id="mapQualityDetail" class="text-sm font-medium text-white/90">—</dd>
                </dl>
              </div>

              <div class="rounded-2xl bg-gradient-to-b from-white/5 to-white/0 ring-1 ring-white/10 p-4">
                <div class="flex items-center justify-between">
                  <div class="text-xs uppercase tracking-widest text-white/60">${t('chart.record_progression_time')}</div>
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

async function openSearchDetailsModal(r) {
  if (!r) return;
  ensureSearchDetailsModal();

  const tSafe = (k, d) => (typeof t === 'function' ? t(k) : d);
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
      el.className = 'inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/80 ring-1 ring-white/15';
      el.innerHTML = '<span class="h-2 w-2 rounded-full bg-white/60"></span> ' + esc(tSafe('card.not_completed','Not completed'));
    }
  };
  const mountPills = (container, items=[]) => {
    container.innerHTML = '';
    items.filter(Boolean).forEach(txt=>{
      const s = document.createElement('span');
      s.className = 'inline-flex items-center rounded-full border border-white/10 bg-white/10 backdrop-blur px-2.5 py-1 text-[11px] leading-none text-white/85';
      s.textContent = txt;
      container.appendChild(s);
    });
  };

  // data
  const mapNameKey = (r.original_map_name || r.map_name || 'default').toLowerCase().replace(/[()\s']/g,'');
  const cover = r.map_banner || `assets/banners/${mapNameKey}.png`;
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
  if (typeof CURRENT_LANG!=='undefined' && CURRENT_LANG==='cn') {
    mechanics = mechanics.map(o=> (typeof t==='function' ? (t(`mechanics.${String(o).toLowerCase().replace(/ /g,'_')}`) || o) : o));
    restrictions = restrictions.map(o=> (typeof t==='function' ? (t(`restrictions.${String(o).toLowerCase().replace(/ /g,'_')}`) || o) : o));
  }

  const img = document.getElementById('mapModalCover');
  if (img) {
    img.src = cover;
    const fb = `assets/banners/${mapNameKey}.png`;
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
      guideBtn.classList.remove('hidden');
      guideBtn.setAttribute('data-href', href);
      guideBtn.setAttribute('aria-disabled', 'false');
      guideBtn.title = tSafe('card.open_guide', 'Open guide');
    } else {
      guideBtn.classList.add('hidden');
      guideBtn.classList.remove('inline-flex');
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

      linkedWrap.classList.remove('hidden');
    } else {
      linkedWrap.classList.add('hidden');
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
  overlay.classList.remove('hidden'); overlay.classList.add('flex');
  requestAnimationFrame(() => {
    overlay.classList.remove('opacity-0'); overlay.classList.add('opacity-100');
    gradientWrap.classList.remove('translate-y-3','opacity-0'); gradientWrap.classList.add('translate-y-0','opacity-100');
  });

  const closeBtn = document.getElementById('modalCloseBtn');
  const close = () => {
    overlay.classList.add('opacity-0'); overlay.classList.remove('opacity-100');
    gradientWrap.classList.add('translate-y-3','opacity-0'); gradientWrap.classList.remove('translate-y-0','opacity-100');
    setTimeout(() => { overlay.classList.add('hidden'); overlay.classList.remove('flex'); }, 180);
    document.removeEventListener('keydown', onEsc);
    overlay.removeEventListener('pointerdown', onOutside, true);
  };
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
        <div class="mt-4 rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-6 text-center text-sm text-zinc-300">
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
      medalKeyNorm === 'gold'   ? '/assets/medals/gold.png'   :
      medalKeyNorm === 'silver' ? '/assets/medals/silver.png' :
      medalKeyNorm === 'bronze' ? '/assets/medals/bronze.png' : null;

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
    setTimeout(() => el.classList.add('is-in'), 24 * i)
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
        <div class="mt-4 rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-6 text-center text-sm text-zinc-300">
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
    <div class="sticky top-0 z-10 bg-zinc-900/60 text-zinc-300 font-semibold grid grid-personal_records px-3 py-2">
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
      medalKey === 'gold'   ? '/assets/medals/gold.png'   :
      medalKey === 'silver' ? '/assets/medals/silver.png' :
      medalKey === 'bronze' ? '/assets/medals/bronze.png' : null;

    const mapCodeCell = r.code
      ? `
        <button type="button"
          class="copy-map-code group relative z-10 inline-flex items-center gap-1 rounded-md border border-white/10 bg-zinc-900/60 px-2 py-0.5
                 text-xs font-semibold text-zinc-100 hover:bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 cursor-pointer
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
        class="inline-flex items-center gap-2 rounded-md hover:bg-white/5 px-1.5 py-0.5"
        title="${escAttr(nickname)}">
        <img class="h-6 w-6 rounded-full object-cover ring-1 ring-white/10 bg-zinc-800"
            alt="" referrerpolicy="no-referrer" loading="lazy" decoding="async"
            src="${escAttr(fallback)}"
            data-avatar-id="${escAttr(uid || '')}" data-avatar-size="64"
            data-fallback-src="${escAttr(fallback)}"/>
        <span data-sf="${escAttr(nickname)}"></span>
      </a>`
    : `
      <div class="flex items-center gap-2">
        <img class="h-6 w-6 rounded-full object-cover ring-1 ring-white/10 bg-zinc-800"
            alt="" referrerpolicy="no-referrer" loading="lazy" decoding="async"
            src="${escAttr(fallback)}"
            data-avatar-id="${escAttr(uid || '')}" data-avatar-size="64"
            data-fallback-src="${escAttr(fallback)}"/>
        <span data-sf="${escAttr(nickname)}"></span>
      </div>`;

    return `
      <div class="grid grid-personal_records bg-zinc-900/40 hover:bg-white/5 transition px-3 py-2">
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
    <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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
        <div class="mt-4 rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-6 text-center text-sm text-zinc-300">
          ${message}
        </div>
      `;
    }
    return;
  }

  const cardsHTML = filtered.map((r, idx) => {
    const code = r.map_code || r.code || 'N/A';
    const name = r.map_name || code;
    const nameKey = (r.map_name || code || 'default').toLowerCase().replace(/[()\s']/g,'');
    const banner = r.map_banner || `assets/banners/${nameKey}.png`;
    const fbBanner = `assets/banners/${nameKey}.png`;

    const uid = r.user_id ? String(r.user_id) : '';
    const nickname = r.nickname || r.name || 'N/A';
    const profileHref = uid ? `rank_card?user_id=${encodeURIComponent(uid)}` : '#';
    const fbAvatar = defaultAvatarFromId(uid || '0');

    const isCompletion = r.completion === true;
    const timeDisplay = isCompletion ? (t('completion') || 'Completion') : (r.time != null ? String(r.time) : 'N/A');

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
      medalKey === 'gold'   ? '/assets/medals/gold.png'   :
      medalKey === 'silver' ? '/assets/medals/silver.png' :
      medalKey === 'bronze' ? '/assets/medals/bronze.png' : null;

    const diffTxt = r.difficulty || 'N/A';
    const diffColor = difficultyColors[normalizeDifficulty(diffTxt)] || '#e5e7eb';

    const videoBtn = r.video ? `
      <a href="${escAttr(r.video)}" target="_blank" rel="noopener" class="mx-icon" title="${escAttr(t('watch')||'Watch')}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
      </a>` : '';

    const icClock = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20Zm1 5v5.2l3 1.8a1 1 0 11-1 1.7l-3.6-2.1A1 1 0 0 1 10.5 13V7a1 1 0 1 1 2 0Z"/></svg>';
    const icDiff  = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h16v2H4zm0 7h16v2H4zm0 7h16v2H4z"/></svg>';

    return `
      <article class="mx-card ${medalBadge}">
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
    if (img.complete && img.naturalWidth>0) hero.classList.remove('is-loading');
    else img.addEventListener('load', ()=> hero.classList.remove('is-loading'), { once:true });
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

  Array.from(root.querySelectorAll('.mx-card')).forEach((el,i)=> setTimeout(()=> el.classList.add('is-in'), 24*i));
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
        <div class="mt-4 rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-6 text-center text-sm text-zinc-300">
          ${message}
        </div>
      `;
    }
    return;
  }

  const currentUid = window.user_id ? String(window.user_id) : null;

  const headerHTML = `
    <div class="sticky top-0 z-10 bg-zinc-900/95 text-zinc-300 font-semibold grid grid-completions px-3 py-2">
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
    const timeDisplay = isCompletion ? t('completion') || 'Completion' : (r.time!=null ? String(r.time) : 'N/A');
    const uid = r.user_id ? String(r.user_id) : null;
    const fallback = defaultAvatarFromId(uid || '0');
    const profileHref = uid ? `rank_card?user_id=${encodeURIComponent(uid)}` : null;
    const nickname = r.nickname || r.name || 'N/A';
    const also = r.also_known_as ?? r.discord_tag ?? 'N/A';

    const codeCell = mapCode !== 'N/A' ? `
      <button type="button"
        class="copy-map-code group relative z-10 inline-flex items-center gap-1 rounded-md border border-white/10 bg-zinc-900/60 px-2 py-0.5
               text-xs font-semibold text-zinc-100 hover:bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 cursor-pointer
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
         class="inline-flex items-center gap-2 rounded-md hover:bg-white/5 px-1.5 py-0.5"
         title="${currentUid && uid && currentUid===uid ? t('popup.you') : escAttr(nickname)}">
        <img class="h-6 w-6 rounded-full object-cover ring-1 ring-white/10 bg-zinc-800"
             alt="" referrerpolicy="no-referrer" loading="lazy" decoding="async"
             src="${escAttr(fallback)}"
             data-avatar-id="${escAttr(uid || '')}" data-avatar-size="64"
             data-fallback-src="${escAttr(fallback)}"/>
        <span data-sf="${escAttr(nickname)}"></span>
      </a>` : `
      <div class="flex items-center gap-2">
        <img class="h-6 w-6 rounded-full object-cover ring-1 ring-white/10 bg-zinc-800"
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
      medalKey === 'gold'   ? '/assets/medals/gold.png'   :
      medalKey === 'silver' ? '/assets/medals/silver.png' :
      medalKey === 'bronze' ? '/assets/medals/bronze.png' : null;

    return `
      <div class="grid grid-completions bg-zinc-900/40 hover:bg-white/5 transition px-3 py-2">
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
          <button class="js-open-completion-details inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs hover:bg-white/10 cursor-pointer"
                  data-index="${idx}">
            ${esc(t('thead.mapView') || 'View')}
          </button>
        </div>
      </div>`;
  }).join('');

  const shell = `
    <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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

      <div class="mx-4 w-[min(96vw,980px)] max-h-[90vh] p-px rounded-3xl bg-gradient-to-tr from-white/25 via-indigo-400/30 ring-1 ring-white/10 translate-y-3 opacity-0 transition-all duration-200">
        <div id="completionModalBox"
             class="relative min-h-[520px] overflow-y-auto rounded-3xl bg-zinc-900/90 text-zinc-100 shadow-2xl ring-1 ring-white/10">

          <!-- cover -->
          <div class="relative h-56 overflow-hidden rounded-t-3xl">
            <img id="completionModalCover" alt="" class="h-full w-full object-cover opacity-80">
            <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-zinc-900/80"></div>

            <div class="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
              <span id="completionStatus"
                    class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/80 ring-1 ring-white/15">
                <span class="h-2 w-2 rounded-full bg-white/60"></span>
                ${TT('completion','Completion')}
              </span>

              <button type="button" id="completionModalCloseBtn"
                class="group inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-xl bg-black/40 ring-1 ring-white/15 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                aria-label="${TT('popup.close','Close')}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white/85 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- contenu -->
          <div class="grid gap-6 p-6 md:grid-cols-12">
            <!-- gauche -->
            <div class="md:col-span-7 space-y-6">

              <!-- Map + Code -->
              <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <div class="text-xs uppercase tracking-widest text-white/60" id="completionMapLabel">${TT('thead.mapName','Name')}</div>
                  <div id="completionMapName" class="mt-1 font-semibold text-lg truncate">—</div>
                  <div class="mt-2 text-xs uppercase tracking-widest text-white/60" id="completionCodeLabel">${TT('thead.mapCode','Code')}</div>
                  <div id="completionCode" class="mt-1 font-mono text-lg break-all">—</div>
                </div>
                <div class="flex flex-col gap-2 shrink-0">
                  <a id="btnOpenCompletionVideo" href="#" target="_blank" rel="noopener"
                     class="hidden inline-flex items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white/85 ring-1 ring-white/15 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/60">
                    <svg viewBox="0 0 24 24" class="mr-2 h-4 w-4" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
                    <span>${TT('watch','Watch')}</span>
                  </a>
                  <button id="btnCopyCompletionCode"
                          class="inline-flex items-center justify-center rounded-xl bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-500/30 hover:bg-emerald-500/20 hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 cursor-pointer"
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
              <div id="completionProofSection" class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4" hidden>
                <div class="text-xs uppercase tracking-widest text-white/60" id="completionProofLabel">${TT('screenshot','Screenshot')}</div>
                <button id="completionProofZoom" type="button"
                        class="group mt-2 relative w-full overflow-hidden rounded-xl bg-black/30 aspect-[16/9] ring-1 ring-white/10 hover:ring-emerald-400/40 focus:outline-none cursor-pointer hover:cursor-zoom-in">
                  <img id="completionProofImg" alt="" class="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-200" />
                  <span class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <span class="rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white/90">${TT('open_screenshot','Open screenshot')}</span>
                  </span>
                </button>
              </div>

            </div>

            <!-- droite -->
            <div class="md:col-span-5 space-y-6">
              <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                <div class="text-xs uppercase tracking-widest text-white/60">${TT('thead.mapDetails','Details')}</div>
                <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                  <dt class="text-xs text-white/60">${TT('filters.player_name','Player')}</dt><dd id="completionPlayer" class="text-sm font-medium text-white/90">—</dd>
                  <dt class="text-xs text-white/60">${TT('thead.mapTime','Time')}</dt><dd id="completionTime" class="text-sm font-medium text-white/90">—</dd>
                  <dt class="text-xs text-white/60">${TT('thead.mapMedal','Medal')}</dt><dd id="completionMedal" class="text-sm font-medium text-white/90">—</dd>
                  <dt class="text-xs text-white/60">${TT('thead.mapDifficulty','Difficulty')}</dt><dd id="completionDifficulty" class="text-sm font-medium text-white/90">—</dd>
                  <dt class="text-xs text-white/60">${TT('thead.mapType','Type')}</dt><dd id="completionCategory" class="text-sm font-medium text-white/90">—</dd>
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
                class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/50 ring-1 ring-white/20 text-white/90 hover:bg-black/70"
                aria-label="${TT('popup.close','Close')}" title="${TT('popup.close','Close')}">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <img id="imgZoomTarget" alt="" class="max-h-[92vh] max-w-[92vw] rounded-2xl shadow-2xl ring-1 ring-white/10"/>
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
      ov.classList.remove('hidden'); ov.classList.add('flex');
      requestAnimationFrame(()=>{ ov.classList.remove('opacity-0'); ov.classList.add('opacity-100'); });
      const onEsc = (e)=>{ if (e.key==='Escape') closeZoom(); };
      ov.__esc = onEsc; document.addEventListener('keydown', onEsc);
    };

    const closeZoom = ()=>{
      const ov = document.getElementById('imgZoomOverlay');
      const modalOverlay = document.getElementById('completionModalOverlay');
      ov.classList.add('opacity-0'); ov.classList.remove('opacity-100');
      setTimeout(()=>{ ov.classList.add('hidden'); ov.classList.remove('flex'); }, 160);
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

function openCompletionsDetailsModal(r){
  if (!r) return;
  ensureCompletionsDetailsModal();

  const tSafe = (k, d) => (typeof t === 'function' ? t(k) : d);
  const esc = (s) => String(s ?? "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
  const arrToText = (v)=> Array.isArray(v) ? v.filter(Boolean).join(', ') : (v || '—');

  const nameKey = (r.map_name || r.map_code || r.code || 'default').toLowerCase().replace(/[()\s']/g,'');
  const cover = r.map_banner || `assets/banners/${nameKey}.png`;
  const imgCover = document.getElementById('completionModalCover');
  if (imgCover){
    const fb = `assets/banners/${nameKey}.png`;
    imgCover.src = cover;
    imgCover.addEventListener('error', ()=>{ if (imgCover.src!==fb) imgCover.src = fb; }, { once:true });
  }

  const el = id => document.getElementById(id);
  el('completionMapLabel').textContent   = tSafe('thead.mapName','Map');
  el('completionCodeLabel').textContent  = tSafe('thead.mapCode','Code');
  el('completionProofLabel').textContent = tSafe('screenshot','Screenshot');
  el('completionStatus').innerHTML = `<span class="h-2 w-2 rounded-full bg-emerald-400"></span> ${esc(tSafe('completion','Completion'))}`;

  const mapName = r.map_name || r.map || r.map_code || r.code || '—';
  const code    = r.map_code || r.code || '—';
  el('completionMapName').textContent = mapName;
  el('completionCode').textContent    = code;

  const player = r.nickname || r.name || 'N/A';
  const isCompletion = r.completion === true;
  const timeDisplay  = isCompletion ? tSafe('completion','Completion') : (r.time != null ? String(r.time) : 'N/A');
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
    if (r.video){ videoBtn.href = r.video; videoBtn.classList.remove('hidden'); videoBtn.querySelector('span').textContent = tSafe('watch','Watch'); }
    else { videoBtn.classList.add('hidden'); }
  }

  const proofSection = el('completionProofSection');
  const proofImg  = el('completionProofImg');
  const proofBtn  = el('completionProofZoom');

  let proof = (r.screenshot || r.proof || r.image || r.screenshot_url || r.proof_url || '').trim();
  const looksLikeImg = proof && (/^data:image\//.test(proof) || /\.(png|jpe?g|webp|gif|avif|bmp|svg)(\?.*)?$/i.test(proof));

  proofSection.hidden = true;
  proofImg.src = ''; proofImg.classList.add('opacity-0');
  if (proofBtn) proofBtn.dataset.zoomSrc = '';

  if (looksLikeImg){
    proofSection.hidden = false;
    const onLoad  = ()=>{ proofImg.classList.remove('opacity-0'); if (proofBtn) proofBtn.dataset.zoomSrc = proof; };
    const onError = ()=>{ proofSection.hidden = true; };
    proofImg.addEventListener('load', onLoad, { once:true });
    proofImg.addEventListener('error', onError, { once:true });
    proofImg.src = proof;
  }

  const modalOverlay = document.getElementById('completionModalOverlay');
  const gradientWrap = modalOverlay.querySelector('.bg-gradient-to-tr');
  modalOverlay.classList.remove('hidden'); modalOverlay.classList.add('flex');
  requestAnimationFrame(()=>{
    modalOverlay.classList.remove('opacity-0'); modalOverlay.classList.add('opacity-100');
    gradientWrap.classList.remove('translate-y-3','opacity-0'); gradientWrap.classList.add('translate-y-0','opacity-100');
  });

  const closeBtn = document.getElementById('completionModalCloseBtn');
  const close = ()=>{
    modalOverlay.classList.add('opacity-0'); modalOverlay.classList.remove('opacity-100');
    gradientWrap.classList.add('translate-y-3','opacity-0'); gradientWrap.classList.remove('translate-y-0','opacity-100');
    setTimeout(()=>{ modalOverlay.classList.add('hidden'); modalOverlay.classList.remove('flex'); }, 180);
    document.removeEventListener('keydown', onEsc);
    modalOverlay.removeEventListener('pointerdown', onOutside, true);
  };
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
        <div class="mt-4 rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-6 text-center text-sm text-zinc-300">
          ${message}
        </div>
      `;
    }
    return;
  }

  const headerHTML = `
    <div class="sticky top-0 z-10 bg-zinc-900/60 text-zinc-300 font-semibold grid grid-guide px-3 py-2">
      <div class="whitespace-nowrap text-center">${t('thead.mapVideo')}</div>
    </div>
  `;

  const rowsHTML = filtered.map((r) => {
    const embedUrl = getEmbedUrl(r.url);
    return `
      <div class="grid grid-guide bg-zinc-900/40 hover:bg-white/5 transition px-3 py-4">
        <div class="text-center">
          ${
            embedUrl
              ? ` <div class="mx-auto w-full max-w-3xl">
                  <div class="video-embed ring-1 ring-white/10">
                    <iframe src="${embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  </div>
                   ${
                     Array.isArray(r.usernames) && r.usernames.length > 1
                       ? `<div class="mt-2 text-center text-xs text-zinc-400">
                            ${esc(t('thead.mapNickname'))}:
                            <span class="text-zinc-200">${esc(r.usernames[1])}</span>
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
    <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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
    <div class="rounded-xl bg-zinc-900/60 ring-1 ring-white/10 p-4">
      <div class="h-[280px] w-full grid place-items-center text-white/60 text-sm">
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
      <div class="h-6 w-6 rounded-full ring-1 ring-white/10 bg-zinc-800 overflow-hidden">
        ${sAvatar()}
      </div>
      ${sBar(width,'sm')}
    </div>
  `;
}

function skeletonTableShell(headHTML, bodyRowsHTML, colgroupHTML = '') {
  return `
    <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div class="overflow-auto">
        <div class="overflow-hidden hide-scrollbar">
          ${colgroupHTML}
          <thead class="bg-zinc-900/60 text-zinc-300">${headHTML}</thead>
          <tbody>${bodyRowsHTML}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderMapSearchCardsSkeleton(count = Math.min(pageSize || 12, 12)) {
  const oneCard = () => `
    <article class="mx-card overflow-hidden rounded-2xl border border-white/10 bg-white/5 ring-1 ring-white/5">
      <div class="mx-hero relative">
        <div class="absolute inset-0 animate-pulse bg-white/5"></div>

        <div class="mx-titlebar absolute inset-x-0 top-0 p-3 sm:p-1">
          <div class="mx-head flex items-center justify-between gap-3">
            <h3 class="mx-title">
              <span class="block h-5 w-40 rounded bg-white/20 animate-pulse"></span>
            </h3>
            <span class="mx-status inline-flex items-center gap-2 rounded-full bg-white/15 px-2.5 py-1 text-xs ring-1 ring-white/20">
              <i class="mx-dot h-2 w-2 rounded-full bg-white/70"></i>
              <span class="block h-3 w-16 rounded bg-white/30 animate-pulse"></span>
            </span>
          </div>
          <div class="mx-meta mt-2">
            <span class="mx-meta-item inline-flex items-center gap-2 text-sm">
              <svg viewBox="0 0 24 24" class="h-4 w-4 text-white/60" aria-hidden="true">
                <path fill="currentColor" d="M5 3a1 1 0 0 0-1 1v16l7-3 7 3V4a1 1 0 0 0-1-1H5z"/>
              </svg>
              <span class="h-3 w-10 rounded bg-white/20 animate-pulse"></span>
              <span class="sep text-white/40">•</span>
              <span class="h-3 w-14 rounded bg-white/20 animate-pulse"></span>
            </span>
          </div>
        </div>

        <div class="mx-actions-vert absolute right-2 top-2 flex flex-col gap-2">
          <span class="mx-icon h-8 w-8 rounded-xl bg-black/40 ring-1 ring-white/10 animate-pulse"></span>
          <span class="mx-icon mx-icon--primary h-8 w-8 rounded-xl bg-black/40 ring-1 ring-white/10 animate-pulse"></span>
        </div>

        <div class="mx-bottom absolute inset-x-0 bottom-0 p-1 sm:p-1">
          <div class="flex items-center justify-between gap-3">

            <div class="mx-b-left flex min-w-0 items-center gap-2">
              <div class="flex -space-x-2">
                <span class="h-6 w-6 rounded-full bg-white/20 ring-1 ring-white/10 animate-pulse"></span>
              </div>
              <span class="ml-1 h-4 w-24 rounded bg-white/20 animate-pulse"></span>
            </div>

            <div class="mx-b-right flex items-center gap-2">
              <span class="mx-code-inline inline-flex items-center gap-2 rounded-md border border-white/10 bg-zinc-900/60 px-2.5 py-1.5">
                <span class="h-4 w-16 rounded bg-white/20 animate-pulse"></span>
              </span>
              <span class="mx-diff inline-flex h-4 w-12 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/10 animate-pulse"></span>
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
    setTimeout(() => el.classList.add('is-in'), 22 * i)
  );
}


function renderMapSearchSkeleton(rows = 8) {
  ensureSkeletonCSS();
  const headerHTML = `
    <div class="sticky top-0 z-10 bg-zinc-900/60 text-zinc-300 font-semibold grid grid-map_search px-3 py-2">
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
    <div class="grid grid-map_search bg-zinc-900/40 px-3 py-2">
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
    <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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
    <article class="mx-card overflow-hidden rounded-2xl border border-white/10 bg-white/5 ring-1 ring-white/5">
      <div class="mx-hero relative">
        <!-- Hero skeleton (aucune image réelle ici) -->
        <div class="absolute inset-0 animate-pulse bg-white/5"></div>
        <div class="mx-grain pointer-events-none"></div>

        <!-- Barre supérieure : chips (temps + difficulté) -->
        <div class="c-topbar">
          <div class="c-chiprow">
            <span class="c-chip">
              <svg viewBox="0 0 24 24" aria-hidden="true" class="opacity-80">
                <path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20Zm1 5v5.2l3 1.8a1 1 0 11-1 1.7l-3.6-2.1A1 1 0 0 1 10.5 13V7a1 1 0 1 1 2 0Z"/>
              </svg>
              <span class="block h-3 w-16 rounded bg-white/20 animate-pulse"></span>
            </span>
            <span class="c-chip">
              <svg viewBox="0 0 24 24" aria-hidden="true" class="opacity-80">
                <path fill="currentColor" d="M4 4h16v2H4zm0 7h16v2H4zm0 7h16v2H4z"/>
              </svg>
              <span class="block h-3 w-14 rounded bg-white/20 animate-pulse"></span>
            </span>
          </div>
        </div>

        <!-- Titlebar (présente dans la vraie vue, on garde la structure) -->
        <div class="mx-titlebar">
          <div class="mx-head"></div>
        </div>

        <!-- Actions verticales (placeholders d'icônes) -->
        <div class="mx-actions-vert flex flex-col gap-2">
          <span class="mx-icon h-8 w-8 rounded-xl bg-black/40 ring-1 ring-white/10 animate-pulse"></span>
          <span class="mx-icon h-8 w-8 rounded-xl bg-black/40 ring-1 ring-white/10 animate-pulse"></span>
        </div>

        <!-- Footer -->
        <div class="mx-bottom p-1 sm:p-1">
          <div class="flex items-center justify-between gap-3">
            <!-- Left: avatar + nickname -->
            <div class="mx-b-left flex min-w-0 items-center gap-2">
              <span class="h-6 w-6 rounded-full bg-white/20 ring-1 ring-white/10 animate-pulse"></span>
              <span class="ml-1 h-4 w-24 rounded bg-white/20 animate-pulse"></span>
            </div>

            <!-- Right: code + médaille -->
            <div class="mx-b-right flex items-center gap-2">
              <span class="mx-code-inline inline-flex items-center gap-2 rounded-md border border-white/10 bg-zinc-900/60 px-2.5 py-1.5">
                <span class="h-4 w-16 rounded bg-white/20 animate-pulse"></span>
              </span>
              <span class="c-medal inline-flex h-7 items-center justify-center rounded-full border border-white/10 bg-white/10 px-3 ring-0">
                <span class="h-3 w-10 rounded bg-white/20 animate-pulse"></span>
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
    setTimeout(() => el.classList.add('is-in'), 22 * i)
  );
}

function renderCompletionsSkeleton(rows = 8) {
  ensureSkeletonCSS();

  const headerHTML = `
    <div class="sticky top-0 z-10 bg-zinc-900/60 text-zinc-300 font-semibold grid grid-completions px-3 py-2">
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
    <div class="grid grid-completions bg-zinc-900/40 px-3 py-2">
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
    <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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
    <div class="sticky top-0 z-10 bg-zinc-900/60 text-zinc-300 font-semibold grid grid-personal_records px-3 py-2">
      <div>${t('thead.mapCode')}</div>
      <div>${t('thead.mapNickname')}</div>
      <div>${t('thead.mapDiscordTag')}</div>
      <div>${t('thead.mapDifficulty')}</div>
      <div>${t('thead.mapTime')}</div>
      <div>${t('thead.mapMedal')}</div>
    </div>
  `;

  const row = `
    <div class="grid grid-personal_records bg-zinc-900/40 px-3 py-2">
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
    <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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
    <div class="sticky top-0 z-10 bg-zinc-900/60 text-zinc-300 font-semibold grid grid-guide px-3 py-2">
      <div class="text-center">${t('thead.mapVideo')}</div>
    </div>
  `;

  const row = `
    <div class="grid grid-guide bg-zinc-900/40 px-3 py-4">
      <div class="text-center">
        <div class="mx-auto w-full max-w-3xl">
          <div class="video-embed ring-1 ring-white/10">
            <div class="skel skel-vid"></div>
          </div>
          <div class="mt-2 flex justify-center">${sBar(160,'sm')}</div>
        </div>
      </div>
    </div>
  `;

  const body = new Array(rows).fill(row).join('');

  const shell = `
    <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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
          `<div class="h-10 rounded-lg bg-white/10 animate-pulse"></div>`
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
      'inline-flex items-center justify-center rounded-lg border border-white/10 cursor-pointer',
      'bg-zinc-900/60 hover:bg-white/5 px-3 py-1.5 text-sm',
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
  indicator.className = 'px-3 py-1.5 text-sm text-zinc-300';
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
    const maybeNewTotalPages = computeTotalPagesFromData(data, pageSize);
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

  const req = buildSectionRequest(currentSection, activeFilters, pageNumber, pageSize);
  const response = await fetch(req.url, { method: req.method });
  if (!response.ok) throw new Error(`Erreur réseau : ${response.statusText}`);
  const data = await response.json();

  cachedPages[currentSection] ??= {};
  cachedPages[currentSection][pageNumber] = data;

  const maybe = computeTotalPagesFromData(data, pageSize);
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

// --- Pills  ---
function showPill(message, { variant = 'info', duration = 1000 } = {}) {
  const palette = {
    info: 'bg-zinc-800/90 text-zinc-100 ring-white/10',
    success: 'bg-emerald-600 text-white ring-white/10',
    error: 'bg-rose-500/20 text-rose-200 ring-white/10 border border-rose-400/30',
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
    el.classList.remove('opacity-0', 'scale-90');
    el.classList.add('opacity-100', 'scale-100');
  });

  setTimeout(() => {
    el.classList.remove('opacity-100', 'scale-100');
    el.classList.add('opacity-0', 'scale-90');
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
               rounded-full bg-white/10 text-zinc-300 hover:bg-white/20
               focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
        aria-label="Close image">
        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6L18 18M18 6L6 18"/>
        </svg>
      </button>
      <div class="max-w-[96vw] max-h-[92vh] p-2">
        <div id="lightboxSkel" class="skel skel-vid"></div>
        <img id="imageLightboxImg"
             class="max-w-full max-h-[90vh] rounded-2xl ring-1 ring-white/10 object-contain hidden" alt="">
      </div>
    </div>`;
  document.body.appendChild(shell.firstElementChild);

  ov = document.getElementById('imageLightboxOverlay');
  const btn = document.getElementById('imageLightboxClose');
  const close = () => {
    ov.classList.add('opacity-0'); ov.classList.remove('opacity-100');
    setTimeout(() => ov.classList.add('hidden'), 180);
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

  img.classList.add('hidden');
  sk.style.display = 'block';

  img.onload = () => { sk.style.display = 'none'; img.classList.remove('hidden'); };
  img.onerror = () => { sk.style.display = 'none'; img.classList.remove('hidden'); img.alt = 'Image failed to load'; };

  img.src = src;
  img.alt = alt || '';

  ov.classList.remove('hidden');
  requestAnimationFrame(() => {
    ov.classList.remove('opacity-0'); ov.classList.add('opacity-100');
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
      chartContainer.innerHTML = `<p class="text-center font-semibold text-zinc-100">${t('popup.no_results')}</p>`;
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
    <div class="rounded-xl bg-zinc-900/60 ring-1 ring-white/10 p-4">
      <canvas id="progressionChart" class="w-full h-[280px]"></canvas>
    </div>
  `;

  if (!Array.isArray(data) || data.length === 0) {
    chartContainer.innerHTML = `<p class="text-center font-semibold text-zinc-100">No valid progression data available to display</p>`;
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