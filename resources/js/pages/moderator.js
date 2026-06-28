import { initUsersWorkspace } from './moderator/users-workspace.js';
import { initLootboxWorkspace } from './moderator/lootbox-workspace.js';
import { initLootboxSettings } from './moderator/lootbox-settings.js';
import { initMapWorkspace } from './moderator/maps-workspace.js';
import { initContentWorkspace } from './moderator/content-workspace.js';
import { initRecordsWorkspace } from './moderator/records-workspace.js';
import { initVerificationsWorkspace } from './moderator/verifications-workspace.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const API_MODS = '/api/mods';
const API_CONTENT_PUBLIC = '/api/content/movement-tech';
const API_CONTENT_MODS = `${API_MODS}/content/movement-tech`;
const API_TOURNAMENTS = '/api/tournaments';
const API_TOURNAMENTS_MODS = `${API_MODS}/tournaments`;
const asId = (input) => String(input?.value ?? '').trim();
const isDigits = (s) => /^\d+$/.test(String(s || ''));
const getBool = (id) => !!document.getElementById(id)?.checked;
const toBooleanValue = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'y', 'on', 'archive', 'archived'].includes(normalized)) return true;
    if (['false', '0', 'no', 'n', 'off', 'unarchive', 'unarchived', 'active', ''].includes(normalized)) return false;
  }
  return false;
};

const mapArchivedValue = (item) =>
  toBooleanValue(item?.archived ?? item?.is_archived ?? item?.status ?? item?.archive_status);

const PLAYTESTING_OPTIONS = [
  { value: 'Approved', text: 'Approved' },
  { value: 'In Progress', text: 'In Progress' },
  { value: 'Rejected', text: 'Rejected' },
];

//──────────────────────────────────────────────────────────────────────────────
// DEV ACCESS
//──────────────────────────────────────────────────────────────────────────────
const DEV_ALLOWLIST = new Set([
  "681391478605479948",
  "273775694008549376",
  "141372217677053952",
  "313459248942153729",
]);

const DEV_TABS = new Set(["devs", "store", "quests"]);

function getCurrentUserId() {
  const fromGlobals =
    window.user_id ?? window.userId ?? window.USER_ID ?? window.discord_user_id ?? "";
  const fromState = (typeof state !== "undefined") ? (state?.userId ?? "") : "";
  return String(fromState || fromGlobals || "").trim();
}

function isDevAllowed() {
  const uid = getCurrentUserId();
  return !!uid && DEV_ALLOWLIST.has(uid);
}

function gateDevSectionsUI() {
  const allowed = isDevAllowed();

  document.querySelectorAll('[data-dev-only="1"]').forEach((el) => {
    el.classList.toggle("hidden", !allowed);
  });

  return allowed;
}

function guardDevOnly(fn, { onDeny } = {}) {
  return async function guarded(...args) {
    if (!isDevAllowed()) {
      if (typeof onDeny === "function") onDeny();
      return;
    }
    return fn(...args);
  };
}

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
  String(s ?? '').replace(
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

const MOD_SECTION_META = {
  users: {
    kicker: 'Identity',
    summary: 'Inspect player profiles, manage Overwatch aliases, link fake accounts, and keep visible names consistent.',
    hideStats: true,
    stats: ['Support workflow', 'Discord identity', 'Alias hygiene'],
    hints: [
      'Start with Get user or Get Overwatch usernames when you only have a Discord id.',
      'Use Replace Overwatch names and Update names together after confirming the same profile.',
    ],
    cards: [
      { sub: 'users-get', title: 'Inspect a player', desc: 'Load the moderator profile before changing names or links.' },
      { sub: 'users-get-ow', title: 'Review aliases', desc: 'Check the current Overwatch names tied to a user.' },
      { sub: 'users-overwatch', title: 'Replace aliases', desc: 'Rewrite the alias set and choose the primary username.' },
      { sub: 'users-update', title: 'Update display names', desc: 'Patch global name and nickname after verification.' },
      { sub: 'users-link', title: 'Link fake account', desc: 'Attach a fake member to the real Discord user.' },
      { sub: 'users-create', title: 'Create fake member', desc: 'Create a placeholder member for legacy or imported records.' },
    ],
  },
  guides: {
    kicker: 'Guides',
    summary: 'Create, update, delete, and audit map guide links by map code and author.',
    stats: ['Map guides', 'Creator links', 'Maintenance'],
    hints: [
      'Fetch guides for a map code before editing or deleting a user guide.',
      'Create, edit, and delete operate on the same map-code/user relationship.',
    ],
    cards: [
      { sub: 'guides-get', title: 'Map guide list', desc: 'Load the current guide set for a map.' },
      { sub: 'guides-create', title: 'Create guide', desc: 'Attach a creator guide URL to a map.' },
      { sub: 'guides-edit', title: 'Edit guide', desc: 'Patch an existing guide for a specific user.' },
      { sub: 'guides-delete', title: 'Delete guide', desc: 'Remove a guide after checking author and map code.', danger: true },
    ],
  },
  content: {
    kicker: 'Knowledge base',
    summary: 'Maintain movement-tech categories, difficulties, and techniques as one structured content workflow.',
    hideStats: true,
    stats: ['Taxonomy', 'Technique editor', 'Ordering'],
    hints: [
      'Categories and difficulties are loaded automatically to feed technique dropdowns.',
      'Use the update dropdowns to pull existing values before changing IDs, text, tips, or videos.',
    ],
    cards: [
      { sub: 'content-categories', title: 'Categories', desc: 'Create, update, delete, and reorder content categories.' },
      { sub: 'content-difficulties', title: 'Difficulties', desc: 'Maintain difficulty labels used by techniques.' },
      { sub: 'content-techniques', title: 'Techniques', desc: 'Edit full movement-tech entries with tips and videos.' },
    ],
  },
  maps: {
    kicker: 'Map operations',
    summary: 'Search, submit, update, archive, convert, and request map edits from a single map pipeline.',
    hideStats: true,
    stats: ['Map data', 'Edit requests', 'Legacy tools'],
    hints: [
      'Search or load a map before update/convert actions so the form is filled from current data.',
      'Archive and release-code actions affect public visibility, so verify the map code first.',
    ],
    cards: [
      { sub: 'maps-search', title: 'Search map', desc: 'Find a map and inspect its public data.' },
      { sub: 'maps-update', title: 'Update map', desc: 'Load current values, edit, then patch the same record.' },
      { sub: 'maps-submit', title: 'Submit map', desc: 'Create a new map entry using the full submit workflow.' },
      { sub: 'maps-edit-request', title: 'Edit request', desc: 'Create a structured request for map corrections.' },
      { sub: 'maps-archive', title: 'Archive visibility', desc: 'Archive or unarchive one or many map codes.', danger: true },
      { sub: 'maps-convert', title: 'Legacy conversion', desc: 'Convert a modern map code into legacy format.' },
    ],
  },
  lootbox: {
    kicker: 'Workflow',
    summary: 'Tools for Lootbox.',
    hideStats: true,
  },
  records: {
    kicker: 'Quality control',
    summary: 'Review and manage suspicious-completion flags for a single player.',
    hideStats: true,
    hints: [
      'Search a player to see their suspicious flags.',
      'Provide exactly one record reference — a message ID or a verification ID.',
    ],
  },
  verifications: {
    kicker: 'Queues',
    summary: 'Process completion submissions, playtest state, and pending map edit requests.',
    stats: ['Completion queue', 'Edit requests', 'Review actions'],
    hints: [
      'Open pending queues from here; result cards include approve/reject actions where supported.',
      'The resolved-by field is prepared from the connected moderator account when available.',
    ],
    cards: [
      { sub: 'verif-pending', title: 'Completion queue', desc: 'Load pending completion verifications.' },
      { sub: 'verif-edits', title: 'Map edit queue', desc: 'Review pending map edit requests.' },
      { sub: 'verif-playtest', title: 'Playtests', desc: 'Handle playtest accept, deny, reset, and vote cleanup.' },
    ],
  },
  tournament: {
    kicker: 'Tournament ops',
    summary: 'Operate tournament categories, map selection, active cycles, leaderboards, and edition lifecycle together.',
    stats: ['Categories', 'Active cycles', 'Lifecycle controls'],
    hints: [
      'Open Overview first; it loads config, categories, active edition, and active cycles.',
      'Category choices are reused across map and cycle tools to avoid copying IDs manually.',
    ],
    cards: [
      { sub: 'tournament-overview', title: 'Live overview', desc: 'Load the complete tournament state and prefill lifecycle forms.' },
      { sub: 'tournament-categories', title: 'Categories', desc: 'Create or update XP, difficulties, active state, and champion role.' },
      { sub: 'tournament-maps', title: 'Map rotation', desc: 'Preview, choose, reroll, or force a category map.' },
      { sub: 'tournament-cycles', title: 'Cycles and rankings', desc: 'List cycles, open leaderboards, and inspect user streaks.' },
      { sub: 'tournament-lifecycle', title: 'Edition lifecycle', desc: 'Config, bootstrap, pause/resume, debug length, and result publishing.', danger: true },
    ],
  },
  skill: {
    kicker: 'Skill Score',
    summary: 'Inspect player Skill Scores and tune the weights and population percentiles used by the scoring model.',
    stats: ['Player scores', 'Scoring weights', 'Tier thresholds'],
    hints: [
      'Skill Score is separate from the existing Ninja, Skilled, Pro, and other skill_rank labels.',
      'Weight and percentile updates trigger upstream recomputation and remain restricted to superusers.',
    ],
    cards: [
      { sub: 'skill-user', title: 'Player score', desc: 'Load the aggregate summary or the per-map contribution breakdown.' },
      { sub: 'skill-config', title: 'Scoring weights', desc: 'Load the live tuning values, edit them, then recompute all scores.' },
      { sub: 'skill-tiers', title: 'Tier percentiles', desc: 'Preview rank populations and players while adjusting each percentile boundary.' },
    ],
  },
  store: {
    kicker: 'Commerce',
    summary: 'Load store configuration, update economics, and generate rotations in the same section.',
    stats: ['Config', 'Rotation', 'Dev-only'],
    hints: ['Load config first, update values in place, then save from the same card.'],
    cards: [
      { sub: 'store-config', title: 'Store config', desc: 'Load and update live store configuration.' },
      { sub: 'store-rotation', title: 'Generate rotation', desc: 'Create a new store rotation.', danger: true },
    ],
  },
  quests: {
    kicker: 'Quests',
    summary: 'Configure weekly quests, edit the current rotation, and patch user progress.',
    stats: ['Config', 'Weekly rotation', 'User progress'],
    hints: [
      'Load weekly quests before editing, then use the picker to fill the update form.',
      'User progress editing is intentionally separate from quest configuration.',
    ],
    cards: [
      { sub: 'quest-config', title: 'Quest config', desc: 'Load and update global quest settings.' },
      { sub: 'quest-update', title: 'Weekly quests', desc: 'Pick and update a quest from the live weekly set.' },
      { sub: 'quest-rotation', title: 'Generate rotation', desc: 'Force a new quest rotation.', danger: true },
      { sub: 'quest-user-progress', title: 'User progress', desc: 'Load and patch a user quest-progress entry.' },
    ],
  },
  devs: {
    kicker: 'Web maintenance',
    summary: 'Danger-zone maintenance tools for caches and converter metadata.',
    stats: ['Caches', 'Converter', 'Restricted'],
    hints: ['These actions are restricted because they can affect shared site behavior immediately.'],
    cards: [
      { sub: 'dev-cache-frameworks', title: 'Framework cache', desc: 'Clear framework cache.', danger: true },
      { sub: 'dev-cache-avatars', title: 'Avatar cache', desc: 'Clear cached avatar data.', danger: true },
      { sub: 'dev-cache-translations', title: 'Translation cache', desc: 'Clear translated string cache.', danger: true },
      { sub: 'dev-overpy-commit', title: 'Overpy commit', desc: 'Update converter commit metadata.' },
      { sub: 'dev-framework-version', title: 'Framework version', desc: 'Update the genji-framework CDN version.' },
    ],
  },
};

function modSectionMeta(tabId) {
  const fallbackLabel = document.querySelector(`#modTabs .mod-tab[data-tab="${CSS.escape(String(tabId || ''))}"]`)?.dataset?.tabLabel || tabId || 'Section';
  return MOD_SECTION_META[tabId] || {
    kicker: 'Workflow',
    summary: `Tools for ${fallbackLabel}.`,
    stats: [],
    hints: [],
    cards: [],
  };
}

function modSubtabLabel(panel, subId) {
  const btn = panel?.querySelector?.(`.mod-subtab[data-subtab="${CSS.escape(subId)}"]`);
  return btn?.textContent?.trim() || subId;
}

function modAvailableCards(panel, meta) {
  const explicit = Array.isArray(meta.cards) ? meta.cards : [];
  const cards = explicit
    .filter((card) => panel?.querySelector?.(`.mod-subtab[data-subtab="${CSS.escape(card.sub)}"]`))
    .map((card) => ({ ...card, title: card.title || modSubtabLabel(panel, card.sub) }));

  if (cards.length) return cards;

  return $$('.mod-subtab[data-subtab]', panel).map((btn) => ({
    sub: btn.dataset.subtab,
    title: btn.textContent.trim(),
    desc: 'Open this tool.',
  }));
}

function renderModeratorWorkflowHome(panelOrId) {
  const panel = typeof panelOrId === 'string'
    ? document.querySelector(`.mod-panel[data-panel="${CSS.escape(panelOrId)}"]`)
    : panelOrId;
  if (!panel) return;

  const tabId = panel.dataset.panel || 'users';
  const meta = modSectionMeta(tabId);
  const empty = panel.querySelector(':scope > .empty-state') || panel.querySelector('.empty-state');
  if (!empty) return;

  const cards = modAvailableCards(panel, meta);
  const actionCount = panel.querySelectorAll('form[data-action]').length;
  const subtabCount = panel.querySelectorAll('.mod-subtab[data-subtab]').length;
  const chips = [
    `${subtabCount} workflows`,
    `${actionCount} actions`,
    ...(meta.stats || []),
  ];

  empty.dataset.workflowHome = '1';
  empty.className = 'empty-state rounded-2xl border border-zinc-200/80 dark:border-white/10 p-5 text-zinc-700 dark:text-zinc-200';
  empty.innerHTML = `
    <div data-workflow-home>
      <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div class="min-w-0">
          <div class="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700 dark:text-emerald-300">${escapeHtml(meta.kicker || 'Workflow')}</div>
          <h3 class="mt-2 text-xl font-black text-zinc-950 dark:text-white">${escapeHtml(document.querySelector(`#modTabs .mod-tab[data-tab="${CSS.escape(tabId)}"]`)?.dataset?.tabLabel || tabId)}</h3>
          <p class="mt-1 max-w-3xl text-sm text-zinc-600 dark:text-zinc-300">${escapeHtml(meta.summary || '')}</p>
          <div class="mt-3 flex flex-wrap gap-2">
            ${chips.map((chip) => `<span class="rounded-full border border-zinc-200/80 bg-white/60 px-3 py-1 text-xs font-semibold text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">${escapeHtml(chip)}</span>`).join('')}
          </div>
        </div>
        <button type="button" data-workflow-first-action class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">
          Open first action
        </button>
      </div>
      <div class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        ${cards.map((card, index) => `
          <button
            type="button"
            data-workflow-card
            data-workflow-open-subtab="${escapeHtml(card.sub)}"
            class="group rounded-2xl border p-4 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${card.danger ? 'hover:border-amber-500/45' : ''}"
          >
            <span class="flex items-start justify-between gap-3">
              <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${card.danger ? 'bg-amber-500/12 text-amber-700 dark:text-amber-300' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'} ring-1 ring-inset ring-current/15">${String(index + 1).padStart(2, '0')}</span>
              <span class="min-w-0 flex-1">
                <span class="block text-sm font-black text-zinc-950 dark:text-white">${escapeHtml(card.title)}</span>
                <span class="mt-1 block text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">${escapeHtml(card.desc || '')}</span>
              </span>
            </span>
          </button>
        `).join('')}
      </div>
      ${(meta.hints || []).length ? `
        <div class="mt-5 grid gap-2 lg:grid-cols-2">
          ${(meta.hints || []).map((hint) => `
            <div class="rounded-xl border border-zinc-200/80 bg-white/50 p-3 text-xs leading-relaxed text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">${escapeHtml(hint)}</div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  const first = empty.querySelector('[data-workflow-card]');
  empty.querySelector('[data-workflow-first-action]')?.addEventListener('click', () => first?.click());
}

function refreshModeratorActiveHeader(tabId = document.querySelector('#modTabs .mod-tab.active')?.dataset?.tab || 'users') {
  const meta = modSectionMeta(tabId);
  const label = document.querySelector(`#modTabs .mod-tab[data-tab="${CSS.escape(tabId)}"]`)?.dataset?.tabLabel || tabId;
  const panel = document.querySelector(`.mod-panel[data-panel="${CSS.escape(tabId)}"]`);
  const subtabCount = panel?.querySelectorAll?.('.mod-subtab[data-subtab]').length || 0;
  const actionCount = panel?.querySelectorAll?.('form[data-action]').length || 0;

  const title = document.getElementById('modActiveTitle');
  const kicker = document.getElementById('modActiveKicker');
  const summary = document.getElementById('modActiveSummary');
  const stats = document.getElementById('modActiveStats');

  if (title) title.textContent = label || tabId;
  if (kicker) kicker.textContent = meta.kicker || 'Workflow';
  if (summary) summary.textContent = meta.summary || '';
  if (stats) {
    stats.innerHTML = meta.hideStats
      ? ''
      : [
          `${subtabCount} workflows`,
          `${actionCount} actions`,
          ...(meta.stats || []),
        ].map((chip) => `<span class="rounded-full border border-zinc-200/80 bg-white/60 px-3 py-1 font-semibold dark:border-white/10 dark:bg-white/5">${escapeHtml(chip)}</span>`).join('');
  }

  const hintsRoot = document.getElementById('modContextHints');
  if (hintsRoot) {
    const hints = meta.hints?.length ? meta.hints : ['Pick a workflow card, then submit the focused form.'];
    hintsRoot.innerHTML = hints.map((hint, index) => `
      <div class="rounded-xl border ${index === 0 ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200' : 'border-zinc-200/80 bg-white/45 text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300'} p-3">
        ${escapeHtml(hint)}
      </div>
    `).join('');
  }
}

function updateModeratorActivityStats() {
  const cards = $$('#activityLog [data-log-card]');
  const ok = cards.filter((card) => card.dataset.ok === '1').length;
  const total = cards.length;
  const values = { total, ok, err: total - ok };
  Object.entries(values).forEach(([key, value]) => {
    document.querySelectorAll(`[data-activity-stat="${CSS.escape(key)}"]`).forEach((el) => {
      el.textContent = String(value);
    });
  });
}

function enhanceEndpointBadges(root = document) {
  root.querySelectorAll('span:not([data-endpoint-enhanced])').forEach((el) => {
    const text = el.textContent?.trim() || '';
    if (!text.includes('/api/')) return;
    el.dataset.endpointEnhanced = '1';
    el.classList.add('mod-endpoint-badge');
    el.title = text;
  });
}

function enhanceModeratorChrome(root = document) {
  enhanceEndpointBadges(root);
  root.querySelectorAll('article.fade-in').forEach((article) => {
    article.classList.add('backdrop-blur', 'transition', 'duration-150');
  });
  $$('.mod-panel').forEach((panel) => renderModeratorWorkflowHome(panel));
  refreshModeratorActiveHeader();
  updateModeratorActivityStats();
}

document.addEventListener('click', (event) => {
  const card = event.target?.closest?.('[data-workflow-open-subtab]');
  if (!card) return;
  const panel = card.closest('.mod-panel');
  const subId = card.dataset.workflowOpenSubtab;
  const subtab = panel?.querySelector?.(`.mod-subtab[data-subtab="${CSS.escape(subId)}"]`);
  if (!subtab) return;
  event.preventDefault();
  subtab.click();
});

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

function wireDdSelect(root = document) {
  root.querySelectorAll('[data-dd-select]:not([data-dd-wired])').forEach((dd) => {
    dd.dataset.ddWired = "1";

    const btn = dd.querySelector('[data-dd-btn]');
    const list = dd.querySelector('[data-dd-list]');
    const labelEl = btn?.querySelector('.dd-label');

    if (!btn || !list) return;

    const addHidden = () => list.classList.add("hidden");
    const toggleHidden = () => list.classList.toggle("hidden");

    const update = () => {
      const checked = dd.querySelector('input[type="radio"]:checked');
      const text =
        checked?.dataset?.label ||
        checked?.getAttribute?.("data-label") ||
        checked?.value ||
        "";
      if (labelEl) labelEl.textContent = text || btn.getAttribute("data-placeholder") || "Select…";
    };

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleHidden();
    });

    list.addEventListener("click", (e) => e.stopPropagation());

    list.addEventListener("change", () => {
      update();
      addHidden();
    });

    document.addEventListener("click", (e) => {
      if (!dd.contains(e.target)) addHidden();
    });

    update();
  });
}


function bindDdDelegation() {
  if (window.__ddDelegationBound) return;
  window.__ddDelegationBound = true;

  document.addEventListener('click', (e) => {
    const btn = e.target?.closest?.('[data-dd-btn]');
    if (btn) {
      const dd = btn.closest('[data-dd-select]');
      const list = dd?.querySelector?.('[data-dd-list]');
      if (!dd || !list) return;

      e.preventDefault();
      e.stopPropagation();

      document.querySelectorAll('[data-dd-list]:not(.hidden)').forEach((l) => {
        if (l !== list) {
          l.classList.add('hidden');
          l.closest('[data-dd-select]')?.querySelector?.('[data-dd-btn]')?.setAttribute('aria-expanded', 'false');
        }
      });

      const willOpen = list.classList.contains('hidden');
      list.classList.toggle('hidden', !willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      return;
    }

    document.querySelectorAll('[data-dd-list]:not(.hidden)').forEach((l) => {
      const dd = l.closest('[data-dd-select]');
      if (dd && !dd.contains(e.target)) {
        l.classList.add('hidden');
        dd.querySelector?.('[data-dd-btn]')?.setAttribute('aria-expanded', 'false');
      }
    });
  }, true);

  document.addEventListener('change', (e) => {
    const target = e.target;
    const dd = target?.closest?.('[data-dd-select]');
    if (!dd) return;

    if (target?.matches?.('input[type="radio"]')) {
      const labelEl = dd.querySelector('.dd-label');
      const btn = dd.querySelector('[data-dd-btn]');
      const list = dd.querySelector('[data-dd-list]');

      const text =
        target.dataset?.label ||
        target.getAttribute?.('data-label') ||
        target.value ||
        '';

      if (labelEl) labelEl.textContent = text || btn?.getAttribute('data-placeholder') || 'Select…';

      // Optional mirror into known hidden fields (used by Quests -> progress picker)
      const hidden = dd.querySelector('input[type="hidden"][name="pick_progress_id"]');
      if (hidden) hidden.value = target.value;

      if (list) list.classList.add('hidden');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  }, true);
}


// wireDdSelect is invoked from initializeApp() to ensure DOM is ready.

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
  const shouldMountInline = overlay?.id === 'mapEditRequestInline';
  (shouldMountInline && mount && mount.isConnected ? mount : document.body).appendChild(overlay);
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
const ACTIVITY_MAX_ITEMS = 120;
const __activityState = { query: '', filter: 'all' };

function ensureActivityPlaceholder(container = $('#activityLog')) {
  if (!container) return;
  const cards = container.querySelectorAll('[data-log-card]');
  const empty = container.querySelector('[data-empty-activity="1"]');

  if (!cards.length && !empty) {
    const p = document.createElement('p');
    p.dataset.emptyActivity = '1';
    p.className = 'text-zinc-500 dark:text-zinc-400';
    container.appendChild(p);
    return;
  }

  if (cards.length && empty) empty.remove();
}

function updateActivityFilterButtons() {
  const root = $('#activityFilters');
  if (!root) return;
  root.querySelectorAll('[data-activity-filter]').forEach((btn) => {
    const active = btn.getAttribute('data-activity-filter') === __activityState.filter;
    btn.classList.toggle('bg-emerald-500/15', active);
    btn.classList.toggle('text-emerald-700', active);
    btn.classList.toggle('dark:text-emerald-300', active);
  });
}

function applyActivityFilters() {
  const container = $('#activityLog');
  if (!container) return;

  const q = String(__activityState.query || '').trim().toLowerCase();
  const mode = __activityState.filter || 'all';
  let visible = 0;

  container.querySelectorAll('[data-log-card]').forEach((card) => {
    const cardOk = card.dataset.ok === '1';
    const text = card.dataset.search || '';

    const matchFilter =
      mode === 'all' ||
      (mode === 'ok' && cardOk) ||
      (mode === 'err' && !cardOk);

    const matchQuery = !q || text.includes(q);
    const show = matchFilter && matchQuery;

    card.classList.toggle('hidden', !show);
    if (show) visible += 1;
  });

  const total = container.querySelectorAll('[data-log-card]').length;
  const count = $('#activityCount');
  if (count) count.textContent = `${visible}/${total}`;
}

function initActivityControls() {
  const search = $('#activitySearch');
  const filters = $('#activityFilters');

  if (search && !search.dataset.wired) {
    search.dataset.wired = '1';
    search.addEventListener(
      'input',
      () => {
        __activityState.query = search.value || '';
        applyActivityFilters();
      },
      { passive: true }
    );
  }

  if (filters && !filters.dataset.wired) {
    filters.dataset.wired = '1';
    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-activity-filter]');
      if (!btn) return;
      __activityState.filter = btn.getAttribute('data-activity-filter') || 'all';
      updateActivityFilterButtons();
      applyActivityFilters();
    });
  }

  updateActivityFilterButtons();
  ensureActivityPlaceholder();
  applyActivityFilters();
}

function logActivity({ title, method, url, ok, status, data }) {
  const container = $('#activityLog');
  if (!container) return;

  const wrap = document.createElement('div');
  wrap.className = 'rounded-xl border border-zinc-200/80 bg-white/85 p-3 fade-in min-w-0 shadow-sm dark:border-white/10 dark:bg-zinc-900/80';
  wrap.dataset.logCard = '1';
  wrap.dataset.ok = ok ? '1' : '0';
  wrap.dataset.method = String(method || '');
  wrap.dataset.status = String(status || '');
  wrap.dataset.url = String(url || '');

  const pretty = typeof data === 'string' ? data : JSON.stringify(data ?? {}, null, 2);
  const lines = pretty.split('\n');
  const isLong = pretty.length > 600 || lines.length > 25;
  const now = new Date();
  const hhmmss = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  let preview = pretty;
  if (isLong) {
    const shown = 25;
    preview =
      lines.slice(0, shown).join('\n') + `\n...\n(${Math.max(0, lines.length - shown)} more lines)`;
  }

  const methodLabel = String(method || 'REQ').toUpperCase();
  const statusLabel = String(status ?? '-');
  const statusClass = ok
    ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
    : 'border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300';

  wrap.innerHTML = `
    <div class="mb-2 flex items-start justify-between gap-3 text-xs">
      <div class="min-w-0">
        <div class="truncate font-black text-zinc-950 dark:text-white">${escapeHtml(String(title ?? 'Request'))}</div>
        <div class="mt-1 flex max-w-full items-center gap-1.5 overflow-hidden text-[11px] text-zinc-600 dark:text-zinc-400">
          <span class="shrink-0 rounded-md border border-zinc-200/80 bg-zinc-900/5 px-1.5 py-0.5 font-mono dark:border-white/10 dark:bg-white/5">${escapeHtml(methodLabel)}</span>
          <span class="truncate">${escapeHtml(String(url || '-'))}</span>
        </div>
      </div>
      <div class="flex shrink-0 flex-col items-end gap-1">
        <span class="text-zinc-500 dark:text-zinc-400">${hhmmss}</span>
        <span class="rounded-full border px-2 py-0.5 font-semibold ${statusClass}">${escapeHtml(statusLabel)}</span>
      </div>
    </div>
    <pre class="resp max-h-48 overflow-auto rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-2 text-xs leading-tight text-zinc-700 dark:border-white/10 dark:bg-zinc-950/55 dark:text-zinc-300 whitespace-pre-wrap max-w-full break-words [overflow-wrap:anywhere] ${isLong ? 'cursor-zoom-in' : ''}"></pre>
    <div class="mt-2 flex items-center gap-2">
      <button class="view-full cursor-pointer text-xs rounded-lg border border-zinc-200/80 dark:border-white/10 px-2 py-1 hover:bg-zinc-900/3 dark:bg-white/5">View full</button>
      <button class="copy-full cursor-pointer text-xs rounded-lg border border-zinc-200/80 dark:border-white/10 px-2 py-1 hover:bg-zinc-900/3 dark:bg-white/5">Copy</button>
    </div>
  `;
  wrap.querySelector('.resp').textContent = preview;

  wrap._fullText = pretty;
  wrap._meta = { title: title ?? 'Response', method, url, isLong };
  wrap.dataset.search = `${title ?? ''} ${method ?? ''} ${url ?? ''} ${status ?? ''} ${pretty}`.toLowerCase();

  container.prepend(wrap);

  while (container.querySelectorAll('[data-log-card]').length > ACTIVITY_MAX_ITEMS) {
    const cards = container.querySelectorAll('[data-log-card]');
    cards[cards.length - 1]?.remove();
  }

  ensureActivityPlaceholder(container);
  applyActivityFilters();
  updateModeratorActivityStats();
}

(function setupLogDelegation() {
  const container = $('#activityLog');
  if (!container) return;

  initActivityControls();

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
let __moderatorRequestContext = null;

function parseJsonPreservingLargeIntegers(raw) {
  const source = String(raw ?? '');
  if (!source.trim()) return { ok: false, value: null };

  let transformed = '';
  let inString = false;
  let escaped = false;

  for (let index = 0; index < source.length;) {
    const char = source[index];

    if (inString) {
      transformed += char;
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      index += 1;
      continue;
    }

    if (char === '"') {
      inString = true;
      transformed += char;
      index += 1;
      continue;
    }

    if (char === '-' || (char >= '0' && char <= '9')) {
      const match = source.slice(index).match(
        /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/
      );
      if (match) {
        const token = match[0];
        const isInteger = !token.includes('.') && !/[eE]/.test(token);
        let unsafeInteger = false;

        if (isInteger && token.replace('-', '').length >= 16) {
          try {
            const value = BigInt(token);
            unsafeInteger =
              value > BigInt(Number.MAX_SAFE_INTEGER) ||
              value < BigInt(Number.MIN_SAFE_INTEGER);
          } catch {
            unsafeInteger = false;
          }
        }

        transformed += unsafeInteger ? JSON.stringify(token) : token;
        index += token.length;
        continue;
      }
    }

    transformed += char;
    index += 1;
  }

  try {
    return { ok: true, value: JSON.parse(transformed) };
  } catch {
    return { ok: false, value: null };
  }
}

async function readResponseDataPreservingLargeIntegers(response) {
  const raw = await response.text().catch(() => '');
  const parsed = parseJsonPreservingLargeIntegers(raw);
  return parsed.ok ? parsed.value : raw;
}

function http(method, url, { body, query, headers } = {}) {
  const requestContext = __moderatorRequestContext;
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

  return fetch(url + qs, opts)
    .then(async (r) => {
      const result = {
        ok: r.ok,
        status: r.status,
        url: r.url,
        data: await readResponseDataPreservingLargeIntegers(r),
      };

      if (requestContext) {
        requestContext.responses.push({
          method: String(method || 'GET').toUpperCase(),
          ...result,
        });
      }

      return result;
    })
    .catch((error) => {
      if (requestContext) requestContext.networkError = error;
      throw error;
    });
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
          const emptyState = $('.empty-state', panel);
          if (emptyState) {
            emptyState.classList.remove(...String('hidden').trim().split(/\s+/).filter(Boolean));
          } else {
            // Panels without a workflow-home landing (e.g. the Users workspace)
            // default to their first sub-tab instead of leaving nothing selected.
            $('.mod-subtab', panel)?.click();
          }
        }
      });
      refreshModeratorActiveHeader(id);
      const nextPanel = panels.find?.((panel) => panel.dataset.panel === id);
      if (nextPanel) renderModeratorWorkflowHome(nextPanel);
      setTimeout(() => btn.focus({ preventScroll: true }), 0);
    })
  );
})();

function resetSection(root = document) {
  if (!root) return;

  root.querySelectorAll('input, select, textarea').forEach((el) => {
    if (el.closest('[data-preserve-form-state="1"]')) return;

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
        wireDdSelect(active);
        enhanceEndpointBadges(active);
        active.classList.add(...String('fade-in').trim().split(/\s+/).filter(Boolean));
        scrollIntoViewWithOffset(active, getHeaderOffset());

        if (name.startsWith('content-')) ensureContentMovementTechData(name);
        if (name === 'store-config') initStoreConfigPanel();
        if (name === 'skill-user') initSkillUserPanel();
        if (name === 'skill-config') initSkillConfigPanel();
        if (name === 'skill-tiers') initSkillTiersPanel();
        if (name === 'quest-config') initQuestConfigPanel();
        if (name === 'quest-update') initQuestUpdatePanel();
        if (name === 'tournament-overview') initTournamentOverviewPanel();
        if (name === 'tournament-categories') initTournamentCategoryPanel();
        if (name === 'tournament-maps' || name === 'tournament-cycles') {
          initTournamentHelperPanel(name);
        }
        if (name === 'tournament-lifecycle') initTournamentLifecyclePanel();
        if (name === 'dev-overpy-commit') initOverpyCommitPanel();
        if (name === 'dev-framework-version') initFrameworkVersionPanel();
        wireFormAutocompletes(active);
        ensureFormUx(active);
        try {
          active.querySelectorAll('.fake-select, .custom-multiselect').forEach((el) => {
            if (typeof __merSetupFakeSelect === 'function') __merSetupFakeSelect(el);
          });
        } catch {}

      }

      setTimeout(() => target.focus?.({ preventScroll: true }), 0);
    });
  });
})();

// --- Clear log ---
$('#clearLog')?.addEventListener('click', () => {
  const container = $('#activityLog');
  if (!container) return;
  container.innerHTML = '';
  ensureActivityPlaceholder(container);
  applyActivityFilters();
  updateModeratorActivityStats();
});

//———————————————————————————————————————————————————————————————
// AUTOCOMPLETE ENGINNE
//———————————————————————————————————————————————————————————————
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
    const raw = await readResponseDataPreservingLargeIntegers(res);
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
  root.querySelectorAll('input[name="map_code"]').forEach(attachMapCodeAutocomplete);
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
    if (input.readOnly || input.disabled) return;
    if (!input.__acBound) attachUsersAutocomplete(input);
  });

  const mapNameInput = root.querySelector('#mapNameInput');
  if (mapNameInput) {
    attachMapNameAutocomplete(mapNameInput, ({ value }) => {
      const label = document.getElementById('metaMap');
      if (label) label.textContent = value || 'N/A';
    });
  }
}

function setFormPending(form, pending = true, submitter = null) {
  const submitButtons = Array.from(
    form.querySelectorAll('button[type="submit"], button:not([type])')
  );

  if (pending) {
    form.setAttribute('aria-busy', 'true');
    submitButtons.forEach((btn) => {
      if (btn.dataset.pendingWired !== '1') {
        btn.dataset.pendingWired = '1';
        btn.dataset.pendingText = btn.textContent || 'Submit';
      }
      btn.disabled = true;
      btn.classList.add('opacity-70');
      if (!submitter || btn === submitter) {
        btn.textContent = 'Working...';
      }
    });
    return () => setFormPending(form, false);
  }

  form.removeAttribute('aria-busy');
  submitButtons.forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove('opacity-70');
    if (btn.dataset.pendingText) btn.textContent = btn.dataset.pendingText;
  });

  return () => {};
}

// --- Forms dispatcher ---
$$('form[data-action]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.dataset.submitLocked === '1') {
      return;
    }
    form.dataset.submitLocked = '1';
    const submitter = e.submitter || form.querySelector('button[type="submit"], button:not([type])');
    const action = submitter?.dataset?.submitAction || form.dataset.action;
    const releasePending = setFormPending(form, true, submitter);
    const previousRequestContext = __moderatorRequestContext;
    const requestContext = {
      action,
      form,
      responses: [],
      networkError: null,
    };
    __moderatorRequestContext = requestContext;
    beginModeratorEndpointResponse(requestContext);
    try {
      const runAction = async () => {
      switch (action) {
        // MAPS (API_MODS)
        case 'archive-maps':
          return handleArchiveMaps(form);
        case 'update-map':
          return handleUpdateMap(form);
        case 'submit-map':
          return handleSubmitMap(form);
        case 'convert-legacy':
          return handleConvertLegacy(form);

        // SKILL
        case 'skill-user-summary':
          return handleSkillUserSummary(form);
        case 'skill-user-breakdown':
          return handleSkillUserBreakdown(form);
        case 'skill-config-get':
          return handleSkillConfigGet(form);
        case 'skill-config-update':
          return handleSkillConfigUpdate(form);
        case 'skill-tiers-get':
          return handleSkillTiersGet(form);
        case 'skill-tiers-update':
          return handleSkillTiersUpdate(form);

        // TOURNAMENTS
        case 'tournament-load-overview':
          return handleTournamentOverview(form);
        case 'tournament-config-get':
          return handleTournamentConfigGet(form);
        case 'tournament-config-update':
          return handleTournamentConfigUpdate(form);
        case 'tournament-category-list':
          return handleTournamentCategoryList(form);
        case 'tournament-category-get':
          return handleTournamentCategoryGet(form);
        case 'tournament-category-create':
          return handleTournamentCategoryCreate(form);
        case 'tournament-category-update':
          return handleTournamentCategoryUpdate(form);
        case 'tournament-category-delete':
          return handleTournamentCategoryDelete(form);
        case 'tournament-next-cycle':
          return handleTournamentNextCycle(form);
        case 'tournament-select-map':
          return handleTournamentSelectMap(form);
        case 'tournament-choose-map':
          return handleTournamentChooseMap(form);
        case 'tournament-reroll-map':
          return handleTournamentRerollMap(form);
        case 'tournament-reroll-active':
          return handleTournamentRerollActive(form);
        case 'tournament-cycle-list':
          return handleTournamentCycleList(form);
        case 'tournament-leaderboard':
          return handleTournamentLeaderboard(form);
        case 'tournament-streak':
          return handleTournamentStreak(form);
        case 'tournament-active-edition':
          return handleTournamentActiveEdition(form);
        case 'tournament-bootstrap':
          return handleTournamentBootstrap(form);
        case 'tournament-publish-results':
          return handleTournamentPublishResults(form);
        case 'tournament-pause':
          return handleTournamentPause(form);
        case 'tournament-debug-cycle-length':
          return handleTournamentDebugCycleLength(form);
        
        // DEVS (API_MODS)
        case 'clear-frameworks-cache':
          if (!isDevAllowed()) return toast('Dev access only', 'err');
          return handleClearFrameworksCache(form);
        case 'clear-avatars-cache':
          if (!isDevAllowed()) return toast('Dev access only', 'err');
          return handleClearAvatarsCache(form);
        case 'clear-translations-cache':
          if (!isDevAllowed()) return toast('Dev access only', 'err');
          return handleClearTranslationsCache(form);
        case 'set-overpy-commit':
          if (!isDevAllowed()) return toast('Dev access only', 'err');
          return handleSetOverpyCommit(form);
        case 'set-framework-version':
          if (!isDevAllowed()) return toast('Dev access only', 'err');
          return handleSetFrameworkVersion(form);

        // STORE (API_MODS)
        case 'store-get-config':
          if (!isDevAllowed()) return toast('Dev access only', 'err');
          return handleStoreGetConfig(form);
        case 'store-update-config':
          if (!isDevAllowed()) return toast('Dev access only', 'err');
          return handleStoreUpdateConfig(form);
        case 'store-generate-rotation':
          if (!isDevAllowed()) return toast('Dev access only', 'err');
          return handleStoreGenerateRotation(form);

        // QUESTS (API_MODS)
        case 'quest-get-config':
          if (!isDevAllowed()) return toast('Dev access only', 'err');
          return handleQuestGetConfig(form);
        case 'quest-update-config':
          if (!isDevAllowed()) return toast('Dev access only', 'err');
          return handleQuestUpdateConfig(form);
        case 'quest-update-quest':
          if (!isDevAllowed()) return toast('Dev access only', 'err');
          return handleQuestUpdateQuest(form);
        case 'quest-generate-rotation':
          if (!isDevAllowed()) return toast('Dev access only', 'err');
          return handleQuestGenerateRotation(form);
        case 'quest-get-weekly':
          if (!isDevAllowed()) return toast('Dev access only', 'err');
          return handleQuestGetWeekly(form);

        case 'quest-get-user-progress':
          if (!isDevAllowed()) return toast('Dev access only', 'err');
          return handleQuestGetUserProgress(form);

        case 'quest-update-user-progress':
          if (!isDevAllowed()) return toast('Dev access only', 'err');
          return handleQuestUpdateUserProgress(form);

        default:
          toast(`Unknown action: ${action}`, 'err');
          return;
      }
      };
      await runAction();
      completeModeratorEndpointResponse(requestContext);
    } catch (err) {
      const errorData = { message: String(err) };
      if (USER_ENDPOINT_RESPONSE_META[action]) {
        renderUserEndpointResponse(form, action, {
          ok: false,
          status: 'ERR',
          data: errorData,
        });
      } else {
        completeModeratorEndpointResponse(requestContext, {
          ok: false,
          status: 'ERR',
          data: errorData,
        });
      }
      toast('Unexpected error', 'err');
      logActivity({
        title: action,
        method: 'ERROR',
        url: '-',
        ok: false,
        status: 'ERR',
        data: errorData,
      });
    } finally {
      if (__moderatorRequestContext === requestContext) {
        __moderatorRequestContext =
          previousRequestContext === requestContext ? null : previousRequestContext;
      }
      delete form.dataset.submitLocked;
      releasePending();
    }
  });
});

// --- Buttons / misc actions (non-form) ---
document.addEventListener('click', (e) => {
  const resetBtn = e.target?.closest?.('[data-reset-form]');
  if (resetBtn) {
    e.preventDefault();
    const form = resetBtn.closest('form');
    if (form) resetEnhancedForm(form);
    return;
  }

  const btn = e.target?.closest?.('[data-action="quest-fill-user-progress"]');
  if (!btn) return;
  e.preventDefault();
  const subpanel = btn.closest('[data-subpanel="quest-user-progress"]') || btn.closest('[data-subpanel]') || document;
  fillQuestUserProgressFromPicked(subpanel);
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
  const submitAnchor =
    (submitBtn?.closest?.('[data-form-actions="1"]') &&
      submitBtn.closest('[data-form-actions="1"]').closest('form') === form &&
      submitBtn.closest('[data-form-actions="1"]')) ||
    submitBtn;

  if (submitAnchor && submitAnchor.parentElement === form) {
    if (!bulkWrap.isConnected) form.insertBefore(bulkWrap, submitAnchor);
    else if (bulkWrap.nextElementSibling !== submitAnchor) form.insertBefore(bulkWrap, submitAnchor);
  } else if (!bulkWrap.isConnected) {
    form.appendChild(bulkWrap);
  }

  if (submitBtn) {
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
  if (addBtn && addBtn.dataset.wired !== '1') {
    addBtn.dataset.wired = '1';
    addBtn.addEventListener('click', () => addCodeInput());
  }

  function applyMode() {
    const bulk = form.mode.value === 'bulk';
(() => { const __obj = (singleWrap); if (!__obj) return undefined; let __last; for (const __c of String('hidden').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, bulk); return __last; })();
(() => { const __obj = bulkWrap; let __last; for (const __c of String('hidden').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, !bulk); return __last; })();

(() => { const __obj = (submitBtn) ? (submitBtn) : null; if (!__obj) return undefined; let __last; for (const __c of String('mt-2').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, bulk); return __last; })();

    if (bulk && codesList.children.length === 0) addCodeInput();
  }
  if (form.mode && form.mode.dataset.wired !== '1') {
    form.mode.dataset.wired = '1';
    form.mode.addEventListener('change', applyMode);
  }

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

    const baseName = radio.dataset.ddTargetName || radio.name.replace(/_ui$/, '');
    const sel = dd.querySelector(`select[name="${CSS.escape(baseName)}"]`);
    if (!sel) return;

    if (sel.value !== radio.value) sel.value = radio.value;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  }, { passive: true });
})();

//———————————————————————————————————————————————————————————————
// HANDLERS
//———————————————————————————————————————————————————————————————
// ENDPOINT RESPONSES
function moderatorResponseActionTitle(action) {
  const exact = {
    'tournament-load-overview': 'Tournament overview',
  };
  if (exact[action]) return exact[action];

  return String(action || 'Endpoint response')
    .replace(/^(content|tournament|store|quest)-/, '')
    .split('-')
    .filter(Boolean)
    .map((part) => {
      const upper = {
        xp: 'XP',
        ow: 'Overwatch',
        api: 'API',
        id: 'ID',
      };
      return upper[part] || `${part.charAt(0).toUpperCase()}${part.slice(1)}`;
    })
    .join(' ');
}

function moderatorResponseMount(context) {
  const article = context?.form?.closest?.('article') || context?.article || null;
  if (!article) return null;

  if (article.__moderatorEndpointResponseMount?.isConnected) {
    return article.__moderatorEndpointResponseMount;
  }

  const mount = document.createElement('div');
  mount.dataset.moderatorEndpointResponse = '1';
  mount.className = 'hidden';
  mount.setAttribute('aria-live', 'polite');
  article.insertAdjacentElement('afterend', mount);
  article.__moderatorEndpointResponseMount = mount;
  return mount;
}

function moderatorResponseJson(data) {
  try {
    const value = typeof data === 'string' ? data : JSON.stringify(data ?? null, null, 2);
    return value == null ? '' : String(value);
  } catch {
    return String(data ?? '');
  }
}

function moderatorResponseLabel(value) {
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function moderatorResponseScalar(value) {
  if (value == null || value === '') {
    return '<span class="text-zinc-400 dark:text-zinc-500">Not set</span>';
  }
  if (typeof value === 'boolean') {
    const classes = value
      ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
      : 'border-zinc-300 bg-zinc-900/5 text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300';
    return `<span class="inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${classes}">${value ? 'True' : 'False'}</span>`;
  }
  if (typeof value === 'number') {
    return `<span class="font-mono tabular-nums">${escapeHtml(String(value))}</span>`;
  }
  return escapeHtml(String(value));
}

const __moderatorResponseTables = new Map();
let __moderatorResponseTableId = 0;

function moderatorResponseTableRows(rows, columns) {
  return rows.map((row) => `
    <tr class="bg-white/45 dark:bg-zinc-950/20">
      ${columns.map((column) => `<td class="max-w-64 px-3 py-2 font-medium text-zinc-800 dark:text-zinc-200">${moderatorResponseScalar(row[column])}</td>`).join('')}
    </tr>`).join('');
}

function renderModeratorResponseTablePage(tableId) {
  const state = __moderatorResponseTables.get(tableId);
  const root = document.querySelector(
    `[data-moderator-response-table="${CSS.escape(tableId)}"]`
  );
  if (!state || !root) return;

  const totalPages = Math.max(1, Math.ceil(state.rows.length / state.pageSize));
  state.page = Math.min(Math.max(1, state.page), totalPages);

  const start = (state.page - 1) * state.pageSize;
  const end = Math.min(start + state.pageSize, state.rows.length);
  const tbody = root.querySelector('[data-response-table-body]');
  if (tbody) {
    tbody.innerHTML = moderatorResponseTableRows(
      state.rows.slice(start, end),
      state.columns
    );
  }

  const range = root.querySelector('[data-response-table-range]');
  if (range) {
    range.textContent = `${state.rows.length ? start + 1 : 0}-${end} of ${state.rows.length}`;
  }

  const current = root.querySelector('[data-response-table-current]');
  if (current) current.textContent = String(state.page);

  const total = root.querySelector('[data-response-table-total]');
  if (total) total.textContent = String(totalPages);

  const previous = root.querySelector('[data-response-page="previous"]');
  const next = root.querySelector('[data-response-page="next"]');
  if (previous) previous.disabled = state.page <= 1;
  if (next) next.disabled = state.page >= totalPages;
}

function clearModeratorResponseTables(root) {
  root?.querySelectorAll?.('[data-moderator-response-table]').forEach((table) => {
    __moderatorResponseTables.delete(table.dataset.moderatorResponseTable);
  });
}

function moderatorResponseTable(items) {
  const rows = items.filter((item) => item && typeof item === 'object' && !Array.isArray(item));
  if (!rows.length) return '';

  const columns = [];
  rows.slice(0, 10).forEach((row) => {
    Object.entries(row).forEach(([key, value]) => {
      if (
        columns.length < 6 &&
        !columns.includes(key) &&
        (value == null || ['string', 'number', 'boolean'].includes(typeof value))
      ) {
        columns.push(key);
      }
    });
  });
  if (!columns.length) return '';

  const tableId = `moderator-response-table-${++__moderatorResponseTableId}`;
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  __moderatorResponseTables.set(tableId, {
    rows,
    columns,
    page: 1,
    pageSize,
  });

  return `
    <div data-moderator-response-table="${tableId}">
      <div class="overflow-x-auto rounded-xl border border-zinc-200/80 dark:border-white/10">
        <table class="min-w-full text-left text-xs">
          <thead class="bg-zinc-900/5 text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
            <tr>
              ${columns.map((column) => `<th class="whitespace-nowrap px-3 py-2 font-semibold uppercase">${escapeHtml(moderatorResponseLabel(column))}</th>`).join('')}
            </tr>
          </thead>
          <tbody data-response-table-body class="divide-y divide-zinc-200/80 dark:divide-white/10">
            ${moderatorResponseTableRows(rows.slice(0, pageSize), columns)}
          </tbody>
        </table>
      </div>
      ${rows.length > pageSize ? `
        <div class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span data-response-table-range class="text-xs font-medium text-zinc-500 dark:text-zinc-400">1-${Math.min(pageSize, rows.length)} of ${rows.length}</span>
          <div class="flex items-center gap-2">
            <button type="button" data-response-page="previous" title="Previous page" disabled class="rounded-lg border border-zinc-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10">
              Previous
            </button>
            <span class="min-w-20 text-center text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Page <span data-response-table-current>1</span> / <span data-response-table-total>${totalPages}</span>
            </span>
            <button type="button" data-response-page="next" title="Next page" class="rounded-lg border border-zinc-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10">
              Next
            </button>
          </div>
        </div>` : ''}
    </div>
  `;
}

document.addEventListener('click', (event) => {
  const button = event.target?.closest?.('[data-response-page]');
  if (!button) return;

  const root = button.closest('[data-moderator-response-table]');
  const tableId = root?.dataset?.moderatorResponseTable;
  const state = tableId ? __moderatorResponseTables.get(tableId) : null;
  if (!state) return;

  event.preventDefault();
  state.page += button.dataset.responsePage === 'previous' ? -1 : 1;
  renderModeratorResponseTablePage(tableId);
});

function moderatorResponseStructuredData(data, { compact = false } = {}) {
  if (data == null || data === '') {
    return `
      <div class="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
        <span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">✓</span>
        <span>The request completed without a response body.</span>
      </div>`;
  }

  if (Array.isArray(data)) {
    if (!data.length) {
      return `
        <div class="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">✓</span>
          <span>The API returned an empty list.</span>
        </div>`;
    }

    const table = moderatorResponseTable(data);
    if (table) {
      return `
        <div class="mb-3 flex items-center justify-between gap-3">
          <span class="text-sm font-bold text-zinc-950 dark:text-white">${data.length} record${data.length === 1 ? '' : 's'}</span>
        </div>
        ${table}`;
    }

    return `
      <div class="flex flex-wrap gap-2">
        ${data.slice(0, compact ? 8 : 20).map((value) => `
          <span class="rounded-lg border border-zinc-200/80 bg-white/60 px-2.5 py-1 text-sm font-medium text-zinc-800 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
            ${moderatorResponseScalar(value)}
          </span>`).join('')}
      </div>`;
  }

  if (typeof data !== 'object') {
    return `
      <div class="rounded-xl border border-zinc-200/80 bg-white/55 px-4 py-3 font-mono text-lg font-black text-zinc-950 dark:border-white/10 dark:bg-white/5 dark:text-white">
        ${moderatorResponseScalar(data)}
      </div>`;
  }

  const entries = Object.entries(data);
  const scalarEntries = entries.filter(([, value]) =>
    value == null || ['string', 'number', 'boolean'].includes(typeof value)
  );
  const nestedEntries = entries.filter(([, value]) =>
    value != null && typeof value === 'object'
  );
  const message = [data.message, data.detail]
    .find((value) => typeof value === 'string' && value.trim());

  return `
    ${message ? `
      <div class="mb-4 border-l-2 border-emerald-500/60 pl-3">
        <div class="text-[11px] font-semibold uppercase text-zinc-500 dark:text-zinc-400">Message</div>
        <div class="mt-1 text-sm font-semibold text-zinc-950 dark:text-white">${escapeHtml(message)}</div>
      </div>` : ''}
    ${scalarEntries.length ? `
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        ${scalarEntries.slice(0, compact ? 6 : 15).map(([key, value]) => `
          <div class="min-w-0 border-l-2 border-zinc-300/80 pl-3 dark:border-white/15">
            <div class="text-[11px] font-semibold uppercase text-zinc-500 dark:text-zinc-400">${escapeHtml(moderatorResponseLabel(key))}</div>
            <div class="mt-1 break-words text-sm font-semibold text-zinc-950 dark:text-white">${moderatorResponseScalar(value)}</div>
          </div>`).join('')}
      </div>` : ''}
    ${nestedEntries.length ? `
      <div class="${scalarEntries.length ? 'mt-5 border-t border-zinc-200/80 pt-4 dark:border-white/10' : ''} space-y-3">
        ${nestedEntries.slice(0, compact ? 3 : 8).map(([key, value]) => `
          <details class="rounded-xl border border-zinc-200/80 bg-white/40 dark:border-white/10 dark:bg-white/5" ${nestedEntries.length === 1 ? 'open' : ''}>
            <summary class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-zinc-950 dark:text-white">
              <span>${escapeHtml(moderatorResponseLabel(key))}</span>
              <span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">${Array.isArray(value) ? `${value.length} item${value.length === 1 ? '' : 's'}` : `${Object.keys(value).length} fields`}</span>
            </summary>
            <div class="border-t border-zinc-200/80 px-4 py-4 dark:border-white/10">
              ${moderatorResponseStructuredData(value, { compact: true })}
            </div>
          </details>`).join('')}
      </div>` : ''}
  `;
}

function moderatorResponseRawDetails(data, label = 'Raw response') {
  return `
    <details class="mt-4 border-t border-zinc-200/80 pt-3 dark:border-white/10">
      <summary class="cursor-pointer select-none text-xs font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">${escapeHtml(label)}</summary>
      <pre class="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-zinc-950 p-3 font-mono text-xs text-zinc-100">${escapeHtml(moderatorResponseJson(data))}</pre>
    </details>`;
}

function beginModeratorEndpointResponse(context) {
  if (!context || USER_ENDPOINT_RESPONSE_META[context.action]) return;
  const mount = moderatorResponseMount(context);
  if (!mount) return;

  clearModeratorResponseTables(mount);
  mount.classList.remove('hidden');
  mount.innerHTML = `
    <section class="fade-in overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/60 shadow-sm dark:border-white/10 dark:bg-zinc-900/55">
      <div class="flex items-center justify-between gap-3 border-b border-zinc-200/80 px-5 py-4 dark:border-white/10">
        <div>
          <div class="text-[11px] font-semibold uppercase text-zinc-500 dark:text-zinc-400">Endpoint response</div>
          <h4 class="mt-0.5 font-black text-zinc-950 dark:text-white">${escapeHtml(moderatorResponseActionTitle(context.action))}</h4>
        </div>
        <span class="rounded-full border border-zinc-200/80 bg-zinc-900/5 px-2.5 py-1 text-xs font-semibold text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">Loading</span>
      </div>
      <div class="space-y-3 p-5" aria-hidden="true">
        <div class="h-4 w-40 animate-pulse rounded bg-zinc-200 dark:bg-white/10"></div>
        <div class="h-3 w-full animate-pulse rounded bg-zinc-200/80 dark:bg-white/10"></div>
        <div class="h-3 w-2/3 animate-pulse rounded bg-zinc-200/80 dark:bg-white/10"></div>
      </div>
    </section>`;
}

function completeModeratorEndpointResponse(context, forcedResponse = null) {
  if (!context || USER_ENDPOINT_RESPONSE_META[context.action]) return;
  const mount = moderatorResponseMount(context);
  if (!mount) return;

  clearModeratorResponseTables(mount);
  let responses = Array.isArray(context.responses) ? context.responses.slice() : [];
  if (forcedResponse) {
    responses = [{
      method: 'ERROR',
      url: '-',
      ...forcedResponse,
    }];
  } else if (!responses.length && context.networkError) {
    responses = [{
      method: 'ERROR',
      url: '-',
      ok: false,
      status: 'ERR',
      data: { message: String(context.networkError) },
    }];
  }

  if (!responses.length) {
    if (context.hideIfEmpty) {
      mount.innerHTML = '';
      mount.classList.add('hidden');
      return;
    }
    mount.innerHTML = `
      <section class="fade-in overflow-hidden rounded-2xl border border-amber-500/25 bg-amber-500/5 shadow-sm">
        <div class="border-b border-amber-500/15 px-5 py-4">
          <div class="text-[11px] font-semibold uppercase text-amber-700 dark:text-amber-300">No request sent</div>
          <h4 class="mt-0.5 font-black text-zinc-950 dark:text-white">${escapeHtml(moderatorResponseActionTitle(context.action))}</h4>
        </div>
        <p class="px-5 py-4 text-sm text-zinc-700 dark:text-zinc-300">The action stopped before contacting the endpoint. Check the form values and permissions.</p>
      </section>`;
    return;
  }

  const allOk = responses.every((response) => response.ok);
  const latest = responses[responses.length - 1];
  const shellClass = allOk
    ? 'border-emerald-500/25 bg-emerald-500/5'
    : 'border-red-500/25 bg-red-500/5';
  const statusClass = allOk
    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
    : 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300';
  const statusText = responses.length === 1
    ? `${latest.status || (allOk ? 'OK' : 'ERR')} ${allOk ? 'Success' : 'Error'}`
    : `${responses.filter((response) => response.ok).length}/${responses.length} successful`;

  const body = responses.length === 1
    ? `
      ${!latest.ok ? `<div class="mb-4 text-sm font-semibold text-red-700 dark:text-red-300">${escapeHtml(userResponseErrorMessage(latest.data, latest.status))}</div>` : ''}
      ${moderatorResponseStructuredData(latest.data)}
      ${moderatorResponseRawDetails(latest.data)}`
    : `
      <div class="mb-4 text-sm text-zinc-600 dark:text-zinc-300">${responses.length} related endpoint calls were made by this action.</div>
      <div class="space-y-3">
        ${responses.map((response, index) => `
          <details class="overflow-hidden rounded-xl border ${response.ok ? 'border-zinc-200/80 dark:border-white/10' : 'border-red-500/25'} bg-white/40 dark:bg-white/5" ${index === responses.length - 1 ? 'open' : ''}>
            <summary class="flex cursor-pointer list-none flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="min-w-0">
                <div class="flex items-center gap-2 text-xs font-bold">
                  <span class="rounded-md border border-zinc-200/80 bg-zinc-900/5 px-1.5 py-0.5 font-mono dark:border-white/10 dark:bg-white/5">${escapeHtml(response.method)}</span>
                  <span class="${response.ok ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}">${escapeHtml(String(response.status || 'ERR'))}</span>
                </div>
                <div class="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">${escapeHtml(String(response.url || '-'))}</div>
              </div>
              <span class="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Request ${index + 1}</span>
            </summary>
            <div class="border-t border-zinc-200/80 px-4 py-4 dark:border-white/10">
              ${!response.ok ? `<div class="mb-4 text-sm font-semibold text-red-700 dark:text-red-300">${escapeHtml(userResponseErrorMessage(response.data, response.status))}</div>` : ''}
              ${moderatorResponseStructuredData(response.data, { compact: true })}
              ${moderatorResponseRawDetails(response.data)}
            </div>
          </details>`).join('')}
      </div>`;

  mount.classList.remove('hidden');
  mount.innerHTML = `
    <section class="fade-in overflow-hidden rounded-2xl border ${shellClass} shadow-sm">
      <div class="flex flex-col gap-3 border-b border-zinc-200/80 px-5 py-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <div class="text-[11px] font-semibold uppercase text-zinc-500 dark:text-zinc-400">Endpoint response</div>
          <h4 class="mt-0.5 font-black text-zinc-950 dark:text-white">${escapeHtml(moderatorResponseActionTitle(context.action))}</h4>
          ${responses.length === 1 ? `<div class="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">${escapeHtml(`${latest.method} ${latest.url || '-'}`)}</div>` : ''}
        </div>
        <span class="self-start rounded-full border px-2.5 py-1 text-xs font-semibold sm:self-auto ${statusClass}">${escapeHtml(statusText)}</span>
      </div>
      <div class="p-5">${body}</div>
    </section>`;
}

async function runModeratorEndpointAction({ action, article, form = null }, callback) {
  const previousRequestContext = __moderatorRequestContext;
  const context = {
    action,
    article,
    form,
    responses: [],
    networkError: null,
    hideIfEmpty: true,
  };

  __moderatorRequestContext = context;
  beginModeratorEndpointResponse(context);

  try {
    const result = await callback();
    completeModeratorEndpointResponse(context);
    return result;
  } catch (error) {
    const data = { message: String(error) };
    completeModeratorEndpointResponse(context, {
      ok: false,
      status: 'ERR',
      data,
    });
    toast('Unexpected error', 'err');
    logActivity({
      title: moderatorResponseActionTitle(action),
      method: 'ERROR',
      url: '-',
      ok: false,
      status: 'ERR',
      data,
    });
    return null;
  } finally {
    if (__moderatorRequestContext === context) {
      __moderatorRequestContext =
        previousRequestContext === context ? null : previousRequestContext;
    }
  }
}

// USERS
const USER_ENDPOINT_RESPONSE_META = {
  'get-user': {
    title: 'User profile',
    success: 'User loaded',
  },
  'get-ow-usernames': {
    title: 'Overwatch usernames',
    success: 'Usernames loaded',
  },
  'link-fake': {
    title: 'Fake member link',
    success: 'Accounts linked',
  },
  'replace-overwatch': {
    title: 'Overwatch usernames',
    success: 'Usernames replaced',
  },
  'update-names': {
    title: 'User names',
    success: 'Names updated',
  },
  'create-fake': {
    title: 'Fake member',
    success: 'Member created',
  },
};

function userEndpointResponseMount(form, kind) {
  const subpanel = form?.closest?.('[data-subpanel]');
  if (!subpanel) return null;
  return subpanel.querySelector(
    `[data-user-endpoint-response="${CSS.escape(String(kind || ''))}"]`
  );
}

function userResponseValue(value, fallback = '—') {
  if (value == null || value === '') return fallback;
  return String(value);
}

function userResponseField(label, value, { mono = false, accent = false } = {}) {
  return `
    <div class="min-w-0 border-l-2 ${accent ? 'border-emerald-500/60' : 'border-zinc-300/80 dark:border-white/15'} pl-3">
      <div class="text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        ${escapeHtml(String(label))}
      </div>
      <div class="mt-1 break-words text-sm font-semibold ${mono ? 'font-mono tabular-nums' : ''} ${accent ? 'text-emerald-700 dark:text-emerald-300' : 'text-zinc-950 dark:text-white'}">
        ${escapeHtml(userResponseValue(value))}
      </div>
    </div>`;
}

function userResponseRawDetails(data, label = 'Response details') {
  let pretty = '';
  try {
    pretty = typeof data === 'string' ? data : JSON.stringify(data ?? null, null, 2);
  } catch {
    pretty = String(data ?? '');
  }

  return `
    <details class="mt-4 border-t border-zinc-200/80 pt-3 dark:border-white/10">
      <summary class="cursor-pointer select-none text-xs font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">
        ${escapeHtml(label)}
      </summary>
      <pre class="mt-3 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-zinc-950 p-3 font-mono text-xs text-zinc-100">${escapeHtml(pretty)}</pre>
    </details>`;
}

function userResponseErrorMessage(data, status) {
  const candidates = [
    data?.message,
    data?.error,
    data?.detail,
    data?.error?.message,
  ];
  const message = candidates.find((value) => typeof value === 'string' && value.trim());
  if (message) return message.trim();
  if (typeof data === 'string' && data.trim()) return data.trim();
  return `The request failed${status ? ` with status ${status}` : ''}.`;
}

function renderGetUserResponse(data) {
  const aliases = Array.isArray(data?.overwatch_usernames)
    ? data.overwatch_usernames.filter((value) => value != null && String(value).trim())
    : [];
  const coins = Number(data?.coins);
  const coinsText = Number.isFinite(coins) ? coins.toLocaleString() : userResponseValue(data?.coins);

  return `
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1 border-b border-zinc-200/80 pb-4 dark:border-white/10">
        <span class="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Display identity</span>
        <span class="text-xl font-black text-zinc-950 dark:text-white">${escapeHtml(userResponseValue(data?.coalesced_name, 'Unnamed user'))}</span>
        <span class="font-mono text-xs text-zinc-500 dark:text-zinc-400">${escapeHtml(userResponseValue(data?.id))}</span>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        ${userResponseField('Global name', data?.global_name)}
        ${userResponseField('Nickname', data?.nickname)}
        ${userResponseField('Coins', coinsText, { mono: true, accent: true })}
      </div>

      <div class="border-t border-zinc-200/80 pt-4 dark:border-white/10">
        <div class="text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Overwatch usernames</div>
        <div class="mt-2 flex flex-wrap gap-2">
          ${aliases.length
            ? aliases.map((username, index) => `
                <span class="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/70 px-3 py-1 text-sm font-semibold text-zinc-800 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
                  ${index === 0 ? '<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>' : ''}
                  ${escapeHtml(String(username))}
                </span>`).join('')
            : '<span class="text-sm text-zinc-500 dark:text-zinc-400">No Overwatch username.</span>'}
        </div>
      </div>
    </div>`;
}

function renderGetOverwatchResponse(data) {
  return `
    <div class="space-y-4">
      <div class="border-b border-zinc-200/80 pb-3 font-mono text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400">
        User ${escapeHtml(userResponseValue(data?.user_id))}
      </div>
      <div class="grid gap-4 sm:grid-cols-3">
        ${userResponseField('Primary', data?.primary, { accent: true })}
        ${userResponseField('Secondary', data?.secondary)}
        ${userResponseField('Tertiary', data?.tertiary)}
      </div>
    </div>`;
}

function renderUserOperationResponse(kind, data, meta) {
  if (kind === 'create-fake') {
    const memberId =
      typeof data === 'number' || typeof data === 'string'
        ? data
        : data?.id ?? data?.user_id ?? data?.member_id;
    return `
      <div class="flex flex-col gap-1">
        <span class="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Created member ID</span>
        <span class="font-mono text-2xl font-black tabular-nums text-emerald-700 dark:text-emerald-300">${escapeHtml(userResponseValue(memberId))}</span>
      </div>`;
  }

  if (kind === 'replace-overwatch' && data?.success === true) {
    return `
      <div>
        <div class="text-base font-black text-zinc-950 dark:text-white">${escapeHtml(meta.success)}</div>
        <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-300">The API confirmed the replacement.</p>
      </div>`;
  }

  if (Array.isArray(data) && data.length === 0) {
    return `
      <div>
        <div class="text-base font-black text-zinc-950 dark:text-white">${escapeHtml(meta.success)}</div>
        <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-300">The operation completed successfully. The API returned an empty array.</p>
      </div>`;
  }

  if (data == null || data === '') {
    return `
      <div>
        <div class="text-base font-black text-zinc-950 dark:text-white">${escapeHtml(meta.success)}</div>
        <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-300">The operation completed without a response body.</p>
      </div>`;
  }

  return `
    <div class="text-base font-black text-zinc-950 dark:text-white">${escapeHtml(meta.success)}</div>
    ${userResponseRawDetails(data)}`;
}

function renderUserEndpointResponse(form, kind, {
  pending = false,
  ok = false,
  status = '',
  data = null,
} = {}) {
  const mount = userEndpointResponseMount(form, kind);
  if (!mount) return;

  const meta = USER_ENDPOINT_RESPONSE_META[kind] || {
    title: 'Endpoint response',
    success: 'Request completed',
  };

  mount.classList.remove('hidden');

  if (pending) {
    mount.innerHTML = `
      <section class="fade-in overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/60 shadow-sm dark:border-white/10 dark:bg-zinc-900/55">
        <div class="flex items-center justify-between gap-3 border-b border-zinc-200/80 px-5 py-4 dark:border-white/10">
          <div>
            <div class="text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Endpoint response</div>
            <h4 class="mt-0.5 font-black text-zinc-950 dark:text-white">${escapeHtml(meta.title)}</h4>
          </div>
          <span class="rounded-full border border-zinc-200/80 bg-zinc-900/5 px-2.5 py-1 text-xs font-semibold text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">Loading</span>
        </div>
        <div class="space-y-3 p-5" aria-hidden="true">
          <div class="h-4 w-40 animate-pulse rounded bg-zinc-200 dark:bg-white/10"></div>
          <div class="h-3 w-full animate-pulse rounded bg-zinc-200/80 dark:bg-white/10"></div>
          <div class="h-3 w-2/3 animate-pulse rounded bg-zinc-200/80 dark:bg-white/10"></div>
        </div>
      </section>`;
    return;
  }

  const statusText = ok
    ? `${status || 'OK'} Success`
    : `${status || 'ERR'} Error`;
  const statusClass = ok
    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
    : 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300';
  const shellClass = ok
    ? 'border-emerald-500/25 bg-emerald-500/5'
    : 'border-red-500/25 bg-red-500/5';

  let body;
  if (!ok) {
    body = `
      <div>
        <div class="text-base font-black text-red-700 dark:text-red-300">Request failed</div>
        <p class="mt-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">${escapeHtml(userResponseErrorMessage(data, status))}</p>
      </div>
      ${userResponseRawDetails(data, 'Error details')}`;
  } else if (kind === 'get-user') {
    body = renderGetUserResponse(data);
  } else if (kind === 'get-ow-usernames') {
    body = renderGetOverwatchResponse(data);
  } else {
    body = renderUserOperationResponse(kind, data, meta);
  }

  mount.innerHTML = `
    <section class="fade-in overflow-hidden rounded-2xl border ${shellClass} shadow-sm">
      <div class="flex flex-col gap-3 border-b border-zinc-200/80 px-5 py-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Endpoint response</div>
          <h4 class="mt-0.5 font-black text-zinc-950 dark:text-white">${escapeHtml(meta.title)}</h4>
        </div>
        <span class="self-start rounded-full border px-2.5 py-1 text-xs font-semibold sm:self-auto ${statusClass}">
          ${escapeHtml(statusText)}
        </span>
      </div>
      <div class="p-5">${body}</div>
    </section>`;
}

// CONTENT
function movementTechPositiveId(raw, label) {
  const text = String(raw ?? '').trim();
  if (!/^\d+$/.test(text)) {
    return { error: `${label} must be a positive integer` };
  }

  const value = Number(text);
  if (!Number.isFinite(value) || value < 1) {
    return { error: `${label} must be a positive integer` };
  }

  return { value };
}

function movementTechDirection(raw) {
  const value = String(raw ?? '').trim().toLowerCase();
  if (value !== 'up' && value !== 'down') {
    return { error: 'direction must be up or down' };
  }

  return { value };
}

function movementTechNullableId(raw, label) {
  const text = String(raw ?? '').trim();
  if (!text) {
    return { omit: true };
  }

  if (/^null$/i.test(text)) {
    return { value: null };
  }

  if (!/^\d+$/.test(text)) {
    return { error: `${label} must be a positive integer or null` };
  }

  const value = Number(text);
  if (!Number.isFinite(value) || value < 1) {
    return { error: `${label} must be a positive integer or null` };
  }

  return { value };
}

function movementTechNullableString(raw) {
  const text = String(raw ?? '');
  const trimmed = text.trim();
  if (!trimmed) {
    return { omit: true };
  }

  if (/^null$/i.test(trimmed)) {
    return { value: null };
  }

  return { value: trimmed };
}

function movementTechErrorMessage(data, fallback = 'Request failed') {
  if (typeof data === 'string' && data.trim()) {
    return data.trim();
  }

  if (data && typeof data === 'object') {
    return data.error || data.message || fallback;
  }

  return fallback;
}

function movementTechPanelValue(res) {
  if (res.status === 204 && (res.data == null || res.data === '')) {
    return '(no content)';
  }

  return res.data ?? '';
}

function movementTechPublicListPath(entity) {
  if (entity === 'categories') {
    return '/categories';
  }

  if (entity === 'difficulties') {
    return '/difficulties';
  }

  return '/';
}

const movementTechContentMeta = {
  categories: {
    singular: 'Category',
    plural: 'Categories',
    outKey: 'content-categories-res',
    listAction: 'content-category-list',
  },
  difficulties: {
    singular: 'Difficulty',
    plural: 'Difficulties',
    outKey: 'content-difficulties-res',
    listAction: 'content-difficulty-list',
  },
  techniques: {
    singular: 'Technique',
    plural: 'Techniques',
    outKey: 'content-techniques-res',
    listAction: 'content-technique-list',
  },
};

const movementTechContentCache = {
  categories: [],
  difficulties: [],
  techniques: [],
};

function movementTechContentOptionLabel(entity, item) {
  if (entity === 'techniques') {
    const id = item?.id == null ? '' : `#${item.id}`;
    const name = String(item?.name ?? 'Unnamed technique').trim();
    const difficulty =
      item?.difficulty?.name ??
      item?.difficulty_name ??
      item?.difficulty_label ??
      '';
    const category =
      item?.category?.name ??
      item?.category_name ??
      item?.category_label ??
      '';
    const meta = [category, difficulty].filter(Boolean).join(' - ');
    return [id, name].filter(Boolean).join(' - ') + (meta ? ` (${meta})` : '');
  }

  const id = item?.id == null ? '' : `#${item.id}`;
  const name = String(item?.name ?? '').trim() || 'Unnamed';
  return [id, name].filter(Boolean).join(' - ');
}

function movementTechBuildContentDropdownOption(selectName, value, labelText, radioName = `${selectName}_ui`) {
  const wrapper = document.createElement('label');
  wrapper.className =
    'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5';

  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.name = radioName;
  radio.value = value;
  radio.dataset.label = labelText;
  radio.dataset.ddTargetName = selectName;
  radio.className = 'accent-emerald-500';

  const label = document.createElement('span');
  label.textContent = labelText;

  wrapper.appendChild(radio);
  wrapper.appendChild(label);
  return wrapper;
}

function movementTechPopulateContentDropdowns(entity) {
  const items = Array.isArray(movementTechContentCache[entity]) ? movementTechContentCache[entity] : [];

  document.querySelectorAll(`[data-content-options="${entity}"]`).forEach((dd) => {
    const select = dd.querySelector('select[name]');
    const list = dd.querySelector('[data-dd-list]');
    const btn = dd.querySelector('[data-dd-btn]');
    const placeholder = dd.dataset.placeholder || btn?.getAttribute('data-placeholder') || 'Select...';
    const nullLabel = dd.dataset.nullOption || '';
    if (!select || !list || !btn) {
      return;
    }

    const currentValue = String(select.value ?? '');
    const optionDefs = [{ value: '', label: placeholder }];
    if (nullLabel) {
      optionDefs.push({ value: 'null', label: nullLabel });
    }
    items.forEach((item) => {
      optionDefs.push({
        value: String(item?.id ?? ''),
        label: movementTechContentOptionLabel(entity, item),
      });
    });

    select.innerHTML = '';
    optionDefs.forEach((opt) => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      select.appendChild(option);
    });

    list.innerHTML = '';
    optionDefs.forEach((opt) => {
      list.appendChild(
        movementTechBuildContentDropdownOption(select.name, opt.value, opt.label)
      );
    });

    const canKeepCurrent = optionDefs.some((opt) => opt.value === currentValue);
    select.value = canKeepCurrent ? currentValue : '';
    movementTechSyncDdField(select);
  });

  document.querySelectorAll(`[data-content-count="${entity}"]`).forEach((el) => {
    el.textContent = items.length ? `${items.length} synced` : 'No items synced';
  });
}

async function loadContentEntityCollection(
  entity,
  {
    form = null,
    successMessage,
    failureMessage,
    pendingMessage,
    silentSuccess = false,
    silentFailure = false,
  } = {}
) {
  const meta = movementTechContentMeta[entity];
  if (!meta) {
    return null;
  }

  const res = await submitMovementTechRequest(form, {
    method: 'GET',
    baseUrl: API_CONTENT_PUBLIC,
    path: movementTechPublicListPath(entity),
    title: `List movement tech ${meta.plural.toLowerCase()}`,
    outKey: meta.outKey,
    successMessage,
    failureMessage,
    pendingMessage,
    silentSuccess,
    silentFailure,
  });

  if (res?.ok) {
    movementTechContentCache[entity] = movementTechListResponseItems(entity, res.data);
    movementTechPopulateContentDropdowns(entity);
  }

  return res;
}

function ensureContentMovementTechData(name) {
  if (name === 'content-categories') {
    if (!movementTechContentCache.categories.length) {
      loadContentEntityCollection('categories', {
        successMessage: 'Categories loaded',
        failureMessage: 'Failed to load categories',
        pendingMessage: 'Loading categories...',
        silentSuccess: true,
      });
    }
    return;
  }

  if (name === 'content-difficulties') {
    if (!movementTechContentCache.difficulties.length) {
      loadContentEntityCollection('difficulties', {
        successMessage: 'Difficulties loaded',
        failureMessage: 'Failed to load difficulties',
        pendingMessage: 'Loading difficulties...',
        silentSuccess: true,
      });
    }
    return;
  }

  if (name === 'content-techniques') {
    if (!movementTechContentCache.categories.length) {
      loadContentEntityCollection('categories', {
        successMessage: 'Categories loaded',
        failureMessage: 'Failed to load categories',
        pendingMessage: 'Loading categories...',
        silentSuccess: true,
      });
    }
    if (!movementTechContentCache.difficulties.length) {
      loadContentEntityCollection('difficulties', {
        successMessage: 'Difficulties loaded',
        failureMessage: 'Failed to load difficulties',
        pendingMessage: 'Loading difficulties...',
        silentSuccess: true,
      });
    }
    if (!movementTechContentCache.techniques.length) {
      loadContentEntityCollection('techniques', {
        successMessage: 'Techniques loaded',
        failureMessage: 'Failed to load techniques',
        pendingMessage: 'Loading techniques...',
        silentSuccess: true,
      });
    }
  }
}

function movementTechListResponseItems(entity, data) {
  const items = data?.[entity];
  return Array.isArray(items) ? items : [];
}

function movementTechSyncDdField(field) {
  const name = field?.name;
  if (!name) {
    return;
  }

  const dd =
    field.closest?.('[data-dd-select]') ||
    document.querySelector(`[data-dd-select][data-dd-field="${CSS.escape(name)}"]`);

  if (!dd) {
    return;
  }

  const btn = dd.querySelector('[data-dd-btn]');
  const label = btn?.querySelector('.dd-label');
  const list = dd.querySelector('[data-dd-list]');
  const placeholder =
    btn?.getAttribute('data-placeholder') ||
    label?.dataset?.placeholder ||
    'Select...';

  if (label && !label.dataset.placeholder) {
    label.dataset.placeholder = placeholder;
  }

  const value = String(field.value ?? '');
  const radios = Array.from(
    list?.querySelectorAll(
      [
        `input[type="radio"][name="${CSS.escape(name)}_ui"]`,
        `input[type="radio"][data-dd-target-name="${CSS.escape(name)}"]`,
      ].join(',')
    ) || []
  );

  let matched = null;
  radios.forEach((radio) => {
    const isMatch = String(radio.value) === value;
    radio.checked = isMatch;
    if (isMatch) {
      matched = radio;
    }
  });

  if (!matched && value === '') {
    matched = radios.find((radio) => String(radio.value) === '') || null;
    if (matched) {
      matched.checked = true;
    }
  }

  if (label) {
    const text =
      matched?.dataset?.label ||
      matched?.parentElement?.querySelector('span:last-child')?.textContent ||
      placeholder;
    label.textContent = text || placeholder;
  }
}

function movementTechSetFieldValue(form, name, value) {
  const field = form?.elements?.namedItem(name);
  if (!field || Array.isArray(field)) {
    return;
  }

  field.value = value ?? '';
  movementTechSyncDdField(field);
}

function movementTechRepeaterLabel(kind) {
  return kind === 'videos' ? 'Video' : 'Tip';
}

function movementTechGetRepeater(form, kind) {
  return form?.querySelector?.(`[data-mt-repeater="${kind}"]`) || null;
}

function movementTechGetRepeaterItems(repeater) {
  return Array.from(repeater?.querySelectorAll?.('[data-mt-item]') || []);
}

function movementTechGetCurrentSection(form, kind) {
  return form?.querySelector?.(`[data-mt-current="${kind}"]`) || null;
}

function movementTechGetCurrentTechniqueItems(section) {
  return Array.from(section?.querySelectorAll?.('[data-mt-current-item]') || []);
}

function movementTechRefreshRepeater(repeater) {
  if (!repeater) {
    return;
  }

  const kind = repeater.dataset.mtRepeater || 'tips';
  const items = movementTechGetRepeaterItems(repeater);
  const empty = repeater.querySelector('[data-mt-empty]');

  if (empty) {
    empty.classList.toggle('hidden', items.length > 0);
  }

  items.forEach((item, index) => {
    const label = item.querySelector('[data-mt-item-label]');
    if (label) {
      label.textContent = `${movementTechRepeaterLabel(kind)} ${index + 1}`;
    }

    const upBtn = item.querySelector('[data-mt-move="up"]');
    if (upBtn) {
      upBtn.disabled = index === 0;
      upBtn.classList.toggle('opacity-50', index === 0);
    }

    const downBtn = item.querySelector('[data-mt-move="down"]');
    if (downBtn) {
      downBtn.disabled = index === items.length - 1;
      downBtn.classList.toggle('opacity-50', index === items.length - 1);
    }
  });
}

function movementTechRefreshCurrentTechniqueRows(section) {
  if (!section) {
    return;
  }

  const kind = section.dataset.mtCurrent || 'tips';
  const items = movementTechGetCurrentTechniqueItems(section);
  const empty = section.querySelector('[data-mt-current-empty]');

  if (empty) {
    empty.classList.toggle('hidden', items.length > 0);
  }

  items.forEach((item, index) => {
    const label = item.querySelector('[data-mt-current-label]');
    if (label) {
      label.textContent = `${movementTechRepeaterLabel(kind)} ${index + 1}`;
    }
  });
}

function movementTechBuildRepeaterItem(kind, value = {}) {
  const item = document.createElement('div');
  item.dataset.mtItem = '1';
  item.className = 'rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 p-3 space-y-3';

  if (kind === 'videos') {
    item.innerHTML = `
      <div class="flex items-center justify-between gap-2">
        <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100" data-mt-item-label>Video</div>
        <div class="flex items-center gap-1.5">
          <button type="button" data-mt-move="up" class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10">Up</button>
          <button type="button" data-mt-move="down" class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10">Down</button>
          <button type="button" data-mt-remove="1" class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10">Remove</button>
        </div>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="text-sm sm:col-span-2">
          url
          <input data-field="url" type="url" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" placeholder="https://youtube.com/watch?v=..." />
        </label>
        <label class="text-sm sm:col-span-2">
          caption
          <input data-field="caption" type="text" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" placeholder="Example clip" />
        </label>
      </div>
    `;

    item.querySelector('[data-field="url"]').value = String(value?.url ?? '');
    item.querySelector('[data-field="caption"]').value = value?.caption == null ? '' : String(value.caption);
    return item;
  }

  item.innerHTML = `
    <div class="flex items-center justify-between gap-2">
      <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100" data-mt-item-label>Tip</div>
      <div class="flex items-center gap-1.5">
        <button type="button" data-mt-move="up" class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10">Up</button>
        <button type="button" data-mt-move="down" class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10">Down</button>
        <button type="button" data-mt-remove="1" class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10">Remove</button>
      </div>
    </div>
    <label class="block text-sm">
      text
      <textarea data-field="text" rows="3" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" placeholder="Approach at a slight angle."></textarea>
    </label>
  `;

  item.querySelector('[data-field="text"]').value = String(value?.text ?? '');
  return item;
}

function movementTechAppendRepeaterItem(repeater, kind, value = {}, focusField = false) {
  const itemsHost = repeater?.querySelector('[data-mt-items]');
  if (!itemsHost) {
    return null;
  }

  const item = movementTechBuildRepeaterItem(kind, value);
  itemsHost.appendChild(item);
  movementTechRefreshRepeater(repeater);

  if (focusField) {
    item.querySelector('[data-field]')?.focus();
  }

  return item;
}

function movementTechSetTechniqueRows(form, kind, rows) {
  const repeater = movementTechGetRepeater(form, kind);
  const itemsHost = repeater?.querySelector('[data-mt-items]');
  if (!repeater || !itemsHost) {
    return;
  }

  itemsHost.innerHTML = '';
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    movementTechAppendRepeaterItem(repeater, kind, row, false);
  });
  movementTechRefreshRepeater(repeater);
}

function movementTechReadTipRows(form) {
  const rows = [];

  movementTechGetRepeaterItems(movementTechGetRepeater(form, 'tips')).forEach((item) => {
    const text = String(item.querySelector('[data-field="text"]')?.value ?? '').trim();
    if (!text) {
      return;
    }

    rows.push({
      text,
      sort_order: rows.length + 1,
    });
  });

  return { value: rows };
}

function movementTechReadVideoRows(form) {
  const rows = [];

  for (const item of movementTechGetRepeaterItems(movementTechGetRepeater(form, 'videos'))) {
    const url = String(item.querySelector('[data-field="url"]')?.value ?? '').trim();
    const caption = String(item.querySelector('[data-field="caption"]')?.value ?? '').trim();

    if (!url && !caption) {
      continue;
    }

    if (!url) {
      return { error: 'video url is required' };
    }

    rows.push({
      url,
      caption: caption || null,
      sort_order: rows.length + 1,
    });
  }

  return { value: rows };
}

function movementTechReadCurrentTechniqueRows(form, kind) {
  return movementTechGetCurrentTechniqueItems(movementTechGetCurrentSection(form, kind))
    .map((item) => {
      try {
        return JSON.parse(item.dataset.mtCurrentRow || 'null');
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function movementTechRenderCurrentTechniqueRows(form, kind, rows) {
  const section = movementTechGetCurrentSection(form, kind);
  const itemsHost = section?.querySelector?.('[data-mt-current-items]');

  if (!section || !itemsHost) {
    return;
  }

  const normalized = kind === 'videos'
    ? movementTechComparableVideos(rows)
    : movementTechComparableTips(rows);

  itemsHost.innerHTML = '';

  normalized.forEach((row, index) => {
    const item = document.createElement('div');
    item.dataset.mtCurrentItem = '1';
    item.dataset.mtCurrentRow = JSON.stringify(row);
    item.className = 'rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 space-y-2';

    const header = document.createElement('div');
    header.className = 'flex items-center justify-between gap-2';

    const label = document.createElement('div');
    label.dataset.mtCurrentLabel = '1';
    label.className = 'text-xs font-semibold text-zinc-900 dark:text-zinc-100';
    label.textContent = `${movementTechRepeaterLabel(kind)} ${index + 1}`;
    header.appendChild(label);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.dataset.mtCurrentRemove = '1';
    removeBtn.className = 'rounded-lg border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10';
    removeBtn.textContent = 'Remove';
    header.appendChild(removeBtn);

    item.appendChild(header);

    if (kind === 'videos') {
      const url = document.createElement('div');
      url.className = 'text-xs font-mono break-all text-zinc-700 dark:text-zinc-300';
      url.textContent = row.url;
      item.appendChild(url);

      const caption = document.createElement('div');
      caption.className = 'text-xs text-zinc-500 dark:text-zinc-400';
      caption.textContent = row.caption || 'No caption';
      item.appendChild(caption);
    } else {
      const text = document.createElement('div');
      text.className = 'text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap';
      text.textContent = row.text;
      item.appendChild(text);
    }

    itemsHost.appendChild(item);
  });

  movementTechRefreshCurrentTechniqueRows(section);
}

function movementTechInitTechniqueEditor(form) {
  if (!form || form.dataset.mtTechniqueEditorBound === '1') {
    return;
  }

  form.dataset.mtTechniqueEditorBound = '1';

  form.addEventListener('click', (event) => {
    const addBtn = event.target.closest('[data-mt-add]');
    if (addBtn) {
      event.preventDefault();
      const kind = addBtn.getAttribute('data-mt-add');
      const repeater = movementTechGetRepeater(form, kind);
      if (repeater) {
        movementTechAppendRepeaterItem(repeater, kind, {}, true);
      }
      return;
    }

    const currentRemoveBtn = event.target.closest('[data-mt-current-remove]');
    if (currentRemoveBtn) {
      event.preventDefault();
      const currentItem = currentRemoveBtn.closest('[data-mt-current-item]');
      const currentSection = currentItem?.closest('[data-mt-current]');

      if (currentItem) {
        currentItem.remove();
      }

      movementTechRefreshCurrentTechniqueRows(currentSection);
      return;
    }

    const item = event.target.closest('[data-mt-item]');
    if (!item) {
      return;
    }

    const repeater = item.closest('[data-mt-repeater]');
    if (!repeater) {
      return;
    }

    const removeBtn = event.target.closest('[data-mt-remove]');
    if (removeBtn) {
      event.preventDefault();
      item.remove();
      movementTechRefreshRepeater(repeater);
      return;
    }

    const moveBtn = event.target.closest('[data-mt-move]');
    if (!moveBtn) {
      return;
    }

    event.preventDefault();
    const direction = moveBtn.getAttribute('data-mt-move');
    if (direction === 'up' && item.previousElementSibling) {
      item.parentNode.insertBefore(item, item.previousElementSibling);
    } else if (direction === 'down' && item.nextElementSibling) {
      item.parentNode.insertBefore(item.nextElementSibling, item);
    }

    movementTechRefreshRepeater(repeater);
  });

  ['tips', 'videos'].forEach((kind) => {
    movementTechRefreshRepeater(movementTechGetRepeater(form, kind));
  });
}

function movementTechComparableTips(tips) {
  if (!Array.isArray(tips)) {
    return [];
  }

  return tips.map((tip, index) => ({
    text: String(tip?.text ?? ''),
    sort_order: index + 1,
  }));
}

function movementTechComparableVideos(videos) {
  if (!Array.isArray(videos)) {
    return [];
  }

  return videos.map((video, index) => ({
    url: String(video?.url ?? ''),
    caption: video?.caption == null ? null : String(video.caption),
    sort_order: index + 1,
  }));
}

function movementTechTechniqueSnapshotFromResponse(technique) {
  return {
    name: String(technique?.name ?? ''),
    description: technique?.description == null ? null : String(technique.description),
    instructions: technique?.instructions == null ? null : String(technique.instructions),
    category_id: technique?.category_id == null ? null : Number(technique.category_id),
    difficulty_id: technique?.difficulty_id == null ? null : Number(technique.difficulty_id),
    tips: movementTechComparableTips(technique?.tips),
    videos: movementTechComparableVideos(technique?.videos),
  };
}

function movementTechReadTechniqueSnapshot(form) {
  const raw = form?.dataset?.movementTechTechniqueSnapshot;
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function movementTechStoreTechniqueSnapshot(form, technique) {
  form.dataset.movementTechTechniqueSnapshot = JSON.stringify(
    movementTechTechniqueSnapshotFromResponse(technique)
  );
}

function movementTechClearTechniqueSnapshot(form) {
  delete form.dataset.movementTechTechniqueSnapshot;
}

function movementTechFillTechniqueUpdateForm(form, technique) {
  const snapshot = movementTechTechniqueSnapshotFromResponse(technique);

  movementTechSetFieldValue(form, 'name', snapshot.name);
  movementTechSetFieldValue(form, 'description', snapshot.description ?? '');
  movementTechSetFieldValue(form, 'instructions', snapshot.instructions ?? '');
  movementTechSetFieldValue(form, 'category_id', snapshot.category_id == null ? '' : String(snapshot.category_id));
  movementTechSetFieldValue(form, 'difficulty_id', snapshot.difficulty_id == null ? '' : String(snapshot.difficulty_id));
  movementTechRenderCurrentTechniqueRows(form, 'tips', snapshot.tips);
  movementTechRenderCurrentTechniqueRows(form, 'videos', snapshot.videos);
  movementTechSetTechniqueRows(form, 'tips', []);
  movementTechSetTechniqueRows(form, 'videos', []);
  const clearTips = form.querySelector('[name="clear_tips"]');
  const clearVideos = form.querySelector('[name="clear_videos"]');
  if (clearTips) {
    clearTips.checked = false;
  }
  if (clearVideos) {
    clearVideos.checked = false;
  }
}

function movementTechClearNamedEntityUpdateForm(form) {
  movementTechSetFieldValue(form, 'name', '');
  delete form.dataset.movementTechLoadedId;
}

function movementTechClearTechniqueUpdateForm(form) {
  movementTechSetFieldValue(form, 'name', '');
  movementTechSetFieldValue(form, 'description', '');
  movementTechSetFieldValue(form, 'instructions', '');
  movementTechSetFieldValue(form, 'category_id', '');
  movementTechSetFieldValue(form, 'difficulty_id', '');
  movementTechRenderCurrentTechniqueRows(form, 'tips', []);
  movementTechRenderCurrentTechniqueRows(form, 'videos', []);
  movementTechSetTechniqueRows(form, 'tips', []);
  movementTechSetTechniqueRows(form, 'videos', []);
  const clearTips = form.querySelector('[name="clear_tips"]');
  const clearVideos = form.querySelector('[name="clear_videos"]');
  if (clearTips) {
    clearTips.checked = false;
  }
  if (clearVideos) {
    clearVideos.checked = false;
  }
  delete form.dataset.movementTechLoadedId;
  movementTechClearTechniqueSnapshot(form);
}

async function submitMovementTechRequest(
  form,
  {
    method,
    path,
    title,
    outKey,
    body,
    successMessage,
    failureMessage,
    baseUrl = API_CONTENT_MODS,
    pendingMessage,
    silentSuccess = false,
    silentFailure = false,
  }
) {
  const pending = pendingMessage || (method === 'GET' ? 'Loading...' : method === 'DELETE' ? 'Deleting...' : 'Saving...');
  setPanelOut(form, outKey, pending);

  const res = body === undefined
    ? await http(method, `${baseUrl}${path}`)
    : await http(method, `${baseUrl}${path}`, { body });

  logActivity({ title, method, url: res.url, ok: res.ok, status: res.status, data: res.data });
  setPanelOut(form, outKey, movementTechPanelValue(res));

  if (res.ok) {
    if (!silentSuccess && successMessage) {
      toast(successMessage, 'ok');
    }
  } else if (!silentFailure) {
    toast(movementTechErrorMessage(res.data, failureMessage), 'err');
  }

  return res;
}

async function handleContentListEntity(form, entity, label, outKey) {
  return loadContentEntityCollection(entity, {
    form,
    successMessage: `${label} loaded`,
    failureMessage: `Failed to load ${label.toLowerCase()}`,
  });
}

async function loadContentNamedEntityIntoUpdateForm(form, entity, label, outKey) {
  const rawId = String(form.id?.value ?? '').trim();
  if (!rawId) {
    movementTechClearNamedEntityUpdateForm(form);
    return null;
  }

  const id = movementTechPositiveId(rawId, `${label.toLowerCase()}_id`);
  if (id.error) {
    return null;
  }

  if (form.dataset.movementTechLoadedId === String(id.value)) {
    return null;
  }

  let item = movementTechContentCache[entity].find((entry) => Number(entry?.id) === id.value);
  let res = null;

  if (!item) {
    res = await loadContentEntityCollection(entity, {
      form,
      failureMessage: `Failed to load ${label.toLowerCase()} list`,
      pendingMessage: 'Loading current values...',
      silentSuccess: true,
      silentFailure: true,
    });

    if (!res?.ok) {
      toast(movementTechErrorMessage(res?.data, `Failed to load ${label.toLowerCase()} list`), 'err');
      return res;
    }

    item = movementTechContentCache[entity].find((entry) => Number(entry?.id) === id.value);
    if (!item) {
      toast(`${label} #${id.value} not found`, 'warn');
      movementTechClearNamedEntityUpdateForm(form);
      return res;
    }
  }

  movementTechSetFieldValue(form, 'name', item.name ?? '');
  form.dataset.movementTechLoadedId = String(id.value);
  return res;
}

async function loadContentTechniqueIntoUpdateForm(form, outKey) {
  const rawId = String(form.id?.value ?? '').trim();
  if (!rawId) {
    movementTechClearTechniqueUpdateForm(form);
    return null;
  }

  const id = movementTechPositiveId(rawId, 'technique_id');
  if (id.error) {
    return null;
  }

  if (form.dataset.movementTechLoadedId === String(id.value)) {
    return null;
  }

  const res = await submitMovementTechRequest(form, {
    method: 'GET',
    path: `/techniques/${id.value}`,
    title: `Get movement technique #${id.value}`,
    outKey,
    failureMessage: 'Failed to load technique',
    pendingMessage: 'Loading current values...',
    silentSuccess: true,
    silentFailure: true,
  });

  if (!res.ok || !res.data || typeof res.data !== 'object') {
    toast(movementTechErrorMessage(res.data, 'Failed to load technique'), 'err');
    movementTechClearTechniqueUpdateForm(form);
    return res;
  }

  movementTechFillTechniqueUpdateForm(form, res.data);
  movementTechStoreTechniqueSnapshot(form, res.data);
  form.dataset.movementTechLoadedId = String(id.value);
  return res;
}

function bindMovementTechAutoLoad(formSelector, loader, clearForm) {
  document.querySelectorAll(formSelector).forEach((form) => {
    const idInput = form.querySelector('input[name="id"], select[name="id"]');
    if (!idInput || idInput.dataset.movementTechAutoloadBound === '1') {
      return;
    }

    idInput.dataset.movementTechAutoloadBound = '1';
    idInput.addEventListener('input', () => {
      delete form.dataset.movementTechLoadedId;
      if (!String(idInput.value ?? '').trim() && typeof clearForm === 'function') {
        clearForm(form);
      }
    });

    const trigger = () => loader(form);
    idInput.addEventListener('change', trigger);
    idInput.addEventListener('blur', trigger);
  });
}

async function handleContentCreateNamedEntity(form, entity, label, outKey) {
  const name = (form.name?.value || '').trim();
  if (!name) {
    toast('name is required', 'warn');
    return;
  }

  const res = await submitMovementTechRequest(form, {
    method: 'POST',
    path: `/${entity}`,
    title: `Create movement tech ${label.toLowerCase()}`,
    outKey,
    body: { name },
    successMessage: `${label} created`,
    failureMessage: `Failed to create ${label.toLowerCase()}`,
  });

  if (res?.ok) {
    await loadContentEntityCollection(entity, {
      form,
      failureMessage: `Failed to load ${label.toLowerCase()} list`,
      pendingMessage: 'Refreshing list...',
      silentSuccess: true,
      silentFailure: true,
    });
  }

  return res;
}

async function handleContentUpdateNamedEntity(form, entity, label, outKey) {
  const id = movementTechPositiveId(form.id?.value, `${label.toLowerCase()}_id`);
  if (id.error) {
    toast(id.error, 'warn');
    return;
  }

  const name = (form.name?.value || '').trim();
  if (!name) {
    toast('name is required', 'warn');
    return;
  }

  const res = await submitMovementTechRequest(form, {
    method: 'PUT',
    path: `/${entity}/${id.value}`,
    title: `Update movement tech ${label.toLowerCase()} #${id.value}`,
    outKey,
    body: { name },
    successMessage: `${label} updated`,
    failureMessage: `Failed to update ${label.toLowerCase()}`,
  });

  if (res?.ok) {
    await loadContentEntityCollection(entity, {
      form,
      failureMessage: `Failed to load ${label.toLowerCase()} list`,
      pendingMessage: 'Refreshing list...',
      silentSuccess: true,
      silentFailure: true,
    });
  }

  return res;
}

async function handleContentDeleteNamedEntity(form, entity, label, outKey) {
  const id = movementTechPositiveId(form.id?.value, `${label.toLowerCase()}_id`);
  if (id.error) {
    toast(id.error, 'warn');
    return;
  }

  const res = await submitMovementTechRequest(form, {
    method: 'DELETE',
    path: `/${entity}/${id.value}`,
    title: `Delete movement tech ${label.toLowerCase()} #${id.value}`,
    outKey,
    successMessage: `${label} deleted`,
    failureMessage: `Failed to delete ${label.toLowerCase()}`,
  });

  if (res?.ok) {
    movementTechSetFieldValue(form, 'id', '');
    movementTechClearNamedEntityUpdateForm(form);
    await loadContentEntityCollection(entity, {
      form,
      failureMessage: `Failed to load ${label.toLowerCase()} list`,
      pendingMessage: 'Refreshing list...',
      silentSuccess: true,
      silentFailure: true,
    });
  }

  return res;
}

async function handleContentReorderNamedEntity(form, entity, label, outKey) {
  const id = movementTechPositiveId(form.id?.value, `${label.toLowerCase()}_id`);
  if (id.error) {
    toast(id.error, 'warn');
    return;
  }

  const direction = movementTechDirection(form.direction?.value);
  if (direction.error) {
    toast(direction.error, 'warn');
    return;
  }

  const res = await submitMovementTechRequest(form, {
    method: 'POST',
    path: `/${entity}/${id.value}/reorder`,
    title: `Reorder movement tech ${label.toLowerCase()} #${id.value}`,
    outKey,
    body: { direction: direction.value },
    successMessage: `${label} reordered`,
    failureMessage: `Failed to reorder ${label.toLowerCase()}`,
  });

  if (res?.ok) {
    await loadContentEntityCollection(entity, {
      form,
      failureMessage: `Failed to load ${label.toLowerCase()} list`,
      pendingMessage: 'Refreshing list...',
      silentSuccess: true,
      silentFailure: true,
    });
  }

  return res;
}
function buildMovementTechTechniquePayload(form, { requireName = false } = {}) {
  const payload = {};
  const name = (form.name?.value || '').trim();
  if (requireName && !name) {
    return { error: 'name is required' };
  }
  if (name) {
    payload.name = name;
  }

  const description = movementTechNullableString(form.description?.value);
  if (!description.omit) {
    payload.description = description.value;
  }

  const instructions = movementTechNullableString(form.instructions?.value);
  if (!instructions.omit) {
    payload.instructions = instructions.value;
  }

  const categoryId = movementTechNullableId(form.category_id?.value, 'category_id');
  if (categoryId.error) {
    return categoryId;
  }
  if (!categoryId.omit) {
    payload.category_id = categoryId.value;
  }

  const difficultyId = movementTechNullableId(form.difficulty_id?.value, 'difficulty_id');
  if (difficultyId.error) {
    return difficultyId;
  }
  if (!difficultyId.omit) {
    payload.difficulty_id = difficultyId.value;
  }

  const snapshot = !requireName ? movementTechReadTechniqueSnapshot(form) : null;
  const clearTips = !requireName && form.querySelector('[name="clear_tips"]')?.checked === true;
  const clearVideos = !requireName && form.querySelector('[name="clear_videos"]')?.checked === true;
  const currentTips = requireName ? [] : movementTechReadCurrentTechniqueRows(form, 'tips');
  const currentVideos = requireName ? [] : movementTechReadCurrentTechniqueRows(form, 'videos');

  const tips = movementTechReadTipRows(form);
  if (tips.error) {
    return tips;
  }
  const desiredTips = movementTechComparableTips([
    ...(clearTips ? [] : currentTips),
    ...tips.value,
  ]);
  const tipsChanged = !requireName
    && JSON.stringify(desiredTips) !== JSON.stringify(movementTechComparableTips(snapshot?.tips));
  if (requireName ? desiredTips.length > 0 : (clearTips || tips.value.length > 0 || tipsChanged)) {
    payload.tips = desiredTips;
  }

  const videos = movementTechReadVideoRows(form);
  if (videos.error) {
    return videos;
  }
  const desiredVideos = movementTechComparableVideos([
    ...(clearVideos ? [] : currentVideos),
    ...videos.value,
  ]);
  const videosChanged = !requireName
    && JSON.stringify(desiredVideos) !== JSON.stringify(movementTechComparableVideos(snapshot?.videos));
  if (requireName ? desiredVideos.length > 0 : (clearVideos || videos.value.length > 0 || videosChanged)) {
    payload.videos = desiredVideos;
  }

  if (!requireName) {
    if (snapshot) {
      if (payload.name === snapshot.name) {
        delete payload.name;
      }

      if ('description' in payload && payload.description === snapshot.description) {
        delete payload.description;
      }

      if ('instructions' in payload && payload.instructions === snapshot.instructions) {
        delete payload.instructions;
      }

      if ('category_id' in payload && payload.category_id === snapshot.category_id) {
        delete payload.category_id;
      }

      if ('difficulty_id' in payload && payload.difficulty_id === snapshot.difficulty_id) {
        delete payload.difficulty_id;
      }
    }
  }

  return { payload };
}

async function handleContentTechniqueCreate(form) {
  const built = buildMovementTechTechniquePayload(form, { requireName: true });
  if (built.error) {
    toast(built.error, 'warn');
    return;
  }

  const res = await submitMovementTechRequest(form, {
    method: 'POST',
    path: '/techniques',
    title: 'Create movement technique',
    outKey: 'content-techniques-res',
    body: built.payload,
    successMessage: 'Technique created',
    failureMessage: 'Failed to create technique',
  });

  if (res?.ok) {
    await loadContentEntityCollection('techniques', {
      form,
      failureMessage: 'Failed to load technique list',
      pendingMessage: 'Refreshing list...',
      silentSuccess: true,
      silentFailure: true,
    });
  }

  return res;
}

async function handleContentTechniqueGet(form) {
  const id = movementTechPositiveId(form.id?.value, 'technique_id');
  if (id.error) {
    toast(id.error, 'warn');
    return;
  }

  return submitMovementTechRequest(form, {
    method: 'GET',
    path: `/techniques/${id.value}`,
    title: `Get movement technique #${id.value}`,
    outKey: 'content-techniques-res',
    successMessage: 'Technique loaded',
    failureMessage: 'Failed to load technique',
  });
}

async function handleContentTechniqueUpdate(form) {
  const id = movementTechPositiveId(form.id?.value, 'technique_id');
  if (id.error) {
    toast(id.error, 'warn');
    return;
  }

  const built = buildMovementTechTechniquePayload(form);
  if (built.error) {
    toast(built.error, 'warn');
    return;
  }

  if (Object.keys(built.payload).length === 0) {
    toast('Nothing to update', 'warn');
    return;
  }

  const res = await submitMovementTechRequest(form, {
    method: 'PUT',
    path: `/techniques/${id.value}`,
    title: `Update movement technique #${id.value}`,
    outKey: 'content-techniques-res',
    body: built.payload,
    successMessage: 'Technique updated',
    failureMessage: 'Failed to update technique',
  });

  if (res?.ok && res.data && typeof res.data === 'object') {
    movementTechFillTechniqueUpdateForm(form, res.data);
    movementTechStoreTechniqueSnapshot(form, res.data);
    form.dataset.movementTechLoadedId = String(res.data.id ?? id.value);
    await loadContentEntityCollection('techniques', {
      form,
      failureMessage: 'Failed to load technique list',
      pendingMessage: 'Refreshing list...',
      silentSuccess: true,
      silentFailure: true,
    });
  }

  return res;
}

async function handleContentTechniqueDelete(form) {
  const id = movementTechPositiveId(form.id?.value, 'technique_id');
  if (id.error) {
    toast(id.error, 'warn');
    return;
  }

  const res = await submitMovementTechRequest(form, {
    method: 'DELETE',
    path: `/techniques/${id.value}`,
    title: `Delete movement technique #${id.value}`,
    outKey: 'content-techniques-res',
    successMessage: 'Technique deleted',
    failureMessage: 'Failed to delete technique',
  });

  if (res?.ok) {
    movementTechSetFieldValue(form, 'id', '');
    movementTechClearTechniqueUpdateForm(form);
    await loadContentEntityCollection('techniques', {
      form,
      failureMessage: 'Failed to load technique list',
      pendingMessage: 'Refreshing list...',
      silentSuccess: true,
      silentFailure: true,
    });
  }

  return res;
}

async function handleContentTechniqueReorder(form) {
  const id = movementTechPositiveId(form.id?.value, 'technique_id');
  if (id.error) {
    toast(id.error, 'warn');
    return;
  }

  const direction = movementTechDirection(form.direction?.value);
  if (direction.error) {
    toast(direction.error, 'warn');
    return;
  }

  const res = await submitMovementTechRequest(form, {
    method: 'POST',
    path: `/techniques/${id.value}/reorder`,
    title: `Reorder movement technique #${id.value}`,
    outKey: 'content-techniques-res',
    body: { direction: direction.value },
    successMessage: 'Technique reordered',
    failureMessage: 'Failed to reorder technique',
  });

  if (res?.ok) {
    await loadContentEntityCollection('techniques', {
      form,
      failureMessage: 'Failed to load technique list',
      pendingMessage: 'Refreshing list...',
      silentSuccess: true,
      silentFailure: true,
    });
  }

  return res;
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
  const codeEl = document.getElementById('u-metaCode');
  const editedCode = (codeEl?.textContent || '').trim();
  const codePath = (codeEl?.dataset?.originalCode || editedCode || '').trim();
  if (!codePath) {
    toast('Missing map code (target route).', 'warn');
    return;
  }
  if (!editedCode || /^n\/?a$/i.test(editedCode)) {
    toast('Map code required', 'warn');
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

  const hidden = form.querySelector('#u-flagHidden')?.checked === true;
  const archived = form.querySelector('#u-flagArchived')?.checked === true;
  const official = form.querySelector('#u-flagOfficial')?.checked === true;
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
  put('code', editedCode);
  if (Number.isFinite(checkpoints)) put('checkpoints', checkpoints);
  put('category', category || undefined);
  put('difficulty', difficulty || undefined);
  if (mechanics.length) put('mechanics', mechanics);
  if (restrictions.length) put('restrictions', restrictions);
  if (tags.length) put('tags', tags);
  if (description && !/^n\/?a$/i.test(description)) put('description', description);
  if (title) put('title', title);
  if (custom_banner) put('custom_banner', custom_banner);
  if (medalsCheck.values) put('medals', medalsCheck.values);
  put('hidden', hidden);
  put('archived', archived);
  payload.official = official;
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
  if (ok) {
    if (codeEl && editedCode) codeEl.dataset.originalCode = editedCode;
    form.dataset.loadedMapArchived = String(archived);
    updateReleaseCodeButtonVisibility(form);
  }
}

function updateReleaseCodeButtonVisibility(form) {
  const target = form || document.querySelector('[data-subpanel="maps-update"] #u-updateMapForm');
  const btn = target?.querySelector('#u-releaseCodeBtn');
  const code = (target?.querySelector('#u-metaCode')?.textContent || '').trim();
  const archived = target?.dataset?.loadedMapArchived === 'true';
  btn?.classList.toggle('hidden', !archived || !code || /^n\/?a$/i.test(code));
}

function formatApiErrorMessage(data, fallback = 'Failed') {
  if (typeof data === 'string') return data.trim() || fallback;
  if (typeof data?.error === 'string' && data.error.trim()) return data.error.trim();
  if (typeof data?.message === 'string' && data.message.trim()) return data.message.trim();
  if (typeof data?.error?.message === 'string' && data.error.message.trim()) {
    return data.error.message.trim();
  }
  return fallback;
}

async function handleReleaseMapCode(form) {
  const code = (form?.querySelector('#u-metaCode')?.textContent || '').trim();
  if (!code || /^n\/?a$/i.test(code)) {
    toast('Missing map code.', 'warn');
    return;
  }

  if (form?.dataset?.loadedMapArchived !== 'true') {
    toast('Release code is only available for archived maps.', 'warn');
    return;
  }

  const confirmed = await showConfirmDanger({
    title: `Release code ${code}?`,
    message:
      'This is irreversible. The map will no longer be findable by this code, and the code can be reused by a new map.',
    confirm: 'Release code',
    cancel: 'Cancel',
  });
  if (!confirmed) return;

  const btn = form.querySelector('#u-releaseCodeBtn');
  btn && (btn.disabled = true);

  const { ok, status, url, data } = await http(
    'PATCH',
    `${API_MODS}/maps/${encodeURIComponent(code)}/release-code`
  );

  logActivity({ title: 'Release map code', method: 'PATCH', url, ok, status, data });

  if (ok || status === 204) {
    toast('Code released', 'ok');
    form.dataset.loadedMapArchived = 'false';
    const codeEl = form.querySelector('#u-metaCode');
    if (codeEl) {
      codeEl.dataset.originalCode = code;
      codeEl.textContent = 'N/A';
    }
    updateReleaseCodeButtonVisibility(form);
  } else {
    toast(formatApiErrorMessage(data, 'Release failed'), 'err');
    btn && (btn.disabled = false);
  }
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

// MODERATION
// Override a map's quality score. Lives on the Maps workspace (targets the
// loaded map's code); exposed to maps-workspace.js via the DEPS bundle.
async function applyOverrideQuality(code, value) {
  const c = String(code || '').trim();
  const v = Number(value);

  if (!c) {
    toast('Map code required', 'warn');
    return false;
  }
  if (!Number.isInteger(v) || v < 1 || v > 6) {
    toast('Pick a quality value between 1 and 6', 'warn');
    return false;
  }

  const { ok, status, url, data } = await http(
    'POST',
    `${API_MODS}/maps/${encodeURIComponent(c)}/quality`,
    { body: { value: v } }
  );

  logActivity({ title: 'Override quality', method: 'POST', url, ok, status, data });
  toast(ok ? 'Applied' : 'Failed', ok ? 'ok' : 'err');
  return ok;
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

      const mechanicsData = mechResp.ok
        ? await readResponseDataPreservingLargeIntegers(mechResp)
        : [];
      const restrictionsData = restrResp.ok
        ? await readResponseDataPreservingLargeIntegers(restrResp)
        : [];

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
      return await readResponseDataPreservingLargeIntegers(resp);
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
    label.className = 'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-900/5 dark:hover:bg-white/10';

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
    label.className = 'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-900/5 dark:hover:bg-white/10';

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

        const data = await readResponseDataPreservingLargeIntegers(res);
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
  if (overlay) {
    appendOverlay(overlay);
    return overlay;
  }

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
    <div class="w-full space-y-6">
      <div class="hidden">
        <div class="min-w-0">
          <div class="text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-400">MODERATOR</div>
          <h2 class="mt-0.5 text-lg font-semibold text-zinc-900 dark:text-white">Map Edit Request</h2>
          <p class="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Send a map edit request with the same form as the public modal.</p>
        </div>

      </div>

      <div class="space-y-4">
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

      <div class="flex flex-wrap items-center justify-end gap-3">
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
(() => { const __obj = b; let __last; for (const __c of String('text-zinc-900 dark:text-zinc-950').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, isActive); return __last; })();
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
(() => { const __obj = b; let __last; for (const __c of String('text-zinc-900 dark:text-zinc-950').trim().split(/\s+/).filter(Boolean)) __last = __obj.classList.toggle(__c, isActive); return __last; })();
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

        const data = await readResponseDataPreservingLargeIntegers(resp);

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

//———————————————————————————————————————————————————————————————
// LOOTBOX
//———————————————————————————————————————————————————————————————
//———————————————————————————————————————————————————————————————
// SUBMIT MAP
//———————————————————————————————————————————————————————————————

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

function wireQuestProgressPicker(root) {
  if (!root || root.dataset.qpWired) return;
  root.dataset.qpWired = "1";
  const btn = ddBtn(root);
  const list = ddList(root);
  if (!btn || !list) return;

  ddHide(list);

  btn.addEventListener(
    "click",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      list.classList.contains("hidden") ? ddShow(list) : ddHide(list);
    },
    true
  );

  list.addEventListener(
    "click",
    (e) => {
      e.stopPropagation();
    },
    true
  );

  document.addEventListener(
    "click",
    (e) => {
      if (!root.contains(e.target)) ddHide(list);
    },
    true
  );
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
    const j = await readResponseDataPreservingLargeIntegers(res);
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

//———————————————————————————————————————————————————————————————
// SEARCH MAP
//———————————————————————————————————————————————————————————————
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

//———————————————————————————————————————————————————————————————
// UPDATE MAP
//———————————————————————————————————————————————————————————————

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

  const updateForm = panel.querySelector('#u-updateMapForm');
  const releaseBtn = updateForm?.querySelector('#u-releaseCodeBtn');
  if (updateForm && releaseBtn && releaseBtn.dataset.bound !== '1') {
    releaseBtn.dataset.bound = '1';
    releaseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      void runModeratorEndpointAction({
        action: 'release-map-code',
        article: updateForm.closest('article'),
      }, () => handleReleaseMapCode(updateForm));
    });
  }
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
  const codeEl = form.querySelector('#u-metaCode');
  if (codeEl) codeEl.dataset.originalCode = item?.code ? String(item.code).trim() : '';
  setText(form, '#u-metaMap', item?.map_name);
  setText(form, '#u-metaCheckpoints', item?.checkpoints);

  // Required
  ddSelectByValue(form.querySelector('#u-difficultyDropdown'), item?.difficulty);
  ddSelectByValue(form.querySelector('#u-categoryDropdown'), item?.category);
  ddCheckByValues(form.querySelector('#u-mechanicsDropdown'), item?.mechanics || []);
  ddCheckByValues(form.querySelector('#u-restrictionsDropdown'), item?.restrictions || []);
  ddCheckByValues(form.querySelector('#u-tagsDropdown'), item?.tags || item?.map_tags || []);

  // Flags
  const setCheckboxBool = (selector, value) => {
    const checkbox = form.querySelector(selector);
    if (!checkbox) return;
    const checked = toBooleanValue(value);
    checkbox.checked = checked;
    checkbox.defaultChecked = checked;
    checkbox.toggleAttribute('checked', checked);
  };
  const isArchived = mapArchivedValue(item);
  setCheckboxBool('#u-flagHidden', item?.hidden);
  setCheckboxBool('#u-flagArchived', isArchived);
  setCheckboxBool('#u-flagOfficial', item?.official);
  form.dataset.loadedMapArchived = String(isArchived);
  updateReleaseCodeButtonVisibility(form);
  ddSelectByValue(form.querySelector('#u-playtestingDropdown'), item?.playtesting);

  // Optional
  setValue(form, '#u-optTitleInput', item?.title ?? '');
  setText(form, '#u-optDescription', item?.description);

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

//———————————————————————————————————————————————————————————————
// EDIT INLINE
//———————————————————————————————————————————————————————————————

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

//———————————————————————————————————————————————————————————————
// MEDALS
//———————————————————————————————————————————————————————————————
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
// MODERATOR CONTEXT
// ———————————————————————————————————————————————————————————————
const MOD_USER_ID = (
  document.getElementById('modUserId')?.value ??
  document.querySelector('meta[name="mod-user-id"]')?.content ??
  (typeof window !== 'undefined' && window.user_id != null ? String(window.user_id) : '')
).trim();

//———————————————————————————————————————————————————————————————
// USERS
//———————————————————————————————————————————————————————————————
function normalizeOverwatchUsernamesPayload(data) {
  const normalizeEntry = (entry, index = 0) => {
    if (typeof entry === 'string') {
      const username = entry.trim();
      return username ? { username, is_primary: index === 0 } : null;
    }

    if (!entry || typeof entry !== 'object') {
      return null;
    }

    const username = String(
      entry.username ??
      entry.name ??
      entry.value ??
      entry.label ??
      ''
    ).trim();

    if (!username) {
      return null;
    }

    return {
      username,
      is_primary:
        entry.is_primary === true ||
        entry.isPrimary === true ||
        entry.primary === true ||
        false,
    };
  };

  const directList =
    (Array.isArray(data?.usernames) && data.usernames) ||
    (Array.isArray(data?.overwatch_usernames) && data.overwatch_usernames) ||
    (Array.isArray(data?.data?.usernames) && data.data.usernames) ||
    (Array.isArray(data?.data?.overwatch_usernames) && data.data.overwatch_usernames) ||
    (Array.isArray(data) && data) ||
    null;

  let entries = [];

  if (directList) {
    entries = directList
      .map((entry, index) => normalizeEntry(entry, index))
      .filter(Boolean)
      .slice(0, 3);
  } else if (data && typeof data === 'object') {
    const primary = String(data.primary ?? data.primary_username ?? '').trim();
    const secondary = String(data.secondary ?? data.secondary_username ?? '').trim();
    const tertiary = String(data.tertiary ?? data.tertiary_username ?? '').trim();

    entries = [
      primary ? { username: primary, is_primary: true } : null,
      secondary ? { username: secondary, is_primary: false } : null,
      tertiary ? { username: tertiary, is_primary: false } : null,
    ].filter(Boolean);
  }

  if (!entries.some((entry) => entry.is_primary) && entries.length) {
    entries = entries.map((entry, index) => ({
      ...entry,
      is_primary: index === 0,
    }));
  } else {
    let primarySeen = false;
    entries = entries.map((entry) => {
      if (!entry.is_primary || primarySeen) {
        return { ...entry, is_primary: false };
      }
      primarySeen = true;
      return { ...entry, is_primary: true };
    });
  }

  return entries;
}

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

  const usernames = normalizeOverwatchUsernamesPayload(data);

  const setUsername = (i, val) => {
    const inp = form.querySelector(`[name="username_${i}"]`);
    if (inp) inp.value = val ?? '';
  };

  const setPrimaryFlag = (i, isTrue) => {
    setRadioValue(form, `is_primary_${i}`, isTrue ? 'true' : 'false');
  };

  for (let i = 0; i < 3; i++) {
    const entry = usernames[i] || null;
    setUsername(i + 1, entry?.username ?? '');
    setPrimaryFlag(i + 1, !!entry?.username && entry?.is_primary === true);
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

//———————————————————————————————————————————————————————————————
// DEVS ONLY
//———————————————————————————————————————————————————————————————
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
      `This will update OVERPY_COMMIT in converter.js.\nContinue?`,
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
      `This will update the CDN URL used by converter.js.\nContinue?`,
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

//———————————————————————————————————————————————————————————————
// STORE
//———————————————————————————————————————————————————————————————
function stringifyOut(v) {
  if (v == null) return "";
  if (typeof v === "string") return v;
  try { return JSON.stringify(v, null, 2); }
  catch { return String(v); }
}

function resetEnhancedForm(form) {
  form.reset();

  form.querySelectorAll('[data-dd-select]').forEach((dd) => {
    const radio =
      dd.querySelector('[data-dd-list] input[type="radio"][value=""]') ||
      dd.querySelector('[data-dd-list] input[type="radio"]');
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  form.querySelectorAll('input').forEach((input) => {
    if (!input.readOnly && input.dataset?.uid) input.dataset.uid = '';
  });

  if (form.matches?.('form[data-action="content-category-update"], form[data-action="content-difficulty-update"]')) {
    movementTechClearNamedEntityUpdateForm(form);
  }

  if (form.matches?.('form[data-action="content-technique-create"]')) {
    movementTechSetTechniqueRows(form, 'tips', []);
    movementTechSetTechniqueRows(form, 'videos', []);
    movementTechClearTechniqueSnapshot(form);
    delete form.dataset.movementTechLoadedId;
  }

  if (form.matches?.('form[data-action="content-technique-update"]')) {
    movementTechClearTechniqueUpdateForm(form);
  }

  if (form.matches?.('form[data-action="tournament-category-create"]')) {
    setTournamentXpGroupRows(form, 'placement_xp_json', tournamentDefaultXpRows('placement'));
    setTournamentXpGroupRows(form, 'streak_xp_json', tournamentDefaultXpRows('streak'));
  }

  if (form.matches?.('form[data-action="tournament-category-update"]')) {
    setTournamentXpGroupRows(form, 'placement_xp_json', []);
    setTournamentXpGroupRows(form, 'streak_xp_json', []);
  }
}

function placeResetButton(form, submitBtn, resetBtn) {
  if (!form || !submitBtn || !resetBtn) return;

  submitBtn.dataset.formPrimary = '1';
  submitBtn.classList.add('shrink-0');
  if (!submitBtn.classList.contains('sm:w-auto')) submitBtn.classList.add('sm:w-auto');

  const existingActions = submitBtn.closest('[data-form-actions="1"]');
  if (existingActions) {
    existingActions.appendChild(resetBtn);
    return;
  }

  const parent = submitBtn.parentElement;
  const parentCanHostActions =
    !!parent &&
    parent !== form &&
    parent.children.length === 1 &&
    parent.firstElementChild === submitBtn;

  if (parentCanHostActions) {
    parent.dataset.formActions = '1';
    parent.classList.add('flex', 'items-end', 'gap-2', 'flex-wrap');
    parent.appendChild(resetBtn);
    return;
  }

  const actions = document.createElement('div');
  actions.dataset.formActions = '1';
  actions.className = 'flex flex-wrap items-end gap-2';

  const spanClasses = Array.from(submitBtn.classList).filter((cls) => /(^|:)col-span-\d+$/.test(cls));
  spanClasses.forEach((cls) => {
    actions.classList.add(cls);
    submitBtn.classList.remove(cls);
  });

  const parentNode = submitBtn.parentNode;
  if (!parentNode) return;
  const nextSibling = submitBtn.nextSibling;
  if (nextSibling && nextSibling.parentNode === parentNode) parentNode.insertBefore(actions, nextSibling);
  else parentNode.appendChild(actions);
  actions.appendChild(submitBtn);
  actions.appendChild(resetBtn);
}

function ensureFormUx(root = document) {
  root.querySelectorAll('form[data-action]:not([data-form-ux="1"])').forEach((form) => {
    form.dataset.formUx = '1';

    const submitBtn =
      form.querySelector('button[type="submit"]') ||
      form.querySelector('button:not([type])');

    if (submitBtn && !form.querySelector('[data-form-reset="1"]')) {
      const resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.dataset.formReset = '1';
      resetBtn.className =
        'shrink-0 rounded-xl border border-zinc-200/80 dark:border-white/10 ' +
        'bg-zinc-100 dark:bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200 ' +
        'hover:bg-zinc-100 dark:hover:bg-white/10';
      resetBtn.textContent = 'Reset';
      resetBtn.addEventListener('click', () => resetEnhancedForm(form));
      placeResetButton(form, submitBtn, resetBtn);
    }

    form.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (typeof form.requestSubmit === 'function') form.requestSubmit();
        else submitBtn?.click();
      }
    });
  });
}

function setPanelOut(form, key, value) {
  const txt = stringifyOut(value);

  const scope =
    form?.closest?.("[data-panel]") ||
    form?.closest?.(".mod-panel") ||
    form ||
    document;

  const el =
    scope.querySelector?.(`[data-out="${CSS.escape(key)}"]`) ||
    document.getElementById(key) ||
    document.getElementById(`out-${key}`) ||
    document.querySelector?.(`[data-out="${CSS.escape(key)}"]`);

  if (!el) {
    return;
  }

  if ("value" in el && (el.tagName === "TEXTAREA" || el.tagName === "INPUT")) {
    el.value = txt;
  } else {
    el.textContent = txt;
  }

  if (el.matches?.('pre[data-out]')) {
    return;
  }

  const wrap = el.closest?.('[data-out-wrap="1"]');
  if (wrap) {
    wrap.classList.remove('hidden');
    const meta = wrap.querySelector('[data-out-meta="1"]');
    if (meta) {
      const hhmmss = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      meta.textContent = `${hhmmss} • ${txt.length} chars`;
    }
    wrap.classList.add('ring-2', 'ring-emerald-500/20');
    setTimeout(() => wrap.classList.remove('ring-2', 'ring-emerald-500/20'), 600);
  }

  if (el.closest?.("[hidden]")) el.closest("[hidden]").hidden = false;
  if (el.hidden) el.hidden = false;
  el.classList.remove('hidden');
  if (el.tagName === 'PRE' || el.tagName === 'TEXTAREA') el.scrollTop = 0;
}

function readJsonField(raw) {
  try {
    const v = JSON.parse(raw);
    if (v == null) return null;
    return v;
  } catch {
    return null;
  }
}

function findRelatedActionForm(form, action) {
  const scope =
    form?.closest?.('[data-subpanel]') ||
    form?.closest?.('[data-panel]') ||
    form?.closest?.('.mod-panel') ||
    document;

  if (form?.matches?.(`form[data-action="${action}"]`)) {
    return form;
  }

  return scope.querySelector(`form[data-action="${action}"]`);
}

function normalizeConfigPayload(data) {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    if (data.config && typeof data.config === 'object' && !Array.isArray(data.config)) {
      return data.config;
    }
    if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
      return data.data;
    }
    return data;
  }

  return {};
}

function fillStoreConfigForm(form, data) {
  const config = normalizeConfigPayload(data);
  if (form?.rotation_period_days) {
    form.rotation_period_days.value = config.rotation_period_days ?? '';
  }
  if (form?.active_key_type) {
    form.active_key_type.value = config.active_key_type ?? '';
  }
}

function fillQuestConfigForm(form, data) {
  const config = normalizeConfigPayload(data);
  ['rotation_day', 'rotation_hour', 'easy_quest_count', 'medium_quest_count', 'hard_quest_count'].forEach((key) => {
    if (form?.[key]) {
      form[key].value = config[key] ?? '';
    }
  });
}

const SKILL_WEIGHT_FIELDS = [
  'diff_base',
  'gamma',
  'time_bonus',
  'shrink_k',
  'wr_bonus',
  'partial_factor',
  'medal_gold',
  'medal_silver',
  'medal_bronze',
];

const SKILL_TIER_NAMES = [
  'Unranked',
  'Bronze',
  'Silver',
  'Gold',
  'Emerald',
  'Diamond',
  'Ascendant',
  'Elite',
  'Champion',
];

const SKILL_TIER_COLORS = [
  '#71717a',
  '#a16207',
  '#94a3b8',
  '#eab308',
  '#10b981',
  '#38bdf8',
  '#8b5cf6',
  '#ec4899',
  '#f97316',
];

const skillTierConfigState = new WeakMap();
let skillTierSampleLoadId = 0;

function forceRangeThumbRepaint(range) {
  if (!range || range.type !== 'range') return;

  const value = range.value;
  const alternate = value === range.min ? range.max : range.min;
  range.value = alternate;
  void range.offsetWidth;
  range.value = value;
  void range.offsetWidth;
}

function updateSkillWeightProgress(range) {
  if (!range) return;
  const min = Number(range.min);
  const max = Number(range.max);
  const value = Number(range.value);
  const progress = Number.isFinite(value) && max > min
    ? ((value - min) / (max - min)) * 100
    : 0;
  range.style.setProperty('--skill-weight-progress', `${Math.max(0, Math.min(100, progress))}%`);
}

function setSkillWeightControlValue(control, value) {
  if (!control) return;
  const range = control.querySelector('[data-skill-weight-range]');
  const number = control.querySelector('[data-skill-weight-number]');
  const numericValue = Number(value);
  if (!range || !number || !Number.isFinite(numericValue)) return;

  const min = Number(range.min);
  const max = Number(range.max);
  const clamped = Math.max(min, Math.min(max, numericValue));
  range.value = String(clamped);
  number.value = String(clamped);
  updateSkillWeightProgress(range);
}

function bindSkillWeightSliders(form) {
  if (!form || form.dataset.skillWeightsBound === '1') return;
  form.dataset.skillWeightsBound = '1';

  form.querySelectorAll('[data-skill-weight-control]').forEach((control) => {
    const range = control.querySelector('[data-skill-weight-range]');
    const number = control.querySelector('[data-skill-weight-number]');
    if (!range || !number) return;

    range.addEventListener('input', () => {
      number.value = range.value;
      updateSkillWeightProgress(range);
    });
    number.addEventListener('input', () => {
      if (number.value === '' || !Number.isFinite(Number(number.value))) return;
      const min = Number(range.min);
      const max = Number(range.max);
      range.value = String(Math.max(min, Math.min(max, Number(number.value))));
      updateSkillWeightProgress(range);
    });
    number.addEventListener('change', () => {
      setSkillWeightControlValue(control, number.value);
    });

    setSkillWeightControlValue(control, number.value);
  });
}

function skillTierName(data) {
  const supplied = String(data?.skill_tier_name ?? '').trim();
  if (SKILL_TIER_NAMES.includes(supplied)) return supplied;

  const tier = Number(data?.skill_tier ?? data?.tier ?? 0);
  return SKILL_TIER_NAMES[Number.isInteger(tier) && tier >= 0 && tier <= 8 ? tier : 0];
}

function skillTierIconUrl(name) {
  const tier = SKILL_TIER_NAMES.includes(name) ? name : 'Unranked';
  return `https://cdn.genji.pk/assets/skill/rank-icons/${encodeURIComponent(tier)}.png`;
}

function fillSkillConfigForm(form, data) {
  const config = normalizeConfigPayload(data);
  bindSkillWeightSliders(form);
  SKILL_WEIGHT_FIELDS.forEach((field) => {
    const control = form?.querySelector?.(`[data-skill-weight-control="${field}"]`);
    if (control && config[field] !== undefined && config[field] !== null) {
      setSkillWeightControlValue(control, config[field]);
    }
  });
}

function skillPercentileInputs(form) {
  return Array.from(form?.querySelectorAll?.('[data-skill-percentile-index]') || [])
    .sort((a, b) => Number(a.dataset.skillPercentileIndex) - Number(b.dataset.skillPercentileIndex));
}

function updateSkillPercentileUi(form) {
  const inputs = skillPercentileInputs(form);
  if (inputs.length !== 7) return;

  const values = inputs.map((input) => Number(input.value));
  const strictlyIncreasing = values.every(
    (value, index) => index === 0 || value > values[index - 1]
  );
  values.forEach((value, index) => {
    const numberInput = form.querySelector(`[data-skill-percentile-number="${index}"]`);
    if (numberInput && document.activeElement !== numberInput) {
      numberInput.value = value.toFixed(1);
    }
    inputs[index].setAttribute('aria-valuetext', `${value.toFixed(1)} percent`);
    inputs[index].style.setProperty('--skill-range-progress', `${value}%`);
  });

  const thresholdStatus = form.querySelector('[data-skill-threshold-status]');
  if (thresholdStatus) {
    thresholdStatus.textContent = strictlyIncreasing
      ? 'Threshold order is valid'
      : 'Thresholds must be strictly increasing before saving';
    thresholdStatus.classList.toggle('text-emerald-600', strictlyIncreasing);
    thresholdStatus.classList.toggle('dark:text-emerald-400', strictlyIncreasing);
    thresholdStatus.classList.toggle('text-amber-600', !strictlyIncreasing);
    thresholdStatus.classList.toggle('dark:text-amber-300', !strictlyIncreasing);
  }

  const edges = [0, ...values, 100];
  for (let tier = 1; tier <= 8; tier += 1) {
    const start = edges[tier - 1];
    const end = edges[tier];
    const share = Math.max(0, end - start);
    const card = form.querySelector(`[data-skill-tier-card="${tier}"]`);
    const range = card?.querySelector('[data-skill-tier-range]');
    const shareOutput = card?.querySelector('[data-skill-tier-share]');
    const segment = form.querySelector(`[data-skill-population-segment="${tier}"]`);

    if (range) range.textContent = `${start.toFixed(1)}% - ${end.toFixed(1)}%`;
    if (shareOutput) shareOutput.textContent = `${share.toFixed(1)}%`;
    if (segment) {
      segment.style.width = `${share}%`;
      segment.title = `${SKILL_TIER_NAMES[tier]}: ${share.toFixed(1)}% (${start.toFixed(1)}% - ${end.toFixed(1)}%)`;
    }
  }

  updateSkillTierScoreRanges(form);
  renderStoredSkillTierSamples(form);
}

function refreshSkillSliderLayout(panel) {
  if (!panel) return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const weightForm = panel.querySelector('form[data-action="skill-config-update"]');
      if (weightForm) {
        weightForm.querySelectorAll('[data-skill-weight-range]').forEach((range) => {
          forceRangeThumbRepaint(range);
          updateSkillWeightProgress(range);
        });
      }

      const tierForm = panel.querySelector('form[data-action="skill-tiers-update"]');
      if (tierForm) {
        skillPercentileInputs(tierForm).forEach(forceRangeThumbRepaint);
        updateSkillPercentileUi(tierForm);
      }
    });
  });
}

function setSkillPercentiles(form, percentiles) {
  const inputs = skillPercentileInputs(form);
  if (inputs.length !== 7 || !Array.isArray(percentiles) || percentiles.length !== 7) return;

  inputs.forEach((input) => {
    input.min = '0.1';
    input.max = '99.9';
  });
  inputs.forEach((input, index) => {
    const value = Math.max(0.1, Math.min(99.9, Number(percentiles[index]) * 100));
    input.value = Number.isFinite(value) ? value.toFixed(1) : input.value;
  });
  updateSkillPercentileUi(form);
}

function formatSkillScore(value) {
  const score = Number(value);
  return Number.isFinite(score)
    ? score.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : '-';
}

function updateSkillTierScoreRanges(form) {
  const boundaries = skillTierConfigState.get(form)?.boundaries || [];

  for (let tier = 1; tier <= 8; tier += 1) {
    const output = form?.querySelector?.(
      `[data-skill-tier-card="${tier}"] [data-skill-tier-score-range]`
    );
    if (!output) continue;

    const lower = Number(boundaries[tier - 2]);
    const upper = Number(boundaries[tier - 1]);
    if (tier === 1 && Number.isFinite(upper)) {
      output.textContent = `Score below ${formatSkillScore(upper)}`;
    } else if (tier === 8 && Number.isFinite(lower)) {
      output.textContent = `Score ${formatSkillScore(lower)} and above`;
    } else if (Number.isFinite(lower) && Number.isFinite(upper)) {
      output.textContent = `Score ${formatSkillScore(lower)} - ${formatSkillScore(upper)}`;
    } else {
      output.textContent = 'Score range unavailable';
    }
  }
}

function fillSkillTierConfig(form, data) {
  const config = normalizeConfigPayload(data);
  const boundaries = Array.isArray(config.boundaries)
    ? config.boundaries.map(Number).filter(Number.isFinite)
    : [];
  skillTierConfigState.set(form, {
    ...(skillTierConfigState.get(form) || {}),
    boundaries,
    computedAt: config.computed_at || null,
  });
  setSkillPercentiles(form, config.percentiles);

  for (let index = 0; index < 7; index += 1) {
    const output = form?.querySelector?.(`[data-skill-boundary-value="${index}"]`);
    if (output) {
      output.textContent = Number.isFinite(boundaries[index])
        ? `Score ${formatSkillScore(boundaries[index])}`
        : 'Score -';
    }
  }
  updateSkillTierScoreRanges(form);

  const computedAt = form?.querySelector?.('[data-skill-computed-at]');
  if (computedAt) {
    const date = config.computed_at ? new Date(config.computed_at) : null;
    computedAt.textContent = date && !Number.isNaN(date.getTime())
      ? `Snapshot computed ${date.toLocaleString()}`
      : 'Snapshot date unavailable';
  }
}

function bindSkillPercentileSliders(form) {
  if (!form || form.dataset.skillSliderBound === '1') return;
  form.dataset.skillSliderBound = '1';

  const inputs = skillPercentileInputs(form);
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      updateSkillPercentileUi(form);
    });
  });

  form.querySelectorAll('[data-skill-percentile-number]').forEach((numberInput) => {
    const index = Number(numberInput.dataset.skillPercentileNumber);
    const rangeInput = inputs.find(
      (input) => Number(input.dataset.skillPercentileIndex) === index
    );
    if (!rangeInput) return;

    numberInput.addEventListener('input', () => {
      const value = Number(numberInput.value);
      if (!Number.isFinite(value)) return;

      rangeInput.value = String(Math.max(0.1, Math.min(99.9, value)));
      updateSkillPercentileUi(form);
    });

    numberInput.addEventListener('change', () => {
      const value = Number(numberInput.value);
      const normalized = Number.isFinite(value)
        ? Math.max(0.1, Math.min(99.9, value))
        : Number(rangeInput.value);
      rangeInput.value = normalized.toFixed(1);
      numberInput.value = normalized.toFixed(1);
      updateSkillPercentileUi(form);
    });
  });

  updateSkillPercentileUi(form);
}

function skillLeaderboardRows(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

function skillTierEdges(form) {
  return [0, ...skillPercentileInputs(form).map((input) => Number(input.value) / 100), 1];
}

function inferPlayerSkillTier(player, edges) {
  const percentile = Number(player?.skill_percentile);
  if (Number.isFinite(percentile)) {
    const boundaryIndex = edges.slice(1, -1).findIndex((boundary) => percentile < boundary);
    return boundaryIndex === -1 ? 8 : boundaryIndex + 1;
  }

  const supplied = Number(player?.skill_tier ?? player?.tier);
  return Number.isInteger(supplied) && supplied >= 1 && supplied <= 8 ? supplied : 0;
}

function estimateEligibleSkillPopulation(rows, totalResults) {
  const estimates = rows
    .map((player, index) => {
      const percentile = Number(player?.skill_percentile);
      const rankFromTop = index + 1;
      if (!Number.isFinite(percentile) || percentile <= 0 || percentile >= 0.999999) return null;
      return rankFromTop / (1 - percentile);
    })
    .filter((value) => Number.isFinite(value) && value >= rows.length)
    .sort((a, b) => a - b);

  const estimate = estimates.length
    ? estimates[Math.floor(estimates.length / 2)]
    : totalResults;
  return Math.max(rows.length, Math.min(totalResults || estimate, Math.round(estimate)));
}

function renderSkillTierSamplePlayers(form, samplesByTier) {
  let renderedCount = 0;

  for (let tier = 1; tier <= 8; tier += 1) {
    const container = form.querySelector(
      `[data-skill-tier-card="${tier}"] [data-skill-tier-samples]`
    );
    if (!container) continue;

    const players = samplesByTier.get(tier) || [];
    renderedCount += players.length;
    if (!players.length) {
      container.innerHTML = '<div class="rounded-lg bg-zinc-500/5 px-2 py-2 text-[11px] text-zinc-500 dark:text-zinc-400">No player sampled</div>';
      continue;
    }

    container.innerHTML = players
      .map((player) => {
        const name = String(
          player?.nickname || player?.discord_tag || player?.name || `User ${player?.user_id || ''}`
        ).trim();
        const initial = Array.from(name)[0]?.toUpperCase() || '?';
        const percentile = Number(player?.skill_percentile);
        const percentileLabel = Number.isFinite(percentile)
          ? `${(percentile * 100).toFixed(1)}%`
          : '';

        return `
          <div class="skill-player-sample" title="${escapeHtml(name)} - ${escapeHtml(formatSkillScore(player?.skill_score))}">
            <span class="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black" style="color:${SKILL_TIER_COLORS[tier]};background:color-mix(in srgb,${SKILL_TIER_COLORS[tier]} 15%,transparent)">${escapeHtml(initial)}</span>
            <span class="min-w-0 truncate text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">${escapeHtml(name)}</span>
            <span class="text-right text-[10px] leading-tight text-zinc-500 dark:text-zinc-400">
              <strong class="block text-zinc-700 dark:text-zinc-300">${escapeHtml(formatSkillScore(player?.skill_score))}</strong>
              ${escapeHtml(percentileLabel)}
            </span>
          </div>
        `;
      })
      .join('');
  }

  return renderedCount;
}

function renderStoredSkillTierSamples(form) {
  const sampleRows = skillTierConfigState.get(form)?.sampleRows;
  if (!Array.isArray(sampleRows) || !sampleRows.length) return 0;

  const edges = skillTierEdges(form);
  const targets = Array.from({ length: 8 }, (_, index) => (edges[index] + edges[index + 1]) / 2);
  const samplesByTier = new Map();

  for (let tier = 1; tier <= 8; tier += 1) {
    const target = targets[tier - 1];
    samplesByTier.set(
      tier,
      sampleRows
        .filter((player) => inferPlayerSkillTier(player, edges) === tier)
        .sort((a, b) => {
          const aDistance = Math.abs(Number(a?.skill_percentile ?? target) - target);
          const bDistance = Math.abs(Number(b?.skill_percentile ?? target) - target);
          return aDistance - bDistance;
        })
        .slice(0, 3)
    );
  }

  return renderSkillTierSamplePlayers(form, samplesByTier);
}

function setSkillTierSamplesLoading(form) {
  form.querySelectorAll('[data-skill-tier-samples]').forEach((container) => {
    container.innerHTML = Array.from(
      { length: 3 },
      () => '<div class="h-8 animate-pulse rounded-lg bg-zinc-200/70 dark:bg-white/5"></div>'
    ).join('');
  });
}

async function loadSkillTierSamples(form) {
  if (!form) return;

  const loadId = ++skillTierSampleLoadId;
  const status = form.querySelector('[data-skill-sample-status]');
  const pageSize = 50;
  const edges = skillTierEdges(form);
  const targets = Array.from({ length: 8 }, (_, index) => (edges[index] + edges[index + 1]) / 2);

  setSkillTierSamplesLoading(form);
  if (status) status.textContent = 'Sampling ranked players...';

  try {
    const firstResponse = await http('GET', '/api/community/leaderboard', {
      query: {
        sort_column: 'skill_score',
        sort_direction: 'desc',
        page_size: pageSize,
        page_number: 1,
      },
    });
    if (!firstResponse.ok) throw new Error('Leaderboard request failed');

    const firstRows = skillLeaderboardRows(firstResponse.data);
    if (!firstRows.length) {
      if (loadId !== skillTierSampleLoadId) return;
      renderSkillTierSamplePlayers(form, new Map());
      if (status) status.textContent = 'No ranked players available';
      return;
    }

    const totalResults = Number(firstRows[0]?.total_results) || firstRows.length;
    const eligiblePopulation = estimateEligibleSkillPopulation(firstRows, totalResults);
    const pageNumbers = new Set([1]);
    targets.forEach((target) => {
      const rankFromTop = Math.max(1, Math.round((1 - target) * eligiblePopulation));
      pageNumbers.add(Math.floor((rankFromTop - 1) / pageSize) + 1);
    });

    const additionalResponses = await Promise.all(
      Array.from(pageNumbers)
        .filter((pageNumber) => pageNumber !== 1)
        .map((pageNumber) =>
          http('GET', '/api/community/leaderboard', {
            query: {
              sort_column: 'skill_score',
              sort_direction: 'desc',
              page_size: pageSize,
              page_number: pageNumber,
            },
          })
        )
    );

    if (loadId !== skillTierSampleLoadId) return;

    const rows = [
      ...firstRows,
      ...additionalResponses.flatMap((response) =>
        response.ok ? skillLeaderboardRows(response.data) : []
      ),
    ];
    const uniqueRows = Array.from(
      new Map(
        rows.map((player, index) => [
          String(player?.user_id || `${player?.nickname || 'player'}-${index}`),
          player,
        ])
      ).values()
    );

    skillTierConfigState.set(form, {
      ...(skillTierConfigState.get(form) || {}),
      sampleRows: uniqueRows,
      eligiblePopulation,
    });
    const renderedCount = renderStoredSkillTierSamples(form);
    if (status) {
      status.textContent = `${renderedCount} players sampled from about ${eligiblePopulation.toLocaleString()} ranked players`;
    }
  } catch {
    if (loadId !== skillTierSampleLoadId) return;
    renderSkillTierSamplePlayers(form, new Map());
    if (status) status.textContent = 'Player samples unavailable';
  }
}

function initSkillUserPanel() {
  const panel = document.querySelector('[data-subpanel="skill-user"]');
  const input = panel?.querySelector('input[name="user_id"]');
  if (input && !input.value && typeof MOD_USER_ID !== 'undefined') {
    input.value = MOD_USER_ID || '';
  }
}

function initSkillConfigPanel() {
  const panel = document.querySelector('[data-subpanel="skill-config"]');
  if (!panel) return;
  bindSkillWeightSliders(panel.querySelector('form[data-action="skill-config-update"]'));
  refreshSkillSliderLayout(panel);
  if (panel.dataset.inited === '1') return;
  panel.dataset.inited = '1';
  handleSkillConfigGet(panel.querySelector('form[data-action="skill-config-get"]'));
}

function initSkillTiersPanel() {
  const panel = document.querySelector('[data-subpanel="skill-tiers"]');
  if (!panel) return;

  const updateForm = panel.querySelector('form[data-action="skill-tiers-update"]');
  bindSkillPercentileSliders(updateForm);
  refreshSkillSliderLayout(panel);

  if (panel.dataset.inited === '1') return;
  panel.dataset.inited = '1';
  handleSkillTiersGet(panel.querySelector('form[data-action="skill-tiers-get"]'));
}

function initStoreConfigPanel() {
  const panel = document.querySelector('[data-subpanel="store-config"]');
  if (!panel || panel.dataset.inited === '1') return;
  panel.dataset.inited = '1';

  const form = panel.querySelector('form[data-action="store-get-config"]');
  if (form) {
    handleStoreGetConfig(form);
  }
}

function initQuestConfigPanel() {
  const panel = document.querySelector('[data-subpanel="quest-config"]');
  if (!panel || panel.dataset.inited === '1') return;
  panel.dataset.inited = '1';

  const form = panel.querySelector('form[data-action="quest-get-config"]');
  if (form) {
    handleQuestGetConfig(form);
  }
}

let __modQuestWeeklyCache = [];

function normalizeWeeklyQuestItems(data) {
  const rawItems = Array.isArray(data?.quests)
    ? data.quests
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];

  return rawItems
    .map((raw) => {
      const quest = raw?.quest_data && typeof raw.quest_data === 'object'
        ? raw.quest_data
        : raw?.quest && typeof raw.quest === 'object'
          ? raw.quest
          : raw;

      const quest_id = quest?.id ?? raw?.quest_id ?? raw?.id ?? null;
      if (!quest_id) {
        return null;
      }

      const name = quest?.name ?? raw?.name ?? `Quest #${quest_id}`;
      const difficulty = quest?.difficulty ?? raw?.difficulty ?? '';
      const label = `#${quest_id} - ${name}${difficulty ? ` (${difficulty})` : ''}`;

      return {
        quest_id: Number(quest_id),
        label,
        raw,
        quest,
      };
    })
    .filter(Boolean);
}

function syncQuestWeeklyPicker(subpanel) {
  const dd = subpanel?.querySelector?.('#modQuestWeeklyPicker');
  const select = dd?.querySelector?.('select[name="quest_pick"]');
  const list = dd?.querySelector?.('[data-dd-list]');
  const btn = dd?.querySelector?.('[data-dd-btn]');
  if (!dd || !select || !list || !btn) {
    return;
  }

  const placeholder = btn.getAttribute('data-placeholder') || 'Select a quest';
  const currentValue = String(select.value ?? '');
  select.innerHTML = '';

  const blank = document.createElement('option');
  blank.value = '';
  blank.textContent = placeholder;
  select.appendChild(blank);

  __modQuestWeeklyCache.forEach((item) => {
    const option = document.createElement('option');
    option.value = String(item.quest_id);
    option.textContent = item.label;
    select.appendChild(option);
  });

  list.innerHTML = '';
  list.appendChild(
    movementTechBuildContentDropdownOption(select.name, '', placeholder)
  );
  __modQuestWeeklyCache.forEach((item) => {
    list.appendChild(
      movementTechBuildContentDropdownOption(select.name, String(item.quest_id), item.label)
    );
  });

  select.value = __modQuestWeeklyCache.some((item) => String(item.quest_id) === currentValue)
    ? currentValue
    : '';
  movementTechSyncDdField(select);

  const count = subpanel.querySelector('[data-quest-weekly-count]');
  if (count) {
    count.textContent = __modQuestWeeklyCache.length
      ? `${__modQuestWeeklyCache.length} quests loaded`
      : 'No quests loaded';
  }
}

function fillQuestUpdateFormFromItem(form, item) {
  if (!form || !item) {
    return;
  }

  const quest = item.quest && typeof item.quest === 'object' ? item.quest : item.raw || {};
  const requirements = quest?.requirements ?? item.raw?.requirements ?? null;

  setInputValue(form, 'quest_id', item.quest_id);
  setInputValue(form, 'name', quest?.name ?? item.raw?.name ?? '');
  setInputValue(form, 'description', quest?.description ?? item.raw?.description ?? '');
  setInputValue(form, 'difficulty', quest?.difficulty ?? item.raw?.difficulty ?? '');
  setInputValue(form, 'coin_reward', quest?.coin_reward ?? item.raw?.coin_reward ?? '');
  setInputValue(form, 'xp_reward', quest?.xp_reward ?? item.raw?.xp_reward ?? '');
  setRadioValue(
    form,
    'is_active',
    quest?.is_active === true ? '1' : quest?.is_active === false ? '0' : ''
  );

  const requirementsField = form.querySelector('[name="requirements_json"]');
  if (requirementsField) {
    requirementsField.value = requirements
      ? JSON.stringify(requirements, null, 2)
      : '';
  }
}

function applyQuestPickerSelection(subpanel) {
  const select = subpanel?.querySelector?.('#modQuestWeeklyPicker select[name="quest_pick"]');
  const form = subpanel?.querySelector?.('form[data-action="quest-update-quest"]');
  const questId = String(select?.value ?? '').trim();

  if (!form) {
    return;
  }

  if (!questId) {
    const questIdInput = form.querySelector('input[name="quest_id"]');
    if (questIdInput && !questIdInput.value) {
      resetEnhancedForm(form);
    }
    return;
  }

  const item = __modQuestWeeklyCache.find((entry) => String(entry.quest_id) === questId);
  if (item) {
    fillQuestUpdateFormFromItem(form, item);
  }
}

function initQuestUpdatePanel() {
  const panel = document.querySelector('[data-subpanel="quest-update"]');
  if (!panel || panel.dataset.inited === '1') return;
  panel.dataset.inited = '1';

  panel.addEventListener('change', (event) => {
    const select = event.target?.closest?.('select[name="quest_pick"]');
    if (!select) return;
    applyQuestPickerSelection(panel);
  });

  const questIdInput = panel.querySelector('form[data-action="quest-update-quest"] input[name="quest_id"]');
  const syncFromInput = () => {
    const value = String(questIdInput?.value ?? '').trim();
    if (!value) {
      return;
    }

    const item = __modQuestWeeklyCache.find((entry) => String(entry.quest_id) === value);
    const picker = panel.querySelector('#modQuestWeeklyPicker select[name="quest_pick"]');
    if (picker && picker.value !== value) {
      picker.value = item ? value : '';
      movementTechSyncDdField(picker);
    }
    if (item) {
      fillQuestUpdateFormFromItem(
        panel.querySelector('form[data-action="quest-update-quest"]'),
        item
      );
    }
  };

  questIdInput?.addEventListener('change', syncFromInput);
  questIdInput?.addEventListener('blur', syncFromInput);
}

//———————————————————————————————————————————————————————————————
// TOURNAMENTS
//———————————————————————————————————————————————————————————————
function tournamentIdFrom(form, name = 'category_id') {
  const value = String(new FormData(form).get(name) || '').trim();
  if (!isDigits(value) || Number(value) < 1) {
    toast(`Invalid ${name}`, 'warn');
    return null;
  }
  return value;
}

function tournamentOptionalNumber(fd, key, payload, { allowZero = true } = {}) {
  const raw = fd.get(key);
  if (raw === '' || raw == null) return true;
  const value = Number(raw);
  if (!Number.isFinite(value) || (!allowZero && value <= 0) || (allowZero && value < 0)) {
    toast(`Invalid ${key}`, 'warn');
    return false;
  }
  payload[key] = value;
  return true;
}

function tournamentReadJsonArray(raw, label) {
  const text = String(raw || '').trim();
  if (!text) return undefined;
  const parsed = readJsonField(text);
  if (!Array.isArray(parsed)) {
    toast(`${label} must be a JSON array`, 'err');
    return null;
  }
  return parsed;
}

function tournamentLogAndOut(form, outKey, title, method, res, fallbackUrl = '') {
  logActivity({
    title,
    method,
    url: res.url || fallbackUrl,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  setPanelOut(form, outKey, res.data === '' ? { status: res.status } : res.data);
  toast(res.ok ? 'Tournament request done' : 'Tournament request failed', res.ok ? 'ok' : 'err');
  return res;
}

function buildTournamentCategoryPayload(form, { creating = false } = {}) {
  syncTournamentXpRepeaters(form);
  const fd = new FormData(form);
  const payload = {};

  const name = String(fd.get('name') || '').trim();
  if (name) payload.name = name;
  else if (creating) {
    toast('name is required', 'warn');
    return null;
  }

  const difficulties = fd.getAll('difficulties[]').map((value) => String(value || '').trim()).filter(Boolean);
  if (difficulties.length) payload.difficulties = difficulties;
  else if (creating) {
    toast('Pick at least one difficulty', 'warn');
    return null;
  }

  if (!tournamentOptionalNumber(fd, 'participation_xp', payload)) return null;

  const championRoleId = String(fd.get('champion_role_id') || '').trim();
  if (championRoleId === 'null') payload.champion_role_id = null;
  else if (championRoleId) {
    if (!isDigits(championRoleId)) {
      toast('Invalid champion_role_id', 'warn');
      return null;
    }
    payload.champion_role_id = championRoleId;
  }

  const isActive = String(fd.get('is_active') || '');
  if (isActive === '1') payload.is_active = true;
  if (isActive === '0') payload.is_active = false;

  const placement = tournamentReadJsonArray(fd.get('placement_xp_json'), 'placement_xp');
  if (placement === null) return null;
  if (placement !== undefined) payload.placement_xp = placement;

  const streak = tournamentReadJsonArray(fd.get('streak_xp_json'), 'streak_xp');
  if (streak === null) return null;
  if (streak !== undefined) payload.streak_xp = streak;

  if (!Object.keys(payload).length) {
    toast('Nothing to submit', 'warn');
    return null;
  }

  return payload;
}

function buildTournamentConfigPayload(form) {
  const fd = new FormData(form);
  const payload = {};

  for (const key of ['blacklist_weeks', 'anchor_weekday']) {
    if (!tournamentOptionalNumber(fd, key, payload)) return null;
  }

  for (const key of ['cadence', 'anchor_time', 'anchor_tz']) {
    let value = String(fd.get(key) || '').trim();
    if (!value) continue;
    // Native <input type="time"> yields HH:MM (or HH:MM:SS with step). The API stores HH:MM:SS.
    if (key === 'anchor_time' && /^\d{2}:\d{2}$/.test(value)) value = `${value}:00`;
    payload[key] = value;
  }

  if (!Object.keys(payload).length) {
    toast('Nothing to update', 'warn');
    return null;
  }

  return payload;
}

function fillTournamentConfigForm(form, data) {
  if (!form || !data || typeof data !== 'object') return;
  ['blacklist_weeks', 'cadence', 'anchor_weekday', 'anchor_time', 'anchor_tz'].forEach((key) => {
    const el = form.querySelector(`[name="${CSS.escape(key)}"]`);
    if (el && data[key] != null) {
      el.value = String(data[key]);
      if (el.tagName === 'SELECT') movementTechSyncDdField(el);
    }
  });
}

let __modTournamentCategoryCache = [];
// Category ids that currently have an active/finalizing cycle — PATCH/DELETE return 409 for these.
let __modTournamentLockedCategories = new Set();

function tournamentCategoryIsLocked(id) {
  return __modTournamentLockedCategories.has(String(id));
}

async function refreshTournamentCategoryLocks() {
  const results = await Promise.all([
    http('GET', `${API_TOURNAMENTS}/cycles`, { query: { status: 'active', limit: 100 } }),
    http('GET', `${API_TOURNAMENTS}/cycles`, { query: { status: 'finalizing', limit: 100 } }),
  ]);

  const locked = new Set();
  results.forEach((res) => {
    const cycles = Array.isArray(res.data?.cycles)
      ? res.data.cycles
      : Array.isArray(res.data)
        ? res.data
        : [];
    cycles.forEach((cycle) => {
      const categoryId = cycle?.category_id ?? cycle?.category?.id;
      if (categoryId != null) locked.add(String(categoryId));
    });
  });

  __modTournamentLockedCategories = locked;
  renderTournamentCategoryCards();
  applyTournamentCategoryLockUI();
}

function tournamentEscape(value) {
  return escapeHtml(String(value ?? ''));
}

function tournamentFormatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function normalizeTournamentCategories(data) {
  const rows = Array.isArray(data?.categories)
    ? data.categories
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];

  return rows
    .filter((category) => category && category.id != null)
    .map((category) => ({
      ...category,
      id: Number(category.id),
      difficulties: Array.isArray(category.difficulties) ? category.difficulties : [],
      placement_xp: Array.isArray(category.placement_xp) ? category.placement_xp : [],
      streak_xp: Array.isArray(category.streak_xp) ? category.streak_xp : [],
    }));
}

function tournamentCategoryLabel(category) {
  const id = category?.id == null ? '' : `#${category.id}`;
  const name = String(category?.name ?? 'Unnamed category').trim();
  const difficulties = Array.isArray(category?.difficulties)
    ? category.difficulties.filter(Boolean).join(', ')
    : '';
  return `${id} - ${name}${difficulties ? ` (${difficulties})` : ''}`;
}

function tournamentDropdownRadioName(select, prefix = 'tournament_dd') {
  if (!select.dataset.tournamentRadioName) {
    const index = document.querySelectorAll('[data-tournament-radio-seed]').length + 1;
    select.dataset.tournamentRadioSeed = '1';
    select.dataset.tournamentRadioName = `${prefix}_${select.name || 'field'}_${index}_ui`;
  }
  return select.dataset.tournamentRadioName;
}

function tournamentDropdownOption(select, value, labelText) {
  return movementTechBuildContentDropdownOption(
    select.name,
    value,
    labelText,
    tournamentDropdownRadioName(select)
  );
}

function tournamentStatusPill(status) {
  const text = String(status ?? '-');
  const normalized = text.toLowerCase();
  const cls = normalized === 'active' || normalized === 'true'
    ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
    : normalized === 'pending'
      ? 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300'
      : normalized === 'completed'
        ? 'border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300'
        : 'border-zinc-200/80 bg-white/70 text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300';

  return `<span class="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}">${tournamentEscape(text)}</span>`;
}

function tournamentXpSummary(rows, keyA, keyB) {
  if (!Array.isArray(rows) || !rows.length) return '-';
  return rows
    .map((row) => `${row?.[keyA] ?? '?'}:${row?.[keyB] ?? '?'}`)
    .join(' / ');
}

function renderTournamentCategoryCards() {
  const containers = document.querySelectorAll('[data-tournament-category-cards]');
  const cards = __modTournamentCategoryCache;

  containers.forEach((container) => {
    if (!cards.length) {
      container.innerHTML = `
        <div class="rounded-xl border border-dashed border-zinc-300/80 p-3 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
          No tournament categories loaded.
        </div>`;
      return;
    }

    container.innerHTML = cards
      .map((category) => {
        const difficulties = category.difficulties.length ? category.difficulties.join(', ') : '-';
        const locked = tournamentCategoryIsLocked(category.id);
        const lockedPill = locked
          ? '<span class="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">Locked</span>'
          : '';
        return `
          <button
            type="button"
            data-tournament-category-card
            data-tournament-category-id="${tournamentEscape(category.id)}"
            class="group rounded-xl border border-zinc-200/80 bg-white/80 p-3 text-left transition hover:border-emerald-500/45 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-emerald-400/35 dark:hover:bg-zinc-900"
          >
            <span class="flex items-start justify-between gap-3">
              <span class="min-w-0">
                <span class="block truncate text-sm font-black text-zinc-900 dark:text-zinc-100">#${tournamentEscape(category.id)} - ${tournamentEscape(category.name || 'Unnamed')}</span>
                <span class="mt-1 block truncate text-xs text-zinc-500 dark:text-zinc-400">${tournamentEscape(difficulties)}</span>
              </span>
              <span class="flex flex-col items-end gap-1">
                ${tournamentStatusPill(category.is_active ? 'active' : 'inactive')}
                ${lockedPill}
              </span>
            </span>
            <span class="mt-3 grid grid-cols-3 gap-2 text-xs">
              <span class="rounded-lg bg-zinc-900/5 px-2 py-1 dark:bg-white/5">
                <span class="block text-zinc-500 dark:text-zinc-400">Participation</span>
                <span class="font-semibold">${tournamentEscape(category.participation_xp ?? '-')} XP</span>
              </span>
              <span class="rounded-lg bg-zinc-900/5 px-2 py-1 dark:bg-white/5">
                <span class="block text-zinc-500 dark:text-zinc-400">Placement</span>
                <span class="font-semibold">${tournamentEscape(tournamentXpSummary(category.placement_xp, 'place', 'xp'))}</span>
              </span>
              <span class="rounded-lg bg-zinc-900/5 px-2 py-1 dark:bg-white/5">
                <span class="block text-zinc-500 dark:text-zinc-400">Streak</span>
                <span class="font-semibold">${tournamentEscape(tournamentXpSummary(category.streak_xp, 'threshold', 'xp'))}</span>
              </span>
            </span>
          </button>`;
      })
      .join('');
  });
}

function syncTournamentCategoryDatalist() {
  let datalist = document.getElementById('tournamentCategoryOptions');
  if (!datalist) {
    datalist = document.createElement('datalist');
    datalist.id = 'tournamentCategoryOptions';
    document.body.appendChild(datalist);
  }

  datalist.innerHTML = '';
  __modTournamentCategoryCache.forEach((category) => {
    const option = document.createElement('option');
    option.value = String(category.id);
    option.label = tournamentCategoryLabel(category);
    datalist.appendChild(option);
  });

  document
    .querySelectorAll('[data-panel="tournament"] input[name="category_id"]')
    .forEach((input) => {
      input.setAttribute('list', 'tournamentCategoryOptions');
      input.placeholder = input.placeholder || 'category_id';
    });
}

function syncTournamentCategoryPickers() {
  document.querySelectorAll('[data-tournament-category-picker]').forEach((dd) => {
    const select = dd.querySelector('select[name]');
    const list = dd.querySelector('[data-dd-list]');
    const btn = dd.querySelector('[data-dd-btn]');
    if (!select || !list || !btn) return;

    const placeholder = btn.getAttribute('data-placeholder') || 'Select a category';
    const currentValue = String(select.value ?? '');

    select.innerHTML = '';
    const blank = document.createElement('option');
    blank.value = '';
    blank.textContent = placeholder;
    select.appendChild(blank);

    __modTournamentCategoryCache.forEach((category) => {
      const option = document.createElement('option');
      option.value = String(category.id);
      option.textContent = tournamentCategoryLabel(category);
      select.appendChild(option);
    });

    list.innerHTML = '';
    list.appendChild(tournamentDropdownOption(select, '', placeholder));
    __modTournamentCategoryCache.forEach((category) => {
      list.appendChild(
        tournamentDropdownOption(select, String(category.id), tournamentCategoryLabel(category))
      );
    });

    select.value = __modTournamentCategoryCache.some((category) => String(category.id) === currentValue)
      ? currentValue
      : '';
    movementTechSyncDdField(select);
  });
}

function updateTournamentCategoryCount() {
  document.querySelectorAll('[data-tournament-category-count]').forEach((el) => {
    el.textContent = __modTournamentCategoryCache.length
      ? `${__modTournamentCategoryCache.length} categories loaded`
      : 'No categories loaded';
  });
}

function buildTournamentDropdownShell({ placeholder = 'Select...', fieldName = '', picker = '' } = {}) {
  const dd = document.createElement('div');
  dd.className = 'relative';
  dd.dataset.ddSelect = '';
  if (fieldName) dd.dataset.ddField = fieldName;
  if (picker) dd.dataset.tournamentCategoryPicker = picker;
  dd.innerHTML = `
    <button
      type="button"
      data-dd-btn
      data-placeholder="${tournamentEscape(placeholder)}"
      aria-haspopup="listbox"
      aria-expanded="false"
      class="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-left text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
    >
      <span class="dd-label truncate">${tournamentEscape(placeholder)}</span>
      <svg class="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clip-rule="evenodd"></path>
      </svg>
    </button>
    <div
      data-dd-list
      role="listbox"
      class="custom-multiselect-list absolute left-0 right-0 top-full z-50 mt-1 hidden max-h-[260px] overflow-auto rounded-lg border border-zinc-200/80 bg-white/95 p-1 shadow-xl dark:border-white/10 dark:bg-zinc-900/95"
    ></div>
  `;
  return dd;
}

function enhanceTournamentCategoryInputs(root = document) {
  const panel = root.closest?.('[data-panel="tournament"]') || document.querySelector('[data-panel="tournament"]');
  const scope = root.matches?.('[data-panel="tournament"]') ? root : panel || root;
  if (!scope) return;

  scope.querySelectorAll('input[name="category_id"]:not([data-tournament-category-enhanced])').forEach((input) => {
    input.dataset.tournamentCategoryEnhanced = '1';
    const currentValue = String(input.value || '');
    const placeholder = input.placeholder || 'Select category';
    const select = document.createElement('select');
    select.name = input.name;
    select.className = 'hidden';
    select.setAttribute('aria-hidden', 'true');
    select.dataset.tournamentCategoryHidden = '1';
    select.value = currentValue;

    const dd = buildTournamentDropdownShell({
      fieldName: select.name,
      placeholder,
      picker: input.closest('form')?.dataset?.action || 'category-id',
    });
    dd.appendChild(select);
    input.replaceWith(dd);
  });
}

function enhanceTournamentNativeSelects(root = document) {
  const panel = root.closest?.('[data-panel="tournament"]') || document.querySelector('[data-panel="tournament"]');
  const scope = root.matches?.('[data-panel="tournament"]') ? root : panel || root;
  if (!scope) return;

  scope
    .querySelectorAll('select[name]:not(.hidden):not([data-tournament-native-enhanced])')
    .forEach((select) => {
      if (select.closest('[data-dd-select]')) return;
      select.dataset.tournamentNativeEnhanced = '1';
      const currentValue = String(select.value ?? '');
      const placeholder =
        select.querySelector('option[value=""]')?.textContent?.trim() ||
        select.closest('label')?.childNodes?.[0]?.textContent?.trim() ||
        'Select...';

      const dd = buildTournamentDropdownShell({
        fieldName: select.name,
        placeholder,
      });
      const list = dd.querySelector('[data-dd-list]');

      Array.from(select.options).forEach((option) => {
        list.appendChild(tournamentDropdownOption(select, option.value, option.textContent || option.value || placeholder));
      });

      select.classList.add('hidden');
      select.setAttribute('aria-hidden', 'true');
      select.parentNode.insertBefore(dd, select);
      dd.appendChild(select);
      select.value = currentValue;
      movementTechSyncDdField(select);
    });
}

function tournamentXpConfig(kind) {
  return kind === 'streak'
    ? { key: 'threshold', keyLabel: 'Threshold', valueLabel: 'XP', addLabel: 'Add threshold / XP' }
    : { key: 'place', keyLabel: 'Place', valueLabel: 'XP', addLabel: 'Add place / XP' };
}

function tournamentDefaultXpRows(kind) {
  return kind === 'streak'
    ? [
        { threshold: 3, xp: 150 },
        { threshold: 5, xp: 300 },
      ]
    : [
        { place: 1, xp: 200 },
        { place: 2, xp: 100 },
        { place: 3, xp: 50 },
      ];
}

function normalizeTournamentXpRows(rows, kind) {
  const config = tournamentXpConfig(kind);
  return (Array.isArray(rows) ? rows : [])
    .map((row) => {
      const left = Number(row?.[config.key]);
      const xp = Number(row?.xp);
      if (!Number.isFinite(left) || !Number.isFinite(xp)) return null;
      return { [config.key]: left, xp };
    })
    .filter(Boolean);
}

function parseTournamentXpTextarea(textarea, kind) {
  const raw = String(textarea?.value || '').trim();
  if (!raw) return [];
  const parsed = readJsonField(raw);
  return normalizeTournamentXpRows(parsed, kind);
}

function tournamentXpRowHtml(kind, row = {}) {
  const config = tournamentXpConfig(kind);
  return `
    <div data-tournament-xp-row class="grid gap-2 rounded-xl border border-zinc-200/80 bg-white/70 p-3 dark:border-white/10 dark:bg-zinc-950/40 sm:grid-cols-[1fr_1fr_auto]">
      <label class="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
        ${tournamentEscape(config.keyLabel)}
        <input
          type="number"
          min="0"
          step="1"
          value="${tournamentEscape(row?.[config.key] ?? '')}"
          data-tournament-xp-field="${tournamentEscape(config.key)}"
          class="mt-1 w-full rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </label>
      <label class="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
        ${tournamentEscape(config.valueLabel)}
        <input
          type="number"
          min="0"
          step="1"
          value="${tournamentEscape(row?.xp ?? '')}"
          data-tournament-xp-field="xp"
          class="mt-1 w-full rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </label>
      <button
        type="button"
        data-tournament-xp-remove
        class="self-end rounded-lg border border-zinc-200/80 bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-200 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
      >
        Remove
      </button>
    </div>`;
}

function syncTournamentXpGroup(group) {
  const form = group?.closest?.('form');
  const textarea = form?.querySelector?.(`textarea[name="${CSS.escape(group.dataset.tournamentXpTarget || '')}"]`);
  if (!textarea) return;

  const config = tournamentXpConfig(group.dataset.tournamentXpKind || 'placement');
  const rows = Array.from(group.querySelectorAll('[data-tournament-xp-row]'))
    .map((row) => {
      const left = row.querySelector(`[data-tournament-xp-field="${CSS.escape(config.key)}"]`)?.value;
      const xp = row.querySelector('[data-tournament-xp-field="xp"]')?.value;
      if (left === '' && xp === '') return null;
      const leftNumber = Number(left);
      const xpNumber = Number(xp);
      if (!Number.isFinite(leftNumber) || !Number.isFinite(xpNumber)) return null;
      return { [config.key]: leftNumber, xp: xpNumber };
    })
    .filter(Boolean);

  textarea.value = rows.length ? JSON.stringify(rows, null, 2) : '';
}

function setTournamentXpGroupRows(formOrGroup, targetName, rows) {
  const form = formOrGroup?.matches?.('form') ? formOrGroup : formOrGroup?.closest?.('form');
  const group =
    formOrGroup?.matches?.('[data-tournament-xp-group]') && formOrGroup.dataset.tournamentXpTarget === targetName
      ? formOrGroup
      : form?.querySelector?.(`[data-tournament-xp-group][data-tournament-xp-target="${CSS.escape(targetName)}"]`);
  const textarea = form?.querySelector?.(`textarea[name="${CSS.escape(targetName)}"]`);
  const kind = targetName === 'streak_xp_json' ? 'streak' : 'placement';
  const normalized = normalizeTournamentXpRows(rows, kind);

  if (group) {
    const rowMount = group.querySelector('[data-tournament-xp-rows]');
    if (rowMount) {
      rowMount.innerHTML = normalized
        .map((row) => tournamentXpRowHtml(kind, row))
        .join('');
    }
    syncTournamentXpGroup(group);
  } else if (textarea) {
    textarea.value = normalized.length ? JSON.stringify(normalized, null, 2) : '';
  }
}

function initTournamentXpRepeaters(root = document) {
  root.querySelectorAll('textarea[name="placement_xp_json"], textarea[name="streak_xp_json"]').forEach((textarea) => {
    if (textarea.dataset.tournamentXpEnhanced === '1') return;
    textarea.dataset.tournamentXpEnhanced = '1';

    const kind = textarea.name === 'streak_xp_json' ? 'streak' : 'placement';
    const config = tournamentXpConfig(kind);
    const group = document.createElement('div');
    group.dataset.tournamentXpGroup = '1';
    group.dataset.tournamentXpTarget = textarea.name;
    group.dataset.tournamentXpKind = kind;
    group.className = 'space-y-2';
    group.innerHTML = `
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">${tournamentEscape(config.keyLabel)} / XP</div>
          <div class="text-xs text-zinc-500 dark:text-zinc-400">Rows are converted to ${tournamentEscape(textarea.name)} automatically.</div>
        </div>
        <button
          type="button"
          data-tournament-xp-add
          class="rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-white/10"
        >
          ${tournamentEscape(config.addLabel)}
        </button>
      </div>
      <div data-tournament-xp-rows class="space-y-2"></div>
    `;

    textarea.classList.add('hidden');
    textarea.setAttribute('aria-hidden', 'true');
    const label = textarea.closest('label');
    const anchor = label || textarea;
    anchor.parentNode.insertBefore(group, anchor);
    if (label) label.classList.add('hidden');

    const initialRows = parseTournamentXpTextarea(textarea, kind);
    const defaults = textarea.closest('form')?.dataset?.action === 'tournament-category-create'
      ? tournamentDefaultXpRows(kind)
      : [];
    setTournamentXpGroupRows(group, textarea.name, initialRows.length ? initialRows : defaults);
  });

  if (root.dataset?.tournamentXpBound === '1') return;
  if (root.dataset) root.dataset.tournamentXpBound = '1';

  root.addEventListener('click', (event) => {
    const add = event.target?.closest?.('[data-tournament-xp-add]');
    if (add) {
      event.preventDefault();
      const group = add.closest('[data-tournament-xp-group]');
      const rows = group?.querySelector('[data-tournament-xp-rows]');
      if (!group || !rows) return;
      rows.insertAdjacentHTML('beforeend', tournamentXpRowHtml(group.dataset.tournamentXpKind || 'placement', {}));
      syncTournamentXpGroup(group);
      return;
    }

    const remove = event.target?.closest?.('[data-tournament-xp-remove]');
    if (remove) {
      event.preventDefault();
      const group = remove.closest('[data-tournament-xp-group]');
      remove.closest('[data-tournament-xp-row]')?.remove();
      syncTournamentXpGroup(group);
    }
  });

  root.addEventListener('input', (event) => {
    const field = event.target?.closest?.('[data-tournament-xp-field]');
    if (!field) return;
    syncTournamentXpGroup(field.closest('[data-tournament-xp-group]'));
  });
}

function syncTournamentXpRepeaters(form) {
  form?.querySelectorAll?.('[data-tournament-xp-group]').forEach(syncTournamentXpGroup);
}

function setTournamentCategoryCache(categories) {
  __modTournamentCategoryCache = normalizeTournamentCategories(categories);
  enhanceTournamentCategoryInputs(document);
  enhanceTournamentNativeSelects(document);
  syncTournamentCategoryPickers();
  syncTournamentCategoryDatalist();
  renderTournamentCategoryCards();
  updateTournamentCategoryCount();
}

function upsertTournamentCategory(category) {
  if (!category || category.id == null) return;
  const normalized = normalizeTournamentCategories([category])[0];
  if (!normalized) return;
  const idx = __modTournamentCategoryCache.findIndex((item) => String(item.id) === String(normalized.id));
  if (idx >= 0) __modTournamentCategoryCache[idx] = normalized;
  else __modTournamentCategoryCache.push(normalized);
  setTournamentCategoryCache(__modTournamentCategoryCache);
}

function removeTournamentCategoryFromCache(categoryId) {
  __modTournamentCategoryCache = __modTournamentCategoryCache.filter(
    (item) => String(item.id) !== String(categoryId)
  );
  setTournamentCategoryCache(__modTournamentCategoryCache);
}

function fillTournamentCategoryFormFromItem(form, category) {
  if (!form || !category) return;

  setInputValue(form, 'category_id', category.id);
  setInputValue(form, 'name', category.name ?? '');
  setInputValue(form, 'participation_xp', category.participation_xp ?? '');
  setInputValue(form, 'champion_role_id', category.champion_role_id ?? '');
  setInputValue(form, 'is_active', category.is_active === true ? '1' : category.is_active === false ? '0' : '');
  setTournamentXpGroupRows(form, 'placement_xp_json', category.placement_xp ?? []);
  setTournamentXpGroupRows(form, 'streak_xp_json', category.streak_xp ?? []);

  const selectedDifficulties = new Set((category.difficulties || []).map((value) => String(value)));
  form.querySelectorAll('input[type="checkbox"][name="difficulties[]"]').forEach((input) => {
    input.checked = selectedDifficulties.has(String(input.value));
  });
}

function fillTournamentCategoryCreateDefaults(form) {
  if (!form) return;
  if (!form.querySelector('[name="participation_xp"]')?.value) {
    setInputValue(form, 'participation_xp', 50);
  }
  const placement = form.querySelector('[name="placement_xp_json"]');
  if (placement && !placement.value.trim()) {
    setTournamentXpGroupRows(form, 'placement_xp_json', tournamentDefaultXpRows('placement'));
  }
  const streak = form.querySelector('[name="streak_xp_json"]');
  if (streak && !streak.value.trim()) {
    setTournamentXpGroupRows(form, 'streak_xp_json', tournamentDefaultXpRows('streak'));
  }
}

function applyTournamentCategoryLockUI() {
  const panel = document.querySelector('[data-panel="tournament"]');
  if (!panel) return;

  const updateForm = panel.querySelector('form[data-action="tournament-category-update"]');
  const deleteForm = panel.querySelector('form[data-action="tournament-category-delete"]');
  const id = String(updateForm?.querySelector('[name="category_id"]')?.value || '').trim();
  const locked = !!id && tournamentCategoryIsLocked(id);

  const badge = panel.querySelector('[data-tournament-lock-badge]');
  if (badge) badge.classList.toggle('hidden', !locked);

  [updateForm, deleteForm].forEach((form) => {
    const btn = form?.querySelector('button[type="submit"], button:not([type])');
    if (!btn) return;
    btn.disabled = locked;
    btn.classList.toggle('opacity-50', locked);
    btn.classList.toggle('pointer-events-none', locked);
    if (locked) btn.title = 'Locked while a cycle is active or finalizing.';
    else btn.removeAttribute('title');
  });
}

function applyTournamentCategorySelection(scope, category, { showToast = true } = {}) {
  if (!category) return;
  const panel = scope?.closest?.('[data-panel="tournament"]') || document.querySelector('[data-panel="tournament"]') || document;
  const id = String(category.id);

  panel.querySelectorAll('input[name="category_id"], select[name="category_id"]').forEach((field) => {
    field.value = id;
    if (field.tagName === 'SELECT') movementTechSyncDdField(field);
  });

  panel.querySelectorAll('[data-tournament-category-picker] select[name]').forEach((select) => {
    select.value = id;
    movementTechSyncDdField(select);
  });

  fillTournamentCategoryFormFromItem(
    panel.querySelector('form[data-action="tournament-category-update"]'),
    category
  );

  const deleteInput = panel.querySelector('form[data-action="tournament-category-delete"] [name="category_id"]');
  if (deleteInput) deleteInput.value = id;

  applyTournamentCategoryLockUI();

  if (showToast) toast(`Category ${category.name || `#${id}`} loaded`, 'ok');
}

function openTournamentWorkflowFromOverview({ categoryId = '', cycleId = '', subtab = 'tournament-overview' } = {}) {
  const panel = document.querySelector('[data-panel="tournament"]');
  if (!panel) return;

  const categoryValue = String(categoryId || '').trim();
  if (categoryValue) {
    const category = __modTournamentCategoryCache.find((item) => String(item.id) === categoryValue);
    if (category) {
      applyTournamentCategorySelection(panel, category, { showToast: false });
    } else {
      panel.querySelectorAll('input[name="category_id"], select[name="category_id"]').forEach((field) => {
        field.value = categoryValue;
        if (field.tagName === 'SELECT') movementTechSyncDdField(field);
      });
    }
  }

  const cycleValue = String(cycleId || '').trim();
  if (cycleValue) {
    panel.querySelectorAll('input[name="cycle_id"]').forEach((field) => {
      field.value = cycleValue;
    });
  }

  const subtabBtn = panel.querySelector(`.mod-subtab[data-subtab="${CSS.escape(subtab)}"]`);
  subtabBtn?.click();
}

document.addEventListener('click', (event) => {
  const btn = event.target?.closest?.('[data-tournament-overview-subtab]');
  if (!btn) return;
  event.preventDefault();
  openTournamentWorkflowFromOverview({
    categoryId: btn.dataset.tournamentOverviewCategoryId,
    cycleId: btn.dataset.tournamentOverviewCycleId,
    subtab: btn.dataset.tournamentOverviewSubtab,
  });
});

async function loadTournamentCategories({ form = null, silent = false, force = false } = {}) {
  if (__modTournamentCategoryCache.length && !force) {
    setTournamentCategoryCache(__modTournamentCategoryCache);
    return { ok: true, status: 200, data: __modTournamentCategoryCache, fromCache: true };
  }

  if (form && !silent) setPanelOut(form, 'tournament-categories-res', 'Loading...');
  const res = await http('GET', `${API_TOURNAMENTS}/categories`);

  if (!silent) {
    logActivity({
      title: 'Tournament Categories (GET)',
      method: 'GET',
      url: res.url || `${API_TOURNAMENTS}/categories`,
      ok: res.ok,
      status: res.status,
      data: res.data,
    });
  }

  if (res.ok) {
    setTournamentCategoryCache(res.data);
    if (form && !silent) setPanelOut(form, 'tournament-categories-res', res.data);
    if (!silent) toast('Tournament categories loaded', 'ok');
  } else {
    if (form && !silent) setPanelOut(form, 'tournament-categories-res', res.data ?? 'Request failed');
    toast('Failed to load tournament categories', 'err');
  }

  return res;
}

function renderTournamentOverview(form, payload) {
  const root =
    form?.closest?.('[data-subpanel="tournament-overview"]')?.querySelector?.('[data-tournament-overview-view]') ||
    document.querySelector('[data-tournament-overview-view]');
  if (!root) return;

  const config = payload?.config && typeof payload.config === 'object' ? payload.config : {};
  const categories = normalizeTournamentCategories(payload?.categories);
  const edition = payload?.active_edition && typeof payload.active_edition === 'object' ? payload.active_edition : {};
  const activeCycles = Array.isArray(payload?.active_cycles) ? payload.active_cycles : [];
  const paused = config.transitions_paused === true;
  const anchor = [config.anchor_weekday != null ? `weekday ${config.anchor_weekday}` : '', config.anchor_time, config.anchor_tz]
    .filter(Boolean)
    .join(' - ') || '-';

  const categoryCards = categories.length
    ? categories
        .map((category) => `
          <article class="rounded-xl border border-zinc-200/80 bg-white/70 p-3 dark:border-white/10 dark:bg-zinc-900/55">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="truncate font-black">#${tournamentEscape(category.id)} - ${tournamentEscape(category.name || 'Unnamed')}</div>
                <div class="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">${tournamentEscape(category.difficulties.join(', ') || '-')}</div>
              </div>
              ${tournamentStatusPill(category.is_active ? 'active' : 'inactive')}
            </div>
            <div class="mt-3 grid gap-2 text-xs sm:grid-cols-3">
              <div class="rounded-lg bg-zinc-900/5 px-2 py-1 dark:bg-white/5">Participation <strong>${tournamentEscape(category.participation_xp ?? '-')}</strong></div>
              <div class="rounded-lg bg-zinc-900/5 px-2 py-1 dark:bg-white/5">Placement <strong>${tournamentEscape(tournamentXpSummary(category.placement_xp, 'place', 'xp'))}</strong></div>
              <div class="rounded-lg bg-zinc-900/5 px-2 py-1 dark:bg-white/5">Streak <strong>${tournamentEscape(tournamentXpSummary(category.streak_xp, 'threshold', 'xp'))}</strong></div>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              <button type="button" data-tournament-overview-category-id="${tournamentEscape(category.id)}" data-tournament-overview-subtab="tournament-categories" class="rounded-lg border border-zinc-200/80 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10">Edit category</button>
              <button type="button" data-tournament-overview-category-id="${tournamentEscape(category.id)}" data-tournament-overview-subtab="tournament-maps" class="rounded-lg border border-zinc-200/80 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10">Map tools</button>
            </div>
          </article>`)
        .join('')
    : '<div class="rounded-xl border border-dashed border-zinc-300/80 p-3 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">No categories returned.</div>';

  const cycleCards = activeCycles.length
    ? activeCycles
        .map((entry) => {
          const cycle = entry?.cycle || {};
          return `
            <article class="rounded-xl border border-zinc-200/80 bg-white/70 p-3 dark:border-white/10 dark:bg-zinc-900/55">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="truncate text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">${tournamentEscape(entry?.category_name || `Category #${entry?.category_id ?? '-'}`)}</div>
                  <div class="mt-1 truncate text-base font-black">${tournamentEscape(cycle.map_name || 'No active map')}</div>
                </div>
                ${tournamentStatusPill(cycle.status || entry?.response_status || '-')}
              </div>
              <dl class="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                <div class="rounded-lg bg-zinc-900/5 px-2 py-1 dark:bg-white/5"><dt class="text-zinc-500 dark:text-zinc-400">Code</dt><dd class="font-mono font-semibold">${tournamentEscape(cycle.map_code || '-')}</dd></div>
                <div class="rounded-lg bg-zinc-900/5 px-2 py-1 dark:bg-white/5"><dt class="text-zinc-500 dark:text-zinc-400">Difficulty</dt><dd class="font-semibold">${tournamentEscape(cycle.map_difficulty || '-')}</dd></div>
                <div class="rounded-lg bg-zinc-900/5 px-2 py-1 dark:bg-white/5"><dt class="text-zinc-500 dark:text-zinc-400">Started</dt><dd class="font-semibold">${tournamentEscape(tournamentFormatDate(cycle.started_at))}</dd></div>
                <div class="rounded-lg bg-zinc-900/5 px-2 py-1 dark:bg-white/5"><dt class="text-zinc-500 dark:text-zinc-400">Winner</dt><dd class="truncate font-semibold">${tournamentEscape(cycle.winner_name || cycle.winner_user_id || '-')}</dd></div>
              </dl>
              <div class="mt-3 flex flex-wrap gap-2">
                <button type="button" data-tournament-overview-category-id="${tournamentEscape(entry?.category_id ?? cycle.category_id ?? '')}" data-tournament-overview-subtab="tournament-maps" class="rounded-lg border border-zinc-200/80 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10">Open map tools</button>
                ${cycle.id != null ? `<button type="button" data-tournament-overview-cycle-id="${tournamentEscape(cycle.id)}" data-tournament-overview-subtab="tournament-cycles" class="rounded-lg border border-zinc-200/80 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10">Open leaderboard</button>` : ''}
              </div>
            </article>`;
        })
        .join('')
    : '<div class="rounded-xl border border-dashed border-zinc-300/80 p-3 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">No active cycles returned.</div>';

  root.innerHTML = `
    <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <section class="rounded-xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-900/55">
        <div class="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">Edition</div>
        <div class="mt-2 flex items-center justify-between gap-3">
          <div class="font-black">${tournamentEscape(edition.status || '-')}</div>
          ${tournamentStatusPill(edition.status || '-')}
        </div>
        <div class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">${tournamentEscape(tournamentFormatDate(edition.started_at))} -> ${tournamentEscape(tournamentFormatDate(edition.ends_at))}</div>
      </section>
      <section class="rounded-xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-900/55">
        <div class="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">Cadence</div>
        <div class="mt-2 font-black">${tournamentEscape(config.cadence || '-')}</div>
        <div class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">${tournamentEscape(anchor)}</div>
      </section>
      <section class="rounded-xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-900/55">
        <div class="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">Transitions</div>
        <div class="mt-2">${tournamentStatusPill(paused ? 'paused' : 'running')}</div>
        <div class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Debug: ${tournamentEscape(config.debug_cycle_seconds ?? '-')}</div>
      </section>
      <section class="rounded-xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-900/55">
        <div class="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">Categories</div>
        <div class="mt-2 font-black">${tournamentEscape(categories.length)}</div>
        <div class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Blacklist: ${tournamentEscape(config.blacklist_weeks ?? '-')} weeks</div>
      </section>
    </div>

    <section class="mt-4">
      <div class="mb-2 flex items-center justify-between gap-3">
        <h4 class="font-semibold">Active cycles</h4>
        <span class="text-xs text-zinc-500 dark:text-zinc-400">${tournamentEscape(activeCycles.length)} live rows</span>
      </div>
      <div class="grid gap-3 xl:grid-cols-2">${cycleCards}</div>
    </section>

    <section class="mt-4">
      <div class="mb-2 flex items-center justify-between gap-3">
        <h4 class="font-semibold">Categories</h4>
        <span class="text-xs text-zinc-500 dark:text-zinc-400">${tournamentEscape(categories.length)} configured</span>
      </div>
      <div class="grid gap-3 xl:grid-cols-2">${categoryCards}</div>
    </section>
  `;
  root.classList.remove('hidden');
}

function fillTournamentLifecycleFormsFromOverview(form, payload) {
  const panel = form?.closest?.('[data-panel="tournament"]') || document.querySelector('[data-panel="tournament"]') || document;
  const config = payload?.config && typeof payload.config === 'object' ? payload.config : null;
  if (!config) return;

  fillTournamentConfigForm(panel.querySelector('form[data-action="tournament-config-update"]'), config);
  const pauseSelect = panel.querySelector('form[data-action="tournament-pause"] select[name="paused"]');
  if (pauseSelect) {
    pauseSelect.value = config.transitions_paused === true ? '1' : '0';
    movementTechSyncDdField(pauseSelect);
  }
  const debugSeconds = panel.querySelector('form[data-action="tournament-debug-cycle-length"] input[name="seconds"]');
  if (debugSeconds) debugSeconds.value = config.debug_cycle_seconds ?? '';
}

async function handleTournamentOverview(form, { silent = false } = {}) {
  setPanelOut(form, 'tournament-overview', 'Loading...');

  const [config, categories, edition] = await Promise.all([
    http('GET', `${API_TOURNAMENTS}/config`),
    http('GET', `${API_TOURNAMENTS}/categories`),
    http('GET', `${API_TOURNAMENTS}/editions/active`),
  ]);

  const categoryRows = Array.isArray(categories.data) ? categories.data : [];
  const activeCycles = await Promise.all(
    categoryRows.map(async (category) => {
      const res = await http('GET', `${API_TOURNAMENTS}/cycles`, {
        query: { status: 'active', category_id: category.id, limit: 1 },
      });
      return {
        category_id: category.id,
        category_name: category.name,
        response_status: res.status,
        cycle: Array.isArray(res.data?.cycles) ? res.data.cycles[0] ?? null : null,
      };
    })
  );

  const payload = {
    config: config.data,
    categories: categories.data,
    active_edition: edition.ok ? edition.data : { status: edition.status, data: edition.data },
    active_cycles: activeCycles,
  };

  if (categories.ok) setTournamentCategoryCache(categories.data);
  renderTournamentOverview(form, payload);
  fillTournamentLifecycleFormsFromOverview(form, payload);

  logActivity({
    title: 'Tournament Overview',
    method: 'GET',
    url: `${API_TOURNAMENTS}/*`,
    ok: config.ok && categories.ok,
    status: config.ok && categories.ok ? 200 : 'ERR',
    data: payload,
  });
  setPanelOut(form, 'tournament-overview', payload);
  if (!silent) toast('Tournament overview loaded', config.ok && categories.ok ? 'ok' : 'err');
}

async function handleTournamentConfigGet(form) {
  setPanelOut(form, 'tournament-config-res', 'Loading...');
  const res = await http('GET', `${API_TOURNAMENTS}/config`);
  tournamentLogAndOut(form, 'tournament-config-res', 'Tournament Config (GET)', 'GET', res, `${API_TOURNAMENTS}/config`);
  if (res.ok) fillTournamentConfigForm(findRelatedActionForm(form, 'tournament-config-update'), res.data);
}

async function handleTournamentConfigUpdate(form) {
  const payload = buildTournamentConfigPayload(form);
  if (!payload) return;
  setPanelOut(form, 'tournament-config-res', 'Saving...');
  const res = await http('PATCH', `${API_TOURNAMENTS_MODS}/config`, { body: payload });
  tournamentLogAndOut(form, 'tournament-config-res', 'Tournament Config (PATCH)', 'PATCH', res, `${API_TOURNAMENTS_MODS}/config`);
}

async function handleTournamentCategoryList(form) {
  const res = await loadTournamentCategories({ form, silent: false, force: true });
  refreshTournamentCategoryLocks();
  return res;
}

async function handleTournamentCategoryGet(form) {
  const id = tournamentIdFrom(form);
  if (!id) return;
  setPanelOut(form, 'tournament-categories-res', 'Loading...');
  const url = `${API_TOURNAMENTS}/categories/${encodeURIComponent(id)}`;
  const res = await http('GET', url);
  tournamentLogAndOut(form, 'tournament-categories-res', `Tournament Category #${id} (GET)`, 'GET', res, url);
  if (res.ok) {
    upsertTournamentCategory(res.data);
    applyTournamentCategorySelection(form, res.data);
  }
}

async function handleTournamentCategoryCreate(form) {
  const payload = buildTournamentCategoryPayload(form, { creating: true });
  if (!payload) return;
  setPanelOut(form, 'tournament-category-create-res', 'Creating...');
  const res = await http('POST', `${API_TOURNAMENTS_MODS}/categories`, { body: payload });
  tournamentLogAndOut(form, 'tournament-category-create-res', 'Create Tournament Category (POST)', 'POST', res, `${API_TOURNAMENTS_MODS}/categories`);
  if (res.ok) {
    upsertTournamentCategory(res.data);
    const panel = form.closest?.('[data-subpanel="tournament-categories"]') || document;
    applyTournamentCategorySelection(panel, res.data, { showToast: false });
  }
}

async function handleTournamentCategoryUpdate(form) {
  const id = tournamentIdFrom(form);
  if (!id) return;
  const payload = buildTournamentCategoryPayload(form);
  if (!payload) return;
  setPanelOut(form, 'tournament-category-update-res', 'Saving...');
  const url = `${API_TOURNAMENTS_MODS}/categories/${encodeURIComponent(id)}`;
  const res = await http('PATCH', url, { body: payload });
  tournamentLogAndOut(form, 'tournament-category-update-res', `Update Tournament Category #${id} (PATCH)`, 'PATCH', res, url);
  if (res.ok) {
    upsertTournamentCategory(res.data);
    applyTournamentCategorySelection(form, res.data, { showToast: false });
  } else if (res.status === 409) {
    toast('Category is locked while a cycle is in progress', 'warn');
    refreshTournamentCategoryLocks();
  }
}

async function handleTournamentCategoryDelete(form) {
  const id = tournamentIdFrom(form);
  if (!id) return;
  setPanelOut(form, 'tournament-category-delete-res', 'Deleting...');
  const url = `${API_TOURNAMENTS_MODS}/categories/${encodeURIComponent(id)}`;
  const res = await http('DELETE', url);
  tournamentLogAndOut(form, 'tournament-category-delete-res', `Delete Tournament Category #${id} (DELETE)`, 'DELETE', res, url);
  if (res.ok) {
    removeTournamentCategoryFromCache(id);
    resetEnhancedForm(form);
  } else if (res.status === 409) {
    toast('Category is locked while a cycle is in progress', 'warn');
    refreshTournamentCategoryLocks();
  }
}

async function handleTournamentNextCycle(form) {
  const id = tournamentIdFrom(form);
  if (!id) return;
  setPanelOut(form, 'tournament-maps-res', 'Loading...');
  const url = `${API_TOURNAMENTS}/categories/${encodeURIComponent(id)}/next-cycle`;
  const res = await http('GET', url);
  tournamentLogAndOut(form, 'tournament-maps-res', `Tournament Next Cycle #${id} (GET)`, 'GET', res, url);
}

async function handleTournamentSelectMap(form) {
  const id = tournamentIdFrom(form);
  if (!id) return;
  setPanelOut(form, 'tournament-maps-res', 'Selecting...');
  const url = `${API_TOURNAMENTS_MODS}/categories/${encodeURIComponent(id)}/select-map`;
  const res = await http('POST', url, { body: {} });
  tournamentLogAndOut(form, 'tournament-maps-res', `Tournament Select Map #${id} (POST)`, 'POST', res, url);
}

async function handleTournamentChooseMap(form) {
  const id = tournamentIdFrom(form);
  if (!id) return;
  const mapCode = String(new FormData(form).get('map_code') || '').trim().toUpperCase();
  if (!mapCode) return toast('map_code is required', 'warn');
  setPanelOut(form, 'tournament-maps-res', 'Choosing...');
  const url = `${API_TOURNAMENTS_MODS}/categories/${encodeURIComponent(id)}/next-cycle`;
  const res = await http('PATCH', url, { body: { map_code: mapCode } });
  tournamentLogAndOut(form, 'tournament-maps-res', `Tournament Choose Map #${id} (PATCH)`, 'PATCH', res, url);
}

async function handleTournamentRerollMap(form) {
  const id = tournamentIdFrom(form);
  if (!id) return;
  setPanelOut(form, 'tournament-maps-res', 'Rerolling...');
  const url = `${API_TOURNAMENTS_MODS}/categories/${encodeURIComponent(id)}/reroll`;
  const res = await http('POST', url, { body: {} });
  tournamentLogAndOut(form, 'tournament-maps-res', `Tournament Reroll Pending #${id} (POST)`, 'POST', res, url);
}

async function handleTournamentRerollActive(form) {
  const id = tournamentIdFrom(form);
  if (!id) return;
  if (!form.querySelector('input[name="confirm"]')?.checked) {
    toast('Tick the confirmation box first', 'warn');
    return;
  }

  const category = __modTournamentCategoryCache.find((c) => String(c.id) === String(id));
  const ok = await showConfirmDanger({
    title: 'Reroll the LIVE map',
    message:
      `This rerolls the currently live map for ${category?.name ? `"${category.name}"` : `category #${id}`} and ` +
      'DELETES ALL submissions already made for it.\n\n' +
      'The edition window stays the same, but every run players submitted for the current map will be wiped. ' +
      'This cannot be undone. Continue?',
    confirm: 'Reroll & wipe submissions',
    cancel: 'Cancel',
  });
  if (!ok) return;

  setPanelOut(form, 'tournament-maps-res', 'Rerolling active cycle...');
  const url = `${API_TOURNAMENTS_MODS}/categories/${encodeURIComponent(id)}/reroll-active`;
  const res = await http('POST', url, { body: {} });
  tournamentLogAndOut(form, 'tournament-maps-res', `Tournament Reroll Active #${id} (POST)`, 'POST', res, url);
}

async function handleTournamentCycleList(form) {
  const fd = new FormData(form);
  const query = {};
  ['status', 'category_id', 'limit', 'offset'].forEach((key) => {
    const value = String(fd.get(key) || '').trim();
    if (value) query[key] = value;
  });
  setPanelOut(form, 'tournament-cycles-res', 'Loading...');
  const res = await http('GET', `${API_TOURNAMENTS}/cycles`, { query });
  tournamentLogAndOut(form, 'tournament-cycles-res', 'Tournament Cycles (GET)', 'GET', res, `${API_TOURNAMENTS}/cycles`);
}

async function handleTournamentLeaderboard(form) {
  const id = tournamentIdFrom(form, 'cycle_id');
  if (!id) return;
  setPanelOut(form, 'tournament-cycles-res', 'Loading...');
  const url = `${API_TOURNAMENTS}/cycles/${encodeURIComponent(id)}/leaderboard`;
  const res = await http('GET', url);
  tournamentLogAndOut(form, 'tournament-cycles-res', `Tournament Leaderboard #${id} (GET)`, 'GET', res, url);
}

async function handleTournamentStreak(form) {
  const id = tournamentIdFrom(form, 'user_id');
  if (!id) return;
  setPanelOut(form, 'tournament-cycles-res', 'Loading...');
  const url = `${API_TOURNAMENTS}/streaks/${encodeURIComponent(id)}`;
  const res = await http('GET', url);
  tournamentLogAndOut(form, 'tournament-cycles-res', `Tournament Streak ${id} (GET)`, 'GET', res, url);
}

async function handleTournamentActiveEdition(form) {
  setPanelOut(form, 'tournament-lifecycle-res', 'Loading...');
  const res = await http('GET', `${API_TOURNAMENTS}/editions/active`);
  tournamentLogAndOut(form, 'tournament-lifecycle-res', 'Tournament Active Edition (GET)', 'GET', res, `${API_TOURNAMENTS}/editions/active`);
}

async function handleTournamentBootstrap(form) {
  setPanelOut(form, 'tournament-lifecycle-res', 'Bootstrapping...');
  const res = await http('POST', `${API_TOURNAMENTS_MODS}/bootstrap`, { body: {} });
  tournamentLogAndOut(form, 'tournament-lifecycle-res', 'Tournament Bootstrap (POST)', 'POST', res, `${API_TOURNAMENTS_MODS}/bootstrap`);
}

async function handleTournamentPublishResults(form) {
  setPanelOut(form, 'tournament-lifecycle-res', 'Publishing...');
  const res = await http('PATCH', `${API_TOURNAMENTS_MODS}/publish-results`, { body: {} });
  tournamentLogAndOut(form, 'tournament-lifecycle-res', 'Tournament Publish Results (PATCH)', 'PATCH', res, `${API_TOURNAMENTS_MODS}/publish-results`);
}

async function handleTournamentPause(form) {
  const paused = String(new FormData(form).get('paused') || '');
  const body = { paused: paused === '1' };
  setPanelOut(form, 'tournament-lifecycle-res', 'Saving...');
  const res = await http('PATCH', `${API_TOURNAMENTS_MODS}/pause`, { body });
  tournamentLogAndOut(form, 'tournament-lifecycle-res', 'Tournament Pause (PATCH)', 'PATCH', res, `${API_TOURNAMENTS_MODS}/pause`);
}

async function handleTournamentDebugCycleLength(form) {
  const raw = String(new FormData(form).get('seconds') || '').trim();
  const body = { seconds: raw ? Number(raw) : null };
  if (raw && (!Number.isInteger(body.seconds) || body.seconds < 1)) {
    toast('Invalid seconds', 'warn');
    return;
  }
  setPanelOut(form, 'tournament-lifecycle-res', 'Saving...');
  const res = await http('PATCH', `${API_TOURNAMENTS_MODS}/debug-cycle-length`, { body });
  tournamentLogAndOut(form, 'tournament-lifecycle-res', 'Tournament Debug Cycle Length (PATCH)', 'PATCH', res, `${API_TOURNAMENTS_MODS}/debug-cycle-length`);
}

function initTournamentOverviewPanel() {
  const panel = document.querySelector('[data-subpanel="tournament-overview"]');
  if (!panel || panel.dataset.inited === '1') return;
  panel.dataset.inited = '1';

  const form = panel.querySelector('form[data-action="tournament-load-overview"]');
  if (form) {
    handleTournamentOverview(form, { silent: true });
  }
}

function initTournamentCategoryPanel() {
  const panel = document.querySelector('[data-subpanel="tournament-categories"]');
  if (!panel) return;

  enhanceTournamentCategoryInputs(panel);
  enhanceTournamentNativeSelects(panel);
  initTournamentXpRepeaters(panel);

  if (panel.dataset.inited !== '1') {
    panel.dataset.inited = '1';

    panel.addEventListener('change', (event) => {
      const select = event.target?.closest?.('select[name="category_pick_update"]');
      if (!select) return;
      const category = __modTournamentCategoryCache.find((item) => String(item.id) === String(select.value));
      if (category) applyTournamentCategorySelection(panel, category);
    });

    panel.addEventListener('click', (event) => {
      const card = event.target?.closest?.('[data-tournament-category-card][data-tournament-category-id]');
      if (!card) return;
      event.preventDefault();
      const category = __modTournamentCategoryCache.find(
        (item) => String(item.id) === String(card.dataset.tournamentCategoryId)
      );
      if (category) applyTournamentCategorySelection(panel, category);
    });

    const categoryIdInput = panel.querySelector('form[data-action="tournament-category-update"] [name="category_id"]');
    const syncFromInput = () => {
      const value = String(categoryIdInput?.value ?? '').trim();
      if (!value) return;
      const category = __modTournamentCategoryCache.find((item) => String(item.id) === value);
      const picker = panel.querySelector('select[name="category_pick_update"]');
      if (picker) {
        picker.value = category ? value : '';
        movementTechSyncDdField(picker);
      }
      if (category) applyTournamentCategorySelection(panel, category, { showToast: false });
    };
    categoryIdInput?.addEventListener('change', syncFromInput);
    categoryIdInput?.addEventListener('blur', syncFromInput);
  }

  fillTournamentCategoryCreateDefaults(panel.querySelector('form[data-action="tournament-category-create"]'));
  syncTournamentCategoryDatalist();
  syncTournamentCategoryPickers();
  renderTournamentCategoryCards();
  updateTournamentCategoryCount();

  const form = panel.querySelector('form[data-action="tournament-category-list"]');
  loadTournamentCategories({ form, silent: true });
  refreshTournamentCategoryLocks();
}

function initTournamentHelperPanel(name) {
  const panel = document.querySelector(`[data-subpanel="${CSS.escape(name)}"]`);
  if (!panel) return;
  enhanceTournamentCategoryInputs(panel);
  enhanceTournamentNativeSelects(panel);
  syncTournamentCategoryDatalist();
  syncTournamentCategoryPickers();
  if (!__modTournamentCategoryCache.length) {
    loadTournamentCategories({ silent: true });
  }
}

/* ===================== Tournament lifecycle (state-aware panel) ===================== */

let __tournamentCountdownTimer = null;

function tournamentLifecyclePanelEl() {
  return document.querySelector('[data-tournament-lifecycle-panel]');
}

function tournamentIsProdEnv() {
  const env = String(tournamentLifecyclePanelEl()?.dataset?.appEnv || '').toLowerCase();
  return env === 'production' || env === 'prod';
}

function clearTournamentCountdown() {
  if (__tournamentCountdownTimer) {
    clearInterval(__tournamentCountdownTimer);
    __tournamentCountdownTimer = null;
  }
}

function populateTournamentTimezoneDatalist() {
  const datalist = document.getElementById('tournamentTimezoneOptions');
  if (!datalist || datalist.dataset.filled === '1') return;

  let zones = [];
  try {
    zones = typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : [];
  } catch {
    zones = [];
  }
  if (!Array.isArray(zones) || !zones.length) {
    zones = [
      'UTC', 'America/Los_Angeles', 'America/Denver', 'America/Chicago', 'America/New_York',
      'America/Sao_Paulo', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow',
      'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney',
    ];
  }

  datalist.innerHTML = zones.map((zone) => `<option value="${tournamentEscape(zone)}"></option>`).join('');
  datalist.dataset.filled = '1';
}

function tournamentCountdownText(target) {
  const ms = target instanceof Date ? target.getTime() : Number(new Date(target).getTime());
  if (!Number.isFinite(ms)) return '-';
  let diff = Math.floor((ms - Date.now()) / 1000);
  if (diff <= 0) return 'window ended — awaiting rollover';

  const days = Math.floor(diff / 86400); diff -= days * 86400;
  const hours = Math.floor(diff / 3600); diff -= hours * 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff - minutes * 60;

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (days || hours) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(' ');
}

function tournamentBootstrapError(data) {
  if (!data || typeof data !== 'object') return '';
  if (typeof data.message === 'string' && data.message.trim()) return data.message.trim();
  if (data.errors && typeof data.errors === 'object') {
    const first = Object.values(data.errors).flat().filter(Boolean)[0];
    if (first) return String(first);
  }
  return '';
}

function tournamentLifecycleHeader(config) {
  const paused = config?.transitions_paused === true;
  const rotationPill = paused
    ? '<span class="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">Auto-rotation paused</span>'
    : '<span class="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">Auto-rotation on</span>';
  return rotationPill;
}

function renderTournamentLifecyclePanel({ edition, config, cycles }) {
  const panel = tournamentLifecyclePanelEl();
  if (!panel) return;
  clearTournamentCountdown();

  const status = edition && typeof edition === 'object' ? String(edition.status || '').toLowerCase() : null;
  const header = tournamentLifecycleHeader(config);

  let body = '';

  if (!edition) {
    // No active edition (404).
    body = `
      <div class="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 dark:border-white/10 dark:bg-zinc-950/40">
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-base font-black">No tournament running</h4>
          ${header}
        </div>
        <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">There is no active edition. Starting the tournament does <strong>two</strong> things:</p>
        <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
          <li>Starts the first edition now and opens the first cycle for every active category.</li>
          <li>Enables automatic weekly rotation by clearing the global pause flag.</li>
        </ul>
        <button type="button" data-tournament-lc-action="start" class="mt-4 w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
          Start tournament &amp; enable rotation
        </button>
      </div>`;
  } else if (status === 'active') {
    const paused = config?.transitions_paused === true;
    const toggle = paused
      ? `<button type="button" data-tournament-lc-action="resume" class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Resume auto-rotation</button>`
      : `<button type="button" data-tournament-lc-action="pause" class="w-full sm:w-auto cursor-pointer rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 font-semibold text-amber-700 hover:bg-amber-500/15 dark:text-amber-300">Pause auto-rotation</button>`;

    const cycleRows = Array.isArray(cycles) && cycles.length
      ? cycles.map((cycle) => {
          const cached = __modTournamentCategoryCache.find((c) => String(c.id) === String(cycle.category_id));
          const categoryName = cycle.category_name || cached?.name || `Category #${cycle.category_id ?? '-'}`;
          return `
          <div class="flex items-center justify-between gap-3 rounded-xl border border-zinc-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-zinc-900/55">
            <div class="min-w-0">
              <div class="truncate text-sm font-semibold">${tournamentEscape(categoryName)}</div>
              <div class="truncate text-xs text-zinc-500 dark:text-zinc-400">${tournamentEscape(cycle.map_name || 'No map')} <span class="font-mono">${tournamentEscape(cycle.map_code || '')}</span> ${cycle.map_difficulty ? `· ${tournamentEscape(cycle.map_difficulty)}` : ''}</div>
            </div>
            ${tournamentStatusPill(cycle.status || 'active')}
          </div>`;
        }).join('')
      : '<div class="rounded-xl border border-dashed border-zinc-300/80 p-3 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">No active cycles.</div>';

    body = `
      <div class="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5 dark:border-emerald-400/15">
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-base font-black">Edition in progress</h4>
          ${header}
        </div>
        <dl class="mt-3 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white/70 px-3 py-2 dark:bg-zinc-900/55"><dt class="text-xs text-zinc-500 dark:text-zinc-400">Started</dt><dd class="text-sm font-semibold">${tournamentEscape(tournamentFormatDate(edition.started_at))}</dd></div>
          <div class="rounded-xl bg-white/70 px-3 py-2 dark:bg-zinc-900/55"><dt class="text-xs text-zinc-500 dark:text-zinc-400">Ends</dt><dd class="text-sm font-semibold">${tournamentEscape(tournamentFormatDate(edition.ends_at))}</dd></div>
          <div class="rounded-xl bg-white/70 px-3 py-2 dark:bg-zinc-900/55"><dt class="text-xs text-zinc-500 dark:text-zinc-400">Time left</dt><dd class="text-sm font-semibold tabular-nums" data-tournament-countdown data-ends-at="${tournamentEscape(edition.ends_at || '')}">…</dd></div>
        </dl>
        <div class="mt-4">
          <div class="mb-2 text-sm font-semibold">Active cycles</div>
          <div class="space-y-2">${cycleRows}</div>
        </div>
        <div class="mt-4 rounded-xl border border-zinc-200/80 bg-white/60 p-3 dark:border-white/10 dark:bg-zinc-900/40">
          <p class="text-xs text-zinc-600 dark:text-zinc-300">Pausing is a <strong>hiatus</strong>: the current edition still finishes its full term. Only creation of the <strong>next</strong> edition at the boundary is suppressed until you resume.</p>
          <div class="mt-3">${toggle}</div>
        </div>
      </div>`;
  } else if (status === 'awaiting_results') {
    const pending = edition.pending_verifications ?? edition.awaiting_verifications ?? edition.pending_count ?? null;
    const pendingText = pending != null
      ? `<strong>${tournamentEscape(pending)}</strong> verification${Number(pending) === 1 ? '' : 's'} still pending.`
      : 'Verifications are still being processed.';

    body = `
      <div class="rounded-2xl border border-sky-500/20 bg-sky-500/[0.04] p-5 dark:border-sky-400/15">
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-base font-black">Edition ended — awaiting results</h4>
          ${header}
        </div>
        <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">The edition window closed and standings publish automatically once verifications finish. ${pendingText}</p>
        <div class="mt-4 rounded-xl border border-zinc-200/80 bg-white/60 p-3 dark:border-white/10 dark:bg-zinc-900/40">
          <p class="text-xs text-zinc-600 dark:text-zinc-300">Use <strong>Publish results now</strong> only as an escape hatch — it force-publishes from currently-verified runs and ignores any in-flight verifications.</p>
          <button type="button" data-tournament-lc-action="publish" class="mt-3 w-full sm:w-auto cursor-pointer rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500">Publish results now</button>
        </div>
      </div>`;
  } else if (status === 'completed') {
    body = `
      <div class="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 dark:border-white/10 dark:bg-zinc-950/40">
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-base font-black">Edition complete</h4>
          ${header}
        </div>
        <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Final standings have been published${edition.ends_at ? ` (ended ${tournamentEscape(tournamentFormatDate(edition.ends_at))})` : ''}. The next edition starts automatically at the next anchor unless auto-rotation is paused.</p>
        <button type="button" data-tournament-lc-action="open-cycles" class="mt-4 w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">View completed cycles &amp; standings</button>
      </div>`;
  } else {
    body = `
      <div class="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 dark:border-white/10 dark:bg-zinc-950/40">
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-base font-black">Edition status: ${tournamentEscape(edition.status || 'unknown')}</h4>
          ${header}
        </div>
        <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">No specific actions are available for this state right now.</p>
      </div>`;
  }

  // Debug tools — hidden in production (the API itself returns 403 in prod).
  let debug = '';
  if (!tournamentIsProdEnv()) {
    const current = config?.debug_cycle_seconds;
    debug = `
      <details class="group rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-4 dark:border-amber-400/15">
        <summary class="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-amber-700 marker:hidden dark:text-amber-300 [&::-webkit-details-marker]:hidden">
          <svg class="h-4 w-4 shrink-0 text-amber-500 transition-transform group-open:rotate-90 dark:text-amber-300" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Debug tools (non-production only)</span>
        </summary>
        <p class="mt-2 text-xs text-zinc-600 dark:text-zinc-300">Override the cycle length to speed up testing. Current override: <strong>${current != null ? `${tournamentEscape(current)}s` : 'none'}</strong>.</p>
        <div class="mt-3 flex flex-col gap-2 sm:flex-row">
          <input data-tournament-debug-seconds type="number" min="1" step="1" placeholder="seconds" value="${current != null ? tournamentEscape(current) : ''}" class="min-w-0 flex-1 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500/60 focus:outline-none" />
          <button type="button" data-tournament-lc-action="debug-set" class="cursor-pointer rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100">Set</button>
          <button type="button" data-tournament-lc-action="debug-clear" class="cursor-pointer rounded-xl border border-zinc-200/80 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10">Clear override</button>
        </div>
      </details>`;
  }

  panel.innerHTML = body + debug;

  // Live countdown for the active edition.
  const countdownEl = panel.querySelector('[data-tournament-countdown]');
  if (countdownEl) {
    const endsAt = countdownEl.dataset.endsAt;
    const tick = () => { countdownEl.textContent = tournamentCountdownText(endsAt); };
    tick();
    __tournamentCountdownTimer = setInterval(tick, 1000);
  }
}

async function loadTournamentLifecycleState() {
  const panel = tournamentLifecyclePanelEl();
  if (!panel) return;

  const [edition, config, activeCycles] = await Promise.all([
    http('GET', `${API_TOURNAMENTS}/editions/active`),
    http('GET', `${API_TOURNAMENTS}/config`),
    http('GET', `${API_TOURNAMENTS}/cycles`, { query: { status: 'active', limit: 100 } }),
  ]);

  const cfg = config.ok && config.data && typeof config.data === 'object' ? config.data : {};
  const editionData = edition.ok && edition.data && typeof edition.data === 'object' ? edition.data : null;
  const cycles = Array.isArray(activeCycles.data?.cycles)
    ? activeCycles.data.cycles
    : Array.isArray(activeCycles.data)
      ? activeCycles.data
      : [];

  const subpanel = document.querySelector('[data-subpanel="tournament-lifecycle"]');
  if (config.ok) fillTournamentConfigForm(subpanel?.querySelector('form[data-action="tournament-config-update"]'), cfg);

  renderTournamentLifecyclePanel({ edition: editionData, config: cfg, cycles });
}

function tournamentLifecycleOut(busyMsg) {
  setPanelOut(tournamentLifecyclePanelEl(), 'tournament-lifecycle-res', busyMsg);
}

function tournamentLifecycleLog(title, method, url, res) {
  logActivity({ title, method, url: res.url || url, ok: res.ok, status: res.status, data: res.data });
  setPanelOut(tournamentLifecyclePanelEl(), 'tournament-lifecycle-res', res.data === '' ? { status: res.status } : res.data);
}

async function tournamentStartTournament() {
  const ok = await showConfirmDanger({
    title: 'Start tournament',
    message:
      'This does TWO things:\n\n' +
      '• Starts the first edition now (opens the first cycle for every active category).\n' +
      '• Enables automatic weekly rotation (clears the global pause flag).\n\n' +
      'Editions will then roll over on their own at each anchor boundary until you pause. Continue?',
    confirm: 'Start & enable rotation',
    cancel: 'Cancel',
  });
  if (!ok) return;

  tournamentLifecycleOut('Starting tournament…');
  const url = `${API_TOURNAMENTS_MODS}/bootstrap`;
  const res = await http('POST', url, { body: {} });
  tournamentLifecycleLog('Tournament Start (POST /bootstrap)', 'POST', url, res);

  if (res.ok) toast('Tournament started — auto-rotation enabled', 'ok');
  else if (res.status === 409) toast('A tournament edition already exists', 'warn');
  else if (res.status === 422) toast(tournamentBootstrapError(res.data) || 'A category has no eligible map', 'err');
  else toast('Failed to start tournament', 'err');

  await loadTournamentLifecycleState();
}

async function tournamentSetPaused(paused) {
  tournamentLifecycleOut(paused ? 'Pausing auto-rotation…' : 'Resuming auto-rotation…');
  const url = `${API_TOURNAMENTS_MODS}/pause`;
  const res = await http('PATCH', url, { body: { paused } });
  tournamentLifecycleLog(`Tournament ${paused ? 'Pause' : 'Resume'} (PATCH /pause)`, 'PATCH', url, res);

  if (res.ok) toast(paused ? 'Auto-rotation paused' : 'Auto-rotation resumed', 'ok');
  else toast('Failed to update rotation', 'err');

  await loadTournamentLifecycleState();
}

async function tournamentPublishResults() {
  const ok = await showConfirmDanger({
    title: 'Publish results now',
    message:
      'This force-publishes standings from currently-verified runs and IGNORES any in-flight verifications.\n\n' +
      'Runs still awaiting verification will NOT be counted. This cannot be undone. Continue?',
    confirm: 'Publish now',
    cancel: 'Cancel',
  });
  if (!ok) return;

  tournamentLifecycleOut('Publishing results…');
  const url = `${API_TOURNAMENTS_MODS}/publish-results`;
  const res = await http('PATCH', url, { body: {} });
  tournamentLifecycleLog('Tournament Publish Results (PATCH)', 'PATCH', url, res);

  if (res.ok) toast('Results published', 'ok');
  else if (res.status === 409) toast('No edition is awaiting results', 'warn');
  else toast('Failed to publish results', 'err');

  await loadTournamentLifecycleState();
}

async function tournamentSetDebugCycle(panel, { clear = false } = {}) {
  const input = panel.querySelector('[data-tournament-debug-seconds]');
  let seconds = null;
  if (!clear) {
    const raw = String(input?.value || '').trim();
    if (!raw) return toast('Enter a number of seconds (or use Clear override)', 'warn');
    seconds = Number(raw);
    if (!Number.isInteger(seconds) || seconds < 1) return toast('Invalid seconds', 'warn');
  }

  tournamentLifecycleOut(clear ? 'Clearing debug override…' : 'Setting debug cycle length…');
  const url = `${API_TOURNAMENTS_MODS}/debug-cycle-length`;
  const res = await http('PATCH', url, { body: { seconds } });
  tournamentLifecycleLog('Tournament Debug Cycle Length (PATCH)', 'PATCH', url, res);

  if (res.ok) toast(clear ? 'Debug override cleared' : 'Debug cycle length set', 'ok');
  else if (res.status === 403) toast('Debug cycle length is disabled in production', 'warn');
  else toast('Failed to update debug cycle length', 'err');

  await loadTournamentLifecycleState();
}

function bindTournamentLifecyclePanel() {
  const panel = tournamentLifecyclePanelEl();
  if (!panel) return;

  // Refresh button lives outside the re-rendered panel, so bind it on the subpanel.
  const subpanel = document.querySelector('[data-subpanel="tournament-lifecycle"]');
  if (subpanel && subpanel.dataset.lcBound !== '1') {
    subpanel.dataset.lcBound = '1';
    subpanel.addEventListener('click', (event) => {
      const btn = event.target?.closest?.('[data-tournament-lc-action]');
      if (!btn) return;
      event.preventDefault();
      const action = btn.dataset.tournamentLcAction;
      if (action === 'open-cycles') return void openTournamentWorkflowFromOverview({ subtab: 'tournament-cycles' });

      const callbacks = {
        refresh: () => loadTournamentLifecycleState(),
        start: () => tournamentStartTournament(),
        publish: () => tournamentPublishResults(),
        pause: () => tournamentSetPaused(true),
        resume: () => tournamentSetPaused(false),
        'debug-set': () => tournamentSetDebugCycle(tournamentLifecyclePanelEl()),
        'debug-clear': () => tournamentSetDebugCycle(tournamentLifecyclePanelEl(), { clear: true }),
      };
      const callback = callbacks[action];
      if (!callback) return;

      return void runModeratorEndpointAction({
        action: `tournament-lifecycle-${action}`,
        article: btn.closest('article'),
      }, callback);
    });
  }
}

function initTournamentLifecyclePanel() {
  const subpanel = document.querySelector('[data-subpanel="tournament-lifecycle"]');
  if (!subpanel) return;

  enhanceTournamentNativeSelects(subpanel);
  populateTournamentTimezoneDatalist();
  bindTournamentLifecyclePanel();
  loadTournamentLifecycleState();
}

function renderSkillUserSummary(form, payload) {
  const data = normalizeConfigPayload(payload);
  const root = form?.closest?.('[data-subpanel="skill-user"]')?.querySelector('[data-skill-user-result]');
  if (!root) return;

  const tierName = skillTierName(data);
  const score = Number(data.skill_score ?? 0);
  const percentile = Number(data.percentile ?? data.skill_percentile);
  const percentileText = Number.isFinite(percentile)
    ? `${(percentile * 100).toFixed(1)}th percentile`
    : 'Percentile unavailable';

  root.innerHTML = `
    <div class="grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
      <div class="flex items-center gap-4">
        <img src="${skillTierIconUrl(tierName)}" alt="" class="h-20 w-20 shrink-0 object-contain" loading="lazy" decoding="async">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[.16em] text-zinc-500 dark:text-zinc-400">${escapeHtml(tierName)}</div>
          <div class="mt-1 text-3xl font-black text-zinc-950 dark:text-white">${Number.isFinite(score) ? score.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'}</div>
          <div class="text-xs text-zinc-500 dark:text-zinc-400">${escapeHtml(percentileText)}</div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
        ${[
          ['Maps cleared', data.maps_cleared ?? 0],
          ['Video clears', data.video_clears ?? 0],
          ['Hardest map', data.hardest_map ?? '—'],
          ['Tier number', data.skill_tier ?? data.tier ?? 0],
        ].map(([label, value]) => `
          <div class="rounded-xl border border-zinc-200/80 bg-white/55 px-3 py-2 dark:border-white/10 dark:bg-white/5">
            <div class="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">${escapeHtml(label)}</div>
            <div class="mt-1 truncate font-black text-zinc-900 dark:text-zinc-100">${escapeHtml(value)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderSkillUserBreakdown(form, payload) {
  const root = form?.closest?.('[data-subpanel="skill-user"]')?.querySelector('[data-skill-user-result]');
  if (!root) return;

  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  if (!items.length) {
    root.innerHTML = '<div class="py-4 text-center text-zinc-500 dark:text-zinc-400">No eligible runs in the Skill Score breakdown.</div>';
    return;
  }

  root.innerHTML = `
    <div class="mb-3 flex items-center justify-between gap-3">
      <div class="font-semibold text-zinc-900 dark:text-zinc-100">Per-map contribution</div>
      <span class="rounded-full border border-zinc-200/80 px-2.5 py-1 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400">${items.length} maps</span>
    </div>
    <div class="skill-breakdown-list">
      ${items.map((item) => `
        <div class="skill-breakdown-item">
          <div class="min-w-0">
            <div class="flex min-w-0 items-start gap-2">
              <span class="shrink-0 rounded-lg bg-emerald-500/10 px-2 py-1 text-xs font-black text-emerald-700 dark:text-emerald-300">#${escapeHtml(item?.rank ?? '—')}</span>
              <div class="min-w-0">
              <div class="truncate font-black text-zinc-900 dark:text-zinc-100">${escapeHtml(item?.map_name || 'Unknown map')}</div>
              <div class="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">${escapeHtml(item?.difficulty || 'Unknown difficulty')}</div>
              </div>
            </div>
          </div>
          <div class="skill-breakdown-metrics">
            <div><span>Raw score</span><strong>${escapeHtml(item?.raw_score ?? item?.raw ?? 0)}</strong></div>
            <div><span>Contribution</span><strong>${escapeHtml(item?.contribution ?? 0)}</strong></div>
          </div>
          <div class="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase">
            ${item?.fully_verified ? '<span class="rounded-md bg-sky-500/10 px-2 py-1 text-sky-700 dark:text-sky-300">Verified</span>' : ''}
            ${item?.medal ? `<span class="rounded-md bg-amber-500/10 px-2 py-1 text-amber-700 dark:text-amber-300">${escapeHtml(item.medal)}</span>` : ''}
            ${item?.wr ? '<span class="rounded-md bg-fuchsia-500/10 px-2 py-1 text-fuchsia-700 dark:text-fuchsia-300">World record</span>' : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

async function handleSkillUserSummary(form) {
  const userId = String(new FormData(form).get('user_id') || '').trim();
  if (!/^\d{1,20}$/.test(userId)) {
    toast('Enter a valid user_id', 'warn');
    return;
  }

  const res = await http('GET', `/api/skill/users/${encodeURIComponent(userId)}`);
  logActivity({
    title: 'Skill user summary',
    method: 'GET',
    url: res.url,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  if (!res.ok) {
    setPanelOut(form, 'skill-user-res', res.data ?? 'Request failed');
    toast('Failed to load Skill Score', 'err');
    return;
  }

  renderSkillUserSummary(form, res.data);
  toast('Skill Score loaded', 'ok');
}

async function handleSkillUserBreakdown(form) {
  const userId = String(new FormData(form).get('user_id') || '').trim();
  if (!/^\d{1,20}$/.test(userId)) {
    toast('Enter a valid user_id', 'warn');
    return;
  }

  const res = await http('GET', `/api/skill/users/${encodeURIComponent(userId)}/breakdown`);
  logActivity({
    title: 'Skill user breakdown',
    method: 'GET',
    url: res.url,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  if (!res.ok) {
    toast('Failed to load Skill breakdown', 'err');
    return;
  }

  renderSkillUserBreakdown(form, res.data);
  toast('Skill breakdown loaded', 'ok');
}

async function handleSkillConfigGet(form) {
  if (!form) return;
  setPanelOut(form, 'skill-config-res', 'Loading...');

  const res = await http('GET', `${API_MODS}/skill/config`);
  logActivity({
    title: 'Skill weights',
    method: 'GET',
    url: res.url,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  setPanelOut(form, 'skill-config-res', res.data ?? 'Request failed');
  if (!res.ok) {
    toast('Failed to load skill weights', 'err');
    return;
  }

  fillSkillConfigForm(findRelatedActionForm(form, 'skill-config-update'), res.data);
  toast('Skill weights loaded', 'ok');
}

async function handleSkillConfigUpdate(form) {
  const formData = new FormData(form);
  const payload = {};
  SKILL_WEIGHT_FIELDS.forEach((field) => {
    const raw = String(formData.get(field) ?? '').trim();
    if (raw !== '') payload[field] = Number(raw);
  });

  if (!Object.keys(payload).length || Object.values(payload).some((value) => !Number.isFinite(value))) {
    toast('Enter valid skill weights', 'warn');
    return;
  }

  const res = await http('PATCH', `${API_MODS}/skill/config`, { body: payload });
  logActivity({
    title: 'Update skill weights',
    method: 'PATCH',
    url: res.url,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  setPanelOut(form, 'skill-config-res', res.data ?? 'Update failed');
  if (!res.ok) {
    toast(res.data?.message || 'Failed to update skill weights', 'err');
    return;
  }

  fillSkillConfigForm(form, res.data);
  toast('Skill weights updated', 'ok');
}

async function handleSkillTiersGet(form) {
  if (!form) return;
  const res = await http('GET', '/api/skill/tiers');
  logActivity({
    title: 'Skill tier config',
    method: 'GET',
    url: res.url,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  setPanelOut(form, 'skill-tiers-res', res.data ?? 'Request failed');
  if (!res.ok) {
    toast('Failed to load skill tiers', 'err');
    return;
  }

  const updateForm = findRelatedActionForm(form, 'skill-tiers-update');
  bindSkillPercentileSliders(updateForm);
  fillSkillTierConfig(updateForm, res.data);
  loadSkillTierSamples(updateForm);
  toast('Skill tier config loaded', 'ok');
}

async function handleSkillTiersUpdate(form) {
  const inputs = skillPercentileInputs(form);
  const percentiles = inputs.map((input) => Number((Number(input.value) / 100).toFixed(4)));

  if (
    percentiles.length !== 7 ||
    percentiles.some((value) => !Number.isFinite(value) || value <= 0 || value >= 1) ||
    percentiles.some((value, index) => index > 0 && value <= percentiles[index - 1])
  ) {
    toast('Percentiles must be strictly increasing', 'warn');
    return;
  }

  const res = await http('PATCH', `${API_MODS}/skill/tiers`, {
    body: { percentiles },
  });
  logActivity({
    title: 'Update skill tier percentiles',
    method: 'PATCH',
    url: res.url,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  setPanelOut(form, 'skill-tiers-res', res.data ?? 'Update failed');
  if (!res.ok) {
    toast(res.data?.message || 'Failed to update skill tiers', 'err');
    return;
  }

  fillSkillTierConfig(form, res.data);
  loadSkillTierSamples(form);
  toast('Skill tier percentiles updated', 'ok');
}

async function handleStoreGetConfig(form) {
  setPanelOut(form, "store-config", "Loading…");

  const res = await http("GET", `${API_MODS}/store/config`);

  logActivity({
    title: "Store Config (GET)",
    method: "GET",
    url: res.url || `${API_MODS}/store/config`,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  if (!res.ok) {
    setPanelOut(form, "store-config", res.data ?? "Request failed");
    toast("Failed to load store config", "err");
    return;
  }

  setPanelOut(form, "store-config", res.data);
  fillStoreConfigForm(findRelatedActionForm(form, 'store-update-config'), res.data);
  toast("Store config loaded", "ok");
}

async function handleStoreUpdateConfig(form) {
  const fd = new FormData(form);
  const rotation_period_days = fd.get("rotation_period_days");
  const active_key_type = String(fd.get("active_key_type") || "").trim();

  const payload = {};
  if (rotation_period_days !== "" && rotation_period_days != null) payload.rotation_period_days = Number(rotation_period_days);
  if (active_key_type) payload.active_key_type = active_key_type;

  if (!Object.keys(payload).length) {
    toast("Nothing to update", "warn");
    return;
  }

  setPanelOut(form, "store-update-res", "Saving…");

  const res = await http("PUT", `${API_MODS}/store/config`, { body: payload });

  logActivity({
    title: "Store Config (PUT)",
    method: "PUT",
    url: res.url || `${API_MODS}/store/config`,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  if (!res.ok) {
    setPanelOut(form, "store-update-res", res.data ?? "Update failed");
    toast("Update failed", "err");
    return;
  }

  setPanelOut(form, "store-update-res", res.data);
  toast("Store config updated", "ok");

  // Optionnel : refresh auto
  handleStoreGetConfig(form);
}

async function handleStoreGenerateRotation(form) {
  const fd = new FormData(form);
  const item_count = Number(fd.get("item_count") || 0);

  if (!Number.isFinite(item_count) || item_count < 1) {
    toast("Invalid item_count", "warn");
    return;
  }

  setPanelOut(form, "store-rotation-res", "Generating…");

  const res = await http("POST", `${API_MODS}/store/rotation/generate`, { body: { item_count } });

  logActivity({
    title: "Generate Store Rotation (POST)",
    method: "POST",
    url: res.url || `${API_MODS}/store/rotation/generate`,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  if (!res.ok) {
    setPanelOut(form, "store-rotation-res", res.data ?? "Rotation failed");
    toast("Rotation failed", "err");
    return;
  }

  setPanelOut(form, "store-rotation-res", res.data);
  toast("Rotation generated", "ok");
}


//———————————————————————————————————————————————————————————————
// QUESTS
//———————————————————————————————————————————————————————————————
async function handleQuestGetWeekly(form) {
  const user_id = window.user_id;

  if (!user_id) {
    toast("window.user_id is missing", "err");
    return;
  }

  setPanelOut(form, "quest-weekly-out", "Loading…");

  const url = `/api/quests?user_id=${encodeURIComponent(user_id)}`;
  const res = await http("GET", url);

  logActivity({
    title: "Weekly Quests (GET)",
    method: "GET",
    url: res.url || url,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  if (!res.ok) {
    setPanelOut(form, "quest-weekly-out", res.data ?? "Request failed");
    toast("Failed to load weekly quests", "err");
    return;
  }

  __modQuestWeeklyCache = normalizeWeeklyQuestItems(res.data);
  const subpanel =
    form.closest?.('[data-subpanel="quest-update"]') ||
    form.closest?.('[data-subpanel]') ||
    document;
  syncQuestWeeklyPicker(subpanel);
  applyQuestPickerSelection(subpanel);
  setPanelOut(form, "quest-weekly-out", res.data);
  toast("Weekly quests loaded", "ok");
}

async function handleQuestGetConfig(form) {
  setPanelOut(form, "quest-config", "Loading…");

  const res = await http("GET", `${API_MODS}/quests/config`);

  logActivity({
    title: "Quest Config (GET)",
    method: "GET",
    url: res.url || `${API_MODS}/quests/config`,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  if (!res.ok) {
    setPanelOut(form, "quest-config", res.data ?? "Request failed");
    toast("Failed to load quest config", "err");
    return;
  }

  setPanelOut(form, "quest-config", res.data);
  fillQuestConfigForm(findRelatedActionForm(form, 'quest-update-config'), res.data);
  toast("Quest config loaded", "ok");
}

async function handleQuestUpdateConfig(form) {
  const fd = new FormData(form);

  const payload = {};
  ["rotation_day","rotation_hour","easy_quest_count","medium_quest_count","hard_quest_count"].forEach((k) => {
    const v = fd.get(k);
    if (v !== "" && v != null) payload[k] = Number(v);
  });

  if (!Object.keys(payload).length) {
    toast("Nothing to update", "warn");
    return;
  }

  setPanelOut(form, "quest-config-update-res", "Saving…");

  const res = await http("PUT", `${API_MODS}/quests/config`, { body: payload });

  logActivity({
    title: "Quest Config (PUT)",
    method: "PUT",
    url: res.url || `${API_MODS}/quests/config`,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  if (!res.ok) {
    setPanelOut(form, "quest-config-update-res", res.data ?? "Update failed");
    toast("Update failed", "err");
    return;
  }

  setPanelOut(form, "quest-config-update-res", res.data);
  toast("Quest config updated", "ok");

  handleQuestGetConfig(form);
}

async function handleQuestUpdateQuest(form) {
  const fd = new FormData(form);
  const quest_id = Number(fd.get("quest_id") || 0);

  if (!Number.isFinite(quest_id) || quest_id < 1) {
    toast("Invalid quest_id", "warn");
    return;
  }

  const payload = {};

  const name = String(fd.get("name") || "").trim();
  const description = String(fd.get("description") || "").trim();
  const difficulty = String(fd.get("difficulty") || "").trim();
  const coin_reward = fd.get("coin_reward");
  const xp_reward = fd.get("xp_reward");
  const is_active = fd.get("is_active");
  const reqRaw = String(fd.get("requirements_json") || "").trim();

  if (name) payload.name = name;
  if (description) payload.description = description;
  if (difficulty) payload.difficulty = difficulty;
  if (coin_reward !== "" && coin_reward != null) payload.coin_reward = Number(coin_reward);
  if (xp_reward !== "" && xp_reward != null) payload.xp_reward = Number(xp_reward);

  if (is_active === "1") payload.is_active = true;
  if (is_active === "0") payload.is_active = false;

  if (reqRaw) {
    const parsed = readJsonField(reqRaw);
    if (!parsed) {
      toast("Invalid requirements JSON", "err");
      return;
    }
    payload.requirements = parsed;
  }

  if (!Object.keys(payload).length) {
    toast("Nothing to update", "warn");
    return;
  }

  setPanelOut(form, "quest-update-res", "Saving…");

  const res = await http("PATCH", `${API_MODS}/quests/${quest_id}`, { body: payload });

  logActivity({
    title: `Update Quest #${quest_id} (PATCH)`,
    method: "PATCH",
    url: res.url || `${API_MODS}/quests/${quest_id}`,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  if (!res.ok) {
    setPanelOut(form, "quest-update-res", res.data ?? "Update failed");
    toast("Update failed", "err");
    return;
  }

  setPanelOut(form, "quest-update-res", res.data);
  toast("Quest updated", "ok");

  const loadForm = findRelatedActionForm(form, 'quest-get-weekly');
  if (loadForm) {
    handleQuestGetWeekly(loadForm);
  }
}

async function handleQuestGenerateRotation(form) {
  setPanelOut(form, "quest-rotation-res", "Generating…");

  const res = await http("POST", `${API_MODS}/quests/rotation/generate`, { body: {} });

  logActivity({
    title: "Generate Quest Rotation (POST)",
    method: "POST",
    url: res.url || `${API_MODS}/quests/rotation/generate`,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  if (!res.ok) {
    setPanelOut(form, "quest-rotation-res", res.data ?? "Rotation failed");
    toast("Rotation failed", "err");
    return;
  }

  setPanelOut(form, "quest-rotation-res", res.data);
  toast("Quest rotation generated", "ok");
}

async function handleQuestUpdateUserProgress(form) {
  const fd = new FormData(form);

  const userInput = form.querySelector('input[name="user_id"]');
  const user_id = String(getUserIdFrom(userInput) || 0);
  const progress_id = Number(fd.get("progress_id") || 0);

  if (!user_id || !/^\d+$/.test(user_id) || user_id === "0") {
    toast("Invalid user_id", "warn");
    return;
  }
  if (!Number.isFinite(progress_id) || progress_id < 1) {
    toast("Invalid progress_id", "warn");
    return;
  }

  const payload = {};

  const completed = fd.get("completed");
  if (completed === "1") payload.completed = true;
  if (completed === "0") payload.completed = false;

  const claimed = fd.get("claimed");
  if (claimed === "1") payload.claimed = true;
  if (claimed === "0") payload.claimed = false;

  // --- helpers
  const readStr = (name) => {
    const v = String(fd.get(name) ?? "").trim();
    return v === "" ? null : v;
  };

  const readNum = (name, { allowFloat = false } = {}) => {
    const raw = String(fd.get(name) ?? "").trim();
    if (raw === "") return null;
    const n = allowFloat ? Number(raw) : Number.parseInt(raw, 10);
    if (!Number.isFinite(n)) return NaN;
    return n;
  };

  const parseCsvInts = (raw) => {
    const s = String(raw ?? "").trim();
    if (!s) return null;
    const arr = s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => Number.parseInt(x, 10))
      .filter((n) => Number.isFinite(n));
    return arr.length ? arr : [];
  };

  const readJsonOptional = (name) => {
    const raw = String(fd.get(name) ?? "").trim();
    if (!raw) return null;
    const parsed = readJsonField(raw);
    if (!parsed) return NaN;
    return parsed;
  };

  // quest_data
  const quest_data = {};

  const qd_name = readStr("qd_name");
  if (qd_name != null) quest_data.name = qd_name;

  const qd_description = readStr("qd_description");
  if (qd_description != null) quest_data.description = qd_description;

  const qd_difficulty = readStr("qd_difficulty");
  if (qd_difficulty != null) quest_data.difficulty = qd_difficulty;

  const qd_coin_reward = readNum("qd_coin_reward");
  if (Number.isNaN(qd_coin_reward)) return toast("Invalid quest_data.coin_reward", "warn");
  if (qd_coin_reward != null) quest_data.coin_reward = qd_coin_reward;

  const qd_xp_reward = readNum("qd_xp_reward");
  if (Number.isNaN(qd_xp_reward)) return toast("Invalid quest_data.xp_reward", "warn");
  if (qd_xp_reward != null) quest_data.xp_reward = qd_xp_reward;

  const qd_bounty = readStr("qd_bounty_type");
  if (qd_bounty != null) quest_data.bounty_type = qd_bounty;

  // requirements
  const requirements = {};

  const req_type = readStr("req_type");
  if (req_type != null) requirements.type = req_type;

  const req_count = readNum("req_count");
  if (Number.isNaN(req_count)) return toast("Invalid requirements.count", "warn");
  if (req_count != null) requirements.count = req_count;

  const req_difficulty = readStr("req_difficulty");
  if (req_difficulty != null) requirements.difficulty = req_difficulty;

  const req_category = readStr("req_category");
  if (req_category != null) requirements.category = req_category;

  const req_medal_type = readStr("req_medal_type");
  if (req_medal_type != null) requirements.medal_type = req_medal_type;

  const req_map_id = readNum("req_map_id");
  if (Number.isNaN(req_map_id)) return toast("Invalid requirements.map_id", "warn");
  if (req_map_id != null) requirements.map_id = req_map_id;

  const req_target_time = readNum("req_target_time", { allowFloat: true });
  if (Number.isNaN(req_target_time)) return toast("Invalid requirements.target_time", "warn");
  if (req_target_time != null) requirements.target_time = req_target_time;

  const req_target_type = readStr("req_target_type");
  if (req_target_type != null) requirements.target_type = req_target_type;

  const reqRivalInput = form.querySelector('input[name="req_rival_user_id"]');
  const req_rival_user_id = String(getUserIdFrom(reqRivalInput) || "").trim();

  if (req_rival_user_id) {
    if (!/^\d+$/.test(req_rival_user_id) || req_rival_user_id === "0") {
      return toast("Invalid requirements.rival_user_id", "warn");
    }
    requirements.rival_user_id = req_rival_user_id;
  }

  const req_rival_time = readNum("req_rival_time", { allowFloat: true });
  if (Number.isNaN(req_rival_time)) return toast("Invalid requirements.rival_time", "warn");
  if (req_rival_time != null) requirements.rival_time = req_rival_time;

  const req_target = readStr("req_target");
  if (req_target != null) requirements.target = req_target;

  const req_min_count = readNum("req_min_count");
  if (Number.isNaN(req_min_count)) return toast("Invalid requirements.min_count", "warn");
  if (req_min_count != null) requirements.min_count = req_min_count;

  if (Object.keys(requirements).length) quest_data.requirements = requirements;

  if (Object.keys(quest_data).length) payload.quest_data = quest_data;

  // progress
  const progress = {};

  const pr_current = readNum("pr_current");
  if (Number.isNaN(pr_current)) return toast("Invalid progress.current", "warn");
  if (pr_current != null) progress.current = pr_current;

  const pr_target = readNum("pr_target");
  if (Number.isNaN(pr_target)) return toast("Invalid progress.target", "warn");
  if (pr_target != null) progress.target = pr_target;

  const pr_percentage = readNum("pr_percentage", { allowFloat: true });
  if (Number.isNaN(pr_percentage)) return toast("Invalid progress.percentage", "warn");
  if (pr_percentage != null) progress.percentage = pr_percentage;

  const pr_details = readJsonOptional("pr_details_json");
  if (Number.isNaN(pr_details)) return toast("Invalid progress.details JSON", "err");
  if (pr_details !=null) progress.details = pr_details;

  const pr_completed_map_ids = parseCsvInts(fd.get("pr_completed_map_ids"));
  if (pr_completed_map_ids != null) progress.completed_map_ids = pr_completed_map_ids;

  const pr_counted_map_ids = parseCsvInts(fd.get("pr_counted_map_ids"));
  if (pr_counted_map_ids != null) progress.counted_map_ids = pr_counted_map_ids;

  const pr_map_id = readNum("pr_map_id");
  if (Number.isNaN(pr_map_id)) return toast("Invalid progress.map_id", "warn");
  if (pr_map_id != null) progress.map_id = pr_map_id;

  const pr_target_time = readNum("pr_target_time", { allowFloat: true });
  if (Number.isNaN(pr_target_time)) return toast("Invalid progress.target_time", "warn");
  if (pr_target_time != null) progress.target_time = pr_target_time;

  const pr_target_type = readStr("pr_target_type");
  if (pr_target_type != null) progress.target_type = pr_target_type;

  const pr_medal_type = readStr("pr_medal_type");
  if (pr_medal_type != null) progress.medal_type = pr_medal_type;

  const pr_best_attempt = readNum("pr_best_attempt", { allowFloat: true });
  if (Number.isNaN(pr_best_attempt)) return toast("Invalid progress.best_attempt", "warn");
  if (pr_best_attempt != null) progress.best_attempt = pr_best_attempt;

  const pr_last_attempt = readNum("pr_last_attempt", { allowFloat: true });
  if (Number.isNaN(pr_last_attempt)) return toast("Invalid progress.last_attempt", "warn");
  if (pr_last_attempt != null) progress.last_attempt = pr_last_attempt;

  const prRivalInput = form.querySelector('input[name="pr_rival_user_id"]');
  const pr_rival_user_id = String(getUserIdFrom(prRivalInput) || "").trim();

  if (pr_rival_user_id) {
    if (!/^\d+$/.test(pr_rival_user_id) || pr_rival_user_id === "0") {
      return toast("Invalid progress.rival_user_id", "warn");
    }
    progress.rival_user_id = pr_rival_user_id;
  }

  const pr_rival_time = readNum("pr_rival_time", { allowFloat: true });
  if (Number.isNaN(pr_rival_time)) return toast("Invalid progress.rival_time", "warn");
  if (pr_rival_time != null) progress.rival_time = pr_rival_time;

  const pr_completed = fd.get("pr_completed");
  if (pr_completed === "1") progress.completed = true;
  if (pr_completed === "0") progress.completed = false;

  const pr_medal_earned = readStr("pr_medal_earned");
  if (pr_medal_earned != null) progress.medal_earned = pr_medal_earned;

  if (Object.keys(progress).length) payload.progress = progress;

  if (!Object.keys(payload).length) {
    toast("Nothing to update", "warn");
    return;
  }

  setPanelOut(form, "quest-user-progress-res", "Saving…");

  const url = `${API_MODS}/quests/admin/users/${user_id}/progress/${progress_id}`;
  const res = await http("PATCH", url, { body: payload });

  logActivity({
    title: `Update User Quest Progress (PATCH)`,
    method: "PATCH",
    url: res.url || url,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  if (!res.ok) {
    setPanelOut(form, "quest-user-progress-res", res.data ?? "Update failed");
    toast("Update failed", "err");
    return;
  }

  setPanelOut(form, "quest-user-progress-res", res.data);
  toast("User quest progress updated", "ok");
}

let __modQuestUserProgressCache = {};

async function handleQuestGetUserProgress(form) {
  const userInput = form.querySelector('input[name="user_id"]');
  const user_id = String(getUserIdFrom(userInput) || "").trim();

  if (!user_id) {
    toast("Invalid user_id", "warn");
    return;
  }

  setPanelOut(form, "quest-user-progress-res", "Loading…");

  const url = `/api/quests`;
  const res = await http("GET", url, { query: { user_id } });

  logActivity({
    title: `Get User Quests (GET)`,
    method: "GET",
    url: res.url || `${url}?user_id=${encodeURIComponent(user_id)}`,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  if (!res.ok) {
    setPanelOut(form, "quest-user-progress-res", res.data ?? "Load failed");
    toast("Load failed", "err");
    return;
  }

  __modQuestUserProgressCache[user_id] = res.data;

  const subpanel =
    form.closest?.('[data-subpanel="quest-user-progress"]') ||
    form.closest?.('[data-subpanel]') ||
    document;
  const patchForm = subpanel?.querySelector?.('form[data-action="quest-update-user-progress"]');
  const patchUserInput = patchForm?.querySelector?.('input[name="user_id"]');
  const patchProgressInput = patchForm?.querySelector?.('input[name="progress_id"]');

  if (patchUserInput) {
    patchUserInput.value = user_id;
    patchUserInput.dataset.uid = user_id;
  }
  if (patchProgressInput) patchProgressInput.value = "";

  const items = normalizeQuestProgressItems(res.data);
  const options = (items || []).map((it) => ({ value: String(it.progress_id), text: it.label }));

  const root = document.getElementById("modQuestUserProgressPick");
  const btn = root?.querySelector?.('[data-dd-btn]');
  const list = root?.querySelector?.('[data-dd-list]');
  const hidden = root?.querySelector?.('input[type="hidden"][name="pick_progress_id"]');

  if (hidden) hidden.value = "";
  if (btn) btn.querySelector?.('.dd-label') && (btn.querySelector('.dd-label').textContent = "Select a progress…");

  if (!options.length) {
    if (list) {
      list.innerHTML = `
        <div class="px-2 py-2 text-xs text-zinc-500 dark:text-zinc-400">
          No progress found for this user.
        </div>`;
    }
    wireQuestProgressPicker(document.getElementById("modQuestUserProgressPick"));
  } else {
    try {
      buildRadioDropdown("modQuestUserProgressPick", options, "Select a progress…");
      wireQuestProgressPicker(document.getElementById("modQuestUserProgressPick"));
    } catch (e) {
      console.error("[mods][quests] build progress picker failed:", e);
    }
  }

  if (root && !root.dataset.bindPickHidden) {
    root.dataset.bindPickHidden = "1";
    root.addEventListener("change", (e) => {
      const r = e.target?.closest?.('input[type="radio"]');
      if (!r) return;
      const h = root.querySelector('input[type="hidden"][name="pick_progress_id"]');
      if (h) h.value = r.value;
      if (patchProgressInput) patchProgressInput.value = String(r.value || "");
      const liveUserId = String(getUserIdFrom(form.querySelector('input[name="user_id"]')) || "").trim();
      if (patchUserInput && liveUserId) {
        patchUserInput.value = liveUserId;
        patchUserInput.dataset.uid = liveUserId;
      }
    });
  }
  setPanelOut(form, "quest-user-progress-res", res.data);
  toast("Loaded", "ok");
}

function normalizeQuestProgressItems(data) {
  const pickArray = (obj) => {
    if (!obj) return [];
    if (Array.isArray(obj)) return obj;

    const candidates = [
      obj.data,
      obj.items,
      obj.results,
      obj.quests,
      obj.progress,
      obj.user_quests,
      obj.userQuests,
      obj.rows,
    ];
    for (const c of candidates) if (Array.isArray(c)) return c;

    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (Array.isArray(v)) return v;
    }
    return [];
  };

  const arr = pickArray(data);

  return (arr || [])
    .map((raw) => {
      const progress_id =
        raw?.progress_id ??
        raw?.progressId ??
        raw?.id ??
        raw?.progress?.id ??
        raw?.progress?.progress_id ??
        null;

      if (!progress_id) return null;

      const qn =
        raw?.quest_data?.name ??
        raw?.quest?.name ??
        raw?.quest_name ??
        raw?.name ??
        "";

      const pid = String(progress_id);
      const pct = (raw?.progress?.percentage != null) ? `${raw.progress.percentage}%` : "";
      const diff = raw?.difficulty ?? raw?.quest_data?.difficulty ?? "";
      const bits = [diff, pct].filter(Boolean).join(" · ");
      const label = qn ? `#${pid} · ${qn}${bits ? ` (${bits})` : ""}` : `Progress #${pid}`;
      return { progress_id: Number(progress_id), label, raw };
    })
    .filter(Boolean);
}

function fillQuestUserProgressFromPicked(subpanel) {
  const getForm = subpanel.querySelector('form[data-action="quest-get-user-progress"]');
  const patchForm = subpanel.querySelector('form[data-action="quest-update-user-progress"]');
  if (!getForm || !patchForm) return;

  const getUserInput = getForm.querySelector('input[name="user_id"]');
  const user_id = String(getUserIdFrom(getUserInput) || "").trim();
  const picker = subpanel.querySelector('#modQuestUserProgressPick');
  const pickId = picker?.querySelector('input[type="hidden"][name="pick_progress_id"]')?.value;

  if (!user_id || !pickId) {
    toast("Pick a progress entry first", "warn");
    return;
  }

  const items = normalizeQuestProgressItems(__modQuestUserProgressCache[user_id]);
  const match = items.find((x) => String(x.progress_id) === String(pickId));
  if (!match) {
    toast("Progress entry not found in cache", "err");
    return;
  }

  const raw = match.raw || {};

  const patchUserInput = patchForm.querySelector('input[name="user_id"]');
  if (patchUserInput && user_id) {
    patchUserInput.value = user_id;
    patchUserInput.dataset.uid = user_id;
  }

  const pidEl = patchForm.querySelector('input[name="progress_id"]');
  if (pidEl) pidEl.value = String(match.progress_id);

  setRadioValue(patchForm, 'completed', raw?.completed === true ? '1' : raw?.completed === false ? '0' : '');
  setRadioValue(patchForm, 'claimed', raw?.claimed === true ? '1' : raw?.claimed === false ? '0' : '');

  const qd = raw?.quest_data || {
    name: raw?.name,
    description: raw?.description,
    difficulty: raw?.difficulty,
    coin_reward: raw?.coin_reward,
    xp_reward: raw?.xp_reward,
    bounty_type: raw?.bounty_type,
    requirements: raw?.requirements,
  };
  setInputValue(patchForm, 'qd_name', qd?.name);
  setInputValue(patchForm, 'qd_description', qd?.description);
  setInputValue(patchForm, 'qd_difficulty', qd?.difficulty);
  setInputValue(patchForm, 'qd_coin_reward', qd?.coin_reward);
  setInputValue(patchForm, 'qd_xp_reward', qd?.xp_reward);
  setRadioValue(patchForm, 'qd_bounty_type', qd?.bounty_type ?? '');

  const req = qd?.requirements || raw?.requirements || {};
  setInputValue(patchForm, 'req_type', req?.type);
  setInputValue(patchForm, 'req_count', req?.count);
  setInputValue(patchForm, 'req_difficulty', req?.difficulty);
  setInputValue(patchForm, 'req_category', req?.category);
  setInputValue(patchForm, 'req_medal_type', req?.medal_type);
  setInputValue(patchForm, 'req_map_id', req?.map_id);
  setInputValue(patchForm, 'req_target_time', req?.target_time);
  setRadioValue(patchForm, 'req_target_type', req?.target_type ?? '');
  setInputValue(patchForm, 'req_rival_user_id', req?.rival_user_id);
  setInputValue(patchForm, 'req_rival_time', req?.rival_time);
  setInputValue(patchForm, 'req_target', req?.target);
  setInputValue(patchForm, 'req_min_count', req?.min_count);

  // dump extra (unknown keys) into extra_json (excluding known keys)

  // progress
  const pr = raw?.progress || {};
  setInputValue(patchForm, 'pr_current', pr?.current);
  setInputValue(patchForm, 'pr_target', pr?.target);
  setInputValue(patchForm, 'pr_percentage', pr?.percentage);
  setInputValue(patchForm, 'pr_map_id', pr?.map_id);
  setInputValue(patchForm, 'pr_target_time', pr?.target_time);
  setRadioValue(patchForm, 'pr_target_type', pr?.target_type ?? '');
  setInputValue(patchForm, 'pr_medal_type', pr?.medal_type);
  setInputValue(patchForm, 'pr_best_attempt', pr?.best_attempt);
  setInputValue(patchForm, 'pr_last_attempt', pr?.last_attempt);
  setInputValue(patchForm, 'pr_rival_user_id', pr?.rival_user_id);
  setInputValue(patchForm, 'pr_rival_time', pr?.rival_time);
  setInputValue(patchForm, 'pr_medal_earned', pr?.medal_earned);

  setInputValue(patchForm, 'pr_completed_map_ids', Array.isArray(pr?.completed_map_ids) ? pr.completed_map_ids.join(',') : '');
  setInputValue(patchForm, 'pr_counted_map_ids', Array.isArray(pr?.counted_map_ids) ? pr.counted_map_ids.join(',') : '');

  const _d = pr?.details;
  setTextAreaJson(patchForm, 'pr_details_json', Array.isArray(_d) ? {} : (_d ?? {}));

  setRadioValue(patchForm, 'pr_completed', pr?.completed === true ? '1' : pr?.completed === false ? '0' : '');

  try {
    subpanel.querySelectorAll('.fake-select, .custom-multiselect').forEach((el) => {
      if (typeof __merSetupFakeSelect === 'function') __merSetupFakeSelect(el);
    });
  } catch {}

  toast("Form filled from selection", "ok");
}

function setInputValue(form, name, value) {
  const el = form.querySelector(`[name="${CSS.escape(name)}"]`);
  if (!el) return;
  el.value = value == null ? "" : String(value);
  if (el.tagName === 'SELECT') {
    movementTechSyncDdField(el);
  }
}

function setRadioValue(form, name, value) {
  const els = [...form.querySelectorAll(`input[type="radio"][name="${CSS.escape(name)}"]`)];
  if (!els.length) return;
  els.forEach((r) => (r.checked = String(r.value) === String(value)));

  const checked = els.find((r) => r.checked);
  const dd = checked?.closest?.('[data-dd-select]');
  const btn = dd?.querySelector?.('[data-dd-btn]');
  const labelEl = dd?.querySelector?.('.dd-label');
  if (dd && btn && labelEl) {
    const text =
      checked?.dataset?.label ||
      checked?.getAttribute?.('data-label') ||
      checked?.value ||
      '';
    labelEl.textContent = text || btn.getAttribute('data-placeholder') || 'Select...';
  }

  const customSelect = checked?.closest?.('.fake-select, .custom-multiselect');
  if (customSelect && typeof __merSetupFakeSelect === 'function') {
    __merSetupFakeSelect(customSelect);
  }
}

function setTextAreaJson(form, name, obj) {
  const el = form.querySelector(`[name="${CSS.escape(name)}"]`);
  if (!el) return;
  try {
    const isEmptyObj = obj && typeof obj === 'object' && !Array.isArray(obj) && !Object.keys(obj).length;
    el.value = isEmptyObj ? "{}" : JSON.stringify(obj ?? {}, null, 2);
  } catch {
    el.value = "";
  }
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action-btn="quest-fill-from-picked"]');
  if (!btn) return;
  const subpanel = btn.closest('[data-subpanel="quest-user-progress"]');
  if (!subpanel) return;
  e.preventDefault();
  fillQuestUserProgressFromPicked(subpanel);
});

//———————————————————————————————————————————————————————————————
// MOD UI
//———————————————————————————————————————————————————————————————
function initializeApp() {
  bindDdDelegation();
  wireDdSelect(document);
  ensureFormUx(document);
  initActivityControls();
  initUsersWorkspace({ http, toast, logActivity, attachUsersAutocomplete, wireAutocomplete });
  initLootboxWorkspace({ http, toast, logActivity, attachUsersAutocomplete, wireAutocomplete });
  initLootboxSettings({ http, toast, logActivity });
  initMapWorkspace({
    http, toast, logActivity,
    wireAutocomplete, attachMapCodeAutocomplete, attachMapNameAutocomplete, attachUsersAutocomplete,
    getUserIdFrom, getSelectedRadio, getCheckedValues,
    validateUpdateMedals, uploadImageGeneric, updateReleaseCodeButtonVisibility,
    initUpdatePanel, populateUpdatePanel,
    initSubmitPanel, handleSubmitMap,
    handleArchiveMaps, handleConvertLegacy, handleReleaseMapCode,
    applyOverrideQuality,
    openMapEditRequestModal,
  });
  initContentWorkspace({
    toast, logActivity, http,
    wireDdSelect, appendOverlay,
    movementTechContentCache,
    movementTechErrorMessage,
    movementTechPopulateContentDropdowns,
    movementTechInitTechniqueEditor,
    loadContentEntityCollection,
    submitMovementTechRequest,
    handleContentCreateNamedEntity,
    handleContentUpdateNamedEntity,
    handleContentDeleteNamedEntity,
    handleContentTechniqueCreate,
    handleContentTechniqueUpdate,
    handleContentTechniqueDelete,
    loadContentTechniqueIntoUpdateForm,
  });
  initRecordsWorkspace({ http, toast, logActivity, wireAutocomplete });
  initVerificationsWorkspace({ http, toast, logActivity, runModeratorEndpointAction, appendOverlay });

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

  try {
    document.querySelectorAll('.fake-select, .custom-multiselect').forEach((el) => {
      if (typeof __merSetupFakeSelect === 'function') __merSetupFakeSelect(el);
    });
  } catch {}

  enhanceModeratorChrome(document);

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
    refreshModeratorActiveHeader(tabId);
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
    
    gateDevSectionsUI();
const sp = new URLSearchParams(window.location.search);
    const tab = sp.get('tab');
    const sub = sp.get('sub');

    state.syncingFromUrl = true;
    try {
      if (tab) activateTab(tab);
      setHeader(getActiveTabId());
      if (sub) activateSub(tab || getActiveTabId(), sub);
    } finally {
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
      const meta = modSectionMeta(tabId);
      if (tabId) entries.push({ kind: 'tab', tabId, label, desc: meta.summary, kicker: meta.kicker });

      const panel = document.querySelector(`.mod-panel[data-panel="${CSS.escape(tabId)}"]`);
      if (!panel) return;

      // Subtabs for tab
      panel.querySelectorAll('.mod-subtab').forEach((sb) => {
        const subId = sb.dataset.subtab;
        const subLabel = sb.textContent.trim();
        if (!subId) return;
        const cardMeta = (meta.cards || []).find((card) => card.sub === subId);
        entries.push({
          kind: 'sub',
          tabId,
          subId,
          label: `${label} / ${subLabel}`,
          desc: cardMeta?.desc || '',
          kicker: meta.kicker,
        });
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
          <div class="min-w-0">
            <div class="truncate font-semibold text-zinc-900 dark:text-zinc-100">${escapeHtml(it.label)}</div>
            ${it.desc ? `<div class="mt-0.5 truncate text-xs text-zinc-600 dark:text-zinc-400">${escapeHtml(it.desc)}</div>` : ''}
          </div>
          <div class="shrink-0 rounded-full border border-zinc-200/80 bg-white/60 px-2 py-0.5 text-[10px] text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">${it.kind === 'tab' ? 'Section' : 'Tool'}</div>
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
