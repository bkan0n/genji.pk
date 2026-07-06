import {
  $, setView, makeRecentStore, renderRecentChips, wireUserSearch, withBusy,
} from './workspace-shell.js';

const API = '/api/mods/completions/suspicious';

let DEPS = null;
let CURRENT = null; // { id, name, items }
const recent = makeRecentStore('mod.records.recent');

// Signed-in moderator id (auto-attributed on new flags).
const MOD_ID = (document.getElementById('modUserId')?.value || '').trim();

// Inline flag-form selections (segmented controls).
let refKind = 'message_id';
let flagType = 'Cheating';

const ACTIVE = ['bg-emerald-500/15', 'text-emerald-800', 'dark:text-emerald-300', 'font-semibold'];

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

export function initRecordsWorkspace(deps) {
  DEPS = deps;
  const root = $('[data-records-workspace]');
  if (!root) return;
  setView(root, 'empty'); // hide loading/error/loaded until a player is loaded

  const search = $('[data-records-search]', root);
  const nameGuess = () => {
    const v = (search?.value || '').trim();
    return v && !/^\d+$/.test(v) ? v : '';
  };
  wireUserSearch(search, { deps: DEPS, onLoad: (id) => loadFlags(root, id, nameGuess()) });
  renderRecent(root);

  // flagged_by label
  const fbLabel = $('[data-records-flaggedby-label]', root);
  if (fbLabel) fbLabel.textContent = MOD_ID ? `you (${MOD_ID})` : 'you';

  wireFlagForm(root);
}

function renderRecent(root) {
  const wrap = $('[data-records-recent]', root);
  renderRecentChips(wrap, recent, (id) => {
    const hit = recent.get().find((r) => r.id === String(id));
    loadFlags(root, id, hit?.name && hit.name !== String(id) ? hit.name : '');
  });
}

async function loadFlags(root, userId, displayName) {
  const id = String(userId);
  CURRENT = { id, name: displayName || (CURRENT && CURRENT.id === id ? CURRENT.name : ''), items: [] };
  setView(root, 'loading');

  let res;
  try {
    res = await DEPS.http('GET', API, { query: { user_id: id } });
  } catch {
    return showError(root, 'Network error — try again.');
  }
  const { ok, status, url, data } = res;
  DEPS.logActivity({ title: 'Get suspicious flags', method: 'GET', url, ok, status, data });
  if (!ok) {
    return showError(root, data?.message || `Lookup failed (${status}).`);
  }

  const items = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
  CURRENT.items = items;
  recent.push({ id, name: CURRENT.name || id });
  renderRecent(root);
  renderHeader(root);
  renderFlags(root, items);
  resetFlagForm(root);
  setView(root, 'loaded');
}

function showError(root, message) {
  const box = $('[data-records-error]', root);
  if (box) box.textContent = message;
  setView(root, 'error');
  DEPS.toast('Lookup failed', 'err');
}

function renderHeader(root) {
  const nameEl = $('[data-records-player-name]', root);
  const idEl = $('[data-records-player-id]', root);
  if (nameEl) nameEl.textContent = CURRENT.name || `User ${CURRENT.id}`;
  if (idEl) idEl.textContent = CURRENT.id;
}

function refOf(item) {
  if (item.message_id != null) return { kind: 'message_id', label: 'msg', val: String(item.message_id) };
  if (item.verification_id != null) return { kind: 'verification_id', label: 'ver', val: String(item.verification_id) };
  return null;
}

function renderFlags(root, items) {
  const list = $('[data-records-list]', root);
  const empty = $('[data-records-empty]', root);
  const count = $('[data-records-count]', root);
  if (count) count.textContent = items.length ? `${items.length} suspicious flag${items.length === 1 ? '' : 's'}` : '';
  if (!list) return;
  list.innerHTML = '';
  if (!items.length) {
    empty?.classList.remove('hidden');
    return;
  }
  empty?.classList.add('hidden');
  items.forEach((it) => list.appendChild(buildCard(root, it)));
}

function buildCard(root, item) {
  const ref = refOf(item);
  const isMe = MOD_ID && String(item.flagged_by) === MOD_ID;
  const badge =
    item.flag_type === 'Scripting'
      ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300'
      : 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300';

  const card = document.createElement('div');
  card.className = 'rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] p-3';
  card.innerHTML = `
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 space-y-1">
        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-md border px-2 py-0.5 text-xs font-semibold ${badge}">${escapeHtml(item.flag_type || '—')}</span>
          ${ref ? `<span class="rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-0.5 text-xs font-mono text-zinc-600 dark:text-zinc-300">${ref.label} ${escapeHtml(ref.val)}</span>` : ''}
          <span class="text-xs text-zinc-500 dark:text-zinc-400">by ${isMe ? 'you' : escapeHtml(String(item.flagged_by ?? '—'))}</span>
        </div>
        <div class="text-sm text-zinc-700 dark:text-zinc-200">${item.context ? escapeHtml(item.context) : '<span class="text-zinc-500 dark:text-zinc-400">(no context)</span>'}</div>
      </div>
      <div class="shrink-0">
        <button type="button" data-clear class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-2.5 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-white/10"${ref ? '' : ' disabled'}>Clear</button>
        <span data-confirm class="hidden items-center gap-1">
          <button type="button" data-confirm-yes class="rounded-lg bg-rose-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-800">Confirm?</button>
          <button type="button" data-confirm-no class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-2.5 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-white/10">Cancel</button>
        </span>
      </div>
    </div>
  `;

  const clearBtn = $('[data-clear]', card);
  const confirmWrap = $('[data-confirm]', card);
  const yes = $('[data-confirm-yes]', card);
  const no = $('[data-confirm-no]', card);
  if (clearBtn && confirmWrap && ref) {
    clearBtn.onclick = () => {
      clearBtn.classList.add('hidden');
      confirmWrap.classList.remove('hidden');
      confirmWrap.classList.add('inline-flex');
    };
    no.onclick = () => {
      confirmWrap.classList.add('hidden');
      confirmWrap.classList.remove('inline-flex');
      clearBtn.classList.remove('hidden');
    };
    yes.onclick = (e) => withBusy(e.currentTarget, () => deleteFlag(root, ref));
  }
  return card;
}

async function deleteFlag(root, ref) {
  const body = { message_id: null, verification_id: null };
  body[ref.kind] = ref.val;
  const { ok, status, url, data } = await DEPS.http('DELETE', API, { body });
  DEPS.logActivity({ title: 'Remove suspicious flag', method: 'DELETE', url, ok, status, data });
  DEPS.toast(ok ? 'Flag removed' : 'Failed', ok ? 'ok' : 'err');
  if (ok) loadFlags(root, CURRENT.id, CURRENT.name);
}

// ---- Flag-a-record form ----

function wireFlagForm(root) {
  const toggle = $('[data-records-flag-toggle]', root);
  const form = $('[data-records-flag-form]', root);
  const cancel = $('[data-records-flag-cancel]', root);
  if (!form) return;

  toggle?.addEventListener('click', () => {
    const open = !form.classList.contains('hidden');
    if (open) {
      resetFlagForm(root);
    } else {
      form.classList.remove('hidden');
      $('[data-records-ref-input]', root)?.focus();
    }
  });
  cancel?.addEventListener('click', () => resetFlagForm(root));

  // Segmented controls
  segWire(root, '[data-records-ref-seg]', 'data-ref-kind', (v) => { refKind = v; });
  segWire(root, '[data-records-type-seg]', 'data-flag-type', (v) => { flagType = v; });
  applySeg(root, '[data-records-ref-seg]', 'data-ref-kind', refKind);
  applySeg(root, '[data-records-type-seg]', 'data-flag-type', flagType);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    withBusy(form.querySelector('button[type="submit"]'), () => submitFlag(root));
  });
}

function segWire(root, segSel, attr, onPick) {
  const seg = $(segSel, root);
  if (!seg) return;
  seg.querySelectorAll(`[${attr}]`).forEach((btn) => {
    btn.addEventListener('click', () => {
      const v = btn.getAttribute(attr);
      onPick(v);
      applySeg(root, segSel, attr, v);
    });
  });
}

function applySeg(root, segSel, attr, value) {
  const seg = $(segSel, root);
  if (!seg) return;
  seg.querySelectorAll(`[${attr}]`).forEach((btn) => {
    const on = btn.getAttribute(attr) === value;
    for (const cls of ACTIVE) btn.classList.toggle(cls, on);
  });
}

function resetFlagForm(root) {
  const form = $('[data-records-flag-form]', root);
  if (!form) return;
  form.classList.add('hidden');
  const refInput = $('[data-records-ref-input]', root);
  const ctx = $('[data-records-context]', root);
  if (refInput) refInput.value = '';
  if (ctx) ctx.value = '';
  refKind = 'message_id';
  flagType = 'Cheating';
  applySeg(root, '[data-records-ref-seg]', 'data-ref-kind', refKind);
  applySeg(root, '[data-records-type-seg]', 'data-flag-type', flagType);
}

async function submitFlag(root) {
  if (!CURRENT) return;
  const refVal = ($('[data-records-ref-input]', root)?.value || '').trim();
  const context = ($('[data-records-context]', root)?.value || '').trim();

  if (!/^\d+$/.test(refVal)) return DEPS.toast('Record reference must be digits', 'warn');
  if (!context) return DEPS.toast('Context is required', 'warn');
  if (!flagType) return DEPS.toast('Flag type is required', 'warn');
  if (!/^\d+$/.test(MOD_ID)) return DEPS.toast('Your moderator ID is missing — cannot attribute the flag', 'warn');

  const body = {
    context,
    flag_type: flagType,
    flagged_by: MOD_ID,
    message_id: refKind === 'message_id' ? refVal : null,
    verification_id: refKind === 'verification_id' ? refVal : null,
  };

  const { ok, status, url, data } = await DEPS.http('POST', API, { body });
  DEPS.logActivity({ title: 'Set suspicious flag', method: 'POST', url, ok, status, data });
  DEPS.toast(ok ? 'Flag created' : 'Failed', ok ? 'ok' : 'err');
  if (ok) loadFlags(root, CURRENT.id, CURRENT.name);
}
