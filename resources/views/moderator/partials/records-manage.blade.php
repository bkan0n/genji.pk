<div data-subpanel="records-manage" class="hidden space-y-4">
  <div data-records-manage>
    <div class="mod-card space-y-5">

      {{-- Filter bar --}}
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400">Player <span class="text-zinc-400 dark:text-zinc-500">(optional)</span></label>
          <input
            data-rm-player
            type="text"
            autocomplete="off"
            placeholder="Search by name, or paste a user ID"
            class="mt-2 w-full mod-input"
          />
          <div data-rm-recent class="mt-2 flex flex-wrap gap-2"></div>
        </div>
        <div>
          <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400">Map code <span class="text-zinc-400 dark:text-zinc-500">(optional)</span></label>
          <input
            data-rm-map
            type="text"
            autocomplete="off"
            placeholder="e.g. A1B2C"
            class="mt-2 w-full mod-input uppercase"
          />
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div data-rm-status-seg class="inline-flex overflow-hidden rounded-lg border border-zinc-200/80 dark:border-white/10">
          <button type="button" data-status="All" class="px-3 py-1.5 text-sm transition hover:bg-zinc-100 dark:hover:bg-white/10">All</button>
          <button type="button" data-status="Verified" class="px-3 py-1.5 text-sm border-l border-zinc-200/80 transition hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/10">Verified</button>
          <button type="button" data-status="Unverified" class="px-3 py-1.5 text-sm border-l border-zinc-200/80 transition hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/10">Unverified</button>
        </div>
        <label class="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <input data-rm-latest type="checkbox" checked class="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500/60 dark:border-zinc-600" />
          Latest only
        </label>
        <button
          type="button"
          data-rm-search
          class="ml-auto mod-btn-accent"
        >
          Search
        </button>
      </div>

      {{-- Pre-search prompt --}}
      <div data-rm-prompt class="border-t border-zinc-200/80 dark:border-white/10 pt-5 text-sm text-zinc-500 dark:text-zinc-400">
        Search a player or map code to find records to moderate.
      </div>

      {{-- Inline status views --}}
      <div data-view="loading" class="hidden border-t border-zinc-200/80 dark:border-white/10 pt-5"><div data-rm-skeleton class="space-y-2"></div></div>
      <div data-view="error" class="hidden border-t border-rose-300/60 dark:border-rose-500/30 pt-5 text-sm text-rose-700 dark:text-rose-300" data-rm-error></div>

      {{-- Loaded body --}}
      <div data-view="loaded" class="hidden space-y-4 border-t border-zinc-200/80 dark:border-white/10 pt-5">
        <div class="flex items-center justify-between gap-3">
          <div class="text-xs text-zinc-500 dark:text-zinc-400" data-rm-count></div>
          <div class="flex items-center gap-2">
            <button type="button" data-rm-prev class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-2.5 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-white/10 disabled:opacity-40" disabled>Prev</button>
            <span class="text-xs text-zinc-500 dark:text-zinc-400" data-rm-page>page 1</span>
            <button type="button" data-rm-next class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-2.5 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-white/10 disabled:opacity-40">Next</button>
          </div>
        </div>
        <div data-rm-list class="space-y-2"></div>
        <div data-rm-empty class="hidden rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] p-4 text-sm text-zinc-500 dark:text-zinc-400">
          No records match these filters.
        </div>
      </div>
    </div>
  </div>
</div>
