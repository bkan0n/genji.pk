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
  const clear = () => localStorage.removeItem(storageKey);
  return { get, push, clear };
}

// Render recent-lookup chips into `wrap`, calling onPick(id) on click. When any
// chips exist, a trailing "Clear" button empties the store and re-renders.
export function renderRecentChips(wrap, store, onPick) {
  if (!wrap) return;
  wrap.innerHTML = '';
  const entries = store.get();
  for (const r of entries) {
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
  if (entries.some((r) => r && r.id)) {
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className =
      'rounded-full px-3 py-1 text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200';
    clear.textContent = 'Clear';
    clear.onclick = () => {
      store.clear();
      renderRecentChips(wrap, store, onPick);
    };
    wrap.appendChild(clear);
  }
}

// Wire a search input: autocomplete pick auto-loads; Enter loads by id.
// deps must provide wireAutocomplete + toast. onLoad(id) does the work.
export function wireUserSearch(input, { deps, onLoad }) {
  if (!input) return;
  deps.wireAutocomplete(input, {
    kind: 'users',
    // Forward the picked label ("name (aka nickname)") so callers can store it
    // for recent-chip display, matching what the dropdown shows.
    onPick: ({ id, label }) => {
      if (id) onLoad(String(id), label);
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

// A pulsing placeholder block for skeleton loading states. `animate-pulse` is the
// app-wide skeleton idiom; `motion-reduce:animate-none` leaves a static block for
// users who ask for reduced motion.
export function skel(classes = 'h-4 w-24') {
  return `<div class="animate-pulse motion-reduce:animate-none rounded-md bg-zinc-200/80 dark:bg-white/10 ${classes}"></div>`;
}

// Map an HTTP status (0 / falsy = network failure) to a plain-language message.
// `noun` names the thing being loaded; `notFound` overrides the 404 line where a
// tailored sentence reads better than the generic one.
export function httpErrorMessage(status, { noun = 'data', notFound } = {}) {
  if (!status) return 'Network error — check your connection and try again.';
  if (status === 401) return 'Your session expired — refresh the page and sign in again.';
  if (status === 403) return `You don't have permission to view ${noun}.`;
  if (status === 404) return notFound || `Couldn't find ${noun}.`;
  if (status === 408 || status === 504) return 'The server took too long to respond — try again.';
  if (status === 429) return 'Too many requests — wait a moment and try again.';
  if (status >= 500) return `The server hit an error loading ${noun} — try again shortly.`;
  return `Couldn't load ${noun} (error ${status}).`;
}

// Run an async action while visibly disabling its trigger, so a double-click
// can't fire the same request twice. Re-enables even if the action throws.
export async function withBusy(btn, fn) {
  if (btn?.disabled) return undefined;
  if (btn) {
    btn.disabled = true;
    btn.classList.add('opacity-60', 'cursor-not-allowed');
  }
  try {
    return await fn();
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('opacity-60', 'cursor-not-allowed');
    }
  }
}
