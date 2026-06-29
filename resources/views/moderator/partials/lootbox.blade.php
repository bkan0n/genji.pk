<div data-panel="lootbox" class="mod-panel hidden space-y-4">
  {{-- Sub-tabs: per-user workspace vs. global economy settings --}}
  <div role="tablist" aria-label="Lootbox sections" class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
    <button
      role="tab"
      id="lootbox-tab-settings"
      aria-controls="lootbox-subpanel-settings"
      class="mod-subtab active"
      data-subtab="lootbox-settings"
      aria-selected="true"
    >
      Config
    </button>
    <button
      role="tab"
      id="lootbox-tab-user"
      aria-controls="lootbox-subpanel-user"
      class="mod-subtab"
      data-subtab="lootbox-user"
      aria-selected="false"
    >
      User
    </button>
  </div>

  {{-- USER: search + the chosen user's lootbox state, one continuous card --}}
  <div data-subpanel="lootbox-user" data-preserve-form-state="1" id="lootbox-subpanel-user" role="tabpanel" aria-labelledby="lootbox-tab-user" tabindex="0" class="hidden space-y-6 focus:outline-none">
    <div data-lootbox-workspace>
      <div class="mod-card space-y-5">
        <div>
          <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400">Find a user</label>
          <input
            data-lootbox-search
            type="text"
            autocomplete="off"
            placeholder="Search by name, or paste a user ID"
            class="mt-2 w-full mod-input"
          />
          <p class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Pick a suggestion, or paste a numeric ID and press Enter.</p>
          <div data-lootbox-recent class="mt-3 flex flex-wrap gap-2"></div>
        </div>

        <div data-view="loading" class="hidden border-t border-zinc-200/80 dark:border-white/10 pt-5" aria-hidden="true">
          <div class="animate-pulse motion-reduce:animate-none space-y-5">
            <div class="flex items-center justify-between gap-3">
              <div class="space-y-2">
                <div class="h-7 w-40 rounded-md bg-zinc-200/80 dark:bg-white/10"></div>
                <div class="h-3 w-28 rounded bg-zinc-200/80 dark:bg-white/10"></div>
              </div>
              <div class="h-8 w-20 rounded-xl bg-zinc-200/80 dark:bg-white/10"></div>
            </div>
            <div class="space-y-2.5">
              <div class="h-3 w-44 rounded bg-zinc-200/80 dark:bg-white/10"></div>
              <div class="h-1.5 w-full rounded-full bg-zinc-200/80 dark:bg-white/10"></div>
              <div class="h-1.5 w-full rounded-full bg-zinc-200/80 dark:bg-white/10"></div>
            </div>
          </div>
        </div>
        <div data-view="error" class="hidden border-t border-red-300/60 dark:border-red-500/30 pt-5 text-sm text-red-700 dark:text-red-300" role="alert" data-lootbox-error></div>

        <div data-view="loaded" class="hidden space-y-5">
          @include('moderator.partials.lootbox-profile')
        </div>
      </div>
    </div>
  </div>

  {{-- SETTINGS: global economy controls (filled by lootbox-settings.js) --}}
  <div data-subpanel="lootbox-settings" id="lootbox-subpanel-settings" role="tabpanel" aria-labelledby="lootbox-tab-settings" tabindex="0" class="space-y-6 focus:outline-none">
    <div data-lootbox-settings></div>
  </div>
</div>
