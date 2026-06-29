import { httpErrorMessage } from './workspace-shell.js';
import { openModal, primaryButton, ghostButton, setButtonBusy } from './modal-shell.js';

// Local Laravel proxy routes (mods group) — these forward server-side to the
// upstream genji API with the X-API-KEY the browser doesn't have. The browser must
// never hit /api/v3/* directly (no key + no local route → 404).
const MAP_NAMES_ENDPOINT = '/api/mods/content/maps/names';
const MAPS_ENDPOINT = '/api/mods/content/maps';
const BANNER_CDN_BASE = 'https://cdn.genji.pk/assets/map_banners';
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_BYTES = 24 * 1024 * 1024; // just under the API's 25 MB body limit

let DEPS = null;
let root = null; // [data-subpanel="content-maps"]
let listEl = null; // [data-maps-list]
let names = []; // string[] (alphabetical, from the endpoint)
let loaded = false; // names fetched at least once
let filterText = '';
// Names whose banner we changed this session — preview them cache-busted so the
// admin sees the new image despite the CDN's max-age=3600.
const recentlyReplaced = new Set();

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// stripped = lowercased name with all non-alphanumeric chars removed.
function stripName(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function mapBannerUrl(name, { bust = false } = {}) {
  const url = `${BANNER_CDN_BASE}/${stripName(name)}.png`;
  return bust ? `${url}?v=${Date.now()}` : url;
}

export function initContentMapsWorkspace(deps) {
  DEPS = deps;
  root = document.querySelector('[data-subpanel="content-maps"]');
  if (!root) return;
  listEl = root.querySelector('[data-maps-list]');

  wireHeader();
  wireList();
  renderLoading();

  // Lazy-load names the first time the Maps sub-tab is entered (mirrors how
  // content-workspace.js defers its fetches until a sub-tab is opened).
  document.querySelectorAll('[data-subtab="content-maps"]').forEach((btn) => {
    btn.addEventListener('click', () => enterSubtab());
  });
}

async function enterSubtab() {
  if (loaded) { renderRows(); return; }
  await loadMapNames();
}

async function loadMapNames() {
  loaded = true;
  renderLoading();
  try {
    const { ok, status, data, url } = await DEPS.http('GET', MAP_NAMES_ENDPOINT);
    DEPS.logActivity({ title: 'Load map names', method: 'GET', url, ok, status, data });
    if (!ok || !Array.isArray(data)) {
      loaded = false; // allow retry on next entry / refresh
      renderError(httpErrorMessage(status, { noun: 'maps' }));
      return;
    }
    names = data.slice();
    renderRows();
  } catch (_) {
    loaded = false;
    renderError(httpErrorMessage(0, { noun: 'maps' }));
  }
}

function wireHeader() {
  root.querySelector('[data-maps-add]')
    ?.addEventListener('click', () => openEditor({ mode: 'create' }));
  root.querySelector('[data-maps-refresh]')
    ?.addEventListener('click', () => loadMapNames());
  const filter = root.querySelector('[data-maps-filter]');
  filter?.addEventListener('input', () => {
    filterText = filter.value.trim().toLowerCase();
    if (loaded) renderRows();
  });
}

function updateCount(n) {
  const badge = root.querySelector('[data-maps-count]');
  if (badge) badge.textContent = n == null ? 'No maps synced' : `${n} maps`;
}

function renderLoading() {
  if (listEl) {
    listEl.innerHTML =
      '<div class="px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">Loading…</div>';
  }
}

function renderError(msg) {
  if (listEl) {
    listEl.innerHTML =
      `<div class="px-3 py-4 text-sm text-rose-600 dark:text-rose-300">${escapeHtml(msg)}</div>`;
  }
  updateCount(null);
}

function visibleNames() {
  if (!filterText) return names;
  return names.filter((n) => String(n).toLowerCase().includes(filterText));
}

function renderRows() {
  if (!listEl) return;
  updateCount(names.length);

  if (!names.length) {
    listEl.innerHTML =
      '<div class="px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">No maps yet — add one to get started.</div>';
    return;
  }
  const list = visibleNames();
  if (!list.length) {
    listEl.innerHTML =
      `<div class="px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">No maps match “${escapeHtml(filterText)}”.</div>`;
    return;
  }
  listEl.innerHTML = '';
  list.forEach((name) => listEl.appendChild(buildRow(name)));
}

function buildRow(name) {
  const row = document.createElement('div');
  row.className =
    'rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40';
  row.dataset.mapsRow = name;

  const head = document.createElement('div');
  head.className = 'flex items-center gap-3 px-3 py-2';
  head.innerHTML = `
    <span class="min-w-0 flex-1 truncate font-medium text-zinc-900 dark:text-zinc-100">${escapeHtml(name)}</span>
    <button type="button" data-maps-preview class="cursor-pointer rounded-lg border border-zinc-200/80 dark:border-white/10 px-3 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">Preview</button>
    <button type="button" data-maps-replace class="cursor-pointer rounded-lg border border-zinc-200/80 dark:border-white/10 px-3 py-1 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-white/10">Replace banner</button>
  `;

  const preview = document.createElement('div');
  preview.className = 'hidden border-t border-zinc-200/80 dark:border-white/10 px-3 py-3';
  preview.dataset.mapsPreviewBox = '';

  row.appendChild(head);
  row.appendChild(preview);
  return row;
}

function wireList() {
  if (!listEl || listEl.dataset.wired === '1') return;
  listEl.dataset.wired = '1';
  listEl.addEventListener('click', (e) => {
    const row = e.target.closest('[data-maps-row]');
    if (!row) return;
    const name = row.dataset.mapsRow;
    if (e.target.closest('[data-maps-preview]')) { togglePreview(row, name); return; }
    if (e.target.closest('[data-maps-replace]')) { openEditor({ mode: 'replace', name }); }
  });
}

function togglePreview(row, name) {
  const box = row.querySelector('[data-maps-preview-box]');
  if (!box) return;
  if (!box.classList.contains('hidden')) { box.classList.add('hidden'); return; }

  const bust = recentlyReplaced.has(stripName(name));
  box.innerHTML =
    '<div class="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Current banner</div>';
  const img = document.createElement('img');
  img.alt = `Banner for ${name}`;
  img.loading = 'lazy';
  img.className = 'max-h-48 rounded-lg border border-zinc-200/80 dark:border-white/10';
  img.src = mapBannerUrl(name, { bust });
  img.addEventListener('error', () => {
    const ph = document.createElement('div');
    ph.className =
      'rounded-lg border border-dashed border-zinc-200/80 dark:border-white/10 px-3 py-3 text-xs text-zinc-500 dark:text-zinc-400';
    ph.textContent = 'No banner yet.';
    img.replaceWith(ph);
  });
  box.appendChild(img);
  box.classList.remove('hidden');
}

function buildEditorForm({ mode, name }) {
  const isReplace = mode === 'replace';
  const form = document.createElement('form');
  form.autocomplete = 'off';
  form.className = 'space-y-4';
  form.innerHTML = `
    <label class="block text-sm">
      Map name
      <input name="name" ${isReplace ? 'readonly' : ''}
        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none ${isReplace ? 'opacity-70 cursor-not-allowed' : ''}"
        placeholder="King's Row" />
      <p data-maps-collision class="hidden mt-1 text-xs text-amber-600 dark:text-amber-400"></p>
      <p data-maps-error class="hidden mt-1 text-xs text-rose-600 dark:text-rose-300"></p>
    </label>
    <div>
      <div class="text-sm">Banner</div>
      <div data-maps-drop tabindex="0" role="button"
        class="mt-1 flex min-h-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-zinc-300 dark:border-white/15 bg-zinc-50 dark:bg-white/[0.03] px-4 py-6 text-center hover:bg-zinc-100 dark:hover:bg-white/[0.06] focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/40">
        <input type="file" accept="image/*" class="hidden" data-maps-file />
        <div class="text-sm text-zinc-700 dark:text-zinc-300 pointer-events-none">Drag &amp; drop or click to upload</div>
        <div class="text-[11px] text-zinc-500 dark:text-zinc-400 pointer-events-none">JPG/PNG/WebP/AVIF, max 24 MB.</div>
      </div>
      <div data-maps-filepreview class="hidden mt-3"></div>
    </div>
    <div data-maps-current class="hidden">
      <div class="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Current banner</div>
      <div data-maps-current-img></div>
    </div>
  `;
  if (name) form.name.value = name;
  return form;
}

function openEditor({ mode, name }) {
  const form = buildEditorForm({ mode, name });
  const saveBtn = primaryButton('Save');
  const cancelBtn = ghostButton('Cancel');
  const footer = document.createDocumentFragment();
  footer.append(saveBtn, cancelBtn);

  const title = mode === 'replace' ? `Replace banner — ${name}` : 'Add map';
  const subtitle = mode === 'replace'
    ? 'Upload a new banner image to overwrite the current one.'
    : 'Type a new map name, or an existing one to replace its banner.';

  const { close } = openModal({ title, subtitle, body: form, footer, width: 'md' });

  const fileInput = form.querySelector('[data-maps-file]');
  const drop = form.querySelector('[data-maps-drop]');
  const filePreview = form.querySelector('[data-maps-filepreview]');
  const collisionEl = form.querySelector('[data-maps-collision]');
  const errorEl = form.querySelector('[data-maps-error]');
  const currentWrap = form.querySelector('[data-maps-current]');
  const currentImg = form.querySelector('[data-maps-current-img]');
  let chosenFile = null;

  function syncSave() {
    const ok = !!form.name.value.trim() && !!chosenFile;
    saveBtn.disabled = !ok;
    saveBtn.classList.toggle('opacity-50', !ok);
    saveBtn.classList.toggle('cursor-not-allowed', !ok);
  }

  function showCurrentBanner(forName) {
    currentImg.innerHTML = '';
    const img = document.createElement('img');
    img.alt = `Current banner for ${forName}`;
    img.loading = 'lazy';
    img.className = 'max-h-40 rounded-lg border border-zinc-200/80 dark:border-white/10';
    img.src = mapBannerUrl(forName, { bust: recentlyReplaced.has(stripName(forName)) });
    img.addEventListener('error', () => currentWrap.classList.add('hidden'));
    currentImg.appendChild(img);
    currentWrap.classList.remove('hidden');
  }

  function acceptFile(file) {
    errorEl.classList.add('hidden');
    if (!file) return;
    if (!ALLOWED_MIME.includes(file.type)) {
      errorEl.textContent = 'Unsupported image type (use JPG, PNG, WebP, or AVIF).';
      errorEl.classList.remove('hidden');
      return;
    }
    if (file.size > MAX_BYTES) {
      errorEl.textContent = 'Image too large (max 24 MB).';
      errorEl.classList.remove('hidden');
      return;
    }
    chosenFile = file;
    filePreview.innerHTML = '';
    const img = document.createElement('img');
    img.className = 'max-h-48 rounded-lg border border-zinc-200/80 dark:border-white/10';
    img.alt = 'Selected banner preview';
    img.src = URL.createObjectURL(file);
    img.addEventListener('load', () => URL.revokeObjectURL(img.src));
    const cap = document.createElement('div');
    cap.className = 'mt-1 text-xs text-zinc-500 dark:text-zinc-400';
    cap.textContent = `${file.name} · ${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    filePreview.append(img, cap);
    filePreview.classList.remove('hidden');
    syncSave();
  }

  drop.addEventListener('click', () => fileInput.click());
  drop.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
  });
  fileInput.addEventListener('change', (e) => acceptFile(e.target.files?.[0]));
  ['dragover', 'dragenter'].forEach((ev) =>
    drop.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.add('bg-zinc-100', 'dark:bg-white/[0.06]');
    }));
  ['dragleave', 'drop'].forEach((ev) =>
    drop.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.remove('bg-zinc-100', 'dark:bg-white/[0.06]');
    }));
  drop.addEventListener('drop', (e) => acceptFile(e.dataTransfer?.files?.[0]));

  if (mode === 'replace') {
    showCurrentBanner(name);
  } else {
    form.name.addEventListener('input', () => {
      errorEl.classList.add('hidden');
      const key = stripName(form.name.value.trim());
      const match = key ? names.find((n) => stripName(n) === key) : null;
      if (match) {
        collisionEl.textContent = `A map named “${match}” already exists — saving will replace its banner.`;
        collisionEl.classList.remove('hidden');
        showCurrentBanner(match);
      } else {
        collisionEl.classList.add('hidden');
        currentWrap.classList.add('hidden');
      }
      syncSave();
    });
  }

  cancelBtn.addEventListener('click', close);
  saveBtn.addEventListener('click', async () => {
    const nameVal = form.name.value.trim();
    if (!nameVal || !chosenFile) return;
    errorEl.classList.add('hidden');
    setButtonBusy(saveBtn, true);
    try {
      const fd = new FormData();
      fd.append('name', nameVal);
      fd.append('banner', chosenFile, chosenFile.name);
      const { ok, status, data, url } = await DEPS.http('POST', MAPS_ENDPOINT, { body: fd });
      DEPS.logActivity({ title: 'Create/replace map banner', method: 'POST', url, ok, status, data });
      if (ok) {
        DEPS.toast(
          data?.inserted ? `Map “${nameVal}” added` : `Banner replaced for “${nameVal}”`,
          'ok',
        );
        recentlyReplaced.add(stripName(nameVal));
        await loadMapNames();
        close();
        return;
      }
      const detail = (data && (data.detail || data.message)) || httpErrorMessage(status, { noun: 'maps' });
      errorEl.textContent = String(detail);
      errorEl.classList.remove('hidden');
    } catch (_) {
      errorEl.textContent = httpErrorMessage(0, { noun: 'maps' });
      errorEl.classList.remove('hidden');
    } finally {
      setButtonBusy(saveBtn, false);
      syncSave();
    }
  });

  syncSave();
  setTimeout(() => { if (mode !== 'replace') form.name?.focus(); }, 0);
}
