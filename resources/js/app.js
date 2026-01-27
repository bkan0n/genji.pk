import './bootstrap';
import '../css/app.css';
import '../css/custom.css';
import './utils/layout';
import './utils/prism';
import './modals/notifications-settings';
import './modals/profile';
import './modals/credits';
import './modals/rules';
import './components/notifications-tray';

import * as Sentry from '@sentry/browser';

// ———————————————————————————————————————————————————————————————
// Sentry
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

// ———————————————————————————————————————————————————————————————
// Theme
(function patchDOMTokenListMultiClass() {
  if (typeof window === 'undefined') return;
  const proto = window.DOMTokenList && window.DOMTokenList.prototype;
  if (!proto) return;
  if (proto.__gpMultiClassPatched) return;
  Object.defineProperty(proto, '__gpMultiClassPatched', { value: true });

  const splitTokens = (t) =>
    String(t ?? '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  const _add = proto.add;
  const _remove = proto.remove;
  const _toggle = proto.toggle;

  proto.add = function (...tokens) {
    const flat = [];
    for (const t of tokens) flat.push(...splitTokens(t));
    return _add.apply(this, flat);
  };

  proto.remove = function (...tokens) {
    const flat = [];
    for (const t of tokens) flat.push(...splitTokens(t));
    return _remove.apply(this, flat);
  };

  proto.toggle = function (token, force) {
    const parts = splitTokens(token);
    if (parts.length <= 1) {
      return force === undefined ? _toggle.call(this, token) : _toggle.call(this, token, force);
    }
    let res;
    for (const p of parts) {
      res = force === undefined ? _toggle.call(this, p) : _toggle.call(this, p, force);
    }
    return res;
  };
})();

// ———————————————————————————————————————————————————————————————
// CSRF
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