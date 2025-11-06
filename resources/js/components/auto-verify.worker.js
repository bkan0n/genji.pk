import { createWorker } from "tesseract.js";

/* ===================== ROIs (normalized x1,y1,x2,y2) ===================== */
const DEFAULT_ROIS = {
  TOPLEFT:    [0.010, 0.020, 0.360, 0.300],
  BANNER:     [0.240, 0.186, 0.760, 0.380],
  TOPRIGHT:   [0.805, 0.320, 0.990, 0.619],
  BOTTOMLEFT: [0.070, 0.895, 0.260, 0.980],
};
let ROIS = { ...DEFAULT_ROIS };
const normRoi = (a)=> (Array.isArray(a)&&a.length===4) ? a.map(Number) : null;
function setRois(partial){ if(!partial) return; for(const k of Object.keys(DEFAULT_ROIS)){ const v=normRoi(partial[k]); if(v) ROIS[k]=v; } }
const toNormalized = (r,w,h)=> (r[0]>1||r[1]>1||r[2]>1||r[3]>1) ? [r[0]/w,r[1]/h,r[2]/w,r[3]/h] : r;
/* ===================== DEBUG LOGGER ===================== */
function safeClone(x){ try { return JSON.parse(JSON.stringify(x)); } catch { return String(x); } }
function makeLogger(enabled, bucket){
  const ts=()=> new Date().toISOString().slice(11,23);
  return (label, payload)=>{
    if(!enabled) return;
    try {
      console.debug(`%c[auto-verify] ${ts()} ${label}`, 'color:#7fffd4', payload);
      if(bucket){
        (bucket.events ||= []).push({ at: Date.now(), label, payload: safeClone(payload) });
      }
    } catch {}
  };
}

/* ===================== OCR core ===================== */
const TIME_TOL = 0.25;
const LOOSE_TIME_RE = /(\d{1,4})\s*[,.:]\s*(\d{1,2})/g;

const OCR_CHAR_WHITELIST = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:,/-_ <>[](){}!?'\"`“”‘’•+|\\=";

let tess;
async function getTesseract() {
  if (tess) return tess;

  let w = await createWorker();
  const has = (m) => typeof w?.[m] === 'function';

  if (has('loadLanguage')) {
    if (has('load')) await w.load();
    await w.loadLanguage('eng');
    try { await w.initialize('eng', { oem: 1 }); }
    catch { try { await w.initialize('eng', 1); } catch { await w.initialize('eng'); } }
  } else {
    try { w = await createWorker('eng'); } catch {}
    if (typeof w.initialize === 'function') {
      try { await w.initialize('eng', { oem: 1 }); }
      catch { try { await w.initialize('eng', 1); } catch { await w.initialize('eng'); } }
    }
  }

  if (has('setParameters')) {
    await w.setParameters({
      tessedit_char_whitelist: OCR_CHAR_WHITELIST,
      preserve_interword_spaces: '1',
      user_defined_dpi: '340',
    });
  }

  tess = w;
  return tess;
}

/* ===================== Canvas utils ===================== */
const ctxRF = (c) => c.getContext('2d', { willReadFrequently: true });
async function fetchImageBitmap(url){
  const r = await fetch(url,{mode:"cors",credentials:"omit",cache:"no-store"});
  if(!r.ok) throw new Error(`HTTP ${r.status}`);
  const ct=r.headers.get("content-type")||"";
  if(!/^image\//i.test(ct)) throw new Error(`Not an image (${ct})`);
  const b=await r.blob();
  return await createImageBitmap(b);
}
function crop(bmp,[x1,y1,x2,y2]){
  const w=bmp.width,h=bmp.height;
  const sx=Math.max(0,Math.floor(x1*w));
  const sy=Math.max(0,Math.floor(y1*h));
  const sw=Math.max(1,Math.floor((x2-x1)*w));
  const sh=Math.max(1,Math.floor((y2-y1)*h));
  const c=new OffscreenCanvas(sw,sh);
  ctxRF(c).drawImage(bmp,sx,sy,sw,sh,0,0,sw,sh);
  return c;
}
function cropBox(canvas, box, padPx=2){
  const {width:W,height:H}=canvas;
  const x0=Math.max(0, Math.floor((box.x0??box.left) - padPx));
  const y0=Math.max(0, Math.floor((box.y0??box.top)  - Math.floor(padPx*0.8)));
  const x1=Math.min(W, Math.ceil((box.x1??box.right) + padPx));
  const y1=Math.min(H, Math.ceil((box.y1??box.bottom)+ Math.floor(padPx*0.8)));
  const w=Math.max(1,x1-x0), h=Math.max(1,y1-y0);
  const sub=new OffscreenCanvas(w,h);
  ctxRF(sub).drawImage(canvas,x0,y0,w,h,0,0,w,h);
  return sub;
}
function scaleCanvas(c,f=2){
  const W=Math.max(1,Math.round(c.width*f));
  const H=Math.max(1,Math.round(c.height*f));
  const o=new OffscreenCanvas(W,H);
  const ctx=ctxRF(o);
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(c,0,0,W,H);
  return o;
}
function toBW(c){
  const w=c.width,h=c.height;
  const o=new OffscreenCanvas(w,h);
  const x=o.getContext("2d",{willReadFrequently:true});
  x.drawImage(c,0,0);
  const img=x.getImageData(0,0,w,h),d=img.data;
  for(let i=0;i<d.length;i+=4){
    const Y=0.2126*d[i]+0.7152*d[i+1]+0.0722*d[i+2];
    const t=Y>160?255:0;
    d[i]=d[i+1]=d[i+2]=t;
  }
  x.putImageData(img,0,0);
  return o;
}
function rgb2hsv(r,g,b){
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b), d=max-min;
  let h=0; if(d){ h = max===r ? ((g-b)/d)%6 : max===g ? (b-r)/d+2 : (r-g)/d+4; h*=60; if(h<0)h+=360; }
  const s=max? d/max : 0, v=max;
  return [h,s,v];
}
const clamp01 = (x)=> Math.max(0, Math.min(1, x));

/* ---------- Sampling & percentiles ---------- */
function sampleSV(canvas, step=3){
  const ctx=canvas.getContext("2d",{willReadFrequently:true});
  const {width:w,height:h}=canvas;
  const img=ctx.getImageData(0,0,w,h).data;
  const S=[], V=[];
  for(let y=0;y<h;y+=step){
    for(let x=0;x<w;x+=step){
      const i=(y*w+x)*4;
      const [_,s,v]=rgb2hsv(img[i],img[i+1],img[i+2]);
      S.push(s); V.push(v);
    }
  }
  return {S,V};
}
function percentile(arr,p){
  if(!arr.length) return 0;
  const a = Float32Array.from(arr).sort();
  const idx = Math.min(a.length-1, Math.max(0, Math.floor(p*(a.length-1))));
  return a[idx];
}
function findHuePeak(canvas, bandStart, bandEnd, sMin=0.30, vMin=0.30, step=3){
  const ctx=canvas.getContext("2d",{willReadFrequently:true});
  const {width:w,height:h}=canvas;
  const img=ctx.getImageData(0,0,w,h).data;
  const bins=new Array(360).fill(0);
  const inBand=(h)=> bandStart<=bandEnd ? (h>=bandStart && h<=bandEnd) : (h>=bandStart || h<=bandEnd);
  for(let y=0;y<h;y+=step){
    for(let x=0;x<w;x+=step){
      const i=(y*w+x)*4;
      const [hh,s,v]=rgb2hsv(img[i],img[i+1],img[i+2]);
      if(s>=sMin && v>=vMin && inBand(hh)){ bins[Math.round(hh)%360]+=s*v; }
    }
  }
  let best=-1, at=-1;
  for(let i=0;i<360;i++){ if(bins[i]>best){ best=bins[i]; at=i; } }
  return best>0 ? at : null;
}

/* ---------- Masks & morpho ---------- */
function unsharp(c,amount=0.6,radius=1){
  const w=c.width,h=c.height;
  const ctx=c.getContext("2d",{willReadFrequently:true});
  const src=ctx.getImageData(0,0,w,h);
  const t=new OffscreenCanvas(w,h), tctx=t.getContext("2d");
  tctx.filter=`blur(${Math.max(0.5,radius)}px)`; tctx.drawImage(c,0,0,w,h);
  const blur=tctx.getImageData(0,0,w,h);
  const sd=src.data,bd=blur.data;
  for(let i=0;i<sd.length;i+=4){
    sd[i]  = Math.max(0,Math.min(255,sd[i]  + amount*(sd[i]  - bd[i])));
    sd[i+1]= Math.max(0,Math.min(255,sd[i+1]+ amount*(sd[i+1]- bd[i+1])));
    sd[i+2]= Math.max(0,Math.min(255,sd[i+2]+ amount*(sd[i+2]- bd[i+2])));
  }
  ctx.putImageData(src,0,0); return c;
}
function dilateMask(c, it=1){
  const w=c.width,h=c.height;
  const x=c.getContext("2d",{willReadFrequently:true});
  let img=x.getImageData(0,0,w,h);
  for(let k=0;k<it;k++){
    const d=img.data; const out=new Uint8ClampedArray(d.length);
    for(let y=0;y<h;y++){
      for(let xx=0;xx<w;xx++){
        let on=0;
        for(let dy=-1;dy<=1;dy++){
          for(let dx=-1;dx<=1;dx++){
            const X=xx+dx, Y=y+dy;
            if(X<0||Y<0||X>=w||Y>=h) continue;
            const i=(Y*w+X)*4;
            if(d[i]===255){ on=1; break; }
          }
          if(on) break;
        }
        const idx=(y*w+xx)*4, v=on?255:0;
        out[idx]=out[idx+1]=out[idx+2]=v; out[idx+3]=255;
      }
    }
    img=new ImageData(out,w,h);
  }
  x.putImageData(img,0,0); return c;
}
function erodeMask(c, it=1){
  const w=c.width,h=c.height;
  const x=c.getContext("2d",{willReadFrequently:true});
  let img=x.getImageData(0,0,w,h);
  for(let k=0;k<it;k++){
    const d=img.data; const out=new Uint8ClampedArray(d.length);
    for(let y=0;y<h;y++){
      for(let xx=0;xx<w;xx++){
        let all=1;
        for(let dy=-1;dy<=1 && all;dy++){
          for(let dx=-1;dx<=1;dx++){
            const X=xx+dx, Y=y+dy;
            if(X<0||Y<0||X>=w||Y>=h){ all=0; break; }
            const i=(Y*w+X)*4;
            if(d[i]!==255){ all=0; break; }
          }
        }
        const idx=(y*w+xx)*4, v=all?255:0;
        out[idx]=out[idx+1]=out[idx+2]=v; out[idx+3]=255;
      }
    }
    img=new ImageData(out,w,h);
  }
  x.putImageData(img,0,0); return c;
}
function closeMask(c){ return erodeMask(dilateMask(c,1),1); }

/* ---- emphasis ---- */
function _rgb2hsv(r,g,b){ r/=255; g/=255; b/=255; const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min; let h=0; if(d){ h=max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4; h*=60; if(h<0)h+=360; } const s=max?d/max:0, v=max; return [h,s,v]; }
function _percentile(arr, p){ if(!arr.length) return 0; const a=Float32Array.from(arr).sort(); const i=Math.max(0,Math.min(a.length-1,Math.floor(p*(a.length-1)))); return a[i]; }

/* ===== WHITE SIGNATURE ===== */
function _collectAnchorPixels(canvas, words, pad = 2) {
  if (!Array.isArray(words) || !words.length) return [];
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const { width: W, height: H } = canvas;
  const out = [];
  for (const w of words) {
    const t = String(w?.text ?? "").trim();
    if (!t) continue;
    if (!isAnchorish(t)) continue;
    const b = w?.bbox || w;
    const x0 = Math.max(0, Math.floor(b.x0 - pad));
    const y0 = Math.max(0, Math.floor(b.y0 - pad));
    const x1 = Math.min(W, Math.ceil(b.x1 + pad));
    const y1 = Math.min(H, Math.ceil(b.y1 + pad));
    if (x1 <= x0 || y1 <= y0) continue;

    const img = ctx.getImageData(x0, y0, x1 - x0, y1 - y0);
    const d = img.data;
    for (let y = 0; y < img.height - 1; y++) {
      for (let x = 0; x < img.width - 1; x++) {
        const i = (y * img.width + x) * 4;
        const Y  = 0.2126 * d[i] + 0.7152 * d[i+1] + 0.0722 * d[i+2];
        const iR = i + 4;
        const iD = i + img.width * 4;
        const YR = 0.2126 * d[iR] + 0.7152 * d[iR+1] + 0.0722 * d[iR+2];
        const YD = 0.2126 * d[iD] + 0.7152 * d[iD+1] + 0.0722 * d[iD+2];
        const g = Math.abs(YR - Y) + Math.abs(YD - Y);
        if (g < 18) continue;
        out.push([d[i], d[i+1], d[i+2]]);
      }
    }
  }
  return out;
}
function estimateWhiteSignature(canvas, words) {
  const px = _collectAnchorPixels(canvas, words);
  if (px.length < 50) return null;
  const S = [], V = [];
  for (const [r,g,b] of px) { const [_, s, v] = _rgb2hsv(r,g,b); S.push(s); V.push(v); }
  const sMed = _percentile(S, 0.50), s35=_percentile(S,0.35), s80=_percentile(S,0.80);
  const vMed = _percentile(V, 0.50), v75=_percentile(V,0.75), v90=_percentile(V,0.90);
  const sMax = Math.min(0.42, Math.max(0.18, s80 + 0.05, sMed + 0.03, s35 + 0.08));
  const vMin = Math.max(0.72, Math.min(0.92, v75 - 0.04, v90 - 0.08, vMed + 0.12));
  return { sMax, vMin, count:px.length };
}
function emphasizeWhiteBySignature(canvas, sig){
  const { sMax, vMin } = sig || {};
  if (sMax == null || vMin == null) return null;
  const w = canvas.width, h = canvas.height;
  const o = new OffscreenCanvas(w,h);
  const x = o.getContext("2d", { willReadFrequently:true });
  x.drawImage(canvas,0,0);
  const img = x.getImageData(0,0,w,h), d = img.data;
  for (let i=0;i<d.length;i+=4){
    const [_, s, v] = _rgb2hsv(d[i],d[i+1],d[i+2]);
    const on = (s <= sMax && v >= vMin);
    const val = on ? 255 : 0;
    d[i] = d[i+1] = d[i+2] = val; d[i+3] = 255;
  }
  x.putImageData(img,0,0);
  return closeMask(o);
}
async function ocrWhiteSignature(canvas, sig, psm=7, scale=3){
  let v = canvas;
  if (scale && scale !== 1) v = scaleCanvas(v, scale);
  v = emphasizeWhiteBySignature(v, sig) || emphasizeWhiteUltra(v);
  v = unsharp(v, 0.6, 1);
  const bytes = await canvasToPNGBytes(v);
  const t = await getTesseract();
  await t.setParameters({
    tessedit_pageseg_mode: String(psm),
    tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    user_defined_dpi: "380",
  });
  const { data } = await t.recognize(bytes);
  return (data?.text || "").trim().toUpperCase().replace(/[^A-Z0-9]/g,"");
}

function emphasizeWhiteAdaptive(c){
  const {S,V}=sampleSV(c,3);
  const sThr = clamp01(Math.min(0.45, percentile(S, 0.35) + 0.05));
  const vThr = clamp01(Math.max(0.78, percentile(V, 0.82)));
  const w=c.width,h=c.height;
  const o=new OffscreenCanvas(w,h);
  const x=o.getContext("2d",{willReadFrequently:true});
  x.drawImage(c,0,0);
  const img=x.getImageData(0,0,w,h),d=img.data;
  for(let i=0;i<d.length;i+=4){
    const [hue,s,v]=rgb2hsv(d[i],d[i+1],d[i+2]);
    const on = (v>=vThr && s<=sThr);
    const val= on?255:0; d[i]=d[i+1]=d[i+2]=val;
  }
  x.putImageData(img,0,0);
  return o;
}
function emphasizeWhiteUltra(c){
  let mask = emphasizeWhiteAdaptive(c);
  const w=c.width, h=c.height;
  const ctx=c.getContext("2d",{willReadFrequently:true});
  const src=ctx.getImageData(0,0,w,h); const sd=src.data;
  const mctx=mask.getContext("2d",{willReadFrequently:true});
  const mimg=mctx.getImageData(0,0,w,h); const md=mimg.data;
  const grad = new Uint16Array(w*h);
  for(let y=0;y<h-1;y++){
    for(let x=0;x<w-1;x++){
      const i=(y*w+x)*4;
      const Y = 0.2126*sd[i] + 0.7152*sd[i+1] + 0.0722*sd[i+2];
      const iR=i+4, iD=i+w*4;
      const YR = 0.2126*sd[iR] + 0.7152*sd[iR+1] + 0.0722*sd[iR+2];
      const YD = 0.2126*sd[iD] + 0.7152*sd[iD+1] + 0.0722*sd[iD+2];
      const g = Math.abs(YR-Y) + Math.abs(YD-Y);
      grad[y*w+x] = g;
    }
  }
  const gVals = []; for(let i=0;i<grad.length;i+=16) gVals.push(grad[i]);
  gVals.sort((a,b)=>a-b);
  const gThr = gVals[Math.max(0, Math.floor(gVals.length*0.80))] || 24;
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const idx=(y*w+x)*4;
      const on = (md[idx]===255) && (grad[y*w+x] >= gThr);
      const v = on ? 255 : 0;
      md[idx]=md[idx+1]=md[idx+2]=v; md[idx+3]=255;
    }
  }
  mctx.putImageData(mimg,0,0);
  mask = closeMask(dilateMask(mask,1));
  return mask;
}
function emphasizeCyanHybrid(c){
  const peak = findHuePeak(c, 150, 230, 0.22, 0.22, 3);
  const center = (peak!=null) ? peak : 190;
  const half = 28;
  const a=(center-half+360)%360, b=(center+half)%360;
  const inBand = (h)=> a<=b ? (h>=a && h<=b) : (h>=a || h<=b);
  const w=c.width,h=c.height;
  const o=new OffscreenCanvas(w,h);
  const x=o.getContext("2d",{willReadFrequently:true});
  x.drawImage(c,0,0);
  const img=x.getImageData(0,0,w,h),d=img.data;
  for(let i=0;i<d.length;i+=4){
    const r=d[i], g=d[i+1], bch=d[i+2];
    const [hh,s,v]=rgb2hsv(r,g,bch);
    const max=Math.max(r,g,bch), min=Math.min(r,g,bch);
    const chroma=max-min;
    const rgbCyan = (g>bch? (g-bch) : (bch-g))<26 && (g>80 && bch>80) && (r+18 < Math.min(g,bch));
    const hsvCyan = inBand(hh) && s>=0.24 && v>=0.26;
    const on = hsvCyan || (rgbCyan && chroma>=25);
    const val = on?255:0;
    d[i]=d[i+1]=d[i+2]=val;
  }
  x.putImageData(img,0,0);
  return closeMask(o);
}
function emphasizeHueAdaptive(c, bandStart, bandEnd, fallbackCenter=190, halfWidth=22, sMin=0.30, vMin=0.30){
  const peak = findHuePeak(c, bandStart, bandEnd, sMin, vMin, 3);
  const center = (peak!=null) ? peak : fallbackCenter;
  const inBand = (h)=> {
    const a=(center-halfWidth+360)%360, b=(center+halfWidth)%360;
    return a<=b ? (h>=a && h<=b) : (h>=a || h<=b);
  };
  const w=c.width,h=c.height;
  const o=new OffscreenCanvas(w,h);
  const x=o.getContext("2d",{willReadFrequently:true});
  x.drawImage(c,0,0);
  const img=x.getImageData(0,0,w,h),d=img.data;
  for(let i=0;i<d.length;i+=4){
    const [hue,s,v]=rgb2hsv(d[i],d[i+1],d[i+2]);
    const on = (s>=sMin && v>=vMin && inBand(hue));
    const val= on?255:0; d[i]=d[i+1]=d[i+2]=val;
  }
  x.putImageData(img,0,0);
  return dilateMask(o,1);
}
const emphasizeRedAdaptive  = (c)=> emphasizeHueAdaptive(c,340,20,0,18,0.35,0.40);

/* ---------- OCR facades ---------- */
async function canvasToPNGBytes(c){ const b=await c.convertToBlob({type:"image/png"}); return new Uint8Array(await b.arrayBuffer()); }
async function ocrBytes(bytes, psm=6){
  const t=await getTesseract(); await t.setParameters({ tessedit_pageseg_mode:String(psm) });
  const {data}=await t.recognize(bytes); return (data?.text||"").replace(/\s+/g," ").trim();
}
async function ocrPrep(c,{psm=6,mode="bw",scale=2}={}){
  let v=c; if(scale&&scale!==1) v=scaleCanvas(v,scale);
  if(mode==="white") v=emphasizeWhiteAdaptive(v);
  else if(mode==="whiteStrong") v=emphasizeWhiteUltra(v);
  else if(mode==="cyanHybrid") v=emphasizeCyanHybrid(v);
  else if(mode==="redAdaptive") v=emphasizeRedAdaptive(v);
  else v=toBW(v);
  v=unsharp(v,0.56,1);
  const bytes=await canvasToPNGBytes(v);
  return await ocrBytes(bytes,psm);
}
async function ocrWordsCanvas(c,{psm=6,mode="white",scale=3}={}){
  let v=c; if(scale&&scale!==1) v=scaleCanvas(v,scale);
  if(mode==="white") v=emphasizeWhiteAdaptive(v);
  else if(mode==="whiteStrong") v=emphasizeWhiteUltra(v);
  else if(mode==="cyanHybrid") v=emphasizeCyanHybrid(v);
  else if(mode==="redAdaptive") v=emphasizeRedAdaptive(v);
  else v=toBW(v);
  v=unsharp(v,0.56,1);

  const bytes=await canvasToPNGBytes(v);
  const t=await getTesseract();
  await t.setParameters({
    tessedit_pageseg_mode:String(psm),
    preserve_interword_spaces:"1",
    tessedit_char_whitelist:OCR_CHAR_WHITELIST,
    user_defined_dpi:"360",
  });
  const {data}=await t.recognize(bytes);
  return Array.isArray(data?.words)?data.words:[];
}

/* ======= PSM=8 Single-word ======= */
async function ocrSingleNameWord(canvas){
  let v=scaleCanvas(canvas,5); v=unsharp(v,0.7,1); v=emphasizeWhiteUltra(v);
  const bytes=await canvasToPNGBytes(v);
  const t=await getTesseract();
  await t.setParameters({
    tessedit_pageseg_mode:"8",
    tessedit_char_whitelist:"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    load_system_dawg:"0", load_freq_dawg:"0",
    language_model_penalty_non_dict_word:"0",
    preserve_interword_spaces:"1",
    user_defined_dpi:"420",
  });
  const {data}=await t.recognize(bytes);
  return (data?.text||"").replace(/\s+/g,"").toUpperCase();
}
async function ocrSingleCodeWord(canvas,{cyan=true}={}){
  let v=scaleCanvas(canvas,5); v=unsharp(v,0.7,1);
  v = cyan ? emphasizeCyanHybrid(v) : emphasizeWhiteUltra(v);
  const bytes=await canvasToPNGBytes(v);
  const t=await getTesseract();
  await t.setParameters({
    tessedit_pageseg_mode:"8",
    tessedit_char_whitelist:"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    load_system_dawg:"0", load_freq_dawg:"0",
    language_model_penalty_non_dict_word:"0",
    preserve_interword_spaces:"1",
    user_defined_dpi:"390",
  });
  const {data}=await t.recognize(bytes);
  const tok=String((data?.text||"").trim()).toUpperCase().replace(/[^A-Z0-9]/g,"");
  return /^[A-Z0-9]{4,6}$/.test(tok) ? tok : null;
}

/* ===================== CODE helpers ===================== */
const CODE_LEN = /^[A-Z0-9]{4,6}$/;
const sanitizeCodeHard = (s)=> String(s||"").toUpperCase().replace(/[^A-Z0-9]/g,"");
const sanitizeCode = (s)=> sanitizeCodeHard(s)
  .replace(/[OQ]/g,"0").replace(/[IL]/g,"1")
  .replace(/Z/g,"2").replace(/S/g,"5").replace(/B/g,"8");
const looksLikeCode = (s)=> CODE_LEN.test(s) && /[A-Z0-9]/.test(s);
const normWordText  = (s)=> String(s||"").toUpperCase().replace(/\s+/g," ").trim();

function weightedEditDistance(a,b){
  a = String(a||""); b = String(b||"");
  const n=a.length, m=b.length;
  const dp = Array.from({length:n+1},()=>new Float32Array(m+1));
  for(let i=1;i<=n;i++) dp[i][0]=dp[i-1][0]+0.7;
  for(let j=1;j<=m;j++) dp[0][j]=dp[0][j-1]+0.7;
  for(let i=1;i<=n;i++){
    for(let j=1;j<=m;j++){
      const ca=a[i-1].toUpperCase(), cb=b[j-1].toUpperCase();
      const same = ca===cb;
      const amb = AMBIG_MAP.get(ca)?.includes(cb) || AMBIG_MAP.get(cb)?.includes(ca);
      const costSub = same ? 0 : (amb ? 0.15 : 1);
      dp[i][j] = Math.min(
        dp[i-1][j] + 0.7,
        dp[i][j-1] + 0.7,
        dp[i-1][j-1] + costSub
      );
    }
  }
  return dp[n][m];
}

/* ---- Ambig & variantes ---- */
const AMBIG_MAP = new Map(Object.entries({
  '0':'OQ', 'O':'0Q', 'Q':'0O',
  '1':'IL', 'I':'1L', 'L':'1I',
  '5':'S',  'S':'5',
  '2':'Z',  'Z':'2',
  '8':'B',  'B':'8',
  '9':'GC', 'C':'9G', 'G':'9C',
  'P':'DR', 'D':'PR', 'R':'PD',
  'K':'X',  'X':'K'
}));
const AMBIG_LETTERS = new Set(["W","Y","V","U","O","I","L","Z","S","B","Q","C","G","D","R","P","X","K"]);

/* ===================== Grouping & rows ===================== */
function groupWordsIntoRows(words){
  const items = words.map(w=>{
    const b=w?.bbox||w; const t=normWordText(w?.text||"");
    const midY=(b.y0+b.y1)/2, h=(b.y1-b.y0)||1;
    return {t,b,midY,h};
  }).filter(x=>x.t && x.b);
  items.sort((a,b)=> a.midY-b.midY);

  const rows=[];
  for(const w of items){
    const last=rows[rows.length-1];
    if(!last){ rows.push([w]); continue; }
    const lh = last.reduce((m,x)=>Math.max(m,x.h),1);
    const lmid = last.reduce((s,x)=>s+x.midY,0)/last.length;
    if(Math.abs(w.midY - lmid) <= lh*0.7) last.push(w);
    else rows.push([w]);
  }

  return rows.map(arr=>{
    arr.sort((a,b)=> a.b.x0 - b.b.x0);
    const x0=Math.min(...arr.map(x=>x.b.x0));
    const x1=Math.max(...arr.map(x=>x.b.x1));
    const y0=Math.min(...arr.map(x=>x.b.y0));
    const y1=Math.max(...arr.map(x=>x.b.y1));
    return {
      words:arr,
      box:{x0,y0,x1,y1},
      text:arr.map(x=>x.t).join(" ")
    };
  });
}

/* ===================== Fuzzy anchors (MAP CODE) ===================== */
function isCodeishWord(s){
  const u = String(s||"").toUpperCase().replace(/[^A-Z0-9]/g,'');
  if (!u) return false;
  if (u === 'MAPCODE') return true;
  const n = u.replace(/[0Q]/g,'O').replace(/^L/,'C');
  const dist = weightedEditDistance(n, 'CODE');
  return (n==='CODE') || (dist <= 1.1);
}
function isMapish(s){
  const u = String(s||"").toUpperCase()
    .replace(/[^A-Z0-9]/g,'')
    .replace(/0/g,'O').replace(/1/g,'I').replace(/5/g,'S');
  if (!u) return false;
  if (u === 'MAP') return true;
  const alts = new Set([
    u.replace(/^W/,'M'),
    u.replace(/^N/,'M'),
    u.replace(/^VV/,'W'),
    u.replace(/^MΛP$/,'MAP'),
  ]);
  if (alts.has('MAP')) return true;
  return weightedEditDistance(u, 'MAP') <= 0.9;
}
function isAnchorish(s){
  const u = String(s||"").toUpperCase().replace(/[:.]/g,'');
  return isMapish(u) || isCodeishWord(u) || u === 'MAPCODE';
}
function pickMapCodeRowFuzzy(rows){
  const hasMapish = (t)=> /\bMAP\b/.test(t) || /\bWAP\b/.test(t) || isMapish(t);
  const hasCodeF  = (t)=> String(t||'').split(/\s+/g).some(isCodeishWord);
  const cand = rows
    .map(r=>{
      const sMap  = hasMapish(r.text) ? 1 : 0;
      const sCode = hasCodeF(r.text)  ? 2 : 0;
      return { r, score: sMap + sCode + (sMap && sCode ? 0.5 : 0) };
    })
    .filter(x => x.score >= 2);
  if (!cand.length) return null;
  cand.sort((a,b)=> b.score - a.score);
  return cand[0].r;
}
function rightSubTextFromRowFuzzy(row){
  let idx = row.words.findIndex(w=>{
    const t=String(w.t||'').replace(/[:.]/g,'');
    return isCodeishWord(t) || t==='MAPCODE';
  });
  if(idx===-1){
    for(let i=row.words.length-1;i>=0;i--){
      const t=String(row.words[i].t||'').replace(/[:.]/g,'');
      if (isCodeishWord(t)) { idx=i; break; }
    }
  }
  if(idx===-1) return {text:"", afterBox:null};
  const codeBox = row.words[idx].b;
  const after = row.words.filter(w=> w.b.x0 >= codeBox.x1 - 2);
  const text = after.map(w=>w.t).join(" ");
  return {text, afterBox: codeBox};
}
function buildLineBoundedBox(anchorBox, lineBox, canvas){
  const padY = Math.round((lineBox.y1 - lineBox.y0) * 0.15);
  const x0 = Math.max(0, Math.floor(anchorBox.x1 + 1));
  const y0 = Math.max(0, Math.floor(lineBox.y0 - padY));
  const x1 = Math.min(canvas.width, Math.ceil(lineBox.x1 + (anchorBox.x1 - anchorBox.x0)));
  const y1 = Math.min(canvas.height, Math.ceil(lineBox.y1 + padY));
  return { x0, y0, x1, y1 };
}

/* ========= CODE: extraction ========= */
function codeCandidatesFromText(txt){
  const out=[]; const U=String(txt||"").toUpperCase();
  const re1=/(?:MAP\s*CODE\s*[:\-]?\s*)([A-Z0-9]{4,6})\b/g; let m;
  while((m=re1.exec(U))) out.push(m[1]);
  const re2=/(?:MAP\s+(?:C|G|Q|L|0)[O0Q]D[EB6O]?E?\s*[:\-]?\s*)([A-Z0-9]{4,6})\b/g;
  while((m=re2.exec(U))) out.push(m[1]);
  return out;
}
function extractInlineCodeFromTLWhiteText(tlWhite) {
  const U = String(tlWhite || "").toUpperCase();
  let m = /(?:C|G|Q|L|0)[O0Q]D[EB6O]?E?[^A-Z0-9]{0,4}([A-Z0-9]{4,6})\b/.exec(U);
  if (m) return sanitizeCodeHard(m[1]);
  const rx = /(?:[MWVN]?AP[^A-Z0-9]{0,6}(?:C|G|Q|L|0)[O0Q]D[EB6O]?E?[^A-Z0-9]{0,4})([A-Z0-9]{4,6})\b/;
  m = rx.exec(U);
  if (m) return sanitizeCodeHard(m[1]);
  const rawToks = U.split(/[^A-Z0-9:.]+/g).filter(Boolean);
  const strip = (s)=> s.replace(/[^A-Z0-9]/g,'');
  const stripAnchor = (s)=> s.replace(/[:.]/g,'');
  const isTokCodeish = (s)=> isCodeishWord(stripAnchor(s));
  for (let i = 0; i < rawToks.length; i++) {
    if (!isTokCodeish(rawToks[i])) continue;
    let acc = "";
    for (let k = i + 1; k < rawToks.length && acc.length < 6; k++) {
      acc += strip(rawToks[k]);
      if (acc.length >= 4 && acc.length <= 6) {
        const cand = sanitizeCodeHard(acc);
        if (/^[A-Z0-9]{4,6}$/.test(cand)) return cand;
      }
    }
  }
  return null;
}
async function extractCodeFromTopLeft(bmp, roiNorm, log = () => {}) {
  const cTL = crop(bmp, roiNorm);
  const [wordsC, wordsW, wordsWS, txtC, txtW] = await Promise.all([
    ocrWordsCanvas(cTL,{psm:6,mode:"cyanHybrid",  scale:3}),
    ocrWordsCanvas(cTL,{psm:6,mode:"white",       scale:3}),
    ocrWordsCanvas(cTL,{psm:6,mode:"whiteStrong", scale:3}),
    ocrPrep(cTL,{psm:6,mode:"cyanHybrid",  scale:3}),
    ocrPrep(cTL,{psm:6,mode:"whiteStrong", scale:3}),
  ]);

  log('TL: OCR words', { cyan: wordsC.length, white: wordsW.length, whiteStrong: wordsWS.length });
  log('TL: OCR raw texts', { txtC, txtW });

  const allWords = [...wordsC, ...wordsW, ...wordsWS];
  const rows = groupWordsIntoRows(allWords);
  const row  = pickMapCodeRowFuzzy(rows);

  log('TL: rows picked', { rows: rows.length, hasRow: !!row, rowBox: row?.box });

  const anchorInline = extractInlineCodeFromTLWhiteText(txtW);
  log('TL: inline anchor', { anchorInline });

  let anchorRight = null;
  if (row){
    const { text: rightText, afterBox: codeBox } = rightSubTextFromRowFuzzy(row);
    const mm = /\b([A-Z0-9]{4,6})\b/.exec(String(rightText||"").replace(/^[A-Z]+[:.]?/,"").trim());
    if (mm) anchorRight = sanitizeCodeHard(mm[1]);
    log('TL: right-of-anchor', { rightText, anchorRight, hasCodeBox: !!codeBox });

    const candScores = new Map();
    const pushCand = (t, base)=>{ 
      const s = scoreToken(t, base); 
      if (s>0){ 
        const k = sanitizeCodeHard(t); 
        candScores.set(k, Math.max(candScores.get(k)||0, s)); 
      }
    };

    if (anchorInline && looksLikeCode(anchorInline)) {
      pushCand(anchorInline, 100);
      for (const v of rectifyWhiteCodeVariants(anchorInline)) pushCand(v, 35);
    }

    const anchorSig = estimateWhiteSignature(cTL, allWords);

    if (codeBox){
      const base = buildLineBoundedBox(codeBox, row.box, cTL);
      const wlen = base.x1 - base.x0;
      const vPad  = Math.round((base.y1 - base.y0) * 0.12);
      const windows = [
        base,
        { ...base, x0: Math.min(base.x0 + Math.round(wlen*0.35), cTL.width-1), x1: Math.min(base.x1 + Math.round(wlen*0.35), cTL.width) },
        { ...base, x0: Math.min(base.x0 + Math.round(wlen*0.70), cTL.width-1), x1: Math.min(base.x1 + Math.round(wlen*0.70), cTL.width) },
        { ...base, y0: Math.max(0, base.y0 - vPad), y1: Math.min(cTL.height, base.y1 - vPad) },
        { ...base, y0: Math.max(0, base.y0 + vPad), y1: Math.min(cTL.height, base.y1 + vPad) },
      ];

      for (const w of windows){
        const W = Math.max(1, w.x1 - w.x0), H = Math.max(1, w.y1 - w.y0);
        if (W < 8 || H < 8) continue;
        const sub = new OffscreenCanvas(W, H);
        ctxRF(sub).drawImage(cTL, w.x0, w.y0, W, H, 0, 0, W, H);

        if (anchorSig){
          const tok7 = await ocrWhiteSignature(sub, anchorSig, 7, 3);
          if (tok7 && /^[A-Z0-9]{4,6}$/.test(tok7)) {
            pushCand(tok7, anchorInline ? 5.2 : 6.0);
            for (const v of rectifyWhiteCodeVariants(tok7)) pushCand(v, anchorInline ? 4.8 : 5.6);
          }
          if (!candScores.size){
            const tok8 = await ocrWhiteSignature(sub, anchorSig, 8, 4);
            if (tok8 && /^[A-Z0-9]{4,6}$/.test(tok8)) {
              pushCand(tok8, anchorInline ? 4.9 : 5.6);
              for (const v of rectifyWhiteCodeVariants(tok8)) pushCand(v, anchorInline ? 4.5 : 5.2);
            }
          }
        }

        const pSingle = await Promise.allSettled([
          ocrSingleCodeWord(sub,{cyan:true}),
          ocrSingleCodeWord(sub,{cyan:false}),
        ]);
        pSingle.forEach(r => {
          const tok=r.value;
          if(tok){
            pushCand(tok, anchorInline ? 4.6 : 5.0);
            for (const v of rectifyWhiteCodeVariants(tok)) pushCand(v, anchorInline ? 4.7 : 5.3);
          }
        });

        const pRegex = await Promise.allSettled([
          ocrPrep(sub,{psm:6,mode:"cyanHybrid", scale:3}),
          ocrPrep(sub,{psm:7,mode:"cyanHybrid", scale:3}),
          ocrPrep(sub,{psm:6,mode:"whiteStrong",scale:3}),
        ]);
        pRegex.forEach(r=>{
          const txt = r.value||"";
          for(const t of codeCandidatesFromText(txt)) {
            pushCand(t, anchorInline ? 5.5 : 6.2);
            for (const v of rectifyWhiteCodeVariants(t)) pushCand(v, anchorInline ? 5.3 : 6.0);
          }
          const m1 = /\b([A-Z0-9]{4,6})\b/.exec(txt);
          if(m1) pushCand(m1[1], 2.8);
        });
      }
    }

    const list=[];
    let best = null, bestScore = -1;
    candScores.forEach((s,t)=>{ list.push({tok:t,score:s}); if(s>bestScore){ best=t; bestScore=s; } });
    list.sort((a,b)=> b.score - a.score);

    log('TL: candidates', { count: list.length, top5: list.slice(0,5) });

    return { best: best ? sanitizeCodeHard(best) : null, candidates: list.slice(0,12), inline: anchorInline||null, anchorRight, tlTexts:{cyan:txtC, white:txtW} };
  }

  const candScores = new Map();
  const pushCand = (t, base)=>{ 
    const s = scoreToken(t, base); 
    if (s>0){ const k = sanitizeCodeHard(t); candScores.set(k, Math.max(candScores.get(k)||0, s)); }
  };
  if (anchorInline && looksLikeCode(anchorInline)) {
    pushCand(anchorInline, 100);
    for (const v of rectifyWhiteCodeVariants(anchorInline)) pushCand(v, 35);
  }

  let best=null, bestScore=-1, list=[];
  candScores.forEach((s,t)=>{ list.push({tok:t,score:s}); if(s>bestScore){ best=t; bestScore=s; } });
  list.sort((a,b)=> b.score - a.score);

  log('TL: no-row candidates', { count: list.length, top5: list.slice(0,5) });
  return { best: best ? sanitizeCodeHard(best) : null, candidates: list.slice(0,12), inline: anchorInline||null, anchorRight:null, tlTexts:{cyan:txtC, white:txtW} };
}

/* ===================== TIME helpers ===================== */
function isTimeLike(s){ return String(s||"").toUpperCase().replace(/[^A-Z]/g,'') === 'TIME'; }
function isSecLike(s){
  const U=String(s||"").toUpperCase().replace(/[^A-Z]/g,'');
  return U==='SEC' || U==='SE' || U==='S';
}
function normalizeDigitsForTime(s){
  if(!s) return '';
  let t=String(s).toUpperCase();
  t=t.replace(/[OQ]/g,'0').replace(/[IL|]/g,'1').replace(/S/g,'5').replace(/B/g,'8').replace(/Z/g,'2');
  t=t.replace(/[^\d.,]/g,' ');
  t=t.replace(/[,]/g,'.').replace(/\s+/g,' ').trim();
  return t;
}
function parseTimesFromString(raw){
  const out=[];
  const U = normalizeDigitsForTime(raw);
  let m; LOOSE_TIME_RE.lastIndex=0;
  while((m=LOOSE_TIME_RE.exec(U))){
    const int=m[1], dec=m[2];
    if(!int) continue;
    const ii = Math.min(9999, parseInt(int,10));
    let dd = dec || '';
    if (dd.length===1) dd = dd + '0';
    if (dd.length>2) dd = dd.slice(0,2);
    const v = parseFloat(`${ii}.${dd}`);
    if (Number.isFinite(v)) out.push({v, raw:m[0], fixed:dd.length===2});
  }
  return out;
}
function scoreTimeCandidate(c, ctx){
  // ctx: {source:'banner-right-of-TIME'|'banner-left-of-SEC'|'banner-between'|'banner-full'|'tr-white'|'tr-red'|'tr-full'}
  let s = 1.0;
  if (c.fixed) s += 0.6; else s += 0.25;
  switch(ctx.source){
    case 'banner-between': s += 1.15; break;
    case 'banner-right-of-TIME': s += 1.05; break;
    case 'banner-left-of-SEC': s += 1.0; break;
    case 'tr-white': s += 0.7; break;
    case 'tr-red': s += 0.8; break;
    case 'banner-full': s += 0.35; break;
    case 'tr-full': s += 0.35; break;
  }
  if (c.v < 10) s -= 0.15;
  return s;
}
function pickBestTime(cands){
  if(!cands.length) return null;

  const groups = new Map();
  for (const c of cands){
    const key = c.v.toFixed(2);
    let arr = groups.get(key);
    if (!arr) { arr = []; groups.set(key, arr); }
    arr.push(c);
  }

  let bestKey = null, bestScore = -1;
  groups.forEach((arr, key) => {
    const base = arr.reduce((a,x)=> a + x.score, 0);
    const bonusVotes = Math.max(0, arr.length - 1) * 0.45;
    const sc = base + bonusVotes;
    if (sc > bestScore){ bestScore = sc; bestKey = key; }
  });
  return bestKey ? parseFloat(bestKey) : null;
}

/* ---- TIME/SEC fuzzy ---- */
function findWordFuzzy(words, wantFn){
  let best=null, bestX=Infinity;
  for (const w of words||[]){
    const t=normWordText(w?.text||"").replace(/[:]/g,"");
    if (wantFn(t)) {
      const b=w?.bbox||w;
      if (b.x0 < bestX){ best=w; bestX=b.x0; }
    }
  }
  return best?.bbox || best || null;
}

/* ---- OCR numbers ---- */
async function ocrSingleNumber(canvas){
  let v=scaleCanvas(canvas,4); v=unsharp(v,0.7,1); v=emphasizeWhiteAdaptive(v);
  const bytes=await canvasToPNGBytes(v);
  const t=await getTesseract();
  await t.setParameters({
    tessedit_pageseg_mode:"8",
    tessedit_char_whitelist:"0123456789.,",
    load_system_dawg:"0", preserve_interword_spaces:"1",
    user_defined_dpi:"360",
  });
  const {data}=await t.recognize(bytes);
  const raw=(data?.text||"").trim();
  const parsed = parseTimesFromString(raw);
  if (parsed[0]) return parsed[0].v;
  return null;
}
async function ocrNumberLine(canvas, mode='white'){
  let v=scaleCanvas(canvas,3);
  v = (mode==='red') ? emphasizeRedAdaptive(v) : emphasizeWhiteUltra(v);
  v = unsharp(v,0.7,1);
  const bytes=await canvasToPNGBytes(v);
  const t=await getTesseract();
  await t.setParameters({
    tessedit_pageseg_mode:"7",
    tessedit_char_whitelist:"0123456789.,",
    preserve_interword_spaces:"1",
    user_defined_dpi:"380",
  });
  const {data}=await t.recognize(bytes);
  const arr = parseTimesFromString(data?.text||"");
  return arr.map(x=>x.v);
}

/* ===================== TIME (Banner→TR) ===================== */
async function extractTimeBannerFirst(bmp, roiBanner, roiTR){
  const cBN=crop(bmp,roiBanner);

  const wordsBN=await ocrWordsCanvas(cBN,{psm:6,mode:"white",scale:3});
  const timeBox = findWordFuzzy(wordsBN, isTimeLike);
  const secBox  = findWordFuzzy(wordsBN, isSecLike);
  const cands=[];

  if (timeBox || secBox){
    if (timeBox && secBox){
      const lineH = Math.max(1,(timeBox.y1-timeBox.y0));
      const y0 = Math.max(0, Math.min(timeBox.y0, secBox.y0) - Math.round(lineH*0.25));
      const y1 = Math.min(cBN.height, Math.max(timeBox.y1, secBox.y1) + Math.round(lineH*0.25));
      const x0 = Math.max(0, Math.min(timeBox.x1, secBox.x0));
      const x1 = Math.min(cBN.width, Math.max(timeBox.x1, secBox.x0) + Math.round((timeBox.x1-timeBox.x0)*3.5));
      if (x1>x0+6 && y1>y0+4){
        const sub=new OffscreenCanvas(x1-x0,y1-y0);
        ctxRF(sub).drawImage(cBN,x0,y0,sub.width,sub.height,0,0,sub.width,sub.height);
        const [n1, n2] = await Promise.all([
          ocrSingleNumber(sub),
          (async()=>{ const arr=await ocrNumberLine(sub,'white'); return arr[0]||null; })()
        ]);
        [n1,n2].filter(Number.isFinite).forEach(v=>cands.push({v,score:scoreTimeCandidate({v, fixed:true},{source:'banner-between'})}));
      }
    }
    if (timeBox){
      const h = Math.max(1,(timeBox.y1-timeBox.y0));
      let x0 = Math.min(cBN.width-1, Math.max(0, Math.floor(timeBox.x1 + h*0.15)));
      const readH = Math.round(h*1.8);
      let y0 = Math.max(0, Math.round(((timeBox.y0+timeBox.y1)/2) - readH/2));
      if(y0+readH>cBN.height) y0=Math.max(0,cBN.height-readH);

      const widths = [Math.round(h*9), Math.round(h*11)];
      for (const rw of widths){
        const subW = Math.min(rw, cBN.width-x0);
        if (subW<8) continue;
        const sub=new OffscreenCanvas(subW,readH);
        ctxRF(sub).drawImage(cBN,x0,y0,subW,readH,0,0,subW,readH);

        const [n1, arr] = await Promise.all([
          ocrSingleNumber(sub),
          ocrNumberLine(sub,'white')
        ]);
        [n1, ...arr].filter(Number.isFinite).forEach(v=>cands.push({v,score:scoreTimeCandidate({v, fixed:true},{source:'banner-right-of-TIME'})}));

        x0 = Math.min(cBN.width-1, x0 + Math.round(h*0.6));
      }
    }
    if (secBox){
      const h = Math.max(1,(secBox.y1-secBox.y0));
      const readH = Math.round(h*1.8);
      let y0 = Math.max(0, Math.round(((secBox.y0+secBox.y1)/2) - readH/2));
      if(y0+readH>cBN.height) y0=Math.max(0,cBN.height-readH);

      let w = Math.round(h*10);
      let x0 = Math.max(0, Math.min(cBN.width-1, Math.floor(secBox.x0 - w - h*0.2)));
      if (secBox.x0 - x0 < 8) { w = Math.max(8, Math.floor(secBox.x0 - 2)); x0 = 0; }
      const subW = Math.min(w, cBN.width-x0);
      if (subW>=8){
        const sub=new OffscreenCanvas(subW,readH);
        ctxRF(sub).drawImage(cBN,x0,y0,subW,readH,0,0,subW,readH);

        const [n1, arr] = await Promise.all([
          ocrSingleNumber(sub),
          ocrNumberLine(sub,'white')
        ]);
        [n1, ...arr].filter(Number.isFinite).forEach(v=>cands.push({v,score:scoreTimeCandidate({v, fixed:true},{source:'banner-left-of-SEC'})}));
      }
    }
  }

  const txtBN = await ocrPrep(cBN,{psm:6,mode:"white",scale:3});
  for (const c of parseTimesFromString(txtBN)){
    cands.push({v:c.v, score:scoreTimeCandidate(c,{source:'banner-full'})});
  }

  const cTR=crop(bmp,roiTR);
  const [txtTRw, txtTRr] = await Promise.all([
    ocrPrep(cTR,{psm:6,mode:"white",scale:2}).catch(()=> ""),
    ocrPrep(cTR,{psm:6,mode:"redAdaptive",scale:2}).catch(()=> "")
  ]);
  for (const c of parseTimesFromString(txtTRw)){
    cands.push({v:c.v, score:scoreTimeCandidate(c,{source:'tr-white'})});
  }
  for (const c of parseTimesFromString(txtTRr)){
    cands.push({v:c.v, score:scoreTimeCandidate(c,{source:'tr-red'})});
  }

  const extraTR = await ocrNumberLine(cTR, 'red').catch(()=>[]);
  extraTR.forEach(v=>cands.push({v,score:scoreTimeCandidate({v, fixed:true},{source:'tr-full'})}));

  const time = pickBestTime(cands);

  const texts = { banner: txtBN, topRight: (txtTRr || txtTRw || "") };
  return { time, texts };
}

/* ===================== NAME ===================== */
const NAME_STOP = new Set([
  "HOLD","TOGGLE","HUD","PREVIEW","INVISIBLE","QUICK","RESET","RESTART",
  "LEADERBOARD","SPECTATE","INVINCIBLE","PRACTICE","SERVER","LEVEL","WORLD","RECORD",
  "MADE","BY","MAP","CODE","TIME","SPLIT","DISCORD","BHOP","CLIMB","SEC","TOP",
  "EASY","MEDIUM","HARD","EXTREME","MISSION","COMPLETE","LSHIFT","SHIFT","CTRL",
  "R","E","F","A","Q","V","ON","OFF","THE","VIDEO","CANNOT","BE","EMBEDDED"
]);
const mapNameLetter = (s)=> String(s||"")
  .toUpperCase()
  .replace(/[^A-Z0-9 ]/g," ")
  .replace(/[0O]/g,"O").replace(/[1I]/g,"I").replace(/5/g,"S").replace(/8/g,"B").replace(/2/g,"Z")
  .replace(/\s+/g," ").trim();
function tokensFrom(U){
  const arr=(U.match(/\b[A-Z][A-Z0-9]{2,}\b/g)||[]);
  return arr.filter(t=>!NAME_STOP.has(t));
}
function bannerNameHeuristic(bannerText) {
  const U = mapNameLetter(bannerText);
  const re = /([A-Z0-9]{3,})\s+M[1I]S{1,2}[I1][O0]N(?:\s+COMPLETE[! ]*)?/;
  const m = re.exec(U);
  if (m && !NAME_STOP.has(m[1])) return m[1];
  const parts = U.split(/\bTIME\b/);
  if (parts.length > 1) {
    const left = parts[0].trim();
    const toks = tokensFrom(left);
    if (toks.length) return toks[toks.length - 1];
  }
  const toks = tokensFrom(U);
  return toks.length ? toks[0] : null;
}
const DIGIT_TO_LETTER = { "0":"O","1":"I","5":"S","8":"B","2":"Z" };
function smartDigitToLetter(tok){
  const T=String(tok||"").toUpperCase();
  const letters = (T.match(/[A-Z]/g)||[]).length;
  const digits  = (T.match(/[0-9]/g)||[]).length;
  if(!T) return T;
  return (letters >= digits) ? T.replace(/[01582]/g, ch => DIGIT_TO_LETTER[ch] || ch) : T;
}
function namesEqual(a,b){
  const norm=(s)=>String(s||"").normalize("NFD")
    .replace(/\p{Diacritic}/gu,"").toUpperCase()
    .replace(/[^A-Z0-9 ]/g," ").replace(/\s+/g," ").trim();
  return !!a && !!b && norm(a)===norm(b);
}
function isMissionLike(s){
  const U = String(s||"").toUpperCase().replace(/[^A-Z0-9]/g,'')
    .replace(/0/g,'O').replace(/1/g,'I').replace(/5/g,'S');
  return /M[1I]S{1,2}[I1]O?N/.test(U);
}
async function extractNameSeeds(bmp, roiBL, roiBN, roiTR){
  const texts = { banner:'', bottomLeft:'', topRight:'' };

  const cBN = crop(bmp, roiBN);
  const wordsBN = await ocrWordsCanvas(cBN, { psm: 6, mode: "white", scale: 3 });
  let bannerSeed = null;

  if (Array.isArray(wordsBN) && wordsBN.length){
    const W = wordsBN.map(w => {
      const t = normWordText(w?.text||''); const tFix = mapNameLetter(t);
      return { t, tFix, b: (w?.bbox||w) };
    }).filter(w => w.tFix);

    for (let i=0;i<W.length;i++){
      if (isMissionLike(W[i].tFix)){
        for (let j=i-1; j>=0; j--){
          const prev = W[j];
          const rough = (prev.tFix||'').replace(/[^A-Z0-9 ]/g,'').split(' ').pop()||'';
          if (rough && !NAME_STOP.has(rough) && rough.length>=3){
            const pad = Math.round((prev.b.y1 - prev.b.y0) * 0.35);
            const sub = cropBox(cBN, prev.b, pad);
            const refined = smartDigitToLetter(await ocrSingleNameWord(sub));
            const finalTok = (refined && refined.length>=3) ? refined : rough;
            bannerSeed = finalTok;
            break;
          }
        }
        if (bannerSeed) break;
      }
    }

    if (!bannerSeed){
      const idxTime = W.findIndex(x => isTimeLike(x.tFix));
      const upto = idxTime>0 ? W.slice(0, idxTime) : W;
      const toks = tokensFrom(mapNameLetter(upto.map(x=>x.t).join(' ')));
      if (toks.length) bannerSeed = toks[toks.length-1];
    }
  }

  texts.banner = await ocrPrep(cBN, { psm: 6, mode: "white", scale: 3 });
  if (!bannerSeed){ const h = bannerNameHeuristic(texts.banner); if (h) bannerSeed = h; }

  const cBL = crop(bmp, roiBL);
  texts.bottomLeft = await ocrPrep(cBL, { psm: 7, mode: "white", scale: 3 });
  const blTokens = tokensFrom(mapNameLetter(texts.bottomLeft));

  const cTR = crop(bmp, roiTR);
  texts.topRight = await ocrPrep(cTR, { psm: 6, mode: "redAdaptive", scale: 2 });
  const TRU = mapNameLetter(texts.topRight);
  const mTR = /([A-Z0-9]{3,})\s+\d{1,4}[.,]\d{2}\s*SEC?/.exec(TRU);
  const trTokens = [];
  if (mTR && !NAME_STOP.has(mTR[1])) trTokens.push(mTR[1]); else {
    const t = tokensFrom(TRU); if (t[0]) trTokens.push(t[0]);
  }

  const bestOCR = bannerSeed || blTokens[0] || trTokens[0] || null;
  return { bannerSeed, blTokens, trTokens, bestOCR, texts };
}

/* ===================== AUTOCOMPLETE API ===================== */
const __autoCache = { users:new Map(), codes:new Map() };
function apiBaseFrom(payload){
  const base = String(payload?.apiBase || "").trim();
  return base ? base.replace(/\/+$/,'') : "";
}
async function fetchJSON(url){
  try{
    const r = await fetch(url, { credentials:"same-origin", cache:"no-store" });
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  }catch(_){ return null; }
}

/* Users */
function displayToPrimaryName(s){
  const str = String(s||"");
  const idx = str.indexOf(" (");
  return (idx>=0 ? str.slice(0,idx) : str).trim();
}
function normNameCompare(s){
  return s.toUpperCase().normalize("NFD").replace(/\p{Diacritic}/gu,"").replace(/[^A-Z0-9]/g,"");
}
function coerceUserList(json){
  const pickFromObj = (o) =>
    o?.display ?? o?.name ?? o?.label ?? o?.username ?? o?.nickname ?? o?.text ?? o?.title ?? o?.value ?? null;
  if (!json) return [];
  if (Array.isArray(json)) {
    return json.map(it => {
      if (typeof it === "string") return it;
      if (Array.isArray(it)) return it[1] ?? it[0] ?? null;
      if (it && typeof it === "object") return pickFromObj(it);
      return null;
    }).filter(Boolean);
  }
  if (typeof json === "object") {
    const arr = json.results ?? json.items ?? json.data ?? json.users ?? json.suggestions ?? json.options ?? null;
    if (Array.isArray(arr)) return coerceUserList(arr);
  }
  return [];
}
async function autocompleteUsers(base, q, pageSize=8){
  const key = `${base}|${q}|${pageSize}`;
  if (__autoCache.users.has(key)) return __autoCache.users.get(key);
  const url = `${base}/api/autocomplete/users?value=${encodeURIComponent(q)}&page_size=${pageSize}`;
  const json = await fetchJSON(url);
  const list = coerceUserList(json);
  __autoCache.users.set(key, list);
  return list;
}

/* Codes */
function coerceCodeList(json){
  const grab = (x) => {
    if (typeof x === "string") return x;
    if (Array.isArray(x)) return x[0] ?? x[1] ?? null;
    if (x && typeof x === "object") return x.code ?? x.value ?? x.label ?? x.text ?? x.id ?? null;
    return null;
  };
  if (!json) return [];
  if (Array.isArray(json)) return json.map(grab).map(sanitizeCodeHard).filter(Boolean);
  if (typeof json === "object") {
    const arr = json.results ?? json.items ?? json.data ?? json.codes ?? null;
    if (Array.isArray(arr)) return arr.map(grab).map(sanitizeCodeHard).filter(Boolean);
  }
  return [];
}
async function autocompleteCodes(base, q, limit=10){
  const key = `${base}|${q}|${limit}`;
  if (__autoCache.codes.has(key)) return __autoCache.codes.get(key);
  const url = `${base}/api/autocomplete/map-codes?search=${encodeURIComponent(q)}&limit=${limit}`;
  const json = await fetchJSON(url);
  const list = coerceCodeList(json);
  __autoCache.codes.set(key, list);
  return list;
}

/* -------- Code scoring helpers -------- */
function scoreToken(tok, base=1){
  const T = sanitizeCodeHard(tok);
  if (!looksLikeCode(T)) return -1;
  let sc = base + ((T.match(/[A-Z]/g)||[]).length)*0.25 + ((T.match(/\d/g)||[]).length)*0.2;
  if (/\d{3,}/.test(T)) sc += 0.5;
  if (/^\d{3}[A-Z]{2}$/.test(T)) sc += 0.75; else sc -= 0.25;
  if (AMBIG_LETTERS.has(T[0]) || AMBIG_LETTERS.has(T[T.length-1])) sc -= 0.10;
  if ([...T].every(ch => AMBIG_LETTERS.has(ch))) sc -= 0.35;
  if (T.length === 5){
    for (let i=0;i<3;i++) if(/[A-Z]/.test(T[i])) sc -= 0.24;
    for (let i=3;i<5;i++) if(/\d/.test(T[i])) sc -= 0.20;
  }
  if (T === "CODE") sc = -1;
  return sc;
}
function normalizeFiveCharPattern(tok){
  const T = sanitizeCodeHard(tok);
  if (T.length !== 5) return T;
  const mapL2D = {O:'0',Q:'0',I:'1',L:'1',Z:'2',S:'5',B:'8',G:'9',C:'9'};
  const mapD2L = {'0':'O','1':'I','2':'Z','5':'S','8':'B','9':'G'};
  const a = T.split('');
  for (let i=0;i<3;i++) a[i] = mapL2D[a[i]] || a[i];
  for (let i=3;i<5;i++) a[i] = mapD2L[a[i]] || a[i];
  return a.join('');
}
function codeSimilarityScore(seed, cand){
  const A = sanitizeCodeHard(seed), B = sanitizeCodeHard(cand);
  if(!A || !B) return 0;
  const dist = weightedEditDistance(A, B);
  let s = 3.9 - dist;
  if(B.startsWith(A.slice(0,2))) s += 0.6;
  if(B.endsWith(A.slice(-2)))   s += 0.4;
  const digsA=A.replace(/\D/g,""), digsB=B.replace(/\D/g,"");
  const common = new Set(digsA.split("").filter(x=>digsB.includes(x))).size;
  s += common*0.25;
  return s;
}
function rectifyWhiteCodeVariants(tok){
  const T = sanitizeCodeHard(tok);
  const out = new Set();
  if(!T) return [];
  out.add(T);
  if (T.length === 5){
    const arr = T.split('');
    for (let i=0;i<3;i++){
      const ch = arr[i];
      if (/[A-Z]/.test(ch)){
        if ('OQ'.includes(ch)) arr[i] = '0';
        else if ('IL'.includes(ch)) arr[i] = '1';
        else if (ch === 'Z') arr[i] = '2';
        else if (ch === 'S') arr[i] = '5';
        else if (ch === 'B') arr[i] = '8';
        else if (ch === 'C' || ch === 'G') arr[i] = '9';
      }
    }
    for (let i=3;i<5;i++){
      const ch = arr[i];
      if (/\d/.test(ch)){
        if (ch === '0') arr[i] = 'O';
        else if (ch === '1') arr[i] = 'I';
        else if (ch === '2') arr[i] = 'Z';
        else if (ch === '5') arr[i] = 'S';
        else if (ch === '8') arr[i] = 'B';
        else if (ch === '9') arr[i] = 'G';
      }
    }
    const base = arr.join('');
    out.add(base);
    const altSets = [
      new Set(['P','D','R']),
      new Set(['C','G','9'])
    ];
    for (let i=3;i<5;i++){
      const ch = base[i];
      const alts = altSets[0].has(ch) ? altSets[0]
                 : altSets[1].has(ch) ? altSets[1] : null;
      if(!alts) continue;
      for (const a of alts){
        out.add(base.slice(0,i)+a+base.slice(i+1));
      }
    }
  }
  for (let i=0;i<T.length;i++){
    const ch=T[i];
    const group = AMBIG_MAP.get(ch);
    if(!group) continue;
    for(const alt of group.split('')){
      out.add(T.slice(0,i)+alt+T.slice(i+1));
    }
  }
  return [...out]
    .map(sanitizeCodeHard)
    .filter(x => /^[A-Z0-9]{4,6}$/.test(x))
    .slice(0,24);
}

/* ===================== NAME autocomplete ===================== */
function nameVariantPrefixes(tok){
  const U = tok?.toUpperCase?.().replace(/[^A-Z0-9]/g,"") || "";
  if(!U) return [];
  const swaps = {'0':'O','O':'0','1':'I','I':'1','5':'S','S':'5','8':'B','B':'8','2':'Z','Z':'2'};
  const alts = new Set([U]);
  for(let i=0;i<U.length;i++){
    const a = swaps[U[i]];
    if(a) alts.add(U.slice(0,i)+a+U.slice(i+1));
  }
  const out = [];
  for(const v of alts){
    if(v.length>=5) out.push(v.slice(0,5));
    if(v.length>=4) out.push(v.slice(0,4));
    if(v.length>=3) out.push(v.slice(0,3));
  }
  return [...new Set(out)].sort((a,b)=> b.length - a.length || (a<b?-1:1)).slice(0,10);
}
function jaroWinkler(s1, s2){
  s1=String(s1||""); s2=String(s2||"");
  const mDist = Math.floor(Math.max(s1.length, s2.length)/2) - 1;
  const s1m = new Array(s1.length).fill(false);
  const s2m = new Array(s2.length).fill(false);
  let m=0, t=0;
  for(let i=0;i<s1.length;i++){
    const start=Math.max(0,i-mDist), end=Math.min(i+mDist+1,s2.length);
    for(let j=start;j<end;j++) if(!s2m[j] && s1[i]===s2[j]){ s1m[i]=s2m[j]=true; m++; break; }
  }
  if(m===0) return 0;
  let k=0;
  for(let i=0;i<s1.length;i++) if(s1m[i]){
    while(!s2m[k]) k++;
    if(s1[i]!==s2[k]) t++;
    k++;
  }
  const jaro = (m/s1.length + m/s2.length + (m - t/2)/m)/3;
  let p=0; for(; p<Math.min(4, s1.length, s2.length) && s1[p]===s2[p]; p++);
  return jaro + p*0.1*(1-jaro);
}
function userSimilarityScore(seed, candPrimary){
  const A = normNameCompare(seed);
  const B = normNameCompare(candPrimary);
  if(!A || !B) return 0;
  return jaroWinkler(A, B) * 3.5 + (B.startsWith(A.slice(0,3)) ? 0.6 : 0);
}
function textBoostScore(candidate, txtBanner, txtBL){
  const C = normNameCompare(candidate);
  if(!C) return 0;
  const B = normNameCompare(txtBanner||"");
  const L = normNameCompare(txtBL||"");
  let s = 0;
  if (B.includes(C)) s += 0.9;
  if (L.includes(C)) s += 0.8;
  return s;
}

const NAME_SIM_ACCEPT_STRICT = 2.6;
const NAME_SIM_ACCEPT_SOFT   = 2.2;
let W_BN = 0.80, W_BL = 0.60, W_TR = 0.40;

async function refineNameWithAutocompleteV2(base, bannerSeed, blTokens=[], trTokens=[], dbg){
  const bn = String(bannerSeed||'').trim();
  const bl = Array.isArray(blTokens) ? blTokens.slice(0,3) : [];
  const tr = Array.isArray(trTokens) ? trTokens.slice(0,2) : [];

  if (!bn || bn.length < 4) { W_BL = 0.75; W_TR = 0.45; }

  const tried = new Set();
  const candidates = new Map();

  function pushCandidate(name, s_bn, s_bl, s_tr, boost=0){
    const key = displayToPrimaryName(name||'');
    if(!key) return;
    const prev = candidates.get(key) || {score:-1,bn:0,bl:0,tr:0,boost:0};
    const score = (W_BN*(s_bn||0)) + (W_BL*(s_bl||0)) + (W_TR*(s_tr||0)) + (boost||0);
    if (score > prev.score) candidates.set(key, {score, bn:s_bn||0, bl:s_bl||0, tr:s_tr||0, boost});
  }

  async function runQuery(q, pageSize=10, ctx={}){
    if(!q || q.length<3) return;
    const K = `${q}|${pageSize}`;
    if(tried.has(K)) return;
    tried.add(K);
    const list = await autocompleteUsers(base, q, pageSize);
    if(!Array.isArray(list)) return;
    for(const name of list){
      const s_bn = bn ? userSimilarityScore(bn, name) : 0;
      let s_bl = 0, s_tr = 0;
      for(const t of bl){ s_bl = Math.max(s_bl, userSimilarityScore(t, name)); }
      for(const t of tr){ s_tr = Math.max(s_tr, userSimilarityScore(t, name)); }
      const boost = textBoostScore(name, ctx.txtBanner, ctx.txtBL);
      pushCandidate(name, s_bn, s_bl, s_tr, boost);
    }
  }

  const pickBest = ()=> {
    let best=null, bestVal=-1;
    candidates.forEach((v,k)=>{ if(v.score>bestVal){ bestVal=v.score; best={name:k, ...v}; } });
    return best;
  };
  const isAcceptable = (b)=> {
    if(!b) return false;
    return (
      b.bn >= NAME_SIM_ACCEPT_STRICT ||
      (b.bn >= NAME_SIM_ACCEPT_SOFT && b.bl >= NAME_SIM_ACCEPT_SOFT) ||
      b.bl >= (NAME_SIM_ACCEPT_STRICT+0.05) ||
      b.tr >= NAME_SIM_ACCEPT_STRICT ||
      b.boost >= 0.9
    );
  };

  if (bn) {
    for (const k of nameVariantPrefixes(bn)) {
      await runQuery(k, 12, { txtBanner: bn, txtBL: bl.join(' ') });
    }
  }

  for (const t of bl) {
    for (const k of nameVariantPrefixes(t)) {
      await runQuery(k, 14, { txtBanner: bn, txtBL: bl.join(' ') });
    }
  }

  for (const t of tr) {
    for (const k of nameVariantPrefixes(t)) {
      await runQuery(k, 14, { txtBanner: bn, txtBL: bl.join(' ') });
    }
  }

  let best = pickBest();

  if (!isAcceptable(best)){
    const pool = [
      ...nameVariantPrefixes(bn),
      ...bl.flatMap(t=>nameVariantPrefixes(t)),
      ...tr.flatMap(t=>nameVariantPrefixes(t))
    ];
    for(const q of [...new Set(pool)].slice(0,12)) await runQuery(q, 20, {txtBanner:bn, txtBL: bl.join(' ')});
    best = pickBest();
  }

  if (best){
    const near = [];
    candidates.forEach((v,k)=>{ if(k!==best.name && (best.score - v.score) <= 0.2) near.push({k,v}); });
    if (near.length){
      let pick = best;
      for(const {k,v} of near){
        if (v.bl > pick.bl + 0.2) pick = {name:k, ...v};
      }
      best = pick;
    }
  }

  if (dbg){
    dbg.tried = Array.from(tried);
    dbg.top   = Array.from(candidates.entries())
      .sort((a,b)=>b[1].score - a[1].score)
      .slice(0,10)
      .map(([name,sc]) => ({ name, ...sc }));
  }

  return isAcceptable(best) ? best.name : null;
}

/* -------- CODE autocomplete -------- */
function generateAmbiguityVariants(tok, maxOut=6){
  const T = String(tok||"").toUpperCase().replace(/[^A-Z0-9]/g,"");
  const idxs = [];
  for(let i=0;i<T.length;i++){
    if (AMBIG_MAP.has(T[i])) idxs.push(i);
    if (idxs.length>=3) break;
  }
  const out = new Set([T]);
  const alts = (ch)=> Array.from(new Set(((AMBIG_MAP.get(ch)||"")+ch).split("")));
  for(let a=0;a<idxs.length && out.size<maxOut; a++){
    const A = idxs[a];
    for(const ca of alts(T[A])){
      const v1 = T.slice(0,A)+ca+T.slice(A+1);
      out.add(v1); if(out.size>=maxOut) break;
      for(let b=a+1;b<idxs.length && out.size<maxOut; b++){
        const B = idxs[b];
        for(const cb of alts(T[B])){
          out.add(v1.slice(0,B)+cb+v1.slice(B+1));
          if(out.size>=maxOut) break;
        }
      }
    }
  }
  return Array.from(out);
}
function codeSearchKeysFromToken(tok){
  const baseVariants = generateAmbiguityVariants(tok, 6);
  const keys = new Set();
  for(const v of baseVariants){
    const T = v.replace(/[^A-Z0-9]/g,"");
    if(!T) continue;
    const runs = T.match(/\d{3,}/g) || [];
    for(const r of runs){ if(r.length>=3){ keys.add(r.slice(0,4)); keys.add(r.slice(0,3)); } }
    const rel = [...T].filter(ch => /\d/.test(ch) || /[ACDEFGHJKMNPRTX]/.test(ch)).join("");
    if(rel.length>=3){ keys.add(rel.slice(0,4)); keys.add(rel.slice(0,3)); }
    if(T.length>=3){ keys.add(T.slice(0,4)); keys.add(T.slice(0,3)); }
  }
  return [...keys].slice(0,12);
}
async function refineCodeWithAutocomplete(base, seeds, tlRawTexts = {}, dbg) {
  try {
    const seedList = Array.isArray(seeds) ? seeds.filter(Boolean) : (seeds ? [seeds] : []);
    const extra = [];
    const fromText = (t) => {
      const U = String(t || "").toUpperCase();
      const all = U.match(/[A-Z0-9]{3,6}/g) || [];
      all.slice(0, 6).forEach(x => extra.push(x));
      const m1 = /MAP\s*CODE\s*[:\-]?\s*([A-Z0-9]{3,6})/.exec(U);
      if (m1) extra.push(m1[1]);
      const m2 = /MAP\s+(?:C|G|Q|L|0)[O0Q]D[EB6O]?E?\s*[:\-]?\s*([A-Z0-9]{3,6})/.exec(U);
      if (m2) extra.push(m2[1]);
    };
    fromText(tlRawTexts?.cyan);
    fromText(tlRawTexts?.white);

    const seedsAll = [...new Set([...seedList, ...extra].map(sanitizeCodeHard))].slice(0, 12);
    if (!seedsAll.length) return null;

    const queries = [];
    for (const s of seedsAll) codeSearchKeysFromToken(s).forEach(k => queries.push(k));
    if (!queries.length) return seedsAll[0] || null;

    const tried = new Set();
    let best = seedsAll[0] || null, bestScore = -1;

    for (const q of queries.slice(0, 18)) {
      if (tried.has(q)) continue;
      tried.add(q);
      const arr = await autocompleteCodes(base, q, 12);
      if (!Array.isArray(arr) || !arr.length) continue;

      for (const cand of arr) {
        const sc = Math.max(...seedsAll.map(seed => codeSimilarityScore(seed, cand)));
        const isShapeGood = /^\d{3}[A-Z]{2}$/.test(String(cand || ""));
        const sc2 = sc + (isShapeGood ? 0.4 : 0);

        if (sc2 > bestScore) { bestScore = sc2; best = cand; }
      }
      if (bestScore >= 4.0) break;
    }

    if (dbg) {
      dbg.codeTried = Array.from(tried);
      dbg.codeBestScore = bestScore;
    }
    return best ? sanitizeCodeHard(best) : null;
  } catch (_) {
    return null;
  }
}

/* ===================== Comparaisons & utils ===================== */
function compareTime(expected, got, tol){
  const p=Number(expected);
  if(!Number.isFinite(p)||!Number.isFinite(got)) return {ok:false,diff:null};
  const d=Math.abs(got-p); return {ok:d<=tol, diff:d};
}
const asStr = (v) => (typeof v === "string") ? v : "";

/* ===================== Worker ===================== */
self.onmessage = async (ev) => {
  const { op, id, payload, rois } = ev.data || {};
  if (op === "SET_ROIS") { setRois(rois); self.postMessage({ op: "ROIS_OK" }); return; }
  if (op !== "VERIFY") return;

  const DEBUG = payload?.debug !== false;
  const dbg = DEBUG ? {} : null;
  const dlog = makeLogger(DEBUG, dbg);

  let bmp = null;
  try {
    const { screenshotUrl, code: expectedCode, time: expectedTime, mapName: expectedName } = payload || {};
    if (!screenshotUrl) throw new Error("Missing screenshotUrl");

    bmp = await fetchImageBitmap(screenshotUrl);
    const W = bmp.width, H = bmp.height;
    const R = { ...DEFAULT_ROIS, ...(ROIS || {}), ...(payload?.rois || {}), ...(rois || {}) };
    for (const k of Object.keys(R)) R[k] = toNormalized(R[k], W, H);
    dlog('Image loaded', { W, H, R });

    const API_BASE = apiBaseFrom(payload);

    const codeOCRAll = await extractCodeFromTopLeft(bmp, R.TOPLEFT, dlog);
    const timeRes    = await extractTimeBannerFirst(bmp, R.BANNER, R.TOPRIGHT);
    const nameSeeds  = await extractNameSeeds(bmp, R.BOTTOMLEFT, R.BANNER, R.TOPRIGHT);

    dlog('Time & name seeds', { time: timeRes?.time, nameSeeds });

    let tlCyan  = ""; try { tlCyan  = await ocrPrep(crop(bmp, R.TOPLEFT), { psm: 6, mode: "cyanHybrid",  scale: 3 }); } catch {}
    let tlWhite = ""; try { tlWhite = await ocrPrep(crop(bmp, R.TOPLEFT), { psm: 6, mode: "whiteStrong", scale: 3 }); } catch {}
    dlog('TL raw texts (full)', { tlCyan, tlWhite });

    const txtBN = asStr(timeRes?.texts?.banner);
    const txtTR = asStr(timeRes?.texts?.topRight) || asStr(await (async () => { try {
      return await ocrPrep(crop(bmp, R.TOPRIGHT), { psm: 6, mode: "white", scale: 2 });
    } catch { return ""; } })());
    const txtBL = asStr(nameSeeds?.texts?.bottomLeft);
    const txtTL = asStr(tlCyan) || asStr(tlWhite);

    /* ===================== CODE final ===================== */
    let codeFinal = null;
    let codeSource = null;

    if (API_BASE && codeOCRAll.anchorRight) {
      const rightQ = sanitizeCodeHard(codeOCRAll.anchorRight);
      const list = await autocompleteCodes(API_BASE, rightQ, 10);
      dlog('CODE: autocomplete from right-of-anchor', { query: rightQ, suggestions: list });
      if (Array.isArray(list) && list[0]) {
        codeFinal  = sanitizeCodeHard(list[0]);
        codeSource = 'right-anchor:first';
      }
    }

    if (!codeFinal && API_BASE && codeOCRAll.inline) {
      const inlineQ = sanitizeCodeHard(codeOCRAll.inline);
      const list = await autocompleteCodes(API_BASE, inlineQ, 10);
      dlog('CODE: autocomplete from inline anchor', { query: inlineQ, suggestions: list });
      if (Array.isArray(list) && list[0]) {
        codeFinal  = sanitizeCodeHard(list[0]);
        codeSource = 'inline:first';
      }
    }

    if (!codeFinal && API_BASE) {
      const seeds = [
        codeOCRAll.inline,
        codeOCRAll.best,
        ...codeOCRAll.candidates.map(x => x.tok).slice(0, 8)
      ].filter(Boolean);

      dlog('CODE: seeds for refine', { seeds });
      const chosen = await refineCodeWithAutocomplete(API_BASE, seeds, { cyan: tlCyan, white: tlWhite }, dbg);
      if (chosen) {
        codeFinal  = sanitizeCodeHard(chosen);
        codeSource = 'refine';
      }
    }

    if (!API_BASE && !codeFinal) {
      const seeds = [
        codeOCRAll.inline,
        codeOCRAll.best,
        ...codeOCRAll.candidates.map(x => x.tok).slice(0, 8)
      ].filter(Boolean);

      codeFinal = (seeds[0] || codeOCRAll.best) ? sanitizeCodeHard(seeds[0] || codeOCRAll.best) : null;
      codeSource = 'offline-fallback';
    }

    dlog('CODE: final', { codeFinal, codeSource });

    /* ===================== NOM ===================== */
    let nameFinal = null;
    if (API_BASE) {
      nameFinal = await refineNameWithAutocompleteV2(API_BASE, nameSeeds.bannerSeed, nameSeeds.blTokens, nameSeeds.trTokens, dbg);
      dlog('NAME: autocomplete result', { nameFinal });
    }
    if (!nameFinal) {
      nameFinal = smartDigitToLetter(nameSeeds.bestOCR || "");
      if (!nameFinal) nameFinal = null;
      dlog('NAME: OCR fallback', { nameFinal });
    }

    /* ===================== TIME ===================== */
    const timeExtract = Number.isFinite(timeRes?.time) ? Number(timeRes.time.toFixed(2)) : null;
    dlog('TIME: final', { timeExtract });

    /* ===================== Vérifs & résultat ===================== */
    const reasons = [];
    let okCode = true, okTime = true, okName = true;

    if (expectedCode != null) {
      const sc = sanitizeCode(expectedCode);
      okCode = !!codeFinal && codeFinal === sanitizeCodeHard(sc);
      if (!okCode) reasons.push(codeFinal ? `Code mismatch (extracted ${codeFinal}, expected ${sc})` : "Code not found");
    }
    if (expectedTime != null) {
      const { ok, diff } = compareTime(expectedTime, timeExtract, TIME_TOL);
      okTime = ok;
      if (!okTime) {
        reasons.push(Number.isFinite(timeExtract)
          ? `Time mismatch (found ${Number(timeExtract).toFixed(2)}, expected ${Number(expectedTime).toFixed(2)}, Δ=${diff?.toFixed(3)}s)`
          : "Time not found");
      }
    }
    if (expectedName != null) {
      okName = !!nameFinal && namesEqual(nameFinal, expectedName);
      if (!okName) {
        if (!API_BASE && !nameFinal) reasons.push("Name is null because apiBase is missing and OCR fallback failed.");
        else reasons.push(nameFinal ? `Name mismatch (extracted "${nameFinal}", expected "${expectedName}")` : "Name not found");
      }
    } else {
      if (!nameFinal) {
        if (!API_BASE) reasons.push("Name is null because apiBase is missing (no OCR seed).");
        else reasons.push("Name is null: no acceptable candidate returned by autocomplete.");
      }
    }

    const resultPayload = {
      verified: okCode && okTime && okName,
      extracted: {
        code:  codeFinal || null,
        times: Number.isFinite(timeExtract) ? [Number(timeExtract)] : [],
        name:  nameFinal || null,
        texts: { topLeft: txtTL, topLeftCyan: tlCyan, topLeftWhite: tlWhite, banner: txtBN, topRight: txtTR, bottomLeft: txtBL }
      },
      reasons,
    };

    if (dbg) {
      resultPayload.debug = {
        apiBase: API_BASE,
        codeFromRightAnchorQuery: codeOCRAll.anchorRight || null,
        codeOCR: codeOCRAll.best,
        codeInline: codeOCRAll.inline,
        codeCandidates: codeOCRAll.candidates,
        ...dbg
      };
    }

    dlog('RESULT payload', resultPayload);
    self.postMessage({ op: "RESULT", id, result: resultPayload });
  } catch (err) {
    console.error('[auto-verify] ERROR', err);
    self.postMessage({ op: "RESULT", id, error: String(err?.message || err || "Unknown error") });
  } finally {
    if (bmp && typeof bmp.close === "function") { try { bmp.close(); } catch {} }
  }
};
