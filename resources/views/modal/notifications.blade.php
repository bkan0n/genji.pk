{{-- Settings Modal (overlay + carte) --}}
<div id="gp-settings-modal" class="fixed inset-0 z-[130] hidden">
  <button
    id="gp-settings-backdrop"
    class="absolute inset-0 bg-black/70"
    aria-label="{{ __('modals.settings.close') }}"
  ></button>

  <div class="relative z-10 flex min-h-full">
    <div class="mx-auto w-full max-w-lg px-4 pt-24">
      <div
        id="gp-settings-card"
        class="pointer-events-auto scale-95 opacity-0 transition duration-200 ease-out"
        data-modal-box
      >
        {{-- ====== Carte Settings ====== --}}
        <article
          class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-2xl backdrop-blur"
        >
          <header class="flex items-center justify-center px-5 pt-5 pb-3">
            <h2 class="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              {{ __('modals.settings.title') }}
            </h2>
          </header>

          <div class="px-4 pb-5 sm:px-5">
            <div
              role="tablist"
              aria-label="Settings Tabs"
              class="mb-4 flex items-center justify-center gap-2"
            >
              <button
                type="button"
                class="settings-tab inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-medium text-zinc-100 ring-0 hover:bg-white/5 data-[active=true]:bg-white data-[active=true]:text-zinc-900 data-[active=true]:hover:bg-white data-[active=true]:hover:text-zinc-900"
                data-target="overwatch-section"
                data-active="true"
                aria-selected="true"
                role="tab"
                id="tab-overwatch"
              >
                {{ __('modals.settings.tabs.overwatch') }}
              </button>

              <button
                type="button"
                class="settings-tab inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-medium text-zinc-100 ring-0 hover:bg-white/5 data-[active=true]:bg-white data-[active=true]:text-zinc-900 data-[active=true]:hover:bg-white data-[active=true]:hover:text-zinc-900"
                data-target="notifications-section"
                data-active="false"
                aria-selected="false"
                role="tab"
                id="tab-notifications"
              >
                {{ __('modals.settings.tabs.notifications') }}
              </button>
            </div>

            {{-- Overwatch --}}
            <section
              id="overwatch-section"
              class="settings-section block"
              role="tabpanel"
              aria-labelledby="tab-overwatch"
            >
              <div class="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div class="flex items-center gap-2">
                  <div class="flex-1 rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-2">
                    <input
                      id="overwatch-username"
                      type="text"
                      placeholder="{{ __('modals.common.loading') }}"
                      class="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
                    />
                  </div>
                  <button
                    id="confirm-overwatch-username"
                    class="inline-flex cursor-pointer items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                    type="button"
                  >
                    {{ __('modals.settings.overwatch.confirm') }}
                  </button>
                </div>
                <div id="overwatch-usernames-list" class="space-y-2"></div>
              </div>
            </section>

            {{-- Notifications --}}
            <section
              id="notifications-section"
              class="settings-section hidden"
              role="tabpanel"
              aria-labelledby="tab-notifications"
            >
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div class="grid gap-3 sm:grid-cols-2">
                  <div class="space-y-2">
                    <div
                      class="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-900/50 px-3 py-2"
                    >
                      <span class="pr-3 text-sm text-zinc-200">
                        {{ __('modals.settings.notifications.dm_on_verification') }}
                      </span>
                      <label class="inline-flex cursor-pointer items-center">
                        <input
                          id="setting-dm-on-verification"
                          type="checkbox"
                          class="peer sr-only"
                        />
                        <span
                          class="relative h-5 w-9 rounded-full bg-zinc-700 transition-colors duration-200 ease-in-out peer-checked:bg-emerald-500 after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:translate-x-0 after:rounded-full after:bg-white after:transition-transform after:duration-200 after:ease-in-out after:content-[''] peer-checked:after:translate-x-4 active:after:scale-95"
                        ></span>
                      </label>
                    </div>

                    <div
                      class="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-900/50 px-3 py-2"
                    >
                      <span class="pr-3 text-sm text-zinc-200">
                        {{ __('modals.settings.notifications.dm_on_skill_role_update') }}
                      </span>
                      <label class="inline-flex cursor-pointer items-center">
                        <input
                          id="setting-dm-on-skill-role-update"
                          type="checkbox"
                          class="peer sr-only"
                        />
                        <span
                          class="relative h-5 w-9 rounded-full bg-zinc-700 transition-colors duration-200 ease-in-out peer-checked:bg-emerald-500 after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:translate-x-0 after:rounded-full after:bg-white after:transition-transform after:duration-200 after:ease-in-out after:content-[''] peer-checked:after:translate-x-4 active:after:scale-95"
                        ></span>
                      </label>
                    </div>

                    <div
                      class="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-900/50 px-3 py-2"
                    >
                      <span class="pr-3 text-sm text-zinc-200">
                        {{ __('modals.settings.notifications.dm_on_lootbox_gain') }}
                      </span>
                      <label class="inline-flex cursor-pointer items-center">
                        <input
                          id="setting-dm-on-lootbox-gain"
                          type="checkbox"
                          class="peer sr-only"
                        />
                        <span
                          class="relative h-5 w-9 rounded-full bg-zinc-700 transition-colors duration-200 ease-in-out peer-checked:bg-emerald-500 after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:translate-x-0 after:rounded-full after:bg-white after:transition-transform after:duration-200 after:ease-in-out after:content-[''] peer-checked:after:translate-x-4 active:after:scale-95"
                        ></span>
                      </label>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div
                      class="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-900/50 px-3 py-2"
                    >
                      <span class="pr-3 text-sm text-zinc-200">
                        {{ __('modals.settings.notifications.ping_on_xp_gain') }}
                      </span>
                      <label class="inline-flex cursor-pointer items-center">
                        <input id="setting-ping-on-xp-gain" type="checkbox" class="peer sr-only" />
                        <span
                          class="relative h-5 w-9 rounded-full bg-zinc-700 transition-colors duration-200 ease-in-out peer-checked:bg-emerald-500 after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:translate-x-0 after:rounded-full after:bg-white after:transition-transform after:duration-200 after:ease-in-out after:content-[''] peer-checked:after:translate-x-4 active:after:scale-95"
                        ></span>
                      </label>
                    </div>

                    <div
                      class="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-900/50 px-3 py-2"
                    >
                      <span class="pr-3 text-sm text-zinc-200">
                        {{ __('modals.settings.notifications.ping_on_mastery') }}
                      </span>
                      <label class="inline-flex cursor-pointer items-center">
                        <input id="setting-ping-on-mastery" type="checkbox" class="peer sr-only" />
                        <span
                          class="relative h-5 w-9 rounded-full bg-zinc-700 transition-colors duration-200 ease-in-out peer-checked:bg-emerald-500 after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:translate-x-0 after:rounded-full after:bg-white after:transition-transform after:duration-200 after:ease-in-out after:content-[''] peer-checked:after:translate-x-4 active:after:scale-95"
                        ></span>
                      </label>
                    </div>

                    <div
                      class="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-900/50 px-3 py-2"
                    >
                      <span class="pr-3 text-sm text-zinc-200">
                        {{ __('modals.settings.notifications.ping_on_community_rank_update') }}
                      </span>
                      <label class="inline-flex cursor-pointer items-center">
                        <input
                          id="setting-ping-on-community-rank-update"
                          type="checkbox"
                          class="peer sr-only"
                        />
                        <span
                          class="relative h-5 w-9 rounded-full bg-zinc-700 transition-colors duration-200 ease-in-out peer-checked:bg-emerald-500 after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:translate-x-0 after:rounded-full after:bg-white after:transition-transform after:duration-200 after:ease-in-out after:content-[''] peer-checked:after:translate-x-4 active:after:scale-95"
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  </div>
</div>
