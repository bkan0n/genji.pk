{{-- ============ SKILL ============ --}}
<div data-panel="skill" class="mod-panel hidden space-y-4">
  <div data-skill-workspace class="space-y-4">
              <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10"
                  data-subtab="skill-user"
                  type="button"
                >
                  Player
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10"
                  data-subtab="skill-config"
                  type="button"
                >
                  Weights
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10"
                  data-subtab="skill-tiers"
                  type="button"
                >
                  Tier percentiles
                </button>
              </div>

              <div data-subpanel="skill-user" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
                  <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 class="font-semibold">Player skill</h3>
                      <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">The aggregate score and per-map breakdown are calculated from eligible runs.</p>
                    </div>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET /api/skill/users/{user_id}</span>
                  </div>
                  <form data-action="skill-user-summary" autocomplete="off" class="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <label class="min-w-0 flex-1 text-sm">
                      Player
                      <input
                        name="user_id"
                        type="text"
                        autocomplete="off"
                        required
                        placeholder="Search player or enter user ID…"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <button type="submit" class="rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Get summary</button>
                    <button type="submit" data-submit-action="skill-user-breakdown" class="rounded-xl border border-zinc-200/80 bg-zinc-100 px-4 py-2 font-semibold text-zinc-900 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10">Get breakdown</button>
                  </form>
                  <div data-skill-recent class="flex flex-wrap gap-2"></div>
                  <div data-skill-user-result class="rounded-2xl border border-dashed border-zinc-300/80 p-5 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
                    Load a player to inspect their Skill Score.
                  </div>
                </article>
              </div>

              <div data-subpanel="skill-config" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
                  <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 class="font-semibold">Skill weights</h3>
                      <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Saving triggers a full score recompute. The upstream API restricts updates to superusers.</p>
                    </div>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET + PATCH /api/mods/skill/config</span>
                  </div>
                  <form data-action="skill-config-get" autocomplete="off">
                    <button type="submit" class="rounded-xl border border-zinc-200/80 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10">Reload weights</button>
                  </form>
                  @php
                    $skillWeightControls = [
                      'diff_base' => [
                        'label' => 'Difficulty base',
                        'tooltip' => 'Controls how strongly map difficulty affects the score. Base score = Difficulty base^(raw difficulty - 1.5). Higher values make difficult maps worth exponentially more.',
                        'min' => 0, 'max' => 10, 'step' => 0.01,
                      ],
                      'gamma' => [
                        'label' => 'Gamma',
                        'tooltip' => 'Applies diminishing returns to a player’s maps to limit farming. Scores are sorted from highest to lowest, then each score is divided by position^Gamma. At 0, every map contributes fully. As Gamma increases, lower-ranked maps contribute less.',
                        'min' => 0.5, 'max' => 10, 'step' => 0.01,
                      ],
                      'time_bonus' => [
                        'label' => 'Time bonus',
                        'tooltip' => 'The maximum bonus awarded for time quality. It only applies to fully video-verified runs. Time multiplier = 1 + Time bonus × field-size adjustment × time percentile. A percentile of 1 represents the fastest time.',
                        'min' => 0, 'max' => 10, 'step' => 0.01,
                      ],
                      'shrink_k' => [
                        'label' => 'Shrink K',
                        'tooltip' => 'Reduces the time bonus when few players have completed the map. Adjustment = field size / (field size + Shrink K). A higher value requires a larger leaderboard to receive the full time bonus.',
                        'min' => 0, 'max' => 10, 'step' => 0.01,
                      ],
                      'wr_bonus' => [
                        'label' => 'World record bonus',
                        'tooltip' => 'An additional bonus awarded to a fully verified world record. At 0.10, the map score is multiplied by 1.10, or +10%. Being first only among video runs is not enough: the player must be first on the global leaderboard.',
                        'min' => 0, 'max' => 10, 'step' => 0.01,
                      ],
                      'partial_factor' => [
                        'label' => 'Partial factor',
                        'tooltip' => 'The share of the difficulty score retained when a run is not fully verified. At 0.60, it awards 60% of the base score. No time, medal, or world record bonus is applied.',
                        'min' => 0, 'max' => 10, 'step' => 0.01,
                      ],
                      'medal_gold' => [
                        'label' => 'Gold medal',
                        'tooltip' => 'The multiplier applied to video-verified runs with a gold medal. At 1.12, the map score receives a 12% bonus. This multiplier can stack with time and world record bonuses.',
                        'min' => 0, 'max' => 10, 'step' => 0.01,
                      ],
                      'medal_silver' => [
                        'label' => 'Silver medal',
                        'tooltip' => 'The multiplier applied to video-verified runs with a silver medal. At 1.07, the map score receives a 7% bonus. This multiplier can stack with time and world record bonuses.',
                        'min' => 0, 'max' => 10, 'step' => 0.01,
                      ],
                      'medal_bronze' => [
                        'label' => 'Bronze medal',
                        'tooltip' => 'The multiplier applied to video-verified runs with a bronze medal. At 1.03, the map score receives a 3% bonus. This multiplier can stack with time and world record bonuses.',
                        'min' => 0, 'max' => 10, 'step' => 0.01,
                      ],
                    ];
                  @endphp
                  <form data-action="skill-config-update" data-preserve-form-state="1" autocomplete="off" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    @foreach ($skillWeightControls as $field => $control)
                      <div class="skill-weight-card" data-skill-weight-control="{{ $field }}">
                        <div class="flex items-center justify-between gap-3">
                          <div class="flex min-w-0 items-center gap-2">
                            <label for="skill-weight-{{ $field }}" class="min-w-0 truncate text-sm font-semibold">
                              {{ $control['label'] }}
                            </label>
                            <span class="skill-weight-info">
                              <button
                                type="button"
                                class="skill-weight-info-button"
                                aria-label="Information about {{ $control['label'] }}"
                                aria-describedby="skill-weight-tooltip-{{ $field }}"
                              >
                                <svg viewBox="0 0 16 16" aria-hidden="true">
                                  <circle cx="8" cy="4.25" r="1"></circle>
                                  <path d="M8 7v5"></path>
                                </svg>
                              </button>
                              <span
                                id="skill-weight-tooltip-{{ $field }}"
                                role="tooltip"
                                class="skill-weight-tooltip"
                              >{{ $control['tooltip'] }}</span>
                            </span>
                          </div>
                          <input
                            id="skill-weight-{{ $field }}"
                            name="{{ $field }}"
                            type="number"
                            min="{{ $control['min'] }}"
                            max="{{ $control['max'] }}"
                            step="{{ $control['step'] }}"
                            value="{{ $control['min'] }}"
                            class="skill-weight-number"
                            data-skill-weight-number
                          />
                        </div>
                        <input
                          type="range"
                          min="{{ $control['min'] }}"
                          max="{{ $control['max'] }}"
                          step="{{ $control['step'] }}"
                          value="{{ $control['min'] }}"
                          class="skill-weight-range mt-4"
                          data-skill-weight-range
                          aria-label="{{ $control['label'] }}"
                        />
                        <div class="mt-2 flex justify-between text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                          <span>{{ $control['min'] }}</span>
                          <span>{{ $control['max'] }}</span>
                        </div>
                      </div>
                    @endforeach
                    <div class="sm:col-span-2 lg:col-span-3">
                      <button type="submit" class="rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Save and recompute</button>
                    </div>
                  </form>
                  <pre data-out="skill-config-res" class="hidden"></pre>
                </article>
              </div>

              <div data-subpanel="skill-tiers" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-5">
                  <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 class="font-semibold">Tier percentiles</h3>
                      <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Seven strictly increasing population percentiles define the eight ranked tiers.</p>
                    </div>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET /api/skill/tiers + PATCH /api/mods/skill/tiers</span>
                  </div>
                  <form data-action="skill-tiers-get" autocomplete="off">
                    <button type="submit" class="rounded-xl border border-zinc-200/80 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10">Reload tier config</button>
                  </form>
                  <form data-action="skill-tiers-update" data-preserve-form-state="1" autocomplete="off" class="space-y-5">
                    @php
                      $skillTierVisuals = [
                        ['name' => 'Bronze'],
                        ['name' => 'Silver'],
                        ['name' => 'Gold'],
                        ['name' => 'Emerald'],
                        ['name' => 'Diamond'],
                        ['name' => 'Ascendant'],
                        ['name' => 'Elite'],
                        ['name' => 'Champion'],
                      ];
                      $skillThresholdDefaults = [10, 20, 30, 40, 50, 70, 90];
                    @endphp

                    <div class="rounded-2xl border border-zinc-200/80 bg-white/35 p-4 dark:border-white/10 dark:bg-black/10">
                      <div class="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Population distribution</div>
                          <div class="text-xs text-zinc-500 dark:text-zinc-400">The width of each color is the population assigned to that rank.</div>
                        </div>
                        <div class="text-[11px] text-zinc-500 dark:text-zinc-400">Updates while you move a threshold</div>
                      </div>
                      <div data-skill-population-bar class="mt-4 flex h-4 w-full overflow-hidden rounded-full bg-zinc-200 ring-1 ring-zinc-300/70 dark:bg-zinc-800 dark:ring-white/10">
                        @foreach ($skillTierVisuals as $tierNumber => $tier)
                          <span
                            data-skill-population-segment="{{ $tierNumber + 1 }}"
                            class="skill-tier-segment skill-tier-{{ strtolower($tier['name']) }} h-full min-w-[3px] transition-[width] duration-150"
                            title="{{ $tier['name'] }}"
                          ></span>
                        @endforeach
                      </div>
                      <div class="mt-1 flex justify-between text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                        <span>0th percentile</span>
                        <span>100th percentile</span>
                      </div>
                    </div>

                    <div>
                      <div class="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Rank preview</div>
                          <div class="text-xs text-zinc-500 dark:text-zinc-400">Representative players are sampled from the saved Skill Score snapshot.</div>
                        </div>
                        <div data-skill-sample-status class="text-[11px] text-zinc-500 dark:text-zinc-400">Loading player samples...</div>
                      </div>
                      <div class="skill-tier-preview-grid">
                        @foreach ($skillTierVisuals as $tierIndex => $tier)
                          <section
                            data-skill-tier-card="{{ $tierIndex + 1 }}"
                            class="skill-tier-card skill-tier-{{ strtolower($tier['name']) }}"
                          >
                            <div class="flex min-w-0 items-center gap-3">
                              <div class="skill-tier-icon text-sm font-black">
                                {{ substr($tier['name'], 0, 1) }}
                                <img
                                  src="https://cdn.genji.pk/assets/skill/rank-icons/{{ rawurlencode($tier['name']) }}.png"
                                  alt=""
                                  loading="lazy"
                                  decoding="async"
                                  onerror="this.remove()"
                                />
                              </div>
                              <div class="min-w-0">
                                <div class="truncate text-sm font-black text-zinc-900 dark:text-zinc-100">{{ $tier['name'] }}</div>
                                <div data-skill-tier-range class="truncate text-[11px] text-zinc-500 dark:text-zinc-400">Percentile range -</div>
                              </div>
                              <span data-skill-tier-share class="skill-tier-share ml-auto shrink-0 rounded-full px-2 py-1 text-[10px] font-bold">-</span>
                            </div>
                            <div data-skill-tier-score-range class="mt-3 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">Score range -</div>
                            <div data-skill-tier-samples class="mt-2 space-y-1.5">
                              @for ($sample = 0; $sample < 3; $sample++)
                                <div class="h-8 animate-pulse rounded-lg bg-zinc-200/70 dark:bg-white/5"></div>
                              @endfor
                            </div>
                          </section>
                        @endforeach
                      </div>
                    </div>

                    <div>
                      <div class="mb-3">
                        <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Threshold editor</div>
                        <div class="text-xs text-zinc-500 dark:text-zinc-400">Each slider can be adjusted independently from 0.1% to 99.9%.</div>
                        <div data-skill-threshold-status class="mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Threshold order is valid</div>
                      </div>
                      <div class="space-y-3">
                        @foreach (array_slice($skillTierVisuals, 1) as $index => $tier)
                          @php($previousTier = $skillTierVisuals[$index])
                          <div
                            class="skill-threshold-row skill-threshold-{{ strtolower($tier['name']) }}"
                          >
                            <div class="flex min-w-0 items-center gap-2">
                              <span class="skill-threshold-from-dot h-2.5 w-2.5 shrink-0 rounded-full"></span>
                              <span class="truncate text-xs text-zinc-500 dark:text-zinc-400">{{ $previousTier['name'] }}</span>
                              <span class="text-zinc-400" aria-hidden="true">&rarr;</span>
                              <span class="truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">{{ $tier['name'] }}</span>
                            </div>
                            <input
                              type="range"
                              min="0.1"
                              max="99.9"
                              step="0.1"
                              value="{{ $skillThresholdDefaults[$index] }}"
                              class="skill-threshold-input"
                              data-skill-percentile-index="{{ $index }}"
                              aria-label="{{ $tier['name'] }} percentile threshold"
                            />
                            <div class="flex items-center justify-between gap-3 sm:block sm:text-right">
                              <label class="skill-threshold-number-wrap">
                                <span class="sr-only">{{ $tier['name'] }} percentile threshold</span>
                                <input
                                  type="number"
                                  min="0.1"
                                  max="99.9"
                                  step="0.1"
                                  inputmode="decimal"
                                  value="{{ $skillThresholdDefaults[$index] }}"
                                  class="skill-threshold-number"
                                  data-skill-percentile-number="{{ $index }}"
                                  aria-label="{{ $tier['name'] }} percentile threshold"
                                />
                                <span aria-hidden="true">%</span>
                              </label>
                              <div data-skill-boundary-value="{{ $index }}" class="text-[11px] text-zinc-500 dark:text-zinc-400">Score -</div>
                            </div>
                          </div>
                        @endforeach
                      </div>
                    </div>
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div data-skill-computed-at class="text-xs text-zinc-500 dark:text-zinc-400">Snapshot date unavailable</div>
                      <button type="submit" class="rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Save percentiles</button>
                    </div>
                  </form>
                  <pre data-out="skill-tiers-res" class="hidden"></pre>
                </article>
              </div>
  </div>
</div>
