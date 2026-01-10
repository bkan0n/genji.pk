{{-- Community Rules Modal --}}
<div id="rulesModal" class="fixed inset-0 z-[140] hidden items-center justify-center p-4 sm:p-6">
  {{-- Backdrop --}}
  <button
    id="rulesBackdrop"
    class="absolute inset-0 bg-black/75 opacity-0 transition-opacity duration-200"
    aria-label="{{ __('modals.rules.close') }}"
  ></button>

  {{-- Card --}}
  <div
    id="rulesCard"
    role="dialog"
    aria-modal="true"
    aria-labelledby="rulesTitle"
    class="pointer-events-auto relative z-10 w-full max-w-2xl translate-y-4 scale-95 transform-gpu
           rounded-[1.75rem] bg-gradient-to-tr from-emerald-400/40 via-indigo-400/35 to-transparent
           p-[1px] opacity-0 shadow-[0_28px_80px_rgba(0,0,0,0.9)] ring-1 ring-white/15
           transition duration-200 ease-out sm:max-w-3xl"
  >
    <div class="rounded-[1.6rem] bg-zinc-950/95 p-5 shadow-2xl sm:p-7">
      <div class="mb-5 relative flex items-center justify-center">
        <h2
          id="rulesTitle"
          class="text-lg font-semibold tracking-tight text-white sm:text-xl text-center"
        >
          {{ __('modals.rules.title') }}
        </h2>

        <button
          id="rulesModalClose"
          class="absolute right-0 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-zinc-300
                shadow-sm ring-1 ring-white/10 hover:bg-white/10 hover:text-white focus:outline-none
                focus:ring-2 focus:ring-emerald-400/70"
          aria-label="{{ __('modals.rules.close') }}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="space-y-4 border-t border-white/5 pt-5 overflow-y-auto max-h-[70vh]">
        <div class="space-y-3">
          <div class="pb-3 border-b border-white/5">
            <h3 class="text-sm font-semibold text-emerald-400 mb-1">{{ __('modals.rules.rule_1_title') }}</h3>
            <p class="text-xs text-zinc-300 leading-relaxed">{{ __('modals.rules.rule_1_text') }}</p>
          </div>

          <div class="pb-3 border-b border-white/5">
            <h3 class="text-sm font-semibold text-emerald-400 mb-1">{{ __('modals.rules.rule_2_title') }}</h3>
            <p class="text-xs text-zinc-300 leading-relaxed">{{ __('modals.rules.rule_2_text') }}</p>
          </div>

          <div class="pb-3 border-b border-white/5">
            <h3 class="text-sm font-semibold text-emerald-400 mb-1">{{ __('modals.rules.rule_3_title') }}</h3>
            <p class="text-xs text-zinc-300 leading-relaxed">{{ __('modals.rules.rule_3_text') }}</p>
          </div>

          <div class="pb-3 border-b border-white/5">
            <h3 class="text-sm font-semibold text-emerald-400 mb-1">{{ __('modals.rules.rule_4_title') }}</h3>
            <p class="text-xs text-zinc-300 leading-relaxed">{{ __('modals.rules.rule_4_text') }}</p>
          </div>

          <div class="pb-3 border-b border-white/5">
            <h3 class="text-sm font-semibold text-emerald-400 mb-1">{{ __('modals.rules.rule_5_title') }}</h3>
            <p class="text-xs text-zinc-300 leading-relaxed">{{ __('modals.rules.rule_5_text') }}</p>
          </div>

          <div class="pb-3 border-b border-white/5">
            <h3 class="text-sm font-semibold text-emerald-400 mb-1">{{ __('modals.rules.rule_6_title') }}</h3>
            <p class="text-xs text-zinc-300 leading-relaxed">{{ __('modals.rules.rule_6_text') }}</p>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-emerald-400 mb-1">{{ __('modals.rules.rule_7_title') }}</h3>
            <p class="text-xs text-zinc-300 leading-relaxed">{{ __('modals.rules.rule_7_text') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
