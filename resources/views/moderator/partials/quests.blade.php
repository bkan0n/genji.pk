{{-- ============ QUESTS ============ --}}
<div data-panel="quests" class="mod-panel hidden space-y-4">
  <div data-quests-workspace class="space-y-4">

    {{-- Sub-tab bar (reuses central setupSubtabs switcher) --}}
    <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
      <button type="button" data-subtab="quest-config"
        class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 w-full sm:w-auto">Config</button>
      <button type="button" data-subtab="quest-global"
        class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 w-full sm:w-auto">Global quests</button>
      <button type="button" data-subtab="quest-user"
        class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 w-full sm:w-auto">User quests</button>
      <button type="button" data-subtab="quest-rotation"
        class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 w-full sm:w-auto">Rotation</button>
    </div>

    <div data-subpanel="quest-config" class="hidden space-y-6"></div>
    <div data-subpanel="quest-global" class="hidden space-y-6"></div>
    <div data-subpanel="quest-user" class="hidden space-y-6"></div>
    <div data-subpanel="quest-rotation" class="hidden space-y-6"></div>

  </div>
</div>
