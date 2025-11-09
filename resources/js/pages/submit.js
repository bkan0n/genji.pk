/* =========================
   CONFIG & UTILS
   ========================= */
const sectionIds = ['submit_record', 'playtest', 'submit_map'];
const IS_GUEST = typeof user_id === 'undefined' || user_id == null || String(user_id).trim() === '';

const CATEGORY_OPTIONS = [
  { text: () => t('filters.classic'), value: 'Classic', raw: 'Classic' },
  {
    text: () => t('filters.increasing_difficulty'),
    value: 'Increasing Difficulty',
    raw: 'Increasing Difficulty',
  },
  // { text: () => t("filters.tournament"), value: "Tournament", raw: "Tournament" }
];

const DIFFICULTY_FINE_OPTIONS = [
  { text: () => `${t('filters.easy')} -`, value: 'Easy -', raw: 'Easy -' },
  { text: () => t('filters.easy'), value: 'Easy', raw: 'Easy' },
  { text: () => `${t('filters.easy')} +`, value: 'Easy +', raw: 'Easy +' },

  { text: () => `${t('filters.medium')} -`, value: 'Medium -', raw: 'Medium -' },
  { text: () => t('filters.medium'), value: 'Medium', raw: 'Medium' },
  { text: () => `${t('filters.medium')} +`, value: 'Medium +', raw: 'Medium +' },

  { text: () => `${t('filters.hard')} -`, value: 'Hard -', raw: 'Hard -' },
  { text: () => t('filters.hard'), value: 'Hard', raw: 'Hard' },
  { text: () => `${t('filters.hard')} +`, value: 'Hard +', raw: 'Hard +' },

  { text: () => `${t('filters.very_hard')} -`, value: 'Very Hard -', raw: 'Very Hard -' },
  { text: () => t('filters.very_hard'), value: 'Very Hard', raw: 'Very Hard' },
  { text: () => `${t('filters.very_hard')} +`, value: 'Very Hard +', raw: 'Very Hard +' },

  { text: () => `${t('filters.extreme')} -`, value: 'Extreme -', raw: 'Extreme -' },
  { text: () => t('filters.extreme'), value: 'Extreme', raw: 'Extreme' },
  { text: () => `${t('filters.extreme')} +`, value: 'Extreme +', raw: 'Extreme +' },

  { text: () => t('filters.hell'), value: 'Hell', raw: 'Hell' },
];

const CURRENT_LANG = document.documentElement.lang || 'en';
let translations = window.SUBMIT_I18N || {};
let addingSecondaryCreator = false;
const DEFAULT_AVATAR = 'assets/profile/genjibot.jpg';
const playtestDataArray = [];
let currentPage = 1;
let totalPages = 1;
let totalResults = 0;
const itemsPerPage = 12;
let uniqueDropdown = null;
let currentOptionsContainer = null;
let currentInput = null;
let icons = [];
let currentSection = 'playtest';
let toolbarDebounce;
let secondaryCreators = [];
const activeFilters = {};
const filterKeyMap = {
  map_code: 'code',
  map_name: 'map_name',
  creator: 'creator_id',
  map_type: 'category',
};

let __mechRestrCache = null;
let __mechRestrInFlight = null;
const COMPLETION_SUBMIT_ENDPOINT = '/api/completions';
const IMAGE_UPLOAD_ENDPOINT = '/api/utilities/image';
const TIME_REGEX = /^\d{1,5}(?:\.\d{1,2})?$/;
window.customBannerFile = null;

const BANNER_ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const BANNER_MAX_BYTES = 8 * 1024 * 1024;

window.screenshotUrl = null;
window.customBannerUrl = null;
window.screenshotFile = null;

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

function __show(el) {
  if (el) el.classList.remove('hidden');
}
function __hide(el) {
  if (el) el.classList.add('hidden');
}

function __enter(el) {
  if (!el) return;
  el.classList.add('x-anim', 'x-enter');
  __show(el);
  requestAnimationFrame(() => {
    el.classList.add('x-enter-active');
    el.classList.remove('x-enter');
  });
  const done = () => {
    el.classList.remove('x-enter-active', 'x-anim');
    el.removeEventListener('transitionend', done);
  };
  el.addEventListener('transitionend', done);
  setTimeout(done, 400);
}
function __exit(el, after) {
  if (!el) { after && after(); return; }
  el.classList.add('x-anim', 'x-exit');
  requestAnimationFrame(() => el.classList.add('x-exit-active'));
  const done = () => {
    __hide(el);
    el.classList.remove('x-exit', 'x-exit-active', 'x-anim');
    el.removeEventListener('transitionend', done);
    after && after();
  };
  el.addEventListener('transitionend', done);
  setTimeout(done, 320);
}

/* =========================
   I18N
   ========================= */
function t(path, params = {}) {
  const root = (translations && (translations[CURRENT_LANG] || translations)) || {};

  const parts = path.split('.');
  let result = root;
  for (const part of parts) {
    result = result?.[part];
    if (result == null) break;
  }

  if (typeof result !== 'string' && translations?.en) {
    let en = translations.en;
    for (const part of parts) {
      en = en?.[part];
      if (en == null) break;
    }
    if (typeof en === 'string') result = en;
  }

  if (typeof result !== 'string') return path;

  return result.replace(/\{(\w+)\}/g, (_, k) =>
    Object.prototype.hasOwnProperty.call(params, k) ? String(params[k]) : `{${k}}`
  );
}

/* =========================
   TAB SYSTEM
   ========================= */
function bindTabButtons() {
  document
    .getElementById('submitRecordBtn')
    ?.addEventListener('click', () => selectSection('submit_record'));
  document
    .getElementById('playtestBtn')
    ?.addEventListener('click', () => selectSection('playtest'));
  document
    .getElementById('submitMapBtn')
    ?.addEventListener('click', () => selectSection('submit_map'));
}

function setupTabs() {
  bindTabButtons();

  if (IS_GUEST) {
    ['submit_record', 'submit_map'].forEach((id) => {
      const btn = document.getElementById(`${id}Btn`);
      if (btn) {
        btn.classList.add('opacity-50', 'pointer-events-none');
        btn.setAttribute('aria-disabled', 'true');
        btn.title =
          typeof t === 'function'
            ? t('popup.login_required_msg')
            : 'Please login to access this section';
      }
    });

    applyGuestLocks();
  }

  const params = new URLSearchParams(window.location.search);
  const initial = params.get('section');
  selectSection(sectionIds.includes(initial) ? initial : currentSection);
}

function selectSection(section) {
  if (!sectionIds.includes(section)) section = currentSection;
  hideAllSuggestions();

  const params = new URLSearchParams(window.location.search);
  if (params.get('section') !== section) {
    history.replaceState(null, '', `?section=${section}`);
  }

  if (currentSection !== section) {
    document.getElementById('playtestCardContainer')?.replaceChildren();
    document.getElementById('paginationContainer')?.replaceChildren();
    if (section === 'playtest') resetPlaytestAnimationMarks();
  }

  const prev = currentSection;
  setActiveSectionUI(prev, section);
  currentSection = section;

  if (section === 'playtest') {
    showPlaytestSectionWithToolbar();
    requestAnimationFrame(() => renderPlaytestSkeletonCards(window.itemsPerPage || 12));
  } else if (section === 'submit_map') {
    initializeSubmitMap();
  } else if (section === 'submit_record') {
    initializeSubmitRecord();
  }

  if (section === 'submit_record') {
    requestAnimationFrame(() => {
      if (typeof animateSubmitRecordSection === 'function') animateSubmitRecordSection();
    });
  } else if (section === 'submit_map') {
    requestAnimationFrame(() => {
      if (typeof animateSubmitMapSection === 'function') animateSubmitMapSection();
    });
  }

  applyGuestLocks();

  if (IS_GUEST && (section === 'submit_map' || section === 'submit_record')) {
    try {
      showErrorMessage(t('popup.login_required_msg'));
    } catch {}
  }
}

/* =========================
   HELPERS TAB SYSTEM
   ========================= */
function setActiveButtons(section) {
  sectionIds.forEach((id) => {
    const btn = document.getElementById(`${id}Btn`);
    if (!btn) return;
    const active = id === section;

    btn.classList.toggle('active', active);
    btn.classList.toggle('bg-white', active);
    btn.classList.toggle('text-zinc-900', active);
    btn.classList.toggle('text-white', !active);

    btn.classList.toggle('pointer-events-none', active);

    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function animateShow(el) {
  if (!el) return;
  __enter(el);
}
function animateHide(el, done) {
  if (!el) return done && done();
  __exit(el, done);
}

function smoothSwitchPanels(prevSection, nextSection) {
  const sectionIdFromKey = (k) =>
    ({
      submit_record: 'submitRecordSection',
      playtest: 'playtestSection',
      submit_map: 'submitMapSection',
    })[k];

  const prevEl = document.getElementById(sectionIdFromKey(prevSection));
  const nextEl = document.getElementById(sectionIdFromKey(nextSection));
  if (prevSection === nextSection) {
    if (nextEl && nextEl.classList.contains('hidden')) animateShow(nextEl);
    return;
  }
  animateHide(prevEl, () => animateShow(nextEl));
}

function setActiveSectionUI(prev, next) {
  const sections = {
    submit_record: document.getElementById('submitRecordSection'),
    playtest: document.getElementById('playtestSection'),
    submit_map: document.getElementById('submitMapSection'),
  };
  const buttons = {
    submit_record: document.getElementById('submitRecordBtn'),
    playtest: document.getElementById('playtestBtn'),
    submit_map: document.getElementById('submitMapBtn'),
  };

  Object.values(sections).forEach((el) => {
    if (el) el.classList.add('hidden');
  });
  if (sections[next]) sections[next].classList.remove('hidden');

  Object.keys(buttons).forEach((k) => {
    const btn = buttons[k];
    if (!btn) return;
    if (k === next) {
      btn.classList.add('bg-white', 'text-zinc-900');
      btn.classList.remove('text-white', 'hover:bg-white/10');
    } else {
      btn.classList.remove('bg-white', 'text-zinc-900');
      btn.classList.add('text-white', 'hover:bg-white/10');
    }
  });
}

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
    root.className = 'pointer-events-none fixed inset-x-0 bottom-6 z-[9999] flex justify-center px-3';
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

// === Copy-code logging (Utilities) ==========================================
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

/* =========================
   INTERACTIVITY
   ========================= */
function animateSubmitMapSection() {
  const root = document.getElementById('submitMapSection');
  if (!root) return;

  root.classList.add('x-anim');
  __enter(root);

  const cards = root.querySelectorAll('#submitMapForm > .rounded-2xl');
  cards.forEach((card, i) => {
    card.classList.add('pt-card-anim');
    setTimeout(
      () => {
        card.classList.add('pt-in');
      },
      70 * i + 60
    );
  });

  const banner = document.getElementById('bannerDrop');
  if (banner && !banner.dataset.pulsed) {
    banner.dataset.pulsed = '1';
    banner.animate(
      [
        { boxShadow: '0 0 0 0 rgba(16,185,129,0.00)' },
        { boxShadow: '0 0 0 8px rgba(16,185,129,0.12)' },
        { boxShadow: '0 0 0 0 rgba(16,185,129,0.00)' },
      ],
      { duration: 900, easing: 'ease-out' }
    );
  }
}

function animatePlaytestToolbar() {
  const bar = document.querySelector('#playtestSection .toolbar');
  if (!bar) return;
  bar.classList.add('toolbar-anim');
  requestAnimationFrame(() => bar.classList.add('in'));

  const buttons = bar.querySelectorAll('.pt-toolbar-button');
  const baseDelay = 40;
  buttons.forEach((btn, i) => {
    btn.classList.add('pt-card-anim');
    setTimeout(
      () => {
        btn.classList.add('pt-in');
      },
      baseDelay * i + 60
    );
  });
}

function animateSubmitRecordSection() {
  const sec = document.getElementById('submitRecordSection');
  if (!sec) return;
  sec.classList.remove('sr-enter', 'sr-in');
  void sec.offsetWidth;
  sec.classList.add('sr-enter');
  requestAnimationFrame(() => sec.classList.add('sr-in'));

  const code = document.getElementById('mapCodeInput');
  if (code && !code.value) code.focus({ preventScroll: true });
}

function waitForPlaytestCards(timeout = 1200) {
  const container = document.getElementById('playtestCardContainer');
  if (!container) return Promise.resolve();
  if (container.querySelector('.playtest-embed')) return Promise.resolve();

  return new Promise((resolve) => {
    let done = false;
    const obs = new MutationObserver(() => {
      if (container.querySelector('.playtest-embed')) {
        done = true;
        obs.disconnect();
        resolve();
      }
    });
    obs.observe(container, { childList: true });

    setTimeout(() => {
      if (!done) {
        obs.disconnect();
        resolve();
      }
    }, timeout);
  });
}

function renderPlaytestSkeletonCards(count = window.itemsPerPage || 12) {
  const container = document.getElementById('playtestCardContainer');
  if (!container) return;
  if (container.querySelector('[data-skeleton="1"]')) return;

  container.replaceChildren();

  for (let i = 0; i < count; i++) {
    const card = document.createElement('article');
    card.setAttribute('data-skeleton', '1');
    card.className = 'rounded-xl border border-white/10 bg-zinc-900/60 p-3 animate-pulse';

    card.innerHTML = `
      <header class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2 min-w-0">
          <div class="h-8 w-8 rounded-full bg-white/10 ring-1 ring-white/10"></div>
          <div class="space-y-1">
            <div class="h-3 w-36 max-w-[60vw] rounded bg-white/10"></div>
            <div class="h-2.5 w-20 rounded bg-white/10"></div>
          </div>
        </div>
        <div class="h-10 w-24 rounded-md bg-white/10 ring-1 ring-white/10"></div>
      </header>

      <div class="mt-3">
        <div class="h-3 w-48 max-w-[70%] rounded bg-white/10"></div>
        <div class="mt-2 flex items-center justify-between">
          <div class="h-6 w-28 rounded-full bg-white/10"></div>
          <div class="h-5 w-16 rounded-full bg-white/10"></div>
        </div>
      </div>
    `;
    container.appendChild(card);
  }
}

function clearPlaytestSkeletonCards() {
  const container = document.getElementById('playtestCardContainer');
  if (!container) return;
  container.querySelectorAll('[data-skeleton="1"]').forEach((el) => el.remove());
}

function bindPlaytestPaginationSkeleton() {
  if (bindPlaytestPaginationSkeleton.__bound) return;
  bindPlaytestPaginationSkeleton.__bound = true;

  document.addEventListener(
    'click',
    (e) => {
      const target = e.target.closest(
        '#paginationContainer a, #paginationContainer button, #paginationContainer [data-page]'
      );
      if (!target || currentSection !== 'playtest') return;

      if (target.tagName === 'A') e.preventDefault();

      const page = parseTargetPage(target);

      if (typeof window.applyFilters === 'function') {
        window.applyFilters(page);
      } else {
        requestAnimationFrame(() => renderPlaytestSkeletonCards(window.itemsPerPage || 12));
      }
    },
    true
  );
}
document.addEventListener('DOMContentLoaded', bindPlaytestPaginationSkeleton);

function resetPlaytestAnimationMarks() {
  const container = document.getElementById('playtestCardContainer');
  if (!container) return;
  container
    .querySelectorAll('.playtest-embed[data-animated]')
    .forEach((el) => el.removeAttribute('data-animated'));
}

(function hookPlaytestLoading() {
  const tryPatch = () => {
    if (typeof window.applyFilters === 'function' && !window.applyFilters.__skeletonPatched) {
      const _orig = window.applyFilters;

      window.applyFilters = function (page) {
        const p = _orig(page);

        requestAnimationFrame(() => {
          renderPlaytestSkeletonCards(window.itemsPerPage || 12);
        });

        return p
          .then(async (out) => {
            try {
              await waitForPlaytestCards(1500);
            } catch {}
            clearPlaytestSkeletonCards();
            animatePlaytestCardsAndSplitflap();
            return out;
          })
          .catch((e) => {
            clearPlaytestSkeletonCards();
            throw e;
          });
      };

      window.applyFilters.__skeletonPatched = true;
    } else {
      setTimeout(tryPatch, 60);
    }
  };
  tryPatch();
})();

function animatePlaytestCardsAndSplitflap() {
  const container = document.getElementById('playtestCardContainer');
  if (!container) return;
  const cards = container.querySelectorAll('.playtest-embed');
  cards.forEach((card, i) => {
    card.classList.add('pt-card-anim');
    setTimeout(() => card.classList.add('pt-in'), 80 * i);
  });
  if (typeof applySplitFlap === 'function') {
    cards.forEach((card) => {
      const sfEl = card.querySelector('[data-sf]');
      if (sfEl) applySplitFlap(sfEl);
    });
  }
}

const _origApplyFilters = typeof applyFilters === 'function' ? applyFilters : null;
async function applyFiltersWithAnimation(page = 1) {
  closeOpenToolbarOverlays({ animate: true });
  setTimeout(() => applyFilters(page), 140);
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

/* =========================
   AUTOCOMPLETE
   ========================= */
async function fillMechanicsAndRestrictions() {
  if (__mechRestrCache) return __mechRestrCache;
  if (__mechRestrInFlight) return __mechRestrInFlight;

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const toNameArray = (arr) =>
    (Array.isArray(arr) ? arr : [])
      .map((x) => {
        if (typeof x === 'string') return x;
        return String(x?.name ?? x?.label ?? x?.value ?? '').trim();
      })
      .filter(Boolean);

  __mechRestrInFlight = (async () => {
    const maxRetries = 2;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const [restrictionsResponse, mechanicsResponse] = await Promise.all([
          fetch('/api/autocomplete/map-restrictions', { headers: { Accept: 'application/json' } }),
          fetch('/api/autocomplete/map-mechanics', { headers: { Accept: 'application/json' } }),
        ]);

        if (!restrictionsResponse.ok)
          throw new Error(`HTTP ${restrictionsResponse.status} map-restrictions`);
        if (!mechanicsResponse.ok)
          throw new Error(`HTTP ${mechanicsResponse.status} map-mechanics`);

        const restrictionsData = await restrictionsResponse.json();
        const mechanicsData = await mechanicsResponse.json();

        let mechanicsOptions = toNameArray(mechanicsData);
        let restrictionsOptions = toNameArray(restrictionsData);

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
          mechanicsOptions = mechanicsOptions.map((option) => ({
            translated: option,
            raw: option,
          }));
          restrictionsOptions = restrictionsOptions.map((option) => ({
            translated: option,
            raw: option,
          }));
        }

        const result = { mechanicsOptions, restrictionsOptions };
        __mechRestrCache = result;
        return result;
      } catch (err) {
        if (attempt === maxRetries) {
          console.error('Autocomplete mechanics/restrictions failed:', err);
          return { mechanicsOptions: [], restrictionsOptions: [] };
        }
        await wait(300 * (attempt + 1));
      }
    }
  })();

  try {
    return await __mechRestrInFlight;
  } finally {
    __mechRestrInFlight = null;
  }
}

async function loadDynamicOptions() {
  await fillMechanicsAndRestrictions();
}

function setupAutocompleteInline(inputEl, dropdownEl, config = { type: 'creator' }) {
  if (!inputEl || !dropdownEl) return;
  let debounce;

  const typeToKind = (type) => (type === 'creator' ? 'users' : type === 'map' ? 'map-names' : '');

  function show() {
    dropdownEl.classList.remove('hidden');
  }
  function hide() {
    dropdownEl.classList.add('hidden');
  }
  function clear() {
    dropdownEl.innerHTML = '';
  }

  function render(list) {
    clear();
    list.forEach((s) => {
      const d = document.createElement('div');
      d.className =
        'suggestion-item cursor-pointer px-3 py-2 text-sm text-zinc-200 hover:bg-white/10';
      d.textContent = s.label;
      d.addEventListener('click', (e) => {
        e.stopPropagation();
        inputEl.value = s.label;
        if (s.raw != null) inputEl.setAttribute('data-raw-value', String(s.raw));
        inputEl.__autocompleteSuggestions = list.map((x) => ({ display: x.label, raw: x.raw }));
        hide();
        inputEl.blur();
      });
      dropdownEl.appendChild(d);
    });
    list.length ? show() : hide();
  }

  function fetchAndRender(q) {
    const kind = typeToKind(config.type);
    if (!kind) return hide();
    const locale = CURRENT_LANG === 'cn' ? 'cn' : CURRENT_LANG === 'jp' ? 'en' : 'en';
    const url = _buildAutoUrl(kind, { value: q, locale, pageSize: 10 });

    fetch(url, { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : []))
      .then((arr) => {
        const list = (Array.isArray(arr) ? arr : [])
          .map((it) => normalizeSuggestionItem(it, kind))
          .filter(Boolean);
        render(list);
      })
      .catch(() => hide());
  }

  inputEl.addEventListener('input', () => {
    const q = inputEl.value.trim();
    clearTimeout(debounce);
    if (q.length < 2) return hide();
    debounce = setTimeout(() => fetchAndRender(q), 220);
  });

  inputEl.addEventListener('focus', () => {
    const q = inputEl.value.trim();
    if (q.length >= 2) fetchAndRender(q);
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide();
  });

  const outside = (e) => {
    if (e.target !== inputEl && !dropdownEl.contains(e.target)) {
      hide();
      document.removeEventListener('mousedown', outside, true);
    }
  };
  inputEl.addEventListener('focus', () => {
    document.addEventListener('mousedown', outside, true);
  });
}

function renderSuggestionDisplay(item, config) {
  if (config.type === 'creator') {
    return {
      display: item.name,
      raw: item.user_id,
    };
  } else if (config.type === 'map') {
    return {
      display: item.translated_map_name || item.map_name,
      raw: item.map_name,
    };
  }
  return { display: '', raw: '' };
}

function _fallbackGetSuggestionsContainer(containerId, input) {
  let el = document.getElementById(containerId);
  if (!el) {
    el = document.createElement('div');
    el.id = containerId;
    el.className = [
      'suggestions-container',
      'absolute left-0 right-0 top-full mt-1 z-50',
      'rounded-lg border border-white/10 bg-zinc-900/95 text-sm text-zinc-100',
      'shadow-xl ring-1 ring-white/10',
      'max-h-56 overflow-y-auto hidden',
    ].join(' ');

    const wrapper = input.parentElement;
    if (wrapper && getComputedStyle(wrapper).position === 'static') {
      wrapper.classList.add('relative');
    }
    (wrapper || document.body).appendChild(el);
  }
  ['pointerdown', 'mousedown', 'click'].forEach((type) =>
    el.addEventListener(type, (e) => e.stopPropagation())
  );
  return el;
}

function _getSuggestionsContainer(containerId, input) {
  return typeof getSuggestionsContainer === 'function'
    ? getSuggestionsContainer(containerId, input)
    : _fallbackGetSuggestionsContainer(containerId, input);
}

function _buildAutoUrl(kind, opts) {
  return typeof buildAutocompleteUrl === 'function'
    ? buildAutocompleteUrl(kind, opts)
    : (({ value = '', locale = 'en', pageSize = 10 } = {}) => {
        if (kind === 'map-codes')
          return `/api/autocomplete/map-codes?search=${encodeURIComponent(value)}&limit=${pageSize}`;
        if (kind === 'users')
          return `/api/autocomplete/users?value=${encodeURIComponent(value)}&page_size=${pageSize}`;
        if (kind === 'map-names')
          return `/api/autocomplete/map-names/${encodeURIComponent(locale)}?value=${encodeURIComponent(value)}&page_size=${pageSize}`;
        return '';
      })(opts);
}

function normalizeSuggestionItem(item, kind) {
  if (kind === 'map-codes') {
    const code = typeof item === 'string' ? item : item?.code || item?.map_code || '';
    return code ? { label: code, raw: code } : null;
  }

  if (kind === 'users') {
    if (Array.isArray(item) && item.length >= 2) {
      const id = String(item[0]);
      const name = String(item[1] || '').trim();
      return name ? { label: name, raw: id } : null;
    }
    const id = String(item?.id ?? item?.user_id ?? '');
    const name = String(item?.name ?? item?.nickname ?? '').trim();
    return id && name ? { label: name, raw: id } : null;
  }

  if (kind === 'map-names') {
    const raw = String(item?.map_name ?? item?.name ?? '').trim();
    const label = String(item?.translated_map_name ?? raw).trim();
    return raw ? { label, raw } : null;
  }

  return null;
}

function setupAutocomplete(input, { kind, containerId, minChars = 2, pageSize = 10, onPick }) {
  if (!input) return;
  let debounce;
  let lastData = [];

  const suggestions = () => _getSuggestionsContainer(containerId, input);
  const hide = () => {
    const el = document.getElementById(containerId);
    if (el) el.classList.add('hidden');
  };

  function render(list) {
    const box = suggestions();
    box.innerHTML = '';

    if (!list.length) {
      box.classList.add('hidden');
      box.style.display = 'none';
      return;
    }

    list.forEach((s) => {
      const d = document.createElement('div');
      d.className =
        'suggestion-item cursor-pointer px-3 py-2 text-sm text-zinc-200 hover:bg-white/10';
      d.textContent = s.label;
      d.addEventListener('click', (e) => {
        e.stopPropagation();
        onPick?.(s);
        hide();
        input.blur();
      });
      box.appendChild(d);
    });

    box.classList.remove('hidden', 'opacity-0', 'translate-y-2', 'scale-95');
    box.style.display = 'block';
  }

  function fetchAndRender(q) {
    const locale = CURRENT_LANG === 'cn' ? 'cn' : CURRENT_LANG === 'jp' ? 'en' : 'en';
    const url = _buildAutoUrl(kind, { value: q, locale, pageSize });
    if (!url) return hide();

    fetch(url, { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        lastData = arr;
        const normalized = arr
          .map((item) => {
            const n = normalizeSuggestionItem(item, kind);
            return n ? { ...n, original: item } : null;
          })
          .filter(Boolean);
        render(normalized);
      })
      .catch(() => hide());
  }

  input.addEventListener('input', () => {
    const q = input.value.trim();
    clearTimeout(debounce);
    if (q.length < minChars) return hide();
    debounce = setTimeout(() => fetchAndRender(q), 220);
  });

  input.addEventListener('focus', () => {
    const q = input.value.trim();
    if (q.length >= minChars) fetchAndRender(q);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide();
  });
  document.addEventListener(
    'pointerdown',
    (e) => {
      const box = document.getElementById(containerId);
      if (!box) return;
      if (e.target !== input && !box.contains(e.target)) hide();
    },
    true
  );
}

function attachRecordAutocompletes() {
  const mapCodeInput = document.getElementById('mapCodeInput');
  if (mapCodeInput) {
    setupAutocomplete(mapCodeInput, {
      kind: 'map-codes',
      containerId: 'srMapCodeSuggestions',
      onPick: ({ label, raw }) => {
        mapCodeInput.value = label;
        if (raw != null) mapCodeInput.setAttribute('data-raw-value', String(raw));
        hideAllSuggestions();
        mapCodeInput.blur();
      },
    });
  }
}

function attachSubmitMapAutocompletes({
  mainCreatorInputId = 'mainCreatorInput',
  mapNameInputId = 'mapNameInput',
} = {}) {
  // Créateur principal
  const creatorInput = document.getElementById(mainCreatorInputId);
  if (creatorInput) {
    setupAutocomplete(creatorInput, {
      kind: 'users',
      containerId: 'smCreatorSuggestions',
      onPick: ({ label, raw }) => {
        creatorInput.value = label;
        const meta = document.getElementById('metaCreatorMain');
        if (meta) {
          meta.textContent = label;
          meta.setAttribute('data-raw-id', String(raw));
        }

        const box = document.getElementById('smCreatorSuggestions');
        if (box) box.style.display = 'none';
        if (typeof hideAllSuggestions === 'function') hideAllSuggestions();
        creatorInput.blur();
      },
    });
  }

  const mapNameInput = document.getElementById(mapNameInputId);
  if (mapNameInput) {
    setupAutocomplete(mapNameInput, {
      kind: 'map-names',
      containerId: 'smMapNameSuggestions',
      onPick: ({ label, raw }) => {
        mapNameInput.value = label;
        const metaMap = document.getElementById('metaMap');
        if (metaMap) metaMap.textContent = label || raw || 'N/A';

        const box = document.getElementById('smMapNameSuggestions');
        if (box) box.style.display = 'none';
        if (typeof hideAllSuggestions === 'function') hideAllSuggestions();
        mapNameInput.blur();
      },
    });
  }
}

/* =========================
   DROPDOWNS
   ========================= */
function getDropdownListEl(container) {
  return (
    container?.querySelector('.fake-select-list') ||
    container?.querySelector('.custom-multiselect-list') ||
    null
  );
}
function getDropdownBtnEl(container) {
  return container?.querySelector('.fake-select-btn, .custom-multiselect-btn') || null;
}
function _ensureBtnLabelSpan(btn, placeholderText) {
  let labelSpan = btn.querySelector('[data-label]');
  if (!labelSpan) {
    const svg = btn.querySelector('svg');
    const currentText = (btn.textContent || '').trim();
    btn.innerHTML = '';
    labelSpan = document.createElement('span');
    labelSpan.setAttribute('data-label', '1');
    labelSpan.textContent = currentText || placeholderText || 'Select...';
    btn.appendChild(labelSpan);
    if (svg) btn.appendChild(svg);
  }
  return labelSpan;
}
function _hideList(list) {
  if (!list) return;

  if (list.classList.contains('dd-anim')) {
    list.classList.remove('dd-in');
    list.classList.add('dd-out');
    setTimeout(() => {
      list.classList.add('hidden');
      list.classList.remove('dd-out');
      list.style.display = 'none';
    }, 180);
  } else {
    list.classList.add('hidden');
    list.style.display = 'none';
  }
}

function _showList(list) {
  if (!list) return;

  list.classList.remove('hidden', 'dd-out');
  list.style.display = 'block';
  list.style.maxHeight = '260px';
  list.style.overflowY = 'auto';
  list.style.overflowX = 'hidden';
  list.style.webkitOverflowScrolling = 'touch';

  if (list.classList.contains('dd-anim')) {
    requestAnimationFrame(() => list.classList.add('dd-in'));
  }
}

function _closeAllOtherDropdowns(currentContainer) {
  document.querySelectorAll('.fake-select, .custom-multiselect').forEach((cont) => {
    if (cont === currentContainer) return;
    const l = getDropdownListEl(cont);
    if (!l) return;
    _hideList(l);
    cont.removeAttribute('data-open');
  });
}

function populateStaticDropdowns() {
  populateRadioDropdown(
    'difficultyDropdown',
    DIFFICULTY_FINE_OPTIONS,
    'difficulty',
    t('filters.difficulty')
  );
  populateRadioDropdown('categoryDropdown', CATEGORY_OPTIONS, 'category', t('filters.map_type'));
}

function populateRadioDropdown(dropdownId, options, groupName, placeholder) {
  const container = document.getElementById(dropdownId);
  const list = getDropdownListEl(container);
  if (!list) return;

  list.innerHTML = '';
  const isDifficulty = groupName === 'difficulty';

  (options || []).forEach((opt) => {
    const displayText = typeof opt.text === 'function' ? opt.text() : opt.text || opt.value || '';
    const raw = opt.value || opt.raw || displayText;

    const label = document.createElement('label');
    label.className = isDifficulty
      ? 'flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-200 cursor-pointer hover:bg-white/10 focus:bg-white/10'
      : 'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5 cursor-pointer';

    if (isDifficulty) {
      label.innerHTML = `
        <input type="radio" name="${groupName}" value="${raw}" class="accent-emerald-500 sr-only">
        <span class="inline-block h-2.5 w-2.5 rounded-full ${difficultyDotClass(displayText)} ring-1 ring-inset ring-white/20"></span>
        <span class="truncate">${displayText}</span>
      `;
    } else {
      label.innerHTML = `
        <input type="radio" name="${groupName}" value="${raw}" class="accent-emerald-500">
        <span>${displayText}</span>
      `;
    }

    list.appendChild(label);
  });

  _hideList(list);

  const btn = getDropdownBtnEl(container);
  if (btn) _ensureBtnLabelSpan(btn, placeholder);
}

function populateCheckboxDropdown(dropdownId, options, inputName) {
  const container = document.getElementById(dropdownId);
  const list = getDropdownListEl(container);
  if (!list) return;

  list.innerHTML = '';
  (options || []).forEach((opt) => {
    const displayText = opt.translated || opt.text || opt.value || '';
    const raw = opt.raw || opt.value || displayText;
    const label = document.createElement('label');
    label.className =
      'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5 cursor-pointer';
    label.innerHTML = `
      <input type="checkbox" name="${inputName}" value="${raw}" class="accent-emerald-500">
      <span>${displayText}</span>
    `;
    list.appendChild(label);
  });

  _hideList(list);

  const btn = getDropdownBtnEl(container);
  if (btn) _ensureBtnLabelSpan(btn, btn.getAttribute('data-placeholder') || 'Select...');
}

async function setupAllCustomDropdowns() {
  populateStaticDropdowns();

  const { mechanicsOptions, restrictionsOptions } = await fillMechanicsAndRestrictions();
  populateCheckboxDropdown('mechanicsDropdown', mechanicsOptions, 'mechanics[]');
  populateCheckboxDropdown('restrictionsDropdown', restrictionsOptions, 'restrictions[]');

  setupFakeSelect('difficultyDropdown', t('filters.difficulty') || 'Select...');
  setupFakeSelect('categoryDropdown', t('filters.map_type') || 'Select...');
  setupFakeSelect('mechanicsDropdown', t('filters.mechanics') || 'Select...');
  setupFakeSelect('restrictionsDropdown', t('filters.restrictions') || 'Select...');
}

function setupFakeSelect(id, placeholderText = 'Select...') {
  const container = document.getElementById(id);
  if (!container) return;

  const btn = getDropdownBtnEl(container);
  const list = getDropdownListEl(container);
  if (!btn || !list) return;

  if (container.dataset.fakeSelectMounted === '1') {
    _hideList(list);
    return;
  }
  container.dataset.fakeSelectMounted = '1';

  if (!btn.getAttribute('data-placeholder')) btn.setAttribute('data-placeholder', placeholderText);
  const labelSpan = _ensureBtnLabelSpan(btn, placeholderText);
  _hideList(list);
  btn.classList.add('cursor-pointer');
  list.classList.add('dropdown-list', 'dd-anim');

  const open = () => {
    const ae = document.activeElement;
    if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) ae.blur();
    hideAllSuggestions();
    _closeAllOtherDropdowns(container);
    _showList(list);
    container.setAttribute('data-open', '1');

    const outside = (ev) => {
      if (!container.contains(ev.target)) {
        hideAllSuggestions();
        close();
        document.removeEventListener('mousedown', outside, true);
      }
    };
    document.addEventListener('mousedown', outside, true);
  };

  const close = () => {
    _hideList(list);
    hideAllSuggestions();
    container.removeAttribute('data-open');
  };

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    hideAllSuggestions();
    if (container.getAttribute('data-open') === '1') close();
    else open();
  });

  list.addEventListener('change', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;

    updateButtonLabel();
    hideAllSuggestions();
    if (target.type === 'radio') close();
  });

  function updateButtonLabel() {
    const radios = list.querySelectorAll('input[type="radio"]');
    const checkboxes = list.querySelectorAll('input[type="checkbox"]');

    if (radios.length) {
      const sel = Array.from(radios).find((r) => r.checked);
      const text = sel ? (sel.closest('label')?.textContent || sel.value).trim() : null;

      if (container.id === 'difficultyDropdown' && text) {
        const dot = `<span class="inline-block h-2.5 w-2.5 rounded-full ${difficultyDotClass(text)} ring-1 ring-inset ring-white/20"></span>`;
        labelSpan.innerHTML = `<span class="inline-flex items-center gap-2">${dot}<span class="truncate">${text}</span></span>`;
      } else {
        labelSpan.textContent = text || btn.getAttribute('data-placeholder') || placeholderText;
      }
    } else if (checkboxes.length) {
      const checked = Array.from(checkboxes).filter((c) => c.checked);
      if (checked.length === 0) {
        labelSpan.textContent = btn.getAttribute('data-placeholder') || placeholderText;
      } else if (checked.length <= 2) {
        labelSpan.textContent = checked
          .map((c) => (c.closest('label')?.textContent || c.value).trim())
          .join(', ');
      } else {
        labelSpan.textContent = `${checked.length} selected`;
      }
    } else {
      labelSpan.textContent = btn.getAttribute('data-placeholder') || placeholderText;
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const isOpen = container.getAttribute('data-open') === '1';
      if (isOpen) {
        e.preventDefault();
        close();
      }
    }
  });

  updateButtonLabel();
}

/* =========================
   FORM HANDLERS
   ========================= */
function setupForms() {
  // --- SUBMIT RECORD ---
  const submitRecordForm = document.getElementById('submitRecordForm');
  if (submitRecordForm && submitRecordForm.dataset.bound !== '1') {
    submitRecordForm.dataset.bound = '1';
    disableBrowserAutocompleteInSubmitRecord();

    submitRecordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAllSuggestions();

      if (!validateSubmitRecordForm(e)) return;

      const submitBtn = submitRecordForm.querySelector('button[type="submit"]');
      const cancelBtn =
        document.querySelector('.cancel-btn[form="submitRecordForm"]') ||
        submitRecordForm.querySelector('.cancel-btn');

      const submittedCode = (document.getElementById('mapCodeInput')?.value || '').trim();

      if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.loading = '1'; }
      if (cancelBtn) { cancelBtn.disabled = true; cancelBtn.dataset.loading = '1'; }

      try {
        const result = await sendCompletionToApi();
        if (!result || result.error) {
          showErrorMessage(result?.error || t('errors.server_unreachable') || 'Erreur serveur');
          return;
        }
        showConfirmationMessage(t('record.confirm'));
        resetForms(submitRecordForm);
        if (submittedCode) ensureViewModalButtonForLastCode(submittedCode);
      } catch (err) {
        console.error(err);
        showErrorMessage(t('errors.server_unreachable') || 'Erreur réseau');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('data-loading');
        }
        if (cancelBtn) {
          cancelBtn.disabled = false;
          cancelBtn.removeAttribute('data-loading');
        }
      }
    });
  }

  // --- SUBMIT PLAYTEST ---
  const playtestForm = document.getElementById('playtestForm');
  if (playtestForm && playtestForm.dataset.bound !== '1') {
    playtestForm.dataset.bound = '1';
    playtestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      resetForms(playtestForm);
    });
  }

  // --- SUBMIT MAP ---
  const submitMapForm = document.getElementById('submitMapForm');
  if (submitMapForm && submitMapForm.dataset.bound !== '1') {
    submitMapForm.dataset.bound = '1';
    submitMapForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (IS_GUEST) {
        showWarningMessage(
          t('popup.login_required_msg'));
        return;
      }
      const ok = await validateSubmitMapForm(e);
      if (!ok) return;
      try {
        const result = await sendMapToApi();
        if (result?.error) {
          showErrorMessage(result.error);
          return;
        }
        showConfirmationMessage(t('map.confirm'));
        resetForms(submitMapForm);
        ['metaCheckpoints', 'metaMap', 'metaCode', 'optDescription', 'optGuide'].forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.textContent = 'N/A';
        });
      } catch (err) {
        console.error(err);
        showErrorMessage(t('errors.server_unreachable'));
      }
    });
  }

  document.querySelectorAll('.cancel-btn').forEach((btn) => {
    if (btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const formId = btn.getAttribute('form');
      const form = formId ? document.getElementById(formId) : btn.closest('form');
      if (!form) return;

      resetForms(form);

      ['metaCheckpoints', 'metaMap', 'metaCode', 'optDescription', 'optGuide'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = 'N/A';
      });

      form.querySelectorAll('.custom-multiselect').forEach((dropdown) => {
        dropdown.classList.remove('open');
        const list = dropdown.querySelector('.custom-multiselect-list');
        if (list) list.classList.remove('show');
      });
    });
  });
}

function resetForms(form) {
  form.reset();

  form.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach((el) => {
    el.checked = false;
  });

  form.querySelectorAll('.fake-select, .custom-multiselect').forEach((dropdown) => {
    const btn = getDropdownBtnEl(dropdown);
    const list = getDropdownListEl(dropdown);
    if (btn) {
      const placeholder =
        btn.getAttribute('data-placeholder') || btn.getAttribute('placeholder') || 'Select...';
      const span = _ensureBtnLabelSpan(btn, placeholder);
      span.textContent = placeholder;
    }
    if (list) _hideList(list);
    dropdown.removeAttribute('data-open');
  });

  const qRoot = document.getElementById('qualityDropdown');
  if (qRoot) resetQualitySlider(qRoot);

  hideAllSuggestions();
  form.reset();

  const dropzone = document.getElementById('screenshotDrop');
  if (dropzone) {
    dropzone.innerHTML = `
      <input type="file" id="screenshotInput" name="screenshot" accept="image/*" class="hidden">
      <div id="screenshotPlaceholder" class="screenshot-placeholder">
        <span>${t('record.drag_and_drop')}</span>
      </div>
    `;
    dragAndDrop();
  }
  window.screenshotFile = null;
  window.screenshotUrl = null;

  const bdz = document.getElementById('bannerDrop');
  if (bdz) resetBannerDropzone();
  window.customBannerUrl = null;

  const titleInput = document.getElementById('optTitleInput');
  if (titleInput) titleInput.value = '';

  const mg = document.getElementById('medalGoldInput');
  const ms = document.getElementById('medalSilverInput');
  const mb = document.getElementById('medalBronzeInput');
  if (mg) mg.value = '';
  if (ms) ms.value = '';
  if (mb) mb.value = '';
  const sbtn = form.querySelector('button[type="submit"]');
  if (sbtn) {
    sbtn.disabled = false;
    sbtn.removeAttribute('data-loading');
  }
  const cbtnAttr = document.querySelector(`.cancel-btn[form="${form.id}"]`);
  const cbtn = cbtnAttr || form.querySelector('.cancel-btn');
  if (cbtn) {
    cbtn.disabled = false;
    cbtn.removeAttribute('data-loading');
  }
}

/* =========================
   HELPERS SEND MAP
   ========================= */
function difficultyDotClass(label) {
  const L = String(label).toLowerCase();
  if (L.startsWith('easy')) return 'bg-emerald-400';
  if (L.startsWith('medium')) return 'bg-yellow-400';
  if (L.startsWith('very hard')) return 'bg-orange-500';
  if (L.startsWith('hard') && !L.startsWith('very')) return 'bg-orange-400';
  if (L.startsWith('extreme')) return 'bg-red-500';
  if (L.startsWith('hell')) return 'bg-rose-500';
  return 'bg-zinc-400';
}

function firstHttpUrlOrNull(text) {
  if (!text) return null;
  const lines = String(text)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const raw of lines) {
    if (/^n\/?a$/i.test(raw) || raw === '—') continue;

    let v = raw;
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(v) && /\./.test(v)) v = `https://${v}`;

    try {
      const u = new URL(v);
      const hostOk = u.hostname === 'localhost' || u.hostname.includes('.');
      if ((u.protocol === 'http:' || u.protocol === 'https:') && hostOk) {
        return u.toString();
      }
    } catch {
      /* ignore invalid */
    }
  }
  return null;
}

function setupBannerDropzone() {
  const drop = document.getElementById('bannerDrop');
  const input = document.getElementById('bannerInput');
  if (!drop || !input) return;

  const pick = () => input.click();

  const readAsDataURL = (file) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });

  const setPreview = async (file) => {
    drop.innerHTML = `
      <div class="absolute inset-0">
        <!-- l'image est injectée via JS pour pouvoir gérer load/error -->
      </div>
      <div class="absolute inset-x-0 bottom-0 p-2 flex items-center justify-between bg-black/40 backdrop-blur">
        <span class="text-xs text-white/90 truncate px-1">${file.name}</span>
        <button type="button" id="bannerRemoveBtn" class="rounded-md cursor-pointer border border-white/20 px-2 py-1 text-xs text-white hover:bg-white/10">
          ${t('map.remove')}
        </button>
      </div>
    `;

    const imgHost = drop.firstElementChild;
    const img = new Image();
    img.id = 'bannerPreview';
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
          showErrorMessage(t('errors.upload_failed'));
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
        showErrorMessage(t('errors.upload_failed'));
      }
    }

    imgHost.appendChild(img);

    document.getElementById('bannerRemoveBtn')?.addEventListener('click', resetBannerDropzone);
  };

  const acceptFile = (file) => {
    if (!file) return;

    if (!BANNER_ALLOWED_MIME.includes(file.type)) {
      showErrorMessage(t('errors.image_type'));
      return;
    }
    if (file.size > BANNER_MAX_BYTES) {
      showWarningMessage(t('errors.image_too_large'));
      return;
    }

    window.customBannerFile = file;
    setPreview(file);
    startBannerUpload(file);
  };

  input.addEventListener('change', (e) => acceptFile(e.target.files?.[0]));
  drop.addEventListener('click', pick);

  drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    drop.classList.add('ring-2', 'ring-emerald-500/60');
  });
  drop.addEventListener('dragleave', () => {
    drop.classList.remove('ring-2', 'ring-emerald-500/60');
  });
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.classList.remove('ring-2', 'ring-emerald-500/60');
    const file = e.dataTransfer?.files?.[0];
    acceptFile(file);
  });
}

function setupMedalsInputs() {
  ['#medalGoldInput', '#medalSilverInput', '#medalBronzeInput'].forEach((sel) => {
    forceDotDecimalInput(sel);
  });
}

function readMedalsInputs() {
  const g = (document.getElementById('medalGoldInput')?.value || '').trim();
  const s = (document.getElementById('medalSilverInput')?.value || '').trim();
  const b = (document.getElementById('medalBronzeInput')?.value || '').trim();
  if (!g && !s && !b) return null;
  return { g, s, b };
}

function validateMedals(showToast = true) {
  const raw = readMedalsInputs();
  if (!raw) return { ok: true, values: null };

  const msgs = {
    missing: t('map.val.medals_missing') || 'Please fill all three medal values.',
    pattern:
      t('map.val.medals_pattern') ||
      'Medals must match 1–5 digits and up to 2 decimals (e.g. 12345.67).',
    order: t('map.val.medals_order') || 'Ordering must be Bronze > Silver > Gold.',
  };

  const ids = {
    g: 'medalGoldInput',
    s: 'medalSilverInput',
    b: 'medalBronzeInput',
  };

  if (!raw.g || !raw.s || !raw.b) {
    if (showToast) showErrorMessage(msgs.missing);
    const missId = !raw.g ? ids.g : !raw.s ? ids.s : ids.b;
    document.getElementById(missId)?.focus();
    return { ok: false, error: msgs.missing };
  }

  for (const [k, v] of Object.entries(raw)) {
    if (!TIME_REGEX.test(v)) {
      if (showToast) showErrorMessage(msgs.pattern);
      document.getElementById(ids[k])?.focus();
      return { ok: false, error: msgs.pattern };
    }
    if (Number(v) < 0) {
      if (showToast)
        showWarningMessage(t('map.val.medals_non_negative'));
      document.getElementById(ids[k])?.focus();
      return {
        ok: false,
        error: t('map.val.medals_non_negative')};
    }
  }

  const gold = Number(raw.g);
  const silver = Number(raw.s);
  const bronze = Number(raw.b);

  if (!(bronze > silver && silver > gold)) {
    if (showToast) showErrorMessage(msgs.order);
    const focusId = !(bronze > silver) ? ids.b : ids.s;
    document.getElementById(focusId)?.focus();
    return { ok: false, error: msgs.order };
  }

  return { ok: true, values: { gold, silver, bronze } };
}

function resetBannerDropzone() {
  const drop = document.getElementById('bannerDrop');
  if (!drop) return;
  window.customBannerFile = null;
  window.customBannerUrl = null;
  drop.innerHTML = `
    <input id="bannerInput" type="file" accept="image/*" class="hidden">
    <div id="bannerPlaceholder" class="text-sm text-zinc-300 px-3 text-center select-none">
      ${t('record.drag_and_drop') || 'Drag & drop or click to upload'}
      <div class="text-[11px] text-zinc-400 mt-1">${t('map.banner_hint') || 'Recommended 16:9. JPG/PNG/WebP/AVIF, max 8MB.'}</div>
    </div>
  `;
  setupBannerDropzone();
}

async function uploadImageGeneric(file) {
  if (!BANNER_ALLOWED_MIME.includes(file.type)) throw new Error('Format non supporté…');
  if (file.size > BANNER_MAX_BYTES) throw new Error('Fichier trop volumineux…');

  const fd = new FormData();
  fd.append('file', file, filenameWithExt(file, 'image'));

  const resp = await fetch(IMAGE_UPLOAD_ENDPOINT, {
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

function showBusy(el) {
  if (!el) return () => {};
  const o = document.createElement('div');
  o.className = 'absolute inset-0 grid place-items-center bg-black/40 backdrop-blur-sm';
  o.innerHTML = `<div class="rounded-md border border-white/10 bg-zinc-900/80 px-3 py-1.5 text-sm text-zinc-100">Uploading…</div>`;
  el.appendChild(o);
  return () => o.remove();
}

async function startBannerUpload(file) {
  const drop = document.getElementById('bannerDrop');
  const endBusy = showBusy(drop);
  try {
    const url = await uploadImageGeneric(file);
    window.customBannerUrl = url;
    const ok = document.createElement('div');
    ok.className =
      'absolute top-2 right-2 rounded bg-emerald-500/90 text-xs text-white px-2 py-0.5 shadow';
    ok.textContent = 'Uploaded';
    drop.appendChild(ok);
    setTimeout(() => ok.remove(), 1500);
  } catch (e) {
    window.customBannerUrl = null;
    showErrorMessage(e?.message || t('errors.upload_failed'));
  } finally {
    endBusy();
  }
}

function bindSubmitMapEditButtons(root = document) {
  const container =
    root instanceof HTMLElement ? root : document.getElementById('submitMapSection');

  if (!container || container.__editBound) return;
  container.__editBound = true;

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-edit-target]');
    if (!btn) return;
    e.preventDefault();
    const id = btn.getAttribute('data-edit-target');
    if (typeof editInline === 'function') editInline(id);
  });
}

function hideAllSuggestions() {
  document.querySelectorAll('.pt-suggestions-container').forEach((el) => __animateOutAndRemove(el));
}

async function loadMainCreatorFromUserId(user_id) {
  const main = document.getElementById('metaCreatorMain');
  if (!main) return;
  if (!user_id) {
    main.textContent = 'N/A';
    main.removeAttribute('data-raw-id');
    return;
  }
  try {
    const resp = await fetch(`/api/users/${encodeURIComponent(user_id)}/overwatch`, {
      headers: { Accept: 'application/json' },
    });
    const data = await resp.json();

    if (data && typeof data.primary === 'string' && data.primary.trim()) {
      main.textContent = data.primary.trim();
      main.setAttribute('data-raw-id', String(user_id));
      return;
    }

    if (data && Array.isArray(data.usernames) && data.usernames.length > 0) {
      const unameObj = data.usernames.find((u) => u.is_primary) || data.usernames[0];
      if (unameObj && unameObj.username) {
        main.textContent = unameObj.username;
        main.setAttribute('data-raw-id', String(user_id));
        return;
      }
    }
  } catch (e) {}
  main.textContent = 'N/A';
  main.removeAttribute('data-raw-id');
}

async function primeMainCreatorFromSession() {
  try {
    if (typeof user_id === 'undefined' || user_id == null) return;
    await loadMainCreatorFromUserId(String(user_id));
  } catch {
    /* no-op */
  }
}

function renderSecondaryCreators() {
  const metaCol = document.getElementById('metaCreatorsCol');
  const mainRow = metaCol?.querySelector('.main-creator-row');
  const addBtn = document.getElementById('addCreatorBtn');

  if (!metaCol || !mainRow) return;

  const prevInputRow = metaCol.querySelector('.creator-secondary input');
  if (addingSecondaryCreator && prevInputRow) {
    prevInputRow.closest('span').remove();
    addingSecondaryCreator = false;
  }

  while (mainRow.nextSibling) {
    metaCol.removeChild(mainRow.nextSibling);
  }

  secondaryCreators.forEach((creator, idx) => {
    let row = document.createElement('span');
    row.className = 'meta-value creator-secondary';

    let nameSpan = document.createElement('span');
    nameSpan.textContent = creator.name;
    nameSpan.setAttribute('data-raw-id', creator.user_id);

    let actions = document.createElement('span');
    actions.className = 'creator-secondary-actions';

    let editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'block-edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editSecondaryCreator(idx);

    let removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'delete-btn';
    removeBtn.textContent = '×';
    removeBtn.title = 'Delete';
    removeBtn.onclick = () => {
      secondaryCreators.splice(idx, 1);
      renderSecondaryCreators();
    };

    actions.appendChild(editBtn);
    actions.appendChild(removeBtn);

    row.appendChild(nameSpan);
    row.appendChild(actions);

    metaCol.appendChild(row);
  });

  addBtn.disabled = secondaryCreators.length >= 2;
}

function showAddSecondaryCreatorInput() {
  const metaCol = document.getElementById('metaCreatorsCol');
  const row = document.createElement('span');
  row.className = 'meta-value creator-secondary';
  row.classList.add('flex', 'gap-2');

  const input = document.createElement('input');
  input.type = 'text';
  input.autocomplete = 'off';
  input.style.width = '150px';

  const sug = document.createElement('div');
  sug.className = 'suggestions-dropdown';
  sug.style.display = 'none';
  sug.style.position = 'absolute';
  sug.style.minWidth = '140px';

  const wrapper = document.createElement('span');
  wrapper.style.position = 'relative';
  wrapper.appendChild(input);
  wrapper.appendChild(sug);

  row.appendChild(wrapper);

  const save = document.createElement('button');
  save.type = 'button';
  save.textContent = 'Save';
  save.className = 'edit-btn accept-btn';
  save.onclick = () => {
    let val = input.value.trim();
    if (!val) {
      input.focus();
      return;
    }
    let user_id = input.getAttribute('data-raw-value') || '';
    if (!user_id) user_id = val;
    secondaryCreators.push({ name: val, user_id });
    addingSecondaryCreator = false;
    renderSecondaryCreators();
  };
  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.textContent = 'Cancel';
  cancel.className = 'edit-btn cancel-btn';
  cancel.onclick = () => {
    row.remove();
    addingSecondaryCreator = false;
  };

  const buttonsBox = document.createElement('span');
  buttonsBox.className = 'inline-edit-buttons';
  buttonsBox.appendChild(save);
  buttonsBox.appendChild(cancel);

  row.appendChild(buttonsBox);

  const allSecondaries = metaCol.querySelectorAll('.meta-value.creator-secondary');
  if (allSecondaries.length > 0) {
    allSecondaries[allSecondaries.length - 1].after(row);
  } else {
    const mainRow = metaCol.querySelector('.main-creator-row');
    if (mainRow && mainRow.nextSibling) {
      metaCol.insertBefore(row, mainRow.nextSibling);
    } else {
      metaCol.appendChild(row);
    }
  }

  setupAutocompleteInline(input, sug, { type: 'creator' });

  input.focus();

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') save.click();
    if (e.key === 'Escape') cancel.click();
  });
}

function editSecondaryCreator(idx) {
  const metaCol = document.getElementById('metaCreatorsCol');
  const rows = Array.from(metaCol.querySelectorAll('.meta-value.creator-secondary')).filter(
    (row) => !row.querySelector('input[type="text"]')
  );
  const row = rows[idx];
  if (!row) return;

  const origName = row.querySelector('span[data-raw-id]');
  const removeBtn = row.querySelector('button.delete-btn');

  const input = document.createElement('input');
  input.type = 'text';
  input.value = secondaryCreators[idx].name;
  input.autocomplete = 'off';
  input.style.width = '150px';

  const sug = document.createElement('div');
  sug.className = 'suggestions-dropdown';
  sug.style.display = 'none';
  sug.style.position = 'absolute';
  sug.style.minWidth = '140px';

  const wrapper = document.createElement('span');
  wrapper.style.position = 'relative';
  wrapper.appendChild(input);
  wrapper.appendChild(sug);

  const save = document.createElement('button');
  save.type = 'button';
  save.textContent = 'Save';
  save.className = 'edit-btn accept-btn';
  save.onclick = () => {
    let val = input.value.trim();
    if (!val) return input.focus();
    let user_id = input.getAttribute('data-raw-value') || val;
    secondaryCreators[idx] = { name: val, user_id };
    renderSecondaryCreators();
  };

  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.textContent = 'Cancel';
  cancel.className = 'edit-btn cancel-btn';
  cancel.onclick = renderSecondaryCreators;

  const buttonsBox = document.createElement('span');
  buttonsBox.className = 'inline-edit-buttons';
  buttonsBox.appendChild(save);
  buttonsBox.appendChild(cancel);

  const editRow = document.createElement('span');
  editRow.className = 'meta-value creator-secondary';
  editRow.classList.add('flex', 'items-end', 'gap-2');
  editRow.appendChild(wrapper);
  editRow.appendChild(buttonsBox);

  row.replaceWith(editRow);

  setupAutocompleteInline(input, sug, { type: 'creator' });

  input.focus();
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') save.click();
    if (e.key === 'Escape') cancel.click();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addCreatorBtn');
  if (addBtn) {
    addBtn.onclick = function () {
      if (secondaryCreators.length >= 2 || addingSecondaryCreator) return;
      addingSecondaryCreator = true;
      showAddSecondaryCreatorInput();
    };
  }
  renderSecondaryCreators();
});

async function validateSubmitMapForm(event) {
  const form = document.getElementById('submitMapForm');
  let valid = true;

  const mainCreator = document.getElementById('metaCreatorMain');
  if (!mainCreator || !mainCreator.getAttribute('data-raw-id')) {
    showWarningMessage(t('map.val.creator'));
    valid = false;
    return false;
  }

  const codeLabel = document.getElementById('metaCode');
  if (!codeLabel || !codeLabel.textContent.trim() || codeLabel.textContent.trim() === 'N/A') {
    showWarningMessage(t('map.val.map_code'));
    valid = false;
    return false;
  }

  const enteredCode = codeLabel.textContent.trim();
  const alreadyExists = await checkMapCodeAlreadyExists(enteredCode);
  if (alreadyExists) {
    showWarningMessage(t('map.val.map_code_already_exist'));
    try {
      if (typeof editInline === 'function') editInline('metaCode');
    } catch {}
    return false;
  }

  const mapLabel = document.getElementById('metaMap');
  if (!mapLabel || !mapLabel.textContent.trim() || mapLabel.textContent.trim() === 'N/A') {
    showWarningMessage(t('map.val.map_name'));
    valid = false;
    return false;
  }

  const checkpointsLabel = document.getElementById('metaCheckpoints');
  if (
    !checkpointsLabel ||
    !checkpointsLabel.textContent.trim() ||
    isNaN(checkpointsLabel.textContent.trim()) ||
    Number(checkpointsLabel.textContent.trim()) <= 0
  ) {
    showWarningMessage(t('map.val.checkpoints'));
    valid = false;
    return false;
  }

  const diffRadios = document.querySelectorAll('#difficultyDropdown input[type="radio"]');
  const hasDiff = Array.from(diffRadios).some((r) => r.checked);
  if (!hasDiff) {
    showWarningMessage(t('map.val.difficulty'));
    valid = false;
    return false;
  }

  const typeRadios = document.querySelectorAll('#categoryDropdown input[type="radio"]');
  const hasType = Array.from(typeRadios).some((r) => r.checked);
  if (!hasType) {
    showWarningMessage(t('map.val.map_type'));
    valid = false;
    return false;
  }

  const mechanicsBoxes = document.querySelectorAll('#mechanicsDropdown input[type="checkbox"]');
  const hasMechanics = Array.from(mechanicsBoxes).some((c) => c.checked);
  if (!hasMechanics) {
    showWarningMessage(t('map.val.mechanics'));
    valid = false;
    return false;
  }

  const restrictionsBoxes = document.querySelectorAll(
    '#restrictionsDropdown input[type="checkbox"]'
  );
  const hasRestrictions = Array.from(restrictionsBoxes).some((c) => c.checked);
  if (!hasRestrictions) {
    showWarningMessage(t('map.val.restrictions'));
    valid = false;
    return false;
  }

  const medalCheck = validateMedals(true);
  if (!medalCheck.ok) {
    return false;
  }
  return true;
}

function normalizeMapCode(v) {
  return String(v || '').replace(/[\s\-_]/g, '').toUpperCase();
}

async function checkMapCodeAlreadyExists(inputCode) {
  const q = (inputCode || '').trim();
  if (!q) return false;

  const url = _buildAutoUrl('map-codes', { value: q, pageSize: 15 });
  try {
    const r = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!r.ok) return false;

    const data = await r.json();
    const normalizedInput = normalizeMapCode(q);

    const list = (Array.isArray(data) ? data : [])
      .map((it) => normalizeSuggestionItem(it, 'map-codes'))
      .filter(Boolean);

    return list.some((s) => normalizeMapCode(s?.raw || s?.label) === normalizedInput);
  } catch {
    return false;
  }
}

/* =========================
   INLINE EDIT SEND MAP
   ========================= */
function findCommonAncestor(a, b) {
  if (!a || !b) return null;
  const seen = new Set();
  let x = a;
  while (x) {
    seen.add(x);
    x = x.parentElement;
  }
  let y = b;
  while (y) {
    if (seen.has(y)) return y;
    y = y.parentElement;
  }
  return null;
}

function editInline(field) {
  const label = document.getElementById(field);
  if (!label) return;
  if (label.classList.contains('editing')) return;

  const text = (label.textContent || '').trim();
  label.classList.add('editing');

  const editBtnEl = document.querySelector(`[data-edit-target="${CSS.escape(field)}"]`);

  const hostRow = editBtnEl
    ? findCommonAncestor(label, editBtnEl) || label.parentElement
    : label.parentElement;
  const hostParent = hostRow?.parentElement || label.parentElement;

  let input, suggestionsDropdown;

  if (field === 'optDescription' || field === 'optGuide') {
    input = document.createElement('textarea');
    input.rows = 3;
    input.className = [
      'w-full max-w-full min-w-0',
      'rounded-lg border border-white/10 bg-zinc-900/70',
      'px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500',
      'shadow-lg ring-1 ring-white/10',
      'focus:outline-none focus:ring-2 focus:ring-emerald-500/60',
      'resize-y',
    ].join(' ');
  } else if (field === 'metaCheckpoints') {
    input = document.createElement('input');
    input.type = 'number';
    input.className = [
      'w-28 max-w-full',
      'rounded-lg border border-white/10 bg-zinc-900/70',
      'px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500',
      'shadow-lg ring-1 ring-white/10',
      'focus:outline-none focus:ring-2 focus:ring-emerald-500/60',
    ].join(' ');
  } else {
    input = document.createElement('input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.className = [
      'min-w-[12rem] max-w-full',
      'rounded-lg border border-white/10 bg-zinc-900/70',
      'px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500',
      'shadow-lg ring-1 ring-white/10',
      'focus:outline-none focus:ring-2 focus:ring-emerald-500/60',
    ].join(' ');

    if (field === 'metaCreator' || field === 'metaMap') {
      input.id = field === 'metaCreator' ? 'creatorInputInline' : 'mapInputInline';
      suggestionsDropdown = document.createElement('div');
      suggestionsDropdown.className = [
        'suggestions-dropdown',
        'absolute left-0 right-0 top-full z-50 mt-1',
        'rounded-lg border border-white/10 bg-zinc-900/95',
        'shadow-2xl ring-1 ring-white/10 backdrop-blur',
        'max-h-56 overflow-y-auto hidden',
      ].join(' ');
    }
  }

  if (field !== 'metaCreator') input.value = text === 'N/A' ? '' : text;

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.textContent = 'Save';
  saveBtn.className = [
    'inline-flex items-center gap-1',
    'rounded-lg border border-emerald-400/30',
    'bg-emerald-500 text-zinc-900',
    'px-3 py-1.5 text-sm font-medium cursor-pointer',
    'hover:bg-emerald-400',
    'focus:outline-none focus:ring-2 focus:ring-emerald-500/60',
    'shadow-md',
  ].join(' ');

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className = [
    'inline-flex items-center gap-1',
    'rounded-lg border border-white/10',
    'bg-white/5 text-zinc-200',
    'px-3 py-1.5 text-sm font-medium cursor-pointer',
    'hover:bg-white/10',
    'focus:outline-none focus:ring-2 focus:ring-zinc-400/40',
    'shadow-md',
  ].join(' ');

  const inputWrap = document.createElement('div');
  inputWrap.className = 'relative flex-1 min-w-[12rem] max-w-full';
  inputWrap.appendChild(input);
  if (suggestionsDropdown) inputWrap.appendChild(suggestionsDropdown);

  const buttonsBox = document.createElement('div');
  buttonsBox.className = 'inline-edit-buttons flex flex-wrap items-center gap-2';
  buttonsBox.appendChild(saveBtn);
  buttonsBox.appendChild(cancelBtn);

  const container = document.createElement('div');
  container.className = [
    'inline-edit-container',
    'mt-2 w-full max-w-full',
    'flex flex-wrap items-start gap-2',
    'rounded-xl border border-white/10 bg-white/5',
    'px-2.5 py-2 ring-1 ring-white/5',
  ].join(' ');
  container.appendChild(inputWrap);
  container.appendChild(buttonsBox);

  label.style.display = 'none';
  if (editBtnEl) editBtnEl.style.display = 'none';
  if (hostRow && hostRow.parentNode) {
    hostRow.insertAdjacentElement('afterend', container);
  } else {
    label.parentNode.insertBefore(container, label.nextSibling);
  }
  input.focus();

  function validateEdit() {
    let newValue = (input.value || '').trim();

    if (field === 'metaMap') {
      const sugg = input.__autocompleteSuggestions || [];
      const match = sugg.some(
        (item) =>
          (item.display || '').toLowerCase().trim() === newValue.toLowerCase().trim() ||
          (item.raw || '').toLowerCase().trim() === newValue.toLowerCase().trim()
      );
      if (!match) {
        showErrorMessage(t('popup.no_results'));
        input.focus();
        return;
      }
    }
    if (field === 'optGuide' && newValue === '') newValue = 'N/A';
    if (field === 'optDescription' && newValue === '') newValue = t('map.no_description');
    if (field === 'metaCheckpoints') {
      if (newValue === '' || isNaN(newValue) || Number(newValue) < 0) {
        input.focus();
        return;
      }
    }

    label.textContent = newValue;
    closeEdit();
  }

  function closeEdit() {
    label.style.display = '';
    if (editBtnEl) editBtnEl.style.display = '';
    label.classList.remove('editing');
    container.remove();
  }

  saveBtn.onclick = validateEdit;
  cancelBtn.onclick = closeEdit;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.tagName !== 'TEXTAREA') {
      e.preventDefault();
      validateEdit();
    }
    if (e.key === 'Escape') closeEdit();
  });

  if (field === 'metaCreator') {
    setupAutocompleteInline(input, suggestionsDropdown, { type: 'creator' });
  } else if (field === 'metaMap') {
    setupAutocompleteInline(input, suggestionsDropdown, { type: 'map' });
  }
}

/* =========================
   SEND MAP FORM
   ========================= */
async function sendMapToApi() {
  const mainCreatorId = document.getElementById('metaCreatorMain')?.getAttribute('data-raw-id');
  const code = (document.getElementById('metaCode')?.textContent || '').trim();
  const name = (document.getElementById('metaMap')?.textContent || '').trim();
  const checkpoints = Number(
    (document.getElementById('metaCheckpoints')?.textContent || '').trim()
  );

  const category = document.querySelector('#categoryDropdown   input[type="radio"]:checked')?.value;
  const difficulty = document.querySelector(
    '#difficultyDropdown input[type="radio"]:checked'
  )?.value;

  const mechanics = Array.from(
    document.querySelectorAll('#mechanicsDropdown input[type="checkbox"]:checked')
  ).map((c) => c.value);
  const restrictions = Array.from(
    document.querySelectorAll('#restrictionsDropdown input[type="checkbox"]:checked')
  ).map((c) => c.value);

  const description = (document.getElementById('optDescription')?.textContent || '').trim();
  const title = (document.getElementById('optTitleInput')?.value || '').trim().slice(0, 128);

  const guideRaw = (document.getElementById('optGuide')?.textContent || '').trim();
  const guide_url = !guideRaw || /^n\/?a$/i.test(guideRaw) ? null : firstHttpUrlOrNull(guideRaw);
  const medalsRaw = readMedalsInputs();

  let custom_banner = window.customBannerUrl || null;
  if (!custom_banner && window.customBannerFile) {
    try {
      custom_banner = await uploadImageGeneric(window.customBannerFile);
    } catch (e) {
      console.error(e);
      return { error: t('errors.upload_failed') || 'Banner upload failed.' };
    }
  }

  const asId = (v) => (v == null ? '' : String(v).trim());
  const creators = [];
  const mainId = asId(mainCreatorId);
  if (mainId) creators.push({ id: mainId, is_primary: true });

  for (const sc of secondaryCreators || []) {
    const idStr = asId(sc.user_id);
    if (idStr) creators.push({ id: idStr, is_primary: false });
  }

  const payload = {
    category,
    checkpoints,
    code,
    creators,
    difficulty,
    map_name: name,
    archived: false,
    hidden: false,
    official: false,
    playtesting: 'In Progress',
    guide_url: guide_url ?? null,
  };

  if (medalsRaw) {
    const v = validateMedals(false);
    if (!v.ok) {
      return { error: v.error || t('map.val.medals_generic') || 'Invalid medals.' };
    }
    payload.medals = v.values;
  }
  if (mechanics.length) payload.mechanics = mechanics;
  if (restrictions.length) payload.restrictions = restrictions;
  if (description && description !== 'N/A') payload.description = description;
  if (title) payload.title = title;
  if (custom_banner) payload.custom_banner = custom_banner;

  const resp = await fetch('/api/maps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'same-origin',
  });

  let data = null;
  try {
    data = await resp.json();
  } catch {}

  if (!resp.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${resp.status}`;
    return { error: msg, response: data };
  }
  return data;
}

function renderSubmitMapSection() {
  const host = document.getElementById('submitMapSection');
  if (!host) return;
  host.innerHTML = `
    <form id="submitMapForm" class="space-y-6">
      <!-- META CARD -->
      <div class="rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Creators -->
          <div class="sm:col-span-2">
            <span class="block text-xs text-zinc-400 mb-1">${t('map.meta.creator')}</span>
            <div id="metaCreatorsCol" class="flex flex-wrap items-center gap-2">
              <span class="main-creator-row inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
                <span id="metaCreatorMain" class="text-sm text-zinc-200">N/A</span>
              </span>
            </div>
          </div>

          <!-- Map Code -->
          <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div class="text-[11px] text-zinc-400">${t('map.meta.code')}</div>
            <div class="flex items-center gap-2">
              <div id="metaCode" class="text-sm text-zinc-200">N/A</div>
              <button type="button"
                      class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                      data-edit-target="metaCode">
                ${t('map.meta.edit')}
              </button>
            </div>
          </div>

          <!-- Map Name -->
          <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div class="text-[11px] text-zinc-400">${t('map.meta.name')}</div>
            <div class="flex items-center gap-2">
              <div id="metaMap" class="text-sm text-zinc-200">N/A</div>
              <button type="button"
                      class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                      data-edit-target="metaMap">
                ${t('map.meta.edit')}
              </button>
            </div>
          </div>

          <!-- Checkpoints -->
          <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div class="text-[11px] text-zinc-400">${t('map.meta.checkpoints')}</div>
            <div class="flex items-center gap-2">
              <div id="metaCheckpoints" class="text-sm text-zinc-200">N/A</div>
              <button type="button"
                      class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                      data-edit-target="metaCheckpoints">
                ${t('map.meta.edit')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- REQUIRED CARD -->
      <div class="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 space-y-4">
        <h3 class="text-sm font-semibold text-zinc-200">${t('map.required_title')}</h3>

        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Difficulty -->
          <div>
            <label class="block text-xs text-zinc-400 mb-1">${t('map.dropdown.select_difficulty')}</label>
            <div id="difficultyDropdown" class="custom-multiselect relative">
              <button type="button" id="difficultyDropdownBtn"
                      class="custom-multiselect-btn inline-flex w-full items-center justify-between rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm"
                      data-placeholder="${t('map.dropdown.select_difficulty')}">
                ${t('map.dropdown.select_difficulty')}
                <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20"><path fill="currentColor" d="m5 7 5 6 5-6H5z"/></svg>
              </button>
              <div class="custom-multiselect-list hidden absolute left-0 right-0 mt-1 rounded-lg border border-white/10 bg-zinc-900/95 p-1 shadow-xl" aria-hidden="true"></div>
            </div>
          </div>

          <!-- Category -->
          <div>
            <label class="block text-xs text-zinc-400 mb-1">${t('map.dropdown.select_category')}</label>
            <div id="categoryDropdown" class="custom-multiselect relative">
              <button type="button" id="categoryDropdownBtn"
                      class="custom-multiselect-btn inline-flex w-full items-center justify-between rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm"
                      data-placeholder="${t('map.dropdown.select_category')}">
                ${t('map.dropdown.select_category')}
                <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20"><path fill="currentColor" d="m5 7 5 6 5-6H5z"/></svg>
              </button>
              <div class="custom-multiselect-list hidden absolute left-0 right-0 mt-1 rounded-lg border border-white/10 bg-zinc-900/95 p-1 shadow-xl" aria-hidden="true"></div>
            </div>
          </div>

          <!-- Mechanics -->
          <div class="sm:col-span-1">
            <label class="block text-xs text-zinc-400 mb-1">${t('map.dropdown.select_mechanics')}</label>
            <div id="mechanicsDropdown" class="custom-multiselect relative">
              <button type="button" id="mechanicsDropdownBtn"
                      class="custom-multiselect-btn inline-flex w-full items-center justify-between rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm"
                      data-placeholder="${t('map.dropdown.select_mechanics')}">
                ${t('map.dropdown.select_mechanics')}
                <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20"><path fill="currentColor" d="m5 7 5 6 5-6H5z"/></svg>
              </button>
              <div class="custom-multiselect-list hidden absolute left-0 right-0 mt-1 rounded-lg border border-white/10 bg-zinc-900/95 p-1 shadow-xl" aria-hidden="true"></div>
            </div>
          </div>

          <!-- Restrictions -->
          <div class="sm:col-span-1">
            <label class="block text-xs text-zinc-400 mb-1">${t('map.dropdown.select_restrictions')}</label>
            <div id="restrictionsDropdown" class="custom-multiselect relative">
              <button type="button" id="restrictionsDropdownBtn"
                      class="custom-multiselect-btn inline-flex w-full items-center justify-between rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm"
                      data-placeholder="${t('map.dropdown.select_restrictions')}">
                ${t('map.dropdown.select_restrictions')}
                <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20"><path fill="currentColor" d="m5 7 5 6 5-6H5z"/></svg>
              </button>
              <div class="custom-multiselect-list hidden absolute left-0 right-0 mt-1 rounded-lg border border-white/10 bg-zinc-900/95 p-1 shadow-xl" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- OPTIONAL CARD -->
      <div class="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 space-y-4">
        <h3 class="text-sm font-semibold text-zinc-200">${t('map.optional_title')}</h3>

        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Title -->
          <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <label class="block text-[11px] text-zinc-400 mb-1" for="optTitleInput">${t('map.title_label') || 'Title'}</label>
            <input id="optTitleInput" type="text" maxlength="128"
                   class="w-full rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                   placeholder="${t('map.title_placeholder') || 'Optional short title (max 128 chars)'}">
          </div>

          <!-- Custom banner (drag & drop) -->
          <div>
            <div class="text-[11px] text-zinc-400 mb-1">${t('map.custom_banner') || 'Custom banner'}</div>
            <div id="bannerDrop"
                 class="group relative flex h-36 items-center justify-center rounded-xl border border-dashed border-white/15 bg-zinc-900/60 overflow-hidden cursor-pointer">
              <input id="bannerInput" type="file" accept="image/*" class="hidden">
              <div id="bannerPlaceholder" class="text-sm text-zinc-300 px-3 text-center select-none">
                ${t('record.drag_and_drop') || 'Drag & drop or click to upload'}
                <div class="text-[11px] text-zinc-400 mt-1">${t('map.banner_hint') || 'Recommended 16:9. JPG/PNG/WebP/AVIF, max 8MB.'}</div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-[11px] text-zinc-400">${t('map.description_label')}</div>
                <div id="optDescription" class="text-sm text-zinc-200">N/A</div>
              </div>
              <button type="button"
                      class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                      data-edit-target="optDescription">
                ${t('map.meta.edit')}
              </button>
            </div>
          </div>

          <!-- Guide URL(s) -->
          <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-[11px] text-zinc-400">${t('map.guide_label')}</div>
                <div id="optGuide" class="text-sm text-zinc-200">N/A</div>
              </div>
              <button type="button"
                      class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                      data-edit-target="optGuide">
                ${t('map.meta.edit')}
              </button>
            </div>
            <p class="mt-2 text-xs text-zinc-400">${t('map.guide_hint') || 'One URL per line; first valid URL is used.'}</p>
          </div>
          <!-- Medals -->
          <div class="sm:col-span-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div class="text-[11px] text-zinc-400 mb-2">Medals</div>

            <div class="grid gap-3 sm:grid-cols-3">
              <!-- Gold -->
              <label class="flex items-center gap-2">
                <span class="inline-flex items-center gap-2 min-w-0">
                  <img src="assets/medals/gold.png" alt="Gold" class="h-5 w-5 select-none pointer-events-none">
                  <span class="text-sm text-zinc-200">Gold</span>
                </span>
                <input
                  id="medalGoldInput"
                  type="text"
                  inputmode="decimal"
                  pattern="\\d{1,5}(?:\\.\\d{1,2})?"
                  placeholder="e.g. 5550.23"
                  class="shrink-0 w-40 rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                >
              </label>

              <!-- Silver -->
              <label class="flex items-center gap-2">
                <span class="inline-flex items-center gap-2 min-w-0">
                  <img src="assets/medals/silver.png" alt="Silver" class="h-5 w-5 select-none pointer-events-none">
                  <span class="text-sm text-zinc-200">Silver</span>
                </span>
                <input
                  id="medalSilverInput"
                  type="text"
                  inputmode="decimal"
                  pattern="\\d{1,5}(?:\\.\\d{1,2})?"
                  placeholder="e.g. 7599.33"
                  class="shrink-0 w-40 rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                >
              </label>

              <!-- Bronze -->
              <label class="flex items-center gap-2">
                <span class="inline-flex items-center gap-2 min-w-0">
                  <img src="assets/medals/bronze.png" alt="Bronze" class="h-5 w-5 select-none pointer-events-none">
                  <span class="text-sm text-zinc-200">Bronze</span>
                </span>
                <input
                  id="medalBronzeInput"
                  type="text"
                  inputmode="decimal"
                  pattern="\\d{1,5}(?:\\.\\d{1,2})?"
                  placeholder="e.g. 8066.75"
                  class="shrink-0 w-40 rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                >
              </label>
            </div>

            <p class="mt-2 text-xs text-zinc-400">
              ${t('map.medals_hint')}
            </p>
          </div>
        </div>
      </div>

      <!-- ACTION BAR -->
      <div class="flex items-center gap-2">
        <button type="submit"
                class="inline-flex cursor-pointer items-center justify-center rounded-xl bg-white text-zinc-900 px-4 py-2 text-sm font-semibold hover:bg-zinc-100">
          ${t('map.submit_label')}
        </button>
        <button type="button"
                class="cancel-btn cursor-pointer inline-flex items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
                form="submitMapForm">
          ${t('record.cancel')}
        </button>
      </div>
    </form>
  `;
  bindSubmitMapEditButtons(host);
  if (IS_GUEST) {
    lockSectionById('submitMapSection');
    ensureGuestLockPersistence('submitMapSection');
  }
}

/* =========================
   HELPERS SEND COMPLETION
   ========================= */
function filenameWithExt(file, fallbackBase = 'screenshot') {
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
  };
  const hasExt = !!(file.name && /\.[a-z0-9]{2,5}$/i.test(file.name));
  const ext = map[file.type] || 'png';
  return hasExt ? file.name : `${fallbackBase}.${ext}`;
}

async function uploadScreenshot(file) {
  const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (!ALLOWED.includes(file.type)) throw new Error('Format invalide...');
  if (file.size > 8 * 1024 * 1024) throw new Error('Fichier trop volumineux...');

  const fd = new FormData();
  fd.append('file', file, filenameWithExt(file, 'screenshot'));

  const resp = await fetch(IMAGE_UPLOAD_ENDPOINT, {
    method: 'POST',
    headers: { Accept: 'text/plain' },
    body: fd,
    credentials: 'same-origin',
  });
  const text = await resp.text();
  if (!resp.ok) throw new Error(text || `HTTP ${resp.status}`);
  const url = (text || '').trim();
  if (!/^https?:\/\//i.test(url)) throw new Error('Réponse upload invalide: URL absente.');
  return url;
}

async function autoUploadScreenshot(file) {
  const dz = document.getElementById('screenshotDrop');
  const endBusy = showBusy(dz);
  try {
    const url = await uploadScreenshot(file);
    window.screenshotUrl = url;
    const ok = document.createElement('div');
    ok.className =
      'absolute top-2 right-2 rounded bg-emerald-500/90 text-xs text-white px-2 py-0.5 shadow';
    ok.textContent = 'Uploaded';
    dz.appendChild(ok);
    setTimeout(() => ok.remove(), 1500);
  } catch (e) {
    window.screenshotUrl = null;
    showErrorMessage(e?.message || t('errors.upload_failed'));
  } finally {
    endBusy();
  }
}

function getVideoUrl() {
  const el = document.querySelector(
    '#videoUrlInput, #videoInput, input[name="video"], input[name="video_url"], textarea[name="video"]'
  );
  if (!el) return null;

  let v = (el.value || '').trim();
  if (!v) return null;

  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(v)) v = `https://${v}`;

  if (!/^https?:\/\//i.test(v)) return null;

  return v;
}

function ensureNoticeHost() {
  const sec  = document.getElementById('submitRecordSection');
  if (!sec) return null;

  let host = document.getElementById('srNoticeHost');
  if (!host) {
    host = document.createElement('div');
    host.id = 'srNoticeHost';
    const form = sec.querySelector('#submitRecordForm');
    if (form) sec.insertBefore(host, form);
    else      sec.insertBefore(host, sec.firstChild);
  }
  return host;
}

function bannerHTML() {
  const title  = (typeof t === 'function' && t('notice.title'))              || 'Notice';
  const li1    = (typeof t === 'function' && t('notice.pending_accept'))     || 'Your completion may remain pending until it’s accepted.';
  const li2    = (typeof t === 'function' && t('notice.mutable_difficulty')) || 'Difficulty may change while the map is in playtesting.';
  return `
    <div class="mb-4 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 ring-1 ring-amber-400/20 sm:p-4 sr-notice" id="srPlaytestingNotice" role="status" aria-live="polite">
      <div class="flex items-start gap-3">
        <svg class="mt-0.5 h-5 w-5 shrink-0 text-amber-300" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 14h-2v-6h2v6Zm0-8h-2V6h2v2Z" />
        </svg>
        <div class="min-w-0">
          <div class="font-semibold text-amber-300">${title}</div>
          <ul class="mt-1.5 space-y-1 text-sm leading-5 text-amber-100">
            <li class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300 relative top-px"></span>
              <span>${li1}</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300 relative top-px"></span>
              <span>${li2}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>`;
}

function showNotice() {
  const host = ensureNoticeHost();
  if (!host) return;
  if (!document.getElementById('srPlaytestingNotice')) {
    host.insertAdjacentHTML('afterbegin', bannerHTML());
    const el = document.getElementById('srPlaytestingNotice');
    requestAnimationFrame(() => el.classList.add('is-visible'));
  }
}

function hideNotice() {
  const el = document.getElementById('srPlaytestingNotice');
  if (!el) return;
  el.classList.remove('is-visible');
  const done = () => el.remove();
  el.addEventListener('transitionend', done, { once: true });
  setTimeout(done, 260);
}

async function fetchMapByCode(code) {
  if (!code) return null;
  try {
    const resp = await fetch(`/api/maps?code=${encodeURIComponent(code)}`, {
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
      cache: 'no-store',
    });
    if (!resp.ok) return null;
    const data = await resp.json().catch(() => null);
    if (!data) return null;

    const norm = (v) => normalizeMapCode(v || '');
    if (Array.isArray(data)) {
      return data.find(m => norm(m?.code || m?.map_code) === norm(code)) || data[0] || null;
    }
    return data;
  } catch {
    return null;
  }
}

function isInProgress(map) {
  const v = String(map?.playtesting ?? map?.status ?? '').toLowerCase();
  return v.includes('progress');
}

async function evaluateNoticeForInput() {
  const sec = document.getElementById('submitRecordSection');
  if (!sec || sec.classList.contains('hidden')) return;

  const input = document.getElementById('mapCodeInput');
  const raw   = (input?.value || '').trim();
  const code  = normalizeMapCode(raw);

  if (!code || code.length < 4) {
    hideNotice();
    try { removeViewPlaytestButton(); } catch {}
    return;
  }

  const map = await fetchMapByCode(code);
  if (map && isInProgress(map)) {
    showNotice();
    try { ensureViewModalButtonForLastCode(code); } catch {}
  } else {
    hideNotice();
    try { removeViewPlaytestButton(); } catch {}
  }
}

function bindWatcher() {
  const input = document.getElementById('mapCodeInput');
  if (!input || input.dataset.noticeBound === '1') return;
  input.dataset.noticeBound = '1';

  let debounce;
  const run = () => {
    clearTimeout(debounce);
    debounce = setTimeout(evaluateNoticeForInput, 250);
  };
  input.addEventListener('input', run);
  input.addEventListener('blur', run);
  input.addEventListener('change', run);

  requestAnimationFrame(evaluateNoticeForInput);
  try {
    const v = (input.value || '').trim();
    const c = typeof normalizeMapCode === 'function' ? normalizeMapCode(v) : v;
    if (c && c.length >= 4) ensureViewModalButtonForLastCode(c);
  } catch {}
}

const _origAnimateSR = typeof animateSubmitRecordSection === 'function' ? animateSubmitRecordSection : null;
window.animateSubmitRecordSection = function () {
  _origAnimateSR && _origAnimateSR();
  ensureNoticeHost();
  bindWatcher();
  setTimeout(evaluateNoticeForInput, 120);
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  if ((params.get('section') || 'playtest') === 'submit_record') {
    ensureNoticeHost();
    bindWatcher();
  }
});

function disableBrowserAutocompleteInSubmitRecord() {
  const form = document.getElementById('submitRecordForm') || document.querySelector('#submitRecordSection form');
  if (!form) return;

  form.setAttribute('autocomplete', 'off');
  form.querySelectorAll('input, textarea').forEach((el) => {
    el.setAttribute('autocomplete', 'off');
    el.setAttribute('autocorrect', 'off');
    el.setAttribute('autocapitalize', 'off');
    el.setAttribute('spellcheck', 'false');
  });
}

async function openPlaytestModalForCode(code) {
  const c = (code || '').trim();
  if (!c) { showErrorMessage(t('errors.invalid_form') || 'Invalid code'); return; }

  const data = await fetchFreshMapByCode(c);
  if (!data) { showErrorMessage(t('errors.map_not_found') || 'Map not found'); return; }

  const modal = document.getElementById('playtestModal');
  const inner = document.getElementById('playtestModalInner');
  if (!modal || !inner) return;

  if (typeof renderPlaytestModal === 'function') {
    inner.innerHTML = renderPlaytestModal(data);
  } else {
    inner.innerHTML = `
      <div class="p-4 space-y-2">
        <div class="text-lg font-semibold text-zinc-100">${data.name || data.code || 'Map'}</div>
        <div class="text-sm text-zinc-300">Code: ${data.code || '—'}</div>
        <div class="text-sm text-zinc-400">Modal renderer missing.</div>
      </div>
    `;
  }

  modal.classList.remove('hidden');
  modal.classList.add('pt-anim');
  inner.classList.add('pt-anim');

  void modal.offsetWidth;
  requestAnimationFrame(() => {
    modal.classList.add('pt-in');
    inner.classList.add('pt-in');
  });

  modal.querySelector('.playtest-modal-backdrop')
    ?.addEventListener('click', hidePlaytestModal, { once: true });

  try { registerMapCodeCopyTargets(modal); } catch {}
  try { setupRatingDropdown(); } catch {}
  try { await hydratePlaytestModalCreatorAvatar(modal); } catch {}
  try {
    const voterIds = Array.isArray(data.playtest_voters) ? data.playtest_voters : [];
    const pre = await preloadVoters(voterIds);
    injectVotersGrid(modal, pre, voterIds);
    registerVoterInteractions(modal);
  } catch {}

  const initialAvg =
    Number.isFinite(data.playtest_vote_average) ? data.playtest_vote_average :
    Number.isFinite(data.difficulty_value)     ? data.difficulty_value     : null;

  try { updateDifficultyChartInModal(initialAvg); } catch {}
  try { mountModeratorActions(inner, data); } catch {}
}

function removeViewPlaytestButton() {
  const btn = document.getElementById('viewPlaytestModalBtn');
  if (btn && btn.parentElement) btn.parentElement.removeChild(btn);
  const fb = document.getElementById('srActionBarFallback');
  if (fb && !fb.querySelector('#viewPlaytestModalBtn')) fb.remove();
}

function ensureViewModalButtonForLastCode(code) {
  if (!code) { removeViewPlaytestButton(); return; }

  if (document.readyState === 'loading' || !document.body) {
    document.addEventListener('DOMContentLoaded', () => ensureViewModalButtonForLastCode(code), { once: true });
    return;
  }

  const bar = (() => {
    let el = document.getElementById('srActionBar');
    if (el) return el;

    const form = document.getElementById('submitRecordForm') || document.querySelector('#submitRecordForm');
    if (form) {
      el = document.createElement('div');
      el.id = 'srActionBar';
      el.className = 'mt-3 flex items-center gap-2';
      form.appendChild(el);
      return el;
    }
    el = document.getElementById('srActionBarFallback');
    if (!el) {
      el = document.createElement('div');
      el.id = 'srActionBarFallback';
      el.className = 'fixed bottom-4 right-4 z-[120]';
      document.body.appendChild(el);
    }
    return el;
  })();

  let btn = document.getElementById('viewPlaytestModalBtn');
  if (btn && btn.parentElement !== bar) { try { btn.remove(); } catch {} btn = null; }

  const baseClasses = [
    'gp-cta',
    'inline-flex','items-center','justify-center','cursor-pointer','ml-auto',
    'rounded-lg','px-3','py-2','text-sm',
    'border','border-amber-500/30','bg-amber-500/10','text-amber-200',
    'hover:bg-amber-500/15','hover:text-white',
    'focus:outline-none','focus-visible:ring-2','focus-visible:ring-amber-400/60'
  ].join(' ');

  let isNew = false;
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'viewPlaytestModalBtn';
    btn.type = 'button';
    btn.className = baseClasses + ' gp-enter';
    btn.textContent = (typeof t === 'function' ? t('record.view_modal') : 'View playtest');

    btn.style.opacity = '0';
    btn.style.transform = 'translateY(4px)';
    btn.style.transition = 'opacity .28s ease, transform .28s ease';

    bar.appendChild(btn);
    requestAnimationFrame(() => {
      btn.style.opacity = '1';
      btn.style.transform = 'none';
    });
    isNew = true;
  } else {
    btn.className = baseClasses;
    if (!btn.isConnected) bar.appendChild(btn);
  }

  btn.dataset.code = String(code);
  btn.onclick = () => openPlaytestModalForCode(code);

  const last = btn.getAttribute('data-last-code') || '';
  if (last !== String(code)) {
    btn.setAttribute('data-last-code', String(code));
    btn.classList.remove('gp-cta-once'); // reset
    requestAnimationFrame(() => btn.classList.add('gp-cta-once'));
  }

  if (isNew || !btn.__autoArmed) {
    btn.__autoArmed = true;
    btn.classList.add('gp-auto');
    setTimeout(() => btn.classList.remove('gp-auto'), 2000);
  }
}

/* =========================
   SEND COMPLETION FORM
   ========================= */

async function sendCompletionToApi() {
  const mapCodeInput = document.getElementById('mapCodeInput');
  const inputTime = document.getElementById('inputTime');

  const code = (mapCodeInput?.value || '').trim();
  const time = parseFloat((inputTime?.value || '').trim());

  if (!code || !Number.isFinite(time) || time <= 0) {
    return { error: t('errors.invalid_form') || 'Formulaire invalide' };
  }
  if (!window.screenshotUrl && !window.screenshotFile) {
    return { error: t('record.screenshot_required')};
  }

  try {
    const screenshotUrl = window.screenshotUrl
      ? window.screenshotUrl
      : await uploadScreenshot(window.screenshotFile);
    window.screenshotUrl = screenshotUrl;

    const videoRaw = getVideoUrl();
    const hasVideo = videoRaw != null && String(videoRaw).trim() !== '';
    const video = hasVideo ? String(videoRaw).trim() : null;

    const payload = {
      code,
      screenshot: screenshotUrl,
      time,
      user_id: String(user_id),
      video,
      completion: !hasVideo,
    };

    const resp = await fetch(COMPLETION_SUBMIT_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'same-origin',
    });

    let data = null;
    try {
      data = await resp.json();
    } catch {}

    if (!resp.ok) {
      const msg = (data && (data.error || data.message)) || `HTTP ${resp.status}`;
      return { error: msg };
    }

    try {
      const q = getSelectedQuality();
      if (Number.isFinite(q)) await sendQualityVote(code, q);
    } catch {}
    return data || { ok: true };
  } catch (err) {
    console.error(err);
    return { error: err?.message || t('errors.server_unreachable') || 'Erreur réseau' };
  }
}

function dragAndDrop() {
  const dropzone = document.getElementById('screenshotDrop');
  const input = document.getElementById('screenshotInput');
  if (!dropzone || !input) return;

  dropzone.replaceWith(dropzone.cloneNode(true));
  const dz = document.getElementById('screenshotDrop');
  const fi = dz.querySelector('#screenshotInput');

  const readAsDataURL = (file) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });

  function resetScreenshotDropzone() {
    dz.innerHTML = `
      <input type="file" id="screenshotInput" name="screenshot" accept="image/*" class="hidden">
      <div id="screenshotPlaceholder" class="screenshot-placeholder">
        <span>${t('record.drag_and_drop')}</span>
      </div>
    `;
    window.screenshotFile = null;
    window.screenshotUrl = null;
    dragAndDrop();
  }

  async function setPreview(file) {
    dz.innerHTML = `
      <div class="absolute inset-0"></div>
      <div class="absolute inset-x-0 bottom-0 p-2 flex items-center justify-between bg-black/40 backdrop-blur">
        <span class="text-xs text-white/90 truncate px-1">${file.name}</span>
        <button type="button" id="screenshotRemoveBtn"
                class="rounded-md cursor-pointer border border-white/20 px-2 py-1 text-xs text-white hover:bg-white/10">
          ${t('map.remove')}
        </button>
      </div>
    `;

    const host = dz.firstElementChild;
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
        try { img.src = await readAsDataURL(file); }
        catch { showErrorMessage(t('errors.upload_failed')); }
        finally { if (blobUrl) URL.revokeObjectURL(blobUrl); }
      };
      img.onload = () => { if (blobUrl) URL.revokeObjectURL(blobUrl); };
    } catch {
      try { img.src = await readAsDataURL(file); }
      catch { showErrorMessage(t('errors.upload_failed')); }
    }

    host.appendChild(img);
    dz.querySelector('#screenshotRemoveBtn')?.addEventListener('click', resetScreenshotDropzone);
  }

  function acceptFile(file) {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      showErrorMessage(t('errors.image_type'));
      return;
    }
    window.screenshotFile = file;
    setPreview(file);
    try { autoUploadScreenshot(file); } catch {}
  }

  dz.addEventListener('click', (e) => {
    if (e.target.id === 'screenshotRemoveBtn') return;
    const inputEl = dz.querySelector('#screenshotInput');
    if (inputEl) inputEl.click();
  });

  dz.addEventListener('dragover', (e) => {
    e.preventDefault();
    dz.classList.add('dragover', 'ring-2', 'ring-emerald-500/60');
  });
  dz.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dz.classList.remove('dragover', 'ring-2', 'ring-emerald-500/60');
  });
  dz.addEventListener('drop', (e) => {
    e.preventDefault();
    dz.classList.remove('dragover', 'ring-2', 'ring-emerald-500/60');
    if (e.dataTransfer?.files?.[0]) acceptFile(e.dataTransfer.files[0]);
  });

  fi.addEventListener('change', () => {
    if (fi.files?.[0]) acceptFile(fi.files[0]);
  });
}

async function sendQualityVote(code, qualityOverride = null) {
  const q = Number.isFinite(qualityOverride) ? qualityOverride : getSelectedQuality();
  if (!Number.isFinite(q)) return { skipped: true };

  const resp = await fetch(`/api/maps/${encodeURIComponent(code)}/quality`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      user_id: String(user_id),
      quality: q
    }),
    credentials: 'same-origin',
  });

  if (!resp.ok) {
    let msg = `HTTP ${resp.status}`;
    try { const j = await resp.json(); msg = j?.error || j?.message || msg; } catch {}
    throw new Error(msg);
  }
  try { return await resp.json(); } catch { return { ok: true }; }
}

function qualitySlider() {
  const root = document.getElementById('qualityDropdown');
  if (!root) return;

  const L = [
    (typeof t === 'function' && t('record.quality_1')) || 'Very poor',
    (typeof t === 'function' && t('record.quality_2')) || 'Poor',
    (typeof t === 'function' && t('record.quality_3')) || 'Fair',
    (typeof t === 'function' && t('record.quality_4')) || 'Good',
    (typeof t === 'function' && t('record.quality_5')) || 'Very good',
    (typeof t === 'function' && t('record.quality_6')) || 'Perfect',
  ];
  const placeholder =
    (typeof t === 'function' && t('record.select_quality')) || 'Select quality';

  root.innerHTML = `
    <div class="quality-wrap">
      <div class="quality-head">
        <span class="quality-title">${placeholder}</span>
        <span class="quality-badge" aria-live="polite">${placeholder}</span>
      </div>

      <div class="quality-range-wrap">
        <div class="quality-track">
          <div class="quality-fill pct-0"></div>
        </div>
        <input
          type="range"
          class="quality-range"
          min="1" max="6" step="1" value="1"
          data-empty="1"
          aria-label="${placeholder}"
          aria-valuemin="1" aria-valuemax="6" aria-valuenow="1"
          aria-valuetext="${L[0]}"
        />
      </div>

      <input type="hidden" id="qualityInput" name="quality" value="">
    </div>
  `;

  const range  = root.querySelector('.quality-range');
  const fill   = root.querySelector('.quality-fill');
  const badge  = root.querySelector('.quality-badge');
  const hidden = root.querySelector('#qualityInput');

  const pctMap = { 1:'pct-0', 2:'pct-20', 3:'pct-40', 4:'pct-60', 5:'pct-80', 6:'pct-100' };
  const pctClassFor   = (v) => pctMap[v] || 'pct-0';
  const colorClassFor = (v) => `qcolor-${v}`;

  function update(v, committed=false) {
    const val = Math.max(1, Math.min(6, Number(v) || 1));

    fill.className = `quality-fill ${pctClassFor(val)} ${colorClassFor(val)}`;

    root.classList.remove('qv-1','qv-2','qv-3','qv-4','qv-5','qv-6');
    root.classList.add(`qv-${val}`);

    range.setAttribute('aria-valuenow', String(val));
    range.setAttribute('aria-valuetext', L[val-1]);

    if (committed) {
      badge.textContent = L[val-1];
      hidden.value = String(val);
      range.removeAttribute('data-empty');
    } else {
      if (range.getAttribute('data-empty') === '1') {
        badge.textContent = placeholder;
      } else {
        badge.textContent = L[val-1];
      }
    }
  }

  update(1, false);

  range.addEventListener('input', (e) => update(e.target.value, false));
  range.addEventListener('change', (e) => update(e.target.value, true));

  const preset = Number(root.getAttribute('data-value'));
  if (preset >= 1 && preset <= 6) {
    range.value = String(preset);
    update(preset, true);
  }
}

function resetQualitySlider(containerOrId = 'qualityDropdown') {
  const root = typeof containerOrId === 'string'
    ? document.getElementById(containerOrId)
    : containerOrId;
  if (!root) return;

  const placeholder =
    root.getAttribute('data-placeholder') ||
    (typeof t === 'function' ? t('record.select_quality') : 'Select quality');

  const hidden = root.querySelector('#qualityValue, input[type="hidden"][name="quality"]');
  if (hidden) hidden.value = '';

  const badge = root.querySelector('.quality-badge');
  if (badge) badge.textContent = placeholder;

  root.removeAttribute('data-value');
  root.removeAttribute('data-color');
  root.classList.remove('qv-1','qv-2','qv-3','qv-4','qv-5','qv-6');

  const fill = root.querySelector('.quality-fill');
  if (fill) {
    fill.classList.remove('pct-20','pct-40','pct-60','pct-80','pct-100');
    fill.classList.add('pct-0');
  }

  const range = root.querySelector('.quality-range');
  if (range) {
    const min = Number(range.min || 1);
    range.value = String(min);
    range.setAttribute('data-empty', '1');
    range.dispatchEvent(new Event('input', { bubbles: true }));
  }

  root.querySelectorAll('.quality-mark--active')
    .forEach(m => m.classList.remove('quality-mark--active'));
}

function getSelectedQuality() {
  const root = document.getElementById('qualityDropdown');
  if (!root) return null;

  const hidden = root.querySelector('#qualityInput, input[name="quality"]');
  let val = hidden && hidden.value ? Number(hidden.value) : null;

  if (!Number.isFinite(val)) {
    const range = root.querySelector('.quality-range');
    if (range) {
      if (range.getAttribute('data-empty') !== '1') {
        val = Number(range.value);
      } else {
        const aria = Number(range.getAttribute('aria-valuenow'));
        if (Number.isFinite(aria)) val = aria;
      }
    }
  }

  if (!Number.isFinite(val)) return null;
  return Math.max(1, Math.min(6, Math.trunc(val)));
}

function forceDotDecimalInput(selector) {
  const el = document.querySelector(selector);
  if (!el) return;

  el.addEventListener('input', function () {
    if (this.value.includes(',')) {
      this.value = this.value.replace(/,/g, '.');
    }
  });
  el.addEventListener('keydown', function (e) {
    if (e.key === ',') {
      e.preventDefault();
      document.execCommand('insertText', false, '.');
    }
  });
}
document.addEventListener('DOMContentLoaded', function () {
  forceDotDecimalInput('#inputTime');
});

function validateSubmitRecordForm(event) {
  const mapCodeInput = document.getElementById('mapCodeInput');
  if (!mapCodeInput || !mapCodeInput.value.trim()) {
    showWarningMessage(t('record.code_invalid'));
    return false;
  }

  const inputTime = document.getElementById('inputTime');
  const timeValue = inputTime ? inputTime.value.trim() : '';

  if (!TIME_REGEX.test(timeValue)) {
    showWarningMessage(t('record.time_invalid'));
    if (inputTime) inputTime.focus();
    return false;
  }

  const numericTime = Number(timeValue);
  if (!Number.isFinite(numericTime) || numericTime <= 0) {
    showWarningMessage(t('record.time_invalid'));
    return false;
  }

  const qHidden = document.querySelector('#qualityDropdown input[name="quality"]');
  let hasQuality = !!(qHidden && qHidden.value);
  if (!hasQuality) {
    const qualityChecks = document.querySelectorAll(
      '#qualityDropdown input[type="radio"], #qualityDropdown input[type="checkbox"]'
    );
    if (qualityChecks.length) hasQuality = Array.from(qualityChecks).some((c) => c.checked);
  }
  if (!hasQuality) {
    showWarningMessage(t('record.quality_required')); return false;
  }

  if (!window.screenshotUrl) {
    showWarningMessage(t('record.screenshot_required'));
    return false;
  }

  const videoEl = document.getElementById('inputVideo');
  const v = (videoEl?.value || '').trim();
  if (v && !/^(https?:\/\/)?[^\s]+$/i.test(v)) {
    showWarningMessage(t('record.video_invalid'));
    if (videoEl) videoEl.focus();
    return false;
  }

  return true;
}

/* =========================
   HELPERS PLAYTEST
   ========================= */
function normalizePlaytest(item) {
  const creators = Array.isArray(item?.creators) ? item.creators : [];
  const primary = creators.find((c) => c.is_primary) || creators[0] || {};

  const code = item.code || item.map_code || item.id || '';
  const mapName = item.translated_map_name || item.map_name || item.name || '';
  const category = item.category?.name || item.category || item.map_type || '';
  const checkpoints = Number(item.checkpoints ?? item.cp ?? 0);

  const difficulty = item.difficulty?.name || item.difficulty || item.raw_difficulty_label || '';

  const toNumber = (v) => {
    if (v == null) return null;
    const n = typeof v === 'string' ? Number(v) : v;
    return Number.isFinite(n) ? n : null;
  };
  const toInt = (v) => {
    const n = toNumber(v);
    return n == null ? null : Math.trunc(n);
  };
  const asStr = (v) => (v == null ? null : String(v));

  const difficulty_value = toNumber(
    item.playtest?.initial_difficulty ?? item.raw_difficulty ?? item.difficulty_value
  );

  const mechanics = Array.isArray(item.mechanics) ? item.mechanics : [];
  const restrictions = Array.isArray(item.restrictions) ? item.restrictions : [];
  const description = item.description ?? null;
  const guide_urls = Array.isArray(item.guides)
    ? item.guides
    : Array.isArray(item.guide_urls)
      ? item.guide_urls
      : [];

  const banner =
    item.map_banner ||
    item.map_banner_url ||
    item.banner_url ||
    item.thumbnail ||
    'assets/img/card-banner.png';

  const total_results = toInt(item.total_results ?? item.total ?? item._total) ?? 0;

  const creator_names = creators.length
    ? creators
        .map((c) => c.name)
        .filter(Boolean)
        .join(', ')
    : item.creator_name || item.user?.name || '';

  let playtest_vote_count =
    toInt(item.playtest?.vote_count) ??
    (Array.isArray(item.playtest?.voters) ? item.playtest.voters.length : null) ??
    toInt(item.vote_count) ??
    (Array.isArray(item.voters) ? item.voters.length : 0);

  const playtest_vote_average = toNumber(item.playtest?.vote_average);
  const playtest_initial_difficulty = toNumber(item.playtest?.initial_difficulty);
  const playtest_completed = Boolean(item.playtest?.completed);
  const playtest_thread_id = asStr(item.playtest?.thread_id);

  const playtest_voters = Array.isArray(item.playtest?.voters)
    ? item.playtest.voters.map((v) => (typeof v === 'string' ? v : String(v)))
    : [];

  const medals = item.medals ?? null;
  const title = item.title ?? null;
  const time = item.time ?? null;

  const ratings = toNumber(item.ratings);

  return {
    id: item.id ?? code,
    code,
    name: mapName,
    category,
    checkpoints,
    difficulty,
    difficulty_value: Number.isFinite(difficulty_value) ? difficulty_value : null,

    mechanics,
    restrictions,
    description,
    guide_urls,

    map_banner_url: banner,

    creator_names,
    primary_creator_id: String(primary.id ?? primary.user_id ?? item.creator_id ?? ''),
    total_results,

    playtest_vote_count,
    playtest_vote_average,
    playtest_initial_difficulty,
    playtest_completed,
    playtest_thread_id,
    playtest_voters,

    medals,
    title,
    time,

    ratings: Number.isFinite(ratings) ? ratings : null,
  };
}

function buildPlaytestParams(extra = {}, page = currentPage) {
  const params = new URLSearchParams({
    archived: 'false',
    official: 'false',
    hidden: 'false',
    page_number: String(page),
    page_size: String(itemsPerPage),
    playtest_status: 'In Progress',
  });

  if (
    !IS_GUEST &&
    typeof user_id !== 'undefined' &&
    user_id != null &&
    String(user_id).trim() !== ''
  ) {
    params.set('user_id', String(user_id));
  }

  Object.entries(extra).forEach(([k, v]) => {
    if (IS_GUEST && k === 'user_id') return;

    if (Array.isArray(v)) {
      v.filter((x) => x != null && x !== '').forEach((x) => params.append(k, x));
    } else if (v != null && v !== '') {
      params.set(k, v);
    }
  });

  return params.toString();
}

function difficultyClasses(label, value) {
  const base = {
    text: 'text-zinc-200',
    chip: 'border-white/10 bg-white/5 text-zinc-200',
    dot: 'bg-zinc-400/70',
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

function _pickFirstMapFromResponse(json) {
  if (!json) return null;
  if (Array.isArray(json)) return json[0] || null;
  if (Array.isArray(json.items)) return json.items[0] || null;
  if (Array.isArray(json.results)) return json.results[0] || null;
  if (Array.isArray(json.data)) return json.data[0] || null;
  if (json.item) return json.item;
  return json;
}

async function fetchFreshMapByCode(code, page = 1) {
  if (!code) return null;
  try {
    const qs = buildPlaytestParams({ code: String(code) }, page);
    const resp = await fetch(`/api/maps?${qs}`, { headers: { Accept: 'application/json' } });
    let json = null;
    try {
      json = await resp.json();
    } catch {}
    if (!resp.ok) throw new Error((json && (json.error || json.message)) || `HTTP ${resp.status}`);
    const item = _pickFirstMapFromResponse(json);
    return item ? normalizePlaytest(item) : null;
  } catch (e) {
    console.warn('fetchFreshMapByCode failed:', e);
    return null;
  }
}

function closeGlobalDropdown() {
  if (uniqueDropdown && uniqueDropdown.parentNode) {
    uniqueDropdown.parentNode.removeChild(uniqueDropdown);
    uniqueDropdown = null;
  }
}

/* =========================
   HELPERS PLAYTEST MODAL
   ========================= */
function setupPlaytestCtaDown() {
  const wrap   = document.getElementById('ptCtaWrap');
  const btn    = document.getElementById('ptCtaDown');
  const hint   = document.getElementById('ptDifficultySection');
  if (!wrap || !btn) return;

  if (wrap.__ctaDownCleanup) wrap.__ctaDownCleanup();

  const preferred = document.getElementById('playtestModalInner');
  const rootModal = document.getElementById('playtestModal');
  const TH = 8;

  const isScrollable = (el) => {
    if (!el) return false;
    const cs = getComputedStyle(el);
    const oy = cs.overflowY;
    const scrollableAxis = /(auto|scroll|overlay)/.test(oy);
    return scrollableAxis && (el.scrollHeight - el.clientHeight > 1);
  };

  const findScrollPort = (startEl) => {
    if (isScrollable(preferred)) return preferred;

    let p = startEl?.parentElement;
    while (p && p !== document.body) {
      if (isScrollable(p)) return p;
      p = p.parentElement;
    }

    if (isScrollable(rootModal)) return rootModal;

    return document.scrollingElement || document.documentElement;
  };

  const scroller = findScrollPort(wrap);

  const show = () => {
    wrap.classList.remove('opacity-0', 'translate-y-1', 'pointer-events-none', 'hidden');
    btn.tabIndex = 0;
  };
  const hide = () => {
    wrap.classList.add('opacity-0', 'translate-y-1', 'pointer-events-none');
    btn.tabIndex = -1;
  };

  let lastVisible;
  const computeVisibility = () => {
    let sh, ch, st;
    const isDoc =
      (scroller === document.scrollingElement) ||
      (scroller === document.documentElement);

    if (isDoc) {
      sh = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      ch = window.innerHeight;
      st = window.pageYOffset || document.documentElement.scrollTop || 0;
    } else {
      sh = scroller.scrollHeight;
      ch = scroller.clientHeight;
      st = scroller.scrollTop;
    }
    const canScroll = sh - ch > TH;
    const atBottom  = st >= (sh - ch - TH);
    return canScroll && !atBottom;
  };

  const update = () => {
    const next = computeVisibility();
    if (next === lastVisible) return;
    lastVisible = next;
    next ? show() : hide();
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  };
  const onResize = () => update();

  const isDoc =
    (scroller === document.scrollingElement) ||
    (scroller === document.documentElement);

  if (isDoc) {
    window.addEventListener('scroll', onScroll, { passive: true });
  } else {
    scroller.addEventListener('scroll', onScroll, { passive: true });
  }
  window.addEventListener('resize', onResize);

  const ro = ('ResizeObserver' in window) ? new ResizeObserver(update) : null;
  if (ro) {
    if (isDoc) {
      ro.observe(document.body);
    } else {
      ro.observe(scroller);
      if (scroller.lastElementChild) {
        ro.observe(scroller.lastElementChild);
      }
    }
  }

  const mo = new MutationObserver(update);
  mo.observe(isDoc ? document.body : scroller, { childList: true, subtree: true });

  const timers = [
    setTimeout(update, 0),
    setTimeout(update, 120),
    setTimeout(update, 400),
  ];

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const pad = 12;

    const targetScroller = findScrollPort(wrap);
    const targetIsDoc =
      targetScroller === document.scrollingElement ||
      targetScroller === document.documentElement;

    if (targetIsDoc) {
      if (hint) {
        const top =
          hint.getBoundingClientRect().top +
          (window.pageYOffset || document.documentElement.scrollTop || 0) -
          pad;
        window.scrollTo({ top, behavior: 'smooth' });
      } else {
        window.scrollBy({
          top: Math.max(200, window.innerHeight * 0.8),
          behavior: 'smooth',
        });
      }
      return;
    }

    if (hint) {
      const top =
        hint.getBoundingClientRect().top -
        targetScroller.getBoundingClientRect().top +
        targetScroller.scrollTop -
        pad;
      targetScroller.scrollTo({ top, behavior: 'smooth' });
    } else {
      targetScroller.scrollBy({
        top: Math.max(200, targetScroller.clientHeight * 0.8),
        behavior: 'smooth',
      });
    }
  });

  update();

  wrap.__ctaDownCleanup = () => {
    timers.forEach(clearTimeout);
    if (isDoc) {
      window.removeEventListener('scroll', onScroll);
    } else {
      scroller.removeEventListener('scroll', onScroll);
    }
    window.removeEventListener('resize', onResize);
    mo.disconnect();
    if (ro) ro.disconnect();
  };
}

function _difficultyColors() {
  return [
    { bg: 'rgba(52,211,153,0.85)', border: 'rgba(16,185,129,1)' }, // Easy
    { bg: 'rgba(251,191,36,0.85)', border: 'rgba(245,158,11,1)' }, // Medium
    { bg: 'rgba(251,146,60,0.85)', border: 'rgba(251,146,60,1)' }, // Hard
    { bg: 'rgba(249,115,22,0.85)', border: 'rgba(249,115,22,1)' }, // V. Hard
    { bg: 'rgba(239,68,68,0.85)', border: 'rgba(239,68,68,1)' }, // Extreme
    { bg: 'rgba(244,63,94,0.85)', border: 'rgba(244,63,94,1)' }, // Hell
  ];
}

function _bucketizeAverage(avg) {
  const edges = [0, 2.35, 4.12, 5.88, 7.65, 9.41, 10];
  const centers = [
    (edges[0] + edges[1]) / 2,
    (edges[1] + edges[2]) / 2,
    (edges[2] + edges[3]) / 2,
    (edges[3] + edges[4]) / 2,
    (edges[4] + edges[5]) / 2,
    (edges[5] + edges[6]) / 2,
  ];
  const w = centers.map((c) => {
    const d = Math.abs((avg ?? c) - c);
    const span = edges[1] - edges[0];
    const v = Math.max(0, 1 - d / (span * 1.25));
    return +v.toFixed(3);
  });

  const s = w.reduce((a, b) => a + b, 0) || 1;
  return w.map((x) => x / s);
}

function _hideDifficultySkeleton() {
  document.getElementById('difficultyChartSkeleton')?.classList.add('hidden');
}
function _showDifficultySkeleton() {
  document.getElementById('difficultyChartSkeleton')?.classList.remove('hidden');
}

function _ensureChartJsBarRounded(ctx, data) {
  if (window.Chart) {
    const colors = _difficultyColors();
    const labels = ['Easy', 'Medium', 'Hard', 'Very Hard', 'Extreme', 'Hell'];

    const dsVals = data.values;
    const chartData = {
      labels,
      datasets: [
        {
          data: dsVals,
          backgroundColor: colors.map((c) => c.bg),
          borderColor: colors.map((c) => c.border),
          borderWidth: 1.2,
          borderSkipped: 'bottom',
          borderRadius: 8,
        },
      ],
    };

    const chartOpts = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#d4d4d8', font: { size: 11 } },

          stacked: false,
          suggestedMin: -0.5,
          suggestedMax: 5.5,
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.06)' },
          ticks: { color: '#a1a1aa', font: { size: 10 } },
          suggestedMax: Math.max(1, Math.ceil(Math.max(...dsVals) * 1.15)),
        },
      },
      datasets: {
        bar: {
          categoryPercentage: 0.88,
          barPercentage: 0.86,
        },
      },
      animation: { duration: 280, easing: 'easeOutCubic' },
    };

    if (ctx.__difficultyChart) {
      ctx.__difficultyChart.data = chartData;
      ctx.__difficultyChart.options = chartOpts;
      ctx.__difficultyChart.update();
    } else {
      ctx.__difficultyChart = new Chart(ctx, { type: 'bar', data: chartData, options: chartOpts });
    }
    return true;
  }
  return false;
}

function _drawRoundedBarsFallback(canvas, data) {
  const colors = _difficultyColors().map((c) => c.bg);
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth,
    H = canvas.clientHeight || 160;
  if (canvas.width !== W * dpr) canvas.width = W * dpr;
  if (canvas.height !== H * dpr) canvas.height = H * dpr;

  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const values = data.values;
  const n = values.length;
  const padX = 14;
  const gap = 6;
  const maxVal = Math.max(1, Math.max(...values));
  const plotW = W - padX * 2;
  const barW = (plotW - gap * (n - 1)) / n;
  const baseY = H - 8;
  const topPad = 8;
  const radius = 8;

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 3; i++) {
    const y = topPad + (baseY - topPad) * (i / 3);
    ctx.beginPath();
    ctx.moveTo(padX, y);
    ctx.lineTo(W - padX, y);
    ctx.stroke();
  }

  for (let i = 0; i < n; i++) {
    const x = padX + i * (barW + gap);
    const h = Math.max(2, (values[i] / maxVal) * (baseY - topPad));
    const y = baseY - h;

    const r = Math.min(radius, h * 0.6, barW * 0.48);
    ctx.fillStyle = colors[i];

    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.lineTo(x + barW - r, y);
    ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
    ctx.lineTo(x + barW, baseY);
    ctx.closePath();
    ctx.fill();
  }
}

function setupRatingDropdown() {
  const rateQuestion = document.querySelector('.ptmodal-ratequestion');
  const dropdown = document.querySelector('.ptmodal-ratedropdown');
  if (!rateQuestion || !dropdown) return;

  const canVote = rateQuestion.dataset.canVote === '1';
  const threadId = (rateQuestion.dataset.threadId || '').trim();
  const code = (rateQuestion.dataset.code || '').trim();
  const userId = (
    rateQuestion.dataset.userId ||
    (typeof window !== 'undefined' ? String(window.user_id || '') : '')
  ).trim();
  const votersCsv = rateQuestion.dataset.voters || '';
  let initialVoters = votersCsv
    ? votersCsv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const difficulties = [
    'Easy -',
    'Easy',
    'Easy +',
    'Medium -',
    'Medium',
    'Medium +',
    'Hard -',
    'Hard',
    'Hard +',
    'Very Hard -',
    'Very Hard',
    'Very Hard +',
    'Extreme -',
    'Extreme',
    'Extreme +',
    'Hell',
  ];

  const labelToRange = {
    'Easy -': [0.0, 1.18],
    Easy: [1.18, 1.76],
    'Easy +': [1.76, 2.35],
    'Medium -': [2.35, 2.94],
    Medium: [2.94, 3.53],
    'Medium +': [3.53, 4.12],
    'Hard -': [4.12, 4.71],
    Hard: [4.71, 5.29],
    'Hard +': [5.29, 5.88],
    'Very Hard -': [5.88, 6.47],
    'Very Hard': [6.47, 7.06],
    'Very Hard +': [7.06, 7.65],
    'Extreme -': [7.65, 8.24],
    Extreme: [8.24, 8.82],
    'Extreme +': [8.82, 9.41],
    Hell: [9.41, 10.0],
  };
  const mid = (arr) => +((arr[0] + arr[1]) / 2).toFixed(2);

  const dotClass = (label) => {
    const L = String(label).toLowerCase();
    if (L.startsWith('easy')) return 'bg-emerald-400';
    if (L.startsWith('medium')) return 'bg-yellow-400';
    if (L.startsWith('hard') && !L.startsWith('very')) return 'bg-orange-400';
    if (L.startsWith('very hard')) return 'bg-orange-500';
    if (L.startsWith('extreme')) return 'bg-red-500';
    if (L.startsWith('hell')) return 'bg-rose-500';
    return 'bg-zinc-400';
  };

  dropdown.innerHTML = difficulties
    .map(
      (d, i) => `
    <div
      class="ptmodal-ratedropitem flex items-center gap-2 px-3 py-2 text-sm text-zinc-200 cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:outline-none"
      data-value="${d}"
      role="menuitem"
      tabindex="${i === 0 ? 0 : -1}"
    >
      <span class="inline-block h-2.5 w-2.5 rounded-full ${dotClass(d)} ring-1 ring-inset ring-white/20"></span>
      <span class="truncate">${d}</span>
    </div>
  `
    )
    .join('');

  const chevronSvg = rateQuestion.querySelector('.chevron-svg');

  const open = () => {
    if (!canVote) return;
    dropdown.classList.remove('hidden');
    rateQuestion.setAttribute('aria-expanded', 'true');
    if (chevronSvg) chevronSvg.classList.add('rotate-180');
    dropdown.querySelector('.ptmodal-ratedropitem')?.focus();
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
  };

  const close = () => {
    dropdown.classList.add('hidden');
    rateQuestion.setAttribute('aria-expanded', 'false');
    if (chevronSvg) chevronSvg.classList.remove('rotate-180');
    document.removeEventListener('mousedown', onDocClick);
    document.removeEventListener('keydown', onEsc);
    rateQuestion.focus();
  };

  const toggle = () => (dropdown.classList.contains('hidden') ? open() : close());

  const onDocClick = (e) => {
    if (!dropdown.contains(e.target) && !rateQuestion.contains(e.target)) close();
  };
  const onEsc = (e) => {
    if (e.key === 'Escape') close();
  };

  rateQuestion.addEventListener('click', (e) => {
    if (!canVote) return;
    if (e.target.closest('.ptmodal-ratedropdown')) return;
    toggle();
  });
  rateQuestion.addEventListener('keydown', (e) => {
    if (!canVote) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
    if (e.key === 'ArrowDown' && dropdown.classList.contains('hidden')) {
      e.preventDefault();
      open();
    }
  });

  async function sendVote(selectedLabel) {
    if (!threadId || !userId) {
      showErrorMessage(t('errors.server_unreachable'));
      return;
    }
    const range = labelToRange[selectedLabel];
    if (!range) {
      showErrorMessage(t('errors.invalid_form'));
      return;
    }

    const difficultyValue = mid(range);
    const { baseCount, baseAvg } = _readVoteStatsFromDOM();
    const inDom = !!document.querySelector(
      `#votersMount [data-voter-row][data-user-id="${typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(userId) : userId}"]`
    );
    const alreadyVoted = initialVoters.includes(userId) || inDom;

    try {
      const resp = await fetch(
        `/api/maps/playtests/${encodeURIComponent(threadId)}/vote/${encodeURIComponent(userId)}`,
        {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ difficulty: difficultyValue }),
        }
      );

      let json = null;
      try {
        json = await resp.json();
      } catch {}

      if (!resp.ok) {
        const msg = (json && (json.error || json.message)) || `HTTP ${resp.status}`;
        showErrorMessage(msg);
        return;
      }

      showConfirmationMessage(
        alreadyVoted
          ? t('playtest.vote_updated') || 'Votre vote a été mis à jour.'
          : t('playtest.vote_recorded') || 'Vote enregistré !'
      );

      const apiCount =
        json && json.playtest && typeof json.playtest.vote_count === 'number'
          ? json.playtest.vote_count
          : null;
      const apiAvg =
        json && json.playtest && typeof json.playtest.vote_average === 'number'
          ? json.playtest.vote_average
          : null;

      const nextCount = Number.isFinite(apiCount) ? apiCount : baseCount + (alreadyVoted ? 0 : 1);
      const nextAvg = Number.isFinite(apiAvg)
        ? apiAvg
        : Number.isFinite(baseAvg)
          ? alreadyVoted
            ? baseAvg
            : (baseAvg * baseCount + difficultyValue) / Math.max(1, baseCount + 1)
          : difficultyValue;

      if (!alreadyVoted) {
        try {
          await appendVoterToModal(userId);
        } catch {}
        initialVoters.push(userId);
        rateQuestion.dataset.voters = initialVoters.join(',');
      }

      bumpVoteCountersInModal({
        countDelta: 0,
        newCount: nextCount,
        newAvg: nextAvg,
        onlyOnce: true,
      });
      if (code) {
        const fresh = await fetchFreshMapByCode(code);
        if (fresh) {
          if (Number.isFinite(fresh.playtest_vote_average)) {
            updateDifficultyChartInModal(fresh.playtest_vote_average);
          }
          if (Number.isFinite(fresh.playtest_vote_count)) {
            bumpVoteCountersInModal({
              countDelta: 0,
              newCount: fresh.playtest_vote_count,
              newAvg: fresh.playtest_vote_average,
              onlyOnce: false,
            });
          }
        }
      }
    } catch (e) {
      showErrorMessage(t('errors.server_unreachable'));
    }
  }

  dropdown.addEventListener('click', async (e) => {
    const item = e.target.closest('.ptmodal-ratedropitem');
    if (!item) return;
    const selected = item.getAttribute('data-value');
    close();
    await sendVote(selected);
  });

  dropdown.addEventListener('keydown', async (e) => {
    const items = Array.from(dropdown.querySelectorAll('.ptmodal-ratedropitem'));
    if (!items.length) return;

    const idx = items.findIndex((el) => el === document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const sel = document.activeElement?.getAttribute('data-value');
      if (sel) {
        close();
        await sendVote(sel);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  });

  if (!canVote) {
    dropdown.classList.add('hidden');
    rateQuestion.setAttribute('aria-disabled', 'true');
  }
}

document.addEventListener('mousedown', (e) => {
  const box = document.getElementById('pt-srMapCodeSuggestions');
  const input = document.getElementById('mapCodeInput');
  if (!box) return;

  const clickedInsideBox = box.contains(e.target);
  const clickedInput = input && (input === e.target || input.contains(e.target));

  if (!clickedInsideBox && !clickedInput) {
    box.style.display = 'none';
    box.classList.add('hidden');
  }
}, true);

async function appendVoterToModal(userId) {
  const modal = document.getElementById('playtestModalInner');
  const mount = modal?.querySelector('#votersMount');
  if (!mount) return;

  if (mount.querySelector(`[data-voter-row][data-user-id="${String(userId)}"]`)) return;

  if (mount.getAttribute('aria-busy') === 'true') {
    mount.innerHTML = '';
    mount.removeAttribute('aria-busy');
  }

  let list = mount.querySelector('.voters-list');
  if (!list) {
    list = document.createElement('div');
    list.className = 'voters-list flex flex-col gap-3';
    mount.appendChild(list);
  }

  const [avatar, name] = await Promise.all([
    fetchDiscordAvatar(userId),
    fetchUserPrimaryName(userId),
  ]);

  const row = document.createElement('div');
  row.className =
    'flex flex-col items-center text-center opacity-0 translate-y-1 transition-all duration-300';
  row.setAttribute('data-voter-row', '1');
  row.setAttribute('data-user-id', String(userId));
  row.innerHTML = `
    <img src="${avatar || 'assets/profile/default-avatar.png'}" alt="${name || '—'}"
         class="h-12 w-12 rounded-full object-cover ring-1 ring-white/10" loading="lazy">
    <span class="mt-1 text-sm text-zinc-200 font-medium truncate max-w-[120px]">${name || '—'}</span>
    <span class="text-[11px] text-zinc-500 truncate max-w-[120px]">${String(userId)}</span>
  `;
  list.appendChild(row);

  requestAnimationFrame(() => {
    row.classList.remove('opacity-0', 'translate-y-1');
  });
}

function _readVoteStatsFromDOM() {
  const countEl = document.querySelector('#ptVoteCount');
  const avgEl = document.querySelector('#ptVoteAvg');

  const baseCount = (() => {
    const n = parseInt((countEl?.textContent || '').replace(/[^\d]/g, ''), 10);
    return Number.isFinite(n) ? n : 0;
  })();

  const baseAvg = (() => {
    const raw = (avgEl?.textContent || '').replace(',', '.');
    const m = raw.match(/-?\d+(?:\.\d+)?/);
    const n = m ? parseFloat(m[0]) : NaN;
    return Number.isFinite(n) ? n : NaN;
  })();

  return { baseCount, baseAvg };
}

function bumpVoteCountersInModal({
  countDelta = 1,
  newCount = null,
  newAvg = null,
  onlyOnce = true,
} = {}) {
  const modal = document.getElementById('playtestModalInner');
  if (!modal) return;

  if (onlyOnce && modal.dataset.voteCountCommitted === '1') {
    if (newAvg != null && isFinite(newAvg)) {
      const avgEl = modal.querySelector('#ptVoteAvg');
      if (avgEl) avgEl.textContent = `avg ${Number(newAvg).toFixed(2)}`;
    }
    return;
  }

  const countEl =
    modal.querySelector('#ptVoteCount') || modal.querySelector('.text-3xl.font-semibold');
  if (countEl) {
    let finalCount;

    if (newCount != null && isFinite(newCount)) {
      finalCount = Number(newCount);
    } else {
      const votersMount = modal.querySelector('#votersMount');
      const listCount = votersMount ? votersMount.querySelectorAll('[data-voter-row]').length : NaN;
      finalCount =
        Number.isFinite(listCount) && listCount > 0
          ? listCount
          : (parseInt((countEl.textContent || '0').replace(/\D+/g, ''), 10) || 0) + countDelta;
    }

    countEl.textContent = String(finalCount);
  }

  const avgEl = modal.querySelector('#ptVoteAvg');
  if (avgEl && newAvg != null && isFinite(newAvg)) {
    avgEl.textContent = `avg ${Number(newAvg).toFixed(2)}`;
  }

  if (onlyOnce) {
    modal.dataset.voteCountCommitted = '1';
  }
}

async function preloadVoters(voterIds = []) {
  const ids = Array.from(new Set((Array.isArray(voterIds) ? voterIds : []).map((v) => String(v))));
  const out = Object.create(null);
  await Promise.all(
    ids.map(async (id) => {
      const [avatarUrl, displayName] = await Promise.all([
        fetchDiscordAvatar(id),
        fetchUserPrimaryName(id),
      ]);
      out[id] = {
        avatar: avatarUrl || 'assets/profile/default-avatar.png',
        name: displayName || '—',
      };
    })
  );
  return out;
}

function buildVotersGridHTML(preloaded, voterIds) {
  const esc = (s) => String(s ?? '');
  if (!voterIds?.length) {
    return `<div class="mt-2 text-xs text-zinc-400">"${t('playtest.no_votes')}"</div>`;
  }
  return `
    <div class="voters-list opacity-0 translate-y-1 transition-all duration-300 ease-out flex flex-col gap-3">
      ${voterIds.map((id) => {
        const key = String(id);
        const avatar = preloaded[key]?.avatar || 'assets/profile/default-avatar.png';
        const name = preloaded[key]?.name || '—';
        return `
          <div class="voter-card flex flex-col items-center text-center" data-voter-row data-user-id="${esc(key)}">
            <div class="avatar-wrap relative">
              <img
                src="${esc(avatar)}"
                alt="${esc(name)}"
                class="open-rank-card h-12 w-12 rounded-full object-cover ring-1 ring-white/10 cursor-pointer focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                data-user-id="${esc(key)}"
                loading="lazy"
              >
              <button
                type="button"
                class="copy-id-badge"
                data-copy-user-id="${esc(key)}"
                aria-label="Copy user id ${esc(key)}"
                title="${t('popup.copy')}"
              >
                <svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
                  <path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </button>
            </div>
            <button
              type="button"
              class="open-rank-card mt-1 max-w-[120px] truncate text-sm text-zinc-200 font-medium cursor-pointer focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
              data-user-id="${esc(key)}"
              title="${esc(name)}"
            >
              ${esc(name)}
            </button>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function injectVotersGrid(modalEl, preloaded, voterIds) {
  const mount = modalEl.querySelector('#votersMount');
  if (!mount) return;
  mount.setAttribute('aria-busy', 'false');
  mount.innerHTML = buildVotersGridHTML(preloaded, voterIds);
  const grid = mount.querySelector('.voters-list');
  if (grid) {
    requestAnimationFrame(() => {
      grid.classList.remove('opacity-0', 'translate-y-1');
    });
  }
}

const __avatarCache = new Map();
const __avatarInFlight = new Map();

async function fetchDiscordAvatar(user_id) {
  const id = String(user_id || '');
  if (!id) return DEFAULT_AVATAR;

  if (__avatarCache.has(id)) return __avatarCache.get(id);

  if (__avatarInFlight.has(id)) return __avatarInFlight.get(id);

  const p = (async () => {
    try {
      const response = await fetch(`/api/settings/user-avatar?user_id=${encodeURIComponent(id)}`);
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const json = await response.json();
      const url = json?.avatar_url || DEFAULT_AVATAR;
      __avatarCache.set(id, url);
      return url;
    } catch {
      __avatarCache.set(id, DEFAULT_AVATAR);
      return DEFAULT_AVATAR;
    } finally {
      __avatarInFlight.delete(id);
    }
  })();

  __avatarInFlight.set(id, p);
  return p;
}

async function fetchUserPrimaryName(user_id) {
  try {
    const resp = await fetch(`/api/users/${encodeURIComponent(user_id)}`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!resp.ok) return null;

    const json = await resp.json();

    const ow = Array.isArray(json?.overwatch_usernames)
      ? json.overwatch_usernames.filter(v => typeof v === 'string' && v.trim() !== '')
      : [];

    if (ow.length > 0) {
      return ow[0];
    }

    const nickname = typeof json?.nickname === 'string' ? json.nickname.trim() : '';
    return nickname || null;
  } catch {
    return null;
  }
}

function hidePlaytestModal() {
  const modal = document.getElementById('playtestModal');
  const modalInner = document.getElementById('playtestModalInner');
  if (!modal) return;

  if (modal.dataset.closing === '1') return;
  modal.dataset.closing = '1';

  modal.classList.remove('pt-in');
  modalInner?.classList.remove('pt-in');

  const DURATION = 240;
  setTimeout(() => {
    modal.classList.add('hidden');
    modal.dataset.closing = '0';
    if (modalInner) modalInner.innerHTML = '';
    closeGlobalDropdown();
  }, DURATION + 20);
}

function animatePtOpen({ animate = false } = {}) {
  const modal = document.getElementById('playtestModal');
  const inner = document.getElementById('playtestModalInner');
  if (!modal || !inner) return;

  const backdrop = modal.querySelector('.playtest-modal-backdrop');

  modal.classList.remove('hidden');

  if (!animate) {
    const els = [modal, inner, backdrop].filter(Boolean);
    els.forEach(el => { el.style.transition = 'none'; });

    modal.classList.add('pt-anim', 'pt-in');
    inner.classList.add('pt-anim', 'pt-in');

    if (backdrop) {
      backdrop.classList.add('pt-in');
      backdrop.style.opacity = '1';
      backdrop.style.pointerEvents = 'auto';
    }

    void modal.offsetWidth;
    els.forEach(el => { el.style.transition = ''; });
    return;
  }

  modal.classList.add('pt-anim');
  inner.classList.add('pt-anim');
  requestAnimationFrame(() => {
    modal.classList.add('pt-in');
    inner.classList.add('pt-in');
    if (backdrop) backdrop.classList.add('pt-in');
  });
}

function animatePtClose({ animate = false, duration = 240 } = {}) {
  const modal = document.getElementById('playtestModal');
  const inner = document.getElementById('playtestModalInner');
  if (!modal) return;
  const backdrop = modal.querySelector('.playtest-modal-backdrop');

  if (!animate) {
    modal.classList.remove('pt-in');
    inner?.classList.remove('pt-in');
    backdrop?.classList.remove('pt-in');
    modal.classList.add('hidden');
    if (inner) inner.innerHTML = '';
    return;
  }

  modal.classList.remove('pt-in');
  inner?.classList.remove('pt-in');
  setTimeout(() => {
    modal.classList.add('hidden');
    if (inner) inner.innerHTML = '';
  }, duration + 20);
}

function copyUserId(userId) {
  const msgOk = t('popup.user_id_copied', { id: userId });
  const msgKo = t('popup.copy_failed');
  copyTextToClipboard(String(userId)).then((ok) => {
    if (ok) showConfirmationMessage(msgOk);
    else showToast(msgKo, false);
  });
}

function registerVoterIdCopyTargets(root = document) {
  const nodes = root.querySelectorAll(
    '#votersMount .copy-user-id, #votersMount [data-copy-user-id], #votersMount [data-action="copy-id"]'
  );
  nodes.forEach((el) => {
    if (el.dataset.copyBound === '1') return;
    el.dataset.copyBound = '1';
    el.classList.add('cursor-pointer');

    if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');

    const getId = () =>
      el.getAttribute('data-user-id') ||
      el.getAttribute('data-copy-user-id') ||
      (el.textContent || '').trim();

    const handle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const uid = getId();
      if (uid) copyUserId(uid);
    };

    el.addEventListener('click', handle);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') handle(e);
    });
  });
}

function openRankCard(userId, newTab = false) {
  const url = `/rank_card?user_id=${encodeURIComponent(userId)}`;
  if (newTab) window.open(url, '_blank', 'noopener,noreferrer');
  else window.location.assign(url);
}

function registerVoterProfileTargets(root = document) {
  const nodes = root.querySelectorAll(
    '#votersMount .open-rank-card, #votersMount .voter-avatar, #votersMount .voter-name, #votersMount [data-open-rank-card],' +
    '.ptmodal-author .open-rank-card, .ptmodal-author [data-open-rank-card]'
  );
  nodes.forEach((el) => {
    if (el.dataset.profileBound === '1') return;
    el.dataset.profileBound = '1';
    el.classList.add('cursor-pointer');

    if (!el.hasAttribute('role')) el.setAttribute('role', 'link');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');

    const getId = () =>
      el.getAttribute('data-user-id') ||
      el.dataset.userId ||
      el.closest('[data-user-id]')?.getAttribute('data-user-id') ||
      '';

    const onClick = (e) => {
      const uid = getId();
      if (!uid) return;
      const newTab = e.ctrlKey || e.metaKey || e.button === 1;
      e.preventDefault();
      e.stopPropagation();
      openRankCard(uid, newTab);
    };

    el.addEventListener('click', onClick);
    el.addEventListener('auxclick', (e) => { if (e.button === 1) onClick(e); });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openRankCard(getId(), false);
      }
    });
  });
}

function registerVoterInteractions(root = document) {
  registerVoterIdCopyTargets(root);
  registerVoterProfileTargets(root);
}

async function postJSON(url, body, init = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const headers = new Headers(init.headers || {});
  if (!isFormData && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');

  if (CSRF && !headers.has('X-CSRF-TOKEN')) headers.set('X-CSRF-TOKEN', CSRF);

  const resp = await fetch(url, {
    method: 'POST',
    credentials: init.credentials || 'same-origin',
    headers,
    body: isFormData ? body : JSON.stringify(body ?? {}),
    ...init,
  }).catch((err) => {
    const message = err?.message || 'Network error';
    return {
      ok: false,
      status: 0,
      statusText: 'NETWORK_ERROR',
      url,
      headers: new Headers(),
      async json() { return { error: message }; },
      async text() { return message; },
    };
  });

  return resp;
}

function showConfirmDialog({
  title = 'Confirm action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText  = 'Cancel',
  confirmVariant,
  cancelVariant = 'rose',
  danger = false,
} = {}) {
  const pick = (v) => {
    switch (v) {
      case 'emerald': return 'bg-emerald-500 hover:bg-emerald-400';
      case 'rose':    return 'bg-rose-500 hover:bg-rose-400';
      default:        return 'bg-zinc-700 hover:bg-zinc-600';
    }
  };

  if (!confirmVariant && danger) confirmVariant = 'rose';
  if (!confirmVariant) confirmVariant = 'emerald';

  return new Promise((resolve) => {
    const existing = document.getElementById('__confirmOverlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = '__confirmOverlay';
    overlay.className =
      'fixed inset-0 z-[350] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    overlay.innerHTML = `
      <div class="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl ring-1 ring-white/10">
        <div class="px-4 py-3 border-b border-white/10">
          <h3 class="font-semibold text-sm">${title}</h3>
        </div>
        <div class="p-4 space-y-4">
          <p class="text-sm text-zinc-200">${message}</p>
          <div class="flex justify-end gap-2">
            <button class="btn-confirm cursor-pointer rounded-lg ${pick(confirmVariant)} text-white px-3 py-1.5 text-sm font-semibold">${confirmText}</button>
            <button class="btn-cancel cursor-pointer rounded-lg ${pick(cancelVariant)} text-white px-3 py-1.5 text-sm font-semibold">${cancelText}</button>
          </div>
        </div>
      </div>
    `;

    const close = (val) => { overlay.remove(); resolve(!!val); };

    document.body.appendChild(overlay);
    overlay.querySelector('.btn-confirm')?.addEventListener('click', () => close(true));
    overlay.querySelector('.btn-cancel')?.addEventListener('click', () => close(false));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(false); });
    document.addEventListener('keydown', function onKey(ev) {
      if (ev.key === 'Escape') { close(false); document.removeEventListener('keydown', onKey); }
      if (ev.key === 'Enter')  { close(true);  document.removeEventListener('keydown', onKey); }
    }, { once: true });
  });
}

/* =========================
   GRAPH MODAL
   ========================= */
function updateDifficultyChartInModal(avg) {
  const canvas = document.getElementById('difficultyChart');
  if (!canvas) return;

  if (avg == null || !isFinite(avg)) {
    _showDifficultySkeleton();
    return;
  }

  const weights = _bucketizeAverage(avg);
  const values = weights.map((w) => +(w * 100).toFixed(2));

  const ctx = canvas.getContext('2d');
  const usedChart = _ensureChartJsBarRounded(ctx, { values });

  if (!usedChart) {
    _drawRoundedBarsFallback(canvas, { values });
  }
  _hideDifficultySkeleton();
}

/* =========================
   PLAYTEST CARDS RENDER
   ========================= */
function renderPlaytestCard(data, index) {
  const esc = (s) =>
    String(s ?? '').replace(
      /[&<>"']/g,
      (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]
    );

  const toInt = (v) => {
    if (v == null) return null;
    const n = typeof v === 'string' ? Number(v) : v;
    return Number.isFinite(n) ? Math.trunc(n) : null;
  };

  const getVoteCount = (d) => {
    let n =
      toInt(d?.playtest?.vote_count) ??
      toInt(d?.playtest_vote_count) ??
      toInt(d?.vote_count) ??
      toInt(d?.votes);
    if (n != null) return n;

    if (Array.isArray(d?.playtest?.voters)) return d.playtest.voters.length;
    if (Array.isArray(d?.voters)) return d.voters.length;

    const raw = d?._raw ?? d?.__raw ?? d?.source ?? null;
    if (raw) {
      n = toInt(raw?.playtest?.vote_count) ?? toInt(raw?.vote_count);
      if (n != null) return n;
      if (Array.isArray(raw?.playtest?.voters)) return raw.playtest.voters.length;
      if (Array.isArray(raw?.voters)) return raw.voters.length;
    }
    return 0;
  };

  const getDifficultyLabel = (d) => d?.difficulty || d?.difficulty_label || '—';

  const getDifficultyValue = (d) => {
    const v = d?.difficulty_value ?? d?.playtest?.initial_difficulty ?? d?.raw_difficulty ?? null;
    return Number.isFinite(v) ? v : null;
  };

  const requiredVotesMap = {
    'Easy -': 5,
    Easy: 5,
    'Easy +': 5,
    'Medium -': 5,
    Medium: 5,
    'Medium +': 5,
    'Hard -': 4,
    Hard: 4,
    'Hard +': 4,
    'Very Hard -': 3,
    'Very Hard': 3,
    'Very Hard +': 3,
    'Extreme -': 2,
    Extreme: 2,
    'Extreme +': 2,
    Hell: 1,
  };

  const safe = {
    avatar: data.avatar || DEFAULT_AVATAR,
    banner: data.map_banner_url || 'assets/img/card-banner.png',
    creators: data.creator_names || '—',
    code: data.code || '—',
    name: data.name || '—',
  };

  const votes = getVoteCount(data);
  const diffLabel = getDifficultyLabel(data);
  const diffValue = getDifficultyValue(data);
  const diffCls = difficultyClasses(diffLabel, diffValue);

  const requiredVotes = requiredVotesMap[diffLabel] ?? '?';

  return `
    <article class="playtest-embed rounded-xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-900/80 transition cursor-pointer tr-sf-enter"
             data-ptidx="${index}" role="button" tabindex="0" aria-label="${esc(safe.name)}">
      <header class="flex items-center justify-between gap-3 p-3">
        <div class="flex items-center gap-2 min-w-0">
          <img src="${esc(safe.avatar)}" alt="Avatar" class="h-8 w-8 rounded-full object-cover ring-1 ring-white/10" loading="lazy">
          <div class="truncate">
            <span class="block text-sm font-semibold text-zinc-200 truncate">${esc(safe.creators)}</span>
            <span class="block text-xs text-zinc-400 truncate">${esc(safe.code)}</span>
          </div>
        </div>
        <img src="${esc(safe.banner)}" alt="Map banner"
             class="h-10 w-24 rounded-md object-cover shrink-0 ring-1 ring-white/10" loading="lazy">
      </header>

      <div class="px-3 pb-3">
        <div class="flex items-center justify-between gap-3">
          <div class="min-w-0">
            <div class="text-sm font-medium text-zinc-100 truncate" data-sf="${esc(safe.name)}"></div>
            <div class="mt-1 inline-flex items-center gap-2">
              <span class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${diffCls.chip}">
                <span class="inline-block h-1.5 w-1.5 rounded-full ${diffCls.dot}"></span>
                <span class="${diffCls.text} font-semibold">${esc(diffLabel)}</span>
              </span>
              ${Number.isFinite(diffValue) ? `<span class="text-[11px] text-zinc-400">(${diffValue.toFixed(2)})</span>` : ``}
            </div>
          </div>

          <div class="shrink-0" title="${votes} vote(s)">
            <span class="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-zinc-300">
              <svg class="h-3.5 w-3.5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5l-4 4V5a2 2 0 0 1 2-2h11"/>
              </svg>
              <span>${votes} / ${requiredVotes}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  `;
}

async function hydratePlaytestModalCreatorAvatar(root = document) {
  try {
    const img = root.querySelector('#ptModalCreatorAvatar[data-user-id]');
    if (!img) return;
    const uid = img.getAttribute('data-user-id') || '';
    if (!uid) return;
    const url = await fetchDiscordAvatar(uid);
    if (url && img.src !== url) img.src = url;
  } catch { /* fallback */ }
}

function mountModeratorActions(modalEl, playtest) {
  if (!window.CAN_MODERATE) return;
  const threadId = String(playtest?.playtest_thread_id || '').trim();
  if (!threadId) return;

  const me = (typeof window.user_id !== 'undefined' && window.user_id) ? String(window.user_id) : '';

  // ---------- helpers ----------
  const dotClass = (label) => {
    const L = String(label).toLowerCase();
    if (L.startsWith('easy')) return 'bg-emerald-400';
    if (L.startsWith('medium')) return 'bg-yellow-400';
    if (L.startsWith('hard') && !L.startsWith('very')) return 'bg-orange-400';
    if (L.startsWith('very hard')) return 'bg-orange-500';
    if (L.startsWith('extreme')) return 'bg-red-500';
    if (L.startsWith('hell')) return 'bg-rose-500';
    return 'bg-zinc-400';
  };
  const setBusy = (btn, on) => {
    if (!btn) return;
    btn.disabled = !!on;
    btn.classList.toggle('opacity-50', !!on);
    btn.classList.toggle('pointer-events-none', !!on);
    btn.setAttribute('aria-busy', on ? 'true' : 'false');
  };

  async function refreshModal() {
    try {
      const modal = document.getElementById('playtestModal');
      const modalInner = document.getElementById('playtestModalInner');
      if (!modal || !modalInner) return;

      const code = playtest?.code || '';
      const fresh = code ? await fetchFreshMapByCode(code) : null;
      const data = fresh || (typeof normalizePlaytest === 'function' ? normalizePlaytest(playtest) : playtest);

      modalInner.innerHTML = renderPlaytestModal(data);
      registerMapCodeCopyTargets(modal);
      setupRatingDropdown();
      await hydratePlaytestModalCreatorAvatar(modal);
      registerVoterProfileTargets(modal);
      mountModeratorActions(modalInner, data);

      try {
        const voterIds = Array.isArray(data.playtest_voters) ? data.playtest_voters : [];
        const pre = await preloadVoters(voterIds);
        injectVotersGrid(modal, pre, voterIds);
        registerVoterInteractions(modal);
      } catch {}
      const initialAvg = (() => {
        const raw = data.playtest_vote_average ?? data.playtest?.vote_average ?? data.vote_average;
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
      })();
      updateDifficultyChartInModal(
        initialAvg ?? (Number.isFinite(data.difficulty_value) ? data.difficulty_value : null)
      );
    } catch (e) {
      console.error('[PT Modal] refresh failed', e);
    }
  }

  let activeOpt = DIFFICULTY_FINE_OPTIONS.find(o => o.value === 'Medium') || DIFFICULTY_FINE_OPTIONS[0];

  const root = document.createElement('section');
  root.className = 'mt-4 rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-3 overflow-hidden';
  root.innerHTML = `
    <h3 class="mb-2 text-sm font-semibold text-emerald-300">Moderator actions</h3>

    <div class="ptmod-grid">
      <!-- Card: Approve -->
      <section class="ptmod-card">
        <h4>Approve</h4>
        <p class="text-xs text-zinc-400">Marks the playtest as approved and sets you as verifier.</p>
        <div class="ptmod-actions">
          <button type="button" id="ptModApprove"
            class="ptmod-btn cursor-pointer rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15">
            Approve (verifier = me)
          </button>
        </div>
      </section>

      <!-- Card: Force Accept -->
      <section class="ptmod-card">
        <h4>Force accept</h4>
        <p class="text-xs text-zinc-400">Force a difficulty and accept the playtest.</p>
        <div class="ptmod-actions">
          <div class="relative min-w-[180px]">
            <div id="ptmod-diffbutton"
              class="ptmod-diffbutton group flex w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 cursor-pointer hover:bg-zinc-900/60 select-none"
              role="button" tabindex="0" aria-haspopup="menu" aria-expanded="false">
              <div class="inline-flex items-center gap-2 min-w-0">
                <span class="inline-block h-2.5 w-2.5 rounded-full ${dotClass(activeOpt.raw)} ring-1 ring-inset ring-white/20 shrink-0"></span>
                <span id="ptmod-difflabel" class="truncate">${activeOpt.text()}</span>
              </div>
              <svg class="chevron-svg h-4 w-4 opacity-80 transition-transform shrink-0" viewBox="0 0 22 22" aria-hidden="true">
                <path fill="currentColor" d="M7.41 8.59 11 12.17l3.59-3.58L16 10l-5 5-5-5z"></path>
              </svg>
            </div>

            <div id="ptmod-diffmenu"
              class="ptmod-diffmenu absolute left-0 right-0 top-[calc(100%+8px)] bottom-auto z-[70] hidden max-h-[260px] overflow-y-auto rounded-xl border border-white/10 bg-zinc-900/95 shadow-2xl ring-1 ring-white/10 backdrop-blur-md p-1.5"
              role="menu" aria-label="Select difficulty">
              ${DIFFICULTY_FINE_OPTIONS.map((o, i) => `
                <div
                  class="ptmod-diffitem flex items-center gap-2 px-3 py-2 text-sm text-zinc-200 cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:outline-none rounded-lg"
                  data-value="${o.value}" data-raw="${o.raw}" role="menuitem" tabindex="${i === 0 ? 0 : -1}">
                  <span class="inline-block h-2.5 w-2.5 rounded-full ${dotClass(o.raw)} ring-1 ring-inset ring-white/20"></span>
                  <span class="truncate">${o.text()}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <button type="button" id="ptModForceAccept"
            class="ptmod-btn cursor-pointer rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15">
            Force Accept
          </button>
        </div>
      </section>

      <!-- Card: Force Deny -->
      <section class="ptmod-card">
        <h4>Force deny</h4>
        <p class="text-xs text-zinc-400">Reject the playtest with an explicit reason.</p>
        <div class="ptmod-actions">
          <input id="ptModDenyReason" type="text" placeholder="Reason…" maxlength="200"
            autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
            class="rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none">
          <button type="button" id="ptModForceDeny"
            class="ptmod-btn cursor-pointer rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15">
            Force Deny
          </button>
        </div>
      </section>

      <!-- Card: Reset -->
      <section class="ptmod-card">
        <h4>Reset playtest</h4>
        <p class="text-xs text-zinc-400">Reset state and optionally remove votes/completions.</p>
        <div class="ptmod-actions">
          <input id="ptModResetReason" type="text" placeholder="Reset reason…"
            autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
            class="rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none">
          <label class="text-sm text-zinc-300 inline-flex items-center gap-1">
            <input id="ptModResetVotes" type="checkbox" class="accent-emerald-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"> remove votes
          </label>
          <label class="text-sm text-zinc-300 inline-flex items-center gap-1">
            <input id="ptModResetCompletions" type="checkbox" class="accent-emerald-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"> remove completions
          </label>
          <button type="button" id="ptModReset"
            class="ptmod-btn cursor-pointer rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15">
            Reset Playtest
          </button>
        </div>
      </section>

      <!-- Card: Votes -->
      <section class="ptmod-card">
        <h4>Votes</h4>
        <p class="text-xs text-zinc-400">Remove one user vote or purge all votes.</p>
        <div class="ptmod-actions">
          <input id="ptModDeleteVoteUser" type="text" inputmode="numeric" placeholder="User ID to delete vote…"
            autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
            class="rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none">
          <button type="button" id="ptModDeleteVote"
            class="ptmod-btn cursor-pointer rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15">
            Delete user vote
          </button>
          <button type="button" id="ptModDeleteAllVotes"
            class="ptmod-btn cursor-pointer rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15">
            Delete all votes
          </button>
        </div>
      </section>
    </div>
  `;

  modalEl.appendChild(root);

  // ---------- Dropdown ----------
  const diffBtn   = root.querySelector('#ptmod-diffbutton');
  const diffMenu  = root.querySelector('#ptmod-diffmenu');
  const diffLabel = root.querySelector('#ptmod-difflabel');
  const chevron   = diffBtn?.querySelector('.chevron-svg');

  const open = () => {
    diffMenu.classList.remove('hidden');
    diffBtn.setAttribute('aria-expanded', 'true');
    if (chevron) chevron.classList.add('rotate-180');
    diffMenu.querySelector('.ptmod-diffitem')?.focus();
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
  };
  const close = () => {
    diffMenu.classList.add('hidden');
    diffBtn.setAttribute('aria-expanded', 'false');
    if (chevron) chevron.classList.remove('rotate-180');
    document.removeEventListener('mousedown', onDocClick);
    document.removeEventListener('keydown', onEsc);
    diffBtn.focus();
  };
  const toggle = () => (diffMenu.classList.contains('hidden') ? open() : close());
  const onDocClick = (e) => { if (!diffMenu.contains(e.target) && !diffBtn.contains(e.target)) close(); };
  const onEsc = (e) => { if (e.key === 'Escape') close(); };

  diffBtn?.addEventListener('click', toggle);
  diffBtn?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });

  diffMenu?.addEventListener('click', (e) => {
    const item = e.target.closest('.ptmod-diffitem');
    if (!item) return;
    const val = item.dataset.value;
    const raw = item.dataset.raw;
    const opt = DIFFICULTY_FINE_OPTIONS.find(o => o.value === val) || activeOpt;
    activeOpt = opt;
    diffLabel.textContent = opt.text();
    const dot = diffBtn.querySelector('span.rounded-full');
    if (dot) {
      dot.className = `inline-block h-2.5 w-2.5 rounded-full ${dotClass(raw)} ring-1 ring-inset ring-white/20`;
    }
    close();
  });

  // ---------- Actions ----------
  // Approve
  root.querySelector('#ptModApprove')?.addEventListener('click', async (ev) => {
    const ok = await showConfirmDialog({
      title: 'Approve playtest',
      message: 'Approve this playtest and set yourself as verifier?',
      confirmText: 'Yes, approve',
      cancelText: 'Cancel',
      confirmVariant: 'emerald',
      cancelVariant: 'rose',
    });
    if (!ok) return;

    const btn = ev.currentTarget;
    try {
      setBusy(btn, true);
      const r = await postJSON(`/api/mods/playtests/${encodeURIComponent(threadId)}/approve`, {
        verifier_id: Number(me || '0'),
      });
      const j = await (async () => { try { return await r.json(); } catch { return null; } })();
      if (r.ok) { showConfirmationMessage('Playtest approved.'); await refreshModal(); }
      else { showErrorMessage(j?.message || `HTTP ${r.status}`); }
    } catch { showErrorMessage('Network error'); }
    finally { setBusy(btn, false); }
  });

  // Force Accept
  root.querySelector('#ptModForceAccept')?.addEventListener('click', async (ev) => {
    const ok = await showConfirmDialog({
      title: 'Force accept',
      message: `Force-accept with difficulty “${activeOpt?.text?.() || activeOpt?.value || '—'}”?`,
      confirmText: 'Yes, force accept',
      cancelText: 'Cancel',
      confirmVariant: 'emerald',
      cancelVariant: 'rose',
    });
    if (!ok) return;

    const btn = ev.currentTarget;
    try {
      setBusy(btn, true);
      const r = await postJSON(`/api/mods/playtests/${encodeURIComponent(threadId)}/force_accept`, {
        difficulty: activeOpt.value,
        verifier_id: Number(me || '0'),
      });
      const j = await (async () => { try { return await r.json(); } catch { return null; } })();
      if (r.ok) { showConfirmationMessage('Forced acceptance recorded.'); await refreshModal(); }
      else { showErrorMessage(j?.message || `HTTP ${r.status}`); }
    } catch { showErrorMessage('Network error'); }
    finally { setBusy(btn, false); }
  });

  // Force Deny
  root.querySelector('#ptModForceDeny')?.addEventListener('click', async (ev) => {
    const btn = ev.currentTarget;
    const reason = root.querySelector('#ptModDenyReason')?.value.trim() || '';
    if (!reason) return showWarningMessage('Reason is required.');

    const ok = await showConfirmDialog({
      title: 'Force deny playtest',
      message: `Force deny with reason: “${reason}”?`,
      confirmText: 'Yes, deny',
      cancelText: 'Cancel',
      confirmVariant: 'emerald',
      cancelVariant: 'rose',
    });
    if (!ok) return;

    try {
      setBusy(btn, true);
      const r = await postJSON(`/api/mods/playtests/${encodeURIComponent(threadId)}/force_deny`, {
        reason,
        verifier_id: Number(me || '0'),
      });
      const j = await (async () => { try { return await r.json(); } catch { return null; } })();
      if (r.ok) { showConfirmationMessage('Playtest denied.'); await refreshModal(); }
      else { showErrorMessage(j?.message || `HTTP ${r.status}`); }
    } catch { showErrorMessage('Network error'); }
    finally { setBusy(btn, false); }
  });

  // Reset Playtest
  root.querySelector('#ptModReset')?.addEventListener('click', async (ev) => {
    const btn = ev.currentTarget;
    const reason = root.querySelector('#ptModResetReason')?.value.trim() || '';
    const removeVotes = !!root.querySelector('#ptModResetVotes')?.checked;
    const removeCompletions = !!root.querySelector('#ptModResetCompletions')?.checked;
    if (!reason) return showWarningMessage('Reason is required.');

    const ok = await showConfirmDialog({
      title: 'Reset playtest',
      message: `Reset this playtest?\nReason: “${reason}”\nRemove votes: ${removeVotes ? 'yes' : 'no'} • Remove completions: ${removeCompletions ? 'yes' : 'no'}`,
      confirmText: 'Yes, reset',
      cancelText: 'Cancel',
      danger: true,
      cancelVariant: 'rose',
    });
    if (!ok) return;

    try {
      setBusy(btn, true);
      const r = await postJSON(`/api/mods/playtests/${encodeURIComponent(threadId)}/reset`, {
        reason,
        remove_votes: removeVotes,
        remove_completions: removeCompletions,
        verifier_id: Number(me || '0'),
      });
      const j = await (async () => { try { return await r.json(); } catch { return null; } })();
      if (r.ok) { showConfirmationMessage('Playtest reset.'); await refreshModal(); }
      else { showErrorMessage(j?.message || `HTTP ${r.status}`); }
    } catch { showErrorMessage('Network error'); }
    finally { setBusy(btn, false); }
  });

  // Delete user vote
  root.querySelector('#ptModDeleteVote')?.addEventListener('click', async (ev) => {
    const btn = ev.currentTarget;
    const uid = (root.querySelector('#ptModDeleteVoteUser')?.value || '').trim();
    if (!uid) return showWarningMessage('User ID is required.');

    const ok = await showConfirmDialog({
      title: 'Delete user vote',
      message: `Delete vote for user ${uid}?`,
      confirmText: 'Yes, delete',
      cancelText: 'Cancel',
      danger: true,
      cancelVariant: 'rose',
    });
    if (!ok) return;

    try {
      setBusy(btn, true);
      const r = await fetch(
        `/api/mods/playtests/${encodeURIComponent(threadId)}/vote/${encodeURIComponent(uid)}`,
        {
          method: 'DELETE',
          headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          credentials: 'same-origin',
        }
      );
      const j = await (async () => { try { return await r.json(); } catch { return null; } })();
      if (r.ok) { showConfirmationMessage('Vote deleted.'); await refreshModal(); }
      else { showErrorMessage(j?.message || `HTTP ${r.status}`); }
    } catch { showErrorMessage('Network error'); }
    finally { setBusy(btn, false); }
  });

  // Delete all votes
  root.querySelector('#ptModDeleteAllVotes')?.addEventListener('click', async (ev) => {
    const ok = await showConfirmDialog({
      title: 'Delete all votes',
      message: 'Are you sure you want to DELETE ALL votes for this playtest? This action cannot be undone.',
      confirmText: 'Yes, delete all',
      cancelText: 'Cancel',
      danger: true,
      cancelVariant: 'rose',
    });
    if (!ok) return;

    const btn = ev.currentTarget;
    try {
      setBusy(btn, true);
      const r = await fetch(
        `/api/mods/playtests/${encodeURIComponent(threadId)}/vote`,
        {
          method: 'DELETE',
          headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          credentials: 'same-origin',
        }
      );
      const j = await (async () => { try { return await r.json(); } catch { return null; } })();
      if (r.ok) { showConfirmationMessage('All votes deleted.'); await refreshModal(); }
      else { showErrorMessage(j?.message || `HTTP ${r.status}`); }
    } catch { showErrorMessage('Network error'); }
    finally { setBusy(btn, false); }
  });
}

/* =========================
   PLAYTEST MODAL
   ========================= */
function renderPlaytestModal(data) {
  const esc = (s) =>
    String(s ?? '').replace(
      /[&<>"']/g,
      (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]
    );

  const voteCount = Number.isFinite(data.playtest_vote_count) ? data.playtest_vote_count : 0;
  const voteAvg = (() => {
    const raw = data.playtest_vote_average ?? data.playtest?.vote_average ?? data.vote_average;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  })();

  const medals = data.medals;
  const title = data.title;
  const time = data.time;
  const canVote = time != null;
  const uid = typeof window !== 'undefined' && window.user_id != null ? String(window.user_id) : '';

  const diffCls = difficultyClasses(data.difficulty, data.difficulty_value);

  const medalClasses = (key) => {
    const k = String(key).toLowerCase();
    if (k.includes('gold')) return 'border-yellow-300/30 bg-yellow-400/10 text-yellow-200';
    if (k.includes('silver')) return 'border-slate-300/30 bg-slate-200/10 text-slate-200';
    if (k.includes('bronze')) return 'border-amber-500/30 bg-amber-600/10 text-amber-200';
    return 'border-amber-300/25 bg-amber-400/10 text-amber-200';
  };
  const guideBadges = (() => {
    const g = data.guide_urls;
    if (g == null) return '';

  const btn = (href, i = null) => `
    <a href="${esc(href)}" target="_blank" rel="noopener"
      class="inline-flex h-8 items-center justify-center rounded-lg border border-sky-300/25 bg-sky-400/10 px-3 text-xs text-sky-200 leading-none hover:text-sky-100 hover:bg-sky-400/20 focus:outline-none focus:ring-1 focus:ring-sky-300/40 transition"
      title="${t('map.guide_label') || 'Guide'}">
      ${t('map.guide_label') || 'Guide'}${i != null ? ` ${i}` : ''}
    </a>`;

    if (Array.isArray(g)) {
      return g
        .filter(Boolean)
        .map((href, i) => btn(href, i + 1))
        .join('');
    }
    if (typeof g === 'string' && g.trim() !== '') {
      return btn(g);
    }
    return '';
  })();

  const medalsHtml = (() => {
    if (medals == null) return '';

    if (Array.isArray(medals)) {
      return medals
        .map(
          (m) =>
            `<span class="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs ${medalClasses(m)}">${esc(m)}</span>`
        )
        .join('');
    }

    if (typeof medals === 'object') {
      const entries = Object.entries(medals);
      if (!entries.length) return '';
      return entries
        .map(([k, v]) => {
          const val = Number(v);
          const pretty = Number.isFinite(val)
            ? val.toLocaleString(undefined, { maximumFractionDigits: 2 })
            : esc(String(v));
          const label = String(k).replace(/_/g, ' ');
          const labelCap = label.charAt(0).toUpperCase() + label.slice(1);
          return `<span class="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs ${medalClasses(k)}">${esc(labelCap)}: ${pretty}</span>`;
        })
        .join('');
    }

    return `<span class="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs ${medalClasses(medals)}">${esc(String(medals))}</span>`;
  })();

  const codeBadge =
    data.code && String(data.code).trim() !== ''
      ? `
        <button type="button"
                class="copy-map-code inline-flex h-8 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 text-xs font-mono text-emerald-200 leading-none cursor-pointer hover:text-emerald-100 focus:outline-none focus:ring-1 focus:ring-emerald-400/40 transition"
                data-code="${esc(data.code)}"
                title="${t('popup.click_to_copy_map_code') || 'Click to copy'}"
                aria-label="${t('popup.click_to_copy_map_code') || 'Click to copy'}">
          ${esc(data.code)}
        </button>`
      : `<span class="inline-flex h-8 items-center rounded-lg border border-white/15 bg-white/10 px-3 text-xs text-zinc-200 leading-none">—</span>`;

  const votersMount = `
    <div id="votersMount"
     class="mt-3 max-h-[300px] w-full overflow-y-hidden overflow-x-hidden pr-1 pt-2 overscroll-contain scrollbar-stable">
      <div class="max-h-[160px] overflow-hidden">
        <div class="space-y-2.5" aria-busy="true" aria-live="polite">
          <div class="h-3.5 w-20 rounded bg-white/10 animate-pulse"></div>
          <div class="flex flex-col gap-2.5">
            ${Array.from({ length: 4 })
              .map(
                () => `
              <div class="flex flex-col items-center text-center">
                <div class="h-10 w-10 shrink-0 rounded-full bg-white/10 animate-pulse"></div>
                <div class="mt-1 h-2.5 w-20 max-w-full rounded bg-white/10 animate-pulse"></div>
                <div class="mt-1 h-2.5 w-24 max-w-full rounded bg-white/10 animate-pulse"></div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  return `
    <!-- HERO -->
    <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
      <div class="absolute inset-0">
        <img src="${esc(data.map_banner_url || 'assets/img/card-banner.png')}" alt=""
             class="h-full w-full object-cover opacity-40">
        <div class="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
      </div>
      <div class="relative z-10 p-4 sm:p-5">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0 ptmodal-author"
              data-user-id="${esc(data.primary_creator_id || '')}">
            <img id="ptModalCreatorAvatar"
                src="${esc(data.avatar || DEFAULT_AVATAR)}"
                data-user-id="${esc(data.primary_creator_id || '')}"
                alt="Creator avatar"
                class="open-rank-card h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
                loading="lazy"
                role="link" tabindex="0">
            <div class="min-w-0">
              <button type="button"
                      class="open-rank-card truncate text-sm font-semibold text-zinc-100"
                      data-user-id="${esc(data.primary_creator_id || '')}"
                      title="${esc(data.creator_names || '—')}"
                      role="link" tabindex="0">
                ${esc(data.creator_names || '—')}
              </button>
              <div class="text-xs text-zinc-400">${t('playtest.title_suffix')}</div>
            </div>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            ${codeBadge}
            ${guideBadges}
            ${data.category ? `<span class="inline-flex h-8 items-center rounded-lg border border-white/15 bg-white/10 px-3 text-xs text-zinc-200 leading-none">
              ${esc(data.category)}
            </span>` : ''}
          </div>
        </div>

        <div class="mt-3 flex flex-wrap items-center gap-3">
          <span class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${diffCls.chip}">
            <span class="inline-block h-1.5 w-1.5 rounded-full ${diffCls.dot}"></span>
            <span class="${diffCls.text} font-semibold">${esc(data.difficulty || '—')}</span>
          </span>
          ${Number.isFinite(data.difficulty_value) ? `<span class="text-xs text-zinc-300">( ${data.difficulty_value.toFixed(2)} )</span>` : ''}
          ${title != null ? `<span class="ml-2 rounded-md border border-emerald-300/25 bg-emerald-400/10 px-2 py-0.5 text-[11px] text-emerald-200">“${esc(title)}”</span>` : ''}
          ${time != null ? `<span class="ml-1 rounded-md border border-sky-300/25 bg-sky-400/10 px-2 py-0.5 text-[11px] text-sky-200">${t('record.time_label') || 'Time'}: ${esc(time)}</span>` : ''}
          ${medals != null ? `<div class="ml-1 flex flex-wrap gap-1">${medalsHtml}</div>` : ''}
        </div>
      </div>
    </div>

    <!-- CONTAINER 3 : infos (1) + votes (2) -->
    <div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">

      <!-- CONTAINER 1 : name / checkpoints / mechanics / restrictions -->
      <section class="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div class="grid grid-cols-1 gap-2">
          <div class="flex items-start justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <span class="text-[11px] uppercase tracking-wide text-zinc-400">${t('table.map_name')}</span>
            <span class="ml-2 flex-1 min-w-0 whitespace-normal break-words text-sm text-zinc-100 text-right">${esc(data.name || '—')}</span>
          </div>
          <div class="flex items-start justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <span class="text-[11px] uppercase tracking-wide text-zinc-400">${t('table.checkpoints')}</span>
            <span class="text-sm text-zinc-100">${Number.isFinite(data.checkpoints) ? esc(data.checkpoints) : '—'}</span>
          </div>
        </div>

        <div class="rounded-xl border border-white/10 bg-white/5 p-3">
          <div class="text-[11px] uppercase tracking-wide text-zinc-400">${t('table.mechanics')}</div>
          <div class="mt-2 flex flex-wrap gap-1.5">
            ${
              Array.isArray(data.mechanics) && data.mechanics.length
                ? data.mechanics
                    .map(
                      (m) =>
                        `<span class="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-200">${esc(m)}</span>`
                    )
                    .join('')
                : `<i class="text-sm text-zinc-400">None</i>`
            }
          </div>
        </div>

        <div class="rounded-xl border border-white/10 bg-white/5 p-3">
          <div class="text-[11px] uppercase tracking-wide text-zinc-400">${t('table.restrictions')}</div>
          <div class="mt-2 flex flex-wrap gap-1.5">
            ${
              Array.isArray(data.restrictions) && data.restrictions.length
                ? data.restrictions
                    .map(
                      (r) =>
                        `<span class="inline-flex items-center rounded-full border border-rose-400/20 bg-rose-500/10 px-2 py-0.5 text-xs text-rose-200">${esc(r)}</span>`
                    )
                    .join('')
                : `<i class="text-sm text-zinc-400">None</i>`
            }
          </div>
        </div>
      </section>

      <!-- CONTAINER 2 : votes  -->
      <aside class="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-4">
        <div class="flex items-baseline justify-between">
          <div class="text-[11px] uppercase tracking-wide text-zinc-400">${t('playtest.votes') || 'Votes'}</div>
          <div id="ptVoteAvg" class="text-xs text-zinc-400">${voteAvg != null ? `avg ${voteAvg.toFixed(2)}` : ''}</div>
        </div>
        <div id="ptVoteCount" class="mt-1 text-3xl font-semibold tracking-tight text-zinc-100">${voteCount}</div>

        <!-- Scrollport avatars -->
        <div class="mt-3 flex-1 min-h-0">
          ${votersMount}
        </div>
      </aside>
    </div>

    <div id="ptCtaWrap"
        class="sticky bottom-3 z-[5] flex justify-center transition-all duration-200 opacity-0 translate-y-1 pointer-events-none">
      <button
        id="ptCtaDown"
        type="button"
        class="pointer-events-auto cursor-pointer inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 hover:bg-white/20 backdrop-blur px-3 py-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/60 pt-chev-bob">
        <svg class="h-5 w-5 text-zinc-200" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M7.41 8.59 12 13.17 16.59 8.59 18 10l-6 6-6-6z"/>
        </svg>
      </button>
    </div>

    <!-- CONTAINER 4 : difficulty rating -->
    <div id="ptDifficultySection" class="mt-4 rounded-2xl border border-white/10 bg-white/5">
      <div class="flex items-center justify-between gap-3 border-b border-white/10 p-3">
        <div>
          <div class="text-sm font-semibold text-zinc-100">${t('playtest.difficulty_rating')}</div>
          <div class="text-xs text-zinc-400">${t('playtest.rating_sub')}</div>
        </div>
        <div class="text-sm text-zinc-300">${voteAvg != null ? `avg ${voteAvg.toFixed(2)}` : ''}</div>
      </div>

      <div class="p-3">
        <div class="relative rounded-xl border border-white/10 bg-zinc-900/50 p-2">
          <div id="difficultyChartSkeleton"
              class="pointer-events-none absolute inset-0 flex items-end gap-1.5 p-3">
            <div class="h-[36%] flex-1 rounded-t-md bg-white/10 animate-pulse"></div>
            <div class="h-[58%] flex-1 rounded-t-md bg-white/10 animate-pulse"></div>
            <div class="h-[72%] flex-1 rounded-t-md bg-white/10 animate-pulse"></div>
            <div class="h-[64%] flex-1 rounded-t-md bg-white/10 animate-pulse"></div>
            <div class="h-[44%] flex-1 rounded-t-md bg-white/10 animate-pulse"></div>
            <div class="h-[28%] flex-1 rounded-t-md bg-white/10 animate-pulse"></div>
          </div>

          <!-- CHART -->
          <canvas id="difficultyChart" class="h-[160px] w-full"></canvas>
        </div>
      </div>

      <!-- Rate difficulty -->
      <div class="relative border-t border-white/10 px-3 py-2">
        <div
          class="ptmodal-ratequestion group flex w-full items-center justify-between gap-3 rounded-lg border border-white/10 ${canVote ? 'bg-white/5 cursor-pointer hover:bg-white/10 focus:ring-white/20' : 'bg-white/5 cursor-not-allowed opacity-60'} px-3 py-2 select-none focus:outline-none"
          role="button"
          tabindex="0"
          aria-haspopup="menu"
          aria-expanded="false"
          ${canVote ? '' : 'aria-disabled="true"'}
          data-can-vote="${canVote ? '1' : '0'}"
          data-thread-id="${esc(data.playtest_thread_id || '')}"
          data-code="${esc(data.code || '')}"
          data-user-id="${esc(uid)}"
          data-voters="${esc(Array.isArray(data.playtest_voters) ? data.playtest_voters.map((v) => String(v)).join(',') : '')}"
        >
          <div class="flex items-center gap-2">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/5 ring-1 ring-inset ring-white/10">
              <!-- star icon -->
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#cbd5e1" d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </span>
            <span class="text-sm font-medium text-zinc-100">
              ${canVote ? t('playtest.question_difficulty') : t('playtest.complete_to_vote')}
            </span>
          </div>
          <span class="chevron inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/5 ring-1 ring-inset ring-white/10 transition-transform duration-200 ${canVote ? '' : 'opacity-0'}">
            <svg class="chevron-svg transition-transform duration-200" width="18" height="18" viewBox="0 0 22 22" aria-hidden="true">
              <path fill="#bbb" d="M7.41 8.59 11 12.17l3.59-3.58L16 10l-5 5-5-5z"></path>
            </svg>
          </span>
        </div>

        <div
          class="ptmodal-ratedropdown absolute left-3 right-3 bottom-[calc(100%+8px)] top-auto hidden max-h-[200px] overflow-y-auto rounded-xl border border-white/10 bg-zinc-900/95 shadow-2xl ring-1 ring-white/10 backdrop-blur-md"
          role="menu"
          aria-label="Select difficulty"
        ></div>
      </div>
    </div>
  `;
}

/* =========================
   PLAYTEST CARDS INITS
   ========================= */
async function initializePlaytestCards(userId) {
  const container = document.getElementById('playtestCardContainer');
  const modal = document.getElementById('playtestModal');
  const modalInner = document.getElementById('playtestModalInner');
  const backdrop = modal?.querySelector('.playtest-modal-backdrop');

  try {
    await applyFiltersWithAnimation(1);

    const closeHandler = () => hidePlaytestModal();
    if (backdrop && !backdrop.__bound) {
      backdrop.addEventListener('click', closeHandler);
      backdrop.__bound = true;
    }
    if (container && !container.__ptClickBound) {
      const openModalForCode = async (code, fallback) => {
        if (!modal || !modalInner) return;

        const fresh = await fetchFreshMapByCode(code);
        const data = fresh || (fallback ? normalizePlaytest(fallback) : null);
        if (!data) return;

        modalInner.innerHTML = renderPlaytestModal(data);
        animatePtOpen({ animate: false });
        try { setupPlaytestCtaDown(); } catch {}

        registerMapCodeCopyTargets(modal);
        setupRatingDropdown();
        await hydratePlaytestModalCreatorAvatar(modal);
        mountModeratorActions(modalInner, data);

        try {
          const voterIds = Array.isArray(data.playtest_voters) ? data.playtest_voters : [];
          const pre = await preloadVoters(voterIds);
          injectVotersGrid(modal, pre, voterIds);
          registerVoterInteractions(modal);
        } catch {}

        const initialAvg = (() => {
          const raw =
            data.playtest_vote_average ?? data.playtest?.vote_average ?? data.vote_average;
          const n = Number(raw);
          return Number.isFinite(n) ? n : null;
        })();
        updateDifficultyChartInModal(
          initialAvg ?? (Number.isFinite(data.difficulty_value) ? data.difficulty_value : null)
        );
      };

      container.addEventListener(
        'click',
        async (e) => {
          const card = e.target.closest('.playtest-embed');
          if (!card) return;
          e.preventDefault();

          const idx = parseInt(card.getAttribute('data-ptidx') || '-1', 10);
          const fallback = Array.isArray(playtestDataArray) ? playtestDataArray[idx] : null;
          const code =
            fallback?.code || card.querySelector('header .text-xs')?.textContent?.trim() || '';

          if (code) await openModalForCode(code, fallback);
        },
        true
      );

      container.addEventListener(
        'keydown',
        async (e) => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          const card = e.target.closest('.playtest-embed');
          if (!card) return;
          e.preventDefault();

          const idx = parseInt(card.getAttribute('data-ptidx') || '-1', 10);
          const fallback = Array.isArray(playtestDataArray) ? playtestDataArray[idx] : null;
          const code =
            fallback?.code || card.querySelector('header .text-xs')?.textContent?.trim() || '';

          if (code) await openModalForCode(code, fallback);
        },
        true
      );

      container.__ptClickBound = true;
    }
  } catch (error) {
    console.error(error);
    if (container) {
      container.innerHTML = `<p>${t('errors.playtests_load_failed') || 'Erreur lors du chargement des playtests.'}</p>`;
    }
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

async function changePage(page) {
  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;
  await applyFiltersWithAnimation(page);
  document.getElementById('mainTabs')?.scrollIntoView({ behavior: 'smooth' });
}

function parseTargetPage(el) {
  const ds = el.dataset.page || el.getAttribute('data-page');
  if (ds) return parseInt(ds, 10) || 1;
  if (el.tagName === 'A' && el.href) {
    try {
      const u = new URL(el.href, location.href);
      return parseInt(u.searchParams.get('page') || u.searchParams.get('page_number'), 10) || 1;
    } catch {}
  }
  return 1;
}

function extractTotalResults(data) {
  if (data && typeof data.total_results === 'number') return data.total_results;

  const arr = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data)
        ? data
        : [];

  if (arr.length) {
    for (const it of arr) {
      if (it && typeof it.total_results === 'number') return it.total_results;
    }
  }
  return null;
}

function computeTotalPagesFromData(data, size) {
  const perPage =
    Number.isFinite(size) && size > 0 ? size : Number.isFinite(itemsPerPage) ? itemsPerPage : 12;
  const total = extractTotalResults(data);
  return typeof total === 'number' && isFinite(total) && total >= 0
    ? Math.max(1, Math.ceil(total / Math.max(1, perPage)))
    : 1;
}

/* =========================
   PLAYTEST TOOLBAR
   ========================= */
function showPlaytestSectionWithToolbar() {
  initializeIcons();
  initializePlaytestToolbar();
  animatePlaytestToolbar();
  setupToolbarDeselectOnClickOutside();
  initializePlaytestCards(user_id);
}

async function initializePlaytestToolbar() {
  const hasAnimIn  = typeof __animateIn === 'function';
  const hasAnimOut = typeof __animateOutAndRemove === 'function';
  const closeAll = (animate = true) => {
    if (typeof closeOpenToolbarOverlays === 'function') {
      closeOpenToolbarOverlays({ animate });
      return;
    }
    const kill = (el) => {
      if (!el) return;
      try { el.__cleanup?.(); } catch {}
      if (animate && hasAnimOut) __animateOutAndRemove(el);
      else el.remove();
    };
    document.querySelectorAll('.pt-toolbar-input').forEach(kill);
    document.querySelectorAll('.pt-custom-options').forEach(kill);
    document.querySelectorAll('.pt-suggestions-container').forEach(kill);
    const scope = document.getElementById('playtestSection');
    scope?.querySelectorAll('.pt-toolbar-button.selected').forEach((b) => b.classList.remove('selected'));
    document.removeEventListener('mousedown', handleOutsideClick);
  };

  const applyWithAnim = (page = 1) => {
    if (typeof applyFiltersWithAnimation === 'function') {
      applyFiltersWithAnimation(page);
    } else {
      closeAll(true);
      setTimeout(() => applyFilters(page), 140);
    }
  };

  const { mechanicsOptions, restrictionsOptions } = await fillMechanicsAndRestrictions().catch(() => ({
    mechanicsOptions: [],
    restrictionsOptions: [],
  }));

  const playtestIcons = (icons || []).filter((icon) =>
    [
      'map_code',
      'creator',
      'map_name',
      'difficulty',
      'map_type',
      'mechanics',
      'restrictions',
      'apply_filters',
      'clear_filters',
    ].includes(icon.id)
  );

  const toolbar = document.querySelector('#playtestSection .toolbar');
  if (!toolbar) return;

  toolbar.className = [
    'toolbar',
    'relative flex flex-wrap items-center gap-2',
    'rounded-xl border border-white/10',
    'bg-zinc-900/60 p-2',
  ].join(' ');
  toolbar.innerHTML = '';

  const frame = toolbar.closest('.toolbar-container');
  if (frame) frame.classList.add('overflow-x-auto');

  const filterType = {
    map_code: 'input',
    creator: 'input',
    map_name: 'input',
    difficulty: 'dropdown',
    map_type: 'dropdown',
    mechanics: 'dropdown',
    restrictions: 'dropdown',
  };

  const dropdownOptions = {
    difficulty: [
      { text: t('filters.easy'), value: 'Easy', raw: 'Easy' },
      { text: t('filters.medium'), value: 'Medium', raw: 'Medium' },
      { text: t('filters.hard'), value: 'Hard', raw: 'Hard' },
      { text: t('filters.very_hard'), value: 'Very Hard', raw: 'Very Hard' },
      { text: t('filters.extreme'), value: 'Extreme', raw: 'Extreme' },
      { text: t('filters.hell'), value: 'Hell', raw: 'Hell' },
    ],
    map_type: [
      { text: t('filters.classic'), value: 'Classic', raw: 'Classic' },
      { text: t('filters.increasing_difficulty'), value: 'Increasing Difficulty', raw: 'Increasing Difficulty' },
      // { text: t('filters.tournament'), value: 'Tournament', raw: 'Tournament' },
    ],
    mechanics: mechanicsOptions,
    restrictions: restrictionsOptions,
  };

  playtestIcons.forEach((icon) => {
    const button = createButton(icon);
    toolbar.appendChild(button);

    const circle = document.createElement('div');
    circle.className = 'selection-circle pt-selection-circle';
    button.appendChild(circle);

    button.addEventListener('click', (e) => {
      e.stopPropagation();

      if (icon.id === 'apply_filters') {
        closeAll(true);
        applyWithAnim(1);
        return;
      }
      if (icon.id === 'clear_filters') {
        closeAll(true);
        clearFilters();
        applyWithAnim(1);
        return;
      }

      document
        .querySelectorAll('#playtestSection .pt-toolbar-button.selected')
        .forEach((btn) => btn.classList.remove('selected'));
      button.classList.add('selected');

      closeAll(true);

      const type = filterType[icon.id];

      if (type === 'input') {
        if (button.querySelector('.pt-toolbar-input')) {
          const existing = button.querySelector('.pt-toolbar-input');
          existing.focus();
          return;
        }

        const input = document.createElement('input');
        input.type = 'text';
        input.className = [
          'pt-toolbar-input',
          'custom-toolbar-input',
          'w-full rounded-lg border border-white/10',
          'bg-zinc-900/95 px-3 py-2 text-sm',
          'text-zinc-100 placeholder:text-zinc-500',
          'shadow-xl ring-1 ring-white/10',
          'outline-none focus:ring-2 focus:ring-emerald-500/60',
          hasAnimIn ? 'opacity-0 translate-y-2 scale-95' : '',
        ].filter(Boolean).join(' ');
        input.placeholder = icon.name;
        input.setAttribute('data-parent', `${icon.id}FilterButton`);
        input.style.minWidth = '250px';
        input.style.width = '250px';

        input.setAttribute('autocomplete', 'off');
        input.setAttribute('autocapitalize', 'off');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('spellcheck', 'false');

        positionInputOrDropdown(input, null, button);
        if (hasAnimIn) __animateIn(input);
        input.focus();
        currentInput = input;

        input.addEventListener('input', (ev) => {
          const key = mapFilterKey(icon.id);
          activeFilters[key] = ev.target.value.trim();
          updateActiveFilters();
          updateToolbarButtonStates();
        });

        if (['map_code', 'map_name', 'creator'].includes(icon.id)) {
          input.addEventListener('input', (event) => {
            showSuggestions(event, null, `${icon.id}SuggestionsContainer`, icon.id);
          });
          input.addEventListener('focus', (event) => {
            showSuggestions(event, null, `${icon.id}SuggestionsContainer`, icon.id);
          });
        }

        input.addEventListener('keydown', (ev) => {
          if (ev.key === 'Escape') {
            if (hasAnimOut) __animateOutAndRemove(input);
            else { input.__cleanup?.(); input.remove(); }
            button.classList.remove('selected');
            currentInput = null;
            document.querySelectorAll('.pt-suggestions-container').forEach((el) => {
              if (hasAnimOut) __animateOutAndRemove(el);
              else el.remove();
            });
          }
        });

        setTimeout(() => {
          document.addEventListener('mousedown', function handler(ev) {
            const scope = document.getElementById('playtestSection');
            if (scope && scope.contains(ev.target)) return;
            if (!input.contains(ev.target) && ev.target !== button) {
              if (hasAnimOut) __animateOutAndRemove(input);
              else { input.__cleanup?.(); input.remove(); }
              if (button.isConnected) button.classList.remove('selected');
              currentInput = null;
              document.removeEventListener('mousedown', handler);
            }
          }, { once: true });
        }, 0);
      }

      if (type === 'dropdown') {
        const id = `pt-${icon.id}Options`;
        const useWrapper = ['mechanics', 'restrictions'].includes(icon.id);
        const opts = showOptionsContainer(id, dropdownOptions[icon.id], button, useWrapper);
        if (opts) {
          currentOptionsContainer = opts;
          if (hasAnimIn && !opts.__animatedOnce) {
            opts.classList.add('opacity-0', 'translate-y-2', 'scale-95');
            __animateIn(opts);
            opts.__animatedOnce = true;
          }
        }
      }
    });
  });

  updateToolbarButtonStates();

  const applyBtn = toolbar.querySelector('#apply_filtersFilterButton');
  const clearBtn = toolbar.querySelector('#clear_filtersFilterButton');
  if (applyBtn && !applyBtn.__pt_patched) {
    applyBtn.__pt_patched = true;
    applyBtn.addEventListener('click', () => closeAll(true), { capture: true });
  }
  if (clearBtn && !clearBtn.__pt_patched) {
    clearBtn.__pt_patched = true;
    clearBtn.addEventListener('click', () => closeAll(true), { capture: true });
  }
}

function initializeIcons() {
  icons = [
    'map_code',
    'creator',
    'map_name',
    'difficulty',
    'map_type',
    'mechanics',
    'restrictions',
    'apply_filters',
    'clear_filters',
  ].map((id) => ({
    id,
    name: t(`filters.${id}`) || id.replace('_', ' ').toUpperCase(),
    svg: getIconSVG(id),
  }));
}

function getIconSVG(id) {
  const svgs = {
    map_code: `<path d="M15 9H15.01M15 15C18.3137 15 21 12.3137 21 9C21 5.68629 18.3137 3 15 3C11.6863 3 9 5.68629 9 9C9 9.27368 9.01832 9.54308 9.05381 9.80704C9.11218 10.2412 9.14136 10.4583 9.12172 10.5956C9.10125 10.7387 9.0752 10.8157 9.00469 10.9419C8.937 11.063 8.81771 11.1823 8.57913 11.4209L3.46863 16.5314C3.29568 16.7043 3.2092 16.7908 3.14736 16.8917C3.09253 16.9812 3.05213 17.0787 3.02763 17.1808C3 17.2959 3 17.4182 3 17.6627V19.4C3 19.9601 3 20.2401 3.10899 20.454C3.20487 20.6422 3.35785 20.7951 3.54601 20.891C3.75992 21 4.03995 21 4.6 21H6.33726C6.58185 21 6.70414 21 6.81923 20.9724C6.92127 20.9479 7.01881 20.9075 7.10828 20.8526C7.2092 20.7908 7.29568 20.7043 7.46863 20.5314L12.5791 15.4209C12.8177 15.1823 12.937 15.063 13.0581 14.9953C13.1843 14.9248 13.2613 14.8987 13.4044 14.8783C13.5417 14.8586 13.7588 14.8878 14.193 14.9462C14.4569 14.9817 14.7263 15 15 15Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    nickname: `<path d="M16.5 14C16.2164 12.8589 14.981 12 13.5 12C12.019 12 10.7836 12.8589 10.5 14M13.5 8H13.51M18 21H10.2C7.67976 21 6.41965 21 5.45704 20.5095C4.61031 20.0781 3.9219 19.3897 3.49047 18.543C3 17.5804 3 16.3202 3 13.8V6M9.2 18H17.8C18.9201 18 19.4802 18 19.908 17.782C20.2843 17.5903 20.5903 17.2843 20.782 16.908C21 16.4802 21 15.9201 21 14.8V6.2C21 5.0799 21 4.51984 21.782 4.09202C20.5903 3.71569 20.2843 3.40973 19.908 3.21799C19.4802 3 18.9201 3 17.8 3H9.2C8.0799 3 7.51984 3 7.09202 3.21799C6.71569 3.40973 6.40973 3.71569 6.21799 4.09202C6 4.51984 6 5.07989 6 6.2V14.8C6 15.9201 6 16.4802 6.21799 16.908C6.40973 17.2843 6.71569 17.5903 7.09202 17.782C7.51984 18 8.0799 18 9.2 18ZM14.5 8C14.5 8.55228 14.0523 9 13.5 9C12.9477 9 12.5 8.55228 12.5 8C12.5 7.44772 12.9477 7 13.5 7C14.0523 7 14.5 7.44772 14.5 8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    creator: `<path d="M16.5 14C16.2164 12.8589 14.981 12 13.5 12C12.019 12 10.7836 12.8589 10.5 14M13.5 8H13.51M18 21H10.2C7.67976 21 6.41965 21 5.45704 20.5095C4.61031 20.0781 3.9219 19.3897 3.49047 18.543C3 17.5804 3 16.3202 3 13.8V6M9.2 18H17.8C18.9201 18 19.4802 18 19.908 17.782C20.2843 17.5903 20.5903 17.2843 20.782 16.908C21 16.4802 21 15.9201 21 14.8V6.2C21 5.0799 21 4.51984 21.782 4.09202C20.5903 3.71569 20.2843 3.40973 19.908 3.21799C19.4802 3 18.9201 3 17.8 3H9.2C8.0799 3 7.51984 3 7.09202 3.21799C6.71569 3.40973 6.40973 3.71569 6.21799 4.09202C6 4.51984 6 5.07989 6 6.2V14.8C6 15.9201 6 16.4802 6.21799 16.908C6.40973 17.2843 6.71569 17.5903 7.09202 17.782C7.51984 18 8.0799 18 9.2 18ZM14.5 8C14.5 8.55228 14.0523 9 13.5 9C12.9477 9 12.5 8.55228 12.5 8C12.5 7.44772 12.9477 7 13.5 7C14.0523 7 14.5 7.44772 14.5 8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    user: `<path d="M16.5 14C16.2164 12.8589 14.981 12 13.5 12C12.019 12 10.7836 12.8589 10.5 14M13.5 8H13.51M18 21H10.2C7.67976 21 6.41965 21 5.45704 20.5095C4.61031 20.0781 3.9219 19.3897 3.49047 18.543C3 17.5804 3 16.3202 3 13.8V6M9.2 18H17.8C18.9201 18 19.4802 18 19.908 17.782C20.2843 17.5903 20.5903 17.2843 20.782 16.908C21 16.4802 21 15.9201 21 14.8V6.2C21 5.0799 21 4.51984 21.782 4.09202C20.5903 3.71569 20.2843 3.40973 19.908 3.21799C19.4802 3 18.9201 3 17.8 3H9.2C8.0799 3 7.51984 3 7.09202 3.21799C6.71569 3.40973 6.40973 3.71569 6.21799 4.09202C6 4.51984 6 5.07989 6 6.2V14.8C6 15.9201 6 16.4802 6.21799 16.908C6.40973 17.2843 6.71569 17.5903 7.09202 17.782C7.51984 18 8.0799 18 9.2 18ZM14.5 8C14.5 8.55228 14.0523 9 13.5 9C12.9477 9 12.5 8.55228 12.5 8C12.5 7.44772 12.9477 7 13.5 7C14.0523 7 14.5 7.44772 14.5 8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    map_name: `<path d="M14.4996 8.5001H14.5096M16.2196 19.9601L10.5508 14.2705C9.7579 13.4747 9.36143 13.0768 8.90391 12.9277C8.50148 12.7966 8.06782 12.7965 7.66534 12.9275C7.20776 13.0764 6.81115 13.4742 6.01792 14.2697L4.30299 15.9897M12.2385 15.9644L12.6069 15.5951C13.4081 14.7996 13.8087 14.4018 14.2689 14.2554C14.6737 14.1267 15.109 14.1302 15.5117 14.2654C15.9696 14.4191 16.3638 14.8232 17.1522 15.6314L18.8889 17.3881M18.8889 17.3881L21.5377 12.8001C21.706 12.5087 21.7901 12.3629 21.823 12.208C21.8522 12.0709 21.8522 11.9293 21.823 11.7922C21.7901 11.6373 21.706 11.4915 21.5377 11.2001L17.4615 4.13984C17.2932 3.8484 17.2091 3.70268 17.0914 3.5967C16.9872 3.50293 16.8645 3.43209 16.7313 3.38879C16.5806 3.33984 16.4124 3.33984 16.0758 3.33984H7.92336C7.58683 3.33984 7.41856 3.33984 7.26793 3.38879C7.13465 3.43209 7.01196 3.50293 6.90782 3.5967C6.79011 3.70268 6.70598 3.8484 6.53772 4.13984L2.46148 11.2001C2.29321 11.4915 2.20908 11.6373 2.17615 11.7922C2.14701 11.9293 2.14701 12.0709 2.17615 12.208C2.20908 12.3629 2.29321 12.5087 2.46148 12.8001L4.30299 15.9897M18.8889 17.3881L17.4615 19.8604C17.2932 20.1518 17.2091 20.2975 17.0914 20.4035C16.9872 20.4973 16.8645 20.5681 16.7313 20.6114C16.5806 20.6604 16.4124 20.6604 16.0758 20.6604H7.92336C7.58683 20.6604 7.41856 20.6604 7.26793 20.6114C7.13465 20.5681 7.01196 20.4973 6.90782 20.4035C6.79011 20.2975 6.70598 20.1518 6.53772 19.8604L4.30299 15.9897M14.9996 8.5001C14.9996 8.77624 14.7757 9.0001 14.4996 9.0001C14.2235 9.0001 13.9996 8.77624 13.9996 8.5001C13.9996 8.22396 14.2235 8.0001 14.4996 8.0001C14.7757 8.0001 14.9996 8.22396 14.9996 8.5001Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    difficulty: `<path d="M4 8L6 20H18L20 8M4 8L5.71624 9.37299C6.83218 10.2657 7.39014 10.7121 7.95256 10.7814C8.4453 10.8421 8.94299 10.7173 9.34885 10.4314C9.81211 10.1051 10.0936 9.4483 10.6565 8.13476L12 5M4 8C4.55228 8 5 7.55228 5 7C5 6.44772 4.55228 6 4 6C3.44772 6 3 6.44772 3 7C3 7.55228 3.44772 8 4 8ZM20 8L18.2838 9.373C17.1678 10.2657 16.6099 10.7121 16.0474 10.7814C15.5547 10.8421 15.057 10.7173 14.6511 10.4314C14.1879 10.1051 13.9064 9.4483 13.3435 8.13476L12 5M20 8C20.5523 8 21 7.55228 21 7C21 6.44772 20.5523 6 20 6C19.4477 6 19 6.44772 19 7C19 7.55228 19.4477 8 20 8ZM12 5C12.5523 5 13 4.55228 13 4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4C11 4.55228 11.4477 5 12 5ZM12 4H12.01M20 7H20.01M4 7H4.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    map_type: `<path d="M11 8L16 8.00053M11 12L16 12.0005M11 16L16 16.0005M8 16H8.01M8 12H8.01M8 8H8.01M7.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.0799 20 7.2V16.8C20 17.9201 20 18.4802 19.782 18.908C19.5903 19.2843 19.2843 19.5903 18.908 19.782C18.4802 20 17.9201 20 16.8 20H7.2C6.0799 20 5.51984 20 5.09202 19.782C4.71569 19.5903 4.40973 19.2843 4.21799 18.908C4 18.4802 4 17.9202 4 16.8V7.2C4 6.0799 4 5.51984 4.21799 5.09202C4.40973 4.71569 4.71569 4.40973 5.09202 4.21799C5.51984 4 6.0799 4 7.2 4Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    mechanics: `
            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12.9046 3.06005C12.6988 3 12.4659 3 12 3C11.5341 3 11.3012 3 11.0954 3.06005C10.7942 3.14794 10.5281 3.32808 10.3346 3.57511C10.2024 3.74388 10.1159 3.96016 9.94291 4.39272C9.69419 5.01452 9.00393 5.33471 8.36857 5.123L7.79779 4.93281C7.3929 4.79785 7.19045 4.73036 6.99196 4.7188C6.70039 4.70181 6.4102 4.77032 6.15701 4.9159C5.98465 5.01501 5.83376 5.16591 5.53197 5.4677C5.21122 5.78845 5.05084 5.94882 4.94896 6.13189C4.79927 6.40084 4.73595 6.70934 4.76759 7.01551C4.78912 7.2239 4.87335 7.43449 5.04182 7.85566C5.30565 8.51523 5.05184 9.26878 4.44272 9.63433L4.16521 9.80087C3.74031 10.0558 3.52786 10.1833 3.37354 10.3588C3.23698 10.5141 3.13401 10.696 3.07109 10.893C3 11.1156 3 11.3658 3 11.8663C3 12.4589 3 12.7551 3.09462 13.0088C3.17823 13.2329 3.31422 13.4337 3.49124 13.5946C3.69158 13.7766 3.96395 13.8856 4.50866 14.1035C5.06534 14.3261 5.35196 14.9441 5.16236 15.5129L4.94721 16.1584C4.79819 16.6054 4.72367 16.829 4.7169 17.0486C4.70875 17.3127 4.77049 17.5742 4.89587 17.8067C5.00015 18.0002 5.16678 18.1668 5.5 18.5C5.83323 18.8332 5.99985 18.9998 6.19325 19.1041C6.4258 19.2295 6.68733 19.2913 6.9514 19.2831C7.17102 19.2763 7.39456 19.2018 7.84164 19.0528L8.36862 18.8771C9.00393 18.6654 9.6942 18.9855 9.94291 19.6073C10.1159 20.0398 10.2024 20.2561 10.3346 20.4249C10.5281 20.6719 10.7942 20.8521 11.0954 20.94C11.3012 21 11.5341 21 12 21C12.4659 21 12.6988 21 12.9046 20.94C13.2058 20.8521 13.4719 20.6719 13.6654 20.4249C13.7976 20.2561 13.8841 20.0398 14.0571 19.6073C14.3058 18.9855 14.9961 18.6654 15.6313 18.8773L16.1579 19.0529C16.605 19.2019 16.8286 19.2764 17.0482 19.2832C17.3123 19.2913 17.5738 19.2296 17.8063 19.1042C17.9997 18.9999 18.1664 18.8333 18.4996 18.5001C18.8328 18.1669 18.9994 18.0002 19.1037 17.8068C19.2291 17.5743 19.2908 17.3127 19.2827 17.0487C19.2759 16.8291 19.2014 16.6055 19.0524 16.1584L18.8374 15.5134C18.6477 14.9444 18.9344 14.3262 19.4913 14.1035C20.036 13.8856 20.3084 13.7766 20.5088 13.5946C20.6858 13.4337 20.8218 13.2329 20.9054 13.0088C21 12.7551 21 12.4589 21 11.8663C21 11.3658 21 11.1156 20.9289 10.893C20.866 10.696 20.763 10.5141 20.6265 10.3588C20.4721 10.1833 20.2597 10.0558 19.8348 9.80087L19.5569 9.63416C18.9478 9.26867 18.6939 8.51514 18.9578 7.85558C19.1262 7.43443 19.2105 7.22383 19.232 7.01543C19.2636 6.70926 19.2003 6.40077 19.0506 6.13181C18.9487 5.94875 18.7884 5.78837 18.4676 5.46762C18.1658 5.16584 18.0149 5.01494 17.8426 4.91583C17.5894 4.77024 17.2992 4.70174 17.0076 4.71872C16.8091 4.73029 16.6067 4.79777 16.2018 4.93273L15.6314 5.12287C14.9961 5.33464 14.3058 5.0145 14.0571 4.39272C13.8841 3.96016 13.7976 3.74388 13.6654 3.57511C13.4719 3.32808 13.2058 3.14794 12.9046 3.06005Z" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        `,
    restrictions: `<path d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    only_playtest: `<path d="M14.2639 15.9376L12.5958 14.2835C11.7909 13.4852 11.3884 13.0861 10.9266 12.9402C10.5204 12.8119 10.0838 12.8166 9.68048 12.9537C9.22188 13.1096 8.82814 13.5173 8.04068 14.3327L4.04409 18.2802M14.2639 15.9376L14.6053 15.5991C15.4112 14.7999 15.8141 14.4003 16.2765 14.2544C16.6831 14.1262 17.12 14.1312 17.5236 14.2688C17.9824 14.4252 18.3761 14.834 19.1634 15.6515L20 16.4936M14.2639 15.9376L18.275 19.9566M18.275 19.9566C17.9176 20.0001 17.4543 20.0001 16.8 20.0001H7.2C6.07989 20.0001 5.51984 20.0001 5.09202 19.7821C4.71569 19.5904 4.40973 19.2844 4.21799 18.9081C4.12796 18.7314 4.07512 18.5322 4.04409 18.2802M18.275 19.9566C18.5293 19.9257 18.7301 19.8728 18.908 19.7821C19.2843 19.5904 19.5903 19.2844 19.782 18.9081C20 18.4803 20 17.9202 20 16.8001V16.4936M12.5 4L7.2 4.00011C6.07989 4.00011 5.51984 4.00011 5.09202 4.21809C4.71569 4.40984 4.40973 4.7158 4.21799 5.09213C4 5.51995 4 6.08 4 7.20011V16.8001C4 17.4576 4 17.9222 4.04409 18.2802M20 11.5V16.4936M14 10.0002L16.0249 9.59516C16.2015 9.55984 16.2898 9.54219 16.3721 9.5099C16.4452 9.48124 16.5146 9.44407 16.579 9.39917C16.6515 9.34859 16.7152 9.28492 16.8425 9.1576L21 5.00015C21.5522 4.44787 21.5522 3.55244 21 3.00015C20.4477 2.44787 19.5522 2.44787 19 3.00015L14.8425 7.1576C14.7152 7.28492 14.6515 7.34859 14.6009 7.42112C14.556 7.4855 14.5189 7.55494 14.4902 7.62801C14.4579 7.71033 14.4403 7.79862 14.4049 7.97518L14 10.0002Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    ignore_completions: `<path d="M9 12L11 14L15 10M12 3L13.9101 4.87147L16.5 4.20577L17.2184 6.78155L19.7942 7.5L19.1285 10.0899L21 12L19.1285 13.9101L19.7942 16.5L17.2184 17.2184L16.5 19.7942L13.9101 19.1285L12 21L10.0899 19.1285L7.5 19.7942L6.78155 17.2184L4.20577 16.5L4.87147 13.9101L3 12L4.87147 10.0899L4.20577 7.5L6.78155 6.78155L7.5 4.20577L10.0899 4.87147L12 3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    only_maps_with_medals: `<path d="M12 11L8 3H4L8.5058 12.4622M12 11L16 3H20L15.4942 12.4622M12 11C13.344 11 14.5848 11.5635 15.4942 12.4622M12 11C10.656 11 9.41518 11.5635 8.5058 12.4622M15.4942 12.4622C16.4182 13.3753 17 14.6344 17 16C17 18.7614 14.7614 21 12 21C9.23858 21 7 18.7614 7 16C7 14.6344 7.58179 13.3753 8.5058 12.4622" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`,
    apply_filters: `<path d="M4 12.6111L8.92308 17.5L20 6.5" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    clear_filters: `<path d="M6 6L18 18M18 6L6 18" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  };
  return svgs[id] || '';
}

function createButton(icon) {
  const button = document.createElement('button');
  button.setAttribute('id', `${icon.id}FilterButton`);
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', icon.name);
  button.setAttribute('data-scope', 'playtest');

  button.className = [
    'pt-toolbar-button',
    'relative inline-flex items-center gap-2',
    'h-9 cursor-pointer',
    'rounded-lg border border-white/10 bg-zinc-900/60',
    'px-3 text-sm text-zinc-200',
    'hover:bg-zinc-900/70 hover:border-white/20',
    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
    'transition',
  ].join(' ');

  button.innerHTML = `
    <div class=\"flex items-center gap-2\">
      <svg class=\"h-5 w-5 text-current opacity-90\" viewBox=\"${icon.viewBox || '0 0 24 24'}\" xmlns=\"http://www.w3.org/2000/svg\">
        ${icon.svg}
      </svg>
      <span class=\"icon-name leading-none\">${icon.name}</span>
    </div>
    <span class=\"active-filter-badge filter-badge hidden absolute -top-1 -right-1 rounded-full bg-emerald-500/90 text-[10px] font-semibold text-white leading-none ring-1 ring-white/20 px-1.5 py-0.5 truncate\"></span>
  `;
  return button;
}

function setupToolbarDeselectOnClickOutside() {
  document.addEventListener('mousedown', function (event) {
    const scope = document.getElementById('playtestSection');
    if (!scope) return;

    const isToolbarButton = event.target.closest('#playtestSection .pt-toolbar-button');
    const isPTDropdown   = event.target.closest('.pt-custom-options');
    const isPTInput      = event.target.closest('.pt-toolbar-input');
    const isPTSuggestions= event.target.closest('.pt-suggestions-container');

    if (!isToolbarButton && !isPTDropdown && !isPTInput && !isPTSuggestions) {
      closeOpenToolbarOverlays({ animate: true });
    }
  });
}

function showOptionsContainer(id, options, button, useWrapper = false) {
  let existing = document.getElementById(id);
  if (existing) {
    const isVisible = existing.style.display !== 'none';
    if (isVisible) {
      __animateOutAndRemove(existing);
      return null;
    } else {
      existing.style.display = 'block';
      existing.classList.add('opacity-0', 'translate-y-2', 'scale-95');
      existing.__place?.();
      __animateIn(existing);
      return existing;
    }
  }

  const rawProp = id.replace(/^pt-/, '').replace('Options', '');
  const prop = mapFilterKey(rawProp);
  if (!(prop in activeFilters)) activeFilters[prop] = useWrapper ? [] : null;

  const container = document.createElement('div');
  container.id = id;
  container.setAttribute('data-scope', 'playtest');
  container.className = [
    'pt-custom-options', 'custom-options',
    'rounded-lg border border-white/10 bg-zinc-900/95',
    'p-1 shadow-xl ring-1 ring-white/10',
    'max-h-64 overflow-y-auto',
    'opacity-0 translate-y-2 scale-95'
  ].join(' ');
  container.style.position = 'absolute';
  container.style.display = 'block';

  options.forEach((opt) => {
    const display = opt.translated || opt.text || '';
    const raw = opt.raw || opt.value || display;

    if (useWrapper) {
      const wrapper = document.createElement('div');
      wrapper.className =
        'pt-custom-option-wrapper custom-option-wrapper flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5 cursor-pointer';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'pt-custom-checkbox custom-checkbox accent-emerald-500';
      cb.id = `${id}_${String(raw).replace(/\s+/g, '_')}`;
      cb.checked = Array.isArray(activeFilters[prop]) && activeFilters[prop].includes(raw);

      const label = document.createElement('label');
      label.htmlFor = cb.id;
      label.className = 'pt-custom-option custom-option text-zinc-200 select-none cursor-pointer';
      label.textContent = display;
      label.setAttribute('data-raw-value', raw);

      wrapper.append(cb, label);
      container.append(wrapper);

      wrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        cb.checked = !cb.checked;
        if (cb.checked) {
          if (!activeFilters[prop].includes(raw)) activeFilters[prop].push(raw);
        } else {
          activeFilters[prop] = activeFilters[prop].filter((v) => v !== raw);
        }
        updateActiveFilters();
        updateToolbarButtonStates();
      });
    } else {
      const el = document.createElement('div');
      el.className =
        'pt-custom-option custom-option cursor-pointer rounded-md px-2 py-1.5 text-sm text-zinc-200 hover:bg-white/10 mx-1 my-0.5';
      el.setAttribute('data-raw-value', raw);

      if (rawProp === 'difficulty') {
        const { dot } = difficultyClasses(raw);
        el.innerHTML = `<span class="pt-dot ${dot}"></span><span>${display}</span>`;
      } else {
        el.textContent = display;
      }

      if (activeFilters[prop] === raw) el.classList.add('bg-white/10');

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        container.querySelectorAll('.custom-option').forEach((o) => o.classList.remove('bg-white/10'));
        el.classList.add('bg-white/10');
        activeFilters[prop] = raw;
        updateActiveFilters();
        updateToolbarButtonStates();

        __animateOutAndRemove(container);
      });

      container.append(el);
    }
  });

  document.body.appendChild(container);

  const place = () => {
    const r = button.getBoundingClientRect();
    const desiredTop = window.scrollY + r.bottom + 8;
    container.style.width = `${r.width}px`;
    const { left, top } = clampToFrame(window.scrollX + r.left, container.offsetWidth || r.width, desiredTop);
    container.style.left = `${left}px`;
    container.style.top  = `${top}px`;
  };
  place();

  const onScroll = () => place();
  const onResize = () => place();
  window.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', onResize);
  container.__place = place;
  container.__cleanup = () => {
    window.removeEventListener('scroll', onScroll, true);
    window.removeEventListener('resize', onResize);
  };

  document.addEventListener('mousedown', handleOutsideClick);

  __animateIn(container);

  return container;
}

function clampToFrame(left, width, desiredTop) {
  const toolbar = document.querySelector('#playtestSection .toolbar');
  const frame = toolbar?.closest('.toolbar-container');
  const frameRect = (frame || document.documentElement).getBoundingClientRect();

  const minLeft = window.scrollX + frameRect.left + 8;
  const maxLeft = window.scrollX + frameRect.right - width - 8;

  const clampedLeft = Math.max(minLeft, Math.min(left, maxLeft));
  const top = desiredTop;

  return { left: clampedLeft, top };
}

// --------- FILTERS ---------
function updateActiveFilters() {
  Object.keys(activeFilters).forEach((k) => {
    const v = activeFilters[k];
    if (v == null || (Array.isArray(v) && v.length === 0) || v === '') {
      delete activeFilters[k];
    }
  });
}

function mapFilterKey(rawKey) {
  const map = {
    map_code: 'code',
    creator: 'creator_ids',
    map_name: 'map_name',
    difficulty: 'difficulty_exact',
    map_type: 'category',
    mechanics: 'mechanics',
    restrictions: 'restrictions',
  };
  return map[rawKey] || rawKey;
}

function clearFilters() {
  const container = document.getElementById('playtestCardContainer');
  if (typeof renderPlaytestSkeletonCards === 'function') {
    renderPlaytestSkeletonCards(itemsPerPage);
  } else if (container) {
    container.innerHTML = '';
  }

  Object.keys(activeFilters).forEach((k) => delete activeFilters[k]);
  currentPage = 1;
  hidePlaytestModal();
  updateToolbarButtonStates();

  closeOpenToolbarOverlays({ animate: true });
}

async function applyFilters(page = 1) {
  currentPage = page;
  hidePlaytestModal();

  const extraFilters = {};
  Object.entries(activeFilters).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      if (v.length) extraFilters[k] = v.slice();
    } else if (v != null && v !== '') {
      extraFilters[k] = v;
    }
  });

  const qs = buildPlaytestParams(extraFilters, currentPage);
  const container = document.getElementById('playtestCardContainer');
  if (container) {
    if (typeof renderPlaytestSkeletonCards === 'function') {
      renderPlaytestSkeletonCards(itemsPerPage);
    } else {
      container.innerHTML = '';
    }
  }

  try {
    const resp = await fetch(`/api/maps?${qs}`, { headers: { Accept: 'application/json' } });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const raw = await resp.json();
    const arr = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];

    const topLevelTotal = Number(
      raw?.total_results ?? raw?.total ?? raw?.meta?.total ?? raw?.count ?? 0
    );

    if (arr.length === 0) {
      showWarningMessage(t('popup.no_results'));
      clearFilters();
      applyFilters();
      return;
    }

    if (!arr.length) {
      totalResults = topLevelTotal;
      totalPages = Math.max(1, Math.ceil((totalResults || 0) / itemsPerPage));
      renderPaginationButtons();
      updateToolbarButtonStates();
      if (container) {
        container.innerHTML = `<p class="text-sm opacity-75 px-2 py-3">${t('popup.no_results')}</p>`;
      }
      return;
    }

    const data = arr.map((raw) => {
      const pt = normalizePlaytest(raw);

      pt.difficulty_value = Number(
        raw?.playtest?.vote_average ??
          pt.difficulty_value ??
          raw?.raw_difficulty ??
          raw?.ratings ??
          NaN
      );

      pt.playtest_voters = pt.playtest_voters ?? raw?.playtest?.voters ?? [];

      return pt;
    });

    const itemTotal = Number(data?.[0]?.total_results ?? arr?.[0]?.total_results ?? 0);

    totalResults = topLevelTotal || itemTotal || arr.length;
    totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));
    renderPaginationButtons();
    updateToolbarButtonStates();

    await Promise.all(
      data.map(async (pt) => {
        pt.avatar = await fetchDiscordAvatar(pt.primary_creator_id || '0');
      })
    );

    window.currentPlaytestData = data;
    if (container) {
      container.innerHTML = data.map((pt, i) => renderPlaytestCard(pt, i)).join('');
    }
  } catch (err) {
    console.error('Erreur getPlaytests:', err);
    showErrorMessage(t('errors.playtests_load_failed'));
  }
}

function updateToolbarButtonStates() {
  document.querySelectorAll('#playtestSection .pt-toolbar-button').forEach((button) => {
    const rawKey = button.id.replace('FilterButton', '');
    const key = mapFilterKey(rawKey);
    const val = activeFilters[key];
    const isActive = Array.isArray(val) ? val.length > 0 : val != null && val !== '';

    button.classList.remove(
      'active-filter',
      'border-brand-400/40',
      'ring-1',
      'ring-emerald-500/30',
      'bg-zinc-900/60',
      'border-white/10',
      'text-zinc-200'
    );

    if (isActive) {
      button.classList.add('active-filter', 'border-brand-400/40', 'ring-1', 'ring-emerald-500/30');
    } else {
      button.classList.add('bg-zinc-900/60', 'border-white/10', 'text-zinc-200');
    }

    const badge = button.querySelector('.active-filter-badge');
    if (!badge) return;
    if (isActive && rawKey !== 'apply_filters' && rawKey !== 'clear_filters') {
      let text = '';
      if (Array.isArray(val)) {
        if (val.length === 1) text = val[0];
        else if (val.length === 2) text = val.slice(0, 2).join(', ');
        else if (val.length > 2) text = val.slice(0, 2).join(', ') + '…';
        else text = '';
      } else if (typeof val === 'string') {
        text = val.length > 18 ? val.slice(0, 18) + '…' : val;
      }
      badge.textContent = text;
      badge.classList.remove('hidden');
    } else {
      badge.textContent = '';
      badge.classList.add('hidden');
    }
  });
}

// --------- SUGGESTIONS ---------
function showSuggestions(event, _unused, containerId, propertyName) {
  const input = event.target;
  const scopedId = containerId.startsWith('pt-') ? containerId : `pt-${containerId}`;
  const suggestionsContainer = getSuggestionsContainer(scopedId, input);

  const isSubmitRecordMapCode = !!(
    input &&
    input.closest('#submitRecordSection') &&
    (propertyName === 'map_code' || input.id === 'mapCodeInput' || input.name === 'map_code')
  );

  suggestionsContainer.addEventListener('mousedown', (e) => e.stopPropagation(), { once: true });

  function hideSuggestions() {
    if (!suggestionsContainer) return;
    __animateOutAndRemove(suggestionsContainer);
    document.removeEventListener('mousedown', outsideClickHandler);
  }

  function outsideClickHandler(e) {
    if (!suggestionsContainer.contains(e.target) && e.target !== input) {
      hideSuggestions();
    }
  }

  clearTimeout(toolbarDebounce);
  const q = input.value.trim();
  if (q.length < 2) {
    hideSuggestions();
    return;
  }

  const propToKind = (prop) => {
    if (prop === 'map_code') return 'map-codes';
    if (prop === 'creator')  return 'users';
    if (prop === 'map_name') return 'map-names';
    return '';
  };

  toolbarDebounce = setTimeout(() => {
    const kind = propToKind(propertyName);
    const locale = CURRENT_LANG === 'cn' ? 'cn' : CURRENT_LANG === 'jp' ? 'en' : 'en';
    const url = _buildAutoUrl(kind, { value: q, locale, pageSize: 10 });

    if (!url) {
      hideSuggestions();
      return;
    }

    fetch(url, { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const normalized = (Array.isArray(data) ? data : [])
          .map((item) => normalizeSuggestionItem(item, kind))
          .filter(Boolean);

        suggestionsContainer.innerHTML = '';

        normalized.forEach((s) => {
          const div = document.createElement('div');
          div.textContent = s.label;
          div.className = 'suggestion-item cursor-pointer px-3 py-2 text-sm text-zinc-200 hover:bg-white/10';
          div.setAttribute('data-raw-value', s.raw);

          div.addEventListener('click', (e) => {
            e.stopPropagation();

            if (isSubmitRecordMapCode) {
              input.value = s.label;
              input.setAttribute('data-raw-value', String(s.raw));
              hideSuggestions();
              input.blur();
              return;
            }

            const key = mapFilterKey(propertyName);
            activeFilters[key] = s.raw;

            showConfirmationMessage(
              t('popup.filter_applied', { filterId: propertyName, value: s.label })
            );

            updateActiveFilters();
            updateToolbarButtonStates();

            hideSuggestions();
            input.__cleanup?.();
            input.remove();
            currentInput = null;
          });

          suggestionsContainer.appendChild(div);
        });

        if (normalized.length) {
          suggestionsContainer.style.display = 'block';
          if (typeof _ensureFloating === 'function') {
            _ensureFloating(suggestionsContainer, input, {
              matchAnchorWidth: true,
              place: { offset: 4, pad: 8, align: 'left' },
            });
          } else {
            const rect = input.getBoundingClientRect();
            suggestionsContainer.style.position = 'absolute';
            suggestionsContainer.style.top  = `${rect.bottom + window.scrollY + 4}px`;
            suggestionsContainer.style.left = `${rect.left + window.scrollX}px`;
            suggestionsContainer.style.width= `${input.offsetWidth}px`;
          }

          suggestionsContainer.classList.add('transform', 'opacity-0', 'translate-y-2', 'scale-95');
          __animateIn(suggestionsContainer);
          document.addEventListener('mousedown', outsideClickHandler);
        } else {
          hideSuggestions();
        }
      })
      .catch(() => hideSuggestions());
  }, 200);
}

function getSuggestionsContainer(containerId, input) {
  const id = containerId.startsWith('pt-') ? containerId : `pt-${containerId}`;
  let suggestionsContainer = document.getElementById(id);

  if (!suggestionsContainer) {
    suggestionsContainer = document.createElement('div');
    suggestionsContainer.id = id;
    suggestionsContainer.className = [
      'pt-suggestions-container',
      'suggestions-container',
      'rounded-lg border border-white/10 bg-zinc-900/95 text-sm text-zinc-100',
      'shadow-xl ring-1 ring-white/10',
      'max-h-56 overflow-y-auto',
    ].join(' ');
    suggestionsContainer.setAttribute('data-scope', 'playtest');
    document.body.appendChild(suggestionsContainer);

    ['pointerdown', 'mousedown', 'click'].forEach((type) =>
      suggestionsContainer.addEventListener(type, (e) => e.stopPropagation())
    );
  }

  const place = () => {
    const rect = input.getBoundingClientRect();
    const desiredTop = rect.bottom + window.scrollY + 4;
    const width = input.offsetWidth;

    let left = rect.left + window.scrollX;

    const { left: cl, top } = clampToFrame(left, width, desiredTop);
    suggestionsContainer.style.position = 'absolute';
    suggestionsContainer.style.top = `${top}px`;
    suggestionsContainer.style.left = `${cl}px`;
    suggestionsContainer.style.width = `${width}px`;
  };

  suggestionsContainer.style.display = 'block';
  place();

  window.addEventListener('scroll', place, { capture: true, passive: true });
  window.addEventListener('resize', place, { passive: true });

  suggestionsContainer.__cleanup = () => {
    window.removeEventListener('scroll', place, { capture: true });
    window.removeEventListener('resize', place);
  };

  return suggestionsContainer;
}

/* =========================
   HELPERS PLAYTEST TOOLBAR
   ========================= */
function handleOutsideClick(e) {
  const scope = document.getElementById('playtestSection');
  const isClickInsideToolbar = scope && scope.querySelector('.toolbar') && scope.querySelector('.toolbar').contains(e.target);
  const isClickInsideDropdown = e.target.closest('.pt-custom-options');
  const isClickInsideInput    = e.target.closest('.pt-toolbar-input');
  const isClickInsideSuggest  = e.target.closest('.pt-suggestions-container');

  if (!isClickInsideToolbar && !isClickInsideDropdown && !isClickInsideInput && !isClickInsideSuggest) {
    closeOpenToolbarOverlays({ animate: true });
  }
}

function positionInputOrDropdown(input, _optionsContainer, button) {
  const placeNear = (el, offsetY = 6) => {
    const r = button.getBoundingClientRect();
    const desiredTop = window.scrollY + r.bottom + offsetY;
    const width = r.width;
    const { left, top } = clampToFrame(window.scrollX + r.left, width, desiredTop);

    el.style.position = 'absolute';
    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
    el.style.width = `${width}px`;
    el.style.display = 'block';
  };

  if (input) {
    if (currentInput && currentInput !== input) {
      currentInput.__cleanup?.();
      currentInput.remove();
    }
    input.classList.add('pt-toolbar-input', 'opacity-0', 'translate-y-2', 'scale-95');
    document.body.appendChild(input);
    placeNear(input, 6);

    const onScroll = () => placeNear(input, 6);
    const onResize = () => placeNear(input, 6);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    input.__cleanup = () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };

    __animateIn(input);

    currentInput = input;
  }
}


function __animateIn(el) {
  if (!el) return;
  el.classList.add(
    'transform', 'transition', 'duration-150', 'ease-out',
    'opacity-0', 'translate-y-2', 'scale-95'
  );
  void el.offsetWidth;
  requestAnimationFrame(() => {
    el.classList.remove('opacity-0', 'translate-y-2', 'scale-95');
    el.classList.add('opacity-100', 'translate-y-0', 'scale-100');
  });
}

function __animateOutAndRemove(el, { remove = true } = {}) {
  if (!el) return;
  el.classList.add('transform', 'transition', 'duration-125', 'ease-in');
  el.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
  el.classList.add('opacity-0', 'translate-y-2', 'scale-95');
  const done = () => {
    el.removeEventListener('transitionend', done);
    if (remove) {
      try { el.__cleanup?.(); } catch {}
      try { el.remove(); } catch {}
    }
  };
  el.addEventListener('transitionend', done, { once: true });
}

function closeOpenToolbarOverlays({ animate = true } = {}) {
  const scope = document.getElementById('playtestSection');

  document.querySelectorAll('.pt-toolbar-input').forEach((el) => {
    if (animate) __animateOutAndRemove(el);
    else { el.__cleanup?.(); el.remove(); }
  });

  document.querySelectorAll('.pt-custom-options').forEach((el) => {
    if (animate) __animateOutAndRemove(el);
    else { el.__cleanup?.(); el.remove(); }
  });

  document.querySelectorAll('.pt-suggestions-container').forEach((el) => {
    if (animate) __animateOutAndRemove(el);
    else { el.__cleanup?.(); el.remove(); }
  });

  if (scope)
    scope.querySelectorAll('.pt-toolbar-button.selected').forEach((btn) => btn.classList.remove('selected'));

  document.removeEventListener('mousedown', handleOutsideClick);
}

/* =========================
   AUTH LOCK
   ========================= */
function lockSectionById(sectionId) {
  const sec = document.getElementById(sectionId);
  if (!sec || sec.querySelector('.guest-lock')) return;

  //sec.setAttribute('inert', '');
  sec.dataset.guestLocked = '1';
  if (!sec.style.position) sec.style.position = 'relative';

  const overlay = document.createElement('div');
  overlay.className =
    'guest-lock pointer-events-auto absolute inset-0 z-[9999] grid place-items-center rounded-2xl bg-black/55 backdrop-blur-sm';
  overlay.innerHTML = `
    <div class="text-center px-4">
      <div class="mx-auto mb-2 h-10 w-10 rounded-full bg-white/10 ring-1 ring-white/20 grid place-items-center">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#e5e7eb" d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z"/></svg>
      </div>
      <div class="text-sm text-zinc-200 mb-2">
        ${typeof t === 'function' ? t('popup.login_required_msg') : 'Please login to access this section'}
      </div>
      <a href="/discord/login"
         class="inline-flex items-center rounded-lg bg-white text-zinc-900 px-3 py-1.5 text-sm font-semibold hover:bg-zinc-100">
        ${typeof t === 'function' ? t('popup.login') : 'Login'}
      </a>
    </div>
  `;
  sec.appendChild(overlay);
}

function unlockSectionById(sectionId) {
  const sec = document.getElementById(sectionId);
  if (!sec) return;
  sec.removeAttribute('inert');
  sec.querySelector('.guest-lock')?.remove();
  delete sec.dataset.guestLocked;
}

function applyGuestLocks() {
  if (IS_GUEST) {
    ['submitRecordSection', 'submitMapSection'].forEach((id) => {
      lockSectionById(id);
      ensureGuestLockPersistence(id);
    });
    try {
      hideAllSuggestions();
      _closeAllOtherDropdowns(null);
    } catch {}
  } else {
    ['submitRecordSection', 'submitMapSection'].forEach(unlockSectionById);
  }
}
function ensureGuestLockPersistence(sectionId) {
  const sec = document.getElementById(sectionId);
  if (!sec || sec.__guestObs) return;

  const obs = new MutationObserver(() => {
    if (IS_GUEST && !sec.querySelector('.guest-lock')) {
      lockSectionById(sectionId);
      try {
        hideAllSuggestions();
        _closeAllOtherDropdowns(null);
      } catch {}
    }
  });
  obs.observe(sec, { childList: true, subtree: false });
  sec.__guestObs = obs;
}

document.addEventListener(
  'click',
  (e) => {
    if (!IS_GUEST) return;
    if (e.target.closest('.guest-lock')) return;

    const mapSec = document.getElementById('submitMapSection');
    const recSec = document.getElementById('submitRecordSection');

    if (
      (mapSec?.dataset.guestLocked === '1' && mapSec.contains(e.target)) ||
      (recSec?.dataset.guestLocked === '1' && recSec.contains(e.target))
    ) {
      e.stopPropagation();
      e.preventDefault();
    }
  },
  true
);

/* =========================
   HELP – Toggle submenus & modal listeners
   ========================= */
(function setupHelpMenus(){
  const get = (id) => document.getElementById(id);
  const groups = [
    { main: 'helpMapInfoMainBtn', sub: 'helpMapInfoSub' },
    { main: 'helpRankMainBtn',    sub: 'helpRankSub'    },
  ];

  const closeAll = () => groups.forEach(g=>{
    const main = get(g.main), sub = get(g.sub);
    if (main && sub){
      sub.classList.add('hidden');
      sub.style.display = 'none';
      main.setAttribute('aria-expanded','false');
    }
  });
  closeAll();

  groups.forEach(g=>{
    const main = get(g.main), sub = get(g.sub);
    if (!main || !sub) return;
    main.addEventListener('click', (e)=>{
      e.preventDefault(); e.stopPropagation();
      const willOpen = sub.classList.contains('hidden');
      closeAll();
      if (willOpen){
        sub.classList.remove('hidden');
        sub.style.display = '';
        main.setAttribute('aria-expanded','true');
      }
    });
  });

  document.addEventListener('click', (e)=>{
    const wrap = get('helpTabs');
    if (!wrap?.contains(e.target)) closeAll();
  });
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') closeAll();
  });

  // Map submission info
  get('helpHowToSubmitBtn')?.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); closeAll(); openHelpModal('how_to_submit'); });
  get('helpPlaytestingInfoBtn')?.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); closeAll(); openHelpModal('playtesting_info'); });
  (get('helpDifficultyTechsInfoBtn') || get('helpDifficultyInfoBtn'))?.addEventListener('click', (e)=>{
    e.preventDefault(); e.stopPropagation(); closeAll(); openHelpModal('difficulty_techs_info');
  });

  // Rank promotion
  get('helpRankHowToSubmitBtn')?.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); closeAll(); openHelpModal('rank_how_to_submit'); });
  get('helpRankSubmissionRulesBtn')?.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); closeAll(); openHelpModal('rank_submission_rules'); });
  get('helpRankInfoThresholdsBtn')?.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); closeAll(); openHelpModal('rank_info_thresholds'); });
  get('helpMedalsInfoThresholdsBtn')?.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); closeAll(); openHelpModal('rank_medals_thresholds'); });
})();

(function extendHelpTitles(){
  const originalOpen = openHelpModal;
  window.openHelpModal = function(kind='how_to_submit'){
    const titleByKind = {
      how_to_submit: t?.('help_modal.how_to_submit.title') || 'How to submit',
      playtesting_info: t?.('help_modal.playtesting_info.title') || 'Playtesting Info',
      difficulty_techs_info: t?.('help_modal.difficulty_techs_info.title') || 'Difficulty & Techs',

      rank_how_to_submit: t?.('help_modal.rank_promotion.how_to_submit.title') || 'Rank promotion · How to submit?',
      rank_submission_rules: t?.('help_modal.rank_promotion.submission_rules.title') || 'Rank promotion · Submission Rules',
      rank_info_thresholds: t?.('help_modal.rank_promotion.rank_info_thresholds.title') || 'Rank info & Thresholds',
      rank_medals_thresholds: t?.('help_modal.rank_promotion.medals_info_thresholds.title') || 'Medals info & Thresholds',
    };

    const modalTitle = document.getElementById('helpModalTitle');
    if (modalTitle) modalTitle.textContent = titleByKind[kind] || (t?.('help_modal.common.title') || 'Help');
    return originalOpen(kind);
  };
})();

/* =========================
   HELPERS MODALS BUTTONS
   ========================= */
function openHelpModal(kind = 'how_to_submit') {
  const modal = document.getElementById('helpModal');
  const inner = document.getElementById('helpModalInner');
  const title = document.getElementById('helpModalTitle');
  const body  = document.getElementById('helpModalBody');
  const closeBtn = document.getElementById('helpModalClose');
  if (!modal || !inner || !title || !body || !closeBtn) return;

  const titleByKind = {
    how_to_submit: t?.('help_modal.how_to_submit.title') || 'How to submit',
    playtesting_info: t?.('help_modal.playtesting_info.title') || 'Playtesting Info',
    difficulty_techs_info: t?.('help_modal.difficulty_techs_info.title') || 'Difficulty & Techs',
  };
  title.textContent = titleByKind[kind] || (t?.('help_modal.common.title') || 'Help');

  closeBtn.textContent = t?.('help_modal.common.close_label') || 'Close';
  body.innerHTML = renderMapHelpContent(kind);

  const isRank = typeof kind === 'string' && /^rank_/.test(kind);
  body.innerHTML = isRank ? renderRankHelpContent(kind) : renderMapHelpContent(kind);

  modal.classList.remove('hidden');
  inner.classList.remove('hidden');
  __enter(inner);

  const stopInside = (e) => e.stopPropagation();
  inner.addEventListener('click', stopInside);

  const close = () => {
    inner.removeEventListener('click', stopInside);
    closeHelpModal();
  };

  setTimeout(() => {
    modal.querySelector('.help-modal-backdrop')?.addEventListener('click', close, { once: true });
    closeBtn.addEventListener('click', close, { once: true });

    const onEsc = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); document.removeEventListener('keydown', onEsc, true); }
    };
    document.addEventListener('keydown', onEsc, true);
  }, 0);
}

{
  const diffBtn = document.getElementById('helpDifficultyTechsInfoBtn') || document.getElementById('helpDifficultyInfoBtn');
  diffBtn?.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation(); openHelpModal('difficulty_techs_info');
  });
}

function closeHelpModal() {
  const modal = document.getElementById('helpModal');
  const inner = document.getElementById('helpModalInner');
  if (!modal || !inner) return;
  __exit(inner, () => modal.classList.add('hidden'));
}

/* =========================
   RANK PROMOTION – content renderer
   ========================= */
function renderRankHelpContent(kind) {
  const tf = (key, fb) => (typeof t === 'function' ? (t(key) ?? fb) : fb);

  const li = (txt) => `
    <li class="help-li">
      <span class="dot"></span>
      <span class="text-sm text-zinc-200 leading-relaxed">${txt}</span>
    </li>
  `;
  const card = (title, content) => `
    <section class="rounded-xl border border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.03] p-4 sm:p-5 space-y-2">
      <div class="flex items-center gap-2">
        <svg class="h-4 w-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1 15-5-5 1.414-1.414L11 13.172l6.586-6.586L19 8z"/></svg>
        <h4 class="text-sm font-semibold text-zinc-100">${title}</h4>
      </div>
      ${content}
    </section>
  `;
  const callout = (text) => `
    <div class="rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-200 px-3 py-2 text-sm font-medium leading-relaxed">
      ${text}
    </div>
  `;

  if (kind === 'rank_how_to_submit') {
    const title = tf('help_modal.rank_promotion.how_to_submit.title', 'Rank promotion · How to submit?');

    const intro = callout(
      tf('help_modal.rank_promotion.how_to_submit.intro',
         'To request a rank promotion, you must submit a completion (“record”) on a valid map and provide a quality rating.')
    );

    const req = card(
      tf('help_modal.rank_promotion.how_to_submit.requirements.title', 'Requirements'),
      `
        <ul class="mt-1 space-y-2">
          ${li(tf('help_modal.rank_promotion.how_to_submit.requirements.map_in_pool',
                  'Complete a Genji Parkour map that is in the current map pool.'))}
          ${li(tf('help_modal.rank_promotion.how_to_submit.requirements.map_code_note',
                  "Note: Maps that aren't currently accepted won't appear in the map code field."))}
        </ul>
      `
    );

    const steps = card(
      tf('help_modal.rank_promotion.how_to_submit.steps.title', 'Steps'),
      `
        <ul class="mt-1 space-y-2">
          ${li(tf('help_modal.rank_promotion.how_to_submit.steps.open_tab','Open the “Submit completion” tab.'))}
          ${li(tf('help_modal.rank_promotion.how_to_submit.steps.enter_code','Enter the map code and your record time.'))}
          ${li(tf('help_modal.rank_promotion.how_to_submit.steps.upload_screenshot','Upload a screenshot (required) and optionally a video URL.'))}
          ${li(tf('help_modal.rank_promotion.how_to_submit.steps.select_quality','Select a quality rating (1–6).'))}
          ${li(tf('help_modal.rank_promotion.how_to_submit.steps.submit','Click “Submit record”.'))}
          ${li(tf('help_modal.rank_promotion.how_to_submit.steps.verification','Your submission will go through a verification process.'))}
          ${li(tf('help_modal.rank_promotion.how_to_submit.steps.notification',"Once verified, you'll receive a notification."))}
        </ul>
      `
    );

    const quality = card(
      tf('help_modal.rank_promotion.how_to_submit.quality.title','Quality rating scale'),
      `
        <div class="grid gap-2 sm:grid-cols-2">
          <div class="pt-req"><span>${tf('help_modal.rank_promotion.how_to_submit.quality.six','6: Excellent')}</span></div>
          <div class="pt-req"><span>${tf('help_modal.rank_promotion.how_to_submit.quality.five','5: Great')}</span></div>
          <div class="pt-req"><span>${tf('help_modal.rank_promotion.how_to_submit.quality.four','4: Good')}</span></div>
          <div class="pt-req"><span>${tf('help_modal.rank_promotion.how_to_submit.quality.three','3: Average')}</span></div>
          <div class="pt-req"><span>${tf('help_modal.rank_promotion.how_to_submit.quality.two','2: Subpar')}</span></div>
          <div class="pt-req"><span>${tf('help_modal.rank_promotion.how_to_submit.quality.one','1: Poor')}</span></div>
        </div>
      `
    );

    return `
      <div class="space-y-4">
        ${intro}
        ${req}
        ${steps}
        ${quality}
      </div>
    `;
  }

  if (kind === 'rank_submission_rules') {
    const tf = (key, fb) => (typeof t === 'function' ? (t(key) ?? fb) : fb);

    const li = (txt) => `
      <li class="help-li">
        <span class="dot"></span>
        <span class="text-sm text-zinc-200 leading-relaxed">${txt}</span>
      </li>
    `;
    const card = (title, content) => `
      <section class="rounded-xl border border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.03] p-4 sm:p-5 space-y-2">
        <div class="flex items-center gap-2">
          <svg class="h-4 w-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1 15-5-5 1.414-1.414L11 13.172l6.586-6.586L19 8z"/></svg>
          <h4 class="text-sm font-semibold text-zinc-100">${title}</h4>
        </div>
        ${content}
      </section>
    `;
    const warn = (text) => `
      <div class="rounded-lg border border-amber-400/30 bg-amber-400/10 text-amber-200 px-3 py-2 text-sm font-medium leading-relaxed">
        ${text}
      </div>
    `;

    const completion = card(
      tf('help_modal.rank_promotion.submission_rules.completion.title', 'Completion Requirements/Guidelines'),
      `
        <ul class="mt-1 space-y-2">
          ${li(tf('help_modal.rank_promotion.submission_rules.completion.li_code_match',
                  'Map code in the screenshot must match the map code in the bot.'))}
          ${li(tf('help_modal.rank_promotion.submission_rules.completion.li_time_display',
                  'Time must be displayed in either the Top 5 leaderboard or as the announcement in the middle of the screen. For video submissions, it must show both.'))}
          ${li(tf('help_modal.rank_promotion.submission_rules.completion.li_no_edit_map',
                  'You cannot edit the map in any way using Custom Game settings, Workshop Settings, or any other Workshop code. This includes but is not limited to changing tech bans, gravity, etc.'))}
          ${li(tf('help_modal.rank_promotion.submission_rules.completion.li_no_scripts',
                  'You are not allowed to use scripts, macros, or anything similar to complete any portion of a map.'))}
          ${li(tf('help_modal.rank_promotion.submission_rules.completion.li_no_banned_tech',
                  'You may not use a banned tech (restricted via map author / listed in @GenjiBot#9209) where the ban is non-functional due to Workshop bugs.'))}
        </ul>
      `
    );

    const records = card(
      tf('help_modal.rank_promotion.submission_rules.records.title', 'Records Only'),
      `
        <ul class="mt-1 space-y-2">
          ${li(tf('help_modal.rank_promotion.submission_rules.records.li_time_visible',
                  'Time must be fully visible from 0.00 to the finish. Do not fade in or out while the timer is running.'))}
          ${li(tf('help_modal.rank_promotion.submission_rules.records.li_video_required',
                  'Video proof is required for World Records and Medals.'))}
          ${li(tf('help_modal.rank_promotion.submission_rules.records.li_no_cuts',
                  'Cuts in the video are not allowed (between 0.00 and finish).'))}
          ${li(tf('help_modal.rank_promotion.submission_rules.records.li_sound_not_required',
                  'Game sound is not required.'))}
          ${li(tf('help_modal.rank_promotion.submission_rules.records.li_editing_ok_but_no_interfere',
                  'Editing before and after is allowed, but it cannot interfere with the timer or any ability to validate the submission.'))}
        </ul>
      `
    );

    const disclaimer = warn(
      tf('help_modal.rank_promotion.submission_rules.reserve_rights',
        'Senseis reserve the right to deny any submission for any reason, regardless if it is listed here or not.')
    );

    return `
      <div class="space-y-4">
        ${completion}
        ${records}
        ${disclaimer}
      </div>
    `;
  }

  if (kind === 'rank_info_thresholds') {
    const info = card(
      tf('help_modal.rank_promotion.rank_info_thresholds.info.title','Ranks Info'),
      `
        <ul class="mt-1 space-y-2">
          ${li(tf('help_modal.rank_promotion.rank_info_thresholds.info.li_no_order',
                  'Ranks do not need to be acquired in order.'))}
          ${li(tf('help_modal.rank_promotion.rank_info_thresholds.info.li_requirement',
                  'To receive a rank you must complete the required amount of maps for that difficulty/rank.'))}
          ${li(tf('help_modal.rank_promotion.rank_info_thresholds.info.li_thresholds',
                  'See chart below for rank thresholds.'))}
        </ul>
      `
    );

    const F = (k, fb) => tf(`filters.${k}`, fb);
    const R = (k, p, fb) => tf(`help_modal.rank_promotion.rank_info_thresholds.rows.${k}.${p}`, fb);
    const CL = tf('help_modal.rank_promotion.rank_info_thresholds.table.completions_label','completions');
    const NA = tf('help_modal.rank_promotion.rank_info_thresholds.table.na','N/A');

    const ranks = [
      { key:'ninja',        diff:F('beginner','Beginner'),  count:null, img:R('ninja','image','/assets/ranks/ninja.webp') },
      { key:'jumper',       diff:F('easy','Easy'),          count:10,   img:R('jumper','image','/assets/ranks/jumper.webp') },
      { key:'skilled',      diff:F('medium','Medium'),      count:10,   img:R('skilled','image','/assets/ranks/skilled.webp') },
      { key:'pro',          diff:F('hard','Hard'),          count:10,   img:R('pro','image','/assets/ranks/pro.webp') },
      { key:'master',       diff:F('very_hard','Very Hard'),count:10,   img:R('master','image','/assets/ranks/master.webp') },
      { key:'grand_master', diff:F('extreme','Extreme'),    count:7,    img:R('grand_master','image','/assets/ranks/grand_master.webp') },
      { key:'god',          diff:F('hell','Hell'),          count:3,    img:R('god','image','/assets/ranks/god.webp') },
    ];

    const cardRank = (r) => `
      <div class="rank-card">
        <img src="${r.img}" alt="${R(r.key,'name',r.key)} badge" class="rank-img" loading="lazy">
        <div class="rank-name">${R(r.key,'name',r.key)}</div>
        <div class="rank-diff">${r.diff}</div>
        <div class="rank-count">
          ${r.count == null
            ? `<span class="opacity-70">— ${NA}</span>`
            : `<strong class="text-zinc-100">${r.count}</strong> <span class="opacity-80">${CL}</span>`}
        </div>
      </div>
    `;

    const grid = card(
      tf('help_modal.rank_promotion.rank_info_thresholds.table.title','Rank & Difficulty chart'),
      `<div class="rank-grid">${ranks.map(cardRank).join('')}</div>`
    );

    return `<div class="space-y-4">${info}${grid}</div>`;
  }

  if (kind === 'rank_medals_thresholds') {
    const info = card(
      tf('help_modal.rank_promotion.medals_info_thresholds.info.title','Medals Info'),
      `
        <ul class="mt-1 space-y-2">
          ${li(tf('help_modal.rank_promotion.medals_info_thresholds.info.li_plus_explain',
                  'To get a +, ++ or +++ rank, you must obtain the same amount of Bronze, Silver, or Gold medals as the rank normally requires (see chart below).'))}
          ${li(tf('help_modal.rank_promotion.medals_info_thresholds.info.li_time_and_video_required',
                  'You must post a completion which includes a time and a video URL showing your run.'))}
          ${li(tf('help_modal.rank_promotion.medals_info_thresholds.info.li_icon_next_to_name',
                  'You will get an icon next to your name if you have a plus (+, ++, +++) rank!'))}
          ${li(tf('help_modal.rank_promotion.medals_info_thresholds.info.li_auto_receive',
                  "Once verified, you'll automatically receive your medal."))}
          ${li(tf('help_modal.rank_promotion.medals_info_thresholds.info.li_retroactive_credit',
                  'If medals are added to a map after you have already submitted, you will still get credit.'))}
        </ul>
      `
    );

    const D = {
      beginner: tf('filters.beginner','Beginner'),
      easy: tf('filters.easy','Easy'),
      medium: tf('filters.medium','Medium'),
      hard: tf('filters.hard','Hard'),
      very_hard: tf('filters.very_hard','Very Hard'),
      extreme: tf('filters.extreme','Extreme'),
      hell: tf('filters.hell','Hell'),
    };
    const DIFF_KEYS = ['beginner','easy','medium','hard','very_hard','extreme','hell'];

    const COUNTS = { beginner: null, easy: 10, medium: 10, hard: 10, very_hard: 10, extreme: 7, hell: 3 };

    const medalImg = (k) =>
      tf(`help_modal.rank_promotion.medals_info_thresholds.images.${k}`, `/assets/medals/${k}.png`);

    const ML = tf('help_modal.rank_promotion.medals_info_thresholds.table.completions_label','medals');
    const NA = tf('help_modal.rank_promotion.medals_info_thresholds.table.na','N/A');

    const MEDALS = [
      { key:'gold',   label: tf('help_modal.rank_promotion.medals_info_thresholds.table.medal_gold','Gold'),   src: medalImg('gold')   },
      { key:'silver', label: tf('help_modal.rank_promotion.medals_info_thresholds.table.medal_silver','Silver'), src: medalImg('silver') },
      { key:'bronze', label: tf('help_modal.rank_promotion.medals_info_thresholds.table.medal_bronze','Bronze'), src: medalImg('bronze') },
    ];

    const head = DIFF_KEYS.map(k => `<div class="tech-hcell">${D[k]}</div>`).join('');
    const cell = (count) =>
      `<div class="tech-cell text-sm text-zinc-200">${count==null ? `<span class="opacity-70">${NA}</span>` : `<strong class="text-zinc-100">${count}</strong> <span class="opacity-80">${ML}</span>`}</div>`;

    const rows = MEDALS.map(m => `
      <div class="tech-rlabel flex items-center gap-2">
        <img src="${m.src}" alt="${m.label}" class="h-5 w-5 object-contain" loading="lazy">
        <span>${m.label}</span>
      </div>
      ${DIFF_KEYS.map(k => cell(COUNTS[k])).join('')}
    `).join('');

    const table = card(
      tf('help_modal.rank_promotion.medals_info_thresholds.table.title','Medal thresholds by difficulty'),
      `
        <div class="tech-grid">
          <div></div>${head}
          ${rows}
        </div>
      `
    );

    return `<div class="space-y-4">${info}${table}</div>`;
  }

  return `
    <div class="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
      ${tf('help_modal.common.soon','Coming soon.')}
    </div>
  `;
}

/* =========================
   HELPERS CONTENT RENDER
   ========================= */
function renderMapHelpContent(kind) {
  const tf = (key, fallback) => (typeof t === 'function' ? (t(key) ?? fallback) : fallback);

  // ── PLAYTESTING INFO ─────────────────────────────────────────
  if (kind === 'playtesting_info') {
    const li = (txt) => `
      <li class="help-li">
        <span class="dot"></span>
        <span class="text-sm text-zinc-200 leading-relaxed">${txt}</span>
      </li>
    `;

    const card = (title, content) => `
      <section class="rounded-xl border border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.03] p-4 sm:p-5 space-y-2">
        <div class="flex items-center gap-2">
          <svg class="h-4 w-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1 15-5-5 1.414-1.414L11 13.172l6.586-6.586L19 8z"/></svg>
          <h4 class="text-sm font-semibold text-zinc-100">${title}</h4>
        </div>
        ${content}
      </section>
    `;

    const callout = (text) => `
      <div class="rounded-lg border border-rose-500/25 bg-rose-500/10 text-rose-200 px-3 py-2 text-sm font-medium leading-relaxed">
        ${text}
      </div>
    `;

    const eligibility = callout(
      tf('help_modal.playtesting_info.must_submit_completion',
         'You must have submitted a completion for the map to vote!')
    );

    const rules = card(
      tf('help_modal.playtesting_info.rules.title', 'Playtesting rules'),
      `
        <ul class="mt-1 space-y-2">
          ${li(tf('help_modal.playtesting_info.rules.needs_votes_and_completions',
                  'Each difficulty requires a specific amount of votes and completion submissions.'))}
          ${li(tf('help_modal.playtesting_info.rules.creator_cannot_vote',
                  'Creators cannot vote for their own map; their map submission contains their best estimate of difficulty.'))}
          ${li(tf('help_modal.playtesting_info.rules.playtesters_give_tips',
                  'Playtesters will provide tips to the creator on how to improve the map, or what must change if there are glaring issues.'))}
        </ul>
      `
    );

    const V  = (k, fb) => tf(`help_modal.playtesting_info.votes.${k}`, fb);
    const VC = (k, fb) => tf(`help_modal.playtesting_info.votes.counts.${k}`, fb);
    const voteRow = (lk, lf, ck, cf) => `
      <div class="pt-req">
        <span class="text-sm">${V(lk, lf)}</span>
        <strong class="text-sm">${VC(ck, cf)}</strong>
      </div>
    `;

    const votes = card(
      V('title','Required votes'),
      `
        <div class="grid gap-2">
          ${voteRow('beginner_to_hard','Beginner → Hard','beginner_to_hard',`5 ${V('votes','votes')}`)}
          ${voteRow('very_hard','Very Hard','very_hard',`3 ${V('votes','votes')}`)}
          ${voteRow('extreme','Extreme','extreme',`2 ${V('votes','votes')}`)}
          ${voteRow('hell','Hell','hell',`1 ${V('vote','vote')}`)}
        </div>
      `
    );

    const rulesAndVotes = `
      <div class="grid gap-4 lg:grid-cols-5">
        <div class="lg:col-span-3">${rules}</div>
        <div class="lg:col-span-2">${votes}</div>
      </div>
    `;

    const P  = (k, fb) => tf(`help_modal.playtesting_info.process.${k}`, fb);
    const PS = (k, fb) => tf(`help_modal.playtesting_info.process.steps.${k}`, fb);
    const PN = (k, fb) => tf(`help_modal.playtesting_info.process.notes.${k}`, fb);

    const process = card(
      P('title', 'Process'),
      `
      <div class="help-pt pt-grid">
        <!-- Creation -->
        <div class="pt-phase">
          <div class="pt-phase-title">${P('creation','Creation Phase')}</div>
          <div class="pt-card">
            <div class="pt-step">${PS('map_is_made','Map is made')}</div>
            <div class="pt-step">${PS('map_submission_form','Map submission form')}</div>
            <div class="pt-note">${PN('change_only_by_sensei','Changing map details can only be done via a Sensei (restrictions, code, etc.).')}</div>
          </div>
        </div>

        <div class="pt-arrow" aria-hidden="true"></div>

        <!-- Testing -->
        <div class="pt-phase">
          <div class="pt-phase-title">${P('testing','Testing Phase')}</div>
          <div class="pt-card">
            <div class="pt-step">${PS('creator_suggests_difficulty','Creator suggests difficulty')}</div>
            <div class="pt-step">${PS('testers_submit_completion','Testers submit completion')}</div>
            <div class="pt-step">${PS('testers_vote_on_difficulty','Testers vote on difficulty')}</div>
            <div class="pt-step">${PS('creator_finalizes_submission','Creator finalizes submission')}</div>
          </div>
        </div>

        <div class="pt-arrow" aria-hidden="true"></div>

        <!-- Verification -->
        <div class="pt-phase">
          <div class="pt-phase-title">${P('verification','Verification Phase')}</div>
          <div class="pt-card">
            <div class="pt-step">${PS('sensei_receive_submission_notification','Sensei receive submission notification')}</div>
            <div class="pt-step flex items-center gap-2">
              <span class="pt-chip pt-chip-accept">${PS('accept','accept')}</span>
              <span class="pt-chip pt-chip-reject">${PS('reject','reject')}</span>
            </div>
            <div class="pt-step">${PS('map_sent_back_previous_step','Map is sent back to a previous step*')}</div>
            <div class="pt-note">${PN('verification_removal','* Completions and votes may be removed at this step.')}</div>
          </div>
        </div>

        <div class="pt-arrow" aria-hidden="true"></div>

        <!-- Acceptance -->
        <div class="pt-phase">
          <div class="pt-phase-title">${P('acceptance','Acceptance')}</div>
          <div class="pt-card">
            <div class="pt-step">${PS('map_accepted','Map accepted')}</div>
            <div class="pt-step">${PS('map_added_to_pool','Map added to map pool')}</div>
            <div class="pt-step">${PS('testers_granted_completion_without_time','Testers granted completion (without time)')}</div>
          </div>
        </div>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <span class="inline-flex items-center gap-1">
          <span class="pt-chip pt-chip-accept"> ${PS('accept','accept')} </span>
          <span class="ml-1">= Sensei approval</span>
        </span>
        <span class="inline-flex items-center gap-1">
          <span class="pt-chip pt-chip-reject"> ${PS('reject','reject')} </span>
          <span class="ml-1">= ${PS('map_sent_back_previous_step','Map is sent back to a previous step*')}</span>
        </span>
      </div>

      <p class="mt-2 text-xs text-zinc-400">${PN('sensei_power','At any point, a Sensei has the ability to manually force any outcome or revert to any step.')}</p>
      `
    );

    return `
      <div class="space-y-4">
        ${eligibility}
        ${rulesAndVotes}
        ${process}
      </div>
    `;
  }

  // ── HOW TO SUBMIT ─────────────────────────────────
  if (kind === 'how_to_submit') {
    const li = (txt) => `
      <li class="help-li">
        <span class="dot"></span>
        <span class="text-sm text-zinc-200">${txt}</span>
      </li>
    `;

    const section = (title, content) => `
      <section class="helpsec rounded-xl border border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.03] p-4 sm:p-5 space-y-2">
        <div class="flex items-center gap-2">
          <svg class="h-4 w-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1 15-5-5 1.414-1.414L11 13.172l6.586-6.586L19 8z"/></svg>
          <h4 class="text-sm font-semibold text-zinc-100">${title}</h4>
        </div>
        ${content}
      </section>
    `;

    const callout = (text) => `
      <div class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-200 px-3 py-2 text-sm">
        ${text}
      </div>
    `;

    const intro = `${tf('help_modal.how_to_submit.intro','This dialog walks you through every step of the “Submit map” section.') ? callout(tf('help_modal.how_to_submit.intro','This dialog walks you through every step of the “Submit map” section.')) : ''}`;
    const meta = section(
      tf('help_modal.how_to_submit.meta.title','1) Metadata (map & creators)'),
      `<ul class="mt-1 space-y-1.5">
        ${li(tf('help_modal.how_to_submit.meta.li_creator','Main creator: it is auto-filled from your session. You can change it (and add co-creators if the option is visible).'))}
        ${li(tf('help_modal.how_to_submit.meta.li_code','Map code: click “Edit” next to the “Code” field. The code must be unique (we check if it already exists).'))}
        ${li(tf('help_modal.how_to_submit.meta.li_name','Map name: click “Edit” next to “Map name” and pick a name via autocomplete.'))}
        ${li(tf('help_modal.how_to_submit.meta.li_checkpoints','Checkpoints: click “Edit” and enter a strictly positive number.'))}
      </ul>`
    );
    const required = section(
      tf('help_modal.how_to_submit.required.title','2) Required fields'),
      `<p class="text-sm text-zinc-300">${tf('help_modal.how_to_submit.required.p1','These fields must be provided before you can submit:')}</p>
       <ul class="mt-2 space-y-1.5">
        ${li(tf('help_modal.how_to_submit.required.li_difficulty','Difficulty: choose a value (Easy → Hell).'))}
        ${li(tf('help_modal.how_to_submit.required.li_category','Category / Map type: choose a type (e.g., Classic, Increasing Difficulty).'))}
        ${li(tf('help_modal.how_to_submit.required.li_mechanics','Mechanics: select at least one.'))}
        ${li(tf('help_modal.how_to_submit.required.li_restrictions','Restrictions: select at least one.'))}
       </ul>`
    );
    const medals = section(
      tf('help_modal.how_to_submit.medals.title','3) Medals (optional but validated if present)'),
      `<p class="text-sm text-zinc-300">${tf('help_modal.how_to_submit.medals.p1','You may define times (in seconds) for Gold, Silver, and Bronze.')}</p>
       <div class="mt-2 rounded-md border border-white/10 bg-zinc-900/50 p-3 text-xs text-zinc-300">
         <div class="font-medium mb-1">${tf('help_modal.how_to_submit.medals.li_rules','If you set one medal, you must set all three.')}</div>
         <div class="grid gap-2 sm:grid-cols-3">
           <div class="rounded-md border border-white/10 bg-white/5 px-2 py-1.5"><span class="text-amber-500 font-semibold">Bronze</span> &gt; <span class="text-zinc-200">Silver</span> &gt; <span class="text-yellow-300">Gold</span></div>
           <div class="rounded-md border border-white/10 bg-white/5 px-2 py-1.5"><code class="text-xs text-zinc-200">${tf('help_modal.how_to_submit.medals.li_pattern','Format: 1–5 digits, optionally “.” and 1–2 decimals (e.g., 5550.23). Non-negative values.')}</code></div>
           <div class="rounded-md border border-white/10 bg-white/5 px-2 py-1.5">${tf('help_modal.how_to_submit.medals.li_order','Required ordering: Bronze > Silver > Gold (Bronze greater than Silver, which is greater than Gold).')}</div>
         </div>
       </div>`
    );
    const optional = section(
      tf('help_modal.how_to_submit.optional.title','4) Optional'),
      `<ul class="mt-1 space-y-1.5">
        ${li(tf('help_modal.how_to_submit.optional.li_title','Title: short optional title (max 128 chars).'))}
        ${li(tf('help_modal.how_to_submit.optional.li_banner','Custom banner: drag & drop or click to upload (JPG/PNG/WebP/AVIF), size ≤ 8MB. 16:9 recommended.'))}
        ${li(tf('help_modal.how_to_submit.optional.li_description','Description: free text (if empty, “N/A” is shown).'))}
        ${li(tf('help_modal.how_to_submit.optional.li_guide','Guide URL(s): one URL per line. The first valid URL is used.'))}
       </ul>`
    );
    const submit = section(
      tf('help_modal.how_to_submit.submit.title','5) Submit'),
      `<ul class="mt-1 space-y-1.5">
        ${li(tf('help_modal.how_to_submit.submit.li_validation','Click “Submit”. The form validates: main creator, unique code, map name, checkpoints > 0, difficulty, category, ≥1 mechanic and ≥1 restriction, and medal consistency if present.'))}
        ${li(tf('help_modal.how_to_submit.submit.li_confirmation','On success, a confirmation toast appears and the form resets.'))}
       </ul>`
    );
    const tips = section(
      tf('help_modal.how_to_submit.tips.title','Tips'),
      `<ul class="mt-1 space-y-1.5">
        ${li(tf('help_modal.how_to_submit.tips.li_edit','Fields with an “Edit” button can be quickly corrected inline.'))}
        ${li(tf('help_modal.how_to_submit.tips.li_guest','If you are not logged in, submission is locked and a “Login required” message is shown.'))}
        ${li(tf('help_modal.how_to_submit.tips.li_support','If banner upload fails, try again (≤ 8MB) or contact support.'))}
       </ul>`
    );

    return `
      <div class="space-y-4">
        ${intro}
        ${meta}
        ${required}
        ${medals}
        ${optional}
        ${submit}
        ${tips}
      </div>
    `;
  }

  // ── DIFFICULTY & TECHS INFO ───────────────────────────────────
  if (kind === 'difficulty_techs_info') {
    const tf = (key, fb) => (typeof t === 'function' ? (t(key) ?? fb) : fb);

    const D = {
      beginner:  tf('filters.beginner',  tf('help_modal.difficulty_techs_info.labels.beginner',  'Beginner')),
      easy:      tf('filters.easy',      tf('help_modal.difficulty_techs_info.labels.easy',      'Easy')),
      medium:    tf('filters.medium',    tf('help_modal.difficulty_techs_info.labels.medium',    'Medium')),
      hard:      tf('filters.hard',      tf('help_modal.difficulty_techs_info.labels.hard',      'Hard')),
      very_hard: tf('filters.very_hard', tf('help_modal.difficulty_techs_info.labels.very_hard', 'Very Hard')),
      extreme:   tf('filters.extreme',   tf('help_modal.difficulty_techs_info.labels.extreme',   'Extreme')),
      hell:      tf('filters.hell',      tf('help_modal.difficulty_techs_info.labels.hell',      'Hell')),
    };
    const DIFF_KEYS = ['beginner','easy','medium','hard','very_hard','extreme','hell'];

    const T = (k, fb) => tf(`help_modal.difficulty_techs_info.techs.${k}`, fb);
    const ROWS = [
      { name: T('basics','Basics*'),         lv: [1,2,3,3,3,3,3] },
      { name: T('bhop','Bhop**'),            lv: [0,1,2,3,3,3,3] },
      { name: T('edge_climb','Edge Climb'),  lv: [0,1,2,3,3,3,3] },
      { name: T('stall','Stall'),            lv: [0,0,1,2,3,3,3] },
      { name: T('crouch_edge','Crouch Edge'),lv: [0,0,1,2,3,3,3] },
      { name: T('save_climb','Save Climb'),  lv: [0,0,1,2,3,3,3] },
      { name: T('distance_edge','Distance Edge'), lv: [0,0,0,1,2,3,3] },
      { name: T('high_edge','High Edge'),    lv: [0,0,0,1,2,3,3] },
      { name: T('multi_climb','Multi Climb'),lv: [0,0,0,0,1,2,3] },
      { name: T('create_bhop','Create Bhop'),lv: [0,0,0,0,1,2,3] },
    ];

    const legendCard = (cls, title, text) => `
      <div class="tech-legend-card">
        <span class="tick ${cls}" aria-hidden="true">✓</span>
        <div class="space-y-0.5">
          <div class="text-sm font-semibold text-zinc-100">${title}</div>
          <div class="text-xs text-zinc-300">${text}</div>
        </div>
      </div>
    `;

    const legend = `
      <div class="grid gap-3 sm:grid-cols-3">
        ${legendCard('lv1',
          tf('help_modal.difficulty_techs_info.legend.lv1_title','Simple / priority use'),
          tf('help_modal.difficulty_techs_info.legend.lv1_desc','Simple and easy use of the technique with priority on it.')
        )}
        ${legendCard('lv2',
          tf('help_modal.difficulty_techs_info.legend.lv2_title','Common / sometimes advanced'),
          tf('help_modal.difficulty_techs_info.legend.lv2_desc','Frequent use of the common technique and rare use of advanced forms.')
        )}
        ${legendCard('lv3',
          tf('help_modal.difficulty_techs_info.legend.lv3_title','Advanced / demanding'),
          tf('help_modal.difficulty_techs_info.legend.lv3_desc','Complex and demanding use of the technique.')
        )}
      </div>
    `;

    const headCells = DIFF_KEYS.map(k => `<div class="tech-hcell">${D[k]}</div>`).join('');
    const mark = (n) => n
      ? `<div class="tech-cell"><span class="tick ${n===1?'lv1':n===2?'lv2':'lv3'}" aria-hidden="true">✓</span></div>`
      : `<div class="tech-cell"></div>`;

    const rowsHtml = ROWS.map(r => `
      <div class="tech-rlabel">${r.name}</div>
      ${r.lv.map(mark).join('')}
    `).join('');

    const table = `
      <div class="tech-grid">
        <div></div>${headCells}
        ${rowsHtml}
      </div>
    `;

    const notes = `
      <div class="mt-2 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-zinc-300">
        <div><span class="font-semibold">*</span> ${tf('help_modal.difficulty_techs_info.notes.star','Double Jump / Slide / Wall Climb')}</div>
        <div><span class="font-semibold">**</span> ${tf('help_modal.difficulty_techs_info.notes.double_star','Late Bhop / First Bhop / Emote Savebhop / Deathbhop')}</div>
      </div>
    `;

    const card = (title, content) => `
      <section class="helpsec rounded-xl border border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.03] p-4 sm:p-5 space-y-3">
        <div class="flex items-center gap-2">
          <svg class="h-4 w-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1 15-5-5 1.414-1.414L11 13.172l6.586-6.586L19 8z"/></svg>
          <h4 class="text-sm font-semibold text-zinc-100">${title}</h4>
        </div>
        ${content}
      </section>
    `;

    return `
      <div class="space-y-4">
        ${card(tf('help_modal.difficulty_techs_info.legend_title','Legend'), legend)}
        ${card(tf('help_modal.difficulty_techs_info.matrix_title','Techniques by difficulty'), table + notes)}
      </div>
    `;
  }

  return `
    <div class="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
      ${tf('help_modal.common.soon','Coming soon.')}
    </div>
  `;
}

document.getElementById('helpHowToSubmitBtn')?.addEventListener('click', (e) => {
  e.preventDefault(); e.stopPropagation(); openHelpModal('how_to_submit');
});
document.getElementById('helpPlaytestingInfoBtn')?.addEventListener('click', (e) => {
  e.preventDefault(); e.stopPropagation(); openHelpModal('playtesting_info');
});
document.getElementById('helpDifficultyTechsInfoBtn')?.addEventListener('click', (e) => {
  e.preventDefault(); e.stopPropagation(); openHelpModal('difficulty_techs_info');
});

/* =========================
   GLOBAL INITS
   ========================= */
async function initializeSubmitMap() {
  renderSubmitMapSection();
  await primeMainCreatorFromSession();
  setupBannerDropzone();
  setupAllCustomDropdowns();
  attachSubmitMapAutocompletes();
  bindSubmitMapEditButtons(document.getElementById('submitMapSection'));
  setupMedalsInputs();
  setupForms();
}

function initializeSubmitRecord() {
  attachRecordAutocompletes();
  dragAndDrop();
  qualitySlider();
}

async function initializeApp() {
  //showLoadingBar();
  fillMechanicsAndRestrictions().catch(() => {});
  setupTabs();
  setupForms();
  hideLoadingBar();
}

document.addEventListener('DOMContentLoaded', initializeApp);
