@extends('layouts.app')

@section('title', 'Genji Parkour - ' . __('rank_card.page_title'))
@section('og:title', 'Genji Parkour - ' . __('rank_card.page_title'))
@section('og:description', __('rank_card.subtitle'))

@push('head')
  @php($nonce = csp_nonce())
@endpush

@section('content')
  <main class="relative overflow-hidden">
    <div class="mx-auto min-h-[100vh] max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {{-- En-tête : avatar + username + tabs + recherche --}}
      <header class="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl sm:p-5">
        <div class="flex flex-col gap-4">
          {{-- Ligne 1 : avatar + username + tabs --}}
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 overflow-hidden rounded-full ring-1 ring-white/10">
                <img
                  src="{{ $avatar_url ?: asset('assets/img/default-avatar.jpg') }}"
                  alt="User Avatar"
                  class="h-full w-full object-cover"
                />
              </div>
              <h2 class="truncate text-xl font-bold sm:text-2xl">{{ $username }}</h2>
            </div>

            {{-- Tabs --}}
            <div class="flex items-center gap-2">
              <button
                id="btnRankCard"
                class="tab-btn inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm"
              >
                {{ __('rank_card.tab_rankcard') }}
              </button>
              <button
                id="btnBadges"
                class="tab-btn inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
              >
                {{ __('rank_card.tab_badges') }}
              </button>
            </div>
          </div>

          {{-- Ligne 2 : Recherche --}}
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div class="relative flex-1">
              <input
                id="searchUserName"
                type="text"
                placeholder="{{ __('rank_card.search_placeholder') }}"
                class="focus:ring-brand-400/40 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm ring-1 ring-white/10 outline-none ring-inset placeholder:text-zinc-400"
              />
            </div>
            <div class="flex items-center gap-2">
              <button
                id="searchButton"
                class="cursor-pointer rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
              >
                {{ __('rank_card.search_button') }}
              </button>
              <button
                id="resetFilter"
                class="cursor-pointer rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/5"
              >
                {{ __('rank_card.reset_filter_button') }}
              </button>
            </div>
          </div>
        </div>
      </header>

      {{-- Contenu --}}
      <section class="mt-6 space-y-6">
        {{-- Rank Card --}}
        <div
          id="rankCardContent"
          class="rank-card-container tab-content active gp-panel-anim hidden rounded-2xl border border-white/10 bg-white/5 p-3 shadow-xl sm:p-5"
        >
          {{-- Rempli par JS (innerHTML) --}}
        </div>

        {{-- Badges --}}
        <div
          id="badgeMasteryContent"
          class="tab-content hidden w-full rounded-2xl border-0 bg-transparent p-0 shadow-none"
        >
          {{-- Rempli par JS --}}
        </div>
      </section>

      {{-- Viewer badge (overlay) --}}
      <div
        id="badgeViewer"
        class="badge-viewer-overlay fixed inset-0 z-[120] hidden items-center justify-center bg-black/70 p-4"
      >
        <div class="badge-viewer-container relative w-full max-w-lg">
          <img
            id="badgeViewerImage"
            alt="Badge Enlarged"
            class="badge-viewer-rotatable mx-auto max-h-[70vh] rounded-xl p-2 shadow-2xl"
          />
          <button
            class="badge-viewer-close absolute -top-2 -right-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
            onclick="closeBadgeViewer()"
            aria-label="Close"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4Z"
              />
            </svg>
          </button>
        </div>
      </div>

      {{-- Loading bar --}}
      <div
        id="loadingContainer"
        class="loading-bar fixed top-20 left-1/2 z-[110] hidden -translate-x-1/2"
      >
        <div
          class="h-1.5 w-64 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10 ring-inset"
        >
          <div class="h-full w-1/3 animate-[loading_1.1s_ease_infinite] bg-white/70"></div>
        </div>
      </div>

      {{-- Boutons d’action (affichés par JS selon conditions) --}}
      <div
        id="buttonContainer"
        class="mt-6 hidden items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4"
      >
        <button
          class="change-button-settings cursor-pointer rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/5"
          id="changeBadges"
        >
          {{ __('rank_card.change_badges_button') }}
        </button>
        <button
          class="change-button-settings cursor-pointer rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/5"
          id="changeAvatar"
        >
          {{ __('rank_card.change_avatar_button') }}
        </button>
        <button
          class="change-button-settings cursor-pointer rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/5"
          id="changeBackground"
        >
          {{ __('rank_card.change_background_button') }}
        </button>
      </div>

      {{-- hidden current user id (lu par JS) --}}
      <input type="hidden" id="currentUserId" value="{{ $user_id ?? '' }}" />
    </div>
  </main>
@endsection

@push('scripts')
  <script nonce="{{ $nonce }}">
    document.documentElement.lang = @json(app()->getLocale());
    window.IS_GUEST = @json($is_guest ?? empty($user_id));
    window.RANK_CARD_I18N = @json(\Illuminate\Support\Facades\Lang::get('rank_card'));
  </script>
  @vite('resources/js/pages/rank_card.js', null, ['nonce' => csp_nonce()])
@endpush
