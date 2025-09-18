@extends('layouts.app')

@section('title', 'Genji Parkour – Submit & Playtest')
@section('og:title', 'Submit & Playtest – Genji Parkour')
@section('og:description', 'Submit records, manage playtests, and propose new maps.')

@push('head')
  @php($nonce = csp_nonce())
  <script nonce="{{ $nonce }}" src="https://cdn.jsdelivr.net/npm/chart.js"></script>
@endpush

@section('content')
  <section class="relative">
    <!-- En-tête -->
    <section class="relative">
      <div class="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 sm:pt-14 sm:pb-8 lg:px-8">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {{ __('submit.header.title') }}
              <span class="block text-sm font-medium text-zinc-300 sm:text-base">
                {{ __('submit.header.subtitle') }}
              </span>
            </h1>
          </div>
        </div>
      </div>
    </section>
    <div class="mx-auto min-h-[80vh] max-w-7xl px-4 pt-6 pb-0 sm:px-6 sm:pt-1 lg:px-8">
      <!-- Onglets -->
      <div class="mt-1">
        <div id="mainTabs" class="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            id="submitRecordBtn"
            class="tab-btn cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900"
          >
            {{ __('submit.tabs.record') }}
          </button>
          <button
            id="playtestBtn"
            class="tab-btn cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            {{ __('submit.tabs.playtest') }}
          </button>
          <button
            id="submitMapBtn"
            class="tab-btn cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            {{ __('submit.tabs.map') }}
          </button>
        </div>
      </div>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="loadingContainer" class="loading-bar rounded-full bg-zinc-800/60"></div>
      </div>
      <!-- CONTENU ONGLET : Submit Record -->
      <div
        id="submitRecordSection"
        class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6"
      >
        <form id="submitRecordForm" enctype="multipart/form-data" class="grid gap-5 lg:grid-cols-2">
          @csrf
          <!-- Colonne gauche -->
          <div class="space-y-4">
            <!-- Map code  -->
            <div>
              <label class="mb-1 block text-xs text-zinc-400">{{ __('submit.table.code') }}</label>
              <div class="relative">
                <input
                  type="text"
                  id="mapCodeInput"
                  name="map_code"
                  autocomplete="off"
                  class="w-full rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60"
                  placeholder="e.g. ABCDE"
                />
                <div
                  id="mapCodeAutoList"
                  class="absolute top-[110%] right-0 left-0 z-10 hidden rounded-lg border border-white/10 bg-zinc-900/95 p-1 shadow-xl backdrop-blur"
                ></div>
              </div>
            </div>

            <!-- Time -->
            <div>
              <label class="mb-1 block text-xs text-zinc-400">{{ __('submit.table.time') }}</label>
              <input
                type="text"
                id="inputTime"
                name="time"
                class="w-full rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60"
                placeholder="e.g. 123.56"
              />
            </div>

            <!-- Quality (1..6) -->
            <div>
              <label class="mb-1 block text-xs text-zinc-400">
                {{ __('submit.table.quality') }}
              </label>
              <div id="qualityDropdown" class="fake-select fake-select relative">
                <button
                  type="button"
                  id="qualityDropdownBtn"
                  class="fake-select-btn inline-flex w-full items-center justify-between rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm"
                >
                  {{ __('submit.record.select_quality') }}
                  <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20">
                    <path fill="currentColor" d="m5 7l5 6l5-6H5z" />
                  </svg>
                </button>
                <div
                  class="fake-select-list absolute right-0 left-0 mt-1 rounded-lg border border-white/10 bg-zinc-900/95 p-1 shadow-xl"
                >
                  @for ($i=1;$i<=6;$i++)
                    <label
                      class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                    >
                      <input
                        type="radio"
                        name="quality"
                        value="{{ $i }}"
                        class="accent-emerald-500"
                      />
                      <span>{{ $i }}</span>
                    </label>
                  @endfor
                </div>
              </div>
            </div>

            <!-- Optional -->
            <div class="space-y-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <h3 class="text-sm font-semibold text-zinc-200">
                {{ __('submit.record.optional') }}
              </h3>
              <div>
                <label class="mb-1 block text-xs text-zinc-400">
                  {{ __('submit.record.video') }}
                </label>
                <input
                  type="url"
                  id="videoUrlInput"
                  name="video_url"
                  placeholder="https://…"
                  class="w-full rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60"
                />
              </div>
            </div>
          </div>

          <!-- Colonne droite -->
          <div class="space-y-4">
            <div>
              <span class="mb-1 block text-xs text-zinc-400">
                {{ __('submit.record.screenshot') }}
              </span>
              <div
                id="screenshotDrop"
                class="group relative flex h-44 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-zinc-900/60"
              >
                <input
                  id="screenshotInput"
                  name="screenshot"
                  type="file"
                  accept="image/*"
                  class="hidden"
                />
                <div id="screenshotPlaceholder" class="text-sm text-zinc-300">
                  {{ __('submit.record.drag_and_drop') }}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="submit"
                class="sr-reveal inline-flex cursor-pointer items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-900 [--sr-delay:605ms] hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 motion-safe:[animation-delay:var(--sr-delay)]"
              >
                {{ __('submit.record.submit_label') }}
              </button>

              <button
                type="button"
                class="sr-reveal cancel-btn inline-flex cursor-pointer items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-sm [--sr-delay:640ms] hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60 motion-safe:[animation-delay:var(--sr-delay)]"
                form="submitRecordForm"
              >
                {{ __('submit.record.cancel') }}
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- CONTENU ONGLET : Playtest -->
      <div
        id="playtestSection"
        class="mt-6 hidden min-h-[520px] rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6"
      >
        <div class="mb-4 flex items-center justify-between gap-3">
          <div id="icon-name" class="text-sm text-zinc-300"></div>
          <div
            class="toolbar inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1"
          ></div>
        </div>
        <form id="playtestForm">
          @csrf
          <div id="playtestCardContainer" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"></div>
        </form>
      </div>

      <!-- Modal Playtest -->
      <div id="playtestModal" class="fixed inset-0 z-[300] hidden">
        <button
          class="playtest-modal-backdrop absolute inset-0 bg-black/60 backdrop-blur-sm"
          aria-label="Close"
        ></button>
        <div
          class="playtest-modal-content relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-3xl items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6"
        >
          <div
            class="max-h-[calc(100dvh-4rem)] w-full overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-zinc-900/90 p-4 ring-1 ring-white/10 sm:max-h-[calc(100dvh-6rem)]"
            data-modal-box
          >
            <div id="playtestModalInner" class="space-y-3"></div>
          </div>
        </div>
      </div>

      <!-- Submit Map  -->
      <div
        id="submitMapSection"
        class="mt-6 hidden rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6"
      ></div>
    </div>
    <!-- Loading + Pagination -->
    <div id="paginationContainer" class="mt-6 mb-16 flex items-center justify-center gap-2"></div>
  </section>
@endsection

@push('scripts')
  <script nonce="{{ $nonce }}">
    document.documentElement.lang = @json(app()->getLocale());
    window.SUBMIT_I18N = @json(\Illuminate\Support\Facades\Lang::get('submit'));
  </script>
  @vite('resources/js/pages/submit.js', null, ['nonce' => csp_nonce()])
@endpush
