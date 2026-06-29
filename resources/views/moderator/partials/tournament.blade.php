<div data-panel="tournament" class="mod-panel hidden space-y-4">
  <div data-tournament-workspace data-app-env="{{ app()->environment() }}" class="space-y-4">
    {{-- Sub-tabs --}}
    <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
      <button type="button" data-subtab="tournament-status"
        class="mod-subtab">
        Status
      </button>
      <button type="button" data-subtab="tournament-setup"
        class="mod-subtab">
        Setup
      </button>
      <button type="button" data-subtab="tournament-config"
        class="mod-subtab">
        Config
      </button>
      <button type="button" data-subtab="tournament-utility"
        class="mod-subtab">
        Utility
      </button>
    </div>

    {{-- ===== STATUS ===== --}}
    <div data-subpanel="tournament-status" class="hidden space-y-4">
      {{-- status toolbar --}}
      <div class="flex justify-end">
        <button type="button" data-tournament-refresh
          class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">Refresh</button>
      </div>

      <div data-tournament-paused-banner class="hidden rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-700 dark:text-amber-300"></div>

      {{-- edition strip --}}
      <div data-tournament-edition-strip class="mod-card-solid">
        <div class="h-24 animate-pulse rounded-xl bg-zinc-900/5 dark:bg-white/5"></div>
      </div>

      {{-- category cards --}}
      <div data-view="error" class="hidden rounded-xl border border-red-300/60 dark:border-red-500/30 p-4 text-sm text-red-700 dark:text-red-300"></div>
      <div data-tournament-category-grid class="grid gap-4 lg:grid-cols-2"></div>
    </div>

    {{-- ===== SETUP ===== --}}
    <div data-subpanel="tournament-setup" class="hidden space-y-6">
      <div data-tournament-setup-mount class="space-y-6"></div>
    </div>

    {{-- ===== CONFIG ===== --}}
    <div data-subpanel="tournament-config" class="hidden space-y-4">
      <div data-tournament-config-mount class="space-y-6"></div>
    </div>

    {{-- ===== UTILITY ===== --}}
    <div data-subpanel="tournament-utility" class="hidden space-y-4">
      <div class="mod-card-solid">
        <h4 class="text-base font-black">Player streak lookup</h4>
        <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Look up a player's tournament streak by user ID.</p>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <input data-tournament-streak-search type="text" inputmode="numeric" placeholder="Look up player streak (user ID)"
            class="w-72 max-w-full mod-field text-sm" />
          <button type="button" data-tournament-streak-submit
            class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-white shadow-sm cursor-pointer hover:bg-emerald-500">Look up</button>
        </div>
        <div data-tournament-streak-recent class="mt-3 flex flex-wrap gap-2"></div>
        <div data-tournament-streak-result class="mt-4"></div>
      </div>
    </div>
  </div>
</div>
