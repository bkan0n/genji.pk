self.importScripts(
  'https://cdn.jsdelivr.net/gh/Zezombye/overpy@master/out/overpy_standalone.js'
);

// ---------- utils ----------
function normalizeNewlines(s){ return String(s||'').replace(/\r\n?/g,'\n'); }
async function fetchText(url){ const r=await fetch(url,{cache:'no-cache'}); if(!r.ok) throw new Error(`HTTP ${r.status} on ${url}`); return r.text(); }

// ---------- helpers compilation ----------
const HERO_FILE_MAP = {
  GENJI: 'mechanics/Genji.opy',
  HANZO: 'mechanics/Hanzo.opy',
  KIRIKO: 'mechanics/Kiriko.opy',
  HAZARD: 'mechanics/Hazard.opy',
};

function expandImportHeroToInclude(src){
  src = normalizeNewlines(src);
  src = src.replace(
    /^[ \t]*#!define\s+importHero\s*\(\s*Hero\s*\)\s*__script__\([^)]+\)[^\n]*\n?/im,
    ''
  );
  src = src.replace(/^[ \t]*importHero\s*\(([\s\S]*?)\)\s*$/gim, (full, arg) => {
    const m = /"(GENJI|HANZO|KIRIKO|HAZARD)"/i.exec(arg);
    if (!m) return '';
    const heroKey = m[1].toUpperCase();
    const file = HERO_FILE_MAP[heroKey];
    return file ? `#!include "${file}"` : '';
  });
  return src;
}

async function inlineIncludes(src, baseHref){
  const re = /^[ \t]*#!include\s+"([^"]+)"[ \t]*;?[^\n]*$/gm;
  let out = '', last = 0, m;
  while((m = re.exec(src))){
    out += src.slice(last, m.index);
    const rel = m[1].trim();
    const fileUrl = new URL(rel, baseHref).href;
    const txt = await fetchText(fileUrl);
    const expanded = await inlineIncludes(txt, fileUrl.replace(/[^/]+$/, ''));
    out += expanded;
    last = re.lastIndex;
  }
  return out + src.slice(last);
}

function cleanSourceG(src){
  src = normalizeNewlines(src);
  return src
    .replace(/^[ \t]*#!define\s+editortoggle[^\n]*\n?/gm, '')
    .replace(/^[ \t]*editortoggle\([^\n]*\)\s*\n?/gm, '')
    .replace(/^[ \t]*__script__\([^)]+\)[ \t]*;?[ \t]*\n/gm, '')
    .replace(/\beditoron\b/g, 'false');
}

function patchTestDataStub(src){
  const hasDefine = /^[ \t]*#!define\s+testData\b/m.test(src);
  if (hasDefine) return src;
  return src.replace(/^[ \t]*testData[ \t]*$/m, 'rule "TestData (stub)":\n    return');
}

function patchEditorDefaultOn(src){
  const hasDefine = /^[ \t]*#!define\s+editorDefaultOn\b/m.test(src);
  if (hasDefine) return src;
  const usesCallSyntax = /\beditorDefaultOn\s*\(/.test(src);
  const def = usesCallSyntax ? '#!define editorDefaultOn() false\n' : '#!define editorDefaultOn false\n';
  return def + src;
}

function addMapPolyfills(src){
  const poly =
  `#!define skirmishMap []
  #!define tdmMap []
  #!define controlMap []
  #!define escortMap []
  #!define hybridMap []
  #!define pushMap []
  #!define flashpointMap []
  `;
    return poly + src.replace(/\r\n?/g, '\n');
}

// ---------- compilation OverPy (worker) ----------
async function compileFrameworkTemplate(lang){
  const Over = self.Overpy || self.OverPy || self.window?.Overpy || self.window?.OverPy;
  if (!Over) throw new Error('OverPy UMD introuvable dans le worker');
  if (Over.readyPromise) await Over.readyPromise;

  const rawBase = 'https://cdn.jsdelivr.net/gh/tylovejoy/genji-framework@1.10.4D/';
  const entryFile = 'framework.opy';

  let src = await fetchText(rawBase + entryFile);
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

  const { result } = await Over.compile(src, lang, rawBase, entryFile);
  return result;
}

// ---------- messaging ----------
const OK = (id, result) => postMessage({ id, ok: true, result });
const KO = (id, err) => postMessage({ id, ok: false, error: String(err && err.message || err) });

self.onmessage = async (e) => {
  const { id, type, payload } = e.data || {};
  try{
    if (type === 'compile') {
      const tpl = await compileFrameworkTemplate(payload.lang);
      OK(id, tpl);
      return;
    }
    throw new Error('Unknown worker task: ' + type);
  }catch(err){ KO(id, err); }
};
