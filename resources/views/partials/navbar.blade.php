@php($canModerate = session('can_moderate') === true)
<header
  class="sticky top-0 z-50 border-b border-white/10 bg-zinc-900/90 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/70"
>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4">
      <!-- Brand -->
      <a href="{{ url('game') }}" class="group flex min-w-0 items-center gap-2 md:gap-3">
        <img
          id="brandLogo"
          src="{{ asset('assets/img/favicon-high.png') }}"
          alt="Genji Parkour Logo"
          class="h-9 w-9 flex-none rounded-xl object-cover transition"
        />
        <div class="min-w-0 leading-tight">
          <div
            class="truncate text-base font-extrabold tracking-tight text-white sm:text-lg md:text-xl"
          >
            {{ __('navbar.brand_title') }}
          </div>
          <div class="hidden truncate text-[10px] text-zinc-400 sm:block sm:text-xs">
            {{ __('navbar.brand_tagline') }}
          </div>
        </div>
      </a>

      <!-- Primary nav (desktop) -->
      <nav class="hidden items-center gap-1 justify-self-center md:flex">
        <a
          href="{{ url('/') }}"
          class="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
        >
          {{ __('navbar.home') }}
        </a>
        <a
          href="{{ url('/leaderboard') }}"
          class="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
        >
          {{ __('navbar.leaderboard') }}
        </a>

        <!-- Search -->
        <div class="relative">
          <button
            id="searchBtn"
            class="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
            aria-expanded="false"
            aria-controls="searchMenu"
          >
            {{ __('navbar.search') }}
            <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20">
              <path fill="currentColor" d="M5 8l5 5 5-5H5z" />
            </svg>
          </button>
          <ul
            id="searchMenu"
            class="invisible absolute left-0 z-50 mt-2 min-w-40 translate-y-1 rounded-lg bg-zinc-900/95 py-2 opacity-0 shadow-lg ring-1 ring-white/10 backdrop-blur transition"
          >
            <li>
              <a
                class="block px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
                href="{{ url('/search?section=map_search') }}"
              >
                {{ __('navbar.maps') }}
              </a>
            </li>
            <li>
              <a
                class="block px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
                href="{{ url('/search?section=guide') }}"
              >
                {{ __('navbar.guides') }}
              </a>
            </li>
            <li>
              <a
                class="block px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
                href="{{ url('/search?section=completions') }}"
              >
                {{ __('navbar.completions') }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Community -->
        <div class="relative">
          <button
            id="communityBtn"
            class="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
            aria-expanded="false"
            aria-controls="communityMenu"
          >
            {{ __('navbar.community') }}
            <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20">
              <path fill="currentColor" d="M5 8l5 5 5-5H5z" />
            </svg>
          </button>
          <ul
            id="communityMenu"
            class="invisible absolute left-0 z-50 mt-2 min-w-48 translate-y-1 rounded-lg bg-zinc-900/95 py-2 opacity-0 shadow-lg ring-1 ring-white/10 backdrop-blur transition"
          >
            <li>
              <a
                class="block px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
                href="{{ url('/newsfeed') }}"
              >
                {{ __('navbar.newsfeed') }}
              </a>
            </li>
            <li>
              <a
                class="block px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
                href="{{ url('/newsfeed') }}?type=announcements"
              >
                {{ __('navbar.announcements') }}
              </a>
            </li>
            <li>
              <a
                class="block px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
                href="{{ url('/tutorials') }}"
              >
                {{ __('navbar.tutorial') }}
              </a>
            </li>
            <li>
              <a
                class="block px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
                href="{{ url('/statistics') }}"
              >
                {{ __('navbar.statistics') }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Submit -->
        <div class="relative">
          <button
            id="submitBtn"
            class="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
            aria-expanded="false"
            aria-controls="submitMenu"
          >
            {{ __('navbar.submit') }}
            <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20">
              <path fill="currentColor" d="M5 8l5 5 5-5H5z" />
            </svg>
          </button>
          <ul
            id="submitMenu"
            class="invisible absolute left-0 z-50 mt-2 min-w-44 translate-y-1 rounded-lg bg-zinc-900/95 py-2 opacity-0 shadow-lg ring-1 ring-white/10 backdrop-blur transition"
          >
            <li>
              <a class="block px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
                href="{{ url('/submit') }}?section=submit_record">
                {{ __('navbar.submit_record') }}
              </a>
            </li>
            <li>
              <a class="block px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
                href="{{ url('/submit') }}?section=playtest">
                {{ __('navbar.submit_playtest') }}
              </a>
            </li>
            <li>
              <a class="block px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
                href="{{ url('/submit') }}?section=submit_map">
                {{ __('navbar.submit_map') }}
              </a>
            </li>
          </ul>
        </div>

      </nav>

      <!-- Right side -->
      <div class="flex shrink-0 items-center gap-2 justify-self-end">
        <!-- Lang -->
        <div class="relative">
          <button
            id="langBtn"
            class="hidden cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm hover:border-white/20 hover:bg-white/5 sm:inline-flex"
            aria-expanded="false"
            aria-controls="langMenu"
          >
            <i class="flag {{ $selectedLangData['flag'] ?? 'flag-us' }}"></i>
            <span class="uppercase">{{ $selectedLangData['name'] ?? 'EN' }}</span>
            <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20">
              <path fill="currentColor" d="M5 8l5 5 5-5H5z" />
            </svg>
          </button>
          <ul
            id="langMenu"
            class="invisible absolute right-0 z-50 mt-2 max-h-44 w-48 translate-y-1 overflow-y-auto rounded-lg bg-zinc-900/95 py-2 opacity-0 shadow-lg ring-1 ring-white/10 backdrop-blur transition dark:bg-zinc-900/95"
          >
            @foreach ($languages as $code => $data)
              <li>
                <a
                  href="{{ route('lang.switch', $code) }}"
                  class="{{ ! empty($data['translated']) ? '' : 'unavailable' }} flex items-center gap-2 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
                  data-message="{{ $data['modalMessage'] ?? 'This language is not fully translated yet.' }}"
                  data-close-text="{{ $data['closeButtonText'] ?? 'Close' }}"
                >
                  <i class="flag {{ $data['flag'] ?? '' }}"></i>
                  {{ $data['name'] ?? strtoupper($code) }}
                </a>
              </li>
            @endforeach
          </ul>
        </div>

        @if ($canModerate)
          <a
            href="{{ url('/moderator') }}"
            class="group inline-flex items-center justify-center rounded-xl border border-white/10 p-2 hover:border-emerald-400/30 hover:bg-emerald-500/10 focus-visible:ring-2 focus-visible:ring-emerald-400/40 focus-visible:outline-none"
          >
            <svg
              class="h-5 w-5 text-emerald-400 transition group-hover:text-emerald-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span class="sr-only">Moderator</span>
          </a>
        @endif

        <!-- Theme
        <button id="themeToggle" class="cursor-pointer rounded-lg p-2 border border-white/10 hover:bg_WHITE/5" aria-label="Toggle Dark Mode">
          <svg id="iconSun" class="h-5 w-5 hidden text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5a1 1 0 011 1V7a1 1 0 11-2 0V5.5a1 1 0 011-1zM12 16.5a1 1 0 011 1V19a1 1 0 11-2 0v-1.5a1 1 0 011-1zM4.5 11a1 1 0 011-1H7a1 1 0 110 2H5.5a1 1 0 01-1-1zM16.5 11a1 1 0 011-1H19a1 1 0 110 2h-1.5a1 1 0 01-1-1zM7.05 7.05a1 1 0 011.4 0l1.06 1.06a1 1 0 01-1.42 1.42L7.05 8.47a1 1 0 010-1.42zM14.49 14.49a1 1 0 011.42 0l1.06 1.06a1 1 0 01-1.42 1.42l-1.06-1.06a1 1 0 010-1.42zM16.95 7.05a1 1 0 010 1.42l-1.06 1.06a1 1 0 11-1.42-1.42L15.53 7.05a1 1 0 011.42 0zM9.51 14.49a1 1 0 010 1.42L8.45 17a1 1 0 11-1.42-1.42l1.06-1.06a1 1 0 011.42 0zM12 8.5A3.5 3.5 0 1112 15.5 3.5 3.5 0 0112 8.5z"/></svg>
          <svg id="iconMoon" class="h-5 w-5 hidden text-zinc-300" fill="currentColor" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/></svg>
        </button>
        -->

        <!-- Auth -->

        @if (session('user_id') && session('user_avatar'))
          <div class="relative">
            <button
              id="avatarBtn"
              class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 p-1.5 hover:bg-white/5"
              aria-expanded="false"
              aria-controls="avatarMenu"
            >
              <img
                src="https://cdn.discordapp.com/avatars/{{ session('user_id') }}/{{ session('user_avatar') }}.png"
                alt="User Avatar"
                class="h-8 w-8 rounded-full object-cover"
              />
              <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20">
                <path fill="currentColor" d="M5 8l5 5 5-5H5z" />
              </svg>
            </button>
            <ul
              id="avatarMenu"
              class="invisible absolute right-0 z-50 mt-2 w-48 translate-y-1 rounded-lg bg-zinc-900/95 py-2 opacity-0 shadow-lg ring-1 ring-white/10 backdrop-blur transition"
            >
              <li>
                <a
                  class="block px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
                  href="{{ url('/lootbox') }}"
                >
                  {{ __('navbar.lootbox') }}
                </a>
              </li>
              <li>
                <a
                  class="block cursor-pointer px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
                  id="user-profile"
                >
                  {{ __('navbar.profile') }}
                </a>
              </li>
              <li>
                <a
                  class="block px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
                  href="{{ url('/rank_card') }}"
                >
                  {{ __('navbar.rank_card') }}
                </a>
              </li>
              <li>
                <a
                  class="block cursor-pointer px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
                  id="user-settings"
                >
                  {{ __('navbar.settings') }}
                </a>
              </li>
            </ul>
          </div>
        @else
          <a
            href="{{ route('discord.redirect') }}"
            class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-white/20 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
          >
            {{ __('navbar.login') }}
          </a>
        @endif

        <!-- Mobile menu -->
        <button
          id="menuBtn"
          class="inline-flex items-center justify-center rounded-xl border border-white/10 p-2 hover:bg-white/5 md:hidden"
          aria-controls="mobileMenu"
          aria-expanded="false"
        >
          <svg id="menuIcon" class="h-6 w-6" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z" />
          </svg>
        </button>
      </div>
    </div>

    <div id="mobileMenu" class="hidden pb-4 md:hidden">
      <nav class="grid gap-1">
        <a
          href="{{ url('/') }}"
          class="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
        >
          {{ __('navbar.home') }}
        </a>
        <a
          href="{{ url('/leaderboard') }}"
          class="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
        >
          {{ __('navbar.leaderboard') }}
        </a>

        <details class="px-2">
          <summary
            class="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
          >
            <span>{{ __('navbar.search') }}</span>
            <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20">
              <path fill="currentColor" d="M5 8l5 5 5-5H5z" />
            </svg>
          </summary>
          <div class="mt-1 ml-2 grid">
            <a
              href="{{ url('/maps') }}"
              class="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              {{ __('navbar.maps') }}
            </a>
            <a
              href="{{ url('/guides') }}"
              class="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              {{ __('navbar.guides') }}
            </a>
            <a
              href="{{ url('/completions') }}"
              class="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              {{ __('navbar.completions') }}
            </a>
          </div>
        </details>

        <details class="px-2">
          <summary
            class="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
          >
            <span>{{ __('navbar.community') }}</span>
            <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20">
              <path fill="currentColor" d="M5 8l5 5 5-5H5z" />
            </svg>
          </summary>
          <div class="mt-1 ml-2 grid">
            <a
              href="{{ url('/newsfeed') }}"
              class="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              {{ __('navbar.newsfeed') }}
            </a>
            <a
              href="{{ url('/newsfeed') }}?type=announcements"
              data-follow-href
              class="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              {{ __('navbar.announcements') }}
            </a>
            <a
              href="{{ url('/tutorials') }}"
              class="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              {{ __('navbar.tutorial') }}
            </a>
            <a
              href="{{ url('/statistics') }}"
              class="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              {{ __('navbar.statistics') }}
            </a>
          </div>
        </details>

        <details class="px-2">
          <summary
            class="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
          >
            <span>{{ __('navbar.submit') }}</span>
            <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20">
              <path fill="currentColor" d="M5 8l5 5 5-5H5z" />
            </svg>
          </summary>
          <div class="mt-1 ml-2 grid">
            <a href="{{ url('/submit') }}?section=submit_record"
              class="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white">
              {{ __('navbar.submit_record') }}
            </a>
            <a href="{{ url('/submit') }}?section=playtest"
              class="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white">
              {{ __('navbar.submit_playtest') }}
            </a>
            <a href="{{ url('/submit') }}?section=submit_map"
              class="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white">
              {{ __('navbar.submit_map') }}
            </a>
          </div>
        </details>

      </nav>
    </div>
  </div>
</header>
