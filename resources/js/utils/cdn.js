const CDN_URL = (document.querySelector('meta[name="cdn-url"]')?.content || '').replace(/\/+$/, '');

function getCdnBaseUrl() {
  try { return CDN_URL ? new URL(CDN_URL) : null; } catch { return null; }
}

function isSameCdnHost(absUrl) {
  const base = getCdnBaseUrl();
  if (!base) return false;
  try {
    const u = new URL(absUrl);
    return u.host === base.host;
  } catch {
    return false;
  }
}

export function cdnAsset(path) {
  let p = String(path || '').trim();
  if (!p) return p;

  if (/^(data:|blob:)/i.test(p)) return p;

  if (p.startsWith('//')) p = 'https:' + p;
  if (/^https?:\/\//i.test(p)) return p;

  const clean = p.replace(/^\/+/, '');
  return CDN_URL ? `${CDN_URL}/${clean}` : `/${clean}`;
}

export function cdnImage(src, opts = {}) {
  if (!src) return src;

  let s = String(src).trim();
  if (!s) return s;

  if (/^(data:|blob:)/i.test(s)) return s;
  if (s.includes('/cdn-cgi/image/')) return s;

  const params = Object.entries({
    width: opts.width,
    height: opts.height,
    quality: opts.quality ?? 75,
    format: opts.format ?? 'auto',
    fit: opts.fit,
    dpr: opts.dpr,
  })
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join(',');

  if (!params) return s;

  const base = (CDN_URL || '').replace(/\/+$/, '');

  if (s.startsWith('//')) s = 'https:' + s;

  const isAbsolute = /^https?:\/\//i.test(s);

  if (isAbsolute && !isSameCdnHost(s) && opts.allowRemote !== true) {
    return s;
  }

  let source;
  if (isAbsolute && isSameCdnHost(s)) {
    const u = new URL(s);
    source = encodeURI((u.pathname + u.search).replace(/^\/+/, ''));
  } else if (isAbsolute) {
    source = encodeURI(s);
  } else {
    source = encodeURI(s.replace(/^\/+/, ''));
  }

  return base
    ? `${base}/cdn-cgi/image/${params}/${source}`
    : `/cdn-cgi/image/${params}/${source}`;
}
