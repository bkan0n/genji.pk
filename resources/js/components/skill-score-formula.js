const DEFAULT_CONFIG = Object.freeze({
  diff_base: 1.44,
  gamma: 0.68,
  time_bonus: 0.55,
  shrink_k: 10,
  wr_bonus: 0.1,
  partial_factor: 0.6,
  medal_gold: 1.12,
  medal_silver: 1.07,
  medal_bronze: 1.03,
});

const CONFIG_FIELDS = Object.keys(DEFAULT_CONFIG);
let configPromise = null;

function text(key, replacements = {}) {
  let value = window.SKILL_SCORE_I18N?.[key] ?? key;

  Object.entries(replacements).forEach(([name, replacement]) => {
    value = String(value).replaceAll(`:${name}`, String(replacement));
  });

  return value;
}

function normalizeConfig(payload) {
  return CONFIG_FIELDS.reduce((config, field) => {
    const value = Number(payload?.[field]);
    config[field] = Number.isFinite(value) ? value : DEFAULT_CONFIG[field];
    return config;
  }, {});
}

function loadConfig() {
  if (!configPromise) {
    configPromise = fetch('/api/skill/config', {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Skill config request failed (${response.status})`);
        return response.json();
      })
      .then(normalizeConfig)
      .catch(() => ({ ...DEFAULT_CONFIG }));
  }

  return configPromise;
}

function formatNumber(value, minimumFractionDigits = 0, maximumFractionDigits = 4) {
  return new Intl.NumberFormat(document.documentElement.lang || 'en', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

function formulaBlock(formula, className = '') {
  return `<div class="skill-formula-equation ${className}">${formula}</div>`;
}

function formulaSection(number, title, content) {
  return `
    <section class="skill-formula-section">
      <div class="skill-formula-section-title">
        <span>${number}</span>
        <h3>${title}</h3>
      </div>
      ${content}
    </section>
  `;
}

function definitionList(entries) {
  return `
    <dl class="skill-formula-definitions">
      ${entries
        .map(
          ([term, definition]) => `
            <div>
              <dt>${term}</dt>
              <dd>${definition}</dd>
            </div>
          `
        )
        .join('')}
    </dl>
  `;
}

function formulaMarkup(config) {
  const diffBase = formatNumber(config.diff_base);
  const gamma = formatNumber(config.gamma);
  const timeBonus = formatNumber(config.time_bonus);
  const shrinkK = formatNumber(config.shrink_k);
  const wrBonus = formatNumber(config.wr_bonus, 2);
  const wrMultiplier = formatNumber(1 + config.wr_bonus, 2);
  const partialFactor = formatNumber(config.partial_factor, 2);
  const medalGold = formatNumber(config.medal_gold, 2);
  const medalSilver = formatNumber(config.medal_silver, 2);
  const medalBronze = formatNumber(config.medal_bronze, 2);

  return `
    <div class="skill-formula-panel">
      <header class="skill-formula-header">
        <div>
          <div class="skill-formula-kicker">${text('kicker')}</div>
          <h2>${text('title')}</h2>
          <p>${text('intro')}</p>
        </div>
      </header>

      <div class="skill-formula-body">
        ${formulaSection(
          1,
          text('difficulty_title'),
          `
            ${formulaBlock('difficulty_weight = diff_base<sup>(raw_difficulty - 1.5)</sup>')}
            <div class="skill-formula-current">
              <span>${text('current_values')}</span>
              ${formulaBlock(`D = ${diffBase}<sup>(raw_difficulty - 1.5)</sup>`)}
            </div>
            ${definitionList([
              ['raw_difficulty', text('raw_difficulty')],
              ['diff_base', text('diff_base', { value: diffBase })],
            ])}
          `
        )}

        ${formulaSection(
          2,
          text('without_video_title'),
          `
            <p class="skill-formula-condition">${text('without_video_condition')}</p>
            ${formulaBlock('map_score = D × partial_factor')}
            <div class="skill-formula-current">
              <span>${text('current_values')}</span>
              ${formulaBlock(`map_score = D × ${partialFactor}`)}
            </div>
            <p class="skill-formula-note">${text('without_video_note')}</p>
          `
        )}

        ${formulaSection(
          3,
          text('time_title'),
          `
            <p class="skill-formula-condition">${text('with_video_condition')}</p>
            ${formulaBlock('shrink = <span class="skill-formula-fraction"><span>field_size</span><span>field_size + shrink_k</span></span>')}
            ${formulaBlock('time_mult = 1 + time_bonus × shrink × time_pct')}
            <div class="skill-formula-current">
              <span>${text('current_values')}</span>
              ${formulaBlock(`time_mult = 1 + ${timeBonus} × <span class="skill-formula-fraction"><span>field_size</span><span>field_size + ${shrinkK}</span></span> × time_pct`)}
            </div>
            ${definitionList([
              ['field_size', text('field_size')],
              ['field_rank', text('field_rank')],
              ['time_pct', text('time_pct')],
            ])}
            <p class="skill-formula-condition">${text('time_pct_interpretation')}</p>
            ${formulaBlock('time_pct = <span class="skill-formula-fraction"><span>field_size - field_rank</span><span>field_size - 1</span></span>')}
          `
        )}

        ${formulaSection(
          4,
          text('medal_title'),
          `
            <p class="skill-formula-condition">medal_mult =</p>
            <div class="skill-formula-cases">
              <div><strong>${medalGold}</strong><span>${text('gold')}</span></div>
              <div><strong>${medalSilver}</strong><span>${text('silver')}</span></div>
              <div><strong>${medalBronze}</strong><span>${text('bronze')}</span></div>
              <div><strong>${formatNumber(1, 2)}</strong><span>${text('no_medal')}</span></div>
            </div>
            <p class="skill-formula-note">${text('medal_note')}</p>
          `
        )}

        ${formulaSection(
          5,
          text('wr_title'),
          `
            <p class="skill-formula-condition">${text('wr_condition')}</p>
            ${formulaBlock(`fully_verified = true &nbsp; ${text('and')} &nbsp; field_rank = 1`)}
            ${formulaBlock(`wr_mult = 1 + ${wrBonus} = ${wrMultiplier}`)}
            <p class="skill-formula-condition">${text('otherwise')}:</p>
            ${formulaBlock('wr_mult = 1')}
            <p class="skill-formula-warning">${text('video_rank_note')}</p>
          `
        )}

        ${formulaSection(
          6,
          text('final_map_title'),
          formulaBlock(
            `map_score = ${diffBase}<sup>(raw_difficulty - 1.5)</sup> × <span class="skill-formula-bracket">(1 + ${timeBonus} × <span class="skill-formula-fraction"><span>field_size</span><span>field_size + ${shrinkK}</span></span> × time_pct)</span> × medal_mult × wr_mult`,
            'skill-formula-boxed'
          )
        )}

        ${formulaSection(
          7,
          text('player_title'),
          `
            <p class="skill-formula-condition">${text('sorted_scores')}</p>
            ${formulaBlock('contribution<sub>i</sub> = <span class="skill-formula-fraction"><span>map_score<sub>i</sub></span><span>i<sup>gamma</sup></span></span>')}
            <div class="skill-formula-current">
              <span>gamma = ${gamma}</span>
              ${formulaBlock(`Skill Score = <span class="skill-formula-sum">Σ</span><sub>i=1</sub><sup>N</sup> <span class="skill-formula-fraction"><span>map_score<sub>i</sub></span><span>i<sup>${gamma}</sup></span></span>`)}
            </div>
            <p class="skill-formula-warning">${text('personal_rank_note')}</p>
            <p class="skill-formula-note">${text('raw_score_note', { gamma })}</p>
          `
        )}
      </div>
    </div>
  `;
}

export async function renderSkillScoreFormula(container) {
  if (!container) return;

  container.innerHTML = formulaMarkup(DEFAULT_CONFIG);
  const config = await loadConfig();

  if (container.isConnected) {
    container.innerHTML = formulaMarkup(config);
  }
}
