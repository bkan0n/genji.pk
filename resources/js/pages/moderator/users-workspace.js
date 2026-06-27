const API_MODS = '/api/mods';

let DEPS = null;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const RECENT_KEY = 'mod.users.recent';
let CURRENT = null; // loaded user object

export function initUsersWorkspace(deps) {
  DEPS = deps;
  const root = $('[data-users-workspace]');
  if (!root) return;
  setView(root, 'empty');

  const search = $('[data-users-search]', root);
  if (search) {
    DEPS.attachUsersAutocomplete(search); // suggestion fills value with user_id
    search.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      const id = cleanId(search.value);
      if (id) loadUser(root, id);
      else DEPS.toast('Enter a user ID or pick a suggestion', 'warn');
    });
  }
  renderRecent(root);
}

// Strip <@123>, spaces, non-digits → bare ID (string, precision-safe).
function cleanId(raw) {
  const m = String(raw || '').match(/\d{5,}/);
  return m ? m[0] : '';
}

async function loadUser(root, userId) {
  setView(root, 'loading');
  let res;
  try {
    res = await DEPS.http('GET', `${API_MODS}/users/${encodeURIComponent(userId)}`);
  } catch (err) {
    return showError(root, 'Network error — try again.');
  }
  const { ok, status, url, data } = res;
  DEPS.logActivity({ title: 'Get User', method: 'GET', url, ok, status, data });
  if (!ok) {
    return showError(root, data?.message || `Lookup failed (${status}).`);
  }
  CURRENT = data;
  pushRecent({ id: String(data.id), name: data.coalesced_name || String(data.id) });
  renderRecent(root);
  renderProfile(root, data);
  setView(root, 'loaded');
}

function showError(root, message) {
  const box = $('[data-users-error]', root);
  if (box) box.textContent = message;
  setView(root, 'error');
  DEPS.toast('Lookup failed', 'err');
}

function renderProfile(root, user) {
  setText(root, '[data-field-view="coalesced_name"]', user.coalesced_name || '—');
  setText(root, '[data-field-view="id"]', String(user.id));
  setText(root, '[data-field-view="coins"]', Number(user.coins || 0).toLocaleString());
  const copyBtn = $('[data-copy-id]', root);
  if (copyBtn)
    copyBtn.onclick = () => {
      navigator.clipboard?.writeText(String(user.id));
      DEPS.toast('ID copied', 'ok');
    };
  // Names / aliases / link sections bound in later tasks via bindSections(root, user).
  if (typeof bindSections === 'function') bindSections(root, user);
}

function setText(root, sel, value) {
  const el = $(sel, root);
  if (el) el.textContent = value;
}

// --- Recent lookups (localStorage) ---
function getRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
}
function pushRecent(entry) {
  const list = getRecent().filter((r) => r.id !== entry.id);
  list.unshift(entry);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 8)));
}
function renderRecent(root) {
  const wrap = $('[data-users-recent]', root);
  if (!wrap) return;
  const list = getRecent();
  wrap.innerHTML = '';
  for (const r of list) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className =
      'rounded-full border border-zinc-200/80 dark:border-white/10 px-3 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-white/10';
    btn.textContent = r.name;
    btn.onclick = () => loadUser(root, r.id);
    wrap.appendChild(btn);
  }
}

function setView(root, view) {
  for (const name of ['loading', 'error', 'loaded']) {
    const el = $(`[data-view="${name}"]`, root);
    if (el) el.classList.toggle('hidden', name !== view);
  }
}
