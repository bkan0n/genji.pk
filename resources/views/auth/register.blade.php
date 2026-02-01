@php
  $autoOpen = request()->boolean('openRegister') || request()->is('register');
@endphp

<div id="registerModal" class="fixed inset-0 z-[120] hidden flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-hidden="true">
  {{-- Backdrop --}}
  <button
    id="registerBackdrop"
    type="button"
    class="absolute cursor-pointer inset-0 bg-black/60 dark:bg-black/70 opacity-0 transition-opacity duration-200 ease-out"
    aria-label="Close"
  ></button>

  {{-- Panel --}}
  <div
    id="registerPanel"
    class="relative w-[min(92vw,60rem)] max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] overflow-hidden
           rounded-3xl border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-950/70 shadow-2xl backdrop-blur
           opacity-0 translate-y-3 scale-[0.98] transition-all duration-200 ease-out"
  >
    {{-- subtle glow --}}
    <div aria-hidden="true" class="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl"></div>
    <div aria-hidden="true" class="pointer-events-none absolute -bottom-52 right-[-120px] h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-3xl"></div>

    {{-- Close btn --}}
    <button
      id="registerClose"
      type="button"
      class="absolute cursor-pointer right-4 top-4 z-10 rounded-xl
             border border-zinc-200/80 dark:border-white/10
             bg-white/70 dark:bg-black/30 px-3 py-2 text-xs font-extrabold
             text-zinc-800 dark:text-white/80 hover:bg-zinc-100/80 dark:hover:bg-white/10"
      aria-label="Close"
    >
      ✕
    </button>

    <div class="grid max-h-[88vh] overflow-y-auto lg:grid-cols-2">
      {{-- LEFT --}}
      <aside class="relative overflow-hidden border-b border-zinc-200/80 dark:border-white/10
                    bg-zinc-50/60 dark:bg-zinc-900/40 px-7 py-10 sm:px-10 lg:border-b-0 lg:border-r">
        <div class="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 dark:border-white/10
                    bg-white/60 dark:bg-white/5 px-3 py-1 text-xs text-zinc-700 dark:text-zinc-300">
          <span class="bg-emerald-500 inline-block h-2 w-2 rounded-full"></span>
          Genji Parkour
        </div>

        <h2 class="mt-5 text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          {{ __('auth.register.title') }}
        </h2>

        <p class="mt-4 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {{ __('auth.register.description') }}
        </p>

        <div class="mt-8 grid gap-3 sm:grid-cols-2">
          <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-black/25 p-4">
            <div class="text-xs font-extrabold text-zinc-900 dark:text-white/90">{{ __('auth.register.private') }}</div>
            <div class="mt-1 text-xs text-zinc-600 dark:text-zinc-300">{{ __('auth.register.private_desc') }}</div>
          </div>
          <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-black/25 p-4">
            <div class="text-xs font-extrabold text-zinc-900 dark:text-white/90">{{ __('auth.register.verified') }}</div>
            <div class="mt-1 text-xs text-zinc-600 dark:text-zinc-300">{{ __('auth.register.verified_desc') }}</div>
          </div>
        </div>
      </aside>

      {{-- RIGHT --}}
      <main class="px-7 py-10 sm:px-10">
        <div class="mx-auto max-w-md">
          <h3 class="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
            {{ __('auth.register.sign_up_title') }}
          </h3>
          <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{{ __('auth.register.sign_up_desc') }}</p>

          @if (session('register_error'))
            <div class="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-900 dark:text-rose-100">
              {{ session('register_error') }}
            </div>
          @endif

          @if (session('error'))
            <div class="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-900 dark:text-rose-100">
              {{ session('error') }}
            </div>
          @endif

          @if ($errors->any())
            <div class="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-900 dark:text-rose-100">
              <div class="font-extrabold">{{ __('auth.register.please_fix') }}</div>
              <ul class="mt-2 list-disc pl-5">
                @foreach ($errors->all() as $e)
                  <li>{{ $e }}</li>
                @endforeach
              </ul>
            </div>
          @endif

          <form method="POST" action="{{ url('/register') }}" class="mt-6 space-y-4">
            @csrf

            <div>
              <label class="block text-xs font-extrabold text-zinc-700 dark:text-zinc-200">{{ __('auth.register.username_label') }}</label>
              <input
                name="username"
                type="text"
                autocomplete="username"
                value="{{ old('username') }}"
                class="mt-1 w-full rounded-xl border border-zinc-200/80 dark:border-white/10
                       bg-white dark:bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-900 dark:text-white/90
                       placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                       focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="GenjiMain"
              />
            </div>

            <div>
              <label class="block text-xs font-extrabold text-zinc-700 dark:text-zinc-200">{{ __('auth.register.email_label') }}</label>
              <input
                name="email"
                type="email"
                autocomplete="email"
                required
                value="{{ old('email') }}"
                class="mt-1 w-full rounded-xl border border-zinc-200/80 dark:border-white/10
                       bg-white dark:bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-900 dark:text-white/90
                       placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                       focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label class="block text-xs font-extrabold text-zinc-700 dark:text-zinc-200">{{ __('auth.register.password_label') }}</label>
              <input
                name="password"
                type="password"
                autocomplete="new-password"
                required
                class="mt-1 w-full rounded-xl border border-zinc-200/80 dark:border-white/10
                       bg-white dark:bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-900 dark:text-white/90
                       placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                       focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label class="block text-xs font-extrabold text-zinc-700 dark:text-zinc-200">{{ __('auth.register.password_confirm_label') }}</label>
              <input
                name="password_confirmation"
                type="password"
                autocomplete="new-password"
                required
                class="mt-1 w-full rounded-xl border border-zinc-200/80 dark:border-white/10
                       bg-white dark:bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-900 dark:text-white/90
                       placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                       focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              class="inline-flex cursor-pointer w-full items-center justify-center rounded-xl
                     bg-emerald-500/90 px-4 py-3 text-sm font-extrabold text-black transition hover:bg-emerald-400"
            >
              {{ __('auth.register.submit_button') }}
            </button>

            <div class="text-center text-xs text-zinc-500 dark:text-zinc-400">
              {{ __('auth.register.already_have_account') }}
              <button type="button" data-open-login class="text-zinc-700 dark:text-zinc-200 cursor-pointer hover:text-zinc-900 dark:hover:text-white">
                {{ __('auth.register.sign_in') }}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  </div>
</div>

<script @if(function_exists('csp_nonce')) nonce="{{ csp_nonce() }}" @endif>
(() => {
  const modal = document.getElementById('registerModal');
  if (!modal) return;

  const panel = document.getElementById('registerPanel');
  const backdrop = document.getElementById('registerBackdrop');
  const closeBtn = document.getElementById('registerClose');

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

  window.openRegisterModal = () => {
    if (!modal.classList.contains('hidden')) return;

    if (typeof window.closeLoginModal === 'function') window.closeLoginModal();

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

    const firstInput = modal.querySelector('input, button, a') || closeBtn;
    setTimeout(() => firstInput && firstInput.focus?.(), 50);
  };

  window.closeRegisterModal = () => {
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

  backdrop?.addEventListener('click', window.closeRegisterModal);
  closeBtn?.addEventListener('click', window.closeRegisterModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      e.preventDefault();
      window.closeRegisterModal();
    }
  }, { passive: false });

  document.addEventListener('click', (e) => {
    const btn = e.target?.closest?.('[data-open-register]');
    if (!btn) return;
    e.preventDefault();
    window.openRegisterModal();
  });

  const autoOpen = @json($autoOpen);
  if (autoOpen) setTimeout(() => window.openRegisterModal(), 0);
})();
</script>

<script>
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) window.location.reload();
  });
</script>
