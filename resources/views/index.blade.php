@extends('layouts.app')

@section('title', __('index.meta.title'))
@section('og:title', __('index.meta.og.title'))
@section('og:description', __('index.meta.og.description'))

@push('head')
  @php($nonce = csp_nonce())
@endpush

@section('content')
  <!-- Hero -->
  <section class="relative overflow-visible">
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div class="grid items-center gap-10 lg:grid-cols-12">
        <div class="space-y-6 lg:col-span-7">
          <span
            class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
          >
            <span class="bg-brand-400 inline-block h-2 w-2 rounded-full"></span>
            {{ __('index.hero.badge') }}
          </span>

          <h1
            class="overflow-visible text-4xl leading-[1.15] font-black tracking-tight sm:text-5xl sm:leading-[1.12]"
          >
            {{ __('index.hero.title') }}
            <span
              class="from-brand-300 block bg-gradient-to-r via-emerald-200 to-white bg-clip-text pb-1 text-transparent sm:pb-1.5"
            >
              {{ __('index.hero.tagline') }}
            </span>
          </h1>

          <p class="max-w-2xl text-zinc-300">
            {{ __('index.hero.description') }}
          </p>

          <div class="flex flex-wrap items-center gap-3">
            <a
              href="{{ url('leaderboard') }}"
              class="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
            >
              {{ __('index.hero.cta_leaderboard') }}
              <svg class="h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M14 3l7 7-7 7v-4H3v-6h11V3z" />
              </svg>
            </a>
            <a
              href="{{ url('submit?section=submit_map') }}"
              class="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold hover:border-white/20 hover:bg-white/5"
            >
              {{ __('index.hero.cta_submit') }}
              <svg class="h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 13H5v-2h14v2Z" />
              </svg>
            </a>
          </div>

          <div class="flex items-center gap-6 pt-2 text-sm text-zinc-400">
            <div class="flex items-center gap-2">
              <span class="bg-brand-400 h-2 w-2 rounded-full"></span>
              {{ __('index.hero.stats.players') }}
            </div>
            <div class="flex items-center gap-2">
              <span class="bg-brand-400 h-2 w-2 rounded-full"></span>
              {{ __('index.hero.stats.maps') }}
            </div>
            <div class="flex items-center gap-2">
              <span class="bg-brand-400 h-2 w-2 rounded-full"></span>
              {{ __('index.hero.stats.languages') }}
            </div>
          </div>
        </div>

        <div class="lg:col-span-5">
          <div
            id="topMapsCard"
            class="relative rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl"
            data-endpoint="{{ url('api/maps/trending?limit=3') }}"
            data-full-endpoint="{{ url('api/maps/trending?limit=25') }}"
            data-map-endpoint="{{ url('api/maps') }}"
            data-play-label="{{ __('index.top_maps.play') }}"
            data-copied-label="{{ __('index.top_maps.copied')}}"
            data-score-label="{{ __('index.top_maps.score') }}"
            data-completions-label="{{ __('index.top_maps.completions') }}"
            data-upvotes-label="{{ __('index.top_maps.upvotes') }}"
            data-copy-code-label="{{ __('index.actions.copy_code') }}"
          >
            <div class="rounded-xl bg-zinc-900/50 p-6">
              <div class="mb-4 flex items-center justify-between text-xs text-zinc-400">
                <span>{{ __('index.top_maps.title') }}</span>
                <button id="openTrendingModal" type="button" class="hover:text-zinc-200 cursor-pointer">
                  {{ __('index.top_maps.see_all') }}
                </button>
              </div>

              <ul id="topMapsList" class="space-y-3"></ul>

              <ul id="topMapsSkeleton" class="space-y-3">
                @for ($i = 0; $i < 3; $i++)
                  <li class="min-h-[70px] flex items-center justify-between gap-3 rounded-xl border border-white/10 p-3">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2">
                        <div class="h-4 w-20 bg-white/10 rounded animate-pulse"></div>
                        <div class="h-4 w-14 bg-white/10 rounded animate-pulse"></div>
                      </div>
                      <div class="mt-1 h-3 w-52 bg-white/10 rounded animate-pulse"></div>
                    </div>
                    <div class="h-8 w-12 bg-white/10 rounded animate-pulse"></div>
                  </li>
                @endfor
              </ul>

              <p id="topMapsError" class="mt-3 text-xs text-red-300" hidden>
                {{ __('common.error_loading')}}
              </p>
            </div>
          </div>

          {{-- “See all” modal --}}
          <div id="trendingModal" class="fixed inset-0 z-50" role="dialog" aria-modal="true" hidden>
            <div data-overlay class="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-200 ease-out"></div>

            <div data-modal-panel
                class="relative mx-auto mt-16 w-[min(92vw,44rem)] max-h-[85vh] overflow-y-auto
                        rounded-2xl border border-white/10 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur
                        opacity-0 translate-y-3 scale-95 transition-all duration-200 ease-out">

              <ul id="trendingModalList" class="space-y-3 pr-1"></ul>

              <ul id="trendingModalSkeleton" class="space-y-3">
                @for ($i = 0; $i < 25; $i++)
                  <li class="min-h-[70px] flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-900/40 p-3">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2">
                        <div class="h-4 w-20 bg-white/10 rounded animate-pulse"></div>
                        <div class="h-4 w-14 bg-white/10 rounded animate-pulse"></div>
                      </div>
                      <div class="mt-1 h-3 w-64 bg-white/10 rounded animate-pulse"></div>
                    </div>
                    <div class="h-8 w-12 bg-white/10 rounded animate-pulse"></div>
                  </li>
                @endfor
              </ul>

              <p id="trendingModalError" class="mt-3 text-xs text-red-300" hidden>{{ __('common.error_loading') }}</p>
            </div>
          </div>

          {{-- Map details modal --}}
          <div id="mapDetailModal" class="fixed inset-0 z-50" role="dialog" aria-modal="true" hidden>
            <div data-overlay class="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-200 ease-out"></div>

            <div data-modal-panel
                class="relative mx-auto mt-16 w-[min(96vw,60rem)] max-h-[88vh] overflow-y-auto
                        rounded-2xl border border-white/10 bg-zinc-900/95 p-5 sm:p-6 shadow-2xl backdrop-blur
                        opacity-0 translate-y-3 scale-95 transition-all duration-200 ease-out">

              <div id="mapDetailContent" class="space-y-4"></div>

              <div id="mapDetailSkeleton" class="space-y-6" aria-hidden="true">
                <!-- Banner (exact same wrapper as data view) -->
                <div class="w-full rounded-2xl overflow-hidden">
                  <div class="h-40 sm:h-48 md:h-56 w-full bg-white/10 animate-pulse"></div>
                </div>

                <div class="grid gap-6 lg:grid-cols-3">
                  <div class="lg:col-span-2 space-y-6">
                    <!-- Overview card -->
                    <section class="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div class="mb-3 h-3 w-24 rounded bg-white/10 animate-pulse"></div>
                      <ul class="divide-y divide-white/5">
                        <li class="flex items-center justify-between py-2">
                          <span class="h-3 w-20 rounded bg-white/10 animate-pulse"></span>
                          <span class="h-3 w-28 rounded bg-white/10 animate-pulse"></span>
                        </li>
                        <li class="flex items-center justify-between py-2">
                          <span class="h-3 w-24 rounded bg-white/10 animate-pulse"></span>
                          <span class="h-3 w-24 rounded bg-white/10 animate-pulse"></span>
                        </li>
                        <li class="flex items-center justify-between py-2">
                          <span class="h-3 w-24 rounded bg-white/10 animate-pulse"></span>
                          <span class="h-3 w-16 rounded bg-white/10 animate-pulse"></span>
                        </li>
                        <li class="flex items-center justify-between py-2">
                          <span class="h-3 w-20 rounded bg-white/10 animate-pulse"></span>
                          <span class="h-3 w-14 rounded bg-white/10 animate-pulse"></span>
                        </li>
                        <li class="flex items-center justify-between py-2">
                          <span class="h-3 w-24 rounded bg-white/10 animate-pulse"></span>
                          <span class="h-3 w-24 rounded bg-white/10 animate-pulse"></span>
                        </li>
                      </ul>
                    </section>

                    <!-- Mechanics / Restrictions card -->
                    <section class="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div class="grid gap-6 sm:grid-cols-2">
                        <div>
                          <div class="mb-2 h-3 w-24 rounded bg-white/10 animate-pulse"></div>
                          <div class="flex flex-wrap gap-2">
                            <div class="h-6 w-24 rounded-full bg-white/10 animate-pulse"></div>
                            <div class="h-6 w-16 rounded-full bg-white/10 animate-pulse"></div>
                            <div class="h-6 w-20 rounded-full bg-white/10 animate-pulse"></div>
                            <div class="h-6 w-16 rounded-full bg-white/10 animate-pulse"></div>
                            <div class="h-6 w-20 rounded-full bg-white/10 animate-pulse"></div>
                          </div>
                        </div>
                        <div>
                          <div class="mb-2 h-3 w-24 rounded bg-white/10 animate-pulse"></div>
                          <div class="flex flex-wrap gap-2">
                            <div class="h-6 w-20 rounded-full bg-white/10 animate-pulse"></div>
                            <div class="h-6 w-24 rounded-full bg-white/10 animate-pulse"></div>
                            <div class="h-6 w-16 rounded-full bg-white/10 animate-pulse"></div>
                            <div class="h-6 w-20 rounded-full bg-white/10 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  <!-- Right column (Creators + button) -->
                  <aside class="space-y-4 lg:sticky lg:top-6">
                    <section class="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div class="mb-2 h-3 w-20 rounded bg-white/10 animate-pulse"></div>
                      <div class="h-3 w-40 rounded bg-white/10 animate-pulse"></div>
                      <div class="mt-4 flex flex-wrap gap-2">
                        <div class="h-8 w-24 rounded-lg bg-white/10 animate-pulse"></div>
                      </div>
                    </section>
                  </aside>
                </div>
              </div>

              <p id="mapDetailError" class="mt-3 text-xs text-red-300" hidden>{{ __('common.error_loading') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Feature cards -->
  <section id="features" class="py-14 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 flex items-end justify-between sm:mb-14">
        <h2 class="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {{ __('index.features.title') }}
        </h2>
        <a href="https://dsc.gg/genjiparkour" class="text-brand-300 hover:text-brand-200 text-sm">
          {{ __('index.features.join') }}
        </a>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Card 1 -->
        <article
          class="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
        >
          <div class="mb-4 flex items-center justify-between">
            <h3 class="font-semibold">{{ __('index.features.cards.leaderboard.title') }}</h3>
            <span
              class="rounded-full bg-orange-500/15 px-2 py-0.5 text-xs text-orange-300 ring-1 ring-orange-400/25"
            >
              {{ __('index.features.cards.leaderboard.pill') }}
            </span>
          </div>
          <p class="text-sm text-zinc-300">
            {{ __('index.features.cards.leaderboard.description') }}
          </p>
          <div class="mt-5 flex gap-2">
            <a
              href="{{ url('leaderboard') }}"
              class="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
            >
              {{ __('index.features.cards.leaderboard.links.leaderboard') }}
            </a>
            <a
              href="{{ url('statistics') }}"
              class="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
            >
              {{ __('index.features.cards.leaderboard.links.stats') }}
            </a>
          </div>
        </article>

        <!-- Card 2 -->
        <article
          class="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
        >
          <div class="mb-4 flex items-center justify-between">
            <h3 class="font-semibold">{{ __('index.features.cards.guides.title') }}</h3>
            <span
              class="bg-brand-500/15 text-brand-300 ring-brand-400/25 rounded-full px-2 py-0.5 text-xs ring-1"
            >
              {{ __('index.features.cards.guides.pill') }}
            </span>
          </div>
          <p class="text-sm text-zinc-300">{{ __('index.features.cards.guides.description') }}</p>
          <div class="mt-5 flex gap-2">
            <a
              href="{{ url('tutorials') }}"
              class="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
            >
              {{ __('index.features.cards.guides.links.guides') }}
            </a>
            <a
              href="{{ url('submit') }}"
              class="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
            >
              {{ __('index.features.cards.guides.links.submit') }}
            </a>
          </div>
        </article>

        <!-- Card 3 -->
        <article
          class="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
        >
          <div class="mb-4 flex items-center justify-between">
            <h3 class="font-semibold">{{ __('index.features.cards.tools.title') }}</h3>
            <span
              class="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs text-indigo-200 ring-1 ring-indigo-400/25"
            >
              {{ __('index.features.cards.tools.pill') }}
            </span>
          </div>
          <p class="text-sm text-zinc-300">{{ __('index.features.cards.tools.description') }}</p>
          <div class="mt-5 flex gap-2">
            <a
              href="{{ url('convertor') }}"
              class="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
            >
              {{ __('index.features.cards.tools.links.convertor') }}
            </a>
            <!--
            <a href="#api" class="text-sm rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5">
              {{ __('index.features.cards.tools.links.api') }}
            </a>
            -->
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- CTA strip -->
  @unless (session()->has('user_id'))
    <section class="py-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          class="border-brand-400/30 from-brand-700/40 relative overflow-hidden rounded-2xl border bg-gradient-to-r to-zinc-900 p-6 sm:p-8"
        >
          <div
            class="bg-brand-500/20 absolute -top-8 -right-8 h-40 w-40 rounded-full blur-2xl"
          ></div>
          <div
            class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 class="text-xl font-bold">{{ __('index.cta.title') }}</h3>
              <p class="text-sm text-zinc-300">{{ __('index.cta.description') }}</p>
            </div>
            <div class="flex gap-3">
              <a
                href="#login"
                class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
              >
                {{ __('index.cta.login') }}
                <svg class="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M14 3l7 7-7 7v-4H3v-6h11V3z" />
                </svg>
              </a>
              <a
                href="#learn"
                class="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/5"
              >
                {{ __('index.cta.learn_more') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  @endunless
@endsection

@push('scripts')
  <script nonce="{{ $nonce }}">
    document.documentElement.lang = @json(app()->getLocale());
    window.INDEX_I18N = @json(\Illuminate\Support\Facades\Lang::get('index'));
  </script>
  @vite('resources/js/pages/index.js')
@endpush