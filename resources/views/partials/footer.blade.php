<!-- Footer (compact) -->
<footer class="border-t py-10 border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:dark:bg-zinc-900/70">
  <div class="w-full px-4 sm:px-6 lg:px-8">
    <div class="grid items-start gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <div>
        <div class="mb-2 text-sm font-extrabold tracking-tight">{{ __('footer.brand') }}</div>
        <p class="text-xs leading-5 text-zinc-500 dark:text-zinc-400">{{ __('footer.tagline') }}</p>
      </div>

      <nav>
        <div class="mb-3 pb-1 border-b border-zinc-200/80 dark:border-white/10 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          {{ __('footer.discover_title') }}
        </div>
        <ul class="space-y-1 text-xs leading-5">
          <li><a class="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white" href="{{ url('/leaderboard') }}">{{ __('footer.discover.leaderboard') }}</a></li>
          <li><a class="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white" href="{{ url('/search') }}">{{ __('footer.discover.maps') }}</a></li>
          <li><a class="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white" href="{{ url('/tutorials') }}">{{ __('footer.discover.guides') }}</a></li>
        </ul>
      </nav>

      <nav>
        <div class="mb-3 pb-1 border-b border-zinc-200/80 dark:border-white/10 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          {{ __('footer.contribute_title') }}
        </div>
        <ul class="space-y-1 text-xs leading-5">
          <li><a class="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white" href="{{ url('/submit') }}">{{ __('footer.contribute.submit') }}</a></li>
          <li><a class="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white" href="{{ url('/converter') }}">{{ __('footer.contribute.converter') }}</a></li>
          <li><a href="#" data-open="credits" class="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white">{{ __('footer.contribute.credits') }}</a></li>
          <li><a href="#" data-open="rules" class="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white">{{ __('footer.community.rules') }}</a></li>
        </ul>
      </nav>

      <div>
        <div class="mb-3 pb-1 border-b border-zinc-200/80 dark:border-white/10 text-xs font-semibold text-zinc-600 dark:text-zinc-300">{{ __('footer.follow_title') }}</div>
        <div class="flex gap-2">
          <a
            href="https://dsc.gg/genjiparkour"
            target="_blank" rel="noopener noreferrer"
            class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200/80 dark:border-white/10 p-1.5 hover:bg-zinc-100 dark:hover:bg-white/5"
            aria-label="Discord" title="Discord"
          >
            <svg class="block h-4 w-4 overflow-visible text-zinc-900 dark:text-white" viewBox="0 0 256 199" aria-hidden="true">
              <path fill="currentColor" fill-rule="nonzero"
                d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" />
            </svg>
          </a>

          <a
            href="https://github.com/bkan0n/genji.pk"
            target="_blank" rel="noopener noreferrer"
            class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200/80 dark:border-white/10 p-1.5 hover:bg-zinc-100 dark:hover:bg-white/5"
            aria-label="GitHub" title="GitHub"
          >
            <svg class="block h-4 w-4 overflow-visible" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor"
                d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.4-4-1.4-.6-1.3-1.5-1.7-1.5-1.7-1.2-.9.1-.9.1-.9 1.3.1 2 .7 2 .7 1.2 2 3.2 1.4 4 .9.1-.9.5-1.4.8-1.7-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.3 11.3 0 016 0C17 6 18 6.3 18 6.3c.6 1.6.3 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.4 5.9.5.4.9 1.1.9 2.3v3.4c0 .3.2.7.8.6A12 12 0 0012 .5z" />
            </svg>
          </a>
        </div>
      </div>
    </div>

    <div class="mt-6 rounded-xl border border-zinc-200/80 dark:border-white/10
                bg-gradient-to-b from-white to-zinc-50
                dark:from-zinc-900/70 dark:to-zinc-900/40
                p-4 shadow-sm dark:shadow-none">
      <div class="flex items-center justify-between gap-4">
        <div class="text-xs text-zinc-700 dark:text-zinc-300">
          <div class="font-semibold text-zinc-900 dark:text-zinc-100">{{ __('footer.support_title') }}</div>
          <div class="mt-0.5 text-zinc-600 dark:text-zinc-400/90">{{ __('footer.support.text') }}</div>
        </div>

        <a
          href="https://opencollective.com/genji-parkour"
          target="_blank" rel="noopener noreferrer"
          class="group inline-flex items-center gap-2 rounded-lg
                border border-emerald-500/30 bg-emerald-500/10
                px-3 py-1.5 text-xs font-semibold
                text-emerald-800 hover:bg-emerald-500/15
                dark:text-white"
        >
          <svg class="gp-heart h-4 w-4 text-red-500" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12.1 21.35l-1.1-.98C5.14 15.24 2 12.39 2 8.9 2 6.11 4.11 4 6.9 4c1.64 0 3.21.76 4.2 1.96C12.09 4.76 13.66 4 15.3 4 18.09 4 20.2 6.11 20.2 8.9c0 3.49-3.14 6.34-8.01 11.47l-0.09.08z"/>
          </svg>
          <span>{{ __('footer.support.donate') }}</span>
        </a>
      </div>
    </div>

    <div class="mt-4 text-[11px] leading-5 text-zinc-500">
      {{ __('footer.copyright_line', ['year' => now()->year, 'brand' => 'Genji.pk']) }}
    </div>
  </div>
</footer>
