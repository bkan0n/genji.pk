import * as THREE from "three";

function _makeCardBackTexture(
  { pickLabel = "Pick a card", logoUrl = null, noStripes = false } = {},
  rendererRef = null
) {
  const { c, ctx, W, H, dpr } = _makeHiDPICanvas(512, 768, { dprMin: 2, dprCap: 3 });
  const snap = (v) => Math.round(v * dpr) / dpr;

  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#1b1c20");
  g.addColorStop(1, "#0f1013");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 10;
  ctx.strokeRect(14, 14, W - 28, H - 28);

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 18;
  ctx.strokeRect(30, 30, W - 60, H - 60);

  if (!noStripes) {
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 6;
    for (let i = -H; i <= W; i += 24) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + H, H);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.fillStyle = "rgba(255,255,255,0.90)";
  ctx.font = "bold 86px system-ui, -apple-system, Segoe UI, Roboto";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GP", snap(W / 2), snap(H * 0.42));

  ctx.fillStyle = "rgba(255,255,255,0.70)";
  ctx.font = "700 40px system-ui, -apple-system, Segoe UI, Roboto";
  ctx.fillText(pickLabel, snap(W / 2), snap(H * 0.78));

  const tex = _configureTextTexture(new THREE.CanvasTexture(c), rendererRef, { mipmaps: true });

  if (logoUrl) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const w = 220,
        h = 220;
      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.drawImage(img, snap((W - w) / 2), snap(H * 0.20), w, h);
      ctx.restore();
      tex.needsUpdate = true;
    };
    img.src = logoUrl;
  }

  return tex;
}

function _makeHiDPICanvas(W, H, { dprMin = 2, dprCap = 2 } = {}) {
  const dpr = Math.min(dprCap, Math.max(dprMin, window.devicePixelRatio || 1));
  const c = document.createElement("canvas");
  c.width = Math.round(W * dpr);
  c.height = Math.round(H * dpr);

  const ctx = c.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return { c, ctx, W, H, dpr };
}

function _configureTextTexture(tex, renderer, { mipmaps = true } = {}) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;

  const maxAniso = renderer?.capabilities?.getMaxAnisotropy?.();
  tex.anisotropy = typeof maxAniso === "number" && maxAniso > 0 ? maxAniso : 8;

  tex.generateMipmaps = !!mipmaps;
  tex.minFilter = mipmaps ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;

  tex.needsUpdate = true;
  return tex;
}

function _makeHatchTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d");

  ctx.clearRect(0, 0, c.width, c.height);
  ctx.strokeStyle = "rgba(255,255,255,0.20)";
  ctx.lineWidth = 6;

  for (let i = -256; i <= 256; i += 18) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 256, 256);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1.2, 1.2);
  return tex;
}

function _rarityToGlow(rarity) {
  const r = String(rarity || "").toLowerCase();
  if (r === "legendary") return new THREE.Color(1.0, 0.76, 0.16);
  if (r === "epic") return new THREE.Color(0.70, 0.34, 1.0);
  if (r === "rare") return new THREE.Color(0.20, 0.78, 1.0);
  return new THREE.Color(0.80, 0.80, 0.84);
}

function _rarityProfile(rarity) {
  const r = String(rarity || "").toLowerCase();
  if (r === "legendary") {
    return { color: _rarityToGlow(r), ringAlpha: 0.95, haloAlpha: 0.85, haloScale: 1.4, lightIntensity: 2.0, pulseSpeed: 0.0022 };
  }
  if (r === "epic") {
    return { color: _rarityToGlow(r), ringAlpha: 0.85, haloAlpha: 0.7, haloScale: 1.28, lightIntensity: 1.45, pulseSpeed: 0.002 };
  }
  if (r === "rare") {
    return { color: _rarityToGlow(r), ringAlpha: 0.78, haloAlpha: 0.6, haloScale: 1.18, lightIntensity: 1.15, pulseSpeed: 0.0019 };
  }
  return { color: _rarityToGlow(r), ringAlpha: 0.7, haloAlpha: 0.48, haloScale: 1.08, lightIntensity: 0.85, pulseSpeed: 0.0018 };
}

function _easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function _easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
function _clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

export function buildCards3D({ scene, camera, renderer, controls, chestBox, groundY = 0 }) {
  const group = new THREE.Group();
  group.name = "GP_Cards3D";
  group.visible = false;
  scene.add(group);

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  const texLoader = new THREE.TextureLoader();
  const texCache = new Map();
  const frontCache = new Map();

  let backTexStriped = null;
  let backTexClean = null;

  function _drawRoundedRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w * 0.5, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function _setMatAlpha(mat, a) {
    if (!mat) return;

    const alpha = _clamp01(a);
    const shouldBeTransparent = alpha < 0.999;

    if (mat.transparent !== shouldBeTransparent) {
      mat.transparent = shouldBeTransparent;
      mat.needsUpdate = true;
    }

    if ("opacity" in mat) mat.opacity = shouldBeTransparent ? alpha : 1.0;

    if ("depthTest" in mat) mat.depthTest = true;
    if ("depthWrite" in mat) mat.depthWrite = !shouldBeTransparent;

    if ("blending" in mat) mat.blending = THREE.NormalBlending;
  }

  function _setMeshAlpha(mesh, a) {
    if (!mesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const m of mats) _setMatAlpha(m, a);
  }

  function _drawContain(ctx, img, x, y, w, h) {
    const s = Math.min(w / img.width, h / img.height);
    const dw = img.width * s;
    const dh = img.height * s;
    const dx = x + (w - dw) * 0.5;
    const dy = y + (h - dh) * 0.5;
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function _drawCover(ctx, img, x, y, w, h) {
    const ir = img.width / img.height;
    const rr = w / h;
    let sx = 0,
      sy = 0,
      sw = img.width,
      sh = img.height;

    if (ir > rr) {
      sh = img.height;
      sw = sh * rr;
      sx = (img.width - sw) * 0.5;
      sy = 0;
    } else {
      sw = img.width;
      sh = sw / rr;
      sx = 0;
      sy = (img.height - sh) * 0.5;
    }

    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  function _makeRewardFrontTexture(reward, rendererRef = null, { noStripes = false } = {}) {
    const W = 512;
    const H = 768;

    const { c, ctx, dpr } = _makeHiDPICanvas(W, H, { dprMin: 2, dprCap: 3 });
    const snap = (v) => Math.round(v * dpr) / dpr;

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    function wrapText(text, x, y, maxWidth, lineHeight, maxLines = 3) {
      if (!text) return;
      const words = String(text).split(/\s+/);
      let line = "";
      let lines = [];
      for (let i = 0; i < words.length; i++) {
        const test = line ? `${line} ${words[i]}` : words[i];
        if (ctx.measureText(test).width <= maxWidth) line = test;
        else {
          if (line) lines.push(line);
          line = words[i];
        }
      }
      if (line) lines.push(line);

      if (lines.length > maxLines) {
        lines = lines.slice(0, maxLines);
        let last = lines[maxLines - 1];
        while (ctx.measureText(last + "…").width > maxWidth && last.length > 0) last = last.slice(0, -1);
        lines[maxLines - 1] = last + "…";
      }

      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], snap(x), snap(y + i * lineHeight));
      }
    }

    const name = reward?.name ?? reward?.title ?? "Reward";
    const type = reward?.type ?? reward?.category ?? "";
    const rarity = String(reward?.rarity ?? reward?.tier ?? "common").toLowerCase();
    const subtitle = reward?.subtitle ?? reward?.description ?? "";

    const rarityColor =
      rarity === "legendary" ? "#ffcc4d" :
      rarity === "epic" ? "#b38cff" :
      rarity === "rare" ? "#5bbcff" :
      rarity === "uncommon" ? "#6dff9d" :
      "#d7d7d7";

    const rarityGlow =
      rarity === "legendary" ? "rgba(255,204,77,0.35)" :
      rarity === "epic" ? "rgba(179,140,255,0.32)" :
      rarity === "rare" ? "rgba(91,188,255,0.30)" :
      rarity === "uncommon" ? "rgba(109,255,157,0.28)" :
      "rgba(215,215,215,0.20)";

    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#17181c");
    bg.addColorStop(1, "#0c0d10");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    if (!noStripes) {
      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 5;
      for (let i = -H; i <= W; i += 26) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + H, H);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 10;
    ctx.strokeRect(14, 14, W - 28, H - 28);

    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 18;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    const headerH = 108;
    ctx.save();
    ctx.fillStyle = rarityGlow;
    ctx.fillRect(30, 30, W - 60, headerH);

    ctx.fillStyle = rarityColor;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(30, 30 + headerH - 8, W - 60, 6);
    ctx.restore();

    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.font = "800 28px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const rarityLabel = rarity.charAt(0).toUpperCase() + rarity.slice(1);
    ctx.fillText(rarityLabel, snap(52), snap(30 + headerH / 2));

    const artTop = 30 + headerH + 24;
    const artH = 300;
    const artPad = 56;

    const frameX = artPad;
    const frameY = artTop;
    const frameW = W - artPad * 2;
    const frameH = artH;

    ctx.save();
    const fg = ctx.createLinearGradient(frameX, frameY, frameX, frameY + frameH);
    fg.addColorStop(0, "rgba(255,255,255,0.06)");
    fg.addColorStop(1, "rgba(255,255,255,0.02)");
    ctx.fillStyle = fg;

    const r = 26;
    ctx.beginPath();
    ctx.moveTo(frameX + r, frameY);
    ctx.arcTo(frameX + frameW, frameY, frameX + frameW, frameY + frameH, r);
    ctx.arcTo(frameX + frameW, frameY + frameH, frameX, frameY + frameH, r);
    ctx.arcTo(frameX, frameY + frameH, frameX, frameY, r);
    ctx.arcTo(frameX, frameY, frameX + frameW, frameY, r);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    ctx.font = "900 120px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GP", snap(W / 2), snap(frameY + frameH / 2));
    ctx.restore();

    const textTop = frameY + frameH + 34;
    const left = 56;
    const right = 56;
    const maxWidth = W - left - right;

    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "900 44px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    wrapText(name, left, textTop, maxWidth, 52, 2);

    if (type) {
      const pillY = textTop + 118;
      const pillText = String(type).toUpperCase();
      ctx.font = "800 22px system-ui, -apple-system, Segoe UI, Roboto";
      const tw = ctx.measureText(pillText).width;
      const padX = 18;
      const pillW = clamp(tw + padX * 2, 110, maxWidth);
      const pillH = 40;

      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 3;

      const x = left;
      const y = pillY;

      const pr = 16;
      ctx.beginPath();
      ctx.moveTo(x + pr, y);
      ctx.arcTo(x + pillW, y, x + pillW, y + pillH, pr);
      ctx.arcTo(x + pillW, y + pillH, x, y + pillH, pr);
      ctx.arcTo(x, y + pillH, x, y, pr);
      ctx.arcTo(x, y, x + pillW, y, pr);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = rarityColor;
      ctx.globalAlpha = 0.95;
      ctx.textBaseline = "middle";
      ctx.fillText(pillText, snap(x + padX), snap(y + pillH / 2));
      ctx.restore();
    }

    if (subtitle) {
      const descY = textTop + 178;
      ctx.fillStyle = "rgba(255,255,255,0.70)";
      ctx.font = "600 26px system-ui, -apple-system, Segoe UI, Roboto";
      ctx.textBaseline = "top";
      wrapText(subtitle, left, descY, maxWidth, 34, 4);
    }

    const tex = _configureTextTexture(new THREE.CanvasTexture(c), rendererRef, { mipmaps: true });

    const imageUrl = reward?.url ?? reward?.iconUrl ?? reward?.img ?? null;
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const pad = 26;
        const x = frameX + pad;
        const y = frameY + pad;
        const w = frameW - pad * 2;
        const h = frameH - pad * 2;

        const ir = img.width / img.height;
        let dw = w, dh = h;
        if (dw / dh > ir) dw = dh * ir;
        else dh = dw / ir;

        const dx = x + (w - dw) / 2;
        const dy = y + (h - dh) / 2;

        ctx.save();
        ctx.globalAlpha = 1;
        ctx.clearRect(x, y, w, h);
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();

        tex.needsUpdate = true;
      };
      img.src = imageUrl;
    }

    return tex;
  }

  function _getRewardFrontTexture(reward, { noStripes = false } = {}) {
    const key =
      `front|${reward?.url || ""}|${reward?.name || ""}|${reward?.rarity || ""}|${reward?.type || ""}` +
      `|ns:${noStripes ? 1 : 0}`;

    if (frontCache.has(key)) return frontCache.get(key);

    const p = Promise.resolve(_makeRewardFrontTexture(reward, renderer, { noStripes }));
    frontCache.set(key, p);
    return p;
  }

  const hatchTex = _makeHatchTexture();

  let rewards = [];
  let pickHandler = null;
  let active = false;
  let chosenIndex = -1;

  const timers = new Set();

  const size0 = new THREE.Vector3();
  const center0 = new THREE.Vector3();
  chestBox.getSize(size0);
  chestBox.getCenter(center0);

  const u = Math.max(size0.x, size0.y, size0.z, 1);
  const cardW = u * 0.42;
  const cardH = cardW * (320 / 220);
  const thick = cardW * 0.06;

  const geo = new THREE.BoxGeometry(cardW, cardH, thick);

  const sideMatTpl = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.05, 0.06, 0.07),
    roughness: 0.7,
    metalness: 0.15,
    transparent: true,
    opacity: 0.0,
  });

  const cards = [];
  const pedestals = [];

  const NEUTRAL_RING = new THREE.Color(0.75, 0.75, 0.78);
  let ringsRevealed = false;

  let _groundY = Number.isFinite(groundY) ? groundY : 0;
  let _chestBox = chestBox;

  const GROUND_CLEAR = Math.max(0.008, u * 0.006);

  const PEDESTAL_H = cardW * 0.10;
  const BASE_LOCAL_Y = -cardH * 0.62;
  const PED_BOTTOM_LOCAL = BASE_LOCAL_Y - PEDESTAL_H * 0.5;

  const LIGHT_DISTANCE = u * 2.2;

  function setBounds({ chestBox: nextBox, groundY: nextGround } = {}) {
    if (nextBox) _chestBox = nextBox;
    if (Number.isFinite(nextGround)) _groundY = nextGround;
    _computeLayout();
  }

  function _makePedestal(idx) {
    const g = new THREE.Group();
    g.name = `GP_Pedestal_${idx}`;
    g.userData = {
      appear: null,
      phase: Math.random() * 10,
      rarityColor: new THREE.Color(1, 1, 1),
      rarityProfile: _rarityProfile("common"),
    };

    const r0 = cardW * 0.26;
    const r1 = cardW * 0.30;

    const baseMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.06, 0.06, 0.07),
      roughness: 0.55,
      metalness: 0.25,
      transparent: true,
      opacity: 0.0,
      emissive: new THREE.Color(0, 0, 0),
      emissiveIntensity: 0.0,
    });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, PEDESTAL_H, 28, 1), baseMat);
    base.castShadow = true;
    base.receiveShadow = true;
    base.position.y = BASE_LOCAL_Y;
    g.add(base);

    const ringMat = new THREE.MeshBasicMaterial({
      color: NEUTRAL_RING.clone(),
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r0 * 1.05, Math.max(0.004, cardW * 0.018), 10, 48),
      ringMat
    );

    const haloTex = (() => {
      const cc = document.createElement("canvas");
      cc.width = cc.height = 128;
      const hctx = cc.getContext("2d");
      const gg = hctx.createRadialGradient(64, 64, 6, 64, 64, 64);
      gg.addColorStop(0.0, "rgba(255,255,255,1.0)");
      gg.addColorStop(0.25, "rgba(255,255,255,0.70)");
      gg.addColorStop(0.55, "rgba(255,255,255,0.18)");
      gg.addColorStop(1.0, "rgba(255,255,255,0.0)");
      hctx.fillStyle = gg;
      hctx.fillRect(0, 0, 128, 128);
      const t = new THREE.CanvasTexture(cc);
      t.colorSpace = THREE.SRGBColorSpace;
      t.needsUpdate = true;
      return t;
    })();

    const haloMat = new THREE.MeshBasicMaterial({
      map: haloTex,
      transparent: true,
      opacity: 0.0,
      color: NEUTRAL_RING.clone(),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
    });

    const halo = new THREE.Mesh(new THREE.PlaneGeometry(r0 * 3.0, r0 * 3.0), haloMat);
    halo.position.y = ring.position.y + 0.002;
    halo.rotation.x = -Math.PI / 2;
    g.add(halo);
    g.userData.halo = halo;

    ring.rotation.x = Math.PI / 2;
    ring.position.y = base.position.y + PEDESTAL_H * 0.52;
    g.add(ring);

    const glowLight = new THREE.PointLight(0xffffff, 0.0, LIGHT_DISTANCE, 2.0);
    glowLight.position.y = base.position.y + PEDESTAL_H * 0.80;
    glowLight.castShadow = false;
    g.add(glowLight);
    g.userData.glowLight = glowLight;

    g.userData.base = base;
    g.userData.ring = ring;

    group.add(g);
    pedestals.push(g);
  }

  function makeCard(idx) {
    _makePedestal(idx);

    const frontMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(1, 1, 1),
      roughness: 0.85,
      metalness: 0.02,
      transparent: true,
      opacity: 0.0,
      emissive: new THREE.Color(0, 0, 0),
      emissiveIntensity: 0.0,
    });

    const backMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(1, 1, 1),
      roughness: 0.85,
      metalness: 0.02,
      transparent: true,
      opacity: 0.0,
      emissive: new THREE.Color(0, 0, 0),
      emissiveIntensity: 0.0,
    });

    const sideMat = sideMatTpl.clone();
    sideMat.opacity = 0.0;
    sideMat.transparent = true;

    const mats = [sideMat, sideMat, sideMat, sideMat, frontMat, backMat];

    const mesh = new THREE.Mesh(geo, mats);
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    mesh.name = `GP_Card_${idx}`;
    mesh.userData = {
      idx,
      turned: false,
      appear: null,
      flip: null,
      hatch: null,
      rarityColor: _rarityToGlow("common"),
      rarityProfile: _rarityProfile("common"),
    };

    const hatch = new THREE.Mesh(
      new THREE.PlaneGeometry(cardW * 0.98, cardH * 0.98),
      new THREE.MeshBasicMaterial({ map: hatchTex, transparent: true, opacity: 0.0, depthWrite: false })
    );
    hatch.position.set(0, 0, thick * 0.51);
    mesh.add(hatch);
    mesh.userData.hatch = hatch;

    group.add(mesh);
    cards.push(mesh);
  }

  for (let i = 0; i < 3; i++) makeCard(i);

  const _size = new THREE.Vector3();
  const _center = new THREE.Vector3();

  function _computeLayout() {
    _chestBox.getSize(_size);
    _chestBox.getCenter(_center);

    const dir = camera.position.clone().sub(_center);
    dir.y = 0;
    if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1);
    dir.normalize();

    const basePos = _center.clone().addScaledVector(dir, u * 0.58);

    const desiredBottomWorld = _groundY + GROUND_CLEAR;
    const groupY = desiredBottomWorld - PED_BOTTOM_LOCAL;

    basePos.y = groupY;
    group.position.copy(basePos);

    group.lookAt(camera.position.x, group.position.y, camera.position.z);

    const spacing = cardW * 1.15;
    const offsets = [-spacing, 0, spacing];

    for (let i = 0; i < cards.length; i++) {
      cards[i].position.set(offsets[i], 0, 0);
      cards[i].rotation.set(0, 0, 0);

      pedestals[i].position.set(offsets[i], 0, 0);
      pedestals[i].rotation.set(0, 0, 0);
    }
  }

  _computeLayout();

  function setPickHandler(fn) {
    pickHandler = typeof fn === "function" ? fn : null;
  }

  function _applyNeutralRings() {
    ringsRevealed = false;

    for (let i = 0; i < 3; i++) {
      const ped = pedestals[i];
      if (!ped) continue;

      if (ped.userData.ring?.material) {
        ped.userData.ring.material.color.copy(NEUTRAL_RING);
        ped.userData.ring.material.needsUpdate = true;
      }

      if (ped.userData.halo?.material) {
        ped.userData.halo.material.color.copy(NEUTRAL_RING);
        ped.userData.halo.material.opacity = 0.0;
        ped.userData.halo.scale.set(1, 1, 1);
        ped.userData.halo.material.needsUpdate = true;
      }

      if (ped.userData.glowLight) {
        ped.userData.glowLight.intensity = 0.0;
        ped.userData.glowLight.color.setRGB(1, 1, 1);
      }

      if (ped.userData.base?.material) {
        ped.userData.base.material.emissive.setRGB(0, 0, 0);
        ped.userData.base.material.emissiveIntensity = 0.0;
        ped.userData.base.material.needsUpdate = true;
      }
    }
  }

  function _revealRarityRings() {
    ringsRevealed = true;

    for (let i = 0; i < 3; i++) {
      const ped = pedestals[i];
      if (!ped) continue;

      const prof = ped.userData.rarityProfile || _rarityProfile(rewards[i]?.rarity);
      const c = prof.color || ped.userData.rarityColor || _rarityToGlow(rewards[i]?.rarity);

      if (ped.userData.ring?.material) {
        ped.userData.ring.material.color.copy(c);
        ped.userData.ring.material.needsUpdate = true;
      }

      if (ped.userData.halo?.material) {
        ped.userData.halo.material.color.copy(c);
        ped.userData.halo.scale.setScalar(prof.haloScale || 1.0);
        ped.userData.halo.material.needsUpdate = true;
      }

      if (ped.userData.glowLight) {
        ped.userData.glowLight.color.copy(c);
        ped.userData.glowLight.intensity = 0.0;
      }

      if (ped.userData.base?.material) {
        ped.userData.base.material.emissive.setRGB(0, 0, 0);
        ped.userData.base.material.emissiveIntensity = 0.0;
        ped.userData.base.material.needsUpdate = true;
      }
    }
  }

  function setRewards(nextRewards, { pickLabel = "Pick a card", backLogoUrl = null } = {}) {
    rewards = Array.isArray(nextRewards) ? nextRewards.slice(0, 3) : [];
    chosenIndex = -1;
    active = false;

    _applyNeutralRings();

    backTexStriped = _makeCardBackTexture({ pickLabel, logoUrl: backLogoUrl, noStripes: false }, renderer);
    backTexClean   = _makeCardBackTexture({ pickLabel, logoUrl: backLogoUrl, noStripes: true  }, renderer);

    for (let i = 0; i < cards.length; i++) {
      const m = cards[i];
      const r = rewards[i];

      m.userData.rarityColor = _rarityToGlow(r?.rarity);
      m.userData.rarityProfile = _rarityProfile(r?.rarity);

      const backMat = m.material[5];
      backMat.map = backTexStriped;
      backMat.emissive?.setRGB?.(0, 0, 0);
      backMat.emissiveIntensity = 0.0;
      backMat.color?.setRGB?.(1, 1, 1);
      backMat.needsUpdate = true;

      const frontMat = m.material[4];
      frontMat.map = null;
      frontMat.emissive?.setRGB?.(0, 0, 0);
      frontMat.emissiveIntensity = 0.0;
      frontMat.needsUpdate = true;

      m.userData.turned = false;
      m.userData.appear = null;
      m.userData.flip = null;

      if (m.userData.hatch) {
        m.userData.hatch.visible = true;
        m.userData.hatch.material.opacity = 0.0;
      }

      _setMeshAlpha(m, 0.0);

      const ped = pedestals[i];
      if (ped) {
        const prof = _rarityProfile(r?.rarity);
        ped.userData.rarityProfile = prof;
        ped.userData.rarityColor = prof.color;

        ped.userData.appear = null;

        if (ped.userData.base?.material) _setMatAlpha(ped.userData.base.material, 0.0);
        if (ped.userData.ring?.material) ped.userData.ring.material.opacity = 0.0;

        if (ped.userData.halo?.material) {
          ped.userData.halo.material.opacity = 0.0;
          ped.userData.halo.material.color.copy(NEUTRAL_RING);
          ped.userData.halo.scale.set(1, 1, 1);
          ped.userData.halo.material.needsUpdate = true;
        }

        if (ped.userData.glowLight) {
          ped.userData.glowLight.intensity = 0.0;
          ped.userData.glowLight.color.setRGB(1, 1, 1);
        }
      }
    }

    for (const r of rewards) {
      const url = r?.url;
      if (!url || texCache.has(url)) continue;

      const p = new Promise((resolve) => {
        texLoader.load(
          url,
          (t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            t.needsUpdate = true;
            resolve(t);
          },
          undefined,
          () => resolve(null)
        );
      });

      texCache.set(url, p);
    }
  }

  function open({ appearDelaysMs = [0, 220, 440] } = {}) {
    _computeLayout();
    group.visible = true;
    active = true;
    chosenIndex = -1;
    _applyNeutralRings();

    const now = performance.now();

    for (let i = 0; i < cards.length; i++) {
      const m = cards[i];
      const start = now + (appearDelaysMs[i] ?? appearDelaysMs[appearDelaysMs.length - 1] ?? 0);

      m.userData.appear = { start, dur: 380 };
      m.position.y = -u * 0.25;
      m.scale.set(0.92, 0.92, 0.92);

      _setMeshAlpha(m, 0.0);

      const ped = pedestals[i];
      ped.userData.appear = { start, dur: 420 };
      ped.scale.set(0.92, 0.92, 0.92);

      const sc0 = ped.scale.x;
      ped.position.y = PED_BOTTOM_LOCAL * (1 - sc0);

      if (ped.userData.base?.material) _setMatAlpha(ped.userData.base.material, 0.0);
      if (ped.userData.ring?.material) ped.userData.ring.material.opacity = 0.0;
      if (ped.userData.halo?.material) ped.userData.halo.material.opacity = 0.0;
      if (ped.userData.glowLight) ped.userData.glowLight.intensity = 0.0;

      if (m.userData.hatch) m.userData.hatch.material.opacity = 0.0;
    }
  }

  function hide() {
    group.visible = false;
    active = false;
    chosenIndex = -1;
    ringsRevealed = false;
  }

  let closeAnim = null;
  function isVisible() {
    return !!group.visible;
  }
  function isClosing() {
    return !!closeAnim;
  }
  function getCloseProgress(now = performance.now()) {
    if (closeAnim) return _clamp01((now - closeAnim.start) / Math.max(1, closeAnim.dur));
    return group.visible ? 0 : 1;
  }

  function hideSmooth({ dur = 520, dropMul = 0.22, scaleTo = 0.92 } = {}) {
    if (!group.visible) {
      hide();
      return Promise.resolve();
    }

    active = false;

    const start = performance.now();
    const cardY0 = cards.map((m) => m.position.y);
    const cardS0 = cards.map((m) => m.scale.clone());
    const pedS0 = pedestals.map((p) => p.scale.clone());
    const pedY0 = pedestals.map((p) => p.position.y);

    const cardA0 = cards.map((m) => {
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      let a = 0;
      for (const mm of mats) {
        if (!mm) continue;
        if (mm.transparent === false) return 1.0;
        if (Number.isFinite(mm.opacity)) a = Math.max(a, mm.opacity);
      }
      return _clamp01(a);
    });

    const pedA0 = pedestals.map((p) => {
      const base = p?.userData?.base?.material;
      if (!base) return 1.0;
      if (base.transparent === false) return 1.0;
      return _clamp01(Number.isFinite(base.opacity) ? base.opacity : 1.0);
    });

    return new Promise((resolve) => {
      closeAnim = {
        start,
        dur: Math.max(120, dur),
        resolve,
        cardY0,
        cardS0,
        pedS0,
        pedY0,
        cardA0,
        pedA0,
        dropMul,
        scaleTo,
      };
    });
  }

  function _startFlip(idx, { grant = false, hatch = false } = {}) {
    const m = cards[idx];
    if (!m) return;

    const r = rewards[idx];

    const noStripes = !!grant;

    _getRewardFrontTexture(r, { noStripes }).then((frontTex) => {
      if (!frontTex) return;

      const frontMat = m.material[4];
      frontMat.map = frontTex;
      frontMat.emissive?.setRGB?.(0, 0, 0);
      frontMat.emissiveIntensity = 0.0;
      frontMat.needsUpdate = true;
    });

    m.userData.flip = {
      start: performance.now(),
      dur: 520,
      from: 0,
      to: Math.PI,
      done: false,
      grant,
      hatch,
    };
  }

  function _revealOthersAfterPick() {
    const id = setTimeout(() => {
      for (let i = 0; i < 3; i++) {
        if (i === chosenIndex) continue;
        const m = cards[i];
        if (!m || m.userData.turned) continue;
        _startFlip(i, { grant: false, hatch: true });
      }
    }, 1000);
    timers.add(id);
  }

  function _onPointerDown(ev) {
    if (!active || !group.visible) return;
    if (!renderer?.domElement) return;

    const rect = renderer.domElement.getBoundingClientRect();
    const x = (ev.clientX - rect.left) / rect.width;
    const y = (ev.clientY - rect.top) / rect.height;

    ndc.set(x * 2 - 1, 1 - y * 2);
    raycaster.setFromCamera(ndc, camera);

    const hits = raycaster.intersectObjects(cards, true);
    if (!hits?.length) return;

    let hit = hits[0].object;
    while (hit && !cards.includes(hit)) hit = hit.parent;
    if (!hit) return;

    const idx = hit.userData?.idx ?? -1;
    if (idx < 0 || idx > 2) return;

    const m = cards[idx];
    if (m.userData.turned) return;

    active = false;
    chosenIndex = idx;

    if (backTexClean) {
      const backMat = cards[idx].material[5];
      backMat.map = backTexClean;
      backMat.needsUpdate = true;
    }

    if (cards[idx].userData?.hatch) {
      cards[idx].userData.hatch.material.opacity = 0.0;
      cards[idx].userData.hatch.visible = false;
    }

    _revealRarityRings();

    _startFlip(idx, { grant: true, hatch: false });
    _revealOthersAfterPick();
  }

  renderer.domElement.addEventListener("pointerdown", _onPointerDown, { passive: true });

  function tick(now) {
    if (!group.visible) return;

    const targetQ = new THREE.Quaternion().setFromRotationMatrix(
      new THREE.Matrix4().lookAt(
        group.position,
        new THREE.Vector3(camera.position.x, group.position.y, camera.position.z),
        new THREE.Vector3(0, 1, 0)
      )
    );
    group.quaternion.slerp(targetQ, 0.12);

    if (closeAnim) {
      const tt = (now - closeAnim.start) / Math.max(1, closeAnim.dur);
      const k = tt >= 1 ? 1 : _easeInOutCubic(_clamp01(tt));
      const e = _easeOutCubic(k);

      const drop = u * (closeAnim.dropMul ?? 0.22);

      for (let i = 0; i < cards.length; i++) {
        const m = cards[i];
        const a0 = closeAnim.cardA0[i] ?? 1;

        m.position.y = THREE.MathUtils.lerp(closeAnim.cardY0[i], closeAnim.cardY0[i] - drop, e);

        const s0 = closeAnim.cardS0[i] ?? new THREE.Vector3(1, 1, 1);
        const sc = THREE.MathUtils.lerp(1.0, closeAnim.scaleTo ?? 0.92, e);
        m.scale.set(s0.x * sc, s0.y * sc, s0.z * sc);

        _setMeshAlpha(m, a0 * (1 - e));

        if (m.userData.hatch) {
          m.userData.hatch.material.opacity = (m.userData.hatch.material.opacity || 0) * (1 - e);
        }
      }

      for (let i = 0; i < pedestals.length; i++) {
        const p = pedestals[i];
        const a0 = closeAnim.pedA0[i] ?? 1;

        p.position.y = THREE.MathUtils.lerp(closeAnim.pedY0[i], closeAnim.pedY0[i] - drop * 0.75, e);

        const s0 = closeAnim.pedS0[i] ?? new THREE.Vector3(1, 1, 1);
        const sc = THREE.MathUtils.lerp(1.0, closeAnim.scaleTo ?? 0.92, e);
        p.scale.set(s0.x * sc, s0.y * sc, s0.z * sc);

        if (p.userData.base?.material) _setMatAlpha(p.userData.base.material, a0 * 0.95 * (1 - e));
        if (p.userData.ring?.material) p.userData.ring.material.opacity = (p.userData.ring.material.opacity || 0.85) * (1 - e);
        if (p.userData.halo?.material) p.userData.halo.material.opacity = (p.userData.halo.material.opacity || 0.25) * (1 - e);
        if (p.userData.glowLight) p.userData.glowLight.intensity = (p.userData.glowLight.intensity || 0) * (1 - e);
      }

      if (tt >= 1) {
        const done = closeAnim;
        closeAnim = null;
        hide();
        try { done?.resolve?.(); } catch {}
      }

      return;
    }

    for (let i = 0; i < cards.length; i++) {
      const m = cards[i];

      const a = m.userData.appear;
      if (a) {
        const tt = (now - a.start) / Math.max(1, a.dur);
        if (tt > 0) {
          const k = tt >= 1 ? 1 : _easeInOutCubic(_clamp01(tt));
          m.position.y = THREE.MathUtils.lerp(-u * 0.25, 0, k);

          const sc = THREE.MathUtils.lerp(0.92, 1.0, k);
          m.scale.set(sc, sc, sc);

          _setMeshAlpha(m, k);

          if (m.userData.hatch) m.userData.hatch.material.opacity = 0.0;

          if (tt >= 1) m.userData.appear = null;
        }
      }

      const ped = pedestals[i];
      const pa = ped?.userData?.appear;
      if (pa) {
        const tt = (now - pa.start) / Math.max(1, pa.dur);
        if (tt > 0) {
          const k = tt >= 1 ? 1 : _easeOutCubic(_clamp01(tt));
          const sc = THREE.MathUtils.lerp(0.92, 1.0, k);

          ped.scale.set(sc, sc, sc);
          ped.position.y = PED_BOTTOM_LOCAL * (1 - sc);

          if (ped.userData.base?.material) _setMatAlpha(ped.userData.base.material, k * 0.95);

          if (ped.userData.ring?.material) {
            const pulse = 0.70 + 0.30 * Math.sin(now * 0.002 + ped.userData.phase);
            ped.userData.ring.material.opacity = k * 0.85 * pulse;
          }

          if (ped.userData.halo?.material) {
            const pulse = 0.65 + 0.35 * Math.sin(now * 0.002 + ped.userData.phase);
            ped.userData.halo.material.opacity = k * 0.22 * pulse;
          }

          if (ped.userData.glowLight) ped.userData.glowLight.intensity = 0.0;

          if (tt >= 1) ped.userData.appear = null;
        }
      } else {
        const sc = ped.scale.x || 1;
        ped.position.y = PED_BOTTOM_LOCAL * (1 - sc);

        const prof = ped.userData.rarityProfile || _rarityProfile(rewards[i]?.rarity);
        const pulse = 0.65 + 0.35 * Math.sin(now * (prof.pulseSpeed || 0.002) + ped.userData.phase);

        const ringMat = ped?.userData?.ring?.material;
        if (ringMat && group.visible) {
          if (!ringsRevealed) {
            ringMat.color.copy(NEUTRAL_RING);
            ringMat.opacity = 0.85 * pulse;
          } else {
            const c = prof.color || ped.userData.rarityColor || _rarityToGlow(rewards[i]?.rarity);
            ringMat.color.copy(c);
            const boost = i === chosenIndex ? 1.0 : 0.65;
            ringMat.opacity = boost * (prof.ringAlpha || 0.8) * (0.75 + 0.25 * pulse);
          }
          ringMat.needsUpdate = true;
        }

        const haloMat = ped?.userData?.halo?.material;
        if (haloMat && group.visible) {
          if (!ringsRevealed) {
            haloMat.color.copy(NEUTRAL_RING);
            haloMat.opacity = 0.25 * pulse;
            ped.userData.halo.scale.set(1, 1, 1);
          } else {
            const c = prof.color || ped.userData.rarityColor || _rarityToGlow(rewards[i]?.rarity);
            haloMat.color.copy(c);
            const boost = i === chosenIndex ? 1.0 : 0.70;
            haloMat.opacity = boost * (prof.haloAlpha || 0.6) * (0.60 + 0.40 * pulse);

            const s = (prof.haloScale || 1.0) * (0.95 + 0.05 * pulse);
            ped.userData.halo.scale.set(s, s, s);
          }
          haloMat.needsUpdate = true;
        }

        const L = ped?.userData?.glowLight;
        if (L) {
          if (!ringsRevealed) L.intensity = 0.0;
          else {
            const c = prof.color || ped.userData.rarityColor || _rarityToGlow(rewards[i]?.rarity);
            L.color.copy(c);
            const boost = i === chosenIndex ? 1.0 : 0.55;
            L.intensity = boost * (prof.lightIntensity || 1.0) * (0.55 + 0.45 * pulse);
          }
        }
      }

      const f = m.userData.flip;
      if (f && !f.done) {
        const tt = (now - f.start) / Math.max(1, f.dur);
        const k = tt >= 1 ? 1 : _easeOutCubic(_clamp01(tt));
        m.rotation.y = THREE.MathUtils.lerp(f.from, f.to, k);

        if (k >= 0.5 && !m.userData.turned) {
          m.userData.turned = true;
          if (f.hatch && m.userData.hatch) m.userData.hatch.material.opacity = 1.0;

          if (f.grant && pickHandler) {
            const r = rewards[m.userData.idx];
            try { pickHandler(m.userData.idx, r); } catch {}
          }
        }

        if (tt >= 1) {
          f.done = true;
          m.userData.flip = null;
        }
      }
    }
  }

  function dispose() {
    for (const id of timers) clearTimeout(id);
    timers.clear();

    try { renderer.domElement.removeEventListener("pointerdown", _onPointerDown); } catch {}
    try { scene.remove(group); } catch {}
  }

  function isActiveForZoom() {
    return !!group.visible && !closeAnim;
  }

  return {
    group,
    setRewards,
    open,
    hide,
    hideSmooth,
    isVisible,
    isClosing,
    getCloseProgress,
    tick,
    dispose,
    setPickHandler,
    setBounds,
    isActiveForZoom,
  };
}
