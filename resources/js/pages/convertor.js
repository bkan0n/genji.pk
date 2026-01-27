import { cdnAsset } from "../utils/cdn";

/* =========================
   CONFIG & UTILS
   ========================= */
const DEBUG_MODE = true;
let isEditMode = false;
let currentDataModel = null;
let editIndex = null;
let modesNames = null;
let mapNamesTranslations = null;
let heroesNames = null;
let keywordTranslations = null;
let iconTranslations = null;
let lastFullText = '';
const CURRENT_LANG = document.documentElement.lang || 'en';
let translations = window.CONVERTOR_I18N || {};
let draggedCard = null;
let draggedIndex = null;
window.selectSection = selectSection;
const Diff = window.Diff;
const container = document.getElementById('mapSettings');
let allTranslations = null;
let __lastTranslateCtx = { used: false, sourceLang: null, targetLang: null };

let lastParsedWorkshopSettings = {
  editorMode: false,
  portals: false,
  playtest: false,
};

const globalSettings = {
  editorMode: false,
  difficultyHUD: 'off',
  playtest: 'off',
  validator: 'on',
  portals: 'off',
};

const DIFFICULTY_MAP = [
  /* 0 */ 'playtest',
  /* 1 */ 'easy-',
  /* 2 */ 'easy',
  /* 3 */ 'easy+',
  /* 4 */ 'medium-',
  /* 5 */ 'medium',
  /* 6 */ 'medium+',
  /* 7 */ 'hard-',
  /* 8 */ 'hard',
  /* 9 */ 'hard+',
  /*10 */ 'veryhard-',
  /*11 */ 'veryhard',
  /*12 */ 'veryhard+',
  /*13 */ 'extreme-',
  /*14 */ 'extreme',
  /*15 */ 'extreme+',
  /*16 */ 'hell',
  /*17 */ 'off',
];

const KW_GLOBAL = '(?:Global|全局|グローバル)';
const KW_ARRAY = '(?:Array|数组|配列)';
const KW_COMBO = '(?:Workshop\\s*Setting\\s*Combo|地图工坊设置组合|ワークショップ設定コンボ)';

const BAN_MARKERS = {
  createbhop: {
    canonical: 'Ban Create Bhop         ◆ 封禁卡小      ◆ 앉콩 금지',
    markers: [
      'Ban Create Bhop         ◆ 封禁卡小      ◆ 앉콩 금지',
      'Ban Create Bhop',
      'Create Bhop',
      '封禁卡小', '앉콩 금지'
    ]
  },
  deathhop: {
    canonical: 'Ban Death Hop        ◆ 封禁死小      ◆ 죽음콩 금지',
    markers: [
      'Ban Death Hop        ◆ 封禁死小      ◆ 죽음콩 금지',
      'Ban Death Hop',
      'Ban Deathbhop ■ 封禁死小 ■ 죽음 콩콩이 금지',
      'Ban Deathbhop', 'Deathbhop',
      '封禁死小', '죽음콩 금지'
    ]
  },
  emotesavehop: {
    canonical: 'Ban Emote Save Hop     ◆ 封禁表情留小    ◆ 감콩 금지',
    markers: [
      'Ban Emote Save Hop     ◆ 封禁表情留小    ◆ 감콩 금지',
      'Ban Emote Save Hop',
      'Ban Emote Savehop ■ 封禁表情留小 ■ 감정표현 콩콩이 금지',
      'Ban Emote Savehop', 'Emote Savehop',
      '封禁表情留小', '감콩 금지'
    ]
  },
  multiclimb: {
    canonical: 'Ban MultiClimb        ◆ 封禁蹭留      ◆ 벽캔 금지',
    markers: [
      'Ban MultiClimb        ◆ 封禁蹭留      ◆ 벽캔 금지',
      'Ban MultiClimb',
      'Ban Multiclimb ■ 封禁蹭留 ■ 무한 벽타기 금지',
      'Ban Multiclimb', 'Multiclimb',
      '封禁蹭留', '벽캔 금지', '무한 벽타기 금지'
    ]
  },
  savedouble: {
    canonical: 'Ban Save Double         ◆ 封禁留二段跳    ◆ 더블 세이브 금지',
    markers: [
      'Ban Save Double         ◆ 封禁留二段跳    ◆ 더블 세이브 금지',
      'Ban Save Double',
      '封禁留二段跳', '더블 세이브 금지'
    ]
  },
  standcreate: {
    canonical: 'Ban StandCreate        ◆ 封禁站卡      ◆ 서콩 금지',
    markers: [
      'Ban StandCreate        ◆ 封禁站卡      ◆ 서콩 금지',
      'Ban StandCreate',
      'Ban Standcreate ■ 封禁站卡 ■ 서서 콩콩이 생성 금지',
      'Ban Standcreate', 'Standcreate',
      '封禁站卡', '서콩 금지'
    ]
  },
  wallclimb: {
    canonical: 'Ban WallClimb        ◆ 封禁爬墙      ◆ 벽타기 금지',
    markers: [
      'Ban WallClimb        ◆ 封禁爬墙      ◆ 벽타기 금지',
      'Ban WallClimb',
      'Ban Wallclimb ■ 封禁爬墙 ■ 벽타기 금지',
      'Ban Wallclimb', 'Wallclimb',
      '封禁爬墙', '벽타기 금지'
    ]
  },
  bhopavailable: {
    canonical: 'Require Bhop Available     ◆ 留小跳进点     ◆ 콩콩이 금지',
    markers: [
      'Require Bhop Available     ◆ 留小跳进点     ◆ 콩콩이 금지',
      'Require Bhop Available',
      '留小跳进点', '콩콩이 필요'
    ]
  },
  djumpavailable: {
    canonical: 'Require Djump Available   ◆ 留二段跳进点    ◆ 도착 시 이단 점프 필요',
    markers: [
      'Require Djump Available   ◆ 留二段跳进点    ◆ 도착 시 이단 점프 필요',
      'Require Djump Available',
      '留二段跳进点', '도착 시 이단 점프 필요'
    ]
  },
};

const SETTINGS_MARKERS = {
  editorMode: {
    canonical: 'Editor Mode         ◆ 作图模式      ◆ 편집 모드',
    markers: [
      'Editor Mode         ◆ 作图模式      ◆ 편집 모드',
      'Editor Mode',
      'Editor mode - 作图模式',
      'Editor mode',
      '作图模式', '편집 모드'
    ],
  },
  playtestDisplay: {
    canonical: 'Playtest Display        ◆ 游戏测试      ◆ 플레이테스트 디스플레이',
    markers: [
      'Playtest Display        ◆ 游戏测试      ◆ 플레이테스트 디스플레이',
      'Playtest Display',
      'Playtest display - 游戏测试',
      'Playtest display',
      '游戏测试', '플레이테스트 디스플레이'
    ],
  },
  portalsControlMaps: {
    canonical: 'Portals 󠀨Control Maps󠀩    ◆ 启用传送门 󠀨占点地图󠀩 ◆ 순간이동 활성화 󠀨쟁탈 맵󠀩',
    markers: [
      'Portals 󠀨Control Maps󠀩    ◆ 启用传送门 󠀨占点地图󠀩 ◆ 순간이동 활성화 󠀨쟁탈 맵󠀩',
      'Portals Control Maps',
      'enable portals control maps - 启用传送门 占点地图',
      'enable portals control maps',
      '启用传送门 占点地图', '순간이동 활성화 쟁탈 맵'
    ],
  },
};

const GLOBAL_BANS = Object.values(BAN_MARKERS).map(e => e.canonical);

const ALL_TRANSLATION_FILES = [
  { key: 'actions', path: 'actions.json' },
  { key: 'constants', path: 'constants.json' },
  { key: 'customGameSettings', path: 'customGameSettings.json' },
  { key: 'gamemodes', path: 'gamemodes.json' },
  { key: 'heroes', path: 'heroes.json' },
  { key: 'icons', path: 'icons.json', normalize: (raw) => raw.Icon || raw },
  { key: 'localizedStrings', path: 'localizedStrings.json' },
  { key: 'maps', path: 'maps.json' },
  { key: 'other', path: 'other.json' },
  { key: 'values', path: 'values.json' },
];

const HERO_FILE_MAP = {
  GENJI: 'mechanics/Genji.opy',
  HANZO: 'mechanics/Hanzo.opy',
  KIRIKO: 'mechanics/Kiriko.opy',
  HAZARD: 'mechanics/Hazard.opy',
};

const OVERPY_COMMIT = 'dd8fc2d25459243053f8214478e13d85fda759af';
const TS_BASE = `https://cdn.jsdelivr.net/gh/Zezombye/overpy@${OVERPY_COMMIT}/src/data/`;

const TRANSLATION_FILES = [
  'gamemodes.json',
  'heroes.json',
  'values.json',
  'other.json',
  'maps.json',
  'localizedStrings.json',
  'customGameSettings.json',
  'constants.json',
  'actions.json',
];

/* =========================
   MARKERS & RULE LABELS
   ========================= */
const MARKERS = {
  titles: {
    mapData: [
      'Ø Map Data - 数据录入 <---- INSERT HERE / 在这输入',
      '<tx0C0000000000D297><fg00FFFFFF> Map Data - 数据录入 <---- INSERT HERE / 在这输入',
      '<tx0C0000000000D297><fg00FFFFFF> Map Data - 数据录入 <---- INSERT HERE / 在这入力',
      '<tx0C0000000000D297><fg00FFFFFF> Map Data - 数据录入 <---- INSERT HERE',
      'Map Data <---- INSERT YOUR MAP DATA HERE',
      'Map Data     <---- INSERT YOUR MAP DATA HERE"',
      'Map Data - 数据录入 <---- INSERT HERE / 在这输入',
      '맵 데이터 <---- 입력은 여기에',
      'Map Data     <---- INSERT YOUR MAP DATA HERE',
    ],
    credits: [
      '☞ Credits and Colors here - 作者代码HUD颜色 <---- INSERT HERE / 在这输入',
      '<tx0C00000000044B55><fg0FFFFFFF> Credits and Colors here - 作者代码HUD颜色 <---- INSERT HERE / 在这输入',
      '<tx0C00000000044B55><fg0FFFFFFF> Credits and Colors here - 作者代码HUD颜色 <---- INSERT HERE',
      'Credits here - 作者名字 <---- INSERT HERE / 在这入力',
      'Credits here - 作者名字 <---- INSERT HERE / 在这输入',
      'Credits here <---- INSERT YOUR NAME HERE',
    ],
    addons: [
      'Addon | Custom difficulty hud  - 自定义难度hud <---- INSERT HERE / 在这输入',
      'Addon | Title Data - 标题数据 <---- EDIT ME / 在此处编辑',
      'Addon | Friend Title - 朋友称号 <---- DISPLAY MESSAGE HERE (ON PLAYER)',
      'Addon | Display Author Time - 展示世界纪录 <---- EDIT ME / 在此处编辑',
      'Addon | HUD text for certain Checkpoints - 特定关卡显示的HUD文本 <---- EDIT ME / 在此处编辑',
      'Addon | Hint text for certain Checkpoints - 特定关卡的提示文本 <---- EDIT ME / 在此处编辑',
      'Addon | 3rd Person Camera Mode - 第三人称',
      'Addon | Stall enhancer - 增强系統跳的判定',
      'Addon | Fake Ledge Dash - 超级跳',
      'Addon | Group up - Map Data',
      'Addon | Group Up',
      'Addon | Custom checkpoint loading or resetting',
      'Addon | Custom Orb Script',
      'Addon | Fake Triple Jump - 假三段跳',
    ],
  },

  words: {
    rule: {
      'zh-CN': '规则',
      'ja-JP': 'ルール',
      'es-MX': 'regla',
      'pt-BR': 'regra',
      'de-DE': 'regel',
      'ko-KR': 'rule',
      'ru-RU': 'rule',
      default: 'rule',
    },
    actions: {
      'zh-CN': '动作',
      'ja-JP': 'アクション',
      'pt-BR': 'ações',
      'es-MX': 'acciones',
      'de-DE': 'aktionen',
      'ko-KR': 'action',
      'ru-RU': 'actions',
      default: 'actions',
    },
    event: {
      'zh-CN': '事件',
      'ja-JP': 'イベント',
      default: 'event',
    },
    ongoing: {
      'zh-CN': '持续 - 全局',
      'ja-JP': '進行中 - グローバル',
      default: 'Ongoing - Global',
    },
    workshop: {
      'zh-CN': '地图工坊',
      'ja-JP': 'ワークショップ',
      default: 'workshop',
    },
    enabledMaps: {
      'ja-JP': '有効なマップ',
      'zh-CN': '启用地图',
      'es-MX': 'mapas habilitados',
      'pt-BR': 'mapas ativados',
      'de-DE': 'verfügbare karten',
      default: 'enabled maps',
    },
    extensions: {
      'es-MX': 'extensiones',
      'pt-BR': 'extensões',
      'de-DE': 'Erweiterungen',
      'ja-JP': '拡張',
      'zh-CN': '扩展',
      default: 'extensions',
    },
    disabled: {
      'es-MX': 'deshabilitado',
      'pt-BR': 'desabilitado',
      'de-DE': 'deaktiviert',
      'ja-JP': '無効',
      'zh-CN': '禁用',
      default: 'disabled',
    },
  },
};

/* =========================
   WORKER
   ========================= */
let __tplWorker, __tplReqId = 0;
function __getTplWorker(){
  if (__tplWorker) return __tplWorker;
  __tplWorker = new Worker(new URL('../components/convertor.worker.js', import.meta.url), { type: 'classic' });
  return __tplWorker;
}
function runTplWorker(type, payload){
  const w = __getTplWorker();
  const id = ++__tplReqId;
  return new Promise((resolve, reject) => {
    const onMsg = (e) => {
      const { id: rid, ok, result, error } = e.data || {};
      if (rid !== id) return;
      w.removeEventListener('message', onMsg);
      ok ? resolve(result) : reject(new Error(error));
    };
    w.addEventListener('message', onMsg);
    w.postMessage({ id, type, payload });
  });
}


/* =========================
   DATA BLOCKS
   ========================= */
function getWord(group, lang = getActiveOutputLang()) {
  const dict = MARKERS.words[group] || {};
  return dict[lang] || dict.default || '';
}
function getMarkers(listName) {
  const list = MARKERS.titles[listName] || [];
  return Array.isArray(list) ? list.slice() : [];
}
function firstMarker(listName) {
  const arr = getMarkers(listName);
  return arr.length ? arr[0] : '';
}

function getActiveOutputLang() {
  if (__lastTranslateCtx.used && __lastTranslateCtx.targetLang) return __lastTranslateCtx.targetLang;
  const langEl = document.getElementById('lang');
  return (langEl && langEl.value) || CURRENT_LANG || 'en-US';
}

/* ———————————— Rule header builders ———————————— */
function buildRuleHeader(title, lang = getActiveOutputLang()) {
  const wRule = getWord('rule', lang);
  return `${wRule}("${title}")`;
}
function wrapRuleBody(header, eventBody, actionsBody, lang = getActiveOutputLang()) {
  const wEvent = getWord('event', lang);
  const wActions = getWord('actions', lang);
  const wOngoing = getWord('ongoing', lang);
  return `${header} {
    ${wEvent}
    {
        ${wOngoing};
    }

    ${wActions}
    {
${actionsBody}
    }
}`;
}

/* ———————————— Generic block locate / remove ———————————— */
function findRuleByTitle(text, title, lang = getActiveOutputLang(), { allowDisabled = true } = {}) {
  const ruleWord = getWord('rule', lang);
  const disabledWord = getWord('disabled', lang);
  const titleEsc = title.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

  const headerRe = allowDisabled
    ? new RegExp(
        `(^|\\n)[ \\t]*(?:${disabledWord}\\s+)?${ruleWord}\\s*\\(\\s*"${titleEsc}"\\s*\\)\\s*\\{`,
        'i'
      )
    : new RegExp(`(^|\\n)[ \\t]*${ruleWord}\\s*\\(\\s*"${titleEsc}"\\s*\\)\\s*\\{`, 'i');

  const m = text.match(headerRe);
  if (!m) return null;

  const openIdx = text.indexOf('{', m.index + m[0].length - 1);
  if (openIdx < 0) return null;

  let depth = 1, i = openIdx + 1;
  for (; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) break; }
  }
  if (depth !== 0) return null;

  return { startHeaderIdx: m.index + (m[1] ? m[1].length : 0), openIdx, closeIdx: i };
}

/* =========================
   BUSY UI HELPERS
   ========================= */
let __busyRun = false;

function setButtonsBusy(isBusy, kind = '') {
  const btnConvert = document.getElementById('convert-btn');
  const btnTranslate = document.getElementById('translate-btn');

  document.body.classList.toggle('cursor-wait', isBusy);
  document.body.setAttribute('aria-busy', String(isBusy));

  if (btnConvert) {
    btnConvert.disabled = isBusy;
    if (isBusy && kind === 'convert') btnConvert.dataset._old = btnConvert.textContent, btnConvert.textContent = t('common.processing');
    else if (!isBusy && btnConvert.dataset._old) btnConvert.textContent = btnConvert.dataset._old;
  }
  if (btnTranslate) {
    btnTranslate.disabled = isBusy;
    if (isBusy && kind === 'translate') btnTranslate.dataset._old = btnTranslate.textContent, btnTranslate.textContent = t('common.translating');
    else if (!isBusy && btnTranslate.dataset._old) btnTranslate.textContent = btnTranslate.dataset._old;
  }
}

const nextFrame = () => new Promise(r => requestAnimationFrame(() => r()));
const runIdle = (fn) => (window.requestIdleCallback ? requestIdleCallback(fn) : setTimeout(fn, 1));

async function withBusy(kind, fn) {
  if (__busyRun) return;
  __busyRun = true;
  setButtonsBusy(true, kind);
  //showLoader();
  try {
    await nextFrame();
    return await fn();
  } finally {
    hideLoader();
    setButtonsBusy(false);
    __busyRun = false;
  }
}

function prewarmTemplateForCurrentLang() {
  try {
    const langEl = document.getElementById('lang');
    const lang = (langEl && langEl.value) || 'en-US';
    runTplWorker('compile', { lang }).catch(() => {});
  } catch (_) {}
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(prewarmTemplateForCurrentLang, 0);

  const btnConvert = document.getElementById('convert-btn');
  const btnTranslate = document.getElementById('translate-btn');
  btnConvert?.addEventListener('mouseenter', prewarmTemplateForCurrentLang, { once: true });
  btnTranslate?.addEventListener('mouseenter', prewarmTemplateForCurrentLang, { once: true });
});

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
   FRAMEWORK TRANSLATIONS
   ========================= */
async function loadMapNameTranslations() {
  if (mapNamesTranslations) return mapNamesTranslations;

  try {
    const res = await fetch('translations/maps.json');
    if (!res.ok) {
      console.warn('Impossible de charger translations/maps.json :', res.status);
      mapNamesTranslations = {};
      return mapNamesTranslations;
    }
    mapNamesTranslations = await res.json();
    return mapNamesTranslations;
  } catch (e) {
    console.warn('Erreur durant fetch(« maps.json »):', e);
    mapNamesTranslations = {};
    return mapNamesTranslations;
  }
}

function buildUnifiedKeywordTranslations(bundle) {
  const LANG_KEY_RE = /^[a-z]{2}(?:-[A-Z]{2})?$/;
  const unified = {};

  const SOURCES = [
    'actions',
    'constants',
    'customGameSettings',
    'gamemodes',
    'heroes',
    'localizedStrings',
    'maps',
    'other',
    'values',
  ];

  function walkDict(obj) {
    if (!obj || typeof obj !== 'object') return;

    for (const [engKey, entry] of Object.entries(obj)) {
      if (!entry || typeof entry !== 'object') continue;

      const langKeys = Object.keys(entry).filter(
        (k) => LANG_KEY_RE.test(k) && typeof entry[k] === 'string'
      );

      if (langKeys.length) {
        for (const lang of langKeys) {
          const val = entry[lang];
          if (typeof val !== 'string') continue;
          if (!unified[lang]) unified[lang] = {};
          if (unified[lang][engKey] == null) {
            unified[lang][engKey] = val;
          }
        }
      } else {
        walkDict(entry);
      }
    }
  }

  for (const src of SOURCES) {
    walkDict(bundle[src] || {});
  }

  return unified;
}

async function loadAllTranslations(force = false) {
  if (allTranslations && !force) return allTranslations;

  const out = {};

  await Promise.all(
    ALL_TRANSLATION_FILES.map(async ({ key, path, normalize }) => {
      try {
        const res = await fetch(`translations/${path}`, { cache: 'no-cache' });
        if (!res.ok) {
          console.warn(`Impossible de charger translations/${path} :`, res.status);
          out[key] = {};
          return;
        }
        const raw = await res.json();
        out[key] = typeof normalize === 'function' ? normalize(raw) : raw;
      } catch (e) {
        console.warn(`Erreur durant fetch("${path}") :`, e);
        out[key] = {};
      }
    })
  );

  modesNames = out.gamemodes || {};
  mapNamesTranslations = out.maps || {};
  heroesNames = out.heroes || {};
  keywordTranslations = buildUnifiedKeywordTranslations(out);
  iconTranslations = out.icons || {};

  allTranslations = out;
  return out;
}

function translateWorkshopValuesOnly(block, sourceLang, targetLang) {
  if (!block || !block.trim()) return block;

  const lines = block.split(/\r?\n/);

  const out = lines.map((raw) => {
    if (!raw.trim()) return raw;

    let lastColon = Math.max(raw.lastIndexOf(':'), raw.lastIndexOf('：'));
    if (lastColon === -1) return raw;

    const left = raw.slice(0, lastColon + 1);
    const right = raw.slice(lastColon + 1);

    const m = right.match(/^(\s*)(.*?)(\s*(?:\/\/.*)?)\s*$/);
    if (!m) {
      return left + translateFromTo(right, sourceLang, targetLang);
    }
    const leading = m[1] || '';
    const core = m[2] || '';
    const tail = m[3] || '';

    const translatedCore = core ? translateFromTo(core, sourceLang, targetLang) : core;

    return left + leading + translatedCore + tail;
  });

  return out.join('\n');
}

function translateFromTo(text, sourceLang, targetLang) {
  const srcDict = (keywordTranslations && keywordTranslations[sourceLang]) || {};
  const tgtDict = (keywordTranslations && keywordTranslations[targetLang]) || {};
  const pairs = [];

  for (const eng of Object.keys(srcDict)) {
    const from = srcDict[eng];
    const to = tgtDict[eng] || eng;
    if (from && from !== to) {
      pairs.push({ localized: from, replacement: to });
    }
  }
  pairs.sort((a, b) => b.localized.length - a.localized.length);

  const literalPattern = /("([^"\\]|\\.)*")|('([^'\\]|\\.)*')/g;
  let result = '';
  let lastIndex = 0;
  let m;

  while ((m = literalPattern.exec(text))) {
    const outside = text.slice(lastIndex, m.index);
    let translatedOutside = outside;
    for (const { localized, replacement } of pairs) {
      const escaped = localized.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const useWordBoundary = /^[A-Za-z0-9_]+$/.test(localized);
      const pattern = useWordBoundary ? '\\b' + escaped + '\\b' : escaped;
      const re = new RegExp(pattern, 'gi');
      translatedOutside = translatedOutside.replace(re, replacement);
    }
    result += translatedOutside;

    const literal = m[0];
    const quote = literal[0];
    let inner = literal.slice(1, -1);
    let translatedInner = inner;
    for (const { localized, replacement } of pairs) {
      const escaped = localized.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const useWordBoundary = /^[A-Za-z0-9_]+$/.test(localized);
      const pattern = useWordBoundary ? '\\b' + escaped + '\\b' : escaped;
      const re = new RegExp(pattern, 'gi');
      translatedInner = translatedInner.replace(re, replacement);
    }
    result += quote + translatedInner + quote;

    lastIndex = literalPattern.lastIndex;
  }

  const tail = text.slice(lastIndex);
  let translatedTail = tail;
  for (const { localized, replacement } of pairs) {
    const escaped = localized.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const useWordBoundary = /^[A-Za-z0-9_]+$/.test(localized);
    const pattern = useWordBoundary ? '\\b' + escaped + '\\b' : escaped;
    const re = new RegExp(pattern, 'gi');
    translatedTail = translatedTail.replace(re, replacement);
  }
  result += translatedTail;

  return result;
}

function translateEntireAddonBlock(sourceBlock, sourceLang, targetLang) {
  let t = sourceBlock;

  if (sourceLang === 'ja-JP') {
    t = t.replace(/^\s*ルール/, 'rule').replace(/ルール/, 'rule');
    t = t.replace(/イベント\s*\{/, 'event {');
    t = t.replace(/アクション\s*\{/, 'actions {');
  } else if (sourceLang === 'zh-CN') {
    t = t.replace(/^\s*规则/, 'rule').replace(/规则/, 'rule');
    t = t.replace(/事件\s*\{/, 'event {');
    t = t.replace(/动作\s*\{/, 'actions {');
  } else if (sourceLang === 'ko-KR') {
    t = t.replace(/^\s*rule/i, 'rule').replace(/rule/, 'rule');
    t = t.replace(/event\s*\{/i, 'event {');
    t = t.replace(/action\s*\{/i, 'actions {');
  } else if (sourceLang === 'ru-RU') {
    t = t.replace(/^\s*rule/i, 'rule').replace(/rule/, 'rule');
    t = t.replace(/event\s*\{/i, 'event {');
    t = t.replace(/actions\s*\{/i, 'actions {');
  } else if (sourceLang === 'es-MX') {
    t = t.replace(/^\s*regla/i, 'rule').replace(/regla/, 'rule');
    t = t.replace(/evento\s*\{/i, 'event {');
    t = t.replace(/acciones\s*\{/i, 'actions {');
  } else if (sourceLang === 'pt-BR') {
    t = t.replace(/^\s*regra/i, 'rule').replace(/regra/, 'rule');
    t = t.replace(/evento\s*\{/i, 'event {');
    t = t.replace(/ações\s*\{/i, 'actions {');
  } else if (sourceLang === 'de-DE') {
    t = t.replace(/^\s*regel/i, 'rule').replace(/regel/, 'rule');
    t = t.replace(/event\s*\{/i, 'event {');
    t = t.replace(/aktionen\s*\{/i, 'actions {');
  }

  t = translateFromTo(t, sourceLang, targetLang);
  t = translateIconNames(t, sourceLang, targetLang, iconTranslations);

  return t;
}

function translateIconNames(text, sourceLang, targetLang, iconsDict) {
  if (!iconsDict) return text;

  return text.replace(/Icon String\(\s*([^)]+)\s*\)/g, (match, iconKey) => {
    let foundInfo = null;
    for (const [iconName, translations] of Object.entries(iconsDict)) {
      if (translations[sourceLang] === iconKey) {
        foundInfo = translations;
        break;
      }
    }

    if (!foundInfo) {
      return match;
    }

    const translated = foundInfo[targetLang] || foundInfo['en-US'] || iconKey;
    return `Icon String(${translated})`;
  });
}

async function translationExists(jsonName) {
  try {
    const res = await fetch(`translations/${jsonName}`, { method: 'GET', cache: 'no-cache' });
    return res.ok;
  } catch (_) {
    return false;
  }
}

function extractBeginJsonBlock(tsText) {
  const marker = '//begin-json';
  const start = tsText.indexOf(marker);
  if (start < 0) return null;

  let i = tsText.indexOf('{', start);
  if (i < 0) return null;

  let depth = 0,
    inS = false,
    inD = false,
    inB = false,
    esc = false,
    j = i;
  for (; j < tsText.length; j++) {
    const ch = tsText[j];
    if (esc) {
      esc = false;
      continue;
    }
    if (ch === '\\') {
      esc = true;
      continue;
    }
    if (!inS && !inD && !inB) {
      if (ch === "'") inS = true;
      else if (ch === '"') inD = true;
      else if (ch === '`') inB = true;
      else if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) break;
      }
    } else {
      if (inS && ch === "'") inS = false;
      else if (inD && ch === '"') inD = false;
      else if (inB && ch === '`') inB = false;
    }
  }
  if (depth !== 0) return null;

  const jsonText = tsText.slice(i, j + 1);
  return jsonText;
}

async function saveTranslationFile(jsonName, jsonString) {
  try {
    const res = await fetch(`/api/compile?file=${encodeURIComponent('translations/' + jsonName)}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': CSRF,
      },
      body: JSON.stringify({ module: jsonString }),
    });
    return res.ok;
  } catch (_) {
    return false;
  }
}

async function fetchTsSource(tsName) {
  const url = TS_BASE + tsName;
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
  return await res.text();
}

function extractExportExpression(tsText) {
  const noComments = tsText.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^\:])\/\/.*$/gm, '$1');

  let startExpr = -1;

  const mDefault = noComments.match(/export\s+default\s*/);
  if (mDefault) {
    startExpr = mDefault.index + mDefault[0].length;
  } else {
    const mConst = noComments.match(/export\s+const\s+[A-Za-z0-9_$]+(?:\s*:\s*[^=;]+)?\s*=\s*/);
    if (!mConst) {
      throw new Error('Export introuvable');
    }
    startExpr = mConst.index + mConst[0].length;
  }

  while (/\s/.test(noComments[startExpr])) startExpr++;

  const open = noComments[startExpr];
  const pairs = { '{': '}', '[': ']' };
  const close = pairs[open];
  if (!close) throw new Error("Expression exportée inattendue (pas d'objet/array)");

  let i = startExpr,
    depth = 0,
    inS = false,
    inD = false,
    inB = false,
    esc = false;
  for (; i < noComments.length; i++) {
    const ch = noComments[i];
    if (esc) {
      esc = false;
      continue;
    }
    if (ch === '\\') {
      esc = true;
      continue;
    }
    if (!inS && !inD && !inB) {
      if (ch === "'") inS = true;
      else if (ch === '"') inD = true;
      else if (ch === '`') inB = true;
      else if (ch === open) depth++;
      else if (ch === close) {
        depth--;
        if (depth === 0) break;
      }
    } else {
      if (inS && ch === "'") inS = false;
      else if (inD && ch === '"') inD = false;
      else if (inB && ch === '`') inB = false;
    }
  }
  if (depth !== 0) throw new Error('Accolades non appariées');

  return noComments.slice(startExpr, i + 1).trim();
}

function evalExportExpressionToValue(expr) {
  const fn = new Function(`"use strict"; return (${expr});`);
  return fn();
}

async function compileTsToJson(tsName) {
  const tsText = await fetchTsSource(tsName);

  try {
    const expr = extractExportExpression(tsText);
    const value = evalExportExpressionToValue(expr);
    return JSON.stringify(value, null, 2) + '\n';
  } catch (e) {
    if (tsName === 'localizedStrings.ts' || tsText.includes('//begin-json')) {
      const raw = extractBeginJsonBlock(tsText);
      if (!raw) throw e;

      let obj;
      try {
        obj = JSON.parse(raw);
      } catch {
        const noTrailing = raw.replace(/,(\s*[}\]])/g, '$1');
        obj = JSON.parse(noTrailing);
      }
      return JSON.stringify(obj, null, 2) + '\n';
    }
    throw e;
  }
}

async function ensureTranslationsPresent() {
  const missing = [];
  for (const jsonName of TRANSLATION_FILES) {
    const ok = await translationExists(jsonName);
    if (!ok) missing.push(jsonName);
  }
  if (!missing.length) return;

  for (const jsonName of missing) {
    const tsName = jsonName.replace(/\.json$/i, '.ts');
    try {
      const jsonString = await compileTsToJson(tsName);
      const saved = await saveTranslationFile(jsonName, jsonString);
      if (!saved) {
        console.warn(
          `[translations] Échec écriture ${jsonName} ; le JSON a été compilé mais non sauvegardé.`
        );
      } else {
        console.debug(`[translations] ${jsonName} créé à partir de ${tsName}.`);
      }
    } catch (e) {
      console.error(`[translations] Échec compilation ${tsName} → ${jsonName}:`, e);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ensureTranslationsPresent().catch(console.error);
});

/* =========================
   HELPERS COPY & TOASTS
   ========================= */
async function copyToClipboard(text) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text ?? '');
      return true;
    } catch (_) {
    }
  }

  const ta = document.createElement('textarea');
  ta.value = text ?? '';
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.top = '-9999px';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);

  const sel = document.getSelection();
  const savedRange = sel && sel.rangeCount ? sel.getRangeAt(0) : null;

  ta.focus();
  ta.select();
  ta.setSelectionRange(0, ta.value.length);

  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch (_) {
    ok = false;
  }

  document.body.removeChild(ta);
  if (savedRange && sel) {
    sel.removeAllRanges();
    sel.addRange(savedRange);
  }
  return ok;
}

// ——— Toasts ———
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

/* =========================
   TAB SYSTEM
   ========================= */
function debug(data) {
  if (DEBUG_MODE) {
    console.debug('DEBUG: ' + data);
  }
}

function selectSection(id) {
  document.querySelectorAll('#mainTabs button').forEach((btn) => btn.classList.remove('active'));
  document.querySelectorAll('.convert-map-layout').forEach((sec) => {
    if (sec) {
      sec.style.display = 'none';
      sec.classList.remove('active');
    }
  });
  document.querySelectorAll('.content').forEach((c) => {
    if (c) c.style.display = 'none';
  });

  const section = document.getElementById(id);
  const button = document.getElementById(id + 'Btn');

  if (!section || !button) {
    console.warn('[selectSection] section/button introuvable:', { id, section, button });
    return;
  }
  section.style.display = 'block';
  section.classList.add('active');
  button.classList.add('active');
}

window.selectSection = (id) => {
  try {
    return selectSection(id);
  } catch (e) {
    console.error('[selectSection] failed:', e);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const bind = (btnId, sectionId) => {
    const btn = document.getElementById(btnId);
    if (btn) btn.addEventListener('click', () => selectSection(sectionId));
  };
  bind('convertMapBtn', 'convertMap');
  bind('helpBtn', 'help');
  bind('mapSettingsBtn', 'mapSettings');

  const defaultSection = document.getElementById('convertMap') ? 'convertMap' : null;
  if (defaultSection) selectSection(defaultSection);
});

function initMainTabs() {
  const btns = {
    convert: document.getElementById('convertMapBtn'),
    help: document.getElementById('helpBtn'),
    settings: document.getElementById('mapSettingsBtn'),
  };

  const panels = {
    convert: document.getElementById('convertMap'),
    help: document.getElementById('help'),
    settings: document.getElementById('mapSettings'),
  };

  const ACTIVE = ['bg-white', 'text-zinc-900'];
  const INACTIVE = ['text-zinc-900 dark:text-white', 'hover:bg-zinc-900/5 dark:bg-white/10'];

  Object.values(btns).forEach((b) => {
    b.classList.add('tab-btn', 'transition-colors', 'duration-300');
    b.classList.remove(...ACTIVE);
    if (!INACTIVE.every((c) => b.classList.contains(c))) b.classList.add(...INACTIVE);
  });

  function setActiveButton(key) {
    Object.entries(btns).forEach(([k, b]) => {
      if (k === key) {
        b.classList.add(...ACTIVE);
        b.classList.remove(...INACTIVE);
      } else {
        b.classList.remove(...ACTIVE);
        INACTIVE.forEach((c) => {
          if (!b.classList.contains(c)) b.classList.add(c);
        });
      }
    });
  }

  function showPanel(key) {
    Object.entries(panels).forEach(([k, p]) => {
      if (k === key) {
        p.classList.remove('hidden');
        p.classList.add('tab-panel-enter');
        void p.offsetWidth;
        p.classList.add('tab-panel-enter-active');
        p.addEventListener(
          'transitionend',
          () => {
            p.classList.remove('tab-panel-enter', 'tab-panel-enter-active');
          },
          { once: true }
        );
      } else {
        p.classList.add('hidden');
        p.classList.remove('tab-panel-enter', 'tab-panel-enter-active');
      }
    });
  }

  function switchTab(key) {
    setActiveButton(key);
    showPanel(key);
  }

  btns.convert.addEventListener('click', () => switchTab('convert'));
  btns.help.addEventListener('click', () => switchTab('help'));
  btns.settings.addEventListener('click', () => switchTab('settings'));

  switchTab('convert');
}

document.addEventListener('DOMContentLoaded', initMainTabs);

/* =========================
   DOTRANSLATE & DOCONVERT
   ========================= */
document.addEventListener('DOMContentLoaded', async () => {
  selectSection('convertMap');

  const btnConvert = document.getElementById('convert-btn');
  const btnTranslate = document.getElementById('translate-btn');
  const btnCopy = document.querySelector('.copy-btn');
  const textarea = document.querySelector('.mapdata');
  const langEl = document.getElementById('lang');
  const targetEl = document.getElementById('targetLang');

  btnConvert.addEventListener('click', () =>
    withBusy('convert', async () => {
    isEditMode = false;
    const editModeBtn = document.getElementById('editModeBtn');
    if (editModeBtn) editModeBtn.textContent = t('map_data.edit_mode');
    setCardEditInteractivity(false);

      const lang = langEl.value || 'en-US';
      const fullText = textarea.value;

      const resultTpl = await doConvert(fullText, lang);
      textarea.value = resultTpl;
      renderMapSettings(fullText);
      runIdle(() => checkForDiff?.());
    })
  );

  btnTranslate.addEventListener('click', () =>
    withBusy('translate', async () => {
    isEditMode = false;
    const editModeBtn = document.getElementById('editModeBtn');
    if (editModeBtn) editModeBtn.textContent = t('map_data.edit_mode');
    setCardEditInteractivity(false);

      const clientLang = langEl.value || 'en-US';
      const targetLang = targetEl.value || 'en-US';
      const fullText = textarea.value;

      const tpl = await doTranslate(fullText, clientLang, targetLang);
      textarea.value = tpl;
      renderMapSettings(fullText);
      runIdle(() => checkForDiff?.());
    })
  );

  btnCopy.addEventListener('click', async () => {
    const text = textarea?.value ?? '';
    const ok = await copyToClipboard(text);
    if (ok) showConfirmationMessage(t('common.copy_clipboard') || 'Copié dans le presse-papiers');
    else showErrorMessage(t('common.copy_clipboard_error') || 'Échec de la copie');
  });

  if (btnConvert) btnConvert.addEventListener('click', () => { setTimeout(addGlobalSettingsButton, 100); });
  if (btnTranslate) btnTranslate.addEventListener('click', () => { setTimeout(addGlobalSettingsButton, 100); });
});

/* =========================
   HELPERS
   ========================= */
function _stripMarkup(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\[[^\]]*?\]/g, (m) => m);
}
function _normalizeLabel(s) {
  return _stripMarkup(s)
    .replace(/\u00A0/g, ' ')
    .replace(/[“”„‟]/g, '"')
    .replace(/[’‘]/g, "'")
    .replace(/[：]/g, ':')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}
function _isLangKey(k) {
  return /^[a-z]{2}(?:-[A-Z]{2})?$/.test(k);
}

function _buildReverseKeywordIndex(unified, lang) {
  const src = (unified && unified[lang]) || {};
  const rev = new Map();
  for (const [engKey, localized] of Object.entries(src)) {
    if (typeof localized === 'string') rev.set(_normalizeLabel(localized), engKey);
  }
  return rev;
}

function stripPlaceholder(label) {
  return _normalizeLabel(
    String(label || '')
      .replace(/%1\$\s*s|%1\s*\$s|%1s|%1\$\w|%1\$\s*\w|%1\w|%1\$\s*|%1/g, '')
      .replace(/%1\$\s*?s|%1\s*?s|%1s/g, '')
  );
}
function detectTeamIndexFromKey(rawKey) {
  const m = /([12])/.exec(rawKey);
  return m ? m[1] : null;
}
function targetTeamName(idx, targetLang) {
  const kwT = (keywordTranslations && keywordTranslations[targetLang]) || {};
  const eng = idx === '2' ? 'Team 2' : 'Team 1';
  return kwT[eng] || eng;
}
function resolveValuesObjectFor(settingEntry) {
  if (!settingEntry) return null;
  const ref = settingEntry.values;
  if (!ref) return null;
  if (typeof ref === 'object') return ref;
  const cg = (allTranslations && allTranslations.customGameSettings) || {};
  const vals =
    cg[ref] || (allTranslations && allTranslations.values && allTranslations.values[ref]);
  return vals || null;
}
function findValueIdByAnyLang(valuesObj, rawVal) {
  if (!valuesObj) return null;
  const normRaw = _normalizeLabel(rawVal);
  for (const [valId, entry] of Object.entries(valuesObj)) {
    for (const [lang, label] of Object.entries(entry || {})) {
      if (_isLangKey(lang) && typeof label === 'string') {
        if (_normalizeLabel(label) === normRaw) return valId;
      }
    }
  }
  return null;
}

function resolveValuesObjectFor_CGOnly(settingEntry, cgRoot) {
  if (!settingEntry) return null;
  const ref = settingEntry.values;
  if (!ref) return null;
  if (typeof ref === 'object') return ref;
  if (typeof ref === 'string') return cgRoot[ref] || null;
  return null;
}

function _indexCustomGameSettings_CGOnly(cg) {
  const settingByLabel = new Map();
  const valuesBySetting = new Map();
  const entryById = new Map();

  function visit(node, idHint = null) {
    if (!node || typeof node !== 'object') return;

    const langKeys = Object.keys(node).filter(_isLangKey);
    const hasLabels = langKeys.length > 0;

    if (hasLabels && idHint) {
      for (const lang of langKeys) {
        const label = node[lang];
        if (typeof label === 'string') {
          settingByLabel.set(_normalizeLabel(label), idHint);
        }
      }
      entryById.set(idHint, node);

      const valuesObj = resolveValuesObjectFor_CGOnly(node, cg);
      if (valuesObj && typeof valuesObj === 'object') {
        const m = new Map();
        for (const [valId, valEntry] of Object.entries(valuesObj)) {
          if (!valEntry || typeof valEntry !== 'object') continue;
          for (const [lang, label] of Object.entries(valEntry)) {
            if (_isLangKey(lang) && typeof label === 'string') {
              m.set(_normalizeLabel(label), valId);
            }
          }
        }
        valuesBySetting.set(idHint, m);
      }
    }

    if (node && node.values && typeof node.values === 'object') {
      for (const [k, v] of Object.entries(node.values)) {
        if (v && typeof v === 'object') visit(v, k);
      }
    }
    for (const [k, v] of Object.entries(node)) {
      if (k === 'values' || k === 'guid') continue;
      if (v && typeof v === 'object' && !Array.isArray(v)) visit(v, null);
    }
  }

  visit(cg, null);
  return { settingByLabel, valuesBySetting, entryById };
}

function teamNameFromOther(idx, lang) {
  const other = (allTranslations && allTranslations.other) || {};
  const key = idx === '2' ? 'Team 2' : 'Team 1';
  const entry = other[key];
  return (entry && (entry[lang] || entry['en-US'])) || key;
}

function detectTeamIdxUsingCgAndOther(rawKey, sourceLang, cg) {
  const norm = (s) => _normalizeLabel(s || '');

  const t1Label = cg.team1Slots && (cg.team1Slots[sourceLang] || cg.team1Slots['en-US']);
  const t2Label = cg.team2Slots && (cg.team2Slots[sourceLang] || cg.team2Slots['en-US']);

  const sTeam1 = teamNameFromOther('1', sourceLang);
  const sTeam2 = teamNameFromOther('2', sourceLang);

  const concretize = (tmpl, teamName) =>
    typeof tmpl === 'string' ? tmpl.replace(/%1\s*\$?s/gi, teamName) : null;

  const t1Concrete = concretize(t1Label, sTeam1);
  const t2Concrete = concretize(t2Label, sTeam2);

  const keyN = norm(rawKey);
  if (t1Concrete && norm(t1Concrete) === keyN) return '1';
  if (t2Concrete && norm(t2Concrete) === keyN) return '2';

  const keyNoParam = stripPlaceholder(rawKey);
  const t1Base = t1Label ? stripPlaceholder(t1Label) : null;
  const t2Base = t2Label ? stripPlaceholder(t2Label) : null;
  if (t1Base && norm(keyNoParam).startsWith(norm(t1Base))) return '1';
  if (t2Base && norm(keyNoParam).startsWith(norm(t2Base))) return '2';

  const m = /(^|\D)([12])(\D|$)/.exec(rawKey);
  return m ? m[2] : null;
}

const __otherRevCache = Object.create(null);

function _revOtherLabels(lang) {
  if (__otherRevCache[lang]) return __otherRevCache[lang];
  const other = (allTranslations && allTranslations.other) || {};
  const rev = new Map();
  const isLangKey = (k) => /^[a-z]{2}(?:-[A-Z]{2})?$/.test(k);

  for (const [key, entry] of Object.entries(other)) {
    if (!entry || typeof entry !== 'object') continue;
    for (const [l, lbl] of Object.entries(entry)) {
      if (!isLangKey(l) || typeof lbl !== 'string') continue;
      const norm = _normalizeLabel(lbl);
      if (!rev.has(norm)) rev.set(norm, new Set());
      rev.get(norm).add(key);
    }
  }
  __otherRevCache[lang] = rev;
  return rev;
}

function _isEnableContext(rawKey) {
  const s = _normalizeLabel(rawKey);
  return (
    /(enable|enabled|activation|toggle|display|mode|editor|portals|hud)/i.test(s) || // EN
    /(启用|开启|打开|开关)/.test(s) || // ZH
    /(有効|オン|切替)/.test(s) || // JA
    /(활성|켜기|토글|사용)/.test(s) || // KO
    /(activad|habilitad|encendid)/i.test(s) || // ES
    /(ativad|ligad)/i.test(s) || // PT
    /(aktivier|einschalt)/i.test(s) // DE
  );
}

function _disambiguateOtherKey(candidates, rawKey) {
  const enableCtx = _isEnableContext(rawKey);
  const prefEnable = ['__on__', '__off__', '__yes__', '__no__'];
  const prefGeneric = ['__yes__', '__no__', '__on__', '__off__'];
  const order = enableCtx ? prefEnable : prefGeneric;

  for (const k of order) if (candidates.has(k)) return k;
  for (const k of candidates) return k;
  return null;
}

function translateValueUsingOther(rawValue, rawKey, sourceLang, targetLang) {
  if (!rawValue) return null;

  const rev = _revOtherLabels(sourceLang);
  const cand = rev.get(_normalizeLabel(rawValue));
  if (!cand || !cand.size) return null;

  const key = _disambiguateOtherKey(cand, rawKey);
  if (!key) return null;

  const other = (allTranslations && allTranslations.other) || {};
  const entry = other[key];
  if (!entry) return null;

  return entry[targetLang] || entry['en-US'] || null;
}

/* =========================
   CACHE & OVERPY
   ========================= */
function getCacheURL(lang) {
  return new URL(`../framework-templates/framework-template_${lang}.js`, import.meta.url).href;
}

async function cacheExists(lang) {
  const cacheUrl = getCacheURL(lang);
  try {
    const res = await fetch(cacheUrl, { method: 'GET' });
    debug(`cacheExists (${lang}): HTTP ${res.status}`);
    return res.ok;
  } catch (e) {
    debug(`cacheExists error (${lang}): ` + e.message);
    return false;
  }
}

async function inlineIncludes(src, baseHref) {
  const re = /^[ \t]*#!include\s+"([^"]+)"[ \t]*;?[^\n]*$/gm;

  let out = '',
    last = 0,
    m;
  while ((m = re.exec(src))) {
    out += src.slice(last, m.index);

    const relPath = m[1].trim();
    const fileUrl = new URL(relPath, baseHref);
    const childDir = fileUrl.href.replace(/[^/]+$/, '');

    debug(`Including ${relPath} → ${fileUrl.href}`);
    const r = await fetch(fileUrl.href);
    if (!r.ok) throw new Error(`HTTP ${r.status} fetching ${relPath}`);

    const txt = await r.text();
    const expanded = await inlineIncludes(txt, childDir);

    out += expanded;
    last = re.lastIndex;
  }

  return out + src.slice(last);
}

function normalizeNewlines(s) {
  return s.replace(/\r\n?/g, '\n');
}

function cleanSourceG(src) {
  src = normalizeNewlines(src);

  return src
    .replace(/^[ \t]*#!define\s+editortoggle[^\n]*\n?/gm, '')
    .replace(/^[ \t]*editortoggle\([^\n]*\)\s*\n?/gm, '')
    .replace(/^[ \t]*__script__\([^)]+\)[ \t]*;?[ \t]*\n/gm, '')
    .replace(/\beditoron\b/g, 'false');
}

function addMapPolyfills(src) {
  const polyfills =
    [
      '#!define skirmishMap []',
      '#!define tdmMap []',
      '#!define controlMap []',
      '#!define escortMap []',
      '#!define hybridMap []',
      '#!define pushMap []',
      '#!define flashpointMap []',
    ].join('\n') + '\n';
  return polyfills + src.replace(/\r\n?/g, '\n');
}

function findFirstBraceUnderflow(src) {
  const lines = normalizeNewlines(src).split('\n');
  let paren = 0, brace = 0;
  const strip = (s) =>
    s
      .replace(/\/\/.*$/, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/"([^"\\]|\\.)*"/g, '""')
      .replace(/'([^'\\]|\\.)*'/g, "''");
  for (let i = 0; i < lines.length; i++) {
    const s = strip(lines[i]);
    for (const ch of s) {
      if (ch === '(') paren++;
      else if (ch === ')') paren--;
      else if (ch === '{') brace++;
      else if (ch === '}') brace--;
      if (paren < 0 || brace < 0) return { line: i + 1, raw: lines[i] };
    }
  }
  return null;
}

function patchTestDataStub(src) {
  const hasDefine = /^[ \t]*#!define\s+testData\b/m.test(src);
  if (hasDefine) return src;
  return src.replace(/^[ \t]*testData[ \t]*$/m, 'rule "TestData (stub)":\n    return');
}

function patchEditorDefaultOn(src) {
  const hasDefine = /^[ \t]*#!define\s+editorDefaultOn\b/m.test(src);
  if (hasDefine) return src;
  const usesCallSyntax = /\beditorDefaultOn\s*\(/.test(src);
  const def = usesCallSyntax ? '#!define editorDefaultOn() false\n' : '#!define editorDefaultOn false\n';
  return def + src;
}

function expandImportHeroToInclude(src) {
  src = normalizeNewlines(src);
  src = src.replace(
    /^[ \t]*#!define\s+importHero\s*\(\s*Hero\s*\)\s*__script__\([^)]+\)[^\n]*\n?/im,
    ''
  );
  src = src.replace(/^[ \t]*importHero\s*\(([\s\S]*?)\)\s*$/gim, (full, arg) => {
    const m = /"(GENJI|HANZO|KIRIKO|HAZARD)"/i.exec(arg);
    if (!m) { debug(`[compile] importHero: héros introuvable dans: ${arg}`); return ''; }
    const heroKey = m[1].toUpperCase();
    const file = HERO_FILE_MAP[heroKey];
    if (!file) { debug(`[compile] importHero: mapping manquant pour ${heroKey}`); return ''; }
    debug(`[compile] importHero → #!include "${file}"`);
    return `#!include "${file}"`;
  });
  return src;
}

async function loadTemplate(lang) {
  const cacheUrl = `/framework-templates/framework-template_${lang}.js`;
  try {
    const probe = await fetch(cacheUrl, { method: 'GET', cache: 'no-cache' });
    if (probe.ok) {
      debug(`Loading from cache for ${lang} [${cacheUrl}]`);
      try {
        const mod = await import(/* @vite-ignore */ `${cacheUrl}?v=${Date.now()}`);
        if (mod && typeof mod.frameworkTemplate === 'string') { return mod.frameworkTemplate; }
        else { console.warn(`[loadTemplate] Module présent mais export "frameworkTemplate" manquant. Recompilation…`); }
      } catch (e) { console.warn(`[loadTemplate] Échec de l'import dynamique du cache. Recompilation…`, e); }
    } else { debug(`Cache miss (${probe.status}) pour ${lang} → compilation.`); }
  } catch (e) { console.debug(`[loadTemplate] Probe cacheUrl échouée, on compile :`, e); }

  debug(`Compiling new template for ${lang} (worker)`);
  let tpl;
  try {
    tpl = await runTplWorker('compile', { lang });
  } catch (e) {
    console.warn('[loadTemplate] Worker compile failed, fallback in main thread:', e);
    const overpy = window.window || window.OverPy || window.Overpy;
    if (!overpy) throw new Error('OverPy UMD not found (fallback)');
    await overpy.readyPromise;

    const rawBase = 'https://cdn.jsdelivr.net/gh/tylovejoy/genji-framework@1.10.4D/';
    const entryFile = 'framework.opy';
    const resp = await fetch(rawBase + entryFile);
    if (!resp.ok) throw new Error(`HTTP ${resp.status} on ${entryFile}`);
    let src = await resp.text();

    src = expandImportHeroToInclude(src);
    src = await inlineIncludes(src, rawBase);
    src = cleanSourceG(src);
    src = patchTestDataStub(src);
    src = addMapPolyfills(src);
    src = patchEditorDefaultOn(src);
    if (lang === 'zh-CN') {
      src = src.replace(/^[ \t]*#!define\s+enableInvisCommand[^\n]*\n?/gm, '');
      src = '#!define enableInvisCommand false\n' + src;
    }
    const { result } = await overpy.compile(src, lang, rawBase, entryFile);
    tpl = result;
  }

  const esc = tpl.replace(/\\/g, '\\\\').replace(/`/g, '\\`');
  const moduleText = `// framework-template_${lang}.js (auto)\nexport const frameworkTemplate = \`${esc}\n\`;\n`;

  try {
    const xsrfFromCookie = document.cookie.split('; ').find((c) => c.startsWith('XSRF-TOKEN='))?.split('=')[1];
    const saveRes = await fetch(`/api/compile?file=framework-templates/framework-template_${lang}.js`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(CSRF ? { 'X-CSRF-TOKEN': CSRF } : {}),
        ...(xsrfFromCookie ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfFromCookie) } : {}),
      },
      body: JSON.stringify({ module: moduleText }),
    });

    if (!saveRes.ok) {
      console.warn("[loadTemplate] Échec d'écriture du cache:", saveRes.status, await saveRes.text().catch(() => ''));
    } else {
      debug(`Cache saved as framework-template_${lang}.js`);
    }
  } catch (e) {
    console.warn('[loadTemplate] Erreur lors de la sauvegarde du cache :', e);
  }

  return tpl;
}

/* =========================
   LOBBY BLOCK
   ========================= */
function translateLobbyBlock(lobbyText, sourceLang, targetLang) {
  if (!lobbyText) return '';

  const cg = (allTranslations && allTranslations.customGameSettings) || {};
  const { settingByLabel, valuesBySetting, entryById } = _indexCustomGameSettings_CGOnly(cg);

  const lines = lobbyText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const keyValRe = /^(.+?)\s*[:：]\s*(.+)$/;

  return lines
    .map((line) => {
      const m = line.match(keyValRe);
      if (!m) return line;

      const rawKey = m[1].trim();
      const rawValue = m[2].trim();

      const normKey = _normalizeLabel(rawKey);

      let settingId = settingByLabel.get(normKey) || null;
      let teamIdx = null;

      if (!settingId) {
        teamIdx = detectTeamIdxUsingCgAndOther(rawKey, sourceLang, cg);
        if (teamIdx === '1') settingId = 'team1Slots';
        else if (teamIdx === '2') settingId = 'team2Slots';
      }

      let newKey = rawKey;
      if (settingId) {
        const entry = entryById.get(settingId);
        if (entry) {
          newKey = entry[targetLang] || entry['en-US'] || rawKey;

          if (/%1\s*\$?s/i.test(newKey)) {
            if (!teamIdx) teamIdx = detectTeamIdxUsingCgAndOther(rawKey, sourceLang, cg) || '1';
            const teamNameTgt = teamNameFromOther(teamIdx, targetLang);
            newKey = newKey.replace(/%1\s*\$?s/gi, teamNameTgt);
          }
        }
      }

      let newValue = rawValue;
      let translatedViaCG = false;

      if (settingId) {
        const entry = entryById.get(settingId);
        if (entry) {
          const vmap = valuesBySetting.get(settingId);
          let valId = vmap ? vmap.get(_normalizeLabel(rawValue)) : null;

          const valuesObj = resolveValuesObjectFor_CGOnly(entry, cg);
          if (!valId && valuesObj) {
            valId = findValueIdByAnyLang(valuesObj, rawValue);
          }

          if (valId && valuesObj && valuesObj[valId]) {
            newValue = valuesObj[valId][targetLang] || valuesObj[valId]['en-US'] || rawValue;
            translatedViaCG = true;
          }
        }
      }

      if (!translatedViaCG) {
        const viaOther = translateValueUsingOther(rawValue, rawKey, sourceLang, targetLang);
        if (viaOther) newValue = viaOther;
      }

      return `${newKey}: ${newValue}`;
    })
    .join('\n');
}

function extractLobbyBlock(fullText, lang) {
  let keyword;
  switch (lang) {
    case 'es-MX': keyword = 'sala de espera'; break;
    case 'de-DE': keyword = 'Lobby'; break;
    case 'ja-JP': keyword = 'ロビー'; break;
    case 'ko-KR': keyword = 'lobby'; break;
    case 'ru-RU': keyword = 'lobby'; break;
    case 'zh-CN': keyword = '大厅'; break;
    case 'pt-BR': keyword = 'lobby'; break;
    default: keyword = 'lobby';
  }
  const regexHeader = new RegExp(`^\\s*${keyword}\\s*\\{`, 'im');
  const matchHeader = fullText.match(regexHeader);
  if (!matchHeader) return '';
  const startIdx = fullText.indexOf('{', matchHeader.index);
  if (startIdx < 0) return '';
  let level = 1, i = startIdx + 1;
  for (; i < fullText.length; i++) { if (fullText[i] === '{') level++; else if (fullText[i] === '}') { level--; if (level === 0) break; } }
  if (level !== 0) return '';
  const inside = fullText.slice(startIdx + 1, i);
  return inside.trim();
}

function insertLobbyIntoTemplate(tpl, lobbyContent, lang = getActiveOutputLang()) { /* … même logique que ta version … */ 
  if (!lobbyContent) return tpl;
  let keyword;
  switch (lang) {
    case 'es-MX': keyword = 'sala de espera'; break;
    case 'de-DE': keyword = 'Lobby'; break;
    case 'ja-JP': keyword = 'ロビー'; break;
    case 'ko-KR': keyword = 'lobby'; break;
    case 'ru-RU': keyword = 'lobby'; break;
    case 'zh-CN': keyword = '大厅'; break;
    case 'pt-BR': keyword = 'lobby'; break;
    default: keyword = 'lobby';
  }
  const regexHeader = new RegExp(`^\\s*${keyword}\\s*\\{`, 'm');
  const m = tpl.match(regexHeader);
  if (!m) return tpl;
  const startBrIdx = tpl.indexOf('{', m.index);
  if (startBrIdx < 0) return tpl;
  let level = 1, i = startBrIdx + 1;
  for (; i < tpl.length; i++) { if (tpl[i] === '{') level++; else if (tpl[i] === '}') { level--; if (level === 0) break; } }
  if (level !== 0) return tpl;
  const endBrIdx = i;
  const lines = lobbyContent.split('\n');
  const indent = '    ';
  const indented = lines.map((l) => indent + l).join('\n');
  return tpl.slice(0, startBrIdx + 1) + '\n' + indented + '\n' + tpl.slice(endBrIdx);
}

function sanitizeMapDataAssignments(text) {
  if (!text) return text;
  const reSetGlobalVar = new RegExp(
    String.raw`^[ \t]*Set\s+Global\s+Variable\s*\(\s*(?:DashExploitToggle|HudStoreEdit)\s*,[\s\S]*?\)\s*;?[ \t]*\r?\n?`,
    'gmi'
  );
  text = text.replace(reSetGlobalVar, '');
  const reDotAssign = new RegExp(
    String.raw`^[ \t]*(?:Global|全局|グローバル)\.(?:DashExploitToggle|HudStoreEdit)\s*=\s*[^\r\n;]+;?[ \t]*\r?\n?`,
    'gmi'
  );
  text = text.replace(reDotAssign, '');
  return text;
}

/* =========================
   MAP DATA BLOCK
   ========================= */
function buildRule(mapdata, lang) {
  const title = firstMarker('mapData');
  const body = (mapdata || '')
    .trim()
    .split('\n')
    .map((l) => '    ' + l)
    .join('\n');
  const header = buildRuleHeader(title, lang);
  return wrapRuleBody(header, '', body, lang);
}

function extractActionsFromRuleByMarkers(fullText, listName = 'mapData', lang = getActiveOutputLang()) {
  const titles = getMarkers(listName);
  for (const title of titles) {
    const r = findRuleByTitle(fullText, title, lang, { allowDisabled: true });
    if (!r) continue;

    const body = fullText.slice(r.openIdx + 1, r.closeIdx);
    const wActions = getWord('actions', lang);
    const mAct = body.match(new RegExp(`${wActions}\\s*\\{`, 'i'));
    if (!mAct) continue;

    const actOpen = body.indexOf('{', mAct.index);
    let depth = 1, j = actOpen + 1;
    for (; j < body.length; j++) {
      const ch = body[j];
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) break; }
    }
    if (depth !== 0) continue;

    return body.slice(actOpen + 1, j).trim();
  }
  return '';
}

function replaceRuleByMarkers(tpl, listName, newRule, lang = getActiveOutputLang()) {
  const titles = getMarkers(listName);
  const startRuleWord = getWord('rule', lang);
  let out = tpl;

  for (const t of titles) {
    const loc = findRuleByTitle(out, t, lang, { allowDisabled: true });
    if (!loc) continue;
    const headStart = Math.max(0, out.lastIndexOf('\n', loc.startHeaderIdx) + 1);
    out = out.slice(0, headStart) + newRule + out.slice(loc.closeIdx + 1);
    return out;
  }

  console.warn(`[replaceRuleByMarkers] aucun marker trouvé pour "${listName}", texte conservé.`);
  return out;
}

function replaceMapData(tpl, newRule, lang = getActiveOutputLang()) {
  return replaceRuleByMarkers(tpl, 'mapData', newRule, lang);
}

function extractMapDataBlock(fullText, lang) {
  return extractActionsFromRuleByMarkers(fullText, 'mapData', lang);
}

function parseGlobalACheckpoints(fullText) {
  const checkpoints = [];
  const teleportMap = {};

  const regexGlobalA = /(?:(?:Global|全局|グローバル)\.A\s*=\s*(?:Array|Matriz|数组|配列)\s*\(|设置全局变量\s*\(\s*A\s*,\s*(?:Array|Matriz|数组|配列)\s*\()/;

  const matchGA = fullText.match(regexGlobalA);
  if (!matchGA) {
    return { checkpoints, teleportMap };
  }

  let level = 1;
  let i = matchGA.index + matchGA[0].length;
  for (; i < fullText.length; i++) {
    const ch = fullText[i];
    if (ch === '(') level++;
    else if (ch === ')') {
      level--;
      if (level === 0) break;
    }
  }
  const inside = fullText.slice(matchGA.index + matchGA[0].length, i);

  const elements = [];
  let current = '';
  let depth = 0;
  for (const c of inside) {
    if (c === '(') {
      depth++;
      current += c;
    } else if (c === ')') {
      depth--;
      current += c;
    } else if (c === ',' && depth === 0) {
      elements.push(current.trim());
      current = '';
    } else {
      current += c;
    }
  }
  if (current.trim()) elements.push(current.trim());

  const vectorRegex =
    /^(?:Vector|矢量|ベクトル|Vetor)\s*\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)$/;
  const tpRegex = new RegExp(
    `^(?:Array|Matriz|数组|配列)\\s*\\(\\s*` +
      `(Vector\\([^)]*\\))` +
      `\\s*,\\s*` +
      `(Vector\\([^)]*\\))` +
      `\\s*\\)$`
  );

  elements.forEach((elem) => {
    let m = elem.match(vectorRegex);
    if (m) {
      checkpoints.push({
        x: parseFloat(m[1]),
        y: parseFloat(m[2]),
        z: parseFloat(m[3]),
      });
      return;
    }

    const mt = elem.match(tpRegex);
    if (mt) {
      const parseV = (vStr) => {
        const mm = vStr.match(vectorRegex);
        return {
          x: parseFloat(mm[1]),
          y: parseFloat(mm[2]),
          z: parseFloat(mm[3]),
        };
      };
      const start = parseV(mt[1]);
      const end = parseV(mt[2]);
      const idx = checkpoints.length;

      checkpoints.push(start);
      teleportMap[idx] = { start, end };
      return;
    }
  });

  return { checkpoints, teleportMap };
}

function buildGlobalArrayRegex(varName) {
  const name = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const patterns = [
    `(?:Global|全局|グローバル)\\.${name}\\s*=\\s*(?:Array|Matriz|数组|配列)\\s*\\(`,
    `设置全局变量\\s*\\(\\s*${name}\\s*,\\s*(?:Array|Matriz|数组|配列)\\s*\\(`
  ];

  return new RegExp(patterns.join('|'));
}

function buildGlobalEmptyArrayRegex(varName) {
  const name = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`设置全局变量\\s*\\(\\s*${name}\\s*,\\s*空数组\\s*\\)`);
}

function parseGlobalArrayNumbers(fullText, varName) {
  const regex = buildGlobalArrayRegex(varName);
  const match = fullText.match(regex);

  if (!match) {
    const emptyRegex = buildGlobalEmptyArrayRegex(varName);
    if (emptyRegex.test(fullText)) {
      return [];
    }
    return [];
  }

  const startIdx = match.index + match[0].length;
  let level = 1;
  let i = startIdx;
  for (; i < fullText.length; i++) {
    const ch = fullText[i];
    if (ch === '(') level++;
    else if (ch === ')') {
      level--;
      if (level === 0) break;
    }
  }
  if (level !== 0) return [];
  const endIdx = i;

  const inside = fullText.slice(startIdx, endIdx);
  return inside
    .split(',')
    .map((s) => parseFloat(s.trim()))
    .filter((n) => !isNaN(n));
}

function parseGlobalArrayVectors(fullText, varName) {
  const results = [];
  const regex = buildGlobalArrayRegex(varName);
  const match = fullText.match(regex);
  if (!match) {
    const emptyRegex = buildGlobalEmptyArrayRegex(varName);
    if (emptyRegex.test(fullText)) return results;
    return results;
  }

  const startIdx = match.index + match[0].length;
  let level = 1;
  let i = startIdx;
  for (; i < fullText.length; i++) {
    const ch = fullText[i];
    if (ch === '(') level++;
    else if (ch === ')') {
      level--;
      if (level === 0) break;
    }
  }
  if (level !== 0) return results;
  const endIdx = i;

  const inside = fullText.slice(startIdx, endIdx);
  const regexVector =
    /(?:Vector|矢量|ベクトル|Vetor)\s*\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/g;

  let m;
  while ((m = regexVector.exec(inside)) !== null) {
    const x = parseFloat(m[1]);
    const y = parseFloat(m[2]);
    const z = parseFloat(m[3]);
    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
      results.push({ x, y, z });
    }
  }
  return results;
}

function parseGlobalArrayBooleans(fullText, varName) {
  const results = [];
  const regex = buildGlobalArrayRegex(varName);
  const match = fullText.match(regex);
  if (!match) {
    const emptyRegex = buildGlobalEmptyArrayRegex(varName);
    if (emptyRegex.test(fullText)) return results;
    return results;
  }

  const startIdx = match.index + match[0].length;
  let level = 1;
  let i = startIdx;
  for (; i < fullText.length; i++) {
    const ch = fullText[i];
    if (ch === '(') level++;
    else if (ch === ')') {
      level--;
      if (level === 0) break;
    }
  }
  if (level !== 0) return results;
  const endIdx = i;

  const inside = fullText.slice(startIdx, endIdx);
  inside.split(',').forEach((token) => {
    const t = token.trim();
    const lower = t.toLowerCase();
    if (lower === 'true' || lower === '真') results.push(true);
    else if (lower === 'false' || lower === '假') results.push(false);
    else if (lower === 'verdadeiro') results.push(true);
    else if (lower === 'falso') results.push(false);
  });
  return results;
}

/* =========================
   DIFFICULTY BLOCK HELPERS
   ========================= */
function logDiff(...args) {
  //try { console.log("[DIFF]", ...args); } catch (_) {}
}

function sliceAround(str, pos, radius = 120) {
  const start = Math.max(0, pos - radius);
  const end = Math.min(str.length, pos + radius);
  return str.slice(start, end);
}

function normalizeSpaces(s) {
  return String(s)
    .replace(/\uFEFF/g, '')
    .replace(/[\u200B\u200C\u200D]/g, '')
    .replace(/[\u00A0\u2007\u202F\u2000-\u200A]/g, ' ');
}
function normalizeBrackets(s) {
  return String(s)
    .replace(/[\uFF3B\u3010\u3016\u3014\u27E6\u2983\u2985\u301A]/g, '[')
    .replace(/[\uFF3D\u3011\u3017\u3015\u27E7\u2984\u2986\u301B]/g, ']');
}
function normalizeDigits(s) {
  return String(s).replace(/[\uFF10-\uFF19\u0660-\u0669\u06F0-\u06F9]/g, (ch) => {
    const cp = ch.codePointAt(0);
    if (cp >= 0xff10 && cp <= 0xff19) return String(cp - 0xff10);
    if (cp >= 0x0660 && cp <= 0x0669) return String(cp - 0x0660);
    if (cp >= 0x06f0 && cp <= 0x06f9) return String(cp - 0x06f0);
    return ch;
  });
}
function normalizeLine(s) {
  return normalizeDigits(normalizeBrackets(normalizeSpaces(s)));
}

/* =========================
   DIFFICULTY BLOCK
   ========================= */
function findMatchingParen(text, openIdx) {
  let depth = 1,
    inQ = false;
  for (let i = openIdx + 1; i < text.length; i++) {
    const ch = text[i],
      prev = text[i - 1];
    if (ch === '"' && prev !== '\\') {
      inQ = !inQ;
      continue;
    }
    if (inQ) continue;
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}
function findMatchingBrace(text, openIdx) {
  let depth = 1,
    inQ = false;
  for (let i = openIdx + 1; i < text.length; i++) {
    const ch = text[i],
      prev = text[i - 1];
    if (ch === '"' && prev !== '\\') {
      inQ = !inQ;
      continue;
    }
    if (inQ) continue;
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}
function splitTopLevelArgs(argListStr) {
  const args = [];
  let cur = '',
    p = 0,
    b = 0,
    q = false;
  for (let k = 0; k < argListStr.length; k++) {
    const ch = argListStr[k],
      prev = argListStr[k - 1];
    if (ch === '"' && prev !== '\\') q = !q;
    if (!q) {
      if (ch === '(') p++;
      else if (ch === ')') p--;
      else if (ch === '[') b++;
      else if (ch === ']') b--;
      if (ch === ',' && p === 0 && b === 0) {
        args.push(cur.trim());
        cur = '';
        continue;
      }
    }
    cur += ch;
  }
  if (cur.trim()) args.push(cur.trim());
  return args;
}

function isHudLine(lineNorm) {
  const en = /difficulty\s*display\s*hud/i.test(lineNorm);
  const zh = /难度/.test(lineNorm) && /顶部/.test(lineNorm) && /hud/i.test(lineNorm);
  return en || zh;
}

function extractIndexFromHudLine(rawLine) {
  if (!rawLine) return null;

  const lineNorm = normalizeLine(rawLine);
  if (!isHudLine(lineNorm)) return null;

  let m;
  const reBr = /\[\s*([0-9]+)\s*\]/g;
  let last = null;
  while ((m = reBr.exec(lineNorm))) last = m[1];
  if (last !== null) {
    const v = parseInt(last, 10);
    if (Number.isFinite(v)) return v;
  }

  m = /:\s*([0-9]+)\b/.exec(lineNorm);
  if (m) {
    const v = parseInt(m[1], 10);
    if (Number.isFinite(v)) return v;
  }

  try {
    const cps = Array.from(rawLine).map((c) => c.codePointAt(0).toString(16));
    logDiff('extractIndexFromHudLine: candidate non parsée (raw) =', rawLine);
    logDiff('extractIndexFromHudLine: codepoints =', cps.join(' '));
    logDiff('extractIndexFromHudLine: normalisé =', lineNorm);
  } catch (_e) {}
  return null;
}

function extractWorkshopHudIndex(fullText) {
  const mKey = /(?:\bworkshop\b|地图工坊|ワークショップ)/i.exec(fullText);
  if (!mKey) {
    logDiff('workshop: mot-clé introuvable');
    return null;
  }

  const afterKeyPos = mKey.index + mKey[0].length;
  const openBrace = fullText.indexOf('{', afterKeyPos);
  if (openBrace < 0) {
    logDiff("workshop: '{' introuvable après mot-clé");
    return null;
  }

  const closeBrace = findMatchingBrace(fullText, openBrace);
  if (closeBrace < 0) {
    logDiff("workshop: '}' appariée introuvable");
    return null;
  }

  const body = fullText.slice(openBrace + 1, closeBrace);
  const lines = body.split(/\r?\n/);

  for (const rawLine of lines) {
    const v = extractIndexFromHudLine(rawLine);
    if (v !== null) {
      logDiff('extractWorkshopHudIndex: ligne HUD capturée (raw) =', rawLine);
      logDiff('extractWorkshopHudIndex: valeur =', v);
      return v;
    }
  }

  logDiff('extractWorkshopHudIndex: pas de ligne HUD trouvée dans workshop. Extrait:\n' + body);
  return null;
}

function extractWorkshopHudIndexLoose(fullText) {
  const lines = fullText.split(/\r?\n/);
  for (const rawLine of lines) {
    const v = extractIndexFromHudLine(rawLine);
    if (v !== null) {
      logDiff('extractWorkshopHudIndexLoose: ligne HUD capturée (raw) =', rawLine);
      logDiff('extractWorkshopHudIndexLoose: valeur =', v);
      return v;
    }
  }
  logDiff('extractWorkshopHudIndexLoose: aucune ligne HUD trouvée dans tout le texte');
  return null;
}

function extractIndexFromGlobalArray(fullText) {
  const re = new RegExp(
    `${KW_GLOBAL}\\.Difficultyhud\\s*=\\s*${KW_ARRAY}\\s*\\(\\s*${KW_COMBO}\\s*\\(`,
    'i'
  );
  const m = re.exec(fullText);
  if (!m) {
    logDiff('extractIndexFromGlobalArray: non trouvé');
    return null;
  }

  const comboOpen = m.index + m[0].lastIndexOf('(');
  const comboClose = findMatchingParen(fullText, comboOpen);
  if (comboClose < 0) {
    logDiff('extractIndexFromGlobalArray: parenthèses non appariées');
    return null;
  }

  const inside = fullText.slice(comboOpen + 1, comboClose);
  const args = splitTopLevelArgs(inside);

  const raw = String(args[2] || '').trim();
  const idx = parseInt(raw, 10);
  if (Number.isFinite(idx)) {
    logDiff('extractIndexFromGlobalArray: trouvé =', idx);
    return idx;
  }
  logDiff('extractIndexFromGlobalArray: 3e arg non-numérique =', args[2]);
  return null;
}

function extractIndexFromSetGlobal(fullText) {
  const reSet = new RegExp(
    `(?:Set\\s+Global\\s+Variable|设置\\s*全局\\s*变量|グローバル変数を設定)\\s*\\(\\s*Difficultyhud\\s*,`,
    'i'
  );
  const mB = reSet.exec(fullText);
  if (!mB) {
    logDiff('extractIndexFromSetGlobal: non trouvé');
    return null;
  }

  const openSet = fullText.indexOf('(', mB.index);
  if (openSet < 0) return null;
  const closeSet = findMatchingParen(fullText, openSet);
  if (closeSet < 0) return null;

  const setBody = fullText.slice(openSet + 1, closeSet);

  const reCombo = new RegExp(`${KW_COMBO}\\s*\\(`, 'i');
  const relCombo = setBody.search(reCombo);
  if (relCombo < 0) {
    logDiff('extractIndexFromSetGlobal: pas de Combo(...) dans Set');
    return null;
  }

  const openComboRel = setBody.indexOf('(', relCombo);
  if (openComboRel < 0) return null;

  let depth = 1,
    inQ = false,
    closeComboRel = -1;
  for (let i = openComboRel + 1; i < setBody.length; i++) {
    const ch = setBody[i],
      prev = setBody[i - 1];
    if (ch === '"' && prev !== '\\') {
      inQ = !inQ;
      continue;
    }
    if (inQ) continue;
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) {
        closeComboRel = i;
        break;
      }
    }
  }
  if (closeComboRel < 0) return null;

  const comboBody = setBody.slice(openComboRel + 1, closeComboRel);
  const args = splitTopLevelArgs(comboBody);
  const idx = parseInt(String(args[2] || '').trim(), 10);
  if (Number.isFinite(idx)) {
    logDiff('extractIndexFromSetGlobal: trouvé =', idx);
    return idx;
  }
  logDiff('extractIndexFromSetGlobal: 3e arg non-numérique =', args[2]);
  return null;
}

function extractDifficultyValue(fullText) {
  const v0 = extractIndexFromCanonicalHudLine(fullText);
  if (v0 !== null) {
    logDiff && logDiff('extractDifficultyValue: priorité HUD canonique =', v0);
    return v0;
  }

  let v = extractWorkshopHudIndex(fullText);
  if (v === null) v = extractWorkshopHudIndexLoose(fullText);
  if (v !== null) {
    logDiff && logDiff('extractDifficultyValue: fallback workshop =', v);
    return v;
  }

  const g = extractIndexFromGlobalArray(fullText);
  if (g !== null) {
    logDiff && logDiff('extractDifficultyValue: fallback global array =', g);
    return g;
  }

  const s = extractIndexFromSetGlobal(fullText);
  if (s !== null) {
    logDiff && logDiff('extractDifficultyValue: fallback set global =', s);
    return s;
  }

  logDiff && logDiff('extractDifficultyValue: aucune valeur trouvée');
  return null;
}

function extractIndexFromCanonicalHudLine(fullText) {
  const normalizeSpaces = (s) =>
    String(s).replace(/\uFEFF/g, '')
             .replace(/[\u2000-\u200B\u202F\u205F\u3000]+/g, ' ')
             .replace(/\s+/g, ' ');
  const normalizeBrackets = (s) =>
    String(s).replace(/[\uFF3B\u3010\u3016\u3014\u27E6\u2983\u2985\u301A]/g, '[')
             .replace(/[\uFF3D\u3011\u3017\u3015\u27E7\u2984\u2986\u301B]/g, ']');

  const HUD_LABEL = 'Difficulty Display Hud     ◆ 难度 顶部hud   ◆ 난이도 HUD 디스플레이';

  const esc = (s) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const labelPattern = esc(HUD_LABEL).replace(/\s+/g, '\\s+');

  const txt = normalizeBrackets(normalizeSpaces(fullText));
  const re = new RegExp(`${labelPattern}\\s*[:：]\\s*\\[\\s*(\\d{1,3})\\s*\\]`, 'i');

  const m = re.exec(txt);
  if (!m) return null;

  const v = parseInt(m[1], 10);
  return Number.isFinite(v) ? v : null;
}

function applyDifficultyIndexToTemplate(tpl, wanted) {
  const newIndex = parseInt(String(wanted).trim(), 10);
  if (!Number.isFinite(newIndex)) {
    logDiff('applyDifficulty: wanted non-numérique =', wanted);
    return tpl;
  }

  const m = /Set\s*Global\s*Variable\s*\(\s*Difficultyhud\s*,/i.exec(tpl);
  if (!m) {
    logDiff('applyDifficulty: Set Global Variable(Difficultyhud, ...) introuvable');
    return tpl;
  }

  const openSet = tpl.indexOf('(', m.index);
  if (openSet < 0) return tpl;
  const closeSet = findMatchingParen(tpl, openSet);
  if (closeSet < 0) return tpl;

  const beforeSet = tpl.slice(0, openSet + 1);
  const setBody = tpl.slice(openSet + 1, closeSet);
  const afterSet = tpl.slice(closeSet);

  const relCombo = setBody.search(/Workshop\s*Setting\s*Combo\s*\(/i);
  if (relCombo < 0) {
    logDiff('applyDifficulty: Combo(...) introuvable dans Set');
    return tpl;
  }

  const openComboRel = setBody.indexOf('(', relCombo);
  if (openComboRel < 0) return tpl;

  let depth = 1,
    inQ = false,
    closeComboRel = -1;
  for (let i = openComboRel + 1; i < setBody.length; i++) {
    const ch = setBody[i],
      prev = setBody[i - 1];
    if (ch === '"' && prev !== '\\') {
      inQ = !inQ;
      continue;
    }
    if (inQ) continue;
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) {
        closeComboRel = i;
        break;
      }
    }
  }
  if (closeComboRel < 0) {
    logDiff('applyDifficulty: fermeture Combo non trouvée');
    return tpl;
  }

  const beforeCombo = setBody.slice(0, openComboRel + 1);
  const comboBody = setBody.slice(openComboRel + 1, closeComboRel);
  const afterCombo = setBody.slice(closeComboRel);

  const args = splitTopLevelArgs(comboBody);
  if (args.length < 4) {
    logDiff('applyDifficulty: args Combo insuffisants:', args.length, args);
    return tpl;
  }

  logDiff('applyDifficulty: 3e arg (avant) =', args[2]);
  args[2] = String(newIndex);
  logDiff('applyDifficulty: 3e arg (après) =', args[2]);

  const newComboBody = args.join(', ');
  const newSetBody = beforeCombo + newComboBody + afterCombo;
  const out = beforeSet + newSetBody + afterSet;

  try {
    const check = /Workshop\s*Setting\s*Combo\s*\(([^)]*)\)/i.exec(out);
    if (check) {
      const postArgs = splitTopLevelArgs(check[1]);
      logDiff('applyDifficulty: vérif post-écriture 3e arg =', postArgs[2]);
      const anchor = out.indexOf(check[0]);
      logDiff('applyDifficulty: contexte autour de Combo():\n' + sliceAround(out, anchor, 180));
    }
  } catch (e) {
    logDiff('applyDifficulty: vérif post-écriture erreur:', e && e.message);
  }

  return out;
}

function fillDifficultyFieldsFromValue(diffValue) {
  const sel = document.getElementById('difficultyHUDSelect');
  if (!sel) {
    if (typeof logDiff === 'function') logDiff('fillDifficultyFieldsFromValue: select introuvable');
    return;
  }

  const TOKEN_TO_INDEX = Object.fromEntries((DIFFICULTY_MAP || []).map((t, i) => [t, i]));
  function normToken(s) {
    if (s == null) return null;
    s = String(s)
      .replace(/<[^>]*>/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/very\s*hard/g, 'veryhard')
      .replace(/\s*\+\s*$/, '+')
      .replace(/\s*-\s*$/, '-')
      .replace(/do\s*not\s*display|don['’]?\s*t\s*display|不显示|표시\s*x/i, 'off');
    if (/^playtest/.test(s)) return 'playtest';
    return s;
  }

  let wantedToken = null;

  if (diffValue != null && /^\s*\d+\s*$/.test(String(diffValue))) {
    const idx = Math.max(0, Math.min((DIFFICULTY_MAP?.length ?? 0) - 1, parseInt(diffValue, 10)));
    wantedToken = (DIFFICULTY_MAP && DIFFICULTY_MAP[idx]) || null;
  } else if (diffValue != null) {
    const tok = normToken(diffValue);
    wantedToken = tok && (tok in TOKEN_TO_INDEX) ? tok : tok;
  }

  if (!wantedToken) {
    if (typeof logDiff === 'function') logDiff('fillDifficultyFieldsFromValue: token introuvable pour', diffValue);
    return;
  }

  const opts = Array.from(sel.options);
  let idxByValue = opts.findIndex(o => (o.value || '').toLowerCase() === String(wantedToken).toLowerCase());

  if (idxByValue < 0) {
    const needle = String(wantedToken)
      .toLowerCase()
      .replace('+', ' + ')
      .replace('-', ' - ')
      .replace('veryhard', 'very hard');
    idxByValue = opts.findIndex(o => String(o.text || o.label || '').toLowerCase().includes(needle));
  }

  if (idxByValue >= 0) {
    sel.selectedIndex = idxByValue;
  } else {
    sel.value = wantedToken;
  }

  if (typeof logDiff === 'function') {
    const chosen = sel.options[sel.selectedIndex];
    logDiff('fillDifficultyFieldsFromValue → voulu:', diffValue, 'token:', wantedToken,
            '| UI => idx:', sel.selectedIndex, 'value:', chosen && chosen.value, 'text:', chosen && chosen.text);
  }

  sel.dispatchEvent(new Event('change', { bubbles: true }));
}

function ensureDifficultyHudInWorkshop(tpl, lang, difficultyIndex) {
  let idx = Number.isFinite(+difficultyIndex) ? +difficultyIndex : extractDifficultyValue(tpl);
  if (!Number.isFinite(+idx)) idx = 0;

  const HUD_LABEL = 'Difficulty Display Hud     ◆ 难度 顶部hud   ◆ 난이도 HUD 디스플레이';
  const HUD_KEY_RE = /difficulty\s*display\s*hud/i;

  const headerRe = /(^|\n)(workshop|地图工坊|ワークショップ)\s*(?:\r?\n)?\s*\{/i;
  const m = headerRe.exec(tpl);

  if (!m) {
    const header = (lang === 'zh-CN') ? '地图工坊' : (lang === 'ja-JP') ? 'ワークショップ' : 'workshop';
    const block = `${header} {\n    ${HUD_LABEL}: [${idx}]\n}\n\n`;
    return block + tpl;
  }

  const openIdx = tpl.indexOf('{', m.index);
  if (openIdx < 0) return tpl;

  let depth = 1, i = openIdx + 1;
  for (; i < tpl.length; i++) {
    const ch = tpl[i];
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) break; }
  }
  if (depth !== 0) return tpl;

  const before = tpl.slice(0, openIdx + 1);
  const body   = tpl.slice(openIdx + 1, i);
  const after  = tpl.slice(i);

  const lines = body.split(/\r?\n/);
  let found = false;

  for (let k = 0; k < lines.length; k++) {
    const ln = lines[k];
    if (HUD_KEY_RE.test(ln)) {
      const indent = (ln.match(/^\s*/) || [''])[0];
      lines[k] = `${indent}${HUD_LABEL}: [${idx}]`;
      found = true;
      break;
    }
  }

  if (!found) {
    const indent = (body.match(/^\s+/m) || ['    '])[0];
    lines.unshift(`${indent}${HUD_LABEL}: [${idx}]`);
  }

  return before + '\n' + lines.join('\n') + '\n' + after;
}

function applyDifficultyValue(fullText, lang, wanted) {
  const log =
    typeof logDiff === 'function'
      ? logDiff
      : (...a) => {
          try {
            console.log('[DIFF]', ...a);
          } catch (_) {}
        };

  const _findMatchingParen =
    typeof findMatchingParen === 'function'
      ? findMatchingParen
      : function (text, openIdx) {
          let depth = 1,
            inQ = false;
          for (let i = openIdx + 1; i < text.length; i++) {
            const ch = text[i],
              prev = text[i - 1];
            if (ch === '"' && prev !== '\\') {
              inQ = !inQ;
              continue;
            }
            if (inQ) continue;
            if (ch === '(') depth++;
            else if (ch === ')') {
              depth--;
              if (depth === 0) return i;
            }
          }
          return -1;
        };

  const _splitTopLevelArgs =
    typeof splitTopLevelArgs === 'function'
      ? splitTopLevelArgs
      : function (argListStr) {
          const args = [];
          let cur = '',
            p = 0,
            b = 0,
            q = false;
          for (let k = 0; k < argListStr.length; k++) {
            const ch = argListStr[k],
              prev = argListStr[k - 1];
            if (ch === '"' && prev !== '\\') q = !q;
            if (!q) {
              if (ch === '(') p++;
              else if (ch === ')') p--;
              else if (ch === '[') b++;
              else if (ch === ']') b--;
              if (ch === ',' && p === 0 && b === 0) {
                args.push(cur.trim());
                cur = '';
                continue;
              }
            }
            cur += ch;
          }
          if (cur.trim()) args.push(cur.trim());
          return args;
        };

  function findMatchingBrace(text, openIdx) {
    let depth = 1,
      inQ = false;
    for (let i = openIdx + 1; i < text.length; i++) {
      const ch = text[i],
        prev = text[i - 1];
      if (ch === '"' && prev !== '\\') {
        inQ = !inQ;
        continue;
      }
      if (inQ) continue;
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  function normalizeSpaces(s) {
    return String(s)
      .replace(/\uFEFF/g, '')
      .replace(/[\u200B\u200C\u200D]/g, '')
      .replace(/[\u00A0\u2007\u202F\u2000-\u200A]/g, ' ');
  }
  function normalizeBrackets(s) {
    return String(s)
      .replace(/[\uFF3B\u3010\u3016\u3014\u27E6\u2983\u2985\u301A]/g, '[')
      .replace(/[\uFF3D\u3011\u3017\u3015\u27E7\u2984\u2986\u301B]/g, ']');
  }
  function normalizeDigits(s) {
    return String(s).replace(/[\uFF10-\uFF19\u0660-\u0669\u06F0-\u06F9]/g, (ch) => {
      const cp = ch.codePointAt(0);
      if (cp >= 0xff10 && cp <= 0xff19) return String(cp - 0xff10);
      if (cp >= 0x0660 && cp <= 0x0669) return String(cp - 0x0660);
      if (cp >= 0x06f0 && cp <= 0x06f9) return String(cp - 0x06f0);
      return ch;
    });
  }
  function normalizeLine(s) {
    return normalizeDigits(normalizeBrackets(normalizeSpaces(s)));
  }

  const TOKEN_TO_IDX = Object.fromEntries(DIFFICULTY_MAP.map((t, i) => [t, i]));

  function normToken(s) {
    s = String(s || '')
      .toLowerCase()
      .replace(/<[^>]*>/g, '')
      .trim();
    s = s.replace(/\s+/g, ' ');
    s = s.replace(/very\s*hard/g, 'veryhard');
    if (s.startsWith('playtest')) return 'playtest';
    return s;
  }

  function computeIndex(w) {
    if (w == null) return null;
    const str = String(w).trim();
    if (/^\d+$/.test(str)) {
      let n = parseInt(str, 10);
      if (!Number.isFinite(n)) return null;
      n = Math.max(0, Math.min(17, n));
      return n;
    }
    const tok = normToken(str);
    if (TOKEN_TO_IDX.hasOwnProperty(tok)) return TOKEN_TO_IDX[tok];
    return null;
  }

  const idx = computeIndex(wanted);
  logDiff('applyDifficultyValue: wanted =', wanted, '=> idx =', idx);
  if (idx == null) return fullText;

  let text = fullText;

  (function updateWorkshopBlock() {
    const key = /(workshop|地图工坊|ワークショップ)\s*\{/i.exec(text);
    if (!key) {
      log('applyDifficultyValue: workshop block introuvable (ok)');
      return;
    }
    const openBrace = text.indexOf('{', key.index + key[0].length);
    if (openBrace < 0) {
      log("applyDifficultyValue: '{' après workshop introuvable");
      return;
    }
    const closeBrace = findMatchingBrace(text, openBrace);
    if (closeBrace < 0) {
      log("applyDifficultyValue: '}' du workshop introuvable");
      return;
    }

    const head = text.slice(0, openBrace + 1);
    const body = text.slice(openBrace + 1, closeBrace);
    const tail = text.slice(closeBrace);

    const lines = body.split(/\r?\n/);
    let changed = false;

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const norm = normalizeLine(raw);
      const isHud =
        /difficulty\s*display\s*hud/i.test(norm) ||
        (/难度/.test(norm) && /顶部/.test(norm) && /hud/i.test(norm));
      if (!isHud) continue;

      const next = norm.replace(/\[\s*\d+\s*\]/g, `[${idx}]`).replace(/:\s*\d+\b/g, `: ${idx}`);
      if (next !== norm) {
        lines[i] = next;
        changed = true;
        logDiff('applyDifficultyValue: workshop line modifiée ->', next);
        break;
      } else {
        lines[i] = norm.replace(/(\S)\s*$/, `$1 [${idx}]`);
        changed = true;
        logDiff('applyDifficultyValue: workshop line: ajout [idx] ->', lines[i]);
        break;
      }
    }

    if (changed) {
      text = head + lines.join('\n') + tail;
    } else {
      const indent = (body.match(/^\s+/m) || ['    '])[0];
      lines.unshift(`${indent}Difficulty Display Hud     ◆ 难度 顶部hud   ◆ 난이도 HUD 디ス플레이: [${idx}]`);
      text = head + lines.join('\n') + tail;
      logDiff('applyDifficultyValue: HUD ajouté (absent)');
    }
  })();

  (function updateSetGlobal() {
    const re = /Set\s*Global\s*Variable\s*\(\s*Difficultyhud\s*,/gi;
    let m,
      count = 0;

    while ((m = re.exec(text))) {
      const openSet = text.indexOf('(', m.index);
      const closeSet = _findMatchingParen(text, openSet);
      if (openSet < 0 || closeSet < 0) {
        re.lastIndex = m.index + m[0].length;
        continue;
      }

      const setBody = text.slice(openSet + 1, closeSet);

      const relCombo = setBody.search(/Workshop\s*Setting\s*Combo\s*\(/i);
      if (relCombo < 0) {
        re.lastIndex = closeSet + 1;
        continue;
      }

      const openComboRel = setBody.indexOf('(', relCombo);
      let depth = 1,
        inQ = false,
        closeComboRel = -1;
      for (let i = openComboRel + 1; i < setBody.length; i++) {
        const ch = setBody[i],
          prev = setBody[i - 1];
        if (ch === '"' && prev !== '\\') {
          inQ = !inQ;
          continue;
        }
        if (inQ) continue;
        if (ch === '(') depth++;
        else if (ch === ')') {
          depth--;
          if (depth === 0) {
            closeComboRel = i;
            break;
          }
        }
      }
      if (closeComboRel < 0) {
        re.lastIndex = closeSet + 1;
        continue;
      }

      const beforeCombo = setBody.slice(0, openComboRel + 1);
      const comboBody = setBody.slice(openComboRel + 1, closeComboRel);
      const afterCombo = setBody.slice(closeComboRel);

      const args = _splitTopLevelArgs(comboBody);
      if (args.length >= 3) {
        logDiff('applyDifficultyValue:SetGlobal avant idx =', args[2]);
        args[2] = String(idx);
        const newComboBody = args.join(', ');
        const newSetBody = beforeCombo + newComboBody + afterCombo;
        text = text.slice(0, openSet + 1) + newSetBody + text.slice(closeSet);
        re.lastIndex = openSet + 1 + newComboBody.length;
        count++;
      } else {
        re.lastIndex = closeSet + 1;
      }
    }
    logDiff('applyDifficultyValue:SetGlobal remplacés =', count);
  })();

  (function updateGlobalArray() {
    const re =
      /(?:Global|全局|グローバル)\.Difficultyhud\s*=\s*Array\s*\(\s*Workshop\s*Setting\s*Combo\s*\(/gi;
    let m,
      count = 0;

    while ((m = re.exec(text))) {
      const comboOpen = m.index + m[0].lastIndexOf('(');
      const comboClose = _findMatchingParen(text, comboOpen);
      if (comboClose < 0) {
        re.lastIndex = m.index + m[0].length;
        continue;
      }

      const inside = text.slice(comboOpen + 1, comboClose);
      const args = _splitTopLevelArgs(inside);
      if (args.length >= 3) {
        logDiff('applyDifficultyValue:GlobalArray avant idx =', args[2]);
        args[2] = String(idx);
        const newInside = args.join(', ');
        text = text.slice(0, comboOpen + 1) + newInside + text.slice(comboClose);
        re.lastIndex = comboOpen + 1 + newInside.length;
        count++;
      } else {
        re.lastIndex = comboClose + 1;
      }
    }
    logDiff('applyDifficultyValue:GlobalArray remplacés =', count);
  })();

  logDiff('applyDifficultyValue: DONE (idx =', idx, ')');
  return text;
}

/* =========================
   MODE MAP NAME BLOCK
   ========================= */
function extractModeMapNames(fullText) {
  const result = {};
  const mainRegex = /^\s*(?:modes|modos|模式|モード|modi)\s*\{/im;
  const modesMatch = fullText.match(mainRegex);
  if (!modesMatch) return result;

  const modesStartIdx = fullText.indexOf(modesMatch[0]);
  const braceOpenIdx = fullText.indexOf('{', modesStartIdx + modesMatch[0].length - 1);
  if (braceOpenIdx < 0) return result;

  let braceCount = 1;
  let idx = braceOpenIdx + 1;
  for (; idx < fullText.length; idx++) {
    if (fullText[idx] === '{') braceCount++;
    else if (fullText[idx] === '}') {
      braceCount--;
      if (braceCount === 0) break;
    }
  }
  if (braceCount !== 0) return result;

  const modesContent = fullText.slice(braceOpenIdx + 1, idx);
  let pos = 0;

  while (pos < modesContent.length) {
    const remaining = modesContent.slice(pos);
    const headerMatch = remaining.match(
      /^\s*(?:disabled\s+|deshabilitado\s+|desabilitado\s+|deaktiviert\s+|禁用\s+|無効\s+)?([^\s{][^{\r\n]*)\s*\{/im
    );
    if (!headerMatch) break;

    const modeNameRaw = headerMatch[1].trim();
    const headerIndex = headerMatch.index;
    const braceRelIdx = headerMatch[0].lastIndexOf('{');
    const openingBraceIdx = pos + headerIndex + braceRelIdx;

    let innerBrace = 1;
    let j = openingBraceIdx + 1;
    for (; j < modesContent.length; j++) {
      if (modesContent[j] === '{') innerBrace++;
      else if (modesContent[j] === '}') {
        innerBrace--;
        if (innerBrace === 0) break;
      }
    }
    if (innerBrace !== 0) break;

    const modeBlockContent = modesContent.slice(openingBraceIdx + 1, j);
    pos = j + 1;

    const enabledRegex =
      /(?:enabled\s+maps|mapas\s+habilitados|mapas\s+ativados|verfügbare\s+karten|启用地图|有効なマップ)\s*\{\s*([\s\S]*?)\s*\}/i;
    const enabledMatch = modeBlockContent.match(enabledRegex);
    if (!enabledMatch) continue;

    const insideEnabled = enabledMatch[1].trim();
    const lines = insideEnabled.split(/\r?\n/);

    for (let rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      const tokens = line.split(/\s+/);
      const lastToken = tokens[tokens.length - 1];

      if (tokens.length >= 2 && /^\d{8,}$/.test(lastToken)) {
        const fullMapEntry = tokens.join(' ');
        result[modeNameRaw] = fullMapEntry;
        break;
      }

      const mapNameOnly = line;
      const mapId = findMapIdFromName(mapNameOnly, CURRENT_LANG);

      if (mapId && /^\d{8,}$/.test(mapId)) {
        const fullMapEntry = `${mapNameOnly} ${mapId}`;
        result[modeNameRaw] = fullMapEntry;
        break;
      }

    }
  }

  return result;
}

function findMapIdFromName(localizedName, lang = CURRENT_LANG) {
  if (!localizedName || !mapNamesTranslations) return null;

  const targetLangs = [lang, 'zh-CN', 'en-US'];

  for (const [key, entry] of Object.entries(mapNamesTranslations)) {
    if (!entry || typeof entry !== 'object') continue;

    const matches = targetLangs.some((lng) => entry[lng] === localizedName);
    if (!matches) continue;

    let id = null;
    if (entry.variants && entry.variants.default) {
      id = String(entry.variants.default).trim();
    } else if (entry.guid) {
      id = String(entry.guid).trim();
    }

    if (id && /^\d{8,}$/.test(id)) {
      return id;
    }
  }

  return null;
}

function findModeKey(localizedName, lang) {
  if (!modesNames) return null;
  for (const [modeKey, translations] of Object.entries(modesNames)) {
    if (translations[lang] === localizedName) {
      return modeKey;
    }
  }
  return null;
}

function getTargetModeName(modeKey, targetLang, fallback) {
  if (modesNames && modesNames[modeKey] && modesNames[modeKey][targetLang]) {
    return modesNames[modeKey][targetLang];
  }
  return fallback;
}

function insertMapNameIntoTemplate(tpl, modeName, fullMapEntry, lang) {
  const modeRegex = new RegExp(`^\\s*${modeName.trim()}\\s*\\{`, 'm');
  const modeHeaderMatch = tpl.match(modeRegex);
  if (!modeHeaderMatch) return tpl;

  const modeLineIdx = modeHeaderMatch.index;
  const openingBraceIdx = tpl.indexOf('{', modeLineIdx);
  if (openingBraceIdx < 0) return tpl;

  let keyword, keywordMatch;
  if (lang === 'ja-JP') {
    keyword = '有効なマップ';
    keywordMatch = new RegExp(`${keyword}\\s*\\{`);
  } else if (lang === 'zh-CN') {
    keyword = '启用地图';
    keywordMatch = new RegExp(`${keyword}\\s*\\{`);
  } else if (lang === 'es-MX') {
    keyword = 'mapas habilitados';
    keywordMatch = new RegExp(`${keyword}\\s*\\{`, 'i');
  } else if (lang === 'pt-BR') {
    keyword = 'mapas ativados';
    keywordMatch = new RegExp(`${keyword}\\s*\\{`, 'i');
  } else if (lang === 'de-DE') {
    keywordMatch = /verfügba(?:re|ren)\s+karten\s*\{/i;
  } else {
    keyword = 'enabled maps';
    keywordMatch = new RegExp(`${keyword}\\s*\\{`, 'i');
  }

  const sliceAfter = tpl.slice(openingBraceIdx);
  const m = sliceAfter.match(keywordMatch);
  if (!m) return tpl;

  const braceEnabledOpen = tpl.indexOf('{', openingBraceIdx + m.index + m[0].lastIndexOf('{'));
  if (braceEnabledOpen < 0) return tpl;

  let level = 1,
    k = braceEnabledOpen + 1;
  for (; k < tpl.length; k++) {
    if (tpl[k] === '{') level++;
    else if (tpl[k] === '}') {
      level--;
      if (level === 0) break;
    }
  }
  if (level !== 0) return tpl;
  const braceEnabledClose = k;

  const indentMatch = tpl.slice(braceEnabledOpen + 1).match(/^[ \t]*/);
  const indent = indentMatch ? indentMatch[0] : '    ';

  const newInside = `\n${indent}${fullMapEntry}\n${indent}`;
  return tpl.slice(0, braceEnabledOpen + 1) + newInside + tpl.slice(braceEnabledClose);
}

/* =========================
   CREDITS AND COLORS BLOCK
   ========================= */
function extractCreditsActions(fullText, lang = getActiveOutputLang()) {
  const titles = getMarkers('credits');
  for (const title of titles) {
    const loc = findRuleByTitle(fullText, title, lang, { allowDisabled: true });
    if (!loc) continue;
    const body = fullText.slice(loc.openIdx + 1, loc.closeIdx);
    const wActions = getWord('actions', lang);
    const mAct = body.match(new RegExp(`${wActions}\\s*\\{`, 'i'));
    if (!mAct) continue;
    const actOpen = body.indexOf('{', mAct.index);
    let depth = 1, j = actOpen + 1;
    for (; j < body.length; j++) {
      const ch = body[j];
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) break; }
    }
    if (depth !== 0) continue;
    return body.slice(actOpen + 1, j).trim();
  }
  throw new Error('Crédits: règle introuvable');
}

function insertCreditsActionsIntoTemplate(tpl, newActionsText, lang = getActiveOutputLang()) {
  if (!newActionsText || !newActionsText.trim()) return tpl;

  const titles = getMarkers('credits');
  const actionsWord = getWord('actions', lang);
  let out = tpl;

  for (const title of titles) {
    const loc = findRuleByTitle(out, title, lang, { allowDisabled: true });
    if (!loc) continue;

    const ruleBody = out.slice(loc.openIdx + 1, loc.closeIdx);

    const mAct = ruleBody.match(new RegExp(`${actionsWord}\\s*\\{`, 'i'));
    if (!mAct) {
      continue;
    }

    const actOpen = ruleBody.indexOf('{', mAct.index);
    let depth = 1, j = actOpen + 1;
    for (; j < ruleBody.length; j++) {
      const ch = ruleBody[j];
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) break; }
    }
    if (depth !== 0) continue;

    const afterOpen = ruleBody.slice(actOpen + 1, j);
    const lines = afterOpen.split(/\r?\n/);
    const sample = lines.find(l => l.trim().length > 0) || '';
    const currentIndentMatch = sample.match(/^[ \t]*/);
    const currentIndent = currentIndentMatch ? currentIndentMatch[0] : '        ';
    const newActions = newActionsText
      .split('\n')
      .map(l => currentIndent + l.trim())
      .join('\n');

    const newRuleBody =
      ruleBody.slice(0, actOpen + 1) + '\n' +
      newActions + '\n' +
      ruleBody.slice(j);

    out = out.slice(0, loc.openIdx + 1) + newRuleBody + out.slice(loc.closeIdx);
    return out;
  }

  const defaultTitle = firstMarker('credits');
  const header = buildRuleHeader(defaultTitle, lang);
  const body = newActionsText
    .split('\n')
    .map(l => '        ' + l.trim())
    .join('\n');
  const full = wrapRuleBody(header, '', body, lang);

  return out.replace(/\s*$/, '\n\n') + full + '\n';
}

function sanitizeRHS(rhsRaw) {
  let rhs = (rhsRaw || '').trim();

  rhs = rhs.replace(/[);\s]+$/, '');

  const opens = (rhs.match(/\(/g) || []).length;
  const closes = (rhs.match(/\)/g) || []).length;

  if (closes > opens) {
    let extra = closes - opens;
    while (extra > 0 && rhs.endsWith(')')) {
      rhs = rhs.slice(0, -1);
      extra--;
    }
  } else if (opens > closes) {
    rhs += ')'.repeat(opens - closes);
  }

  return rhs;
}

function _parseCreditsData(creditsActionsText) {
  const src = creditsActionsText || '';
  const GLOB = '(?:Global|全局|グローバル)';
  const CSTR = '(?:Custom\\s*String|自定义字符串|カスタム文字列)';
  const CSTR_FIRST_Q = `${CSTR}\\s*\\(\\s*"([^"]*)"[^)]*\\)`;
  const SET_GV = '(?:Set\\s+Global\\s+Variable|设置\\s*全局\\s*变量|グローバル変数を設定)';

  // ———— NAME ————
  const reSetName = new RegExp(
    `${SET_GV}\\s*\\(\\s*Name\\s*,\\s*${CSTR_FIRST_Q}\\s*\\)\\s*;?`,
    'i'
  );
  const reDotName = new RegExp(`${GLOB}\\.\\s*Name\\s*=\\s*${CSTR_FIRST_Q}\\s*;?`, 'i');
  let m = src.match(reSetName) || src.match(reDotName);
  const name = m ? m[1] : null;

  // ———— CODE ————
  const reSetCode = new RegExp(
    `${SET_GV}\\s*\\(\\s*Code\\s*,\\s*${CSTR_FIRST_Q}\\s*\\)\\s*;?`,
    'i'
  );
  const reDotCode = new RegExp(`${GLOB}\\.\\s*Code\\s*=\\s*${CSTR_FIRST_Q}\\s*;?`, 'i');
  m = src.match(reSetCode) || src.match(reDotCode);
  const code = m ? m[1] : null;

  // ———— COLORS ————
  const colors = {};

  const SET_IDX =
    '(?:Set\\s+Global\\s+Variable\\s+At\\s+Index|在索引处设置全局变量|インデックスでグローバル変数を設定)';
  const reSetIdxAny = new RegExp(
    `${SET_IDX}\\s*\\(\\s*ColorConfig\\s*,\\s*([^,\\)]+)\\s*,\\s*([\\s\\S]*?)\\)\\s*;?`,
    'gi'
  );
  let mm;
  while ((mm = reSetIdxAny.exec(src))) {
    const idx = String(mm[1]).trim();
    const rhs = sanitizeRHS(mm[2]);
    colors[idx] = rhs;
  }

  const reDotIdx = new RegExp(
    `${GLOB}\\.\\s*ColorConfig\\s*\\[\\s*([^\\]\\r\\n]+?)\\s*\\]\\s*=\\s*([^\\r\\n;]+)\\s*;?`,
    'gi'
  );
  while ((mm = reDotIdx.exec(src))) {
    const idx = String(mm[1]).trim();
    const rhs = sanitizeRHS(mm[2]);
    colors[idx] = rhs;
  }

  return { name, code, colors };
}

/* =========================
   ADDONS BLOCK (WIP)
   ========================= */
async function injectTranslatedAddons(tpl, fullText, sourceLang, targetLang) {
  const titles = getMarkers('addons');
  for (const title of titles) {
    const sourceBlock = extractEnabledBlockByExactTitle(fullText, title, sourceLang);
    if (!sourceBlock) continue;

    let reconstructed;
    if (sourceLang === targetLang) {
      reconstructed = sourceBlock.replace(/^\s*disabled\s+/i, '');
    } else {
      reconstructed = translateEntireAddonBlock(sourceBlock, sourceLang, targetLang);
    }

    tpl = removeAllBlocksByTitle(tpl, title, targetLang);
    tpl += '\n\n' + reconstructed;
  }
  return tpl;
}

function removeAllBlocksByTitle(tpl, title, lang = getActiveOutputLang()) {
  return removeAllRulesByTitles(tpl, [title], lang);
}

function removeAllRulesByTitles(text, titles, lang = getActiveOutputLang()) {
  let out = text;
  (titles || []).forEach((t) => {
    while (true) {
      const loc = findRuleByTitle(out, t, lang, { allowDisabled: true });
      if (!loc) break;
      const headStart = Math.max(0, out.lastIndexOf('\n', loc.startHeaderIdx) + 1);
      out = out.slice(0, headStart) + out.slice(loc.closeIdx + 1);
    }
  });
  return out;
}

function extractEnabledBlockByExactTitle(fullText, title, lang = getActiveOutputLang()) {
  const disabledWord = getWord('disabled', lang);
  const ruleWord = getWord('rule', lang);
  const t = title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const re = new RegExp(`(^|\\n)[ \\t]*(?!${disabledWord}\\s+)${ruleWord}\\s*\\(\\s*"${t}(?:[^"]*)?"\\s*\\)\\s*\\{`, 'i');
  const m = fullText.match(re);
  if (!m) return null;

  const startIdx = m.index + (m[1] ? m[1].length : 0);
  const braceOpen = fullText.indexOf('{', startIdx + m[0].length - (m[1] ? m[1].length : 0) - 1);
  if (braceOpen < 0) return null;

  let level = 1, i = braceOpen + 1;
  for (; i < fullText.length; i++) {
    if (fullText[i] === '{') level++;
    else if (fullText[i] === '}') { level--; if (level === 0) break; }
  }
  if (level !== 0) return null;

  return fullText.slice(startIdx, i + 1);
}

function removeAllDisabledBlocks(tplStr, title) {
  const disabledPrefixes = [
    'disabled',
    'deshabilitado',
    'desabilitado',
    'deaktiviert',
    '無効',
    '禁用',
  ];
  const ruleKeywords = ['rule', 'regla', 'regra', 'regel', 'ルール', '规则'];
  const t = title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  const prefixGroup = disabledPrefixes.join('|');
  const ruleGroup = ruleKeywords.join('|');

  const regexSource = `(?:${prefixGroup})\\s+(?:${ruleGroup})\\s*\\(\\s*"${t}"\\s*\\)`;
  const reDisabledStart = new RegExp(regexSource, 'i');

  let result = tplStr;
  let m;
  while ((m = result.match(reDisabledStart))) {
    const startIdx = m.index;
    const braceOpen = result.indexOf('{', startIdx);
    if (braceOpen < 0) break;

    let level = 1;
    let i = braceOpen + 1;
    for (; i < result.length; i++) {
      if (result[i] === '{') level++;
      else if (result[i] === '}') {
        level--;
        if (level === 0) break;
      }
    }
    if (level !== 0) break;

    const endIdx = i + 1;
    result = result.slice(0, startIdx) + result.slice(endIdx);
  }

  return result;
}

function buildEnabledRuleRegex(title) {
  const disabledPrefixes = [
    'disabled',
    'deshabilitado',
    'desabilitado',
    'deaktiviert',
    '無効',
    '禁用',
  ];
  const ruleKeywords = ['rule', 'regla', 'regra', 'regel', 'ルール', '规则'];

  const t = title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const negativeLookbehinds = disabledPrefixes.map((pref) => `(?<!(?:${pref}\\s))`).join('');
  const keywordsGroup = ruleKeywords.join('|');
  const regexSource = `${negativeLookbehinds}^[ \\t]*(?:${keywordsGroup})\\s*\\(\\s*"${t}(?:[^"]*)?"\\s*\\)\\s*\\{`;
  return new RegExp(regexSource, 'mi');
}

function extractEnabledBlock(fullText, title) {
  const reEnabledStart = buildEnabledRuleRegex(title);
  const m = fullText.match(reEnabledStart);
  if (!m) return null;

  const startIdx = m.index;
  const braceOpen = fullText.indexOf('{', startIdx);
  if (braceOpen < 0) return null;

  let level = 1;
  let i = braceOpen + 1;
  for (; i < fullText.length; i++) {
    if (fullText[i] === '{') level++;
    else if (fullText[i] === '}') {
      level--;
      if (level === 0) break;
    }
  }
  if (level !== 0) return null;

  return fullText.slice(startIdx, i + 1);
}

function removeAllBlocks(tplStr, title) {
  tplStr = removeAllDisabledBlocks(tplStr, title);

  const t = title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const ruleKeywords = ['rule', 'regla', 'regra', 'regel', 'ルール', '规则'];
  const ruleGroup = ruleKeywords.join('|');
  const regexActiveStart = new RegExp(
    `^[ \\t]*(?:${ruleGroup})\\s*\\(\\s*"${t}"\\s*\\)\\s*\\{`,
    'mi'
  );

  let result = tplStr;
  let m;
  while ((m = result.match(regexActiveStart))) {
    const startIdx = m.index;
    const braceOpen = result.indexOf('{', startIdx);
    if (braceOpen < 0) break;

    let level = 1;
    let i = braceOpen + 1;
    for (; i < result.length; i++) {
      if (result[i] === '{') level++;
      else if (result[i] === '}') {
        level--;
        if (level === 0) break;
      }
    }
    if (level !== 0) break;

    const endIdx = i + 1;
    result = result.slice(0, startIdx) + result.slice(endIdx);
  }

  return result;
}

/* =========================
   WORKSHOP SETTINGS BLOCK
   ========================= */
function parseGlobalWorkshopBans(fullText) {
  const set = new Set();

  const m = fullText.match(/(?:workshop|地图工坊|ワークショップ)\s*\{([\s\S]*?)\}/i);
  if (!m) return [];

  const block = m[1];
  const lines = block.split(/\r?\n/);

  const ON_OFF_WORD =
    '(?:on|off|开启|关闭|활성화|비활성화|вкл\\.|выкл\\.|activado|desactivado|ligado|desligado|ein|aus)';

  for (const raw of lines) {
    const line = String(raw).trim();
    if (!line) continue;

    const m2 = line.match(
      new RegExp(String.raw`^\s*(ban|require)\s+([^:：]+?)\s*[:：]\s*${ON_OFF_WORD}\s*$`, 'i')
    );
    if (!m2) continue;

    const kind = m2[1].toLowerCase();
    const name = m2[2].trim();

    const label = kind === 'ban' ? `Ban ${name}` : `Require ${name}`;
    set.add(label);
  }

  const byKey = new Map();
  for (const lbl of set) byKey.set(normalizeBanKey(lbl), lbl);
  return Array.from(byKey.values());
}

/*————— BANS HELPERS —————*/
function normalizeBanKey(s) {
  let x = String(s)
    .replace(/\uFEFF/g, '')
    .replace(/[\u00A0\u2000-\u200B]/g, ' ')
    .toLowerCase()
    .trim();

  x = x.replace(/^\s*(ban|require)\s+/, '');
  x = x.split('■')[0];
  x = x.split(':')[0];
  x = x.split('：')[0];
  x = x.replace(/\s*[-–—]\s*.*$/, '');

  x = x.replace(/\s+/g, ' ').trim();
  x = x.replace(/[^\p{L}\p{N}]+/gu, '');

  return x;
}

function _normBanText(s) {
  let x = String(s || '')
    .replace(/\uFEFF/g, '')
    .replace(/[“”„‟]/g, '"')
    .replace(/[’‘]/g, "'")
    .replace(/[：]/g, ':')
    .trim();

  x = x.split('■')[0].split('◆')[0];

  x = x.toLowerCase()
    .replace(/^\s*(ban|require)\s+/, '')
    .replace(/\s*[:：].*$/, '')
    .replace(/\s*[-–—]\s*.*$/, '')
    .replace(/\s+/g, ' ')
    .trim();

  x = x.replace(/\bdeathbhop\b/g, 'death hop')
       .replace(/\bemote\s*savehop\b/g, 'emote save hop')
       .replace(/\bstand\s*create\b/g, 'standcreate')
       .replace(/\bwall\s*climb\b/g, 'wallclimb')
       .replace(/\bmulti\s*climb\b/g, 'multiclimb');

  return x;
}

const BAN_RESOLVE_MAP = (() => {
  const m = new Map();
  for (const [key, info] of Object.entries(BAN_MARKERS)) {
    const all = new Set([info.canonical, ...(info.markers || [])]);

    for (const v of [...all]) {
      all.add(v.replace(/◆/g, '■'));
      all.add(v.replace(/■/g, '◆'));
    }
    for (const v of all) m.set(_normBanText(v), key);
  }
  return m;
})();

function resolveBanKey(raw) {
  return BAN_RESOLVE_MAP.get(_normBanText(raw)) || null;
}
function canonicalizeBanLabel(raw) {
  const k = resolveBanKey(raw);
  return k ? BAN_MARKERS[k].canonical : raw;
}

function standardizeWorkshopBansForTemplate(fullText) {
  const detected = parseGlobalWorkshopBans(fullText);
  const seen = new Set();
  const out = [];

  for (const lbl of detected) {
    const key = resolveBanKey(lbl);
    if (key && !seen.has(key)) {
      out.push(BAN_MARKERS[key].canonical);
      seen.add(key);
    }
  }

  return out;
}

function extractWorkshopSettings(fullText) {
  const regex = /(?:workshop|地图工坊|ワークショップ)\s*\{([\s\S]*?)\}/i;
  const match = fullText.match(regex);
  return match ? match[1].trim() : '';
}

function insertWorkshopSettings(tpl, workshopSettingsBlock, lang = getActiveOutputLang()) {
  if (!workshopSettingsBlock || !workshopSettingsBlock.trim()) return tpl;

  tpl = removeWorkshopBlock(tpl);

  let reExtensions;
  switch (lang) {
    case 'es-MX': reExtensions = /^(\s*)extensiones\s*\{/im; break;
    case 'pt-BR': reExtensions = /^(\s*)extensões\s*\{/im; break;
    case 'de-DE': reExtensions = /^(\s*)Erweiterungen\s*\{/im; break;
    case 'ja-JP': reExtensions = /^(\s*)拡張\s*\{/im; break;
    case 'zh-CN': reExtensions = /^(\s*)扩展\s*\{/im; break;
    default:      reExtensions = /^(\s*)extensions\s*\{/im;
  }

  const mExt = tpl.match(reExtensions);

  const baseIndent  = mExt ? (mExt[1] || '') : '';
  const innerIndent = baseIndent + '    ';

  let workshopKeyword;
  switch (lang) {
    case 'zh-CN': workshopKeyword = '地图工坊'; break;
    case 'ja-JP': workshopKeyword = 'ワークショップ'; break;
    default:      workshopKeyword = 'workshop';
  }

  const indentedLines = workshopSettingsBlock
    .split(/\r?\n/)
    .map((line) => innerIndent + line.trim())
    .join('\n');

  const workshopBlock =
    `${baseIndent}${workshopKeyword} {\n` +
    `${indentedLines}\n` +
    `${baseIndent}}\n\n`;

  if (mExt) {
    const insertPos = mExt.index;
    return tpl.slice(0, insertPos) + workshopBlock + tpl.slice(insertPos);
  } else {
    return workshopBlock + tpl;
  }
}

/* ————— WS SETTINGS HELPERS —————*/
function _normSettingText(s) {
  let x = String(s || '')
    .replace(/\uFEFF/g, '')
    .replace(/[“”„‟]/g, '"')
    .replace(/[’‘]/g, "'")
    .replace(/[：]/g, ':')
    .trim();

  x = x.split('■')[0].split('◆')[0];
  x = x.replace(/\s*[:：].*$/, '');

  x = x.toLowerCase()
      .replace(/\s*-\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  x = x.replace(/^editor\s*mode$/, 'editor mode')
       .replace(/^playtest\s*display$/, 'playtest display')
       .replace(/^enable\s*portals\s*control\s*maps$/, 'portals control maps');

  return x;
}

const SETTINGS_RESOLVE_MAP = (() => {
  const m = new Map();
  for (const [key, info] of Object.entries(SETTINGS_MARKERS)) {
    const all = new Set([info.canonical, ...(info.markers || [])]);
    for (const v of [...all]) {
      all.add(v.replace(/◆/g, '■'));
      all.add(v.replace(/■/g, '◆'));
    }
    for (const v of all) m.set(_normSettingText(v), key);
  }
  return m;
})();

function resolveSettingKey(raw) {
  return SETTINGS_RESOLVE_MAP.get(_normSettingText(raw)) || null;
}
function canonicalizeSettingLabel(raw) {
  const k = resolveSettingKey(raw);
  return k ? SETTINGS_MARKERS[k].canonical : raw;
}

/* ————— GLOBAL WS SETTINGNS PARSING —————*/

function parseWorkshopSettings(fullText) {
  const result = { editorMode: false, portals: false, playtest: false };

  const m = fullText.match(/(?:workshop|地图工坊|ワークショップ)\s*\{([\s\S]*?)\}/i);
  if (!m) return result;

  const block = m[1];
  const lines = block.split(/\r?\n/);

  const TRUTHY = new Set(['on','开启','활성화','вкл.','activado','ligado','ein','oui','ja']);
  const FALSY  = new Set(['off','关闭','비활성화','выкл.','desactivado','desligado','aus','non','nein']);

  for (const raw of lines) {
    const line = String(raw || '').trim();
    if (!line) continue;

    let mm = line.match(/^\s*([^:：]+?)\s*[:：]\s*([^\r\n]+)\s*$/);
    if (!mm) continue;

    const label = mm[1].trim();
    const valueRaw = mm[2].trim();

    const key = resolveSettingKey(label);
    if (!key) continue;

    const v = valueRaw.replace(/\[.*?\]/, '').trim().toLowerCase();
    const isOn = TRUTHY.has(v);
    const isOff = FALSY.has(v);

    if (key === 'editorMode') result.editorMode = isOn && !isOff;
    else if (key === 'portalsControlMaps') result.portals = isOn && !isOff;
    else if (key === 'playtestDisplay') result.playtest = isOn && !isOff;
  }

  return result;
}

function removeWorkshopBlock(tpl) {
  const reAll = /(^|\n)[ \t]*(workshop|地图工坊|ワークショップ)\s*\{[\s\S]*?\}\s*\n?/gi;
  return tpl.replace(reAll, '\n');
}

function buildWorkshopBlockContent({ bans, onOff, flags }) {
  const lines = [];

  const L_EDITOR   = SETTINGS_MARKERS.editorMode.canonical;
  const L_PLAYTEST = SETTINGS_MARKERS.playtestDisplay.canonical;
  const L_PORTALS  = SETTINGS_MARKERS.portalsControlMaps.canonical;

  lines.push(`${L_EDITOR}: ${flags?.editorMode ? onOff.on : onOff.off}`);
  lines.push(`${L_PLAYTEST}: ${flags?.playtest ? onOff.on : onOff.off}`);
  lines.push(`${L_PORTALS}: ${flags?.portals ? onOff.on : onOff.off}`);

  const BAN_KEYS = new Set(GLOBAL_BANS.map((lbl) => normalizeBanKey(lbl)));
  const selectedBanKeys = new Set();
  if (flags && typeof flags === 'object') {
    for (const [k, v] of Object.entries(flags)) {
      if (!v) continue;
      const kn = normalizeBanKey(k);
      if (BAN_KEYS.has(kn)) selectedBanKeys.add(kn);
    }
  }

  if (selectedBanKeys.size > 0) {
    GLOBAL_BANS.forEach((lbl) => {
      const key = normalizeBanKey(lbl);
      if (selectedBanKeys.has(key)) lines.push(`${lbl}: ${onOff.on}`);
    });
  } else {
    (bans || []).forEach((lbl) => {
      lines.push(`${lbl}: ${onOff.on}`);
    });
  }

  return lines.join('\n');
}

function upsertWorkshopBlock(tpl, lang, content) {
  const header = (lang === 'zh-CN') ? '地图工坊'
              : (lang === 'ja-JP') ? 'ワークショップ'
              : 'workshop';

  tpl = removeWorkshopBlock(tpl);

  let reExtensions;
  switch (lang) {
    case 'es-MX': reExtensions = /^(\s*)extensiones\s*\{/im; break;
    case 'pt-BR': reExtensions = /^(\s*)extensões\s*\{/im; break;
    case 'de-DE': reExtensions = /^(\s*)Erweiterungen\s*\{/im; break;
    case 'ja-JP': reExtensions = /^(\s*)拡張\s*\{/im; break;
    case 'zh-CN': reExtensions = /^(\s*)扩展\s*\{/im; break;
    default:      reExtensions = /^(\s*)extensions\s*\{/im; break;
  }
  const mExt = tpl.match(reExtensions);
  if (!mExt) {
    const block = `${header}\n{\n${content.split('\n').map(l => '    '+l).join('\n')}\n}\n\n`;
    return block + tpl;
  }

  const baseIndent = mExt[1] || '';
  const innerIndent = baseIndent + '    ';
  const block = `${baseIndent}${header}\n${baseIndent}{\n${content.split('\n').map(l => innerIndent + l).join('\n')}\n${baseIndent}}\n\n`;

  return tpl.slice(0, mExt.index) + block + tpl.slice(mExt.index);
}

/* =========================
   MAP VALIDATOR BLOCK
   ========================= */
function parseBasicMapValidator(tplStr) {
  const disabledPrefixes = [
    'disabled',
    'deshabilitado',
    'desabilitado',
    'deaktiviert',
    '無効',
    '禁用',
  ];
  const ruleKeywords = ['rule', 'regla', 'regra', 'regel', 'ルール', '规则'];
  const title = 'Addon | SUB Basic Map Validator';
  const t = title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  const prefixGroup = disabledPrefixes.join('|');
  const ruleGroup = ruleKeywords.join('|');

  const disabledRegex = new RegExp(
    `(?:${prefixGroup})\\s+(?:${ruleGroup})\\s*\\(\\s*"${t}"\\s*\\)`,
    'i'
  );
  if (disabledRegex.test(tplStr)) {
    return false;
  }

  const enabledRegex = new RegExp(`(?:${ruleGroup})\\s*\\(\\s*"${t}"\\s*\\)`, 'i');
  if (enabledRegex.test(tplStr)) {
    return true;
  }

  return false;
}

function insertBasicMapValidator(tplStr, clientLang, shouldDisable) {
  let disabledWord, ruleWord;
  switch (clientLang) {
    case 'zh-CN':
      disabledWord = '禁用';
      ruleWord = '规则';
      break;
    case 'ja-JP':
      disabledWord = '無効';
      ruleWord = 'ルール';
      break;
    case 'es-MX':
      disabledWord = 'deshabilitado';
      ruleWord = 'regla';
      break;
    case 'pt-BR':
      disabledWord = 'desabilitado';
      ruleWord = 'regra';
      break;
    case 'de-DE':
      disabledWord = 'deaktiviert';
      ruleWord = 'regel';
      break;
    case 'ko-KR':
      disabledWord = 'disabled';
      ruleWord = 'rule';
      break;
    case 'ru-RU':
      disabledWord = 'disabled';
      ruleWord = 'rule';
      break;
    default:
      disabledWord = 'disabled';
      ruleWord = 'rule';
  }

  const titleEscaped = 'Addon\\s*\\|\\s*SUB\\s*Basic\\s*Map\\s*Validator';
  const openParen = '\\(\\s*"' + titleEscaped + '"\\s*\\)';

  const regexRuleLine = new RegExp(`^([ \\t]*)(` + `${ruleWord}\\s*${openParen}` + `)`, 'm');

  if (shouldDisable) {
    const regexAlreadyDisabled = new RegExp(
      `^[ \\t]*${disabledWord}\\s+${ruleWord}\\s*${openParen}`,
      'm'
    );
    if (regexAlreadyDisabled.test(tplStr)) {
      return tplStr;
    }

    return tplStr.replace(regexRuleLine, (_match, indent, rulePart) => {
      return `${indent}${disabledWord} ${rulePart}`;
    });
  } else {
    const regexDisablePrefix = new RegExp(
      `^([ \\t]*)${disabledWord}\\s+(` + `${ruleWord}\\s*${openParen}` + `)`,
      'm'
    );
    return tplStr.replace(regexDisablePrefix, (_match, indent, rulePart) => {
      return `${indent}${rulePart}`;
    });
  }
}

/* =========================
   HELPERS LOADER
   ========================= */
function showLoader() {
  let o = document.getElementById('convert-loader');
  if (!o) {
    o = document.createElement('div');
    o.id = 'convert-loader';
    o.className = [
      'fixed inset-0 z-[1000]',
      'bg-black/60 backdrop-blur-sm',
      'flex flex-col items-center justify-center gap-3',
    ].join(' ');
    o.innerHTML = `
      <div class="relative">
        <div class="h-16 w-16 rounded-full border-8 border-white/20"></div>
        <div class="absolute inset-0 h-16 w-16 rounded-full border-8 border-transparent border-t-white animate-spin"></div>
      </div>
      <div class="text-zinc-900 dark:text-white/90 text-sm sm:text-base font-medium tracking-tight">${t('common.converting')}</div>
    `;
    document.body.append(o);
  }
}

function hideLoader() {
  const o = document.getElementById('convert-loader');
  if (o) o.remove();
}

/* =========================
   REORDER CPS ON CARD
   ========================= */
function updateCardNumbers() {
  const cards = Array.from(container.querySelectorAll('.checkpoint-card'));
  cards.forEach((card, idx) => {
    const circle = card.querySelector('.checkpoint-number');
    if (circle) {
      circle.textContent = idx;
    }
  });
}

function moveCard(i, offset) {
  const cards = Array.from(container.querySelectorAll('.checkpoint-card'));
  const targetIdx = i + offset;
  if (targetIdx < 0 || targetIdx >= cards.length) return;

  const card = cards[i];
  const other = cards[targetIdx];

  if (offset === -1) {
    container.insertBefore(card, other);
  } else {
    container.insertBefore(other, card);
  }

  swapDataModelEntries(i, targetIdx);

  updateCardNumbers();
  saveEditorSettings();
  renderMapSettingsWithModel(currentDataModel);
}

function swapDataModelEntries(i, j) {
  const m = currentDataModel;
  [m.checkpoints[i], m.checkpoints[j]] = [m.checkpoints[j], m.checkpoints[i]];
  [m.teleportMap[i], m.teleportMap[j]] = [m.teleportMap[j], m.teleportMap[i]];

  [m.killMap[i], m.killMap[j]] = [m.killMap[j], m.killMap[i]];
  [m.pinMap[i], m.pinMap[j]] = [m.pinMap[j], m.pinMap[i]];
  [m.abilityMap[i], m.abilityMap[j]] = [m.abilityMap[j], m.abilityMap[i]];

  [m.CustomPortalStart[i], m.CustomPortalStart[j]] = [
    m.CustomPortalStart[j],
    m.CustomPortalStart[i],
  ];
  [m.CustomPortalEndpoint[i], m.CustomPortalEndpoint[j]] = [
    m.CustomPortalEndpoint[j],
    m.CustomPortalEndpoint[i],
  ];
  [m.CustomPortalCP[i], m.CustomPortalCP[j]] = [m.CustomPortalCP[j], m.CustomPortalCP[i]];
  for (const banKey in m.banMap) {
    m.banMap[banKey] = m.banMap[banKey].map((idx) => {
      if (idx === i) return j;
      if (idx === j) return i;
      return idx;
    });
  }
  [m.originalIndices[i], m.originalIndices[j]] = [m.originalIndices[j], m.originalIndices[i]];
}

/* =========================
   RENDER DATA PARAMETERS
   ========================= */
function renderGlobalBans(fullText) {
  const globalBans = parseGlobalWorkshopBans(fullText);
  if (globalBans.length === 0) return null;

  const iconsContainer = document.createElement('div');
  iconsContainer.className = 'flex flex-wrap items-center gap-2';

  globalBans.forEach((banName) => {
    const span = document.createElement('span');
    span.textContent = uiBanLabel(banName);
    span.title = banName;
    span.className = [
      'px-2.5 py-1',
      'text-xs sm:text-[13px] font-medium',
      'rounded-full',
      'bg-white/80 dark:bg-zinc-900/70 text-zinc-800 dark:text-zinc-200',
      'border border-zinc-200/80 dark:border-white/10 shadow-sm',
      'hover:bg-zinc-800/70 transition',
    ].join(' ');
    iconsContainer.appendChild(span);
  });

  return iconsContainer;
}

function extractAllData(fullText) {
  const { checkpoints, teleportMap } = parseGlobalACheckpoints(fullText);

  const killNums = parseGlobalArrayNumbers(fullText, 'killballnumber');
  const Hpos = parseGlobalArrayVectors(fullText, 'H');
  const Iradius = parseGlobalArrayNumbers(fullText, 'I');

  const pinNums = parseGlobalArrayNumbers(fullText, 'pinballnumber');
  const TQpos = parseGlobalArrayVectors(fullText, 'TQ');
  const EditMode = parseGlobalArrayNumbers(fullText, 'EditMode');
  const TQ5 = parseGlobalArrayBooleans(fullText, 'TQ5');
  const TQ6 = parseGlobalArrayBooleans(fullText, 'TQ6');
  const BounceLock = parseGlobalArrayBooleans(fullText, 'BounceToggleLock');

  const DaoNums = parseGlobalArrayNumbers(fullText, 'Dao').map((n) => parseInt(n));
  const SHIFTNums = parseGlobalArrayNumbers(fullText, 'SHIFT').map((n) => parseInt(n));

  const BanMulti = parseGlobalArrayNumbers(fullText, 'BanMulti');
  const BanCreate = parseGlobalArrayNumbers(fullText, 'BanCreate');
  const BanDead = parseGlobalArrayNumbers(fullText, 'BanDead');
  const BanEmote = parseGlobalArrayNumbers(fullText, 'BanEmote');
  const BanClimb = parseGlobalArrayNumbers(fullText, 'BanClimb');
  const BanBhop = parseGlobalArrayNumbers(fullText, 'BanBhop');
  const BanStand = parseGlobalArrayNumbers(fullText, 'BanStand');
  const BanDjump = parseGlobalArrayNumbers(fullText, 'BanDjump');
  const BanSaveDouble = parseGlobalArrayNumbers(fullText, 'BanSaveDouble');

  const allStarts = parseGlobalArrayVectors(fullText, 'CustomPortalStart');
  const allEnds = parseGlobalArrayVectors(fullText, 'CustomPortalEndpoint');
  const allCPs = parseGlobalArrayNumbers(fullText, 'CustomPortalCP').map((n) => parseInt(n, 10));

  const killMap = {};
  killNums.forEach((chkNum, i) => {
    if (!killMap[chkNum]) killMap[chkNum] = [];
    killMap[chkNum].push({
      pos: Hpos[i] || { x: 0, y: 0, z: 0 },
      radius: Iradius[i] != null ? Iradius[i] : null,
    });
  });

  const pinMap = {};
  pinNums.forEach((chkNum, i) => {
    if (!pinMap[chkNum]) pinMap[chkNum] = [];
    pinMap[chkNum].push({
      pos: TQpos[i] || { x: 0, y: 0, z: 0 },
      force: EditMode[i] != null ? EditMode[i] : null,
      givesUlt5: TQ5[i] || false,
      givesUlt6: TQ6[i] || false,
      locked: BounceLock[i] || false,
    });
  });

  const abilityMap = {};
  DaoNums.forEach((chk) => {
    abilityMap[chk] = abilityMap[chk] || {};
    abilityMap[chk].ultimate = true;
  });
  SHIFTNums.forEach((chk) => {
    abilityMap[chk] = abilityMap[chk] || {};
    abilityMap[chk].dash = true;
  });

  const banMap = {
    Multi: BanMulti,
    Create: BanCreate,
    Dead: BanDead,
    Emote: BanEmote,
    Climb: BanClimb,
    Bhop: BanBhop,
    Stand: BanStand,
    Djump: BanDjump,
    SaveDouble: BanSaveDouble,
  };

  const portalMap = {};
  allStarts.forEach((start, i) => {
    const end = allEnds[i] || { x: 0, y: 0, z: 0 };
    const cp = Number.isFinite(allCPs[i]) ? allCPs[i] : 0;
    if (!portalMap[cp]) portalMap[cp] = [];
    portalMap[cp].push({ start, end, cp });
  });

  const CustomPortalStart = [];
  const CustomPortalEndpoint = [];
  const CustomPortalCP = [];

  (checkpoints || []).forEach((_, i) => {
    const list = portalMap[i] || [];
    CustomPortalStart[i] = list.map((p) => p.start);
    CustomPortalEndpoint[i] = list.map((p) => p.end);
    CustomPortalCP[i] = list.length > 0 ? list[0].cp : i;
  });

  return {
    checkpoints,
    killMap,
    pinMap,
    abilityMap,
    banMap,
    portalMap,
    teleportMap,
    CustomPortalStart,
    CustomPortalEndpoint,
    CustomPortalCP,
    originalIndices: checkpoints.map((_, idx) => idx),
  };
}

function createCheckpointCard(idx, coords, data) {
  const { killMap, pinMap, abilityMap, banMap, portalMap } = data;
  const originalIndex = data.originalIndices ? data.originalIndices[idx] : idx;

  // Carte
  const card = document.createElement('div');
  card.className = [
    'checkpoint-card group relative',
    'rounded-2xl border border-zinc-200/80 dark:border-white/10',
    'shadow-sm transition',
    'hover:ring-2 hover:ring-emerald-500/40 hover:border-emerald-500/30 hover:shadow-md',
    'select-none mb-3'
  ].join(' ');
  card.draggable = true;
  card.dataset.original = originalIndex;

  const inner = document.createElement('div');
  inner.className = 'rounded-2xl p-4 sm:p-5 backdrop-blur-lg ring-1 ring-white/5 bg-gradient-to-b from-zinc-900/70 to-zinc-900/40';
  card.appendChild(inner);

  // Header
  const header = document.createElement('div');
  header.className = 'checkpoint-header flex items-center justify-between gap-4';
  inner.appendChild(header);

  const leftGroup = document.createElement('div');
  leftGroup.className = 'checkpoint-header__left flex items-center gap-3';
  header.appendChild(leftGroup);

  // Current order
  const numberCircle = document.createElement('div');
  numberCircle.className = [
    'checkpoint-number',
    'h-9 w-9 rounded-full',
    'bg-zinc-800/90 text-zinc-900 dark:text-zinc-100',
    'border border-zinc-200/80 dark:border-white/10 ring-1 ring-zinc-300/60 dark:ring-white/10 shadow-inner',
    'flex items-center justify-center font-semibold'
  ].join(' ');
  numberCircle.textContent = originalIndex;
  leftGroup.appendChild(numberCircle);

  const coordsInline = document.createElement('div');
  coordsInline.className = 'coords-inline font-mono tabular-nums text-[13px] sm:text-sm text-zinc-700 dark:text-zinc-300/90 tracking-tight';
  coordsInline.textContent = `${coords.x.toFixed(3)}, ${coords.y.toFixed(3)}, ${coords.z.toFixed(3)}`;
  leftGroup.appendChild(coordsInline);

  const rightGroup = document.createElement('div');
  rightGroup.className = 'checkpoint-header__right flex items-center gap-2 sm:gap-3';
  header.appendChild(rightGroup);

  // Counter
  const makeBadge = (label) => {
    const b = document.createElement('span');
    b.className = 'inline-flex items-center gap-1 rounded-full border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 px-2 py-0.5 text-[11px] text-zinc-800 dark:text-zinc-200';
    b.textContent = label;
    return b;
  };
  const killsCount   = (killMap[idx]   || []).length;
  const pinsCount    = (pinMap[idx]    || []).length;
  const portalsCount = (portalMap[idx] || []).length;
  if (killsCount)   rightGroup.appendChild(makeBadge(`KO ${killsCount}`));
  if (pinsCount)    rightGroup.appendChild(makeBadge(`BO ${pinsCount}`));
  if (portalsCount) rightGroup.appendChild(makeBadge(`TP ${portalsCount}`));

  // Bans compacts
  const banIconsHdr = document.createElement('div');
  banIconsHdr.className = 'hidden sm:flex items-center gap-1 text-xs opacity-75 group-hover:opacity-100 transition';
  rightGroup.appendChild(banIconsHdr);

  const banList = [
    { arr: banMap.Multi,      icon: '∞' },
    { arr: banMap.Create,     icon: '♂' },
    { arr: banMap.Stand,      icon: '♠' },
    { arr: banMap.Dead,       icon: 'X' },
    { arr: banMap.Emote,      icon: '♥' },
    { arr: banMap.Climb,      icon: '↑' },
    { arr: banMap.Bhop,       icon: '≥' },
    { arr: banMap.Djump,      icon: '»' },
    { arr: banMap.SaveDouble, icon: '△' },
  ];
  banList.forEach(({ arr, icon }) => {
    if (arr.includes(idx)) {
      const s = document.createElement('span');
      s.className = 'px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-300';
      s.textContent = icon;
      banIconsHdr.appendChild(s);
    }
  });

  const originalLabel = document.createElement('div');
  originalLabel.className = 'original-label text-[11px] text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5';
  originalLabel.textContent = t('map_data.original_position', { index: originalIndex });
  rightGroup.appendChild(originalLabel);

  // Click to edit
  card.addEventListener('click', () => {
    if (!isEditMode) return;
    openEditModal(idx);
  });

  // Helpers
  const mkSection = (titleTxt) => {
    const s = document.createElement('div');
    s.className = 'section mt-3 pt-3 border-t border-zinc-200/80 dark:border-white/10';
    const title = document.createElement('div');
    title.className = 'section__title text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-2';
    title.textContent = titleTxt;
    s.appendChild(title);
    return s;
  };
  const mkDot = (fillClass = 'bg-zinc-400') => {
    const colorClass = fillClass.startsWith('bg-')
      ? fillClass.replace(/^bg-/, 'text-')
      : fillClass;

    const wrap = document.createElement('span');
    wrap.className = [
      'inline-flex items-center justify-center',
      'h-4 w-4 shrink-0',
      'transition-transform duration-200 ease-out group-hover:scale-[1.06]'
    ].join(' ');

    const uid = Math.random().toString(36).slice(2, 8);
    const NS = 'http://www.w3.org/2000/svg';

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 20 20');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('class', colorClass);

    svg.innerHTML = `
      <defs>
        <radialGradient id="g-${uid}" cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stop-color="white"        stop-opacity="0.90"/>
          <stop offset="35%"  stop-color="currentColor" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="currentColor" stop-opacity="1.00"/>
        </radialGradient>
        <filter id="f-${uid}" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="b"/>
        </filter>
      </defs>

      <circle cx="10" cy="10" r="6.2" fill="currentColor" opacity="0.12" filter="url(#f-${uid})"></circle>
      <circle cx="10" cy="10" r="7.4" fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.1"></circle>
      <circle cx="10" cy="10" r="5.6" fill="url(#g-${uid})"></circle>

      <path d="M5.4 8.2a5.8 5.8 0 0 1 4.6-3.4" fill="none" stroke="white"
            stroke-opacity="0.55" stroke-linecap="round" stroke-width="1.1"></path>
    `;

    wrap.appendChild(svg);
    return wrap;
  };
  const mkDetail = () => {
    const d = document.createElement('div');
    d.className = 'detail flex items-center gap-2 text-[13px] sm:text-sm text-zinc-700 dark:text-zinc-300';
    return d;
  };

  // Teleport
  const tp = data.teleportMap[idx];
  if (tp) {
    const sec = mkSection(t('map_data.teleport'));
    const item = mkDetail();
    item.append(
      mkDot('bg-fuchsia-500'),
      (() => {
        const sx = coords.x.toFixed(3), sy = coords.y.toFixed(3), sz = coords.z.toFixed(3);
        const ex = tp.end.x.toFixed(3), ey = tp.end.y.toFixed(3), ez = tp.end.z.toFixed(3);
        const span = document.createElement('span');
        span.className = 'detail__text';
        span.textContent = t('map_data.from_to', { sx, sy, sz, ex, ey, ez });
        return span;
      })()
    );
    sec.appendChild(item);
    inner.appendChild(sec);
  }

  // Kill orbs
  const kills = killMap[idx] || [];
  if (kills.length) {
    const sec = mkSection(t('map_data.kill_orbs'));
    const wrap = document.createElement('div');
    wrap.className = 'section__items space-y-1';
    kills.forEach((kb) => {
      const item = mkDetail();
      item.append(
        mkDot('bg-sky-400'),
        (() => {
          const px = kb.pos.x.toFixed(3), py = kb.pos.y.toFixed(3), pz = kb.pos.z.toFixed(3);
          const r = kb.radius != null ? kb.radius : 'N/A';
          const s = document.createElement('span');
          s.className = 'detail__text';
          s.textContent = t('map_data.position_radius', { px, py, pz, r });
          return s;
        })()
      );
      wrap.appendChild(item);
    });
    sec.appendChild(wrap);
    inner.appendChild(sec);
  }

  const pins = pinMap[idx] || [];
  if (pins.length) {
    const sec = mkSection(t('map_data.bounce_orbs'));
    const wrap = document.createElement('div');
    wrap.className = 'section__items space-y-1';
    pins.forEach((pb) => {
      const item = mkDetail();
      item.append(
        mkDot(pb.locked ? 'bg-orange-400' : 'bg-emerald-400'),
        (() => {
          const px = pb.pos.x.toFixed(3), py = pb.pos.y.toFixed(3), pz = pb.pos.z.toFixed(3);
          const f = pb.force != null ? pb.force : 'N/A';
          const s = document.createElement('span');
          s.className = 'detail__text';
          s.textContent = t('map_data.pin_info', {
            x: px, y: py, z: pz, f,
            locked: pb.locked ? t('map_data.true') : t('map_data.false'),
          });
          return s;
        })(),

        (() => {
          const box = document.createElement('span');
          box.className = 'pinball-icons inline-flex items-center gap-2 ml-2';
          if (pb.givesUlt5) {
            const i = document.createElement('img');
            i.src = cdnAsset('assets/abilities/ultimate.webp');
            i.alt = 'Ultimate';
            i.title = 'Donne Ultime';
            i.className = 'pinball-icon h-5 w-5';
            box.appendChild(i);
          }
          if (pb.givesUlt6) {
            const i = document.createElement('img');
            i.src = cdnAsset('assets/abilities/dash.webp');
            i.alt = 'Dash';
            i.title = 'Donne Dash';
            i.className = 'pinball-icon h-5 w-5';
            box.appendChild(i);
          }
          return box;
        })(),

        (() => {
          if (!pb.locked) return document.createDocumentFragment();
          const chip = document.createElement('span');
          chip.className =
            'ml-1 inline-flex items-center justify-center rounded-md ' +
            'border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 p-1 text-zinc-700 dark:text-zinc-300';
          const icon = createLockIcon('h-4 w-4');
          chip.appendChild(icon);
          return chip;
        })()
      );
      wrap.appendChild(item);
    });
    sec.appendChild(wrap);
    inner.appendChild(sec);
  }

  // Portals
  const portals = portalMap[idx] || [];
  if (portals.length) {
    const sec = mkSection(t('map_data.portals'));
    const wrap = document.createElement('div');
    wrap.className = 'section__items space-y-1';
    portals.forEach((p) => {
      const item = mkDetail();
      item.append(
        mkDot('bg-fuchsia-500'),
        (() => {
          const sx = p.start.x.toFixed(3), sy = p.start.y.toFixed(3), sz = p.start.z.toFixed(3);
          const ex = p.end.x.toFixed(3),   ey = p.end.y.toFixed(3),   ez = p.end.z.toFixed(3);
          const s = document.createElement('span');
          s.className = 'detail__text';
          s.textContent = t('map_data.from_to', { sx, sy, sz, ex, ey, ez });
          return s;
        })()
      );
      wrap.appendChild(item);
    });
    sec.appendChild(wrap);
    inner.appendChild(sec);
  }

  // Abilities (checkpoint)
  const abilities = abilityMap[idx] || {};
  if (abilities.ultimate || abilities.dash) {
    const sec = mkSection(t('map_data.abilities'));
    const box = document.createElement('div');
    box.className = 'ability-icons inline-flex items-center gap-2';
    if (abilities.ultimate) {
      const imgU = document.createElement('img');
      imgU.src = cdnAsset('assets/abilities/ultimate.webp');
      imgU.alt = 'Ultimate';
      imgU.title = 'Ultimate available';
      imgU.className = 'ability-icon h-6 w-6';
      box.appendChild(imgU);
    }
    if (abilities.dash) {
      const imgD = document.createElement('img');
      imgD.src = cdnAsset('assets/abilities/dash.webp');
      imgD.alt = 'Dash';
      imgD.title = 'Dash available';
      imgD.className = 'ability-icon h-6 w-6';
      box.appendChild(imgD);
    }
    sec.appendChild(box);
    inner.appendChild(sec);
  }

  // Bans
  const hasAnyBan = banList.some(({ arr }) => arr.includes(idx));
  if (hasAnyBan) {
    const sec = mkSection(t('map_data.bans'));
    const row = document.createElement('div');
    row.className = 'ban-icons flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300';
    banList.forEach(({ arr, icon }) => {
      if (arr.includes(idx)) {
        const s = document.createElement('span');
        s.className = 'ban-icon px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-300';
        s.textContent = icon;
        s.title = 'Ban';
        row.appendChild(s);
      }
    });
    sec.appendChild(row);
    inner.appendChild(sec);
  }

  // Drag & reorder
  card.addEventListener('dragstart', function (e) {
    if (!isEditMode) { e.preventDefault(); return; }
    draggedCard = this;
    draggedIndex = idx;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  });
  card.addEventListener('dragover', function (e) {
    if (!isEditMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  });
  card.addEventListener('drop', function (e) {
    if (!isEditMode) return;
    e.stopPropagation();
    if (!draggedCard || draggedCard === this) return;
    const rect = this.getBoundingClientRect();
    const halfway = rect.top + rect.height / 2;
    if (e.clientY < halfway) {
      container.insertBefore(draggedCard, this);
    } else {
      if (this.nextSibling) container.insertBefore(draggedCard, this.nextSibling);
      else container.appendChild(draggedCard);
    }
    const cards = Array.from(container.querySelectorAll('.checkpoint-card'));
    const newIndex = cards.indexOf(draggedCard);
    swapDataModelEntries(draggedIndex, newIndex);
    updateCardNumbers();
    saveEditorSettings();
    renderMapSettingsWithModel(currentDataModel);
    draggedCard = null;
    draggedIndex = null;
  });
  card.addEventListener('dragend', () => { draggedCard = null; });

  // Move controls
  const moveControls = document.createElement('div');
  moveControls.className = 'move-controls mt-3 flex items-center gap-2';
  const baseBtn =
    'inline-flex items-center justify-center gap-1 rounded-lg border border-zinc-200/80 dark:border-white/10 ' +
    'bg-zinc-800/70 px-2.5 py-1 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 ' +
    'hover:bg-zinc-700/70 hover:border-emerald-500/30 hover:text-emerald-300 ' +
    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ' +
    'disabled:opacity-40 disabled:cursor-not-allowed transition';
  const upBtn = document.createElement('button');
  upBtn.type = 'button';
  upBtn.textContent = '↑';
  upBtn.title = t('map_data.move_up');
  upBtn.className = baseBtn;
  const downBtn = document.createElement('button');
  downBtn.type = 'button';
  downBtn.textContent = '↓';
  downBtn.title = t('map_data.move_down');
  downBtn.className = baseBtn;
  moveControls.append(upBtn, downBtn);
  inner.appendChild(moveControls);

  const toggleMoveButtons = () => {
    upBtn.disabled = !isEditMode;
    downBtn.disabled = !isEditMode;
  };
  toggleMoveButtons();

  upBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!isEditMode) return;
    moveCard(idx, -1);
  });
  downBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!isEditMode) return;
    moveCard(idx, +1);
  });

  return card;
}

function renderMapSettings(fullText) {
  const container = document.getElementById('mapSettings');
  lastFullText = fullText;

  lastParsedWorkshopSettings = parseWorkshopSettings(fullText);

  const globalInfos = container.querySelector('.global-infos');
  globalInfos.innerHTML = '';
  globalInfos.className = 'global-infos mb-5 flex flex-col gap-3';

  let bansContainer = globalInfos.querySelector('.global-bans');
  if (!bansContainer) {
    bansContainer = document.createElement('div');
    bansContainer.className = 'global-bans';
    globalInfos.appendChild(bansContainer);
  }

  let settingsButtons = globalInfos.querySelector('.settings-buttons');
  if (!settingsButtons) {
    settingsButtons = document.createElement('div');
    settingsButtons.className = 'settings-buttons flex items-center gap-2';
    globalInfos.appendChild(settingsButtons);
  } else {
    settingsButtons.innerHTML = '';
  }

  // Edit mode btn
  let editModeBtn = document.getElementById('editModeBtn');
  if (!editModeBtn) {
    editModeBtn = document.createElement('button');
    editModeBtn.id = 'editModeBtn';
  }
  editModeBtn.textContent = isEditMode ? t('map_data.exit_edit') : t('map_data.edit_mode');
  editModeBtn.className = [
    'rounded-full cursor-pointer px-3 py-1.5 text-sm font-medium',
    'bg-blue-500 text-zinc-900 dark:text-white hover:bg-blue-600',
    'shadow-sm transition',
  ].join(' ');

  if (editModeBtn.dataset.listenerInstalled !== 'true') {
    editModeBtn.dataset.listenerInstalled = 'true';
    editModeBtn.addEventListener('click', () => {
      isEditMode = !isEditMode;
      editModeBtn.textContent = isEditMode ? t('map_data.exit_edit') : t('map_data.edit_mode');
      setCardEditInteractivity(isEditMode);
    });
  }
  settingsButtons.appendChild(editModeBtn);

  // Global settings btn
  let globalSettingsBtn = document.getElementById('globalSettingsBtn');
  if (!globalSettingsBtn) {
    globalSettingsBtn = document.createElement('button');
    globalSettingsBtn.id = 'globalSettingsBtn';
    globalSettingsBtn.addEventListener('click', openGlobalSettingsModal);
  }
  globalSettingsBtn.textContent = t('map_data.global_settings');
  globalSettingsBtn.className = [
    'rounded-full cursor-pointer px-3 py-1.5 text-sm font-medium',
    'bg-white/80 dark:bg-zinc-900/70 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-800/70',
    'border border-zinc-200/80 dark:border-white/10 shadow-sm transition',
  ].join(' ');
  settingsButtons.appendChild(globalSettingsBtn);

  // Bans
  bansContainer.innerHTML = '';
  const bansIconsEl = renderGlobalBans(fullText);
  if (bansIconsEl) {
    bansContainer.appendChild(bansIconsEl);
    globalInfos.classList.remove('no-bans');
  } else {
    globalInfos.classList.add('no-bans');
  }

  // Clean & render cards
  Array.from(container.children).forEach((child) => {
    if (child !== globalInfos) container.removeChild(child);
  });

  const dataModel = extractAllData(fullText);
  currentDataModel = dataModel;

  if (dataModel.checkpoints.length === 0) {
    const msg = document.createElement('p');
    msg.textContent = 'No map data found';
    msg.className = 'empty-message text-zinc-600 dark:text-zinc-400';
    container.appendChild(msg);
    return;
  }

  dataModel.checkpoints.forEach((coords, idx) => {
    const card = createCheckpointCard(idx, coords, dataModel);
    container.appendChild(card);
  });

  updateCardNumbers();
  setCardEditInteractivity(isEditMode);
}

function temporaryReplace(text) {
  if (!text) return text;
  return text.replace(/(设置不可见\(\s*事件玩家\s*,\s*)无(\s*\);)/g, '$1全部禁用$2');
}

/* =========================
   DO CONVERT (utilise common API)
   ========================= */
async function doConvert(fullText, lang) {
  __lastTranslateCtx = { used: false, sourceLang: null, targetLang: null };

  const lobbyBlock = extractLobbyBlock(fullText, lang);
  let mapDataBlock = extractMapDataBlock(fullText, lang);
  mapDataBlock = sanitizeMapDataAssignments(mapDataBlock);
  const workshopSettingsBlock = extractWorkshopSettings(fullText);
  const isValidatorOn = parseBasicMapValidator(fullText);
  debug('Bloc "actions" de Map Data extrait.');

  let tpl = await loadTemplate(lang);
  debug('Template chargé.');

  const newRule = buildRule(mapDataBlock, lang);
  tpl = replaceMapData(tpl, newRule, lang);

  const modeMapNames = extractModeMapNames(fullText);
  debug('Modes & maps extraits : ' + JSON.stringify(modeMapNames));
  for (const [modeName, fullMapEntry] of Object.entries(modeMapNames)) {
    tpl = insertMapNameIntoTemplate(tpl, modeName, fullMapEntry, lang);
  }

  try {
    const creditsActions = extractCreditsActions(fullText, lang);
    debug('Bloc Credits (actions) extrait.');
    tpl = insertCreditsActionsIntoTemplate(tpl, creditsActions, lang);
  } catch (e) {
    debug('Aucun bloc Credits trouvé : ' + e.message);
  }

  if (lobbyBlock) {
    tpl = insertLobbyIntoTemplate(tpl, lobbyBlock, lang);
  }

  if (workshopSettingsBlock) {
    tpl = insertWorkshopSettings(tpl, workshopSettingsBlock, lang);
  }

  const localized = getLocalizedOnOff(lang);
  const canonicalBans = standardizeWorkshopBansForTemplate(fullText);
  if (canonicalBans.length) {
    tpl = applyWorkshopBansUpdate(tpl, lang, canonicalBans, localized, lastParsedWorkshopSettings);
  }

  const sourceDiffValue = extractDifficultyValue(fullText);
  tpl = applyDifficultyIndexToTemplate(tpl, sourceDiffValue);
  tpl = ensureDifficultyHudInWorkshop(tpl, lang, sourceDiffValue);

  tpl = insertBasicMapValidator(tpl, lang, !isValidatorOn);
  tpl = temporaryReplace(tpl);

  return tpl;
}

/* =========================
   DO TRANSLATE (utilise common API)
   ========================= */
async function doTranslate(fullText, clientLang, targetLang) {
  try {
    __lastTranslateCtx = { used: true, sourceLang: clientLang, targetLang };

    lastParsedWorkshopSettings = parseWorkshopSettings(fullText);
    await loadAllTranslations();

    let lobbyBlock = extractLobbyBlock(fullText, clientLang);
    let mapDataBlock = extractMapDataBlock(fullText, clientLang);
    const modeMapNames = extractModeMapNames(fullText);
    let workshopSettingsBlock = extractWorkshopSettings(fullText);
    const sourceDiffValue = extractDifficultyValue(fullText, clientLang);

    let creditsBlock = '';
    try { creditsBlock = extractCreditsActions(fullText, clientLang); } catch (_) {}

    lobbyBlock = translateLobbyBlock(lobbyBlock, clientLang, targetLang);
    mapDataBlock = translateFromTo(mapDataBlock, clientLang, targetLang);
    mapDataBlock = sanitizeMapDataAssignments(mapDataBlock);
    creditsBlock = translateFromTo(creditsBlock, clientLang, targetLang);

    let tpl = await loadTemplate(targetLang);

    // Map data
    const newRule = buildRule(mapDataBlock, targetLang);
    tpl = replaceMapData(tpl, newRule, targetLang);

    // Modes / Maps
    for (const [modeNameLocalized, fullMapEntry] of Object.entries(modeMapNames)) {
      const modeKey = findModeKey(modeNameLocalized, clientLang);
      const targetModeName = getTargetModeName(modeKey, targetLang, modeNameLocalized);

      const tokens = fullMapEntry.trim().split(/\s+/);
      const mapId = tokens[tokens.length - 1];
      const rawMapName = tokens.slice(0, tokens.length - 1).join(' ');

      let translatedMapName = rawMapName;
      const mapKey = Object.keys(mapNamesTranslations || {}).find((key) => {
        const dict = mapNamesTranslations[key];
        return dict && (dict[clientLang] === rawMapName || dict['en-US'] === rawMapName);
      });
      if (mapKey) {
        const dict = mapNamesTranslations[mapKey] || {};
        translatedMapName = dict[targetLang] || dict['en-US'] || rawMapName;
      }

      const translatedEntry = `${translatedMapName} ${mapId}`;
      tpl = insertMapNameIntoTemplate(tpl, targetModeName, translatedEntry, targetLang);
    }

    if (lobbyBlock) tpl = insertLobbyIntoTemplate(tpl, lobbyBlock, targetLang);
    if (workshopSettingsBlock) {
      workshopSettingsBlock = translateWorkshopValuesOnly(workshopSettingsBlock, clientLang, targetLang);
      tpl = insertWorkshopSettings(tpl, workshopSettingsBlock, targetLang);
    }

    const localized = getLocalizedOnOff(targetLang);
    const canonicalBans = standardizeWorkshopBansForTemplate(fullText);
    if (canonicalBans.length) {
      tpl = applyWorkshopBansUpdate(tpl, targetLang, canonicalBans, localized, lastParsedWorkshopSettings);
    }

    if (creditsBlock) {
      tpl = insertCreditsActionsIntoTemplate(tpl, creditsBlock, targetLang);
    }

    const idx = sourceDiffValue;
    tpl = applyDifficultyIndexToTemplate(tpl, idx);
    tpl = ensureDifficultyHudInWorkshop(tpl, targetLang, idx);

    tpl = temporaryReplace(tpl);

    return tpl;
  } catch (e) {
    console.error('[doTranslate] error:', e);
    showErrorMessage('Translate failed: ' + e.message);
    return fullText;
  }
}

/* =========================
   GLOBAL SETTINGS MODAL
   ========================= */
function buildGlobalSettingsFormFields() {
  const form = document.getElementById('globalSettingsForm');
  if (!form) return;
  form.innerHTML = '';
  form.className = 'space-y-4';

  const rowMapName = document.createElement('div');
  rowMapName.className = 'modal-row space-y-2';
  rowMapName.innerHTML = `
    <label for="mapNameInput" class="modal-label block text-sm font-semibold text-zinc-800 dark:text-zinc-200">${t('map_data.map_name')}</label>
    <div class="map-name-input-wrapper grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
      <div class="map-name-text-wrapper relative">
        <input type="text" id="mapNameInput" class="modal-input2 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
        <div class="map-name-suggestions-container absolute left-0 right-0 top-[110%] z-10 hidden rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 shadow-lg"></div>
      </div>

      <!-- DROPDOWN CUSTOM DE VARIANTE -->
      <div id="mapVariantDropdown" class="custom-dd relative">
        <button type="button"
          class="custom-dd-trigger w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-left text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-between"
          aria-haspopup="listbox" aria-expanded="false">
          <span class="custom-dd-label truncate flex items-center gap-2">Default</span>
          <svg viewBox="0 0 24 24" class="ml-2 h-4 w-4 text-zinc-600 dark:text-zinc-400"><path fill="currentColor" d="M7 10l5 5 5-5z"></path></svg>
        </button>
        <div class="custom-dd-list absolute left-0 right-0 mt-1 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl z-20 max-h-60 overflow-auto hidden" role="listbox"></div>
      </div>

      <!-- Fallback natif si tu préfères : 
      <select id="mapVariantSelect" class="modal-select2 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 hidden"></select>
      -->
    </div>
  `;
  form.appendChild(rowMapName);

  const rowGlobalBans = document.createElement('div');
  rowGlobalBans.className = 'modal-row space-y-2';
  rowGlobalBans.innerHTML = `
    <label class="modal-label block text-sm font-semibold text-zinc-800 dark:text-zinc-200">${t('map_data.global_bans')}</label>
    <div id="globalBansContainer" class="bans-container grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2"></div>
  `;
  form.appendChild(rowGlobalBans);

  const mkSelectRow = (forId, labelKey, optionsHtml) => {
    const row = document.createElement('div');
    row.className = 'modal-row space-y-2';
    row.innerHTML = `
      <label for="${forId}" class="modal-label block text-sm font-semibold text-zinc-800 dark:text-zinc-200">${t(labelKey)}</label>
      <select id="${forId}" class="modal-select rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500">
        ${optionsHtml}
      </select>
    `;
    return row;
  };

  form.appendChild(
    mkSelectRow(
      'editorModeToggle',
      'map_data.editor_mode',
      `<option value="off">${t('map_data.off')}</option><option value="on">${t('map_data.on')}</option>`
    )
  );

  form.appendChild(
    mkSelectRow(
      'difficultyHUDSelect',
      'map_data.difficulty_displayHUD',
      `
      <option value="playtest">${t('map_data.playtest')}</option>
      <option value="easy-">Easy −</option><option value="easy">Easy</option><option value="easy+">Easy +</option>
      <option value="medium-">Medium −</option><option value="medium">Medium</option><option value="medium+">Medium +</option>
      <option value="hard-">Hard −</option><option value="hard">Hard</option><option value="hard+">Hard +</option>
      <option value="veryhard-">Very hard −</option><option value="veryhard">Very hard</option><option value="veryhard+">Very hard +</option>
      <option value="extreme-">Extreme −</option><option value="extreme">Extreme</option><option value="extreme+">Extreme +</option>
      <option value="hell">Hell</option>
      <option value="off">${t('map_data.dont_display')}</option>
    `
    )
  );

  form.appendChild(
    mkSelectRow(
      'playtestToggle',
      'map_data.playtest_display',
      `<option value="off">${t('map_data.off')}</option><option value="on">${t('map_data.on')}</option>`
    )
  );

  form.appendChild(
    mkSelectRow(
      'validatorToggle',
      'map_data.basic_validator',
      `<option value="off">${t('map_data.off')}</option><option value="on">${t('map_data.on')}</option>`
    )
  );

  form.appendChild(
    mkSelectRow(
      'portalsToggle',
      'map_data.enable_portals',
      `<option value="off">${t('map_data.off')}</option><option value="on">${t('map_data.on')}</option>`
    )
  );

  const rowButtons = document.createElement('div');
  rowButtons.className = 'modal-buttons2 mt-2 flex items-center justify-end gap-2';
  rowButtons.innerHTML = `
    <button type="button" id="saveGlobalChangesBtn" class="rounded-xl cursor-pointer bg-emerald-600 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-white hover:bg-emerald-500 shadow-sm">${t('map_data.save')}</button>
    <button type="button" id="cancelGlobalChangesBtn" class="rounded-xl cursor-pointer border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-800/70">${t('map_data.cancel')}</button>
  `;
  form.appendChild(rowButtons);
    if (form && !form.dataset.gsDelegated) {
    form.dataset.gsDelegated = 'true';
    form.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.id === 'saveGlobalChangesBtn') {
        e.preventDefault();
        return saveGlobalSettings();
      }
      if (t && t.id === 'cancelGlobalChangesBtn') {
        e.preventDefault();
        return closeGlobalSettingsModal();
      }
    });
  }
}

function addGlobalSettingsButton() {
  const container = document.getElementById('mapSettings');
  const globalInfos = container.querySelector('.global-infos .settings-buttons');
  if (!globalInfos) return;
  if (document.getElementById('globalSettingsBtn')) return;

  const btn = document.createElement('button');
  btn.id = 'globalSettingsBtn';
  btn.textContent = t('map_data.global_settings');
  btn.className =
    'rounded-xl px-3 py-1.5 text-sm font-medium bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-700 border border-zinc-200/80 dark:border-white/10';
  btn.addEventListener('click', openGlobalSettingsModal);
  globalInfos.appendChild(btn);
}

async function openGlobalSettingsModal() {
  const modal = document.getElementById('globalSettingsModal');
  if (!modal) return;

  buildGlobalSettingsFormFields();

  // ==== Panel =====================================================
  modal.classList.add('items-start', 'pt-16', 'px-4');
  const panel = [...modal.children].find((el) => el.tagName !== 'SCRIPT') || modal.firstElementChild;
  if (panel) {
    panel.className = [
      'relative',
      'max-h-[80vh] w-full max-w-2xl overflow-y-auto',
      'rounded-2xl shadow-2xl',
      'bg-gradient-to-b from-zinc-900/95 to-zinc-950/95',
      'border border-zinc-200/80 dark:border-white/10 ring-1 ring-white/5',
      'backdrop-blur-lg p-5'
    ].join(' ');

    const deco = document.createElement('div');
    deco.className = 'pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent';
    panel.prepend(deco);

    const title = panel.querySelector('h3, .modal-title');
    if (title) {
      title.classList.add(
        'text-left', 'sticky', 'top-0', 'z-10',
        'bg-white/95 dark:bg-zinc-900/95', 'backdrop-blur',
        'pb-3', 'mb-3',
        'border-b', 'border-zinc-200/80 dark:border-white/10'
      );
    }
  }

  // ==== Lang visibles/source (convert/translate) ===========================
  function getLangs() {
    if (typeof __lastTranslateCtx !== 'undefined' && __lastTranslateCtx && __lastTranslateCtx.used) {
      return { visibleLang: __lastTranslateCtx.targetLang || 'en-US', sourceLang: __lastTranslateCtx.sourceLang || 'en-US' };
    }
    const l = document.getElementById('lang')?.value || 'en-US';
    return { visibleLang: l, sourceLang: l };
  }
  const { visibleLang, sourceLang } = getLangs();

  const modeMapNames = extractModeMapNames(lastFullText || '');
  const fullEntries = Object.values(modeMapNames);

  const form = document.getElementById('globalSettingsForm');
  if (form) form.setAttribute('autocomplete', 'off');
  const mapNameInput = document.getElementById('mapNameInput');
  mapNameInput?.setAttribute('autocomplete', 'off');

  // ==== UI helpers ============================================================
  const selectCls = 'rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500';
  const inputCls  = selectCls;
  const chipBase  = 'inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors';
  const chipIdle  = 'border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-800/70';
  const chipOn    = 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20';
  const sectionCls= 'space-y-4';
  const titleCls  = 'text-sm font-semibold text-zinc-800 dark:text-zinc-200';

  const enhanceSelect = (el) => el && el.classList.add(...selectCls.split(' '));
  const enhanceInput  = (el) => el && el.classList.add(...inputCls.split(' '));

  // Dropdown custom
  const variantDD = (typeof getVariantDropdownAPI === 'function')
    ? getVariantDropdownAPI()
    : (function () {
        const sel = document.getElementById('mapVariantSelect');
        if (sel) enhanceSelect(sel);
        return {
          type: 'native',
          root: sel,
          open(){}, close(){},
          getValue(){ return sel?.value || 'default'; },
          setValue(k){ if (sel) sel.value = k; },
          setOptions(options, selectedKey){
            if (!sel) return;
            sel.innerHTML = '';
            options.forEach(opt => {
              const o = document.createElement('option');
              o.value = opt.key;
              o.textContent = (typeof labelizeVariantKey === 'function')
                ? labelizeVariantKey(opt.key, visibleLang, opt.label)
                : (opt.label || opt.key);
              if (opt.key === selectedKey) o.selected = true;
              sel.appendChild(o);
            });
            if (!sel.value && options[0]) sel.value = options[0].key;
          },
          initEvents(){},
        };
      })();

  await loadMapNameTranslations();

  // ==== Helpers ===============================================================
  function findMapKeyByName(nameStr) {
    if (!nameStr) return null;
    const needle = String(nameStr).toLowerCase();

    for (const key of Object.keys(mapNamesTranslations || {})) {
      const dict = mapNamesTranslations[key] || {};
      const shown = (dict[visibleLang] || dict['en-US'] || '').toLowerCase();
      if (shown && shown === needle) return key;
    }
    for (const key of Object.keys(mapNamesTranslations || {})) {
      const dict = mapNamesTranslations[key] || {};
      const src = (dict[sourceLang] || dict['en-US'] || '').toLowerCase();
      if (src && src === needle) return key;
    }
    return null;
  }

  function labelizeVariant(key, providedLabel) {
    if (typeof labelizeVariantKey === 'function') {
      return labelizeVariantKey(key, visibleLang, providedLabel);
    }
    if (providedLabel) return providedLabel;
    if (String(key).toLowerCase() === 'default') {
      const map = { 'fr-FR': 'Par défaut', 'de-DE': 'Standard', 'es-ES': 'Predeterminado', 'pt-BR': 'Padrão' };
      return map[visibleLang] || 'Default';
    }
    return String(key).replace(/[-_]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, c => c.toUpperCase());
  }

  function buildVariantOptions(mapKey, selectedId) {
    const variants = (mapNamesTranslations[mapKey]?.variants) || {};
    const labelsDict =
      (mapNamesTranslations[mapKey]?.variantLabels?.[visibleLang]) ||
      (mapNamesTranslations[mapKey]?.variantLabels?.['en-US']) ||
      {};

    const opts = Object.entries(variants).map(([k, id]) => ({
      key: k,
      id,
      label: labelsDict[k] ? String(labelsDict[k]) : null
    }));

    let selectedKey = null;
    if (selectedId != null) {
      const byId = opts.find(o => String(o.id) === String(selectedId));
      if (byId) selectedKey = byId.key;
    }
    if (!selectedKey) {
      const hasDefault = opts.find(o => o.key === 'default');
      selectedKey = hasDefault ? 'default' : (opts[0]?.key || 'default');
    }
    return { opts, selectedKey };
  }

  function populateVariantsForMap(mapKey, selectedId) {
    if (!mapKey || !mapNamesTranslations[mapKey]) {
      variantDD.setOptions([{ key: 'default', id: null, label: labelizeVariant('default') }], 'default');
      return;
    }
    const { opts, selectedKey } = buildVariantOptions(mapKey, selectedId);
    variantDD.setOptions(opts, selectedKey);
  }

  // ==== Section: Map & Variant ==============================
  (function enhanceMapAndVariant() {
    const wrap = mapNameInput?.closest('.map-name-input-wrapper');
    if (wrap) {
      wrap.classList.add('relative', 'mb-2', 'space-y-2');
    }
    enhanceInput(mapNameInput);

  })();

  // map/variants
  if (fullEntries.length === 0) {
    if (mapNameInput) mapNameInput.value = '(No map name detected)';
    populateVariantsForMap(null, null);
  } else {
    const fullMapEntry = fullEntries[0].trim();
    const tokens = fullMapEntry.split(/\s+/);
    const rawId   = tokens[tokens.length - 1];
    const rawName = tokens.slice(0, -1).join(' ');

    let mapKeyFound = null;
    for (const key of Object.keys(mapNamesTranslations || {})) {
      const dict = mapNamesTranslations[key] || {};
      if (dict[sourceLang] === rawName || dict['en-US'] === rawName) { mapKeyFound = key; break; }
    }

    const displayRawName = mapKeyFound
      ? ((mapNamesTranslations[mapKeyFound][visibleLang]) || mapNamesTranslations[mapKeyFound]['en-US'] || rawName)
      : rawName;
    if (mapNameInput) mapNameInput.value = displayRawName;

    populateVariantsForMap(mapKeyFound, rawId);

    // Suggestions
    (function initMapNameSuggestions() {
      const wrapper = mapNameInput?.closest('.map-name-input-wrapper');
      if (!wrapper) return;

      let suggestionsContainer = wrapper.querySelector('.map-name-suggestions-container');
      if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.className =
          'map-name-suggestions-container absolute left-0 right-0 top-[110%] z-10 hidden rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 shadow-xl ring-1 ring-zinc-300/60 dark:ring-white/10';
        wrapper.appendChild(suggestionsContainer);
      }

      function clearSuggestions() {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.classList.add('hidden');
      }

      function addSuggestionRow(mapKey, label) {
        const item = document.createElement('div');
        item.className = 'suggestion-item cursor-pointer px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-800/70';
        item.textContent = label;
        item.addEventListener('mousedown', () => {
          mapNameInput.value = label;
          populateVariantsForMap(mapKey, null);
          clearSuggestions();
        });
        suggestionsContainer.appendChild(item);
      }

      mapNameInput.addEventListener('input', () => {
        const filter = mapNameInput.value.trim().toLowerCase();
        clearSuggestions();
        if (filter.length < 2) return;

        const matches = Object.entries(mapNamesTranslations || {})
          .filter(([, dict]) => ((dict[visibleLang] || dict['en-US'] || '') + '').toLowerCase().includes(filter))
          .slice(0, 5);

        if (!matches.length) return;
        matches.forEach(([mapKey, dict]) => {
          addSuggestionRow(mapKey, (dict[visibleLang] || dict['en-US']));
        });
        suggestionsContainer.classList.remove('hidden');
      });

      mapNameInput.addEventListener('blur', () => setTimeout(clearSuggestions, 100));
      mapNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const typed = mapNameInput.value.trim();
          const key = findMapKeyByName(typed);
          if (key) {
            populateVariantsForMap(key, null);
          }
          clearSuggestions();
        }
      });
    })();
  }

  // ==== Bans =========================
  const currentText = getCurrentWorkshopText();
  const activeBansCanonical = standardizeWorkshopBansForTemplate(currentText) || [];
  const activeKeys = new Set(activeBansCanonical.map(normalizeBanKey));

  const globalBansContainer = document.getElementById('globalBansContainer');
  if (globalBansContainer) {
    globalBansContainer.innerHTML = '';
    globalBansContainer.classList.add('mt-2', 'flex', 'flex-wrap', 'gap-2');

    const applyChipState = (labelEl, checked) => {
      labelEl.classList.remove(...chipIdle.split(' '), ...chipOn.split(' '));
      labelEl.classList.add(...chipBase.split(' '), ...(checked ? chipOn.split(' ') : chipIdle.split(' ')));
      labelEl.dataset.checked = checked ? 'true' : 'false';
    };

    GLOBAL_BANS.forEach((fullBanName) => {
      const key = normalizeBanKey(fullBanName);

      const label = document.createElement('label');
      label.dataset.banKey = key;
      label.dataset.banCanonical = fullBanName;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'global-ban-checkbox h-4 w-4 accent-emerald-600';
      checkbox.checked = activeKeys.has(key);

      const spanText = document.createElement('span');
      spanText.textContent = uiBanLabel(fullBanName);

      label.append(checkbox, spanText);
      applyChipState(label, checkbox.checked);
      checkbox.addEventListener('change', () => applyChipState(label, checkbox.checked));

      globalBansContainer.appendChild(label);
    });
  }

  // ==== HUD difficulty & Toggles ============================
  const difficultyHUDSelect = document.getElementById('difficultyHUDSelect');
  enhanceSelect(difficultyHUDSelect);

  ['editorModeToggle', 'validatorToggle', 'portalsToggle', 'playtestToggle', 'mapVariantSelect']
    .forEach((id) => enhanceSelect(document.getElementById(id)));

  const langForDiff = document.getElementById('lang')?.value || 'en-US';
  const diffValue = extractDifficultyValue(lastFullText || '', langForDiff);
  fillDifficultyFieldsFromValue(diffValue);

  document.getElementById('editorModeToggle').value = lastParsedWorkshopSettings.editorMode ? 'on' : 'off';
  document.getElementById('validatorToggle').value   = parseBasicMapValidator(lastFullText || '') ? 'on' : 'off';
  document.getElementById('portalsToggle').value     = lastParsedWorkshopSettings.portals ? 'on' : 'off';
  document.getElementById('playtestToggle').value    = lastParsedWorkshopSettings.playtest ? 'on' : 'off';

  if (form) form.classList.add('space-y-6', 'divide-y', 'divide-white/5');

  initGlobalSettingsDropdowns(modal);

  [
    'editorModeToggle',
    'difficultyHUDSelect',
    'playtestToggle',
    'validatorToggle',
    'portalsToggle',
    'mapVariantSelect',
  ].forEach((id) => {
    const el = modal.querySelector('#' + id);
    if (el) el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // ==== Footer =====================================================
  const closeSpan = document.querySelector('#globalSettingsModal .modal-close2');
  if (closeSpan) closeSpan.addEventListener('click', closeGlobalSettingsModal);

  window.addEventListener('click', onWindowClickForGlobalModal);
  showModal(modal);
}

function onWindowClickForGlobalModal(e) {
  const modal = document.getElementById('globalSettingsModal');
  if (e.target === modal) {
    closeGlobalSettingsModal();
  }
}

function closeGlobalSettingsModal() {
  const modal = document.getElementById('globalSettingsModal');
  if (modal) {
    hideModal(modal);
    window.removeEventListener('click', onWindowClickForGlobalModal);
  }
}

/* =========================
   GLOBAL SETTINGS SAVE
   ========================= */
function getNewActiveBans() {
  const canon = Array.from(document.querySelectorAll('#globalBansContainer label'))
    .filter(l => l.querySelector('.global-ban-checkbox')?.checked)
    .map(l => (l.dataset.banCanonical || '').trim())
    .filter(Boolean);

  return Array.from(new Set(canon));
}

function updateGlobalSettingsFromForm() {
  globalSettings.editorMode = document.getElementById('editorModeToggle').value === 'on';
  globalSettings.difficultyHUD = document.getElementById('difficultyHUDSelect').value;
  globalSettings.playtest = document.getElementById('playtestToggle').value;
  globalSettings.validator = document.getElementById('validatorToggle').value;
  globalSettings.portals = document.getElementById('portalsToggle').value;
}

function resolveMapKeyAndVariant() {
  const rawMapNameVisible = document.getElementById('mapNameInput').value.trim();
  const visibleLang = getActiveVisibleLang();
  const sourceLang  = getActiveSourceLang();

  // selected value
  const variantDD = getVariantDropdownAPI();
  const chosenVariantKey = variantDD.getValue();

  // find mapkey
  let mapKeyFound = null;
  for (const key of Object.keys(mapNamesTranslations || {})) {
    const dict = mapNamesTranslations[key] || {};
    const shown = (dict[visibleLang] || dict['en-US'] || '').toLowerCase();
    if (shown && shown === rawMapNameVisible.toLowerCase()) { mapKeyFound = key; break; }
  }
  if (!mapKeyFound) {
    for (const key of Object.keys(mapNamesTranslations || {})) {
      const dict = mapNamesTranslations[key] || {};
      const src = (dict[sourceLang] || dict['en-US'] || '').toLowerCase();
      if (src && src === rawMapNameVisible.toLowerCase()) { mapKeyFound = key; break; }
    }
  }

  let chosenVariantId = null;
  if (mapKeyFound) {
    const variants = (mapNamesTranslations[mapKeyFound].variants || {});
    chosenVariantId = variants[chosenVariantKey] || Object.values(variants)[0] || null;
  }

  return { rawMapNameVisible, mapKeyFound, chosenVariantId };
}

function getLocalizedOnOff(lang) {
  switch (lang) {
    case 'zh-CN': return { on: '开启', off: '关闭' };
    case 'ja-JP': return { on: 'オン', off: 'オフ' };
    case 'ko-KR': return { on: '활성화', off: '비활성화' };
    case 'ru-RU': return { on: 'Вкл.', off: 'Выкл.' };
    case 'es-MX': return { on: 'Activado', off: 'Desactivado' };
    case 'pt-BR': return { on: 'Ligado', off: 'Desligado' };
    case 'de-DE': return { on: 'Ein', off: 'Aus' };
    default:      return { on: 'On', off: 'Off' };
  }
}

function applyOnOffReplacements(text, localized, settings) {
  const editorVal = settings.editorMode ? localized.on : localized.off;
  const playtestVal = settings.playtest === 'on' ? localized.on : localized.off;
  const portalsVal = settings.portals === 'on' ? localized.on : localized.off;

  const RULES = [
    { label: 'Editor mode - 作图模式', value: editorVal },
    { label: 'Playtest display - 游戏测试', value: playtestVal },
    { label: 'enable portals control maps - 启用传送门 占点地图', value: portalsVal },
  ];

  const ON_OFF_WORD =
    '(?:on|off|开启|关闭|활성화|비활성화|вкл\\.|выкл\\.|activado|desactivado|ligado|desligado|ein|aus)';

  const reBlock = new RegExp(
    String.raw`(^[ \t]*(?:workshop|地图工坊|ワークショップ)\s*\{)([\s\S]*?)(^\s*\})`,
    'mi'
  );
  const m = reBlock.exec(text);

  const esc = (s) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

  if (m) {
    const pOpen = m[1];
    let inner = m[2];
    const pClose = m[3];

    const missingLines = [];
    for (const { label, value } of RULES) {
      const labelPat = esc(label).replace(/\s+/g, '\\s*');
      const reLine = new RegExp(
        String.raw`^([ \t]*)(${labelPat})\s*[:：]\s*${ON_OFF_WORD}\s*$`,
        'mi'
      );

      if (reLine.test(inner)) {
        inner = inner.replace(
          reLine,
          (full, indent, foundLabel) => `${indent}${foundLabel} : ${value}`
        );
      } else {
        missingLines.push({ label, value });
      }
    }

    if (missingLines.length === 0) {
      return text.slice(0, m.index) + pOpen + inner + pClose + text.slice(m.index + m[0].length);
    }

    let indent = '    ';
    const lines = inner.split(/\r?\n/);
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].trim() !== '') {
        const mm = lines[i].match(/^([ \t]*)/);
        if (mm && mm[1] != null) indent = mm[1];
        break;
      }
    }

    let newInner = inner;
    if (!/\n$/.test(newInner)) newInner += '\n';
    for (const { label, value } of missingLines) {
      newInner += `${indent}${label} : ${value}\n`;
    }

    return text.slice(0, m.index) + pOpen + newInner + pClose + text.slice(m.index + m[0].length);
  }

  const missingAtAll = RULES;
  if (missingAtAll.length > 0) {
    const lines = missingAtAll.map(({ label, value }) => `    ${label} : ${value}`).join('\n');
    const block = `workshop {\n${lines}\n}\n\n`;
    return block + text;
  }

  return text;
}

function applyValidatorToggle(text, clientLang, settings) {
  let disabledWord, ruleWord;
  switch (clientLang) {
    case 'zh-CN':
      disabledWord = '禁用';
      ruleWord = '规则';
      break;
    case 'ja-JP':
      disabledWord = '無効';
      ruleWord = 'ルール';
      break;
    case 'es-MX':
      disabledWord = 'deshabilitado';
      ruleWord = 'regla';
      break;
    case 'pt-BR':
      disabledWord = 'desabilitado';
      ruleWord = 'regra';
      break;
    case 'de-DE':
      disabledWord = 'deaktiviert';
      ruleWord = 'regel';
      break;
    default:
      disabledWord = 'disabled';
      ruleWord = 'rule';
  }

  const titlePattern = 'Addon\\s*\\|\\s*SUB\\s*Basic\\s*Map\\s*Validator[^"]*';
  if (settings.validator === 'on') {
    text = text.replace(
      new RegExp(
        `(?<=^[ \\t]*)${disabledWord}\\s+(${ruleWord}\\s*\\(\\s*"${titlePattern}"\\))`,
        'mi'
      ),
      '$1'
    );
  } else {
    text = text.replace(
      new RegExp(`(^[ \\t]*)(` + `${ruleWord}\\s*\\(\\s*"${titlePattern}"\\)` + `)`, 'mi'),
      `$1${disabledWord} $2`
    );
  }
  return text;
}

function applyDifficultyIndex(text, clientLang, settings) {
  let idx = DIFFICULTY_MAP.indexOf(settings.difficultyHUD);
  if (idx < 0) idx = DIFFICULTY_MAP.length - 1;

  let comboKeyword;
  switch (clientLang) {
    case 'zh-CN':
      comboKeyword = '地图工坊设置组合';
      break;
    case 'ja-JP':
      comboKeyword = 'ワークショップ設定コンボ';
      break;
    case 'es-MX':
      comboKeyword = 'Combinado de la configuración del Workshop';
      break;
    case 'pt-BR':
      comboKeyword = 'Caixa de Combinação de Configurações do Workshop';
      break;
    default:
      comboKeyword = 'Workshop Setting Combo';
  }

  const escapedKeyword = comboKeyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

  const re = new RegExp(`(${escapedKeyword}\\s*\\([\\s\\S]*?,\\s*)(\\d+)(\\s*\\))`, 'i');

  return text.replace(re, `$1${idx}$3`);
}

function applyMapEntryUpdate(text, resolution) {
  const { rawMapNameVisible, mapKeyFound, chosenVariantId } = resolution;
  if (!mapKeyFound || !chosenVariantId) return text;

  const newFullMapEntry = `${rawMapNameVisible} ${chosenVariantId}`;
  const lang = getActiveVisibleLang();

  const SKIRMISH_NAMES = {
    'en-US': 'Skirmish',
    'de-DE': 'Übungsgefecht',
    'es-ES': 'Escaramuza',
    'es-MX': 'Escaramuza',
    'fr-FR': 'Échauffement',
    'it-IT': 'Schermaglia',
    'ja-JP': 'スカーミッシュ',
    'ko-KR': '연습 전투',
    'pl-PL': 'Potyczka',
    'pt-BR': 'Confronto',
    'ru-RU': 'Разминка',
    'th-TH': 'บู๊ซ้อมรบ',
    'tr-TR': 'Müsademe',
    'zh-CN': '突击模式',
    'zh-TW': '衝突戰',
  };
  const skirmish = SKIRMISH_NAMES[lang] || SKIRMISH_NAMES['en-US'];

  const enabledMapsPattern =
    `(?:enabled\\s+maps|mapas\\s+habilitados|mapas\\s+ativados|verfügbare\\s+karten|启用地图|有効なマップ|cartes?\\s+(?:activées|disponibles))`;

  const reAll = new RegExp(`${enabledMapsPattern}\\s*\\{[\\s\\S]*?\\}`, 'gi');
  text = text.replace(reAll, (match) => {
    return match.replace(/\{[\s\\S]*\}/, '{\n\n}');
  });

  const reSkirmish = new RegExp(
    `(${skirmish.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*\\{[\\s\\S]*?` +
      `${enabledMapsPattern}\\s*\\{)([\\s\\S]*?)(\\})`,
    'i'
  );

  text = text.replace(reSkirmish, (_, p1, _oldContent, p3) => {
    return `${p1}\n    ${newFullMapEntry}\n${p3}`;
  });

  return text;
}

function applyWorkshopBansUpdate(tpl, lang, canonicalBanLabels, onOff, flags = {}) {
  const content = buildWorkshopBlockContent({
    bans: canonicalBanLabels,
    onOff,
    flags
  });
  return upsertWorkshopBlock(tpl, lang, content);
}

function saveEditorSettings() {
  const ta = document.querySelector('#convertMap textarea.mapdata');
  if (!ta) return;
  const lang = getActiveOutputLang();
  const raw = ta.value;

  const mapdata = updateMapDataRule(currentDataModel, lang);
  const newRule = buildRule(mapdata, lang);

  const replaced = replaceMapData(raw, newRule, lang);
  ta.value = replaced;
  lastFullText = replaced;
}

async function saveGlobalSettings() {
  const outputLang = getActiveVisibleLang();
  const textarea = document.querySelector('.mapdata');
  const originalText = textarea.value;

  const newActiveBans = getNewActiveBans();
  updateGlobalSettingsFromForm();
  const resolution = resolveMapKeyAndVariant();
  const localized = getLocalizedOnOff(outputLang);

  let text = originalText;
  text = applyOnOffReplacements(text, localized, globalSettings);
  text = applyValidatorToggle(text, outputLang, globalSettings);
  text = applyMapEntryUpdate(text, resolution);
  text = writeGlobalSettingsIntoTemplate(text, newActiveBans);
  const wanted = globalSettings.difficultyHUD;
  text = applyDifficultyValue(text, outputLang, wanted);
  const idxAfter = extractDifficultyValue(text);
  text = ensureDifficultyHudInWorkshop(text, outputLang, idxAfter);

  textarea.value = text;
  lastFullText = text;
  renderMapSettings(text);
  console.log('✅ globalSettings sauvegardés :', {
    ...globalSettings,
    activeGlobalBans: newActiveBans,
    mapKey: resolution.mapKeyFound,
    variantId: resolution.chosenVariantId,
  });
  closeGlobalSettingsModal();
  showConfirmationMessage(t('common.save_settings'));
}

/* =========================
   GLOBAL SETTINGS MODAL HELPERS
   ========================= */
function getCurrentWorkshopText() {
  const ta = document.querySelector('.mapdata');
  return (ta && typeof ta.value === 'string') ? ta.value : (lastFullText || '');
}

function writeGlobalSettingsIntoTemplate(tpl, bansOverride) {
  const activeLang =
    (__lastTranslateCtx.used && __lastTranslateCtx.targetLang)
      ? __lastTranslateCtx.targetLang
      : (document.getElementById('lang')?.value || CURRENT_LANG || 'en-US');

  const onOff = getLocalizedOnOff(activeLang);

  const explicitOverrideProvided = arguments.length >= 2;
  const canonicalBans = explicitOverrideProvided
    ? (Array.isArray(bansOverride) ? bansOverride : [])
    : standardizeWorkshopBansForTemplate(lastFullText || tpl);

  const flags = {
    editorMode: globalSettings.editorMode === true,
    portals:    globalSettings.portals === 'on' || globalSettings.portals === true,
    playtest:   globalSettings.playtest === 'on' || globalSettings.playtest === true,
  };
  if (globalSettings.difficultyHUD === 'playtest') {
    globalSettings.playtest = 'on';
  }

  return applyWorkshopBansUpdate(tpl, activeLang, canonicalBans, onOff, flags);
}

function getActiveSourceLang() {
  if (typeof __lastTranslateCtx !== 'undefined' && __lastTranslateCtx && __lastTranslateCtx.used) {
    return __lastTranslateCtx.sourceLang || 'en-US';
  }
  return document.getElementById('lang')?.value || 'en-US';
}

function getActiveVisibleLang() {
  if (typeof __lastTranslateCtx !== 'undefined' && __lastTranslateCtx && __lastTranslateCtx.used) {
    return __lastTranslateCtx.targetLang || 'en-US';
  }
  return document.getElementById('lang')?.value || 'en-US';
}

function getVariantDropdownAPI() {
  const dd = document.getElementById('mapVariantDropdown');
  if (dd) {
    const trigger = dd.querySelector('.custom-dd-trigger');
    const labelEl = dd.querySelector('.custom-dd-label');
    const listEl  = dd.querySelector('.custom-dd-list');

    const api = {
      type: 'custom',
      root: dd,
      open() {
        listEl.classList.remove('hidden');
        trigger.setAttribute('aria-expanded', 'true');
      },
      close() {
        listEl.classList.add('hidden');
        trigger.setAttribute('aria-expanded', 'false');
      },
      getValue() {
        return dd.dataset.selected || 'default';
      },
      setValue(key) {
        if (!key) return;
        dd.dataset.selected = key;

        const lang = (typeof getActiveVisibleLang === 'function')
          ? getActiveVisibleLang()
          : (document.getElementById('lang')?.value || 'en-US');

        let labelText = null;
        const optBtn = listEl.querySelector(
          `[role="option"][data-value="${CSS.escape(key)}"]`
        );
        if (optBtn) {
          const span = optBtn.querySelector('span');
          labelText = span?.textContent || null;
        }
        labelEl.textContent = labelText || labelizeVariantKey(key, lang);

        listEl.querySelectorAll('[role="option"]').forEach((b) => {
          const k = b.getAttribute('data-value');
          const isSel = (k === key);
          b.setAttribute('aria-selected', String(isSel));
          const check = b.querySelector('svg');
          if (check) {
            check.classList.toggle('invisible', !isSel);
            check.classList.toggle('visible', isSel);
          }
        });
      },

      setOptions(options, selectedKey) {
        const lang = (typeof getActiveVisibleLang === 'function')
          ? getActiveVisibleLang()
          : (document.getElementById('lang')?.value || 'en-US');

        listEl.innerHTML = '';

        options.forEach((opt) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className =
            'w-full cursor-pointer text-left rounded-md px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 ' +
            'hover:bg-zinc-900/5 dark:bg-white/10 focus:outline-none flex items-center gap-2';
          btn.setAttribute('role', 'option');
          btn.setAttribute('data-value', opt.key);
          btn.setAttribute('aria-selected', 'false');

          const span = document.createElement('span');
          span.textContent = labelizeVariantKey(opt.key, lang, opt.label);

          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.classList.add('ml-auto', 'h-4', 'w-4', 'text-emerald-400', 'invisible');
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', 'M5 13l4 4L19 7');
          path.setAttribute('fill', 'none');
          path.setAttribute('stroke', 'currentColor');
          path.setAttribute('stroke-width', '3');
          path.setAttribute('stroke-linecap', 'round');
          path.setAttribute('stroke-linejoin', 'round');
          svg.appendChild(path);

          btn.append(span, svg);
          btn.addEventListener('click', () => { api.setValue(opt.key); api.close(); });
          listEl.appendChild(btn);
        });

        api.setValue(selectedKey || (options[0]?.key ?? 'default'));
      },
      initEvents() {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          if (listEl.classList.contains('hidden')) this.open();
          else this.close();
        });
        document.addEventListener('click', (e) => {
          if (!dd.contains(e.target)) this.close();
        });
        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (listEl.classList.contains('hidden')) this.open();
            else this.close();
          }
          if (e.key === 'Escape') this.close();
        });
      }
    };

    api.initEvents();
    return api;
  }

  const sel = document.getElementById('mapVariantSelect');
  return {
    type: 'native',
    root: sel,
    open(){}, close(){},
    getValue(){ return sel?.value || 'default'; },
    setValue(key){ if (sel) sel.value = key; },
    setOptions(options, selectedKey){
      if (!sel) return;
      sel.innerHTML = '';
      const lang = (typeof getActiveVisibleLang === 'function')
        ? getActiveVisibleLang()
        : (document.getElementById('lang')?.value || 'en-US');
      options.forEach(opt => {
        const o = document.createElement('option');
        o.value = opt.key;
        o.textContent = labelizeVariantKey(opt.key, lang, opt.label);
        if (opt.key === selectedKey) o.selected = true;
        sel.appendChild(o);
      });
      if (!sel.value && options[0]) sel.value = options[0].key;
    },
    initEvents(){},
  };
}

function generateVariantLabelFromKey(key) {
  if (!key) return '';
  let s = String(key)
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim();
  s = s.replace(/\b\w/g, c => c.toUpperCase());

  if (s.toLowerCase() === 'default') {
    const lang = getActiveVisibleLang ? getActiveVisibleLang() : (document.getElementById('lang')?.value || 'en-US');
    const map = {
      'fr-FR': 'Par défaut',
      'de-DE': 'Standard',
      'es-ES': 'Predeterminado',
      'pt-BR': 'Padrão',
    };
    return map[lang] || 'Default';
  }
  return s;
}

function labelizeVariantKey(key, lang, providedLabel) {
  return providedLabel || generateVariantLabelFromKey(key);
}

function uiBanLabel(lbl) {
  return String(lbl || '')
    .replace(/[\u00A0\u2000-\u200B\u3000]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s*(◆|■)\s*/g, ' $1 ')
    .trim();
}

/* =========================
   EDITOR MODE MODAL
   ========================= */
function openEditModal(idx) {
  editIndex = idx;

  const modal = document.getElementById('editModal');
  const fieldsContainer = document.getElementById('editFieldsContainer');
  fieldsContainer.innerHTML = '';
  fieldsContainer.className = 'space-y-5 divide-y divide-white/5';

  // Panel
  modal.classList.add('items-start', 'pt-16', 'px-4');
  const panel = [...modal.children].find((el) => el.tagName !== 'SCRIPT') || modal.firstElementChild;
  if (panel) {
    panel.className = [
      'max-h-[80vh] w-full max-w-3xl overflow-y-auto',
      'rounded-2xl shadow-2xl',
      'bg-gradient-to-b from-zinc-900/95 to-zinc-950/95',
      'border border-zinc-200/80 dark:border-white/10 ring-1 ring-white/5',
      'backdrop-blur-lg p-5'
    ].join(' ');
  }

  // Data
  const checkpoint = currentDataModel.checkpoints[idx];
  const tp = currentDataModel.teleportMap[idx];
  const coords = tp ? tp.start : checkpoint;
  const kills = currentDataModel.killMap[idx] || [];
  const pins  = currentDataModel.pinMap[idx]  || [];
  const abilities = currentDataModel.abilityMap[idx] || {};
  const banMap    = currentDataModel.banMap;

  // UI classes
  const inputBase =
    'rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500';
  const inputSm   = `${inputBase} w-16 md:w-20 shrink-0 px-2 py-1.5 text-xs`;
  const chipBtn   =
    'rounded-lg cursor-pointer border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-2.5 py-1 text-sm text-zinc-900 dark:text-zinc-100 hover:bg-zinc-800/70';
  const minusBtnCls =
    'group h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-lg ' +
    'bg-red-600/90 text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-white/10 ring-1 ring-white/5 shadow-sm ' +
    'hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/60 ' +
    'transition duration-150 active:scale-95';
  const rowCls    = 'mt-2 flex flex-nowrap items-center gap-2 overflow-x-auto';
  const titleCls  = 'text-sm font-semibold text-zinc-800 dark:text-zinc-200';

  const makeSectionSpacer = () => {
    const d = document.createElement('div');
    d.className = 'mt-2 space-y-2';
    return d;
  };

  // Icons
  const BAN_ICONS = {
    Multi: '∞',
    Create: '♂',
    Stand: '♠',
    Dead: 'X',
    Emote: '♥',
    Climb: '↑',
    Bhop: '≥',
    Djump: '»',
    SaveDouble: '△',
  };
  const ABILITY_ICONS = {
    ultimate: cdnAsset('assets/abilities/ultimate.webp'),
    dash: cdnAsset('assets/abilities/dash.webp'),
  };

  const pill = (txt, tone='emerald') => {
    const span = document.createElement('span');
    span.className = `shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium
      border-${tone}-500/25 bg-${tone}-500/10 text-${tone}-300`;
    span.textContent = txt;
    return span;
  };

  // ============= Coordinates =============
  {
    const wrapper = document.createElement('div');

    const head = document.createElement('div');
    head.className = 'flex items-center justify-between';
    const title = document.createElement('div');
    title.className = titleCls;
    title.textContent = t('map_data.coordinates');
    head.appendChild(title);
    wrapper.appendChild(head);

    const row = document.createElement('div');
    row.className = rowCls;

    const inX = Object.assign(document.createElement('input'), { type:'number', step:'0.001', value: coords.x });
    inX.className = `${inputSm}`; inX.id = 'editCoordX';
    const inY = Object.assign(document.createElement('input'), { type:'number', step:'0.001', value: coords.y });
    inY.className = `${inputSm}`; inY.id = 'editCoordY';
    const inZ = Object.assign(document.createElement('input'), { type:'number', step:'0.001', value: coords.z });
    inZ.className = `${inputSm}`; inZ.id = 'editCoordZ';

    row.append(pill('X'), inX, pill('Y'), inY, pill('Z'), inZ);
    wrapper.appendChild(row);

    wrapper.appendChild(makeSectionSpacer());

    fieldsContainer.appendChild(wrapper);
  }

  // ============= Teleport =============
  {
    const wrapper = document.createElement('div');

    const head = document.createElement('div');
    head.className = 'flex items-center justify-between';
    const title = document.createElement('div');
    title.className = titleCls;
    title.textContent = t('map_data.teleport');
    head.appendChild(title);
    wrapper.appendChild(head);

    if (tp) {
      const row = document.createElement('div');
      row.className = rowCls;
      row.dataset.tpKind = 'start-end';

      const startDifferent = !(tp.start.x === checkpoint.x && tp.start.y === checkpoint.y && tp.start.z === checkpoint.z);

      if (startDifferent) {
        row.appendChild(pill(t('map_data.start'), 'sky'));
        ['x', 'y', 'z'].forEach((axis) => {
          const inp = Object.assign(document.createElement('input'), { type:'number', step:'0.001', value: tp.start[axis] });
          inp.className = `tp-start-${axis} ${inputSm}`;
          row.appendChild(inp);
        });
      }

      row.appendChild(pill(t('map_data.end'), 'fuchsia'));
      ['x', 'y', 'z'].forEach((axis) => {
        const inp = Object.assign(document.createElement('input'), { type:'number', step:'0.001', value: tp.end[axis] });
        inp.className = `tp-end-${axis} ${inputSm}`;
        row.appendChild(inp);
      });

      const btnDelTp = document.createElement('button');
      btnDelTp.type = 'button';
      btnDelTp.className = `${minusBtnCls}`;
      btnDelTp.title = 'Remove this teleport';
      btnDelTp.setAttribute('aria-label', 'Remove this teleport');
      btnDelTp.appendChild(createMinusIcon());
      btnDelTp.addEventListener('click', () => row.remove());
      row.appendChild(btnDelTp);

      wrapper.appendChild(row);
    } else {
      const btnAdd = document.createElement('button');
      btnAdd.type = 'button';
      btnAdd.textContent = t('map_data.add_teleport');
      btnAdd.className = `${chipBtn} bg-fuchsia-600/80 hover:bg-fuchsia-600 text-zinc-900 dark:text-white mt-2`;
      btnAdd.addEventListener('click', () => {
        const cp = currentDataModel.checkpoints[idx];
        const row = document.createElement('div');
        row.className = rowCls;

        row.appendChild(pill(t('map_data.start'), 'sky'));
        ['x','y','z'].forEach(ax => {
          const inp = Object.assign(document.createElement('input'), { type:'number', step:'0.001', value: cp[ax] });
          inp.className = `tp-start-${ax} ${inputSm}`;
          row.appendChild(inp);
        });

        row.appendChild(pill(t('map_data.end'), 'fuchsia'));
        ['x','y','z'].forEach(ax => {
          const inp = Object.assign(document.createElement('input'), { type:'number', step:'0.001', value: 0 });
          inp.className = `tp-end-${ax} ${inputSm}`;
          row.appendChild(inp);
        });

        wrapper.appendChild(row);
        btnAdd.remove();
      });
      wrapper.appendChild(btnAdd);
    }

    wrapper.appendChild(makeSectionSpacer());

    fieldsContainer.appendChild(wrapper);
  }

  // ============= Kill orbs =============
  {
    const wrapper = document.createElement('div');

    const head = document.createElement('div');
    head.className = 'flex items-center justify-between';
    const title = document.createElement('div');
    title.className = titleCls;
    title.textContent = t('map_data.kill_orbs');
    head.appendChild(title);
    wrapper.appendChild(head);

    const addKillBtn = document.createElement('button');
    addKillBtn.type = 'button';
    addKillBtn.textContent = t('map_data.add_kill_orb');
    addKillBtn.className = `${chipBtn} bg-sky-600/80 hover:bg-sky-600 text-zinc-900 dark:text-white mt-2`;
    wrapper.appendChild(addKillBtn);

    const killList = document.createElement('div');
    killList.className = 'mt-2 space-y-2';
    wrapper.appendChild(killList);

    const makeKillRow = (kb = { pos:{x:0,y:0,z:0}, radius:0 }, i) => {
      const row = document.createElement('div');
      row.className = rowCls + ' orb-row';
      if (i != null) row.dataset.orbIndex = i;

      row.appendChild(pill('X'));
      const ix = Object.assign(document.createElement('input'), { type:'number', step:'0.001', value: kb.pos?.x ?? 0 });
      ix.className = `kill-x ${inputSm}`; row.appendChild(ix);

      row.appendChild(pill('Y'));
      const iy = Object.assign(document.createElement('input'), { type:'number', step:'0.001', value: kb.pos?.y ?? 0 });
      iy.className = `kill-y ${inputSm}`; row.appendChild(iy);

      row.appendChild(pill('Z'));
      const iz = Object.assign(document.createElement('input'), { type:'number', step:'0.001', value: kb.pos?.z ?? 0 });
      iz.className = `kill-z ${inputSm}`; row.appendChild(iz);

      row.appendChild(pill(t('map_data.radius'), 'amber'));
      const ir = Object.assign(document.createElement('input'), { type:'number', step:'0.001', value: kb.radius ?? 0 });
      ir.className = `kill-r ${inputSm}`; row.appendChild(ir);

      const btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.className = `${minusBtnCls}`;
      btnDel.appendChild(createMinusIcon());
      btnDel.addEventListener('click', () => row.remove());
      row.appendChild(btnDel);

      return row;
    };

    kills.forEach((kb, i) => killList.appendChild(makeKillRow(kb, i)));
    addKillBtn.addEventListener('click', () => {
      killList.appendChild(makeKillRow());
    });

    wrapper.appendChild(makeSectionSpacer());

    fieldsContainer.appendChild(wrapper);
  }

  // ============= Bounce orbs =============
  {
    const wrapper = document.createElement('div');

    const head = document.createElement('div');
    head.className = 'flex items-center justify-between';
    const title = document.createElement('div');
    title.className = titleCls;
    title.textContent = t('map_data.bounce_orbs');
    head.appendChild(title);
    wrapper.appendChild(head);

    const addPinBtn = document.createElement('button');
    addPinBtn.type = 'button';
    addPinBtn.textContent = t('map_data.add_bounce_orb');
    addPinBtn.className = `${chipBtn} bg-sky-600/80 hover:bg-sky-600 text-zinc-900 dark:text-white mt-2`;
    wrapper.appendChild(addPinBtn);

    const pinList = document.createElement('div');
    pinList.className = 'mt-2 space-y-2';
    wrapper.appendChild(pinList);

    const makePinRow = (pb = { pos:{x:0,y:0,z:0}, force:0, locked:false, givesUlt5:false, givesUlt6:false }) => {
      const row = document.createElement('div');
      row.className = rowCls + ' orb-row';

      // XYZ
      ['x','y','z'].forEach((fld) => {
        row.appendChild(pill(fld.toUpperCase()));
        const inp = Object.assign(document.createElement('input'), {
          type: 'number',
          step: '0.001',
          value: pb.pos?.[fld] ?? 0
        });
        inp.className = `pin-${fld} ${inputSm}`;
        row.appendChild(inp);
      });

      // Force
      row.appendChild(pill('F', 'violet'));
      const inf = Object.assign(document.createElement('input'), { type:'number', step:'0.001', value: pb.force ?? 0 });
      inf.className = `pin-f ${inputSm}`;
      row.appendChild(inf);

      // Flags
      const flags = document.createElement('div');
      flags.className = 'flex items-center gap-3 whitespace-nowrap shrink-0 text-xs ml-2';

      // Locked
      {
        const wrap = document.createElement('label');
        wrap.className = 'inline-flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 shrink-0';
        const chk = Object.assign(document.createElement('input'), {
          type: 'checkbox',
          checked: !!pb.locked,
          'aria-label': 'Locked'
        });
        chk.className = 'pin-locked cursor-pointer h-4 w-4 accent-emerald-600';
        const icon = createLockIcon('h-4 w-4');
        icon.setAttribute('title', t('map_data.lock_orb'));
        wrap.append(chk, icon);
        flags.appendChild(wrap);
      }

      // Ultimate
      {
        const wrap = document.createElement('label');
        wrap.className = 'inline-flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 shrink-0';
        const chk = Object.assign(document.createElement('input'), {
          type: 'checkbox',
          checked: !!pb.givesUlt5,
          'aria-label': 'Ultimate'
        });
        chk.className = 'pin-ult5 cursor-pointer h-4 w-4 accent-emerald-600';
        const img = document.createElement('img');
        img.src = ABILITY_ICONS.ultimate;
        img.alt = 'Ultimate';
        img.title = t('map_data.ultimate');
        img.className = 'h-4 w-4 rounded-sm object-contain';
        wrap.append(chk, img);
        flags.appendChild(wrap);
      }

      // Dash
      {
        const wrap = document.createElement('label');
        wrap.className = 'inline-flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 shrink-0';
        const chk = Object.assign(document.createElement('input'), {
          type: 'checkbox',
          checked: !!pb.givesUlt6,
          'aria-label': 'Dash'
        });
        chk.className = 'pin-ult6 cursor-pointer h-4 w-4 accent-emerald-600';
        const img = document.createElement('img');
        img.src = ABILITY_ICONS.dash;
        img.alt = 'Dash';
        img.title = t('map_data.dash');
        img.className = 'h-4 w-4 rounded-sm object-contain';
        wrap.append(chk, img);
        flags.appendChild(wrap);
      }

      row.appendChild(flags);

      const btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.className = `${minusBtnCls}`;
      btnDel.appendChild(createMinusIcon());
      btnDel.addEventListener('click', () => row.remove());
      row.appendChild(btnDel);

      return row;
    };

    pins.forEach((pb) => pinList.appendChild(makePinRow(pb)));
    addPinBtn.addEventListener('click', () => {
      pinList.appendChild(makePinRow());
    });

    wrapper.appendChild(makeSectionSpacer());

    fieldsContainer.appendChild(wrapper);
  }

  // ============= Abilities =============
  {
    const wrapper = document.createElement('div');
    const title = document.createElement('div');
    title.className = titleCls;
    title.textContent = t('map_data.abilities');
    wrapper.appendChild(title);

    const row = document.createElement('div');
    row.className = 'mt-2 flex flex-wrap items-center gap-4';

    ['ultimate', 'dash'].forEach((key) => {
      const label = document.createElement('label');
      label.className = 'cursor-pointer inline-flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200';
      label.title = key === 'ultimate' ? t('map_data.ultimate_available') : t('map_data.dash_available');

      const chk = Object.assign(document.createElement('input'), {
        type: 'checkbox',
        checked: !!abilities[key],
        id: `editAbility${key.charAt(0).toUpperCase() + key.slice(1)}`,
        'aria-label': key === 'ultimate' ? 'Ultimate' : 'Dash'
      });
      chk.className = 'h-4 w-4 cursor-pointer accent-emerald-600';

      const img = document.createElement('img');
      img.src = ABILITY_ICONS[key];
      img.alt = key === 'ultimate' ? 'Ultimate' : 'Dash';
      img.className = 'h-5 w-5 rounded-sm object-contain';

      label.append(chk, img);
      row.appendChild(label);
    });

    wrapper.appendChild(row);

    wrapper.appendChild(makeSectionSpacer());

    fieldsContainer.appendChild(wrapper);
  }

  // ============= CP-specific bans =============
  {
    const wrapper = document.createElement('div');
    const title = document.createElement('div');
    title.className = titleCls;
    title.textContent = t('map_data.cp_specific_bans');
    wrapper.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'mt-2 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2';

    Object.entries(banMap).forEach(([banKey, arr]) => {
      const label = document.createElement('label');
      label.className =
        'inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100';
      label.title = banKey;

      const iconWrap = document.createElement('span');
      iconWrap.className = 'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 text-xs';
      iconWrap.textContent = BAN_ICONS[banKey] ?? '•';

      const chk = Object.assign(document.createElement('input'), {
        type: 'checkbox',
        checked: arr.includes(idx)
      });
      chk.className = `edit-ban-${banKey} h-4 w-4 cursor-pointer accent-emerald-600`;

      const txt = document.createTextNode(banKey);

      label.append(iconWrap, chk, txt);
      grid.appendChild(label);
    });
    wrapper.appendChild(grid);

    wrapper.appendChild(makeSectionSpacer());

    fieldsContainer.appendChild(wrapper);
  }

  const saveBtn = document.getElementById('saveEditorChangesBtn');
  if (saveBtn) {
    saveBtn.className = 'bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-white rounded-xl px-4 py-2';
  }

  {
    const buttonsContainer = modal.querySelector('.modal-buttons3');
    if (buttonsContainer && !buttonsContainer.querySelector('.delete-checkpoint-btn')) {
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.textContent = t('map_data.remove_checkpoint');
      deleteBtn.className =
        'delete-checkpoint-btn cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-white hover:bg-red-500';
      buttonsContainer.insertBefore(deleteBtn, buttonsContainer.firstChild);
      deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        deleteCheckpoint(editIndex);
      });
    }
  }

  // Close / cancel
  document.getElementById('closeModal2').onclick = () => hideModal(modal);
  window.addEventListener('click', onWindowClickForEditorModal);
  document.getElementById('cancelEditorChangesBtn').addEventListener('click', () => {
    hideModal(modal);
    showErrorMessage(t('common.cancel_changes'));
  });

  showModal(modal);
}

/* =========================
   EDITOR MODE HELPERS
   ========================= */

function onWindowClickForEditorModal(e) {
  const modal = document.getElementById('editModal');
  if (e.target === modal) {
    closeSettingsModal();
  }
}

function closeSettingsModal() {
  const modal = document.getElementById('editModal');
  if (modal) {
    hideModal(modal);
    window.removeEventListener('click', onWindowClickForEditorModal);
  }
}

function applyEditorModalToModel() {
  const idx = editIndex;
  if (idx == null) return;

  const newX = parseFloat(document.getElementById('editCoordX').value) || 0;
  const newY = parseFloat(document.getElementById('editCoordY').value) || 0;
  const newZ = parseFloat(document.getElementById('editCoordZ').value) || 0;
  currentDataModel.checkpoints[idx] = { x: newX, y: newY, z: newZ };

  const endEls = document.querySelectorAll('.tp-end-x');
  if (endEls.length) {
    const checkpoint = currentDataModel.checkpoints[idx];
    const sxEl = document.querySelector('.tp-start-x');
    const syEl = document.querySelector('.tp-start-y');
    const szEl = document.querySelector('.tp-start-z');
    const s = {
      x: sxEl ? parseFloat(sxEl.value) || 0 : checkpoint.x,
      y: syEl ? parseFloat(syEl.value) || 0 : checkpoint.y,
      z: szEl ? parseFloat(szEl.value) || 0 : checkpoint.z,
    };
    const e = {
      x: parseFloat(document.querySelector('.tp-end-x').value) || 0,
      y: parseFloat(document.querySelector('.tp-end-y').value) || 0,
      z: parseFloat(document.querySelector('.tp-end-z').value) || 0,
    };
    currentDataModel.teleportMap[idx] = { start: s, end: e };
  } else {
    delete currentDataModel.teleportMap[idx];
  }

  const killRows = Array.from(document.querySelectorAll('#editFieldsContainer .orb-row')).filter(
    (r) => r.querySelector('.kill-x')
  );
  currentDataModel.killMap[idx] = killRows.map((row) => {
    const x = parseFloat(row.querySelector('.kill-x').value) || 0;
    const y = parseFloat(row.querySelector('.kill-y').value) || 0;
    const z = parseFloat(row.querySelector('.kill-z').value) || 0;
    const r = parseFloat(row.querySelector('.kill-r').value) || 0;
    return { pos: { x, y, z }, radius: r };
  });

  const pinRows = Array.from(document.querySelectorAll('#editFieldsContainer .orb-row')).filter(
    (r) => r.querySelector('.pin-x')
  );
  currentDataModel.pinMap[idx] = pinRows.map((row) => {
    const x = parseFloat(row.querySelector('.pin-x').value) || 0;
    const y = parseFloat(row.querySelector('.pin-y').value) || 0;
    const z = parseFloat(row.querySelector('.pin-z').value) || 0;
    const f = parseFloat(row.querySelector('.pin-f').value) || 0;
    const locked = row.querySelector('.pin-locked').checked;
    const givesUlt5 = row.querySelector('.pin-ult5').checked;
    const givesUlt6 = row.querySelector('.pin-ult6').checked;
    return { pos: { x, y, z }, force: f, locked, givesUlt5, givesUlt6 };
  });

  const ultChk = document.getElementById('editAbilityUltimate').checked;
  const dashChk = document.getElementById('editAbilityDash').checked;
  currentDataModel.abilityMap[idx] = { ultimate: ultChk, dash: dashChk };

  Object.keys(currentDataModel.banMap).forEach((banKey) => {
    const cb = document.querySelector('.edit-ban-' + banKey);
    if (!cb) return;
    const arr = currentDataModel.banMap[banKey];
    const isChecked = cb.checked;
    const already = arr.includes(idx);
    if (isChecked && !already) {
      arr.push(idx);
    } else if (!isChecked && already) {
      currentDataModel.banMap[banKey] = arr.filter((n) => n !== idx);
    }
  });

  const blocks = Array.from(document.querySelectorAll('#editFieldsContainer .portal-block'));
  const newStarts = [],
    newEnds = [],
    newCPs = [];
  blocks.forEach((blk) => {
    const i = +blk.dataset.portalIndex;
    const s = {},
      e = {};
    ['X', 'Y', 'Z'].forEach((ax) => {
      s[ax.toLowerCase()] = parseFloat(blk.querySelector(`#portalStart${ax}_${i}`).value) || 0;
      e[ax.toLowerCase()] = parseFloat(blk.querySelector(`#portalEnd${ax}_${i}`).value) || 0;
    });
    const cp = parseInt(blk.querySelector(`#portalCP_${i}`).value, 10);
    newStarts.push(s);
    newEnds.push(e);
    newCPs.push(isNaN(cp) ? idx : cp);
  });
  currentDataModel.CustomPortalStart[idx] = newStarts;
  currentDataModel.CustomPortalEndpoint[idx] = newEnds;
  currentDataModel.CustomPortalCP[idx] = newCPs[0] != null ? newCPs[0] : idx;
  currentDataModel.portalMap[idx] = newStarts.map((start, j) => ({
    start,
    end: newEnds[j],
    cp: newCPs[j] != null ? newCPs[j] : idx,
  }));
}

document.getElementById('saveEditorChangesBtn').addEventListener('click', () => {
  const modal = document.getElementById('editModal');
  applyEditorModalToModel();
  hideModal(modal);

  saveEditorSettings();
  renderMapSettingsWithModel(currentDataModel);
  showConfirmationMessage(t('common.save_settings'));
});

function createLockIcon(size = 'h-4 w-4') {
  const NS = 'http://www.w3.org/2000/svg';
  const svg  = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.6');
  svg.setAttribute('class', size);

  const body = document.createElementNS(NS, 'rect');
  body.setAttribute('x', '5');
  body.setAttribute('y', '11');
  body.setAttribute('width', '14');
  body.setAttribute('height', '10');
  body.setAttribute('rx', '2');
  body.setAttribute('fill', 'none');
  body.setAttribute('stroke', 'currentColor');

  const shackle = document.createElementNS(NS, 'path');
  shackle.setAttribute('d', 'M8 11V8a4 4 0 0 1 8 0v3');
  shackle.setAttribute('stroke-linecap', 'round');
  shackle.setAttribute('stroke-linejoin', 'round');

  svg.append(body, shackle);
  return svg;
}

function createMinusIcon(size = 'h-4 w-4') {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('class', size);

  const circle = document.createElementNS(NS, 'circle');
  circle.setAttribute('cx', '12');
  circle.setAttribute('cy', '12');
  circle.setAttribute('r', '10');
  circle.setAttribute('opacity', '0.35');
  circle.setAttribute('stroke', 'currentColor');

  const line = document.createElementNS(NS, 'path');
  line.setAttribute('d', 'M7 12h10');
  line.setAttribute('stroke-linecap', 'round');

  svg.append(circle, line);
  return svg;
}

function setCardEditInteractivity(enabled) {
  document.querySelectorAll('.checkpoint-card').forEach((card) => {
    card.classList.toggle('editable', enabled);
    card.querySelectorAll('.move-controls button').forEach((btn) => {
      btn.disabled = !enabled;
    });

    if (enabled) {
      card.classList.add(
        'cursor-pointer',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-emerald-500/60'
      );
      card.tabIndex = 0;
    } else {
      card.classList.remove(
        'cursor-pointer',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-emerald-500/60'
      );
      card.removeAttribute('tabindex');
    }
  });
}

/* =========================
   RENDER SETTINGS WITH MODEL
   ========================= */
function renderMapSettingsWithModel(dataModel) {
  const container = document.getElementById('mapSettings');
  const editModeBtn = document.getElementById('editModeBtn');
  const globalSettingsBtn = document.getElementById('globalSettingsBtn');
  const globalInfos = container.querySelector('.global-infos');

  if (editModeBtn && editModeBtn.parentNode) {
    editModeBtn.parentNode.removeChild(editModeBtn);
  }
  if (globalSettingsBtn && globalSettingsBtn.parentNode) {
    globalSettingsBtn.parentNode.removeChild(globalSettingsBtn);
  }

  container.innerHTML = '';

  globalInfos.innerHTML = '';
  globalInfos.classList.remove('no-bans');

  let settingsButtons = globalInfos.querySelector('.settings-buttons');
  if (!settingsButtons) {
    settingsButtons = document.createElement('div');
    settingsButtons.classList.add('settings-buttons');
  } else {
    settingsButtons.innerHTML = '';
  }

  if (editModeBtn) {
    settingsButtons.appendChild(editModeBtn);
  }
  if (globalSettingsBtn) {
    settingsButtons.appendChild(globalSettingsBtn);
  }

  if (editModeBtn && !editModeBtn.dataset.listenerInstalled) {
    editModeBtn.dataset.listenerInstalled = 'true';
    editModeBtn.addEventListener('click', () => {
      isEditMode = !isEditMode;
      editModeBtn.textContent = isEditMode ? t('map_data.exit_edit') : t('map_data.edit_mode');
      setCardEditInteractivity(isEditMode);
    });
  }

  if (editModeBtn) {
    editModeBtn.textContent = isEditMode ? t('map_data.exit_edit') : t('map_data.edit_mode');
  }
  if (!settingsButtons.contains(globalSettingsBtn)) {
    settingsButtons.appendChild(globalSettingsBtn);
  }

  const bansIconsEl = renderGlobalBans(lastFullText);
  if (bansIconsEl) {
    globalInfos.appendChild(bansIconsEl);
    globalInfos.classList.remove('no-bans');
  } else {
    globalInfos.classList.add('no-bans');
  }

  container.appendChild(globalInfos);
  globalInfos.appendChild(settingsButtons);

  if (!dataModel.checkpoints || dataModel.checkpoints.length === 0) {
    const msg = document.createElement('p');
    msg.textContent = t('convert.mapdata_error');
    msg.classList.add('empty-message');
    container.appendChild(msg);
    return;
  }

  dataModel.checkpoints.forEach((coords, idx) => {
    const card = createCheckpointCard(idx, coords, dataModel);
    container.appendChild(card);
  });

  updateCardNumbers();
  setCardEditInteractivity(isEditMode);
}

/* =========================
   EDITOR MODE SAVE
   ========================= */
function updateMapDataRule(dataModel, lang) {
  const dicts = {
    default: { G: 'Global', A: 'Array', V: 'Vector', T: 'True', F: 'False' },
    'zh-CN': { G: '全局', A: '数组', V: '矢量', T: '真', F: '假' },
    'ja-JP': { G: 'グローバル', A: '配列', V: 'ベクトル', T: 'True', F: 'False' },
  };
  const { G, A, V, T, F } = dicts[lang] || dicts['default'];

  const lines = [];

  const arrA = [];
  dataModel.checkpoints.forEach((c, i) => {
    const tp = dataModel.teleportMap[i];
    if (tp) {
      const Astart = `${V}(${tp.start.x.toFixed(3)}, ${tp.start.y.toFixed(3)}, ${tp.start.z.toFixed(3)})`;
      const Aend = `${V}(${tp.end.x.toFixed(3)}, ${tp.end.y.toFixed(3)}, ${tp.end.z.toFixed(3)})`;
      arrA.push(`${A}(${Astart}, ${Aend})`);
    } else {
      arrA.push(`${V}(${c.x.toFixed(3)}, ${c.y.toFixed(3)}, ${c.z.toFixed(3)})`);
    }
  });

  lines.push(`${G}.A = ${A}(${arrA.join(', ')});`);

  const arrH = [],
    arrI = [],
    arrKillNum = [];
  dataModel.checkpoints.forEach((_, idx) => {
    (dataModel.killMap[idx] || []).forEach((kb) => {
      const x = Number.isFinite(kb?.pos?.x) ? kb.pos.x : 0;
      const y = Number.isFinite(kb?.pos?.y) ? kb.pos.y : 0;
      const z = Number.isFinite(kb?.pos?.z) ? kb.pos.z : 0;
      const r = Number.isFinite(kb.radius) ? kb.radius : 0;
      arrH.push(`${V}(${x.toFixed(3)}, ${y.toFixed(3)}, ${z.toFixed(3)})`);
      arrI.push(r.toFixed(3));
      arrKillNum.push(idx);
    });
  });
  lines.push(`${G}.H = ${A}(${arrH.join(', ')});`);
  lines.push(`${G}.I = ${A}(${arrI.join(', ')});`);
  lines.push(`${G}.killballnumber = ${A}(${arrKillNum.join(', ')});`);

  const arrDao = Object.entries(dataModel.abilityMap || {})
    .filter(([, a]) => a && a.ultimate)
    .map(([i]) => i);
  const arrShift = Object.entries(dataModel.abilityMap || {})
    .filter(([, a]) => a && a.dash)
    .map(([i]) => i);
  lines.push(`${G}.Dao = ${A}(${arrDao.join(', ')});`);
  lines.push(`${G}.SHIFT = ${A}(${arrShift.join(', ')});`);

  lines.push(`${G}.EditSelectIdArray = ${A}();`);

  const arrTQ = [],
    arrEM = [],
    arrT5 = [],
    arrT6 = [],
    arrBTL = [],
    arrPinNum = [];
  dataModel.checkpoints.forEach((_, idx) => {
    (dataModel.pinMap[idx] || []).forEach((pb) => {
      const x = Number.isFinite(pb?.pos?.x) ? pb.pos.x : 0;
      const y = Number.isFinite(pb?.pos?.y) ? pb.pos.y : 0;
      const z = Number.isFinite(pb?.pos?.z) ? pb.pos.z : 0;
      const f = Number.isFinite(pb.force) ? pb.force : 0;
      arrTQ.push(`${V}(${x.toFixed(3)}, ${y.toFixed(3)}, ${z.toFixed(3)})`);
      arrEM.push(f.toFixed(3));
      arrT5.push(pb.givesUlt5 ? T : F);
      arrT6.push(pb.givesUlt6 ? T : F);
      arrBTL.push(pb.locked ? T : F);
      arrPinNum.push(idx);
    });
  });

  const ps = [],
    pe = [],
    pc = [];
  dataModel.checkpoints.forEach((_, i) => {
    (dataModel.CustomPortalStart[i] || []).forEach((v, j) => {
      ps.push(`${V}(${v.x.toFixed(3)}, ${v.y.toFixed(3)}, ${v.z.toFixed(3)})`);
      const e = (dataModel.CustomPortalEndpoint[i] || [])[j] || { x: 0, y: 0, z: 0 };
      pe.push(`${V}(${e.x.toFixed(3)}, ${e.y.toFixed(3)}, ${e.z.toFixed(3)})`);
      pc.push(dataModel.CustomPortalCP[i] != null ? dataModel.CustomPortalCP[i] : i);
    });
  });

  lines.push(`${G}.TQ = ${A}(${arrTQ.join(', ')});`);
  lines.push(`${G}.EditMode = ${A}(${arrEM.join(', ')});`);
  lines.push(`${G}.TQ5 = ${A}(${arrT5.join(', ')});`);
  lines.push(`${G}.TQ6 = ${A}(${arrT6.join(', ')});`);
  lines.push(`${G}.BounceToggleLock = ${A}(${arrBTL.join(', ')});`);
  lines.push(`${G}.pinballnumber = ${A}(${arrPinNum.join(', ')});`);

  lines.push(`${G}.LeaderBoardFull = ${A}();`);
  lines.push(`${G}.Difficultyhud = ${A}(0, ${F});`);

  lines.push(`${G}.CustomPortalStart = ${A}(${ps.join(', ')});`);
  lines.push(`${G}.CustomPortalEndpoint = ${A}(${pe.join(', ')});`);
  lines.push(`${G}.CustomPortalCP = ${A}(${pc.join(', ')});`);

  lines.push(`${G}.Cachedcredits = ${A}(0, 0);`);

  for (const [banKey, arr] of Object.entries(dataModel.banMap)) {
    lines.push(`${G}.Ban${banKey} = ${A}(${arr.join(', ')});`);
  }

  return lines.join('\n');
}

function deleteCheckpoint(idx) {
  if (idx == null) return;

  currentDataModel.checkpoints.splice(idx, 1);
  currentDataModel.CustomPortalStart.splice(idx, 1);
  currentDataModel.CustomPortalEndpoint.splice(idx, 1);
  currentDataModel.CustomPortalCP.splice(idx, 1);
  currentDataModel.CustomPortalCP = currentDataModel.CustomPortalCP.map((cp) =>
    cp > idx ? cp - 1 : cp
  );

  const newKillMap = {};
  Object.entries(currentDataModel.killMap).forEach(([key, arr]) => {
    const k = Number(key);
    if (k === idx) return;
    const nk = k > idx ? k - 1 : k;
    newKillMap[nk] = arr;
  });
  currentDataModel.killMap = newKillMap;

  const newPinMap = {};
  Object.entries(currentDataModel.pinMap).forEach(([key, arr]) => {
    const k = Number(key);
    if (k === idx) return;
    const nk = k > idx ? k - 1 : k;
    newPinMap[nk] = arr;
  });
  currentDataModel.pinMap = newPinMap;

  const newAbility = {};
  Object.entries(currentDataModel.abilityMap).forEach(([key, val]) => {
    const k = Number(key);
    if (k === idx) return;
    const nk = k > idx ? k - 1 : k;
    newAbility[nk] = val;
  });
  currentDataModel.abilityMap = newAbility;

  Object.keys(currentDataModel.banMap).forEach((banKey) => {
    currentDataModel.banMap[banKey] = currentDataModel.banMap[banKey]
      .filter((i) => i !== idx)
      .map((i) => (i > idx ? i - 1 : i));
  });

  const newPortalMap = {};
  currentDataModel.CustomPortalStart.forEach((starts, i) => {
    starts.forEach((start, j) => {
      const end = currentDataModel.CustomPortalEndpoint[i][j];
      const cp = currentDataModel.CustomPortalCP[i];
      if (!newPortalMap[i]) newPortalMap[i] = [];
      newPortalMap[i].push({ start, end, cp });
    });
  });
  currentDataModel.portalMap = newPortalMap;

  const modal = document.getElementById('editModal');
  hideModal(modal);
  showConfirmationMessage(t('common.deleted_checkpoint'));
  saveEditorSettings();
  renderMapSettingsWithModel(currentDataModel);
}

/* =========================
   MODALS ANIMATION HELPERS
   ========================= */
function showModal(modal) {
  if (!modal) return;
  modal.classList.add('modal-overlay');
  const panel = [...modal.children].find(el => el.tagName !== 'SCRIPT') || modal.firstElementChild;
  if (panel) panel.classList.add('modal-panel');

  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('is-open'));
}

function hideModal(modal) {
  if (!modal) return;
  modal.classList.remove('is-open');
  const onEnd = (e) => {
    if (e.target !== modal) return;
    modal.style.display = 'none';
    modal.removeEventListener('transitionend', onEnd);
  };
  modal.addEventListener('transitionend', onEnd);
  setTimeout(() => {
    modal.style.display = 'none';
    modal.removeEventListener('transitionend', onEnd);
  }, 260);
}

/* =========================
   DIFFCHECKER
   ========================= */
let lastDefaultTemplate = '';
async function ensureDefaultTemplate(lang) {
  if (!lastDefaultTemplate) {
    lastDefaultTemplate = await loadTemplate(lang);
  }
  return lastDefaultTemplate;
}

async function checkForDiff() {
  const lang = document.getElementById('lang').value || 'en-US';
  const defaultTpl = await ensureDefaultTemplate(lang);
  const current = document.querySelector('.mapdata').value;
  const patch = Diff.createPatch('mapdata', defaultTpl, current, '', '');
  const hasChanges = !/^\(\*\* No changes \*\*\)/m.test(patch) && patch.split('\n').length > 5;
  document.getElementById('diff-btn').style.display = hasChanges ? 'inline-block' : 'none';
  return patch;
}

const diffBtn = document.getElementById('diff-btn');
const diffModal = document.getElementById('diffModal');
const diffContent = document.getElementById('diffContent');

document
  .querySelector('.modal-close')
  .addEventListener('click', () => diffModal.classList.remove('show'));
window.addEventListener('click', function (event) {
  if (event.target === diffModal) {
    diffModal.classList.remove('show');
  }
});

diffBtn.addEventListener('click', async () => {
  const patch = await checkForDiff();
  const lines = patch
    .split('\n')
    .filter((l) => /^[\+\-]{1}[^+\-\-]/.test(l))
    .map((line) => {
      const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const cls = line.startsWith('+') ? 'added' : line.startsWith('-') ? 'removed' : '';
      return `<div class="diff-line ${cls}">${escaped}</div>`;
    });
  diffContent.innerHTML = lines.join('');
  diffModal.classList.add('show');
});

/* =========================
   CONTROLS FLAGS & DROPDOWNS
   ========================= */
(function () {
  let openDd = null;

  function setupDd(rootId, selectId) {
    const root  = document.getElementById(rootId);
    const btn   = root.querySelector('button');
    const menu  = root.querySelector('ul');
    const label = btn.querySelector('[data-label]');
    const icon  = btn.querySelector('i.flag');
    const select = document.getElementById(selectId);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (openDd && openDd !== root) close(openDd);
      root.classList.toggle('is-open');
      const open = root.classList.contains('is-open');
      btn.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('invisible', !open);
      menu.classList.toggle('opacity-0', !open);
      openDd = open ? root : null;
    });

    menu.querySelectorAll('.dd-opt').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = opt.getAttribute('data-code');
        const flag = opt.getAttribute('data-flag');
        const name = opt.querySelector('span')?.textContent || code;

        icon.className = 'flag ' + flag;
        label.textContent = name;

        if (select) {
          select.value = code;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
        close(root);
      });
    });
  }

  function close(root) {
    if (!root) return;
    const btn  = root.querySelector('button');
    const menu = root.querySelector('ul');
    root.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.add('invisible');
    menu.classList.add('opacity-0');
    if (openDd === root) openDd = null;
  }

  document.addEventListener('pointerdown', (e) => {
    if (openDd && !openDd.contains(e.target)) close(openDd);
  }, true);
  window.addEventListener('resize', () => openDd && close(openDd), true);

  setupDd('langDd', 'lang');
  setupDd('targetLangDd', 'targetLang');
})();

/* =========================
   CUSTOM SELECT 
   ========================= */
function initCustomSelects(root = document) {
  const widgets = Array.from(root.querySelectorAll('.custom-select[data-select]'));
  widgets.forEach((wrap) => {
    if (wrap.__init) return;
    const sel = document.querySelector(wrap.getAttribute('data-select'));
    const trigger = wrap.querySelector('.custom-select-trigger');
    const list = wrap.querySelector('.custom-select-list');
    const label = wrap.querySelector('.custom-select-label');
    if (!sel || !trigger || !list || !label) return;

    list.innerHTML = '';
    Array.from(sel.options).forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className =
        'w-full cursor-pointer text-left rounded-md px-2 py-1 text-sm hover:bg-zinc-900/5 dark:bg-white/10 focus:outline-none';
      btn.setAttribute('role', 'option');
      btn.dataset.value = opt.value;
      btn.textContent = opt.textContent;
      btn.addEventListener('click', () => {
        sel.selectedIndex = idx;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        close();
      });
      list.appendChild(btn);
    });

    function open() {
      list.classList.remove('hidden');
      trigger.setAttribute('aria-expanded', 'true');
    }
    function close() {
      list.classList.add('hidden');
      trigger.setAttribute('aria-expanded', 'false');
    }
    function toggle() {
      if (list.classList.contains('hidden')) open();
      else close();
    }

    function syncFromSelect() {
      const opt = sel.options[sel.selectedIndex];
      label.textContent = opt ? opt.textContent : '—';
      Array.from(list.children).forEach((el) => {
        el.classList.toggle('bg-zinc-900/5 dark:bg-white/10', el.dataset.value === sel.value);
      });
    }
    sel.addEventListener('change', syncFromSelect);
    syncFromSelect();

    trigger.addEventListener('click', toggle);
    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) close();
    });
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
        const current = Array.from(list.children).find((el) => el.dataset.value === sel.value);
        (current || list.firstElementChild)?.focus();
      }
      if (e.key === 'Escape') close();
    });
    list.addEventListener('keydown', (e) => {
      const items = Array.from(list.children);
      const i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' && i < items.length - 1) {
        e.preventDefault(); items[i + 1].focus();
      } else if (e.key === 'ArrowUp' && i > 0) {
        e.preventDefault(); items[i - 1].focus();
      } else if (e.key === 'Escape') {
        e.preventDefault(); close(); trigger.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); document.activeElement.click();
      }
    });

    wrap.__init = true;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('globalSettingsBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    setTimeout(() => {
      const native = document.getElementById('difficultyHUDSelect');
      if (native) native.dispatchEvent(new Event('change'));
    }, 0);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  initCustomSelects();

  const gBtn = document.getElementById('globalSettingsBtn');
  const gModal = document.getElementById('globalSettingsModal');
  if (gBtn && gModal) {
    gBtn.addEventListener('click', () => {
      setTimeout(() => initCustomSelects(gModal), 0);
    });
  }
});

/* =========================
   CUSTOM DROPDOWNS (Global Settings)
   ========================= */
function createCustomDropdownFromSelect(select) {
  if (!select || select.__customized) return null;
  select.__customized = true;

  const isDifficulty = select.id === 'difficultyHUDSelect';

  const wrap = document.createElement('div');
  wrap.className = 'custom-dd relative inline-block w-full';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className =
    'custom-dd-trigger cursor-pointer w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-left text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-between';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');

  const label = document.createElement('span');
  label.className = 'custom-dd-label truncate flex items-center gap-2';

  const caret = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  caret.setAttribute('viewBox', '0 0 24 24');
  caret.classList.add('ml-2', 'h-4', 'w-4', 'text-zinc-600 dark:text-zinc-400');
  caret.innerHTML = '<path fill="currentColor" d="M7 10l5 5 5-5z"/>';

  trigger.append(label, caret);

  const list = document.createElement('div');
  list.className =
    'custom-dd-list absolute left-0 right-0 mt-1 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl hidden z-20 max-h-60 overflow-auto';

  list.setAttribute('role', 'listbox');

  Array.from(select.options).forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className =
      'w-full text-left rounded-md px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-900/5 dark:bg-white/10 focus:outline-none flex items-center gap-2';
    btn.setAttribute('role', 'option');
    btn.dataset.value = opt.value;

    if (isDifficulty) {
      const dot = document.createElement('span');
      dot.className = `inline-block h-2.5 w-2.5 rounded-full ${getDifficultyDotClass(opt.value)}`;
      btn.appendChild(dot);
    }

    const txt = document.createElement('span');
    txt.textContent = opt.textContent;
    btn.appendChild(txt);

    let checkSvg = null;
    if (!isDifficulty) {
      checkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      checkSvg.setAttribute('viewBox', '0 0 24 24');
      checkSvg.classList.add('ml-auto', 'h-4', 'w-4', 'text-emerald-400');
      checkSvg.innerHTML =
        '<path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
      checkSvg.style.visibility = 'hidden';
      btn.appendChild(checkSvg);
    }

    const isSelected = idx === select.selectedIndex;
    btn.classList.toggle('bg-zinc-900/5 dark:bg-white/10', isSelected);
    btn.setAttribute('aria-selected', String(isSelected));
    if (!isDifficulty && checkSvg) {
      checkSvg.style.visibility = isSelected ? 'visible' : 'hidden';
    }

    btn.addEventListener('click', () => {
      select.selectedIndex = idx;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      close();
    });

    list.appendChild(btn);
  });

  select.style.position = 'absolute';
  select.style.opacity = '0';
  select.style.pointerEvents = 'none';
  select.tabIndex = -1;

  select.parentNode.insertBefore(wrap, select);
  wrap.appendChild(select);
  wrap.appendChild(trigger);
  wrap.appendChild(list);

  function open() {
    list.classList.remove('hidden');
    trigger.setAttribute('aria-expanded', 'true');
    document.addEventListener('pointerdown', onDocClick, true);
    document.addEventListener('keydown', onKey);
  }
  function close() {
    list.classList.add('hidden');
    trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', onDocClick, true);
    document.removeEventListener('keydown', onKey);
  }
  function toggle() {
    if (list.classList.contains('hidden')) open(); else close();
  }
  function onDocClick(e) {
    if (!wrap.contains(e.target)) close();
  }
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); trigger.focus(); }
  }

  function syncFromSelect() {
    const opt = select.options[select.selectedIndex];
    label.textContent = '';
    label.classList.add('flex', 'items-center', 'gap-2');

    if (isDifficulty) {
      const dot = document.createElement('span');
      dot.className = `inline-block h-2.5 w-2.5 rounded-full ${getDifficultyDotClass(select.value)}`;
      label.appendChild(dot);
    }
    label.appendChild(document.createTextNode(opt ? opt.textContent : '—'));

    Array.from(list.children).forEach((btn) => {
      const active = btn.dataset.value === select.value;
      btn.classList.toggle('bg-zinc-900/5 dark:bg-white/10', active);
      btn.setAttribute('aria-selected', String(active));
      if (!isDifficulty) {
        const check = btn.querySelector('svg');
        if (check) check.style.visibility = active ? 'visible' : 'hidden';
      }
    });
  }

  select.addEventListener('change', syncFromSelect);
  trigger.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });

  syncFromSelect();

  return { wrap, select, trigger, list, syncFromSelect };
}

function getDifficultyDotClass(v) {
  const base = String(v || '').toLowerCase();
  if (base === 'playtest') return 'bg-emerald-400';
  if (base === 'off') return 'bg-zinc-500';

  const key = base.replace(/[+\-]/g, '');
  switch (key) {
    case 'easy':      return 'bg-emerald-400';
    case 'medium':    return 'bg-yellow-400';
    case 'hard':      return 'bg-orange-400';
    case 'veryhard':  return 'bg-orange-500';
    case 'extreme':   return 'bg-red-500';
    case 'hell':      return 'bg-rose-500';
    default:          return 'bg-zinc-500';
  }
}

function initGlobalSettingsDropdowns(modalEl) {
  const ids = [
    'editorModeToggle',
    'difficultyHUDSelect',
    'playtestToggle',
    'validatorToggle',
    'portalsToggle',
    'mapVariantSelect',
  ];
  ids.forEach((id) => {
    const sel = modalEl.querySelector('#' + id);
    if (sel) createCustomDropdownFromSelect(sel);
  });
}



//IT 
//IS
//OVER
//7000