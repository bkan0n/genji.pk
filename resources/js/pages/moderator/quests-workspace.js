import { $, $$ } from './workspace-shell.js';

let DEPS = null;
const ROOT = () => $('[data-quests-workspace]');
const API_MODS = '/api/mods';

// Tracks which sub-tabs have already auto-loaded this session.
const loaded = { config: false, global: false };

// Verbatim copy of the store-workspace button-pending lifecycle.
function setFormPending(form, pending = true, submitter = null) {
  const btns = Array.from(form.querySelectorAll('button[type="submit"], button:not([type])'));
  if (pending) {
    form.setAttribute('aria-busy', 'true');
    btns.forEach((btn) => {
      if (btn.dataset.pendingWired !== '1') {
        btn.dataset.pendingWired = '1';
        btn.dataset.pendingText = btn.textContent || 'Submit';
      }
      btn.disabled = true;
      btn.classList.add('opacity-70');
      if (!submitter || btn === submitter) btn.textContent = 'Working...';
    });
    return;
  }
  form.removeAttribute('aria-busy');
  btns.forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove('opacity-70');
    if (btn.dataset.pendingText) btn.textContent = btn.dataset.pendingText;
  });
}

// Toggle loading/error/loaded views within a card.
function setView(card, view) {
  ['loading', 'error', 'loaded'].forEach((name) => {
    const el = card.querySelector(`[data-view="${name}"]`);
    if (el) el.classList.toggle('hidden', name !== view);
  });
}

const subpanel = (name) => $(`[data-subpanel="${name}"]`, ROOT());

// Lazy-load a sub-tab's data on first entry (config/global) or reset (user).
function onSubtabEnter(name) {
  if (name === 'quest-config' && !loaded.config) { loaded.config = true; loadConfig(); }
  if (name === 'quest-global' && !loaded.global) { loaded.global = true; loadGlobalQuests(); }
}

function wireSubtabAutoLoad() {
  const root = ROOT();
  if (!root) return;
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('.mod-subtab');
    if (btn) onSubtabEnter(btn.dataset.subtab);
  });
}

// Stubs filled in later tasks.
async function loadConfig() {}
async function loadGlobalQuests() {}

export function initQuestsWorkspace(deps) {
  DEPS = deps;
  const root = ROOT();
  if (!root) return;
  wireSubtabAutoLoad();

  // Deep-link / already-visible panel: auto-load the first sub-tab's data.
  const panel = document.querySelector('.mod-panel[data-panel="quests"]');
  if (panel && !panel.classList.contains('hidden')) onSubtabEnter('quest-config');
}
