const OCR_ENDPOINT = `/api/ocr/extract`;

function stripDataUrl(b64) {
  return typeof b64 === 'string' && b64.startsWith('data:')
    ? b64.split(',')[1] || ''
    : b64;
}

self.onmessage = async (ev) => {
  try {
    const { blob, screenshotUrl } = ev.data || {};
    const srcBlob = blob || (screenshotUrl ? await fetchAsBlob(screenshotUrl) : null);
    if (!srcBlob) return postMessage({ ok: false, error: 'No image provided' });

    const imgBlob = await compress(srcBlob, 1920, 0.85).catch(() => srcBlob);
    const b64Full = await blobToBase64(imgBlob);
    const b64 = stripDataUrl(b64Full);

    const res = await fetch(OCR_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ image_b64: b64 })
    });

    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (!ct.includes('application/json')) {
      const txt = await res.text().catch(() => '');
      let hint = '';
      if (res.status === 404) hint = ' (Route introuvable: vérifie le chemin ou le préfixe /api).';
      if (res.status === 419) hint = ' (CSRF 419: place la route dans routes/api.php).';
      if (res.status >= 300 && res.status < 400) hint = ` (Redirect ${res.status}: peut-être vers /login).`;
      throw new Error(`OCR endpoint returned ${res.status}; not JSON: ${txt.slice(0,200)}${hint}`);
    }

    const payload = await res.json();
    if (!res.ok) {
      throw new Error(`OCR endpoint HTTP ${res.status}: ${payload?.message || payload?.error || 'Unknown error'}`);
    }

    let { name, time, code, texts } = payload?.extracted || {};
    ({ name, code } = await verifyWithAutocomplete({ name, code }));

    postMessage({ ok: true, extracted: { name, time, code, texts } });
  } catch (err) {
    postMessage({ ok: false, error: String(err) });
  }
};

async function fetchAsBlob(url) {
  const r = await fetch(url, { mode: 'cors', credentials: 'omit', cache: 'no-store' });
  if (!r.ok) throw new Error('Failed to fetch screenshot');
  return await r.blob();
}

async function compress(blob, maxW = 1920, quality = 0.85) {
  if (typeof createImageBitmap !== 'function' || typeof OffscreenCanvas === 'undefined') return blob;
  const bmp = await createImageBitmap(blob);
  const scale = Math.min(1, maxW / bmp.width);
  if (scale >= 1) return blob;
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const c = new OffscreenCanvas(w, h);
  const ctx = c.getContext('2d', { alpha: false });
  ctx.drawImage(bmp, 0, 0, w, h);
  const out = await c.convertToBlob({ type: 'image/jpeg', quality });
  try { bmp.close && bmp.close(); } catch {}
  return out || blob;
}

async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}

// --- Autocomplete
async function verifyWithAutocomplete({ name, code }) {
  const out = { name, code };
  try {
    if (out.name) {
      const r = await fetch(`${API_ROOT}/autocomplete/users?value=` + encodeURIComponent(out.name));
      const s = await r.json();
      const list = (s?.suggestions || []).map(v => String(v).toUpperCase());
      if (!list.includes(String(out.name).toUpperCase())) out.name = null;
    }
  } catch {}
  try {
    if (out.code) {
      const r = await fetch(`${API_ROOT}/autocomplete/map-codes?search=` + encodeURIComponent(out.code));
      const s = await r.json();
      const list = (s?.suggestions || []).map(v => String(v).toUpperCase());
      if (!list.includes(String(out.code).toUpperCase())) out.code = null;
    }
  } catch {}
  return out;
}
