(function () {
  const els = document.querySelectorAll(
    'section[id^="hero"] .rounded-2xl, section[id^="hero"] h1, section[id^="hero"] h2, section[id^="hero"] p, section[id^="hero"] a'
  );

  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
    return;
  }

  els.forEach((el) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(8px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = 1;
          e.target.style.transform = 'translateY(0)';
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  els.forEach((el) => io.observe(el));
})();

// --- Toasts ---
function showToast(message, ok = true) {
  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.className = `fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] rounded-xl px-4 py-2 text-sm shadow-2xl border
    transition-all duration-300 opacity-0 translate-y-2
    ${ok ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30' : 'bg-rose-500/20 text-rose-200 border-rose-400/30'}`;
  el.textContent = message;
  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.classList.remove('opacity-0', 'translate-y-2');
  });

  setTimeout(() => {
    el.classList.add('opacity-0', 'translate-y-2');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
  }, 1400);
}
function showConfirmationMessage(m) {
  showToast(m, true);
}
function showErrorMessage(m) {
  showToast(m, false);
}

// --- Copy clipboard ---
function copyTextRobust(text) {
  if (!text && text !== 0) {
    return Promise.reject(new Error('No text to copy'));
  }

  const canUseClipboardApi =
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function' &&
    window.isSecureContext;

  if (canUseClipboardApi) {
    return navigator.clipboard.writeText(String(text));
  }

  return new Promise((resolve, reject) => {
    try {
      const ta = document.createElement('textarea');
      ta.value = String(text);
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);

      ta.focus();
      ta.select();
      ta.setSelectionRange(0, ta.value.length);

      const ok = document.execCommand('copy');
      document.body.removeChild(ta);

      if (ok) resolve();
      else reject(new Error('execCommand copy failed'));
    } catch (err) {
      reject(err);
    }
  });
}

function copyMapCodeToClipboard(code) {
  if (!code) {
    showErrorMessage('No map code found');
    return;
  }

  copyTextRobust(code)
    .then(() => showConfirmationMessage('Copied: ' + code))
    .catch(() => showErrorMessage('Failed to copy'));
}

// --- Bindings  ---
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-map-code]').forEach((el) => {
    el.classList.add('cursor-pointer', 'hover:text-emerald-300');
    el.addEventListener('click', () => {
      const code = el.getAttribute('data-map-code');
      copyMapCodeToClipboard(code);
    });
  });
});
