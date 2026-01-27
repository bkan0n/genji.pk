const VERSION = 'gp-sw-v1';
const NAV_CACHE = `gp-nav-${VERSION}`;
const ASSET_CACHE = `gp-asset-${VERSION}`;
const SHELL_URL = '/app-shell.html';

const HTML_TTL = 30 * 1000;

const isHtml = (response) => {
  if (!response || !response.ok) return false;
  const ct = response.headers.get('content-type') || '';
  return ct.includes('text/html');
};

const withCacheTime = async (response) => {
  const text = await response.clone().text();
  const headers = new Headers(response.headers);
  headers.set('sw-cache-time', Date.now().toString());
  return new Response(text, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};


self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(NAV_CACHE).then((cache) => cache.add(SHELL_URL)).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => !key.includes(VERSION))
          .map((key) => caches.delete(key))
      );
      if (self.registration.navigationPreload) {
        try { await self.registration.navigationPreload.enable(); } catch (e) {}
      }
      await self.clients.claim();
    })()
  );
});

async function handleNavigate(request, preloadResponse) {
  const cache = await caches.open(NAV_CACHE);
  const cached = await cache.match(request);

  const networkPromise = (async () => {
    try {
      const preload = await preloadResponse;
      const response = preload || (await fetch(request));
      if (isHtml(response)) {
        try {
          const timed = await withCacheTime(response);
          cache.put(request, timed);
        } catch (e) {}
      }
      return response;
    } catch (e) {
      return null;
    }
  })();

  if (cached) {
    networkPromise.catch(() => {});
    return cached;
  }

  const network = await networkPromise;
  if (network) return network;

  const shell = await cache.match(SHELL_URL);
  return shell || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
}

async function cacheFirst(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const accept = request.headers.get('accept') || '';

  if (request.mode === 'navigate' || accept.includes('text/html')) {
    event.respondWith(handleNavigate(request, event.preloadResponse));
    return;
  }

  if (url.origin === self.location.origin) {
    const dest = request.destination;
    if (dest === 'script' || dest === 'style' || dest === 'font' || dest === 'image') {
      event.respondWith(cacheFirst(request));
    }
  }
});
