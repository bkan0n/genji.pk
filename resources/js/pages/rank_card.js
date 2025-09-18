/* =========================
   Endpoints
   ========================= */
const endpoints = {
  rankcard: {
    data: (userId) => `/api/users/${encodeURIComponent(userId)}/rank-card`,

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

  autocomplete: { users: (q) => `/api/autocomplete/users?value=${encodeURIComponent(q)}` },
};

/* =========================
   CONFIG & UTILS
   ========================= */
const MEDAL_ICON = {
  gold: 'assets/medals/gold.png',
  silver: 'assets/medals/silver.png',
  bronze: 'assets/medals/bronze.png',
};

let selectedUserId = null;
const CURRENT_LANG = document.documentElement.lang || 'en';
let translations = window.RANK_CARD_I18N || {};
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

  badgeMasteryContent.classList.add('hidden');
  btnRankCard.classList.add('active');

  const disableButtons = () => {
    [btnRankCard, btnBadges, searchButton, resetFilter].forEach((b) => {
      b.disabled = true;
      b.classList.add('cursor-not-allowed', 'opacity-50');
    });
  };
  const enableButtons = () => {
    [btnRankCard, btnBadges, searchButton, resetFilter].forEach((b) => {
      b.disabled = false;
      b.classList.remove('cursor-not-allowed', 'opacity-50');
    });
  };

  disableButtons();

  function toggleTabs(showContent, hideContent, activeBtn, inactiveBtn) {
    activeBtn.classList.add('active', 'bg-white', 'text-zinc-900', 'border-white/60');
    inactiveBtn.classList.remove('active', 'bg-white', 'text-zinc-900', 'border-white/60');
    inactiveBtn.classList.add('bg-white/5', 'hover:bg-white/10', 'text-white');
    showContent.classList.remove('hidden');
    hideContent.classList.add('hidden');

    const targetId = getTargetUserId();

    if (showContent.id === 'badgeMasteryContent') {
      if (!showContent.dataset.loadedFor || showContent.dataset.loadedFor !== String(targetId)) {
        if (targetId) {
          fetchUserMastery(targetId);
        }
        showContent.dataset.loadedFor = String(targetId || '');
      }
    } else if (showContent.id === 'rankCardContent') {
      if (!showContent.dataset.loadedFor || showContent.dataset.loadedFor !== String(targetId)) {
        if (targetId) {
          fetchUserRankCard(targetId);
        } else {
          loadRankCardContent();
        }
        showContent.dataset.loadedFor = String(targetId || '');
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

  searchButton.addEventListener('click', async () => {
    const input = byId('searchUserName');

    let userId = input?.dataset.userId || selectedUserId || null;
    const typed = (input?.value || '').trim();
    if (!userId && /^\d+$/.test(typed)) userId = typed;

    if (!userId) {
      toastError('Sélectionne un utilisateur dans la liste.');
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

    showLoadingBar();
    try {
      if (isBadgesTabActive) {
        hideRankCardContainer();
        badgeMasteryContent.classList.remove('hidden');
        badgeMasteryContent.classList.add('grid');
      } else {
        badgeMasteryContent.classList.add('hidden');
        badgeMasteryContent.classList.remove('grid');
      }

      if (isBadgesTabActive) {
        await fetchUserMastery(selectedUserId);
      } else {
        await fetchUserRankCard(selectedUserId, { silent: isBadgesTabActive, noSpinner: true });
        fetchUserMastery(selectedUserId);
      }

      rankCardContent.dataset.loadedFor = String(selectedUserId);
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

    showLoadingBar();

    if (wasBadgesTab) {
      hideRankCardContainer();
    } else {
      await loadRankCardContent();
    }

    const me = getCurrentUserId();
    setResetFilterEnabled(!!me);

    if (!me) {
      hideRankCardContainer();
      badgeMasteryContent.innerHTML = `<p class="text-sm text-white/70">Aucun badge trouvé.</p>`;
    } else {
      await fetchUserMastery(me);
      badgeMasteryContent.dataset.loadedFor = String(me);
    }

    if (wasBadgesTab) {
      badgeMasteryContent.classList.remove('hidden');
      badgeMasteryContent.classList.add('grid');
      rankCardContent.classList.add('hidden');
    } else {
      badgeMasteryContent.classList.add('hidden');
      badgeMasteryContent.classList.remove('grid');
    }

    updateButtonContainerVisibility();
    hideLoadingBar();
  });

  showLoadingBar();
  const me = getCurrentUserId();
  if (me) {
    preloadAllRewards();
    preloadBackgroundPreview();
    preloadAvatarPreviews();
    preloadBadgesPreview();
    fetchUserMastery(me);
  }

  initBadgesChanges();
  initBackgroundChanges();
  initAvatarChanges();
  createSearchSuggestions();

  const hasQueryId = typeof userIdFromUrl === 'string' && userIdFromUrl.trim() !== '';
  if (hasQueryId) {
    await fetchUserRankCard(userIdFromUrl.trim());
  } else if (me) {
    await loadRankCardContent();
  } else {
    hideLoadingBar();
    hideRankCardContainer();
  }

  enableButtons();
  updateButtonContainerVisibility();
}

/* =========================
   CSRF
   ========================= */
const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]')?.content || null;

(function patchFetchForCsrf() {
  if (!CSRF_TOKEN || typeof window.fetch !== 'function') return;

  const __origFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    const method = String(init.method || 'GET').toUpperCase();

    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      const headers = new Headers(init.headers || {});
      if (!headers.has('X-CSRF-TOKEN')) headers.set('X-CSRF-TOKEN', CSRF_TOKEN);
      if (!headers.has('X-Requested-With')) headers.set('X-Requested-With', 'XMLHttpRequest');
      if (!init.credentials) init.credentials = 'same-origin';
      init = { ...init, headers };
    }

    return __origFetch(input, init);
  };
})();

/* =========================
   HELPERS
   ========================= */
function byId(id) {
  return document.getElementById(id);
}

function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
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

  buttonContainer.classList.toggle('hidden', !shouldShow || nothingToShow);
  buttonContainer.classList.toggle('flex', shouldShow && !nothingToShow);

  setEditButtonsState(shouldShow && !nothingToShow);
  setResetFilterEnabled(!!currentUserId);
}

function animateValue(element, start, end, duration) {
  const range = end - start;
  let startTime = null;
  const step = (ts) => {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    element.textContent = Math.floor(progress * range + start);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function showLoadingBar() {
  const el = byId('loadingContainer');
  if (!el) return;
  el.classList.remove('hidden', 'opacity-0');
  el.classList.add('flex', 'opacity-100');
}

function hideLoadingBar() {
  const el = byId('loadingContainer');
  if (!el) return;
  el.classList.add('opacity-0');
  setTimeout(() => el.classList.add('hidden'), 200);
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
      el.classList.remove('bg-white/80');
      el.classList.add(color);
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
    b.classList.toggle('cursor-not-allowed', !effective);
    b.classList.toggle('opacity-50', !effective);

    const tipKey = t('loading_rewards');
    const msg = tipKey && tipKey !== 'loading_rewards' ? tipKey : 'Chargement des récompenses…';
    if (!effective) b.setAttribute('title', msg);
    else b.removeAttribute('title');
  });
}

function setResetFilterEnabled(enabled) {
  const btn = byId('resetFilter');
  if (!btn) return;
  btn.disabled = !enabled;
  btn.classList.toggle('disabled:cursor-not-allowed', !enabled);
  btn.classList.toggle('opacity-50', !enabled);
}

function revealRankCardContainer() {
  const el = byId('rankCardContent');
  if (!el) return;

  if (typeof updateButtonContainerVisibility === 'function') {
    updateButtonContainerVisibility();
  }

  el.classList.remove('hidden');
  el.classList.remove('gp-panel-leave', 'gp-panel-leave-to');
  el.classList.add('gp-panel-anim', 'gp-panel-enter');

  void el.getBoundingClientRect();
  el.classList.add('gp-panel-enter-to');
  const onEnd = (e) => {
    if (e.target !== el) return;
    el.classList.remove('gp-panel-enter', 'gp-panel-enter-to');
    el.removeEventListener('transitionend', onEnd);
  };
  el.addEventListener('transitionend', onEnd);
}

function hideRankCardContainer() {
  const el = byId('rankCardContent');
  if (!el || el.classList.contains('hidden')) return;

  el.classList.remove('gp-panel-enter', 'gp-panel-enter-to');

  el.classList.add('gp-panel-anim', 'gp-panel-leave');
  void el.getBoundingClientRect();
  el.classList.add('gp-panel-leave-to');
  const onEnd = (e) => {
    if (e.target !== el) return;
    el.classList.remove('gp-panel-leave', 'gp-panel-leave-to');
    el.classList.add('hidden');
    el.removeEventListener('transitionend', onEnd);
  };
  el.addEventListener('transitionend', onEnd);
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
    node.classList.add('opacity-0', 'translate-y-1');
  }, 1600);
  setTimeout(() => node.remove(), 2000);
}
function toastSuccess(msg) {
  toastBase(msg, 'bg-emerald-600/90 text-white ring-emerald-300/40');
}
function toastError(msg) {
  toastBase(msg, 'bg-rose-600/90 text-white ring-rose-300/40');
}

/* =========================
   I18N
   ========================= */
function t(path, params = {}) {
  const parts = path.split('.');
  let result = translations;
  for (const part of parts) {
    result = result?.[part];
    if (!result) break;
  }
  if (typeof result !== 'string') return path;
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

    const response = await fetch(endpoints.rankcard.data(me), { credentials: 'same-origin' });
    const data = await response.json();
    if (!data || data.error) {
      rankCardContent.innerHTML = '';
      hideRankCardContainer();
      hideLoadingBar();
      return;
    }

    rankCardContent.innerHTML = `
      <div class="rank-card-container relative">
        <div class="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
          <div class="background absolute inset-0">
            <img src="${data.background_url || 'default-background.webp'}" alt="Background" class="h-full w-full object-cover">
          </div>

          <div class="relative content-rankcard p-4 sm:p-6 bg-gradient-to-b from-black/30 via-black/20 to-black/30">
            <div class="player-name font-banksans text-center text-2xl sm:text-5xl font-extrabold tracking-tight">
              ${data.nickname}
            </div>

            <!-- items-stretch -> items-start -->
            <div class="main-container mt-4 grid gap-4 grid-cols-1 md:grid-cols-[1fr,320px] items-start">
              <!-- Colonne gauche -->
              <!-- suppression h-full -->
              <div class="rank-details-container md:col-start-1 md:row-start-1 space-y-4">
                <!-- suppression h-full -->
                <div class="rank-section-container rounded-xl bg-black/30 ring-1 ring-white/10 p-3 sm:p-4 backdrop-blur flex flex-col">
                  
                  <div class="rank-section space-y-3">
                    <div class="medals-header grid items-center text-sm text-white/80 gap-2
                      grid-cols-[8rem_1fr_minmax(2rem,auto)_minmax(2rem,auto)_minmax(2rem,auto)]">
                      <span class="col-start-1 col-end-2"></span>
                      <span class="col-start-2 col-end-3"></span>
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
                        <div class="rank-row grid items-center gap-2
                          grid-cols-[8rem_1fr_minmax(2rem,auto)_minmax(2rem,auto)_minmax(2rem,auto)]">
                          <span class="rank-title text-sm sm:text-base">
                            ${t('difficulties.' + key)}
                          </span>

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

                  <div class="inline-stats mt-3 grid gap-2 grid-cols-1 sm:grid-cols-3">
                    <div class="rounded-lg bg-white/5 p-2 ring-1 ring-white/10 text-center">
                      <span class="block text-xs text-white/70">${t('xp')}</span>
                      <span class="stat-value text-lg font-semibold" data-value="${Number(data.xp || 0)}">0</span>
                    </div>
                    <div class="rounded-lg bg-white/5 p-2 ring-1 ring-white/10 text-center">
                      <span class="block text-xs text-white/70">${t('prestige_level')}</span>
                      <span class="text-base font-semibold">${Number(data.prestige_level ?? 0)}</span>
                    </div>
                    <div class="rounded-lg bg-white/5 p-2 ring-1 ring-white/10 text-center">
                      <span class="block text-xs text-white/70">${t('community_rank')}</span>
                      <span class="text-base font-semibold">${data.community_rank || '—'}</span>
                    </div>
                  </div>

                  <!-- Bas -->
                  <div class="combined-container mt-3 grid gap-4 md:grid-cols-2 items-stretch">
                    <div class="badges-container rounded-xl bg-white/5 p-2 ring-1 ring-white/10 min-w-0 overflow-hidden">
                      <div class="badges-grid grid grid-cols-[repeat(auto-fit,minmax(2.5rem,1fr))] gap-2 sm:gap-3 place-items-center">
                        ${normalizeBadgeSlots(data.badges)
                          .filter((b) => !!b.url)
                          .map(
                            (b) => `
                              <img src="${b.url}" alt="${b.name || 'Badge'}"
                                    class="badge h-8 w-8 sm:h-10 sm:w-10 flex-none rounded-full ring-1 ring-white/10 object-cover">
                            `
                          )
                          .join('')}
                      </div>
                    </div>

                    <div class="stats-section grid grid-cols-3 gap-2 rounded-xl bg-white/5 p-2 ring-1 ring-white/10">
                      <div class="stat-item text-center">
                        <span class="stat-label block text-xs text-white/70">${t('maps_label')}</span>
                        <span class="stat-value text-lg font-semibold" data-value="${data.total_maps_created}">0</span>
                      </div>
                      <div class="stat-item text-center">
                        <span class="stat-label block text-xs text-white/70">${t('playtests_label')}</span>
                        <span class="stat-value text-lg font-semibold" data-value="${data.total_playtests}">0</span>
                      </div>
                      <div class="stat-item text-center">
                        <span class="stat-label block text-xs text-white/70">${t('world_records_label')}</span>
                        <span class="stat-value text-lg font-semibold" data-value="${data.world_records}">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Colonne droite -->
              <!-- suppression h-full -->
              <div class="player-info md:col-start-2 md:row-start-1 flex flex-col items-center justify-start gap-3 rounded-xl bg-black/30 p-4 ring-1 ring-white/10 backdrop-blur overflow-hidden">
                <div class="inline-flex items-center gap-2">
                  <span class="player-rank-name text-sm text-white/90 leading-none">
                    ${data.rank_name}
                  </span>
                  <img src="${data.rank_url || 'assets/default_rank.png'}" alt="Player Rank Badge" class="player-rank-badge h-5 sm:h-6 object-contain">
                </div>

                <img src="${data.avatar_url || 'assets/default_avatar.png'}" alt="Player Avatar"
                     class="player-avatar mt-4 w-full max-w-[240px] object-contain bg-transparent">
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    revealRankCardContainer();
    requestAnimationFrame(() => {
      const left = rankCardContent.querySelector('.rank-section-container');
      const right = rankCardContent.querySelector('.player-info');
      if (!left || !right) return;

      const applyHeights = () => {
        const H = left.getBoundingClientRect().height;
        right.style.height = `${H}px`;

        const avatar = right.querySelector('.player-avatar');
        const header = right.querySelector('.inline-flex');
        if (avatar && header) {
          const cs = getComputedStyle(right);
          const py = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
          const gap = parseFloat(cs.rowGap || cs.gap || 12);
          const usable = Math.max(0, H - header.getBoundingClientRect().height - py - gap);
          avatar.style.maxHeight = `${usable}px`;
        }
      };

      applyHeights();
      const ro = new ResizeObserver(() => applyHeights());
      ro.observe(left);
      window.addEventListener('resize', applyHeights, { passive: true });
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
      const end = parseInt(stat.getAttribute('data-value') || '0', 10);
      animateValue(stat, 0, end, 1600);
    });

    rankCardContent.dataset.loadedFor = String(me);
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
    const response = await fetch(endpoints.rankcard.data(userId), { credentials: 'same-origin' });
    if (!response.ok) throw new Error("Erreur de connexion à l'API.");
    const data = await response.json();
    if (!data || data.error) {
      rankCardContent.innerHTML = '';
      if (!silent) hideRankCardContainer();
      if (!noSpinner) hideLoadingBar();
      return;
    }

    rankCardContent.innerHTML = `
      <div class="rank-card-container relative">
        <div class="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
          <div class="background absolute inset-0">
            <img src="${data.background_url || 'default-background.webp'}" alt="Background" class="h-full w-full object-cover">
          </div>

          <div class="relative content-rankcard p-4 sm:p-6 bg-gradient-to-b from-black/30 via-black/20 to-black/30">
            <div class="player-name font-banksans text-center text-2xl sm:text-5xl font-extrabold tracking-tight">
              ${data.nickname}
            </div>

            <div class="main-container mt-4 grid gap-4 grid-cols-1 md:grid-cols-[1fr,320px] items-start">
              <div class="rank-details-container md:col-start-1 md:row-start-1 space-y-4">
                <div class="rank-section-container rounded-xl bg-black/30 ring-1 ring-white/10 p-3 sm:p-4 backdrop-blur flex flex-col">
                  
                  <div class="rank-section space-y-3">
                    <div class="medals-header grid items-center text-sm text-white/80 gap-2
                      grid-cols-[8rem_1fr_minmax(2rem,auto)_minmax(2rem,auto)_minmax(2rem,auto)]">
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
                        <div class="rank-row grid items-center gap-2
                          grid-cols-[8rem_1fr_minmax(2rem,auto)_minmax(2rem,auto)_minmax(2rem,auto)]">
                          <span class="rank-title text-sm sm:text-base">${t('difficulties.' + key)}</span>
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

                  <div class="inline-stats mt-3 grid gap-2 grid-cols-1 sm:grid-cols-3">
                    <div class="rounded-lg bg-white/5 p-2 ring-1 ring-white/10 text-center">
                      <span class="block text-xs text-white/70">${t('xp')}</span>
                      <span class="stat-value text-lg font-semibold" data-value="${Number(data.xp || 0)}">0</span>
                    </div>
                    <div class="rounded-lg bg-white/5 p-2 ring-1 ring-white/10 text-center">
                      <span class="block text-xs text-white/70">${t('prestige_level')}</span>
                      <span class="text-base font-semibold">${Number(data.prestige_level ?? 0)}</span>
                    </div>
                    <div class="rounded-lg bg-white/5 p-2 ring-1 ring-white/10 text-center">
                      <span class="block text-xs text-white/70">${t('community_rank')}</span>
                      <span class="text-base font-semibold">${data.community_rank || '—'}</span>
                    </div>
                  </div>

                  <div class="combined-container mt-3 grid gap-4 md:grid-cols-2 items-stretch">
                    <div class="badges-container rounded-xl bg-white/5 p-2 ring-1 ring-white/10 min-w-0 overflow-hidden">
                      <div class="badges-grid grid grid-cols-[repeat(auto-fit,minmax(2.5rem,1fr))] gap-2 sm:gap-3 place-items-center">
                        ${normalizeBadgeSlots(data.badges)
                          .filter((b) => !!b.url)
                          .map(
                            (b) => `
                              <img src="${b.url}" alt="${b.name || 'Badge'}"
                                    class="badge h-8 w-8 sm:h-10 sm:w-10 flex-none rounded-full ring-1 ring-white/10 object-cover">
                            `
                          )
                          .join('')}
                      </div>
                    </div>

                    <div class="stats-section grid grid-cols-3 gap-2 rounded-xl bg-white/5 p-2 ring-1 ring-white/10">
                      <div class="stat-item text-center">
                        <span class="stat-label block text-xs text-white/70">${t('maps_label')}</span>
                        <span class="stat-value text-lg font-semibold" data-value="${data.total_maps_created}">0</span>
                      </div>
                      <div class="stat-item text-center">
                        <span class="stat-label block text-xs text-white/70">${t('playtests_label')}</span>
                        <span class="stat-value text-lg font-semibold" data-value="${data.total_playtests}">0</span>
                      </div>
                      <div class="stat-item text-center">
                        <span class="stat-label block text-xs text-white/70">${t('world_records_label')}</span>
                        <span class="stat-value text-lg font-semibold" data-value="${data.world_records}">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Colonne droite -->
              <div class="player-info md:col-start-2 md:row-start-1 flex flex-col items-center justify-start gap-3 rounded-xl bg-black/30 p-4 ring-1 ring-white/10 backdrop-blur overflow-hidden">
                <div class="inline-flex items-center gap-2">
                  <span class="player-rank-name text-sm text-white/90 leading-none">${data.rank_name}</span>
                  <img src="${data.rank_url || 'assets/default_rank.png'}" alt="Player Rank Badge" class="player-rank-badge h-5 sm:h-6 object-contain">
                </div>

                <img src="${data.avatar_url || 'assets/default_avatar.png'}" alt="Player Avatar"
                     class="player-avatar mt-4 w-full max-w-[240px] object-contain bg-transparent">
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    if (!silent) revealRankCardContainer();

    requestAnimationFrame(() => {
      const left = rankCardContent.querySelector('.rank-section-container');
      const right = rankCardContent.querySelector('.player-info');
      if (!left || !right) return;

      const applyHeights = () => {
        const H = left.getBoundingClientRect().height;
        right.style.height = `${H}px`;

        const avatar = right.querySelector('.player-avatar');
        const header = right.querySelector('.inline-flex');
        if (avatar && header) {
          const cs = getComputedStyle(right);
          const py = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
          const gap = parseFloat(cs.rowGap || cs.gap || 12);
          const usable = Math.max(0, H - header.getBoundingClientRect().height - py - gap);
          avatar.style.maxHeight = `${usable}px`;
        }
      };

      applyHeights();
      const ro = new ResizeObserver(() => applyHeights());
      ro.observe(left);
      window.addEventListener('resize', applyHeights, { passive: true });
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
      const end = parseInt(stat.getAttribute('data-value') || '0', 10);
      animateValue(stat, 0, end, 1600);
    });

    rankCardContent.dataset.loadedFor = String(userId);

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
  container.classList.remove('hidden');
  container.classList.add('grid');

  const buttonContainer = byId('buttonContainer');
  if (buttonContainer) {
    buttonContainer.classList.add('hidden');
    buttonContainer.classList.remove('flex');
  }
}

async function fetchUserMastery(userId) {
  if (!userId) return;

  const container = byId('badgeMasteryContent');
  container.innerHTML = `
    <div class="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6">
      <section class="relative w-full rounded-2xl bg-black/30 ring-1 ring-white/10 backdrop-blur p-3 sm:p-4">
        <div class="mb-3 flex items-center justify-between gap-2">
          <span id="badgeCount" class="text-xs text-white/60">—</span>
        </div>

        <div id="badgeScroller"
             class="grid gap-3 overflow-y-auto pr-1
                    grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6
                    max-h-[460px] sm:max-h-[60vh]">

          <div class="col-span-full h-24 animate-pulse rounded-xl bg-white/5"></div>
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
    if (!r.ok) throw new Error("Erreur de connexion à l'API.");
    const data = await r.json();

    scroller.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
      scroller.innerHTML = `<p class="col-span-full text-sm text-white/70">Aucun badge trouvé.</p>`;
      counter.textContent = '0';
      container.dataset.loadedFor = String(userId);
      return;
    }

    let count = 0;
    data.forEach((badge) => {
      if (badge.map_name === 'Tools' || badge.map_name === 'Framework') return;

      const badgeLevel = (badge.level === 'Placeholder' ? 'Unranked' : badge.level) || 'Unranked';
      const pillClass =
        badgeLevel === 'Prodigy'
          ? 'bg-fuchsia-600/80 text-fuchsia-50'
          : badgeLevel === 'Gold'
            ? 'bg-yellow-600/80 text-yellow-50'
            : badgeLevel === 'Silver'
              ? 'bg-slate-500/80 text-white'
              : badgeLevel === 'Bronze'
                ? 'bg-amber-700/80 text-amber-50'
                : 'bg-white/10 text-white/80';

      const el = document.createElement('article');
      el.className =
        'group rounded-xl bg-white/5 ring-1 ring-white/10 transition p-3 ' +
        'hover:bg-white/10 hover:ring-white/20';
      el.innerHTML = `
        <div class="relative">
          <img src="${badge.icon_url}" alt="${badge.map_name}"
               class="mx-auto h-16 w-16 rounded-lg object-contain ring-white/10
                      group-hover:ring-white/20 cursor-pointer"
               onclick="showBadgeViewer('${badge.icon_url}', '${badge.map_name.replace(/'/g, "\\'")}')">
          <span class="absolute -right-1 -top-1 rounded-full px-2 py-0.5 text-[10px] ring-1 ring-white/10 shadow ${pillClass}">
            ${badgeLevel}
          </span>
        </div>
        <div class="mt-2 space-y-0.5">
          <p class="text-center text-sm font-semibold leading-tight">${badge.map_name}</p>
          <p class="text-center text-[11px] text-white/70">
            ${t('completions', { amount: badge.amount })}
          </p>
        </div>
      `;
      scroller.appendChild(el);
      count++;
    });

    if (!count) {
      scroller.innerHTML = `<p class="col-span-full text-sm text-white/70">Aucun badge trouvé.</p>`;
    }
    counter.textContent = `${count}`;
    container.dataset.loadedFor = String(userId);
  } catch (err) {
    console.error('Erreur badges user:', err);
    scroller.innerHTML = `<p class="col-span-full text-sm text-rose-300">Erreur de chargement des badges.</p>`;
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
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');

  img.style.transition = 'none';
  img.addEventListener('mousedown', startBadgeRotation);
}
function closeBadgeViewer() {
  const overlay = byId('badgeViewer');
  const img = byId('badgeViewerImage');

  overlay.classList.add('hidden');
  overlay.classList.remove('flex');
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

  searchInput.parentNode.classList.add('relative');

  const container = document.createElement('div');
  container.id = 'suggestionsContainer';
  container.className =
    'absolute z-50 mt-2 w-full rounded-xl bg-zinc-900/95 ring-1 ring-white/10 shadow-xl backdrop-blur hidden max-h-72 overflow-auto';
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
        'w-full cursor-pointer text-left px-3 py-2 text-sm rounded-lg hover:bg-white/10';
      btn.innerHTML = `
        <div class="flex items-center justify-between gap-3">
          <span class="truncate">${escapeHTML(u.label)}</span>
          <span class="text-[11px] text-white/40 font-mono">${escapeHTML(u.user_id)}</span>
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
      el.classList.toggle('bg-white/10', idx === active);
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
      if (!resp.ok) throw new Error('Erreur de chargement des suggestions.');
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
    container.classList.add('hidden');
    return;
  }

  suggestions.forEach((user) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'w-full text-left px-3 py-2 text-sm hover:bg-white/10 rounded-lg';
    item.textContent = user.name;
    item.addEventListener('click', () => {
      const input = byId('searchUserName');
      input.value = user.name;
      input.dataset.userId = String(user.user_id);
      selectedUserId = String(user.user_id);
      container.classList.add('hidden');
    });
    container.appendChild(item);
  });

  container.classList.remove('hidden');
}

/* =========================
   BADGES EDIT
   ========================= */
function initBadgesChanges() {
  const changeBadgesButton = byId('changeBadges');

  const overlay = document.createElement('div');
  overlay.id = 'badgesModal';
  overlay.className =
    'fixed inset-0 z-[300] hidden items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm';
  document.body.appendChild(overlay);

  const card = document.createElement('div');
  card.className =
    'rounded-2xl bg-zinc-900/90 ring-1 ring-white/10 p-4 w-[340px] sm:w-[420px] max-h-[80vh] overflow-auto';
  overlay.appendChild(card);

  const actionRow = document.createElement('div');
  actionRow.className = 'flex items-center justify-between';
  card.appendChild(actionRow);

  const resetBadgesButton = document.createElement('button');
  resetBadgesButton.id = 'resetBadges';
  resetBadgesButton.className =
    'rounded-lg bg-rose-600/90 px-3 py-1.5 text-sm text-white cursor-pointer';
  resetBadgesButton.textContent = t('reset_badges_button');
  actionRow.appendChild(resetBadgesButton);

  const saveBadgeChangesButton = document.createElement('button');
  saveBadgeChangesButton.id = 'saveBadgeChanges';
  saveBadgeChangesButton.className =
    'inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white cursor-pointer';
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
    'absolute z-[310] hidden max-h-56 w-60 overflow-auto rounded-xl bg-zinc-900/95 p-2 text-sm ring-1 ring-white/10 shadow-xl';
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
      'relative flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-sm ring-1 ring-white/10 hover:bg-white/10 cursor-pointer overflow-hidden';
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
      rewardsContainer.classList.remove('hidden');

      preloadedRewards.forEach((badge) => {
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'badge-items w-full rounded-lg px-3 py-2 text-left hover:bg-white/10';
        row.textContent = `${badge.name} (${badge.rarity})`;
        row.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!activeCircle) return;
          activeCircle.innerHTML = '';
          const img = document.createElement('img');
          img.src = badge.url;
          img.alt = badge.name || '';
          img.className = 'h-full w-full rounded-full object-cover';
          activeCircle.appendChild(img);
          rewardsContainer.classList.add('hidden');
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
          img.src = slot.url;
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
          img.src = b.url;
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
        toastError('Erreur sauvegarde badges');
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
      rewardsContainer.classList.add('hidden');
    }
  });
  document.addEventListener('click', (e) => {
    if (!rewardsContainer.contains(e.target)) rewardsContainer.classList.add('hidden');
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
      <img src="${b.url}" alt="${b.name || 'Badge'}"
           class="badge h-8 w-8 sm:h-10 sm:w-10 flex-none rounded-full ring-1 ring-white/10 object-cover">
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
          img.src = b.url;
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
        img.src = b.url;
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
    'fixed inset-0 z-[300] hidden items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm';
  document.body.appendChild(overlay);

  const holder = document.createElement('div');
  holder.id = 'backgroundContainer';
  holder.className =
    'flex w-[360px] sm:w-[420px] flex-col gap-3 rounded-2xl bg-zinc-900/90 p-4 ring-1 ring-white/10 max-h-[88vh] overflow-auto';
  overlay.appendChild(holder);

  const actions = document.createElement('div');
  actions.className = 'flex items-center justify-between';
  holder.appendChild(actions);

  const resetBtn = document.createElement('button');
  resetBtn.id = 'resetBackground';
  resetBtn.textContent = t('reset_background_button');
  resetBtn.className = 'rounded-lg bg-rose-600/90 px-3 py-1.5 text-sm text-white cursor-pointer';
  actions.appendChild(resetBtn);

  const saveBtn = document.createElement('button');
  saveBtn.id = 'saveBackgroundChanges';
  saveBtn.textContent = '✓';
  saveBtn.className =
    'inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white cursor-pointer';
  actions.appendChild(saveBtn);

  let selectedBackground = null;

  const preview = document.createElement('div');
  preview.id = 'backgroundPreview';
  preview.className =
    'relative flex h-28 w-full items-center justify-center rounded-xl bg-white/5 text-sm font-bold text-zinc-400 ring-1 ring-white/10';
  preview.textContent = '+';
  holder.appendChild(preview);

  const options = document.createElement('div');
  options.id = 'backgroundOptions';
  options.className =
    'absolute z-[310] hidden max-h-60 w-[320px] overflow-auto rounded-xl bg-zinc-900/95 p-2 text-sm ring-1 ring-white/10 shadow-xl';
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
      row.className = 'background-option w-full rounded-lg px-3 py-2 text-left hover:bg-white/10';
      row.textContent = `${bg.name} (${bg.rarity})`;
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedBackground = { name: bg.name, url: bg.url };
        preview.style.backgroundImage = `url(${bg.url})`;
        preview.style.backgroundSize = 'cover';
        preview.style.backgroundPosition = 'center';
        preview.textContent = '';
        options.classList.add('hidden');
      });
      options.appendChild(row);
    });

    const rect = preview.getBoundingClientRect();
    options.style.top = `${rect.bottom + 8 + window.scrollY}px`;
    options.style.left = `${rect.left + window.scrollX}px`;
    options.style.width = `${rect.width}px`;
    options.classList.remove('hidden');
  };

  preview.addEventListener('click', () => {
    if (options.classList.contains('hidden')) displayBackgroundOptions();
    else options.classList.add('hidden');
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
          preview.style.backgroundImage = `url(${data.url})`;
          preview.textContent = '';
          currentBackground = { url: data.url, name: data.name || 'placeholder' };
          toastSuccess(t('background_saved'));
        } else {
          console.error('Aucune URL valide');
        }
      })
      .catch((e) => {
        console.error('Erreur sauvegarde bg:', e);
        toastError('Erreur sauvegarde background');
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
      options.classList.add('hidden');
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
  img.src = res.url;
  img.alt = res.name || 'Background';
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
        img.src = bg.url;
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
    'fixed inset-0 z-[300] hidden items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm';
  document.body.appendChild(overlay);

  const container = document.createElement('div');
  container.id = 'avatarContainer';
  container.className =
    'flex w-[360px] sm:w-[420px] flex-col gap-3 rounded-2xl bg-zinc-900/90 p-4 pb-2 ring-1 ring-white/10 max-h-[80vh] overflow-auto';
  overlay.appendChild(container);

  const topRow = document.createElement('div');
  topRow.className = 'flex items-center justify-between';
  container.appendChild(topRow);

  const resetBtn = document.createElement('button');
  resetBtn.id = 'resetAvatar';
  resetBtn.textContent = t('reset_avatar_button');
  resetBtn.className = 'rounded-lg bg-rose-600/90 px-3 py-1.5 text-sm text-white cursor-pointer';
  topRow.appendChild(resetBtn);

  const saveBtn = document.createElement('button');
  saveBtn.id = 'saveAvatarChanges';
  saveBtn.textContent = '✓';
  saveBtn.className =
    'inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white cursor-pointer hover:bg-emerald-400';
  topRow.appendChild(saveBtn);

  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'avatar-button-group mt-1 flex items-center gap-3';
  container.appendChild(buttonGroup);

  const BTN_BASE =
    'rounded-lg border border-white/10 px-3 py-2 text-sm transition-colors cursor-pointer';
  const BTN_INACTIVE = 'bg-white/5 text-zinc-100 hover:bg-white/10';
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
    'hidden h-56 sm:h-64 w-full items-center justify-center rounded-xl bg-white/5 text-sm font-bold text-zinc-400 ring-1 ring-white/10 bg-no-repeat bg-center';
  skinPreview.textContent = '+';
  container.appendChild(skinPreview);

  const posePreview = document.createElement('div');
  posePreview.id = 'avatarPosePreview';
  posePreview.className =
    'hidden h-56 sm:h-64 w-full items-center justify-center rounded-xl bg-white/5 text-sm font-bold text-zinc-400 ring-1 ring-white/10 bg-no-repeat bg-center';
  posePreview.textContent = '+';
  container.appendChild(posePreview);

  const options = document.createElement('div');
  options.id = 'avatarOptions';
  options.className =
    'absolute z-[310] hidden max-h-60 w-full overflow-auto rounded-xl bg-zinc-900/95 p-2 text-sm ring-1 ring-white/10 shadow-xl';
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
      skinPreview.classList.remove('hidden');
      skinPreview.classList.add('flex');
      posePreview.classList.add('hidden');
      posePreview.classList.remove('flex');
    } else {
      posePreview.classList.remove('hidden');
      posePreview.classList.add('flex');
      skinPreview.classList.add('hidden');
      skinPreview.classList.remove('flex');
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
          skinPreview.style.backgroundImage = `url(${skinData.url})`;
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
          posePreview.style.backgroundImage = `url(${poseData.url})`;
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
      row.className = 'avatar-option w-full rounded-lg px-3 py-2 text-left hover:bg-white/10';
      row.textContent = `${item.name} (${item.rarity})`;
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        if (type === 'skin') {
          selectedSkin = item.name;
          skinPreview.style.backgroundImage = `url(${item.url})`;
          skinPreview.style.backgroundSize = 'contain';
          skinPreview.style.backgroundPosition = 'center';
          skinPreview.style.backgroundRepeat = 'no-repeat';
          skinPreview.textContent = '';
        } else {
          selectedPose = item.name;
          posePreview.style.backgroundImage = `url(${item.url})`;
          posePreview.style.backgroundSize = 'contain';
          posePreview.style.backgroundPosition = 'center';
          posePreview.style.backgroundRepeat = 'no-repeat';
          posePreview.textContent = '';
        }
        options.classList.add('hidden');
      });
      options.appendChild(row);
    });

    options.style.top = `${rect.bottom + 8 + window.scrollY}px`;
    options.style.left = `${rect.left + window.scrollX}px`;
    options.style.width = `${rect.width}px`;
    options.classList.remove('hidden');
  };

  skinPreview.addEventListener('click', () => displayAvatarOptions('skin'));
  posePreview.addEventListener('click', () => displayAvatarOptions('pose'));
  changeSkinButton.addEventListener('click', () => toggleActiveClass(changeSkinButton));
  changePoseButton.addEventListener('click', () => toggleActiveClass(changePoseButton));

  resetBtn.addEventListener('click', () => {
    selectedSkin = 'Overwatch 1';
    selectedPose = 'heroic';
    const formattedSkin = selectedSkin.toLowerCase().replace(/ /g, '_');
    const url = `assets/rank_card/avatar/${formattedSkin}/${selectedPose}.webp`;
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
          url: `assets/rank_card/avatar/${skin}/${pose}.webp`,
        });
        toastSuccess(t('avatar_saved'));
        closeModal(overlay);
        selectedSkin = null;
        selectedPose = null;
      })
      .catch((e) => {
        console.error('Erreur sauvegarde avatar:', e);
        toastError('Erreur sauvegarde avatar');
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
      options.classList.add('hidden');
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
  img.src = data.url;
  img.alt = data.name || 'Player Avatar';
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
        if (!r.ok) throw new Error('Erreur skins.');
        return r.json();
      })
      .then((data) => {
        if (data?.url) {
          skinPreview.style.backgroundImage = `url(${data.url})`;
          skinPreview.style.backgroundSize = 'contain';
          skinPreview.style.backgroundPosition = 'center';
          skinPreview.style.backgroundRepeat = 'no-repeat';
          skinPreview.classList.add('flex');
          skinPreview.classList.remove('hidden');
          skinPreview.textContent = '';
        }
      })
      .catch((e) => console.error('Préload avatarSkinPreview:', e));
  }

  if (posePreview) {
    fetch(endpoints.rankcard.avatar.pose.get(me), { credentials: 'same-origin' })
      .then((r) => {
        if (!r.ok) throw new Error('Erreur poses.');
        return r.json();
      })
      .then((data) => {
        if (data?.url) {
          posePreview.style.backgroundImage = `url(${data.url})`;
          posePreview.style.backgroundSize = 'contain';
          posePreview.style.backgroundPosition = 'center';
          posePreview.style.backgroundRepeat = 'no-repeat';
          posePreview.classList.add('flex');
          posePreview.classList.remove('hidden');
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
      if (!r.ok) throw new Error('Erreur chargement récompenses.');
      return r.json();
    })
    .then((data) => {
      availableAvatars.skins = data.filter((r) => r.type === 'skin');
      availableAvatars.poses = data.filter((r) => r.type === 'pose');
      availableAvatars.skins.forEach((s) => {
        const img = new Image();
        img.src = s.url;
      });
      availableAvatars.poses.forEach((p) => {
        const img = new Image();
        img.src = p.url;
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
          img.src = it.url;
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
  overlayEl.classList.remove('hidden');
  overlayEl.classList.add('flex');

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
    overlayEl.classList.add('hidden');
    overlayEl.classList.remove('flex');

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
  el.classList.remove('hidden');

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
    el.classList.add('hidden');
    el.style.transition = '';
    el.style.opacity = '';
    el.style.transform = '';
    el.removeEventListener('transitionend', done);
  };
  el.addEventListener('transitionend', done, { once: true });
}
