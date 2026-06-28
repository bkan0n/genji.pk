import { $, $$ } from './workspace-shell.js';

let DEPS = null;
const ROOT = () => $('[data-tournament-workspace]');

// Loaded-once flags; Refresh forces reload.
const loaded = { status: false, setup: false };

const API = '/api/tournaments';
const API_MODS = '/api/mods/tournaments';

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
  // Feature wiring added in later tasks:
  // wireCategoryActions(root); wireStreakLookup(root); wireSetup(root);
}

function wireSubtabLoading(root) {
  root.addEventListener('click', (e) => {
    const tab = e.target.closest('.mod-subtab');
    if (!tab) return;
    const name = tab.dataset.subtab;
    if (name === 'tournament-status') loadStatus(root, { force: false });
    if (name === 'tournament-setup') loadSetup(root, { force: false });
  });
}

function wireRefresh(root) {
  root.addEventListener('click', (e) => {
    if (!e.target.closest('[data-tournament-refresh]')) return;
    e.preventDefault();
    loadStatus(root, { force: true });
  });
}

// Stubs — implemented in later tasks.
async function loadStatus(root, { force }) {
  if (loaded.status && !force) return;
  loaded.status = true;
}
async function loadSetup(root, { force }) {
  if (loaded.setup && !force) return;
  loaded.setup = true;
}
