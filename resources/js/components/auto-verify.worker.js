import { createWorker } from "tesseract.js";

/* =========================
   CONFIG & UTILS
   ========================= */

const ROI_HUD_LEFT = [0.012, 0.020, 0.360, 0.200];
const ROI_HUD_RIGHT = [0.70, 0.30, 0.98, 0.62];
const ROI_DISCORD = [0.10, 0.08, 0.75, 0.52];

const TIME_TOL = 0.05;
const CODE_RE = /(?:MAP\s*CODE|CODE)\s*([A-Z0-9]{4,8})\b/i;
const TIME_RE = /(\d{1,4}(?:[.,]\d{1,3})?)\s*(?:SEC|S|SECONDS?)/gi;

const OCR_CHAR_WHITELIST =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:,/-_ ()[]{}!?'\"`“”‘’•+|\\<>=";

let worker;

async function getTess() {
  if (worker) return worker;
  worker = await createWorker({
    logger: () => {},
  });
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  await worker.setParameters({
    tessedit_char_whitelist: OCR_CHAR_WHITELIST,
    preserve_interword_spaces: "1",
  });
  return worker;
}

async function fetchImageBitmap(url) {
  const r = await fetch(url, { credentials: "same-origin" });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const b = await r.blob();
  return await createImageBitmap(b);
}

function cropBitmapToCanvas(bmp, roi) {
  const [x1, y1, x2, y2] = roi;
  const w = bmp.width;
  const h = bmp.height;
  const sx = Math.max(0, Math.floor(x1 * w));
  const sy = Math.max(0, Math.floor(y1 * h));
  const sw = Math.max(1, Math.floor((x2 - x1) * w));
  const sh = Math.max(1, Math.floor((y2 - y1) * h));

  const c = new OffscreenCanvas(sw, sh);
  const ctx = c.getContext("2d");
  ctx.drawImage(bmp, sx, sy, sw, sh, 0, 0, sw, sh);
  return c;
}

function preprocessBW(canvas) {
  const w = canvas.width;
  const h = canvas.height;
  const out = new OffscreenCanvas(w, h);
  const ctx = out.getContext("2d");
  ctx.drawImage(canvas, 0, 0);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;

  for (let i = 0; i < d.length; i += 4) {
    const y = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
    let g = Math.pow(y / 255, 0.9) * 255; // léger boost
    const bw = g > 150 ? 255 : g < 90 ? 0 : g;
    d[i] = d[i + 1] = d[i + 2] = bw;
  }
  ctx.putImageData(img, 0, 0);
  return out;
}

async function ocrCanvas(canvas) {
  const t = await getTess();
  const blob = await canvas.convertToBlob({ type: "image/png" });
  const url = URL.createObjectURL(blob);
  try {
    const { data } = await t.recognize(url);
    return (data?.text || "").replace(/\s+/g, " ").trim();
  } finally {
    URL.revokeObjectURL(url);
  }
}

function extractCode(text) {
  const m = CODE_RE.exec(text);
  return m ? m[1].toUpperCase() : null;
}
function extractTimes(text) {
  const vals = [];
  let m;
  while ((m = TIME_RE.exec(text))) {
    const f = parseFloat(String(m[1]).replace(",", "."));
    if (Number.isFinite(f)) vals.push(f);
  }
  return Array.from(new Set(vals)).sort((a, b) => a - b);
}
function compareTime(target, candidates, tol) {
  const p = Number(target);
  if (!Number.isFinite(p)) return { ok: false, bestDiff: null };
  let bestDiff = null;
  for (const c of candidates) {
    const d = Math.abs(c - p);
    if (bestDiff == null || d < bestDiff) bestDiff = d;
    if (d <= tol) return { ok: true, bestDiff: d };
  }
  return { ok: false, bestDiff };
}

/* =========================
   Handler
   ========================= */

self.onmessage = async (ev) => {
  const { op, id, payload } = ev.data || {};
  if (op !== "VERIFY") return;

  try {
    const { screenshotUrl, code, time } = payload;
    if (!screenshotUrl) throw new Error("Missing screenshotUrl");

    const bmp = await fetchImageBitmap(screenshotUrl);

    const rois = [ROI_HUD_LEFT, ROI_HUD_RIGHT, ROI_DISCORD].map((r) =>
      preprocessBW(cropBitmapToCanvas(bmp, r))
    );

    const texts = [];
    for (const c of rois) texts.push(await ocrCanvas(c));

    const full = new OffscreenCanvas(bmp.width, bmp.height);
    full.getContext("2d").drawImage(bmp, 0, 0);
    texts.push(await ocrCanvas(preprocessBW(full)));

    const merged = texts.join(" ");
    let extractedCode = extractCode(merged);
    const times = extractTimes(merged);

    if (!extractedCode) {
      const near = merged.match(/(?:MAP\s*CODE|CODE)\s*([A-Z0-9]{4,8})/i);
      if (near && near[1]) extractedCode = near[1].toUpperCase();
    }

    const reasons = [];
    let okCode = false;
    if (extractedCode) {
      okCode = extractedCode.toUpperCase() === String(code || "").toUpperCase();
      if (!okCode) reasons.push(`Code différent (extrait ${extractedCode}, attendu ${code})`);
    } else {
      reasons.push("Code non trouvé dans le screenshot");
    }

    const { ok: okTime, bestDiff } = compareTime(time, times, TIME_TOL);
    if (!okTime) {
      reasons.push(
        times.length
          ? `Temps différent (extraits ${times.join(", ")}, attendu ${time}, Δmin=${bestDiff?.toFixed(3)}s)`
          : "Temps non trouvé dans le screenshot"
      );
    }

    self.postMessage({
      op: "RESULT",
      id,
      result: {
        verified: okCode && okTime,
        extracted: {
          code: extractedCode,
          times,
          texts: { hudLeft: texts[0], hudRight: texts[1], discord: texts[2], full: texts[3] },
        },
        reasons,
      },
    });
  } catch (err) {
    self.postMessage({
      op: "RESULT",
      id,
      error: String(err?.message || err || "Unknown error"),
    });
  }
};
