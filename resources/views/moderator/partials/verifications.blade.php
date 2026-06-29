<div data-panel="verifications" class="mod-panel hidden space-y-4">
  <div data-verifications-workspace class="space-y-4">
    {{-- Subtabs --}}
    <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
      <button type="button" data-subtab="verif-pending"
        class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]">
        Completions <span data-verif-count="completions" class="ml-1 hidden rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300"></span>
      </button>
      <button type="button" data-subtab="verif-playtest"
        class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]">
        Playtests
      </button>
      <button type="button" data-subtab="verif-edits"
        class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(16,185,129,.08)]">
        Map edits <span data-verif-count="edits" class="ml-1 hidden rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300"></span>
      </button>
    </div>

    {{-- Completion queue --}}
    <div data-subpanel="verif-pending" class="hidden">
      <div data-verif-queue="completions" class="space-y-4">
        <div class="flex items-center justify-between gap-3">
          <h3 class="font-semibold">Completion queue</h3>
          <button type="button" data-verif-refresh="completions"
            class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">Refresh</button>
        </div>
        <div data-view="loading" class="hidden text-sm text-zinc-500 dark:text-zinc-400" data-verif-progress>Loading queue…</div>
        <div data-view="error" class="hidden rounded-xl border border-red-300/60 dark:border-red-500/30 p-4 text-sm text-red-700 dark:text-red-300" data-verif-error></div>
        <div data-view="empty" class="hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] p-6 text-sm text-zinc-500 dark:text-zinc-400">Queue's clear ✓ — no pending completions.</div>
        <div data-view="loaded" class="hidden space-y-4 max-h-[72vh] overflow-y-auto pr-1" data-verif-completion-list></div>
      </div>
    </div>

    {{-- Playtests placeholder --}}
    <div data-subpanel="verif-playtest" class="hidden">
      <div class="rounded-2xl border border-dashed border-zinc-300/80 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] p-8 text-center">
        <div class="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Playtest verification — coming soon</div>
        <p class="mx-auto mt-2 max-w-md text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          This is where playtest accept/deny/reset will live. For now, playtest state is managed per-map on the <span class="font-medium text-zinc-700 dark:text-zinc-200">Maps</span> tab (the <span class="font-mono">playtesting</span> field).
        </p>
      </div>
    </div>

    {{-- Map-edit queue --}}
    <div data-subpanel="verif-edits" class="hidden">
      <div data-verif-queue="edits" class="space-y-4">
        <div class="flex items-center justify-between gap-3">
          <h3 class="font-semibold">Map-edit queue</h3>
          <button type="button" data-verif-refresh="edits"
            class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">Refresh</button>
        </div>
        <div data-view="loading" class="hidden text-sm text-zinc-500 dark:text-zinc-400" data-verif-progress>Loading queue…</div>
        <div data-view="error" class="hidden rounded-xl border border-red-300/60 dark:border-red-500/30 p-4 text-sm text-red-700 dark:text-red-300" data-verif-error></div>
        <div data-view="empty" class="hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] p-6 text-sm text-zinc-500 dark:text-zinc-400">Queue's clear ✓ — no pending edit requests.</div>
        <div data-view="loaded" class="hidden space-y-4 max-h-[72vh] overflow-y-auto pr-1" data-verif-edit-list></div>
      </div>
    </div>
  </div>
</div>
