import {
  $,
  pickedId,
  setView,
  makeRecentStore,
  renderRecentChips,
  wireUserSearch,
  wireMapSearch,
  skel,
  httpErrorMessage,
} from './workspace-shell.js';
import { openModal, primaryButton, ghostButton, setButtonBusy } from './modal-shell.js';

const LIST_API = '/api/mods/completions/moderation/records';
const moderateApi = (id) => `/api/mods/completions/${encodeURIComponent(id)}/moderate`;
const PAGE_SIZE = 20;
const ACTIVE = ['bg-emerald-500/15', 'text-emerald-800', 'dark:text-emerald-300', 'font-semibold'];

let DEPS = null;
const MOD_ID = (document.getElementById('modUserId')?.value || '').trim();
const recent = makeRecentStore('mod.records.manage.recent');

const state = {
  user_id: '',
  user_name: '',
  code: '',
  verification_status: 'All',
  latest_only: true,
  page_number: 1,
  items: [],
  searched: false,
};

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[c]
  );
}

// Seconds (number) -> "m:ss.xx" / "ss.xxs" for display only.
function fmtTime(sec) {
  const n = Number(sec);
  if (!Number.isFinite(n)) return '—';
  const m = Math.floor(n / 60);
  const s = n - m * 60;
  if (m > 0) return `${m}:${s.toFixed(2).padStart(5, '0')}`;
  return `${s.toFixed(2)}s`;
}

// Only allow http(s) links; reject javascript:/data:/etc. Returns a safe href or null.
function safeHref(url) {
  try {
    const u = new URL(url, window.location.origin);
    return u.protocol === 'http:' || u.protocol === 'https:' ? encodeURI(url) : null;
  } catch {
    return null;
  }
}

// ---- segmented control helpers (scoped to a root element) ----

function segWire(root, segSel, attr, onPick) {
  const seg = $(segSel, root);
  if (!seg) return;
  seg.querySelectorAll(`[${attr}]`).forEach((btn) => {
    btn.addEventListener('click', () => {
      onPick(btn.getAttribute(attr));
      applySeg(root, segSel, attr, btn.getAttribute(attr));
    });
  });
}

function applySeg(root, segSel, attr, value) {
  const seg = $(segSel, root);
  if (!seg) return;
  seg.dataset.value = value == null ? '' : String(value);
  seg.querySelectorAll(`[${attr}]`).forEach((btn) => {
    const on = btn.getAttribute(attr) === value;
    for (const cls of ACTIVE) btn.classList.toggle(cls, on);
  });
}

function getSeg(root, segSel) {
  return $(segSel, root)?.dataset.value || '';
}

// ---- init ----

export function initRecordsManageWorkspace(deps) {
  DEPS = deps;
  const root = $('[data-records-manage]');
  if (!root) return;

  const playerInput = $('[data-rm-player]', root);
  wireUserSearch(playerInput, {
    deps: DEPS,
    onLoad: (id, label) => {
      state.user_id = String(id);
      state.user_name = label || '';
      runSearch(root, { resetPage: true });
    },
  });

  const mapInput = $('[data-rm-map]', root);
  wireMapSearch(mapInput, {
    deps: DEPS,
    onLoad: (code) => {
      state.code = String(code).trim().toUpperCase();
      runSearch(root, { resetPage: true });
    },
  });

  segWire(root, '[data-rm-status-seg]', 'data-status', (v) => {
    state.verification_status = v;
    if (state.searched) runSearch(root, { resetPage: true });
  });
  applySeg(root, '[data-rm-status-seg]', 'data-status', state.verification_status);

  const latest = $('[data-rm-latest]', root);
  if (latest) {
    latest.checked = state.latest_only;
    latest.addEventListener('change', () => {
      state.latest_only = latest.checked;
      if (state.searched) runSearch(root, { resetPage: true });
    });
  }

  $('[data-rm-search]', root)?.addEventListener('click', () => {
    syncFreeText(root);
    runSearch(root, { resetPage: true });
  });

  $('[data-rm-prev]', root)?.addEventListener('click', () => {
    if (state.page_number > 1) {
      state.page_number -= 1;
      runSearch(root, { resetPage: false });
    }
  });
  $('[data-rm-next]', root)?.addEventListener('click', () => {
    state.page_number += 1;
    runSearch(root, { resetPage: false });
  });

  $('[data-rm-list]', root)?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-rm-moderate]');
    if (!btn) return;
    const item = state.items.find((it) => String(it.id) === btn.getAttribute('data-rm-moderate'));
    if (item) openModerateModal(root, item);
  });

  renderRecent(root);
}

// Pull free-typed (not autocomplete-picked) field values into state.
function syncFreeText(root) {
  const playerInput = $('[data-rm-player]', root);
  const mapInput = $('[data-rm-map]', root);
  if (playerInput) {
    const pid = pickedId(playerInput);
    state.user_id = pid || '';
    if (!pid) state.user_name = '';
  }
  state.code = (mapInput?.value || '').trim().toUpperCase();
}

function renderRecent(root) {
  renderRecentChips($('[data-rm-recent]', root), recent, (id) => {
    const hit = recent.get().find((r) => r.id === String(id));
    state.user_id = String(id);
    state.user_name = hit?.name && hit.name !== String(id) ? hit.name : '';
    const input = $('[data-rm-player]', root);
    if (input) {
      input.value = state.user_name || String(id);
      input.dataset.uid = String(id);
    }
    runSearch(root, { resetPage: true });
  });
}

// ---- search + list ----

async function runSearch(root, { resetPage }) {
  if (resetPage) state.page_number = 1;
  state.searched = true;
  $('[data-rm-prompt]', root)?.classList.add('hidden');
  renderSkeleton(root);
  setView(root, 'loading');

  const query = {
    verification_status: state.verification_status,
    latest_only: state.latest_only ? 'true' : 'false',
    page_size: PAGE_SIZE,
    page_number: state.page_number,
  };
  if (state.user_id) query.user_id = state.user_id;
  if (state.code) query.code = state.code;

  let res;
  try {
    res = await DEPS.http('GET', LIST_API, { query });
  } catch {
    return showError(root, 'Network error — try again.');
  }
  const { ok, status, url, data } = res;
  DEPS.logActivity({ title: 'List records (moderation)', method: 'GET', url, ok, status, data });
  if (!ok) return showError(root, httpErrorMessage(status, { noun: 'records' }));

  const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
  state.items = items;
  if (state.user_id) {
    recent.push({ id: state.user_id, name: state.user_name || state.user_id });
    renderRecent(root);
  }
  renderList(root, items);
  renderPager(root, items);
  setView(root, 'loaded');
}

function showError(root, message) {
  const box = $('[data-rm-error]', root);
  if (box) box.textContent = message;
  setView(root, 'error');
  DEPS.toast('Lookup failed', 'err');
}

function renderSkeleton(root) {
  const box = $('[data-rm-skeleton]', root);
  if (box) box.innerHTML = Array.from({ length: 3 }, () => skel('h-16 w-full')).join('');
}

function renderPager(root, items) {
  const page = $('[data-rm-page]', root);
  if (page) page.textContent = `page ${state.page_number}`;
  const prev = $('[data-rm-prev]', root);
  const next = $('[data-rm-next]', root);
  if (prev) prev.disabled = state.page_number <= 1;
  // Without a reliable total we infer "has next page" from a full page of results.
  if (next) next.disabled = items.length < PAGE_SIZE;

  const count = $('[data-rm-count]', root);
  if (count) {
    const total = items[0]?.total_results;
    count.textContent =
      total != null
        ? `${total} record${total === 1 ? '' : 's'} match`
        : `${items.length} on this page`;
  }
}

function pill(text, tone) {
  return `<span class="rounded-md border px-2 py-0.5 text-xs font-semibold ${tone}">${escapeHtml(text)}</span>`;
}

function renderList(root, items) {
  const list = $('[data-rm-list]', root);
  const empty = $('[data-rm-empty]', root);
  if (!list) return;
  list.innerHTML = '';
  if (!items.length) {
    empty?.classList.remove('hidden');
    return;
  }
  empty?.classList.add('hidden');
  items.forEach((it) => list.appendChild(buildCard(it)));
}

function buildCard(item) {
  const verified = !!item.verified;
  const verifiedPill = pill(
    verified ? 'Verified' : 'Unverified',
    verified
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
      : 'border-zinc-300/60 dark:border-white/10 text-zinc-500 dark:text-zinc-400'
  );
  const suspiciousPill = item.suspicious
    ? pill('Suspicious', 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300')
    : '';
  const shot = item.screenshot ? safeHref(item.screenshot) : null;
  const vid = item.video ? safeHref(item.video) : null;
  const links = [
    shot
      ? `<a href="${shot}" target="_blank" rel="noopener" class="underline hover:no-underline">screenshot</a>`
      : '',
    vid
      ? `<a href="${vid}" target="_blank" rel="noopener" class="underline hover:no-underline">video</a>`
      : '',
  ]
    .filter(Boolean)
    .join(' · ');

  const card = document.createElement('div');
  card.className =
    'rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] p-3';
  card.innerHTML = `
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 space-y-1">
        <div class="flex flex-wrap items-center gap-2">
          <span class="font-medium text-zinc-900 dark:text-zinc-100 truncate">${escapeHtml(item.map_name || '—')}</span>
          <span class="rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-0.5 text-xs font-mono text-zinc-600 dark:text-zinc-300">${escapeHtml(item.code || '—')}</span>
          ${verifiedPill}
          ${suspiciousPill}
        </div>
        <div class="text-sm text-zinc-700 dark:text-zinc-200">
          ${escapeHtml(item.name || 'User ' + item.user_id)}
          <span class="text-zinc-400 dark:text-zinc-500">· ${escapeHtml(String(item.user_id ?? '—'))}</span>
        </div>
        <div class="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span class="font-mono">${escapeHtml(fmtTime(item.time))}</span>
          ${item.difficulty ? `<span>· ${escapeHtml(item.difficulty)}</span>` : ''}
          ${item.medal ? `<span>· ${escapeHtml(item.medal)}</span>` : ''}
          ${item.message_id != null ? `<span class="font-mono">· msg ${escapeHtml(String(item.message_id))}</span>` : ''}
          ${links ? `<span>· ${links}</span>` : ''}
        </div>
      </div>
      <div class="shrink-0">
        <button type="button" data-rm-moderate="${escapeHtml(String(item.id ?? ''))}" ${item.id == null ? 'disabled' : ''} class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-white/10 disabled:opacity-40">Moderate</button>
      </div>
    </div>`;
  return card;
}

// ---- moderation modal ----

function buildModalBody(item) {
  const wrap = document.createElement('div');
  wrap.className = 'space-y-5';
  const verified = !!item.verified;

  const verifiedPill = pill(
    verified ? 'Verified' : 'Unverified',
    verified
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
      : 'border-zinc-300/60 dark:border-white/10 text-zinc-500 dark:text-zinc-400'
  );
  const suspiciousPill = item.suspicious
    ? pill('Suspicious', 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300')
    : '';
  const shot = item.screenshot ? safeHref(item.screenshot) : null;
  const vid = item.video ? safeHref(item.video) : null;

  const meta = [
    `<span class="font-mono text-zinc-700 dark:text-zinc-200">${escapeHtml(fmtTime(item.time))}</span>`,
    item.difficulty ? `<span>${escapeHtml(item.difficulty)}</span>` : '',
    item.medal ? `<span>${escapeHtml(item.medal)}</span>` : '',
    item.message_id != null
      ? `<span class="font-mono">msg ${escapeHtml(String(item.message_id))}</span>`
      : '',
    vid
      ? `<a href="${vid}" target="_blank" rel="noopener" class="underline hover:no-underline">video</a>`
      : '',
  ]
    .filter(Boolean)
    .join('<span class="px-1 text-zinc-300 dark:text-zinc-600">·</span>');

  const thumb = shot
    ? `<a href="${shot}" target="_blank" rel="noopener" title="Open screenshot in new tab" class="group block overflow-hidden rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900">
        <img src="${shot}" alt="Completion screenshot" loading="lazy" referrerpolicy="no-referrer" class="max-h-64 w-full object-contain transition group-hover:opacity-90" />
      </a>`
    : `<div class="flex h-28 items-center justify-center rounded-lg border border-dashed border-zinc-300/70 dark:border-white/10 text-xs text-zinc-400 dark:text-zinc-500">No screenshot provided</div>`;

  const summary = `
    <section class="space-y-3 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/70 dark:bg-white/[0.02] p-3">
      <div class="flex flex-wrap items-center gap-2">
        <span class="font-semibold text-zinc-900 dark:text-zinc-100">${escapeHtml(item.map_name || '—')}</span>
        <span class="rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-0.5 text-xs font-mono text-zinc-600 dark:text-zinc-300">${escapeHtml(item.code || '—')}</span>
        ${verifiedPill}
        ${suspiciousPill}
      </div>
      <div class="text-sm text-zinc-700 dark:text-zinc-200">
        ${escapeHtml(item.name || 'User ' + item.user_id)}
        <span class="text-zinc-400 dark:text-zinc-500">· ${escapeHtml(String(item.user_id ?? '—'))}</span>
      </div>
      <div class="flex flex-wrap items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
        ${meta}
      </div>
      ${thumb}
    </section>
  `;

  wrap.innerHTML =
    summary +
    `
    <section class="space-y-3">
      <label class="inline-flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" data-rm-time-toggle class="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500/60 dark:border-zinc-600" />
        Change time
      </label>
      <div data-rm-time-body class="hidden space-y-2 pl-6">
        <input data-rm-time type="text" inputmode="decimal" value="${escapeHtml(String(item.time ?? ''))}" placeholder="seconds, e.g. 73.45" class="w-full mod-field text-sm" />
        <input data-rm-time-reason type="text" placeholder="Reason for the time change (required)" class="w-full mod-field text-sm" />
      </div>
    </section>

    <section class="space-y-3">
      <label class="inline-flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" data-rm-ver-toggle class="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500/60 dark:border-zinc-600" />
        Change verification <span class="text-xs font-normal text-zinc-400 dark:text-zinc-500">(currently ${verified ? 'Verified' : 'Unverified'})</span>
      </label>
      <div data-rm-ver-body class="hidden space-y-2 pl-6">
        <div data-rm-ver-seg class="inline-flex overflow-hidden rounded-lg border border-zinc-200/80 dark:border-white/10">
          <button type="button" data-ver="true" class="px-3 py-1.5 text-sm transition hover:bg-zinc-100 dark:hover:bg-white/10">Verified</button>
          <button type="button" data-ver="false" class="px-3 py-1.5 text-sm border-l border-zinc-200/80 transition hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/10">Unverified</button>
        </div>
        <input data-rm-ver-reason type="text" placeholder="Reason (optional)" class="w-full mod-field text-sm" />
      </div>
    </section>

    <section class="space-y-3">
      <label class="inline-flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" data-rm-sus-toggle class="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500/60 dark:border-zinc-600" />
        Change suspicious flag <span class="text-xs font-normal text-zinc-400 dark:text-zinc-500">(currently ${item.suspicious ? 'flagged' : 'not flagged'})</span>
      </label>
      <div data-rm-sus-body class="hidden space-y-2 pl-6">
        <div data-rm-sus-mode-seg class="inline-flex overflow-hidden rounded-lg border border-zinc-200/80 dark:border-white/10">
          <button type="button" data-mode="mark" class="px-3 py-1.5 text-sm transition hover:bg-zinc-100 dark:hover:bg-white/10">Mark suspicious</button>
          <button type="button" data-mode="unmark" class="px-3 py-1.5 text-sm border-l border-zinc-200/80 transition hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/10">Unmark</button>
        </div>
        <div data-rm-sus-mark class="hidden space-y-2">
          <div data-rm-sus-type-seg class="inline-flex overflow-hidden rounded-lg border border-zinc-200/80 dark:border-white/10">
            <button type="button" data-type="Cheating" class="px-3 py-1.5 text-sm transition hover:bg-zinc-100 dark:hover:bg-white/10">Cheating</button>
            <button type="button" data-type="Scripting" class="px-3 py-1.5 text-sm border-l border-zinc-200/80 transition hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/10">Scripting</button>
          </div>
          <input data-rm-sus-context type="text" placeholder="Context (required when marking)" class="w-full mod-field text-sm" />
        </div>
      </div>
    </section>
  `;
  return wrap;
}

function wireModalInteractions(overlay, item) {
  const gate = (toggleSel, bodySel) => {
    const t = $(toggleSel, overlay);
    const b = $(bodySel, overlay);
    t?.addEventListener('change', () => b?.classList.toggle('hidden', !t.checked));
  };
  gate('[data-rm-time-toggle]', '[data-rm-time-body]');
  gate('[data-rm-ver-toggle]', '[data-rm-ver-body]');
  gate('[data-rm-sus-toggle]', '[data-rm-sus-body]');

  segWire(overlay, '[data-rm-ver-seg]', 'data-ver', () => {});
  applySeg(overlay, '[data-rm-ver-seg]', 'data-ver', item.verified ? 'true' : 'false');

  const markBox = $('[data-rm-sus-mark]', overlay);
  segWire(overlay, '[data-rm-sus-mode-seg]', 'data-mode', (v) => {
    markBox?.classList.toggle('hidden', v !== 'mark');
  });
  applySeg(overlay, '[data-rm-sus-mode-seg]', 'data-mode', 'mark');
  markBox?.classList.remove('hidden');

  segWire(overlay, '[data-rm-sus-type-seg]', 'data-type', () => {});
}

// Returns the payload object, or null if validation failed (a toast was shown).
function collectPayload(overlay, item) {
  const payload = { moderated_by: MOD_ID };

  if ($('[data-rm-time-toggle]', overlay)?.checked) {
    const t = Number(($('[data-rm-time]', overlay)?.value || '').trim());
    if (!Number.isFinite(t) || t < 0) {
      DEPS.toast('Enter a valid time in seconds', 'warn');
      return null;
    }
    const reason = ($('[data-rm-time-reason]', overlay)?.value || '').trim();
    if (!reason) {
      DEPS.toast('Time change reason is required', 'warn');
      return null;
    }
    payload.time = t;
    payload.time_change_reason = reason;
  }

  if ($('[data-rm-ver-toggle]', overlay)?.checked) {
    payload.verified = getSeg(overlay, '[data-rm-ver-seg]') === 'true';
    const r = ($('[data-rm-ver-reason]', overlay)?.value || '').trim();
    if (r) payload.verification_reason = r;
  }

  if ($('[data-rm-sus-toggle]', overlay)?.checked) {
    const mode = getSeg(overlay, '[data-rm-sus-mode-seg]');
    if (mode === 'mark') {
      const type = getSeg(overlay, '[data-rm-sus-type-seg]');
      const ctx = ($('[data-rm-sus-context]', overlay)?.value || '').trim();
      if (!type) {
        DEPS.toast('Choose a flag type', 'warn');
        return null;
      }
      if (!ctx) {
        DEPS.toast('Suspicious context is required', 'warn');
        return null;
      }
      payload.mark_suspicious = true;
      payload.suspicious_flag_type = type;
      payload.suspicious_context = ctx;
    } else {
      payload.unmark_suspicious = true;
    }
  }

  return payload;
}

function openModerateModal(root, item) {
  if (!/^\d+$/.test(MOD_ID)) {
    DEPS.toast('Your moderator ID is missing — cannot moderate', 'warn');
    return;
  }
  if (item.id == null) {
    DEPS.toast('This record has no id — cannot moderate', 'warn');
    return;
  }

  const body = buildModalBody(item);
  const saveBtn = primaryButton('Save changes');
  const cancelBtn = ghostButton('Cancel');
  const footer = document.createDocumentFragment();
  footer.append(saveBtn, cancelBtn);

  const { overlay, close } = openModal({
    title: `${item.map_name || 'Record'} · ${item.code || ''}`,
    subtitle: `${item.name || 'User ' + item.user_id} · #${item.id}`,
    body,
    footer,
    width: 'md',
  });

  wireModalInteractions(overlay, item);
  cancelBtn.addEventListener('click', close);

  saveBtn.addEventListener('click', async () => {
    const payload = collectPayload(overlay, item);
    if (payload === null) return;
    if (Object.keys(payload).length <= 1) {
      DEPS.toast('No changes to apply', 'warn');
      return;
    }
    setButtonBusy(saveBtn, true);
    let res;
    try {
      res = await DEPS.http('PUT', moderateApi(item.id), { body: payload });
    } catch {
      DEPS.toast('Network error — try again.', 'err');
      setButtonBusy(saveBtn, false);
      return;
    }
    const { ok, status, url, data } = res;
    DEPS.logActivity({ title: 'Moderate completion', method: 'PUT', url, ok, status, data });
    if (ok) {
      DEPS.toast('Record moderated', 'ok');
      close();
      runSearch(root, { resetPage: false });
    } else {
      DEPS.toast(
        data?.detail || data?.message || httpErrorMessage(status, { noun: 'the record' }),
        'err'
      );
      setButtonBusy(saveBtn, false);
    }
  });
}
