import Stats from 'three/addons/libs/stats.module.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

let MODEL_URL = '';
const ORB_PORTAL_MAX = 193;
const ORB_RADIUS = 0.6;
// Exposure profiles
const EXPOSURE_NO_GLB_LIGHTS = 0.2;
const EXPOSURE_GLB_LIGHTS    = 0.2;

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

if (!(canvas instanceof HTMLCanvasElement)) throw new Error('mapCanvas not found');
canvas.tabIndex = 0;

/* ============================================================================
  Config
============================================================================ */
const mapSelect = document.getElementById('mapSelect');
const MAPS_CONFIG_URL = '/maps/editor_maps.json';

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

// (optionnel) évite de leak GPU si tu switches souvent
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
  if (ent?.type === 'checkpoints') {
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

function mergeOpaqueStaticByMaterial(root) {
  root.updateWorldMatrix(true, true);

  const buckets = new Map(); // mat.uuid -> { mat, meshes: [], geoms: [] }

  root.traverse((o) => {
    if (!o.isMesh) return;
    if (!o.visible) return;
    if (o.name === 'COLLIDER') return;
    if (o.isSkinnedMesh) return;
    if (!o.geometry?.isBufferGeometry) return;

    const mat = o.material;
    if (!mat || Array.isArray(mat)) return;      // skip multi-material meshes
    if (mat.transparent) return;                 // skip transparent (water etc.)

    // (optionnel) skip "water-like" by name
    const n = (o.name || '').toLowerCase();
    if (n.includes('water')) return;

    const key = mat.uuid;
    if (!buckets.has(key)) buckets.set(key, { mat, meshes: [], geoms: [] });

    // clone geometry into world space so we can merge
    const g = o.geometry.clone();
    g.applyMatrix4(o.matrixWorld);

    buckets.get(key).meshes.push(o);
    buckets.get(key).geoms.push(g);
  });

  const mergedGroup = new THREE.Group();
  mergedGroup.name = '__MERGED_OPAQUE__';

  for (const { mat, meshes, geoms } of buckets.values()) {
    if (meshes.length < 2) continue; // not worth it

    const merged = mergeGeometries(geoms, false);
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
    `RMB (hold) · Look`,
    `ZQSD · Move`,
    `Space · Up`,
    `Ctrl · Down`,
    `V · Speed`,
    `A · Toggle Add`,
    `Del · Delete Selected`,
    `[ / ] · Active CP (or link CP when selected)`,
  ];

  const extra = [];
  if (mode.id === 'checkpoints') {
    extra.push(`LMB · Select a checkpoint`);
    extra.push(`Add ON + LMB on map · Place checkpoint`);
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
  btnFullscreen.innerHTML = isFullscreen()
    ? `<span class="inline-block h-2 w-2 rounded-full bg-emerald-300/90"></span> EXIT <span class="text-white/50 font-semibold">(F)</span>`
    : `<span class="inline-block h-2 w-2 rounded-full bg-sky-300/80"></span> FULLSCREEN <span class="text-white/50 font-semibold">(F)</span>`;
}

btnFullscreen?.addEventListener('click', () => toggleFullscreen());
document.addEventListener('fullscreenchange', () => {
  syncFullscreenUi();
  // force a resize so Three updates correctly
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

let selected = null; // marker group
let selectedData = null; // entity object
let selectedGizmoTarget = null;

let entities = []; // { type, index, ..., marker }
let importedSkillBans = { SHIFT: [], Dao: [] };

btnAdd?.addEventListener('click', () => toggleAddMode());
btnExport?.addEventListener('click', () => exportJSON());
btnImport?.addEventListener('click', () => openImportModal());

viewAllBtn?.addEventListener('click', () => setViewType('all'));
viewOnlyBtn?.addEventListener('click', () => setViewType('only'));

checkpointSelect?.addEventListener('change', (e) => {
  const v = parseInt(e.target?.value || '0', 10);
  setActiveCheckpoint(v, { selectMarker: getMode().id === 'checkpoints' });
});

cpPrev?.addEventListener('click', () => setActiveCheckpoint(activeCheckpoint - 1, { selectMarker: getMode().id === 'checkpoints' }));
cpNext?.addEventListener('click', () => setActiveCheckpoint(activeCheckpoint + 1, { selectMarker: getMode().id === 'checkpoints' }));

function toggleAddMode() {
  addMode = !addMode;
  if (btnAdd) {
    btnAdd.textContent = addMode ? 'Add: ON (A)' : 'Add checkpoint (A)';
    btnAdd.classList.toggle('bg-emerald-500/20', addMode);
    btnAdd.classList.toggle('border-emerald-400/30', addMode);
  }
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
    const ws = selectedData.pos; // Workshop coords
    hudDataBody.innerHTML = `
      <div class="text-white/90 font-semibold">SELECTED CHECKPOINT</div>
      <div class="mt-2 text-white/75 text-sm">
        INDEX: <b class="text-white/90">${selectedData.index}</b><br/>
        VECTOR: <b class="text-white/90">${fmtWsVec(ws)}</b>
      </div>
    `;
    return;
  }

  if (mode.id === 'boundarySpheres') {
    setBadge('SELECTED BOUNDARY SPHERE');
    const ws = selectedData.pos;
    hudDataBody.innerHTML = `
      <div class="text-white/90 font-semibold">SELECTED BOUNDARY SPHERE</div>
      <div class="mt-2 text-white/75 text-sm">
        VECTOR: <b class="text-white/90">${fmtWsVec(ws)}</b><br/>
        RADIUS: <b class="text-white/90">${fmt(selectedData.radius ?? 5)}</b><br/>
        <span class="text-white/60">LSHIFT + C / C to resize</span>
      </div>
    `;
    return;
  }

  if (mode.id === 'functionOrbs') {
    setBadge('SELECTED BOUNCE ORB');
    const ws = selectedData.pos;
    hudDataBody.innerHTML = `
      <div class="text-white/90 font-semibold">SELECTED BOUNCE ORB</div>
      <div class="mt-2 text-white/75 text-sm">
        VECTOR: <b class="text-white/90">${fmtWsVec(ws)}</b><br/>
        STRENGTH: <b class="text-white/90">${fmt(selectedData.strength ?? 10)}</b><br/>
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
}

function updateCheckpointSelectUI() {
  if (!checkpointSelect) return;

  const n = countByType('checkpoints');
  if (!n) {
    checkpointSelect.innerHTML = `<option value="0">CP 0</option>`;
    checkpointSelect.value = '0';
    checkpointSelect.disabled = true;
    if (cpPrev) cpPrev.disabled = true;
    if (cpNext) cpNext.disabled = true;
    return;
  }

  checkpointSelect.disabled = false;
  if (cpPrev) cpPrev.disabled = false;
  if (cpNext) cpNext.disabled = false;

  checkpointSelect.innerHTML = Array.from({ length: n }, (_, i) =>
    `<option value="${i}">CP ${i}</option>`
  ).join('');

  activeCheckpoint = clampCpIndex(activeCheckpoint);
  checkpointSelect.value = String(activeCheckpoint);
}

function applyViewVisibility() {
  for (const ent of entities) {
    if (!ent?.marker) continue;

    let visible = true;
    if (viewType === 'only' && ent.type !== 'checkpoints') {
      visible = getEntCp(ent) === activeCheckpoint;
    }

    ent.marker.visible = visible;
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

function shiftDataAfterCheckpointRemoval(removedIndex) {
  // shift entity.cp
  for (const ent of entities) {
    if (!ent || ent.type === 'checkpoints') continue;
    if (!Number.isFinite(ent.cp)) continue;

    if (ent.cp === removedIndex) ent.cp = Math.max(0, removedIndex - 1);
    else if (ent.cp > removedIndex) ent.cp -= 1;
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

/* ============================================================================
  Export (keep checkpoints only for now)
============================================================================ */
function exportJSON() {
  const checkpoints = entities
    .filter((e) => e.type === 'checkpoints')
    .map((e) => ({ index: e.index, pos: e.pos }));

  const payload = { version: 1, model_url: MODEL_URL, checkpoints };
  const txt = JSON.stringify(payload, null, 2);

  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt).catch(() => {});
  else window.prompt('Copy JSON:', txt);
}

/* ============================================================================
  Hide giant helper planes / bounds
============================================================================ */
function triCount(geom) {
  if (!geom) return 0;
  if (geom.index) return geom.index.count / 3;
  return (geom.attributes?.position?.count || 0) / 3;
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

function fitCameraToBounds(bounds) {
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());

  const maxSize = Math.max(size.x, size.y, size.z) || 500;
  const dist = maxSize * 1.2;

  camera.near = Math.max(0.1, dist / 2000);
  camera.far = Math.max(5000, dist * 50);
  camera.updateProjectionMatrix();

  camera.position.copy(center).add(new THREE.Vector3(dist, dist * 0.55, dist));
  camera.lookAt(center);
  syncYawPitchFromCamera();

  moveBaseSpeed = Math.max(80, maxSize / 6);

  const outer = THREE.MathUtils.clamp(maxSize / 2500, 0.45, 1.15);
  cpOuterRadius = outer;
  cpInnerRadius = outer * 0.80;
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

const speedMults = [0.05, 0.1, 1, 5];
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
  if (getMode().id === 'functionOrbs' && selectedData?.type === 'functionOrbs') {
    if (e.code === 'Digit1') { selectedData.ult = !selectedData.ult; updateHudAll(); return; }
    if (e.code === 'Digit2') { selectedData.dash = !selectedData.dash; updateHudAll(); return; }
    if (e.code === 'Digit3') { selectedData.lock = !selectedData.lock; updateHudAll(); return; }
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

  if ((e.key || '').toLowerCase() === 'a') { toggleAddMode(); return; }

  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    keys.lshift = true;
    keys.boost = true;
  }

  // C / Shift+C : resize boundary sphere (and orb strength) on selected element
  if (e.code === 'KeyC' && selectedData && selectedData.type === getMode().id) {
    const dir = e.shiftKey ? -1 : +1;

    if (selectedData.type === 'boundarySpheres') {
      const step = 1;
      selectedData.radius = THREE.MathUtils.clamp((selectedData.radius ?? 5) + dir * step, 0.5, 2000);
      rebuildBoundarySphere(selected, selectedData.radius);
      updateHudAll();
      return;
    }

    if (selectedData.type === 'functionOrbs') {
      const step = 1;
      selectedData.strength = THREE.MathUtils.clamp((selectedData.strength ?? 10) + dir * step, 0, 999);
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
    markersGroup.remove(selected);
    gizmo.detach();
    selected = null;
    selectedData = null;

    if (ent) {
      if (ent.type === 'portals') removeAnimatedPortalsInside(ent.marker);

      const removedType = ent.type;
      const removedIndex = ent.index;

      entities = entities.filter((x) => x !== ent);

      if (removedType === 'checkpoints') {
        reindexType('checkpoints');
        shiftDataAfterCheckpointRemoval(removedIndex);
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
  if (e.code === 'F6') { setPerfVisible(!PERF_VISIBLE); return; }

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

  // Forward on XZ plane
  camera.getWorldDirection(_fwd);
  _fwd.y = 0;
  const fLen = _fwd.length();
  if (fLen > 1e-6) _fwd.multiplyScalar(1 / fLen);
  else _fwd.set(0, 0, -1);

  // Right on XZ plane
  _right.set(1, 0, 0).applyQuaternion(camera.quaternion);
  _right.y = 0;
  const rLen = _right.length();
  if (rLen > 1e-6) _right.multiplyScalar(1 / rLen);
  else _right.set(1, 0, 0);

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

function makeCheckpointMarker(index, hitPoint) {
  const gCore = new THREE.RingGeometry(cpInnerRadius, cpOuterRadius, 80);
  gCore.rotateX(-Math.PI / 2);
  const gGlow = new THREE.RingGeometry(cpOuterRadius * 0.92, cpOuterRadius * 1.18, 80);
  gGlow.rotateX(-Math.PI / 2);

  const core = new THREE.Mesh(gCore, CP_MAT_CORE);
  const glow = new THREE.Mesh(gGlow, CP_MAT_GLOW);

  const group = new THREE.Group();
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

function makeBoundarySphereMarker(radius = 5) {
  const group = new THREE.Group();

  const geo = new THREE.SphereGeometry(radius, 24, 18);
  const fill = new THREE.Mesh(geo, BS_MAT_FILL);
  group.add(fill);

  const wireGeo = new THREE.WireframeGeometry(geo);
  const wire = new THREE.LineSegments(wireGeo, BS_MAT_WIRE);
  wire.renderOrder = 2;
  group.add(wire);

  group.userData._bs = { fill, wire };
  group.add(makeHitSphere(Math.max(1, radius * 1.05), group));
  return group;
}

function rebuildBoundarySphere(group, radius) {
  if (!group?.userData?._bs) return;
  const { fill, wire } = group.userData._bs;

  const newGeo = new THREE.SphereGeometry(radius, 24, 18);
  fill.geometry.dispose();
  fill.geometry = newGeo;

  wire.geometry.dispose();
  wire.geometry = new THREE.WireframeGeometry(newGeo);

  // refresh hit sphere
  const hits = [];
  group.traverse((o) => { if (o.isMesh && o.userData?.isHit) hits.push(o); });
  for (const h of hits) {
    group.remove(h);
    h.geometry?.dispose?.();
    h.material?.dispose?.();
  }
  group.add(makeHitSphere(Math.max(1, radius * 1.05), group));
}

function makeFunctionOrbMarker(radius = 2.6) {
  const group = new THREE.Group();

  const geo = new THREE.SphereGeometry(radius, 28, 20);
  const core = new THREE.Mesh(geo, ORB_MAT_CORE);
  group.add(core);

  const glowGeo = new THREE.SphereGeometry(radius * 1.35, 24, 18);
  const glow = new THREE.Mesh(glowGeo, ORB_MAT_GLOW);
  group.add(glow);

  group.add(makeHitSphere(radius * 1.3, group));
  return group;
}

// Portals: start ring + end particles
const animatedPortals = new Set();

function makePortalStartMarker(surfaceNormal) {
  const outer = cpOuterRadius * 1.15;
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
  group.add(makeHitDisk(outer * 1.15, group, false));
  return group;
}

function makePortalEndParticles() {
  const group = new THREE.Group();

  const count = 120;
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  const base = [];

  for (let i = 0; i < count; i++) {
    const r = Math.random() * 0.8;
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
    size: 0.18,
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
  group.add(makeHitSphere(1.2, group));

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
    const marker = makeCheckpointMarker(index, h.point);

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
    
    setSelected(portalGroup, ent, endFx);
    portalGroup.userData.entity = ent;
    entities.push(ent);

    portalDraft = null;

    setSelected(portalGroup, ent);
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
  ent.pos = [ws.x, ws.y, ws.z];
  updateHudAll();
});

/* ============================================================================
  Import Workshop Data
============================================================================ */
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

  clearAllEntities();

  // Checkpoints
  const cpBlock = extractArrayBlock(text, 'A');
  const checkpoints = parseVectorArray(cpBlock);

  for (let i = 0; i < checkpoints.length; i++) {
    const v = checkpoints[i]; // Workshop
    const ws = new THREE.Vector3(v[0], v[1], v[2]);
    const ed = wsToEditor(ws);

    const marker = makeCheckpointMarker(i, ed);

    const ent = {
      type: 'checkpoints',
      index: i,
      pos: [v[0], v[1], v[2]],
      marker,
    };
    marker.userData.entity = ent;

    markersGroup.add(marker);
    entities.push(ent);
  }

  // Killballs -> boundary spheres (H positions, I radius)
  const killPos = parseVectorArray(extractArrayBlock(text, 'H'));
  const killRad = parseNumberArray(extractArrayBlock(text, 'I'));

  for (let i = 0; i < killPos.length; i++) {
    const p = killPos[i]; // Workshop
    const radius = Number.isFinite(killRad[i]) ? killRad[i] : (killRad[0] ?? 5);

    const ws = new THREE.Vector3(p[0], p[1], p[2]);
    const ed = wsToEditor(ws);

    const marker = makeBoundarySphereMarker(radius);
    marker.position.copy(ed);

    const ent = {
      type: 'boundarySpheres',
      index: i,
      pos: [p[0], p[1], p[2]],
      radius,
      cp: 0,
      marker,
    };
    marker.userData.entity = ent;

    markersGroup.add(marker);
    entities.push(ent);
  }

  // Orbs -> functionOrbs (TQ positions)
  const orbPos = parseVectorArray(extractArrayBlock(text, 'TQ'));
  const orbCp = parseNumberArray(extractArrayBlock(text, 'pinballnumber'));
  const orbStrength = parseNumberArray(extractArrayBlock(text, 'EditMode'));
  const orbUlt = parseBoolArray(extractArrayBlock(text, 'TQ5'));
  const orbDash = parseBoolArray(extractArrayBlock(text, 'TQ6'));
  const orbLock = parseBoolArray(extractArrayBlock(text, 'BounceToggleLock'));

  for (let i = 0; i < orbPos.length; i++) {
    const p = orbPos[i]; // Workshop

    const ws = new THREE.Vector3(p[0], p[1], p[2]);
    const ed = wsToEditor(ws);

    const marker = makeFunctionOrbMarker(ORB_RADIUS);
    marker.position.copy(ed);

    const ent = {
      type: 'functionOrbs',
      index: i,
      pos: [p[0], p[1], p[2]],
      cp: Number.isFinite(orbCp[i]) ? orbCp[i] : 0,
      strength: Number.isFinite(orbStrength[i]) ? orbStrength[i] : 10,
      ult: !!orbUlt[i],
      dash: !!orbDash[i],
      lock: !!orbLock[i],
      marker,
    };
    marker.userData.entity = ent;

    markersGroup.add(marker);
    entities.push(ent);
  }

  // Skill bans (HUD only)
  importedSkillBans = {
    SHIFT: parseNumberArray(extractArrayBlock(text, 'SHIFT')),
    Dao: parseNumberArray(extractArrayBlock(text, 'Dao')),
  };

  // after import: keep current mode, refresh HUD
  updateHudAll();
  setActiveCheckpoint(0);
  applyViewVisibility();
}

/* ============================================================================
  Load GLB + Maps config
============================================================================ */
const loader = new GLTFLoader();
let loadToken = 0;

function loadGltf(url) {
  if (typeof loader.loadAsync === 'function') {
    return loader.loadAsync(url);
  }
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
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

  // Load GLB
  const gltf = await loadGltf(MODEL_URL);
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
  debugHiddenHugeThin(root);
  forceWaterRenderSettings(root);
  debugWater(root);
  mapGroup.add(root);
  mergeOpaqueStaticByMaterial(root);
  freezeStaticTransforms(root);
  const found = root.getObjectByName('COLLIDER');
  collider = found || root;
  if (found) found.visible = false;

  const bounds = computeVisibleBounds(root);
  const lightReport = collectGlbLights(root);
  const debugLight = disableNonDirectionalLights(root);
  console.log('[3D EDITOR] GLB lights found:', lightReport);
  applyLightingProfile({ lightReport, root, bounds });
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

  setMode(0);
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
