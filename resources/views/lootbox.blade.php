{{-- resources/views/pages/lootbox.blade.php --}}
@extends('layouts.app')

@section('title', __('lootbox.meta.title'))
@section('og:title', __('lootbox.meta.og.title'))
@section('og:description', __('lootbox.meta.og.description'))

@push('head')
  @php($nonce = csp_nonce())
  <script nonce="{{ $nonce }}" src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
@endpush

@section('content')
  <!-- En-tête -->
  <section class="relative">
    <div class="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {{ __('lootbox.header.title') }}
          </h1>
          <p class="text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">
            {{ __('lootbox.header.subtitle') }}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Contenu -->
  <section class="relative mt-8 min-h-[100vh] pb-16">
    <div class="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 sm:px-6 lg:px-8">
      <!-- Stage 3D  -->
      <div class="w-full flex justify-center">
        <div class="relative w-full max-w-[980px]">
          <!-- Mount 3D -->
          <div id="box" class="w-full relative">
            <!-- Skeleton -->
            <div
              id="box-skeleton"
              class="absolute inset-0 z-10 rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-950/35 ring-1 ring-zinc-200/40 dark:ring-white/10 overflow-hidden"
              aria-live="polite"
              aria-busy="true"
            >
              <div class="p-4 space-y-4 animate-pulse">
                <div class="flex items-center justify-between gap-3">
                  <div class="space-y-2 min-w-0 flex-1">
                    <div class="h-4 w-40 rounded bg-zinc-900/10 dark:bg-white/10"></div>
                    <div class="h-3 w-28 rounded bg-zinc-900/5 dark:bg-white/5"></div>
                  </div>
                  <div class="h-8 w-20 rounded-lg bg-zinc-900/10 dark:bg-white/10"></div>
                </div>

                <div class="rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-900/5 dark:bg-white/5 aspect-[16/9]"></div>

                <div class="flex items-center justify-between gap-3">
                  <div class="h-3 w-24 rounded bg-zinc-900/5 dark:bg-white/5"></div>
                  <div class="h-3 w-32 rounded bg-zinc-900/5 dark:bg-white/5"></div>
                </div>

                <div class="text-xs text-zinc-600 dark:text-zinc-300">
                  {{ __('lootbox.ui.loading_3d') }}
                </div>
              </div>
            </div>

            <!-- Optional error -->
            <div
              id="box-fallback"
              class="hidden absolute inset-0 z-10 rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/80 dark:bg-zinc-950/40 ring-1 ring-zinc-200/40 dark:ring-white/10 p-5"
              role="status"
            >
              <div class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {{ __('lootbox.ui.loading_3d_failed_title') }}
              </div>
              <div class="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                {{ __('lootbox.ui.loading_3d_failed_desc') }}
              </div>
              <button
                id="box-retry"
                type="button"
                class="mt-4 inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-950/40 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
              >
                {{ __('lootbox.ui.retry') }}
              </button>
            </div>
          </div>

          <ul id="crate" class="absolute inset-0 hidden opacity-0 pointer-events-none"></ul>
        </div>
      </div>

      <!-- Sélecteur de clé -->
      <div class="flex flex-col items-center gap-4">
        <div class="flex items-center gap-3">
          <div id="key-wrapper" class="relative inline-block">
            <button
              id="key-type-button"
              class="cursor-pointer rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/5 inline-flex items-center justify-between gap-2 min-w-[180px]"
              aria-haspopup="listbox"
              aria-expanded="false"
            >
              <span id="key-type-label" class="truncate">{{ __('lootbox.ui.select_key_type') }}</span>
              <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-300/70" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
              </svg>
            </button>

            <div
              id="key-dropdown"
              class="absolute top-full left-1/2 z-20 mt-2 hidden w-56 -translate-x-1/2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/98 shadow-xl p-1"
              role="listbox"
            ></div>
          </div>

          <div id="key-count" class="text-sm text-zinc-600 dark:text-zinc-300"></div>
        </div>
      </div>

      <!-- Boutons -->
      <div class="flex items-center gap-4">
        <button
          class="generate bg-brand-500 hover:bg-brand-400 cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 px-6 py-2 font-semibold text-white shadow transition"
        >
          {{ __('lootbox.ui.open_pack') }}
        </button>

        <button
          class="info-button cursor-pointer rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 p-2 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
          aria-label="{{ __('lootbox.ui.info') }}"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 4a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 12 6Zm1.5 12h-3v-1.5h1.5V11H10V9.5h3A1 1 0 0 1 14 10.5v4.5h1V18Z"
            />
          </svg>
        </button>

        <button
          id="store-button"
          class="cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 px-4 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
          aria-label="{{ __('lootbox.store.title') }}"
          type="button"
        >
          <span class="inline-flex items-center gap-2">
            <span class="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.65)]"></span>
            {{ __('lootbox.store.title') }}
          </span>
        </button>
      </div>

      <!-- Modal Infos -->
      <div
        id="infoModal"
        class="fixed inset-0 z-[150] hidden items-center justify-center bg-black/70 backdrop-blur-sm"
      >
        <div
          class="modal-infos relative max-h-[80vh] w-full max-w-md scale-95 overflow-y-auto overscroll-contain rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-6 opacity-0 shadow-xl transition duration-200 ease-out sm:max-h-[70vh]"
          data-modal-box
          role="dialog"
          aria-modal="true"
          aria-labelledby="lootboxInfoTitle"
        >
          <button
            class="close-button absolute top-4 right-4 rounded-md p-1 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/10"
            aria-label="{{ __('lootbox.ui.close_modal') }}"
          >
            <span class="text-lg leading-none">&times;</span>
          </button>

          <h3 id="lootboxInfoTitle" class="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {{ __('lootbox.ui.drop_rates') }}
          </h3>

          <div class="space-y-1 text-sm text-zinc-700 dark:text-zinc-200">
            <div>
              <span class="font-semibold text-zinc-900 dark:text-zinc-100">{{ __('lootbox.ui.common') }}</span>
              : 80%
            </div>
            <div>
              <span class="font-semibold text-sky-500 dark:text-sky-400">{{ __('lootbox.ui.rare') }}</span>
              : 16%
            </div>
            <div>
              <span class="font-semibold text-purple-500 dark:text-purple-400">{{ __('lootbox.ui.epic') }}</span>
              : 3%
            </div>
            <div>
              <span class="font-semibold text-amber-500 dark:text-amber-400">{{ __('lootbox.ui.legendary') }}</span>
              : 1%
            </div>
          </div>

          <p class="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
            {{ __('lootbox.ui.lootbox_infos') }}
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <button
              class="filter-button cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/40 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
              data-type="background"
            >
              {{ __('lootbox.ui.rewards_types.background') }}
            </button>
            <button
              class="filter-button cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/40 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
              data-type="spray"
            >
              {{ __('lootbox.ui.rewards_types.spray') }}
            </button>
            <button
              class="filter-button cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/40 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
              data-type="skin-pose"
            >
              {{ __('lootbox.ui.rewards_types.skin') }} & {{ __('lootbox.ui.rewards_types.pose') }}
            </button>
          </div>

          <div id="rewards-container" class="mt-4 hidden flex-wrap gap-2"></div>
        </div>
      </div>
    </div>
  </section>

  {{-- Store Modal --}}
  <div
    id="storeModal"
    class="fixed inset-0 z-[160] hidden items-center justify-center bg-black/70 backdrop-blur-sm p-4"
  >
    <div
      class="relative max-h-[86vh] w-full max-w-5xl scale-95 overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-950/90 opacity-0 shadow-2xl transition duration-200 ease-out"
      data-modal-box
      role="dialog"
      aria-modal="true"
      aria-labelledby="storeTitle"
      data-modal-max="5xl"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-zinc-200/70 dark:border-white/10 px-5 py-4">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/25 flex items-center justify-center">
            <svg class="h-5 w-5 text-zinc-900 dark:text-white/80" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M15 14V17.6C15 18.4401 15 18.8601 14.8365 19.181C14.6927 19.4632 14.4632 19.6927 14.181 19.8365C13.8601 20 13.4401 20 12.6 20H7.40001C6.55994 20 6.1399 20 5.81903 19.8365C5.53679 19.6927 5.30731 19.4632 5.1635 19.181C5.00001 18.8601 5.00001 18.4401 5.00001 17.6V10M19 10V20M5.00001 16H15M5.55778 4.88446L3.5789 8.84223C3.38722 9.22559 3.29138 9.41727 3.3144 9.57308C3.3345 9.70914 3.40976 9.8309 3.52246 9.90973C3.65153 10 3.86583 10 4.29444 10H19.7056C20.1342 10 20.3485 10 20.4776 9.90973C20.5903 9.8309 20.6655 9.70914 20.6856 9.57308C20.7086 9.41727 20.6128 9.22559 20.4211 8.84223L18.4422 4.88446C18.2817 4.5634 18.2014 4.40287 18.0817 4.28558C17.9758 4.18187 17.8482 4.10299 17.7081 4.05465C17.5496 4 17.3701 4 17.0112 4H6.98887C6.62991 4 6.45043 4 6.29198 4.05465C6.15185 4.10299 6.02422 4.18187 5.91833 4.28558C5.79858 4.40287 5.71832 4.5634 5.55778 4.88446Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div>
            <h3 id="storeTitle" class="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              {{ __('lootbox.store.title') }}
            </h3>
            <p class="text-xs text-zinc-600 dark:text-zinc-300">
              {{ __('lootbox.store.subtitle') }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div
            id="store-coins-pill"
            class="hidden sm:inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-zinc-900/5 dark:bg-white/5 ring-1 ring-zinc-200/50 dark:ring-white/10 text-zinc-700 dark:text-zinc-200"
          >
            <span class="h-2 w-2 rounded-full bg-amber-400"></span>
            <span>{{ __('lootbox.store.coins_label') }}</span>
            <span id="store-coins" class="text-amber-600 dark:text-amber-400">—</span>
          </div>

          <button
            id="store-close"
            class="rounded-lg cursor-pointer p-2 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/10"
            aria-label="{{ __('lootbox.ui.close_modal') }}"
            type="button"
          >
            <span class="text-lg leading-none">&times;</span>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 p-5 overflow-y-auto max-h-[calc(86vh-64px)]">
        <!-- LEFT: Rotation -->
        <section class="lg:col-span-2 rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 ring-1 ring-zinc-200/40 dark:ring-white/10 overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 border-b border-zinc-200/60 dark:border-white/10">
            <div>
              <div class="text-sm font-bold text-zinc-900 dark:text-zinc-100">{{ __('lootbox.store.rotation_title') }}</div>
              <div class="text-xs text-zinc-600 dark:text-zinc-300">
                <span id="store-rotation-ttl">—</span>
              </div>
            </div>
            <button
              id="store-refresh"
              type="button"
              class="rounded-lg cursor-pointer px-3 py-1.5 text-xs font-semibold border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-950/40 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
            >
              {{ __('lootbox.store.refresh') }}
            </button>
          </div>

          <div id="store-rotation" class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- cards -->
          </div>
        </section>

        <!-- RIGHT: Keys + History -->
        <aside class="space-y-4">
          <!-- Keys pricing -->
          <section class="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 ring-1 ring-zinc-200/40 dark:ring-white/10 overflow-visible">
            <div class="px-4 py-3 border-b border-zinc-200/60 dark:border-white/10">
              <div class="text-sm font-bold text-zinc-900 dark:text-zinc-100">{{ __('lootbox.store.buy_keys_title') }}</div>
              <div class="text-xs text-zinc-600 dark:text-zinc-300">{{ __('lootbox.store.buy_keys_subtitle') }}</div>
            </div>

            <div class="p-4 space-y-3">
              <div class="flex items-center gap-2">
                <!-- Key Type -->
                <div id="store-key-type-wrap" class="relative z-30 w-full">
                  <input id="store-key-type" type="hidden" value="Classic" />

                  <button
                    id="store-key-type-btn"
                    type="button"
                    class="w-full cursor-pointer rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-950/40 px-3 py-2 text-sm text-left font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 transition flex items-center justify-between gap-2"
                    aria-haspopup="listbox"
                    aria-expanded="false"
                    aria-controls="store-key-type-list"
                  >
                    <span id="store-key-type-label" class="truncate">{{ __('lootbox.ui.key_types.Classic') }}</span>
                    <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-300/70" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                    </svg>
                  </button>

                  <div
                    id="store-key-type-list"
                    class="custom-multiselect-list absolute left-0 right-0 z-[200] mt-1 hidden max-h-64 overflow-y-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/98 p-1 shadow-xl dropdown-list dd-anim"
                    role="listbox"
                    aria-hidden="true"
                  >
                    <button
                      type="button"
                      class="dd-opt flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer"
                      role="option"
                      data-value="Classic"
                    >
                      <span class="truncate">{{ __('lootbox.ui.key_types.Classic') }}</span>
                    </button>
                    <button
                      type="button"
                      class="dd-opt flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer"
                      role="option"
                      data-value="Winter"
                    >
                      <span class="truncate">{{ __('lootbox.ui.key_types.Winter') }}</span>
                    </button>
                  
                    <button
                      type="button"
                      class="dd-opt flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer"
                      role="option"
                      data-value="Spring"
                    >
                      <span class="truncate">{{ __('lootbox.ui.key_types.Spring') }}</span>
                    </button>
                    <button
                      type="button"
                      class="dd-opt flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer"
                      role="option"
                      data-value="Summer"
                    >
                      <span class="truncate">{{ __('lootbox.ui.key_types.Summer') }}</span>
                    </button>
                    <button
                      type="button"
                      class="dd-opt flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer"
                      role="option"
                      data-value="Autumn"
                    >
                      <span class="truncate">{{ __('lootbox.ui.key_types.Autumn') }}</span>
                    </button>
</div>
                </div>

                <!-- Qty (custom dropdown) -->
                <div id="store-key-qty-wrap" class="relative z-30 w-28 shrink-0">
                  <input id="store-key-qty" type="hidden" value="1" />

                  <button
                    id="store-key-qty-btn"
                    type="button"
                    class="w-full cursor-pointer rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-950/40 px-3 py-2 text-sm text-left font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 transition flex items-center justify-between gap-2"
                    aria-haspopup="listbox"
                    aria-expanded="false"
                    aria-controls="store-key-qty-list"
                  >
                    <span id="store-key-qty-label" class="truncate">x1</span>
                    <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-300/70" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                    </svg>
                  </button>

                  <div
                    id="store-key-qty-list"
                    class="custom-multiselect-list absolute left-0 right-0 z-[200] mt-1 hidden max-h-64 overflow-y-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl dropdown-list dd-anim"
                    role="listbox"
                    aria-hidden="true"
                  >
                    <button
                      type="button"
                      class="dd-opt flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer"
                      role="option"
                      data-value="1"
                    >
                      <span class="truncate">x1</span>
                    </button>
                    <button
                      type="button"
                      class="dd-opt flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer"
                      role="option"
                      data-value="3"
                    >
                      <span class="truncate">x3</span>
                    </button>
                    <button
                      type="button"
                      class="dd-opt flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer"
                      role="option"
                      data-value="5"
                    >
                      <span class="truncate">x5</span>
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between text-xs">
                <span class="text-zinc-600 dark:text-zinc-300">{{ __('lootbox.store.price_label') }}</span>
                <span id="store-key-price" class="font-bold text-emerald-600 dark:text-emerald-300">—</span>
              </div>

              <button
                id="store-buy-keys"
                type="button"
                class="w-full cursor-pointer rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-sm font-extrabold text-zinc-900 shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {{ __('lootbox.store.purchase_keys') }}
              </button>

              <div id="store-keys-note" class="text-[11px] text-zinc-600 dark:text-zinc-300"></div>
            </div>
          </section>

          <!-- Purchases -->
          <section class="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 ring-1 ring-zinc-200/40 dark:ring-white/10 overflow-hidden">
            <div class="px-4 py-3 border-b border-zinc-200/60 dark:border-white/10">
              <div class="text-sm font-bold text-zinc-900 dark:text-zinc-100">{{ __('lootbox.store.purchase_history_title') }}</div>
              <div class="text-xs text-zinc-600 dark:text-zinc-300">{{ __('lootbox.store.purchase_history_subtitle') }}</div>
            </div>
            <div id="store-history" class="p-3 space-y-2">
              <!-- items -->
            </div>
          </section>
        </aside>
      </div>
    </div>
  </div>
@endsection

@push('scripts')
  <script nonce="{{ $nonce }}">
    document.documentElement.lang = @json(app()->getLocale());
    window.LOOTBOX_I18N = @json(\Illuminate\Support\Facades\Lang::get('lootbox'));
  </script>
  @vite('resources/js/pages/lootbox.js', null, ['nonce' => csp_nonce()])
@endpush