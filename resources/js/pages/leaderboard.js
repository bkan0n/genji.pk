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
     border:1px solid var(--pill-border);background:var(--pill-bg);color:var(--pill-text)`
  );
  __pillBase = true;
}

function __ensurePillVariant(key, bg, border, text) {
  __ensurePillBase();
  const k = `${key}|${bg}|${border}|${text}`;
  if (__pillRules.has(k)) return;
  __addRule(
    `.pill[data-k="${key}"]`,
    `--pill-bg:${bg};--pill-border:${border};--pill-text:${text}`
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
function ensureThead() {
  if (!table) return;
  table.classList.add(
    'min-w-full',
    'text-sm',
    'table-fixed',
    'border-separate',
    'border-spacing-y-1'
  );
  let thead = table.querySelector('thead');

  if (!thead) {
    table.innerHTML = `
      <thead class="bg-zinc-900/60 text-zinc-300">
        <tr class="thead-wrapper">
          <th class="col-idx px-4 py-3 text-left font-semibold">#</th>
          <th class="col-nickname px-4 py-3 text-left font-semibold">Nickname</th>
          <th class="col-xp px-4 py-3 text-left font-semibold">XP</th>
          <th class="col-tier px-4 py-3 text-left font-semibold">Tier</th>
          <th class="col-skill-rank px-4 py-3 text-left font-semibold">Skill rank</th>
          <th class="col-wr px-4 py-3 text-left font-semibold">World records</th>
          <th class="col-maps px-4 py-3 text-left font-semibold">Maps made</th>
          <th class="col-playtest px-4 py-3 text-left font-semibold">Playtest votes</th>
          <th class="col-discord px-4 py-3 text-left font-semibold">Discord tag</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    thead = table.querySelector('thead');
  }

  thead.querySelectorAll('th').forEach((th) => {
    th.classList.add('align-middle', 'whitespace-nowrap');
  });
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

  const data = await fetchLeaderboard(activeFilters);

  const total =
    Array.isArray(data) && data[0] && data[0].total_results ? +data[0].total_results : 0;

  let rows = data || [];
  if (activeFilters.sort_column === 'skill_rank') {
    rows = sortBySkillRankClient(rows, activeFilters.sort_direction);
  }

  const ids = [...new Set(rows.map(extractDiscordId).filter(Boolean))];
  const avatarMap = await resolveDiscordAvatars(ids);

  ensureThead();
  renderRows(rows, activeFilters.page_number, activeFilters.page_size, avatarMap);
  applySplitFlap(tbody);
  cascadeRows();
  renderPagination(total, activeFilters.page_number, activeFilters.page_size);

  hideLoadingBar();
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

function pill(label, baseHex) {
  const vivid = saturateHex(baseHex, 0.22);
  const bg = rgbaFromHex(vivid, 0.22);
  const border = rgbaFromHex(vivid, 0.45);

  const lum = relLuma(vivid);
  const darken = lum > 0.75 ? 0.22 : 0.1;
  const text = darkenHex(vivid, darken);

  const key = __slug(label || 'na');
  __ensurePillVariant(key, bg, border, text);

  return `<span class="pill" data-k="${key}">${esc(label)}</span>`;
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
function renderRows(data, pageNumber, pageSize, avatarMap = new Map()) {
  if (!tbody) return;
  tbody.innerHTML = '';

  const startIndex = (pageNumber - 1) * pageSize;

  data.forEach((player, idx) => {
    const rowNum = startIndex + idx + 1;

    const discordId = extractDiscordId(player);
    const fallback = defaultDiscordAvatarFromId(discordId);
    const avatarUrl = discordId ? avatarMap.get(discordId) || fallback : fallback;

    const discordTag =
      player.discord_tag === 'Unknown Username' ? 'N/A' : player.discord_tag || 'N/A';

    const skillRank = normalizeSkillRank(player.skill_rank);

    const haloClass = `
      relative
      after:content-[''] after:absolute after:inset-x-2 after:inset-y-0.5
      after:rounded-lg after:ring-2 after:pointer-events-none after:ring-zinc-200/30
      bg-zinc-900/40 hover:bg-white/5 transition gp-reveal-show
    `;

    const tr = document.createElement('tr');
    tr.className = haloClass.replace(/\s+/g, ' ').trim();
    tr.classList.add(__clsAnimDelay(__clamp(idx * 30, 0, 250)), 'tr-sf-enter');

    tr.innerHTML = `
      <td class="col-idx px-4 py-3 text-zinc-400 align-middle"
          data-sf="${escAttr(rowNum)}">${esc(rowNum)}</td>

      <td class="col-nickname px-4 py-3 align-middle">
        <a href="rank_card?user_id=${encodeURIComponent(player.user_id)}"
           class="inline-flex items-center gap-2 rounded-md hover:bg-white/5 px-1.5 py-0.5 transition">
          <img
            src="${avatarUrl}"
            alt=""
            class="h-8 w-8 rounded-full object-cover ring-1 ring-white/10 bg-zinc-800"
            loading="lazy" decoding="async" referrerpolicy="no-referrer"
            data-discord-avatar data-fallback="${fallback}"
          />
          <span class="font-medium"
                data-sf="${escAttr(player.nickname || 'N/A')}">${esc(player.nickname || 'N/A')}</span>
        </a>
      </td>

      <td class="col-xp px-4 py-3 font-semibold align-middle"
          data-sf="${escAttr((Number(player.xp_amount) || 0).toLocaleString())}">
          ${(Number(player.xp_amount) || 0).toLocaleString()}
      </td>

      <td class="col-tier px-4 py-3 align-middle">
        ${mkTierPill(player.tier_name)}
      </td>

      <td class="col-skill-rank px-4 py-3 align-middle">
        ${mkSkillPill(skillRank)}
      </td>

      <td class="col-wr px-4 py-3 align-middle"
          data-sf="${escAttr((Number(player.wr_count) || 0).toLocaleString())}">
          ${(Number(player.wr_count) || 0).toLocaleString()}
      </td>

      <td class="col-maps px-4 py-3 align-middle"
          data-sf="${escAttr((Number(player.map_count) || 0).toLocaleString())}">
          ${(Number(player.map_count) || 0).toLocaleString()}
      </td>

      <td class="col-playtest px-4 py-3 align-middle"
          data-sf="${escAttr((Number(player.playtest_count) || 0).toLocaleString())}">
          ${(Number(player.playtest_count) || 0).toLocaleString()}
      </td>

      <td class="col-discord px-4 py-3 text-zinc-300 align-middle"
          data-sf="${escAttr(discordTag)}">${esc(discordTag)}</td>
    `;

    tbody.appendChild(tr);

    const img = tr.querySelector('img[data-discord-avatar]');
    if (img) {
      img.addEventListener(
        'error',
        () => {
          const fb = img.getAttribute('data-fallback');
          if (fb && img.src !== fb) img.src = fb;
        },
        { once: true }
      );
    }
  });

  applySplitFlap(tbody);
  cascadeRows();
  smoothRevealTableRows(table);
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
  document.querySelectorAll('tbody tr').forEach((tr, i) => {
    tr.classList.add(__clsAnimDelay(__clamp(i * 30, 0, 250)), 'tr-sf-enter');
    tr.addEventListener('animationend', () => tr.classList.remove('tr-sf-enter'), { once: true });
  });
}

function escAttr(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function smoothRevealTableRows(rootEl) {
  const rows = rootEl.querySelectorAll('tbody tr');
  if (!rows.length) return;

  rows.forEach((tr) => tr.classList.add('gp-reveal'));

  requestAnimationFrame(() => {
    rows.forEach((tr, i) => {
      const delay = __clamp(i * 18, 0, 280);
      tr.classList.add(__clsTransDelay(delay), 'gp-reveal-show');
      tr.classList.remove('gp-reveal');
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
