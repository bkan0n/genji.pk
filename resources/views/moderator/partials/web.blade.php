{{-- ============ DEVS (WEB) ============ --}}
<div data-panel="devs" class="mod-panel hidden space-y-4">
  <div data-web-workspace>
              <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="dev-cache-frameworks"
                  type="button"
                >
                  Cache: frameworks
                </button>

                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="dev-cache-avatars"
                  type="button"
                >
                  Cache: avatars
                </button>

                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="dev-cache-translations"
                  type="button"
                >
                  Cache: translations
                </button>

                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="dev-overpy-commit"
                  type="button"
                >
                  Overpy commit
                </button>

                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="dev-framework-version"
                  type="button"
                >
                  Framework version
                </button>
              </div>

              <div data-subpanel="dev-cache-frameworks" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Delete frameworks cache</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /api/mods/cache/frameworks/clear</span>
                  </div>
                  <form data-action="clear-frameworks-cache" autocomplete="off" class="space-y-3">
                    <p class="text-sm text-zinc-600 dark:text-zinc-300">
                      This will clear converter/framework caches.
                    </p>
                    <label class="flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2">
                      <input type="checkbox" name="confirm" class="accent-emerald-500" />
                      <span class="text-sm text-zinc-800 dark:text-zinc-200">I understand this may cause a short downtime.</span>
                    </label>
                    <button
                      class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                    >
                      Delete frameworks cache
                    </button>
                  </form>
                </article>
              </div>

              {{-- Subpanel: Delete avatars cache --}}
              <div data-subpanel="dev-cache-avatars" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Delete avatars cache</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /api/mods/cache/avatars/clear</span>
                  </div>
                  <form data-action="clear-avatars-cache" autocomplete="off" class="space-y-3">
                    <p class="text-sm text-zinc-600 dark:text-zinc-300">
                      Purge cached avatar images / URLs (e.g. CDN or local cached copies).
                    </p>
                    <label class="flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2">
                      <input type="checkbox" name="confirm" class="accent-emerald-500" />
                      <span class="text-sm text-zinc-800 dark:text-zinc-200">Confirm deletion of avatars cache.</span>
                    </label>
                    <button
                      class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                    >
                      Delete avatars cache
                    </button>
                  </form>
                </article>
              </div>

              {{-- Subpanel: Delete translations cache --}}
              <div data-subpanel="dev-cache-translations" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Delete translations cache</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /api/mods/cache/translations/clear</span>
                  </div>
                  <form data-action="clear-translations-cache" autocomplete="off" class="space-y-3">
                    <p class="text-sm text-zinc-600 dark:text-zinc-300">
                      Clear cached translation files/arrays. Useful after updating language files.
                    </p>
                    <label class="flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2">
                      <input type="checkbox" name="confirm" class="accent-emerald-500" />
                      <span class="text-sm text-zinc-800 dark:text-zinc-200">Yes, clear the translations cache.</span>
                    </label>
                    <button
                      class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                    >
                      Delete translations cache
                    </button>
                  </form>
                </article>
              </div>

              {{-- Subpanel: Set overpy commit --}}
              <div data-subpanel="dev-overpy-commit" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Set overpy commit</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">PATCH /api/mods/overpy-commit</span>
                  </div>

                  <!-- Current value -->
                  <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 px-3 py-2 text-sm">
                    <div class="text-[11px] text-zinc-500 dark:text-zinc-400">Current commit</div>
                    <div id="overpyCommitCurrent" class="mt-0.5 font-mono text-zinc-900 dark:text-zinc-100">—</div>
                  </div>

                  <form data-action="set-overpy-commit" autocomplete="off" class="space-y-3">
                    <p class="text-sm text-zinc-600 dark:text-zinc-300">
                      Change the <code class="font-mono">OVERPY_COMMIT</code> constant used by <code>converter.js</code>.
                    </p>

                    <label class="block text-sm text-zinc-600 dark:text-zinc-300">
                      New commit SHA (7–40 hex)
                      <input
                        type="text"
                        name="commit"
                        placeholder="e.g. dd8fc2d25459243053f8214478e13d85fda759af"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        required
                        pattern="^[a-fA-F0-9]{7,40}$"
                      />
                    </label>

                    <label class="flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2">
                      <input type="checkbox" name="confirm" id="confirm" class="accent-emerald-500" />
                      <span class="text-sm text-zinc-800 dark:text-zinc-200">
                        I understand this will update <code>OVERPY_COMMIT</code> in <code>converter.js</code>.
                      </span>
                    </label>

                    <button
                      class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                    >
                      Update commit
                    </button>
                  </form>
                </article>
              </div>

              {{-- Subpanel: Set framework version --}}
              <div data-subpanel="dev-framework-version" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Set framework version</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">PATCH /api/mods/framework-version</span>
                  </div>

                  <!-- Current value -->
                  <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 px-3 py-2 text-sm">
                    <div class="text-[11px] text-zinc-500 dark:text-zinc-400">Current version</div>
                    <div id="frameworkVersionCurrent" class="mt-0.5 font-mono text-zinc-900 dark:text-zinc-100">—</div>
                  </div>

                  <form id="formSetFrameworkVersion" data-action="set-framework-version" autocomplete="off" novalidate class="space-y-3">
                    <p class="text-sm text-zinc-600 dark:text-zinc-300">
                      Change the <code class="font-mono">genji-framework</code> CDN version used by
                      <code>converter.js</code>:<br>
                      <code class="font-mono">https://cdn.jsdelivr.net/gh/tylovejoy/genji-framework@VERSION/</code>
                    </p>

                    <label class="block text-sm text-zinc-600 dark:text-zinc-300">
                      New version (e.g. <code class="font-mono">1.10.4A</code>)
                      <input
                        type="text"
                        name="version"
                        placeholder="1.10.4A"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        required
                        autocapitalize="characters"
                        spellcheck="false"
                        aria-describedby="fwVersionHelp"
                      />
                    </label>
                    <p id="fwVersionHelp" class="text-xs text-zinc-500 dark:text-zinc-400">
                      Use <strong>X.Y.Z</strong> with an optional <strong>UPPERCASE</strong> suffix (e.g. <code>1.10.4</code>, <code>1.10.4A</code>, <code>1.10.4RC1</code>).
                    </p>

                    <label class="flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2">
                      <input type="checkbox" name="confirm" class="accent-emerald-500" />
                      <span class="text-sm text-zinc-800 dark:text-zinc-200">
                        I understand this will update the framework CDN URL in <code>converter.js</code>.
                      </span>
                    </label>

                    <button
                      id="btnSetFrameworkVersion"
                      type="button"
                      class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                    >
                      Update version
                    </button>
                  </form>
                </article>
              </div>

  </div>
</div>
