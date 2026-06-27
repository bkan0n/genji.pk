{{-- Identity header --}}
<div class="border-t border-zinc-200/80 dark:border-white/10 pt-5">
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div>
      <div data-lb-view="coalesced_name" class="text-2xl font-black tracking-tight">—</div>
      <button data-lb-copy-id type="button" class="mt-1 inline-flex items-center gap-1 text-xs font-mono text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
        <span data-lb-view="id">—</span><span aria-hidden="true">⧉</span>
      </button>
    </div>
    <div class="rounded-xl bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
      <span data-lb-view="coins">0</span> coins
    </div>
  </div>
  {{-- XP / economy summary (xp-summary); renders defensively --}}
  <div data-lb-xp-summary class="mt-3 text-sm text-zinc-600 dark:text-zinc-300">Loading XP…</div>
</div>

{{-- Section anchors filled by later tasks --}}
<div data-lb-keys></div>
<div data-lb-xp></div>
<div data-lb-rewards></div>
