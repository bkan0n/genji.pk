@if(session('user_id'))
  <div class="relative">
    {{-- Bell button --}}
    <button id="notifBellBtn"
      type="button"
      class="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 text-white/80 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
      aria-label="{{ __('modals.notifications.bell_aria') }}"
      aria-haspopup="dialog"
      aria-expanded="false">
      {{-- bell icon --}}
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 22a2.25 2.25 0 0 0 2.2-1.8M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>

      {{-- badge --}}
      <span id="notifBadge"
        class="absolute -right-1 -top-1 hidden min-w-[18px] rounded-full bg-red-500 px-1.5 py-0.5 text-[11px] font-extrabold leading-none text-white shadow-[0_0_0_2px_rgba(0,0,0,0.45)]">
        0
      </span>
    </button>

    {{-- Tray panel (anchored under bell) --}}
    <div
      id="notifTray"
      class="fixed left-0 top-0 z-50 hidden w-[360px] max-w-[calc(100vw-16px)] origin-top-right transform-gpu overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/100 shadow-[0_20px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-none supports-[backdrop-filter]:backdrop-blur-md opacity-0 translate-y-2 pointer-events-none transition-[opacity,transform] duration-300 ease-out"
      role="dialog"
      aria-modal="false"
      aria-label="{{ __('modals.notifications.title') }}"
    >
      <div class="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <div class="text-[13px] font-extrabold text-white/90">{{ __('modals.notifications.title') }}</div>

        <button id="notifMarkAllBtn"
          type="button"
          class="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-bold text-white/80 hover:bg-white/10 hover:text-white">
          {{ __('modals.notifications.mark_all_read') }}
        </button>
      </div>

      <div id="notifList" class="max-h-[420px] overflow-auto p-2">
        <div id="notifEmpty"
          class="hidden rounded-xl border border-white/10 bg-white/5 px-3 py-6 text-center text-sm text-white/70 opacity-0 transition-opacity duration-300 ease-out">
          {{ __('modals.notifications.empty') }}
        </div>
      </div>

      <div id="notifFooter" class="hidden border-t border-white/10 p-2">
        <button id="notifLoadMoreBtn"
          type="button"
          class="w-full cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-bold text-white/80 hover:bg-white/10 hover:text-white">
          {{ __('modals.notifications.load_more') }}
        </button>
      </div>
    </div>
  </div>
@endif
