@php
  $cnMode = (string) config('services.battlenet.cn_mode', 'global'); // global | cn | disabled
  $showCn = $cnMode !== 'disabled';
  $cnChip = $cnMode === 'cn' ? 'CN' : 'CN (fallback)';
@endphp

<div id="loginModal" class="fixed inset-0 z-[120] hidden flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-hidden="true">
  {{-- Backdrop --}}
  <button
    id="loginBackdrop"
    type="button"
    class="absolute inset-0 bg-black/70 opacity-0 transition-opacity duration-200 ease-out"
    aria-label="Close"
  ></button>

  {{-- Panel --}}
    <div id="loginPanel"
    class="relative w-[min(92vw,60rem)] max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] overflow-hidden
            rounded-3xl border border-white/10 bg-zinc-950/70 shadow-2xl backdrop-blur
            opacity-0 translate-y-3 scale-[0.98] transition-all duration-200 ease-out">
    {{-- subtle glow --}}
    <div class="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-52 right-[-120px] h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-3xl"></div>


    <div class="grid max-h-[88vh] overflow-y-auto lg:grid-cols-2">
      {{-- LEFT --}}
      <aside class="relative overflow-hidden border-b border-white/10 bg-zinc-900/40 px-7 py-10 sm:px-10 lg:border-b-0 lg:border-r">
        <div class="absolute left-6 top-10 hidden flex-col gap-3 lg:flex">
          <div class="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black/30 text-white/80">
            <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm1 15h-2v-6h2Zm0-8h-2V7h2Z"/>
            </svg>
          </div>
          <div class="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black/30 text-white/80">
            <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4Zm0 11h7c-.53 3.06-2.72 5.86-7 6.92V12H5V6.3l7-3.11V12Z"/>
            </svg>
          </div>
          <div class="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black/30 text-white/80">
            <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M7 2h10a2 2 0 0 1 2 2v16l-7-3-7 3V4a2 2 0 0 1 2-2Z"/>
            </svg>
          </div>
        </div>

        <div class="lg:pl-14">
          <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
            <span class="bg-emerald-400 inline-block h-2 w-2 rounded-full"></span>
            Genji Parkour
          </div>

          <h2 class="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Ready to scale your
            <span class="block bg-gradient-to-r from-emerald-200 via-white to-blue-200 bg-clip-text text-transparent">
              parkour career?
            </span>
          </h2>

          <p class="mt-4 max-w-md text-sm leading-relaxed text-zinc-300">
            Log in to sync your profile, access personal records, earn rewards and unlock community features —
            all with one click.
          </p>

          <div class="mt-8 grid gap-3 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div class="text-xs font-extrabold text-white/90">Fast</div>
              <div class="mt-1 text-xs text-zinc-300">One-click OAuth login.</div>
            </div>
            <div class="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div class="text-xs font-extrabold text-white/90">Secure</div>
              <div class="mt-1 text-xs text-zinc-300">No passwords stored.</div>
            </div>
          </div>
        </div>
      </aside>

      {{-- RIGHT --}}
      <main class="px-7 py-10 sm:px-10">
        <div class="mx-auto max-w-md">
          <h3 class="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
            Log in to your account
          </h3>
          <p class="mt-1 text-sm text-zinc-300">
            Continue with your preferred provider.
          </p>

          @if (session('error'))
            <div class="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {{ session('error') }}
            </div>
          @endif

          <div class="mt-6 space-y-3">
            {{-- Discord --}}
            <a
              href="{{ route('auth.discord.redirect') }}"
              class="group inline-flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#5865F2]/90 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5865F2]"
            >
              <span class="inline-flex items-center gap-3">
                <svg class="h-5 w-5 text-white/95" viewBox="0 0 256 199" aria-hidden="true">
                  <path fill="currentColor" fill-rule="nonzero" d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"></path>
                </svg>
                Continue with Discord
              </span>
              <span class="rounded-lg bg-black/25 px-2 py-1 text-[11px] font-extrabold text-white/90 ring-1 ring-white/10">
                Recommended
              </span>
            </a>

            {{-- Battle.net China --}}
            <a
              href="{{ route('auth.battlenet.redirect', ['region' => 'cn']) }}"
              class="group inline-flex w-full items-center justify-between rounded-xl border border-white/10 bg-blue-500/15 px-4 py-3.5 text-sm font-semibold text-white/90 transition hover:bg-blue-500/20"
            >
              <span class="inline-flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" class="h-5 w-5 text-blue-300">
                  <path fill="currentColor" d="M 26.578125 14.339844 C 26.578125 14.339844 28.882813 14.457031 28.882813 13.101563 C 28.882813 11.332031 25.8125 9.738281 25.8125 9.738281 C 25.8125 9.738281 26.292969 8.71875 26.59375 8.148438 C 26.894531 7.578125 27.738281 5.359375 27.8125 4.851563 C 27.90625 4.210938 27.761719 4.011719 27.761719 4.011719 C 27.554688 5.378906 25.328125 9.316406 25.148438 9.449219 C 22.976563 8.433594 19.992188 8.148438 19.992188 8.148438 C 19.992188 8.148438 17.070313 2 14.320313 2 C 11.59375 2 11.609375 7.265625 11.609375 7.265625 C 11.609375 7.265625 10.839844 5.773438 9.871094 5.773438 C 8.457031 5.773438 7.992188 7.90625 7.992188 10.222656 C 5.203125 10.222656 2.855469 10.847656 2.644531 10.90625 C 2.4375 10.964844 1.777344 11.445313 2.074219 11.386719 C 2.6875 11.191406 5.554688 10.746094 8.0625 10.964844 C 8.203125 13.164063 9.488281 16.03125 9.488281 16.03125 C 9.488281 16.03125 6.730469 20.023438 6.730469 22.871094 C 6.730469 23.621094 7.058594 24.992188 9.035156 24.992188 C 10.695313 24.992188 12.558594 23.996094 12.90625 23.796875 C 12.601563 24.230469 12.375 25.0625 12.375 25.445313 C 12.375 25.757813 12.5625 26.644531 13.839844 26.644531 C 15.480469 26.644531 17.316406 25.386719 17.316406 25.386719 C 17.316406 25.386719 19.050781 28.261875 20.53125 29.578125 C 20.929688 29.933594 21.3125 30 21.3125 30 C 21.3125 30 19.839844 28.585938 17.902344 24.9375 C 19.703125 23.828125 21.578125 21.203125 21.578125 21.203125 C 21.578125 21.203125 21.800781 21.210938 23.511719 21.210938 C 26.191406 21.210938 29.996094 20.648438 29.996094 18.519531 C 30 16.324219 26.578125 14.339844 26.578125 14.339844 Z M 26.875 13.015625 C 26.875 13.792969 26.136719 13.785156 26.136719 13.785156 L 25.574219 13.820313 C 25.574219 13.820313 24.507813 13.261719 23.859375 12.996094 C 23.859375 12.996094 24.863281 11.453125 25.097656 11.023438 C 25.273438 11.128906 26.875 12.128906 26.875 13.015625 Z M 15.660156 5.097656 C 16.921875 5.097656 18.71875 8.066406 18.71875 8.066406 C 18.71875 8.066406 15.914063 7.816406 13.605469 9.171875 C 13.667969 7.035156 14.386719 5.097656 15.660156 5.097656 Z M 10.671875 7.503906 C 11.070313 7.503906 11.460938 7.992188 11.625 8.402344 C 11.625 8.675781 11.765625 10.269531 11.765625 10.269531 L 9.453125 10.179688 C 9.453125 8.097656 10.269531 7.503906 10.671875 7.503906 Z M 10.429688 21.976563 C 9.164063 21.976563 8.90625 21.273438 8.90625 20.640625 C 8.90625 19.207031 10.050781 17.199219 10.050781 17.199219 C 10.050781 17.199219 11.335938 19.898438 13.574219 21.035156 C 12.464844 21.6875 11.546875 21.976563 10.429688 21.976563 Z M 14.535156 24.800781 C 13.648438 24.800781 13.539063 24.226563 13.539063 24.09375 C 13.539063 23.683594 13.863281 23.195313 13.863281 23.195313 C 13.863281 23.195313 15.351563 22.191406 15.445313 22.082031 L 16.546875 24.136719 C 16.546875 24.136719 15.421875 24.800781 14.535156 24.800781 Z M 17.300781 23.683594 C 16.761719 22.742188 16.363281 21.757813 16.363281 21.757813 C 16.363281 21.757813 18.578125 21.898438 19.769531 20.671875 C 19.027344 21.003906 17.84375 21.425781 16.46875 21.296875 C 19.34375 18.765625 21.023438 16.929688 22.441406 15.035156 C 22.320313 14.886719 21.671875 14.433594 21.511719 14.359375 C 20.65625 15.390625 17.324219 18.949219 14.238281 20.710938 C 10.332031 18.582031 9.511719 12.320313 9.429688 11.019531 L 11.5625 11.222656 C 11.5625 11.222656 10.761719 12.644531 10.761719 13.691406 C 10.761719 14.734375 10.886719 14.789063 10.886719 14.789063 C 10.886719 14.789063 10.859375 12.96875 11.984375 11.5625 C 12.84375 16.125 13.738281 18.460938 14.433594 19.855469 C 14.789063 19.707031 15.449219 19.414063 15.449219 19.414063 C 15.449219 19.414063 13.480469 13.738281 13.589844 9.898438 C 14.484375 9.421875 15.808594 8.929688 17.300781 8.929688 C 21.230469 8.929688 24.390625 10.617188 24.390625 10.617188 L 23.15625 12.34375 C 23.15625 12.34375 22.054688 10.351563 20.496094 9.996094 C 21.316406 10.605469 22.238281 11.414063 22.714844 12.574219 C 19.457031 11.304688 15.527344 10.632813 14.265625 10.484375 C 14.15625 10.949219 14.171875 11.613281 14.171875 11.613281 C 14.171875 11.613281 19.441406 12.585938 23.277344 14.777344 C 23.25 19.574219 18.023438 23.257813 17.300781 23.683594 Z M 22.292969 20.097656 C 22.292969 20.097656 23.929688 17.953125 23.902344 15.109375 C 23.902344 15.109375 26.546875 16.746094 26.546875 18.34375 C 26.546875 20.125 22.292969 20.097656 22.292969 20.097656 Z"/>
                </svg>
                Continue with Battle.net
              </span>
              <span class="rounded-lg bg-black/25 px-2 py-1 text-[11px] font-extrabold text-white/85 ring-1 ring-white/10">
                Global
              </span>
            </a>
          </div>

          <div class="mt-6 text-center text-xs text-zinc-400">
            By continuing, you agree to our community rules.
          </div>
        </div>
      </main>
    </div>
  </div>
</div>

<script @if(function_exists('csp_nonce')) nonce="{{ csp_nonce() }}" @endif>
(() => {
  const modal = document.getElementById('loginModal');
  if (!modal) return;

  const panel = document.getElementById('loginPanel');
  const backdrop = document.getElementById('loginBackdrop');
  const closeBtn = document.getElementById('loginClose');

  let lastFocus = null;

    function lockScroll(lock) {
    const html = document.documentElement;
    const body = document.body;

    // stocke une seule fois
    if (!lockScroll._saved) {
        lockScroll._saved = {
        htmlOverflow: html.style.overflow,
        bodyOverflow: body.style.overflow,
        bodyPaddingRight: body.style.paddingRight,
        };
    }

    if (lock) {
        // largeur de scrollbar (évite le "shift" quand on bloque le scroll)
        const scrollbarWidth = window.innerWidth - html.clientWidth;

        html.style.overflow = 'hidden';
        body.style.overflow = 'hidden';

        if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
        }
    } else {
        const s = lockScroll._saved;
        html.style.overflow = s.htmlOverflow || '';
        body.style.overflow = s.bodyOverflow || '';
        body.style.paddingRight = s.bodyPaddingRight || '';
    }
    }

  window.openLoginModal = () => {
    if (!modal.classList.contains('hidden')) return;

    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    lockScroll(true);

    requestAnimationFrame(() => {
      backdrop.classList.remove('opacity-0');
      backdrop.classList.add('opacity-100');

      panel.classList.remove('opacity-0', 'translate-y-3', 'scale-[0.98]');
      panel.classList.add('opacity-100', 'translate-y-0', 'scale-100');
    });

    // focus first provider link
    const firstLink = modal.querySelector('a[href]') || closeBtn;
    setTimeout(() => firstLink && firstLink.focus?.(), 50);
  };

  window.closeLoginModal = () => {
    if (modal.classList.contains('hidden')) return;

    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0');

    panel.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
    panel.classList.add('opacity-0', 'translate-y-3', 'scale-[0.98]');

    setTimeout(() => {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      lockScroll(false);
      if (lastFocus) lastFocus.focus?.();
    }, 180);
  };

  // click handlers
  backdrop?.addEventListener('click', window.closeLoginModal);
  closeBtn?.addEventListener('click', window.closeLoginModal);

  // ESC close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      e.preventDefault();
      window.closeLoginModal();
    }
  }, { passive: false });

  // generic open triggers
  document.addEventListener('click', (e) => {
    const btn = e.target?.closest?.('[data-open-login]');
    if (!btn) return;
    e.preventDefault();
    window.openLoginModal();
  });
})();
</script>
