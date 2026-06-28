// Shared scaffolding for moderator "find a user → act" workspaces.
// Used by users-workspace.js and lootbox-workspace.js.

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Strip <@123>, spaces, non-digits → bare ID (string, precision-safe).
export function cleanId(raw) {
  const m = String(raw || '').match(/\d{5,}/);
  return m ? m[0] : '';
}

// Prefer the id stored by autocomplete (dataset.uid) over the visible value,
// which holds the display name after a pick.
export function pickedId(input) {
  return cleanId(input?.dataset?.uid || '') || cleanId(input?.value || '');
}

// Toggle the loading/error/loaded views within a workspace root.
export function setView(root, view) {
  for (const name of ['loading', 'error', 'loaded']) {
    const el = $(`[data-view="${name}"]`, root);
    if (el) el.classList.toggle('hidden', name !== view);
  }
}

// localStorage-backed recent-lookups store, parameterized by key.
export function makeRecentStore(storageKey, max = 8) {
  const get = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
      return [];
    }
  };
  const push = (entry) => {
    if (!entry || !entry.id) return;
    const clean = { id: String(entry.id), name: entry.name || String(entry.id) };
    const list = get().filter((r) => r && r.id && r.id !== clean.id);
    list.unshift(clean);
    localStorage.setItem(storageKey, JSON.stringify(list.slice(0, max)));
  };
  return { get, push };
}

// Render recent-lookup chips into `wrap`, calling onPick(id) on click.
export function renderRecentChips(wrap, store, onPick) {
  if (!wrap) return;
  wrap.innerHTML = '';
  for (const r of store.get()) {
    if (!r || !r.id) continue;
    const label = r.name && r.name !== 'undefined' ? r.name : String(r.id);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className =
      'rounded-full border border-zinc-200/80 dark:border-white/10 px-3 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-white/10';
    btn.textContent = label;
    btn.onclick = () => onPick(r.id);
    wrap.appendChild(btn);
  }
}

// Wire a search input: autocomplete pick auto-loads; Enter loads by id.
// deps must provide wireAutocomplete + toast. onLoad(id) does the work.
export function wireUserSearch(input, { deps, onLoad }) {
  if (!input) return;
  deps.wireAutocomplete(input, {
    kind: 'users',
    onPick: ({ id }) => {
      if (id) onLoad(String(id));
    },
  });
  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const id = pickedId(input);
    if (id) onLoad(id);
    else deps.toast('Enter a user ID or pick a suggestion', 'warn');
  });
}

// Wire a map search input: code-only. This is a single-map-code editing console,
// so there is no map-NAME search and no name→code resolution. Code autocomplete
// suggests matching codes; selecting a suggestion (click or Enter on the open
// list) auto-loads, and Enter on a raw typed code loads it too. deps must provide
// wireAutocomplete + toast. onLoad(code) does the work.
//
// We call wireAutocomplete directly (rather than attachMapCodeAutocomplete) so we
// can pass an onPick that loads on selection. The `justPicked` flag stops the
// Enter keydown below from loading a second time when the autocomplete's own
// Enter handler already picked + loaded (it doesn't stopPropagation).
export function wireMapSearch(input, { deps, onLoad }) {
  if (!input) return;
  let justPicked = false;
  deps.wireAutocomplete(input, {
    kind: 'map-codes',
    onPick: ({ value }) => {
      justPicked = true;
      const code = (value || '').trim();
      if (code) onLoad(code);
    },
  });
  input.addEventListener('input', () => {
    justPicked = false;
  });
  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (justPicked) {
      justPicked = false;
      return;
    }
    const code = (input.value || '').trim();
    if (code) onLoad(code);
    else deps.toast('Enter a map code or pick a suggestion', 'warn');
  });
}
