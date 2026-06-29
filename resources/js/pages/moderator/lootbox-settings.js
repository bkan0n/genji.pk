import { $, $$, skel, withBusy, httpErrorMessage } from './workspace-shell.js';
import { mountGallery } from './lootbox-gallery.js';

const KEY_TYPES = ['Classic', 'Winter', 'Spring', 'Autumn', 'Summer'];
let DEPS = null;

const esc = (s = '') =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );

// Skeleton mirroring the gallery's loaded shape (search bar + grouped tile grids),
// so the swap to real content doesn't shift the layout.
function gallerySkeleton() {
  const tiles = (min, ratio, n) =>
    `<div class="grid gap-3" style="grid-template-columns:repeat(auto-fill,minmax(${min}px,1fr))">${`<div class="overflow-hidden rounded-xl" style="aspect-ratio:${ratio}">${skel('h-full w-full rounded-xl')}</div>`.repeat(
      n
    )}</div>`;
  return `<div class="space-y-4">
    ${skel('h-9 w-full rounded-xl')}
    <div class="space-y-6">
      <div class="space-y-2.5">${skel('h-3 w-16')}${tiles(104, '1 / 1', 8)}</div>
      <div class="space-y-2.5">${skel('h-3 w-24')}${tiles(232, '16 / 9', 3)}</div>
    </div>
  </div>`;
}

export function initLootboxSettings(deps) {
  DEPS = deps;
  const mount = $('[data-lootbox-settings]');
  if (!mount) return;
  mount.innerHTML = `
    <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 p-4 sm:p-5">
      <h3 class="text-sm font-semibold">Active key type</h3>
      <div data-st-active class="mt-2 text-sm text-zinc-500">${skel('h-4 w-32')}</div>
      <div class="mt-3 flex flex-wrap items-end gap-2">
        <select data-st-key aria-label="Active key type" class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm">
          ${KEY_TYPES.map((k) => `<option value="${k}">${k}</option>`).join('')}
        </select>
        <button data-st-key-save type="button" class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-white shadow-sm cursor-pointer hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">Set active</button>
      </div>
    </div>

    <div data-st-boost-card data-mod-hydrating="1" class="xpb-card mt-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 p-4 sm:p-5" style="--xpb-t:0;--xpb-fill:0%">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-sm font-semibold">XP multiplier</h3>
        <span data-st-status class="xpb-status" hidden></span>
      </div>

      <div class="mt-3 flex items-end justify-between gap-4">
        <p data-st-boost class="xpb-value" aria-hidden="true">—</p>
        <div class="min-w-0 text-right">
          <div data-st-consequence class="text-xs leading-snug text-zinc-600 dark:text-zinc-300">${skel('h-3 w-44')}</div>
          <p data-st-delta class="mt-1 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">&nbsp;</p>
        </div>
      </div>

      <div class="mt-4">
        <input data-st-track type="range" min="1" max="10" step="0.1" disabled aria-label="XP multiplier (1 to 10)" class="xpb-range" />
        <div class="mt-1 flex justify-between text-[10px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          <span>1× · standard</span><span>10× · max</span>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap items-end gap-x-2 gap-y-3">
        <div data-st-chips class="flex flex-wrap gap-1.5">
          ${[1, 1.5, 2, 3, 5].map((v) => `<button data-st-chip data-val="${v}" type="button" disabled class="xpb-chip">${v}×</button>`).join('')}
        </div>
        <div class="ml-auto flex items-end gap-2">
          <label class="flex flex-col gap-1">
            <span class="text-[10px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Exact</span>
            <input data-st-mult type="number" min="1" max="10" step="0.1" disabled aria-label="XP multiplier exact value (1 to 10)" class="w-16 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-2.5 py-2 text-sm tabular-nums" />
          </label>
          <button data-st-mult-save type="button" disabled class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-white shadow-sm cursor-pointer transition hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-emerald-600">Apply</button>
        </div>
      </div>
      <div data-st-mult-cur class="sr-only" aria-live="polite"></div>
    </div>

    <div class="mt-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 p-4 sm:p-5">
      <h3 class="text-sm font-semibold">Reward catalog</h3>
      <div data-st-cat-body class="mt-3">${gallerySkeleton()}</div>
    </div>`;

  $('[data-st-key-save]', mount).onclick = (e) =>
    withBusy(e.currentTarget, () => setActiveKey(mount));
  $('[data-st-mult-save]', mount).onclick = (e) =>
    // withBusy re-enables the button in its finally; re-assert our own state so
    // Apply stays disabled when the dialed value now matches what's live.
    withBusy(e.currentTarget, () => setMultiplier(mount)).then(() => refreshApplyState(mount));
  wireBoost(mount);

  // Lazy-load the three settings endpoints only when the Lootbox → Config
  // sub-tab is first entered. Loading them in init would hit the API on every
  // page load even when the Lootbox tab is never opened.
  let loaded = false;
  const loadOnce = () => {
    if (loaded) return;
    loaded = true;
    loadActiveKey(mount);
    loadMultiplier(mount);
    loadCatalog(mount);
  };

  const panel = document.querySelector('.mod-panel[data-panel="lootbox"]');
  panel?.addEventListener('click', (e) => {
    if (e.target.closest('.mod-subtab[data-subtab="lootbox-settings"]')) loadOnce();
  });

  // Deep-link case: the Settings sub-tab is already visible when init runs.
  const sub = panel?.querySelector('[data-subpanel="lootbox-settings"]');
  if (sub && !sub.classList.contains('hidden')) loadOnce();
}

async function loadActiveKey(mount) {
  const cur = $('[data-st-active]', mount);
  cur.innerHTML = skel('h-4 w-32');
  try {
    // The active key type is part of the store config (same source the public
    // key shop reads), not the lootbox/keys endpoint.
    const { ok, status, url, data } = await DEPS.http('GET', '/api/mods/store/config');
    DEPS.logActivity({
      title: 'Get store config (active key)',
      method: 'GET',
      url,
      ok,
      status,
      data,
    });
    if (!ok) return (cur.textContent = httpErrorMessage(status, { noun: 'the active key type' }));
    const active = data?.active_key_type || data?.data?.active_key_type || null;
    if (active) {
      cur.innerHTML = `Current: <span class="font-semibold text-zinc-800 dark:text-zinc-100">${esc(active)}</span>`;
      if (KEY_TYPES.includes(active)) $('[data-st-key]', mount).value = active;
    } else {
      cur.textContent = 'No active key type set.';
    }
  } catch {
    cur.textContent = httpErrorMessage(0);
  }
}

async function setActiveKey(mount) {
  const key = $('[data-st-key]', mount).value;
  if (!key) return DEPS.toast('Pick a key type', 'warn');
  const confirmed = await DEPS.showConfirmDanger({
    title: 'Set active key type',
    message: `Set the active key type to ${esc(key)}?\n\nThis changes what the public key shop sells.`,
    confirm: 'Set active',
    cancel: 'Cancel',
  });
  if (!confirmed) return;
  const { ok, status, url, data } = await DEPS.http(
    'PATCH',
    `/api/lootbox/keys/${encodeURIComponent(key)}`
  );
  DEPS.logActivity({ title: 'Set active key type', method: 'PATCH', url, ok, status, data });
  DEPS.toast(ok ? 'Active key type updated' : 'Failed', ok ? 'ok' : 'err');
  if (ok) loadActiveKey(mount);
}

// ── XP boost control ────────────────────────────────────────────────────────
// The multiplier is a community-wide lever, so the moderator should *feel* its
// weight: the value glows hotter as it climbs (calm at 1×, charged at 10×), the
// consequence is spelled out in plain language, and the delta from the live
// value tells them exactly how big a change they're about to push.
const MULT_MIN = 1;
const MULT_MAX = 10;

// Module state for the boost card: the value the moderator is dialing vs. the
// value currently live on the server. Apply is only meaningful when they differ.
const boost = { value: MULT_MIN, saved: null, ready: false };

const fmtMult = (v) => String(Math.round(v * 10) / 10);
const clampMult = (v) => Math.min(MULT_MAX, Math.max(MULT_MIN, v));

function wireBoost(mount) {
  const track = $('[data-st-track]', mount);
  const num = $('[data-st-mult]', mount);
  const chips = $('[data-st-chips]', mount);

  // Drag the slider → live preview (no round-trip).
  track.addEventListener('input', () => applyBoostValue(mount, +track.value, { from: track }));
  // Precise entry: reflect while typing, snap to a valid value on commit.
  num.addEventListener('input', () => {
    const v = +num.value;
    if (Number.isFinite(v)) applyBoostValue(mount, v, { from: num, clamp: false });
  });
  num.addEventListener('change', () =>
    applyBoostValue(mount, clampMult(+num.value || MULT_MIN), { from: null })
  );
  // Preset chips: one tap to a common multiplier.
  chips.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-st-chip]');
    if (chip) applyBoostValue(mount, +chip.dataset.val, { from: null });
  });
}

// Single source of truth: push `value` into every control + the glow/consequence.
function applyBoostValue(mount, value, { from = null, clamp = true } = {}) {
  if (!Number.isFinite(value)) return;
  const v = clamp ? clampMult(value) : value;
  boost.value = v;
  const inRange = v >= MULT_MIN && v <= MULT_MAX;
  const display = clampMult(v); // glow/fill/slider stay sane even if the typed number is out of range

  const card = $('[data-st-boost-card]', mount);
  const t = (display - MULT_MIN) / (MULT_MAX - MULT_MIN); // 0…1 → glow intensity
  card.style.setProperty('--xpb-t', t.toFixed(3));
  card.style.setProperty('--xpb-fill', `${(t * 100).toFixed(1)}%`);

  $('[data-st-boost]', mount).innerHTML = `${fmtMult(v)}<span class="xpb-x">×</span>`;

  // Keep the controls the user *isn't* touching in sync.
  const track = $('[data-st-track]', mount);
  const num = $('[data-st-mult]', mount);
  if (from !== track) track.value = display;
  if (from !== num) num.value = fmtMult(v);

  // Status pill: a >1 multiplier is a live, community-wide XP event.
  const status = $('[data-st-status]', mount);
  if (display > 1) {
    status.hidden = false;
    status.dataset.live = '1';
    status.textContent = 'Boost live';
  } else {
    status.hidden = false;
    status.dataset.live = '0';
    status.textContent = 'Standard rate';
  }

  // Highlight the matching preset chip (if any).
  $$('[data-st-chip]', mount).forEach((c) => c.classList.toggle('is-active', +c.dataset.val === v));

  // Plain-language consequence + delta from what's currently live.
  const conseq = $('[data-st-consequence]', mount);
  const delta = $('[data-st-delta]', mount);
  if (!inRange) {
    conseq.innerHTML = `Enter a value between <b>${MULT_MIN}</b> and <b>${MULT_MAX}</b>.`;
    delta.textContent = ' ';
  } else {
    conseq.innerHTML =
      v > 1
        ? `Every lootbox awards <b class="text-zinc-800 dark:text-zinc-100">${fmtMult(v)}×</b> its base XP.`
        : `Lootboxes award their <b class="text-zinc-800 dark:text-zinc-100">base</b> XP — no boost.`;
    if (boost.saved == null) {
      delta.textContent = ' ';
    } else if (v === boost.saved) {
      delta.textContent = 'Currently live';
      delta.className = 'mt-1 text-[11px] font-medium text-zinc-400 dark:text-zinc-500';
    } else {
      const diff = Math.round((v - boost.saved) * 10) / 10;
      const up = diff > 0;
      delta.textContent = `${up ? '▲' : '▼'} ${up ? '+' : ''}${fmtMult(diff)} from live ${fmtMult(boost.saved)}×`;
      delta.className =
        'mt-1 text-[11px] font-medium ' +
        (up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400');
    }
  }

  refreshApplyState(mount, inRange);
}

// Apply is enabled only when the dialed value is valid AND differs from live.
function refreshApplyState(mount, inRange = true) {
  const save = $('[data-st-mult-save]', mount);
  if (!save) return;
  const changed = boost.saved == null || boost.value !== boost.saved;
  save.disabled = !boost.ready || !inRange || !changed;
}

function setBoostEnabled(mount, on) {
  ['[data-st-track]', '[data-st-mult]'].forEach((sel) => {
    const el = $(sel, mount);
    if (el) el.disabled = !on;
  });
  $$('[data-st-chip]', mount).forEach((c) => (c.disabled = !on));
}

async function loadMultiplier(mount) {
  const cur = $('[data-st-mult-cur]', mount);
  const conseq = $('[data-st-consequence]', mount);
  conseq.innerHTML = skel('h-3 w-44');
  setBoostEnabled(mount, false);
  boost.ready = false;
  refreshApplyState(mount, false);
  try {
    const { ok, status, url, data } = await DEPS.http('GET', '/api/lootbox/xp/multiplier');
    DEPS.logActivity({ title: 'Get XP multiplier', method: 'GET', url, ok, status, data });
    let value = null;
    if (data && typeof data === 'object' && 'value' in data) value = data.value;
    else if (typeof data === 'string' && data.trim() !== '' && !Number.isNaN(+data)) value = +data;
    if (!ok) {
      conseq.textContent = httpErrorMessage(status, { noun: 'the XP multiplier' });
      return;
    }
    boost.saved = value != null ? clampMult(+value) : null;
    boost.ready = true;
    setBoostEnabled(mount, true);
    applyBoostValue(mount, boost.saved != null ? boost.saved : MULT_MIN, { from: null });
    cur.textContent =
      boost.saved != null
        ? `Current XP multiplier: ${fmtMult(boost.saved)}×`
        : 'XP multiplier loaded.';
  } catch {
    conseq.textContent = httpErrorMessage(0);
  } finally {
    // Reveal the slider/number once the real value is applied — the skeleton
    // gate keeps it from flashing the range's default midpoint thumb first.
    $('[data-st-boost-card]', mount)?.removeAttribute('data-mod-hydrating');
  }
}

async function setMultiplier(mount) {
  const value = boost.value;
  if (!Number.isFinite(value) || value < MULT_MIN || value > MULT_MAX)
    return DEPS.toast('Value must be between 1 and 10', 'warn');
  const { ok, status, url, data } = await DEPS.http('POST', '/api/lootbox/xp/multiplier', {
    body: { value },
  });
  DEPS.logActivity({ title: 'Set XP multiplier', method: 'POST', url, ok, status, data });
  if (!ok && status === 422) return DEPS.toast('Validation failed (1 → 10)', 'err');
  DEPS.toast(ok ? `XP multiplier set to ${fmtMult(value)}×` : 'Failed', ok ? 'ok' : 'err');
  if (ok) {
    boost.saved = clampMult(value);
    // Flare the hero once to confirm it's applied community-wide.
    const hero = $('[data-st-boost]', mount);
    hero.classList.remove('xpb-applied');
    void hero.offsetWidth; // restart the animation
    hero.classList.add('xpb-applied');
    applyBoostValue(mount, boost.saved, { from: null });
    $('[data-st-mult-cur]', mount).textContent =
      `XP multiplier updated to ${fmtMult(boost.saved)}×`;
  }
}

const catalogError = (msg) =>
  `<div class="rounded-xl border border-dashed border-zinc-300/70 dark:border-white/10 px-4 py-6 text-center"><p class="text-sm font-medium text-zinc-600 dark:text-zinc-300">${esc(msg)}</p></div>`;

async function loadCatalog(mount) {
  const body = $('[data-st-cat-body]', mount);
  body.innerHTML = gallerySkeleton();
  // Fetch the whole catalog once; the gallery filters by type/rarity/name
  // client-side, so there's no per-filter round-trip.
  try {
    const { ok, status, url, data } = await DEPS.http('GET', '/api/lootbox/rewards');
    DEPS.logActivity({ title: 'View all rewards', method: 'GET', url, ok, status, data });
    if (!ok)
      return (body.innerHTML = catalogError(
        httpErrorMessage(status, { noun: 'the reward catalog' })
      ));
    mountGallery(body, data, { emptyText: 'The reward catalog is empty.' });
  } catch {
    body.innerHTML = catalogError(httpErrorMessage(0));
  }
}
