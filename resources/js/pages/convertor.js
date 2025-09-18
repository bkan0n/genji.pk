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

const GLOBAL_BANS = [
  'Ban Multiclimb ■ 封禁蹭留 ■ 무한 벽타기 금지',
  'Ban Deathbhop ■ 封禁死小 ■ 죽음 콩콩이 금지',
  'Ban Standcreate ■ 封禁站卡 ■ 서서 콩콩이 생성 금지',
  'Ban Emote Savehop ■ 封禁表情留小 ■ 감정표현 콩콩이 금지',
  'Ban Wallclimb ■ 封禁爬墙 ■ 벽타기 금지',
  'Ban Save Double ■ 封禁留二段跳 ■ 이단점프 킵 금지',
  'Require Bhop Available ■ 留小跳进点 ■ 도착 시 콩콩이 필요',
  'Require Djump Available ■ 留二段跳进点 ■ 도착 시 이단 점프 필요',
];

const ADDON_RULE_TITLES = [
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
];

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

/*----- Multilang ------*/
function t(path, params = {}) {
  const parts = path.split('.');
  let result = translations;
  for (const part of parts) {
    result = result?.[part];
    if (!result) break;
  }
  if (typeof result !== 'string') return path; // fallback lisible
  for (const k in params) result = result.replace(`{${k}}`, params[k]);
  return result;
}
/*----- Check translations------*/
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

// Écrit un fichier côté serveur via ton endpoint déjà utilisé ailleurs
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

// Récupère le .ts source sur le CDN
async function fetchTsSource(tsName) {
  const url = TS_BASE + tsName;
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
  return await res.text();
}

function extractExportExpression(tsText) {
  // 1) retirer les commentaires /* ... */ et // ...
  const noComments = tsText.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^\:])\/\/.*$/gm, '$1');

  // 2) localiser le début de l'expression exportée
  let startExpr = -1;

  // a) export default { ... } / [ ... ]
  const mDefault = noComments.match(/export\s+default\s*/);
  if (mDefault) {
    startExpr = mDefault.index + mDefault[0].length;
  } else {
    // b) export const NAME [: type] = ...
    //    (autorise une annotation de type facultative avant le "=")
    const mConst = noComments.match(/export\s+const\s+[A-Za-z0-9_$]+(?:\s*:\s*[^=;]+)?\s*=\s*/);
    if (!mConst) {
      throw new Error('Export introuvable');
    }
    startExpr = mConst.index + mConst[0].length;
  }

  // 3) sauter les espaces
  while (/\s/.test(noComments[startExpr])) startExpr++;

  // 4) déterminer le délimiteur (objet/array)
  const open = noComments[startExpr];
  const pairs = { '{': '}', '[': ']' };
  const close = pairs[open];
  if (!close) throw new Error("Expression exportée inattendue (pas d'objet/array)");

  // 5) parcours naïf avec gestion des chaînes pour trouver la fermeture
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

  // 6) extraire juste le littéral { … } ou [ … ]
  return noComments.slice(startExpr, i + 1).trim();
}

// Convertit l’expression JS en valeur (objet/array) SANS dépendances
function evalExportExpressionToValue(expr) {
  // eslint-disable-next-line no-new-func
  const fn = new Function(`"use strict"; return (${expr});`);
  return fn();
}

// Construit le JSON à partir du .ts
async function compileTsToJson(tsName) {
  const tsText = await fetchTsSource(tsName);

  // 1) chemin “normal” (export default / export const … = …)
  try {
    const expr = extractExportExpression(tsText);
    const value = evalExportExpressionToValue(expr);
    return JSON.stringify(value, null, 2) + '\n';
  } catch (e) {
    // 2) fallback pour localizedStrings.ts (ou tout fichier avec //begin-json)
    if (tsName === 'localizedStrings.ts' || tsText.includes('//begin-json')) {
      const raw = extractBeginJsonBlock(tsText);
      if (!raw) throw e;

      // certaines versions peuvent avoir des virgules trainantes → on tente un parse “strict”, puis un nettoyage doux
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

// Procédure principale : vérifie tout et compile ce qui manque
async function ensureTranslationsPresent() {
  const missing = [];
  for (const jsonName of TRANSLATION_FILES) {
    const ok = await translationExists(jsonName);
    if (!ok) missing.push(jsonName);
  }
  if (!missing.length) return;

  // compile et sauvegarde ce qui manque
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

// Lance la vérification/compilation très tôt au chargement
document.addEventListener('DOMContentLoaded', () => {
  ensureTranslationsPresent().catch(console.error);
});

/*----- Copy ------*/
async function copyToClipboard(text) {
  // API moderne (HTTPS/localhost)
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text ?? '');
      return true;
    } catch (_) {
      /* on tentera le fallback */
    }
  }

  // Fallback execCommand
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

// --- Toasts ---
function showToast(message, ok = true) {
  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.className = `fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] rounded-xl px-4 py-2 text-sm shadow-2xl border
    transition-all duration-300 opacity-0 translate-y-2
    ${ok ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30' : 'bg-rose-500/20 text-rose-200 border-rose-400/30'}`;
  el.textContent = message;
  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.classList.remove('opacity-0', 'translate-y-2');
  });

  setTimeout(() => {
    el.classList.add('opacity-0', 'translate-y-2');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
  }, 1400);
}
function showConfirmationMessage(m) {
  showToast(m, true);
}
function showErrorMessage(m) {
  showToast(m, false);
}

/*----- selectSection ------*/
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
  const INACTIVE = ['text-white', 'hover:bg-white/10'];

  // normalise classes
  Object.values(btns).forEach((b) => {
    b.classList.add('tab-btn', 'transition-colors', 'duration-300');
    // on met tous inactifs par défaut, l’actif sera posé plus bas
    b.classList.remove(...ACTIVE);
    if (!INACTIVE.every((c) => b.classList.contains(c))) b.classList.add(...INACTIVE);
  });

  // applique les classes actives/inactives sur les boutons
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

  // petite animation d’apparition sur les panneaux
  function showPanel(key) {
    Object.entries(panels).forEach(([k, p]) => {
      if (k === key) {
        p.classList.remove('hidden');
        p.classList.add('tab-panel-enter');
        // force reflow pour lancer la transition
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

  // fonction publique de switch
  function switchTab(key) {
    setActiveButton(key);
    showPanel(key);
  }

  // listeners
  btns.convert.addEventListener('click', () => switchTab('convert'));
  btns.help.addEventListener('click', () => switchTab('help'));
  btns.settings.addEventListener('click', () => switchTab('settings'));

  // état initial (ton HTML démarre déjà sur Convert map)
  switchTab('convert');
}

// init quand le DOM est prêt
document.addEventListener('DOMContentLoaded', initMainTabs);

/* -------------- Boutons Convert & Copy -------------- */
document.addEventListener('DOMContentLoaded', async () => {
  selectSection('convertMap');

  const btnConvert = document.getElementById('convert-btn');
  const btnTranslate = document.getElementById('translate-btn');
  const btnCopy = document.querySelector('.copy-btn');
  const textarea = document.querySelector('.mapdata');
  const langEl = document.getElementById('lang');
  const targetEl = document.getElementById('targetLang');

  btnConvert.addEventListener('click', async () => {
    isEditMode = false;
    const editModeBtn = document.getElementById('editModeBtn');
    if (editModeBtn) editModeBtn.textContent = t('map_data.edit_mode');
    document
      .querySelectorAll('.checkpoint-card')
      .forEach((card) => card.classList.remove('editable'));

    showLoader();
    btnConvert.disabled = true;
    btnConvert.textContent = 'Processing…';
    try {
      const lang = langEl.value || 'en-US';
      const fullText = textarea.value;

      const resultTpl = await doConvert(fullText, lang);

      textarea.value = resultTpl;
      renderMapSettings(fullText);
    } catch (err) {
      console.error(err);
      showErrorMessage('Error: ' + err.message);
    } finally {
      hideLoader();
      btnConvert.disabled = false;
      btnConvert.textContent = t('map_data.convert_data');
      await checkForDiff();
    }
  });

  btnTranslate.addEventListener('click', async () => {
    isEditMode = false;
    const editModeBtn = document.getElementById('editModeBtn');
    if (editModeBtn) editModeBtn.textContent = t('map_data.edit_mode');
    document
      .querySelectorAll('.checkpoint-card')
      .forEach((card) => card.classList.remove('editable'));

    const clientLang = langEl.value || 'en-US';
    const targetLang = targetEl.value || 'en-US';
    const fullText = textarea.value;

    const tpl = await doTranslate(fullText, clientLang, targetLang);

    textarea.value = tpl;
    renderMapSettings(fullText);
    await checkForDiff();
  });

  btnCopy.addEventListener('click', async () => {
    const text = textarea?.value ?? '';

    const ok = await copyToClipboard(text);

    if (ok) {
      // Succès
      showConfirmationMessage(t('newsfeed.copy_clipboard') || 'Copié dans le presse-papiers');
    } else {
      // Échec
      showErrorMessage(t('newsfeed.copy_clipboard_error') || 'Échec de la copie');
    }
  });

  if (btnConvert) {
    btnConvert.addEventListener('click', () => {
      setTimeout(addGlobalSettingsButton, 100);
    });
  }
  if (btnTranslate) {
    btnTranslate.addEventListener('click', () => {
      setTimeout(addGlobalSettingsButton, 100);
    });
  }
});

/* ------- Translations framework ------- */
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
  // Lang keys style "en", "en-US", "pt-BR", etc.
  const LANG_KEY_RE = /^[a-z]{2}(?:-[A-Z]{2})?$/;
  const unified = {};

  // Tous les dictionnaires textuels (on exclut "icons" qui a un format à part)
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

      // Si l'objet courant ressemble à un enregistrement de traductions (lang -> string)
      const langKeys = Object.keys(entry).filter(
        (k) => LANG_KEY_RE.test(k) && typeof entry[k] === 'string'
      );

      if (langKeys.length) {
        for (const lang of langKeys) {
          const val = entry[lang];
          if (typeof val !== 'string') continue;
          if (!unified[lang]) unified[lang] = {};
          // ne remplace pas si déjà défini (évite écrasements imprévisibles)
          if (unified[lang][engKey] == null) {
            unified[lang][engKey] = val;
          }
        }
      } else {
        // Sinon, on descend (cas des structures imbriquées comme localizedStrings/customGameSettings)
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

function getActiveOutputLang() {
  // Si l'utilisateur est passé par doTranslate, on force l'écriture dans la langue cible
  if (__lastTranslateCtx.used && __lastTranslateCtx.targetLang)
    return __lastTranslateCtx.targetLang;
  // Sinon on retombe sur la langue du sélecteur (comportement d'avant)
  const langEl = document.getElementById('lang');
  return (langEl && langEl.value) || CURRENT_LANG || 'en-US';
}

function translateWorkshopValuesOnly(block, sourceLang, targetLang) {
  if (!block || !block.trim()) return block;

  const lines = block.split(/\r?\n/);

  const out = lines.map((raw) => {
    // on préserve les lignes vides / décoratives telles quelles
    if (!raw.trim()) return raw;

    // cherche le DERNIER ":" ou "：" sur la ligne (au cas où il y en ait dans l'intitulé)
    let lastColon = Math.max(raw.lastIndexOf(':'), raw.lastIndexOf('：'));
    if (lastColon === -1) return raw; // pas de séparateur -> on ne touche pas

    const left = raw.slice(0, lastColon + 1); // incluant le séparateur
    const right = raw.slice(lastColon + 1); // la valeur à traduire

    // séparer valeur et éventuel commentaire inline (on garde tout ce qu'il y a après)
    // ex: " ON   // note" -> value=" ON  ", tail="// note"
    const m = right.match(/^(\s*)(.*?)(\s*(?:\/\/.*)?)\s*$/);
    if (!m) {
      // cas bizarre: on traduit tout right
      return left + translateFromTo(right, sourceLang, targetLang);
    }
    const leading = m[1] || '';
    const core = m[2] || '';
    const tail = m[3] || '';

    // traduit UNIQUEMENT la valeur "core"
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

// --- helpers normalisation ---
function _stripMarkup(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, '') // <tx...> <fg...> etc.
    .replace(/\[[^\]]*?\]/g, (m) => m); // garder [..] s'il y en a (au cas où)
}
function _normalizeLabel(s) {
  return _stripMarkup(s)
    .replace(/\u00A0/g, ' ') // nbsp
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

// index inversés pour le fallback global : "libellé localisé" -> "clé anglaise"
function _buildReverseKeywordIndex(unified, lang) {
  const src = (unified && unified[lang]) || {};
  const rev = new Map();
  for (const [engKey, localized] of Object.entries(src)) {
    if (typeof localized === 'string') rev.set(_normalizeLabel(localized), engKey);
  }
  return rev;
}

// --- helpers pour labels paramétrés et jeux de valeurs partagés ---
function stripPlaceholder(label) {
  return _normalizeLabel(
    String(label || '')
      .replace(/%1\$\s*s|%1\s*\$s|%1s|%1\$\w|%1\$\s*\w|%1\w|%1\$\s*|%1/g, '')
      .replace(/%1\$\s*?s|%1\s*?s|%1s/g, '')
  );
}
function detectTeamIndexFromKey(rawKey) {
  const m = /([12])/.exec(rawKey);
  return m ? m[1] : null; // "1" ou "2"
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

/* --- CG-only helpers (lobby) --- */
function resolveValuesObjectFor_CGOnly(settingEntry, cgRoot) {
  if (!settingEntry) return null;
  const ref = settingEntry.values;
  if (!ref) return null;
  if (typeof ref === 'object') return ref; // inline values
  if (typeof ref === 'string') return cgRoot[ref] || null; // référencé dans CG
  return null;
}

function _indexCustomGameSettings_CGOnly(cg) {
  const settingByLabel = new Map(); // libellé normalisé -> id
  const valuesBySetting = new Map(); // id -> Map(libellé normalisé -> valueId)
  const entryById = new Map(); // id -> entrée CG

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

    // enfants dans values
    if (node && node.values && typeof node.values === 'object') {
      for (const [k, v] of Object.entries(node.values)) {
        if (v && typeof v === 'object') visit(v, k);
      }
    }
    // autres sous-objets
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

/* Détecte Team1/Team2 pour un libellé concret, en comparant aux libellés CG + other.json */
function detectTeamIdxUsingCgAndOther(rawKey, sourceLang, cg) {
  const norm = (s) => _normalizeLabel(s || '');

  const t1Label = cg.team1Slots && (cg.team1Slots[sourceLang] || cg.team1Slots['en-US']);
  const t2Label = cg.team2Slots && (cg.team2Slots[sourceLang] || cg.team2Slots['en-US']);

  const sTeam1 = teamNameFromOther('1', sourceLang);
  const sTeam2 = teamNameFromOther('2', sourceLang);

  // Concrétise les libellés en remplaçant %1$s par le nom d’équipe localisé
  const concretize = (tmpl, teamName) =>
    typeof tmpl === 'string' ? tmpl.replace(/%1\s*\$?s/gi, teamName) : null;

  const t1Concrete = concretize(t1Label, sTeam1);
  const t2Concrete = concretize(t2Label, sTeam2);

  const keyN = norm(rawKey);
  if (t1Concrete && norm(t1Concrete) === keyN) return '1';
  if (t2Concrete && norm(t2Concrete) === keyN) return '2';

  // fallback doux : si la clé “sans placeholder” commence comme le gabarit CG “sans placeholder”
  const keyNoParam = stripPlaceholder(rawKey);
  const t1Base = t1Label ? stripPlaceholder(t1Label) : null;
  const t2Base = t2Label ? stripPlaceholder(t2Label) : null;
  if (t1Base && norm(keyNoParam).startsWith(norm(t1Base))) return '1';
  if (t2Base && norm(keyNoParam).startsWith(norm(t2Base))) return '2';

  // dernier filet: chiffre «1|2» dans la clé
  const m = /(^|\D)([12])(\D|$)/.exec(rawKey);
  return m ? m[2] : null;
}

const __otherRevCache = Object.create(null);

function _revOtherLabels(lang) {
  if (__otherRevCache[lang]) return __otherRevCache[lang];
  const other = (allTranslations && allTranslations.other) || {};
  const rev = new Map(); // norm(label) -> Set(keys)
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
  // candidates = Set<string> par ex. {"__off__", "__no__"}
  const enableCtx = _isEnableContext(rawKey);
  const prefEnable = ['__on__', '__off__', '__yes__', '__no__'];
  const prefGeneric = ['__yes__', '__no__', '__on__', '__off__'];
  const order = enableCtx ? prefEnable : prefGeneric;

  for (const k of order) if (candidates.has(k)) return k;
  // sinon, premier arbitraire
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

/* --- LOBBY BLOCK --- */
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

      // 1) identifier le réglage (clé)
      let settingId = settingByLabel.get(normKey) || null;
      let teamIdx = null;

      // Cas particulier : team slots où le libellé concret contient le nom d’équipe
      if (!settingId) {
        teamIdx = detectTeamIdxUsingCgAndOther(rawKey, sourceLang, cg);
        if (teamIdx === '1') settingId = 'team1Slots';
        else if (teamIdx === '2') settingId = 'team2Slots';
      }

      // 2) traduction de la clé via CG (avec substitution %1$s par other.json)
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

      // 3) traduction de la valeur
      let newValue = rawValue;
      let translatedViaCG = false;

      if (settingId) {
        const entry = entryById.get(settingId);
        if (entry) {
          const vmap = valuesBySetting.get(settingId);
          let valId = vmap ? vmap.get(_normalizeLabel(rawValue)) : null;

          const valuesObj = resolveValuesObjectFor_CGOnly(entry, cg);
          if (!valId && valuesObj) {
            // correspondance “par n’importe quelle langue” mais toujours dans CG
            valId = findValueIdByAnyLang(valuesObj, rawValue);
          }

          if (valId && valuesObj && valuesObj[valId]) {
            newValue = valuesObj[valId][targetLang] || valuesObj[valId]['en-US'] || rawValue;
            translatedViaCG = true;
          }
        }
      }

      // 3bis) fallback other.json (si CG n’a pas pu traduire la valeur)
      if (!translatedViaCG) {
        const viaOther = translateValueUsingOther(rawValue, rawKey, sourceLang, targetLang);
        if (viaOther) newValue = viaOther;
      }

      return `${newKey}: ${newValue}`;
    })
    .join('\n');
}

/* ------- Cache, overpy  ------- */
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
  let paren = 0,
    brace = 0;
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
  const def = usesCallSyntax
    ? '#!define editorDefaultOn() false\n'
    : '#!define editorDefaultOn false\n';

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
    if (!m) {
      debug(`[compile] importHero: héros introuvable dans: ${arg}`);
      return '';
    }
    const heroKey = m[1].toUpperCase();
    const file = HERO_FILE_MAP[heroKey];
    if (!file) {
      debug(`[compile] importHero: mapping manquant pour ${heroKey}`);
      return '';
    }
    debug(`[compile] importHero → #!include "${file}"`);
    return `#!include "${file}"`;
  });

  return src;
}

async function loadTemplate(lang) {
  // On pointe directement vers /public/framework-templates/
  const cacheUrl = `/framework-templates/framework-template_${lang}.js`;

  // 1) Tenter d'utiliser le cache déjà généré côté serveur
  try {
    const probe = await fetch(cacheUrl, { method: 'GET', cache: 'no-cache' });
    if (probe.ok) {
      debug(`Loading from cache for ${lang} [${cacheUrl}]`);
      try {
        // @vite-ignore évite la réécriture par le bundler, ?v=... bust le cache ESM
        const mod = await import(/* @vite-ignore */ `${cacheUrl}?v=${Date.now()}`);
        if (mod && typeof mod.frameworkTemplate === 'string') {
          return mod.frameworkTemplate;
        } else {
          console.warn(
            `[loadTemplate] Module présent mais export "frameworkTemplate" manquant. Recompilation…`
          );
        }
      } catch (e) {
        console.warn(`[loadTemplate] Échec de l'import dynamique du cache. Recompilation…`, e);
      }
    } else {
      debug(`Cache miss (${probe.status}) pour ${lang} → compilation.`);
    }
  } catch (e) {
    console.debug(`[loadTemplate] Probe cacheUrl échouée, on compile :`, e);
  }

  // 2) Compiler et sauvegarder
  debug(`Compiling new template for ${lang}`);
  const overpy = window.window || window.OverPy || window.Overpy;
  if (!overpy) throw new Error('OverPy UMD not found');
  await overpy.readyPromise;

  const rawBase = 'https://cdn.jsdelivr.net/gh/tylovejoy/genji-framework@1.10.4A/';
  const entryFile = 'framework.opy';
  const resp = await fetch(rawBase + entryFile);
  if (!resp.ok) throw new Error(`HTTP ${resp.status} on ${entryFile}`);
  let src = await resp.text();

  // Pré-traitements identiques à ta version
  src = expandImportHeroToInclude(src);
  src = await inlineIncludes(src, rawBase);
  src = cleanSourceG(src);
  src = patchTestDataStub(src);
  src = addMapPolyfills(src);
  src = patchEditorDefaultOn(src);

  if (lang === 'zh-CN') {
    src = src.replace(/^[ \t]*#!define\s+enableInvisCommand[^\n]*\n?/gm, '');
    src = '#!define enableInvisCommand false\n' + src;
    debug('Désactivation de enableInvisCommand pour zh-CN');
  }

  const underflow = findFirstBraceUnderflow(src);
  if (underflow) {
    const lines = src.split('\n');
    const center = underflow.line;
    const from = Math.max(0, center - 15);
    const to = Math.min(lines.length, center + 15);
    console.debug(
      '[FIRST UNDERFLOW at line ' +
        center +
        ']\n' +
        lines
          .slice(from, to)
          .map((l, i) => String(from + i + 1).padStart(3, ' ') + ' ' + l)
          .join('\n')
    );
  }
  console.debug(
    '[SRC HEAD]\n' +
      src
        .split('\n')
        .slice(0, 60)
        .map((l, i) => String(i + 1).padStart(3, ' ') + ' ' + l)
        .join('\n')
  );

  const { result } = await overpy.compile(src, lang, rawBase, entryFile);
  const tpl = result;

  // Sauvegarde du module ESM côté serveur (Laravel doit écrire dans /public/framework-templates/)
  const esc = tpl.replace(/\\/g, '\\\\').replace(/`/g, '\\`');
  const moduleText =
    `// framework-template_${lang}.js (auto)\n` +
    `export const frameworkTemplate = \`${esc}\n\`;\n`;

  try {
    const saveRes = await fetch(
      `/api/compile?file=framework-templates/framework-template_${lang}.js`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: moduleText }),
      }
    );
    if (!saveRes.ok) {
      console.warn(
        "[loadTemplate] Échec d'écriture du cache:",
        saveRes.status,
        await saveRes.text()
      );
    } else {
      debug(`Cache saved as framework-template_${lang}.js`);
    }
  } catch (e) {
    console.warn('[loadTemplate] Erreur lors de la sauvegarde du cache :', e);
  }

  return tpl;
}

/* ------- MAP DATA RULE ------- */
function buildRule(mapdata, lang) {
  const NEW_TITLE = 'Ø Map Data - 数据录入 <---- INSERT HERE / 在这输入';
  const body = (mapdata || '')
    .trim()
    .split('\n')
    .map((l) => '    ' + l)
    .join('\n');

  const L = {
    'zh-CN': { rule: '规则', event: '事件', action: '动作', ongoing: '持续 - 全局', spaced: false },
    'ko-KR': {
      rule: 'rule',
      event: 'event',
      action: 'action',
      ongoing: 'Ongoing - Global',
      spaced: false,
    },
    'ja-JP': {
      rule: 'ルール',
      event: 'イベント',
      action: 'アクション',
      ongoing: '進行中 - グローバル',
      spaced: false,
    },
    'ru-RU': {
      rule: 'rule',
      event: 'event',
      action: 'actions',
      ongoing: 'Ongoing - Global',
      spaced: true,
    },
    'es-MX': {
      rule: 'regla',
      event: 'evento',
      action: 'acciones',
      ongoing: 'En curso - Global',
      spaced: true,
    },
    'pt-BR': {
      rule: 'regra',
      event: 'evento',
      action: 'ações',
      ongoing: 'Em andamento - Global',
      spaced: true,
    },
    'de-DE': {
      rule: 'regel',
      event: 'event',
      action: 'aktionen',
      ongoing: 'Ongoing - Global',
      spaced: true,
    },
    default: {
      rule: 'rule',
      event: 'event',
      action: 'actions',
      ongoing: 'Ongoing - Global',
      spaced: true,
    },
  };

  const t = L[lang] || L.default;
  const space = t.spaced ? ' ' : '';

  return `${t.rule}${space}("${NEW_TITLE}") {
    ${t.event}
    {
        ${t.ongoing};
    }

    ${t.action}
    {
${body}
    }
}`;
}

function replaceMapData(tpl, newRule, lang = getActiveOutputLang()) {
  const markers = [
    '<tx0C0000000000D297><fg00FFFFFF> Map Data - 数据录入 <---- INSERT HERE',
    'Ø Map Data - 数据录入 <---- INSERT HERE / 在这输入',
  ];

  let startRule;
  if (lang === 'zh-CN') startRule = '规则';
  else if (lang === 'ja-JP') startRule = 'ルール';
  else if (lang === 'es-MX') startRule = 'regla';
  else if (lang === 'pt-BR') startRule = 'regra';
  else if (lang === 'de-DE') startRule = 'regel';
  else startRule = 'rule';

  let markerIdx = -1,
    usedMarker = null;
  for (const m of markers) {
    const idx = tpl.indexOf(m);
    if (idx >= 0) {
      markerIdx = idx;
      usedMarker = m;
      break;
    }
  }
  if (markerIdx < 0) {
    console.warn(`replaceMapData : marqueur non trouvé, on conserve le texte original.`);
    return tpl;
  }

  const start = tpl.lastIndexOf(startRule, markerIdx);
  if (start < 0) {
    console.warn(
      `replaceMapData : début de règle ("${startRule}") introuvable, on conserve le texte original.`
    );
    return tpl;
  }

  let brace = 0,
    end = -1;
  for (let i = start; i < tpl.length; i++) {
    if (tpl[i] === '{') brace++;
    else if (tpl[i] === '}') {
      brace--;
      if (brace === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end < 0) {
    console.warn(`replaceMapData : fin de règle introuvable, on conserve le texte original.`);
    return tpl;
  }

  return tpl.slice(0, start) + newRule + tpl.slice(end);
}

function extractMapDataBlock(fullText, lang) {
  const markers = [
    'Ø Map Data - 数据录入 <---- INSERT HERE / 在这输入',
    '<tx0C0000000000D297><fg00FFFFFF> Map Data - 数据录入 <---- INSERT HERE / 在这输入',
    '<tx0C0000000000D297><fg00FFFFFF> Map Data - 数据录入 <---- INSERT HERE / 在这入力',
    '<tx0C0000000000D297><fg00FFFFFF> Map Data - 数据录入 <---- INSERT HERE',
    '<tx0C0000000000D297><fg00FFFFFF> Map Data - 数据录入 <---- INSERT HERE',
    'Map Data <---- INSERT YOUR MAP DATA HERE',
    'Map Data     <---- INSERT YOUR MAP DATA HERE"',
    'Map Data - 数据录入 <---- INSERT HERE / 在这输入',
  ];

  let headerIdx = -1;
  for (const m of markers) {
    const idx = fullText.indexOf(m);
    if (idx >= 0) {
      headerIdx = idx;
      break;
    }
  }
  if (headerIdx < 0) {
    showErrorMessage('No map data rule found');
    return '';
  }

  const afterHeader = fullText.slice(headerIdx);

  let actionsRegex;
  if (lang === 'zh-CN') actionsRegex = /动作\s*\{\s*([\s\S]*?)\s*\}/i;
  else if (lang === 'ko-KR') actionsRegex = /action\s*\{\s*([\s\S]*?)\s*\}/i;
  else if (lang === 'ja-JP') actionsRegex = /アクション\s*\{\s*([\s\S]*?)\s*\}/i;
  else if (lang === 'ru-RU') actionsRegex = /actions\s*\{\s*([\s\S]*?)\s*\}/i;
  else if (lang === 'es-MX') actionsRegex = /acciones\s*\{\s*([\s\S]*?)\s*\}/i;
  else if (lang === 'pt-BR') actionsRegex = /ações\s*\{\s*([\s\S]*?)\s*\}/i;
  else if (lang === 'de-DE') actionsRegex = /aktionen\s*\{\s*([\s\S]*?)\s*\}/i;
  else actionsRegex = /actions\s*\{\s*([\s\S]*?)\s*\}/i;

  const actionsMatch = afterHeader.match(actionsRegex);
  if (!actionsMatch || !actionsMatch[1]) {
    return '';
  }
  return actionsMatch[1].trim();
}

/* ------- LOBBY BLOCK ------- */
function extractLobbyBlock(fullText, lang) {
  let keyword;
  switch (lang) {
    case 'es-MX':
      keyword = 'sala de espera';
      break;
    case 'de-DE':
      keyword = 'Lobby';
      break;
    case 'ja-JP':
      keyword = 'ロビー';
      break;
    case 'ko-KR':
      keyword = 'lobby';
      break;
    case 'ru-RU':
      keyword = 'lobby';
      break;
    case 'zh-CN':
      keyword = '大厅';
      break;
    case 'pt-BR':
      keyword = 'lobby';
      break;
    default:
      keyword = 'lobby';
      break;
  }

  const regexHeader = new RegExp(`^\\s*${keyword}\\s*\\{`, 'im');
  const matchHeader = fullText.match(regexHeader);
  if (!matchHeader) return '';

  const startIdx = fullText.indexOf('{', matchHeader.index);
  if (startIdx < 0) return '';

  let level = 1,
    i = startIdx + 1;
  for (; i < fullText.length; i++) {
    if (fullText[i] === '{') level++;
    else if (fullText[i] === '}') {
      level--;
      if (level === 0) break;
    }
  }
  if (level !== 0) return '';

  const inside = fullText.slice(startIdx + 1, i);
  return inside.trim();
}

function insertLobbyIntoTemplate(tpl, lobbyContent, lang = getActiveOutputLang()) {
  let keyword;
  switch (lang) {
    case 'es-MX':
      keyword = 'sala de espera';
      break;
    case 'de-DE':
      keyword = 'Lobby';
      break;
    case 'ja-JP':
      keyword = 'ロビー';
      break;
    case 'ko-KR':
      keyword = 'lobby';
      break;
    case 'ru-RU':
      keyword = 'lobby';
      break;
    case 'zh-CN':
      keyword = '大厅';
      break;
    case 'pt-BR':
      keyword = 'lobby';
      break;
    default:
      keyword = 'lobby';
  }

  const regexHeader = new RegExp(`^\\s*${keyword}\\s*\\{`, 'm');
  const m = tpl.match(regexHeader);
  if (!m) return tpl;

  const startBrIdx = tpl.indexOf('{', m.index);
  if (startBrIdx < 0) return tpl;

  let level = 1,
    i = startBrIdx + 1;
  for (; i < tpl.length; i++) {
    if (tpl[i] === '{') level++;
    else if (tpl[i] === '}') {
      level--;
      if (level === 0) break;
    }
  }
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

/* ------- Extract & insert difficulty ------- */
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

/* ----------------- Utilitaires de parsing ----------------- */
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
  let v = extractWorkshopHudIndex(fullText);
  if (v === null) v = extractWorkshopHudIndexLoose(fullText);
  if (v !== null) {
    logDiff('extractDifficultyValue: priorité workshop =', v);
    return v;
  }

  const g = extractIndexFromGlobalArray(fullText);
  if (g !== null) {
    logDiff('extractDifficultyValue: fallback global array =', g);
    return g;
  }

  const s = extractIndexFromSetGlobal(fullText);
  if (s !== null) {
    logDiff('extractDifficultyValue: fallback set global =', s);
    return s;
  }

  logDiff('extractDifficultyValue: aucune valeur trouvée');
  return null;
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
  const diffElem = document.getElementById('difficultyHUDSelect');
  if (!diffElem) {
    if (typeof logDiff === 'function')
      logDiff('fillDifficultyFieldsFromValue: #difficultyHUDSelect introuvable');
    return;
  }

  const TOKEN_TO_INDEX = Object.fromEntries(DIFFICULTY_MAP.map((t, i) => [t, i]));

  function normToken(s) {
    if (s == null) return null;
    s = String(s)
      .replace(/<[^>]*>/g, '')
      .toLowerCase()
      .trim();

    s = s
      .replace(/\s+/g, ' ')
      .replace(/very\s*hard/g, 'veryhard')
      .replace(/do\s*not\s*display|don['’]?\s*t\s*display|不显示|표시\s*x/i, 'off');

    s = s.replace(/\s*\+\s*$/, '+').replace(/\s*-\s*$/, '-');

    if (/^playtest/.test(s)) return 'playtest';
    if (/^easy\+$/.test(s)) return 'easy+';
    if (/^easy-$/.test(s)) return 'easy-';
    if (/^easy$/.test(s)) return 'easy';
    if (/^medium\+$/.test(s)) return 'medium+';
    if (/^medium-$/.test(s)) return 'medium-';
    if (/^medium$/.test(s)) return 'medium';
    if (/^hard\+$/.test(s)) return 'hard+';
    if (/^hard-$/.test(s)) return 'hard-';
    if (/^hard$/.test(s)) return 'hard';
    if (/^veryhard\+$/.test(s)) return 'veryhard+';
    if (/^veryhard-$/.test(s)) return 'veryhard-';
    if (/^veryhard$/.test(s)) return 'veryhard';
    if (/^extreme\+$/.test(s)) return 'extreme+';
    if (/^extreme-$/.test(s)) return 'extreme-';
    if (/^extreme$/.test(s)) return 'extreme';
    if (/^hell$/.test(s)) return 'hell';
    if (/^off$/.test(s)) return 'off';

    return s;
  }

  let index = null;
  if (diffValue != null && /^\s*\d+\s*$/.test(String(diffValue))) {
    index = parseInt(String(diffValue).trim(), 10);
  } else if (diffValue != null) {
    const tok = normToken(diffValue);
    if (tok && TOKEN_TO_INDEX.hasOwnProperty(tok)) index = TOKEN_TO_INDEX[tok];
  }

  if (index == null || !Number.isFinite(index)) {
    if (typeof logDiff === 'function')
      logDiff('fillDifficultyFieldsFromValue: diffValue illisible =', diffValue);
    return;
  }

  const maxIdx = Math.min(DIFFICULTY_MAP.length - 1, Math.max(0, diffElem.options.length - 1));
  if (index > maxIdx) index = maxIdx;
  if (index < 0) index = 0;

  try {
    diffElem.selectedIndex = index;
  } catch (_) {}

  const wantedToken = DIFFICULTY_MAP[index];
  if (diffElem.value !== wantedToken) {
    let matched = false;
    for (let i = 0; i < diffElem.options.length; i++) {
      const opt = diffElem.options[i];
      if ((opt.value || '').toLowerCase() === wantedToken) {
        diffElem.selectedIndex = i;
        matched = true;
        break;
      }
    }

    if (!matched) {
      for (let i = 0; i < diffElem.options.length; i++) {
        const opt = diffElem.options[i];
        const label = String(opt.text || opt.label || '').toLowerCase();
        if (
          label.includes(
            wantedToken.replace('+', ' + ').replace('-', ' - ').replace('veryhard', 'very hard')
          )
        ) {
          diffElem.selectedIndex = i;
          matched = true;
          break;
        }
      }
    }
  }

  if (typeof logDiff === 'function') {
    logDiff(
      'fillDifficultyFieldsFromValue: input =',
      diffValue,
      '=> index =',
      index,
      'token =',
      DIFFICULTY_MAP[index]
    );
    const chosen = diffElem.options[diffElem.selectedIndex];
    logDiff(
      'fillDifficultyFieldsFromValue: UI set to idx',
      diffElem.selectedIndex,
      'value',
      chosen && chosen.value,
      'text',
      chosen && chosen.text
    );
  }
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
      logDiff('applyDifficultyValue: workshop: aucune ligne HUD à modifier');
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
        re.lastIndex = openSet + 1 + newComboBody.length; // reprendre après remplacement
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

/* ------- MODE MAP NAME BLOCK ------- */
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
    if (enabledMatch) {
      const insideEnabled = enabledMatch[1].trim();
      const lines = insideEnabled.split(/\r?\n/);
      for (let rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;
        const tokens = line.split(/\s+/);
        if (tokens.length < 2) continue;
        const possibleId = tokens[tokens.length - 1];
        if (/^\d{8,}$/.test(possibleId)) {
          const fullMapEntry = tokens.join(' ');
          result[modeNameRaw] = fullMapEntry;
          break;
        }
      }
    }
  }

  return result;
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

/* ------- CREDITS AND COLORS RULE ------- */
function extractMapCredits(fullText, lang) {
  // Titres possibles (nouveau + historiques)
  const TITLE_CANDIDATES = [
    '☞ Credits and Colors here - 作者代码HUD颜色 <---- INSERT HERE / 在这输入',
    '<tx0C00000000044B55><fg0FFFFFFF> Credits and Colors here - 作者代码HUD颜色 <---- INSERT HERE / 在这输入',
    '<tx0C00000000044B55><fg0FFFFFFF> Credits and Colors here - 作者代码HUD颜色 <---- INSERT HERE',
    'Credits here - 作者名字 <---- INSERT HERE / 在这入力',
    'Credits here - 作者名字 <---- INSERT HERE / 在这输入',
  ];

  // Mots-clés “rule” + “disabled” localisés
  const RULE_WORDS = ['rule', '规则', 'ルール', 'regla', 'regra', 'regel'];
  const DISABLED_WORDS = [
    'disabled',
    '禁用',
    '無効',
    'deshabilitado',
    'desabilitado',
    'deaktiviert',
  ];

  const titleRegex = new RegExp(
    TITLE_CANDIDATES.map((t) => t.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|'),
    'i'
  );

  const ruleStartRe = new RegExp(
    `^\\s*(?:${DISABLED_WORDS.join('|')})?\\s*(?:${RULE_WORDS.join('|')})\\s*\\(\\s*"(?:${titleRegex.source})"\\s*\\)\\s*\\{`,
    'mi'
  );

  const mRule = fullText.match(ruleStartRe);
  if (!mRule) throw new Error('Crédits: règle introuvable');

  // Trouver la fin de la règle
  const openIdx = fullText.indexOf('{', mRule.index);
  if (openIdx < 0) throw new Error('Crédits: accolade ouvrante introuvable');
  let level = 1,
    i = openIdx + 1;
  for (; i < fullText.length; i++) {
    if (fullText[i] === '{') level++;
    else if (fullText[i] === '}') {
      level--;
      if (level === 0) break;
    }
  }
  if (level !== 0) throw new Error('Crédits: accolade fermante introuvable');
  const ruleBody = fullText.slice(openIdx + 1, i);

  // Terme “actions” localisé
  let actionsWord;
  switch (lang) {
    case 'zh-CN':
      actionsWord = '动作';
      break;
    case 'ja-JP':
      actionsWord = 'アクション';
      break;
    case 'pt-BR':
      actionsWord = 'ações';
      break;
    case 'es-MX':
      actionsWord = 'acciones';
      break;
    case 'de-DE':
      actionsWord = 'aktionen';
      break;
    case 'ko-KR':
      actionsWord = 'action';
      break;
    case 'ru-RU':
      actionsWord = 'actions';
      break;
    case 'en-US':
      actionsWord = 'actions';
      break;
  }

  const actHdr = ruleBody.match(new RegExp(`${actionsWord}\\s*\\{`, 'i'));
  if (!actHdr) throw new Error('Crédits: bloc actions introuvable');

  const actOpen = ruleBody.indexOf('{', actHdr.index);
  if (actOpen < 0) throw new Error('Crédits: { actions introuvable');

  level = 1;
  let j = actOpen + 1;
  for (; j < ruleBody.length; j++) {
    if (ruleBody[j] === '{') level++;
    else if (ruleBody[j] === '}') {
      level--;
      if (level === 0) break;
    }
  }
  if (level !== 0) throw new Error('Crédits: } actions introuvable');

  const actionsBlock = ruleBody.slice(actOpen + 1, j);
  return actionsBlock.trim();
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

  // ---- NAME ----
  const reSetName = new RegExp(
    `${SET_GV}\\s*\\(\\s*Name\\s*,\\s*${CSTR_FIRST_Q}\\s*\\)\\s*;?`,
    'i'
  );
  const reDotName = new RegExp(`${GLOB}\\.\\s*Name\\s*=\\s*${CSTR_FIRST_Q}\\s*;?`, 'i');
  let m = src.match(reSetName) || src.match(reDotName);
  const name = m ? m[1] : null;

  // ---- CODE ----
  const reSetCode = new RegExp(
    `${SET_GV}\\s*\\(\\s*Code\\s*,\\s*${CSTR_FIRST_Q}\\s*\\)\\s*;?`,
    'i'
  );
  const reDotCode = new RegExp(`${GLOB}\\.\\s*Code\\s*=\\s*${CSTR_FIRST_Q}\\s*;?`, 'i');
  m = src.match(reSetCode) || src.match(reDotCode);
  const code = m ? m[1] : null;

  // ---- COLORS ----
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

function insertMapCreditsIntoTemplate(tpl, creditsBlock, lang = getActiveOutputLang()) {
  if (!creditsBlock || !creditsBlock.trim()) return tpl;

  const src = _parseCreditsData(creditsBlock);

  const _findMatchingBrace = (text, openIdx) => {
    let depth = 1, inQ = false;
    for (let i = openIdx + 1; i < text.length; i++) {
      const ch = text[i], prev = text[i - 1];
      if (ch === '"' && prev !== '\\') { inQ = !inQ; continue; }
      if (inQ) continue;
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) return i; }
    }
    return -1;
  };
  const findBrace = (typeof findMatchingBrace === 'function') ? findMatchingBrace : _findMatchingBrace;

  // --- credits titles
  const NEW_TITLE = '☞ Credits and Colors here - 作者代码HUD颜色 <---- INSERT HERE / 在这输入';
  const OLD_ZH   = '<tx0C00000000044B55><fg0FFFFFFF> Credits and Colors here - 作者代码HUD颜色 <---- INSERT HERE / 在这输入';
  const OLD_INTL = '<tx0C00000000044B55><fg0FFFFFFF> Credits and Colors here - 作者代码HUD颜色 <---- INSERT HERE';
  const TITLES_RE = [NEW_TITLE, OLD_ZH, OLD_INTL, 'Credits here - 作者名字 <---- INSERT HERE / 在这入力', 'Credits here - 作者名字 <---- INSERT HERE / 在这输入']
    .map(s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
    .join('|');

  const DISABLED_WORDS = ['disabled','禁用','無効','deshabilitado','desabilitado','deaktiviert'];
  const RULE_WORDS     = ['rule','规则','ルール','regla','regra','regel','правило','규칙'];

  const RE_HEADER = new RegExp(
    String.raw`(?:` +
      `(?:${DISABLED_WORDS.join('|')})\\s+` +
    `)?(?:${RULE_WORDS.join('|')})\\s*\\(\\s*"(?:${TITLES_RE})"\\s*\\)\\s*\\{`,
    'gi'
  );

  function collectCreditsBlocks(str) {
    const blocks = [];
    let m;
    while ((m = RE_HEADER.exec(str))) {
      const headerStart = m.index;
      const openIdx = headerStart + m[0].length - 1;
      const closeIdx = findBrace(str, openIdx);
      if (closeIdx < 0) continue;

      const headerLineStart = Math.max(0, str.lastIndexOf('\n', headerStart) + 1);
      const header = str.slice(headerLineStart, openIdx + 1);
      const body   = str.slice(openIdx + 1, closeIdx);

      let score = 0;
      if (/(?:Set\s*Global\s*Variable|设置\s*全局\s*变量|グローバル変数を設定)\s*\(\s*(?:Name|Code)\b/i.test(body) ||
          /(Global|全局|グローバル)\s*\.\s*(?:Name|Code)\s*=/i.test(body)) score += 10;
      if (/(Set\s*Global\s*Variable\s*At\s*Index|在索引处设置全局变量|インデックス(?:の)?グローバル変数を設定)/i.test(body) ||
          /(Global|全局|グローバル)\s*\.\s*ColorConfig\s*\[/i.test(body)) score += 5;
      if (!/^\s*(?:disabled|禁用|無効|deshabilitado|desabilitado|deaktiviert)\b/i.test(header)) score += 1;

      blocks.push({
        headerLineStart,
        openIdx,
        closeIdx,
        body,
        score,
        pos: openIdx,
      });
    }
    return blocks;
  }

  let creditsBlocks = collectCreditsBlocks(tpl);
  if (creditsBlocks.length > 1) {
    creditsBlocks.sort((a, b) => (b.score - a.score) || (b.pos - a.pos));
    const keep = creditsBlocks[0];
    creditsBlocks.slice(1).sort((a, b) => b.headerLineStart - a.headerLineStart).forEach((blk) => {
      tpl = tpl.slice(0, blk.headerLineStart) + tpl.slice(blk.closeIdx + 1);
    });
  }

  creditsBlocks = collectCreditsBlocks(tpl);
  if (creditsBlocks.length === 0) {
    return tpl;
  }
  const keep = creditsBlocks[0];

  (function normalizeHeaderTitle() {
    const start = keep.headerLineStart;
    const end   = keep.openIdx + 1;
    const header = tpl.slice(start, end);
    const headerNew = header.replace(
      new RegExp(`("(?:${TITLES_RE})")`,'i'),
      `"${NEW_TITLE}"`
    );
    if (headerNew !== header) {
      tpl = tpl.slice(0, start) + headerNew + tpl.slice(end);
    }
  })();

  const recheck = collectCreditsBlocks(tpl)[0];
  const blockStart = recheck.openIdx + 1;
  const blockEnd   = recheck.closeIdx;
  let actionsArea  = tpl.slice(blockStart, blockEnd);

  function replaceFirst(re, repl) {
    const m = re.exec(actionsArea);
    if (!m) return false;
    actionsArea = actionsArea.slice(0, m.index) + actionsArea.slice(m.index).replace(re, repl);
    return true;
  }

  const GLOB =
    '(?:Global|全局|グローバル)';
  const CSTR =
    '(?:Custom\\s*String|自定义字符串|カスタム(?:ストリング|文字列)|Cadena\\s+personalizada|String\\s+Personalizada)';
  const SET_GV =
    '(?:Set\\s+Global\\s+Variable|设置\\s*全局\\s*变量|グローバル変数を設定|Establecer\\s+variable\\s+global|Definir\\s+Variável\\s+Global|Установить\\s+глобальную\\s+переменную)';
  const SET_IDX =
    '(?:Set\\s+Global\\s+Variable\\s+At\\s+Index|在索引处设置全局变量|インデックス(?:の)?グローバル変数を設定|Establecer\\s+variable\\s+global\\s+según\\s+el\\s+índice|Definir\\s+Variável\\s+Global\\s+no\\s+Índice|Установить\\s+глобальную\\s+переменную\\s+по\\s+индексу|Globale\\s+Variable\\s+am\\s+Index\\s+festlegen|인덱스에서\\s*전역\\s*변수\\s*설정)';

  // NAME
  if (src.name != null) {
    const reSetAnyName = new RegExp(`(${SET_GV}\\s*\\(\\s*Name\\s*,\\s*${CSTR}\\s*\\(\\s*")([^"]*)(")`, 'i');
    const reDotAnyName = new RegExp(`(${GLOB}\\.\\s*Name\\s*=\\s*${CSTR}\\s*\\(\\s*")([^"]*)(")`, 'i');
    if (!replaceFirst(reSetAnyName, `$1${src.name}$3`)) {
      if (!replaceFirst(reDotAnyName, `$1${src.name}$3`)) {
        const useZh = /设置\s*全局\s*变量/.test(actionsArea) || /自定义字符串/.test(actionsArea);
        const line = useZh
          ? `\t\t设置全局变量(Name, 自定义字符串("${src.name}"));\n`
          : `\t\tSet Global Variable(Name, Custom String("${src.name}"));\n`;
        actionsArea = actionsArea.replace(/("Filling this[\s\S]*?")\s*\r?\n/, `$1\n${line}`);
      }
    }
  }

  // CODE
  if (src.code != null) {
    const reSetAnyCode = new RegExp(`(${SET_GV}\\s*\\(\\s*Code\\s*,\\s*${CSTR}\\s*\\(\\s*")([^"]*)(")`, 'i');
    const reDotAnyCode = new RegExp(`(${GLOB}\\.\\s*Code\\s*=\\s*${CSTR}\\s*\\(\\s*")([^"]*)(")`, 'i');
    if (!replaceFirst(reSetAnyCode, `$1${src.code}$3`)) {
      if (!replaceFirst(reDotAnyCode, `$1${src.code}$3`)) {
        const useZh = /设置\s*全局\s*变量/.test(actionsArea) || /自定义字符串/.test(actionsArea);
        const line = useZh
          ? `\t\t设置全局变量(Code, 自定义字符串("${src.code}"));\n`
          : `\t\tSet Global Variable(Code, Custom String("${src.code}"));\n`;
        const afterName = new RegExp(`${SET_GV}\\s*\\(\\s*Name|${GLOB}\\.\\s*Name`, 'i');
        const pos = actionsArea.search(afterName);
        if (pos >= 0) {
          const nl = actionsArea.indexOf('\n', pos);
          actionsArea = actionsArea.slice(0, nl + 1) + line + actionsArea.slice(nl + 1);
        } else {
          actionsArea = actionsArea.replace(/("Filling this[\s\S]*?")\s*\r?\n/, `$1\n${line}`);
        }
      }
    }
  }

  // Sanitize RHS
  function sanitizeRHS(rhsRaw) {
    let rhs = (rhsRaw || '').trim();
    rhs = rhs.replace(/[);\s]+$/, '');
    const opens = (rhs.match(/\(/g) || []).length;
    const closes = (rhs.match(/\)/g) || []).length;
    if (closes > opens) { let extra = closes - opens; while (extra > 0 && rhs.endsWith(')')) { rhs = rhs.slice(0, -1); extra--; } }
    else if (opens > closes) { rhs += ')'.repeat(opens - closes); }
    return rhs;
  }
  const stripOneTrailingParen = (s) => /\)\s*$/.test(s) ? s.replace(/\)\s*$/, '') : s;

  // COLORS
  for (const [idxRaw, rhsRaw] of Object.entries(src.colors)) {
    const rhs = sanitizeRHS(rhsRaw);
    const rhsForSet = stripOneTrailingParen(rhs);
    const idxRe = idxRaw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    const reSetIdxAny = new RegExp(`(${SET_IDX}\\s*\\(\\s*ColorConfig\\s*,\\s*${idxRe}\\s*,\\s*)([\\s\\S]*?)(\\)\\s*;?)`, 'i');
    const reDotIdxAny = new RegExp(`(${GLOB}\\.\\s*ColorConfig\\s*\\[\\s*${idxRe}\\s*\\]\\s*=\\s*)([^\\r\\n;]+)(\\s*;?)`, 'i');

    if (!replaceFirst(reSetIdxAny, `$1${rhsForSet}$3`)) {
      if (!replaceFirst(reDotIdxAny, `$1${rhs}$3`)) {
        const useZh = /在索引处设置全局变量/.test(actionsArea);
        const useJa = /インデックス(?:の)?グローバル変数を設定/.test(actionsArea);
        const useEs = /variable\s+global\s+según\s+el\s+índice/i.test(actionsArea);
        const usePt = /Variável\s+Global\s+no\s+Índice/i.test(actionsArea);
        const useDe = /aktionen|regel/i.test(tpl) && /Set Global Variable/i.test(actionsArea) === false;
        let line;
        if (useZh)      line = `\t\t在索引处设置全局变量(ColorConfig, ${idxRaw}, ${rhs});\n`;
        else if (useJa) line = `\t\tインデックスでグローバル変数を設定(ColorConfig, ${idxRaw}, ${rhs});\n`;
        else if (useEs) line = `\t\tEstablecer variable global según el índice(ColorConfig, ${idxRaw}, ${rhs});\n`;
        else if (usePt) line = `\t\tDefinir Variável Global no ÍNDICE(ColorConfig, ${idxRaw}, ${rhs});\n`.replace('ÍNDICE','Índice');
        else if (useDe) line = `\t\tGlobale Variable am Index festlegen(ColorConfig, ${idxRaw}, ${rhs});\n`;
        else            line = `\t\tSet Global Variable At Index(ColorConfig, ${idxRaw}, ${rhs});\n`;
        actionsArea = actionsArea.replace(/\s*$/, `\n${line}`);
      }
    }
  }

  actionsArea = actionsArea
    .replace(/\)\)\s*;/g, '));')
    .replace(/\)\s*;\s*\)\s*;/g, '));');

  tpl = tpl.slice(0, blockStart) + actionsArea + tpl.slice(blockEnd);

  let allAgain = collectCreditsBlocks(tpl);
  if (allAgain.length > 1) {
    allAgain.sort((a, b) => (b.score - a.score) || (b.pos - a.pos));
    const keep2 = allAgain[0];
    allAgain.slice(1).sort((a,b)=>b.headerLineStart - a.headerLineStart).forEach(blk => {
      tpl = tpl.slice(0, blk.headerLineStart) + tpl.slice(blk.closeIdx + 1);
    });
  }

  return tpl;
}

/* ------ ADDONS RULES (WIP) ------ */
async function injectTranslatedAddons(tpl, fullText, sourceLang, targetLang) {
  for (const title of ADDON_RULE_TITLES) {
    const sourceBlock = extractEnabledBlock(fullText, title);
    if (!sourceBlock) {
      continue;
    }

    let reconstructed;
    if (sourceLang === targetLang) {
      reconstructed = sourceBlock.replace(/^\s*disabled\s+/i, '');
    } else {
      reconstructed = translateEntireAddonBlock(sourceBlock, sourceLang, targetLang);
    }

    tpl = removeAllBlocks(tpl, title);

    tpl += '\n\n' + reconstructed;
  }

  return tpl;
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

/* ------- WORKSHOP SETTINGS BLOCK ------- */
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
  return x;
}

function standardizeWorkshopBansForTemplate(fullText) {
  const detected = parseGlobalWorkshopBans(fullText);
  const activeKeys = new Set(detected.map(normalizeBanKey));

  const out = [];
  const seen = new Set();
  for (const label of GLOBAL_BANS) {
    const k = normalizeBanKey(label);
    if (activeKeys.has(k) && !seen.has(k)) {
      out.push(label);
      seen.add(k);
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
  if (workshopSettingsBlock && workshopSettingsBlock.trim().length > 0) {
    let reExtensions;
    switch (lang) {
      case 'es-MX':
        reExtensions = /^(\s*)extensiones\s*\{/im;
        break;
      case 'pt-BR':
        reExtensions = /^(\s*)extensões\s*\{/im;
        break;
      case 'de-DE':
        reExtensions = /^(\s*)Erweiterungen\s*\{/im;
        break;
      case 'ja-JP':
        reExtensions = /^(\s*)拡張\s*\{/im;
        break;
      case 'zh-CN':
        reExtensions = /^(\s*)扩展\s*\{/im;
        break;
      default:
        reExtensions = /^(\s*)extensions\s*\{/im;
    }

    const mExt = tpl.match(reExtensions);
    if (!mExt) return tpl;

    const baseIndent = mExt[1] || '';
    const innerIndent = baseIndent + '    ';

    const lines = workshopSettingsBlock.split(/\r?\n/);
    const indentedLines = lines.map((line) => innerIndent + line.trim()).join('\n');

    let workshopKeyword;
    switch (lang) {
      case 'zh-CN':
        workshopKeyword = '地图工坊';
        break;
      case 'ja-JP':
        workshopKeyword = 'ワークショップ';
        break;
      default:
        workshopKeyword = 'workshop';
    }

    const workshopBlock =
      `${baseIndent}${workshopKeyword} {\n` + `${indentedLines}\n` + `${baseIndent}}\n\n`;

    const insertPos = mExt.index;
    return tpl.slice(0, insertPos) + workshopBlock + tpl.slice(insertPos);
  }

  // Si pas de bloc fourni : ne rien faire ici (les Bans sont gérés ailleurs)
  return tpl;
}

function parseWorkshopSettings(fullText) {
  const result = { editorMode: false, portals: false };
  const regexWorkshop = /(?:workshop|地图工坊|ワークショップ)\s*\{([\s\S]*?)\}/i;
  const workshopMatch = fullText.match(regexWorkshop);
  if (!workshopMatch) return result;
  const block = workshopMatch[1];

  const reEditor = /Editor mode\s*-\s*作图模式\s*:\s*([^\r\n]+)/i;
  const mEditor = block.match(reEditor);
  if (mEditor) {
    const val = mEditor[1].trim();
    const vLower = val.toLowerCase();
    const truthy = ['on', '开启', '활성화', 'вкл.', 'activado', 'ligado', 'ein'];
    if (truthy.includes(vLower)) {
      result.editorMode = true;
    } else {
      result.editorMode = false;
    }
  }

  const rePortals = /enable portals control maps\s*-\s*启用传送门\s*占点地图\s*:\s*([^\r\n]+)/i;
  const mPortals = block.match(rePortals);
  if (mPortals) {
    const val = mPortals[1].trim();
    const vLower = val.toLowerCase();
    const truthy = ['on', '开启', '활성화', 'вкл.', 'activado', 'ligado', 'ein'];
    if (truthy.includes(vLower)) {
      result.portals = true;
    } else {
      result.portals = false;
    }
  }

  const rePlaytest = /Playtest display\s*-\s*游戏测试\s*:\s*([^\r\n]+)/i;
  const mPlay = block.match(rePlaytest);
  if (mPlay) {
    const val = mPlay[1].trim().toLowerCase();
    const truthy = ['on', '开启', '활성화', 'вкл.', 'activado', 'ligado', 'ein'];
    result.playtest = truthy.includes(val);
  }

  return result;
}

/* ------- MAP VALIDATOR RULE------- */
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

/* ------- Loader ------- */
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
      <div class="text-white/90 text-sm sm:text-base font-medium tracking-tight">Converting…</div>
    `;
    document.body.append(o);
  }
}

function hideLoader() {
  const o = document.getElementById('convert-loader');
  if (o) o.remove();
}

/* ------- MAP DATA SETTINGS ------- */
function parseGlobalACheckpoints(fullText) {
  const checkpoints = [];
  const teleportMap = {};

  const regexGlobalA = /(?:Global|全局|グローバル)\.A\s*=\s*(?:Array|Matriz|数组|配列)\s*\(\s*/;
  const matchGA = fullText.match(regexGlobalA);
  if (!matchGA) {
    return { checkpoints, teleportMap };
  }

  let level = 1;
  let i = matchGA.index + matchGA[0].length;
  for (; i < fullText.length; i++) {
    if (fullText[i] === '(') level++;
    else if (fullText[i] === ')') {
      level--;
      if (level === 0) break;
    }
  }
  const inside = fullText.slice(matchGA.index + matchGA[0].length, i);

  const elements = [];
  let current = '',
    depth = 0;
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

function parseGlobalArrayNumbers(fullText, varName) {
  const regex = new RegExp(
    `(?:Global|全局|グローバル)\\.${varName}\\s*=\\s*(?:Array|Matriz|数组|配列)\\s*\\(`
  );
  const match = fullText.match(regex);
  if (!match) return [];

  const startIdx = match.index + match[0].length;
  let level = 1;
  let i = startIdx;
  for (; i < fullText.length; i++) {
    if (fullText[i] === '(') level++;
    else if (fullText[i] === ')') {
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
  const regex = new RegExp(
    `(?:Global|全局|グローバル)\\.${varName}\\s*=\\s*(?:Array|Matriz|数组|配列)\\s*\\(`
  );
  const match = fullText.match(regex);
  if (!match) return results;

  const startIdx = match.index + match[0].length;
  let level = 1;
  let i = startIdx;
  for (; i < fullText.length; i++) {
    if (fullText[i] === '(') level++;
    else if (fullText[i] === ')') {
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
  const regex = new RegExp(
    `(?:Global|全局|グローバル)\\.${varName}\\s*=\\s*(?:Array|Matriz|数组|配列)\\s*\\(`
  );
  const match = fullText.match(regex);
  if (!match) return results;

  const startIdx = match.index + match[0].length;
  let level = 1;
  let i = startIdx;
  for (; i < fullText.length; i++) {
    if (fullText[i] === '(') level++;
    else if (fullText[i] === ')') {
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
    else if (lower === 'verdadeiro' || lower === 'falso') {
      results.push(lower === 'verdadeiro');
    }
  });
  return results;
}

/* ------ REORDER CPS ------*/
container.addEventListener('dragover', (e) => {
  if (!isEditMode) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
});

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

/* ------- MAP DATA PARAMETERS ------- */
function renderGlobalBans(fullText) {
  const globalBans = parseGlobalWorkshopBans(fullText);
  if (globalBans.length === 0) return null;

  const iconsContainer = document.createElement('div');
  iconsContainer.className = 'flex flex-wrap items-center gap-2';

  globalBans.forEach((banName) => {
    const span = document.createElement('span');
    span.textContent = banName;
    span.title = banName;
    span.className = [
      'px-2.5 py-1',
      'text-xs sm:text-[13px] font-medium',
      'rounded-full',
      'bg-zinc-900/70 text-zinc-200',
      'border border-white/10 shadow-sm',
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

  const card = document.createElement('div');
  card.className = [
    'checkpoint-card group',
    'rounded-2xl border border-white/10',
    'bg-gradient-to-b from-zinc-900/70 to-zinc-900/40',
    'p-4 sm:p-5 shadow-sm hover:border-white/20 hover:shadow-md transition',
    'select-none',
    'mb-3',
  ].join(' ');
  card.draggable = true;
  card.dataset.original = originalIndex;

  // Header
  const header = document.createElement('div');
  header.className = 'checkpoint-header flex items-start sm:items-center justify-between gap-4';

  const leftGroup = document.createElement('div');
  leftGroup.className = 'checkpoint-header__left flex items-center gap-3';

  const numberCircle = document.createElement('div');
  numberCircle.className = [
    'checkpoint-number',
    'h-8 w-8 rounded-full',
    'bg-zinc-800/90 text-zinc-100',
    'flex items-center justify-center font-semibold',
  ].join(' ');
  numberCircle.textContent = originalIndex;

  const coordsInline = document.createElement('div');
  coordsInline.className =
    'coords-inline text-[13px] sm:text-sm text-zinc-300 font-mono tabular-nums';
  coordsInline.textContent = `${coords.x.toFixed(3)}, ${coords.y.toFixed(3)}, ${coords.z.toFixed(3)}`;

  leftGroup.append(numberCircle, coordsInline);

  const rightGroup = document.createElement('div');
  rightGroup.className = 'checkpoint-header__right flex items-center gap-3';

  const banIcons = document.createElement('div');
  banIcons.className = 'ban-icons hidden sm:flex items-center gap-1 text-xs';
  const banList = [
    { arr: banMap.Multi, icon: '∞' },
    { arr: banMap.Create, icon: '♂' },
    { arr: banMap.Stand, icon: '♠' },
    { arr: banMap.Dead, icon: 'X' },
    { arr: banMap.Emote, icon: '♥' },
    { arr: banMap.Climb, icon: '↑' },
    { arr: banMap.Bhop, icon: '≥' },
    { arr: banMap.Djump, icon: '»' },
    { arr: banMap.SaveDouble, icon: '△' },
  ];
  rightGroup.appendChild(banIcons);

  const originalLabel = document.createElement('div');
  originalLabel.className = 'original-label text-[11px] text-zinc-400';
  originalLabel.textContent = t('map_data.original_position', { index: originalIndex });

  rightGroup.appendChild(originalLabel);
  header.append(leftGroup, rightGroup);
  card.appendChild(header);

  // Click to edit
  card.addEventListener('click', () => {
    if (!isEditMode) return;
    openEditModal(originalIndex);
  });

  // Helpers
  const mkSection = (titleTxt) => {
    const s = document.createElement('div');
    s.className = 'section mt-3 pt-3 border-t border-white/10';
    const title = document.createElement('div');
    title.className = 'section__title text-sm font-semibold text-zinc-200 mb-2';
    title.textContent = titleTxt;
    s.appendChild(title);
    return s;
  };
  const mkDot = (extra = '') => {
    const dot = document.createElement('span');
    dot.className = `inline-block h-2 w-2 rounded-full ${extra}`;
    return dot;
  };
  const mkDetail = () => {
    const d = document.createElement('div');
    d.className = 'detail flex items-center gap-2 text-[13px] sm:text-sm text-zinc-300';
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
        const sx = coords.x.toFixed(3),
          sy = coords.y.toFixed(3),
          sz = coords.z.toFixed(3);
        const ex = tp.end.x.toFixed(3),
          ey = tp.end.y.toFixed(3),
          ez = tp.end.z.toFixed(3);
        const span = document.createElement('span');
        span.className = 'detail__text';
        span.textContent = t('map_data.from_to', { sx, sy, sz, ex, ey, ez });
        return span;
      })()
    );
    sec.appendChild(item);
    card.appendChild(sec);
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
          const px = kb.pos.x.toFixed(3),
            py = kb.pos.y.toFixed(3),
            pz = kb.pos.z.toFixed(3);
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
    card.appendChild(sec);
  }

  // Bounce orbs
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
          const px = pb.pos.x.toFixed(3),
            py = pb.pos.y.toFixed(3),
            pz = pb.pos.z.toFixed(3);
          const f = pb.force != null ? pb.force : 'N/A';
          const s = document.createElement('span');
          s.className = 'detail__text';
          s.textContent = t('map_data.pin_info', {
            x: px,
            y: py,
            z: pz,
            f,
            locked: pb.locked ? t('map_data.true') : t('map_data.false'),
          });
          return s;
        })(),
        (() => {
          const box = document.createElement('span');
          box.className = 'pinball-icons inline-flex items-center gap-2 ml-2';
          if (pb.givesUlt5) {
            const i = document.createElement('img');
            i.src = 'assets/abilities/ultimate.webp';
            i.alt = 'Ultimate';
            i.title = 'Donne Ultime';
            i.className = 'pinball-icon h-5 w-5';
            box.appendChild(i);
          }
          if (pb.givesUlt6) {
            const i = document.createElement('img');
            i.src = 'assets/abilities/dash.webp';
            i.alt = 'Dash';
            i.title = 'Donne Dash';
            i.className = 'pinball-icon h-5 w-5';
            box.appendChild(i);
          }
          return box;
        })()
      );
      wrap.appendChild(item);
    });
    sec.appendChild(wrap);
    card.appendChild(sec);
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
          const sx = p.start.x.toFixed(3),
            sy = p.start.y.toFixed(3),
            sz = p.start.z.toFixed(3);
          const ex = p.end.x.toFixed(3),
            ey = p.end.y.toFixed(3),
            ez = p.end.z.toFixed(3);
          const s = document.createElement('span');
          s.className = 'detail__text';
          s.textContent = t('map_data.from_to', { sx, sy, sz, ex, ey, ez });
          return s;
        })()
      );
      wrap.appendChild(item);
    });
    sec.appendChild(wrap);
    card.appendChild(sec);
  }

  // Abilities
  const abilities = abilityMap[idx] || {};
  if (abilities.ultimate || abilities.dash) {
    const sec = mkSection(t('map_data.abilities'));
    const box = document.createElement('div');
    box.className = 'ability-icons inline-flex items-center gap-2';
    if (abilities.ultimate) {
      const imgU = document.createElement('img');
      imgU.src = 'assets/abilities/ultimate.webp';
      imgU.alt = 'Ultimate';
      imgU.title = 'Ultimate available';
      imgU.className = 'ability-icon h-6 w-6';
      box.appendChild(imgU);
    }
    if (abilities.dash) {
      const imgD = document.createElement('img');
      imgD.src = 'assets/abilities/dash.webp';
      imgD.alt = 'Dash';
      imgD.title = 'Dash available';
      imgD.className = 'ability-icon h-6 w-6';
      box.appendChild(imgD);
    }
    sec.appendChild(box);
    card.appendChild(sec);
  }

  // Bans
  const hasAnyBan = banList.some(({ arr }) => arr.includes(idx));
  if (hasAnyBan) {
    const sec = mkSection(t('map_data.bans'));
    const row = document.createElement('div');
    row.className = 'ban-icons flex items-center gap-2 text-sm text-zinc-300';
    banList.forEach(({ arr, icon }) => {
      if (arr.includes(idx)) {
        const s = document.createElement('span');
        s.className =
          'ban-icon px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-300';
        s.textContent = icon;
        s.title = 'Ban';
        row.appendChild(s);
      }
    });
    sec.appendChild(row);
    card.appendChild(sec);
  }

  // Drag & reorder
  card.addEventListener('dragstart', function (e) {
    if (!isEditMode) {
      e.preventDefault();
      return;
    }
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
  card.addEventListener('dragend', () => {
    draggedCard = null;
  });

  // Move controls
  const moveControls = document.createElement('div');
  moveControls.className = 'move-controls mt-3 flex items-center gap-2';
  const baseBtn =
    'rounded-lg border border-white/10 bg-zinc-800/70 px-2.5 py-1 text-sm text-zinc-200 hover:bg-zinc-700/70 disabled:opacity-40 disabled:cursor-not-allowed';
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
  card.appendChild(moveControls);

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
    'bg-emerald-600 text-white hover:bg-emerald-500',
    'shadow-sm transition',
  ].join(' ');

  if (editModeBtn.dataset.listenerInstalled !== 'true') {
    editModeBtn.dataset.listenerInstalled = 'true';
    editModeBtn.addEventListener('click', () => {
      isEditMode = !isEditMode;
      editModeBtn.textContent = isEditMode ? t('map_data.exit_edit') : t('map_data.edit_mode');
      document.querySelectorAll('.checkpoint-card').forEach((card) => {
        card.classList.toggle('editable', isEditMode);
        card.querySelectorAll('.move-controls button').forEach((btn) => {
          btn.disabled = !isEditMode;
        });
      });
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
    'bg-zinc-900/70 text-zinc-200 hover:bg-zinc-800/70',
    'border border-white/10 shadow-sm transition',
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
    msg.className = 'empty-message text-zinc-400';
    container.appendChild(msg);
    return;
  }

  dataModel.checkpoints.forEach((coords, idx) => {
    const card = createCheckpointCard(idx, coords, dataModel);
    container.appendChild(card);
  });

  updateCardNumbers();
  if (isEditMode) {
    container.querySelectorAll('.checkpoint-card').forEach((card) => {
      card.classList.add('editable');
    });
  }
}

function temporaryReplace(text) {
  if (!text) return text;
  return text.replace(/(设置不可见\(\s*事件玩家\s*,\s*)无(\s*\);)/g, '$1全部禁用$2');
}

/* ------- Convertor ------- */
async function doConvert(fullText, lang) {
  // Reset du contexte de traduction (les modals réécriront alors dans la langue “courante”)
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
    const creditsBlock = extractMapCredits(fullText, lang);
    debug('Bloc Credits extrait.');
    tpl = insertMapCreditsIntoTemplate(tpl, creditsBlock, lang);
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
    tpl = applyWorkshopBansUpdate(tpl, lang, canonicalBans, localized);
  }

  const sourceDiffValue = extractDifficultyValue(fullText);
  tpl = applyDifficultyIndexToTemplate(tpl, sourceDiffValue);

  tpl = insertBasicMapValidator(tpl, lang, !isValidatorOn);
  tpl = temporaryReplace(tpl);

  return tpl;
}

/* ------- TRANSLATOR ------- */
async function doTranslate(fullText, clientLang, targetLang) {
  try {
    // Contexte : les réécritures depuis les modals devront se faire dans targetLang
    __lastTranslateCtx = { used: true, sourceLang: clientLang, targetLang };

    lastParsedWorkshopSettings = parseWorkshopSettings(fullText);
    await loadAllTranslations();

    let lobbyBlock = extractLobbyBlock(fullText, clientLang);
    let mapDataBlock = extractMapDataBlock(fullText, clientLang);
    const modeMapNames = extractModeMapNames(fullText);
    let workshopSettingsBlock = extractWorkshopSettings(fullText);
    const sourceDiffValue = extractDifficultyValue(fullText, clientLang);

    let creditsBlock = '';
    try {
      creditsBlock = extractMapCredits(fullText, clientLang);
    } catch (_) {}

    // Traductions “ciblées”
    lobbyBlock = translateLobbyBlock(lobbyBlock, clientLang, targetLang);
    mapDataBlock = translateFromTo(mapDataBlock, clientLang, targetLang);
    mapDataBlock = sanitizeMapDataAssignments(mapDataBlock);
    creditsBlock = translateFromTo(creditsBlock, clientLang, targetLang); // <-- bug corrigé (pas de 2e appel foireux)
    workshopSettingsBlock = translateWorkshopValuesOnly(
      workshopSettingsBlock,
      clientLang,
      targetLang
    );

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
        return dict && dict[clientLang] === rawMapName;
      });
      if (mapKey && mapNamesTranslations[mapKey][targetLang]) {
        translatedMapName = mapNamesTranslations[mapKey][targetLang];
      } else {
        translatedMapName = translateFromTo(rawMapName, clientLang, targetLang);
      }

      const newFullMapEntry = `${translatedMapName} ${mapId}`;
      tpl = insertMapNameIntoTemplate(tpl, targetModeName, newFullMapEntry, targetLang);
    }

    // Crédits
    if (creditsBlock) {
      tpl = insertMapCreditsIntoTemplate(tpl, creditsBlock, targetLang);
    }

    // Validator
    const isValidator = parseBasicMapValidator(fullText);
    tpl = insertBasicMapValidator(tpl, targetLang, !isValidator);

    // Lobby / Workshop
    if (lobbyBlock) tpl = insertLobbyIntoTemplate(tpl, lobbyBlock, targetLang);
    if (workshopSettingsBlock) tpl = insertWorkshopSettings(tpl, workshopSettingsBlock, targetLang);

    // Difficulté
    if (sourceDiffValue != null) {
      tpl = applyDifficultyValue(tpl, targetLang, String(sourceDiffValue));
    }

    // Bans
    {
      const localized = getLocalizedOnOff(targetLang);
      const canonicalBans = standardizeWorkshopBansForTemplate(fullText);
      if (canonicalBans.length) {
        tpl = applyWorkshopBansUpdate(tpl, targetLang, canonicalBans, localized);
      }
    }

    return tpl;
  } catch (e) {
    console.error('[doTranslate] error:', e);
    return fullText;
  }
}

/* ------- Modal Global Settings ------- */
function buildGlobalSettingsFormFields() {
  const form = document.getElementById('globalSettingsForm');
  if (!form) return;
  form.innerHTML = '';
  form.className = 'space-y-4';

  const rowMapName = document.createElement('div');
  rowMapName.className = 'modal-row space-y-2';
  rowMapName.innerHTML = `
    <label for="mapNameInput" class="modal-label block text-sm font-semibold text-zinc-200">${t('map_data.map_name')}</label>
    <div class="map-name-input-wrapper grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
      <div class="map-name-text-wrapper relative">
        <input type="text" id="mapNameInput" class="modal-input2 w-full rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-2 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
        <div class="map-name-suggestions-container absolute left-0 right-0 top-[110%] z-10 hidden rounded-xl border border-white/10 bg-zinc-900/95 shadow-lg"></div>
      </div>
      <select id="mapVariantSelect" class="modal-select2 rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"></select>
    </div>
  `;
  form.appendChild(rowMapName);

  const rowGlobalBans = document.createElement('div');
  rowGlobalBans.className = 'modal-row space-y-2';
  rowGlobalBans.innerHTML = `
    <label class="modal-label block text-sm font-semibold text-zinc-200">${t('map_data.global_bans')}</label>
    <div id="globalBansContainer" class="bans-container grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2"></div>
  `;
  form.appendChild(rowGlobalBans);

  const mkSelectRow = (forId, labelKey, optionsHtml) => {
    const row = document.createElement('div');
    row.className = 'modal-row space-y-2';
    row.innerHTML = `
      <label for="${forId}" class="modal-label block text-sm font-semibold text-zinc-200">${t(labelKey)}</label>
      <select id="${forId}" class="modal-select rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500">
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
    <button type="button" id="saveGlobalChangesBtn" class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 shadow-sm">${t('map_data.save')}</button>
    <button type="button" id="cancelGlobalChangesBtn" class="rounded-xl border border-white/10 bg-zinc-900/70 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800/70">${t('map_data.cancel')}</button>
  `;
  form.appendChild(rowButtons);
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
    'rounded-xl px-3 py-1.5 text-sm font-medium bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-white/10';
  btn.addEventListener('click', openGlobalSettingsModal);
  globalInfos.appendChild(btn);
}

async function openGlobalSettingsModal() {
  const modal = document.getElementById('globalSettingsModal');
  if (!modal) return;

  buildGlobalSettingsFormFields();

  // Place le modal un peu plus bas et aligne le contenu en haut-gauche
  modal.classList.add('items-start', 'pt-16', 'px-4'); // ↓ offset
  const panel =
    [...modal.children].find((el) => el.tagName !== 'SCRIPT') || modal.firstElementChild;
  if (panel) {
    panel.classList.add(
      'max-h-[80vh]',
      'overflow-y-auto',
      'rounded-2xl',
      'border',
      'border-white/10',
      'bg-zinc-900/95',
      'backdrop-blur',
      'p-5',
      'shadow-xl',
      'w-full',
      'max-w-2xl'
    );
    // Titre h3 en haut à gauche
    const title = panel.querySelector('h3, .modal-title');
    if (title) {
      title.classList.add('text-left', 'sticky', 'top-0', 'z-10', 'bg-zinc-900/95', 'pb-3', 'mb-3');
    }
  }

  const modeMapNames = extractModeMapNames(lastFullText || '');
  const fullEntries = Object.values(modeMapNames);

  const mapNameInput = document.getElementById('mapNameInput');
  mapNameInput.setAttribute('autocomplete', 'off');
  document.getElementById('globalSettingsForm').setAttribute('autocomplete', 'off');
  const variantSelect = document.getElementById('mapVariantSelect');

  if (fullEntries.length === 0) {
    mapNameInput.value = '(No map name detected)';
    variantSelect.innerHTML = '';
  } else {
    const fullMapEntry = fullEntries[0].trim();
    const tokens = fullMapEntry.split(/\s+/);
    const rawId = tokens[tokens.length - 1];
    const rawName = tokens.slice(0, tokens.length - 1).join(' ');

    await loadMapNameTranslations();
    const clientLang = document.getElementById('lang').value || 'en-US';
    const targetLang = document.getElementById('targetLang').value || clientLang;

    let mapKeyFound = null;
    for (const key of Object.keys(mapNamesTranslations || {})) {
      const dict = mapNamesTranslations[key];
      if (dict && dict[clientLang] === rawName) {
        mapKeyFound = key;
        break;
      }
    }

    let displayRawName = rawName;
    if (mapKeyFound) {
      const dict = mapNamesTranslations[mapKeyFound];
      const tName = dict[targetLang];
      if (tName) displayRawName = tName;
    }
    mapNameInput.value = displayRawName;

    variantSelect.innerHTML = '';
    if (mapKeyFound) {
      const variants = mapNamesTranslations[mapKeyFound].variants || {};
      Object.entries(variants).forEach(([variantKey, variantId]) => {
        const opt = document.createElement('option');
        opt.textContent = variantKey.charAt(0).toUpperCase() + variantKey.slice(1);
        opt.value = variantKey;
        if (variantId === rawId) opt.selected = true;
        variantSelect.appendChild(opt);
      });
    }

    (function initMapNameSuggestions() {
      const wrapper = mapNameInput.closest('.map-name-input-wrapper');
      let suggestionsContainer = wrapper.querySelector('.map-name-suggestions-container');
      if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.className =
          'map-name-suggestions-container absolute left-0 right-0 top-[110%] z-10 hidden rounded-xl border border-white/10 bg-zinc-900/95 shadow-lg';
        wrapper.appendChild(suggestionsContainer);
      }
      function clearSuggestions() {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.classList.add('hidden');
      }
      function populateVariants(mapKey, selectedId) {
        variantSelect.innerHTML = '';
        const variants = mapNamesTranslations[mapKey].variants || {};
        Object.entries(variants).forEach(([variantKey, variantId]) => {
          const opt = document.createElement('option');
          opt.value = variantKey;
          opt.textContent = variantKey.charAt(0).toUpperCase() + variantKey.slice(1);
          if (String(variantId) === String(selectedId)) opt.selected = true;
          variantSelect.appendChild(opt);
        });
      }
      mapNameInput.addEventListener('input', () => {
        const filter = mapNameInput.value.trim().toLowerCase();
        clearSuggestions();
        if (filter.length < 2) return;
        const clientLang = document.getElementById('lang').value || 'en-US';
        const matches = Object.entries(mapNamesTranslations)
          .filter(([, dict]) => (dict[clientLang] || '').toLowerCase().includes(filter))
          .slice(0, 10);
        if (!matches.length) return;
        matches.forEach(([mapKey, dict]) => {
          const item = document.createElement('div');
          item.className =
            'suggestion-item cursor-pointer px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800/70';
          item.textContent = dict[clientLang];
          item.addEventListener('mousedown', () => {
            const fullEntries = Object.values(extractModeMapNames(lastFullText || ''));
            const rawId = fullEntries[0]?.split(/\s+/).pop();
            mapNameInput.value = dict[clientLang];
            populateVariants(mapKey, rawId);
            clearSuggestions();
          });
          suggestionsContainer.appendChild(item);
        });
        suggestionsContainer.classList.remove('hidden');
      });
      mapNameInput.addEventListener('blur', () => setTimeout(clearSuggestions, 100));
      mapNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const clientLang = document.getElementById('lang').value || 'en-US';
          const typed = mapNameInput.value.trim();
          const found = Object.entries(mapNamesTranslations).find(
            ([, dict]) => dict[clientLang] === typed
          );
          if (found) {
            const [mapKey] = found;
            const fullEntries = Object.values(extractModeMapNames(lastFullText || ''));
            const rawId = fullEntries[0]?.split(/\s+/).pop();
            populateVariants(mapKey, rawId);
          }
          clearSuggestions();
        }
      });
      const fullEntries = Object.values(extractModeMapNames(lastFullText || ''));
      if (fullEntries.length) {
        const rawId = fullEntries[0].split(/\s+/).pop();
        const clientLang = document.getElementById('lang').value || 'en-US';
        const rawName = fullEntries[0].split(/\s+/).slice(0, -1).join(' ');
        const foundKey = Object.entries(mapNamesTranslations).find(
          ([, dict]) => dict[clientLang] === rawName
        )?.[0];
        if (foundKey) populateVariants(foundKey, rawId);
      }
    })();
  }

  // Bans chips
  const activeBansRaw = parseGlobalWorkshopBans(lastFullText || '');
  const activeKeys = new Set(activeBansRaw.map(normalizeBanKey));
  const globalBansContainer = document.getElementById('globalBansContainer');
  globalBansContainer.innerHTML = '';
  GLOBAL_BANS.forEach((fullBanName) => {
    const key = normalizeBanKey(fullBanName);
    const label = document.createElement('label');
    label.className =
      'ban-label flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 cursor-pointer select-none shadow-sm';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'global-ban-checkbox h-4 w-4 accent-emerald-600';
    checkbox.checked = activeKeys.has(key);
    const spanText = document.createElement('span');
    spanText.textContent = fullBanName;
    label.append(checkbox, spanText);
    globalBansContainer.appendChild(label);
  });

  const lang = document.getElementById('lang').value || 'en-US';
  const diffValue = extractDifficultyValue(lastFullText || '', lang);
  fillDifficultyFieldsFromValue(diffValue);

  document.getElementById('editorModeToggle').value = lastParsedWorkshopSettings.editorMode
    ? 'on'
    : 'off';
  document.getElementById('validatorToggle').value = parseBasicMapValidator(lastFullText || '')
    ? 'on'
    : 'off';
  document.getElementById('portalsToggle').value = lastParsedWorkshopSettings.portals
    ? 'on'
    : 'off';
  document.getElementById('playtestToggle').value = lastParsedWorkshopSettings.playtest
    ? 'on'
    : 'off';

  document.getElementById('saveGlobalChangesBtn').addEventListener('click', saveGlobalSettings);
  document
    .getElementById('cancelGlobalChangesBtn')
    .addEventListener('click', closeGlobalSettingsModal);
  const closeSpan = document.querySelector('#globalSettingsModal .modal-close2');
  if (closeSpan) closeSpan.addEventListener('click', closeGlobalSettingsModal);

  window.addEventListener('click', onWindowClickForGlobalModal);
  modal.style.display = 'flex';
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
    modal.style.display = 'none';
    window.removeEventListener('click', onWindowClickForGlobalModal);
  }
}

/* ------- Save Global Settings ------- */
function getNewActiveBans() {
  const checkboxes = document.querySelectorAll('.global-ban-checkbox');
  return Array.from(checkboxes)
    .filter((cb) => cb.checked)
    .map((cb) => cb.parentElement.textContent.trim());
}

function updateGlobalSettingsFromForm() {
  globalSettings.editorMode = document.getElementById('editorModeToggle').value === 'on';
  globalSettings.difficultyHUD = document.getElementById('difficultyHUDSelect').value;
  globalSettings.playtest = document.getElementById('playtestToggle').value;
  globalSettings.validator = document.getElementById('validatorToggle').value;
  globalSettings.portals = document.getElementById('portalsToggle').value;
}

function resolveMapKeyAndVariant() {
  const rawMapNameVisible = document.getElementById('mapNameInput').value;
  const chosenVariantKey = document.getElementById('mapVariantSelect').value;
  const clientLang = document.getElementById('lang').value || 'en-US';

  let mapKeyFound = null;
  for (const key of Object.keys(mapNamesTranslations || {})) {
    if (mapNamesTranslations[key][clientLang] === rawMapNameVisible) {
      mapKeyFound = key;
      break;
    }
  }
  let chosenVariantId = null;
  if (mapKeyFound) {
    chosenVariantId = (mapNamesTranslations[mapKeyFound].variants || {})[chosenVariantKey] || null;
  }

  return { rawMapNameVisible, mapKeyFound, chosenVariantId };
}

function getLocalizedOnOff(clientLang) {
  switch (clientLang) {
    case 'zh-CN':
      return { on: '开启', off: '关闭' };
    case 'ja-JP':
      return { on: 'ON', off: 'OFF' };
    case 'ko-KR':
      return { on: '활성화', off: '비활성화' };
    case 'ru-RU':
      return { on: 'Вкл.', off: 'Выкл.' };
    case 'es-MX':
      return { on: 'Activado', off: 'Desactivado' };
    case 'pt-BR':
      return { on: 'Ligado', off: 'Desligado' };
    case 'de-DE':
      return { on: 'Ein', off: 'Aus' };
    default:
      return { on: 'On', off: 'Off' };
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
  const lang = document.getElementById('lang')?.value || 'en-US';

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
  const enabledMapsPattern = `(?:enabled\\s+maps|mapas\\s+habilitados|mapas\\s+ativados|verfügbare\\s+karten|启用地图|有効なマップ)`;

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

function applyWorkshopBansUpdate(text, clientLang, newActiveBans, localized) {
  const banOnValue = localized.on;
  const ON_OFF_WORD =
    '(?:on|off|开启|关闭|활성화|비활성화|вкл\\.|выкл\\.|activado|desactivado|ligado|desligado|ein|aus)';

  const reBlock = new RegExp(
    String.raw`(^[ \t]*(?:workshop|地图工坊|ワークショップ)\s*\{)([\s\S]*?)(^\s*\})`,
    'mi'
  );

  return text.replace(reBlock, (match, pOpen, inner, pClose) => {
    const lines = inner.split(/\r?\n/);

    const reBanRequire = new RegExp(
      String.raw`^\s*(?:ban|require)\s+[^:：]+[:：]\s*${ON_OFF_WORD}\s*$`,
      'i'
    );
    const kept = lines.filter((line) => !reBanRequire.test(line));

    let indent = '    ';
    const mIndent = inner.match(/^[ \t]+/m);
    if (mIndent && mIndent[0]) indent = mIndent[0];

    const bansText =
      newActiveBans && newActiveBans.length
        ? newActiveBans.map((n) => `${indent}${n}: ${banOnValue}`).join('\n')
        : '';

    const keptTrimmed = kept.join('\n').trim();
    let rebuilt = '';
    if (bansText && keptTrimmed) {
      rebuilt = `\n${bansText}\n${keptTrimmed}\n`;
    } else if (bansText) {
      rebuilt = `\n${bansText}\n`;
    } else if (keptTrimmed) {
      rebuilt = `\n${keptTrimmed}\n`;
    } else {
      rebuilt = `\n`;
    }

    return `${pOpen}${rebuilt}${pClose}`;
  });
}

function saveEditorSettings() {
  const ta = document.querySelector('#convertMap textarea.mapdata');
  if (!ta) return;
  const lang = getActiveOutputLang(); // <-- use context-aware lang
  const raw = ta.value;

  const mapdata = updateMapDataRule(currentDataModel, lang);
  const newRule = buildRule(mapdata, lang);

  const replaced = replaceMapData(raw, newRule, lang);
  ta.value = replaced;
  lastFullText = replaced;
}

async function saveGlobalSettings() {
  const clientLang = getActiveOutputLang(); // <-- use context-aware lang
  const textarea = document.querySelector('.mapdata');
  const originalText = textarea.value;

  const newActiveBans = getNewActiveBans();
  updateGlobalSettingsFromForm();
  const resolution = resolveMapKeyAndVariant();
  const localized = getLocalizedOnOff(clientLang);

  let text = originalText;
  text = applyOnOffReplacements(text, localized, globalSettings);
  text = applyValidatorToggle(text, clientLang, globalSettings);
  const wanted = globalSettings.playtest === 'on' ? 'playtest' : globalSettings.difficultyHUD;
  text = applyDifficultyValue(text, clientLang, wanted);
  text = applyMapEntryUpdate(text, resolution);
  text = applyWorkshopBansUpdate(text, clientLang, newActiveBans, localized);

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
  showConfirmationMessage('Settings have been saved');
}

/* ------- Modal editor mode ------- */
function openEditModal(idx) {
  editIndex = idx;
  const modal = document.getElementById('editModal');
  const fieldsContainer = document.getElementById('editFieldsContainer');
  fieldsContainer.innerHTML = '';
  fieldsContainer.className = 'space-y-4';

  // Place le modal un peu plus bas
  modal.classList.add('items-start', 'pt-16', 'px-4'); // ↓ offset
  const panel =
    [...modal.children].find((el) => el.tagName !== 'SCRIPT') || modal.firstElementChild;
  if (panel) {
    panel.classList.add(
      'max-h-[80vh]',
      'overflow-y-auto',
      'rounded-2xl',
      'border',
      'border-white/10',
      'bg-zinc-900/95',
      'backdrop-blur',
      'p-5',
      'shadow-xl',
      'w-full',
      'max-w-3xl'
    );
  }

  const checkpoint = currentDataModel.checkpoints[idx];
  const tp = currentDataModel.teleportMap[idx];
  const coords = tp ? tp.start : currentDataModel.checkpoints[idx];
  const kills = currentDataModel.killMap[idx] || [];
  const pins = currentDataModel.pinMap[idx] || [];
  const abilities = currentDataModel.abilityMap[idx] || {};
  const banMap = currentDataModel.banMap;

  const inputCls =
    'w-full rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500';
  const chipBtn =
    'rounded-lg border border-white/10 bg-zinc-900/70 px-2.5 py-1 text-sm text-zinc-100 hover:bg-zinc-800/70';
  const minusBtnCls =
    'h-8 w-8 rounded-md bg-red-600 text-white flex items-center justify-center hover:bg-red-500';

  // Coordinates
  {
    const wrapper = document.createElement('div');
    const title = document.createElement('div');
    title.textContent = t('map_data.coordinates');
    title.className = 'font-semibold text-zinc-200';
    wrapper.appendChild(title);

    const coordRow = document.createElement('div');
    coordRow.className = 'orb-row grid grid-cols-3 gap-2';
    const inX = Object.assign(document.createElement('input'), {
      type: 'number',
      step: '0.001',
      value: coords.x,
      id: 'editCoordX',
      className: inputCls,
    });
    const inY = Object.assign(document.createElement('input'), {
      type: 'number',
      step: '0.001',
      value: coords.y,
      id: 'editCoordY',
      className: inputCls,
    });
    const inZ = Object.assign(document.createElement('input'), {
      type: 'number',
      step: '0.001',
      value: coords.z,
      id: 'editCoordZ',
      className: inputCls,
    });
    coordRow.append(inX, inY, inZ);
    wrapper.appendChild(coordRow);
    fieldsContainer.appendChild(wrapper);
  }

  // Teleport
  {
    const wrapper = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'sub-header font-semibold text-zinc-200 mt-2';
    title.textContent = t('map_data.teleport');
    wrapper.appendChild(title);

    if (tp) {
      // 5 ou 6 inputs + bouton "-" dans la même ligne
      const row = document.createElement('div');
      row.className =
        'orb-row mt-2 grid grid-cols-[repeat(auto-fit,minmax(0,1fr))_2rem] gap-2 items-center';
      row.dataset.tpKind = 'start-end';

      const startDifferent = !(
        tp.start.x === checkpoint.x &&
        tp.start.y === checkpoint.y &&
        tp.start.z === checkpoint.z
      );
      if (startDifferent) {
        ['x', 'y', 'z'].forEach((axis) => {
          const inp = document.createElement('input');
          Object.assign(inp, { type: 'number', step: '0.001', value: tp.start[axis] });
          inp.className = `tp-start-${axis} ${inputCls}`;
          row.appendChild(inp);
        });
      }

      ['x', 'y', 'z'].forEach((axis) => {
        const inp = document.createElement('input');
        Object.assign(inp, { type: 'number', step: '0.001', value: tp.end[axis] });
        inp.className = `tp-end-${axis} ${inputCls}`;
        row.appendChild(inp);
      });

      const btnDelTp = document.createElement('button');
      btnDelTp.type = 'button';
      btnDelTp.textContent = '–';
      btnDelTp.className = minusBtnCls;
      btnDelTp.title = 'Remove this teleport';
      btnDelTp.addEventListener('click', () => {
        delete currentDataModel.teleportMap[idx];
        openEditModal(idx);
      });
      row.appendChild(btnDelTp);

      wrapper.appendChild(row);
    } else {
      const btnAdd = document.createElement('button');
      btnAdd.type = 'button';
      btnAdd.textContent = t('map_data.add_teleport');
      btnAdd.className = `${chipBtn} bg-fuchsia-600/80 hover:bg-fuchsia-600 text-white mt-2`;
      btnAdd.addEventListener('click', () => {
        const cp = currentDataModel.checkpoints[idx];
        currentDataModel.teleportMap[idx] = {
          start: { x: cp.x, y: cp.y, z: cp.z },
          end: { x: 0, y: 0, z: 0 },
        };
        openEditModal(idx);
      });
      wrapper.appendChild(btnAdd);
    }

    fieldsContainer.appendChild(wrapper);
  }

  // Kill orbs
  {
    const wrapper = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'sub-header font-semibold text-zinc-200';
    title.textContent = t('map_data.kill_orbs');
    wrapper.appendChild(title);

    kills.forEach((kb, i) => {
      const row = document.createElement('div');
      row.className =
        'orb-row mt-2 grid grid-cols-[repeat(auto-fit,minmax(0,1fr))_2rem] gap-2 items-center';
      row.dataset.orbIndex = i;

      ['x', 'y', 'z'].forEach((axis) => {
        const inp = document.createElement('input');
        Object.assign(inp, { type: 'number', step: '0.001', value: kb.pos[axis] });
        inp.className = `kill-${axis} ${inputCls}`;
        row.appendChild(inp);
      });
      const kr = document.createElement('input');
      Object.assign(kr, {
        type: 'number',
        step: '0.001',
        value: kb.radius != null ? kb.radius : 0,
      });
      kr.className = `kill-r ${inputCls}`;
      row.appendChild(kr);

      const btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.textContent = '–';
      btnDel.className = minusBtnCls;
      btnDel.addEventListener('click', () => row.remove());
      row.appendChild(btnDel);

      wrapper.appendChild(row);
    });

    const addKillBtn = document.createElement('button');
    addKillBtn.type = 'button';
    addKillBtn.textContent = t('map_data.add_kill_orb');
    addKillBtn.className = `${chipBtn} bg-sky-600/80 hover:bg-sky-600 text-white mt-2`;
    addKillBtn.addEventListener('click', () => {
      const row = document.createElement('div');
      row.className =
        'orb-row mt-2 grid grid-cols-[repeat(auto-fit,minmax(0,1fr))_2rem] gap-2 items-center';
      ['kill-x', 'kill-y', 'kill-z', 'kill-r'].forEach((cls) => {
        const inp = document.createElement('input');
        Object.assign(inp, { type: 'number', step: '0.001', value: 0 });
        inp.className = `${cls} ${inputCls}`;
        row.appendChild(inp);
      });
      const btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.textContent = '–';
      btnDel.className = minusBtnCls;
      btnDel.addEventListener('click', () => row.remove());
      row.appendChild(btnDel);
      wrapper.appendChild(row);
    });
    wrapper.appendChild(addKillBtn);

    fieldsContainer.appendChild(wrapper);
  }

  // Bounce orbs
  {
    const wrapper = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'sub-header font-semibold text-zinc-200';
    title.textContent = t('map_data.bounce_orbs');
    wrapper.appendChild(title);

    pins.forEach((pb, i) => {
      const row = document.createElement('div');
      row.className =
        'orb-row mt-2 grid grid-cols-[repeat(4,minmax(0,1fr))_auto_2rem] gap-2 items-center';
      row.dataset.pinIndex = i;

      ['x', 'y', 'z', 'f'].forEach((fld) => {
        const inp = document.createElement('input');
        Object.assign(inp, {
          type: 'number',
          step: '0.001',
          value: fld === 'f' ? pb.force : pb.pos[fld],
        });
        inp.className = `pin-${fld} ${inputCls}`;
        row.appendChild(inp);
      });

      const flags = document.createElement('div');
      flags.className = 'flex items-center gap-4 whitespace-nowrap';
      ['locked', 'ult5', 'ult6'].forEach((flag) => {
        const label = document.createElement('label');
        label.className = 'inline-flex items-center gap-2 text-sm text-zinc-200';
        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.checked =
          pb[flag === 'locked' ? 'locked' : flag === 'ult5' ? 'givesUlt5' : 'givesUlt6'];
        chk.className = `pin-${flag} h-4 w-4 accent-emerald-600`;
        label.append(
          chk,
          document.createTextNode(
            flag === 'locked'
              ? t('map_data.lock_orb')
              : flag === 'ult5'
                ? t('map_data.ultimate')
                : t('map_data.dash')
          )
        );
        flags.appendChild(label);
      });
      row.appendChild(flags);

      const btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.textContent = '–';
      btnDel.className = minusBtnCls;
      btnDel.addEventListener('click', () => row.remove());
      row.appendChild(btnDel);

      wrapper.appendChild(row);
    });

    const addPinBtn = document.createElement('button');
    addPinBtn.type = 'button';
    addPinBtn.textContent = t('map_data.add_bounce_orb');
    addPinBtn.className = `${chipBtn} bg-sky-600/80 hover:bg-sky-600 text-white mt-2`;
    addPinBtn.addEventListener('click', () => {
      const row = document.createElement('div');
      row.className =
        'orb-row mt-2 grid grid-cols-[repeat(4,minmax(0,1fr))_auto_2rem] gap-2 items-center';
      ['pin-x', 'pin-y', 'pin-z', 'pin-f'].forEach((cls) => {
        const inp = document.createElement('input');
        Object.assign(inp, { type: 'number', step: '0.001', value: 0 });
        inp.className = `${cls} ${inputCls}`;
        row.appendChild(inp);
      });
      ['pin-locked', 'pin-ult5', 'pin-ult6'].forEach((cls) => {
        const label = document.createElement('label');
        label.className = 'inline-flex items-center gap-2 text-sm text-zinc-200';
        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.className = `${cls} h-4 w-4 accent-emerald-600`;
        label.append(
          chk,
          document.createTextNode(
            cls === 'pin-locked'
              ? t('map_data.lock_orb')
              : cls === 'pin-ult5'
                ? t('map_data.ultimate')
                : t('map_data.dash')
          )
        );
        row.appendChild(label);
      });
      const btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.textContent = '–';
      btnDel.className = minusBtnCls;
      btnDel.addEventListener('click', () => row.remove());
      row.appendChild(btnDel);
      wrapper.appendChild(row);
    });
    wrapper.appendChild(addPinBtn);

    fieldsContainer.appendChild(wrapper);
  }

  // Abilities + Bans (inchangé visuellement)
  {
    const wrapper = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'sub-header font-semibold text-zinc-200';
    title.textContent = t('map_data.abilities');
    wrapper.appendChild(title);

    ['ultimate', 'dash'].forEach((key) => {
      const label = document.createElement('label');
      label.className = 'mr-4 inline-flex items-center gap-2 text-sm text-zinc-200';
      const chk = document.createElement('input');
      Object.assign(chk, {
        type: 'checkbox',
        checked: !!abilities[key],
        id: `editAbility${key.charAt(0).toUpperCase() + key.slice(1)}`,
      });
      chk.className = 'h-4 w-4 accent-emerald-600';
      label.append(
        chk,
        document.createTextNode(
          key === 'ultimate' ? t('map_data.ultimate_available') : t('map_data.dash_available')
        )
      );
      wrapper.appendChild(label);
    });
    fieldsContainer.appendChild(wrapper);
  }

  {
    const wrapper = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'sub-header font-semibold text-zinc-200';
    title.textContent = t('map_data.cp_specific_bans');
    wrapper.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'mt-2 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2';
    Object.entries(banMap).forEach(([banKey, arr]) => {
      const label = document.createElement('label');
      label.className =
        'inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100';
      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.checked = arr.includes(idx);
      chk.className = `edit-ban-${banKey} h-4 w-4 accent-emerald-600`;
      label.append(chk, document.createTextNode(banKey));
      grid.appendChild(label);
    });
    wrapper.appendChild(grid);
    fieldsContainer.appendChild(wrapper);
  }

  // Bouton "Save" du modal d'édition en vert
  const saveBtn = document.getElementById('saveEditorChangesBtn');
  if (saveBtn) {
    saveBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-500', 'text-white', 'rounded-xl');
  }

  {
    const buttonsContainer = modal.querySelector('.modal-buttons3');
    if (!buttonsContainer.querySelector('.delete-checkpoint-btn')) {
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.textContent = t('map_data.remove_checkpoint');
      deleteBtn.className =
        'delete-checkpoint-btn rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500';
      buttonsContainer.insertBefore(deleteBtn, buttonsContainer.firstChild);
      deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        deleteCheckpoint(editIndex);
      });
    }
  }

  document.getElementById('closeModal2').onclick = () => (modal.style.display = 'none');
  window.addEventListener('click', onWindowClickForEditorModal);
  document.getElementById('cancelEditorChangesBtn').addEventListener('click', () => {
    modal.style.display = 'none';
    showErrorMessage('Changes have been cancelled');
  });

  modal.style.display = 'flex';
}

function onWindowClickForEditorModal(e) {
  const modal = document.getElementById('editModal');
  if (e.target === modal) {
    closeSettingsModal();
  }
}

function closeSettingsModal() {
  const modal = document.getElementById('editModal');
  if (modal) {
    modal.style.display = 'none';
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
  applyEditorModalToModel();
  document.getElementById('editModal').style.display = 'none';
  saveEditorSettings();
  renderMapSettingsWithModel(currentDataModel);
  showConfirmationMessage('Settings have been saved');
});

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
      document.querySelectorAll('.checkpoint-card').forEach((card) => {
        card.classList.toggle('editable', isEditMode);
        card.querySelectorAll('.move-controls button').forEach((btn) => {
          btn.disabled = !isEditMode;
        });
      });
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

  if (isEditMode) {
    container.querySelectorAll('.checkpoint-card').forEach((card) => {
      card.classList.add('editable');
    });
  }
}

/* ------- Save & delete editor mode ------- */
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

  document.getElementById('editModal').style.display = 'none';
  saveEditorSettings();
  renderMapSettingsWithModel(currentDataModel);
}

/* ------- Diffchecker ------- */
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
  let currentOpen = null;

  const FLAG_BY_CODE = {
    en: 'united-states',
    'en-us': 'united-states',
    zh: 'china',
    'zh-cn': 'china',
    ja: 'japan',
    'ja-jp': 'japan',
    ko: 'south-korea',
    'ko-kr': 'south-korea',
    ru: 'russia',
    'ru-ru': 'russia',
    es: 'spain',
    'es-mx': 'mexico',
    pt: 'portugal',
    'pt-br': 'brazil',
    de: 'germany',
    'de-de': 'germany',
    fr: 'france',
    'fr-fr': 'france',
  };

  function flagClassFor(value) {
    const key = String(value || '').toLowerCase();
    return `flag ${FLAG_BY_CODE[key] ? `flag-${FLAG_BY_CODE[key]}` : 'flag-united-nations'}`;
  }

  function makeDropdownFromSelect(select) {
    if (!select || select.__enhanced) return;
    select.__enhanced = true;

    select.style.position = 'absolute';
    select.style.opacity = '0';
    select.style.pointerEvents = 'none';
    select.style.width = '0';
    select.style.height = '0';

    const wrap = document.createElement('div');
    wrap.className = 'lang-dd';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className =
      'lang-dd-btn rounded-lg cursor-pointer border border-white/10 px-3 py-2 hover:bg-white/5';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');

    const flag = document.createElement('i');
    flag.className = flagClassFor(select.value);
    const label = document.createElement('span');
    label.className = 'text-sm text-zinc-200';
    label.textContent = select.options[select.selectedIndex]?.text || '…';
    const caret = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    caret.setAttribute('viewBox', '0 0 20 20');
    caret.classList.add('w-4', 'h-4', 'text-zinc-400', 'ml-1');
    caret.innerHTML =
      '<path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" fill="currentColor"/>';

    btn.append(flag, label, caret);

    const menu = document.createElement('ul');
    menu.className =
      'lang-dd-menu transition absolute right-0 w-48 rounded-lg bg-zinc-900/95 backdrop-blur shadow-lg ring-1 ring-white/10 py-2';
    menu.setAttribute('role', 'listbox');

    Array.from(select.options).forEach((opt) => {
      const li = document.createElement('li');
      const a = document.createElement('button');
      a.type = 'button';
      a.className =
        'lang-dd-option cursor-pointer flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10';
      a.setAttribute('role', 'option');
      a.setAttribute('data-value', opt.value);
      a.setAttribute('aria-selected', String(opt.selected));

      const ic = document.createElement('i');
      ic.className = flagClassFor(opt.value);
      const tx = document.createElement('span');
      tx.textContent = opt.text;

      const check = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      check.setAttribute('viewBox', '0 0 20 20');
      check.classList.add('check', 'ml-auto', 'w-4', 'h-4', 'text-emerald-400');
      check.innerHTML =
        '<path d="M5 10.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';

      a.append(ic, tx, check);
      li.appendChild(a);
      menu.appendChild(li);

      a.addEventListener('click', (e) => {
        e.stopPropagation();
        menu
          .querySelectorAll('.lang-dd-option')
          .forEach((o) => o.setAttribute('aria-selected', 'false'));
        a.setAttribute('aria-selected', 'true');
        flag.className = flagClassFor(opt.value);
        label.textContent = opt.text;
        select.value = opt.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        closeDropdown(wrap);
      });
    });

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (wrap.classList.contains('is-open')) {
        closeDropdown(wrap);
      } else {
        if (currentOpen && currentOpen !== wrap) closeDropdown(currentOpen);
        openDropdown(wrap);
      }
    });

    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);
    wrap.appendChild(btn);
    wrap.appendChild(menu);

    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDropdown(wrap);
        btn.focus({ preventScroll: true });
      }
    });
  }

  function openDropdown(wrap) {
    const btn = wrap.querySelector('.lang-dd-btn');
    wrap.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    currentOpen = wrap;
  }

  function closeDropdown(wrap) {
    if (!wrap) return;
    const btn = wrap.querySelector('.lang-dd-btn');
    wrap.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    if (currentOpen === wrap) currentOpen = null;
  }

  document.addEventListener(
    'pointerdown',
    (e) => {
      if (!currentOpen) return;
      if (!currentOpen.contains(e.target)) closeDropdown(currentOpen);
    },
    true
  );

  window.addEventListener(
    'resize',
    () => {
      if (currentOpen) closeDropdown(currentOpen);
    },
    true
  );

  document.addEventListener('DOMContentLoaded', () => {
    const lang = document.getElementById('lang');
    const targetLang = document.getElementById('targetLang');
    if (lang) makeDropdownFromSelect(lang);
    if (targetLang) makeDropdownFromSelect(targetLang);
  });
})();
