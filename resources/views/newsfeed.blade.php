{{-- resources/views/newsfeed.blade.php --}}
@extends('layouts.app')

@section('title', 'Genji Parkour - ' . __('newsfeed.title'))
@section('og:title', 'Genji Parkour - ' . __('newsfeed.title'))
@section('og:description', __('newsfeed.subtitle'))

@push('head')
  @php($nonce = csp_nonce())
@endpush

@section('content')
  <section class="relative">
    <div class="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 sm:pt-14 sm:pb-8 lg:px-8">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {{ __('newsfeed.title') }}
            <span class="block text-sm font-medium text-zinc-300 sm:text-base">
              {{ __('newsfeed.subtitle') }}
            </span>
          </h1>
        </div>
      </div>
    </div>
  </section>

  <!-- Sections (Newsfeed / Completions) -->
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mt-1">
      <div id="nfTabs" class="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          id="tabNewsfeed"
          class="tab-btn cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900"
        >
          {{ __('newsfeed.tabs.newsfeed') }}
        </button>
        <button
          id="tabCompletions"
          class="tab-btn cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          {{ __('newsfeed.tabs.completions') }}
        </button>
      </div>
    </div>
  </div>

  <!-- ========== PANEL: NEWSFEED ========== -->
  <div id="panel-newsfeed" class="mt-6 space-y-6">
    <!-- Filters / search -->
    <section class="relative">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
          <div class="grid gap-3 lg:grid-cols-[1fr_auto]">
            <!-- Search + tags -->
            <div class="space-y-3">
              <div
                class="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-2"
              >
                <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 1016 9.5c0 1.61-.59 3.09-1.57 4.23l.27.27h.79L20.5 19 19 20.5 15.5 17zM10 14a4.5 4.5 0 110-9 4.5 4.5 0 010 9z"
                  />
                </svg>
                <input
                  id="nf-search"
                  type="text"
                  placeholder="{{ __('newsfeed.search_placeholder') }}"
                  class="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
                />
                <kbd
                  class="hidden rounded border border-white/10 px-1 py-0.5 text-[10px] text-zinc-400 sm:block"
                >
                  /
                </kbd>
              </div>

              <div class="flex flex-wrap gap-2" id="nf-tags">
                @php($tags = ['all', 'announcement', 'guide', 'new_map', 'role', 'record'])
                @foreach ($tags as $i => $tag)
                  <button
                    class="nf-chip {{ $i === 0 ? 'bg-white/10' : '' }} inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                    data-filter="{{ $tag }}"
                    {!! $i === 0 ? 'data-active="true"' : '' !!}
                  >
                    {{ __('newsfeed.tags.' . $tag) }}
                  </button>
                @endforeach
              </div>
            </div>

            <!-- Reset -->
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
              <button
                id="nf-reset"
                class="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-2 text-sm hover:bg-white/5"
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
                {{ __('newsfeed.reset') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Liste + Sidebar -->
    <section class="relative pb-10 sm:pb-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid gap-6 lg:grid-cols-12">
          <div class="lg:col-span-8">
            <div id="newsfeedContainer" class="space-y-4"></div>

            <div
              id="nf-empty"
              class="mt-6 hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-center"
            >
              <div
                class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10"
              >
                <svg class="h-6 w-6 text-zinc-300" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19 3H5a2 2 0 0 0-2 2v14l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-semibold">{{ __('newsfeed.empty.title') }}</h3>
              <p class="mt-1 text-sm text-zinc-400">{{ __('newsfeed.empty.subtitle') }}</p>
            </div>

            <!-- Load more  -->
            <div class="mt-4 flex items-center justify-center">
              <button
                id="nf-loadmore"
                class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/5"
              >
                {{ __('newsfeed.load_more') }}
              </button>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="space-y-4 lg:col-span-4">
          <!-- Community Picks -->
          <div
            id="communityPicksCard"
            class="rounded-2xl border border-white/10 bg-white/5 p-4"
            data-endpoint="{{ url('/api/maps/trending?limit=3') }}"
            data-full-endpoint="{{ url('/api/maps/trending?limit=25') }}"
          >
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">{{ __('newsfeed.sidebar.community_picks') }}</h3>

              <a href="#"
                id="openCommunityPicksModal"
                class="text-brand-300 hover:text-brand-200 text-sm">
                {{ __('newsfeed.sidebar.see_all') }}
              </a>
            </div>

            <ul id="cpList" class="mt-3 space-y-3 text-sm"></ul>

            <!-- Skeleton -->
            <ul id="cpSkeleton" class="mt-3 space-y-3" aria-hidden="true">
              @for ($i=0; $i<3; $i++)
                <li class="flex items-center justify-between animate-pulse">
                  <div class="flex min-w-0 items-center gap-2">
                    <div class="h-9 w-20 rounded-md border border-white/10 bg-zinc-900/50"></div>

                    <div class="min-w-0">
                      <div class="h-4 w-28 rounded bg-white/10"></div>
                      <div class="mt-1 h-5 w-16 rounded-md border border-white/10 bg-white/5"></div>
                    </div>
                  </div>

                  <div class="flex items-center gap-1 shrink-0">
                    <div class="h-4 w-4 rounded bg-white/10"></div>
                    <div class="h-4 w-6 rounded bg-white/10"></div>
                  </div>
                </li>
              @endfor
            </ul>

            <!-- Erreur -->
            <div id="cpError" class="mt-3 hidden text-sm text-rose-300">
              {{ __('common.error') }}
            </div>
          </div>

          <!-- Community Picks: modal -->
          <div id="cpModalOverlay" class="fixed inset-0 z-50 hidden bg-black/60 p-4 backdrop-blur-sm">
            <div id="cpModalBox" class="mx-auto w-full max-w-2xl opacity-0 scale-95 transition duration-200 ease-out">
              <div class="w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90 shadow-2xl ring-1 ring-white/10">
                <header class="sticky top-0 flex items-center justify-between border-b border-white/10 bg-gradient-to-b from-zinc-950/95 to-zinc-950/80 px-4 py-3 backdrop-blur">
                  <h2 class="text-base font-bold tracking-tight">{{ __('newsfeed.sidebar.community_picks') }}</h2>
                  <button id="closeCpModal" type="button" class="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-xs hover:bg-white/20">Esc</button>
                </header>

                <div class="p-3">
                  <ul id="cpModalList" class="space-y-2"></ul>

                  <ul id="cpModalSkeleton" class="space-y-2" aria-hidden="true">
                    @for ($i=0; $i<25; $i++)
                      <li class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2 animate-pulse">
                        <div class="flex items-center gap-2">
                          <div class="h-9 w-14 rounded-md border border-white/10 bg-white/10"></div>
                          <div class="h-4 w-36 rounded bg-white/10"></div>
                        </div>
                        <div class="h-4 w-20 rounded bg-white/10"></div>
                      </li>
                    @endfor
                  </ul>

                  <div id="cpModalError" class="hidden text-sm text-rose-300 mt-2">{{ __('common.error') }}</div>
                </div>
              </div>
            </div>
          </div>

            <!-- Changelogs -->
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">{{ __('newsfeed.sidebar.changelogs') }}</h3>
                <a
                  href="#"
                  id="openChangelogsModal"
                  class="text-brand-300 hover:text-brand-200 text-sm"
                >
                  {{ __('newsfeed.sidebar.see_all') }}
                </a>
              </div>

              {{-- Hydraté par JS --}}
              <div id="nf-changelogs" class="mt-3 space-y-3 text-sm text-zinc-300"></div>
            </div>

            <!-- Submit your map -->
            <div
              class="from-brand-700/20 rounded-2xl border border-white/10 bg-gradient-to-br to-white/5 p-4"
            >
              <h3 class="font-semibold">{{ __('newsfeed.sidebar.submit_title') }}</h3>
              <p class="mt-1 text-sm text-zinc-300">{{ __('newsfeed.sidebar.submit_desc') }}</p>
              <a
                href="{{ url('/submit?section=submit_map') }}"
                class="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
              >
                {{ __('newsfeed.sidebar.submit_cta') }}
                <svg class="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M14 3l7 7-7 7v-4H3v-6h11V3z" />
                </svg>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- Overlay -->
    <div
      id="detailsModalOverlay"
      class="fixed inset-0 z-50 hidden bg-black/60 p-4 backdrop-blur-sm"
    >
      <div id="detailsModalBox" class="mx-auto w-full max-w-4xl">
        <div id="modalDetailsContainer"></div>
      </div>
    </div>
  </div>

  <div
    id="changelogsModalOverlay"
    class="fixed inset-0 z-50 hidden bg-black/60 p-4 backdrop-blur-sm"
  >
    <div id="changelogsModalBox" class="mx-auto w-full max-w-3xl">
      <div id="changelogsModalContainer"></div>
    </div>
  </div>

  <!-- ========== PANEL: COMPLETIONS ========== -->
  <div id="panel-completions" class="mt-6 hidden">
    <section class="relative">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 min-h-[100vh]">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-semibold">{{ __('newsfeed.tabs.completions') }}</h2>
          </div>

          <!-- Completions -->
          <div id="completionsContainer" class="grid grid-cols-1 gap-4 sm:grid-cols-2"></div>

          <div
            id="comp-empty"
            class="mt-6 hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-center"
          >
            <div
              class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10"
            >
              <svg class="h-6 w-6 text-zinc-300" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19 3H5a2 2 0 0 0-2 2v14l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">{{ __('newsfeed.empty.title') }}</h3>
            <p class="mt-1 text-sm text-zinc-400">{{ __('newsfeed.empty.subtitle') }}</p>
          </div>

          <!-- Load more -->
          <div class="mt-4 flex items-center justify-center">
            <button
              id="comp-loadmore"
              class="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/5"
            >
              {{ __('newsfeed.load_more') }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
@endsection

@push('scripts')
  <script nonce="{{ $nonce }}">
    document.documentElement.lang = @json(app()->getLocale());
    window.NEWSFEED_I18N = @json(\Illuminate\Support\Facades\Lang::get('newsfeed'));
  </script>

  @vite('resources/js/pages/newsfeed.js', null, ['nonce' => csp_nonce()])
@endpush
