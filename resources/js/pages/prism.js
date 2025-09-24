import { createPrism } from '../components/prism';

document.addEventListener('DOMContentLoaded', () => {
  const host = document.getElementById('prism');
  if (!host) return;

  const prism = createPrism(host, {
    animationType: '3drotate',
    timeScale: 0.1,
    height: 3.5,
    baseWidth: 4.5,
    scale: 4,
    hueShift: 1.56,
    colorFrequency: 2.15,
    noise: 0,
    glow: 0.4,
    suspendWhenOffscreen: true
  });

});