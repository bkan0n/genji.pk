{{-- Credits Modal --}}
<div id="creditsModal" class="fixed inset-0 z-[140] hidden items-center justify-center p-4 sm:p-6">
  {{-- Backdrop --}}
  <button
    id="creditsBackdrop"
    class="absolute inset-0 bg-black/75 opacity-0 transition-opacity duration-200"
    aria-label="{{ __('modals.credits.close') }}"
  ></button>

  {{-- Carte --}}
  <div
    id="creditsCard"
    role="dialog"
    aria-modal="true"
    aria-labelledby="creditsTitle"
    class="pointer-events-auto relative z-10 w-full max-w-2xl translate-y-4 scale-95 transform-gpu
           rounded-[1.75rem] bg-gradient-to-tr from-emerald-400/40 via-indigo-400/35 to-transparent
           p-[1px] opacity-0 shadow-[0_28px_80px_rgba(0,0,0,0.9)] ring-1 ring-zinc-300/60 dark:ring-white/15
           transition duration-200 ease-out sm:max-w-3xl"
  >
    <div class="rounded-[1.6rem] bg-white/95 dark:bg-zinc-950/95 p-5 shadow-2xl sm:p-7">
      <div class="mb-5 relative flex items-center justify-center">
        <h2
          id="creditsTitle"
          class="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-xl text-center"
        >
          {{ __('modals.credits.title') }}
        </h2>

        <button
          id="creditsModalClose"
          class="absolute right-0 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300
                shadow-sm ring-1 ring-zinc-300/60 dark:ring-white/10 hover:bg-zinc-200/70 dark:hover:bg-zinc-900/5 dark:bg-white/10 hover:text-zinc-900 dark:hover:text-zinc-900 dark:text-white focus:outline-none
                focus:ring-2 focus:ring-emerald-400/70"
          aria-label="{{ __('modals.credits.close') }}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div
        id="creditsTranslations"
        class="hidden"
        data-backend-role="{{ __('modals.credits.role_backend') }}"
        data-frontend-role="{{ __('modals.credits.role_frontend') }}"
        data-backend-note="{{ __('modals.credits.note_backend') }}"
        data-frontend-note="{{ __('modals.credits.note_frontend') }}"
        data-discord-label="{{ __('modals.credits.discord_label') }}"
      ></div>

      <div class="space-y-6 border-t border-zinc-200/80 dark:border-white/5 pt-5">
        <section>
          <h3 class="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-400 sm:text-xs">
            {{ __('modals.credits.website_creators') }}
          </h3>
          <div
            id="websiteCreatorsList"
            class="grid grid-cols-1 gap-3 sm:grid-cols-2"
          ></div>
        </section>

        <section>
          <h3 class="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-400 sm:text-xs">
            {{ __('modals.credits.translation_contributors') }}
          </h3>
          <div
            id="translatorsList"
            class="flex flex-wrap items-center gap-2.5"
          ></div>
        </section>

        <p class="pt-1 text-[11px] text-zinc-600 dark:text-zinc-500 sm:text-xs text-center sm:text-left">
          {{ __('modals.credits.thanks') }}
        </p>
      </div>
    </div>
  </div>
</div>
