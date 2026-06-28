<div data-panel="tournament" class="mod-panel hidden space-y-4">
  <div data-tournament-workspace data-app-env="{{ app()->environment() }}">
    {{-- Sub-tabs --}}
    <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
      <button type="button" data-subtab="tournament-status"
        class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]">
        Status
      </button>
      <button type="button" data-subtab="tournament-setup"
        class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]">
        Setup
      </button>
      <button type="button" data-subtab="tournament-utility"
        class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]">
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
      <div data-tournament-edition-strip class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
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

    {{-- ===== UTILITY ===== --}}
    <div data-subpanel="tournament-utility" class="hidden space-y-4">
      <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
        <h4 class="text-base font-black">Player streak lookup</h4>
        <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Look up a player's tournament streak by user ID.</p>
        <div class="mt-3 flex items-center gap-2">
          <input data-tournament-streak-search type="text" inputmode="numeric" placeholder="Look up player streak (user ID)"
            class="w-72 max-w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
        </div>
      </div>
    </div>
  </div>
</div>
