import { $, $$, setView, makeRecentStore, renderRecentChips, wireMapSearch } from './workspace-shell.js';

let DEPS = null;
const recent = makeRecentStore('mod.maps.recent');
let CURRENT = null; // loaded map object
let metaObserver = null; // single observer for the static meta spans; disconnected/recreated on each bind

export function initMapWorkspace(deps) {
  DEPS = deps;
  const root = $('[data-maps-workspace]');
  if (!root) return;
  setView(root, 'empty');

  wireSubtabs(root);

  const search = $('[data-maps-search]', root);
  wireMapSearch(search, { deps: DEPS, onLoad: (code) => loadMap(root, code) });
  search?.focus();
  search?.addEventListener('paste', () => setTimeout(() => { search.value = search.value.trim().replace(/^#/, ''); }, 0));
  renderRecent(root);
  // Build the separate submit-new-map tool's dropdowns/banner/medals once.
  // The form's submit is handled by moderator.js's existing form[data-action]
  // dispatcher, which bound it at load (the form is server-rendered in the
  // partial), so no extra submit wiring is needed here.
  DEPS.initSubmitPanel?.();
}

// Local sub-tab toggle (Edit map / Submit new map). Deliberately NOT using the
// global .mod-subtab machinery: that hides every [data-subpanel] and resets
// section state on switch, which would wipe the loaded map's edits. This only
// shows/hides panes, so edit state is preserved across switches.
function wireSubtabs(root) {
  const btns = $$('[data-maps-subtab]', root);
  const panes = $$('[data-maps-pane]', root);
  for (const btn of btns) {
    btn.addEventListener('click', () => {
      const name = btn.dataset.mapsSubtab;
      for (const pane of panes) pane.classList.toggle('hidden', pane.dataset.mapsPane !== name);
      for (const b of btns) {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', String(active));
      }
    });
  }
}

function renderRecent(root) {
  const wrap = $('[data-maps-recent]', root);
  renderRecentChips(wrap, recent, (code) => loadMap(root, code));
}

async function loadMap(root, code) {
  // Unsaved-edits guard: if block-B fields are dirty (save bar visible),
  // confirm before discarding and loading a different map. Abort the load
  // entirely on cancel, leaving the current map + edits intact.
  const form = document.getElementById('u-updateMapForm');
  const bar = $('[data-fields-bar]', root);
  if (form && bar && !bar.classList.contains('hidden')) {
    if (!confirm('You have unsaved map changes. Discard them and load another map?')) return;
  }
  setView(root, 'loading');
  let res;
  try {
    res = await DEPS.http('GET', '/api/maps', { query: { code } });
  } catch {
    return showError(root, 'Network error — try again.');
  }
  // Loader retries archived maps, matching handleLoadMapForUpdate.
  let item = pickItem(res.data);
  if (res.ok && !item) {
    const arch = await DEPS.http('GET', '/api/maps', { query: { code, archived: true } });
    DEPS.logActivity({ title: 'Load archived map', method: 'GET', url: arch.url, ok: arch.ok, status: arch.status, data: arch.data });
    res = arch;
    item = pickItem(arch.data);
  }
  DEPS.logActivity({ title: 'Load map', method: 'GET', url: res.url, ok: res.ok, status: res.status, data: res.data });
  if (!res.ok) return showError(root, res.data?.message || `Lookup failed (${res.status}).`);
  if (!item) return showError(root, `No map found for "${code}".`);

  CURRENT = item;
  // Recent chips show the map code (this is a code-keyed editing console).
  recent.push({ id: String(item.code), name: String(item.code) });
  renderRecent(root);
  renderProfile(root, item); // no-op until a later task
  setView(root, 'loaded');
}

function pickItem(data) {
  if (Array.isArray(data)) return data[0] || null;
  if (data && typeof data === 'object') return (data.items?.[0] ?? data.data?.items?.[0] ?? data) || null;
  return null;
}

function showError(root, message) {
  const box = $('[data-maps-error]', root);
  if (box) box.textContent = message;
  setView(root, 'error');
  DEPS.toast('Lookup failed', 'err');
}

function setText(root, sel, value) {
  const el = $(sel, root);
  if (el) el.textContent = value;
}

function renderProfile(root, map) {
  setText(root, '[data-field-view="map_name"]', map.map_name || '—');
  setText(root, '[data-field-view="code"]', String(map.code || '—'));

  const copyBtn = $('[data-copy-code]', root);
  if (copyBtn) copyBtn.onclick = () => { navigator.clipboard?.writeText(String(map.code || '')); DEPS.toast('Code copied', 'ok'); };

  const chip = (key, val) => {
    const el = $(`[data-chip="${key}"]`, root);
    if (!el) return;
    if (val) { el.textContent = val; el.classList.remove('hidden'); } else { el.classList.add('hidden'); }
  };
  chip('difficulty', map.difficulty);
  chip('category', map.category);

  const archived = map.archived ?? map.is_archived ?? false;
  const badge = (key, on) => $(`[data-badge="${key}"]`, root)?.classList.toggle('hidden', !on);
  badge('archived', !!archived);
  badge('official', !!map.official);
  badge('hidden', !!map.hidden);

  // bindFields / bindGuides / bindActions added in later tasks.
  if (typeof bindFields === 'function') bindFields(root, map);
  if (typeof bindGuides === 'function') bindGuides(root, map);
  if (typeof bindActions === 'function') bindActions(root, map);
}

// ———————————————————————————————————————————————————————————————
// Block B — inline map fields with a module-owned dirty-tracking save bar.
// Reuses the existing #u-updateMapForm markup and its machinery
// (initUpdatePanel / populateUpdatePanel) verbatim. The module owns dirty
// detection and the PATCH (adapted from handleUpdateMap in moderator.js).
// ———————————————————————————————————————————————————————————————

let fieldsReady = false;

async function bindFields(root, map) {
  const form = document.getElementById('u-updateMapForm');
  const bar = $('[data-fields-bar]', root);
  if (!form || !bar) return;
  // The form ships with a legacy `hidden` class (the old loader used to reveal it);
  // in this workspace it is always shown once a map is loaded.
  form.classList.remove('hidden');

  // Build dropdowns/banner/edit-buttons once (idempotent), then fill from the map.
  if (!fieldsReady) {
    await DEPS.initUpdatePanel();
    fieldsReady = true;
  }
  DEPS.populateUpdatePanel(map);
  // populateUpdatePanel sets loadedMapArchived for release-code; mirror defensively.
  form.dataset.loadedMapArchived = String(map.archived ?? map.is_archived ?? false);

  let baseline = fieldSignature(form);
  const saveBtn = $('[data-fields-save]', root);
  const resetBtn = $('[data-fields-reset]', root);

  const refresh = () => {
    const dirty = fieldSignature(form) !== baseline;
    bar.classList.toggle('hidden', !dirty);
  };
  // Catch input + change (dropdowns/inputs) and clicks (block-edit, checkboxes).
  form.oninput = refresh;
  form.onchange = refresh;
  form.onclick = () => setTimeout(refresh, 0);
  // Meta spans store values in textContent / data-raw-id; observe them.
  // bindFields runs on every load AND save, but the meta spans are never recreated,
  // so disconnect any prior observer before recreating to avoid accumulation.
  if (metaObserver) metaObserver.disconnect();
  metaObserver = new MutationObserver(() => refresh());
  for (const id of ['u-metaCode', 'u-metaMap', 'u-metaCheckpoints', 'u-metaCreatorMain', 'u-metaCreatorSecond']) {
    const el = document.getElementById(id);
    if (el) metaObserver.observe(el, { childList: true, characterData: true, attributes: true, subtree: true });
  }

  if (resetBtn) resetBtn.onclick = () => { DEPS.populateUpdatePanel(CURRENT); baseline = fieldSignature(form); refresh(); };
  if (saveBtn) saveBtn.onclick = () => saveFields(root, form, () => { baseline = fieldSignature(form); refresh(); });
  refresh();
}

// A normalized, order-stable string capturing every field's current value.
function fieldSignature(form) {
  const t = (id) => (document.getElementById(id)?.textContent || '').trim();
  const v = (id) => (document.getElementById(id)?.value || '').trim();
  const raw = (id) => document.getElementById(id)?.getAttribute('data-raw-id') || '';
  const checked = (id) => document.getElementById(id)?.checked === true;
  return JSON.stringify({
    code: t('u-metaCode'), name: t('u-metaMap'), cps: t('u-metaCheckpoints'),
    c1: raw('u-metaCreatorMain'), c2: raw('u-metaCreatorSecond'),
    diff: DEPS.getSelectedRadio('#u-difficultyDropdown'),
    cat: DEPS.getSelectedRadio('#u-categoryDropdown'),
    play: DEPS.getSelectedRadio('#u-playtestingDropdown'),
    mech: DEPS.getCheckedValues('#u-mechanicsDropdown'),
    rest: DEPS.getCheckedValues('#u-restrictionsDropdown'),
    tags: DEPS.getCheckedValues('#u-tagsDropdown'),
    hidden: checked('u-flagHidden'), archived: checked('u-flagArchived'), official: checked('u-flagOfficial'),
    title: v('u-optTitleInput'), desc: t('u-optDescription'),
    gold: v('u-medalGoldInput'), silver: v('u-medalSilverInput'), bronze: v('u-medalBronzeInput'),
  });
}

async function saveFields(root, form, onSaved) {
  const codeEl = document.getElementById('u-metaCode');
  const editedCode = (codeEl?.textContent || '').trim();
  const codePath = (codeEl?.dataset?.originalCode || editedCode || '').trim();
  if (!codePath || /^n\/?a$/i.test(editedCode)) return DEPS.toast('Map code required', 'warn');

  const medals = DEPS.validateUpdateMedals(true);
  if (!medals.ok) return DEPS.toast(medals.error || 'Invalid medals.', 'warn');

  let custom_banner = null;
  try { if (window.customBannerFileUpdate) custom_banner = await DEPS.uploadImageGeneric(window.customBannerFileUpdate); }
  catch { return DEPS.toast('Banner upload failed', 'err'); }

  const name = (document.getElementById('u-metaMap')?.textContent || '').trim();
  const checkpoints = Number((document.getElementById('u-metaCheckpoints')?.textContent || '').trim());
  const category = DEPS.getSelectedRadio('#u-categoryDropdown');
  const difficulty = DEPS.getSelectedRadio('#u-difficultyDropdown');
  const mechanics = DEPS.getCheckedValues('#u-mechanicsDropdown');
  const restrictions = DEPS.getCheckedValues('#u-restrictionsDropdown');
  const tags = DEPS.getCheckedValues('#u-tagsDropdown');
  const description = (document.getElementById('u-optDescription')?.textContent || '').trim();
  const title = (document.getElementById('u-optTitleInput')?.value || '').trim().slice(0, 128);
  const hidden = document.getElementById('u-flagHidden')?.checked === true;
  const archived = document.getElementById('u-flagArchived')?.checked === true;
  const official = document.getElementById('u-flagOfficial')?.checked === true;
  const playtesting = DEPS.getSelectedRadio('#u-playtestingDropdown');

  // Payload assembled to match handleUpdateMap in moderator.js exactly.
  const payload = {};
  const put = (k, val) => { if (val !== '' && val != null && !(Array.isArray(val) && val.length === 0)) payload[k] = val; };
  put('map_name', name && !/^n\/?a$/i.test(name) ? name : undefined);
  put('code', editedCode);
  if (Number.isFinite(checkpoints)) put('checkpoints', checkpoints);
  put('category', category || undefined);
  put('difficulty', difficulty || undefined);
  if (mechanics.length) put('mechanics', mechanics);
  if (restrictions.length) put('restrictions', restrictions);
  if (tags.length) put('tags', tags);
  if (description && !/^n\/?a$/i.test(description)) put('description', description);
  if (title) put('title', title);
  if (custom_banner) put('custom_banner', custom_banner);
  if (medals.values) put('medals', medals.values);
  put('hidden', hidden);
  put('archived', archived);
  payload.official = official;
  if (playtesting) put('playtesting', playtesting);

  const c1 = document.getElementById('u-metaCreatorMain')?.getAttribute('data-raw-id') || '';
  const c2 = document.getElementById('u-metaCreatorSecond')?.getAttribute('data-raw-id') || '';
  const creators = [];
  if (c1) creators.push({ id: c1, is_primary: true });
  if (c2) creators.push({ id: c2, is_primary: false });
  if (creators.length) put('creators', creators);

  const saveBtn = $('[data-fields-save]', root); if (saveBtn) saveBtn.disabled = true;
  const { ok, status, url, data } = await DEPS.http('PATCH', `/api/mods/maps/${encodeURIComponent(codePath)}`, { body: payload });
  DEPS.logActivity({ title: 'Update map', method: 'PATCH', url, ok, status, data });
  if (saveBtn) saveBtn.disabled = false;
  if (!ok) return DEPS.toast(data?.message || `Save failed (${status}).`, 'err');

  DEPS.toast('Saved', 'ok');
  if (codeEl) codeEl.dataset.originalCode = editedCode;
  const next = pickItem(data) || { ...CURRENT, ...buildLocalMap({ name, checkpoints, category, difficulty, mechanics, restrictions, tags, description, title, hidden, archived, official, playtesting, medals: medals.values, creators }) };
  CURRENT = next;
  renderProfile($('[data-maps-workspace]'), next);
  onSaved?.();
}

// Local fallback when the PATCH response has no map body — keeps the workspace
// in sync with what was just saved without a refetch.
function buildLocalMap(c) {
  const out = {};
  if (c.name && !/^n\/?a$/i.test(c.name)) out.map_name = c.name;
  if (Number.isFinite(c.checkpoints)) out.checkpoints = c.checkpoints;
  if (c.category) out.category = c.category;
  if (c.difficulty) out.difficulty = c.difficulty;
  if (c.mechanics?.length) out.mechanics = c.mechanics;
  if (c.restrictions?.length) out.restrictions = c.restrictions;
  if (c.tags?.length) out.tags = c.tags;
  if (c.description && !/^n\/?a$/i.test(c.description)) out.description = c.description;
  if (c.title) out.title = c.title;
  if (c.medals) out.medals = c.medals;
  if (c.playtesting) out.playtesting = c.playtesting;
  out.hidden = c.hidden;
  out.archived = c.archived;
  out.official = c.official;
  if (c.creators?.length) out.creators = c.creators;
  return out;
}

// ———————————————————————————————————————————————————————————————
// Block C — inline guides list for the loaded map (Task 4).
// Endpoints/verbs/params mirror moderator.js's handleGetGuides /
// handleCreateGuide / handleEditGuide / handleDeleteGuide exactly:
//   GET    /api/maps/{code}/guides            ?include_records=true
//   POST   /api/mods/maps/{code}/guides       body { url, user_id }
//   PATCH  /api/mods/maps/{code}/guides/{uid} ?url=...   (url is a query param)
//   DELETE /api/mods/maps/{code}/guides/{uid} (guide identified by user_id)
// GET returns a bare array; each row has user_id (string) + usernames[] (+ url, records).
// There is no `name` field, so the display label is derived from usernames.
// ———————————————————————————————————————————————————————————————

function guideUserId(g) { return String(g.user_id ?? g.id ?? ''); }

// usernames may be an array of strings or of objects ({ username, ... }).
// Fall back to the user id when no readable name is present.
function guideName(g) {
  const uid = guideUserId(g);
  const list = Array.isArray(g.usernames) ? g.usernames : [];
  for (const u of list) {
    const name = typeof u === 'string' ? u : (u?.username ?? u?.name ?? '');
    if (name) return String(name);
  }
  return g.name ? String(g.name) : uid;
}

async function bindGuides(root, map) {
  const code = String(map.code || '');
  const listEl = $('[data-guides-list]', root);
  const countEl = $('[data-guides-count]', root);
  const addForm = $('[data-guides-add]', root);
  if (!listEl || !countEl || !addForm) return;

  const reload = async () => {
    const { ok, status, url, data } = await DEPS.http('GET', `/api/maps/${encodeURIComponent(code)}/guides`, { query: { include_records: true } });
    DEPS.logActivity({ title: 'Get guides', method: 'GET', url, ok, status, data });
    const guides = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
    countEl.textContent = ok ? `${guides.length} guide${guides.length === 1 ? '' : 's'}` : '';
    listEl.innerHTML = '';
    if (!ok) { listEl.innerHTML = `<p class="text-sm text-red-600">Failed to load guides (${status}).</p>`; return; }
    if (!guides.length) { listEl.innerHTML = `<p class="text-sm text-zinc-500">No guides yet.</p>`; return; }
    for (const g of guides) listEl.appendChild(renderGuideRow(code, g, reload));
  };

  const userInput = addForm.querySelector('input[name="user_id"]');
  DEPS.attachUsersAutocomplete(userInput);
  addForm.onsubmit = async (e) => {
    e.preventDefault();
    const user_id = DEPS.getUserIdFrom(userInput);
    const urlVal = (addForm.querySelector('input[name="url"]').value || '').trim();
    if (!user_id || !urlVal) return DEPS.toast('Creator and URL are required', 'warn');
    const r = await DEPS.http('POST', `/api/mods/maps/${encodeURIComponent(code)}/guides`, { body: { url: urlVal, user_id } });
    DEPS.logActivity({ title: 'Create guide', method: 'POST', url: r.url, ok: r.ok, status: r.status, data: r.data });
    DEPS.toast(r.ok ? 'Guide added' : (r.data?.message || 'Failed'), r.ok ? 'ok' : 'err');
    if (r.ok) { addForm.reset(); reload(); }
  };

  await reload();
}

function renderGuideRow(code, g, reload) {
  const uid = guideUserId(g);
  const row = document.createElement('div');
  row.className = 'flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/40 px-3 py-2';
  const name = guideName(g);
  row.innerHTML = `
    <span class="min-w-[8rem] text-sm font-medium">${escapeHtml(name)}</span>
    <input data-guide-url value="${escapeHtml(g.url || '')}" class="flex-1 min-w-[12rem] rounded-md border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-2 py-1 text-sm" />
    <button type="button" data-guide-save class="rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">Save</button>
    <button type="button" data-guide-del class="rounded-md border border-red-300/60 px-2 py-1 text-sm text-red-700 dark:text-red-300 hover:bg-red-500/10">Delete</button>`;
  row.querySelector('[data-guide-save]').onclick = async () => {
    const urlVal = (row.querySelector('[data-guide-url]').value || '').trim();
    if (!urlVal) return DEPS.toast('URL is required', 'warn');
    const r = await DEPS.http('PATCH', `/api/mods/maps/${encodeURIComponent(code)}/guides/${encodeURIComponent(uid)}`, { query: { url: urlVal } });
    DEPS.logActivity({ title: 'Edit guide', method: 'PATCH', url: r.url, ok: r.ok, status: r.status, data: r.data });
    DEPS.toast(r.ok ? 'Guide updated' : (r.data?.message || 'Failed'), r.ok ? 'ok' : 'err');
    if (r.ok) reload();
  };
  row.querySelector('[data-guide-del]').onclick = async () => {
    if (!confirm(`Delete ${name}'s guide for map ${code}?`)) return;
    const r = await DEPS.http('DELETE', `/api/mods/maps/${encodeURIComponent(code)}/guides/${encodeURIComponent(uid)}`);
    DEPS.logActivity({ title: 'Delete guide', method: 'DELETE', url: r.url, ok: r.ok, status: r.status, data: r.data });
    DEPS.toast(r.ok ? 'Guide deleted' : (r.data?.message || 'Failed'), r.ok ? 'ok' : 'err');
    if (r.ok) reload();
  };
  return row;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ———————————————————————————————————————————————————————————————
// Block D — collapsed disclosure of heavier/destructive actions (Task 5).
// Each action reuses the real moderator.js handler via DEPS, so the request
// shape stays identical to the legacy panels:
//   archive   → handleArchiveMaps(syntheticForm)   PATCH /api/mods/maps/archive?code=…  body { status, codes:[code] }
//   convert   → handleConvertLegacy(syntheticForm) POST  /api/mods/maps/{code}/legacy[?reason=…]
//   release   → handleReleaseMapCode(realForm)     PATCH /api/mods/maps/{code}/release-code
//   editreq   → openMapEditRequestModal(map, {})   (opens the modal; no request here)
//
// Confirmation policy (exactly one prompt per destructive action):
//  - archive/convert issue NO confirm of their own → we add a confirm() here.
//  - handleReleaseMapCode runs its OWN showConfirmDanger → we add NO confirm,
//    and pass the real #u-updateMapForm so its #u-metaCode + dataset reads work.
// ———————————————————————————————————————————————————————————————

function bindActions(root, map) {
  const code = String(map.code || '');
  const archived = !!(map.archived ?? map.is_archived);

  // handleArchiveMaps reads form.status.value, form.mode?.value, form.code.value.
  // 'single' mode never calls form.querySelectorAll, but we expose it defensively.
  // It issues no confirm of its own, so we add one here.
  // The backend (ArchiveMapsController) validates status against Rule::in(['Archive', 'Unarchived'])
  // — note the asymmetric casing/tense — so send those exact strings.
  const archiveBtn = $('[data-action-archive]', root);
  if (archiveBtn) archiveBtn.onclick = async () => {
    if (!code) return;
    const toStatus = archived ? 'Unarchived' : 'Archive';
    const verb = archived ? 'Unarchive' : 'Archive';
    if (!confirm(`${verb} map ${code}?`)) return;
    await DEPS.handleArchiveMaps({
      status: { value: toStatus },
      mode: { value: 'single' },
      code: { value: code },
      querySelectorAll: () => [],
    });
    loadMap(root, code);
  };

  // handleConvertLegacy reads form.code?.value, form.reason?.value, and
  // form.querySelector('button[type="submit"]') for its busy-state. It issues
  // no confirm of its own, so we add one here. querySelector must not throw.
  const convertBtn = $('[data-action-convert]', root);
  if (convertBtn) convertBtn.onclick = async () => {
    if (!code) return;
    const reason = ($('[data-convert-reason]', root)?.value || '').trim();
    if (!confirm(`Convert map ${code} to legacy?`)) return;
    await DEPS.handleConvertLegacy({
      code: { value: code },
      reason: { value: reason },
      querySelector: () => null,
    });
    loadMap(root, code);
  };

  // handleReleaseMapCode reads form.querySelector('#u-metaCode').textContent +
  // form.dataset.loadedMapArchived, and runs its OWN showConfirmDanger — so we
  // pass the real form and add no confirm here (single prompt). Only archived
  // maps can release a code, so the button is shown only when archived.
  const releaseBtn = $('[data-action-release]', root);
  if (releaseBtn) {
    releaseBtn.classList.toggle('hidden', !archived);
    releaseBtn.onclick = async () => {
      const form = document.getElementById('u-updateMapForm');
      if (!form) return;
      await DEPS.handleReleaseMapCode(form);
      loadMap(root, code);
    };
  }

  // openMapEditRequestModal(map, opts) takes the loaded map object and prefills
  // the modal from it; passing {} keeps default url-sync behavior.
  const editReqBtn = $('[data-action-editrequest]', root);
  if (editReqBtn) editReqBtn.onclick = () => DEPS.openMapEditRequestModal(map, {});
}
