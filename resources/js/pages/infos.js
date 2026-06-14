import { cdnAsset } from "../utils/cdn";
import { renderSkillScoreFormula } from "../components/skill-score-formula";

let translations = window.INFOS_I18N || {};

/* =========================
   Simple i18n helper
   ========================= */
function t(path, params = {}) {
  const parts = path.split('.');
  let result = translations;
  for (const part of parts) {
    result = result?.[part];
    if (!result) break;
  }
  if (typeof result !== 'string') return path;
  for (const k in params) {
    if (Object.prototype.hasOwnProperty.call(params, k)) {
      result = result.replace(`{${k}}`, params[k]);
    }
  }
  return result;
}

const SCORE_RANKS = [
  { tier: 0, key: 'unranked', image: 'Unranked.png' },
  { tier: 1, key: 'bronze', image: 'Bronze.png' },
  { tier: 2, key: 'silver', image: 'Silver.png' },
  { tier: 3, key: 'gold', image: 'Gold.png' },
  { tier: 4, key: 'emerald', image: 'Emerald.png' },
  { tier: 5, key: 'diamond', image: 'Diamond.png' },
  { tier: 6, key: 'ascendant', image: 'Ascendant.png' },
  { tier: 7, key: 'elite', image: 'Elite.png' },
  { tier: 8, key: 'champion', image: 'Champion.png' },
];

let skillTiersPromise = null;

function loadSkillTiers() {
  if (!skillTiersPromise) {
    skillTiersPromise = fetch('/api/skill/tiers', {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Skill tiers request failed (${response.status})`);
        return response.json();
      })
      .catch(() => null);
  }

  return skillTiersPromise;
}

function formatScoreRankNumber(value, options = {}) {
  return new Intl.NumberFormat(document.documentElement.lang || 'en', options).format(value);
}

function scoreRankThreshold(rank, tiers) {
  const percentiles = Array.isArray(tiers?.percentiles) ? tiers.percentiles : [];
  const boundaries = Array.isArray(tiers?.boundaries) ? tiers.boundaries : [];

  if (rank.tier === 0) {
    return `<p class="score-rank-note">${t('score_rank.unranked_note')}</p>`;
  }

  if (rank.tier === 1) {
    const upperPercentile = Number(percentiles[0]);
    return Number.isFinite(upperPercentile)
      ? `<p class="score-rank-threshold">${t('score_rank.bronze_range', {
          percentile: formatScoreRankNumber(upperPercentile, {
            style: 'percent',
            maximumFractionDigits: 1,
          }),
        })}</p>`
      : `<p class="score-rank-note">${t('score_rank.threshold_unavailable')}</p>`;
  }

  const thresholdIndex = rank.tier - 2;
  const percentile = Number(percentiles[thresholdIndex]);
  const boundary = Number(boundaries[thresholdIndex]);
  const details = [];

  if (Number.isFinite(percentile)) {
    details.push(
      t('score_rank.starts_at', {
        percentile: formatScoreRankNumber(percentile, {
          style: 'percent',
          maximumFractionDigits: 1,
        }),
      })
    );
  }

  if (Number.isFinite(boundary)) {
    details.push(
      t('score_rank.score_from', {
        score: formatScoreRankNumber(boundary, { maximumFractionDigits: 2 }),
      })
    );
  }

  return details.length
    ? `<p class="score-rank-threshold">${details.join('<br>')}</p>`
    : `<p class="score-rank-note">${t('score_rank.threshold_unavailable')}</p>`;
}

function scoreRankMarkup(tiers = null) {
  const cards = SCORE_RANKS.map((rank) => {
    const name = t(`score_rank.ranks.${rank.key}`);
    return `
      <article class="score-rank-card score-rank-${rank.key}">
        <div class="score-rank-image-wrap">
          <img
            src="${cdnAsset(`assets/skill/rank-icons/${rank.image}`)}"
            alt="${name}"
            class="score-rank-image"
            loading="lazy"
            decoding="async"
          >
        </div>
        <div class="score-rank-content">
          <div class="score-rank-tier">${t('score_rank.tier', { tier: rank.tier })}</div>
          <h3>${name}</h3>
          ${scoreRankThreshold(rank, tiers)}
        </div>
      </article>
    `;
  }).join('');

  return `
    <div class="score-rank-panel">
      <header class="score-rank-header">
        <div class="skill-formula-kicker">${t('score_rank.kicker')}</div>
        <h2>${t('score_rank.title')}</h2>
        <p>${t('score_rank.intro')}</p>
      </header>
      <div class="score-rank-body">
        <div class="score-rank-callout">${t('score_rank.population_note')}</div>
        <div class="score-rank-grid">${cards}</div>
      </div>
    </div>
  `;
}

async function renderScoreRank(container) {
  container.innerHTML = scoreRankMarkup();
  const tiers = await loadSkillTiers();

  if (container.isConnected) {
    container.innerHTML = scoreRankMarkup(tiers);
  }
}

function decorateInfoSection(container) {
  const panel = container.firstElementChild;
  if (!panel || panel.classList.contains('skill-formula-panel') || panel.classList.contains('score-rank-panel')) {
    return;
  }

  panel.classList.add('infos-unified-panel');
}

/* =========================
   RANKS – content renderer
   ========================= */
function renderRankHelpContent(kind) {
  const tf = (key, fb) => (typeof t === 'function' ? (t(key) ?? fb) : fb);

  const li = (txt) => `
    <li class="help-li">
      <span class="dot"></span>
      <span class="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed">${txt}</span>
    </li>
  `;

  const card = (title, content, { showIcon = false } = {}) => `
    <section
      class="rounded-xl border border-zinc-200 dark:border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.02]
             p-4 sm:p-5 space-y-2 shadow-sm shadow-black/20"
    >
      <div class="flex items-center gap-2 ${showIcon ? '' : 'cursor-default'}">
        ${
          showIcon
            ? `<div class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15">
                 <svg class="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                   <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1 15-5-5 1.414-1.414L11 13.172l6.586-6.586L19 8z"/>
                 </svg>
               </div>`
            : ''
        }
        <h4 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">${title}</h4>
      </div>
      ${content}
    </section>
  `;

  const calloutInfo = (text) => `
    <div
      class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200
             px-3 py-2 text-sm font-medium leading-relaxed flex items-start gap-2 cursor-default"
    >
      <span class="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/30 text-[10px]">i</span>
      <span>${text}</span>
    </div>
  `;

  // ---- HOW TO RANK UP ----
  if (kind === 'rank_how_to_submit') {
    const title = tf('help_modal.rank_promotion.how_to_submit.title', 'How to rank up');

    const intro = calloutInfo(
      tf(
        'help_modal.rank_promotion.how_to_submit.intro',
        'Ranks are updated automatically based on your completions (records).'
      )
    );

    const req = card(
      tf('help_modal.rank_promotion.how_to_submit.requirements.title', 'Requirements'),
      `
        <ul class="mt-1 space-y-2 cursor-default">
          ${li(
            tf(
              'help_modal.rank_promotion.how_to_submit.requirements.map_in_pool',
              'Complete Genji Parkour maps that are in the current map pool.'
            )
          )}
          ${li(
            tf(
              'help_modal.rank_promotion.how_to_submit.requirements.map_code_note',
              "Note: maps that aren’t currently accepted won’t appear in the map code field."
            )
          )}
        </ul>
      `
    );

    const steps = card(
      tf('help_modal.rank_promotion.how_to_submit.steps.title', 'How to submit a completion'),
      `
        <ol class="mt-1 space-y-3 relative border-zinc-200 dark:border-white/10 pl-4 cursor-default">
          ${[
            tf('help_modal.rank_promotion.how_to_submit.steps.open_tab','Open the “Submit completion” tab.'),
            tf('help_modal.rank_promotion.how_to_submit.steps.enter_code','Enter the map code and your record time.'),
            tf('help_modal.rank_promotion.how_to_submit.steps.upload_screenshot','Upload a screenshot (required). Optionally add a video URL.'),
            tf('help_modal.rank_promotion.how_to_submit.steps.submit','Click “Submit record”.'),
          ]
            .map(
              (text, idx) => `
              <li class="relative">
                <div
                  class="absolute -left-4 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900
                         ring-2 ring-emerald-500/60 text-xs font-semibold text-white dark:text-emerald-100"
                >
                  ${idx + 1}
                </div>
                <p class="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed">${text}</p>
              </li>`
            )
            .join('')}
        </ol>
      `,
      { showIcon: false }
    );

    return `
      <div class="space-y-4">
        <h2 class="text-2xl font-bold tracking-tight">${title}</h2>
        ${intro}
        ${req}
        ${steps}
      </div>
    `;
  }

  // ---- SUBMISSION RULES ----
  if (kind === 'rank_submission_rules') {
    const liInner = (txt) => `
      <li class="help-li">
        <span class="dot"></span>
        <span class="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed">${txt}</span>
      </li>
    `;

    const cardInner = (title, content) => card(title, content, { showIcon: false });

    const warn = (text) => `
      <div
        class="rounded-lg border border-amber-400/40 bg-amber-500/10 text-amber-800 dark:text-amber-100
               px-3 py-2 text-sm font-medium leading-relaxed flex items-start gap-2 cursor-default"
      >
        <span class="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/20">⚠</span>
        <span>${text}</span>
      </div>
    `;

    const completion = cardInner(
      tf('help_modal.rank_promotion.submission_rules.completion.title','Completion Requirements / Guidelines'),
      `
        <ul class="mt-1 space-y-2 cursor-default">
          ${liInner(
            tf(
              'help_modal.rank_promotion.submission_rules.completion.li_code_match',
              'The map code in your screenshot must match the map code shown on the website (and in GenjiBot).'
            )
          )}
          ${liInner(
            tf(
              'help_modal.rank_promotion.submission_rules.completion.li_time_display',
              'Time must be displayed either in the Top 5 leaderboard or as the center-screen announcement. For video submissions, it must show both.'
            )
          )}
          ${liInner(
            tf(
              'help_modal.rank_promotion.submission_rules.completion.li_no_edit_map',
              'Do not edit the map using Custom Game options, Workshop Settings, or any other Workshop code (e.g., tech bans, gravity).'
            )
          )}
          ${liInner(
            tf(
              'help_modal.rank_promotion.submission_rules.completion.li_no_scripts',
              'Scripts, macros, or similar automations are not allowed.'
            )
          )}
          ${liInner(
            tf(
              'help_modal.rank_promotion.submission_rules.completion.li_no_banned_tech',
              'Banned techniques are not allowed. See the banned techniques list on the website or in #rules on the Discord.'
            )
          )}
        </ul>
      `
    );

    const records = cardInner(
      tf('help_modal.rank_promotion.submission_rules.records.title','Video record submissions'),
      `
        <ul class="mt-1 space-y-2 cursor-default">
          ${liInner(
            tf(
              'help_modal.rank_promotion.submission_rules.records.li_video_required',
              'Video proof is required for World Records and medal records.'
            )
          )}
          ${liInner(
            tf(
              'help_modal.rank_promotion.submission_rules.records.li_time_visible',
              'The time must be fully visible from 0.00 to the finish. No fade in/out while the timer runs.'
            )
          )}
          ${liInner(
            tf(
              'help_modal.rank_promotion.submission_rules.records.li_no_cuts',
              'No cuts in the video between 0.00 and the finish.'
            )
          )}
          ${liInner(
            tf(
              'help_modal.rank_promotion.submission_rules.records.li_sound_not_required',
              'Game sound is not required.'
            )
          )}
          ${liInner(
            tf(
              'help_modal.rank_promotion.submission_rules.records.li_editing_ok_but_no_interfere',
              'Editing before/after is allowed but must not interfere with timing or verification.'
            )
          )}
        </ul>
      `
    );

    const disclaimer = warn(
      tf(
        'help_modal.rank_promotion.submission_rules.reserve_rights',
        'Senseis may deny any submission for any reason, even if not listed here.'
      )
    );

    return `
      <div class="space-y-4">
        <h2 class="text-2xl font-bold tracking-tight">
          ${tf('help_modal.rank_promotion.submission_rules.title', 'Rank submission rules')}
        </h2>
        ${completion}
        ${records}
        ${disclaimer}
      </div>
    `;
  }

  // ---- RANKS INFO ----
  if (kind === 'rank_info_thresholds') {
    const liRank = (txt) => `
      <li class="help-li">
        <span class="dot"></span>
        <span class="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed">${txt}</span>
      </li>
    `;

    const info = `
      <div class="rounded-xl border border-zinc-200 dark:border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.02]
                p-4 sm:p-5 space-y-2 shadow-sm shadow-black/20">
        <ul class="mt-1 space-y-2 cursor-default">
          ${liRank(t('help_modal.rank_promotion.rank_info_thresholds.info.li_no_order', 'Ranks do not need to be acquired in order.'))}
          ${liRank(t('help_modal.rank_promotion.rank_info_thresholds.info.li_requirement', 'To receive a rank you must complete the required amount of maps for that difficulty/rank.'))}
          ${liRank(t('help_modal.rank_promotion.rank_info_thresholds.info.li_thresholds', 'See chart below for rank thresholds.'))}
        </ul>
      </div>
    `;

    const F = (k, fb) => t(`filters.${k}`, fb);
    const R = (k, p, fb) => t(`help_modal.rank_promotion.rank_info_thresholds.rows.${k}.${p}`, fb);
    const CL = t('help_modal.rank_promotion.rank_info_thresholds.table.completions_label','completions');
    const NA = t('help_modal.rank_promotion.rank_info_thresholds.table.na', 'N/A');

    const rankBadgeSrc = (rankKey) => {
      const file = t(`help_modal.rank_promotion.rank_info_thresholds.rows.${rankKey}.image`, `${rankKey}.webp`);
      return cdnAsset(`assets/ranks/${file}`);
    };

    const ranks = [
      { key: 'ninja',        diff: F('beginner','Beginner'),   count: null, img: rankBadgeSrc('ninja') },
      { key: 'jumper',       diff: F('easy','Easy'),           count: 10,   img: rankBadgeSrc('jumper') },
      { key: 'skilled',      diff: F('medium','Medium'),       count: 10,   img: rankBadgeSrc('skilled') },
      { key: 'pro',          diff: F('hard','Hard'),           count: 10,   img: rankBadgeSrc('pro') },
      { key: 'master',       diff: F('very_hard','Very Hard'), count: 10,   img: rankBadgeSrc('master') },
      { key: 'grand_master', diff: F('extreme','Extreme'),     count: 7,    img: rankBadgeSrc('grand_master') },
      { key: 'god',          diff: F('hell','Hell'),           count: 3,    img: rankBadgeSrc('god') },
    ];

    const cardRank = (r) => `
      <div class="rank-card relative rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/60 p-4 flex flex-col justify-between overflow-hidden">
        <div class="flex items-center gap-3">
          <img src="${r.img}" alt="${R(r.key, 'name', r.key)} badge" class="rank-img h-10 w-10 rounded-lg object-contain shadow-sm shadow-black/40" loading="lazy">
          <div class="min-w-0">
            <div class="rank-name text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">${R(r.key, 'name', r.key)}</div>
            <div class="rank-diff text-xs text-zinc-600 dark:text-zinc-400">${r.diff}</div>
          </div>
        </div>
        <div class="rank-count mt-3 text-sm text-zinc-700 dark:text-zinc-300">
          ${r.count == null ? `<span class="opacity-70">— ${NA}</span>` : `<strong class="text-zinc-900 dark:text-zinc-100">${r.count}</strong> <span class="opacity-80">${CL}</span>`}
        </div>
      </div>
    `;

    const grid = `
      <section class="rounded-xl border border-zinc-200 dark:border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.02] p-4 sm:p-5 space-y-2 shadow-sm shadow-black/20">
        <div class="flex items-center gap-2">
          <h4 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">${t('help_modal.rank_promotion.rank_info_thresholds.table.title','Rank & Difficulty chart')}</h4>
        </div>
        <div class="rank-grid mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          ${ranks.map(cardRank).join('')}
        </div>
      </section>
    `;

    return `<div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">${t('help_modal.rank_promotion.rank_info_thresholds.info.title', 'Ranks Info')}</h2>
      ${info}${grid}
    </div>`;
  }

  // ---- MEDALS ----
  if (kind === 'rank_medals_thresholds') {
    const liMed = (txt) => `
      <li class="help-li">
        <span class="dot"></span>
        <span class="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed">${txt}</span>
      </li>
    `;

    const info = `
      <div class="rounded-xl border border-zinc-200 dark:border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.02]
               p-4 sm:p-5 space-y-2 shadow-sm shadow-black/20">
        <ul class="mt-1 space-y-2 cursor-default">
          ${liMed(t('help_modal.rank_promotion.medals_info_thresholds.info.li_plus_explain','To get a +, ++ or +++ rank, you must obtain the same amount of Bronze, Silver, or Gold medals as the rank normally requires (see chart below).'))}
          ${liMed(t('help_modal.rank_promotion.medals_info_thresholds.info.li_time_and_video_required','You must post a completion that includes a time and a video URL showing your run.'))}
          ${liMed(t('help_modal.rank_promotion.medals_info_thresholds.info.li_icon_next_to_name','You’ll get an icon next to your name if you have a + / ++ / +++ rank.'))}
          ${liMed(t('help_modal.rank_promotion.medals_info_thresholds.info.li_auto_receive',"Once verified, you'll automatically receive your medal."))}
          ${liMed(t('help_modal.rank_promotion.medals_info_thresholds.info.li_retroactive_credit','If medals are added to a map later, you still get credit.'))}
        </ul>
      </div>
    `;

    const D = {
      beginner: t('filters.beginner','Beginner'),
      easy: t('filters.easy','Easy'),
      medium: t('filters.medium','Medium'),
      hard: t('filters.hard','Hard'),
      very_hard: t('filters.very_hard','Very Hard'),
      extreme: t('filters.extreme','Extreme'),
      hell: t('filters.hell','Hell'),
    };
    const DIFF_KEYS = ['beginner','easy','medium','hard','very_hard','extreme','hell'];
    const COUNTS = { beginner: null, easy: 10, medium: 10, hard: 10, very_hard: 10, extreme: 7, hell: 3 };
    const medalImg = (k) => {
      const file = t(`help_modal.rank_promotion.medals_info_thresholds.images.${k}`, `${k}.png`);
      return cdnAsset(`assets/medals/${file}`);
    };
    const ML = t('help_modal.rank_promotion.medals_info_thresholds.table.completions_label','medals');
    const NA = t('help_modal.rank_promotion.medals_info_thresholds.table.na','N/A');

    const MEDALS = [
      { key: 'gold',   label: t('help_modal.rank_promotion.medals_info_thresholds.table.medal_gold','Gold'),   src: medalImg('gold') },
      { key: 'silver', label: t('help_modal.rank_promotion.medals_info_thresholds.table.medal_silver','Silver'), src: medalImg('silver') },
      { key: 'bronze', label: t('help_modal.rank_promotion.medals_info_thresholds.table.medal_bronze','Bronze'), src: medalImg('bronze') },
    ];

    const head = DIFF_KEYS.map(
      (k, colIndex) => `<div class="tech-hcell text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-default" data-tech-col="${colIndex}">
        ${D[k]}
      </div>`
    ).join('');

    const cell = (count, rowIndex, colIndex) =>
      `<div class="tech-cell text-sm text-zinc-700 dark:text-zinc-200 px-2 rounded-lg cursor-default" data-tech-row="${rowIndex}" data-tech-col="${colIndex}">
        ${count == null ? `<span class="opacity-70" title="${NA}">${NA}</span>` : `<strong class="text-zinc-900 dark:text-zinc-100">${count}</strong> <span class="opacity-80">${ML}</span>`}
      </div>`;

    const rows = MEDALS.map(
      (m, rowIndex) => `
        <div class="tech-rlabel flex items-center gap-2 px-2 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 cursor-default" data-tech-row="${rowIndex}">
          <img src="${m.src}" alt="${m.label}" class="h-5 w-5 object-contain" loading="lazy">
          <span>${m.label}</span>
        </div>
        ${DIFF_KEYS.map((k, colIndex) => cell(COUNTS[k], rowIndex, colIndex)).join('')}
      `
    ).join('');

    const table = `
      <section class="rounded-xl border border-zinc-200 dark:border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.02] p-4 sm:p-5 space-y-2 shadow-sm shadow-black/20">
        <div class="flex items-center gap-2">
          <h4 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">${t('help_modal.rank_promotion.medals_info_thresholds.table.title','Medal thresholds by difficulty')}</h4>
        </div>
        <div class="infos-scroll-x mt-2">
          <div class="infos-scroll-x-inner">
            <div class="tech-grid">
              <div></div>${head}
              ${rows}
            </div>
          </div>
        </div>
      </section>
    `;

    return `<div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">${t('help_modal.rank_promotion.medals_info_thresholds.info.title', 'Medals Info')}</h2>
      ${info}${table}
    </div>`;
  }

  return `
    <div class="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 p-4 text-sm text-zinc-700 dark:text-zinc-300 cursor-default">
      ${t('help_modal.common.soon', 'Coming soon.')}
    </div>
  `;
}

/* =========================
   MAP HELP CONTENT
   ========================= */
function renderMapHelpContent(kind) {
  const tf = (key, fallback) => (typeof t === 'function' ? (t(key) ?? fallback) : fallback);

  if (kind === 'playtesting_info') {
    const li = (txt) => `
      <li class="help-li">
        <span class="dot"></span>
        <span class="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed">${txt}</span>
      </li>
    `;

    const card = (title, content) => `
      <section
        class="rounded-xl border border-zinc-200 dark:border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.02]
               p-4 sm:p-5 space-y-2 shadow-sm shadow-black/20"
      >
        <div class="flex items-center gap-2">
          <h4 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">${title}</h4>
        </div>
        ${content}
      </section>
    `;

    const calloutWarn = (text) => `
      <div
        class="rounded-lg border border-rose-500/25 bg-rose-500/10 text-rose-800 dark:text-rose-200
               px-3 py-2 text-sm font-medium mt-3 leading-relaxed flex items-start gap-2 cursor-default"
      >
        <span class="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-rose-500/30 text-[10px]">!</span>
        <span>${text}</span>
      </div>
    `;

    const P  = (k, fb) => tf(`help_modal.playtesting_info.process.${k}`, fb);
    const PS = (k, fb) => tf(`help_modal.playtesting_info.process.steps.${k}`, fb);
    const PN = (k, fb) => tf(`help_modal.playtesting_info.process.notes.${k}`, fb);

    const process = card(
      P('title', 'Process'),
      `
      <div class="help-pt pt-grid cursor-default">
        <div class="pt-phase bg-zinc-100 dark:bg-zinc-900/40">
          <div class="pt-phase-title text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">${P('creation','Creation Phase')}</div>
          <div class="pt-card mt-2 space-y-1.5">
            <div class="pt-step text-sm text-zinc-700 dark:text-zinc-200">${PS('map_is_made','Map is made')}</div>
            <div class="pt-step text-sm text-zinc-700 dark:text-zinc-200">${PS('map_submission_form','Map submission form')}</div>
            <div class="pt-note text-xs text-zinc-600 dark:text-zinc-400">${PN('change_only_by_sensei','Changing map details can only be done via a Sensei (restrictions, code, etc.).')}</div>
          </div>
        </div>

        <div class="pt-arrow" aria-hidden="true"></div>

        <div class="pt-phase bg-zinc-100 dark:bg-zinc-900/40">
          <div class="pt-phase-title text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">${P('testing','Testing Phase')}</div>
          <div class="pt-card mt-2 space-y-1.5">
            <div class="pt-step text-sm text-zinc-700 dark:text-zinc-200">${PS('creator_suggests_difficulty','Creator suggests difficulty')}</div>
            <div class="pt-step text-sm text-zinc-700 dark:text-zinc-200">${PS('testers_submit_completion','Testers submit completion')}</div>
            <div class="pt-step text-sm text-zinc-700 dark:text-zinc-200">${PS('testers_vote_on_difficulty','Testers vote on difficulty')}</div>
            <div class="pt-step text-sm text-zinc-700 dark:text-zinc-200">${PS('creator_finalizes_submission','Creator finalizes submission')}</div>
          </div>
        </div>

        <div class="pt-arrow" aria-hidden="true"></div>

        <div class="pt-phase bg-zinc-100 dark:bg-zinc-900/40">
          <div class="pt-phase-title text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">${P('verification','Verification Phase')}</div>
          <div class="pt-card mt-2 space-y-1.5">
            <div class="pt-step text-sm text-zinc-700 dark:text-zinc-200">${PS('sensei_receive_submission_notification','Sensei receive submission notification')}</div>
            <div class="pt-step flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200">
              <span class="pt-chip pt-chip-accept inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-800 dark:text-emerald-200">${PS('accept','accept')}</span>
              <span class="pt-chip pt-chip-reject inline-flex items-center rounded-full bg-rose-500/15 px-2 py-0.5 text-xs text-rose-800 dark:text-rose-200">${PS('reject','reject')}</span>
            </div>
            <div class="pt-step text-sm text-zinc-700 dark:text-zinc-200">${PS('map_sent_back_previous_step','Map is sent back to a previous step*')}</div>
            <div class="pt-note text-xs text-zinc-600 dark:text-zinc-400">${PN('verification_removal','* Completions and votes may be removed at this step.')}</div>
          </div>
        </div>

        <div class="pt-arrow" aria-hidden="true"></div>

        <div class="pt-phase bg-zinc-100 dark:bg-zinc-900/40">
          <div class="pt-phase-title text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">${P('acceptance','Acceptance')}</div>
          <div class="pt-card mt-2 space-y-1.5">
            <div class="pt-step text-sm text-zinc-700 dark:text-zinc-200">${PS('map_accepted','Map accepted')}</div>
            <div class="pt-step text-sm text-zinc-700 dark:text-zinc-200">${PS('map_added_to_pool','Map added to map pool')}</div>
            <div class="pt-step text-sm text-zinc-700 dark:text-zinc-200">${PS('testers_granted_completion_without_time','Testers granted completion (without time)')}</div>
          </div>
        </div>
      </div>
      `
    );

    const V  = (k, fb) => tf(`help_modal.playtesting_info.votes.${k}`, fb);
    const VC = (k, fb) => tf(`help_modal.playtesting_info.votes.counts.${k}`, fb);

    const voteRow = (lk, lf, ck, cf) => `
      <div class="pt-req flex items-center justify-between rounded-lg bg-zinc-100 dark:bg-zinc-900/40 px-3 py-2 cursor-default">
        <span class="text-sm text-zinc-700 dark:text-zinc-200">${V(lk, lf)}</span>
        <strong class="text-sm text-zinc-900 dark:text-zinc-100">${VC(ck, cf)}</strong>
      </div>
    `;

    const rules = card(
      tf('help_modal.playtesting_info.rules.title', 'Playtesting rules'),
      `
        <ul class="mt-1 space-y-2 cursor-default">
          ${li(tf('help_modal.playtesting_info.rules.needs_votes_and_completions','Each difficulty requires a specific amount of votes and completion submissions.'))}
          ${li(tf('help_modal.playtesting_info.rules.creator_cannot_vote','Creators cannot vote for their own map; their submission carries the initial difficulty estimate.'))}
          ${li(tf('help_modal.playtesting_info.rules.playtesters_give_tips','Playtesters provide feedback and tips to improve the map or fix issues.'))}
        </ul>
      `
    );

    const votes = card(
      V('title', 'Required votes'),
      `
        <div class="grid gap-2 mt-1">
          ${voteRow('beginner_to_hard','Beginner → Hard','beginner_to_hard',`5 ${V('votes','votes')}`)}
          ${voteRow('very_hard','Very Hard','very_hard',`3 ${V('votes','votes')}`)}
          ${voteRow('extreme','Extreme','extreme',`2 ${V('votes','votes')}`)}
          ${voteRow('hell','Hell','hell',`1 ${V('vote','vote')}`)}
        </div>
      `
    );

    const eligibility = calloutWarn(
      tf('help_modal.playtesting_info.must_submit_completion','You must have submitted a completion for the map to vote!')
    );

    return `
      <div class="space-y-4">
        <h2 class="text-2xl font-bold tracking-tight">${tf('help_modal.playtesting_info.title', 'Playtesting')}</h2>
        ${process}
        <div class="grid gap-4 lg:grid-cols-5">
          <div class="lg:col-span-3">${rules}${eligibility}</div>
          <div class="lg:col-span-2">${votes}</div>
        </div>
      </div>
    `;
  }

  // HOW TO SUBMIT
  if (kind === 'how_to_submit') {
    const li = (txt) => `
      <li class="help-li">
        <span class="dot"></span>
        <span class="text-sm text-zinc-700 dark:text-zinc-200">${txt}</span>
      </li>
    `;

    const section = (title, content) => `
      <section
        class="helpsec rounded-xl border border-zinc-200 dark:border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.02]
               p-4 sm:p-5 space-y-2 shadow-sm shadow-black/20"
      >
        <div class="flex items-center gap-2">
          <h4 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">${title}</h4>
        </div>
        ${content}
      </section>
    `;

    const callout = (text) => `
      <div class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 px-3 py-2 text-sm cursor-default">
        ${text}
      </div>
    `;

    const introText = t('help_modal.how_to_submit.intro','This dialog walks you through every step of the “Submit map” section.');
    const intro = introText ? callout(introText) : '';

    const stepper = `
      <ol class="mb-3 flex flex-wrap gap-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-default">
        ${['Metadata', 'Required', 'Medals', 'Optional', 'Submit']
          .map(
            (label, idx) => `
            <li class="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-white/5 px-2 py-1">
              <span class="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-800 dark:text-emerald-200">${idx + 1}</span>
              <span>${label}</span>
            </li>`
          )
          .join('')}
      </ol>
    `;

    const meta = section(
      t('help_modal.how_to_submit.meta.title', '1) Metadata (map & creators)'),
      `<ul class="mt-1 space-y-1.5 cursor-default">
        ${li(t('help_modal.how_to_submit.meta.li_creator','Main creator: auto-filled from your session. You can change it (and add co-creators if visible).'))}
        ${li(t('help_modal.how_to_submit.meta.li_code','Map code: click “Edit” next to “Code”. The code must be unique.'))}
        ${li(t('help_modal.how_to_submit.meta.li_name','Map name: click “Edit” next to “Map name” and pick via autocomplete.'))}
        ${li(t('help_modal.how_to_submit.meta.li_checkpoints','Checkpoints: click “Edit”, enter a strictly positive number.'))}
      </ul>`
    );

    const required = section(
      t('help_modal.how_to_submit.required.title', '2) Required fields'),
      `<p class="text-sm text-zinc-700 dark:text-zinc-300 cursor-default">${t('help_modal.how_to_submit.required.p1','These fields must be provided before you can submit:')}</p>
       <ul class="mt-2 space-y-1.5 cursor-default">
        ${li(t('help_modal.how_to_submit.required.li_difficulty','Difficulty: choose (Easy → Hell).'))}
        ${li(t('help_modal.how_to_submit.required.li_category','Category / Map type: e.g., Classic, Increasing Difficulty.'))}
        ${li(t('help_modal.how_to_submit.required.li_mechanics','Mechanics: select ≥ 1.'))}
        ${li(t('help_modal.how_to_submit.required.li_restrictions','Restrictions: select ≥ 1.'))}
       </ul>`
    );

    const medals = section(
      t('help_modal.how_to_submit.medals.title', '3) Medals (optional but validated if present)'),
      `<p class="text-sm text-zinc-700 dark:text-zinc-300 cursor-default">${t('help_modal.how_to_submit.medals.p1','You may define times (seconds) for Gold, Silver, and Bronze.')}</p>
       <div class="mt-2 rounded-md border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 p-3 text-xs text-zinc-700 dark:text-zinc-300 cursor-default">
         <div class="font-medium mb-1">${t('help_modal.how_to_submit.medals.li_rules','If you set one medal, you must set all three.')}</div>
         <div class="grid gap-2 sm:grid-cols-3">
           <div class="rounded-md border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-2 py-1.5"><span class="text-amber-700 dark:text-amber-500 font-semibold">Bronze</span> &gt; <span class="text-zinc-700 dark:text-zinc-200">Silver</span> &gt; <span class="text-yellow-700 dark:text-yellow-300">Gold</span></div>
           <div class="rounded-md border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-2 py-1.5"><code class="text-xs text-zinc-700 dark:text-zinc-200">${t('help_modal.how_to_submit.medals.li_pattern','Format: 1–5 digits, optional “.” with 1–2 decimals (e.g., 5550.23).')}</code></div>
           <div class="rounded-md border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-2 py-1.5">${t('help_modal.how_to_submit.medals.li_order','Required ordering: Bronze > Silver > Gold.')}</div>
         </div>
       </div>`
    );

    const optional = section(
      t('help_modal.how_to_submit.optional.title', '4) Optional'),
      `<ul class="mt-1 space-y-1.5 cursor-default">
        ${li(t('help_modal.how_to_submit.optional.li_title','Title: short optional title (max 128 chars).'))}
        ${li(t('help_modal.how_to_submit.optional.li_banner','Custom banner: JPG/PNG/WebP/AVIF ≤ 8MB, 16:9 recommended.'))}
        ${li(t('help_modal.how_to_submit.optional.li_description','Description: free text (if empty, “N/A”).'))}
        ${li(t('help_modal.how_to_submit.optional.li_guide','Guide URL(s): one URL per line; first valid URL is used.'))}
       </ul>`
    );

    const submit = section(
      t('help_modal.how_to_submit.submit.title', '5) Submit'),
      `<ul class="mt-1 space-y-1.5 cursor-default">
        ${li(t('help_modal.how_to_submit.submit.li_validation','Click “Submit”. The form validates creator, unique code, map name, checkpoints > 0, difficulty, category, ≥1 mechanic, ≥1 restriction, and medal consistency.'))}
        ${li(t('help_modal.how_to_submit.submit.li_confirmation','On success, a confirmation appears and the form resets.'))}
       </ul>`
    );

    const tips = section(
      t('help_modal.how_to_submit.tips.title', 'Tips'),
      `<ul class="mt-1 space-y-1.5 cursor-default">
        ${li(t('help_modal.how_to_submit.tips.li_edit','Fields with an “Edit” button can be corrected inline.'))}
        ${li(t('help_modal.how_to_submit.tips.li_guest','If you are not logged in, submission is locked and a “Login required” message is shown.'))}
        ${li(t('help_modal.how_to_submit.tips.li_support','If banner upload fails, try again (≤ 8MB) or contact support.'))}
       </ul>`
    );

    return `
      <div class="space-y-4">
        <h2 class="text-2xl font-bold tracking-tight">${t('help_modal.how_to_submit.title', 'How to submit a map')}</h2>
        ${intro}
        ${stepper}
        ${meta}
        ${required}
        ${medals}
        ${optional}
        ${submit}
        ${tips}
      </div>
    `;
  }

  if (kind === 'difficulty_techs_info') {
    const tf2 = (key, fb) => (typeof t === 'function' ? (t(key) ?? fb) : fb);

    const D = {
      beginner:  tf2('filters.beginner',     tf2('help_modal.difficulty_techs_info.labels.beginner',  'Beginner')),
      easy:      tf2('filters.easy',         tf2('help_modal.difficulty_techs_info.labels.easy',      'Easy')),
      medium:    tf2('filters.medium',       tf2('help_modal.difficulty_techs_info.labels.medium',    'Medium')),
      hard:      tf2('filters.hard',         tf2('help_modal.difficulty_techs_info.labels.hard',      'Hard')),
      very_hard: tf2('filters.very_hard',    tf2('help_modal.difficulty_techs_info.labels.very_hard', 'Very Hard')),
      extreme:   tf2('filters.extreme',      tf2('help_modal.difficulty_techs_info.labels.extreme',   'Extreme')),
      hell:      tf2('filters.hell',         tf2('help_modal.difficulty_techs_info.labels.hell',      'Hell')),
    };
    const DIFF_KEYS = ['beginner','easy','medium','hard','very_hard','extreme','hell'];

    const T = (k, fb) => tf2(`help_modal.difficulty_techs_info.techs.${k}`, fb);
    const ROWS = [
      { name: T('basics',        'Basics*'),        lv: [1,2,3,3,3,3,3] },
      { name: T('bhop',          'Bhop**'),         lv: [0,1,2,3,3,3,3] },
      { name: T('edge_climb',    'Edge Climb'),     lv: [0,1,2,3,3,3,3] },
      { name: T('stall',         'Stall'),          lv: [0,0,1,2,3,3,3] },
      { name: T('crouch_edge',   'Crouch Edge'),    lv: [0,0,1,2,3,3,3] },
      { name: T('save_climb',    'Save Climb'),     lv: [0,0,1,2,3,3,3] },
      { name: T('distance_edge', 'Distance Edge'),  lv: [0,0,0,1,2,3,3] },
      { name: T('high_edge',     'High Edge'),      lv: [0,0,0,1,2,3,3] },
      { name: T('multi_climb',   'Multi Climb'),    lv: [0,0,0,0,1,2,3] },
      { name: T('create_bhop',   'Create Bhop'),    lv: [0,0,0,0,1,2,3] },
    ];

    const legendCard = (cls, title, text) => `
      <div class="tech-legend-card flex items-start gap-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 p-3 cursor-default">
        <span class="tick ${cls} mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs">✓</span>
        <div class="space-y-0.5">
          <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">${title}</div>
          <div class="text-xs text-zinc-700 dark:text-zinc-300">${text}</div>
        </div>
      </div>
    `;

    const legend = `
      <div class="grid gap-3 sm:grid-cols-3">
        ${legendCard(
          'lv1',
          tf2('help_modal.difficulty_techs_info.legend.lv1_title', 'Simple / priority use'),
          tf2('help_modal.difficulty_techs_info.legend.lv1_desc',  'Simple and easy use with priority on the technique.')
        )}
        ${legendCard(
          'lv2',
          tf2('help_modal.difficulty_techs_info.legend.lv2_title', 'Common / sometimes advanced'),
          tf2('help_modal.difficulty_techs_info.legend.lv2_desc',  'Frequent common use and rare advanced forms.')
        )}
        ${legendCard(
          'lv3',
          tf2('help_modal.difficulty_techs_info.legend.lv3_title', 'Advanced / demanding'),
          tf2('help_modal.difficulty_techs_info.legend.lv3_desc',  'Complex and demanding use.')
        )}
      </div>
    `;

    const headCells = DIFF_KEYS.map(
      (k, colIndex) =>
        `<div class="tech-hcell text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-default" data-tech-col="${colIndex}">
          ${D[k]}
        </div>`
    ).join('');

    const mark = (n, rowIndex, colIndex) =>
      n
        ? `<div class="tech-cell flex items-center justify-center cursor-default" data-tech-row="${rowIndex}" data-tech-col="${colIndex}">
             <span class="tick ${n===1?'lv1':n===2?'lv2':'lv3'} inline-flex h-5 w-5 items-center justify-center rounded-full text-xs">✓</span>
           </div>`
        : `<div class="tech-cell cursor-default" data-tech-row="${rowIndex}" data-tech-col="${colIndex}"></div>`;

    const rowsHtml = ROWS.map(
      (r, rowIndex) => `
        <div class="tech-rlabel text-sm text-zinc-900 dark:text-zinc-100 cursor-default" data-tech-row="${rowIndex}">${r.name}</div>
        ${r.lv.map((n, colIndex) => mark(n, rowIndex, colIndex)).join('')}
      `
    ).join('');

    const table = `
      <div class="infos-scroll-x mt-2">
        <div class="infos-scroll-x-inner">
          <div class="tech-grid">
            <div></div>${headCells}
            ${rowsHtml}
          </div>
        </div>
      </div>
    `;

    const notes = `
      <div class="mt-2 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 p-3 text-xs text-zinc-700 dark:text-zinc-300 cursor-default">
        <div><span class="font-semibold">*</span> ${tf2('help_modal.difficulty_techs_info.notes.star', 'Double Jump / Slide / Wall Climb')}</div>
        <div><span class="font-semibold">**</span> ${tf2('help_modal.difficulty_techs_info.notes.double_star', 'Late Bhop / First Bhop / Emote Savebhop / Deathbhop')}</div>
      </div>
    `;

    const cardSection = (title, content) => `
      <section class="helpsec rounded-xl border border-zinc-200 dark:border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.02] p-4 sm:p-5 space-y-3 shadow-sm shadow-black/20">
        <div class="flex items-center gap-2">
          <h4 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">${title}</h4>
        </div>
        ${content}
      </section>
    `;

    return `
      <div class="space-y-4">
        <h2 class="text-2xl font-bold tracking-tight">${tf2('help_modal.difficulty_techs_info.matrix_title', 'Techniques by difficulty')}</h2>
        ${cardSection(tf2('help_modal.difficulty_techs_info.legend_title','Legend'), legend)}
        ${cardSection(tf2('help_modal.difficulty_techs_info.matrix_title','Techniques by difficulty'), table + notes)}
      </div>
    `;
  }

  return `
    <div class="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 p-4 text-sm text-zinc-700 dark:text-zinc-300 cursor-default">
      ${t('help_modal.common.soon', 'Coming soon.')}
    </div>
  `;
}

/* =========================
   UI ENHANCEMENTS
   ========================= */
function initInfosTabs() {
  const tabsContainer = document.getElementById('infosTabs');
  if (!tabsContainer) return;

  if (getComputedStyle(tabsContainer).position === 'static') {
    tabsContainer.style.position = 'relative';
  }

  const tabs   = Array.from(document.querySelectorAll('[data-infos-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-infos-group]'));
  if (!tabs.length) return;

  let highlight = document.getElementById('tabHighlight');
  if (!highlight) {
    highlight = document.createElement('span');
    highlight.id = 'tabHighlight';
    Object.assign(highlight.style, {
      position: 'absolute',
      top: '2px',
      bottom: '2px',
      left: '0',
      width: '0',
      borderRadius: '0.625rem',
      background: (document.documentElement.classList.contains('dark') || document.documentElement.getAttribute('data-theme') === 'dark' || document.body?.classList.contains('dark') || document.body?.getAttribute('data-theme') === 'dark') ? 'white' : '#18181b',
      boxShadow: (document.documentElement.classList.contains('dark') || document.documentElement.getAttribute('data-theme') === 'dark' || document.body?.classList.contains('dark') || document.body?.getAttribute('data-theme') === 'dark') ? '0 1px 0 0 rgba(255,255,255,.06), 0 8px 30px rgba(0,0,0,.25)' : '0 1px 0 0 rgba(0,0,0,.06), 0 12px 30px rgba(0,0,0,.14)',
      transform: 'translate3d(0,0,0)',
      transition: 'transform .28s cubic-bezier(.22,.9,.24,1), width .28s cubic-bezier(.22,.9,.24,1)',
      willChange: 'transform,width',
      zIndex: '0'
    });
    tabsContainer.appendChild(highlight);
  }

  tabs.forEach(btn => {
    btn.classList.add('cursor-pointer');
    btn.style.position = 'relative';
    btn.style.zIndex = '1';
  });

  const moveHighlightTo = (btn) => {
    if (!btn) return;
    const br = btn.getBoundingClientRect();
    const cr = tabsContainer.getBoundingClientRect();
    const left = br.left - cr.left;
    const width = br.width;
    requestAnimationFrame(() => {
      highlight.style.width = `${Math.max(0, width)}px`;
      highlight.style.transform = `translate3d(${Math.max(0, left)}px,0,0)`;
    });
  };

  const setActiveTab = (group, { updateUrl = true } = {}) => {
    tabs.forEach((btn) => {
      const isActive = btn.getAttribute('data-infos-tab') === group;

      if (isActive) {
        // Light: white text on dark highlight
        // Dark : dark text on white highlight
        btn.classList.remove(
          'text-zinc-700',
          'hover:bg-zinc-100',
          'dark:text-white',
          'dark:hover:bg-white/10'
        );
        btn.classList.add('text-white', 'dark:text-zinc-900');

        moveHighlightTo(btn);
      } else {
        btn.classList.remove('text-white', 'dark:text-zinc-900');
        btn.classList.add(
          'text-zinc-700',
          'hover:bg-zinc-100',
          'dark:text-white',
          'dark:hover:bg-white/10'
        );
      }
    });

    panels.forEach((panel) => {
      panel.hidden = panel.getAttribute('data-infos-group') !== group;
    });

    if (updateUrl) {
      const url = new URL(window.location.href);
      url.hash = `tab=${encodeURIComponent(group)}`;
      history.replaceState(null, '', url.toString());
    }
  };

  const getDesiredTab = () => {
    const hash = new URL(window.location.href).hash || '';
    const m = hash.match(/tab=([^&]+)/);
    if (m && m[1]) return decodeURIComponent(m[1]);
    const params = new URLSearchParams(window.location.search);
    return params.get('tab');
  };

  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.getAttribute('data-infos-tab');
      if (group) setActiveTab(group, { updateUrl: true });
    });
  });

  const desired = getDesiredTab();
  const initialBtn =
    (desired && document.querySelector(`[data-infos-tab="${desired}"]`)) ||
    document.querySelector('[data-infos-tab][data-active="true"]') ||
    tabs[0];

  requestAnimationFrame(() => {
    if (initialBtn) {
      setActiveTab(initialBtn.getAttribute('data-infos-tab'), { updateUrl: !!desired });
      moveHighlightTo(initialBtn);
    }
    const recalc = () => {
      const active =
        document.querySelector('[data-infos-tab].text-zinc-900') ||
        initialBtn;
      if (active) moveHighlightTo(active);
    };
    window.addEventListener('resize', recalc);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(recalc);
    } else {
      setTimeout(recalc, 60);
    }
  });
}

function initTechMatrixHover() {
  const headerCells = document.querySelectorAll('[data-tech-col]:not([data-tech-row])');
  const allCells = document.querySelectorAll('[data-tech-row][data-tech-col]');
  const rowLabels = document.querySelectorAll('.tech-rlabel[data-tech-row]');

  if (!headerCells.length && !rowLabels.length) return;

  function clearHighlight() {
    allCells.forEach((c) => c.classList.remove('tech-col-active', 'tech-row-active'));
    rowLabels.forEach((l) => l.classList.remove('tech-row-active'));
  }

  headerCells.forEach((h) => {
    const col = h.getAttribute('data-tech-col');
    h.classList.add('cursor-default');
    h.addEventListener('mouseenter', () => {
      clearHighlight();
      allCells.forEach((c) => {
        if (c.getAttribute('data-tech-col') === col) c.classList.add('tech-col-active');
      });
    });
    h.addEventListener('mouseleave', clearHighlight);
  });

  rowLabels.forEach((label) => {
    const row = label.getAttribute('data-tech-row');
    label.classList.add('cursor-default');
    label.addEventListener('mouseenter', () => {
      clearHighlight();
      rowLabels.forEach((l) => {
        if (l.getAttribute('data-tech-row') === row) l.classList.add('tech-row-active');
      });
      allCells.forEach((c) => {
        if (c.getAttribute('data-tech-row') === row) c.classList.add('tech-row-active');
      });
    });
    label.addEventListener('mouseleave', clearHighlight);
  });
}

function initPlaytestingAccordions() {
  const phases = document.querySelectorAll('[data-infos-kind="playtesting_info"] .pt-phase');
  if (!phases.length) return;

  phases.forEach((phase) => {
    const title = phase.querySelector('.pt-phase-title');
    const card  = phase.querySelector('.pt-card');
    if (!title || !card) return;

    card.classList.remove('pt-collapsed');

    title.classList.add('cursor-pointer');
    title.addEventListener('click', () => {
      card.classList.toggle('pt-collapsed');
    });
  });
}

/* =========================
   BOOTSTRAP PAGE
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  const slots = document.querySelectorAll('[data-infos-kind]');
  if (!slots.length) return;

  slots.forEach((el) => {
    const kind = el.getAttribute('data-infos-kind');
    if (!kind) return;

    if (kind === 'skill_score') {
      renderSkillScoreFormula(el);
      return;
    }

    if (kind === 'score_rank') {
      renderScoreRank(el);
      return;
    }

    let html = '';
    if (
      kind === 'rank_how_to_submit' ||
      kind === 'rank_submission_rules' ||
      kind === 'rank_info_thresholds' ||
      kind === 'rank_medals_thresholds'
    ) {
      html = renderRankHelpContent(kind);
    } else {
      html = renderMapHelpContent(kind);
    }

    el.innerHTML = html;
    decorateInfoSection(el);
  });

  const GROUP_BY_KIND = {
    rank_how_to_submit:     'skill_rank',
    rank_submission_rules:  'skill_rank',
    rank_info_thresholds:   'skill_rank',
    rank_medals_thresholds: 'skill_rank',
  };

  document.querySelectorAll('[data-infos-kind]').forEach((el) => {
    const kind = el.getAttribute('data-infos-kind');
    const desiredGroup = GROUP_BY_KIND[kind];
    if (desiredGroup) {
      el.setAttribute('data-infos-group', desiredGroup);
    }
  });

  initInfosTabs();
  initTechMatrixHover();
  initPlaytestingAccordions();
});
