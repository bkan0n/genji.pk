// ———————————————————————————————————————————————————————————————
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
const dropdowns = [
  { btnId: 'searchBtn', menuId: 'searchMenu' },
  { btnId: 'communityBtn', menuId: 'communityMenu' },
  { btnId: 'submitBtn', menuId: 'submitMenu' },
  { btnId: 'langBtn', menuId: 'langMenu' },
  { btnId: 'avatarBtn', menuId: 'avatarMenu' },
];
dropdowns.forEach(({ btnId, menuId }) => {
  const btn = document.getElementById(btnId);
  const menu = document.getElementById(menuId);
  if (!btn || !menu) return;
  const open = () => {
    btn.setAttribute('aria-expanded', 'true');
    menu.classList.remove('invisible', 'opacity-0', 'translate-y-1');
  };
  const close = () => {
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.add('invisible', 'opacity-0', 'translate-y-1');
  };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    dropdowns.forEach(({ btnId: b2, menuId: m2 }) => {
      const b = document.getElementById(b2),
        m = document.getElementById(m2);
      if (m2 !== menuId && b && m) {
        b.setAttribute('aria-expanded', 'false');
        m.classList.add('invisible', 'opacity-0', 'translate-y-1');
      }
    });
    expanded ? close() : open();
  });
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
});

// ———————————————————————————————————————————————————————————————
// Theme
const toggle = document.getElementById('themeToggle');
const sun = document.getElementById('iconSun');
const moon = document.getElementById('iconMoon');
const root = document.documentElement;
function updateThemeIcon() {
  if (root.classList.contains('dark')) {
    sun?.classList.remove('hidden');
    moon?.classList.add('hidden');
  } else {
    sun?.classList.add('hidden');
    moon?.classList.remove('hidden');
  }
}
if (localStorage.getItem('theme') === 'light') root.classList.remove('dark');
else root.classList.add('dark');
updateThemeIcon();
toggle?.addEventListener('click', () => {
  root.classList.toggle('dark');
  localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
  updateThemeIcon();
});

// ———————————————————————————————————————————————————————————————
// Logo hover
const logo = document.getElementById('brandLogo');
const staticLogo = 'assets/img/favicon-high.png';
const animLogo = 'assets/img/favicon-anim.gif';
logo?.addEventListener('mouseenter', () => {
  logo.src = animLogo;
});
logo?.addEventListener('mouseleave', () => {
  logo.src = staticLogo;
});
