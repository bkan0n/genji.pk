<div data-maps-profile class="space-y-6">
  {{-- A. Identity header (read-only anchor) --}}
  <div class="flex flex-wrap items-start justify-between gap-3">
    <div class="min-w-0">
      <div data-field-view="map_name" class="truncate text-xl font-semibold">—</div>
      <div class="mt-1 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <span data-field-view="code" class="font-mono">—</span>
        <button type="button" data-copy-code class="rounded-md border border-zinc-200/80 dark:border-white/10 px-1.5 py-0.5 text-xs hover:bg-zinc-100 dark:hover:bg-white/10">Copy</button>
      </div>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <span data-chip="difficulty" class="hidden rounded-full bg-zinc-900/5 dark:bg-white/10 px-2.5 py-1 text-xs"></span>
      <span data-chip="category" class="hidden rounded-full bg-zinc-900/5 dark:bg-white/10 px-2.5 py-1 text-xs"></span>
      <span data-badge="archived" class="hidden rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2.5 py-1 text-xs">Archived</span>
      <span data-badge="official" class="hidden rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 text-xs">Official</span>
      <span data-badge="hidden" class="hidden rounded-full bg-zinc-500/15 px-2.5 py-1 text-xs">Hidden</span>
    </div>
  </div>

  {{-- Map actions (collapsed; positioned directly under the identity header) --}}
  <details data-maps-actions class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40">
    <summary class="cursor-pointer select-none px-4 py-3 text-sm font-semibold">Map actions</summary>
    <div class="space-y-3 border-t border-zinc-200/80 dark:border-white/10 p-4">
      <div class="flex flex-wrap items-center gap-2">
        <button type="button" data-action-archive class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">Archive / Unarchive</button>
        <button type="button" data-action-editrequest class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">Create edit request</button>
        <button type="button" data-action-release class="rounded-lg border border-rose-300/60 px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300">Release map code</button>
      </div>
      <div class="flex flex-wrap items-end gap-2 border-t border-zinc-200/80 dark:border-white/10 pt-3">
        <label class="flex-1 min-w-[12rem] text-xs text-zinc-500 dark:text-zinc-400">Reason (for convert)
          <input data-convert-reason type="text" class="mt-1 w-full rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-white/10 dark:bg-zinc-900" />
        </label>
        <button type="button" data-action-convert class="rounded-lg border border-amber-300/60 px-3 py-1.5 text-sm text-amber-700 dark:text-amber-300 hover:bg-amber-500/10">Convert to legacy</button>
      </div>
      <div class="flex flex-wrap items-end gap-2 border-t border-zinc-200/80 dark:border-white/10 pt-3">
        <label class="flex-1 min-w-[10rem] text-xs text-zinc-500 dark:text-zinc-400">Override quality
          <select data-quality-select class="mt-1 w-full rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-white/10 dark:bg-zinc-900">
            <option value="">Select quality (1–6)…</option>
            <option value="1">1 – Lowest</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6 – Highest</option>
          </select>
        </label>
        <button type="button" data-action-quality class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">Apply quality</button>
      </div>
    </div>
  </details>

  {{-- B. Map fields --}}
  <div data-maps-fields class="space-y-6">
    <div data-subpanel="maps-update">
                  <form
                    id="u-updateMapForm"
                    data-action="update-map"
                    autocomplete="off"
                    class="mt-6 space-y-6"
                  >
                    <!-- META -->
                    <div class="mod-form-card">
                      <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Creators -->
                        <div class="sm:col-span-2">
                          <span class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Creator</span>
                          <div id="u-metaCreatorsCol" class="flex flex-wrap items-center gap-2">
                            <!-- Primary -->
                            <span
                              class="main-creator-row inline-flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-1.5"
                            >
                              <span
                                id="u-metaCreatorMain"
                                class="text-sm text-zinc-800 dark:text-zinc-200"
                                data-raw-id=""
                              >
                                N/A
                              </span>
                              <button
                                type="button"
                                class="block-edit-btn"
                                data-edit-target="u-metaCreatorMain"
                              >
                                Edit
                              </button>
                            </span>

                            <!-- Secondary (same display as primary) -->
                            <span
                              class="secondary-creator-row inline-flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-1.5"
                            >
                              <span
                                id="u-metaCreatorSecond"
                                class="text-sm text-zinc-800 dark:text-zinc-200"
                                data-raw-id=""
                              >
                                N/A
                              </span>
                              <button
                                type="button"
                                class="block-edit-btn"
                                data-edit-target="u-metaCreatorSecond"
                              >
                                Edit
                              </button>
                            </span>
                          </div>
                        </div>

                        <!-- Map Code -->
                        <div class="mod-meta-card">
                          <div class="text-[11px] text-zinc-500 dark:text-zinc-400">Code</div>
                          <div class="flex items-center gap-2">
                            <div id="u-metaCode" class="text-sm text-zinc-800 dark:text-zinc-200">N/A</div>
                            <button
                              type="button"
                              class="block-edit-btn"
                              data-edit-target="u-metaCode"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        <!-- Map Name -->
                        <div class="mod-meta-card">
                          <div class="text-[11px] text-zinc-500 dark:text-zinc-400">Map name</div>
                          <div class="flex items-center gap-2">
                            <div id="u-metaMap" class="text-sm text-zinc-800 dark:text-zinc-200">N/A</div>
                            <button
                              type="button"
                              class="block-edit-btn"
                              data-edit-target="u-metaMap"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        <!-- Checkpoints -->
                        <div class="mod-meta-card">
                          <div class="text-[11px] text-zinc-500 dark:text-zinc-400">Checkpoints</div>
                          <div class="flex items-center gap-2">
                            <div id="u-metaCheckpoints" class="text-sm text-zinc-800 dark:text-zinc-200">N/A</div>
                            <button
                              type="button"
                              class="block-edit-btn"
                              data-edit-target="u-metaCheckpoints"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- REQUIRED -->
                    <div class="space-y-4 mod-form-card">
                      <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Required</h3>

                      <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Difficulty -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Select difficulty</label>
                          <div id="u-difficultyDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="mod-dd-btn"
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
                              class="mod-dd-list"
                            ></div>
                          </div>
                        </div>

                        <!-- Category -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Select category</label>
                          <div id="u-categoryDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="mod-dd-btn"
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
                              class="mod-dd-list"
                            ></div>
                          </div>
                        </div>

                        <!-- Mechanics -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Select mechanics</label>
                          <div id="u-mechanicsDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="mod-dd-btn"
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
                              class="mod-dd-list"
                            ></div>
                          </div>
                        </div>

                        <!-- Restrictions -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">
                            Select restrictions
                          </label>
                          <div id="u-restrictionsDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="mod-dd-btn"
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
                              class="mod-dd-list"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- FLAGS & REVIEW -->
                    <div class="space-y-4 mod-form-card">
                      <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Flags</h3>
                      <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Hidden -->
                        <label
                          class="flex items-center gap-2 mod-meta-card"
                        >
                          <input id="u-flagHidden" type="checkbox" class="accent-emerald-500" />
                          <span class="text-sm text-zinc-800 dark:text-zinc-200">Hidden</span>
                        </label>

                        <!-- Archived -->
                        <label
                          class="flex items-center gap-2 mod-meta-card"
                        >
                          <input id="u-flagArchived" type="checkbox" class="accent-emerald-500" />
                          <span class="text-sm text-zinc-800 dark:text-zinc-200">Archived</span>
                        </label>

                        <!-- Official -->
                        <label
                          class="flex items-center gap-2 mod-meta-card"
                        >
                          <input id="u-flagOfficial" type="checkbox" class="accent-emerald-500" />
                          <span class="text-sm text-zinc-800 dark:text-zinc-200">Official</span>
                        </label>

                        <!-- Playtesting -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Playtesting</label>
                          <div id="u-playtestingDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="mod-dd-btn"
                            >
                              <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Select playtesting</span>
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
                              class="mod-dd-list"
                            ></div>
                          </div>
                        </div>

                        <div class="sm:col-span-2">
                          <label class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Select tags</label>
                          <div id="u-tagsDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="mod-dd-btn"
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
                              class="mod-dd-list"
                            ></div>
                          </div>
                        </div>

                      </div>
                    </div>

                    <!-- OPTIONAL -->
                    <div class="space-y-4 mod-form-card">
                      <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Optional</h3>

                      <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Title -->
                        <div class="mod-meta-card">
                          <label class="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400" for="u-optTitleInput">
                            Title
                          </label>
                          <input
                            id="u-optTitleInput"
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
                            id="u-bannerDrop"
                            class="group relative flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-200/80 dark:border-white/15 bg-white/60 dark:bg-zinc-900/60"
                          >
                            <input id="u-bannerInput" type="file" accept="image/*" class="hidden" />
                            <div
                              id="u-bannerPlaceholder"
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
                        <div class="mod-meta-card">
                          <div class="flex items-center justify-between">
                            <div>
                              <div class="text-[11px] text-zinc-500 dark:text-zinc-400">Description</div>
                              <div id="u-optDescription" class="text-sm text-zinc-800 dark:text-zinc-200">N/A</div>
                            </div>
                            <button
                              type="button"
                              class="block-edit-btn"
                              data-edit-target="u-optDescription"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        <!-- Medals -->
                        <div
                          class="mod-meta-card sm:col-span-2"
                        >
                          <div class="mb-2 text-[11px] text-zinc-500 dark:text-zinc-400">Medals</div>
                          <div class="grid gap-3 sm:grid-cols-3">
                            <label class="flex items-center gap-2">
                              <span class="inline-flex min-w-0 items-center gap-2">
                                <span class="text-sm text-zinc-800 dark:text-zinc-200">🥇 Gold</span>
                              </span>
                              <input
                                id="u-medalGoldInput"
                                type="text"
                                inputmode="decimal"
                                pattern="\d{1,5}(?:\.\d{1,2})?"
                                placeholder="e.g. 5550.23"
                                class="w-40 shrink-0 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                              />
                            </label>

                            <label class="flex items-center gap-2">
                              <span class="inline-flex min-w-0 items-center gap-2">
                                <span class="text-sm text-zinc-800 dark:text-zinc-200">🥈 Silver</span>
                              </span>
                              <input
                                id="u-medalSilverInput"
                                type="text"
                                inputmode="decimal"
                                pattern="\d{1,5}(?:\.\d{1,2})?"
                                placeholder="e.g. 7599.33"
                                class="w-40 shrink-0 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                              />
                            </label>

                            <label class="flex items-center gap-2">
                              <span class="inline-flex min-w-0 items-center gap-2">
                                <span class="text-sm text-zinc-800 dark:text-zinc-200">🥉 Bronze</span>
                              </span>
                              <input
                                id="u-medalBronzeInput"
                                type="text"
                                inputmode="decimal"
                                pattern="\d{1,5}(?:\.\d{1,2})?"
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
                  </form>
    </div>

    {{-- Module-owned sticky Save/Reset bar --}}
    <div data-fields-bar class="sticky bottom-4 z-10 mt-4 hidden flex items-center justify-end gap-2 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-zinc-950/90 px-4 py-2 shadow-lg backdrop-blur">
      <span class="mr-auto text-xs text-zinc-500 dark:text-zinc-400">Unsaved changes</span>
      <button type="button" data-fields-reset class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">Reset</button>
      <button type="button" data-fields-save class="mod-btn-accent px-3 py-1.5">Save changes</button>
    </div>
  </div>
  {{-- C. Guides --}}
  <div data-maps-guides class="mod-card space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold">Guides</h3>
      <span data-guides-count class="text-xs text-zinc-500 dark:text-zinc-400"></span>
    </div>
    <div data-guides-list class="space-y-2"></div>
    <form data-guides-add class="flex flex-wrap items-end gap-2 border-t border-zinc-200/80 dark:border-white/10 pt-3">
      <label class="flex-1 min-w-[12rem] text-xs text-zinc-500 dark:text-zinc-400">Creator
        <input name="user_id" type="text" autocomplete="off" placeholder="Search creator…" class="mt-1 w-full rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-white/10 dark:bg-zinc-900" />
      </label>
      <label class="flex-[2] min-w-[14rem] text-xs text-zinc-500 dark:text-zinc-400">Guide URL
        <input name="url" type="url" placeholder="https://…" class="mt-1 w-full rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-white/10 dark:bg-zinc-900" />
      </label>
      <button class="mod-btn-primary px-3 py-2">+ Add guide</button>
    </form>
  </div>
</div>
