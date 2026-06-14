import { cdnAsset, cdnImage } from "../utils/cdn";

/* =========================
   Endpoints
   ========================= */
const endpoints = {
  rankcard: {
    data: (userId, filter = RANK_CARD_DEFAULT_FILTER) =>
      `/api/users/${encodeURIComponent(userId)}/rank-card?filter=${encodeURIComponent(filter)}`,

    mastery: (userId) => `/api/rankcard/mastery?user_id=${encodeURIComponent(userId)}`,

    badges: {
      get: (userId) => `/api/users/${encodeURIComponent(userId)}/rank-card/badges`,
      set: (userId) => `/api/users/${encodeURIComponent(userId)}/rank-card/badges`,
    },
    background: {
      get: (userId) => `/api/users/${encodeURIComponent(userId)}/rank-card/background`,
      set: (userId) => `/api/users/${encodeURIComponent(userId)}/rank-card/background`,
    },
    avatar: {
      skin: {
        get: (userId) => `/api/users/${encodeURIComponent(userId)}/rank-card/avatar/skin`,
        set: (userId) => `/api/users/${encodeURIComponent(userId)}/rank-card/avatar/skin`,
      },
      pose: {
        get: (userId) => `/api/users/${encodeURIComponent(userId)}/rank-card/avatar/pose`,
        set: (userId) => `/api/users/${encodeURIComponent(userId)}/rank-card/avatar/pose`,
      },
    },
  },

  lootbox: { userRewards: (userId) => `/api/lootbox/users/${encodeURIComponent(userId)}/rewards` },

  profile: { discordAvatar: (userId) => `/api/settings/user-avatar?user_id=${encodeURIComponent(userId)}`, },

  autocomplete: { users: (q) => `/api/autocomplete/users?value=${encodeURIComponent(q)}` },
};

/* =========================
   CONFIG & UTILS
   ========================= */
const MEDAL_ICON = {
  gold: cdnAsset('assets/medals/gold.png'),
  silver: cdnAsset('assets/medals/silver.png'),
  bronze: cdnAsset('assets/medals/bronze.png'),
};

const SKILL_TIER_NAMES = [
  'Unranked',
  'Bronze',
  'Silver',
  'Gold',
  'Emerald',
  'Diamond',
  'Ascendant',
  'Elite',
  'Champion',
];

function normalizeSkillTier(data) {
  const supplied = String(data?.skill_tier_name ?? '').trim();
  const matchedTier = SKILL_TIER_NAMES.find(
    (tierName) => tierName.toLowerCase() === supplied.toLowerCase()
  );
  if (matchedTier) return matchedTier;

  const tier = Number(data?.skill_tier ?? 0);
  return SKILL_TIER_NAMES[Number.isInteger(tier) && tier >= 0 && tier <= 8 ? tier : 0];
}

function masteryBadgePillClass(level) {
  const styles = {
    rookie: 'bg-emerald-600/85 text-emerald-50 ring-emerald-300/40',
    explorer: 'bg-sky-600/85 text-sky-50 ring-sky-300/40',
    trailblazer: 'bg-orange-600/85 text-orange-50 ring-orange-300/40',
    pathfinder: 'bg-violet-600/85 text-violet-50 ring-violet-300/40',
    prodigy: 'bg-fuchsia-600/85 text-fuchsia-50 ring-fuchsia-300/40',
    gold: 'bg-yellow-600/85 text-yellow-50 ring-yellow-300/40',
    silver: 'bg-slate-500/85 text-white ring-slate-300/40',
    bronze: 'bg-amber-700/85 text-amber-50 ring-amber-300/40',
  };

  return styles[String(level).trim().toLowerCase()]
    || 'bg-zinc-600/80 text-zinc-100 ring-zinc-300/30';
}

function skillScoreStatHtml(data) {
  const tierName = normalizeSkillTier(data);
  const score = Number(data?.skill_score ?? 0);
  const safeScore = Number.isFinite(score) ? score : 0;

  return `
    <div class="rounded-lg bg-white/5 p-2 text-center ring-1 ring-white/10">
      <span class="block text-xs text-white/70">${t('skill_score')}</span>
      <div class="mt-0.5 flex min-w-0 items-center justify-center gap-1.5">
        <img
          src="${cdnAsset(`assets/skill/rank-icons/${tierName}.png`)}"
          alt="${tierName}"
          class="h-8 w-8 shrink-0 object-contain"
          loading="lazy"
          decoding="async"
        >
        <div class="min-w-0 text-left">
          <span
            class="stat-value block truncate text-base font-semibold tabular-nums text-white/90"
            data-value="${safeScore}"
            data-decimals="2"
          >0</span>
          <span class="block truncate text-[9px] font-semibold uppercase tracking-wide text-white/60">${tierName}</span>
        </div>
      </div>
    </div>
  `;
}

function fitRankCardPlayerInfo(rankCardContent) {
  const left = rankCardContent.querySelector('.rank-section-container');
  const right = rankCardContent.querySelector('.player-info');
  if (!left || !right) {
    releaseRankCardContentHeight(rankCardContent);
    return;
  }

  const applyHeights = () => {
    const height = left.getBoundingClientRect().height;
    right.style.height = `${height}px`;

    const avatar = right.querySelector('.player-avatar');
    if (!avatar) return;

    const styles = getComputedStyle(right);
    const paddingY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
    const gap = parseFloat(styles.rowGap || styles.gap || 12);
    const fixedHeight = Array.from(right.children)
      .filter((child) => child !== avatar)
      .reduce((total, child) => total + child.getBoundingClientRect().height, 0);
    const totalGaps = gap * Math.max(0, right.children.length - 1);
    const avatarMarginTop = parseFloat(getComputedStyle(avatar).marginTop) || 0;
    const usable = Math.max(0, height - fixedHeight - paddingY - totalGaps - avatarMarginTop);
    avatar.style.maxHeight = `${usable}px`;
  };

  applyHeights();
  releaseRankCardContentHeight(rankCardContent);
  const resizeObserver = new ResizeObserver(applyHeights);
  resizeObserver.observe(left);
  window.addEventListener('resize', applyHeights, { passive: true });
}


/* =========================
   CDN HELPERS
   ========================= */
function isAbsoluteUrl(url) {
  return (
    typeof url === 'string' &&
    (/^(?:https?:)?\/\//i.test(url) || /^data:/i.test(url) || /^blob:/i.test(url))
  );
}

function normalizeRankCardAssetPath(path) {
  if (!path || typeof path !== 'string') return path;

  let p = path.split('#')[0].split('?')[0];
  if (p.startsWith('/')) p = p.slice(1);

  if (!p.startsWith('assets/rank_card/')) return p;

  const mAvatar = p.match(/^assets\/rank_card\/avatar\/([^/]+)\/([^/]+)\.webp$/i);
  if (mAvatar) {
    const skin = decodeURIComponent(mAvatar[1])
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_');
    const pose = decodeURIComponent(mAvatar[2])
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_');
    return `assets/rank_card/avatar/${skin}/${pose}.webp`;
  }

  const mBg = p.match(/^assets\/rank_card\/background\/([^/]+)\.webp$/i);
  if (mBg) {
    const name = decodeURIComponent(mBg[1])
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_');
    return `assets/rank_card/background/${name}.webp`;
  }

  return p.replace(/\s+/g, '_');
}

function cdnifyAssetUrl(url) {
  if (!url) return url;
  if (isAbsoluteUrl(url)) return url;

  const raw = String(url);
  const isAssetsPath = raw.startsWith('/assets/') || raw.startsWith('assets/');
  if (!isAssetsPath) return url;

  const normalized = normalizeRankCardAssetPath(raw);
  return cdnImage(normalized);
}

let selectedUserId = null;
const CURRENT_LANG = document.documentElement.lang || 'en';
let translations = window.RANK_CARD_I18N || {};
const RANK_CARD_OFFICIAL_FILTER_OPTIONS = [
  { value: 'official_playable', labelKey: 'filters.official_playable', fallback: 'Official playable' },
  { value: 'official_all', labelKey: 'filters.official_all', fallback: 'Official all' },
];
const RANK_CARD_UNOFFICIAL_FILTER_OPTIONS = [
  { value: 'unofficial_playable', labelKey: 'filters.unofficial_playable', fallback: 'Unofficial playable' },
  { value: 'unofficial_all', labelKey: 'filters.unofficial_all', fallback: 'Unofficial all' },
];
const RANK_CARD_VISIBLE_FILTER_OPTIONS = isChineseRankCardLang()
  ? RANK_CARD_UNOFFICIAL_FILTER_OPTIONS
  : RANK_CARD_OFFICIAL_FILTER_OPTIONS;
const RANK_CARD_DEFAULT_FILTER = RANK_CARD_VISIBLE_FILTER_OPTIONS[0].value;
let currentRankCardFilter = normalizeRankCardFilter(getQueryParam('filter') || RANK_CARD_DEFAULT_FILTER);
let currentBackground = null;
let preloadedBackgrounds = [];
let rewardsReady = false;
let __rewardsPromise = null;
if (typeof availableAvatars === 'undefined') {
  var availableAvatars = { skins: [], poses: [] };
}

if (typeof window !== 'undefined') {
  window.showBadgeViewer = showBadgeViewer;
  window.closeBadgeViewer = closeBadgeViewer;
}

/* =========================
   BOOT & CORE
   ========================= */
document.addEventListener('DOMContentLoaded', async () => {
  await initRankCard();
});

async function initRankCard() {
  let userIdFromUrl = getQueryParam('user_id');

  const rankCardContent = byId('rankCardContent');
  const badgeMasteryContent = byId('badgeMasteryContent');
  const btnRankCard = byId('btnRankCard');
  const btnBadges = byId('btnBadges');
  const buttonContainer = byId('buttonContainer');
  const searchButton = byId('searchButton');
  const resetFilter = byId('resetFilter');

  badgeMasteryContent.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
  btnRankCard.classList.add(...String('active').trim().split(/\s+/).filter(Boolean));

  const disableButtons = () => {
    [btnRankCard, btnBadges, searchButton, resetFilter].forEach((b) => {
      b.disabled = true;
      b.classList.add(...String('cursor-not-allowed').trim().split(/\s+/).filter(Boolean), ...String('opacity-50').trim().split(/\s+/).filter(Boolean));
    });
  };
  const enableButtons = () => {
    [btnRankCard, btnBadges, searchButton, resetFilter].forEach((b) => {
      b.disabled = false;
      b.classList.remove(...String('cursor-not-allowed').trim().split(/\s+/).filter(Boolean), ...String('opacity-50').trim().split(/\s+/).filter(Boolean));
    });
  };

  disableButtons();

  function toggleTabs(showContent, hideContent, activeBtn, inactiveBtn) {
    activeBtn.classList.add(...String('active').trim().split(/\s+/).filter(Boolean), ...String('bg-white').trim().split(/\s+/).filter(Boolean), ...String('text-zinc-900').trim().split(/\s+/).filter(Boolean), ...String('border-white/60').trim().split(/\s+/).filter(Boolean));
    inactiveBtn.classList.remove(...String('active').trim().split(/\s+/).filter(Boolean), ...String('bg-white').trim().split(/\s+/).filter(Boolean), ...String('text-zinc-900').trim().split(/\s+/).filter(Boolean), ...String('border-white/60').trim().split(/\s+/).filter(Boolean));
    inactiveBtn.classList.add(...String('bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5').trim().split(/\s+/).filter(Boolean), ...String('hover:bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10').trim().split(/\s+/).filter(Boolean), ...String('text-zinc-900 dark:text-white').trim().split(/\s+/).filter(Boolean));
    showContent.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
    hideContent.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));

    const targetId = getTargetUserId();

    if (showContent.id === 'badgeMasteryContent') {
      if (!showContent.dataset.loadedFor || showContent.dataset.loadedFor !== String(targetId)) {
        if (targetId) {
          fetchUserMastery(targetId);
        }
        showContent.dataset.loadedFor = String(targetId || '');
      }
    } else if (showContent.id === 'rankCardContent') {
      const loadKey = rankCardLoadKey(targetId);
      if (!showContent.dataset.loadedFor || showContent.dataset.loadedFor !== loadKey) {
        if (targetId) {
          fetchUserRankCard(targetId);
        } else {
          loadRankCardContent();
        }
        showContent.dataset.loadedFor = loadKey;
      }
    }

    updateButtonContainerVisibility();
  }

  btnRankCard.addEventListener('click', () => {
    toggleTabs(rankCardContent, badgeMasteryContent, btnRankCard, btnBadges);
  });
  btnBadges.addEventListener('click', () => {
    toggleTabs(badgeMasteryContent, rankCardContent, btnBadges, btnRankCard);
  });

  document.addEventListener('click', async (event) => {
    const btn = event.target?.closest?.('[data-rank-card-filter]');
    if (!btn) return;

    const next = normalizeRankCardFilter(btn.getAttribute('data-rank-card-filter'));
    if (next === currentRankCardFilter) return;

    currentRankCardFilter = next;
    const url = new URL(window.location.href);
    if (next === RANK_CARD_DEFAULT_FILTER) url.searchParams.delete('filter');
    else url.searchParams.set('filter', next);
    history.replaceState({}, '', url);

    await reloadRankCardForCurrentFilter();
  });

  searchButton.addEventListener('click', async () => {
    const input = byId('searchUserName');

    let userId = input?.dataset.userId || selectedUserId || null;
    const typed = (input?.value || '').trim();
    if (!userId && /^\d+$/.test(typed)) userId = typed;

    if (!userId) {
      toastError(t('errors.select_user'));
      return;
    }

    selectedUserId = String(userId);

    const url = new URL(window.location.href);
    url.searchParams.set('user_id', selectedUserId);
    history.replaceState({}, '', url);

    const rankCardContent = byId('rankCardContent');
    const badgeMasteryContent = byId('badgeMasteryContent');
    const isBadgesTabActive = btnBadges.classList.contains('active');

    rankCardContent.dataset.loadedFor = '';
    badgeMasteryContent.dataset.loadedFor = '';

    renderRankCardSkeleton();
    showLoadingBar();
    try {
      if (isBadgesTabActive) {
        hideRankCardContainer();
        badgeMasteryContent.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
        badgeMasteryContent.classList.add(...String('grid').trim().split(/\s+/).filter(Boolean));
      } else {
        badgeMasteryContent.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
        badgeMasteryContent.classList.remove(...String('grid').trim().split(/\s+/).filter(Boolean));
      }

      if (isBadgesTabActive) {
        await fetchUserMastery(selectedUserId);
      } else {
        await fetchUserRankCard(selectedUserId, { silent: isBadgesTabActive, noSpinner: true });
        fetchUserMastery(selectedUserId);
      }

      rankCardContent.dataset.loadedFor = rankCardLoadKey(selectedUserId);
      badgeMasteryContent.dataset.loadedFor = String(selectedUserId);
    } finally {
      updateButtonContainerVisibility();
      hideLoadingBar();
    }
  });

  resetFilter.addEventListener('click', async () => {
    if (resetFilter.disabled) return;

    const wasBadgesTab = btnBadges.classList.contains('active');

    const input = byId('searchUserName');
    if (input) {
      input.value = '';
      delete input.dataset.userId;
    }

    const url = new URL(window.location.href);
    url.searchParams.delete('user_id');
    history.pushState({}, '', url);

    selectedUserId = null;

    badgeMasteryContent.innerHTML = '';
    badgeMasteryContent.dataset.loadedFor = '';

    rankCardContent.innerHTML = '';
    rankCardContent.dataset.loadedFor = '';

    showLoadingBar();

    if (wasBadgesTab) {
      hideRankCardContainer();
    } else {
      renderRankCardSkeleton();
      await loadRankCardContent();
    }

    const me = getCurrentUserId();
    setResetFilterEnabled(!!me);

    if (!me) {
      hideRankCardContainer();
      badgeMasteryContent.innerHTML = `<p class="text-sm text-zinc-900 dark:text-white/70">${t('no_badges_found')}</p>`;
    } else {
      await fetchUserMastery(me);
      badgeMasteryContent.dataset.loadedFor = String(me);
    }

    if (wasBadgesTab) {
      badgeMasteryContent.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
      badgeMasteryContent.classList.add(...String('grid').trim().split(/\s+/).filter(Boolean));
      rankCardContent.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    } else {
      badgeMasteryContent.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
      badgeMasteryContent.classList.remove(...String('grid').trim().split(/\s+/).filter(Boolean));
    }

    updateButtonContainerVisibility();
    hideLoadingBar();
  });

  const me = getCurrentUserId();
  if (me) {
    preloadAllRewards();
    preloadBackgroundsOptions();
    preloadBackgroundPreview();
    preloadAvatarOptions();
    preloadAvatarPreviews();
    preloadBadgesOptions();
    preloadBadgesPreview();
    fetchUserMastery(me);
  }

  initBadgesChanges();
  initBackgroundChanges();
  initAvatarChanges();
  createSearchSuggestions();

  const hasQueryId = typeof userIdFromUrl === 'string' && userIdFromUrl.trim() !== '';
  if (me || hasQueryId) {
    renderRankCardSkeleton();
    showLoadingBar();
    if (hasQueryId) await fetchUserRankCard(userIdFromUrl.trim());
    else           await loadRankCardContent();
    hideLoadingBar();
  }

  enableButtons();
  updateButtonContainerVisibility();
}

/* =========================
   HELPERS
   ========================= */
function byId(id) {
  return document.getElementById(id);
}

function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

function isChineseRankCardLang() {
  const lang = String(CURRENT_LANG || '').toLowerCase();
  return lang === 'cn' || lang === 'zh' || lang.startsWith('zh-');
}

function normalizeRankCardFilter(value) {
  const raw = String(value || '').trim();
  return RANK_CARD_VISIBLE_FILTER_OPTIONS.some((option) => option.value === raw)
    ? raw
    : RANK_CARD_DEFAULT_FILTER;
}

function rankCardLoadKey(userId) {
  return `${String(userId || '')}:${currentRankCardFilter}`;
}

function rankCardFilterControlsHtml() {
  return `
    <div class="absolute top-3 right-3 z-20 flex max-w-[calc(100%-1.5rem)] flex-wrap justify-end gap-1 rounded-xl border border-white/10 bg-black/35 p-1 shadow-lg backdrop-blur">
      ${RANK_CARD_VISIBLE_FILTER_OPTIONS.map((option) => {
        const active = option.value === currentRankCardFilter;
        return `
          <button
            type="button"
            data-rank-card-filter="${option.value}"
            class="cursor-pointer rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition ${
              active
                ? 'bg-white text-zinc-950'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }"
            aria-pressed="${active ? 'true' : 'false'}"
          >
            ${t(option.labelKey, option.fallback)}
          </button>
        `;
      }).join('')}
    </div>
  `;
}

async function reloadRankCardForCurrentFilter() {
  const targetId = getTargetUserId();
  if (!targetId) return;

  const rankCardContent = byId('rankCardContent');
  rankCardContent.dataset.loadedFor = '';
  renderRankCardSkeleton();
  showLoadingBar();

  if (String(targetId) === String(getCurrentUserId()) && !selectedUserId && !getQueryParam('user_id')) {
    await loadRankCardContent();
  } else {
    await fetchUserRankCard(targetId, { noSpinner: true });
  }

  rankCardContent.dataset.loadedFor = rankCardLoadKey(targetId);
  hideLoadingBar();
}

function getCurrentUserId() {
  const v = byId('currentUserId')?.value ?? window.user_id ?? null;
  return v ? String(v) : null;
}

function getTargetUserId() {
  const fromUrl = getQueryParam('user_id');
  const id = selectedUserId || (fromUrl && fromUrl.trim()) || getCurrentUserId();
  return id ? String(id) : null;
}

function updateButtonContainerVisibility() {
  const badgeMasteryContent = byId('badgeMasteryContent');
  const buttonContainer = byId('buttonContainer');
  if (!badgeMasteryContent || !buttonContainer) return;

  const currentUserId = getCurrentUserId();
  const hasTarget = !!(selectedUserId || getQueryParam('user_id'));
  const isBadgesTabActive = !badgeMasteryContent.classList.contains('hidden');

  const isOwnCard =
    !!currentUserId &&
    (!selectedUserId || String(selectedUserId) === String(currentUserId)) &&
    (!getQueryParam('user_id') || String(getQueryParam('user_id')) === String(currentUserId));

  const shouldShow = isOwnCard && !isBadgesTabActive;
  const nothingToShow = !currentUserId && !hasTarget;

(() => { const __obj = buttonContainer; let __last; for (const __c of String('hidden').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !shouldShow || nothingToShow); return __last; })();
(() => { const __obj = buttonContainer; let __last; for (const __c of String('flex').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, shouldShow && !nothingToShow); return __last; })();

  setEditButtonsState(shouldShow && !nothingToShow);
  setResetFilterEnabled(!!currentUserId);
}

function animateValue(element, start, end, duration, decimals = 0) {
  const range = end - start;
  let startTime = null;
  const step = (ts) => {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    const value = progress * range + start;
    element.textContent = decimals > 0
      ? value.toLocaleString(undefined, { maximumFractionDigits: decimals })
      : Math.floor(value);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function showLoadingBar() {
  const el = byId('loadingContainer');
  if (!el) return;
  el.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean), ...String('opacity-0').trim().split(/\s+/).filter(Boolean));
  el.classList.add(...String('flex').trim().split(/\s+/).filter(Boolean), ...String('opacity-100').trim().split(/\s+/).filter(Boolean));
}

function hideLoadingBar() {
  const el = byId('loadingContainer');
  if (!el) return;
  el.classList.add(...String('opacity-0').trim().split(/\s+/).filter(Boolean));
  setTimeout(() => el.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean)), 200);
}

const PROGRESS_COLORS = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-orange-400',
  'very-hard': 'bg-orange-700',
  extreme: 'bg-red-600',
  hell: 'bg-red-800',
};

function applyProgressColors(scopeEl = document) {
  Object.entries(PROGRESS_COLORS).forEach(([slug, color]) => {
    scopeEl.querySelectorAll(`.progress-${slug}`).forEach((el) => {
      el.classList.remove(...String('bg-white/80').trim().split(/\s+/).filter(Boolean));
      el.classList.add(...String(color).trim().split(/\s+/).filter(Boolean));
    });
  });
}

function normalizeBadgeSlots(badges) {
  if (!badges || typeof badges !== 'object') return [];
  return Array.from({ length: 6 }, (_, i) => {
    const idx = i + 1;
    return {
      name: badges[`badge_name${idx}`] ?? null,
      type: badges[`badge_type${idx}`] ?? null,
      url: badges[`badge_url${idx}`] ?? null,
    };
  });
}

function restartBadgeAnimations(scope = document) {
  scope.querySelectorAll('.badges-grid .badge').forEach((el) => {
    el.style.animation = 'none';
    void el.offsetHeight;
    el.style.animation = '';
  });
}

function setEditButtonsState(enabled) {
  const effective = enabled && rewardsReady;
  ['changeBadges', 'changeBackground', 'changeAvatar'].forEach((id) => {
    const b = byId(id);
    if (!b) return;
    b.disabled = !effective;
(() => { const __obj = b; let __last; for (const __c of String('cursor-not-allowed').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !effective); return __last; })();
(() => { const __obj = b; let __last; for (const __c of String('opacity-50').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !effective); return __last; })();

    const tipKey = t('loading_rewards');
    const msg = tipKey && tipKey !== 'loading_rewards' ? tipKey : t('loading_rewards');
    if (!effective) b.setAttribute('title', msg);
    else b.removeAttribute('title');
  });
}

function setResetFilterEnabled(enabled) {
  const btn = byId('resetFilter');
  if (!btn) return;
  btn.disabled = !enabled;
(() => { const __obj = btn; let __last; for (const __c of String('disabled:cursor-not-allowed').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !enabled); return __last; })();
(() => { const __obj = btn; let __last; for (const __c of String('opacity-50').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !enabled); return __last; })();
}

function revealRankCardContainer() {
  const el = byId('rankCardContent');
  if (!el) return;

  if (typeof updateButtonContainerVisibility === 'function') {
    updateButtonContainerVisibility();
  }

  el.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
  el.classList.remove(...String('gp-panel-leave').trim().split(/\s+/).filter(Boolean), ...String('gp-panel-leave-to').trim().split(/\s+/).filter(Boolean));
  el.classList.add(...String('gp-panel-anim').trim().split(/\s+/).filter(Boolean), ...String('gp-panel-enter').trim().split(/\s+/).filter(Boolean));

  void el.getBoundingClientRect();
  el.classList.add(...String('gp-panel-enter-to').trim().split(/\s+/).filter(Boolean));
  const onEnd = (e) => {
    if (e.target !== el) return;
    el.classList.remove(...String('gp-panel-enter').trim().split(/\s+/).filter(Boolean), ...String('gp-panel-enter-to').trim().split(/\s+/).filter(Boolean));
    el.removeEventListener('transitionend', onEnd);
  };
  el.addEventListener('transitionend', onEnd);
}

function hideRankCardContainer() {
  const el = byId('rankCardContent');
  if (!el || el.classList.contains('hidden')) return;
  releaseRankCardContentHeight(el);

  el.classList.remove(...String('gp-panel-enter').trim().split(/\s+/).filter(Boolean), ...String('gp-panel-enter-to').trim().split(/\s+/).filter(Boolean));

  el.classList.add(...String('gp-panel-anim').trim().split(/\s+/).filter(Boolean), ...String('gp-panel-leave').trim().split(/\s+/).filter(Boolean));
  void el.getBoundingClientRect();
  el.classList.add(...String('gp-panel-leave-to').trim().split(/\s+/).filter(Boolean));
  const onEnd = (e) => {
    if (e.target !== el) return;
    if (!el.classList.contains('gp-panel-leave-to')) return;
    el.classList.remove(...String('gp-panel-leave').trim().split(/\s+/).filter(Boolean), ...String('gp-panel-leave-to').trim().split(/\s+/).filter(Boolean));
    el.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    el.removeEventListener('transitionend', onEnd);
  };
  el.addEventListener('transitionend', onEnd);
}

function lockRankCardContentHeight(el = byId('rankCardContent')) {
  if (!el || el.classList.contains('hidden')) return;
  const height = Math.ceil(el.getBoundingClientRect().height);
  if (height > 0) el.style.minHeight = `${height}px`;
}

function releaseRankCardContentHeight(el = byId('rankCardContent')) {
  if (!el) return;
  el.style.minHeight = '';
}

async function updateHeaderDiscordProfile(userId, { fallbackNickname } = {}) {
  const nameEl = byId('headerUsername');
  const imgEl  = byId('headerAvatar');

  if (nameEl && fallbackNickname) nameEl.textContent = fallbackNickname;

  try {
    const res = await fetch(`/api/settings/user-avatar?user_id=${encodeURIComponent(userId)}`, { credentials: 'same-origin' });
    if (!res.ok) return;
    const data = await res.json().catch(() => ({}));

    if (imgEl && data.avatar_url) imgEl.src = data.avatar_url;
    if (nameEl && data.global_name) nameEl.textContent = data.global_name;
  } catch {}
}


/* =========================
   TOASTS
   ========================= */
function toastBase(msg, extra = '') {
  const node = document.createElement('div');
  node.className = `fixed inset-x-0 top-4 z-[200] mx-auto w-fit max-w-full rounded-xl px-4 py-2 text-sm shadow-lg ring-1 ${extra}`;
  node.textContent = msg;
  document.body.appendChild(node);
  setTimeout(() => {
    node.classList.add(...String('opacity-0').trim().split(/\s+/).filter(Boolean), ...String('translate-y-1').trim().split(/\s+/).filter(Boolean));
  }, 1600);
  setTimeout(() => node.remove(), 2000);
}
function toastSuccess(msg) {
  toastBase(msg, 'bg-emerald-600/90 text-zinc-900 dark:text-white ring-emerald-300/40');
}
function toastError(msg) {
  toastBase(msg, 'bg-rose-600/90 text-zinc-900 dark:text-white ring-rose-300/40');
}

/* =========================
   I18N
   ========================= */
function t(path, params = {}) {
  let fallback = null;
  if (typeof params === 'string') {
    fallback = params;
    params = {};
  }
  const parts = path.split('.');
  let result = translations;
  for (const part of parts) {
    result = result?.[part];
    if (!result) break;
  }
  if (typeof result !== 'string') return fallback ?? path;
  for (const k in params) result = result.replace(`{${k}}`, params[k]);
  return result;
}

/* =========================
   RANKCARD (SELF)
   ========================= */
async function loadRankCardContent() {
  const rankCardContent = byId('rankCardContent');
  try {
    const me = getCurrentUserId();
    if (!me) {
      rankCardContent.innerHTML = '';
      hideRankCardContainer();
      hideLoadingBar();
      return;
    }

    const response = await fetch(endpoints.rankcard.data(me, currentRankCardFilter), { credentials: 'same-origin' });
    const data = await response.json();
    if (!data || data.error) {
      rankCardContent.innerHTML = '';
      hideRankCardContainer();
      hideLoadingBar();
      return;
    }
    updateHeaderDiscordProfile(me, { fallbackNickname: data.nickname });

    rankCardContent.innerHTML = `
      <div class="rank-card-container relative">
        <div class="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
          <div class="background absolute inset-0">
            <img src="${cdnifyAssetUrl(data.background_url) || 'default-background.webp'}" alt="${t('alts.background')}" class="h-full w-full object-cover">
          </div>
          ${rankCardFilterControlsHtml()}

          <div class="relative content-rankcard p-4 pt-24 sm:p-6 sm:pt-16 bg-gradient-to-b from-black/30 via-black/20 to-black/30">
            <div class="player-name font-banksans text-center text-2xl sm:text-5xl font-extrabold tracking-tight text-white/90">
              ${data.nickname}
            </div>

            <!-- items-stretch -> items-start -->
            <div class="main-container mt-4 grid gap-4 grid-cols-1 md:grid-cols-[1fr_320px] items-start">
              <!-- Colonne gauche -->
              <!-- suppression h-full -->
              <div class="rank-details-container md:col-start-1 md:row-start-1 space-y-4">
                <!-- suppression h-full -->
                <div class="rank-section-container min-h-[410px] rounded-xl bg-black/30 ring-1 ring-white/10 p-3 sm:p-4 backdrop-blur flex flex-col">
                  
                  <div class="rank-section space-y-3">
                    <div class="medals-header grid items-center text-sm text-white/80 gap-0.5 sm:gap-2
                      grid-cols-[max-content_1fr_minmax(1.25rem,auto)_minmax(1.25rem,auto)_minmax(1.25rem,auto)]
                      sm:grid-cols-[8rem_1fr_minmax(2rem,auto)_minmax(2rem,auto)_minmax(2rem,auto)]">
                      <span class="col-start-1 col-end-2"></span>
                      <span class="col-start-2 col-end-3"></span>
                      <span class="text-center">
                        <img src="${MEDAL_ICON.gold}"   alt="${t('medals.gold')}"  class="mx-auto h-4 w-4 sm:h-5 sm:w-5 object-contain" />
                      </span>
                      <span class="text-center">
                        <img src="${MEDAL_ICON.silver}" alt="${t('medals.silver')}" class="mx-auto h-4 w-4 sm:h-5 sm:w-5 object-contain" />
                      </span>
                      <span class="text-center">
                        <img src="${MEDAL_ICON.bronze}" alt="${t('medals.bronze')}" class="mx-auto h-4 w-4 sm:h-5 sm:w-5 object-contain" />
                      </span>
                    </div>

                    ${Object.entries(data.difficulties)
                      .map(([level, stats]) => {
                        const pct = stats.total ? (stats.completed / stats.total) * 100 : 0;
                        const slug = level.toLowerCase().replace(/\s+/g, '-');
                        const key = level.toLowerCase().replace(/\s+/g, '_');
                        return `
                          <div class="rank-row grid items-center gap-0.5 sm:gap-2
                            grid-cols-[max-content_1fr_minmax(1.25rem,auto)_minmax(1.25rem,auto)_minmax(1.25rem,auto)]
                            sm:grid-cols-[8rem_1fr_minmax(2rem,auto)_minmax(2rem,auto)_minmax(2rem,auto)]">
                            <span class="rank-title text-[13px] sm:text-base whitespace-nowrap pr-1 sm:pr-0 text-white/90">
                              ${t('difficulties.' + key)}
                            </span>

                          <div class="relative group w-full">
                            <div class="progress-bar relative h-2 w-full overflow-hidden rounded bg-white/10 ring-1 ring-white/10">
                              <div class="progress progress-${slug} absolute left-0 top-0 h-full w-0" data-width="${pct}"></div>
                            </div>
                            <div class="pointer-events-none absolute -top-7 right-0 hidden rounded-md bg-black/80 px-2 py-1 text-[11px] text-white/90 ring-1 ring-white/10 group-hover:block">
                              ${t('completed_total', { completed: stats.completed, total: stats.total })}
                            </div>
                          </div>

                          <span class="text-center text-sm text-white/90">${stats.gold}</span>
                          <span class="text-center text-sm text-white/90">${stats.silver}</span>
                          <span class="text-center text-sm text-white/90">${stats.bronze}</span>
                        </div>
                      `;
                      })
                      .join('')}
                  </div>

                  <div class="inline-stats mt-3 grid grid-cols-2 gap-2 xl:grid-cols-4">
                    <div class="rounded-lg bg-white/5 p-2 ring-1 ring-white/10 text-center">
                      <span class="block text-xs text-white/70">${t('xp')}</span>
                      <span class="stat-value text-lg font-semibold text-white/90" data-value="${Number(data.xp || 0)}">0</span>
                    </div>
                    <div class="rounded-lg bg-white/5 p-2 ring-1 ring-white/10 text-center">
                      <span class="block text-xs text-white/70">${t('prestige_level')}</span>
                      <span class="text-base font-semibold text-white/90">${Number(data.prestige_level ?? 0)}</span>
                    </div>
                    <div class="rounded-lg bg-white/5 p-2 ring-1 ring-white/10 text-center">
                      <span class="block text-xs text-white/70">${t('community_rank')}</span>
                      <span class="text-base font-semibold text-white/90">${data.community_rank || '—'}</span>
                    </div>
                    ${skillScoreStatHtml(data)}
                  </div>

                  <!-- Bas -->
                  <div class="combined-container mt-3 grid gap-4 md:grid-cols-2 items-stretch">
                    <div class="badges-container rounded-xl bg-white/5 p-2 ring-1 ring-white/10 min-w-0 overflow-hidden">
                      <div class="badges-grid grid grid-cols-[repeat(auto-fit,minmax(2.5rem,1fr))] gap-2 sm:gap-3 place-items-center">
                        ${normalizeBadgeSlots(data.badges)
                          .filter((b) => !!b.url)
                          .map(
                            (b) => `
                              <img src="${cdnifyAssetUrl(b.url)}" alt="${b.name || 'Badge'}"
                                    class="badge h-8 w-8 sm:h-10 sm:w-10 flex-none rounded-full ring-1 ring-white/10 object-cover">
                            `
                          )
                          .join('')}
                      </div>
                    </div>

                    <div class="stats-section grid grid-cols-3 gap-2 rounded-xl bg-white/5 p-2 ring-1 ring-white/10">
                      <div class="stat-item text-center">
                        <span class="stat-label block text-xs text-white/70">${t('maps_label')}</span>
                        <span class="stat-value text-lg font-semibold text-white/90" data-value="${data.total_maps_created}">0</span>
                      </div>
                      <div class="stat-item text-center">
                        <span class="stat-label block text-xs text-white/70">${t('playtests_label')}</span>
                        <span class="stat-value text-lg font-semibold text-white/90" data-value="${data.total_playtests}">0</span>
                      </div>
                      <div class="stat-item text-center">
                        <span class="stat-label block text-xs text-white/70">${t('world_records_label')}</span>
                        <span class="stat-value text-lg font-semibold text-white/90" data-value="${data.world_records}">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Colonne droite -->
              <!-- suppression h-full -->
              <div class="player-info min-h-[410px] md:col-start-2 md:row-start-1 flex flex-col items-center justify-start gap-3 rounded-xl bg-black/30 p-4 ring-1 ring-white/10 backdrop-blur overflow-hidden">
                <div class="inline-flex items-center gap-2">
                  <span class="player-rank-name text-sm text-white/90 leading-none">
                    ${data.rank_name}
                  </span>
                  <img src="${cdnifyAssetUrl(data.rank_url) || cdnAsset('assets/default_rank.png')}" alt="${t('alts.player_rank_badge')}" class="player-rank-badge h-5 sm:h-6 object-contain">
                </div>

                <img src="${cdnifyAssetUrl(data.avatar_url) || cdnAsset('assets/default_avatar.png')}" alt="${t('alts.player_avatar')}"
                     class="player-avatar mt-4 w-full max-w-[240px] object-contain bg-transparent">
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    revealRankCardContainer();
    requestAnimationFrame(() => {
      fitRankCardPlayerInfo(rankCardContent);
    });

    setTimeout(() => {
      rankCardContent.querySelectorAll('.progress').forEach((bar) => {
        const width = bar.getAttribute('data-width');
        bar.style.transition = 'width 1.6s ease-in-out';
        bar.style.width = `${width}%`;
      });
    }, 60);

    applyProgressColors(rankCardContent);
    rankCardContent.querySelectorAll('.stat-value').forEach((stat) => {
      const end = Number(stat.getAttribute('data-value') || 0);
      const decimals = Number.parseInt(stat.getAttribute('data-decimals') || '0', 10);
      animateValue(stat, 0, Number.isFinite(end) ? end : 0, 1600, decimals);
    });

    rankCardContent.dataset.loadedFor = rankCardLoadKey(me);
    const masteryEl = byId('badgeMasteryContent');
    if (masteryEl && masteryEl.dataset.loadedFor !== String(me)) {
      fetchUserMastery(me);
    }

    hideLoadingBar();
  } catch (e) {
    console.error('Erreur RankCard self:', e);
    rankCardContent.dataset.loadedFor = '';
    hideRankCardContainer();
    hideLoadingBar();
  }
}

/* =========================
   RANKCARD (OTHERS)
   ========================= */
async function fetchUserRankCard(userId, opts = {}) {
  const { silent = false, noSpinner = false } = opts;
  const rankCardContent = byId('rankCardContent');
  if (!userId) {
    rankCardContent.innerHTML = '';
    if (!silent) hideRankCardContainer();
    return;
  }

  if (!noSpinner) showLoadingBar();
  try {
    const response = await fetch(endpoints.rankcard.data(userId, currentRankCardFilter), { credentials: 'same-origin' });
    if (!response.ok) throw new Error(t('errors.api_connection'));
    const data = await response.json();
    if (!data || data.error) {
      rankCardContent.innerHTML = '';
      if (!silent) hideRankCardContainer();
      if (!noSpinner) hideLoadingBar();
      return;
    }
    updateHeaderDiscordProfile(userId, { fallbackNickname: data.nickname });

    rankCardContent.innerHTML = `
      <div class="rank-card-container relative">
        <div class="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
          <div class="background absolute inset-0">
            <img src="${cdnifyAssetUrl(data.background_url) || 'default-background.webp'}" alt="Background" class="h-full w-full object-cover">
          </div>
          ${rankCardFilterControlsHtml()}

          <div class="relative content-rankcard p-4 pt-24 sm:p-6 sm:pt-16 bg-gradient-to-b from-black/30 via-black/20 to-black/30">
            <div class="player-name font-banksans text-center text-2xl sm:text-5xl font-extrabold tracking-tight text-white/90">
              ${data.nickname}
            </div>

            <div class="main-container mt-4 grid gap-4 grid-cols-1 md:grid-cols-[1fr_320px] items-start">
              <div class="rank-details-container md:col-start-1 md:row-start-1 space-y-4">
                <div class="rank-section-container min-h-[410px] rounded-xl bg-black/30 ring-1 ring-white/10 p-3 sm:p-4 backdrop-blur flex flex-col">
                  
                  <div class="rank-section space-y-3">
                    <div class="medals-header grid items-center text-sm text-white/80 gap-0.5 sm:gap-2
                      grid-cols-[max-content_1fr_minmax(1.25rem,auto)_minmax(1.25rem,auto)_minmax(1.25rem,auto)]
                      sm:grid-cols-[8rem_1fr_minmax(2rem,auto)_minmax(2rem,auto)_minmax(2rem,auto)]">
                      <span></span><span></span>
                      <span class="text-center">
                        <img src="${MEDAL_ICON.gold}"   alt="Gold"   class="mx-auto h-4 w-4 sm:h-5 sm:w-5 object-contain" />
                      </span>
                      <span class="text-center">
                        <img src="${MEDAL_ICON.silver}" alt="Silver" class="mx-auto h-4 w-4 sm:h-5 sm:w-5 object-contain" />
                      </span>
                      <span class="text-center">
                        <img src="${MEDAL_ICON.bronze}" alt="Bronze" class="mx-auto h-4 w-4 sm:h-5 sm:w-5 object-contain" />
                      </span>
                    </div>

                    ${Object.entries(data.difficulties)
                      .map(([level, stats]) => {
                        const pct = stats.total ? (stats.completed / stats.total) * 100 : 0;
                        const slug = level.toLowerCase().replace(/\s+/g, '-');
                        const key = level.toLowerCase().replace(/\s+/g, '_');
                        return `
                          <div class="rank-row grid items-center gap-0.5 sm:gap-2
                            grid-cols-[max-content_1fr_minmax(1.25rem,auto)_minmax(1.25rem,auto)_minmax(1.25rem,auto)]
                            sm:grid-cols-[8rem_1fr_minmax(2rem,auto)_minmax(2rem,auto)_minmax(2rem,auto)]">
                          <span class="rank-title text-[13px] sm:text-base whitespace-nowrap pr-1 sm:pr-0 text-white/90">${t('difficulties.' + key)}</span>
                          <div class="relative group w-full">
                            <div class="progress-bar relative h-2 w-full overflow-hidden rounded bg-white/10 ring-1 ring-white/10">
                              <div class="progress progress-${slug} absolute left-0 top-0 h-full w-0" data-width="${pct}"></div>
                            </div>
                            <div class="pointer-events-none absolute -top-7 right-0 hidden rounded-md bg-black/80 px-2 py-1 text-[11px] text-white/90 ring-1 ring-white/10 group-hover:block">
                              Completed: ${stats.completed} / ${stats.total}
                            </div>
                          </div>
                          <span class="text-center text-sm text-white/90">${stats.gold}</span>
                          <span class="text-center text-sm text-white/90">${stats.silver}</span>
                          <span class="text-center text-sm text-white/90">${stats.bronze}</span>
                        </div>
                      `;
                      })
                      .join('')}
                  </div>

                  <div class="inline-stats mt-3 grid grid-cols-2 gap-2 xl:grid-cols-4">
                    <div class="rounded-lg bg-white/5 p-2 ring-1 ring-white/10 text-center">
                      <span class="block text-xs text-white/70">${t('xp')}</span>
                      <span class="stat-value text-lg font-semibold text-white/90" data-value="${Number(data.xp || 0)}">0</span>
                    </div>
                    <div class="rounded-lg bg-white/5 p-2 ring-1 ring-white/10 text-center">
                      <span class="block text-xs text-white/70">${t('prestige_level')}</span>
                      <span class="text-base font-semibold text-white/90">${Number(data.prestige_level ?? 0)}</span>
                    </div>
                    <div class="rounded-lg bg-white/5 p-2 ring-1 ring-white/10 text-center">
                      <span class="block text-xs text-white/70">${t('community_rank')}</span>
                      <span class="text-base font-semibold text-white/90">${data.community_rank || '—'}</span>
                    </div>
                    ${skillScoreStatHtml(data)}
                  </div>

                  <div class="combined-container mt-3 grid gap-4 md:grid-cols-2 items-stretch">
                    <div class="badges-container rounded-xl bg-white/5 p-2 ring-1 ring-white/10 min-w-0 overflow-hidden">
                      <div class="badges-grid grid grid-cols-[repeat(auto-fit,minmax(2.5rem,1fr))] gap-2 sm:gap-3 place-items-center">
                        ${normalizeBadgeSlots(data.badges)
                          .filter((b) => !!b.url)
                          .map(
                            (b) => `
                              <img src="${cdnifyAssetUrl(b.url)}" alt="${b.name || t('alts.badge')}"
                                    class="badge h-8 w-8 sm:h-10 sm:w-10 flex-none rounded-full ring-1 ring-white/10 object-cover">
                            `
                          )
                          .join('')}
                      </div>
                    </div>

                    <div class="stats-section grid grid-cols-3 gap-2 rounded-xl bg-white/5 p-2 ring-1 ring-white/10">
                      <div class="stat-item text-center">
                        <span class="stat-label block text-xs text-white/70">${t('maps_label')}</span>
                        <span class="stat-value text-lg font-semibold text-white/90" data-value="${data.total_maps_created}">0</span>
                      </div>
                      <div class="stat-item text-center">
                        <span class="stat-label block text-xs text-white/70">${t('playtests_label')}</span>
                        <span class="stat-value text-lg font-semibold text-white/90" data-value="${data.total_playtests}">0</span>
                      </div>
                      <div class="stat-item text-center">
                        <span class="stat-label block text-xs text-white/70">${t('world_records_label')}</span>
                        <span class="stat-value text-lg font-semibold text-white/90" data-value="${data.world_records}">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Colonne droite -->
              <div class="player-info min-h-[410px] md:col-start-2 md:row-start-1 flex flex-col items-center justify-start gap-3 rounded-xl bg-black/30 p-4 ring-1 ring-white/10 backdrop-blur overflow-hidden">
                <div class="inline-flex items-center gap-2">
                  <span class="player-rank-name text-sm text-white/90 leading-none">${data.rank_name}</span>
                  <img src="${cdnifyAssetUrl(data.rank_url) || cdnAsset('assets/default_rank.png')}" alt="Player Rank Badge" class="player-rank-badge h-5 sm:h-6 object-contain">
                </div>

                <img src="${cdnifyAssetUrl(data.avatar_url) || cdnAsset('assets/default_avatar.png')}" alt="Player Avatar"
                     class="player-avatar mt-4 w-full max-w-[240px] object-contain bg-transparent">
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    if (!silent) revealRankCardContainer();

    requestAnimationFrame(() => {
      fitRankCardPlayerInfo(rankCardContent);
    });

    setTimeout(() => {
      rankCardContent.querySelectorAll('.progress').forEach((bar) => {
        const width = bar.getAttribute('data-width');
        bar.style.transition = 'width 1.6s ease-in-out';
        bar.style.width = `${width}%`;
      });
    }, 60);

    applyProgressColors(rankCardContent);
    rankCardContent.querySelectorAll('.stat-value').forEach((stat) => {
      const end = Number(stat.getAttribute('data-value') || 0);
      const decimals = Number.parseInt(stat.getAttribute('data-decimals') || '0', 10);
      animateValue(stat, 0, Number.isFinite(end) ? end : 0, 1600, decimals);
    });

    rankCardContent.dataset.loadedFor = rankCardLoadKey(userId);

    if (!noSpinner) hideLoadingBar();
  } catch (e) {
    console.error('Erreur RankCard user:', e);
    if (!silent) hideRankCardContainer();
    if (!noSpinner) hideLoadingBar();
  }
}

/* =========================
   MASTERY (SELF & OTHERS)
   ========================= */
function loadUserMasteryContent() {
  const container = byId('badgeMasteryContent');
  const targetId = getTargetUserId();

  container.innerHTML = '';
  if (targetId) {
    fetchUserMastery(targetId);
  }

  container.dataset.loadedFor = String(targetId || '');
  container.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
  container.classList.add(...String('grid').trim().split(/\s+/).filter(Boolean));

  const buttonContainer = byId('buttonContainer');
  if (buttonContainer) {
    buttonContainer.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    buttonContainer.classList.remove(...String('flex').trim().split(/\s+/).filter(Boolean));
  }
}

async function fetchUserMastery(userId) {
  if (!userId) return;

  const container = byId('badgeMasteryContent');
  container.innerHTML = `
    <div class="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6">
      <section class="relative w-full rounded-2xl bg-zinc-900/5 dark:bg-black/30 ring-1 ring-zinc-300/60 dark:ring-white/10 backdrop-blur p-3 sm:p-4">
        <div class="mb-3 flex items-center justify-between gap-2">
          <span id="badgeCount" class="text-xs text-zinc-900 dark:text-white/60">—</span>
        </div>

        <div id="badgeScroller"
             class="grid gap-3 overflow-y-auto pr-1
                    grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6
                    max-h-[460px] sm:max-h-[60vh]">

          <div class="col-span-full h-24 animate-pulse rounded-xl bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5"></div>
        </div>

        <div class="pointer-events-none absolute inset-x-0 top-0 h-6 rounded-t-2xl bg-gradient-to-b from-black/40 to-transparent"></div>
        <div class="pointer-events-none absolute inset-x-0 bottom-0 h-8 rounded-b-2xl bg-gradient-to-t from-black/50 to-transparent"></div>
      </section>
    </div>
  `;

  const scroller = container.querySelector('#badgeScroller');
  const counter = container.querySelector('#badgeCount');

  try {
    const r = await fetch(endpoints.rankcard.mastery(userId), { credentials: 'same-origin' });
    if (!r.ok) throw new Error(t('errors.api_connection'));
    const data = await r.json();

    scroller.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
      scroller.innerHTML = `<p class="col-span-full text-sm text-zinc-900 dark:text-white/70">${t('no_badges_found')}</p>`;
      counter.textContent = '0';
      container.dataset.loadedFor = String(userId);
      return;
    }

    let count = 0;
    data.forEach((badge) => {
      if (badge.map_name === 'Tools' || badge.map_name === 'Framework') return;

      const badgeLevel = (badge.level === 'Placeholder' ? 'Unranked' : badge.level) || 'Unranked';
      const pillClass = masteryBadgePillClass(badgeLevel);

      const el = document.createElement('article');
      el.className =
        'group rounded-xl bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 transition p-3 ' +
        'hover:bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 hover:ring-zinc-400/60 dark:ring-white/20';
      el.innerHTML = `
        <div class="relative">
          <img src="${badge.icon_url}" alt="${badge.map_name}"
               class="mx-auto h-16 w-16 rounded-lg object-contain ring-zinc-300/60 dark:ring-white/10
                      group-hover:ring-zinc-400/60 dark:ring-white/20 cursor-pointer"
               onclick="showBadgeViewer('${badge.icon_url}', '${badge.map_name.replace(/'/g, "\\'")}')">
          <span class="absolute -right-1 -top-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 shadow ${pillClass}">
            ${badgeLevel}
          </span>
        </div>
        <div class="mt-2 space-y-0.5">
          <p class="text-center text-sm font-semibold leading-tight">${badge.map_name}</p>
          <p class="text-center text-[11px] text-zinc-900 dark:text-white/70">
            ${t('completions', { amount: badge.amount })}
          </p>
        </div>
      `;
      scroller.appendChild(el);
      count++;
    });

    if (!count) {
      scroller.innerHTML = `<p class="col-span-full text-sm text-zinc-900 dark:text-white/70">Aucun badge trouvé.</p>`;
    }
    counter.textContent = `${count}`;
    container.dataset.loadedFor = String(userId);
  } catch (err) {
    console.error('Erreur badges user:', err);
    scroller.innerHTML = `<p class="col-span-full text-sm text-rose-300">${t('errors.badges_fetch_failed')}</p>`;
  }
}

/* =========================
   BADGE VIEWER
   ========================= */
let isMouseDown = false;
let initialX = 0;
let currentRotation = 0;

function showBadgeViewer(iconUrl, mapName) {
  const overlay = byId('badgeViewer');
  const img = byId('badgeViewerImage');

  img.style.transform = 'rotateY(0deg)';
  img.setAttribute('data-current-rotation', '0');
  img.src = iconUrl;
  img.alt = mapName;
  overlay.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
  overlay.classList.add(...String('flex').trim().split(/\s+/).filter(Boolean));

  img.style.transition = 'none';
  img.addEventListener('mousedown', startBadgeRotation);
}
function closeBadgeViewer() {
  const overlay = byId('badgeViewer');
  const img = byId('badgeViewerImage');

  overlay.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
  overlay.classList.remove(...String('flex').trim().split(/\s+/).filter(Boolean));
  img.style.transform = 'rotateY(0deg)';
  img.setAttribute('data-current-rotation', '0');
  img.removeEventListener('mousedown', startBadgeRotation);

  isMouseDown = false;
  initialX = 0;
  currentRotation = 0;
}
function startBadgeRotation(event) {
  event.preventDefault();
  isMouseDown = true;
  initialX = event.clientX;
  const badge = event.target;
  badge.style.transition = 'none';

  const rotate = (e) => {
    if (isMouseDown) {
      const deltaX = e.clientX - initialX;
      currentRotation += deltaX * 0.001;
      badge.style.transform = `rotateY(${currentRotation}deg)`;
    }
  };
  const stopRotation = () => {
    isMouseDown = false;
    badge.setAttribute('data-current-rotation', currentRotation);
    badge.style.transition = 'transform 0.2s ease-out';
    window.removeEventListener('mousemove', rotate);
    window.removeEventListener('mouseup', stopRotation);
  };

  window.addEventListener('mousemove', rotate);
  window.addEventListener('mouseup', stopRotation);
}

/* =========================
   SUGGESTIONS
   ========================= */
function escapeHTML(s) {
  const d = document.createElement('div');
  d.textContent = String(s ?? '');
  return d.innerHTML;
}

function normalizeUserSuggestions(raw) {
  if (!Array.isArray(raw)) return [];
  if (raw.length && Array.isArray(raw[0])) {
    return raw.map(([id, label]) => ({ user_id: String(id), label: String(label || '') }));
  }
  return raw
    .map((x) => ({
      user_id: String(x.user_id ?? x.id ?? ''),
      label: String(x.name ?? x.label ?? x.username ?? x.display ?? ''),
    }))
    .filter((x) => x.user_id && x.label);
}

function createSearchSuggestions() {
  const searchInput = byId('searchUserName');
  if (!searchInput) return;

  searchInput.parentNode.classList.add(...String('relative').trim().split(/\s+/).filter(Boolean));

  const container = document.createElement('div');
  container.id = 'suggestionsContainer';
  container.className =
    'absolute z-50 mt-2 w-full rounded-xl bg-white/95 dark:bg-zinc-900/95 ring-1 ring-zinc-300/60 dark:ring-white/10 shadow-xl backdrop-blur hidden max-h-72 overflow-auto';
  searchInput.parentNode.appendChild(container);

  let items = [];
  let active = -1;

  const hide = () => {
    closeDropdown(container);
    active = -1;
  };
  const show = () => {
    openDropdown(container);
  };

  function selectIndex(i) {
    if (i < 0 || i >= items.length) return;
    const chosen = items[i];
    const input = byId('searchUserName');
    input.value = chosen.label;
    input.dataset.userId = chosen.user_id;
    selectedUserId = chosen.user_id;
    hide();
  }

  function render() {
    container.innerHTML = '';
    if (!items.length) {
      hide();
      return;
    }

    items.forEach((u, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className =
        'w-full cursor-pointer text-left px-3 py-2 text-sm rounded-lg hover:bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10';
      btn.innerHTML = `
        <div class="flex items-center justify-between gap-3">
          <span class="truncate">${escapeHTML(u.label)}</span>
          <span class="text-[11px] text-zinc-900 dark:text-white/40 font-mono">${escapeHTML(u.user_id)}</span>
        </div>`;
      btn.addEventListener('click', () => selectIndex(i));
      container.appendChild(btn);
    });
    show();
  }

  searchInput.addEventListener('keydown', (e) => {
    if (container.classList.contains('hidden')) return;

    const max = items.length - 1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      active = Math.min(max, active + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      active = Math.max(0, active - 1);
    } else if (e.key === 'Enter') {
      if (active >= 0) {
        e.preventDefault();
        selectIndex(active);
      }
      return;
    } else if (e.key === 'Escape') {
      hide();
      return;
    } else {
      return;
    }

    Array.from(container.children).forEach((el, idx) => {
(() => { const __obj = el; let __last; for (const __c of String('bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, idx === active); return __last; })();
    });

    const el = container.children[active];
    if (el) {
      const cTop = container.scrollTop;
      const cBot = cTop + container.clientHeight;
      const eTop = el.offsetTop;
      const eBot = eTop + el.offsetHeight;
      if (eTop < cTop) container.scrollTop = eTop;
      else if (eBot > cBot) container.scrollTop = eBot - container.clientHeight;
    }
  });

  let inflight = 0;
  searchInput.addEventListener('input', async () => {
    const q = searchInput.value.trim();
    if (q.length < 2) {
      items = [];
      render();
      return;
    }

    const ticket = ++inflight;
    try {
      const resp = await fetch(endpoints.autocomplete.users(q), { credentials: 'same-origin' });
      if (!resp.ok) throw new Error(t('errors.suggestions_failed'));
      const raw = await resp.json();
      if (ticket !== inflight) return;
      items = normalizeUserSuggestions(raw);
      active = -1;
      render();
    } catch (err) {
      console.error('Erreur suggestions:', err);
      items = [];
      render();
    }
  });

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target) && e.target !== searchInput) hide();
  });
}

function displaySuggestions(suggestions, container) {
  container.innerHTML = '';
  if (!suggestions || suggestions.length === 0) {
    container.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    return;
  }

  suggestions.forEach((user) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'w-full text-left px-3 py-2 text-sm hover:bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 rounded-lg';
    item.textContent = user.name;
    item.addEventListener('click', () => {
      const input = byId('searchUserName');
      input.value = user.name;
      input.dataset.userId = String(user.user_id);
      selectedUserId = String(user.user_id);
      container.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    });
    container.appendChild(item);
  });

  container.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
}

/* =========================
   BADGES EDIT
   ========================= */
function initBadgesChanges() {
  const changeBadgesButton = byId('changeBadges');

  const overlay = document.createElement('div');
  overlay.id = 'badgesModal';
  overlay.className =
    'fixed inset-0 z-[300] hidden items-center justify-center p-4 sm:p-6 bg-zinc-900/10 dark:bg-black/50 backdrop-blur-sm';
  document.body.appendChild(overlay);

  const card = document.createElement('div');
  card.className =
    'rounded-2xl bg-white/90 dark:bg-zinc-900/90 ring-1 ring-zinc-300/60 dark:ring-white/10 p-4 w-[340px] sm:w-[420px] max-h-[80vh] overflow-auto';
  overlay.appendChild(card);

  const actionRow = document.createElement('div');
  actionRow.className = 'flex items-center justify-between';
  card.appendChild(actionRow);

  const resetBadgesButton = document.createElement('button');
  resetBadgesButton.id = 'resetBadges';
  resetBadgesButton.className =
    'rounded-lg bg-rose-600/90 px-3 py-1.5 text-sm text-zinc-900 dark:text-white cursor-pointer';
  resetBadgesButton.textContent = t('reset_badges_button');
  actionRow.appendChild(resetBadgesButton);

  const saveBadgeChangesButton = document.createElement('button');
  saveBadgeChangesButton.id = 'saveBadgeChanges';
  saveBadgeChangesButton.className =
    'inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-zinc-900 dark:text-white cursor-pointer';
  saveBadgeChangesButton.textContent = '✓';
  actionRow.appendChild(saveBadgeChangesButton);

  const circlesWrap = document.createElement('div');
  circlesWrap.className = 'mt-3 grid grid-cols-3 gap-4';
  card.appendChild(circlesWrap);

  let badgeData = {};
  const circles = [];
  const badgeTypeMap = {};
  let activeCircle = null;
  let preloadedRewards = preloadedBadges;

  const rewardsContainer = document.createElement('div');
  rewardsContainer.id = 'rewardsContainer';
  rewardsContainer.className =
    'absolute z-[310] hidden max-h-56 w-60 overflow-auto rounded-xl bg-white/95 dark:bg-zinc-900/95 p-2 text-sm ring-1 ring-zinc-300/60 dark:ring-white/10 shadow-xl';
  document.body.appendChild(rewardsContainer);

  resetBadgesButton.addEventListener('click', () => {
    circles.forEach((circle, index) => {
      circle.innerHTML = (index + 1).toString();
      circle.title = '';
      badgeData[`badge_name${index + 1}`] = null;
      badgeData[`badge_type${index + 1}`] = null;
      badgeData[`badge_url${index + 1}`] = null;
    });
  });

  for (let i = 0; i < 6; i++) {
    const circle = document.createElement('div');
    circle.className =
      'relative flex h-16 w-16 items-center justify-center rounded-full bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 text-sm ring-1 ring-zinc-300/60 dark:ring-white/10 hover:bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 cursor-pointer overflow-hidden';
    circle.textContent = (i + 1).toString();
    circlesWrap.appendChild(circle);
    circles.push(circle);

    circle.addEventListener('click', (event) => {
      event.stopPropagation();
      activeCircle = circle;

      if (preloadedRewards.length === 0) {
        toastError(t('no_badges_found'));
        return;
      }

      const rect = circle.getBoundingClientRect();
      rewardsContainer.style.left = `${rect.left + window.scrollX}px`;
      rewardsContainer.style.top = `${rect.bottom + 8 + window.scrollY}px`;
      rewardsContainer.innerHTML = '';
      rewardsContainer.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));

      preloadedRewards.forEach((badge) => {
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'badge-items w-full rounded-lg px-3 py-2 text-left hover:bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10';
        row.textContent = `${badge.name} (${badge.rarity})`;
        row.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!activeCircle) return;
          activeCircle.innerHTML = '';
          const img = document.createElement('img');
          img.src = cdnifyAssetUrl(badge.url);
          img.alt = badge.name || '';
          img.className = 'h-full w-full rounded-full object-cover';
          activeCircle.appendChild(img);
          rewardsContainer.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
          activeCircle = null;
        });
        rewardsContainer.appendChild(row);
      });
    });
  }

  const fetchEquippedBadges = () => {
    const applyFromSlots = (slots) => {
      circles.forEach((circle, idx) => {
        circle.innerHTML = '';
        const slot = slots[idx];
        if (slot && slot.url) {
          const img = document.createElement('img');
          img.src = cdnifyAssetUrl(slot.url);
          img.alt = slot.name || '';
          img.className = 'h-full w-full rounded-full object-cover';
          circle.appendChild(img);
        } else {
          circle.textContent = (idx + 1).toString();
          circle.title = '';
        }
      });
    };

    if (Array.isArray(currentBadges) && currentBadges.length) {
      applyFromSlots(currentBadges);
      return;
    }

    const me = selectedUserId || getCurrentUserId();
    fetch(endpoints.rankcard.badges.get(me), { credentials: 'same-origin' })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        currentBadges = normalizeBadgeSlots(data);
        applyFromSlots(currentBadges);
      })
      .catch(() => {
        circles.forEach((c, idx) => {
          c.textContent = (idx + 1).toString();
          c.title = '';
        });
      });
  };

  const preloadRewards = () => {
    const me = getCurrentUserId();
    if (preloadedBadges.length) {
      preloadedRewards = preloadedBadges;
      preloadedRewards.forEach((b) => {
        badgeTypeMap[b.name] = b.type;
      });
      return;
    }
    fetch(endpoints.lootbox.userRewards(me), { credentials: 'same-origin' })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        preloadedRewards = data
          .filter((r) => r.type === 'spray' || r.type === 'mastery')
          .filter((r, i, s) => i === s.findIndex((x) => x.name === r.name));

        preloadedBadges = preloadedRewards.slice();

        preloadedRewards.forEach((b) => {
          badgeTypeMap[b.name] = b.type;
        });
        preloadedRewards.forEach((b) => {
          const img = new Image();
          img.src = cdnifyAssetUrl(b.url);
        });
      })
      .catch((e) => console.error('Error preloading rewards:', e));
  };

  function isHttpUrl(u) {
    try {
      const x = new URL(u);
      return x.protocol === 'http:' || x.protocol === 'https:';
    } catch {
      return false;
    }
  }

  saveBadgeChangesButton.addEventListener('click', () => {
    const me = selectedUserId || getCurrentUserId();

    fetch(endpoints.rankcard.badges.get(me), { credentials: 'same-origin' })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((existingBadges) => {
        const payload = {};
        for (let i = 0; i < 6; i++) {
          const idx = i + 1;
          const nameKey = `badge_name${idx}`;
          const typeKey = `badge_type${idx}`;
          const urlKey = `badge_url${idx}`;

          const circle = circles[i];
          const img = circle.querySelector('img');

          if (!img) {
            payload[nameKey] = null;
            payload[typeKey] = null;
            payload[urlKey] = null;
            continue;
          }

          const name = (img.alt || '').trim() || null;
          const type = name && badgeTypeMap[name] ? badgeTypeMap[name] : null;

          const src = img.src;
          const url = isHttpUrl(src) ? src : null;

          payload[nameKey] = name;
          payload[typeKey] = type;
          payload[urlKey] = url;
        }

        const submittedBadges = { ...payload };

        return fetch(endpoints.rankcard.badges.set(me), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify(payload),
        }).then(async (r) => {
          if (!r.ok) {
            const txt = await r.text();
            throw new Error(`Erreur API ${r.status} – ${txt}`);
          }
          return submittedBadges;
        });
      })
      .then((submittedBadges) => {
        updateBadgesContainer(submittedBadges);

        closeModal(overlay);
        toastSuccess(t('badges_saved'));

        fetch(endpoints.rankcard.badges.get(me), { credentials: 'same-origin' })
          .then((r) => (r.ok ? r.json() : null))
          .then((fresh) => {
            if (fresh) updateBadgesContainer(fresh);
          })
          .catch(() => {});
      })
      .catch((e) => {
        console.error(e);
        toastError(t('errors.badges_save_failed'));
      });
  });

  changeBadgesButton.addEventListener('click', () => {
    fetchEquippedBadges();
    preloadRewards();
    openModal(overlay);
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal(overlay);
      rewardsContainer.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    }
  });
  document.addEventListener('click', (e) => {
    if (!rewardsContainer.contains(e.target)) rewardsContainer.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
  });
}

function updateBadgesContainer(badges) {
  const grid = document.querySelector('.rank-card-container .badges-container .badges-grid');
  if (!grid) {
    console.error('.badges-grid introuvable');
    return;
  }

  const slots = Array.isArray(badges) ? badges : normalizeBadgeSlots(badges);
  const html = slots
    .filter((b) => b && b.url)
    .map(
      (b) => `
      <img src="${cdnifyAssetUrl(b.url)}" alt="${b.name || 'Badge'}"
           class="badge h-8 w-8 sm:h-10 sm:w-10 flex-none rounded-full ring-1 ring-zinc-300/60 dark:ring-white/10 object-cover">
    `
    )
    .join('');

  grid.innerHTML = html;
  restartBadgeAnimations(grid);
}

/* =========================
   BADGES PRELOAD
   ========================= */
let currentBadges = null;
let preloadedBadges = [];

function preloadBadgesPreview() {
  const me = getCurrentUserId();
  if (!me) return Promise.resolve();

  return fetch(endpoints.rankcard.badges.get(me), { credentials: 'same-origin' })
    .then((r) => {
      if (!r.ok) throw new Error(`Failed to fetch current badges ${r.status}`);
      return r.json();
    })
    .then((data) => {
      currentBadges = normalizeBadgeSlots(data);
      currentBadges
        .filter((b) => b && b.url)
        .forEach((b) => {
          const img = new Image();
          img.src = cdnifyAssetUrl(b.url);
        });
    })
    .catch((e) => {
      console.error('Erreur preload badges preview:', e);
      currentBadges = null;
    });
}

function preloadBadgesOptions() {
  const me = getCurrentUserId();
  if (!me) return Promise.resolve();

  if (preloadedBadges.length) return Promise.resolve(preloadedBadges);

  return fetch(endpoints.lootbox.userRewards(me), { credentials: 'same-origin' })
    .then((r) => {
      if (!r.ok) throw new Error('Failed to fetch user rewards for badges');
      return r.json();
    })
    .then((data) => {
      preloadedBadges = data
        .filter((r) => r.type === 'spray' || r.type === 'mastery')
        .filter((r, i, s) => i === s.findIndex((x) => x.name === r.name));

      preloadedBadges.forEach((b) => {
        const img = new Image();
        img.src = cdnifyAssetUrl(b.url);
      });

      return preloadedBadges;
    })
    .catch((e) => {
      console.error('Erreur preload badges options:', e);
      preloadedBadges = [];
    });
}

/* =========================
   BACKGROUND EDIT
   ========================= */
function initBackgroundChanges() {
  const changeBackgroundButton = byId('changeBackground');

  const overlay = document.createElement('div');
  overlay.id = 'backgroundModal';
  overlay.className =
    'fixed inset-0 z-[300] hidden items-center justify-center p-4 sm:p-6 bg-zinc-900/10 dark:bg-black/50 backdrop-blur-sm';
  document.body.appendChild(overlay);

  const holder = document.createElement('div');
  holder.id = 'backgroundContainer';
  holder.className =
    'flex w-[360px] sm:w-[420px] flex-col gap-3 rounded-2xl bg-white/90 dark:bg-zinc-900/90 p-4 ring-1 ring-zinc-300/60 dark:ring-white/10 max-h-[88vh] overflow-auto';
  overlay.appendChild(holder);

  const actions = document.createElement('div');
  actions.className = 'flex items-center justify-between';
  holder.appendChild(actions);

  const resetBtn = document.createElement('button');
  resetBtn.id = 'resetBackground';
  resetBtn.textContent = t('reset_background_button');
  resetBtn.className = 'rounded-lg bg-rose-600/90 px-3 py-1.5 text-sm text-zinc-900 dark:text-white cursor-pointer';
  actions.appendChild(resetBtn);

  const saveBtn = document.createElement('button');
  saveBtn.id = 'saveBackgroundChanges';
  saveBtn.textContent = '✓';
  saveBtn.className =
    'inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-zinc-900 dark:text-white cursor-pointer';
  actions.appendChild(saveBtn);

  let selectedBackground = null;

  const preview = document.createElement('div');
  preview.id = 'backgroundPreview';
  preview.className =
    'relative flex h-28 w-full items-center justify-center rounded-xl bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 text-sm font-bold text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-300/60 dark:ring-white/10';
  preview.textContent = '+';
  holder.appendChild(preview);

  const options = document.createElement('div');
  options.id = 'backgroundOptions';
  options.className =
    'absolute z-[310] hidden max-h-60 w-[320px] overflow-auto rounded-xl bg-white/95 dark:bg-zinc-900/95 p-2 text-sm ring-1 ring-zinc-300/60 dark:ring-white/10 shadow-xl';
  document.body.appendChild(options);

  resetBtn.addEventListener('click', () => {
    selectedBackground = null;
    preview.style.backgroundImage = 'none';
    preview.textContent = '+';
  });

  const displayBackgroundOptions = () => {
    if (preloadedBackgrounds.length === 0) {
      toastError(t('no_backgrounds_found'));
      return;
    }

    options.innerHTML = '';
    preloadedBackgrounds.forEach((bg) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'background-option w-full rounded-lg px-3 py-2 text-left hover:bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10';
      row.textContent = `${bg.name} (${bg.rarity})`;
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedBackground = { name: bg.name, url: cdnifyAssetUrl(bg.url) };
        preview.style.backgroundImage = `url(${cdnifyAssetUrl(bg.url)})`;
        preview.style.backgroundSize = 'cover';
        preview.style.backgroundPosition = 'center';
        preview.textContent = '';
        options.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
      });
      options.appendChild(row);
    });

    const rect = preview.getBoundingClientRect();
    options.style.top = `${rect.bottom + 8 + window.scrollY}px`;
    options.style.left = `${rect.left + window.scrollX}px`;
    options.style.width = `${rect.width}px`;
    options.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
  };

  preview.addEventListener('click', () => {
    if (options.classList.contains('hidden')) displayBackgroundOptions();
    else options.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
  });

  saveBtn.addEventListener('click', () => {
    if (!selectedBackground) selectedBackground = { name: 'placeholder' };
    const payload = { name: selectedBackground.name };
    const me = selectedUserId || getCurrentUserId();

    fetch(endpoints.rankcard.background.set(me), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payload),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`Erreur API: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        closeModal(overlay);
        if (data.url) {
          updateBackgroundContainer(data);
          preview.style.backgroundImage = `url(${cdnifyAssetUrl(data.url)})`;
          preview.textContent = '';
          currentBackground = { url: data.url, name: data.name || 'placeholder' };
          toastSuccess(t('background_saved'));
        } else {
          console.error('Aucune URL valide');
        }
      })
      .catch((e) => {
        console.error('Erreur sauvegarde bg:', e);
        toastError(t('errors.background_save_failed'));
      });
  });

  changeBackgroundButton.addEventListener('click', () => {
    if (currentBackground) {
      preview.style.backgroundImage = `url(${currentBackground.url})`;
      preview.style.backgroundSize = 'cover';
      preview.style.backgroundPosition = 'center';
      preview.textContent = '';
    } else {
      preview.style.backgroundImage = 'none';
      preview.textContent = '+';
    }
    openModal(overlay);
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal(overlay);
      options.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    }
  });
}

function updateBackgroundContainer(res) {
  const bg = document.querySelector('.background');
  if (!bg) {
    console.error('El .background introuvable');
    return;
  }
  bg.innerHTML = '';
  if (!res || !res.url) {
    console.error('Données background invalides:', res);
    return;
  }
  const img = document.createElement('img');
  img.src = cdnifyAssetUrl(res.url);
  img.alt = res.name || t('alts.background');
  img.className = 'background-image h-full w-full object-cover';
  bg.appendChild(img);
}

/* =========================
   BACKGROUND PRELOAD
   ========================= */
function preloadBackgroundPreview() {
  const me = getCurrentUserId();
  if (!me) return Promise.resolve();

  return fetch(endpoints.rankcard.background.get(me), { credentials: 'same-origin' })
    .then((r) => {
      if (!r.ok) throw new Error(`Failed to fetch current background ${r.status}`);
      return r.json();
    })
    .then((data) => {
      if (data && data.url) {
        currentBackground = { url: data.url, name: data.name || 'Default Background' };
      } else {
        currentBackground = null;
      }
    })
    .catch((e) => {
      console.error('Erreur preload bg:', e);
      currentBackground = null;
    });
}

function preloadBackgroundsOptions() {
  const me = getCurrentUserId();
  if (!me) return Promise.resolve();

  return fetch(endpoints.lootbox.userRewards(me), { credentials: 'same-origin' })
    .then((r) => {
      if (!r.ok) throw new Error('Failed to fetch user rewards');
      return r.json();
    })
    .then((data) => {
      preloadedBackgrounds = data.filter((r) => r.type === 'background');
      preloadedBackgrounds.forEach((bg) => {
        const img = new Image();
        img.src = cdnifyAssetUrl(bg.url);
      });
    })
    .catch((e) => console.error('Erreur preload bg options:', e));
}

/* =========================
   AVATAR EDIT
   ========================= */
function initAvatarChanges() {
  const changeAvatarButton = byId('changeAvatar');

  const overlay = document.createElement('div');
  overlay.id = 'avatarModal';
  overlay.className =
    'fixed inset-0 z-[300] hidden items-center justify-center p-4 sm:p-6 bg-zinc-900/10 dark:bg-black/50 backdrop-blur-sm';
  document.body.appendChild(overlay);

  const container = document.createElement('div');
  container.id = 'avatarContainer';
  container.className =
    'flex w-[360px] sm:w-[420px] flex-col gap-3 rounded-2xl bg-white/90 dark:bg-zinc-900/90 p-4 pb-2 ring-1 ring-zinc-300/60 dark:ring-white/10 max-h-[80vh] overflow-auto';
  overlay.appendChild(container);

  const topRow = document.createElement('div');
  topRow.className = 'flex items-center justify-between';
  container.appendChild(topRow);

  const resetBtn = document.createElement('button');
  resetBtn.id = 'resetAvatar';
  resetBtn.textContent = t('reset_avatar_button');
  resetBtn.className = 'rounded-lg bg-rose-600/90 px-3 py-1.5 text-sm text-zinc-900 dark:text-white cursor-pointer';
  topRow.appendChild(resetBtn);

  const saveBtn = document.createElement('button');
  saveBtn.id = 'saveAvatarChanges';
  saveBtn.textContent = '✓';
  saveBtn.className =
    'inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-zinc-900 dark:text-white cursor-pointer hover:bg-emerald-400';
  topRow.appendChild(saveBtn);

  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'avatar-button-group mt-1 flex items-center gap-3';
  container.appendChild(buttonGroup);

  const BTN_BASE =
    'rounded-lg border border-zinc-200/80 dark:border-white/10 px-3 py-2 text-sm transition-colors cursor-pointer';
  const BTN_INACTIVE = 'bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 text-zinc-900 dark:text-zinc-100 hover:bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10';
  const BTN_ACTIVE = 'bg-white text-zinc-900 hover:bg-zinc-100';

  const changeSkinButton = document.createElement('button');
  changeSkinButton.id = 'changeSkinButton';
  changeSkinButton.textContent = t('change_skin_button');
  changeSkinButton.className = `${BTN_BASE} ${BTN_INACTIVE}`;
  buttonGroup.appendChild(changeSkinButton);

  const changePoseButton = document.createElement('button');
  changePoseButton.id = 'changePoseButton';
  changePoseButton.textContent = t('change_pose_button');
  changePoseButton.className = `${BTN_BASE} ${BTN_INACTIVE}`;
  buttonGroup.appendChild(changePoseButton);

  const skinPreview = document.createElement('div');
  skinPreview.id = 'avatarSkinPreview';
  skinPreview.className =
    'hidden h-56 sm:h-64 w-full items-center justify-center rounded-xl bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 text-sm font-bold text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-300/60 dark:ring-white/10 bg-no-repeat bg-center';
  skinPreview.textContent = '+';
  container.appendChild(skinPreview);

  const posePreview = document.createElement('div');
  posePreview.id = 'avatarPosePreview';
  posePreview.className =
    'hidden h-56 sm:h-64 w-full items-center justify-center rounded-xl bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 text-sm font-bold text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-300/60 dark:ring-white/10 bg-no-repeat bg-center';
  posePreview.textContent = '+';
  container.appendChild(posePreview);

  const options = document.createElement('div');
  options.id = 'avatarOptions';
  options.className =
    'absolute z-[310] hidden max-h-60 w-full overflow-auto rounded-xl bg-white/95 dark:bg-zinc-900/95 p-2 text-sm ring-1 ring-zinc-300/60 dark:ring-white/10 shadow-xl';
  document.body.appendChild(options);

  let selectedSkin = null;
  let selectedPose = null;
  let currentSkin = 'Overwatch 1';
  let currentPose = 'heroic';

  const toggleActiveClass = (btn) => {
    changeSkinButton.className = `${BTN_BASE} ${BTN_INACTIVE}`;
    changePoseButton.className = `${BTN_BASE} ${BTN_INACTIVE}`;
    btn.className = `${BTN_BASE} ${BTN_ACTIVE}`;

    if (btn === changeSkinButton) {
      skinPreview.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
      skinPreview.classList.add(...String('flex').trim().split(/\s+/).filter(Boolean));
      posePreview.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
      posePreview.classList.remove(...String('flex').trim().split(/\s+/).filter(Boolean));
    } else {
      posePreview.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
      posePreview.classList.add(...String('flex').trim().split(/\s+/).filter(Boolean));
      skinPreview.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
      skinPreview.classList.remove(...String('flex').trim().split(/\s+/).filter(Boolean));
    }
  };

  const fetchCurrentAvatar = () => {
    const me = selectedUserId || getCurrentUserId();
    Promise.all([
      fetch(endpoints.rankcard.avatar.skin.get(me), { credentials: 'same-origin' }).then((r) =>
        r.json()
      ),
      fetch(endpoints.rankcard.avatar.pose.get(me), { credentials: 'same-origin' }).then((r) =>
        r.json()
      ),
    ])
      .then(([skinData, poseData]) => {
        if (skinData.url) {
          currentSkin = skinData.skin || currentSkin;
          skinPreview.style.backgroundImage = `url(${cdnifyAssetUrl(skinData.url)})`;
          skinPreview.style.backgroundSize = 'contain';
          skinPreview.style.backgroundPosition = 'center';
          skinPreview.style.backgroundRepeat = 'no-repeat';
          skinPreview.textContent = '';
        } else {
          skinPreview.style.backgroundImage = 'none';
          skinPreview.textContent = '+';
        }

        if (poseData.url) {
          currentPose = poseData.pose || currentPose;
          posePreview.style.backgroundImage = `url(${cdnifyAssetUrl(poseData.url)})`;
          posePreview.style.backgroundSize = 'contain';
          posePreview.style.backgroundPosition = 'center';
          posePreview.style.backgroundRepeat = 'no-repeat';
          posePreview.textContent = '';
        } else {
          posePreview.style.backgroundImage = 'none';
          posePreview.textContent = '+';
        }
      })
      .catch((e) => console.error('Erreur avatar actuel:', e));
  };

  const displayAvatarOptions = (type) => {
    const list = type === 'skin' ? availableAvatars.skins : availableAvatars.poses;
    if (!list || list.length === 0) {
      toastError(t('no_type_found', { type }));
      return;
    }

    options.innerHTML = '';
    const anchor = type === 'skin' ? skinPreview : posePreview;
    const rect = anchor.getBoundingClientRect();

    list.forEach((item) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'avatar-option w-full rounded-lg px-3 py-2 text-left hover:bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10';
      row.textContent = `${item.name} (${item.rarity})`;
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        if (type === 'skin') {
          selectedSkin = item.name;
          skinPreview.style.backgroundImage = `url(${cdnifyAssetUrl(item.url)})`;
          skinPreview.style.backgroundSize = 'contain';
          skinPreview.style.backgroundPosition = 'center';
          skinPreview.style.backgroundRepeat = 'no-repeat';
          skinPreview.textContent = '';
        } else {
          selectedPose = item.name;
          posePreview.style.backgroundImage = `url(${cdnifyAssetUrl(item.url)})`;
          posePreview.style.backgroundSize = 'contain';
          posePreview.style.backgroundPosition = 'center';
          posePreview.style.backgroundRepeat = 'no-repeat';
          posePreview.textContent = '';
        }
        options.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
      });
      options.appendChild(row);
    });

    options.style.top = `${rect.bottom + 8 + window.scrollY}px`;
    options.style.left = `${rect.left + window.scrollX}px`;
    options.style.width = `${rect.width}px`;
    options.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
  };

  skinPreview.addEventListener('click', () => displayAvatarOptions('skin'));
  posePreview.addEventListener('click', () => displayAvatarOptions('pose'));
  changeSkinButton.addEventListener('click', () => toggleActiveClass(changeSkinButton));
  changePoseButton.addEventListener('click', () => toggleActiveClass(changePoseButton));

  resetBtn.addEventListener('click', () => {
    selectedSkin = 'Overwatch 1';
    selectedPose = 'heroic';
    const formattedSkin = selectedSkin.toLowerCase().replace(/ /g, '_');
    const url = `${cdnImage('assets/rank_card/avatar/')}${formattedSkin}/${selectedPose}.webp`;
    skinPreview.style.backgroundImage = `url(${url})`;
    skinPreview.style.backgroundSize = 'contain';
    skinPreview.style.backgroundPosition = 'center';
    skinPreview.style.backgroundRepeat = 'no-repeat';
    skinPreview.textContent = '';
    posePreview.style.backgroundImage = `url(${url})`;
    posePreview.style.backgroundSize = 'contain';
    posePreview.style.backgroundPosition = 'center';
    posePreview.style.backgroundRepeat = 'no-repeat';
    posePreview.textContent = '';
    updatePlayerAvatar({ name: selectedSkin, url });
  });

  saveBtn.addEventListener('click', () => {
    const tasks = [];
    const me = selectedUserId || getCurrentUserId();
    if (selectedSkin && selectedSkin !== currentSkin) {
      tasks.push(
        fetch(endpoints.rankcard.avatar.skin.set(me), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ skin: selectedSkin }),
        })
      );
    }
    if (selectedPose && selectedPose !== currentPose) {
      tasks.push(
        fetch(endpoints.rankcard.avatar.pose.set(me), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ pose: selectedPose }),
        })
      );
    }

    Promise.all(tasks)
      .then((res) => {
        if (res.length && res.some((r) => !r.ok))
          throw new Error('Erreur lors de la sauvegarde des avatars.');
        return Promise.all(res.map((r) => r.json()));
      })
      .then(() => {
        const skin = (selectedSkin || currentSkin).toLowerCase().replace(/ /g, '_');
        const pose = (selectedPose || currentPose).toLowerCase().replace(/ /g, '_');
        updatePlayerAvatar({
          name: selectedSkin || currentSkin,
          url: `${cdnImage('assets/rank_card/avatar/')}${skin}/${pose}.webp`,
        });
        toastSuccess(t('avatar_saved'));
        closeModal(overlay);
        selectedSkin = null;
        selectedPose = null;
      })
      .catch((e) => {
        console.error('Erreur sauvegarde avatar:', e);
        toastError(t('errors.avatar_save_failed'));
      });
  });

  changeAvatarButton.addEventListener('click', () => {
    openModal(overlay);
    fetchCurrentAvatar();
    toggleActiveClass(changeSkinButton);
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal(overlay);
      options.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    }
  });
}

function updatePlayerAvatar(data) {
  const img = document.querySelector('.player-avatar');
  if (!img) {
    console.error('.player-avatar introuvable.');
    return;
  }
  if (!data || !data.url) {
    console.error('Avatar data invalide:', data);
    return;
  }
  img.src = cdnifyAssetUrl(data.url);
  img.alt = data.name || t('alts.player_avatar');
}

/* =========================
   AVATAR PRELOAD
   ========================= */
function preloadAvatarPreviews() {
  const skinPreview = byId('avatarSkinPreview');
  const posePreview = byId('avatarPosePreview');
  const me = selectedUserId || getCurrentUserId();
  if (!me) return Promise.resolve();

  if (skinPreview) {
    fetch(endpoints.rankcard.avatar.skin.get(me), { credentials: 'same-origin' })
      .then((r) => {
        if (!r.ok) throw new Error(t('errors.skins_fetch_failed'));
        return r.json();
      })
      .then((data) => {
        if (data?.url) {
          skinPreview.style.backgroundImage = `url(${cdnifyAssetUrl(data.url)})`;
          skinPreview.style.backgroundSize = 'contain';
          skinPreview.style.backgroundPosition = 'center';
          skinPreview.style.backgroundRepeat = 'no-repeat';
          skinPreview.classList.add(...String('flex').trim().split(/\s+/).filter(Boolean));
          skinPreview.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
          skinPreview.textContent = '';
        }
      })
      .catch((e) => console.error('Préload avatarSkinPreview:', e));
  }

  if (posePreview) {
    fetch(endpoints.rankcard.avatar.pose.get(me), { credentials: 'same-origin' })
      .then((r) => {
        if (!r.ok) throw new Error(t('errors.poses_fetch_failed'));
        return r.json();
      })
      .then((data) => {
        if (data?.url) {
          posePreview.style.backgroundImage = `url(${cdnifyAssetUrl(data.url)})`;
          posePreview.style.backgroundSize = 'contain';
          posePreview.style.backgroundPosition = 'center';
          posePreview.style.backgroundRepeat = 'no-repeat';
          posePreview.classList.add(...String('flex').trim().split(/\s+/).filter(Boolean));
          posePreview.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
          posePreview.textContent = '';
        }
      })
      .catch((e) => console.error('Préload avatarPosePreview:', e));
  }
}

function preloadAvatarOptions() {
  const me = selectedUserId || getCurrentUserId();
  if (!me) return Promise.resolve();

  return fetch(endpoints.lootbox.userRewards(me), { credentials: 'same-origin' })
    .then((r) => {
      if (!r.ok) throw new Error(t('errors.rewards_fetch_failed'));
      return r.json();
    })
    .then((data) => {
      availableAvatars.skins = data.filter((r) => r.type === 'skin');
      availableAvatars.poses = data.filter((r) => r.type === 'pose');
      availableAvatars.skins.forEach((s) => {
        const img = new Image();
        img.src = cdnifyAssetUrl(s.url);
      });
      availableAvatars.poses.forEach((p) => {
        const img = new Image();
        img.src = cdnifyAssetUrl(p.url);
      });
    })
    .catch((e) => console.error('Préload options avatar:', e));
}

/* =========================
   REWARDS PRELOAD (UNIQUE)
   ========================= */
function preloadAllRewards() {
  const me = getCurrentUserId();
  if (!me) return Promise.resolve();
  if (__rewardsPromise) return __rewardsPromise;

  __rewardsPromise = fetch(endpoints.lootbox.userRewards(me), { credentials: 'same-origin' })
    .then((r) => {
      if (!r.ok) throw new Error('Failed to fetch user rewards');
      return r.json();
    })
    .then((data) => {
      availableAvatars.skins = data.filter((r) => r.type === 'skin');
      availableAvatars.poses = data.filter((r) => r.type === 'pose');
      preloadedBackgrounds = data.filter((r) => r.type === 'background');
      preloadedBadges = data
        .filter((r) => r.type === 'spray' || r.type === 'mastery')
        .filter((r, i, s) => i === s.findIndex((x) => x.name === r.name));

      [
        ...availableAvatars.skins,
        ...availableAvatars.poses,
        ...preloadedBackgrounds,
        ...preloadedBadges,
      ].forEach((it) => {
        if (it?.url) {
          const img = new Image();
          img.src = cdnifyAssetUrl(it.url);
        }
      });

      rewardsReady = true;
      updateButtonContainerVisibility();
      return data;
    })
    .catch((e) => console.error('Erreur preload rewards:', e));

  return __rewardsPromise;
}

/* =========================
   INTERACTIVITY
   ========================= */
function openModal(overlayEl) {
  if (!overlayEl) return;
  const panel = overlayEl.firstElementChild;
  overlayEl.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
  overlayEl.classList.add(...String('flex').trim().split(/\s+/).filter(Boolean));

  overlayEl.style.opacity = 0;
  if (panel) {
    panel.style.transform = 'translateY(8px) scale(0.97)';
    panel.style.opacity = 0;
  }

  requestAnimationFrame(() => {
    overlayEl.style.transition = 'opacity 200ms ease-out';
    if (panel) panel.style.transition = 'transform 200ms ease-out, opacity 200ms ease-out';

    overlayEl.style.opacity = 1;
    if (panel) {
      panel.style.transform = 'translateY(0) scale(1)';
      panel.style.opacity = 1;
    }
  });
}

function closeModal(overlayEl) {
  if (!overlayEl || overlayEl.classList.contains('hidden')) return;
  const panel = overlayEl.firstElementChild;

  overlayEl.style.transition = 'opacity 150ms ease-in';
  if (panel) panel.style.transition = 'transform 150ms ease-in, opacity 150ms ease-in';

  overlayEl.style.opacity = 0;
  if (panel) {
    panel.style.transform = 'translateY(8px) scale(0.97)';
    panel.style.opacity = 0;
  }

  const onEnd = () => {
    overlayEl.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    overlayEl.classList.remove(...String('flex').trim().split(/\s+/).filter(Boolean));

    overlayEl.style.opacity = '';
    overlayEl.style.transition = '';
    if (panel) {
      panel.style.transform = '';
      panel.style.opacity = '';
      panel.style.transition = '';
      panel.removeEventListener('transitionend', onEnd);
    }
  };
  (panel || overlayEl).addEventListener('transitionend', onEnd, { once: true });
}

function openDropdown(el) {
  if (!el || !el.classList.contains('hidden')) return;
  el.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));

  el.style.transformOrigin = 'top center';
  el.style.opacity = 0;
  el.style.transform = 'translateY(4px) scale(0.98)';

  requestAnimationFrame(() => {
    el.style.transition = 'opacity 140ms ease-out, transform 140ms ease-out';
    el.style.opacity = 1;
    el.style.transform = 'translateY(0) scale(1)';
  });
}

function closeDropdown(el) {
  if (!el || el.classList.contains('hidden')) return;
  el.style.transition = 'opacity 120ms ease-in, transform 120ms ease-in';
  el.style.opacity = 0;
  el.style.transform = 'translateY(4px) scale(0.98)';

  const done = () => {
    el.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    el.style.transition = '';
    el.style.opacity = '';
    el.style.transform = '';
    el.removeEventListener('transitionend', done);
  };
  el.addEventListener('transitionend', done, { once: true });
}

/* =========================
   SKELETON (RANK CARD)
   ========================= */
function rankCardSkeletonHTML() {
  return `
    <div class="rank-card-container relative">
      <div class="relative overflow-hidden rounded-2xl ring-1 ring-zinc-300/60 dark:ring-white/10">
        <!-- BG (même wrapper .background que le rendu réel) -->
        <div class="background absolute inset-0">
          <div class="h-full w-full bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10"></div>
        </div>
        <div class="absolute top-3 right-3 z-20 flex max-w-[calc(100%-1.5rem)] flex-wrap justify-end gap-1 rounded-xl border border-white/10 bg-black/35 p-1 shadow-lg backdrop-blur">
          ${RANK_CARD_VISIBLE_FILTER_OPTIONS.map((_, index) => `
            <div class="h-[26px] rounded-lg ${index === 0 ? 'w-28 bg-white/70' : 'w-24 bg-white/20'} animate-pulse"></div>
          `).join('')}
        </div>

        <div class="relative content-rankcard p-4 pt-24 sm:p-6 sm:pt-16 bg-gradient-to-b from-black/30 via-black/20 to-black/30">

          <!-- Titre joueur -->
          <div class="player-name font-banksans text-center text-2xl sm:text-5xl font-extrabold tracking-tight">
            <div class="mx-auto h-[1.2em] w-56 sm:w-72 rounded bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 animate-pulse"></div>
          </div>

          <!-- Grille identique -->
          <div class="main-container mt-4 grid gap-4 grid-cols-1 md:grid-cols-[1fr_320px] items-start">

            <!-- Colonne gauche -->
            <div class="rank-details-container md:col-start-1 md:row-start-1 space-y-4">
              <div class="rank-section-container min-h-[410px] rounded-xl bg-zinc-900/5 dark:bg-black/30 ring-1 ring-zinc-300/60 dark:ring-white/10 p-3 sm:p-4 backdrop-blur flex flex-col overflow-hidden">

                <!-- Médailles -->
                <div class="rank-section space-y-3">
                  <div class="medals-header grid items-center text-sm text-zinc-900 dark:text-white/80 gap-0.5 sm:gap-2
                    grid-cols-[max-content_1fr_minmax(1.25rem,auto)_minmax(1.25rem,auto)_minmax(1.25rem,auto)]
                    sm:grid-cols-[8rem_1fr_minmax(2rem,auto)_minmax(2rem,auto)_minmax(2rem,auto)]">
                    <span class="col-start-1 col-end-2"></span>
                    <span class="col-start-2 col-end-3"></span>
                    <span class="mx-auto h-4 w-4 rounded-full bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 animate-pulse"></span>
                    <span class="mx-auto h-4 w-4 rounded-full bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 animate-pulse"></span>
                    <span class="mx-auto h-4 w-4 rounded-full bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 animate-pulse"></span>
                  </div>

                  <!-- Difficultés -->
                  ${Array.from({ length: 6 }).map(() => `
                    <div class="rank-row grid items-center gap-0.5 sm:gap-2
                      grid-cols-[max-content_1fr_minmax(1.25rem,auto)_minmax(1.25rem,auto)_minmax(1.25rem,auto)]
                      sm:grid-cols-[8rem_1fr_minmax(2rem,auto)_minmax(2rem,auto)_minmax(2rem,auto)]">
                      <span class="h-4 w-24 rounded bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 animate-pulse"></span>
                      <div class="relative group w-full">
                        <div class="progress-bar relative h-2 w-full overflow-hidden rounded bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 ring-1 ring-zinc-300/60 dark:ring-white/10">
                          <div class="absolute left-0 top-0 h-full w-1/3 bg-white/45 dark:bg-zinc-900/10 dark:bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                      <span class="mx-auto h-4 w-6 rounded bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 animate-pulse"></span>
                      <span class="mx-auto h-4 w-6 rounded bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 animate-pulse"></span>
                      <span class="mx-auto h-4 w-6 rounded bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 animate-pulse"></span>
                    </div>
                  `).join('')}
                </div>

                <!-- Stats inline -->
                <div class="inline-stats mt-3 grid grid-cols-2 gap-2 xl:grid-cols-4">
                  ${Array.from({ length: 4 }).map(() => `
                    <div class="rounded-lg bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 p-2 ring-1 ring-zinc-300/60 dark:ring-white/10 text-center">
                      <div class="mx-auto h-3 w-16 rounded bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 animate-pulse"></div>
                      <div class="mx-auto mt-2 h-5 w-10 rounded bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 animate-pulse"></div>
                    </div>
                  `).join('')}
                </div>

                <!-- Bas: badges + mini stats -->
                <div class="combined-container mt-3 grid gap-4 md:grid-cols-2 items-stretch">
                  <div class="badges-container rounded-xl bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 p-2 ring-1 ring-zinc-300/60 dark:ring-white/10 min-w-0 overflow-hidden">
                    <div class="badges-grid grid grid-cols-[repeat(auto-fit,minmax(2.5rem,1fr))] gap-2 sm:gap-3 place-items-center">
                      ${Array.from({ length: 8 }).map(() => `
                        <div class="badge h-10 w-10 rounded-full bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 animate-pulse"></div>
                      `).join('')}
                    </div>
                  </div>

                  <div class="stats-section grid grid-cols-3 gap-2 rounded-xl bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 p-2 ring-1 ring-zinc-300/60 dark:ring-white/10">
                    ${Array.from({ length: 3 }).map(() => `
                      <div class="stat-item text-center">
                        <div class="mx-auto h-3 w-16 rounded bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 animate-pulse"></div>
                        <div class="mx-auto mt-2 h-5 w-10 rounded bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 animate-pulse"></div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>

            <!-- Colonne droite -->
            <div class="player-info min-h-[410px] md:col-start-2 md:row-start-1 flex flex-col items-center justify-start gap-3 rounded-xl bg-zinc-900/5 dark:bg-black/30 p-4 ring-1 ring-zinc-300/60 dark:ring-white/10 backdrop-blur overflow-hidden">
              <div class="inline-flex items-center gap-2">
                <div class="h-4 w-28 rounded bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 animate-pulse"></div>
                <div class="h-5 w-5 rounded bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 animate-pulse"></div>
              </div>

              <div class="player-avatar mt-4 w-full max-w-[240px]">
                <div class="w-full rounded-lg bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 animate-pulse aspect-[3/4] sm:aspect-[2/3]"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `;
}

function renderRankCardSkeleton() {
  const el = byId('rankCardContent');
  if (!el) return;
  lockRankCardContentHeight(el);
  el.innerHTML = rankCardSkeletonHTML();
  if (el.classList.contains('hidden')) {
    revealRankCardContainer();
  }
}
