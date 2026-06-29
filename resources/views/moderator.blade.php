@extends('layouts.app')

@section('title', 'Moderator Panel')
@section('og:title', 'Moderator Panel')
@section('og:description', 'Internal tools for moderators')

@section('content')
  <section class="mod-ui relative overflow-hidden min-h-[100vh] text-zinc-900 dark:text-white selection:bg-emerald-500/30 selection:text-white [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button[disabled]]:cursor-not-allowed [&_button:focus]:outline-none [&_button:focus]:ring-1 [&_button:focus]:ring-emerald-500/30">
    <input type="hidden" id="modUserId" value="{{ (string) (session('user_id') ?? session('discord_user_id') ?? session('discord_id') ?? '') }}">
    <div class="relative mx-auto max-w-[96rem] px-4 sm:px-6 lg:px-10 py-10 sm:py-14 min-h-[130vh]">
      <!-- Header -->
      <header class="mb-8">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 class="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Operations Console</h1>
            <p class="mt-1 max-w-2xl text-sm font-medium text-zinc-600 dark:text-zinc-300 sm:text-base">
              Domain workflows for user support, content maintenance, map operations, verification queues, and tournaments.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button id="openCmdk" type="button" class="mod-btn">
              <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10 18a8 8 0 1 1 5.3-14A8 8 0 0 1 10 18m11 3l-5.2-5.2" /></svg>
              Command
              <span class="ml-1 hidden rounded-md border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:text-zinc-300 sm:inline">Ctrl K</span>
            </button>

            <div class="inline-flex items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2">
              <span class="mod-icon-chip" aria-hidden="true">
                <svg class="h-4 w-4 text-zinc-800 dark:text-zinc-200" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4m0 2c-4.42 0-8 2-8 4v2h16v-2c0-2-3.58-4-8-4Z"/></svg>
              </span>
              <div class="leading-tight">
                <div class="text-[10px] text-zinc-500 dark:text-zinc-400">Logged as</div>
                <div class="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{{ session('username') ?? 'Guest' }}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      @php
        $canModerate = session('is_mod') === true;
      @endphp
      @if (! $canModerate)
        <div class="rounded-2xl border border-red-500/30 bg-red-950/40 p-5 text-red-100 backdrop-blur">
          <div class="flex items-start gap-3">
            <span class="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10 ring-1 ring-red-500/20" aria-hidden="true">
              <svg class="h-4 w-4 text-red-200" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m1 15h-2v-2h2Zm0-4h-2V7h2Z"/></svg>
            </span>
            <div>
              <div class="font-semibold">Access denied</div>
              <p class="mt-0.5 text-sm text-red-100/80">You do not have permission to access this page.</p>
            </div>
          </div>
        </div>
      @else
        <div class="grid gap-6 lg:grid-cols-12">
          <!-- Left navigation -->
          <aside class="lg:col-span-2">
            <div class="sticky top-24 space-y-3">
              <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 p-3 backdrop-blur">
                <div class="flex items-center justify-between px-2 pb-2">
                  <div class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Sections</div>
                  <div class="text-[10px] text-zinc-500 dark:text-zinc-400">shareable URLs</div>
                </div>
                <label class="relative block">
                  <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" aria-hidden="true">
                    <svg class="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M10 18a8 8 0 1 1 5.3-14A8 8 0 0 1 10 18m11 3l-5.2-5.2" /></svg>
                  </span>
                  <input
                    id="modNavSearch"
                    type="text"
                    class="w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 pl-10 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    placeholder="Filter sections…"
                    autocomplete="off"
                  />
                </label>
              </div>

              <nav class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/30 dark:bg-zinc-950/30 p-2 backdrop-blur" aria-label="Moderator sections">
            <div id="modTabs" class="space-y-1">
              <button
                data-tab="users"
                data-tab-label="Users"
                class="group mod-tab active"
                type="button"
              >
                <span class="mod-icon-chip transition group-hover:bg-white/10">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3m-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V20h14v-1.5C15 14.17 10.33 13 8 13m8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.93 1.97 3.45V20h6v-1.5c0-2.33-4.67-3.5-7-3.5Z"
                    />
                  </svg>
                </span>
                <span class="min-w-0 flex-1 truncate">Users</span>
                <span class="shrink-0 whitespace-nowrap text-[10px] text-zinc-500">Tools</span>
              </button>

              <button
                data-tab="lootbox"
                data-tab-label="Lootbox"
                class="group mod-tab"
                type="button"
              >
                <span class="mod-icon-chip transition group-hover:bg-white/10">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M21 16V8l-9-5l-9 5v8l9 5l9-5M12 4.3L18.5 8L12 11.7L5.5 8L12 4.3m-7 6.12l6 3.33v6.92l-6-3.33v-6.92m14 6.92l-6 3.33v-6.92l6-3.33v6.92Z"
                    />
                  </svg>
                </span>
                <span class="min-w-0 flex-1 truncate">Lootbox</span>
                <span class="shrink-0 whitespace-nowrap text-[10px] text-zinc-500">Rewards</span>
              </button>

              <button
                data-tab="content"
                data-tab-label="Content"
                class="group mod-tab"
                type="button"
              >
                <span class="mod-icon-chip transition group-hover:bg-white/10">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M4 5h7v6H4V5m9 0h7v4h-7V5M4 13h7v6H4v-6m9-2h7v8h-7v-8Z" />
                  </svg>
                </span>
                <span class="min-w-0 flex-1 truncate">Content</span>
                <span class="shrink-0 whitespace-nowrap text-[10px] text-zinc-500">Tech</span>
              </button>

              <button
                data-tab="maps"
                data-tab-label="Maps"
                class="group mod-tab"
                type="button"
              >
                <span class="mod-icon-chip transition group-hover:bg-white/10">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="m15 19l-6-3l-6 3V5l6-3l6 3l6-3v14Z" />
                  </svg>
                </span>
                <span class="min-w-0 flex-1 truncate">Maps</span>
                <span class="shrink-0 whitespace-nowrap text-[10px] text-zinc-500">Data</span>
              </button>

              <button
                data-tab="records"
                data-tab-label="Records"
                class="group mod-tab"
                type="button"
              >
                <span class="mod-icon-chip transition group-hover:bg-white/10">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M12 1l3 5h6l-4.5 4l1.5 6l-6-3.5L6 16l1.5-6L3 6h6Z" />
                  </svg>
                </span>
                <span class="min-w-0 flex-1 truncate">Records</span>
                <span class="shrink-0 whitespace-nowrap text-[10px] text-zinc-500">Ops</span>
              </button>

              <button
                data-tab="verifications"
                data-tab-label="Verifications"
                class="group mod-tab"
                type="button"
              >
                <span class="mod-icon-chip transition group-hover:bg-white/10">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41Z" />
                  </svg>
                </span>
                <span class="min-w-0 flex-1 truncate">Verifications</span>
                <span class="shrink-0 whitespace-nowrap text-[10px] text-zinc-500">Queue</span>
              </button>

              <button
                data-tab="tournament"
                data-tab-label="Tournament"
                class="group mod-tab"
                type="button"
              >
                <span class="mod-icon-chip transition group-hover:bg-white/10">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M7 3h10v4h3v5a8 8 0 0 1-7 7.94V22h-2v-2.06A8 8 0 0 1 4 12V7h3V3m2 2v2h6V5H9m-3 4v3a6 6 0 0 0 12 0V9H6m3 1h6v2H9v-2Z" />
                  </svg>
                </span>
                <span class="min-w-0 flex-1 truncate">Tournament</span>
                <span class="shrink-0 whitespace-nowrap text-[10px] text-zinc-500">Events</span>
              </button>

              <button
                data-tab="skill"
                data-tab-label="Skill"
                class="group mod-tab"
                type="button"
              >
                <span class="mod-icon-chip transition group-hover:bg-white/10">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M12 2 15 8l6 .9-4.4 4.3 1 6.1L12 16.5 6.4 19.3l1-6.1L3 8.9 9 8l3-6Zm0 4.5-1.6 3.2-3.5.5 2.5 2.5-.6 3.5 3.2-1.7 3.2 1.7-.6-3.5 2.5-2.5-3.5-.5L12 6.5Z"/>
                  </svg>
                </span>
                <span class="min-w-0 flex-1 truncate">Skill</span>
                <span class="shrink-0 whitespace-nowrap text-[10px] text-zinc-500">Score</span>
              </button>

              <button
                data-tab="devs"
                data-tab-label="Web"
                class="hidden group mod-tab"
                type="button"
               data-dev-only="1">
                <span class="mod-icon-chip transition group-hover:bg-white/10">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M22.7 19.3L19 15.6c-.2-.2-.5-.3-.7-.3h-.5l-1.4-1.4c.9-1.4.7-3.4-.5-4.6c-1.2-1.2-3.2-1.4-4.6-.5L9.4 7.4V6.9c0-.3-.1-.5-.3-.7L5.7 2.5C5.3 2.1 4.7 2.1 4.3 2.5L2.5 4.3c-.4.4-.4 1 0 1.4L6 9.2c.2.2.4.3.7.3h.5l1.4 1.4c-.9 1.4-.7 3.4.5 4.6c1.2 1.2 3.2 1.4 4.6.5l1.4 1.4v.5c0 .3.1.5.3.7l3.7 3.7c.4.4 1 .4 1.4 0l1.8-1.8c.4-.4.4-1 0-1.4Z"/>
                  </svg>
                </span>
                <span class="min-w-0 flex-1 truncate">Web</span>
                <span class="shrink-0 whitespace-nowrap text-[10px] text-zinc-500">Danger</span>
              </button>

              <button
                data-tab="store"
                data-tab-label="Store"
                class="hidden group mod-tab"
                type="button"
               data-dev-only="1">
                <span class="mod-icon-chip transition group-hover:bg-white/10">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M7 7V6a5 5 0 0 1 10 0v1h3v15H4V7Zm2 0h6V6a3 3 0 0 0-6 0Zm-3 2v11h12V9Z"/>
                  </svg>
                </span>
                <span class="min-w-0 flex-1 truncate">Store</span>
                <span class="shrink-0 whitespace-nowrap text-[10px] text-zinc-500">Shop</span>
              </button>

              <button
                data-tab="quests"
                data-tab-label="Quests"
                class="hidden group mod-tab"
                type="button"
               data-dev-only="1">
                <span class="mod-icon-chip transition group-hover:bg-white/10">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a3 3 0 0 1 0-6h10v2H7a1 1 0 0 0 0 2h10V5H7v10H5V5a2 2 0 0 1 2-2z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 8.2l.9 2.1 2.3.2-1.8 1.5.6 2.2-2-1.2-2 1.2.6-2.2-1.8-1.5 2.3-.2.9-2.1z"
                    />
                  </svg>
                </span>
                <span class="min-w-0 flex-1 truncate">Quests</span>
                <span class="shrink-0 whitespace-nowrap text-[10px] text-zinc-500">Daily</span>
              </button>

                </div>
              </nav>
              
            </div>
          </aside>

          <!-- Main -->
          <div class="lg:col-span-7 min-w-0">
            <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 p-4 backdrop-blur sm:p-5">
              <div class="relative min-w-0">
                <div class="min-w-0 pr-44 sm:pr-48">
                  <div id="modActiveKicker" class="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700 dark:text-emerald-300">Workflow</div>
                  <h2 id="modActiveTitle" class="mt-1 text-2xl font-black tracking-tight">Users</h2>
                  <p id="modActiveSummary" class="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
                    Search, inspect, and update player identity data without leaving the section.
                  </p>
                  <div id="modActiveStats" class="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300"></div>
                </div>
                <div class="absolute right-0 top-0 flex flex-nowrap items-center justify-end gap-2">
                  <button id="modFocusActions" type="button" class="mod-btn shrink-0 whitespace-nowrap">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 4h14v2H5V4m0 7h14v2H5v-2m0 7h14v2H5v-2Z"/></svg>
                    Actions
                  </button>
                  <button id="modScrollTop" type="button" class="mod-btn shrink-0 whitespace-nowrap">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 4l7 7h-4v9H9v-9H5l7-7Z"/></svg>
                    Top
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-6 space-y-6">
            {{-- ============ USERS ============ --}}
            @include('moderator.partials.users')

            {{-- ============ LOOTBOX ============ --}}
            @include('moderator.partials.lootbox')

            {{-- ============ CONTENT ============ --}}
            @include('moderator.partials.content')


            {{-- ============ MAPS ============ --}}
            @include('moderator.partials.maps')

            {{-- ============ RECORDS ============ --}}
            @include('moderator.partials.records')

            {{-- ============ VERIFICATIONS ============ --}}
            @include('moderator.partials.verifications')

            {{-- ============ TOURNAMENT ============ --}}
            @include('moderator.partials.tournament')

            {{-- ============ SKILL ============ --}}
            @include('moderator.partials.skill')

            @include('moderator.partials.store')

            {{-- ============ QUESTS ============ --}}
            @include('moderator.partials.quests')

            {{-- ============ DEVS (WEB) ============ --}}
            @include('moderator.partials.web')
            </div>
          </div>

          <!-- Right: Activity -->
          <aside class="lg:col-span-3 min-w-0">
            <div class="sticky top-24 space-y-3">
              <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/30 dark:bg-zinc-950/30 p-4 backdrop-blur">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-xs font-semibold">Request audit</div>
                    <div class="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">Readable log with full JSON on demand</div>
                  </div>
                  <button
                    id="clearLog"
                    type="button"
                    class="mod-btn"
                  >
                    Clear
                  </button>
                </div>
                <div id="activitySummary" class="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div class="rounded-xl border border-zinc-200/80 bg-white/50 px-2 py-2 dark:border-white/10 dark:bg-white/5">
                    <div class="text-zinc-500 dark:text-zinc-400">Requests</div>
                    <div data-activity-stat="total" class="mt-0.5 text-sm font-black text-zinc-900 dark:text-zinc-100">0</div>
                  </div>
                  <div class="rounded-xl border border-zinc-200/80 bg-white/50 px-2 py-2 dark:border-white/10 dark:bg-white/5">
                    <div class="text-zinc-500 dark:text-zinc-400">Success</div>
                    <div data-activity-stat="ok" class="mt-0.5 text-sm font-black text-emerald-700 dark:text-emerald-300">0</div>
                  </div>
                  <div class="rounded-xl border border-zinc-200/80 bg-white/50 px-2 py-2 dark:border-white/10 dark:bg-white/5">
                    <div class="text-zinc-500 dark:text-zinc-400">Errors</div>
                    <div data-activity-stat="err" class="mt-0.5 text-sm font-black text-red-700 dark:text-red-300">0</div>
                  </div>
                </div>
                <div class="mt-3 space-y-2">
                  <label class="block">
                    <input
                      id="activitySearch"
                      type="text"
                      class="w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      placeholder="Filter by method, URL, status, payload..."
                      autocomplete="off"
                    />
                  </label>
                  <div class="flex items-center justify-between gap-2">
                    <div id="activityFilters" class="flex flex-wrap items-center gap-1.5">
                      <button type="button" data-activity-filter="all" class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-2 py-1 text-[11px] text-zinc-800 dark:text-zinc-200">All</button>
                      <button type="button" data-activity-filter="ok" class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-2 py-1 text-[11px] text-zinc-800 dark:text-zinc-200">Success</button>
                      <button type="button" data-activity-filter="err" class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-2 py-1 text-[11px] text-zinc-800 dark:text-zinc-200">Errors</button>
                    </div>
                    <span id="activityCount" class="shrink-0 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-2 py-1 text-[11px] text-zinc-700 dark:text-zinc-300">0</span>
                  </div>
                </div>
                <div id="activityLog" class="mt-3 max-h-[70vh] space-y-2 overflow-y-auto overflow-x-hidden pr-1 text-sm min-w-0 break-words [overflow-wrap:anywhere]">
                  <p class="text-zinc-500 dark:text-zinc-400">Run an action to see the request result here.</p>
                </div>
              </div>

              <div class="hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/30 dark:bg-zinc-950/30 p-4 backdrop-blur lg:block">
                <div class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Operational guardrails</div>
                <div id="modContextHints" class="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
                  <div class="rounded-xl border border-zinc-200/80 bg-white/45 p-3 dark:border-white/10 dark:bg-white/5">
                    Use the workflow cards first, then fine-tune fields inside the selected tool.
                  </div>
                  <div class="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-800 dark:text-amber-200">
                    Destructive actions stay grouped in warning blocks and require explicit confirmation when available.
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      @endif
    </div>

  <!-- Command Palette -->
  <div id="modCmdk" class="hidden" aria-hidden="true">
    <div id="modCmdkBackdrop" class="fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm"></div>
    <div class="fixed inset-0 z-[410] flex items-start justify-center p-4 sm:p-6">
      <div id="modCmdkPanel" class="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-zinc-950/90 shadow-2xl ring-1 ring-zinc-300/60 dark:ring-white/10" role="dialog" aria-modal="true">
        <div class="flex items-center gap-3 border-b border-zinc-200/80 dark:border-white/10 px-4 py-3">
          <span class="mod-icon-chip">
            <svg class="h-4 w-4 text-zinc-800 dark:text-zinc-200" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M10 18a8 8 0 1 1 5.3-14A8 8 0 0 1 10 18m11 3l-5.2-5.2" />
            </svg>
          </span>
          <div class="flex-1">
            <div class="text-xs text-zinc-500 dark:text-zinc-400">Search tabs & tools</div>
            <input id="modCmdkInput" type="text" class="mt-1 w-full rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" placeholder="Type to search…" autocomplete="off" />
          </div>
          <button id="modCmdkClose" type="button" class="cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10">Esc</button>
        </div>
        <div class="max-h-[60vh] overflow-auto p-2">
          <div id="modCmdkList" class="space-y-1"></div>
        </div>
        <div class="border-t border-zinc-200/80 dark:border-white/10 px-4 py-3 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span class="text-zinc-800 dark:text-zinc-200">Enter</span> to open · <span class="text-zinc-800 dark:text-zinc-200">↑↓</span> to navigate · <span class="text-zinc-800 dark:text-zinc-200">Esc</span> to close
        </div>
      </div>
    </div>
  </div>
  </section>
@endsection

@push('scripts')
  @vite('resources/js/pages/moderator.js')
@endpush
