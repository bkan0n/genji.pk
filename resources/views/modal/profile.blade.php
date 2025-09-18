{{-- Profile Modal (overlay + carte) --}}
<div id="profileModal" class="fixed inset-0 z-[120] hidden">
  <button
    id="profileBackdrop"
    class="absolute inset-0 bg-black/70"
    aria-label="{{ __('modals.profile.close') }}"
  ></button>

  <div class="relative z-10 flex min-h-full w-full justify-center">
    <div
      id="profileModalContent"
      class="pointer-events-auto mx-auto w-full max-w-6xl min-w-0 flex-1 basis-full px-0 pt-24 lg:max-w-7xl 2xl:max-w-[90rem]"
      data-modal-box
    >
      {{-- ====== Carte Profil ====== --}}
      @php
        use Illuminate\Support\Str;

        $userId = session('user_id');
        $username = session('discord_username') ?? (session('username') ?? 'Guest');

        $avatarHash = session('user_avatar');
        $avatarUrl = session('discord_avatar_url') ?: ($userId && $avatarHash ? "https://cdn.discordapp.com/avatars/{$userId}/{$avatarHash}." . (Str::startsWith($avatarHash, 'a_') ? 'gif' : 'png') : asset('assets/img/default-avatar.jpg'));

        $bannerHash = session('user_banner') ?? session('discord_banner');
        $bannerUrl = $userId && $bannerHash ? "https://cdn.discordapp.com/banners/{$userId}/{$bannerHash}." . (Str::startsWith($bannerHash, 'a_') ? 'gif' : 'png') : null;

        $userFlags = (int) (session('user_flags') ?? (session('discord_public_flags') ?? 0));
        $userPremium = (int) (session('user_premium') ?? (session('discord_premium_type') ?? 0));

        $badgeSrc = [];
        for ($i = 0; $i < 20; $i++) {
          if ($userFlags & (1 << $i)) {
            $badgeSrc[] = asset("assets/discord/badges/{$i}.svg");
          }
        }
        if ($userPremium > 0) {
          $badgeSrc[] = asset('assets/discord/badges/nitro.svg');
        }
        if ($userPremium > 1) {
          $badgeSrc[] = asset('assets/discord/badges/boost.svg');
        }
      @endphp

      <article
        id="profileCard"
        class="pointer-events-auto relative mx-auto w-full max-w-none overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-2xl backdrop-blur"
      >
        <button
          type="button"
          id="profileClose"
          class="absolute top-3 right-3 rounded-md bg-black/30 p-2 ring-1 ring-white/10 hover:bg-black/40"
          aria-label="{{ __('modals.profile.close') }}"
        >
          <svg class="h-4 w-4 text-zinc-300" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div class="relative h-28 sm:h-32">
          @if ($bannerUrl)
            <img
              src="{{ $bannerUrl }}?size=600"
              alt=""
              class="absolute inset-0 h-full w-full object-cover"
            />
            <div class="absolute inset-0 bg-black/30"></div>
          @else
            <div class="absolute inset-0 bg-zinc-800/70"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
          @endif

          <div class="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div class="relative">
              <img
                src="{{ $avatarUrl }}"
                alt="User avatar"
                class="h-20 w-20 rounded-full object-cover shadow-lg ring-4 ring-zinc-900 sm:h-24 sm:w-24"
              />
              <span
                class="pointer-events-none absolute inset-0 animate-pulse rounded-full ring-2 ring-emerald-400/70"
              ></span>
            </div>
          </div>
        </div>

        <div class="px-5 pt-12 pb-5 text-center">
          <h2 class="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
            {{ $username }}
          </h2>

          <p class="mt-1 flex items-center justify-center gap-2 text-xs text-zinc-400">
            <span id="uid">{{ $userId ?? 'Unknown' }}</span>
            <button
              type="button"
              id="copyUid"
              class="inline-flex cursor-pointer items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-[11px] hover:bg-white/5"
            >
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M8 7h9a2 2 0 0 1 2 2v9H8a2 2 0 0 1-2-2V7zM6 5h9V4a2 2 0 0 0-2-2H4v13a2 2 0 0 0 2 2V5z"
                />
              </svg>
              <span>{{ __('modals.profile.copy') }}</span>
            </button>
          </p>

          @if (! empty($badgeSrc))
            <ul class="mt-3 flex flex-wrap items-center justify-center gap-2">
              @foreach ($badgeSrc as $src)
                <li
                  class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/5 ring-1 ring-white/10"
                >
                  <img src="{{ $src }}" alt="Badge" class="h-4 w-4" loading="lazy" />
                </li>
              @endforeach
            </ul>
          @endif

          <div class="mt-5 h-px bg-white/10"></div>

          <div class="mt-4 grid grid-cols-2 gap-2">
            <a
              href="{{ url('/rank_card') }}"
              class="inline-flex items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
            >
              {{ __('modals.profile.dashboard') }}
            </a>
            <a
              href="#"
              id="openSettings"
              class="inline-flex items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
            >
              {{ __('modals.profile.settings') }}
            </a>
          </div>

          <form method="POST" action="{{ route('discord.logout') }}" class="mt-3">
            @csrf
            <button
              type="submit"
              class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-400/40 bg-rose-500/20 px-4 py-2.5 text-sm font-semibold text-rose-100 hover:border-rose-300/60 hover:bg-rose-500/30"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M10 17v-3H3v-4h7V7l5 5-5 5zm9 2H12v-2h7V7h-7V5h7a2 2 0 012 2v10a2 2 0 01-2 2z"
                />
              </svg>
              {{ __('modals.profile.logout') }}
            </button>
          </form>
        </div>
      </article>
    </div>
  </div>
</div>
