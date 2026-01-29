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
      ? 'bg-emerald-500 text-zinc-900 dark:text-white'
      : type === 'warn'
        ? 'bg-amber-500 text-zinc-900'
        : 'bg-red-600 text-zinc-900 dark:text-white'
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
(() => { const __obj = list; let __last; for (const __c of String('hidden').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c); return __last; })();
    });
    list.addEventListener('change', () => {
      update();
      list.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    });
    document.addEventListener('click', (e) => {
      if (!dd.contains(e.target)) list.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
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

function appendOverlay(overlay) {
  const mount = document.getElementById('mapEditRequestInlineMount');
  let canMount = false;
  if (mount && mount.isConnected) {
    const style = window.getComputedStyle(mount);
    canMount = style && style.display !== 'none' && style.visibility !== 'hidden';
  }
  (canMount ? mount : document.body).appendChild(overlay);
}

// --- Modal ---
function showModal({ title = 'Response', subtitle = '', bodyText = '' } = {}) {
  const overlay = document.createElement('div');
  overlay.className =
    'fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4';
  overlay.innerHTML = `
        <div class="w-full max-w-4xl rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl">
        <div class="flex items-center justify-between px-4 py-3 border-b border-zinc-200/80 dark:border-white/10">
            <div>
            <h3 class="font-semibold">${title}</h3>
            ${subtitle ? `<div class="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">${subtitle}</div>` : ''}
            </span>
            <div class="flex items-center gap-2">
            <button class="copy cursor-pointer px-2 py-1 text-xs rounded-lg border border-zinc-200/80 dark:border-white/10 hover:bg-zinc-900/3 dark:bg-white/5">Copy</button>
            <button class="close cursor-pointer px-2 py-1 text-xs rounded-lg border border-zinc-200/80 dark:border-white/10 hover:bg-zinc-900/3 dark:bg-white/5">Close</button>
            </div>
        </div>
        <div class="p-4 max-h-[70vh] overflow-auto">
            <pre class="text-xs whitespace-pre leading-tight"></pre>
        </div>
        </div>
    `;
  appendOverlay(overlay);


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
  wrap.className = 'rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 p-3 fade-in min-w-0';
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
    <div class="text-[11px] text-zinc-600 dark:text-zinc-400 mb-2">${method} ${url}</div>
    <pre class="resp text-xs whitespace-pre-wrap leading-tight max-w-full break-words [overflow-wrap:anywhere] ${isLong ? 'cursor-zoom-in' : ''}"></pre>
    <div class="mt-2 flex items-center gap-2">
      <button class="view-full cursor-pointer text-xs rounded-lg border border-zinc-200/80 dark:border-white/10 px-2 py-1 hover:bg-zinc-900/3 dark:bg-white/5">View full</button>
      <button class="copy-full cursor-pointer text-xs rounded-lg border border-zinc-200/80 dark:border-white/10 px-2 py-1 hover:bg-zinc-900/3 dark:bg-white/5">Copy</button>
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
      ...(CSRF ? { 'X-CSRF-TOKEN': CSRF } : {}),
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

      tabs.forEach((b) => b.classList.remove(...String('active').trim().split(/\s+/).filter(Boolean), ...String('bg-zinc-900/5 dark:bg-white/10').trim().split(/\s+/).filter(Boolean)));
      btn.classList.add(...String('active').trim().split(/\s+/).filter(Boolean), ...String('bg-zinc-900/5 dark:bg-white/10').trim().split(/\s+/).filter(Boolean));

      const id = btn.dataset.tab;
      panels.forEach((panel) => {
        const isCurrent = panel.dataset.panel === id;
(() => { const __obj = panel; let __last; for (const __c of String('hidden').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !isCurrent); return __last; })();
        if (isCurrent) {
          const subtabBtns = $$('.mod-subtab', panel);
          subtabBtns.forEach((b) => {
            b.setAttribute('aria-selected', 'false');
            b.classList.remove(...String('active').trim().split(/\s+/).filter(Boolean), ...String('bg-zinc-900/5 dark:bg-white/10').trim().split(/\s+/).filter(Boolean));
          });
          const subpanels = $$('[data-subpanel]', panel);
          subpanels.forEach((sp) => sp.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean)));
          $('.empty-state', panel)?.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
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

    list?.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
  });

  root.querySelectorAll('.ac-list').forEach((l) => l.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean)));

  root.querySelectorAll('#bannerDrop, #u-bannerDrop, #s-bannerDrop').forEach((drop) => {
    drop.querySelector('img')?.remove();
  });
  root
    .querySelectorAll('#bannerPlaceholder, #u-bannerPlaceholder, #s-bannerPlaceholder')
    .forEach((ph) => ph.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean)));
  window.customBannerFile = null;
  window.customBannerFileUpdate = null;

  root.querySelectorAll('.inline-edit-container').forEach((c) => c.remove());
  root.querySelectorAll('.editing').forEach((el) => el.classList.remove(...String('editing').trim().split(/\s+/).filter(Boolean)));

  ['rw-rewardTypeDropdown', 'gr-rewardTypeDropdown', 'va-rewardTypeDropdown'].forEach((id) => {
    const dd = document.getElementById(id);
    if (!dd || !dd.isConnected) return;

    const def = id === 'va-rewardTypeDropdown' ? 'any' : '';

    if (typeof ddSelectByValue === 'function') ddSelectByValue(dd, def);

    const hidden = dd.querySelector('input[type="hidden"][name="reward_type"]');
    if (hidden) hidden.value = def;

    dd.querySelector('[data-dd-list]')?.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
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
        sp.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
      });

      $$('.mod-subtab', panel).forEach((b) => {
        const isActive = b === target;
        b.setAttribute('aria-selected', String(isActive));
(() => { const __obj = b; let __last; for (const __c of String('active').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, isActive); return __last; })();
(() => { const __obj = b; let __last; for (const __c of String('bg-zinc-900/5 dark:bg-white/10').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, isActive); return __last; })();
      });

      const active = panel.querySelector(`[data-subpanel="${CSS.escape(name)}"]`);
      if (active) {
        $('.empty-state', panel)?.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
        active.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
        active.classList.add(...String('fade-in').trim().split(/\s+/).filter(Boolean));
        scrollIntoViewWithOffset(active, getHeaderOffset());

        if (name === 'maps-submit') initSubmitPanel();
        if (name === 'maps-archive') setupArchiveMapsUI();
        if (name === 'maps-search') initSearchPanel();
        if (name === 'maps-update') initUpdatePanel();
        if (name === 'mod-quality') initModQualityPanel();
        if (name === 'dev-overpy-commit') initOverpyCommitPanel();
        if (name === 'dev-framework-version') initFrameworkVersionPanel();
        if (name === 'verif-pending') {
          ensureVerifResultsContainer();
          handleGetPendingVerifs();
        }
        if (name === 'verif-edits') {
          ensureEditVerifResultsContainer();
          handleGetPendingEditRequests();
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

  input.parentElement?.classList.add(...String('relative').trim().split(/\s+/).filter(Boolean));

  const list = document.createElement('div');
  list.className =
    'ac-list absolute left-0 right-0 top-full z-[9999] mt-1 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 shadow-2xl ring-1 ring-zinc-300/60 dark:ring-white/10 backdrop-blur max-h-56 overflow-auto hidden';
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
      list.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
      return;
    }
    items.forEach((it, idx) => {
      const row = document.createElement('div');
      row.className = 'px-3 py-2 text-sm cursor-pointer hover:bg-zinc-900/5 dark:bg-white/10';
      row.dataset.index = idx;
      if (kind === 'users') {
        row.innerHTML = `<div class="truncate">${escapeHtml(it.label)}</div><div class="text-[11px] text-zinc-600 dark:text-zinc-400">${it.id}</div>`;
      } else {
        row.textContent = it.value ?? '';
      }
      if (idx === active) row.classList.add(...String('bg-zinc-900/5 dark:bg-white/10').trim().split(/\s+/).filter(Boolean));
      list.appendChild(row);
    });
    list.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
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
    list.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
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
      list.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    }
  });
  list.addEventListener('click', (e) => {
    const row = e.target.closest('[data-index]');
    if (!row) return;
    pick(+row.dataset.index);
  });
  document.addEventListener('click', (e) => {
    if (!list.contains(e.target) && e.target !== input) list.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
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
        case 'get-xp-multiplier':
          return handleGetXpMultiplier(form);
        case 'set-xp-multiplier':
          return handleSetXpMultiplier(form);

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
        case 'create-map-edit-request':
          return handleCreateMapEditRequest(form);

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
        case 'get-pending-edit-requests':
          return handleGetPendingEditRequests();
        case 'verify-completion':
          return handleVerifyCompletion(form);
        default:
          toast(`Unknown action: ${action}`, 'err');

        // DEVS (API_MODS)
        case 'clear-frameworks-cache':
          return handleClearFrameworksCache(form);
        case 'clear-avatars-cache':
          return handleClearAvatarsCache(form);
        case 'clear-translations-cache':
          return handleClearTranslationsCache(form);
        case 'set-overpy-commit':
          return handleSetOverpyCommit(form);
        case 'set-framework-version':
          return handleSetFrameworkVersion(form);
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
      <select name="mode" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2">
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
        <span class="text-sm text-zinc-700 dark:text-zinc-300">Bulk codes (max 5)</span>
        <button type="button" class="add-code cursor-pointer text-xs rounded-lg border border-zinc-200/80 dark:border-white/10 px-2 py-1 hover:bg-zinc-900/3 dark:bg-white/5">Add code</button>
      </div>
      <div class="codes space-y-2"></div>
    `;
  }

  const submitBtn = form.querySelector('button[type="submit"], button:not([type])');
  if (submitBtn) {
    if (!bulkWrap.isConnected) form.insertBefore(bulkWrap, submitBtn);
    else if (bulkWrap.nextElementSibling !== submitBtn) form.insertBefore(bulkWrap, submitBtn);

    submitBtn.classList.add(...String('w-full').trim().split(/\s+/).filter(Boolean));
    submitBtn.classList.add(...String('justify-self-stretch').trim().split(/\s+/).filter(Boolean));
  }

  const codesList = bulkWrap.querySelector('.codes');
  const addBtn = bulkWrap.querySelector('.add-code');

  function addCodeInput(val = '') {
    const count = codesList.querySelectorAll('input[name="bulk_code[]"]').length;
    if (count >= 5) return;
    const row = document.createElement('div');
    row.className = 'flex items-center gap-2';
    row.innerHTML = `
      <input name="bulk_code[]" class="flex-1 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2" placeholder="007EX" value="${val}">
      <button type="button" class="rm cursor-pointer text-xs rounded-lg border border-zinc-200/80 dark:border-white/10 px-2 py-1 hover:bg-zinc-900/3 dark:bg-white/5">×</button>
    `;
    row.querySelector('.rm').addEventListener('click', () => row.remove());
    codesList.appendChild(row);
    attachMapCodeAutocomplete(row.querySelector('input[name="bulk_code[]"]'));
  }
  addBtn.addEventListener('click', () => addCodeInput());

  function applyMode() {
    const bulk = form.mode.value === 'bulk';
(() => { const __obj = (singleWrap); if (!__obj) return undefined; let __last; for (const __c of String('hidden').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, bulk); return __last; })();
(() => { const __obj = bulkWrap; let __last; for (const __c of String('hidden').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !bulk); return __last; })();

(() => { const __obj = (submitBtn) ? (submitBtn) : null; if (!__obj) return undefined; let __last; for (const __c of String('mt-2').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, bulk); return __last; })();

    if (bulk && codesList.children.length === 0) addCodeInput();
  }
  form.mode.addEventListener('change', applyMode);

  singleWrap?.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
  bulkWrap.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
  applyMode();

  const singleInput = form.querySelector('input[name="code"]');
  if (singleInput) attachMapCodeAutocomplete(singleInput);
}

(function syncDdRadiosToSelect() {
  document.addEventListener('change', (e) => {
    const radio = e.target.closest('[data-dd-list] input[type="radio"][name$="_ui"]');
    if (!radio) return;

    const dd = radio.closest('[data-dd-select]');
    if (!dd) return;

    const baseName = radio.name.replace(/_ui$/, '');
    const sel = dd.querySelector(`select[name="${CSS.escape(baseName)}"]`);
    if (!sel) return;

    if (sel.value !== radio.value) sel.value = radio.value;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  }, { passive: true });
})();

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

async function handleGetXpMultiplier(form) {
  const { ok, status, url, data } = await http('GET', `/api/lootbox/xp/multiplier`);

  let value = null;
  if (data && typeof data === 'object' && 'value' in data) value = data.value;
  else if (typeof data === 'string' && data.trim() !== '' && !Number.isNaN(+data)) value = +data;

  logActivity({ title: 'Get XP multiplier', method: 'GET', url, ok, status, data });

  if (!ok) {
    toast('Failed', 'err');
    return;
  }

  toast(value != null ? `XP multiplier: ${value}` : 'XP multiplier fetched', 'ok');
}

async function handleSetXpMultiplier(form) {
  const raw = form.value.value;
  const value = raw === '' ? NaN : +raw;

  if (!Number.isFinite(value) || value < 1 || value > 10) {
    toast('Value must be between 1 and 10', 'warn');
    return;
  }

  const { ok, status, url, data } = await http('POST', `/api/lootbox/xp/multiplier`, {
    body: { value },
  });

  logActivity({ title: 'Set XP multiplier', method: 'POST', url, ok, status, data });

  if (!ok && status === 422) {
    toast('Validation failed (1 → 10)', 'err');
    return;
  }

  toast(ok ? 'XP multiplier updated' : 'Failed', ok ? 'ok' : 'err');
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
  const tags = getCheckedValues('#u-tagsDropdown');
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
  if (tags.length) put('tags', tags);
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

  const tags = Array.from(
    document.querySelectorAll('#tagsDropdown input[type="checkbox"]:checked')
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
  if (tags.length) payload.tags = tags;
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
  const code   = (form.code?.value || '').trim();
  const reason = (form.reason?.value || '').trim();

  if (!code) {
    toast('Map code required', 'warn');
    form.code?.focus();
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  const prevLabel = btn?.innerHTML;
  if (btn) { btn.disabled = true; btn.classList.add(...String('opacity-60').trim().split(/\s+/).filter(Boolean), ...String('cursor-not-allowed').trim().split(/\s+/).filter(Boolean)); btn.textContent = 'Converting…'; }

  const qs  = reason ? `?reason=${encodeURIComponent(reason)}` : '';
  const url = `${API_MODS}/maps/${encodeURIComponent(code)}/legacy${qs}`;

  try {
    const { ok, status, url: reqUrl, data } = await http('POST', url);
    logActivity({
      title: 'Convert to legacy',
      method: 'POST',
      url: reqUrl || url,
      ok, status, data,
      meta: { code, reason }
    });
    toast(ok ? 'Converted' : 'Failed', ok ? 'ok' : 'err');
  } finally {
    if (btn) { btn.disabled = false; btn.classList.remove(...String('opacity-60').trim().split(/\s+/).filter(Boolean), ...String('cursor-not-allowed').trim().split(/\s+/).filter(Boolean)); btn.innerHTML = prevLabel; }
  }
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
    target.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
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
    resultsBox.innerHTML = `<div class="text-sm text-zinc-600 dark:text-zinc-400">Loading queue…</div>`;
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
      resultsBox.innerHTML = `<div class="text-sm text-zinc-600 dark:text-zinc-400">Queue is empty.</div>`;
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

// MAP EDIT REQUESTS
function parseCsvList(raw) {
  const s = String(raw || '').trim();
  if (!s) return [];
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 200);
}

function triStateToBool(v) {
  const s = String(v || '').trim().toLowerCase();
  if (s === 'true') return true;
  if (s === 'false') return false;
  return null;
}

async function handleCreateMapEditRequest(form) {
  const code = String(form?.code?.value || '').trim().toUpperCase();

  if (!code) {
    toast('Map code required', 'warn');
    return;
  }

  let map = { code };
  try {
    const { ok, status, url, data } = await http('GET', '/api/maps', { query: { code } });

    logActivity({ title: `Load map for edit request`, method: 'GET', url, ok, status, data });

    if (ok) {
      if (Array.isArray(data)) map = data[0] || map;
      else if (data && typeof data === 'object') map = (data.items?.[0] ?? data) || map;
    } else {
      toast(`Could not load map (${status}) – opening empty form`, 'warn');
    }
  } catch (e) {
    toast('Network error – opening empty form', 'warn');
  }

  openMapEditRequestModal(map, {
    syncUrl: false,
    fromUrl: true,
    autoClose: false,
    // Create endpoint
    endpoint: '/api/maps/map-edits',
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// MAP EDIT REQUEST FORM
// ──────────────────────────────────────────────────────────────────────────────

const __MER_CATEGORY_OPTIONS = [
  { text: () => (typeof t === 'function' ? (t('filters_toolbar.classic') || 'Classic') : 'Classic'), value: 'Classic', raw: 'Classic' },
  {
    text: () => (typeof t === 'function' ? (t('filters_toolbar.increasing_difficulty') || 'Increasing Difficulty') : 'Increasing Difficulty'),
    value: 'Increasing Difficulty',
    raw: 'Increasing Difficulty',
  },
];

const __MER_DIFFICULTY_FINE_OPTIONS = [
  { text: () => `${(typeof t === 'function' ? (t('filters_toolbar.easy') || 'Easy') : 'Easy')} -`, value: 'Easy -', raw: 'Easy -' },
  { text: () => (typeof t === 'function' ? (t('filters_toolbar.easy') || 'Easy') : 'Easy'), value: 'Easy', raw: 'Easy' },
  { text: () => `${(typeof t === 'function' ? (t('filters_toolbar.easy') || 'Easy') : 'Easy')} +`, value: 'Easy +', raw: 'Easy +' },

  { text: () => `${(typeof t === 'function' ? (t('filters_toolbar.medium') || 'Medium') : 'Medium')} -`, value: 'Medium -', raw: 'Medium -' },
  { text: () => (typeof t === 'function' ? (t('filters_toolbar.medium') || 'Medium') : 'Medium'), value: 'Medium', raw: 'Medium' },
  { text: () => `${(typeof t === 'function' ? (t('filters_toolbar.medium') || 'Medium') : 'Medium')} +`, value: 'Medium +', raw: 'Medium +' },

  { text: () => `${(typeof t === 'function' ? (t('filters_toolbar.hard') || 'Hard') : 'Hard')} -`, value: 'Hard -', raw: 'Hard -' },
  { text: () => (typeof t === 'function' ? (t('filters_toolbar.hard') || 'Hard') : 'Hard'), value: 'Hard', raw: 'Hard' },
  { text: () => `${(typeof t === 'function' ? (t('filters_toolbar.hard') || 'Hard') : 'Hard')} +`, value: 'Hard +', raw: 'Hard +' },

  { text: () => `${(typeof t === 'function' ? (t('filters_toolbar.very_hard') || 'Very Hard') : 'Very Hard')} -`, value: 'Very Hard -', raw: 'Very Hard -' },
  { text: () => (typeof t === 'function' ? (t('filters_toolbar.very_hard') || 'Very Hard') : 'Very Hard'), value: 'Very Hard', raw: 'Very Hard' },
  { text: () => `${(typeof t === 'function' ? (t('filters_toolbar.very_hard') || 'Very Hard') : 'Very Hard')} +`, value: 'Very Hard +', raw: 'Very Hard +' },

  { text: () => `${(typeof t === 'function' ? (t('filters_toolbar.extreme') || 'Extreme') : 'Extreme')} -`, value: 'Extreme -', raw: 'Extreme -' },
  { text: () => (typeof t === 'function' ? (t('filters_toolbar.extreme') || 'Extreme') : 'Extreme'), value: 'Extreme', raw: 'Extreme' },
  { text: () => `${(typeof t === 'function' ? (t('filters_toolbar.extreme') || 'Extreme') : 'Extreme')} +`, value: 'Extreme +', raw: 'Extreme +' },

  { text: () => (typeof t === 'function' ? (t('filters_toolbar.hell') || 'Hell') : 'Hell'), value: 'Hell', raw: 'Hell' },
];

// --- MER helpers
function __merEsc(v) {
  return escapeHtml(String(v ?? ''));
}

function __merReadNumber(v) {
  const s = String(v ?? '').trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function __merDifficultyDotClass(labelOrRaw) {
  const L = String(labelOrRaw || '').toLowerCase();
  if (L.startsWith('easy')) return 'bg-emerald-400';
  if (L.startsWith('medium')) return 'bg-yellow-400';
  if (L.startsWith('very hard')) return 'bg-orange-500';
  if (L.startsWith('hard') && !L.startsWith('very')) return 'bg-orange-400';
  if (L.startsWith('extreme')) return 'bg-red-500';
  if (L.startsWith('hell')) return 'bg-rose-500';
  return 'bg-zinc-400';
}

let __merMechRestrCache = null;
let __merMechRestrInFlight = null;

function __merToNameArray(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.results)) return data.results;
  }
  return [];
}

async function __merFillMechanicsAndRestrictions() {
  if (__merMechRestrCache) return __merMechRestrCache;
  if (__merMechRestrInFlight) return __merMechRestrInFlight;

  const locale =
    (typeof CURRENT_LANG !== 'undefined' ? CURRENT_LANG : (document.documentElement.lang || 'en'));

  __merMechRestrInFlight = (async () => {
    try {
      const [mechResp, restrResp] = await Promise.all([
        fetch('/api/autocomplete/map-mechanics', { headers: { Accept: 'application/json' }, credentials: 'same-origin' }),
        fetch('/api/autocomplete/map-restrictions', { headers: { Accept: 'application/json' }, credentials: 'same-origin' }),
      ]);

      const mechanicsData = mechResp.ok ? await mechResp.json() : [];
      const restrictionsData = restrResp.ok ? await restrResp.json() : [];

      const toOpt = (data, keyPrefix) => {
        const base = __merToNameArray(data)
          .map((v) => (typeof v === 'string' ? v : v?.name ?? v?.value ?? v?.label ?? ''))
          .map((s) => String(s || '').trim())
          .filter(Boolean);

        const seen = new Set();
        const out = [];
        for (const raw of base) {
          if (seen.has(raw)) continue;
          seen.add(raw);

          let translated = raw;
          if (typeof t === 'function' && locale === 'cn') {
            const slug = raw.toLowerCase().replace(/\s+/g, '_');
            const k = `${keyPrefix}.${slug}`;
            const tr = t(k);
            if (tr && tr !== k) translated = tr;
          }

          out.push({ translated, value: raw, raw });
        }
        return out;
      };

      const mechanicsOptions = toOpt(mechanicsData, 'mechanics');
      const restrictionsOptions = toOpt(restrictionsData, 'restrictions');

      __merMechRestrCache = { mechanicsOptions, restrictionsOptions };
      return __merMechRestrCache;
    } catch {
      __merMechRestrCache = { mechanicsOptions: [], restrictionsOptions: [] };
      return __merMechRestrCache;
    } finally {
      __merMechRestrInFlight = null;
    }
  })();

  return __merMechRestrInFlight;
}

// --- Users lookup (for creators / created_by display)
const __merUserCache = new Map();
async function __merFetchUserProfile(userId) {
  const id = String(userId || '').trim();
  if (!/^\d+$/.test(id)) return null;

  const cached = __merUserCache.get(id);
  if (cached) return cached instanceof Promise ? await cached : cached;

  const p = (async () => {
    try {
      const resp = await fetch(`/api/users/${encodeURIComponent(id)}`, {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
      });
      if (!resp.ok) return null;
      return await resp.json();
    } catch {
      return null;
    }
  })();

  __merUserCache.set(id, p);
  const data = await p;
  __merUserCache.set(id, data);
  return data;
}

function __merUserDisplayName(profile) {
  const name =
    profile?.coalesced_name ||
    profile?.global_name ||
    profile?.name ||
    profile?.nickname ||
    profile?.username ||
    '';
  return String(name || '').trim();
}

async function __merSetUserDisplayInto(el, userId, fallback = '') {
  if (!el) return;
  const id = String(userId || '').trim();
  if (!id) {
    el.textContent = fallback || '—';
    return;
  }

  el.textContent = fallback || '…';

  const profile = await __merFetchUserProfile(id);
  const name = __merUserDisplayName(profile);
  el.textContent = name || fallback || id;
}

function __merEnsureCreatorsState(overlay, creators) {
  if (!overlay) return;

  let list = Array.isArray(creators) ? creators.slice() : [];

  const seen = new Set();
  list = list
    .map((c) => ({
      id: String(c?.id ?? c?.user_id ?? '').trim(),
      name: String(c?.name ?? '').trim(),
      is_primary: !!c?.is_primary,
    }))
    .filter((c) => /^\d+$/.test(c.id))
    .filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });

  const firstId = list[0]?.id || null;
  const primaryId = list.find((c) => c.is_primary)?.id || firstId;
  list.forEach((c) => (c.is_primary = c.id === primaryId));

  overlay.__merCreatorsState = { list };
}

function __merSyncCreatorsHiddenInput(overlay) {
  const hidden = document.getElementById('merCreators');
  if (!hidden) return;

  const list = Array.isArray(overlay?.__merCreatorsState?.list) ? overlay.__merCreatorsState.list : [];
  hidden.value = list.map((c) => c.id).join(', ');
}

function __merRenderCreatorsChips(overlay) {
  const host = document.getElementById('merCreatorsChips');
  if (!host) return;

  const creators = Array.isArray(overlay?.__merCreatorsState?.list) ? overlay.__merCreatorsState.list : [];
  host.innerHTML = '';

  if (!creators.length) {
    const empty = document.createElement('div');
    empty.className = 'text-sm text-zinc-600 dark:text-zinc-400';
    empty.textContent = 'N/A';
    host.appendChild(empty);
    return;
  }

  for (const c of creators) {
    const chip = document.createElement('span');
    chip.className =
      'inline-flex items-center gap-2 rounded-full border border-zinc-200/80 dark:border-white/10 bg-zinc-900/5 dark:bg-white/10 backdrop-blur px-2.5 py-1 text-[11px] leading-none text-zinc-900 dark:text-white/85';

    const dot = document.createElement('span');
    dot.className = 'h-2 w-2 rounded-full ' + (c.is_primary ? 'bg-emerald-400' : 'bg-white/50');

    const name = document.createElement('span');
    name.className = 'max-w-[180px] truncate';
    name.textContent = c.name || c.id;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className =
      'ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-zinc-200/80 dark:border-white/10 bg-black/20 text-zinc-900 dark:text-white/80 hover:bg-zinc-900/5 dark:bg-white/10 cursor-pointer';
    remove.setAttribute('data-mer-remove-creator', c.id);
    remove.innerHTML = '&times;';

    chip.appendChild(dot);
    chip.appendChild(name);
    chip.appendChild(remove);
    host.appendChild(chip);
  }

  host.querySelectorAll('button[data-mer-remove-creator]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-mer-remove-creator');
      if (!id) return;

      overlay.__merCreatorsState.list = creators.filter((c) => c.id !== id);

      const firstId = overlay.__merCreatorsState.list[0]?.id || null;
      const primaryId = overlay.__merCreatorsState.list.find((c) => c.is_primary)?.id || firstId;
      overlay.__merCreatorsState.list.forEach((c) => (c.is_primary = c.id === primaryId));

      __merSyncCreatorsHiddenInput(overlay);
      __merRenderCreatorsChips(overlay);
    });
  });
}

function __merAddCreatorToState(overlay, { id, name }) {
  const uid = String(id || '').trim();
  if (!/^\d+$/.test(uid)) return;
  const nm = String(name || '').trim();

  overlay.__merCreatorsState = overlay.__merCreatorsState || { list: [] };
  const list = Array.isArray(overlay.__merCreatorsState.list) ? overlay.__merCreatorsState.list : (overlay.__merCreatorsState.list = []);

  if (list.some((c) => c.id === uid)) return;

  const isPrimary = list.length === 0;
  list.push({ id: uid, name: nm, is_primary: isPrimary });

  if (isPrimary) {
    list.forEach((c) => (c.is_primary = c.id === uid));
  }

  __merSyncCreatorsHiddenInput(overlay);
  __merRenderCreatorsChips(overlay);
}

// --- MER banner upload / dropzone
const __MER_BANNER_ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const __MER_BANNER_MAX_BYTES = 10 * 1024 * 1024; // 10MB
const __MER_IMAGE_UPLOAD_ENDPOINT = '/api/utilities/image';

function __merShowBusy(el) {
  if (!el) return () => {};
  const o = document.createElement('div');
  o.className = 'absolute inset-0 grid place-items-center bg-black/40 backdrop-blur-sm';
  o.innerHTML = `<div class="rounded-md bg-white/80 dark:bg-zinc-900/80 px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 ring-1 ring-emerald-500/60">${(typeof t === 'function' ? (t('record.uploading_screenshot') || 'Uploading…') : 'Uploading…')}</div>`;
  el.appendChild(o);
  return () => o.remove();
}

function __merFilenameWithExt(file, base = 'image') {
  const name = String(file?.name || '').trim();
  const ext = (name.match(/\.[a-z0-9]{2,5}$/i) || [''])[0];
  return ext ? `${base}${ext.toLowerCase()}` : base;
}

async function __merUploadImageGeneric(file) {
  if (!file) throw new Error('No file');
  if (!__MER_BANNER_ALLOWED_MIME.includes(file.type)) {
    throw new Error(typeof t === 'function' ? (t('errors.image_type') || 'Unsupported image type.') : 'Unsupported image type.');
  }
  if (file.size > __MER_BANNER_MAX_BYTES) {
    throw new Error(typeof t === 'function' ? (t('errors.image_too_large') || 'Image too large.') : 'Image too large.');
  }

  const fd = new FormData();
  fd.append('file', file, __merFilenameWithExt(file, 'banner'));

  const resp = await fetch(__MER_IMAGE_UPLOAD_ENDPOINT, {
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

function __merResetBannerDropzone(overlay) {
  const drop = document.getElementById('merBannerDrop');
  if (!drop) return;

  overlay.__merBannerFile = null;
  overlay.__merBannerUrl = null;

  const hidden = document.getElementById('merCustomBanner');
  if (hidden) hidden.value = '';

  drop.dataset.merBound = '0';
  drop.innerHTML = `
    <input id="merBannerInput" type="file" accept="image/*" class="hidden">
    <div id="merBannerPlaceholder" class="text-sm text-zinc-700 dark:text-zinc-300 px-3 text-center select-none">
      ${(typeof t === 'function' ? (t('map_edit_request.drag_and_drop') || 'Drag & drop or click to upload') : 'Drag & drop or click to upload')}
      <div class="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">${(typeof t === 'function' ? (t('map_edit_request.banner_hint') || 'Recommended 16:9. JPG/PNG/WebP/AVIF, max 10MB.') : 'Recommended 16:9. JPG/PNG/WebP/AVIF, max 10MB.')}</div>
    </div>
  `;

  __merSetupBannerDropzone(overlay);
}

function __merSetBannerPreviewFromUrl(overlay, url) {
  const drop = document.getElementById('merBannerDrop');
  if (!drop) return;

  overlay.__merBannerFile = null;
  overlay.__merBannerUrl = url;

  const hidden = document.getElementById('merCustomBanner');
  if (hidden) hidden.value = url || '';

  drop.dataset.merBound = '0';
  drop.innerHTML = `
    <div class="absolute inset-0"></div>
    <div class="absolute inset-x-0 bottom-0 p-2 flex items-center justify-between bg-black/40 backdrop-blur">
      <span class="text-xs text-zinc-900 dark:text-white/90 truncate px-1">${__merEsc(url || '')}</span>
      <button type="button" id="merBannerRemoveBtn" class="rounded-md cursor-pointer border border-white/20 px-2 py-1 text-xs text-zinc-900 dark:text-white hover:bg-zinc-900/5 dark:bg-white/10">
        ${(typeof t === 'function' ? (t('map.remove') || 'Remove') : 'Remove')}
      </button>
    </div>
  `;

  const imgHost = drop.firstElementChild;
  const img = new Image();
  img.alt = '';
  img.decoding = 'async';
  img.loading = 'eager';
  img.draggable = false;
  img.className = 'absolute inset-0 h-full w-full object-cover select-none pointer-events-none';
  img.src = String(url || '');
  imgHost.appendChild(img);

  document.getElementById('merBannerRemoveBtn')?.addEventListener('click', () => __merResetBannerDropzone(overlay));
}

function __merSetupBannerDropzone(overlay) {
  const drop = document.getElementById('merBannerDrop');
  const input = document.getElementById('merBannerInput');
  if (!drop || !input) return;

  if (drop.dataset.merBound === '1') return;
  drop.dataset.merBound = '1';

  const pick = () => input.click();

  const readAsDataURL = (file) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });

  const setPreview = async (file) => {
    drop.dataset.merBound = '0';
    drop.innerHTML = `
      <div class="absolute inset-0"></div>
      <div class="absolute inset-x-0 bottom-0 p-2 flex items-center justify-between bg-black/40 backdrop-blur">
        <span class="text-xs text-zinc-900 dark:text-white/90 truncate px-1">${__merEsc(file.name || '')}</span>
        <button type="button" id="merBannerRemoveBtn" class="rounded-md cursor-pointer border border-white/20 px-2 py-1 text-xs text-zinc-900 dark:text-white hover:bg-zinc-900/5 dark:bg-white/10">
          ${(typeof t === 'function' ? (t('map.remove') || 'Remove') : 'Remove')}
        </button>
      </div>
    `;

    const imgHost = drop.firstElementChild;
    const img = new Image();
    img.alt = '';
    img.decoding = 'async';
    img.loading = 'eager';
    img.draggable = false;
    img.className = 'absolute inset-0 h-full w-full object-cover select-none pointer-events-none';

    let blobUrl = null;
    try {
      blobUrl = URL.createObjectURL(file);
      img.src = blobUrl;

      img.onerror = async () => {
        try {
          const dataUrl = await readAsDataURL(file);
          img.src = dataUrl;
        } catch {
          /* ignore */
        } finally {
          if (blobUrl) URL.revokeObjectURL(blobUrl);
        }
      };

      img.onload = () => {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
      };
    } catch {
      try {
        const dataUrl = await readAsDataURL(file);
        img.src = dataUrl;
      } catch {
        /* ignore */
      }
    }

    imgHost.appendChild(img);

    document.getElementById('merBannerRemoveBtn')?.addEventListener('click', () => __merResetBannerDropzone(overlay));
  };

  const acceptFile = async (file) => {
    if (!file) return;

    if (!__MER_BANNER_ALLOWED_MIME.includes(file.type)) {
      if (typeof showErrorMessage === 'function') {
        showErrorMessage(typeof t === 'function' ? (t('errors.image_type') || 'Unsupported image type.') : 'Unsupported image type.');
      } else {
        toast(typeof t === 'function' ? (t('errors.image_type') || 'Unsupported image type.') : 'Unsupported image type.', 'err');
      }
      return;
    }
    if (file.size > __MER_BANNER_MAX_BYTES) {
      if (typeof showWarningMessage === 'function') {
        showWarningMessage(typeof t === 'function' ? (t('errors.image_too_large') || 'Image too large.') : 'Image too large.');
      } else {
        toast(typeof t === 'function' ? (t('errors.image_too_large') || 'Image too large.') : 'Image too large.', 'warn');
      }
      return;
    }

    overlay.__merBannerFile = file;
    await setPreview(file);

    const endBusy = __merShowBusy(drop);
    try {
      const url = await __merUploadImageGeneric(file);
      overlay.__merBannerUrl = url;
      const hidden = document.getElementById('merCustomBanner');
      if (hidden) hidden.value = url || '';

      const ok = document.createElement('div');
      ok.className = 'absolute top-2 right-2 rounded bg-emerald-500/90 text-xs text-zinc-900 dark:text-white px-2 py-0.5 shadow';
      ok.textContent = 'Uploaded';
      drop.appendChild(ok);
      setTimeout(() => ok.remove(), 1500);
    } catch (e) {
      overlay.__merBannerUrl = null;
      const hidden = document.getElementById('merCustomBanner');
      if (hidden) hidden.value = '';
      if (typeof showErrorMessage === 'function') {
        showErrorMessage(e?.message || (typeof t === 'function' ? (t('errors.upload_failed') || 'Upload failed.') : 'Upload failed.'));
      } else {
        toast(e?.message || (typeof t === 'function' ? (t('errors.upload_failed') || 'Upload failed.') : 'Upload failed.'), 'err');
      }
    } finally {
      endBusy();
    }
  };

  input.addEventListener('change', (e) => acceptFile(e.target.files?.[0]));
  drop.addEventListener('click', pick);

  drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    drop.classList.add(...String('ring-2').trim().split(/\s+/).filter(Boolean), ...String('ring-emerald-500/60').trim().split(/\s+/).filter(Boolean));
  });
  drop.addEventListener('dragleave', () => {
    drop.classList.remove(...String('ring-2').trim().split(/\s+/).filter(Boolean), ...String('ring-emerald-500/60').trim().split(/\s+/).filter(Boolean));
  });
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.classList.remove(...String('ring-2').trim().split(/\s+/).filter(Boolean), ...String('ring-emerald-500/60').trim().split(/\s+/).filter(Boolean));
    const file = e.dataTransfer?.files?.[0];
    acceptFile(file);
  });
}

function __merGetSafeUserIdString() {
  const candidates = [];
  try {
    candidates.push(document.getElementById('modUserId')?.value);
  } catch {}

  if (typeof window !== 'undefined') {
    candidates.push(window.user_id, window.userId, window.USER_ID, window.__USER_ID__);
    candidates.push(window?.user?.id, window?.user?.user_id);
  }

  try {
    const el = document.documentElement;
    if (el?.dataset) candidates.push(el.dataset.userId, el.dataset.user_id);
    const m = document.querySelector('meta[name="user-id"]');
    candidates.push(m?.content);
  } catch {}

  for (const c of candidates) {
    if (typeof c === 'string' && /^\d{5,25}$/.test(c)) return c;
    if (typeof c === 'number' && Number.isSafeInteger(c) && c > 0) return String(c);
  }
  return null;
}

function __merGetDropdownListEl(container) {
  return (
    container?.querySelector('.custom-multiselect-list') ||
    container?.querySelector('.fake-select-list') ||
    null
  );
}

function __merGetDropdownBtnEl(container) {
  return (
    container?.querySelector('.fake-select-btn, .custom-multiselect-btn') ||
    null
  );
}

function __merEnsureBtnLabelSpan(btn) {
  if (!btn) return null;
  let span = btn.querySelector('.cm-label');
  if (!span) {
    span = document.createElement('span');
    span.className = 'cm-label truncate';
    btn.insertBefore(span, btn.firstChild);
  }
  return span;
}

function __merHideDropdownList(list) {
  if (!list) return;
  if (list.classList.contains('dd-anim')) {
    list.classList.remove(...String('dd-in').trim().split(/\s+/).filter(Boolean));
    list.classList.add(...String('dd-out').trim().split(/\s+/).filter(Boolean));
    setTimeout(() => {
      list.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
      list.style.display = 'none';
    }, 120);
    return;
  }

  list.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
  list.style.display = 'none';
}

function __merShowDropdownList(list) {
  if (!list) return;
  list.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
  list.style.display = 'block';
  if (list.classList.contains('dd-anim')) {
    requestAnimationFrame(() => {
      list.classList.remove(...String('dd-out').trim().split(/\s+/).filter(Boolean));
      list.classList.add(...String('dd-in').trim().split(/\s+/).filter(Boolean));
    });
  }
}

function __merCloseAllFakeSelects(except) {
  document.querySelectorAll('.fake-select[data-open="1"], .custom-multiselect[data-open="1"]').forEach((el) => {
    if (except && el === except) return;
    const list = __merGetDropdownListEl(el);
    if (!list) return;
    el.setAttribute('data-open', '0');
    __merHideDropdownList(list);
  });
}

function __merUpdateFakeSelectLabel(container) {
  const btn = __merGetDropdownBtnEl(container);
  const labelEl = __merEnsureBtnLabelSpan(btn);
  const placeholder = btn?.getAttribute('data-placeholder') ||
    (typeof t === 'function' ? (t('map_edit_request.select') || 'Select…') : 'Select…');
  if (!btn || !labelEl) return;

  const isDifficulty = container?.id === 'merDifficultyDropdown';
  const radio = container.querySelector('input[type="radio"]:checked');
  if (radio) {
    const text = String(radio.getAttribute('data-label') || radio.value || '').trim();
    if (isDifficulty) {
      const dotCls = __merDifficultyDotClass(text);
      labelEl.innerHTML = `<span class="mr-2 inline-block h-2 w-2 rounded-full ${dotCls}"></span>${__merEsc(text)}`;
    } else {
      labelEl.textContent = text || placeholder;
    }
    return;
  }

  const checked = Array.from(container.querySelectorAll('input[type="checkbox"]:checked'));
  if (checked.length > 0) {
    const texts = checked
      .map((c) => String(c.getAttribute('data-label') || c.value || '').trim())
      .filter(Boolean);

    if (texts.length <= 2) {
      labelEl.textContent = texts.join(', ');
    } else {
      labelEl.textContent = `${texts.length} selected`;
    }
    return;
  }

  labelEl.textContent = placeholder;
}

function __merSetupFakeSelect(container) {
  if (!container || container.dataset.merBound === '1') return;
  container.dataset.merBound = '1';

  const btn = __merGetDropdownBtnEl(container);
  const list = __merGetDropdownListEl(container);
  if (!btn || !list) return;

  btn.classList.add(...String('cursor-pointer').trim().split(/\s+/).filter(Boolean));

  list.classList.add(...String('dropdown-list').trim().split(/\s+/).filter(Boolean), ...String('dd-anim').trim().split(/\s+/).filter(Boolean));
  list.style.display = 'none';

  const close = () => {
    container.setAttribute('data-open', '0');
    __merHideDropdownList(list);
  };

  const open = () => {
    __merCloseAllFakeSelects(container);
    container.setAttribute('data-open', '1');
    __merShowDropdownList(list);
  };

  __merUpdateFakeSelectLabel(container);

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = container.getAttribute('data-open') === '1';
    if (isOpen) close();
    else open();
  });

  container.addEventListener('change', (e) => {
    __merUpdateFakeSelectLabel(container);

    const isRadio = e?.target?.type === 'radio';
    const shouldAutoClose =
      isRadio && (container.id === 'merCategoryDropdown' || container.id === 'merDifficultyDropdown');

    if (shouldAutoClose) close();
  });

  const handleOutside = (e) => {
    if (!container.contains(e.target)) close();
  };
  document.addEventListener('pointerdown', handleOutside);

  container.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

function __merPopulateRadioDropdown(dropdownId, options, inputName) {
  const container = document.getElementById(dropdownId);
  const list = __merGetDropdownListEl(container);
  if (!container || !list) return;

  const isDifficulty = dropdownId === 'merDifficultyDropdown';

  list.innerHTML = '';
  (options || []).forEach((opt) => {
    const value = String(opt.raw ?? opt.value ?? '');
    const labelText = String(
      opt.translated ?? (typeof opt.text === 'function' ? opt.text() : (opt.text ?? opt.label ?? value))
    );

    const label = document.createElement('label');
    label.className = 'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-900/5 dark:bg-white/10';

    if (isDifficulty) {
      const dotCls = __merDifficultyDotClass(labelText);
      label.innerHTML = `
        <input type="radio" name="${inputName}" value="${__merEsc(value)}" data-label="${__merEsc(labelText)}" class="sr-only">
        <span class="inline-block h-2 w-2 rounded-full ${dotCls}"></span>
        <span class="min-w-0 truncate">${__merEsc(labelText)}</span>
      `;
    } else {
      label.innerHTML = `
        <input type="radio" name="${inputName}" value="${__merEsc(value)}" data-label="${__merEsc(labelText)}" class="h-4 w-4 accent-emerald-500">
        <span class="min-w-0 truncate">${__merEsc(labelText)}</span>
      `;
    }
    list.appendChild(label);
  });

  __merSetupFakeSelect(container);
  __merUpdateFakeSelectLabel(container);
}

function __merPopulateCheckboxDropdown(dropdownId, options, inputName) {
  const container = document.getElementById(dropdownId);
  const list = __merGetDropdownListEl(container);
  if (!container || !list) return;

  list.innerHTML = '';
  (options || []).forEach((opt) => {
    const value = String(opt.raw ?? opt.value ?? '');
    const labelText = String(
      opt.translated ?? (typeof opt.text === 'function' ? opt.text() : (opt.text ?? opt.label ?? value))
    );

    const label = document.createElement('label');
    label.className = 'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-900/5 dark:bg-white/10';

    label.innerHTML = `
      <input type="checkbox" name="${inputName}" value="${__merEsc(value)}" data-label="${__merEsc(labelText)}" class="h-4 w-4 accent-emerald-500">
      <span class="min-w-0 truncate">${__merEsc(labelText)}</span>
    `;
    list.appendChild(label);
  });

  __merSetupFakeSelect(container);
  __merUpdateFakeSelectLabel(container);
}

function __merSetRadioValue(dropdownId, rawValue) {
  const container = document.getElementById(dropdownId);
  if (!container) return;
  container.querySelectorAll('input[type="radio"]').forEach((r) => {
    r.checked = String(r.value) === String(rawValue ?? '');
  });
  __merUpdateFakeSelectLabel(container);
}

function __merGetRadioValue(dropdownId) {
  const container = document.getElementById(dropdownId);
  const r = container?.querySelector('input[type="radio"]:checked');
  return r ? String(r.value) : '';
}

function __merSetCheckboxValues(dropdownId, values) {
  const want = new Set((Array.isArray(values) ? values : []).map(String));
  const container = document.getElementById(dropdownId);
  if (!container) return;
  container.querySelectorAll('input[type="checkbox"]').forEach((c) => {
    c.checked = want.has(String(c.value));
  });
  __merUpdateFakeSelectLabel(container);
}

function __merGetCheckboxValues(dropdownId) {
  const container = document.getElementById(dropdownId);
  if (!container) return [];
  return Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map((c) => String(c.value));
}

function __merHideSuggestionBox(box) {
  if (!box) return;
  box.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
  box.innerHTML = '';
}

function __merRenderSuggestionBox(box, items, onPick) {
  if (!box) return;
  box.innerHTML = '';
  const max = Math.min(items.length, 12);

  for (let i = 0; i < max; i++) {
    const it = items[i];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'w-full cursor-pointer rounded-md px-2 py-2 text-left text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-900/5 dark:bg-white/10';
    btn.textContent = it.label;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      onPick(it);
      __merHideSuggestionBox(box);
    });
    box.appendChild(btn);
  }

  if (max === 0) __merHideSuggestionBox(box);
  else box.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
}

function buildAutocompleteUrl(kind, { value = '', locale = (typeof CURRENT_LANG !== 'undefined' ? CURRENT_LANG : LOCALE), pageSize = 12 } = {}) {
  if (typeof acEndpoint === 'function') return acEndpoint(kind, String(value), pageSize, locale);
  // Fallback (should not happen in moderator.js)
  return '';
}

async function resolveEnglishMapNameExact(v) {
  // If a global implementation exists elsewhere on the site, use it.
  try {
    if (typeof window !== 'undefined' && typeof window.resolveEnglishMapNameExact === 'function') {
      return await window.resolveEnglishMapNameExact(v);
    }
  } catch {}
  return String(v ?? '');
}

function __merSetupAutocomplete({ inputEl, boxEl, kind, minChars = 1, onPick }) {
  if (!inputEl || !boxEl) return;
  let timer = null;

  document.addEventListener('pointerdown', (e) => {
    if (inputEl.contains(e.target) || boxEl.contains(e.target)) return;
    __merHideSuggestionBox(boxEl);
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') __merHideSuggestionBox(boxEl);
  });

  inputEl.addEventListener('input', () => {
    const q = String(inputEl.value || '').trim();
    if (q.length < minChars) return __merHideSuggestionBox(boxEl);

    if (timer) clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        const url = buildAutocompleteUrl(kind, {
          value: q,
          locale: (typeof CURRENT_LANG !== 'undefined' ? CURRENT_LANG : LOCALE),
          pageSize: 12
        });
        const res = await fetch(url, { headers: { Accept: 'application/json' }, credentials: 'same-origin' });
        if (!res.ok) return __merHideSuggestionBox(boxEl);

        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.items || data.data || []);
        const items = (list || [])
          .map((x) => {
            if (Array.isArray(x)) {
              const id = String(x[0] ?? '').trim();
              const label = String(x[1] ?? id).trim();
              return { label, raw: id, data: x };
            }

            if (typeof x === 'string') return { label: x, raw: x, data: x };

            const label =
              x.translated_map_name ||
              x.translated ||
              x.coalesced_name ||
              x.global_name ||
              x.name ||
              x.nickname ||
              x.username ||
              x.map_name ||
              x.value ||
              '';

            const isUsers = kind === 'users';
            const raw = isUsers
              ? (x.user_id ?? x.id ?? x.value ?? x.raw ?? label)
              : (x.map_name ?? x.raw ?? x.value ?? x.id ?? x.user_id ?? label);

            return { label: String(label), raw, data: x };
          })
          .filter((x) => x.label);

        __merRenderSuggestionBox(boxEl, items, onPick);
      } catch {
        __merHideSuggestionBox(boxEl);
      }
    }, 220);
  });
}

// Form creator
function ensureMapEditRequestModal() {
  let overlay = document.getElementById('mapEditRequestInline');
  if (overlay) return overlay;

  if (!document.getElementById('merModalStyles')) {
    const st = document.createElement('style');
    st.id = 'merModalStyles';
    st.textContent = `
      .dropdown-list.dd-anim{opacity:0;transform:translateY(-4px) scale(.99);transition:opacity .12s ease,transform .12s ease}
      .dropdown-list.dd-anim.dd-in{opacity:1;transform:translateY(0) scale(1)}
      .dropdown-list.dd-anim.dd-out{opacity:0;transform:translateY(-4px) scale(.99)}
    `;
    document.head.appendChild(st);
  }

  overlay = document.createElement('div');
  overlay.id = 'mapEditRequestInline';
  overlay.className = 'hidden';

  overlay.innerHTML = `
    <div class="w-full rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950/80 shadow-xl ring-1 ring-zinc-300/60 dark:ring-white/10">
      <div class="flex items-start justify-between gap-4 border-b border-zinc-200/80 dark:border-white/10 px-6 py-4">
        <div class="min-w-0">
          <div class="text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-400">MODERATOR</div>
          <h2 class="mt-0.5 text-lg font-semibold text-zinc-900 dark:text-white">Map Edit Request</h2>
          <p class="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Send a map edit request with the same form as the public modal.</p>
        </div>

      </div>

      <div class="max-h-[78vh] overflow-y-auto px-6 py-5">
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 px-4 py-3">
            <div class="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Code</div>
            <div id="merCode" class="mt-1 font-mono text-sm tracking-wide text-zinc-800 dark:text-zinc-200">—</div>
          </div>
          <div class="rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 px-4 py-3">
            <div class="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Created by</div>
            <div id="merCreatedBy" class="mt-1 text-sm text-zinc-800 dark:text-zinc-200">—</div>
          </div>
        </div>

        <div class="mt-4">
          <label class="block text-sm text-zinc-800 dark:text-zinc-200">
            ${(typeof t === 'function' ? (t('map_edit_request.reason') || 'Reason') : 'Reason')} <span class="text-rose-300/90">*</span>
            <textarea id="merReason" rows="3" class="mt-1 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60" placeholder="${(typeof t === 'function' ? (t('map_edit_request.reason_placeholder') || 'Explain what should change and why…') : 'Explain what should change and why…')}"></textarea>
          </label>
        </div>

        <div class="mt-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 p-4">
          <div class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">${(typeof t === 'function' ? (t('map_edit_request.proposed_changes') || 'Proposed changes') : 'Proposed changes')}</div>
          <p class="mt-1 text-xs text-zinc-600 dark:text-zinc-400">${(typeof t === 'function' ? (t('map_edit_request.proposed_hint') || 'Fill only the fields you want to change.') : 'Fill only the fields you want to change.')}</p>

          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <label class="block text-sm text-zinc-800 dark:text-zinc-200">
              ${(typeof t === 'function' ? (t('map_edit_request.new_code') || 'New code') : 'New code')}
              <input id="merNewCode" type="text" autocapitalize="characters" class="mt-1 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 font-mono text-sm tracking-wide text-zinc-900 dark:text-white placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60" placeholder="NEW01">
            </label>

            <label class="block text-sm text-zinc-800 dark:text-zinc-200 relative">
              ${(typeof t === 'function' ? (t('filters_toolbar.map_name') || 'Map name') : 'Map name')}
              <input id="merMapName" type="text" class="mt-1 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60" placeholder="Oasis">
              <div id="merMapNameSuggestions" class="absolute z-[270] mt-1 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 shadow-lg hidden"></div>
            </label>

            <div>
              <div class="text-sm text-zinc-800 dark:text-zinc-200">${(typeof t === 'function' ? (t('filters_toolbar.category') || 'Category') : 'Category')}</div>
              <div id="merCategoryDropdown" data-open="0" class="fake-select relative mt-1">
                <button type="button" class="fake-select-btn inline-flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-white hover:bg-zinc-900/3 dark:bg-white/5" data-placeholder="${(typeof t === 'function' ? (t('map_edit_request.select') || 'Select…') : 'Select…')}">
                  <span class="cm-label truncate">${(typeof t === 'function' ? (t('map_edit_request.select') || 'Select…') : 'Select…')}</span>
                  <span class="text-zinc-900 dark:text-white/60">▾</span>
                </button>
                <div class="fake-select-list absolute z-[270] mt-2 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950/95 p-1 shadow-xl hidden"></div>
              </div>
            </div>

            <div>
              <div class="text-sm text-zinc-800 dark:text-zinc-200">${(typeof t === 'function' ? (t('filters_toolbar.difficulty') || 'Difficulty') : 'Difficulty')}</div>
              <div id="merDifficultyDropdown" data-open="0" class="fake-select relative mt-1">
                <button type="button" class="fake-select-btn inline-flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-white hover:bg-zinc-900/3 dark:bg-white/5" data-placeholder="${(typeof t === 'function' ? (t('map_edit_request.select') || 'Select…') : 'Select…')}">
                  <span class="cm-label truncate">${(typeof t === 'function' ? (t('map_edit_request.select') || 'Select…') : 'Select…')}</span>
                  <span class="text-zinc-900 dark:text-white/60">▾</span>
                </button>
                <div class="fake-select-list absolute z-[270] mt-2 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950/95 p-1 shadow-xl hidden"></div>
              </div>
            </div>

            <label class="block text-sm text-zinc-800 dark:text-zinc-200">
              ${(typeof t === 'function' ? (t('filters_toolbar.checkpoints') || 'Checkpoints') : 'Checkpoints')}
              <input id="merCheckpoints" type="number" min="0" step="1" class="mt-1 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60" placeholder="0">
            </label>

            <label class="block text-sm text-zinc-800 dark:text-zinc-200">
              ${(typeof t === 'function' ? (t('map.title') || 'Title') : 'Title')}
              <input id="merTitle" type="text" maxlength="120" class="mt-1 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60" placeholder="Short title…">
            </label>

            <div>
              <div class="text-sm text-zinc-800 dark:text-zinc-200">${(typeof t === 'function' ? (t('filters_toolbar.mechanics') || 'Mechanics') : 'Mechanics')}</div>
              <div id="merMechanicsDropdown" data-open="0" class="custom-multiselect relative mt-1">
                <button type="button" class="custom-multiselect-btn inline-flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-white hover:bg-zinc-900/3 dark:bg-white/5" data-placeholder="${(typeof t === 'function' ? (t('map_edit_request.select') || 'Select…') : 'Select…')}">
                  <span class="cm-label truncate">${(typeof t === 'function' ? (t('map_edit_request.select') || 'Select…') : 'Select…')}</span>
                  <span class="text-zinc-900 dark:text-white/60">▾</span>
                </button>
                <div class="custom-multiselect-list absolute z-[270] mt-2 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950/95 p-1 shadow-xl hidden max-h-56 overflow-auto"></div>
              </div>
            </div>

            <div>
              <div class="text-sm text-zinc-800 dark:text-zinc-200">${(typeof t === 'function' ? (t('filters_toolbar.restrictions') || 'Restrictions') : 'Restrictions')}</div>
              <div id="merRestrictionsDropdown" data-open="0" class="custom-multiselect relative mt-1">
                <button type="button" class="custom-multiselect-btn inline-flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-white hover:bg-zinc-900/3 dark:bg-white/5" data-placeholder="${(typeof t === 'function' ? (t('map_edit_request.select') || 'Select…') : 'Select…')}">
                  <span class="cm-label truncate">${(typeof t === 'function' ? (t('map_edit_request.select') || 'Select…') : 'Select…')}</span>
                  <span class="text-zinc-900 dark:text-white/60">▾</span>
                </button>
                <div class="custom-multiselect-list absolute z-[270] mt-2 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950/95 p-1 shadow-xl hidden max-h-56 overflow-auto"></div>
              </div>
            </div>
          </div>
          <div>
            <div class="text-sm text-zinc-800 dark:text-zinc-200">${(typeof t === 'function' ? (t('map.tags') || 'Tags') : 'Tags')}</div>
            <div id="merTagsDropdown" data-open="0" class="custom-multiselect relative mt-1">
              <button type="button" class="custom-multiselect-btn inline-flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-white hover:bg-zinc-900/3 dark:bg-white/5" data-placeholder="${(typeof t === 'function' ? (t('map_edit_request.select') || 'Select…') : 'Select…')}">
                <span class="cm-label truncate">${(typeof t === 'function' ? (t('map_edit_request.select') || 'Select…') : 'Select…')}</span>
                <span class="text-zinc-900 dark:text-white/60">▾</span>
              </button>
              <div class="custom-multiselect-list absolute z-[270] mt-2 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950/95 p-1 shadow-xl hidden max-h-56 overflow-auto"></div>
            </div>
          </div>

          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950/50 p-3">
              <div class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">${(typeof t === 'function' ? (t('filters_toolbar.official') || 'Official') : 'Official')}</div>
              <div id="merOfficialSwitch" data-value="0" class="mt-2 inline-flex w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-black/20 p-1">
                <button type="button" data-switch data-value="1" class="flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-900 dark:text-white/80 hover:bg-zinc-900/5 dark:bg-white/10 cursor-pointer">True</button>
                <button type="button" data-switch data-value="0" class="flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-900 dark:text-white/80 hover:bg-zinc-900/5 dark:bg-white/10 cursor-pointer">False</button>
              </div>
            </div>

            <div class="rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950/50 p-3">
              <div class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">${(typeof t === 'function' ? (t('filters_toolbar.hidden') || 'Hidden') : 'Hidden')}</div>
              <div id="merHiddenSwitch" data-value="0" class="mt-2 inline-flex w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-black/20 p-1">
                <button type="button" data-switch data-value="1" class="flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-900 dark:text-white/80 hover:bg-zinc-900/5 dark:bg-white/10 cursor-pointer">True</button>
                <button type="button" data-switch data-value="0" class="flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-900 dark:text-white/80 hover:bg-zinc-900/5 dark:bg-white/10 cursor-pointer">False</button>
              </div>
            </div>

            <div class="rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950/50 p-3">
              <div class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">${(typeof t === 'function' ? (t('filters_toolbar.archived') || 'Archived') : 'Archived')}</div>
              <div id="merArchivedSwitch" data-value="0" class="mt-2 inline-flex w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-black/20 p-1">
                <button type="button" data-switch data-value="1" class="flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-900 dark:text-white/80 hover:bg-zinc-900/5 dark:bg-white/10 cursor-pointer">True</button>
                <button type="button" data-switch data-value="0" class="flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-900 dark:text-white/80 hover:bg-zinc-900/5 dark:bg-white/10 cursor-pointer">False</button>
              </div>
            </div>
          </div>

          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <label class="block text-sm text-zinc-800 dark:text-zinc-200">
              ${(typeof t === 'function' ? (t('medals.gold') || 'Gold') : 'Gold')}
              <input id="merMedalGold" type="number" min="0" step="1" class="mt-1 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60" placeholder="—">
            </label>
            <label class="block text-sm text-zinc-800 dark:text-zinc-200">
              ${(typeof t === 'function' ? (t('medals.silver') || 'Silver') : 'Silver')}
              <input id="merMedalSilver" type="number" min="0" step="1" class="mt-1 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60" placeholder="—">
            </label>
            <label class="block text-sm text-zinc-800 dark:text-zinc-200">
              ${(typeof t === 'function' ? (t('medals.bronze') || 'Bronze') : 'Bronze')}
              <input id="merMedalBronze" type="number" min="0" step="1" class="mt-1 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60" placeholder="—">
            </label>
          </div>

          <div class="mt-4">
            <div class="text-sm text-zinc-800 dark:text-zinc-200">${(typeof t === 'function' ? (t('map.banner') || 'Banner') : 'Banner')}</div>
            <input id="merCustomBanner" type="hidden" value="">
            <div id="merBannerDrop" class="relative mt-1 h-36 w-full cursor-pointer overflow-hidden rounded-2xl border border-dashed border-zinc-200/80 dark:border-white/15 bg-white/70 dark:bg-zinc-900/40"></div>
          </div>

          <div class="mt-4">
            <div class="text-sm text-zinc-800 dark:text-zinc-200">${(typeof t === 'function' ? (t('map_edit_request.creators') || 'Creators') : 'Creators')}</div>
            <input id="merCreators" type="hidden" value="">
            <div class="relative mt-1">
              <input id="merCreatorsSearch" type="text" class="w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60" placeholder="${(typeof t === 'function' ? (t('map_edit_request.search_users') || 'Search users…') : 'Search users…')}">
              <div id="merCreatorSuggestions" class="absolute z-[270] mt-1 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 shadow-lg hidden"></div>
            </div>
            <div id="merCreatorsChips" class="mt-2 flex flex-wrap gap-2"></div>
          </div>

          <div class="mt-4">
            <label class="block text-sm text-zinc-800 dark:text-zinc-200">
              ${(typeof t === 'function' ? (t('map.description') || 'Description') : 'Description')}
              <textarea id="merDescription" rows="4" maxlength="5000" class="mt-1 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-600 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60" placeholder="Details…"></textarea>
            </label>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 border-t border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950/80 px-6 py-4">
        <button type="button" data-mer-close class="cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-900 dark:text-white/80 hover:bg-zinc-900/5 dark:bg-white/10">Cancel</button>
        <button type="button" id="merSendBtn" class="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400">
          ${(typeof t === 'function' ? (t('map_edit_request.send') || 'Send request') : 'Send request')}
        </button>
      </div>
    </div>
  `;

  appendOverlay(overlay);


  // Close wiring
  overlay.__merShow = () => {
    const mount = document.getElementById('mapEditRequestInlineMount');
    if (mount) mount.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
    overlay.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
    overlay.setAttribute('aria-hidden', 'false');
    try { overlay.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch {}
  };
  overlay.__merClose = () => {
    overlay.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    overlay.setAttribute('aria-hidden', 'true');
    const mount = document.getElementById('mapEditRequestInlineMount');
    if (mount) mount.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    __merCloseAllFakeSelects?.();
  };

  overlay.querySelectorAll('[data-mer-close]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.__merClose?.();
    });
  });

  // Switch click wiring
  ['merOfficialSwitch', 'merHiddenSwitch', 'merArchivedSwitch'].forEach((switchId) => {
    const el = document.getElementById(switchId);
    if (!el || el.dataset.merBound === '1') return;
    el.dataset.merBound = '1';

    const apply = (value) => {
      el.setAttribute('data-value', value);
      el.querySelectorAll('button[data-switch]').forEach((b) => {
        const isActive = (b.getAttribute('data-value') || '0') === value;
(() => { const __obj = b; let __last; for (const __c of String('bg-white').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, isActive); return __last; })();
(() => { const __obj = b; let __last; for (const __c of String('text-zinc-900').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, isActive); return __last; })();
(() => { const __obj = b; let __last; for (const __c of String('text-zinc-900 dark:text-white/80').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !isActive); return __last; })();
(() => { const __obj = b; let __last; for (const __c of String('hover:bg-zinc-900/5 dark:bg-white/10').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !isActive); return __last; })();
      });
    };

    el.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-switch]');
      if (!btn) return;
      e.preventDefault();
      apply(btn.getAttribute('data-value') || '0');
    });

    apply(el.getAttribute('data-value') || '0');
  });

  // Banner dropzone wiring
  __merResetBannerDropzone(overlay);

  // Escape closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) overlay.__merClose?.();
  });

  return overlay;
}

function openMapEditRequestModal(map, opts = {}) {
  const { fromUrl = false, syncUrl = true } = opts || {};
  const code = map?.code || '';

  // URL sync false
  if (syncUrl && !fromUrl && typeof __urlOpenModal === 'function' && code) {
    try { __urlOpenModal('map_edit_request', { code }, { push: true }); } catch {}
  }

  const overlay = ensureMapEditRequestModal();
  if (!overlay) return;

  // -------------------------
  // Helpers
  // -------------------------
  const get = (...keys) => {
    for (const k of keys) {
      if (k == null) continue;
      const v = map?.[k];
      if (v !== undefined && v !== null) return v;
    }
    return undefined;
  };

  const toStr = (v) => (v === undefined || v === null ? '' : String(v));
  const toBool = (v) => {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0;
    if (typeof v === 'string') {
      const s = v.trim().toLowerCase();
      if (s === 'true' || s === '1' || s === 'yes' || s === 'y') return true;
      if (s === 'false' || s === '0' || s === 'no' || s === 'n' || s === '') return false;
    }
    return false;
  };

  const normalizeStringList = (arr) =>
    (Array.isArray(arr) ? arr : [])
      .map((x) => (x == null ? '' : String(x)).trim())
      .filter(Boolean);

  const normalizeCreators = (v) => {
    if (Array.isArray(v)) {
      if (v.length === 0) return [];
      if (typeof v[0] === 'object' && v[0]) {
        return v
          .map((c) => ({
            id: String(c.id ?? c.user_id ?? '').trim(),
            is_primary: !!c.is_primary,
            name: String(c.name ?? c.coalesced_name ?? c.global_name ?? c.nickname ?? c.username ?? '').trim(),
          }))
          .filter((c) => /^\d+$/.test(c.id));
      }
      return v
        .map((x) => ({ id: String(x).trim(), is_primary: false, name: '' }))
        .filter((c) => /^\d+$/.test(c.id));
    }

    if (typeof v === 'string') {
      const ids = v
        .split(',')
        .map((x) => x.trim())
        .filter((x) => /^\d+$/.test(x));
      return ids.map((id) => ({ id, is_primary: false, name: '' }));
    }

    if (v && typeof v === 'object') {
      const primary = v.primary ?? v.primary_id ?? v.primary_user_id;
      const others = v.others ?? v.secondary ?? [];
      const out = [];
      if (primary && /^\d+$/.test(String(primary))) out.push({ id: String(primary), is_primary: true, name: '' });
      for (const x of (Array.isArray(others) ? others : [])) {
        if (/^\d+$/.test(String(x))) out.push({ id: String(x), is_primary: false, name: '' });
      }
      return out;
    }

    return [];
  };

  const equalScalar = (a, b) => {
    const na = (a === undefined || a === null) ? '' : String(a);
    const nb = (b === undefined || b === null) ? '' : String(b);
    return na === nb;
  };

  const equalArray = (a, b) => {
    const aa = normalizeStringList(a);
    const bb = normalizeStringList(b);
    if (aa.length !== bb.length) return false;
    for (let i = 0; i < aa.length; i++) if (aa[i] !== bb[i]) return false;
    return true;
  };

  const toSafeId = (s) => {
    const str = String(s ?? '').trim();
    const n = Number(str);
    if (Number.isSafeInteger(n) && String(n) === str) return n;
    return str;
  };

  function __merWarn(msg) {
    const m = String(msg || '').trim();
    if (!m) return;
    if (typeof showWarningMessage === 'function') return showWarningMessage(m);
    toast(m, 'warn');
  }

  function __merErr(msg) {
    const m = String(msg || '').trim();
    if (!m) return;
    if (typeof showErrorMessage === 'function') return showErrorMessage(m);
    toast(m, 'err');
  }

  function __merFormatApiError(data, status) {
    if (typeof data === 'string') return data || `HTTP ${status}`;

    const pickStr = (...vals) => {
      for (const v of vals) {
        if (typeof v === 'string') {
          const s = v.trim();
          if (s) return s;
        }
      }
      return '';
    };

    const topMsg = pickStr(data?.message, data?.error);
    const nestedMsg = pickStr(
      data?.error?.message,
      data?.error?.error,
      data?.error?.detail,
      data?.detail,
      data?.title
    );

    const isUpstream = String(topMsg || '').toLowerCase() === 'upstream error';
    const message = pickStr(isUpstream ? nestedMsg : topMsg, nestedMsg) || `HTTP ${status}`;

    const errors = data?.errors || data?.error?.errors;
    const lines = [];

    if (errors && typeof errors === 'object') {
      for (const [field, arr] of Object.entries(errors)) {
        if (Array.isArray(arr) && arr.length) {
          for (const one of arr) lines.push(`${field}: ${one}`);
        } else if (typeof arr === 'string' && arr.trim()) {
          lines.push(`${field}: ${arr.trim()}`);
        }
      }
    }

    return lines.length ? `${message}\n${lines.join('\n')}` : message;
  }

  // -------------------------
  // Resolve map fields
  // -------------------------
  const mapName = toStr(get('map_name', 'name', 'mapName', 'translated_map_name'));
  const category = toStr(get('category', 'type', 'map_type'));
  const checkpoints = get('checkpoints', 'checkpoint_count', 'cp_count');
  const difficulty = toStr(get('difficulty', 'diff', 'difficulty_name'));
  const mechanics = normalizeStringList(get('mechanics', 'map_mechanics'));
  const restrictions = normalizeStringList(get('restrictions', 'map_restrictions'));
  const tags = normalizeStringList(get('tags', 'map_tags'));
  const title = toStr(get('title'));
  const description = toStr(get('description', 'desc'));
  const customBanner = toStr(get('custom_banner', 'banner', 'banner_url'));

  const official = toBool(get('official', 'is_official'));
  const hidden = toBool(get('hidden', 'is_hidden'));
  const archived = toBool(get('archived', 'is_archived'));

  const medalsRaw = get('medals', 'medal_times', 'medals_times') || {};
  const medalGold = toStr(medalsRaw.gold ?? medalsRaw.Gold ?? medalsRaw.gold_time ?? '');
  const medalSilver = toStr(medalsRaw.silver ?? medalsRaw.Silver ?? medalsRaw.silver_time ?? '');
  const medalBronze = toStr(medalsRaw.bronze ?? medalsRaw.Bronze ?? medalsRaw.bronze_time ?? '');

  const creatorsRaw = get('creators', 'creator_ids', 'creator', 'authors');
  const creators = normalizeCreators(creatorsRaw);

  // -------------------------
  // Fill UI
  // -------------------------
  overlay.__merShow?.();

  const elCode = document.getElementById('merCode');
  const elCreatedBy = document.getElementById('merCreatedBy');

  if (elCode) {
    elCode.textContent = code || 'N/A';
    elCode.classList.add(...String('opacity-80').trim().split(/\s+/).filter(Boolean), ...String('text-zinc-700 dark:text-zinc-300/80').trim().split(/\s+/).filter(Boolean));
    elCode.classList.add(...String('pointer-events-none').trim().split(/\s+/).filter(Boolean), ...String('cursor-default').trim().split(/\s+/).filter(Boolean));
  }

  const createdByStr = __merGetSafeUserIdString?.() || null;
  if (elCreatedBy) {
    elCreatedBy.textContent = createdByStr || 'N/A';
    elCreatedBy.classList.add(...String('opacity-80').trim().split(/\s+/).filter(Boolean), ...String('text-zinc-700 dark:text-zinc-300/80').trim().split(/\s+/).filter(Boolean));
    elCreatedBy.classList.add(...String('pointer-events-none').trim().split(/\s+/).filter(Boolean), ...String('cursor-default').trim().split(/\s+/).filter(Boolean));
    if (createdByStr) __merSetUserDisplayInto(elCreatedBy, createdByStr);
  }

  const elReason = document.getElementById('merReason');
  if (elReason) elReason.value = '';

  const elNewCode = document.getElementById('merNewCode');
  const elMapName = document.getElementById('merMapName');
  const elCheckpoints = document.getElementById('merCheckpoints');
  const elTitle = document.getElementById('merTitle');
  const elDesc = document.getElementById('merDescription');

  if (elNewCode) elNewCode.value = '';
  if (elMapName) {
    elMapName.value = mapName;
    elMapName.setAttribute('data-raw-value', mapName || '');
  }
  if (elCheckpoints) elCheckpoints.value = checkpoints == null ? '' : String(checkpoints);
  if (elTitle) elTitle.value = title;
  if (elDesc) elDesc.value = description;

  // medals
  const elGold = document.getElementById('merMedalGold');
  const elSilver = document.getElementById('merMedalSilver');
  const elBronze = document.getElementById('merMedalBronze');
  if (elGold) elGold.value = medalGold;
  if (elSilver) elSilver.value = medalSilver;
  if (elBronze) elBronze.value = medalBronze;

  // banner
  const elBannerHidden = document.getElementById('merCustomBanner');
  if (elBannerHidden) elBannerHidden.value = customBanner || '';
  if (customBanner) __merSetBannerPreviewFromUrl(overlay, customBanner);
  else __merResetBannerDropzone(overlay);

  // switches
  const setSwitch = (switchId, boolVal) => {
    const el = document.getElementById(switchId);
    if (!el) return;
    const value = boolVal ? '1' : '0';
    el.setAttribute('data-value', value);
    el.querySelectorAll('button[data-switch]').forEach((b) => {
      const isActive = (b.getAttribute('data-value') || '0') === value;
(() => { const __obj = b; let __last; for (const __c of String('bg-white').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, isActive); return __last; })();
(() => { const __obj = b; let __last; for (const __c of String('text-zinc-900').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, isActive); return __last; })();
(() => { const __obj = b; let __last; for (const __c of String('text-zinc-900 dark:text-white/80').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !isActive); return __last; })();
(() => { const __obj = b; let __last; for (const __c of String('hover:bg-zinc-900/5 dark:bg-white/10').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !isActive); return __last; })();
    });
  };
  const getSwitch = (switchId) => {
    const el = document.getElementById(switchId);
    if (!el) return null;
    return el.getAttribute('data-value') === '1';
  };

  setSwitch('merOfficialSwitch', !!official);
  setSwitch('merHiddenSwitch', !!hidden);
  setSwitch('merArchivedSwitch', !!archived);

  // creators chips state
  __merEnsureCreatorsState(overlay, creators);
  __merSyncCreatorsHiddenInput(overlay);
  __merRenderCreatorsChips(overlay);
  const elCreatorsSearch = document.getElementById('merCreatorsSearch');
  if (elCreatorsSearch) elCreatorsSearch.value = '';

  // hydrate creator names
  (async () => {
    const state = overlay?.__merCreatorsState;
    const list = Array.isArray(state?.list) ? state.list : [];
    if (!list.length) return;

    let changed = false;
    for (const c of list) {
      if (c?.name) continue;
      if (!/^\d+$/.test(String(c?.id || ''))) continue;
      const prof = await __merFetchUserProfile(String(c.id));
      const nm = __merUserDisplayName(prof);
      if (nm && nm !== c.name) {
        c.name = nm;
        changed = true;
      }
    }
    if (changed) __merRenderCreatorsChips(overlay);
  })();

  // dropdowns
  const categoryOptions =
    (typeof CATEGORY_OPTIONS !== 'undefined' && Array.isArray(CATEGORY_OPTIONS) && CATEGORY_OPTIONS.length)
      ? CATEGORY_OPTIONS
      : __MER_CATEGORY_OPTIONS;

  const difficultyOptions =
    (typeof DIFFICULTY_FINE_OPTIONS !== 'undefined' && Array.isArray(DIFFICULTY_FINE_OPTIONS) && DIFFICULTY_FINE_OPTIONS.length)
      ? DIFFICULTY_FINE_OPTIONS
      : __MER_DIFFICULTY_FINE_OPTIONS;

  __merPopulateRadioDropdown('merCategoryDropdown', categoryOptions, 'mer_category');
  __merPopulateRadioDropdown('merDifficultyDropdown', difficultyOptions, 'mer_difficulty');
  __merSetRadioValue('merCategoryDropdown', category || '');
  __merSetRadioValue('merDifficultyDropdown', difficulty || '');

  (async () => {
    let mechanicsOptions =
      (typeof MECHANICS_OPTIONS !== 'undefined' && Array.isArray(MECHANICS_OPTIONS) && MECHANICS_OPTIONS.length)
        ? MECHANICS_OPTIONS
        : null;
    let restrictionsOptions =
      (typeof RESTRICTIONS_OPTIONS !== 'undefined' && Array.isArray(RESTRICTIONS_OPTIONS) && RESTRICTIONS_OPTIONS.length)
        ? RESTRICTIONS_OPTIONS
        : null;

    if (!mechanicsOptions || !restrictionsOptions) {
      const filled = await __merFillMechanicsAndRestrictions();
      mechanicsOptions = filled.mechanicsOptions?.length ? filled.mechanicsOptions : mechanics.map((m) => ({ translated: m, value: m, raw: m }));
      restrictionsOptions = filled.restrictionsOptions?.length ? filled.restrictionsOptions : restrictions.map((r) => ({ translated: r, value: r, raw: r }));
    }

    __merPopulateCheckboxDropdown('merMechanicsDropdown', mechanicsOptions, 'mer_mechanics');
    __merPopulateCheckboxDropdown('merRestrictionsDropdown', restrictionsOptions, 'mer_restrictions');
    const tagValues = (Array.isArray(window.MAP_TAG_OPTIONS) && window.MAP_TAG_OPTIONS.length)
      ? window.MAP_TAG_OPTIONS
      : ['Other Heroes', 'XP Based', 'Custom Grav/Speed'];
    const tagsOptions = tagValues.map((v) => ({ translated: v, value: v, raw: v }));
    __merPopulateCheckboxDropdown('merTagsDropdown', tagsOptions, 'mer_tags');
    __merSetCheckboxValues('merMechanicsDropdown', mechanics);
    __merSetCheckboxValues('merRestrictionsDropdown', restrictions);
    __merSetCheckboxValues('merTagsDropdown', tags);
  })();

  // autocomplete mount once
  const mapNameBox = document.getElementById('merMapNameSuggestions');
  if (overlay.__merMounted?.auto !== true) {
    __merSetupAutocomplete({
      inputEl: elMapName,
      boxEl: mapNameBox,
      kind: 'map-names',
      minChars: 1,
      onPick: async (it) => {
        if (!elMapName) return;
        const raw = String(it.raw || it.label || '').trim();
        const label = String(it.label || raw).trim();
        elMapName.value = label;

        let english = raw;
        try {
          const resolved = await resolveEnglishMapNameExact(raw);
          if (resolved) english = resolved;
        } catch {}
        elMapName.setAttribute('data-raw-value', english || raw || label);
      },
    });

    elMapName?.addEventListener('input', () => {
      if (!elMapName) return;
      elMapName.setAttribute('data-raw-value', elMapName.value || '');
    });

    const creatorBox = document.getElementById('merCreatorSuggestions');
    __merSetupAutocomplete({
      inputEl: elCreatorsSearch,
      boxEl: creatorBox,
      kind: 'users',
      minChars: 1,
      onPick: (it) => {
        const pickedId = String(it.raw ?? it.data?.user_id ?? it.data?.id ?? '').trim();
        if (!/^\d+$/.test(pickedId)) return;
        __merAddCreatorToState(overlay, { id: pickedId, name: it.label || '' });
        if (elCreatorsSearch) elCreatorsSearch.value = '';
      },
    });

    overlay.__merMounted = overlay.__merMounted || {};
    overlay.__merMounted.auto = true;
  }

  // -------------------------
  // Baseline snapshot
  // -------------------------
  const baseline = {
    code,
    official: !!official,
    hidden: !!hidden,
    archived: !!archived,
    new_code: '',
    map_name: mapName,
    category,
    checkpoints: checkpoints == null ? '' : String(checkpoints),
    difficulty,
    mechanics: mechanics.slice(),
    restrictions: restrictions.slice(),
    tags: tags.slice(),
    title,
    description,
    custom_banner: customBanner,
    medals: { gold: medalGold, silver: medalSilver, bronze: medalBronze },
    creators: creators.slice(),
  };

  overlay.__merBaseline = baseline;
  overlay.__merOpts = opts;

  // -------------------------
  // Send handler
  // -------------------------
  const sendBtn = document.getElementById('merSendBtn');
  if (sendBtn && overlay.__merMounted?.send !== true) {
    sendBtn.onclick = async () => {
      const baselineNow = overlay.__merBaseline;
      const optsNow = overlay.__merOpts || {};

      const createdBy = __merGetSafeUserIdString?.() || null;
      if (!createdBy) {
        __merWarn(
          (typeof t === 'function' && t('map_edit_request.login_required') && t('map_edit_request.login_required') !== 'map_edit_request.login_required')
            ? t('map_edit_request.login_required')
            : 'You must be logged in to send a map edit request.'
        );
        return;
      }

      const reasonEl = document.getElementById('merReason');
      const reason = (reasonEl?.value || '').trim();
      if (!reason) {
        __merWarn(
          (typeof t === 'function' && t('map_edit_request.reason_required') && t('map_edit_request.reason_required') !== 'map_edit_request.reason_required')
            ? t('map_edit_request.reason_required')
            : 'Please provide a reason.'
        );
        try { reasonEl?.focus?.(); } catch {}
        return;
      }

      // ---------- Build flat payload ----------
      const payload = {
        code: String(baselineNow.code),
        created_by: String(createdBy),
        reason: String(reason),
      };

      // new_code
      const uiNewCode = (document.getElementById('merNewCode')?.value || '').trim();
      if (uiNewCode) payload.new_code = uiNewCode;

      // map_name
      const elMapNameNow = document.getElementById('merMapName');
      const uiMapName = String(elMapNameNow?.getAttribute('data-raw-value') || elMapNameNow?.value || '').trim();
      if (!equalScalar(uiMapName, baselineNow.map_name)) payload.map_name = uiMapName === '' ? null : uiMapName;

      // category/difficulty
      const uiCategory = __merGetRadioValue('merCategoryDropdown');
      if (!equalScalar(uiCategory, baselineNow.category)) payload.category = uiCategory === '' ? null : uiCategory;

      const uiDifficulty = __merGetRadioValue('merDifficultyDropdown');
      if (!equalScalar(uiDifficulty, baselineNow.difficulty)) payload.difficulty = uiDifficulty === '' ? null : uiDifficulty;

      // checkpoints
      const uiCheckpointsStr = String(document.getElementById('merCheckpoints')?.value ?? '').trim();
      if (!equalScalar(uiCheckpointsStr, baselineNow.checkpoints)) {
        const n = Number(uiCheckpointsStr);
        payload.checkpoints = uiCheckpointsStr === '' ? null : (Number.isFinite(n) ? Math.trunc(n) : null);
      }

      // switches
      const uiOfficial = getSwitch('merOfficialSwitch');
      const uiHidden   = getSwitch('merHiddenSwitch');
      const uiArchived = getSwitch('merArchivedSwitch');

      if (uiOfficial !== null && uiOfficial !== baselineNow.official) payload.official = uiOfficial;
      if (uiHidden   !== null && uiHidden   !== baselineNow.hidden)   payload.hidden   = uiHidden;
      if (uiArchived !== null && uiArchived !== baselineNow.archived) payload.archived = uiArchived;

      // mechanics/restrictions
      const uiMechanics = __merGetCheckboxValues('merMechanicsDropdown');
      if (!equalArray(uiMechanics, baselineNow.mechanics)) payload.mechanics = uiMechanics.length ? uiMechanics : null;

      const uiRestrictions = __merGetCheckboxValues('merRestrictionsDropdown');
      if (!equalArray(uiRestrictions, baselineNow.restrictions)) payload.restrictions = uiRestrictions.length ? uiRestrictions : null;

      const uiTags = __merGetCheckboxValues('merTagsDropdown');
      if (!equalArray(uiTags, baselineNow.tags)) payload.tags = uiTags.length ? uiTags : null;

      // title/description
      const uiTitle = (document.getElementById('merTitle')?.value || '').trim();
      if (!equalScalar(uiTitle, baselineNow.title)) payload.title = uiTitle === '' ? null : uiTitle;

      const uiDesc = (document.getElementById('merDescription')?.value || '').trim();
      if (!equalScalar(uiDesc, baselineNow.description)) payload.description = uiDesc === '' ? null : uiDesc;

      // custom_banner
      const uiBanner = (document.getElementById('merCustomBanner')?.value || '').trim();
      if (!equalScalar(uiBanner, baselineNow.custom_banner)) payload.custom_banner = uiBanner === '' ? null : uiBanner;

      // medals
      const uiGoldStr = (document.getElementById('merMedalGold')?.value || '').trim();
      const uiSilverStr = (document.getElementById('merMedalSilver')?.value || '').trim();
      const uiBronzeStr = (document.getElementById('merMedalBronze')?.value || '').trim();

      const medalsChanged =
        !equalScalar(uiGoldStr, baselineNow.medals.gold) ||
        !equalScalar(uiSilverStr, baselineNow.medals.silver) ||
        !equalScalar(uiBronzeStr, baselineNow.medals.bronze);

      if (medalsChanged) {
        const g = __merReadNumber(uiGoldStr);
        const s = __merReadNumber(uiSilverStr);
        const b = __merReadNumber(uiBronzeStr);
        payload.medals = (g == null && s == null && b == null) ? null : { gold: g, silver: s, bronze: b };
      }

      // creators
      const stateList = Array.isArray(overlay?.__merCreatorsState?.list) ? overlay.__merCreatorsState.list : [];
      const uiCreators = stateList
        .map((c) => ({ id: toSafeId(String(c.id || '').trim()), is_primary: !!c.is_primary }))
        .filter((c) => String(c.id).trim().length > 0);

      const baseCreatorsNorm = normalizeCreators(baselineNow.creators).map((c) => ({
        id: toSafeId(String(c.id).trim()),
        is_primary: !!c.is_primary,
      }));

      const sameCreators =
        baseCreatorsNorm.length === uiCreators.length &&
        baseCreatorsNorm.every((c, i) => String(c.id) === String(uiCreators[i].id) && !!c.is_primary === !!uiCreators[i].is_primary);

      if (!sameCreators) payload.creators = uiCreators.length ? uiCreators : null;

      // warn
      const keys = Object.keys(payload);
      if (keys.length <= 3) {
        __merWarn(
          (typeof t === 'function' && t('map_edit_request.no_changes') && t('map_edit_request.no_changes') !== 'map_edit_request.no_changes')
            ? t('map_edit_request.no_changes')
            : 'No changes detected.'
        );
        return;
      }

      // ---------- send ----------
      try {
        sendBtn.disabled = true;
        sendBtn.classList.add(...String('opacity-70').trim().split(/\s+/).filter(Boolean), ...String('cursor-not-allowed').trim().split(/\s+/).filter(Boolean));

        const endpoint = (optsNow.endpoint || '/api/maps/map-edits');
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'same-origin',
        });

        const contentType = resp.headers.get('content-type') || '';
        const data = contentType.includes('application/json') ? await resp.json() : await resp.text();

        if (!resp.ok) {
          __merErr(__merFormatApiError(data, resp.status));
          return;
        }

        if (typeof showConfirmationMessage === 'function') {
          showConfirmationMessage((typeof t === 'function' ? (t('map_edit_request.sent') || 'Map edit request sent') : 'Map edit request sent'));
        } else {
          toast((typeof t === 'function' ? (t('map_edit_request.sent') || 'Map edit request sent') : 'Map edit request sent'), 'ok');
        }

        const autoClose = optsNow.autoClose ?? true;
        if (autoClose) setTimeout(() => overlay.__merClose?.(), 700);
      } catch (e) {
        __merErr(e?.message || 'Network error');
      } finally {
        sendBtn.disabled = false;
        sendBtn.classList.remove(...String('opacity-70').trim().split(/\s+/).filter(Boolean), ...String('cursor-not-allowed').trim().split(/\s+/).filter(Boolean));
      }
    };

    overlay.__merMounted = overlay.__merMounted || {};
    overlay.__merMounted.send = true;
  }

  setTimeout(() => {
    try { document.getElementById('merReason')?.focus?.(); } catch {}
  }, 0);
}

function ensureEditVerifResultsContainer() {
  const panel = document.querySelector('[data-subpanel="verif-edits"]');
  if (!panel) return null;

  let box = panel.querySelector('#editVerifResults');
  if (!box) {
    box = document.createElement('div');
    box.id = 'editVerifResults';
    box.className = 'space-y-4 max-h-[70vh] overflow-y-auto pr-1';
    const article = panel.querySelector('article');
    article?.insertAdjacentElement('afterend', box);
  } else {
    box.classList.add(...String('max-h-[70vh]').trim().split(/\s+/).filter(Boolean), ...String('overflow-y-auto').trim().split(/\s+/).filter(Boolean), ...String('pr-1').trim().split(/\s+/).filter(Boolean));
  }
  return box;
}

function getResolvedByForEdits() {
  if (MOD_USER_ID) return MOD_USER_ID;
  const input = document.getElementById('editResolvedByInput');
  return getUserIdFrom(input);
}

function __editFormatDateTime(v) {
  const s = String(v ?? '').trim();
  if (!s) return '';
  try {
    const d = new Date(s);
    if (!Number.isFinite(d.getTime())) return s;
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return s;
  }
}

function __editNormalizeChange(c) {
  if (!c || typeof c !== 'object') return { field: 'change', from: '', to: '' };

  const field =
    c.field ?? c.key ?? c.name ?? c.path ?? c.property ?? c.type ?? c.kind ?? 'change';

  const from =
    c.old_value ?? c.oldValue ?? c.from ?? c.old ?? c.before ?? c.prev ?? c.previous ?? '';

  const to =
    c.new_value ?? c.newValue ?? c.to ?? c.new ?? c.after ?? c.next ?? c.updated ?? '';

  return { field: String(field), from, to };
}

function __editParseBoolLike(v) {
  if (v == null) return null;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;

  const s = String(v).trim().toLowerCase();
  if (['true', '1', 'yes', 'y', 'on'].includes(s)) return true;
  if (['false', '0', 'no', 'n', 'off'].includes(s)) return false;

  // common API renderings
  if (s === 'not set' || s === 'n/a' || s === 'na' || s === '') return null;
  return null;
}

function __editTextBlock(text) {
  const s = String(text ?? '').trim();
  if (!s || /^not set$/i.test(s)) return `<span class="text-zinc-600 dark:text-zinc-500">—</span>`;
  return `<div class="rounded-lg bg-zinc-900/3 dark:bg-white/5 px-2.5 py-1.5 text-[13px] text-zinc-900 dark:text-zinc-100 ring-1 ring-zinc-300/60 dark:ring-white/10 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">${escapeHtml(s)}</div>`;
}

function __editChipList(text) {
  const s = String(text ?? '').trim();
  if (!s || /^not set$/i.test(s)) return `<span class="text-zinc-600 dark:text-zinc-500">—</span>`;

  // Split on commas (good enough for mechanics/restrictions)
  const items = s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

  if (!items.length) return `<span class="text-zinc-600 dark:text-zinc-500">—</span>`;

  const max = 14;
  const chips = items.slice(0, max).map((it) =>
    `<span class="inline-flex items-center rounded-full border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 px-2 py-0.5 text-[11px] text-zinc-900 dark:text-white/85">${escapeHtml(it)}</span>`
  );

  const more = items.length > max
    ? `<span class="text-[11px] text-zinc-600 dark:text-zinc-400">+${items.length - max}</span>`
    : '';

  return `<div class="flex flex-wrap gap-1.5">${chips.join('')}${more}</div>`;
}

function __editBannerPreview(url) {
  const u = String(url ?? '').trim();
  if (!u || /^not set$/i.test(u)) return `<span class="text-zinc-600 dark:text-zinc-500">—</span>`;

  if (!/^https?:\/\//i.test(u)) return __editTextBlock(u);

  return `
    <div class="flex items-center gap-3 min-w-0">
      <div class="h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-200/80 dark:border-white/10 bg-black/20">
        <img src="${escapeHtml(u)}" alt="" class="h-full w-full object-cover cursor-pointer" data-enlarge="${escapeHtml(u)}">
      </div>
      <div class="min-w-0">
        <a href="${escapeHtml(u)}" target="_blank" class="text-xs underline decoration-dotted text-zinc-800 dark:text-zinc-200 hover:opacity-80 break-all">${escapeHtml(u)}</a>
        <div class="mt-1 text-[11px] text-zinc-600 dark:text-zinc-500">click image to enlarge</div>
      </div>
    </div>
  `;
}

function __editValueHtml(field, value) {
  const f = String(field ?? '').trim();
  const fLower = f.toLowerCase();
  const raw = value == null ? '' : String(value);
  const s = raw.trim();

  if (!s || /^not set$/i.test(s) || s === 'N/A') return `<span class="text-zinc-600 dark:text-zinc-500">—</span>`;

  // common boolean flags
  if (/(^|\b)(official|hidden|archived)(\b|$)/.test(fLower)) {
    const b = __editParseBoolLike(s);
    if (b !== null) return boolChip(b);
  }

  // special lists
  if (fLower.includes('mechanic')) return __editChipList(s);
  if (fLower.includes('restriction')) return __editChipList(s);

  // banner
  if (fLower.includes('banner')) return __editBannerPreview(s);

  // difficulty
  if (fLower.includes('difficulty')) {
    const dotCls = (typeof difficultyDotClass === 'function')
      ? difficultyDotClass(s)
      : (String(s).toLowerCase().startsWith('easy') ? 'bg-emerald-400'
        : String(s).toLowerCase().startsWith('medium') ? 'bg-yellow-400'
        : String(s).toLowerCase().startsWith('very hard') ? 'bg-orange-500'
        : String(s).toLowerCase().startsWith('hard') ? 'bg-orange-400'
        : String(s).toLowerCase().startsWith('extreme') ? 'bg-red-500'
        : String(s).toLowerCase().startsWith('hell') ? 'bg-rose-500'
        : 'bg-zinc-400');

    return `
      <span class="inline-flex items-center gap-2">
        <span class="h-2 w-2 rounded-full ${dotCls}"></span>
        ${decorateValue('difficulty', s)}
      </span>
    `;
  }

  // numbers / ids / urls
  if (s.length > 90) return __editTextBlock(s);

  // code
  if (fLower === 'code' || fLower.includes(' code')) return monoChip(s);

  // creators
  if (fLower.includes('creator')) return __editTextBlock(s);

  return decorateValue(fLower.replace(/\s+/g, '_'), s);
}

function summarizeChanges(changes) {
  const list = Array.isArray(changes) ? changes : [];
  if (!list.length) return `<div class="text-xs text-zinc-600 dark:text-zinc-400">No change details.</div>`;

  const header = `
    <div class="grid grid-cols-12 gap-3 px-3 py-2 text-[11px] uppercase tracking-wide text-zinc-600 dark:text-zinc-400 bg-zinc-900/3 dark:bg-white/5">
      <div class="col-span-12 sm:col-span-3">Field</div>
      <div class="col-span-12 sm:col-span-4">Old</div>
      <div class="col-span-12 sm:col-span-5">New</div>
    </div>
  `;

  const maxRows = 40;
  const rows = list.slice(0, maxRows).map((c) => {
    const { field, from, to } = __editNormalizeChange(c);
    const f = String(field || 'change');

    return `
      <div class="grid grid-cols-12 gap-3 px-3 py-2 border-t border-zinc-200/80 dark:border-white/10 hover:bg-zinc-900/3 dark:bg-white/5 transition min-w-0">
        <div class="col-span-12 sm:col-span-3 min-w-0">
          <div class="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200 break-words [overflow-wrap:anywhere]">${escapeHtml(f)}</div>
        </div>
        <div class="col-span-12 sm:col-span-4 min-w-0">
          ${__editValueHtml(f, from)}
        </div>
        <div class="col-span-12 sm:col-span-5 min-w-0">
          ${__editValueHtml(f, to)}
        </div>
      </div>
    `;
  });

  const more = list.length > maxRows
    ? `<div class="px-3 py-2 text-xs text-zinc-600 dark:text-zinc-500 border-t border-zinc-200/80 dark:border-white/10">Showing ${maxRows} / ${list.length} changes.</div>`
    : '';

  return `
    <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-black/20 overflow-hidden min-w-0">
      ${header}
      ${rows.join('')}
      ${more}
    </div>
  `;
}

function renderEditRequestCard({ row, submission }) {
  const rid = String(row?.id ?? submission?.id ?? '').trim();
  const code = String(submission?.code ?? row?.code ?? '').trim();
  const mapName = String(submission?.map_name ?? row?.map_name ?? '').trim();
  const difficulty = String(submission?.difficulty ?? row?.difficulty ?? '').trim();

  const reason = String(submission?.reason ?? row?.reason ?? '').trim();
  const createdAtRaw = submission?.created_at ?? row?.created_at ?? '';
  const createdAt = __editFormatDateTime(createdAtRaw);

  const submitterName = String(submission?.submitter_name ?? row?.submitter_name ?? '').trim();
  const submitterId = submission?.submitter_id ?? row?.submitter_id ?? row?.created_by ?? '';
  const messageId = submission?.message_id ?? row?.message_id ?? '';

  const changes = submission?.changes ?? row?.changes ?? null;

  const wrap = document.createElement('article');
  wrap.className =
    'rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 p-4 ring-1 ring-white/5 relative pb-16 min-w-0';
  wrap.dataset.editId = rid;

  wrap._editRow = row ?? null;
  wrap._editSubmission = submission ?? null;

  const badge = `
    <span class="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-200 ring-1 ring-amber-400/20">
      <span class="h-1.5 w-1.5 rounded-full bg-amber-400"></span> Pending
    </span>`;

  const difficultyDot = difficulty ? __editValueHtml('difficulty', difficulty) : '';

  wrap.innerHTML = `
    <div class="flex items-start justify-between gap-3 min-w-0">
      <div class="min-w-0">
        <h4 class="font-semibold text-lg min-w-0 break-words [overflow-wrap:anywhere]">Edit request #${escapeHtml(rid || '?')}</h4>
        <div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 min-w-0">
          <span class="inline-flex items-center gap-2">
            <span class="text-zinc-600 dark:text-zinc-500">code</span> ${monoChip(code || '—')}
          </span>
          ${mapName ? `<span class="inline-flex items-center gap-2"><span class="text-zinc-600 dark:text-zinc-500">map</span> ${decorateValue('map_name', mapName)}</span>` : ''}
          ${difficulty ? `<span class="inline-flex items-center gap-2"><span class="text-zinc-600 dark:text-zinc-500">difficulty</span> ${difficultyDot}</span>` : ''}
        </div>
      </div>
      <div class="flex items-end flex-col gap-2">
        ${badge}
        ${createdAt ? `<div class="text-[11px] text-zinc-600 dark:text-zinc-500">${escapeHtml(createdAt)}</div>` : ''}
      </div>
    </div>

    <div class="mt-3 grid gap-1.5 min-w-0">
      ${submitterName || submitterId ? kvRow('submitter', `${submitterName || ''}${submitterId ? ` (${submitterId})` : ''}`) : ''}
      ${messageId ? kvRow('message_id', String(messageId)) : ''}
      ${reason ? `
        <div class="mt-2 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 p-3">
          <div class="text-[11px] uppercase tracking-wide text-zinc-600 dark:text-zinc-400">Reason</div>
          <div class="mt-1 text-sm text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">${escapeHtml(reason)}</div>
        </div>
      ` : ''}
    </div>

    <div class="mt-4 min-w-0">
      <div class="flex items-center justify-between gap-3 mb-2">
        <div class="text-xs text-zinc-600 dark:text-zinc-400">Changes <span class="text-zinc-600 dark:text-zinc-500">(${Array.isArray(changes) ? changes.length : 0})</span></div>
        <div class="text-[11px] text-zinc-600 dark:text-zinc-500">old → new</div>
      </div>
      <div class="min-w-0">${summarizeChanges(changes)}</div>
    </div>

    <div class="absolute bottom-4 right-4 flex flex-wrap items-center gap-2 z-10">
      <button class="btn-edit-view cursor-pointer rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 text-zinc-800 dark:text-zinc-200 px-3 py-1.5 text-sm font-medium hover:bg-zinc-900/5 dark:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30">
        View JSON
      </button>
      <button class="btn-edit-accept cursor-pointer rounded-lg bg-emerald-500 text-zinc-900 dark:text-white px-3 py-1.5 text-sm font-semibold hover:bg-emerald-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30">
        Accept
      </button>
      <button class="btn-edit-reject cursor-pointer rounded-lg bg-rose-500 text-zinc-900 dark:text-white px-3 py-1.5 text-sm font-semibold hover:bg-rose-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30">
        Reject
      </button>
    </div>
  `;

  return wrap;
}

async function handleGetPendingEditRequests() {
  const resultsBox = ensureEditVerifResultsContainer();
  if (resultsBox) resultsBox.innerHTML = `<div class="text-sm text-zinc-600 dark:text-zinc-400">Loading queue…</div>`;

  const { ok, status, url, data } = await http('GET', `${API_MODS}/maps/map-edits/pending`);
  logActivity({ title: 'Pending edit requests', method: 'GET', url, ok, status, data });

  if (!ok) {
    toast('Failed to load edit queue', 'err');
    if (resultsBox) resultsBox.innerHTML = `<div class="text-sm text-zinc-600 dark:text-zinc-400">Failed to load.</div>`;
    return;
  }

  const rows = Array.isArray(data) ? data : [];
  if (!rows.length) {
    if (resultsBox) resultsBox.innerHTML = `<div class="text-sm text-zinc-600 dark:text-zinc-400">Queue is empty.</div>`;
    toast('No pending edit requests', 'ok');
    return;
  }

  const limit = 25;
  const subset = rows.slice(0, limit);
  const cards = [];

  for (const row of subset) {
    const editId = String(row?.id ?? '').trim();
    if (!editId) continue;

    const sub = await http('GET', `${API_MODS}/maps/map-edits/${encodeURIComponent(editId)}/submission`);
    logActivity({
      title: `Edit submission ${editId}`,
      method: 'GET',
      url: sub.url,
      ok: sub.ok,
      status: sub.status,
      data: sub.data,
    });

    cards.push(renderEditRequestCard({ row, submission: sub.ok ? sub.data : null }));
  }

  if (resultsBox) {
    resultsBox.innerHTML = '';
    cards.forEach((c) => resultsBox.appendChild(c));
    if (rows.length > limit) {
      const note = document.createElement('div');
      note.className = 'text-xs text-zinc-600 dark:text-zinc-500';
      note.textContent = `Showing ${limit} / ${rows.length}.`;
      resultsBox.appendChild(note);
    }
  }

  toast('Edit queue loaded', 'ok');
}

// ———————————————————————————————————————————————————————————————
// LOOTBOX
function showConfirmActiveKeyType() {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className =
      'fixed inset-0 z-[350] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4';
    overlay.innerHTML = `
      <div class="w-full max-w-md rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl ring-1 ring-zinc-300/60 dark:ring-white/10">
        <div class="px-4 py-3 border-b border-zinc-200/80 dark:border-white/10">
          <h3 class="font-semibold text-sm">Confirm change</h3>
        </div>
        <div class="p-4 space-y-4">
          <p class="text-sm text-zinc-800 dark:text-zinc-200">Are you sure you want to modify the global active key type ?</p>
          <div class="flex justify-end gap-2">
            <button class="btn-confirm cursor-pointer rounded-lg bg-emerald-500 text-zinc-900 dark:text-white px-3 py-1.5 text-sm font-semibold hover:bg-emerald-400">I know what I'm doing</button>
            <button class="btn-cancel cursor-pointer rounded-lg bg-rose-500 text-zinc-900 dark:text-white px-3 py-1.5 text-sm font-semibold hover:bg-rose-400">Cancel</button>
          </div>
        </div>
      </div>
    `;
    appendOverlay(overlay);


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

const MAP_TAG_OPTIONS = ['Other Heroes', 'XP Based', 'Custom Grav/Speed'];
// Expose for other modules / safety
try { window.MAP_TAG_OPTIONS = MAP_TAG_OPTIONS; } catch {}

function ddBtn(container) {
  return container?.querySelector('[data-dd-btn]');
}
function ddList(container) {
  return container?.querySelector('[data-dd-list]');
}
function ddHide(list) {
  list?.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
}
function ddShow(list) {
  list?.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
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
      ? 'flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 cursor-pointer hover:bg-zinc-900/5 dark:bg-white/10'
      : 'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-900/3 dark:bg-white/5 cursor-pointer';
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
      'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-900/3 dark:bg-white/5 cursor-pointer';
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
      placeholder?.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
      showPreview(f);
    }
  });
  drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    drop.classList.add(...String('ring-2').trim().split(/\s+/).filter(Boolean), ...String('ring-emerald-500/60').trim().split(/\s+/).filter(Boolean));
  });
  drop.addEventListener('dragleave', () => drop.classList.remove(...String('ring-2').trim().split(/\s+/).filter(Boolean), ...String('ring-emerald-500/60').trim().split(/\s+/).filter(Boolean)));
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.classList.remove(...String('ring-2').trim().split(/\s+/).filter(Boolean), ...String('ring-emerald-500/60').trim().split(/\s+/).filter(Boolean));
    const f = e.dataTransfer.files?.[0];
    if (f) {
      window.customBannerFile = f;
      placeholder?.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
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
    fetchStrings('/api/autocomplete/map-mechanics'),
    fetchStrings('/api/autocomplete/map-restrictions'),
  ]);
  buildCheckboxDropdown('mechanicsDropdown', mech, 'Select mechanics');
  buildCheckboxDropdown('restrictionsDropdown', rest, 'Select restrictions');
  buildCheckboxDropdown('tagsDropdown', MAP_TAG_OPTIONS, 'Select tags');

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
  label.classList.add(...String('editing').trim().split(/\s+/).filter(Boolean));

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
      'w-full max-w-full min-w-0 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 shadow-lg ring-1 ring-zinc-300/60 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 resize-y';
  } else if (field === 'metaCheckpoints') {
    input = document.createElement('input');
    input.type = 'number';
    input.className =
      'w-28 max-w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 shadow-lg ring-1 ring-zinc-300/60 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60';
  } else {
    input = document.createElement('input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.className =
      'min-w-[12rem] max-w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 shadow-lg ring-1 ring-zinc-300/60 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60';
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
    'inline-flex items-center gap-1 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 text-zinc-800 dark:text-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-900/5 dark:bg-white/10';

  const inputWrap = document.createElement('div');
  inputWrap.className = 'relative flex-1 min-w-[12rem] max-w-full';
  inputWrap.appendChild(input);

  const buttonsBox = document.createElement('div');
  buttonsBox.className = 'inline-edit-buttons flex flex-wrap items-center gap-2';
  buttonsBox.appendChild(saveBtn);
  buttonsBox.appendChild(cancelBtn);

  const container = document.createElement('div');
  container.className =
    'inline-edit-container mt-2 w-full max-w-full flex flex-wrap items-start gap-2 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 px-2.5 py-2 ring-1 ring-white/5';
  container.appendChild(inputWrap);
  container.appendChild(buttonsBox);

  const isCreator = field === 'metaCreatorMain' || field === 'metaCreatorSecond';
  const rowToHide = isCreator
    ? editBtnEl?.closest('.main-creator-row, .secondary-creator-row') || hostRow
    : null;

  if (rowToHide) {
    rowToHide.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
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
      rowToHide.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
    } else {
      label.style.display = '';
      if (editBtnEl) editBtnEl.style.display = '';
    }
    label.classList.remove(...String('editing').trim().split(/\s+/).filter(Boolean));
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
    ph?.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
  } else {
    ph?.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
  }
}

async function initSearchPanel() {
  const panel = document.querySelector('[data-subpanel="maps-search"]');
  if (!panel || panel.dataset.inited === '1') return;
  panel.dataset.inited = '1';

  buildRadioDropdown('s-difficultyDropdown', DIFFICULTY_FINE_OPTIONS, 'Select difficulty');
  buildRadioDropdown('s-categoryDropdown', CATEGORY_OPTIONS, 'Select category');

  const [mech, rest] = await Promise.all([
    fetchStrings('/api/autocomplete/map-mechanics'),
    fetchStrings('/api/autocomplete/map-restrictions'),
  ]);
  buildCheckboxDropdown('s-mechanicsDropdown', mech, 'Select mechanics');
  buildCheckboxDropdown('s-restrictionsDropdown', rest, 'Select restrictions');
  buildCheckboxDropdown('s-tagsDropdown', MAP_TAG_OPTIONS, 'Select tags');
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
  ddCheckByValues(form.querySelector('#s-tagsDropdown'), item?.tags || item?.map_tags || []);

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

  form.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
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
      placeholder?.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
      showPreview(f);
    }
  });
  drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    drop.classList.add(...String('ring-2').trim().split(/\s+/).filter(Boolean), ...String('ring-emerald-500/60').trim().split(/\s+/).filter(Boolean));
  });
  drop.addEventListener('dragleave', () => drop.classList.remove(...String('ring-2').trim().split(/\s+/).filter(Boolean), ...String('ring-emerald-500/60').trim().split(/\s+/).filter(Boolean)));
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.classList.remove(...String('ring-2').trim().split(/\s+/).filter(Boolean), ...String('ring-emerald-500/60').trim().split(/\s+/).filter(Boolean));
    const f = e.dataTransfer.files?.[0];
    if (f) {
      window[stateKey] = f;
      placeholder?.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
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
    fetchStrings('/api/autocomplete/map-mechanics'),
    fetchStrings('/api/autocomplete/map-restrictions'),
  ]);
  buildCheckboxDropdown('u-mechanicsDropdown', mech, 'Select mechanics');
  buildCheckboxDropdown('u-restrictionsDropdown', rest, 'Select restrictions');
  buildCheckboxDropdown('u-tagsDropdown', MAP_TAG_OPTIONS, 'Select tags');

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
  ddCheckByValues(form.querySelector('#u-tagsDropdown'), item?.tags || item?.map_tags || []);

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
    form.querySelector('#u-bannerPlaceholder')?.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
  } else {
    form.querySelector('#u-bannerPlaceholder')?.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
  }

  const medals = item?.medals || null;
  setValue(form, '#u-medalGoldInput', medals?.gold ?? '');
  setValue(form, '#u-medalSilverInput', medals?.silver ?? '');
  setValue(form, '#u-medalBronzeInput', medals?.bronze ?? '');

  form.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
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
  label.classList.add(...String('editing').trim().split(/\s+/).filter(Boolean));

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
      'w-full max-w-full min-w-0 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 shadow-lg ring-1 ring-zinc-300/60 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 resize-y';
  } else if (suffix === 'metaCheckpoints') {
    input = document.createElement('input');
    input.type = 'number';
    input.className =
      'w-28 max-w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 shadow-lg ring-1 ring-zinc-300/60 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60';
  } else {
    input = document.createElement('input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.className =
      'min-w-[12rem] max-w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 shadow-lg ring-1 ring-zinc-300/60 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60';
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
    'inline-flex items-center gap-1 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 text-zinc-800 dark:text-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-900/5 dark:bg-white/10';

  const inputWrap = document.createElement('div');
  inputWrap.className = 'relative flex-1 min-w-[12rem] max-w-full';
  inputWrap.appendChild(input);

  const buttonsBox = document.createElement('div');
  buttonsBox.className = 'inline-edit-buttons flex flex-wrap items-center gap-2';
  buttonsBox.appendChild(saveBtn);
  buttonsBox.appendChild(cancelBtn);

  const container = document.createElement('div');
  container.className =
    'inline-edit-container mt-2 w-full max-w-full flex flex-wrap items-start gap-2 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 px-2.5 py-2';
  container.appendChild(inputWrap);
  container.appendChild(buttonsBox);

  const rowToHide =
    suffix === 'metaCreatorMain' || suffix === 'metaCreatorSecond'
      ? editBtnEl?.closest('.main-creator-row, .secondary-creator-row') || hostRow
      : null;

  if (rowToHide) {
    rowToHide.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
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
      rowToHide.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
    } else {
      label.style.display = '';
      if (editBtnEl) editBtnEl.style.display = '';
    }
    label.classList.remove(...String('editing').trim().split(/\s+/).filter(Boolean));
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
  document.getElementById('modUserId')?.value ??
  document.querySelector('meta[name="mod-user-id"]')?.content ??
  (typeof window !== 'undefined' && window.user_id != null ? String(window.user_id) : '')
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
    box.classList.add(...String('max-h-[70vh]').trim().split(/\s+/).filter(Boolean), ...String('overflow-y-auto').trim().split(/\s+/).filter(Boolean), ...String('pr-1').trim().split(/\s+/).filter(Boolean));
  }
  return box;
}

function kvRow(label, value, { rawHtml = false } = {}) {
  const shown = rawHtml ? value : decorateValue(label, value);
  return `
    <div class="grid grid-cols-3 gap-2 text-sm">
      <div class="col-span-1 text-zinc-600 dark:text-zinc-400">${escapeHtml(label)}</div>
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
  return `<span class="inline-block rounded-md bg-black/30 px-1.5 py-0.5 font-mono text-[12px] tracking-tight ring-1 ring-zinc-300/60 dark:ring-white/10">${escapeHtml(String(text))}</span>`;
}
function stringChip(text) {
  return `<span class="inline-block rounded-md bg-zinc-900/3 dark:bg-white/5 px-2 py-0.5 text-[13px] font-medium text-zinc-900 dark:text-zinc-100 ring-1 ring-zinc-300/60 dark:ring-white/10">${escapeHtml(String(text))}</span>`;
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
      <img src="${escapeHtml(src)}" alt="screenshot" class="max-w-full cursor-pointer max-h-[86vh] rounded-xl border border-zinc-200/80 dark:border-white/10 shadow-2xl object-contain">
      <div class="absolute -top-3 -right-3 flex gap-2">
        <a href="${escapeHtml(src)}" target="_blank" class="rounded-lg bg-white text-zinc-900 text-xs px-2 py-1 font-semibold hover:bg-zinc-100">Open</a>
        <button class="lb-close cursor-pointer rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 text-zinc-900 dark:text-white text-xs px-2 py-1 hover:bg-zinc-900/5 dark:bg-white/10">Close</button>
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
  appendOverlay(overlay);

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

// ——— Permissions
const CALIB_ALLOWED_USER_ID = "681391478605479948";
const AUTO_VERIFY_ALLOWED_USER_ID = "681391478605479948";

// ——— Auto Verify
const AUTO_VERIFY_USER_ID = "1120786151452717106";
import AutoVerifyWorkerUrl from "../components/auto-verify.worker.js?worker&url";

let _autoVerifyWorker = null;
function getAutoVerifyWorker() {
  if (_autoVerifyWorker) return _autoVerifyWorker;
  _autoVerifyWorker = new Worker(AutoVerifyWorkerUrl, { type: "module" });
  try { pushRoisToWorker(_autoVerifyWorker); } catch {}
  return _autoVerifyWorker;
}

function parseSec(v) {
  if (v == null) return null;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/* =========================
   RENDER SUBMISSION CARD
   ========================= */
function renderSubmissionCard(item) {
  const rid    = String(item?.id ?? '');
  const verId  = item?.verification_id == null ? '' : String(item.verification_id);
  const shot   = item?.screenshot ? String(item.screenshot) : '';
  const timeVal= item?.time == null ? '' : String(item.time);
  const codeVal= item?.code == null ? '' : String(item.code);

  const wrap = document.createElement('article');
  wrap.className =
    'rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 p-4 ring-1 ring-white/5 relative pb-16';
  wrap.dataset.recordId       = rid;
  wrap.dataset.verificationId = verId;
  wrap.dataset.screenshot     = shot;
  wrap.dataset.time           = timeVal;
  wrap.dataset.code           = codeVal;
  wrap.dataset.name           = item?.name ? String(item.name) : "";

  const imgHtml = shot
    ? `
      <div class="space-y-1">
        <button type="button" data-enlarge="${escapeHtml(shot)}"
                class="relative cursor-pointer group block overflow-hidden rounded-xl border border-zinc-200/80 dark:border-white/10 ring-1 ring-zinc-300/60 dark:ring-white/10 bg-black/20">
          <img src="${escapeHtml(shot)}" alt="screenshot"
               class="w-full h-full object-cover max-h-[240px] md:max-h-[360px] transition-transform duration-200 group-hover:scale-[1.02]">
          <span class="pointer-events-none absolute inset-0 rounded-xl ring-0 group-hover:ring-2 group-hover:ring-emerald-400/40"></span>
        </button>
        <div class="text-[11px] text-zinc-600 dark:text-zinc-400 text-right">
          <a href="${escapeHtml(shot)}" target="_blank" class="hover:underline decoration-dotted">Open original</a>
        </div>
      </div>
    `
    : `
      <div class="w-full h-[200px] md:h-[280px] rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 grid place-items-center text-xs text-zinc-600 dark:text-zinc-400">
        No screenshot
      </div>`;

  const meId = (typeof window.user_id !== "undefined" && window.user_id) ? String(window.user_id) : "";
  const canCalibrate = meId === CALIB_ALLOWED_USER_ID;
  const canAutoVerify  = meId === AUTO_VERIFY_ALLOWED_USER_ID;

  const calibrateBtnHtml = canCalibrate
    ? `
      <button class="btn-calibrate-ocr cursor-pointer rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 text-zinc-800 dark:text-zinc-200 px-3 py-1.5 font-medium hover:bg-zinc-900/5 dark:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
        Calibrate OCR
      </button>`
    : ``;

  const autoVerifyBtnHtml = canAutoVerify
  ? `
    <button class="btn-auto-verify cursor-pointer rounded-lg bg-emerald-700 text-zinc-900 dark:text-white px-3 py-1.5 font-semibold hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/40">
      Auto verify
    </button>`
  : `
    <button class="btn-auto-verify rounded-lg bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-3 py-1.5 font-semibold opacity-60 cursor-not-allowed" disabled
            title="Auto verify is restricted to specific moderators.">
      Auto verify
    </button>`;

  wrap.innerHTML = `
    <div class="flex flex-col md:flex-row items-stretch gap-5">
      <!-- DATA -->
      <div class="flex-1 order-1 space-y-3">
        <div class="flex items-start justify-between">
          <h4 class="font-semibold text-lg">Submission #${escapeHtml(rid)}</h4>
          <div class="text-xs text-zinc-600 dark:text-zinc-400">verification_id: ${decorateValue('verification_id', verId)}</div>
        </div>

        <div class="grid gap-1.5">
          ${kvRow('user_id',        item?.user_id == null ? '—' : String(item.user_id))}
          ${kvRow('time',           item?.time)}
          ${kvRow('code',           item?.code)}
          ${kvRow('map_name',       item?.map_name)}
          ${kvRow('difficulty',     item?.difficulty)}
          ${kvRow('name',           item?.name)}
          ${kvRow('also_known_as',  item?.also_known_as)}
          ${kvRow('verified',       boolChip(item?.verified), { rawHtml: true })}
          ${kvRow('completion',     boolChip(item?.completion), { rawHtml: true })}
          ${kvRow('inserted_at',    item?.inserted_at)}
          ${kvRow('hypothetical_rank',  item?.hypothetical_rank)}
          ${kvRow('hypothetical_medal', item?.hypothetical_medal)}
          ${kvRow('verified_by',    item?.verified_by == null ? '—' : String(item.verified_by))}
          ${kvRow('message_id',     item?.message_id == null ? '—' : String(item.message_id))}
          ${kvRow('suspicious',     boolChip(item?.suspicious), { rawHtml: true })}
          ${kvRow('video',          linkOrDash(item?.video), { rawHtml: true })}
        </div>
      </div>

      <!-- SCREENSHOT -->
      <div class="w-full md:w-[320px] order-2 md:mt-6">
        ${imgHtml}
      </div>
    </div>

    <!-- ACTIONS -->
    <div class="absolute bottom-4 right-4 flex flex-wrap items-center gap-2 z-10">
      <button class="btn-verify cursor-pointer rounded-lg bg-emerald-500 text-zinc-900 dark:text-white px-3 py-1.5 font-semibold hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40">
        Verify
      </button>

      ${autoVerifyBtnHtml}
      ${calibrateBtnHtml}

      <button class="btn-deny cursor-pointer rounded-lg bg-rose-500 text-zinc-900 dark:text-white px-3 py-1.5 font-semibold hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40">
        Deny
      </button>
    </div>
  `;

  return wrap;
}

/* =========================
   REMOVE CARD
   ========================= */
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
        container.innerHTML = `<div class="text-sm text-zinc-600 dark:text-zinc-400">Queue is empty.</div>`;
      }
    },
    { once: true }
  );
}


/* =========================
   REMOVE EDIT CARD
   ========================= */
function removeCardFromEditList(card) {
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
      if (container && !container.querySelector('[data-edit-id]')) {
        container.innerHTML = `<div class="text-sm text-zinc-600 dark:text-zinc-400">Queue is empty.</div>`;
      }
    },
    { once: true }
  );
}

/* =========================
   DENY DIALOG
   ========================= */
function showDenyDialog({ title = 'Deny submission', placeholder = 'Reason (optional)' } = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className =
      'fixed inset-0 z-[350] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4';

    overlay.innerHTML = `
      <div class="w-full max-w-md rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl ring-1 ring-zinc-300/60 dark:ring-white/10">
        <div class="flex items-center justify-between px-4 py-3 border-b border-zinc-200/80 dark:border-white/10">
          <h3 class="font-semibold text-sm">${title}</h3>
          <button class="btn-x cursor-pointer px-2 py-1 text-xs rounded-lg border border-zinc-200/80 dark:border-white/10 hover:bg-zinc-900/3 dark:bg-white/5">Close</button>
        </div>
        <div class="p-4 space-y-3">
          <label class="text-sm text-zinc-700 dark:text-zinc-300">Reason <span class="text-zinc-600 dark:text-zinc-500 text-xs">(optional)</span></label>
          <textarea rows="3" class="w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 dark:text-zinc-500 shadow-lg ring-1 ring-zinc-300/60 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500/60" placeholder="${placeholder}"></textarea>
          <div class="pt-1 flex justify-end gap-2">
            <button class="btn-cancel cursor-pointer rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 text-zinc-800 dark:text-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-900/5 dark:bg-white/10">Cancel</button>
            <button class="btn-confirm cursor-pointer rounded-lg bg-rose-500 text-zinc-900 dark:text-white px-3 py-1.5 text-sm font-semibold hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40">Deny</button>
          </div>
        </div>
      </div>
    `;

    appendOverlay(overlay);

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

    const onKey = (ev) => {
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
    };
    document.addEventListener('keydown', onKey, { once: true });
  });
}


/* =========================
   CLICK HANDLER (edit requests)
   ========================= */
document.addEventListener('click', async (e) => {
  const btnView = e.target.closest('.btn-edit-view');
  const btnAccept = e.target.closest('.btn-edit-accept');
  const btnReject = e.target.closest('.btn-edit-reject');
  if (!btnView && !btnAccept && !btnReject) return;

  const card = e.target.closest('[data-edit-id]');
  const editId = card?.dataset?.editId;
  if (!editId) return;

  if (btnView) {
    e.preventDefault();
    const payload = {
      row: card._editRow ?? null,
      submission: card._editSubmission ?? null,
    };
    showModal({
      title: `Edit request #${editId}`,
      subtitle: 'Row + submission view',
      bodyText: JSON.stringify(payload, null, 2),
    });
    return;
  }

  const resolved_by = getResolvedByForEdits();
  if (!isDigits(resolved_by)) {
    toast('Resolved by user_id is required (digits)', 'warn');
    return;
  }

  if (btnAccept) {
    e.preventDefault();
    const { ok, status, url, data } = await http(
      'PUT',
      `${API_MODS}/maps/map-edits/${encodeURIComponent(editId)}/resolve`,
      { body: { accepted: true, resolved_by: String(resolved_by) } }
    );

    logActivity({ title: `Resolve edit ${editId} (accept)`, method: 'PUT', url, ok, status, data });
    toast(ok ? 'Edit request accepted' : 'Failed', ok ? 'ok' : 'err');
    if (ok) removeCardFromEditList(card);
    return;
  }

  if (btnReject) {
    e.preventDefault();
    const dlg = await showDenyDialog({
      title: `Reject edit request #${editId}`,
      placeholder: 'Rejection reason (optional)',
    });
    if (dlg.cancelled) return;

    const { ok, status, url, data } = await http(
      'PUT',
      `${API_MODS}/maps/map-edits/${encodeURIComponent(editId)}/resolve`,
      {
        body: {
          accepted: false,
          resolved_by: String(resolved_by),
          rejection_reason: dlg.reason,
        },
      }
    );

    logActivity({ title: `Resolve edit ${editId} (reject)`, method: 'PUT', url, ok, status, data });
    toast(ok ? 'Edit request rejected' : 'Failed', ok ? 'ok' : 'err');
    if (ok) removeCardFromEditList(card);
    return;
  }
});

/* =========================
   CLICK HANDLER (verify/deny/auto)
   ========================= */
document.addEventListener('click', async (e) => {
  const btnAuto   = e.target.closest('.btn-auto-verify');
  const btnVerify = e.target.closest('.btn-verify');
  const btnDeny   = e.target.closest('.btn-deny');
  const btnCalib  = e.target.closest('.btn-calibrate-ocr');

  if (btnCalib) {
    e.preventDefault();
    const meId = (typeof window.user_id !== "undefined" && window.user_id) ? String(window.user_id) : "";
    if (meId !== CALIB_ALLOWED_USER_ID) {
      toast("Calibrate OCR is restricted to devs.", "warn");
      return;
    }
    const card = e.target.closest('[data-record-id]');
    const url = card?.dataset?.screenshot;
    if (!url) return toast("No screenshot", "warn");
    const rois = await openRoiEditor(url);
    if (rois) {
      saveRois(rois);
      pushRoisToWorker(getAutoVerifyWorker(), rois);
      console.group("[OCR] ROIs saved");
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        await img.decode();
        const W = img.naturalWidth, H = img.naturalHeight;
        const px = {};
        for (const k of Object.keys(rois)) {
          const [x1,y1,x2,y2] = rois[k];
          px[k] = [x1*W, y1*H, x2*W, y2*H].map(v => Math.round(v));
        }
        console.log("normalized:", rois);
        console.log("pixels:", px, "size:", { W, H });
      } catch {
        console.log("normalized:", rois);
      }
      console.groupEnd();
      toast("ROIs updated", "ok");
    }
    return;
  }

  if (!btnVerify && !btnDeny && !btnAuto) return;

  const card = e.target.closest('[data-record-id]');
  if (!card) return;

  // Auto verify
  if (btnAuto) {
    e.preventDefault();
    const meId = (typeof window.user_id !== "undefined" && window.user_id) ? String(window.user_id) : "";
    if (meId !== AUTO_VERIFY_ALLOWED_USER_ID) {
      toast("Auto verify is restricted to devs.", "warn");
      return;
    }
    return void autoVerifyCard(card);
  }

  // Manual verify / deny
  const record_id = card.dataset.recordId;
  const verified  = !!btnVerify;
  let reason = null;

  if (!verified && btnDeny) {
    const { cancelled, reason: r } = await showDenyDialog({ title: 'Deny completion' });
    if (cancelled) return;
    reason = (r ?? '').trim() || null;
  }

  if (verified) reason = null;

  if (!MOD_USER_ID) {
    toast('Missing moderator id (meta[name="mod-user-id"])', 'warn');
    return;
  }

  const body = { verified, verified_by: MOD_USER_ID, reason };

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

/* =========================
   AUTO VERIFY FLOW
   ========================= */
async function autoVerifyCard(card) {
  const record_id  = card?.dataset?.recordId;
  const code       = (card?.dataset?.code || "").toString();
  const time       = parseSec(card?.dataset?.time);
  const screenshot = (card?.dataset?.screenshot || "").toString();
  const mapName    = (card?.dataset?.name || "").toString();

  if (!record_id)   return toast("Missing record_id", "warn");
  if (!screenshot)  return toast("No screenshot to verify", "warn");
  if (!code || time == null) return toast("Missing code/time on card", "warn");

  const btn = card.querySelector(".btn-auto-verify");
  const original = btn?.textContent;
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Auto verifying…";
    btn.classList.add(...String("opacity-70").trim().split(/\s+/).filter(Boolean), ...String("cursor-wait").trim().split(/\s+/).filter(Boolean));
  }

  const w = getAutoVerifyWorker();
  pushRoisToWorker(w);

  const jobId = `${record_id}:${Date.now()}`;
  const payloadRaw = {
    screenshotUrl: screenshot,
    code,
    time: Number.isFinite(time) ? Number(time) : null,
    mapName,
    apiBase: (window.API_ROOT || window.X_API_ROOT || location.origin),
    debug: true
  };

  let msg = { op: "VERIFY", id: jobId, payload: payloadRaw };
  try { msg = structuredClone(msg); } catch { msg = JSON.parse(JSON.stringify(msg)); }

  const result = await new Promise((resolve) => {
    const onMsg = (e) => {
      const { op, id, result, error } = e.data || {};
      if (op !== "RESULT" || id !== jobId) return;
      w.removeEventListener("message", onMsg);
      resolve({ result, error });
    };
    w.addEventListener("message", onMsg);
    w.postMessage(msg);
  });

  if (btn) {
    btn.disabled = false;
    btn.textContent = original || "Auto verify";
    btn.classList.remove(...String("opacity-70").trim().split(/\s+/).filter(Boolean), ...String("cursor-wait").trim().split(/\s+/).filter(Boolean));
  }

  if (result.error) {
    logActivity({
      title: `Auto verify OCR (error) #${record_id}`,
      method: "WORKER",
      url: "auto-verify.worker",
      ok: false,
      status: "-",
      data: { error: result.error },
    });
    toast("Auto verify failed (load/OCR error)", "err");
    return;
  }

  const { verified, extracted, reasons } = result.result || {};
  logActivity({
    title: `Auto verify OCR #${record_id}`,
    method: "WORKER",
    url: "auto-verify.worker",
    ok: !!verified,
    status: verified ? "OK" : "NOK",
    data: { extracted, reasons },
  });

  if (!verified) {
    toast("Auto verify: mismatch", "warn");
    return;
  }

  const body = { verified: true, verified_by: AUTO_VERIFY_USER_ID, reason: "auto verify matched code & time" };
  const { ok, status, url, data } = await http(
    "PUT",
    `${API_MODS}/completions/${encodeURIComponent(record_id)}/verification`,
    { body }
  );

  logActivity({ title: "Verify completion (auto)", method: "PUT", url, ok, status, data });
  if (ok) { toast("Verified (auto)", "ok"); removeCardFromVerifList(card); }
  else { toast("Auto verify: API failed", "err"); }
}

/* =========================
   ROI STORAGE + EDITOR
   ========================= */
const ROI_LS_KEY = "gp_ocr_rois";

const DEFAULT_ROIS = {
  TOPLEFT:    [0.010, 0.020, 0.360, 0.300],
  BANNER:     [0.240, 0.230, 0.760, 0.380],
  TOPRIGHT:   [0.800, 0.170, 0.985, 0.470],
  BOTTOMLEFT: [0.070, 0.895, 0.260, 0.980],
};

function loadRois() {
  try { return { ...DEFAULT_ROIS, ...(JSON.parse(localStorage.getItem(ROI_LS_KEY)) || {}) }; }
  catch { return { ...DEFAULT_ROIS }; }
}
function saveRois(r) { localStorage.setItem(ROI_LS_KEY, JSON.stringify(r)); }
function pushRoisToWorker(worker, rois = loadRois()) {
  worker.postMessage({ op: "SET_ROIS", rois });
}

async function openRoiEditor(imageUrl) {
  return new Promise(async (resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-[500] bg-black/70 backdrop-blur-sm p-6 flex items-center justify-center";
    overlay.innerHTML = `
      <div class="relative bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-xl shadow-2xl p-4">
        <div class="text-sm text-zinc-700 dark:text-zinc-300 pb-2 flex items-center justify-between gap-4">
          <b>ROI Calibrator</b>
          <div class="space-x-2">
            <button id="roiReset"  class="px-2 py-1 rounded bg-zinc-900/5 dark:bg-white/10">Reset</button>
            <button id="roiCancel" class="px-2 py-1 rounded bg-zinc-900/5 dark:bg-white/10">Cancel</button>
            <button id="roiSave"   class="px-3 py-1 rounded bg-emerald-600 text-zinc-900 dark:text-white">Save</button>
          </div>
        </div>
        <div class="relative overflow-auto max-w-[90vw] max-h-[78vh]">
          <div id="roiStage" class="relative inline-block"></div>
        </div>
        <div class="pt-3 text-[11px] text-zinc-600 dark:text-zinc-400">Tip: drag to move, grab a side/corner to resize. Values are saved normalized (0..1).</div>
      </div>
    `;
    appendOverlay(overlay);


    const stage = overlay.querySelector("#roiStage");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    await img.decode();
    stage.style.width  = img.naturalWidth + "px";
    stage.style.height = img.naturalHeight + "px";
    stage.appendChild(img);

    const COLORS = { TOPLEFT:"#22d3ee", BANNER:"#a855f7", TOPRIGHT:"#ef4444", BOTTOMLEFT:"#10b981" };
    let rois = loadRois();
    const boxes = {};

    function addBox(name) {
      const d = document.createElement("div");
      d.className = "absolute select-none";
      d.style.boxShadow = `0 0 0 2px ${COLORS[name]} inset`;
      d.style.outline = `1px dashed ${COLORS[name]}55`;
      d.dataset.name = name;

      const label = document.createElement("div");
      label.textContent = name;
      label.style.position="absolute"; label.style.left="2px"; label.style.top="-18px";
      label.style.fontSize="11px"; label.style.color=COLORS[name];
      d.appendChild(label);

      const hs = ["n","s","e","w","ne","nw","se","sw"];
      hs.forEach(h=>{
        const hdl = document.createElement("div");
        hdl.dataset.handle=h;
        hdl.style.position="absolute"; hdl.style.width="10px"; hdl.style.height="10px";
        hdl.style.background=COLORS[name]; hdl.style.opacity="0.8"; hdl.style.borderRadius="2px";
        const pos = { n:["50%","-5px"], s:["50%","calc(100% - 5px)"], e:["calc(100% - 5px)","50%"], w:["-5px","50%"],
                      ne:["calc(100% - 5px)","-5px"], nw:["-5px","-5px"], se:["calc(100% - 5px)","calc(100% - 5px)"], sw:["-5px","calc(100% - 5px)"] };
        hdl.style.left = pos[h][0]; hdl.style.top = pos[h][1];
        hdl.style.transform = /n|s/.test(h) ? "translateX(-50%)" : /e|w/.test(h) ? "translateY(-50%)" : "";
        d.appendChild(hdl);
      });

      stage.appendChild(d);
      boxes[name] = d;
    }

    function placeFromRois() {
      const W = img.naturalWidth, H = img.naturalHeight;
      for (const k of Object.keys(COLORS)) {
        if (!boxes[k]) addBox(k);
        const [x1,y1,x2,y2] = rois[k];
        const d = boxes[k];
        d.style.left = (x1*W) + "px";
        d.style.top  = (y1*H) + "px";
        d.style.width  = Math.max(1,(x2-x1)*W) + "px";
        d.style.height = Math.max(1,(y2-y1)*H) + "px";
      }
    }

    let cur = null;
    stage.addEventListener("pointerdown", (ev)=>{
      const box = ev.target.closest("[data-name]");
      if (!box) return;
      cur = {
        box,
        name: box.dataset.name,
        startX: ev.clientX, startY: ev.clientY,
        handle: ev.target.dataset.handle || null
      };
      box.setPointerCapture(ev.pointerId);
      ev.preventDefault();
    });

    stage.addEventListener("pointermove", (ev)=>{
      if (!cur) return;
      const box = cur.box;
      const st = box.style;
      const dx = ev.clientX - cur.startX;
      const dy = ev.clientY - cur.startY;

      let left = parseFloat(st.left) || 0;
      let top  = parseFloat(st.top)  || 0;
      let width  = parseFloat(st.width)  || 0;
      let height = parseFloat(st.height) || 0;

      const h = cur.handle;
      if (!h) { left += dx; top += dy; }
      else {
        if (h.includes("e")) width  += dx;
        if (h.includes("s")) height += dy;
        if (h.includes("w")) { left += dx; width  -= dx; }
        if (h.includes("n")) { top  += dy; height -= dy; }
        width = Math.max(6, width);
        height= Math.max(6, height);
      }

      left  = Math.max(0, Math.min(left,  stage.clientWidth  - width));
      top   = Math.max(0, Math.min(top,   stage.clientHeight - height));

      st.left   = left + "px";
      st.top    = top  + "px";
      st.width  = width  + "px";
      st.height = height + "px";

      cur.startX = ev.clientX; cur.startY = ev.clientY;
    });

    stage.addEventListener("pointerup", ()=>{
      if (!cur) return;
      const W = img.naturalWidth, H = img.naturalHeight;
      const st = cur.box.style;
      const x = parseFloat(st.left), y = parseFloat(st.top),
            w = parseFloat(st.width), h = parseFloat(st.height);
      rois[cur.name] = [x/W, y/H, (x+w)/W, (y+h)/H];
      cur = null;
    });

    placeFromRois();

    overlay.querySelector("#roiReset").onclick  = () => { rois = { ...DEFAULT_ROIS }; placeFromRois(); };
    overlay.querySelector("#roiCancel").onclick = () => { overlay.remove(); resolve(null); };
    overlay.querySelector("#roiSave").onclick   = () => {
      saveRois(rois);
      overlay.remove();
      resolve(rois);
    };
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

// ———————————————————————————————————————————————————————————————
// Devs only
const TRANSLATION_FILES = [
  'gamemodes.json',
  'heroes.json',
  'values.json',
  'other.json',
  'maps.json',
  'localizedStrings.json',
  'customGameSettings.json',
  'constants.json',
  'actions.json',
];

async function handleClearFrameworksCache(form) {
  if (!form.confirm?.checked) {
    toast('Please tick the confirmation box', 'warn');
    return;
  }

  const okGo = await showConfirmDanger({
    title: 'Clear framework cache',
    message: 'This will delete the contents of public/framework-templates. Continue?',
    confirm: 'Yes, delete',
    cancel: 'Cancel',
  });
  if (!okGo) return;

  const { ok, status, url, data } = await http('DELETE', `${API_MODS}/cache/framework`);
  logActivity({ title: 'Clear cache – framework', method: 'DELETE', url, ok, status, data });
  toast(ok ? 'Framework cache cleared' : 'Deletion failed', ok ? 'ok' : 'err');
}

async function handleClearAvatarsCache(form) {
  if (!form.confirm?.checked) {
    toast('Please tick the confirmation box', 'warn');
    return;
  }

  const okGo = await showConfirmDanger({
    title: 'Clear avatar cache',
    message: 'This will delete the contents of storage/app/private/cache. Continue?',
    confirm: 'Yes, delete',
    cancel: 'Cancel',
  });
  if (!okGo) return;

  const { ok, status, url, data } = await http('DELETE', `${API_MODS}/cache/avatars`);
  logActivity({ title: 'Clear cache – avatars', method: 'DELETE', url, ok, status, data });
  toast(ok ? 'Avatar cache cleared' : 'Deletion failed', ok ? 'ok' : 'err');
}

async function handleClearTranslationsCache(form) {
  if (!form.confirm?.checked) {
    toast('Please tick the confirmation box', 'warn');
    return;
  }

  const okGo = await showConfirmDanger({
    title: 'Clear translations cache',
    message: `This will delete these files in public/translations:\n${TRANSLATION_FILES.join(', ')}\nContinue?`,
    confirm: 'Yes, delete',
    cancel: 'Cancel',
  });
  if (!okGo) return;

  const { ok, status, url, data } = await http('DELETE', `${API_MODS}/cache/translations`, {
    body: { files: TRANSLATION_FILES },
  });
  logActivity({ title: 'Clear cache – translations', method: 'DELETE', url, ok, status, data });
  toast(ok ? 'Translations cache cleared' : 'Deletion failed', ok ? 'ok' : 'err');
}


function showConfirmDanger({ title = 'Confirm', message = 'Are you sure?', confirm = 'Confirm', cancel = 'Cancel' } = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[350] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4';
    overlay.innerHTML = `
      <div class="w-full max-w-md rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl ring-1 ring-zinc-300/60 dark:ring-white/10">
        <div class="px-4 py-3 border-b border-zinc-200/80 dark:border-white/10">
          <h3 class="font-semibold text-sm">${title}</h3>
        </div>
        <div class="p-4 space-y-4">
          <p class="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">${message}</p>
          <div class="flex justify-end gap-2">
            <button class="btn-confirm cursor-pointer rounded-lg bg-rose-500 text-zinc-900 dark:text-white px-3 py-1.5 text-sm font-semibold hover:bg-rose-400">${confirm}</button>
            <button class="btn-cancel cursor-pointer rounded-lg bg-zinc-700 text-zinc-900 dark:text-white px-3 py-1.5 text-sm font-semibold hover:bg-zinc-600">${cancel}</button>
          </div>
        </div>
      </div>
    `;
    appendOverlay(overlay);


    const close = (val) => { overlay.remove(); resolve(val); };
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(false); });
    overlay.querySelector('.btn-cancel')?.addEventListener('click', () => close(false));
    overlay.querySelector('.btn-confirm')?.addEventListener('click', () => close(true));
    document.addEventListener('keydown', function onKey(ev) {
      if (ev.key === 'Escape') { close(false); document.removeEventListener('keydown', onKey); }
      if (ev.key === 'Enter') { close(true); document.removeEventListener('keydown', onKey); }
    }, { once: true });
  });
}

async function handleSetOverpyCommit(form) {
  const commit = (form.commit.value || '').trim();
  const checked = !!form.confirm?.checked;

  if (!/^[0-9a-f]{7,40}$/i.test(commit)) {
    toast('Invalid commit: use a 7–40 hex SHA', 'warn');
    return;
  }
  if (!checked) {
    toast('Please confirm the change', 'warn');
    return;
  }

  const currentEl = document.querySelector('#overpyCommitCurrent');
  const current = currentEl?.textContent?.trim() || 'unknown';

  const okGo = await showConfirmDanger({
    title: 'Set Overpy commit',
    message:
      `Current: ${current}\nNew:     ${commit}\n\n` +
      `This will update OVERPY_COMMIT in convertor.js.\nContinue?`,
    confirm: 'Yes, update',
    cancel: 'Cancel',
  });
  if (!okGo) return;

  const { ok, status, url, data } = await http('PATCH', `${API_MODS}/overpy-commit`, {
    body: {
      commit,
      confirm: true,
    },
  });

  logActivity({ title: 'Set Overpy commit', method: 'PATCH', url, ok, status, data });
  if (ok) {
    if (currentEl) currentEl.textContent = commit;
    toast('Overpy commit updated', 'ok');
  } else {
    toast('Update failed', 'err');
  }
}

async function fetchCurrentOverpyCommit() {
  const { ok, status, url, data } = await http('GET', `${API_MODS}/overpy-commit`);
  logActivity({ title: 'Get Overpy commit', method: 'GET', url, ok, status, data });
  if (!ok || !data?.commit) {
    toast('Failed to load current commit', 'err');
    return null;
  }
  return String(data.commit);
}

async function initOverpyCommitPanel() {
  const panel = document.querySelector('[data-subpanel="dev-overpy-commit"]');
  if (!panel || panel.dataset.inited === '1') return;
  panel.dataset.inited = '1';

  const currentEl = panel.querySelector('#overpyCommitCurrent');
  if (currentEl) {
    const cur = await fetchCurrentOverpyCommit();
    if (cur) currentEl.textContent = cur;
  }
}

async function initFrameworkVersionPanel() {
  const panel = document.querySelector('[data-subpanel="dev-framework-version"]');
  if (!panel || panel.dataset.inited === '1') return;
  panel.dataset.inited = '1';

  const currentEl = panel.querySelector('#frameworkVersionCurrent');
  if (currentEl) {
    const cur = await fetchCurrentFrameworkVersion();
    if (cur) currentEl.textContent = cur;
  }

  const form = panel.querySelector('#formSetFrameworkVersion');
  const btn  = panel.querySelector('#btnSetFrameworkVersion');
  if (!form || !btn) return;

  form.setAttribute('novalidate', '');
  form.addEventListener('invalid', (e) => e.preventDefault(), true);

  const versionInput = form.querySelector('input[name="version"]');
  if (versionInput) {
    versionInput.removeAttribute('pattern');
    versionInput.removeAttribute('required');

    versionInput.addEventListener('input', () => versionInput.setCustomValidity(''));

    versionInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); btn.click(); }
    });
  }

  btn.addEventListener('click', () => handleSetFrameworkVersion(form));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSetFrameworkVersion(form);
  });
}

async function fetchCurrentFrameworkVersion() {
  const { ok, status, url, data } = await http('GET', `${API_MODS}/framework-version`);
  logActivity({ title: 'Get framework version', method: 'GET', url, ok, status, data });
  if (!ok || !data?.version) {
    toast('Failed to load current framework version', 'err');
    return null;
  }
  return String(data.version);
}

async function handleSetFrameworkVersion(form) {
  const input = form.version;
  const version = (input.value || '').trim().toUpperCase();
  const checked = !!form.confirm?.checked;

  const VERSION_RE = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:[A-Z][0-9A-Z]*)?$/;

  input.setCustomValidity('');

  if (!VERSION_RE.test(version)) {
    const msg = 'Invalid version. Use X.Y.Z with an optional UPPERCASE suffix (e.g. 1.10.4, 1.10.4A, 1.10.4RC1).';
    input.setCustomValidity(msg);
    input.reportValidity();
    toast(msg, 'warn');
    return;
  }
  if (!checked) {
    toast('Please tick the confirmation box.', 'warn');
    return;
  }

  const currentEl = document.querySelector('#frameworkVersionCurrent');
  const current = currentEl?.textContent?.trim() || 'unknown';

  const okGo = await showConfirmDanger({
    title: 'Set framework version',
    message:
      `Current: ${current}\nNew:     ${version}\n\n` +
      `This will update the CDN URL used by convertor.js.\nContinue?`,
    confirm: 'Yes, update',
    cancel: 'Cancel',
  });
  if (!okGo) return;

  const { ok, status, url, data } = await http('PATCH', `${API_MODS}/framework-version`, {
    body: { version, confirm: true },
  });

  logActivity({ title: 'Set framework version', method: 'PATCH', url, ok, status, data });
  if (ok) {
    if (currentEl) currentEl.textContent = version;
    toast('Framework version updated', 'ok');
    form.confirm.checked = false;
  } else {
    const msg = data?.message || 'Update failed';
    toast(msg, 'err');
  }
}

// --- Mod UI ---
// - URL sync: ?tab=...&sub=...
// - Sidebar filter input
// - Command palette (Ctrl+K)
function initializeApp() {
  // If already initialized, destroy previous instance
  if (window.__modUiApp && typeof window.__modUiApp.destroy === 'function') {
    window.__modUiApp.destroy();
  }

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const tabsRoot = $('#modTabs');
  if (!tabsRoot) {
    window.__modUiApp = null;
    return null;
  }

  const state = {
    syncingFromUrl: false,
    entries: [],
    filtered: [],
    activeIndex: 0,
  };

  const escapeHtml = (s) =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  function getActiveTabId() {
    return $('#modTabs .mod-tab.active')?.dataset?.tab || 'users';
  }

  function getActivePanel(tabId = getActiveTabId()) {
    return document.querySelector(`.mod-panel[data-panel="${CSS.escape(tabId)}"]`);
  }

  function setHeader(tabId) {
    const label = $(`#modTabs .mod-tab[data-tab="${CSS.escape(tabId)}"]`)?.dataset?.tabLabel;
    const h = $('#modActiveTitle');
    if (h) h.textContent = label || tabId;
  }

  function setUrlState({ tab, sub } = {}, { replace = false } = {}) {
    const url = new URL(window.location.href);

    if (tab) url.searchParams.set('tab', tab);
    else url.searchParams.delete('tab');

    if (sub) url.searchParams.set('sub', sub);
    else url.searchParams.delete('sub');

    if (replace) history.replaceState({}, '', url);
    else history.pushState({}, '', url);
  }

  function activateTab(tabId) {
    const btn = $(`#modTabs .mod-tab[data-tab="${CSS.escape(tabId)}"]`);
    if (!btn) return false;
    btn.click();
    return true;
  }

  function activateSub(tabId, subId) {
    const ok = activateTab(tabId);
    if (!ok) return;
    requestAnimationFrame(() => {
      const panel = getActivePanel(tabId);
      const subBtn = panel?.querySelector(`.mod-subtab[data-subtab="${CSS.escape(subId)}"]`);
      subBtn?.click();
    });
  }

  function applyUrlState() {
    const sp = new URLSearchParams(window.location.search);
    const tab = sp.get('tab');
    const sub = sp.get('sub');

    state.syncingFromUrl = true;
    try {
      if (tab) activateTab(tab);
      setHeader(getActiveTabId());
      if (sub) activateSub(tab || getActiveTabId(), sub);
    } finally {
      // allow event loop to flush click handlers
      setTimeout(() => {
        state.syncingFromUrl = false;
      }, 0);
    }
  }

  // Initial header
  setHeader(getActiveTabId());

  // Prefill common user_id fields
  if (typeof MOD_USER_ID !== 'undefined' && MOD_USER_ID) {
    const createdBy = document.querySelector('input[name="created_by_user_id"]');
    if (createdBy && !createdBy.value) createdBy.value = MOD_USER_ID;

    const resolvedBy = document.getElementById('editResolvedByInput');
    if (resolvedBy) {
      if (!resolvedBy.value) resolvedBy.value = MOD_USER_ID;
      resolvedBy.readOnly = true;
      resolvedBy.setAttribute('aria-readonly', 'true');
      resolvedBy.classList.add(...String('cursor-not-allowed').trim().split(/\s+/).filter(Boolean));
    }
  }

  // Click -> URL sync
  const onDocClick = (e) => {
    const tabBtn = e.target.closest('#modTabs .mod-tab');
    if (tabBtn) {
      const tabId = tabBtn.dataset.tab;
      setHeader(tabId);
      if (!state.syncingFromUrl) setUrlState({ tab: tabId, sub: '' });
      return;
    }

    const subBtn = e.target.closest('.mod-subtab');
    if (subBtn) {
      const tabId = getActiveTabId();
      const subId = subBtn.dataset.subtab;
      if (!state.syncingFromUrl) setUrlState({ tab: tabId, sub: subId });
      return;
    }
  };
  document.addEventListener('click', onDocClick);

  // Back/forward -> restore
  const onPopState = () => applyUrlState();
  window.addEventListener('popstate', onPopState);

  // Sidebar filter (sections)
  const navSearch = $('#modNavSearch');
  let onNavInput = null;
  if (navSearch) {
    const run = () => {
      const q = String(navSearch.value || '').trim().toLowerCase();
      $$('#modTabs .mod-tab').forEach((b) => {
        const label = (b.dataset.tabLabel || b.textContent || '').toLowerCase();
(() => { const __obj = b; let __last; for (const __c of String('hidden').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, q && !label.includes(q)); return __last; })();
      });
    };
    onNavInput = () => run();
    navSearch.addEventListener('input', onNavInput, { passive: true });
    run();
  }

  // Scroll helpers
  const onScrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const onFocusActions = () => {
    const panel = getActivePanel();
    const first = panel?.querySelector('.mod-subtab') || panel;
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  $('#modScrollTop')?.addEventListener('click', onScrollTop);
  $('#modFocusActions')?.addEventListener('click', onFocusActions);

  // Command palette
  const cmdkRoot = $('#modCmdk');
  const cmdkInput = $('#modCmdkInput');
  const cmdkList = $('#modCmdkList');
  const cmdkClose = $('#modCmdkClose');

  function buildEntries() {
    const entries = [];
    // Tabs
    $$('#modTabs .mod-tab').forEach((b) => {
      const tabId = b.dataset.tab;
      const label = b.dataset.tabLabel || b.textContent.trim();
      if (tabId) entries.push({ kind: 'tab', tabId, label });

      const panel = document.querySelector(`.mod-panel[data-panel="${CSS.escape(tabId)}"]`);
      if (!panel) return;

      // Subtabs for tab
      panel.querySelectorAll('.mod-subtab').forEach((sb) => {
        const subId = sb.dataset.subtab;
        const subLabel = sb.textContent.trim();
        if (!subId) return;
        entries.push({ kind: 'sub', tabId, subId, label: `${label} / ${subLabel}` });
      });
    });

    return entries;
  }

  function renderCmdk() {
    if (!cmdkList) return;
    cmdkList.innerHTML = '';

    if (!state.filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-900/3 dark:bg-white/5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300';
      empty.textContent = 'No results';
      cmdkList.appendChild(empty);
      return;
    }

    state.filtered.slice(0, 60).forEach((it, idx) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className =
        'w-full cursor-pointer text-left rounded-xl border border-zinc-200/80 dark:border-white/10 px-3 py-2 text-sm transition ' +
        (idx === state.activeIndex ? 'bg-zinc-900/5 dark:bg-white/10' : 'bg-zinc-900/3 dark:bg-white/5 hover:bg-zinc-900/5 dark:bg-white/10');

      row.innerHTML = `
        <div class="flex items-center justify-between gap-3">
          <div class="font-semibold text-zinc-900 dark:text-zinc-100">${escapeHtml(it.label)}</div>
          <div class="text-[10px] text-zinc-600 dark:text-zinc-400">${it.kind === 'tab' ? 'Tab' : 'Tool'}</div>
        </div>
      `;

      row.addEventListener('click', () => openEntry(it));
      cmdkList.appendChild(row);
    });
  }

  function filterCmdk(q) {
    const s = String(q || '').trim().toLowerCase();
    state.filtered = !s ? state.entries.slice() : state.entries.filter((it) => it.label.toLowerCase().includes(s));
    state.activeIndex = 0;
    renderCmdk();
  }

  function closeCmdk() {
    if (!cmdkRoot) return;
    cmdkRoot.classList.add(...String('hidden').trim().split(/\s+/).filter(Boolean));
    cmdkRoot.setAttribute('aria-hidden', 'true');
  }

  function openEntry(it) {
    closeCmdk();
    state.syncingFromUrl = true;
    try {
      if (it.kind === 'tab') {
        activateTab(it.tabId);
        setUrlState({ tab: it.tabId, sub: '' });
      } else {
        activateSub(it.tabId, it.subId);
        setUrlState({ tab: it.tabId, sub: it.subId });
      }
    } finally {
      setTimeout(() => (state.syncingFromUrl = false), 0);
    }
  }

  function openCmdk() {
    if (!cmdkRoot) return;
    state.entries = buildEntries();
    cmdkRoot.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
    cmdkRoot.setAttribute('aria-hidden', 'false');
    if (cmdkInput) cmdkInput.value = '';
    filterCmdk('');
    setTimeout(() => cmdkInput?.focus(), 0);
  }

  // Open button
  const onOpenCmdkClick = () => openCmdk();
  $('#openCmdk')?.addEventListener('click', onOpenCmdkClick);

  // Close
  const onCmdkCloseClick = () => closeCmdk();
  cmdkClose?.addEventListener('click', onCmdkCloseClick);

  const onCmdkRootClick = (e) => {
    const panel = document.getElementById('modCmdkPanel');
    // close
    if (panel && !panel.contains(e.target) && !e.target.closest('#openCmdk')) closeCmdk();
  };
  cmdkRoot?.addEventListener('click', onCmdkRootClick);

  // Search / keyboard
  const onCmdkInput = () => filterCmdk(cmdkInput.value);
  cmdkInput?.addEventListener('input', onCmdkInput, { passive: true });

  const onKeydown = (e) => {
    // Ctrl/Cmd + K
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCmdk();
      return;
    }

    // When palette open
    if (!cmdkRoot || cmdkRoot.classList.contains('hidden')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeCmdk();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      state.activeIndex = Math.min(state.activeIndex + 1, Math.max(0, state.filtered.length - 1));
      renderCmdk();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      state.activeIndex = Math.max(state.activeIndex - 1, 0);
      renderCmdk();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const it = state.filtered[state.activeIndex];
      if (it) openEntry(it);
      return;
    }
  };
  document.addEventListener('keydown', onKeydown);

  // Apply URL state
  applyUrlState();

  // ---- destroy() for cleanup / re-init ----
  state.destroy = () => {
    document.removeEventListener('click', onDocClick);
    window.removeEventListener('popstate', onPopState);

    if (navSearch && onNavInput) navSearch.removeEventListener('input', onNavInput);

    $('#modScrollTop')?.removeEventListener('click', onScrollTop);
    $('#modFocusActions')?.removeEventListener('click', onFocusActions);

    $('#openCmdk')?.removeEventListener('click', onOpenCmdkClick);
    cmdkClose?.removeEventListener('click', onCmdkCloseClick);
    cmdkRoot?.removeEventListener('click', onCmdkRootClick);
    cmdkInput?.removeEventListener('input', onCmdkInput);

    document.removeEventListener('keydown', onKeydown);
  };

  window.__modUiApp = state;
  return state;
}

document.addEventListener('DOMContentLoaded', () => initializeApp(), { once: true });

