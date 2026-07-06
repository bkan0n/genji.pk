// Image-first reward viewer shared by the moderator Lootbox panels:
//   - "Rewards owned"   (lootbox-workspace.js)  — a single user's cosmetics
//   - "Reward catalog"  (lootbox-settings.js)   — the global pool
//
// Lootbox rewards are Overwatch cosmetics with genuinely different shapes —
// skins/poses are portrait, sprays are square, backgrounds are 16:9 — so a
// uniform grid would crop or distort three of the four. This viewer groups by
// type, sizes each tile to its type's aspect (object-contain, never cropped),
// filters instantly client-side (the full set is already loaded), and opens any
// item full-size in a top-layer <dialog> lightbox that escapes the panel's
// overflow. One lightbox is shared across all galleries; only one opens at once.

const esc = (s = '') =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Rarity palette mirrors the player-facing lootbox (utils/cards3d.js) so a
// moderator sees the same colors players do. `ring` is the inset border drawn
// around a tile; common stays neutral (border only) to avoid visual noise.
const RARITY = {
  legendary: { color: '#ffcc4d', ring: 'rgba(255,204,77,0.55)' },
  epic: { color: '#b38cff', ring: 'rgba(179,140,255,0.55)' },
  rare: { color: '#5bbcff', ring: 'rgba(91,188,255,0.55)' },
  uncommon: { color: '#6dff9d', ring: 'rgba(109,255,157,0.5)' },
  common: { color: '#a1a1aa', ring: null },
};
const RARITY_ORDER = ['legendary', 'epic', 'rare', 'uncommon', 'common'];

// Per-type tile shape + the grid's min column width. Backgrounds get wide tiles
// and fewer columns; sprays are small and pack tight. Unknown types fall back to
// a square so a reward type added later still renders sanely with no code change.
const TYPE_META = {
  skin: { label: 'Skins', aspect: '3 / 4', min: 132 },
  pose: { label: 'Poses', aspect: '3 / 4', min: 132 },
  spray: { label: 'Sprays', aspect: '1 / 1', min: 104 },
  background: { label: 'Backgrounds', aspect: '16 / 9', min: 232 },
};
const TYPE_ORDER = ['skin', 'pose', 'spray', 'background'];
const DEFAULT_TYPE = { aspect: '1 / 1', min: 120 };

const titleCase = (s) => String(s || '').replace(/\b\w/g, (c) => c.toUpperCase());

// Normalize a raw reward_type to a stable key: lowercased, and de-pluralized
// when that lands on a known type (so "Sprays" and "spray" group together).
function typeKey(raw) {
  const t = String(raw || '').trim().toLowerCase();
  if (TYPE_META[t]) return t;
  if (t.endsWith('s') && TYPE_META[t.slice(0, -1)]) return t.slice(0, -1);
  return t || 'other';
}
const typeMeta = (key) => TYPE_META[key] || DEFAULT_TYPE;
const typeLabel = (key) => TYPE_META[key]?.label || titleCase(key) || 'Other';

// Reward images arrive under different keys depending on the endpoint; accept
// every shape the rest of the app already reads (utils/cards3d.js, modals/store.js).
const imageUrl = (r) => r?.url || r?.image_url || r?.image || r?.iconUrl || r?.img || '';

// Flatten the API's loose shapes into the one record the viewer renders.
function normalize(rawItems) {
  const list = Array.isArray(rawItems)
    ? rawItems
    : Array.isArray(rawItems?.rewards)
      ? rawItems.rewards
      : [];
  return list.map((r) => {
    const tRaw = r?.reward_type || r?.type || '';
    const rarity = String(r?.rarity || 'common').toLowerCase();
    return {
      name: r?.reward_name || r?.name || '(unnamed)',
      typeRaw: tRaw,
      typeKey: typeKey(tRaw),
      rarity: RARITY[rarity] ? rarity : 'common',
      img: imageUrl(r),
    };
  });
}

const el = (tag, className, html) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
};

const matches = (it, st) =>
  (st.type === 'all' || it.typeKey === st.type) &&
  (st.rarity === 'all' || it.rarity === st.rarity) &&
  (!st.q || it.name.toLowerCase().includes(st.q));

// Order types by the curated TYPE_ORDER, then any unknown types alphabetically.
function orderedTypes(keys) {
  return [...keys].sort((a, b) => {
    const ia = TYPE_ORDER.indexOf(a);
    const ib = TYPE_ORDER.indexOf(b);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    return a.localeCompare(b);
  });
}

const PILL_BASE =
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50';
const PILL_OFF =
  'border-zinc-200/80 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06]';
const PILL_ON =
  'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-500/40';

function pill({ value, label, count, active, dot }) {
  const swatch = dot
    ? `<span class="h-2 w-2 rounded-full" style="background:${dot}"></span>`
    : '';
  const badge =
    count != null
      ? `<span class="tabular-nums ${active ? 'text-emerald-700/80 dark:text-emerald-300/80' : 'text-zinc-400 dark:text-zinc-500'}">${count}</span>`
      : '';
  return `<button type="button" data-pill="${esc(value)}" aria-pressed="${active}" class="${PILL_BASE} ${active ? PILL_ON : PILL_OFF}">${swatch}<span>${esc(label)}</span>${badge}</button>`;
}

/**
 * Render the gallery into `container`, replacing its contents.
 * @param {HTMLElement} container  mount node (its innerHTML is owned by us)
 * @param {Array|Object} rawItems  reward list (array or {rewards:[]})
 * @param {Object} [opts]
 * @param {string} [opts.emptyText]  message when there are zero items at all
 */
export function mountGallery(container, rawItems, opts = {}) {
  const items = normalize(rawItems);
  const st = { type: 'all', rarity: 'all', q: '' };

  // The whole-collection empty state (no items before any filtering).
  if (!items.length) {
    container.innerHTML = `<div class="rounded-xl border border-dashed border-zinc-300/70 dark:border-white/10 px-4 py-8 text-center">
      <p class="text-sm font-medium text-zinc-600 dark:text-zinc-300">${esc(opts.emptyText || 'Nothing here yet.')}</p>
    </div>`;
    return;
  }

  const presentTypes = orderedTypes(new Set(items.map((i) => i.typeKey)));
  const presentRarities = RARITY_ORDER.filter((r) => items.some((i) => i.rarity === r));

  container.innerHTML = '';
  const wrap = el('div', 'space-y-4');

  // --- Controls: name search + type pills + rarity pills ------------------
  const controls = el('div', 'space-y-3');
  const search = el('div');
  search.innerHTML = `<input type="search" data-gx-search autocomplete="off" placeholder="Search by name…"
    class="w-full mod-input" aria-label="Search rewards by name" />`;
  const typeRow = el('div', 'flex flex-wrap gap-1.5');
  const rarityRow = presentRarities.length > 1 ? el('div', 'flex flex-wrap gap-1.5') : null;
  controls.append(search);
  if (presentTypes.length > 1) controls.append(typeRow);
  if (rarityRow) controls.append(rarityRow);

  const grid = el('div', 'space-y-6');
  wrap.append(controls, grid);
  container.append(wrap);

  const searchInput = search.querySelector('[data-gx-search]');

  // Counts on each pill reflect the OTHER active filters, so a pill shows how
  // many results you'd get by choosing it given what's already selected.
  function countWith(extra) {
    return items.filter((it) => matches(it, { ...st, ...extra })).length;
  }

  function renderPills() {
    if (presentTypes.length > 1) {
      typeRow.innerHTML =
        pill({ value: 'type:all', label: 'All', count: countWith({ type: 'all' }), active: st.type === 'all' }) +
        presentTypes
          .map((t) =>
            pill({
              value: `type:${t}`,
              label: typeLabel(t),
              count: countWith({ type: t }),
              active: st.type === t,
            })
          )
          .join('');
    }
    if (rarityRow) {
      rarityRow.innerHTML =
        pill({ value: 'rarity:all', label: 'All rarities', count: countWith({ rarity: 'all' }), active: st.rarity === 'all' }) +
        presentRarities
          .map((r) =>
            pill({
              value: `rarity:${r}`,
              label: titleCase(r),
              count: countWith({ rarity: r }),
              active: st.rarity === r,
              dot: RARITY[r].color,
            })
          )
          .join('');
    }
  }

  function tile(it, idx) {
    const meta = typeMeta(it.typeKey);
    const ring = RARITY[it.rarity].ring;
    const ringStyle = ring ? `box-shadow:inset 0 0 0 1.5px ${ring};` : '';
    // The placeholder is hidden whenever there's a real image; the image's
    // onerror reveals it (hidden → flex) only if the asset fails to load. With no
    // image at all it renders visible from the start. Never a broken <img> icon.
    const placeholder = `<div class="gx-fallback absolute inset-0 ${it.img ? 'hidden' : 'flex'} flex-col items-center justify-center gap-1 p-2 text-center">
        <span class="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">${esc(it.typeRaw || 'item')}</span>
        <span class="line-clamp-2 text-[11px] text-zinc-500 dark:text-zinc-400">${esc(it.name)}</span>
      </div>`;
    const media = it.img
      ? `<img src="${esc(it.img)}" alt="${esc(it.name)}" loading="lazy" decoding="async"
           class="absolute inset-0 h-full w-full object-contain p-1.5"
           onerror="this.remove();this.closest('[data-tile]')?.querySelector('.gx-fallback')?.classList.replace('hidden','flex');" />`
      : '';
    return `<button type="button" data-tile data-idx="${idx}" title="${esc(it.name)}"
        class="group block w-full text-left focus:outline-none">
        <div class="relative overflow-hidden rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900/60 transition duration-150 ease-out will-change-transform group-hover:-translate-y-0.5 group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-emerald-500/60 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
             style="aspect-ratio:${meta.aspect};${ringStyle}">
          ${placeholder}${media}
        </div>
        <div class="mt-1.5 flex items-center gap-1.5">
          <span class="h-2 w-2 shrink-0 rounded-full" style="background:${RARITY[it.rarity].color}"></span>
          <span class="truncate text-xs font-medium text-zinc-700 dark:text-zinc-200">${esc(it.name)}</span>
        </div>
      </button>`;
  }

  // `filtered` is the flattened, in-render-order list the lightbox steps through;
  // each tile's data-idx points into it.
  let filtered = [];

  function renderGrid() {
    filtered = [];
    const groups = orderedTypes(new Set(items.filter((it) => matches(it, st)).map((i) => i.typeKey)));

    if (!groups.length) {
      grid.innerHTML = `<div class="rounded-xl border border-dashed border-zinc-300/70 dark:border-white/10 px-4 py-8 text-center">
        <p class="text-sm font-medium text-zinc-600 dark:text-zinc-300">No rewards match these filters.</p>
        <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Clear the search or filters to see everything.</p>
      </div>`;
      return;
    }

    grid.innerHTML = groups
      .map((key) => {
        const meta = typeMeta(key);
        const inGroup = items
          .filter((it) => it.typeKey === key && matches(it, st))
          .sort((a, b) => a.name.localeCompare(b.name));
        const startIdx = filtered.length;
        filtered.push(...inGroup);
        const tiles = inGroup.map((it, i) => tile(it, startIdx + i)).join('');
        return `<section>
          <h4 class="mb-2.5 flex items-baseline gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            ${esc(typeLabel(key))}<span class="tabular-nums font-normal text-zinc-400 dark:text-zinc-500">${inGroup.length}</span>
          </h4>
          <div class="grid gap-3" style="grid-template-columns:repeat(auto-fill,minmax(${meta.min}px,1fr))">${tiles}</div>
        </section>`;
      })
      .join('');
  }

  // --- Wiring -------------------------------------------------------------
  controls.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-pill]');
    if (!btn) return;
    const [dim, val] = btn.dataset.pill.split(':');
    if (dim === 'type') st.type = val;
    else if (dim === 'rarity') st.rarity = val;
    renderPills();
    renderGrid();
  });

  let searchTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      st.q = searchInput.value.trim().toLowerCase();
      renderPills();
      renderGrid();
    }, 110);
  });

  grid.addEventListener('click', (e) => {
    const t = e.target.closest('[data-tile]');
    if (!t) return;
    const idx = Number(t.dataset.idx);
    if (Number.isInteger(idx) && filtered[idx]) openLightbox(filtered, idx);
  });

  renderPills();
  renderGrid();
}

// --- Lightbox (singleton, top layer) --------------------------------------

let lb = null; // { dialog, img, fallback, name, type, rarity, counter, list, idx }

function ensureLightbox() {
  if (lb) return lb;

  // One-time styles: the native top layer already escapes the panel overflow;
  // this only adds the backdrop + a soft enter transition (disabled for users
  // who ask for reduced motion).
  const style = document.createElement('style');
  style.textContent = `
    dialog[data-lb-lightbox]{position:fixed;inset:0;margin:auto;width:min(92vw,1100px);max-width:92vw;height:fit-content;max-height:92vh;border:none;background:transparent;padding:0;color:inherit;overflow:visible}
    dialog[data-lb-lightbox]::backdrop{background:rgba(9,9,11,.78);backdrop-filter:blur(4px)}
    dialog[data-lb-lightbox][open]{animation:lbIn .16s cubic-bezier(.22,1,.36,1)}
    @keyframes lbIn{from{opacity:0;transform:translateY(6px) scale(.985)}to{opacity:1;transform:none}}
    @media (prefers-reduced-motion: reduce){dialog[data-lb-lightbox][open]{animation:none}}
  `;
  document.head.append(style);

  const dialog = document.createElement('dialog');
  dialog.setAttribute('data-lb-lightbox', '');
  dialog.setAttribute('aria-label', 'Reward preview');
  dialog.innerHTML = `
    <div class="relative mx-auto flex max-h-[92vh] w-full flex-col">
      <button type="button" data-lb-close aria-label="Close preview"
        class="absolute -top-3 -right-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-zinc-900/90 text-zinc-200 shadow-lg transition hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60">✕</button>
      <button type="button" data-lb-prev aria-label="Previous reward"
        class="absolute left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-zinc-900/80 text-2xl text-zinc-200 transition hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60">‹</button>
      <button type="button" data-lb-next aria-label="Next reward"
        class="absolute right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-zinc-900/80 text-2xl text-zinc-200 transition hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60">›</button>
      <div class="flex min-h-0 flex-1 items-center justify-center rounded-2xl border border-white/10 bg-zinc-950/60 p-3 sm:p-5">
        <img data-lb-img alt="" class="max-h-[70vh] w-auto max-w-full rounded-lg object-contain" />
        <div data-lb-fallback class="hidden flex-col items-center gap-2 py-16 text-center">
          <span class="text-xs font-semibold uppercase tracking-wide text-zinc-500" data-lb-fallback-type></span>
          <span class="text-sm text-zinc-400">No image available</span>
        </div>
      </div>
      <div class="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-1">
        <div class="min-w-0">
          <div data-lb-name class="truncate text-base font-semibold text-white"></div>
          <div data-lb-type class="text-xs text-zinc-400"></div>
        </div>
        <div class="flex items-center gap-3">
          <span data-lb-rarity class="rounded-full px-2.5 py-1 text-xs font-semibold"></span>
          <span data-lb-counter class="tabular-nums text-xs text-zinc-500"></span>
        </div>
      </div>
    </div>`;
  document.body.append(dialog);

  lb = {
    dialog,
    img: dialog.querySelector('[data-lb-img]'),
    fallback: dialog.querySelector('[data-lb-fallback]'),
    fallbackType: dialog.querySelector('[data-lb-fallback-type]'),
    name: dialog.querySelector('[data-lb-name]'),
    type: dialog.querySelector('[data-lb-type]'),
    rarity: dialog.querySelector('[data-lb-rarity]'),
    counter: dialog.querySelector('[data-lb-counter]'),
    prevBtn: dialog.querySelector('[data-lb-prev]'),
    nextBtn: dialog.querySelector('[data-lb-next]'),
    list: [],
    idx: 0,
  };

  const step = (d) => {
    if (lb.list.length < 2) return;
    lb.idx = (lb.idx + d + lb.list.length) % lb.list.length;
    paintLightbox();
  };
  lb.prevBtn.onclick = () => step(-1);
  lb.nextBtn.onclick = () => step(1);
  dialog.querySelector('[data-lb-close]').onclick = () => dialog.close();
  // Click on the backdrop area (the dialog element itself, outside the content) closes.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    }
  });
  // The image may fail after open; degrade to the fallback in place.
  lb.img.addEventListener('error', () => {
    lb.img.classList.add('hidden');
    lb.fallback.classList.remove('hidden');
    lb.fallback.classList.add('flex');
  });

  return lb;
}

function paintLightbox() {
  const it = lb.list[lb.idx];
  if (!it) return;
  lb.fallback.classList.add('hidden');
  lb.fallback.classList.remove('flex');
  if (it.img) {
    lb.img.classList.remove('hidden');
    lb.img.src = it.img;
    lb.img.alt = it.name;
  } else {
    lb.img.classList.add('hidden');
    lb.img.removeAttribute('src');
    lb.fallback.classList.remove('hidden');
    lb.fallback.classList.add('flex');
  }
  lb.fallbackType.textContent = it.typeRaw || 'item';
  lb.name.textContent = it.name;
  lb.type.textContent = it.typeRaw ? titleCase(it.typeRaw) : '';
  const rar = RARITY[it.rarity] || RARITY.common;
  lb.rarity.textContent = titleCase(it.rarity);
  lb.rarity.style.color = rar.color;
  lb.rarity.style.background = (rar.ring || 'rgba(161,161,170,.25)').replace(/0?\.\d+\)$/, '0.15)');
  lb.counter.textContent = lb.list.length > 1 ? `${lb.idx + 1} / ${lb.list.length}` : '';
  const solo = lb.list.length < 2;
  lb.prevBtn.classList.toggle('hidden', solo);
  lb.nextBtn.classList.toggle('hidden', solo);
}

function openLightbox(list, idx) {
  ensureLightbox();
  lb.list = list;
  lb.idx = idx;
  paintLightbox();
  if (!lb.dialog.open) lb.dialog.showModal();
}
