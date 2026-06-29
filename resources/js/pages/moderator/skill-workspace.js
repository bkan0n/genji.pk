import { $, $$ } from './workspace-shell.js';

let DEPS = null;
const ROOT = () => $('[data-skill-workspace]');

const API_MODS = '/api/mods';

// Signed-in moderator id, used to pre-fill the player-score lookup.
// (Same derivation as verifications-workspace.js.)
const MOD_USER_ID = (
  document.getElementById('modUserId')?.value ??
  document.querySelector('meta[name="mod-user-id"]')?.content ??
  (typeof window !== 'undefined' && window.user_id != null ? String(window.user_id) : '')
).trim();

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// Verbatim copy of moderator.js setFormPending (no external deps); preserves the
// disable + "Working..." button lifecycle the central dispatcher used to provide.
function setSkillFormPending(form, pending = true, submitter = null) {
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
      if (!submitter || btn === submitter) btn.textContent = 'Working...';
    });
    return;
  }
  form.removeAttribute('aria-busy');
  submitButtons.forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove('opacity-70');
    if (btn.dataset.pendingText) btn.textContent = btn.dataset.pendingText;
  });
}

// Verbatim copy of moderator.js findRelatedActionForm (shared with store/quest;
// kept as a local copy here per the sibling-module precedent).
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

// Verbatim copy of moderator.js normalizeConfigPayload (shared with store/quest;
// kept as a local copy here per the sibling-module precedent).
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

// ===== skill helpers/handlers (moved verbatim from moderator.js) =====
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
    const firstResponse = await DEPS.http('GET', '/api/community/leaderboard', {
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
          DEPS.http('GET', '/api/community/leaderboard', {
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
    DEPS.toast('Enter a valid user_id', 'warn');
    return;
  }

  const res = await DEPS.http('GET', `/api/skill/users/${encodeURIComponent(userId)}`);
  DEPS.logActivity({
    title: 'Skill user summary',
    method: 'GET',
    url: res.url,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  if (!res.ok) {
    DEPS.setPanelOut(form, 'skill-user-res', res.data ?? 'Request failed');
    DEPS.toast('Failed to load Skill Score', 'err');
    return;
  }

  renderSkillUserSummary(form, res.data);
  DEPS.toast('Skill Score loaded', 'ok');
}

async function handleSkillUserBreakdown(form) {
  const userId = String(new FormData(form).get('user_id') || '').trim();
  if (!/^\d{1,20}$/.test(userId)) {
    DEPS.toast('Enter a valid user_id', 'warn');
    return;
  }

  const res = await DEPS.http('GET', `/api/skill/users/${encodeURIComponent(userId)}/breakdown`);
  DEPS.logActivity({
    title: 'Skill user breakdown',
    method: 'GET',
    url: res.url,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  if (!res.ok) {
    DEPS.toast('Failed to load Skill breakdown', 'err');
    return;
  }

  renderSkillUserBreakdown(form, res.data);
  DEPS.toast('Skill breakdown loaded', 'ok');
}

async function handleSkillConfigGet(form) {
  if (!form) return;
  DEPS.setPanelOut(form, 'skill-config-res', 'Loading...');

  const res = await DEPS.http('GET', `${API_MODS}/skill/config`);
  DEPS.logActivity({
    title: 'Skill weights',
    method: 'GET',
    url: res.url,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  DEPS.setPanelOut(form, 'skill-config-res', res.data ?? 'Request failed');
  if (!res.ok) {
    DEPS.toast('Failed to load skill weights', 'err');
    return;
  }

  fillSkillConfigForm(findRelatedActionForm(form, 'skill-config-update'), res.data);
  DEPS.toast('Skill weights loaded', 'ok');
}

async function handleSkillConfigUpdate(form) {
  const formData = new FormData(form);
  const payload = {};
  SKILL_WEIGHT_FIELDS.forEach((field) => {
    const raw = String(formData.get(field) ?? '').trim();
    if (raw !== '') payload[field] = Number(raw);
  });

  if (!Object.keys(payload).length || Object.values(payload).some((value) => !Number.isFinite(value))) {
    DEPS.toast('Enter valid skill weights', 'warn');
    return;
  }

  const res = await DEPS.http('PATCH', `${API_MODS}/skill/config`, { body: payload });
  DEPS.logActivity({
    title: 'Update skill weights',
    method: 'PATCH',
    url: res.url,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  DEPS.setPanelOut(form, 'skill-config-res', res.data ?? 'Update failed');
  if (!res.ok) {
    DEPS.toast(res.data?.message || 'Failed to update skill weights', 'err');
    return;
  }

  fillSkillConfigForm(form, res.data);
  DEPS.toast('Skill weights updated', 'ok');
}

async function handleSkillTiersGet(form) {
  if (!form) return;
  const res = await DEPS.http('GET', '/api/skill/tiers');
  DEPS.logActivity({
    title: 'Skill tier config',
    method: 'GET',
    url: res.url,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  DEPS.setPanelOut(form, 'skill-tiers-res', res.data ?? 'Request failed');
  if (!res.ok) {
    DEPS.toast('Failed to load skill tiers', 'err');
    return;
  }

  const updateForm = findRelatedActionForm(form, 'skill-tiers-update');
  bindSkillPercentileSliders(updateForm);
  fillSkillTierConfig(updateForm, res.data);
  loadSkillTierSamples(updateForm);
  DEPS.toast('Skill tier config loaded', 'ok');
}

async function handleSkillTiersUpdate(form) {
  const inputs = skillPercentileInputs(form);
  const percentiles = inputs.map((input) => Number((Number(input.value) / 100).toFixed(4)));

  if (
    percentiles.length !== 7 ||
    percentiles.some((value) => !Number.isFinite(value) || value <= 0 || value >= 1) ||
    percentiles.some((value, index) => index > 0 && value <= percentiles[index - 1])
  ) {
    DEPS.toast('Percentiles must be strictly increasing', 'warn');
    return;
  }

  const res = await DEPS.http('PATCH', `${API_MODS}/skill/tiers`, {
    body: { percentiles },
  });
  DEPS.logActivity({
    title: 'Update skill tier percentiles',
    method: 'PATCH',
    url: res.url,
    ok: res.ok,
    status: res.status,
    data: res.data,
  });

  DEPS.setPanelOut(form, 'skill-tiers-res', res.data ?? 'Update failed');
  if (!res.ok) {
    DEPS.toast(res.data?.message || 'Failed to update skill tiers', 'err');
    return;
  }

  fillSkillTierConfig(form, res.data);
  loadSkillTierSamples(form);
  DEPS.toast('Skill tier percentiles updated', 'ok');
}

const SKILL_ACTION_HANDLERS = {
  'skill-user-summary': handleSkillUserSummary,
  'skill-user-breakdown': handleSkillUserBreakdown,
  'skill-config-get': handleSkillConfigGet,
  'skill-config-update': handleSkillConfigUpdate,
  'skill-tiers-get': handleSkillTiersGet,
  'skill-tiers-update': handleSkillTiersUpdate,
};

function wireSubtabLoading(root) {
  root.addEventListener('click', (e) => {
    const tab = e.target.closest('.mod-subtab');
    if (!tab) return;
    const name = tab.dataset.subtab;
    if (name === 'skill-user') initSkillUserPanel();
    if (name === 'skill-config') initSkillConfigPanel();
    if (name === 'skill-tiers') initSkillTiersPanel();
  });
}

function wireForms(root) {
  root.addEventListener('submit', async (e) => {
    const form = e.target.closest('form[data-action]');
    if (!form || !root.contains(form)) return;
    const submitter = e.submitter || form.querySelector('button[type="submit"], button:not([type])');
    const action = submitter?.dataset?.submitAction || form.dataset.action;
    const handler = SKILL_ACTION_HANDLERS[action];
    if (!handler) return;
    e.preventDefault();
    if (form.dataset.submitLocked === '1') return;
    form.dataset.submitLocked = '1';
    setSkillFormPending(form, true, submitter);
    try {
      await handler(form);
    } finally {
      setSkillFormPending(form, false, submitter);
      form.dataset.submitLocked = '0';
    }
  });
}

export function initSkillWorkspace(deps) {
  DEPS = deps;
  const root = ROOT();
  if (!root) return;
  wireSubtabLoading(root);
  wireForms(root);
}
