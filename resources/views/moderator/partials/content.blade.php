<div data-panel="content" class="mod-panel hidden space-y-4">
  <div data-content-workspace class="space-y-4">
    <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
      <button
        class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
        data-subtab="content-categories"
      >
        Categories
      </button>
      <button
        class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
        data-subtab="content-difficulties"
      >
        Difficulties
      </button>
      <button
        class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
        data-subtab="content-techniques"
      >
        Techniques
      </button>
    </div>

    <div class="empty-state rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 text-zinc-600 dark:text-zinc-300">
      Choose a Content action group.
    </div>

    @foreach ([
      ['key' => 'categories', 'sub' => 'content-categories', 'singular' => 'category', 'out' => 'content-categories-res'],
      ['key' => 'difficulties', 'sub' => 'content-difficulties', 'singular' => 'difficulty', 'out' => 'content-difficulties-res'],
      ['key' => 'techniques', 'sub' => 'content-techniques', 'singular' => 'technique', 'out' => 'content-techniques-res'],
    ] as $group)
      <div data-subpanel="{{ $group['sub'] }}" class="hidden space-y-4">
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-content-add="{{ $group['key'] }}"
            class="cursor-pointer rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
          >
            + Add {{ $group['singular'] }}
          </button>
          <button
            type="button"
            data-content-refresh="{{ $group['key'] }}"
            title="Refresh"
            aria-label="Refresh {{ $group['key'] }}"
            class="cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 px-3 py-2 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-white/5"
          >
            &#x21bb;
          </button>
          <span
            data-content-count="{{ $group['key'] }}"
            class="inline-flex items-center rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-3 py-1 text-xs text-zinc-500 dark:text-zinc-300"
          >
            No items synced
          </span>
        </div>

        <div data-content-list="{{ $group['key'] }}" class="space-y-2"></div>

        <details class="rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/60 dark:bg-white/5 px-3 py-2">
          <summary class="cursor-pointer text-xs text-zinc-500 dark:text-zinc-400">Show raw response</summary>
          <pre data-out="{{ $group['out'] }}" class="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words text-xs text-zinc-600 dark:text-zinc-300"></pre>
        </details>
      </div>
    @endforeach

    {{-- ===== Modal form templates (cloned by content-workspace.js) ===== --}}
    <template data-content-tpl="named">
      <form autocomplete="off" class="space-y-4">
        <input type="hidden" name="id" />
        <label class="block text-sm">
          name
          <input
            name="name"
            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
            placeholder="Name"
          />
        </label>
      </form>
    </template>

    <template data-content-tpl="technique">
      <form autocomplete="off" class="grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="id" />
        <label class="text-sm sm:col-span-2">
          name
          <input
            name="name"
            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
            placeholder="Wall Jump"
          />
        </label>
        <label class="text-sm sm:col-span-2">
          description
          <textarea
            name="description"
            rows="3"
            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
            placeholder="Description (type null to clear)"
          ></textarea>
        </label>
        <label class="text-sm sm:col-span-2">
          instructions
          <textarea
            name="instructions"
            rows="4"
            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
            placeholder="Instructions (type null to clear)"
          ></textarea>
        </label>
        <label class="text-sm">
          category
          <div class="relative mt-1" data-dd-select data-content-options="categories" data-placeholder="No category" data-null-option="Clear category">
            <select name="category_id" class="hidden">
              <option value="">No category</option>
              <option value="null">Clear category</option>
            </select>
            <button
              type="button"
              data-dd-btn
              data-placeholder="No category"
              class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
            >
              <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">No category</span>
              <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </button>
            <div data-dd-list class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"></div>
          </div>
        </label>
        <label class="text-sm">
          difficulty
          <div class="relative mt-1" data-dd-select data-content-options="difficulties" data-placeholder="No difficulty" data-null-option="Clear difficulty">
            <select name="difficulty_id" class="hidden">
              <option value="">No difficulty</option>
              <option value="null">Clear difficulty</option>
            </select>
            <button
              type="button"
              data-dd-btn
              data-placeholder="No difficulty"
              class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
            >
              <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">No difficulty</span>
              <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </button>
            <div data-dd-list class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"></div>
          </div>
        </label>
        <div class="text-sm sm:col-span-2 space-y-3" data-mt-current="tips">
          <div>
            <div>current tips</div>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">Remove rows here to delete them on save. Kept rows stay in the final list.</p>
          </div>
          <div data-mt-current-empty class="rounded-xl border border-dashed border-zinc-200/80 dark:border-white/10 bg-zinc-100/60 dark:bg-white/5 px-3 py-3 text-xs text-zinc-500 dark:text-zinc-400">
            No tips in this technique.
          </div>
          <div data-mt-current-items class="space-y-2"></div>
        </div>
        <div class="text-sm sm:col-span-2 space-y-3" data-mt-repeater="tips">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div>tips</div>
              <p class="text-xs text-zinc-500 dark:text-zinc-400">Add one tip per row. Empty rows are ignored.</p>
            </div>
            <button type="button" data-mt-add="tips" class="rounded-xl border border-zinc-200/80 dark:border-white/10 px-3 py-2 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-white/10">
              Add tip
            </button>
          </div>
          <div data-mt-empty class="rounded-xl border border-dashed border-zinc-200/80 dark:border-white/10 bg-zinc-100/60 dark:bg-white/5 px-3 py-3 text-xs text-zinc-500 dark:text-zinc-400">
            No tips added yet.
          </div>
          <div data-mt-items class="space-y-3"></div>
        </div>
        <label data-mt-clear class="sm:col-span-2 inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <input type="checkbox" name="clear_tips" class="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500/60" />
          Start from an empty tips list before saving
        </label>
        <div class="text-sm sm:col-span-2 space-y-3" data-mt-current="videos">
          <div>
            <div>current videos</div>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">Remove rows here to delete them on save. Kept rows stay in the final list.</p>
          </div>
          <div data-mt-current-empty class="rounded-xl border border-dashed border-zinc-200/80 dark:border-white/10 bg-zinc-100/60 dark:bg-white/5 px-3 py-3 text-xs text-zinc-500 dark:text-zinc-400">
            No videos in this technique.
          </div>
          <div data-mt-current-items class="space-y-2"></div>
        </div>
        <div class="text-sm sm:col-span-2 space-y-3" data-mt-repeater="videos">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div>videos</div>
              <p class="text-xs text-zinc-500 dark:text-zinc-400">Caption is optional. Add rows in the order you want them returned.</p>
            </div>
            <button type="button" data-mt-add="videos" class="rounded-xl border border-zinc-200/80 dark:border-white/10 px-3 py-2 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-white/10">
              Add video
            </button>
          </div>
          <div data-mt-empty class="rounded-xl border border-dashed border-zinc-200/80 dark:border-white/10 bg-zinc-100/60 dark:bg-white/5 px-3 py-3 text-xs text-zinc-500 dark:text-zinc-400">
            No videos added yet.
          </div>
          <div data-mt-items class="space-y-3"></div>
        </div>
        <label data-mt-clear class="sm:col-span-2 inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <input type="checkbox" name="clear_videos" class="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500/60" />
          Start from an empty videos list before saving
        </label>
      </form>
    </template>
  </div>
</div>
