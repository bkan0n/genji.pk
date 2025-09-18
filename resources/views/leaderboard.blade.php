@extends('layouts.app')

@section('title', __('leaderboard.meta.title'))
@section('og:title', __('leaderboard.meta.og.title'))
@section('og:description', __('leaderboard.meta.og.description'))

@section('content')
  <div class="relative min-h-[100vh]">
    <!-- En-tête -->
    <section class="relative">
      <div class="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 sm:pt-14 sm:pb-8 lg:px-8">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {{ __('leaderboard.header.title') }}
              <span class="block text-sm font-medium text-zinc-300 sm:text-base">
                {{ __('leaderboard.header.subtitle') }}
              </span>
            </h1>
          </div>
        </div>
      </div>
    </section>

    <!-- Filtres -->
    <section class="relative">
      <div class="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
          <div id="filtersGrid" class="grid gap-3 sm:grid-cols-4">
            <!-- Player search -->
            <label class="block">
              <span class="mb-1 block text-xs font-medium text-zinc-300">
                {{ __('leaderboard.filters.player_label') }}
              </span>
              <div
                class="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-2"
              >
                <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L19 20.5 20.5 19 15.5 14zM10 14a4 4 0 110-8 4 4 0 010 8z"
                  />
                </svg>
                <input
                  id="search-input"
                  type="text"
                  placeholder="{{ __('leaderboard.filters.search_placeholder') }}"
                  class="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
                />
              </div>
            </label>

            <!-- Sort by -->
            <div class="relative">
              <span class="mb-1 block text-xs font-medium text-zinc-300">
                {{ __('leaderboard.filters.sort_label') }}
              </span>
              <button
                id="sortBtn"
                class="inline-flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-2 text-sm hover:bg-white/5"
                aria-expanded="false"
                aria-controls="sortMenu"
              >
                <span class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7 10h10v2H7zM5 6h14v2H5zM9 14h6v2H9z" />
                  </svg>
                  <span class="label">{{ __('leaderboard.filters.sort_options.xp') }}</span>
                </span>
                <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20">
                  <path fill="currentColor" d="M5 8l5 5 5-5H5z" />
                </svg>
              </button>
              <ul
                id="sortMenu"
                class="invisible absolute right-0 left-0 z-50 mt-2 max-h-36 translate-y-1 overflow-y-auto rounded-lg bg-zinc-900/95 py-2 opacity-0 shadow-lg ring-1 ring-white/10 backdrop-blur transition"
              >
                <li>
                  <button
                    data-value="xp"
                    class="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm text-zinc-200 hover:bg-white/10"
                  >
                    {{ __('leaderboard.filters.sort_options.xp') }}
                    <span class="check hidden">✓</span>
                  </button>
                </li>
                <li>
                  <button
                    data-value="wr"
                    class="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm text-zinc-200 hover:bg-white/10"
                  >
                    {{ __('leaderboard.filters.sort_options.wr') }}
                    <span class="check hidden">✓</span>
                  </button>
                </li>
                <li>
                  <button
                    data-value="maps"
                    class="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm text-zinc-200 hover:bg-white/10"
                  >
                    {{ __('leaderboard.filters.sort_options.maps') }}
                    <span class="check hidden">✓</span>
                  </button>
                </li>
                <li>
                  <button
                    data-value="votes"
                    class="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm text-zinc-200 hover:bg-white/10"
                  >
                    {{ __('leaderboard.filters.sort_options.votes') }}
                    <span class="check hidden">✓</span>
                  </button>
                </li>
              </ul>
            </div>

            <!-- Search rank -->
            <div class="relative">
              <span class="mb-1 block text-xs font-medium text-zinc-300">
                {{ __('leaderboard.filters.rank_label') }}
              </span>
              <button
                id="rankBtn"
                class="inline-flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-2 text-sm hover:bg-white/5"
                aria-expanded="false"
                aria-controls="rankMenu"
              >
                <span class="label">{{ __('leaderboard.filters.rank_options.all') }}</span>
                <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20">
                  <path fill="currentColor" d="M5 8l5 5 5-5H5z" />
                </svg>
              </button>
              <ul
                id="rankMenu"
                class="invisible absolute right-0 left-0 z-50 mt-2 max-h-36 translate-y-1 overflow-y-auto rounded-lg bg-zinc-900/95 py-2 opacity-0 shadow-lg ring-1 ring-white/10 backdrop-blur transition"
              >
                <li>
                  <button
                    data-value=""
                    class="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm text-zinc-200 hover:bg-white/10"
                  >
                    {{ __('leaderboard.filters.rank_options.all') }}
                    <span class="check hidden">✓</span>
                  </button>
                </li>
                <li>
                  <button
                    data-value="Ninja"
                    class="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm text-zinc-200 hover:bg-white/10"
                  >
                    {{ __('leaderboard.filters.rank_options.ninja') }}
                    <span class="check hidden">✓</span>
                  </button>
                </li>
                <li>
                  <button
                    data-value="Jumper"
                    class="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm text-zinc-200 hover:bg-white/10"
                  >
                    {{ __('leaderboard.filters.rank_options.jumper') }}
                    <span class="check hidden">✓</span>
                  </button>
                </li>
                <li>
                  <button
                    data-value="Skilled"
                    class="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm text-zinc-200 hover:bg-white/10"
                  >
                    {{ __('leaderboard.filters.rank_options.skilled') }}
                    <span class="check hidden">✓</span>
                  </button>
                </li>
                <li>
                  <button
                    data-value="Pro"
                    class="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm text-zinc-200 hover:bg-white/10"
                  >
                    {{ __('leaderboard.filters.rank_options.pro') }}
                    <span class="check hidden">✓</span>
                  </button>
                </li>
                <li>
                  <button
                    data-value="Master"
                    class="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm text-zinc-200 hover:bg-white/10"
                  >
                    {{ __('leaderboard.filters.rank_options.master') }}
                    <span class="check hidden">✓</span>
                  </button>
                </li>
                <li>
                  <button
                    data-value="Grandmaster"
                    class="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm text-zinc-200 hover:bg-white/10"
                  >
                    {{ __('leaderboard.filters.rank_options.grandmaster') }}
                    <span class="check hidden">✓</span>
                  </button>
                </li>
                <li>
                  <button
                    data-value="God"
                    class="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm text-zinc-200 hover:bg-white/10"
                  >
                    {{ __('leaderboard.filters.rank_options.god') }}
                    <span class="check hidden">✓</span>
                  </button>
                </li>
              </ul>
            </div>

            <!-- Reset filters -->
            <div class="flex items-end">
              <button
                id="resetFiltersBtn"
                class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-2 text-sm hover:bg-white/5"
              >
                <svg
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.36 2.64L3 7" />
                  <path d="M3 3v4h4" />
                </svg>
                {{ __('leaderboard.filters.reset') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Table -->
    <section class="relative pb-10 sm:pb-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div class="overflow-auto">
            <table id="leaderboard" class="min-w-full table-fixed text-sm">
              <thead class="bg-zinc-900/60 text-zinc-300">
                <tr class="thead-wrapper">
                  <th
                    class="col-idx px-4 py-3 text-left align-middle font-semibold whitespace-nowrap"
                  >
                    {{ __('leaderboard.table.number') }}
                  </th>
                  <th
                    class="col-nickname px-4 py-3 text-left align-middle font-semibold whitespace-nowrap"
                  >
                    {{ __('leaderboard.table.nickname') }}
                  </th>
                  <th
                    class="col-xp px-4 py-3 text-left align-middle font-semibold whitespace-nowrap"
                  >
                    {{ __('leaderboard.table.xp') }}
                  </th>
                  <th
                    class="col-tier px-4 py-3 text-left align-middle font-semibold whitespace-nowrap"
                  >
                    {{ __('leaderboard.table.tier') }}
                  </th>
                  <th
                    class="col-skill-rank px-4 py-3 text-left align-middle font-semibold whitespace-nowrap"
                  >
                    {{ __('leaderboard.table.skill_rank') }}
                  </th>
                  <th
                    class="col-wr px-4 py-3 text-left align-middle font-semibold whitespace-nowrap"
                  >
                    {{ __('leaderboard.table.world_records') }}
                  </th>
                  <th
                    class="col-maps px-4 py-3 text-left align-middle font-semibold whitespace-nowrap"
                  >
                    {{ __('leaderboard.table.maps_made') }}
                  </th>
                  <th
                    class="col-playtest px-4 py-3 text-left align-middle font-semibold whitespace-nowrap"
                  >
                    {{ __('leaderboard.table.playtest_votes') }}
                  </th>
                  <th
                    class="col-discord px-4 py-3 text-left align-middle font-semibold whitespace-nowrap"
                  >
                    {{ __('leaderboard.table.discord_tag') }}
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>

        <div class="pagination-container mt-4 flex items-center justify-center gap-2"></div>
      </div>
    </section>
  </div>
@endsection

@push('scripts')
  @vite('resources/js/pages/leaderboard.js', null, ['nonce' => csp_nonce()])
@endpush
