import { $, setView, makeRecentStore, renderRecentChips, wireMapSearch } from './workspace-shell.js';

let DEPS = null;
const recent = makeRecentStore('mod.maps.recent');
let CURRENT = null; // loaded map object

export function initMapWorkspace(deps) {
  DEPS = deps;
  const root = $('[data-maps-workspace]');
  if (!root) return;
  setView(root, 'empty');

  const search = $('[data-maps-search]', root);
  wireMapSearch(search, { deps: DEPS, onLoad: (code) => loadMap(root, code) });
  renderRecent(root);
  // Submit-new-map tool mounted in a later task.
}

function renderRecent(root) {
  const wrap = $('[data-maps-recent]', root);
  renderRecentChips(wrap, recent, (code) => loadMap(root, code));
}

async function loadMap(root, code) {
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
  recent.push({ id: String(item.code), name: item.map_name || String(item.code) });
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
  const mo = new MutationObserver(() => refresh());
  for (const id of ['u-metaCode', 'u-metaMap', 'u-metaCheckpoints', 'u-metaCreatorMain', 'u-metaCreatorSecond']) {
    const el = document.getElementById(id);
    if (el) mo.observe(el, { childList: true, characterData: true, attributes: true, subtree: true });
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
