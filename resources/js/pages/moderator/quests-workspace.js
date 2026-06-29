import { $, $$ } from './workspace-shell.js';

let DEPS = null;
const ROOT = () => $('[data-quests-workspace]');
const API_MODS = '/api/mods';

const REWARD_TIERS = ['easy', 'medium', 'hard'];
const REQ_DIFFICULTIES = ['any', 'Easy', 'Medium', 'Hard', 'Very Hard', 'Extreme', 'Hell'];
const MAP_CATEGORIES = ['Classic', 'Increasing Difficulty', 'Other'];
const MEDAL_TYPES = ['gold', 'silver', 'bronze'];
const TARGET_TYPES = ['medal_threshold', 'percentile', 'personal_best'];
const REQ_TYPES = [
  'complete_maps', 'complete_difficulty_range', 'earn_medals',
  'beat_time', 'beat_rival', 'complete_map',
];
const GLOBAL_REQ_TYPES = ['complete_maps', 'complete_difficulty_range', 'earn_medals'];
const BOUNTY_TYPE_BY_REQ = {
  beat_time: 'personal_improvement',
  beat_rival: 'rival_challenge',
  complete_map: 'gap_filling',
};

const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Tracks which sub-tabs have already auto-loaded this session.
const loaded = { config: false, global: false };

// Verbatim copy of the store-workspace button-pending lifecycle.
function setFormPending(form, pending = true, submitter = null) {
  const btns = Array.from(form.querySelectorAll('button[type="submit"], button:not([type])'));
  if (pending) {
    form.setAttribute('aria-busy', 'true');
    btns.forEach((btn) => {
      if (btn.dataset.pendingWired !== '1') {
        btn.dataset.pendingWired = '1';
        btn.dataset.pendingText = btn.textContent || 'Submit';
      }
      btn.disabled = true;
      btn.classList.add('opacity-70');
      if (!submitter || btn === submitter) btn.textContent = 'Working...';
    });
    return;
  }
  form.removeAttribute('aria-busy');
  btns.forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove('opacity-70');
    if (btn.dataset.pendingText) btn.textContent = btn.dataset.pendingText;
  });
}

// Toggle loading/error/loaded views within a card.
function setView(card, view) {
  ['loading', 'error', 'loaded'].forEach((name) => {
    const el = card.querySelector(`[data-view="${name}"]`);
    if (el) el.classList.toggle('hidden', name !== view);
  });
}

const subpanel = (name) => $(`[data-subpanel="${name}"]`, ROOT());

// Lazy-load a sub-tab's data on first entry (config/global) or reset (user).
function onSubtabEnter(name) {
  if (name === 'quest-config' && !loaded.config) { loaded.config = true; loadConfig(); }
  if (name === 'quest-global' && !loaded.global) { loaded.global = true; loadGlobalQuests(); }
}

function wireSubtabAutoLoad() {
  const root = ROOT();
  if (!root) return;
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('.mod-subtab');
    if (btn) onSubtabEnter(btn.dataset.subtab);
  });
}

const DOW = [
  { value: 1, label: 'Monday' }, { value: 2, label: 'Tuesday' }, { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' }, { value: 5, label: 'Friday' }, { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
];

function renderConfigCard(cfg) {
  const sp = subpanel('quest-config');
  if (!sp) return;
  sp.innerHTML = `
    <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-6">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="font-semibold">Quest config</h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-400">Rotation timing + per-tier quest counts. Edit in place, then save.</p>
        </div>
        <button type="button" data-config-refresh class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-2 py-1.5 text-xs font-semibold hover:bg-zinc-200/70 dark:hover:bg-white/10">↻ Refresh</button>
      </div>
      <form data-quest-config-form class="grid gap-4 sm:grid-cols-2">
        <label class="text-sm">Rotation day ${buildSelect('rotation_day', DOW, cfg.rotation_day)}</label>
        <label class="text-sm">Rotation hour (UTC)
          <input name="rotation_hour" type="number" min="0" max="23" step="1" value="${escapeHtml(cfg.rotation_hour ?? '')}"
            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" /></label>
        <label class="text-sm">Easy quests / rotation
          <input name="easy_quest_count" type="number" min="0" step="1" value="${escapeHtml(cfg.easy_quest_count ?? '')}"
            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" /></label>
        <label class="text-sm">Medium quests / rotation
          <input name="medium_quest_count" type="number" min="0" step="1" value="${escapeHtml(cfg.medium_quest_count ?? '')}"
            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" /></label>
        <label class="text-sm sm:col-span-2">Hard quests / rotation
          <input name="hard_quest_count" type="number" min="0" step="1" value="${escapeHtml(cfg.hard_quest_count ?? '')}"
            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" /></label>
        <div class="sm:col-span-2"><button type="submit" class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Save</button></div>
      </form>
    </article>`;
  sp.querySelector('[data-config-refresh]').onclick = () => loadConfig({ announce: true });
  sp.querySelector('[data-quest-config-form]').addEventListener('submit', onSaveConfig);
}

async function loadConfig({ announce = false } = {}) {
  const sp = subpanel('quest-config');
  if (!sp) return;
  sp.innerHTML = `<p class="text-sm text-zinc-500 dark:text-zinc-400">Loading quest config…</p>`;
  const res = await DEPS.http('GET', `${API_MODS}/quests/config`);
  DEPS.logActivity({ title: 'Quest config (GET)', method: 'GET', url: res.url || `${API_MODS}/quests/config`, ok: res.ok, status: res.status, data: res.data });
  if (!res.ok) {
    sp.innerHTML = `<p class="text-sm text-rose-500">Failed to load quest config.</p>`;
    DEPS.toast('Failed to load quest config', 'err');
    return;
  }
  const cfg = (res.data && (res.data.config || res.data.data)) || res.data || {};
  renderConfigCard(cfg);
  if (announce) DEPS.toast('Quest config refreshed', 'ok');
}

async function onSaveConfig(e) {
  e.preventDefault();
  if (!DEPS.isDevAllowed()) return DEPS.toast('Dev access only', 'err');
  const form = e.currentTarget;
  const fd = new FormData(form);
  const payload = {};
  for (const k of ['rotation_day', 'rotation_hour', 'easy_quest_count', 'medium_quest_count', 'hard_quest_count']) {
    const v = fd.get(k);
    if (v !== '' && v != null) payload[k] = Number(v);
  }
  if (!Object.keys(payload).length) return DEPS.toast('Nothing to update', 'warn');
  setFormPending(form, true, e.submitter);
  try {
    const res = await DEPS.http('PUT', `${API_MODS}/quests/config`, { body: payload });
    DEPS.logActivity({ title: 'Quest config (PUT)', method: 'PUT', url: res.url || `${API_MODS}/quests/config`, ok: res.ok, status: res.status, data: res.data });
    if (!res.ok) return DEPS.toast('Update failed', 'err');
    DEPS.toast('Quest config updated', 'ok');
    await loadConfig();
  } finally {
    setFormPending(form, false, e.submitter);
  }
}

// Renders requirement inputs for a given requirements.type into `host`.
// `req` is the existing requirements object. `allowedTypes` limits the type select.
// Wires map/user fields. Returns nothing; read values later via collectRequirements.
function renderRequirements(host, type, req = {}, allowedTypes = REQ_TYPES) {
  const rows = [];
  const numField = (name, val, { step = '1', mode = 'numeric' } = {}) =>
    `<label class="text-sm">${name}
      <input name="${name}" type="number" step="${step}" inputmode="${mode}" value="${escapeHtml(val ?? '')}"
        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" /></label>`;
  const mapField = (label, val) =>
    `<label class="text-sm relative block">${label}
      <input data-req-map type="text" autocomplete="off" placeholder="Search map code…"
        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" data-init-map="${escapeHtml(val ?? '')}" /></label>`;

  if (type === 'complete_maps') {
    rows.push(numField('count', req.count));
    rows.push(`<label class="text-sm">difficulty ${buildSelect('req_difficulty', REQ_DIFFICULTIES, req.difficulty || 'any')}</label>`);
    rows.push(`<label class="text-sm">category ${buildSelect('req_category', MAP_CATEGORIES, req.category, { placeholder: '(none)' })}</label>`);
  } else if (type === 'complete_difficulty_range') {
    rows.push(`<label class="text-sm">difficulty ${buildSelect('req_difficulty', REQ_DIFFICULTIES.filter((d) => d !== 'any'), req.difficulty)}</label>`);
    rows.push(numField('min_count', req.min_count));
  } else if (type === 'earn_medals') {
    rows.push(numField('count', req.count));
    rows.push(`<label class="text-sm">medal_type ${buildSelect('req_medal_type', [...MEDAL_TYPES, 'any'], req.medal_type || 'any')}</label>`);
  } else if (type === 'beat_time') {
    rows.push(mapField('map', req.map_id));
    rows.push(numField('target_time (s)', req.target_time, { step: '0.01', mode: 'decimal' }));
    rows.push(`<label class="text-sm">target_type ${buildSelect('req_target_type', TARGET_TYPES, req.target_type)}</label>`);
    rows.push(numField('current_best (s)', req.current_best, { step: '0.01', mode: 'decimal' }));
    rows.push(`<label class="text-sm">medal_type ${buildSelect('req_medal_type', MEDAL_TYPES, req.medal_type, { placeholder: '(none)' })}</label>`);
  } else if (type === 'beat_rival') {
    rows.push(mapField('map', req.map_id));
    rows.push(`<label class="text-sm relative block">rival<input data-req-user type="text" autocomplete="off" placeholder="Search user…" data-init-uid="${escapeHtml(req.rival_user_id ?? '')}" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" /></label>`);
    rows.push(numField('rival_time (s)', req.rival_time, { step: '0.01', mode: 'decimal' }));
    rows.push(numField('target_time (s)', req.target_time, { step: '0.01', mode: 'decimal' }));
  } else if (type === 'complete_map') {
    rows.push(mapField('map', req.map_id));
    rows.push(`<label class="text-sm">target<input name="req_target" type="text" readonly value="complete" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900/60 px-3 py-2 text-sm" /></label>`);
  }

  host.innerHTML = `
    <label class="text-sm block">requirement type ${buildSelect('req_type', allowedTypes, type)}</label>
    <div class="grid gap-3 sm:grid-cols-2" data-req-fields>${rows.join('')}</div>`;

  // Re-render on type change.
  host.querySelector('select[name="req_type"]').addEventListener('change', (e) => {
    renderRequirements(host, e.target.value, {}, allowedTypes);
  });
  // Wire map/user fields.
  const mapInput = host.querySelector('[data-req-map]');
  if (mapInput) wireMapField(mapInput, { initialMapId: mapInput.dataset.initMap || null });
  const userInput = host.querySelector('[data-req-user]');
  if (userInput) wireUserField(userInput, { initialId: userInput.dataset.initUid || null });
}

// Reads requirement values back out of `host`. async (map resolution may be needed).
async function collectRequirements(host) {
  const type = host.querySelector('select[name="req_type"]')?.value;
  if (!type) return null;
  const req = { type };
  const get = (n) => host.querySelector(`[name="${n}"]`)?.value ?? '';
  const num = (n, float = false) => {
    const v = get(n); if (v === '') return undefined;
    const x = float ? Number(v) : parseInt(v, 10); return Number.isFinite(x) ? x : undefined;
  };
  const setIf = (k, v) => { if (v !== undefined && v !== '' && v !== null) req[k] = v; };
  const mapInput = host.querySelector('[data-req-map]');
  const userInput = host.querySelector('[data-req-user]');

  if (type === 'complete_maps') {
    setIf('count', num('count'));
    setIf('difficulty', get('req_difficulty'));
    setIf('category', get('req_category'));
  } else if (type === 'complete_difficulty_range') {
    setIf('difficulty', get('req_difficulty')); setIf('min_count', num('min_count'));
  } else if (type === 'earn_medals') {
    setIf('count', num('count')); setIf('medal_type', get('req_medal_type'));
  } else if (type === 'beat_time') {
    setIf('map_id', await readMapId(mapInput)); setIf('target_time', num('target_time (s)', true));
    setIf('target_type', get('req_target_type')); setIf('current_best', num('current_best (s)', true));
    setIf('medal_type', get('req_medal_type'));
  } else if (type === 'beat_rival') {
    setIf('map_id', await readMapId(mapInput)); const rid = readUserId(userInput);
    if (rid) req.rival_user_id = Number(rid);
    setIf('rival_time', num('rival_time (s)', true)); setIf('target_time', num('target_time (s)', true));
  } else if (type === 'complete_map') {
    setIf('map_id', await readMapId(mapInput)); req.target = 'complete';
  }
  return req;
}

let GLOBAL_QUESTS = [];

function reqSummary(r) {
  if (!r || !r.type) return '—';
  if (r.type === 'complete_maps') return `complete ${r.count ?? '?'} maps${r.difficulty && r.difficulty !== 'any' ? ` (${r.difficulty})` : ''}${r.category ? ` [${r.category}]` : ''}`;
  if (r.type === 'complete_difficulty_range') return `${r.min_count ?? '?'}× ${r.difficulty ?? '?'}`;
  if (r.type === 'earn_medals') return `${r.count ?? '?'}× ${r.medal_type ?? 'any'} medals`;
  return r.type;
}

function renderGlobalList() {
  const sp = subpanel('quest-global');
  if (!sp) return;
  const cards = GLOBAL_QUESTS.map((q) => `
    <article class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-950/30 p-4" data-quest-card="${q.id}">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-semibold truncate">${escapeHtml(q.name)}</span>
            <span class="rounded-full bg-zinc-200/70 dark:bg-white/10 px-2 py-0.5 text-[11px] uppercase">${escapeHtml(q.difficulty)}</span>
            <span class="rounded-full px-2 py-0.5 text-[11px] ${q.is_active ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300' : 'bg-zinc-400/15 text-zinc-500'}">${q.is_active ? 'active' : 'inactive'}</span>
          </div>
          <div class="mt-1 text-xs text-zinc-500 dark:text-zinc-400 truncate">${escapeHtml(q.description || '')}</div>
          <div class="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">${escapeHtml(reqSummary(q.requirements))} · ${q.coin_reward}c / ${q.xp_reward}xp</div>
        </div>
        <button type="button" data-edit-quest="${q.id}" class="shrink-0 rounded-lg border border-zinc-200/80 dark:border-white/10 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">Edit</button>
      </div>
    </article>`).join('');
  sp.innerHTML = `
    <div class="flex items-center justify-between gap-3">
      <h3 class="font-semibold">Global quest pool</h3>
      <button type="button" data-global-refresh class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-2 py-1.5 text-xs font-semibold hover:bg-zinc-200/70 dark:hover:bg-white/10">↻ Refresh</button>
    </div>
    <div class="space-y-3">${cards || '<p class="text-sm text-zinc-500 dark:text-zinc-400">No quests in the pool.</p>'}</div>`;
  sp.querySelector('[data-global-refresh]').onclick = () => loadGlobalQuests({ force: true });
  sp.querySelectorAll('[data-edit-quest]').forEach((b) =>
    b.addEventListener('click', () => openGlobalEditor(Number(b.dataset.editQuest))));
}

async function loadGlobalQuests({ force = false } = {}) {
  const sp = subpanel('quest-global');
  if (!sp) return;
  if (force) loaded.global = true;
  sp.innerHTML = `<p class="text-sm text-zinc-500 dark:text-zinc-400">Loading quest pool…</p>`;
  const res = await DEPS.http('GET', `${API_MODS}/quests`);
  DEPS.logActivity({ title: 'List quests (GET)', method: 'GET', url: res.url || `${API_MODS}/quests`, ok: res.ok, status: res.status, data: res.data });
  if (!res.ok) {
    sp.innerHTML = `<p class="text-sm text-rose-500">Failed to load quest pool.</p>`;
    DEPS.toast('Failed to load quest pool', 'err');
    return;
  }
  GLOBAL_QUESTS = Array.isArray(res.data) ? res.data : (res.data?.quests || res.data?.items || res.data?.data || []);
  renderGlobalList();
}

function openGlobalEditor(id) {
  const q = GLOBAL_QUESTS.find((x) => Number(x.id) === id);
  const card = subpanel('quest-global').querySelector(`[data-quest-card="${id}"]`);
  if (!q || !card) return;
  if (card.querySelector('[data-global-editor]')) { card.querySelector('[data-global-editor]').remove(); return; }
  const box = document.createElement('div');
  box.dataset.globalEditor = '1';
  box.className = 'mt-4 border-t border-zinc-200/80 dark:border-white/10 pt-4 space-y-4';
  box.innerHTML = `
    <div class="grid gap-3 sm:grid-cols-2">
      <label class="text-sm sm:col-span-2">name<input name="name" value="${escapeHtml(q.name)}" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm" /></label>
      <label class="text-sm sm:col-span-2">description<input name="description" value="${escapeHtml(q.description || '')}" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm" /></label>
      <label class="text-sm">reward tier ${buildSelect('difficulty', REWARD_TIERS, q.difficulty)}</label>
      <label class="text-sm">is_active ${buildSelect('is_active', [{ value: '1', label: 'active' }, { value: '0', label: 'inactive' }], q.is_active ? '1' : '0')}</label>
      <label class="text-sm">coin_reward<input name="coin_reward" type="number" min="0" value="${escapeHtml(q.coin_reward ?? '')}" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm" /></label>
      <label class="text-sm">xp_reward<input name="xp_reward" type="number" min="0" value="${escapeHtml(q.xp_reward ?? '')}" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm" /></label>
    </div>
    <div data-req-host class="space-y-3"></div>
    <div class="flex gap-2">
      <button type="button" data-save class="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">Save (affects everyone)</button>
      <button type="button" data-cancel class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-3 py-2 text-sm">Cancel</button>
    </div>`;
  card.appendChild(box);
  renderRequirements(box.querySelector('[data-req-host]'), q.requirements?.type || 'complete_maps', q.requirements || {}, GLOBAL_REQ_TYPES);
  box.querySelector('[data-cancel]').onclick = () => box.remove();
  box.querySelector('[data-save]').onclick = () => saveGlobalQuest(id, box);
}

async function saveGlobalQuest(id, box) {
  if (!DEPS.isDevAllowed()) return DEPS.toast('Dev access only', 'err');
  const q = GLOBAL_QUESTS.find((x) => Number(x.id) === id);
  const get = (n) => box.querySelector(`[name="${n}"]`)?.value ?? '';
  const payload = {};
  if (get('name') !== q.name) payload.name = get('name');
  if (get('description') !== (q.description || '')) payload.description = get('description');
  if (get('difficulty') !== q.difficulty) payload.difficulty = get('difficulty');
  if ((get('is_active') === '1') !== !!q.is_active) payload.is_active = get('is_active') === '1';
  if (get('coin_reward') !== '' && Number(get('coin_reward')) !== q.coin_reward) payload.coin_reward = Number(get('coin_reward'));
  if (get('xp_reward') !== '' && Number(get('xp_reward')) !== q.xp_reward) payload.xp_reward = Number(get('xp_reward'));
  const req = await collectRequirements(box.querySelector('[data-req-host]'));
  if (req && JSON.stringify(req) !== JSON.stringify(q.requirements || {})) payload.requirements = req;
  if (!Object.keys(payload).length) return DEPS.toast('Nothing to update', 'warn');
  const ok = await DEPS.showConfirmDanger({
    title: 'Update global quest', message: `Save changes to "${q.name}"? This changes the quest for everyone.`, confirm: 'Save', cancel: 'Cancel',
  });
  if (!ok) return;
  const res = await DEPS.http('PATCH', `${API_MODS}/quests/${id}`, { body: payload });
  DEPS.logActivity({ title: `Update quest #${id} (PATCH)`, method: 'PATCH', url: res.url || `${API_MODS}/quests/${id}`, ok: res.ok, status: res.status, data: res.data });
  if (!res.ok) return DEPS.toast('Update failed', 'err');
  DEPS.toast('Quest updated', 'ok');
  await loadGlobalQuests({ force: true });
}

function renderRotationCard() {
  const sp = subpanel('quest-rotation');
  if (!sp) return;
  sp.innerHTML = `
    <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="font-semibold">Generate quest rotation</h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-400">Forces a new rotation, replacing the current weekly set for all users.</p>
        </div>
        <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /mods/quests/rotation/generate</span>
      </div>
      <button type="button" data-quest-generate class="cursor-pointer rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700">Generate new rotation</button>
    </article>`;
  sp.querySelector('[data-quest-generate]').onclick = onGenerateRotation;
}

async function onGenerateRotation() {
  if (!DEPS.isDevAllowed()) return DEPS.toast('Dev access only', 'err');
  const ok = await DEPS.showConfirmDanger({
    title: 'Generate quest rotation',
    message: 'Force a new quest rotation now? This replaces the current weekly set for everyone.',
    confirm: 'Generate', cancel: 'Cancel',
  });
  if (!ok) return;
  const res = await DEPS.http('POST', `${API_MODS}/quests/rotation/generate`, { body: {} });
  DEPS.logActivity({ title: 'Generate quest rotation (POST)', method: 'POST', url: res.url || `${API_MODS}/quests/rotation/generate`, ok: res.ok, status: res.status, data: res.data });
  DEPS.toast(res.ok ? 'Quest rotation generated' : 'Rotation failed', res.ok ? 'ok' : 'err');
}

// Build a <select> with options. `current` is preselected; `placeholder` adds a
// leading blank option when truthy.
function buildSelect(name, options, current, { placeholder = '' } = {}) {
  const opts = [];
  if (placeholder) {
    const sel = current == null || current === '' ? ' selected' : '';
    opts.push(`<option value=""${sel}>${escapeHtml(placeholder)}</option>`);
  }
  for (const o of options) {
    const value = typeof o === 'object' ? o.value : o;
    const label = typeof o === 'object' ? o.label : o;
    const sel = String(current ?? '') === String(value) ? ' selected' : '';
    opts.push(`<option value="${escapeHtml(value)}"${sel}>${escapeHtml(label)}</option>`);
  }
  return `<select name="${escapeHtml(name)}"
    class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none">${opts.join('')}</select>`;
}

// map_id -> code, shared across the panel. No batch endpoint, so resolve lazily.
const MAP_CODE_CACHE = new Map();
const MAP_ID_CACHE = new Map(); // code(lower) -> map_id

// code -> map_id via GET /api/maps?code=
async function resolveCodeToId(code) {
  const key = String(code || '').trim().toLowerCase();
  if (!key) return null;
  if (MAP_ID_CACHE.has(key)) return MAP_ID_CACHE.get(key);
  const res = await DEPS.http('GET', '/api/maps', { query: { code } });
  const item = pickMapItem(res.data);
  const id = item && item.id != null ? Number(item.id) : null;
  if (id != null) {
    MAP_ID_CACHE.set(key, id);
    MAP_CODE_CACHE.set(id, item.code || code);
  }
  return id;
}

// map_id -> code via the new map-id search (GET /api/maps?map_id=)
async function resolveIdToCode(mapId) {
  const id = Number(mapId);
  if (!Number.isFinite(id)) return null;
  if (MAP_CODE_CACHE.has(id)) return MAP_CODE_CACHE.get(id);
  const res = await DEPS.http('GET', '/api/maps', { query: { map_id: id } });
  const item = pickMapItem(res.data);
  const code = item && item.code != null ? String(item.code) : null;
  if (code != null) {
    MAP_CODE_CACHE.set(id, code);
    MAP_ID_CACHE.set(code.toLowerCase(), id);
  }
  return code;
}

function pickMapItem(data) {
  if (Array.isArray(data)) return data[0] || null;
  if (data && typeof data === 'object') return data.items?.[0] ?? data.data?.items?.[0] ?? data ?? null;
  return null;
}

// A code text input that stores the resolved map_id in dataset.mapId.
// markup: <input data-map-field name="..."> inside a relative wrapper.
function wireMapField(input, { initialMapId = null } = {}) {
  if (!input || input.__mapWired) return;
  input.__mapWired = true;
  DEPS.wireAutocomplete(input, {
    kind: 'map-codes',
    onPick: async ({ value }) => {
      const code = (value || '').trim();
      input.value = code;
      const id = await resolveCodeToId(code);
      input.dataset.mapId = id != null ? String(id) : '';
    },
  });
  input.addEventListener('input', () => { input.dataset.mapId = ''; });
  // Hydrate an existing map_id into a code for display.
  if (initialMapId != null && initialMapId !== '' && Number(initialMapId) !== 0) {
    input.dataset.mapId = String(initialMapId);
    input.value = `#${initialMapId}`;
    resolveIdToCode(initialMapId).then((code) => { if (code) input.value = code; });
  }
}

// Read the chosen map_id; resolves the typed code on demand if not yet resolved.
async function readMapId(input) {
  if (!input) return null;
  if (input.dataset.mapId) return Number(input.dataset.mapId);
  const code = (input.value || '').trim();
  if (!code) return null;
  return resolveCodeToId(code);
}

// Renders int[] map ids as code chips inside `host` (a container element).
// Stores the live list on host.__ids. `addInput` is a code autocomplete input.
function renderMapChips(host) {
  const ids = host.__ids || [];
  host.innerHTML = ids.length
    ? ids.map((id) => `<span class="inline-flex items-center gap-1 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-2 py-1 text-xs" data-chip="${id}">
        <span data-chip-label>#${id}</span>
        <button type="button" data-chip-remove="${id}" class="opacity-60 hover:opacity-100">✕</button>
      </span>`).join('')
    : `<span class="text-xs text-zinc-500 dark:text-zinc-400">No maps</span>`;
  // Resolve codes lazily.
  for (const id of ids) {
    resolveIdToCode(id).then((code) => {
      if (!code) return;
      const el = host.querySelector(`[data-chip="${id}"] [data-chip-label]`);
      if (el) el.textContent = code;
    });
  }
}

function wireMapListField(host, addInput, initialIds = []) {
  host.__ids = Array.isArray(initialIds) ? initialIds.map(Number).filter(Number.isFinite) : [];
  renderMapChips(host);
  host.addEventListener('click', (e) => {
    const rm = e.target.closest('[data-chip-remove]');
    if (!rm) return;
    const id = Number(rm.dataset.chipRemove);
    host.__ids = host.__ids.filter((x) => x !== id);
    renderMapChips(host);
  });
  if (addInput && !addInput.__mapWired) {
    addInput.__mapWired = true;
    DEPS.wireAutocomplete(addInput, {
      kind: 'map-codes',
      onPick: async ({ value }) => {
        const id = await resolveCodeToId((value || '').trim());
        if (id != null && !host.__ids.includes(id)) { host.__ids.push(id); renderMapChips(host); }
        addInput.value = '';
      },
    });
  }
}

// Text input that stores the picked numeric user id in dataset.uid.
function wireUserField(input, { initialId = null } = {}) {
  if (!input || input.__userWired) return;
  input.__userWired = true;
  DEPS.wireAutocomplete(input, {
    kind: 'users',
    onPick: ({ id }) => { input.dataset.uid = String(id || ''); },
  });
  input.addEventListener('input', () => { delete input.dataset.uid; });
  if (initialId != null && initialId !== '') {
    input.dataset.uid = String(initialId);
    input.value = `#${initialId}`;
  }
}
const readUserId = (input) => String(input?.dataset?.uid || '').trim() || null;

export function initQuestsWorkspace(deps) {
  DEPS = deps;
  const root = ROOT();
  if (!root) return;
  wireSubtabAutoLoad();

  // Deep-link / already-visible panel: auto-load the first sub-tab's data.
  const panel = document.querySelector('.mod-panel[data-panel="quests"]');
  if (panel && !panel.classList.contains('hidden')) onSubtabEnter('quest-config');
  renderRotationCard();
}
