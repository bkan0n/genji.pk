// ———————————————————————————————————————————————————————————————
// Helpers modaux (Tailwind)
function gpGetModalBox(overlay) {
  return (
    overlay?.querySelector?.(
      '#profileModalContent, [data-modal-box], .modal-card, .modal-panel, .modal-content, .card, [role="dialog"], #translationCard, #profileCard, #settingsCard'
    ) ||
    overlay?.firstElementChild ||
    null
  );
}

function gpEnsureInBody(el) {
  if (el && el.parentElement !== document.body) document.body.appendChild(el);
}
function gpReplaceMaxW(el, targetClasses = []) {
  if (!el) return;
  const toRemove = [];
  el.classList.forEach((c) => {
    if (c.includes('max-w-')) toRemove.push(c);
  });
  toRemove.forEach((c) => el.classList.remove(c));
  targetClasses.forEach((c) => c && el.classList.add(c));
}

function gpZeroHorizontalPadding(el) {
  if (!el) return;
  const rm = [];
  el.classList.forEach((c) => {
    if (/^(?:sm:|md:|lg:|xl:|2xl:)?(?:px|pl|pr)-/.test(c)) rm.push(c);
  });
  rm.forEach((c) => el.classList.remove(c));
  el.classList.add('px-0');
}

function gpMakeFlexFill(el) {
  if (!el) return;
  el.classList.add('flex-1', 'basis-full', 'min-w-0', 'w-full');
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
    const hasAnyMaxW = [...box.classList].some((c) => c.includes('max-w-'));
    if (!hasAnyMaxW) box.classList.add('w-full', 'max-w-[700px]'); // <-- 700px par défaut
    gpZeroHorizontalPadding(box);
    gpMakeFlexFill(box);
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
  const finalize = () => {
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
    finalize();
  };
  box.addEventListener('transitionend', onEnd);
  setTimeout(() => {
    if (ended) return;
    box.removeEventListener('transitionend', onEnd);
    finalize();
  }, timeout);
}

function gpBindModalClose(overlayId, { closeBtnSelector, outsideRootSelector } = {}) {
  const overlay = document.getElementById(overlayId);
  if (!overlay || overlay.dataset.boundClose === '1') return;
  overlay.dataset.boundClose = '1';

  if (closeBtnSelector) {
    document.addEventListener(
      'click',
      (e) => {
        if (overlay.classList.contains('hidden')) return;
        if (e.target.closest?.(closeBtnSelector)) {
          e.preventDefault();
          gpCloseModal(overlayId);
        }
      },
      true
    );
  }

  const onPointerDownCapture = (e) => {
    if (overlay.classList.contains('hidden')) return;
    const root = outsideRootSelector
      ? overlay.querySelector(outsideRootSelector)
      : gpGetModalBox(overlay);

    if (!root || root.contains(e.target)) return;

    const onPointerUpCapture = (ev) => {
      window.removeEventListener('pointerup', onPointerUpCapture, true);
      const rootNow = outsideRootSelector
        ? overlay.querySelector(outsideRootSelector)
        : gpGetModalBox(overlay);
      if (!rootNow || !rootNow.contains(ev.target)) gpCloseModal(overlayId);
    };
    window.addEventListener('pointerup', onPointerUpCapture, true);
  };

  window.addEventListener('pointerdown', onPointerDownCapture, true);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) gpCloseModal(overlayId);
  });
}

function showToast(message, ok = true) {
  const el = document.createElement('div');
  el.className = `fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] rounded-xl px-4 py-2 text-sm shadow-2xl border transition-all duration-300 opacity-0 translate-y-2
    ${ok ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30' : 'bg-rose-500/20 text-rose-200 border-rose-400/30'}`;
  el.textContent = message;
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.classList.remove('opacity-0', 'translate-y-2');
  });
  setTimeout(() => {
    el.classList.add('opacity-0', 'translate-y-2');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
  }, 1200);
}

function showConfirmationMessage(m) {
  showToast(m, true);
}
function showErrorMessage(m) {
  showToast(m, false);
}

// ———————————————————————————————————————————————————————————————
// PROFILE MODAL
const OW_BASE = '/api/users';
(() => {
  const trigger = document.getElementById('user-profile');
  const overlay = document.getElementById('profileModal');
  const backdrop = document.getElementById('profileBackdrop');
  const avatarBtn = document.getElementById('avatarBtn');
  const avatarMenu = document.getElementById('avatarMenu');

  if (!overlay) return;

  const wrapper = document.getElementById('profileModalContent');
  if (wrapper) {
    if (!wrapper.hasAttribute('data-modal-box')) wrapper.setAttribute('data-modal-box', '');

    gpReplaceMaxW(wrapper, ['w-full', 'mx-auto', 'max-w-[700px]']);
    gpZeroHorizontalPadding(wrapper);
    gpMakeFlexFill(wrapper);
    wrapper.classList.add('pointer-events-auto');
  }

  gpInitModal('profileModal');
  gpBindModalClose('profileModal', {
    closeBtnSelector: '#profileClose',
    outsideRootSelector: '#profileCard',
  });

  function openProfile() {
    gpEnsureInBody(overlay);
    const box = document.getElementById('profileModalContent');
    if (box) {
      gpReplaceMaxW(box, ['w-full', 'mx-auto', 'max-w-[700px]']);
      gpZeroHorizontalPadding(box);
      gpMakeFlexFill(box);
    }
    avatarMenu?.classList.add('invisible', 'opacity-0', 'translate-y-1');
    avatarBtn?.setAttribute('aria-expanded', 'false');
    gpOpenModal('profileModal');
  }
  function closeProfile() {
    gpCloseModal('profileModal');
  }

  trigger?.addEventListener('click', (e) => {
    e.preventDefault();
    openProfile();
  });
  backdrop?.addEventListener('click', closeProfile);

  document.addEventListener(
    'click',
    async (e) => {
      const copyBtn = e.target?.closest?.('#copyUid');
      if (!copyBtn) return;
      const uidEl = document.getElementById('uid');
      try {
        await navigator.clipboard.writeText((uidEl?.textContent || '').trim());
        copyBtn.classList.add('ring-emerald-400/60');
        setTimeout(() => copyBtn.classList.remove('ring-emerald-400/60'), 600);
      } catch {}
    },
    true
  );

  document.addEventListener(
    'click',
    (e) => {
      const btn = e.target?.closest?.('#openSettings');
      if (!btn) return;
      e.preventDefault();
      closeProfile();
      const settings = document.getElementById('gp-settings-modal');
      if (settings) {
        gpOpenModal('gp-settings-modal');
        document.dispatchEvent(new CustomEvent('genji:settings-opened'));
      }
    },
    true
  );
})();
