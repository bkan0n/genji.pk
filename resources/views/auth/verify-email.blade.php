<div
  id="verifyEmailModal"
  class="fixed inset-0 z-[120] hidden flex items-center justify-center p-4 sm:p-6"
  role="dialog"
  aria-modal="true"
  aria-hidden="true"
  data-autopen="0"
>
  {{-- Backdrop --}}
  <button
    id="verifyEmailBackdrop"
    type="button"
    class="absolute inset-0 bg-black/70 opacity-0 transition-opacity duration-200 ease-out"
    aria-label="Close"
  ></button>

  {{-- Panel --}}
  <div
    id="verifyEmailPanel"
    class="relative w-[min(92vw,60rem)] max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] overflow-hidden
           rounded-3xl border border-white/10 bg-zinc-950/70 shadow-2xl backdrop-blur
           opacity-0 translate-y-3 scale-[0.98] transition-all duration-200 ease-out"
  >
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
            {{ __('auth.verify_email.title') }}
          </h2>

          <p class="mt-4 max-w-md text-sm leading-relaxed text-zinc-300">
            {{ __('auth.verify_email.description') }}
          </p>

          <div class="mt-8 grid gap-3 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div class="text-xs font-extrabold text-white/90">{{ __('auth.login.secure') }}</div>
              <div class="mt-1 text-xs text-zinc-300">{{ __('auth.login.secure_desc') }}</div>
            </div>
            <div class="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div class="text-xs font-extrabold text-white/90">{{ __('auth.login.fast') }}</div>
              <div class="mt-1 text-xs text-zinc-300">{{ __('auth.login.fast_desc') }}</div>
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
                {{ __('auth.verify_email.title') }}
              </h3>
            </div>

            <button
              id="verifyEmailClose"
              type="button"
              class="rounded-xl cursor-pointer border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-white/80 hover:bg-white/10"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

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
                @foreach ($errors->all() as $e)
                  <li>{{ $e }}</li>
                @endforeach
              </ul>
            </div>
          @endif

          <form method="POST" action="{{ route('verification.resend') }}" class="mt-6 space-y-3">
            @csrf

            <div>
              <label class="block text-xs font-extrabold text-zinc-200">{{ __('auth.verify_email.email_label') }}</label>
              <input
                type="email"
                name="email"
                value="{{ old('email', $email ?? request('email') ?? (data_get($currentUser ?? null, 'email') ?? '')) }}"
                class="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 text-sm text-white/90 placeholder:text-zinc-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="you@example.com"
                required
              />
              @error('email')
                <p class="mt-1 text-xs text-rose-300">{{ $message }}</p>
              @enderror
            </div>

            <button
              type="submit"
              class="inline-flex cursor-pointer w-full items-center justify-center rounded-xl bg-emerald-500/90 px-4 py-3 text-sm font-extrabold text-black transition hover:bg-emerald-400"
            >
              {{ __('auth.verify_email.resend_button') }}
            </button>

            <a
              href="/?openLogin=1"
              class="block text-center text-sm font-semibold text-zinc-300 hover:text-white"
            >
              {{ __('auth.verify_email.back_to_login') }}
            </a>
          </form>
        </div>
      </main>
    </div>
  </div>
</div>

<script>
  const verifyEmailModal = document.getElementById('verifyEmailModal');
  const verifyEmailPanel = document.getElementById('verifyEmailPanel');
  const verifyEmailBackdrop = document.getElementById('verifyEmailBackdrop');
  const verifyEmailClose = document.getElementById('verifyEmailClose');
  const verifyEmailAutoOpen = verifyEmailModal?.dataset.autopen === '1';

  window.openVerifyEmailModal = () => {
    if (!verifyEmailModal) return;
    verifyEmailModal.classList.remove('hidden');
    setTimeout(() => {
      verifyEmailPanel?.classList.remove('opacity-0', 'translate-y-3', 'scale-[0.98]');
      verifyEmailBackdrop?.classList.remove('opacity-0');
    }, 0);
  };

  window.closeVerifyEmailModal = () => {
    if (!verifyEmailModal) return;
    verifyEmailPanel?.classList.add('opacity-0', 'translate-y-3', 'scale-[0.98]');
    verifyEmailBackdrop?.classList.add('opacity-0');
    setTimeout(() => verifyEmailModal.classList.add('hidden'), 200);
  };

  verifyEmailBackdrop?.addEventListener('click', window.closeVerifyEmailModal);
  verifyEmailClose?.addEventListener('click', window.closeVerifyEmailModal);

  const params = new URLSearchParams(window.location.search);
  if (params.get('openVerifyEmail') === '1') {
    window.openVerifyEmailModal();
  }

  window.addEventListener('beforeunload', () => {
    window.closeVerifyEmailModal?.();
  });
</script>
