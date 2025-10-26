/* =========================
   CONFIG & UTILS
   ========================= */
let currentPage = 1;
let totalPages = 1;
const pageSize = 25;
let __currentDropdown = null;

const skillRankOrder = ['God', 'Grandmaster', 'Master', 'Pro', 'Skilled', 'Jumper', 'Ninja'];

let activeFilters = {
  name: '',
  sort_column: 'xp_amount',
  sort_direction: 'desc',
  skill_rank: '',
  page_number: 1,
  page_size: pageSize,
};

window.showLoadingBar = window.showLoadingBar || function () {};
window.hideLoadingBar = window.hideLoadingBar || function () {};

/* =========================
   HELPERS INLINE
   ========================= */
const CSP_NONCE = document.querySelector('meta[name="csp-nonce"]')?.content || '';
const __dynStyleEl = (() => {
  const el = document.createElement('style');
  if (CSP_NONCE) el.setAttribute('nonce', CSP_NONCE);
  document.head.appendChild(el);
  return el;
})();

const __sheet = __dynStyleEl.sheet;
function __addRule(sel, body) {
  try {
    __sheet.insertRule(`${sel}{${body}}`, __sheet.cssRules.length);
  } catch {}
}
function __clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
function __ms(n) {
  return Math.round(Number(n) || 0);
}

const __madeAnim = new Set();
function __clsAnimDelay(ms) {
  const v = __ms(ms),
    name = `anim-delay-${v}`;
  if (!__madeAnim.has(v)) {
    __addRule(`.${name}`, `animation-delay:${v}ms !important`);
    __madeAnim.add(v);
  }
  return name;
}

const __madeTrans = new Set();
function __clsTransDelay(ms) {
  const v = __ms(ms),
    name = `trans-delay-${v}`;
  if (!__madeTrans.has(v)) {
    __addRule(`.${name}`, `transition-delay:${v}ms !important`);
    __madeTrans.add(v);
  }
  return name;
}

const __madeSf = new Set();
function __clsSfDelay(ms) {
  const v = __ms(ms),
    name = `sf-delay-${v}`;
  if (!__madeSf.has(v)) {
    __addRule(`.${name}`, `--d:${v}ms`);
    __madeSf.add(v);
  }
  return name;
}

let __pillBase = false;
const __pillRules = new Set();

function __ensurePillBase() {
  if (__pillBase) return;
  __addRule(
    `.pill`,
    `display:inline-flex;align-items:center;border-radius:9999px;
     padding:0.125rem 0.625rem;font-weight:600;font-size:.75rem;line-height:1rem;
     border:1px solid var(--pill-border);background:var(--pill-bg)`
  );
  __pillBase = true;
}

function __ensurePillVariant(key, bg, border) {
  __ensurePillBase();
  const k = `${key}|${bg}|${border}`;
  if (__pillRules.has(k)) return;
  __addRule(
    `.pill[data-k="${key}"]`,
    `--pill-bg:${bg};--pill-border:${border}`
  );
  __pillRules.add(k);
}

function __slug(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/* =========================
   DOM HELPERS
   ========================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const searchInput = $('#search-input') || $('#playerSearch') || $('#filterPlayer');
const sortTrigger = $('#sort-trigger') || $('#sortBtn') || $('#sortButton');
const rankTrigger = $('#rank-trigger') || $('#rankBtn') || $('#rankButton');
const sortMenu = $('#sortMenu');
const rankMenu = $('#rankMenu');

const table = $('#leaderboard');
const tbody = table ? table.querySelector('tbody') : null;
const paginationContainer = $('.pagination-container');

/* =========================
   TABLE HELPERS
   ========================= */
function ensureLeaderboard() {
  if (!table) return;

  table.classList.add('lb');
  if (!table.querySelector('.lb-inner')) {
    table.innerHTML = `
      <div class="lb-inner">
        <div class="lb-head lb-grid bg-zinc-900/60 text-zinc-300 rounded-lg mb-1 px-2 py-2">
          <div class="col-idx px-2 font-semibold">#</div>
          <div class="col-nickname px-2 font-semibold">Nickname</div>
          <div class="col-xp px-2 font-semibold">XP</div>
          <div class="col-tier px-2 font-semibold">Tier</div>
          <div class="col-skill-rank px-2 font-semibold">Skill rank</div>
          <div class="col-wr px-2 font-semibold">World records</div>
          <div class="col-maps px-2 font-semibold">Maps made</div>
          <div class="col-playtest px-2 font-semibold">Playtest votes</div>
          <div class="col-discord px-2 font-semibold">Discord tag</div>
        </div>
        <div class="lb-rows"></div>
      </div>
    `;
  }
}


export async function fetchLeaderboard(params = {}) {
  const url = new URL('/api/community/leaderboard', window.location.origin);

  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, v);
    }
  }

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      throw new Error(`${res.status} ${res.statusText}${msg ? ` — ${msg}` : ''}`);
    }
    return await res.json();
  } catch (e) {
    console.error('Fetch leaderboard error:', e);
    return [];
  }
}

function normalizeSkillRank(rank) {
  if (!rank) return '';
  const r = String(rank).trim();
  return r;
}
function getSkillRankClass(rank) {
  const r = normalizeSkillRank(rank).toLowerCase();
  switch (r) {
    case 'ninja':
      return 'rank-ninja';
    case 'jumper':
      return 'rank-jumper';
    case 'skilled':
      return 'rank-skilled';
    case 'pro':
      return 'rank-pro';
    case 'master':
      return 'rank-master';
    case 'grandmaster':
      return 'rank-grandmaster';
    case 'god':
      return 'rank-god';
    default:
      return '';
  }
}
const fmt = (n) => (Number(n) || 0).toLocaleString();

function sortBySkillRankClient(data, direction = 'asc') {
  const order = skillRankOrder.map(normalizeSkillRank);
  return [...data].sort((a, b) => {
    const A = order.indexOf(normalizeSkillRank(a.skill_rank));
    const B = order.indexOf(normalizeSkillRank(b.skill_rank));
    const aRank = A === -1 ? order.length : A;
    const bRank = B === -1 ? order.length : B;
    return direction === 'asc' ? aRank - bRank : bRank - aRank;
  });
}

async function updateLeaderboard(extra = {}) {
  showLoadingBar();

  activeFilters = {
    ...activeFilters,
    ...extra,
    page_number: extra.page_number || currentPage,
    page_size: pageSize,
  };

  const cached = readPageCache(activeFilters);
  if (!cached) {
    ensureLeaderboard();
    renderSkeletonRows(pageSize);
    table?.setAttribute('aria-busy', 'true');
  }

  const { rows: rawRows, total } = await getPageData(activeFilters, { allowCache: true });

  let rows = rawRows || [];
  if (activeFilters.sort_column === 'skill_rank') {
    rows = sortBySkillRankClient(rows, activeFilters.sort_direction);
  }

  ensureLeaderboard();
  renderRows(rows, activeFilters.page_number, activeFilters.page_size);

  const rowsEl = table?.querySelector('.lb-rows');
  if (rowsEl) applySplitFlap(rowsEl);
  cascadeRows();
  renderPagination(total, activeFilters.page_number, activeFilters.page_size);

  table?.removeAttribute('aria-busy');
  hideLoadingBar();

  prefetchNextPageIfAny(
    { total, pageNumber: activeFilters.page_number, pageSize: activeFilters.page_size },
    activeFilters
  );
}

function debounce(fn, ms = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

const handleSearch = debounce(() => {
  if (!searchInput) return;
  activeFilters.name = searchInput.value.trim();
  currentPage = 1;
  updateLeaderboard({ page_number: 1 });
}, 250);

const SKILL_COLORS = {
  god: '#991b1b',
  grandmaster: '#ef4444',
  master: '#f97316',
  pro: '#fb923c',
  skilled: '#facc15',
  jumper: '#22c55e',
  ninja: '#166534',
};

function skillRankColor(rank) {
  const k = normalizeSkillRank(rank).toLowerCase();
  return SKILL_COLORS[k] || '#525252';
}

const TIER_COLORS = {
  bronze: '#b45309',
  silver: '#9ca3af',
  gold: '#f59e0b',
  platinum: '#22d3ee',
  diamond: '#38bdf8',
  master: '#a78bfa',
  grandmaster: '#ef4444',
  god: '#e11d48',
  legend: '#f472b6',
  mythic: '#fde047',
};
function tierColor(name) {
  if (!name) return '#525252';
  const n = String(name).trim().toLowerCase();
  for (const key in TIER_COLORS) if (n.includes(key)) return TIER_COLORS[key];
  const PALETTE = [
    '#94a3b8',
    '#a78bfa',
    '#38bdf8',
    '#22c55e',
    '#f59e0b',
    '#f97316',
    '#e11d48',
    '#14b8a6',
  ];
  let h = 0;
  for (let i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return { r: 82, g: 82, b: 82 };
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h, s, l };
}
function hslToHex(h, s, l) {
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s,
      p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (v) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
function saturateHex(hex, factor = 0.2) {
  const { r, g, b } = hexToRgb(hex);
  let { h, s, l } = rgbToHsl(r, g, b);
  s = Math.min(1, s * (1 + factor));
  return hslToHex(h, s, l);
}
function rgbaFromHex(hex, a) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
function darkenHex(hex, factor = 0.1) {
  const { r, g, b } = hexToRgb(hex);
  const f = Math.max(0, Math.min(1, factor));
  const dr = Math.round(r * (1 - f));
  const dg = Math.round(g * (1 - f));
  const db = Math.round(b * (1 - f));
  return `#${[dr, dg, db].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
function relLuma(hex) {
  const { r, g, b } = hexToRgb(hex);
  const L = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * L[0] + 0.7152 * L[1] + 0.0722 * L[2];
}

const PILL_SATURATE = 0.22;
const PILL_BG_ALPHA = 0.22;
const PILL_BORDER_ALPHA = 0.45;
const PILL_TEXT_TW = 'text-zinc-300';

function pill(label, baseHex) {
  const vivid = saturateHex(baseHex, PILL_SATURATE);
  const bg = rgbaFromHex(vivid, PILL_BG_ALPHA);
  const border = rgbaFromHex(vivid, PILL_BORDER_ALPHA);

  const key = __slug(label || 'na');
  __ensurePillVariant(key, bg, border);

  return `<span class="pill ${PILL_TEXT_TW}" data-k="${key}">${esc(label)}</span>`;
}

function mkSkillPill(rank) {
  const label = normalizeSkillRank(rank) || 'N/A';
  return pill(label, skillRankColor(label));
}

function mkTierPill(name) {
  const label = name || 'N/A';
  return pill(label, tierColor(label));
}

/* =========================
   DISCORD HELPERS
   ========================= */

function extractDiscordId(player) {
  if (!player || player.user_id == null) return '';
  const id = String(player.user_id).replace(/\D+/g, '');
  return id.length >= 17 && id.length <= 21 ? id : '';
}

function defaultDiscordAvatarFromId(discordId) {
  let idx = 0;
  try {
    if (typeof BigInt !== 'undefined' && discordId) {
      idx = Number((BigInt(String(discordId)) >> 22n) % 5n);
    }
  } catch {
    idx = 0;
  }
  return `https://cdn.discordapp.com/embed/avatars/${idx}.png?size=64`;
}

function ensureSize64(url) {
  if (!url) return url;
  if (!/cdn\.discordapp\.com/.test(url)) return url;
  if (/\.gif($|\?)/i.test(url)) return url;
  return url.includes('?') ? `${url}&size=64` : `${url}?size=64`;
}

const AVATAR_LS_KEY = 'discord_avatar_cache_v5';
try {
  localStorage.removeItem('discord_avatar_cache_v4');
} catch {}
const AVATAR_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const avatarCache = new Map();

(function loadAvatarCache() {
  try {
    const raw = localStorage.getItem(AVATAR_LS_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    const now = Date.now();
    Object.entries(obj).forEach(([id, entry]) => {
      if (entry && entry.url && entry.ts && now - entry.ts < AVATAR_TTL_MS) {
        avatarCache.set(id, entry.url);
      }
    });
  } catch {}
})();
function persistAvatarCache() {
  const now = Date.now();
  const obj = {};
  avatarCache.forEach((url, id) => {
    obj[id] = { url, ts: now };
  });
  try {
    localStorage.setItem(AVATAR_LS_KEY, JSON.stringify(obj));
  } catch {}
}

async function fetchAvatarUrlForId(id) {
  try {
    const url = new URL('/api/settings/user-avatar', window.location.origin);
    url.searchParams.set('user_id', id);

    const res = await fetch(url, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data && data.avatar_url) {
      return ensureSize64(data.avatar_url);
    }
    return null;
  } catch {
    return null;
  }
}

async function resolveDiscordAvatars(ids) {
  const out = new Map();
  const needFetch = [];

  ids.forEach((id) => {
    if (!id) return;
    if (avatarCache.has(id)) {
      out.set(id, avatarCache.get(id));
    } else {
      needFetch.push(id);
    }
  });

  const CONCURRENCY = 6;
  let i = 0;
  async function worker() {
    while (i < needFetch.length) {
      const id = needFetch[i++];
      const url = await fetchAvatarUrlForId(id);
      const finalUrl = url || defaultDiscordAvatarFromId(id);
      avatarCache.set(id, finalUrl);
      out.set(id, finalUrl);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, needFetch.length) }, worker));
  persistAvatarCache();
  return out;
}

/* =========================
   TABLE RENDER
   ========================= */
function renderRows(data, pageNumber, pageSize) {
  ensureLeaderboard();
  const rowsEl = table?.querySelector('.lb-rows');
  if (!rowsEl) return;
  rowsEl.innerHTML = '';

  const startIndex = (pageNumber - 1) * pageSize;
  const avatarObserver = ensureAvatarObserver();

  data.forEach((player, idx) => {
    const rowNum = startIndex + idx + 1;

    const discordId = extractDiscordId(player);
    const fallback  = defaultDiscordAvatarFromId(discordId);

    const discordTag = (player.discord_tag === 'Unknown Username' || !player.discord_tag)
      ? 'N/A'
      : player.discord_tag;

    const skillRank = normalizeSkillRank(player.skill_rank);

    const row = document.createElement('div');
    row.className = `lb-row lb-grid gp-reveal-show ${__clsAnimDelay(__clamp(idx * 30, 0, 250))} tr-sf-enter`;

    row.innerHTML = `
      <div class="col-idx px-2 py-2 text-zinc-400" data-sf="${escAttr(rowNum)}">${esc(rowNum)}</div>

      <div class="col-nickname px-2 py-2">
        <a href="rank_card?user_id=${encodeURIComponent(player.user_id)}"
          class="inline-flex items-center gap-2 rounded-md hover:bg-white/5 px-1.5 py-0.5 transition max-w-full">
          <span class="avatar-shell ring-1 ring-white/10">
            <img
              src="${BLANK_IMG}"
              alt=""
              class="avatar-img avatar-lazy h-8 w-8 rounded-full object-cover shrink-0"
              loading="lazy" decoding="async" referrerpolicy="no-referrer"
              data-discord-avatar
              data-discord-id="${escAttr(discordId)}"
              data-fallback="${escAttr(fallback)}"
            />
          </span>
          <span class="font-medium truncate block max-w-[28ch]"
                data-sf="${escAttr(player.nickname || 'N/A')}">${esc(player.nickname || 'N/A')}</span>
        </a>
      </div>

      <div class="col-xp px-2 py-2 font-semibold" data-sf="${escAttr((Number(player.xp_amount)||0).toLocaleString())}">
        ${(Number(player.xp_amount)||0).toLocaleString()}
      </div>

      <div class="col-tier px-2 py-2">
        ${mkTierPill(player.tier_name)}
      </div>

      <div class="col-skill-rank px-2 py-2">
        ${mkSkillPill(skillRank)}
      </div>

      <div class="col-wr px-2 py-2" data-sf="${escAttr((Number(player.wr_count)||0).toLocaleString())}">
        ${(Number(player.wr_count)||0).toLocaleString()}
      </div>

      <div class="col-maps px-2 py-2" data-sf="${escAttr((Number(player.map_count)||0).toLocaleString())}">
        ${(Number(player.map_count)||0).toLocaleString()}
      </div>

      <div class="col-playtest px-2 py-2" data-sf="${escAttr((Number(player.playtest_count)||0).toLocaleString())}">
        ${(Number(player.playtest_count)||0).toLocaleString()}
      </div>

      <div class="col-discord px-2 py-2 text-zinc-300">
        <span class="truncate block max-w-[28ch]" data-sf="${escAttr(discordTag)}">${esc(discordTag)}</span>
      </div>
    `;

    rowsEl.appendChild(row);

    const img = row.querySelector('img[data-discord-avatar]');
    if (img) avatarObserver.observe(img);
  });
}

/* =========================
   PAGINATION
   ========================= */

function renderPagination(totalResults, currentPage, perPage) {
  if (!paginationContainer) return;
  paginationContainer.innerHTML = '';

  totalPages = Math.ceil((+totalResults || 0) / (+perPage || pageSize));
  if (totalPages <= 1) return;

  const mkBtn = (label, disabled, onClick) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.disabled = !!disabled;
    b.className =
      'px-3 py-1.5 text-sm rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-50 cursor-pointer';
    b.addEventListener('click', onClick);
    return b;
  };

  paginationContainer.appendChild(mkBtn('« First', currentPage === 1, () => changePage(1)));
  paginationContainer.appendChild(
    mkBtn('‹ Prev', currentPage === 1, () => changePage(currentPage - 1))
  );

  const span = document.createElement('span');
  span.className = 'px-3 text-sm text-zinc-300';
  span.textContent = `Page ${currentPage} / ${totalPages}`;
  paginationContainer.appendChild(span);

  paginationContainer.appendChild(
    mkBtn('Next ›', currentPage === totalPages, () => changePage(currentPage + 1))
  );
  paginationContainer.appendChild(
    mkBtn('Last »', currentPage === totalPages, () => changePage(totalPages))
  );
}

function changePage(n) {
  currentPage = Math.max(1, Math.min(n, totalPages || 1));
  updateLeaderboard({ page_number: currentPage });
}

async function getPageData(params, { allowCache = true } = {}) {
  const keyParams = { ...params };
  if (allowCache) {
    const cached = readPageCache(keyParams);
    if (cached) return cached;
  }

  const raw = await fetchLeaderboard(keyParams);
  const total = (Array.isArray(raw) && raw[0] && raw[0].total_results) ? +raw[0].total_results : 0;
  const rows = raw || [];

  writePageCache(keyParams, rows, total);
  return { rows, total };
}

async function prefetchNextPageIfAny({ total, pageNumber, pageSize }, baseFilters) {
  const totalPagesLocal = Math.ceil((+total || 0) / (+pageSize || 1));
  const next = pageNumber + 1;
  if (next > totalPagesLocal) return;

  const nextFilters = { ...baseFilters, page_number: next, page_size: pageSize };
  const cached = readPageCache(nextFilters);
  if (cached) {
    const ids = [...new Set((cached.rows || []).map(extractDiscordId).filter(Boolean))];
    if (ids.length) await resolveDiscordAvatars(ids);
    return;
  }

  const { rows } = await getPageData(nextFilters, { allowCache: false });
  const ids = [...new Set(rows.map(extractDiscordId).filter(Boolean))];
  if (ids.length) await resolveDiscordAvatars(ids);
}

/* =========================
   TABLE FILTERS
   ========================= */
const sortMap = { xp: 'xp_amount', wr: 'wr_count', maps: 'map_count', votes: 'playtest_count' };

function bindDropdown(triggerEl, menuEl, onPick) {
  if (!triggerEl || !menuEl) return;

  const open = () => {
    if (__currentDropdown && __currentDropdown.menu !== menuEl) {
      __currentDropdown.trigger.setAttribute('aria-expanded', 'false');
      __currentDropdown.menu.classList.add('invisible', 'opacity-0', 'translate-y-1');
    }

    triggerEl.setAttribute('aria-expanded', 'true');
    menuEl.classList.remove('invisible', 'opacity-0', 'translate-y-1');

    __currentDropdown = { trigger: triggerEl, menu: menuEl };
  };

  const close = () => {
    triggerEl.setAttribute('aria-expanded', 'false');
    menuEl.classList.add('invisible', 'opacity-0', 'translate-y-1');

    if (__currentDropdown && __currentDropdown.menu === menuEl) {
      __currentDropdown = null;
    }
  };

  triggerEl.addEventListener('click', (e) => {
    e.stopPropagation();
    const expanded = triggerEl.getAttribute('aria-expanded') === 'true';
    if (expanded) close();
    else open();
  });

  document.addEventListener('click', (e) => {
    if (!menuEl.contains(e.target) && !triggerEl.contains(e.target)) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  menuEl.querySelectorAll('[data-value]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = btn.getAttribute('data-value') || '';
      onPick(value, btn.textContent.trim());
      close();
      menuEl.querySelectorAll('.check').forEach((c) => c.classList.add('hidden'));
      const check = btn.querySelector('.check');
      if (check) check.classList.remove('hidden');
    });
  });
}

function resetFilters() {
  activeFilters = {
    name: '',
    sort_column: 'xp_amount',
    sort_direction: 'desc',
    skill_rank: '',
    page_number: 1,
    page_size: pageSize,
  };
  currentPage = 1;

  if (searchInput) searchInput.value = '';
  if (sortTrigger)
    sortTrigger.querySelector('.label')?.replaceChildren(document.createTextNode('XP'));
  if (rankTrigger)
    rankTrigger.querySelector('.label')?.replaceChildren(document.createTextNode('All ranks'));

  if (sortMenu) {
    sortMenu.querySelectorAll('.check').forEach((c) => c.classList.add('hidden'));
    sortMenu.querySelector('button[data-value="xp"] .check')?.classList.remove('hidden');
  }
  if (rankMenu) {
    rankMenu.querySelectorAll('.check').forEach((c) => c.classList.add('hidden'));
    rankMenu.querySelector('button[data-value=""] .check')?.classList.remove('hidden');
  }

  updateLeaderboard({ page_number: 1 });
}

/* =========================
   INTERACTIVITY
   ========================= */
function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderSplitFlap(text) {
  const str = String(text ?? '');
  const n = Math.max(1, str.length);
  const maxDelay = 320;
  const wrapStart = `<span class="sf">`;
  const html = [...str]
    .map((ch, i) => {
      const d = Math.round((i / (n - 1 || 1)) * maxDelay);
      const dClass = __clsSfDelay(d);
      return `<span class="sf-char ${dClass}" data-delay><span class="sf-card">${esc(ch)}</span></span>`;
    })
    .join('');
  return wrapStart + html + `</span>`;
}

function applySplitFlap(root = document) {
  root.querySelectorAll('[data-sf]').forEach((el) => {
    const value = el.getAttribute('data-sf') || el.textContent.trim();
    el.innerHTML = renderSplitFlap(value);
  });
}

function cascadeRows() {
  document.querySelectorAll('.lb-rows .lb-row').forEach((row, i) => {
    row.classList.add(__clsAnimDelay(__clamp(i * 30, 0, 250)), 'tr-sf-enter');
    row.addEventListener('animationend', () => row.classList.remove('tr-sf-enter'), { once: true });
  });
}

function escAttr(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function smoothRevealTableRows(rootEl) {
  const rows = rootEl.querySelectorAll('.lb-rows .lb-row');
  if (!rows.length) return;

  rows.forEach((el) => el.classList.add('gp-reveal'));

  requestAnimationFrame(() => {
    rows.forEach((el, i) => {
      const delay = __clamp(i * 18, 0, 280);
      el.classList.add(__clsTransDelay(delay), 'gp-reveal-show');
      el.classList.remove('gp-reveal');
    });
  });
}

function setResultsHTML(html) {
  const container = document.getElementById('resultsContainer');
  container.innerHTML = html;
  smoothRevealTableRows(container);
}

function smoothRevealFilters(root = document) {
  const grid = root.getElementById
    ? root.getElementById('filtersGrid')
    : document.getElementById('filtersGrid');
  if (!grid) return;

  const items = Array.from(grid.children);
  if (!items.length) return;

  items.forEach((el) => el.classList.add('f-reveal'));

  requestAnimationFrame(() => {
    items.forEach((el, i) => {
      const d = __clamp(i * 50, 0, 350);
      el.classList.add(__clsTransDelay(d), 'f-reveal-show');
      el.classList.remove('f-reveal');
    });
  });
}

/* =========================
   SKELETON + PAGE CACHE
   ========================= */
const PAGE_CACHE_TTL = 60 * 1000;
const pageCache = new Map();

function cacheKey(params) {
  const {
    name = '', sort_column = 'xp_amount', sort_direction = 'desc',
    skill_rank = '', page_number = 1, page_size = pageSize
  } = params || {};
  return JSON.stringify({ name, sort_column, sort_direction, skill_rank, page_number, page_size });
}

function readPageCache(params) {
  const k = cacheKey(params);
  const v = pageCache.get(k);
  if (v && Date.now() - v.ts < PAGE_CACHE_TTL) return v;
  return null;
}
function writePageCache(params, rows, total) {
  const k = cacheKey(params);
  pageCache.set(k, { rows, total, ts: Date.now() });
}

function __addKeyframes(name, body) {
  try { __sheet.insertRule(`@keyframes ${name}{${body}}`, __sheet.cssRules.length); } catch {}
}
(function ensureSkeletonCSS() {
  __addKeyframes('skelShimmer', '0%{background-position:-200% 0}100%{background-position:200% 0}');
  __addRule('.skel', [
    'display:inline-block',
    'border-radius:0.5rem',
    'height:0.875rem',
    'background:linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12), rgba(255,255,255,0.06))',
    'background-size:200% 100%',
    'animation:skelShimmer 1.1s linear infinite',
  ].join(';'));
  __addRule('.skel-circle','border-radius:9999px;height:2rem;width:2rem');
  __addRule('.skel-sm','height:0.75rem');
  __addRule('.skel-md','height:0.9rem');
  __addRule('.skel-lg','height:1rem');
  __addRule('.skel-w-8','width:1.2rem');
  __addRule('.skel-w-12','width:3rem');
  __addRule('.skel-w-20','width:5rem');
  __addRule('.skel-w-28','width:7rem');
  __addRule('.skel-w-36','width:9rem');
})();

/* =========================
   RENDER SKELETON
   ========================= */
function renderSkeletonRows(count = pageSize) {
  ensureLeaderboard();
  const rowsEl = table?.querySelector('.lb-rows');
  if (!rowsEl) return;
  rowsEl.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const row = document.createElement('div');
    row.className = `lb-row lb-grid ${__clsAnimDelay(__clamp(i * 30, 0, 250))} tr-sf-enter`;

    row.innerHTML = `
      <!-- # -->
      <div class="col-idx px-2 py-2 tabular-nums">
        <span class="skel skel-sm skel-ch-2"></span>
      </div>

      <!-- Nickname + avatar : même markup/tailles que le vrai -->
      <div class="col-nickname px-2 py-2">
        <div class="inline-flex items-center gap-2 rounded-md px-1.5 py-0.5 max-w-full">
          <span class="avatar-shell ring-1 ring-white/10">
            <img
              src="${BLANK_IMG}"
              alt=""
              class="avatar-img avatar-lazy h-8 w-8 rounded-full object-cover shrink-0"
              loading="lazy" decoding="async" referrerpolicy="no-referrer"
            />
          </span>
          <span class="skel skel-md skel-ch-16"></span>
        </div>
      </div>

      <!-- XP (tabular nums pour largeur stable) -->
      <div class="col-xp px-2 py-2 font-semibold tabular-nums">
        <span class="skel skel-sm skel-ch-7"></span>
      </div>

      <!-- Tier pill : skeleton à la même hauteur/padding qu’une .pill -->
      <div class="col-tier px-2 py-2">
        <span class="skel skel-pill skel-pill-w-20"></span>
      </div>

      <!-- Skill rank pill -->
      <div class="col-skill-rank px-2 py-2">
        <span class="skel skel-pill skel-pill-w-16"></span>
      </div>

      <!-- WR / Maps / Playtest (tabular) -->
      <div class="col-wr px-2 py-2 tabular-nums">
        <span class="skel skel-sm skel-ch-3"></span>
      </div>
      <div class="col-maps px-2 py-2 tabular-nums">
        <span class="skel skel-sm skel-ch-3"></span>
      </div>
      <div class="col-playtest px-2 py-2 tabular-nums">
        <span class="skel skel-sm skel-ch-3"></span>
      </div>

      <!-- Discord tag -->
      <div class="col-discord px-2 py-2">
        <span class="skel skel-sm skel-ch-18"></span>
      </div>
    `;

    rowsEl.appendChild(row);
  }
}

/* =========================
   DISCORD AVATAR LAZY LOADER
   ========================= */
const BLANK_IMG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';

let __avatarIO = null;
function ensureAvatarObserver() {
  if (__avatarIO) return __avatarIO;
  if (!('IntersectionObserver' in window)) {
    __avatarIO = {
      observe(img) {
        const id = img.getAttribute('data-discord-id') || '';
        const fb = img.getAttribute('data-fallback') || defaultDiscordAvatarFromId(id);
        const cached = id && avatarCache.get(id);
        if (cached) return setAvatarSrc(img, cached, fb);
        if (!id) return setAvatarSrc(img, fb, fb);
        fetchAvatarUrlForId(id)
          .then((u) => {
            const finalUrl = u || fb;
            if (id) avatarCache.set(id, finalUrl);
            persistAvatarCache();
            setAvatarSrc(img, finalUrl, fb);
          })
          .catch(() => setAvatarSrc(img, fb, fb));
      },
      unobserve() {},
      disconnect() {},
    };
    return __avatarIO;
  }
  __avatarIO = new IntersectionObserver(onAvatarIntersect, {
    root: document.querySelector('#leaderboard') || null,
    rootMargin: '200px 0px',
    threshold: 0.01,
  });
  return __avatarIO;
}

function onAvatarIntersect(entries, obs) {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const img = entry.target;
    obs.unobserve(img);
    const id = img.getAttribute('data-discord-id') || '';
    const fb = img.getAttribute('data-fallback') || defaultDiscordAvatarFromId(id);

    const cached = id && avatarCache.get(id);
    if (cached) {
      setAvatarSrc(img, cached, fb);
    } else if (!id) {
      setAvatarSrc(img, fb, fb);
    } else {
      fetchAvatarUrlForId(id)
        .then((u) => {
          const finalUrl = u || fb;
          avatarCache.set(id, finalUrl);
          persistAvatarCache();
          setAvatarSrc(img, finalUrl, fb);
        })
        .catch(() => setAvatarSrc(img, fb, fb));
    }
  }
}

function setAvatarSrc(img, url, fallback) {
  const finish = () => {
    img.classList.remove('avatar-lazy');
    img.classList.add('avatar-loaded');
    if (img.parentElement && img.parentElement.classList) {
      img.parentElement.classList.add('loaded');
    }
  };
  img.addEventListener('load', finish, { once: true });
  img.addEventListener('error', () => {
    if (fallback && img.src !== fallback) img.src = fallback;
    finish();
  }, { once: true });

  img.src = url;
}

/* =========================
   GLOBAL INIT
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }

  bindDropdown(sortTrigger, sortMenu, (val, label) => {
    if (sortTrigger)
      sortTrigger.querySelector('.label')?.replaceChildren(document.createTextNode(label));
    const col = sortMap[val] || 'xp_amount';
    activeFilters.sort_column = col;
    activeFilters.sort_direction = 'desc';
    currentPage = 1;
    updateLeaderboard({ page_number: 1 });
  });

  bindDropdown(rankTrigger, rankMenu, (val, label) => {
    if (rankTrigger) {
      rankTrigger.querySelector('.label')?.replaceChildren(document.createTextNode(label));
    }

    activeFilters.skill_rank = val;

    currentPage = 1;
    updateLeaderboard({ page_number: 1 });
  });

  updateLeaderboard({ page_number: 1 });

  const resetBtn = document.getElementById('resetFiltersBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetFilters();
    });
  }
  smoothRevealFilters();
});
