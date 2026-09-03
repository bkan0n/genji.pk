<div data-panel="content" class="mod-panel hidden space-y-4">
  <div data-content-workspace class="space-y-4">
    <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
      <button
        class="mod-subtab"
        data-subtab="content-categories"
      >
        Categories
      </button>
      <button
        class="mod-subtab"
        data-subtab="content-difficulties"
      >
        Difficulties
      </button>
      <button
        class="mod-subtab"
        data-subtab="content-techniques"
      >
        Techniques
      </button>
    </div>

    @foreach ([
      ['key' => 'categories', 'sub' => 'content-categories', 'singular' => 'category'],
      ['key' => 'difficulties', 'sub' => 'content-difficulties', 'singular' => 'difficulty'],
      ['key' => 'techniques', 'sub' => 'content-techniques', 'singular' => 'technique'],
    ] as $group)
      <div data-subpanel="{{ $group['sub'] }}" class="hidden space-y-4">
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-content-add="{{ $group['key'] }}"
            class="mod-btn-primary text-sm"
          >
            + Add {{ $group['singular'] }}
          </button>
          <button
            type="button"
            data-content-refresh="{{ $group['key'] }}"
            title="Refresh"
            aria-label="Refresh {{ $group['key'] }}"
            class="cursor-pointer rounded-xl border border-zinc-200/80 px-3 py-2 text-sm font-semibold transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/40 dark:border-white/10 dark:hover:bg-white/10"
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
      </div>
    @endforeach

    {{-- ===== Modal form templates (cloned by content-workspace.js) ===== --}}
    <template data-content-tpl="named">
      <form autocomplete="off" class="space-y-4">
        <input type="hidden" name="id" />
        <label class="block text-sm">
          Name
          <input
            name="name"
            class="mt-1 w-full mod-field"
            placeholder="Name"
          />
        </label>
      </form>
    </template>

    <template data-content-tpl="technique">
      <form autocomplete="off" class="grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="id" />
        <label class="text-sm sm:col-span-2">
          Name
          <input
            name="name"
            class="mt-1 w-full mod-field"
            placeholder="Wall Jump"
          />
        </label>
        <label class="text-sm sm:col-span-2">
          Description
          <textarea
            name="description"
            rows="3"
            class="mt-1 w-full mod-field"
            placeholder="Description (type null to clear)"
          ></textarea>
        </label>
        <label class="text-sm sm:col-span-2">
          Instructions
          <textarea
            name="instructions"
            rows="4"
            class="mt-1 w-full mod-field"
            placeholder="Instructions (type null to clear)"
          ></textarea>
        </label>
        <label class="text-sm">
          Category
          <div class="relative mt-1" data-dd-select data-content-options="categories" data-placeholder="No category" data-null-option="Clear category">
            <select name="category_id" class="hidden">
              <option value="">No category</option>
              <option value="null">Clear category</option>
            </select>
            <button
              type="button"
              data-dd-btn
              data-placeholder="No category"
              class="mod-dd-btn focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
            >
              <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">No category</span>
              <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </button>
            <div data-dd-list class="mod-dd-list hidden"></div>
          </div>
        </label>
        <label class="text-sm">
          Difficulty
          <div class="relative mt-1" data-dd-select data-content-options="difficulties" data-placeholder="No difficulty" data-null-option="Clear difficulty">
            <select name="difficulty_id" class="hidden">
              <option value="">No difficulty</option>
              <option value="null">Clear difficulty</option>
            </select>
            <button
              type="button"
              data-dd-btn
              data-placeholder="No difficulty"
              class="mod-dd-btn focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
            >
              <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">No difficulty</span>
              <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </button>
            <div data-dd-list class="mod-dd-list hidden"></div>
          </div>
        </label>
        <div class="text-sm sm:col-span-2 space-y-3" data-mt-current="tips">
          <div>
            <div>Current tips</div>
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
              <div>Tips</div>
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
            <div>Current videos</div>
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
              <div>Videos</div>
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
