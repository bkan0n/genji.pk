import { $, $$ } from './workspace-shell.js';

let DEPS = null;
const ROOT = () => $('[data-quests-workspace]');
const API_MODS = '/api/mods';

const REWARD_TIERS = ['easy', 'medium', 'hard'];
const REQ_DIFFICULTIES = ['any', 'Easy', 'Medium', 'Hard', 'Very Hard', 'Extreme', 'Hell'];
const MAP_CATEGORIES = ['Classic', 'Increasing Difficulty', 'Other'];
const MEDAL_TYPES = ['gold', 'silver', 'bronze'];
const TARGET_TYPES = ['medal_threshold', 'percentile', 'personal_best'];
const REQ_TYPES = [
  'complete_maps', 'complete_difficulty_range', 'earn_medals',
  'beat_time', 'beat_rival', 'complete_map',
];
const GLOBAL_REQ_TYPES = ['complete_maps', 'complete_difficulty_range', 'earn_medals'];
const BOUNTY_TYPE_BY_REQ = {
  beat_time: 'personal_improvement',
  beat_rival: 'rival_challenge',
  complete_map: 'gap_filling',
};

const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

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

// Build a <select> with options. `current` is preselected; `placeholder` adds a
// leading blank option when truthy.
function buildSelect(name, options, current, { placeholder = '' } = {}) {
  const opts = [];
  if (placeholder) {
    const sel = current == null || current === '' ? ' selected' : '';
    opts.push(`<option value=""${sel}>${escapeHtml(placeholder)}</option>`);
  }
  for (const o of options) {
    const value = typeof o === 'object' ? o.value : o;
    const label = typeof o === 'object' ? o.label : o;
    const sel = String(current ?? '') === String(value) ? ' selected' : '';
    opts.push(`<option value="${escapeHtml(value)}"${sel}>${escapeHtml(label)}</option>`);
  }
  return `<select name="${escapeHtml(name)}"
    class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none">${opts.join('')}</select>`;
}

// map_id -> code, shared across the panel. No batch endpoint, so resolve lazily.
const MAP_CODE_CACHE = new Map();
const MAP_ID_CACHE = new Map(); // code(lower) -> map_id

// code -> map_id via GET /api/maps?code=
async function resolveCodeToId(code) {
  const key = String(code || '').trim().toLowerCase();
  if (!key) return null;
  if (MAP_ID_CACHE.has(key)) return MAP_ID_CACHE.get(key);
  const res = await DEPS.http('GET', '/api/maps', { query: { code } });
  const item = pickMapItem(res.data);
  const id = item && item.id != null ? Number(item.id) : null;
  if (id != null) {
    MAP_ID_CACHE.set(key, id);
    MAP_CODE_CACHE.set(id, item.code || code);
  }
  return id;
}

// map_id -> code via the new map-id search (GET /api/maps?map_id=)
async function resolveIdToCode(mapId) {
  const id = Number(mapId);
  if (!Number.isFinite(id)) return null;
  if (MAP_CODE_CACHE.has(id)) return MAP_CODE_CACHE.get(id);
  const res = await DEPS.http('GET', '/api/maps', { query: { map_id: id } });
  const item = pickMapItem(res.data);
  const code = item && item.code != null ? String(item.code) : null;
  if (code != null) {
    MAP_CODE_CACHE.set(id, code);
    MAP_ID_CACHE.set(code.toLowerCase(), id);
  }
  return code;
}

function pickMapItem(data) {
  if (Array.isArray(data)) return data[0] || null;
  if (data && typeof data === 'object') return data.items?.[0] ?? data.data?.items?.[0] ?? data ?? null;
  return null;
}

// A code text input that stores the resolved map_id in dataset.mapId.
// markup: <input data-map-field name="..."> inside a relative wrapper.
function wireMapField(input, { initialMapId = null } = {}) {
  if (!input || input.__mapWired) return;
  input.__mapWired = true;
  DEPS.wireAutocomplete(input, {
    kind: 'map-codes',
    onPick: async ({ value }) => {
      const code = (value || '').trim();
      input.value = code;
      const id = await resolveCodeToId(code);
      input.dataset.mapId = id != null ? String(id) : '';
    },
  });
  input.addEventListener('input', () => { input.dataset.mapId = ''; });
  // Hydrate an existing map_id into a code for display.
  if (initialMapId != null && initialMapId !== '' && Number(initialMapId) !== 0) {
    input.dataset.mapId = String(initialMapId);
    input.value = `#${initialMapId}`;
    resolveIdToCode(initialMapId).then((code) => { if (code) input.value = code; });
  }
}

// Read the chosen map_id; resolves the typed code on demand if not yet resolved.
async function readMapId(input) {
  if (!input) return null;
  if (input.dataset.mapId) return Number(input.dataset.mapId);
  const code = (input.value || '').trim();
  if (!code) return null;
  return resolveCodeToId(code);
}

// Renders int[] map ids as code chips inside `host` (a container element).
// Stores the live list on host.__ids. `addInput` is a code autocomplete input.
function renderMapChips(host) {
  const ids = host.__ids || [];
  host.innerHTML = ids.length
    ? ids.map((id) => `<span class="inline-flex items-center gap-1 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-2 py-1 text-xs" data-chip="${id}">
        <span data-chip-label>#${id}</span>
        <button type="button" data-chip-remove="${id}" class="opacity-60 hover:opacity-100">✕</button>
      </span>`).join('')
    : `<span class="text-xs text-zinc-500 dark:text-zinc-400">No maps</span>`;
  // Resolve codes lazily.
  for (const id of ids) {
    resolveIdToCode(id).then((code) => {
      if (!code) return;
      const el = host.querySelector(`[data-chip="${id}"] [data-chip-label]`);
      if (el) el.textContent = code;
    });
  }
}

function wireMapListField(host, addInput, initialIds = []) {
  host.__ids = Array.isArray(initialIds) ? initialIds.map(Number).filter(Number.isFinite) : [];
  renderMapChips(host);
  host.addEventListener('click', (e) => {
    const rm = e.target.closest('[data-chip-remove]');
    if (!rm) return;
    const id = Number(rm.dataset.chipRemove);
    host.__ids = host.__ids.filter((x) => x !== id);
    renderMapChips(host);
  });
  if (addInput && !addInput.__mapWired) {
    addInput.__mapWired = true;
    DEPS.wireAutocomplete(addInput, {
      kind: 'map-codes',
      onPick: async ({ value }) => {
        const id = await resolveCodeToId((value || '').trim());
        if (id != null && !host.__ids.includes(id)) { host.__ids.push(id); renderMapChips(host); }
        addInput.value = '';
      },
    });
  }
}

// Text input that stores the picked numeric user id in dataset.uid.
function wireUserField(input, { initialId = null } = {}) {
  if (!input || input.__userWired) return;
  input.__userWired = true;
  DEPS.wireAutocomplete(input, {
    kind: 'users',
    onPick: ({ id }) => { input.dataset.uid = String(id || ''); },
  });
  input.addEventListener('input', () => { delete input.dataset.uid; });
  if (initialId != null && initialId !== '') {
    input.dataset.uid = String(initialId);
    input.value = `#${initialId}`;
  }
}
const readUserId = (input) => String(input?.dataset?.uid || '').trim() || null;

export function initQuestsWorkspace(deps) {
  DEPS = deps;
  const root = ROOT();
  if (!root) return;
  wireSubtabAutoLoad();

  // Deep-link / already-visible panel: auto-load the first sub-tab's data.
  const panel = document.querySelector('.mod-panel[data-panel="quests"]');
  if (panel && !panel.classList.contains('hidden')) onSubtabEnter('quest-config');
}
