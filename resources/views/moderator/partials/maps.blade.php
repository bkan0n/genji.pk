<div data-panel="maps" class="mod-panel hidden space-y-4">
  <div data-maps-workspace class="space-y-6">
    <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 p-4 sm:p-5 space-y-5">
      <div>
        <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400">Find a map</label>
        <input
          data-maps-search
          type="text"
          autocomplete="off"
          placeholder="Search by map code (e.g. 01AZC)"
          class="mt-2 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
        />
        <p class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Type a map code and press Enter, or pick a suggestion.</p>
        <div data-maps-recent class="mt-3 flex flex-wrap gap-2"></div>
      </div>

      <div data-view="loading" class="hidden border-t border-zinc-200/80 dark:border-white/10 pt-5 text-sm text-zinc-500">Loading…</div>
      <div data-view="error" class="hidden border-t border-red-300/60 dark:border-red-500/30 pt-5 text-sm text-red-700 dark:text-red-300" data-maps-error></div>

      <div data-view="loaded" class="hidden space-y-5">
        @include('moderator.partials.maps-profile')
      </div>
    </div>

    {{-- Separate creation tool: submit a brand-new map (works with no loaded map). --}}
    <details data-maps-submit-tool class="rounded-2xl border border-dashed border-zinc-300/70 dark:border-white/10 bg-white/30 dark:bg-zinc-950/30 p-4 sm:p-5">
      <summary class="cursor-pointer select-none text-sm font-semibold">＋ Submit new map</summary>
      <div data-maps-submit-mount class="mt-3">
        <div data-subpanel="maps-submit">
          <form
            id="submitMapForm"
            data-action="submit-map"
            autocomplete="off"
            class="space-y-6"
          >
            <!-- META -->
            <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 p-4">
              <div class="grid gap-4 sm:grid-cols-2">
                <!-- Creators -->
                <div class="sm:col-span-2">
                  <span class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Creator</span>
                  <div id="metaCreatorsCol" class="flex flex-wrap items-center gap-2">
                    <!-- Primary -->
                    <span
                      class="main-creator-row inline-flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-1.5"
                    >
                      <span
                        id="metaCreatorMain"
                        class="text-sm text-zinc-800 dark:text-zinc-200"
                        data-raw-id=""
                      >
                        N/A
                      </span>
                      <button
                        type="button"
                        class="block-edit-btn cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-white/10"
                        data-edit-target="metaCreatorMain"
                      >
                        Edit
                      </button>
                    </span>

                    <!-- Secondary (même système que primary) -->
                    <span
                      class="secondary-creator-row inline-flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-1.5"
                    >
                      <span
                        id="metaCreatorSecond"
                        class="text-sm text-zinc-800 dark:text-zinc-200"
                        data-raw-id=""
                      >
                        N/A
                      </span>
                      <button
                        type="button"
                        class="block-edit-btn cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-white/10"
                        data-edit-target="metaCreatorSecond"
                      >
                        Edit
                      </button>
                    </span>
                  </div>
                </div>

                <!-- Map Code -->
                <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2">
                  <div class="text-[11px] text-zinc-500 dark:text-zinc-400">Code</div>
                  <div class="flex items-center gap-2">
                    <div id="metaCode" class="text-sm text-zinc-800 dark:text-zinc-200" data-ac="off">N/A</div>
                    <button
                      type="button"
                      class="block-edit-btn cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-white/10"
                      data-edit-target="metaCode"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                <!-- Map Name -->
                <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2">
                  <div class="text-[11px] text-zinc-500 dark:text-zinc-400">Map name</div>
                  <div class="flex items-center gap-2">
                    <div id="metaMap" class="text-sm text-zinc-800 dark:text-zinc-200">N/A</div>
                    <button
                      type="button"
                      class="block-edit-btn cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-white/10"
                      data-edit-target="metaMap"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                <!-- Checkpoints -->
                <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2">
                  <div class="text-[11px] text-zinc-500 dark:text-zinc-400">Checkpoints</div>
                  <div class="flex items-center gap-2">
                    <div id="metaCheckpoints" class="text-sm text-zinc-800 dark:text-zinc-200">N/A</div>
                    <button
                      type="button"
                      class="block-edit-btn cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-white/10"
                      data-edit-target="metaCheckpoints"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- REQUIRED -->
            <div class="space-y-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 p-4">
              <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Required</h3>

              <div class="grid gap-4 sm:grid-cols-2">
                <!-- Difficulty (radio) -->
                <div>
                  <label class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Select difficulty</label>
                  <div id="difficultyDropdown" class="relative">
                    <button
                      type="button"
                      data-dd-btn
                      class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left"
                    >
                      <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Select difficulty</span>
                      <svg
                        class="h-4 w-4 text-zinc-500 dark:text-zinc-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        />
                      </svg>
                    </button>
                    <div
                      data-dd-list
                      class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"
                    ></div>
                  </div>
                </div>

                <!-- Category (radio) -->
                <div>
                  <label class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Select category</label>
                  <div id="categoryDropdown" class="relative">
                    <button
                      type="button"
                      data-dd-btn
                      class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left"
                    >
                      <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Select category</span>
                      <svg
                        class="h-4 w-4 text-zinc-500 dark:text-zinc-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        />
                      </svg>
                    </button>
                    <div
                      data-dd-list
                      class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"
                    ></div>
                  </div>
                </div>

                <!-- Mechanics (checkboxes) -->
                <div>
                  <label class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Select mechanics</label>
                  <div id="mechanicsDropdown" class="relative">
                    <button
                      type="button"
                      data-dd-btn
                      class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left"
                    >
                      <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Select mechanics</span>
                      <svg
                        class="h-4 w-4 text-zinc-500 dark:text-zinc-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        />
                      </svg>
                    </button>
                    <div
                      data-dd-list
                      class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"
                    ></div>
                  </div>
                </div>

                <!-- Restrictions (checkboxes) -->
                <div>
                  <label class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">
                    Select restrictions
                  </label>
                  <div id="restrictionsDropdown" class="relative">
                    <button
                      type="button"
                      data-dd-btn
                      class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left"
                    >
                      <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">
                        Select restrictions
                      </span>
                      <svg
                        class="h-4 w-4 text-zinc-500 dark:text-zinc-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        />
                      </svg>
                    </button>
                    <div
                      data-dd-list
                      class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- FLAGS -->
            <div class="space-y-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 p-4">
              <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Flags</h3>
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <label class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Select tags</label>
                  <div id="tagsDropdown" class="relative">
                    <button
                      type="button"
                      data-dd-btn
                      class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left"
                    >
                      <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Select tags</span>
                      <svg
                        class="h-4 w-4 text-zinc-500 dark:text-zinc-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                    <div
                      data-dd-list
                      class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- OPTIONAL -->
            <div class="space-y-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 p-4">
              <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Optional</h3>

              <div class="grid gap-4 sm:grid-cols-2">
                <!-- Title -->
                <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2">
                  <label class="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400" for="optTitleInput">
                    Title
                  </label>
                  <input
                    id="optTitleInput"
                    type="text"
                    maxlength="128"
                    class="w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                    placeholder="Optional short title (max 128 chars)"
                  />
                </div>

                <!-- Custom banner -->
                <div>
                  <div class="mb-1 text-[11px] text-zinc-500 dark:text-zinc-400">Custom banner</div>
                  <div
                    id="bannerDrop"
                    class="group relative flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-200/80 dark:border-white/15 bg-white/60 dark:bg-zinc-900/60"
                  >
                    <input id="bannerInput" type="file" accept="image/*" class="hidden" />
                    <div
                      id="bannerPlaceholder"
                      class="px-3 text-center text-sm text-zinc-600 dark:text-zinc-300 select-none"
                    >
                      Drag & drop or click to upload
                      <div class="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                        Recommended 16:9. JPG/PNG/WebP/AVIF, max 8MB.
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-[11px] text-zinc-500 dark:text-zinc-400">Description</div>
                      <div id="optDescription" class="text-sm text-zinc-800 dark:text-zinc-200">N/A</div>
                    </div>
                    <button
                      type="button"
                      class="block-edit-btn cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-white/10"
                      data-edit-target="optDescription"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                <!-- Guide URLs -->
                <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-[11px] text-zinc-500 dark:text-zinc-400">Guide (URL)</div>
                      <div id="optGuide" class="text-sm text-zinc-800 dark:text-zinc-200">N/A</div>
                    </div>
                    <button
                      type="button"
                      class="block-edit-btn cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-white/10"
                      data-edit-target="optGuide"
                    >
                      Edit
                    </button>
                  </div>
                  <p class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    One URL per line; first valid URL is used.
                  </p>
                </div>

                <!-- Medals -->
                <div
                  class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2 sm:col-span-2"
                >
                  <div class="mb-2 text-[11px] text-zinc-500 dark:text-zinc-400">Medals</div>
                  <div class="grid gap-3 sm:grid-cols-3">
                    <label class="flex items-center gap-2">
                      <span class="inline-flex min-w-0 items-center gap-2">
                        <span class="text-sm text-zinc-800 dark:text-zinc-200">🥇 Gold</span>
                      </span>
                      <input
                        id="medalGoldInput"
                        type="text"
                        inputmode="decimal"
                        pattern="\\d{1,5}(?:\\.\\d{1,2})?"
                        placeholder="e.g. 5550.23"
                        class="w-40 shrink-0 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>

                    <label class="flex items-center gap-2">
                      <span class="inline-flex min-w-0 items-center gap-2">
                        <span class="text-sm text-zinc-800 dark:text-zinc-200">🥈 Silver</span>
                      </span>
                      <input
                        id="medalSilverInput"
                        type="text"
                        inputmode="decimal"
                        pattern="\\d{1,5}(?:\\.\\d{1,2})?"
                        placeholder="e.g. 7599.33"
                        class="w-40 shrink-0 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>

                    <label class="flex items-center gap-2">
                      <span class="inline-flex min-w-0 items-center gap-2">
                        <span class="text-sm text-zinc-800 dark:text-zinc-200">🥉 Bronze</span>
                      </span>
                      <input
                        id="medalBronzeInput"
                        type="text"
                        inputmode="decimal"
                        pattern="\\d{1,5}(?:\\.\\d{1,2})?"
                        placeholder="e.g. 8066.75"
                        class="w-40 shrink-0 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                  </div>
                  <p class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    Format: max 5 digits before the decimal and up to 2 after. Values ≥ 0.
                    Required order: bronze &gt; silver &gt; gold.
                  </p>
                </div>
              </div>
            </div>

            <!-- ACTION BAR -->
            <div class="flex items-center gap-2">
              <button
                type="submit"
                class="inline-flex cursor-pointer items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
              >
                Submit map
              </button>
              <button
                type="button"
                class="cancel-btn inline-flex cursor-pointer items-center justify-center rounded-lg border border-zinc-200/80 dark:border-white/10 px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </details>
  </div>
</div>
