// ====== état/appli ======
let isRunning = false;
const openSound = new Audio('assets/sounds/open-box.ogg');
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

const CURRENT_LANG = document.documentElement.lang || 'en';
const BASE_I18N = window.LOOTBOX_I18N || {};
let translations = { ...BASE_I18N, map_name: {} };

const sounds = {
  common: new Audio('assets/sounds/common-sound.ogg'),
  rare: new Audio('assets/sounds/rare-sound.ogg'),
  epic: new Audio('assets/sounds/epic-sound.ogg'),
  legendary: new Audio('assets/sounds/legendary-sound.ogg'),
};
Object.values(sounds).forEach((s) => (s.preload = 'auto'));

// ====== helpers ajax ======
const XSRF = document.cookie
  .split('; ')
  .find((c) => c.startsWith('XSRF-TOKEN='))
  ?.split('=')[1];

$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
  options.xhrFields = options.xhrFields || {};
  options.xhrFields.withCredentials = true;

  const method = (options.type || 'GET').toUpperCase();
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    if (CSRF) jqXHR.setRequestHeader('X-CSRF-TOKEN', CSRF);
    if (XSRF) jqXHR.setRequestHeader('X-XSRF-TOKEN', decodeURIComponent(XSRF));
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

function showToast(message, ok = true) {
  const el = document.createElement('div');
  el.className = `fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] rounded-xl px-4 py-2 text-sm shadow-2xl border transition-all duration-300 opacity-0 translate-y-2
    ${ok ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30' : 'bg-rose-500/20 text-rose-200 border-rose-400/30'}`;
  el.textContent = message;
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.classList.remove('opacity-0', 'translate-y-2');
  });
  setTimeout(() => {
    el.classList.add('opacity-0', 'translate-y-2');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
  }, 1200);
}
function showConfirmationMessage(m) {
  showToast(m, true);
}
function showErrorMessage(m) {
  showToast(m, false);
}

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
        badge: 'bg-zinc-500/10 text-zinc-300',
      };
  }
}

// ====== init ======
async function initializeApp() {
  await loadTranslations();
}
$(document).ready(() => {
  initializeApp();
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
        showErrorMessage(t('popup.error_generic') || 'Unexpected rewards format.');
        restoreCrate();
        return;
      }
      generatedRewards = rewards;
      startClientOpenSession(rewardKeyType, rewards);
      rewardNonce = '';
      proceedWithLootBoxOpening();
    },
    error: function () {
      showErrorMessage(t('popup.error_generic') || 'Network error.');
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
        $('#key-count').html("<i class='fas fa-key mr-1'></i> Error fetching keys");
        return;
      }
      const list = Array.isArray(response) ? response : response?.data || [];
      const filtered = list.filter((k) => k.key_type === selectedKeyType);
      keys = filtered.reduce((s, k) => s + (Number(k.amount) || 0), 0);
      updateKeyDisplay();
    },
    error: function () {
      $('#key-count').html("<i class='fas fa-key mr-1'></i> Error fetching keys");
    },
  });
}
function grantReward(user_id, reward) {
  if (navigator.userActivation && !navigator.userActivation.isActive) {
    showErrorMessage(t('popup.click_required') || 'User action required.');
    return;
  }
  if (!openSession) {
    showErrorMessage(t('lootbox.session_expired') || 'Session expired. Open a new pack.');
    return;
  }
  if (openSession.keyType !== rewardKeyType) {
    showErrorMessage(t('popup.error_generic') || 'Invalid session state.');
    return;
  }

  const sig = mkRewardSig(reward);
  if (!openSession.keySet.has(sig)) {
    showErrorMessage(t('popup.error_generic') || 'Invalid reward.');
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
    showErrorMessage(t('popup.login_required_msg') || 'Login required.');
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
        showErrorMessage(t('lootbox.no_keys_available'));
        restoreCrate();
      }
    },
    error: function () {
      showErrorMessage(t('popup.error_generic') || 'Network error.');
      restoreCrate();
    },
  });
});

async function updateKeyDisplay() {
  await loadTranslations();
  if (user_id) {
    $('#key-count').html(`<i class="fas fa-key mr-1"></i> <span id="key-number">${keys}</span>`);
  } else {
    $('#key-count').html(t('popup.login_required_btn') || 'Login');
  }
}
function pauseCrate() {
  $('.generate').attr('disabled', 'disabled').addClass('opacity-60 cursor-not-allowed');
}
function restoreCrate() {
  if (awaitingPick) return;
  $('.generate').removeAttr('disabled').removeClass('opacity-60 cursor-not-allowed');
}

// ====== dropdown clés ======
document.addEventListener('DOMContentLoaded', () => {
  const keyTypeButton = document.getElementById('key-type-button');
  const keyDropdown = document.getElementById('key-dropdown');
  const keyWrapper = document.getElementById('key-wrapper');

  if (keyTypeButton && keyDropdown && keyWrapper) {
    function renderDropdown() {
      const keyTypes = ['Classic', 'Winter'];
      keyDropdown.innerHTML = '';
      keyTypes.forEach((kt) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.role = 'option';
        item.className =
          'w-full cursor-pointer text-left px-3 py-2 text-sm hover:bg-white/5 border-b border-white/5 last:border-b-0';
        item.textContent = kt;
        item.addEventListener('click', () => {
          rewardKeyType = kt;
          keyTypeButton.textContent = kt;
          keyDropdown.classList.add('hidden');
          keyTypeButton.setAttribute('aria-expanded', 'false');
          fetchKeys(user_id, kt);
        });
        keyDropdown.appendChild(item);
      });
    }

    // Toggle
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
    keyTypeButton.textContent = rewardKeyType;
    fetchKeys(user_id, rewardKeyType);
  }
});

// ====== Open pack flow ======
function proceedWithLootBoxOpening() {
  if (keys <= 0) {
    showErrorMessage(t('lootbox.no_keys_available') || 'No keys.');
    return;
  }
  if (isRunning) return;

  keys--;
  updateKeyDisplay();
  isRunning = true;
  pauseCrate();
  crate = [];

  openSound.volume = volume;
  openSound.play().catch(() => {});

  const firstTimeDelays = { separation: 600, cardOut: 700, cardIn: 500 };
  const subsequent = { flip: 500, disintegration: 400, cardIn: 400 };
  const D = packOpened ? subsequent : firstTimeDelays;

  const appearDelays = [1700, 2000, 2200];

  const replaceWithRewards = () => {
    deleteCards();
    displayRewards(generatedRewards, { appearDelays });
    awaitingPick = true;
  };

  if (!packOpened) {
    $('#box .loot-card').each((i, el) => {
      el.classList.add('lb-box-out');
    });
    setTimeout(replaceWithRewards, D.separation + D.cardOut);
  } else {
    $('.card').each((i, el) => {
      el.classList.add('lb-shrink-out');
    });
    setTimeout(replaceWithRewards, subsequent.flip + subsequent.disintegration + subsequent.cardIn);
  }

  const maxAppear = Math.max(...appearDelays) + 600;
  setTimeout(() => {
    isRunning = false;
    packOpened = true;
  }, maxAppear);
}
function deleteCards() {
  $('#crate li').remove();
  $('#box').remove();
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
      `lb-inner relative h-full w-full rounded-2xl border border-white/10 bg-zinc-900/70 ring-1 ring-white/10 shadow-xl`
    );

    const $front = $('<div/>')
      .addClass(
        'lb-front lb-placeholder cursor-pointer absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-zinc-800'
      )
      .append(
        $('<span/>')
          .addClass('mt-40 text-xs font-semibold text-zinc-300')
          .text(t('ui.pick_a_card') || 'Pick a card')
      );

    const $back = $('<div/>').addClass(
      'lb-back absolute inset-0 flex flex-col rounded-2xl overflow-hidden'
    );

    const $imgWrap = $('<div/>').addClass('flex-1 bg-black/20 flex items-center justify-center');

    const isBg = String(reward.type).toLowerCase() === 'background';
    const $img = $('<img/>')
      .attr('alt', reward.name)
      .addClass(
        isBg ? 'max-h-32 w-[80%] rounded-2xl object-cover shadow' : 'max-h-48 object-contain'
      );

    $imgWrap.append($img);

    const $info = $('<div/>').addClass('p-3 space-y-1 border-t border-white/10 bg-zinc-900/60');
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

    // flip via classe (plus d'inline style)
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
        card.className = `rounded-xl overflow-hidden border border-white/10 bg-zinc-900/60 ring-1 ${sty.ring} ${sty.glow}`;
        card.innerHTML = `
          <div class="aspect-[4/3] bg-black/20 flex items-center justify-center">
            <img src="${r.url}" class="max-h-full object-contain">
          </div>
          <div class="p-2">
            <div class="text-xs font-semibold text-zinc-100 truncate">${r.name}</div>
            <div class="mt-1 inline-flex items-center rounded px-2 py-0.5 ${sty.badge} text-[10px] font-semibold uppercase">${r.rarity}</div>
          </div>
        `;
        rewardsContainer.appendChild(card);
      });

      rewardsContainer.classList.remove('hidden');
    } catch (err) {
      console.error('Error fetching rewards:', err);
      rewardsContainer.innerHTML = `<p class="text-sm text-zinc-300">Error loading rewards.</p>`;
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

// (petit contrôleur modal additionnel, inchangé)
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
