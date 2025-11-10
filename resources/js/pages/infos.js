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

/* =========================
   RANK PROMOTION – content renderer
   ========================= */
function renderRankHelpContent(kind) {
  const tf = (key, fb) => (typeof t === 'function' ? (t(key) ?? fb) : fb);

  const li = (txt) => `
    <li class="help-li">
      <span class="dot"></span>
      <span class="text-sm text-zinc-200 leading-relaxed">${txt}</span>
    </li>
  `;

  const card = (title, content) => `
    <section
      class="rounded-xl border border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.02]
             p-4 sm:p-5 space-y-2 shadow-sm shadow-black/20
             transition-transform transition-colors duration-150
             hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-white/[.06]"
    >
      <div class="flex items-center gap-2">
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15">
          <svg class="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1 15-5-5 1.414-1.414L11 13.172l6.586-6.586L19 8z"/>
          </svg>
        </div>
        <h4 class="text-sm font-semibold text-zinc-100">${title}</h4>
      </div>
      ${content}
    </section>
  `;

  const callout = (text) => `
    <div
      class="rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-200
             px-3 py-2 text-sm font-medium leading-relaxed flex items-start gap-2"
    >
      <span class="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/30 text-[10px]">
        i
      </span>
      <span>${text}</span>
    </div>
  `;

  if (kind === 'rank_how_to_submit') {
    const title = tf(
      'help_modal.rank_promotion.how_to_submit.title',
      'Rank promotion · How to submit?'
    );

    const intro = callout(
      tf(
        'help_modal.rank_promotion.how_to_submit.intro',
        'To request a rank promotion, you must submit a completion (“record”) on a valid map and provide a quality rating.'
      )
    );

    const req = card(
      tf('help_modal.rank_promotion.how_to_submit.requirements.title', 'Requirements'),
      `
        <ul class="mt-1 space-y-2">
          ${li(
            tf(
              'help_modal.rank_promotion.how_to_submit.requirements.map_in_pool',
              'Complete a Genji Parkour map that is in the current map pool.'
            )
          )}
          ${li(
            tf(
              'help_modal.rank_promotion.how_to_submit.requirements.map_code_note',
              "Note: Maps that aren't currently accepted won't appear in the map code field."
            )
          )}
        </ul>
      `
    );

    const steps = card(
      tf('help_modal.rank_promotion.how_to_submit.steps.title', 'Steps'),
      `
        <ol class="mt-1 space-y-3 relative border-white/10 pl-4">
          ${[
            tf(
              'help_modal.rank_promotion.how_to_submit.steps.open_tab',
              'Open the “Submit completion” tab.'
            ),
            tf(
              'help_modal.rank_promotion.how_to_submit.steps.enter_code',
              'Enter the map code and your record time.'
            ),
            tf(
              'help_modal.rank_promotion.how_to_submit.steps.upload_screenshot',
              'Upload a screenshot (required) and optionally a video URL.'
            ),
            tf(
              'help_modal.rank_promotion.how_to_submit.steps.select_quality',
              'Select a quality rating (1–6).'
            ),
            tf('help_modal.rank_promotion.how_to_submit.steps.submit', 'Click “Submit record”.'),
            tf(
              'help_modal.rank_promotion.how_to_submit.steps.verification',
              'Your submission will go through a verification process.'
            ),
            tf(
              'help_modal.rank_promotion.how_to_submit.steps.notification',
              "Once verified, you'll receive a notification."
            ),
          ]
            .map(
              (text, idx) => `
            <li class="relative group">
              <div
                class="absolute -left-4 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900
                       ring-2 ring-emerald-500/60 text-xs font-semibold text-emerald-100
                       group-hover:bg-emerald-500/20 transition-colors"
              >
                ${idx + 1}
              </div>
              <p class="text-sm text-zinc-200 leading-relaxed group-hover:text-zinc-50 transition-colors">
                ${text}
              </p>
            </li>`
            )
            .join('')}
        </ol>
      `
    );

    const quality = card(
      tf('help_modal.rank_promotion.how_to_submit.quality.title', 'Quality rating scale'),
      `
        <div class="grid gap-2 sm:grid-cols-2">
          <div class="pt-req text-sm text-zinc-200">
            <span>${tf('help_modal.rank_promotion.how_to_submit.quality.six', '6: Excellent')}</span>
          </div>
          <div class="pt-req text-sm text-zinc-200">
            <span>${tf('help_modal.rank_promotion.how_to_submit.quality.five', '5: Great')}</span>
          </div>
          <div class="pt-req text-sm text-zinc-200">
            <span>${tf('help_modal.rank_promotion.how_to_submit.quality.four', '4: Good')}</span>
          </div>
          <div class="pt-req text-sm text-zinc-200">
            <span>${tf('help_modal.rank_promotion.how_to_submit.quality.three', '3: Average')}</span>
          </div>
          <div class="pt-req text-sm text-zinc-200">
            <span>${tf('help_modal.rank_promotion.how_to_submit.quality.two', '2: Subpar')}</span>
          </div>
          <div class="pt-req text-sm text-zinc-200">
            <span>${tf('help_modal.rank_promotion.how_to_submit.quality.one', '1: Poor')}</span>
          </div>
        </div>
      `
    );

    return `
      <div class="space-y-4">
        <h2 class="text-2xl font-bold tracking-tight">${title}</h2>
        ${intro}
        ${req}
        ${steps}
        ${quality}
      </div>
    `;
  }

  if (kind === 'rank_submission_rules') {
    const liInner = (txt) => `
      <li class="help-li">
        <span class="dot"></span>
        <span class="text-sm text-zinc-200 leading-relaxed">${txt}</span>
      </li>
    `;

    const cardInner = (title, content) => `
      <section
        class="rounded-xl border border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.02]
               p-4 sm:p-5 space-y-2 shadow-sm shadow-black/20"
      >
        <div class="flex items-center gap-2">
          <div class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15">
            <svg class="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1 15-5-5 1.414-1.414L11 13.172l6.586-6.586L19 8z"/>
            </svg>
          </div>
          <h4 class="text-sm font-semibold text-zinc-100">${title}</h4>
        </div>
        ${content}
      </section>
    `;

    const warn = (text) => `
      <div
        class="rounded-lg border border-amber-400/40 bg-amber-500/10 text-amber-100
               px-3 py-2 text-sm font-medium leading-relaxed flex items-start gap-2"
      >
        <span class="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/20">
          ⚠
        </span>
        <span>${text}</span>
      </div>
    `;

    const completion = cardInner(
      tf(
        'help_modal.rank_promotion.submission_rules.completion.title',
        'Completion Requirements/Guidelines'
      ),
      `
        <ul class="mt-1 space-y-2">
          ${liInner(
            tf(
              'help_modal.rank_promotion.submission_rules.completion.li_code_match',
              'Map code in the screenshot must match the map code in the bot.'
            )
          )}
          ${liInner(
            tf(
              'help_modal.rank_promotion.submission_rules.completion.li_time_display',
              'Time must be displayed in either the Top 5 leaderboard or as the announcement in the middle of the screen. For video submissions, it must show both.'
            )
          )}
          ${liInner(
            tf(
              'help_modal.rank_promotion.submission_rules.completion.li_no_edit_map',
              'You cannot edit the map in any way using Custom Game settings, Workshop Settings, or any other Workshop code. This includes but is not limited to changing tech bans, gravity, etc.'
            )
          )}
          ${liInner(
            tf(
              'help_modal.rank_promotion.submission_rules.completion.li_no_scripts',
              'You are not allowed to use scripts, macros, or anything similar to complete any portion of a map.'
            )
          )}
          ${liInner(
            tf(
              'help_modal.rank_promotion.submission_rules.completion.li_no_banned_tech',
              'You may not use a banned tech (restricted via map author / listed in @GenjiBot#9209) where the ban is non-functional due to Workshop bugs.'
            )
          )}
        </ul>
      `
    );

    const records = cardInner(
      tf('help_modal.rank_promotion.submission_rules.records.title', 'Records Only'),
      `
        <ul class="mt-1 space-y-2">
          ${liInner(
            tf(
              'help_modal.rank_promotion.submission_rules.records.li_time_visible',
              'Time must be fully visible from 0.00 to the finish. Do not fade in or out while the timer is running.'
            )
          )}
          ${liInner(
            tf(
              'help_modal.rank_promotion.submission_rules.records.li_video_required',
              'Video proof is required for World Records and Medals.'
            )
          )}
          ${liInner(
            tf(
              'help_modal.rank_promotion.submission_rules.records.li_no_cuts',
              'Cuts in the video are not allowed (between 0.00 and finish).'
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
              'Editing before and after is allowed, but it cannot interfere with the timer or any ability to validate the submission.'
            )
          )}
        </ul>
      `
    );

    const disclaimer = warn(
      tf(
        'help_modal.rank_promotion.submission_rules.reserve_rights',
        'Senseis reserve the right to deny any submission for any reason, regardless if it is listed here or not.'
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

  if (kind === 'rank_info_thresholds') {
    const li = (txt) => `
      <li class="help-li">
        <span class="dot"></span>
        <span class="text-sm text-zinc-200 leading-relaxed">${txt}</span>
      </li>
    `;

    const info = card(
      tf('help_modal.rank_promotion.rank_info_thresholds.info.title', 'Ranks Info'),
      `
        <ul class="mt-1 space-y-2">
          ${li(
            tf(
              'help_modal.rank_promotion.rank_info_thresholds.info.li_no_order',
              'Ranks do not need to be acquired in order.'
            )
          )}
          ${li(
            tf(
              'help_modal.rank_promotion.rank_info_thresholds.info.li_requirement',
              'To receive a rank you must complete the required amount of maps for that difficulty/rank.'
            )
          )}
          ${li(
            tf(
              'help_modal.rank_promotion.rank_info_thresholds.info.li_thresholds',
              'See chart below for rank thresholds.'
            )
          )}
        </ul>
      `
    );

    const F = (k, fb) => tf(`filters.${k}`, fb);
    const R = (k, p, fb) =>
      tf(`help_modal.rank_promotion.rank_info_thresholds.rows.${k}.${p}`, fb);
    const CL = tf(
      'help_modal.rank_promotion.rank_info_thresholds.table.completions_label',
      'completions'
    );
    const NA = tf('help_modal.rank_promotion.rank_info_thresholds.table.na', 'N/A');

    const ranks = [
      {
        key: 'ninja',
        diff: F('beginner', 'Beginner'),
        count: null,
        img: R('ninja', 'image', '/assets/ranks/ninja.webp'),
      },
      {
        key: 'jumper',
        diff: F('easy', 'Easy'),
        count: 10,
        img: R('jumper', 'image', '/assets/ranks/jumper.webp'),
      },
      {
        key: 'skilled',
        diff: F('medium', 'Medium'),
        count: 10,
        img: R('skilled', 'image', '/assets/ranks/skilled.webp'),
      },
      {
        key: 'pro',
        diff: F('hard', 'Hard'),
        count: 10,
        img: R('pro', 'image', '/assets/ranks/pro.webp'),
      },
      {
        key: 'master',
        diff: F('very_hard', 'Very Hard'),
        count: 10,
        img: R('master', 'image', '/assets/ranks/master.webp'),
      },
      {
        key: 'grand_master',
        diff: F('extreme', 'Extreme'),
        count: 7,
        img: R('grand_master', 'image', '/assets/ranks/grand_master.webp'),
      },
      {
        key: 'god',
        diff: F('hell', 'Hell'),
        count: 3,
        img: R('god', 'image', '/assets/ranks/god.webp'),
      },
    ];

    const cardRank = (r) => `
      <div
        class="rank-card relative rounded-xl border border-white/10 bg-zinc-900/60
               p-4 flex flex-col justify-between overflow-hidden
               transition-transform duration-150 hover:-translate-y-0.5 hover:border-emerald-400/40"
      >
        <div class="absolute inset-x-0 top-0 h-10 pointer-events-none"></div>
        <div class="flex items-center gap-3 relative z-10">
          <img
            src="${r.img}"
            alt="${R(r.key, 'name', r.key)} badge"
            class="rank-img h-10 w-10 rounded-lg object-contain shadow-sm shadow-black/40"
            loading="lazy"
          >
          <div class="min-w-0">
            <div class="rank-name text-sm font-semibold text-zinc-100 truncate">
              ${R(r.key, 'name', r.key)}
            </div>
            <div class="rank-diff text-xs text-zinc-400">${r.diff}</div>
          </div>
        </div>
        <div class="rank-count mt-3 text-sm text-zinc-300 relative z-10">
          ${
            r.count == null
              ? `<span class="opacity-70">— ${NA}</span>`
              : `<strong class="text-zinc-100">${r.count}</strong> <span class="opacity-80">${CL}</span>`
          }
        </div>
      </div>
    `;

    const grid = card(
      tf(
        'help_modal.rank_promotion.rank_info_thresholds.table.title',
        'Rank & Difficulty chart'
      ),
      `<div class="rank-grid mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">${ranks
        .map(cardRank)
        .join('')}</div>`
    );

    return `<div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">
        ${tf('help_modal.rank_promotion.rank_info_thresholds.info.title', 'Ranks Info')}
      </h2>
      ${info}${grid}
    </div>`;
  }

  if (kind === 'rank_medals_thresholds') {
    const li = (txt) => `
      <li class="help-li">
        <span class="dot"></span>
        <span class="text-sm text-zinc-200 leading-relaxed">${txt}</span>
      </li>
    `;

    const info = card(
      tf('help_modal.rank_promotion.medals_info_thresholds.info.title', 'Medals Info'),
      `
        <ul class="mt-1 space-y-2">
          ${li(
            tf(
              'help_modal.rank_promotion.medals_info_thresholds.info.li_plus_explain',
              'To get a +, ++ or +++ rank, you must obtain the same amount of Bronze, Silver, or Gold medals as the rank normally requires (see chart below).'
            )
          )}
          ${li(
            tf(
              'help_modal.rank_promotion.medals_info_thresholds.info.li_time_and_video_required',
              'You must post a completion which includes a time and a video URL showing your run.'
            )
          )}
          ${li(
            tf(
              'help_modal.rank_promotion.medals_info_thresholds.info.li_icon_next_to_name',
              'You will get an icon next to your name if you have a plus (+, ++, +++) rank!'
            )
          )}
          ${li(
            tf(
              'help_modal.rank_promotion.medals_info_thresholds.info.li_auto_receive',
              "Once verified, you'll automatically receive your medal."
            )
          )}
          ${li(
            tf(
              'help_modal.rank_promotion.medals_info_thresholds.info.li_retroactive_credit',
              'If medals are added to a map after you have already submitted, you will still get credit.'
            )
          )}
        </ul>
      `
    );

    const D = {
      beginner: tf('filters.beginner', 'Beginner'),
      easy: tf('filters.easy', 'Easy'),
      medium: tf('filters.medium', 'Medium'),
      hard: tf('filters.hard', 'Hard'),
      very_hard: tf('filters.very_hard', 'Very Hard'),
      extreme: tf('filters.extreme', 'Extreme'),
      hell: tf('filters.hell', 'Hell'),
    };
    const DIFF_KEYS = ['beginner', 'easy', 'medium', 'hard', 'very_hard', 'extreme', 'hell'];

    const COUNTS = { beginner: null, easy: 10, medium: 10, hard: 10, very_hard: 10, extreme: 7, hell: 3 };

    const medalImg = (k) =>
      tf(`help_modal.rank_promotion.medals_info_thresholds.images.${k}`, `/assets/medals/${k}.png`);

    const ML = tf(
      'help_modal.rank_promotion.medals_info_thresholds.table.completions_label',
      'medals'
    );
    const NA = tf('help_modal.rank_promotion.medals_info_thresholds.table.na', 'N/A');

    const MEDALS = [
      {
        key: 'gold',
        label: tf(
          'help_modal.rank_promotion.medals_info_thresholds.table.medal_gold',
          'Gold'
        ),
        src: medalImg('gold'),
      },
      {
        key: 'silver',
        label: tf(
          'help_modal.rank_promotion.medals_info_thresholds.table.medal_silver',
          'Silver'
        ),
        src: medalImg('silver'),
      },
      {
        key: 'bronze',
        label: tf(
          'help_modal.rank_promotion.medals_info_thresholds.table.medal_bronze',
          'Bronze'
        ),
        src: medalImg('bronze'),
      },
    ];

    const head = DIFF_KEYS.map(
      (k, colIndex) =>
        `<div class="tech-hcell text-xs font-medium text-zinc-300 cursor-pointer" data-tech-col="${colIndex}">
           ${D[k]}
         </div>`
    ).join('');

    const cell = (count, rowIndex, colIndex) =>
      `<div
        class="tech-cell text-sm text-zinc-200 px-2 rounded-lg"
        data-tech-row="${rowIndex}"
        data-tech-col="${colIndex}"
      >
        ${
          count == null
            ? `<span class="opacity-70 cursor-help" title="${NA}">${NA}</span>`
            : `<strong class="text-zinc-100">${count}</strong> <span class="opacity-80">${ML}</span>`
        }
      </div>`;

    const rows = MEDALS.map(
      (m, rowIndex) => `
      <div
        class="tech-rlabel flex items-center gap-2 px-2 rounded-lg text-sm text-zinc-100 cursor-pointer"
        data-tech-row="${rowIndex}"
      >
        <img src="${m.src}" alt="${m.label}" class="h-5 w-5 object-contain" loading="lazy">
        <span>${m.label}</span>
      </div>
      ${DIFF_KEYS.map((k, colIndex) => cell(COUNTS[k], rowIndex, colIndex)).join('')}
    `
    ).join('');

    const cardTable = (title, content) => card(title, content);

    const table = cardTable(
      tf(
        'help_modal.rank_promotion.medals_info_thresholds.table.title',
        'Medal thresholds by difficulty'
      ),
      `
        <div class="infos-scroll-x mt-2">
          <div class="infos-scroll-x-inner">
            <div class="tech-grid">
              <div></div>${head}
              ${rows}
            </div>
          </div>
        </div>
      `
    );

    return `<div class="space-y-4">
      <h2 class="text-2xl font-bold tracking-tight">
        ${tf('help_modal.rank_promotion.medals_info_thresholds.info.title', 'Medals Info')}
      </h2>
      ${info}${table}
    </div>`;
  }

  return `
    <div class="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
      ${tf('help_modal.common.soon', 'Coming soon.')}
    </div>
  `;
}

/* =========================
   MAP HELP CONTENT
   ========================= */
function renderMapHelpContent(kind) {
  const tf = (key, fallback) => (typeof t === 'function' ? (t(key) ?? fallback) : fallback);

  // PLAYTESTING INFO
  if (kind === 'playtesting_info') {
    const li = (txt) => `
      <li class="help-li">
        <span class="dot"></span>
        <span class="text-sm text-zinc-200 leading-relaxed">${txt}</span>
      </li>
    `;

    const card = (title, content) => `
      <section
        class="rounded-xl border border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.02]
               p-4 sm:p-5 space-y-2 shadow-sm shadow-black/20"
      >
        <div class="flex items-center gap-2">
          <div class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15">
            <svg class="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1 15-5-5 1.414-1.414L11 13.172l6.586-6.586L19 8z"/>
            </svg>
          </div>
          <h4 class="text-sm font-semibold text-zinc-100">${title}</h4>
        </div>
        ${content}
      </section>
    `;

    const callout = (text) => `
      <div
        class="rounded-lg border border-rose-500/25 bg-rose-500/10 text-rose-200
               px-3 py-2 text-sm font-medium leading-relaxed flex items-start gap-2"
      >
        <span class="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-rose-500/30 text-[10px]">
          !
        </span>
        <span>${text}</span>
      </div>
    `;

    const eligibility = callout(
      tf(
        'help_modal.playtesting_info.must_submit_completion',
        'You must have submitted a completion for the map to vote!'
      )
    );

    const rules = card(
      tf('help_modal.playtesting_info.rules.title', 'Playtesting rules'),
      `
        <ul class="mt-1 space-y-2">
          ${li(
            tf(
              'help_modal.playtesting_info.rules.needs_votes_and_completions',
              'Each difficulty requires a specific amount of votes and completion submissions.'
            )
          )}
          ${li(
            tf(
              'help_modal.playtesting_info.rules.creator_cannot_vote',
              'Creators cannot vote for their own map; their map submission contains their best estimate of difficulty.'
            )
          )}
          ${li(
            tf(
              'help_modal.playtesting_info.rules.playtesters_give_tips',
              'Playtesters will provide tips to the creator on how to improve the map, or what must change if there are glaring issues.'
            )
          )}
        </ul>
      `
    );

    const V = (k, fb) => tf(`help_modal.playtesting_info.votes.${k}`, fb);
    const VC = (k, fb) => tf(`help_modal.playtesting_info.votes.counts.${k}`, fb);

    const voteRow = (lk, lf, ck, cf) => `
      <div class="pt-req flex items-center justify-between rounded-lg bg-zinc-900/40 px-3 py-2">
        <span class="text-sm text-zinc-200">${V(lk, lf)}</span>
        <strong class="text-sm text-zinc-100">${VC(ck, cf)}</strong>
      </div>
    `;

    const votes = card(
      V('title', 'Required votes'),
      `
        <div class="grid gap-2 mt-1">
          ${voteRow('beginner_to_hard', 'Beginner → Hard', 'beginner_to_hard', `5 ${V('votes', 'votes')}`)}
          ${voteRow('very_hard', 'Very Hard', 'very_hard', `3 ${V('votes', 'votes')}`)}
          ${voteRow('extreme', 'Extreme', 'extreme', `2 ${V('votes', 'votes')}`)}
          ${voteRow('hell', 'Hell', 'hell', `1 ${V('vote', 'vote')}`)}
        </div>
      `
    );

    const rulesAndVotes = `
      <div class="grid gap-4 lg:grid-cols-5">
        <div class="lg:col-span-3">${rules}</div>
        <div class="lg:col-span-2">${votes}</div>
      </div>
    `;

    const P = (k, fb) => tf(`help_modal.playtesting_info.process.${k}`, fb);
    const PS = (k, fb) => tf(`help_modal.playtesting_info.process.steps.${k}`, fb);
    const PN = (k, fb) => tf(`help_modal.playtesting_info.process.notes.${k}`, fb);

    const process = card(
      P('title', 'Process'),
      `
      <div class="help-pt pt-grid">
        <!-- Creation -->
        <div class="pt-phase bg-zinc-900/60">
          <div class="pt-phase-title text-xs font-semibold uppercase tracking-wide text-zinc-400">
            ${P('creation','Creation Phase')}
          </div>
          <div class="pt-card mt-2 space-y-1.5">
            <div class="pt-step text-sm text-zinc-200">${PS('map_is_made','Map is made')}</div>
            <div class="pt-step text-sm text-zinc-200">${PS('map_submission_form','Map submission form')}</div>
            <div class="pt-note text-xs text-zinc-400">${PN('change_only_by_sensei','Changing map details can only be done via a Sensei (restrictions, code, etc.).')}</div>
          </div>
        </div>

        <div class="pt-arrow" aria-hidden="true"></div>

        <!-- Testing -->
        <div class="pt-phase bg-zinc-900/60">
          <div class="pt-phase-title text-xs font-semibold uppercase tracking-wide text-zinc-400">
            ${P('testing','Testing Phase')}
          </div>
          <div class="pt-card mt-2 space-y-1.5">
            <div class="pt-step text-sm text-zinc-200">${PS('creator_suggests_difficulty','Creator suggests difficulty')}</div>
            <div class="pt-step text-sm text-zinc-200">${PS('testers_submit_completion','Testers submit completion')}</div>
            <div class="pt-step text-sm text-zinc-200">${PS('testers_vote_on_difficulty','Testers vote on difficulty')}</div>
            <div class="pt-step text-sm text-zinc-200">${PS('creator_finalizes_submission','Creator finalizes submission')}</div>
          </div>
        </div>

        <div class="pt-arrow" aria-hidden="true"></div>

        <!-- Verification -->
        <div class="pt-phase bg-zinc-900/60">
          <div class="pt-phase-title text-xs font-semibold uppercase tracking-wide text-zinc-400">
            ${P('verification','Verification Phase')}
          </div>
          <div class="pt-card mt-2 space-y-1.5">
            <div class="pt-step text-sm text-zinc-200">${PS('sensei_receive_submission_notification','Sensei receive submission notification')}</div>
            <div class="pt-step flex items-center gap-2 text-sm text-zinc-200">
              <span class="pt-chip pt-chip-accept inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-200">
                ${PS('accept','accept')}
              </span>
              <span class="pt-chip pt-chip-reject inline-flex items-center rounded-full bg-rose-500/15 px-2 py-0.5 text-xs text-rose-200">
                ${PS('reject','reject')}
              </span>
            </div>
            <div class="pt-step text-sm text-zinc-200">${PS('map_sent_back_previous_step','Map is sent back to a previous step*')}</div>
            <div class="pt-note text-xs text-zinc-400">${PN('verification_removal','* Completions and votes may be removed at this step.')}</div>
          </div>
        </div>

        <div class="pt-arrow" aria-hidden="true"></div>

        <!-- Acceptance -->
        <div class="pt-phase bg-zinc-900/60">
          <div class="pt-phase-title text-xs font-semibold uppercase tracking-wide text-zinc-400">
            ${P('acceptance','Acceptance')}
          </div>
          <div class="pt-card mt-2 space-y-1.5">
            <div class="pt-step text-sm text-zinc-200">${PS('map_accepted','Map accepted')}</div>
            <div class="pt-step text-sm text-zinc-200">${PS('map_added_to_pool','Map added to map pool')}</div>
            <div class="pt-step text-sm text-zinc-200">${PS('testers_granted_completion_without_time','Testers granted completion (without time)')}</div>
          </div>
        </div>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <span class="inline-flex items-center gap-1">
          <span class="pt-chip pt-chip-accept inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-200">
            ${PS('accept','accept')}
          </span>
          <span class="ml-1">= Sensei approval</span>
        </span>
        <span class="inline-flex items-center gap-1">
          <span class="pt-chip pt-chip-reject inline-flex items-center rounded-full bg-rose-500/15 px-2 py-0.5 text-[11px] text-rose-200">
            ${PS('reject','reject')}
          </span>
          <span class="ml-1">= ${PS('map_sent_back_previous_step','Map is sent back to a previous step*')}</span>
        </span>
      </div>

      <p class="mt-2 text-xs text-zinc-400">${PN(
        'sensei_power',
        'At any point, a Sensei has the ability to manually force any outcome or revert to any step.'
      )}</p>
      `
    );

    return `
      <div class="space-y-4">
        <h2 class="text-2xl font-bold tracking-tight">
          ${tf('help_modal.playtesting_info.title', 'Playtesting')}
        </h2>
        ${eligibility}
        ${rulesAndVotes}
        ${process}
      </div>
    `;
  }

  // HOW TO SUBMIT (map submit)
  if (kind === 'how_to_submit') {
    const li = (txt) => `
      <li class="help-li">
        <span class="dot"></span>
        <span class="text-sm text-zinc-200">${txt}</span>
      </li>
    `;

    const section = (title, content) => `
      <section
        class="helpsec rounded-xl border border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.02]
               p-4 sm:p-5 space-y-2 shadow-sm shadow-black/20"
      >
        <div class="flex items-center gap-2">
          <div class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15">
            <svg class="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1 15-5-5 1.414-1.414L11 13.172l6.586-6.586L19 8z"/>
            </svg>
          </div>
          <h4 class="text-sm font-semibold text-zinc-100">${title}</h4>
        </div>
        ${content}
      </section>
    `;

    const callout = (text) => `
      <div class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-200 px-3 py-2 text-sm">
        ${text}
      </div>
    `;

    const introText = tf(
      'help_modal.how_to_submit.intro',
      'This dialog walks you through every step of the “Submit map” section.'
    );
    const intro = introText ? callout(introText) : '';

    const stepper = `
      <ol class="mb-3 flex flex-wrap gap-2 text-xs text-zinc-300">
        ${['Metadata', 'Required', 'Medals', 'Optional', 'Submit']
          .map(
            (label, idx) => `
            <li class="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1">
              <span class="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-200">
                ${idx + 1}
              </span>
              <span>${label}</span>
            </li>`
          )
          .join('')}
      </ol>
    `;

    const meta = section(
      tf('help_modal.how_to_submit.meta.title', '1) Metadata (map & creators)'),
      `<ul class="mt-1 space-y-1.5">
        ${li(
          tf(
            'help_modal.how_to_submit.meta.li_creator',
            'Main creator: it is auto-filled from your session. You can change it (and add co-creators if the option is visible).'
          )
        )}
        ${li(
          tf(
            'help_modal.how_to_submit.meta.li_code',
            'Map code: click “Edit” next to the “Code” field. The code must be unique (we check if it already exists).'
          )
        )}
        ${li(
          tf(
            'help_modal.how_to_submit.meta.li_name',
            'Map name: click “Edit” next to “Map name” and pick a name via autocomplete.'
          )
        )}
        ${li(
          tf(
            'help_modal.how_to_submit.meta.li_checkpoints',
            'Checkpoints: click “Edit” and enter a strictly positive number.'
          )
        )}
      </ul>`
    );
    const required = section(
      tf('help_modal.how_to_submit.required.title', '2) Required fields'),
      `<p class="text-sm text-zinc-300">${tf(
        'help_modal.how_to_submit.required.p1',
        'These fields must be provided before you can submit:'
      )}</p>
       <ul class="mt-2 space-y-1.5">
        ${li(tf('help_modal.how_to_submit.required.li_difficulty', 'Difficulty: choose a value (Easy → Hell).'))}
        ${li(
          tf(
            'help_modal.how_to_submit.required.li_category',
            'Category / Map type: choose a type (e.g., Classic, Increasing Difficulty).'
          )
        )}
        ${li(tf('help_modal.how_to_submit.required.li_mechanics', 'Mechanics: select at least one.'))}
        ${li(tf('help_modal.how_to_submit.required.li_restrictions', 'Restrictions: select at least one.'))}
       </ul>`
    );
    const medals = section(
      tf('help_modal.how_to_submit.medals.title', '3) Medals (optional but validated if present)'),
      `<p class="text-sm text-zinc-300">${tf(
        'help_modal.how_to_submit.medals.p1',
        'You may define times (in seconds) for Gold, Silver, and Bronze.'
      )}</p>
       <div class="mt-2 rounded-md border border-white/10 bg-zinc-900/50 p-3 text-xs text-zinc-300">
         <div class="font-medium mb-1">${tf(
           'help_modal.how_to_submit.medals.li_rules',
           'If you set one medal, you must set all three.'
         )}</div>
         <div class="grid gap-2 sm:grid-cols-3">
           <div class="rounded-md border border-white/10 bg-white/5 px-2 py-1.5">
             <span class="text-amber-500 font-semibold">Bronze</span> &gt;
             <span class="text-zinc-200">Silver</span> &gt;
             <span class="text-yellow-300">Gold</span>
           </div>
           <div class="rounded-md border border-white/10 bg-white/5 px-2 py-1.5">
             <code class="text-xs text-zinc-200">${tf(
               'help_modal.how_to_submit.medals.li_pattern',
               'Format: 1–5 digits, optionally “.” and 1–2 decimals (e.g., 5550.23). Non-negative values.'
             )}</code>
           </div>
           <div class="rounded-md border border-white/10 bg-white/5 px-2 py-1.5">
             ${tf(
               'help_modal.how_to_submit.medals.li_order',
               'Required ordering: Bronze > Silver > Gold (Bronze greater than Silver, which is greater than Gold).'
             )}
           </div>
         </div>
       </div>`
    );
    const optional = section(
      tf('help_modal.how_to_submit.optional.title', '4) Optional'),
      `<ul class="mt-1 space-y-1.5">
        ${li(
          tf('help_modal.how_to_submit.optional.li_title', 'Title: short optional title (max 128 chars).')
        )}
        ${li(
          tf(
            'help_modal.how_to_submit.optional.li_banner',
            'Custom banner: drag & drop or click to upload (JPG/PNG/WebP/AVIF), size ≤ 8MB. 16:9 recommended.'
          )
        )}
        ${li(
          tf(
            'help_modal.how_to_submit.optional.li_description',
            'Description: free text (if empty, “N/A” is shown).'
          )
        )}
        ${li(
          tf(
            'help_modal.how_to_submit.optional.li_guide',
            'Guide URL(s): one URL per line. The first valid URL is used.'
          )
        )}
       </ul>`
    );
    const submit = section(
      tf('help_modal.how_to_submit.submit.title', '5) Submit'),
      `<ul class="mt-1 space-y-1.5">
        ${li(
          tf(
            'help_modal.how_to_submit.submit.li_validation',
            'Click “Submit”. The form validates: main creator, unique code, map name, checkpoints > 0, difficulty, category, ≥1 mechanic and ≥1 restriction, and medal consistency if present.'
          )
        )}
        ${li(
          tf(
            'help_modal.how_to_submit.submit.li_confirmation',
            'On success, a confirmation toast appears and the form resets.'
          )
        )}
       </ul>`
    );
    const tips = section(
      tf('help_modal.how_to_submit.tips.title', 'Tips'),
      `<ul class="mt-1 space-y-1.5">
        ${li(
          tf('help_modal.how_to_submit.tips.li_edit', 'Fields with an “Edit” button can be quickly corrected inline.')
        )}
        ${li(
          tf(
            'help_modal.how_to_submit.tips.li_guest',
            'If you are not logged in, submission is locked and a “Login required” message is shown.'
          )
        )}
        ${li(
          tf(
            'help_modal.how_to_submit.tips.li_support',
            'If banner upload fails, try again (≤ 8MB) or contact support.'
          )
        )}
       </ul>`
    );

    return `
      <div class="space-y-4">
        <h2 class="text-2xl font-bold tracking-tight">
          ${tf('help_modal.how_to_submit.title', 'How to submit a map')}
        </h2>
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

  // DIFFICULTY & TECHS INFO
  if (kind === 'difficulty_techs_info') {
    const tf2 = (key, fb) => (typeof t === 'function' ? (t(key) ?? fb) : fb);

    const D = {
      beginner: tf2('filters.beginner', tf2('help_modal.difficulty_techs_info.labels.beginner', 'Beginner')),
      easy: tf2('filters.easy', tf2('help_modal.difficulty_techs_info.labels.easy', 'Easy')),
      medium: tf2('filters.medium', tf2('help_modal.difficulty_techs_info.labels.medium', 'Medium')),
      hard: tf2('filters.hard', tf2('help_modal.difficulty_techs_info.labels.hard', 'Hard')),
      very_hard: tf2('filters.very_hard', tf2('help_modal.difficulty_techs_info.labels.very_hard', 'Very Hard')),
      extreme: tf2('filters.extreme', tf2('help_modal.difficulty_techs_info.labels.extreme', 'Extreme')),
      hell: tf2('filters.hell', tf2('help_modal.difficulty_techs_info.labels.hell', 'Hell')),
    };
    const DIFF_KEYS = ['beginner', 'easy', 'medium', 'hard', 'very_hard', 'extreme', 'hell'];

    const T = (k, fb) => tf2(`help_modal.difficulty_techs_info.techs.${k}`, fb);
    const ROWS = [
      { name: T('basics', 'Basics*'), lv: [1, 2, 3, 3, 3, 3, 3] },
      { name: T('bhop', 'Bhop**'), lv: [0, 1, 2, 3, 3, 3, 3] },
      { name: T('edge_climb', 'Edge Climb'), lv: [0, 1, 2, 3, 3, 3, 3] },
      { name: T('stall', 'Stall'), lv: [0, 0, 1, 2, 3, 3, 3] },
      { name: T('crouch_edge', 'Crouch Edge'), lv: [0, 0, 1, 2, 3, 3, 3] },
      { name: T('save_climb', 'Save Climb'), lv: [0, 0, 1, 2, 3, 3, 3] },
      { name: T('distance_edge', 'Distance Edge'), lv: [0, 0, 0, 1, 2, 3, 3] },
      { name: T('high_edge', 'High Edge'), lv: [0, 0, 0, 1, 2, 3, 3] },
      { name: T('multi_climb', 'Multi Climb'), lv: [0, 0, 0, 0, 1, 2, 3] },
      { name: T('create_bhop', 'Create Bhop'), lv: [0, 0, 0, 0, 1, 2, 3] },
    ];

    const legendCard = (cls, title, text) => `
      <div class="tech-legend-card flex items-start gap-2 rounded-lg bg-zinc-900/50 p-3">
        <span class="tick ${cls} mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs">
          ✓
        </span>
        <div class="space-y-0.5">
          <div class="text-sm font-semibold text-zinc-100">${title}</div>
          <div class="text-xs text-zinc-300">${text}</div>
        </div>
      </div>
    `;

    const legend = `
      <div class="grid gap-3 sm:grid-cols-3">
        ${legendCard(
          'lv1',
          tf2('help_modal.difficulty_techs_info.legend.lv1_title', 'Simple / priority use'),
          tf2(
            'help_modal.difficulty_techs_info.legend.lv1_desc',
            'Simple and easy use of the technique with priority on it.'
          )
        )}
        ${legendCard(
          'lv2',
          tf2('help_modal.difficulty_techs_info.legend.lv2_title', 'Common / sometimes advanced'),
          tf2(
            'help_modal.difficulty_techs_info.legend.lv2_desc',
            'Frequent use of the common technique and rare use of advanced forms.'
          )
        )}
        ${legendCard(
          'lv3',
          tf2('help_modal.difficulty_techs_info.legend.lv3_title', 'Advanced / demanding'),
          tf2(
            'help_modal.difficulty_techs_info.legend.lv3_desc',
            'Complex and demanding use of the technique.'
          )
        )}
      </div>
    `;

    const headCells = DIFF_KEYS.map(
      (k, colIndex) =>
        `<div class="tech-hcell text-xs font-medium text-zinc-300 cursor-pointer" data-tech-col="${colIndex}">
          ${D[k]}
        </div>`
    ).join('');

    const mark = (n, rowIndex, colIndex) =>
      n
        ? `<div class="tech-cell flex items-center justify-center" data-tech-row="${rowIndex}" data-tech-col="${colIndex}">
            <span class="tick ${
              n === 1 ? 'lv1' : n === 2 ? 'lv2' : 'lv3'
            } inline-flex h-5 w-5 items-center justify-center rounded-full text-xs">✓</span>
           </div>`
        : `<div class="tech-cell" data-tech-row="${rowIndex}" data-tech-col="${colIndex}"></div>`;

    const rowsHtml = ROWS.map(
      (r, rowIndex) => `
      <div class="tech-rlabel text-sm text-zinc-100 cursor-pointer" data-tech-row="${rowIndex}">${r.name}</div>
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
      <div class="mt-2 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-zinc-300">
        <div><span class="font-semibold">*</span> ${tf2(
          'help_modal.difficulty_techs_info.notes.star',
          'Double Jump / Slide / Wall Climb'
        )}</div>
        <div><span class="font-semibold">**</span> ${tf2(
          'help_modal.difficulty_techs_info.notes.double_star',
          'Late Bhop / First Bhop / Emote Savebhop / Deathbhop'
        )}</div>
      </div>
    `;

    const cardSection = (title, content) => `
      <section
        class="helpsec rounded-xl border border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.02]
               p-4 sm:p-5 space-y-3 shadow-sm shadow-black/20"
      >
        <div class="flex items-center gap-2">
          <div class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15">
            <svg class="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1 15-5-5 1.414-1.414L11 13.172l6.586-6.586L19 8z"/>
            </svg>
          </div>
          <h4 class="text-sm font-semibold text-zinc-100">${title}</h4>
        </div>
        ${content}
      </section>
    `;

    return `
      <div class="space-y-4">
        <h2 class="text-2xl font-bold tracking-tight">
          ${tf2('help_modal.difficulty_techs_info.matrix_title', 'Techniques by difficulty')}
        </h2>
        ${cardSection(tf2('help_modal.difficulty_techs_info.legend_title','Legend'), legend)}
        ${cardSection(tf2('help_modal.difficulty_techs_info.matrix_title','Techniques by difficulty'), table + notes)}
      </div>
    `;
  }

  return `
    <div class="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
      ${tf('help_modal.common.soon', 'Coming soon.')}
    </div>
  `;
}

/* =========================
   UI ENHANCEMENTS
   ========================= */

// Tabs
function initInfosTabs() {
  const tabs = document.querySelectorAll('[data-infos-tab]');
  const panels = document.querySelectorAll('[data-infos-group]');

  if (!tabs.length || !panels.length) return;

  function setActiveTab(group) {
    tabs.forEach((btn) => {
      const isActive = btn.getAttribute('data-infos-tab') === group;
      if (isActive) {
        btn.classList.add('bg-emerald-500/15', 'border-emerald-400/60', 'text-emerald-50');
        btn.classList.remove('text-zinc-300');
      } else {
        btn.classList.remove('bg-emerald-500/15', 'border-emerald-400/60', 'text-emerald-50');
        btn.classList.add('text-zinc-300');
      }
    });

    panels.forEach((panel) => {
      const g = panel.getAttribute('data-infos-group');
      panel.hidden = g !== group;
    });
  }

  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.getAttribute('data-infos-tab');
      if (group) setActiveTab(group);
    });
  });

  const firstActive = document.querySelector('[data-infos-tab][data-active="true"]');
  const initialGroup =
    firstActive?.getAttribute('data-infos-tab') || tabs[0]?.getAttribute('data-infos-tab');
  if (initialGroup) setActiveTab(initialGroup);
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
  });

  initInfosTabs();
  initTechMatrixHover();
  initPlaytestingAccordions();
});
