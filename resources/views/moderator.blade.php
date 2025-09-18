@extends('layouts.app')

@section('title', 'Moderator Panel')
@section('og:title', 'Moderator Panel')
@section('og:description', 'Internal tools for moderators')

@section('content')
  <section class="min-h-[100vh] py-10 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black tracking-tight sm:text-4xl">Moderator Panel</h1>
          <p class="mt-1 text-sm text-zinc-400">Administration tools for moderators</p>
        </div>
        <div
          class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
        >
          <span class="bg-brand-400 inline-block h-2 w-2 rounded-full"></span>
          Logged as:
          <span class="font-semibold">{{ session('username') ?? 'Guest' }}</span>
        </div>
      </div>

      @php($canModerate = session('can_moderate') === true)
      @if (! $canModerate)
        <div class="rounded-2xl border border-red-500/30 bg-red-900/20 p-4 text-red-200">
          You do not have permission to access this page.
        </div>
      @else
        <div class="grid gap-6 lg:grid-cols-12">
          {{-- Left --}}
          <div class="lg:col-span-8">
            {{-- Onglets niveau 1 --}}
            <div class="mb-6 flex flex-wrap gap-2" id="modTabs">
              <button
                data-tab="users"
                class="mod-tab active inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"
              >
                <svg class="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3m-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V20h14v-1.5C15 14.17 10.33 13 8 13m8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.93 1.97 3.45V20h6v-1.5c0-2.33-4.67-3.5-7-3.5Z"
                  />
                </svg>
                Users
              </button>
              <button
                data-tab="lootbox"
                class="mod-tab inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/10"
              >
                <svg class="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M21 16V8l-9-5l-9 5v8l9 5l9-5M12 4.3L18.5 8L12 11.7L5.5 8L12 4.3m-7 6.12l6 3.33v6.92l-6-3.33v-6.92m14 6.92l-6 3.33v-6.92l6-3.33v6.92Z"
                  />
                </svg>
                Lootbox
              </button>
              <button
                data-tab="guides"
                class="mod-tab inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/10"
              >
                <svg class="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M4 6h16v2H4V6m0 4h10v2H4v-2m0 4h16v2H4v-2Z" />
                </svg>
                Guides
              </button>
              <button
                data-tab="maps"
                class="mod-tab inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/10"
              >
                <svg class="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="m15 19l-6-3l-6 3V5l6-3l6 3l6-3v14Z" />
                </svg>
                Maps
              </button>
              <button
                data-tab="moderation"
                class="mod-tab inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/10"
              >
                <svg class="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 1l3 5h6l-4.5 4l1.5 6l-6-3.5L6 16l1.5-6L3 6h6Z" />
                </svg>
                Moderation
              </button>
              <button
                data-tab="verifications"
                class="mod-tab inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/10"
              >
                <svg class="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41Z" />
                </svg>
                Verifications
              </button>
            </div>

            {{-- ============ USERS ============ --}}
            <div data-panel="users" class="mod-panel space-y-4">
              {{-- Sous-nav --}}
              <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="users-get"
                >
                  Get user
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="users-get-ow"
                >
                  Get overwatch usernames
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="users-link"
                >
                  Link fake → real
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="users-overwatch"
                >
                  Replace overwatch usernames
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="users-update"
                >
                  Update usernames
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="users-create"
                >
                  Create fake member
                </button>
              </div>

              {{-- Empty state tant qu’aucune sous-action n’est choisie --}}
              <div
                class="empty-state rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300"
              >
                Choose a Users action above.
              </div>

              {{-- Subpanel: GET USER --}}
              <div data-subpanel="users-get" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Get User</h3>
                    <span class="text-xs text-zinc-400">GET /api/mods/users/{user_id}</span>
                  </div>
                  <form data-action="get-user" autocomplete="off" class="grid gap-3 sm:grid-cols-3">
                    <label>
                      User ID
                      <input
                        name="user_id"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="12345"
                      />
                    </label>
                    <div class="flex items-end sm:col-span-2">
                      <button
                        class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Fetch
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              {{-- Subpanel: GET OW USERNAMES --}}
              <div data-subpanel="users-get-ow" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Get Overwatch Usernames</h3>
                    <span class="text-xs text-zinc-400">
                      GET /api/mods/users/{user_id}/overwatch
                    </span>
                  </div>
                  <form
                    data-action="get-ow-usernames"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3"
                  >
                    <label>
                      User ID
                      <input
                        name="user_id"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="12345"
                      />
                    </label>
                    <div class="flex items-end sm:col-span-2">
                      <button
                        class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Fetch
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              {{-- Subpanel: LINK --}}
              <div data-subpanel="users-link" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Link fake member to real user</h3>
                    <span class="text-xs text-zinc-400">
                      PUT /api/mods/users/fake/{fake_user_id}/link/{real_user_id}
                    </span>
                  </div>
                  <form
                    data-action="link-fake"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-2"
                  >
                    <label>
                      Fake user ID
                      <input
                        name="fake_user_id"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <label>
                      Real user ID
                      <input
                        name="real_user_id"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <button
                      class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100 sm:col-span-2"
                    >
                      Link
                    </button>
                  </form>
                </article>
              </div>

              {{-- Subpanel: REPLACE OW --}}
              <div data-subpanel="users-overwatch" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Replace Overwatch Usernames</h3>
                    <span class="text-xs text-zinc-400">
                      PUT /api/mods/users/{user_id}/overwatch
                    </span>
                  </div>
                  <form data-action="replace-overwatch" autocomplete="off" class="grid gap-4">
                    <div class="grid gap-3 sm:grid-cols-2">
                      <label>
                        User ID
                        <input
                          name="user_id"
                          class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          placeholder="12345"
                        />
                      </label>
                      <div></div>
                    </div>

                    <div class="grid gap-3 sm:grid-cols-2">
                      <label>
                        Username #1
                        <input
                          name="username_1"
                          class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          placeholder="Genji#1111"
                        />
                      </label>
                      <label>
                        Is primary #1
                        <div class="relative mt-1" data-dd-select>
                          <button
                            type="button"
                            data-dd-btn
                            class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          >
                            <span class="dd-label text-sm text-zinc-300">false</span>
                            <svg
                              class="h-4 w-4 text-zinc-400"
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
                            class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                          >
                            <label
                              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                            >
                              <input
                                type="radio"
                                name="is_primary_1"
                                value="false"
                                class="accent-emerald-500"
                                checked
                                data-label="false"
                              />
                              <span>false</span>
                            </label>
                            <label
                              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                            >
                              <input
                                type="radio"
                                name="is_primary_1"
                                value="true"
                                class="accent-emerald-500"
                                data-label="true"
                              />
                              <span>true</span>
                            </label>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div class="grid gap-3 sm:grid-cols-2">
                      <label>
                        Username #2
                        <input
                          name="username_2"
                          class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          placeholder="Genji#2222"
                        />
                      </label>
                      <label>
                        Is primary #2
                        <div class="relative mt-1" data-dd-select>
                          <button
                            type="button"
                            data-dd-btn
                            class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          >
                            <span class="dd-label text-sm text-zinc-300">false</span>
                            <svg
                              class="h-4 w-4 text-zinc-400"
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
                            class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                          >
                            <label
                              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                            >
                              <input
                                type="radio"
                                name="is_primary_2"
                                value="false"
                                class="accent-emerald-500"
                                checked
                                data-label="false"
                              />
                              <span>false</span>
                            </label>
                            <label
                              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                            >
                              <input
                                type="radio"
                                name="is_primary_2"
                                value="true"
                                class="accent-emerald-500"
                                data-label="true"
                              />
                              <span>true</span>
                            </label>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div class="grid gap-3 sm:grid-cols-2">
                      <label>
                        Username #3
                        <input
                          name="username_3"
                          class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          placeholder="Genji#3333"
                        />
                      </label>
                      <label>
                        Is primary #3
                        <div class="relative mt-1" data-dd-select>
                          <button
                            type="button"
                            data-dd-btn
                            class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          >
                            <span class="dd-label text-sm text-zinc-300">false</span>
                            <svg
                              class="h-4 w-4 text-zinc-400"
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
                            class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                          >
                            <label
                              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                            >
                              <input
                                type="radio"
                                name="is_primary_3"
                                value="false"
                                class="accent-emerald-500"
                                checked
                                data-label="false"
                              />
                              <span>false</span>
                            </label>
                            <label
                              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                            >
                              <input
                                type="radio"
                                name="is_primary_3"
                                value="true"
                                class="accent-emerald-500"
                                data-label="true"
                              />
                              <span>true</span>
                            </label>
                          </div>
                        </div>
                      </label>
                    </div>

                    <p class="-mt-1 text-xs text-zinc-400">
                      Tip: Define exactly one “is primary” to
                      <span class="font-semibold text-emerald-300">true</span>
                      .
                    </p>

                    <div>
                      <button
                        class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Replace
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              {{-- Subpanel: UPDATE NAMES --}}
              <div data-subpanel="users-update" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Update user names</h3>
                    <span class="text-xs text-zinc-400">PATCH /api/mods/users/{user_id}</span>
                  </div>
                  <form
                    data-action="update-names"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-2"
                  >
                    <label>
                      User ID
                      <input
                        name="user_id"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="12345"
                      />
                    </label>
                    <div></div>
                    <label>
                      Global name
                      <input
                        name="global_name"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="(opt.)"
                      />
                    </label>
                    <label>
                      Nickname
                      <input
                        name="nickname"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="(opt.)"
                      />
                    </label>
                    <div class="text-xs text-zinc-400 sm:col-span-2">
                      At least one of the two fields is required.
                    </div>
                    <button
                      class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100 sm:col-span-2"
                    >
                      Update
                    </button>
                  </form>
                </article>
              </div>

              {{-- Subpanel: CREATE FAKE --}}
              <div data-subpanel="users-create" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Create fake member</h3>
                    <span class="text-xs text-zinc-400">POST /api/mods/users/fake?name=</span>
                  </div>
                  <form
                    data-action="create-fake"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-2"
                  >
                    <label class="text-sm text-zinc-300 sm:col-span-2">
                      Name
                      <input
                        name="name"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="Fake Player"
                      />
                    </label>
                    <button
                      class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100 sm:col-span-2"
                    >
                      Create
                    </button>
                  </form>
                </article>
              </div>
            </div>

            {{-- ============ LOOTBOX ============ --}}
            <div data-panel="lootbox" class="mod-panel hidden space-y-4">
              <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="lootbox-key"
                >
                  Grant key
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="lootbox-xp"
                >
                  Grant XP
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="lootbox-reward"
                >
                  Grant reward
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="lootbox-get-keys"
                >
                  Get user keys
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="lootbox-get-rewards"
                >
                  Get user rewards
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="lootbox-view-all"
                >
                  View all rewards
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="lootbox-set-active-key"
                >
                  Set active key type
                </button>
              </div>
              <div
                class="empty-state rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300"
              >
                Choose a Lootbox action.
              </div>

              {{-- Grant key --}}
              <div data-subpanel="lootbox-key" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Grant key to user</h3>
                    <span class="text-xs text-zinc-400">
                      POST /api/mods/lootbox/users/{user_id}/keys/{key_type}
                    </span>
                  </div>
                  <form
                    data-action="grant-key"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3"
                  >
                    <label>
                      User ID
                      <input
                        name="user_id"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <label>
                      Key type
                      <div class="relative mt-1" data-dd-select>
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-300">Classic</span>
                          <svg
                            class="h-4 w-4 text-zinc-400"
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
                          class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                        >
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Classic"
                              class="accent-emerald-500"
                              checked
                              data-label="Classic"
                            />
                            <span>Classic</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Winter"
                              class="accent-emerald-500"
                              data-label="Winter"
                            />
                            <span>Winter</span>
                          </label>
                        </div>
                      </div>
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Grant key
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              {{-- Grant XP --}}
              <div data-subpanel="lootbox-xp" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Grant XP to User</h3>
                    <span class="text-xs text-zinc-400">
                      POST /api/mods/lootbox/users/{user_id}/xp
                    </span>
                  </div>
                  <form data-action="grant-xp" autocomplete="off" class="grid gap-3 sm:grid-cols-3">
                    <label>
                      User ID
                      <input
                        name="user_id"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <label>
                      Amount
                      <input
                        name="amount"
                        type="number"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="100"
                      />
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Grant XP
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              {{-- Grant reward (debug) --}}
              <div data-subpanel="lootbox-reward" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Grant reward (debug)</h3>
                    <span class="text-xs text-zinc-400">
                      POST
                      /api/mods/lootbox/users/debug/{user_id}/{key_type}/{reward_type}/{reward_name}
                    </span>
                  </div>
                  <form
                    data-action="grant-reward"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-4"
                  >
                    <label>
                      User ID
                      <input
                        name="user_id"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <label>
                      Key type
                      <div class="relative mt-1" data-dd-select>
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-300">Classic</span>
                          <svg
                            class="h-4 w-4 text-zinc-400"
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
                          class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                        >
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Classic"
                              class="accent-emerald-500"
                              checked
                              data-label="Classic"
                            />
                            <span>Classic</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Winter"
                              class="accent-emerald-500"
                              data-label="Winter"
                            />
                            <span>Winter</span>
                          </label>
                        </div>
                      </div>
                    </label>
                    <label>
                      Reward type
                      <div id="rw-rewardTypeDropdown" class="relative mt-1">
                        <input type="hidden" name="reward_type" value="" />
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-300">Any</span>
                          <svg
                            class="h-4 w-4 text-zinc-400"
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
                          class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                        ></div>
                      </div>
                    </label>
                    <label>
                      Reward name
                      <input
                        name="reward_name"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="reward_name"
                      />
                    </label>
                    <div class="sm:col-span-4">
                      <button
                        class="w-full cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Grant reward
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              {{-- Get User Keys --}}
              <div data-subpanel="lootbox-get-keys" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Get User Keys</h3>
                    <span class="text-xs text-zinc-400">
                      GET /api/lootbox/users/{user_id}/keys?key_type=Classic|Winter
                    </span>
                  </div>
                  <form
                    data-action="get-user-keys"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3"
                  >
                    <label>
                      User ID
                      <input
                        name="user_id"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <label>
                      Key type (opt.)
                      <div class="relative mt-1" data-dd-select>
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-300">Any</span>
                          <svg
                            class="h-4 w-4 text-zinc-400"
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
                          class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                        >
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value=""
                              class="accent-emerald-500"
                              checked
                              data-label="Any"
                            />
                            <span>Any</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Classic"
                              class="accent-emerald-500"
                              data-label="Classic"
                            />
                            <span>Classic</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Winter"
                              class="accent-emerald-500"
                              data-label="Winter"
                            />
                            <span>Winter</span>
                          </label>
                        </div>
                      </div>
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Fetch keys
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              {{-- Get User Rewards --}}
              <div data-subpanel="lootbox-get-rewards" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Get User Rewards</h3>
                    <span class="text-xs text-zinc-400">
                      GET /api/lootbox/users/{user_id}/rewards?reward_type=&key_type=&rarity=
                    </span>
                  </div>
                  <form
                    data-action="get-user-rewards"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-4"
                  >
                    <label>
                      User ID
                      <input
                        name="user_id"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <label>
                      Reward type (opt.)
                      <div id="gr-rewardTypeDropdown" class="relative mt-1">
                        <input type="hidden" name="reward_type" value="" />

                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-300">Any</span>
                          <svg
                            class="h-4 w-4 text-zinc-400"
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
                          class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                        ></div>
                      </div>
                    </label>
                    <label>
                      Key type (opt.)
                      <div class="relative mt-1" data-dd-select>
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-300">Any</span>
                          <svg
                            class="h-4 w-4 text-zinc-400"
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
                          class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                        >
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value=""
                              class="accent-emerald-500"
                              checked
                              data-label="Any"
                            />
                            <span>Any</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Classic"
                              class="accent-emerald-500"
                              data-label="Classic"
                            />
                            <span>Classic</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Winter"
                              class="accent-emerald-500"
                              data-label="Winter"
                            />
                            <span>Winter</span>
                          </label>
                        </div>
                      </div>
                    </label>
                    <label>
                      Rarity (opt.)
                      <input
                        name="rarity"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="Common, Epic, ..."
                      />
                    </label>
                    <div class="sm:col-span-4">
                      <button
                        class="w-full cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Fetch rewards
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              {{-- View All Rewards --}}
              <div data-subpanel="lootbox-view-all" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">View All Rewards</h3>
                    <span class="text-xs text-zinc-400">
                      GET /api/lootbox/rewards?reward_type=&key_type=&rarity=
                    </span>
                  </div>

                  <form
                    data-action="view-all-rewards"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3"
                  >
                    <!-- Reward type -->
                    <label>
                      Reward type (opt.)
                      <div id="va-rewardTypeDropdown" class="relative mt-1">
                        <input type="hidden" name="reward_type" value="any" />
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-300">Any</span>
                          <svg
                            class="h-4 w-4 text-zinc-400"
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
                          class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                        ></div>
                      </div>
                    </label>

                    <!-- Key type -->
                    <label>
                      Key type (opt.)
                      <div class="relative mt-1" data-dd-select>
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-300">Any</span>
                          <svg
                            class="h-4 w-4 text-zinc-400"
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
                          class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                        >
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="any"
                              class="accent-emerald-500"
                              checked
                              data-label="Any"
                            />
                            <span>Any</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Classic"
                              class="accent-emerald-500"
                              data-label="Classic"
                            />
                            <span>Classic</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Winter"
                              class="accent-emerald-500"
                              data-label="Winter"
                            />
                            <span>Winter</span>
                          </label>
                        </div>
                      </div>
                    </label>

                    <!-- Rarity -->
                    <label>
                      Rarity (opt.)
                      <div class="relative mt-1" data-dd-select>
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-300">Any</span>
                          <svg
                            class="h-4 w-4 text-zinc-400"
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
                          class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                        >
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="rarity"
                              value="any"
                              class="accent-emerald-500"
                              checked
                              data-label="Any"
                            />
                            <span>Any</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="rarity"
                              value="common"
                              class="accent-emerald-500"
                              data-label="Common"
                            />
                            <span>Common</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="rarity"
                              value="rare"
                              class="accent-emerald-500"
                              data-label="Rare"
                            />
                            <span>Rare</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="rarity"
                              value="epic"
                              class="accent-emerald-500"
                              data-label="Epic"
                            />
                            <span>Epic</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="rarity"
                              value="legendary"
                              class="accent-emerald-500"
                              data-label="Legendary"
                            />
                            <span>Legendary</span>
                          </label>
                        </div>
                      </div>
                    </label>

                    <div class="sm:col-span-3">
                      <button
                        class="w-full cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Fetch all rewards
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              <!-- Set Active Key Type -->
              <div data-subpanel="lootbox-set-active-key" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Set Active Key Type</h3>
                    <span class="text-xs text-zinc-400">PATCH /api/lootbox/keys/key_type</span>
                  </div>

                  <form
                    data-action="set-active-key-type"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-2"
                  >
                    <label>
                      Key type
                      <div class="relative mt-1" data-dd-select>
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-300">Classic</span>
                          <svg
                            class="h-4 w-4 text-zinc-400"
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
                          class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                        >
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Classic"
                              class="accent-emerald-500"
                              checked
                              data-label="Classic"
                            />
                            <span>Classic</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Winter"
                              class="accent-emerald-500"
                              data-label="Winter"
                            />
                            <span>Winter</span>
                          </label>
                        </div>
                      </div>
                    </label>

                    <div class="sm:col-span-2">
                      <button
                        class="w-full cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Set active key type
                      </button>
                    </div>
                  </form>
                </article>
              </div>
            </div>

            {{-- ============ GUIDES ============ --}}
            <div data-panel="guides" class="mod-panel hidden space-y-4">
              <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="guides-create"
                >
                  Create
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="guides-edit"
                >
                  Edit
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="guides-delete"
                >
                  Delete
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="guides-get"
                >
                  Get Guides
                </button>
              </div>
              <div
                class="empty-state rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300"
              >
                Choose a Guides action.
              </div>

              <div data-subpanel="guides-create" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Create Guide</h3>
                    <span class="text-xs text-zinc-400">POST /api/v3/maps/{code}/guides</span>
                  </div>
                  <form
                    data-action="create-guide"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3"
                  >
                    <label>
                      Map code
                      <input
                        name="code"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="7SFBH"
                      />
                    </label>
                    <label>
                      URL
                      <input
                        name="url"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="https://..."
                      />
                    </label>
                    <label>
                      User ID
                      <input
                        name="user_id"
                        type="text"
                        inputmode="numeric"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              <div data-subpanel="guides-edit" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Edit Guide</h3>
                    <span class="text-xs text-zinc-400">
                      PATCH /api/v3/maps/{code}/guides/{user_id}?url=
                    </span>
                  </div>
                  <form
                    data-action="edit-guide"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3"
                  >
                    <label>
                      Map code
                      <input
                        name="code"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <label>
                      New URL
                      <input
                        name="url"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <label>
                      User ID
                      <input
                        name="user_id"
                        type="text"
                        inputmode="numeric"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              <div data-subpanel="guides-delete" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Delete Guide</h3>
                    <span class="text-xs text-zinc-400">
                      DELETE /api/v3/maps/{code}/guides/{user_id}
                    </span>
                  </div>
                  <form
                    data-action="delete-guide"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3"
                  >
                    <label>
                      Map code
                      <input
                        name="code"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <label>
                      User ID
                      <input
                        name="user_id"
                        type="text"
                        inputmode="numeric"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full cursor-pointer rounded-xl border border-white/10 px-4 py-2 font-semibold hover:bg-white/5"
                      >
                        Delete
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              {{-- Get Guides --}}
              <div data-subpanel="guides-get" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Get guides</h3>
                    <span class="text-xs text-zinc-400">
                      GET /api/v3/maps/{code}/guides?include_records=
                    </span>
                  </div>
                  <form
                    data-action="get-guides"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3"
                  >
                    <label>
                      Map code
                      <input
                        name="code"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="7SFBH"
                      />
                    </label>
                    <label>
                      Include records
                      <div class="relative mt-1" data-dd-select>
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-300">false</span>
                          <svg
                            class="h-4 w-4 text-zinc-400"
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
                          class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                        >
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="include_records"
                              value="false"
                              class="accent-emerald-500"
                              checked
                              data-label="false"
                            />
                            <span>false</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="include_records"
                              value="true"
                              class="accent-emerald-500"
                              data-label="true"
                            />
                            <span>true</span>
                          </label>
                        </div>
                      </div>
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Fetch
                      </button>
                    </div>
                  </form>
                </article>
              </div>
            </div>

            {{-- ============ MAPS ============ --}}
            <div data-panel="maps" class="mod-panel hidden space-y-4">
              <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="maps-archive"
                >
                  Archive / Unarchive
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="maps-update"
                >
                  Update
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="maps-submit"
                >
                  Submit
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="maps-search"
                >
                  Search
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="maps-convert"
                >
                  Convert legacy
                </button>
              </div>
              <div
                class="empty-state rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300"
              >
                Choose a Maps action.
              </div>

              <div data-subpanel="maps-archive" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Archive or Unarchive maps</h3>
                    <span class="text-xs text-zinc-400">PATCH /api/v3/maps/archive?code=</span>
                  </div>
                  <form data-action="archive-maps" autocomplete="off" class="grid gap-3">
                    <div class="grid gap-3 sm:grid-cols-3">
                      <label>
                        Status
                        <div class="relative mt-1" data-dd-select>
                          <button
                            type="button"
                            data-dd-btn
                            class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          >
                            <span class="dd-label text-sm text-zinc-300">Archive</span>
                            <svg
                              class="h-4 w-4 text-zinc-400"
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
                            class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                          >
                            <label
                              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                            >
                              <input
                                type="radio"
                                name="status"
                                value="Archive"
                                class="accent-emerald-500"
                                checked
                                data-label="Archive"
                              />
                              <span>Archive</span>
                            </label>
                            <label
                              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                            >
                              <input
                                type="radio"
                                name="status"
                                value="Unarchived"
                                class="accent-emerald-500"
                                data-label="Unarchived"
                              />
                              <span>Unarchived</span>
                            </label>
                          </div>
                        </div>
                      </label>
                      <label>
                        Mode
                        <div class="relative mt-1" data-dd-select>
                          <!-- Select caché pour rester 100% compatible avec setupArchiveMapsUI (form.mode) -->
                          <select name="mode" class="hidden">
                            <option value="single" selected>Single</option>
                            <option value="bulk">Bulk</option>
                          </select>

                          <button
                            type="button"
                            data-dd-btn
                            class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          >
                            <span class="dd-label text-sm text-zinc-300">Single</span>
                            <svg
                              class="h-4 w-4 text-zinc-400"
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
                            class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                          >
                            <label
                              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                            >
                              <input
                                type="radio"
                                name="mode_ui"
                                value="single"
                                class="accent-emerald-500"
                                checked
                                data-label="Single"
                                onchange="const s=this.closest('[data-dd-select]').querySelector('select[name=&quot;mode&quot;]'); if(s){ s.value=this.value; s.dispatchEvent(new Event('change',{bubbles:true})); }"
                              />
                              <span>Single</span>
                            </label>
                            <label
                              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                            >
                              <input
                                type="radio"
                                name="mode_ui"
                                value="bulk"
                                class="accent-emerald-500"
                                data-label="Bulk"
                                onchange="const s=this.closest('[data-dd-select]').querySelector('select[name=&quot;mode&quot;]'); if(s){ s.value=this.value; s.dispatchEvent(new Event('change',{bubbles:true})); }"
                              />
                              <span>Bulk</span>
                            </label>
                          </div>
                        </div>
                      </label>
                      <label>
                        Single code (opt.)
                        <input
                          name="code"
                          class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          placeholder="007EX"
                        />
                      </label>
                      <div></div>
                    </div>
                    <button
                      class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                    >
                      Apply
                    </button>
                  </form>
                </article>
              </div>

              <div data-subpanel="maps-update" class="hidden min-h-[75vh] space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Update Map</h3>
                    <span class="text-xs text-zinc-400">PATCH /api/v3/maps/{code}</span>
                  </div>

                  <!-- Charger une carte à éditer -->
                  <form
                    data-action="load-map-update"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3"
                  >
                    <label>
                      Map code
                      <input
                        name="code"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="01AZC"
                      />
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Load
                      </button>
                    </div>
                  </form>

                  <!-- Formulaire d’édition (même structure que submit, IDs préfixés u-) -->
                  <form
                    id="u-updateMapForm"
                    data-action="update-map"
                    autocomplete="off"
                    class="mt-6 hidden space-y-6"
                  >
                    <!-- META -->
                    <div class="rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
                      <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Creators -->
                        <div class="sm:col-span-2">
                          <span class="mb-1 block text-xs text-zinc-400">Creator</span>
                          <div id="u-metaCreatorsCol" class="flex flex-wrap items-center gap-2">
                            <!-- Primary -->
                            <span
                              class="main-creator-row inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5"
                            >
                              <span
                                id="u-metaCreatorMain"
                                class="text-sm text-zinc-200"
                                data-raw-id=""
                              >
                                N/A
                              </span>
                              <button
                                type="button"
                                class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                                data-edit-target="u-metaCreatorMain"
                              >
                                Edit
                              </button>
                            </span>

                            <!-- Secondary (même affichage que le primary) -->
                            <span
                              class="secondary-creator-row inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5"
                            >
                              <span
                                id="u-metaCreatorSecond"
                                class="text-sm text-zinc-200"
                                data-raw-id=""
                              >
                                N/A
                              </span>
                              <button
                                type="button"
                                class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                                data-edit-target="u-metaCreatorSecond"
                              >
                                Edit
                              </button>
                            </span>
                          </div>
                        </div>

                        <!-- Map Code -->
                        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          <div class="text-[11px] text-zinc-400">Code (route cible)</div>
                          <div class="flex items-center gap-2">
                            <div id="u-metaCode" class="text-sm text-zinc-200">N/A</div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                              data-edit-target="u-metaCode"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        <!-- Map Name -->
                        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          <div class="text-[11px] text-zinc-400">Map name</div>
                          <div class="flex items-center gap-2">
                            <div id="u-metaMap" class="text-sm text-zinc-200">N/A</div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                              data-edit-target="u-metaMap"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        <!-- Checkpoints -->
                        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          <div class="text-[11px] text-zinc-400">Checkpoints</div>
                          <div class="flex items-center gap-2">
                            <div id="u-metaCheckpoints" class="text-sm text-zinc-200">N/A</div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                              data-edit-target="u-metaCheckpoints"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- REQUIRED -->
                    <div class="space-y-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
                      <h3 class="text-sm font-semibold text-zinc-200">Required</h3>

                      <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Difficulty -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-400">Select difficulty</label>
                          <div id="u-difficultyDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left"
                            >
                              <span class="dd-label text-sm text-zinc-300">Select difficulty</span>
                              <svg
                                class="h-4 w-4 text-zinc-400"
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
                              class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                            ></div>
                          </div>
                        </div>

                        <!-- Category -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-400">Select category</label>
                          <div id="u-categoryDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left"
                            >
                              <span class="dd-label text-sm text-zinc-300">Select category</span>
                              <svg
                                class="h-4 w-4 text-zinc-400"
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
                              class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                            ></div>
                          </div>
                        </div>

                        <!-- Mechanics -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-400">Select mechanics</label>
                          <div id="u-mechanicsDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left"
                            >
                              <span class="dd-label text-sm text-zinc-300">Select mechanics</span>
                              <svg
                                class="h-4 w-4 text-zinc-400"
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
                              class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                            ></div>
                          </div>
                        </div>

                        <!-- Restrictions -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-400">
                            Select restrictions
                          </label>
                          <div id="u-restrictionsDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left"
                            >
                              <span class="dd-label text-sm text-zinc-300">
                                Select restrictions
                              </span>
                              <svg
                                class="h-4 w-4 text-zinc-400"
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
                              class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- FLAGS & REVIEW -->
                    <div class="space-y-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
                      <h3 class="text-sm font-semibold text-zinc-200">Flags</h3>
                      <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Hidden -->
                        <label
                          class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                        >
                          <input id="u-flagHidden" type="checkbox" class="accent-emerald-500" />
                          <span class="text-sm text-zinc-200">Hidden</span>
                        </label>

                        <!-- Archived -->
                        <label
                          class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                        >
                          <input id="u-flagArchived" type="checkbox" class="accent-emerald-500" />
                          <span class="text-sm text-zinc-200">Archived</span>
                        </label>

                        <!-- Official -->
                        <label
                          class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                        >
                          <input id="u-flagOfficial" type="checkbox" class="accent-emerald-500" />
                          <span class="text-sm text-zinc-200">Official</span>
                        </label>

                        <!-- Playtesting -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-400">Playtesting</label>
                          <div id="u-playtestingDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left"
                            >
                              <span class="dd-label text-sm text-zinc-300">Select playtesting</span>
                              <svg
                                class="h-4 w-4 text-zinc-400"
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
                              class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- OPTIONAL -->
                    <div class="space-y-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
                      <h3 class="text-sm font-semibold text-zinc-200">Optional</h3>

                      <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Title -->
                        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          <label class="mb-1 block text-[11px] text-zinc-400" for="u-optTitleInput">
                            Title
                          </label>
                          <input
                            id="u-optTitleInput"
                            type="text"
                            maxlength="128"
                            class="w-full rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                            placeholder="Optional short title (max 128 chars)"
                          />
                        </div>

                        <!-- Custom banner -->
                        <div>
                          <div class="mb-1 text-[11px] text-zinc-400">Custom banner</div>
                          <div
                            id="u-bannerDrop"
                            class="group relative flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-zinc-900/60"
                          >
                            <input id="u-bannerInput" type="file" accept="image/*" class="hidden" />
                            <div
                              id="u-bannerPlaceholder"
                              class="px-3 text-center text-sm text-zinc-300 select-none"
                            >
                              Drag & drop or click to upload
                              <div class="mt-1 text-[11px] text-zinc-400">
                                Recommended 16:9. JPG/PNG/WebP/AVIF, max 8MB.
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Description -->
                        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          <div class="flex items-center justify-between">
                            <div>
                              <div class="text-[11px] text-zinc-400">Description</div>
                              <div id="u-optDescription" class="text-sm text-zinc-200">N/A</div>
                            </div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                              data-edit-target="u-optDescription"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        <!-- Guide URLs -->
                        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          <div class="flex items-center justify-between">
                            <div>
                              <div class="text-[11px] text-zinc-400">Guide (URL)</div>
                              <div id="u-optGuide" class="text-sm text-zinc-200">N/A</div>
                            </div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                              data-edit-target="u-optGuide"
                            >
                              Edit
                            </button>
                          </div>
                          <p class="mt-2 text-xs text-zinc-400">
                            One URL per line; first valid URL is used.
                          </p>
                        </div>

                        <!-- Medals -->
                        <div
                          class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 sm:col-span-2"
                        >
                          <div class="mb-2 text-[11px] text-zinc-400">Medals</div>
                          <div class="grid gap-3 sm:grid-cols-3">
                            <label class="flex items-center gap-2">
                              <span class="inline-flex min-w-0 items-center gap-2">
                                <span class="text-sm text-zinc-200">🥇 Gold</span>
                              </span>
                              <input
                                id="u-medalGoldInput"
                                type="text"
                                inputmode="decimal"
                                pattern="\\d{1,5}(?:\\.\\d{1,2})?"
                                placeholder="e.g. 5550.23"
                                class="w-40 shrink-0 rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                              />
                            </label>

                            <label class="flex items-center gap-2">
                              <span class="inline-flex min-w-0 items-center gap-2">
                                <span class="text-sm text-zinc-200">🥈 Silver</span>
                              </span>
                              <input
                                id="u-medalSilverInput"
                                type="text"
                                inputmode="decimal"
                                pattern="\\d{1,5}(?:\\.\\d{1,2})?"
                                placeholder="e.g. 7599.33"
                                class="w-40 shrink-0 rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                              />
                            </label>

                            <label class="flex items-center gap-2">
                              <span class="inline-flex min-w-0 items-center gap-2">
                                <span class="text-sm text-zinc-200">🥉 Bronze</span>
                              </span>
                              <input
                                id="u-medalBronzeInput"
                                type="text"
                                inputmode="decimal"
                                pattern="\\d{1,5}(?:\\.\\d{1,2})?"
                                placeholder="e.g. 8066.75"
                                class="w-40 shrink-0 rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                              />
                            </label>
                          </div>
                          <p class="mt-2 text-xs text-zinc-400">
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
                        Update map
                      </button>
                      <button
                        type="button"
                        class="cancel-btn inline-flex cursor-pointer items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
                        onclick="document.getElementById('u-updateMapForm')?.classList.add('hidden')"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              <div data-subpanel="maps-submit" class="hidden min-h-[75vh] space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Submit Map</h3>
                    <span class="text-xs text-zinc-400">POST /api/maps</span>
                  </div>

                  <form
                    id="submitMapForm"
                    data-action="submit-map"
                    autocomplete="off"
                    class="space-y-6"
                  >
                    <!-- META -->
                    <div class="rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
                      <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Creators -->
                        <div class="sm:col-span-2">
                          <span class="mb-1 block text-xs text-zinc-400">Creator</span>
                          <div id="metaCreatorsCol" class="flex flex-wrap items-center gap-2">
                            <!-- Primary -->
                            <span
                              class="main-creator-row inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5"
                            >
                              <span
                                id="metaCreatorMain"
                                class="text-sm text-zinc-200"
                                data-raw-id=""
                              >
                                N/A
                              </span>
                              <button
                                type="button"
                                class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                                data-edit-target="metaCreatorMain"
                              >
                                Edit
                              </button>
                            </span>

                            <!-- Secondary (même système que primary) -->
                            <span
                              class="secondary-creator-row inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5"
                            >
                              <span
                                id="metaCreatorSecond"
                                class="text-sm text-zinc-200"
                                data-raw-id=""
                              >
                                N/A
                              </span>
                              <button
                                type="button"
                                class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                                data-edit-target="metaCreatorSecond"
                              >
                                Edit
                              </button>
                            </span>
                          </div>
                        </div>

                        <!-- Map Code -->
                        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          <div class="text-[11px] text-zinc-400">Code</div>
                          <div class="flex items-center gap-2">
                            <div id="metaCode" class="text-sm text-zinc-200" data-ac="off">N/A</div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                              data-edit-target="metaCode"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        <!-- Map Name -->
                        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          <div class="text-[11px] text-zinc-400">Map name</div>
                          <div class="flex items-center gap-2">
                            <div id="metaMap" class="text-sm text-zinc-200">N/A</div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                              data-edit-target="metaMap"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        <!-- Checkpoints -->
                        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          <div class="text-[11px] text-zinc-400">Checkpoints</div>
                          <div class="flex items-center gap-2">
                            <div id="metaCheckpoints" class="text-sm text-zinc-200">N/A</div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                              data-edit-target="metaCheckpoints"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- REQUIRED -->
                    <div class="space-y-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
                      <h3 class="text-sm font-semibold text-zinc-200">Required</h3>

                      <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Difficulty (radio) -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-400">Select difficulty</label>
                          <div id="difficultyDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left"
                            >
                              <span class="dd-label text-sm text-zinc-300">Select difficulty</span>
                              <svg
                                class="h-4 w-4 text-zinc-400"
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
                              class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                            ></div>
                          </div>
                        </div>

                        <!-- Category (radio) -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-400">Select category</label>
                          <div id="categoryDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left"
                            >
                              <span class="dd-label text-sm text-zinc-300">Select category</span>
                              <svg
                                class="h-4 w-4 text-zinc-400"
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
                              class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                            ></div>
                          </div>
                        </div>

                        <!-- Mechanics (checkboxes) -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-400">Select mechanics</label>
                          <div id="mechanicsDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left"
                            >
                              <span class="dd-label text-sm text-zinc-300">Select mechanics</span>
                              <svg
                                class="h-4 w-4 text-zinc-400"
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
                              class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                            ></div>
                          </div>
                        </div>

                        <!-- Restrictions (checkboxes) -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-400">
                            Select restrictions
                          </label>
                          <div id="restrictionsDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left"
                            >
                              <span class="dd-label text-sm text-zinc-300">
                                Select restrictions
                              </span>
                              <svg
                                class="h-4 w-4 text-zinc-400"
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
                              class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- OPTIONAL -->
                    <div class="space-y-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
                      <h3 class="text-sm font-semibold text-zinc-200">Optional</h3>

                      <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Title -->
                        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          <label class="mb-1 block text-[11px] text-zinc-400" for="optTitleInput">
                            Title
                          </label>
                          <input
                            id="optTitleInput"
                            type="text"
                            maxlength="128"
                            class="w-full rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                            placeholder="Optional short title (max 128 chars)"
                          />
                        </div>

                        <!-- Custom banner -->
                        <div>
                          <div class="mb-1 text-[11px] text-zinc-400">Custom banner</div>
                          <div
                            id="bannerDrop"
                            class="group relative flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-zinc-900/60"
                          >
                            <input id="bannerInput" type="file" accept="image/*" class="hidden" />
                            <div
                              id="bannerPlaceholder"
                              class="px-3 text-center text-sm text-zinc-300 select-none"
                            >
                              Drag & drop or click to upload
                              <div class="mt-1 text-[11px] text-zinc-400">
                                Recommended 16:9. JPG/PNG/WebP/AVIF, max 8MB.
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Description -->
                        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          <div class="flex items-center justify-between">
                            <div>
                              <div class="text-[11px] text-zinc-400">Description</div>
                              <div id="optDescription" class="text-sm text-zinc-200">N/A</div>
                            </div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                              data-edit-target="optDescription"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        <!-- Guide URLs -->
                        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          <div class="flex items-center justify-between">
                            <div>
                              <div class="text-[11px] text-zinc-400">Guide (URL)</div>
                              <div id="optGuide" class="text-sm text-zinc-200">N/A</div>
                            </div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10"
                              data-edit-target="optGuide"
                            >
                              Edit
                            </button>
                          </div>
                          <p class="mt-2 text-xs text-zinc-400">
                            One URL per line; first valid URL is used.
                          </p>
                        </div>

                        <!-- Medals -->
                        <div
                          class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 sm:col-span-2"
                        >
                          <div class="mb-2 text-[11px] text-zinc-400">Medals</div>
                          <div class="grid gap-3 sm:grid-cols-3">
                            <label class="flex items-center gap-2">
                              <span class="inline-flex min-w-0 items-center gap-2">
                                <span class="text-sm text-zinc-200">🥇 Gold</span>
                              </span>
                              <input
                                id="medalGoldInput"
                                type="text"
                                inputmode="decimal"
                                pattern="\\d{1,5}(?:\\.\\d{1,2})?"
                                placeholder="e.g. 5550.23"
                                class="w-40 shrink-0 rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                              />
                            </label>

                            <label class="flex items-center gap-2">
                              <span class="inline-flex min-w-0 items-center gap-2">
                                <span class="text-sm text-zinc-200">🥈 Silver</span>
                              </span>
                              <input
                                id="medalSilverInput"
                                type="text"
                                inputmode="decimal"
                                pattern="\\d{1,5}(?:\\.\\d{1,2})?"
                                placeholder="e.g. 7599.33"
                                class="w-40 shrink-0 rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                              />
                            </label>

                            <label class="flex items-center gap-2">
                              <span class="inline-flex min-w-0 items-center gap-2">
                                <span class="text-sm text-zinc-200">🥉 Bronze</span>
                              </span>
                              <input
                                id="medalBronzeInput"
                                type="text"
                                inputmode="decimal"
                                pattern="\\d{1,5}(?:\\.\\d{1,2})?"
                                placeholder="e.g. 8066.75"
                                class="w-40 shrink-0 rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                              />
                            </label>
                          </div>
                          <p class="mt-2 text-xs text-zinc-400">
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
                        class="cancel-btn inline-flex cursor-pointer items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              <div data-subpanel="maps-convert" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Convert To Legacy Map</h3>
                    <span class="text-xs text-zinc-400">
                      POST /api/v3/maps/{code}/convert/legacy
                    </span>
                  </div>
                  <form
                    data-action="convert-legacy"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3"
                  >
                    <label>
                      Map code
                      <input
                        name="code"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full cursor-pointer rounded-xl border border-white/10 px-4 py-2 font-semibold hover:bg-white/5"
                      >
                        Convert
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              <div data-subpanel="maps-search" class="hidden min-h-[75vh] space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Search Map</h3>
                    <span class="text-xs text-zinc-400">GET /api/maps?code=</span>
                  </div>

                  <!-- Formulaire de recherche -->
                  <form
                    data-action="search-map"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3"
                  >
                    <label>
                      Map code
                      <input
                        name="code"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="7SFBH"
                      />
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Search
                      </button>
                    </div>
                  </form>

                  <!-- Panneau résultat (même visuel que Submit) -->
                  <form
                    id="s-submitMapForm"
                    autocomplete="off"
                    class="mt-6 hidden space-y-6"
                    data-readonly="1"
                  >
                    <!-- META -->
                    <div class="rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
                      <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Creators -->
                        <div class="sm:col-span-2">
                          <span class="mb-1 block text-xs text-zinc-400">Creator</span>
                          <div id="s-metaCreatorsCol" class="flex flex-wrap items-center gap-2">
                            <!-- Primary -->
                            <span
                              class="main-creator-row inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5"
                            >
                              <span
                                id="s-metaCreatorMain"
                                class="text-sm text-zinc-200"
                                data-raw-id=""
                              >
                                N/A
                              </span>
                              <button
                                type="button"
                                class="block-edit-btn cursor-not-allowed cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm opacity-50 hover:bg-white/10"
                                disabled
                                data-edit-target="s-metaCreatorMain"
                              >
                                Edit
                              </button>
                            </span>

                            <!-- Secondary (même système, lecture seule) -->
                            <span
                              class="secondary-creator-row inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5"
                            >
                              <span
                                id="s-metaCreatorSecond"
                                class="text-sm text-zinc-200"
                                data-raw-id=""
                              >
                                N/A
                              </span>
                              <button
                                type="button"
                                class="block-edit-btn cursor-not-allowed cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm opacity-50 hover:bg-white/10"
                                disabled
                                data-edit-target="s-metaCreatorSecond"
                              >
                                Edit
                              </button>
                            </span>
                          </div>
                        </div>

                        <!-- Map Code -->
                        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          <div class="text-[11px] text-zinc-400">Code</div>
                          <div class="flex items-center gap-2">
                            <div id="s-metaCode" class="text-sm text-zinc-200">N/A</div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-not-allowed cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm opacity-50 hover:bg-white/10"
                              disabled
                              data-edit-target="s-metaCode"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        <!-- Map Name -->
                        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          <div class="text-[11px] text-zinc-400">Map name</div>
                          <div class="flex items-center gap-2">
                            <div id="s-metaMap" class="text-sm text-zinc-200">N/A</div>
                          </div>
                        </div>

                        <!-- Checkpoints -->
                        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          <div class="text-[11px] text-zinc-400">Checkpoints</div>
                          <div class="flex items-center gap-2">
                            <div id="s-metaCheckpoints" class="text-sm text-zinc-200">N/A</div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-not-allowed cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm opacity-50 hover:bg-white/10"
                              disabled
                              data-edit-target="s-metaCheckpoints"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- REQUIRED -->
                    <div class="space-y-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
                      <h3 class="text-sm font-semibold text-zinc-200">Required</h3>
                      <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Difficulty (radio) -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-400">Select difficulty</label>
                          <div id="s-difficultyDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left"
                            >
                              <span class="dd-label text-sm text-zinc-300">Select difficulty</span>
                              <svg
                                class="h-4 w-4 text-zinc-400"
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
                              class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                            ></div>
                          </div>
                        </div>

                        <!-- Category (radio) -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-400">Select category</label>
                          <div id="s-categoryDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left"
                            >
                              <span class="dd-label text-sm text-zinc-300">Select category</span>
                              <svg
                                class="h-4 w-4 text-zinc-400"
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
                              class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                            ></div>
                          </div>
                        </div>

                        <!-- Mechanics (checkboxes) -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-400">Select mechanics</label>
                          <div id="s-mechanicsDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left"
                            >
                              <span class="dd-label text-sm text-zinc-300">Select mechanics</span>
                              <svg
                                class="h-4 w-4 text-zinc-400"
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
                              class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                            ></div>
                          </div>
                        </div>

                        <!-- Restrictions (checkboxes) -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-400">
                            Select restrictions
                          </label>
                          <div id="s-restrictionsDropdown" class="relative">
                            <button
                              type="button"
                              data-dd-btn
                              class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left"
                            >
                              <span class="dd-label text-sm text-zinc-300">
                                Select restrictions
                              </span>
                              <svg
                                class="h-4 w-4 text-zinc-400"
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
                              class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- OPTIONAL -->
                    <div class="space-y-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
                      <h3 class="text-sm font-semibold text-zinc-200">Optional</h3>

                      <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Title -->
                        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          <label class="mb-1 block text-[11px] text-zinc-400" for="s-optTitleInput">
                            Title
                          </label>
                          <input
                            id="s-optTitleInput"
                            type="text"
                            maxlength="128"
                            class="w-full rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                            placeholder="Optional short title (max 128 chars)"
                            disabled
                          />
                        </div>

                        <!-- Custom banner -->
                        <div>
                          <div class="mb-1 text-[11px] text-zinc-400">Custom banner</div>
                          <div
                            id="s-bannerDrop"
                            class="group relative flex h-36 items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-zinc-900/60"
                          >
                            <input
                              id="s-bannerInput"
                              type="file"
                              accept="image/*"
                              class="hidden"
                              disabled
                            />
                            <div
                              id="s-bannerPlaceholder"
                              class="px-3 text-center text-sm text-zinc-300 select-none"
                            >
                              Drag & drop or click to upload
                              <div class="mt-1 text-[11px] text-zinc-400">
                                Recommended 16:9. JPG/PNG/WebP/AVIF, max 8MB.
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Description -->
                        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          <div class="flex items-center justify-between">
                            <div>
                              <div class="text-[11px] text-zinc-400">Description</div>
                              <div id="s-optDescription" class="text-sm text-zinc-200">N/A</div>
                            </div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-not-allowed cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm opacity-50 hover:bg-white/10"
                              disabled
                              data-edit-target="s-optDescription"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        <!-- Guide URLs -->
                        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                          <div class="flex items-center justify-between">
                            <div>
                              <div class="text-[11px] text-zinc-400">Guide (URL)</div>
                              <div id="s-optGuide" class="text-sm text-zinc-200">N/A</div>
                            </div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-not-allowed cursor-pointer rounded-md border border-white/10 px-2 py-1 text-sm opacity-50 hover:bg-white/10"
                              disabled
                              data-edit-target="s-optGuide"
                            >
                              Edit
                            </button>
                          </div>
                          <p class="mt-2 text-xs text-zinc-400">
                            One URL per line; first valid URL is used.
                          </p>
                        </div>

                        <!-- Medals -->
                        <div
                          class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 sm:col-span-2"
                        >
                          <div class="mb-2 text-[11px] text-zinc-400">Medals</div>
                          <div class="grid gap-3 sm:grid-cols-3">
                            <label class="flex items-center gap-2">
                              <span class="inline-flex min-w-0 items-center gap-2">
                                <span class="text-sm text-zinc-200">🥇 Gold</span>
                              </span>
                              <input
                                id="s-medalGoldInput"
                                type="text"
                                inputmode="decimal"
                                pattern="\\d{1,5}(?:\\.\\d{1,2})?"
                                placeholder="e.g. 5550.23"
                                class="w-40 shrink-0 rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                                disabled
                              />
                            </label>

                            <label class="flex items-center gap-2">
                              <span class="inline-flex min-w-0 items-center gap-2">
                                <span class="text-sm text-zinc-200">🥈 Silver</span>
                              </span>
                              <input
                                id="s-medalSilverInput"
                                type="text"
                                inputmode="decimal"
                                pattern="\\d{1,5}(?:\\.\\d{1,2})?"
                                placeholder="e.g. 7599.33"
                                class="w-40 shrink-0 rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                                disabled
                              />
                            </label>

                            <label class="flex items-center gap-2">
                              <span class="inline-flex min-w-0 items-center gap-2">
                                <span class="text-sm text-zinc-200">🥉 Bronze</span>
                              </span>
                              <input
                                id="s-medalBronzeInput"
                                type="text"
                                inputmode="decimal"
                                pattern="\\d{1,5}(?:\\.\\d{1,2})?"
                                placeholder="e.g. 8066.75"
                                class="w-40 shrink-0 rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                                disabled
                              />
                            </label>
                          </div>
                          <p class="mt-2 text-xs text-zinc-400">
                            Format: max 5 digits before the decimal and up to 2 after. Values ≥ 0.
                            Required order: bronze &gt; silver &gt; gold.
                          </p>
                        </div>
                      </div>
                    </div>
                  </form>
                </article>
              </div>
            </div>

            {{-- ============ MODERATION ============ --}}
            <div data-panel="moderation" class="mod-panel hidden space-y-4">
              <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="mod-quality"
                >
                  Override quality
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="mod-suspicious"
                >
                  Set suspicious flag
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="mod-getsusp"
                >
                  Get suspicious flags
                </button>
              </div>
              <div
                class="empty-state rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300"
              >
                Choose a Moderation action.
              </div>

              <div data-subpanel="mod-quality" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Override Quality Votes</h3>
                    <span class="text-xs text-zinc-400">POST /api/mods/maps/{code}/quality</span>
                  </div>

                  <form
                    data-action="override-quality"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3 sm:items-end"
                  >
                    <label class="block">
                      <span class="block text-xs text-zinc-400">Map code</span>
                      <input
                        name="code"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="01AZC"
                      />
                    </label>

                    <label class="block">
                      <span class="block text-xs text-zinc-400">Quality (1–6)</span>
                      <div id="q-qualityDropdown" class="relative mt-1">
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-300">Select quality (1–6)</span>
                          <svg
                            class="h-4 w-4 text-zinc-400"
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
                          class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                        ></div>
                      </div>
                    </label>

                    <div class="sm:col-span-3">
                      <button
                        class="w-full cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Apply
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              <!-- Set Suspicious Flag -->
              <div data-subpanel="mod-suspicious" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Set Suspicious Flag</h3>
                    <span class="text-xs text-zinc-400">POST /api/mods/completions/suspicious</span>
                  </div>
                  <form
                    data-action="set-suspicious"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3"
                  >
                    <label>
                      Context
                      <input
                        name="context"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="tool-assisted, impossible, …"
                      />
                    </label>

                    <label>
                      Flag type
                      <div class="relative mt-1" data-dd-select>
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-left focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-300">Cheating</span>
                          <svg
                            class="h-4 w-4 text-zinc-400"
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
                          class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-white/10 bg-zinc-900 shadow-xl"
                        >
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="flag_type"
                              value="Cheating"
                              class="accent-emerald-500"
                              checked
                              data-label="Cheating"
                            />
                            <span>Cheating</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="flag_type"
                              value="Scripting"
                              class="accent-emerald-500"
                              data-label="Scripting"
                            />
                            <span>Scripting</span>
                          </label>
                        </div>
                      </div>
                    </label>

                    <label>
                      Flagged user (uid)
                      <input
                        name="flagged_by"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>

                    <label class="sm:col-span-1">
                      Message ID (opt.)
                      <input
                        name="message_id"
                        type="number"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>

                    <label class="sm:col-span-1">
                      Verification ID (opt.)
                      <input
                        name="verification_id"
                        type="number"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>

                    <div class="sm:col-span-3">
                      <button
                        class="w-full cursor-pointer rounded-xl border border-white/10 px-4 py-2 font-semibold hover:bg-white/5"
                      >
                        Flag
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              <!-- Get Suspicious Flags -->
              <div data-subpanel="mod-getsusp" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Get Suspicious Flags</h3>
                    <span class="text-xs text-zinc-400">GET /api/mods/completions/suspicious</span>
                  </div>
                  <form
                    data-action="get-suspicious"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3"
                  >
                    <label>
                      User ID
                      <input
                        name="user_id"
                        class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Fetch
                      </button>
                    </div>
                  </form>
                </article>
              </div>
            </div>

            {{-- ============ VERIFICATIONS (nouvelle section) ============ --}}
            <div data-panel="verifications" class="mod-panel hidden space-y-4">
              <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="verif-pending"
                >
                  Verify completions
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                  data-subtab="verif-playtest"
                >
                  Verify playtests
                </button>
              </div>
              <div
                class="empty-state rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300"
              >
                Choose a Verifications action.
              </div>

              <div data-subpanel="verif-pending" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Get Pending Verifications</h3>
                    <span class="text-xs text-zinc-400">GET /api/v3/verifications/pending</span>
                  </div>
                  <form data-action="get-pending-verifs" autocomplete="off" class="grid gap-3">
                    <button
                      class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                    >
                      Fetch
                    </button>
                  </form>
                </article>
              </div>
            </div>
          </div>

          {{-- Right: Activity --}}
          <aside class="lg:col-span-4">
            <div class="sticky top-20 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="font-semibold">Activity</h3>
                <button
                  id="clearLog"
                  class="cursor-pointer rounded-lg border border-white/10 px-2 py-1 text-xs hover:bg-white/5"
                >
                  Clear
                </button>
              </div>
              <div id="activityLog" class="max-h-[70vh] space-y-2 overflow-auto pr-1 text-sm">
                <p class="text-zinc-400">Responses from endpoints will appear here</p>
              </div>
            </div>
          </aside>
        </div>
      @endif
    </div>
  </section>
@endsection

@push('scripts')
  @vite('resources/js/pages/moderator.js')
@endpush
