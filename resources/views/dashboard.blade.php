@extends('layouts.app')

@section('title', __('dashboard.meta.title'))
@section('og:title', __('dashboard.meta.og.title'))
@section('og:description', __('dashboard.meta.og.description'))

@push('head')
  @php($nonce = csp_nonce())
@endpush

@section('content')
<section class="relative py-12 sm:py-16 lg:py-20">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    
    <!-- Header -->
    <div class="mb-10 sm:mb-14">
      <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
        {{ __('dashboard.header.title') }}
      </h1>

      <p class="mt-2 max-w-2xl text-zinc-300">
        {{ __('dashboard.header.subtitle') }}
      </p>
    </div>

    <!-- GRID WRAPPER -->
    <div class="grid gap-6 lg:grid-cols-12">

      <!-- LEFT COLUMN -->
      <div class="lg:col-span-8 space-y-6">

        <!-- USER SUMMARY CARD -->
        <section
          id="userSummaryCard"
          class="rounded-2xl border border-white/10 bg-white/5 p-6 relative"
          data-endpoint="/api/user/summary"
        >
          <h2 class="text-xl font-semibold mb-4">{{ __('dashboard.cards.profile.title') }}</h2>

          <div id="userSummaryContent" class="flex flex-col sm:flex-row items-start gap-6">
            <!-- Avatar -->
            <div>
              <div class="h-20 w-20 rounded-full bg-white/10 animate-pulse" id="userAvatarSkeleton"></div>
              <img id="userAvatar" class="hidden h-20 w-20 rounded-full object-cover" />
            </div>

            <!-- Stats -->
            <div class="flex-1 space-y-2">
              <p class="text-zinc-300">
                <span class="font-semibold">{{ __('dashboard.cards.profile.username') }}:</span>
                <span id="profileUsername" class="text-white"></span>
              </p>
              <p class="text-zinc-300">
                <span class="font-semibold">{{ __('dashboard.cards.profile.rank') }}:</span>
                <span id="profileRank" class="text-brand-300"></span>
              </p>
              <p class="text-zinc-300">
                <span class="font-semibold">{{ __('dashboard.cards.profile.xp') }}:</span>
                <span id="profileXP" class="text-emerald-300"></span>
              </p>
            </div>
          </div>

          <p id="userSummaryError" class="hidden mt-3 text-xs text-red-300">
            {{ __('common.error_loading') }}
          </p>
        </section>

        <!-- RECENT COMPLETIONS -->
        <section
          id="recentCompletionsCard"
          class="rounded-2xl border border-white/10 bg-white/5 p-6"
          data-endpoint="/api/user/completions?limit=5"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">{{ __('dashboard.cards.completions.title') }}</h2>
            <a href="{{ url('leaderboard?player_name=' . session('nickname')) }}"
               class="text-sm text-brand-300 hover:text-brand-200">
              {{ __('dashboard.cards.completions.view_all') }}
            </a>
          </div>

          <ul id="recentCompletionsList" class="space-y-3"></ul>

          <ul id="recentCompletionsSkeleton" class="space-y-3">
            @for ($i = 0; $i < 5; $i++)
              <li class="h-14 rounded-xl border border-white/10 bg-white/5 animate-pulse"></li>
            @endfor
          </ul>

          <p id="recentCompletionsError" class="hidden mt-3 text-xs text-red-300">
            {{ __('common.error_loading') }}
          </p>
        </section>

        <!-- PERSONAL BESTS -->
        <section
          id="personalRecordsCard"
          class="rounded-2xl border border-white/10 bg-white/5 p-6"
          data-endpoint="/api/user/records?limit=5"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">{{ __('dashboard.cards.records.title') }}</h2>
            <a href="{{ url('statistics?player=' . session('user_id')) }}"
               class="text-sm text-brand-300 hover:text-brand-200">
              {{ __('dashboard.cards.records.view_all') }}
            </a>
          </div>

          <ul id="personalRecordsList" class="space-y-3"></ul>

          <ul id="personalRecordsSkeleton" class="space-y-3">
            @for ($i = 0; $i < 5; $i++)
              <li class="h-14 rounded-xl border border-white/10 bg-white/5 animate-pulse"></li>
            @endfor
          </ul>

          <p id="personalRecordsError" class="hidden mt-3 text-xs text-red-300">
            {{ __('common.error_loading') }}
          </p>
        </section>

      </div>

      <!-- RIGHT COLUMN -->
      <aside class="lg:col-span-4 space-y-6">

        <!-- LOOTBOXES -->
        <section
          id="lootboxCard"
          class="rounded-2xl border border-white/10 bg-white/5 p-6"
          data-endpoint="/api/user/lootboxes"
        >
          <h2 class="text-xl font-semibold mb-4">{{ __('dashboard.cards.lootboxes.title') }}</h2>

          <div id="lootboxCardContent" class="space-y-3"></div>

          <div id="lootboxCardSkeleton" class="space-y-3">
            @for ($i = 0; $i < 2; $i++)
              <div class="h-12 rounded-xl bg-white/10 animate-pulse"></div>
            @endfor
          </div>

          <a href="{{ url('lootbox') }}"
             class="mt-4 block rounded-xl bg-white text-zinc-900 px-4 py-2 text-center text-sm font-semibold hover:bg-zinc-100">
            {{ __('dashboard.cards.lootboxes.open') }}
          </a>

          <p id="lootboxCardError" class="hidden mt-3 text-xs text-red-300">
            {{ __('common.error_loading') }}
          </p>
        </section>

        <!-- SHORTCUTS -->
        <section class="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 class="text-xl font-semibold mb-4">{{ __('dashboard.cards.shortcuts.title') }}</h2>

          <div class="grid gap-3">
            <a href="{{ url('submit?section=submit_map') }}"
               class="rounded-lg border border-white/10 px-3 py-2 hover:bg-white/5 text-sm">
               {{ __('dashboard.cards.shortcuts.submit_map') }}
            </a>
            <a href="{{ url('submit?section=submit_completion') }}"
               class="rounded-lg border border-white/10 px-3 py-2 hover:bg-white/5 text-sm">
               {{ __('dashboard.cards.shortcuts.submit_completion') }}
            </a>
            <a href="{{ url('search') }}"
               class="rounded-lg border border-white/10 px-3 py-2 hover:bg-white/5 text-sm">
               {{ __('dashboard.cards.shortcuts.search_maps') }}
            </a>
            <a href="{{ url('statistics') }}"
               class="rounded-lg border border-white/10 px-3 py-2 hover:bg-white/5 text-sm">
               {{ __('dashboard.cards.shortcuts.my_stats') }}
            </a>
          </div>
        </section>

      </aside>
    </div>
  </div>
</section>
@endsection

@push('scripts')
<script nonce="{{ $nonce }}">
  window.DASHBOARD_I18N = @json(\Illuminate\Support\Facades\Lang::get('dashboard'));
</script>
@vite('resources/js/pages/dashboard.js')
@endpush
