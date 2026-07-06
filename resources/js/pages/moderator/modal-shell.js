// Canonical centered-modal shell for the moderator dashboard.
//
// One implementation of the overlay mechanics — scrim, panel, header/body/footer,
// focus trap + restore, Escape/backdrop dismiss, entrance motion, body-scroll lock,
// and a semantic z-index scale — that every edit/inspect overlay builds on. It
// replaces the per-tab hand-rolled modals AND the right-anchored slide-out drawers
// so the dashboard has exactly one overlay paradigm and one set of behaviours.
//
// Callers keep their own content + actions; the shell owns everything around them.
// `body`/`footer`/`headerActions` accept either an HTML string or a DOM node, since
// some callers build nodes (appendChild) and others render markup (innerHTML).

// ---- Semantic z-index scale -------------------------------------------------
// Replaces the ad-hoc z-[100]/[300]/[350]/[400]/[500] sprinkled across the old
// overlays. `base` is the normal modal layer; `elevated` is for a modal opened
// from within another modal (e.g. a viewer over an editor) so the stack is
// intentional rather than a guessed number.
export const MODAL_Z = { base: 300, elevated: 400 };

const WIDTHS = {
  sm: 'max-w-md', // compact forms, short confirmations
  md: 'max-w-2xl', // standard edit forms (default)
  lg: 'max-w-3xl', // inspection tables
  xl: 'max-w-4xl', // wide data / raw response viewer
};

// ease-out-quint: decisive entrance, settles without overshoot.
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const DURATION = 170;

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

// Body-scroll lock shared across stacked modals: lock on the first open, release
// only when the last one closes, so an inner modal closing doesn't restore scroll
// while an outer modal is still up.
let lockCount = 0;
let prevOverflow = '';
function lockScroll() {
  if (lockCount === 0) {
    prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
  }
  lockCount += 1;
}
function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) document.documentElement.style.overflow = prevOverflow;
}

let seq = 0;

// Put `content` (string | Node | null) into `host`. Strings are treated as HTML,
// matching the existing call sites that pass markup.
function fill(host, content) {
  if (content == null) return;
  if (typeof content === 'string') host.innerHTML = content;
  else host.appendChild(content);
}

/**
 * Open a centered modal.
 *
 * @param {object} opts
 * @param {string}        opts.title           Heading text (plain string; rendered as text).
 * @param {string}        [opts.subtitle]      Muted sub-heading under the title.
 * @param {string|Node}   [opts.body]          Body content. Append more later via the returned `body`.
 * @param {string|Node}   [opts.footer]        Sticky footer content (actions). Omit for read-only modals.
 * @param {string|Node}   [opts.headerActions] Extra controls left of Close (e.g. a Copy button).
 * @param {'sm'|'md'|'lg'|'xl'} [opts.width]    Panel max-width. Default 'md'.
 * @param {string}        [opts.bodyClass]     Override body padding/spacing. Default 'p-6'.
 * @param {'base'|'elevated'} [opts.level]      z-index layer. Default 'base'.
 * @param {boolean}       [opts.closeOnBackdrop] Default true.
 * @param {boolean}       [opts.closeOnEscape]   Default true.
 * @param {Function}      [opts.onClose]       Called once, after teardown.
 * @returns {{overlay:HTMLElement, panel:HTMLElement, header:HTMLElement, body:HTMLElement, footer:HTMLElement|null, close:Function}}
 */
export function openModal({
  title = '',
  subtitle = '',
  body = null,
  footer = null,
  headerActions = null,
  width = 'md',
  bodyClass = 'p-6',
  level = 'base',
  closeOnBackdrop = true,
  closeOnEscape = true,
  onClose = null,
} = {}) {
  const id = `modal-${++seq}`;
  const reduce = prefersReducedMotion();
  const restoreFocusTo = document.activeElement;

  const overlay = document.createElement('div');
  overlay.className =
    'fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm';
  overlay.style.zIndex = String(MODAL_Z[level] ?? MODAL_Z.base);
  overlay.style.opacity = reduce ? '1' : '0';
  if (!reduce) overlay.style.transition = `opacity ${DURATION}ms ${EASE}`;

  const panel = document.createElement('div');
  panel.className = [
    'flex max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl',
    'border border-zinc-200/80 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900',
    WIDTHS[width] || WIDTHS.md,
  ].join(' ');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('tabindex', '-1');
  if (title) panel.setAttribute('aria-labelledby', `${id}-title`);
  if (!reduce) {
    panel.style.transition = `opacity ${DURATION}ms ${EASE}, transform ${DURATION}ms ${EASE}`;
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(8px) scale(0.98)';
  }

  // --- Header: title/subtitle on the left, actions + Close on the right.
  const header = document.createElement('div');
  header.className =
    'flex shrink-0 items-start justify-between gap-3 border-b border-zinc-200/80 px-5 py-3.5 dark:border-white/10';
  const heading = document.createElement('div');
  heading.className = 'min-w-0';
  heading.innerHTML = `
    <h3 id="${id}-title" class="truncate font-semibold text-zinc-900 dark:text-white">${escapeText(title)}</h3>
    ${subtitle ? `<p class="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">${escapeText(subtitle)}</p>` : ''}`;
  const headerRight = document.createElement('div');
  headerRight.className = 'flex shrink-0 items-center gap-2';
  if (headerActions) fill(headerRight, headerActions);
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.className =
    'cursor-pointer rounded-lg border border-zinc-200/80 px-2 py-1 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10';
  closeBtn.innerHTML = '&#x2715;';
  headerRight.appendChild(closeBtn);
  header.append(heading, headerRight);

  // --- Body: the one scroll region.
  const bodyEl = document.createElement('div');
  bodyEl.className = `flex-1 overflow-auto ${bodyClass}`;
  fill(bodyEl, body);

  panel.append(header, bodyEl);

  // --- Footer: optional sticky action row.
  let footerEl = null;
  if (footer) {
    footerEl = document.createElement('div');
    footerEl.className =
      'flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-zinc-200/80 px-5 py-3.5 dark:border-white/10';
    fill(footerEl, footer);
    panel.appendChild(footerEl);
  }

  overlay.appendChild(panel);

  // --- Teardown (idempotent): reverse motion, remove node + listeners, restore.
  let closed = false;
  function close() {
    if (closed) return;
    closed = true;
    document.removeEventListener('keydown', onKey, true);
    unlockScroll();
    const finish = () => {
      overlay.remove();
      // Only restore focus if it still lives inside this modal — otherwise the
      // user has already moved on and we shouldn't yank it back.
      if (
        restoreFocusTo?.isConnected &&
        (!document.activeElement || overlay.contains(document.activeElement))
      ) {
        try {
          restoreFocusTo.focus({ preventScroll: true });
        } catch {
          /* noop */
        }
      }
      onClose?.();
    };
    if (reduce) {
      finish();
      return;
    }
    overlay.style.opacity = '0';
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(8px) scale(0.98)';
    let done = false;
    const end = () => {
      if (done) return;
      done = true;
      finish();
    };
    panel.addEventListener('transitionend', end, { once: true });
    setTimeout(end, DURATION + 60); // fallback if transitionend never fires
  }

  // Backdrop click (scrim only, not the panel) dismisses.
  if (closeOnBackdrop) {
    overlay.addEventListener('mousedown', (e) => {
      if (e.target === overlay) close();
    });
  }
  closeBtn.addEventListener('click', close);

  // Escape closes; Tab is trapped within the panel so focus never escapes to the
  // page behind. Capture phase so it wins over content handlers.
  function onKey(e) {
    if (e.key === 'Escape' && closeOnEscape) {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = Array.from(panel.querySelectorAll(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement
    );
    if (!items.length) {
      e.preventDefault();
      panel.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !panel.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }
  document.addEventListener('keydown', onKey, true);

  lockScroll();
  document.body.appendChild(overlay);

  // Move focus into the modal: first real control, else the panel itself.
  const firstField = panel.querySelector(FOCUSABLE);
  (firstField || panel).focus({ preventScroll: true });

  // Reveal: run the entrance on the next frame so the start state paints first.
  if (!reduce) {
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      panel.style.opacity = '1';
      panel.style.transform = 'translateY(0) scale(1)';
    });
  }

  return { overlay, panel, header, body: bodyEl, footer: footerEl, close };
}

// A primary action button using the dashboard's canonical emerald accent
// (.mod-btn-accent: white ink on emerald-700 clears AA in both themes).
// Returned detached so callers wire their own click/busy handling; pair with
// `setButtonBusy` for the saving state.
export function primaryButton(label, { type = 'button' } = {}) {
  const btn = document.createElement('button');
  btn.type = type;
  btn.className = 'cursor-pointer mod-btn-accent disabled:cursor-not-allowed';
  btn.textContent = label;
  return btn;
}

// A ghost/secondary button (Cancel, etc.) matching the dashboard's outline style.
export function ghostButton(label, { type = 'button' } = {}) {
  const btn = document.createElement('button');
  btn.type = type;
  btn.className =
    'cursor-pointer rounded-xl border border-zinc-200/80 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:hover:bg-white/10';
  btn.textContent = label;
  return btn;
}

// Toggle a button into/out of a busy state, swapping its label and disabling it.
// Returns nothing; restore by calling again with busy=false.
export function setButtonBusy(btn, busy, { busyLabel = 'Saving…', idleLabel } = {}) {
  if (!btn) return;
  if (busy) {
    btn.dataset.idleLabel = idleLabel ?? btn.textContent;
    btn.disabled = true;
    btn.textContent = busyLabel;
  } else {
    btn.disabled = false;
    btn.textContent = idleLabel ?? btn.dataset.idleLabel ?? btn.textContent;
    delete btn.dataset.idleLabel;
  }
}

// Escape text destined for an innerHTML sink (title/subtitle only).
function escapeText(s) {
  return String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}
