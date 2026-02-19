import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { buildCards3D } from "./cards3d.js";

const LOG = "[lootbox3d]";

/**
 * Timings inspirés scene.py (Blender)
 */
const PY = {
  FPS: 30,
  F_START: 1,
  F_ANTIC: 26,
  F_SNAP_OPEN: 36,
  F_OVERS: 40,
  F_SETTLE: 42,
  LID_DELAY_FRAMES: 3,
  D_EXPLODE_AFTER_LID_POP: 8,

  D_CARDS_AFTER_EXPLODE: 36,
  D_END_AFTER_CARDS: 72,

  HINGE_TILT_DEG: 26.0,
  HINGE_ANTIC_DEG: -5.0,
  HINGE_OVERS_DEG: 34.0,
  HINGE_SETTLE_DEG: 26.0,

  LID_BLAST_ENABLE: true,
  LID_BLAST_UP: 2.35,
  LID_BLAST_FORWARD: 0.55,
  LID_BLAST_SPIN_X_DEG: 220,
  LID_BLAST_SPIN_Y_DEG: 40,
  LID_BLAST_SPIN_Z_DEG: 85,
  LID_BLAST_APEX_S: 0.26,
  LID_BLAST_LAND_S: 0.78,

  CRACK_ENABLE: true,
  CRACK_RING_R: 0.34,
  CRACK_RING_W: 0.06,
  CRACK_ALPHA: 0.65,
  CRACK_FADE_IN_S: 0.08,
  CRACK_FADE_OUT_S: 1.10,

  DUST_ENABLE: true,
  DUST_PUFF_COUNT: 2,
  DUST_MIN_SCALE: 0.55,
  DUST_MAX_SCALE: 1.35,
  DUST_RISE: 0.16,
  DUST_LIFE_S: 0.80,

  SMOKE_DENSITY_BASE: 0.085,
  ATMOS_DENSITY: 0.010,

  FLOOR_CABLE_COUNT: 18,
  FLOOR_CABLE_Z: 0.01,
  FLOOR_CABLE_RADIUS: 0.025,
  FLOOR_CABLE_BOUNDS_X: [-5.0, 5.0],
  FLOOR_CABLE_BOUNDS_Y: [-5.0, 5.0],
  FLOOR_CABLE_MIN_LEN: 1.8,
  FLOOR_CABLE_MAX_LEN: 5.6,
  FLOOR_CABLE_SEGMENTS: 64,
  FLOOR_CABLE_EXCLUSION_R: 1.25,

  FLOOR_CABLE_BREATH_PERIOD_FRAMES: 34.0,
  FLOOR_CABLE_BREATH_GAMMA: 4.6,
  FLOOR_CABLE_BREATH_STRENGTH: 0.78,

  FLOOR_CABLE_RUN_PERIOD_S: 1.10,
  FLOOR_CABLE_RUN_WIDTH: 0.12,
  FLOOR_CABLE_RUN_STRENGTH: 1.35,
  FLOOR_CABLE_SHARPNESS: 22.0,

  BOX_SHAKE_ENABLE: true,
  BOX_SHAKE_DURATION_S: 0.22,
  BOX_SHAKE_LOC: 0.028,
  BOX_SHAKE_ROT_DEG: 1.8,
  BOX_SHAKE_SEED: 1234,
  BOX_SHAKE_Z_FACTOR: 0.0,
  BOX_SHAKE_STEP: 2,

  preferChestRootName: "GP_BoxRoot",
  lidPivotName: "Lid_Pivot",
  hingePivotPrefix: "GP_HingePivot",
};

const HINGE_OVERRIDES = {
  GP_HingePivot_Xneg: { axis: "z", sign: 1, mul: 0.95, offsetDeg: -1.5 },
  GP_HingePivot_Xpos: { axis: "z", sign: -1, mul: 1.1, offsetDeg: 2.5 },
  GP_HingePivot_Yneg: { axis: "x", sign: 1, mul: 0.9, offsetDeg: -1.0 },
  GP_HingePivot_Ypos: { axis: "x", sign: -1, mul: 1.15, offsetDeg: 4.0 },
};

const CFG = {
  camYawDeg: 45,
  camPitchDeg: 16,
  camMargin: 1.22,

  cardsTargetYMul: 0.3,
  cardsCamPosYOffsetMul: -0.5,
  cardsFov: 28,
  cardsDistanceMul: 0.76,

  bg: 0x2b2b2f,
  exposure: 0.3,
  pixelRatioCap: 2,
  allowUserOrbit: false,

  outlierMul: 25,
  absoluteMaxSide: 2000,
  recenterToOrigin: true,

  normalizeScale: true,
  normalizeTargetU: 1.55,
  normalizeMinU: 0.35,
  normalizeMaxU: 6.0,

  minNear: 0.01,
  nearFromDistanceMul: 0.01,
  farFromDistanceMul: 260,
  farMin: 400,

  flashIntensityPeak: 220,
  flashDecayS: 0.32,

  glowBurstS: 0.95,
  coreBurstS: 0.75,
  shockwaveS: 1.05,
  burstSphereS: 0.7,

  sparksCount: 64,
  debrisCount: 40,
  streakCount: 18,

  //reopen
  reopenCloseDurMs: 520,
  reopenDropHeightMul: 6.0,
  reopenDropDurMs: 920,
  reopenSettleHoldMs: 140,
};

function _findByName(root, name) {
  let hit = null;
  root.traverse((o) => {
    if (hit) return;
    if (o.name === name) hit = o;
  });
  return hit;
}

function _findMany(root, predicate) {
  const out = [];
  root.traverse((o) => {
    try {
      if (predicate(o)) out.push(o);
    } catch {}
  });
  return out;
}

function _isDescendantOf(obj, parent) {
  let cur = obj;
  while (cur) {
    if (cur === parent) return true;
    cur = cur.parent;
  }
  return false;
}

function _setRendererColorSpace(renderer) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
}

function _applyEnvMapIntensity(root, v = 0.35) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of mats) {
      if (!m) continue;
      if ("envMapIntensity" in m) m.envMapIntensity = v;
      m.needsUpdate = true;
    }
  });
}

function _fixMaterialColorSpaces(obj3d) {
  obj3d.traverse((o) => {
    if (!o.isMesh) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];

    for (const m of mats) {
      if (!m) continue;

      if (m.map) {
        m.map.colorSpace = THREE.SRGBColorSpace;
        m.map.needsUpdate = true;
      }
      if (m.emissiveMap) {
        m.emissiveMap.colorSpace = THREE.SRGBColorSpace;
        m.emissiveMap.needsUpdate = true;
      }

      const dataMaps = ["normalMap", "metalnessMap", "roughnessMap", "aoMap"];
      for (const k of dataMaps) {
        const t = m[k];
        if (!t) continue;
        t.colorSpace = THREE.NoColorSpace;
        t.needsUpdate = true;
      }

      if ("envMapIntensity" in m && (m.envMapIntensity == null || Number.isNaN(m.envMapIntensity))) {
        m.envMapIntensity = 1.0;
      }
      m.needsUpdate = true;
    }
  });
}

function _ensureShadows(root) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.receiveShadow = true;
  });
}

function _robustBoundingBox(root) {
  const boxes = [];
  const tmpBox = new THREE.Box3();
  const tmpSize = new THREE.Vector3();

  root.updateWorldMatrix(true, true);

  root.traverse((o) => {
    if (!o.isMesh || !o.geometry) return;
    if (o.visible === false) return;

    tmpBox.setFromObject(o);
    tmpBox.getSize(tmpSize);

    if (!Number.isFinite(tmpSize.x) || !Number.isFinite(tmpSize.y) || !Number.isFinite(tmpSize.z)) return;

    const maxSide = Math.max(tmpSize.x, tmpSize.y, tmpSize.z);
    if (maxSide <= 0) return;
    if (maxSide > CFG.absoluteMaxSide) return;

    boxes.push({ box: tmpBox.clone(), maxSide, name: o.name || "(mesh)" });
  });

  if (!boxes.length) {
    const fallback = new THREE.Box3(new THREE.Vector3(-0.5, -0.5, -0.5), new THREE.Vector3(0.5, 0.5, 0.5));
    return { box: fallback };
  }

  const sides = boxes.map((b) => b.maxSide).sort((a, b) => a - b);
  const median = sides[Math.floor(sides.length / 2)] || sides[0];
  const threshold = median * CFG.outlierMul;

  const kept = [];
  for (const b of boxes) {
    if (b.maxSide <= threshold) kept.push(b);
  }
  const final = kept.length ? kept : boxes;

  const merged = new THREE.Box3();
  merged.makeEmpty();
  for (const b of final) merged.union(b.box);

  return { box: merged };
}

function _mountCanvas(mountEl) {
  mountEl.innerHTML = "";
  mountEl.style.display = "block";

  const holder = document.createElement("div");
  holder.className =
    "relative w-full max-w-[980px] mx-auto overflow-hidden rounded-2xl " + "border border-white/10 bg-zinc-900/30 shadow-2xl";
  holder.style.height = "320px";

  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";

  holder.appendChild(canvas);
  mountEl.appendChild(holder);

  return { holder, canvas };
}

function _resizeRendererToDisplaySize(renderer, camera, holder) {
  const w = Math.max(2, Math.floor(holder.clientWidth));
  const h = Math.max(2, Math.floor(holder.clientHeight));

  const pr = Math.min(window.devicePixelRatio || 1, CFG.pixelRatioCap);
  renderer.setPixelRatio(pr);
  renderer.setSize(w, h, false);

  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  return { w, h, pr };
}

function _makeLoader() {
  const loader = new GLTFLoader();
  try {
    const draco = new DRACOLoader();
    loader.setDRACOLoader(draco);
  } catch {}
  return loader;
}

function _rgbaToColor(rgbTuple) {
  if (!rgbTuple || rgbTuple.length < 3) return new THREE.Color(1, 1, 1);
  return new THREE.Color(rgbTuple[0], rgbTuple[1], rgbTuple[2]);
}

function _makeRadialTexture(size = 128, inner = 0.08, outer = 0.9) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");

  const g = ctx.createRadialGradient(size * 0.5, size * 0.5, size * inner, size * 0.5, size * 0.5, size * outer);
  g.addColorStop(0.0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.85)");
  g.addColorStop(1.0, "rgba(255,255,255,0)");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

function _makeStreakTexture(size = 256) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");

  ctx.clearRect(0, 0, size, size);
  const y = size * 0.5;
  const h = size * 0.12;

  const g = ctx.createLinearGradient(0, 0, size, 0);
  g.addColorStop(0.0, "rgba(255,255,255,0)");
  g.addColorStop(0.18, "rgba(255,255,255,0.35)");
  g.addColorStop(0.5, "rgba(255,255,255,1)");
  g.addColorStop(0.82, "rgba(255,255,255,0.35)");
  g.addColorStop(1.0, "rgba(255,255,255,0)");

  ctx.fillStyle = g;
  ctx.fillRect(0, y - h * 0.5, size, h);

  const g2 = ctx.createRadialGradient(size * 0.5, y, 0, size * 0.5, y, size * 0.25);
  g2.addColorStop(0.0, "rgba(255,255,255,0.55)");
  g2.addColorStop(1.0, "rgba(255,255,255,0)");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

function _makeCrackTexture(size = 256) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, size, size);

  const cx = size * 0.5;
  const cy = size * 0.5;
  const r0 = size * 0.22;
  const r1 = size * 0.48;

  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  const lines = 60;
  for (let i = 0; i < lines; i++) {
    const a = Math.random() * Math.PI * 2;
    const a2 = a + (Math.random() * 0.8 - 0.4);
    const rr0 = r0 + Math.random() * (r1 - r0) * 0.25;
    const rr1 = r0 + Math.random() * (r1 - r0);

    const x0 = cx + Math.cos(a) * rr0;
    const y0 = cy + Math.sin(a) * rr0;
    const x1 = cx + Math.cos(a2) * rr1;
    const y1 = cy + Math.sin(a2) * rr1;

    ctx.beginPath();
    ctx.moveTo(x0, y0);

    const steps = 3 + Math.floor(Math.random() * 4);
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const x = THREE.MathUtils.lerp(x0, x1, t) + (Math.random() - 0.5) * 10;
      const y = THREE.MathUtils.lerp(y0, y1, t) + (Math.random() - 0.5) * 10;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const rr = Math.sqrt(dx * dx + dy * dy);

      const inRing = rr >= r0 && rr <= r1;
      const idx = (y * size + x) * 4;

      if (!inRing) {
        d[idx + 3] = 0;
      } else {
        const edge = Math.min(rr - r0, r1 - rr);
        const edgeA = THREE.MathUtils.clamp(edge / (size * 0.03), 0, 1);
        d[idx + 3] = Math.floor(d[idx + 3] * edgeA);
      }
    }
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

function _applyLights(scene) {
  const hemi = new THREE.HemisphereLight(0xbad7ff, 0x0b0c0f, 0.55);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(3.5, 5.2, 4.0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.00008;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x8fd2ff, 0.55);
  fill.position.set(-4.5, 2.0, 3.0);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xb8ffcc, 0.28);
  rim.position.set(-2.5, 4.0, -4.5);
  scene.add(rim);

  const neon1 = new THREE.PointLight(0x46ff7a, 1.6, 12);
  neon1.position.set(1.4, 0.6, 1.2);
  scene.add(neon1);

  const neon2 = new THREE.PointLight(0x46ff7a, 1.3, 12);
  neon2.position.set(-1.2, 0.6, -1.1);
  scene.add(neon2);

  return { hemi, key, fill, rim, neon1, neon2 };
}

function _makeGround(scene, chestBox) {
  const size = new THREE.Vector3();
  chestBox.getSize(size);
  const maxSize = Math.max(size.x, size.y, size.z, 1);
  const planeSize = Math.max(12, maxSize * 10);

  const geo = new THREE.PlaneGeometry(planeSize, planeSize, 1, 1);
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.018, 0.018, 0.02),
    roughness: 0.9,
    metalness: 0.06,
  });

  const ground = new THREE.Mesh(geo, mat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  return ground;
}

function _buildAtmosphere(scene) {
  scene.fog = new THREE.FogExp2(0x0b0c0f, THREE.MathUtils.clamp(PY.ATMOS_DENSITY * 0.9, 0.001, 0.06));
}

function _buildFloorCables(scene, chestBox, groundY = 0) {
  const group = new THREE.Group();
  group.name = "GP_FloorCables";
  scene.add(group);

  const center = new THREE.Vector3();
  chestBox.getCenter(center);

  const baseY = Number.isFinite(groundY) ? groundY : 0;

  const cableMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPhase: { value: 0 },
      uBreathPeriod: { value: PY.FLOOR_CABLE_BREATH_PERIOD_FRAMES / PY.FPS },
      uBreathGamma: { value: PY.FLOOR_CABLE_BREATH_GAMMA },
      uBreathStrength: { value: PY.FLOOR_CABLE_BREATH_STRENGTH },
      uRunPeriod: { value: PY.FLOOR_CABLE_RUN_PERIOD_S },
      uRunWidth: { value: PY.FLOOR_CABLE_RUN_WIDTH },
      uRunStrength: { value: PY.FLOOR_CABLE_RUN_STRENGTH },
      uSharpness: { value: PY.FLOOR_CABLE_SHARPNESS },
      uBase: { value: 0.18 },
      uColor: { value: new THREE.Color(0.1, 1.0, 0.45) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uPhase;
      uniform float uBreathPeriod;
      uniform float uBreathGamma;
      uniform float uBreathStrength;

      uniform float uRunPeriod;
      uniform float uRunWidth;
      uniform float uRunStrength;
      uniform float uSharpness;

      uniform float uBase;
      uniform vec3  uColor;

      float sat(float x){ return clamp(x, 0.0, 1.0); }
      float smoothPulse(float x, float w){
        float d = abs(x - 0.5);
        float t = sat(1.0 - d / max(w, 1e-3));
        return pow(t, uSharpness);
      }

      void main(){
        float t = uTime + uPhase;

        float b = sin(6.2831853 * (t / max(uBreathPeriod, 1e-3)));
        b = (b * 0.5 + 0.5);
        b = pow(b, uBreathGamma) * uBreathStrength;

        float run = fract(vUv.x - t / max(uRunPeriod, 1e-3));
        float rp = smoothPulse(run, uRunWidth) * uRunStrength;

        float glow = uBase + b + rp;
        vec3 col = uColor * glow;

        float alpha = sat(glow * 0.65);
        gl_FragColor = vec4(col, alpha);
      }
    `,
  });

  function randBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  const cables = [];
  for (let i = 0; i < PY.FLOOR_CABLE_COUNT; i++) {
    let mx = 0,
      my = 0;
    for (let tries = 0; tries < 40; tries++) {
      mx = randBetween(PY.FLOOR_CABLE_BOUNDS_X[0], PY.FLOOR_CABLE_BOUNDS_X[1]);
      my = randBetween(PY.FLOOR_CABLE_BOUNDS_Y[0], PY.FLOOR_CABLE_BOUNDS_Y[1]);
      const dx = mx - center.x;
      const dy = my - center.z;
      if (Math.sqrt(dx * dx + dy * dy) > PY.FLOOR_CABLE_EXCLUSION_R) break;
    }

    const len = randBetween(PY.FLOOR_CABLE_MIN_LEN, PY.FLOOR_CABLE_MAX_LEN);
    const a = Math.random() * Math.PI * 2;
    const dx = Math.cos(a) * len * 0.5;
    const dz = Math.sin(a) * len * 0.5;

    const y = baseY + PY.FLOOR_CABLE_Z;

    const p0 = new THREE.Vector3(mx - dx, y, my - dz);
    const p3 = new THREE.Vector3(mx + dx, y, my + dz);

    const bend = len * randBetween(0.08, 0.16);
    const n = new THREE.Vector3(-dz, 0, dx).normalize();
    const p1 = p0.clone().lerp(p3, 0.33).addScaledVector(n, bend * (Math.random() < 0.5 ? -1 : 1));
    const p2 = p0.clone().lerp(p3, 0.66).addScaledVector(n, bend * (Math.random() < 0.5 ? -1 : 1));

    const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3], false, "catmullrom", 0.5);
    const geo = new THREE.TubeGeometry(curve, PY.FLOOR_CABLE_SEGMENTS, PY.FLOOR_CABLE_RADIUS, 8, false);

    const m = cableMat.clone();
    m.uniforms = THREE.UniformsUtils.clone(cableMat.uniforms);
    m.uniforms.uPhase.value = Math.random() * 10;

    const mesh = new THREE.Mesh(geo, m);
    group.add(mesh);
    cables.push(mesh);
  }

  return {
    group,
    cables,
    setTime: (t) => {
      for (const c of cables) {
        if (c.material?.uniforms?.uTime) c.material.uniforms.uTime.value = t;
      }
    },
  };
}

function _buildGroundSmoke(scene, chestBox, groundY = 0) {
  const center = new THREE.Vector3();
  chestBox.getCenter(center);

  const baseY = Number.isFinite(groundY) ? groundY : 0;

  const tex = _makeRadialTexture(128, 0.06, 0.95);

  const count = 54;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 0.65 + Math.random() * 1.9;

    const x = center.x + Math.cos(a) * r;
    const z = center.z + Math.sin(a) * r;
    const y = baseY + 0.02 + Math.random() * 0.12;

    positions[i * 3 + 0] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    scales[i] = 0.45 + Math.random() * 1.2;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

  const mat = new THREE.PointsMaterial({
    map: tex,
    size: 0.8,
    color: _rgbaToColor([0.07, 0.085, 0.09]),
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `
        #include <common>
        attribute float aScale;
      `
      )
      .replace("gl_PointSize = size;", "gl_PointSize = size * aScale;");
  };

  const pts = new THREE.Points(geo, mat);
  pts.name = "GP_GroundSmoke";
  pts.frustumCulled = false;
  pts.visible = false;
  scene.add(pts);

  return { pts, material: mat };
}

function _buildExplosionFX(scene) {
  const fx = new THREE.Group();
  fx.name = "GP_ExplosionFX";
  scene.add(fx);

  const flash = new THREE.PointLight(0xb8f7ff, 0, 28);
  flash.name = "GP_Flash";
  fx.add(flash);

  const glowTex = _makeRadialTexture(128, 0.02, 0.95);
  const glowMat = new THREE.MeshBasicMaterial({
    map: glowTex,
    transparent: true,
    opacity: 0,
    color: new THREE.Color(0.46, 1.0, 0.62),
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
    side: THREE.DoubleSide,
  });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowMat);
  glow.name = "GP_GlowBurst";
  glow.visible = false;
  glow.renderOrder = 999;
  fx.add(glow);

  const coreTex = _makeRadialTexture(128, 0.0, 0.55);
  const coreMat = new THREE.MeshBasicMaterial({
    map: coreTex,
    transparent: true,
    opacity: 0,
    color: new THREE.Color(0.9, 1.0, 0.96),
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
    side: THREE.DoubleSide,
  });
  const core = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), coreMat);
  core.name = "GP_CoreBurst";
  core.visible = false;
  core.renderOrder = 1000;
  fx.add(core);

  const ringMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    color: new THREE.Color(0.18, 1.0, 0.55),
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.06, 12, 64), ringMat);
  ring.name = "GP_Shockwave";
  ring.rotation.x = Math.PI / 2;
  ring.visible = false;
  ring.renderOrder = 998;
  fx.add(ring);

  const sphereMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    color: new THREE.Color(0.4, 1.0, 0.7),
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
  });
  const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), sphereMat);
  sphere.name = "GP_BurstSphere";
  sphere.visible = false;
  sphere.renderOrder = 997;
  fx.add(sphere);

  const dustTex = _makeRadialTexture(128, 0.12, 0.95);
  const dusts = [];
  for (let i = 0; i < PY.DUST_PUFF_COUNT; i++) {
    const m = new THREE.MeshBasicMaterial({
      map: dustTex,
      transparent: true,
      opacity: 0,
      color: new THREE.Color(0.08, 0.09, 0.095),
      blending: THREE.NormalBlending,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    const d = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), m);
    d.name = `GP_Dust_${i}`;
    d.rotation.x = -Math.PI / 2;
    d.visible = false;
    d.renderOrder = 996;
    fx.add(d);
    dusts.push(d);
  }

  const crackTex = _makeCrackTexture(256);
  const crackMat = new THREE.MeshBasicMaterial({
    map: crackTex,
    transparent: true,
    opacity: 0,
    color: new THREE.Color(0.08, 0.1, 0.11),
    blending: THREE.NormalBlending,
    depthWrite: false,
    depthTest: false,
    side: THREE.DoubleSide,
  });
  const crack = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), crackMat);
  crack.name = "GP_Cracks";
  crack.rotation.x = -Math.PI / 2;
  crack.visible = false;
  crack.renderOrder = 10;
  fx.add(crack);

  const streakTex = _makeStreakTexture(256);
  const streaks = [];
  for (let i = 0; i < CFG.streakCount; i++) {
    const m = new THREE.MeshBasicMaterial({
      map: streakTex,
      transparent: true,
      opacity: 0,
      color: new THREE.Color(0.72, 1.0, 0.9),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    const s = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), m);
    s.name = `GP_Streak_${i}`;
    s.visible = false;
    s.renderOrder = 995;
    fx.add(s);
    streaks.push(s);
  }

  function makeInstanced(name, geo, color, count, blending = THREE.AdditiveBlending) {
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      blending,
      depthWrite: false,
      depthTest: false,
    });
    const inst = new THREE.InstancedMesh(geo, mat, count);
    inst.name = name;
    inst.visible = false;
    inst.renderOrder = 994;
    fx.add(inst);
    return inst;
  }

  const sparks = makeInstanced("GP_Sparks", new THREE.SphereGeometry(0.035, 10, 10), 0xaaffcc, CFG.sparksCount);
  const debris = makeInstanced("GP_Debris", new THREE.BoxGeometry(0.06, 0.03, 0.03), 0x3a3f46, CFG.debrisCount, THREE.NormalBlending);

  return { fx, flash, glow, core, ring, sphere, dusts, crack, streaks, sparks, debris };
}

function _createTimeline() {
  const fps = PY.FPS;

  const F_HINGE_ANTIC = PY.F_ANTIC - 8;
  const F_HINGE_END = Math.max(F_HINGE_ANTIC, PY.F_ANTIC);

  const F_LID_ANTIC = F_HINGE_END + PY.LID_DELAY_FRAMES;

  const dSnap = PY.F_SNAP_OPEN - PY.F_ANTIC;
  const F_LID_SNAP = F_LID_ANTIC + dSnap;

  const F_EXPLODE = F_LID_SNAP + PY.D_EXPLODE_AFTER_LID_POP;
  const F_CARDS = F_EXPLODE + PY.D_CARDS_AFTER_EXPLODE;
  const F_END = F_CARDS + PY.D_END_AFTER_CARDS;

  const framesToMs = (f) => ((f - PY.F_START) / fps) * 1000;

  return {
    fps,
    framesToMs,
    tExplode: framesToMs(F_EXPLODE),
    tCards: framesToMs(F_CARDS),
    tEnd: framesToMs(F_END),
  };
}

function _easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function _easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
function _easeInCubic(t) {
  return t * t * t;
}
function _seededNoise(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return (s & 0xfffffff) / 0xfffffff;
  };
}
function _clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

// ============================
// Public API
// ============================
export async function createLootbox3D({ mountEl, modelUrl = "/assets/models/gp_static.glb", debug = false } = {}) {
  if (!mountEl) throw new Error(`${LOG} mountEl missing`);

  function _translateWorldY(obj, dyWorld) {
    if (!Number.isFinite(dyWorld) || Math.abs(dyWorld) < 1e-9) return;
    obj.updateWorldMatrix(true, false);
    const wp = new THREE.Vector3();
    obj.getWorldPosition(wp);
    wp.y += dyWorld;

    if (obj.parent) {
      obj.parent.updateWorldMatrix(true, false);
      obj.position.copy(obj.parent.worldToLocal(wp));
    } else {
      obj.position.copy(wp);
    }
    obj.updateWorldMatrix(true, true);
  }

  function _minYExact(root) {
    const tmpBox = new THREE.Box3();
    const tmpSize = new THREE.Vector3();
    let minY = Infinity;

    root.updateWorldMatrix(true, true);

    root.traverse((o) => {
      if (!o.isMesh || !o.geometry) return;
      tmpBox.setFromObject(o);
      tmpBox.getSize(tmpSize);
      if (!Number.isFinite(tmpSize.x) || !Number.isFinite(tmpSize.y) || !Number.isFinite(tmpSize.z)) return;

      const maxSide = Math.max(tmpSize.x, tmpSize.y, tmpSize.z);
      if (maxSide <= 0) return;
      if (maxSide > CFG.absoluteMaxSide) return;

      if (Number.isFinite(tmpBox.min.y)) minY = Math.min(minY, tmpBox.min.y);
    });

    return Number.isFinite(minY) ? minY : 0;
  }

  function _collectFadeMaterials(root) {
    const mats = new Set();
    root.traverse((o) => {
      if (!o.isMesh) return;
      const arr = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of arr) if (m) mats.add(m);
    });
    return Array.from(mats);
  }

  const _matBackup = new WeakMap();
  function _backupMat(m) {
    if (!m || _matBackup.has(m)) return;
    _matBackup.set(m, {
      transparent: !!m.transparent,
      opacity: Number.isFinite(m.opacity) ? m.opacity : 1,
      depthWrite: "depthWrite" in m ? !!m.depthWrite : true,
    });
  }
  function _restoreMats(mats) {
    for (const m of mats) {
      const b = _matBackup.get(m);
      if (!b) continue;
      m.transparent = b.transparent;
      if ("opacity" in m) m.opacity = b.opacity;
      if ("depthWrite" in m) m.depthWrite = b.depthWrite;
      m.needsUpdate = true;
    }
  }
  function _setMatsOpacity(mats, alpha) {
    const a = THREE.MathUtils.clamp(alpha, 0, 1);
    for (const m of mats) {
      _backupMat(m);
      m.transparent = true;
      if ("opacity" in m) {
        const base = _matBackup.get(m)?.opacity ?? 1;
        m.opacity = base * a;
      }
      if ("depthWrite" in m) m.depthWrite = a > 0.02;
      m.needsUpdate = true;
    }
  }

  // ----------------------------
  // camera tween system
  // ----------------------------
  let camTween = null;

  const { holder, canvas } = _mountCanvas(mountEl);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: false,
    antialias: true,
    powerPreference: "high-performance",
  });

  renderer.setClearColor(CFG.bg, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  _setRendererColorSpace(renderer);

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = CFG.exposure;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(CFG.bg);

  const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 2000);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.enableRotate = !!CFG.allowUserOrbit;
  controls.enableZoom = !!CFG.allowUserOrbit;

  _applyLights(scene);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  _resizeRendererToDisplaySize(renderer, camera, holder);

  let disposed = false;
  let raf = 0;

  const loader = _makeLoader();
  console.log(`${LOG} loading:`, modelUrl);

  const gltf = await new Promise((resolve, reject) => {
    loader.load(modelUrl, (g) => resolve(g), undefined, (err) => reject(err));
  });

  if (disposed) return null;

  scene.add(gltf.scene);

  const boxRoot = _findByName(gltf.scene, PY.preferChestRootName) || gltf.scene;
  const lidPivot = _findByName(gltf.scene, PY.lidPivotName) || null;

  if (boxRoot && boxRoot !== gltf.scene) {
    gltf.scene.traverse((o) => {
      if (o === gltf.scene) return;
      if (_isDescendantOf(o, boxRoot)) return;
      o.visible = false;
    });
  }

  _fixMaterialColorSpaces(boxRoot);
  _applyEnvMapIntensity(boxRoot, 0.35);
  _ensureShadows(boxRoot);

  let chestBox = _robustBoundingBox(boxRoot).box;

  // recenter
  if (CFG.recenterToOrigin) {
    const c = new THREE.Vector3();
    chestBox.getCenter(c);
    boxRoot.position.sub(c);
    boxRoot.updateWorldMatrix(true, true);
    chestBox = _robustBoundingBox(boxRoot).box;
  }

  // normalize scale
  if (CFG.normalizeScale) {
    const s = new THREE.Vector3();
    chestBox.getSize(s);
    const u0 = Math.max(s.x, s.y, s.z, 1e-6);

    if (u0 < CFG.normalizeMinU || u0 > CFG.normalizeMaxU) {
      const k = CFG.normalizeTargetU / u0;
      boxRoot.scale.multiplyScalar(k);
      boxRoot.updateWorldMatrix(true, true);
      chestBox = _robustBoundingBox(boxRoot).box;
    }
  }

  boxRoot.updateWorldMatrix(true, true);
  const exactMinY = _minYExact(boxRoot);
  if (Number.isFinite(exactMinY)) {
    boxRoot.position.y += -exactMinY;
    boxRoot.updateWorldMatrix(true, true);
    chestBox = _robustBoundingBox(boxRoot).box;
  }

  _buildAtmosphere(scene);
  const ground = _makeGround(scene, chestBox);

  const chestSize = new THREE.Vector3();
  chestBox.getSize(chestSize);
  let u = Math.max(chestSize.x, chestSize.y, chestSize.z, 1);

  const eps = Math.max(0.01, u * 0.0035);
  const AIR_GAP = Math.max(0.03, u * 0.025);

  const fullBox = new THREE.Box3().setFromObject(boxRoot);
  let groundY = fullBox.min.y - eps;
  ground.position.y = groundY;

  const dyLift = groundY + AIR_GAP - fullBox.min.y;
  if (dyLift > 0) _translateWorldY(boxRoot, dyLift);

  chestBox = _robustBoundingBox(boxRoot).box;
  chestBox.getSize(chestSize);
  u = Math.max(chestSize.x, chestSize.y, chestSize.z, 1);

  const floorCables = _buildFloorCables(scene, chestBox, groundY);
  const groundSmoke = _buildGroundSmoke(scene, chestBox, groundY);
  const fx = _buildExplosionFX(scene);

  // base
  const baseRootRot = boxRoot.rotation.clone();
  const baseRootPos = boxRoot.position.clone();
  const baseRootScale = boxRoot.scale.clone();

  const baseLidScale = lidPivot ? lidPivot.scale.clone() : null;
  const baseLidRot = lidPivot ? lidPivot.rotation.clone() : null;
  const baseLidPos = lidPivot ? lidPivot.position.clone() : null;

  let hingePivots = _findMany(boxRoot, (o) => o.name && o.name.startsWith(PY.hingePivotPrefix));
  if (!hingePivots.length) {
    const fallback = ["Cube147_BOX001_0_baked", "Cube148_BOX001_0_baked", "Cube149_BOX001_0_baked", "Cube150_BOX001_0_baked"];
    hingePivots = fallback.map((n) => _findByName(boxRoot, n)).filter(Boolean);
  }

  const hingeBaseQuat = new Map();
  for (const h of hingePivots) hingeBaseQuat.set(h, h.quaternion.clone());

  function _computeHingeCfgs(hingePivots, boxRoot, chestBox) {
    const cfgs = new Map();

    const centerW = new THREE.Vector3();
    chestBox.getCenter(centerW);

    boxRoot.updateWorldMatrix(true, false);
    const invRoot = boxRoot.matrixWorld.clone().invert();
    const centerL = centerW.clone().applyMatrix4(invRoot);

    const pW = new THREE.Vector3();
    const pL = new THREE.Vector3();

    for (const h of hingePivots) {
      if (!h) continue;

      h.updateWorldMatrix(true, false);
      h.getWorldPosition(pW);
      pL.copy(pW).applyMatrix4(invRoot);

      const v = pL.clone().sub(centerL);
      v.y = 0;

      const ax = Math.abs(v.x);
      const az = Math.abs(v.z);

      let side = "right";
      if (ax >= az) side = v.x >= 0 ? "right" : "left";
      else side = v.z >= 0 ? "front" : "back";

      let axis = side === "left" || side === "right" ? "z" : "x";
      let sign = 1;
      if (side === "left") sign = -1;
      if (side === "back") sign = -1;

      const base = { side, axis, sign, mul: 1.0, offsetDeg: 0.0 };
      const ov = HINGE_OVERRIDES[h.name];
      cfgs.set(h, ov ? { ...base, ...ov } : base);
    }
    return cfgs;
  }

  function _applyHingeDeltaQuat(h, baseQuat, angleRad, cfg) {
    const a = angleRad * (cfg?.sign ?? 1) * (cfg?.mul ?? 1) + THREE.MathUtils.degToRad(cfg?.offsetDeg ?? 0);

    const axisVec =
      cfg?.axis === "z" ? new THREE.Vector3(0, 0, 1) : cfg?.axis === "y" ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);

    const dq = new THREE.Quaternion().setFromAxisAngle(axisVec, a);
    h.quaternion.copy(baseQuat).multiply(dq);
  }

  let hingeCfgs = _computeHingeCfgs(hingePivots, boxRoot, chestBox);

  // lid blast
  let lidBlast = null;
  if (lidPivot) {
    lidBlast = lidPivot.clone(true);
    lidBlast.name = "GP_Lid_Blast";
    lidBlast.visible = false;
    lidBlast.frustumCulled = false;
    _fixMaterialColorSpaces(lidBlast);
    _ensureShadows(lidBlast);
    scene.add(lidBlast);
  }
  const baseLidBlastScale = lidBlast ? lidBlast.scale.clone() : null;

  const chestFadeMats = _collectFadeMaterials(boxRoot);
  const lidFadeMats = lidBlast ? _collectFadeMaterials(lidBlast) : [];

  // cards system
  const cards3d = buildCards3D({ scene, camera, renderer, controls, chestBox, groundY });
  cards3d?.setBounds?.({ chestBox, groundY });

  // camera presets
  let currentView = "standby";
  const presets = {
    standby: { pos: new THREE.Vector3(), target: new THREE.Vector3(), fov: 36 },
    explode: { pos: new THREE.Vector3(), target: new THREE.Vector3(), fov: 40 },
    cards: { pos: new THREE.Vector3(), target: new THREE.Vector3(), fov: 32 },
  };

  function _setCameraClipFromDistance(dist) {
    const d = Math.max(0.001, dist);
    camera.near = Math.max(CFG.minNear, d * CFG.nearFromDistanceMul);
    camera.far = Math.max(CFG.farMin, d * CFG.farFromDistanceMul);
    camera.updateProjectionMatrix();
  }

  function _startCamTween({ toPos, toTarget, toFov, dur = 520 }) {
    camTween = {
      start: performance.now(),
      dur: Math.max(80, dur),
      fromPos: camera.position.clone(),
      toPos: toPos.clone(),
      fromTarget: controls?.target?.clone?.() ?? new THREE.Vector3(0, 0, 0),
      toTarget: toTarget.clone(),
      fromFov: camera.fov,
      toFov: toFov ?? camera.fov,
    };
  }

  function _tickCamTween(now) {
    if (!camTween) return;
    const tt = (now - camTween.start) / camTween.dur;
    const k = tt >= 1 ? 1 : _easeInOutCubic(THREE.MathUtils.clamp(tt, 0, 1));

    camera.position.lerpVectors(camTween.fromPos, camTween.toPos, k);
    if (controls) controls.target.lerpVectors(camTween.fromTarget, camTween.toTarget, k);
    else camera.lookAt(camTween.toTarget);

    camera.fov = THREE.MathUtils.lerp(camTween.fromFov, camTween.toFov, k);
    camera.updateProjectionMatrix();

    _setCameraClipFromDistance(camera.position.distanceTo(controls?.target ?? camTween.toTarget));

    if (tt >= 1) camTween = null;
  }

  function _recomputePresets() {
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    chestBox.getCenter(center);
    chestBox.getSize(size);

    const uNow = Math.max(size.x, size.y, size.z, 1);
    const gY = Number.isFinite(groundY) ? groundY : chestBox.min.y;

    const standbyTarget = new THREE.Vector3(center.x, gY + uNow * 0.3, center.z);
    const explodeTarget = new THREE.Vector3(center.x, gY + uNow * 0.38, center.z);
    const cardsTarget = new THREE.Vector3(center.x, gY + uNow * (CFG.cardsTargetYMul ?? 0.2), center.z);

    const yaw = THREE.MathUtils.degToRad(CFG.camYawDeg ?? 45);
    const pitch = THREE.MathUtils.degToRad(CFG.camPitchDeg ?? 18);

    const VIEW_DIR = new THREE.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)).normalize();

    const aspect = camera.aspect || 16 / 9;

    function fitDistanceForFovDeg(fovDeg) {
      const fovV = THREE.MathUtils.degToRad(fovDeg);
      const fovH = 2 * Math.atan(Math.tan(fovV * 0.5) * aspect);
      const minFov = Math.min(fovV, fovH);
      const radius = 0.5 * size.length();
      const margin = CFG.camMargin ?? 1.22;
      return (radius / Math.sin(minFov * 0.5)) * margin;
    }

    presets.standby.fov = 36;
    presets.explode.fov = 40;
    presets.cards.fov = CFG.cardsFov ?? 32;

    presets.standby.target.copy(standbyTarget);
    presets.explode.target.copy(explodeTarget);
    presets.cards.target.copy(cardsTarget);

    const dStandby = Math.max(fitDistanceForFovDeg(presets.standby.fov), uNow * 2.7);
    const dExplode = Math.max(fitDistanceForFovDeg(presets.explode.fov), uNow * 3.2);
    const dCardsBase = Math.max(fitDistanceForFovDeg(presets.cards.fov), uNow * 2.3);
    const dCards = dCardsBase * (CFG.cardsDistanceMul ?? 1.0);

    presets.standby.pos.copy(standbyTarget).addScaledVector(VIEW_DIR, dStandby);
    presets.explode.pos.copy(explodeTarget).addScaledVector(VIEW_DIR, dExplode).add(new THREE.Vector3(0, uNow * 0.08, 0));
    presets.cards.pos.copy(cardsTarget).addScaledVector(VIEW_DIR, dCards);
    presets.cards.pos.y += uNow * (CFG.cardsCamPosYOffsetMul ?? 0.0);

    const minCamY = gY + uNow * 0.2;
    presets.standby.pos.y = Math.max(presets.standby.pos.y, minCamY);
    presets.explode.pos.y = Math.max(presets.explode.pos.y, minCamY);
    presets.cards.pos.y = Math.max(presets.cards.pos.y, minCamY);
  }

  function _applyPreset(name, { instant = false, dur = 620 } = {}) {
    const p = presets[name] || presets.standby;
    currentView = name;

    const toPos = p.pos.clone();
    const toTarget = p.target.clone();
    const toFov = p.fov;

    if (instant) {
      camTween = null;
      camera.position.copy(toPos);
      if (controls?.target) controls.target.copy(toTarget);
      else camera.lookAt(toTarget);
      camera.fov = toFov;
      camera.updateProjectionMatrix();
      _setCameraClipFromDistance(camera.position.distanceTo(toTarget));
      return;
    }
    _startCamTween({ toPos, toTarget, toFov, dur });
  }

  const TL = _createTimeline();

  function _resetFX() {
    fx.flash.intensity = 0;

    fx.glow.visible = false;
    fx.glow.material.opacity = 0;
    fx.glow.scale.set(1, 1, 1);

    fx.core.visible = false;
    fx.core.material.opacity = 0;
    fx.core.scale.set(1, 1, 1);

    fx.ring.visible = false;
    fx.ring.material.opacity = 0;
    fx.ring.scale.set(1, 1, 1);

    fx.sphere.visible = false;
    fx.sphere.material.opacity = 0;
    fx.sphere.scale.set(1, 1, 1);

    fx.crack.visible = false;
    fx.crack.material.opacity = 0;
    fx.crack.scale.set(1, 1, 1);

    for (const d of fx.dusts) {
      d.visible = false;
      d.material.opacity = 0;
      d.scale.set(1, 1, 1);
    }

    for (const s of fx.streaks) {
      s.visible = false;
      s.material.opacity = 0;
      s.scale.set(1, 1, 1);
    }

    fx.sparks.visible = false;
    fx.sparks.material.opacity = 0;
    fx.debris.visible = false;
    fx.debris.material.opacity = 0;

    fx.sparks.position.set(0, 0, 0);
    fx.debris.position.set(0, 0, 0);
  }

  let seq = null;

  function resetPose() {
    seq = null;

    boxRoot.visible = true;
    boxRoot.position.copy(baseRootPos);
    boxRoot.rotation.copy(baseRootRot);
    boxRoot.scale.copy(baseRootScale);

    for (const h of hingePivots) {
      const bq = hingeBaseQuat.get(h);
      if (bq) h.quaternion.copy(bq);
      else h.rotation.set(0, 0, 0);
    }

    if (lidPivot && baseLidRot) lidPivot.rotation.copy(baseLidRot);
    if (lidPivot && baseLidPos) lidPivot.position.copy(baseLidPos);
    if (lidPivot && baseLidScale) lidPivot.scale.copy(baseLidScale);
    if (lidPivot) lidPivot.visible = true;

    if (lidBlast) {
      lidBlast.visible = false;
      lidBlast.position.set(0, 0, 0);
      lidBlast.rotation.set(0, 0, 0);
      if (baseLidBlastScale) lidBlast.scale.copy(baseLidBlastScale);
      else lidBlast.scale.set(1, 1, 1);
    }

    _restoreMats(chestFadeMats);
    _restoreMats(lidFadeMats);

    _resetFX();

    if (groundSmoke?.pts) groundSmoke.pts.visible = false;
    if (groundSmoke?.material) groundSmoke.material.opacity = 0.0;

    _recomputePresets();
    hingeCfgs = _computeHingeCfgs(hingePivots, boxRoot, chestBox);
    _applyPreset("standby", { instant: true });

    camTween = null;
  }

  function resetChestOnly() {
    seq = null;

    boxRoot.visible = true;
    boxRoot.position.copy(baseRootPos);
    boxRoot.rotation.copy(baseRootRot);
    boxRoot.scale.copy(baseRootScale);

    for (const h of hingePivots) {
      const bq = hingeBaseQuat.get(h);
      if (bq) h.quaternion.copy(bq);
      else h.rotation.set(0, 0, 0);
    }

    if (lidPivot && baseLidRot) lidPivot.rotation.copy(baseLidRot);
    if (lidPivot && baseLidPos) lidPivot.position.copy(baseLidPos);
    if (lidPivot && baseLidScale) lidPivot.scale.copy(baseLidScale);
    if (lidPivot) lidPivot.visible = true;

    if (lidBlast) {
      lidBlast.visible = false;
      lidBlast.position.set(0, 0, 0);
      lidBlast.rotation.set(0, 0, 0);
      if (baseLidBlastScale) lidBlast.scale.copy(baseLidBlastScale);
      else lidBlast.scale.set(1, 1, 1);
    }

    _restoreMats(chestFadeMats);
    _restoreMats(lidFadeMats);
    _resetFX();

    if (groundSmoke?.pts) groundSmoke.pts.visible = true;
  }

  // ============================
  // OPEN SEQUENCE (normal)
  // ============================
  function _startOpenSequence({ mode = "first", onCards = null, appearDelaysMs = null, onOpenStart = null } = {}) {
    const timings = { revealAt: TL.tCards, total: TL.tEnd };

    resetPose();

    try { onOpenStart?.(); } catch {}

    _recomputePresets();
    _applyPreset("standby", { instant: false, dur: 240 });

    if (groundSmoke?.pts) groundSmoke.pts.visible = true;

    const start = performance.now();
    const rnd = _seededNoise(PY.BOX_SHAKE_SEED);

    const tmpPos = new THREE.Vector3();
    const tmpQuat = new THREE.Quaternion();
    const tmpScale = new THREE.Vector3();

    let exploded = false;
    let lidBlasted = false;

    let explodeOrigin = new THREE.Vector3();
    let explodeU = u;

    let camWentExplode = false;
    let camSwitchedToCards = false;

    const gapMs = Math.max(0, TL.tCards - TL.tExplode);
    const vanishDelayMs = Math.min(360, Math.max(180, gapMs * 0.22));
    const vanishDurMs = Math.max(520, gapMs * 0.58);
    let vanished = false;

    let cardsCallbackFired = false;

    const lidBlastBasePos = new THREE.Vector3();
    const lidBlastBaseQuat = new THREE.Quaternion();
    const lidBlastBaseScale = new THREE.Vector3();

    const deg = THREE.MathUtils.degToRad;
    const hingeAntic = deg(PY.HINGE_ANTIC_DEG);
    const hingeOvers = deg(PY.HINGE_OVERS_DEG);
    const hingeSettle = deg(PY.HINGE_SETTLE_DEG);

    function lerpAngle(a, b, t) {
      return a + (b - a) * t;
    }

    const tExpl = TL.tExplode;
    const tH0 = Math.max(0, tExpl - 640);
    const tH1 = Math.max(0, tExpl - 480);
    const tH2 = Math.max(0, tExpl - 280);
    const tH3 = Math.max(0, tExpl - 120);

    const shakeDurMs = Math.max(140, PY.BOX_SHAKE_DURATION_S * 1000);
    const tShakeStart = Math.max(0, tExpl - shakeDurMs);

    const dustSeeds = [Math.random() * 1000, Math.random() * 1000];

    function _spawnExplosionAt(worldPos, uNow) {
      fx.flash.position.copy(worldPos);
      fx.flash.intensity = CFG.flashIntensityPeak;

      fx.glow.position.copy(worldPos);
      fx.glow.visible = true;
      fx.glow.material.opacity = 1.0;
      fx.glow.scale.set(0.001, 0.001, 0.001);

      fx.core.position.copy(worldPos);
      fx.core.visible = true;
      fx.core.material.opacity = 1.0;
      fx.core.scale.set(0.001, 0.001, 0.001);

      fx.ring.position.copy(worldPos);
      fx.ring.visible = true;
      fx.ring.material.opacity = 0.95;
      fx.ring.scale.set(0.001, 0.001, 0.001);

      fx.sphere.position.copy(worldPos);
      fx.sphere.visible = true;
      fx.sphere.material.opacity = 0.55;
      fx.sphere.scale.set(0.001, 0.001, 0.001);

      if (PY.CRACK_ENABLE) {
        fx.crack.position.copy(worldPos);
        fx.crack.position.y = groundY + Math.max(0.004, uNow * 0.006);
        fx.crack.visible = true;
        fx.crack.material.opacity = 0.0;
        fx.crack.scale.set(0.001, 0.001, 0.001);
      }
    }

    seq = {
      mode,
      start,
      tick: (now) => {
        const ms = now - start;
        const t = ms / 1000;

        floorCables.setTime(t);

        if (groundSmoke?.material) {
          const base = THREE.MathUtils.clamp(PY.SMOKE_DENSITY_BASE * 1.35, 0.03, 0.18);
          const fadeIn = _clamp01(ms / 620);
          groundSmoke.material.opacity = base * fadeIn * (0.86 + 0.14 * Math.sin(t * 0.7));
        }

        if (!camWentExplode && ms >= tExpl - 220) {
          camWentExplode = true;
          _recomputePresets();
          _applyPreset("explode", { instant: false, dur: 220 });
        }

        if (PY.BOX_SHAKE_ENABLE && ms >= tShakeStart && ms <= tExpl) {
          const local = _clamp01((ms - tShakeStart) / Math.max(1, tExpl - tShakeStart));
          const intensity = _easeInOutCubic(local);

          const step = Math.max(1, PY.BOX_SHAKE_STEP);
          const phase = Math.floor((ms / 1000) * (22 / step));

          const nx = (rnd() * 2 - 1) * Math.sin(phase * 1.7);
          const ny = (rnd() * 2 - 1) * Math.cos(phase * 1.3);
          const nz = (rnd() * 2 - 1) * Math.sin(phase * 1.1);

          const locAmp = PY.BOX_SHAKE_LOC * u;
          const rotAmp = deg(PY.BOX_SHAKE_ROT_DEG);

          boxRoot.position.x = baseRootPos.x + nx * locAmp * intensity;
          boxRoot.position.z = baseRootPos.z + ny * locAmp * intensity;
          boxRoot.position.y = baseRootPos.y + nz * locAmp * intensity * PY.BOX_SHAKE_Z_FACTOR;

          boxRoot.rotation.x = baseRootRot.x + nx * rotAmp * intensity;
          boxRoot.rotation.y = baseRootRot.y + ny * rotAmp * intensity;
          boxRoot.rotation.z = baseRootRot.z + nz * rotAmp * intensity * 0.35;
        } else {
          boxRoot.position.lerp(baseRootPos, 0.1);
          boxRoot.rotation.x = THREE.MathUtils.lerp(boxRoot.rotation.x, baseRootRot.x, 0.1);
          boxRoot.rotation.y = THREE.MathUtils.lerp(boxRoot.rotation.y, baseRootRot.y, 0.1);
          boxRoot.rotation.z = THREE.MathUtils.lerp(boxRoot.rotation.z, baseRootRot.z, 0.1);
        }

        if (hingePivots.length) {
          let angle = 0;

          if (ms < tH0) angle = 0;
          else if (ms < tH1) {
            const k = _easeInOutCubic(_clamp01((ms - tH0) / Math.max(1, tH1 - tH0)));
            angle = lerpAngle(0, hingeAntic, k);
          } else if (ms < tH2) {
            const k = _easeOutCubic(_clamp01((ms - tH1) / Math.max(1, tH2 - tH1)));
            angle = lerpAngle(hingeAntic, hingeOvers, k);
          } else if (ms < tH3) {
            const k = _easeInOutCubic(_clamp01((ms - tH2) / Math.max(1, tH3 - tH2)));
            angle = lerpAngle(hingeOvers, hingeSettle, k);
          } else angle = hingeSettle;

          for (const h of hingePivots) {
            const bq = hingeBaseQuat.get(h);
            const cfg = hingeCfgs.get(h) ?? { axis: "x", sign: 1, mul: 1, offsetDeg: 0 };
            _applyHingeDeltaQuat(h, bq ?? h.quaternion.clone(), angle, cfg);
          }
        }

        if (!exploded && ms >= tExpl) {
          exploded = true;

          boxRoot.updateWorldMatrix(true, true);
          const bb = new THREE.Box3().setFromObject(boxRoot);
          const c = bb.getCenter(new THREE.Vector3());
          const s = bb.getSize(new THREE.Vector3());
          explodeU = Math.max(s.x, s.y, s.z, 1);
          explodeOrigin = c.clone().add(new THREE.Vector3(0, explodeU * 0.28, 0));

          _spawnExplosionAt(explodeOrigin, explodeU);

          if (PY.LID_BLAST_ENABLE && lidPivot && lidBlast) {
            lidPivot.updateWorldMatrix(true, true);
            lidPivot.getWorldPosition(tmpPos);
            lidPivot.getWorldQuaternion(tmpQuat);
            lidPivot.getWorldScale(tmpScale);

            lidBlast.position.copy(tmpPos);
            lidBlast.quaternion.copy(tmpQuat);
            lidBlast.scale.copy(tmpScale);
            lidBlast.visible = true;

            lidBlastBasePos.copy(tmpPos);
            lidBlastBaseQuat.copy(tmpQuat);
            lidBlastBaseScale.copy(tmpScale);

            lidPivot.visible = false;
            lidBlasted = true;
          }

          if (PY.DUST_ENABLE) {
            for (let i = 0; i < fx.dusts.length; i++) {
              const d = fx.dusts[i];
              d.visible = true;
              d.material.opacity = 0.0;

              const seed = dustSeeds[i] ?? Math.random() * 1000;
              const ang = (seed % 1) * Math.PI * 2;
              const rr = explodeU * (0.12 + ((seed * 0.37) % 1) * 0.2);

              d.position.copy(explodeOrigin);
              d.position.y = groundY + Math.max(0.01, explodeU * 0.02);
              d.position.x += Math.cos(ang) * rr;
              d.position.z += Math.sin(ang) * rr;

              d.scale.set(0.001, 0.001, 0.001);
            }
          }
        }

        if (lidBlasted && lidBlast && lidBlast.visible) {
          const dt = Math.max(0, (ms - tExpl) / 1000);
          const apex = Math.max(0.05, PY.LID_BLAST_APEX_S);
          const land = Math.max(apex + 0.08, PY.LID_BLAST_LAND_S);

          const k = _clamp01(dt / land);

          const upH = explodeU * PY.LID_BLAST_UP;
          const fwd = explodeU * PY.LID_BLAST_FORWARD;

          const dirToCam = camera.position.clone().sub(explodeOrigin).normalize();
          const side = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), dirToCam).normalize();

          let y = 0;
          if (dt <= apex) {
            const a = _easeOutCubic(_clamp01(dt / apex));
            y = upH * a;
          } else {
            const d = _clamp01((dt - apex) / Math.max(0.001, land - apex));
            y = upH * (1 - _easeInCubic(d));
          }

          const f = _easeOutCubic(k) * fwd;

          lidBlast.position.copy(lidBlastBasePos);
          lidBlast.position.addScaledVector(new THREE.Vector3(0, 1, 0), y);
          lidBlast.position.addScaledVector(dirToCam, f);
          lidBlast.position.addScaledVector(side, Math.sin(dt * 14.0) * 0.06 * explodeU);

          const spinK = _easeOutCubic(k);
          const e = new THREE.Euler(
            THREE.MathUtils.degToRad(PY.LID_BLAST_SPIN_X_DEG * spinK),
            THREE.MathUtils.degToRad(PY.LID_BLAST_SPIN_Y_DEG * spinK),
            THREE.MathUtils.degToRad(PY.LID_BLAST_SPIN_Z_DEG * spinK),
            "XYZ"
          );
          const dq = new THREE.Quaternion().setFromEuler(e);
          lidBlast.quaternion.copy(lidBlastBaseQuat).multiply(dq);

          if (dt > land + 0.35) lidBlast.visible = false;
        }

        if (exploded && !camSwitchedToCards && ms >= TL.tCards - 680) {
          camSwitchedToCards = true;
          _recomputePresets();
          _applyPreset("cards", { instant: false, dur: 780 });
        }

        if (!cardsCallbackFired && ms >= TL.tCards) {
          cardsCallbackFired = true;
          try {
            if (typeof onCards === "function") onCards({ mode, appearDelaysMs });
            else {
              cards3d?.open?.({ appearDelaysMs: appearDelaysMs || [0, 220, 440] });
            }
          } catch {}
        }

        if (exploded) {
          const k = _clamp01((ms - tExpl) / (CFG.flashDecayS * 1000));
          fx.flash.intensity = CFG.flashIntensityPeak * (1 - _easeOutCubic(k));
        }

        if (exploded) {
          const k = _clamp01((ms - tExpl) / (CFG.coreBurstS * 1000));
          fx.core.visible = true;
          fx.core.material.opacity = 1.0 * (1 - k);
          const maxCore = Math.max(5.0, explodeU * 7.5);
          const sc = THREE.MathUtils.lerp(0.001, maxCore, _easeOutCubic(k));
          fx.core.scale.set(sc, sc, sc);
          fx.core.quaternion.copy(camera.quaternion);
        }

        if (exploded) {
          const k = _clamp01((ms - tExpl) / (CFG.glowBurstS * 1000));
          fx.glow.visible = true;
          fx.glow.material.opacity = 0.95 * (1 - k);
          const maxGlow = Math.max(7.0, explodeU * 12.0);
          const sc = THREE.MathUtils.lerp(0.001, maxGlow, _easeOutCubic(k));
          fx.glow.scale.set(sc, sc, sc);
          fx.glow.quaternion.copy(camera.quaternion);
        }

        if (exploded) {
          const k = _clamp01((ms - tExpl) / (CFG.shockwaveS * 1000));
          fx.ring.visible = true;
          fx.ring.material.opacity = 0.95 * (1 - k);
          const maxRing = Math.max(12.0, explodeU * 18.0);
          const sc = THREE.MathUtils.lerp(0.001, maxRing, _easeOutCubic(k));
          fx.ring.scale.set(sc, sc, sc);
        }

        if (exploded) {
          const k = _clamp01((ms - tExpl) / (CFG.burstSphereS * 1000));
          fx.sphere.visible = true;
          fx.sphere.material.opacity = 0.55 * (1 - k);
          const maxS = Math.max(2.0, explodeU * 3.2);
          const sc = THREE.MathUtils.lerp(0.001, maxS, _easeOutCubic(k));
          fx.sphere.scale.set(sc, sc, sc);
        }

        if (exploded && PY.CRACK_ENABLE) {
          const dt = (ms - tExpl) / 1000;
          const fadeIn = _clamp01(dt / Math.max(0.001, PY.CRACK_FADE_IN_S));
          const fadeOut = _clamp01(dt / Math.max(0.001, PY.CRACK_FADE_OUT_S));
          const alpha = PY.CRACK_ALPHA * fadeIn * (1 - fadeOut);

          fx.crack.visible = alpha > 0.001;
          fx.crack.material.opacity = alpha;

          const sc = Math.max(explodeU * 2.2, 2.0);
          fx.crack.scale.set(sc, sc, sc);
        }

        if (exploded && PY.DUST_ENABLE) {
          const dt = (ms - tExpl) / 1000;
          const life = PY.DUST_LIFE_S;
          const k = _clamp01(dt / Math.max(0.001, life));
          const e = _easeOutCubic(k);

          for (let i = 0; i < fx.dusts.length; i++) {
            const d = fx.dusts[i];
            if (!d.visible) continue;

            const minS = PY.DUST_MIN_SCALE * explodeU * 1.2;
            const maxS = PY.DUST_MAX_SCALE * explodeU * 2.0;

            const sc = THREE.MathUtils.lerp(minS, maxS, e);
            d.scale.set(sc, sc, sc);

            d.position.y = groundY + Math.max(0.01, explodeU * 0.02) + e * PY.DUST_RISE * explodeU;
            d.material.opacity = (1 - k) * 0.55;

            if (k >= 1) {
              d.visible = false;
              d.material.opacity = 0;
            }
          }
        }

        if (exploded && !vanished) {
          const t0 = tExpl + vanishDelayMs;
          const t1 = t0 + vanishDurMs;

          if (ms >= t0) {
            const k = _clamp01((ms - t0) / Math.max(1, t1 - t0));
            const e = _easeOutCubic(k);

            _setMatsOpacity(chestFadeMats, 1 - e);
            boxRoot.scale.copy(baseRootScale).multiplyScalar(THREE.MathUtils.lerp(1, 0.85, e));

            if (lidBlast) {
              _setMatsOpacity(lidFadeMats, 1 - e);
              const kScale = THREE.MathUtils.lerp(1, 0.9, e);
              if (baseLidBlastScale) lidBlast.scale.copy(baseLidBlastScale).multiplyScalar(kScale);
              else lidBlast.scale.setScalar(kScale);
              if (ms >= TL.tCards - 40) lidBlast.visible = false;
            }

            if (k >= 1 || ms >= TL.tCards - 20) {
              vanished = true;
              boxRoot.visible = false;
              if (lidBlast) lidBlast.visible = false;
            }
          }
        }

        if (ms >= TL.tEnd) seq = null;
      },
    };

    return timings;
  }

  // ============================
  // REOPEN
  // ============================
  function _startReopenPrelude({ mode = "first", onCards = null, appearDelaysMs = null, onOpenStart = null } = {}) {
    const closeDur = CFG.reopenCloseDurMs ?? 520;
    const dropDur = CFG.reopenDropDurMs ?? 920;
    const holdDur = CFG.reopenSettleHoldMs ?? 140;

    const preMs = Math.max(closeDur, dropDur) + holdDur;
    const timings = { revealAt: preMs + TL.tCards, total: preMs + TL.tEnd };

    try {
      cards3d?.hideSmooth?.({ dur: closeDur });
    } catch {}

    resetChestOnly();
    const dropH = Math.max(u * (CFG.reopenDropHeightMul ?? 6.0), 2.0);

    boxRoot.visible = true;
    boxRoot.position.copy(baseRootPos);
    boxRoot.position.y = baseRootPos.y + dropH;

    boxRoot.rotation.copy(baseRootRot);
    boxRoot.rotation.x += 0.08;
    boxRoot.rotation.z += 0.05;

    _setMatsOpacity(chestFadeMats, 0.0);

    if (groundSmoke?.pts) groundSmoke.pts.visible = true;

    _recomputePresets();
    _applyPreset("standby", { instant: false, dur: 220 });

    const start = performance.now();
    let switched = false;

    seq = {
      mode,
      start,
      tick: (now) => {
        const ms = now - start;

        floorCables.setTime(ms / 1000);

        if (groundSmoke?.material) {
          const t = ms / 1000;
          const base = THREE.MathUtils.clamp(PY.SMOKE_DENSITY_BASE * 1.1, 0.02, 0.16);
          groundSmoke.material.opacity = base * (0.55 + 0.45 * Math.sin(t * 0.7));
        }

        const td = _clamp01(ms / Math.max(1, dropDur));
        const e = _easeOutCubic(td);

        let y = baseRootPos.y + (1 - e) * dropH;

        if (td > 0.82) {
          const bb = (td - 0.82) / 0.18;
          const bounce = Math.sin(bb * Math.PI) * Math.exp(-bb * 4.8) * (0.10 * u);
          y += bounce;
        }
        y = Math.max(baseRootPos.y, y);

        boxRoot.position.y = y;

        const alpha = _clamp01((td - 0.08) / 0.70);
        _setMatsOpacity(chestFadeMats, alpha);

        const landK = _clamp01((td - 0.9) / 0.1);
        const sq = 0.05 * _easeOutCubic(landK);
        boxRoot.scale.copy(baseRootScale).multiply(new THREE.Vector3(1 + sq, 1 - sq, 1 + sq));

        const rk = _easeOutCubic(td);
        boxRoot.rotation.x = THREE.MathUtils.lerp(boxRoot.rotation.x, baseRootRot.x, 0.08 + 0.22 * rk);
        boxRoot.rotation.y = THREE.MathUtils.lerp(boxRoot.rotation.y, baseRootRot.y, 0.08 + 0.22 * rk);
        boxRoot.rotation.z = THREE.MathUtils.lerp(boxRoot.rotation.z, baseRootRot.z, 0.08 + 0.22 * rk);

        if (!switched && ms >= preMs) {
          switched = true;

          _restoreMats(chestFadeMats);
          boxRoot.scale.copy(baseRootScale);
          boxRoot.rotation.copy(baseRootRot);
          boxRoot.position.copy(baseRootPos);

          _startOpenSequence({ mode, onCards, appearDelaysMs, onOpenStart });
          return;
        }
      },
    };

    return timings;
  }

  // ----------------------------
  // playOpen public
  // ----------------------------
  function playOpen({ mode = "first", onCards = null, appearDelaysMs = null, onOpenStart = null } = {}) {
    const cardsUp = (() => {
      try {
        return !!cards3d?.isVisible?.() || !!cards3d?.isClosing?.() || !!cards3d?.group?.visible;
      } catch {
        return !!cards3d?.group?.visible;
      }
    })();

    if (cardsUp) return _startReopenPrelude({ mode, onCards, appearDelaysMs, onOpenStart });
    return _startOpenSequence({ mode, onCards, appearDelaysMs, onOpenStart });
  }

  // loop
  function renderLoop(now) {
    if (disposed) return;

    try {
      seq?.tick?.(now);
      try {
        cards3d?.tick?.(now);
      } catch {}
      _tickCamTween(now);
    } catch (e) {
      console.warn(`${LOG} seq error:`, e);
      seq = null;
    }

    controls.update();
    renderer.render(scene, camera);

    raf = requestAnimationFrame(renderLoop);
  }
  raf = requestAnimationFrame(renderLoop);

  const ro = new ResizeObserver(() => {
    if (disposed) return;
    _resizeRendererToDisplaySize(renderer, camera, holder);

    chestBox = _robustBoundingBox(boxRoot).box;
    hingeCfgs = _computeHingeCfgs(hingePivots, boxRoot, chestBox);
    cards3d?.setBounds?.({ chestBox, groundY });
    _recomputePresets();
    _applyPreset(currentView, { instant: true });
  });
  ro.observe(holder);

  function dispose() {
    disposed = true;
    try {
      cancelAnimationFrame(raf);
    } catch {}
    try {
      ro.disconnect();
    } catch {}
    try {
      controls.dispose();
    } catch {}
    try {
      pmrem.dispose();
    } catch {}
    try {
      cards3d?.dispose?.();
    } catch {}
    try {
      renderer.dispose();
    } catch {}
    try {
      mountEl.innerHTML = "";
    } catch {}
  }

  _recomputePresets();
  _applyPreset("standby", { instant: true });
  _setCameraClipFromDistance(camera.position.distanceTo(controls.target));

  return {
    scene,
    camera,
    renderer,
    controls,
    root: boxRoot,
    lidPivot,
    resetPose,
    playOpen,
    cards3d,
    setCardPickHandler: (fn) => cards3d?.setPickHandler?.(fn),
    setExposure: (v) => {
      const x = Number(v);
      if (!Number.isFinite(x)) return;
      renderer.toneMappingExposure = THREE.MathUtils.clamp(x, 0.25, 2.5);
    },
    setCameraFitOffset: () => {},
    setView: (name, opts = {}) => _applyPreset(name, opts),
    dispose,
  };
}
