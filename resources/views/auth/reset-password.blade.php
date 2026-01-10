@php
  use Illuminate\Support\Facades\Route;
  $token = session('reset_token', request()->query('token', ''));
  $action = Route::has('password.update') ? route('password.update') : url('/reset-password');
@endphp

<div id="resetPasswordModal" class="fixed inset-0 z-[120] hidden flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-hidden="true">
  {{-- Backdrop --}}
  <button
    id="resetPasswordBackdrop"
    type="button"
    class="absolute inset-0 bg-black/70 opacity-0 transition-opacity duration-200 ease-out"
    aria-label="Close"
  ></button>

  {{-- Panel --}}
  <div
    id="resetPasswordPanel"
    class="relative w-[min(92vw,60rem)] max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] overflow-hidden
           rounded-3xl border border-white/10 bg-zinc-950/70 shadow-2xl backdrop-blur
           opacity-0 translate-y-3 scale-[0.98] transition-all duration-200 ease-out"
  >
    {{-- subtle glow --}}
    <div class="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-52 right-[-120px] h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-3xl"></div>

    {{-- Close btn --}}
    <button
      id="resetPasswordClose"
      type="button"
      class="absolute right-4 top-4 z-10 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs font-extrabold text-white/80 hover:bg-white/10"
      aria-label="Close"
    >
      ✕
    </button>

    <div class="px-7 py-10 sm:px-10">
      <div class="mx-auto max-w-md">
        <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
          <span class="bg-emerald-400 inline-block h-2 w-2 rounded-full"></span>
          {{ __('auth.reset_password.badge') }}
        </div>

        <h2 class="mt-5 text-2xl font-black tracking-tight text-white sm:text-3xl">
          {{ __('auth.reset_password.title') }}
        </h2>

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

        @if ($errors->any())
          <div class="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            <ul class="list-disc pl-5">
              @foreach ($errors->all() as $err)
                <li>{{ $err }}</li>
              @endforeach
            </ul>
          </div>
        @endif

        <form method="POST" action="{{ $action }}" class="mt-6 space-y-4">
          @csrf
          <input type="hidden" name="token" value="{{ $token }}">

          <div>
            <label class="block text-xs font-extrabold text-zinc-200">{{ __('auth.reset_password.password_label') }}</label>
            <input name="password" type="password" required minlength="8"
                   class="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 text-sm text-white/90 placeholder:text-zinc-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20">
          </div>

          <div>
            <label class="block text-xs font-extrabold text-zinc-200">{{ __('auth.reset_password.password_confirm_label') }}</label>
            <input name="password_confirmation" type="password" required minlength="8"
                   class="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 text-sm text-white/90 placeholder:text-zinc-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20">
          </div>

          <button type="submit"
                  class="inline-flex w-full items-center justify-center rounded-xl bg-emerald-500/90 px-4 py-3 text-sm font-extrabold text-black transition hover:bg-emerald-400">
            {{ __('auth.reset_password.submit_button') }}
          </button>

          <div class="text-center text-xs text-zinc-400">
            <button type="button" data-open-login class="text-zinc-300 hover:text-white">{{ __('auth.reset_password.back_to_login') }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<script @if(function_exists('csp_nonce')) nonce="{{ csp_nonce() }}" @endif>
(() => {
  const modal = document.getElementById('resetPasswordModal');
  if (!modal) return;

  const panel = document.getElementById('resetPasswordPanel');
  const backdrop = document.getElementById('resetPasswordBackdrop');
  const closeBtn = document.getElementById('resetPasswordClose');

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

  window.openResetPasswordModal = () => {
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

    const firstInput = modal.querySelector('input, button[type="submit"], a') || closeBtn;
    setTimeout(() => firstInput && firstInput.focus?.(), 50);
  };

  window.closeResetPasswordModal = () => {
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

  backdrop?.addEventListener('click', window.closeResetPasswordModal);
  closeBtn?.addEventListener('click', window.closeResetPasswordModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      e.preventDefault();
      window.closeResetPasswordModal();
    }
  }, { passive: false });

  document.addEventListener('click', (e) => {
    const btn = e.target?.closest?.('[data-open-reset-password]');
    if (!btn) return;
    e.preventDefault();
    window.openResetPasswordModal();
  });
})();
</script>

<script>
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) window.location.reload();
  });
</script>
