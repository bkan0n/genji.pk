import {
  $, $$, pickedId, setView, makeRecentStore, renderRecentChips, wireUserSearch, withBusy,
} from './workspace-shell.js';

const API_MODS = '/api/mods';

let DEPS = null;
const recent = makeRecentStore('mod.users.recent');
let CURRENT = null; // loaded user object

// The display name already stored for a user (the "(aka)" label captured at pick
// time), so re-loads via chip click or save don't downgrade it to a plain name.
const recentName = (id) => {
  const hit = recent.get().find((r) => r.id === String(id));
  return hit && hit.name && hit.name !== String(id) ? hit.name : '';
};

export function initUsersWorkspace(deps) {
  DEPS = deps;
  const root = $('[data-users-workspace]');
  if (!root) return;
  setView(root, 'empty');

  const search = $('[data-users-search]', root);
  // On pick, wireAutocomplete sets input.value to the name and stores the real
  // id in dataset.uid; auto-load on pick, and prefer dataset.uid on Enter.
  wireUserSearch(search, { deps: DEPS, onLoad: (id, name) => loadUser(root, id, name) });
  renderRecent(root);
  bindCreateFake();
}

async function loadUser(root, userId, displayName = '') {
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
  recent.push({
    id: String(data.id),
    name: displayName || recentName(String(data.id)) || data.coalesced_name || String(data.id),
  });
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
  bindSections(root, user);
}

function setText(root, sel, value) {
  const el = $(sel, root);
  if (el) el.textContent = value;
}

function bindSections(root, user) {
  bindNames(root, user);
  bindAliases(root, user);
  bindLink(root, user);
}

function bindNames(root, user) {
  const gn = $('[data-field="global_name"]', root);
  const nn = $('[data-field="nickname"]', root);
  const saveBtn = $('[data-save="names"]', root);
  const resetBtn = $('[data-reset="names"]', root);
  const dirtyTag = $('[data-dirty="names"]', root);

  const baseline = {
    global_name: user.global_name ?? '',
    nickname: user.nickname ?? '',
  };
  const fill = () => {
    gn.value = baseline.global_name;
    nn.value = baseline.nickname;
  };
  fill();

  const isDirty = () => gn.value !== baseline.global_name || nn.value !== baseline.nickname;
  const refresh = () => {
    const dirty = isDirty();
    saveBtn.disabled = !dirty;
    dirtyTag.classList.toggle('hidden', !dirty);
  };
  gn.oninput = refresh;
  nn.oninput = refresh;
  gn.onkeydown = nn.onkeydown = (e) => {
    if (e.key === 'Enter' && !saveBtn.disabled) withBusy(saveBtn, saveNames);
  };
  resetBtn.onclick = () => {
    fill();
    refresh();
  };
  refresh();

  async function saveNames() {
    const body = {};
    if (gn.value !== baseline.global_name) body.global_name = gn.value === '' ? null : gn.value;
    if (nn.value !== baseline.nickname) body.nickname = nn.value === '' ? null : nn.value;
    if (Object.keys(body).length === 0) return;
    // Nullable unset confirm
    if (body.global_name === null || body.nickname === null) {
      const confirmed = await DEPS.showConfirmDanger({
        title: 'Clear name field',
        message: 'You are clearing a name field to empty. Continue?',
        confirm: 'Clear it',
      });
      if (!confirmed) return;
    }

    const { ok, status, url, data } = await DEPS.http(
      'PATCH',
      `${API_MODS}/users/${encodeURIComponent(user.id)}`,
      { body }
    );
    DEPS.logActivity({ title: 'Update Names', method: 'PATCH', url, ok, status, data });
    if (!ok) {
      DEPS.toast(data?.message || `Save failed (${status})`, 'err');
      return; // keep edits intact
    }
    // Adopt updated values; refresh header if coalesced_name changed.
    baseline.global_name = gn.value;
    baseline.nickname = nn.value;
    if (data && 'coalesced_name' in data)
      setText(root, '[data-field-view="coalesced_name"]', data.coalesced_name || '—');
    refresh();
    DEPS.toast('Names saved', 'ok');
  }

  saveBtn.onclick = () => withBusy(saveBtn, saveNames);
}

function bindAliases(root, user) {
  const rows = $$('[data-alias-row]', root);
  const saveBtn = $('[data-save="aliases"]', root);
  const resetBtn = $('[data-reset="aliases"]', root);
  const dirtyTag = $('[data-dirty="aliases"]', root);

  // GET /users/{id} returns overwatch_usernames as an ordered array of strings,
  // primary first (index 0). Coerce to the { username, is_primary } shape the
  // editor uses. (Defensive: also accept an object entry with a username field.)
  const src = Array.isArray(user.overwatch_usernames) ? user.overwatch_usernames : [];
  const baseline = src
    .map((entry) => (typeof entry === 'string' ? entry : (entry?.username ?? '')))
    .filter((name) => String(name).trim() !== '')
    .slice(0, 3)
    .map((name, i) => ({ username: String(name), is_primary: i === 0 }));
  while (baseline.length < 3) baseline.push({ username: '', is_primary: false });

  const setPrimary = (row, on) =>
    $('[data-alias-primary]', row).setAttribute('data-primary', on ? 'true' : 'false');
  const getPrimary = (row) =>
    $('[data-alias-primary]', row).getAttribute('data-primary') === 'true';

  const fill = () => {
    rows.forEach((row, i) => {
      $('[data-alias-name]', row).value = baseline[i].username;
      setPrimary(row, baseline[i].is_primary);
    });
  };

  const current = () =>
    rows.map((row) => ({
      username: $('[data-alias-name]', row).value.trim(),
      is_primary: getPrimary(row),
    }));
  const nonEmpty = (list) => list.filter((a) => a.username !== '');

  const validate = (list) => {
    const filled = nonEmpty(list);
    if (filled.length === 0) return { ok: true, payload: [] };
    const primaries = filled.filter((a) => a.is_primary).length;
    if (primaries !== 1) return { ok: false, reason: 'Exactly one alias must be primary.' };
    const names = filled.map((a) => a.username.toLowerCase());
    if (new Set(names).size !== names.length) return { ok: false, reason: 'Duplicate aliases.' };
    if (filled.some((a) => a.username.length > 64))
      return { ok: false, reason: 'Alias too long (max 64).' };
    return { ok: true, payload: filled };
  };

  const baselineKey = () =>
    JSON.stringify(
      baseline.map((b) => ({ username: b.username.trim(), is_primary: b.is_primary }))
    );
  const isDirty = () => JSON.stringify(current()) !== baselineKey();
  const refresh = () => {
    const dirty = isDirty();
    const valid = validate(current()).ok;
    saveBtn.disabled = !(dirty && valid);
    dirtyTag.classList.toggle('hidden', !dirty);
  };

  rows.forEach((row) => {
    $('[data-alias-name]', row).oninput = refresh;
    $('[data-alias-primary]', row).onclick = () => {
      rows.forEach((r) => setPrimary(r, r === row));
      refresh();
    };
  });
  resetBtn.onclick = () => {
    fill();
    refresh();
  };
  fill();
  refresh();

  async function saveAliases() {
    const result = validate(current());
    if (!result.ok) {
      DEPS.toast(result.reason, 'warn');
      return;
    }
    const { ok, status, url, data } = await DEPS.http(
      'PUT',
      `${API_MODS}/users/${encodeURIComponent(user.id)}/overwatch`,
      { body: { usernames: result.payload } }
    );
    DEPS.logActivity({ title: 'Replace OW Aliases', method: 'PUT', url, ok, status, data });
    if (!ok) {
      DEPS.toast(data?.message || `Save failed (${status})`, 'err');
      return;
    }
    // New baseline = saved set, padded back to 3 rows.
    const saved = result.payload.slice(0, 3);
    for (let i = 0; i < 3; i++)
      baseline[i] = saved[i] ? { ...saved[i] } : { username: '', is_primary: false };
    fill();
    refresh();
    DEPS.toast('Aliases saved', 'ok');
  }

  saveBtn.onclick = () => withBusy(saveBtn, saveAliases);
}

function bindCreateFake() {
  const name = $('[data-fake-name]');
  const submit = $('[data-fake-submit]');
  const result = $('[data-fake-result]');
  if (!name || !submit) return;

  const create = async () => {
    const value = name.value.trim();
    if (!value) {
      DEPS.toast('Name required', 'warn');
      return;
    }
    const { ok, status, url, data } = await DEPS.http('POST', `${API_MODS}/users/fake`, {
      query: { name: value },
    });
    DEPS.logActivity({ title: 'Create Fake Member', method: 'POST', url, ok, status, data });
    if (!ok) {
      DEPS.toast(data?.message || `Create failed (${status})`, 'err');
      return;
    }
    const newId = data?.id ?? data?.user_id ?? '';
    if (result) result.textContent = newId ? `Created: ${newId}` : 'Created';
    name.value = '';
    DEPS.toast('Fake member created', 'ok');
  };

  submit.onclick = () => withBusy(submit, create);
  name.onkeydown = (e) => {
    if (e.key === 'Enter') withBusy(submit, create);
  };
}

function bindLink(root, user) {
  const dir = $('[data-link-direction]', root);
  const other = $('[data-link-other]', root);
  const submit = $('[data-link-submit]', root);

  // Autocomplete fills the input value with the picked user_id.
  DEPS.attachUsersAutocomplete(other);

  submit.onclick = () => withBusy(submit, async () => {
    const otherId = pickedId(other);
    if (!otherId) {
      DEPS.toast('Pick the other account', 'warn');
      return;
    }
    // Direction: "this user is the real/fake account".
    const thisIsReal = dir.value === 'real';
    const realId = thisIsReal ? String(user.id) : otherId;
    const fakeId = thisIsReal ? otherId : String(user.id);
    if (realId === fakeId) {
      DEPS.toast('Cannot link an account to itself', 'warn');
      return;
    }
    const confirmed = await DEPS.showConfirmDanger({
      title: 'Link accounts',
      message: `Link fake ${fakeId} → real ${realId}? This cannot be easily undone.`,
      confirm: 'Link accounts',
    });
    if (!confirmed) return;

    const { ok, status, url, data } = await DEPS.http(
      'PUT',
      `${API_MODS}/users/fake/${encodeURIComponent(fakeId)}/link/${encodeURIComponent(realId)}`
    );
    DEPS.logActivity({ title: 'Link Fake→Real', method: 'PUT', url, ok, status, data });
    DEPS.toast(ok ? 'Linked' : data?.message || `Link failed (${status})`, ok ? 'ok' : 'err');
    if (ok) {
      other.value = '';
    }
  });
}

// --- Recent lookups (localStorage, via shared shell) ---
function renderRecent(root) {
  renderRecentChips($('[data-users-recent]', root), recent, (id) => loadUser(root, id));
}
