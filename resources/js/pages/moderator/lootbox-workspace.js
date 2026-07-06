import {
  $, $$, setView, makeRecentStore, renderRecentChips, wireUserSearch,
  skel, withBusy, httpErrorMessage,
} from './workspace-shell.js';
import { mountGallery } from './lootbox-gallery.js';

const API_MODS = '/api/mods';
const KEY_TYPES = ['Classic', 'Winter', 'Spring', 'Autumn', 'Summer'];
const XP_TYPES = ['Map Submission', 'Playtest', 'Guide', 'Completion', 'Record', 'World Record', 'Other'];
let CATALOG = null; // cached reward catalog (array)
const recent = makeRecentStore('mod.lootbox.recent');
let DEPS = null;
let CURRENT_ID = null;

// The display name already stored for a user (the "(aka)" label captured at pick
// time), so re-loads via chip click don't downgrade it to a plain name.
const recentName = (id) => {
  const hit = recent.get().find((r) => r.id === String(id));
  return hit && hit.name && hit.name !== String(id) ? hit.name : '';
};

const esc = (s = '') =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function setText(root, sel, value) {
  const el = $(sel, root);
  if (el) el.textContent = value;
}

// A compact stat: value on top (bold, tabular), muted label beneath. Used for
// the keys inventory and the XP summary so both read as scannable numbers, not
// run-on prose. `dim` greys out zero/empty values so the eye lands on what the
// user actually has; `size` tunes the value's prominence.
function statCell(label, value, { dim = false, size = 'text-lg' } = {}) {
  const tone = dim ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-900 dark:text-zinc-100';
  return `<div>
    <div class="${size} font-bold tabular-nums leading-none ${tone}">${esc(String(value))}</div>
    <div class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">${esc(label)}</div>
  </div>`;
}

// Coerce a value to a finite number, or null if it isn't one.
function toNum(v) {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(+v)) return +v;
  return null;
}

// One tier-progress row: label + target tier on the left, "N XP to go" on the
// right, and a fill bar showing how far the user's xp has climbed toward `total`.
function xpProgressRow(label, tierName, xp, total, required) {
  const reached = xp ?? (total != null ? total - (required ?? 0) : 0);
  const pct = total > 0 ? Math.min(100, Math.max(0, (reached / total) * 100)) : 0;
  const right =
    required != null
      ? `<span><span class="font-semibold tabular-nums text-zinc-700 dark:text-zinc-200">${esc(required.toLocaleString())}</span> XP to go</span>`
      : '';
  const name = tierName
    ? ` · <span class="font-medium text-zinc-700 dark:text-zinc-200">${esc(tierName)}</span>`
    : '';
  return `<div>
    <div class="flex items-baseline justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
      <span>${esc(label)}${name}</span>
      ${right}
    </div>
    <div class="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200/70 dark:bg-white/10">
      <div class="h-full rounded-full bg-emerald-500" style="width:${pct.toFixed(1)}%"></div>
    </div>
  </div>`;
}

// A teaching empty state: what's empty + what to do about it. Dashed, not a card.
function emptyState(title, hint) {
  return `<div class="rounded-xl border border-dashed border-zinc-300/70 dark:border-white/10 px-4 py-6 text-center">
    <p class="text-sm font-medium text-zinc-600 dark:text-zinc-300">${esc(title)}</p>
    ${hint ? `<p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">${esc(hint)}</p>` : ''}
  </div>`;
}

// Per-section skeletons that mirror each section's loaded shape.
const keysSkeleton = () =>
  `<div class="flex flex-wrap gap-x-6 gap-y-3">${`<div class="space-y-1.5">${skel('h-6 w-8')}${skel('h-3 w-12')}</div>`.repeat(5)}</div>`;
const xpSkeleton = () =>
  `<div class="space-y-3">
    <div class="flex items-center gap-3">${skel('h-7 w-24 rounded-lg')}${skel('h-5 w-16')}</div>
    <div class="space-y-2.5">${`<div class="space-y-1.5">${skel('h-3 w-40')}${skel('h-1.5 w-full rounded-full')}</div>`.repeat(2)}</div>
  </div>`;

// Roving-tabindex + arrow-key navigation for the User/Settings tablist, so the
// role="tab" markup behaves like a real tablist (the shared handler already
// switches panels and toggles aria-selected on click).
function wireTablist(panel) {
  if (!panel) return;
  const tabs = $$('.mod-subtab', panel);
  if (tabs.length < 2) return;
  const sync = () => tabs.forEach((t) => (t.tabIndex = t.classList.contains('active') ? 0 : -1));
  sync();
  panel.addEventListener('click', (e) => {
    if (e.target.closest('.mod-subtab')) sync();
  });
  tabs.forEach((tab, i) => {
    tab.addEventListener('keydown', (e) => {
      const last = tabs.length - 1;
      let j = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = i === last ? 0 : i + 1;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = i === 0 ? last : i - 1;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = last;
      if (j === null) return;
      e.preventDefault();
      tabs[j].click();
      tabs[j].focus();
    });
  });
}

export function initLootboxWorkspace(deps) {
  DEPS = deps;
  const root = $('[data-lootbox-workspace]');
  if (!root) return;
  hideAllViews(root);

  wireTablist(document.querySelector('.mod-panel[data-panel="lootbox"]'));

  const search = $('[data-lootbox-search]', root);
  wireUserSearch(search, { deps: DEPS, onLoad: (id, name) => loadUser(root, id, name) });
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

async function loadUser(root, userId, displayName = '') {
  setView(root, 'loading');
  CURRENT_ID = String(userId);
  let res;
  try {
    res = await DEPS.http('GET', `${API_MODS}/users/${encodeURIComponent(userId)}`);
  } catch {
    return showError(root, httpErrorMessage(0));
  }
  const { ok, status, url, data } = res;
  DEPS.logActivity({ title: 'Get User (lootbox)', method: 'GET', url, ok, status, data });
  if (!ok)
    return showError(
      root,
      data?.message ||
        httpErrorMessage(status, { noun: 'this user', notFound: 'No user found with that ID.' })
    );

  recent.push({
    id: String(data.id),
    name: displayName || recentName(String(data.id)) || data.coalesced_name || String(data.id),
  });
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

// Skeleton that mirrors the gallery's loaded shape — a search bar over grouped
// tile grids — so swapping in real content doesn't jump the layout.
function gallerySkeleton() {
  const tiles = (min, ratio, n) =>
    `<div class="grid gap-3" style="grid-template-columns:repeat(auto-fill,minmax(${min}px,1fr))">${
      `<div class="overflow-hidden rounded-xl" style="aspect-ratio:${ratio}">${skel('h-full w-full rounded-xl')}</div>`.repeat(n)
    }</div>`;
  return `<div class="space-y-4">
    ${skel('h-9 w-full rounded-xl')}
    <div class="space-y-6">
      <div class="space-y-2.5">${skel('h-3 w-16')}${tiles(104, '1 / 1', 6)}</div>
      <div class="space-y-2.5">${skel('h-3 w-24')}${tiles(232, '16 / 9', 3)}</div>
    </div>
  </div>`;
}

function renderRewardsSection(root, userId) {
  const mount = $('[data-lb-rewards]', root);
  if (!mount) return;
  mount.innerHTML = `<div class="border-t border-zinc-200/80 dark:border-white/10 pt-5">
    <h3 class="text-sm font-semibold">Rewards owned</h3>
    <div data-lb-rw-body class="mt-3">${gallerySkeleton()}</div>

    <details class="mt-4 rounded-xl border border-amber-400/40 bg-amber-500/5 p-3">
      <summary class="cursor-pointer text-sm font-semibold text-amber-700 dark:text-amber-400">Debug grant reward (danger)</summary>
      <p class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Bypasses normal key ownership. Pick a reward from the catalog.</p>
      <div class="mt-3 flex flex-wrap gap-2">
        ${keySelect('dbg_key_type', 'Key type for debug grant')}
        <select data-lb-dbg-reward aria-label="Reward to grant" class="min-w-[16rem] mod-field text-sm"><option value="">Loading catalog…</option></select>
        <button data-lb-dbg-grant type="button" class="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:opacity-40">Grant reward</button>
      </div>
    </details>
  </div>`;

  populateRewardControls(mount);
  $('[data-lb-dbg-grant]', mount).onclick = (e) =>
    withBusy(e.currentTarget, () => debugGrant(root, userId, mount));
  refreshRewards(root, userId, mount);
}

async function populateRewardControls(mount) {
  const list = await fetchCatalog();
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
  body.innerHTML = gallerySkeleton();
  // Fetch the full inventory once and filter client-side in the gallery — the
  // moderator gets instant type/rarity/name filtering with no extra round-trips.
  let res;
  try {
    res = await DEPS.http('GET', `/api/lootbox/users/${encodeURIComponent(userId)}/rewards`);
  } catch {
    body.innerHTML = emptyState(httpErrorMessage(0));
    return;
  }
  const { ok, status, url, data } = res;
  DEPS.logActivity({ title: 'Get user rewards', method: 'GET', url, ok, status, data });
  if (!ok) {
    body.innerHTML = emptyState(httpErrorMessage(status, { noun: 'rewards' }));
    return;
  }
  mountGallery(body, data, {
    emptyText: 'No rewards owned yet. Use Debug grant below to add one.',
  });
}

async function debugGrant(root, userId, mount) {
  const keyType = $('select[name="dbg_key_type"]', mount).value;
  const combo = $('[data-lb-dbg-reward]', mount).value;
  if (!combo) return DEPS.toast('Pick a reward from the catalog', 'warn');
  const [reward_type, reward_name] = combo.split('::');
  if (!reward_type || !reward_name) return DEPS.toast('Invalid reward selection', 'warn');
  const confirmed = await DEPS.showConfirmDanger({
    title: 'Debug grant reward',
    message: `Grant "${esc(reward_name)}" (${esc(reward_type)}, ${esc(keyType)}) to user ${esc(userId)}?\n\nThis bypasses normal key ownership.`,
    confirm: 'Grant reward',
    cancel: 'Cancel',
  });
  if (!confirmed) return;

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
      <label class="block text-xs text-zinc-500 dark:text-zinc-400">Amount
        <input data-lb-xp-amount type="number" step="1" placeholder="100" class="mt-1 w-full mod-field text-sm" />
      </label>
      <label class="block text-xs text-zinc-500 dark:text-zinc-400">Type
        <select data-lb-xp-type class="mt-1 w-full mod-field text-sm">
          ${XP_TYPES.map((t) => `<option value="${t}"${t === 'Other' ? ' selected' : ''}>${t}</option>`).join('')}
        </select>
      </label>
      <label class="block text-xs text-zinc-500 dark:text-zinc-400">Reason (optional)
        <input data-lb-xp-reason type="text" placeholder="Manual grant from moderator panel" class="mt-1 w-full mod-field text-sm" />
      </label>
    </div>
    <label class="mt-3 flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
      <input data-lb-xp-mult type="checkbox" class="h-4 w-4 accent-emerald-500" /> Apply XP multiplier
    </label>
    <div class="mt-3">
      <button data-lb-grant-xp type="button" class="mod-btn-accent">Grant XP</button>
    </div>
  </div>`;

  $('[data-lb-grant-xp]', mount).onclick = (e) =>
    withBusy(e.currentTarget, () => grantXp(root, userId, mount));
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

function keySelect(name, label = 'Key type') {
  return `<select name="${name}" aria-label="${esc(label)}" class="mod-field text-sm">
    ${KEY_TYPES.map((k) => `<option value="${k}">${k}</option>`).join('')}
  </select>`;
}

async function loadKeys(root, userId) {
  const mount = $('[data-lb-keys]', root);
  if (!mount) return;
  mount.innerHTML = `<div class="border-t border-zinc-200/80 dark:border-white/10 pt-5">
    <h3 class="text-sm font-semibold">Keys inventory</h3>
    <div data-lb-keys-body class="mt-3 text-sm text-zinc-500 dark:text-zinc-400">${keysSkeleton()}</div>
    <div class="mt-3 flex flex-wrap items-end gap-2">
      ${keySelect('key_type', 'Key type to grant')}
      <button data-lb-grant-key type="button" class="mod-btn-accent">Grant key</button>
    </div>
  </div>`;

  $('[data-lb-grant-key]', mount).onclick = (e) =>
    withBusy(e.currentTarget, () => grantKey(root, userId, $('select[name="key_type"]', mount).value));
  await refreshKeys(root, userId);
}

async function refreshKeys(root, userId) {
  const body = $('[data-lb-keys-body]', root);
  if (!body) return;
  let res;
  try {
    res = await DEPS.http('GET', `/api/lootbox/users/${encodeURIComponent(userId)}/keys`);
  } catch {
    body.textContent = httpErrorMessage(0);
    return;
  }
  const { ok, status, url, data } = res;
  DEPS.logActivity({ title: 'Get user keys', method: 'GET', url, ok, status, data });
  if (!ok) {
    body.textContent = httpErrorMessage(status, { noun: 'the key inventory' });
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
  // Always show all key types — a dimmed 0 is more useful to a moderator than a
  // collapsed "No keys.", and keeps the inventory's shape constant between users.
  body.innerHTML = `<div class="flex flex-wrap gap-x-6 gap-y-3">${KEY_TYPES.map(
    (k) => statCell(k, counts[k] ?? 0, { dim: !(counts[k] > 0) })
  ).join('')}</div>`;
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
  if (box) box.innerHTML = xpSkeleton();
  let res;
  try {
    res = await DEPS.http('GET', `/api/lootbox/users/${encodeURIComponent(userId)}/xp-summary`);
  } catch {
    if (box) box.textContent = httpErrorMessage(0);
    return;
  }
  const { ok, status, url, data } = res;
  DEPS.logActivity({ title: 'XP summary', method: 'GET', url, ok, status, data });
  if (!ok || !data || typeof data !== 'object') {
    if (box) box.textContent = httpErrorMessage(status, { noun: 'the XP summary' });
    return;
  }
  if (!box) return;

  // The v3 xp-summary is a tier-progression object. Render the story a moderator
  // actually needs — current standing + progress toward the next sub/main tier —
  // and drop the redundant fields: raw_tier / normalized_tier are internals, and
  // the split main/sub names are already encoded in the full tier name. Unknown
  // shapes degrade to a generic field strip so a payload change never blanks out.
  const xp = toNum(data.xp);
  const prestige = toNum(data.prestige_level);
  const fullTier =
    data.current_full_tier_name ||
    [data.current_main_tier_name, data.current_sub_tier_name].filter(Boolean).join(' ') ||
    null;
  const subName =
    data.next_full_tier_name ||
    [data.next_main_tier_name, data.next_sub_tier_name].filter(Boolean).join(' ') ||
    null;
  const mainName = data.next_main_tier_name || null;
  const subTotal = toNum(data.next_sub_tier_xp_total);
  const subReq = toNum(data.next_sub_tier_xp_required);
  const mainTotal = toNum(data.next_main_tier_xp_total);
  const mainReq = toNum(data.next_main_tier_xp_required);

  if (!(fullTier != null || xp != null || subTotal != null || mainTotal != null)) {
    const pairs = Object.entries(data).filter(([, v]) => v !== null && typeof v !== 'object');
    box.innerHTML = pairs.length
      ? `<div class="flex flex-wrap gap-x-5 gap-y-2">${pairs
          .map(([k, v]) =>
            statCell(k.replace(/_/g, ' '), toNum(v) != null ? toNum(v).toLocaleString() : String(v), {
              size: 'text-base',
            })
          )
          .join('')}</div>`
      : 'No XP summary fields returned.';
    return;
  }

  const standing = [];
  if (fullTier)
    standing.push(
      `<span class="rounded-lg bg-emerald-500/15 px-2.5 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">${esc(fullTier)}</span>`
    );
  if (xp != null)
    standing.push(
      `<span class="text-sm"><span class="font-bold tabular-nums text-zinc-900 dark:text-zinc-100">${esc(xp.toLocaleString())}</span> <span class="text-zinc-500 dark:text-zinc-400">XP</span></span>`
    );
  if (prestige != null)
    standing.push(
      `<span class="text-sm text-zinc-500 dark:text-zinc-400">Prestige <span class="font-semibold tabular-nums text-zinc-700 dark:text-zinc-200">${esc(prestige.toLocaleString())}</span></span>`
    );

  const bars = [];
  if (subName || subTotal != null) bars.push(xpProgressRow('Next sub tier', subName, xp, subTotal, subReq));
  if (mainName || mainTotal != null)
    bars.push(xpProgressRow('Next main tier', mainName, xp, mainTotal, mainReq));

  box.innerHTML = `<div class="space-y-3">
    ${standing.length ? `<div class="flex flex-wrap items-center gap-x-3 gap-y-1.5">${standing.join('')}</div>` : ''}
    ${bars.length ? `<div class="space-y-2.5">${bars.join('')}</div>` : ''}
  </div>`;
}
