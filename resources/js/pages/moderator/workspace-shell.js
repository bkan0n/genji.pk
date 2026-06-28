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

// Wire a map search input: code/name autocomplete pick auto-loads; Enter loads
// the raw trimmed value (a map code). deps must provide http,
// attachMapCodeAutocomplete, attachMapNameAutocomplete, toast. onLoad(code)
// does the work.
//
// VERIFIED in moderator.js: for non-user kinds wireAutocomplete's onPick payload
// is { value } ONLY — it never carries a `code`. attachMapNameAutocomplete →
// wireAutocomplete(kind: 'map-names'), whose items are { value: pickText(v) },
// and pickText prefers name/map_name/title over code. So a NAME pick's `value`
// is the human-readable map name, NOT a code — calling onLoad(value) directly
// would query /api/maps?code=<name> and never resolve. We therefore resolve the
// picked name to a real code via GET /api/maps?map_name=<value> before onLoad.
// (The maps API coerces a string map_name into a one-element array server-side,
//  matching MapSearchController's arrayish handling.) The code fast-path is kept
// in case a future payload ever includes a code. attachMapCodeAutocomplete →
// wireAutocomplete(kind: 'map-codes'), which fills input.value with the picked
// code; the Enter handler then loads that raw value as a code.
export function wireMapSearch(input, { deps, onLoad }) {
  if (!input) return;
  deps.attachMapNameAutocomplete(input, async ({ value, code }) => {
    // Fast-path: if a usable code is ever present, load it directly.
    const direct = String(code || '').trim();
    if (direct) return onLoad(direct);

    const name = String(value || '').trim();
    if (!name) return;

    // Resolve the picked name to a code before loading.
    let res;
    try {
      res = await deps.http('GET', '/api/maps', { query: { map_name: name } });
    } catch {
      return deps.toast(`Couldn't resolve "${name}" — try again.`, 'err');
    }
    const item = pickMapItem(res?.data);
    const resolved = item && item.code != null ? String(item.code).trim() : '';
    if (res?.ok && resolved) return onLoad(resolved);
    deps.toast(`No map code found for "${name}".`, 'err');
  });
  deps.attachMapCodeAutocomplete(input);
  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const code = (input.value || '').trim();
    if (code) onLoad(code);
    else deps.toast('Enter a map code or pick a suggestion', 'warn');
  });
}

// Extract a single map record from a /api/maps response, matching the
// pickItem-style extraction the maps-workspace loader uses.
function pickMapItem(data) {
  if (Array.isArray(data)) return data[0] || null;
  if (data && typeof data === 'object') return (data.items?.[0] ?? data.data?.items?.[0] ?? data) || null;
  return null;
}
