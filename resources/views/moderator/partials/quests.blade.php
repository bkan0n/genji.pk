{{-- ============ QUESTS ============ --}}
<div data-panel="quests" class="mod-panel hidden space-y-4">
  <div data-quests-workspace class="space-y-4">

    {{-- Sub-tab bar (reuses central setupSubtabs switcher) --}}
    <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
      <button type="button" data-subtab="quest-config"
        class="mod-subtab">Config</button>
      <button type="button" data-subtab="quest-global"
        class="mod-subtab">Global quests</button>
      <button type="button" data-subtab="quest-user"
        class="mod-subtab">User quests</button>
      <button type="button" data-subtab="quest-rotation"
        class="mod-subtab">Rotation</button>
    </div>

    <div data-subpanel="quest-config" class="hidden space-y-6"></div>
    <div data-subpanel="quest-global" class="hidden space-y-6"></div>
    <div data-subpanel="quest-user" class="hidden space-y-6"></div>
    <div data-subpanel="quest-rotation" class="hidden space-y-6"></div>

  </div>
</div>
