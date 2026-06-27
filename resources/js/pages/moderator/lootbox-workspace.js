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
  // Section renders are added in later tasks.
  setView(root, 'loaded');
}
