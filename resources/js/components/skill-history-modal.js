import { cdnAsset } from "../utils/cdn";

const RANGES = [
  ["7d", "7D"],
  ["30d", "30D"],
  ["90d", "90D"],
  ["1y", "1Y"],
  ["all", "ALL"],
];

const TIER_NAMES = [
  "Unranked",
  "Bronze",
  "Silver",
  "Gold",
  "Emerald",
  "Diamond",
  "Ascendant",
  "Elite",
  "Champion",
];

const RANK_COLORS = {
  god: "#991b1b",
  grandmaster: "#ef4444",
  master: "#ea580c",
  ninja: "#16a34a",
  jumper: "#22c55e",
  skilled: "#ca8a04",
  pro: "#f97316",
  ronin: "#10b981",
};

const DATE_FIELDS = [
  "date",
  "captured_at",
  "created_at",
  "computed_at",
  "recorded_at",
  "changed_at",
  "effective_at",
  "updated_at",
  "timestamp",
];
const SCORE_FIELDS = [
  "skill_score",
  "new_skill_score",
  "score",
  "new_score",
  "current_score",
  "current",
  "score_after",
  "after_score",
  "after",
  "value",
  "value_after",
];
const PREVIOUS_SCORE_FIELDS = [
  "previous_score",
  "previous_skill_score",
  "prev_score",
  "old_score",
  "old_skill_score",
  "score_before",
  "before_score",
  "before",
];
const DELTA_FIELDS = ["delta", "change", "score_delta", "score_change", "diff", "difference"];
const HOUR_MS = 60 * 60 * 1000;
const MAX_CHART_MARKERS = 5;
const TEMP_SKILL_HISTORY_JSON_URL = ""; // Set a JSON URL here only when a temporary fixture is needed.

let modalEl = null;
let requestToken = 0;
let avatarToken = 0;
const boundRoots = new WeakSet();

const state = {
  open: false,
  loading: false,
  error: "",
  range: "7d",
  context: {},
  normalized: null,
  summary: null,
  tiers: null,
  changes: [],
  detailCache: new Map(),
  detailLoadingId: "",
  avatarUrl: "",
  avatarLoading: false,
  selectedChangeIndex: 0,
  changeListScrollTop: 0,
  resetChangeListScroll: false,
};

function t(path, fallback = "", params = {}) {
  const catalog = typeof window !== "undefined" && window.SKILL_HISTORY_I18N && typeof window.SKILL_HISTORY_I18N === "object"
    ? window.SKILL_HISTORY_I18N
    : {};
  const value = String(path || "")
    .split(".")
    .filter(Boolean)
    .reduce((current, key) => (current && typeof current === "object" ? current[key] : undefined), catalog);
  const template = typeof value === "string" ? value : fallback;

  return String(template ?? "").replace(/:([A-Za-z0-9_]+)/g, (match, key) => {
    const replacement = params[key];
    return replacement === undefined || replacement === null ? match : String(replacement);
  });
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function finiteNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\s+/g, "").replace(",", ".");
  if (!normalized) return null;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatScore(value, maximumFractionDigits = 1) {
  const number = finiteNumber(value);
  if (number === null) return "0";
  return number.toLocaleString(undefined, {
    minimumFractionDigits: number % 1 === 0 ? 0 : Math.min(1, maximumFractionDigits),
    maximumFractionDigits,
  });
}

function formatSigned(value, maximumFractionDigits = 1) {
  const number = finiteNumber(value) ?? 0;
  const sign = number > 0 ? "+" : "";
  return `${sign}${formatScore(number, maximumFractionDigits)}`;
}

function formatPercent(value) {
  const number = finiteNumber(value);
  if (number === null) return "0%";
  return `${number > 0 ? "+" : ""}${number.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

function formatDate(value) {
  const date = value instanceof Date ? value : parseDate(value);
  if (!date) return "-";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
}

function formatAxisDate(value, start, end) {
  const date = value instanceof Date ? value : parseDate(value);
  if (!date) return "-";
  const spanDays = Math.max(0, (end - start) / 864e5);

  if (spanDays <= 2) {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
    }).format(date);
  }

  return formatDate(date);
}

function formatShortDateTime(value) {
  const date = value instanceof Date ? value : parseDate(value);
  if (!date) return "-";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDateTime(value) {
  const date = value instanceof Date ? value : parseDate(value);
  if (!date) return "-";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function parseDate(value) {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value;
  if (typeof value === "number" && Number.isFinite(value)) {
    const date = new Date(value > 10_000_000_000 ? value : value * 1000);
    return Number.isFinite(date.getTime()) ? date : null;
  }
  if (typeof value !== "string" || value.trim() === "") return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}

function defaultDiscordAvatarFromId(userId) {
  const digits = String(userId || "").replace(/\D+/g, "");
  if (!digits) return "https://cdn.discordapp.com/embed/avatars/0.png?size=128";
  try {
    if (typeof BigInt !== "undefined") {
      return `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(digits) >> 22n) % 5n)}.png?size=128`;
    }
  } catch {}
  return `https://cdn.discordapp.com/embed/avatars/${Number(digits.slice(-1)) % 5}.png?size=128`;
}

function ensureAvatarSize(url, size = 128) {
  const value = String(url || "").trim();
  if (!value) return "";
  if (!/cdn\.discordapp\.com/i.test(value)) return value;
  if (/\.gif($|\?)/i.test(value)) return value;
  return value.includes("?") ? `${value}&size=${size}` : `${value}?size=${size}`;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    credentials: "same-origin",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { message: text };
  }
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || `HTTP ${response.status}`);
  }
  return payload;
}

function pick(object, keys) {
  if (!object || typeof object !== "object") return undefined;
  for (const key of keys) {
    const value = object[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    if (Array.isArray(value.data)) return value.data;
    if (Array.isArray(value.items)) return value.items;
    if (Array.isArray(value.rows)) return value.rows;
  }
  return null;
}

function firstArray(...values) {
  for (const value of values) {
    const array = asArray(value);
    if (array) return array;
  }
  return [];
}

function unwrapPayload(payload) {
  if (payload && typeof payload === "object" && payload.data && !Array.isArray(payload.data)) {
    return payload.data;
  }
  return payload;
}

function normalizeTierNumber(summary = {}, context = {}) {
  const supplied = finiteNumber(summary.skill_tier ?? summary.tier ?? context.skillTier);
  if (supplied !== null && Number.isInteger(supplied) && supplied >= 0 && supplied < TIER_NAMES.length) {
    return supplied;
  }

  const tierName = normalizeTierName(summary.skill_tier_name ?? context.skillTierName, context.skillTier);
  const index = TIER_NAMES.findIndex((name) => name.toLowerCase() === tierName.toLowerCase());
  return index >= 0 ? index : 0;
}

function tierBoundaries() {
  const body = unwrapPayload(state.tiers) ?? {};
  const raw = Array.isArray(body.boundaries)
    ? body.boundaries
    : Array.isArray(body.tier_boundaries)
      ? body.tier_boundaries
      : [];
  const boundaries = raw.map(finiteNumber).filter((value) => value !== null);
  return boundaries.length >= 7 ? boundaries.slice(0, 7) : null;
}

function tierProgress(score, tierNumber) {
  const boundaries = tierBoundaries();
  const numericScore = finiteNumber(score);
  if (numericScore === null || !boundaries) return null;
  if (!Number.isInteger(tierNumber) || tierNumber <= 0) {
      return {
        status: "unranked",
        percent: 0,
        label: "Unranked",
      caption: t("unlock_tiers", "Complete eligible runs to unlock Skill tiers."),
    };
  }
  if (tierNumber >= 8) {
    return {
      status: "champion",
      percent: 100,
      label: "Champion",
      caption: t("champion_reached", "Champion tier reached."),
    };
  }

  const currentStart = tierNumber <= 1 ? 0 : boundaries[tierNumber - 2];
  const nextStart = boundaries[tierNumber - 1];
  if (!Number.isFinite(currentStart) || !Number.isFinite(nextStart) || nextStart <= currentStart) return null;

  const percent = clamp(((numericScore - currentStart) / (nextStart - currentStart)) * 100, 0, 100);
  return {
    status: "ranked",
    percent,
    label: TIER_NAMES[tierNumber],
    nextLabel: TIER_NAMES[tierNumber + 1],
    currentStart,
    nextStart,
    caption: t("to_next_tier", ":score / :next to :tier", {
      score: formatScore(numericScore, 0),
      next: formatScore(nextStart, 0),
      tier: TIER_NAMES[tierNumber + 1],
    }),
  };
}

function truncateText(value, maxLength = 26) {
  const text = String(value || "").trim();
  return text.length > maxLength ? `${text.slice(0, Math.max(0, maxLength - 1))}…` : text;
}

function truncateTextAscii(value, maxLength = 26) {
  const text = String(value || "").trim();
  return text.length > maxLength ? `${text.slice(0, Math.max(0, maxLength - 3))}...` : text;
}

function formatTag(value) {
  return String(value || "").trim().replaceAll("_", " ");
}

function splitMarkerText(value, firstLineLength = 19, secondLineLength = 18) {
  const text = String(value || "").trim().replace(/\s+/g, " ");
  if (!text) return [t("score_update", "Skill score update"), ""];
  if (text.length <= firstLineLength) return [text, ""];

  const firstBreak = text.lastIndexOf(" ", firstLineLength);
  const firstEnd = firstBreak > 8 ? firstBreak : firstLineLength;
  const first = text.slice(0, firstEnd).trim();
  const rest = text.slice(firstEnd).trim();
  const second = truncateTextAscii(rest, secondLineLength);
  return [first, second];
}

function normalizeTierName(value, tier) {
  const supplied = String(value ?? "").trim();
  const matched = TIER_NAMES.find((name) => name.toLowerCase() === supplied.toLowerCase());
  if (matched) return matched;

  const number = finiteNumber(tier);
  if (number !== null && Number.isInteger(number) && number >= 0 && number < TIER_NAMES.length) {
    return TIER_NAMES[number];
  }

  return "Unranked";
}

function hexToRgb(hex) {
  const value = String(hex || "").replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(value)) return null;
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbaFromHex(hex, alpha) {
  const rgb = hexToRgb(hex);
  if (!rgb) return "";
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
}

function rankColor(rankName) {
  const value = String(rankName || "").trim().toLowerCase();
  if (!value) return "";

  for (const [key, color] of Object.entries(RANK_COLORS)) {
    if (value === key || value.includes(key)) return color;
  }

  return "";
}

function rankColorVars(rankName) {
  const color = rankColor(rankName);
  if (!color) return "";
  return [
    `--skill-history-rank-color:${color}`,
    `--skill-history-rank-bg:${rgbaFromHex(color, 0.14)}`,
    `--skill-history-rank-border:${rgbaFromHex(color, 0.38)}`,
  ].join(";");
}

function normalizePayload(payload, context = {}) {
  const body = unwrapPayload(payload) ?? {};
  const history = firstArray(
    body.history,
    body.points,
    body.timeline,
    body.series,
    body.entries,
    body.snapshots,
    body.skill_history,
    body.scores,
    body.rows,
    body.results,
    body.data,
    Array.isArray(body) ? body : null
  );
  const changes = firstArray(
    body.changes,
    body.events,
    body.recent_changes,
    body.recent,
    body.items,
    body.feed,
    body.rows,
    body.results,
    body.data,
    history
  );

  const player = body.player || body.user || body.profile || {};
  const summary = body.summary || body.stats || body.aggregate || {};
  const rows = history.length ? history : changes;
  const events = rows
    .map((row, index) => normalizeEvent(row, index))
    .filter((event) => event.date && event.score !== null)
    .sort((a, b) => a.date - b.date);

  const changeEvents = (changes.length ? changes : rows)
    .map((row, index) => normalizeEvent(row, index))
    .filter((event) => event.date)
    .sort((a, b) => b.date - a.date);

  const contextTier = normalizeTierName(context.skillTierName, context.skillTier);
  const tierName = normalizeTierName(
    body.skill_tier_name ?? player.skill_tier_name ?? summary.skill_tier_name ?? contextTier,
    body.skill_tier ?? body.tier ?? player.skill_tier ?? summary.skill_tier ?? context.skillTier
  );

  return {
    body,
    player,
    summary,
    events,
    changes: changeEvents,
    tierName,
  };
}

function normalizeEvent(row, index) {
  const source = row && typeof row === "object" ? row : { value: row };
  const date = parseDate(pick(source, DATE_FIELDS));
  let score = finiteNumber(pick(source, SCORE_FIELDS));
  const previousScore = finiteNumber(pick(source, PREVIOUS_SCORE_FIELDS));
  let delta = finiteNumber(pick(source, DELTA_FIELDS));

  if (score === null && previousScore !== null && delta !== null) {
    score = previousScore + delta;
  }
  if (delta === null && score !== null && previousScore !== null) {
    delta = score - previousScore;
  }

  const reason =
    source.reason ||
    source.title ||
    source.label ||
    source.description ||
    source.event ||
    source.type ||
    t("score_update", "Skill score update");
  const tag = source.category || source.source || source.kind || source.type || "";

  return {
    id: source.id ?? source.history_id ?? index,
    index,
    date,
    score,
    previousScore,
    delta,
    reason: String(reason),
    tag: String(tag || ""),
    raw: source,
    causes: normalizeCauses(source),
  };
}

function scoreFromChangeParts(score, previousScore, delta) {
  const direct = finiteNumber(score);
  if (direct !== null) return direct;
  const previous = finiteNumber(previousScore);
  const change = finiteNumber(delta);
  return previous !== null && change !== null ? previous + change : null;
}

function normalizeChangeFeed(payload) {
  const body = unwrapPayload(payload) ?? {};
  const rows = firstArray(
    Array.isArray(body) ? body : null,
    body.changes,
    body.items,
    body.rows,
    body.data
  );

  return rows
    .map((row, index) => normalizeChange(row, index))
    .filter((change) => change.date)
    .sort((a, b) => b.date - a.date);
}

function normalizeChange(row, index) {
  const source = row && typeof row === "object" ? row : {};
  const delta = finiteNumber(pick(source, DELTA_FIELDS));
  const previousScore = finiteNumber(pick(source, PREVIOUS_SCORE_FIELDS));
  const score = scoreFromChangeParts(pick(source, SCORE_FIELDS), previousScore, delta);

  return {
    id: source.change_id ?? source.id ?? source.history_id ?? "",
    index,
    date: parseDate(pick(source, DATE_FIELDS)),
    score,
    previousScore,
    delta,
    percentChange: finiteNumber(source.percent_change),
    reason: String(source.description || source.reason || source.title || source.type || t("score_update", "Skill score update")),
    tag: String(source.cause_category || source.category || source.source || ""),
    raw: source,
    causes: normalizeCauses(source),
  };
}

function normalizeChangeDetail(payload) {
  const source = unwrapPayload(payload) ?? {};
  const delta = finiteNumber(pick(source, DELTA_FIELDS));
  const previousScore = finiteNumber(pick(source, PREVIOUS_SCORE_FIELDS));
  const score = scoreFromChangeParts(pick(source, SCORE_FIELDS), previousScore, delta);

  return {
    id: source.change_id ?? source.id ?? "",
    date: parseDate(pick(source, DATE_FIELDS)),
    previousScore,
    score,
    delta,
    percentChange: finiteNumber(source.percent_change),
    reason: String(source.description || source.reason || source.title || source.type || t("score_update", "Skill score update")),
    tag: String(source.cause_category || source.category || source.source || ""),
    causes: normalizeCauses(source),
    otherFactors: finiteNumber(source.other_factors),
    raw: source,
  };
}

function temporaryTiers(body) {
  if (body?.tiers) return unwrapPayload(body.tiers);
  if (Array.isArray(body?.boundaries)) return { boundaries: body.boundaries };
  if (Array.isArray(body?.tier_boundaries)) return { boundaries: body.tier_boundaries };
  return null;
}

function temporaryChangePayload(body) {
  if (Array.isArray(body?.changes)) return { changes: body.changes };
  if (Array.isArray(body?.history)) return { changes: body.history };
  if (Array.isArray(body?.points)) return { changes: body.points };
  return body;
}

function buildTemporaryDetailCache(changes, body = {}) {
  const detailSource = body.change_details || body.changeDetails || {};
  const detailRows = Array.isArray(detailSource)
    ? detailSource
    : detailSource && typeof detailSource === "object"
      ? Object.values(detailSource)
      : [];
  const detailCache = new Map();

  for (const change of changes) {
    const id = String(change.id || "");
    if (!id) continue;
    const detail =
      (!Array.isArray(detailSource) && detailSource && typeof detailSource === "object" ? detailSource[id] : null) ||
      detailRows.find((row) => String(row?.change_id ?? row?.id ?? row?.history_id ?? "") === id) ||
      change.raw ||
      change;

    detailCache.set(id, normalizeChangeDetail(detail));
  }

  return detailCache;
}

function applyTemporarySkillHistoryPayload(payload, userId) {
  const body = unwrapPayload(payload) ?? {};
  const summary = {
    ...(body.summary || body.stats || {}),
    user_id: userId,
  };
  const historyPayload = {
    ...body,
    user_id: userId,
    player: {
      ...(body.player || {}),
      user_id: userId,
    },
  };
  const nextChanges = normalizeChangeFeed(temporaryChangePayload(body));

  state.summary = summary;
  state.tiers = temporaryTiers(body);
  state.normalized = normalizePayload(historyPayload, state.context);
  state.changes = nextChanges;
  state.detailCache = buildTemporaryDetailCache(nextChanges, body);
  state.detailLoadingId = "";
  state.loading = false;
  state.error = "";
  renderContent();
}

function normalizeCauses(source) {
  const raw =
    source.causes ||
    source.main_causes ||
    source.details ||
    source.impacts ||
    source.factors ||
    [];
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object"
      ? Object.values(raw)
      : [];

  return list
    .map((cause) => {
      const item = cause && typeof cause === "object" ? cause : { reason: cause };
      const impact = finiteNumber(item.impact ?? item.delta ?? item.change ?? item.contribution);
      return {
        map: item.map_code || item.code || item.map || item.map_name || "-",
      reason: item.reason || item.title || item.label || item.type || t("other_factor", "Other factor"),
        impact,
      };
    })
    .filter((cause) => cause.reason || cause.map !== "-" || cause.impact !== null);
}

function rangeWindow(range, events) {
  const now = new Date();
  const latest = events.length ? events[events.length - 1].date : now;
  const end = latest > now ? latest : now;
  let start;

  if (range === "all") {
    start = events.length ? events[0].date : new Date(end.getTime() - 30 * 864e5);
  } else {
    const days = range === "7d" ? 7 : range === "90d" ? 90 : range === "1y" ? 365 : 30;
    start = new Date(end.getTime() - days * 864e5);
  }

  if (start >= end) start = new Date(end.getTime() - 864e5);
  return { start, end };
}

function buildSeries(events, range, contextScore) {
  const sorted = [...events].filter((event) => event.date && event.score !== null).sort((a, b) => a.date - b.date);
  const requested = rangeWindow(range, sorted);
  const inRange = sorted.filter((event) => event.date >= requested.start && event.date <= requested.end);
  const previous = [...sorted].reverse().find((event) => event.date < requested.start);
  const fallbackScore =
    previous?.score ??
    inRange[0]?.previousScore ??
    inRange[0]?.score ??
    sorted[sorted.length - 1]?.score ??
    finiteNumber(contextScore) ??
    0;
  const firstInRange = inRange[0] || null;
  const lastInRange = inRange[inRange.length - 1] || null;
  let start = previous ? requested.start : firstInRange?.date ?? requested.start;
  let end = lastInRange?.date ?? requested.end;

  if (start >= end) {
    start = new Date(end.getTime() - 864e5);
  }

  const anchors = [];
  const pushAnchor = (date, score, event = null) => {
    const safeScore = finiteNumber(score);
    if (!date || safeScore === null) return;
    const last = anchors[anchors.length - 1];
    if (last && last.date.getTime() === date.getTime()) {
      last.score = safeScore;
      if (event) last.event = event;
      return;
    }
    anchors.push({ date, score: safeScore, event });
  };

  pushAnchor(start, previous?.score ?? fallbackScore, null);
  for (const event of inRange) {
    pushAnchor(event.date, event.score, event);
  }

  pushAnchor(end, anchors[anchors.length - 1]?.score ?? fallbackScore, null);

  const series = anchors.length >= 2
    ? anchors
    : [
      { date: start, score: fallbackScore },
      { date: end, score: fallbackScore },
    ];
  return { series, markers: inRange, start, end, anchors };
}

function scoreAtDate(series, date) {
  const time = date instanceof Date ? date.getTime() : parseDate(date)?.getTime();
  if (!Number.isFinite(time) || !series.length) return 0;
  if (time <= series[0].date.getTime()) return series[0].score;

  for (let index = 1; index < series.length; index += 1) {
    const previous = series[index - 1];
    const next = series[index];
    const previousTime = previous.date.getTime();
    const nextTime = next.date.getTime();

    if (time <= nextTime) {
      if (nextTime <= previousTime) return next.score;
      const ratio = (time - previousTime) / (nextTime - previousTime);
      return previous.score + (next.score - previous.score) * ratio;
    }
  }

  return series[series.length - 1].score;
}

function scoreFromChartChange(change) {
  if (!change) return null;
  return scoreFromChangeParts(change.score, change.previousScore, change.delta);
}

function smoothPath(points) {
  if (!points.length) return "";
  if (points.length === 1) return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  const commands = [`M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`];
  for (let index = 0; index < points.length - 1; index += 1) {
    const p1 = points[index];
    const p2 = points[index + 1];
    const dx = Math.max(0, p2.x - p1.x);
    const c1x = p1.x + dx * 0.42;
    const c2x = p2.x - dx * 0.42;
    const c1y = p1.y;
    const c2y = p2.y;
    commands.push(
      `C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
    );
  }
  return commands.join(" ");
}

function areaPathFromLine(linePath, points, baseY) {
  if (!points.length || !linePath) return "";
  const first = points[0];
  const last = points[points.length - 1];
  return `${linePath} L ${last.x.toFixed(2)} ${baseY.toFixed(2)} L ${first.x.toFixed(2)} ${baseY.toFixed(2)} Z`;
}

function chartMarkers(events, start, end, scale, series) {
  const grouped = new Map();
  const startTime = start.getTime();
  const endTime = end.getTime();

  for (const event of events) {
    if (!event?.date) continue;
    const time = event.date.getTime();
    if (time < startTime || time > endTime) continue;
    const delta = finiteNumber(event.delta);
    if (delta === null || delta === 0) continue;
    const key = Math.floor(time / HOUR_MS) * HOUR_MS;
    const current = grouped.get(key) || {
      date: new Date(key),
      delta: 0,
      count: 0,
      reason: event.reason,
      score: null,
      positiveCount: 0,
      negativeCount: 0,
    };
    current.delta += delta;
    current.count += 1;
    current.reason = current.count > 1 ? `${current.count} changes` : event.reason;
    current.score = finiteNumber(event.score) ?? current.score;
    current.positiveCount += delta >= 0 ? 1 : 0;
    current.negativeCount += delta < 0 ? 1 : 0;
    grouped.set(key, current);
  }

  const candidates = [...grouped.values()]
    .map((marker) => {
      const score = marker.score ?? scoreAtDate(series, marker.date);
      return {
        ...marker,
        score,
        x: scale.x(marker.date),
        y: scale.y(score),
      };
    })
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta) || b.date - a.date);

  const selected = [];
  const minDistance = 105;
  for (const marker of candidates) {
    if (selected.some((item) => Math.abs(item.x - marker.x) < minDistance)) continue;
    selected.push(marker);
    if (selected.length >= MAX_CHART_MARKERS) break;
  }

  return selected.sort((a, b) => a.date - b.date);
}

function selectedChartMarker(change, start, end, scale, series) {
  if (!change?.date) return [];
  const time = change.date.getTime();
  if (time < start.getTime() || time > end.getTime()) return [];

  const delta = finiteNumber(change.delta) ?? 0;
  const score = scoreFromChartChange(change) ?? scoreAtDate(series, change.date);
  return [
    {
      ...change,
      date: change.date,
      delta,
      count: 1,
      reason: change.reason || t("score_update", "Skill score update"),
      score,
      x: scale.x(change.date),
      y: scale.y(score),
    },
  ];
}

function getChartScale(series, start, end, extraScores = []) {
  const scores = [
    ...series.map((point) => point.score),
    ...extraScores,
  ].filter((score) => Number.isFinite(score));
  let min = Math.min(...scores);
  let max = Math.max(...scores);
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    min = 0;
    max = 1;
  }
  if (min === max) {
    const pad = Math.max(5, Math.abs(max) * 0.03);
    min -= pad;
    max += pad;
  } else {
    const pad = Math.max(2, (max - min) * 0.12);
    min -= pad;
    max += pad;
  }

  const view = { width: 900, height: 300, left: 52, right: 18, top: 22, bottom: 36 };
  const plotWidth = view.width - view.left - view.right;
  const plotHeight = view.height - view.top - view.bottom;
  const span = Math.max(1, end - start);

  const x = (date) => view.left + ((date - start) / span) * plotWidth;
  const y = (score) => view.top + ((max - score) / (max - min)) * plotHeight;

  return { ...view, plotWidth, plotHeight, min, max, x, y, baseY: view.top + plotHeight };
}

function renderChart(normalized, context, selectedChange = null) {
  const contextScore = finiteNumber(state.summary?.skill_score) ?? context.skillScore;
  const { series, markers, start, end } = buildSeries(
    normalized.events,
    state.range,
    contextScore
  );
  const selectedScore = scoreFromChartChange(selectedChange);
  const scale = getChartScale(series, start, end, selectedScore === null ? [] : [selectedScore]);
  const plottedPoints = series.map((point) => ({
    x: scale.x(point.date),
    y: scale.y(point.score),
  }));
  const linePath = smoothPath(plottedPoints);
  const areaPath = areaPathFromLine(linePath, plottedPoints, scale.baseY);

  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    const value = scale.max - (scale.max - scale.min) * ratio;
    const y = scale.top + scale.plotHeight * ratio;
    return { value, y };
  });
  const xTicks = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    const date = new Date(start.getTime() + (end - start) * ratio);
    const x = scale.left + scale.plotWidth * ratio;
    return { date, x };
  });

  const markerSource = state.changes.length ? state.changes : markers;
  const activeMarkers = selectedChartMarker(selectedChange, start, end, scale, series);
  const chartMarkerItems = activeMarkers.length
    ? activeMarkers
    : chartMarkers(markerSource, start, end, scale, series);
  const markerHtml = chartMarkerItems
    .map((marker) => {
      const positive = (marker.delta ?? 0) >= 0;
      const labelWidth = 210;
      const labelHeight = 76;
      const preferLeft = marker.x > scale.left + scale.plotWidth * 0.62;
      const placeBelow = marker.y < scale.top + labelHeight + 10;
      const wantedLabelX = preferLeft ? marker.x - labelWidth - 26 : marker.x + 26;
      const wantedLabelY = placeBelow ? marker.y + 4 : marker.y - labelHeight - 46;
      const labelX = clamp(wantedLabelX, scale.left + 8, scale.width - scale.right - labelWidth - 8);
      const labelY = clamp(wantedLabelY, scale.top + 8, scale.baseY - labelHeight - 8);
      const anchorX = clamp(marker.x, labelX + 16, labelX + labelWidth - 16);
      const anchorY = labelY > marker.y ? labelY : labelY + labelHeight;
      const controlY = (marker.y + anchorY) / 2;
      const connectorPath = `M ${marker.x.toFixed(2)} ${marker.y.toFixed(2)} C ${marker.x.toFixed(2)} ${controlY.toFixed(2)} ${anchorX.toFixed(2)} ${controlY.toFixed(2)} ${anchorX.toFixed(2)} ${anchorY.toFixed(2)}`;
      const markerReason = marker.count > 1
        ? t("changes_in_hour", ":count changes in this hour", { count: marker.count })
        : marker.reason;
      const [reasonLine1, reasonLine2] = splitMarkerText(markerReason, 34, 32);
      const markerDate = formatDate(marker.date);
      return `
        <g class="skill-history-marker ${positive ? "is-positive" : "is-negative"}">
          <path class="skill-history-marker-line" d="${connectorPath}"></path>
          <circle class="skill-history-marker-halo" cx="${marker.x.toFixed(2)}" cy="${marker.y.toFixed(2)}" r="12"></circle>
          <rect class="skill-history-marker-card" x="${labelX.toFixed(2)}" y="${labelY.toFixed(2)}" width="${labelWidth}" height="${labelHeight}" rx="8"></rect>
          <rect class="skill-history-marker-accent" x="${labelX.toFixed(2)}" y="${labelY.toFixed(2)}" width="6" height="${labelHeight}" rx="3"></rect>
          <text class="skill-history-marker-label-delta" x="${(labelX + 18).toFixed(2)}" y="${(labelY + 25).toFixed(2)}">${esc(formatSigned(marker.delta))}</text>
          <text class="skill-history-marker-label-date" x="${(labelX + labelWidth - 15).toFixed(2)}" y="${(labelY + 25).toFixed(2)}">${esc(markerDate)}</text>
          <text class="skill-history-marker-label-reason" x="${(labelX + 18).toFixed(2)}" y="${(labelY + 49).toFixed(2)}">${esc(reasonLine1)}</text>
          ${reasonLine2 ? `<text class="skill-history-marker-label-reason is-second" x="${(labelX + 18).toFixed(2)}" y="${(labelY + 64).toFixed(2)}">${esc(reasonLine2)}</text>` : ""}
          <circle class="skill-history-marker-dot" cx="${marker.x.toFixed(2)}" cy="${marker.y.toFixed(2)}" r="7"></circle>
          <title>${esc(formatSigned(marker.delta))} - ${esc(marker.reason)}</title>
        </g>
      `;
    })
    .join("");

  const emptyText = normalized.events.length
    ? ""
    : `<div class="skill-history-chart-empty">${esc(t("no_history", "No skill history yet."))}</div>`;

  return `
    <div class="skill-history-chart">
      ${emptyText}
      <svg viewBox="0 0 ${scale.width} ${scale.height}" role="img" aria-label="${escAttr(t("chart_aria", "Skill score history chart"))}">
        <defs>
          <linearGradient id="skillHistoryAreaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="rgb(16, 185, 129)" stop-opacity=".48" />
            <stop offset="100%" stop-color="rgb(16, 185, 129)" stop-opacity=".04" />
          </linearGradient>
        </defs>
        ${yTicks
          .map((tick) => `
            <g class="skill-history-grid-line">
              <line x1="${scale.left}" y1="${tick.y.toFixed(2)}" x2="${scale.width - scale.right}" y2="${tick.y.toFixed(2)}"></line>
              <text x="${scale.left - 10}" y="${(tick.y + 4).toFixed(2)}">${esc(formatScore(tick.value, 0))}</text>
            </g>
          `)
          .join("")}
        <path class="skill-history-area" d="${areaPath}"></path>
        <path class="skill-history-line" d="${linePath}"></path>
        ${markerHtml}
        ${xTicks
          .map((tick) => `
            <text class="skill-history-x-label" x="${tick.x.toFixed(2)}" y="${scale.height - 8}">${esc(formatAxisDate(tick.date, start, end))}</text>
          `)
          .join("")}
      </svg>
    </div>
  `;
}

function computeStats(series, summary = {}) {
  const points = series.filter((point) => point.date && Number.isFinite(point.score));
  const scores = points.map((point) => point.score);
  const first = scores[0] ?? 0;
  const last = scores[scores.length - 1] ?? first;
  const delta = finiteNumber(summary.point_change ?? summary.delta ?? summary.change ?? summary.score_delta) ?? last - first;
  const pct = finiteNumber(summary.percent_change) ?? (first ? (delta / first) * 100 : 0);
  const bestPoint = points.reduce(
    (best, point) => (!best || point.score > best.score ? point : best),
    null
  );
  const lowestPoint = points.reduce(
    (lowest, point) => (!lowest || point.score < lowest.score ? point : lowest),
    null
  );
  const best = finiteNumber(summary.best?.score ?? summary.best ?? summary.max ?? summary.highest) ?? bestPoint?.score ?? last;
  const lowest = finiteNumber(summary.lowest?.score ?? summary.lowest ?? summary.min) ?? lowestPoint?.score ?? last;
  const bestDate = parseDate(
    summary.best && typeof summary.best === "object" ? pick(summary.best, DATE_FIELDS) : null
  ) ?? bestPoint?.date ?? null;
  const lowestDate = parseDate(
    summary.lowest && typeof summary.lowest === "object" ? pick(summary.lowest, DATE_FIELDS) : null
  ) ?? lowestPoint?.date ?? null;
  const average =
    finiteNumber(summary.average ?? summary.avg) ??
    (scores.length ? scores.reduce((total, score) => total + score, 0) / scores.length : last);

  return { first, last, delta, pct, best, bestDate, lowest, lowestDate, average };
}

function rangeLabel(range) {
  switch (range) {
    case "7d":
      return t("ranges.7d", "7 days");
    case "90d":
      return t("ranges.90d", "90 days");
    case "1y":
      return t("ranges.1y", "1 year");
    case "all":
      return t("ranges.all", "all time");
    default:
      return t("ranges.30d", "30 days");
  }
}

function renderSummary(normalized, context) {
  const contextScore = finiteNumber(state.summary?.skill_score) ?? context.skillScore;
  const { series } = buildSeries(normalized.events, state.range, contextScore);
  const stats = computeStats(series, normalized.summary);
  const positive = stats.delta >= 0;

  return `
    <aside class="skill-history-summary">
      <div class="skill-history-eyebrow">${esc(t("summary", "Summary (:range)", { range: rangeLabel(state.range) }))}</div>
      <div class="skill-history-summary-delta ${positive ? "is-positive" : "is-negative"}">
        ${esc(formatSigned(stats.delta))}
      </div>
      <div class="skill-history-summary-percent ${positive ? "is-positive" : "is-negative"}">
        (${esc(formatPercent(stats.pct))})
      </div>
      <dl>
        <div>
          <dt>${esc(t("best", "Best"))}</dt>
          <dd>
            <strong>${esc(formatScore(stats.best))}</strong>
            <span>${esc(formatDate(stats.bestDate))}</span>
          </dd>
        </div>
        <div>
          <dt>${esc(t("lowest", "Lowest"))}</dt>
          <dd>
            <strong>${esc(formatScore(stats.lowest))}</strong>
            <span>${esc(formatDate(stats.lowestDate))}</span>
          </dd>
        </div>
        <div>
          <dt>${esc(t("average", "Average"))}</dt>
          <dd><strong>${esc(formatScore(stats.average))}</strong></dd>
        </div>
      </dl>
    </aside>
  `;
}

function renderRecentChanges(changes) {
  if (!changes.length) {
    return `
      <div class="skill-history-empty-list">
        ${esc(t("no_recent_changes", "No recent skill score changes found for this range."))}
      </div>
    `;
  }

  return changes
    .slice(0, 10)
    .map((change, index) => {
      const positive = (change.delta ?? 0) >= 0;
      const active = index === state.selectedChangeIndex;
      return `
        <button type="button" class="skill-history-change ${active ? "is-active" : ""}" data-sh-change-index="${index}">
          <span class="skill-history-change-rail ${positive ? "is-positive" : "is-negative"}" aria-hidden="true">
            <span class="skill-history-change-icon ${positive ? "is-positive" : "is-negative"}">
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path fill="currentColor" d="${positive ? "M10 4.2 15.2 9.4l-1.4 1.4L11 8v7H9V8l-2.8 2.8-1.4-1.4L10 4.2Z" : "M9 5h2v7l2.8-2.8 1.4 1.4L10 15.8l-5.2-5.2 1.4-1.4L9 12V5Z"}"/>
              </svg>
            </span>
          </span>
          <span class="skill-history-change-main">
            <span class="skill-history-change-date">${esc(formatDateTime(change.date))}</span>
            <span class="skill-history-change-title">${esc(change.reason)}</span>
            ${change.tag ? `<span class="skill-history-change-tag">${esc(formatTag(change.tag))}</span>` : ""}
          </span>
          <span class="skill-history-change-delta ${positive ? "is-positive" : "is-negative"}">
            ${esc(formatSigned(change.delta))}
          </span>
        </button>
      `;
    })
    .join("");
}

function skeletonBlock(className = "") {
  return `<span class="skill-history-skeleton ${className}" aria-hidden="true"></span>`;
}

function renderDetailSkeleton() {
  return `
    <section class="skill-history-details">
      <div class="skill-history-section-head">
        <div class="skill-history-section-title">${esc(t("change_details", "Change details"))}</div>
      </div>
      <div class="skill-history-details-head">
        ${skeletonBlock("skill-history-skeleton-icon")}
        <div class="skill-history-skeleton-stack">
          ${skeletonBlock("skill-history-skeleton-line w-40")}
          ${skeletonBlock("skill-history-skeleton-line w-56")}
        </div>
      </div>
      <div class="skill-history-score-triplet">
        <div>
          ${skeletonBlock("skill-history-skeleton-line w-24")}
          ${skeletonBlock("skill-history-skeleton-line skill-history-skeleton-triplet-value")}
        </div>
        <div>
          ${skeletonBlock("skill-history-skeleton-line w-20")}
          ${skeletonBlock("skill-history-skeleton-line skill-history-skeleton-triplet-value")}
        </div>
        <div>
          ${skeletonBlock("skill-history-skeleton-line w-16")}
          ${skeletonBlock("skill-history-skeleton-line skill-history-skeleton-triplet-value")}
        </div>
      </div>
      <div class="skill-history-causes">
        <div class="skill-history-causes-head">
          <span>${esc(t("map", "Map"))}</span>
          <span>${esc(t("reason", "Reason"))}</span>
          <span>${esc(t("impact", "Impact"))}</span>
        </div>
        ${Array.from({ length: 5 }, () => `
          <div class="skill-history-cause-row">
            <span>${skeletonBlock("skill-history-skeleton-line w-16")}</span>
            <span>${skeletonBlock("skill-history-skeleton-line w-full")}</span>
            <strong>${skeletonBlock("skill-history-skeleton-line w-12")}</strong>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderFullSkeleton() {
  return `
    <div class="skill-history-modal__layout">
      <aside class="skill-history-sidebar">
        ${skeletonBlock("skill-history-skeleton-avatar")}
        <div class="skill-history-player-name">
          ${skeletonBlock("skill-history-skeleton-line skill-history-skeleton-name")}
        </div>
        <div class="skill-history-player-rank skill-history-player-rank-skeleton">
          ${skeletonBlock("skill-history-skeleton-line skill-history-skeleton-rank")}
        </div>
        <div class="skill-history-current-card skill-history-current-card-skeleton">
          <div class="skill-history-eyebrow">
            ${skeletonBlock("skill-history-skeleton-line skill-history-skeleton-current-eyebrow")}
          </div>
          <div class="skill-history-current-topline">
            ${skeletonBlock("skill-history-skeleton-rank-icon")}
            <div>
              <div class="skill-history-current-score">
                ${skeletonBlock("skill-history-skeleton-current-score")}
              </div>
              <div class="skill-history-tier-line">
                ${skeletonBlock("skill-history-skeleton-line skill-history-skeleton-current-tier")}
              </div>
            </div>
          </div>
          <div class="skill-history-current-meta">
            ${skeletonBlock("skill-history-skeleton-line skill-history-skeleton-current-delta")}
            ${skeletonBlock("skill-history-skeleton-line skill-history-skeleton-current-percent")}
          </div>
          <div class="skill-history-updated">
            ${skeletonBlock("skill-history-skeleton-line skill-history-skeleton-current-updated")}
          </div>
          <div class="skill-history-rank-progress">
            <div class="skill-history-rank-labels">
              <span>${skeletonBlock("skill-history-skeleton-line skill-history-skeleton-rank-label")}</span>
              <span>${skeletonBlock("skill-history-skeleton-line skill-history-skeleton-rank-label")}</span>
            </div>
            <div class="skill-history-rank-track">
              ${skeletonBlock("skill-history-skeleton-rank-fill")}
            </div>
            <div class="skill-history-rank-caption">
              ${skeletonBlock("skill-history-skeleton-line skill-history-skeleton-rank-caption")}
            </div>
          </div>
        </div>
        <div class="skill-history-sidebar-stats">
          ${Array.from({ length: 3 }, () => `
            <div>
              ${skeletonBlock("skill-history-skeleton-line w-24")}
              ${skeletonBlock("skill-history-skeleton-line w-12")}
            </div>
          `).join("")}
        </div>
        <div class="skill-history-fluid-note">
          <span aria-hidden="true">i</span>
          <p>${esc(t("fluid_note", "The skill score is dynamic and can change with every submission, new map, or recalculation."))}</p>
        </div>
      </aside>
      <section class="skill-history-main">
        <div class="skill-history-main-card">
          <div class="skill-history-card-head">
            <div class="skill-history-title">${esc(t("title", "Skill score history"))}</div>
            <div class="skill-history-ranges">${renderRanges()}</div>
          </div>
          <div class="skill-history-chart-grid">
            <div class="skill-history-chart skill-history-chart-skeleton">
              ${skeletonBlock("skill-history-skeleton-chart")}
            </div>
            <aside class="skill-history-summary skill-history-summary-skeleton">
              ${skeletonBlock("skill-history-skeleton-line w-24")}
              ${skeletonBlock("skill-history-skeleton-score")}
              ${skeletonBlock("skill-history-skeleton-line w-20")}
              <dl>
                ${Array.from({ length: 3 }, () => `
                  <div>
                    <dt>${skeletonBlock("skill-history-skeleton-line w-12")}</dt>
                    <dd>
                      ${skeletonBlock("skill-history-skeleton-line skill-history-skeleton-summary-score")}
                      ${skeletonBlock("skill-history-skeleton-line skill-history-skeleton-summary-date")}
                    </dd>
                  </div>
                `).join("")}
              </dl>
            </aside>
          </div>
        </div>
        <div class="skill-history-bottom-grid">
          <section class="skill-history-recent">
            <div class="skill-history-section-title">${esc(t("recent_changes", "Recent changes"))}</div>
            <div class="skill-history-change-list">
              ${Array.from({ length: 4 }, () => `
                <div class="skill-history-change">
                  <span class="skill-history-change-rail" aria-hidden="true">
                    ${skeletonBlock("skill-history-skeleton-icon")}
                  </span>
                  <span class="skill-history-change-main">
                    ${skeletonBlock("skill-history-skeleton-line w-full")}
                    ${skeletonBlock("skill-history-skeleton-line skill-history-skeleton-change-title")}
                    ${skeletonBlock("skill-history-skeleton-line skill-history-skeleton-change-tag")}
                  </span>
                  ${skeletonBlock("skill-history-skeleton-line w-12")}
                </div>
              `).join("")}
            </div>
          </section>
          ${renderDetailSkeleton()}
        </div>
      </section>
    </div>
  `;
}

function renderChangeDetails(changes) {
  const change = changes[state.selectedChangeIndex] || changes[0] || null;
  if (!change) {
    return `
      <section class="skill-history-details">
        <div class="skill-history-section-head">
          <div class="skill-history-section-title">${esc(t("change_details", "Change details"))}</div>
        </div>
        <div class="skill-history-empty-list">${esc(t("select_change", "Select a change to inspect its impact."))}</div>
      </section>
    `;
  }

  const detailKey = String(change.id || "");
  if (detailKey && state.detailLoadingId === detailKey && !state.detailCache.has(detailKey)) {
    return renderDetailSkeleton();
  }

  const detail = detailKey ? state.detailCache.get(detailKey) : null;
  const source = detail || change;
  const positive = (source.delta ?? 0) >= 0;
  const previous = source.previousScore ?? (source.score !== null && source.delta !== null ? source.score - source.delta : null);
  const sourceCauses = Array.isArray(source.causes) ? source.causes : [];
  const causes = sourceCauses.length
    ? sourceCauses
    : [{
      map: source.raw?.map_code || source.raw?.code || source.raw?.map_name || "-",
      reason: source.reason,
      impact: source.delta,
    }];
  const otherFactors = finiteNumber(detail?.otherFactors);

  return `
    <section class="skill-history-details">
      <div class="skill-history-section-head">
        <div class="skill-history-section-title">${esc(t("change_details", "Change details"))}</div>
      </div>
      <div class="skill-history-details-head">
        <span class="skill-history-change-icon ${positive ? "is-positive" : "is-negative"}" aria-hidden="true">
          ${positive ? "&uarr;" : "&darr;"}
        </span>
        <div>
          <div class="skill-history-details-date">${esc(formatDateTime(source.date || change.date))}</div>
          <div class="skill-history-details-reason">${esc(source.reason || change.reason)}</div>
        </div>
      </div>
      <div class="skill-history-score-triplet">
        <div>
          <span>${esc(t("previous_score", "Previous score"))}</span>
          <strong>${previous === null ? "-" : esc(formatScore(previous))}</strong>
        </div>
        <div>
          <span>${esc(t("new_score", "New score"))}</span>
          <strong>${source.score === null ? "-" : esc(formatScore(source.score))}</strong>
        </div>
        <div>
          <span>${esc(t("change", "Change"))}</span>
          <strong class="${positive ? "is-positive" : "is-negative"}">${esc(formatSigned(source.delta))}</strong>
        </div>
      </div>
      <div class="skill-history-causes">
        <div class="skill-history-causes-head">
          <span>${esc(t("map", "Map"))}</span>
          <span>${esc(t("reason", "Reason"))}</span>
          <span>${esc(t("impact", "Impact"))}</span>
        </div>
        ${causes
          .slice(0, 5)
          .map((cause) => `
            <div class="skill-history-cause-row">
              <span>${esc(cause.map)}</span>
              <span>${esc(cause.reason)}</span>
              <strong class="${(cause.impact ?? 0) >= 0 ? "is-positive" : "is-negative"}">${cause.impact === null ? "-" : esc(formatSigned(cause.impact))}</strong>
            </div>
          `)
          .join("")}
        ${otherFactors !== null ? `
          <div class="skill-history-cause-row">
            <span>-</span>
            <span>${esc(t("other_factors", "Other factors"))}</span>
            <strong class="${otherFactors >= 0 ? "is-positive" : "is-negative"}">${esc(formatSigned(otherFactors))}</strong>
          </div>
        ` : ""}
      </div>
      <p class="skill-history-detail-note">${esc(t("detail_note", "Values may change after future recalculations."))}</p>
    </section>
  `;
}

function sidebarStatIcon(type) {
  const icons = {
    maps: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 5.5 9 3l6 2.5L20 3v15.5L15 21l-6-2.5L4 21V5.5Zm5-.35v11.2l6 2.5V7.65l-6-2.5Z"/></svg>`,
    video: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 5.5h10.5A2.5 2.5 0 0 1 18 8v.95l3-1.7v9.5l-3-1.7V16a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 16V8A2.5 2.5 0 0 1 5 5.5Zm3.2 3.15v6.7l5.45-3.35L8.2 8.65Z"/></svg>`,
    raw: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3a9 9 0 0 1 9 9c0 2.2-.8 4.2-2.1 5.75l-1.42-1.42A6.96 6.96 0 0 0 19 12a7 7 0 0 0-14 0c0 1.65.57 3.16 1.52 4.35L5.1 17.77A8.96 8.96 0 0 1 3 12a9 9 0 0 1 9-9Zm4.95 5.64-3.5 6.07a2 2 0 1 1-1.73-1l3.5-6.07 1.73 1Z"/></svg>`,
  };
  return icons[type] || "";
}

function renderTierProgress(score, tierNumber) {
  const progress = tierProgress(score, tierNumber);
  if (!progress) {
    return `
      <div class="skill-history-rank-progress is-muted">
        <div class="skill-history-rank-caption">${esc(t("tier_progress_unavailable", "Skill tier progress unavailable."))}</div>
      </div>
    `;
  }

  if (progress.status === "unranked") {
    return `
      <div class="skill-history-rank-progress is-muted">
        <div class="skill-history-rank-caption">${esc(progress.caption)}</div>
      </div>
    `;
  }

  return `
    <div class="skill-history-rank-progress">
      <div class="skill-history-rank-labels">
        <span>${esc(progress.label)}</span>
        <span>${esc(progress.nextLabel || progress.label)}</span>
      </div>
      <div class="skill-history-rank-track" aria-hidden="true">
        <span style="width:${clamp(progress.percent, 0, 100).toFixed(2)}%"></span>
      </div>
      <div class="skill-history-rank-caption">${esc(progress.caption)}</div>
    </div>
  `;
}

function renderSidebar(normalized, context) {
  const player = normalized?.player || {};
  const summary = state.summary || {};
  const name = context.name || player.nickname || player.name || player.username || t("player", "Player");
  const userId = context.userId || player.user_id || "";
  const avatar = state.avatarUrl || context.avatar || player.discord_avatar_url || defaultDiscordAvatarFromId(userId);
  const tierName = normalizeTierName(
    summary.skill_tier_name ?? normalized?.tierName ?? context.skillTierName,
    summary.skill_tier ?? summary.tier ?? context.skillTier
  );
  const score =
    finiteNumber(summary.skill_score) ??
    normalized?.events?.[normalized.events.length - 1]?.score ??
    finiteNumber(context.skillScore) ??
    finiteNumber(normalized?.summary?.skill_score) ??
    0;
  const { series } = buildSeries(normalized?.events || [], state.range, score);
  const statsForRange = computeStats(series, normalized?.summary || {});
  const scoreDeltaPositive = statsForRange.delta >= 0;
  const latestDate =
    normalized?.events?.[normalized.events.length - 1]?.date ??
    state.changes?.[0]?.date ??
    null;
  const tierNumber = normalizeTierNumber(summary, context);
  const rankName = context.rankName || summary.skill_rank || "";
  const rankStyle = rankColorVars(rankName);
  const stats = [
    { type: "maps", label: t("maps_cleared", "Maps cleared"), value: summary.maps_cleared },
    { type: "video", label: t("video_clears", "Video clears"), value: summary.video_clears },
    { type: "raw", label: t("hardest_raw", "Hardest raw"), value: summary.hardest_raw },
  ].filter((item) => finiteNumber(item.value) !== null);

  return `
    <aside class="skill-history-sidebar">
      <div class="skill-history-avatar">
        ${
          avatar
            ? `<img src="${escAttr(avatar)}" alt="" loading="lazy" decoding="async">`
            : `<span>${esc(String(name).trim().charAt(0) || "?")}</span>`
        }
      </div>
      <div class="skill-history-player-name">${esc(name)}</div>
      ${rankName ? `<div class="skill-history-player-rank"${rankStyle ? ` style="${escAttr(rankStyle)}"` : ""}>${esc(rankName)}</div>` : ""}

      <div class="skill-history-current-card">
        <div class="skill-history-eyebrow">${esc(t("skill_score", "Skill score"))}</div>
        <div class="skill-history-current-topline">
          <img src="${escAttr(cdnAsset(`assets/skill/rank-icons/${tierName}.png`))}" alt="" loading="lazy" decoding="async">
          <div>
            <div class="skill-history-current-score">${esc(formatScore(score, 2))}</div>
            <div class="skill-history-tier-line">${esc(tierName)}</div>
          </div>
        </div>
        <div class="skill-history-current-meta">
          <span class="${scoreDeltaPositive ? "is-positive" : "is-negative"}">${esc(formatSigned(statsForRange.delta))}</span>
          <span class="${scoreDeltaPositive ? "is-positive" : "is-negative"}">(${esc(formatPercent(statsForRange.pct))})</span>
        </div>
        ${latestDate ? `<div class="skill-history-updated">${esc(t("updated", "Updated :date", { date: formatShortDateTime(latestDate) }))}</div>` : ""}
        ${renderTierProgress(score, tierNumber)}
      </div>

      ${stats.length ? `
        <div class="skill-history-sidebar-stats">
          ${stats.map(({ type, label, value }) => `
            <div>
              <span class="skill-history-stat-label">${sidebarStatIcon(type)}<span>${esc(label)}</span></span>
              <strong>${esc(formatScore(value, 0))}</strong>
            </div>
          `).join("")}
        </div>
      ` : ""}

      <div class="skill-history-fluid-note">
        <span aria-hidden="true">i</span>
        <p>${esc(t("fluid_note", "The skill score is dynamic and can change with every submission, new map, or recalculation."))}</p>
      </div>
    </aside>
  `;
}

function renderRanges() {
  return RANGES
    .map(([value, label]) => `
      <button type="button" class="${state.range === value ? "is-active" : ""}" data-sh-range="${value}">
        ${label}
      </button>
    `)
    .join("");
}

function renderLoading() {
  return renderFullSkeleton();
}

function renderError() {
  return `
    <div class="skill-history-modal__layout">
      ${renderSidebar({ player: {}, summary: {}, events: [], changes: [], tierName: normalizeTierName(state.context.skillTierName, state.context.skillTier) }, state.context)}
      <section class="skill-history-main">
        <div class="skill-history-main-card">
          <div class="skill-history-card-head">
            <div class="skill-history-title">${esc(t("title", "Skill score history"))}</div>
            <div class="skill-history-ranges">${renderRanges()}</div>
          </div>
          <div class="skill-history-error">${esc(state.error || t("load_error", "Failed to load skill history."))}</div>
        </div>
      </section>
    </div>
  `;
}

function visibleChangesForRange(normalized) {
  const safeNormalized = normalized || normalizePayload([], state.context);
  const rangeEvents = safeNormalized.events.length ? safeNormalized.events : safeNormalized.changes;
  const feed = state.changes.length ? state.changes : safeNormalized.changes;
  const { start, end } = rangeWindow(state.range, rangeEvents);

  return feed.filter((change) => !change.date || (change.date >= start && change.date <= end));
}

function changeForChart(change) {
  if (!change) return null;
  const key = String(change.id || "");
  const detail = key ? state.detailCache.get(key) : null;
  if (!detail) return change;

  return {
    ...change,
    ...detail,
    id: detail.id || change.id,
    date: detail.date || change.date,
    reason: detail.reason || change.reason,
    tag: detail.tag || change.tag,
    raw: detail.raw || change.raw,
  };
}

function renderContent() {
  if (!modalEl) return;
  const body = modalEl.querySelector("[data-sh-body]");
  if (!body) return;
  const currentChangeList = body.querySelector(".skill-history-change-list");
  if (currentChangeList && !state.resetChangeListScroll) {
    state.changeListScrollTop = currentChangeList.scrollTop;
  }

  if (state.loading) {
    body.innerHTML = renderLoading();
    const nextChangeList = body.querySelector(".skill-history-change-list");
    if (nextChangeList) nextChangeList.scrollTop = state.resetChangeListScroll ? 0 : state.changeListScrollTop;
    state.resetChangeListScroll = false;
    return;
  }

  if (state.error) {
    body.innerHTML = renderError();
    state.resetChangeListScroll = false;
    return;
  }

  const normalized = state.normalized || normalizePayload([], state.context);
  const context = state.context;
  const changes = visibleChangesForRange(normalized);

  if (state.selectedChangeIndex >= changes.length) state.selectedChangeIndex = 0;
  const selectedChange = changeForChart(changes[state.selectedChangeIndex] || changes[0] || null);

  body.innerHTML = `
    <div class="skill-history-modal__layout">
      ${renderSidebar(normalized, context)}
      <section class="skill-history-main">
        <div class="skill-history-main-card">
          <div class="skill-history-card-head">
            <div>
              <div class="skill-history-title">${esc(t("title", "Skill score history"))}</div>
            </div>
            <div class="skill-history-ranges">${renderRanges()}</div>
          </div>
          <div class="skill-history-chart-grid">
            ${renderChart(normalized, context, selectedChange)}
            ${renderSummary(normalized, context)}
          </div>
        </div>

        <div class="skill-history-bottom-grid">
          <section class="skill-history-recent">
            <div class="skill-history-section-title">${esc(t("recent_changes", "Recent changes"))}</div>
            <div class="skill-history-change-list">${renderRecentChanges(changes)}</div>
          </section>
          ${renderChangeDetails(changes)}
        </div>
      </section>
    </div>
  `;

  const nextChangeList = body.querySelector(".skill-history-change-list");
  if (nextChangeList) {
    nextChangeList.scrollTop = state.resetChangeListScroll ? 0 : state.changeListScrollTop;
  }
  state.resetChangeListScroll = false;

}

function ensureModal() {
  if (modalEl) return modalEl;

  modalEl = document.createElement("div");
  modalEl.id = "skillHistoryModal";
  modalEl.className = "skill-history-modal";
  modalEl.setAttribute("aria-hidden", "true");
  modalEl.innerHTML = `
    <div class="skill-history-modal__backdrop" data-sh-close></div>
    <div class="skill-history-modal__panel" role="dialog" aria-modal="true" aria-label="${escAttr(t("title", "Skill score history"))}">
      <button type="button" class="skill-history-modal__close" data-sh-close aria-label="${escAttr(t("close", "Close"))}">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7a1 1 0 0 0-1.4 1.4l4.9 4.9-4.9 4.9a1 1 0 1 0 1.4 1.4l4.9-4.9 4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4Z"/>
        </svg>
      </button>
      <div data-sh-body></div>
    </div>
  `;
  document.body.appendChild(modalEl);

  modalEl.addEventListener("click", (event) => {
    const closeButton = event.target.closest("[data-sh-close]");
    if (closeButton) {
      closeSkillHistoryModal();
      return;
    }

    const rangeButton = event.target.closest("[data-sh-range]");
    if (rangeButton) {
      state.range = rangeButton.dataset.shRange || "7d";
      state.selectedChangeIndex = 0;
      state.changeListScrollTop = 0;
      state.resetChangeListScroll = true;
      void loadHistory();
      return;
    }

    const changeButton = event.target.closest("[data-sh-change-index]");
    if (changeButton) {
      state.selectedChangeIndex = Number.parseInt(changeButton.dataset.shChangeIndex || "0", 10) || 0;
      renderContent();
      const normalized = state.normalized || normalizePayload([], state.context);
      const changes = visibleChangesForRange(normalized);
      const change = changes[state.selectedChangeIndex] || null;
      if (change?.id) void loadChangeDetail(change);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!state.open || event.key !== "Escape") return;
    closeSkillHistoryModal();
  });

  return modalEl;
}

async function loadHistory() {
  const userId = String(state.context.userId || "").trim();
  if (!userId) return;

  const token = ++requestToken;
  state.loading = true;
  state.error = "";
  state.summary = null;
  state.tiers = null;
  renderContent();

  try {
    if (TEMP_SKILL_HISTORY_JSON_URL) {
      const temporaryUrl = new URL(TEMP_SKILL_HISTORY_JSON_URL, window.location.origin);
      const temporaryPayload = await fetchJson(temporaryUrl);
      if (token !== requestToken) return;
      applyTemporarySkillHistoryPayload(temporaryPayload, userId);
      return;
    }

    const summaryUrl = new URL(`/api/skill/users/${encodeURIComponent(userId)}`, window.location.origin);
    const tiersUrl = new URL("/api/skill/tiers", window.location.origin);

    const historyUrl = new URL(`/api/skill/users/${encodeURIComponent(userId)}/history`, window.location.origin);
    historyUrl.searchParams.set("window", state.range);

    const changesUrl = new URL(`/api/skill/users/${encodeURIComponent(userId)}/changes`, window.location.origin);
    changesUrl.searchParams.set("window", state.range);
    changesUrl.searchParams.set("limit", "20");
    changesUrl.searchParams.set("offset", "0");

    const [summaryPayload, historyPayload, changesPayload, tiersPayload] = await Promise.all([
      fetchJson(summaryUrl),
      fetchJson(historyUrl),
      fetchJson(changesUrl),
      fetchJson(tiersUrl).catch(() => null),
    ]);

    if (token !== requestToken) return;
    const summary = unwrapPayload(summaryPayload) ?? {};
    const nextChanges = normalizeChangeFeed(changesPayload);
    const detailCache = new Map();
    const firstChange = nextChanges[0] || null;

    if (firstChange?.id) {
      try {
        const detailUrl = new URL(
          `/api/skill/users/${encodeURIComponent(userId)}/changes/${encodeURIComponent(firstChange.id)}`,
          window.location.origin
        );
        const detailPayload = await fetchJson(detailUrl);
        detailCache.set(String(firstChange.id), normalizeChangeDetail(detailPayload));
      } catch {
        detailCache.set(String(firstChange.id), normalizeChangeDetail(firstChange));
      }
    }

    if (token !== requestToken) return;
    state.summary = summary;
    state.tiers = tiersPayload ? unwrapPayload(tiersPayload) : null;
    state.normalized = normalizePayload(historyPayload, state.context);
    state.changes = nextChanges;
    state.detailCache = detailCache;
    state.detailLoadingId = "";
    state.loading = false;
    state.error = "";
    renderContent();
  } catch (error) {
    if (token !== requestToken) return;
    state.loading = false;
    state.error = error?.message || t("load_error", "Failed to load skill history.");
    renderContent();
  }
}

async function loadChangeDetail(change) {
  const userId = String(state.context.userId || "").trim();
  const changeId = String(change?.id || "").trim();
  if (!userId || !changeId || state.detailCache.has(changeId)) return;

  state.detailLoadingId = changeId;
  renderContent();

  try {
    const url = new URL(
      `/api/skill/users/${encodeURIComponent(userId)}/changes/${encodeURIComponent(changeId)}`,
      window.location.origin
    );
    const payload = await fetchJson(url);
    state.detailCache.set(changeId, normalizeChangeDetail(payload));
  } catch {
    state.detailCache.set(changeId, normalizeChangeDetail(change));
  } finally {
    if (state.detailLoadingId === changeId) state.detailLoadingId = "";
    if (state.open && !state.loading) renderContent();
  }
}

async function loadDiscordAvatar() {
  const userId = String(state.context.userId || "").trim();
  if (!userId) return;

  const token = ++avatarToken;
  state.avatarLoading = true;
  state.avatarUrl = "";

  try {
    const url = new URL("/api/settings/user-avatar", window.location.origin);
    url.searchParams.set("user_id", userId);
    const payload = await fetchJson(url);
    if (token !== avatarToken) return;
    state.avatarUrl = ensureAvatarSize(payload?.avatar_url || payload?.data?.avatar_url || "", 128)
      || defaultDiscordAvatarFromId(userId);
  } catch {
    if (token !== avatarToken) return;
    state.avatarUrl = defaultDiscordAvatarFromId(userId);
  } finally {
    if (token !== avatarToken) return;
    state.avatarLoading = false;
    if (state.open && !state.loading) renderContent();
  }
}

export function updateSkillHistoryTrigger(trigger, options = {}) {
  if (!trigger) return;
  const data = {
    userId: options.userId,
    name: options.name,
    avatar: options.avatar,
    skillScore: options.skillScore,
    skillTier: options.skillTier,
    skillTierName: options.skillTierName,
    rankName: options.rankName,
  };

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === "") continue;
    const attr = `skillHistory${key.charAt(0).toUpperCase()}${key.slice(1)}`;
    trigger.dataset[attr] = String(value);
  }
}

function readTriggerOptions(trigger) {
  return {
    userId: trigger.dataset.skillHistoryUserId || trigger.dataset.userId || "",
    name: trigger.dataset.skillHistoryName || trigger.dataset.name || "",
    avatar: trigger.dataset.skillHistoryAvatar || "",
    skillScore: trigger.dataset.skillHistorySkillScore || trigger.dataset.skillHistoryScore || "",
    skillTier: trigger.dataset.skillHistorySkillTier || "",
    skillTierName: trigger.dataset.skillHistorySkillTierName || trigger.dataset.skillHistoryTier || "",
    rankName: trigger.dataset.skillHistoryRankName || "",
  };
}

export function openSkillHistoryModal(options = {}) {
  const userId = String(options.userId || "").trim();
  if (!userId) return;

  ensureModal();
  state.open = true;
  state.range = options.range || state.range || "7d";
  state.context = { ...options, userId };
  state.loading = true;
  state.normalized = null;
  state.summary = null;
  state.tiers = null;
  state.changes = [];
  state.detailCache = new Map();
  state.detailLoadingId = "";
  state.avatarUrl = "";
  state.avatarLoading = true;
  state.selectedChangeIndex = 0;
  state.changeListScrollTop = 0;
  state.resetChangeListScroll = true;
  state.error = "";

  modalEl.classList.add("is-open");
  modalEl.setAttribute("aria-hidden", "false");
  document.documentElement.classList.add("skill-history-modal-open");
  renderContent();
  modalEl.querySelector("[data-sh-range].is-active, .skill-history-modal__close")?.focus({ preventScroll: true });

  void loadDiscordAvatar();
  void loadHistory();
}

export function closeSkillHistoryModal() {
  if (!modalEl) return;
  state.open = false;
  modalEl.classList.remove("is-open");
  modalEl.setAttribute("aria-hidden", "true");
  document.documentElement.classList.remove("skill-history-modal-open");
}

export function bindSkillHistoryTriggers(root = document) {
  if (!root || boundRoots.has(root)) return;
  boundRoots.add(root);

  root.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-skill-history-user-id]");
    if (!trigger) return;
    event.preventDefault();
    openSkillHistoryModal(readTriggerOptions(trigger));
  });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const trigger = event.target.closest("[data-skill-history-user-id]");
    if (!trigger) return;
    event.preventDefault();
    openSkillHistoryModal(readTriggerOptions(trigger));
  });
}
