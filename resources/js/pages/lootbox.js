// resources/js/pages/lootbox.js
import { cdnAsset, cdnImage } from "../utils/cdn";
import { createLootbox3D } from "../utils/animations";
import { initStoreModal } from "../modals/store";

// ====== état/appli ======
let isRunning = false;
const openSound = new Audio(cdnAsset('assets/sounds/open-box.ogg'));
let volume = 0.25;

let crate = [];
let soundPlaybackAllowed = false;
let generatedRewards = [];
let rewardKeyType = 'Classic';
let rewardNonce = '';
let keys = 0;
let packOpened = false;
let awaitingPick = false;
const API_BASE = '/api/lootbox';
let openSession = null;
let redeeming = false;
let lootbox3dPromise = null;
let lootbox3d = null;
let openSoundTimer = null;
let openSoundToken = 0;
const CARD_BACK_LOGO_URL = cdnAsset("/assets/img/favicon-high.png");

const CURRENT_LANG = document.documentElement.lang || 'en';
const BASE_I18N = window.LOOTBOX_I18N || {};
let translations = { ...BASE_I18N, map_name: {} };

const sounds = {
  common: new Audio(cdnAsset('assets/sounds/common-sound.ogg')),
  rare: new Audio(cdnAsset('assets/sounds/rare-sound.ogg')),
  epic: new Audio(cdnAsset('assets/sounds/epic-sound.ogg')),
  legendary: new Audio(cdnAsset('assets/sounds/legendary-sound.ogg')),
};
Object.values(sounds).forEach((s) => (s.preload = 'auto'));

// ====== helpers ajax ======
const readCookie = (name) => {
  try {
    const safe = String(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + safe + '=([^;]*)'));
    return match ? match[1] : '';
  } catch {
    return '';
  }
};

const getXsrfToken = () => {
  const raw = readCookie('XSRF-TOKEN');
  if (!raw) return '';
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

const getCsrfToken = () => {
  if (typeof window.getCsrfToken === 'function') return window.getCsrfToken();
  return window.CSRF || document.querySelector('meta[name="csrf-token"]')?.content || '';
};

$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
  options.xhrFields = options.xhrFields || {};
  options.xhrFields.withCredentials = true;

  const method = (options.type || 'GET').toUpperCase();
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrf = getCsrfToken();
    if (csrf) jqXHR.setRequestHeader('X-CSRF-TOKEN', csrf);

    const xsrf = getXsrfToken();
    if (xsrf) jqXHR.setRequestHeader('X-XSRF-TOKEN', xsrf);

    if (typeof window.__hasSessionCookie === 'function' && !window.__hasSessionCookie()) {
      if (typeof window.__refreshCsrfToken === 'function') {
        window.__refreshCsrfToken();
      }
    }
  }

  jqXHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
});

// ====== i18n / UI ======
function langToMapLocale(lang) {
  const map = {
    en: 'en-US','en-US':'en-US',
    fr: 'fr-FR','fr-FR':'fr-FR',
    de: 'de-DE','de-DE':'de-DE',
    es: 'es-ES','es-ES':'es-ES','es-MX':'es-MX',
    it: 'it-IT','it-IT':'it-IT',
    ja: 'ja-JP','ja-JP':'ja-JP',
    ko: 'ko-KR','ko-KR':'ko-KR',
    pl: 'pl-PL','pl-PL':'pl-PL',
    pt: 'pt-BR','pt-BR':'pt-BR',
    ru: 'ru-RU','ru-RU':'ru-RU',
    th: 'th-TH','th-TH':'th-TH',
    tr: 'tr-TR','tr-TR':'tr-TR',
    cn: 'zh-CN', zh: 'zh-CN','zh-CN':'zh-CN','zh-TW':'zh-TW',
  };
  return map[lang] || 'en-US';
}

async function loadTranslations() {
  try {
    const urls = ['/translations/maps.json', 'translations/maps.json'];
    let mapsData = null;
    for (const url of urls) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) { mapsData = await res.json(); break; }
      } catch {}
    }
    if (!mapsData) throw new Error('maps.json introuvable');

    const wanted = langToMapLocale(CURRENT_LANG);
    const map_name = {};
    Object.values(mapsData).forEach((m) => {
      const en = m['en-US'];
      if (!en) return;
      const local = m[wanted] || en;
      const key = en.toLowerCase().replace(/[()]/g, '').replace(/\s+/g, '_');
      map_name[key] = local;
    });

    translations = { ...BASE_I18N, map_name };
  } catch (e) {
    console.error('Erreur lors du chargement des noms de cartes :', e);
    translations = { ...BASE_I18N, map_name: {} };
  }
}

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

function showToast(message, type = 'ok', opts = {}) {
  const {
    duration = 1200,
    enter    = 220,
    exit     = 220,
    easing   = 'cubic-bezier(0.4,0,0.2,1)',
  } = opts;

  let root = document.getElementById('toast-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'toast-root';
    root.className = 'pointer-events-none fixed inset-x-0 bottom-6 z-[200] flex justify-center px-3';
    document.body.appendChild(root);
  }

  while (root.firstElementChild) {
    const prev = root.firstElementChild;
    try { prev.getAnimations?.().forEach(a => a.cancel()); } catch {}
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
    palette
  ].join(' ');
  el.textContent = message;

  root.appendChild(el);

  const inAnim = el.animate(
    [{ opacity: 0, transform: 'translateY(8px)' },
     { opacity: 1, transform: 'translateY(0)' }],
    { duration: enter, easing, fill: 'forwards' }
  );

  const close = () => {
    Promise.resolve(inAnim.finished).catch(() => {}).finally(() => {
      const outAnim = el.animate(
        [{ opacity: 1, transform: 'translateY(0)' },
         { opacity: 0, transform: 'translateY(8px)' }],
        { duration: exit, easing, fill: 'forwards' }
      );
      outAnim.finished.then(() => el.remove()).catch(() => el.remove());
      setTimeout(() => el.remove(), exit + 120);
    });
  };

  const timer = setTimeout(close, Math.max(duration, enter + 50));
  el.addEventListener('click', () => { clearTimeout(timer); close(); });
}

const showConfirmationMessage = (m) => showToast(m, 'ok');
const showErrorMessage        = (m) => showToast(m, 'error');
const showWarningMessage      = (m) => showToast(m, 'warn');

function rarityStyle(rarity) {
  switch (String(rarity).toLowerCase()) {
    case 'legendary':
      return {
        ring: 'ring-amber-400/50',
        glow: 'shadow-[0_0_25px_rgba(251,191,36,.25)]',
        badge: 'bg-amber-500/15 text-amber-300',
      };
    case 'epic':
      return {
        ring: 'ring-purple-400/50',
        glow: 'shadow-[0_0_25px_rgba(168,85,247,.25)]',
        badge: 'bg-purple-500/15 text-purple-300',
      };
    case 'rare':
      return {
        ring: 'ring-sky-400/50',
        glow: 'shadow-[0_0_25px_rgba(56,189,248,.25)]',
        badge: 'bg-sky-500/15 text-sky-300',
      };
    default:
      return {
        ring: 'ring-zinc-300/30',
        glow: 'shadow-[0_0_18px_rgba(212,212,216,.12)]',
        badge: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-300',
      };
  }
}

// ====== init ======
async function bootLootbox3D() {
  const mountEl = document.getElementById("box");
  if (!mountEl) return null;

  showBoxSkeleton();

  try {
    const ctrl = await createLootbox3D({
      mountEl,
      modelUrl: cdnAsset('assets/lootbox/box_model.glb'),
    });

    lootbox3d = ctrl;

    ctrl.setCardPickHandler?.((pickedIndex, reward) => {
      if (!awaitingPick) return;
      if (!reward || !window.user_id) return;

      playSound(reward.rarity);
      grantReward(user_id, reward);

      awaitingPick = false;
      restoreCrate();
    });

    hideBoxSkeleton();
    return ctrl;
  } catch (e) {
    console.warn("[lootbox3d] init failed:", e);
    lootbox3dPromise = null;
    lootbox3d = null;

    showBoxFallback();
    return null;
  }
}

async function initializeApp() {
  await loadTranslations();
  hideCrate();

  // Store modal
  try {
    initStoreModal({
      getUserId: () => window.user_id,
      showToast: (message, type) => showToast(message, type),
    });
  } catch (e) {
    console.warn("[store] init failed:", e);
  }

  // init 3D
  try {
    lootbox3dPromise = bootLootbox3D();
  } catch (e) {
    console.warn("[lootbox3d] init failed:", e);
    lootbox3dPromise = null;
    lootbox3d = null;
    showBoxFallback();
  }
}

$(document).ready(() => {
  initializeApp();

  const retryBtn = document.getElementById('box-retry');
  retryBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    lootbox3dPromise = bootLootbox3D();
  });
});

// ====== API ======
function getRandomRewards(user_id, keyType) {
  $.ajax({
    url: `${API_BASE}/users/${encodeURIComponent(user_id)}/keys/${encodeURIComponent(keyType)}`,
    type: 'GET',
    data: { amount: 3 },
    dataType: 'json',
    success: function (response) {
      const rewards = Array.isArray(response) ? response : response?.data;
      if (!Array.isArray(rewards)) {
        console.error('Format inattendu:', response);
        showErrorMessage(t('popup.unexpected_format'));
        restoreCrate();
        return;
      }
      generatedRewards = rewards;
      startClientOpenSession(rewardKeyType, rewards);
      rewardNonce = '';
      proceedWithLootBoxOpening();
    },
    error: function () {
      showErrorMessage(t('popup.network_error'));
      restoreCrate();
    },
  });
}
function fetchKeys(user_id, selectedKeyType = 'Classic') {
  if (!user_id) return;
  $.ajax({
    url: `${API_BASE}/users/${encodeURIComponent(user_id)}/keys`,
    type: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response?.error) {
        console.error('Erreur de récupération des clés :', response.error);
        $('#key-count').html("<i class='fas fa-key mr-1'></i> " + t('popup.error_fetching_keys'));
        return;
      }
      const list = Array.isArray(response) ? response : response?.data || [];
      const filtered = list.filter((k) => k.key_type === selectedKeyType);
      keys = filtered.reduce((s, k) => s + (Number(k.amount) || 0), 0);
      updateKeyDisplay();
    },
    error: function () {
      $('#key-count').html("<i class='fas fa-key mr-1'></i> " + t('popup.error_fetching_keys'));
    },
  });
}
function grantReward(user_id, reward) {
  if (navigator.userActivation && !navigator.userActivation.isActive) {
    showErrorMessage(t('popup.click_required'));
    return;
  }
  if (!openSession) {
    showErrorMessage(t('lootbox.session_expired'));
    return;
  }
  if (openSession.keyType !== rewardKeyType) {
    showErrorMessage(t('popup.error_generic'));
    return;
  }

  const sig = mkRewardSig(reward);
  if (!openSession.keySet.has(sig)) {
    showErrorMessage(t('popup.error_generic'));
    return;
  }
  if (redeeming) return;
  redeeming = true;

  $.ajax({
    url: `${API_BASE}/users/${encodeURIComponent(user_id)}/${encodeURIComponent(rewardKeyType)}/${encodeURIComponent(reward.type)}/${encodeURIComponent(reward.name)}`,
    type: 'POST',
    dataType: 'json',
    headers: { 'X-GP-Client-Nonce': openSession.clientNonce },
    complete: function () {
      openSession = null;
      redeeming = false;
      fetchKeys(user_id, rewardKeyType);
    },
  });
}

// ====== UI (boutons) ======
$('.generate').on('click', function () {
  if (!window.user_id) {
    showWarningMessage(t('popup.login_required_msg'));
    return;
  }
  if (!rewardKeyType) return;

  unlockAudioSilentOnce();
  pauseCrate();

  $.ajax({
    url: `${API_BASE}/users/${encodeURIComponent(user_id)}/keys`,
    type: 'GET',
    dataType: 'json',
    success: function (response) {
      const list = Array.isArray(response) ? response : response?.data || [];
      const filtered = list.filter((k) => k.key_type === rewardKeyType);
      keys = filtered[0]?.amount || 0;

      if (keys > 0) {
        getRandomRewards(user_id, rewardKeyType);
      } else {
        showWarningMessage(t('ui.no_keys_available'));
        restoreCrate();
      }
    },
    error: function () {
      showErrorMessage(t('popup.network_error'));
      restoreCrate();
    },
  });
});

async function updateKeyDisplay() {
  await loadTranslations();

  const icon = keyIconUrl(rewardKeyType);

  if (user_id) {
    $('#key-count').html(`
      <span class="inline-flex items-center gap-2">
        <img
          src="${icon}"
          alt=""
          class="h-5 w-5 shrink-0 object-contain"
          loading="lazy"
          decoding="async"
        />
        <span id="key-number" class="font-extrabold">${keys}</span>
      </span>
    `);
  } else {
    $('#key-count').html(t('popup.login_required_btn') || 'Login');
  }
}
function keyIconUrl(keyType) {
  const kt = String(keyType || "Classic").toLowerCase();

  const map = {
    classic: "assets/lootbox/keys/classic.png",
    winter: "assets/lootbox/keys/winter.png",
    spring: "assets/lootbox/keys/spring.png",
    summer: "assets/lootbox/keys/summer.png",
    autumn: "assets/lootbox/keys/autumn.png",
  };

  return cdnAsset(map[kt] || map.classic);
}
function pauseCrate() {
  $('.generate').attr('disabled', 'disabled').addClass('opacity-60 cursor-not-allowed');
}
function restoreCrate() {
  if (awaitingPick) return;
  $('.generate').removeAttr('disabled').removeClass('opacity-60 cursor-not-allowed');
}

// ====== dropdown keys ======
document.addEventListener('DOMContentLoaded', () => {
  const keyTypeButton = document.getElementById('key-type-button');
  const keyDropdown = document.getElementById('key-dropdown');
  const keyWrapper = document.getElementById('key-wrapper');
  const keyTypeLabel = document.getElementById('key-type-label');

  if (keyTypeButton && keyDropdown && keyWrapper) {
    const keyTypes = ['Classic', 'Winter', 'Spring', 'Summer', 'Autumn'];

    function applySelectedUI(selected) {
      const opts = keyDropdown.querySelectorAll('[data-value]');
      opts.forEach((btn) => {
        const isSel = btn.getAttribute('data-value') === selected;
        btn.setAttribute('aria-checked', String(isSel));
        btn.classList.toggle('bg-zinc-100', isSel);
        btn.classList.toggle('dark:bg-white/10', isSel);
        const dot = btn.querySelector('[data-radio-dot]');
        if (dot) dot.classList.toggle('hidden', !isSel);
      });
    }

    function setKeyType(kt) {
      rewardKeyType = kt;
      if (keyTypeLabel) keyTypeLabel.textContent = t(`ui.key_types.${kt}`) || kt;
      else keyTypeButton.textContent = t(`ui.key_types.${kt}`) || kt;
      applySelectedUI(kt);
      keyDropdown.classList.add('hidden');
      keyTypeButton.setAttribute('aria-expanded', 'false');
      fetchKeys(user_id, kt);
    }

    function renderDropdown() {
      keyDropdown.innerHTML = '';
      keyTypes.forEach((kt) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.role = 'option';
        item.setAttribute('data-value', kt);
        item.setAttribute('aria-checked', 'false');
        item.className =
          'dd-opt flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-sm text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer';

        const left = document.createElement('span');
        left.className = 'flex items-center gap-2 min-w-0';

        const radio = document.createElement('span');
        radio.className = 'h-4 w-4 shrink-0 rounded-full border border-zinc-300 dark:border-white/20 flex items-center justify-center';
        const dot = document.createElement('span');
        dot.setAttribute('data-radio-dot', '1');
        dot.className = 'h-2 w-2 rounded-full bg-brand-500 hidden';
        radio.appendChild(dot);

        const label = document.createElement('span');
        label.className = 'truncate';
        label.textContent = t(`ui.key_types.${kt}`) || kt;

        left.appendChild(radio);
        left.appendChild(label);
        item.appendChild(left);

        item.addEventListener('click', () => setKeyType(kt));
        keyDropdown.appendChild(item);
      });

      applySelectedUI(rewardKeyType);
    }

    keyTypeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const willHide = keyDropdown.classList.toggle('hidden');
      keyTypeButton.setAttribute('aria-expanded', String(!willHide));
    });

    document.addEventListener('click', (e) => {
      if (!keyWrapper.contains(e.target) && !keyDropdown.classList.contains('hidden')) {
        keyDropdown.classList.add('hidden');
        keyTypeButton.setAttribute('aria-expanded', 'false');
      }
    });

    renderDropdown();
    if (keyTypeLabel) keyTypeLabel.textContent = t(`ui.key_types.${rewardKeyType}`) || rewardKeyType;
    else keyTypeButton.textContent = t(`ui.key_types.${rewardKeyType}`) || rewardKeyType;
    fetchKeys(user_id, rewardKeyType);
  }
});

// ====== Open pack flow ======
async function proceedWithLootBoxOpening() {
  if (keys <= 0) {
    showWarningMessage(t("lootbox.no_keys_available"));
    return;
  }
  if (isRunning) return;

  keys--;
  updateKeyDisplay();
  isRunning = true;
  pauseCrate();
  crate = [];
  hideCrate();
  deleteCards();

  // Audio
  const AUDIO_OFFSET_FIRST_MS  = 0;
  const AUDIO_OFFSET_REOPEN_MS = 50;
  const AUDIO_OFFSET_MS = packOpened ? AUDIO_OFFSET_REOPEN_MS : AUDIO_OFFSET_FIRST_MS;

  const myAudioToken = ++openSoundToken;
  if (openSoundTimer) {
    clearTimeout(openSoundTimer);
    openSoundTimer = null;
  }

  const playOpenSoundNow = () => {
    try { openSound.pause(); } catch {}
    try { openSound.currentTime = 0; } catch {}
    openSound.volume = volume;
    openSound.play().catch(() => {});
  };

  let audioPlayed = false;
  const onOpenStart = () => {
    if (audioPlayed) return;
    audioPlayed = true;

    const play = () => {
      if (openSoundToken !== myAudioToken) return;
      playOpenSoundNow();
    };

    if (AUDIO_OFFSET_MS > 0) {
      openSoundTimer = setTimeout(play, AUDIO_OFFSET_MS);
    } else {
      play();
    }
  };

  //3D timings
  let revealAt = null;
  let totalAt = null;
  let using3D = false;

  try {
    const ctrl = lootbox3d || (lootbox3dPromise ? await lootbox3dPromise : null);
    if (ctrl) {
      const mode = packOpened ? "repeat" : "first";

      // offsetMs
      const timings = ctrl.playOpen({
        mode,
        onOpenStart,
        audioOffsetMs: AUDIO_OFFSET_MS,
      });

      revealAt = timings?.revealAt ?? null;
      totalAt = timings?.total ?? null;
      using3D = revealAt != null;
    } else {
      onOpenStart();
    }
  } catch (e) {
    console.warn("[lootbox3d] playOpen failed:", e);
    onOpenStart();
  }

  //DOM timings
  const firstTimeDelays = { separation: 600, cardOut: 700, cardIn: 500 };
  const subsequent = { flip: 500, disintegration: 400, cardIn: 400 };
  const D = packOpened ? subsequent : firstTimeDelays;

  const appearDelays = using3D ? [0, 220, 440] : [1700, 2000, 2200];

  const replaceWithRewards = async () => {
    deleteCards();
    hideCrate();

    const ctrl = lootbox3d || (lootbox3dPromise ? await lootbox3dPromise : null);

    if (ctrl?.cards3d?.setRewards && ctrl?.cards3d?.open) {
      ctrl.cards3d.setRewards(generatedRewards, {
        pickLabel: t("ui.pick_a_card") || "Pick a card",
        backLogoUrl: CARD_BACK_LOGO_URL,
      });

      ctrl.cards3d.open({ appearDelaysMs: appearDelays });
      awaitingPick = true;
      return;
    }

    showCrate();
    displayRewards(generatedRewards, { appearDelays });
    awaitingPick = true;
  };

  if (revealAt != null) {
    setTimeout(replaceWithRewards, revealAt);
  } else {
    if (!packOpened) {
      $("#box .loot-card, #crate .loot-card").each((i, el) => el.classList.add("lb-box-out"));
      setTimeout(replaceWithRewards, D.separation + D.cardOut);
    } else {
      $(".card").each((i, el) => el.classList.add("lb-shrink-out"));
      setTimeout(replaceWithRewards, subsequent.flip + subsequent.disintegration + subsequent.cardIn);
    }
  }

  const maxAppear = Math.max(...appearDelays) + 600;
  const endAt = totalAt != null ? Math.max(totalAt, maxAppear) : maxAppear;

  setTimeout(() => {
    isRunning = false;
    packOpened = true;
  }, endAt);
}

function deleteCards() {
  // remove reward cards
  $('#crate li').remove();
  // remove placeholders
  $('#box .loot-card, #crate .loot-card').remove();
}

function hideCrate() {
  const el = document.getElementById('crate');
  if (!el) return;
  el.classList.add('hidden', 'pointer-events-none');
  el.classList.remove('opacity-100');
  el.classList.add('opacity-0');
}

function showCrate() {
  const el = document.getElementById('crate');
  if (!el) return;
  el.classList.remove('hidden');
  el.classList.remove('pointer-events-none');
  requestAnimationFrame(() => {
    el.classList.remove('opacity-0');
    el.classList.add('opacity-100');
  });
}


// ====== RENDER cartes ======
const HATCH_CLASS =
  "after:content-[''] after:absolute after:inset-0 after:rounded-2xl after:pointer-events-none " +
  'after:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,.08)_0,rgba(255,255,255,.08)_8px,transparent_8px,transparent_16px)] ' +
  'after:z-[3] after:opacity-100 after:transition-opacity after:duration-300';

function displayRewards(rewards, opts = {}) {
  const appearDelays =
    Array.isArray(opts.appearDelays) && opts.appearDelays.length === 3
      ? opts.appearDelays
      : [2300, 2500, 2700];

  const $crate = $('#crate');
  $crate
    .removeClass()
    .addClass('grid grid-cols-1 sm:grid-cols-3 gap-6 w-full justify-items-center');

  let rewardGranted = false;

  rewards.forEach((reward, idx) => {
    const sty = rarityStyle(reward.rarity);

    const $li = $('<li/>').addClass(
      'card relative [perspective:1000px] h-[320px] w-[220px] will-change-transform will-change-opacity lb-card-transition lb-card-start'
    );

    const $inner = $('<div/>').addClass(
      `lb-inner relative h-full w-full rounded-2xl border border-white/10 bg-zinc-900/80 ring-1 ring-white/10 shadow-xl`
    );

    const $front = $('<div/>')
      .addClass(
        'lb-front lb-placeholder cursor-pointer absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-zinc-800'
      )
      .append(
        $('<span/>')
          .addClass('mt-40 text-xs font-semibold text-zinc-200/80')
          .text(t('ui.pick_a_card') || 'Pick a card')
      );

    const $back = $('<div/>').addClass(
      'lb-back absolute inset-0 flex flex-col rounded-2xl overflow-hidden'
    );

    const $imgWrap = $('<div/>').addClass('relative flex-1 bg-black/30 overflow-hidden flex items-center justify-center');

    const isBg = String(reward.type).toLowerCase() === 'background';

    const $img = $('<img/>')
      .attr('alt', reward.name)
      .addClass(
        isBg
          ? 'h-full w-full object-cover'
          : 'max-h-[85%] max-w-[85%] object-contain'
      );

    $imgWrap.append($img);

    const $info = $('<div/>').addClass(
      'p-3 space-y-1 border-t border-white/10 bg-zinc-950/30'
    );

    const $name = $('<div/>').addClass('text-sm font-semibold truncate text-zinc-100');
    const $type = $('<div/>').addClass('text-xs text-zinc-400');
    const $badge = $('<span/>').addClass(
      `inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${sty.badge}`
    );

    $info.append($name, $type, $badge);
    $back.append($imgWrap, $info);
    $inner.append($front, $back);
    $li.append($inner);
    $crate.append($li);

    $li.data('rarity', reward.rarity);
    $li.data('reward-name', reward.name);
    $li.data('reward-type', reward.type);
    $li.data('reward-image', reward.url);

    let translatedName = reward.name;
    if (reward.type?.toLowerCase() === 'background') {
      const key = `map_name.${reward.name.toLowerCase().replace(/[()]/g, '').replace(/\s+/g, '_')}`;
      const tr = t(key);
      if (tr && !tr.startsWith('map_name.')) translatedName = tr;
    }
    $li.data('reward-name-translated', translatedName);
    $li.data(
      'reward-type-translated',
      t(`ui.rewards_types.${String(reward.type).toLowerCase().replace(/ /g, '_')}`) ||
        reward.type
    );

    $li.on('click', function () {
      const turned = $(this).attr('data-turned') === '1';
      if (turned) return;

      revealCard($(this), reward);

      setTimeout(() => {
        $('.card')
          .not(this)
          .each(function () {
            if ($(this).attr('data-turned') !== '1') {
              const otherReward = rewards[$(this).index()];
              revealCard($(this), otherReward, false);
              $(this).children().first().addClass(HATCH_CLASS);
            }
          });
      }, 1000);
    });

    const delay = appearDelays[idx] ?? appearDelays[appearDelays.length - 1];
    setTimeout(() => {
      requestAnimationFrame(() => {
        $li.removeClass('lb-card-start').addClass('lb-card-in');
      });
    }, delay);
  });

  function revealCard($card, reward, grantRewardFlag = true) {
    const $inner = $card.children().first();
    const img = $card.data('reward-image');
    const name = $card.data('reward-name-translated');
    const type = $card.data('reward-type-translated');

    $inner.find('img').attr('src', img);
    $inner.find('.text-sm.font-semibold.truncate').text(name);
    $inner.find('.text-xs.text-zinc-400').text(type);
    $inner.find('span').text(String(reward.rarity).toUpperCase());

    const el = $inner.get(0);
    if (el) {
      $inner.removeClass('ring-white/10');
      const toRemove = [];
      el.classList.forEach((c) => {
        if (
          c.startsWith('ring-') &&
          !/^ring-(0|1|2|4|8)$/.test(c) &&
          c !== 'ring' &&
          c !== 'ring-inset' &&
          !c.startsWith('ring-offset')
        ) {
          toRemove.push(c);
        }
      });
      toRemove.forEach((c) => el.classList.remove(c));
    }

    const sty = rarityStyle(reward.rarity);
    $inner.addClass(`${sty.ring} ${sty.glow}`);

    $card.addClass('lb-flipped');
    $card.attr('data-turned', '1');

    if (grantRewardFlag && !rewardGranted) {
      playSound(reward.rarity);
      grantReward(user_id, reward);
      rewardGranted = true;
      awaitingPick = false;
      restoreCrate();
    }
  }
}

// ====== Rewards list ======
document.addEventListener('DOMContentLoaded', () => {
  const rewardsContainer = document.getElementById('rewards-container');

  async function loadRewards(filterType) {
    try {
      const response = await fetch(`${API_BASE}/rewards`, { cache: 'no-store' });
      const text = await response.text();
      const rewards = JSON.parse(text);

      let filtered = rewards;
      if (filterType) {
        if (filterType === 'skin-pose') {
          filtered = rewards.filter((r) => r.type === 'skin' || r.type === 'pose');
        } else {
          filtered = rewards.filter((r) => r.type === filterType);
        }
      }

      const order = ['legendary', 'epic', 'rare', 'common'];
      filtered.sort((a, b) => order.indexOf(a.rarity) - order.indexOf(b.rarity));

      rewardsContainer.innerHTML = '';
      rewardsContainer.className = 'mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3';

      filtered.forEach((r) => {
        const sty = rarityStyle(r.rarity);
        const card = document.createElement('div');
        card.className = `rounded-xl overflow-hidden border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 ring-1 ${sty.ring} ${sty.glow}`;
        card.innerHTML = `
          <div class="aspect-[4/3] bg-black/20 flex items-center justify-center">
            <img src="${r.url}" class="max-h-full object-contain">
          </div>
          <div class="p-2">
            <div class="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">${r.name}</div>
            <div class="mt-1 inline-flex items-center rounded px-2 py-0.5 ${sty.badge} text-[10px] font-semibold uppercase">${r.rarity}</div>
          </div>
        `;
        rewardsContainer.appendChild(card);
      });

      rewardsContainer.classList.remove('hidden');
    } catch (err) {
      console.error('Error fetching rewards:', err);
      rewardsContainer.innerHTML = `<p class="text-sm text-zinc-700 dark:text-zinc-300">${t('ui.error_loading_rewards')}</p>`;
      rewardsContainer.classList.remove('hidden');
    }
  }

  document.querySelectorAll('.filter-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const ft = btn.getAttribute('data-type');
      loadRewards(ft);
    });
  });
});

// ====== sons ======
function unlockAudioSilentOnce() {
  if (soundPlaybackAllowed) return;

  const all = [openSound, ...Object.values(sounds)];
  all.forEach((a) => {
    if (!a) return;
    const prevMuted = a.muted;
    const prevVol = a.volume;

    a.muted = true;
    a.volume = 0;

    a.play()
      .then(() => {
        a.pause();
        a.currentTime = 0;
        a.muted = prevMuted;
        a.volume = prevVol;
        soundPlaybackAllowed = true;
      })
      .catch(() => {});
  });
}

function playSound(quality) {
  if (!soundPlaybackAllowed) return;
  let s = sounds[String(quality).toLowerCase()] || null;
  if (!s) return;
  if (s.readyState >= 2) {
    s.currentTime = 0;
    s.play().catch(() => {});
  }
}

// ====== helpers modals ======
function gpGetModalBox(overlay) {
  return (
    overlay?.querySelector?.(
      '[data-modal-box], #gp-settings-card, .modal-card, .modal-panel, .modal-content, .card, [role="dialog"]'
    ) ||
    overlay?.firstElementChild ||
    null
  );
}
function gpEnsureInBody(el) {
  if (el && el.parentElement !== document.body) document.body.appendChild(el);
}
function gpInitModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay || overlay.dataset.gpInit === '1') return;
  overlay.dataset.gpInit = '1';
  overlay.classList.add(
    'fixed',
    'inset-0',
    'z-50',
    'bg-black/60',
    'backdrop-blur-sm',
    'p-4',
    'hidden',
    'items-center',
    'justify-center'
  );
  const box = gpGetModalBox(overlay);
  if (box) {
    box.classList.add(
      'transition',
      'duration-200',
      'ease-out',
      'opacity-0',
      'scale-95',
      'transform'
    );
    const desired = box.dataset.modalMax || overlay.dataset.modalMax || '5xl';
    [...box.classList].forEach((c) => {
      if (c.startsWith('max-w-')) box.classList.remove(c);
    });
    box.classList.add('w-full', `max-w-${desired}`);
  }
}
function gpOpenModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  gpEnsureInBody(overlay);
  gpInitModal(overlayId);
  const box = gpGetModalBox(overlay);
  overlay.dataset.closing = '';
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  overlay.style.removeProperty('display');
  if (box) {
    box.classList.add('opacity-0', 'scale-95');
    box.classList.remove('opacity-100', 'scale-100');
  }
  requestAnimationFrame(() => {
    box?.classList.remove('opacity-0', 'scale-95');
    box?.classList.add('opacity-100', 'scale-100');
  });
}
function gpCloseModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  const box = gpGetModalBox(overlay);
  if (!box) {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    return;
  }
  if (overlay.dataset.closing === '1') return;
  overlay.dataset.closing = '1';
  void box.getBoundingClientRect();
  box.classList.add('opacity-0', 'scale-95');
  box.classList.remove('opacity-100', 'scale-100');
  const getMs = (el) => {
    const cs = getComputedStyle(el);
    const dur = (cs.transitionDuration || '0s').split(',')[0].trim();
    const del = (cs.transitionDelay || '0s').split(',')[0].trim();
    const toMs = (s) => (s.endsWith('ms') ? parseFloat(s) : parseFloat(s) * 1000);
    return toMs(dur) + toMs(del) || 200;
  };
  const timeout = getMs(box) + 50;
  const end = () => {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    overlay.style.removeProperty('display');
    overlay.dataset.closing = '';
  };
  let ended = false;
  const onEnd = (e) => {
    if (e.target !== box) return;
    ended = true;
    box.removeEventListener('transitionend', onEnd);
    end();
  };
  box.addEventListener('transitionend', onEnd);
  setTimeout(() => {
    if (ended) return;
    box.removeEventListener('transitionend', onEnd);
    end();
  }, timeout);
}
document.addEventListener('DOMContentLoaded', () => {
  const infoButton = document.querySelector('.info-button');
  const modal = document.getElementById('infoModal');
  const closeBtn = modal?.querySelector('.close-button');
  if (infoButton) infoButton.addEventListener('click', () => gpOpenModal('infoModal'));
  if (closeBtn) closeBtn.addEventListener('click', () => gpCloseModal('infoModal'));
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) gpCloseModal('infoModal');
    });
  }
});

// ====== helpers skeleton ======
function showBoxSkeleton() {
  const sk = document.getElementById('box-skeleton');
  const fb = document.getElementById('box-fallback');
  if (fb) fb.classList.add('hidden');
  if (sk) {
    sk.classList.remove('hidden');
    sk.setAttribute('aria-busy', 'true');
  }
}

function hideBoxSkeleton() {
  const sk = document.getElementById('box-skeleton');
  if (sk) {
    sk.classList.add('hidden');
    sk.setAttribute('aria-busy', 'false');
  }
}

function showBoxFallback() {
  const sk = document.getElementById('box-skeleton');
  const fb = document.getElementById('box-fallback');
  if (sk) sk.classList.add('hidden');
  if (fb) fb.classList.remove('hidden');
}

// ====== session ======
function normalizeReward(r) {
  return {
    type: String(r.type || '').toLowerCase(),
    name: String(r.name || ''),
    rarity: String(r.rarity || '').toLowerCase(),
    url: String(r.url || ''),
  };
}
function mkRewardSig(r) {
  const n = normalizeReward(r);
  return `${n.type}|${n.name}|${n.rarity}|${n.url}`;
}
function startClientOpenSession(keyType, rewards) {
  const set = new Set(rewards.map(mkRewardSig));
  const bytes = new Uint8Array(16);
  (window.crypto || {}).getRandomValues?.(bytes);
  const clientNonce =
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('') || String(Math.random());
  openSession = { keyType, startedAt: Date.now(), keySet: set, clientNonce };
  setTimeout(() => {
    if (openSession && Date.now() - openSession.startedAt > 110000) openSession = null;
  }, 120000);
}

// ====== boot ======
$(document).ready(function () {
  if (window.user_id) {
    fetchKeys(user_id);
  } else {
    updateKeyDisplay();
  }
});

// modal controller
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('infoModal');
  const panel = modal?.querySelector('[data-modal-box]');
  const openBtn = document.querySelector('.info-button');
  const closeBtn = modal?.querySelector('.close-button');

  function open() {
    if (!modal || !panel) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    requestAnimationFrame(() => {
      panel.classList.remove('opacity-0', 'scale-95');
      panel.classList.add('opacity-100', 'scale-100');
    });
  }
  function close() {
    if (!modal || !panel) return;
    panel.classList.add('opacity-0', 'scale-95');
    panel.classList.remove('opacity-100', 'scale-100');
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }, 180);
  }
  openBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    open();
  });
  closeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    close();
  });
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) close();
  });
});
