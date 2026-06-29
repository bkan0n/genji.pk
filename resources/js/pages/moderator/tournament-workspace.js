import { $, $$ } from './workspace-shell.js';
import { openModal } from './modal-shell.js';

let DEPS = null;
const ROOT = () => $('[data-tournament-workspace]');

// Loaded-once flags; Refresh forces reload.
const loaded = { status: false, setup: false, config: false };

const API = '/api/tournaments';
const API_MODS = '/api/mods/tournaments';

// Live countdown timer for the active-edition strip.
let countdownTimer = null;

// Last-loaded active cycles, cached so the inspection slide-over can resolve a
// category's active cycle id without re-fetching. Refreshed on every loadStatus.
let lastActiveCycles = [];

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
  wireCategoryActions(root);
  wireStreakLookup(root);
  // wireConfig is bound lazily from loadConfig (mirrors wireSetup), so no init-time call.
}

function wireSubtabLoading(root) {
  root.addEventListener('click', (e) => {
    const tab = e.target.closest('.mod-subtab');
    if (!tab) return;
    const name = tab.dataset.subtab;
    // Leaving Status hides the edition strip; stop its live countdown timer so it
    // doesn't keep ticking against a hidden node.
    if (name !== 'tournament-status') clearTournamentCountdown();
    if (name === 'tournament-status') loadStatus(root, { force: false });
    if (name === 'tournament-setup') loadSetup(root, { force: false });
    if (name === 'tournament-config') loadConfig(root, { force: false });
    // 'tournament-utility' needs no data loading: the streak lookup is read-only
    // and on-demand (bound once via wireStreakLookup). The generic sub-tab
    // switcher shows the panel; nothing to preload here.
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
  lastActiveCycles = Array.isArray(cycles) ? cycles : [];
  hideStatusError(root);
  renderPausedBanner(root, { config, edition });
  renderEditionStrip(root, { edition, config, cycles });
  await renderCategoryCards(root, { config, edition, cycles });
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

  panel.innerHTML = body;

  // Live countdown for the active edition.
  const countdownEl = panel.querySelector('[data-tournament-countdown]');
  if (countdownEl) {
    const endsAt = countdownEl.dataset.endsAt;
    const tick = () => { countdownEl.textContent = tournamentCountdownText(endsAt); };
    tick();
    countdownTimer = setInterval(tick, 1000);
  }
}

// ===== Status sub-tab: category cards + inline map actions =====

// Normalize the categories list response into a stable array, mirroring
// normalizeTournamentCategories from moderator.js.
function normalizeCategories(data) {
  const rows = Array.isArray(data?.categories)
    ? data.categories
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];

  return rows
    .filter((category) => category && category.id != null)
    .map((category) => ({
      ...category,
      id: Number(category.id),
      difficulties: Array.isArray(category.difficulties) ? category.difficulties : [],
    }));
}

// Extract the live cycle for a category from the already-loaded active cycles.
// renderEditionStrip uses flat cycle objects; renderTournamentOverview wraps
// them as { cycle }. Accept both so we work against whatever the API returns.
function liveCycleFor(cycles, categoryId) {
  if (!Array.isArray(cycles)) return null;
  const idStr = String(categoryId);
  const match = cycles.find((c) => {
    const cid = c?.category_id ?? c?.category?.id ?? c?.cycle?.category_id;
    return cid != null && String(cid) === idStr;
  });
  if (!match) return null;
  return match.cycle && typeof match.cycle === 'object' ? match.cycle : match;
}

// Try the common thumbnail field names; degrade to '' (no thumb) when absent.
function mapThumbnail(source) {
  if (!source || typeof source !== 'object') return '';
  return source.map_thumbnail || source.thumbnail_url || source.map_image || source.thumbnail || '';
}

// Pull the pending/next map out of a next-cycle response. The upstream shape is
// not strongly typed, so accept a flat object, a nested { cycle }, or a
// { next_cycle } envelope and read the common map fields.
function pendingMapFrom(data) {
  if (!data || typeof data !== 'object') return null;
  const node = (data.cycle && typeof data.cycle === 'object' && data.cycle)
    || (data.next_cycle && typeof data.next_cycle === 'object' && data.next_cycle)
    || data;
  const code = node.map_code ?? node.code ?? null;
  const name = node.map_name ?? node.name ?? null;
  const difficulty = node.map_difficulty ?? node.difficulty ?? null;
  const thumb = mapThumbnail(node);
  if (code == null && name == null && !thumb) return null;
  return { code, name, difficulty, thumb };
}

// Read a submission count from whatever field the live cycle exposes.
function submissionCountFrom(cycle) {
  if (!cycle || typeof cycle !== 'object') return null;
  const n = cycle.submission_count ?? cycle.submissions_count ?? cycle.submissions ?? null;
  return n == null ? null : n;
}

function difficultyBadges(difficulties) {
  if (!Array.isArray(difficulties) || !difficulties.length) {
    return '<span class="text-xs text-zinc-500 dark:text-zinc-400">No difficulties</span>';
  }
  return difficulties
    .filter(Boolean)
    .map((d) => `<span class="inline-flex items-center rounded-full border border-zinc-200/80 bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">${tournamentEscape(d)}</span>`)
    .join('');
}

// Render one card per category into [data-tournament-category-grid]. Live-cycle
// data is reused from the already-loaded active `cycles`; the pending/next map is
// fetched per card via GET {API}/categories/{id}/next-cycle (the only source for
// it). Locks are derived from the loaded active cycles (a category with a live
// cycle is in progress), mirroring refreshTournamentCategoryLocks.
async function renderCategoryCards(root, { config, edition, cycles }) {
  const grid = $('[data-tournament-category-grid]', root);
  if (!grid) return;

  let categories;
  try {
    const url = `${API}/categories`;
    const res = await DEPS.http('GET', url);
    DEPS.logActivity({ title: 'Tournament Categories (GET)', method: 'GET', url: res.url || url, ok: res.ok, status: res.status, data: res.data });
    if (!res.ok) {
      grid.innerHTML = `<div class="rounded-xl border border-dashed border-zinc-300/80 p-4 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">Failed to load tournament categories.</div>`;
      return;
    }
    categories = normalizeCategories(res.data);
  } catch (err) {
    DEPS.logActivity({ title: 'Tournament Categories error', method: 'ERROR', url: `${API}/categories`, ok: false, status: 'ERR', data: { message: String((err && err.message) || err) } });
    grid.innerHTML = `<div class="rounded-xl border border-dashed border-zinc-300/80 p-4 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">Failed to load tournament categories.</div>`;
    return;
  }

  if (!categories.length) {
    grid.innerHTML = `<div class="rounded-xl border border-dashed border-zinc-300/80 p-4 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">No tournament categories configured.</div>`;
    return;
  }

  // Pending/next map per card — the loaded active cycles only carry the LIVE
  // cycle, so the next map must come from next-cycle. Fetch in parallel; a
  // failed fetch degrades to "no pending map" rather than throwing.
  const pendingMaps = await Promise.all(
    categories.map(async (category) => {
      try {
        const url = `${API}/categories/${encodeURIComponent(category.id)}/next-cycle`;
        const res = await DEPS.http('GET', url);
        DEPS.logActivity({ title: `Tournament Next Cycle #${category.id} (GET)`, method: 'GET', url: res.url || url, ok: res.ok, status: res.status, data: res.data });
        return res.ok ? pendingMapFrom(res.data) : null;
      } catch (err) {
        DEPS.logActivity({ title: `Tournament Next Cycle #${category.id} error`, method: 'ERROR', url: `${API}/categories/${category.id}/next-cycle`, ok: false, status: 'ERR', data: { message: String((err && err.message) || err) } });
        return null;
      }
    })
  );

  grid.innerHTML = categories
    .map((category, i) => {
      const live = liveCycleFor(cycles, category.id);
      const pending = pendingMaps[i];
      const locked = !!live; // a category with a live active cycle is in progress

      const lockBadge = locked
        ? '<span class="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">Locked</span>'
        : '';

      const liveCode = live?.map_code || null;
      const liveDifficulty = live?.map_difficulty || null;
      const submissions = submissionCountFrom(live);

      const liveSection = live
        ? `
          <div class="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3 dark:border-emerald-400/15">
            <div class="mb-2 text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-300">Live cycle</div>
            <div class="min-w-0">
              <div class="truncate text-sm font-black">${tournamentEscape(live.map_name || 'No active map')}</div>
              <div class="mt-1 grid grid-cols-2 gap-2 text-xs">
                <div><span class="text-zinc-500 dark:text-zinc-400">Code</span> <span class="font-mono font-semibold">${tournamentEscape(liveCode || '-')}</span></div>
                <div><span class="text-zinc-500 dark:text-zinc-400">Difficulty</span> <span class="font-semibold">${tournamentEscape(liveDifficulty || '-')}</span></div>
                <div><span class="text-zinc-500 dark:text-zinc-400">Time left</span> <span class="font-semibold tabular-nums">${tournamentEscape(edition?.ends_at ? tournamentCountdownText(edition.ends_at) : '-')}</span></div>
                <div><span class="text-zinc-500 dark:text-zinc-400">Submissions</span> <span class="font-semibold tabular-nums">${tournamentEscape(submissions ?? '-')}</span></div>
              </div>
            </div>
          </div>`
        : `<div class="mt-3 rounded-xl border border-dashed border-zinc-300/80 p-3 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400">No live cycle for this category.</div>`;

      const pendingSection = pending
        ? `
          <div class="mt-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-3 dark:border-amber-400/15">
            <div class="mb-2 text-xs font-semibold uppercase text-amber-700 dark:text-amber-300">Pending / next map</div>
            <div class="min-w-0">
              <div class="truncate text-sm font-semibold">${tournamentEscape(pending.name || '-')}</div>
              <div class="text-xs"><span class="text-zinc-500 dark:text-zinc-400">Code</span> <span class="font-mono font-semibold">${tournamentEscape(pending.code || '-')}</span></div>
            </div>
          </div>`
        : `<div class="mt-2 rounded-xl border border-dashed border-zinc-300/80 p-3 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400">No pending map queued.</div>`;

      const btnBase = 'rounded-lg border border-zinc-200/80 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10';

      return `
        <article data-tournament-card data-category-id="${tournamentEscape(category.id)}" class="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-900/55">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="truncate text-base font-black">#${tournamentEscape(category.id)} - ${tournamentEscape(category.name || 'Unnamed')}</div>
              <div class="mt-1.5 flex flex-wrap items-center gap-1">${difficultyBadges(category.difficulties)}</div>
            </div>
            <div class="flex flex-col items-end gap-1">
              ${tournamentStatusPill(category.is_active ? 'active' : 'inactive')}
              ${lockBadge}
            </div>
          </div>

          ${liveSection}
          ${pendingSection}

          <div class="mt-3 flex flex-wrap gap-2">
            <button type="button" data-card-action="reroll-pending" class="${btnBase}">Reroll pending</button>
            <button type="button" data-card-action="random-select" class="${btnBase}">Random select</button>
            <button type="button" data-card-action="choose-map" class="${btnBase}">Choose explicit map</button>
            <div data-choose-map-input class="hidden flex w-full items-center gap-2">
              <input name="map_code" placeholder="MAP_CODE" class="min-w-0 flex-1 rounded-lg border border-zinc-200/80 bg-white px-3 py-1.5 text-sm uppercase focus:ring-2 focus:ring-emerald-500/60 focus:outline-none dark:border-white/10 dark:bg-zinc-900" />
              <button type="button" data-card-action="choose-map-submit" class="${btnBase}">Set map</button>
            </div>
            <button type="button" data-card-action="view-standings" class="${btnBase}">View standings</button>
            <button type="button" data-card-action="history" class="${btnBase}">History</button>
            <button type="button" data-card-action="reroll-active" class="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-500/15 dark:text-red-400">Reroll active</button>
          </div>
        </article>`;
    })
    .join('');
}

// Delegated card actions. The card id is read from [data-tournament-card] so no
// category id is ever typed. DEPS.http rejects on network failure, so the whole
// dispatch is wrapped to surface a toast + log entry rather than leak an
// unhandled rejection (same shape as wireEditionActions).
function wireCategoryActions(root) {
  root.addEventListener('click', (e) => {
    const btn = e.target?.closest?.('[data-card-action]');
    if (!btn || !root.contains(btn)) return;
    const card = btn.closest('[data-tournament-card]');
    const id = card?.dataset?.categoryId;
    if (!id) return;
    e.preventDefault();

    const action = btn.dataset.cardAction;
    const dispatch = () => {
      if (action === 'reroll-pending') return cardReroll(root, id);
      if (action === 'random-select') return cardSelect(root, id);
      if (action === 'choose-map') return toggleChooseInput(card);
      if (action === 'choose-map-submit') return cardChoose(root, card, id);
      if (action === 'view-standings') return openStandings(root, id);
      if (action === 'history') return openHistory(root, id);
      if (action === 'reroll-active') return cardRerollActive(root, id);
    };

    Promise.resolve().then(dispatch).catch((err) => {
      DEPS.toast('Unexpected error', 'err');
      DEPS.logActivity({ title: 'Tournament card action error', method: 'ERROR', url: '-', ok: false, status: 'ERR', data: { message: String((err && err.message) || err) } });
    });
  });
}

function toggleChooseInput(card) {
  const wrap = card.querySelector('[data-choose-map-input]');
  if (wrap) wrap.classList.toggle('hidden');
}

// POST {API_MODS}/categories/{id}/reroll — ports handleTournamentRerollMap.
async function cardReroll(root, id) {
  const url = `${API_MODS}/categories/${encodeURIComponent(id)}/reroll`;
  const res = await DEPS.http('POST', url, { body: {} });
  DEPS.logActivity({ title: `Tournament Reroll Pending #${id} (POST)`, method: 'POST', url: res.url || url, ok: res.ok, status: res.status, data: res.data });
  DEPS.toast(res.ok ? 'Pending map rerolled' : 'Failed to reroll pending map', res.ok ? 'ok' : 'err');
  await loadStatus(root, { force: true });
}

// POST {API_MODS}/categories/{id}/select-map — ports handleTournamentSelectMap.
async function cardSelect(root, id) {
  const url = `${API_MODS}/categories/${encodeURIComponent(id)}/select-map`;
  const res = await DEPS.http('POST', url, { body: {} });
  DEPS.logActivity({ title: `Tournament Select Map #${id} (POST)`, method: 'POST', url: res.url || url, ok: res.ok, status: res.status, data: res.data });
  DEPS.toast(res.ok ? 'Random map selected' : 'Failed to select map', res.ok ? 'ok' : 'err');
  await loadStatus(root, { force: true });
}

// PATCH {API_MODS}/categories/{id}/next-cycle with { map_code } —
// ports handleTournamentChooseMap (uppercased/trimmed, sourced from the card).
async function cardChoose(root, card, id) {
  const input = card.querySelector('[data-choose-map-input] input[name="map_code"]');
  const mapCode = String(input?.value || '').trim().toUpperCase();
  if (!mapCode) return DEPS.toast('map_code is required', 'warn');
  const url = `${API_MODS}/categories/${encodeURIComponent(id)}/next-cycle`;
  const res = await DEPS.http('PATCH', url, { body: { map_code: mapCode } });
  DEPS.logActivity({ title: `Tournament Choose Map #${id} (PATCH)`, method: 'PATCH', url: res.url || url, ok: res.ok, status: res.status, data: res.data });
  DEPS.toast(res.ok ? 'Pending map set' : 'Failed to set map', res.ok ? 'ok' : 'err');
  await loadStatus(root, { force: true });
}

// POST {API_MODS}/categories/{id}/reroll-active — ports handleTournamentRerollActive.
// Gated by the shared danger-confirm modal (wipes ALL submissions for the live cycle).
async function cardRerollActive(root, id) {
  const ok = await DEPS.showConfirmDanger({
    title: 'Reroll active cycle',
    message:
      'This wipes ALL submissions for the live cycle in this category and selects a new map.\n\n' +
      'The edition window stays the same, but every run players already submitted for the current map will be wiped. ' +
      'This cannot be undone. Continue?',
    confirm: 'Reroll active',
    cancel: 'Cancel',
  });
  if (!ok) return;

  const url = `${API_MODS}/categories/${encodeURIComponent(id)}/reroll-active`;
  const res = await DEPS.http('POST', url, { body: {} });
  DEPS.logActivity({ title: `Tournament Reroll Active #${id} (POST)`, method: 'POST', url: res.url || url, ok: res.ok, status: res.status, data: res.data });
  DEPS.toast(res.ok ? 'Active cycle rerolled' : 'Failed to reroll active cycle', res.ok ? 'ok' : 'err');
  await loadStatus(root, { force: true });
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
    };
    const handler = handlers[action];
    // DEPS.http rejects on network failure; surface a toast + log so a thrown
    // handler never becomes a silent unhandled rejection.
    if (handler) Promise.resolve().then(handler).catch((err) => {
      DEPS.toast('Unexpected error', 'err');
      DEPS.logActivity({ title: 'Tournament action error', method: 'ERROR', url: '-', ok: false, status: 'ERR', data: { message: String((err && err.message) || err) } });
    });
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

  // Always re-sync: even on 409/422 the server state may have moved.
  await loadStatus(root, { force: true });
}

async function tournamentSetPaused(root, paused) {
  const url = `${API_MODS}/pause`;
  const res = await DEPS.http('PATCH', url, { body: { paused } });
  DEPS.logActivity({ title: `Tournament ${paused ? 'Pause' : 'Resume'} (PATCH /pause)`, method: 'PATCH', url: res.url || url, ok: res.ok, status: res.status, data: res.data });

  if (res.ok) DEPS.toast(paused ? 'Auto-rotation paused' : 'Auto-rotation resumed', 'ok');
  else DEPS.toast('Failed to update rotation', 'err');

  // Always re-sync: even on a rejected change the server state may have moved.
  await loadStatus(root, { force: true });
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

  // Always re-sync: even on 409 the server state may have moved.
  await loadStatus(root, { force: true });
}

// ===== Inspection modal (standings / history / streak) =====
//
// One reusable overlay built on the shared modal shell. The read-only inspections
// (standings, history, streak) render readable TABLES — never a <pre> JSON dump —
// and default to the wider `lg` panel so tables breathe; the create-category form
// reuses the same helper at the standard `md` width. Callers append their content
// into the element they pass and mutate it in place (loading → table) while
// holding the returned node, on which `.close()` is exposed for programmatic
// dismissal (e.g. closing the form after a successful create).
function openOverlay(root, title, contentEl, { width = 'lg' } = {}) {
  const { overlay, close } = openModal({ title, body: contentEl, width });
  overlay.close = close;
  return overlay;
}

// Small DOM helpers for building content elements (no innerHTML JSON dumps).
function overlayInfo(message) {
  const el = document.createElement('div');
  el.className = 'rounded-xl border border-dashed border-zinc-300/80 p-4 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400';
  el.textContent = message;
  return el;
}

function overlayLoading() {
  return overlayInfo('Loading…');
}

// Read the first present field from an object, by candidate key list.
function pickField(obj, keys) {
  if (!obj || typeof obj !== 'object') return null;
  for (const k of keys) {
    if (obj[k] != null && obj[k] !== '') return obj[k];
  }
  return null;
}

// ----- Standings -----

// Resolve a category's active cycle id from the cached active cycles, then open
// standings for it. If the category has no active cycle, tell the user instead
// of fetching a bad URL.
async function openStandings(root, categoryId) {
  const live = liveCycleFor(lastActiveCycles, categoryId);
  const cycleId = live ? (live.id ?? live.cycle_id ?? null) : null;
  const categoryName = live?.category_name || `Category #${categoryId}`;
  const title = `Standings — ${categoryName}`;

  if (cycleId == null) {
    openOverlay(root, title, overlayInfo('This category has no active cycle, so there are no live standings to show.'));
    return;
  }
  await openStandingsForCycle(root, cycleId, title);
}

// Reusable standings view for an arbitrary cycle id (also used by History
// drill-in). GET /api/tournaments/cycles/{cycleId}/leaderboard.
async function openStandingsForCycle(root, cycleId, title) {
  const body = document.createElement('div');
  body.appendChild(overlayLoading());
  const overlay = openOverlay(root, title, body);

  const url = `${API}/cycles/${encodeURIComponent(cycleId)}/leaderboard`;
  let res;
  try {
    res = await DEPS.http('GET', url);
  } catch (err) {
    DEPS.logActivity({ title: `Tournament Leaderboard #${cycleId} error`, method: 'ERROR', url, ok: false, status: 'ERR', data: { message: String((err && err.message) || err) } });
    DEPS.toast('Failed to load standings', 'err');
    body.replaceChildren(overlayInfo('Failed to load standings.'));
    return overlay;
  }
  DEPS.logActivity({ title: `Tournament Leaderboard #${cycleId} (GET)`, method: 'GET', url: res.url || url, ok: res.ok, status: res.status, data: res.data });
  if (!res.ok) {
    DEPS.toast('Failed to load standings', 'err');
    body.replaceChildren(overlayInfo('Failed to load standings.'));
    return overlay;
  }

  body.replaceChildren(buildStandingsTable(res.data));
  return overlay;
}

// Normalize a leaderboard response into rows. The upstream shape is not strongly
// typed (proxied service), so accept the common envelopes + field names.
function standingsRows(data) {
  const rows = Array.isArray(data?.entries)
    ? data.entries
    : Array.isArray(data?.leaderboard)
      ? data.leaderboard
      : Array.isArray(data?.standings)
        ? data.standings
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];
  return rows;
}

function buildStandingsTable(data) {
  const rows = standingsRows(data);
  if (!rows.length) return overlayInfo('No standings yet for this cycle.');

  const trs = rows.map((row, i) => {
    const rank = pickField(row, ['rank', 'position', 'place']) ?? (i + 1);
    const player = pickField(row, ['player', 'player_name', 'name', 'username', 'user_name', 'display_name']) ?? '-';
    const score = pickField(row, ['time', 'time_formatted', 'score', 'value', 'result']) ?? '-';
    return `
      <tr class="border-t border-zinc-200/70 dark:border-white/10">
        <td class="py-2 pr-3 text-sm font-semibold tabular-nums">${tournamentEscape(rank)}</td>
        <td class="py-2 pr-3 text-sm">${tournamentEscape(player)}</td>
        <td class="py-2 text-right text-sm font-mono tabular-nums">${tournamentEscape(score)}</td>
      </tr>`;
  }).join('');

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <table class="w-full border-collapse text-left">
      <thead>
        <tr class="text-xs uppercase text-zinc-500 dark:text-zinc-400">
          <th class="py-2 pr-3 font-semibold">Rank</th>
          <th class="py-2 pr-3 font-semibold">Player</th>
          <th class="py-2 text-right font-semibold">Score / Time</th>
        </tr>
      </thead>
      <tbody>${trs}</tbody>
    </table>`;
  return wrap;
}

// ----- History (with filters) -----

const HISTORY_STATUSES = ['any', 'pending', 'active', 'finalizing', 'completed'];

// Build a content element with a status filter + limit input + results list,
// then fetch GET /api/tournaments/cycles?category_id=&status=&limit=. The
// category id comes from the card (never typed). Changing a filter re-fetches;
// clicking a row drills into standings for THAT cycle id.
function openHistory(root, categoryId) {
  const live = liveCycleFor(lastActiveCycles, categoryId);
  const categoryName = live?.category_name || `Category #${categoryId}`;

  const content = document.createElement('div');
  content.innerHTML = `
    <div class="mb-3 flex flex-wrap items-end gap-2">
      <label class="flex flex-col gap-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Status
        <select data-history-status class="rounded-lg border border-zinc-200/80 bg-white px-3 py-1.5 text-sm dark:border-white/10 dark:bg-zinc-900">
          ${HISTORY_STATUSES.map((s) => `<option value="${s}">${s}</option>`).join('')}
        </select>
      </label>
      <label class="flex flex-col gap-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Limit
        <input data-history-limit type="number" min="1" max="100" step="1" value="25" class="w-24 rounded-lg border border-zinc-200/80 bg-white px-3 py-1.5 text-sm dark:border-white/10 dark:bg-zinc-900" />
      </label>
    </div>
    <div data-history-results></div>`;

  const statusSel = $('[data-history-status]', content);
  const limitInput = $('[data-history-limit]', content);
  const results = $('[data-history-results]', content);

  // Per-overlay monotonic token: ignore any response superseded by a newer
  // fetch (filters can change faster than the network responds).
  let reqSeq = 0;
  const fetchRows = async () => {
    const mine = ++reqSeq;
    results.replaceChildren(overlayLoading());
    const query = { category_id: categoryId };
    const status = String(statusSel.value || 'any');
    if (status && status !== 'any') query.status = status;
    const limitRaw = String(limitInput.value || '').trim();
    if (limitRaw) {
      const n = Number(limitRaw);
      if (Number.isInteger(n) && n >= 1) query.limit = Math.min(n, 100);
    }

    const url = `${API}/cycles`;
    let res;
    try {
      res = await DEPS.http('GET', url, { query });
    } catch (err) {
      DEPS.logActivity({ title: `Tournament Cycle History #${categoryId} error`, method: 'ERROR', url, ok: false, status: 'ERR', data: { message: String((err && err.message) || err) } });
      if (mine !== reqSeq) return;
      DEPS.toast('Failed to load history', 'err');
      results.replaceChildren(overlayInfo('Failed to load history.'));
      return;
    }
    DEPS.logActivity({ title: `Tournament Cycle History #${categoryId} (GET)`, method: 'GET', url: res.url || url, ok: res.ok, status: res.status, data: res.data });
    if (!res.ok) {
      if (mine !== reqSeq) return;
      DEPS.toast('Failed to load history', 'err');
      results.replaceChildren(overlayInfo('Failed to load history.'));
      return;
    }
    if (mine !== reqSeq) return;
    results.replaceChildren(buildHistoryTable(root, res.data));
  };

  // Filters re-fetch.
  statusSel.addEventListener('change', () => { fetchRows().catch(() => {}); });
  limitInput.addEventListener('change', () => { fetchRows().catch(() => {}); });

  openOverlay(root, `History — ${categoryName}`, content);
  fetchRows().catch(() => {});
}

// Normalize a cycles list response into rows (same envelopes as fetchStatusData).
function historyRows(data) {
  return Array.isArray(data?.cycles)
    ? data.cycles
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];
}

// Render cycle rows as a table; each row drills into standings for its cycle id.
function buildHistoryTable(root, data) {
  const rows = historyRows(data);
  if (!rows.length) return overlayInfo('No cycles found for this filter.');

  const trs = rows.map((cycle) => {
    const cycleId = pickField(cycle, ['id', 'cycle_id']);
    const mapName = pickField(cycle, ['map_name', 'name']) || 'No map';
    const mapCode = pickField(cycle, ['map_code', 'code']) || '';
    const status = pickField(cycle, ['status']) || '-';
    const started = tournamentFormatDate(pickField(cycle, ['started_at', 'starts_at', 'created_at']));
    const ended = tournamentFormatDate(pickField(cycle, ['ended_at', 'ends_at', 'finalized_at', 'completed_at']));
    return `
      <tr data-history-row data-cycle-id="${tournamentEscape(cycleId ?? '')}" class="cursor-pointer border-t border-zinc-200/70 hover:bg-zinc-100/70 dark:border-white/10 dark:hover:bg-white/5">
        <td class="py-2 pr-3 text-sm font-mono tabular-nums">${tournamentEscape(cycleId ?? '-')}</td>
        <td class="py-2 pr-3 text-sm">
          <div class="truncate font-semibold">${tournamentEscape(mapName)}</div>
          <div class="truncate text-xs text-zinc-500 dark:text-zinc-400 font-mono">${tournamentEscape(mapCode)}</div>
        </td>
        <td class="py-2 pr-3">${tournamentStatusPill(status)}</td>
        <td class="py-2 text-xs text-zinc-500 dark:text-zinc-400">
          <div>${tournamentEscape(started)}</div>
          <div>→ ${tournamentEscape(ended)}</div>
        </td>
      </tr>`;
  }).join('');

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <table class="w-full border-collapse text-left">
      <thead>
        <tr class="text-xs uppercase text-zinc-500 dark:text-zinc-400">
          <th class="py-2 pr-3 font-semibold">Cycle</th>
          <th class="py-2 pr-3 font-semibold">Map</th>
          <th class="py-2 pr-3 font-semibold">Status</th>
          <th class="py-2 font-semibold">Window</th>
        </tr>
      </thead>
      <tbody>${trs}</tbody>
    </table>`;

  // Drill-in: clicking a row opens standings for that specific cycle id.
  wrap.addEventListener('click', (e) => {
    const tr = e.target?.closest?.('[data-history-row]');
    if (!tr) return;
    const cycleId = tr.dataset.cycleId;
    if (!cycleId) return;
    openStandingsForCycle(root, cycleId, `Standings — Cycle #${cycleId}`).catch((err) => {
      DEPS.toast('Failed to load standings', 'err');
      DEPS.logActivity({ title: 'Tournament standings drill-in error', method: 'ERROR', url: '-', ok: false, status: 'ERR', data: { message: String((err && err.message) || err) } });
    });
  });

  return wrap;
}

// ----- Streak lookup -----

// Wire the Status toolbar input [data-tournament-streak-search]. Bound once from
// init. The input is a numeric user id; on Enter (or autocomplete pick) we fetch
// GET /api/tournaments/streaks/{userId} and render a readable streak table.
function wireStreakLookup(root) {
  const input = $('[data-tournament-streak-search]', root);
  if (!input) return;

  // Reuse the shared users autocomplete; picking sets input.dataset.uid + label,
  // and we read the resolved id on submit. Pressing Enter on a typed id works too.
  //
  // Autocomplete registers its own keydown on `input` BEFORE ours, so on
  // Enter-to-pick its handler runs first and calls onPick (which opens the
  // overlay) synchronously. The flag below lets onPick claim that single open
  // and tells our own keydown (which fires right after, same dispatch) to bail.
  let pickJustOpened = false;
  if (DEPS.wireAutocomplete) {
    DEPS.wireAutocomplete(input, {
      kind: 'users',
      onPick: ({ id }) => {
        if (id == null) return;
        openStreak(root, id).catch(() => {});
        // Suppress the duplicate open from our keydown, which runs synchronously
        // right after this within the same event dispatch. Reset on the next
        // tick so a later, unrelated manual Enter is NOT suppressed.
        pickJustOpened = true;
        setTimeout(() => { pickJustOpened = false; }, 0);
      },
    });
  }

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    // onPick already opened the overlay for this Enter-to-pick selection; let it
    // be the single opener and bail so we don't double-open.
    if (pickJustOpened) return;
    // Otherwise resolve from a prior pick (dataset.uid) or the raw typed value
    // (must be a numeric user id).
    const uid = input.dataset.uid || String(input.value || '').trim();
    if (!/^\d{1,20}$/.test(String(uid))) {
      DEPS.toast('Enter a numeric user ID', 'warn');
      return;
    }
    e.preventDefault();
    openStreak(root, uid).catch((err) => {
      DEPS.toast('Failed to load streak', 'err');
      DEPS.logActivity({ title: 'Tournament streak error', method: 'ERROR', url: '-', ok: false, status: 'ERR', data: { message: String((err && err.message) || err) } });
    });
  });
}

async function openStreak(root, userId) {
  if (!/^\d{1,20}$/.test(String(userId))) {
    DEPS.toast('Enter a numeric user ID', 'warn');
    return;
  }

  const body = document.createElement('div');
  body.appendChild(overlayLoading());
  const overlay = openOverlay(root, `Streak — User #${userId}`, body);

  const url = `${API}/streaks/${encodeURIComponent(userId)}`;
  let res;
  try {
    res = await DEPS.http('GET', url);
  } catch (err) {
    DEPS.logActivity({ title: `Tournament Streak ${userId} error`, method: 'ERROR', url, ok: false, status: 'ERR', data: { message: String((err && err.message) || err) } });
    DEPS.toast('Failed to load streak', 'err');
    body.replaceChildren(overlayInfo('Failed to load streak.'));
    return overlay;
  }
  DEPS.logActivity({ title: `Tournament Streak ${userId} (GET)`, method: 'GET', url: res.url || url, ok: res.ok, status: res.status, data: res.data });
  if (res.status === 404) {
    body.replaceChildren(overlayInfo('No streak found for this user.'));
    return overlay;
  }
  if (!res.ok) {
    DEPS.toast('Failed to load streak', 'err');
    body.replaceChildren(overlayInfo('Failed to load streak.'));
    return overlay;
  }

  body.replaceChildren(buildStreakTable(res.data));
  return overlay;
}

function buildStreakTable(data) {
  const node = (data && typeof data === 'object' && data.streak && typeof data.streak === 'object')
    ? data.streak
    : (data && typeof data === 'object' ? data : {});

  // Read the common streak fields, degrading to '-' where absent.
  const fields = [
    ['Current streak', pickField(node, ['current_streak', 'current', 'streak', 'count'])],
    ['Longest streak', pickField(node, ['longest_streak', 'best_streak', 'max_streak', 'longest', 'best'])],
    ['Last participated', tournamentFormatDate(pickField(node, ['last_participated_at', 'last_cycle_at', 'last_active_at', 'updated_at']))],
  ];

  const hasAny = fields.some(([, v]) => v != null && v !== '-' && v !== '');
  if (!hasAny) return overlayInfo('No streak data for this user.');

  const trs = fields.map(([label, value]) => `
    <tr class="border-t border-zinc-200/70 dark:border-white/10">
      <td class="py-2 pr-3 text-sm text-zinc-500 dark:text-zinc-400">${tournamentEscape(label)}</td>
      <td class="py-2 text-right text-sm font-semibold tabular-nums">${tournamentEscape(value ?? '-')}</td>
    </tr>`).join('');

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <table class="w-full border-collapse text-left">
      <tbody>${trs}</tbody>
    </table>`;
  return wrap;
}

// ===== Setup sub-tab: category list + create/edit/delete =====
//
// Renders into [data-tournament-setup-mount]: a Create form (with XP repeaters)
// followed by a list of categories, each with inline Edit (expands an editable
// form with repeaters) and Delete. Locked categories (a cycle in progress) have
// Edit/Delete disabled and show a lock badge. Ports the category CRUD + XP
// repeater UI + payload assembly + lock derivation from moderator.js.

// The same difficulty options the original Blade form offered.
const TOURNAMENT_DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Very Hard', 'Extreme', 'Hell'];

// Category ids that currently have an active/finalizing cycle — PATCH/DELETE
// return 409 for these. Refreshed on every loadSetup.
let lockedSetupCategories = new Set();

// One-time flag so we delegate setup-mount listeners from the stable mount node
// exactly once, even though its innerHTML is replaced on each loadSetup.
let setupWired = false;

// Same one-time guard for the config-mount delegation (lives in its own mount).
let configWired = false;

const isDigits = (s) => /^\d+$/.test(String(s || ''));

function readJsonField(raw) {
  try {
    const v = JSON.parse(raw);
    if (v == null) return null;
    return v;
  } catch {
    return null;
  }
}

// ----- XP repeater (ported from moderator.js; data-tournament-xp-* hooks kept) -----

function tournamentXpConfig(kind) {
  return kind === 'streak'
    ? { key: 'threshold', keyLabel: 'Threshold', valueLabel: 'XP', addLabel: 'Add threshold / XP' }
    : { key: 'place', keyLabel: 'Place', valueLabel: 'XP', addLabel: 'Add place / XP' };
}

function tournamentDefaultXpRows(kind) {
  return kind === 'streak'
    ? [
        { threshold: 3, xp: 150 },
        { threshold: 5, xp: 300 },
      ]
    : [
        { place: 1, xp: 200 },
        { place: 2, xp: 100 },
        { place: 3, xp: 50 },
      ];
}

function normalizeTournamentXpRows(rows, kind) {
  const config = tournamentXpConfig(kind);
  return (Array.isArray(rows) ? rows : [])
    .map((row) => {
      const left = Number(row?.[config.key]);
      const xp = Number(row?.xp);
      if (!Number.isFinite(left) || !Number.isFinite(xp)) return null;
      return { [config.key]: left, xp };
    })
    .filter(Boolean);
}

function parseTournamentXpTextarea(textarea, kind) {
  const raw = String(textarea?.value || '').trim();
  if (!raw) return [];
  const parsed = readJsonField(raw);
  return normalizeTournamentXpRows(parsed, kind);
}

function tournamentXpRowHtml(kind, row = {}) {
  const config = tournamentXpConfig(kind);
  return `
    <div data-tournament-xp-row class="grid gap-2 rounded-xl border border-zinc-200/80 bg-white/70 p-3 dark:border-white/10 dark:bg-zinc-950/40 sm:grid-cols-[1fr_1fr_auto]">
      <label class="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
        ${tournamentEscape(config.keyLabel)}
        <input
          type="number"
          min="0"
          step="1"
          value="${tournamentEscape(row?.[config.key] ?? '')}"
          data-tournament-xp-field="${tournamentEscape(config.key)}"
          class="mt-1 w-full rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </label>
      <label class="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
        ${tournamentEscape(config.valueLabel)}
        <input
          type="number"
          min="0"
          step="1"
          value="${tournamentEscape(row?.xp ?? '')}"
          data-tournament-xp-field="xp"
          class="mt-1 w-full rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </label>
      <button
        type="button"
        data-tournament-xp-remove
        class="self-end rounded-lg border border-zinc-200/80 bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-200 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
      >
        Remove
      </button>
    </div>`;
}

// Collect repeater rows back into the hidden textarea as the JSON array the
// create/update payload expects: placement -> [{place,xp}], streak -> [{threshold,xp}].
function syncTournamentXpGroup(group) {
  if (!group) return;
  const form = group.closest?.('form');
  const textarea = form?.querySelector?.(`textarea[name="${CSS.escape(group.dataset.tournamentXpTarget || '')}"]`);
  if (!textarea) return;

  const config = tournamentXpConfig(group.dataset.tournamentXpKind || 'placement');
  const rows = Array.from(group.querySelectorAll('[data-tournament-xp-row]'))
    .map((row) => {
      const left = row.querySelector(`[data-tournament-xp-field="${CSS.escape(config.key)}"]`)?.value;
      const xp = row.querySelector('[data-tournament-xp-field="xp"]')?.value;
      if (left === '' && xp === '') return null;
      const leftNumber = Number(left);
      const xpNumber = Number(xp);
      if (!Number.isFinite(leftNumber) || !Number.isFinite(xpNumber)) return null;
      return { [config.key]: leftNumber, xp: xpNumber };
    })
    .filter(Boolean);

  textarea.value = rows.length ? JSON.stringify(rows, null, 2) : '';
}

function setTournamentXpGroupRows(group, targetName, rows) {
  const kind = targetName === 'streak_xp_json' ? 'streak' : 'placement';
  const normalized = normalizeTournamentXpRows(rows, kind);
  const rowMount = group.querySelector('[data-tournament-xp-rows]');
  if (rowMount) {
    rowMount.innerHTML = normalized.map((row) => tournamentXpRowHtml(kind, row)).join('');
  }
  syncTournamentXpGroup(group);
}

// Enhance each hidden placement_xp_json / streak_xp_json textarea inside `root`
// (a form) with a repeater UI. Click/input handling is delegated from the stable
// setup mount in wireSetup, so this only builds DOM — no per-form listeners.
function initTournamentXpRepeaters(root) {
  root.querySelectorAll('textarea[name="placement_xp_json"], textarea[name="streak_xp_json"]').forEach((textarea) => {
    if (textarea.dataset.tournamentXpEnhanced === '1') return;
    textarea.dataset.tournamentXpEnhanced = '1';

    const kind = textarea.name === 'streak_xp_json' ? 'streak' : 'placement';
    const config = tournamentXpConfig(kind);
    const group = document.createElement('div');
    group.dataset.tournamentXpGroup = '1';
    group.dataset.tournamentXpTarget = textarea.name;
    group.dataset.tournamentXpKind = kind;
    group.className = 'space-y-2';
    group.innerHTML = `
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">${tournamentEscape(config.keyLabel)} / XP</div>
          <div class="text-xs text-zinc-500 dark:text-zinc-400">Rows are converted to ${tournamentEscape(textarea.name)} automatically.</div>
        </div>
        <button
          type="button"
          data-tournament-xp-add
          class="rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-white/10"
        >
          ${tournamentEscape(config.addLabel)}
        </button>
      </div>
      <div data-tournament-xp-rows class="space-y-2"></div>
    `;

    textarea.classList.add('hidden');
    textarea.setAttribute('aria-hidden', 'true');
    const label = textarea.closest('label');
    const anchor = label || textarea;
    anchor.parentNode.insertBefore(group, anchor);
    if (label) label.classList.add('hidden');

    const initialRows = parseTournamentXpTextarea(textarea, kind);
    const defaults = root.dataset?.action === 'tournament-category-create'
      ? tournamentDefaultXpRows(kind)
      : [];
    setTournamentXpGroupRows(group, textarea.name, initialRows.length ? initialRows : defaults);
  });
}

function syncTournamentXpRepeaters(form) {
  form?.querySelectorAll?.('[data-tournament-xp-group]').forEach(syncTournamentXpGroup);
}

// Shared XP repeater click handling (add/remove rows + resync the hidden JSON).
// Used by the setup-mount delegation (for inline EDIT forms) AND by the create
// modal, so the repeater logic lives in exactly one place. Returns true when the
// event was an XP control (so callers can stop after handling it).
function handleTournamentXpClick(event) {
  const add = event.target?.closest?.('[data-tournament-xp-add]');
  if (add) {
    event.preventDefault();
    const group = add.closest('[data-tournament-xp-group]');
    const rows = group?.querySelector('[data-tournament-xp-rows]');
    if (!group || !rows) return true;
    rows.insertAdjacentHTML('beforeend', tournamentXpRowHtml(group.dataset.tournamentXpKind || 'placement', {}));
    syncTournamentXpGroup(group);
    return true;
  }
  const remove = event.target?.closest?.('[data-tournament-xp-remove]');
  if (remove) {
    event.preventDefault();
    const group = remove.closest('[data-tournament-xp-group]');
    remove.closest('[data-tournament-xp-row]')?.remove();
    syncTournamentXpGroup(group);
    return true;
  }
  return false;
}

// Shared XP repeater input handling: keep the hidden JSON textarea in sync as the
// user types into a row field. Shared between the setup mount and the create modal.
function handleTournamentXpInput(event) {
  const field = event.target?.closest?.('[data-tournament-xp-field]');
  if (!field) return false;
  syncTournamentXpGroup(field.closest('[data-tournament-xp-group]'));
  return true;
}

// ----- payload assembly (ported from buildTournamentCategoryPayload) -----

function tournamentOptionalNumber(fd, key, payload, { allowZero = true } = {}) {
  const raw = fd.get(key);
  if (raw === '' || raw == null) return true;
  const value = Number(raw);
  if (!Number.isFinite(value) || (!allowZero && value <= 0) || (allowZero && value < 0)) {
    DEPS.toast(`Invalid ${key}`, 'warn');
    return false;
  }
  payload[key] = value;
  return true;
}

function tournamentReadJsonArray(raw, label) {
  const text = String(raw || '').trim();
  if (!text) return undefined;
  const parsed = readJsonField(text);
  if (!Array.isArray(parsed)) {
    DEPS.toast(`${label} must be a JSON array`, 'err');
    return null;
  }
  return parsed;
}

// Build the create/update payload from a setup form. Mirrors the original
// buildTournamentCategoryPayload exactly: name + difficulties required on create,
// optional participation_xp / champion_role_id / is_active, and the XP JSON
// arrays collected from the repeaters. Returns null on a validation failure (a
// toast is already shown) so the caller aborts.
function buildTournamentCategoryPayload(form, { creating = false } = {}) {
  syncTournamentXpRepeaters(form);
  const fd = new FormData(form);
  const payload = {};

  const name = String(fd.get('name') || '').trim();
  if (name) payload.name = name;
  else if (creating) {
    DEPS.toast('name is required', 'warn');
    return null;
  }

  const difficulties = fd.getAll('difficulties[]').map((value) => String(value || '').trim()).filter(Boolean);
  if (difficulties.length) payload.difficulties = difficulties;
  else if (creating) {
    DEPS.toast('Pick at least one difficulty', 'warn');
    return null;
  }

  if (!tournamentOptionalNumber(fd, 'participation_xp', payload)) return null;

  const championRoleId = String(fd.get('champion_role_id') || '').trim();
  if (championRoleId === 'null') payload.champion_role_id = null;
  else if (championRoleId) {
    if (!isDigits(championRoleId)) {
      DEPS.toast('Invalid champion_role_id', 'warn');
      return null;
    }
    payload.champion_role_id = championRoleId;
  }

  const isActive = String(fd.get('is_active') || '');
  if (isActive === '1') payload.is_active = true;
  if (isActive === '0') payload.is_active = false;

  const placement = tournamentReadJsonArray(fd.get('placement_xp_json'), 'placement_xp');
  if (placement === null) return null;
  if (placement !== undefined) payload.placement_xp = placement;

  const streak = tournamentReadJsonArray(fd.get('streak_xp_json'), 'streak_xp');
  if (streak === null) return null;
  if (streak !== undefined) payload.streak_xp = streak;

  if (!Object.keys(payload).length) {
    DEPS.toast('Nothing to submit', 'warn');
    return null;
  }

  return payload;
}

// ----- lock derivation (ported from refreshTournamentCategoryLocks) -----

// Locked = a category with an active OR finalizing cycle. PATCH/DELETE return
// 409 for these, so we disable Edit/Delete up-front as well as handling the 409.
async function fetchLockedSetupCategories() {
  const activeUrl = `${API}/cycles`;
  const [active, finalizing] = await Promise.all([
    DEPS.http('GET', activeUrl, { query: { status: 'active', limit: 100 } }),
    DEPS.http('GET', activeUrl, { query: { status: 'finalizing', limit: 100 } }),
  ]);

  DEPS.logActivity({ title: 'Tournament Locks (active cycles GET)', method: 'GET', url: active.url || activeUrl, ok: active.ok, status: active.status, data: active.data });
  DEPS.logActivity({ title: 'Tournament Locks (finalizing cycles GET)', method: 'GET', url: finalizing.url || activeUrl, ok: finalizing.ok, status: finalizing.status, data: finalizing.data });

  const locked = new Set();
  [active, finalizing].forEach((res) => {
    const cycles = Array.isArray(res.data?.cycles)
      ? res.data.cycles
      : Array.isArray(res.data)
        ? res.data
        : [];
    cycles.forEach((cycle) => {
      const categoryId = cycle?.category_id ?? cycle?.category?.id;
      if (categoryId != null) locked.add(String(categoryId));
    });
  });
  return locked;
}

// ----- form markup -----

function difficultyCheckboxes(selected = []) {
  const set = new Set((Array.isArray(selected) ? selected : []).map((d) => String(d)));
  return TOURNAMENT_DIFFICULTIES.map((difficulty) => `
    <label class="flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/50 dark:bg-zinc-950/40 px-3 py-2 text-sm">
      <input type="checkbox" name="difficulties[]" value="${tournamentEscape(difficulty)}" class="accent-emerald-500" ${set.has(difficulty) ? 'checked' : ''} />
      <span>${tournamentEscape(difficulty)}</span>
    </label>`).join('');
}

const SETUP_INPUT_CLASS = 'mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none';

// The "Create category" trigger at the top of the Setup tab. Opens the create
// form in the module's slide-over (openCreateCategoryModal) instead of rendering
// the form inline. Click is delegated from the setup mount in wireSetup.
function setupCreateButtonHtml() {
  return `
    <article class="flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-zinc-100 p-6 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="font-semibold">Create category</h3>
        <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /api/mods/tournaments/categories</span>
      </div>
      <button type="button" data-tournament-create-open class="w-full shrink-0 cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100 sm:w-auto">Create category</button>
    </article>`;
}

// The create-category form markup, used inside the slide-over modal. Mirrors the
// original inline create form exactly (same fields, same data-action so the XP
// repeater + payload helpers behave identically); the modal wires its own submit.
function setupCreateFormHtml() {
  return `
    <form data-action="tournament-category-create" autocomplete="off" class="grid gap-3">
      <label class="text-sm">
        name
        <input name="name" required class="${SETUP_INPUT_CLASS}" />
      </label>
      <div class="grid gap-2 sm:grid-cols-3">${difficultyCheckboxes()}</div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="text-sm">
          participation_xp
          <input name="participation_xp" type="number" min="0" step="1" placeholder="0" class="${SETUP_INPUT_CLASS}" />
        </label>
        <label class="text-sm">
          champion_role_id
          <input name="champion_role_id" inputmode="numeric" placeholder="optional" class="${SETUP_INPUT_CLASS}" />
        </label>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="text-sm">
          placement_xp JSON
          <textarea name="placement_xp_json" rows="4" placeholder='[{"place":1,"xp":200}]' class="${SETUP_INPUT_CLASS} font-mono text-xs"></textarea>
        </label>
        <label class="text-sm">
          streak_xp JSON
          <textarea name="streak_xp_json" rows="4" placeholder='[{"threshold":5,"xp":300}]' class="${SETUP_INPUT_CLASS} font-mono text-xs"></textarea>
        </label>
      </div>
      <button type="submit" class="w-full sm:w-auto cursor-pointer rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-emerald-500 dark:text-white">Create</button>
    </form>`;
}

// Open the create-category form in the module's right-side slide-over (the same
// overlay used for standings/history/streak). The setup-mount delegation can't
// reach a form appended to <body>, so this wires the XP repeater interactions and
// the submit directly on the form element (reusing the SHARED handlers so the
// repeater/create logic is never duplicated).
function openCreateCategoryModal(root) {
  const content = document.createElement('div');
  content.innerHTML = setupCreateFormHtml();
  const form = content.querySelector('form[data-action="tournament-category-create"]');

  const overlay = openOverlay(root, 'Create category', content, { width: 'md' });

  // Enhance the XP textareas now that the form is in the DOM.
  if (form) {
    initTournamentXpRepeaters(form);

    // XP repeater add/remove + input, scoped to the modal form (the setup-mount
    // delegation does not see body-appended overlay events).
    form.addEventListener('click', (event) => { handleTournamentXpClick(event); });
    form.addEventListener('input', (event) => { handleTournamentXpInput(event); });

    // Submit creates the category via the shared create handler, then closes the
    // modal on success. 422 keeps the modal open (handleSetupCreate toasts).
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      Promise.resolve()
        .then(() => handleSetupCreate(root, form, { onSuccess: () => overlay.close() }))
        .catch((err) => {
          DEPS.toast('Unexpected error', 'err');
          DEPS.logActivity({ title: 'Tournament category submit error', method: 'ERROR', url: '-', ok: false, status: 'ERR', data: { message: String((err && err.message) || err) } });
        });
    });
  }
}

// Inline edit form for a single category, pre-filled. Hidden until Edit toggles
// it. is_active is a select (true/false/unchanged) matching the original form.
function setupEditFormHtml(category) {
  const placementJson = Array.isArray(category.placement_xp) && category.placement_xp.length
    ? JSON.stringify(category.placement_xp)
    : '';
  const streakJson = Array.isArray(category.streak_xp) && category.streak_xp.length
    ? JSON.stringify(category.streak_xp)
    : '';
  const championRole = category.champion_role_id == null ? '' : String(category.champion_role_id);
  const participation = category.participation_xp == null ? '' : String(category.participation_xp);
  const activeVal = category.is_active === true ? '1' : category.is_active === false ? '0' : '';

  return `
    <form data-action="tournament-category-update" data-category-id="${tournamentEscape(category.id)}" autocomplete="off" class="mt-3 grid gap-3 rounded-xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-950/40">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="text-sm">
          name
          <input name="name" value="${tournamentEscape(category.name ?? '')}" class="${SETUP_INPUT_CLASS}" />
        </label>
        <label class="text-sm">
          participation_xp
          <input name="participation_xp" type="number" min="0" step="1" value="${tournamentEscape(participation)}" class="${SETUP_INPUT_CLASS}" />
        </label>
        <label class="text-sm">
          is_active
          <select name="is_active" class="${SETUP_INPUT_CLASS}">
            <option value=""${activeVal === '' ? ' selected' : ''}>unchanged</option>
            <option value="1"${activeVal === '1' ? ' selected' : ''}>true</option>
            <option value="0"${activeVal === '0' ? ' selected' : ''}>false</option>
          </select>
        </label>
      </div>
      <div class="grid gap-2 sm:grid-cols-3">${difficultyCheckboxes(category.difficulties)}</div>
      <label class="text-sm">
        champion_role_id
        <input name="champion_role_id" inputmode="numeric" value="${tournamentEscape(championRole)}" placeholder="optional ('null' to clear)" class="${SETUP_INPUT_CLASS}" />
      </label>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="text-sm">
          placement_xp JSON
          <textarea name="placement_xp_json" rows="4" class="${SETUP_INPUT_CLASS} font-mono text-xs">${tournamentEscape(placementJson)}</textarea>
        </label>
        <label class="text-sm">
          streak_xp JSON
          <textarea name="streak_xp_json" rows="4" class="${SETUP_INPUT_CLASS} font-mono text-xs">${tournamentEscape(streakJson)}</textarea>
        </label>
      </div>
      <div class="flex flex-wrap gap-2">
        <button type="submit" class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Save changes</button>
        <button type="button" data-setup-action="cancel-edit" class="cursor-pointer rounded-xl border border-zinc-200/80 bg-white px-4 py-2 font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10">Cancel</button>
      </div>
    </form>`;
}

function setupCategoryRowHtml(category, locked) {
  const placementSummary = tournamentXpSummaryRows(category.placement_xp, 'place');
  const streakSummary = tournamentXpSummaryRows(category.streak_xp, 'threshold');
  const participation = category.participation_xp == null ? '-' : tournamentEscape(category.participation_xp);

  const lockBadge = locked
    ? `<span class="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
        <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V8H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm2.5 7V5.5a2.5 2.5 0 0 0-5 0V8h5Z" clip-rule="evenodd"></path></svg>
        Locked — cycle in progress
      </span>`
    : '';

  const disabledAttr = locked ? 'disabled' : '';
  const editBtnClass = locked
    ? 'cursor-not-allowed rounded-lg border border-zinc-200/80 bg-white/40 px-2.5 py-1.5 text-xs font-semibold text-zinc-400 dark:border-white/10 dark:bg-white/5 dark:text-zinc-500'
    : 'cursor-pointer rounded-lg border border-zinc-200/80 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10';
  const deleteBtnClass = locked
    ? 'cursor-not-allowed rounded-lg border border-red-500/20 bg-red-500/5 px-2.5 py-1.5 text-xs font-semibold text-red-400/60'
    : 'cursor-pointer rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-500/15 dark:text-red-400';

  return `
    <article data-setup-category data-category-id="${tournamentEscape(category.id)}" class="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-900/55">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <div class="truncate text-base font-black">#${tournamentEscape(category.id)} - ${tournamentEscape(category.name || 'Unnamed')}</div>
            ${tournamentStatusPill(category.is_active ? 'active' : 'inactive')}
            ${lockBadge}
          </div>
          <div class="mt-1.5 flex flex-wrap items-center gap-1">${difficultyBadges(category.difficulties)}</div>
          <dl class="mt-2 grid gap-x-4 gap-y-1 text-xs sm:grid-cols-3">
            <div><dt class="inline text-zinc-500 dark:text-zinc-400">Participation XP:</dt> <dd class="inline font-semibold">${participation}</dd></div>
            <div><dt class="inline text-zinc-500 dark:text-zinc-400">Placement XP:</dt> <dd class="inline font-semibold">${placementSummary}</dd></div>
            <div><dt class="inline text-zinc-500 dark:text-zinc-400">Streak XP:</dt> <dd class="inline font-semibold">${streakSummary}</dd></div>
          </dl>
        </div>
        <div class="flex shrink-0 gap-2">
          <button type="button" data-setup-action="edit" class="${editBtnClass}" ${disabledAttr} ${locked ? 'aria-disabled="true" title="Category is locked while a cycle is in progress"' : ''}>Edit</button>
          <button type="button" data-setup-action="delete" class="${deleteBtnClass}" ${disabledAttr} ${locked ? 'aria-disabled="true" title="Category is locked while a cycle is in progress"' : ''}>Delete</button>
        </div>
      </div>
      <div data-setup-edit-mount class="hidden"></div>
    </article>`;
}

// Render "place:xp / place:xp" style summary from a [{place|threshold, xp}] list.
function tournamentXpSummaryRows(rows, keyA) {
  if (!Array.isArray(rows) || !rows.length) return '-';
  return tournamentEscape(rows.map((row) => `${row?.[keyA] ?? '?'}:${row?.xp ?? '?'}`).join(' / '));
}

// ===== Setup sub-tab: global config card + gated debug cycle length =====
//
// Ports the old inline tournament global-config form + debug-cycle-length control
// from moderator.js into the dedicated Config mount. Reads via GET {API}/config,
// saves via PATCH {API_MODS}/config, and (in non-prod only) overrides the cycle
// length via PATCH {API_MODS}/debug-cycle-length. All wiring runs through the
// single configWired delegation on the stable config mount node.

const SETUP_CONFIG_FIELDS = ['blacklist_weeks', 'cadence', 'anchor_weekday', 'anchor_time', 'anchor_tz'];

// Builds the global-config card markup. The debug section renders only when the
// app is NOT running in production (mirrors the original env gate; the API itself
// returns 403 in prod). Server-controlled values are escaped at render time.
function setupConfigCardHtml(root, config) {
  const cfg = config && typeof config === 'object' ? config : {};
  const current = cfg.debug_cycle_seconds;

  let debug = '';
  if (!tournamentIsProdEnv(root)) {
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
          <input data-tournament-setup-debug-seconds type="number" min="1" step="1" placeholder="seconds" value="${current != null ? tournamentEscape(current) : ''}" class="min-w-0 flex-1 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500/60 focus:outline-none" />
          <button type="button" data-setup-debug-action="debug-set" class="cursor-pointer rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100">Set</button>
          <button type="button" data-setup-debug-action="debug-clear" class="cursor-pointer rounded-xl border border-zinc-200/80 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10">Clear override</button>
        </div>
      </details>`;
  }

  return `
    <section class="space-y-3">
      <h3 class="font-semibold">Global config</h3>
      <article class="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-900/55">
        <form data-action="tournament-config-update" autocomplete="off" class="grid gap-3 sm:grid-cols-2">
          <label class="text-sm">
            Cadence
            <select name="cadence" class="${SETUP_INPUT_CLASS}">
              <option value="">Leave unchanged</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option>
            </select>
            <span class="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">How often a new edition starts.</span>
          </label>
          <label class="text-sm">
            Rotation day
            <select name="anchor_weekday" class="${SETUP_INPUT_CLASS}">
              <option value="">Leave unchanged</option>
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </select>
            <span class="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">Day of week each edition rolls over.</span>
          </label>
          <label class="text-sm">
            Rotation time
            <input name="anchor_time" type="time" step="1" class="${SETUP_INPUT_CLASS}" />
            <span class="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">Wall-clock time in the timezone below (not UTC).</span>
          </label>
          <label class="text-sm">
            Timezone
            <input name="anchor_tz" type="text" list="tournamentSetupTimezoneOptions" autocomplete="off" spellcheck="false" placeholder="America/New_York" class="${SETUP_INPUT_CLASS}" />
            <datalist id="tournamentSetupTimezoneOptions"></datalist>
            <span class="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">Type to search IANA zones (e.g. America/Los_Angeles).</span>
          </label>
          <label class="text-sm sm:col-span-2">
            Blacklist window (weeks)
            <input name="blacklist_weeks" type="number" min="0" step="1" class="${SETUP_INPUT_CLASS}" />
            <span class="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">Number of weeks a map stays excluded after being used.</span>
          </label>
          <div class="sm:col-span-2">
            <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Save config</button>
          </div>
        </form>
        ${debug}
      </article>
    </section>`;
}

// Populate the config form fields from the fetched config (ports
// fillTournamentConfigForm: only assigns when the server value is non-null).
function fillSetupConfigForm(form, data) {
  if (!form || !data || typeof data !== 'object') return;
  SETUP_CONFIG_FIELDS.forEach((key) => {
    const el = form.querySelector(`[name="${CSS.escape(key)}"]`);
    if (el && data[key] != null) el.value = String(data[key]);
  });
}

// Fill the IANA timezone datalist from Intl.supportedValuesOf('timeZone'), with
// the same hardcoded fallback as the original populateTournamentTimezoneDatalist.
function populateSetupTimezoneDatalist(mount) {
  const datalist = mount.querySelector('#tournamentSetupTimezoneOptions');
  if (!datalist || datalist.dataset.filled === '1') return;

  let zones = [];
  try {
    zones = typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : [];
  } catch {
    zones = [];
  }
  if (!Array.isArray(zones) || !zones.length) {
    zones = [
      'UTC', 'America/Los_Angeles', 'America/Denver', 'America/Chicago', 'America/New_York',
      'America/Sao_Paulo', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow',
      'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney',
    ];
  }

  datalist.innerHTML = zones.map((zone) => `<option value="${tournamentEscape(zone)}"></option>`).join('');
  datalist.dataset.filled = '1';
}

// Build the config PATCH payload from the form (ports buildTournamentConfigPayload):
// optional numbers for blacklist_weeks/anchor_weekday, trimmed strings for the
// rest, and normalize HH:MM time to HH:MM:SS. Returns null (with a toast) when
// nothing is set to update.
function buildSetupConfigPayload(form) {
  const fd = new FormData(form);
  const payload = {};

  // Reuse the shared optional-number guard (rejects negatives, matching the
  // original tournamentOptionalNumber semantics) instead of a divergent local check.
  for (const key of ['blacklist_weeks', 'anchor_weekday']) {
    if (!tournamentOptionalNumber(fd, key, payload)) return null;
  }

  for (const key of ['cadence', 'anchor_time', 'anchor_tz']) {
    let value = String(fd.get(key) || '').trim();
    if (!value) continue;
    // Native <input type="time"> yields HH:MM (or HH:MM:SS with step). The API stores HH:MM:SS.
    if (key === 'anchor_time' && /^\d{2}:\d{2}$/.test(value)) value = `${value}:00`;
    payload[key] = value;
  }

  if (!Object.keys(payload).length) {
    DEPS.toast('Nothing to update', 'warn');
    return null;
  }

  return payload;
}

// PATCH {API_MODS}/config. On success refresh setup + invalidate the status board
// (config drives the Status edition strip), mirroring the category write handlers.
async function handleSetupConfigSave(root, form) {
  const payload = buildSetupConfigPayload(form);
  if (!payload) return;

  const url = `${API_MODS}/config`;
  const res = await DEPS.http('PATCH', url, { body: payload });
  DEPS.logActivity({ title: 'Tournament Config (PATCH)', method: 'PATCH', url: res.url || url, ok: res.ok, status: res.status, data: res.data });

  if (res.ok) {
    DEPS.toast('Config saved', 'ok');
    loaded.status = false;
    await loadConfig(root, { force: true });
  } else if (res.status === 422) {
    DEPS.toast(tournamentBootstrapError(res.data) || 'Validation failed', 'err');
  } else {
    DEPS.toast('Failed to save config', 'err');
  }
}

// PATCH {API_MODS}/debug-cycle-length. Non-prod only — the control is gated in
// the markup (Config sub-tab), and the API returns 403 in prod.
async function tournamentSetupSetDebugCycle(root, btn, { clear = false } = {}) {
  const card = btn.closest('article') || ROOT();
  const input = card?.querySelector('[data-tournament-setup-debug-seconds]');
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

  // Always re-sync: even on 403 the server state may have moved.
  loaded.status = false;
  await loadConfig(root, { force: true });
}

// ----- render + handlers -----

async function loadSetup(root, { force }) {
  if (loaded.setup && !force) return;
  const mount = $('[data-tournament-setup-mount]', root);
  if (!mount) return;

  wireSetup(root, mount);

  mount.innerHTML = '<div class="rounded-xl border border-dashed border-zinc-300/80 p-4 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">Loading categories…</div>';

  let categories;
  let locked;
  try {
    const url = `${API}/categories`;
    const [catRes, lockSet] = await Promise.all([
      DEPS.http('GET', url),
      fetchLockedSetupCategories(),
    ]);
    DEPS.logActivity({ title: 'Tournament Categories (GET)', method: 'GET', url: catRes.url || url, ok: catRes.ok, status: catRes.status, data: catRes.data });
    if (!catRes.ok) {
      loaded.setup = false;
      mount.innerHTML = '<div class="rounded-xl border border-dashed border-red-400/40 p-4 text-sm text-red-600 dark:text-red-400">Failed to load tournament categories.</div>';
      DEPS.toast('Failed to load tournament categories', 'err');
      return;
    }
    categories = normalizeCategories(catRes.data);
    locked = lockSet;
  } catch (err) {
    loaded.setup = false;
    DEPS.logActivity({ title: 'Tournament Setup load error', method: 'ERROR', url: `${API}/categories`, ok: false, status: 'ERR', data: { message: String((err && err.message) || err) } });
    mount.innerHTML = '<div class="rounded-xl border border-dashed border-red-400/40 p-4 text-sm text-red-600 dark:text-red-400">Failed to load tournament categories.</div>';
    DEPS.toast('Failed to load tournament categories', 'err');
    return;
  }

  lockedSetupCategories = locked;

  const list = categories.length
    ? categories.map((c) => setupCategoryRowHtml(c, locked.has(String(c.id)))).join('')
    : '<div class="rounded-xl border border-dashed border-zinc-300/80 p-4 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">No tournament categories yet.</div>';

  mount.innerHTML = `
    ${setupCreateButtonHtml()}
    <section class="space-y-3">
      <h3 class="font-semibold">Categories</h3>
      <div class="grid gap-3">${list}</div>
    </section>`;

  // Stash full category objects for inline-edit pre-fill (avoids re-fetch).
  mount._setupCategories = new Map(categories.map((c) => [String(c.id), c]));

  // The create form's XP repeaters are enhanced when the modal opens
  // (openCreateCategoryModal), not here — the create form is no longer inline.

  loaded.setup = true;
}

// ===== Config sub-tab: global config card + (non-prod) debug cycle control =====
//
// Renders into [data-tournament-config-mount]. Mirrors loadSetup's lifecycle:
// loaded-once guard (loaded.config), reset-to-false on error so a later visit
// retries. Fetches GET {API}/config, renders the global-config card + env-gated
// debug control, then populates the form + IANA timezone datalist.
async function loadConfig(root, { force }) {
  if (loaded.config && !force) return;
  const mount = $('[data-tournament-config-mount]', root);
  if (!mount) return;

  wireConfig(root);

  mount.innerHTML = '<div class="rounded-xl border border-dashed border-zinc-300/80 p-4 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">Loading config…</div>';

  let config = null;
  try {
    const configUrl = `${API}/config`;
    const configRes = await DEPS.http('GET', configUrl);
    DEPS.logActivity({ title: 'Tournament Config (GET)', method: 'GET', url: configRes.url || configUrl, ok: configRes.ok, status: configRes.status, data: configRes.data });
    if (!configRes.ok) {
      loaded.config = false;
      mount.innerHTML = '<div class="rounded-xl border border-dashed border-red-400/40 p-4 text-sm text-red-600 dark:text-red-400">Failed to load tournament config.</div>';
      DEPS.toast('Failed to load tournament config', 'err');
      return;
    }
    config = configRes.data && typeof configRes.data === 'object' ? configRes.data : null;
  } catch (err) {
    loaded.config = false;
    DEPS.logActivity({ title: 'Tournament Config load error', method: 'ERROR', url: `${API}/config`, ok: false, status: 'ERR', data: { message: String((err && err.message) || err) } });
    mount.innerHTML = '<div class="rounded-xl border border-dashed border-red-400/40 p-4 text-sm text-red-600 dark:text-red-400">Failed to load tournament config.</div>';
    DEPS.toast('Failed to load tournament config', 'err');
    return;
  }

  mount.innerHTML = setupConfigCardHtml(root, config);

  // Populate the global-config form fields + IANA timezone datalist.
  const configForm = mount.querySelector('form[data-action="tournament-config-update"]');
  if (configForm) fillSetupConfigForm(configForm, config);
  populateSetupTimezoneDatalist(mount);

  loaded.config = true;
}

// Delegate config-mount interactions (config form submit + debug set/clear) from
// the stable config mount node, wired exactly once. Calls the same handlers the
// Setup mount used to. The mount's innerHTML is replaced on each loadConfig, but
// the listeners live on the mount, so they never stack across re-renders.
function wireConfig(root) {
  if (configWired) return;
  const mount = $('[data-tournament-config-mount]', root);
  if (!mount) return;
  configWired = true;

  // Debug cycle-length set/clear (non-prod only — buttons render only off-prod).
  mount.addEventListener('click', (event) => {
    const btn = event.target?.closest?.('[data-setup-debug-action]');
    if (!btn || !mount.contains(btn)) return;
    event.preventDefault();
    const clear = btn.dataset.setupDebugAction === 'debug-clear';
    Promise.resolve().then(() => tournamentSetupSetDebugCycle(root, btn, { clear })).catch((err) => {
      DEPS.toast('Unexpected error', 'err');
      DEPS.logActivity({ title: 'Tournament debug cycle error', method: 'ERROR', url: '-', ok: false, status: 'ERR', data: { message: String((err && err.message) || err) } });
    });
  });

  // Config form submit.
  mount.addEventListener('submit', (event) => {
    const form = event.target?.closest?.('form[data-action="tournament-config-update"]');
    if (!form || !mount.contains(form)) return;
    event.preventDefault();
    Promise.resolve().then(() => handleSetupConfigSave(root, form)).catch((err) => {
      DEPS.toast('Unexpected error', 'err');
      DEPS.logActivity({ title: 'Tournament config submit error', method: 'ERROR', url: '-', ok: false, status: 'ERR', data: { message: String((err && err.message) || err) } });
    });
  });
}

// Delegate ALL setup-mount interactions (XP add/remove/input, row actions, form
// submits) from the stable mount node, wired exactly once. The mount's innerHTML
// is replaced on each loadSetup, but the listeners live on the mount itself, so
// they never stack across re-renders.
function wireSetup(root, mount) {
  if (setupWired) return;
  setupWired = true;

  // XP repeater add/remove (shared with the create modal).
  mount.addEventListener('click', (event) => { handleTournamentXpClick(event); });

  // XP repeater field edits keep the hidden JSON textarea in sync.
  mount.addEventListener('input', (event) => { handleTournamentXpInput(event); });

  // Open the create-category modal (the inline create form has moved into a
  // slide-over for visual consistency with standings/history).
  mount.addEventListener('click', (event) => {
    const open = event.target?.closest?.('[data-tournament-create-open]');
    if (!open || !mount.contains(open)) return;
    event.preventDefault();
    try {
      openCreateCategoryModal(root);
    } catch (err) {
      DEPS.toast('Unexpected error', 'err');
      DEPS.logActivity({ title: 'Tournament create-category modal error', method: 'ERROR', url: '-', ok: false, status: 'ERR', data: { message: String((err && err.message) || err) } });
    }
  });

  // Row actions: edit (expand inline form), cancel-edit (collapse), delete.
  mount.addEventListener('click', (event) => {
    const btn = event.target?.closest?.('[data-setup-action]');
    if (!btn || !mount.contains(btn)) return;
    const action = btn.dataset.setupAction;
    const card = btn.closest('[data-setup-category]');
    const id = card?.dataset?.categoryId;

    if (action === 'edit') {
      event.preventDefault();
      if (btn.disabled || lockedSetupCategories.has(String(id))) return;
      toggleSetupEdit(mount, card, id);
      return;
    }
    if (action === 'cancel-edit') {
      event.preventDefault();
      const editMount = card?.querySelector('[data-setup-edit-mount]');
      if (editMount) { editMount.innerHTML = ''; editMount.classList.add('hidden'); }
      return;
    }
    if (action === 'delete') {
      event.preventDefault();
      if (btn.disabled || lockedSetupCategories.has(String(id))) return;
      Promise.resolve().then(() => handleSetupDelete(root, id)).catch((err) => {
        DEPS.toast('Unexpected error', 'err');
        DEPS.logActivity({ title: 'Tournament category delete error', method: 'ERROR', url: '-', ok: false, status: 'ERR', data: { message: String((err && err.message) || err) } });
      });
    }
  });

  // Form submits: update only. (Create now submits from the modal; the global
  // config submit is handled separately on the config mount via wireConfig.)
  mount.addEventListener('submit', (event) => {
    const form = event.target?.closest?.('form[data-action]');
    if (!form || !mount.contains(form)) return;
    event.preventDefault();
    const action = form.dataset.action;
    const run = action === 'tournament-category-update'
      ? () => handleSetupUpdate(root, form)
      : null;
    if (!run) return;
    Promise.resolve().then(run).catch((err) => {
      DEPS.toast('Unexpected error', 'err');
      DEPS.logActivity({ title: 'Tournament category submit error', method: 'ERROR', url: '-', ok: false, status: 'ERR', data: { message: String((err && err.message) || err) } });
    });
  });
}

// Expand/collapse the inline edit form for a category row.
function toggleSetupEdit(mount, card, id) {
  const editMount = card?.querySelector('[data-setup-edit-mount]');
  if (!editMount) return;
  if (!editMount.classList.contains('hidden') && editMount.innerHTML.trim()) {
    editMount.innerHTML = '';
    editMount.classList.add('hidden');
    return;
  }
  const category = mount._setupCategories?.get(String(id));
  if (!category) return;
  editMount.innerHTML = setupEditFormHtml(category);
  editMount.classList.remove('hidden');
  const form = editMount.querySelector('form[data-action="tournament-category-update"]');
  if (form) initTournamentXpRepeaters(form);
}

// POST {API_MODS}/categories. On success refresh setup + invalidate the status
// board so it reflects the new category.
async function handleSetupCreate(root, form, { onSuccess } = {}) {
  const payload = buildTournamentCategoryPayload(form, { creating: true });
  if (!payload) return;
  const url = `${API_MODS}/categories`;
  const res = await DEPS.http('POST', url, { body: payload });
  DEPS.logActivity({ title: 'Create Tournament Category (POST)', method: 'POST', url: res.url || url, ok: res.ok, status: res.status, data: res.data });

  if (res.ok) {
    DEPS.toast('Category created', 'ok');
    loaded.status = false;
    // Close the modal first so the slide-over disappears before the list refresh.
    if (typeof onSuccess === 'function') onSuccess();
    await loadSetup(root, { force: true });
  } else if (res.status === 422) {
    DEPS.toast(tournamentBootstrapError(res.data) || 'Validation failed', 'err');
  } else {
    DEPS.toast('Failed to create category', 'err');
  }
}

// PATCH {API_MODS}/categories/{id}. Reads the id from the form's data attribute
// (the row it belongs to). 409 means the category locked since render — toast +
// refresh to re-derive locks.
async function handleSetupUpdate(root, form) {
  const id = form.dataset.categoryId;
  if (!id) return;
  const payload = buildTournamentCategoryPayload(form);
  if (!payload) return;
  const url = `${API_MODS}/categories/${encodeURIComponent(id)}`;
  const res = await DEPS.http('PATCH', url, { body: payload });
  DEPS.logActivity({ title: `Update Tournament Category #${id} (PATCH)`, method: 'PATCH', url: res.url || url, ok: res.ok, status: res.status, data: res.data });

  if (res.ok) {
    DEPS.toast('Category updated', 'ok');
    loaded.status = false;
    await loadSetup(root, { force: true });
  } else if (res.status === 409) {
    DEPS.toast('Category is locked while a cycle is in progress', 'warn');
    loaded.status = false;
    await loadSetup(root, { force: true });
  } else if (res.status === 422) {
    DEPS.toast(tournamentBootstrapError(res.data) || 'Validation failed', 'err');
  } else {
    DEPS.toast('Failed to update category', 'err');
  }
}

// DELETE {API_MODS}/categories/{id}, gated by the shared danger-confirm modal.
// 409 means it locked since render — toast + refresh.
async function handleSetupDelete(root, id) {
  if (!id) return;
  const ok = await DEPS.showConfirmDanger({
    title: 'Delete category',
    message: 'This permanently deletes the tournament category. This cannot be undone. Continue?',
    confirm: 'Delete category',
    cancel: 'Cancel',
  });
  if (!ok) return;

  const url = `${API_MODS}/categories/${encodeURIComponent(id)}`;
  const res = await DEPS.http('DELETE', url);
  DEPS.logActivity({ title: `Delete Tournament Category #${id} (DELETE)`, method: 'DELETE', url: res.url || url, ok: res.ok, status: res.status, data: res.data });

  if (res.ok) {
    DEPS.toast('Category deleted', 'ok');
    loaded.status = false;
    await loadSetup(root, { force: true });
  } else if (res.status === 409) {
    DEPS.toast('Category is locked while a cycle is in progress', 'warn');
    loaded.status = false;
    await loadSetup(root, { force: true });
  } else {
    DEPS.toast('Failed to delete category', 'err');
  }
}
