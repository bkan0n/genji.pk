import { $, $$ } from './workspace-shell.js';
import AutoVerifyWorkerUrl from '../../components/auto-verify.worker.js?worker&url';

let DEPS = null;
const ROOT = () => $('[data-verifications-workspace]');

// Loaded-once caches; Refresh forces a reload.
const loaded = { completions: false, edits: false };

// Signed-in moderator id (used as verified_by / resolved_by).
const MOD_USER_ID = (
  document.getElementById('modUserId')?.value ??
  document.querySelector('meta[name="mod-user-id"]')?.content ??
  (typeof window !== 'undefined' && window.user_id != null ? String(window.user_id) : '')
).trim();

// Dev gate (unchanged from the old inline code).
const CALIB_ALLOWED_USER_ID = '681391478605479948';
const AUTO_VERIFY_ALLOWED_USER_ID = '681391478605479948';
const AUTO_VERIFY_USER_ID = '1120786151452717106';

const API_MODS = '/api/mods';

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// Toggle loading/error/empty/loaded within a single queue container.
function setQueueView(queueEl, view) {
  if (!queueEl) return;
  for (const name of ['loading', 'error', 'empty', 'loaded']) {
    const el = $(`[data-view="${name}"]`, queueEl);
    if (el) el.classList.toggle('hidden', name !== view);
  }
}

// --- presentation helpers (moved verbatim from moderator.js:7558-7601) ---
function kvRow(label, value, { rawHtml = false } = {}) {
  const shown = rawHtml ? value : decorateValue(label, value);
  return `
    <div class="grid grid-cols-3 gap-2 text-sm">
      <div class="col-span-1 text-zinc-600 dark:text-zinc-400">${escapeHtml(label)}</div>
      <div class="col-span-2 break-all">${shown}</div>
    </div>`;
}
function decorateValue(label, v) {
  if (v == null || v === '') return '—';
  if (typeof v === 'string' && /^https?:\/\//i.test(v)) return linkOrDash(v);
  const s = String(v);
  if (/_id$/.test(label) || /^\d{8,}$/.test(s)) return monoChip(s);
  return stringChip(s);
}
function monoChip(text) {
  return `<span class="inline-block rounded-md bg-zinc-900/5 px-1.5 py-0.5 font-mono text-[12px] tracking-tight ring-1 ring-zinc-300/60 dark:bg-black/30 dark:ring-white/10">${escapeHtml(String(text))}</span>`;
}
function stringChip(text) {
  return `<span class="inline-block rounded-md bg-zinc-900/3 dark:bg-white/5 px-2 py-0.5 text-[13px] font-medium text-zinc-900 dark:text-zinc-100 ring-1 ring-zinc-300/60 dark:ring-white/10">${escapeHtml(String(text))}</span>`;
}
function linkOrDash(url) {
  if (!url) return '—';
  const u = String(url);
  return `<a href="${escapeHtml(u)}" target="_blank" class="underline decoration-dotted hover:opacity-80">${escapeHtml(u)}</a>`;
}
function boolChip(v) {
  const yes = !!v;
  return `
    <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
      yes ? 'bg-emerald-500/10 text-emerald-700 ring-emerald-400/20 dark:text-emerald-300' : 'bg-rose-500/10 text-rose-700 ring-rose-400/20 dark:text-rose-300'
    }">
      <span class="h-1.5 w-1.5 rounded-full ${yes ? 'bg-emerald-400' : 'bg-rose-400'}"></span>
      ${yes ? 'true' : 'false'}
    </span>`;
}
function parseSec(v) {
  if (v == null) return null;
  const n = Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export function initVerificationsWorkspace(deps) {
  DEPS = deps;
  const root = ROOT();
  if (!root) return;
  wireSubtabLoading(root);
  wireRefreshButtons(root);
  wireLightbox(root);
  wireCompletionActions(root);
  wireEditActions(root);
}

function wireSubtabLoading(root) {
  root.addEventListener('click', (e) => {
    const tab = e.target.closest('.mod-subtab');
    if (!tab) return;
    const name = tab.dataset.subtab;
    if (name === 'verif-pending') loadCompletions(root, { force: false });
    if (name === 'verif-edits') loadEdits(root, { force: false });
  });
}

function wireRefreshButtons(root) {
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-verif-refresh]');
    if (!btn) return;
    e.preventDefault();
    if (btn.dataset.verifRefresh === 'completions') loadCompletions(root, { force: true });
    if (btn.dataset.verifRefresh === 'edits') loadEdits(root, { force: true });
  });
}

function setCount(root, which, n) {
  const badge = $(`[data-verif-count="${which}"]`, root);
  if (!badge) return;
  badge.textContent = String(n);
  badge.classList.toggle('hidden', !n);
}

async function loadCompletions(root, { force }) {
  if (loaded.completions && !force) return;
  const queueEl = $('[data-verif-queue="completions"]', root);
  const listEl = $('[data-verif-completion-list]', root);
  setQueueView(queueEl, 'loading');

  let res;
  try {
    res = await DEPS.http('GET', `${API_MODS}/verifications/pending`);
  } catch {
    return showQueueError(queueEl, 'Network error — try again.');
  }
  const { ok, status, url, data } = res;
  DEPS.logActivity({ title: 'Pending verifications', method: 'GET', url, ok, status, data });
  if (!ok) return showQueueError(queueEl, `Failed to load queue (${status}).`);

  const rows = (Array.isArray(data) ? data : []).filter((r) => String(r?.id ?? '').trim());
  loaded.completions = true;
  if (!rows.length) {
    setCount(root, 'completions', 0);
    return setQueueView(queueEl, 'empty');
  }

  const progress = $('[data-verif-progress]', queueEl);
  let done = 0;
  const submissions = await mapLimit(rows, 4, async (row) => {
    const rid = String(row.id).trim();
    let sub;
    try {
      sub = await DEPS.http('GET', `${API_MODS}/completions/${encodeURIComponent(rid)}/submission`);
    } catch {
      // A single submission failing must not reject the whole load (which would
      // strand the queue on the loading view); drop this row instead.
      done += 1;
      if (progress) progress.textContent = `Loading ${done}/${rows.length}…`;
      return null;
    }
    DEPS.logActivity({ title: `Submission ${rid}`, method: 'GET', url: sub.url, ok: sub.ok, status: sub.status, data: sub.data });
    done += 1;
    if (progress) progress.textContent = `Loading ${done}/${rows.length}…`;
    return sub.ok && sub.data && typeof sub.data === 'object' ? sub.data : null;
  });

  const cards = submissions.filter(Boolean).map(renderCompletionCard);
  listEl.innerHTML = '';
  cards.forEach((c) => listEl.appendChild(c));
  setCount(root, 'completions', cards.length);
  setQueueView(queueEl, cards.length ? 'loaded' : 'empty');
}

function showQueueError(queueEl, message) {
  const box = $('[data-view="error"]', queueEl);
  if (box) box.textContent = message;
  setQueueView(queueEl, 'error');
  DEPS.toast('Load failed', 'err');
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

function renderCompletionCard(item) {
  const rid = String(item?.id ?? '');
  const verId = item?.verification_id == null ? '' : String(item.verification_id);
  const shot = item?.screenshot ? String(item.screenshot) : '';
  const meId = (typeof window.user_id !== 'undefined' && window.user_id) ? String(window.user_id) : '';
  const canCalibrate = meId === CALIB_ALLOWED_USER_ID;
  const canAutoVerify = meId === AUTO_VERIFY_ALLOWED_USER_ID;
  const suspicious = !!item?.suspicious;
  const earns = [item?.hypothetical_rank != null ? `#${escapeHtml(String(item.hypothetical_rank))}` : null,
                 item?.hypothetical_medal ? escapeHtml(String(item.hypothetical_medal)) : null]
                 .filter(Boolean).join(' · ') || '—';

  const wrap = document.createElement('article');
  wrap.className = 'rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 p-4 ring-1 ring-zinc-900/5 dark:ring-white/5';
  wrap.dataset.recordId = rid;
  wrap.dataset.verificationId = verId;
  wrap.dataset.screenshot = shot;
  wrap.dataset.time = item?.time == null ? '' : String(item.time);
  wrap.dataset.code = item?.code == null ? '' : String(item.code);
  wrap.dataset.name = item?.name ? String(item.name) : '';

  const imgHtml = shot
    ? `<button type="button" data-enlarge="${escapeHtml(shot)}"
         class="relative cursor-pointer group block w-full overflow-hidden rounded-xl border border-zinc-200/80 dark:border-white/10 bg-black/20">
         <img src="${escapeHtml(shot)}" alt="screenshot" class="w-full object-contain max-h-[420px] transition-transform duration-200 group-hover:scale-[1.01]">
       </button>`
    : `<div class="grid h-[280px] w-full place-items-center rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 text-xs text-zinc-500">No screenshot</div>`;

  const calibrateBtn = canCalibrate
    ? `<button type="button" class="btn-calibrate-ocr rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 px-2.5 py-1 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-900/5 dark:hover:bg-white/10">Calibrate OCR</button>` : '';
  const autoVerifyBtn = canAutoVerify
    ? `<button type="button" class="btn-auto-verify rounded-lg border border-emerald-600/40 bg-emerald-600/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600/20">Auto verify</button>` : '';

  wrap.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2 min-w-0">
        <h4 class="truncate font-semibold">${escapeHtml(item?.name || `Submission #${rid}`)}</h4>
        ${item?.difficulty ? stringChip(item.difficulty) : ''}
        ${suspicious ? `<span class="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/30"><span class="h-1.5 w-1.5 rounded-full bg-amber-400"></span>suspicious</span>` : ''}
      </div>
      <span class="text-xs text-zinc-500 dark:text-zinc-400">#${escapeHtml(rid)}</span>
    </div>
    <div class="mt-3 flex flex-col gap-4 md:flex-row">
      <div class="md:flex-1">${imgHtml}</div>
      <div class="md:w-[260px] grid gap-1.5 content-start">
        ${kvRow('time', item?.time)}
        ${kvRow('code', item?.code)}
        ${kvRow('map', item?.map_name)}
        ${kvRow('AKA', item?.also_known_as)}
        ${kvRow('earns', earns, { rawHtml: true })}
        ${kvRow('video', linkOrDash(item?.video), { rawHtml: true })}
      </div>
    </div>
    <details class="mt-3 text-sm">
      <summary class="cursor-pointer text-xs text-zinc-500 dark:text-zinc-400">details</summary>
      <div class="mt-2 grid gap-1.5">
        ${kvRow('user_id', item?.user_id == null ? '—' : String(item.user_id))}
        ${kvRow('message_id', item?.message_id == null ? '—' : String(item.message_id))}
        ${kvRow('inserted_at', item?.inserted_at)}
        ${kvRow('verified_by', item?.verified_by == null ? '—' : String(item.verified_by))}
        ${kvRow('verified', boolChip(item?.verified), { rawHtml: true })}
        ${kvRow('completion', boolChip(item?.completion), { rawHtml: true })}
      </div>
    </details>
    <div class="mt-4 flex flex-wrap items-center justify-end gap-2">
      <div class="mr-auto flex flex-wrap gap-2">${calibrateBtn}${autoVerifyBtn}</div>
      <button type="button" class="btn-verify rounded-lg bg-emerald-500 px-3 py-1.5 font-semibold text-zinc-900 hover:bg-emerald-400">Verify</button>
      <button type="button" class="btn-deny rounded-lg bg-rose-700 px-3 py-1.5 font-semibold text-white hover:bg-rose-800">Deny</button>
    </div>`;
  return wrap;
}

// ——— Lightbox (copied from moderator.js:7603-7641) ———
function openImageLightbox(src) {
  if (!src) return;
  const overlay = document.createElement('div');
  overlay.className =
    'fixed inset-0 z-[400] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4';
  overlay.innerHTML = `
    <div class="relative max-w-[92vw] max-h-[86vh]">
      <img src="${escapeHtml(src)}" alt="screenshot" class="max-w-full cursor-pointer max-h-[86vh] rounded-xl border border-zinc-200/80 dark:border-white/10 shadow-2xl object-contain">
      <div class="absolute -top-3 -right-3 flex gap-2">
        <a href="${escapeHtml(src)}" target="_blank" class="rounded-lg bg-white text-zinc-900 text-xs px-2 py-1 font-semibold hover:bg-zinc-100">Open</a>
        <button class="lb-close cursor-pointer rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 text-zinc-900 dark:text-white text-xs px-2 py-1 hover:bg-zinc-900/5 dark:hover:bg-white/10">Close</button>
      </div>
    </div>
  `;
  const close = () => overlay.remove();
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('.lb-close')) close();
  });
  document.addEventListener('keydown', function onEsc(ev) {
    if (ev.key === 'Escape') {
      close();
      document.removeEventListener('keydown', onEsc);
    }
  });
  DEPS.appendOverlay(overlay);

}

// ——— removeCardFromVerifList (copied from moderator.js:7782-7809) ———
function removeCardFromVerifList(card) {
  if (!card) return;
  const container = card.parentElement;

  const h = card.offsetHeight;
  card.style.height = h + 'px';
  card.style.transition =
    'height 200ms ease, opacity 160ms ease, transform 160ms ease, margin 200ms ease, padding 200ms ease';
  void card.offsetHeight;
  card.style.opacity = '0';
  card.style.transform = 'translateY(-4px)';
  card.style.height = '0px';
  card.style.marginTop = '0px';
  card.style.marginBottom = '0px';
  card.style.paddingTop = '0px';
  card.style.paddingBottom = '0px';

  card.addEventListener(
    'transitionend',
    () => {
      card.remove();
      if (container && !container.querySelector('[data-record-id]')) {
        container.innerHTML = `<div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] p-6 text-sm text-zinc-500 dark:text-zinc-400">Queue's clear ✓ — no pending completions.</div>`;
      }
    },
    { once: true }
  );
}

// ——— showDenyDialog (copied from moderator.js:7848-7901) ———
function showDenyDialog({ title = 'Deny submission' } = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className =
      'fixed inset-0 z-[350] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4';

    overlay.innerHTML = `
      <div class="w-full max-w-md rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl ring-1 ring-zinc-300/60 dark:ring-white/10">
        <div class="flex items-center justify-between px-4 py-3 border-b border-zinc-200/80 dark:border-white/10">
          <h3 class="font-semibold text-sm">${title}</h3>
          <button class="btn-x cursor-pointer px-2 py-1 text-xs rounded-lg border border-zinc-200/80 dark:border-white/10 hover:bg-zinc-900/3 dark:hover:bg-white/10">Close</button>
        </div>
        <div class="p-4 space-y-3">
          <label class="text-sm text-zinc-700 dark:text-zinc-300">Reason <span class="text-zinc-600 dark:text-zinc-500 text-xs">(optional)</span></label>
          <textarea rows="3" class="w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:placeholder:text-zinc-500 shadow-lg ring-1 ring-zinc-300/60 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500/60"></textarea>
          <div class="pt-1 flex justify-end gap-2">
            <button class="btn-cancel cursor-pointer rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 text-zinc-800 dark:text-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-900/5 dark:hover:bg-white/10">Cancel</button>
            <button class="btn-confirm cursor-pointer rounded-lg bg-rose-700 text-white px-3 py-1.5 text-sm font-semibold hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500/40">Deny</button>
          </div>
        </div>
      </div>
    `;

    DEPS.appendOverlay(overlay);

    const textarea = overlay.querySelector('textarea');
    const close = (cancelled) => {
      overlay.remove();
      resolve({ cancelled, reason: cancelled ? null : textarea.value.trim() || null });
    };

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close(true);
    });
    overlay.querySelector('.btn-x')?.addEventListener('click', () => close(true));
    overlay.querySelector('.btn-cancel')?.addEventListener('click', () => close(true));
    overlay.querySelector('.btn-confirm')?.addEventListener('click', () => close(false));
    textarea?.focus();

    const onKey = (ev) => {
      if (ev.key === 'Escape') {
        ev.preventDefault();
        close(true);
        document.removeEventListener('keydown', onKey);
      }
      if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'enter') {
        ev.preventDefault();
        close(false);
        document.removeEventListener('keydown', onKey);
      }
    };
    document.addEventListener('keydown', onKey, { once: true });
  });
}

// ——— Auto-verify worker getter (copied from moderator.js:7651-7657) ———
let _autoVerifyWorker = null;
function getAutoVerifyWorker() {
  if (_autoVerifyWorker) return _autoVerifyWorker;
  _autoVerifyWorker = new Worker(AutoVerifyWorkerUrl, { type: "module" });
  try { pushRoisToWorker(_autoVerifyWorker); } catch {}
  return _autoVerifyWorker;
}

// ——— autoVerifyCard (copied from moderator.js:8104-8194) ———
async function autoVerifyCard(card) {
  const record_id  = card?.dataset?.recordId;
  const code       = (card?.dataset?.code || "").toString();
  const time       = parseSec(card?.dataset?.time);
  const screenshot = (card?.dataset?.screenshot || "").toString();
  const mapName    = (card?.dataset?.name || "").toString();

  if (!record_id)   return DEPS.toast("Missing record_id", "warn");
  if (!screenshot)  return DEPS.toast("No screenshot to verify", "warn");
  if (!code || time == null) return DEPS.toast("Missing code/time on card", "warn");

  const btn = card.querySelector(".btn-auto-verify");
  const original = btn?.textContent;
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Auto verifying…";
    btn.classList.add("opacity-70", "cursor-wait");
  }

  const w = getAutoVerifyWorker();
  pushRoisToWorker(w);

  const jobId = `${record_id}:${Date.now()}`;
  const payloadRaw = {
    screenshotUrl: screenshot,
    code,
    time: Number.isFinite(time) ? Number(time) : null,
    mapName,
    apiBase: (window.API_ROOT || window.X_API_ROOT || location.origin),
    debug: true
  };

  let msg = { op: "VERIFY", id: jobId, payload: payloadRaw };
  try { msg = structuredClone(msg); } catch { msg = JSON.parse(JSON.stringify(msg)); }

  const result = await new Promise((resolve) => {
    const onMsg = (e) => {
      const { op, id, result, error } = e.data || {};
      if (op !== "RESULT" || id !== jobId) return;
      w.removeEventListener("message", onMsg);
      resolve({ result, error });
    };
    w.addEventListener("message", onMsg);
    w.postMessage(msg);
  });

  if (btn) {
    btn.disabled = false;
    btn.textContent = original || "Auto verify";
    btn.classList.remove("opacity-70", "cursor-wait");
  }

  if (result.error) {
    DEPS.logActivity({
      title: `Auto verify OCR (error) #${record_id}`,
      method: "WORKER",
      url: "auto-verify.worker",
      ok: false,
      status: "-",
      data: { error: result.error },
    });
    DEPS.toast("Auto verify failed (load/OCR error)", "err");
    return;
  }

  const { verified, extracted, reasons } = result.result || {};
  DEPS.logActivity({
    title: `Auto verify OCR #${record_id}`,
    method: "WORKER",
    url: "auto-verify.worker",
    ok: !!verified,
    status: verified ? "OK" : "NOK",
    data: { extracted, reasons },
  });

  if (!verified) {
    DEPS.toast("Auto verify: mismatch", "warn");
    return;
  }

  const body = { verified: true, verified_by: AUTO_VERIFY_USER_ID, reason: "auto verify matched code & time" };
  const { ok, status, url, data } = await DEPS.http(
    "PUT",
    `${API_MODS}/completions/${encodeURIComponent(record_id)}/verification`,
    { body }
  );

  DEPS.logActivity({ title: "Verify completion (auto)", method: "PUT", url, ok, status, data });
  if (ok) {
    DEPS.toast("Verified (auto)", "ok");
    removeCardFromVerifList(card);
    setCount(ROOT(), 'completions', Math.max(0, $$('[data-record-id]', $('[data-verif-completion-list]', ROOT())).length - 1));
  }
  else { DEPS.toast("Auto verify: API failed", "err"); }
}

// ——— ROI storage + editor (copied from moderator.js:8199-8373) ———
const ROI_LS_KEY = "gp_ocr_rois";

const DEFAULT_ROIS = {
  TOPLEFT:    [0.010, 0.020, 0.360, 0.300],
  BANNER:     [0.24, 0.083, 0.760, 0.557],
  TOPRIGHT:   [0.821, 0.077, 0.985, 0.664],
  BOTTOMLEFT: [0.050, 0.825, 0.330, 0.990],
};

function loadRois() {
  try { return { ...DEFAULT_ROIS, ...(JSON.parse(localStorage.getItem(ROI_LS_KEY)) || {}) }; }
  catch { return { ...DEFAULT_ROIS }; }
}
function saveRois(r) { localStorage.setItem(ROI_LS_KEY, JSON.stringify(r)); }
function pushRoisToWorker(worker, rois = loadRois()) {
  worker.postMessage({ op: "SET_ROIS", rois });
}

async function openRoiEditor(imageUrl) {
  return new Promise(async (resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-[500] bg-black/70 backdrop-blur-sm p-6 flex items-center justify-center";
    overlay.innerHTML = `
      <div class="relative w-[96vw] max-w-[96vw] max-h-[92vh] bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-xl shadow-2xl p-4">
        <div class="text-sm text-zinc-700 dark:text-zinc-300 pb-2 flex items-center justify-between gap-4">
          <b>ROI Calibrator</b>
          <div class="space-x-2">
            <button id="roiReset"  class="px-2 py-1 rounded bg-zinc-900/5 dark:bg-white/10">Reset</button>
            <button id="roiCancel" class="px-2 py-1 rounded bg-zinc-900/5 dark:bg-white/10">Cancel</button>
            <button id="roiSave"   class="px-3 py-1 rounded bg-emerald-500 text-zinc-900">Save</button>
          </div>
        </div>
        <div class="relative w-[96vw] max-w-[96vw] h-[84vh] max-h-[84vh] overflow-hidden" data-roi-viewport>
          <div id="roiStage" class="relative inline-block"></div>
        </div>
        <div class="pt-3 text-[11px] text-zinc-600 dark:text-zinc-400">Tip: drag to move, grab a side/corner to resize. Values are saved normalized (0..1).</div>
      </div>
    `;
    DEPS.appendOverlay(overlay);

    await new Promise((r) => requestAnimationFrame(r));

    const stage = overlay.querySelector("#roiStage");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    await img.decode();
    const viewport = overlay.querySelector("[data-roi-viewport]");
    const maxW = Math.floor(viewport?.clientWidth || window.innerWidth * 0.96);
    const maxH = Math.floor(viewport?.clientHeight || window.innerHeight * 0.84);
    const scale = Math.min(1, maxW / img.naturalWidth, maxH / img.naturalHeight);
    const displayW = Math.max(1, Math.floor(img.naturalWidth * scale));
    const displayH = Math.max(1, Math.floor(img.naturalHeight * scale));
    img.width = displayW;
    img.height = displayH;
    stage.style.width  = displayW + "px";
    stage.style.height = displayH + "px";
    stage.appendChild(img);

    const COLORS = { TOPLEFT:"#22d3ee", BANNER:"#a855f7", TOPRIGHT:"#ef4444", BOTTOMLEFT:"#10b981" };
    let rois = loadRois();
    const boxes = {};

    function addBox(name) {
      const d = document.createElement("div");
      d.className = "absolute select-none";
      d.style.boxShadow = `0 0 0 2px ${COLORS[name]} inset`;
      d.style.outline = `1px dashed ${COLORS[name]}55`;
      d.dataset.name = name;

      const label = document.createElement("div");
      label.textContent = name;
      label.style.position="absolute"; label.style.left="2px"; label.style.top="-18px";
      label.style.fontSize="11px"; label.style.color=COLORS[name];
      d.appendChild(label);

      const hs = ["n","s","e","w","ne","nw","se","sw"];
      hs.forEach(h=>{
        const hdl = document.createElement("div");
        hdl.dataset.handle=h;
        hdl.style.position="absolute"; hdl.style.width="10px"; hdl.style.height="10px";
        hdl.style.background=COLORS[name]; hdl.style.opacity="0.8"; hdl.style.borderRadius="2px";
        const pos = { n:["50%","-5px"], s:["50%","calc(100% - 5px)"], e:["calc(100% - 5px)","50%"], w:["-5px","50%"],
                      ne:["calc(100% - 5px)","-5px"], nw:["-5px","-5px"], se:["calc(100% - 5px)","calc(100% - 5px)"], sw:["-5px","calc(100% - 5px)"] };
        hdl.style.left = pos[h][0]; hdl.style.top = pos[h][1];
        hdl.style.transform = /n|s/.test(h) ? "translateX(-50%)" : /e|w/.test(h) ? "translateY(-50%)" : "";
        d.appendChild(hdl);
      });

      stage.appendChild(d);
      boxes[name] = d;
    }

    function placeFromRois() {
      const W = displayW, H = displayH;
      for (const k of Object.keys(COLORS)) {
        if (!boxes[k]) addBox(k);
        const [x1,y1,x2,y2] = rois[k];
        const d = boxes[k];
        d.style.left = (x1*W) + "px";
        d.style.top  = (y1*H) + "px";
        d.style.width  = Math.max(1,(x2-x1)*W) + "px";
        d.style.height = Math.max(1,(y2-y1)*H) + "px";
      }
    }

    let cur = null;
    stage.addEventListener("pointerdown", (ev)=>{
      const box = ev.target.closest("[data-name]");
      if (!box) return;
      cur = {
        box,
        name: box.dataset.name,
        startX: ev.clientX, startY: ev.clientY,
        handle: ev.target.dataset.handle || null
      };
      box.setPointerCapture(ev.pointerId);
      ev.preventDefault();
    });

    stage.addEventListener("pointermove", (ev)=>{
      if (!cur) return;
      const box = cur.box;
      const st = box.style;
      const dx = ev.clientX - cur.startX;
      const dy = ev.clientY - cur.startY;

      let left = parseFloat(st.left) || 0;
      let top  = parseFloat(st.top)  || 0;
      let width  = parseFloat(st.width)  || 0;
      let height = parseFloat(st.height) || 0;

      const h = cur.handle;
      if (!h) { left += dx; top += dy; }
      else {
        if (h.includes("e")) width  += dx;
        if (h.includes("s")) height += dy;
        if (h.includes("w")) { left += dx; width  -= dx; }
        if (h.includes("n")) { top  += dy; height -= dy; }
        width = Math.max(6, width);
        height= Math.max(6, height);
      }

      left  = Math.max(0, Math.min(left,  stage.clientWidth  - width));
      top   = Math.max(0, Math.min(top,   stage.clientHeight - height));

      st.left   = left + "px";
      st.top    = top  + "px";
      st.width  = width  + "px";
      st.height = height + "px";

      cur.startX = ev.clientX; cur.startY = ev.clientY;
    });

    stage.addEventListener("pointerup", ()=>{
      if (!cur) return;
      const W = displayW, H = displayH;
      const st = cur.box.style;
      const x = parseFloat(st.left), y = parseFloat(st.top),
            w = parseFloat(st.width), h = parseFloat(st.height);
      rois[cur.name] = [x/W, y/H, (x+w)/W, (y+h)/H];
      cur = null;
    });

    placeFromRois();

    overlay.querySelector("#roiReset").onclick  = () => { rois = { ...DEFAULT_ROIS }; placeFromRois(); };
    overlay.querySelector("#roiCancel").onclick = () => { overlay.remove(); resolve(null); };
    overlay.querySelector("#roiSave").onclick   = () => {
      saveRois(rois);
      overlay.remove();
      resolve(rois);
    };
  });
}

// Single lightbox delegation on the workspace root so [data-enlarge] thumbnails
// in BOTH the completion and map-edit queues open the lightbox (binding it on a
// single list would only cover that one queue).
function wireLightbox(root) {
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-enlarge]');
    if (btn) { e.preventDefault(); openImageLightbox(btn.dataset.enlarge); }
  });
}

function wireCompletionActions(root) {
  const listEl = $('[data-verif-completion-list]', root);
  if (!listEl) return;

  listEl.addEventListener('click', async (e) => {
    const card = e.target.closest('[data-record-id]');
    if (!card) return;
    const meId = (typeof window.user_id !== 'undefined' && window.user_id) ? String(window.user_id) : '';

    if (e.target.closest('.btn-calibrate-ocr')) {
      e.preventDefault();
      if (meId !== CALIB_ALLOWED_USER_ID) return DEPS.toast('Calibrate OCR is restricted to devs.', 'warn');
      const url = card.dataset.screenshot;
      if (!url) return DEPS.toast('No screenshot', 'warn');
      const rois = await openRoiEditor(url);
      if (rois) { saveRois(rois); pushRoisToWorker(getAutoVerifyWorker(), rois); DEPS.toast('ROIs updated', 'ok'); }
      return;
    }

    if (e.target.closest('.btn-auto-verify')) {
      e.preventDefault();
      if (meId !== AUTO_VERIFY_ALLOWED_USER_ID) return DEPS.toast('Auto verify is restricted to devs.', 'warn');
      return void DEPS.runModeratorEndpointAction(
        { action: 'auto-verify-completion', article: card },
        () => autoVerifyCard(card)
      );
    }

    const verify = e.target.closest('.btn-verify');
    const deny = e.target.closest('.btn-deny');
    if (!verify && !deny) return;

    const record_id = card.dataset.recordId;
    let reason = null;
    if (deny) {
      const { cancelled, reason: r } = await showDenyDialog({ title: 'Deny completion' });
      if (cancelled) return;
      reason = (r ?? '').trim() || null;
    }
    if (!MOD_USER_ID) return DEPS.toast('Missing moderator id', 'warn');

    const body = { verified: !!verify, verified_by: MOD_USER_ID, reason };
    const response = await DEPS.runModeratorEndpointAction(
      { action: verify ? 'verify-completion' : 'deny-completion', article: card },
      () => DEPS.http('PUT', `${API_MODS}/completions/${encodeURIComponent(record_id)}/verification`, { body })
    );
    if (!response) return;
    const { ok, status, url, data } = response;
    DEPS.logActivity({ title: verify ? 'Verify completion' : 'Deny completion', method: 'PUT', url, ok, status, data });
    if (ok) {
      DEPS.toast(verify ? 'Verified' : 'Denied', 'ok');
      removeCardFromVerifList(card);
      // removeCardFromVerifList removes on transitionend, so the card is still
      // counted here; subtract the one being removed.
      setCount(root, 'completions', Math.max(0, $$('[data-record-id]', listEl).length - 1));
    } else {
      DEPS.toast('Action failed', 'err');
    }
  });
}

// ——— Edit diff helpers + summarizeChanges (copied from moderator.js:6220-6412) ———
function __editFormatDateTime(v) {
  const s = String(v ?? '').trim();
  if (!s) return '';
  try {
    const d = new Date(s);
    if (!Number.isFinite(d.getTime())) return s;
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return s;
  }
}

function __editNormalizeChange(c) {
  if (!c || typeof c !== 'object') return { field: 'change', from: '', to: '' };

  const field =
    c.field ?? c.key ?? c.name ?? c.path ?? c.property ?? c.type ?? c.kind ?? 'change';

  const from =
    c.old_value ?? c.oldValue ?? c.from ?? c.old ?? c.before ?? c.prev ?? c.previous ?? '';

  const to =
    c.new_value ?? c.newValue ?? c.to ?? c.new ?? c.after ?? c.next ?? c.updated ?? '';

  return { field: String(field), from, to };
}

function __editParseBoolLike(v) {
  if (v == null) return null;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;

  const s = String(v).trim().toLowerCase();
  if (['true', '1', 'yes', 'y', 'on'].includes(s)) return true;
  if (['false', '0', 'no', 'n', 'off'].includes(s)) return false;

  // common API renderings
  if (s === 'not set' || s === 'n/a' || s === 'na' || s === '') return null;
  return null;
}

function __editTextBlock(text) {
  const s = String(text ?? '').trim();
  if (!s || /^not set$/i.test(s)) return `<span class="text-zinc-600 dark:text-zinc-500">—</span>`;
  return `<div class="rounded-lg bg-zinc-900/3 dark:bg-white/5 px-2.5 py-1.5 text-[13px] text-zinc-900 dark:text-zinc-100 ring-1 ring-zinc-300/60 dark:ring-white/10 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">${escapeHtml(s)}</div>`;
}

function __editChipList(text) {
  const s = String(text ?? '').trim();
  if (!s || /^not set$/i.test(s)) return `<span class="text-zinc-600 dark:text-zinc-500">—</span>`;

  // Split on commas (good enough for mechanics/restrictions)
  const items = s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

  if (!items.length) return `<span class="text-zinc-600 dark:text-zinc-500">—</span>`;

  const max = 14;
  const chips = items.slice(0, max).map((it) =>
    `<span class="inline-flex items-center rounded-full border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 px-2 py-0.5 text-[11px] text-zinc-900 dark:text-white/85">${escapeHtml(it)}</span>`
  );

  const more = items.length > max
    ? `<span class="text-[11px] text-zinc-600 dark:text-zinc-400">+${items.length - max}</span>`
    : '';

  return `<div class="flex flex-wrap gap-1.5">${chips.join('')}${more}</div>`;
}

function __editBannerPreview(url) {
  const u = String(url ?? '').trim();
  if (!u || /^not set$/i.test(u)) return `<span class="text-zinc-600 dark:text-zinc-500">—</span>`;

  if (!/^https?:\/\//i.test(u)) return __editTextBlock(u);

  return `
    <div class="flex items-center gap-3 min-w-0">
      <div class="h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-200/80 dark:border-white/10 bg-black/20">
        <img src="${escapeHtml(u)}" alt="" class="h-full w-full object-cover cursor-pointer" data-enlarge="${escapeHtml(u)}">
      </div>
      <div class="min-w-0">
        <a href="${escapeHtml(u)}" target="_blank" class="text-xs underline decoration-dotted text-zinc-800 dark:text-zinc-200 hover:opacity-80 break-all">${escapeHtml(u)}</a>
        <div class="mt-1 text-[11px] text-zinc-600 dark:text-zinc-500">click image to enlarge</div>
      </div>
    </div>
  `;
}

function __editValueHtml(field, value) {
  const f = String(field ?? '').trim();
  const fLower = f.toLowerCase();
  const raw = value == null ? '' : String(value);
  const s = raw.trim();

  if (!s || /^not set$/i.test(s) || s === 'N/A') return `<span class="text-zinc-600 dark:text-zinc-500">—</span>`;

  // common boolean flags
  if (/(^|\b)(official|hidden|archived)(\b|$)/.test(fLower)) {
    const b = __editParseBoolLike(s);
    if (b !== null) return boolChip(b);
  }

  // special lists
  if (fLower.includes('mechanic')) return __editChipList(s);
  if (fLower.includes('restriction')) return __editChipList(s);

  // banner
  if (fLower.includes('banner')) return __editBannerPreview(s);

  // difficulty
  if (fLower.includes('difficulty')) {
    const dotCls =
      String(s).toLowerCase().startsWith('easy') ? 'bg-emerald-400'
        : String(s).toLowerCase().startsWith('medium') ? 'bg-yellow-400'
        : String(s).toLowerCase().startsWith('very hard') ? 'bg-orange-500'
        : String(s).toLowerCase().startsWith('hard') ? 'bg-orange-400'
        : String(s).toLowerCase().startsWith('extreme') ? 'bg-red-500'
        : String(s).toLowerCase().startsWith('hell') ? 'bg-rose-500'
        : 'bg-zinc-400';

    return `
      <span class="inline-flex items-center gap-2">
        <span class="h-2 w-2 rounded-full ${dotCls}"></span>
        ${decorateValue('difficulty', s)}
      </span>
    `;
  }

  // numbers / ids / urls
  if (s.length > 90) return __editTextBlock(s);

  // code
  if (fLower === 'code' || fLower.includes(' code')) return monoChip(s);

  // creators
  if (fLower.includes('creator')) return __editTextBlock(s);

  return decorateValue(fLower.replace(/\s+/g, '_'), s);
}

function summarizeChanges(changes) {
  const list = Array.isArray(changes) ? changes : [];
  if (!list.length) return `<div class="text-xs text-zinc-600 dark:text-zinc-400">No change details.</div>`;

  const header = `
    <div class="grid grid-cols-12 gap-3 px-3 py-2 text-[11px] uppercase tracking-wide text-zinc-600 dark:text-zinc-400 bg-zinc-900/3 dark:bg-white/5">
      <div class="col-span-12 sm:col-span-3">Field</div>
      <div class="col-span-12 sm:col-span-4">Old</div>
      <div class="col-span-12 sm:col-span-5">New</div>
    </div>
  `;

  const maxRows = 40;
  const rows = list.slice(0, maxRows).map((c) => {
    const { field, from, to } = __editNormalizeChange(c);
    const f = String(field || 'change');

    return `
      <div class="grid grid-cols-12 gap-3 px-3 py-2 border-t border-zinc-200/80 dark:border-white/10 hover:bg-zinc-900/3 dark:hover:bg-white/5 transition min-w-0">
        <div class="col-span-12 sm:col-span-3 min-w-0">
          <div class="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200 break-words [overflow-wrap:anywhere]">${escapeHtml(f)}</div>
        </div>
        <div class="col-span-12 sm:col-span-4 min-w-0">
          ${__editValueHtml(f, from)}
        </div>
        <div class="col-span-12 sm:col-span-5 min-w-0">
          ${__editValueHtml(f, to)}
        </div>
      </div>
    `;
  });

  const more = list.length > maxRows
    ? `<div class="px-3 py-2 text-xs text-zinc-600 dark:text-zinc-500 border-t border-zinc-200/80 dark:border-white/10">Showing ${maxRows} / ${list.length} changes.</div>`
    : '';

  return `
    <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-black/20 overflow-hidden min-w-0">
      ${header}
      ${rows.join('')}
      ${more}
    </div>
  `;
}

// ——— renderEditRequestCard (copied from moderator.js:6414-6496; View JSON button
//     and _editRow/_editSubmission assignments removed) ———
function renderEditRequestCard({ row, submission }) {
  const rid = String(row?.id ?? submission?.id ?? '').trim();
  const code = String(submission?.code ?? row?.code ?? '').trim();
  const mapName = String(submission?.map_name ?? row?.map_name ?? '').trim();
  const difficulty = String(submission?.difficulty ?? row?.difficulty ?? '').trim();

  const reason = String(submission?.reason ?? row?.reason ?? '').trim();
  const createdAtRaw = submission?.created_at ?? row?.created_at ?? '';
  const createdAt = __editFormatDateTime(createdAtRaw);

  const submitterName = String(submission?.submitter_name ?? row?.submitter_name ?? '').trim();
  const submitterId = submission?.submitter_id ?? row?.submitter_id ?? row?.created_by ?? '';
  const messageId = submission?.message_id ?? row?.message_id ?? '';

  const changes = submission?.changes ?? row?.changes ?? null;

  const wrap = document.createElement('article');
  wrap.className =
    'rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 p-4 ring-1 ring-zinc-900/5 dark:ring-white/5 relative pb-16 min-w-0';
  wrap.dataset.editId = rid;

  const badge = `
    <span class="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-400/20 dark:text-amber-200">
      <span class="h-1.5 w-1.5 rounded-full bg-amber-400"></span> Pending
    </span>`;

  const difficultyDot = difficulty ? __editValueHtml('difficulty', difficulty) : '';

  wrap.innerHTML = `
    <div class="flex items-start justify-between gap-3 min-w-0">
      <div class="min-w-0">
        <h4 class="font-semibold text-lg min-w-0 break-words [overflow-wrap:anywhere]">Edit request #${escapeHtml(rid || '?')}</h4>
        <div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 min-w-0">
          <span class="inline-flex items-center gap-2">
            <span class="text-zinc-600 dark:text-zinc-500">code</span> ${monoChip(code || '—')}
          </span>
          ${mapName ? `<span class="inline-flex items-center gap-2"><span class="text-zinc-600 dark:text-zinc-500">map</span> ${decorateValue('map_name', mapName)}</span>` : ''}
          ${difficulty ? `<span class="inline-flex items-center gap-2"><span class="text-zinc-600 dark:text-zinc-500">difficulty</span> ${difficultyDot}</span>` : ''}
        </div>
      </div>
      <div class="flex items-end flex-col gap-2">
        ${badge}
        ${createdAt ? `<div class="text-[11px] text-zinc-600 dark:text-zinc-500">${escapeHtml(createdAt)}</div>` : ''}
      </div>
    </div>

    <div class="mt-3 grid gap-1.5 min-w-0">
      ${submitterName || submitterId ? kvRow('submitter', `${submitterName || ''}${submitterId ? ` (${submitterId})` : ''}`) : ''}
      ${messageId ? kvRow('message_id', String(messageId)) : ''}
      ${reason ? `
        <div class="mt-2 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 p-3">
          <div class="text-[11px] uppercase tracking-wide text-zinc-600 dark:text-zinc-400">Reason</div>
          <div class="mt-1 text-sm text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">${escapeHtml(reason)}</div>
        </div>
      ` : ''}
    </div>

    <div class="mt-4 min-w-0">
      <div class="flex items-center justify-between gap-3 mb-2">
        <div class="text-xs text-zinc-600 dark:text-zinc-400">Changes <span class="text-zinc-600 dark:text-zinc-500">(${Array.isArray(changes) ? changes.length : 0})</span></div>
        <div class="text-[11px] text-zinc-600 dark:text-zinc-500">old → new</div>
      </div>
      <div class="min-w-0">${summarizeChanges(changes)}</div>
    </div>

    <div class="absolute bottom-4 right-4 flex flex-wrap items-center gap-2 z-10">
      <button class="btn-edit-accept cursor-pointer rounded-lg bg-emerald-500 text-zinc-900 px-3 py-1.5 text-sm font-semibold hover:bg-emerald-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30">
        Accept
      </button>
      <button class="btn-edit-reject cursor-pointer rounded-lg bg-rose-700 text-white px-3 py-1.5 text-sm font-semibold hover:bg-rose-800 focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-500/40">
        Reject
      </button>
    </div>
  `;

  return wrap;
}

// ——— removeCardFromEditList (copied verbatim from moderator.js:7815-7843) ———
function removeCardFromEditList(card) {
  if (!card) return;
  const container = card.parentElement;

  const h = card.offsetHeight;
  card.style.height = h + 'px';
  card.style.transition =
    'height 200ms ease, opacity 160ms ease, transform 160ms ease, margin 200ms ease, padding 200ms ease';
  void card.offsetHeight;

  card.style.opacity = '0';
  card.style.transform = 'translateY(-4px)';
  card.style.height = '0px';
  card.style.marginTop = '0px';
  card.style.marginBottom = '0px';
  card.style.paddingTop = '0px';
  card.style.paddingBottom = '0px';

  card.addEventListener(
    'transitionend',
    () => {
      card.remove();
      if (container && !container.querySelector('[data-edit-id]')) {
        container.innerHTML = `<div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] p-6 text-sm text-zinc-500 dark:text-zinc-400">Queue's clear ✓ — no pending edit requests.</div>`;
      }
    },
    { once: true }
  );
}

async function loadEdits(root, { force }) {
  if (loaded.edits && !force) return;
  const queueEl = $('[data-verif-queue="edits"]', root);
  const listEl = $('[data-verif-edit-list]', root);
  setQueueView(queueEl, 'loading');

  let res;
  try {
    res = await DEPS.http('GET', `${API_MODS}/maps/map-edits/pending`);
  } catch {
    return showQueueError(queueEl, 'Network error — try again.');
  }
  const { ok, status, url, data } = res;
  DEPS.logActivity({ title: 'Pending edit requests', method: 'GET', url, ok, status, data });
  if (!ok) return showQueueError(queueEl, `Failed to load edit queue (${status}).`);

  const rows = (Array.isArray(data) ? data : []).filter((r) => String(r?.id ?? '').trim());
  loaded.edits = true;
  if (!rows.length) { setCount(root, 'edits', 0); return setQueueView(queueEl, 'empty'); }

  const limit = 25;
  const subset = rows.slice(0, limit);
  const progress = $('[data-verif-progress]', queueEl);
  let done = 0;
  const cards = await mapLimit(subset, 4, async (row) => {
    const editId = String(row.id).trim();
    let sub;
    try {
      sub = await DEPS.http('GET', `${API_MODS}/maps/map-edits/${encodeURIComponent(editId)}/submission`);
    } catch {
      // A single submission failing must not reject the whole load (which would
      // strand the queue on the loading view); render the row without its submission.
      done += 1;
      if (progress) progress.textContent = `Loading ${done}/${subset.length}…`;
      return renderEditRequestCard({ row, submission: null });
    }
    DEPS.logActivity({ title: `Edit submission ${editId}`, method: 'GET', url: sub.url, ok: sub.ok, status: sub.status, data: sub.data });
    done += 1;
    if (progress) progress.textContent = `Loading ${done}/${subset.length}…`;
    return renderEditRequestCard({ row, submission: sub.ok ? sub.data : null });
  });

  listEl.innerHTML = '';
  cards.forEach((c) => listEl.appendChild(c));
  if (rows.length > limit) {
    const note = document.createElement('div');
    note.className = 'text-xs text-zinc-500 dark:text-zinc-500';
    note.textContent = `Showing ${limit} / ${rows.length}.`;
    listEl.appendChild(note);
  }
  setCount(root, 'edits', rows.length);
  setQueueView(queueEl, 'loaded');
}

function wireEditActions(root) {
  const listEl = $('[data-verif-edit-list]', root);
  if (!listEl) return;
  listEl.addEventListener('click', async (e) => {
    const accept = e.target.closest('.btn-edit-accept');
    const reject = e.target.closest('.btn-edit-reject');
    if (!accept && !reject) return;
    const card = e.target.closest('[data-edit-id]');
    const editId = card?.dataset?.editId;
    if (!editId) return;
    if (!/^\d+$/.test(MOD_USER_ID)) return DEPS.toast('Your moderator ID is missing', 'warn');

    if (accept) {
      const response = await DEPS.runModeratorEndpointAction(
        { action: 'resolve-map-edit-accept', article: card },
        () => DEPS.http('PUT', `${API_MODS}/maps/map-edits/${encodeURIComponent(editId)}/resolve`,
          { body: { accepted: true, resolved_by: String(MOD_USER_ID) } })
      );
      if (!response) return;
      const { ok, status, url, data } = response;
      DEPS.logActivity({ title: `Resolve edit ${editId} (accept)`, method: 'PUT', url, ok, status, data });
      DEPS.toast(ok ? 'Edit accepted' : 'Failed', ok ? 'ok' : 'err');
      if (ok) { removeCardFromEditList(card); setCount(root, 'edits', Math.max(0, $$('[data-edit-id]', listEl).length - 1)); }
      return;
    }

    const dlg = await showDenyDialog({ title: `Reject edit request #${editId}` });
    if (dlg.cancelled) return;
    const response = await DEPS.runModeratorEndpointAction(
      { action: 'resolve-map-edit-reject', article: card },
      () => DEPS.http('PUT', `${API_MODS}/maps/map-edits/${encodeURIComponent(editId)}/resolve`,
        { body: { accepted: false, resolved_by: String(MOD_USER_ID), rejection_reason: dlg.reason } })
    );
    if (!response) return;
    const { ok, status, url, data } = response;
    DEPS.logActivity({ title: `Resolve edit ${editId} (reject)`, method: 'PUT', url, ok, status, data });
    DEPS.toast(ok ? 'Edit rejected' : 'Failed', ok ? 'ok' : 'err');
    if (ok) { removeCardFromEditList(card); setCount(root, 'edits', Math.max(0, $$('[data-edit-id]', listEl).length - 1)); }
  });
}
