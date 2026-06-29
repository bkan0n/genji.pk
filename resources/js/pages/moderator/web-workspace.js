import { $ } from './workspace-shell.js';

let DEPS = null;
const ROOT = () => $('[data-web-workspace]');

const API_MODS = '/api/mods';

// Verbatim copy of moderator.js setFormPending (no external deps); preserves the
// disable + "Working..." button lifecycle the central dispatcher used to provide.
function setWebFormPending(form, pending = true, submitter = null) {
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
      if (!submitter || btn === submitter) btn.textContent = 'Working...';
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
// DEVS ONLY (moved verbatim from moderator.js)
//———————————————————————————————————————————————————————————————
const TRANSLATION_FILES = [
  'gamemodes.json',
  'heroes.json',
  'values.json',
  'other.json',
  'maps.json',
  'localizedStrings.json',
  'customGameSettings.json',
  'constants.json',
  'actions.json',
];

async function handleClearFrameworksCache(form) {
  if (!form.confirm?.checked) {
    DEPS.toast('Please tick the confirmation box', 'warn');
    return;
  }

  const okGo = await DEPS.showConfirmDanger({
    title: 'Clear framework cache',
    message: 'This will delete the contents of public/framework-templates. Continue?',
    confirm: 'Yes, delete',
    cancel: 'Cancel',
  });
  if (!okGo) return;

  const { ok, status, url, data } = await DEPS.http('DELETE', `${API_MODS}/cache/framework`);
  DEPS.logActivity({ title: 'Clear cache – framework', method: 'DELETE', url, ok, status, data });
  DEPS.toast(ok ? 'Framework cache cleared' : 'Deletion failed', ok ? 'ok' : 'err');
}

async function handleClearAvatarsCache(form) {
  if (!form.confirm?.checked) {
    DEPS.toast('Please tick the confirmation box', 'warn');
    return;
  }

  const okGo = await DEPS.showConfirmDanger({
    title: 'Clear avatar cache',
    message: 'This will delete the contents of storage/app/private/cache. Continue?',
    confirm: 'Yes, delete',
    cancel: 'Cancel',
  });
  if (!okGo) return;

  const { ok, status, url, data } = await DEPS.http('DELETE', `${API_MODS}/cache/avatars`);
  DEPS.logActivity({ title: 'Clear cache – avatars', method: 'DELETE', url, ok, status, data });
  DEPS.toast(ok ? 'Avatar cache cleared' : 'Deletion failed', ok ? 'ok' : 'err');
}

async function handleClearTranslationsCache(form) {
  if (!form.confirm?.checked) {
    DEPS.toast('Please tick the confirmation box', 'warn');
    return;
  }

  const okGo = await DEPS.showConfirmDanger({
    title: 'Clear translations cache',
    message: `This will delete these files in public/translations:\n${TRANSLATION_FILES.join(', ')}\nContinue?`,
    confirm: 'Yes, delete',
    cancel: 'Cancel',
  });
  if (!okGo) return;

  const { ok, status, url, data } = await DEPS.http('DELETE', `${API_MODS}/cache/translations`, {
    body: { files: TRANSLATION_FILES },
  });
  DEPS.logActivity({ title: 'Clear cache – translations', method: 'DELETE', url, ok, status, data });
  DEPS.toast(ok ? 'Translations cache cleared' : 'Deletion failed', ok ? 'ok' : 'err');
}

async function handleSetOverpyCommit(form) {
  const commit = (form.commit.value || '').trim();
  const checked = !!form.confirm?.checked;

  if (!/^[0-9a-f]{7,40}$/i.test(commit)) {
    DEPS.toast('Invalid commit: use a 7–40 hex SHA', 'warn');
    return;
  }
  if (!checked) {
    DEPS.toast('Please confirm the change', 'warn');
    return;
  }

  const currentEl = document.querySelector('#overpyCommitCurrent');
  const current = currentEl?.textContent?.trim() || 'unknown';

  const okGo = await DEPS.showConfirmDanger({
    title: 'Set Overpy commit',
    message:
      `Current: ${current}\nNew:     ${commit}\n\n` +
      `This will update OVERPY_COMMIT in converter.js.\nContinue?`,
    confirm: 'Yes, update',
    cancel: 'Cancel',
  });
  if (!okGo) return;

  const { ok, status, url, data } = await DEPS.http('PATCH', `${API_MODS}/overpy-commit`, {
    body: {
      commit,
      confirm: true,
    },
  });

  DEPS.logActivity({ title: 'Set Overpy commit', method: 'PATCH', url, ok, status, data });
  if (ok) {
    if (currentEl) currentEl.textContent = commit;
    DEPS.toast('Overpy commit updated', 'ok');
  } else {
    DEPS.toast('Update failed', 'err');
  }
}

async function fetchCurrentOverpyCommit() {
  const { ok, status, url, data } = await DEPS.http('GET', `${API_MODS}/overpy-commit`);
  DEPS.logActivity({ title: 'Get Overpy commit', method: 'GET', url, ok, status, data });
  if (!ok || !data?.commit) {
    DEPS.toast('Failed to load current commit', 'err');
    return null;
  }
  return String(data.commit);
}

async function initOverpyCommitPanel() {
  const panel = document.querySelector('[data-subpanel="dev-overpy-commit"]');
  if (!panel || panel.dataset.inited === '1') return;
  panel.dataset.inited = '1';

  const currentEl = panel.querySelector('#overpyCommitCurrent');
  if (currentEl) {
    const cur = await fetchCurrentOverpyCommit();
    if (cur) currentEl.textContent = cur;
  }
}

async function initFrameworkVersionPanel() {
  const panel = document.querySelector('[data-subpanel="dev-framework-version"]');
  if (!panel || panel.dataset.inited === '1') return;
  panel.dataset.inited = '1';

  const currentEl = panel.querySelector('#frameworkVersionCurrent');
  if (currentEl) {
    const cur = await fetchCurrentFrameworkVersion();
    if (cur) currentEl.textContent = cur;
  }

  const form = panel.querySelector('#formSetFrameworkVersion');
  const btn  = panel.querySelector('#btnSetFrameworkVersion');
  if (!form || !btn) return;

  form.setAttribute('novalidate', '');
  form.addEventListener('invalid', (e) => e.preventDefault(), true);

  const versionInput = form.querySelector('input[name="version"]');
  if (versionInput) {
    versionInput.removeAttribute('pattern');
    versionInput.removeAttribute('required');

    versionInput.addEventListener('input', () => versionInput.setCustomValidity(''));

    versionInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); btn.click(); }
    });
  }

  btn.addEventListener('click', () => handleSetFrameworkVersion(form));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSetFrameworkVersion(form);
  });
}

async function fetchCurrentFrameworkVersion() {
  const { ok, status, url, data } = await DEPS.http('GET', `${API_MODS}/framework-version`);
  DEPS.logActivity({ title: 'Get framework version', method: 'GET', url, ok, status, data });
  if (!ok || !data?.version) {
    DEPS.toast('Failed to load current framework version', 'err');
    return null;
  }
  return String(data.version);
}

async function handleSetFrameworkVersion(form) {
  const input = form.version;
  const version = (input.value || '').trim().toUpperCase();
  const checked = !!form.confirm?.checked;

  const VERSION_RE = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:[A-Z][0-9A-Z]*)?$/;

  input.setCustomValidity('');

  if (!VERSION_RE.test(version)) {
    const msg = 'Invalid version. Use X.Y.Z with an optional UPPERCASE suffix (e.g. 1.10.4, 1.10.4A, 1.10.4RC1).';
    input.setCustomValidity(msg);
    input.reportValidity();
    DEPS.toast(msg, 'warn');
    return;
  }
  if (!checked) {
    DEPS.toast('Please tick the confirmation box.', 'warn');
    return;
  }

  const currentEl = document.querySelector('#frameworkVersionCurrent');
  const current = currentEl?.textContent?.trim() || 'unknown';

  const okGo = await DEPS.showConfirmDanger({
    title: 'Set framework version',
    message:
      `Current: ${current}\nNew:     ${version}\n\n` +
      `This will update the CDN URL used by converter.js.\nContinue?`,
    confirm: 'Yes, update',
    cancel: 'Cancel',
  });
  if (!okGo) return;

  const { ok, status, url, data } = await DEPS.http('PATCH', `${API_MODS}/framework-version`, {
    body: { version, confirm: true },
  });

  DEPS.logActivity({ title: 'Set framework version', method: 'PATCH', url, ok, status, data });
  if (ok) {
    if (currentEl) currentEl.textContent = version;
    DEPS.toast('Framework version updated', 'ok');
    form.confirm.checked = false;
  } else {
    const msg = data?.message || 'Update failed';
    DEPS.toast(msg, 'err');
  }
}

const WEB_ACTION_HANDLERS = {
  'clear-frameworks-cache': handleClearFrameworksCache,
  'clear-avatars-cache': handleClearAvatarsCache,
  'clear-translations-cache': handleClearTranslationsCache,
  'set-overpy-commit': handleSetOverpyCommit,
  'set-framework-version': handleSetFrameworkVersion,
};

function wireSubtabLoading(root) {
  root.addEventListener('click', (e) => {
    const tab = e.target.closest('.mod-subtab');
    if (!tab) return;
    const name = tab.dataset.subtab;
    if (name === 'dev-overpy-commit') initOverpyCommitPanel();
    if (name === 'dev-framework-version') initFrameworkVersionPanel();
  });
}

function wireForms(root) {
  root.addEventListener('submit', async (e) => {
    const form = e.target.closest('form[data-action]');
    if (!form || !root.contains(form)) return;
    const submitter = e.submitter || form.querySelector('button[type="submit"], button:not([type])');
    const action = submitter?.dataset?.submitAction || form.dataset.action;
    const handler = WEB_ACTION_HANDLERS[action];
    if (!handler) return;
    e.preventDefault();
    if (!DEPS.isDevAllowed()) {
      DEPS.toast('Dev access only', 'err');
      return;
    }
    if (form.dataset.submitLocked === '1') return;
    form.dataset.submitLocked = '1';
    setWebFormPending(form, true, submitter);
    try {
      await handler(form);
    } finally {
      setWebFormPending(form, false, submitter);
      form.dataset.submitLocked = '0';
    }
  });
}

export function initWebWorkspace(deps) {
  DEPS = deps;
  const root = ROOT();
  if (!root) return;
  wireSubtabLoading(root);
  wireForms(root);
}
