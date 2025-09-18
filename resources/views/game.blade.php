@extends('layouts.app')

@section('title', 'Genji Parkour — ' . __('game.title'))

@section('content')
  <!-- Héro -->
  <section class="relative">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <!-- Titre / lead -->
      <div class="max-w-3xl space-y-5">
        <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          GENJI PARKOUR
          <span
            class="block bg-gradient-to-r from-emerald-300 to-white bg-clip-text text-transparent"
          >
            {{ __('game.title') }}
          </span>
        </h1>

        <p class="text-base text-zinc-300/90 sm:text-lg">
          {{ __('game.lead') }}
        </p>
      </div>

      <!-- Carte du mini-jeu — centrée, 800x200 -->
      <div class="mt-8 flex justify-center lg:mt-12">
        <!-- largeur de la carte = 800px + padding -->
        <div class="w-full max-w-[860px]">
          <div
            class="rounded-2xl bg-zinc-900/70 p-4 shadow-2xl ring-1 shadow-black/50 ring-white/10 backdrop-blur sm:p-5"
          >
            <!-- En-tête -->
            <div class="mb-3 flex items-center justify-between">
              <h2 class="text-sm font-semibold text-zinc-200">{{ __('game.card_title') }}</h2>
              <div class="flex items-center gap-2 text-xs">
                <span
                  id="scoreDisplay"
                  class="rounded-lg bg-white/5 px-2 py-1 text-zinc-200 ring-1 ring-white/10"
                  aria-live="polite"
                >
                  {{ __('game.score') }}: 0
                </span>
                <span
                  id="highScoreDisplay"
                  class="rounded-lg bg-white/5 px-2 py-1 text-zinc-200 ring-1 ring-white/10"
                  aria-live="polite"
                >
                  {{ __('game.highest_score') }}: 0
                </span>
              </div>
            </div>

            <!-- Canvas 800×200 -->
            <div class="relative flex justify-center">
              <canvas
                id="gameCanvas"
                width="800"
                height="200"
                class="block aspect-[4/1] w-full max-w-[800px] rounded-xl bg-black/40 ring-1 ring-white/10"
              ></canvas>
            </div>

            <!-- Aides / volume / actions -->
            <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <!-- Astuce -->
              <p class="flex-1 text-xs text-zinc-400 sm:text-sm">
                {{ __('game.press_space_to_jump') }}
              </p>

              <!-- Slider volume (à gauche du bouton) -->
              <label class="flex items-center gap-2 text-xs text-zinc-200 sm:text-sm">
                <svg
                  class="h-5 w-5 text-zinc-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M12 22a1 1 0 0 1-.707-.293L6.586 17H4c-1.103 0-2-.897-2-2V9c0-1.103.897-2 2-2h2.586l4.707-4.707A.998.998 0 0 1 13 3v18a1 1 0 0 1-1 1z"
                  />
                  <path
                    d="M18.36 19.36a1 1 0 0 1-.705-1.71C19.167 16.148 20 14.142 20 12s-.833-4.148-2.345-5.65a1 1 0 1 1 1.41-1.419C20.958 6.812 22 9.322 22 12s-1.042 5.188-2.935 7.069a.997.997 0 0 1-.705.291z"
                  />
                </svg>
                <input
                  id="volumeRange"
                  type="range"
                  min="0"
                  max="100"
                  value="70"
                  class="h-1 w-36 cursor-pointer appearance-none rounded-full bg-white/20 accent-emerald-500 md:w-44"
                />
              </label>

              <!-- Bouton restart -->
              <button
                id="restartButton"
                class="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-white/20 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
              >
                {{ __('game.restart_button') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
@endsection

@push('scripts')
  @vite('resources/js/pages/game.js')
@endpush
