import { $ } from './workspace-shell.js';

const KEY_TYPES = ['Classic', 'Winter', 'Spring', 'Autumn', 'Summer'];
const RARITIES = ['Common', 'Rare', 'Epic', 'Legendary'];
let DEPS = null;

const esc = (s = '') =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function initLootboxSettings(deps) {
  DEPS = deps;
  const mount = $('[data-lootbox-settings]');
  if (!mount) return;
  mount.innerHTML = `
    <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 p-4 sm:p-5">
      <h3 class="text-sm font-semibold">Active key type</h3>
      <div data-st-active class="mt-2 text-sm text-zinc-500">Loading…</div>
      <div class="mt-3 flex flex-wrap items-end gap-2">
        <select data-st-key class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm">
          ${KEY_TYPES.map((k) => `<option value="${k}">${k}</option>`).join('')}
        </select>
        <button data-st-key-save type="button" class="rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100">Set active</button>
      </div>
    </div>

    <div class="mt-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 p-4 sm:p-5">
      <h3 class="text-sm font-semibold">XP multiplier</h3>
      <div data-st-mult-cur class="mt-2 text-sm text-zinc-500">Loading…</div>
      <div class="mt-3 flex flex-wrap items-end gap-2">
        <input data-st-mult type="number" min="1" max="10" step="0.1" class="w-28 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm" />
        <button data-st-mult-save type="button" class="rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100">Save (1–10)</button>
      </div>
    </div>

    <div class="mt-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 p-4 sm:p-5">
      <h3 class="text-sm font-semibold">Reward catalog</h3>
      <div class="mt-3 flex flex-wrap gap-2">
        <select data-st-cat-rarity class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm">
          <option value="">any rarity</option>${RARITIES.map((r) => `<option value="${r}">${r}</option>`).join('')}
        </select>
        <button data-st-cat-apply type="button" class="rounded-xl border border-zinc-200/80 dark:border-white/10 px-4 py-2 text-sm">Filter</button>
      </div>
      <div data-st-cat-body class="mt-3 text-sm text-zinc-500">Loading catalog…</div>
    </div>`;

  loadActiveKey(mount);
  loadMultiplier(mount);
  loadCatalog(mount);

  $('[data-st-key-save]', mount).onclick = () => setActiveKey(mount);
  $('[data-st-mult-save]', mount).onclick = () => setMultiplier(mount);
  $('[data-st-cat-apply]', mount).onclick = () => loadCatalog(mount);
}

async function loadActiveKey(mount) {
  const cur = $('[data-st-active]', mount);
  try {
    const { ok, status, url, data } = await DEPS.http('GET', '/api/lootbox/keys');
    DEPS.logActivity({ title: 'Get active keys', method: 'GET', url, ok, status, data });
    if (!ok) return (cur.textContent = `Unavailable (${status}).`);
    const active = data?.active_key_type || data?.active || null;
    cur.textContent = active ? `Current: ${active}` : 'Loaded (see activity log for detail).';
    if (active && KEY_TYPES.includes(active)) $('[data-st-key]', mount).value = active;
  } catch {
    cur.textContent = 'Unavailable (network).';
  }
}

async function setActiveKey(mount) {
  const key = $('[data-st-key]', mount).value;
  if (!key) return DEPS.toast('Pick a key type', 'warn');
  if (!confirm(`Set active key type to ${key}?`)) return;
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
  try {
    const { ok, status, url, data } = await DEPS.http('GET', '/api/lootbox/xp/multiplier');
    DEPS.logActivity({ title: 'Get XP multiplier', method: 'GET', url, ok, status, data });
    let value = null;
    if (data && typeof data === 'object' && 'value' in data) value = data.value;
    else if (typeof data === 'string' && data.trim() !== '' && !Number.isNaN(+data)) value = +data;
    if (!ok) return (cur.textContent = `Unavailable (${status}).`);
    cur.textContent = value != null ? `Current: ${value}` : 'Loaded.';
    if (value != null) $('[data-st-mult]', mount).value = value;
  } catch {
    cur.textContent = 'Unavailable (network).';
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

async function loadCatalog(mount) {
  const body = $('[data-st-cat-body]', mount);
  body.textContent = 'Loading catalog…';
  const query = {};
  const rarity = $('[data-st-cat-rarity]', mount).value.trim();
  if (rarity) query.rarity = rarity;
  try {
    const { ok, status, url, data } = await DEPS.http('GET', '/api/lootbox/rewards', { query });
    DEPS.logActivity({ title: 'View all rewards', method: 'GET', url, ok, status, data });
    if (!ok) return (body.textContent = `Unavailable (${status}).`);
    const list = Array.isArray(data) ? data : Array.isArray(data?.rewards) ? data.rewards : [];
    if (!list.length) return (body.textContent = 'No catalog entries.');
    body.innerHTML = `<ul class="grid gap-1 sm:grid-cols-2">${list
      .map((r) => {
        const name = r?.reward_name || r?.name || '(unnamed)';
        const t = r?.reward_type || r?.type || '';
        const rar = r?.rarity ? ` · ${esc(r.rarity)}` : '';
        return `<li class="rounded-lg bg-zinc-900/5 dark:bg-white/5 px-3 py-1.5 text-sm">${esc(name)} <span class="text-zinc-400">${esc(t)}${rar}</span></li>`;
      })
      .join('')}</ul>`;
  } catch {
    body.textContent = 'Unavailable (network).';
  }
}
