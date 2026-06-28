<div data-panel="maps" class="mod-panel hidden space-y-4">
  <div data-maps-workspace class="space-y-6">
    <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 p-4 sm:p-5 space-y-5">
      <div>
        <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400">Find a map</label>
        <input
          data-maps-search
          type="text"
          autocomplete="off"
          placeholder="Search by map code or name (e.g. 01AZC)"
          class="mt-2 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
        />
        <p class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Pick a suggestion, or type a code and press Enter.</p>
        <div data-maps-recent class="mt-3 flex flex-wrap gap-2"></div>
      </div>

      <div data-view="loading" class="hidden border-t border-zinc-200/80 dark:border-white/10 pt-5 text-sm text-zinc-500">Loading…</div>
      <div data-view="error" class="hidden border-t border-red-300/60 dark:border-red-500/30 pt-5 text-sm text-red-700 dark:text-red-300" data-maps-error></div>

      <div data-view="loaded" class="hidden space-y-5">
        @include('moderator.partials.maps-profile')
      </div>
    </div>

    {{-- Separate creation tool: submit a brand-new map (no loaded map). Filled in a later task. --}}
    <div data-maps-submit-tool class="rounded-2xl border border-dashed border-zinc-300/70 dark:border-white/10 bg-white/30 dark:bg-zinc-950/30 p-4 sm:p-5">
      <div class="text-sm font-semibold">＋ Submit new map</div>
      <div data-maps-submit-mount class="mt-3"></div>
    </div>
  </div>
</div>
