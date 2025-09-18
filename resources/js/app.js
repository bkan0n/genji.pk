import './bootstrap';
import '../css/app.css';
import '../css/custom.css';
import './modals/layout';
import './modals/notifications';
import './modals/profile';
import './modals/credits';

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
