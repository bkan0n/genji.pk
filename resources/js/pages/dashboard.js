import { cdnImage, cdnAsset } from "../utils/cdn";

/* =========================
   CONFIG
   ========================= */
const EP = {
  rankcard: (uid) => `/api/users/${encodeURIComponent(uid)}/rank-card`,
  coins: (uid) => `/api/store/users/${encodeURIComponent(uid)}/coins`,
  keys: (uid) => `/api/lootbox/users/${encodeURIComponent(uid)}/keys`,
  rewards: (uid) => `/api/lootbox/users/${encodeURIComponent(uid)}/rewards`,
  purchases: (uid, limit = 10, offset = 0) =>
    `/api/store/users/${encodeURIComponent(uid)}/purchases?limit=${limit}&offset=${offset}`,
  rotation: (uid) => `/api/store/rotation?user_id=${encodeURIComponent(uid)}`,
  storeKeys: () => `/api/store/keys`,
  buyKeys: () => `/api/store/purchase/keys`,
  buyItem: () => `/api/store/purchase/item`,
  weeklyQuests: (uid) => `/api/quests?user_id=${encodeURIComponent(uid)}`,
  questHistory: (uid) => `/api/quests/users/${encodeURIComponent(uid)}/history`,
  unreadCount: () => `/api/notifications/unread-count`,
  xpSummary: (uid) => `/api/lootbox/users/${encodeURIComponent(uid)}/xp-summary`,
  dashboardCompletions: (uid, pageSize = 10, pageNumber = 1) => `/api/users/${encodeURIComponent(uid)}/completions/dashboard?page_size=${encodeURIComponent(pageSize)}&page_number=${encodeURIComponent(pageNumber)}`,
  claimQuest: (progressId) => `/api/quests/${encodeURIComponent(progressId)}/claim`,
};

/* =========================
   DOM + HELPERS
   ========================= */
const $ = (id) => document.getElementById(id);

const safeJsonParse = (t) => {
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
};

function show(el) {
  el?.classList.remove("hidden");
}
function hide(el) {
  el?.classList.add("hidden");
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function getCsrfToken() {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || null;
}

/* =========================
   CUSTOM DROPDOWNS
   ========================= */
const __ddMap = new WeakMap();
let __ddGlobalsBound = false;

function initCustomDropdowns(root = document) {
  const selects = Array.from(root.querySelectorAll('select[data-custom-dd]:not([multiple])'))
    .filter((s) => !s.dataset.ddUpgraded);

  selects.forEach(upgradeSelectToCustomDropdown);

  if (!__ddGlobalsBound) {
    __ddGlobalsBound = true;

    document.addEventListener(
      "click",
      (e) => {
        const inside = e.target?.closest?.('[data-dd-root="1"]');
        closeAllCustomDropdowns(inside || null);
      },
      true
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllCustomDropdowns(null);
    });
  }
}

function closeAllCustomDropdowns(exceptRoot = null) {
  document.querySelectorAll('[data-dd-root="1"]').forEach((root) => {
    if (exceptRoot && root === exceptRoot) return;
    const dd = __ddMap.get(root);
    dd?.close?.();
  });
}

function upgradeSelectToCustomDropdown(select) {
  if (!select || select.dataset.ddUpgraded) return;
  select.dataset.ddUpgraded = "1";

  const originalClass = select.getAttribute("class") || "";

  const root = document.createElement("div");
  root.className = "relative";
  root.dataset.ddRoot = "1";

  select.parentNode.insertBefore(root, select);
  root.appendChild(select);

  select.className = "sr-only";
  select.tabIndex = -1;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className =
    originalClass +
    " relative flex items-center justify-between gap-2 pr-9 cursor-pointer " +
    "focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-950";
  btn.setAttribute("aria-haspopup", "listbox");
  btn.setAttribute("aria-expanded", "false");

  const label = document.createElement("span");
  label.className = "min-w-0 truncate";
  label.dataset.ddLabel = "1";

  const caret = document.createElement("span");
  caret.className =
    "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500";
  caret.innerHTML = `
    <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M7 10l5 5 5-5z"/>
    </svg>
  `;

  btn.appendChild(label);
  btn.appendChild(caret);

  const list = document.createElement("div");
  list.className =
    "custom-multiselect-list absolute left-0 right-0 mt-1 rounded-lg " +
    "border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 " +
    "p-1 shadow-xl dropdown-list dd-anim hidden z-50";
  list.setAttribute("role", "listbox");
  list.setAttribute("aria-hidden", "true");
  list.style.maxHeight = "260px";
  list.style.overflow = "hidden auto";

  const items = [];

  function rebuild() {
    list.innerHTML = "";
    items.length = 0;

    Array.from(select.options).forEach((opt, idx) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className =
        "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm " +
        "hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer text-left";
      item.dataset.value = opt.value;
      item.setAttribute("role", "option");
      item.disabled = opt.disabled;

      const text = document.createElement("span");
      text.className = "min-w-0 truncate";
      text.textContent = opt.textContent ?? "";

      const check = document.createElement("span");
      check.className = "shrink-0 text-emerald-500 opacity-0";
      check.innerHTML = `
        <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
        </svg>
      `;

      item.appendChild(text);
      item.appendChild(check);

      item.addEventListener("click", () => {
        if (opt.disabled) return;

        select.value = opt.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));

        syncFromSelect();
        close();
      });

      list.appendChild(item);
      items.push({ item, check, idx, opt });
    });

    syncFromSelect();
  }

  function syncFromSelect() {
    const selectedOpt = select.selectedOptions?.[0] || select.options[select.selectedIndex];
    label.textContent = selectedOpt ? (selectedOpt.textContent ?? "") : "—";

    items.forEach(({ item, check, opt }) => {
      const selected = opt.value === select.value;
      item.classList.toggle("bg-zinc-100", selected);
      item.classList.toggle("dark:bg-white/10", selected);
      check.classList.toggle("opacity-0", !selected);
    });
  }

  function open() {
    closeAllCustomDropdowns(root);

    btn.setAttribute("aria-expanded", "true");
    list.setAttribute("aria-hidden", "false");
    list.classList.remove("hidden");
    list.classList.add("dd-in");

    const selectedIndex = Math.max(0, Array.from(select.options).findIndex((o) => o.value === select.value));
    const target = items[selectedIndex]?.item || items[0]?.item;
    target?.focus?.();
  }

  function close() {
    btn.setAttribute("aria-expanded", "false");
    list.setAttribute("aria-hidden", "true");
    list.classList.add("hidden");
    list.classList.remove("dd-in");
  }

  function toggle() {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    if (isOpen) close();
    else open();
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    toggle();
  });

  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      open();
    }
  });

  list.addEventListener("keydown", (e) => {
    const focusIndex = items.findIndex(({ item }) => item === document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = items[Math.min(items.length - 1, focusIndex + 1)]?.item;
      next?.focus?.();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = items[Math.max(0, focusIndex - 1)]?.item;
      prev?.focus?.();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
      btn.focus();
    }
  });

  select.addEventListener("change", syncFromSelect);

  root.insertBefore(btn, select);
  root.appendChild(list);

  rebuild();

  __ddMap.set(root, { close, open, rebuild, syncFromSelect, select, btn, list });
}

function fmtIntSpaces(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  const s = String(Math.trunc(n));
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function fmtTime(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

function fmtSeconds(sec) {
  const n = Number(sec);
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(2)}s`.replace(/\.00s$/, "s");
}

function submissionStatusPill(status) {
  const s = String(status || "").toLowerCase();

  if (s === "verified")
    return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-400/25";
  if (s === "pending")
    return "bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/25";
  if (s === "rejected" || s === "denied")
    return "bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-400/25";
  if (s === "in_review" || s === "review")
    return "bg-sky-500/15 text-sky-700 dark:text-sky-300 ring-1 ring-sky-400/25";

  return "bg-zinc-900/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-200 ring-1 ring-zinc-200/60 dark:ring-white/10";
}

function pickSubmissionThumb(row) {
  return row?.screenshot || row?.video || null;
}

function pulseOnce(el) {
  if (!el) return;
  el.classList.add("scale-[0.98]");
  setTimeout(() => el.classList.remove("scale-[0.98]"), 120);
}

function difficultyClasses(label, value) {
  const base = {
    text: 'text-zinc-800 dark:text-zinc-200',
    chip: 'border-zinc-200/80 bg-white/85 text-zinc-800 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200',
    dot: 'bg-zinc-400/70',
  };

  const EASY = {
    text: 'text-emerald-700 dark:text-emerald-300',
    chip:
      'border-emerald-300/70 bg-emerald-100/70 text-emerald-900 ' +
      'dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
  };

  const MEDIUM = {
    text: 'text-amber-700 dark:text-yellow-300',
    chip:
      'border-amber-300/70 bg-amber-100/70 text-amber-900 ' +
      'dark:border-yellow-400/20 dark:bg-yellow-500/10 dark:text-yellow-200',
    dot: 'bg-amber-500 dark:bg-yellow-400',
  };

  const HARD = {
    text: 'text-orange-700 dark:text-orange-300',
    chip:
      'border-orange-300/70 bg-orange-100/70 text-orange-900 ' +
      'dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-200',
    dot: 'bg-orange-500 dark:bg-orange-400',
  };

  const VERY_HARD = {
    text: 'text-orange-800 dark:text-orange-400',
    chip:
      'border-orange-400/70 bg-orange-200/70 text-orange-950 ' +
      'dark:border-orange-500/20 dark:bg-orange-600/10 dark:text-orange-300',
    dot: 'bg-orange-600 dark:bg-orange-500',
  };

  const EXTREME = {
    text: 'text-red-700 dark:text-red-400',
    chip:
      'border-red-300/70 bg-red-100/70 text-red-900 ' +
      'dark:border-red-500/20 dark:bg-red-600/10 dark:text-red-300',
    dot: 'bg-red-500 dark:bg-red-500',
  };

  const HELL = {
    text: 'text-rose-700 dark:text-rose-400',
    chip:
      'border-rose-300/70 bg-rose-100/70 text-rose-900 ' +
      'dark:border-rose-500/20 dark:bg-rose-600/10 dark:text-rose-300',
    dot: 'bg-rose-500 dark:bg-rose-500',
  };

  if (typeof label === 'string') {
    const L = label.toLowerCase();
    if (L.startsWith('easy')) return EASY;
    if (L.startsWith('medium')) return MEDIUM;
    if (L.startsWith('hard') && !L.startsWith('very')) return HARD;
    if (L.startsWith('very hard')) return VERY_HARD;
    if (L.startsWith('extreme')) return EXTREME;
    if (L.startsWith('hell')) return HELL;
  }

  if (Number.isFinite(value)) {
    if (value < 2.35) return EASY;       // Easy
    if (value < 4.12) return MEDIUM;     // Medium
    if (value < 5.88) return HARD;       // Hard
    if (value < 7.65) return VERY_HARD;  // Very Hard
    if (value < 9.41) return EXTREME;    // Extreme
    return HELL;                         // Hell
  }

  return base;
}

function setTextLoading(id, isLoading) {
  const el = $(id);
  if (!el) return;
  el.classList.toggle("animate-pulse", !!isLoading);
  el.classList.toggle("opacity-70", !!isLoading);
}


async function claimQuestRewards(progressId, userId) {
  const csrf = getCsrfToken();
  return httpJson(EP.claimQuest(progressId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
    },
    body: JSON.stringify({
      user_id: Number(userId),
    }),
  });
}

/* =========================
   REWARD BURST FX (coins/xp)
   ========================= */
let __gpFxRoot = null;
let __gpFxStylesInjected = false;

function __ensureGpFxRoot() {
  if (__gpFxRoot) return __gpFxRoot;
  const root = document.createElement("div");
  root.id = "gp-fx-root";
  document.body.appendChild(root);
  __gpFxRoot = root;
  return root;
}

function __ensureGpFxStyles() {
  if (__gpFxStylesInjected) return;
  __gpFxStylesInjected = true;

  const style = document.createElement("style");
  style.textContent = `
    #gp-fx-root{
      position:fixed; inset:0; pointer-events:none; z-index:9999;
      overflow:visible;
    }
    .gp-reward-pill{
      position:absolute;
      transform:translate(-50%,-50%);
      display:inline-flex;
      align-items:center;
      gap:8px;
      padding:6px 10px;
      border-radius:9999px;
      font-size:12px;
      font-weight:900;
      letter-spacing:.02em;
      backdrop-filter: blur(8px);
      box-shadow: 0 18px 35px rgba(0,0,0,.18);
      white-space:nowrap;
      user-select:none;
    }
    .gp-reward-icon{ width:14px; height:14px; display:inline-block; opacity:.95; }

    .gp-reward-pill--coins{
      background: rgba(245,158,11,.16);
      border: 1px solid rgba(245,158,11,.35);
      color: rgb(161,98,7);
    }
    .dark .gp-reward-pill--coins{
      background: rgba(245,158,11,.12);
      border-color: rgba(245,158,11,.25);
      color: rgb(253,230,138);
    }

    .gp-reward-pill--xp{
      background: rgba(16,185,129,.16);
      border: 1px solid rgba(16,185,129,.35);
      color: rgb(6,95,70);
    }
    .dark .gp-reward-pill--xp{
      background: rgba(16,185,129,.12);
      border-color: rgba(16,185,129,.25);
      color: rgb(167,243,208);
    }

    .gp-reward-dot{
      position:absolute;
      width:5px; height:5px;
      border-radius:9999px;
      transform:translate(-50%,-50%);
      filter: drop-shadow(0 10px 18px rgba(0,0,0,.22));
      opacity:.95;
    }
    .gp-reward-dot--coins{ background: rgba(245,158,11,.95); }
    .gp-reward-dot--xp{ background: rgba(16,185,129,.95); }

    @media (prefers-reduced-motion: reduce){
      .gp-reward-pill, .gp-reward-dot { transition:none !important; animation:none !important; }
    }
  `;
  document.head.appendChild(style);
}

function explodeRewardsFromButton(btn, payload = {}) {
  if (!btn) return;

  const coins = Number(payload?.coins_earned);
  const xp = Number(payload?.xp_earned);

  const hasCoins = Number.isFinite(coins) && coins > 0;
  const hasXp = Number.isFinite(xp) && xp > 0;
  if (!hasCoins && !hasXp) return;

  __ensureGpFxStyles();
  const root = __ensureGpFxRoot();

  const rect = btn.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pills = [];
  if (hasCoins) {
    pills.push({
      type: "coins",
      text: `+${fmtIntSpaces(coins)} ${t("quests.coins", "coins")}`,
      icon: `
        <svg class="gp-reward-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M12 2C6.48 2 2 4.69 2 8v8c0 3.31 4.48 6 10 6s10-2.69 10-6V8c0-3.31-4.48-6-10-6Zm0 2c4.97 0 8 2.2 8 4s-3.03 4-8 4-8-2.2-8-4 3.03-4 8-4Zm0 16c-4.97 0-8-2.2-8-4V11.3C5.78 13.54 8.7 14.5 12 14.5s6.22-.96 8-3.2V16c0 1.8-3.03 4-8 4Z"/>
        </svg>
      `,
    });
  }
  if (hasXp) {
    pills.push({
      type: "xp",
      text: `+${fmtIntSpaces(xp)} XP`,
      icon: `
        <svg class="gp-reward-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3L19 8v8l-7 3.9L5 16V8l7-3.7Z"/>
        </svg>
      `,
    });
  }

  const makeDots = (kind, count) => {
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("div");
      dot.className = `gp-reward-dot gp-reward-dot--${kind}`;
      dot.style.left = `${originX}px`;
      dot.style.top = `${originY}px`;
      root.appendChild(dot);

      const a = (Math.random() * Math.PI * 2);
      const dist = 18 + Math.random() * 48;
      const dx = Math.cos(a) * dist;
      const dy = Math.sin(a) * dist - 10;

      if (prefersReduced) {
        dot.style.opacity = "0";
        setTimeout(() => dot.remove(), 120);
        continue;
      }

      const anim = dot.animate(
        [
          { transform: "translate(-50%,-50%) scale(1)", opacity: 0.95 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.8)`, opacity: 0 },
        ],
        { duration: 520 + Math.random() * 180, easing: "cubic-bezier(.2,1,.2,1)" }
      );
      anim.onfinish = () => dot.remove();
    }
  };

  if (hasCoins) makeDots("coins", 10);
  if (hasXp) makeDots("xp", 10);

  pills.forEach((p, idx) => {
    const el = document.createElement("div");
    el.className = `gp-reward-pill gp-reward-pill--${p.type}`;
    el.innerHTML = `${p.icon}<span>${p.text}</span>`;
    el.style.left = `${originX}px`;
    el.style.top = `${originY - idx * 18}px`;
    root.appendChild(el);

    const angle = (-Math.PI / 2) + (Math.random() * 0.9 - 0.45);
    const dist = 85 + Math.random() * 45;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    if (prefersReduced) {
      el.style.opacity = "1";
      setTimeout(() => el.remove(), 650);
      return;
    }

    const anim = el.animate(
      [
        { transform: "translate(-50%,-50%) scale(0.92)", opacity: 0 },
        { transform: "translate(-50%,-50%) scale(1.02)", opacity: 1, offset: 0.18 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.06)`, opacity: 0 },
      ],
      { duration: 900, easing: "cubic-bezier(.16,1,.3,1)" }
    );

    anim.onfinish = () => el.remove();
  });

  pulseOnce(btn);
}

/* =========================
   I18N
   ========================= */
const I18N = window.DASHBOARD_I18N || {};
function t(path, fallback = null) {
  const parts = String(path).split(".");
  let cur = I18N;
  for (const p of parts) cur = cur?.[p];
  if (typeof cur === "string") return cur;
  return fallback ?? path;
}

/* =========================
   HTTP
   ========================= */
async function httpJson(url, opts = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json", ...(opts.headers || {}) },
    ...opts,
  });

  const text = await res.text();
  const json = safeJsonParse(text);

  if (!res.ok) {
    const payload = json || text;
    const msg = payload?.message || payload?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json ?? {};
}

/* =========================
   SKELETONS
   ========================= */
function skRow() {
  const el = document.createElement("div");
  el.className =
    "rounded-xl border border-zinc-200/70 dark:border-white/10 " +
    "bg-white/70 dark:bg-zinc-950/25 ring-1 ring-zinc-200/40 dark:ring-white/10 " +
    "px-3 py-2 animate-pulse";
  el.innerHTML = `
    <div class="h-3 w-32 rounded bg-zinc-900/10 dark:bg-white/10"></div>
    <div class="mt-2 h-3 w-20 rounded bg-zinc-900/5 dark:bg-white/5"></div>
  `;
  return el;
}

function skSubmissionRow() {
  const el = document.createElement("div");
  el.className =
    "rounded-xl border border-zinc-200/70 dark:border-white/10 " +
    "bg-white/70 dark:bg-zinc-950/25 ring-1 ring-zinc-200/40 dark:ring-white/10 " +
    "px-3 py-2 flex items-center gap-3 animate-pulse";

  el.innerHTML = `
    <div class="h-10 w-10 rounded-lg bg-zinc-900/10 dark:bg-white/10 shrink-0"></div>
    <div class="min-w-0 flex-1">
      <div class="h-3 w-44 max-w-full rounded bg-zinc-900/10 dark:bg-white/10"></div>
      <div class="mt-2 h-3 w-24 rounded bg-zinc-900/5 dark:bg-white/5"></div>
    </div>
    <div class="h-5 w-16 rounded bg-zinc-900/10 dark:bg-white/10 shrink-0"></div>
  `;
  return el;
}

function renderSubmissionRows(container, count = 6) {
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < count; i++) container.appendChild(skSubmissionRow());
}

function skCard() {
  const el = document.createElement("div");
  el.className =
    "rounded-xl overflow-hidden border border-zinc-200/70 dark:border-white/10 " +
    "bg-white/70 dark:bg-zinc-950/25 ring-1 ring-zinc-200/40 dark:ring-white/10 animate-pulse";

  el.innerHTML = `
    <div class="aspect-[4/3] bg-black/10 dark:bg-black/30"></div>
    <div class="p-2 space-y-2">
      <div class="h-3 w-24 max-w-full rounded bg-zinc-900/10 dark:bg-white/10"></div>
      <div class="h-4 w-16 rounded bg-zinc-900/5 dark:bg-white/5"></div>
    </div>
  `;
  return el;
}

function renderRows(container, count = 4) {
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < count; i++) container.appendChild(skRow());
}

function renderCards(container, count = 6) {
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < count; i++) container.appendChild(skCard());
}

/* =========================
   XP BAR ANIMATION (JS)
   ========================= */
let __xpAnimRaf = 0;
let __xpAnimFrom = 0;

function __easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function __setXpBarInstant(pct) {
  const bar = $("dash-xp-bar");
  if (!bar) return;

  const p = clamp(Number(pct) || 0, 0, 100);
  const s = p / 100;

  bar.style.width = "100%";
  bar.style.transformOrigin = "left center";
  bar.style.willChange = "transform";
  bar.style.transform = `scaleX(${s})`;

  bar.dataset.pct = String(p);
  __xpAnimFrom = s;
}

function __animateXpBarTo(pct, duration = 900) {
  const bar = $("dash-xp-bar");
  if (!bar) return;

  const toPct = clamp(Number(pct) || 0, 0, 100);
  const to = toPct / 100;

  const fromPct = Number(bar.dataset.pct);
  const from = Number.isFinite(fromPct) ? fromPct / 100 : __xpAnimFrom;

  if (__xpAnimRaf) cancelAnimationFrame(__xpAnimRaf);

  const start = performance.now();
  const dur = Math.max(120, Number(duration) || 900);

  bar.style.width = "100%";
  bar.style.transformOrigin = "left center";
  bar.style.willChange = "transform";

  const tick = (now) => {
    const t = clamp((now - start) / dur, 0, 1);
    const k = __easeOutCubic(t);
    const v = from + (to - from) * k;

    bar.style.transform = `scaleX(${v})`;

    if (t < 1) {
      __xpAnimRaf = requestAnimationFrame(tick);
    } else {
      bar.dataset.pct = String(toPct);
      __xpAnimFrom = to;
      __xpAnimRaf = 0;
    }
  };

  __xpAnimRaf = requestAnimationFrame(tick);
}

/* =========================
   NORMALIZERS + UI
   ========================= */
function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.purchases)) return payload.purchases;
  return [];
}

function pickPrestigeLevel(xp) {
  const p =
    xp?.prestige_level ??
    xp?.prestige?.level ??
    xp?.prestigeLevel ??
    xp?.data?.prestige_level ??
    null;

  const n = Number(p);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}


function ensureXpBarSmooth() {
  const bar = $("dash-xp-bar");
  if (!bar) return;
  bar.classList.add("transition-[width]", "duration-1000", "ease-out", "will-change-[width]");
}

function applyXpUi({ cur, max, remaining, nextName, currentName, levelText }) {
  if ($("dash-level")) $("dash-level").textContent = levelText ?? "—";

  if (cur != null && max != null) {
    $("dash-xp-text").textContent = `${fmtIntSpaces(cur)} / ${fmtIntSpaces(max)}`;
    const pct = clamp((Number(cur) / Math.max(1, Number(max))) * 100, 0, 100);

    __animateXpBarTo(pct, 950);
  } else {
    $("dash-xp-text").textContent = "—";
    __setXpBarInstant(0);
  }

  const sub = $("dash-xp-sub");
  if (!sub) return;

  if (remaining != null && nextName) {
    const base = t("header.xp_to_next", "{0} XP to next level").replace("{0}", fmtIntSpaces(remaining));
    const tierLine = currentName && nextName ? `${currentName} → ${nextName}` : null;
    sub.textContent = tierLine ? `${tierLine} • ${base}` : base;
    sub.classList.remove("hidden");
  } else if (remaining != null) {
    const base = t("header.xp_to_next", "{0} XP to next level").replace("{0}", fmtIntSpaces(remaining));
    sub.textContent = base;
    sub.classList.remove("hidden");
  } else {
    sub.classList.add("hidden");
  }
}

function rarityBadge(rarity) {
  const r = String(rarity || "common").toLowerCase();
  if (r === "legendary")
    return "bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/25";
  if (r === "epic")
    return "bg-purple-500/15 text-purple-700 dark:text-purple-300 ring-1 ring-purple-400/25";
  if (r === "rare")
    return "bg-sky-500/15 text-sky-700 dark:text-sky-300 ring-1 ring-sky-400/25";
  return "bg-zinc-900/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-200 ring-1 ring-zinc-200/60 dark:ring-white/10";
}

/* =========================
   TABS
   ========================= */
function setTabActive(name) {
  document.querySelectorAll(".dash-panel").forEach((p) => p.classList.add("hidden"));
  document.querySelectorAll(".dash-tab").forEach((b) => {
    b.classList.remove("bg-brand-500", "text-white", "shadow", "border-transparent", "bg-white/80", "dark:bg-zinc-950/40");
    b.classList.add(
      "border",
      "border-zinc-200/80",
      "dark:border-white/10",
      "bg-white/80",
      "dark:bg-zinc-950/40",
      "text-zinc-900",
      "dark:text-zinc-100",
      "hover:bg-zinc-100",
      "dark:hover:bg-white/5"
    );
  });

  const panel = $(`dash-panel-${name}`);
  panel?.classList.remove("hidden");

  const btn = Array.from(document.querySelectorAll(".dash-tab")).find((b) => b.dataset.tab === name);
  if (btn) {
    btn.classList.remove(
      "border",
      "border-zinc-200/80",
      "dark:border-white/10",
      "bg-white/80",
      "dark:bg-zinc-950/40",
      "text-zinc-900",
      "dark:text-zinc-100",
      "hover:bg-zinc-100",
      "dark:hover:bg-white/5"
    );
    btn.classList.add("bg-brand-500", "text-white", "shadow");
  }
}

/* =========================
   CARDS (WEEKLY SHOP)
   ========================= */
function buildRotationItemCard(item, onBuy) {
  const owned = !!item.owned;
  const rarity = String(item.rarity || "common").toLowerCase();
  const price = item.price ?? item.price_paid ?? item.cost ?? 0;
  const imgUrl = item.url || item.image_url || item.image || null;

  const wrap = document.createElement("div");
  wrap.className =
    "relative overflow-hidden rounded-2xl border border-zinc-200/70 dark:border-white/10 " +
    "bg-white/70 dark:bg-zinc-950/25 ring-1 ring-zinc-200/40 dark:ring-white/10";

  wrap.innerHTML = `
    <div class="p-3 flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 truncate">
          ${(item.item_name || t("weekly.item_fallback", "Item"))}
        </div>
        <div class="text-xs text-zinc-600 dark:text-zinc-300 truncate">${item.item_type || "—"}</div>
      </div>
      <span class="shrink-0 inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase ${rarityBadge(rarity)}">
        ${rarity}
      </span>
    </div>

    <div class="px-3 pb-2">
      ${
        imgUrl
          ? `
            <div class="relative overflow-hidden rounded-xl border border-zinc-200/60 dark:border-white/10 bg-black/10 dark:bg-black/30 aspect-[4/3]">
              <img class="absolute inset-0 w-full h-full object-contain"
                   src="${imgUrl}" alt=""
                   loading="lazy" decoding="async" />
            </div>`
          : `
            <div class="rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-900/5 dark:bg-white/5 aspect-[4/3]
                        flex items-center justify-center text-[11px] text-zinc-500 dark:text-zinc-400">
              ${t("weekly.no_image", "No image")}
            </div>`
      }
    </div>

    <div class="px-3 pb-3 flex items-center justify-between gap-3">
      <div class="text-xs text-zinc-700 dark:text-zinc-200">
        <span class="opacity-75">${t("weekly.price", "Price")}</span>
        <span class="font-extrabold text-emerald-700 dark:text-emerald-300 ml-1">${fmtIntSpaces(price)}</span>
      </div>

      ${
        owned
          ? `<div class="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 ring-1 ring-emerald-400/20 rounded-full px-3 py-1">
               ${t("weekly.owned", "OWNED")}
             </div>`
          : `<button type="button"
               class="dash-buy-item cursor-pointer rounded-xl bg-white/80 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10
                      border border-zinc-200/80 dark:border-white/10 px-3 py-1.5 text-xs font-extrabold text-zinc-900 dark:text-zinc-100 transition">
               ${t("weekly.buy", "Buy")}
             </button>`
      }
    </div>
  `;

  const btn = wrap.querySelector(".dash-buy-item");
  if (btn) btn.addEventListener("click", () => onBuy(item));

  return wrap;
}

/* =========================
   STATE
   ========================= */
let state = {
  avatarRaw: null,
  avatarUrl: null,
  userId: null,
  pricing: null,
  rotation: null,
  rewards: null,
  purchases: null,
  quests: null,
  questHistory: null,
  keys: null,
  coins: null,
  xpSummary: null,
};

/* =========================
   INIT HELPERS
   ========================= */
function getUserId() {
  return (
    (typeof window.user_id === "string" && window.user_id) ||
    (typeof window.user_id === "number" && String(window.user_id)) ||
    ($("dash-current-user")?.value ? String($("dash-current-user").value) : "")
  );
}

function setBusy(btn, v) {
  if (!btn) return;
  btn.disabled = !!v;
  btn.classList.toggle("opacity-60", !!v);
  btn.classList.toggle("cursor-not-allowed", !!v);
}

function setHeaderLoading(isLoading) {
  const img = $("dash-avatar");
  const sk = $("dash-avatar-skel");
  const fb = $("dash-avatar-fallback");

  const stack = $("dash-header-stack");
  if (stack) stack.classList.toggle("is-loading", !!isLoading);

  const avatarReady =
    !!img &&
    !!img.getAttribute("src") &&
    img.complete &&
    img.naturalWidth > 0;

  if (isLoading) {
    if (avatarReady) {
      hide(sk);
      show(img);
      hide(fb);
    } else {
      hide(img);
      hide(fb);
      show(sk);
    }
  }

  ["dash-username", "dash-userid", "dash-xp-text", "dash-coins", "dash-level"].forEach((id) =>
    setTextLoading(id, isLoading)
  );
}

function finalizeAvatar(ok) {
  const img = $("dash-avatar");
  const sk = $("dash-avatar-skel");
  const fb = $("dash-avatar-fallback");

  hide(sk);

  if (ok) {
    show(img);
    hide(fb);
  } else {
    hide(img);
    show(fb);
  }
}

let __avatarLoadToken = 0;

function loadAvatarUrl(url) {
  const img = $("dash-avatar");
  const sk = $("dash-avatar-skel");
  const fb = $("dash-avatar-fallback");
  if (!img || !sk || !fb) return;

  const nextUrl = url ? String(url) : null;

  const currentUrl = img.getAttribute("src") || null;
  const avatarReady = !!currentUrl && img.complete && img.naturalWidth > 0;

  if (nextUrl && currentUrl === nextUrl && avatarReady) {
    hide(sk);
    show(img);
    hide(fb);
    return;
  }

  const token = ++__avatarLoadToken;

  // état loading uniquement si on doit vraiment charger une nouvelle image
  show(sk);
  hide(img);
  hide(fb);

  img.onload = null;
  img.onerror = null;

  if (!nextUrl) {
    img.removeAttribute("src");
    hide(sk);
    hide(img);
    show(fb);
    return;
  }

  const finish = (ok) => {
    if (token !== __avatarLoadToken) return;
    hide(sk);
    if (ok) {
      show(img);
      hide(fb);
    } else {
      hide(img);
      show(fb);
    }
  };

  const softTimeout = setTimeout(() => {
    if (token !== __avatarLoadToken) return;
    hide(sk);
    hide(img);
    show(fb);
  }, 8000);

  img.onload = () => {
    clearTimeout(softTimeout);
    finish(true);
  };

  img.onerror = () => {
    clearTimeout(softTimeout);
    finish(false);
  };

  img.src = nextUrl;

  if (typeof img.decode === "function") {
    img
      .decode()
      .then(() => {
        clearTimeout(softTimeout);
        finish(img.naturalWidth > 0);
      })
      .catch(() => {
      });
  } else {
    requestAnimationFrame(() => {
      if (token !== __avatarLoadToken) return;
      if (img.complete) {
        clearTimeout(softTimeout);
        finish(img.naturalWidth > 0);
      }
    });
  }
}

/* =========================
   LOAD: HEADER
   ========================= */
async function loadHeader() {
  const uid = state.userId;
  if (!uid) return;

  setHeaderLoading(true);

  let fallbackXp = { lvl: null, cur: null, max: null };

  try {
    const data = await httpJson(EP.rankcard(uid), { cache: "no-store" });

    const nickname =
      data?.nickname ||
      data?.username ||
      data?.user?.nickname ||
      data?.user?.username ||
      `User ${uid}`;

    $("dash-username").textContent = nickname;
    $("dash-userid").textContent = `ID ${uid}`;

    const avatarRaw =
      data?.avatar_url ||
      data?.avatar ||
      data?.user?.avatar_url ||
      null;

    if (avatarRaw !== state.avatarRaw) {
      state.avatarRaw = avatarRaw;
      state.avatarUrl = avatarRaw ? cdnImage(avatarRaw) : null;
    }

    loadAvatarUrl(state.avatarUrl);

    const rank = data?.rank_name || data?.rank || data?.tier || data?.division || null;
    const rankEl = $("dash-rank-pill");
    if (rankEl) {
    if (rank) {
        rankEl.textContent = String(rank);
        rankEl.classList.remove("invisible");
    } else {
        rankEl.textContent = "—";
        rankEl.classList.add("invisible");
    }
    }

    const elite = !!(data?.elite || data?.flags?.elite || data?.user?.flags?.elite);
    const tag = $("dash-tag");
    if (tag) tag.classList.toggle("hidden", !elite);

    const fallbackLvl = data?.level ?? data?.xp?.level ?? data?.user?.level ?? null;
    const fallbackCur = data?.xp_current ?? data?.xp?.current ?? data?.xp ?? data?.current_xp ?? null;
    const fallbackMax = data?.xp_required ?? data?.xp?.required ?? data?.xp_max ?? data?.next_level_xp ?? null;

    fallbackXp = { lvl: fallbackLvl, cur: fallbackCur, max: fallbackMax };
  } catch {
    loadAvatarUrl(null);
  }

  let applied = false;

  try {
    const xp = await httpJson(EP.xpSummary(uid), { cache: "no-store" });
    state.xpSummary = xp;

    const cur = Number(xp?.xp);
    const max = Number(xp?.next_sub_tier_xp_total) || Number(xp?.next_main_tier_xp_total) || null;
    const remaining = Number(xp?.next_sub_tier_xp_required) || Number(xp?.next_main_tier_xp_required) || null;

    if (Number.isFinite(cur) && Number.isFinite(max)) {
      const baseLevelText =
        xp?.normalized_tier != null
          ? String(xp.normalized_tier)
          : xp?.raw_tier != null
            ? String(xp.raw_tier)
            : "—";

      const prestige = pickPrestigeLevel(xp);
      const levelText = prestige != null ? `${baseLevelText} • P${prestige}` : baseLevelText;

      applyXpUi({
        cur,
        max,
        remaining: Number.isFinite(remaining) ? remaining : null,
        nextName: xp?.next_full_tier_name || null,
        currentName: xp?.current_full_tier_name || null,
        levelText,
      });

      const wrap = $("dash-xp-wrap");
      if (wrap) {
        const parts = [];
        if (xp?.current_full_tier_name) parts.push(String(xp.current_full_tier_name));
        if (xp?.next_full_tier_name) parts.push(`→ ${xp.next_full_tier_name}`);
        parts.push(`${fmtIntSpaces(cur)} / ${fmtIntSpaces(max)}`);
        if (Number.isFinite(remaining)) {
          parts.push(t("header.to_next_short", "{0} to next").replace("{0}", fmtIntSpaces(remaining)));
        }
        if (prestige != null) {
          parts.push(t("header.prestige_short", "Prestige P{0}").replace("{0}", String(prestige)));
        }
        wrap.title = parts.join(" • ");
      }

      applied = true;
    }
  } catch {}

  if (!applied) {
    const cur = fallbackXp?.cur != null ? Number(fallbackXp.cur) : null;
    const max = fallbackXp?.max != null ? Number(fallbackXp.max) : null;

    applyXpUi({
      cur: Number.isFinite(cur) ? cur : null,
      max: Number.isFinite(max) ? max : null,
      remaining: Number.isFinite(cur) && Number.isFinite(max) ? Math.max(0, max - cur) : null,
      nextName: null,
      currentName: null,
      levelText: fallbackXp?.lvl != null ? String(fallbackXp.lvl) : "—",
    });

    const wrap = $("dash-xp-wrap");
    if (wrap) wrap.title = "—";
  }

  try {
    const coinsPayload = await httpJson(EP.coins(uid), { cache: "no-store" });
    const coins = Number(coinsPayload?.coins ?? coinsPayload?.data?.coins ?? coinsPayload);
    state.coins = Number.isFinite(coins) ? coins : null;
    $("dash-coins").textContent = state.coins == null ? "—" : fmtIntSpaces(state.coins);
  } catch {
    $("dash-coins").textContent = "—";
  }

  try {
    const keysPayload = await httpJson(EP.keys(uid), { cache: "no-store" });
    const list = normalizeList(keysPayload);
    state.keys = list;

    const byType = (type) =>
      list
        .filter((k) => String(k.key_type || k.type || "").toLowerCase() === String(type).toLowerCase())
        .reduce((s, k) => s + (Number(k.amount) || 0), 0);

    $("dash-keys-classic").textContent = fmtIntSpaces(byType("Classic"));
    $("dash-keys-winter").textContent = fmtIntSpaces(byType("Winter"));
  } catch {
    $("dash-keys-classic").textContent = "—";
    $("dash-keys-winter").textContent = "—";
  }

  setHeaderLoading(false);
}

/* =========================
   LOAD: REWARDS
   ========================= */
async function loadRewardsSummary() {
  const uid = state.userId;
  if (!uid) return;

  try {
    const payload = await httpJson(EP.rewards(uid), { cache: "no-store" });
    const list = normalizeList(payload);
    state.rewards = list;

    $("dash-rewards").textContent = fmtIntSpaces(list.length);

    const sorted = list
      .slice()
      .sort((a, b) => new Date(b.obtained_at || b.created_at || 0) - new Date(a.obtained_at || a.created_at || 0))
      .slice(0, 6);

    const boxA = $("dash-recent-rewards");
    const boxB = $("dash-rewards-grid");

    [boxA, boxB].forEach((box) => {
      if (!box) return;

      box.innerHTML = "";
      if (!sorted.length) {
        box.innerHTML = `<div class="col-span-2 text-xs text-zinc-600 dark:text-zinc-300">${t("lootboxes.no_rewards", "No rewards yet.")}</div>`;
        return;
      }

      sorted.forEach((r) => {
        const el = document.createElement("div");
        el.className =
          "rounded-xl overflow-hidden border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-950/25 " +
          "ring-1 ring-zinc-200/40 dark:ring-white/10";
        const img = r.url || r.image_url || r.image || "";
        el.innerHTML = `
          <div class="aspect-[4/3] bg-black/10 dark:bg-black/30 flex items-center justify-center">
            ${img ? `<img src="${img}" class="max-h-full max-w-full object-contain" loading="lazy" decoding="async">` : ""}
          </div>
          <div class="p-2">
            <div class="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 truncate">${r.name || "—"}</div>
            <div class="mt-1 inline-flex items-center rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${rarityBadge(r.rarity)}">
              ${(r.rarity || "common")}
            </div>
          </div>
        `;
        box.appendChild(el);
      });
    });
  } catch {
    $("dash-rewards").textContent = "—";
  }
}

/* =========================
   LOAD: PURCHASES
   ========================= */
async function loadPurchases() {
  const uid = state.userId;
  if (!uid) return;

  const a = $("dash-purchases");
  const b = $("dash-purchases-full");

  renderRows(a, 4);
  renderRows(b, 6);

  try {
    const payload = await httpJson(EP.purchases(uid, 10, 0), { cache: "no-store" });
    const list = normalizeList(payload);
    state.purchases = list;

    const render = (container, take = 6) => {
      if (!container) return;

      container.innerHTML = "";
      if (!list.length) {
        container.innerHTML = `<div class="text-xs text-zinc-600 dark:text-zinc-300">${t("overview.no_purchases", "No purchases yet.")}</div>`;
        return;
      }

      list.slice(0, take).forEach((p) => {
        const row = document.createElement("div");
        row.className =
          "rounded-xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-950/25 " +
          "ring-1 ring-zinc-200/40 dark:ring-white/10 px-3 py-2 flex items-start justify-between gap-3";
        row.innerHTML = `
          <div class="min-w-0">
            <div class="text-xs font-extrabold text-zinc-900 dark:text-zinc-100 truncate">${p.item_name || p.key_type || "Purchase"}</div>
            <div class="text-[11px] text-zinc-600 dark:text-zinc-300 truncate">${p.purchase_type || p.item_type || "—"}</div>
            <div class="text-[11px] text-zinc-500 dark:text-zinc-400">${fmtTime(p.purchased_at)}</div>
          </div>
          <div class="text-right shrink-0">
            <div class="text-[11px] text-zinc-500 dark:text-zinc-400">${t("overview.paid", "paid")}</div>
            <div class="text-xs font-extrabold text-emerald-700 dark:text-emerald-300">${fmtIntSpaces(p.price_paid)}</div>
          </div>
        `;
        container.appendChild(row);
      });
    };

    render(a, 6);
    render(b, 10);
  } catch {
    if (a) a.innerHTML = `<div class="text-xs text-zinc-600 dark:text-zinc-300">${t("errors.load_failed", "Failed to load.")}</div>`;
    if (b) b.innerHTML = `<div class="text-xs text-zinc-600 dark:text-zinc-300">${t("errors.load_failed", "Failed to load.")}</div>`;
  }
}

/* =========================
   LOAD: SUBMISSIONS
   ========================= */
async function loadRecentSubmissions() {
  const uid = state.userId;
  const box = $("dash-recent-submissions");
  const empty = $("dash-recent-submissions-empty");
  if (!uid || !box) return;

  if (empty) hide(empty);
  renderSubmissionRows(box, 6);

  try {
    const payload = await httpJson(EP.dashboardCompletions(uid, 10, 1), { cache: "no-store" });

    const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
    box.innerHTML = "";

    if (!list.length) {
      if (empty) show(empty);
      return;
    }

    list.slice(0, 10).forEach((row) => {
      const code = row?.code ? String(row.code) : "—";
      const map = row?.map_name ? String(row.map_name) : t("submissions.unknown_map", "Unknown map");
      const time = row?.time != null ? fmtSeconds(row.time) : "—";
      const diff = row?.difficulty ? String(row.difficulty) : null;
      const dcls = diff ? difficultyClasses(diff, NaN) : null;
      const status = row?.status ? String(row.status) : t("submissions.unknown_status", "Unknown");
      const thumb = pickSubmissionThumb(row);

      const wrap = document.createElement("div");
      wrap.className =
        "rounded-xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-950/25 " +
        "ring-1 ring-zinc-200/40 dark:ring-white/10 px-3 py-2 flex items-center gap-3";

      wrap.innerHTML = `
        <div class="h-10 w-10 rounded-lg overflow-hidden border border-zinc-200/60 dark:border-white/10 bg-black/10 dark:bg-black/30 shrink-0 flex items-center justify-center">
          ${
            thumb
              ? `<img src="${thumb}" alt="" class="h-full w-full object-cover" loading="lazy" decoding="async">`
              : `<svg class="h-5 w-5 text-zinc-400 dark:text-zinc-500" viewBox="0 0 24 24" aria-hidden="true">
                   <path fill="currentColor" d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2ZM8.5 11.5 11 14.5l3.5-4.5L19 17H5l3.5-5.5Z"/>
                 </svg>`
          }
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 min-w-0">
            <div class="min-w-0 truncate text-xs font-extrabold text-zinc-900 dark:text-zinc-100">
              ${code} • ${map}
            </div>
          </div>

          <div class="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-zinc-600 dark:text-zinc-300">
            <span class="inline-flex items-center rounded-full px-2 py-0.5 bg-zinc-900/5 dark:bg-white/5 ring-1 ring-zinc-200/60 dark:ring-white/10">
              ${t("submissions.time", "Time")}: <span class="ml-1 font-extrabold text-zinc-900 dark:text-zinc-100">${time}</span>
            </span>

            ${
              diff
                ? `<span class="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${dcls.chip}">
                     <span class="h-1.5 w-1.5 rounded-full ${dcls.dot}"></span>
                     <span class="leading-none">${diff}</span>
                   </span>`
                : ""
            }
          </div>
        </div>

        <span class="shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-extrabold ${submissionStatusPill(status)}">
          ${status}
        </span>
      `;

      if (row?.screenshot) {
        wrap.classList.add("cursor-pointer", "hover:bg-zinc-100/60", "dark:hover:bg-white/5", "transition");
        wrap.title = t("submissions.open_screenshot", "Open screenshot");
        wrap.addEventListener("click", () => window.open(String(row.screenshot), "_blank", "noopener"));
      }

      box.appendChild(wrap);
    });
  } catch (e) {
    box.innerHTML = `<div class="text-xs text-zinc-600 dark:text-zinc-300">${t("submissions.load_failed", "Failed to load submissions.")}</div>`;
  }
}

/* =========================
   LOAD: WEEKLY SHOP
   ========================= */
async function loadWeeklyShop() {
  const uid = state.userId;
  const root = $("dash-rotation");
  if (!uid || !root) return;

  renderCards(root, 6);

  try {
    const payload = await httpJson(EP.rotation(uid), { cache: "no-store" });
    state.rotation = payload;

    const rid = payload?.rotation_id || payload?.data?.rotation_id;
    const until = payload?.available_until || payload?.data?.available_until;

    $("dash-rotation-ttl").textContent = until
      ? t("weekly.available_until", "Available until {0}").replace("{0}", fmtTime(until))
      : rid
        ? t("weekly.rotation_id", "Rotation #{0}").replace("{0}", String(rid))
        : "—";

    const all = normalizeList(payload?.items ?? payload?.data?.items ?? payload);
    let filtered = all;

    const buy = async (item) => {
      try {
        await httpJson(EP.buyItem(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: String(uid),
            item_name: String(item.item_name || ""),
            item_type: String(item.item_type || ""),
            key_type: String(item.key_type || ""),
          }),
        });

        await Promise.allSettled([loadHeader(), loadPurchases(), loadWeeklyShop()]);
      } catch {}
    };

    const renderGrid = () => {
      root.innerHTML = "";
      if (!filtered.length) {
        root.innerHTML = `<div class="text-sm text-zinc-600 dark:text-zinc-300">${t("weekly.no_items", "No items in rotation.")}</div>`;
        return;
      }
      filtered.forEach((it) => root.appendChild(buildRotationItemCard(it, buy)));
    };

    const applyFilters = () => {
      const q = ($("dash-rotation-search")?.value || "").trim().toLowerCase();
      const r = ($("dash-rotation-rarity")?.value || "").trim().toLowerCase();

      filtered = all.filter((it) => {
        const name = String(it.item_name || "").toLowerCase();
        const type = String(it.item_type || "").toLowerCase();
        const rr = String(it.rarity || "common").toLowerCase();
        if (r && rr !== r) return false;
        if (q && !name.includes(q) && !type.includes(q)) return false;
        return true;
      });

      renderGrid();
    };

    $("dash-rotation-search")?.addEventListener("input", applyFilters);
    $("dash-rotation-rarity")?.addEventListener("change", applyFilters);

    applyFilters();
  } catch {
    root.innerHTML = `<div class="text-sm text-zinc-600 dark:text-zinc-300">${t("errors.load_failed", "Failed to load.")}</div>`;
  }
}

/* =========================
   LOAD: KEY SHOP
   ========================= */
async function loadKeyShop() {
  const uid = state.userId;
  if (!uid) return;

  const typeSel = $("dash-key-type");
  const qtySel = $("dash-key-qty");
  const priceEl = $("dash-key-price");
  const noteEl = $("dash-key-note");
  const buyBtn = $("dash-buy-keys");

  if (!typeSel || !qtySel || !priceEl || !buyBtn) return;

  try {
    if (!state.pricing) state.pricing = await httpJson(EP.storeKeys(), { cache: "no-store" });
  } catch {
    priceEl.textContent = "—";
    noteEl.textContent = t("errors.store_unavailable", "Store unavailable.");
    return;
  }

  const pricing = state.pricing;
  const keys = pricing?.keys || pricing?.data?.keys || [];
  const active = pricing?.active_key_type || pricing?.data?.active_key_type || null;

  function computePrice(keyType, qty) {
    const kt = (Array.isArray(keys) ? keys : []).find((k) => String(k.key_type) === String(keyType));
    if (!kt) return null;
    const prices = Array.isArray(kt.prices) ? kt.prices : [];
    const row = prices.find((p) => Number(p.quantity) === Number(qty)) || prices[0];
    if (!row) return null;
    return {
      active_key_type: active || null,
      key_type: kt.key_type,
      price: row.price,
      discount_percent: row.discount_percent,
    };
  }

  function updateUi() {
    const kt = String(typeSel.value || "Classic");
    const qty = Number(qtySel.value || 1);
    const info = computePrice(kt, qty);

    if (!info) {
      priceEl.textContent = "—";
      noteEl.textContent = "";
      return;
    }

    priceEl.textContent = t("keyshop.price_coins", "{0} coins").replace("{0}", fmtIntSpaces(info.price));

    const disc = Number(info.discount_percent || 0);
    noteEl.textContent =
      disc > 0 ? t("keyshop.discount", "Discount: {0}%").replace("{0}", String(disc)) : t("keyshop.no_discount", "No discount");

    if (info.active_key_type && String(info.active_key_type) !== kt) {
      noteEl.textContent += ` • ${t("keyshop.active_key", "Active key")}: ${info.active_key_type}`;
    }
  }

  typeSel.addEventListener("change", updateUi);
  qtySel.addEventListener("change", updateUi);
  updateUi();

  buyBtn.addEventListener("click", async () => {
    setBusy(buyBtn, true);
    try {
      await httpJson(EP.buyKeys(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: String(uid),
          key_type: String(typeSel.value || "Classic"),
          quantity: Number(qtySel.value || 1),
        }),
      });

      await Promise.allSettled([loadHeader(), loadPurchases()]);
    } catch {
    } finally {
      setBusy(buyBtn, false);
    }
  });
}

/* =========================
   LOAD: LOOTBOXES PANEL
   ========================= */
async function loadLootboxesPanel() {
  const uid = state.userId;
  const grid = $("dash-keys-grid");
  if (!uid || !grid) return;

  grid.innerHTML = "";

  const list = Array.isArray(state.keys) ? state.keys : [];
  if (!list.length) {
    grid.innerHTML = `<div class="text-sm text-zinc-600 dark:text-zinc-300">${t("lootboxes.no_keys", "No keys.")}</div>`;
    return;
  }

  const types = [
    { type: "Classic", label: t("lootboxes.classic", "Classic"), accent: "from-brand-500 to-indigo-500" },
    { type: "Winter", label: t("lootboxes.winter", "Winter"), accent: "from-sky-500 to-cyan-500" },
  ];

  types.forEach((tt) => {
    const amount = list
      .filter((k) => String(k.key_type || "").toLowerCase() === tt.type.toLowerCase())
      .reduce((s, k) => s + (Number(k.amount) || 0), 0);

    const icon =
      tt.type === "Classic"
        ? cdnAsset("assets/lootbox/keys/classic.png")
        : cdnAsset("assets/lootbox/keys/winter.png");

    const card = document.createElement("div");
    card.className =
      "rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-950/25 " +
      "ring-1 ring-zinc-200/40 dark:ring-white/10 p-4 flex items-center justify-between gap-3";

    card.innerHTML = `
      <div class="min-w-0">
        <div class="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">${tt.label}</div>
        <div class="mt-1 text-xs text-zinc-600 dark:text-zinc-300">${t("lootboxes.keys_available", "Keys available")}</div>
      </div>

      <!-- ✅ colonne droite stable + alignments -->
      <div class="text-right flex flex-col items-end min-w-[8.5rem]">
        <div class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 inline-flex items-center justify-end gap-2">
          <img
            src="${icon}"
            alt=""
            class="h-7 w-7 shrink-0 object-contain"
            loading="lazy"
            decoding="async"
          />
          <span>${fmtIntSpaces(amount)}</span>
        </div>

        <!-- ✅ bouton prend toute la largeur de la colonne => aligné pareil partout -->
        <a href="/lootbox"
          class="mt-2 w-full inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-extrabold text-white bg-gradient-to-r ${tt.accent} shadow hover:opacity-95 transition">
          ${t("lootboxes.open", "Open")}
        </a>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* =========================
   LOAD: QUESTS
   ========================= */
async function loadQuestsPanel() {
  const uid = state.userId;
  if (!uid) return;

  const weekly = $("dash-weekly-quests");
  const hist = $("dash-quest-history");

  renderRows(weekly, 5);
  renderRows(hist, 5);

  const difficultyPill = (d) => {
    const dd = String(d || "").toLowerCase();
    if (dd === "easy") return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-400/25";
    if (dd === "medium") return "bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/25";
    if (dd === "hard") return "bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-400/25";
    if (dd === "bounty") return "bg-sky-500/15 text-sky-700 dark:text-sky-300 ring-1 ring-sky-400/25";
    return "bg-zinc-900/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-200 ring-1 ring-zinc-200/60 dark:ring-white/10";
  };

  const fmtSeconds = (s) => {
    const n = Number(s);
    if (!Number.isFinite(n)) return "—";
    const total = Math.max(0, Math.round(n));
    const m = Math.floor(total / 60);
    const sec = total % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const pickProgress = (q) => q?.progress || {};
  const calcPct = (q) => {
    const p = pickProgress(q);
    const pct = Number(p.percentage);
    if (Number.isFinite(pct)) return clamp(pct, 0, 100);
    const cur = Number(p.current);
    const max = Number(p.target);
    if (Number.isFinite(cur) && Number.isFinite(max)) return clamp((cur / Math.max(1, max)) * 100, 0, 100);
    return q?.completed ? 100 : 0;
  };

  try {
    const payload = await httpJson(EP.weeklyQuests(uid), { cache: "no-store" });
    const quests = Array.isArray(payload?.quests) ? payload.quests : [];
    const summary = payload?.summary || null;

    state.quests = quests;

    if (summary) {
      $("dash-quests-done").textContent = fmtIntSpaces(Number(summary.completed ?? 0));
    } else {
      $("dash-quests-done").textContent = fmtIntSpaces(quests.filter((q) => q?.completed === true).length);
    }

    weekly.innerHTML = "";

    const until = payload?.available_until ? fmtTime(payload.available_until) : null;
    const rid = payload?.rotation_id ? String(payload.rotation_id) : null;

    const header = document.createElement("div");
    header.className =
      "mb-3 rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-950/25 " +
      "ring-1 ring-zinc-200/40 dark:ring-white/10 px-4 py-3";
    header.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="text-xs font-extrabold text-zinc-900 dark:text-zinc-100">
          ${t("quests.rotation", "Weekly Rotation")}
        </div>
        <div class="text-[11px] text-zinc-600 dark:text-zinc-300">
          ${until ? t("quests.available_until", "Available until {0}").replace("{0}", until) : (rid ? `#${rid}` : "—")}
        </div>
      </div>
      ${
        summary
          ? `
          <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div class="rounded-xl bg-zinc-900/5 dark:bg-white/5 ring-1 ring-zinc-200/60 dark:ring-white/10 px-3 py-2">
              <div class="text-[10px] text-zinc-600 dark:text-zinc-300">${t("quests.total", "Total")}</div>
              <div class="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">${fmtIntSpaces(summary.total_quests ?? quests.length)}</div>
            </div>
            <div class="rounded-xl bg-zinc-900/5 dark:bg-white/5 ring-1 ring-zinc-200/60 dark:ring-white/10 px-3 py-2">
              <div class="text-[10px] text-zinc-600 dark:text-zinc-300">${t("quests.completed", "Completed")}</div>
              <div class="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">${fmtIntSpaces(summary.completed ?? 0)}</div>
            </div>
            <div class="rounded-xl bg-zinc-900/5 dark:bg-white/5 ring-1 ring-zinc-200/60 dark:ring-white/10 px-3 py-2">
              <div class="text-[10px] text-zinc-600 dark:text-zinc-300">${t("quests.potential_coins", "Potential Coins")}</div>
              <div class="text-sm font-extrabold text-amber-700 dark:text-amber-300">${fmtIntSpaces(summary.potential_coins ?? 0)}</div>
            </div>
            <div class="rounded-xl bg-zinc-900/5 dark:bg-white/5 ring-1 ring-zinc-200/60 dark:ring-white/10 px-3 py-2">
              <div class="text-[10px] text-zinc-600 dark:text-zinc-300">${t("quests.potential_xp", "Potential XP")}</div>
              <div class="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">${fmtIntSpaces(summary.potential_xp ?? 0)}</div>
            </div>
          </div>
          `
          : ""
      }
    `;
    weekly.appendChild(header);

    if (!quests.length) {
      const empty = document.createElement("div");
      empty.className = "text-sm text-zinc-600 dark:text-zinc-300";
      empty.textContent = t("quests.none", "No quests available.");
      weekly.appendChild(empty);
    } else {
      quests.forEach((q) => {
        const title = q?.name || q?.title || "Quest";
        const desc = q?.description || "";
        const diff = q?.difficulty || "—";
        const done = q?.completed === true;
        const claimed = q?.claimed === true;

        const p = pickProgress(q);
        const pct = calcPct(q);

        let progText = "—";
        if (Number.isFinite(Number(p.current)) && Number.isFinite(Number(p.target))) {
          progText = `${fmtIntSpaces(p.current)} / ${fmtIntSpaces(p.target)}`;
        } else if (q?.bounty_type && p?.target_time != null) {
          progText = `${t("quests.target", "Target")}: ${fmtSeconds(p.target_time)}`;
        }

        const rewardCoins = Number(q?.coin_reward ?? 0);
        const rewardXp = Number(q?.xp_reward ?? 0);

        const canClaim = done && !claimed && Number.isFinite(Number(q?.progress_id));
        const pid = q?.progress_id;

        const row = document.createElement("div");
        row.className =
          "rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-950/25 " +
          "ring-1 ring-zinc-200/40 dark:ring-white/10 p-4";

        row.innerHTML = `
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <div class="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 truncate">${title}</div>
                <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${difficultyPill(diff)}">
                  ${String(diff)}
                </span>
              </div>

              <div class="mt-1 text-xs text-zinc-600 dark:text-zinc-300">${desc}</div>

              <div class="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                <span class="inline-flex items-center rounded-full px-2 py-0.5 bg-zinc-900/5 dark:bg-white/5 ring-1 ring-zinc-200/60 dark:ring-white/10 text-zinc-700 dark:text-zinc-200">
                  ${t("quests.progress", "Progress")}: <span class="ml-1 font-extrabold">${progText}</span>
                </span>

                <span class="inline-flex items-center rounded-full px-2 py-0.5 bg-amber-500/10 ring-1 ring-amber-400/20 text-amber-700 dark:text-amber-300">
                  +${fmtIntSpaces(rewardCoins)} ${t("quests.coins", "coins")}
                </span>

                <span class="inline-flex items-center rounded-full px-2 py-0.5 bg-emerald-500/10 ring-1 ring-emerald-400/20 text-emerald-700 dark:text-emerald-300">
                  +${fmtIntSpaces(rewardXp)} XP
                </span>
              </div>
            </div>

            <div class="shrink-0 text-right flex flex-col items-end">
              <div class="text-xs font-extrabold ${done ? "text-emerald-700 dark:text-emerald-300" : "text-zinc-700 dark:text-zinc-200"}">
                ${Math.round(pct)}%
              </div>

              <div class="mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                claimed
                  ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 ring-1 ring-purple-400/25"
                  : done
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-400/25"
                    : "bg-zinc-900/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-200 ring-1 ring-zinc-200/60 dark:ring-white/10"
              }">
                ${claimed ? t("quests.claimed", "CLAIMED") : done ? t("quests.done", "DONE") : t("quests.in_progress", "IN PROGRESS")}
              </div>

              ${
                claimed
                  ? ""
                  : `
                    <button
                      type="button"
                      data-claim-btn="1"
                      data-progress-id="${pid ?? ""}"
                      ${canClaim ? "" : "disabled"}
                      class="mt-2 cursor-pointer inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-extrabold transition
                        ${
                          canClaim
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow"
                            : "bg-white/60 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 border border-zinc-200/70 dark:border-white/10 opacity-70 cursor-not-allowed"
                        }"
                      title="${canClaim ? "" : t("quests.complete_to_claim", "Complete the quest to claim")}"
                    >
                      ${t("quests.claim", "Claim")}
                    </button>
                  `
              }

              <div class="mt-2 hidden text-[11px] font-semibold text-rose-700 dark:text-rose-300" data-claim-err="1"></div>
            </div>
          </div>

          <div class="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-900/10 dark:bg-white/10 ring-1 ring-zinc-200/60 dark:ring-white/10">
            <div class="h-full bg-gradient-to-r from-emerald-400 to-brand-500 transition-[width] duration-700 ease-out will-change-[width]" style="width:${pct}%"></div>
          </div>
        `;

        weekly.appendChild(row);

        const btn = row.querySelector('[data-claim-btn="1"]');
        if (btn && done && !claimed) {
          btn.addEventListener("click", async () => {
            const progressId = Number(btn.dataset.progressId);
            if (!Number.isFinite(progressId) || progressId < 1) return;

            const errEl = row.querySelector('[data-claim-err="1"]');
            if (errEl) {
              errEl.textContent = "";
              errEl.classList.add("hidden");
            }

            const old = btn.textContent;
            setBusy(btn, true);
            btn.textContent = t("actions.claiming", "Claiming…");

            try {
              const res = await claimQuestRewards(progressId, state.userId);
              explodeRewardsFromButton(btn, res);

              await Promise.allSettled([
                loadHeader(),
                loadQuestsPanel(),
                loadRewardsSummary(),
                loadPurchases(),
              ]);
            } catch (e) {
              if (errEl) {
                errEl.textContent = t("quests.claim_failed", "Claim failed.");
                errEl.classList.remove("hidden");
              }
            } finally {
              setBusy(btn, false);
              btn.textContent = old;
            }
          });
        }
      });
    }
  } catch {
    weekly.innerHTML = `<div class="text-sm text-zinc-600 dark:text-zinc-300">${t("errors.load_failed", "Failed to load.")}</div>`;
  }

  try {
    const payload = await httpJson(EP.questHistory(uid), { cache: "no-store" });
    const list = normalizeList(payload);
    state.questHistory = list;

    hist.innerHTML = "";
    if (!list.length) {
      hist.innerHTML = `<div class="text-sm text-zinc-600 dark:text-zinc-300">${t("quests.no_history", "No history yet.")}</div>`;
    } else {
      list.slice(0, 8).forEach((h) => {
        const row = document.createElement("div");
        row.className =
          "rounded-xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-950/25 " +
          "ring-1 ring-zinc-200/40 dark:ring-white/10 px-3 py-2 flex items-start justify-between gap-3";
        row.innerHTML = `
          <div class="min-w-0">
            <div class="text-xs font-extrabold text-zinc-900 dark:text-zinc-100 truncate">${h.title || h.name || "Quest"}</div>
            <div class="text-[11px] text-zinc-600 dark:text-zinc-300 truncate">${fmtTime(h.completed_at || h.created_at)}</div>
          </div>
          <div class="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300">
            +${fmtIntSpaces(h.reward_xp || h.xp || 0)} XP
          </div>
        `;
        hist.appendChild(row);
      });
    }
  } catch {
    hist.innerHTML = `<div class="text-sm text-zinc-600 dark:text-zinc-300">${t("errors.load_failed", "Failed to load.")}</div>`;
  }
}

/* =========================
   LOAD: UNREAD
   ========================= */
async function loadUnread() {
  try {
    const payload = await httpJson(EP.unreadCount(), { cache: "no-store" });
    const n = Number(payload?.count ?? payload?.data?.count ?? payload);
    $("dash-unread").textContent = Number.isFinite(n) ? fmtIntSpaces(n) : "—";
  } catch {
    $("dash-unread").textContent = "—";
  }
}

/* =========================
   INTERACTIONS
   ========================= */
function initCopyId() {
  const btn = $("dash-copy-id");
  if (!btn) return;

  const originalHtml = btn.innerHTML;

  btn.addEventListener("click", async () => {
    const uid = state.userId;
    if (!uid) return;

    try {
      await navigator.clipboard.writeText(String(uid));
    } catch {
      const ta = document.createElement("textarea");
      ta.value = String(uid);
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }

    btn.disabled = true;
    btn.innerHTML = `
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
      </svg>
      ${t("actions.copied", "Copied!")}
    `;
    pulseOnce(btn);

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
    }, 900);
  });
}

function initRankcardOpen() {
  const go = () => (window.location.href = "/rank_card");
  $("dash-open-rankcard")?.addEventListener("click", go);
  $("dash-username")?.addEventListener("click", go);
}

/* =========================
   REFRESH
   ========================= */
async function refreshAll() {
  await Promise.allSettled([
    loadHeader(),
    loadRewardsSummary(),
    loadPurchases(),
    loadRecentSubmissions(),
    loadWeeklyShop(),
    loadKeyShop(),
    loadLootboxesPanel(),
    loadQuestsPanel(),
    loadUnread(),
  ]);
}

/* =========================
   BOOT
   ========================= */
document.addEventListener("DOMContentLoaded", async () => {
  state.userId = getUserId();

  if (!state.userId) {
    $("dash-username").textContent = t("errors.login_required", "Login required");
    return;
  }

  ensureXpBarSmooth();
  initCustomDropdowns();

  renderRows($("dash-purchases"), 4);
  renderCards($("dash-recent-rewards"), 4);
  renderRows($("dash-purchases-full"), 6);
  renderCards($("dash-rotation"), 6);
  renderRows($("dash-weekly-quests"), 5);
  renderRows($("dash-quest-history"), 5);
  renderSubmissionRows($("dash-recent-submissions"), 6);

  const saved = localStorage.getItem("gp_dashboard_tab") || "overview";
  setTabActive(saved);

  document.querySelectorAll(".dash-tab").forEach((b) => {
    b.addEventListener("click", () => {
      const name = b.dataset.tab || "overview";
      localStorage.setItem("gp_dashboard_tab", name);
      setTabActive(name);

      if (name === "lootboxes") loadLootboxesPanel();
      if (name === "keyshop") loadKeyShop();
      if (name === "weekly") loadWeeklyShop();
      if (name === "quests") loadQuestsPanel();
    });
  });

  initCopyId();
  initRankcardOpen();

  __setXpBarInstant(0);

  $("dash-refresh")?.addEventListener("click", async () => {
    const btn = $("dash-refresh");
    if (!btn) return;

    btn.disabled = true;
    btn.classList.add("opacity-70", "cursor-not-allowed");

    const old = btn.innerHTML;
    btn.innerHTML = `
      <span class="inline-flex items-center gap-2">
        <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2z"/>
        </svg>
        ${t("actions.refreshing", "Refreshing…")}
      </span>
    `;

    try {
      await refreshAll();
    } finally {
      btn.disabled = false;
      btn.classList.remove("opacity-70", "cursor-not-allowed");
      btn.innerHTML = old;
    }
  });

  $("dash-refresh-submissions")?.addEventListener("click", async () => {
    const btn = $("dash-refresh-submissions");
    if (!btn) return;

    btn.disabled = true;
    btn.classList.add("opacity-70", "cursor-not-allowed");
    const old = btn.textContent;
    btn.textContent = t("actions.refreshing", "Refreshing…");

    try {
      await loadRecentSubmissions();
    } finally {
      btn.disabled = false;
      btn.classList.remove("opacity-70", "cursor-not-allowed");
      btn.textContent = old || t("actions.refresh", "Refresh");
    }
  });

  await refreshAll();
});