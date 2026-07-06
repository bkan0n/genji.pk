import { $ } from './workspace-shell.js';

let DEPS = null;
const ROOT = () => $('[data-store-workspace]');
const API_MODS = '/api/mods';

const KEY_TYPES = ['Classic', 'Winter', 'Autumn', 'Spring', 'Summer'];

// Snapshot of the last-loaded config, used to compute dirty state on the
// Configuration form so Save only enables when something actually changed.
let baseline = { rotation_period_days: '', active_key_type: '' };

// Verbatim copy of moderator.js setFormPending (no external deps); preserves the
// disable + "Working..." button lifecycle the central dispatcher used to provide.
function setStoreFormPending(form, pending = true, submitter = null) {
  const submitButtons = Array.from(
    form.querySelectorAll('button[type="submit"], button:not([type])')
  );
  if (pending) {
    form.setAttribute('aria-busy', 'true');
    submitButtons.forEach((btn) => {
      if (btn.dataset.pendingWired !== '1') {
        btn.dataset.pendingWired = '1';
        btn.dataset.pendingText = btn.textContent || 'Submit';
      }
      btn.disabled = true;
      btn.classList.add('opacity-70');
      if (!submitter || btn === submitter) btn.textContent = 'Working…';
    });
    return;
  }
  form.removeAttribute('aria-busy');
  submitButtons.forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove('opacity-70');
    if (btn.dataset.pendingText) btn.textContent = btn.dataset.pendingText;
  });
}

//———————————————————————————————————————————————————————————————
// DOM accessors
//———————————————————————————————————————————————————————————————
function configCard(root) {
  return $('[data-store-config]', root);
}

function updateForm(root) {
  return $('form[data-action="store-update-config"]', root);
}

// Toggle the loading/error/loaded views inside the Configuration card.
function setView(card, view) {
  ['loading', 'error', 'loaded'].forEach((name) => {
    const el = card.querySelector(`[data-view="${name}"]`);
    if (el) el.classList.toggle('hidden', name !== view);
  });
}

//———————————————————————————————————————————————————————————————
// Key-type dropdown
//———————————————————————————————————————————————————————————————
function buildKeyOption(value) {
  const label = document.createElement('label');
  label.className =
    'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10';
  const input = document.createElement('input');
  input.type = 'radio';
  input.name = 'active_key_type';
  input.value = value;
  input.setAttribute('data-label', value);
  input.className = 'accent-emerald-500';
  const span = document.createElement('span');
  span.textContent = value;
  label.appendChild(input);
  label.appendChild(span);
  return label;
}

function setKeyType(root, value) {
  const dd = $('[data-dd-field="active_key_type"]', root);
  if (!dd) return;
  const val = value == null ? '' : String(value);

  // Preserve a live value that isn't one of the known key types.
  if (
    val &&
    !KEY_TYPES.includes(val) &&
    !dd.querySelector(`input[name="active_key_type"][value="${CSS.escape(val)}"]`)
  ) {
    const list = dd.querySelector('[data-dd-list]');
    if (list) list.appendChild(buildKeyOption(val));
  }

  dd.querySelectorAll('input[name="active_key_type"]').forEach((r) => {
    r.checked = false;
  });

  const radio = val
    ? dd.querySelector(`input[name="active_key_type"][value="${CSS.escape(val)}"]`)
    : null;

  if (radio) {
    radio.checked = true;
    // Bubbling change lets bindDdDelegation update the visible .dd-label.
    radio.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    const labelEl = dd.querySelector('.dd-label');
    const btn = dd.querySelector('[data-dd-btn]');
    if (labelEl) labelEl.textContent = btn?.getAttribute('data-placeholder') || 'Select…';
  }
}

//———————————————————————————————————————————————————————————————
// Dirty tracking
//———————————————————————————————————————————————————————————————
function readFormState(form) {
  const rotation = String(form?.rotation_period_days?.value ?? '').trim();
  const key = String(
    form?.querySelector('input[name="active_key_type"]:checked')?.value ?? ''
  );
  return { rotation_period_days: rotation, active_key_type: key };
}

function isDirty(form) {
  const cur = readFormState(form);
  return (
    cur.rotation_period_days !== String(baseline.rotation_period_days ?? '') ||
    cur.active_key_type !== String(baseline.active_key_type ?? '')
  );
}

function updateDirtyUI(root) {
  const form = updateForm(root);
  if (!form) return;
  const dirty = isDirty(form);
  const saveBtn = form.querySelector('[data-store-save]');
  const marker = form.querySelector('[data-store-dirty]');
  if (saveBtn) saveBtn.disabled = !dirty;
  if (marker) {
    // Toggle both display utilities so exactly one is ever active. Pairing a
    // static `inline-flex` with `hidden` lets inline-flex win the cascade, so
    // the marker would never hide. The partial omits the static `inline-flex`.
    marker.classList.toggle('hidden', !dirty);
    marker.classList.toggle('inline-flex', dirty);
  }
}

//———————————————————————————————————————————————————————————————
// Load
//———————————————————————————————————————————————————————————————
function normalizeConfig(data) {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    if (data.config && typeof data.config === 'object' && !Array.isArray(data.config)) {
      return data.config;
    }
    if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
      return data.data;
    }
    return data;
  }
  return {};
}

function fillConfig(root, data) {
  const config = normalizeConfig(data);
  const form = updateForm(root);
  if (!form) return;
  const rotation = config.rotation_period_days ?? '';
  const key = config.active_key_type ?? '';
  if (form.rotation_period_days) {
    form.rotation_period_days.value = rotation == null ? '' : rotation;
  }
  setKeyType(root, key);
  baseline = {
    rotation_period_days: String(rotation ?? ''),
    active_key_type: String(key ?? ''),
  };
  updateDirtyUI(root);
}

async function loadConfig({ announce = false } = {}) {
  const root = ROOT();
  if (!root) return;
  const card = configCard(root);
  if (!card) return;

  setView(card, 'loading');

  const res = await DEPS.http('GET', `${API_MODS}/store/config`);
  DEPS.logActivity({
    title: 'Store config (GET)',
    method: 'GET',
    url: res.url || `${API_MODS}/store/config`,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  if (!res.ok) {
    const msg = res.data?.message || 'Failed to load store config';
    const errEl = card.querySelector('[data-store-error-msg]');
    if (errEl) errEl.textContent = msg;
    setView(card, 'error');
    DEPS.toast('Failed to load store config', 'err');
    return;
  }

  fillConfig(root, res.data);
  setView(card, 'loaded');
  if (announce) DEPS.toast('Store config refreshed', 'ok');
}

//———————————————————————————————————————————————————————————————
// Save + Generate
//———————————————————————————————————————————————————————————————
async function handleSave(form) {
  const cur = readFormState(form);
  const payload = {};

  if (cur.rotation_period_days !== String(baseline.rotation_period_days ?? '')) {
    if (cur.rotation_period_days === '') {
      DEPS.toast('Rotation period cannot be empty', 'warn');
      return;
    }
    const n = Number(cur.rotation_period_days);
    if (!Number.isInteger(n) || n < 1 || n > 3650) {
      DEPS.toast('Rotation period must be a whole number between 1 and 3650', 'warn');
      return;
    }
    payload.rotation_period_days = n;
  }

  if (cur.active_key_type !== String(baseline.active_key_type ?? '')) {
    if (cur.active_key_type) payload.active_key_type = cur.active_key_type;
  }

  if (!Object.keys(payload).length) {
    DEPS.toast('Nothing to update', 'warn');
    return;
  }

  const res = await DEPS.http('PUT', `${API_MODS}/store/config`, { body: payload });
  DEPS.logActivity({
    title: 'Store config (PUT)',
    method: 'PUT',
    url: res.url || `${API_MODS}/store/config`,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  if (!res.ok) {
    DEPS.toast('Update failed', 'err');
    return;
  }

  DEPS.toast('Store config updated', 'ok');
  await loadConfig();
}

async function handleGenerate(form) {
  const fd = new FormData(form);
  const raw = String(fd.get('item_count') ?? '').trim();
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 100) {
    DEPS.toast('Item count must be a whole number between 1 and 100', 'warn');
    return;
  }

  const ok = await DEPS.showConfirmDanger({
    title: 'Generate store rotation',
    message: `Generate a new rotation of ${n} item${n === 1 ? '' : 's'}? This replaces the current rotation.`,
    confirm: 'Generate',
    cancel: 'Cancel',
  });
  if (!ok) return;

  const res = await DEPS.http('POST', `${API_MODS}/store/rotation/generate`, {
    body: { item_count: n },
  });
  DEPS.logActivity({
    title: 'Generate store rotation (POST)',
    method: 'POST',
    url: res.url || `${API_MODS}/store/rotation/generate`,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  if (!res.ok) {
    DEPS.toast('Rotation failed', 'err');
    return;
  }
  DEPS.toast('Rotation generated', 'ok');
}

//———————————————————————————————————————————————————————————————
// Wiring
//———————————————————————————————————————————————————————————————
const STORE_ACTION_HANDLERS = {
  'store-update-config': handleSave,
  'store-generate-rotation': handleGenerate,
};

function wireForms(root) {
  root.addEventListener('submit', async (e) => {
    const form = e.target.closest('form[data-action]');
    if (!form || !root.contains(form)) return;
    const action = form.dataset.action;
    const handler = STORE_ACTION_HANDLERS[action];
    if (!handler) return;
    e.preventDefault();
    if (!DEPS.isDevAllowed()) {
      DEPS.toast('Dev access only', 'err');
      return;
    }
    if (form.dataset.submitLocked === '1') return;
    form.dataset.submitLocked = '1';
    const submitter =
      e.submitter || form.querySelector('button[type="submit"], button:not([type])');
    setStoreFormPending(form, true, submitter);
    try {
      await handler(form);
    } finally {
      setStoreFormPending(form, false, submitter);
      updateDirtyUI(root);
      form.dataset.submitLocked = '0';
    }
  });
}

function wireDirtyTracking(root) {
  const form = updateForm(root);
  if (!form) return;
  form.addEventListener('input', () => updateDirtyUI(root));
  form.addEventListener('change', () => updateDirtyUI(root));
}

function wireRefreshAndRetry(root) {
  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-store-refresh]') || e.target.closest('[data-store-retry]')) {
      e.preventDefault();
      loadConfig({ announce: true });
    }
  });
}

function wireTabAutoLoad() {
  const tabBtn = document.querySelector('#modTabs .mod-tab[data-tab="store"]');
  if (tabBtn) {
    // Switching tabs clears the panel, so pull fresh live config on every entry.
    tabBtn.addEventListener('click', () => loadConfig());
  }
  // Deep-link case: the Store panel is already visible when init runs.
  const panel = document.querySelector('.mod-panel[data-panel="store"]');
  if (panel && !panel.classList.contains('hidden')) {
    loadConfig();
  }
}

export function initStoreWorkspace(deps) {
  DEPS = deps;
  const root = ROOT();
  if (!root) return;
  wireForms(root);
  wireDirtyTracking(root);
  wireRefreshAndRetry(root);
  wireTabAutoLoad();
}
