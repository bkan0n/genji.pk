@extends('layouts.app')

@section('title', 'Genji Parkour - ' . __('search.page_title'))
@section('og:title', __('search.og_title'))
@section('og:description', __('search.og_description'))

@push('head')
  @php($nonce = csp_nonce())
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
    rel="stylesheet"
  />
  <script nonce="{{ $nonce }}" src="https://cdn.jsdelivr.net/npm/chart.js"></script>
@endpush

@section('content')
  <main class="relative min-h-screen overflow-hidden">
    {{-- En-tête --}}
    <section class="relative">
      <div class="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 sm:pt-14 sm:pb-8 lg:px-8">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {{ __('search.title') }}
              <span class="block text-sm font-medium text-zinc-300 sm:text-base">
                {{ __('search.subtitle') }}
              </span>
            </h1>
          </div>
        </div>
      </div>
    </section>

    {{-- Tabs + Toolbar container --}}
    <section class="relative pb-3">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
          {{-- Tabs --}}
          <div class="tab-buttons grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              id="map_searchBtn"
              data-section="map_search"
              class="inline-flex cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-2 text-sm font-medium hover:bg-white/5"
            >
              {{ __('search.map_search') }}
            </button>
            <button
              id="completionsBtn"
              data-section="completions"
              class="inline-flex cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-2 text-sm font-medium hover:bg-white/5"
            >
              {{ __('search.completions') }}
            </button>
            <button
              id="guideBtn"
              data-section="guide"
              class="inline-flex cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-2 text-sm font-medium hover:bg-white/5"
            >
              {{ __('search.guides') }}
            </button>
            <button
              id="personal_recordsBtn"
              data-section="personal_records"
              class="inline-flex cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-2 text-sm font-medium hover:bg-white/5"
            >
              {{ __('search.personal_records') }}
            </button>
          </div>

          {{-- Selected mode / Toolbar --}}
          <div class="selected-mode-container">
            <div
              id="selectedMode"
              class="selected-mode rounded-lg border border-white/10 bg-zinc-900/40 px-3 py-2 text-sm text-zinc-300"
            >
              {{ __('search.select_mode') }}
            </div>

            <div id="filterActions" class="filter-actions mt-3 hidden">
              <div
                class="toolbar-container relative z-[45] overflow-visible rounded-xl border border-white/10 bg-zinc-900/60 p-3"
              >
                <div id="icon-name" class="icon-name sr-only"></div>
                <div class="toolbar relative flex flex-wrap items-center gap-2"></div>
              </div>
            </div>
          </div>

          {{-- Filtres dynamiques (chips/labels) --}}
          <div id="dynamicFilters" class="filter-section">
            <div id="filtersContainer" class="filters-container flex flex-wrap gap-2"></div>
          </div>
        </div>
      </div>
    </section>

    {{-- Loading bar --}}
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div id="loadingContainer" class="loading-bar rounded-full bg-zinc-800/60"></div>
    </div>

    {{-- Résultats --}}
    <section class="relative pt-2 pb-10 sm:pb-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div id="resultsContainer" class="results-container overflow-auto"></div>
        </div>

        {{-- Pagination --}}
        <div
          id="paginationContainer"
          class="pagination-container mt-4 flex items-center justify-center gap-2"
        ></div>
      </div>
    </section>
  </main>
@endsection

@push('scripts')
  <script nonce="{{ $nonce }}">
    document.documentElement.lang = @json(app()->getLocale());
    window.SEARCH_I18N = @json(\Illuminate\Support\Facades\Lang::get('search'));
  </script>
  @vite('resources/js/pages/search.js', null, ['nonce' => csp_nonce()])
@endpush
