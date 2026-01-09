@php
  $autoOpen = request()->routeIs('login') || request()->is('login') || request()->boolean('openLogin');
  $startEmail = request()->get('tab') === 'email' || request()->boolean('email');
@endphp

<div
  id="loginModal"
  class="fixed inset-0 z-[9999] hidden flex items-center justify-center p-4 sm:p-6"
  role="dialog"
  aria-modal="true"
  aria-hidden="true"
  data-autopen="{{ $autoOpen ? '1' : '0' }}"
  data-start-email="{{ $startEmail ? '1' : '0' }}"
>
  {{-- Backdrop --}}
  <button
    id="loginBackdrop"
    type="button"
    class="absolute inset-0 bg-black/70 opacity-0 transition-opacity duration-200 ease-out"
    aria-label="Close"
  ></button>

  {{-- Panel --}}
  <div
    id="loginPanel"
    class="relative w-[min(92vw,60rem)] max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] overflow-hidden
           rounded-3xl border border-white/10 bg-zinc-950/70 shadow-2xl backdrop-blur
           opacity-0 translate-y-3 scale-[0.98] transition-all duration-200 ease-out"
  >
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
            {{ __('auth.login.subtitle_part_1') }}
            <span class="block from-brand-300 block bg-gradient-to-r via-emerald-200 to-white bg-clip-text pb-1 text-transparent">
              {{ __('auth.login.subtitle_part_2') }}
            </span>
          </h2>

          <p class="mt-4 max-w-md text-sm leading-relaxed text-zinc-300">
            {{ __('auth.login.description') }}
          </p>

          <div class="mt-8 grid gap-3 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div class="text-xs font-extrabold text-white/90">{{ __('auth.login.fast') }}</div>
              <div class="mt-1 text-xs text-zinc-300">{{ __('auth.login.fast_desc') }}</div>
            </div>
            <div class="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div class="text-xs font-extrabold text-white/90">{{ __('auth.login.secure') }}</div>
              <div class="mt-1 text-xs text-zinc-300">{{ __('auth.login.secure_desc') }}</div>
            </div>
          </div>
        </div>
      </aside>

      {{-- RIGHT --}}
      <main class="px-7 py-10 sm:px-10">
        <div class="mx-auto max-w-md">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                {{ __('auth.login.sign_in') }}
              </h3>
              <p class="mt-1 text-sm text-zinc-300">
                {{ __('auth.login.providers_description') }}
              </p>
            </div>

            <button
              id="loginClose"
              type="button"
              class="rounded-xl cursor-pointer border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-white/80 hover:bg-white/10"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          @if (session('login_error'))
            <div class="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {{ session('login_error') }}
            </div>
          @endif

          @if (session('register_error'))
            <div class="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {{ session('register_error') }}
            </div>
          @endif

          @if (session('success'))
            <div class="mt-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              {{ session('success') }}
            </div>
          @endif

          @if (session('error'))
            <div class="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {{ session('error') }}
            </div>
          @endif

          @if (session('warning'))
            <div class="mt-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100">
              {{ session('warning') }}
            </div>
          @endif

          @if ($errors->any())
            <div class="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              <div class="font-extrabold">{{ __('auth.login.please_fix') }}</div>
              <ul class="mt-2 list-disc pl-5">
                @foreach ($errors->all() as $e)
                  <li>{{ $e }}</li>
                @endforeach
              </ul>
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
                {{ __('auth.login.discord_login') }}
              </span>
              <span class="rounded-lg bg-black/25 px-2 py-1 text-[11px] font-extrabold text-white/90 ring-1 ring-white/10">
                {{ __('auth.login.recommended') }}
              </span>
            </a>

            {{-- EMAIL --}}
            <button
              id="emailToggle"
              type="button"
              class="group inline-flex cursor-pointer w-full items-center justify-between rounded-xl border border-white/10 bg-zinc-900/40 px-4 py-3.5 text-sm font-semibold text-white/90 transition hover:bg-zinc-900/55"
              aria-expanded="false"
              aria-controls="emailFormWrap"
            >
              <span class="inline-flex items-center gap-3">
                <span class="grid h-5 w-5 place-items-center rounded-md text-white/90">
                  @
                </span>
                {{ __('auth.login.email_login') }}
              </span>
              <span class="rounded-lg bg-black/25 px-2 py-1 text-[11px] font-extrabold text-white/80 ring-1 ring-white/10">
                {{ __('auth.login.password_badge') }}
              </span>
            </button>

            <div id="emailFormWrap" class="hidden rounded-2xl border border-white/10 bg-black/20 p-4">
              <form method="POST" action="{{ url('/login') }}" class="space-y-3">
                @csrf

                <div>
                  <label class="block text-xs font-extrabold text-zinc-200">{{ __('auth.login.email_label') }}</label>
                  <input
                    name="email"
                    type="email"
                    autocomplete="email"
                    required
                    value="{{ old('email') }}"
                    class="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 text-sm text-white/90 placeholder:text-zinc-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label class="block text-xs font-extrabold text-zinc-200">{{ __('auth.login.password_label') }}</label>
                  <input
                    name="password"
                    type="password"
                    autocomplete="current-password"
                    required
                    class="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 text-sm text-white/90 placeholder:text-zinc-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  class="inline-flex cursor-pointer w-full items-center justify-center rounded-xl bg-emerald-500/90 px-4 py-3 text-sm font-extrabold text-black transition hover:bg-emerald-400"
                >
                  {{ __('auth.login.submit_button') }}
                </button>

                <div class="flex items-center justify-between text-xs">
                  <button type="button" data-open-forgot-password class="text-zinc-300 cursor-pointer hover:text-white">
                    {{ __('auth.login.forgot_password') }}
                  </button>
                  <button type="button" data-open-register class="text-zinc-300 cursor-pointer hover:text-white">
                    {{ __('auth.login.create_account') }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="mt-6 text-center text-xs text-zinc-400">
            {{ __('auth.login.agreement') }}
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

  const emailToggle = document.getElementById('emailToggle');
  const emailWrap = document.getElementById('emailFormWrap');

  let lastFocus = null;

  function lockScroll(lock) {
    const html = document.documentElement;
    const body = document.body;

    if (!lockScroll._saved) {
      lockScroll._saved = {
        htmlOverflow: html.style.overflow,
        bodyOverflow: body.style.overflow,
        bodyPaddingRight: body.style.paddingRight,
      };
    }

    if (lock) {
      const scrollbarWidth = window.innerWidth - html.clientWidth;
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      const s = lockScroll._saved;
      html.style.overflow = s.htmlOverflow || '';
      body.style.overflow = s.bodyOverflow || '';
      body.style.paddingRight = s.bodyPaddingRight || '';
    }
  }

  function openEmailForm() {
    if (!emailWrap || !emailToggle) return;
    emailWrap.classList.remove('hidden');
    emailToggle.setAttribute('aria-expanded', 'true');

    const emailInput = emailWrap.querySelector('input[name="email"]');
    setTimeout(() => emailInput?.focus?.(), 0);
  }

  function toggleEmailForm() {
    if (!emailWrap || !emailToggle) return;

    const isOpen = !emailWrap.classList.contains('hidden');
    if (isOpen) {
      emailWrap.classList.add('hidden');
      emailToggle.setAttribute('aria-expanded', 'false');
      emailToggle.focus?.();
    } else {
      openEmailForm();
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

    const firstLink = modal.querySelector('a[href]') || closeBtn;
    setTimeout(() => firstLink && firstLink.focus?.(), 50);

    if (modal.dataset.startEmail === '1') openEmailForm();
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

  backdrop?.addEventListener('click', window.closeLoginModal);
  closeBtn?.addEventListener('click', window.closeLoginModal);

  emailToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    toggleEmailForm();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      e.preventDefault();
      window.closeLoginModal();
    }
  }, { passive: false });

  document.addEventListener('click', (e) => {
    const btn = e.target?.closest?.('[data-open-login]');
    if (!btn) return;
    e.preventDefault();
    window.openLoginModal();
  });

  if (modal.dataset.autopen === '1') {
    setTimeout(() => window.openLoginModal(), 0);
  }
})();
document.addEventListener('click', (e) => {
  const btn = e.target?.closest?.('[data-open-email]');
  if (!btn) return;
  window.closeLoginModal?.();
  const mode = btn.getAttribute('data-open-email') || 'login';
  setTimeout(() => window.openEmailModal?.(mode), 50);
});
</script>

<script>
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  });
</script>
