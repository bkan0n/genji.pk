import { createPrism } from '../components/prism';

export function bootPrism() {
  const host = document.getElementById('prism');
  if (!host) return;

  const isMobile = /Mobi|Android|iPad|iPhone|iPod/i.test(navigator.userAgent);
  const opts = {
    animationType: '3drotate',
    timeScale: isMobile ? 0.08 : 0.1,
    height: 3.5,
    baseWidth: 4.5,
    scale: isMobile ? 3.2 : 4,
    hueShift: 1.56,
    colorFrequency: 2.15,
    noise: 0,
    glow: 0.35,
    suspendWhenOffscreen: true,
    quality: isMobile ? 'low' : 'auto',
  };

  createPrism(host, opts);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootPrism, { once: true });
} else {
  bootPrism();
}