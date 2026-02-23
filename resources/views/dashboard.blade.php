@extends('layouts.app')

@section('title', __('dashboard.meta.title'))
@section('og:title', __('dashboard.meta.og.title'))
@section('og:description', __('dashboard.meta.og.description'))

@push('head')
  @php($nonce = csp_nonce())
@endpush

@section('content')
  <section class="relative mb-12 min-h-[100vh]">
    <div class="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
      <div
        class="relative overflow-hidden rounded-3xl border border-zinc-200/70 dark:border-white/10
               bg-white/80 dark:bg-zinc-950/30 ring-1 ring-zinc-200/40 dark:ring-white/10 shadow-2xl"
      >
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-50/70 via-white/40 to-brand-200/20 dark:from-white/5 dark:via-zinc-950/20 dark:to-brand-500/10"></div>

        <div class="relative p-5 sm:p-6 lg:p-7">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-6">
            <div class="flex items-center gap-4 lg:flex-1 lg:min-w-0">
              <button id="dash-open-rankcard" type="button" class="relative group shrink-0">
                <div class="h-16 w-16 overflow-hidden rounded-full ring-2 ring-brand-500/60 shadow-[0_0_20px_rgba(99,102,241,.25)] bg-zinc-900/5 dark:bg-white/5 transition group-hover:shadow-[0_0_28px_rgba(99,102,241,.35)]">
                  <img
                    id="dash-avatar"
                    alt="avatar"
                    class="h-full w-full object-contain hidden"
                    loading="lazy"
                    decoding="async"
                  />
                  <div id="dash-avatar-skel" class="h-full w-full animate-pulse bg-zinc-900/10 dark:bg-white/10"></div>
                  <div id="dash-avatar-fallback" class="hidden flex h-full w-full items-center justify-center">
                    <svg class="h-8 w-8 text-zinc-400 dark:text-zinc-500" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2-8 4.5V21h16v-2.5c0-2.5-3.58-4.5-8-4.5Z"/>
                    </svg>
                  </div>
                </div>

                <span id="dash-tag" class="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[10px] font-extrabold
                      bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/25 hidden">
                  ELITE
                </span>
              </button>

              <div class="min-w-0 flex-1">
                <div id="dash-header-stack" class="relative min-w-0 w-full is-loading">
                    <div id="dash-header-content" class="min-w-0 transition-opacity duration-200">
                        <div class="flex items-center gap-2 min-w-0">
                        <h1
                            id="dash-username"
                            class="min-w-0 truncate text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50
                                cursor-pointer hover:opacity-90 transition"
                        >
                            {{ __('dashboard.loading.username') }}
                        </h1>

                        <span
                            id="dash-rank-pill"
                            class="invisible shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold
                                bg-zinc-900/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-200 ring-1 ring-zinc-200/60 dark:ring-white/10"
                        >
                            —
                        </span>
                        </div>

                    <div class="dash-header-row mt-2 flex flex-nowrap items-center gap-2 min-w-0">
                      <span
                        id="dash-userid"
                        class="min-w-0 max-w-[16rem] sm:max-w-[22rem] lg:max-w-[20rem] truncate
                               inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold
                               bg-white/60 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-200 ring-1 ring-zinc-200/70 dark:ring-white/10"
                      >
                        ID —
                      </span>

                      <button
                        id="dash-copy-id"
                        type="button"
                        class="shrink-0 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold
                               border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40
                               text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
                      >
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" aria-hidden="true">
                          <path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm4 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h12v14Z"/>
                        </svg>
                        {{ __('dashboard.actions.copy_id') }}
                      </button>
                    </div>
                  </div>

                  <div
                    id="dash-header-skel"
                    class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200"
                  >
                    <div class="min-w-0">
                      <div class="h-[1.875rem] w-56 max-w-full rounded bg-zinc-900/10 dark:bg-white/10 animate-pulse"></div>

                      <div class="dash-header-row mt-2 flex flex-nowrap items-center gap-2 min-w-0">
                        <div class="h-7 flex-1 min-w-0 rounded-full bg-zinc-900/5 dark:bg-white/5 animate-pulse"></div>
                        <div class="h-7 flex-1 min-w-0 rounded-full bg-zinc-900/10 dark:bg-white/10 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {{-- /HEADER --}}
            </div>

            <div class="min-w-0 w-full lg:flex-none lg:w-[420px] lg:px-6">
              <div class="flex items-center justify-between">
                <div class="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  {{ __('dashboard.header.xp_progress') }}
                </div>
                <div id="dash-xp-text" class="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                  —
                </div>
              </div>

              <div
                id="dash-xp-wrap"
                class="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-900/10 dark:bg-white/10 ring-1 ring-zinc-200/60 dark:ring-white/10 cursor-help"
                title="—"
              >
                <div
                  id="dash-xp-bar"
                  class="dash-xp-bar h-full w-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500"
                ></div>
              </div>

              <div id="dash-xp-sub" class="mt-2 text-xs text-emerald-700 dark:text-emerald-300 hidden">
                —
              </div>
            </div>

            <div class="flex items-center gap-3 shrink-0">
              <div class="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 ring-1 ring-zinc-200/40 dark:ring-white/10 px-4 py-3">
                <div class="flex items-center gap-2">
                  <svg class="h-5 w-5 text-amber-500" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2Z"/>
                  </svg>
                  <div class="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">
                    <span id="dash-level">—</span>
                    <span class="ml-1 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">{{ __('dashboard.header.level') }}</span>
                  </div>
                </div>

                <div class="mt-2 flex items-center justify-between gap-4 text-xs">
                  <span class="text-zinc-600 dark:text-zinc-300">{{ __('dashboard.header.coins') }}</span>
                  <span id="dash-coins" class="font-extrabold text-amber-600 dark:text-amber-400">—</span>
                </div>
              </div>

              <a
                href="{{ url('/rank_card') }}"
                class="inline-flex items-center gap-2 rounded-2xl px-4 py-3 font-semibold
                       bg-brand-500 hover:bg-brand-400 text-white shadow transition"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 4v2h10V7H7Zm0 4v2h10v-2H7Zm0 4v2h6v-2H7Z"/>
                </svg>
                {{ __('dashboard.actions.rank_card') }}
              </a>
            </div>
          </div>

          {{-- STATS --}}
          <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div class="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 ring-1 ring-zinc-200/40 dark:ring-white/10 p-4">
              <div class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">{{ __('dashboard.stats.keys_classic') }}</div>
              <div class="mt-1 flex items-center gap-2">
                <img
                  src="{{ cdn_asset('assets/lootbox/keys/classic.png') }}"
                  alt=""
                  class="h-7 w-7 shrink-0 object-contain"
                  loading="lazy"
                  decoding="async"
                />
                <div id="dash-keys-classic" class="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">—</div>
              </div>
            </div>

            <div class="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 ring-1 ring-zinc-200/40 dark:ring-white/10 p-4">
              <div class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">{{ __('dashboard.stats.keys_winter') }}</div>
              <div class="mt-1 flex items-center gap-2">
                <img
                  src="{{ cdn_asset('assets/lootbox/keys/winter.png') }}"
                  alt=""
                  class="h-7 w-7 shrink-0 object-contain"
                  loading="lazy"
                  decoding="async"
                />
                <div id="dash-keys-winter" class="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">—</div>
              </div>
            </div>

            <div class="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 ring-1 ring-zinc-200/40 dark:ring-white/10 p-4">
              <div class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">{{ __('dashboard.stats.rewards_owned') }}</div>
              <div id="dash-rewards" class="mt-1 text-xl font-extrabold text-zinc-900 dark:text-zinc-50">—</div>
            </div>

            <div class="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 ring-1 ring-zinc-200/40 dark:ring-white/10 p-4">
              <div class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">{{ __('dashboard.stats.quests_done') }}</div>
              <div id="dash-quests-done" class="mt-1 text-xl font-extrabold text-zinc-900 dark:text-zinc-50">—</div>
            </div>
          </div>
        </div>
      </div>

      {{-- TABS --}}
      <div class="mt-8 rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 ring-1 ring-zinc-200/40 dark:ring-white/10 p-2">
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <button data-tab="overview" class="dash-tab cursor-pointer rounded-xl px-3 py-2 text-sm font-semibold transition">
            {{ __('dashboard.tabs.overview') }}
          </button>
          <button data-tab="lootboxes" class="dash-tab cursor-pointer rounded-xl px-3 py-2 text-sm font-semibold transition">
            {{ __('dashboard.tabs.lootboxes') }}
          </button>
          <button data-tab="keyshop" class="dash-tab cursor-pointer rounded-xl px-3 py-2 text-sm font-semibold transition">
            {{ __('dashboard.tabs.key_shop') }}
          </button>
          <button data-tab="weekly" class="dash-tab cursor-pointer rounded-xl px-3 py-2 text-sm font-semibold transition">
            {{ __('dashboard.tabs.weekly_shop') }}
          </button>
          <button data-tab="quests" class="dash-tab cursor-pointer rounded-xl px-3 py-2 text-sm font-semibold transition">
            {{ __('dashboard.tabs.quests') }}
          </button>
        </div>
      </div>

      {{-- PANELS --}}
      <div class="mt-4">

        <div id="dash-panel-overview" class="dash-panel">
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div class="lg:col-span-2 rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 ring-1 ring-zinc-200/40 dark:ring-white/10 overflow-hidden">
              <div class="flex items-center justify-between border-b border-zinc-200/60 dark:border-white/10 px-4 py-3">
                <div class="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{{ __('dashboard.overview.activity_title') }}</div>
                <button id="dash-refresh" type="button"
                  class="rounded-lg cursor-pointer px-3 py-1.5 text-xs font-semibold border border-zinc-200/80 dark:border-white/10
                         bg-white/80 dark:bg-zinc-950/40 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 transition">
                  {{ __('dashboard.actions.refresh') }}
                </button>
              </div>

              <div class="p-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-950/25 ring-1 ring-zinc-200/40 dark:ring-white/10 p-4">
                  <div class="text-xs font-bold text-zinc-900 dark:text-zinc-100">{{ __('dashboard.overview.recent_purchases') }}</div>
                  <div id="dash-purchases" class="mt-3 space-y-2"></div>
                </div>

                <div class="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-950/25 ring-1 ring-zinc-200/40 dark:ring-white/10 p-4">
                  <div class="text-xs font-bold text-zinc-900 dark:text-zinc-100">{{ __('dashboard.overview.recent_rewards') }}</div>
                  <div id="dash-recent-rewards" class="mt-3 grid grid-cols-2 gap-2"></div>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 ring-1 ring-zinc-200/40 dark:ring-white/10 overflow-hidden">
              <div class="border-b border-zinc-200/60 dark:border-white/10 px-4 py-3">
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <div class="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                      {{ __('dashboard.submissions.title') }}
                    </div>
                    <div class="text-xs text-zinc-600 dark:text-zinc-300">
                      {{ __('dashboard.submissions.subtitle') }}
                    </div>
                  </div>

                  <button
                    id="dash-refresh-submissions"
                    type="button"
                    class="shrink-0 cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold border border-zinc-200/80 dark:border-white/10
                          bg-white/80 dark:bg-zinc-950/40 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
                  >
                    {{ __('dashboard.actions.refresh') }}
                  </button>
                </div>
              </div>

              <div class="p-4">
                <div id="dash-recent-submissions" class="space-y-2"></div>

                <div id="dash-recent-submissions-empty" class="hidden text-xs text-zinc-600 dark:text-zinc-300">
                  {{ __('dashboard.submissions.none') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="dash-panel-lootboxes" class="dash-panel hidden">
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div class="lg:col-span-2 rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 ring-1 ring-zinc-200/40 dark:ring-white/10 overflow-hidden">
              <div class="border-b border-zinc-200/60 dark:border-white/10 px-4 py-3">
                <div class="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{{ __('dashboard.lootboxes.your_inventory') }}</div>
                <div class="text-xs text-zinc-600 dark:text-zinc-300">{{ __('dashboard.lootboxes.your_inventory_sub') }}</div>
              </div>
              <div class="p-4">
                <div id="dash-keys-grid" class="grid grid-cols-1 gap-3 sm:grid-cols-2"></div>
              </div>
            </div>

            <div class="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 ring-1 ring-zinc-200/40 dark:ring-white/10 overflow-hidden">
              <div class="border-b border-zinc-200/60 dark:border-white/10 px-4 py-3">
                <div class="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{{ __('dashboard.lootboxes.latest_rewards') }}</div>
              </div>
              <div class="p-4">
                <div id="dash-rewards-grid" class="grid grid-cols-2 gap-2"></div>
              </div>
            </div>
          </div>
        </div>

        <div id="dash-panel-keyshop" class="dash-panel hidden">
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div class="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 ring-1 ring-zinc-200/40 dark:ring-white/10 overflow-hidden">
              <div class="border-b border-zinc-200/60 dark:border-white/10 px-4 py-3">
                <div class="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{{ __('dashboard.keyshop.buy_keys') }}</div>
                <div class="text-xs text-zinc-600 dark:text-zinc-300">{{ __('dashboard.keyshop.buy_keys_sub') }}</div>
              </div>

              <div class="p-4 space-y-3">
                <div class="grid grid-cols-2 gap-2">
                    <select id="dash-key-type" data-custom-dd
                        class="w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-950/40
                                px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        <option value="Classic">{{ __('lootbox.ui.key_types.Classic') }}</option>
                        <option value="Winter">{{ __('lootbox.ui.key_types.Winter') }}</option>
                    </select>

                    <select id="dash-key-qty" data-custom-dd
                        class="w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-950/40
                                px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        <option value="1">x1</option>
                        <option value="3">x3</option>
                        <option value="5">x5</option>
                    </select>
                </div>

                <div class="flex items-center justify-between text-xs">
                  <span class="text-zinc-600 dark:text-zinc-300">{{ __('dashboard.keyshop.price') }}</span>
                  <span id="dash-key-price" class="font-extrabold text-emerald-700 dark:text-emerald-300">—</span>
                </div>

                <button id="dash-buy-keys" type="button"
                  class="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-sm font-extrabold text-zinc-900 shadow transition
                         disabled:opacity-60 disabled:cursor-not-allowed">
                  {{ __('dashboard.keyshop.purchase') }}
                </button>

                <div id="dash-key-note" class="text-[11px] text-zinc-600 dark:text-zinc-300"></div>
              </div>
            </div>

            <div class="lg:col-span-2 rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 ring-1 ring-zinc-200/40 dark:ring-white/10 overflow-hidden">
              <div class="border-b border-zinc-200/60 dark:border-white/10 px-4 py-3">
                <div class="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{{ __('dashboard.keyshop.recent_purchases') }}</div>
                <div class="text-xs text-zinc-600 dark:text-zinc-300">{{ __('dashboard.keyshop.recent_purchases_sub') }}</div>
              </div>
              <div id="dash-purchases-full" class="p-4 space-y-2"></div>
            </div>
          </div>
        </div>

        <div id="dash-panel-weekly" class="dash-panel hidden">
            <div class="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 ring-1 ring-zinc-200/40 dark:ring-white/10 overflow-hidden">
                <div class="flex flex-col gap-3 border-b border-zinc-200/60 dark:border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div class="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{{ __('dashboard.weekly.rotation_title') }}</div>
                        <div id="dash-rotation-ttl" class="text-xs text-zinc-600 dark:text-zinc-300">—</div>
                    </div>

                    <div class="flex items-center gap-2">
                        <input id="dash-rotation-search"
                        class="w-44 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-950/40 px-3 py-2 text-sm
                                text-zinc-900 dark:text-zinc-100"
                        placeholder="{{ __('dashboard.weekly.search_placeholder') }}"
                        />
                        <select id="dash-rotation-rarity" data-custom-dd
                            class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-950/40 px-3 py-2 text-sm
                                    text-zinc-900 dark:text-zinc-100">
                            <option value="">{{ __('dashboard.weekly.filter_all') }}</option>
                            <option value="common">{{ __('dashboard.weekly.rarity_common') }}</option>
                            <option value="rare">{{ __('dashboard.weekly.rarity_rare') }}</option>
                            <option value="epic">{{ __('dashboard.weekly.rarity_epic') }}</option>
                            <option value="legendary">{{ __('dashboard.weekly.rarity_legendary') }}</option>
                        </select>
                    </div>
                </div>

                <div id="dash-rotation" class="p-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"></div>
            </div>
        </div>

        <div id="dash-panel-quests" class="dash-panel hidden">
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div class="lg:col-span-2 rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 ring-1 ring-zinc-200/40 dark:ring-white/10 overflow-hidden">
              <div class="border-b border-zinc-200/60 dark:border-white/10 px-4 py-3">
                <div class="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{{ __('dashboard.quests.weekly_title') }}</div>
                <div class="text-xs text-zinc-600 dark:text-zinc-300">{{ __('dashboard.quests.weekly_sub') }}</div>
              </div>
              <div id="dash-weekly-quests" class="p-4 space-y-2 max-h-[520px] overflow-y-auto overscroll-contain pr-2"></div>
            </div>

            <div class="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 ring-1 ring-zinc-200/40 dark:ring-white/10 overflow-hidden">
              <div class="border-b border-zinc-200/60 dark:border-white/10 px-4 py-3">
                <div class="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{{ __('dashboard.quests.history_title') }}</div>
              </div>
              <div id="dash-quest-history" class="p-4 space-y-2 max-h-[520px] overflow-y-auto overscroll-contain pr-2"></div>
            </div>
          </div>
        </div>
      </div>

      <input id="dash-current-user" type="hidden" value="{{ (string) (auth()->check() ? auth()->id() : '') }}" />
    </div>
  </section>
@endsection

@push('scripts')
  <script nonce="{{ $nonce }}">
    document.documentElement.lang = @json(app()->getLocale());
    window.DASHBOARD_I18N = @json(\Illuminate\Support\Facades\Lang::get('dashboard'));
    window.user_id = @json(auth()->check() ? (string) auth()->id() : null);
  </script>

  @vite('resources/js/pages/dashboard.js', null, ['nonce' => csp_nonce()])
@endpush