import {
  $, $$, pickedId, setView, makeRecentStore, renderRecentChips, wireUserSearch,
} from './workspace-shell.js';

const API_MODS = '/api/mods';
const KEY_TYPES = ['Classic', 'Winter', 'Spring', 'Autumn', 'Summer'];
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
  setView(root, 'loaded');
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
