<div data-panel="users" class="mod-panel space-y-4">
  {{-- Sub-tabs: the user workspace vs. the standalone Create fake member tool --}}
  <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
    <button
      class="mod-subtab active"
      data-subtab="users-main"
      aria-selected="true"
    >
      User
    </button>
    <button
      class="mod-subtab"
      data-subtab="users-create"
      aria-selected="false"
    >
      Create fake member
    </button>
  </div>

  {{-- USER: search + the chosen user's profile, one continuous card (search on top, profile beneath) --}}
  <div data-subpanel="users-main" data-preserve-form-state="1" class="space-y-6">
    <div data-users-workspace>
      <div class="mod-card space-y-5">

        {{-- Search / entry --}}
        <div>
          <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400">Find a user</label>
          <input
            data-users-search
            type="text"
            autocomplete="off"
            placeholder="Search by name, or paste a user ID"
            class="mt-2 w-full mod-input"
          />
          <p class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Pick a suggestion, or paste a numeric ID and press Enter.</p>
          <div data-users-recent class="mt-3 flex flex-wrap gap-2"></div>
        </div>

        {{-- Inline status views (within the same card) --}}
        <div data-view="loading" class="hidden border-t border-zinc-200/80 dark:border-white/10 pt-5 text-sm text-zinc-500 dark:text-zinc-400">Loading…</div>
        <div data-view="error" class="hidden border-t border-rose-300/60 dark:border-rose-500/30 pt-5 text-sm text-rose-700 dark:text-rose-300" data-users-error></div>

        {{-- Chosen user, flowing directly beneath the search in the same card --}}
        <div data-view="loaded" class="hidden space-y-5">
          @include('moderator.partials.users-profile')
        </div>
      </div>
    </div>
  </div>

  {{-- CREATE FAKE MEMBER: standalone, no existing user --}}
  <div data-subpanel="users-create" class="hidden space-y-6">
    <div class="mod-card">
      <h3 class="text-sm font-semibold">Create fake member</h3>
      <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Creates a placeholder member with no existing user.</p>
      <div class="mt-3 flex flex-wrap items-end gap-3">
        <input data-fake-name type="text" maxlength="64" placeholder="Fake Player"
          class="mod-input" />
        <button data-fake-submit type="button" class="mod-btn-primary">Create</button>
        <span data-fake-result class="text-sm font-mono text-emerald-600 dark:text-emerald-400"></span>
      </div>
    </div>
  </div>
</div>
