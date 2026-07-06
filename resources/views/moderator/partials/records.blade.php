<div data-panel="records" class="mod-panel hidden space-y-4">
  <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
    <button
      type="button"
      class="mod-subtab"
      data-subtab="records-manage"
    >
      Manage records
    </button>
    <button
      type="button"
      class="mod-subtab"
      data-subtab="records-flags"
    >
      Suspicious flags
    </button>
  </div>

  @include('moderator.partials.records-manage')

  <div data-subpanel="records-flags" class="hidden space-y-4">
    <div data-records-workspace>
    <div class="mod-card space-y-5">

      {{-- Search / entry --}}
      <div>
        <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400">Find a player</label>
        <input
          data-records-search
          type="text"
          autocomplete="off"
          placeholder="Search by name, or paste a user ID"
          class="mt-2 w-full mod-input"
        />
        <p class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Pick a suggestion, or paste a numeric ID and press Enter.</p>
        <div data-records-recent class="mt-3 flex flex-wrap gap-2"></div>
      </div>

      {{-- Inline status views --}}
      <div data-view="loading" class="hidden border-t border-zinc-200/80 dark:border-white/10 pt-5 text-sm text-zinc-500 dark:text-zinc-400">Loading flags…</div>
      <div data-view="error" class="hidden border-t border-rose-300/60 dark:border-rose-500/30 pt-5 text-sm text-rose-700 dark:text-rose-300" data-records-error></div>

      {{-- Loaded body --}}
      <div data-view="loaded" class="hidden space-y-5 border-t border-zinc-200/80 dark:border-white/10 pt-5">

        {{-- Player header --}}
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="min-w-0">
            <div class="text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Player</div>
            <div class="text-sm font-semibold truncate" data-records-player-name>—</div>
            <div class="text-xs font-mono text-zinc-500 dark:text-zinc-400" data-records-player-id></div>
          </div>
          <button
            type="button"
            data-records-flag-toggle
            class="shrink-0 rounded-xl border border-zinc-200/80 dark:border-white/10 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-white/10"
          >
            + Flag a record
          </button>
        </div>

        {{-- Inline "Flag a record" form --}}
        <form data-records-flag-form autocomplete="off" class="hidden rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] p-4 space-y-4">
          {{-- Record reference (exactly one) --}}
          <div>
            <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Record reference <span class="text-zinc-400 dark:text-zinc-500">(one required)</span>
            </label>
            <div class="mt-2 flex flex-wrap items-center gap-2">
              <div data-records-ref-seg class="inline-flex overflow-hidden rounded-lg border border-zinc-200/80 dark:border-white/10">
                <button type="button" data-ref-kind="message_id" class="px-3 py-1.5 text-sm transition hover:bg-zinc-100 dark:hover:bg-white/10">Message ID</button>
                <button type="button" data-ref-kind="verification_id" class="px-3 py-1.5 text-sm border-l border-zinc-200/80 transition hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/10">Verification ID</button>
              </div>
              <input
                data-records-ref-input
                type="text"
                inputmode="numeric"
                placeholder="123…"
                class="min-w-[10rem] flex-1 mod-field text-sm"
              />
            </div>
          </div>

          {{-- Flag type --}}
          <div>
            <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400">Flag type</label>
            <div data-records-type-seg class="mt-2 inline-flex overflow-hidden rounded-lg border border-zinc-200/80 dark:border-white/10">
              <button type="button" data-flag-type="Cheating" class="px-3 py-1.5 text-sm transition hover:bg-zinc-100 dark:hover:bg-white/10">Cheating</button>
              <button type="button" data-flag-type="Scripting" class="px-3 py-1.5 text-sm border-l border-zinc-200/80 transition hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/10">Scripting</button>
            </div>
          </div>

          {{-- Context --}}
          <div>
            <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400">Context</label>
            <input
              data-records-context
              type="text"
              placeholder="tool-assisted, impossible, …"
              class="mt-2 w-full mod-field text-sm"
            />
          </div>

          {{-- flagged_by (read-only, always the signed-in mod) --}}
          <p class="text-xs text-zinc-500 dark:text-zinc-400">Flagged by <span data-records-flaggedby-label class="font-medium text-zinc-700 dark:text-zinc-200">you</span></p>

          {{-- Actions --}}
          <div class="flex flex-wrap gap-2">
            <button type="submit" class="mod-btn-accent">Flag record</button>
            <button type="button" data-records-flag-cancel class="rounded-xl border border-zinc-200/80 px-4 py-2 text-sm transition hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/10">Cancel</button>
          </div>
        </form>

        {{-- Flags list --}}
        <div>
          <div class="mb-2 text-xs text-zinc-500 dark:text-zinc-400" data-records-count></div>
          <div data-records-list class="space-y-2"></div>
          <div data-records-empty class="hidden rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] p-4 text-sm text-zinc-500 dark:text-zinc-400">
            No suspicious flags for this player.
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</div>
