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
// suggests matching codes; Enter loads the raw trimmed value (a map code). deps
// must provide attachMapCodeAutocomplete + toast. onLoad(code) does the work.
//
// attachMapCodeAutocomplete → wireAutocomplete(kind: 'map-codes'), which fills
// input.value with the picked code but exposes no pick callback through this
// deps surface, so loading is driven by Enter (and works for both a typed code
// and a picked suggestion, since both leave the code in input.value).
export function wireMapSearch(input, { deps, onLoad }) {
  if (!input) return;
  deps.attachMapCodeAutocomplete(input);
  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const code = (input.value || '').trim();
    if (code) onLoad(code);
    else deps.toast('Enter a map code or pick a suggestion', 'warn');
  });
}
