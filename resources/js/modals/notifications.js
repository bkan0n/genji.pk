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
// API notifications  (NOUVELLES ROUTES /users/...)
// ============================================================================
const OW_BASE = '/api/users';
function loadUserNotifications() {
  const uid = (window.user_id ?? '').toString();
  if (!uid) {
    console.error('Aucun user_id défini !');
    return;
  }

  fetch(`${OW_BASE}/${encodeURIComponent(uid)}/notifications`, { credentials: 'same-origin' })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      // la doc renvoie soit un tableau ["DM_ON_VERIFICATION", ...] soit un objet; on gère les deux
      const enabledList = Array.isArray(data)
        ? data
        : Array.isArray(data?.notifications)
          ? data.notifications
          : [];
      const setChecked = new Set(enabledList.map(String));

      const checkboxes = document.querySelectorAll(
        '#gp-settings-modal input[type="checkbox"][id^="setting-"]'
      );
      checkboxes.forEach((checkbox) => {
        const notifType = idToNotificationType(checkbox.id);
        checkbox.checked = setChecked.has(notifType);
      });
    })
    .catch((error) => {
      console.error('Erreur loadUserNotifications :', error);
    });
}

function updateUserNotification(notificationType, enabled) {
  const uid = (window.user_id ?? '').toString();
  if (!uid) return;

  fetch(
    `${OW_BASE}/${encodeURIComponent(uid)}/notifications/${encodeURIComponent(notificationType)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': CSRF,
      },
      credentials: 'same-origin',
      body: enabled ? 'true' : 'false',
    }
  )
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .catch((error) => {
      console.error('Erreur de requête (notifications) :', error);
      const id = notificationTypeToId(notificationType);
      const cb = document.getElementById(id);
      if (cb) cb.checked = !enabled;
    });
}

// ============================================================================
// Init & bindings (Notifications uniquement)
// ============================================================================
function bindNotificationEvents() {
  document
    .querySelectorAll('#gp-settings-modal input[type="checkbox"][id^="setting-"]')
    .forEach((checkbox) => {
      if (checkbox.dataset.bound === '1') return;
      checkbox.dataset.bound = '1';
      checkbox.addEventListener('change', (e) => {
        const notificationType = idToNotificationType(e.target.id);
        updateUserNotification(notificationType, e.target.checked);
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

function openSettingsModal() {
  ensureSettingsModalStructure();
  gpOpenModal('gp-settings-modal');

  // Notifications
  loadUserNotifications();
  bindNotificationEvents();

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
    if (input) input.placeholder = 'No user ID';
    return;
  }

  fetch(`${OW_BASE}/${encodeURIComponent(uid)}/overwatch`, { credentials: 'same-origin' })
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
        userSpan.textContent = userObj.username + (userObj.is_primary ? ' (Primary)' : '');
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
          confirmBtn.title = 'Maximum 3 usernames allowed';
        } else {
          confirmBtn.disabled = false;
          confirmBtn.title = '';
        }
      }
      if (input) input.disabled = usernames.length >= 3;
    })
    .catch((error) => {
      console.error('Error loading Overwatch usernames:', error);
      if (input) input.placeholder = 'Error loading username';
    });
}

function updateUsernames(usernamesArray) {
  const uid = (window.user_id ?? '').toString();
  if (!uid) return;

  return fetch(`${OW_BASE}/${encodeURIComponent(uid)}/overwatch`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
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
      showErrorMessage('Error while updating the usernames list');
    });
}

function deleteUsername(usernameToDelete) {
  const uid = (window.user_id ?? '').toString();
  if (!uid || !usernameToDelete) return;

  fetch(`${OW_BASE}/${encodeURIComponent(uid)}/overwatch`, { credentials: 'same-origin' })
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
      showErrorMessage('Erreur deleting the username');
    });
}

function setPrimaryUsername(usernamePrimary) {
  const uid = (window.user_id ?? '').toString();
  if (!uid || !usernamePrimary) return;

  fetch(`${OW_BASE}/${encodeURIComponent(uid)}/overwatch`, { credentials: 'same-origin' })
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
      showErrorMessage('Erreur maj primary username');
    });
}

function bindOverwatchEvents() {
  const confirmBtn = document.getElementById('confirm-overwatch-username');
  if (confirmBtn && confirmBtn.dataset.bound !== '1') {
    confirmBtn.dataset.bound = '1';
    confirmBtn.addEventListener('click', () => {
      const uid = (window.user_id ?? '').toString();
      if (!uid) {
        showErrorMessage('No user ID');
        return;
      }

      const input = document.getElementById('overwatch-username');
      const newUsername = (input?.value || '').trim();
      if (!newUsername) {
        showErrorMessage(t('popup.enter_username'));
        return;
      }

      fetch(`${OW_BASE}/${encodeURIComponent(uid)}/overwatch`, { credentials: 'same-origin' })
        .then((resp) => {
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          return resp.json();
        })
        .then((data) => {
          let usernames = ow_extractUsernamesShape(data);
          if (usernames.length >= 3) {
            showErrorMessage('Maximum 3 usernames allowed');
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
          showErrorMessage("Erreur lors de l'ajout du nom.");
        });
    });
  }
}

document.addEventListener('genji:settings-opened', () => {
  loadOverwatchUsername();
  bindOverwatchEvents();
});
