// ============================================================================
// Helpers modaux
// ============================================================================
function gpGetModalBox(overlay) {
  return (
    overlay?.querySelector?.(
      '[data-modal-box], #gp-settings-card, .modal-card, .modal-panel, .modal-content, .card, [role="dialog"]'
    ) ||
    overlay?.firstElementChild ||
    null
  );
}
function gpEnsureInBody(el) {
  if (el && el.parentElement !== document.body) document.body.appendChild(el);
}
function gpCsrfToken() {
  const el = document.querySelector('meta[name="csrf-token"]');
  return el?.getAttribute('content') || '';
}
function gpInitModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay || overlay.dataset.gpInit === '1') return;
  overlay.dataset.gpInit = '1';
  overlay.classList.add(
    'fixed',
    'inset-0',
    'z-50',
    'bg-black/60',
    'backdrop-blur-sm',
    'p-4',
    'hidden',
    'items-center',
    'justify-center'
  );
  const box = gpGetModalBox(overlay);
  if (box) {
    box.classList.add('transition', 'duration-200', 'ease-out', 'opacity-0', 'scale-95');
    const desired = box.dataset.modalMax || overlay.dataset.modalMax || '5xl';
    [...box.classList].forEach((c) => {
      if (c.startsWith('max-w-')) box.classList.remove(c);
    });
    box.classList.add('w-full', `max-w-${desired}`);
  }
}
function gpOpenModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  gpEnsureInBody(overlay);
  gpInitModal(overlayId);
  const box = gpGetModalBox(overlay);
  overlay.dataset.closing = '';
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  overlay.style.removeProperty('display');
  if (box) {
    box.classList.add('opacity-0', 'scale-95');
    box.classList.remove('opacity-100', 'scale-100');
  }
  requestAnimationFrame(() => {
    box?.classList.remove('opacity-0', 'scale-95');
    box?.classList.add('opacity-100', 'scale-100');
  });
}
function gpCloseModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  const box = gpGetModalBox(overlay);
  if (!box) {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    return;
  }
  if (overlay.dataset.closing === '1') return;
  overlay.dataset.closing = '1';
  void box.getBoundingClientRect();
  box.classList.add('opacity-0', 'scale-95');
  box.classList.remove('opacity-100', 'scale-100');
  const getMs = (el) => {
    const cs = getComputedStyle(el);
    const dur = (cs.transitionDuration || '0s').split(',')[0].trim();
    const del = (cs.transitionDelay || '0s').split(',')[0].trim();
    const toMs = (s) => (s.endsWith('ms') ? parseFloat(s) : parseFloat(s) * 1000);
    return toMs(dur) + toMs(del) || 200;
  };
  const timeout = getMs(box) + 50;
  const end = () => {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    overlay.style.removeProperty('display');
    overlay.dataset.closing = '';
  };
  let ended = false;
  const onEnd = (e) => {
    if (e.target !== box) return;
    ended = true;
    box.removeEventListener('transitionend', onEnd);
    end();
  };
  box.addEventListener('transitionend', onEnd);
  setTimeout(() => {
    if (ended) return;
    box.removeEventListener('transitionend', onEnd);
    end();
  }, timeout);
}

// ============================================================================
// Mapping types/ids
// ============================================================================
function idToNotificationType(checkboxId) {
  return checkboxId
    .replace(/^setting-/, '')
    .replace(/-/g, '_')
    .toUpperCase();
}
function notificationTypeToId(notificationType) {
  return 'setting-' + notificationType.toLowerCase().replace(/_/g, '-');
}

// ============================================================================
// API (Settings modal)
// - Overwatch usernames: /api/users/{user_id}/overwatch
// - Notification preferences: /api/notifications/preferences (session-based)
// ============================================================================
const USERS_BASE = '/api/users';
const NOTIF_PREFS_URL = '/api/notifications/preferences';
const NOTIF_BULK_URL = '/api/notifications/preferences/bulk';

function gpJsonHeaders(extra = {}) {
  const csrf = gpCsrfToken();
  return {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(csrf ? { 'X-CSRF-TOKEN': csrf } : {}),
    ...extra,
  };
}

function normalizeKey(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
}

// ============================================================================
// Notification preferences UI helpers (new system: event_type + channels)
// ============================================================================
const NOTIF_PREF_SELECTOR =
  '#gp-settings-modal input[type="checkbox"][data-channel][data-event-type]';
const NOTIF_PREF_LIST_ID = 'gp-notification-preferences';

function gpCssEscape(v) {
  if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(String(v));
  return String(v).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}

function gpEventTypeToLabel(eventType) {
  const s = String(eventType || '')
    .trim()
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ');
  const list = document.getElementById(NOTIF_PREF_LIST_ID);
  const fallback = list?.getAttribute('data-label-event') || 'Event';
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : fallback;
}

function gpChannelLabel(channel) {
  const list = document.getElementById(NOTIF_PREF_LIST_ID);
  const attr = 'data-label-' + String(channel || '').replace(/_/g, '-');
  return list?.getAttribute(attr) || channel;
}

function gpSwitchSpanClass() {
  return (
    "relative h-5 w-9 rounded-full bg-zinc-700 transition-colors duration-200 ease-in-out " +
    "peer-checked:bg-emerald-500 peer-disabled:bg-zinc-800 peer-disabled:opacity-60 " +
    "after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:translate-x-0 " +
    "after:rounded-full after:bg-white after:transition-transform after:duration-200 after:ease-in-out " +
    "after:content-[''] peer-checked:after:translate-x-4 active:after:scale-95 peer-disabled:after:bg-zinc-200"
  );
}

function gpEnsurePreferenceRow(eventType) {
  const modal = document.getElementById('gp-settings-modal');
  const list = document.getElementById(NOTIF_PREF_LIST_ID);
  if (!modal || !list || !eventType) return;

  const escaped = gpCssEscape(eventType);
  if (modal.querySelector(`input[data-event-type="${escaped}"]`)) return;

  const isEmailAuth = modal.dataset.isEmailAuth === '1';

  const row = document.createElement('div');
  row.className =
    'grid grid-cols-1 sm:grid-cols-4 items-start gap-4 rounded-lg border border-white/10 bg-zinc-900/50 px-3 py-2';
  row.dataset.eventRow = eventType;

  const label = document.createElement('div');
  label.className = 'min-w-0 text-sm leading-snug text-zinc-200';
  label.textContent = gpEventTypeToLabel(eventType);
  row.appendChild(label);

  const channels = ['web', 'discord_dm', 'discord_ping'];
  const eventSlug = String(eventType).replace(/_/g, '-');

  channels.forEach((channel) => {
    const cell = document.createElement('div');
    cell.className = 'flex items-center gap-2 sm:justify-center';

    const mobileLabel = document.createElement('span');
    mobileLabel.className =
      'sm:hidden text-[11px] font-extrabold uppercase tracking-wider text-zinc-400';
    mobileLabel.textContent = gpChannelLabel(channel);
    cell.appendChild(mobileLabel);

    const wrap = document.createElement('label');
    const disabled = isEmailAuth && channel !== 'web';
    wrap.className =
      (disabled ? 'cursor-not-allowed ' : 'cursor-pointer ') +
      'inline-flex shrink-0 items-center';
    if (disabled) wrap.setAttribute('aria-disabled', 'true');

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'peer sr-only';
    input.id = `setting-${channel.replace(/_/g, '-')}-${eventSlug}`;
    input.dataset.channel = channel;
    input.dataset.eventType = eventType;
    input.dataset.bound = '0';
    input.dataset.prefLoaded = '0';
    input.dataset._origDisabled = disabled ? '1' : '0';
    input.disabled = disabled;

    const span = document.createElement('span');
    span.className = gpSwitchSpanClass();

    wrap.appendChild(input);
    wrap.appendChild(span);
    cell.appendChild(wrap);

    row.appendChild(cell);
  });

  list.appendChild(row);
}

/**
 * Map an input id => { eventKey, channel }
 * UI ids:
 *  - setting-dm-on-verification         => channel discord_dm,    eventKey verification
 *  - setting-ping-on-xp-gain            => channel discord_ping,  eventKey xp-gain
 */
function settingIdToSpec(checkboxId) {
  const id = String(checkboxId || '');
  let channel = '';
  let eventKey = id.replace(/^setting-/, '');

  if (eventKey.startsWith('dm-on-')) {
    channel = 'discord_dm';
    eventKey = eventKey.replace(/^dm-on-/, '');
  } else if (eventKey.startsWith('ping-on-')) {
    channel = 'discord_ping';
    eventKey = eventKey.replace(/^ping-on-/, '');
  } else if (eventKey.startsWith('web-on-')) {
    channel = 'web';
    eventKey = eventKey.replace(/^web-on-/, '');
  }

  return { channel, eventKey };
}

function guessEventTypeFromKey(eventKey) {
  // Fallback if we can't match a server-provided event_type.
  // Keep it deterministic and readable.
  return String(eventKey || '')
    .trim()
    .replace(/-/g, '_')
    .toUpperCase();
}

function extractPreferencesPayload(data) {
  // Accept either {preferences: [...]}, or raw [...]
  const arr = Array.isArray(data)
    ? data
    : Array.isArray(data?.preferences)
      ? data.preferences
      : [];
  return arr.filter(Boolean);
}

function buildPreferenceIndex(preferences) {
  // returns map normalized(event_type) => row
  const idx = new Map();
  preferences.forEach((row) => {
    const et = row?.event_type ?? row?.eventType ?? row?.type ?? '';
    if (!et) return;
    idx.set(normalizeKey(et), row);
  });
  return idx;
}

function findPreferenceRow(prefIndex, eventKey) {
  const nk = normalizeKey(eventKey);
  if (prefIndex.has(nk)) return prefIndex.get(nk);

  // Fallback: some APIs may prefix/suffix event_type names; try substring match
  for (const [k, v] of prefIndex.entries()) {
    if (k.endsWith(`_${nk}`) || k.startsWith(`${nk}_`) || k.includes(`_${nk}_`)) return v;
  }
  return null;
}

async function loadNotificationPreferences() {

  const modal = document.getElementById('gp-settings-modal');
  if (!modal) return;

  const list = document.getElementById(NOTIF_PREF_LIST_ID);
  // If there's no list container and no existing checkbox, nothing to sync.
  const existing = modal.querySelectorAll(NOTIF_PREF_SELECTOR);
  if (!existing.length && !list) return;

  const lock = (cb) => {
    if (!cb.dataset._origDisabled) cb.dataset._origDisabled = cb.disabled ? '1' : '0';
    cb.disabled = true;
    cb.dataset.prefLoaded = '0';
  };

  existing.forEach(lock);

  try {
    const res = await fetch(NOTIF_PREFS_URL, {
      credentials: 'same-origin',
      headers: gpJsonHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const prefs = extractPreferencesPayload(data);

    // Ensure UI rows exist for every server event_type (future-proof).
    if (list && Array.isArray(prefs)) {
      prefs.forEach((row) => {
        const et = row?.event_type ?? row?.eventType ?? row?.type ?? '';
        if (!et) return;
        gpEnsurePreferenceRow(et);
      });
    }

    // Re-query after potential injections
    const checkboxes = modal.querySelectorAll(NOTIF_PREF_SELECTOR);
    checkboxes.forEach(lock);

    const idx = buildPreferenceIndex(prefs);

    checkboxes.forEach((cb) => {
      const eventType = cb.dataset.eventType || '';
      const channel = cb.dataset.channel || '';
      if (!eventType || !channel) return;

      const row = idx.get(normalizeKey(eventType)) || null;
      const channels = row?.channels || {};
      if (row) cb.checked = Boolean(channels?.[channel]);

      cb.dataset.prefLoaded = '1';
    });
  } catch (e) {
    console.error('Erreur loadNotificationPreferences :', e);
    // Keep UI usable even if we couldn't sync.
  } finally {
    const checkboxes = modal.querySelectorAll(NOTIF_PREF_SELECTOR);
    checkboxes.forEach((cb) => {
      const origDisabled = cb.dataset._origDisabled === '1';
      cb.disabled = origDisabled;
    });
  }
}


async function updateNotificationPreference(eventType, channel, enabled) {
  const payload = [{ event_type: eventType, channel, enabled: Boolean(enabled) }];

  const res = await fetch(NOTIF_BULK_URL, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: gpJsonHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });

  // Controller normalises upstream 204 => 200, but keep it safe.
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${text}`);
  }

  if (res.status === 204) return { ok: true };

  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return await res.json();
  return { ok: true };
}

// ============================================================================
// Init & bindings (Notifications uniquement)
// ============================================================================
function bindNotificationEvents() {

  const modal = document.getElementById('gp-settings-modal');
  if (!modal) return;

  modal.querySelectorAll(NOTIF_PREF_SELECTOR).forEach((checkbox) => {
    if (checkbox.dataset.bound === '1') return;
    checkbox.dataset.bound = '1';

    checkbox.addEventListener('change', async (e) => {
      const cb = e.target;
      const eventType = cb.dataset.eventType || '';
      const channel = cb.dataset.channel || '';
      if (!eventType || !channel) return;

      const desired = Boolean(cb.checked);

      // Optimistic UI; revert on failure.
      try {
        cb.disabled = true;
        await updateNotificationPreference(eventType, channel, desired);
      } catch (err) {
        console.error('Erreur de requête (notification preference) :', err);
        cb.checked = !desired;
      } finally {
        const origDisabled = cb.dataset._origDisabled === '1';
        cb.disabled = origDisabled;
      }
    });
  });
}


// ============================================================================
// Modal Settings (ouverture / fermeture animées)
// ============================================================================
function ensureSettingsModalStructure() {
  const modal = document.getElementById('gp-settings-modal');
  const card = document.getElementById('gp-settings-card');
  if (!modal || !card) return { modal, card, backdrop: null };

  if (!card.hasAttribute('data-modal-box')) card.setAttribute('data-modal-box', '');
  gpInitModal('gp-settings-modal');

  const backdrop = document.getElementById('gp-settings-backdrop');
  return { modal, card, backdrop };
}

async function openSettingsModal() {

  ensureSettingsModalStructure();
  gpOpenModal('gp-settings-modal');

  // Notifications (ensure UI is in sync before binding)
  try {
    await loadNotificationPreferences();
  } finally {
    bindNotificationEvents();
  }

  // Signale aux autres modules (profile.js) que le modal est ouvert (pour charger Overwatch)
  document.dispatchEvent(new CustomEvent('genji:settings-opened'));
}

function closeSettingsModal() {
  gpCloseModal('gp-settings-modal');
}

function bindSettingsModalCloseHandlers() {
  const { modal, card, backdrop } = ensureSettingsModalStructure();
  if (!modal || !card) return;

  if (!modal.dataset.boundClose) {
    modal.dataset.boundClose = '1';

    backdrop?.addEventListener('click', closeSettingsModal);

    document.addEventListener(
      'click',
      (e) => {
        if (modal.classList.contains('hidden')) return;
        const btn = e.target.closest?.('#settingsClose');
        if (btn) {
          e.preventDefault();
          closeSettingsModal();
        }
      },
      true
    );

    const onPointerDownCapture = (e) => {
      if (modal.classList.contains('hidden')) return;
      const startedOutside = !card.contains(e.target);
      if (!startedOutside) return;
      const onPointerUpCapture = (ev) => {
        window.removeEventListener('pointerup', onPointerUpCapture, true);
        const stillOutside = !card.contains(ev.target);
        if (stillOutside) closeSettingsModal();
      };
      window.addEventListener('pointerup', onPointerUpCapture, true);
    };
    window.addEventListener('pointerdown', onPointerDownCapture, true);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSettingsModal();
    });
  }
}

// ================================
// Tabs (si tu as deux onglets)
// ================================
function bindSettingsTabs(root = document.getElementById('gp-settings-modal')) {
  if (!root) return;
  const tabs = Array.from(root.querySelectorAll('.settings-tab'));
  const panels = Array.from(root.querySelectorAll('.settings-section'));
  if (!tabs.length || !panels.length) return;

  tabs.forEach((tab) => {
    if (tab.dataset.bound === '1') return;
    tab.dataset.bound = '1';
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = tab.getAttribute('data-target');
      const targetPanel = root.querySelector('#' + targetId);
      if (!targetPanel) return;
      tabs.forEach((t) => {
        t.setAttribute('data-active', 'false');
        t.setAttribute('aria-selected', 'false');
      });
      tab.setAttribute('data-active', 'true');
      tab.setAttribute('aria-selected', 'true');
      panels.forEach((p) => {
        p.classList.add('hidden');
        p.classList.remove('block');
      });
      targetPanel.classList.remove('hidden');
      targetPanel.classList.add('block');
    });
  });
}

// ============================================================================
// Bootstrapping
// ============================================================================
function wireSettingsTriggers() {
  const triggers = [
    document.getElementById('user-settings'),
    document.getElementById('openSettings'),
  ].filter(Boolean);

  triggers.forEach((btn) => {
    if (btn.dataset.boundOpen === '1') return;
    btn.dataset.boundOpen = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSettingsModal();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  ensureSettingsModalStructure();
  bindSettingsModalCloseHandlers();
  bindSettingsTabs();
  wireSettingsTriggers();

  const modal = document.getElementById('gp-settings-modal');
  if (modal && !modal.classList.contains('hidden')) {
    gpOpenModal('gp-settings-modal');
    document.dispatchEvent(new CustomEvent('genji:settings-opened'));
  }
});

// ============================================================================
// i18n (facultatif ici, utile si tu veux des toasts de notif)
// ============================================================================
const CURRENT_LANG = document.documentElement.lang || 'en';
let translations = window.NOTIFICATIONS_I18N || {};
function t(path, params = {}) {
  const parts = path.split('.');
  let result = translations;
  for (const part of parts) {
    result = result?.[part];
    if (!result) break;
  }
  if (typeof result !== 'string') return path;
  for (const k in params) result = result.replace(`{${k}}`, params[k]);
  return result;
}

// ———————————————————————————————————————————————————————————————
// ======================= Overwatch Usernames =======================
// Endpoints : GET /users/{uid}/overwatch  |  PUT /users/{uid}/overwatch
// ———————————————————————————————————————————————————————————————
function ow_extractUsernamesShape(data) {
  if (Array.isArray(data?.usernames)) return data.usernames;
  if (Array.isArray(data)) return data;
  const out = [];
  if (data && typeof data === 'object') {
    if (data.primary) out.push({ username: data.primary, is_primary: true });
    if (data.secondary) out.push({ username: data.secondary, is_primary: false });
    if (data.tertiary) out.push({ username: data.tertiary, is_primary: false });
  }
  return out;
}

function loadOverwatchUsername() {
  const uid = (window.user_id ?? '').toString();
  const listContainer = document.getElementById('overwatch-usernames-list');
  const input = document.getElementById('overwatch-username');

  if (!uid) {
    console.error('Aucun user_id défini !');
    listContainer && (listContainer.innerHTML = '');
    if (input) input.placeholder = t('popup.no_user_id');
    return;
  }

  fetch(`${USERS_BASE}/${encodeURIComponent(uid)}/overwatch`, { credentials: 'same-origin' })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (!input || !listContainer) return;

      listContainer.innerHTML = '';
      const usernames = ow_extractUsernamesShape(data);

      if (usernames.length > 0) {
        const primaryUser = usernames.find((u) => u.is_primary);
        input.placeholder =
          primaryUser && primaryUser.username
            ? primaryUser.username
            : usernames[0].username || t('popup.no_username_set');
      } else {
        input.placeholder = t('popup.no_username_set');
      }

      usernames.forEach((userObj) => {
        const row = document.createElement('div');
        row.className =
          'flex items-center justify-between rounded-lg border border-white/10 bg-zinc-900/50 px-3 py-2';

        const userSpan = document.createElement('span');
        userSpan.className = 'text-sm font-semibold text-zinc-100';
        userSpan.textContent = userObj.username + (userObj.is_primary ? ` (${t('popup.primary')})` : '');
        userSpan.style.cursor = userObj.is_primary ? 'default' : 'pointer';
        userSpan.title = userObj.is_primary ? '' : t('popup.set_primary_username');
        userSpan.addEventListener('click', () => {
          if (!userObj.is_primary) setPrimaryUsername(userObj.username);
        });

        const btnDelete = document.createElement('button');
        btnDelete.className = 'rounded-md cursor-pointer p-1.5 hover:bg-white/10 text-rose-300';
        btnDelete.title = t('popup.delete_username');
        btnDelete.innerHTML = '❌';
        btnDelete.addEventListener('click', () => deleteUsername(userObj.username));

        row.appendChild(userSpan);
        row.appendChild(btnDelete);
        listContainer.appendChild(row);
      });

      const confirmBtn = document.getElementById('confirm-overwatch-username');
      if (confirmBtn) {
        if (usernames.length >= 3) {
          confirmBtn.disabled = true;
          confirmBtn.title = t('popup.max_usernames_allowed');
        } else {
          confirmBtn.disabled = false;
          confirmBtn.title = '';
        }
      }
      if (input) input.disabled = usernames.length >= 3;
    })
    .catch((error) => {
      console.error('Error loading Overwatch usernames:', error);
      if (input) input.placeholder = t('popup.error_loading_username');
    });
}

function updateUsernames(usernamesArray) {
  const uid = (window.user_id ?? '').toString();
  if (!uid) return;

  return fetch(`${USERS_BASE}/${encodeURIComponent(uid)}/overwatch`, {
    method: 'PUT',
    headers: gpJsonHeaders({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify({ usernames: usernamesArray }),
  })
    .then((res) => {
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) return res.json();
      return res.text().then((t) => {
        throw new Error('Invalid JSON response: ' + t);
      });
    })
    .then((data) => {
      showConfirmationMessage(t('popup.username_updated'));
      loadOverwatchUsername();
      const input = document.getElementById('overwatch-username');
      if (input) input.value = '';
      return data;
    })
    .catch((err) => {
      console.error('Erreur API update:', err);
      showErrorMessage(t('popup.error_update_usernames_list'));
    });
}

function deleteUsername(usernameToDelete) {
  const uid = (window.user_id ?? '').toString();
  if (!uid || !usernameToDelete) return;

  fetch(`${USERS_BASE}/${encodeURIComponent(uid)}/overwatch`, { credentials: 'same-origin' })
    .then((resp) => resp.json())
    .then((data) => {
      let usernames = ow_extractUsernamesShape(data);
      usernames = usernames.filter((u) => u.username !== usernameToDelete);
      if (!usernames.some((u) => u.is_primary) && usernames.length > 0) {
        usernames[0].is_primary = true;
      }
      return updateUsernames(usernames);
    })
    .catch((err) => {
      console.error('Erreur deleting the username :', err);
      showErrorMessage(t('popup.error_delete_username'));
    });
}

function setPrimaryUsername(usernamePrimary) {
  const uid = (window.user_id ?? '').toString();
  if (!uid || !usernamePrimary) return;

  fetch(`${USERS_BASE}/${encodeURIComponent(uid)}/overwatch`, { credentials: 'same-origin' })
    .then((resp) => resp.json())
    .then((data) => {
      const usernames = ow_extractUsernamesShape(data);
      const updatedUsernames = usernames.map((u) => ({
        username: u.username,
        is_primary: u.username === usernamePrimary,
      }));
      return updateUsernames(updatedUsernames);
    })
    .then(() => {
      showConfirmationMessage(t('popup.primary_username_updated'));
      loadOverwatchUsername();
    })
    .catch((err) => {
      console.error('Erreur maj primary username :', err);
      showErrorMessage(t('popup.error_set_primary_username'));
    });
}

function bindOverwatchEvents() {
  const confirmBtn = document.getElementById('confirm-overwatch-username');
  if (confirmBtn && confirmBtn.dataset.bound !== '1') {
    confirmBtn.dataset.bound = '1';
    confirmBtn.addEventListener('click', () => {
      const uid = (window.user_id ?? '').toString();
      if (!uid) {
        showErrorMessage(t('popup.no_user_id'));
        return;
      }

      const input = document.getElementById('overwatch-username');
      const newUsername = (input?.value || '').trim();
      if (!newUsername) {
        showErrorMessage(t('popup.enter_username'));
        return;
      }

      fetch(`${USERS_BASE}/${encodeURIComponent(uid)}/overwatch`, { credentials: 'same-origin' })
        .then((resp) => {
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          return resp.json();
        })
        .then((data) => {
          let usernames = ow_extractUsernamesShape(data);
          if (usernames.length >= 3) {
            showErrorMessage(t('popup.max_usernames_allowed'));
            return;
          }
          if (
            usernames.some((u) => (u.username || '').toLowerCase() === newUsername.toLowerCase())
          ) {
            showErrorMessage(t('popup.already_exist_username'));
            return;
          }
          usernames.push({ username: newUsername, is_primary: usernames.length === 0 });
          return updateUsernames(usernames);
        })
        .catch((err) => {
          console.error("Erreur lors de l'ajout du username:", err);
          showErrorMessage(t('popup.error_add_username'));
        });
    });
  }
}

function showToast(message, type = 'ok', opts = {}) {
  const {
    duration = 1200,
    enter    = 220,
    exit     = 220,
    easing   = 'cubic-bezier(0.4,0,0.2,1)',
  } = opts;

  let root = document.getElementById('toast-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'toast-root';
    root.className = 'pointer-events-none fixed inset-x-0 bottom-6 z-[200] flex justify-center px-3';
    document.body.appendChild(root);
  }

  while (root.firstElementChild) {
    const prev = root.firstElementChild;
    try { prev.getAnimations?.().forEach(a => a.cancel()); } catch {}
    prev.remove();
  }

  const palette =
    type === 'ok'
      ? 'bg-emerald-500/90 text-white'
      : type === 'warn'
        ? 'bg-amber-500/90 text-zinc-900'
        : 'bg-red-600/90 text-white';

  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.className = [
    'pointer-events-auto select-none rounded-xl px-4 py-2',
    'text-sm shadow-lg text-center transform-gpu',
    'w-auto max-w-[92vw] sm:max-w-[42rem]',
    palette
  ].join(' ');
  el.textContent = message;

  root.appendChild(el);

  const inAnim = el.animate(
    [{ opacity: 0, transform: 'translateY(8px)' },
     { opacity: 1, transform: 'translateY(0)' }],
    { duration: enter, easing, fill: 'forwards' }
  );

  const close = () => {
    Promise.resolve(inAnim.finished).catch(() => {}).finally(() => {
      const outAnim = el.animate(
        [{ opacity: 1, transform: 'translateY(0)' },
         { opacity: 0, transform: 'translateY(8px)' }],
        { duration: exit, easing, fill: 'forwards' }
      );
      outAnim.finished.then(() => el.remove()).catch(() => el.remove());
      setTimeout(() => el.remove(), exit + 120);
    });
  };

  const timer = setTimeout(close, Math.max(duration, enter + 50));
  el.addEventListener('click', () => { clearTimeout(timer); close(); });
}

const showConfirmationMessage = (m) => showToast(m, 'ok');
const showErrorMessage        = (m) => showToast(m, 'error');
const showWarningMessage      = (m) => showToast(m, 'warn');

document.addEventListener('genji:settings-opened', () => {
  loadOverwatchUsername();
  bindOverwatchEvents();
});
