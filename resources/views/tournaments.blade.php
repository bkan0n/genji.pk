@extends('layouts.app')

@section('title', __('tournaments.meta.title'))
@section('og:title', __('tournaments.meta.og.title'))
@section('og:description', __('tournaments.meta.og.description'))

@section('content')
  <section class="relative min-h-[100vh] text-zinc-900 dark:text-white">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header class="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div class="flex items-start gap-4">
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {{ __('tournaments.header.title') }}
            </h1>
            <p class="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-300 sm:text-base">
              {{ __('tournaments.header.subtitle') }}
            </p>
          </div>
        </div>
      </header>

      <nav class="mb-6">
        <div id="tournamentTabs" class="relative inline-flex max-w-full rounded-xl border border-zinc-200/80 bg-zinc-100 p-1 dark:border-white/10 dark:bg-white/5">
          <span id="tournamentTabsHighlight" aria-hidden="true"></span>
          <button
            type="button"
            data-section="current"
            class="tab-btn cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-zinc-900 dark:text-white"
          >
            {{ __('tournaments.tabs.current') }}
          </button>
          <button
            type="button"
            data-section="leaderboard"
            class="tab-btn cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-zinc-900 dark:text-white"
          >
            {{ __('tournaments.tabs.leaderboard') }}
          </button>
          <button
            type="button"
            data-section="history"
            class="tab-btn cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-zinc-900 dark:text-white"
          >
            {{ __('tournaments.tabs.history') }}
          </button>
        </div>
      </nav>

      <div id="panel-tournament-current" class="space-y-5">
        <section class="overflow-visible rounded-2xl border border-zinc-200/80 bg-zinc-100/90 p-2 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div class="grid gap-2 xl:grid-cols-[minmax(240px,.72fr)_minmax(520px,1.58fr)_minmax(210px,.55fr)]">
            <article class="rounded-xl border border-zinc-200/80 bg-white/70 p-3 dark:border-white/10 dark:bg-zinc-950/25">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-[11px] font-black uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    {{ __('tournaments.labels.active_edition') }}
                  </p>
                  <div id="tournamentEditionWindow" class="mt-1 text-sm font-black leading-snug sm:text-base">...</div>
                </div>
              </div>
              <div class="mt-3 flex items-center justify-between gap-3 rounded-lg border border-zinc-200/80 bg-zinc-50/90 px-3 py-2 dark:border-white/10 dark:bg-zinc-900/60">
                <p class="text-[11px] font-black uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {{ __('tournaments.labels.countdown') }}
                </p>
                <div id="tournamentCountdown" class="font-mono text-lg font-black tabular-nums">--:--:--</div>
              </div>
            </article>

            <section class="rounded-xl border border-zinc-200/80 bg-white/60 p-3 dark:border-white/10 dark:bg-zinc-950/20">
              <div id="tournamentActiveCycles" class="grid gap-2 md:grid-cols-2"></div>
            </section>

            <section class="rounded-xl border border-zinc-200/80 bg-white/60 p-3 dark:border-white/10 dark:bg-zinc-950/20">
              <p class="sr-only">{{ __('tournaments.labels.category') }}</p>
              <div id="tournamentCategoryChips" class="grid gap-2 sm:grid-cols-2 xl:grid-cols-1"></div>
            </section>
          </div>
        </section>

        <section>
          <div class="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 class="text-xl font-black tracking-tight">{{ __('tournaments.labels.top_5') }}</h2>
              <p id="tournamentTopMeta" class="mt-1 text-sm text-zinc-500 dark:text-zinc-400"></p>
            </div>
          </div>
          <div id="tournamentTopFive" class="grid gap-4"></div>
        </section>
      </div>

      <div id="panel-tournament-leaderboard" class="hidden">
        <section class="grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
          <article class="rounded-2xl border border-zinc-200/80 bg-zinc-100 p-4 dark:border-white/10 dark:bg-white/5">
            <div class="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 class="text-lg font-semibold">{{ __('tournaments.labels.leaderboard') }}</h2>
                <p id="tournamentLeaderboardMeta" class="mt-1 text-xs text-zinc-500 dark:text-zinc-400"></p>
              </div>
              <div class="block text-sm text-zinc-600 dark:text-zinc-300">
                <span>{{ __('tournaments.labels.category') }}</span>
                <div
                  id="tournamentLeaderboardCategorySelect"
                  class="relative ml-0 mt-1 w-full sm:ml-2 sm:mt-0 sm:inline-block sm:w-56"
                  data-tournament-select
                >
                  <button
                    type="button"
                    data-select-button
                    class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-left text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-white/10"
                    aria-expanded="false"
                  >
                    <span data-select-label>...</span>
                    <svg class="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <div data-select-menu class="absolute right-0 z-40 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 bg-white/95 p-1 shadow-2xl ring-1 ring-zinc-300/60 backdrop-blur dark:border-white/10 dark:bg-zinc-900/95 dark:ring-white/10"></div>
                </div>
              </div>
            </div>
            <div class="overflow-auto rounded-xl border border-zinc-200/80 bg-white/70 dark:border-white/10 dark:bg-zinc-950/40">
              <table class="min-w-full text-sm">
                <thead class="text-left text-xs uppercase text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th class="px-4 py-3">{{ __('tournaments.table.rank') }}</th>
                    <th class="px-4 py-3">{{ __('tournaments.table.player') }}</th>
                    <th class="px-4 py-3">{{ __('tournaments.table.time') }}</th>
                    <th class="px-4 py-3">{{ __('tournaments.table.verified') }}</th>
                  </tr>
                </thead>
                <tbody id="tournamentLeaderboardRows"></tbody>
              </table>
            </div>
          </article>

          <article class="rounded-2xl border border-zinc-200/80 bg-zinc-100 p-4 dark:border-white/10 dark:bg-white/5">
            <h2 class="text-lg font-semibold">{{ __('tournaments.labels.streak') }}</h2>
            <form id="tournamentStreakForm" class="mt-3 space-y-3">
              <label class="relative block text-sm text-zinc-600 dark:text-zinc-300">
                {{ __('tournaments.labels.user_search') }}
                <input
                  id="tournamentStreakUser"
                  type="text"
                  autocomplete="off"
                  placeholder="{{ __('tournaments.placeholders.user_search') }}"
                  class="mt-1 w-full rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                />
              </label>
              <button class="w-full cursor-pointer rounded-xl border border-zinc-200/80 bg-white/80 px-4 py-2 font-semibold text-zinc-900 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
                {{ __('tournaments.buttons.load_streak') }}
              </button>
            </form>
            <div id="tournamentStreakResult" class="mt-4 rounded-xl border border-zinc-200/80 bg-white/70 p-3 text-sm dark:border-white/10 dark:bg-zinc-950/40">
              {{ __('tournaments.empty.no_streak') }}
            </div>
          </article>
        </section>
      </div>

      <div id="panel-tournament-history" class="hidden">
        <section class="rounded-2xl border border-zinc-200/80 bg-zinc-100 p-4 dark:border-white/10 dark:bg-white/5">
          <div class="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-lg font-semibold">{{ __('tournaments.labels.archives') }}</h2>
              <p id="tournamentArchiveMeta" class="mt-1 text-xs text-zinc-500 dark:text-zinc-400"></p>
            </div>
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div class="block text-sm text-zinc-600 dark:text-zinc-300">
                <span>{{ __('tournaments.labels.category') }}</span>
                <div
                  id="tournamentArchiveCategorySelect"
                  class="relative ml-0 mt-1 w-full sm:ml-2 sm:mt-0 sm:inline-block sm:w-56"
                  data-tournament-select
                >
                  <button
                    type="button"
                    data-select-button
                    class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-left text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-white/10"
                    aria-expanded="false"
                  >
                    <span data-select-label>...</span>
                    <svg class="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <div data-select-menu class="absolute right-0 z-40 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 bg-white/95 p-1 shadow-2xl ring-1 ring-zinc-300/60 backdrop-blur dark:border-white/10 dark:bg-zinc-900/95 dark:ring-white/10"></div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button id="tournamentArchivePrev" type="button" class="cursor-pointer rounded-lg border border-zinc-200/80 bg-white/70 px-3 py-2 text-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-zinc-950/40 dark:hover:bg-white/10">
                  {{ __('tournaments.buttons.previous') }}
                </button>
                <button id="tournamentArchiveNext" type="button" class="cursor-pointer rounded-lg border border-zinc-200/80 bg-white/70 px-3 py-2 text-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-zinc-950/40 dark:hover:bg-white/10">
                  {{ __('tournaments.buttons.next') }}
                </button>
              </div>
            </div>
          </div>
          <div class="overflow-auto rounded-xl border border-zinc-200/80 bg-white/70 dark:border-white/10 dark:bg-zinc-950/40">
            <table class="min-w-full text-sm">
              <thead class="text-left text-xs uppercase text-zinc-500 dark:text-zinc-400">
                <tr>
                  <th class="px-4 py-3">{{ __('tournaments.table.map') }}</th>
                  <th class="px-4 py-3">{{ __('tournaments.labels.category') }}</th>
                  <th class="px-4 py-3">{{ __('tournaments.table.winner') }}</th>
                  <th class="px-4 py-3">{{ __('tournaments.table.ended_at') }}</th>
                  <th class="px-4 py-3 text-right">{{ __('tournaments.table.actions') }}</th>
                </tr>
              </thead>
              <tbody id="tournamentArchiveRows"></tbody>
            </table>
          </div>
        </section>
      </div>

      <div id="tournamentHistoryModal" class="fixed inset-0 z-50 hidden bg-zinc-950/50 p-4 backdrop-blur-sm">
        <div class="mx-auto mt-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-200/80 bg-white text-zinc-900 shadow-2xl ring-1 ring-zinc-300/60 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:ring-white/10">
          <header class="flex items-start justify-between gap-4 border-b border-zinc-200/80 bg-zinc-50/80 px-4 py-3 dark:border-white/10 dark:bg-zinc-800/80 sm:px-5">
            <div>
              <h2 id="tournamentHistoryModalTitle" class="text-lg font-bold">{{ __('tournaments.labels.participation_history') }}</h2>
              <p id="tournamentHistoryModalMeta" class="mt-1 text-xs text-zinc-500 dark:text-zinc-400"></p>
            </div>
            <button
              id="tournamentHistoryModalClose"
              type="button"
              class="cursor-pointer rounded-lg border border-zinc-200/80 bg-zinc-100 px-3 py-1.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              {{ __('tournaments.buttons.close') }}
            </button>
          </header>
          <div class="max-h-[70vh] overflow-auto p-4 sm:p-5">
            <table class="min-w-full text-sm">
              <thead class="text-left text-xs uppercase text-zinc-500 dark:text-zinc-400">
                <tr>
                  <th class="px-4 py-3">{{ __('tournaments.table.rank') }}</th>
                  <th class="px-4 py-3">{{ __('tournaments.table.player') }}</th>
                  <th class="px-4 py-3">{{ __('tournaments.table.time') }}</th>
                  <th class="px-4 py-3">{{ __('tournaments.table.verified') }}</th>
                </tr>
              </thead>
              <tbody id="tournamentHistoryModalRows"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
@endsection

@push('scripts')
  <script nonce="{{ csp_nonce() }}">
    window.TOURNAMENTS_I18N = @json(\Illuminate\Support\Facades\Lang::get('tournaments'));
  </script>
  @vite('resources/js/pages/tournaments.js', null, ['nonce' => csp_nonce()])
@endpush
