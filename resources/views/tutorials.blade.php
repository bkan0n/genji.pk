{{-- resources/views/tutorials.blade.php --}}
@extends('layouts.app')

@section('title', __('tutorials.pageTitle'))
@section('og:title', __('tutorials.ogTitle'))
@section('og:description', __('tutorials.ogDescription'))

@section('content')
  <!-- SECTION 1 -->
  <section id="hero1" class="relative overflow-visible">
    <div class="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
      <div class="grid items-center gap-8 lg:grid-cols-2">
        <div class="space-y-4">
          <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {{ __('tutorials.genjiParkourTechsTitle') }}
          </h1>
          <p class="leading-relaxed text-zinc-300">
            {{ __('tutorials.genjiParkourTechsDescription') }}
          </p>

          <div class="flex items-center gap-3 pt-2">
            <a
              href="#hero2"
              class="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 transition ring-inset hover:bg-white/10 focus:ring-2 focus:ring-emerald-400/40 focus:outline-none"
            >
              <svg
                class="h-4 w-4 opacity-80 transition group-hover:translate-y-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v9.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5A1 1 0 114.707 10.293L8 13.586V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ __('tutorials.scrollDown') }}</span>
            </a>
          </div>
        </div>

        <div
          class="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 shadow-xl ring-1 ring-white/10"
        >
          <div class="aspect-video">
            <iframe
              class="h-full w-full"
              src="https://www.youtube.com/embed/2IhslwdsJuY"
              title="{{ __('tutorials.genjiParkourTechsTitle') }}"
              frameborder="0"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Divider -->
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
  </div>

  <!-- SECTION 2 -->
  <section id="hero2" class="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-16 lg:px-8">
    <div class="grid items-center gap-8 lg:grid-cols-2">
      <!-- Image -->
      <div class="order-last lg:order-first">
        <figure
          class="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 shadow-xl ring-1 ring-white/10"
        >
          <img
            class="h-full w-full object-cover"
            src="{{ asset('assets/img/parkour_tutorial.jpg') }}"
            alt="{{ __('tutorials.techniquesImageAlt') }}"
            loading="lazy"
          />
        </figure>
      </div>

      <!-- Texte -->
      <div class="space-y-4">
        <h2 class="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {{ __('tutorials.tutorialTitle') }}
        </h2>
        <p class="leading-relaxed text-zinc-300">
          {{ __('tutorials.tutorialDescription') }}
        </p>

        <!-- Code -->
        <div class="mt-4">
          <span class="text-sm text-zinc-400">{{ __('tutorials.codeLabel') }}:</span>
          <code
            class="ml-2 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-400/30 transition ring-inset hover:bg-emerald-400/20"
            data-map-code="{{ __('tutorials.codeValue') }}"
            title="{{ __('tutorials.copyTooltip') }}"
          >
            <span class="tracking-wider tabular-nums select-none">
              {{ __('tutorials.codeValue') }}
            </span>
            <svg
              class="h-4 w-4 opacity-70 group-hover:opacity-100"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 16h8m-8-4h8m-2-8H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z"
              />
            </svg>
          </code>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <a
            href="#hero3"
            class="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 transition ring-inset hover:bg-white/10 focus:ring-2 focus:ring-sky-400/40 focus:outline-none"
          >
            <svg
              class="h-4 w-4 opacity-80 transition group-hover:translate-y-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v9.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5A1 1 0 114.707 10.293L8 13.586V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ __('tutorials.scrollDown') }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Divider -->
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
  </div>

  <!-- SECTION 3 -->
  <section id="hero3" class="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-16 lg:px-8">
    <div class="grid items-center gap-8 lg:grid-cols-2">
      <div class="space-y-4">
        <h2 class="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {{ __('tutorials.mapCreation') }}
        </h2>
        <p class="leading-relaxed text-zinc-300">
          {{ __('tutorials.mapCreationDescription') }}
        </p>

        <div class="flex items-center gap-3 pt-2">
          <a
            href="#hero4"
            class="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 transition ring-inset hover:bg-white/10 focus:ring-2 focus:ring-purple-400/40 focus:outline-none"
          >
            <svg
              class="h-4 w-4 opacity-80 transition group-hover:translate-y-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v9.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5A1 1 0 114.707 10.293L8 13.586V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ __('tutorials.scrollDown') }}</span>
          </a>
        </div>
      </div>

      <div
        class="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 shadow-xl ring-1 ring-white/10"
      >
        <div class="aspect-video">
          <iframe
            class="h-full w-full"
            src="https://www.youtube.com/embed/fBhq3qhlQOM"
            title="{{ __('tutorials.mapCreation') }}"
            frameborder="0"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  </section>

  <!-- Divider -->
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
  </div>

  <!-- SECTION 4 -->
  <section id="hero4" class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
    <div class="grid items-center gap-8 lg:grid-cols-2">
      <div
        class="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 shadow-xl ring-1 ring-white/10"
      >
        <div class="aspect-video">
          <iframe
            class="h-full w-full"
            src="https://www.youtube.com/embed/GOrlrqjSJlQ?si=O8WsfQVV8kCjAkpE"
            title="{{ __('tutorials.speedrunnerTitle') }}"
            frameborder="0"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {{ __('tutorials.speedrunnerTitle') }}
        </h2>
        <p class="leading-relaxed text-zinc-300">
          {{ __('tutorials.speedrunnerDescription') }}
        </p>

        <div class="pt-2">
          <a
            href="#hero1"
            class="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200"
          >
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M10 17a1 1 0 01-1-1V6.414L5.707 9.707a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L11 6.414V16a1 1 0 01-1 1z"
                clip-rule="evenodd"
              />
            </svg>
            {{ __('tutorials.backToTop') }}
          </a>
        </div>
      </div>
    </div>
  </section>
@endsection

@push('scripts')
  @vite('resources/js/pages/tutorials.js', null, ['nonce' => csp_nonce()])
@endpush
