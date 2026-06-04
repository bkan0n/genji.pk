import { cdnImage } from "../utils/cdn";

const API = '/api/tournaments';
const POLL_MS = 60_000;
const ARCHIVE_LIMIT = 10;
const AVATAR_CACHE_KEY = 'discord_avatar_cache_v5';
const AVATAR_CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
const MEDAL_URLS = {
  1: 'https://cdn.genji.pk/assets/medals/gold.png',
  2: 'https://cdn.genji.pk/assets/medals/silver.png',
  3: 'https://cdn.genji.pk/assets/medals/bronze.png',
};
const VERIFICATION_ICONS = {
  partial: 'https://cdn.genji.pk/assets/verifications/new/verification/verified_completion.avif',
  full: 'https://cdn.genji.pk/assets/verifications/new/verification/verified_full.avif',
  pendingPartial: 'https://cdn.genji.pk/assets/verifications/new/verification/pending_completion.avif',
  pendingFull: 'https://cdn.genji.pk/assets/verifications/new/verification/pending_full.avif',
};

const state = {
  edition: null,
  categories: [],
  activeCycles: new Map(),
  selectedCategoryId: '',
  currentSection: 'current',
  leaderboardEntries: [],
  leaderboardCycleId: null,
  leaderboardHash: '',
  leaderboardLoading: false,
  streakCache: new Map(),
  archiveCycles: [],
  archiveKey: '',
  archiveHash: '',
  archiveTotal: 0,
  archiveOffset: 0,
  hasLoaded: false,
  countdownTimer: null,
  pollTimer: null,
  tabsApi: null,
  leaderboardRequestSeq: 0,
  archiveRequestSeq: 0,
  historyRequestSeq: 0,
  mapModalRequestSeq: 0,
};

const i18n = window.TOURNAMENTS_I18N || {};

const $ = (selector, root = document) => root.querySelector(selector);
const TOURNAMENTS_CSP_NONCE = document.querySelector('meta[name="csp-nonce"]')?.content || '';
const tournamentDynamicStyle = (() => {
  const el = document.createElement('style');
  if (TOURNAMENTS_CSP_NONCE) el.setAttribute('nonce', TOURNAMENTS_CSP_NONCE);
  document.head.appendChild(el);
  return el;
})();
const tournamentDynamicSheet = tournamentDynamicStyle.sheet;
const tournamentDynamicRules = new Set();

const DIFFICULTY_COLORS = {
  Easy: '#cdff3a',
  Medium: '#fbdf00',
  Hard: '#ff9700',
  'Very Hard': '#ff4500',
  Extreme: '#ff0000',
  Hell: '#9a0000',
};

function t(path, fallback = path) {
  return path.split('.').reduce((value, key) => value?.[key], i18n) ?? fallback;
}

function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function qs(params = {}) {
  const out = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      out.set(key, value);
    }
  });
  return out.toString();
}

function addTournamentDynamicRule(selector, body) {
  const key = `${selector}{${body}}`;
  if (tournamentDynamicRules.has(key)) return;
  try {
    tournamentDynamicSheet.insertRule(key, tournamentDynamicSheet.cssRules.length);
    tournamentDynamicRules.add(key);
  } catch {}
}

function normalizeDifficulty(value) {
  return String(value || '')
    .replace(/\s*[+-]$/, '')
    .trim();
}

function difficultyColor(value) {
  const normalized = normalizeDifficulty(value).toLowerCase();
  const key = Object.keys(DIFFICULTY_COLORS).find((item) => item.toLowerCase() === normalized);
  return key ? DIFFICULTY_COLORS[key] : '';
}

const difficultyColorClassCache = new Map();

function difficultyColorClass(value) {
  const hex = difficultyColor(value);
  if (!hex) return 'text-zinc-500 dark:text-zinc-400';

  const safe = hex.toLowerCase().replace(/[^a-f0-9]/g, '') || 'default';
  if (!difficultyColorClassCache.has(safe)) {
    const cls = `tournament-difficulty-${safe}`;
    addTournamentDynamicRule(`.${cls}`, `color:${hex}!important`);
    difficultyColorClassCache.set(safe, cls);
  }

  return difficultyColorClassCache.get(safe);
}

function difficultyLabelHtml(value, className = '') {
  const text = String(value || '').trim();
  if (!text) return '';
  const classes = [className, difficultyColorClass(text)].filter(Boolean).join(' ');
  return `<span class="${classes}">${esc(text)}</span>`;
}

function difficultyListHtml(value, className = '') {
  const list = normalizeStringList(value);
  if (!list.length) return '';

  return list
    .map((item, index) => {
      const separator = index < list.length - 1 ? '<span class="text-zinc-400 dark:text-zinc-500">, </span>' : '';
      return `${difficultyLabelHtml(item, className)}${separator}`;
    })
    .join('');
}

async function api(path, params = {}) {
  const query = qs(params);
  const url = `${API}${path}${query ? `?${query}` : ''}`;
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  const data = await response
    .clone()
    .json()
    .catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    data: data ?? (await response.text().catch(() => '')),
  };
}

function formatDate(value) {
  if (!value) return '...';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatTime(seconds, { unit = true } = {}) {
  const n = Number(seconds);
  if (!Number.isFinite(n)) return '--';
  return `${n.toFixed(2)}${unit ? 's' : ''}`;
}

function formatCountdown(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const hms = [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':');
  return days > 0 ? `${days}d ${hms}` : hms;
}

function categoryName(id) {
  return state.categories.find((category) => String(category.id) === String(id))?.name || `#${id}`;
}

function selectedCycle() {
  return state.activeCycles.get(String(state.selectedCategoryId)) || null;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function showToast(message, type = 'ok', opts = {}) {
  const {
    duration = 2000,
    enter = 220,
    exit = 220,
    easing = 'cubic-bezier(0.4,0,0.2,1)',
  } = opts;

  let root = document.getElementById('toast-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'toast-root';
    document.body.appendChild(root);
  }

  root.className = 'pointer-events-none fixed inset-x-0 bottom-6 z-[200] flex justify-center px-3';

  while (root.firstElementChild) {
    const prev = root.firstElementChild;
    try {
      prev.getAnimations?.().forEach((animation) => animation.cancel());
    } catch {}
    prev.remove();
  }

  const palette =
    type === 'ok'
      ? 'bg-emerald-500/90 text-zinc-900 dark:text-white'
      : type === 'warn'
        ? 'bg-amber-500/90 text-zinc-900'
        : 'bg-red-600/90 text-zinc-900 dark:text-white';

  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.className = [
    'pointer-events-auto select-none rounded-xl px-4 py-2',
    'text-sm shadow-lg text-center transform-gpu',
    'w-auto max-w-[92vw] sm:max-w-[42rem]',
    palette,
  ].join(' ');
  el.textContent = message;

  root.appendChild(el);

  const inAnim = el.animate(
    [
      { opacity: 0, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
    { duration: enter, easing, fill: 'forwards' }
  );

  const close = () => {
    Promise.resolve(inAnim.finished)
      .catch(() => {})
      .finally(() => {
        const outAnim = el.animate(
          [
            { opacity: 1, transform: 'translateY(0)' },
            { opacity: 0, transform: 'translateY(8px)' },
          ],
          { duration: exit, easing, fill: 'forwards' }
        );
        outAnim.finished.then(() => el.remove()).catch(() => el.remove());
        setTimeout(() => el.remove(), exit + 120);
      });
  };

  const timer = setTimeout(close, Math.max(duration, enter + 50));
  el.addEventListener('click', () => {
    clearTimeout(timer);
    close();
  });
}

async function copyTextToClipboard(value) {
  const text = String(value || '').trim();
  if (!text) return false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}

  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-9999px';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

async function copyMapCode(code) {
  const value = String(code || '').trim();
  if (!value || value === '...') return;
  const ok = await copyTextToClipboard(value);
  if (ok) {
    showToast(t('messages.map_code_copied', `Map code ${value} copied`).replace('{code}', value), 'ok');
  } else {
    showToast(t('messages.copy_failed', 'Failed to copy map code.'), 'error');
  }
}

function mapBannerSrc(name) {
  const key = String(name || 'default')
    .toLowerCase()
    .replace(/[()\s':]/g, '') || 'default';

  return cdnImage(`assets/map_banners/${key}.png`, {
    width: 1200,
    quality: 82,
    format: 'auto',
    fit: 'cover',
  });
}

function mapBannerImageHtml(name, className = '') {
  return `
    <img
      src="${esc(mapBannerSrc(name))}"
      alt=""
      class="${className}"
      loading="lazy"
      decoding="async"
      data-map-banner
    />
  `;
}

function mapBannerPlaceholderHtml() {
  return '<div data-map-banner-placeholder aria-hidden="true" class="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(228,228,231,.95),rgba(244,244,245,.72),rgba(212,212,216,.9))] dark:bg-[linear-gradient(110deg,rgba(39,39,42,.95),rgba(63,63,70,.55),rgba(24,24,27,.95))]"></div>';
}

function bindMapBannerFallbacks(root = document) {
  root.querySelectorAll('img[data-map-banner]:not([data-map-banner-bound])').forEach((img) => {
    img.dataset.mapBannerBound = '1';
    const host = img.closest('[data-map-banner-host]');
    const placeholder = host?.querySelector('[data-map-banner-placeholder]');
    const hidePlaceholder = () => placeholder?.classList.add('hidden');

    if (img.complete && img.naturalWidth > 0) hidePlaceholder();
    img.addEventListener('load', hidePlaceholder, { once: true });
    img.addEventListener(
      'error',
      () => {
        img.removeAttribute('src');
        img.classList.add('hidden');
        host?.classList.add('bg-zinc-100', 'dark:bg-zinc-900');
      },
      { once: true }
    );
  });
}

function cycleMapCaptionHtml(cycle) {
  const category = cycle?.category_id ? categoryName(cycle.category_id) : '';
  const difficulty = cycle?.map_difficulty || '';

  if (!category && !difficulty) return esc(t('table.map', 'Map'));

  return [
    category ? `<span class="text-zinc-500 dark:text-zinc-400">${esc(category)}</span>` : '',
    category && difficulty ? '<span class="text-zinc-400 dark:text-zinc-500"> / </span>' : '',
    difficulty ? difficultyLabelHtml(difficulty, 'font-black') : '',
  ].join('');
}

function mapBannerPanelHtml(cycle, { compact = false, showWinner = false } = {}) {
  if (!cycle) return '';
  const minHeight = compact ? 'min-h-[92px]' : 'min-h-[132px]';
  const mapName = cycle.map_name || t('labels.unknown_map', 'Unknown map');
  const mapCode = cycle.map_code || '';

  return `
    <article data-map-banner-host class="relative overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-100 ${minHeight} dark:border-white/10 dark:bg-zinc-950/50">
      ${mapBannerPlaceholderHtml()}
      ${mapBannerImageHtml(mapName, 'pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45 saturate-[0.9] dark:opacity-35')}
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/50 dark:from-zinc-950/95 dark:via-zinc-950/75 dark:to-zinc-950/45"></div>
      <div class="relative z-10 flex h-full flex-col justify-end gap-3 p-3 sm:flex-row sm:items-end sm:justify-between">
        <div class="min-w-0">
          <p class="truncate text-xs font-black uppercase tracking-wide">${cycleMapCaptionHtml(cycle)}</p>
          <h3 class="mt-1 truncate text-xl font-black text-zinc-950 dark:text-white">${esc(mapName)}</h3>
          ${
            mapCode
              ? `<p class="mt-1 inline-flex rounded-md bg-zinc-950 px-2 py-1 font-mono text-xs font-black text-white dark:bg-black/60">${esc(mapCode)}</p>`
              : ''
          }
        </div>
        ${
          showWinner && cycle.winner_name
            ? `<p class="rounded-lg border border-zinc-200/80 bg-white/75 px-3 py-2 text-xs font-semibold text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-200">${esc(t('table.winner', 'Winner'))}: <span class="font-black">${esc(cycle.winner_name)}</span></p>`
            : ''
        }
      </div>
    </article>
  `;
}

function renderLeaderboardMapBanner(cycle) {
  const root = $('#tournamentLeaderboardMapBanner');
  if (!root) return;

  if (!cycle) {
    root.classList.add('hidden');
    root.innerHTML = '';
    return;
  }

  root.innerHTML = mapBannerPanelHtml(cycle, { compact: true });
  root.classList.remove('hidden');
  bindMapBannerFallbacks(root);
}

function renderHistoryModalBanner(cycle) {
  const root = $('#tournamentHistoryModalBanner');
  if (!root) return;

  if (!cycle) {
    root.classList.add('hidden');
    root.innerHTML = '';
    return;
  }

  root.innerHTML = mapBannerPanelHtml(cycle, { showWinner: true });
  root.classList.remove('hidden');
  bindMapBannerFallbacks(root);
}

function renderLeaderboardMapBannerSkeleton() {
  const root = $('#tournamentLeaderboardMapBanner');
  if (!root) return;
  root.innerHTML = mapBannerSkeletonHtml({ compact: true });
  root.classList.remove('hidden');
}

function renderHistoryModalBannerSkeleton() {
  const root = $('#tournamentHistoryModalBanner');
  if (!root) return;
  root.innerHTML = mapBannerSkeletonHtml({ showWinner: true });
  root.classList.remove('hidden');
}

function normalizeMapRows(data) {
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.maps)) return data.maps;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && (data.code || data.map_code || data.map_name || data.id)) return [data];
  return [];
}

async function fetchMapRowByCode(code) {
  const value = String(code || '').trim();
  if (!value || value === '...') return null;

  try {
    const url = new URL('/api/maps', window.location.origin);
    url.searchParams.set('page_size', '10');
    url.searchParams.set('page_number', '1');
    url.searchParams.set('code', value);
    const uid = String(window.user_id ?? '').trim();
    if (uid) url.searchParams.set('user_id', uid);

    const response = await fetch(url.toString(), {
      cache: 'no-store',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    const data = response.ok ? await response.json().catch(() => null) : null;
    const rows = normalizeMapRows(data);
    const exact = rows.find((row) => String(row?.code || row?.map_code || '').toLowerCase() === value.toLowerCase());
    return exact || rows[0] || null;
  } catch {
    return null;
  }
}

function normalizeStringList(value) {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => normalizeStringList(item))
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (value && typeof value === 'object') {
    const label = value.name ?? value.label ?? value.text ?? value.value ?? value.title ?? '';
    return label ? [String(label).trim()].filter(Boolean) : [];
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return value == null || value === '' ? [] : [String(value)];
}

function pickCreatorNames(row = {}) {
  if (Array.isArray(row.creators) && row.creators.length) {
    return row.creators
      .map((creator) => creator?.name ?? creator?.nickname ?? creator?.username ?? creator?.label ?? '')
      .filter(Boolean)
      .map(String);
  }
  return normalizeStringList(row.creator_names ?? row.creator_name ?? row.creator ?? row.authors ?? row.author);
}

function pickMapTypes(row = {}) {
  return normalizeStringList(row.category ?? row.map_type ?? row.type);
}

function mapBool(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'boolean') return value;
  const text = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'official', 'global'].includes(text)) return true;
  if (['0', 'false', 'no', 'unofficial', 'china', 'cn'].includes(text)) return false;
  return Boolean(value);
}

function formatNumber(value) {
  if (value == null || value === '' || String(value).trim() === 'N/A') return '-';
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  return new Intl.NumberFormat().format(number);
}

function qualityStars(value, max = 6) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '-';
  const filled = Math.max(0, Math.min(max, Math.floor(number)));
  return `${'★'.repeat(filled)}${'☆'.repeat(max - filled)}`;
}

function guideLinks(row = {}) {
  const guides = normalizeStringList(row.guides ?? row.guide ?? row.guide_url ?? row.video);
  return guides.filter((url) => /^https?:\/\//i.test(url));
}

function mapModalFallback(cycle, category) {
  return {
    code: cycle?.map_code || '',
    map_code: cycle?.map_code || '',
    map_name: cycle?.map_name || t('labels.unknown_map', 'Unknown map'),
    difficulty: cycle?.map_difficulty || '',
    category: category?.name || categoryName(cycle?.category_id || state.selectedCategoryId),
  };
}

function mergeMapRows(fallback, detail) {
  if (!detail) return fallback;
  const merged = { ...fallback, ...detail };
  Object.entries(fallback).forEach(([key, value]) => {
    const current = merged[key];
    if ((current == null || current === '' || (Array.isArray(current) && !current.length)) && value) {
      merged[key] = value;
    }
  });
  return merged;
}

function pillListHtml(items) {
  const list = normalizeStringList(items);
  if (!list.length) {
    return `<span class="text-sm text-zinc-500 dark:text-zinc-400">${esc(t('empty.none', 'None'))}</span>`;
  }

  return list
    .map(
      (item) => `
        <span class="inline-flex items-center rounded-full border border-zinc-200/80 bg-white/35 px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-900 backdrop-blur dark:border-white/10 dark:bg-zinc-900/3 dark:bg-white/10 dark:text-white/85">
          ${esc(item)}
        </span>
      `
    )
    .join('');
}

function detailRow(label, value) {
  return `
    <div class="grid grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] gap-3 border-t border-zinc-200/70 py-2.5 first:border-t-0 dark:border-white/10">
      <dt class="text-xs text-zinc-900 dark:text-white/60">${esc(label)}</dt>
      <dd class="min-w-0 break-words text-sm font-medium text-zinc-900 dark:text-white/90">${esc(value || '-')}</dd>
    </div>
  `;
}

function detailRowHtml(label, html) {
  return `
    <div class="grid grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] gap-3 border-t border-zinc-200/70 py-2.5 first:border-t-0 dark:border-white/10">
      <dt class="text-xs text-zinc-900 dark:text-white/60">${esc(label)}</dt>
      <dd class="min-w-0 break-words text-sm font-medium">${html || '-'}</dd>
    </div>
  `;
}

function setMapModalText(root, selector, value) {
  const el = $(selector, root);
  if (el) el.textContent = value;
}

function renderTournamentMapModal(row, cycle, category, { loading = false, failed = false } = {}) {
  const overlay = ensureTournamentMapModal();
  const mapName = row.original_map_name || row.map_name || cycle?.map_name || t('labels.unknown_map', 'Unknown map');
  const mapCode = row.code || row.map_code || cycle?.map_code || '';
  const typeText = pickMapTypes(row).join(', ') || category?.name || categoryName(cycle?.category_id || state.selectedCategoryId);
  const difficulty = row.difficulty || cycle?.map_difficulty || '-';
  const creators = pickCreatorNames(row);
  const qualityRaw = row.ratings ?? row.quality;
  const medals = {
    gold: row.medals?.gold ?? row.gold ?? '-',
    silver: row.medals?.silver ?? row.silver ?? '-',
    bronze: row.medals?.bronze ?? row.bronze ?? '-',
  };
  const isOfficial = mapBool(row.official ?? row.is_official);
  const statusText =
    isOfficial === null
      ? '-'
      : isOfficial
        ? t('labels.official', 'Official')
        : t('labels.unofficial', 'Unofficial');
  const links = guideLinks(row);
  const description = row.description || row.desc || t('empty.no_description', 'No description available.');
  const linkedCode = row.linked_code || row.linkedCode || '';
  const linkedLabel = isOfficial
    ? t('labels.unofficial_code', 'Unofficial code')
    : t('labels.official_code', 'Official code');
  const hasNonNullTime = row.time != null && String(row.time).trim().toLowerCase() !== 'null';
  const completed = Boolean(window.user_id) && (row.user_has_completion || row.user_has_record || row.user_completed || hasNonNullTime);
  const cover = $('#tournamentMapModalCover', overlay);
  const guide = $('#tournamentMapModalGuide', overlay);
  const linked = $('#tournamentMapModalLinked', overlay);
  const status = $('#tournamentMapModalStatus', overlay);

  overlay.dataset.mapCode = mapCode;
  overlay.dataset.linkedCode = linkedCode || '';

  setMapModalText(overlay, '#tournamentMapModalTitle', mapName);
  setMapModalText(overlay, '#tournamentMapModalCode', mapCode || '-');
  setMapModalText(overlay, '#tournamentMapModalMedalGold', medals.gold);
  setMapModalText(overlay, '#tournamentMapModalMedalSilver', medals.silver);
  setMapModalText(overlay, '#tournamentMapModalMedalBronze', medals.bronze);
  setMapModalText(overlay, '#tournamentMapModalDescription', description);

  const completedChip = $('#tournamentMapModalCompleted', overlay);
  if (completedChip) {
    completedChip.className = completed
      ? 'inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300 ring-1 ring-emerald-400/30'
      : 'inline-flex items-center gap-2 rounded-full bg-white/35 px-3 py-1 text-sm font-medium text-zinc-900 ring-1 ring-zinc-300/60 dark:bg-zinc-900/5 dark:bg-white/10 dark:text-white/80 dark:ring-white/15';
    completedChip.innerHTML = `<span class="h-2 w-2 rounded-full ${completed ? 'bg-emerald-400' : 'bg-white/60'}"></span>${esc(completed ? t('labels.completed', 'Completed') : t('labels.not_completed', 'Not completed'))}`;
  }

  if (cover) {
    cover.classList.remove('bg-zinc-900');
    cover.src = mapBannerSrc(mapName);
    cover.addEventListener('error', () => {
      cover.removeAttribute('src');
      cover.classList.add('bg-zinc-900');
    }, { once: true });
  }

  if (guide) {
    if (links.length) {
      guide.classList.remove('hidden');
      guide.classList.add('inline-flex');
      guide.dataset.href = links[0];
      guide.setAttribute('aria-disabled', 'false');
    } else {
      guide.classList.add('hidden');
      guide.classList.remove('inline-flex');
      guide.removeAttribute('data-href');
      guide.setAttribute('aria-disabled', 'true');
    }
  }

  if (linked) {
    linked.classList.toggle('hidden', !linkedCode || isOfficial === null);
    setMapModalText(overlay, '#tournamentMapModalLinkedLabel', linkedLabel);
    setMapModalText(overlay, '#tournamentMapModalLinkedCode', linkedCode || '-');
  }

  const mechanics = $('#tournamentMapModalMechanics', overlay);
  const restrictions = $('#tournamentMapModalRestrictions', overlay);
  const tags = $('#tournamentMapModalTags', overlay);
  if (mechanics) mechanics.innerHTML = pillListHtml(row.mechanics ?? row.map_mechanics);
  if (restrictions) restrictions.innerHTML = pillListHtml(row.restrictions ?? row.map_restrictions);
  if (tags) tags.innerHTML = pillListHtml(row.tags ?? row.map_tags ?? row.tag_list);

  const details = $('#tournamentMapModalDetails', overlay);
  if (details) {
    details.innerHTML = [
      detailRow(t('labels.map_creator', 'Creator'), creators.join(', ') || 'N/A'),
      detailRow(t('labels.checkpoints', 'Checkpoints'), formatNumber(row.checkpoints ?? row.checkpoint_count ?? row.cp_count)),
      detailRow(t('labels.upvotes', 'Upvotes'), formatNumber(row.upvotes)),
      detailRow(t('labels.map_type', 'Type'), typeText || '-'),
      detailRowHtml(t('labels.map_difficulty', 'Difficulty'), difficultyLabelHtml(difficulty, 'font-black') || '-'),
      detailRow(t('labels.map_status', 'Status'), statusText),
      detailRow(t('labels.quality', 'Quality'), qualityRaw != null ? qualityStars(qualityRaw) : '-'),
    ].join('');
  }

  if (status) {
    status.className = failed
      ? 'mt-3 text-xs font-semibold text-amber-700 dark:text-amber-300'
      : 'mt-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400';
    status.textContent = failed
      ? t('messages.map_load_failed', 'Full map details could not be loaded.')
      : loading
        ? t('messages.loading_map_details', 'Loading full map details...')
        : '';
  }
}

function ensureTournamentMapModal() {
  let overlay = $('#tournamentMapModalOverlay');
  if (overlay) return overlay;

  const tpl = document.createElement('div');
  tpl.innerHTML = `
    <div
      id="tournamentMapModalOverlay"
      class="fixed inset-0 z-[90] hidden items-center justify-center bg-black/70 p-4 opacity-0 backdrop-blur-sm transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tournamentMapModalTitle"
    >
      <div
        id="tournamentMapModalShell"
        class="mx-4 w-[min(96vw,1080px)] max-h-[calc(100dvh-2rem)] rounded-3xl bg-gradient-to-tr from-white/25 via-indigo-400/30 p-px opacity-0 shadow-2xl ring-1 ring-zinc-300/60 transition-all duration-200 dark:ring-white/10 translate-y-3"
      >
        <div
          id="tournamentMapModalBox"
          class="relative min-h-0 sm:min-h-[640px] max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden rounded-3xl bg-white/90 text-zinc-900 shadow-2xl ring-1 ring-zinc-300/60 dark:bg-zinc-900/90 dark:text-zinc-100 dark:ring-white/10"
        >
          <div class="relative h-56 overflow-hidden rounded-t-3xl">
            <img id="tournamentMapModalCover" alt="" class="absolute inset-0 block h-full w-full min-w-full max-w-none object-cover opacity-80" />
            <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-zinc-900/80"></div>
            <div class="absolute left-0 right-0 top-0 flex items-center justify-between gap-3 p-4">
              <span id="tournamentMapModalCompleted"></span>
              <button
                id="tournamentMapModalClose"
                type="button"
                class="group inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-zinc-900/7 text-zinc-900 ring-1 ring-zinc-300/60 transition hover:bg-black/60 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:bg-black/40 dark:text-white/85 dark:ring-white/15 dark:hover:text-white"
                aria-label="${esc(t('buttons.close', 'Close'))}"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-zinc-900 group-hover:text-zinc-900 dark:text-white/85 dark:group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="absolute bottom-0 left-0 right-0 p-5">
              <p class="text-xs font-black uppercase tracking-wide text-emerald-200">${esc(t('labels.map_details', 'Map details'))}</p>
              <h2 id="tournamentMapModalTitle" class="mt-1 truncate text-3xl font-black text-white"></h2>
              <p id="tournamentMapModalStatus"></p>
            </div>
          </div>

          <div class="grid gap-4 p-4 sm:gap-6 sm:p-6 md:grid-cols-12">
            <div class="min-w-0 space-y-5 md:col-span-7">
              <section class="rounded-2xl bg-white/85 p-3 ring-1 ring-zinc-300/60 dark:bg-zinc-900/3 dark:bg-white/5 dark:ring-white/10 sm:p-4">
                <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <div class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60">${esc(t('labels.map_code', 'Map code'))}</div>
                    <div id="tournamentMapModalCode" class="mt-1 font-mono text-lg">-</div>
                  </div>
                  <div class="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:justify-start">
                    <button
                      id="tournamentMapModalGuide"
                      type="button"
                      class="hidden inline-flex cursor-pointer items-center rounded-xl bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-900 ring-1 ring-indigo-300 transition-colors duration-150 hover:bg-indigo-200 hover:text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-indigo-500/15 dark:text-indigo-200 dark:ring-indigo-400/40 dark:hover:bg-indigo-500/25 dark:hover:text-indigo-100 dark:focus:ring-indigo-400/60"
                      aria-disabled="true"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path d="M4 19.5V6a2 2 0 0 1 2-2h9.5A2.5 2.5 0 0 1 18 6.5V18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M4 8h10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M8 22l3-3-3-3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                      ${esc(t('buttons.guide', 'Guide'))}
                    </button>
                    <button
                      id="tournamentMapModalCopy"
                      type="button"
                      class="inline-flex cursor-pointer items-center rounded-xl bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-300 transition-colors duration-150 hover:bg-emerald-200 hover:text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30 dark:hover:bg-emerald-500/20 dark:hover:text-emerald-200 dark:focus:ring-emerald-400/60"
                    >
                      <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      ${esc(t('buttons.copy_code', 'Copy code'))}
                    </button>
                  </div>
                </div>
              </section>

              <section id="tournamentMapModalLinked" class="hidden rounded-2xl bg-white/85 p-4 ring-1 ring-zinc-300/60 dark:bg-zinc-900/3 dark:bg-white/5 dark:ring-white/10">
                <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <div id="tournamentMapModalLinkedLabel" class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60"></div>
                    <div id="tournamentMapModalLinkedCode" class="mt-1 font-mono text-sm text-zinc-900 dark:text-white/90">-</div>
                  </div>
                  <button
                    id="tournamentMapModalLinkedCopy"
                    type="button"
                    class="inline-flex cursor-pointer items-center rounded-xl bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-500/30 transition hover:bg-emerald-500/20 hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  >
                    <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    ${esc(t('buttons.copy_code', 'Copy code'))}
                  </button>
                </div>
              </section>

              <section class="rounded-2xl bg-white/85 p-4 ring-1 ring-zinc-300/60 dark:bg-zinc-900/3 dark:bg-white/5 dark:ring-white/10">
                <div class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60">${esc(t('labels.medals', 'Medals'))}</div>
                <div class="mt-3 grid gap-3 sm:grid-cols-3">
                  <div class="rounded-xl bg-yellow-500/10 p-3 ring-1 ring-yellow-400/30">
                    <div class="text-xs text-zinc-900 dark:text-white/70">${esc(t('labels.gold', 'Gold'))}</div>
                    <div id="tournamentMapModalMedalGold" class="text-lg font-semibold">-</div>
                  </div>
                  <div class="rounded-xl bg-slate-300/10 p-3 ring-1 ring-slate-300/30">
                    <div class="text-xs text-zinc-900 dark:text-white/70">${esc(t('labels.silver', 'Silver'))}</div>
                    <div id="tournamentMapModalMedalSilver" class="text-lg font-semibold">-</div>
                  </div>
                  <div class="rounded-xl bg-amber-700/10 p-3 ring-1 ring-amber-600/30">
                    <div class="text-xs text-zinc-900 dark:text-white/70">${esc(t('labels.bronze', 'Bronze'))}</div>
                    <div id="tournamentMapModalMedalBronze" class="text-lg font-semibold">-</div>
                  </div>
                </div>
              </section>

              <section class="rounded-2xl bg-white/85 p-4 ring-1 ring-zinc-300/60 dark:bg-zinc-900/3 dark:bg-white/5 dark:ring-white/10">
                <div class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60">${esc(t('labels.description', 'Description'))}</div>
                <p id="tournamentMapModalDescription" class="mt-2 leading-relaxed text-zinc-900 dark:text-white/85"></p>
              </section>

              <div class="grid gap-4 sm:grid-cols-2">
                <section class="rounded-2xl bg-white/85 p-4 ring-1 ring-zinc-300/60 dark:bg-zinc-900/3 dark:bg-white/5 dark:ring-white/10">
                  <div class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60">${esc(t('labels.mechanics', 'Mechanics'))}</div>
                  <div id="tournamentMapModalMechanics" class="mt-2 flex flex-wrap gap-2"></div>
                </section>
                <section class="rounded-2xl bg-white/85 p-4 ring-1 ring-zinc-300/60 dark:bg-zinc-900/3 dark:bg-white/5 dark:ring-white/10">
                  <div class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60">${esc(t('labels.restrictions', 'Restrictions'))}</div>
                  <div id="tournamentMapModalRestrictions" class="mt-2 flex flex-wrap gap-2"></div>
                </section>
                <section class="rounded-2xl bg-white/85 p-4 ring-1 ring-zinc-300/60 dark:bg-zinc-900/3 dark:bg-white/5 dark:ring-white/10 sm:col-span-2">
                  <div class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60">${esc(t('labels.tags', 'Tags'))}</div>
                  <div id="tournamentMapModalTags" class="mt-2 flex flex-wrap gap-2"></div>
                </section>
              </div>
            </div>

            <aside class="min-w-0 md:col-span-5">
              <section class="sticky top-4 rounded-2xl bg-white/85 p-4 ring-1 ring-zinc-300/60 dark:bg-zinc-900/3 dark:bg-white/5 dark:ring-white/10">
                <div class="text-xs uppercase tracking-widest text-zinc-900 dark:text-white/60">${esc(t('labels.map_details', 'Map details'))}</div>
                <dl id="tournamentMapModalDetails" class="mt-3"></dl>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(tpl.firstElementChild);
  overlay = $('#tournamentMapModalOverlay');

  $('#tournamentMapModalClose', overlay)?.addEventListener('click', closeTournamentMapModal);
  overlay.addEventListener('click', (event) => {
    const guide = event.target.closest('#tournamentMapModalGuide');
    if (guide) {
      const href = guide.dataset.href || '';
      if (href) window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }

    if (event.target.closest('#tournamentMapModalCopy')) {
      void copyMapCode(overlay.dataset.mapCode || '');
      return;
    }

    if (event.target.closest('#tournamentMapModalLinkedCopy')) {
      void copyMapCode(overlay.dataset.linkedCode || '');
    }
  });
  overlay.addEventListener('pointerdown', (event) => {
    const box = $('#tournamentMapModalBox', overlay);
    if (box && !box.contains(event.target)) closeTournamentMapModal();
  });

  return overlay;
}

function showTournamentMapModal(overlay) {
  const shell = $('#tournamentMapModalShell', overlay);
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  requestAnimationFrame(() => {
    overlay.classList.remove('opacity-0');
    overlay.classList.add('opacity-100');
    shell?.classList.remove('translate-y-3', 'opacity-0');
    shell?.classList.add('translate-y-0', 'opacity-100');
  });
}

async function openTournamentMapModal(cycle, category) {
  if (!cycle) return;

  const overlay = ensureTournamentMapModal();
  const requestSeq = ++state.mapModalRequestSeq;
  const fallback = mapModalFallback(cycle, category);
  renderTournamentMapModal(fallback, cycle, category, { loading: true });
  showTournamentMapModal(overlay);

  const detail = await fetchMapRowByCode(fallback.code || fallback.map_code);
  if (requestSeq !== state.mapModalRequestSeq) return;

  renderTournamentMapModal(mergeMapRows(fallback, detail), cycle, category, {
    failed: !detail,
  });
}

function closeTournamentMapModal() {
  const overlay = $('#tournamentMapModalOverlay');
  const shell = $('#tournamentMapModalShell');
  if (!overlay) return;
  state.mapModalRequestSeq += 1;

  overlay.classList.add('opacity-0');
  overlay.classList.remove('opacity-100');
  shell?.classList.add('translate-y-3', 'opacity-0');
  shell?.classList.remove('translate-y-0', 'opacity-100');

  setTimeout(() => {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
  }, 180);
}

function skeletonBlock(className = 'h-4 w-full') {
  return `<span aria-hidden="true" class="block animate-pulse rounded bg-zinc-200/80 dark:bg-white/10 ${className}"></span>`;
}

function mapBannerSkeletonHtml({ compact = false, showWinner = false } = {}) {
  const minHeight = compact ? 'min-h-[92px]' : 'min-h-[132px]';

  return `
    <article class="relative overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-100 ${minHeight} dark:border-white/10 dark:bg-zinc-950/50">
      <div aria-hidden="true" class="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(228,228,231,.95),rgba(244,244,245,.72),rgba(212,212,216,.9))] dark:bg-[linear-gradient(110deg,rgba(39,39,42,.95),rgba(63,63,70,.55),rgba(24,24,27,.95))]"></div>
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/50 dark:from-zinc-950/95 dark:via-zinc-950/75 dark:to-zinc-950/45"></div>
      <div class="relative z-10 flex h-full flex-col justify-end gap-3 p-3 sm:flex-row sm:items-end sm:justify-between">
        <div class="min-w-0 flex-1">
          ${skeletonBlock('h-3 w-36')}
          ${skeletonBlock('mt-2 h-7 w-48 max-w-full')}
          ${skeletonBlock('mt-2 h-7 w-20 rounded-md')}
        </div>
        ${showWinner ? `<div class="w-full sm:w-44">${skeletonBlock('h-9 rounded-lg')}</div>` : ''}
      </div>
    </article>
  `;
}

function leaderboardTableSkeletonRows(rows = 7) {
  const nameWidths = ['w-32', 'w-40', 'w-28', 'w-36'];

  return Array.from({ length: rows })
    .map((_, index) => {
      const nameWidth = nameWidths[index % nameWidths.length];
      return `
        <tr class="border-t border-zinc-200/80 dark:border-white/10">
          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              ${skeletonBlock('h-4 w-6')}
              ${skeletonBlock('h-5 w-5 rounded-full')}
            </div>
          </td>
          <td class="px-4 py-3">
            <div class="flex min-w-[12rem] items-center gap-3">
              ${skeletonBlock('h-8 w-8 shrink-0 rounded-lg')}
              <div class="min-w-0 flex-1">
                ${skeletonBlock(`h-4 ${nameWidth}`)}
                ${skeletonBlock('mt-2 h-3 w-20')}
              </div>
            </div>
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              ${skeletonBlock('h-4 w-16')}
              ${skeletonBlock('h-5 w-5 rounded-md')}
            </div>
          </td>
          <td class="px-4 py-3">
            ${skeletonBlock('h-8 w-16 rounded-lg')}
          </td>
        </tr>
      `;
    })
    .join('');
}

function historyModalTableSkeletonRows(rows = 7) {
  const nameWidths = ['w-32', 'w-40', 'w-28'];

  return Array.from({ length: rows })
    .map((_, index) => `
      <tr class="border-t border-zinc-200/80 dark:border-white/10">
        <td class="px-4 py-3">
          <div class="flex items-center gap-2">
            ${skeletonBlock('h-4 w-6')}
            ${skeletonBlock('h-5 w-5 rounded-full')}
          </div>
        </td>
        <td class="px-4 py-3">
          <div class="flex min-w-[12rem] items-center gap-3">
            ${skeletonBlock('h-8 w-8 shrink-0 rounded-lg')}
            <div class="min-w-0 flex-1">
              ${skeletonBlock(`h-4 ${nameWidths[index % nameWidths.length]}`)}
              ${skeletonBlock('mt-2 h-3 w-16')}
            </div>
          </div>
        </td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-2">
            ${skeletonBlock('h-4 w-16')}
            ${skeletonBlock('h-5 w-5 rounded-md')}
          </div>
        </td>
      </tr>
    `)
    .join('');
}

function archiveTableSkeletonRows(rows = 7) {
  return Array.from({ length: rows })
    .map(() => `
      <tr class="border-t border-zinc-200/80 dark:border-white/10">
        <td class="px-4 py-3">
          <div class="flex min-w-[230px] items-center gap-3">
            ${skeletonBlock('h-14 w-28 shrink-0 rounded-lg')}
            <div class="min-w-0 flex-1">
              ${skeletonBlock('h-4 w-36')}
              ${skeletonBlock('mt-2 h-3 w-16')}
              ${skeletonBlock('mt-2 h-3 w-20')}
            </div>
          </div>
        </td>
        <td class="px-4 py-3">${skeletonBlock('h-4 w-20')}</td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            ${skeletonBlock('h-8 w-8 shrink-0 rounded-lg')}
            ${skeletonBlock('h-4 w-28')}
          </div>
        </td>
        <td class="px-4 py-3">${skeletonBlock('h-4 w-24')}</td>
        <td class="px-4 py-3 text-right">
          <div class="flex justify-end">${skeletonBlock('h-8 w-14 rounded-lg')}</div>
        </td>
      </tr>
    `)
    .join('');
}

function topFiveSkeletonHtml() {
  return `
    <div class="grid gap-4 lg:grid-cols-12">
      ${Array.from({ length: 5 })
        .map((_, index) => {
          const isTop = index === 0;
          const isMid = index === 1 || index === 2;
          const colSpan = isTop ? 'lg:col-span-12' : 'lg:col-span-6';
          const minHeight = isTop ? 'min-h-[178px] p-5 sm:p-6' : isMid ? 'min-h-[150px] p-4 sm:p-5' : 'min-h-[124px] p-4';
          const avatar = isTop ? 'h-24 w-24 sm:h-28 sm:w-28' : isMid ? 'h-20 w-20' : 'h-16 w-16';
          const name = isTop ? 'h-9 w-64' : isMid ? 'h-7 w-44' : 'h-6 w-36';
          const time = isTop ? 'h-9 w-28' : isMid ? 'h-7 w-24' : 'h-6 w-20';

          return `
            <article class="${colSpan} relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-100 ${minHeight} dark:border-white/10 dark:bg-white/5">
              <div class="absolute right-4 top-4">${skeletonBlock('h-8 w-20 rounded-lg')}</div>
              <div class="flex h-full items-center gap-4 sm:gap-5">
                ${skeletonBlock(`${avatar} shrink-0 rounded-2xl`)}
                <div class="min-w-0 flex-1 pt-8 sm:pt-7">
                  ${skeletonBlock(name)}
                  <div class="mt-4 flex items-end justify-between gap-4 border-t border-zinc-200/70 pt-3 dark:border-white/10">
                    ${skeletonBlock('h-8 w-16 rounded-lg')}
                    <div class="flex items-center gap-2">
                      ${skeletonBlock(time)}
                      ${skeletonBlock('h-6 w-6 rounded-md')}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          `;
        })
        .join('')}
    </div>
  `;
}

function categoryChipsSkeletonHtml(count = 2) {
  return Array.from({ length: count })
    .map(() => `
      <div class="rounded-lg border border-zinc-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-zinc-900/50">
        <div class="flex items-center justify-between gap-2">
          ${skeletonBlock('h-4 w-20')}
          ${skeletonBlock('h-1.5 w-1.5 rounded-full')}
        </div>
        ${skeletonBlock('mt-2 h-3 w-28')}
      </div>
    `)
    .join('');
}

function activeCyclesSkeletonHtml(count = 2) {
  return Array.from({ length: count })
    .map(() => `
      <article class="relative min-h-[132px] overflow-hidden rounded-lg border border-zinc-200/80 bg-white/70 p-3 dark:border-white/10 dark:bg-zinc-900/50">
        <div aria-hidden="true" class="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(228,228,231,.95),rgba(244,244,245,.72),rgba(212,212,216,.9))] dark:bg-[linear-gradient(110deg,rgba(39,39,42,.95),rgba(63,63,70,.55),rgba(24,24,27,.95))]"></div>
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/95 via-white/78 to-white/48 dark:from-zinc-950/95 dark:via-zinc-950/70 dark:to-zinc-950/38"></div>
        <div class="relative z-10 flex items-start justify-between gap-2">
          <div class="min-w-0">
            ${skeletonBlock('h-4 w-20')}
            ${skeletonBlock('mt-2 h-3 w-28')}
          </div>
        </div>
        <div class="relative z-10 mt-5 flex items-end justify-between gap-3">
          <div class="min-w-0 flex-1">
            ${skeletonBlock('h-6 w-40')}
            ${skeletonBlock('mt-2 h-7 w-20 rounded-md')}
          </div>
          <div class="grid shrink-0 gap-1.5">
            ${skeletonBlock('h-8 w-28 rounded-lg')}
            ${skeletonBlock('h-8 w-28 rounded-lg')}
          </div>
        </div>
      </article>
    `)
    .join('');
}

function setUrlSection(section) {
  const url = new URL(window.location);
  url.searchParams.set('section', section);
  history.replaceState(null, '', url);
}

function initTournamentTabs() {
  const tabsContainer = $('#tournamentTabs');
  const highlight = $('#tournamentTabsHighlight');
  if (!tabsContainer || !highlight) return null;

  const buttons = Array.from(tabsContainer.querySelectorAll('.tab-btn'));
  if (!buttons.length) return null;

  Object.assign(highlight.style, {
    position: 'absolute',
    top: '2px',
    bottom: '2px',
    left: '0',
    width: '0',
    borderRadius: '0.625rem',
    background: 'rgba(255,255,255,.92)',
    boxShadow: '0 1px 0 rgba(255,255,255,.16), 0 10px 28px rgba(0,0,0,.18)',
    transform: 'translate3d(0,0,0)',
    transition: 'none',
    willChange: 'transform,width',
    zIndex: '0',
  });

  buttons.forEach((button) => {
    button.style.position = 'relative';
    button.style.zIndex = '1';
    button.style.transition = 'color .16s ease, background-color .16s ease';
  });

  const moveHighlightTo = (button, { animate = true } = {}) => {
    if (!button) return;
    const buttonRect = button.getBoundingClientRect();
    const containerRect = tabsContainer.getBoundingClientRect();
    const left = Math.round(buttonRect.left - containerRect.left);
    const width = Math.round(buttonRect.width);
    const transition = 'transform .28s cubic-bezier(.22,.9,.24,1), width .28s cubic-bezier(.22,.9,.24,1)';

    const apply = () => {
      highlight.style.width = `${Math.max(0, width)}px`;
      highlight.style.transform = `translate3d(${Math.max(0, left)}px,0,0)`;
    };

    if (!animate) {
      highlight.style.transition = 'none';
      apply();
      requestAnimationFrame(() => {
        highlight.style.transition = transition;
      });
      return;
    }

    highlight.style.transition = transition;
    requestAnimationFrame(apply);
  };

  const setActive = (section, { animateHighlight = true } = {}) => {
    const active = buttons.find((button) => button.dataset.section === section) || buttons[0];
    buttons.forEach((button) => {
      const isActive = button === active;
      button.classList.toggle('is-active', isActive);
      button.classList.toggle('dark:text-zinc-900', isActive);
      button.classList.toggle('dark:text-white', !isActive);
      button.classList.toggle('hover:bg-zinc-100', !isActive);
      button.classList.toggle('dark:hover:bg-white/10', !isActive);
    });
    moveHighlightTo(active, { animate: animateHighlight });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => switchSection(button.dataset.section || 'current'));
  });

  state.tabsApi = { setActive, moveHighlightTo, buttons };
  requestAnimationFrame(() => setActive(state.currentSection, { animateHighlight: false }));
  window.addEventListener('resize', () => {
    const active = buttons.find((button) => button.classList.contains('is-active')) || buttons[0];
    moveHighlightTo(active, { animate: false });
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      const active = buttons.find((button) => button.classList.contains('is-active')) || buttons[0];
      moveHighlightTo(active, { animate: false });
    });
  }

  return state.tabsApi;
}

function switchSection(section, { updateUrl = true } = {}) {
  const normalized = ['current', 'leaderboard', 'history'].includes(section) ? section : 'current';
  state.currentSection = normalized;

  $('#panel-tournament-current')?.classList.toggle('hidden', normalized !== 'current');
  $('#panel-tournament-leaderboard')?.classList.toggle('hidden', normalized !== 'leaderboard');
  $('#panel-tournament-history')?.classList.toggle('hidden', normalized !== 'history');
  state.tabsApi?.setActive(normalized, { animateHighlight: true });

  if (updateUrl) setUrlSection(normalized);
  if (normalized === 'leaderboard') void renderLeaderboard({ silent: true });
  if (normalized === 'history') void renderArchives({ silent: true });
}

function renderEdition() {
  if (!state.edition) {
    setText('tournamentEditionWindow', t('empty.no_active_edition', 'No active edition.'));
    setText('tournamentCountdown', '00:00:00');
    return;
  }

  const start = formatDate(state.edition.started_at);
  const end = formatDate(state.edition.ends_at);
  setText('tournamentEditionWindow', `${start} - ${end}`);
  tickCountdown();
}

function renderActiveCyclesLoadingSkeleton() {
  const root = $('#tournamentActiveCycles');
  if (!root) return;
  const count = Math.max(2, Math.min(state.categories.length || 2, 4));
  root.innerHTML = activeCyclesSkeletonHtml(count);
}

function renderTopFiveLoadingSkeleton() {
  const root = $('#tournamentTopFive');
  const meta = $('#tournamentTopMeta');
  if (meta) meta.innerHTML = skeletonBlock('h-4 w-64 max-w-full');
  if (root) root.innerHTML = topFiveSkeletonHtml();
}

function renderCurrentLoadingSkeletons() {
  const edition = $('#tournamentEditionWindow');
  const countdown = $('#tournamentCountdown');
  const chips = $('#tournamentCategoryChips');

  if (edition) edition.innerHTML = skeletonBlock('h-5 w-56 max-w-full');
  if (countdown) countdown.innerHTML = skeletonBlock('h-6 w-28');
  if (chips) chips.innerHTML = categoryChipsSkeletonHtml(2);

  renderActiveCyclesLoadingSkeleton();
  renderTopFiveLoadingSkeleton();
}

function renderInitialLoadingSkeletons() {
  renderCurrentLoadingSkeletons();

  const leaderboardRows = $('#tournamentLeaderboardRows');
  const leaderboardMeta = $('#tournamentLeaderboardMeta');
  const archiveRows = $('#tournamentArchiveRows');
  const archiveMeta = $('#tournamentArchiveMeta');
  renderLeaderboardMapBannerSkeleton();
  if (leaderboardRows) leaderboardRows.innerHTML = leaderboardTableSkeletonRows(7);
  if (leaderboardMeta) leaderboardMeta.innerHTML = skeletonBlock('h-3 w-36');
  if (archiveRows) archiveRows.innerHTML = archiveTableSkeletonRows(7);
  updateArchiveControls(0, null);
  if (archiveMeta) archiveMeta.innerHTML = skeletonBlock('h-3 w-24');
}

function closeTournamentSelects(except = null) {
  document.querySelectorAll('[data-tournament-select]').forEach((root) => {
    if (root === except) return;
    root.querySelector('[data-select-menu]')?.classList.add('hidden');
    root.querySelector('[data-select-button]')?.setAttribute('aria-expanded', 'false');
  });
}

function renderSelectOptions(root) {
  if (!root) return;
  const label = root.querySelector('[data-select-label]');
  const menu = root.querySelector('[data-select-menu]');
  if (!label || !menu) return;

  if (!state.categories.length) {
    root.dataset.value = '';
    label.textContent = t('empty.loading', 'Loading tournaments...');
    menu.innerHTML = '';
    return;
  }

  const selected = state.categories.find((category) => String(category.id) === String(state.selectedCategoryId)) || state.categories[0];
  root.dataset.value = String(selected.id);
  label.textContent = selected.name || `#${selected.id}`;

  menu.innerHTML = state.categories
    .map(
      (category) => {
        const isSelected = String(category.id) === String(state.selectedCategoryId);
        return `
          <button
            type="button"
            data-select-option="${esc(category.id)}"
            class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
              isSelected
                ? 'bg-emerald-500/10 font-semibold text-emerald-800 dark:text-emerald-200'
                : 'text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-white/10'
            }"
          >
            <span class="truncate">${esc(category.name)}</span>
            ${isSelected ? '<span class="h-2 w-2 rounded-full bg-emerald-500"></span>' : ''}
          </button>
        `;
      }
    )
    .join('');
}

function renderCategories() {
  const chips = $('#tournamentCategoryChips');
  const selects = [
    $('#tournamentCategorySelect'),
    $('#tournamentLeaderboardCategorySelect'),
    $('#tournamentArchiveCategorySelect'),
  ];

  if (!state.categories.length) {
    selects.forEach(renderSelectOptions);
    if (chips) {
      chips.innerHTML = `<span class="text-sm text-zinc-500 dark:text-zinc-400">${esc(t('messages.request_failed', 'Unable to load tournament data.'))}</span>`;
    }
    return;
  }

  if (!state.selectedCategoryId || !state.categories.some((item) => String(item.id) === String(state.selectedCategoryId))) {
    state.selectedCategoryId = String(state.categories[0].id);
  }

  selects.forEach(renderSelectOptions);

  if (!chips) return;
  chips.innerHTML = state.categories
    .map((category) => {
      const difficulties = normalizeStringList(category.difficulties).join(', ');
      const selected = String(category.id) === String(state.selectedCategoryId);
      return `
        <button
          type="button"
          data-category-id="${esc(category.id)}"
          class="group w-full cursor-pointer rounded-lg border px-3 py-2 text-left text-xs transition lg:w-auto lg:min-w-36 ${
            selected
              ? 'border-emerald-500/40 bg-emerald-500/10 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.12)]'
              : 'border-zinc-200/80 bg-white/70 hover:border-zinc-300 hover:bg-white dark:border-white/10 dark:bg-zinc-900/50 dark:hover:bg-white/10'
          }"
        >
          <span class="flex items-center justify-between gap-2">
            <span class="truncate font-black">${esc(category.name)}</span>
            ${selected ? '<span class="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"></span>' : ''}
          </span>
          <span class="mt-0.5 block truncate text-[11px] text-zinc-500 dark:text-zinc-400">${esc(difficulties || '...')}</span>
        </button>
      `;
    })
    .join('');
}

function renderActiveCycles() {
  const root = $('#tournamentActiveCycles');
  if (!root) return;

  if (!state.categories.length) {
    root.innerHTML = `<div class="rounded-lg border border-zinc-200/80 bg-white/70 p-3 text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-400">${esc(t('empty.loading', 'Loading tournaments...'))}</div>`;
    return;
  }

  root.innerHTML = state.categories
    .map((category) => {
      const cycle = state.activeCycles.get(String(category.id));
      const isSelected = String(category.id) === String(state.selectedCategoryId);
      const categoryDifficulties = difficultyListHtml(category.difficulties, 'font-black');
      const cardTone = isSelected
        ? 'border-emerald-500/40 bg-emerald-500/10 ring-1 ring-emerald-400/20'
        : 'border-zinc-200/80 bg-white/70 dark:border-white/10 dark:bg-zinc-900/50';

      if (!cycle) {
        return `
          <article class="min-h-[112px] rounded-lg border ${cardTone} p-3">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <h3 class="truncate text-sm font-black">${esc(category.name)}</h3>
                <p class="mt-0.5 truncate text-[11px]">${categoryDifficulties || '<span class="text-zinc-500 dark:text-zinc-400">...</span>'}</p>
              </div>
            </div>
            <div class="mt-3 rounded-lg border border-dashed border-zinc-300/80 px-3 py-2 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400">
              ${esc(t('empty.no_active_cycle', 'No active cycle for this category.'))}
            </div>
          </article>
        `;
      }

      return `
        <article data-map-banner-host class="relative min-h-[132px] overflow-hidden rounded-lg border ${cardTone} p-3">
          ${mapBannerPlaceholderHtml()}
          ${mapBannerImageHtml(cycle.map_name, 'pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45 saturate-[0.9] dark:opacity-35')}
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/95 via-white/78 to-white/48 dark:from-zinc-950/95 dark:via-zinc-950/70 dark:to-zinc-950/38"></div>
          <div class="relative z-10 flex items-start justify-between gap-2">
            <div class="min-w-0">
              <h3 class="truncate text-sm font-black">${esc(category.name)}</h3>
              <p class="mt-0.5 truncate text-[11px]">${difficultyLabelHtml(cycle.map_difficulty, 'font-black') || categoryDifficulties || '<span class="text-zinc-500 dark:text-zinc-400">...</span>'}</p>
            </div>
          </div>
          <div class="relative z-10 mt-5 flex items-end justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="truncate text-lg font-black leading-tight">${esc(cycle.map_name || t('labels.unknown_map', 'Unknown map'))}</div>
              <button
                type="button"
                data-copy-map-code="${esc(cycle.map_code || '')}"
                class="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-200/80 bg-zinc-950 px-2 py-1 font-mono text-xs font-black text-white transition hover:bg-zinc-800 dark:border-white/10 dark:bg-black/50 dark:hover:bg-black/70"
                title="${esc(t('buttons.copy_code', 'Copy map code'))}"
              >
                <span>${esc(cycle.map_code || '...')}</span>
                <svg class="h-3.5 w-3.5 opacity-75" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>
            <div class="grid shrink-0 gap-1.5">
              <button
                type="button"
                data-view-map="${esc(category.id)}"
                class="cursor-pointer rounded-lg border border-zinc-200/80 bg-white/90 px-3 py-1.5 text-xs font-black text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                ${esc(t('buttons.view_map', 'View map'))}
              </button>
              <button
                type="button"
                data-view-leaderboard="${esc(category.id)}"
                class="cursor-pointer rounded-lg border border-zinc-200/80 bg-white/90 px-3 py-1.5 text-xs font-black text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                ${esc(t('buttons.view_leaderboard', 'View leaderboard'))}
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  bindMapBannerFallbacks(root);
}

function readAvatarCache() {
  try {
    const cache = JSON.parse(localStorage.getItem(AVATAR_CACHE_KEY) || '{}');
    return cache && typeof cache === 'object' ? cache : {};
  } catch {
    return {};
  }
}

function writeAvatarCache(cache) {
  try {
    localStorage.setItem(AVATAR_CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

function defaultAvatarForId(id) {
  const digits = String(id || '').replace(/\D/g, '');
  if (!digits) return 'https://cdn.discordapp.com/embed/avatars/0.png?size=64';
  try {
    return `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(digits) % 5n)}.png?size=64`;
  } catch {
    return `https://cdn.discordapp.com/embed/avatars/${Number(digits.slice(-1)) % 5}.png?size=64`;
  }
}

function ensureAvatarSize(url) {
  const value = String(url || '').trim();
  if (!value) return '';
  if (!value.includes('cdn.discordapp.com')) return value;
  return value.replace(/\?size=\d+$/i, '') + '?size=64';
}

async function hydrateTopAvatars(root = document) {
  const images = Array.from(root.querySelectorAll('[data-tournament-avatar][data-user-id]'));
  const ids = [...new Set(images.map((img) => String(img.dataset.userId || '').replace(/\D/g, '')).filter(Boolean))];
  if (!ids.length) return;

  const cache = readAvatarCache();
  const now = Date.now();
  const urls = {};
  const missing = [];

  ids.forEach((id) => {
    const cached = cache[id];
    const cachedAt = Number(cached?.ts || cached?.at || 0);
    if (cached?.url && cachedAt + AVATAR_CACHE_TTL > now) {
      urls[id] = cached.url;
    } else {
      missing.push(id);
    }
  });

  if (missing.length) {
    try {
      const url = new URL('/api/settings/user-avatar', window.location.origin);
      url.searchParams.set('user_id', missing.join(','));
      const response = await fetch(url.toString(), {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store',
      });
      const data = response.ok ? await response.json().catch(() => null) : null;

      missing.forEach((id) => {
        const entry = data?.[id] || (String(data?.user_id) === id ? data : null);
        const avatarUrl = ensureAvatarSize(entry?.avatar_url) || defaultAvatarForId(id);
        urls[id] = avatarUrl;
        cache[id] = { url: avatarUrl, ts: now };
      });

      writeAvatarCache(cache);
    } catch {
      missing.forEach((id) => {
        urls[id] = defaultAvatarForId(id);
      });
    }
  }

  images.forEach((img) => {
    const id = String(img.dataset.userId || '').replace(/\D/g, '');
    img.src = urls[id] || defaultAvatarForId(id);
  });
}

function podiumSkin(rank) {
  if (Number(rank) === 1) {
    return {
      card: 'border-amber-500/80 bg-amber-300/25 shadow-[0_0_42px_rgba(217,119,6,0.26)] dark:border-amber-400/50 dark:bg-amber-500/10 dark:shadow-[0_0_40px_rgba(245,158,11,0.22)]',
      badge: 'border-amber-500/70 bg-amber-300/50 text-amber-950 dark:border-amber-300/60 dark:bg-amber-300/20 dark:text-amber-100',
      avatar: 'ring-amber-500/70 dark:ring-amber-300/60',
      time: 'text-amber-800 dark:text-amber-200',
      size: 'top',
    };
  }
  if (Number(rank) === 2) {
    return {
      card: 'border-slate-400/80 bg-slate-300/35 shadow-[0_0_32px_rgba(71,85,105,0.20)] dark:border-slate-300/60 dark:bg-slate-400/10 dark:shadow-[0_0_30px_rgba(148,163,184,0.18)]',
      badge: 'border-slate-400/80 bg-slate-200/80 text-slate-950 dark:border-slate-300/70 dark:bg-slate-300/20 dark:text-slate-100',
      avatar: 'ring-slate-400/80 dark:ring-slate-300/60',
      time: 'text-slate-800 dark:text-slate-200',
      size: 'mid',
    };
  }
  if (Number(rank) === 3) {
    return {
      card: 'border-orange-500/75 bg-orange-300/25 shadow-[0_0_32px_rgba(194,65,12,0.22)] dark:border-orange-400/50 dark:bg-orange-500/10 dark:shadow-[0_0_30px_rgba(249,115,22,0.18)]',
      badge: 'border-orange-500/70 bg-orange-300/45 text-orange-950 dark:border-orange-300/60 dark:bg-orange-300/20 dark:text-orange-100',
      avatar: 'ring-orange-500/70 dark:ring-orange-300/60',
      time: 'text-orange-800 dark:text-orange-200',
      size: 'mid',
    };
  }
  return {
    card: 'border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_24px_rgba(34,211,238,0.10)]',
    badge: 'border-cyan-300/50 bg-cyan-300/15 text-cyan-800 dark:text-cyan-100',
    avatar: 'ring-cyan-300/50',
    time: 'text-cyan-700 dark:text-cyan-200',
    size: 'small',
  };
}

function rankMedal(rank, size = 'h-5 w-5') {
  const medalUrl = MEDAL_URLS[Number(rank)] || '';
  if (!medalUrl) return '';

  return `
    <img
      src="${esc(medalUrl)}"
      alt=""
      class="${size} shrink-0 object-contain drop-shadow-[0_2px_5px_rgba(0,0,0,0.25)]"
      loading="lazy"
      decoding="async"
    />
  `;
}

function rankWithMedal(rank) {
  const value = rank ?? '-';
  return `
    <span class="inline-flex items-center gap-2 font-mono font-black tabular-nums">
      <span>${esc(value)}</span>
      ${rankMedal(value)}
    </span>
  `;
}

function rankOrdinal(rank) {
  const value = Number(rank);
  if (!Number.isFinite(value)) return String(rank ?? '-');
  const suffix = value % 100 >= 11 && value % 100 <= 13
    ? 'th'
    : ({ 1: 'st', 2: 'nd', 3: 'rd' }[value % 10] || 'th');
  return `${value}${suffix}`;
}

function isTruthyFlag(value) {
  if (typeof value === 'string') {
    return ['1', 'true', 'yes', 'full', 'complete', 'completed'].includes(value.toLowerCase());
  }
  return value === true || value === 1;
}

function isFullVerification(entry) {
  return isTruthyFlag(entry?.completion ?? entry?.completed ?? entry?.is_completion ?? entry?.is_full_completion);
}

function verificationIconHtml(entry, size = 'h-5 w-5') {
  if (!entry || !Object.prototype.hasOwnProperty.call(entry, 'verified')) return '';

  const full = isFullVerification(entry);
  const verified = isTruthyFlag(entry.verified);
  const label = verified
    ? full
      ? t('labels.full_verification', 'Full verification')
      : t('labels.partial_verification', 'Partial verification')
    : full
      ? t('labels.pending_full_verification', 'Pending full verification')
      : t('labels.pending_partial_verification', 'Pending partial verification');
  const src = verified
    ? full
      ? VERIFICATION_ICONS.full
      : VERIFICATION_ICONS.partial
    : full
      ? VERIFICATION_ICONS.pendingFull
      : VERIFICATION_ICONS.pendingPartial;

  return `
    <img
      src="${esc(src)}"
      alt="${esc(label)}"
      title="${esc(label)}"
      class="${size} shrink-0 object-contain"
      loading="lazy"
      decoding="async"
    />
  `;
}

function timeWithVerification(entry) {
  return `
    <span class="inline-flex items-center gap-2 font-mono font-black tabular-nums">
      <span>${esc(formatTime(entry.time))}</span>
      ${verificationIconHtml(entry)}
    </span>
  `;
}

function normalizeStreakValue(data) {
  const value = Number(data?.current_streak ?? data?.current ?? data?.streak ?? data ?? 0);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function streakBadgeHtml(value, { loading = false } = {}) {
  const label = loading ? '--' : String(normalizeStreakValue(value));
  return `
    <span class="inline-flex min-w-[3.5rem] items-center justify-center gap-1.5 rounded-lg border border-orange-300/40 bg-orange-500/10 px-2.5 py-1 font-mono text-sm font-black tabular-nums text-orange-700 dark:border-orange-300/30 dark:bg-orange-400/10 dark:text-orange-200">
      <span>${esc(label)}</span>
      <span aria-hidden="true" class="text-base leading-none">🔥</span>
    </span>
  `;
}

function leaderboardStreakCell(entry) {
  const userId = String(entry.user_id || '').replace(/\D/g, '');
  if (!userId) return streakBadgeHtml(0);
  const cached = state.streakCache.get(userId);
  return `
    <span data-tournament-streak data-user-id="${esc(userId)}">
      ${streakBadgeHtml(cached, { loading: cached == null })}
    </span>
  `;
}

async function hydrateLeaderboardStreaks(root = document) {
  const nodes = Array.from(root.querySelectorAll('[data-tournament-streak][data-user-id]'));
  const ids = [...new Set(nodes.map((node) => String(node.dataset.userId || '').replace(/\D/g, '')).filter(Boolean))];
  if (!ids.length) return;

  nodes.forEach((node) => {
    const cached = state.streakCache.get(String(node.dataset.userId || ''));
    if (cached != null) node.innerHTML = streakBadgeHtml(cached);
  });

  const missing = ids.filter((id) => !state.streakCache.has(id));
  if (!missing.length) return;

  await Promise.all(
    missing.map(async (id) => {
      const response = await api(`/streaks/${encodeURIComponent(id)}`);
      state.streakCache.set(id, response.ok && response.data ? response.data : { current_streak: 0 });
    })
  );

  nodes.forEach((node) => {
    const id = String(node.dataset.userId || '').replace(/\D/g, '');
    node.innerHTML = streakBadgeHtml(state.streakCache.get(id));
  });
}

function playerLeaderboardCell(entry, { showUserId = false } = {}) {
  const userId = String(entry.user_id || '');
  const name = entry.name || userId || 'Unknown';

  return `
    <a
      class="group inline-flex max-w-[18rem] items-center gap-3 font-semibold transition hover:text-emerald-600 dark:hover:text-emerald-300"
      href="/rank_card?user_id=${encodeURIComponent(userId)}"
    >
      <span class="h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-zinc-200/80 bg-zinc-100 ring-1 ring-black/5 dark:border-white/10 dark:bg-zinc-900 dark:ring-white/10">
        <img
          src="${esc(defaultAvatarForId(userId))}"
          alt="${esc(name)}"
          width="32"
          height="32"
          class="h-full w-full object-cover"
          decoding="async"
          data-tournament-avatar
          data-user-id="${esc(userId)}"
        />
      </span>
      <span class="min-w-0">
        <span class="block truncate">${esc(name)}</span>
        ${showUserId ? `<span class="mt-0.5 block truncate font-mono text-[11px] font-normal text-zinc-500 dark:text-zinc-400">${esc(userId)}</span>` : ''}
      </span>
    </a>
  `;
}

function archiveWinnerCell(cycle) {
  const userId = String(cycle.winner_user_id || '');
  if (!userId) return '-';

  const name = cycle.winner_name || userId;
  return `
    <a
      class="group inline-flex max-w-[18rem] items-center gap-3 font-semibold transition hover:text-emerald-600 dark:hover:text-emerald-300"
      href="/rank_card?user_id=${encodeURIComponent(userId)}"
    >
      <span class="h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-zinc-200/80 bg-zinc-100 ring-1 ring-black/5 dark:border-white/10 dark:bg-zinc-900 dark:ring-white/10">
        <img
          src="${esc(defaultAvatarForId(userId))}"
          alt="${esc(name)}"
          width="32"
          height="32"
          class="h-full w-full object-cover"
          decoding="async"
          data-tournament-avatar
          data-user-id="${esc(userId)}"
        />
      </span>
      <span class="min-w-0 truncate">${esc(name)}</span>
    </a>
  `;
}

function archiveMapCell(cycle) {
  const mapName = cycle.map_name || t('labels.unknown_map', 'Unknown map');
  const mapCode = cycle.map_code || '';
  const difficulty = difficultyLabelHtml(cycle.map_difficulty, 'font-black');

  return `
    <div class="flex min-w-[230px] items-center gap-3">
      <div data-map-banner-host class="relative h-14 w-28 shrink-0 overflow-hidden rounded-lg border border-zinc-200/80 bg-zinc-100 shadow-sm ring-1 ring-black/5 dark:border-white/10 dark:bg-zinc-900 dark:ring-white/10">
        ${mapBannerPlaceholderHtml()}
        ${mapBannerImageHtml(mapName, 'h-full w-full object-cover')}
      </div>
      <div class="min-w-0">
        <div class="truncate font-semibold">${esc(mapName)}</div>
        <div class="mt-0.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">${esc(mapCode || '-')}</div>
        ${difficulty ? `<div class="mt-0.5 truncate text-xs">${difficulty}</div>` : ''}
      </div>
    </div>
  `;
}

function topCard(entry, index) {
  const rank = Number(entry.rank || index + 1);
  const skin = podiumSkin(rank);
  const userId = entry.user_id || '';
  const name = entry.name || userId || 'Unknown';
  const sizeClasses =
    skin.size === 'top'
      ? 'min-h-[178px] p-5 sm:p-6'
      : skin.size === 'mid'
        ? 'min-h-[150px] p-4 sm:p-5'
        : 'min-h-[124px] p-4';
  const avatarSize = skin.size === 'top' ? 'h-24 w-24 sm:h-28 sm:w-28' : skin.size === 'mid' ? 'h-20 w-20' : 'h-16 w-16';
  const titleSize = skin.size === 'top' ? 'text-2xl sm:text-4xl' : skin.size === 'mid' ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl';
  const timeSize = skin.size === 'top' ? 'text-2xl sm:text-4xl' : skin.size === 'mid' ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl';
  const colSpan = skin.size === 'top' ? 'lg:col-span-12' : 'lg:col-span-6';
  const medalUrl = MEDAL_URLS[rank] || '';
  const medalSize = skin.size === 'top' ? 'h-6 w-6' : 'h-5 w-5';

  return `
    <article class="${colSpan} relative overflow-hidden rounded-2xl border ${skin.card} ${sizeClasses}">
      <div class="absolute right-4 top-4 inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-xs font-black uppercase tracking-wide ${skin.badge}">
        ${medalUrl ? `<img src="${esc(medalUrl)}" alt="" class="${medalSize} object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)]" loading="lazy" decoding="async" />` : ''}
        ${esc(rankOrdinal(rank))}
      </div>
      <div class="flex h-full items-center gap-4 sm:gap-5">
        <a
          href="/rank_card?user_id=${encodeURIComponent(userId)}"
          class="${avatarSize} shrink-0 overflow-hidden rounded-2xl bg-white/70 ring-2 ${skin.avatar} dark:bg-zinc-950/60"
          aria-label="${esc(name)}"
        >
          <img
            src="${esc(defaultAvatarForId(userId))}"
            alt="${esc(name)}"
            width="112"
            height="112"
            class="h-full w-full object-cover"
            decoding="async"
            data-tournament-avatar
            data-user-id="${esc(userId)}"
          />
        </a>
        <div class="min-w-0 flex-1 pt-8 sm:pt-7">
          <a
            href="/rank_card?user_id=${encodeURIComponent(userId)}"
            class="block truncate ${titleSize} font-black uppercase leading-none tracking-normal hover:text-emerald-500"
          >
            ${esc(name)}
          </a>
          <div class="mt-4 flex items-end justify-between gap-4 border-t border-zinc-200/70 pt-3 dark:border-white/10">
            <span class="sr-only">${esc(t('table.time', 'Time'))}</span>
            <span>${leaderboardStreakCell(entry)}</span>
            <span class="inline-flex items-center justify-end gap-2 ${timeSize} text-right font-black leading-none tabular-nums ${skin.time}">
              <span>${esc(formatTime(entry.time))}</span>
              ${verificationIconHtml(entry, skin.size === 'top' ? 'h-7 w-7' : skin.size === 'mid' ? 'h-6 w-6' : 'h-5 w-5')}
            </span>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderTopFive() {
  const root = $('#tournamentTopFive');
  const meta = $('#tournamentTopMeta');
  if (!root) return;

  const cycle = selectedCycle();
  if (!cycle) {
    if (meta) meta.textContent = '';
    root.innerHTML = `<div class="rounded-2xl border border-zinc-200/80 bg-zinc-100 p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">${esc(t('empty.no_active_cycle', 'No active cycle for this category.'))}</div>`;
    return;
  }

  if (meta) {
    const details = [categoryName(cycle.category_id || state.selectedCategoryId), cycle.map_name, cycle.map_code ? `#${cycle.map_code}` : ''].filter(Boolean);
    meta.textContent = details.join(' / ');
  }

  if (state.leaderboardLoading) {
    root.innerHTML = topFiveSkeletonHtml();
    return;
  }

  const entries = [...state.leaderboardEntries]
    .sort((a, b) => Number(a.rank || 9999) - Number(b.rank || 9999))
    .slice(0, 5);

  if (!entries.length) {
    root.innerHTML = `<div class="rounded-2xl border border-zinc-200/80 bg-zinc-100 p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">${esc(t('empty.no_top', 'No player has entered this tournament yet.'))}</div>`;
    return;
  }

  root.innerHTML = `<div class="grid gap-4 lg:grid-cols-12">${entries.map(topCard).join('')}</div>`;
  void hydrateTopAvatars(root);
  void hydrateLeaderboardStreaks(root);
}

async function renderLeaderboard({ silent = false } = {}) {
  const rows = $('#tournamentLeaderboardRows');
  const meta = $('#tournamentLeaderboardMeta');
  if (!rows) return;

  if (!state.hasLoaded && !state.categories.length) {
    if (meta) meta.innerHTML = skeletonBlock('h-3 w-36');
    renderLeaderboardMapBannerSkeleton();
    rows.innerHTML = leaderboardTableSkeletonRows(7);
    renderTopFiveLoadingSkeleton();
    return;
  }

  const cycle = selectedCycle();
  if (!cycle) {
    state.leaderboardEntries = [];
    state.leaderboardCycleId = null;
    rows.innerHTML = `<tr><td colspan="4" class="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">${esc(t('messages.select_category', 'Select a category to view its leaderboard.'))}</td></tr>`;
    if (meta) meta.textContent = '';
    renderLeaderboardMapBanner(null);
    renderTopFive();
    return;
  }

  const requestSeq = ++state.leaderboardRequestSeq;
  const canKeepExisting =
    silent &&
    String(state.leaderboardCycleId || '') === String(cycle.id) &&
    rows.children.length > 0;

  state.leaderboardLoading = !canKeepExisting;
  if (meta) meta.textContent = `${cycle.map_code || ''} / ${cycle.map_name || ''}`;
  renderLeaderboardMapBanner(cycle);
  if (!canKeepExisting) {
    rows.innerHTML = leaderboardTableSkeletonRows(7);
  }
  renderTopFive();

  const response = await api(`/cycles/${encodeURIComponent(cycle.id)}/leaderboard`);
  if (requestSeq !== state.leaderboardRequestSeq) return;

  state.leaderboardLoading = false;
  state.leaderboardCycleId = cycle.id;

  if (!response.ok || !Array.isArray(response.data) || !response.data.length) {
    if (!response.ok && canKeepExisting) {
      return;
    }
    if (silent && canKeepExisting && state.leaderboardHash === '[]') {
      return;
    }
    state.leaderboardEntries = [];
    state.leaderboardHash = '[]';
    rows.innerHTML = `<tr><td colspan="4" class="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">${esc(t('empty.no_leaderboard', 'No leaderboard entries yet.'))}</td></tr>`;
    renderTopFive();
    return;
  }

  const nextHash = JSON.stringify(response.data);
  if (silent && canKeepExisting && nextHash === state.leaderboardHash) {
    return;
  }

  state.leaderboardEntries = response.data;
  state.leaderboardHash = nextHash;
  rows.innerHTML = response.data
    .map(
      (entry) => `
        <tr class="border-t border-zinc-200/80 transition hover:bg-zinc-50/80 dark:border-white/10 dark:hover:bg-white/[0.03]">
          <td class="px-4 py-3">${rankWithMedal(entry.rank)}</td>
          <td class="px-4 py-3">${playerLeaderboardCell(entry)}</td>
          <td class="px-4 py-3">${timeWithVerification(entry)}</td>
          <td class="px-4 py-3">${leaderboardStreakCell(entry)}</td>
        </tr>
      `
    )
    .join('');

  void hydrateTopAvatars(rows);
  void hydrateLeaderboardStreaks(rows);
  renderTopFive();
}

async function renderArchives({ silent = false } = {}) {
  const rows = $('#tournamentArchiveRows');
  const meta = $('#tournamentArchiveMeta');
  if (!rows) return;

  if (!state.hasLoaded && !state.categories.length) {
    if (meta) meta.innerHTML = skeletonBlock('h-3 w-24');
    updateArchiveControls(0, null);
    rows.innerHTML = archiveTableSkeletonRows(7);
    return;
  }

  const requestSeq = ++state.archiveRequestSeq;
  const archiveKey = `${state.selectedCategoryId || ''}:${state.archiveOffset}`;
  const canKeepExisting = silent && state.archiveKey === archiveKey && rows.children.length > 0;
  if (!canKeepExisting) {
    rows.innerHTML = archiveTableSkeletonRows(7);
  }

  const response = await api('/cycles', {
    status: 'completed',
    category_id: state.selectedCategoryId,
    limit: ARCHIVE_LIMIT,
    offset: state.archiveOffset,
  });

  if (requestSeq !== state.archiveRequestSeq) return;

  const cycles = Array.isArray(response.data?.cycles) ? response.data.cycles : [];
  const total = Number(response.data?.total || 0);

  if (!response.ok || !cycles.length) {
    if (!response.ok && canKeepExisting) return;
    if (silent && canKeepExisting && state.archiveHash === '[]') return;
    state.archiveCycles = [];
    state.archiveKey = archiveKey;
    state.archiveHash = '[]';
    state.archiveTotal = total;
    rows.innerHTML = `<tr><td colspan="5" class="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">${esc(t('empty.no_archives', 'No completed cycles yet.'))}</td></tr>`;
  } else {
    const nextHash = JSON.stringify(cycles);
    if (silent && canKeepExisting && nextHash === state.archiveHash) {
      state.archiveTotal = total;
      updateArchiveControls(total, meta);
      return;
    }

    state.archiveCycles = cycles;
    state.archiveKey = archiveKey;
    state.archiveHash = nextHash;
    state.archiveTotal = total;
    rows.innerHTML = cycles
      .map(
        (cycle) => `
          <tr class="border-t border-zinc-200/80 transition hover:bg-zinc-50/80 dark:border-white/10 dark:hover:bg-white/[0.03]">
            <td class="px-4 py-3">${archiveMapCell(cycle)}</td>
            <td class="px-4 py-3">${esc(categoryName(cycle.category_id))}</td>
            <td class="px-4 py-3">${archiveWinnerCell(cycle)}</td>
            <td class="px-4 py-3">${esc(formatDate(cycle.ended_at))}</td>
            <td class="px-4 py-3 text-right">
              <button
                type="button"
                data-view-cycle="${esc(cycle.id)}"
                class="cursor-pointer rounded-lg border border-zinc-200/80 bg-white/80 px-3 py-1.5 text-xs font-semibold text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                ${esc(t('buttons.view', 'View'))}
              </button>
            </td>
          </tr>
        `
      )
      .join('');
  }

  updateArchiveControls(total, meta);
  bindMapBannerFallbacks(rows);
  void hydrateTopAvatars(rows);
}

function findArchiveCycle(cycleId) {
  return state.archiveCycles.find((cycle) => String(cycle.id) === String(cycleId)) || null;
}

function closeHistoryModal() {
  $('#tournamentHistoryModal')?.classList.add('hidden');
}

function updateArchiveControls(total, meta = $('#tournamentArchiveMeta')) {
  const numericTotal = Math.max(0, Number(total) || 0);
  const totalPages = Math.ceil(numericTotal / ARCHIVE_LIMIT);
  const currentPage = totalPages
    ? Math.min(totalPages - 1, Math.max(0, Math.floor(state.archiveOffset / ARCHIVE_LIMIT)))
    : 0;

  if (meta) {
    const start = numericTotal ? currentPage * ARCHIVE_LIMIT + 1 : 0;
    const end = Math.min((currentPage + 1) * ARCHIVE_LIMIT, numericTotal);
    meta.textContent = numericTotal ? `${start}-${end} ${t('labels.range_of', 'of')} ${numericTotal}` : '';
  }

  const prev = $('#tournamentArchivePrev');
  const next = $('#tournamentArchiveNext');
  if (prev) prev.disabled = totalPages <= 1 || currentPage <= 0;
  if (next) next.disabled = totalPages <= 1 || currentPage >= totalPages - 1;

  const pages = $('#tournamentArchivePages');
  if (!pages) return;

  if (totalPages <= 1) {
    pages.classList.add('hidden');
    pages.classList.remove('flex');
    pages.innerHTML = '';
    return;
  }

  const visible = 5;
  let startPage = Math.max(0, currentPage - Math.floor(visible / 2));
  let endPage = Math.min(totalPages, startPage + visible);
  startPage = Math.max(0, endPage - visible);

  pages.classList.remove('hidden');
  pages.classList.add('flex');
  pages.innerHTML = Array.from({ length: endPage - startPage })
    .map((_, index) => {
      const page = startPage + index;
      const isActive = page === currentPage;
      const classes = isActive
        ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-950'
        : 'border-zinc-200/80 bg-white/70 text-zinc-700 hover:bg-white dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-200 dark:hover:bg-white/10';

      return `
        <button
          type="button"
          data-archive-page="${page}"
          class="h-9 min-w-9 cursor-pointer rounded-lg border px-3 text-sm font-black tabular-nums transition ${classes}"
          ${isActive ? 'aria-current="page"' : ''}
        >
          ${page + 1}
        </button>
      `;
    })
    .join('');
}

async function openHistoryModal(cycleId) {
  const modal = $('#tournamentHistoryModal');
  const rows = $('#tournamentHistoryModalRows');
  const title = $('#tournamentHistoryModalTitle');
  const meta = $('#tournamentHistoryModalMeta');
  if (!modal || !rows) return;

  const cycle = findArchiveCycle(cycleId);
  if (title) title.textContent = cycle?.map_name || t('labels.participation_history', 'Participation history');
  if (meta) {
    const parts = [
      cycle?.map_code ? `#${cycle.map_code}` : '',
      cycle?.category_id ? categoryName(cycle.category_id) : '',
      cycle?.ended_at ? formatDate(cycle.ended_at) : '',
    ].filter(Boolean);
    meta.textContent = parts.join(' / ');
  }
  if (cycle) {
    renderHistoryModalBanner(cycle);
  } else {
    renderHistoryModalBannerSkeleton();
  }

  modal.classList.remove('hidden');
  rows.innerHTML = historyModalTableSkeletonRows(7);

  const requestSeq = ++state.historyRequestSeq;
  const response = await api(`/cycles/${encodeURIComponent(cycleId)}/leaderboard`);
  if (requestSeq !== state.historyRequestSeq) return;

  const entries = response.ok && Array.isArray(response.data) ? response.data : [];
  if (!entries.length) {
    rows.innerHTML = `<tr><td colspan="3" class="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">${esc(t('empty.no_participants', 'No participant details for this tournament.'))}</td></tr>`;
    return;
  }

  rows.innerHTML = entries
    .map(
      (entry) => `
        <tr class="border-t border-zinc-200/80 transition hover:bg-zinc-50/80 dark:border-white/10 dark:hover:bg-white/[0.03]">
          <td class="px-4 py-3">${rankWithMedal(entry.rank)}</td>
          <td class="px-4 py-3">${playerLeaderboardCell(entry)}</td>
          <td class="px-4 py-3">${timeWithVerification(entry)}</td>
        </tr>
      `
    )
    .join('');

  void hydrateTopAvatars(rows);
}

function tickCountdown() {
  const target = state.edition?.ends_at ? new Date(state.edition.ends_at).getTime() : NaN;
  setText('tournamentCountdown', formatCountdown(target - Date.now()));
}

function startCountdown() {
  clearInterval(state.countdownTimer);
  state.countdownTimer = setInterval(tickCountdown, 1000);
  tickCountdown();
}

async function loadActiveCycles() {
  const pairs = await Promise.all(
    state.categories.map(async (category) => {
      const response = await api('/cycles', {
        status: 'active',
        category_id: category.id,
        limit: 1,
      });
      const cycle = response.ok && Array.isArray(response.data?.cycles) ? response.data.cycles[0] : null;
      return [String(category.id), cycle || null];
    })
  );

  state.activeCycles = new Map(pairs.filter(([, cycle]) => cycle));
}

async function loadAll({ keepArchive = false, silent = false } = {}) {
  const showInitialSkeletons = !silent && !state.hasLoaded;
  if (showInitialSkeletons) renderInitialLoadingSkeletons();

  const [categories, edition] = await Promise.all([
    api('/categories'),
    api('/editions/active'),
  ]);

  state.categories = categories.ok && Array.isArray(categories.data) ? categories.data : [];
  state.edition = edition.ok ? edition.data : null;

  if (!keepArchive) state.archiveOffset = 0;

  renderEdition();
  renderCategories();
  if (showInitialSkeletons) renderActiveCyclesLoadingSkeleton();

  await loadActiveCycles();

  renderActiveCycles();
  await Promise.all([renderLeaderboard({ silent }), renderArchives({ silent })]);
  startCountdown();
  state.hasLoaded = true;
}

function handleCategoryChange(value) {
  state.selectedCategoryId = value || '';
  state.archiveOffset = 0;
  state.leaderboardEntries = [];
  state.leaderboardCycleId = null;
  state.leaderboardHash = '';
  state.archiveKey = '';
  state.archiveHash = '';
  renderCategories();
  renderActiveCycles();
  void Promise.all([renderLeaderboard(), renderArchives()]);
}

function bindCategorySelect(selector) {
  const root = $(selector);
  if (!root || root.dataset.bound === '1') return;
  root.dataset.bound = '1';

  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-select-button]');
    const option = event.target.closest('[data-select-option]');

    if (button) {
      const menu = root.querySelector('[data-select-menu]');
      const isOpening = menu?.classList.contains('hidden');
      closeTournamentSelects(root);
      menu?.classList.toggle('hidden', !isOpening);
      button.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
      return;
    }

    if (option) {
      const value = option.dataset.selectOption || '';
      closeTournamentSelects();
      handleCategoryChange(value);
    }
  });
}

function bindEvents() {
  $('#tournamentRefresh')?.addEventListener('click', () => loadAll({ keepArchive: true }));
  $('#tournamentOpenLeaderboard')?.addEventListener('click', () => switchSection('leaderboard'));

  bindCategorySelect('#tournamentCategorySelect');
  bindCategorySelect('#tournamentLeaderboardCategorySelect');
  bindCategorySelect('#tournamentArchiveCategorySelect');

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-tournament-select]')) closeTournamentSelects();
  });

  $('#tournamentCategoryChips')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category-id]');
    if (!button) return;
    handleCategoryChange(button.dataset.categoryId || '');
  });

  $('#tournamentActiveCycles')?.addEventListener('click', (event) => {
    const copyButton = event.target.closest('[data-copy-map-code]');
    if (copyButton) {
      void copyMapCode(copyButton.dataset.copyMapCode || '');
      return;
    }

    const mapButton = event.target.closest('[data-view-map]');
    if (mapButton) {
      const categoryId = mapButton.dataset.viewMap || '';
      const cycle = state.activeCycles.get(String(categoryId));
      const category = state.categories.find((item) => String(item.id) === String(categoryId)) || null;
      void openTournamentMapModal(cycle, category);
      return;
    }

    const button = event.target.closest('[data-view-leaderboard]');
    if (!button) return;
    state.selectedCategoryId = button.dataset.viewLeaderboard || '';
    state.archiveOffset = 0;
    state.leaderboardEntries = [];
    state.leaderboardCycleId = null;
    state.leaderboardHash = '';
    state.archiveKey = '';
    state.archiveHash = '';
    renderCategories();
    renderActiveCycles();
    switchSection('leaderboard');
  });

  $('#tournamentArchivePrev')?.addEventListener('click', () => {
    state.archiveOffset = Math.max(0, state.archiveOffset - ARCHIVE_LIMIT);
    void renderArchives();
  });

  $('#tournamentArchiveNext')?.addEventListener('click', () => {
    state.archiveOffset += ARCHIVE_LIMIT;
    void renderArchives();
  });

  $('#tournamentArchivePages')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-archive-page]');
    if (!button) return;
    state.archiveOffset = Math.max(0, Number(button.dataset.archivePage || 0) * ARCHIVE_LIMIT);
    void renderArchives();
  });

  $('#tournamentArchiveRows')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-view-cycle]');
    if (!button) return;
    void openHistoryModal(button.dataset.viewCycle || '');
  });

  $('#tournamentHistoryModalClose')?.addEventListener('click', closeHistoryModal);
  $('#tournamentHistoryModal')?.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) closeHistoryModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeTournamentSelects();
    if (event.key === 'Escape' && !$('#tournamentMapModalOverlay')?.classList.contains('hidden')) {
      closeTournamentMapModal();
    }
    if (event.key === 'Escape' && !$('#tournamentHistoryModal')?.classList.contains('hidden')) {
      closeHistoryModal();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void loadAll({ keepArchive: true, silent: true });
  });

  window.addEventListener('focus', () => void loadAll({ keepArchive: true, silent: true }));
}

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const rawSection = (urlParams.get('section') || '').toLowerCase();
  state.currentSection = ['current', 'leaderboard', 'history'].includes(rawSection) ? rawSection : 'current';

  initTournamentTabs();
  switchSection(state.currentSection, { updateUrl: false });
  renderInitialLoadingSkeletons();
  bindEvents();
  void loadAll();

  state.pollTimer = setInterval(() => {
    void loadAll({ keepArchive: true, silent: true });
  }, POLL_MS);
});
