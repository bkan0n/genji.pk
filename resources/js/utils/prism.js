import { createPrism } from '../components/prism';

export function bootPrism() {
  const host = document.getElementById('prism');
  if (!host) return;

  const isMobile = /Mobi|Android|iPad|iPhone|iPod/i.test(navigator.userAgent);

  const isDark = () => {
    const el = document.documentElement;
    const dt = (el.getAttribute('data-theme') || '').toLowerCase();
    return dt === 'dark' || el.classList.contains('dark');
  };

  const base = {
    animationType: '3drotate',
    timeScale: isMobile ? 0.08 : 0.1,
    height: 3.5,
    baseWidth: 4.5,
    scale: isMobile ? 3.2 : 4,
    noise: 0,
    suspendWhenOffscreen: false,
    quality: isMobile ? 'low' : 'auto',
  };

  const themeOpts = () =>
    isDark()
      ? {
          hueShift: 1.56,
          colorFrequency: 2.15,
          glow: 0.35,
          bg: [0.08, 0.08, 0.09],
        }
      : {
          hueShift: 1.74,
          colorFrequency: 2.85,
          glow: 0.48,
          bg: [0.90, 0.905, 0.915],
      };

  const opts = { ...base, ...themeOpts() };

  if (!host.__prismInstance) {
    host.__prismInstance = createPrism(host, opts);
    document.documentElement.classList.remove('prism-preload');
    document.documentElement.classList.add('prism-ready');
  } else {
    host.__prismInstance.update(opts);
    document.documentElement.classList.remove('prism-preload');
    document.documentElement.classList.add('prism-ready');
  }

  if (!host.__prismThemeObs) {
    let last = isDark();
    const obs = new MutationObserver(() => {
      const now = isDark();
      if (now === last) return;
      last = now;
      host.__prismInstance?.update(themeOpts());
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    host.__prismThemeObs = obs;
  }
}

function bootPrismASAP(){
  const host = document.getElementById('prism');
  if (!host) return false;
  bootPrism();
  return true;
}

if (!bootPrismASAP()) {
  const t = setInterval(() => {
    if (bootPrismASAP()) clearInterval(t);
  }, 16);
}
