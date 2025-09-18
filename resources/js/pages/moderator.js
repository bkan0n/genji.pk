/* Moderator Panel JS – 2 niveaux d'onglets, transitions, toasts */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const API_MODS = '/api/mods';
const asId = (input) => String(input?.value ?? '').trim();
const isDigits = (s) => /^\d+$/.test(String(s || ''));
const getBool = (id) => !!document.getElementById(id)?.checked;

const PLAYTESTING_OPTIONS = [
  { value: 'Approved', text: 'Approved' },
  { value: 'In Progress', text: 'In Progress' },
  { value: 'Rejected', text: 'Rejected' },
];

// --- UI helpers ---
function toast(msg, type = 'ok') {
  const node = document.createElement('div');
  node.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] rounded-xl px-4 py-2 text-sm shadow-lg text-center ${
    type === 'ok'
      ? 'bg-emerald-500 text-white'
      : type === 'warn'
        ? 'bg-amber-500 text-zinc-900'
        : 'bg-red-600 text-white'
  }`;

  node.style.opacity = '0';
  node.style.transform = 'translateX(-50%) translateY(8px)';
  node.style.transition = 'opacity 220ms ease, transform 220ms ease';
  node.style.willChange = 'opacity, transform';

  node.textContent = msg;
  document.body.appendChild(node);

  requestAnimationFrame(() => {
    node.style.opacity = '1';
    node.style.transform = 'translateX(-50%) translateY(0)';
  });

  const hide = () => {
    node.style.opacity = '0';
    node.style.transform = 'translateX(-50%) translateY(8px)';
    const remove = () => node.remove();
    node.addEventListener('transitionend', remove, { once: true });
    setTimeout(remove, 300);
  };

  setTimeout(hide, 2200);
}
const escapeHtml = (s = '') =>
  s.replace(
    /[&<>"'`=\/]/g,
    (ch) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;',
      })[ch]
  );

async function copyText(text = '') {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(String(text));
      return true;
    }
  } catch {}

  try {
    const ta = document.createElement('textarea');
    ta.value = String(text);
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    const ok = document.execCommand('copy');
    ta.remove();
    return !!ok;
  } catch {
    return false;
  }
}

(() => {
  document.querySelectorAll('[data-dd-select]').forEach((dd) => {
    const btn = dd.querySelector('[data-dd-btn]');
    const list = dd.querySelector('[data-dd-list]');
    const labelEl = btn.querySelector('.dd-label');

    const update = () => {
      const checked = dd.querySelector('input[type="radio"]:checked');
      const text = checked?.dataset.label || checked?.value || '';
      if (labelEl && text) labelEl.textContent = text;
    };

    btn.addEventListener('click', () => {
      list.classList.toggle('hidden');
    });
    list.addEventListener('change', () => {
      update();
      list.classList.add('hidden');
    });
    document.addEventListener('click', (e) => {
      if (!dd.contains(e.target)) list.classList.add('hidden');
    });

    update();
  });
})();

(function () {
  const id = 'rw-rewardTypeDropdown';
  const opts = [
    { value: '', text: 'Any' },
    { value: 'skin', text: 'Skin' },
    { value: 'spray', text: 'Spray' },
    { value: 'background', text: 'Background' },
  ];
  if (typeof buildRadioDropdown === 'function') buildRadioDropdown(id, opts, 'Any');
  const root = document.getElementById(id);
  if (!root) return;
  if (typeof ddSelectByValue === 'function') ddSelectByValue(root, '');
  const hidden = root.querySelector('input[name="reward_type"]');
  if (hidden) hidden.value = '';
  root.addEventListener(
    'change',
    function () {
      const v = root.querySelector('[data-dd-list] input[type="radio"]:checked')?.value ?? '';
      if (hidden) hidden.value = v;
    },
    { passive: true }
  );
})();

(function () {
  const id = 'gr-rewardTypeDropdown';
  const opts = [
    { value: '', text: 'Any' },
    { value: 'skin', text: 'Skin' },
    { value: 'spray', text: 'Spray' },
    { value: 'background', text: 'Background' },
  ];
  if (typeof buildRadioDropdown === 'function') buildRadioDropdown(id, opts, 'Any');
  const root = document.getElementById(id);
  if (!root) return;
  if (typeof ddSelectByValue === 'function') ddSelectByValue(root, '');
  const hidden = root.querySelector('input[name="reward_type"]');
  if (hidden) hidden.value = '';
  root.addEventListener(
    'change',
    function () {
      const v = root.querySelector('[data-dd-list] input[type="radio"]:checked')?.value ?? '';
      if (hidden) hidden.value = v;
    },
    { passive: true }
  );
})();

(function () {
  const id = 'va-rewardTypeDropdown';
  const opts = [
    { value: 'any', text: 'Any' },
    { value: 'skin', text: 'Skin' },
    { value: 'spray', text: 'Spray' },
    { value: 'background', text: 'Background' },
  ];
  if (typeof buildRadioDropdown === 'function') buildRadioDropdown(id, opts, 'Any');

  const root = document.getElementById(id);
  if (!root) return;

  if (typeof ddSelectByValue === 'function') ddSelectByValue(root, 'any');

  const hidden = root.querySelector('input[name="reward_type"]');
  if (hidden) hidden.value = 'any';

  root.addEventListener(
    'change',
    function () {
      const v = root.querySelector('[data-dd-list] input[type="radio"]:checked')?.value ?? 'any';
      if (hidden) hidden.value = v;
    },
    { passive: true }
  );
})();

(function disableNativeValidation() {
  document
    .querySelectorAll('form[data-action="submit-map"], form[data-action="update-map"]')
    .forEach((f) => f.setAttribute('novalidate', ''));
})();

(function rememberDefaults() {
  const roots = [document];

  function remember(root) {
    root.querySelectorAll('input, select, textarea').forEach((el) => {
      if (el.dataset.defaultSaved) return;
      if (el.type === 'checkbox' || el.type === 'radio') {
        el.dataset.defaultChecked = String(el.checked);
      } else {
        el.dataset.defaultValue = el.value ?? '';
      }
      el.dataset.defaultSaved = '1';
    });

    root.querySelectorAll('[data-dd-select]').forEach((dd) => {
      const label = dd.querySelector('.dd-label');
      const checked = dd.querySelector('[data-dd-list] input[type="radio"]:checked');
      if (!label.dataset.placeholder) label.dataset.placeholder = label.textContent || 'Select';
      if (!dd.dataset.defaultValue) dd.dataset.defaultValue = checked ? checked.value : '';
    });
  }

  roots.forEach(remember);
})();

// --- Modal (pour grandes réponses) ---
function showModal({ title = 'Response', subtitle = '', bodyText = '' } = {}) {
  const overlay = document.createElement('div');
  overlay.className =
    'fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4';
  overlay.innerHTML = `
        <div class="w-full max-w-4xl rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
        <div class="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div>
            <h3 class="font-semibold">${title}</h3>
            ${subtitle ? `<div class="text-xs text-zinc-400 mt-0.5">${subtitle}</div>` : ''}
            </div>
            <div class="flex items-center gap-2">
            <button class="copy cursor-pointer px-2 py-1 text-xs rounded-lg border border-white/10 hover:bg-white/5">Copy</button>
            <button class="close cursor-pointer px-2 py-1 text-xs rounded-lg border border-white/10 hover:bg-white/5">Close</button>
            </div>
        </div>
        <div class="p-4 max-h-[70vh] overflow-auto">
            <pre class="text-xs whitespace-pre leading-tight"></pre>
        </div>
        </div>
    `;
  document.body.appendChild(overlay);

  overlay.querySelector('pre').textContent = bodyText;

  const close = () => overlay.remove();
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  overlay.querySelector('.close')?.addEventListener('click', close);
  overlay.querySelector('.copy')?.addEventListener('click', async () => {
    const ok = await copyText(bodyText);
    toast(ok ? 'Copied to clipboard' : 'Copy failed', ok ? 'ok' : 'err');
  });
  const onKey = (ev) => {
    if (ev.key === 'Escape') {
      close();
      document.removeEventListener('keydown', onKey);
    }
  };
  document.addEventListener('keydown', onKey);
}

// --- Activity log ---
function logActivity({ title, method, url, ok, status, data }) {
  const wrap = document.createElement('div');
  wrap.className = 'rounded-lg border border-white/10 bg-zinc-900 p-3 fade-in';
  wrap.dataset.logCard = '1';

  const pretty = typeof data === 'string' ? data : JSON.stringify(data ?? {}, null, 2);
  const lines = pretty.split('\n');
  const isLong = pretty.length > 600 || lines.length > 25;

  let preview = pretty;
  if (isLong) {
    const shown = 25;
    preview =
      lines.slice(0, shown).join('\n') + `\n…\n(${Math.max(0, lines.length - shown)} more lines)`;
  }

  wrap.innerHTML = `
    <div class="flex items-center justify-between text-xs mb-2">
      <span class="font-semibold">${title ?? 'Request'}</span>
      <span class="${ok ? 'text-emerald-400' : 'text-red-400'}">${status}</span>
    </div>
    <div class="text-[11px] text-zinc-400 mb-2">${method} ${url}</div>
    <pre class="resp text-xs whitespace-pre-wrap break-words leading-tight ${isLong ? 'cursor-zoom-in' : ''}"></pre>
    <div class="mt-2 flex items-center gap-2">
      <button class="view-full cursor-pointer text-xs rounded-lg border border-white/10 px-2 py-1 hover:bg-white/5">View full</button>
      <button class="copy-full cursor-pointer text-xs rounded-lg border border-white/10 px-2 py-1 hover:bg-white/5">Copy</button>
    </div>
  `;
  wrap.querySelector('.resp').textContent = preview;

  wrap._fullText = pretty;
  wrap._meta = { title: title ?? 'Response', method, url, isLong };

  $('#activityLog')?.prepend(wrap);
}

(function setupLogDelegation() {
  const container = $('#activityLog');
  if (!container) return;

  container.addEventListener('click', async (e) => {
    const card = e.target.closest('[data-log-card]');
    if (!card) return;

    if (e.target.closest('.view-full')) {
      const meta = card._meta || {};
      showModal({
        title: meta.title || 'Response',
        subtitle: `${meta.method || ''} ${meta.url || ''}`.trim(),
        bodyText: card._fullText || '',
      });
      return;
    }

    if (e.target.closest('.copy-full')) {
      const ok = await copyText(card._fullText || '');
      toast(ok ? 'Copied to clipboard' : 'Copy failed', ok ? 'ok' : 'err');
      return;
    }

    if (card._meta?.isLong && e.target.matches('pre.resp')) {
      const meta = card._meta || {};
      showModal({
        title: meta.title || 'Response',
        subtitle: `${meta.method || ''} ${meta.url || ''}`.trim(),
        bodyText: card._fullText || '',
      });
    }
  });
})();

// --- HTTP ---
function http(method, url, { body, query, headers } = {}) {
  const qs = query
    ? '?' +
      new URLSearchParams(
        Object.entries(query).flatMap(([k, v]) =>
          Array.isArray(v) ? v.map((x) => [k, x]) : [[k, v]]
        )
      ).toString()
    : '';

  const tokenMeta = document.querySelector('meta[name="csrf-token"]')?.content || '';
  const xsrfFromCookie = document.cookie
    .split('; ')
    .find((c) => c.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  const opts = {
    method,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      'X-Requested-With': 'XMLHttpRequest',
      ...(tokenMeta ? { 'X-CSRF-TOKEN': tokenMeta } : {}),
      ...(xsrfFromCookie ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfFromCookie) } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  return fetch(url + qs, opts).then(async (r) => ({
    ok: r.ok,
    status: r.status,
    url: r.url,
    data:
      (await r
        .clone()
        .json()
        .catch(() => null)) ?? (await r.text().catch(() => '')),
  }));
}

// --- Tabs (niveau 1) ---
(function setupTabs() {
  const tabs = $$('#modTabs .mod-tab');
  const panels = $$('.mod-panel');
  tabs.forEach((btn) =>
    btn.addEventListener('click', () => {
      const current = panels.find?.((p) => !p.classList.contains('hidden')) || null;
      if (current) resetSection(current);

      tabs.forEach((b) => b.classList.remove('active', 'bg-white/10'));
      btn.classList.add('active', 'bg-white/10');

      const id = btn.dataset.tab;
      panels.forEach((panel) => {
        const isCurrent = panel.dataset.panel === id;
        panel.classList.toggle('hidden', !isCurrent);
        if (isCurrent) {
          const subtabBtns = $$('.mod-subtab', panel);
          subtabBtns.forEach((b) => {
            b.setAttribute('aria-selected', 'false');
            b.classList.remove('active', 'bg-white/10');
          });
          const subpanels = $$('[data-subpanel]', panel);
          subpanels.forEach((sp) => sp.classList.add('hidden'));
          $('.empty-state', panel)?.classList.remove('hidden');
        }
      });
      setTimeout(() => btn.focus({ preventScroll: true }), 0);
    })
  );
})();

function resetSection(root = document) {
  if (!root) return;

  root.querySelectorAll('input, select, textarea').forEach((el) => {
    if (el.type === 'checkbox' || el.type === 'radio') {
      const d = el.dataset.defaultChecked;
      if (d != null) el.checked = d === 'true';
    } else {
      if (el.dataset.defaultValue != null) el.value = el.dataset.defaultValue;
      else el.value = '';
    }
    if ('uid' in el.dataset) delete el.dataset.uid;
  });

  root.querySelectorAll('[data-dd-select]').forEach((dd) => {
    const list = dd.querySelector('[data-dd-list]');
    const label = dd.querySelector('.dd-label');
    const def = dd.dataset.defaultValue ?? '';

    list?.querySelectorAll('input[type="radio"]').forEach((r) => (r.checked = false));

    if (def !== '') {
      const sel = list?.querySelector(`input[type="radio"][value="${CSS.escape(def)}"]`);
      if (sel) {
        sel.checked = true;
        const txt = sel.parentElement.querySelector('span:last-child')?.textContent || def;
        if (label) label.textContent = txt;
      }
    } else {
      if (label) label.textContent = label.dataset.placeholder || 'Select';
    }

    if (list?.querySelector('input[type="checkbox"]')) {
      list.querySelectorAll('input[type="checkbox"]').forEach((c) => (c.checked = false));
      if (label) label.textContent = label.dataset.placeholder || 'Select';
    }

    list?.classList.add('hidden');
  });

  root.querySelectorAll('.ac-list').forEach((l) => l.classList.add('hidden'));

  root.querySelectorAll('#bannerDrop, #u-bannerDrop, #s-bannerDrop').forEach((drop) => {
    drop.querySelector('img')?.remove();
  });
  root
    .querySelectorAll('#bannerPlaceholder, #u-bannerPlaceholder, #s-bannerPlaceholder')
    .forEach((ph) => ph.classList.remove('hidden'));
  window.customBannerFile = null;
  window.customBannerFileUpdate = null;

  root.querySelectorAll('.inline-edit-container').forEach((c) => c.remove());
  root.querySelectorAll('.editing').forEach((el) => el.classList.remove('editing'));

  ['rw-rewardTypeDropdown', 'gr-rewardTypeDropdown', 'va-rewardTypeDropdown'].forEach((id) => {
    const dd = document.getElementById(id);
    if (!dd || !dd.isConnected) return;

    const def = id === 'va-rewardTypeDropdown' ? 'any' : '';

    if (typeof ddSelectByValue === 'function') ddSelectByValue(dd, def);

    const hidden = dd.querySelector('input[type="hidden"][name="reward_type"]');
    if (hidden) hidden.value = def;

    dd.querySelector('[data-dd-list]')?.classList.add('hidden');
  });
}

// --- Subtabs (niveau 2) ---
function getHeaderOffset() {
  const nav = document.querySelector('nav, header');
  const h = nav?.offsetHeight || 80;
  return h + 12;
}
function scrollIntoViewWithOffset(el, offset) {
  const rectTop = el.getBoundingClientRect().top + window.scrollY;
  const targetY = Math.max(0, rectTop - offset);
  const inView =
    el.getBoundingClientRect().top >= offset &&
    el.getBoundingClientRect().bottom <= window.innerHeight;
  if (!inView) window.scrollTo({ top: targetY, behavior: 'smooth' });
}

(function setupSubtabs() {
  $$('.mod-panel').forEach((panel) => {
    panel.addEventListener('click', (e) => {
      const target = e.target.closest('.mod-subtab');
      if (!target) return;
      const name = target.dataset.subtab;

      const subpanels = $$('[data-subpanel]', panel);
      subpanels.forEach((sp) => {
        if (sp.dataset.subpanel !== name) resetSection(sp);
        sp.classList.add('hidden');
      });

      $$('.mod-subtab', panel).forEach((b) => {
        const isActive = b === target;
        b.setAttribute('aria-selected', String(isActive));
        b.classList.toggle('active', isActive);
        b.classList.toggle('bg-white/10', isActive);
      });

      const active = panel.querySelector(`[data-subpanel="${CSS.escape(name)}"]`);
      if (active) {
        $('.empty-state', panel)?.classList.add('hidden');
        active.classList.remove('hidden');
        active.classList.add('fade-in');
        scrollIntoViewWithOffset(active, getHeaderOffset());

        if (name === 'maps-submit') initSubmitPanel();
        if (name === 'maps-archive') setupArchiveMapsUI();
        if (name === 'maps-search') initSearchPanel();
        if (name === 'maps-update') initUpdatePanel();
        if (name === 'mod-quality') initModQualityPanel();
        if (name === 'verif-pending') {
          ensureVerifResultsContainer();
          handleGetPendingVerifs();
        }
        wireFormAutocompletes(active);
      }

      setTimeout(() => target.focus?.({ preventScroll: true }), 0);
    });
  });
})();

// --- Clear log ---
$('#clearLog')?.addEventListener('click', () => {
  $('#activityLog').innerHTML = '';
});

// ===================== AUTOCOMPLETE ENGINE =====================
const LOCALE = document.documentElement.lang?.split('-')[0] || 'en';
const AC_PAGE_SIZE = 8;

function acEndpoint(kind, value, pageSize = AC_PAGE_SIZE, locale = LOCALE) {
  if (kind === 'map-codes')
    return `/api/autocomplete/map-codes?search=${encodeURIComponent(value)}&limit=${pageSize}`;
  if (kind === 'users')
    return `/api/autocomplete/users?value=${encodeURIComponent(value)}&page_size=${pageSize}`;
  if (kind === 'map-names')
    return `/api/autocomplete/map-names/${encodeURIComponent(locale)}?value=${encodeURIComponent(value)}&page_size=${pageSize}`;
  return '';
}

const acDebounce = (fn, ms = 160) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

function pickText(x) {
  if (x == null) return '';
  if (typeof x === 'string' || typeof x === 'number') return String(x);
  const keys = ['name', 'map_name', 'title', 'value', 'label', 'text', 'display', 'code'];
  for (const k of keys) if (x[k] != null) return String(x[k]);
  const firstStr = Object.values(x).find((v) => typeof v === 'string' || typeof v === 'number');
  return firstStr != null ? String(firstStr) : '';
}

function normalizeUserItem(u) {
  if (Array.isArray(u) && u.length >= 2) {
    return { id: String(u[0]), label: String(u[1]) };
  }
  if (u && typeof u === 'object') {
    const id = u.id ?? u.user_id ?? u.value ?? '';
    const label = u.label ?? u.name ?? u.nickname ?? u.global_name ?? u.display ?? String(id);
    return { id: String(id), label: String(label) };
  }
  return { id: String(u ?? ''), label: String(u ?? '') };
}

async function acFetch(kind, q) {
  if (!q) return [];
  try {
    const res = await fetch(acEndpoint(kind, q), {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });
    const raw = await res.json();
    const arr = Array.isArray(raw) ? raw : raw.items || raw.results || raw.data || [];

    if (kind === 'users') {
      return arr.map(normalizeUserItem);
    }
    if (kind === 'map-codes') {
      return arr.map((v) => ({ value: pickText(v?.code ?? v) }));
    }
    if (kind === 'map-names') {
      return arr.map((v) => ({ value: pickText(v) }));
    }
    return [];
  } catch {
    return [];
  }
}

function wireAutocomplete(input, { kind, onPick }) {
  if (!input || input.__acBound) return;
  input.__acBound = true;

  input.parentElement?.classList.add('relative');

  const list = document.createElement('div');
  list.className =
    'ac-list absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-white/10 bg-zinc-900/95 shadow-2xl ring-1 ring-white/10 backdrop-blur max-h-56 overflow-auto hidden';
  input.parentElement.appendChild(list);

  const inMapsPanel = !!input.closest(
    '[data-subpanel="maps-search"], [data-subpanel="maps-submit"], [data-subpanel="maps-update"]'
  );

  function reposition() {
    if (!(kind === 'users' && inMapsPanel)) return;

    const desiredWidth = input.dataset.acWidth || `${input.offsetWidth}px`;

    const parent = input.parentElement;
    const pr = parent.getBoundingClientRect();
    const r = input.getBoundingClientRect();
    const left = r.left - pr.left + parent.scrollLeft;
    const top = r.top - pr.top + parent.scrollTop + input.offsetHeight + 4;

    list.style.right = 'auto';
    list.style.left = `${left}px`;
    list.style.top = `${top}px`;
    list.style.width = desiredWidth;
    list.style.maxWidth = '90vw';
    list.style.minWidth = '8rem';
  }

  if (kind === 'users' && inMapsPanel) {
    const ro = new ResizeObserver(() => reposition());
    ro.observe(input);
    window.addEventListener('resize', reposition, { passive: true });
  }

  let items = [];
  let active = -1;

  function render() {
    list.innerHTML = '';
    if (!items.length) {
      list.classList.add('hidden');
      return;
    }
    items.forEach((it, idx) => {
      const row = document.createElement('div');
      row.className = 'px-3 py-2 text-sm cursor-pointer hover:bg-white/10';
      row.dataset.index = idx;
      if (kind === 'users') {
        row.innerHTML = `<div class="truncate">${escapeHtml(it.label)}</div><div class="text-[11px] text-zinc-400">${it.id}</div>`;
      } else {
        row.textContent = it.value ?? '';
      }
      if (idx === active) row.classList.add('bg-white/10');
      list.appendChild(row);
    });
    list.classList.remove('hidden');
  }

  const search = acDebounce(async () => {
    const q = input.value.trim();
    if (!q) {
      items = [];
      render();
      return;
    }
    items = await acFetch(kind, q);
    active = items.length ? 0 : -1;
    render();
  }, 140);

  function pick(idx) {
    const it = items[idx];
    if (!it) return;
    if (kind === 'users') {
      input.value = it.label;
      input.dataset.uid = it.id;
      if (typeof onPick === 'function') onPick({ id: it.id, label: it.label });
    } else {
      input.value = it.value ?? '';
      if (typeof onPick === 'function') onPick({ value: it.value ?? '' });
    }
    list.classList.add('hidden');
  }

  input.addEventListener('input', () => {
    delete input.dataset.uid;
    search();
  });
  input.addEventListener('keydown', (e) => {
    if (list.classList.contains('hidden')) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      active = Math.min(items.length - 1, active + 1);
      render();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      active = Math.max(0, active - 1);
      render();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      pick(active);
    } else if (e.key === 'Escape') {
      list.classList.add('hidden');
    }
  });
  list.addEventListener('click', (e) => {
    const row = e.target.closest('[data-index]');
    if (!row) return;
    pick(+row.dataset.index);
  });
  document.addEventListener('click', (e) => {
    if (!list.contains(e.target) && e.target !== input) list.classList.add('hidden');
  });
}

function attachMapCodeAutocomplete(input) {
  wireAutocomplete(input, { kind: 'map-codes' });
}
function attachMapNameAutocomplete(input, onPick) {
  wireAutocomplete(input, { kind: 'map-names', onPick });
}
function attachUsersAutocomplete(input) {
  wireAutocomplete(input, { kind: 'users' });
}
function getUserIdFrom(input) {
  return String(input?.dataset?.uid || input?.value || '').trim();
}

function wireFormAutocompletes(root = document) {
  root.querySelectorAll('input[name="code"]').forEach(attachMapCodeAutocomplete);
  root.querySelectorAll('form[data-action="replace-overwatch"]').forEach((form) => {
    const inp = form?.querySelector('input[name$="user_id"]');
    if (!inp || inp.__acBound) return;
    wireAutocomplete(inp, {
      kind: 'users',
      onPick: ({ id }) => prefillReplaceOverwatchByUserId(form, id),
    });
  });

  root.querySelectorAll('form[data-action="update-names"]').forEach((form) => {
    const inp = form?.querySelector('input[name$="user_id"]');
    if (!inp || inp.__acBound) return;
    wireAutocomplete(inp, {
      kind: 'users',
      onPick: ({ id }) => prefillUpdateNamesByUserId(form, id),
    });
  });

  root.querySelectorAll('input[name$="user_id"]').forEach((input) => {
    if (!input.__acBound) attachUsersAutocomplete(input);
  });

  root.querySelectorAll('input[name$="flagged_by"]').forEach(attachUsersAutocomplete);

  const mapNameInput = root.querySelector('#mapNameInput');
  if (mapNameInput) {
    attachMapNameAutocomplete(mapNameInput, ({ value }) => {
      const label = document.getElementById('metaMap');
      if (label) label.textContent = value || 'N/A';
    });
  }
}

// --- Forms dispatcher ---
$$('form[data-action]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const action = form.dataset.action;
    try {
      switch (action) {
        // USERS (API_MODS)
        case 'get-user':
          return handleGetUser(form);
        case 'get-ow-usernames':
          return handleGetOwUsernames(form);
        case 'create-fake':
          return handleCreateFake(form);
        case 'replace-overwatch':
          return handleReplaceOverwatch(form);
        case 'update-names':
          return handleUpdateNames(form);
        case 'link-fake':
          return handleLinkFake(form);

        // LOOTBOX (API_MODS)
        case 'grant-key':
          return handleGrantKey(form);
        case 'grant-xp':
          return handleGrantXp(form);
        case 'grant-reward':
          return handleGrantReward(form);
        case 'get-user-keys':
          return handleGetUserKeys(form);
        case 'get-user-rewards':
          return handleGetUserRewards(form);
        case 'view-all-rewards':
          return handleViewAllRewards(form);
        case 'set-active-key-type':
          return handleSetActiveKeyType(form);

        // GUIDES (API_MODS)
        case 'create-guide':
          return handleCreateGuide(form);
        case 'edit-guide':
          return handleEditGuide(form);
        case 'delete-guide':
          return handleDeleteGuide(form);
        case 'get-guides':
          return handleGetGuides(form);

        // MAPS (API_MODS)
        case 'archive-maps':
          return handleArchiveMaps(form);
        case 'update-map':
          return handleUpdateMap(form);
        case 'submit-map':
          return handleSubmitMap(form);
        case 'search-map':
          return handleSearchMap(form);
        case 'convert-legacy':
          return handleConvertLegacy(form);
        case 'load-map-update':
          return handleLoadMapForUpdate(form);

        // MODERATION (API_MODS)
        case 'override-quality':
          return handleOverrideQuality(form);
        case 'set-suspicious':
          return handleSetSuspicious(form);
        case 'get-suspicious':
          return handleGetSuspicious(form);

        // VERIFICATIONS (API_MODS)
        case 'get-pending-verifs':
          return handleGetPendingVerifs();
        case 'verify-completion':
          return handleVerifyCompletion(form);
        default:
          toast(`Unknown action: ${action}`, 'err');
      }
    } catch (err) {
      toast('Unexpected error', 'err');
      logActivity({
        title: action,
        method: 'ERROR',
        url: '-',
        ok: false,
        status: 'ERR',
        data: { message: String(err) },
      });
    }
  });
});

// --- Archive UI: Single/Bulk ---
function setupArchiveMapsUI() {
  const form = document.querySelector('form[data-action="archive-maps"]');
  if (!form) return;

  if (!form.querySelector('[name="mode"]')) {
    const statusLabel = form.querySelector('select[name="status"]')?.closest('label');
    const grid = statusLabel?.parentElement;

    const modeEl = document.createElement('label');
    modeEl.innerHTML = `
      Mode
      <select name="mode" class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2">
        <option value="single" selected>Single</option>
        <option value="bulk">Bulk</option>
      </select>
    `;
    grid?.insertBefore(modeEl, statusLabel || null);
  }

  const singleWrap = form.querySelector('input[name="code"]')?.closest('label');

  form.querySelector('textarea[name="codes"]')?.closest('label')?.remove();

  let bulkWrap = form.querySelector('#bulkCodesWrap');
  if (!bulkWrap) {
    bulkWrap = document.createElement('div');
    bulkWrap.id = 'bulkCodesWrap';
    bulkWrap.className = 'sm:col-span-3 hidden';
    bulkWrap.innerHTML = `
      <div class="flex items-center justify-between mb-1">
        <span class="text-sm text-zinc-300">Bulk codes (max 5)</span>
        <button type="button" class="add-code cursor-pointer text-xs rounded-lg border border-white/10 px-2 py-1 hover:bg-white/5">Add code</button>
      </div>
      <div class="codes space-y-2"></div>
    `;
  }

  const submitBtn = form.querySelector('button[type="submit"], button:not([type])');
  if (submitBtn) {
    if (!bulkWrap.isConnected) form.insertBefore(bulkWrap, submitBtn);
    else if (bulkWrap.nextElementSibling !== submitBtn) form.insertBefore(bulkWrap, submitBtn);

    submitBtn.classList.add('w-full');
    submitBtn.classList.add('justify-self-stretch');
  }

  const codesList = bulkWrap.querySelector('.codes');
  const addBtn = bulkWrap.querySelector('.add-code');

  function addCodeInput(val = '') {
    const count = codesList.querySelectorAll('input[name="bulk_code[]"]').length;
    if (count >= 5) return;
    const row = document.createElement('div');
    row.className = 'flex items-center gap-2';
    row.innerHTML = `
      <input name="bulk_code[]" class="flex-1 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2" placeholder="007EX" value="${val}">
      <button type="button" class="rm cursor-pointer text-xs rounded-lg border border-white/10 px-2 py-1 hover:bg-white/5">×</button>
    `;
    row.querySelector('.rm').addEventListener('click', () => row.remove());
    codesList.appendChild(row);
    attachMapCodeAutocomplete(row.querySelector('input[name="bulk_code[]"]'));
  }
  addBtn.addEventListener('click', () => addCodeInput());

  function applyMode() {
    const bulk = form.mode.value === 'bulk';
    singleWrap?.classList.toggle('hidden', bulk);
    bulkWrap.classList.toggle('hidden', !bulk);

    if (submitBtn) submitBtn.classList.toggle('mt-2', bulk);

    if (bulk && codesList.children.length === 0) addCodeInput();
  }
  form.mode.addEventListener('change', applyMode);

  singleWrap?.classList.remove('hidden');
  bulkWrap.classList.add('hidden');
  applyMode();

  const singleInput = form.querySelector('input[name="code"]');
  if (singleInput) attachMapCodeAutocomplete(singleInput);
}

// ============== HANDLERS ==============
// USERS
async function handleCreateFake(form) {
  const name = form.name.value?.trim();
  const { ok, status, url, data } = await http('POST', `${API_MODS}/users/fake`, {
    query: { name },
  });
  logActivity({ title: 'Create fake member', method: 'POST', url, ok, status, data });
  toast(ok ? 'Fake user created' : 'Failed', ok ? 'ok' : 'err');
}

async function handleReplaceOverwatch(form) {
  const user_id = getUserIdFrom(form.user_id);

  const usernames = [1, 2, 3]
    .map((i) => {
      const username = form[`username_${i}`]?.value?.trim();
      const isPrimary = (form[`is_primary_${i}`]?.value || 'false') === 'true';
      if (!username) return null;
      return { username, is_primary: isPrimary };
    })
    .filter(Boolean);

  if (usernames.length === 0) {
    toast('Please provide at least one username', 'warn');
    return;
  }

  const { ok, status, url, data } = await http(
    'PUT',
    `${API_MODS}/users/${encodeURIComponent(user_id)}/overwatch`,
    { body: { usernames } }
  );

  logActivity({ title: 'Replace Overwatch names', method: 'PUT', url, ok, status, data });
  if (!ok && status === 422)
    toast('Validation failed: exactly one username must be primary.', 'err');
  else toast(ok ? 'Usernames replaced' : 'Failed', ok ? 'ok' : 'err');
}

async function handleUpdateNames(form) {
  const user_id = getUserIdFrom(form.user_id);
  const global_name = form.global_name.value?.trim() || null;
  const nickname = form.nickname.value?.trim() || null;

  const body = {};
  if (global_name) body.global_name = global_name;
  if (nickname) body.nickname = nickname;

  const { ok, status, url, data } = await http(
    'PATCH',
    `${API_MODS}/users/${encodeURIComponent(user_id)}`,
    { body }
  );
  logActivity({ title: 'Update user names', method: 'PATCH', url, ok, status, data });
  toast(ok ? 'Names updated' : 'Failed', ok ? 'ok' : 'err');
}

async function handleLinkFake(form) {
  const fake = getUserIdFrom(form.fake_user_id);
  const real = getUserIdFrom(form.real_user_id);
  const { ok, status, url, data } = await http(
    'PUT',
    `${API_MODS}/users/fake/${encodeURIComponent(fake)}/link/${encodeURIComponent(real)}`
  );
  logActivity({ title: 'Link fake → real', method: 'PUT', url, ok, status, data });
  toast(ok ? 'Linked' : 'Failed', ok ? 'ok' : 'err');
}

async function handleGetUser(form) {
  const user_id = getUserIdFrom(form.user_id);
  if (!user_id) {
    toast('User ID required', 'warn');
    return;
  }
  const { ok, status, url, data } = await http(
    'GET',
    `${API_MODS}/users/${encodeURIComponent(user_id)}`
  );
  logActivity({ title: 'Get User', method: 'GET', url, ok, status, data });
  toast(ok ? 'Loaded' : 'Failed', ok ? 'ok' : 'err');
}

async function handleGetOwUsernames(form) {
  const user_id = getUserIdFrom(form.user_id);
  if (!user_id) {
    toast('User ID required', 'warn');
    return;
  }
  const { ok, status, url, data } = await http(
    'GET',
    `${API_MODS}/users/${encodeURIComponent(user_id)}/overwatch`
  );
  logActivity({ title: 'Get OW Usernames', method: 'GET', url, ok, status, data });
  toast(ok ? 'Loaded' : 'Failed', ok ? 'ok' : 'err');
}

// LOOTBOX
async function handleGrantKey(form) {
  const user_id = getUserIdFrom(form.user_id);
  const key_type = form.key_type.value;
  const { ok, status, url, data } = await http(
    'POST',
    `${API_MODS}/lootbox/users/${encodeURIComponent(user_id)}/keys/${encodeURIComponent(key_type)}`
  );
  logActivity({ title: 'Grant key', method: 'POST', url, ok, status, data });
  toast(ok ? 'Key granted' : 'Failed', ok ? 'ok' : 'err');
}

async function handleGrantXp(form) {
  const user_id = getUserIdFrom(form.user_id);
  const amount = +form.amount.value;
  if (!Number.isFinite(amount) || amount <= 0) {
    toast('Amount must be a positive number', 'warn');
    return;
  }
  const { ok, status, url, data } = await http(
    'POST',
    `${API_MODS}/lootbox/users/${encodeURIComponent(user_id)}/xp`,
    { body: { amount } }
  );
  logActivity({ title: 'Grant XP', method: 'POST', url, ok, status, data });
  toast(ok ? 'XP granted' : 'Failed', ok ? 'ok' : 'err');
}

async function handleGrantReward(form) {
  const user_id = getUserIdFrom(form.user_id);
  const key_type = form.key_type.value;
  const reward_type = (form.reward_type.value || '').trim();
  const reward_name = (form.reward_name.value || '').trim();
  if (!reward_type || !reward_name) {
    toast('Reward type and name are required', 'warn');
    return;
  }

  const path = `${API_MODS}/lootbox/users/debug/${encodeURIComponent(user_id)}/${encodeURIComponent(key_type)}/${encodeURIComponent(reward_type)}/${encodeURIComponent(reward_name)}`;
  const { ok, status, url, data } = await http('POST', path);
  logActivity({ title: 'Grant reward (debug)', method: 'POST', url, ok, status, data });
  toast(ok ? 'Reward granted' : 'Failed', ok ? 'ok' : 'err');
}

async function handleGetUserKeys(form) {
  const user_id = getUserIdFrom(form.user_id);
  if (!user_id) {
    toast('User ID required', 'warn');
    return;
  }
  const key_type = form.key_type.value;
  const query = {};
  if (key_type) query.key_type = key_type;
  const path = `/api/lootbox/users/${encodeURIComponent(user_id)}/keys`;
  const { ok, status, url, data } = await http('GET', path, { query });
  logActivity({ title: 'Get user keys', method: 'GET', url, ok, status, data });
  toast(ok ? 'Keys loaded' : 'Failed', ok ? 'ok' : 'err');
}

async function handleGetUserRewards(form) {
  const user_id = getUserIdFrom(form.user_id);
  if (!user_id) {
    toast('User ID required', 'warn');
    return;
  }
  const reward_type = form.reward_type.value.trim();
  const key_type = form.key_type.value;
  const rarity = form.rarity.value.trim();

  const query = {};
  if (reward_type) query.reward_type = reward_type;
  if (key_type) query.key_type = key_type;
  if (rarity) query.rarity = rarity;

  const path = `/api/lootbox/users/${encodeURIComponent(user_id)}/rewards`;
  const { ok, status, url, data } = await http('GET', path, { query });
  logActivity({ title: 'Get user rewards', method: 'GET', url, ok, status, data });
  toast(ok ? 'Rewards loaded' : 'Failed', ok ? 'ok' : 'err');
}

async function handleViewAllRewards(form) {
  const reward_type = (form.reward_type.value || 'any').trim();
  const key_type = (form.key_type.value || 'any').trim();
  const rarity = (form.rarity.value || 'any').trim();

  const query = {};
  if (reward_type && reward_type !== 'any') query.reward_type = reward_type;
  if (key_type && key_type !== 'any') query.key_type = key_type;
  if (rarity && rarity !== 'any') query.rarity = rarity;

  const { ok, status, url, data } = await http('GET', `/api/lootbox/rewards`, { query });

  logActivity({ title: 'View all rewards', method: 'GET', url, ok, status, data });
  toast(ok ? 'Rewards loaded' : 'Failed', ok ? 'ok' : 'err');
}

async function handleSetActiveKeyType(form) {
  const key_type = form.key_type.value;
  if (!key_type) {
    toast('Pick a key type', 'warn');
    return;
  }

  const confirmed = await showConfirmActiveKeyType();
  if (!confirmed) return;

  const { ok, status, url, data } = await http(
    'PATCH',
    `/api/lootbox/keys/${encodeURIComponent(key_type)}`
  );

  logActivity({ title: 'Set active key type', method: 'PATCH', url, ok, status, data });
  toast(ok ? 'Active key type updated' : 'Failed', ok ? 'ok' : 'err');
}

// GUIDES
async function handleCreateGuide(form) {
  const code = form.code.value.trim();
  const urlInput = form.url.value.trim();
  const user_id = getUserIdFrom(form.user_id);

  if (!code || !urlInput || !user_id) {
    toast('code, url and user_id are required', 'warn');
    return;
  }

  const { ok, status, url, data } = await http(
    'POST',
    `${API_MODS}/maps/${encodeURIComponent(code)}/guides`,
    { body: { url: urlInput, user_id } }
  );
  logActivity({ title: 'Create guide', method: 'POST', url, ok, status, data });
  toast(ok ? 'Guide created' : 'Failed', ok ? 'ok' : 'err');
}

async function handleEditGuide(form) {
  const code = form.code.value.trim();
  const urlParam = form.url.value.trim();
  const user_id = getUserIdFrom(form.user_id);

  if (!code || !urlParam || !user_id) {
    toast('code, user_id and url are required', 'warn');
    return;
  }

  const { ok, status, url, data } = await http(
    'PATCH',
    `${API_MODS}/maps/${encodeURIComponent(code)}/guides/${encodeURIComponent(user_id)}`,
    { query: { url: urlParam } }
  );
  logActivity({ title: 'Edit guide', method: 'PATCH', url, ok, status, data });
  toast(ok ? 'Guide updated' : 'Failed', ok ? 'ok' : 'err');
}

async function handleDeleteGuide(form) {
  const code = form.code.value.trim();
  const user_id = getUserIdFrom(form.user_id);

  if (!code || !user_id) {
    toast('code and user_id are required', 'warn');
    return;
  }

  const { ok, status, url, data } = await http(
    'DELETE',
    `${API_MODS}/maps/${encodeURIComponent(code)}/guides/${encodeURIComponent(user_id)}`
  );
  logActivity({ title: 'Delete guide', method: 'DELETE', url, ok, status, data });
  toast(ok ? 'Guide deleted' : 'Failed', ok ? 'ok' : 'err');
}

async function handleGetGuides(form) {
  const code = (form.code.value || '').trim();
  if (!code) {
    toast('Map code required', 'warn');
    return;
  }

  const include_records = (form.include_records.value || 'false') === 'true';

  const { ok, status, url, data } = await http(
    'GET',
    `/api/maps/${encodeURIComponent(code)}/guides`,
    { query: { include_records } }
  );

  logActivity({
    title: 'Get guides',
    method: 'GET',
    url,
    ok,
    status,
    data,
  });

  toast(ok ? 'Guides loaded' : 'Failed', ok ? 'ok' : 'err');
}

// MAPS
async function handleArchiveMaps(form) {
  const statusVal = form.status.value;
  const mode = form.mode?.value || 'single';

  let codes = [];
  if (mode === 'single') {
    const code = (form.code.value || '').trim();
    if (!code) {
      toast('Provide a map code', 'warn');
      return;
    }
    codes = [code];
  } else {
    const inputs = Array.from(form.querySelectorAll('input[name="bulk_code[]"]'));
    codes = inputs.map((i) => (i.value || '').trim()).filter(Boolean);
    if (codes.length === 0) {
      toast('Add at least one code', 'warn');
      return;
    }
  }

  const qs = codes.map((c) => `code=${encodeURIComponent(c)}`).join('&');
  const url = `${API_MODS}/maps/archive${qs ? `?${qs}` : ''}`;

  const body = { status: statusVal, codes };

  const { ok, status, url: finalUrl, data } = await http('PATCH', url, { body });
  logActivity({
    title: 'Archive/Unarchive maps',
    method: 'PATCH',
    url: finalUrl,
    ok,
    status,
    data,
  });
  toast(ok ? 'Operation done' : 'Failed', ok ? 'ok' : 'err');
}

async function handleUpdateMap(form) {
  const codePath = (document.getElementById('u-metaCode')?.textContent || '').trim();
  if (!codePath) {
    toast('Missing map code (target route).', 'warn');
    return;
  }

  const mainCreatorId =
    document.getElementById('u-metaCreatorMain')?.getAttribute('data-raw-id') || '';
  const secondId =
    document.getElementById('u-metaCreatorSecond')?.getAttribute('data-raw-id') || '';

  const name = (document.getElementById('u-metaMap')?.textContent || '').trim();
  const checkpoints = Number(
    (document.getElementById('u-metaCheckpoints')?.textContent || '').trim()
  );
  const category = getSelectedRadio('#u-categoryDropdown');
  const difficulty = getSelectedRadio('#u-difficultyDropdown');
  const mechanics = getCheckedValues('#u-mechanicsDropdown');
  const restrictions = getCheckedValues('#u-restrictionsDropdown');
  const description = (document.getElementById('u-optDescription')?.textContent || '').trim();
  const title = (document.getElementById('u-optTitleInput')?.value || '').trim().slice(0, 128);

  const guideRaw = (document.getElementById('u-optGuide')?.textContent || '').trim();
  const guide_url = !guideRaw || /^n\/?a$/i.test(guideRaw) ? null : firstHttpUrlOrNull(guideRaw);

  const hidden = !!document.getElementById('u-flagHidden')?.checked;
  const archived = !!document.getElementById('u-flagArchived')?.checked;
  const official = !!document.getElementById('u-flagOfficial')?.checked;
  const playtesting = getSelectedRadio('#u-playtestingDropdown');

  const medalsCheck = validateUpdateMedals(true);
  if (!medalsCheck.ok) {
    toast(medalsCheck.error || 'Invalid medals.', 'warn');
    return;
  }

  let custom_banner = null;
  try {
    if (window.customBannerFileUpdate) {
      custom_banner = await uploadImageGeneric(window.customBannerFileUpdate);
    }
  } catch (e) {
    toast('Banner upload failed', 'err');
    return;
  }

  const payload = {};
  const put = (k, v) => {
    if (v !== '' && v != null && !(Array.isArray(v) && v.length === 0)) payload[k] = v;
  };

  put('map_name', name || undefined);
  if (Number.isFinite(checkpoints)) put('checkpoints', checkpoints);
  put('category', category || undefined);
  put('difficulty', difficulty || undefined);
  if (mechanics.length) put('mechanics', mechanics);
  if (restrictions.length) put('restrictions', restrictions);
  if (description && !/^n\/?a$/i.test(description)) put('description', description);
  if (title) put('title', title);
  if (custom_banner) put('custom_banner', custom_banner);
  if (guide_url) put('guide_url', guide_url);
  if (medalsCheck.values) put('medals', medalsCheck.values);
  put('hidden', hidden);
  put('archived', archived);
  put('official', official);
  if (playtesting) put('playtesting', playtesting);

  const creators = [];
  if (mainCreatorId) creators.push({ id: mainCreatorId, is_primary: true });
  if (secondId) creators.push({ id: secondId, is_primary: false });
  if (creators.length) put('creators', creators);

  const { ok, status, url, data } = await http(
    'PATCH',
    `${API_MODS}/maps/${encodeURIComponent(codePath)}`,
    { body: payload }
  );
  logActivity({ title: 'Update map (UI)', method: 'PATCH', url, ok, status, data });
  toast(ok ? 'Updated' : 'Failed', ok ? 'ok' : 'err');
}

async function handleLoadMapForUpdate(form) {
  const code = (form.code.value || '').trim();
  if (!code) {
    toast('Provide a map code', 'warn');
    return;
  }

  const { ok, status, url, data } = await http('GET', `/api/maps`, { query: { code } });
  logActivity({ title: 'Load map (update)', method: 'GET', url, ok, status, data });
  toast(ok ? 'Loaded' : 'Failed', ok ? 'ok' : 'err');
  if (!ok) return;

  let item = null;
  if (Array.isArray(data)) item = data[0] || null;
  else if (data && typeof data === 'object') item = (data.items?.[0] ?? data) || null;

  if (!item) {
    toast('No results', 'warn');
    return;
  }

  await initUpdatePanel();
  populateUpdatePanel(item);
  scrollIntoViewWithOffset(document.getElementById('u-updateMapForm'), getHeaderOffset());
}

async function handleSubmitMap(form) {
  const mainCreatorId = document.getElementById('metaCreatorMain')?.getAttribute('data-raw-id');
  const secondCreatorId = document.getElementById('metaCreatorSecond')?.getAttribute('data-raw-id');
  const code = (document.getElementById('metaCode')?.textContent || '').trim();
  const name = (document.getElementById('metaMap')?.textContent || '').trim();
  const checkpoints = Number(
    (document.getElementById('metaCheckpoints')?.textContent || '').trim()
  );

  const categoryEl = document.querySelector('#categoryDropdown   input[type="radio"]:checked');
  const difficultyEl = document.querySelector('#difficultyDropdown input[type="radio"]:checked');
  const category = categoryEl?.value || '';
  const difficulty = difficultyEl?.value || '';

  const mechanics = Array.from(
    document.querySelectorAll('#mechanicsDropdown input[type="checkbox"]:checked')
  ).map((c) => c.value);
  const restrictions = Array.from(
    document.querySelectorAll('#restrictionsDropdown input[type="checkbox"]:checked')
  ).map((c) => c.value);

  const description = (document.getElementById('optDescription')?.textContent || '').trim();
  const title = (document.getElementById('optTitleInput')?.value || '').trim().slice(0, 128);

  const guideRaw = (document.getElementById('optGuide')?.textContent || '').trim();
  const guide_url = !guideRaw || /^n\/?a$/i.test(guideRaw) ? null : firstHttpUrlOrNull(guideRaw);

  const secondariesRaw = (document.getElementById('secondaryCreatorsInput')?.value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  let custom_banner = null;
  try {
    if (window.customBannerFile) {
      custom_banner = await uploadImageGeneric(window.customBannerFile);
    }
  } catch (e) {
    toast('Banner upload failed.', 'err');
    return;
  }

  const _asId = (v) => (v == null ? '' : String(v).trim());
  const creators = [];
  const mainId = _asId(mainCreatorId);
  if (mainId) creators.push({ id: mainId, is_primary: true });
  if (secondCreatorId) creators.push({ id: String(secondCreatorId).trim(), is_primary: false });
  for (const idStrRaw of secondariesRaw) {
    const idStr = _asId(idStrRaw);
    if (idStr) creators.push({ id: idStr, is_primary: false });
  }

  let medalsBlock = null;
  const medalsCheck = validateMedals(true);
  if (!medalsCheck.ok) {
    toast(medalsCheck.error || 'Invalid medals.', 'warn');
    return;
  }
  if (medalsCheck.values) medalsBlock = medalsCheck.values;

  const payload = {
    category,
    checkpoints,
    code,
    creators,
    difficulty,
    map_name: name,
    archived: false,
    hidden: false,
    official: true,
    playtesting: 'Approved',
    guide_url: guide_url ?? null,
  };
  if (mechanics.length) payload.mechanics = mechanics;
  if (restrictions.length) payload.restrictions = restrictions;
  if (description && !/^n\/?a$/i.test(description)) payload.description = description;
  if (title) payload.title = title;
  if (custom_banner) payload.custom_banner = custom_banner;
  if (medalsBlock) payload.medals = medalsBlock;

  if (
    !code ||
    !name ||
    !category ||
    !difficulty ||
    !creators.length ||
    !Number.isFinite(checkpoints)
  ) {
    toast(
      'Please fill required fields (creator, code, name, checkpoints, category, difficulty).',
      'warn'
    );
    return;
  }

  const { ok, status, url, data } = await http('POST', `/api/maps`, { body: payload });
  logActivity({ title: 'Submit map', method: 'POST', url, ok, status, data });
  toast(ok ? 'Submitted' : 'Failed', ok ? 'ok' : 'err');
}

async function handleConvertLegacy(form) {
  const code = (form.code.value || '').trim();
  if (!code) {
    toast('Map code required', 'warn');
    return;
  }

  const { ok, status, url, data } = await http(
    'POST',
    `${API_MODS}/maps/${encodeURIComponent(code)}/legacy`
  );
  logActivity({ title: 'Convert to legacy', method: 'POST', url, ok, status, data });
  toast(ok ? 'Converted' : 'Failed', ok ? 'ok' : 'err');
}

async function handleSearchMap(form) {
  const code = (form.code.value || '').trim();
  const query = {};
  if (code) query.code = code;

  const { ok, status, url, data } = await http('GET', `/api/maps`, { query });

  logActivity({ title: 'Search map', method: 'GET', url, ok, status, data });
  toast(ok ? 'Search done' : 'Failed', ok ? 'ok' : 'err');
  if (!ok) return;

  let item = null;
  if (Array.isArray(data)) item = data[0] || null;
  else if (data && typeof data === 'object') item = (data.items?.[0] ?? data) || null;

  if (!item) {
    toast('No results', 'warn');
    return;
  }

  await initSearchPanel();

  populateSearchPanel(item);

  const target = document.querySelector('[data-subpanel="maps-search"] #s-submitMapForm');
  if (target) {
    target.classList.remove('hidden');
    scrollIntoViewWithOffset(target, getHeaderOffset());
  } else {
    toast('Search panel HTML (#s-submitMapForm) manquant', 'warn');
  }
}

// MODERATION
async function handleOverrideQuality(form) {
  const code = (form.code.value || '').trim();
  const selected = getSelectedRadio('#q-qualityDropdown');
  const value = Number(selected);

  if (!code) {
    toast('Map code required', 'warn');
    return;
  }
  if (!Number.isInteger(value) || value < 1 || value > 6) {
    toast('Pick a quality value between 1 and 6', 'warn');
    return;
  }

  const { ok, status, url, data } = await http(
    'POST',
    `${API_MODS}/maps/${encodeURIComponent(code)}/quality`,
    { body: { value } }
  );

  logActivity({ title: 'Override quality', method: 'POST', url, ok, status, data });
  toast(ok ? 'Applied' : 'Failed', ok ? 'ok' : 'err');
}

async function handleSetSuspicious(form) {
  const context = (form.context.value || '').trim();
  const flag_type = (form.flag_type.value || '').trim();

  const flagged_by_raw = getUserIdFrom(form.flagged_by);
  const msgRaw = asId(form.message_id);
  const verRaw = asId(form.verification_id);

  if (!context) {
    toast('Context is required', 'warn');
    return;
  }
  if (!flag_type) {
    toast('Flag type is required', 'warn');
    return;
  }

  if (!isDigits(flagged_by_raw)) {
    toast('flagged_by must be digits', 'warn');
    return;
  }
  const flagged_by = flagged_by_raw;

  let message_id = null;
  if (msgRaw !== '') {
    if (!isDigits(msgRaw)) {
      toast('message_id must be digits', 'warn');
      return;
    }
    message_id = msgRaw;
  }

  let verification_id = null;
  if (verRaw !== '') {
    if (!isDigits(verRaw)) {
      toast('verification_id must be digits', 'warn');
      return;
    }
    verification_id = verRaw;
  }

  const body = { context, flag_type, flagged_by, message_id, verification_id };

  const { ok, status, url, data } = await http('POST', `${API_MODS}/completions/suspicious`, {
    body,
  });

  logActivity({ title: 'Set suspicious flag', method: 'POST', url, ok, status, data });
  toast(ok ? 'Flag created' : 'Failed', ok ? 'ok' : 'err');
}

async function handleGetSuspicious(form) {
  const user_id = getUserIdFrom(form.user_id);
  if (!isDigits(user_id)) {
    toast('User ID is required (digits)', 'warn');
    return;
  }

  const { ok, status, url, data } = await http('GET', `${API_MODS}/completions/suspicious`, {
    query: { user_id },
  });

  logActivity({ title: 'Get suspicious flags', method: 'GET', url, ok, status, data });
  toast(ok ? 'Loaded' : 'Failed', ok ? 'ok' : 'err');
}

// VERIFICATIONS
async function handleGetPendingVerifs() {
  const resultsBox = ensureVerifResultsContainer();
  if (resultsBox) {
    resultsBox.innerHTML = `<div class="text-sm text-zinc-400">Loading queue…</div>`;
  }

  const { ok, status, url, data } = await http('GET', `${API_MODS}/verifications/pending`);
  logActivity({ title: 'Pending verifications', method: 'GET', url, ok, status, data });
  if (!ok) {
    toast('Failed to load queue', 'err');
    return;
  }

  const rows = Array.isArray(data) ? data : [];
  if (!rows.length) {
    if (resultsBox)
      resultsBox.innerHTML = `<div class="text-sm text-zinc-400">Queue is empty.</div>`;
    toast('No pending verifications', 'ok');
    return;
  }

  const cards = [];
  for (const row of rows) {
    const recordId = String(row?.id ?? '').trim();
    if (!recordId) continue;

    const resp = await http(
      'GET',
      `${API_MODS}/completions/${encodeURIComponent(recordId)}/submission`
    );
    logActivity({
      title: `Submission ${recordId}`,
      method: 'GET',
      url: resp.url,
      ok: resp.ok,
      status: resp.status,
      data: resp.data,
    });

    if (resp.ok && resp.data && typeof resp.data === 'object') {
      cards.push(renderSubmissionCard(resp.data));
    }
  }

  if (resultsBox) {
    resultsBox.innerHTML = '';
    cards.forEach((c) => resultsBox.appendChild(c));
  }
  toast('Queue loaded', 'ok');
}

// ———————————————————————————————————————————————————————————————
// Submit map

function difficultyDotClass(label) {
  const L = String(label).toLowerCase();
  if (L.startsWith('easy')) return 'bg-emerald-400';
  if (L.startsWith('medium')) return 'bg-yellow-400';
  if (L.startsWith('very hard')) return 'bg-orange-500';
  if (L.startsWith('hard') && !L.startsWith('very')) return 'bg-orange-400';
  if (L.startsWith('extreme')) return 'bg-red-500';
  if (L.startsWith('hell')) return 'bg-rose-500';
  return 'bg-zinc-400';
}

const DIFFICULTY_FINE_OPTIONS = [
  'Easy -',
  'Easy',
  'Easy +',
  'Medium',
  'Medium +',
  'Hard -',
  'Hard',
  'Hard +',
  'Very Hard -',
  'Very Hard',
  'Very Hard +',
  'Extreme -',
  'Extreme',
  'Extreme +',
  'Hell',
].map((v) => ({ value: v, text: v }));

const CATEGORY_OPTIONS = [
  { value: 'Classic', text: 'Classic' },
  { value: 'Increasing Difficulty', text: 'Increasing difficulty' },
];

function ddBtn(container) {
  return container?.querySelector('[data-dd-btn]');
}
function ddList(container) {
  return container?.querySelector('[data-dd-list]');
}
function ddHide(list) {
  list?.classList.add('hidden');
}
function ddShow(list) {
  list?.classList.remove('hidden');
}

function buildRadioDropdown(id, options, placeholder) {
  const root = document.getElementById(id);
  if (!root) return;
  const btn = ddBtn(root);
  const list = ddList(root);
  if (!btn || !list) return;

  list.innerHTML = '';
  const isDifficulty = id === 'difficultyDropdown' || id.endsWith('difficultyDropdown');

  options.forEach((opt) => {
    const txt = typeof opt.text === 'function' ? opt.text() : (opt.text ?? opt.value ?? '');
    const raw = opt.value ?? txt;
    const label = document.createElement('label');
    label.className = isDifficulty
      ? 'flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-200 cursor-pointer hover:bg-white/10'
      : 'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5 cursor-pointer';
    label.innerHTML = isDifficulty
      ? `<input type="radio" name="${id}-radio" value="${raw}" class="sr-only">
         <span class="inline-block h-2.5 w-2.5 rounded-full ${difficultyDotClass(txt)} ring-1 ring-inset ring-white/20"></span>
         <span>${txt}</span>`
      : `<input type="radio" name="${id}-radio" value="${raw}" class="accent-emerald-500">
         <span>${txt}</span>`;
    list.appendChild(label);
  });

  function setLabel(text) {
    btn.querySelector('.dd-label').textContent = text || placeholder;
  }

  btn.addEventListener('click', () => {
    list.classList.contains('hidden') ? ddShow(list) : ddHide(list);
  });
  list.addEventListener('change', (e) => {
    const input = e.target.closest('input[type="radio"]');
    if (!input) return;
    const txt = input.parentElement.querySelector('span:last-child')?.textContent || input.value;
    setLabel(txt);
    ddHide(list);
  });
  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) ddHide(list);
  });

  setLabel(placeholder);
  ddHide(list);
}

function buildCheckboxDropdown(id, values, placeholder) {
  const root = document.getElementById(id);
  if (!root) return;
  const btn = ddBtn(root);
  const list = ddList(root);
  if (!btn || !list) return;

  list.innerHTML = '';
  values.forEach((v) => {
    const row = document.createElement('label');
    row.className =
      'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5 cursor-pointer';
    row.innerHTML = `<input type="checkbox" value="${v}" class="accent-emerald-500"><span>${v}</span>`;
    list.appendChild(row);
  });

  function updateBtn() {
    const sel = root.querySelectorAll('input[type="checkbox"]:checked').length;
    btn.querySelector('.dd-label').textContent = sel ? `${placeholder} (${sel})` : placeholder;
  }

  btn.addEventListener('click', () => {
    list.classList.contains('hidden') ? ddShow(list) : ddHide(list);
  });
  list.addEventListener('change', updateBtn);
  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) ddHide(list);
  });

  btn.querySelector('.dd-label').textContent = placeholder;
  btn.querySelector('.dd-label').dataset.placeholder = placeholder;
  ddHide(list);
}

async function fetchStrings(url) {
  try {
    const res = await fetch(url, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });
    const j = await res.json().catch(() => []);
    const arr = Array.isArray(j) ? j : j.items || j.data || j.results || [];
    return (arr || []).map((it) => it.value || it.name || it.label || it.title || it).map(String);
  } catch {
    return [];
  }
}

function wireBannerDrop() {
  const drop = document.getElementById('bannerDrop');
  const input = document.getElementById('bannerInput');
  const placeholder = document.getElementById('bannerPlaceholder');
  if (!drop || !input) return;

  function showPreview(file) {
    const url = URL.createObjectURL(file);
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Banner preview';
    img.className = 'absolute inset-0 h-full w-full object-cover';
    drop.querySelector('img')?.remove();
    drop.appendChild(img);
  }

  drop.addEventListener('click', () => input.click());
  input.addEventListener('change', () => {
    const f = input.files?.[0];
    if (f) {
      window.customBannerFile = f;
      placeholder?.classList.add('hidden');
      showPreview(f);
    }
  });
  drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    drop.classList.add('ring-2', 'ring-emerald-500/60');
  });
  drop.addEventListener('dragleave', () => drop.classList.remove('ring-2', 'ring-emerald-500/60'));
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.classList.remove('ring-2', 'ring-emerald-500/60');
    const f = e.dataTransfer.files?.[0];
    if (f) {
      window.customBannerFile = f;
      placeholder?.classList.add('hidden');
      showPreview(f);
    }
  });
}

function firstHttpUrlOrNull(text) {
  const m = String(text || '').match(/https?:\/\/\S+/i);
  return m ? m[0] : null;
}

function readMedalsInputs() {
  const g = document.getElementById('medalGoldInput')?.value?.trim();
  const s = document.getElementById('medalSilverInput')?.value?.trim();
  const b = document.getElementById('medalBronzeInput')?.value?.trim();
  if (!g && !s && !b) return null;
  return {
    gold: g ? Number(g) : null,
    silver: s ? Number(s) : null,
    bronze: b ? Number(b) : null,
  };
}

function validateMedals(allowEmpty = false) {
  const v = readMedalsInputs();
  if (!v) return allowEmpty ? { ok: true } : { ok: false, error: 'Medals required' };
  const nums = ['gold', 'silver', 'bronze']
    .map((k) => v[k])
    .map((x) => (x == null ? NaN : Number(x)));
  if (nums.some((n) => Number.isNaN(n) || n < 0)) return { ok: false, error: 'Invalid medals.' };
  const [gold, silver, bronze] = nums;
  if (!(bronze > silver && silver > gold))
    return { ok: false, error: 'Order must be bronze > silver > gold.' };
  return { ok: true, values: { gold, silver, bronze } };
}

async function uploadImageGeneric(file) {
  const fd = new FormData();
  fd.append('file', file, file.name || 'image');

  const resp = await fetch('/api/utilities/image', {
    method: 'POST',
    headers: { Accept: 'text/plain' },
    body: fd,
    credentials: 'same-origin',
  });

  const text = await resp.text();
  if (!resp.ok) throw new Error(text || `HTTP ${resp.status}`);
  const url = (text || '').trim();
  if (!/^https?:\/\//i.test(url)) throw new Error('Invalid upload response.');
  return url;
}

async function initSubmitPanel() {
  const panel = document.querySelector('[data-subpanel="maps-submit"]');
  if (!panel || panel.dataset.inited === '1') return;
  panel.dataset.inited = '1';

  buildRadioDropdown('difficultyDropdown', DIFFICULTY_FINE_OPTIONS, 'Select difficulty');
  buildRadioDropdown('categoryDropdown', CATEGORY_OPTIONS, 'Select category');

  const [mech, rest] = await Promise.all([
    fetchStrings('/api/autocomplete/map-mechanics?search=&limit=50'),
    fetchStrings('/api/autocomplete/map-restrictions?search=&limit=50'),
  ]);
  buildCheckboxDropdown('mechanicsDropdown', mech, 'Select mechanics');
  buildCheckboxDropdown('restrictionsDropdown', rest, 'Select restrictions');

  wireBannerDrop();
  bindSubmitMapEditButtons(panel);
  wireFormAutocompletes(panel);
}

function findCommonAncestor(a, b) {
  if (!a || !b) return null;
  const set = new Set();
  let x = a;
  while (x) {
    set.add(x);
    x = x.parentElement;
  }
  let y = b;
  while (y) {
    if (set.has(y)) return y;
    y = y.parentElement;
  }
  return null;
}
function showErrorMessage(msg) {
  toast(msg || 'Invalid value', 'warn');
}

function setupAutocompleteInline(input, dropdown, { type }) {
  if (type === 'creator') attachUsersAutocomplete(input);
  else if (type === 'map') attachMapNameAutocomplete(input);
  else if (type === 'code') attachMapCodeAutocomplete(input);
}

function editInline(field) {
  const label = document.getElementById(field);
  if (!label || label.classList.contains('editing')) return;

  const text = (label.textContent || '').trim();
  label.classList.add('editing');

  const editBtnEl = document.querySelector(`[data-edit-target="${CSS.escape(field)}"]`);
  const hostRow = editBtnEl
    ? editBtnEl.closest('.main-creator-row, .secondary-creator-row') ||
      editBtnEl.closest('.flex.items-center.gap-2') ||
      findCommonAncestor(label, editBtnEl) ||
      label.parentElement
    : label.parentElement;

  let input, suggestionsDropdown;

  if (field === 'optDescription' || field === 'optGuide') {
    input = document.createElement('textarea');
    input.rows = 3;
    input.className =
      'w-full max-w-full min-w-0 rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 shadow-lg ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 resize-y';
  } else if (field === 'metaCheckpoints') {
    input = document.createElement('input');
    input.type = 'number';
    input.className =
      'w-28 max-w-full rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 shadow-lg ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60';
  } else {
    input = document.createElement('input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.className =
      'min-w-[12rem] max-w-full rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 shadow-lg ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60';
    if (
      field === 'metaCreatorMain' ||
      field === 'metaCreatorSecond' ||
      field === 'metaMap' ||
      field === 'metaCode'
    ) {
      suggestionsDropdown = document.createElement('div');
    }
  }

  if (field === 'metaCreatorMain' || field === 'metaCreatorSecond') {
    input.value = text === 'N/A' ? '' : text;
    input.dataset.uid = label.getAttribute('data-raw-id') || '';
    input.placeholder = 'User ID or search...';
  } else {
    input.value = text === 'N/A' ? '' : text;
  }

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.textContent = 'Save';
  saveBtn.className =
    'inline-flex items-center gap-1 rounded-lg border border-emerald-400/30 bg-emerald-500 text-zinc-900 px-3 py-1.5 text-sm font-medium hover:bg-emerald-400';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className =
    'inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 text-zinc-200 px-3 py-1.5 text-sm hover:bg-white/10';

  const inputWrap = document.createElement('div');
  inputWrap.className = 'relative flex-1 min-w-[12rem] max-w-full';
  inputWrap.appendChild(input);

  const buttonsBox = document.createElement('div');
  buttonsBox.className = 'inline-edit-buttons flex flex-wrap items-center gap-2';
  buttonsBox.appendChild(saveBtn);
  buttonsBox.appendChild(cancelBtn);

  const container = document.createElement('div');
  container.className =
    'inline-edit-container mt-2 w-full max-w-full flex flex-wrap items-start gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 ring-1 ring-white/5';
  container.appendChild(inputWrap);
  container.appendChild(buttonsBox);

  const isCreator = field === 'metaCreatorMain' || field === 'metaCreatorSecond';
  const rowToHide = isCreator
    ? editBtnEl?.closest('.main-creator-row, .secondary-creator-row') || hostRow
    : null;

  if (rowToHide) {
    rowToHide.classList.add('hidden');
  } else {
    label.style.display = 'none';
    if (editBtnEl) editBtnEl.style.display = 'none';
  }

  if (hostRow && hostRow.insertAdjacentElement)
    hostRow.insertAdjacentElement('afterend', container);
  else label.parentNode.insertBefore(container, label.nextSibling);

  input.focus();

  const acOff = label?.dataset?.ac === 'off' || label?.dataset?.noAc === '1';
  if (!acOff) {
    if (field === 'metaCreatorMain' || field === 'metaCreatorSecond') {
      attachUsersAutocomplete(input);
    } else if (field === 'metaMap') {
      attachMapNameAutocomplete(input);
    } else if (field === 'metaCode') {
      attachMapCodeAutocomplete(input);
    }
  }

  function closeEdit() {
    if (rowToHide) {
      rowToHide.classList.remove('hidden');
    } else {
      label.style.display = '';
      if (editBtnEl) editBtnEl.style.display = '';
    }
    label.classList.remove('editing');
    container.remove();
  }

  function validateEdit() {
    let newValue = (input.value || '').trim();

    if (field === 'metaCheckpoints') {
      const n = Number(newValue);
      if (!Number.isFinite(n) || n < 0) {
        showErrorMessage('Invalid checkpoints');
        input.focus();
        return;
      }
      label.textContent = String(n);
      closeEdit();
      return;
    }

    if (field === 'optGuide' && newValue === '') newValue = 'N/A';
    if (field === 'optDescription' && newValue === '') newValue = 'N/A';

    if (field === 'metaCreatorMain' || field === 'metaCreatorSecond') {
      const chosenId = String(input.dataset.uid || '').trim() || newValue;
      label.setAttribute('data-raw-id', chosenId);
      label.textContent = newValue || 'N/A';
      closeEdit();
      return;
    }

    label.textContent = newValue || 'N/A';
    closeEdit();
  }

  saveBtn.onclick = validateEdit;
  cancelBtn.onclick = closeEdit;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.tagName !== 'TEXTAREA') {
      e.preventDefault();
      validateEdit();
    }
    if (e.key === 'Escape') closeEdit();
  });
}

function bindSubmitMapEditButtons(root = document) {
  const container =
    root instanceof HTMLElement ? root : document.querySelector('[data-subpanel="maps-submit"]');
  if (!container || container.__editBound) return;
  container.__editBound = true;

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-edit-target]');
    if (!btn) return;
    e.preventDefault();
    const id = btn.getAttribute('data-edit-target');
    editInline(id);
  });
}

// ———————————————————————————————————————————————————————————————
// Search map
function ddSelectByValue(root, value) {
  const list = root?.querySelector('[data-dd-list]');
  if (!list) return;
  const radios = list.querySelectorAll('input[type="radio"]');
  let labelText = null;
  radios.forEach((r) => {
    const match = String(r.value).toLowerCase() === String(value || '').toLowerCase();
    r.checked = match;
    if (match) {
      const txt = r.parentElement.querySelector('span:last-child')?.textContent || r.value;
      labelText = txt;
    }
  });
  if (labelText) root.querySelector('.dd-label').textContent = labelText;
}

function ddCheckByValues(root, values = []) {
  const set = new Set((values || []).map((v) => String(v).toLowerCase()));
  const list = root?.querySelector('[data-dd-list]');
  if (!list) return;
  list.querySelectorAll('input[type="checkbox"]').forEach((chk) => {
    const match = set.has(String(chk.value).toLowerCase());
    chk.checked = match;
  });
  const btn = root.querySelector('[data-dd-btn] .dd-label');
  if (btn) {
    const sel = list.querySelectorAll('input[type="checkbox"]:checked').length;
    btn.textContent = sel
      ? `${btn.textContent.replace(/\s*\(\d+\)\s*$/, '')} (${sel})`
      : btn.dataset.placeholder || btn.textContent;
  }
}

function setText(root, sel, text, fallback = 'N/A') {
  const el = root.querySelector(sel);
  if (el) el.textContent = text == null || text === '' ? fallback : String(text);
}
function setValue(root, sel, value) {
  const el = root.querySelector(sel);
  if (el) el.value = value == null ? '' : String(value);
}

function showBannerPreviewScoped(root, url) {
  const drop = root.querySelector('#s-bannerDrop');
  const ph = root.querySelector('#s-bannerPlaceholder');
  if (!drop) return;
  drop.querySelector('img')?.remove();
  if (url) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Banner preview';
    img.className = 'absolute inset-0 h-full w-full object-cover';
    drop.appendChild(img);
    ph?.classList.add('hidden');
  } else {
    ph?.classList.remove('hidden');
  }
}

async function initSearchPanel() {
  const panel = document.querySelector('[data-subpanel="maps-search"]');
  if (!panel || panel.dataset.inited === '1') return;
  panel.dataset.inited = '1';

  buildRadioDropdown('s-difficultyDropdown', DIFFICULTY_FINE_OPTIONS, 'Select difficulty');
  buildRadioDropdown('s-categoryDropdown', CATEGORY_OPTIONS, 'Select category');

  const [mech, rest] = await Promise.all([
    fetchStrings('/api/autocomplete/map-mechanics?search=&limit=50'),
    fetchStrings('/api/autocomplete/map-restrictions?search=&limit=50'),
  ]);
  buildCheckboxDropdown('s-mechanicsDropdown', mech, 'Select mechanics');
  buildCheckboxDropdown('s-restrictionsDropdown', rest, 'Select restrictions');
}

function firstGuideUrl(item) {
  if (Array.isArray(item?.guides) && item.guides.length) {
    const g0 = item.guides[0];
    if (typeof g0 === 'string') return firstHttpUrlOrNull(g0);
    if (g0 && typeof g0 === 'object' && g0.url) return String(g0.url);
  }
  if (typeof item?.guides === 'string') return firstHttpUrlOrNull(item.guides);
  if (item?.guide_url) return String(item.guide_url);
  if (item?.guides_url) return String(item.guides_url);
  return null;
}

function populateSearchPanel(item) {
  const panel = document.querySelector('[data-subpanel="maps-search"]');
  const form = panel?.querySelector('#s-submitMapForm');
  if (!panel || !form) return;

  const creators = Array.isArray(item?.creators) ? item.creators : [];
  const primary = creators.find((c) => c?.is_primary) || creators[0] || null;
  const second = creators.find((c) => !c?.is_primary) || null;

  if (primary) {
    const el = form.querySelector('#s-metaCreatorMain');
    if (el) {
      el.dataset.rawId = primary.id || '';
      el.textContent = primary.name || primary.id || 'N/A';
    }
  } else {
    const el = form.querySelector('#s-metaCreatorMain');
    if (el) {
      el.dataset.rawId = '';
      el.textContent = 'N/A';
    }
  }

  const secEl = form.querySelector('#s-metaCreatorSecond');
  if (secEl) {
    if (second) {
      secEl.dataset.rawId = second.id || '';
      secEl.textContent = second.name || second.id || 'N/A';
    } else {
      secEl.dataset.rawId = '';
      secEl.textContent = 'N/A';
    }
  }

  setText(form, '#s-metaCode', item?.code);
  setText(form, '#s-metaMap', item?.map_name);
  setText(form, '#s-metaCheckpoints', item?.checkpoints);

  // REQUIRED
  const difficulty = item?.difficulty;
  const category = item?.category;
  ddSelectByValue(form.querySelector('#s-difficultyDropdown'), difficulty);
  ddSelectByValue(form.querySelector('#s-categoryDropdown'), category);

  ddCheckByValues(form.querySelector('#s-mechanicsDropdown'), item?.mechanics || []);
  ddCheckByValues(form.querySelector('#s-restrictionsDropdown'), item?.restrictions || []);

  // OPTIONAL
  setValue(form, '#s-optTitleInput', item?.title ?? '');
  setText(form, '#s-optDescription', item?.description);

  const gUrl = firstGuideUrl(item);
  setText(form, '#s-optGuide', gUrl || 'N/A');

  showBannerPreviewScoped(form, item?.map_banner || null);

  const medals = item?.medals || null;
  if (medals && typeof medals === 'object') {
    setValue(form, '#s-medalGoldInput', medals.gold);
    setValue(form, '#s-medalSilverInput', medals.silver);
    setValue(form, '#s-medalBronzeInput', medals.bronze);
  } else {
    setValue(form, '#s-medalGoldInput', '');
    setValue(form, '#s-medalSilverInput', '');
    setValue(form, '#s-medalBronzeInput', '');
  }

  form.classList.remove('hidden');
}

// ———————————————————————————————————————————————————————————————
// UPDATE MAP – init & helpers

function getSelectedRadio(rootSel) {
  const el = document.querySelector(`${rootSel} input[type="radio"]:checked`);
  return el ? el.value : '';
}
function getCheckedValues(rootSel) {
  return Array.from(document.querySelectorAll(`${rootSel} input[type="checkbox"]:checked`)).map(
    (c) => c.value
  );
}

function wireBannerDropScoped({ dropId, inputId, placeholderId, stateKey }) {
  const drop = document.getElementById(dropId);
  const input = document.getElementById(inputId);
  const placeholder = document.getElementById(placeholderId);
  if (!drop || !input) return;

  function showPreview(file) {
    const url = URL.createObjectURL(file);
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Banner preview';
    img.className = 'absolute inset-0 h-full w-full object-cover';
    drop.querySelector('img')?.remove();
    drop.appendChild(img);
  }

  drop.addEventListener('click', () => input.click());
  input.addEventListener('change', () => {
    const f = input.files?.[0];
    if (f) {
      window[stateKey] = f;
      placeholder?.classList.add('hidden');
      showPreview(f);
    }
  });
  drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    drop.classList.add('ring-2', 'ring-emerald-500/60');
  });
  drop.addEventListener('dragleave', () => drop.classList.remove('ring-2', 'ring-emerald-500/60'));
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.classList.remove('ring-2', 'ring-emerald-500/60');
    const f = e.dataTransfer.files?.[0];
    if (f) {
      window[stateKey] = f;
      placeholder?.classList.add('hidden');
      showPreview(f);
    }
  });
}

async function initUpdatePanel() {
  const panel = document.querySelector('[data-subpanel="maps-update"]');
  if (!panel || panel.dataset.inited === '1') return;
  panel.dataset.inited = '1';

  buildRadioDropdown('u-difficultyDropdown', DIFFICULTY_FINE_OPTIONS, 'Select difficulty');
  buildRadioDropdown('u-categoryDropdown', CATEGORY_OPTIONS, 'Select category');
  buildRadioDropdown('u-playtestingDropdown', PLAYTESTING_OPTIONS, 'Select playtesting');

  const [mech, rest] = await Promise.all([
    fetchStrings('/api/autocomplete/map-mechanics?search=&limit=50'),
    fetchStrings('/api/autocomplete/map-restrictions?search=&limit=50'),
  ]);
  buildCheckboxDropdown('u-mechanicsDropdown', mech, 'Select mechanics');
  buildCheckboxDropdown('u-restrictionsDropdown', rest, 'Select restrictions');

  wireBannerDropScoped({
    dropId: 'u-bannerDrop',
    inputId: 'u-bannerInput',
    placeholderId: 'u-bannerPlaceholder',
    stateKey: 'customBannerFileUpdate',
  });

  bindEditButtonsGeneric(panel);
  wireFormAutocompletes(panel);
}

function firstGuideUrlFromItem(item) {
  if (Array.isArray(item?.guides) && item.guides.length) {
    const g0 = item.guides[0];
    if (typeof g0 === 'string') return firstHttpUrlOrNull(g0);
    if (g0 && typeof g0 === 'object' && g0.url) return String(g0.url);
  }
  if (typeof item?.guides === 'string') return firstHttpUrlOrNull(item.guides);
  if (item?.guide_url) return String(item.guide_url);
  if (item?.guides_url) return String(item.guides_url);
  return null;
}

function populateUpdatePanel(item) {
  const panel = document.querySelector('[data-subpanel="maps-update"]');
  const form = panel?.querySelector('#u-updateMapForm');
  if (!panel || !form) return;

  const creators = Array.isArray(item?.creators) ? item.creators : [];
  const primary = creators.find((c) => c?.is_primary) || creators[0];
  const second = creators.find((c) => !c?.is_primary);

  if (primary) {
    const el = form.querySelector('#u-metaCreatorMain');
    if (el) {
      el.dataset.rawId = primary.id || '';
      el.textContent = primary.name || primary.id || 'N/A';
    }
  } else {
    const el = form.querySelector('#u-metaCreatorMain');
    if (el) {
      el.dataset.rawId = '';
      el.textContent = 'N/A';
    }
  }

  const secEl = form.querySelector('#u-metaCreatorSecond');
  if (secEl) {
    if (second) {
      secEl.dataset.rawId = second.id || '';
      secEl.textContent = second.name || second.id || 'N/A';
    } else {
      secEl.dataset.rawId = '';
      secEl.textContent = 'N/A';
    }
  }

  // Meta simples
  setText(form, '#u-metaCode', item?.code);
  setText(form, '#u-metaMap', item?.map_name);
  setText(form, '#u-metaCheckpoints', item?.checkpoints);

  // Required
  ddSelectByValue(form.querySelector('#u-difficultyDropdown'), item?.difficulty);
  ddSelectByValue(form.querySelector('#u-categoryDropdown'), item?.category);
  ddCheckByValues(form.querySelector('#u-mechanicsDropdown'), item?.mechanics || []);
  ddCheckByValues(form.querySelector('#u-restrictionsDropdown'), item?.restrictions || []);

  // Flags
  form.querySelector('#u-flagHidden')?.setAttribute('checked', item?.hidden ? 'checked' : '');
  form.querySelector('#u-flagHidden') &&
    (form.querySelector('#u-flagHidden').checked = !!item?.hidden);
  form.querySelector('#u-flagArchived') &&
    (form.querySelector('#u-flagArchived').checked = !!item?.archived);
  form.querySelector('#u-flagOfficial') &&
    (form.querySelector('#u-flagOfficial').checked = !!item?.official);
  ddSelectByValue(form.querySelector('#u-playtestingDropdown'), item?.playtesting);

  // Optional
  setValue(form, '#u-optTitleInput', item?.title ?? '');
  setText(form, '#u-optDescription', item?.description);
  setText(form, '#u-optGuide', firstGuideUrlFromItem(item) || 'N/A');

  const drop = form.querySelector('#u-bannerDrop');
  drop?.querySelector('img')?.remove();
  if (item?.map_banner) {
    const img = document.createElement('img');
    img.src = item.map_banner;
    img.alt = 'Banner preview';
    img.className = 'absolute inset-0 h-full w-full object-cover';
    drop?.appendChild(img);
    form.querySelector('#u-bannerPlaceholder')?.classList.add('hidden');
  } else {
    form.querySelector('#u-bannerPlaceholder')?.classList.remove('hidden');
  }

  const medals = item?.medals || null;
  setValue(form, '#u-medalGoldInput', medals?.gold ?? '');
  setValue(form, '#u-medalSilverInput', medals?.silver ?? '');
  setValue(form, '#u-medalBronzeInput', medals?.bronze ?? '');

  form.classList.remove('hidden');
}

// ———————————————————————————————————————————————————————————————
// Inline edit générique

function bindEditButtonsGeneric(root) {
  if (!root || root.__uEditBound) return;
  root.__uEditBound = true;

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-edit-target]');
    if (!btn) return;
    e.preventDefault();
    editInlineGeneric(btn.getAttribute('data-edit-target'), btn);
  });
}

function editInlineGeneric(fieldRef, triggerBtn) {
  const raw = String(fieldRef || '');
  const id = raw.replace(/^#/, '');
  const esc = window.CSS && CSS.escape ? CSS.escape : (s) => s.replace(/[^a-zA-Z0-9_\-]/g, '\\$&');

  const panel =
    (triggerBtn && triggerBtn.closest('[data-subpanel="maps-update"]')) ||
    document.querySelector('[data-subpanel="maps-update"]') ||
    document;

  const label = panel.querySelector(`#${esc(id)}`);
  if (!label || label.classList.contains('editing')) return;

  const text = (label.textContent || '').trim();
  label.classList.add('editing');

  const editBtnEl =
    triggerBtn ||
    panel.querySelector(
      `[data-edit-target="${raw}"], [data-edit-target="#${id}"], [data-edit-target="${id}"]`
    ) ||
    null;

  const hostRow =
    (editBtnEl &&
      (editBtnEl.closest('.main-creator-row, .secondary-creator-row') ||
        editBtnEl.closest('.flex.items-center.gap-2'))) ||
    (editBtnEl ? findCommonAncestor(label, editBtnEl) : null) ||
    label.parentElement;

  const suffix = id.replace(/^.*?-/, '');
  let input;

  // champs
  if (suffix === 'optDescription' || suffix === 'optGuide') {
    input = document.createElement('textarea');
    input.rows = 3;
    input.className =
      'w-full max-w-full min-w-0 rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 shadow-lg ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 resize-y';
  } else if (suffix === 'metaCheckpoints') {
    input = document.createElement('input');
    input.type = 'number';
    input.className =
      'w-28 max-w-full rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 shadow-lg ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60';
  } else {
    input = document.createElement('input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.className =
      'min-w-[12rem] max-w-full rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 shadow-lg ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60';
  }

  if (suffix === 'metaCreatorMain' || suffix === 'metaCreatorSecond') {
    input.value = text === 'N/A' ? '' : text;
    input.dataset.uid = label.getAttribute('data-raw-id') || '';
    input.placeholder = 'Search a user…';
  } else {
    input.value = text === 'N/A' ? '' : text;
  }

  // boutons
  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.textContent = 'Save';
  saveBtn.className =
    'inline-flex items-center gap-1 rounded-lg border border-emerald-400/30 bg-emerald-500 text-zinc-900 px-3 py-1.5 text-sm font-medium hover:bg-emerald-400';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className =
    'inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 text-zinc-200 px-3 py-1.5 text-sm hover:bg-white/10';

  const inputWrap = document.createElement('div');
  inputWrap.className = 'relative flex-1 min-w-[12rem] max-w-full';
  inputWrap.appendChild(input);

  const buttonsBox = document.createElement('div');
  buttonsBox.className = 'inline-edit-buttons flex flex-wrap items-center gap-2';
  buttonsBox.appendChild(saveBtn);
  buttonsBox.appendChild(cancelBtn);

  const container = document.createElement('div');
  container.className =
    'inline-edit-container mt-2 w-full max-w-full flex flex-wrap items-start gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2';
  container.appendChild(inputWrap);
  container.appendChild(buttonsBox);

  const rowToHide =
    suffix === 'metaCreatorMain' || suffix === 'metaCreatorSecond'
      ? editBtnEl?.closest('.main-creator-row, .secondary-creator-row') || hostRow
      : null;

  if (rowToHide) {
    rowToHide.classList.add('hidden');
  } else {
    label.style.display = 'none';
    if (editBtnEl) editBtnEl.style.display = 'none';
  }

  // insérer l’éditeur
  hostRow && hostRow.insertAdjacentElement
    ? hostRow.insertAdjacentElement('afterend', container)
    : label.parentNode.insertBefore(container, label.nextSibling);

  input.focus();

  // autocomplete
  if (suffix === 'metaCreatorMain' || suffix === 'metaCreatorSecond') {
    attachUsersAutocomplete(input);
  } else if (suffix === 'metaMap') {
    attachMapNameAutocomplete(input);
  } else if (suffix === 'metaCode') {
    attachMapCodeAutocomplete(input);
  }

  function closeEdit() {
    if (rowToHide) {
      rowToHide.classList.remove('hidden');
    } else {
      label.style.display = '';
      if (editBtnEl) editBtnEl.style.display = '';
    }
    label.classList.remove('editing');
    container.remove();
  }

  function validateEdit() {
    let newValue = (input.value || '').trim();

    if (suffix === 'metaCheckpoints') {
      const n = Number(newValue);
      if (!Number.isFinite(n) || n < 0) {
        showErrorMessage('Invalid checkpoints');
        input.focus();
        return;
      }
      label.textContent = String(n);
      closeEdit();
      return;
    }

    if (suffix === 'optGuide' || suffix === 'optDescription') {
      if (newValue === '') newValue = 'N/A';
    }

    if (suffix === 'metaCreatorMain' || suffix === 'metaCreatorSecond') {
      const chosenId = String(input.dataset.uid || '').trim() || newValue;
      label.setAttribute('data-raw-id', chosenId);
      label.textContent = newValue || 'N/A';
      closeEdit();
      return;
    }

    label.textContent = newValue || 'N/A';
    closeEdit();
  }

  saveBtn.onclick = validateEdit;
  cancelBtn.onclick = closeEdit;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.tagName !== 'TEXTAREA') {
      e.preventDefault();
      validateEdit();
    }
    if (e.key === 'Escape') closeEdit();
  });
}

// ———————————————————————————————————————————————————————————————
// Medals (update)
function parseDecLocale(v) {
  const s = String(v ?? '')
    .trim()
    .replace(',', '.');
  return s === '' ? null : Number(s);
}

function readUpdateMedalsInputs() {
  const g = parseDecLocale(document.getElementById('u-medalGoldInput')?.value);
  const s = parseDecLocale(document.getElementById('u-medalSilverInput')?.value);
  const b = parseDecLocale(document.getElementById('u-medalBronzeInput')?.value);
  if (g == null && s == null && b == null) return null;
  return { gold: g, silver: s, bronze: b };
}

function validateUpdateMedals(allowEmpty = true) {
  const v = readUpdateMedalsInputs();
  if (!v) return allowEmpty ? { ok: true } : { ok: false, error: 'Medals required' };

  const nums = ['gold', 'silver', 'bronze'].map((k) => v[k]);
  if (nums.some((n) => n == null || !Number.isFinite(n) || n < 0)) {
    return { ok: false, error: 'Invalid medals.' };
  }
  const { gold, silver, bronze } = v;
  if (!(bronze > silver && silver > gold)) {
    return { ok: false, error: 'Order must be bronze > silver > gold.' };
  }
  return { ok: true, values: { gold, silver, bronze } };
}

// ———————————————————————————————————————————————————————————————
// QUALITY OVERRIDE
const QUALITY_OPTIONS = [1, 2, 3, 4, 5, 6].map((n) => ({
  value: String(n),
  text: n === 1 ? '1 – Lowest' : n === 6 ? '6 – Highest' : String(n),
}));

function initModQualityPanel() {
  const panel = document.querySelector('[data-subpanel="mod-quality"]');
  if (!panel || panel.dataset.inited === '1') return;
  panel.dataset.inited = '1';

  buildRadioDropdown('q-qualityDropdown', QUALITY_OPTIONS, 'Select quality (1–6)');
}

// ———————————————————————————————————————————————————————————————
// VERIFICATION QUEUE – init & helpers
const MOD_USER_ID = (
  typeof window !== 'undefined' && window.user_id != null
    ? String(window.user_id)
    : (document.querySelector('meta[name="mod-user-id"]')?.content ?? '')
).trim();

function ensureVerifResultsContainer() {
  const panel = document.querySelector('[data-subpanel="verif-pending"]');
  if (!panel) return null;

  let box = panel.querySelector('#verifResults');
  if (!box) {
    box = document.createElement('div');
    box.id = 'verifResults';
    box.className = 'space-y-4 max-h-[70vh] overflow-y-auto pr-1';
    const article = panel.querySelector('article');
    article?.insertAdjacentElement('afterend', box);
  } else {
    box.classList.add('max-h-[70vh]', 'overflow-y-auto', 'pr-1');
  }
  return box;
}

function kvRow(label, value, { rawHtml = false } = {}) {
  const shown = rawHtml ? value : decorateValue(label, value);
  return `
    <div class="grid grid-cols-3 gap-2 text-sm">
      <div class="col-span-1 text-zinc-400">${escapeHtml(label)}</div>
      <div class="col-span-2 break-all">${shown}</div>
    </div>`;
}

function decorateValue(label, v) {
  if (v == null || v === '') return '—';
  if (typeof v === 'string' && /^https?:\/\//i.test(v)) return linkOrDash(v);
  const s = String(v);

  if (/_id$/.test(label) || /^\d{8,}$/.test(s)) return monoChip(s);

  return stringChip(s);
}

function monoChip(text) {
  return `<span class="inline-block rounded-md bg-black/30 px-1.5 py-0.5 font-mono text-[12px] tracking-tight ring-1 ring-white/10">${escapeHtml(String(text))}</span>`;
}
function stringChip(text) {
  return `<span class="inline-block rounded-md bg-white/5 px-2 py-0.5 text-[13px] font-medium text-zinc-100 ring-1 ring-white/10">${escapeHtml(String(text))}</span>`;
}
function linkOrDash(url) {
  if (!url) return '—';
  const u = String(url);
  return `<a href="${escapeHtml(u)}" target="_blank" class="underline decoration-dotted hover:opacity-80">${escapeHtml(u)}</a>`;
}

function boolChip(v) {
  const yes = !!v;
  return `
    <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium
                ring-1 ${
                  yes
                    ? 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/20'
                    : 'bg-rose-500/10 text-rose-300 ring-rose-400/20'
                }">
      <span class="h-1.5 w-1.5 rounded-full ${yes ? 'bg-emerald-400' : 'bg-rose-400'}"></span>
      ${yes ? 'true' : 'false'}
    </span>`;
}

function openImageLightbox(src) {
  if (!src) return;
  const overlay = document.createElement('div');
  overlay.className =
    'fixed inset-0 z-[400] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4';
  overlay.innerHTML = `
    <div class="relative max-w-[92vw] max-h-[86vh]">
      <img src="${escapeHtml(src)}" alt="screenshot" class="max-w-full cursor-pointer max-h-[86vh] rounded-xl border border-white/10 shadow-2xl object-contain">
      <div class="absolute -top-3 -right-3 flex gap-2">
        <a href="${escapeHtml(src)}" target="_blank" class="rounded-lg bg-white text-zinc-900 text-xs px-2 py-1 font-semibold hover:bg-zinc-100">Open</a>
        <button class="lb-close cursor-pointer rounded-lg border border-white/10 bg-white/5 text-white text-xs px-2 py-1 hover:bg-white/10">Close</button>
      </div>
    </div>
  `;
  const close = () => overlay.remove();
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('.lb-close')) close();
  });
  document.addEventListener('keydown', function onEsc(ev) {
    if (ev.key === 'Escape') {
      close();
      document.removeEventListener('keydown', onEsc);
    }
  });
  document.body.appendChild(overlay);
}

(function setupLightboxDelegation() {
  const roots = [document.getElementById('verifList') || document];
  roots.forEach((root) =>
    root.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-enlarge]');
      if (!btn) return;
      e.preventDefault();
      openImageLightbox(btn.dataset.enlarge);
    })
  );
})();

function renderSubmissionCard(item) {
  const rid = String(item?.id ?? '');
  const verId = item?.verification_id == null ? '' : String(item.verification_id);
  const shot = item?.screenshot ? String(item.screenshot) : '';

  const wrap = document.createElement('article');
  wrap.className =
    'rounded-2xl border border-white/10 bg-zinc-900/60 p-4 ring-1 ring-white/5 relative pb-16';
  wrap.dataset.recordId = rid;
  wrap.dataset.verificationId = verId;

  const imgHtml = shot
    ? `
    <div class="space-y-1">
      <button type="button" data-enlarge="${escapeHtml(shot)}"
              class="relative cursor-pointer group block overflow-hidden rounded-xl border border-white/10 ring-1 ring-white/10 bg-black/20">
        <img src="${escapeHtml(shot)}" alt="screenshot"
             class="w-full h-full object-cover max-h-[240px] md:max-h-[360px] transition-transform duration-200 group-hover:scale-[1.02]">
        <span class="pointer-events-none absolute inset-0 rounded-xl ring-0 group-hover:ring-2 group-hover:ring-emerald-400/40"></span>
      </button>
      <div class="text-[11px] text-zinc-400 text-right">
        <a href="${escapeHtml(shot)}" target="_blank" class="hover:underline decoration-dotted">Open original</a>
      </div>
    </div>
  `
    : `
    <div class="w-full h-[200px] md:h-[280px] rounded-xl border border-white/10 bg-zinc-900/40 grid place-items-center text-xs text-zinc-400">
      No screenshot
    </div>`;

  wrap.innerHTML = `
    <div class="flex flex-col md:flex-row items-stretch gap-5">
      <!-- DATA -->
      <div class="flex-1 order-1 space-y-3">
        <div class="flex items-start justify-between">
          <h4 class="font-semibold text-lg">Submission #${escapeHtml(rid)}</h4>
          <div class="text-xs text-zinc-400">verification_id: ${decorateValue('verification_id', verId)}</div>
        </div>

        <div class="grid gap-1.5">
          ${kvRow('user_id', item?.user_id == null ? '—' : String(item.user_id))}
          ${kvRow('time', item?.time)}
          ${kvRow('code', item?.code)}
          ${kvRow('map_name', item?.map_name)}
          ${kvRow('difficulty', item?.difficulty)}
          ${kvRow('name', item?.name)}
          ${kvRow('also_known_as', item?.also_known_as)}
          ${kvRow('verified', boolChip(item?.verified), { rawHtml: true })}
          ${kvRow('completion', boolChip(item?.completion), { rawHtml: true })}
          ${kvRow('inserted_at', item?.inserted_at)}
          ${kvRow('hypothetical_rank', item?.hypothetical_rank)}
          ${kvRow('hypothetical_medal', item?.hypothetical_medal)}
          ${kvRow('verified_by', item?.verified_by == null ? '—' : String(item.verified_by))}
          ${kvRow('message_id', item?.message_id == null ? '—' : String(item.message_id))}
          ${kvRow('suspicious', boolChip(item?.suspicious), { rawHtml: true })}
          ${kvRow('video', linkOrDash(item?.video), { rawHtml: true })}
        </div>
      </div>

      <!-- SCREENSHOT -->
      <div class="w-full md:w-[320px] order-2 md:mt-6">
        ${imgHtml}
      </div>
    </div>

    <!-- BARRE D’ACTIONS EN BAS À DROITE -->
    <div class="absolute bottom-4 right-4 flex flex-wrap items-center gap-2 z-10">
      <button class="btn-verify cursor-pointer rounded-lg bg-emerald-500 text-white px-3 py-1.5 font-semibold hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40">
        Verify
      </button>
      <button class="btn-deny cursor-pointer rounded-lg bg-rose-500 text-white px-3 py-1.5 font-semibold hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40">
        Deny
      </button>
    </div>
  `;

  return wrap;
}

function removeCardFromVerifList(card) {
  if (!card) return;
  const container = card.parentElement;

  const h = card.offsetHeight;
  card.style.height = h + 'px';
  card.style.transition =
    'height 200ms ease, opacity 160ms ease, transform 160ms ease, margin 200ms ease, padding 200ms ease';
  void card.offsetHeight;
  card.style.opacity = '0';
  card.style.transform = 'translateY(-4px)';
  card.style.height = '0px';
  card.style.marginTop = '0px';
  card.style.marginBottom = '0px';
  card.style.paddingTop = '0px';
  card.style.paddingBottom = '0px';

  card.addEventListener(
    'transitionend',
    () => {
      card.remove();
      if (container && !container.querySelector('[data-record-id]')) {
        container.innerHTML = `<div class="text-sm text-zinc-400">Queue is empty.</div>`;
      }
    },
    { once: true }
  );
}

function showDenyDialog({ title = 'Deny submission', placeholder = 'Reason (optional)' } = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className =
      'fixed inset-0 z-[350] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4';

    overlay.innerHTML = `
      <div class="w-full max-w-md rounded-xl border border-white/10 bg-zinc-900 shadow-2xl ring-1 ring-white/10">
        <div class="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h3 class="font-semibold text-sm">${title}</h3>
          <button class="btn-x cursor-pointer px-2 py-1 text-xs rounded-lg border border-white/10 hover:bg-white/5">Close</button>
        </div>
        <div class="p-4 space-y-3">
          <label class="text-sm text-zinc-300">Reason <span class="text-zinc-500 text-xs">(optional)</span></label>
          <textarea rows="3" class="w-full rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 shadow-lg ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500/60" placeholder="${placeholder}"></textarea>
          <div class="pt-1 flex justify-end gap-2">
            <button class="btn-cancel cursor-pointer rounded-lg border border-white/10 bg-white/5 text-zinc-200 px-3 py-1.5 text-sm hover:bg-white/10">Cancel</button>
            <button class="btn-confirm cursor-pointer rounded-lg bg-rose-500 text-white px-3 py-1.5 text-sm font-semibold hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40">Deny</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    const textarea = overlay.querySelector('textarea');
    const close = (cancelled) => {
      overlay.remove();
      resolve({ cancelled, reason: cancelled ? null : textarea.value.trim() || null });
    };

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close(true);
    });
    overlay.querySelector('.btn-x')?.addEventListener('click', () => close(true));
    overlay.querySelector('.btn-cancel')?.addEventListener('click', () => close(true));
    overlay.querySelector('.btn-confirm')?.addEventListener('click', () => close(false));
    textarea?.focus();
    document.addEventListener(
      'keydown',
      function onKey(ev) {
        if (ev.key === 'Escape') {
          ev.preventDefault();
          close(true);
          document.removeEventListener('keydown', onKey);
        }
        if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'enter') {
          ev.preventDefault();
          close(false);
          document.removeEventListener('keydown', onKey);
        }
      },
      { once: true }
    );
  });
}

document.addEventListener('click', async (e) => {
  const btnVerify = e.target.closest('.btn-verify');
  const btnDeny = e.target.closest('.btn-deny');
  if (!btnVerify && !btnDeny) return;

  const card = e.target.closest('[data-record-id]');
  if (!card) return;

  const record_id = card.dataset.recordId;
  const verified = !!btnVerify;
  let reason = null;

  if (!verified && btnDeny) {
    const { cancelled, reason: r } = await showDenyDialog({ title: 'Deny completion' });
    if (cancelled) return;
    reason = (r ?? '').trim() || null;
  }

  if (verified) {
    reason = null;
  }

  if (!MOD_USER_ID) {
    toast('Missing moderator id (meta[name="mod-user-id"])', 'warn');
    return;
  }

  const body = {
    verified,
    verified_by: MOD_USER_ID,
    reason,
  };

  const { ok, status, url, data } = await http(
    'PUT',
    `${API_MODS}/completions/${encodeURIComponent(record_id)}/verification`,
    { body }
  );

  logActivity({
    title: verified ? 'Verify completion' : 'Deny completion',
    method: 'PUT',
    url,
    ok,
    status,
    data,
  });

  if (ok) {
    toast(verified ? 'Verified' : 'Denied', 'ok');
    removeCardFromVerifList(card);
  } else {
    toast('Action failed', 'err');
  }
});

// ———————————————————————————————————————————————————————————————
// LOOTBOX
function showConfirmActiveKeyType() {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className =
      'fixed inset-0 z-[350] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4';
    overlay.innerHTML = `
      <div class="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl ring-1 ring-white/10">
        <div class="px-4 py-3 border-b border-white/10">
          <h3 class="font-semibold text-sm">Confirm change</h3>
        </div>
        <div class="p-4 space-y-4">
          <p class="text-sm text-zinc-200">Are you sure you want to modify the global active key type ?</p>
          <div class="flex justify-end gap-2">
            <button class="btn-confirm cursor-pointer rounded-lg bg-emerald-500 text-white px-3 py-1.5 text-sm font-semibold hover:bg-emerald-400">I know what I'm doing</button>
            <button class="btn-cancel cursor-pointer rounded-lg bg-rose-500 text-white px-3 py-1.5 text-sm font-semibold hover:bg-rose-400">Cancel</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const close = (val) => {
      overlay.remove();
      resolve(val);
    };
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close(false);
    });
    overlay.querySelector('.btn-cancel')?.addEventListener('click', () => close(false));
    overlay.querySelector('.btn-confirm')?.addEventListener('click', () => close(true));
    document.addEventListener(
      'keydown',
      function onKey(ev) {
        if (ev.key === 'Escape') {
          close(false);
          document.removeEventListener('keydown', onKey);
        }
        if (ev.key === 'Enter') {
          close(true);
          document.removeEventListener('keydown', onKey);
        }
      },
      { once: true }
    );
  });
}

// ———————————————————————————————————————————————————————————————
// USERS
async function prefillReplaceOverwatchByUserId(form, user_id) {
  const { ok, status, url, data } = await http(
    'GET',
    `${API_MODS}/users/${encodeURIComponent(user_id)}/overwatch`
  );
  logActivity({ title: 'Get OW Usernames (prefill)', method: 'GET', url, ok, status, data });

  if (!ok) {
    toast('Failed to load OW usernames', 'err');
    return;
  }

  const primary = data?.primary ?? null;
  const secondary = data?.secondary ?? null;
  const tertiary = data?.tertiary ?? null;

  const setUsername = (i, val) => {
    const inp = form[`username_${i}`];
    if (inp) inp.value = val ?? '';
  };

  const setPrimaryFlag = (i, isTrue) => {
    const wanted = isTrue ? 'true' : 'false';
    const radio = form.querySelector(`[name="is_primary_${i}"][value="${wanted}"]`);
    if (!radio) return;

    radio.checked = true;
    syncDdLabel(radio);
    radio.dispatchEvent(
      new Event('change', {
        bubbles: true,
      })
    );
  };

  setUsername(1, primary);
  setUsername(2, secondary);
  setUsername(3, tertiary);

  const values = [
    (form.username_1?.value || '').trim(),
    (form.username_2?.value || '').trim(),
    (form.username_3?.value || '').trim(),
  ];

  let primaryIndex = primary ? 0 : -1;
  if (primaryIndex === -1) {
    primaryIndex = values.findIndex((v) => v.length > 0);
  }

  for (let i = 0; i < 3; i++) {
    setPrimaryFlag(i + 1, i === primaryIndex && values[i].length > 0);
  }

  toast('Overwatch usernames prefilled', 'ok');
}

async function prefillUpdateNamesByUserId(form, user_id) {
  const { ok, status, url, data } = await http(
    'GET',
    `${API_MODS}/users/${encodeURIComponent(user_id)}`
  );
  logActivity({ title: 'Get User (prefill)', method: 'GET', url, ok, status, data });

  if (!ok) {
    toast('Failed to load user', 'err');
    return;
  }

  if (form.global_name) form.global_name.value = data?.global_name ?? '';
  if (form.nickname) form.nickname.value = data?.nickname ?? '';

  toast('User names prefilled', 'ok');
}

function syncDdLabel(ddOrChild) {
  const dd = ddOrChild?.closest?.('[data-dd-select]') || ddOrChild;
  if (!dd) return;
  const labelEl = dd.querySelector('[data-dd-btn] .dd-label');
  const checked = dd.querySelector('[data-dd-list] input[type="radio"]:checked');
  const txt =
    checked?.dataset?.label ||
    checked?.parentElement?.querySelector('span:last-child')?.textContent ||
    checked?.value ||
    '';
  if (labelEl && txt) labelEl.textContent = txt;
}
