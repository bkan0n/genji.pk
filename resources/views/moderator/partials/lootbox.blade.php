<div data-panel="lootbox" class="mod-panel hidden space-y-4">
  {{-- Sub-tabs: per-user workspace vs. global economy settings --}}
  <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
    <button
      class="mod-subtab active rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-900/5 dark:bg-white/10 px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
      data-subtab="lootbox-user"
      aria-selected="true"
    >
      User
    </button>
    <button
      class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
      data-subtab="lootbox-settings"
      aria-selected="false"
    >
      Settings
    </button>
  </div>

  {{-- USER: search + the chosen user's lootbox state, one continuous card --}}
  <div data-subpanel="lootbox-user" data-preserve-form-state="1" class="space-y-6">
    <div data-lootbox-workspace>
      <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 p-4 sm:p-5 space-y-5">
        <div>
          <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400">Find a user</label>
          <input
            data-lootbox-search
            type="text"
            autocomplete="off"
            placeholder="Search by name, or paste a user ID"
            class="mt-2 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
          />
          <p class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Pick a suggestion, or paste a numeric ID and press Enter.</p>
          <div data-lootbox-recent class="mt-3 flex flex-wrap gap-2"></div>
        </div>

        <div data-view="loading" class="hidden border-t border-zinc-200/80 dark:border-white/10 pt-5 text-sm text-zinc-500">Loading…</div>
        <div data-view="error" class="hidden border-t border-red-300/60 dark:border-red-500/30 pt-5 text-sm text-red-700 dark:text-red-300" data-lootbox-error></div>

        <div data-view="loaded" class="hidden space-y-5">
          @include('moderator.partials.lootbox-profile')
        </div>
      </div>
    </div>
  </div>

  {{-- SETTINGS: global economy controls (filled by lootbox-settings.js) --}}
  <div data-subpanel="lootbox-settings" class="hidden space-y-6">
    <div data-lootbox-settings></div>
  </div>
</div>
