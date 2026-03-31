@extends('layouts.app')

@php
  $movementTechConfig = [
    'endpoints' => [
      'categories' => '/api/content/movement-tech/categories',
      'difficulties' => '/api/content/movement-tech/difficulties',
      'techniques' => '/api/content/movement-tech',
    ],
  ];
@endphp

@section('title', __('movement_tech.meta.title'))
@section('og:title', __('movement_tech.meta.og.title'))
@section('og:description', __('movement_tech.meta.og.description'))

@section('content')
  <section class="relative">
    <div class="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 sm:pt-14 sm:pb-8 lg:px-8">
      <div class="max-w-3xl">
        <h1 class="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          {{ __('movement_tech.hero.title') }}
        </h1>
        <p class="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-base">
          {{ __('movement_tech.hero.live_subtitle') }}
        </p>
      </div>
    </div>
  </section>

  <section class="relative pb-16 sm:pb-20 min-h-[100vh]">
    <div id="movementTechApp" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div id="movementTechTabsWrap" class="mt-3 hidden overflow-x-auto">
        <div
          id="movementTechTabs"
          class="relative inline-flex w-fit max-w-full items-center rounded-xl border border-zinc-200/80 bg-zinc-100 p-1 dark:border-white/10 dark:bg-white/5"
        >
          <div
            id="movementTechTabsHighlight"
            aria-hidden="true"
            class="pointer-events-none absolute top-1 bottom-1 left-0 z-0 rounded-lg bg-zinc-900 shadow-lg shadow-zinc-900/15 transition-[transform,width] duration-300 ease-[cubic-bezier(.22,.9,.24,1)] dark:bg-white dark:shadow-black/30"
          ></div>
          <div id="movementTechTabsButtons" class="relative z-[1] flex items-center gap-1"></div>
        </div>
      </div>

      <div
        id="movementTechStatus"
        class="mt-6 rounded-2xl border border-zinc-200/80 bg-zinc-100/80 px-6 py-10 text-center text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
      >
        {{ __('movement_tech.ui.loading') }}
      </div>

      <div id="movementTechGrid" class="mt-6 hidden space-y-5"></div>

      <div
        id="movementTechEmpty"
        class="mt-6 hidden rounded-2xl border border-dashed border-zinc-300/80 bg-zinc-50/80 px-6 py-10 text-center text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-400"
      >
        {{ __('movement_tech.ui.empty') }}
      </div>
    </div>
  </section>
@endsection

@push('scripts')
  <script nonce="{{ csp_nonce() }}">
    window.MOVEMENT_TECH_I18N = @json(\Illuminate\Support\Facades\Lang::get('movement_tech'));
    window.MOVEMENT_TECH_CONFIG = {!! json_encode($movementTechConfig, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!};
  </script>
  @vite('resources/js/pages/movement-tech.js', null, ['nonce' => csp_nonce()])
@endpush
