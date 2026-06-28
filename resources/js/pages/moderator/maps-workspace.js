import { $, $$, setView, makeRecentStore, renderRecentChips } from './workspace-shell.js';
import { wireMapSearch } from './workspace-shell.js';

let DEPS = null;
const recent = makeRecentStore('mod.maps.recent');
let CURRENT = null; // loaded map object

export function initMapWorkspace(deps) {
  DEPS = deps;
  const root = $('[data-maps-workspace]');
  if (!root) return;
  setView(root, 'empty');

  const search = $('[data-maps-search]', root);
  wireMapSearch(search, { deps: DEPS, onLoad: (code) => loadMap(root, code) });
  renderRecent(root);
  // Submit-new-map tool mounted in a later task.
}

function renderRecent(root) {
  const wrap = $('[data-maps-recent]', root);
  renderRecentChips(wrap, recent, (code) => loadMap(root, code));
}

async function loadMap(root, code) {
  setView(root, 'loading');
  let res;
  try {
    res = await DEPS.http('GET', '/api/maps', { query: { code } });
  } catch {
    return showError(root, 'Network error — try again.');
  }
  // Loader retries archived maps, matching handleLoadMapForUpdate.
  let item = pickItem(res.data);
  if (res.ok && !item) {
    const arch = await DEPS.http('GET', '/api/maps', { query: { code, archived: true } });
    DEPS.logActivity({ title: 'Load archived map', method: 'GET', url: arch.url, ok: arch.ok, status: arch.status, data: arch.data });
    res = arch;
    item = pickItem(arch.data);
  }
  DEPS.logActivity({ title: 'Load map', method: 'GET', url: res.url, ok: res.ok, status: res.status, data: res.data });
  if (!res.ok) return showError(root, res.data?.message || `Lookup failed (${res.status}).`);
  if (!item) return showError(root, `No map found for "${code}".`);

  CURRENT = item;
  recent.push({ id: String(item.code), name: item.map_name || String(item.code) });
  renderRecent(root);
  renderProfile(root, item); // no-op until a later task
  setView(root, 'loaded');
}

function pickItem(data) {
  if (Array.isArray(data)) return data[0] || null;
  if (data && typeof data === 'object') return (data.items?.[0] ?? data.data?.items?.[0] ?? data) || null;
  return null;
}

function showError(root, message) {
  const box = $('[data-maps-error]', root);
  if (box) box.textContent = message;
  setView(root, 'error');
  DEPS.toast('Lookup failed', 'err');
}

// Filled in a later task.
function renderProfile(root, map) { /* identity header / fields / guides / actions */ }
