import { $, $$ } from './workspace-shell.js';

let DEPS = null;
const ROOT = () => $('[data-tournament-workspace]');

// Loaded-once flags; Refresh forces reload.
const loaded = { status: false, setup: false };

const API = '/api/tournaments';
const API_MODS = '/api/mods/tournaments';

// Live countdown timer for the active-edition strip.
let countdownTimer = null;

export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

export function initTournamentWorkspace(deps) {
  DEPS = deps;
  const root = ROOT();
  if (!root) return;
  wireSubtabLoading(root);
  wireRefresh(root);
  wireEditionActions(root);
  // Feature wiring added in later tasks:
  // wireCategoryActions(root); wireStreakLookup(root); wireSetup(root);
}

function wireSubtabLoading(root) {
  root.addEventListener('click', (e) => {
    const tab = e.target.closest('.mod-subtab');
    if (!tab) return;
    const name = tab.dataset.subtab;
    if (name === 'tournament-status') loadStatus(root, { force: false });
    if (name === 'tournament-setup') loadSetup(root, { force: false });
  });
}

function wireRefresh(root) {
  root.addEventListener('click', (e) => {
    if (!e.target.closest('[data-tournament-refresh]')) return;
    e.preventDefault();
    loadStatus(root, { force: true });
  });
}

// ===== Status sub-tab: edition strip + paused banner =====

async function loadStatus(root, { force }) {
  if (loaded.status && !force) return;
  let data;
  try {
    data = await fetchStatusData();
  } catch (err) {
    loaded.status = false;
    showStatusError(root, err);
    return;
  }
  const { config, edition, cycles } = data;
  hideStatusError(root);
  renderPausedBanner(root, { config, edition });
  renderEditionStrip(root, { edition, config, cycles });
  // renderCategoryCards(root, { config, edition, cycles }); — Task 3
  loaded.status = true;
}

// Fetch config + active edition + active cycles, logging each through DEPS.
async function fetchStatusData() {
  const configUrl = `${API}/config`;
  const editionUrl = `${API}/editions/active`;
  const cyclesUrl = `${API}/cycles`;

  const [config, edition, activeCycles] = await Promise.all([
    DEPS.http('GET', configUrl),
    DEPS.http('GET', editionUrl),
    DEPS.http('GET', cyclesUrl, { query: { status: 'active', limit: 100 } }),
  ]);

  DEPS.logActivity({ title: 'Tournament Config (GET)', method: 'GET', url: config.url || configUrl, ok: config.ok, status: config.status, data: config.data });
  DEPS.logActivity({ title: 'Tournament Active Edition (GET)', method: 'GET', url: edition.url || editionUrl, ok: edition.ok, status: edition.status, data: edition.data });
  DEPS.logActivity({ title: 'Tournament Active Cycles (GET)', method: 'GET', url: activeCycles.url || cyclesUrl, ok: activeCycles.ok, status: activeCycles.status, data: activeCycles.data });

  // Config must be readable; a non-OK config is a hard failure.
  if (!config.ok) {
    const e = new Error('Failed to load tournament config');
    e.res = config;
    throw e;
  }

  const cfg = config.data && typeof config.data === 'object' ? config.data : {};
  // editions/active returns 404 when no edition is running — treat as "no edition".
  const editionData = edition.ok && edition.data && typeof edition.data === 'object' ? edition.data : null;
  const cycles = Array.isArray(activeCycles.data?.cycles)
    ? activeCycles.data.cycles
    : Array.isArray(activeCycles.data)
      ? activeCycles.data
      : [];

  return { config: cfg, edition: editionData, cycles };
}

function showStatusError(root, err) {
  const box = $('[data-view="error"]', root);
  if (box) {
    box.classList.remove('hidden');
    box.textContent = (err && err.message) ? err.message : 'Failed to load tournament status.';
  }
  DEPS.toast((err && err.message) || 'Failed to load tournament status', 'err');
}

function hideStatusError(root) {
  const box = $('[data-view="error"]', root);
  if (box) box.classList.add('hidden');
}

// ----- helpers ported from moderator.js (tournament*) -----

function tournamentEscape(value) {
  return escapeHtml(String(value ?? ''));
}

function tournamentFormatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function tournamentStatusPill(status) {
  const text = String(status ?? '-');
  const normalized = text.toLowerCase();
  const cls = normalized === 'active' || normalized === 'true'
    ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
    : normalized === 'pending'
      ? 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300'
      : normalized === 'completed'
        ? 'border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300'
        : 'border-zinc-200/80 bg-white/70 text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300';

  return `<span class="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}">${tournamentEscape(text)}</span>`;
}

function tournamentIsProdEnv(root) {
  const env = String(root?.dataset?.appEnv || '').toLowerCase();
  return env === 'production' || env === 'prod';
}

function clearTournamentCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
}

function tournamentCountdownText(target) {
  const ms = target instanceof Date ? target.getTime() : Number(new Date(target).getTime());
  if (!Number.isFinite(ms)) return '-';
  let diff = Math.floor((ms - Date.now()) / 1000);
  if (diff <= 0) return 'window ended — awaiting rollover';

  const days = Math.floor(diff / 86400); diff -= days * 86400;
  const hours = Math.floor(diff / 3600); diff -= hours * 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff - minutes * 60;

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (days || hours) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(' ');
}

function tournamentBootstrapError(data) {
  if (!data || typeof data !== 'object') return '';
  if (typeof data.message === 'string' && data.message.trim()) return data.message.trim();
  if (data.errors && typeof data.errors === 'object') {
    const first = Object.values(data.errors).flat().filter(Boolean)[0];
    if (first) return String(first);
  }
  return '';
}

function tournamentLifecycleHeader(config) {
  const paused = config?.transitions_paused === true;
  const rotationPill = paused
    ? '<span class="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">Auto-rotation paused</span>'
    : '<span class="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">Auto-rotation on</span>';
  return rotationPill;
}

// Paused state lives on the config (transitions_paused), matching the original
// lifecycle render. The `??` fallbacks degrade gracefully if a future API ever
// surfaces the flag on the edition instead.
function renderPausedBanner(root, { config, edition }) {
  const banner = $('[data-tournament-paused-banner]', root);
  if (!banner) return;
  const paused = !!(
    (config && config.transitions_paused) ??
    (edition && (edition.paused ?? edition.transitions_paused))
  );
  banner.classList.toggle('hidden', !paused);
  if (paused) banner.textContent = 'Auto-rotation is PAUSED — cycles will not advance until you resume.';
}

// Ported from renderTournamentLifecyclePanel — targets [data-tournament-edition-strip].
function renderEditionStrip(root, { edition, config, cycles }) {
  const panel = $('[data-tournament-edition-strip]', root);
  if (!panel) return;
  clearTournamentCountdown();

  const status = edition && typeof edition === 'object' ? String(edition.status || '').toLowerCase() : null;
  const header = tournamentLifecycleHeader(config);

  let body = '';

  if (!edition) {
    // No active edition (404).
    body = `
      <div class="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 dark:border-white/10 dark:bg-zinc-950/40">
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-base font-black">No tournament running</h4>
          ${header}
        </div>
        <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">There is no active edition. Starting the tournament does <strong>two</strong> things:</p>
        <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
          <li>Starts the first edition now and opens the first cycle for every active category.</li>
          <li>Enables automatic weekly rotation by clearing the global pause flag.</li>
        </ul>
        <button type="button" data-tournament-lc-action="start" class="mt-4 w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
          Start tournament &amp; enable rotation
        </button>
      </div>`;
  } else if (status === 'active') {
    const paused = config?.transitions_paused === true;
    const toggle = paused
      ? `<button type="button" data-tournament-lc-action="resume" class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Resume auto-rotation</button>`
      : `<button type="button" data-tournament-lc-action="pause" class="w-full sm:w-auto cursor-pointer rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 font-semibold text-amber-700 hover:bg-amber-500/15 dark:text-amber-300">Pause auto-rotation</button>`;

    const cycleRows = Array.isArray(cycles) && cycles.length
      ? cycles.map((cycle) => {
          const categoryName = cycle.category_name || `Category #${cycle.category_id ?? '-'}`;
          return `
          <div class="flex items-center justify-between gap-3 rounded-xl border border-zinc-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-zinc-900/55">
            <div class="min-w-0">
              <div class="truncate text-sm font-semibold">${tournamentEscape(categoryName)}</div>
              <div class="truncate text-xs text-zinc-500 dark:text-zinc-400">${tournamentEscape(cycle.map_name || 'No map')} <span class="font-mono">${tournamentEscape(cycle.map_code || '')}</span> ${cycle.map_difficulty ? `· ${tournamentEscape(cycle.map_difficulty)}` : ''}</div>
            </div>
            ${tournamentStatusPill(cycle.status || 'active')}
          </div>`;
        }).join('')
      : '<div class="rounded-xl border border-dashed border-zinc-300/80 p-3 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">No active cycles.</div>';

    body = `
      <div class="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5 dark:border-emerald-400/15">
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-base font-black">Edition in progress</h4>
          ${header}
        </div>
        <dl class="mt-3 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white/70 px-3 py-2 dark:bg-zinc-900/55"><dt class="text-xs text-zinc-500 dark:text-zinc-400">Started</dt><dd class="text-sm font-semibold">${tournamentEscape(tournamentFormatDate(edition.started_at))}</dd></div>
          <div class="rounded-xl bg-white/70 px-3 py-2 dark:bg-zinc-900/55"><dt class="text-xs text-zinc-500 dark:text-zinc-400">Ends</dt><dd class="text-sm font-semibold">${tournamentEscape(tournamentFormatDate(edition.ends_at))}</dd></div>
          <div class="rounded-xl bg-white/70 px-3 py-2 dark:bg-zinc-900/55"><dt class="text-xs text-zinc-500 dark:text-zinc-400">Time left</dt><dd class="text-sm font-semibold tabular-nums" data-tournament-countdown data-ends-at="${tournamentEscape(edition.ends_at || '')}">…</dd></div>
        </dl>
        <div class="mt-4">
          <div class="mb-2 text-sm font-semibold">Active cycles</div>
          <div class="space-y-2">${cycleRows}</div>
        </div>
        <div class="mt-4 rounded-xl border border-zinc-200/80 bg-white/60 p-3 dark:border-white/10 dark:bg-zinc-900/40">
          <p class="text-xs text-zinc-600 dark:text-zinc-300">Pausing is a <strong>hiatus</strong>: the current edition still finishes its full term. Only creation of the <strong>next</strong> edition at the boundary is suppressed until you resume.</p>
          <div class="mt-3">${toggle}</div>
        </div>
      </div>`;
  } else if (status === 'awaiting_results') {
    const pending = edition.pending_verifications ?? edition.awaiting_verifications ?? edition.pending_count ?? null;
    const pendingText = pending != null
      ? `<strong>${tournamentEscape(pending)}</strong> verification${Number(pending) === 1 ? '' : 's'} still pending.`
      : 'Verifications are still being processed.';

    body = `
      <div class="rounded-2xl border border-sky-500/20 bg-sky-500/[0.04] p-5 dark:border-sky-400/15">
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-base font-black">Edition ended — awaiting results</h4>
          ${header}
        </div>
        <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">The edition window closed and standings publish automatically once verifications finish. ${pendingText}</p>
        <div class="mt-4 rounded-xl border border-zinc-200/80 bg-white/60 p-3 dark:border-white/10 dark:bg-zinc-900/40">
          <p class="text-xs text-zinc-600 dark:text-zinc-300">Use <strong>Publish results now</strong> only as an escape hatch — it force-publishes from currently-verified runs and ignores any in-flight verifications.</p>
          <button type="button" data-tournament-lc-action="publish" class="mt-3 w-full sm:w-auto cursor-pointer rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500">Publish results now</button>
        </div>
      </div>`;
  } else if (status === 'completed') {
    body = `
      <div class="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 dark:border-white/10 dark:bg-zinc-950/40">
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-base font-black">Edition complete</h4>
          ${header}
        </div>
        <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Final standings have been published${edition.ends_at ? ` (ended ${tournamentEscape(tournamentFormatDate(edition.ends_at))})` : ''}. The next edition starts automatically at the next anchor unless auto-rotation is paused.</p>
        <button type="button" data-tournament-lc-action="open-cycles" class="mt-4 w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">View completed cycles &amp; standings</button>
      </div>`;
  } else {
    body = `
      <div class="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 dark:border-white/10 dark:bg-zinc-950/40">
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-base font-black">Edition status: ${tournamentEscape(edition.status || 'unknown')}</h4>
          ${header}
        </div>
        <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">No specific actions are available for this state right now.</p>
      </div>`;
  }

  // Debug tools — hidden in production (the API itself returns 403 in prod).
  let debug = '';
  if (!tournamentIsProdEnv(root)) {
    const current = config?.debug_cycle_seconds;
    debug = `
      <details class="group mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-4 dark:border-amber-400/15">
        <summary class="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-amber-700 marker:hidden dark:text-amber-300 [&::-webkit-details-marker]:hidden">
          <svg class="h-4 w-4 shrink-0 text-amber-500 transition-transform group-open:rotate-90 dark:text-amber-300" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Debug tools (non-production only)</span>
        </summary>
        <p class="mt-2 text-xs text-zinc-600 dark:text-zinc-300">Override the cycle length to speed up testing. Current override: <strong>${current != null ? `${tournamentEscape(current)}s` : 'none'}</strong>.</p>
        <div class="mt-3 flex flex-col gap-2 sm:flex-row">
          <input data-tournament-debug-seconds type="number" min="1" step="1" placeholder="seconds" value="${current != null ? tournamentEscape(current) : ''}" class="min-w-0 flex-1 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500/60 focus:outline-none" />
          <button type="button" data-tournament-lc-action="debug-set" class="cursor-pointer rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100">Set</button>
          <button type="button" data-tournament-lc-action="debug-clear" class="cursor-pointer rounded-xl border border-zinc-200/80 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10">Clear override</button>
        </div>
      </details>`;
  }

  panel.innerHTML = body + debug;

  // Live countdown for the active edition.
  const countdownEl = panel.querySelector('[data-tournament-countdown]');
  if (countdownEl) {
    const endsAt = countdownEl.dataset.endsAt;
    const tick = () => { countdownEl.textContent = tournamentCountdownText(endsAt); };
    tick();
    countdownTimer = setInterval(tick, 1000);
  }
}

// ----- action wiring (ported from bindTournamentLifecyclePanel) -----

// Bound once from init; the strip re-renders on each load so we delegate from root.
function wireEditionActions(root) {
  root.addEventListener('click', (event) => {
    const btn = event.target?.closest?.('[data-tournament-lc-action]');
    if (!btn || !root.contains(btn)) return;
    // Only handle clicks originating inside the edition strip.
    if (!btn.closest('[data-tournament-edition-strip]')) return;
    event.preventDefault();

    const action = btn.dataset.tournamentLcAction;
    const handlers = {
      start: () => tournamentStartTournament(root),
      publish: () => tournamentPublishResults(root),
      pause: () => tournamentSetPaused(root, true),
      resume: () => tournamentSetPaused(root, false),
      'debug-set': () => tournamentSetDebugCycle(root, btn, { clear: false }),
      'debug-clear': () => tournamentSetDebugCycle(root, btn, { clear: true }),
    };
    const handler = handlers[action];
    if (handler) void handler();
    // 'open-cycles' is a Setup/cycles navigation concern handled in a later task.
  });
}

async function tournamentStartTournament(root) {
  const ok = await DEPS.showConfirmDanger({
    title: 'Start tournament',
    message:
      'This does TWO things:\n\n' +
      '• Starts the first edition now (opens the first cycle for every active category).\n' +
      '• Enables automatic weekly rotation (clears the global pause flag).\n\n' +
      'Editions will then roll over on their own at each anchor boundary until you pause. Continue?',
    confirm: 'Start & enable rotation',
    cancel: 'Cancel',
  });
  if (!ok) return;

  const url = `${API_MODS}/bootstrap`;
  const res = await DEPS.http('POST', url, { body: {} });
  DEPS.logActivity({ title: 'Tournament Start (POST /bootstrap)', method: 'POST', url: res.url || url, ok: res.ok, status: res.status, data: res.data });

  if (res.ok) DEPS.toast('Tournament started — auto-rotation enabled', 'ok');
  else if (res.status === 409) DEPS.toast('A tournament edition already exists', 'warn');
  else if (res.status === 422) DEPS.toast(tournamentBootstrapError(res.data) || 'A category has no eligible map', 'err');
  else DEPS.toast('Failed to start tournament', 'err');

  if (res.ok) await loadStatus(root, { force: true });
}

async function tournamentSetPaused(root, paused) {
  const url = `${API_MODS}/pause`;
  const res = await DEPS.http('PATCH', url, { body: { paused } });
  DEPS.logActivity({ title: `Tournament ${paused ? 'Pause' : 'Resume'} (PATCH /pause)`, method: 'PATCH', url: res.url || url, ok: res.ok, status: res.status, data: res.data });

  if (res.ok) DEPS.toast(paused ? 'Auto-rotation paused' : 'Auto-rotation resumed', 'ok');
  else DEPS.toast('Failed to update rotation', 'err');

  if (res.ok) await loadStatus(root, { force: true });
}

async function tournamentPublishResults(root) {
  const ok = await DEPS.showConfirmDanger({
    title: 'Publish results now',
    message:
      'This force-publishes standings from currently-verified runs and IGNORES any in-flight verifications.\n\n' +
      'Runs still awaiting verification will NOT be counted. This cannot be undone. Continue?',
    confirm: 'Publish now',
    cancel: 'Cancel',
  });
  if (!ok) return;

  const url = `${API_MODS}/publish-results`;
  const res = await DEPS.http('PATCH', url, { body: {} });
  DEPS.logActivity({ title: 'Tournament Publish Results (PATCH)', method: 'PATCH', url: res.url || url, ok: res.ok, status: res.status, data: res.data });

  if (res.ok) DEPS.toast('Results published', 'ok');
  else if (res.status === 409) DEPS.toast('No edition is awaiting results', 'warn');
  else DEPS.toast('Failed to publish results', 'err');

  if (res.ok) await loadStatus(root, { force: true });
}

async function tournamentSetDebugCycle(root, btn, { clear = false } = {}) {
  const strip = btn.closest('[data-tournament-edition-strip]') || root;
  const input = strip.querySelector('[data-tournament-debug-seconds]');
  let seconds = null;
  if (!clear) {
    const raw = String(input?.value || '').trim();
    if (!raw) return DEPS.toast('Enter a number of seconds (or use Clear override)', 'warn');
    seconds = Number(raw);
    if (!Number.isInteger(seconds) || seconds < 1) return DEPS.toast('Invalid seconds', 'warn');
  }

  const url = `${API_MODS}/debug-cycle-length`;
  const res = await DEPS.http('PATCH', url, { body: { seconds } });
  DEPS.logActivity({ title: 'Tournament Debug Cycle Length (PATCH)', method: 'PATCH', url: res.url || url, ok: res.ok, status: res.status, data: res.data });

  if (res.ok) DEPS.toast(clear ? 'Debug override cleared' : 'Debug cycle length set', 'ok');
  else if (res.status === 403) DEPS.toast('Debug cycle length is disabled in production', 'warn');
  else DEPS.toast('Failed to update debug cycle length', 'err');

  if (res.ok) await loadStatus(root, { force: true });
}

// Stub — implemented in a later task.
async function loadSetup(root, { force }) {
  if (loaded.setup && !force) return;
  loaded.setup = true;
}
