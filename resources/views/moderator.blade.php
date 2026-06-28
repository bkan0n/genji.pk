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
            <button id="openCmdk" type="button" class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 transition hover:bg-zinc-100 dark:hover:bg-white/10">
              <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10 18a8 8 0 1 1 5.3-14A8 8 0 0 1 10 18m11 3l-5.2-5.2" /></svg>
              Command
              <span class="ml-1 hidden rounded-md border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:text-zinc-300 sm:inline">Ctrl K</span>
            </button>

            <div class="inline-flex items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2">
              <span class="inline-flex shrink-0 h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10" aria-hidden="true">
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
                class="mod-tab active group flex min-w-0 w-full items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(16,185,129,.08)]"
                type="button"
              >
                <span class="inline-flex shrink-0 h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 transition group-hover:bg-white/10">
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
                class="mod-tab group flex min-w-0 w-full items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(16,185,129,.08)]"
                type="button"
              >
                <span class="inline-flex shrink-0 h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 transition group-hover:bg-white/10">
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
                class="mod-tab group flex min-w-0 w-full items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(16,185,129,.08)]"
                type="button"
              >
                <span class="inline-flex shrink-0 h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 transition group-hover:bg-white/10">
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
                class="mod-tab group flex min-w-0 w-full items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(16,185,129,.08)]"
                type="button"
              >
                <span class="inline-flex shrink-0 h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 transition group-hover:bg-white/10">
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
                class="mod-tab group flex min-w-0 w-full items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(16,185,129,.08)]"
                type="button"
              >
                <span class="inline-flex shrink-0 h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 transition group-hover:bg-white/10">
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
                class="mod-tab group flex min-w-0 w-full items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(16,185,129,.08)]"
                type="button"
              >
                <span class="inline-flex shrink-0 h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 transition group-hover:bg-white/10">
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
                class="mod-tab group flex min-w-0 w-full items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(16,185,129,.08)]"
                type="button"
              >
                <span class="inline-flex shrink-0 h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 transition group-hover:bg-white/10">
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
                class="mod-tab group flex min-w-0 w-full items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(16,185,129,.08)]"
                type="button"
              >
                <span class="inline-flex shrink-0 h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 transition group-hover:bg-white/10">
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
                class="hidden mod-tab group flex min-w-0 w-full items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(16,185,129,.08)]"
                type="button"
               data-dev-only="1">
                <span class="inline-flex shrink-0 h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 transition group-hover:bg-white/10">
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
                class="hidden mod-tab group flex min-w-0 w-full items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(16,185,129,.08)]"
                type="button"
               data-dev-only="1">
                <span class="inline-flex shrink-0 h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 transition group-hover:bg-white/10">
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
                class="hidden mod-tab group flex min-w-0 w-full items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(16,185,129,.08)]"
                type="button"
               data-dev-only="1">
                <span class="inline-flex shrink-0 h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 transition group-hover:bg-white/10">
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
                  <button id="modFocusActions" type="button" class="inline-flex shrink-0 items-center gap-2 whitespace-nowrap cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition hover:bg-zinc-100 dark:hover:bg-white/10">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 4h14v2H5V4m0 7h14v2H5v-2m0 7h14v2H5v-2Z"/></svg>
                    Actions
                  </button>
                  <button id="modScrollTop" type="button" class="inline-flex shrink-0 items-center gap-2 whitespace-nowrap cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition hover:bg-zinc-100 dark:hover:bg-white/10">
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
            <div data-panel="skill" class="mod-panel hidden space-y-4">
              <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10"
                  data-subtab="skill-user"
                  type="button"
                >
                  Player
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10"
                  data-subtab="skill-config"
                  type="button"
                >
                  Weights
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10"
                  data-subtab="skill-tiers"
                  type="button"
                >
                  Tier percentiles
                </button>
              </div>

              <div class="empty-state rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 text-zinc-600 dark:text-zinc-300">
                Choose a Skill action.
              </div>

              <div data-subpanel="skill-user" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
                  <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 class="font-semibold">Player skill</h3>
                      <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">The aggregate score and per-map breakdown are calculated from eligible runs.</p>
                    </div>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET /api/skill/users/{user_id}</span>
                  </div>
                  <form data-action="skill-user-summary" autocomplete="off" class="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <label class="min-w-0 flex-1 text-sm">
                      User ID
                      <input
                        name="user_id"
                        inputmode="numeric"
                        required
                        value="{{ (string) (session('user_id') ?? session('discord_user_id') ?? session('discord_id') ?? '') }}"
                        placeholder="user_id"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <button type="submit" class="rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Get summary</button>
                    <button type="submit" data-submit-action="skill-user-breakdown" class="rounded-xl border border-zinc-200/80 bg-zinc-100 px-4 py-2 font-semibold text-zinc-900 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10">Get breakdown</button>
                  </form>
                  <div data-skill-user-result class="rounded-2xl border border-dashed border-zinc-300/80 p-5 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
                    Load a player to inspect their Skill Score.
                  </div>
                </article>
              </div>

              <div data-subpanel="skill-config" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
                  <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 class="font-semibold">Skill weights</h3>
                      <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Saving triggers a full score recompute. The upstream API restricts updates to superusers.</p>
                    </div>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET + PATCH /api/mods/skill/config</span>
                  </div>
                  <form data-action="skill-config-get" autocomplete="off">
                    <button type="submit" class="rounded-xl border border-zinc-200/80 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10">Reload weights</button>
                  </form>
                  @php
                    $skillWeightControls = [
                      'diff_base' => [
                        'label' => 'Difficulty base',
                        'tooltip' => 'Controls how strongly map difficulty affects the score. Base score = Difficulty base^(raw difficulty - 1.5). Higher values make difficult maps worth exponentially more.',
                        'min' => 0, 'max' => 10, 'step' => 0.01,
                      ],
                      'gamma' => [
                        'label' => 'Gamma',
                        'tooltip' => 'Applies diminishing returns to a player’s maps to limit farming. Scores are sorted from highest to lowest, then each score is divided by position^Gamma. At 0, every map contributes fully. As Gamma increases, lower-ranked maps contribute less.',
                        'min' => 0.5, 'max' => 10, 'step' => 0.01,
                      ],
                      'time_bonus' => [
                        'label' => 'Time bonus',
                        'tooltip' => 'The maximum bonus awarded for time quality. It only applies to fully video-verified runs. Time multiplier = 1 + Time bonus × field-size adjustment × time percentile. A percentile of 1 represents the fastest time.',
                        'min' => 0, 'max' => 10, 'step' => 0.01,
                      ],
                      'shrink_k' => [
                        'label' => 'Shrink K',
                        'tooltip' => 'Reduces the time bonus when few players have completed the map. Adjustment = field size / (field size + Shrink K). A higher value requires a larger leaderboard to receive the full time bonus.',
                        'min' => 0, 'max' => 10, 'step' => 0.01,
                      ],
                      'wr_bonus' => [
                        'label' => 'World record bonus',
                        'tooltip' => 'An additional bonus awarded to a fully verified world record. At 0.10, the map score is multiplied by 1.10, or +10%. Being first only among video runs is not enough: the player must be first on the global leaderboard.',
                        'min' => 0, 'max' => 10, 'step' => 0.01,
                      ],
                      'partial_factor' => [
                        'label' => 'Partial factor',
                        'tooltip' => 'The share of the difficulty score retained when a run is not fully verified. At 0.60, it awards 60% of the base score. No time, medal, or world record bonus is applied.',
                        'min' => 0, 'max' => 10, 'step' => 0.01,
                      ],
                      'medal_gold' => [
                        'label' => 'Gold medal',
                        'tooltip' => 'The multiplier applied to video-verified runs with a gold medal. At 1.12, the map score receives a 12% bonus. This multiplier can stack with time and world record bonuses.',
                        'min' => 0, 'max' => 10, 'step' => 0.01,
                      ],
                      'medal_silver' => [
                        'label' => 'Silver medal',
                        'tooltip' => 'The multiplier applied to video-verified runs with a silver medal. At 1.07, the map score receives a 7% bonus. This multiplier can stack with time and world record bonuses.',
                        'min' => 0, 'max' => 10, 'step' => 0.01,
                      ],
                      'medal_bronze' => [
                        'label' => 'Bronze medal',
                        'tooltip' => 'The multiplier applied to video-verified runs with a bronze medal. At 1.03, the map score receives a 3% bonus. This multiplier can stack with time and world record bonuses.',
                        'min' => 0, 'max' => 10, 'step' => 0.01,
                      ],
                    ];
                  @endphp
                  <form data-action="skill-config-update" data-preserve-form-state="1" autocomplete="off" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    @foreach ($skillWeightControls as $field => $control)
                      <div class="skill-weight-card" data-skill-weight-control="{{ $field }}">
                        <div class="flex items-center justify-between gap-3">
                          <div class="flex min-w-0 items-center gap-2">
                            <label for="skill-weight-{{ $field }}" class="min-w-0 truncate text-sm font-semibold">
                              {{ $control['label'] }}
                            </label>
                            <span class="skill-weight-info">
                              <button
                                type="button"
                                class="skill-weight-info-button"
                                aria-label="Information about {{ $control['label'] }}"
                                aria-describedby="skill-weight-tooltip-{{ $field }}"
                              >
                                <svg viewBox="0 0 16 16" aria-hidden="true">
                                  <circle cx="8" cy="4.25" r="1"></circle>
                                  <path d="M8 7v5"></path>
                                </svg>
                              </button>
                              <span
                                id="skill-weight-tooltip-{{ $field }}"
                                role="tooltip"
                                class="skill-weight-tooltip"
                              >{{ $control['tooltip'] }}</span>
                            </span>
                          </div>
                          <input
                            id="skill-weight-{{ $field }}"
                            name="{{ $field }}"
                            type="number"
                            min="{{ $control['min'] }}"
                            max="{{ $control['max'] }}"
                            step="{{ $control['step'] }}"
                            value="{{ $control['min'] }}"
                            class="skill-weight-number"
                            data-skill-weight-number
                          />
                        </div>
                        <input
                          type="range"
                          min="{{ $control['min'] }}"
                          max="{{ $control['max'] }}"
                          step="{{ $control['step'] }}"
                          value="{{ $control['min'] }}"
                          class="skill-weight-range mt-4"
                          data-skill-weight-range
                          aria-label="{{ $control['label'] }}"
                        />
                        <div class="mt-2 flex justify-between text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                          <span>{{ $control['min'] }}</span>
                          <span>{{ $control['max'] }}</span>
                        </div>
                      </div>
                    @endforeach
                    <div class="sm:col-span-2 lg:col-span-3">
                      <button type="submit" class="rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Save and recompute</button>
                    </div>
                  </form>
                  <pre data-out="skill-config-res" class="hidden"></pre>
                </article>
              </div>

              <div data-subpanel="skill-tiers" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-5">
                  <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 class="font-semibold">Tier percentiles</h3>
                      <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Seven strictly increasing population percentiles define the eight ranked tiers.</p>
                    </div>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET /api/skill/tiers + PATCH /api/mods/skill/tiers</span>
                  </div>
                  <form data-action="skill-tiers-get" autocomplete="off">
                    <button type="submit" class="rounded-xl border border-zinc-200/80 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10">Reload tier config</button>
                  </form>
                  <form data-action="skill-tiers-update" data-preserve-form-state="1" autocomplete="off" class="space-y-5">
                    @php
                      $skillTierVisuals = [
                        ['name' => 'Bronze'],
                        ['name' => 'Silver'],
                        ['name' => 'Gold'],
                        ['name' => 'Emerald'],
                        ['name' => 'Diamond'],
                        ['name' => 'Ascendant'],
                        ['name' => 'Elite'],
                        ['name' => 'Champion'],
                      ];
                      $skillThresholdDefaults = [10, 20, 30, 40, 50, 70, 90];
                    @endphp

                    <div class="rounded-2xl border border-zinc-200/80 bg-white/35 p-4 dark:border-white/10 dark:bg-black/10">
                      <div class="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Population distribution</div>
                          <div class="text-xs text-zinc-500 dark:text-zinc-400">The width of each color is the population assigned to that rank.</div>
                        </div>
                        <div class="text-[11px] text-zinc-500 dark:text-zinc-400">Updates while you move a threshold</div>
                      </div>
                      <div data-skill-population-bar class="mt-4 flex h-4 w-full overflow-hidden rounded-full bg-zinc-200 ring-1 ring-zinc-300/70 dark:bg-zinc-800 dark:ring-white/10">
                        @foreach ($skillTierVisuals as $tierNumber => $tier)
                          <span
                            data-skill-population-segment="{{ $tierNumber + 1 }}"
                            class="skill-tier-segment skill-tier-{{ strtolower($tier['name']) }} h-full min-w-[3px] transition-[width] duration-150"
                            title="{{ $tier['name'] }}"
                          ></span>
                        @endforeach
                      </div>
                      <div class="mt-1 flex justify-between text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                        <span>0th percentile</span>
                        <span>100th percentile</span>
                      </div>
                    </div>

                    <div>
                      <div class="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Rank preview</div>
                          <div class="text-xs text-zinc-500 dark:text-zinc-400">Representative players are sampled from the saved Skill Score snapshot.</div>
                        </div>
                        <div data-skill-sample-status class="text-[11px] text-zinc-500 dark:text-zinc-400">Loading player samples...</div>
                      </div>
                      <div class="skill-tier-preview-grid">
                        @foreach ($skillTierVisuals as $tierIndex => $tier)
                          <section
                            data-skill-tier-card="{{ $tierIndex + 1 }}"
                            class="skill-tier-card skill-tier-{{ strtolower($tier['name']) }}"
                          >
                            <div class="flex min-w-0 items-center gap-3">
                              <div class="skill-tier-icon text-sm font-black">
                                {{ substr($tier['name'], 0, 1) }}
                                <img
                                  src="https://cdn.genji.pk/assets/skill/rank-icons/{{ rawurlencode($tier['name']) }}.png"
                                  alt=""
                                  loading="lazy"
                                  decoding="async"
                                  onerror="this.remove()"
                                />
                              </div>
                              <div class="min-w-0">
                                <div class="truncate text-sm font-black text-zinc-900 dark:text-zinc-100">{{ $tier['name'] }}</div>
                                <div data-skill-tier-range class="truncate text-[11px] text-zinc-500 dark:text-zinc-400">Percentile range -</div>
                              </div>
                              <span data-skill-tier-share class="skill-tier-share ml-auto shrink-0 rounded-full px-2 py-1 text-[10px] font-bold">-</span>
                            </div>
                            <div data-skill-tier-score-range class="mt-3 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">Score range -</div>
                            <div data-skill-tier-samples class="mt-2 space-y-1.5">
                              @for ($sample = 0; $sample < 3; $sample++)
                                <div class="h-8 animate-pulse rounded-lg bg-zinc-200/70 dark:bg-white/5"></div>
                              @endfor
                            </div>
                          </section>
                        @endforeach
                      </div>
                    </div>

                    <div>
                      <div class="mb-3">
                        <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Threshold editor</div>
                        <div class="text-xs text-zinc-500 dark:text-zinc-400">Each slider can be adjusted independently from 0.1% to 99.9%.</div>
                        <div data-skill-threshold-status class="mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Threshold order is valid</div>
                      </div>
                      <div class="space-y-3">
                        @foreach (array_slice($skillTierVisuals, 1) as $index => $tier)
                          @php($previousTier = $skillTierVisuals[$index])
                          <div
                            class="skill-threshold-row skill-threshold-{{ strtolower($tier['name']) }}"
                          >
                            <div class="flex min-w-0 items-center gap-2">
                              <span class="skill-threshold-from-dot h-2.5 w-2.5 shrink-0 rounded-full"></span>
                              <span class="truncate text-xs text-zinc-500 dark:text-zinc-400">{{ $previousTier['name'] }}</span>
                              <span class="text-zinc-400" aria-hidden="true">&rarr;</span>
                              <span class="truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">{{ $tier['name'] }}</span>
                            </div>
                            <input
                              type="range"
                              min="0.1"
                              max="99.9"
                              step="0.1"
                              value="{{ $skillThresholdDefaults[$index] }}"
                              class="skill-threshold-input"
                              data-skill-percentile-index="{{ $index }}"
                              aria-label="{{ $tier['name'] }} percentile threshold"
                            />
                            <div class="flex items-center justify-between gap-3 sm:block sm:text-right">
                              <label class="skill-threshold-number-wrap">
                                <span class="sr-only">{{ $tier['name'] }} percentile threshold</span>
                                <input
                                  type="number"
                                  min="0.1"
                                  max="99.9"
                                  step="0.1"
                                  inputmode="decimal"
                                  value="{{ $skillThresholdDefaults[$index] }}"
                                  class="skill-threshold-number"
                                  data-skill-percentile-number="{{ $index }}"
                                  aria-label="{{ $tier['name'] }} percentile threshold"
                                />
                                <span aria-hidden="true">%</span>
                              </label>
                              <div data-skill-boundary-value="{{ $index }}" class="text-[11px] text-zinc-500 dark:text-zinc-400">Score -</div>
                            </div>
                          </div>
                        @endforeach
                      </div>
                    </div>
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div data-skill-computed-at class="text-xs text-zinc-500 dark:text-zinc-400">Snapshot date unavailable</div>
                      <button type="submit" class="rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Save percentiles</button>
                    </div>
                  </form>
                  <pre data-out="skill-tiers-res" class="hidden"></pre>
                </article>
              </div>
            </div>

            {{-- ============ STORE ============ --}}
            <div data-panel="store" class="mod-panel hidden space-y-4">
              <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="store-config"
                  type="button"
                >
                  Config
                </button>

                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="store-rotation"
                  type="button"
                >
                  Rotation
                </button>
              </div>

              <div class="empty-state rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 text-zinc-600 dark:text-zinc-300">
                Choose a Store action.
              </div>


              {{-- Subpanel: Config --}}
              <div data-subpanel="store-config" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-6">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 class="font-semibold">Store config</h3>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">Load the live config, edit in place, then save from the same panel.</p>
                    </div>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET + PUT /mods/store/config</span>
                  </div>

                  <form data-action="store-get-config" data-form-ux="1" autocomplete="off">
                    <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                      Load current config
                    </button>
                  </form>

                  <form data-action="store-update-config" autocomplete="off" class="grid gap-3 sm:grid-cols-2">
                    <label class="sm:col-span-1 text-sm">
                      Rotation period (days)
                      <input
                        name="rotation_period_days"
                        type="number"
                        min="1"
                        step="1"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="7"
                      />
                    </label>

                    <label class="sm:col-span-1 text-sm">
                      Active key type
                      <input
                        name="active_key_type"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="Classic / Winter / ..."
                      />
                    </label>

                    <div class="sm:col-span-2">
                      <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                        Save
                      </button>
                    </div>
                  </form>

                  <pre data-out="store-config" class="hidden"></pre>
                  <pre data-out="store-update-res" class="hidden"></pre>
                </article>
              </div>

              {{-- Subpanel: Rotation --}}
              <div data-subpanel="store-rotation" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h3 class="font-semibold">Generate store rotation</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /mods/store/rotation/generate</span>
                  </div>

                  <form data-action="store-generate-rotation" autocomplete="off" class="grid gap-3 sm:grid-cols-2">
                    <label class="sm:col-span-1 text-sm">
                      item_count
                      <input
                        name="item_count"
                        type="number"
                        min="1"
                        step="1"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="8"
                        required
                      />
                    </label>

                    <div class="sm:col-span-2">
                      <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                        Generate
                      </button>
                    </div>
                  </form>
                </article>
              </div>
            </div>

            {{-- ============ QUESTS ============ --}}
            <div data-panel="quests" class="mod-panel hidden space-y-4">
              <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="quest-config"
                  type="button"
                >
                  Config
                </button>

                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="quest-update"
                  type="button"
                >
                  Update quest
                </button>

                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="quest-rotation"
                  type="button"
                >
                  Rotation
                </button>

                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="quest-user-progress"
                  type="button"
                >
                  User progress
                </button>
              </div>

              <div class="empty-state rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 text-zinc-600 dark:text-zinc-300">
                Choose a Quests action.
              </div>


              {{-- Subpanel: Config --}}
              <div data-subpanel="quest-config" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-6">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 class="font-semibold">Quests config</h3>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">Load the live config, edit the values below, then save from the same card.</p>
                    </div>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET + PUT /mods/quests/config</span>
                  </div>

                  <form data-action="quest-get-config" data-form-ux="1" autocomplete="off">
                    <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                      Load current config
                    </button>
                  </form>

                  <form data-action="quest-update-config" autocomplete="off" class="grid gap-3 sm:grid-cols-2">
                    <label class="text-sm">
                      rotation_day
                      <input name="rotation_day" type="number" min="0" step="1"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="0-6" />
                    </label>

                    <label class="text-sm">
                      rotation_hour
                      <input name="rotation_hour" type="number" min="0" max="23" step="1"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="0-23" />
                    </label>

                    <label class="text-sm">
                      easy_quest_count
                      <input name="easy_quest_count" type="number" min="0" step="1"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="3" />
                    </label>

                    <label class="text-sm">
                      medium_quest_count
                      <input name="medium_quest_count" type="number" min="0" step="1"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="2" />
                    </label>

                    <label class="text-sm sm:col-span-2">
                      hard_quest_count
                      <input name="hard_quest_count" type="number" min="0" step="1"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="1" />
                    </label>

                    <div class="sm:col-span-2">
                      <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                        Save
                      </button>
                    </div>
                  </form>

                  <pre data-out="quest-config" class="hidden"></pre>
                  <pre data-out="quest-config-update-res" class="hidden"></pre>
                </article>
              </div>

              {{-- Subpanel: Update quest --}}
              <div data-subpanel="quest-update" class="hidden space-y-6">

                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 class="font-semibold">Weekly quest manager</h3>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">Load the weekly quests, pick one from the dropdown, then edit and save from the same panel.</p>
                    </div>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET /api/quests?user_id=…</span>
                  </div>

                  <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-950/40 p-4 space-y-4">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 class="font-semibold">Weekly source</h4>
                        <p class="text-xs text-zinc-500 dark:text-zinc-400">Uses <code>window.user_id</code> to fetch the current weekly set.</p>
                      </div>
                      <span data-quest-weekly-count class="inline-flex items-center rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-3 py-1 text-xs text-zinc-500 dark:text-zinc-300">
                        No quests loaded
                      </span>
                    </div>

                    <form data-action="quest-get-weekly" data-form-ux="1" autocomplete="off">
                      <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                        Load weekly quests
                      </button>
                    </form>

                    <label class="block text-sm">
                      Loaded quest
                      <div id="modQuestWeeklyPicker" class="relative mt-1" data-dd-select data-dd-field="quest_pick">
                        <button
                          type="button"
                          data-dd-btn
                          data-placeholder="Select a loaded quest"
                          aria-haspopup="listbox"
                          aria-expanded="false"
                          class="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        >
                          <span class="dd-label truncate">Select a loaded quest</span>
                          <svg class="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clip-rule="evenodd"></path>
                          </svg>
                        </button>
                        <div
                          data-dd-list
                          role="listbox"
                          class="custom-multiselect-list absolute top-full left-0 right-0 z-50 mt-0 hidden max-h-[260px] overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl"
                        >
                          <div class="px-2 py-2 text-xs text-zinc-500 dark:text-zinc-400">
                            Load weekly quests first.
                          </div>
                        </div>
                        <select name="quest_pick" class="hidden" aria-hidden="true">
                          <option value="">Select a loaded quest</option>
                        </select>
                      </div>
                    </label>
                  </div>

                  <div>
                    <h4 class="font-semibold">Patch quest</h4>
                  </div>

                  <form data-action="quest-update-quest" data-form-ux="1" autocomplete="off" class="grid gap-4 sm:grid-cols-2">
                    <label class="text-sm sm:col-span-1">
                      quest_id
                      <input
                        name="quest_id"
                        type="number"
                        min="1"
                        step="1"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="1"
                        required
                      />
                    </label>

                    <label class="text-sm sm:col-span-1">
                      difficulty
                      <div class="relative mt-1" data-dd-select data-dd-field="difficulty">
                        <button
                          type="button"
                          data-dd-btn
                          data-placeholder="(no change)"
                          aria-haspopup="listbox"
                          aria-expanded="false"
                          class="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        >
                          <span class="dd-label truncate">(no change)</span>
                          <svg class="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clip-rule="evenodd"></path>
                          </svg>
                        </button>
                        <div
                          data-dd-list
                          role="listbox"
                          class="custom-multiselect-list absolute top-full left-0 right-0 z-50 mt-0 hidden max-h-[220px] overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl"
                        >
                          <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                            <input type="radio" name="difficulty_ui" value="" data-label="(no change)" class="accent-emerald-500" checked>
                            <span>(no change)</span>
                          </label>
                          <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                            <input type="radio" name="difficulty_ui" value="easy" data-label="easy" class="accent-emerald-500">
                            <span>easy</span>
                          </label>
                          <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                            <input type="radio" name="difficulty_ui" value="medium" data-label="medium" class="accent-emerald-500">
                            <span>medium</span>
                          </label>
                          <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                            <input type="radio" name="difficulty_ui" value="hard" data-label="hard" class="accent-emerald-500">
                            <span>hard</span>
                          </label>
                        </div>
                        <select name="difficulty" class="hidden" aria-hidden="true">
                          <option value="">(no change)</option>
                          <option value="easy">easy</option>
                          <option value="medium">medium</option>
                          <option value="hard">hard</option>
                        </select>
                      </div>
                    </label>

                    <label class="text-sm sm:col-span-1">
                      name
                      <input
                        name="name"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>

                    <label class="text-sm sm:col-span-1">
                      description
                      <input
                        name="description"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>

                    <label class="text-sm sm:col-span-1">
                      coin_reward
                      <input
                        name="coin_reward"
                        type="number"
                        min="0"
                        step="1"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="50"
                      />
                    </label>

                    <label class="text-sm sm:col-span-1">
                      xp_reward
                      <input
                        name="xp_reward"
                        type="number"
                        min="0"
                        step="1"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="100"
                      />
                    </label>

                    <label class="text-sm sm:col-span-2">
                      is_active
                      <div id="modQuestIsActiveDropdown" class="fake-select relative mt-1" data-open="0">
                        <button
                          type="button"
                          class="fake-select-btn flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          data-placeholder="(no change)"
                          aria-haspopup="listbox"
                          aria-expanded="false"
                        >
                          <span class="cm-label truncate">(no change)</span>
                          <svg class="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clip-rule="evenodd"/>
                          </svg>
                        </button>

                        <div
                          class="fake-select-list custom-multiselect-list absolute left-0 right-0 mt-1 hidden max-h-[220px] overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl"
                          role="listbox"
                        >
                          <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                            <input type="radio" name="is_active" value="" data-label="(no change)" class="h-4 w-4 accent-emerald-500">
                            <span class="min-w-0 truncate">(no change)</span>
                          </label>
                          <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                            <input type="radio" name="is_active" value="1" data-label="true" class="h-4 w-4 accent-emerald-500">
                            <span class="min-w-0 truncate">true</span>
                          </label>
                          <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                            <input type="radio" name="is_active" value="0" data-label="false" class="h-4 w-4 accent-emerald-500">
                            <span class="min-w-0 truncate">false</span>
                          </label>
                        </div>
                      </div>
                    </label>

                    <label class="text-sm sm:col-span-2">
                      requirements_json
                      <textarea
                        name="requirements_json"
                        rows="6"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder='{"type":"play_maps","count":3}'
                      ></textarea>
                    </label>

                    <div class="sm:col-span-2 flex flex-wrap items-center gap-2">
                      <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                        Save
                      </button>
                      <button
                        type="button"
                        data-reset-form
                        class="w-full sm:w-auto cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 px-4 py-2 font-semibold hover:bg-zinc-100 dark:hover:bg-white/5"
                      >
                        Reset
                      </button>
                    </div>
                  </form>

                  <pre data-out="quest-weekly-out" class="hidden"></pre>
                  <pre data-out="quest-update-res" class="hidden"></pre>
                </article>
              </div>

              {{-- Subpanel: Rotation --}}
              <div data-subpanel="quest-rotation" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
                  <div class="flex items-center justify-between">
                    <h3 class="font-semibold">Generate quest rotation</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /mods/quests/rotation/generate</span>
                  </div>

                  <form data-action="quest-generate-rotation" autocomplete="off">
                    <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                      Generate
                    </button>
                  </form>
                </article>
              </div>

              {{-- Subpanel: User progress --}}
              <div data-subpanel="quest-user-progress" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-6">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 class="font-semibold">User quest progress</h3>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">Load a user's quest progress, pick an entry, then patch the selection without leaving the panel.</p>
                    </div>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET /api/quests?user_id=... + PATCH /mods/quests/admin/users/{user_id}/progress/{progress_id}</span>
                  </div>

                  <form data-action="quest-get-user-progress" data-form-ux="1" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <label class="text-sm md:col-span-1">
                        User name
                        <input name="user_id" type="text" autocomplete="off" spellcheck="false"
                          class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          placeholder="Type a username…" />
                      </label>

                      <label class="text-sm md:col-span-2">
                        Progress entry
                        <div id="modQuestUserProgressPick" class="relative mt-1" data-dd-select>
                          <button type="button" data-dd-btn data-placeholder="Select a progress…" aria-haspopup="listbox" aria-expanded="false"
                            class="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none">
                            <span class="dd-label truncate">Select a progress…</span>
                            <svg class="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clip-rule="evenodd"></path>
                            </svg>
                          </button>

                          <div data-dd-list role="listbox"
                            class="custom-multiselect-list absolute top-full left-0 right-0 z-50 mt-0 hidden max-h-[260px] overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl">
                            <div class="px-2 py-2 text-xs text-zinc-500 dark:text-zinc-400">
                              Load a user first.
                            </div>
                          </div>

                          {{-- mirror selected radio into a stable hidden input --}}
                          <input type="hidden" name="pick_progress_id" value="" />
                        </div>
                      </label>
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                      <button type="submit"
                        class="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 active:bg-emerald-800">
                        Load
                      </button>

                      <button type="button" data-action="quest-fill-user-progress"
                        class="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-black/90 active:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-white/90">
                        Fill form from selection
                      </button>
                    </div>

                  </form>

                  <div class="h-px bg-zinc-200/80 dark:bg-white/10"></div>

                  <div>
                    <h4 class="font-semibold">Patch selected progress</h4>
                  </div>

                  <form data-action="quest-update-user-progress" data-form-ux="1" class="space-y-5">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <label class="text-sm">
                        user_id
                        <input name="user_id" type="text" inputmode="numeric" readonly
                          class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900/60 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-200 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          placeholder="Load a user first" />
                      </label>

                      <label class="text-sm">
                        progress_id
                        <input name="progress_id" type="text" inputmode="numeric" readonly
                          class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900/60 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-200 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          placeholder="Select a progress first" />
                      </label>

                      <label class="text-sm">
                        completed
                        <div class="relative mt-1" data-dd-select>
                          <button type="button" data-dd-btn data-placeholder="(no change)" aria-haspopup="listbox" aria-expanded="false"
                            class="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none">
                            <span class="dd-label truncate">(no change)</span>
                            <svg class="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clip-rule="evenodd"></path>
                            </svg>
                          </button>
                          <div data-dd-list role="listbox"
                            class="custom-multiselect-list absolute top-full left-0 right-0 z-50 mt-0 hidden max-h-[220px] overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl">
                            <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                              <input class="hidden" type="radio" name="completed" value="" checked data-label="(no change)" />
                              <span class="text-zinc-700 dark:text-zinc-200">(no change)</span>
                            </label>
                            <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                              <input class="hidden" type="radio" name="completed" value="1" data-label="true" />
                              <span class="text-zinc-700 dark:text-zinc-200">true</span>
                            </label>
                            <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                              <input class="hidden" type="radio" name="completed" value="0" data-label="false" />
                              <span class="text-zinc-700 dark:text-zinc-200">false</span>
                            </label>
                          </div>
                        </div>
                      </label>

                      <label class="text-sm">
                        claimed
                        <div class="relative mt-1" data-dd-select>
                          <button type="button" data-dd-btn data-placeholder="(no change)" aria-haspopup="listbox" aria-expanded="false"
                            class="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none">
                            <span class="dd-label truncate">(no change)</span>
                            <svg class="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clip-rule="evenodd"></path>
                            </svg>
                          </button>
                          <div data-dd-list role="listbox"
                            class="custom-multiselect-list absolute top-full left-0 right-0 z-50 mt-0 hidden max-h-[220px] overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl">
                            <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                              <input class="hidden" type="radio" name="claimed" value="" checked data-label="(no change)" />
                              <span class="text-zinc-700 dark:text-zinc-200">(no change)</span>
                            </label>
                            <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                              <input class="hidden" type="radio" name="claimed" value="1" data-label="true" />
                              <span class="text-zinc-700 dark:text-zinc-200">true</span>
                            </label>
                            <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                              <input class="hidden" type="radio" name="claimed" value="0" data-label="false" />
                              <span class="text-zinc-700 dark:text-zinc-200">false</span>
                            </label>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-950/40 p-4 space-y-4">
                      <h4 class="font-semibold">quest_data</h4>

                      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label class="text-sm md:col-span-1">
                          name
                          <input name="qd_name" type="text"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                        </label>

                        <label class="text-sm md:col-span-2">
                          description
                          <input name="qd_description" type="text"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                        </label>

                        <label class="text-sm">
                          difficulty
                          <input name="qd_difficulty" type="text"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                        </label>

                        <label class="text-sm">
                          coin_reward
                          <input name="qd_coin_reward" type="text" inputmode="numeric"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" placeholder="0" />
                        </label>

                        <label class="text-sm">
                          xp_reward
                          <input name="qd_xp_reward" type="text" inputmode="numeric"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" placeholder="0" />
                        </label>

                        <label class="text-sm">
                          bounty_type
                          <div class="relative mt-1" data-dd-select>
                            <button type="button" data-dd-btn data-placeholder="(null / no change)" aria-haspopup="listbox" aria-expanded="false"
                              class="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none">
                              <span class="dd-label truncate">(null / no change)</span>
                              <svg class="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clip-rule="evenodd"></path>
                              </svg>
                            </button>
                            <div data-dd-list role="listbox"
                              class="custom-multiselect-list absolute top-full left-0 right-0 z-50 mt-0 hidden max-h-[220px] overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl">
                              <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                                <input class="hidden" type="radio" name="qd_bounty_type" value="" checked data-label="(null / no change)" />
                                <span class="text-zinc-700 dark:text-zinc-200">(null / no change)</span>
                              </label>
                              <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                                <input class="hidden" type="radio" name="qd_bounty_type" value="rival_challenge" data-label="rival_challenge" />
                                <span class="text-zinc-700 dark:text-zinc-200">rival_challenge</span>
                              </label>
                              <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                                <input class="hidden" type="radio" name="qd_bounty_type" value="medal_threshold" data-label="medal_threshold" />
                                <span class="text-zinc-700 dark:text-zinc-200">medal_threshold</span>
                              </label>
                              <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                                <input class="hidden" type="radio" name="qd_bounty_type" value="personal_best" data-label="personal_best" />
                                <span class="text-zinc-700 dark:text-zinc-200">personal_best</span>
                              </label>
                            </div>
                          </div>
                        </label>
                      </div>

                      <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/70 dark:bg-white/5 p-4 space-y-4">
                        <h5 class="font-semibold">requirements</h5>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <label class="text-sm">
                            type
                            <input name="req_type" type="text"
                              class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                          </label>

                          <label class="text-sm">
                            count
                            <input name="req_count" type="text" inputmode="numeric"
                              class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                          </label>

                          <label class="text-sm">
                            difficulty
                            <input name="req_difficulty" type="text"
                              class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                          </label>

                          <label class="text-sm">
                            category
                            <input name="req_category" type="text"
                              class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                          </label>

                          <label class="text-sm">
                            medal_type
                            <input name="req_medal_type" type="text"
                              class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                          </label>

                          <label class="text-sm">
                            map_id
                            <input name="req_map_id" type="text" inputmode="numeric"
                              class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                          </label>

                          <label class="text-sm">
                            target_time
                            <input name="req_target_time" type="text" inputmode="decimal"
                              class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                          </label>

                          <label class="text-sm">
                            target_type
                            <div class="relative mt-1" data-dd-select>
                              <button type="button" data-dd-btn data-placeholder="(no change)" aria-haspopup="listbox" aria-expanded="false"
                                class="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none">
                                <span class="dd-label truncate">(no change)</span>
                                <svg class="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clip-rule="evenodd"></path>
                                </svg>
                              </button>
                              <div data-dd-list role="listbox"
                                class="custom-multiselect-list absolute top-full left-0 right-0 z-50 mt-0 hidden max-h-[220px] overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl">
                                <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                                  <input class="hidden" type="radio" name="req_target_type" value="" checked data-label="(no change)" />
                                  <span class="text-zinc-700 dark:text-zinc-200">(no change)</span>
                                </label>
                                <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                                  <input class="hidden" type="radio" name="req_target_type" value="rival_challenge" data-label="rival_challenge" />
                                  <span class="text-zinc-700 dark:text-zinc-200">rival_challenge</span>
                                </label>
                                <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                                  <input class="hidden" type="radio" name="req_target_type" value="medal_threshold" data-label="medal_threshold" />
                                  <span class="text-zinc-700 dark:text-zinc-200">medal_threshold</span>
                                </label>
                                <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                                  <input class="hidden" type="radio" name="req_target_type" value="personal_best" data-label="personal_best" />
                                  <span class="text-zinc-700 dark:text-zinc-200">personal_best</span>
                                </label>
                                <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                                  <input class="hidden" type="radio" name="req_target_type" value="personal_improvement" data-label="personal_improvement" />
                                  <span class="text-zinc-700 dark:text-zinc-200">personal_improvement</span>
                                </label>
                              </div>
                            </div>
                          </label>

                          <label class="text-sm">
                            rival_user_id
                            <input name="req_rival_user_id" type="text" inputmode="numeric"
                              class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                          </label>

                          <label class="text-sm">
                            rival_time
                            <input name="req_rival_time" type="text" inputmode="decimal"
                              class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                          </label>

                          <label class="text-sm">
                            target
                            <input name="req_target" type="text"
                              class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                          </label>

                          <label class="text-sm">
                            min_count
                            <input name="req_min_count" type="text" inputmode="numeric"
                              class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-950/40 p-4 space-y-4">
                      <h4 class="font-semibold">progress</h4>

                      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label class="text-sm">
                          current
                          <input name="pr_current" type="text" inputmode="numeric"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                        </label>

                        <label class="text-sm">
                          target
                          <input name="pr_target" type="text" inputmode="numeric"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                        </label>

                        <label class="text-sm">
                          percentage
                          <input name="pr_percentage" type="text" inputmode="decimal"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                        </label>

                        <label class="text-sm md:col-span-3">
                          details (JSON object)
                          <textarea name="pr_details_json" rows="3" spellcheck="false"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                            placeholder="{}"></textarea>
                        </label>

                        <label class="text-sm md:col-span-2">
                          completed_map_ids (CSV)
                          <input name="pr_completed_map_ids" type="text"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                            placeholder="1,2,3" />
                        </label>

                        <label class="text-sm">
                          counted_map_ids (CSV)
                          <input name="pr_counted_map_ids" type="text"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                            placeholder="1,2,3" />
                        </label>

                        <label class="text-sm">
                          map_id
                          <input name="pr_map_id" type="text" inputmode="numeric"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                        </label>

                        <label class="text-sm">
                          target_time
                          <input name="pr_target_time" type="text" inputmode="decimal"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                        </label>

                        <label class="text-sm">
                          target_type
                          <div class="relative mt-1" data-dd-select>
                            <button type="button" data-dd-btn data-placeholder="(no change)" aria-haspopup="listbox" aria-expanded="false"
                              class="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none">
                              <span class="dd-label truncate">(no change)</span>
                              <svg class="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clip-rule="evenodd"></path>
                              </svg>
                            </button>
                            <div data-dd-list role="listbox"
                              class="custom-multiselect-list absolute top-full left-0 right-0 z-50 mt-0 hidden max-h-[220px] overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl">
                              <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                                <input class="hidden" type="radio" name="pr_target_type" value="" checked data-label="(no change)" />
                                <span class="text-zinc-700 dark:text-zinc-200">(no change)</span>
                              </label>
                              <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                                <input class="hidden" type="radio" name="pr_target_type" value="rival_challenge" data-label="rival_challenge" />
                                <span class="text-zinc-700 dark:text-zinc-200">rival_challenge</span>
                              </label>
                              <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                                <input class="hidden" type="radio" name="pr_target_type" value="medal_threshold" data-label="medal_threshold" />
                                <span class="text-zinc-700 dark:text-zinc-200">medal_threshold</span>
                              </label>
                              <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                                <input class="hidden" type="radio" name="pr_target_type" value="personal_best" data-label="personal_best" />
                                <span class="text-zinc-700 dark:text-zinc-200">personal_best</span>
                              </label>
                              <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                                <input class="hidden" type="radio" name="pr_target_type" value="personal_improvement" data-label="personal_improvement" />
                                <span class="text-zinc-700 dark:text-zinc-200">personal_improvement</span>
                              </label>
                            </div>
                          </div>
                        </label>

                        <label class="text-sm">
                          medal_type
                          <input name="pr_medal_type" type="text"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                        </label>

                        <label class="text-sm">
                          best_attempt
                          <input name="pr_best_attempt" type="text" inputmode="decimal"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                        </label>

                        <label class="text-sm">
                          last_attempt
                          <input name="pr_last_attempt" type="text" inputmode="decimal"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                        </label>

                        <label class="text-sm">
                          rival_user_id
                          <input name="pr_rival_user_id" type="text" inputmode="numeric"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                        </label>

                        <label class="text-sm">
                          rival_time
                          <input name="pr_rival_time" type="text" inputmode="decimal"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                        </label>

                        <label class="text-sm">
                          completed
                          <div class="relative mt-1" data-dd-select>
                            <button type="button" data-dd-btn data-placeholder="(no change)" aria-haspopup="listbox" aria-expanded="false"
                              class="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none">
                              <span class="dd-label truncate">(no change)</span>
                              <svg class="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clip-rule="evenodd"></path>
                              </svg>
                            </button>
                            <div data-dd-list role="listbox"
                              class="custom-multiselect-list absolute top-full left-0 right-0 z-50 mt-0 hidden max-h-[220px] overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl">
                              <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                                <input class="hidden" type="radio" name="pr_completed" value="" checked data-label="(no change)" />
                                <span class="text-zinc-700 dark:text-zinc-200">(no change)</span>
                              </label>
                              <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                                <input class="hidden" type="radio" name="pr_completed" value="1" data-label="true" />
                                <span class="text-zinc-700 dark:text-zinc-200">true</span>
                              </label>
                              <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                                <input class="hidden" type="radio" name="pr_completed" value="0" data-label="false" />
                                <span class="text-zinc-700 dark:text-zinc-200">false</span>
                              </label>
                            </div>
                          </div>
                        </label>

                        <label class="text-sm">
                          medal_earned
                          <input name="pr_medal_earned" type="text"
                            class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                        </label>
                      </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                      <button type="submit"
                        class="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 active:bg-emerald-800">
                        Patch
                      </button>
                      <button
                        type="button"
                        data-reset-form
                        class="rounded-lg border border-zinc-200/80 dark:border-white/10 px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-white/5"
                      >
                        Reset
                      </button>
                    </div>
                  </form>

                  <pre data-out="quest-user-progress-res" class="hidden"></pre>
                </article>
              </div>
            </div>

            {{-- ============ DEVS (WEB) ============ --}}
            <div data-panel="devs" class="mod-panel hidden space-y-4">
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

              <div class="empty-state rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 text-zinc-600 dark:text-zinc-300">
                Choose a Web action.
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
                    class="cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 transition hover:bg-zinc-100 dark:hover:bg-white/10"
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
          <span class="inline-flex shrink-0 h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10">
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
