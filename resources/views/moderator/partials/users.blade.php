<div data-panel="users" class="mod-panel space-y-4">
  {{-- Sub-tabs: the user workspace vs. the standalone Create fake member tool --}}
  <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
    <button
      class="mod-subtab active rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-900/5 dark:bg-white/10 px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
      data-subtab="users-main"
      aria-selected="true"
    >
      User
    </button>
    <button
      class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
      data-subtab="users-create"
      aria-selected="false"
    >
      Create fake member
    </button>
  </div>

  {{-- USER: find a user, with the chosen user's profile flowing directly beneath, as one section --}}
  <div data-subpanel="users-main" data-preserve-form-state="1" class="space-y-6">
    <div data-users-workspace class="space-y-6">

      {{-- Search / entry --}}
      <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 p-4 sm:p-5">
        <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400">Find a user</label>
        <input
          data-users-search
          type="text"
          autocomplete="off"
          placeholder="Search by name, or paste a user ID"
          class="mt-2 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
        />
        <p class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Pick a suggestion, or paste a numeric ID and press Enter.</p>
        <div data-users-recent class="mt-3 flex flex-wrap gap-2"></div>
      </div>

      {{-- Views --}}
      <div data-view="loading" class="hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 p-6 text-sm text-zinc-500">Loading…</div>
      <div data-view="error" class="hidden rounded-2xl border border-red-300/60 dark:border-red-500/30 bg-red-50/60 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-300" data-users-error></div>

      <div data-view="loaded" class="hidden space-y-6">
        @include('moderator.partials.users-profile')
      </div>
    </div>
  </div>

  {{-- CREATE FAKE MEMBER: standalone, no existing user --}}
  <div data-subpanel="users-create" class="hidden space-y-6">
    <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 p-4 sm:p-5">
      <h3 class="text-sm font-semibold">Create fake member</h3>
      <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Creates a placeholder member with no existing user.</p>
      <div class="mt-3 flex flex-wrap items-end gap-3">
        <input data-fake-name type="text" maxlength="64" placeholder="Fake Player"
          class="rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/60" />
        <button data-fake-submit type="button"
          class="rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100">Create</button>
        <span data-fake-result class="text-sm font-mono text-emerald-600 dark:text-emerald-400"></span>
      </div>
    </div>
  </div>
</div>
