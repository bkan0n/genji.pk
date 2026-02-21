/* =========================
   INIT
   ========================= */

const STORE_API = '/api/store';

function $(id) {
  return document.getElementById(id);
}

function safeJsonParse(text) {
  try { return JSON.parse(text); } catch { return null; }
}

function fmtTime(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function asMoney(n) {
  if (n == null) return '—';

  const raw = typeof n === 'string' ? n.trim() : String(n);
  const x = Number(raw);
  if (!Number.isFinite(x)) return '—';

  const s = /^[+-]?\d+(\.\d+)?$/.test(raw) ? raw : String(x);

  const neg = s.startsWith('-');
  const body = neg ? s.slice(1) : s;

  const [intPart, fracPart] = body.split('.');
  const groupedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return (neg ? '-' : '') + groupedInt + (fracPart != null ? `.${fracPart}` : '');
}

/* =========================
   I18N
   ========================= */

function getI18nRoot() {
  const root = window.LOOTBOX_I18N || {};
  // You renamed store_js -> store, so we use lootbox.store.* for JS strings too.
  return root;
}

function t(path, fallback = '') {
  const root = getI18nRoot();
  const parts = String(path || '').split('.');
  let cur = root;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
    else return fallback;
  }
  return typeof cur === 'string' ? cur : fallback;
}

function tpl(str, vars = {}) {
  let out = String(str ?? '');
  Object.entries(vars || {}).forEach(([k, v]) => {
    out = out.replaceAll(`:${k}`, String(v));
  });
  return out;
}

// Some values may be absent depending on your translation file.
// Provide safe fallbacks so the UI never breaks.
const I18N = {
  // generic
  dash: '—',

  // store
  loading_rotation: () => t('store.loading_rotation', 'Loading rotation…'),
  available_until: (date) => tpl(t('store.available_until', 'Available until :date'), { date }),
  rotation_number: (id) => tpl(t('store.rotation_number', 'Rotation #:id'), { id }),

  login_required: () => t('store.login_required', 'Login required.'),
  login_required_store: () => t('store.login_required_store', 'Login required to use the store.'),
  login_required_purchases: () => t('store.login_required_purchases', 'Login to see purchases.'),

  no_items_rotation: () => t('store.no_items_rotation', 'No items in rotation.'),
  no_purchases: () => t('store.no_purchases', 'No purchases yet.'),

  label_price: () => t('store.price', 'Price'),
  label_paid: () => t('store.paid', 'paid'),

  owned: () => t('store.owned', 'OWNED'),
  buy: () => t('store.buy', 'Buy'),
  item_fallback: () => t('store.item', 'Item'),

  item_purchased: () => t('store.item_purchased', 'Item purchased!'),
  keys_purchased: () => t('store.keys_purchased', 'Keys purchased!'),
  purchase_failed: () => t('store.purchase_failed', 'Purchase failed.'),
  store_refreshed: () => t('store.store_refreshed', 'Store refreshed.'),

  discount: (percent) => tpl(t('store.discount', 'Discount: :percent%'), { percent }),
  no_discount: () => t('store.no_discount', 'No discount'),

  image_unavailable: () => t('store.image_unavailable', 'Image unavailable'),
  no_image: () => t('store.no_image', 'No image'),
};

/* =========================
   MODAL HELPERS
   ========================= */

function gpGetModalBox(overlay) {
  return (
    overlay?.querySelector?.(
      '[data-modal-box], #gp-settings-card, .modal-card, .modal-panel, .modal-content, .card, [role="dialog"]'
    ) ||
    overlay?.firstElementChild ||
    null
  );
}

function prefersReducedMotion() {
  try {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

function waitTransition(el, ms = 220) {
  return new Promise((resolve) => {
    if (!el) return resolve();
    if (prefersReducedMotion()) return resolve();

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener('transitionend', onEnd);
      clearTimeout(t);
      resolve();
    };

    const onEnd = (e) => {
      if (e && e.target !== el) return;
      finish();
    };

    const t = setTimeout(finish, ms + 60);
    el.addEventListener('transitionend', onEnd, { once: false });
  });
}

function ensureOverlayTransition(overlay) {
  if (!overlay) return;
  overlay.classList.add('transition-opacity', 'duration-200', 'ease-out');
}

function ensureBoxTransition(box) {
  if (!box) return;
  box.classList.add('transition', 'duration-200', 'ease-out', 'will-change-transform');
}

let __gp_last_focused = null;

function gpOpenModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;

  const box = gpGetModalBox(overlay);
  ensureOverlayTransition(overlay);
  ensureBoxTransition(box);

  __gp_last_focused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  overlay.classList.remove('hidden');
  overlay.classList.add('flex');

  overlay.classList.add('opacity-0');
  overlay.classList.remove('opacity-100');

  if (box) {
    box.classList.add('opacity-0', 'scale-[0.98]', 'translate-y-1');
    box.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
  }

  requestAnimationFrame(() => {
    overlay.classList.remove('opacity-0');
    overlay.classList.add('opacity-100');

    if (box) {
      box.classList.remove('opacity-0', 'scale-[0.98]', 'translate-y-1');
      box.classList.add('opacity-100', 'scale-100', 'translate-y-0');
    }
  });
}

async function gpCloseModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;

  const box = gpGetModalBox(overlay);
  ensureOverlayTransition(overlay);
  ensureBoxTransition(box);

  if (!box) {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    document.documentElement.classList.remove('overflow-hidden');
    document.body.classList.remove('overflow-hidden');
    __gp_last_focused?.focus?.();
    return;
  }

  overlay.classList.add('opacity-0');
  overlay.classList.remove('opacity-100');

  box.classList.add('opacity-0', 'scale-[0.98]', 'translate-y-1');
  box.classList.remove('opacity-100', 'scale-100', 'translate-y-0');

  await Promise.allSettled([waitTransition(box, 220), waitTransition(overlay, 220)]);

  overlay.classList.add('hidden');
  overlay.classList.remove('flex');

  document.documentElement.classList.remove('overflow-hidden');
  document.body.classList.remove('overflow-hidden');

  __gp_last_focused?.focus?.();
}

/* =========================
   TOAST + HTTP
   ========================= */

function toastOk(msg) {
  if (typeof window.showToast === 'function') return window.showToast(msg, 'ok');
  console.log('[store]', msg);
}

function toastErr(msg) {
  if (typeof window.showToast === 'function') return window.showToast(msg, 'error');
  console.warn('[store]', msg);
}

async function httpJson(url, opts = {}) {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { Accept: 'application/json', ...(opts.headers || {}) },
    ...opts,
  });

  const text = await res.text();
  const json = safeJsonParse(text);

  if (!res.ok) {
    const payload = json || text;
    const msg = payload?.message || payload?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return json ?? text ?? {};
}

function normalizeCoinsPayload(data) {
  if (data == null) return null;

  if (typeof data === 'number') return Number.isFinite(data) ? data : null;

  if (typeof data === 'string') {
    const n = Number(data.trim());
    return Number.isFinite(n) ? n : null;
  }

  const direct = data?.coins ?? data?.data?.coins;
  const n = Number(direct);
  return Number.isFinite(n) ? n : null;
}

/* =========================
   THEME-SAFE CLASS PRESETS
   =========================
   Goal: Avoid "dark-only" classes like bg-zinc-950/35 and text-zinc-100,
   so everything looks good on light AND dark.
*/

const CLS = {
  // Skeleton blocks
  skCard: 'relative overflow-hidden rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-950/35 ring-1 ring-zinc-200/40 dark:ring-white/10 animate-pulse',
  skRow: 'rounded-xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-950/35 px-3 py-2 flex items-start justify-between gap-3 animate-pulse',

  // Skeleton inner bars
  skBarStrong: 'rounded bg-zinc-900/10 dark:bg-white/10',
  skBarSoft: 'rounded bg-zinc-900/5 dark:bg-white/5',

  // Rotation card base
  cardBase:
    'relative overflow-hidden rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/75 dark:bg-zinc-950/35 ring-1 ring-zinc-200/40 dark:ring-white/10',
  cardImgBox:
    'relative overflow-hidden rounded-xl border border-zinc-200/70 dark:border-white/10 bg-zinc-900/5 dark:bg-black/20 aspect-[4/3]',
  cardImgFallback:
    'rounded-xl border border-zinc-200/70 dark:border-white/10 bg-zinc-900/5 dark:bg-zinc-900/40 aspect-[4/3] flex items-center justify-center text-[11px] text-zinc-500 dark:text-zinc-400',

  // Text colors
  title: 'text-zinc-900 dark:text-zinc-100',
  sub: 'text-zinc-600 dark:text-zinc-300',
  muted: 'text-zinc-500 dark:text-zinc-400',

  // Buttons
  buyBtn:
    'store-buy-item cursor-pointer rounded-xl bg-zinc-900/5 hover:bg-zinc-900/10 dark:bg-white/8 dark:hover:bg-white/12 border border-zinc-200/70 dark:border-white/10 px-3 py-1.5 text-xs font-extrabold text-zinc-900 dark:text-zinc-100 transition',
  ownedPill:
    'text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 ring-1 ring-emerald-400/20 rounded-full px-3 py-1',

  // History rows
  histRow:
    'rounded-xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-950/35 px-3 py-2 flex items-start justify-between gap-3',
};

/* =========================
   SKELETONS
   ========================= */

function skeletonRotationCard() {
  const el = document.createElement('div');
  el.className = CLS.skCard;

  el.innerHTML = `
    <div class="p-3 flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1 space-y-2">
        <div class="h-4 w-36 ${CLS.skBarStrong}"></div>
        <div class="h-3 w-20 ${CLS.skBarSoft}"></div>
      </div>
      <div class="h-5 w-14 ${CLS.skBarStrong}"></div>
    </div>
    <div class="px-3 pb-2">
      <div class="relative overflow-hidden rounded-xl border border-zinc-200/70 dark:border-white/10 bg-zinc-900/5 dark:bg-white/5 aspect-[4/3]"></div>
    </div>
    <div class="px-3 pb-3 flex items-center justify-between gap-3">
      <div class="h-4 w-24 ${CLS.skBarStrong}"></div>
      <div class="h-8 w-20 rounded-xl ${CLS.skBarStrong} border border-zinc-200/70 dark:border-white/10"></div>
    </div>
  `;
  return el;
}

function renderRotationSkeleton(container, count = 4) {
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < count; i++) container.appendChild(skeletonRotationCard());
}

function skeletonHistoryRow() {
  const el = document.createElement('div');
  el.className = CLS.skRow;

  el.innerHTML = `
    <div class="min-w-0 flex-1 space-y-2">
      <div class="h-3.5 w-32 ${CLS.skBarStrong}"></div>
      <div class="h-3 w-20 ${CLS.skBarSoft}"></div>
      <div class="h-3 w-24 ${CLS.skBarSoft}"></div>
    </div>
    <div class="text-right shrink-0 space-y-2">
      <div class="h-3 w-10 ${CLS.skBarSoft} ml-auto"></div>
      <div class="h-4 w-14 ${CLS.skBarStrong} ml-auto"></div>
    </div>
  `;
  return el;
}

function renderHistorySkeleton(container, count = 4) {
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < count; i++) container.appendChild(skeletonHistoryRow());
}

function setCoinsSkeleton(coinsEl) {
  if (!coinsEl) return;
  coinsEl.innerHTML = `<span class="inline-block h-4 w-10 rounded bg-amber-500/30 animate-pulse align-middle"></span>`;
}

function setPricingSkeleton(keyPriceEl, keysNoteEl) {
  if (keyPriceEl) {
    keyPriceEl.innerHTML = `<span class="inline-block h-4 w-20 rounded bg-emerald-400/10 animate-pulse"></span>`;
  }
  if (keysNoteEl) {
    keysNoteEl.innerHTML = `<span class="inline-block h-3 w-24 rounded bg-zinc-900/10 dark:bg-white/10 animate-pulse"></span>`;
  }
}

/* =========================
   UI BUILDERS
   ========================= */

function buildRotationCard(item, onBuy) {
  const owned = !!item.owned;
  const rarity = String(item.rarity || 'common').toLowerCase();
  const price = item.price ?? item.price_paid ?? item.cost ?? 0;

  const imgUrl = item.url || item.image_url || item.image || null;

  // Keep glow styles as "nice-to-have" and theme-safe:
  // - Add also a light-mode ring variant so it's visible in white theme.
  const rarityGlow =
    rarity === 'legendary'
      ? 'ring-amber-400/30 dark:ring-amber-400/40 shadow-[0_0_22px_rgba(251,191,36,.12)]'
      : rarity === 'epic'
        ? 'ring-purple-400/25 dark:ring-purple-400/40 shadow-[0_0_22px_rgba(168,85,247,.10)]'
        : rarity === 'rare'
          ? 'ring-sky-400/25 dark:ring-sky-400/40 shadow-[0_0_22px_rgba(56,189,248,.10)]'
          : 'ring-zinc-200/60 dark:ring-white/10 shadow-[0_0_18px_rgba(0,0,0,.05)] dark:shadow-[0_0_18px_rgba(255,255,255,.06)]';

  const badge =
    rarity === 'legendary'
      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
      : rarity === 'epic'
        ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300'
        : rarity === 'rare'
          ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300'
          : 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-200';

  const wrap = document.createElement('div');
  wrap.className = `${CLS.cardBase} ${rarityGlow}`;

  // Escape helper for attributes/text
  const esc = (s) =>
    String(s ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

  const itemName = item.item_name || I18N.item_fallback();
  const itemType = item.item_type || I18N.dash;

  wrap.innerHTML = `
    <div class="p-3 flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="text-sm font-extrabold ${CLS.title} truncate">${esc(itemName)}</div>
        <div class="text-xs ${CLS.muted} truncate">${esc(itemType)}</div>
      </div>
      <span class="shrink-0 inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase ${badge}">
        ${esc(rarity)}
      </span>
    </div>

    <div class="px-3 pb-2">
      ${
        imgUrl
          ? `
            <div class="${CLS.cardImgBox}">
              <img
                class="absolute inset-0 w-full h-full object-contain"
                src="${esc(imgUrl)}"
                alt="${esc(itemName)}"
                loading="lazy"
              />
            </div>
          `
          : `
            <div class="${CLS.cardImgFallback}">
              ${esc(I18N.no_image())}
            </div>
          `
      }
    </div>

    <div class="px-3 pb-3 flex items-center justify-between gap-3">
      <div class="text-xs ${CLS.sub}">
        <span class="opacity-75">${esc(I18N.label_price())}</span>
        <span class="font-extrabold text-emerald-700 dark:text-emerald-200 ml-1">${esc(asMoney(price))}</span>
      </div>

      ${
        owned
          ? `<div class="${CLS.ownedPill}">${esc(I18N.owned())}</div>`
          : `<button type="button" class="${CLS.buyBtn}">${esc(I18N.buy())}</button>`
      }
    </div>
  `;

  const img = wrap.querySelector('img');
  if (img) {
    img.addEventListener('error', () => {
      const box = img.parentElement;
      if (!box) return;
      box.innerHTML = `
        <div class="w-full h-full flex items-center justify-center text-[11px] text-zinc-500 dark:text-zinc-400">
          ${I18N.image_unavailable()}
        </div>
      `;
      box.classList.remove('bg-zinc-900/5', 'dark:bg-black/20');
      box.classList.add('bg-zinc-900/5', 'dark:bg-zinc-900/40');
    });
  }

  const btn = wrap.querySelector('.store-buy-item');
  if (btn) btn.addEventListener('click', () => onBuy(item));
  return wrap;
}

function renderHistory(container, purchases) {
  container.innerHTML = '';

  const list = Array.isArray(purchases) ? purchases : (purchases?.purchases || []);
  if (!list.length) {
    container.innerHTML = `<div class="text-xs ${CLS.sub} px-2 py-2">${I18N.no_purchases()}</div>`;
    return;
  }

  list.slice(0, 8).forEach((p) => {
    const row = document.createElement('div');
    row.className = CLS.histRow;

    const name = p.item_name || p.key_type || 'Purchase';
    const type = p.purchase_type || p.item_type || I18N.dash;
    const when = fmtTime(p.purchased_at);

    row.innerHTML = `
      <div class="min-w-0">
        <div class="text-xs font-bold ${CLS.title} truncate">${String(name)}</div>
        <div class="text-[11px] ${CLS.muted} truncate">${String(type)}</div>
        <div class="text-[11px] ${CLS.muted}">${String(when)}</div>
      </div>
      <div class="text-right shrink-0">
        <div class="text-[11px] ${CLS.muted}">${I18N.label_paid()}</div>
        <div class="text-xs font-extrabold text-emerald-700 dark:text-emerald-200">${asMoney(p.price_paid)}</div>
      </div>
    `;

    container.appendChild(row);
  });
}

/* =========================
   CUSTOM DROPDOWNS
   ========================= */

function ddClose(root) {
  if (!root) return;
  const btn = root.querySelector('button[aria-haspopup="listbox"]');
  const list = root.querySelector('[role="listbox"]');
  if (!btn || !list) return;

  btn.setAttribute('aria-expanded', 'false');
  list.setAttribute('aria-hidden', 'true');
  list.classList.add('hidden');
  list.classList.remove('dd-in');
}

function ddOpen(root) {
  if (!root) return;
  const btn = root.querySelector('button[aria-haspopup="listbox"]');
  const list = root.querySelector('[role="listbox"]');
  if (!btn || !list) return;

  btn.setAttribute('aria-expanded', 'true');
  list.setAttribute('aria-hidden', 'false');
  list.classList.remove('hidden');
  list.classList.add('dd-in');
}

function ddIsOpen(root) {
  const btn = root?.querySelector?.('button[aria-haspopup="listbox"]');
  return btn?.getAttribute('aria-expanded') === 'true';
}

function ddSetValue({ root, hiddenInput, labelEl, value, label }) {
  if (!root) return;
  if (hiddenInput) hiddenInput.value = String(value);
  if (labelEl) labelEl.textContent = String(label ?? value);

  // Make selection highlight theme-safe (light + dark)
  root.querySelectorAll('.dd-opt').forEach((opt) => {
    const isSel = String(opt.dataset.value) === String(value);

    // Selected background
    opt.classList.toggle('bg-zinc-100', isSel);
    opt.classList.toggle('dark:bg-white/10', isSel);

    // Selected text (optional but nice)
    opt.classList.toggle('text-zinc-900', isSel);
    opt.classList.toggle('dark:text-zinc-100', isSel);

    opt.setAttribute('aria-selected', isSel ? 'true' : 'false');
  });

  if (hiddenInput) {
    hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

function setupCustomDropdown({ rootId, hiddenId, btnId, listId, labelId, onChange }) {
  const root = $(rootId);
  const hiddenInput = $(hiddenId);
  const btn = $(btnId);
  const list = $(listId);
  const labelEl = $(labelId);

  if (!root || !hiddenInput || !btn || !list) return () => {};

  root.setAttribute('data-dd-root', '1');

  list.querySelectorAll('.dd-opt').forEach((opt) => {
    opt.setAttribute('tabindex', '0');
    opt.setAttribute('role', 'option');
  });

  const initVal = hiddenInput.value || list.querySelector('.dd-opt')?.dataset?.value || '';
  const initOpt =
    list.querySelector(`.dd-opt[data-value="${CSS.escape(String(initVal))}"]`) || list.querySelector('.dd-opt');

  ddSetValue({
    root,
    hiddenInput,
    labelEl,
    value: initVal,
    label: initOpt?.textContent?.trim() || initVal,
  });

  const closeAllOthers = () => {
    document.querySelectorAll('[data-dd-root]').forEach((r) => {
      if (r !== root) ddClose(r);
    });
  };

  const toggle = () => {
    if (ddIsOpen(root)) {
      ddClose(root);
      return;
    }
    closeAllOthers();
    ddOpen(root);

    const cur = hiddenInput.value;
    const opt =
      list.querySelector(`.dd-opt[data-value="${CSS.escape(String(cur))}"]`) || list.querySelector('.dd-opt');
    opt?.focus?.();
  };

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    toggle();
  });

  list.addEventListener('click', (e) => {
    const opt = e.target?.closest?.('.dd-opt');
    if (!opt) return;
    e.preventDefault();

    const val = opt.dataset.value ?? '';
    const lbl = opt.textContent?.trim() || val;

    ddSetValue({ root, hiddenInput, labelEl, value: val, label: lbl });
    ddClose(root);
    onChange?.(String(val));
  });

  list.addEventListener('keydown', (e) => {
    const opts = Array.from(list.querySelectorAll('.dd-opt'));
    if (!opts.length) return;

    const active = document.activeElement;
    const idx = Math.max(0, opts.indexOf(active));

    if (e.key === 'Escape') {
      e.preventDefault();
      ddClose(root);
      btn.focus();
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      active?.click?.();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      (opts[idx + 1] || opts[0]).focus();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      (opts[idx - 1] || opts[opts.length - 1]).focus();
      return;
    }
  });

  const onDocDown = (e) => {
    if (!ddIsOpen(root)) return;
    if (root.contains(e.target)) return;
    ddClose(root);
  };

  document.addEventListener('mousedown', onDocDown);

  return () => {
    document.removeEventListener('mousedown', onDocDown);
  };
}

/* =========================
   STORE MODAL
   ========================= */

export function initStoreModal({ getUserId, showToast } = {}) {
  if (typeof showToast === 'function') window.showToast = showToast;

  const modal = $('storeModal');
  const openBtn = $('store-button');
  const closeBtn = $('store-close');
  const refreshBtn = $('store-refresh');

  const rotationEl = $('store-rotation');
  const ttlEl = $('store-rotation-ttl');

  const keyTypeEl = $('store-key-type');
  const keyQtyEl = $('store-key-qty');
  const keyPriceEl = $('store-key-price');
  const buyKeysBtn = $('store-buy-keys');
  const keysNoteEl = $('store-keys-note');

  const historyEl = $('store-history');

  const coinsEl = $('store-coins');
  const coinsPillEl = $('store-coins-pill');

  if (!modal || !openBtn) return;

  let pricingCache = null;
  let rotationCache = null;
  let loading = false;

  let isOpen = false;
  let seq = 0;
  let aborter = null;

  let teardownDdType = null;
  let teardownDdQty = null;

  function nextSeq() {
    seq += 1;
    return seq;
  }

  function currentSeq() {
    return seq;
  }

  function abortInFlight() {
    try { aborter?.abort?.(); } catch {}
    aborter = null;
  }

  function userId() {
    const id = typeof getUserId === 'function' ? getUserId() : window.user_id;
    return id ? String(id) : '';
  }

  function setLoading(v) {
    loading = v;
    if (buyKeysBtn) buyKeysBtn.disabled = v;
    if (refreshBtn) refreshBtn.disabled = v;
  }

  function setCoinsUi(value) {
    if (!coinsEl) return;
    coinsEl.textContent = value == null ? I18N.dash : `${asMoney(value)}`;
  }

  function computePrice(keyType, qty) {
    if (!pricingCache) return null;
    const keys = pricingCache.keys || pricingCache?.data?.keys || pricingCache;
    const active = pricingCache.active_key_type || pricingCache?.data?.active_key_type;

    const list = Array.isArray(keys) ? keys : [];
    const kt = list.find((k) => String(k.key_type) === String(keyType));
    if (!kt) return null;

    const prices = Array.isArray(kt.prices) ? kt.prices : [];
    const row = prices.find((p) => Number(p.quantity) === Number(qty)) || prices[0];
    if (!row) return null;

    return {
      active_key_type: active || null,
      key_type: kt.key_type,
      price: row.price,
      discount_percent: row.discount_percent,
    };
  }

  function updateKeyUi() {
    const kt = keyTypeEl?.value || 'Classic';
    const qty = Number(keyQtyEl?.value || 1);

    const info = computePrice(kt, qty);
    if (!info) {
      if (keyPriceEl) keyPriceEl.textContent = I18N.dash;
      if (keysNoteEl) keysNoteEl.textContent = '';
      return;
    }

    if (keyPriceEl) keyPriceEl.textContent = `${asMoney(info.price)} ${t('store.coins_label', 'coins')}`;

    const disc = Number(info.discount_percent || 0);
    if (keysNoteEl) keysNoteEl.textContent = disc > 0 ? I18N.discount(disc) : I18N.no_discount();
  }

  function ensureCustomDropdowns() {
    if (teardownDdType && teardownDdQty) return;

    teardownDdType = setupCustomDropdown({
      rootId: 'store-key-type-wrap',
      hiddenId: 'store-key-type',
      btnId: 'store-key-type-btn',
      listId: 'store-key-type-list',
      labelId: 'store-key-type-label',
      onChange: () => updateKeyUi(),
    });

    teardownDdQty = setupCustomDropdown({
      rootId: 'store-key-qty-wrap',
      hiddenId: 'store-key-qty',
      btnId: 'store-key-qty-btn',
      listId: 'store-key-qty-list',
      labelId: 'store-key-qty-label',
      onChange: () => updateKeyUi(),
    });
  }

  function showStoreSkeletons() {
    coinsPillEl?.classList.remove('hidden');
    setCoinsSkeleton(coinsEl);
    renderRotationSkeleton(rotationEl, 4);
    renderHistorySkeleton(historyEl, 4);
    setPricingSkeleton(keyPriceEl, keysNoteEl);
    if (ttlEl) ttlEl.textContent = I18N.loading_rotation();
  }

  async function loadCoins(localSeq, signal) {
    const uid = userId();
    if (!uid) {
      if (localSeq !== currentSeq() || !isOpen) return;
      setCoinsUi(null);
      return;
    }

    const data = await httpJson(`${STORE_API}/users/${encodeURIComponent(uid)}/coins`, {
      cache: 'no-store',
      signal,
    });

    if (localSeq !== currentSeq() || !isOpen) return;

    const coins = normalizeCoinsPayload(data);
    setCoinsUi(coins);
  }

  async function loadPricing(localSeq, signal) {
    pricingCache = await httpJson(`${STORE_API}/keys`, { cache: 'no-store', signal });
    if (localSeq !== currentSeq() || !isOpen) return;
    updateKeyUi();
  }

  async function loadRotation(localSeq, signal) {
    const uid = userId();
    const qs = uid ? `?user_id=${encodeURIComponent(uid)}` : '';

    rotationCache = await httpJson(`${STORE_API}/rotation${qs}`, { cache: 'no-store', signal });
    if (localSeq !== currentSeq() || !isOpen) return;

    const rid = rotationCache.rotation_id || rotationCache?.data?.rotation_id;
    const until = rotationCache.available_until || rotationCache?.data?.available_until;

    if (ttlEl) {
      if (until) ttlEl.textContent = I18N.available_until(fmtTime(until));
      else if (rid) ttlEl.textContent = I18N.rotation_number(rid);
      else ttlEl.textContent = I18N.dash;
    }

    const items = rotationCache.items || rotationCache?.data?.items || [];
    rotationEl.innerHTML = '';

    if (!Array.isArray(items) || !items.length) {
      rotationEl.innerHTML = `<div class="text-sm ${CLS.sub}">${I18N.no_items_rotation()}</div>`;
      return;
    }

    items.forEach((it) => {
      const card = buildRotationCard(it, async (item) => {
        const uid2 = userId();
        if (!uid2) return toastErr(I18N.login_required());
        if (loading) return;

        setLoading(true);
        try {
          const payload = {
            user_id: String(uid2),
            item_name: String(item.item_name || ''),
            item_type: String(item.item_type || ''),
            key_type: String(item.key_type || ''),
          };

          await httpJson(`${STORE_API}/purchase/item`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          toastOk(I18N.item_purchased());

          const s = nextSeq();
          abortInFlight();
          aborter = new AbortController();
          showStoreSkeletons();

          await Promise.allSettled([
            loadCoins(s, aborter.signal),
            loadPricing(s, aborter.signal),
            loadRotation(s, aborter.signal),
            loadHistory(s, aborter.signal),
          ]);
        } catch (e) {
          toastErr(e.message || I18N.purchase_failed());
        } finally {
          setLoading(false);
        }
      });

      rotationEl.appendChild(card);
    });
  }

  async function loadHistory(localSeq, signal) {
    const uid = userId();
    if (!uid) {
      if (localSeq !== currentSeq() || !isOpen) return;
      historyEl.innerHTML = `<div class="text-xs ${CLS.sub} px-2 py-2">${I18N.login_required_purchases()}</div>`;
      return;
    }

    const url = `${STORE_API}/users/${encodeURIComponent(uid)}/purchases?limit=8&offset=0`;
    const data = await httpJson(url, { cache: 'no-store', signal });

    if (localSeq !== currentSeq() || !isOpen) return;
    renderHistory(historyEl, data);
  }

  async function openAndLoad() {
    isOpen = true;
    const s = nextSeq();

    abortInFlight();
    aborter = new AbortController();

    gpOpenModal('storeModal');
    ensureCustomDropdowns();
    requestAnimationFrame(() => closeBtn?.focus?.());

    const uid = userId();
    if (!uid) {
      coinsPillEl?.classList.remove('hidden');
      setCoinsUi(null);
      rotationEl.innerHTML = `<div class="text-sm ${CLS.sub}">${I18N.login_required_store()}</div>`;
      historyEl.innerHTML = `<div class="text-xs ${CLS.sub} px-2 py-2">${I18N.login_required_purchases()}</div>`;
      return;
    }

    showStoreSkeletons();
    setLoading(true);
    try {
      await Promise.allSettled([
        loadCoins(s, aborter.signal),
        loadPricing(s, aborter.signal),
        loadRotation(s, aborter.signal),
        loadHistory(s, aborter.signal),
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function closeStore() {
    isOpen = false;
    nextSeq();
    abortInFlight();

    document.querySelectorAll('[data-dd-root]').forEach((r) => ddClose(r));
    await gpCloseModal('storeModal');
  }

  async function purchaseKeys() {
    const uid = userId();
    if (!uid) return toastErr(I18N.login_required());
    if (loading) return;

    const key_type = String(keyTypeEl?.value || 'Classic');
    const quantity = Number(keyQtyEl?.value || 1);

    setLoading(true);
    try {
      await httpJson(`${STORE_API}/purchase/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: String(uid), key_type, quantity }),
      });

      toastOk(I18N.keys_purchased());

      const s = nextSeq();
      abortInFlight();
      aborter = new AbortController();
      showStoreSkeletons();

      await Promise.allSettled([
        loadCoins(s, aborter.signal),
        loadPricing(s, aborter.signal),
        loadHistory(s, aborter.signal),
        loadRotation(s, aborter.signal),
      ]);

      if (typeof window.fetchKeys === 'function') window.fetchKeys(uid, key_type);
    } catch (e) {
      toastErr(e.message || I18N.purchase_failed());
    } finally {
      setLoading(false);
    }
  }

  openBtn.addEventListener('click', (e) => { e.preventDefault(); openAndLoad(); });
  closeBtn?.addEventListener('click', (e) => { e.preventDefault(); closeStore(); });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeStore();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeStore();
  });

  refreshBtn?.addEventListener('click', async () => {
    if (!isOpen) return;
    if (loading) return;

    const uid = userId();
    if (!uid) return toastErr(I18N.login_required());

    const s = nextSeq();
    abortInFlight();
    aborter = new AbortController();

    showStoreSkeletons();
    setLoading(true);
    try {
      await Promise.allSettled([
        loadCoins(s, aborter.signal),
        loadPricing(s, aborter.signal),
        loadRotation(s, aborter.signal),
        loadHistory(s, aborter.signal),
      ]);
      toastOk(I18N.store_refreshed());
    } finally {
      setLoading(false);
    }
  });

  buyKeysBtn?.addEventListener('click', (e) => { e.preventDefault(); purchaseKeys(); });

  ensureCustomDropdowns();
  updateKeyUi();
}