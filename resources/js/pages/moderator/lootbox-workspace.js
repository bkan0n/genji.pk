import {
  $, $$, pickedId, setView, makeRecentStore, renderRecentChips, wireUserSearch,
} from './workspace-shell.js';

const API_MODS = '/api/mods';
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
  setView(root, 'loaded');
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
