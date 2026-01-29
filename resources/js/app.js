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
  if (typeof window === 'undefined' || typeof window.fetch !== 'function') return;

  const baseFetch = window.fetch.bind(window);

  const readCookie = (name) => {
    try {
      const safe = String(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + safe + '=([^;]*)'));
      return match ? match[1] : '';
    } catch {
      return '';
    }
  };

  const decodeCookie = (value) => {
    if (!value) return '';
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };

  const getSessionCookieName = () =>
    (window.SESSION_COOKIE_NAME || '').toString().trim() || 'laravel_session';

  const getMetaToken = () =>
    document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

  const getXsrfCookieToken = () => decodeCookie(readCookie('XSRF-TOKEN'));

  const getCsrfToken = () => window.CSRF || getMetaToken() || getXsrfCookieToken();

  const setCsrfToken = (token) => {
    if (!token) return;
    if (typeof window.__setCsrfToken === 'function') {
      window.__setCsrfToken(token);
    } else {
      window.CSRF = token;
      const meta = document.querySelector('meta[name="csrf-token"]');
      if (meta) meta.setAttribute('content', token);
      document.querySelectorAll('input[name="_token"]').forEach((el) => {
        el.value = token;
      });
    }
    if (window.axios?.defaults?.headers?.common) {
      window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }
  };

  const hasSessionCookie = () => Boolean(readCookie(getSessionCookieName()));

  window.getCsrfToken = getCsrfToken;
  window.__hasSessionCookie = hasSessionCookie;

  const syncTokenFromCookie = () => {
    const cookieToken = getXsrfCookieToken();
    if (!cookieToken) return;
    if (!window.CSRF && !getMetaToken()) {
      setCsrfToken(cookieToken);
    }
  };

  let refreshPromise = null;
  const refreshCsrfToken = async () => {
    if (refreshPromise) return refreshPromise;
    refreshPromise = (async () => {
      try {
        const res = await baseFetch('/csrf-token', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          credentials: 'same-origin',
          cache: 'no-store',
        });

        const data = await res.json().catch(() => null);
        const nextToken = data && typeof data === 'object' ? data.csrf_token : '';
        if (nextToken) setCsrfToken(nextToken);
        return nextToken || '';
      } catch {
        return '';
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };

  window.__refreshCsrfToken = refreshCsrfToken;

  const ensureFreshCsrf = async () => {
    syncTokenFromCookie();
    if (!hasSessionCookie()) {
      await refreshCsrfToken();
    }
  };

  const shouldHandle = (method) => !['GET', 'HEAD', 'OPTIONS'].includes(method);

  const isSameOrigin = (url) => {
    try {
      return new URL(url, window.location.href).origin === window.location.origin;
    } catch {
      return true;
    }
  };

  const applyCsrfHeaders = (req, sameOrigin, allowUnsafe) => {
    const headers = new Headers(req.headers || {});

    if (sameOrigin && !headers.has('X-Requested-With')) {
      headers.set('X-Requested-With', 'XMLHttpRequest');
    }

    if (allowUnsafe) {
      const token = getCsrfToken();
      if (token) {
        headers.set('X-CSRF-TOKEN', token);
      }

      const xsrf = getXsrfCookieToken();
      if (xsrf) {
        headers.set('X-XSRF-TOKEN', xsrf);
      }
    }

    return new Request(req, {
      headers,
      credentials: req.credentials,
    });
  };

  const sendWithRetry = async (baseReq, sameOrigin, allowUnsafe, allowRetry) => {
    const request = applyCsrfHeaders(baseReq, sameOrigin, allowUnsafe);
    const response = await baseFetch(request);

    if (!allowRetry || !allowUnsafe || response.status !== 419) {
      return response;
    }

    await refreshCsrfToken();

    try {
      const retryReq = baseReq.clone();
      return await baseFetch(applyCsrfHeaders(retryReq, sameOrigin, allowUnsafe));
    } catch {
      return response;
    }
  };

  window.fetch = async (input, init = {}) => {
    let baseReq = null;
    try {
      baseReq = new Request(input, init);
    } catch {
      return baseFetch(input, init);
    }
    const method = String(baseReq.method || 'GET').toUpperCase();
    const sameOrigin = isSameOrigin(baseReq.url);
    const allowUnsafe = sameOrigin && shouldHandle(method);

    if (allowUnsafe) {
      await ensureFreshCsrf();
    } else {
      syncTokenFromCookie();
    }

    return sendWithRetry(baseReq, sameOrigin, allowUnsafe, true);
  };

  const maybeRefreshOnVisibility = () => {
    if (document.visibilityState === 'visible') {
      void ensureFreshCsrf();
    }
  };

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) void ensureFreshCsrf();
  });

  document.addEventListener('visibilitychange', maybeRefreshOnVisibility);
  window.addEventListener('focus', () => void ensureFreshCsrf());
  document.addEventListener('DOMContentLoaded', () => void ensureFreshCsrf());

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (event.defaultPrevented) return;

    const method = (form.getAttribute('method') || 'GET').toUpperCase();
    if (!shouldHandle(method)) return;

    if (hasSessionCookie()) {
      syncTokenFromCookie();
      return;
    }

    event.preventDefault();
    ensureFreshCsrf()
      .then(() => form.submit())
      .catch(() => form.submit());
  });

  void ensureFreshCsrf();
})();
