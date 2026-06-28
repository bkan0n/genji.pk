<div data-maps-profile class="space-y-6">
  {{-- A. Identity header (read-only anchor) --}}
  <div class="flex flex-wrap items-start justify-between gap-3">
    <div class="min-w-0">
      <div data-field-view="map_name" class="truncate text-xl font-semibold">—</div>
      <div class="mt-1 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <span data-field-view="code" class="font-mono">—</span>
        <button type="button" data-copy-code class="rounded-md border border-zinc-200/80 dark:border-white/10 px-1.5 py-0.5 text-xs hover:bg-zinc-100 dark:hover:bg-white/10">Copy</button>
      </div>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <span data-chip="difficulty" class="hidden rounded-full bg-zinc-900/5 dark:bg-white/10 px-2.5 py-1 text-xs"></span>
      <span data-chip="category" class="hidden rounded-full bg-zinc-900/5 dark:bg-white/10 px-2.5 py-1 text-xs"></span>
      <span data-badge="archived" class="hidden rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2.5 py-1 text-xs">Archived</span>
      <span data-badge="official" class="hidden rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 text-xs">Official</span>
      <span data-badge="hidden" class="hidden rounded-full bg-zinc-500/15 px-2.5 py-1 text-xs">Hidden</span>
    </div>
  </div>

  {{-- B. Map fields (Task 3) --}}
  <div data-maps-fields class="hidden"></div>
  {{-- C. Guides (Task 4) --}}
  <div data-maps-guides class="hidden"></div>
  {{-- D. Collapsed actions (Task 5) --}}
  <div data-maps-actions class="hidden"></div>
</div>
