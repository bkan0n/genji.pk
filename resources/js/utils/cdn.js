const CDN_URL = (document.querySelector('meta[name="cdn-url"]')?.content || '').replace(/\/+$/, '');

export function cdnAsset(path) {
  const clean = String(path || '').replace(/^\/+/, '');
  return CDN_URL ? `${CDN_URL}/${clean}` : `/${clean}`;
}

export function cdnImage(src, opts = {}) {
  if (!src) return src;

  const s = String(src);

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

  const base = CDN_URL || '';

  const isAbsolute = /^https?:\/\//i.test(s);
  const source = isAbsolute ? s : encodeURI(s.replace(/^\/+/, ''));

  return base
    ? `${base}/cdn-cgi/image/${params}/${source}`
    : `/cdn-cgi/image/${params}/${source}`;
}