{{-- Identity header (read-only) — first divider separates it from the search above --}}
<div class="border-t border-zinc-200/80 dark:border-white/10 pt-5">
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div>
      <div data-field-view="coalesced_name" class="text-2xl font-black tracking-tight">—</div>
      <button data-copy-id type="button" class="mt-1 inline-flex items-center gap-1 rounded-md text-xs font-mono text-zinc-500 hover:text-zinc-800 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/40 dark:text-zinc-400 dark:hover:text-zinc-200">
        <span data-field-view="id">—</span><span aria-hidden="true">⧉</span>
      </button>
    </div>
    <div class="rounded-xl bg-emerald-500/15 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
      <span data-field-view="coins">0</span> coins
    </div>
  </div>
</div>

{{-- Names --}}
<div class="border-t border-zinc-200/80 dark:border-white/10 pt-5">
  <div class="flex items-center justify-between">
    <h3 class="text-sm font-semibold">Names</h3>
    <span data-dirty="names" class="hidden text-xs text-amber-600 dark:text-amber-400">Unsaved</span>
  </div>
  <div class="mt-3 grid gap-3 sm:grid-cols-2">
    <label class="block text-xs text-zinc-500 dark:text-zinc-400">Global name
      <input data-field="global_name" type="text" maxlength="100" class="mt-1 w-full mod-input" />
    </label>
    <label class="block text-xs text-zinc-500 dark:text-zinc-400">Nickname
      <input data-field="nickname" type="text" maxlength="100" class="mt-1 w-full mod-input" />
    </label>
  </div>
  <div class="mt-3 flex gap-2">
    <button data-save="names" type="button" disabled class="mod-btn-primary">Save names</button>
    <button data-reset="names" type="button" class="rounded-xl border border-zinc-200/80 px-4 py-2 text-sm transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/40 dark:border-white/10 dark:hover:bg-white/10">Reset</button>
  </div>
</div>

{{-- Overwatch aliases --}}
<div class="border-t border-zinc-200/80 dark:border-white/10 pt-5">
  <div class="flex items-center justify-between">
    <h3 class="text-sm font-semibold">Overwatch aliases</h3>
    <span data-dirty="aliases" class="hidden text-xs text-amber-600 dark:text-amber-400">Unsaved</span>
  </div>
  <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Saving replaces all aliases. Star marks the primary (exactly one).</p>
  <div class="mt-3 space-y-2">
    @for ($i = 0; $i < 3; $i++)
    <div data-alias-row class="flex items-center gap-2">
      <button data-alias-primary type="button" aria-label="Mark primary" data-primary="false" class="rounded-md text-lg text-zinc-400 transition hover:text-amber-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/40 data-[primary=true]:text-amber-500 dark:text-zinc-500 dark:hover:text-amber-400 dark:data-[primary=true]:text-amber-400">★</button>
      <input data-alias-name type="text" maxlength="64" placeholder="Overwatch username"
        class="w-full mod-input" />
    </div>
    @endfor
  </div>
  <div class="mt-3 flex gap-2">
    <button data-save="aliases" type="button" disabled class="mod-btn-primary">Save aliases</button>
    <button data-reset="aliases" type="button" class="rounded-xl border border-zinc-200/80 px-4 py-2 text-sm transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/40 dark:border-white/10 dark:hover:bg-white/10">Reset</button>
  </div>
</div>

{{-- Link --}}
<div class="border-t border-zinc-200/80 dark:border-white/10 pt-5">
  <h3 class="text-sm font-semibold">Link account</h3>
  <div class="mt-3 flex flex-wrap items-end gap-2">
    <label class="block text-xs text-zinc-500 dark:text-zinc-400">This user is the
      <select data-link-direction class="mt-1 block mod-input">
        <option value="real">real account</option>
        <option value="fake">fake account</option>
      </select>
    </label>
    <label class="block flex-1 text-xs text-zinc-500 dark:text-zinc-400">Other account
      <input data-link-other type="text" autocomplete="off" placeholder="Search the other account"
        class="mt-1 w-full mod-input" />
    </label>
    <button data-link-submit type="button" class="mod-btn-primary">Link…</button>
  </div>
</div>
