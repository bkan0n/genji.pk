@extends('layouts.app')

@section('title', __('lootbox.meta.title'))
@section('og:title', __('lootbox.meta.og.title'))
@section('og:description', __('lootbox.meta.og.description'))

@push('head')
  @php($nonce = csp_nonce())
  <script
    nonce="{{ $nonce }}"
    src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"
  ></script>
@endpush

@section('content')
  <!-- En-tête -->
  <section class="relative">
    <div class="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {{ __('lootbox.header.title') }}
          </h1>
          <p class="text-sm text-zinc-300 sm:text-base">
            {{ __('lootbox.header.subtitle') }}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Contenu -->
  <section class="relative mt-8 min-h-[100vh] pb-16">
    <div class="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 sm:px-6 lg:px-8">
      <!-- Cartes / Pack -->
      <div class="flex w-full justify-center">
        <div id="box" class="flex gap-6">
          <div
            class="loot-card card1 lb-placeholder h-[320px] w-[220px] rounded-2xl border border-white/10 bg-zinc-800/80 shadow-lg"
          ></div>
          <div
            class="loot-card card2 lb-placeholder h-[320px] w-[220px] rounded-2xl border border-white/10 bg-zinc-800/80 shadow-lg"
          ></div>
          <div
            class="loot-card card3 lb-placeholder h-[320px] w-[220px] rounded-2xl border border-white/10 bg-zinc-800/80 shadow-lg"
          ></div>
        </div>
        <ul id="crate" class="flex gap-6"></ul>
      </div>

      <!-- Sélecteur de clé -->
      <div class="flex flex-col items-center gap-4">
        <div class="flex items-center gap-3">
          <div id="key-wrapper" class="relative inline-block">
            <button
              id="key-type-button"
              class="cursor-pointer rounded-lg border border-white/10 bg-zinc-900/60 px-4 py-2 text-sm font-medium transition hover:bg-white/5"
              aria-haspopup="listbox"
              aria-expanded="false"
            >
              {{ __('lootbox.ui.select_key_type') }}
            </button>

            <div
              id="key-dropdown"
              class="absolute top-full left-1/2 z-20 mt-2 hidden w-40 -translate-x-1/2 rounded-lg border border-white/10 bg-zinc-900/95 shadow-xl"
              role="listbox"
            ></div>
          </div>

          <div id="key-count" class="text-sm text-zinc-300"></div>
        </div>
      </div>

      <!-- Boutons -->
      <div class="flex items-center gap-4">
        <button
          class="generate bg-brand-500 hover:bg-brand-400 cursor-pointer rounded-xl border border-white/10 px-6 py-2 font-semibold text-white shadow transition"
        >
          {{ __('lootbox.ui.open_pack') }}
        </button>
        <button
          class="info-button cursor-pointer rounded-full border border-white/10 bg-zinc-900/60 p-2 hover:bg-white/5"
          aria-label="Infos"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 4a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 12 6Zm1.5 12h-3v-1.5h1.5V11H10V9.5h3A1 1 0 0 1 14 10.5v4.5h1V18Z"
            />
          </svg>
        </button>
      </div>

      <!-- Modal Infos -->
      <div
        id="infoModal"
        class="fixed inset-0 z-[150] hidden items-center justify-center bg-black/70 backdrop-blur-sm"
      >
        <div
          class="modal-infos relative max-h-[80vh] w-full max-w-md scale-95 overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-zinc-900/95 p-6 opacity-0 shadow-xl transition duration-200 ease-out sm:max-h-[70vh]"
          data-modal-box
          role="dialog"
          aria-modal="true"
          aria-labelledby="lootboxInfoTitle"
        >
          <button
            class="close-button absolute top-4 right-4 rounded-md p-1 hover:bg-white/10"
            aria-label="Close Modal"
          >
            <span class="text-lg leading-none">&times;</span>
          </button>

          <h3 id="lootboxInfoTitle" class="mb-3 text-lg font-bold">
            {{ __('lootbox.ui.drop_rates') }}
          </h3>

          <div class="space-y-1 text-sm">
            <div>
              <span class="font-semibold text-zinc-200">{{ __('lootbox.ui.common') }}</span>
              : 80%
            </div>
            <div>
              <span class="font-semibold text-sky-400">{{ __('lootbox.ui.rare') }}</span>
              : 16%
            </div>
            <div>
              <span class="font-semibold text-purple-400">{{ __('lootbox.ui.epic') }}</span>
              : 3%
            </div>
            <div>
              <span class="font-semibold text-amber-400">{{ __('lootbox.ui.legendary') }}</span>
              : 1%
            </div>
          </div>

          <p class="mt-4 text-sm text-zinc-300">
            {{ __('lootbox.ui.lootbox_infos') }}
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <button
              class="filter-button cursor-pointer rounded-md border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5"
              data-type="background"
            >
              {{ __('lootbox.ui.rewards_types.background') }}
            </button>
            <button
              class="filter-button cursor-pointer rounded-md border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5"
              data-type="spray"
            >
              {{ __('lootbox.ui.rewards_types.spray') }}
            </button>
            <button
              class="filter-button cursor-pointer rounded-md border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5"
              data-type="skin-pose"
            >
              {{ __('lootbox.ui.rewards_types.skin') }} &
              {{ __('lootbox.ui.rewards_types.pose') }}
            </button>
          </div>

          <div id="rewards-container" class="mt-4 hidden flex-wrap gap-2"></div>
        </div>
      </div>
    </div>
  </section>
@endsection

@push('scripts')
  <script nonce="{{ $nonce }}">
    document.documentElement.lang = @json(app()->getLocale());
    window.LOOTBOX_I18N = @json(\Illuminate\Support\Facades\Lang::get('lootbox'));
  </script>
  @vite('resources/js/pages/lootbox.js', null, ['nonce' => csp_nonce()])
@endpush
