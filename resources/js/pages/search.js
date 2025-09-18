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

__addRule('.u-d-block', 'display:block !important');
__addRule('.u-d-none', 'display:none !important');
__addRule('.u-invisible', 'visibility:hidden !important');
__addRule('.u-absolute', 'position:absolute !important; z-index:45 !important');
__addRule('.u-flex', 'display:flex !important');

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

__addRule('.circle-visible', 'opacity:1 !important; transition:all .4s ease-in-out !important');
__addRule('.ratio-16x9', 'aspect-ratio:16/9');
__addRule('.max-h-360', 'max-height:360px');
__addRule('.is-measuring', 'visibility:hidden !important; display:block !important');

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
    'playtest_status',
    'completion_filter',
    'medal_filter',
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
    playtest_status: `<path d="M14.2639 15.9376L12.5958 14.2835C11.7909 13.4852 11.3884 13.0861 10.9266 12.9402C10.5204 12.8119 10.0838 12.8166 9.68048 12.9537C9.22188 13.1096 8.82814 13.5173 8.04068 14.3327L4.04409 18.2802M14.2639 15.9376L14.6053 15.5991C15.4112 14.7999 15.8141 14.4003 16.2765 14.2544C16.6831 14.1262 17.12 14.1312 17.5236 14.2688C17.9824 14.4252 18.3761 14.834 19.1634 15.6515L20 16.4936M14.2639 15.9376L18.275 19.9566M18.275 19.9566C17.9176 20.0001 17.4543 20.0001 16.8 20.0001H7.2C6.07989 20.0001 5.51984 20.0001 5.09202 19.7821C4.71569 19.5904 4.40973 19.2844 4.21799 18.9081C4.12796 18.7314 4.07512 18.5322 4.04409 18.2802M18.275 19.9566C18.5293 19.9257 18.7301 19.8728 18.908 19.7821C19.2843 19.5904 19.5903 19.2844 19.782 18.9081C20 18.4803 20 17.9202 20 16.8001V16.4936M12.5 4L7.2 4.00011C6.07989 4.00011 5.51984 4.00011 5.09202 4.21809C4.71569 4.40984 4.40973 4.7158 4.21799 5.09213C4 5.51995 4 6.08 4 7.20011V16.8001C4 17.4576 4 17.9222 4.04409 18.2802M20 11.5V16.4936M14 10.0002L16.0249 9.59516C16.2015 9.55984 16.2898 9.54219 16.3721 9.5099C16.4452 9.48124 16.5146 9.44407 16.579 9.39917C16.6515 9.34859 16.7152 9.28492 16.8425 9.1576L21 5.00015C21.5522 4.44787 21.5522 3.55244 21 3.00015C20.4477 2.44787 19.5522 2.44787 19 3.00015L14.8425 7.1576C14.7152 7.28492 14.6515 7.34859 14.6009 7.42112C14.556 7.4855 14.5189 7.55494 14.4902 7.62801C14.4579 7.71033 14.4403 7.79862 14.4049 7.97518L14 10.0002Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    completion_filter: `<path d="M9 12L11 14L15 10M12 3L13.9101 4.87147L16.5 4.20577L17.2184 6.78155L19.7942 7.5L19.1285 10.0899L21 12L19.1285 13.9101L19.7942 16.5L17.2184 17.2184L16.5 19.7942L13.9101 19.1285L12 21L10.0899 19.1285L7.5 19.7942L6.78155 17.2184L4.20577 16.5L4.87147 13.9101L3 12L4.87147 10.0899L4.20577 7.5L6.78155 6.78155L7.5 4.20577L10.0899 4.87147L12 3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    medal_filter: `<path d="M12 11L8 3H4L8.5058 12.4622M12 11L16 3H20L15.4942 12.4622M12 11C13.344 11 14.5848 11.5635 15.4942 12.4622M12 11C10.656 11 9.41518 11.5635 8.5058 12.4622M15.4942 12.4622C16.4182 13.3753 17 14.6344 17 16C17 18.7614 14.7614 21 12 21C9.23858 21 7 18.7614 7 16C7 14.6344 7.58179 13.3753 8.5058 12.4622" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`,
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
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-buttons button[data-section]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const section = btn.dataset.section;
      if (window.selectSection) selectSection(section);
    });
  });
});

async function selectSection(sectionId) {
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
  clearFilters(true);
  applyFilters();

  const fa = document.getElementById('filterActions');
  if (fa) showFlex(fa);
}
window.selectSection = selectSection;

/* =========================
   GLOBAL INITS
   ========================= */
async function initializeApp() {
  const fa = document.getElementById('filterActions');
  if (fa) hideEl(fa);
  initializeIcons();
  await loadDynamicOptions();
  initializeToolbarButtons();
  hideOnClickOutside();
  mountToolbarAnimation();
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

function attachButtonListeners() {
  const buttons = document.querySelectorAll('.toolbar-button');
  if (buttons.length === 0) {
    setTimeout(attachButtonListeners, 100);
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();

      const optionsContainer = button.querySelector('.custom-options');
      if (optionsContainer) showDropdown(optionsContainer);

      document
        .querySelectorAll('.toolbar-button')
        .forEach((btn) => btn.classList.remove('selected'));
      button.classList.add('selected');

      const circle = button.querySelector('.selection-circle');
      if (circle) circle.classList.add('circle-visible');
    });
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

const observer = new MutationObserver(attachButtonListeners);
document.addEventListener('DOMContentLoaded', () => {
  const tb = document.querySelector('.toolbar');
  if (tb) {
    observer.observe(tb, { childList: true, subtree: true });
    attachButtonListeners();
  }
});

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

        optionElement = document.createElement('span');
        optionElement.className =
          'custom-option flex-1 text-sm text-zinc-200 group-hover:text-white';
        optionElement.textContent = displayText;
        optionElement.setAttribute('data-raw-value', rawValue);

        wrapper.appendChild(checkbox);
        wrapper.appendChild(ui);
        wrapper.appendChild(optionElement);
        optionsContainer.appendChild(wrapper);

        checkbox.addEventListener('change', () => updateActiveFilters());
      } else {
        optionElement = document.createElement('div');
        optionElement.className =
          'custom-option cursor-pointer rounded-md px-3 py-2 text-sm text-zinc-200 hover:bg-white/10 flex items-center justify-between gap-3';
        optionElement.innerHTML = `
          <span class="truncate">${displayText}</span>
          <svg data-check viewBox="0 0 20 20" class="h-4 w-4 opacity-0 transition-opacity" aria-hidden="true">
            <path d="M5 10.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
        optionElement.setAttribute('data-raw-value', rawValue);
        optionsContainer.appendChild(optionElement);
      }

      optionElement.addEventListener('click', (event) => {
        event.stopPropagation();
        let labelId = '';
        switch (id.replace('Options', '')) {
          case 'mapType':
            labelId = 'map type';
            break;
          case 'difficulty':
            labelId = 'difficulty';
            break;
          case 'mechanics':
            labelId = 'mechanics';
            break;
          case 'restrictions':
            labelId = 'restrictions';
            break;
          case 'onlyPlaytest':
            labelId = 'only playtest';
            break;
          case 'ignoreCompletions':
            labelId = 'ignore completions';
            break;
          case 'onlyMedals':
            labelId = 'only medals';
            break;
          default:
            labelId = id.replace('Options', '');
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

/* =========================
   TOOLBAR INIT
   ========================= */
function initializeToolbarButtons() {
  clearToolbarButtons();

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
              { text: 'All', value: 'All', raw: 'All' },
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
              { text: 'All', value: 'All', raw: 'All' },
              { text: 'True', value: 'With', raw: 'With' },
              { text: 'False', value: 'Without', raw: 'Without' },
            ],
            button,
            false
          );
          break;
        case 'playtest_status':
          optionsContainer = showOptionsContainer(
            'playtestStatusOptions',
            [
              { text: 'Approved', value: 'Approved', raw: 'Approved' },
              { text: 'In Progress', value: 'In Progress', raw: 'In Progress' },
              { text: 'Rejected', value: 'Rejected', raw: 'Rejected' },
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
    playtestStatus: 'playtest_status',
    medalFilter: 'medal_filter',
    mechanics: 'mechanics',
    restrictions: 'restrictions',
    completionFilter: 'completion_filter',
  };

  activeFilters = { ...persistentFilters };

  document.querySelectorAll('.custom-options').forEach((optionsContainer) => {
    const filterId = optionsContainer.id.replace('Options', '');
    const mappedFilterId = filterMappings[filterId] || filterId;

    if (filterId === 'mechanics' || filterId === 'restrictions') {
      setTimeout(() => {
        const checkboxes = optionsContainer.querySelectorAll('.custom-checkbox:checked');
        if (checkboxes.length > 0) {
          activeFilters[mappedFilterId] = Array.from(checkboxes).map((cb) => {
            const rawValue = cb.id.replace(/^.*?_/, '').replace(/_/g, ' ');
            return rawValue.trim();
          });
        } else {
          delete activeFilters[mappedFilterId];
        }
      }, 0);
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
    if (raw) activeFilters.code = encodeURIComponent(raw);
    else delete activeFilters.code;
  }

  const mapNameInput = document.getElementById('mapNameInput');
  if (mapNameInput) {
    const raw = mapNameInput.getAttribute('data-selected-raw-value') || mapNameInput.value.trim();
    if (raw) activeFilters.map_name = encodeURIComponent(raw);
    else delete activeFilters.map_name;
  }

  const userInput = document.getElementById('userNicknameInput');
  if (userInput) {
    const raw = userInput.getAttribute('data-selected-raw-value') || '';
    if (raw) activeFilters.user_id = encodeURIComponent(raw);
    else delete activeFilters.user_id;
  }

  const creatorInput = document.getElementById('mapCreatorInput');
  if (creatorInput) {
    const selectedId = creatorInput.getAttribute('data-selected-raw-value');
    const typed = creatorInput.value.trim();
    if (selectedId) {
      activeFilters.creator_ids = encodeURIComponent(selectedId);
      delete activeFilters.creator_names;
    } else if (typed) {
      activeFilters.creator_names = encodeURIComponent(typed);
      delete activeFilters.creator_ids;
    } else {
      delete activeFilters.creator_ids;
      delete activeFilters.creator_names;
    }
  }

  setTimeout(updateToolbarButtonStates, 0);
}

function updateToolbarButtonStates() {
  const keyMap = {
    user: ['user_id'],
    creator: ['creator_ids', 'creator_names'],
  };

  const booleanLikeFilters = new Set(['completion_filter', 'medal_filter']);
  const boolLabel = { With: 'True', Without: 'False' };

  const buttons = document.querySelectorAll('.toolbar-button');
  buttons.forEach((button) => {
    const filterId = button.id.replace('FilterButton', '').toLowerCase();
    const keys = keyMap[filterId] || [filterId];

    const value = keys
      .map((k) => activeFilters[k])
      .find(
        (v) => v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0) && v !== ''
      );

    const isActive =
      value !== undefined &&
      value !== null &&
      !(Array.isArray(value) && value.length === 0) &&
      value !== '';

    if (isActive) {
      button.classList.add('active-filter', 'border-brand-400/40', 'ring-1', 'ring-emerald-500/30');
    } else {
      button.classList.remove(
        'active-filter',
        'border-brand-400/40',
        'ring-1',
        'ring-emerald-500/30'
      );
    }

    const badge = button.querySelector('.filter-badge');
    if (!badge) return;

    if (!isActive) {
      badge.classList.add('hidden');
      badge.textContent = '';
      return;
    }

    let text = '✓';

    if (booleanLikeFilters.has(filterId) && typeof value === 'string' && boolLabel[value]) {
      text = boolLabel[value];
    } else if (Array.isArray(value)) {
      text = `${value.length}`;
    } else if (typeof value === 'boolean') {
      text = value ? 'ON' : 'OFF';
    } else if (typeof value === 'string') {
      const v = decodeURIComponent(value);
      text = v.length > 6 ? v.slice(0, 6) + '…' : v;
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
    playtestStatus: 'playtest_status',
    completionFilter: 'completion_filter',
    medalFilter: 'medal_filter',
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
    showConfirmationMessage(t('popup.filters_cleared'));
  }
}

async function applyFilters(filters) {
  cachedPages = {};
  currentPage = 1;
  activeFilters = { ...persistentFilters, ...filters };

  if (currentSection === 'guide') {
    const hasFilters = filters && Object.keys(filters).length > 0;
    const hasActiveMapCode = activeFilters && activeFilters.map_code;
    if (!hasFilters && !hasActiveMapCode) {
      activeFilters.map_code = '008EX';
    }
  }

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
      user_id: typeof user_id !== 'undefined' && user_id ? String(user_id) : filters.user_id || '',
      difficulty: filters.difficulty_exact || '',
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
    displayMapSearchResults(rows);
    return;
  }

  if (currentSection === 'completions') {
    displayCompletionsResults(normalizeToRowsContainer(data));
    return;
  }

  if (currentSection === 'guide') {
    displayGuideResults(normalizeToRowsContainer(data));
    return;
  }

  if (currentSection === 'personal_records') {
    displayPersonalRecordsResults(normalizeToRowsContainer(data));
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
async function displayMapSearchResults(rowsInput) {
  const rows = Array.isArray(rowsInput) ? rowsInput : normalizeToRows(rowsInput, 'map');
  const filtered = rows.filter((r) => r && r.map_name && r.map_name !== 'N/A');

  if (filtered.length === 0) {
    renderMessage(t('popup.no_results'));
    clearFilters();
    applyFilters({});
    return;
  }

  const allCreatorIds = [...new Set(filtered.flatMap(pickCreatorIds).filter(Boolean))];
  const avatarMap = await resolveCreatorAvatars(allCreatorIds);

  const headerCell = (txt) =>
    `<th class="px-3 py-2 text-left font-semibold whitespace-nowrap">${esc(txt)}</th>`;
  const cell = (html) => `<td class="px-3 py-2 align-middle">${html}</td>`;
  const starsHTML = (quality, max = 6) => {
    if (quality == null || isNaN(Number(quality))) return 'N/A';
    const q = Math.max(0, Math.min(max, Math.floor(Number(quality))));
    return `<span class="tracking-tight">${'★'.repeat(q)}${'☆'.repeat(max - q)}</span>`;
  };
  const safeHex = (c) => (/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(c)) ? c : '#ffffff');

  const colgroup = `
    <colgroup>
      <col class="w-[10%]">
      <col class="w-[17%]">
      <col class="w-[8%]">
      <col class="w-[15%]">
      <col class="w-[10%]">
      <col class="w-[10%]">
      <col class="w-[10%]">
    </colgroup>
  `;

  setResultsHTML(`
    <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div class="overflow-auto">
        <table class="min-w-full text-sm table-fixed border-separate border-spacing-y-1">
          ${colgroup}
          <thead class="bg-zinc-900/60 text-zinc-300">
            <tr>
              ${headerCell(t('thead.mapCode'))}
              ${headerCell(t('thead.mapName'))}
              ${headerCell(t('thead.mapType'))}
              ${headerCell(t('thead.mapCreator'))}
              ${headerCell(t('thead.mapDifficulty'))}
              ${headerCell(t('thead.mapQuality'))}
              ${headerCell(t('thead.mapDetails'))}
            </tr>
          </thead>
          <tbody>
            ${filtered
              .map((r, idx) => {
                const ringColor =
                  user_id && r.medal_type === 'Gold'
                    ? 'after:ring-yellow-400/40'
                    : user_id && r.medal_type === 'Silver'
                      ? 'after:ring-zinc-200/30'
                      : user_id && r.medal_type === 'Bronze'
                        ? 'after:ring-amber-600/40'
                        : '';
                const halo = ringColor
                  ? `relative after:content-[''] after:absolute after:inset-x-2 after:inset-y-0.5
                     after:rounded-lg after:ring-2 after:pointer-events-none after:z-0 ${ringColor}`
                  : 'relative';

                const diffColor = safeHex(
                  difficultyColors[normalizeDifficulty(r.difficulty)] || '#ffffff'
                );

                const types = getTypesArray(r);
                const mapType = types.length ? types.join(', ') : 'N/A';

                const names = pickCreatorNames(r);
                const ids = pickCreatorIds(r);
                if (names.length === 1 && ids.length === 0 && r.user_id)
                  ids.push(String(r.user_id));

                const creatorsHTML = names
                  .map((name, i) => {
                    const id = ids[i];
                    const fallback = defaultAvatarFromId(id || name);
                    const url = id ? avatarMap.get(String(id)) || fallback : fallback;
                    const profileHref = id ? `rank_card?user_id=${encodeURIComponent(id)}` : '#';
                    return `
                  <a href="${escAttr(profileHref)}"
                     class="inline-flex items-center gap-2 rounded-md hover:bg-white/5 px-1.5 py-0.5"
                     title="${escAttr(name)}">
                    <img
                      src="${escAttr(url)}"
                      alt=""
                      class="h-6 w-6 rounded-full object-cover ring-1 ring-white/10 bg-zinc-800"
                      loading="lazy" decoding="async" referrerpolicy="no-referrer"
                      data-fallback-src="${escAttr(fallback)}"
                    />
                    <span data-sf="${escAttr(name)}"></span>
                  </a>
                `;
                  })
                  .join('');

                const code = r.code || 'N/A';

                const hasNonNullTime =
                  r.time != null && String(r.time).trim().toLowerCase() !== 'null';
                const hasCheck =
                  Boolean(user_id) &&
                  (r.user_has_completion ||
                    r.user_has_record ||
                    r.user_completed ||
                    hasNonNullTime);

                const ratingValue = r.ratings != null ? r.ratings : r.quality;

                const codeChip =
                  code !== 'N/A'
                    ? `
                  <button type="button"
                          class="copy-map-code group relative z-10 inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5
                                text-xs font-semibold text-zinc-100 hover:bg-white/10
                                focus:outline-none focus:ring-2 focus:ring-emerald-400/50 cursor-pointer
                                w-28"
                          data-code="${escAttr(code)}"
                          aria-label="${escAttr(t('popup.click_to_copy_map_code'))}"
                          title="${escAttr(t('popup.click_to_copy_map_code'))}">
                    <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                      <rect x="3" y="3" width="13" height="13" rx="2"></rect>
                    </svg>
                    <span class="min-w-0 truncate" data-sf="${escAttr(code)}"></span>
                    ${hasCheck ? '<span class="ml-auto text-emerald-400 shrink-0">✓</span>' : ''}
                  </button>
                `
                    : `<span data-sf="N/A"></span>`;

                return `
                <tr class="${halo} bg-zinc-900/40 hover:bg-white/5 transition">
                  ${cell(codeChip)}
                  ${cell(`<span data-sf="${escAttr(r.map_name || 'N/A')}"></span>`)}
                  ${cell(`<span data-sf="${escAttr(mapType)}"></span>`)}
                  <td class="px-3 py-2 align-middle">
                    <div class="-ml-1 flex flex-wrap items-center gap-2">${creatorsHTML || 'N/A'}</div>
                  </td>
                  ${cell(`<span class="${__clsTextColor(diffColor)}">
                            <span data-sf="${escAttr(r.difficulty || 'N/A')}">${esc(r.difficulty || 'N/A')}</span>
                          </span>`)}
                  ${cell(qualityMicroBarHTML(ratingValue))}
                  ${cell(`
                    <button
                      type="button"
                      class="js-open-map-details inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs hover:bg-white/10 cursor-pointer"
                      data-index="${idx}">
                      ${esc(t('thead.mapView'))}
                    </button>
                  `)}
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `);

  const resultsRoot = document.getElementById('resultsContainer');
  applySplitFlap(resultsRoot);
  cascadeRows();

  if (typeof registerMapCodeCopyTargets === 'function') {
    registerMapCodeCopyTargets(resultsRoot);
  } else if (resultsRoot && resultsRoot.dataset.copyDelegated !== '1') {
    resultsRoot.dataset.copyDelegated = '1';
    resultsRoot.addEventListener('click', (e) => {
      const btn = e.target.closest('.copy-map-code');
      if (!btn) return;
      e.preventDefault();
      const code = btn.getAttribute('data-code') || btn.textContent.trim();
      if (code && code !== 'N/A') copyMapCode(code);
    });
    resultsRoot.addEventListener('keydown', (e) => {
      const btn = e.target.closest('.copy-map-code');
      if (!btn) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const code = btn.getAttribute('data-code') || btn.textContent.trim();
        if (code && code !== 'N/A') copyMapCode(code);
      }
    });
  }

  resultsRoot.querySelectorAll('img[data-fallback-src]').forEach((img) => {
    const fallback = img.getAttribute('data-fallback-src');
    img.addEventListener(
      'error',
      () => {
        if (img.src !== fallback) img.src = fallback;
      },
      { once: true }
    );
  });

  if (!document.getElementById('detailsModalOverlay')) {
    const shell = document.createElement('div');
    shell.innerHTML = `
      <div id="detailsModalOverlay"
        class="fixed inset-0 z-[70] hidden flex items-center justify-center
               bg-black/50 backdrop-blur opacity-0 transition-opacity duration-200">
        <div id="detailsModalBox"
          class="relative w-[min(92vw,980px)] max-h-[88vh] overflow-y-auto
                 translate-y-3 opacity-0 transition-all duration-200
                 rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl ring-1 ring-white/5">
          <button id="detailsModalClose"
            class="absolute right-3 top-3 z-10
                   inline-flex h-8 w-8 items-center justify-center
                   rounded-full bg-white/10 text-zinc-300 hover:bg-white/20
                   focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            aria-label="Close modal">
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6L18 18M18 6L6 18"/>
            </svg>
          </button>
          <div id="modalDetailsContainer" class="p-0"></div>
        </div>
      </div>
    `;
    document.body.appendChild(shell.firstElementChild);
  }

  async function openDetailsModal(index) {
    const r = filtered[index];
    if (!r) return;

    let mech = Array.isArray(r.mechanics) ? r.mechanics : [];
    let rest = Array.isArray(r.restrictions) ? r.restrictions : [];
    if (CURRENT_LANG === 'cn') {
      mech = mech
        .filter(Boolean)
        .map((o) => t(`mechanics.${o.toLowerCase().replace(/ /g, '_')}`) || o);
      rest = rest
        .filter(Boolean)
        .map((o) => t(`restrictions.${o.toLowerCase().replace(/ /g, '_')}`) || o);
    }
    const mechanics = mech.length ? mech.join(', ') : 'N/A';
    const restrictions = rest.length ? rest.join(', ') : 'N/A';

    const description =
      r.description || r.desc || t('no_description') || 'No description available';
    const mapNameKey = r.original_map_name
      ? r.original_map_name.toLowerCase().replace(/[()\s']/g, '')
      : (r.map_name || 'default').toLowerCase().replace(/[()\s']/g, '');
    const fallbackBannerPath = `assets/banners/${mapNameKey}.png`;
    const bannerPath = r.map_banner || fallbackBannerPath;

    const diffColor = safeHex(difficultyColors[normalizeDifficulty(r.difficulty)] || '#ffffff');
    const typeText = Array.isArray(r.category) ? r.category.join(', ') : r.category || 'Classic';
    const creatorNames = pickCreatorNames(r).join(', ') || 'N/A';

    const medalGold = r.medals && r.medals.gold != null ? r.medals.gold : r.gold;
    const medalSilver = r.medals && r.medals.silver != null ? r.medals.silver : r.silver;
    const medalBronze = r.medals && r.medals.bronze != null ? r.medals.bronze : r.bronze;

    const medals = [];
    if (medalGold != null && medalGold !== 'N/A')
      medals.push(`
      <div class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1">
        <img src="assets/verifications/gold_wr.gif" alt="Gold Medal" class="h-6 w-6" />
        <span class="text-sm">${esc(String(medalGold))}</span>
      </div>
    `);
    if (medalSilver != null && medalSilver !== 'N/A')
      medals.push(`
      <div class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1">
        <img src="assets/verifications/silver_wr.gif" alt="Silver Medal" class="h-6 w-6" />
        <span class="text-sm">${esc(String(medalSilver))}</span>
      </div>
    `);
    if (medalBronze != null && medalBronze !== 'N/A')
      medals.push(`
      <div class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1">
        <img src="assets/verifications/bronze_wr.gif" alt="Bronze Medal" class="h-6 w-6" />
        <span class="text-sm">${esc(String(medalBronze))}</span>
      </div>
    `);

    const ratingValue = r.ratings != null ? r.ratings : r.quality;

    const headerBanner = `
      <div class="relative">
        <div class="h-36 sm:h-44 w-full bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-t-2xl overflow-hidden">
          <img id="modalBannerImg" src="${escAttr(bannerPath)}" alt="${escAttr(r.map_name || 'banner')}"
               class="h-full w-full object-cover opacity-70"
               data-fallback-src="${escAttr(fallbackBannerPath)}">
        </div>
        <div class="pointer-events-none absolute inset-0 rounded-t-2xl bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>

        <div class="absolute bottom-3 left-4 right-4 flex flex-wrap items-end gap-3 pr-2">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">${esc(r.map_name || 'N/A')}</h2>
            <p class="text-sm text-zinc-300">${esc(typeText)}</p>
          </div>
          <div class="ml-auto flex flex-wrap items-center gap-2">
            <button type="button"
              class="copy-map-code relative z-10 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5
                     text-xs font-semibold text-zinc-100 hover:bg-white/10 hover:text-emerald-300 hover:ring-1 hover:ring-emerald-400/40
                     focus:outline-none focus:ring-2 focus:ring-emerald-400/50 cursor-pointer"
              data-code="${escAttr(r.code || '')}"
              aria-label="${escAttr(t('popup.click_to_copy_map_code') || 'Click to copy map code')}"
              title="${escAttr(t('popup.click_to_copy_map_code') || 'Clique pour copier le map code')}">
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                <rect x="3" y="3" width="13" height="13" rx="2"></rect>
              </svg>
              <span class="font-semibold">${esc(t('thead.mapCode'))}:</span> ${esc(r.code || 'N/A')}
            </button>

            <span class="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs">
              <span class="font-semibold">${esc(t('thead.mapDifficulty'))}:</span>
              <span class="${__clsTextColor(diffColor)}">
                <span data-sf="${escAttr(r.difficulty || 'N/A')}">${esc(r.difficulty || 'N/A')}</span>
              </span>
            </span>
            <span class="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs">
              <span class="font-semibold">${esc(t('thead.mapQuality'))}:</span>
              ${starsHTML(ratingValue)}
            </span>
          </div>
        </div>
      </div>
    `;

    const detailsGrid = `
      <div class="px-5 pb-6 pt-2 space-y-6">
        <div class="grid gap-6 md:grid-cols-2">
          <div class="space-y-3">
            <div class="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
              <h3 class="text-sm font-semibold text-zinc-200 mb-3">${esc(t('thead.mapView'))}</h3>
              <dl class="grid grid-cols-1 gap-2 text-sm">
                <div class="flex justify-between gap-3"><dt class="text-zinc-400">${esc(t('thead.mapCreator'))}</dt><dd class="text-right">${esc(creatorNames)}</dd></div>
                <div class="flex justify-between gap-3"><dt class="text-zinc-400">${esc(t('thead.mapCheckpoints'))}</dt><dd class="text-right">${esc(String(r.checkpoints ?? t('na')))}</dd></div>
                <div class="flex justify-between gap-3"><dt class="text-zinc-400">${esc(t('thead.mapMechanics'))}</dt><dd class="text-right">${esc(mechanics)}</dd></div>
                <div class="flex justify-between gap-3"><dt class="text-zinc-400">${esc(t('thead.mapRestrictions'))}</dt><dd class="text-right">${esc(restrictions)}</dd></div>
              </dl>
            </div>

            <div class="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
              <h3 class="text-sm font-semibold text-zinc-200 mb-3">${esc(t('thead.mapDescription'))}</h3>
              <p class="text-sm leading-relaxed text-zinc-200">${esc(description)}</p>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-2">${medals.join('')}</div>
          </div>
        </div>

        <div class="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
          <div id="chartContainer"></div>
        </div>
      </div>
    `;

    const overlay = document.getElementById('detailsModalOverlay');
    const box = document.getElementById('detailsModalBox');
    const modalRoot = document.getElementById('modalDetailsContainer');

    modalRoot.innerHTML = headerBanner + detailsGrid;

    const bannerImg = document.getElementById('modalBannerImg');
    if (bannerImg) {
      const fb = bannerImg.getAttribute('data-fallback-src');
      bannerImg.addEventListener(
        'error',
        () => {
          if (bannerImg.src !== fb) bannerImg.src = fb;
        },
        { once: true }
      );
    }

    if (typeof registerMapCodeCopyTargets === 'function') {
      registerMapCodeCopyTargets(modalRoot);
    } else {
      if (modalRoot && modalRoot.dataset.copyDelegated !== '1') {
        modalRoot.dataset.copyDelegated = '1';
        modalRoot.addEventListener('click', (e) => {
          const btn = e.target.closest('.copy-map-code');
          if (!btn) return;
          e.preventDefault();
          const code = btn.getAttribute('data-code') || btn.textContent.trim();
          if (code && code !== 'N/A') copyMapCode(code);
        });
        modalRoot.addEventListener('keydown', (e) => {
          const btn = e.target.closest('.copy-map-code');
          if (!btn) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const code = btn.getAttribute('data-code') || btn.textContent.trim();
            if (code && code !== 'N/A') copyMapCode(code);
          }
        });
      }
    }

    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    const prevOverflow = document.body.style.overflow;

    requestAnimationFrame(() => {
      overlay.classList.remove('opacity-0');
      overlay.classList.add('opacity-100');
      box.classList.remove('translate-y-3', 'opacity-0');
      box.classList.add('translate-y-0', 'opacity-100');
    });

    const btnClose = document.getElementById('detailsModalClose');
    const closeDetailsModal = () => {
      overlay.classList.add('opacity-0');
      overlay.classList.remove('opacity-100');
      box.classList.add('translate-y-3', 'opacity-0');
      box.classList.remove('translate-y-0', 'opacity-100');
      setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
        overlay.removeEventListener('click', outsideHandler);
        document.removeEventListener('keydown', escHandler);
        document.body.style.overflow = prevOverflow || '';
      }, 180);
    };
    const outsideHandler = (e) => {
      if (e.target === overlay) closeDetailsModal();
    };
    const escHandler = (e) => {
      if (e.key === 'Escape') closeDetailsModal();
    };

    overlay.addEventListener('click', outsideHandler);
    document.addEventListener('keydown', escHandler);
    btnClose.addEventListener('click', closeDetailsModal, { once: true });
    window.closeDetailsModal = closeDetailsModal;

    btnClose.focus();

    const [stats, progressionData] = await Promise.all([
      fetchMapCompletionStatistics(r.code),
      fetchProgression(r.code),
    ]);
    if (stats && Array.isArray(progressionData) && progressionData.length > 0) {
      renderProgressionChart(progressionData, stats);
    }
  }

  resultsRoot.querySelectorAll('.js-open-map-details').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-index'));
      openDetailsModal(idx);
    });
  });

  animateQualityBars();
}

/* =========================
   RENDER PERSONAL RECORDS
   ========================= */
async function displayPersonalRecordsResults(results) {
  const rows = Array.isArray(results.results) ? results.results : [];
  const filtered = rows.filter((r) => r.code && r.code !== 'N/A');

  if (filtered.length === 0) {
    renderMessage(t('popup.no_results'));
    clearFilters();
    applyFilters({});
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
    const allIds = [
      ...new Set(
        filtered
          .map((r) => r.user_id)
          .filter(Boolean)
          .map(String)
      ),
    ];
    avatarMap = await resolveCreatorAvatars(allIds);
  }

  setResultsHTML(`
    <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div class="overflow-auto">
        <table class="min-w-full text-sm table-fixed border-separate border-spacing-y-1">
          <thead class="bg-zinc-900/60 text-zinc-300">
            <tr>
              <th class="px-3 py-2 text-left font-semibold whitespace-nowrap">${t('thead.mapCode')}</th>
              <th class="px-3 py-2 text-left font-semibold whitespace-nowrap">${t('thead.mapNickname')}</th>
              <th class="px-3 py-2 text-left font-semibold whitespace-nowrap">${t('thead.mapDiscordTag')}</th>
              <th class="px-3 py-2 text-left font-semibold whitespace-nowrap">${t('thead.mapDifficulty')}</th>
              <th class="px-3 py-2 text-left font-semibold whitespace-nowrap">${t('thead.mapTime')}</th>
              <th class="px-3 py-2 text-left font-semibold whitespace-nowrap">${t('thead.mapMedal')}</th>
            </tr>
          </thead>
          <tbody>
            ${filtered
              .map((r) => {
                const diff = r.difficulty || 'N/A';
                const diffColor = difficultyColors[normalizeDifficulty(diff)] || '#fff';

                const isCompletion = r.completion === true;
                const timeDisplay = isCompletion
                  ? t('completion') || 'Completion'
                  : r.time != null
                    ? String(r.time)
                    : 'N/A';

                const uid = r.user_id ? String(r.user_id) : null;
                const fallback = currentUid
                  ? defaultAvatarFromId(currentUid)
                  : defaultAvatarFromId(uid || '0');
                const avatarUrl = currentUserAvatar
                  ? currentUserAvatar
                  : uid
                    ? avatarMap.get(uid) || fallback
                    : fallback;

                const profileHref = uid ? `rank_card?user_id=${encodeURIComponent(uid)}` : null;
                const nickname = r.name || r.nickname || 'N/A';
                const also = r.also_known_as || r.discord_tag || 'N/A';

                const mapCodeCell = r.code
                  ? `
                  <button
                    type="button"
                    class="copy-map-code group relative z-10 inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5
                              text-xs font-semibold text-zinc-100 hover:bg-white/10
                              focus:outline-none focus:ring-2 focus:ring-emerald-400/50 cursor-pointer
                              w-24"
                    data-code="${escAttr(r.code)}"
                    title="${escAttr(t('popup.click_to_copy_map_code') || 'Clique pour copier le map code')}">
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
                    <img
                      class="h-6 w-6 rounded-full object-cover ring-1 ring-white/10 bg-zinc-800"
                      alt=""
                      referrerpolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      src="${escAttr(avatarUrl)}"
                      data-fallback-src="${escAttr(fallback)}"/>
                    <span data-sf="${escAttr(nickname)}"></span>
                  </a>`
                  : `
                  <div class="flex items-center gap-2">
                    <img
                      class="h-6 w-6 rounded-full object-cover ring-1 ring-white/10 bg-zinc-800"
                      alt=""
                      referrerpolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      src="${escAttr(avatarUrl)}"
                      data-fallback-src="${escAttr(fallback)}"/>
                    <span data-sf="${escAttr(nickname)}"></span>
                  </div>`;

                return `
                <tr class="relative bg-zinc-900/40 hover:bg-white/5 transition">
                  <td class="px-3 py-2 align-middle">
                    ${mapCodeCell}
                  </td>

                  <td class="px-3 py-2 align-middle">
                    ${nicknameBlock}
                  </td>

                  <td class="px-3 py-2 align-middle">
                    <span data-sf="${escAttr(also)}">${esc(also)}</span>
                  </td>

                  <td class="px-3 py-2 align-middle">
                    <span class="${__clsTextColor(diffColor)}">
                      <span data-sf="${escAttr(r.difficulty || 'N/A')}">${esc(r.difficulty || 'N/A')}</span>
                    </span>
                  </td>

                  <td class="px-3 py-2 align-middle">
                    <span data-sf="${escAttr(timeDisplay)}">${esc(timeDisplay)}</span>
                  </td>

                  <td class="px-3 py-2 align-middle">
                    <span data-sf="${escAttr(r.medal || 'N/A')}">${esc(r.medal || 'N/A')}</span>
                  </td>
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `);

  const root = document.getElementById('resultsContainer');
  applySplitFlap(root);
  cascadeRows();
  if (typeof registerMapCodeCopyTargets === 'function') {
    registerMapCodeCopyTargets(root);
  }

  root.querySelectorAll('img[data-fallback-src]').forEach((img) => {
    const fallback = img.getAttribute('data-fallback-src');
    img.addEventListener(
      'error',
      () => {
        if (img.src !== fallback) img.src = fallback;
      },
      { once: true }
    );
  });
}

/* =========================
   RENDER COMPLETIONS
   ========================= */
async function displayCompletionsResults(results) {
  const rows = Array.isArray(results.results) ? results.results : [];
  const filtered = rows.filter((r) => (r.map_code || r.code) && (r.map_code || r.code) !== 'N/A');

  if (filtered.length === 0) {
    renderMessage(t('popup.no_results'));
    clearFilters();
    applyFilters({});
    return;
  }

  const allIds = [
    ...new Set(
      filtered
        .map((r) => r.user_id)
        .filter(Boolean)
        .map(String)
    ),
  ];
  const avatarMap = await resolveCreatorAvatars(allIds);
  const currentUid = window.user_id ? String(window.user_id) : null;

  if (!document.getElementById('detailsModalOverlay')) {
    const shell = document.createElement('div');
    shell.innerHTML = `
      <div id="detailsModalOverlay"
        class="fixed inset-0 z-[70] hidden flex items-center justify-center
               bg-black/50 backdrop-blur opacity-0 transition-opacity duration-200">
        <div id="detailsModalBox"
          class="relative w-[min(92vw,980px)] max-h-[88vh] overflow-y-auto
                 translate-y-3 opacity-0 transition-all duration-200
                 rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl ring-1 ring-white/5">
          <button id="detailsModalClose"
            class="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center
                   rounded-full bg-white/10 text-zinc-300 hover:bg-white/20
                   focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            aria-label="Close modal">
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6L18 18M18 6L6 18"/>
            </svg>
          </button>
          <div id="modalDetailsContainer" class="p-0"></div>
        </div>
      </div>
    `;
    document.body.appendChild(shell.firstElementChild);
  }

  const overlay = document.getElementById('detailsModalOverlay');
  const box = document.getElementById('detailsModalBox');
  const btnClose = document.getElementById('detailsModalClose');
  const container = document.getElementById('modalDetailsContainer');

  function closeDetailsModal() {
    overlay.classList.add('opacity-0');
    overlay.classList.remove('opacity-100');
    box.classList.add('translate-y-3', 'opacity-0');
    box.classList.remove('translate-y-0', 'opacity-100');
    setTimeout(() => {
      overlay.classList.add('hidden');
      overlay.classList.remove('flex');
    }, 180);
  }

  btnClose.onclick = closeDetailsModal;

  if (!overlay.__outsideBound) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDetailsModal();
    });
    overlay.__outsideBound = true;
  }

  if (!document.__detailsEscHandlerBound) {
    document.__detailsEscHandlerBound = true;
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const ov = document.getElementById('detailsModalOverlay');
      if (ov && !ov.classList.contains('hidden')) closeDetailsModal();
    });
  }

  window.closeDetailsModal = closeDetailsModal;

  setResultsHTML(`
    <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div class="overflow-auto">
        <table class="min-w-full text-sm table-fixed border-separate border-spacing-y-1">
          <thead class="bg-zinc-900/60 text-zinc-300">
            <tr>
              <th class="px-3 py-2 text-left font-semibold whitespace-nowrap">${t('thead.mapCode')}</th>
              <th class="px-3 py-2 text-left font-semibold whitespace-nowrap">${t('thead.mapNickname')}</th>
              <th class="px-3 py-2 text-left font-semibold whitespace-nowrap">${t('thead.mapDiscordTag')}</th>
              <th class="px-3 py-2 text-left font-semibold whitespace-nowrap">${t('thead.mapTime')}</th>
              <th class="px-3 py-2 text-left font-semibold whitespace-nowrap">${t('thead.mapMedal')}</th>
              <th class="px-3 py-2 text-left font-semibold whitespace-nowrap">${t('thead.mapVideo')}</th>
              <th class="px-3 py-2 text-left font-semibold whitespace-nowrap">${t('thead.mapDetails') || 'Details'}</th>
            </tr>
          </thead>
          <tbody>
            ${filtered
              .map((r, idx) => {
                const mapCode = r.map_code || r.code || 'N/A';
                const isCompletion = r.completion === true;
                const timeDisplay = isCompletion
                  ? t('completion') || 'Completion'
                  : r.time != null
                    ? String(r.time)
                    : 'N/A';

                const uid = r.user_id ? String(r.user_id) : null;
                const fallback = defaultAvatarFromId(uid || '0');
                const avatarUrl = uid ? avatarMap.get(uid) || fallback : fallback;
                const profileHref = uid ? `rank_card?user_id=${encodeURIComponent(uid)}` : null;

                const nickname = r.nickname || r.name || 'N/A';
                const also = r.also_known_as ?? r.discord_tag ?? 'N/A';

                const codeCell =
                  mapCode !== 'N/A'
                    ? `
                  <button type="button"
                    class="copy-map-code group relative z-10 inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5
                           text-xs font-semibold text-zinc-100 hover:bg-white/10 focus:outline-none
                           focus:ring-2 focus:ring-emerald-400/50 cursor-pointer w-24"
                    data-code="${escAttr(mapCode)}"
                    title="${escAttr(t('popup.click_to_copy_map_code') || 'Clique pour copier le map code')}">
                    <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                      <rect x="3" y="3" width="13" height="13" rx="2"></rect>
                    </svg>
                    <span data-sf="${escAttr(mapCode)}"></span>
                  </button>`
                    : `<span data-sf="N/A">N/A</span>`;

                const nicknameBlock = profileHref
                  ? `
                  <a href="${escAttr(profileHref)}"
                     class="inline-flex items-center gap-2 rounded-md hover:bg-white/5 px-1.5 py-0.5"
                     title="${currentUid && uid && currentUid === uid ? t('popup.you') : escAttr(nickname)}">
                    <img class="h-6 w-6 rounded-full object-cover ring-1 ring-white/10 bg-zinc-800"
                         alt="" referrerpolicy="no-referrer" loading="lazy" decoding="async"
                         src="${escAttr(avatarUrl)}"
                         data-fallback-src="${escAttr(fallback)}"/>
                    <span data-sf="${escAttr(nickname)}"></span>
                  </a>`
                  : `
                  <div class="flex items-center gap-2">
                    <img class="h-6 w-6 rounded-full object-cover ring-1 ring-white/10 bg-zinc-800"
                         alt="" referrerpolicy="no-referrer" loading="lazy" decoding="async"
                         src="${escAttr(avatarUrl)}"
                         data-fallback-src="${escAttr(fallback)}"/>
                    <span data-sf="${escAttr(nickname)}"></span>
                  </div>`;

                const videoCell = r.video
                  ? `<a data-sf="Watch" href="${escAttr(r.video)}" target="_blank" rel="noopener"
                     class="text-brand-300 hover:text-brand-200 underline">${esc(t('watch') || 'Watch')}</a>`
                  : `<span data-sf="N/A">N/A</span>`;

                return `
                <tr class="relative bg-zinc-900/40 hover:bg-white/5 transition">
                  <td class="px-3 py-2 align-middle">${codeCell}</td>
                  <td class="px-3 py-2 align-middle">${nicknameBlock}</td>
                  <td class="px-3 py-2 align-middle"><span data-sf="${escAttr(also)}">${esc(also)}</span></td>
                  <td class="px-3 py-2 align-middle"><span data-sf="${escAttr(timeDisplay)}">${esc(timeDisplay)}</span></td>
                  <td class="px-3 py-2 align-middle"><span data-sf="${escAttr(r.medal || 'N/A')}">${esc(r.medal || 'N/A')}</span></td>
                  <td class="px-3 py-2 align-middle">${videoCell}</td>
                  <td class="px-3 py-2 align-middle">
                    <button
                      class="js-open-completion-details inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs hover:bg-white/10 cursor-pointer"
                      data-index="${idx}">
                      ${esc(t('thead.mapView') || 'View')}
                    </button>
                  </td>
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `);

  const root = document.getElementById('resultsContainer');
  applySplitFlap(root);
  cascadeRows();
  if (typeof registerMapCodeCopyTargets === 'function') registerMapCodeCopyTargets(root);

  root.querySelectorAll('img[data-fallback-src]').forEach((img) => {
    const fallback = img.getAttribute('data-fallback-src');
    img.addEventListener(
      'error',
      () => {
        if (img.src !== fallback) img.src = fallback;
      },
      { once: true }
    );
  });

  function openCompletionDetails(index) {
    const r = filtered[index];
    if (!r) return;

    const mapCode = r.map_code || r.code || 'N/A';
    const uid = r.user_id ? String(r.user_id) : null;
    const profileHref = uid ? `rank_card?user_id=${encodeURIComponent(uid)}` : null;

    const mapNameKey = (r.map_name || 'default').toLowerCase().replace(/[()\s']/g, '');
    const bannerPath = r.map_banner || `assets/banners/${mapNameKey}.png`;
    const fallbackBanner = `assets/banners/${mapNameKey}.png`;
    const diffColor = difficultyColors[normalizeDifficulty(r.difficulty || '')] || '#ffffff';
    const diffClass = __clsTextColor(diffColor);

    const infoRow = (label, valueHtml) => `
      <div class="flex justify-between gap-3">
        <dt class="text-zinc-400">${esc(label)}</dt>
        <dd class="text-right">${valueHtml}</dd>
      </div>`;
    const linkOrNA = (url, text) =>
      url
        ? `<a href="${escAttr(url)}" target="_blank" rel="noopener" class="text-brand-300 hover:text-brand-200 underline">${esc(text || url)}</a>`
        : 'N/A';

    container.innerHTML = `
      <div class="relative">
        <div class="h-36 sm:h-44 w-full rounded-t-2xl overflow-hidden bg-zinc-900">
          <img id="modalBannerImg" src="${escAttr(bannerPath)}" alt="${escAttr(r.map_name || 'banner')}"
               class="h-full w-full object-cover opacity-70"
               data-fallback-src="${escAttr(fallbackBanner)}">
        </div>
        <div class="pointer-events-none absolute inset-0 rounded-t-2xl bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>

        <div class="absolute bottom-3 left-4 right-4 flex flex-wrap items-end gap-3 pr-2">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">${esc(r.map_name || 'N/A')}</h2>
            <p class="text-sm text-zinc-300">
              <span class="font-semibold">${esc(t('thead.mapDifficulty'))}:</span>
              <span class="${diffClass}">
                <span data-sf="${escAttr(r.difficulty || 'N/A')}">${esc(r.difficulty || 'N/A')}</span>
              </span>
            </p>
          </div>
          <div class="ml-auto flex flex-wrap items-center gap-2">
            <button type="button"
              class="copy-map-code relative z-10 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5
                     text-xs font-semibold text-zinc-100 hover:bg-white/10 hover:text-emerald-300 hover:ring-1 hover:ring-emerald-400/40
                     focus:outline-none focus:ring-2 focus:ring-emerald-400/50 cursor-pointer"
              data-code="${escAttr(mapCode)}"
              title="${escAttr(t('popup.click_to_copy_map_code') || 'Click to copy map code')}">
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                <rect x="3" y="3" width="13" height="13" rx="2"></rect>
              </svg>
              <span class="font-semibold">${esc(t('thead.mapCode'))}:</span> ${esc(mapCode)}
            </button>
          </div>
        </div>
      </div>

      <div class="px-5 pb-6 pt-2 space-y-6">
        <div class="grid gap-6 md:grid-cols-2">
          <div class="space-y-3">
            <div class="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
              <h3 class="text-sm font-semibold text-zinc-200 mb-3">${esc(t('thead.mapDetails') || 'Details')}</h3>
              <dl class="grid grid-cols-1 gap-2 text-sm">
                ${infoRow(t('thead.mapNickname'), esc(r.nickname || r.name || 'N/A'))}
                ${infoRow(t('thead.mapDiscordTag'), esc(r.also_known_as ?? r.discord_tag ?? 'N/A'))}
                ${infoRow('User ID', uid ? (profileHref ? `<a class="underline" href="${escAttr(profileHref)}">${esc(uid)}</a>` : esc(uid)) : 'N/A')}
                ${infoRow(t('thead.mapMedal'), esc(r.medal || 'N/A'))}
                ${infoRow(
                  t('thead.mapTime'),
                  r.completion
                    ? esc(t('completion') || 'Completion')
                    : r.time != null
                      ? esc(String(r.time))
                      : 'N/A'
                )}
                ${infoRow('Rank', r.rank != null ? esc(String(r.rank)) : 'N/A')}
                ${infoRow('Verified', r.verified === true ? '✓' : 'N/A')}
                ${infoRow('Suspicious', r.suspicious === true ? '✓' : 'N/A')}
                ${infoRow('Legacy', r.legacy === true ? (r.legacy_medal ? esc(String(r.legacy_medal)) : '✓') : 'N/A')}
                ${infoRow('Message ID', r.message_id != null ? esc(String(r.message_id)) : 'N/A')}
                ${infoRow(t('thead.mapVideo'), linkOrNA(r.video, t('watch') || 'Watch'))}
              </dl>
            </div>
          </div>

          <div class="space-y-3">
            <div class="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
              <h3 class="text-sm font-semibold text-zinc-200 mb-3">${esc(t('screenshot') || 'Screenshot')}</h3>
              <div class="flex items-center justify-center rounded-lg bg-zinc-950/60 ring-1 ring-white/5 min-h-[84px] px-3 py-4">
                ${
                  r.screenshot
                    ? `<a href="${escAttr(r.screenshot)}" target="_blank" rel="noopener" class="text-brand-300 hover:text-brand-200 underline">
                         ${esc(t('open_screenshot') || 'Open screenshot')}
                       </a>`
                    : `<span class="text-sm text-zinc-400">N/A</span>`
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const bannerImg = document.getElementById('modalBannerImg');
    if (bannerImg) {
      const fb = bannerImg.getAttribute('data-fallback-src');
      bannerImg.addEventListener(
        'error',
        () => {
          if (bannerImg.src !== fb) bannerImg.src = fb;
        },
        { once: true }
      );
    }

    if (typeof registerMapCodeCopyTargets === 'function') registerMapCodeCopyTargets(container);

    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    requestAnimationFrame(() => {
      overlay.classList.remove('opacity-0');
      overlay.classList.add('opacity-100');
      box.classList.remove('translate-y-3', 'opacity-0');
      box.classList.add('translate-y-0', 'opacity-100');
    });
  }

  root.querySelectorAll('.js-open-completion-details').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-index'));
      openCompletionDetails(idx);
    });
  });
}

/* =========================
   RENDER GUIDES
   ========================= */
function displayGuideResults(results) {
  const rows = Array.isArray(results.results) ? results.results : [];
  const filtered = rows.filter((r) => r.url);

  if (filtered.length === 0) {
    renderMessage(t('popup.no_results'));
    clearFilters();
    applyFilters({});
    return;
  }

  setResultsHTML(`
    <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div class="overflow-auto">
        <table class="min-w-full text-sm table-fixed border-separate border-spacing-y-1">
          <thead class="bg-zinc-900/60 text-zinc-300">
            <tr>
              <th class="px-3 py-2 text-center align-middle font-semibold whitespace-nowrap">
                ${t('thead.mapVideo')}
              </th>
            </tr>
          </thead>
          <tbody>
            ${filtered
              .map((r) => {
                const embedUrl = getEmbedUrl(r.url);
                return `
                <tr class="relative bg-zinc-900/40 hover:bg-white/5 transition">
                  <td class="px-3 py-2 align-middle">
                    ${
                      embedUrl
                        ? `<div class="flex flex-col items-center gap-2 py-2">
                          <!-- Wrapper 16:9, no inline style -->
                          <div
                            class="relative w-[85%] max-w-3xl rounded-xl ring-1 ring-white/10 overflow-hidden bg-black aspect-video max-h-[360px]">
                            <iframe
                              class="absolute inset-0 w-full h-full"
                              src="${embedUrl}"
                              frameborder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowfullscreen>
                            </iframe>
                          </div>
                          ${
                            Array.isArray(r.usernames) && r.usernames.length > 1
                              ? `<div class="text-xs text-zinc-400">
                                   ${esc(t('thead.mapNickname'))}:
                                   <span class="text-zinc-200">${esc(r.usernames[1])}</span>
                                 </div>`
                              : ``
                          }
                        </div>`
                        : 'N/A'
                    }
                  </td>
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `);
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
  const msgOk = t('popup.map_code_copied', { code }) || t('popup.copied') || 'Map code copié !';
  const msgKo = t('popup.copy_failed') || 'Impossible de copier ce code.';

  copyTextToClipboard(code).then((ok) => {
    if (ok) showConfirmationMessage(msgOk);
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
   HELPERS MAP SEARCH
   ========================= */
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

    const uid = typeof window !== 'undefined' && window.user_id ? String(window.user_id) : null;

    if (!uid) {
      chartContainer.innerHTML = `
        <p class="text-center font-semibold text-red-400">
          ⚠️ ${t('popup.login_required_progression')}
        </p>`;
      return [];
    }

    const url = `/api/community/statistics/maps/${encodeURIComponent(mapCode)}/user/${encodeURIComponent(uid)}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const msg = data && data.message ? data.message : 'An error occurred. Please try again';
      chartContainer.innerHTML = `
        <p class="text-center font-semibold text-red-400">${msg}</p>`;
      return [];
    }

    if (!Array.isArray(data) || data.length === 0) {
      chartContainer.innerHTML = `
        <p class="text-center font-semibold text-zinc-100">
          ${t('popup.no_results')}
        </p>`;
      return [];
    }

    const sorted = data
      .map((item) => ({
        time: parseFloat(item.time),
        timestamp: new Date(item.inserted_at).toLocaleString(),
        inserted_at: new Date(item.inserted_at),
      }))
      .sort((a, b) => a.inserted_at - b.inserted_at);

    renderProgressionChart(sorted);
    return sorted;
  } catch (error) {
    console.error('Error fetching progression data:', error);
    const chartContainer = document.getElementById('chartContainer');
    if (chartContainer) {
      chartContainer.innerHTML = `
        <p class="text-center font-semibold text-red-500">
          An error occurred. Please try again later.
        </p>`;
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
    chartContainer.innerHTML = `
      <p class="text-center font-semibold text-zinc-100">
        No valid progression data available to display
      </p>`;
    return;
  }

  const recent = data.slice(-5);
  const maxX = recent.length === 1 ? 1 : recent.length - 1;
  const labels = Array.from({ length: maxX + 1 }, (_, i) => `${i}`);

  let times = recent.map((d) => d.time);
  if (recent.length === 1) times = [times[0], times[0]];

  const { min, max, avg } = stats || {};
  const lineOf = (val) => (val != null ? new Array(labels.length).fill(val) : []);
  const datasets = [
    {
      label: t('chart.user_record_progression'),
      data: times,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderWidth: 2,
      tension: 0.25,
    },
    {
      label: t('chart.average_time'),
      data: lineOf(avg),
      borderColor: 'rgba(255,205,86,1)',
      borderDash: [5, 5],
      borderWidth: 2,
      fill: false,
    },
    {
      label: t('chart.min_time'),
      data: lineOf(min),
      borderColor: 'rgba(54,162,235,1)',
      borderDash: [5, 5],
      borderWidth: 2,
      fill: false,
    },
    {
      label: t('chart.max_time'),
      data: lineOf(max),
      borderColor: 'rgba(255,99,132,1)',
      borderDash: [5, 5],
      borderWidth: 2,
      fill: false,
    },
  ].filter((d) => d.data.length > 0);

  const ctx = document.getElementById('progressionChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      interaction: { mode: 'nearest', axis: 'y' },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#FFFFFF',
            font: { family: 'Inter, ui-sans-serif, system-ui', weight: '600', size: 12 },
            padding: 16,
          },
        },
        title: {
          display: true,
          text: t('chart.record_progression_time'),
          color: '#FFFFFF',
          font: { family: 'Inter, ui-sans-serif, system-ui', weight: '800', size: 16 },
          padding: { top: 6, bottom: 10 },
        },
        tooltip: { callbacks: { title: () => null } },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#FFFFFF', font: { family: 'Inter', weight: '600', size: 12 } },
          grid: { display: false },
          border: { display: true, color: '#FFFFFF' },
        },
        x: {
          ticks: {
            color: '#FFFFFF',
            font: { family: 'Inter', weight: '600', size: 12 },
            padding: 0,
          },
          grid: { display: false },
          border: { display: true, color: '#FFFFFF' },
          min: 0,
        },
      },
    },
  });
}
