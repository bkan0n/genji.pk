const API_MODS = '/api/mods';

let DEPS = null;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function initUsersWorkspace(deps) {
  DEPS = deps;
  const root = $('[data-users-workspace]');
  if (!root) return;
  setView(root, 'empty');
  // Search, recent, profile binding added in later tasks.
}

function setView(root, view) {
  for (const name of ['loading', 'error', 'loaded']) {
    const el = $(`[data-view="${name}"]`, root);
    if (el) el.classList.toggle('hidden', name !== view);
  }
}
