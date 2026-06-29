import { $, skel, withBusy, httpErrorMessage } from './workspace-shell.js';
import { mountGallery } from './lootbox-gallery.js';

const KEY_TYPES = ['Classic', 'Winter', 'Spring', 'Autumn', 'Summer'];
let DEPS = null;

const esc = (s = '') =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Skeleton mirroring the gallery's loaded shape (search bar + grouped tile grids),
// so the swap to real content doesn't shift the layout.
function gallerySkeleton() {
  const tiles = (min, ratio, n) =>
    `<div class="grid gap-3" style="grid-template-columns:repeat(auto-fill,minmax(${min}px,1fr))">${
      `<div class="overflow-hidden rounded-xl" style="aspect-ratio:${ratio}">${skel('h-full w-full rounded-xl')}</div>`.repeat(n)
    }</div>`;
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

    <div class="mt-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 p-4 sm:p-5">
      <h3 class="text-sm font-semibold">XP multiplier</h3>
      <div data-st-mult-cur class="mt-2 text-sm text-zinc-500">${skel('h-4 w-24')}</div>
      <div class="mt-3 flex flex-wrap items-end gap-2">
        <input data-st-mult type="number" min="1" max="10" step="0.1" aria-label="XP multiplier (1 to 10)" class="w-28 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm" />
        <button data-st-mult-save type="button" class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-white shadow-sm cursor-pointer hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">Save (1–10)</button>
      </div>
    </div>

    <div class="mt-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 p-4 sm:p-5">
      <h3 class="text-sm font-semibold">Reward catalog</h3>
      <div data-st-cat-body class="mt-3">${gallerySkeleton()}</div>
    </div>`;

  $('[data-st-key-save]', mount).onclick = (e) => withBusy(e.currentTarget, () => setActiveKey(mount));
  $('[data-st-mult-save]', mount).onclick = (e) => withBusy(e.currentTarget, () => setMultiplier(mount));

  // Lazy-load the three settings endpoints only when the Lootbox → Settings
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
    DEPS.logActivity({ title: 'Get store config (active key)', method: 'GET', url, ok, status, data });
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

async function loadMultiplier(mount) {
  const cur = $('[data-st-mult-cur]', mount);
  cur.innerHTML = skel('h-4 w-24');
  try {
    const { ok, status, url, data } = await DEPS.http('GET', '/api/lootbox/xp/multiplier');
    DEPS.logActivity({ title: 'Get XP multiplier', method: 'GET', url, ok, status, data });
    let value = null;
    if (data && typeof data === 'object' && 'value' in data) value = data.value;
    else if (typeof data === 'string' && data.trim() !== '' && !Number.isNaN(+data)) value = +data;
    if (!ok) return (cur.textContent = httpErrorMessage(status, { noun: 'the XP multiplier' }));
    cur.textContent = value != null ? `Current: ${value}×` : 'Loaded.';
    if (value != null) $('[data-st-mult]', mount).value = value;
  } catch {
    cur.textContent = httpErrorMessage(0);
  }
}

async function setMultiplier(mount) {
  const raw = $('[data-st-mult]', mount).value;
  const value = raw === '' ? NaN : +raw;
  if (!Number.isFinite(value) || value < 1 || value > 10)
    return DEPS.toast('Value must be between 1 and 10', 'warn');
  const { ok, status, url, data } = await DEPS.http('POST', '/api/lootbox/xp/multiplier', {
    body: { value },
  });
  DEPS.logActivity({ title: 'Set XP multiplier', method: 'POST', url, ok, status, data });
  if (!ok && status === 422) return DEPS.toast('Validation failed (1 → 10)', 'err');
  DEPS.toast(ok ? 'XP multiplier updated' : 'Failed', ok ? 'ok' : 'err');
  if (ok) loadMultiplier(mount);
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
    if (!ok) return (body.innerHTML = catalogError(httpErrorMessage(status, { noun: 'the reward catalog' })));
    mountGallery(body, data, { emptyText: 'The reward catalog is empty.' });
  } catch {
    body.innerHTML = catalogError(httpErrorMessage(0));
  }
}
