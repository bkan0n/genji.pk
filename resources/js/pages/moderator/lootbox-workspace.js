import {
  $, $$, pickedId, setView, makeRecentStore, renderRecentChips, wireUserSearch,
} from './workspace-shell.js';

const API_MODS = '/api/mods';
const KEY_TYPES = ['Classic', 'Winter', 'Spring', 'Autumn', 'Summer'];
const XP_TYPES = ['Map Submission', 'Playtest', 'Guide', 'Completion', 'Record', 'World Record', 'Other'];
const RARITIES = ['Common', 'Rare', 'Epic', 'Legendary'];
let CATALOG = null; // cached reward catalog (array)
const recent = makeRecentStore('mod.lootbox.recent');
let DEPS = null;
let CURRENT_ID = null;

const esc = (s = '') =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function setText(root, sel, value) {
  const el = $(sel, root);
  if (el) el.textContent = value;
}

export function initLootboxWorkspace(deps) {
  DEPS = deps;
  const root = $('[data-lootbox-workspace]');
  if (!root) return;
  hideAllViews(root);

  const search = $('[data-lootbox-search]', root);
  wireUserSearch(search, { deps: DEPS, onLoad: (id) => loadUser(root, id) });
  renderRecent(root);
}

function hideAllViews(root) {
  for (const name of ['loading', 'error', 'loaded']) {
    const el = $(`[data-view="${name}"]`, root);
    if (el) el.classList.add('hidden');
  }
}

function renderRecent(root) {
  renderRecentChips($('[data-lootbox-recent]', root), recent, (id) => loadUser(root, id));
}

function showError(root, message) {
  const box = $('[data-lootbox-error]', root);
  if (box) box.textContent = message;
  setView(root, 'error');
  DEPS.toast('Lookup failed', 'err');
}

async function loadUser(root, userId) {
  setView(root, 'loading');
  CURRENT_ID = String(userId);
  let res;
  try {
    res = await DEPS.http('GET', `${API_MODS}/users/${encodeURIComponent(userId)}`);
  } catch {
    return showError(root, 'Network error — try again.');
  }
  const { ok, status, url, data } = res;
  DEPS.logActivity({ title: 'Get User (lootbox)', method: 'GET', url, ok, status, data });
  if (!ok) return showError(root, data?.message || `Lookup failed (${status}).`);

  recent.push({ id: String(data.id), name: data.coalesced_name || String(data.id) });
  renderRecent(root);
  renderIdentity(root, data);
  loadXpSummary(root, String(data.id));
  loadKeys(root, String(data.id));
  renderXpSection(root, String(data.id));
  renderRewardsSection(root, String(data.id));
  setView(root, 'loaded');
}

async function fetchCatalog() {
  if (CATALOG) return CATALOG;
  try {
    const { ok, data } = await DEPS.http('GET', '/api/lootbox/rewards');
    CATALOG = ok && Array.isArray(data) ? data : ok && Array.isArray(data?.rewards) ? data.rewards : [];
  } catch {
    CATALOG = [];
  }
  return CATALOG;
}

function rewardTypeOptions(list) {
  const types = [...new Set(list.map((r) => r?.reward_type || r?.type).filter(Boolean))];
  return [
    '<option value="">any type</option>',
    ...types.map((t) => `<option value="${esc(t)}">${esc(t)}</option>`),
  ].join('');
}

function renderRewardsSection(root, userId) {
  const mount = $('[data-lb-rewards]', root);
  if (!mount) return;
  mount.innerHTML = `<div class="border-t border-zinc-200/80 dark:border-white/10 pt-5">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold">Rewards owned</h3>
    </div>
    <div class="mt-3 flex flex-wrap gap-2">
      <select data-lb-rw-type class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"><option value="">any type</option></select>
      <select data-lb-rw-rarity class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm">
        <option value="">any rarity</option>${RARITIES.map((r) => `<option value="${r}">${r}</option>`).join('')}
      </select>
      <button data-lb-rw-apply type="button" class="rounded-xl border border-zinc-200/80 dark:border-white/10 px-4 py-2 text-sm">Filter</button>
    </div>
    <div data-lb-rw-body class="mt-3 text-sm text-zinc-500">Loading rewards…</div>

    <details class="mt-4 rounded-xl border border-amber-400/40 bg-amber-500/5 p-3">
      <summary class="cursor-pointer text-sm font-semibold text-amber-700 dark:text-amber-400">Debug grant reward (danger)</summary>
      <p class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Bypasses normal key ownership. Pick a reward from the catalog.</p>
      <div class="mt-3 flex flex-wrap gap-2">
        ${keySelect('dbg_key_type')}
        <select data-lb-dbg-reward class="min-w-[16rem] rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"><option value="">Loading catalog…</option></select>
        <button data-lb-dbg-grant type="button" class="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">Grant reward</button>
      </div>
    </details>
  </div>`;

  $('[data-lb-rw-apply]', mount).onclick = () => refreshRewards(root, userId, mount);
  populateRewardControls(mount);
  $('[data-lb-dbg-grant]', mount).onclick = () => debugGrant(root, userId, mount);
  refreshRewards(root, userId, mount);
}

async function populateRewardControls(mount) {
  const list = await fetchCatalog();
  const typeSel = $('[data-lb-rw-type]', mount);
  if (typeSel) typeSel.innerHTML = rewardTypeOptions(list);
  const dbg = $('[data-lb-dbg-reward]', mount);
  if (dbg)
    dbg.innerHTML = list.length
      ? list
          .map((r) => {
            const type = r?.reward_type || r?.type || '';
            const name = r?.reward_name || r?.name || '';
            return `<option value="${esc(type)}::${esc(name)}">${esc(type)} — ${esc(name)}</option>`;
          })
          .join('')
      : '<option value="">No catalog entries</option>';
}

async function refreshRewards(root, userId, mount) {
  const body = $('[data-lb-rw-body]', mount);
  if (!body) return;
  body.textContent = 'Loading rewards…';
  const query = {};
  const type = $('[data-lb-rw-type]', mount).value.trim();
  const rarity = $('[data-lb-rw-rarity]', mount).value.trim();
  if (type) query.reward_type = type;
  if (rarity) query.rarity = rarity;

  let res;
  try {
    res = await DEPS.http('GET', `/api/lootbox/users/${encodeURIComponent(userId)}/rewards`, { query });
  } catch {
    body.textContent = 'Rewards unavailable (network).';
    return;
  }
  const { ok, status, url, data } = res;
  DEPS.logActivity({ title: 'Get user rewards', method: 'GET', url, ok, status, data });
  if (!ok) {
    body.textContent = `Rewards unavailable (${status}).`;
    return;
  }
  const list = Array.isArray(data) ? data : Array.isArray(data?.rewards) ? data.rewards : [];
  if (!list.length) {
    body.textContent = 'No rewards.';
    return;
  }
  body.innerHTML = `<ul class="space-y-1">${list
    .map((r) => {
      const name = r?.reward_name || r?.name || '(unnamed)';
      const t = r?.reward_type || r?.type || '';
      const rar = r?.rarity ? ` · ${esc(r.rarity)}` : '';
      return `<li class="rounded-lg bg-zinc-900/5 dark:bg-white/5 px-3 py-1.5">${esc(name)} <span class="text-zinc-400">${esc(t)}${rar}</span></li>`;
    })
    .join('')}</ul>`;
}

async function debugGrant(root, userId, mount) {
  const keyType = $('select[name="dbg_key_type"]', mount).value;
  const combo = $('[data-lb-dbg-reward]', mount).value;
  if (!combo) return DEPS.toast('Pick a reward from the catalog', 'warn');
  const [reward_type, reward_name] = combo.split('::');
  if (!reward_type || !reward_name) return DEPS.toast('Invalid reward selection', 'warn');
  if (
    !confirm(
      `Debug-grant "${reward_name}" (${reward_type}, ${keyType}) to user ${userId}? This bypasses key ownership.`
    )
  )
    return;

  const path = `${API_MODS}/lootbox/users/debug/${encodeURIComponent(userId)}/${encodeURIComponent(keyType)}/${encodeURIComponent(reward_type)}/${encodeURIComponent(reward_name)}`;
  const { ok, status, url, data } = await DEPS.http('POST', path);
  DEPS.logActivity({ title: 'Grant reward (debug)', method: 'POST', url, ok, status, data });
  DEPS.toast(ok ? 'Reward granted' : 'Failed', ok ? 'ok' : 'err');
  if (ok) refreshRewards(root, userId, mount);
}

function renderXpSection(root, userId) {
  const mount = $('[data-lb-xp]', root);
  if (!mount) return;
  mount.innerHTML = `<div class="border-t border-zinc-200/80 dark:border-white/10 pt-5">
    <h3 class="text-sm font-semibold">Grant XP</h3>
    <div class="mt-3 grid gap-3 sm:grid-cols-3">
      <label class="block text-xs text-zinc-500">Amount
        <input data-lb-xp-amount type="number" step="1" placeholder="100" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500/60 focus:outline-none" />
      </label>
      <label class="block text-xs text-zinc-500">Type
        <select data-lb-xp-type class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500/60 focus:outline-none">
          ${XP_TYPES.map((t) => `<option value="${t}"${t === 'Other' ? ' selected' : ''}>${t}</option>`).join('')}
        </select>
      </label>
      <label class="block text-xs text-zinc-500">Reason (optional)
        <input data-lb-xp-reason type="text" placeholder="Manual grant from moderator panel" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500/60 focus:outline-none" />
      </label>
    </div>
    <label class="mt-3 flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
      <input data-lb-xp-mult type="checkbox" class="h-4 w-4 accent-emerald-500" /> Apply XP multiplier
    </label>
    <div class="mt-3">
      <button data-lb-grant-xp type="button" class="rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100">Grant XP</button>
    </div>
  </div>`;

  $('[data-lb-grant-xp]', mount).onclick = () => grantXp(root, userId, mount);
}

async function grantXp(root, userId, mount) {
  const amount = Number.parseInt($('[data-lb-xp-amount]', mount).value, 10);
  if (!Number.isInteger(amount) || amount === 0)
    return DEPS.toast('Amount must be a non-zero integer', 'warn');
  const payload = {
    amount,
    type: ($('[data-lb-xp-type]', mount).value || 'Other').trim() || 'Other',
    apply_multiplier: !!$('[data-lb-xp-mult]', mount).checked,
    source: 'mods',
  };
  const reason = $('[data-lb-xp-reason]', mount).value.trim();
  if (reason) payload.reason = reason;

  const { ok, status, url, data } = await DEPS.http(
    'POST',
    `${API_MODS}/lootbox/users/${encodeURIComponent(userId)}/xp`,
    { headers: { 'Content-Type': 'application/json' }, body: payload }
  );
  DEPS.logActivity({ title: 'Grant XP', method: 'POST', url, ok, status, data });
  if (!ok && status === 422)
    return DEPS.toast(data?.error || 'Validation failed (check amount/type/user)', 'err');
  DEPS.toast(ok ? 'XP granted' : 'Failed', ok ? 'ok' : 'err');
  if (ok) loadXpSummary(root, userId);
}

function keySelect(name) {
  return `<select name="${name}" class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500/60 focus:outline-none">
    ${KEY_TYPES.map((k) => `<option value="${k}">${k}</option>`).join('')}
  </select>`;
}

async function loadKeys(root, userId) {
  const mount = $('[data-lb-keys]', root);
  if (!mount) return;
  mount.innerHTML = `<div class="border-t border-zinc-200/80 dark:border-white/10 pt-5">
    <h3 class="text-sm font-semibold">Keys inventory</h3>
    <div data-lb-keys-body class="mt-3 text-sm text-zinc-500">Loading keys…</div>
    <div class="mt-3 flex flex-wrap items-end gap-2">
      ${keySelect('key_type')}
      <button data-lb-grant-key type="button" class="rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100">Grant key</button>
    </div>
  </div>`;

  $('[data-lb-grant-key]', mount).onclick = () =>
    grantKey(root, userId, $('select[name="key_type"]', mount).value);
  await refreshKeys(root, userId);
}

async function refreshKeys(root, userId) {
  const body = $('[data-lb-keys-body]', root);
  if (!body) return;
  let res;
  try {
    res = await DEPS.http('GET', `/api/lootbox/users/${encodeURIComponent(userId)}/keys`);
  } catch {
    body.textContent = 'Keys unavailable (network).';
    return;
  }
  const { ok, status, url, data } = res;
  DEPS.logActivity({ title: 'Get user keys', method: 'GET', url, ok, status, data });
  if (!ok) {
    body.textContent = `Keys unavailable (${status}).`;
    return;
  }
  // Accept either a {Classic: n, ...} map or an array of {key_type,count}-ish.
  const counts = {};
  if (Array.isArray(data)) {
    for (const row of data) {
      const k = row?.key_type || row?.type || row?.name;
      if (k) counts[k] = (counts[k] || 0) + Number(row?.count ?? row?.amount ?? 1);
    }
  } else if (data && typeof data === 'object') {
    for (const [k, v] of Object.entries(data)) if (typeof v !== 'object') counts[k] = Number(v) || 0;
  }
  const shown = KEY_TYPES.map((k) => `${k} ${counts[k] ?? 0}`).join(' · ');
  body.textContent = shown || 'No keys.';
}

async function grantKey(root, userId, keyType) {
  if (!keyType) return DEPS.toast('Pick a key type', 'warn');
  const { ok, status, url, data } = await DEPS.http(
    'POST',
    `${API_MODS}/lootbox/users/${encodeURIComponent(userId)}/keys/${encodeURIComponent(keyType)}`
  );
  DEPS.logActivity({ title: 'Grant key', method: 'POST', url, ok, status, data });
  DEPS.toast(ok ? 'Key granted' : 'Failed', ok ? 'ok' : 'err');
  if (ok) refreshKeys(root, userId);
}

function renderIdentity(root, user) {
  setText(root, '[data-lb-view="coalesced_name"]', user.coalesced_name || '—');
  setText(root, '[data-lb-view="id"]', String(user.id));
  setText(root, '[data-lb-view="coins"]', Number(user.coins || 0).toLocaleString());
  const copyBtn = $('[data-lb-copy-id]', root);
  if (copyBtn)
    copyBtn.onclick = () => {
      navigator.clipboard?.writeText(String(user.id));
      DEPS.toast('ID copied', 'ok');
    };
}

async function loadXpSummary(root, userId) {
  const box = $('[data-lb-xp-summary]', root);
  if (box) box.textContent = 'Loading XP…';
  let res;
  try {
    res = await DEPS.http('GET', `/api/lootbox/users/${encodeURIComponent(userId)}/xp-summary`);
  } catch {
    if (box) box.textContent = 'XP summary unavailable (network).';
    return;
  }
  const { ok, status, url, data } = res;
  DEPS.logActivity({ title: 'XP summary', method: 'GET', url, ok, status, data });
  if (!ok || !data || typeof data !== 'object') {
    if (box) box.textContent = `XP summary unavailable (${status}).`;
    return;
  }
  // Render defensively: show present primitive fields only.
  const pairs = Object.entries(data).filter(([, v]) => v !== null && typeof v !== 'object');
  if (box)
    box.innerHTML = pairs.length
      ? pairs
          .map(
            ([k, v]) =>
              `<span class="mr-3 whitespace-nowrap"><span class="text-zinc-400">${esc(k.replace(/_/g, ' '))}:</span> <span class="font-semibold">${esc(String(v))}</span></span>`
          )
          .join('')
      : 'No XP summary fields returned.';
}
