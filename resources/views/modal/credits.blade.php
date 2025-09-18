{{-- Credits Modal — CENTRÉ ÉCRAN --}}
<div id="creditsModal" class="fixed inset-0 z-[140] flex hidden items-center justify-center p-4">
  {{-- Backdrop --}}
  <button
    id="creditsBackdrop"
    class="absolute inset-0 bg-black/70 opacity-0 transition-opacity duration-200"
    aria-label="{{ __('modals.credits.close') }}"
  ></button>

  {{-- Carte --}}
  <div
    id="creditsCard"
    role="dialog"
    aria-modal="true"
    aria-labelledby="creditsTitle"
    class="pointer-events-auto relative z-10 w-full max-w-md translate-y-2 scale-95 transform-gpu rounded-2xl border border-white/10 bg-zinc-900/80 p-4 opacity-0 shadow-2xl backdrop-blur transition duration-200 ease-out sm:max-w-lg"
  >
    <div class="mb-3 flex items-center justify-between">
      <h2 id="creditsTitle" class="text-lg font-extrabold tracking-tight text-white sm:text-xl">
        {{ __('modals.credits.title') }}
      </h2>
      <button
        id="creditsModalClose"
        class="rounded-md p-2 text-zinc-300 hover:bg-white/10"
        aria-label="{{ __('modals.credits.close') }}"
      >
        &times;
      </button>
    </div>

    <div class="space-y-6">
      <section>
        <h3 class="mb-2 text-xs font-semibold text-zinc-300 sm:text-sm">
          {{ __('modals.credits.website_creators') }}
        </h3>
        <div id="websiteCreatorsList" class="flex flex-wrap items-center gap-2"></div>
      </section>

      <section>
        <h3 class="mb-2 text-xs font-semibold text-zinc-300 sm:text-sm">
          {{ __('modals.credits.translation_contributors') }}
        </h3>
        <div id="translatorsList" class="flex flex-wrap items-center gap-2"></div>
      </section>
    </div>
  </div>
</div>
