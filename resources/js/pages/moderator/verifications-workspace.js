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
  return `<span class="inline-block rounded-md bg-black/30 px-1.5 py-0.5 font-mono text-[12px] tracking-tight ring-1 ring-zinc-300/60 dark:ring-white/10">${escapeHtml(String(text))}</span>`;
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
      yes ? 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/20' : 'bg-rose-500/10 text-rose-300 ring-rose-400/20'
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
  // remaining wiring added in later tasks
}

function wireSubtabLoading(root) {}
function wireRefreshButtons(root) {}
