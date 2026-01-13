/* Notifications */
function getCsrf() {
  const el = document.querySelector('meta[name="csrf-token"]');
  return el?.getAttribute('content') || '';
}

// Badge cache (avoids blink on navigation)
const BADGE_CACHE_KEY = 'gp_notif_unread_count_v1';
const BADGE_CACHE_TS_KEY = 'gp_notif_unread_count_ts_v1';
const BADGE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 min

function readCachedUnreadCount() {
  try {
    const ts = Number(sessionStorage.getItem(BADGE_CACHE_TS_KEY) || 0);
    if (!ts || Date.now() - ts > BADGE_CACHE_TTL_MS) return null;
    const raw = sessionStorage.getItem(BADGE_CACHE_KEY);
    const n = Number(raw);
    return Number.isFinite(n) ? Math.max(0, n) : null;
  } catch (_) {
    return null;
  }
}

function writeCachedUnreadCount(n) {
  try {
    sessionStorage.setItem(BADGE_CACHE_KEY, String(n));
    sessionStorage.setItem(BADGE_CACHE_TS_KEY, String(Date.now()));
  } catch (_) {}
}

function transitionMs(el) {
  if (!el) return 0;
  const cs = getComputedStyle(el);
  const parse = (s) => {
    const v = String(s || '0s').trim();
    if (v.endsWith('ms')) return parseFloat(v) || 0;
    if (v.endsWith('s')) return (parseFloat(v) || 0) * 1000;
    return parseFloat(v) || 0;
  };
  // Only take the first duration/delay
  const dur = parse((cs.transitionDuration || '0s').split(',')[0]);
  const del = parse((cs.transitionDelay || '0s').split(',')[0]);
  return dur + del;
}

function waitTransitionEnd(el, fallback = 350) {
  if (!el) return Promise.resolve();
  const ms = Math.max(transitionMs(el), 0) || fallback;

  return new Promise((resolve) => {
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener('transitionend', onEnd);
      resolve();
    };

    const onEnd = (e) => {
      if (e.target !== el) return;
      // We only need one transition end (opacity or transform)
      finish();
    };

    el.addEventListener('transitionend', onEnd);
    setTimeout(finish, ms + 40);
  });
}

function nextFrame() {
  return new Promise((r) => requestAnimationFrame(() => r()));
}

async function httpJson(url, opts = {}) {
  const headers = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(opts.headers || {}),
  };

  // For PATCH/PUT/POST calls under web middleware
  if (opts.method && opts.method !== 'GET') {
    const csrf = getCsrf();
    if (csrf) headers['X-CSRF-TOKEN'] = csrf;
  }

  const res = await fetch(url, {
    credentials: 'same-origin',
    ...opts,
    headers,
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg = j?.message || msg;
    } catch (_) {}
    throw new Error(msg);
  }

  // Some endpoints may return 204
  if (res.status === 204) return null;

  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return await res.json();
  return null;
}

function relTime(iso) {
  const dt = new Date(iso);
  const now = new Date();
  const sec = Math.round((dt - now) / 1000);

  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  const abs = Math.abs(sec);

  if (abs < 60) return rtf.format(Math.round(sec), 'second');
  if (abs < 3600) return rtf.format(Math.round(sec / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(sec / 3600), 'hour');
  if (abs < 86400 * 7) return rtf.format(Math.round(sec / 86400), 'day');

  return dt.toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function isUnread(ev) {
  return !ev.read_at;
}

function tt(key, fallback = '') {
  try {
    if (typeof window !== 'undefined' && typeof window.t === 'function') {
      const v = window.t(key);
      if (v != null && String(v).trim() !== '') return v;
    }
  } catch (_) {}
  return fallback;
}

export function initNotifications() {
  const bellBtn = document.getElementById('notifBellBtn');
  const badge = document.getElementById('notifBadge');
  const tray = document.getElementById('notifTray');
  const list = document.getElementById('notifList');
  const empty = document.getElementById('notifEmpty');
  const markAllBtn = document.getElementById('notifMarkAllBtn');
  const footer = document.getElementById('notifFooter');
  const loadMoreBtn = document.getElementById('notifLoadMoreBtn');

  if (!bellBtn || !badge || !tray || !list || !empty) return;

  const reduceMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ensure base animation classes exist even if Blade wasn't updated
  tray.classList.add('origin-top-right', 'transition-[opacity,transform]', 'duration-300', 'ease-out');
  tray.classList.add('transform-gpu');

  // If you keep heavy blur in CSS, anims may jank.
  // We try to help the browser by hinting the properties.
  function hintWillChange(on) {
    if (on) {
      tray.style.willChange = 'transform, opacity';
    } else {
      tray.style.willChange = '';
    }
  }

  // Closed <-> open state classes
  function applyTrayState(isOpen) {
    tray.classList.remove('scale-95', 'scale-100');
    if (isOpen) {
      tray.classList.remove('opacity-0', 'translate-y-2', 'pointer-events-none');
      tray.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
    } else {
      tray.classList.add('opacity-0', 'translate-y-2', 'pointer-events-none');
      tray.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
    }
  }

  // Anchor tray under the bell button (no backdrop)
  let positionRaf = 0;
  function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  }

  function positionTray() {
    if (!tray || !bellBtn) return;

    // Ensure measurable
    const wasHidden = tray.classList.contains('hidden');
    if (wasHidden) {
      tray.classList.remove('hidden');
      tray.classList.add('pointer-events-none');
    }

    const gap = 8;
    const pad = 8;
    const b = bellBtn.getBoundingClientRect();
    const t = tray.getBoundingClientRect();

    // Right align the tray to the bell button
    let left = b.right - t.width;
    left = clamp(left, pad, window.innerWidth - t.width - pad);

    // Default: below bell
    let top = b.bottom + gap;

    // If it overflows bottom, try above bell
    const maxTop = window.innerHeight - t.height - pad;
    if (top > maxTop) {
      const above = b.top - gap - t.height;
      if (above >= pad) top = above;
      else top = clamp(maxTop, pad, maxTop);
    }

    tray.style.position = 'fixed';
    tray.style.left = `${Math.round(left)}px`;
    tray.style.top = `${Math.round(top)}px`;
    tray.style.right = 'auto';
    tray.style.bottom = 'auto';
    tray.style.transformOrigin = 'top right';

    if (wasHidden) {
      tray.classList.add('hidden');
      tray.classList.remove('pointer-events-none');
    }
  }

  function schedulePosition() {
    if (!open) return;
    if (positionRaf) cancelAnimationFrame(positionRaf);
    positionRaf = requestAnimationFrame(() => {
      positionRaf = 0;
      positionTray();
    });
  }

  function addPositionListeners() {
    window.addEventListener('resize', schedulePosition);
    // capture scroll on any scroll container
    window.addEventListener('scroll', schedulePosition, true);
  }

  function removePositionListeners() {
    window.removeEventListener('resize', schedulePosition);
    window.removeEventListener('scroll', schedulePosition, true);
    if (positionRaf) {
      cancelAnimationFrame(positionRaf);
      positionRaf = 0;
    }
  }

  // Badge rendering (avoid unnecessary toggles)
  let lastUnread = null;
  function applyUnreadCount(c) {
    const n = Math.max(0, Number(c || 0));
    if (lastUnread === n) return;
    lastUnread = n;

    if (n > 0) {
      badge.textContent = n > 99 ? '99+' : String(n);
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  // Apply cached value ASAP (avoids flicker)
  const cached = readCachedUnreadCount();
  if (cached !== null) applyUnreadCount(cached);

  let open = false;
  let loading = false;
  let offset = 0;
  let hasMore = false;
  const limit = 20;

  // When the tray is opening, defer heavy DOM rendering until animation ends
  let opening = false;
  let pendingRender = null;

  function handleOutsideClick(e) {
    if (!open) return;

    const target = e.target;
    const clickedInsideTray = tray.contains(target);
    const clickedBell = bellBtn.contains(target);

    if (!clickedInsideTray && !clickedBell) {
      setOpen(false);
    }
  }

  async function setOpen(next) {
    if (open === next) return;
    open = next;

    bellBtn.setAttribute('aria-expanded', open ? 'true' : 'false');

    if (open) {
      opening = !reduceMotion;
      pendingRender = null;

      hintWillChange(true);

      // Show elements and animate in
      tray.classList.remove('hidden');

      // Position under the bell before animating
      positionTray();

      // Start from closed state
      applyTrayState(false);

      // Let the browser paint the initial state, then animate.
      await nextFrame();
      await nextFrame();
      if (!open) return;

      // Reposition after first paint (in case width changes)
      positionTray();
      applyTrayState(true);

      document.addEventListener('pointerdown', handleOutsideClick);
      addPositionListeners();

      // Render skeleton AFTER animation has started (less jank)
      requestAnimationFrame(() => {
        if (!open) return;
        offset = 0;
        renderLoadingSkeleton();
        fetchEvents({ reset: true, deferUntilOpen: opening }).catch(() => renderEmpty());
      });

      if (opening) {
        await waitTransitionEnd(tray, 350);
        // Only flush if still open
        if (open) {
          opening = false;
          if (pendingRender) {
            const { events, reset } = pendingRender;
            pendingRender = null;
            renderEvents(events, { reset });
          }
        }
      }

      hintWillChange(false);
    } else {
      document.removeEventListener('pointerdown', handleOutsideClick);

      fetchUnreadCount();
      removePositionListeners();

      if (reduceMotion) {
        applyTrayState(false);
        tray.classList.add('hidden');
        return;
      }

      hintWillChange(true);
      applyTrayState(false);

      // Wait real transition end instead of fixed timeout (prevents cut animation)
      await waitTransitionEnd(tray, 350);

      if (!open) {
        tray.classList.add('hidden');
      }
      hintWillChange(false);
    }
  }

  function renderLoadingSkeleton() {
    list.querySelectorAll('[data-notif-item], [data-notif-empty], [data-notif-skel]').forEach((n) => n.remove());
    empty.classList.add('hidden');
    empty.style.opacity = '0';

    for (let i = 0; i < 5; i++) {
      const sk = el('div', 'mb-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2', '');
      sk.setAttribute('data-notif-skel', '1');
      sk.innerHTML =
        '<div class="h-3 w-2/3 rounded bg-white/10"></div><div class="mt-2 h-3 w-full rounded bg-white/10"></div><div class="mt-2 h-3 w-1/2 rounded bg-white/10"></div>';
      list.appendChild(sk);
    }
  }

  function renderEmpty() {
    list.querySelectorAll('[data-notif-item], [data-notif-skel]').forEach((n) => n.remove());
    empty.classList.remove('hidden');
    empty.style.opacity = '0';
    if (reduceMotion) {
      empty.style.opacity = '1';
    } else {
      requestAnimationFrame(() => {
        empty.style.opacity = '1';
      });
    }
    footer?.classList.add('hidden');
  }

  function renderEvents(events, { reset }) {
    list.querySelectorAll('[data-notif-skel]').forEach((n) => n.remove());
    empty.classList.add('hidden');
    empty.style.opacity = '0';

    if (reset) list.querySelectorAll('[data-notif-item]').forEach((n) => n.remove());

    if (!events || events.length === 0) {
      if (reset) renderEmpty();
      footer?.classList.add('hidden');
      return;
    }

    for (const ev of events) {
      if (ev.dismissed_at) continue;

      const item = el(
        'div',
        [
          'mb-2 cursor-pointer rounded-xl border px-3 py-2',
          'transition-[opacity,transform] duration-200 ease-out transform-gpu',
          isUnread(ev) ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-white/10 bg-white/5',
        ].join(' ')
      );
      item.setAttribute('data-notif-item', '1');

      const top = el('div', 'flex items-start justify-between gap-2');
      const left = el('div', 'min-w-0');

      const title = el(
        'div',
        ['truncate text-[13px]', isUnread(ev) ? 'font-extrabold text-white/95' : 'font-bold text-white/85'].join(' '),
        ev.title || tt('modals.notifications.fallback_title', 'Notification')
      );

      const body = el('div', 'mt-0.5 line-clamp-2 text-[12px] text-white/70', ev.body || '');

      const metaRow = el('div', 'mt-2 flex items-center gap-2 text-[11px] text-white/55');
      metaRow.appendChild(el('span', '', relTime(ev.created_at)));

      left.appendChild(title);
      left.appendChild(body);
      left.appendChild(metaRow);

      const actions = el('div', 'flex shrink-0 items-center');

      // Only dismiss button (Read removed)
      const dismissBtn = el(
        'button',
        'cursor-pointer rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 hover:bg-white/10 hover:text-white'
      );
      dismissBtn.type = 'button';
      dismissBtn.title = tt('modals.notifications.dismiss', 'Dismiss');
      dismissBtn.innerHTML =
        '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

      actions.appendChild(dismissBtn);

      top.appendChild(left);
      top.appendChild(actions);
      item.appendChild(top);

      // click item => mark read (but not when clicking button)
      item.addEventListener('click', async (e) => {
        if (e.target.closest('button')) return;
        await markRead(ev.id, item);
      });

      dismissBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await dismiss(ev.id, item);
      });

      list.appendChild(item);
    }

    footer?.classList.toggle('hidden', !hasMore);
  }

  async function fetchUnreadCount() {
    try {
      const data = await httpJson('/api/notifications/unread-count', { method: 'GET' });
      const c = Math.max(0, Number(data?.unread_count ?? 0));
      applyUnreadCount(c);
      writeCachedUnreadCount(c);
    } catch (_) {}
  }

  async function fetchEvents({ reset, deferUntilOpen }) {
    if (loading) return;
    loading = true;

    try {
      const data = await httpJson(
        `/api/notifications/events?unread_only=false&limit=${limit}&offset=${reset ? 0 : offset}`,
        { method: 'GET' }
      );

      const events = Array.isArray(data?.events) ? data.events : [];
      hasMore = Boolean(data?.has_more);

      if (reset) offset = 0;

      // Update paging state even if we defer rendering
      if (!reset) offset += limit;
      else offset = limit;

      if (deferUntilOpen && opening) {
        pendingRender = { events, reset };
      } else {
        renderEvents(events, { reset });
      }

      // Badge update is cheap
      fetchUnreadCount();
    } finally {
      loading = false;
    }
  }

  async function markRead(eventId, itemEl) {
    try {
      await httpJson(`/api/notifications/events/${eventId}/read`, { method: 'PATCH' });

      itemEl.classList.remove('border-emerald-500/30', 'bg-emerald-500/10');
      itemEl.classList.add('border-white/10', 'bg-white/5');
      const title = itemEl.querySelector('.text-[13px]');
      if (title) {
        title.classList.remove('font-extrabold', 'text-white/95');
        title.classList.add('font-bold', 'text-white/85');
      }

      fetchUnreadCount();
    } catch (_) {}
  }

  function animateDismissItem(itemEl) {
    if (!itemEl) return Promise.resolve();
    if (reduceMotion) {
      itemEl.remove();
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const h = itemEl.offsetHeight;
      const cs = getComputedStyle(itemEl);

      itemEl.style.height = h + 'px';
      itemEl.style.overflow = 'hidden';
      itemEl.style.willChange = 'height, opacity, transform';
      itemEl.style.transition = 'height 220ms ease, opacity 180ms ease, transform 180ms ease, margin 220ms ease, padding 220ms ease';

      // Preserve spacing then collapse it
      const mt = cs.marginTop;
      const mb = cs.marginBottom;
      const pt = cs.paddingTop;
      const pb = cs.paddingBottom;

      void itemEl.offsetHeight;

      requestAnimationFrame(() => {
        itemEl.style.opacity = '0';
        itemEl.style.transform = 'translateX(8px)';
        itemEl.style.height = '0px';
        itemEl.style.marginTop = '0px';
        itemEl.style.marginBottom = '0px';
        itemEl.style.paddingTop = '0px';
        itemEl.style.paddingBottom = '0px';

        // Fallback timer (in case transitionend doesn't fire)
        setTimeout(() => {
          itemEl.remove();
          resolve();
        }, 280);

        itemEl.addEventListener(
          'transitionend',
          (e) => {
            if (e.target !== itemEl) return;
            itemEl.remove();
            resolve();
          },
          { once: true }
        );
      });

      // If something needs to restore (rare), keep values stored (unused here)
      itemEl.dataset._mt = mt;
      itemEl.dataset._mb = mb;
      itemEl.dataset._pt = pt;
      itemEl.dataset._pb = pb;
    });
  }

  async function dismiss(eventId, itemEl) {
    // Start animation immediately for smooth UX
    const anim = animateDismissItem(itemEl);

    try {
      await httpJson(`/api/notifications/events/${eventId}/dismiss`, { method: 'PATCH' });
    } catch (e) {
      // If API failed, re-sync list to restore consistency
      if (open) {
        try {
          await fetchEvents({ reset: true, deferUntilOpen: false });
        } catch (_) {}
      }
    } finally {
      await anim;
      const any = list.querySelector('[data-notif-item]');
      if (!any) renderEmpty();
      fetchUnreadCount();
    }
  }

  bellBtn.addEventListener('click', () => setOpen(!open));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setOpen(false);
  });

  markAllBtn?.addEventListener('click', async () => {
    try {
      await httpJson('/api/notifications/read-all', { method: 'PATCH' });

      list.querySelectorAll('[data-notif-item]').forEach((itemEl) => {
        itemEl.classList.remove('border-emerald-500/30', 'bg-emerald-500/10');
        itemEl.classList.add('border-white/10', 'bg-white/5');
        const title = itemEl.querySelector('.text-[13px]');
        if (title) {
          title.classList.remove('font-extrabold', 'text-white/95');
          title.classList.add('font-bold', 'text-white/85');
        }
      });

      badge.classList.add('hidden');
      writeCachedUnreadCount(0);
    } catch (_) {}
  });

  loadMoreBtn?.addEventListener('click', async () => {
    await fetchEvents({ reset: false, deferUntilOpen: false });
  });

  fetchUnreadCount();
  const poll = setInterval(fetchUnreadCount, 45_000);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) fetchUnreadCount();
  });

  return () => {
    clearInterval(poll);
    document.removeEventListener('pointerdown', handleOutsideClick);
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initNotifications());
} else {
  initNotifications();
}
