import './bootstrap';
import '../css/app.css';
import '../css/custom.css';
import './modals/layout';
import './modals/notifications-settings';
import './modals/profile';
import './modals/credits';
import './modals/rules';
import './components/notifications-tray';

import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV ?? 'local',
  release: import.meta.env.VITE_APP_RELEASE ?? undefined,

  tunnel: '/api/_/e',

  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],

  tracesSampleRate: 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  sendClientReports: false,
  debug: false,

  tracePropagationTargets: [window.location.origin],

  ignoreErrors: [/chrome(-extension)?:\/\//i, /ResizeObserver loop limit exceeded/i],
  denyUrls: [/extensions\//i, /^chrome:\/\//i],
});

window.Sentry = Sentry;

(function () {
  if (!document.getElementById('prism')) return;

  const loadPrism = () => import(/* @vite-ignore */ '/resources/js/pages/prism.js').catch(()=>{});
  if ('requestIdleCallback' in window) requestIdleCallback(loadPrism, { timeout: 50 });
  ['pointerdown','keydown','scroll'].forEach(evt => {
    window.addEventListener(evt, function onFirst() {
      window.removeEventListener(evt, onFirst, { passive: true });
      loadPrism();
    }, { once: true, passive: true });
  });
})();

(function patchFetchForCsrf() {
  if (!CSRF || typeof window.fetch !== 'function') return;

  const __origFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    const method = String(init.method || 'GET').toUpperCase();

    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      const headers = new Headers(init.headers || {});
      if (!headers.has('X-CSRF-TOKEN')) headers.set('X-CSRF-TOKEN', CSRF);
      if (!headers.has('X-Requested-With')) headers.set('X-Requested-With', 'XMLHttpRequest');
      if (!init.credentials) init.credentials = 'same-origin';
      init = { ...init, headers };
    }

    return __origFetch(input, init);
  };
})();