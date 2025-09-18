{{-- resources/views/statistics.blade.php --}}
@extends('layouts.app')

@section('title', 'Genji Parkour - ' . __('statistics.graphs'))
@section('og:title', 'Genji Parkour - ' . __('statistics.graphs'))
@section('og:description', __('statistics.subtitle'))

@push('head')
  @php($nonce = csp_nonce())
  <script
    nonce="{{ $nonce }}"
    src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"
  ></script>
  <script
    nonce="{{ $nonce }}"
    src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"
  ></script>
@endpush

@section('content')
  <section class="relative">
    <div class="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 sm:pt-14 sm:pb-8 lg:px-8">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {{ __('statistics.graphsAndInsights') }}
            <span class="block text-sm font-medium text-zinc-300 sm:text-base">
              {{ __('statistics.subtitle') }}
            </span>
          </h1>
        </div>
      </div>
    </div>
  </section>

  {{-- Contenu --}}
  <section class="relative mt-6 pb-12 sm:pb-20">
    <div class="mx-auto max-w-7xl space-y-5 px-4 sm:px-6 lg:px-8">
      {{-- Grille compacte 2x3 --}}
      <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {{-- Maps per difficulty --}}
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold">
              {{ __('statistics.mapDifficultyDistribution') }}
            </h3>
          </div>
          <div
            class="mt-3 rounded-xl border border-white/10 bg-zinc-900/40 p-2 ring-1 ring-white/10"
          >
            <div class="h-56 w-full sm:h-60">
              <canvas id="difficultyBarChart" class="h-full w-full"></canvas>
            </div>
          </div>
        </div>

        {{-- Popular creators --}}
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold">
              {{ __('statistics.popularCreators') }}
            </h3>
          </div>
          <div
            class="mt-3 rounded-xl border border-white/10 bg-zinc-900/40 p-2 ring-1 ring-white/10"
          >
            <div class="h-56 w-full sm:h-60">
              <canvas id="qualityDotChart" class="h-full w-full"></canvas>
            </div>
          </div>
        </div>

        {{-- Most played maps --}}
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-base font-semibold">
              {{ __('statistics.topMapsFor') }}
            </h3>
            <div class="flex items-center gap-2">
              <label for="difficultySelect" class="text-[11px] text-zinc-400">
                {{ __('statistics.difficulty') }}
              </label>
              <select
                id="difficultySelect"
                class="focus:ring-brand-500/40 rounded-md border border-white/10 bg-zinc-900/60 px-2.5 py-1.5 text-xs focus:ring-2 focus:outline-none"
              ></select>
            </div>
          </div>
          <div
            class="mt-3 rounded-xl border border-white/10 bg-zinc-900/40 p-2 ring-1 ring-white/10"
          >
            <div class="h-56 w-full sm:h-60">
              <canvas id="mostPlayedMapsChart" class="h-full w-full"></canvas>
            </div>
          </div>
        </div>

        {{-- Map counts --}}
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold">
              {{ __('statistics.totalMapCounts') }}
            </h3>
            <p class="text-[11px] text-zinc-400">{{ __('statistics.top25') }}</p>
          </div>
          <div
            class="mt-3 rounded-xl border border-white/10 bg-zinc-900/40 p-2 ring-1 ring-white/10"
          >
            <div class="h-56 w-full sm:h-60">
              <canvas id="mapsCountChart" class="h-full w-full"></canvas>
            </div>
          </div>
        </div>

        {{-- Time played --}}
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold">
              {{ __('statistics.timePlayedPerDifficulty') }}
            </h3>
          </div>
          <div
            class="mt-3 rounded-xl border border-white/10 bg-zinc-900/40 p-2 ring-1 ring-white/10"
          >
            <div class="h-56 w-full sm:h-60">
              <canvas id="timePlayedChart" class="h-full w-full"></canvas>
            </div>
          </div>
        </div>

        {{-- Donut ranks --}}
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <h3 class="text-base font-semibold">
                {{ __('statistics.mapRankDistribution') }}
              </h3>
              <p class="text-xs text-zinc-400">
                {{ __('statistics.rankDistribution') }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <select
                id="rankSelect"
                class="focus:ring-brand-500/40 rounded-md border border-white/10 bg-zinc-900/60 px-2.5 py-1.5 text-xs focus:ring-2 focus:outline-none"
              >
                <option value="normalRanks">{{ __('statistics.skillRank') }}</option>
                <option value="communityRanks">{{ __('statistics.tierRank') }}</option>
              </select>
            </div>
          </div>
          <div
            class="mt-3 flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-zinc-900/40 ring-1 ring-white/10"
          >
            <svg viewBox="0 0 600 600" class="h-56 w-full sm:h-60">
              <circle
                cx="300"
                cy="300"
                r="200"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                stroke-width="16"
                class="background-circle"
              />
              <circle
                cx="300"
                cy="300"
                r="165"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                stroke-width="12"
                class="inner-circle"
              />
              <g id="rings-container"></g>
              <g id="lines-container"></g>
              <g id="figures-container"></g>
              <text id="hover-text" class="fill-zinc-200 text-xs"></text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
@endsection

@push('scripts')
  <script nonce="{{ $nonce }}">
    document.documentElement.lang = @json(app()->getLocale());
    window.STATISTICS_I18N = @json(\Illuminate\Support\Facades\Lang::get('statistics'));
  </script>
  @vite('resources/js/pages/statistics.js', null, ['nonce' => csp_nonce()])
@endpush
