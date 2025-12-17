import Stats from 'three/addons/libs/stats.module.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

let MODEL_URL = '';
const ORB_PORTAL_MAX = 193;
const ORB_RADIUS = 0.5;
// Exposure profiles
const EXPOSURE_NO_GLB_LIGHTS = 0.2;
const EXPOSURE_GLB_LIGHTS    = 0.2;
const DBG_LOAD_TRAVERSE = false;

/* ============================================================================
  DOM
============================================================================ */
const canvas = document.getElementById('mapCanvas');
const btnAdd = document.getElementById('btnAdd');
const btnImport = document.getElementById('btnImport');
const btnExport = document.getElementById('btnExport');

const hudModeTitle = document.getElementById('hudModeTitle');
const hudModeLevel = document.getElementById('hudModeLevel');
const hudModeList = document.getElementById('hudModeList');

const hudStatusBadge = document.getElementById('hudStatusBadge');
const hudOrbPortalLimit = document.getElementById('hudOrbPortalLimit');

const hudDataTitle = document.getElementById('hudDataTitle');
const hudDataBody = document.getElementById('hudDataBody');
const hudSpeed = document.getElementById('hudSpeed');

const viewAllBtn = document.getElementById('viewAllBtn');
const viewOnlyBtn = document.getElementById('viewOnlyBtn');
const checkpointSelect = document.getElementById('checkpointSelect');
const cpPrev = document.getElementById('cpPrev');
const cpNext = document.getElementById('cpNext');
const hudHelpBody = document.getElementById('hudHelpBody');

const editorStage = document.getElementById('editorStage');
const btnFullscreen = document.getElementById('btnFullscreen');
const hudViewType = document.getElementById('hudViewType');

const btnSnap = document.getElementById('btnSnap');

const hudAddBadge = document.getElementById('hudAddBadge');
const hudToolbar = document.getElementById('hudToolbar');
const hudTopPanel = document.getElementById('hudTopPanel');
const hudLeftPanel = document.getElementById('hudLeftPanel');
const hudRightPanel = document.getElementById('hudRightPanel');
const hudHotkeys = document.getElementById('hudHotkeys');

const hudDock = document.getElementById('hudDock');
const dockControls = document.getElementById('dockControls');
const dockData = document.getElementById('dockData');
const dockMode = document.getElementById('dockMode');
const dockShortcuts = document.getElementById('dockShortcuts');
const dockQuickbar = document.getElementById('dockQuickbar');
const dockPerf = document.getElementById('dockPerf');
const dockMove = document.getElementById('dockMove');
const dockMoveLabel = document.getElementById('dockMoveLabel');

const hudQuickbar = document.getElementById('hudQuickbar');
const hudQAdd = document.getElementById('hudQAdd');
const hudQSnap = document.getElementById('hudQSnap');
const hudQViewAll = document.getElementById('hudQViewAll');
const hudQViewOnly = document.getElementById('hudQViewOnly');
const hudQCpPrev = document.getElementById('hudQCpPrev');
const hudQCheckpointSelect = document.getElementById('hudQCheckpointSelect');
const hudQCpNext = document.getElementById('hudQCpNext');
const hudQHide = document.getElementById('hudQHide');

// Secondary camera move mode (default: current plane movement)
let hudQMove = null;

function getMoveModeLabel(mode) {
  return mode === 'look' ? 'LOOK' : 'PLANE';
}

// Movement mode:
// - 'plane' (default): forward/strafe on XZ plane + Space/Ctrl for vertical
// - 'look' : forward/back follows camera look direction (includes pitch)
const MOVE_MODE_KEY = 'gp_editor_move_mode_v1';
let MOVE_MODE = 'look';

function loadMoveMode() {
  try {
    const v = localStorage.getItem(MOVE_MODE_KEY);
    if (v === 'look' || v === 'plane') MOVE_MODE = v;
  } catch (_) {}
}

function saveMoveMode() {
  try { localStorage.setItem(MOVE_MODE_KEY, MOVE_MODE); } catch (_) {}
}

function syncMoveModeUi() {
  if (dockMoveLabel) dockMoveLabel.textContent = getMoveModeLabel(MOVE_MODE);
  if (dockMove) {
    dockMove.classList.toggle('bg-white/10', MOVE_MODE === 'look');
  }
  if (hudQMove) hudQMove.textContent = `MOVE: ${getMoveModeLabel(MOVE_MODE)}`;
  // Hotkeys panel includes the move mode label, so refresh it as well
  try { updateHudHelp(); } catch (_) {}
}

function toggleMoveMode() {
  MOVE_MODE = (MOVE_MODE === 'plane') ? 'look' : 'plane';
  saveMoveMode();
  syncMoveModeUi();
}

loadMoveMode();

function ensureQuickbarMoveBtn() {
  if (!hudQuickbar || hudQMove) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'hudQMove';
  btn.className = 'px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white/90 text-xs tracking-wide';
  btn.title = 'Toggle camera move mode (F3)';

  // insert before the hide button if possible
  if (hudQHide?.parentElement === hudQuickbar) {
    hudQuickbar.insertBefore(btn, hudQHide);
  } else {
    hudQuickbar.appendChild(btn);
  }

  btn.addEventListener('click', () => toggleMoveMode());
  hudQMove = btn;

  syncMoveModeUi();
}


if (!(canvas instanceof HTMLCanvasElement)) throw new Error('mapCanvas not found');
canvas.tabIndex = 0;

/* ============================================================================
  Config
============================================================================ */
const mapSelect = document.getElementById('mapSelect');
const MAPS_CONFIG_URL = '/maps/editor_maps.json';

const DEFAULT_MAPDATA_RULE_NAMES = [
  'Ø Map Data - 数据录入 <---- INSERT HERE / 在这输入',
  '<tx0C0000000000D297><fg00FFFFFF> Map Data - 数据录入 <---- INSERT HERE / 在这输入',
  '<tx0C0000000000D297><fg00FFFFFF> Map Data - 数据录入 <---- INSERT HERE / 在这入力',
  '<tx0C0000000000D297><fg00FFFFFF> Map Data - 数据录入 <---- INSERT HERE',
  'Map Data <---- INSERT YOUR MAP DATA HERE',
  'Map Data     <---- INSERT YOUR MAP DATA HERE"',
  'Map Data - 数据录入 <---- INSERT HERE / 在这输入',
  '맵 데이터 <---- 입력은 여기에',
  'Map Data     <---- INSERT YOUR MAP DATA HERE',
];

function getMapDataRuleNames() {
  const arr = (CURRENT_MAP && Array.isArray(CURRENT_MAP.mapData) && CURRENT_MAP.mapData.length)
    ? CURRENT_MAP.mapData
    : DEFAULT_MAPDATA_RULE_NAMES;

  return arr.map(s => String(s));
}

let MAPS_CFG = null;
let CURRENT_MAP = null;

function getMapIdFromUrl() {
  const id = new URLSearchParams(window.location.search).get('map');
  return (id && id.trim()) ? id.trim() : null;
}
function setMapIdInUrl(id) {
  const u = new URL(window.location.href);
  u.searchParams.set('map', id);
  history.replaceState(null, '', u);
}

async function loadMapsConfig() {
  const res = await fetch(MAPS_CONFIG_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${MAPS_CONFIG_URL} (${res.status})`);
  const cfg = await res.json();
  if (!cfg?.maps?.length) throw new Error('editor_maps.json: no maps[]');
  return cfg;
}

function findMap(cfg, id) {
  return (cfg.maps || []).find(m => m.id === id) || null;
}

function populateMapSelect(cfg) {
  if (!mapSelect) return;
  mapSelect.innerHTML = cfg.maps
    .map(m => `<option value="${m.id}">${m.label || m.id}</option>`)
    .join('');
}

function clearGroup(group) {
  while (group.children.length) group.remove(group.children[0]);
}

// (optional) avoid GPU leaks when removing objects
function disposeObject3D(root) {
  root?.traverse?.((o) => {
    if (o.geometry) o.geometry.dispose?.();
    const mat = o.material;
    if (Array.isArray(mat)) mat.forEach(m => m.dispose?.());
    else mat?.dispose?.();
    const tex = mat?.map;
    tex?.dispose?.();
  });
}

/* ============================================================================
  Maps.json (map name + variant id) for export
============================================================================ */
const MAPS_TRANSLATIONS_URL = '/translations/maps.json';
let MAPS_TR = null;

let MAPS_TR_KEYINDEX = null;

function normKey(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function buildMapsKeyIndex(tr) {
  const idx = new Map();
  for (const k of Object.keys(tr || {})) {
    const nk = normKey(k);
    if (nk && !idx.has(nk)) idx.set(nk, k);
  }
  return idx;
}

async function loadMapsTranslations() {
  if (MAPS_TR) return MAPS_TR;
  const res = await fetch(MAPS_TRANSLATIONS_URL, { cache: 'force-cache' });
  if (!res.ok) throw new Error(`Failed to load ${MAPS_TRANSLATIONS_URL} (${res.status})`);
  MAPS_TR = await res.json();

  // build index once
  MAPS_TR_KEYINDEX = buildMapsKeyIndex(MAPS_TR);

  return MAPS_TR;
}

function getEntryKeyCaseInsensitive(obj, wanted) {
  if (!obj || !wanted) return null;
  const w = String(wanted).toLowerCase();
  for (const k of Object.keys(obj)) {
    if (String(k).toLowerCase() === w) return k;
  }
  return null;
}

// pick a localized map name from translations/maps.json
function pickLocalizedMapName(entry, lang) {
  if (!entry) return null;

  const raw = String(lang || '').trim();
  const base = raw.split('-')[0]?.toLowerCase() || '';

  // 1) exact match
  if (raw && entry[raw]) return entry[raw];

  // 2) case-insensitive exact (handles fr-fr vs fr-FR)
  const k1 = getEntryKeyCaseInsensitive(entry, raw);
  if (k1 && entry[k1]) return entry[k1];

  // 3) base language (fr / en / zh / ...)
  if (base && entry[base]) return entry[base];
  const k2 = getEntryKeyCaseInsensitive(entry, base);
  if (k2 && entry[k2]) return entry[k2];

  // 4) any locale starting with base-
  if (base) {
    for (const k of Object.keys(entry)) {
      const kl = String(k).toLowerCase();
      if (kl.startsWith(base + '-') && entry[k]) return entry[k];
    }
  }

  // 5) original fallback chain
  return (
    entry['en-US'] ||
    entry['fr-FR'] ||
    entry['de-DE'] ||
    entry['es-ES'] ||
    entry['ja-JP'] ||
    entry['ko-KR'] ||
    entry['zh-CN'] ||
    null
  );
}

function isLikelyVariantId(x) {
  const s = String(x ?? '').trim();
  // workshop variant ids (often 15-19 digits)
  return /^\d{10,}$/.test(s);
}

// determine which key in maps.json matches CURRENT_MAP
function getMapsJsonKeyForCurrentMap() {
  return (
    CURRENT_MAP?.maps_json_key ||
    CURRENT_MAP?.map_key ||
    CURRENT_MAP?.key ||
    CURRENT_MAP?.id ||
    null
  );
}

// Determine which variant to use (default if not specified)
function getVariantKeyForCurrentMap() {
  return (
    CURRENT_MAP?.variant_key ||
    CURRENT_MAP?.variant ||
    'default'
  );
}

function pickVariantId(entry, variantKey) {
  // primary format: entry.variants.{...}
  const v = entry?.variants;
  if (v && typeof v === 'object') {
    if (variantKey && isLikelyVariantId(v[variantKey])) return String(v[variantKey]);
    if (isLikelyVariantId(v.default)) return String(v.default);

    const first = Object.values(v).find(isLikelyVariantId);
    return first ? String(first) : null;
  }

  // tolerant formats
  if (variantKey && isLikelyVariantId(entry?.[variantKey])) return String(entry[variantKey]);

  for (const k of [
    'variantId', 'variant_id',
    'workshopVariant', 'workshop_variant',
    'defaultVariant', 'default_variant',
    'default', 'id'
  ]) {
    if (isLikelyVariantId(entry?.[k])) return String(entry[k]);
  }

  if (isLikelyVariantId(entry)) return String(entry);

  return null;
}

function resolveMapsEntry(tr, keyRaw) {
  if (!tr || !keyRaw) return null;

  const key = String(keyRaw).trim();
  if (!key) return null;

  // direct
  if (tr[key]) return { key, entry: tr[key] };

  // case-insensitive key
  const kci = getEntryKeyCaseInsensitive(tr, key);
  if (kci && tr[kci]) return { key: kci, entry: tr[kci] };

  // separators variations
  const k1 = key.includes('-') ? key.replace(/-/g, '_') : null;
  const k2 = key.includes('_') ? key.replace(/_/g, '-') : null;
  if (k1 && tr[k1]) return { key: k1, entry: tr[k1] };
  if (k2 && tr[k2]) return { key: k2, entry: tr[k2] };

  // normalized index
  const nk = normKey(key);
  const realKey = MAPS_TR_KEYINDEX?.get(nk) || null;
  if (realKey && tr[realKey]) return { key: realKey, entry: tr[realKey] };

  return null;
}

function resolveMapsEntryByLabel(tr, label, lang) {
  if (!tr || !label) return null;
  const target = normKey(label);
  if (!target) return null;

  for (const [k, entry] of Object.entries(tr)) {
    const nm =
      pickLocalizedMapName(entry, lang) ||
      pickLocalizedMapName(entry, 'fr-FR') ||
      pickLocalizedMapName(entry, 'en-US');

    if (nm && normKey(nm) === target) return { key: k, entry };
  }
  return null;
}

// Resolve map name/id for current map + current framework lang
async function resolveCurrentMapWorkshopLine(lang) {
  const tr = await loadMapsTranslations();

  const keyRaw = getMapsJsonKeyForCurrentMap();
  const labelFallback = CURRENT_MAP?.workshop_map_name || CURRENT_MAP?.workshop_name || CURRENT_MAP?.label || CURRENT_MAP?.id || null;

  // 1) find entry by key (robust)
  let hit = resolveMapsEntry(tr, keyRaw);

  // 2) if not found, try by label (ex: "Château Guillard")
  if (!hit && labelFallback) hit = resolveMapsEntryByLabel(tr, labelFallback, lang);

  // 3) if still not found, last resort: allow map-def to provide both fields
  if (!hit) {
    const variantFromDef =
      CURRENT_MAP?.workshop_variant_id ||
      CURRENT_MAP?.workshop_variant ||
      CURRENT_MAP?.variant_id ||
      CURRENT_MAP?.variantId ||
      null;

    if (labelFallback && isLikelyVariantId(variantFromDef)) {
      return { name: labelFallback, variantId: String(variantFromDef) };
    }
    return null;
  }

  const entry = hit.entry;

  const name = pickLocalizedMapName(entry, lang) || labelFallback;
  const variantId =
    pickVariantId(entry, getVariantKeyForCurrentMap()) ||
    (isLikelyVariantId(CURRENT_MAP?.workshop_variant_id) ? String(CURRENT_MAP.workshop_variant_id) : null);

  if (!name || !variantId) return null;

  return { name, variantId };
}

/* ============================================================================
  Patch "Team Deathmatch" -> enabled maps { <MapName> <VariantId> }
============================================================================ */
function patchTeamDeathmatchEnabledMap(src, mapName, variantId) {
  if (!src || !mapName || !variantId) return src;

  const eol = detectEol(src);
  const lower = src.toLowerCase();

  const modeIdx = lower.indexOf('team deathmatch');
  if (modeIdx < 0) return src;

  const modeOpen = src.indexOf('{', modeIdx);
  if (modeOpen < 0) return src;

  const modeClose = braceMatchIndex(src, modeOpen);
  if (modeClose < 0) return src;

  // Search "enabled maps" inside that block only
  const modeBlock = src.slice(modeOpen + 1, modeClose);
  const emLocalIdx = modeBlock.toLowerCase().indexOf('enabled maps');
  if (emLocalIdx < 0) return src;

  const emIdx = modeOpen + 1 + emLocalIdx;

  const mapsOpen = src.indexOf('{', emIdx);
  if (mapsOpen < 0 || mapsOpen > modeClose) return src;

  const mapsClose = braceMatchIndex(src, mapsOpen);
  if (mapsClose < 0 || mapsClose > modeClose) return src;

  // Indent for the "{" line
  const braceLineStart = src.lastIndexOf(eol, mapsOpen);
  const braceLine = src.slice(braceLineStart + eol.length, mapsOpen);
  const indentBrace = (braceLine.match(/^[\t \u00A0]*/) || [''])[0];

  // Indent for entries: reuse existing one if present, else +1 step
  const inside = src.slice(mapsOpen + 1, mapsClose);
  let entryIndent = null;
  for (const line of inside.split(eol)) {
    if (line.trim()) {
      entryIndent = (line.match(/^[\t \u00A0]*/) || [''])[0];
      break;
    }
  }
  if (entryIndent == null) {
    const step = indentBrace.includes('\t') ? '\t' : '    ';
    entryIndent = indentBrace + step;
  }

  const line = `${entryIndent}${mapName} ${variantId}`;

  const before = src.slice(0, mapsOpen + 1);
  const after  = src.slice(mapsClose);

  const newInside = eol + line + eol + indentBrace;

  return before + newInside + after;
}

/* ============================================================================
  Renderer / Scene / Camera
============================================================================ */
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: false,
  alpha: false,
  powerPreference: 'high-performance',
});

renderer.setClearColor(0x05060a, 1);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1));
renderer.sortObjects = false;
if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
if ('toneMapping' in renderer) {
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = EXPOSURE_NO_GLB_LIGHTS;
}

renderer.domElement.style.touchAction = 'none';
renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
renderer.domElement.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });

if ('physicallyCorrectLights' in renderer) renderer.physicallyCorrectLights = true;
if ('useLegacyLights' in renderer) renderer.useLegacyLights = false;
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05060a, 0.00012);
scene.background = new THREE.Color(0x05060a);
// Environment reflections
const pmrem = new THREE.PMREMGenerator(renderer);
const DEFAULT_ENV = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
pmrem.dispose();

scene.environment = DEFAULT_ENV;

// Camera
const camera = new THREE.PerspectiveCamera(55, 2, 0.1, 500000);
camera.position.set(0, 220, 420);

/* ============================================================================
  Loading Overlay
============================================================================ */
let LOAD_UI = null;
const LOAD_AUTO = new Map();

const yieldToBrowser = (() => {
  const ch = new MessageChannel();
  return () => new Promise(res => {
    ch.port1.onmessage = () => res();
    ch.port2.postMessage(0);
  });
})();

function ensureLoadUI() {
  if (LOAD_UI) return LOAD_UI;
  if (!editorStage) return null;

  const wrap = document.createElement('div');
  wrap.id = 'mapLoadOverlay';
  wrap.style.cssText = `
    position:absolute; inset:0; z-index:9999;
    display:none; align-items:center; justify-content:center;
    background: linear-gradient(to bottom, rgba(0,0,0,.65), rgba(0,0,0,.35));
    pointer-events:none;
  `;

  const card = document.createElement('div');
  card.style.cssText = `
    width:min(520px, calc(100% - 40px));
    border:1px solid rgba(255,255,255,.10);
    background: rgba(9,9,12,.78);
    backdrop-filter: blur(10px);
    border-radius: 18px;
    padding: 16px 16px 14px;
    box-shadow: 0 20px 60px rgba(0,0,0,.55);
  `;

  const title = document.createElement('div');
  title.style.cssText = `display:flex; align-items:center; gap:10px; color:rgba(255,255,255,.92); font-weight:900; font-size:14px;`;

  const spinner = document.createElement('div');
  spinner.style.cssText = `
    width:14px;height:14px;border-radius:999px;
    border:2px solid rgba(255,255,255,.25);
    border-top-color: rgba(255,255,255,.95);
    animation: loadSpin 0.9s linear infinite;
  `;

  const titleText = document.createElement('span');
  titleText.textContent = 'Loading...';

  title.appendChild(spinner);
  title.appendChild(titleText);

  const sub = document.createElement('div');
  sub.style.cssText = `margin-top:4px; color:rgba(255,255,255,.62); font-size:12px;`;
  sub.textContent = 'Loading assets';

  const barWrap = document.createElement('div');
  barWrap.style.cssText = `
    margin-top:12px; height:10px; border-radius:999px;
    background: rgba(255,255,255,.10);
    overflow:hidden; border:1px solid rgba(255,255,255,.10);
  `;

  const bar = document.createElement('div');
  bar.style.cssText = `
    height:100%; width:0%;
    background: linear-gradient(90deg, rgba(56,189,248,.9), rgba(52,211,153,.9));
    transition: width .12s ease;
  `;
  barWrap.appendChild(bar);

  const pct = document.createElement('div');
  pct.style.cssText = `margin-top:8px; display:flex; justify-content:space-between; color:rgba(255,255,255,.55); font-size:11px;`;
  pct.innerHTML = `<span id="loadPctLeft">0%</span><span id="loadPctRight">Please wait…</span>`;

  card.appendChild(title);
  card.appendChild(sub);
  card.appendChild(barWrap);
  card.appendChild(pct);

  wrap.appendChild(card);
  editorStage.style.position = editorStage.style.position || 'relative';
  editorStage.appendChild(wrap);

  LOAD_UI = {
    token: 0,
    wrap,
    titleText,
    sub,
    bar,
    pctLeft: pct.querySelector('#loadPctLeft'),
    pctRight: pct.querySelector('#loadPctRight'),
  };
  return LOAD_UI;
}

function showLoadOverlay(token, title = 'Loading map…') {
  const ui = ensureLoadUI();
  if (!ui) return;
  ui.token = token;
  ui.titleText.textContent = title;
  ui.sub.textContent = 'Loading assets';
  ui.bar.style.width = '0%';
  ui.pctLeft.textContent = '0%';
  ui.pctRight.textContent = 'Starting…';
  ui.wrap.style.display = 'flex';
}

function stopAutoLoadProgress(token) {
  const id = LOAD_AUTO.get(token);
  if (id) clearInterval(id);
  LOAD_AUTO.delete(token);
}

function startAutoLoadProgress(token, from = 86, to = 99) {
  stopAutoLoadProgress(token);

  const ui = ensureLoadUI();
  if (!ui || ui.token !== token) return;

  let p = parseFloat(ui.bar.style.width) || from;
  p = Math.max(from, Math.min(to, p));

  const id = setInterval(() => {
    const u = ensureLoadUI();
    if (!u || u.token !== token) { stopAutoLoadProgress(token); return; }

    // ease toward "to"
    const remain = to - p;
    const step = Math.max(0.12, remain * 0.06); // slows near 99
    p = Math.min(to, p + step);

    u.bar.style.width = `${p.toFixed(2)}%`;
    u.pctLeft.textContent = `${Math.round(p)}%`;

    if (p >= to - 0.05) stopAutoLoadProgress(token);
  }, 80);

  LOAD_AUTO.set(token, id);
}

function setLoadStage(token, stage, percent = null, detail = '') {
  const ui = ensureLoadUI();
  if (!ui || ui.token !== token) return;

  ui.sub.textContent = stage || 'Loading…';

  if (Number.isFinite(percent)) {
    const p = Math.max(0, Math.min(100, Math.round(percent)));
    ui.bar.style.width = `${p}%`;
    ui.pctLeft.textContent = `${p}%`;
  }

  ui.pctRight.textContent = detail || '';
}

function hideLoadOverlay(token) {
  const ui = ensureLoadUI();
  if (!ui || ui.token !== token) return;
  stopAutoLoadProgress(token);
  ui.wrap.style.display = 'none';
}

// ============================================================================
// Workshop <-> Editor (GLB) coordinate mapping
// ============================================================================
let WS_OFFSET = new THREE.Vector3(0, 0, 0);

function wsToEditor(vWs) {
  return vWs.clone().add(WS_OFFSET);
}
function editorToWs(vEd) {
  return vEd.clone().sub(WS_OFFSET);
}

// For checkpoints we apply a small visual lift (ring z-fighting).
// This returns the "true" base position (Editor space) used for Workshop conversion.
function getMarkerBaseEditorPos(marker, ent) {
  const p = marker.position.clone();

  if (ent?.type === 'checkpoints' && marker?.userData?._isCheckpointMarker) {
    const liftY = marker.userData?._liftY;
    if (Number.isFinite(liftY)) p.y -= liftY;
  }
  return p;
}
/* ============================================================================
  Lights / Helpers
============================================================================ */
const editorLights = new THREE.Group();
scene.add(editorLights);

editorLights.add(new THREE.HemisphereLight(0xbfd1ff, 0x0b0c12, 0.55));
const keyLight = new THREE.DirectionalLight(0xffffff, 0.65);
keyLight.position.set(600, 900, 400);
editorLights.add(keyLight);

let fallbackSun = null;
let ambientFill = null;

function ensureFallbackSun(bounds) {
  if (fallbackSun) return fallbackSun;

  fallbackSun = new THREE.DirectionalLight(0xffffff, 2.2);
  fallbackSun.name = '__FallbackSun';
  fallbackSun.position.set(600, 900, 400);

  // aim center model
  const center = bounds.getCenter(new THREE.Vector3());
  fallbackSun.target.position.copy(center);
  scene.add(fallbackSun.target);

  editorLights.add(fallbackSun);
  return fallbackSun;
}

function ensureAmbientFill() {
  if (ambientFill) return ambientFill;
  ambientFill = new THREE.AmbientLight(0xffffff, 0.10);
  ambientFill.name = '__AmbientFill';
  scene.add(ambientFill);
  return ambientFill;
}

function applyLightingProfile({ lightReport, root, bounds }) {
  const hasSunLike = !!lightReport?.mainSun && (lightReport.mainSun.isDirectionalLight || lightReport.dir.length > 0);

  // Keep natural IBL lightning
  scene.environment = DEFAULT_ENV;

  // Small fill to avoid pure black shadows
  ensureAmbientFill();

  if (hasSunLike) {
    // Keep GLB lights + some IBL
    renderer.toneMappingExposure = 0.15;
    setEnvMapIntensity(root, 0.18);

    // Avoid completely “cutting” your editor lights:
    // instead of visible=false, just lower intensity
    editorLights.children.forEach(l => {
      if (l.isLight) l.intensity = (l === keyLight) ? 0.15 : 0.10;
    });

    // Optional: slight boost if your MainSun is too weak
    lightReport.mainSun.intensity *= 1.0;
    lightReport.mainSun.visible = true;
  } else {
    // No sun in GLB -> fallback sun + slightly stronger IBL
    ensureFallbackSun(bounds);
    renderer.toneMappingExposure = 0.50;
    setEnvMapIntensity(root, 0.35);

    // Restore editor lights “normales”
    editorLights.children.forEach(l => {
      if (l.isHemisphereLight) l.intensity = 0.55;
      if (l.isDirectionalLight && l.name !== '__FallbackSun') l.intensity = 0.65;
      if (l.name === '__FallbackSun') l.intensity = 2.2;
    });
  }
}

/* ============================================================================
  PERF HUD
============================================================================ */
const stats = new Stats();
stats.showPanel(0); // 0: FPS
stats.dom.style.cssText =
  'position:fixed;top:10px;left:10px;z-index:99999;pointer-events:none;display:none;';
document.body.appendChild(stats.dom);

const perfHud = document.createElement('div');
perfHud.style.cssText = `
  position:fixed;top:10px;right:10px;z-index:99999;
  font:12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  color:#d6e6ff;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.12);
  padding:8px 10px;border-radius:10px;white-space:pre;pointer-events:none;
  display:none;
`;
document.body.appendChild(perfHud);

let PERF_VISIBLE = false;

function setPerfVisible(on) {
  PERF_VISIBLE = !!on;
  stats.dom.style.display = PERF_VISIBLE ? 'block' : 'none';
  perfHud.style.display = PERF_VISIBLE ? 'block' : 'none';
  if (PERF_VISIBLE) updatePerfHud();
}

function updatePerfHud() {
  if (!PERF_VISIBLE) return;
  const i = renderer.info;
  perfHud.textContent =
`fps: (see stats)
calls: ${i.render.calls}
tris:  ${i.render.triangles}
lines: ${i.render.lines}  points: ${i.render.points}
geo:   ${i.memory.geometries}  tex: ${i.memory.textures}
prog:  ${(i.programs && i.programs.length) ? i.programs.length : 'n/a'}`;
}

setInterval(updatePerfHud, 250);

// hidden by default
setPerfVisible(false);

function geomSignature(g) {
  const attrs = g?.attributes || {};
  const names = Object.keys(attrs).sort();

  // index compatibility: all indexed or none
  let sig = g.index ? 'idx' : 'noidx';

  // attribute compatibility: same names + itemSize + normalized
  for (const n of names) {
    const a = attrs[n];
    sig += `|${n}:${a.itemSize}:${a.normalized ? 1 : 0}`;
  }
  return sig;
}

function mergeOpaqueStaticByMaterial(root) {
  root.updateWorldMatrix(true, true);

  // key = material + geometry signature (attributes + indexed)
  const buckets = new Map(); // key -> { mat, meshes: [], geoms: [] }

  root.traverse((o) => {
    if (!o.isMesh) return;
    if (!o.visible) return;
    if (o.name === 'COLLIDER') return;
    if (o.isSkinnedMesh) return;
    if (!o.geometry?.isBufferGeometry) return;

    const mat = o.material;
    if (!mat || Array.isArray(mat)) return; // skip multi-material
    if (mat.transparent) return;            // skip transparent (water etc.)

    const n = (o.name || '').toLowerCase();
    if (n.includes('water')) return;

    const sig = geomSignature(o.geometry);
    const key = `${mat.uuid}|${sig}`;

    if (!buckets.has(key)) buckets.set(key, { mat, meshes: [], geoms: [] });

    const g = o.geometry.clone();
    g.applyMatrix4(o.matrixWorld);

    buckets.get(key).meshes.push(o);
    buckets.get(key).geoms.push(g);
  });

  const mergedGroup = new THREE.Group();
  mergedGroup.name = '__MERGED_OPAQUE__';

  for (const { mat, meshes, geoms } of buckets.values()) {
    if (meshes.length < 2) {
      // cleanup clones
      for (const g of geoms) g.dispose?.();
      continue;
    }

    let merged = null;
    try {
      merged = mergeGeometries(geoms, false);
    } catch (e) {
      console.warn('[mergeOpaqueStaticByMaterial] mergeGeometries threw', e);
    } finally {
      // IMPORTANT: dispose clones in all cases (avoid memory leaks)
      for (const g of geoms) g.dispose?.();
    }

    if (!merged) continue;

    merged.computeBoundingSphere?.();
    merged.computeBoundingBox?.();

    const mesh = new THREE.Mesh(merged, mat);
    mesh.name = `__merged_${mat.name || mat.uuid}`;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();

    mergedGroup.add(mesh);

    // remove originals
    for (const m of meshes) {
      m.parent?.remove(m);
    }
  }

  if (mergedGroup.children.length) root.add(mergedGroup);
}

function freezeStaticTransforms(root) {
  root.traverse((o) => {
    // freeze GLB objects
    if (o.isObject3D) o.matrixAutoUpdate = false;
  });
  root.updateMatrixWorld(true);
}

/* ============================================================================
  Groups
============================================================================ */
const mapGroup = new THREE.Group();
scene.add(mapGroup);

const markersGroup = new THREE.Group();
scene.add(markersGroup);

/* ============================================================================
  Modes (UI like OW)
============================================================================ */
const MODES = [
  { id: 'checkpoints', label: 'CHECKPOINTS' },
  { id: 'boundarySpheres', label: 'BOUNDARY SPHERES' },
  { id: 'functionOrbs', label: 'FUNCTION ORBS' },
  { id: 'skillBans', label: 'SKILL BANS' },
  { id: 'portals', label: 'PORTALS' },
];

let modeIndex = 0;
let modeMenuTimer = null;

function getMode() {
  return MODES[modeIndex];
}

function setMode(idx) {
  modeIndex = (idx + MODES.length) % MODES.length;
  const mode = MODES[modeIndex];

  // cancel portal draft if leaving portals
  if (portalDraft && mode.id !== 'portals') {
    markersGroup.remove(portalDraft.portalGroup);
    portalDraft = null;
  }

  if (hudModeTitle) hudModeTitle.textContent = mode.label;

  if (hudModeList) {
    hudModeList.classList.remove('hidden');
    hudModeList.innerHTML = MODES.map((m, i) => {
      const active = i === modeIndex;
      return `
        <div class="flex items-center gap-2 ${active ? 'text-sky-200' : 'text-sky-100/90'}">
          <span class="inline-block h-2 w-2 rounded-full ${active ? 'bg-sky-300' : 'bg-sky-300/40'}"></span>
          <span class="${active ? 'font-semibold' : ''}">${m.label}</span>
        </div>
      `;
    }).join('');

    clearTimeout(modeMenuTimer);
    modeMenuTimer = setTimeout(() => hudModeList.classList.add('hidden'), 1400);
  }

  // clear selection if it's from another mode
  if (selected?.userData?.entity?.type && selected.userData.entity.type !== mode.id) {
    setSelected(null, null);
  }

  updateHudAll();
}

function updateHudHelp() {
  if (!hudHelpBody) return;
  const mode = getMode();

  const base = [
    `V · Speed`,
    `Del · Delete Selected`,
    `[ / ] · Selected item`,
  ];

  const extra = [];
  if (mode.id === 'checkpoints') {
    extra.push(`LMB · Select a checkpoint`);
    extra.push(`Add ON + LMB on map · Place checkpoint`);
    extra.push(`G · Snap selected checkpoint to ground`);
    extra.push(`T · Set teleport destination (click)`);
    extra.push(`Shift+T · Clear teleport destination`);
  } else if (mode.id === 'boundarySpheres') {
    extra.push(`C / Shift+C · Radius +/-`);
    extra.push(`Selection + [ / ] · Link to CP`);
  } else if (mode.id === 'functionOrbs') {
    extra.push(`C / Shift+C · Strength +/-`);
    extra.push(`1 · Toggle Give Ult`);
    extra.push(`2 · Toggle Give Dash`);
    extra.push(`3 · Toggle Unlock Checkpoint`);
    extra.push(`Selection + [ / ] · Link to CP`);
  } else if (mode.id === 'portals') {
    extra.push(`Add ON + LMB · Place start, then end`);
    extra.push(`Selection + [ / ] · Link to CP`);
  } else if (mode.id === 'skillBans') {
    extra.push(`1..8 · Toggle bans for active CP`);
  }

  hudHelpBody.innerHTML = [...extra, '', ...base]
    .filter(Boolean)
    .map(line => `<div>${line.replace('·', '<span class="text-white/40">·</span>')}</div>`)
    .join('');
}

const HUD_STATE_KEY = 'gp_editor_hud_state_v2';
let HUD_STATE = {
  left: true,
  right: true,
  top: true,
  hotkeys: true,
  quickbar: true,
  perf: false,
};

function loadHudState() {
  try {
    const raw = localStorage.getItem(HUD_STATE_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== 'object') return;
    HUD_STATE = { ...HUD_STATE, ...obj };
  } catch (_) {}
}

function saveHudState() {
  try {
    localStorage.setItem(HUD_STATE_KEY, JSON.stringify(HUD_STATE));
  } catch (_) {}
}

function setHudBlockVisible(el, visible) {
  if (!el) return;
  el.classList.toggle('hidden', !visible);
  // Layout might depend on visible panels
  try { layoutHud(); } catch (_) {}
}

function syncDockUi() {
  // Dock buttons reflect panel visibility state (subtle highlight)
  const onCls = 'bg-white/10';
  dockControls?.classList.toggle(onCls, !!HUD_STATE.right);
  dockData?.classList.toggle(onCls, !!HUD_STATE.left);
  dockMode?.classList.toggle(onCls, !!HUD_STATE.top);
  dockQuickbar?.classList.toggle(onCls, !!HUD_STATE.quickbar);
  dockShortcuts?.classList.toggle(onCls, !!HUD_STATE.hotkeys);
  dockPerf?.classList.toggle(onCls, !!PERF_VISIBLE);
}

function applyHudState() {
  setHudBlockVisible(hudLeftPanel, !!HUD_STATE.left);
  setHudBlockVisible(hudRightPanel, !!HUD_STATE.right);
  setHudBlockVisible(hudTopPanel, !!HUD_STATE.top);
  setHudBlockVisible(hudHotkeys, !!HUD_STATE.hotkeys);
  setPerfVisible(!!HUD_STATE.perf);
  syncQuickbarVisibility();
  ensureQuickbarMoveBtn();
  syncMoveModeUi();
  syncDockUi();
}

function toggleHudBlock(el, key = null) {
  if (!el) return;
  const next = el.classList.contains('hidden');
  el.classList.toggle('hidden', !next);

  if (key) HUD_STATE[key] = next;
  saveHudState();
  syncDockUi();
  try { layoutHud(); } catch (_) {}
}

function syncQuickbarVisibility() {
  if (!hudQuickbar) return;
  const shouldShow = isFullscreen() && !!HUD_STATE.quickbar;
  hudQuickbar.classList.toggle('hidden', !shouldShow);
}

function toggleQuickbar(force) {
  HUD_STATE.quickbar = (typeof force === 'boolean') ? force : !HUD_STATE.quickbar;
  syncQuickbarVisibility();
  saveHudState();
  syncDockUi();
}

loadHudState();
applyHudState();

function isFullscreen() {
  return !!document.fullscreenElement;
}

async function toggleFullscreen() {
  if (!editorStage) return;

  try {
    if (!isFullscreen()) {
      await editorStage.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  } catch (e) {
    console.warn('Fullscreen failed:', e);
  }
}

function syncFullscreenUi() {
  if (!btnFullscreen) return;
  syncQuickbarVisibility();
  btnFullscreen.innerHTML = isFullscreen()
    ? `<span class="inline-block h-2 w-2 rounded-full bg-emerald-300/90"></span> EXIT <span class="text-white/50 font-semibold">(F)</span>`
    : `<span class="inline-block h-2 w-2 rounded-full bg-sky-300/80"></span> FULLSCREEN <span class="text-white/50 font-semibold">(F)</span>`;
}

btnFullscreen?.addEventListener('click', () => toggleFullscreen());
document.addEventListener('fullscreenchange', () => {
  if (isFullscreen()) {
    toggleQuickbar(true);
  }
  syncFullscreenUi();
  setTimeout(() => resize(), 0);
});

/* ============================================================================
  Transform Gizmo
============================================================================ */
const gizmo = new TransformControls(camera, renderer.domElement);
gizmo.setMode('translate');

function setGizmoActive(on) {
  gizmo.enabled = !!on;
  gizmoHelper.visible = !!on;
}

const gizmoHelper = (typeof gizmo.getHelper === 'function') ? gizmo.getHelper() : gizmo;
scene.add(gizmoHelper);

// size API depends on revision
if (typeof gizmo.setSize === 'function') gizmo.setSize(1.0);
else if ('size' in gizmo) gizmo.size = 1.0;

setGizmoActive(false);

console.log('THREE.REVISION', THREE.REVISION);
console.log('gizmo instanceof THREE.Object3D ?', gizmo instanceof THREE.Object3D); // can be false
console.log('helper instanceof THREE.Object3D ?', gizmoHelper instanceof THREE.Object3D); // should be true

let isGizmoDragging = false;
gizmo.addEventListener('dragging-changed', (e) => {
  isGizmoDragging = !!e.value;
  if (isGizmoDragging) stopMouseLook();
});

/* ============================================================================
  State
============================================================================ */
let viewType = 'all'; // 'all' | 'only'
let activeCheckpoint = 0;

// 8 bans (matching your screenshot)
const SKILL_BANS = [
  { label: 'MULTI-CLIMB',   bind: 'F + LMB' },
  { label: 'CREATEBHOP',    bind: 'F + RMB' },
  { label: 'WALLCLIMB',     bind: 'F + C' },
  { label: 'SAVE DOUBLE',   bind: 'F + SPACE' },
  { label: 'DEATH HOP',     bind: 'LSHIFT + LMB' },
  { label: 'EMOTE',         bind: 'LSHIFT + RMB' },
  { label: 'REQUIRE BHOP',  bind: 'LSHIFT + SPACE' },
  { label: 'STAND CREATE',  bind: 'LSHIFT + C' },
];

let skillBansByCp = new Map();

let collider = null;
let addMode = false;

const ADD_TOGGLE_CODE = 'KeyQ';
const ADD_KEY_LABEL = 'A/Q';

let selected = null; // marker group
let selectedData = null; // entity object
let selectedGizmoTarget = null;

let TELEPORT_ARMED = false;

let entities = []; // { type, index, ..., marker }
let importedSkillBans = { SHIFT: [], Dao: [] };
let LAST_IMPORTED_FULL_TEXT = null;
let LAST_IMPORTED_MAPDATA_INFO = null;

btnAdd?.addEventListener('click', () => toggleAddMode());
btnExport?.addEventListener('click', () => { exportWorkshopMapData(); });
btnImport?.addEventListener('click', () => openImportModal());

viewAllBtn?.addEventListener('click', () => setViewType('all'));
viewOnlyBtn?.addEventListener('click', () => setViewType('only'));

checkpointSelect?.addEventListener('change', (e) => {
  const v = parseInt(e.target?.value || '0', 10);
  setActiveCheckpoint(v, { selectMarker: getMode().id === 'checkpoints' });
});

cpPrev?.addEventListener('click', () => setActiveCheckpoint(activeCheckpoint - 1, { selectMarker: getMode().id === 'checkpoints' }));
cpNext?.addEventListener('click', () => setActiveCheckpoint(activeCheckpoint + 1, { selectMarker: getMode().id === 'checkpoints' }));

// HUD dock (canvas toggles)
dockControls?.addEventListener('click', () => toggleHudBlock(hudRightPanel, 'right'));
dockData?.addEventListener('click', () => toggleHudBlock(hudLeftPanel, 'left'));
dockMode?.addEventListener('click', () => toggleHudBlock(hudTopPanel, 'top'));
dockMove?.addEventListener('click', () => toggleMoveMode());
dockShortcuts?.addEventListener('click', () => toggleHudBlock(hudHotkeys, 'hotkeys'));
dockPerf?.addEventListener('click', () => { setPerfVisible(!PERF_VISIBLE); HUD_STATE.perf = !!PERF_VISIBLE; saveHudState(); syncDockUi(); });
dockQuickbar?.addEventListener('click', () => toggleQuickbar());

// Quickbar (shown in fullscreen)
hudQAdd?.addEventListener('click', () => toggleAddMode());
hudQSnap?.addEventListener('click', () => snapSelectedCheckpoint());
hudQViewAll?.addEventListener('click', () => setViewType('all'));
hudQViewOnly?.addEventListener('click', () => setViewType('only'));
hudQCpPrev?.addEventListener('click', () => setActiveCheckpoint(activeCheckpoint - 1, { selectMarker: getMode().id === 'checkpoints' }));
hudQCpNext?.addEventListener('click', () => setActiveCheckpoint(activeCheckpoint + 1, { selectMarker: getMode().id === 'checkpoints' }));
hudQCheckpointSelect?.addEventListener('change', (e) => {
  const v = parseInt(e.target?.value || '0', 10);
  setActiveCheckpoint(v, { selectMarker: getMode().id === 'checkpoints' });
});
hudQHide?.addEventListener('click', () => toggleQuickbar(false));

function syncAddUi() {
  if (btnAdd) {
    btnAdd.textContent = addMode ? `Add: ON (${ADD_KEY_LABEL})` : `Add: OFF (${ADD_KEY_LABEL})`;
    btnAdd.classList.toggle('bg-emerald-500/20', addMode);
    btnAdd.classList.toggle('border-emerald-400/30', addMode);
  }
  if (hudAddBadge) {
    hudAddBadge.innerHTML = addMode
      ? `ADD · ON <span class="text-white/45 font-semibold">(${ADD_KEY_LABEL})</span>`
      : `ADD · OFF <span class="text-white/45 font-semibold">(${ADD_KEY_LABEL})</span>`;
    hudAddBadge.classList.toggle('bg-emerald-500/20', addMode);
    hudAddBadge.classList.toggle('border-emerald-400/30', addMode);
  }
  if (hudQAdd) {
    hudQAdd.textContent = addMode ? `ADD: ON (${ADD_KEY_LABEL})` : `ADD: OFF (${ADD_KEY_LABEL})`;
    hudQAdd.classList.toggle('bg-emerald-500/20', addMode);
    hudQAdd.classList.toggle('border-emerald-400/30', addMode);
  }
}

function toggleAddMode(force) {
  addMode = (typeof force === 'boolean') ? force : !addMode;
  syncAddUi();
  updateHudAll();
}

function isInSceneGraph(obj) {
  let o = obj;
  while (o) {
    if (o === scene) return true;
    o = o.parent;
  }
  return false;
}

function setSelected(marker, data, gizmoTarget = marker) {
  selected = marker || null;
  selectedData = data || null;

  gizmo.detach();
  setGizmoActive(false);
  selectedGizmoTarget = null;

  if (!marker) { updateHudAll(); return; }

  const tgt = gizmoTarget || marker;
  selectedGizmoTarget = tgt;

  const attachNow = () => {
    if (!selectedGizmoTarget) return;
    if (!isInSceneGraph(selectedGizmoTarget)) return;
    gizmo.attach(selectedGizmoTarget);
    setGizmoActive(true);
  };

  // avoid scene graph warning
  if (!isInSceneGraph(tgt)) queueMicrotask(attachNow);
  else attachNow();

  if (data?.type === 'checkpoints' && Number.isFinite(data.index)) {
    activeCheckpoint = clampCpIndex(data.index);
    updateCheckpointSelectUI();
    applyViewVisibility();
  }

  updateHudAll();
}

/* ============================================================================
  HUD helpers
============================================================================ */
function updateToolbarState() {
  const canSnap = (selectedData?.type === 'checkpoints');
  if (btnSnap) {
    btnSnap.disabled = !canSnap;
    btnSnap.classList.toggle('opacity-40', !canSnap);
    btnSnap.classList.toggle('cursor-not-allowed', !canSnap);
  }
  if (hudQSnap) {
    hudQSnap.disabled = !canSnap;
    hudQSnap.classList.toggle('opacity-40', !canSnap);
    hudQSnap.classList.toggle('cursor-not-allowed', !canSnap);
  }
}

function countByType(type) {
  return entities.filter((e) => e.type === type).length;
}

function updateHudCounters() {
  const mode = getMode();
  const count = countByType(mode.id);
  const maxIndex = count - 1;

  const level = (selectedData?.type === mode.id && Number.isFinite(selectedData.index))
    ? selectedData.index
    : 0;

  if (hudModeLevel) hudModeLevel.textContent = `LEVEL ${level} / ${maxIndex}`;

  const used = countByType('functionOrbs') + countByType('portals');
  if (hudOrbPortalLimit) hudOrbPortalLimit.textContent = `ORB/PORTAL LIMIT: ${used}/${ORB_PORTAL_MAX}`;
}

function setBadge(text) {
  if (!hudStatusBadge) return;
  hudStatusBadge.textContent = text;
}

function updateHudData() {
  const mode = getMode();

  if (!hudDataTitle || !hudDataBody) return;

  hudDataTitle.textContent = mode.id === 'checkpoints'
    ? 'CHECKPOINT DATA'
    : `${mode.label} DATA`;

  if (!selected || !selectedData || selectedData.type !== mode.id) {
    setBadge('NO DATA');
    hudDataBody.innerHTML = `
      <div class="text-white/90 font-semibold">NO DATA SELECTED</div>
      <div class="mt-2 text-white/70 text-sm">
        Mode: <b class="text-white/90">${mode.label}</b><br/>
        Add: <b class="text-white/90">${addMode ? 'ON' : 'OFF'}</b><br/>
        Tip: press <b class="text-white/90">E</b> to change mode.
      </div>
    `;

    if (mode.id === 'skillBans') {
      setBadge('SKILL BANS');
      const arr = ensureSkillBans(activeCheckpoint);

      hudDataBody.innerHTML = `
        <div class="text-white/90 font-semibold">ACTIVE CHECKPOINT</div>
        <div class="mt-1 text-white/75 text-sm">
          CP: <b class="text-white/90">${activeCheckpoint}</b> &nbsp; <span class="text-white/50">(use [ / ])</span>
        </div>

        <div class="mt-3 space-y-1 text-sm">
          ${SKILL_BANS.map((s, i) => {
            const on = !!arr[i];
            return `
              <div class="flex items-center justify-between gap-3">
                <span class="text-white/75"><b class="text-white/90">${i + 1}</b> · ${s.label}</span>
                <span class="${on ? 'text-emerald-200' : 'text-orange-200'}">${on ? 'TRUE' : 'FALSE'}</span>
              </div>
              <div class="text-[11px] text-white/40 -mt-1">${s.bind}</div>
            `;
          }).join('')}
        </div>
      `;
      return;
    }
    return;
  }

  const fmt = (n) => (Math.round(n * 100) / 100).toFixed(2);
  const fmtWsVec = (arr) => `[${fmt(arr[0])}, ${fmt(arr[1])}, ${fmt(arr[2])}]`;

  if (mode.id === 'checkpoints') {
    setBadge('SELECTED CHECKPOINT');
      const ws = selectedData.pos;
      const tp = selectedData.tp;

      hudDataBody.innerHTML = `
        <div class="text-white/90 font-semibold">SELECTED CHECKPOINT</div>
        <div class="mt-2 text-white/75 text-sm">
          INDEX: <b class="text-white/90">${selectedData.index}</b><br/>
          CP: <b class="text-white/90">${fmtWsVec(ws)}</b><br/>
          TP: <b class="text-white/90">${tp ? fmtWsVec(tp) : 'None'}</b>
        </div>
      `;
    return;
  }

  if (mode.id === 'boundarySpheres') {
    setBadge('SELECTED BOUNDARY SPHERE');
    const ws = selectedData.pos;
    const rSigned = Number(selectedData.radius ?? 5);
    const modeLabel = (rSigned < 0) ? 'STAY IN' : 'KEEP OUT';
    const rAbs = Math.abs(rSigned);
    hudDataBody.innerHTML = `
      <div class="text-white/90 font-semibold">SELECTED BOUNDARY SPHERE</div>
      <div class="mt-2 text-white/75 text-sm">
        VECTOR: <b class="text-white/90">${fmtWsVec(ws)}</b><br/>
        RADIUS: <b class="text-white/90">${fmt(rAbs)}</b> <span class="text-white/60">(${modeLabel})</span><br/>
        <span class="text-white/60">C / Shift+C · resize · (step 0.1)</span><br/>
        <span class="text-white/60">1 · toggle KEEP OUT / STAY IN</span>
      </div>
    `;
    return;
  }

  if (mode.id === 'functionOrbs') {
    setBadge('SELECTED BOUNCE ORB');
    const ws = selectedData.pos;
    const strength = selectedData.lock ? 0 : (selectedData.strength ?? 10);
    hudDataBody.innerHTML = `
      <div class="text-white/90 font-semibold">SELECTED BOUNCE ORB</div>
      <div class="mt-2 text-white/75 text-sm">
        VECTOR: <b class="text-white/90">${fmtWsVec(ws)}</b><br/>
        STRENGTH: <b class="text-white/90">${fmt(strength)}</b><br/>
        CP: <b class="text-white/90">${Number.isFinite(selectedData.cp) ? selectedData.cp : 0}</b><br/>
        GIVE ULT: <b class="text-white/90">${selectedData.ult ? 'TRUE' : 'FALSE'}</b> <span class="text-white/50">(1)</span><br/>
        GIVE DASH: <b class="text-white/90">${selectedData.dash ? 'TRUE' : 'FALSE'}</b> <span class="text-white/50">(2)</span><br/>
        UNLOCK CP: <b class="text-white/90">${selectedData.lock ? 'TRUE' : 'FALSE'}</b> <span class="text-white/50">(3)</span><br/>
        <div class="mt-2 text-white/60">
          C / Shift+C · strength &nbsp; | &nbsp; [ / ] · link CP
        </div>
      </div>
    `;
    return;
  }

  if (mode.id === 'portals') {
    setBadge('SELECTED PORTAL');
    const s = selectedData.start; // Workshop coords
    const e = selectedData.end;   // Workshop coords
    hudDataBody.innerHTML = `
      <div class="text-white/90 font-semibold">PORTAL</div>
      <div class="mt-2 text-white/75 text-sm">
        START: <b class="text-white/90">${fmtWsVec(s)}</b><br/>
        END: <b class="text-white/90">${fmtWsVec(e)}</b><br/>
        CP: <b class="text-white/90">${selectedData.cp ?? 0}</b>
      </div>
    `;
  }
}

function updateHudAll() {
  if (hudViewType) hudViewType.textContent = (viewType || 'all').toUpperCase();
  updateToolbarState();
  syncAddUi();
  updateCheckpointSelectUI();
  updateViewButtons();
  applyViewVisibility();

  updateHudCounters();
  updateHudData();
  updateHudHelp();
}

function clampCpIndex(i) {
  const n = countByType('checkpoints');
  if (!n) return 0;
  return THREE.MathUtils.clamp((i | 0), 0, n - 1);
}

function getEntCp(ent) {
  return Number.isFinite(ent?.cp) ? (ent.cp | 0) : 0;
}

function ensureSkillBans(cpIdx) {
  const k = clampCpIndex(cpIdx);
  if (!skillBansByCp.has(k)) skillBansByCp.set(k, Array(SKILL_BANS.length).fill(false));
  return skillBansByCp.get(k);
}

function updateViewButtons() {
  if (viewAllBtn) viewAllBtn.classList.toggle('bg-white/10', viewType === 'all');
  if (viewOnlyBtn) viewOnlyBtn.classList.toggle('bg-white/10', viewType === 'only');
  if (hudQViewAll) hudQViewAll.classList.toggle('bg-white/10', viewType === 'all');
  if (hudQViewOnly) hudQViewOnly.classList.toggle('bg-white/10', viewType === 'only');
}

function updateCheckpointSelectUI() {
  const n = countByType('checkpoints');

  const syncSelect = (sel, prevBtn, nextBtn) => {
    if (!sel) return;

    if (!n) {
      sel.innerHTML = `<option value="0">CP 0</option>`;
      sel.value = '0';
      sel.disabled = true;
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    sel.disabled = false;
    if (prevBtn) prevBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;

    sel.innerHTML = Array.from({ length: n }, (_, i) =>
      `<option value="${i}">CP ${i}</option>`
    ).join('');

    activeCheckpoint = clampCpIndex(activeCheckpoint);
    sel.value = String(activeCheckpoint);
  };

  syncSelect(checkpointSelect, cpPrev, cpNext);
  syncSelect(hudQCheckpointSelect, hudQCpPrev, hudQCpNext);
}

function applyViewVisibility() {
  for (const ent of entities) {
    if (!ent?.marker) continue;

    let visible = true;
    if (viewType === 'only' && ent.type !== 'checkpoints') {
      visible = getEntCp(ent) === activeCheckpoint;
    }

    ent.marker.visible = visible;

    if (ent.type === 'checkpoints' && ent.tpMarker) {
      ent.tpMarker.visible = visible;
    }
  }

  // If current selection became hidden => deselect
  if (selected && selected.userData?.entity) {
    const ent = selected.userData.entity;
    if (viewType === 'only' && ent.type !== 'checkpoints') {
      if (getEntCp(ent) !== activeCheckpoint) setSelected(null, null);
    }
  }
}

function setViewType(t) {
  viewType = (t === 'only') ? 'only' : 'all';
  updateViewButtons();
  applyViewVisibility();
  updateHudAll();
}

function setActiveCheckpoint(idx, { selectMarker = false } = {}) {
  activeCheckpoint = clampCpIndex(idx);
  updateCheckpointSelectUI();
  applyViewVisibility();

  if (selectMarker) {
    const cpEnt = entities.find(e => e.type === 'checkpoints' && e.index === activeCheckpoint);
    if (cpEnt?.marker) setSelected(cpEnt.marker, cpEnt);
  }

  updateHudAll();
}

function getPortalCycleAttachPart() {
  if (!selected || selectedData?.type !== 'portals') return null;
  const st = selected.userData?._portal;
  if (!st) return null;

  // If we're currently attached to the end FX (exit), keep cycling exits
  if (selectedGizmoTarget === st.endFx || selectedGizmoTarget?.userData?._portalEnd) return 'end';

  // If we're attached to the start ring, keep cycling starts
  if (selectedGizmoTarget === st.startMarker) return 'start';

  return null;
}

function cycleSelectionByType(type, dir, portalPart = null) {
  const list = entities
    .filter(e => e.type === type)
    .slice()
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

  if (!list.length) return;

  // current index
  let cur = -1;
  if (selectedData?.type === type && Number.isFinite(selectedData.index)) {
    cur = list.findIndex(e => e.index === selectedData.index);
  }
  if (cur < 0) cur = 0;

  const next = list[(cur + dir + list.length) % list.length];
  if (!next?.marker) return;

  if (type === 'portals') {
    const st = next.marker.userData?._portal;
    let attach = next.marker;

    // Default: prefer END (exit) if it exists
    const want = portalPart || 'end';
    if (want === 'end' && st?.endFx) attach = st.endFx;
    else if (st?.startMarker) attach = st.startMarker;

    setSelected(next.marker, next, attach);
  } else {
    setSelected(next.marker, next);
  }

  updateHudAll();
}

function shiftDataAfterCheckpointRemoval(removedIndex) {
  // shift entity.cp (only those AFTER the removed CP)
  for (const ent of entities) {
    if (!ent || ent.type === 'checkpoints') continue;
    if (!Number.isFinite(ent.cp)) continue;

    if (ent.cp > removedIndex) ent.cp -= 1;

    // keep within range
    ent.cp = clampCpIndex(ent.cp);
  }

  // shift skill bans map keys
  const nm = new Map();
  for (const [k, v] of skillBansByCp.entries()) {
    if (k === removedIndex) continue;
    nm.set(k > removedIndex ? k - 1 : k, v);
  }
  skillBansByCp = nm;

  activeCheckpoint = clampCpIndex(activeCheckpoint);
}

function removePortalDraftIfLinkedToCheckpoint(cpIdx) {
  if (!portalDraft?.portalGroup) return;
  const ent = portalDraft.portalGroup.userData?.entity;
  const draftCp = Number.isFinite(ent?.cp) ? (ent.cp | 0) : null;

  if (draftCp === (cpIdx | 0)) {
    removeAnimatedPortalsInside(portalDraft.portalGroup);
    markersGroup.remove(portalDraft.portalGroup);
    portalDraft = null;
  }
}

function removeEntitiesLinkedToCheckpoint(cpIdx) {
  cpIdx |= 0;

  // remove ALL non-checkpoint entities whose cp == cpIdx
  const targets = entities.filter(e =>
    e &&
    e.type !== 'checkpoints' &&
    Number.isFinite(e.cp) &&
    ((e.cp | 0) === cpIdx)
  );

  for (const ent of targets) {
    // if we ever had it selected, drop selection cleanly
    if (selected?.userData?.entity === ent) setSelected(null, null);

    if (ent.type === 'portals') removeAnimatedPortalsInside(ent.marker);
    markersGroup.remove(ent.marker);

    // remove from entities
    entities = entities.filter(x => x !== ent);
  }

  // keep indices compact for export
  reindexType('boundarySpheres');
  reindexType('functionOrbs');
  reindexType('portals');
}

/* ============================================================================
  Export (keep checkpoints only for now)
============================================================================ */
function fmtNum(n, d = 3) {
  const p = 10 ** d;
  return (Math.round((Number(n) || 0) * p) / p).toFixed(d).replace(/\.?0+$/, '');
}
function fmtVec3(arr) {
  return `Vector(${fmtNum(arr[0])}, ${fmtNum(arr[1])}, ${fmtNum(arr[2])})`;
}
function fmtBoolOW(b) { return b ? 'True' : 'False'; }
function fmtArrayOW(items) {
  return `Array(${(items && items.length) ? items.join(', ') : ''})`;
}

function detectEol(s) {
  return String(s).includes('\r\n') ? '\r\n' : '\n';
}

function getSelectedFrameworkLangCode() {
  return (
    localStorage.getItem('editorFrameworkLang') ||
    document.documentElement.lang ||
    'en-US'
  );
}

function chooseMapDataRuleNameForLang(langCode) {
  const names = getMapDataRuleNames();
  const lc = String(langCode || '').toLowerCase();

  const pick = (fn) => names.find((n) => fn(String(n)));

  if (lc.startsWith('zh')) {
    return pick((n) => n.includes('在这输入') && n.includes('<tx')) ||
           pick((n) => n.includes('在这输入')) ||
           names[0];
  }
  if (lc.startsWith('ja')) {
    return pick((n) => n.includes('在这入力')) || names[0];
  }
  if (lc.startsWith('ko')) {
    return pick((n) => n.includes('맵 데이터')) || names[0];
  }

  // default for en/ru/es/pt/de/...
  return pick((n) => n.trim().startsWith('Ø')) || names[0];
}

function findRuleBlockByNamesWithRange(src, names) {
  if (!src) return null;
  const want = new Set((names || []).map(String));

  const re = /rule\s*\(\s*"([^"]+)"\s*\)\s*/gi;
  let m;
  while ((m = re.exec(src))) {
    const ruleName = m[1];
    if (!want.has(ruleName)) continue;

    const braceStart = src.indexOf('{', re.lastIndex);
    if (braceStart < 0) return null;

    let depth = 0;
    for (let i = braceStart; i < src.length; i++) {
      const ch = src[i];
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          return { name: ruleName, block: src.slice(m.index, i + 1), start: m.index, end: i + 1 };
        }
      }
    }
    return null;
  }
  return null;
}

function findMatchingBrace(str, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < str.length; i++) {
    const ch = str[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function findStatementEnd(actionsBody, fromIdx) {
  let p = 0, b = 0, q = false;
  for (let i = fromIdx; i < actionsBody.length; i++) {
    const ch = actionsBody[i];
    const prev = actionsBody[i - 1];

    if (ch === '"' && prev !== '\\') q = !q;
    if (q) continue;

    if (ch === '(') p++;
    else if (ch === ')') p--;
    else if (ch === '[') b++;
    else if (ch === ']') b--;

    if (ch === ';' && p === 0 && b === 0) return i;
  }
  return -1;
}

function replaceOrInsertGlobalAssignment(actionsBody, varName, rhs, eol, fallbackIndent) {
  const re = new RegExp(`(^[\\t \\u00A0]*)Global\\.${varName}\\s*=\\s*`, 'mi');
  const m = re.exec(actionsBody);

  // Determine trailing whitespace (keep as-is)
  const tailMatch = actionsBody.match(/[\t \u00A0\r\n]*$/);
  const tail = tailMatch ? tailMatch[0] : '';
  const core = actionsBody.slice(0, actionsBody.length - tail.length);

  if (m) {
    const indent = m[1] ?? fallbackIndent ?? '';
    const stmtStart = m.index;
    const stmtEndSemi = findStatementEnd(actionsBody, stmtStart);
    if (stmtEndSemi < 0) return actionsBody; // fail-safe

    const before = actionsBody.slice(0, stmtStart);
    const after  = actionsBody.slice(stmtEndSemi + 1); // keep following whitespace/newlines exactly

    const replacement = `${indent}Global.${varName} = ${rhs};`;
    return before + replacement + after;
  }

  // Not found -> insert at end (before tail)
  const indent = fallbackIndent ?? '';
  const needsNL = core.length && !core.endsWith(eol) ? eol : '';
  return core + needsNL + `${indent}Global.${varName} = ${rhs};` + eol + tail;
}

function patchMapDataRuleBlock(ruleBlock, assignments, eol) {
  const rb = String(ruleBlock || '');
  if (!rb) return rb;

  // Find actions block
  const actMatch = rb.match(/\bactions\b\s*\{/i);
  if (actMatch) {
    const actIdx = actMatch.index;
    const braceIdx = rb.indexOf('{', actIdx);
    const closeIdx = findMatchingBrace(rb, braceIdx);
    if (braceIdx < 0 || closeIdx < 0) return rb;

    const bodyStart = braceIdx + 1;
    const bodyEnd   = closeIdx;

    const beforeBody = rb.slice(0, bodyStart);
    let body         = rb.slice(bodyStart, bodyEnd);
    const afterBody  = rb.slice(bodyEnd);

    // Fallback indent: reuse first Global indent if present, else guess from "actions" line
    const gIndent = (body.match(/^[\t \u00A0]*(?=Global\.)/m) || [null])[0];
    let fallbackIndent = gIndent;

    if (fallbackIndent == null) {
      // take indent of "actions" keyword and add one step
      const lineStart = rb.lastIndexOf(eol, braceIdx);
      const line = rb.slice(lineStart + eol.length, braceIdx);
      const baseIndent = (line.match(/^[\t \u00A0]*/) || [''])[0];
      // guess one indent step:
      fallbackIndent = baseIndent + (baseIndent.includes('\t') ? '\t' : '    ');
    }

    // Patch only managed assignments (others untouched)
    for (const [k, rhs] of Object.entries(assignments)) {
      body = replaceOrInsertGlobalAssignment(body, k, rhs, eol, fallbackIndent);
    }

    return beforeBody + body + afterBody;
  }

  // No actions block -> insert one before the last closing brace of the rule
  const lastClose = rb.lastIndexOf('}');
  if (lastClose < 0) return rb;

  // detect indent from "event" line
  const ev = rb.match(/(?:^|[\r\n])([\t \u00A0]*)event\b/i);
  const baseIndent = ev ? ev[1] : '';
  const step = baseIndent.includes('\t') ? '\t' : '    ';
  const indent1 = baseIndent;
  const indent2 = baseIndent + step;

  const actionLines = [];
  actionLines.push(`${indent1}actions {`);
  for (const [k, rhs] of Object.entries(assignments)) {
    actionLines.push(`${indent2}Global.${k} = ${rhs};`);
  }
  actionLines.push(`${indent1}}`);

  const insert = eol + actionLines.join(eol) + eol;
  return rb.slice(0, lastClose) + insert + rb.slice(lastClose);
}

function buildMapDataRuleTemplate(ruleName, assignments, eol) {
  const rn = String(ruleName || '').replace(/"/g, '\\"');
  const indent1 = '    ';
  const indent2 = '        ';

  const lines = [];
  lines.push(`rule ("${rn}") {`);
  lines.push(`${indent1}event {`);
  lines.push(`${indent2}Ongoing - Global;`);
  lines.push(`${indent1}}`);
  lines.push('');
  lines.push(`${indent1}actions {`);
  for (const [k, rhs] of Object.entries(assignments)) {
    lines.push(`${indent2}Global.${k} = ${rhs};`);
  }
  lines.push(`${indent1}}`);
  lines.push(`}`);
  return lines.join(eol);
}

function patchWorkshopScriptOnlyMapData(src, assignments) {
  const eol = detectEol(src);
  const names = getMapDataRuleNames();
  const hit = findRuleBlockByNamesRange(src, names);

  if (hit) {
    const patched = patchMapDataRuleBlock(hit.block, assignments, eol);
    return src.slice(0, hit.start) + patched + src.slice(hit.end);
  }

  // No Map Data rule in imported script -> append template rule
  const lang = getSelectedFrameworkLangCode();
  const ruleName = chooseMapDataRuleNameForLang(lang);
  const template = buildMapDataRuleTemplate(ruleName, assignments, eol);

  const endsWithEol = src.endsWith(eol);
  const spacer = endsWithEol ? (eol + eol) : (eol + eol);
  return src + spacer + template;
}

function detectNL(s) { return (s && s.includes('\r\n')) ? '\r\n' : '\n'; }

function braceMatchIndex(s, openIdx) {
  let d = 0;
  for (let i = openIdx; i < s.length; i++) {
    const ch = s[i];
    if (ch === '{') d++;
    else if (ch === '}') {
      d--;
      if (d === 0) return i;
    }
  }
  return -1;
}

function patchActionsAssignments(ruleBlock, assignmentsMap) {
  const nl = detectNL(ruleBlock);

  // find actions { ... }
  const m = ruleBlock.match(/\bactions\b\s*\{/i);
  if (!m) return { block: ruleBlock, hadActions: false };

  const actionsKwIdx = m.index ?? 0;
  const openIdx = ruleBlock.indexOf('{', actionsKwIdx);
  const closeIdx = braceMatchIndex(ruleBlock, openIdx);
  if (openIdx < 0 || closeIdx < 0) return { block: ruleBlock, hadActions: true };

  const before = ruleBlock.slice(0, openIdx + 1);
  let body = ruleBlock.slice(openIdx + 1, closeIdx);
  const after = ruleBlock.slice(closeIdx);

  // indent: reuse first Global.* indent if exists
  const gIndentMatch = body.match(/^[ \t]*Global\./m);
  const indent = gIndentMatch ? gIndentMatch[0].slice(0, gIndentMatch[0].indexOf('Global')) : '\t\t';

  // replace or append each assignment
  for (const [varName, rhs] of Object.entries(assignmentsMap)) {
    const re = new RegExp(`^[ \\t]*Global\\.${escapeRegExp(varName)}\\s*=\\s*[^;]*;`, 'mi');

    const line = `${indent}Global.${varName} = ${rhs};`;
    if (re.test(body)) body = body.replace(re, line);
    else {
      // ensure ends with newline before appending
      if (!body.endsWith(nl)) body += nl;
      body += line + nl;
    }
  }

  return { block: before + body + after, hadActions: true };
}

function injectActionsBlockIfMissing(ruleBlock, assignmentsMap) {
  const nl = detectNL(ruleBlock);

  // detect indent from "event" line (template uses spaces)
  const ev = ruleBlock.match(/^[ \t]*event\b/m);
  const indent1 = ev ? ev[0].slice(0, ev[0].indexOf('event')) : '    ';
  const step = indent1.includes('\t') ? '\t' : '    ';
  const indent2 = indent1 + step;

  const lines = [];
  for (const [varName, rhs] of Object.entries(assignmentsMap)) {
    lines.push(`${indent2}Global.${varName} = ${rhs};`);
  }

  const actionsBlock =
    `${indent1}actions {${nl}` +
    lines.join(nl) +
    `${lines.length ? nl : ''}` +
    `${indent1}}${nl}`;

  // insert before the LAST "}" of the rule block
  const lastClose = ruleBlock.lastIndexOf('}');
  if (lastClose < 0) return ruleBlock;

  // keep spacing nice
  const needsNL = !ruleBlock.slice(0, lastClose).endsWith(nl);
  return ruleBlock.slice(0, lastClose) + (needsNL ? nl : '') + actionsBlock + ruleBlock.slice(lastClose);
}

// --- Build RHS strings (Overwatch Workshop formatting) ---
function buildMapDataAssignmentsFromState() {
  const cps = entities.filter(e => e.type === 'checkpoints').sort((a,b) => a.index - b.index);
  const bs  = entities.filter(e => e.type === 'boundarySpheres').sort((a,b) => a.index - b.index);
  const orbs = entities.filter(e => e.type === 'functionOrbs').sort((a,b) => a.index - b.index);
  const ports = entities.filter(e => e.type === 'portals').sort((a,b) => a.index - b.index);

  const cpVecs = cps.map(e => {
    const a = fmtVec3(e.pos);
    if (e.tp && Array.isArray(e.tp)) return `Array(${a}, ${fmtVec3(e.tp)})`;
    return a;
  });

  const bsPos = bs.map(e => fmtVec3(e.pos));
  const bsRad = bs.map(e => fmtNum(e.radius, 3)); // signed
  const bsCp  = bs.map(e => String(clampCpIndex(getEntCp(e))));

  const orbPos = orbs.map(e => fmtVec3(e.pos));
  const orbStrength = orbs.map(e => fmtNum((e.lock ? 0 : (e.strength ?? 10)), 1));
  const orbUlt  = orbs.map(e => fmtBoolOW(!!e.ult));
  const orbDash = orbs.map(e => fmtBoolOW(!!e.dash));
  const orbLock = orbs.map(e => fmtBoolOW(!!e.lock));
  const orbCp   = orbs.map(e => String(clampCpIndex(getEntCp(e))));

  const pStart = ports.map(e => fmtVec3(e.start));
  const pEnd   = ports.map(e => fmtVec3(e.end));
  const pCp    = ports.map(e => String(clampCpIndex(e.cp ?? 0)));

  // bans: export as INDEX LISTS (like your framework example)
  const cpCount = cps.length;
  const banIdx = Array.from({ length: SKILL_BANS.length }, () => []);
  for (let i = 0; i < cpCount; i++) {
    const arr = ensureSkillBans(i);
    for (let k = 0; k < SKILL_BANS.length; k++) {
      if (arr?.[k]) banIdx[k].push(i);
    }
  }

  return {
    // core
    A: fmtArrayOW(cpVecs),
    H: fmtArrayOW(bsPos),
    I: fmtArrayOW(bsRad),
    killballnumber: fmtArrayOW(bsCp),

    TQ: fmtArrayOW(orbPos),
    EditMode: fmtArrayOW(orbStrength),
    TQ5: fmtArrayOW(orbUlt),
    TQ6: fmtArrayOW(orbDash),
    BounceToggleLock: fmtArrayOW(orbLock),
    pinballnumber: fmtArrayOW(orbCp),

    CustomPortalStart: fmtArrayOW(pStart),
    CustomPortalEndpoint: fmtArrayOW(pEnd),
    CustomPortalCP: fmtArrayOW(pCp),

    // bans
    BanMulti: fmtArrayOW(banIdx[0]),
    BanCreate: fmtArrayOW(banIdx[1]),
    BanClimb: fmtArrayOW(banIdx[2]),
    BanSaveDouble: fmtArrayOW(banIdx[3]),
    BanDead: fmtArrayOW(banIdx[4]),
    BanEmote: fmtArrayOW(banIdx[5]),
    BanBhop: fmtArrayOW(banIdx[6]),
    BanStand: fmtArrayOW(banIdx[7]),
  };
}

function patchOrAppendMapData(fullText, assignments, names, langForRuleName = null) {
  const full = String(fullText || '');
  const eol = detectEol(full);

  const ruleNames = (names && names.length) ? names : getMapDataRuleNames();

  // Prefer cached range from last import if still valid for THIS text
  let hit = null;
  const cached = LAST_IMPORTED_MAPDATA_INFO;

  if (
    cached &&
    Number.isFinite(cached.start) &&
    Number.isFinite(cached.end) &&
    cached.start >= 0 &&
    cached.end > cached.start &&
    cached.end <= full.length
  ) {
    const slice = full.slice(cached.start, cached.end);
    if (/^\s*rule\s*\(/i.test(slice)) {
      hit = { start: cached.start, end: cached.end, block: slice, name: cached.name };
    }
  }

  if (!hit) {
    hit = findRuleBlockByNamesWithRange(full, ruleNames);
  }

  // Found -> patch actions assignments
  if (hit && Number.isFinite(hit.start) && Number.isFinite(hit.end)) {
    const patched = patchMapDataRuleBlock(hit.block, assignments, eol);
    return full.slice(0, hit.start) + patched + full.slice(hit.end);
  }

  // Not found -> append fresh Map Data rule
  const lang = langForRuleName || getSelectedFrameworkLangCode();
  const ruleName = chooseMapDataRuleNameForLang(lang);
  const template = buildMapDataRuleTemplate(ruleName, assignments, eol);

  const spacer = full.endsWith(eol) ? (eol + eol) : (eol + eol);
  return full + spacer + template;
}

// --- Template loading ---
const TEMPLATE_MODULE_BASE = '/framework-templates/';

const TEMPLATE_CACHE = new Map();
async function loadFrameworkTemplate(langCode) {
  const code = String(langCode || 'en-US').trim();
  const tries = [code, 'en-US'];

  for (const c of tries) {
    if (TEMPLATE_CACHE.has(c)) return TEMPLATE_CACHE.get(c);

    try {
      const mod = await import(`${TEMPLATE_MODULE_BASE}framework-template_${c}.js`);
      const txt = String(mod?.frameworkTemplate || '');
      if (txt) {
        TEMPLATE_CACHE.set(c, txt);
        return txt;
      }
    } catch {}
  }

  throw new Error(`No framework template found for ${code}`);
}

function looksLikeFullWorkshopScript(t) {
  const s = String(t || '').toLowerCase();
  return s.includes('settings') && s.includes('modes');
}

async function buildFullExportText() {
  const assignments = buildMapDataAssignmentsFromState();
  const names = getMapDataRuleNames();

  const lang = getSelectedFrameworkLangCode();

  const importedIsFull = looksLikeFullWorkshopScript(LAST_IMPORTED_FULL_TEXT);
  const base = importedIsFull
    ? String(LAST_IMPORTED_FULL_TEXT)
    : await loadFrameworkTemplate(lang);

  let out = patchOrAppendMapData(base, assignments, names, lang);

  const m = await resolveCurrentMapWorkshopLine(lang);
  if (m) out = patchTeamDeathmatchEnabledMap(out, m.name, m.variantId);

  return out;
}

async function exportWorkshopMapData() {
  try {
    const outTxt = await buildFullExportText();
    openExportModal(outTxt);
  } catch (e) {
    console.error(e);
    flashHud('EXPORT FAILED', 'Could not build export text.', 1100);
  }
}

/* ============================================================================
  Hide giant helper planes / bounds
============================================================================ */
function triCount(geom) {
  if (!geom) return 0;
  if (geom.index) return geom.index.count / 3;
  return (geom.attributes?.position?.count || 0) / 3;
}

function roundTo(n, decimals = 1) {
  const p = 10 ** decimals;
  return Math.round(n * p) / p;
}

function median(values) {
  const a = values.filter((v) => Number.isFinite(v)).sort((x, y) => x - y);
  if (!a.length) return 1;
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}

const WATER_MATERIAL_WHITELIST = new Set([
  'Château Guillard:0_81B09AB0F566B1D2.052',
]);

function meshUsesWhitelistedWaterMaterial(mesh) {
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return mats.some(m => m?.name && WATER_MATERIAL_WHITELIST.has(m.name));
}

function isLikelyWaterMesh(mesh) {
  if (meshUsesWhitelistedWaterMaterial(mesh)) return true;

  const n = (mesh.name || '').toLowerCase();
  if (n.includes('water') || n.includes('ocean') || n.includes('sea') || n.includes('river') || n.includes('lake')) {
    return true;
  }

  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return mats.some((m) => {
    if (!m) return false;
    if (m.transparent) return true;
    if (Number.isFinite(m.opacity) && m.opacity < 0.999) return true;
    if ('transmission' in m && m.transmission > 0) return true;
    if (Number.isFinite(m.alphaTest) && m.alphaTest > 0) return true;
    return false;
  });
}

function forceWaterRenderSettings(root) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    if (!isLikelyWaterMesh(o) && !meshUsesWhitelistedWaterMaterial(o)) return;

    o.visible = true;
    o.renderOrder = 999;

    const mats = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of mats) {
      if (!m) continue;

      // backface issues
      m.side = THREE.DoubleSide;

      // some exports end up with opacity ~0
      if (Number.isFinite(m.opacity) && m.opacity <= 0.01) m.opacity = 0.85;

      // transmission materials often need opacity=1 + background
      if ('transmission' in m && m.transmission > 0) {
        m.transparent = true;
        m.opacity = 1.0;

        // nice defaults if missing
        if ('ior' in m && (!Number.isFinite(m.ior) || m.ior < 1.0)) m.ior = 1.33;
        if ('thickness' in m && (!Number.isFinite(m.thickness) || m.thickness <= 0.0)) m.thickness = 0.2;
      } else {
        // classic alpha blend water
        m.transparent = true;
      }

      // common transparency sorting helpers
      m.depthWrite = false;
      m.depthTest = true;

      m.needsUpdate = true;
    }
  });
}

function debugWater(root) {
  const hits = [];
  root.traverse(o => {
    if (!o.isMesh) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];

    const byName =
      (o.name || '').toLowerCase().includes('water') ||
      mats.some(m => (m?.name || '').toLowerCase().includes('water'));

    const byProp = mats.some(m =>
      m && (m.transparent || (Number.isFinite(m.opacity) && m.opacity < 0.999) || ((m.transmission ?? 0) > 0))
    );

    if (byName || byProp) {
      hits.push({
        mesh: o.name,
        mat: mats.map(m => `${m?.type || '?'}("${m?.name || ''}") op=${m?.opacity} tr=${m?.transparent} transm=${m?.transmission ?? 0}`).join(' | ')
      });
    }
  });

  console.table(hits.slice(0, 50));
}

function sanitizeImportedScene(root) {
  root.updateWorldMatrix(true, true);

  const meshes = [];
  root.traverse((o) => { if (o.isMesh) meshes.push(o); });

  const diags = [];
  for (const m of meshes) {
    const g = m.geometry;
    if (!g) continue;
    if (!g.boundingBox) g.computeBoundingBox();
    diags.push(g.boundingBox.getSize(new THREE.Vector3()).length());
  }
  const medDiag = median(diags);

  const hidden = [];
  for (const m of meshes) {
    // do not touch water
    if (isLikelyWaterMesh(m) || meshUsesWhitelistedWaterMaterial(m)) continue;

    const name = (m.name || '').toLowerCase();

    if (name.includes('collider') || name.includes('collision') || name.includes('navmesh')) {
      m.visible = false;
      hidden.push(m.name || '(collider)');
      continue;
    }

    const g = m.geometry;
    if (!g) continue;
    if (!g.boundingBox) g.computeBoundingBox();

    const size = g.boundingBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const minDim = Math.min(size.x, size.y, size.z);
    const diag = size.length();
    const tris = triCount(g);

    const thin = minDim < maxDim * 0.0015;
    const hugeOutlier = diag > medDiag * 10;
    const lowPoly = tris < 6000;

    if (thin && hugeOutlier && lowPoly) {
      m.visible = false;
      hidden.push(m.name || '(helper plane)');
    }
  }

  return { hidden, medDiag };
}

function computeVisibleBounds(root) {
  root.updateWorldMatrix(true, true);
  const box = new THREE.Box3();
  let init = false;

  root.traverse((o) => {
    if (!o.isMesh || !o.visible) return;
    const g = o.geometry;
    if (!g) return;
    if (!g.boundingBox) g.computeBoundingBox();

    const b = g.boundingBox.clone().applyMatrix4(o.matrixWorld);
    if (!init) { box.copy(b); init = true; }
    else box.union(b);
  });

  if (!init) box.setFromObject(root);
  return box;
}

function setEnvMapIntensity(root, k = 0.5) {
  root.traverse((o) => {
    const m = o.material;
    const mats = Array.isArray(m) ? m : (m ? [m] : []);
    for (const mat of mats) {
      if (mat && 'envMapIntensity' in mat) mat.envMapIntensity = k;
    }
  });
}

function setupGlbPunctualLights(root, bounds) {
  const lights = [];
  root.traverse((o) => { if (o.isLight) lights.push(o); });

  console.log('[GLB] punctual lights found:', lights.map(l => ({
    name: l.name,
    type: l.type,
    intensity: l.intensity,
    distance: l.distance,
  })));

  if (!lights.length) return false;

  const size = bounds.getSize(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.y, size.z) || 100;

  // If glTF lights have no range (distance=0 => infinite), they can blow out everything.
  const DEFAULT_RANGE = Math.max(10, maxSize * 0.25);

  // Auto-scale intensities: bring the 95th percentile down to a target.
  const intens = lights
    .map(l => (Number.isFinite(l.intensity) ? l.intensity : 0))
    .filter(v => v > 0)
    .sort((a, b) => a - b);

  const p95 = intens[Math.floor(intens.length * 0.95)] || intens[intens.length - 1] || 1;
  const TARGET_P95 = 30; // tweak 10..80 depending on your scene
  const mult = Math.min(1, TARGET_P95 / p95);

  for (const l of lights) {
    if (Number.isFinite(l.intensity)) l.intensity *= mult;

    // Ensure physically sensible falloff for point/spot
    if (l.isPointLight || l.isSpotLight) {
      l.decay = 2;
      if (!Number.isFinite(l.distance) || l.distance <= 0) l.distance = DEFAULT_RANGE;
    }

    // Shadows only for dir/spot (point shadows are expensive)
    const shadowable = l.isDirectionalLight || l.isSpotLight;
    l.castShadow = shadowable;
  }

  return true;
}

/* ============================================================================
  Fit camera + movement scale + marker size
============================================================================ */
let moveBaseSpeed = 220;
let cpOuterRadius = 1.0;
let cpInnerRadius = 1.0;

function syncYawPitchFromCamera() {
  const e = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
  pitch = e.x;
  yaw = e.y;
}

function applyScaleFromBounds(bounds) {
  const size = bounds.getSize(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.y, size.z) || 500;

  moveBaseSpeed = Math.max(80, maxSize / 6);

  const outer = THREE.MathUtils.clamp((maxSize / 2500) * 0.76, 0.55, 0.95);
  cpOuterRadius = outer;

  const border = Math.max(outer * 0.003, 0.0035);
  cpInnerRadius = Math.max(0.001, outer - border);
}

function fitCameraToBounds(bounds) {
  applyScaleFromBounds(bounds);
}

/* ============================================================================
  Beacon + label helpers
============================================================================ */
let beaconHeight = 80;
let beaconRadius = 0.25;
let labelYOffset = 6;
let labelScale = 16;

const labelCache = new Map();

function roundedRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function makeLabelSprite(text) {
  const key = String(text);
  const cached = labelCache.get(key);
  if (cached) return cached.clone();

  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const pad = 14;
  const fontSize = 44;

  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');

  ctx.font = `900 ${fontSize}px Inter, system-ui, -apple-system, Segoe UI, Arial`;
  const metrics = ctx.measureText(key);
  const w = Math.ceil(metrics.width + pad * 2);
  const h = Math.ceil(fontSize + pad * 2);

  c.width = Math.ceil(w * dpr);
  c.height = Math.ceil(h * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  roundedRect(ctx, 0.5, 0.5, w - 1, h - 1, 14);
  ctx.fillStyle = 'rgba(0,0,0,0.60)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(key, w / 2, h / 2 + 1);

  const tex = new THREE.CanvasTexture(c);
  if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace;

  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });

  const sprite = new THREE.Sprite(mat);
  const aspect = w / h;
  sprite.scale.set(labelScale * aspect, labelScale, 1);
  sprite.renderOrder = 10;

  labelCache.set(key, sprite);
  return sprite.clone();
}

/* ============================================================================
  Fly Controls (RMB pointer lock)
============================================================================ */
const clock = new THREE.Clock();

const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  up: false,
  down: false,
  boost: false,
  lshift: false,
};

const speedMults = [0.05, 0.1, 0.5, 1];
let speedIdx = 1;

function updateHudSpeed() {
  if (hudSpeed) hudSpeed.textContent = `Speed: x${speedMults[speedIdx]}`;
}
updateHudSpeed();

let yaw = 0;
let pitch = 0;

const velocity = new THREE.Vector3();
const wish = new THREE.Vector3();
const WORLD_UP = new THREE.Vector3(0, 1, 0);

const LOOK_SENS = 0.0020;
const CLAMP_MOUSE = 220;

let mouseLook = false;
let pointerLocked = false;

let mouseDX = 0;
let mouseDY = 0;

function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return tag === 'input' || tag === 'textarea' || el.isContentEditable;
}

function applyYawPitch() {
  const lim = Math.PI / 2 - 0.002;
  pitch = Math.max(-lim, Math.min(lim, pitch));
  const e = new THREE.Euler(pitch, yaw, 0, 'YXZ');
  camera.quaternion.setFromEuler(e);
}

function requestPointerLockUnadjusted(el) {
  try { el.requestPointerLock?.({ unadjustedMovement: true }); }
  catch { el.requestPointerLock?.(); }
}

function startMouseLook() {
  if (isGizmoDragging) return;
  mouseLook = true;
  gizmo.enabled = false;

  if (document.pointerLockElement !== renderer.domElement) {
    requestPointerLockUnadjusted(renderer.domElement);
  }
}

function stopMouseLook() {
  mouseLook = false;
  mouseDX = 0;
  mouseDY = 0;
  setGizmoActive(!!selectedGizmoTarget);

  if (document.pointerLockElement === renderer.domElement) {
    document.exitPointerLock?.();
  }
}

document.addEventListener('pointerlockchange', () => {
  pointerLocked = document.pointerLockElement === renderer.domElement;

  // If we lost pointer-lock, always restore normal state
  if (!pointerLocked) {
    mouseLook = false;
    mouseDX = 0;
    mouseDY = 0;
    setGizmoActive(!!selectedGizmoTarget);
  }
});

renderer.domElement.addEventListener('pointerdown', (e) => {
  if (e.button !== 2) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  canvas.focus();
  startMouseLook();
}, { capture: true });

window.addEventListener('pointerup', (e) => {
  if (e.button === 2) stopMouseLook();
});

window.addEventListener('blur', () => {
  stopMouseLook();
  Object.keys(keys).forEach((k) => (keys[k] = false));
});

function consumeKey(e) {
  const codes = new Set([
    'Space',
    'ControlLeft', 'ControlRight',
    'ShiftLeft', 'ShiftRight',
    'KeyW', 'KeyA', 'KeyS', 'KeyD',
    'KeyE', 'KeyV',
    'KeyC', 'BracketLeft', 'BracketRight',
    'Digit1', 'Digit2', 'Digit3', 'Digit4',
    'Digit5', 'Digit6', 'Digit7', 'Digit8',
    'F6', 'F7', 'F8', 'F9',
    'F1','F2','F3','F4', 'F5',
    'KeyH','KeyG','KeyQ',
    'ArrowLeft', 'ArrowRight',
  ]);
  if (codes.has(e.code)) {
    e.preventDefault();
    e.stopPropagation();
    return true;
  }
  return false;
}

window.addEventListener('keydown', (e) => {
  if (isTypingTarget(e.target)) return;
  consumeKey(e);

  if (e.code === 'KeyE') { setMode(modeIndex + 1); return; }
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    const dir = (e.code === 'ArrowRight') ? +1 : -1;
    const mid = getMode().id;

    // Checkpoints
    if (mid === 'checkpoints') {
      setActiveCheckpoint(activeCheckpoint + dir, { selectMarker: true });
      return;
    }

    // NEW: cycle items for these modes too
    if (mid === 'boundarySpheres' || mid === 'functionOrbs' || mid === 'portals') {
      const portalPart = (mid === 'portals') ? getPortalCycleAttachPart() : null;
      cycleSelectionByType(mid, dir, portalPart);
      return;
    }

    // fallback: keep old behavior
    setActiveCheckpoint(activeCheckpoint + dir, { selectMarker: false });
    return;
  }
  if (e.code === 'KeyV') { speedIdx = (speedIdx + 1) % speedMults.length; updateHudSpeed(); return; }
  if (e.code === 'KeyF') { toggleFullscreen(); return; }
  // [ / ] : if an entity with cp is selected -> change its linked CP
  // else -> change active checkpoint
  if (e.code === 'BracketLeft' || e.code === 'BracketRight') {
    const dir = (e.code === 'BracketRight') ? +1 : -1;

    if (selectedData && selectedData.type === getMode().id && selectedData.type !== 'checkpoints' && 'cp' in selectedData) {
      selectedData.cp = clampCpIndex(getEntCp(selectedData) + dir);
      applyViewVisibility();
      updateHudAll();
      return;
    }

    setActiveCheckpoint(activeCheckpoint + dir, { selectMarker: getMode().id === 'checkpoints' });
    return;
  }

  // Function orbs toggles (when orb selected)
  if (getMode().id === 'boundarySpheres' && selectedData?.type === 'boundarySpheres') {
    if (e.code === 'Digit1') {
      selectedData.radius = -Number(selectedData.radius ?? 5);
      rebuildBoundarySphere(selected, Math.abs(selectedData.radius));
      updateHudAll();
      return;
    }
  }

  if (getMode().id === 'functionOrbs' && selectedData?.type === 'functionOrbs') {
    if (e.code === 'Digit1') { selectedData.ult = !selectedData.ult; updateHudAll(); return; }
    if (e.code === 'Digit2') { selectedData.dash = !selectedData.dash; updateHudAll(); return; }
    if (e.code === 'Digit3') {
      selectedData.lock = !selectedData.lock;
      selectedData.strength = selectedData.lock ? 0 : (Number.isFinite(selectedData.strength) && selectedData.strength > 0 ? selectedData.strength : 10);

      setFunctionOrbUnlockVisual(selected, selectedData.lock);

      updateHudAll();
      return;
    }
  }

  // Skill bans toggles for ACTIVE checkpoint
  if (getMode().id === 'skillBans') {
    const n = parseInt((e.code || '').replace('Digit', ''), 10);
    if (Number.isFinite(n) && n >= 1 && n <= 8) {
      const arr = ensureSkillBans(activeCheckpoint);
      arr[n - 1] = !arr[n - 1];
      updateHudAll();
      return;
    }
  }

  if (e.code === ADD_TOGGLE_CODE && !e.repeat) { toggleAddMode(); return; }
  if (e.code === 'KeyG' && !e.repeat) { snapSelectedCheckpoint(); return; }

  if (getMode().id === 'checkpoints' && selectedData?.type === 'checkpoints' && e.code === 'KeyT' && !e.repeat) {
    if (e.shiftKey) {
      clearCheckpointTeleport(selectedData);
      flashHud('TELEPORT', `Cleared TP for CP ${selectedData.index}`, 650);
    } else {
      TELEPORT_ARMED = true;
      flashHud('TELEPORT', 'Click destination on the map…', 900);
    }
    return;
  }

  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    keys.lshift = true;
    keys.boost = true;
  }

  // C / Shift+C : resize boundary sphere (and orb strength) on selected element
  if (e.code === 'KeyC' && selectedData && selectedData.type === getMode().id) {
    const dir = e.shiftKey ? -1 : +1;

    if (selectedData.type === 'boundarySpheres') {
      const step = 0.1;
      const cur = Number(selectedData.radius ?? 5);
      const sign = (cur < 0) ? -1 : 1;

      const nextAbs = THREE.MathUtils.clamp(
        roundTo(Math.abs(cur) + dir * step, 1),
        0.5,
        2000
      );

      selectedData.radius = sign * nextAbs;
      rebuildBoundarySphere(selected, nextAbs);
      updateHudAll();
      return;
    }

    if (selectedData.type === 'functionOrbs') {
      if (selectedData.lock) {
        selectedData.strength = 0;
        updateHudAll();
        return;
      }
      const step = 0.1;
      const next = roundTo((selectedData.strength ?? 10) + dir * step, 1);
      selectedData.strength = THREE.MathUtils.clamp(next, 0, 999);
      updateHudAll();
      return;
    }
  }

  switch (e.code) {
    case 'KeyW': keys.forward = true; break;
    case 'KeyS': keys.backward = true; break;
    case 'KeyA': keys.left = true; break;
    case 'KeyD': keys.right = true; break;
    case 'Space': keys.up = true; break;
    case 'ControlLeft':
    case 'ControlRight': keys.down = true; break;
    default: break;
  }

  // Delete selected
  if ((e.key === 'Delete' || e.key === 'Backspace') && selected) {
    const ent = selected.userData?.entity;

    // If deleting TP marker: just clear teleport, do NOT delete the checkpoint entity
    if (ent?.type === 'checkpoints' && selected?.userData?._isTeleportMarker) {
      clearCheckpointTeleport(ent);
      flashHud('TELEPORT', `TP removed for CP ${ent.index}`, 650);
      return;
    }

    // remove selected marker from scene
    markersGroup.remove(selected);

    gizmo.detach();
    selected = null;
    selectedData = null;

    if (ent) {
      const removedType = ent.type;
      const removedIndex = ent.index;

      // If deleting a checkpoint => ALSO delete everything linked to this CP
      if (removedType === 'checkpoints') {
        removePortalDraftIfLinkedToCheckpoint(removedIndex);
        removeEntitiesLinkedToCheckpoint(removedIndex);
      }

      // portals: cleanup animated set
      if (removedType === 'portals') removeAnimatedPortalsInside(ent.marker);

      // remove the entity itself
      entities = entities.filter((x) => x !== ent);

      if (removedType === 'checkpoints') {
        reindexType('checkpoints');
        shiftDataAfterCheckpointRemoval(removedIndex);

        // after cp shift, keep other types consistent too
        reindexType('boundarySpheres');
        reindexType('functionOrbs');
        reindexType('portals');

        setActiveCheckpoint(activeCheckpoint);
      } else {
        reindexType(removedType);
      }

      applyViewVisibility();
    }

    updateHudAll();
  }
});

window.addEventListener('keyup', (e) => {
  if (isTypingTarget(e.target)) return;
  consumeKey(e);
  if (e.code === 'F6') { setPerfVisible(!PERF_VISIBLE); HUD_STATE.perf = !!PERF_VISIBLE; saveHudState(); syncDockUi(); return; }

  if (e.code === 'F3') { toggleMoveMode(); return; }

  if (e.code === 'F1') { toggleHudBlock(hudRightPanel, 'right'); return; }
  if (e.code === 'F2') { toggleHudBlock(hudLeftPanel, 'left'); return; }
  if (e.code === 'F5') { toggleQuickbar(); return; }
  if (e.code === 'F4') { toggleHudBlock(hudTopPanel, 'top'); return; }
  if (e.code === 'KeyH') { toggleHudBlock(hudHotkeys, 'hotkeys'); return; }
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    keys.lshift = false;
    keys.boost = false;
  }

  switch (e.code) {
    case 'KeyW': keys.forward = false; break;
    case 'KeyS': keys.backward = false; break;
    case 'KeyA': keys.left = false; break;
    case 'KeyD': keys.right = false; break;
    case 'Space': keys.up = false; break;
    case 'ControlLeft':
    case 'ControlRight': keys.down = false; break;
    default: break;
  }
});

window.addEventListener('mousemove', (e) => {
  if (!pointerLocked || !mouseLook || isGizmoDragging) return;
  const mx = Math.max(-CLAMP_MOUSE, Math.min(CLAMP_MOUSE, e.movementX || 0));
  const my = Math.max(-CLAMP_MOUSE, Math.min(CLAMP_MOUSE, e.movementY || 0));
  mouseDX += mx;
  mouseDY += my;
});

function applyMouseLookFrame() {
  if (!pointerLocked || !mouseLook || isGizmoDragging) return;
  const mx = Math.max(-CLAMP_MOUSE, Math.min(CLAMP_MOUSE, mouseDX));
  const my = Math.max(-CLAMP_MOUSE, Math.min(CLAMP_MOUSE, mouseDY));
  mouseDX = 0;
  mouseDY = 0;

  yaw -= mx * LOOK_SENS;
  pitch -= my * LOOK_SENS;
  applyYawPitch();
}

// Reuse temp vectors to avoid per-frame allocations (GC spikes)
const _fwd = new THREE.Vector3();
const _right = new THREE.Vector3();

function updateFlyMovement(dt) {
  if (isGizmoDragging) return;

  // Reset wish direction
  wish.set(0, 0, 0);


  if (MOVE_MODE === 'look') {
    // Forward follows camera look direction (includes pitch)
    camera.getWorldDirection(_fwd);
    const fLen = _fwd.length();
    if (fLen > 1e-6) _fwd.multiplyScalar(1 / fLen);
    else _fwd.set(0, 0, -1);

    // Strafe relative to camera (right axis)
    _right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    const rLen = _right.length();
    if (rLen > 1e-6) _right.multiplyScalar(1 / rLen);
    else _right.set(1, 0, 0);
  } else {
    // Default: forward/strafe on XZ plane (no vertical drift)
    camera.getWorldDirection(_fwd);
    _fwd.y = 0;
    const fLen = _fwd.length();
    if (fLen > 1e-6) _fwd.multiplyScalar(1 / fLen);
    else _fwd.set(0, 0, -1);

    _right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    _right.y = 0;
    const rLen = _right.length();
    if (rLen > 1e-6) _right.multiplyScalar(1 / rLen);
    else _right.set(1, 0, 0);
  }

  // Accumulate input (wish vector)
  if (keys.forward)  wish.add(_fwd);
  if (keys.backward) wish.addScaledVector(_fwd, -1);
  if (keys.right)    wish.add(_right);
  if (keys.left)     wish.addScaledVector(_right, -1);
  if (keys.up)       wish.add(WORLD_UP);
  if (keys.down)     wish.addScaledVector(WORLD_UP, -1);

  // Normalize wish direction
  const wishLen = wish.length();
  if (wishLen > 1e-6) wish.multiplyScalar(1 / wishLen);

  // Speed
  let speed = moveBaseSpeed * speedMults[speedIdx];
  if (keys.boost) speed *= 2.0;

  // Smooth acceleration toward target velocity
  const accel = 14;
  const drag = 10;

  const targetVel = wish.multiplyScalar(speed); // reuses 'wish' as target vel
  const lerpK = 1 - Math.exp(-accel * dt);
  velocity.lerp(targetVel, lerpK);

  // Exponential drag (stable across framerates)
  const dragK = Math.exp(-drag * dt);
  velocity.multiplyScalar(dragK);

  // Move camera
  camera.position.addScaledVector(velocity, dt);
}

/* ============================================================================
  Marker materials + builders
============================================================================ */
const CP_MAT_CORE = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.92,
  depthWrite: false,
  side: THREE.DoubleSide,
  blending: THREE.NormalBlending,
  polygonOffset: true,
  polygonOffsetFactor: -2,
  polygonOffsetUnits: -2,
});
const CP_MAT_GLOW = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.22,
  depthWrite: false,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  polygonOffset: true,
  polygonOffsetFactor: -3,
  polygonOffsetUnits: -3,
});

const BS_MAT_FILL = new THREE.MeshBasicMaterial({
  color: 0x4c6fff,
  transparent: true,
  opacity: 0.18,
  depthWrite: false,
});
const BS_MAT_WIRE = new THREE.LineBasicMaterial({
  color: 0x7aa0ff,
  transparent: true,
  opacity: 0.55,
});

const ORB_MAT_CORE = new THREE.MeshStandardMaterial({
  color: 0x37ff7a,
  emissive: 0x1eff62,
  emissiveIntensity: 1.3,
  roughness: 0.2,
  metalness: 0.0,
  transparent: true,
  opacity: 0.92,
});
const ORB_MAT_GLOW = new THREE.MeshBasicMaterial({
  color: 0x37ff7a,
  transparent: true,
  opacity: 0.25,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const PORTAL_RING_CORE = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.95,
  depthWrite: false,
  side: THREE.DoubleSide,
  polygonOffset: true,
  polygonOffsetFactor: -2,
  polygonOffsetUnits: -2,
});
const PORTAL_RING_GLOW = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.22,
  depthWrite: false,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  polygonOffset: true,
  polygonOffsetFactor: -3,
  polygonOffsetUnits: -3,
});

const PORTAL_PINK = 0xff4fd6;

function makeHitSphere(radius, owner) {
  const g = new THREE.SphereGeometry(radius, 12, 12);
  const m = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0, depthWrite: false });
  m.colorWrite = false;
  const hit = new THREE.Mesh(g, m);
  hit.userData = { isHit: true, owner };
  return hit;
}
function makeHitDisk(radius, owner, alignToUp = true) {
  const g = new THREE.CircleGeometry(radius, 24);
  if (alignToUp) g.rotateX(-Math.PI / 2);
  const m = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0, depthWrite: false });
  m.colorWrite = false;
  const hit = new THREE.Mesh(g, m);
  hit.userData = { isHit: true, owner };
  return hit;
}

// Checkpoints must be near-perfect floor -> strong threshold
const CP_FLOOR_DOT = 0.995;

let hudFlashTimer = null;
function flashHud(title, sub = '', ms = 900) {
  if (!hudDataBody) return;
  hudDataBody.innerHTML = `
    <div class="text-white/90 font-semibold">${title}</div>
    ${sub ? `<div class="mt-2 text-white/60 text-sm">${sub}</div>` : ''}
  `;
  clearTimeout(hudFlashTimer);
  hudFlashTimer = setTimeout(() => updateHudAll(), ms);
}

function setCheckpointTeleport(ent, editorPoint) {
  if (!ent || ent.type !== 'checkpoints') return false;

  const ws = editorToWs(editorPoint);
  ent.tp = [ws.x, ws.y, ws.z];

  if (!ent.tpMarker) {
    const tpMarker = makeTeleportMarker(ent.index, editorPoint);
    tpMarker.userData.entity = ent;
    ent.tpMarker = tpMarker;
    markersGroup.add(tpMarker);
  } else {
    const liftY = ent.tpMarker.userData?._liftY || 0;
    ent.tpMarker.position.copy(editorPoint).add(new THREE.Vector3(0, liftY, 0));
    ent.tpMarker.quaternion.identity();
  }

  setSelected(ent.tpMarker, ent);

  updateHudAll();
  return true;
}

function clearCheckpointTeleport(ent) {
  if (!ent || ent.type !== 'checkpoints') return false;

  ent.tp = null;

  if (ent.tpMarker) {
    if (selected === ent.tpMarker) setSelected(null, null);
    markersGroup.remove(ent.tpMarker);
    ent.tpMarker = null;
  }

  updateHudAll();
  return true;
}

const snapRaycaster = new THREE.Raycaster();
const _snapUp = new THREE.Vector3(0, 1, 0);
const _snapDir = new THREE.Vector3(0, -1, 0);
const _snapOrigin = new THREE.Vector3();
const _snapLift = new THREE.Vector3();

function snapSelectedCheckpoint() {
  if (!selected || !selectedData || selectedData.type !== 'checkpoints') {
    flashHud('SNAP', 'Select a checkpoint first.');
    return false;
  }
  return snapCheckpointToGround(selected, selectedData);
}

function snapCheckpointToGround(marker, ent) {
  if (!collider || !marker || !ent || ent.type !== 'checkpoints') return false;

  const base = getMarkerBaseEditorPos(marker, ent);

  // cast from above -> down
  _snapOrigin.copy(base);
  _snapOrigin.y += 20000;

  snapRaycaster.set(_snapOrigin, _snapDir);
  snapRaycaster.far = 40000;

  const hits = snapRaycaster.intersectObject(collider, true);
  const h = hits?.[0];
  if (!h) {
    flashHud('SNAP FAILED', 'No ground found below.');
    return false;
  }

  const worldNormal = h.face?.normal
    ? h.face.normal.clone().transformDirection(h.object.matrixWorld).normalize()
    : _snapUp;

  // keep same "floor" constraint as placement
  if (worldNormal.dot(_snapUp) < CP_FLOOR_DOT) {
    flashHud('SNAP FAILED', 'Ground below is not flat enough.');
    return false;
  }

  const liftY = marker.userData?._liftY || 0;
  _snapLift.set(0, liftY, 0);

  marker.position.copy(h.point).add(_snapLift);
  marker.quaternion.identity();

  const ws = editorToWs(h.point);
  ent.pos = [ws.x, ws.y, ws.z];

  updateHudAll();
  flashHud('SNAPPED', `CP ${ent.index} aligned to ground.`, 600);
  return true;
}
btnSnap?.addEventListener('click', () => snapSelectedCheckpoint());

const TP_BORDER_COLOR = 0xc05cff;

const CP_MAT_TP_GLOW = new THREE.MeshBasicMaterial({
  color: TP_BORDER_COLOR,
  transparent: true,
  opacity: 0.28,
  depthWrite: false,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  polygonOffset: true,
  polygonOffsetFactor: -3,
  polygonOffsetUnits: -3,
});

function makeCheckpointMarker(index, hitPoint, isTeleport = false) {
  const gCore = new THREE.RingGeometry(cpInnerRadius, cpOuterRadius, 80);
  gCore.rotateX(-Math.PI / 2);
  const gGlow = new THREE.RingGeometry(cpOuterRadius * 0.996, cpOuterRadius * 1.035, 80);
  gGlow.rotateX(-Math.PI / 2);

  const core = new THREE.Mesh(gCore, CP_MAT_CORE);
  const glow = new THREE.Mesh(gGlow, isTeleport ? CP_MAT_TP_GLOW : CP_MAT_GLOW);

  const group = new THREE.Group();
  group.userData._isCheckpointMarker = true;
  group.add(glow);
  group.add(core);

  // Always horizontal
  group.quaternion.identity();

  // tiny lift to avoid z-fighting
  const liftY = Math.max(0.01, cpOuterRadius * 0.015);
  group.userData._liftY = liftY;

  group.position.copy(hitPoint).add(new THREE.Vector3(0, liftY, 0));

  group.add(makeHitDisk(cpOuterRadius * 1.45, group, true));

  const beamGeo = new THREE.CylinderGeometry(beaconRadius, beaconRadius, beaconHeight, 10, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.y = beaconHeight / 2;
  beam.renderOrder = 5;
  group.add(beam);

  const label = makeLabelSprite(String(index));
  label.position.y = beaconHeight + labelYOffset;
  group.add(label);
  group.userData.label = label;

  return group;
}

function makeTeleportMarker(cpIndex, hitPoint) {
  const group = makeCheckpointMarker(cpIndex, hitPoint, true);

  group.userData._isTeleportMarker = true;

  return group;
}

function makeBoundarySphereMarker(radius = 5) {
  const r = Math.max(0.001, Math.abs(radius));
  const group = new THREE.Group();

  const geo = new THREE.SphereGeometry(r, 24, 18);
  const fill = new THREE.Mesh(geo, BS_MAT_FILL);
  group.add(fill);

  const wireGeo = new THREE.WireframeGeometry(geo);
  const wire = new THREE.LineSegments(wireGeo, BS_MAT_WIRE);
  wire.renderOrder = 2;
  group.add(wire);

  group.userData._bs = { fill, wire };
  group.add(makeHitSphere(Math.max(1, r * 1.05), group));
  return group;
}

function rebuildBoundarySphere(group, radius) {
  if (!group?.userData?._bs) return;

  const r = Math.max(0.001, Math.abs(radius));
  const { fill, wire } = group.userData._bs;

  const newGeo = new THREE.SphereGeometry(r, 24, 18);
  fill.geometry.dispose();
  fill.geometry = newGeo;

  wire.geometry.dispose();
  wire.geometry = new THREE.WireframeGeometry(newGeo);

  const hits = [];
  group.traverse((o) => { if (o.isMesh && o.userData?.isHit) hits.push(o); });
  for (const h of hits) {
    group.remove(h);
    h.geometry?.dispose?.();
    h.material?.dispose?.();
  }
  group.add(makeHitSphere(Math.max(1, r * 1.05), group));
}

function makeFunctionOrbMarker(radius = ORB_RADIUS) {
  const group = new THREE.Group();

  const geo = new THREE.SphereGeometry(radius, 28, 20);

  // materials cloned to allow per-instance color changes
  const coreMat = ORB_MAT_CORE.clone();
  const glowMat = ORB_MAT_GLOW.clone();

  const core = new THREE.Mesh(geo, coreMat);
  group.add(core);

  const glowGeo = new THREE.SphereGeometry(radius * 1.35, 24, 18);
  const glow = new THREE.Mesh(glowGeo, glowMat);
  group.add(glow);

  // store refs to switch colors
  group.userData._orb = { core, glow };

  group.add(makeHitSphere(radius * 1.3, group));
  return group;
}

function setFunctionOrbUnlockVisual(group, unlock) {
  const st = group?.userData?._orb;
  if (!st) return;

  const col = unlock ? 0xff8a00 : 0x37ff7a; // orange / vert
  const emi = unlock ? 0xff4a00 : 0x1eff62;

  st.core.material.color.setHex(col);
  if (st.core.material.emissive) st.core.material.emissive.setHex(emi);

  st.glow.material.color.setHex(col);
}

// Portals: start ring + end particles
const animatedPortals = new Set();

function makePortalStartMarker(surfaceNormal) {
  const outer = cpOuterRadius * 1.05;
  const inner = outer * 0.74;

  // Keep ring geometry VERTICAL (default RingGeometry is in XY plane)
  const gCore = new THREE.RingGeometry(inner, outer, 90);
  const core = new THREE.Mesh(gCore, PORTAL_RING_CORE);

  const gGlow = new THREE.RingGeometry(outer * 0.88, outer * 1.22, 90);
  const glow = new THREE.Mesh(gGlow, PORTAL_RING_GLOW);

  const group = new THREE.Group();
  group.add(glow);
  group.add(core);

  // Force "vertical": only yaw-rotation from the surface normal (ignore Y)
  const n = (surfaceNormal || new THREE.Vector3(0, 1, 0)).clone();
  n.y = 0;
  if (n.lengthSq() < 1e-8) n.set(0, 0, 1);
  n.normalize();

  // RingGeometry faces +Z by default, rotate around Y to aim at horizontal normal
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
  group.quaternion.copy(q);

  // Hit disk also vertical (no rotateX)
  group.add(makeHitDisk(outer * 1.08, group, false));
  return group;
}

function makePortalEndParticles() {
  const group = new THREE.Group();

  const count = 120;
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  const base = [];

  for (let i = 0; i < count; i++) {
    const r = Math.random() * 0.7;
    const a = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 0.8;

    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;

    positions[i * 3 + 0] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    speeds[i] = 0.6 + Math.random() * 1.4;
    base.push({ a, r, y });
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.16,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    color: PORTAL_PINK,
    blending: THREE.AdditiveBlending,
  });

  const pts = new THREE.Points(geo, mat);
  pts.renderOrder = 6;
  group.add(pts);

  group.userData._portalEnd = { pts, base, speeds, t: 0 };
  group.add(makeHitSphere(1.0, group));

  animatedPortals.add(group);
  return group;
}

function updatePortalParticles(dt) {
  for (const group of animatedPortals) {
    const st = group.userData?._portalEnd;
    if (!st?.pts?.geometry) continue;

    st.t += dt;
    const posAttr = st.pts.geometry.getAttribute('position');

    for (let i = 0; i < st.base.length; i++) {
      const b = st.base[i];
      const sp = st.speeds[i];

      const ang = b.a + st.t * sp;
      const rr = b.r * (0.85 + 0.25 * Math.sin(st.t * sp + i));
      const yy = b.y + 0.12 * Math.sin(st.t * (sp * 1.3) + i * 0.2);

      posAttr.setXYZ(i, Math.cos(ang) * rr, yy, Math.sin(ang) * rr);
    }

    posAttr.needsUpdate = true;
    group.rotation.y += dt * 0.35;
  }
}

function removeAnimatedPortalsInside(root) {
  const toRemove = [];
  root.traverse((o) => { if (o.userData?._portalEnd) toRemove.push(o); });
  for (const g of toRemove) animatedPortals.delete(g);
}

/* ============================================================================
  Reindex helpers
============================================================================ */
function reindexType(type) {
  const list = entities.filter((e) => e.type === type).sort((a, b) => a.index - b.index);
  for (let i = 0; i < list.length; i++) {
    list[i].index = i;

    if (type === 'checkpoints') {
      const marker = list[i].marker;
      const oldLabel = marker?.userData?.label;
      if (oldLabel) {
        marker.remove(oldLabel);
        const newLabel = makeLabelSprite(String(i));
        newLabel.position.copy(oldLabel.position);
        marker.add(newLabel);
        marker.userData.label = newLabel;
      }
    }
  }
}

/* ============================================================================
  Raycast selection / placement
============================================================================ */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function getPointerNDC(ev) {
  const r = renderer.domElement.getBoundingClientRect();
  mouse.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
  mouse.y = -(((ev.clientY - r.top) / r.height) * 2 - 1);
}

function getOwnerWithEntity(owner) {
  let o = owner;
  while (o) {
    if (o.userData?.entity) return o;
    o = o.parent;
  }
  return null;
}

function pickInCurrentMode(intersections) {
  const modeId = getMode().id;
  for (const h of intersections) {
    const rawOwner = h.object?.userData?.owner;
    if (!rawOwner) continue;

    const root = getOwnerWithEntity(rawOwner) || rawOwner;
    const ent = root.userData?.entity;
    if (!ent) continue;
    if (ent.type !== modeId) continue;

    // Portals : manip start/end (rawOwner)
    const attach = (ent.type === 'portals') ? rawOwner : root;
    return { owner: root, ent, attach };
  }
  return null;
}

// Portals: 2-step creation
let portalDraft = null; // { portalGroup, start, startMarker }

renderer.domElement.addEventListener('pointerdown', (ev) => {
  if (ev.button !== 0) return;
  if (mouseLook || isGizmoDragging) return;

  canvas.focus();

  getPointerNDC(ev);
  raycaster.setFromCamera(mouse, camera);

  const mode = getMode();

  if (mode.id === 'checkpoints' && TELEPORT_ARMED && selectedData?.type === 'checkpoints' && collider) {
    const hits = raycaster.intersectObject(collider, true);
    const h = hits?.[0];
    if (h) {
      setCheckpointTeleport(selectedData, h.point);
      TELEPORT_ARMED = false;
      flashHud('TELEPORT', `TP set for CP ${selectedData.index}`, 650);
    } else {
      flashHud('TELEPORT', 'No surface hit.', 650);
    }
    return;
  }
  const placingPortalEnd = (mode.id === 'portals' && portalDraft);
  // 1) Select
 if (!placingPortalEnd) {
   const markerHits = raycaster.intersectObjects(markersGroup.children, true);
   const picked = pickInCurrentMode(markerHits);
    if (picked) {
      setSelected(picked.owner, picked.ent, picked.attach);
      return;
    }
 }

  // 2) Place
  if (!addMode || !collider) return;

  if (mode.id === 'skillBans') {
    flashHud('SKILL BANS', 'HUD-only for now.');
    return;
  }

  const hits = raycaster.intersectObject(collider, true);
  const h = hits?.[0];
  if (!h) return;

  const worldNormal = h.face?.normal
    ? h.face.normal.clone().transformDirection(h.object.matrixWorld).normalize()
    : new THREE.Vector3(0, 1, 0);

  if (mode.id === 'checkpoints') {
    const dot = worldNormal.dot(new THREE.Vector3(0, 1, 0));
    if (dot < CP_FLOOR_DOT) {
      flashHud('CANNOT PLACE CHECKPOINT HERE', 'Checkpoint must be on floor (horizontal).');
      return;
    }

    const index = countByType('checkpoints');

    // Visual placement (Editor coords)
    const marker = makeCheckpointMarker(index, h.point, false);

    // Data storage (Workshop coords)
    const ws = editorToWs(h.point);

    const ent = {
      type: 'checkpoints',
      index,
      pos: [ws.x, ws.y, ws.z],
      marker,
    };
    marker.userData.entity = ent;

    markersGroup.add(marker);
    entities.push(ent);
    setSelected(marker, ent);
    updateHudAll();
    return;
  }

  if (mode.id === 'boundarySpheres') {
    const index = countByType('boundarySpheres');
    const radius = 5;

    const marker = makeBoundarySphereMarker(radius);
    marker.position.copy(h.point);

    const ws = editorToWs(h.point);

    const ent = {
      type: 'boundarySpheres',
      index,
      pos: [ws.x, ws.y, ws.z],
      radius,
      cp: activeCheckpoint,
      marker,
    };
    marker.userData.entity = ent;

    markersGroup.add(marker);
    entities.push(ent);
    setSelected(marker, ent);
    updateHudAll();
    return;
  }

  if (mode.id === 'functionOrbs') {
    const index = countByType('functionOrbs');
    const strength = 10;

    const marker = makeFunctionOrbMarker(ORB_RADIUS);
    marker.position.copy(h.point);

    const ws = editorToWs(h.point);

    const ent = {
      type: 'functionOrbs',
      index,
      pos: [ws.x, ws.y, ws.z],
      strength,
      cp: activeCheckpoint,
      ult: false,
      dash: false,
      lock: false,
      marker,
    };
    marker.userData.entity = ent;
    setFunctionOrbUnlockVisual(marker, ent.lock);

    markersGroup.add(marker);
    entities.push(ent);
    setSelected(marker, ent);
    updateHudAll();
    return;
  }

  if (mode.id === 'portals') {
    if (!portalDraft) {
      const portalGroup = new THREE.Group();

      // pivot portail at start point
      portalGroup.position.copy(h.point);

      const startMarker = makePortalStartMarker(worldNormal);

      // startMarker
      startMarker.position.copy(worldNormal).multiplyScalar(0.02);

      portalGroup.add(startMarker);
      portalGroup.userData._portal = { startMarker, endFx: null };

      const wsStart = editorToWs(h.point);
      portalDraft = {
        portalGroup,
        startMarker,
        start: [wsStart.x, wsStart.y, wsStart.z],
      };

      markersGroup.add(portalGroup);

      const entDraft = {
        type: 'portals',
        index: countByType('portals'),
        start: portalDraft.start,
        end: portalDraft.start,
        cp: activeCheckpoint,
        marker: portalGroup,
        _draft: true,
      };
      portalGroup.userData.entity = entDraft;

      setSelected(portalGroup, entDraft, startMarker);
      updateHudAll();
      return;
    }

    const portalGroup = portalDraft.portalGroup;

    const endFx = makePortalEndParticles();
    endFx.position.copy(h.point).sub(portalGroup.position).add(worldNormal.clone().multiplyScalar(0.04));
    portalGroup.add(endFx);

    const st = portalGroup.userData?._portal;
    if (st) st.endFx = endFx;

    const wsEnd = editorToWs(h.point);

    const ent = {
      type: 'portals',
      index: countByType('portals'),
      start: portalDraft.start,
      end: [wsEnd.x, wsEnd.y, wsEnd.z],
      cp: activeCheckpoint,
      marker: portalGroup,
    };
    
    portalGroup.userData.entity = ent;
    entities.push(ent);

    portalDraft = null;

    // Keep exit selected (gizmo on endFx) after placement
    setSelected(portalGroup, ent, endFx);
    updateHudAll();
  }
});

const _tmp = new THREE.Vector3();

gizmo.addEventListener('objectChange', () => {
  if (!selected) return;
  const ent = selected.userData?.entity;
  if (!ent) return;

  // Portals: update start/end from child world positions
  if (ent.type === 'portals') {
    const st = selected.userData?._portal;
    if (!st?.startMarker) return;

    // Start
    st.startMarker.getWorldPosition(_tmp);
    const so = st.startMarker.userData?._placeOffset;
    if (so) _tmp.sub(so);
    const wsS = editorToWs(_tmp);
    ent.start = [wsS.x, wsS.y, wsS.z];

    // End (if exists)
    if (st.endFx) {
      st.endFx.getWorldPosition(_tmp);
      const eo = st.endFx.userData?._placeOffset;
      if (eo) _tmp.sub(eo);
      const wsE = editorToWs(_tmp);
      ent.end = [wsE.x, wsE.y, wsE.z];
    } else {
      // still draft
      ent.end = ent.start.slice();
      if (portalDraft) portalDraft.start = ent.start;
    }

    updateHudAll();
    return;
  }

  // Non-portals
  const baseEd = getMarkerBaseEditorPos(selected, ent);
  const ws = editorToWs(baseEd);

  if (ent.type === 'checkpoints' && selected?.userData?._isTeleportMarker) {
    ent.tp = [ws.x, ws.y, ws.z];
  } else {
    ent.pos = [ws.x, ws.y, ws.z];
  }

  updateHudAll();
});

/* ============================================================================
  Import Workshop Data
============================================================================ */
function findRuleBlockByNames(src, names) {
  if (!src) return null;
  const want = new Set((names || []).map(String));

  const re = /rule\s*\(\s*"([^"]+)"\s*\)\s*/gi;
  let m;
  while ((m = re.exec(src))) {
    const ruleName = m[1];
    if (!want.has(ruleName)) continue;

    const braceStart = src.indexOf('{', re.lastIndex);
    if (braceStart < 0) return null;

    let depth = 0;
    for (let i = braceStart; i < src.length; i++) {
      const ch = src[i];
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          return { name: ruleName, block: src.slice(m.index, i + 1) };
        }
      }
    }
    return null;
  }
  return null;
}

function splitTopLevelCommaList(s) {
  const out = [];
  let cur = '';
  let p = 0, b = 0, q = false;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const prev = s[i - 1];

    if (ch === '"' && prev !== '\\') q = !q;

    if (!q) {
      if (ch === '(') p++;
      else if (ch === ')') p--;
      else if (ch === '[') b++;
      else if (ch === ']') b--;

      if (ch === ',' && p === 0 && b === 0) {
        out.push(cur);
        cur = '';
        continue;
      }
    }
    cur += ch;
  }

  if (cur.trim()) out.push(cur);
  return out;
}

function parseCheckpointEntries(block) {
  if (block == null) return [];
  const parts = splitTopLevelCommaList(block);

  const out = [];
  for (const p0 of parts) {
    const p = (p0 || '').trim();
    if (!p) continue;

    // Teleporter checkpoint: Array(Vector(...), Vector(...))
    if (/^Array\s*\(/i.test(p)) {
      const inner = p.replace(/^Array\s*\(/i, '').replace(/\)\s*$/, '');
      const vecs = parseVectorArray(inner);

      if (vecs.length >= 2) out.push({ pos: vecs[0], tp: vecs[1] });
      else if (vecs.length === 1) out.push({ pos: vecs[0], tp: null });
      continue;
    }

    // Normal checkpoint: Vector(...)
    const v = parseVectorArray(p);
    if (v.length) out.push({ pos: v[0], tp: null });
  }

  return out;
}

function parseCpLinkArray(block) {
  if (block == null) return [];
  const parts = splitTopLevelCommaList(block);

  const out = [];
  for (const p0 of parts) {
    const p = p0.trim();
    if (!p) continue;

    if (/^Array\s*\(/i.test(p)) {
      const inner = p.replace(/^Array\s*\(/i, '').replace(/\)\s*$/, '');
      const nums = (inner.match(RE_NUMBER) || []).map(Number).filter(Number.isFinite);
      out.push(Number.isFinite(nums[0]) ? (nums[0] | 0) : 0);
    } else {
      const nums = (p.match(RE_NUMBER) || []).map(Number).filter(Number.isFinite);
      out.push(Number.isFinite(nums[0]) ? (nums[0] | 0) : 0);
    }
  }
  return out;
}

function openImportModal() {
  let modal = document.getElementById('importModalOverlay');
  if (modal) {
    modal.classList.remove('hidden');
    const ta = modal.querySelector('textarea');
    ta?.focus();
    return;
  }

  modal = document.createElement('div');
  modal.id = 'importModalOverlay';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4';
  modal.innerHTML = `
    <div class="w-full max-w-3xl rounded-2xl border border-white/10 bg-zinc-950/90 p-4 shadow-2xl">
      <div class="flex items-center justify-between gap-3">
        <div class="text-sm font-extrabold text-zinc-100">Import data (paste Workshop rule)</div>
        <button id="importClose" class="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-zinc-200 hover:bg-white/10">
          Close
        </button>
      </div>

      <div class="mt-3">
        <textarea
          id="importText"
          class="h-[320px] w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-zinc-100 outline-none"
          placeholder="Paste your Workshop rule here..."
        ></textarea>
        <div class="mt-2 text-xs text-zinc-400">
          Reads: Global.A (checkpoints), Global.H & Global.I (killballs), Global.TQ & Global.EditMode (orbs), Global.TQ5/TQ6/ BounceToggleLock, Global.SHIFT / Global.Dao (skill bans).
        </div>
      </div>

      <div class="mt-4 flex items-center justify-end gap-2">
        <button id="importCancel" class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10">
          Cancel
        </button>
        <button id="importApply" class="rounded-lg border border-emerald-400/20 bg-emerald-500/15 px-3 py-2 text-sm font-extrabold text-emerald-200 hover:bg-emerald-500/25">
          Import
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => modal.classList.add('hidden');

  modal.querySelector('#importClose')?.addEventListener('click', close);
  modal.querySelector('#importCancel')?.addEventListener('click', close);

  modal.querySelector('#importApply')?.addEventListener('click', () => {
    const text = modal.querySelector('#importText')?.value || '';
    try {
      importWorkshopData(text);
      close();
    } catch (err) {
      console.error(err);
      flashHud('IMPORT FAILED', 'Could not parse data. Check the pasted text.');
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  modal.querySelector('#importText')?.focus();
}

function openExportModal(text) {
  const CONTENT = String(text ?? '');

  let modal = document.getElementById('exportModalOverlay');
  if (modal) {
    modal.classList.remove('hidden');
    const ta = modal.querySelector('#exportText');
    if (ta) ta.value = CONTENT;
    ta?.focus();
    ta?.select?.();
    return;
  }

  modal = document.createElement('div');
  modal.id = 'exportModalOverlay';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4';
  modal.innerHTML = `
    <div class="w-full max-w-3xl rounded-2xl border border-white/10 bg-zinc-950/90 p-4 shadow-2xl">
      <div class="flex items-center justify-between gap-3">
        <div class="text-sm font-extrabold text-zinc-100">Export (Map Data patched)</div>

        <div class="flex items-center gap-2">
          <button id="exportCopy"
            class="rounded-lg border border-emerald-400/20 bg-emerald-500/15 px-3 py-1.5 text-sm font-extrabold text-emerald-200 hover:bg-emerald-500/25">
            Copy
          </button>

          <button id="exportClose"
            class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-zinc-200 hover:bg-white/10">
            Close
          </button>
        </div>
      </div>

      <div class="mt-3">
        <textarea
          id="exportText"
          class="h-[360px] w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-zinc-100 outline-none"
          spellcheck="false"
        ></textarea>

        <div class="mt-2 text-xs text-zinc-400">
          Tip: this is the full Workshop script. Only the <b class="text-zinc-200">Map Data</b> rule is modified.
        </div>
      </div>

      <div class="mt-3 flex items-center justify-end gap-2">
        <button id="exportSelectAll"
          class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10">
          Select all
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const ta = modal.querySelector('#exportText');
  if (ta) ta.value = CONTENT;

  const close = () => modal.classList.add('hidden');

  modal.querySelector('#exportClose')?.addEventListener('click', close);

  modal.querySelector('#exportSelectAll')?.addEventListener('click', () => {
    ta?.focus();
    ta?.select?.();
  });

  modal.querySelector('#exportCopy')?.addEventListener('click', async () => {
    const value = ta?.value ?? '';
    const btn = modal.querySelector('#exportCopy');

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        ta?.focus();
        ta?.select?.();
        document.execCommand?.('copy');
      }

      if (btn) {
        const old = btn.textContent;
        btn.textContent = 'Copied ✓';
        setTimeout(() => (btn.textContent = old), 900);
      }
      flashHud('COPIED', 'Export copied to clipboard.', 650);
    } catch (e) {
      console.warn('Copy failed', e);
      flashHud('COPY FAILED', 'Select all then Ctrl+C.', 900);
      ta?.focus();
      ta?.select?.();
    }
  });

  // click outside card = close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  // ESC = close
  const onKey = (e) => {
    if (e.key === 'Escape') {
      close();
      window.removeEventListener('keydown', onKey, true);
    }
  };
  window.addEventListener('keydown', onKey, true);

  ta?.focus();
  ta?.select?.();
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractArrayBlock(src, varName) {
  const re = new RegExp(`Global\\.${escapeRegExp(varName)}\\s*=\\s*Array\\s*\\(([^]*?)\\)\\s*;`, 'i');
  const m = src.match(re);
  return m ? (m[1] || '') : null;
}

const RE_VECTOR = /Vector\s*\(\s*([+-]?\d*\.?\d+(?:e[+-]?\d+)?)\s*,\s*([+-]?\d*\.?\d+(?:e[+-]?\d+)?)\s*,\s*([+-]?\d*\.?\d+(?:e[+-]?\d+)?)\s*\)/gi;
const RE_NUMBER = /[+-]?\d*\.?\d+(?:e[+-]?\d+)?/gi;

function parseVectorArray(block) {
  if (block == null) return [];
  const out = [];
  block.replace(RE_VECTOR, (_, x, y, z) => {
    out.push([parseFloat(x), parseFloat(y), parseFloat(z)]);
    return '';
  });
  return out;
}

function parseNumberArray(block) {
  if (block == null) return [];
  const cleaned = block.replace(RE_VECTOR, '');
  const m = cleaned.match(RE_NUMBER);
  return (m || []).map((s) => parseFloat(s)).filter((n) => Number.isFinite(n));
}

function parseBoolArray(block) {
  if (block == null) return [];
  const cleaned = block.replace(RE_VECTOR, '');
  const m = cleaned.match(/\b(True|False)\b/gi) || [];
  return m.map((s) => s.toLowerCase() === 'true');
}

function clearAllEntities() {
  gizmo.detach();
  selected = null;
  selectedData = null;
  skillBansByCp = new Map();

  removeAnimatedPortalsInside(markersGroup);
  animatedPortals.clear();

  portalDraft = null;
  entities = [];

  // remove all markers
  while (markersGroup.children.length) {
    markersGroup.remove(markersGroup.children[0]);
  }
}

function importWorkshopData(text) {
  if (!text || typeof text !== 'string') throw new Error('Empty import');

  LAST_IMPORTED_FULL_TEXT = text;
  LAST_IMPORTED_MAPDATA_INFO = null;

  const names = getMapDataRuleNames();
  const found = findRuleBlockByNamesWithRange(text, names);
  const src = found?.block || text;

  if (found) {
    LAST_IMPORTED_MAPDATA_INFO = {
      start: found.start,
      end: found.end,
      name: found.name,
      block: found.block,
    };
  }

  clearAllEntities();

  // Checkpoints (Global.A) - supports nested A
  const cpEntries = parseCheckpointEntries(extractArrayBlock(src, 'A'));

  for (let i = 0; i < cpEntries.length; i++) {
    const entry = cpEntries[i];
    const v = entry.pos; // WS trigger
    const ws = new THREE.Vector3(v[0], v[1], v[2]);
    const ed = wsToEditor(ws);

    const marker = makeCheckpointMarker(i, ed, false);

    const ent = {
      type: 'checkpoints',
      index: i,
      pos: [v[0], v[1], v[2]],   // trigger
      tp: entry.tp ? [entry.tp[0], entry.tp[1], entry.tp[2]] : null, // destination
      marker,
    };

    marker.userData.entity = ent;
    setFunctionOrbUnlockVisual(marker, ent.lock);
    markersGroup.add(marker);

    if (ent.tp) {
      const tpWs = new THREE.Vector3(ent.tp[0], ent.tp[1], ent.tp[2]);
      const tpEd = wsToEditor(tpWs);

      const tpMarker = makeTeleportMarker(i, tpEd);
      tpMarker.userData.entity = ent;
      ent.tpMarker = tpMarker;
      markersGroup.add(tpMarker);
    }
    entities.push(ent);
  }

  // Boundary spheres (killballs): H positions + I radii (SIGNED) + killballnumber -> cp link
  const bsPos = parseVectorArray(extractArrayBlock(src, 'H'));
  const bsRad = parseNumberArray(extractArrayBlock(src, 'I'));
  const bsCp  = parseCpLinkArray(extractArrayBlock(src, 'killballnumber'));

  for (let i = 0; i < bsPos.length; i++) {
    const p = bsPos[i];
    const radiusSigned = Number.isFinite(bsRad[i]) ? bsRad[i] : (Number.isFinite(bsRad[0]) ? bsRad[0] : 5);
    const cp = Number.isFinite(bsCp[i]) ? bsCp[i] : 0;

    const ws = new THREE.Vector3(p[0], p[1], p[2]);
    const ed = wsToEditor(ws);

    const marker = makeBoundarySphereMarker(Math.abs(radiusSigned));
    marker.position.copy(ed);

    const ent = {
      type: 'boundarySpheres',
      index: i,
      pos: [p[0], p[1], p[2]],
      radius: radiusSigned,
      cp: clampCpIndex(cp),
      marker,
    };

    marker.userData.entity = ent;
    markersGroup.add(marker);
    entities.push(ent);
  }

  // Function orbs: TQ positions + EditMode strengths + toggles + pinballnumber cp link
  const orbPos = parseVectorArray(extractArrayBlock(src, 'TQ'));
  const orbCp  = parseCpLinkArray(extractArrayBlock(src, 'pinballnumber'));
  const orbStrengthRaw = parseNumberArray(extractArrayBlock(src, 'EditMode'));
  const orbUlt  = parseBoolArray(extractArrayBlock(src, 'TQ5'));
  const orbDash = parseBoolArray(extractArrayBlock(src, 'TQ6'));
  const orbLock = parseBoolArray(extractArrayBlock(src, 'BounceToggleLock'));

  for (let i = 0; i < orbPos.length; i++) {
    const p = orbPos[i];

    const ws = new THREE.Vector3(p[0], p[1], p[2]);
    const ed = wsToEditor(ws);

    const lock = !!orbLock[i];
    let strength = Number.isFinite(orbStrengthRaw[i]) ? orbStrengthRaw[i] : 10;
    // lock -> strength always 0
    if (lock) strength = 0;

    const marker = makeFunctionOrbMarker(ORB_RADIUS);
    marker.position.copy(ed);

    const ent = {
      type: 'functionOrbs',
      index: i,
      pos: [p[0], p[1], p[2]],
      cp: clampCpIndex(Number.isFinite(orbCp[i]) ? orbCp[i] : 0),
      strength,
      ult: !!orbUlt[i],
      dash: !!orbDash[i],
      lock,
      marker,
    };

    marker.userData.entity = ent;
    markersGroup.add(marker);
    entities.push(ent);
  }

  // Portals (custom)
  const ps = parseVectorArray(extractArrayBlock(src, 'CustomPortalStart'));
  const pe = parseVectorArray(extractArrayBlock(src, 'CustomPortalEndpoint'));
  const pc = parseNumberArray(extractArrayBlock(src, 'CustomPortalCP')).map(n => (n | 0));

  const pn = Math.min(ps.length, pe.length);
  for (let i = 0; i < pn; i++) {
    const s = ps[i], e = pe[i];

    const wsS = new THREE.Vector3(s[0], s[1], s[2]);
    const wsE = new THREE.Vector3(e[0], e[1], e[2]);

    const edS = wsToEditor(wsS);
    const edE = wsToEditor(wsE);

    const dir = edE.clone().sub(edS); dir.y = 0;
    if (dir.lengthSq() < 1e-8) dir.set(0, 0, 1);
    dir.normalize();

    const portalGroup = new THREE.Group();
    portalGroup.position.copy(edS);

    const startMarker = makePortalStartMarker(dir);
    portalGroup.add(startMarker);

    const endFx = makePortalEndParticles();
    endFx.position.copy(edE).sub(edS).add(dir.clone().multiplyScalar(0.04));
    portalGroup.add(endFx);

    portalGroup.userData._portal = { startMarker, endFx };

    const ent = {
      type: 'portals',
      index: countByType('portals'),
      start: [s[0], s[1], s[2]],
      end: [e[0], e[1], e[2]],
      cp: clampCpIndex(Number.isFinite(pc[i]) ? pc[i] : 0),
      marker: portalGroup,
    };

    portalGroup.userData.entity = ent;
    markersGroup.add(portalGroup);
    entities.push(ent);
  }

  // Skill bans (Ban* arrays) -> fill skillBansByCp
  const banMulti      = parseNumberArray(extractArrayBlock(src, 'BanMulti')).map(n => n | 0);
  const banCreate     = parseNumberArray(extractArrayBlock(src, 'BanCreate')).map(n => n | 0);
  const banDead       = parseNumberArray(extractArrayBlock(src, 'BanDead')).map(n => n | 0);
  const banEmote      = parseNumberArray(extractArrayBlock(src, 'BanEmote')).map(n => n | 0);
  const banClimb      = parseNumberArray(extractArrayBlock(src, 'BanClimb')).map(n => n | 0);
  const banBhop       = parseNumberArray(extractArrayBlock(src, 'BanBhop')).map(n => n | 0);
  const banStand      = parseNumberArray(extractArrayBlock(src, 'BanStand')).map(n => n | 0);
  const banSaveDouble = parseNumberArray(extractArrayBlock(src, 'BanSaveDouble')).map(n => n | 0);

  const cpCount = countByType('checkpoints');
  const banSets = {
    multi: new Set(banMulti),
    create: new Set(banCreate),
    climb: new Set(banClimb),
    saveDouble: new Set(banSaveDouble),
    dead: new Set(banDead),
    emote: new Set(banEmote),
    bhop: new Set(banBhop),
    stand: new Set(banStand),
  };

  skillBansByCp = new Map();
  for (let i = 0; i < cpCount; i++) {
    const arr = Array(SKILL_BANS.length).fill(false);
    arr[0] = banSets.multi.has(i);
    arr[1] = banSets.create.has(i);
    arr[2] = banSets.climb.has(i);
    arr[3] = banSets.saveDouble.has(i);
    arr[4] = banSets.dead.has(i);
    arr[5] = banSets.emote.has(i);
    arr[6] = banSets.bhop.has(i);
    arr[7] = banSets.stand.has(i);
    skillBansByCp.set(i, arr);
  }

  setActiveCheckpoint(0);
  applyViewVisibility();
  updateHudAll();
}

/* ============================================================================
  Load GLB + Maps config
============================================================================ */
const loader = new GLTFLoader();
let loadToken = 0;

function loadGltfWithProgress(url, onProgress) {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => resolve(gltf),
      (ev) => {
        if (typeof onProgress === 'function') onProgress(ev);
      },
      (err) => reject(err)
    );
  });
}

const _dlUI = {
  raf: 0,
  token: 0,
  loaded: 0,
  total: 0,
  autoStarted: false,
};

function _applyDownloadUI() {
  _dlUI.raf = 0;

  const token = _dlUI.token;
  if (token !== loadToken) return;

  const loaded = _dlUI.loaded || 0;
  const total  = _dlUI.total  || 0;

  if (total > 0) {
    const ratio = Math.max(0, Math.min(1, loaded / total));
    const p = 2 + ratio * 83;

    setLoadStage(
      token,
      'Loading assets',
      p,
      `Downloading… ${(loaded / 1048576).toFixed(1)} / ${(total / 1048576).toFixed(1)} MB`
    );

    if (!_dlUI.autoStarted && ratio >= 0.995) {
      _dlUI.autoStarted = true;
      setLoadStage(token, 'Preparing objects', null, 'Parsing scene…');
      startAutoLoadProgress(token, 86, 99);
    }
  } else {
    setLoadStage(token, 'Loading assets', 10, `Downloading… ${(loaded / 1048576).toFixed(1)} MB`);

    if (!_dlUI.autoStarted && loaded > 5 * 1048576) {
      _dlUI.autoStarted = true;
      setLoadStage(token, 'Preparing objects', null, 'Parsing scene…');
      startAutoLoadProgress(token, 86, 99);
    }
  }
}

function scheduleDownloadUI(token, loaded, total) {
  _dlUI.token = token;
  _dlUI.loaded = loaded;
  _dlUI.total = total;

  if (_dlUI.raf) return;
  _dlUI.raf = requestAnimationFrame(_applyDownloadUI);
}

function clearMapGroup() {
  const olds = [...mapGroup.children];
  for (const o of olds) {
    mapGroup.remove(o);
    disposeObject3D(o);
  }
}

async function loadMapById(mapId) {
  if (!MAPS_CFG) throw new Error('MAPS_CFG not loaded yet');

  const def =
    findMap(MAPS_CFG, mapId) ||
    findMap(MAPS_CFG, MAPS_CFG.default) ||
    MAPS_CFG.maps?.[0];

  if (!def) throw new Error(`Unknown map id: ${mapId}`);

  // UI
  if (mapSelect) mapSelect.value = def.id;
  setMapIdInUrl(def.id);

  // Apply config
  CURRENT_MAP = def;
  LAST_IMPORTED_FULL_TEXT = null;
  LAST_IMPORTED_MAPDATA_INFO = null;
  MODEL_URL = String(def.model_url || '').trim();
  if (!MODEL_URL) throw new Error(`Map "${def.id}" has empty model_url`);

  const off = Array.isArray(def.ws_offset) ? def.ws_offset : [0, 0, 0];
  WS_OFFSET.set(off[0] || 0, off[1] || 0, off[2] || 0);

  // Reset editor state
  clearAllEntities();
  removeAnimatedPortalsInside(mapGroup);
  animatedPortals.clear();
  clearMapGroup();
  collider = null;

  // Token avoids race if switch fast
  const myToken = ++loadToken;
  showLoadOverlay(myToken, 'Loading map…');
  setLoadStage(myToken, 'Loading assets', 1, 'Downloading GLB…');

  // Load GLB
  _dlUI.autoStarted = false;

  const gltf = await loadGltfWithProgress(MODEL_URL, (ev) => {
    scheduleDownloadUI(myToken, ev?.loaded || 0, ev?.total || 0);
  });
  if (myToken !== loadToken) return;
  const root = gltf.scene;

  function collectGlbLights(root) {
    const lights = [];
    root.traverse(o => { if (o.isLight) lights.push(o); });

    const dir = lights.filter(l => l.isDirectionalLight);
    const mainSun =
      lights.find(l => /^mainsun/i.test(l.name)) ||
      lights.find(l => /sun/i.test(l.name)) ||
      dir[0] ||
      null;

    console.table(lights.map(l => ({
      name: l.name,
      type: l.type,
      intensity: l.intensity,
      visible: l.visible,
    })));

    return { lights, dir, mainSun };
  }

  function disableNonDirectionalLights(root) {
    root.traverse(o => {
      if (o.isPointLight || o.isSpotLight) o.visible = false;
    });
  }

  const report = sanitizeImportedScene(root);
  setLoadStage(myToken, 'Preparing objects', null, 'Sanitizing / hiding helpers…');
  if (report.hidden.length) {
    console.log('[3D EDITOR] Hidden helpers:', report.hidden.slice(0, 60));
  }

  function debugHiddenHugeThin(root) {
    const rows = [];
    root.updateWorldMatrix(true, true);

    root.traverse(o => {
      if (!o.isMesh || !o.geometry) return;
      const g = o.geometry;
      if (!g.boundingBox) g.computeBoundingBox();
      const s = g.boundingBox.getSize(new THREE.Vector3());
      const maxDim = Math.max(s.x, s.y, s.z);
      const minDim = Math.min(s.x, s.y, s.z);
      const thin = minDim < maxDim * 0.0015;

      const tris = (g.index ? g.index.count : (g.attributes?.position?.count || 0)) / 3;

      if (thin && tris < 8000) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        rows.push({
          visible: o.visible,
          name: o.name,
          tris: Math.round(tris),
          max: maxDim.toFixed(1),
          min: minDim.toExponential(2),
          matNames: mats.map(m => m?.name || '').join(' | ')
        });
      }
    });

    rows.sort((a,b) => (b.max - a.max));
    console.table(rows.slice(0, 30));
  }
  if (DBG_LOAD_TRAVERSE) debugHiddenHugeThin(root);
  forceWaterRenderSettings(root);
  setLoadStage(myToken, 'Preparing objects', null, 'Fixing water render settings…');
  if (DBG_LOAD_TRAVERSE) debugWater(root);
  mapGroup.add(root);
  mergeOpaqueStaticByMaterial(root);
  setLoadStage(myToken, 'Preparing objects', null, 'Merging static meshes…');
  freezeStaticTransforms(root);
  setLoadStage(myToken, 'Preparing objects', null, 'Freezing transforms…');
  const found = root.getObjectByName('COLLIDER');
  collider = found || root;
  if (found) found.visible = false;

  const bounds = computeVisibleBounds(root);
  const lightReport = collectGlbLights(root);
  setLoadStage(myToken, 'Finalizing', null, 'Computing bounds / scale…');
  const debugLight = disableNonDirectionalLights(root);
  console.log('[3D EDITOR] GLB lights found:', lightReport);
  applyLightingProfile({ lightReport, root, bounds });
  setLoadStage(myToken, 'Finalizing', null, 'Applying lighting…');
  // If GLB contains punctual lights, disable editor lights
  const hasGlbLights = setupGlbPunctualLights(root, bounds);
  editorLights.visible = !hasGlbLights;

  // RoomEnvironment ambient light
  if (hasGlbLights) {
    setEnvMapIntensity(root, 0.1);
  }

  // Camera spawn
  const cam = def.camera || {};
  if (cam.mode === 'fixed' && Array.isArray(cam.pos)) {
    camera.position.set(cam.pos[0] || 0, cam.pos[1] || 0, cam.pos[2] || 0);
    const la = Array.isArray(cam.lookAt)
      ? cam.lookAt
      : bounds.getCenter(new THREE.Vector3()).toArray();
    camera.lookAt(new THREE.Vector3(la[0] || 0, la[1] || 0, la[2] || 0));
    syncYawPitchFromCamera();
  } else {
    fitCameraToBounds(bounds);
  }
  setLoadStage(myToken, 'Finalizing', null, 'Spawning camera / HUD…');
  setMode(0);
  stopAutoLoadProgress(myToken);
  setLoadStage(myToken, 'Ready', 100, 'Done');
  setTimeout(() => hideLoadOverlay(myToken), 150);
  updateHudAll();
}

async function initEditor() {
  try {
    MAPS_CFG = await loadMapsConfig();
    populateMapSelect(MAPS_CFG);

    if (mapSelect) {
      mapSelect.addEventListener('change', (e) => {
        const id = e.target?.value;
        if (id) loadMapById(id).catch(console.error);
      });
    }

    const initial = getMapIdFromUrl() || MAPS_CFG.default || MAPS_CFG.maps[0]?.id;
    await loadMapById(initial);
  } catch (err) {
    console.error(err);
    if (mapSelect) {
      mapSelect.innerHTML = `<option value="">Failed to load maps</option>`;
    }
  }

  syncFullscreenUi();
}

initEditor();
/* ============================================================================
  Resize
============================================================================ */
function resize() {
  const r = renderer.domElement.getBoundingClientRect();
  const w = Math.max(1, Math.floor(r.width));
  const h = Math.max(1, Math.floor(r.height));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(editorStage || renderer.domElement);
resize();

function layoutHud() {
  if (!editorStage) return;
  const stageRect = editorStage.getBoundingClientRect();

  const bottomInStage = (el) => {
    if (!el || el.classList.contains('hidden')) return 0;
    const r = el.getBoundingClientRect();
    return Math.max(0, r.bottom - stageRect.top);
  };

  const topStackBottom = Math.max(bottomInStage(hudTopPanel), bottomInStage(hudHotkeys), 24);
  if (hudToolbar) {
    hudToolbar.style.top = `${topStackBottom + 10}px`;
  }

  const toolbarBottom = Math.max(bottomInStage(hudToolbar), topStackBottom);
  const panelsTop = toolbarBottom + 14;

  if (hudLeftPanel)  hudLeftPanel.style.top  = `${panelsTop}px`;
  if (hudRightPanel) hudRightPanel.style.top = `${panelsTop}px`;
}

const hudLayoutRO = new ResizeObserver(() => layoutHud());
if (editorStage) hudLayoutRO.observe(editorStage);
if (hudToolbar) hudLayoutRO.observe(hudToolbar);
if (hudTopPanel) hudLayoutRO.observe(hudTopPanel);
if (hudHotkeys) hudLayoutRO.observe(hudHotkeys);

window.addEventListener('resize', layoutHud);
document.addEventListener('fullscreenchange', () => setTimeout(layoutHud, 0));
layoutHud();

/* ============================================================================
  Loop
============================================================================ */
function animate() {
  requestAnimationFrame(animate);

  if (PERF_VISIBLE) stats.begin();

  const dt = Math.min(0.033, clock.getDelta());
  applyMouseLookFrame();
  updateFlyMovement(dt);
  updatePortalParticles(dt);

  renderer.render(scene, camera);

  if (PERF_VISIBLE) stats.end();
}
animate();

let DBG_BASIC_MATS = false;
let DBG_HIDE_TRANSPARENT = false;
let DBG_HIDE_WATER = false;

function setBasicMaterials(root, on) {
  root.traverse(o => {
    if (!o.isMesh) return;
    if (!o.userData._origMat) o.userData._origMat = o.material;

    if (on) {
      const mats = Array.isArray(o.userData._origMat) ? o.userData._origMat : [o.userData._origMat];
      o.material = mats.map(m => new THREE.MeshBasicMaterial({
        map: m?.map || null,
        color: (m?.color ? m.color.clone() : new THREE.Color(0xffffff)),
      }));
      if (!Array.isArray(o.userData._origMat)) o.material = o.material[0];
    } else {
      o.material = o.userData._origMat;
    }
  });
}

function applyDebugVisibility(root) {
  root.traverse(o => {
    if (!o.isMesh) return;

    // hide transparent test
    if (DBG_HIDE_TRANSPARENT) {
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      const isTransp = mats.some(m => m && (m.transparent || (m.opacity ?? 1) < 0.999 || (m.alphaTest ?? 0) > 0));
      o.visible = !isTransp;
      return;
    }

    // hide water test
    if (DBG_HIDE_WATER) {
      o.visible = !isLikelyWaterMesh(o) && !meshUsesWhitelistedWaterMaterial(o);
      return;
    }

    o.visible = true;
  });
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'F7' && mapGroup.children[0]) {
    DBG_BASIC_MATS = !DBG_BASIC_MATS;
    setBasicMaterials(mapGroup.children[0], DBG_BASIC_MATS);
    console.log('[DBG] basic materials:', DBG_BASIC_MATS);
  }
  if (e.code === 'F8' && mapGroup.children[0]) {
    DBG_HIDE_TRANSPARENT = !DBG_HIDE_TRANSPARENT;
    DBG_HIDE_WATER = false;
    applyDebugVisibility(mapGroup.children[0]);
    console.log('[DBG] hide transparent:', DBG_HIDE_TRANSPARENT);
  }
  if (e.code === 'F9' && mapGroup.children[0]) {
    DBG_HIDE_WATER = !DBG_HIDE_WATER;
    DBG_HIDE_TRANSPARENT = false;
    applyDebugVisibility(mapGroup.children[0]);
    console.log('[DBG] hide water:', DBG_HIDE_WATER);
  }
});
