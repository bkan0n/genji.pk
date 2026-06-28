import { $, $$ } from './workspace-shell.js';

let DEPS = null;
let workspaceRoot = null;

const ENTITIES = {
  categories: { singular: 'Category', plural: 'Categories', outKey: 'content-categories-res' },
  difficulties: { singular: 'Difficulty', plural: 'Difficulties', outKey: 'content-difficulties-res' },
  techniques: { singular: 'Technique', plural: 'Techniques', outKey: 'content-techniques-res' },
};

export function initContentWorkspace(deps) {
  DEPS = deps;
  workspaceRoot = $('[data-content-workspace]');
  if (!workspaceRoot) return;

  Object.keys(ENTITIES).forEach((entity) => {
    wireListContainer(entity);
    wireHeaderButtons(entity);
    renderLoading(entity);
    loadAndRender(entity);
  });

  // Defensive re-render when a content sub-tab is (re)activated.
  $$('[data-subtab^="content-"]', workspaceRoot).forEach((btn) => {
    btn.addEventListener('click', () => {
      const entity = subtabEntity(btn.getAttribute('data-subtab'));
      if (entity) setTimeout(() => renderRows(entity), 0);
    });
  });
}

function subtabEntity(subtab) {
  if (!subtab) return null;
  const key = String(subtab).replace(/^content-/, '');
  return ENTITIES[key] ? key : null;
}

function listContainer(entity) {
  return $(`[data-content-list="${entity}"]`, workspaceRoot);
}

function items(entity) {
  const arr = DEPS.movementTechContentCache[entity];
  return Array.isArray(arr) ? arr : [];
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// ---- loading + rendering ----

function renderLoading(entity) {
  const c = listContainer(entity);
  if (c) c.innerHTML = '<div class="px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">Loading…</div>';
}

async function loadAndRender(entity) {
  await DEPS.loadContentEntityCollection(entity, {
    failureMessage: `Failed to load ${ENTITIES[entity].plural.toLowerCase()}`,
    silentSuccess: true,
  });
  renderRows(entity);
}

function updateCount(entity, n) {
  $$(`[data-content-count="${entity}"]`, workspaceRoot).forEach((el) => {
    el.textContent = n ? `${n} synced` : 'No items synced';
  });
}

function renderRows(entity) {
  const c = listContainer(entity);
  if (!c) return;
  const list = items(entity);
  updateCount(entity, list.length);

  if (!list.length) {
    c.innerHTML = `<div class="px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">No ${ENTITIES[entity].plural.toLowerCase()} yet — add one to get started.</div>`;
    return;
  }

  c.innerHTML = '';
  list.forEach((item, index) => c.appendChild(buildRow(entity, item, index, list.length)));
}

function entityMetaTail(entity, item) {
  if (entity !== 'techniques') return '';
  const difficulty = item?.difficulty?.name ?? item?.difficulty_name ?? item?.difficulty_label ?? '';
  const category = item?.category?.name ?? item?.category_name ?? item?.category_label ?? '';
  return [category, difficulty].filter(Boolean).join(' · ');
}

function iconBtn(kind, title, disabled) {
  const icons = {
    up: '<svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path d="M14.77 12.79a.75.75 0 01-1.06-.02L10 9.06l-3.71 3.71a.75.75 0 11-1.08-1.04l4.24-4.24a.75.75 0 011.06 0l4.24 4.24a.75.75 0 01.02 1.06z"/></svg>',
    down: '<svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/></svg>',
    edit: '<svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path d="M13.586 3.586a2 2 0 112.828 2.828l-8.293 8.293a1 1 0 01-.39.242l-3 1a1 1 0 01-1.265-1.265l1-3a1 1 0 01.242-.39l8.293-8.293z"/></svg>',
    delete: '<svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2h12a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM5 8a1 1 0 011 1v7a1 1 0 102 0V9a1 1 0 112 0v7a1 1 0 102 0V9a1 1 0 112 0v7a3 3 0 01-3 3H8a3 3 0 01-3-3V8z" clip-rule="evenodd"/></svg>',
  };
  const tone = kind === 'delete'
    ? 'text-rose-600 dark:text-rose-300 hover:bg-rose-500/10'
    : 'hover:bg-zinc-100 dark:hover:bg-white/10';
  return `<button type="button" data-content-action="${kind}" title="${title}" aria-label="${title}" ${disabled ? 'disabled' : ''} class="cursor-pointer rounded-lg border border-zinc-200/80 dark:border-white/10 p-1.5 ${tone} disabled:cursor-not-allowed disabled:opacity-30">${icons[kind]}</button>`;
}

function buildRow(entity, item, index, total) {
  const row = document.createElement('div');
  row.className = 'group flex items-center gap-3 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 px-3 py-2';
  row.dataset.contentRow = String(item?.id ?? '');

  const id = item?.id == null ? '' : `#${item.id}`;
  const name = String(item?.name ?? '').trim() || 'Unnamed';
  const tail = entityMetaTail(entity, item);

  const main = document.createElement('div');
  main.className = 'min-w-0 flex-1';
  main.innerHTML = `
    <div class="flex items-baseline gap-2">
      <span class="text-xs text-zinc-400 dark:text-zinc-500">${escapeHtml(id)}</span>
      <span class="truncate font-medium text-zinc-900 dark:text-zinc-100">${escapeHtml(name)}</span>
    </div>
    ${tail ? `<div class="truncate text-xs text-zinc-500 dark:text-zinc-400">${escapeHtml(tail)}</div>` : ''}
  `;

  const actions = document.createElement('div');
  actions.className = 'flex shrink-0 items-center gap-1';
  actions.innerHTML = [
    iconBtn('up', 'Move up', index === 0),
    iconBtn('down', 'Move down', index === total - 1),
    iconBtn('edit', 'Edit', false),
    iconBtn('delete', 'Delete', false),
  ].join('');

  row.appendChild(main);
  row.appendChild(actions);
  return row;
}

// ---- wiring (filled in across later tasks) ----

function wireListContainer(entity) {
  const c = listContainer(entity);
  if (!c || c.dataset.wired === '1') return;
  c.dataset.wired = '1';
  c.addEventListener('click', (e) => {
    const cancelBtn = e.target.closest('[data-cancel-delete]');
    if (cancelBtn) { renderRows(entity); return; }

    const confirmBtn = e.target.closest('[data-confirm-delete]');
    if (confirmBtn) {
      const id = confirmBtn.closest('[data-content-row]')?.dataset.contentRow;
      if (id) confirmDelete(entity, id);
      return;
    }

    const btn = e.target.closest('[data-content-action]');
    if (!btn || btn.disabled) return;
    const id = btn.closest('[data-content-row]')?.dataset.contentRow;
    if (!id) return;
    const action = btn.dataset.contentAction;
    if (action === 'up' || action === 'down') reorder(entity, id, action);
    else if (action === 'edit') openEditor(entity, 'edit', id);
    else if (action === 'delete') armDelete(entity, btn.closest('[data-content-row]'), id);
  });
}

function wireHeaderButtons(entity) {
  $(`[data-content-add="${entity}"]`, workspaceRoot)
    ?.addEventListener('click', () => openEditor(entity, 'create', null));
  $(`[data-content-refresh="${entity}"]`, workspaceRoot)
    ?.addEventListener('click', () => { renderLoading(entity); loadAndRender(entity); });
}

// Implemented in later tasks:
function reorder() {}
function armDelete() {}
function confirmDelete() {}
function openEditor() {}
