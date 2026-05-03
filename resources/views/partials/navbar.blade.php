@php
  use Illuminate\Support\Str;

  $isMod = (bool) session('is_mod', false);

  // Determine provider: prefer stored auth_type, then user_provider, then infer from avatar presence
  $provider = session('user')['auth_type'] ?? session('user_provider') ?? (session('user_avatar') ? 'discord' : null);

  // If user is logged in but provider not set, default to 'email'
  if (session('user_id') && ! $provider) {
    $provider = 'email';
  }

  $avatarUrl = session('user_avatar_url') ?? session('discord_avatar_url');
  if (! $avatarUrl) {
    $avatarHash = session('user_avatar');
    if (session('user_id') && $avatarHash) {
      $avatarUrl = "https://cdn.discordapp.com/avatars/" . session('user_id') . "/" . $avatarHash . "." . (Str::startsWith($avatarHash, 'a_') ? 'gif' : 'png');
    }
  }

  $username =
    session('user')['username']
    ?? session('user_name')
    ?? session('discord_username')
    ?? session('username')
    ?? 'Guest';

  $providerLabel = $provider === 'discord' ? 'Discord' : 'Email';

  $initials = strtoupper(substr($username, 0, 2));
  // Badge mark: 'D' for Discord, 'E' for Email, fallback to initials
  if ($provider === 'discord') {
    $providerMark = 'D';
  } elseif ($provider === 'email') {
    $providerMark = 'E';
  } else {
    $providerMark = $initials;
  }

  $avatarBgColor = 'bg-emerald-500';
  if ($provider === 'email') {
    $hash = crc32($username);
    $colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500', 'bg-orange-500', 'bg-cyan-500', 'bg-violet-500'];
    $avatarBgColor = $colors[$hash % count($colors)];
  }

  $theme = strtolower(request()->cookie('theme') ?? 'dark');
  $isDark = $theme !== 'light';
  $logoStatic = $isDark ? 'assets/img/favicon-high.png' : 'assets/img/favicon-high-black.png';
@endphp

<header
  class="sticky top-0 z-50 border-b border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:dark:bg-zinc-900/70"
>
  <div class="w-full px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center gap-3 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-4">
      <!-- Brand -->
    <div class="flex min-w-0 flex-1 items-center gap-2 md:gap-3 md:flex-none">
      <a
        href="{{ url('game') }}"
        class="inline-block shrink-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 dark:focus-visible:ring-white/60"
        aria-label="Genji Parkour – Accueil"
      >
      <img
        id="brandLogo"
        src="{{ cdn_asset($isDark ? 'assets/img/favicon-high.png' : 'assets/img/favicon-high-black.png') }}"
        data-static-dark="{{ cdn_asset('assets/img/favicon-high.png') }}"
        data-anim-dark="{{ cdn_asset('assets/img/favicon-anim.gif') }}"
        data-static-light="{{ cdn_asset('assets/img/favicon-high-black.png') }}"
        data-anim-light="{{ cdn_asset('assets/img/favicon-anim-black.gif') }}"
        class="h-9 w-9 shrink-0 flex-none rounded-xl object-cover hover:opacity-90"
        width="256"
        height="256"
        alt="Genji Parkour"
      />
      </a>

      <div class="min-w-0 leading-tight">
        <div class="truncate text-sm font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-lg md:text-xl">
          {{ __('navbar.brand_title') }}
        </div>
        <div class="hidden truncate text-[10px] text-zinc-500 dark:text-zinc-400 sm:block sm:text-xs">
          {{ __('navbar.brand_tagline') }}
        </div>
      </div>
    </div>

      <!-- Primary nav (desktop) -->
      <nav class="hidden items-center gap-1 justify-self-center md:flex">
        <a
          href="{{ url('/') }}"
          class="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
        >
          {{ __('navbar.home') }}
        </a>

        <!-- Search -->
        <div class="relative">
          <button
            id="searchBtn"
            class="nav-dd-trigger inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
            aria-expanded="false"
            aria-controls="searchMenu"
          >
            {{ __('navbar.search') }}
            <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <ul
            id="searchMenu"
            class="nav-dd-menu absolute left-0 z-50 mt-2 min-w-40 rounded-lg bg-white/95 dark:bg-zinc-900/95 py-2 shadow-lg ring-1 ring-zinc-300/60 dark:ring-white/10 backdrop-blur"
          >
            <li>
              <a
                class="block px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10"
                href="{{ url('/search?section=map_search') }}"
              >
                {{ __('navbar.maps') }}
              </a>
            </li>
            <li>
              <a
                class="block px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10"
                href="{{ url('/search?section=guide') }}"
              >
                {{ __('navbar.guides') }}
              </a>
            </li>
            <li>
              <a
                class="block px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10"
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
            class="nav-dd-trigger inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
            aria-expanded="false"
            aria-controls="communityMenu"
          >
            {{ __('navbar.community') }}
            <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <ul
            id="communityMenu"
            class="nav-dd-menu absolute left-0 z-50 mt-2 min-w-48 rounded-lg bg-white/95 dark:bg-zinc-900/95 py-2 shadow-lg ring-1 ring-zinc-300/60 dark:ring-white/10 backdrop-blur"
          >
            <li>
              <a
                class="block px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10"
                href="{{ url('/newsfeed') }}"
              >
                {{ __('navbar.newsfeed') }}
              </a>
            </li>
            <li>
              <a
                class="block px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10"
                href="{{ url('/leaderboard') }}"
              >
                {{ __('navbar.leaderboard') }}
              </a>
            </li>
            <li>
              <a
                class="block px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10"
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
            class="nav-dd-trigger inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
            aria-expanded="false"
            aria-controls="submitMenu"
          >
            {{ __('navbar.submit') }}
            <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <ul
            id="submitMenu"
            class="nav-dd-menu absolute left-0 z-50 mt-2 min-w-44 rounded-lg bg-white/95 dark:bg-zinc-900/95 py-2 shadow-lg ring-1 ring-zinc-300/60 dark:ring-white/10 backdrop-blur"
          >
            <li>
              <a class="block px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10"
                href="{{ url('/submit') }}?section=submit_record">
                {{ __('navbar.submit_record') }}
              </a>
            </li>
            <li>
              <a class="block px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10"
                href="{{ url('/submit') }}?section=playtest">
                {{ __('navbar.submit_playtest') }}
              </a>
            </li>
            <li>
              <a class="block px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10"
                href="{{ url('/submit') }}?section=submit_map">
                {{ __('navbar.submit_map') }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Learn -->
        <div class="relative">
          <button
            id="learnBtn"
            class="nav-dd-trigger inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
            aria-expanded="false"
            aria-controls="learnMenu"
          >
            {{ __('navbar.learn') }}
            <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <ul
            id="learnMenu"
            class="nav-dd-menu absolute left-0 z-50 mt-2 min-w-52 rounded-lg bg-white/95 dark:bg-zinc-900/95 py-2 shadow-lg ring-1 ring-zinc-300/60 dark:ring-white/10 backdrop-blur"
          >
            <li>
              <a
                class="block px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10"
                href="{{ url('/infos') }}"
              >
                {{ __('navbar.infos') }}
              </a>
            </li>
            <li>
              <a
                class="block px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10"
                href="{{ url('/tutorials') }}"
              >
                {{ __('navbar.tutorial') }}
              </a>
            </li>
            <li>
              <a
                class="block px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10"
                href="{{ url('/similar-communities') }}"
              >
                {{ __('navbar.similar_communities') }}
              </a>
            </li>
            <li>
              <a
                class="block px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10"
                href="{{ url('/movement-tech') }}"
              >
                {{ __('navbar.movement_tech') }}
              </a>
            </li>
          </ul>
        </div>

      </nav>

      <!-- Right side -->
      <div class="ml-auto flex shrink-0 items-center justify-end gap-1.5 md:ml-0 md:gap-2 md:justify-self-end">
        <!-- Lang -->
        <div class="relative">
          <button
            id="langBtn"
            class="nav-dd-trigger hidden cursor-pointer items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 px-3 py-2 text-sm hover:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/5 sm:inline-flex"
            aria-expanded="false"
            aria-controls="langMenu"
          >
            <i class="flag lang-flag {{ $selectedLangData['flag'] ?? 'flag-us' }}"></i>
            <span class="uppercase">{{ $selectedLangData['name'] ?? 'EN' }}</span>
            <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <ul
            id="langMenu"
            class="nav-dd-menu absolute right-0 z-50 mt-2 max-h-44 w-48 overflow-y-auto rounded-lg bg-white/95 dark:bg-zinc-900/95 py-2 shadow-lg ring-1 ring-zinc-300/60 dark:ring-white/10 backdrop-blur"
          >
            @foreach ($languages as $code => $data)
              @if (empty($data['translated']))
                @continue
              @endif

              <li>
                <a
                  href="{{ route('lang.switch', $code) }}"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10"
                  data-message="{{ $data['modalMessage'] ?? 'This language is not fully translated yet.' }}"
                  data-close-text="{{ $data['closeButtonText'] ?? 'Close' }}"
                >
                  <i class="flag lang-flag {{ $data['flag'] ?? '' }}"></i>
                  {{ $data['name'] ?? strtoupper($code) }}
                </a>
              </li>
            @endforeach
          </ul>
        </div>

        @if ($isMod)
          <a
            href="{{ url('/moderator') }}"
            class="group inline-flex shrink-0 items-center justify-center rounded-xl border border-zinc-200/80 dark:border-white/10 p-2 hover:border-emerald-400/30 hover:bg-emerald-500/10 focus-visible:ring-2 focus-visible:ring-emerald-400/40 focus-visible:outline-none"
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

        <!-- Theme -->
        <button
          id="themeToggle"
          class="cursor-pointer shrink-0 rounded-lg border border-zinc-200/80 p-2 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5"
          aria-label="Toggle theme"
          aria-pressed="false"
        >
          <span class="relative block h-5 w-5">
            <svg id="iconSun" class="theme-icon-sun pointer-events-none absolute inset-0 h-5 w-5 text-yellow-500 opacity-100 transition-opacity duration-150" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4.5a1 1 0 011 1V7a1 1 0 11-2 0V5.5a1 1 0 011-1zM12 16.5a1 1 0 011 1V19a1 1 0 11-2 0v-1.5a1 1 0 011-1zM4.5 11a1 1 0 011-1H7a1 1 0 110 2H5.5a1 1 0 01-1-1zM16.5 11a1 1 0 011-1H19a1 1 0 110 2h-1.5a1 1 0 01-1-1zM7.05 7.05a1 1 0 011.4 0l1.06 1.06a1 1 0 01-1.42 1.42L7.05 8.47a1 1 0 010-1.42zM14.49 14.49a1 1 0 011.42 0l1.06 1.06a1 1 0 01-1.42 1.42l-1.06-1.06a1 1 0 010-1.42zM16.95 7.05a1 1 0 010 1.42l-1.06 1.06a1 1 0 11-1.42-1.42L15.53 7.05a1 1 0 011.42 0zM9.51 14.49a1 1 0 010 1.42L8.45 17a1 1 0 11-1.42-1.42l1.06-1.06a1 1 0 011.42 0zM12 8.5A3.5 3.5 0 1112 15.5 3.5 3.5 0 0112 8.5z"/>
            </svg>

            <svg id="iconMoon" class="theme-icon-moon pointer-events-none absolute inset-0 h-5 w-5 text-zinc-700 dark:text-zinc-300 opacity-0 transition-opacity duration-150" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>
            </svg>
          </span>
        </button>

        <!-- Auth -->

        @if (session('user_id'))
          <div class="relative">
            <button
              id="avatarBtn"
              class="nav-dd-trigger inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-zinc-200/80 p-1.5 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5"
              aria-expanded="false"
              aria-controls="avatarMenu"
            >
              <div class="relative shrink-0">
                @if ($avatarUrl && $provider === 'discord')
                  <img
                    src="{{ $avatarUrl }}"
                    alt="User Avatar"
                    class="h-8 w-8 min-h-8 min-w-8 shrink-0 rounded-full object-cover"
                  />
                @else
                  <div class="flex h-8 w-8 min-h-8 min-w-8 shrink-0 items-center justify-center rounded-full {{ $avatarBgColor }} text-xs font-bold text-zinc-900 dark:text-white">
                    {{ $initials }}
                  </div>
                @endif

                <span class="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-950/80 text-[10px] font-extrabold text-zinc-800/90 dark:text-white/85 backdrop-blur">
                  {{ $providerMark }}
                </span>
              </div>

              <svg class="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>

            <ul
              id="avatarMenu"
              class="nav-dd-menu absolute right-0 z-50 mt-2 w-48 rounded-lg bg-white/95 dark:bg-zinc-900/95 py-2 shadow-lg ring-1 ring-zinc-300/60 dark:ring-white/10 backdrop-blur"
            >
              <li class="px-4 pb-2">
                <div class="text-xs font-extrabold text-zinc-800 dark:text-white/90">
                  {{ $username }}
                </div>
                <div class="mt-1 inline-flex items-center rounded-lg border border-zinc-200/80 dark:border-white/10 bg-black/30 px-2 py-1 text-[11px] font-semibold text-zinc-700 dark:text-white/80">
                  Connected via {{ $providerLabel }}
                </div>
              </li>

              <li><div class="my-2 h-px bg-zinc-100/70 dark:bg-white/10"></div></li>
              <li>
                <a class="block px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10" href="{{ url('/dashboard') }}">
                  {{ __('navbar.dashboard') }}
                </a>
              </li>
              <li>
                <a class="block px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10" href="{{ url('/lootbox') }}">
                  {{ __('navbar.lootbox') }}
                </a>
              </li>
              <li>
                <a class="block cursor-pointer px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10" id="user-profile">
                  {{ __('navbar.profile') }}
                </a>
              </li>
              <li>
                <a class="block px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10" href="{{ url('/rank_card') }}">
                  {{ __('navbar.rank_card') }}
                </a>
              </li>
              <li>
                <a class="block cursor-pointer px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10" id="user-settings">
                  {{ __('navbar.settings') }}
                </a>
              </li>
            </ul>
          </div>
          @include('partials.notifications-tray')
        @else
          <button
            type="button"
            data-open-login
            class="inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl border border-zinc-200/80 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 shadow-sm transition hover:border-white/20 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400/60 focus-visible:outline-none dark:border-white/10 dark:focus-visible:ring-white/60 sm:px-4 sm:text-sm"
            aria-haspopup="dialog"
            aria-controls="loginModal"
          >
            {{ __('navbar.login') }}
            <svg class="h-4 w-4 shrink-0" viewBox="0 0 256 199" aria-hidden="true">
              <path fill="currentColor" fill-rule="nonzero"
                d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" />
            </svg>
          </button>
        @endif

        <!-- Mobile menu -->
        <button
          id="menuBtn"
          class="inline-flex shrink-0 items-center justify-center rounded-xl border border-zinc-200/80 p-2 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 md:hidden"
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
          class="rounded-lg px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
        >
          {{ __('navbar.home') }}
        </a>
        <a
          href="{{ url('/leaderboard') }}"
          class="rounded-lg px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
        >
          {{ __('navbar.leaderboard') }}
        </a>

        <details class="px-3 py-2">
          <summary
            class="flex cursor-pointer list-none items-center justify-between rounded-lg text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
          >
            <span>{{ __('navbar.search') }}</span>
            <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20">
              <path fill="currentColor" d="M5 8l5 5 5-5H5z" />
            </svg>
          </summary>
          <div class="mt-1 ml-2 grid">
            <a
              href="{{ url('/search') }}?section=map_search"
              class="rounded-lg px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
            >
              {{ __('navbar.maps') }}
            </a>
            <a
              href="{{ url('/search') }}?section=guide"
              class="rounded-lg px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
            >
              {{ __('navbar.guides') }}
            </a>
            <a
              href="{{ url('/search') }}?section=completions"
              class="rounded-lg px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
            >
              {{ __('navbar.completions') }}
            </a>
          </div>
        </details>

        <details class="px-3 py-2">
          <summary
            class="flex cursor-pointer list-none items-center justify-between rounded-lg text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
          >
            <span>{{ __('navbar.community') }}</span>
            <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20">
              <path fill="currentColor" d="M5 8l5 5 5-5H5z" />
            </svg>
          </summary>
          <div class="mt-1 ml-2 grid">
            <a
              href="{{ url('/newsfeed') }}"
              class="rounded-lg px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
            >
              {{ __('navbar.newsfeed') }}
            </a>
            <a
              href="{{ url('/leaderboard') }}"
              class="rounded-lg px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
            >
              {{ __('navbar.leaderboard') }}
            </a>
            <a
              href="{{ url('/statistics') }}"
              class="rounded-lg px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
            >
              {{ __('navbar.statistics') }}
            </a>
          </div>
        </details>

        <details class="px-3 py-2">
          <summary
            class="flex cursor-pointer list-none items-center justify-between rounded-lg text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
          >
            <span>{{ __('navbar.submit') }}</span>
            <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20">
              <path fill="currentColor" d="M5 8l5 5 5-5H5z" />
            </svg>
          </summary>
          <div class="mt-1 ml-2 grid">
            <a href="{{ url('/submit') }}?section=submit_record"
              class="rounded-lg px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white">
              {{ __('navbar.submit_record') }}
            </a>
            <a href="{{ url('/submit') }}?section=playtest"
              class="rounded-lg px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white">
              {{ __('navbar.submit_playtest') }}
            </a>
            <a href="{{ url('/submit') }}?section=submit_map"
              class="rounded-lg px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white">
              {{ __('navbar.submit_map') }}
            </a>
          </div>
        </details>

        <details class="px-3 py-2">
          <summary
            class="flex cursor-pointer list-none items-center justify-between rounded-lg text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
          >
            <span>{{ __('navbar.learn') }}</span>
            <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20">
              <path fill="currentColor" d="M5 8l5 5 5-5H5z" />
            </svg>
          </summary>
          <div class="mt-1 ml-2 grid">
            <a
              href="{{ url('/infos') }}"
              class="rounded-lg px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
            >
              {{ __('navbar.infos') }}
            </a>
            <a
              href="{{ url('/tutorials') }}"
              class="rounded-lg px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
            >
              {{ __('navbar.tutorial') }}
            </a>
            <a
              href="{{ url('/similar-communities') }}"
              class="rounded-lg px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
            >
              {{ __('navbar.similar_communities') }}
            </a>
            <a
              href="{{ url('/movement-tech') }}"
              class="rounded-lg px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
            >
              {{ __('navbar.movement_tech') }}
            </a>
          </div>
        </details>

      </nav>
    </div>
  </div>
</header>
