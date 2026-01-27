// ———————————————————————————————————————————————————————————————

import { cdnAsset } from "./cdn";

// Prevent spam
function preventExcessiveRefresh(maxRefreshes, timeWindow) {
  const storageKey = 'pageRefreshes';
  const now = Date.now();

  let refreshes = localStorage.getItem(storageKey);
  refreshes = refreshes ? JSON.parse(refreshes) : [];

  refreshes = refreshes.filter((timestamp) => now - timestamp < timeWindow);

  refreshes.push(now);

  if (refreshes.length > maxRefreshes) {
    const uid =
      typeof user_id !== 'undefined' && user_id !== null
        ? `<p><strong>User ID :</strong> ${user_id}</p>`
        : '';

    document.body.innerHTML = `
          <h1>Excessive page refresh (${maxRefreshes} rafraîchissements en ${timeWindow / 1000}s détectés)</h1>
          ${uid}
        `;
    throw new Error(
      typeof user_id !== 'undefined' && user_id !== null
        ? `Excessive page refresh. Page blocked. UID: ${user_id}`
        : 'Excessive page refresh. Page blocked.'
    );
  }

  localStorage.setItem(storageKey, JSON.stringify(refreshes));
}

document.addEventListener('DOMContentLoaded', function () {
  preventExcessiveRefresh(5, 2000);
});

// ———————————————————————————————————————————————————————————————
// Search redirect
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function activateSectionFromURL() {
  const section = getQueryParam('section');
  if (section && typeof selectSection === 'function') {
    selectSection(section);

    const activeButton = document.getElementById(section + 'Btn');
    if (activeButton) {
      document.querySelectorAll('.tab-buttons button').forEach((button) => {
        button.classList.remove('active');
      });
      activeButton.classList.add('active');
    }
  }
}

window.addEventListener('load', activateSectionFromURL);

// ———————————————————————————————————————————————————————————————
// Redirect 404
function checkConnectivity() {
  if (!navigator.onLine) {
    window.location.href = './game';
  }
}

checkConnectivity();

window.addEventListener('offline', () => {
  checkConnectivity();
});

// ———————————————————————————————————————————————————————————————
// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', String(!isHidden));
  });
}

// ———————————————————————————————————————————————————————————————
// Nav dropdowns
const dropdownConfigs = [
  { btnId: 'searchBtn', menuId: 'searchMenu' },
  { btnId: 'communityBtn', menuId: 'communityMenu' },
  { btnId: 'submitBtn', menuId: 'submitMenu' },
  { btnId: 'langBtn', menuId: 'langMenu' },
  { btnId: 'avatarBtn', menuId: 'avatarMenu' },
];

const dropdownInstances = dropdownConfigs
  .map(({ btnId, menuId }) => {
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    if (!btn || !menu) return null;
    return { btn, menu };
  })
  .filter(Boolean);

function closeAllDropdowns() {
  dropdownInstances.forEach(({ btn, menu }) => {
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.add('invisible', 'opacity-0', 'translate-y-1');
  });
}

function toggleDropdown(targetBtn) {
  const instance = dropdownInstances.find(({ btn }) => btn === targetBtn);
  if (!instance) return;

  const { btn, menu } = instance;
  const isExpanded = btn.getAttribute('aria-expanded') === 'true';

  closeAllDropdowns();

  if (!isExpanded) {
    btn.setAttribute('aria-expanded', 'true');
    menu.classList.remove('invisible', 'opacity-0', 'translate-y-1');
  }
}

dropdownInstances.forEach(({ btn }) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(btn);
  });
});

document.addEventListener('click', (e) => {
  const clickedInsideAny =
    dropdownInstances.some(
      ({ btn, menu }) =>
        btn.contains(e.target) || menu.contains(e.target)
    );

  if (!clickedInsideAny) {
    closeAllDropdowns();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllDropdowns();
  }
});

// ———————————————————————————————————————————————————————————————
// Theme (no flicker between pages)
const toggle = document.getElementById('themeToggle');
const root = document.documentElement;

const THEME_KEY = 'theme';
const THEME_COOKIE = 'theme';
const LEGACY_KEYS = ['gp-theme'];

function __normalizeTheme(v) {
  const t = String(v || '').trim().toLowerCase();
  return (t === 'dark' || t === 'light') ? t : '';
}

function __readCookie(name) {
  try {
    const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = document.cookie.match(new RegExp('(?:^|;\\s*)' + esc + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  } catch {
    return '';
  }
}

function __writeThemeCookie(theme) {
  try {
    document.cookie = `${THEME_COOKIE}=${encodeURIComponent(theme)}; Path=/; Max-Age=31536000; SameSite=Lax`;
  } catch {}
}

function __getSavedTheme() {
  const fromDataset = __normalizeTheme(root?.dataset?.theme);
  if (fromDataset) return fromDataset;

  const fromCookie = __normalizeTheme(__readCookie(THEME_COOKIE));
  if (fromCookie) return fromCookie;

  try {
    const v = __normalizeTheme(localStorage.getItem(THEME_KEY));
    if (v) return v;
    for (const k of LEGACY_KEYS) {
      const lv = __normalizeTheme(localStorage.getItem(k));
      if (lv) return lv;
    }
  } catch {}

  return 'dark';
}

function applyTheme(theme, opts = {}) {
  const t = __normalizeTheme(theme) || 'dark';
  const { persist = true } = opts;

  // Tailwind is configured with darkMode selector: [data-theme="dark"]
  root.dataset.theme = t;
  root.style.colorScheme = t;

  // Keep legacy `.dark` class in sync (some CSS/3rd-party may still rely on it)
  root.classList.toggle('dark', t === 'dark');

  if (persist) {
    try { localStorage.setItem(THEME_KEY, t); } catch {}
    for (const k of LEGACY_KEYS) {
      try { localStorage.removeItem(k); } catch {}
    }
    __writeThemeCookie(t);
  }

  toggle?.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
}

// Respect server-rendered theme (cookie) if present.
const initialTheme = __normalizeTheme(root?.dataset?.theme);
applyTheme(initialTheme || __getSavedTheme(), { persist: !initialTheme });

toggle?.addEventListener('click', () => {
  const current = __normalizeTheme(root?.dataset?.theme) || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next, { persist: true });
});

// Re-enable transitions after first paint (prevents color/hover transitions firing on load)
try {
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-preload')));
} catch {
  root.classList.remove('theme-preload');
}

// ———————————————————————————————————————————————————————————————
// Logo hover
const logo = document.getElementById('brandLogo');
if (logo) {
  const root = document.documentElement;

  const isDark = () => {
    const dt = String(root?.dataset?.theme || '').toLowerCase();
    return dt === 'dark' || root.classList.contains('dark');
  };

  const getSrcs = () => {
    if (isDark()) {
      return { staticSrc: logo.dataset.staticDark, animSrc: logo.dataset.animDark };
    }
    return { staticSrc: logo.dataset.staticLight, animSrc: logo.dataset.animLight };
  };

  let hovering = false;

  const setSrc = (src) => {
    if (!src) return;
    if (logo.getAttribute('src') !== src) logo.setAttribute('src', src);
  };

  const preloadCurrentTheme = () => {
    const { staticSrc, animSrc } = getSrcs();
    if (staticSrc) new Image().src = staticSrc;
    if (animSrc) new Image().src = animSrc;
  };

  const applyLogo = () => {
    const { staticSrc, animSrc } = getSrcs();
    const desired = hovering ? animSrc : staticSrc;

    if (!desired) return;
    if (logo.currentSrc === desired || logo.getAttribute('src') === desired) return;

    setSrc(desired);
  };

  // init
  preloadCurrentTheme();
  requestAnimationFrame(applyLogo);

  logo.addEventListener('mouseenter', () => {
    hovering = true;
    applyLogo();
  });

  logo.addEventListener('mouseleave', () => {
    hovering = false;
    applyLogo();
  });

  const obs = new MutationObserver(() => {
    preloadCurrentTheme();
    applyLogo();
  });
  obs.observe(root, { attributes: true, attributeFilter: ['data-theme', 'class'] });
}
