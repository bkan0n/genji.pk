import { $, $$ } from './workspace-shell.js';

let DEPS = null;
let workspaceRoot = null;

const ENTITIES = {
  categories: { singular: 'Category', plural: 'Categories', outKey: 'content-categories-res' },
  difficulties: { singular: 'Difficulty', plural: 'Difficulties', outKey: 'content-difficulties-res' },
  techniques: { singular: 'Technique', plural: 'Techniques', outKey: 'content-techniques-res' },
};

// Entity collections that have already been fetched, so re-entering a sub-tab
// re-renders (cheap) instead of re-fetching.
const loadedEntities = new Set();

export function initContentWorkspace(deps) {
  DEPS = deps;
  workspaceRoot = $('[data-content-workspace]');
  if (!workspaceRoot) return;

  Object.keys(ENTITIES).forEach((entity) => {
    wireListContainer(entity);
    wireHeaderButtons(entity);
    renderLoading(entity);
  });

  // Lazy-load each entity's collection the first time its sub-tab is entered,
  // then re-render on subsequent entries (in case rows changed while away).
  // Loading eagerly in init would fetch every collection on page load, even
  // when the Content tab is never opened.
  $$('[data-subtab^="content-"]', workspaceRoot).forEach((btn) => {
    btn.addEventListener('click', () => {
      const entity = subtabEntity(btn.getAttribute('data-subtab'));
      if (entity) enterContentSubtab(entity);
    });
  });
}

async function ensureEntityLoaded(entity) {
  if (loadedEntities.has(entity)) return false;
  loadedEntities.add(entity);
  renderLoading(entity);
  await loadAndRender(entity);
  return true;
}

async function enterContentSubtab(entity) {
  // The technique editor's category + difficulty pickers read from those two
  // caches, so load them alongside Techniques whenever that sub-tab is opened.
  if (entity === 'techniques') {
    ensureEntityLoaded('categories');
    ensureEntityLoaded('difficulties');
  }
  const didLoad = await ensureEntityLoaded(entity);
  if (!didLoad) renderRows(entity);
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

// ---- event wiring ----

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
      if (id) {
        // Neutralise the button before the async delete so a second click
        // during the round-trip can't fire a duplicate request.
        confirmBtn.disabled = true;
        confirmBtn.removeAttribute('data-confirm-delete');
        confirmDelete(entity, id);
      }
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

async function reorder(entity, id, direction) {
  const c = listContainer(entity);
  const row = c?.querySelector(`[data-content-row="${CSS.escape(String(id))}"]`);

  // Optimistic swap so the move feels instant.
  if (row) {
    const sibling = direction === 'up' ? row.previousElementSibling : row.nextElementSibling;
    if (sibling?.dataset.contentRow) {
      if (direction === 'up') c.insertBefore(row, sibling);
      else c.insertBefore(sibling, row);
    }
    row.querySelectorAll('[data-content-action]').forEach((b) => (b.disabled = true));
  }

  try {
    return await DEPS.submitMovementTechRequest(null, {
      method: 'POST',
      path: `/${entity}/${id}/reorder`,
      title: `Reorder movement tech ${ENTITIES[entity].singular.toLowerCase()} #${id}`,
      outKey: ENTITIES[entity].outKey,
      body: { direction },
      successMessage: `${ENTITIES[entity].singular} reordered`,
      failureMessage: `Failed to reorder ${ENTITIES[entity].singular.toLowerCase()}`,
      silentSuccess: true,
    });
  } finally {
    // Reconcile from server truth (also reverts the optimistic swap, even on a
    // thrown network error, so a failed reorder never leaves the row stuck in
    // its swapped position with permanently-disabled buttons).
    await loadAndRender(entity);
  }
}

function makeIdForm(id) {
  // A detached form whose named control `id` is reachable as form.id
  // (HTMLFormElement override-builtins), matching what the handlers read.
  const form = document.createElement('form');
  const input = document.createElement('input');
  input.name = 'id';
  input.value = String(id);
  form.appendChild(input);
  return form;
}

function armDelete(entity, row, id) {
  if (!row) return;
  // Raw fallback is fine: `name` is escaped at the innerHTML sink below.
  const name = items(entity).find((it) => String(it?.id) === String(id))?.name ?? `#${id}`;
  row.innerHTML = `
    <div class="min-w-0 flex-1 text-sm text-zinc-700 dark:text-zinc-200">Delete “${escapeHtml(String(name))}”?</div>
    <div class="flex shrink-0 items-center gap-2">
      <button type="button" data-confirm-delete class="cursor-pointer rounded-lg border border-rose-500/40 px-3 py-1 text-sm font-semibold text-rose-600 dark:text-rose-300 hover:bg-rose-500/10">Delete</button>
      <button type="button" data-cancel-delete class="cursor-pointer rounded-lg border border-zinc-200/80 dark:border-white/10 px-3 py-1 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-white/5">Cancel</button>
    </div>`;
}

async function confirmDelete(entity, id) {
  const meta = ENTITIES[entity];
  const form = makeIdForm(id);
  try {
    return entity === 'techniques'
      ? await DEPS.handleContentTechniqueDelete(form)
      : await DEPS.handleContentDeleteNamedEntity(form, entity, meta.singular, meta.outKey);
  } finally {
    // Always reconcile from cache so a failed/thrown delete restores the row
    // instead of leaving it frozen in its "Delete X?" armed state.
    renderRows(entity);
  }
}

function buildOverlay({ title, subtitle, formNode, onSave }) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-[350] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4';

  const panel = document.createElement('div');
  panel.className = 'w-full max-w-2xl max-h-[85vh] overflow-auto rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 shadow-2xl space-y-5';
  panel.innerHTML = `
    <div class="flex items-start justify-between gap-4">
      <div>
        <h3 class="font-semibold">${escapeHtml(title)}</h3>
        ${subtitle ? `<p class="text-xs text-zinc-500 dark:text-zinc-400">${escapeHtml(subtitle)}</p>` : ''}
      </div>
      <button type="button" data-close aria-label="Close" class="cursor-pointer rounded-lg border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-white/5">&#x2715;</button>
    </div>`;
  panel.appendChild(formNode);

  const actions = document.createElement('div');
  actions.className = 'flex flex-wrap items-center gap-2';
  actions.innerHTML = `
    <button type="button" data-save class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Save</button>
    <button type="button" data-cancel class="cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 px-4 py-2 font-semibold hover:bg-zinc-100 dark:hover:bg-white/5">Cancel</button>`;
  panel.appendChild(actions);
  overlay.appendChild(panel);

  const onKey = (e) => { if (e.key === 'Escape') close(); };
  function close() {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
  }
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  panel.querySelector('[data-close]').addEventListener('click', close);
  actions.querySelector('[data-cancel]').addEventListener('click', close);

  const saveBtn = actions.querySelector('[data-save]');
  saveBtn.addEventListener('click', async () => {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';
    try {
      const ok = await onSave(formNode);
      if (ok) { close(); return; }
    } catch (_) { /* keep modal open on unexpected error */ }
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save';
  });

  document.addEventListener('keydown', onKey);
  DEPS.appendOverlay(overlay);
  return { overlay, close };
}

function cloneTemplate(name) {
  const tpl = $(`[data-content-tpl="${name}"]`, workspaceRoot);
  return tpl.content.firstElementChild.cloneNode(true);
}

function openEditor(entity, mode, id) {
  if (entity === 'techniques') openTechniqueEditor(mode, id);
  else openNamedEditor(entity, mode, id);
}

function openNamedEditor(entity, mode, id) {
  const meta = ENTITIES[entity];
  const formNode = cloneTemplate('named');

  if (mode === 'edit') {
    const item = items(entity).find((it) => String(it?.id) === String(id));
    formNode.id.value = String(id);
    formNode.name.value = item?.name ?? '';
  }

  buildOverlay({
    title: mode === 'edit' ? `Edit ${meta.singular.toLowerCase()}` : `Add ${meta.singular.toLowerCase()}`,
    formNode,
    onSave: async (form) => {
      const res = mode === 'edit'
        ? await DEPS.handleContentUpdateNamedEntity(form, entity, meta.singular, meta.outKey)
        : await DEPS.handleContentCreateNamedEntity(form, entity, meta.singular, meta.outKey);
      if (res?.ok) { renderRows(entity); return true; }
      return false;
    },
  });

  setTimeout(() => formNode.name?.focus(), 0);
}

function openTechniqueEditor(mode, id) {
  const formNode = cloneTemplate('technique');
  formNode.dataset.action = mode === 'edit' ? 'content-technique-update' : 'content-technique-create';

  // Edit-only UI (current tips/videos + "start from empty" toggles) is hidden when creating.
  if (mode !== 'edit') {
    formNode.querySelectorAll('[data-mt-current], [data-mt-clear]')
      .forEach((el) => el.classList.add('hidden'));
  }

  const { overlay } = buildOverlay({
    title: mode === 'edit' ? 'Edit technique' : 'Add technique',
    subtitle: 'Tips and videos keep their visual order as sort order.',
    formNode,
    onSave: async (form) => {
      const res = mode === 'edit'
        ? await DEPS.handleContentTechniqueUpdate(form)
        : await DEPS.handleContentTechniqueCreate(form);
      if (res?.ok) { await loadAndRender('techniques'); return true; }
      return false;
    },
  });

  // Wire the custom pickers + tips/videos repeaters now that the form is in the DOM.
  DEPS.wireDdSelect(overlay);
  DEPS.movementTechPopulateContentDropdowns('categories');
  DEPS.movementTechPopulateContentDropdowns('difficulties');
  DEPS.movementTechInitTechniqueEditor(formNode);

  if (mode === 'edit') {
    formNode.id.value = String(id);
    // GET the full record and hydrate name/description/category/difficulty/current rows + snapshot.
    DEPS.loadContentTechniqueIntoUpdateForm(formNode, ENTITIES.techniques.outKey);
  }

  setTimeout(() => formNode.name?.focus(), 0);
}
