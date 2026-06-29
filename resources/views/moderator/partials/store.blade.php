{{-- ============ STORE ============ --}}
<div data-panel="store" class="mod-panel hidden space-y-4">
  <div data-store-workspace class="space-y-4">

    {{-- Card: Configuration (auto-loads on tab entry) --}}
    <article data-store-config class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 class="font-semibold">Configuration</h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-400">Live store config — loads automatically, edit in place, then save.</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-zinc-500 dark:text-zinc-400">GET + PUT /mods/store/config</span>
          <button
            type="button"
            data-store-refresh
            title="Reload current config"
            class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-2 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/70 dark:hover:bg-white/10"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {{-- Loading state --}}
      <div data-view="loading" class="hidden text-sm text-zinc-500 dark:text-zinc-400">
        Loading store config…
      </div>

      {{-- Error state --}}
      <div data-view="error" class="hidden space-y-3">
        <p class="text-sm text-rose-500" data-store-error-msg>Failed to load store config</p>
        <button
          type="button"
          data-store-retry
          class="rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/70 dark:hover:bg-white/10"
        >
          Retry
        </button>
      </div>

      {{-- Loaded state: the editable form --}}
      <div data-view="loaded" class="hidden">
        <form data-action="store-update-config" data-form-ux="1" autocomplete="off" class="grid gap-4 sm:grid-cols-2">
          <label class="sm:col-span-1 text-sm">
            Rotation period (days)
            <input
              name="rotation_period_days"
              type="number"
              min="1"
              max="3650"
              step="1"
              class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
              placeholder="7"
            />
          </label>

          <label class="sm:col-span-1 text-sm">
            Active key type
            <div class="relative mt-1" data-dd-select data-dd-field="active_key_type">
              <button
                type="button"
                data-dd-btn
                data-placeholder="Select a key type"
                aria-haspopup="listbox"
                aria-expanded="false"
                class="flex w-full items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
              >
                <span class="dd-label truncate">Select a key type</span>
                <span aria-hidden="true" class="ml-2 text-zinc-400">▾</span>
              </button>
              <div
                data-dd-list
                role="listbox"
                class="hidden absolute z-20 mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 p-1 shadow-lg"
              >
                <label class="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                  <input type="radio" name="active_key_type" value="Classic" data-label="Classic" class="accent-emerald-500" />
                  <span>Classic</span>
                </label>
                <label class="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                  <input type="radio" name="active_key_type" value="Winter" data-label="Winter" class="accent-emerald-500" />
                  <span>Winter</span>
                </label>
                <label class="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                  <input type="radio" name="active_key_type" value="Autumn" data-label="Autumn" class="accent-emerald-500" />
                  <span>Autumn</span>
                </label>
                <label class="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                  <input type="radio" name="active_key_type" value="Spring" data-label="Spring" class="accent-emerald-500" />
                  <span>Spring</span>
                </label>
                <label class="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                  <input type="radio" name="active_key_type" value="Summer" data-label="Summer" class="accent-emerald-500" />
                  <span>Summer</span>
                </label>
              </div>
            </div>
          </label>

          <div class="sm:col-span-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              data-store-save
              disabled
              class="shrink-0 cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save changes
            </button>
            <span data-store-dirty class="hidden inline-flex items-center gap-1.5 text-xs text-amber-500">
              <span aria-hidden="true">●</span> Unsaved changes
            </span>
          </div>
        </form>
      </div>
    </article>

    {{-- Card: Generate rotation --}}
    <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 class="font-semibold">Generate rotation</h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-400">Creates a new live store rotation, replacing the current one.</p>
        </div>
        <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /mods/store/rotation/generate</span>
      </div>

      <form data-action="store-generate-rotation" data-form-ux="1" autocomplete="off" class="grid gap-4 sm:grid-cols-2">
        <label class="sm:col-span-1 text-sm">
          Items in rotation
          <input
            name="item_count"
            type="number"
            min="1"
            max="100"
            step="1"
            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
            placeholder="8"
            required
          />
        </label>

        <div class="sm:col-span-2">
          <button
            type="submit"
            class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
          >
            Generate →
          </button>
        </div>
      </form>
    </article>

  </div>
</div>
