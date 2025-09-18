<!-- Footer -->
<footer class="border-t border-white/10 py-10">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <div class="mb-3 font-extrabold tracking-tight">{{ __('footer.brand') }}</div>
        <p class="text-sm text-zinc-400">{{ __('footer.tagline') }}</p>
      </div>

      <nav>
        <div class="mb-3 text-sm font-semibold text-zinc-300">
          {{ __('footer.discover_title') }}
        </div>
        <ul class="space-y-2 text-sm">
          <li>
            <a class="text-zinc-300 hover:text-white" href="{{ url('/leaderboard') }}">
              {{ __('footer.discover.leaderboard') }}
            </a>
          </li>
          <li>
            <a class="text-zinc-300 hover:text-white" href="{{ url('/search') }}">
              {{ __('footer.discover.maps') }}
            </a>
          </li>
          <li>
            <a class="text-zinc-300 hover:text-white" href="{{ url('/tutorials') }}">
              {{ __('footer.discover.guides') }}
            </a>
          </li>
        </ul>
      </nav>

      <nav>
        <div class="mb-3 text-sm font-semibold text-zinc-300">
          {{ __('footer.contribute_title') }}
        </div>
        <ul class="space-y-2 text-sm">
          <li>
            <a class="text-zinc-300 hover:text-white" href="{{ url('/submit') }}">
              {{ __('footer.contribute.submit') }}
            </a>
          </li>
          <li>
            <a class="text-zinc-300 hover:text-white" href="{{ url('/convertor') }}">
              {{ __('footer.contribute.convertor') }}
            </a>
          </li>
          {{-- IMPORTANT : déclenche l’ouverture de la modale Credits --}}
          <li>
            <a href="#" data-open="credits" class="text-zinc-300 hover:text-white">
              {{ __('footer.contribute.credits') }}
            </a>
          </li>
        </ul>
      </nav>

      <div>
        <div class="mb-3 text-sm font-semibold text-zinc-300">{{ __('footer.follow_title') }}</div>
        <div class="flex gap-3">
          <a
            href="#"
            class="rounded-lg border border-white/10 p-2 hover:bg-white/5"
            aria-label="Discord"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19 4a4 4 0 00-4-4H9a4 4 0 00-4 4v16a4 4 0 004 4h6a4 4 0 004-4V4zm-4.7 11.2c-.6.8-1.7 1.3-2.3 1.3s-1.7-.5-2.3-1.3c-1.5.3-2.7 1-2.7 1V6s1.1-.7 2.7-1c.6.8 1.7 1.3 2.3 1.3s1.7-.5 2.3-1.3c1.6.3 2.7 1 2.7 1v10.2s-1.1-.7-2.7-1z"
              />
            </svg>
          </a>
          <a
            href="#"
            class="rounded-lg border border-white/10 p-2 hover:bg-white/5"
            aria-label="GitHub"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.4-4-1.4-.6-1.3-1.5-1.7-1.5-1.7-1.2-.9.1-.9.1-.9 1.3.1 2 .7 2 .7 1.2 2 3.2 1.4 4 .9.1-.9.5-1.4.8-1.7-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.3 11.3 0 016 0C17 6 18 6.3 18 6.3c.6 1.6.3 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.4 5.9.5.4.9 1.1.9 2.3v3.4c0 .3.2.7.8.6A12 12 0 0012 .5z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>

    <div class="mt-8 text-xs text-zinc-500">
      {{ __('footer.copyright_line', ['year' => now()->year, 'brand' => 'Genji.pk']) }}
    </div>
  </div>
</footer>
