@extends('layouts.app')

@section('title', 'Moderator Panel')
@section('og:title', 'Moderator Panel')
@section('og:description', 'Internal tools for moderators')

@section('content')
  <section class="mod-ui relative overflow-hidden min-h-[100vh] text-zinc-900 dark:text-white selection:bg-emerald-500/30 selection:text-white [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button[disabled]]:cursor-not-allowed [&_button:focus]:outline-none [&_button:focus]:ring-1 [&_button:focus]:ring-emerald-500/30">
    <style>
      .mod-ui {
        --mod-panel: rgba(255, 255, 255, .62);
        --mod-panel-strong: rgba(255, 255, 255, .82);
        --mod-border: rgba(212, 212, 216, .78);
        --mod-muted: rgba(113, 113, 122, 1);
      }

      .dark .mod-ui {
        --mod-panel: rgba(24, 24, 27, .58);
        --mod-panel-strong: rgba(39, 39, 42, .68);
        --mod-border: rgba(255, 255, 255, .11);
        --mod-muted: rgba(161, 161, 170, 1);
      }

      .mod-ui::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          radial-gradient(circle at 16% 10%, rgba(16, 185, 129, .13), transparent 30rem),
          radial-gradient(circle at 84% 18%, rgba(59, 130, 246, .10), transparent 30rem),
          linear-gradient(180deg, rgba(250, 250, 250, .24), transparent 24rem);
      }

      .dark .mod-ui::before {
        background:
          radial-gradient(circle at 16% 10%, rgba(16, 185, 129, .16), transparent 30rem),
          radial-gradient(circle at 84% 18%, rgba(59, 130, 246, .11), transparent 30rem),
          linear-gradient(180deg, rgba(255, 255, 255, .025), transparent 24rem);
      }

      .mod-ui article.fade-in,
      .mod-ui .empty-state,
      .mod-ui [data-workflow-home],
      .mod-ui [data-out-wrap="1"] {
        background: var(--mod-panel);
        border-color: var(--mod-border);
        box-shadow: 0 18px 54px rgba(15, 23, 42, .08);
      }

      .dark .mod-ui article.fade-in,
      .dark .mod-ui .empty-state,
      .dark .mod-ui [data-workflow-home],
      .dark .mod-ui [data-out-wrap="1"] {
        box-shadow: 0 22px 70px rgba(0, 0, 0, .28);
      }

      .mod-ui .mod-subtab {
        border-radius: 999px !important;
        min-height: 2.35rem;
      }

      .mod-ui .mod-subtab.active {
        border-color: rgba(16, 185, 129, .42) !important;
        background: rgba(16, 185, 129, .12) !important;
        color: rgb(4, 120, 87) !important;
      }

      .dark .mod-ui .mod-subtab.active {
        color: rgb(167, 243, 208) !important;
      }

      .mod-ui .mod-tab.active {
        border-color: rgba(16, 185, 129, .42) !important;
        background: linear-gradient(135deg, rgba(16, 185, 129, .13), rgba(59, 130, 246, .06)) !important;
      }

      .mod-ui [data-workflow-card] {
        background: var(--mod-panel-strong);
        border-color: var(--mod-border);
        transition: border-color 160ms ease, transform 160ms ease, background 160ms ease;
      }

      .mod-ui [data-workflow-card]:hover {
        transform: translateY(-1px);
        border-color: rgba(16, 185, 129, .42);
      }

      .mod-ui .mod-endpoint-badge {
        display: inline-flex;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border: 1px solid var(--mod-border);
        border-radius: .75rem;
        padding: .25rem .5rem;
        background: rgba(255, 255, 255, .46);
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      }

      .dark .mod-ui .mod-endpoint-badge {
        background: rgba(255, 255, 255, .045);
      }
    </style>
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

      @php($canModerate = session('is_mod') === true)
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
                data-tab="guides"
                data-tab-label="Guides"
                class="mod-tab group flex min-w-0 w-full items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(16,185,129,.08)]"
                type="button"
              >
                <span class="inline-flex shrink-0 h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 transition group-hover:bg-white/10">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M4 6h16v2H4V6m0 4h10v2H4v-2m0 4h16v2H4v-2Z" />
                  </svg>
                </span>
                <span class="min-w-0 flex-1 truncate">Guides</span>
                <span class="shrink-0 whitespace-nowrap text-[10px] text-zinc-500">Maps</span>
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
                data-tab="moderation"
                data-tab-label="Moderation"
                class="mod-tab group flex min-w-0 w-full items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(16,185,129,.08)]"
                type="button"
              >
                <span class="inline-flex shrink-0 h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-300/60 dark:ring-white/10 transition group-hover:bg-white/10">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M12 1l3 5h6l-4.5 4l1.5 6l-6-3.5L6 16l1.5-6L3 6h6Z" />
                  </svg>
                </span>
                <span class="min-w-0 flex-1 truncate">Moderation</span>
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
            <div data-panel="users" class="mod-panel space-y-4">
              {{-- Sub-nav --}}
              <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="users-get"
                >
                  Get user
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="users-get-ow"
                >
                  Get overwatch usernames
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="users-link"
                >
                  Link fake → real
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="users-overwatch"
                >
                  Replace overwatch usernames
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="users-update"
                >
                  Update usernames
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="users-create"
                >
                  Create fake member
                </button>
              </div>

              {{-- Empty state tant qu’aucune sous-action n’est choisie --}}
              <div
                class="empty-state rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 text-zinc-600 dark:text-zinc-300"
              >
                Choose a Users action above.
              </div>

              {{-- Subpanel: GET USER --}}
              <div data-subpanel="users-get" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Get User</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET /api/mods/users/{user_id}</span>
                  </div>
                  <form data-action="get-user" autocomplete="off" class="grid gap-3 sm:grid-cols-3">
                    <label>
                      User name
                      <input
                        name="user_id"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
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
                <div
                  data-user-endpoint-response="get-user"
                  class="hidden"
                  aria-live="polite"
                ></div>
              </div>

              {{-- Subpanel: GET OW USERNAMES --}}
              <div data-subpanel="users-get-ow" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Get Overwatch Usernames</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">
                      GET /api/mods/users/{user_id}/overwatch
                    </span>
                  </div>
                  <form
                    data-action="get-ow-usernames"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3"
                  >
                    <label>
                      User name
                      <input
                        name="user_id"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
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
                <div
                  data-user-endpoint-response="get-ow-usernames"
                  class="hidden"
                  aria-live="polite"
                ></div>
              </div>

              {{-- Subpanel: LINK --}}
              <div data-subpanel="users-link" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Link fake member to real user</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">
                      PUT /api/mods/users/fake/{fake_user_id}/link/{real_user_id}
                    </span>
                  </div>
                  <form
                    data-action="link-fake"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-2"
                  >
                    <label>
                      Fake User name
                      <input
                        name="fake_user_id"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <label>
                      Real User name
                      <input
                        name="real_user_id"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <button
                      class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100 sm:col-span-2"
                    >
                      Link
                    </button>
                  </form>
                </article>
                <div
                  data-user-endpoint-response="link-fake"
                  class="hidden"
                  aria-live="polite"
                ></div>
              </div>

              {{-- Subpanel: REPLACE OW --}}
              <div data-subpanel="users-overwatch" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Replace Overwatch Usernames</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">
                      PUT /api/mods/users/{user_id}/overwatch
                    </span>
                  </div>
                  <form data-action="replace-overwatch" autocomplete="off" class="grid gap-4">
                    <div class="grid gap-3 sm:grid-cols-2">
                      <label>
                        User name
                        <input
                          name="user_id"
                          class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
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
                          class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          placeholder="Genji#1111"
                        />
                      </label>
                      <label>
                        Is primary #1
                        <div class="relative mt-1" data-dd-select>
                          <button
                            type="button"
                            data-dd-btn
                            class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                          >
                            <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">false</span>
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
                          >
                            <label
                              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                          class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          placeholder="Genji#2222"
                        />
                      </label>
                      <label>
                        Is primary #2
                        <div class="relative mt-1" data-dd-select>
                          <button
                            type="button"
                            data-dd-btn
                            class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                          >
                            <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">false</span>
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
                          >
                            <label
                              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                          class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          placeholder="Genji#3333"
                        />
                      </label>
                      <label>
                        Is primary #3
                        <div class="relative mt-1" data-dd-select>
                          <button
                            type="button"
                            data-dd-btn
                            class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                          >
                            <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">false</span>
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
                          >
                            <label
                              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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

                    <p class="-mt-1 text-xs text-zinc-500 dark:text-zinc-400">
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
                <div
                  data-user-endpoint-response="replace-overwatch"
                  class="hidden"
                  aria-live="polite"
                ></div>
              </div>

              {{-- Subpanel: UPDATE NAMES --}}
              <div data-subpanel="users-update" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Update user names</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">PATCH /api/mods/users/{user_id}</span>
                  </div>
                  <form
                    data-action="update-names"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-2"
                  >
                    <label>
                      User name
                      <input
                        name="user_id"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="12345"
                      />
                    </label>
                    <div></div>
                    <label>
                      Global name
                      <input
                        name="global_name"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="(opt.)"
                      />
                    </label>
                    <label>
                      Nickname
                      <input
                        name="nickname"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="(opt.)"
                      />
                    </label>
                    <div class="text-xs text-zinc-500 dark:text-zinc-400 sm:col-span-2">
                      At least one of the two fields is required.
                    </div>
                    <button
                      class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100 sm:col-span-2"
                    >
                      Update
                    </button>
                  </form>
                </article>
                <div
                  data-user-endpoint-response="update-names"
                  class="hidden"
                  aria-live="polite"
                ></div>
              </div>

              {{-- Subpanel: CREATE FAKE --}}
              <div data-subpanel="users-create" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Create fake member</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /api/mods/users/fake?name=</span>
                  </div>
                  <form
                    data-action="create-fake"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-2"
                  >
                    <label class="text-sm text-zinc-600 dark:text-zinc-300 sm:col-span-2">
                      Name
                      <input
                        name="name"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
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
                <div
                  data-user-endpoint-response="create-fake"
                  class="hidden"
                  aria-live="polite"
                ></div>
              </div>
            </div>

            {{-- ============ LOOTBOX ============ --}}
            <div data-panel="lootbox" class="mod-panel hidden space-y-4">
              <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="lootbox-key"
                >
                  Grant key
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="lootbox-xp"
                >
                  Grant XP
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="lootbox-reward"
                >
                  Grant reward
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="lootbox-get-keys"
                >
                  Get user keys
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="lootbox-get-rewards"
                >
                  Get user rewards
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="lootbox-view-all"
                >
                  View all rewards
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="lootbox-set-active-key"
                >
                  Set active key type
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="lootbox-get-xp-multiplier"
                >
                  Get XP Multiplier
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="lootbox-set-xp-multiplier"
                >
                  Set XP Multiplier
                </button>
              </div>
              <div
                class="empty-state rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 text-zinc-600 dark:text-zinc-300"
              >
                Choose a Lootbox action.
              </div>

              {{-- Grant key --}}
              <div data-subpanel="lootbox-key" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Grant key to user</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">
                      POST /api/mods/lootbox/users/{user_id}/keys/{key_type}
                    </span>
                  </div>
                  <form
                    data-action="grant-key"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3"
                  >
                    <label>
                      User name
                      <input
                        name="user_id"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <label>
                      Key type
                      <div class="relative mt-1" data-dd-select>
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Classic</span>
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
                          class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"
                        >
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Spring"
                              class="accent-emerald-500"
                              data-label="Spring"
                            />
                            <span>Spring</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Autumn"
                              class="accent-emerald-500"
                              data-label="Autumn"
                            />
                            <span>Autumn</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Summer"
                              class="accent-emerald-500"
                              data-label="Summer"
                            />
                            <span>Summer</span>
                          </label>

                        </div>
                      </div>
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Grant key
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              {{-- Grant XP --}}
              <div data-subpanel="lootbox-xp" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Grant XP to User</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">
                      POST /api/mods/lootbox/users/{user_id}/xp
                    </span>
                  </div>
                  <form data-action="grant-xp" autocomplete="off" class="grid gap-3 sm:grid-cols-3">
                    <label>
                      User name
                      <input
                        name="user_id"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>

                    <label>
                      Amount
                      <input
                        name="amount"
                        type="number"
                        step="1"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="100"
                      />
                    </label>

                    
                    <label class="text-sm">
                      Type
                      <div id="modXpTypeDropdown" class="fake-select relative mt-1" data-open="0">
                        <button
                          type="button"
                          class="fake-select-btn flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          data-placeholder="Other"
                          aria-haspopup="listbox"
                          aria-expanded="false"
                        >
                          <span class="cm-label truncate">Other</span>
                          <svg class="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clip-rule="evenodd"/>
                          </svg>
                        </button>

                        <div
                          class="fake-select-list custom-multiselect-list absolute top-full left-0 right-0 mt-0 hidden max-h-[260px] overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 p-1 shadow-xl"
                          role="listbox"
                        >
                          <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                            <input type="radio" name="type" value="Map Submission" data-label="Map Submission" class="h-4 w-4 accent-emerald-500">
                            <span class="min-w-0 truncate">Map Submission</span>
                          </label>
                          <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                            <input type="radio" name="type" value="Playtest" data-label="Playtest" class="h-4 w-4 accent-emerald-500">
                            <span class="min-w-0 truncate">Playtest</span>
                          </label>
                          <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                            <input type="radio" name="type" value="Guide" data-label="Guide" class="h-4 w-4 accent-emerald-500">
                            <span class="min-w-0 truncate">Guide</span>
                          </label>
                          <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                            <input type="radio" name="type" value="Completion" data-label="Completion" class="h-4 w-4 accent-emerald-500">
                            <span class="min-w-0 truncate">Completion</span>
                          </label>
                          <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                            <input type="radio" name="type" value="Record" data-label="Record" class="h-4 w-4 accent-emerald-500">
                            <span class="min-w-0 truncate">Record</span>
                          </label>
                          <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                            <input type="radio" name="type" value="World Record" data-label="World Record" class="h-4 w-4 accent-emerald-500">
                            <span class="min-w-0 truncate">World Record</span>
                          </label>
                          <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10">
                            <input type="radio" name="type" value="Other" data-label="Other" class="h-4 w-4 accent-emerald-500" checked>
                            <span class="min-w-0 truncate">Other</span>
                          </label>
                        </div>
                      </div>
                    </label>

                    <label class="sm:col-span-3">
                      Reason (optional)
                      <input
                        name="reason"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="Manual grant from moderator panel"
                      />
                    </label>

                    <label class="sm:col-span-3 flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                      <input type="checkbox" name="apply_multiplier" class="h-4 w-4 accent-emerald-500" />
                      Apply XP multiplier
                    </label>

                    <div class="sm:col-span-3">
                      <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                        Grant XP
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              {{-- Grant reward (debug) --}}
              <div data-subpanel="lootbox-reward" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Grant reward (debug)</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">
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
                      User name
                      <input
                        name="user_id"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <label>
                      Key type
                      <div class="relative mt-1" data-dd-select>
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Classic</span>
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
                          class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"
                        >
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Spring"
                              class="accent-emerald-500"
                              data-label="Spring"
                            />
                            <span>Spring</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Autumn"
                              class="accent-emerald-500"
                              data-label="Autumn"
                            />
                            <span>Autumn</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Summer"
                              class="accent-emerald-500"
                              data-label="Summer"
                            />
                            <span>Summer</span>
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
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Any</span>
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
                    </label>
                    <label>
                      Reward name
                      <input
                        name="reward_name"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="reward_name"
                      />
                    </label>
                    <div class="sm:col-span-4">
                      <button
                        class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Grant reward
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              {{-- Get User Keys --}}
              <div data-subpanel="lootbox-get-keys" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Get User Keys</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">
                      GET /api/lootbox/users/{user_id}/keys?key_type=Classic|Winter
                    </span>
                  </div>
                  <form
                    data-action="get-user-keys"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3"
                  >
                    <label>
                      User name
                      <input
                        name="user_id"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <label>
                      Key type (opt.)
                      <div class="relative mt-1" data-dd-select>
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Any</span>
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
                          class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"
                        >
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Spring"
                              class="accent-emerald-500"
                              data-label="Spring"
                            />
                            <span>Spring</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Autumn"
                              class="accent-emerald-500"
                              data-label="Autumn"
                            />
                            <span>Autumn</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Summer"
                              class="accent-emerald-500"
                              data-label="Summer"
                            />
                            <span>Summer</span>
                          </label>
                        </div>
                      </div>
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Fetch keys
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              {{-- Get User Rewards --}}
              <div data-subpanel="lootbox-get-rewards" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Get User Rewards</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">
                      GET /api/lootbox/users/{user_id}/rewards?reward_type=&key_type=&rarity=
                    </span>
                  </div>
                  <form
                    data-action="get-user-rewards"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-4"
                  >
                    <label>
                      User name
                      <input
                        name="user_id"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <label>
                      Reward type (opt.)
                      <div id="gr-rewardTypeDropdown" class="relative mt-1">
                        <input type="hidden" name="reward_type" value="" />

                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Any</span>
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
                    </label>
                    <label>
                      Key type (opt.)
                      <div class="relative mt-1" data-dd-select>
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Any</span>
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
                          class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"
                        >
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Spring"
                              class="accent-emerald-500"
                              data-label="Spring"
                            />
                            <span>Spring</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Autumn"
                              class="accent-emerald-500"
                              data-label="Autumn"
                            />
                            <span>Autumn</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Summer"
                              class="accent-emerald-500"
                              data-label="Summer"
                            />
                            <span>Summer</span>
                          </label>
                        </div>
                      </div>
                    </label>
                    <label>
                      Rarity (opt.)
                      <input
                        name="rarity"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="Common, Epic, ..."
                      />
                    </label>
                    <div class="sm:col-span-4">
                      <button
                        class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Fetch rewards
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              {{-- View All Rewards --}}
              <div data-subpanel="lootbox-view-all" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">View All Rewards</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">
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
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Any</span>
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
                    </label>

                    <!-- Key type -->
                    <label>
                      Key type (opt.)
                      <div class="relative mt-1" data-dd-select>
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Any</span>
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
                          class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"
                        >
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Spring"
                              class="accent-emerald-500"
                              data-label="Spring"
                            />
                            <span>Spring</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Autumn"
                              class="accent-emerald-500"
                              data-label="Autumn"
                            />
                            <span>Autumn</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Summer"
                              class="accent-emerald-500"
                              data-label="Summer"
                            />
                            <span>Summer</span>
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
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Any</span>
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
                          class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"
                        >
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                        class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Fetch all rewards
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              <!-- Set Active Key Type -->
              <div data-subpanel="lootbox-set-active-key" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Set Active Key Type</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">PATCH /api/lootbox/keys/key_type</span>
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
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Classic</span>
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
                          class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"
                        >
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Spring"
                              class="accent-emerald-500"
                              data-label="Spring"
                            />
                            <span>Spring</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Autumn"
                              class="accent-emerald-500"
                              data-label="Autumn"
                            />
                            <span>Autumn</span>
                          </label>
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <input
                              type="radio"
                              name="key_type"
                              value="Summer"
                              class="accent-emerald-500"
                              data-label="Summer"
                            />
                            <span>Summer</span>
                          </label>
                        </div>
                      </div>
                    </label>

                    <div class="sm:col-span-2">
                      <button
                        class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Set active key type
                      </button>
                    </div>
                  </form>
                </article>
              </div>
              
              <!-- Get XP Multiplier -->
              <div data-subpanel="lootbox-get-xp-multiplier" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Get XP Multiplier</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET /api/lootbox/xp/multiplier</span>
                  </div>

                  <form data-action="get-xp-multiplier" autocomplete="off" class="grid gap-3 sm:grid-cols-2">
                    <div class="sm:col-span-2 text-sm text-zinc-600 dark:text-zinc-300">
                      Returns the current XP multiplier (e.g., <span class="text-zinc-900 dark:text-zinc-100 font-semibold">1</span>,
                      <span class="text-zinc-900 dark:text-zinc-100 font-semibold">2</span> for double XP).
                    </div>

                    <div class="sm:col-span-2">
                      <button
                        class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Fetch XP Multiplier
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              <!-- Set XP Multiplier -->
              <div data-subpanel="lootbox-set-xp-multiplier" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Set XP Multiplier</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /api/lootbox/xp/multiplier</span>
                  </div>

                  <form data-action="set-xp-multiplier" autocomplete="off" class="grid gap-3 sm:grid-cols-2">
                    <label class="sm:col-span-1">
                      Value (1 → 10)
                      <input
                        name="value"
                        type="number"
                        min="1"
                        max="10"
                        step="1"
                        placeholder="1"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>

                    <div class="sm:col-span-2">
                      <button
                        class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Set XP Multiplier
                      </button>
                    </div>

                    <div class="sm:col-span-2 text-xs text-zinc-500 dark:text-zinc-400">
                      Tip: set <span class="text-zinc-800 dark:text-zinc-200 font-semibold">1</span> to disable bonus XP.
                    </div>
                  </form>
                </article>
              </div>

            </div>

            {{-- ============ GUIDES ============ --}}
            <div data-panel="guides" class="mod-panel hidden space-y-4">
              <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="guides-create"
                >
                  Create
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="guides-edit"
                >
                  Edit
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="guides-delete"
                >
                  Delete
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="guides-get"
                >
                  Get Guides
                </button>
              </div>
              <div
                class="empty-state rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 text-zinc-600 dark:text-zinc-300"
              >
                Choose a Guides action.
              </div>

              <div data-subpanel="guides-create" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Create Guide</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /api/v3/maps/{code}/guides</span>
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
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="7SFBH"
                      />
                    </label>
                    <label>
                      URL
                      <input
                        name="url"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="https://..."
                      />
                    </label>
                    <label>
                      User name
                      <input
                        name="user_id"
                        type="text"
                        inputmode="numeric"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              <div data-subpanel="guides-edit" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Edit Guide</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">
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
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <label>
                      New URL
                      <input
                        name="url"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <label>
                      User name
                      <input
                        name="user_id"
                        type="text"
                        inputmode="numeric"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              <div data-subpanel="guides-delete" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Delete Guide</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">
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
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <label>
                      User name
                      <input
                        name="user_id"
                        type="text"
                        inputmode="numeric"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full sm:w-auto cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 px-4 py-2 font-semibold hover:bg-zinc-100 dark:hover:bg-white/5"
                      >
                        Delete
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              {{-- Get Guides --}}
              <div data-subpanel="guides-get" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Get guides</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">
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
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="7SFBH"
                      />
                    </label>
                    <label>
                      Include records
                      <div class="relative mt-1" data-dd-select>
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">false</span>
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
                          class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"
                        >
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                        class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Fetch
                      </button>
                    </div>
                  </form>
                </article>
              </div>
            </div>

            {{-- ============ CONTENT ============ --}}
            <div data-panel="content" class="mod-panel hidden space-y-4">
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

              <div data-subpanel="content-categories" class="hidden space-y-6">
                <div class="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                  <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
                    <div class="flex items-center justify-between gap-4">
                      <h3 class="font-semibold">Create movement tech category</h3>
                      <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /api/mods/content/movement-tech/categories</span>
                    </div>
                    <form data-action="content-category-create" autocomplete="off" class="grid gap-3 sm:grid-cols-2">
                      <label class="text-sm sm:col-span-2">
                        name
                        <input
                          name="name"
                          class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          placeholder="Wall Riding"
                        />
                      </label>
                      <div class="sm:col-span-2">
                        <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                          Create
                        </button>
                      </div>
                    </form>
                  </article>

                  <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-5">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 class="font-semibold">Manage movement tech categories</h3>
                        <p class="text-xs text-zinc-500 dark:text-zinc-400">Refresh the live list, pick a category, then update, reorder or delete it from the same panel.</p>
                      </div>
                      <span class="text-xs text-zinc-500 dark:text-zinc-400">GET + PUT + DELETE + POST /api/mods/content/movement-tech/categories</span>
                    </div>

                    <form data-action="content-category-list" data-form-ux="1" autocomplete="off" class="flex flex-wrap items-center gap-2">
                      <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                        Refresh categories
                      </button>
                      <span data-content-count="categories" class="inline-flex items-center rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-3 py-1 text-xs text-zinc-500 dark:text-zinc-300">
                        No items synced
                      </span>
                    </form>

                    <form data-action="content-category-update" data-form-ux="1" autocomplete="off" class="grid gap-4 sm:grid-cols-2">
                      <label class="text-sm sm:col-span-2">
                        category
                        <div class="relative mt-1" data-dd-select data-content-options="categories" data-placeholder="Select a category">
                          <select name="id" class="hidden">
                            <option value="">Select a category</option>
                          </select>
                          <button
                            type="button"
                            data-dd-btn
                            data-placeholder="Select a category"
                            class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                          >
                            <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Select a category</span>
                            <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                            </svg>
                          </button>
                          <div data-dd-list class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"></div>
                        </div>
                      </label>

                      <label class="text-sm">
                        name
                        <input
                          name="name"
                          class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                          placeholder="Advanced Wall Riding"
                        />
                      </label>

                      <label class="text-sm">
                        direction
                        <div class="relative mt-1" data-dd-select>
                          <select name="direction" class="hidden">
                            <option value="up" selected>Move up</option>
                            <option value="down">Move down</option>
                          </select>
                          <button
                            type="button"
                            data-dd-btn
                            data-placeholder="Move up"
                            class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                          >
                            <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Move up</span>
                            <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                            </svg>
                          </button>
                          <div data-dd-list class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl">
                            <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5">
                              <input type="radio" name="direction_ui" value="up" class="accent-emerald-500" checked data-label="Move up" />
                              <span>Move up</span>
                            </label>
                            <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5">
                              <input type="radio" name="direction_ui" value="down" class="accent-emerald-500" data-label="Move down" />
                              <span>Move down</span>
                            </label>
                          </div>
                        </div>
                      </label>

                      <div class="sm:col-span-2 flex flex-wrap items-center gap-2" data-form-actions="1">
                        <button type="submit" class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                          Update
                        </button>
                        <button type="submit" data-submit-action="content-category-reorder" class="w-full sm:w-auto cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 px-4 py-2 font-semibold hover:bg-zinc-100 dark:hover:bg-white/5">
                          Reorder
                        </button>
                        <button type="submit" data-submit-action="content-category-delete" class="w-full sm:w-auto cursor-pointer rounded-xl border border-rose-500/40 px-4 py-2 font-semibold text-rose-600 dark:text-rose-300 hover:bg-rose-500/10">
                          Delete
                        </button>
                        <button type="button" data-reset-form class="w-full sm:w-auto cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 px-4 py-2 font-semibold hover:bg-zinc-100 dark:hover:bg-white/5">
                          Reset
                        </button>
                      </div>
                    </form>
                  </article>
                </div>

                <pre data-out="content-categories-res" class="hidden"></pre>
              </div>
              <div data-subpanel="content-techniques" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-6">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <h3 class="font-semibold">Create movement technique</h3>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">Use the same custom pickers as the edit panel. Tips and videos keep their visual order as sort order.</p>
                    </div>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /api/mods/content/movement-tech/techniques</span>
                  </div>
                  <form data-action="content-technique-create" autocomplete="off" class="grid gap-4 sm:grid-cols-2">
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
                        placeholder="Jump off a wall to gain height."
                      ></textarea>
                    </label>
                    <label class="text-sm sm:col-span-2">
                      instructions
                      <textarea
                        name="instructions"
                        rows="4"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="Explain the setup, timing and execution."
                      ></textarea>
                    </label>
                    <label class="text-sm">
                      category
                      <div class="relative mt-1" data-dd-select data-content-options="categories" data-placeholder="No category (optional)">
                        <select name="category_id" class="hidden">
                          <option value="">No category (optional)</option>
                        </select>
                        <button
                          type="button"
                          data-dd-btn
                          data-placeholder="No category (optional)"
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">No category (optional)</span>
                          <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                          </svg>
                        </button>
                        <div data-dd-list class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"></div>
                      </div>
                    </label>
                    <label class="text-sm">
                      difficulty
                      <div class="relative mt-1" data-dd-select data-content-options="difficulties" data-placeholder="No difficulty (optional)">
                        <select name="difficulty_id" class="hidden">
                          <option value="">No difficulty (optional)</option>
                        </select>
                        <button
                          type="button"
                          data-dd-btn
                          data-placeholder="No difficulty (optional)"
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">No difficulty (optional)</span>
                          <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                          </svg>
                        </button>
                        <div data-dd-list class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"></div>
                      </div>
                    </label>
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
                    <div class="sm:col-span-2">
                      <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                        Create
                      </button>
                    </div>
                  </form>
                </article>

                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-5">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 class="font-semibold">Manage movement techniques</h3>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">Refresh the live list, pick a technique, then edit, reorder or delete it without leaving the panel.</p>
                    </div>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET + PUT + DELETE + POST /api/mods/content/movement-tech/techniques</span>
                  </div>

                  <form data-action="content-technique-list" data-form-ux="1" autocomplete="off" class="flex flex-wrap items-center gap-2">
                    <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                      Refresh techniques
                    </button>
                    <span data-content-count="techniques" class="inline-flex items-center rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-3 py-1 text-xs text-zinc-500 dark:text-zinc-300">
                      No items synced
                    </span>
                  </form>

                  <form data-action="content-technique-update" data-form-ux="1" autocomplete="off" class="grid gap-4 sm:grid-cols-2">
                    <label class="text-sm sm:col-span-2">
                      technique
                      <div class="relative mt-1" data-dd-select data-content-options="techniques" data-placeholder="Select a technique">
                        <select name="id" class="hidden">
                          <option value="">Select a technique</option>
                        </select>
                        <button
                          type="button"
                          data-dd-btn
                          data-placeholder="Select a technique"
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Select a technique</span>
                          <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                          </svg>
                        </button>
                        <div data-dd-list class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"></div>
                      </div>
                    </label>
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
                        placeholder="Leave blank to keep current value, or type null to clear"
                      ></textarea>
                    </label>
                    <label class="text-sm sm:col-span-2">
                      instructions
                      <textarea
                        name="instructions"
                        rows="4"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="Leave blank to keep current value, or type null to clear"
                      ></textarea>
                    </label>
                    <label class="text-sm">
                      category
                      <div class="relative mt-1" data-dd-select data-content-options="categories" data-placeholder="Keep current category" data-null-option="Clear category">
                        <select name="category_id" class="hidden">
                          <option value="">Keep current category</option>
                          <option value="null">Clear category</option>
                        </select>
                        <button
                          type="button"
                          data-dd-btn
                          data-placeholder="Keep current category"
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Keep current category</span>
                          <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                          </svg>
                        </button>
                        <div data-dd-list class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"></div>
                      </div>
                    </label>
                    <label class="text-sm">
                      difficulty
                      <div class="relative mt-1" data-dd-select data-content-options="difficulties" data-placeholder="Keep current difficulty" data-null-option="Clear difficulty">
                        <select name="difficulty_id" class="hidden">
                          <option value="">Keep current difficulty</option>
                          <option value="null">Clear difficulty</option>
                        </select>
                        <button
                          type="button"
                          data-dd-btn
                          data-placeholder="Keep current difficulty"
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Keep current difficulty</span>
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
                          <div>tips to send on update</div>
                          <p class="text-xs text-zinc-500 dark:text-zinc-400">Add extra rows here. They are saved after the current rows you keep.</p>
                        </div>
                        <button type="button" data-mt-add="tips" class="rounded-xl border border-zinc-200/80 dark:border-white/10 px-3 py-2 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-white/10">
                          Add tip
                        </button>
                      </div>
                      <div data-mt-empty class="rounded-xl border border-dashed border-zinc-200/80 dark:border-white/10 bg-zinc-100/60 dark:bg-white/5 px-3 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                        No tips in this technique.
                      </div>
                      <div data-mt-items class="space-y-3"></div>
                    </div>
                    <label class="sm:col-span-2 inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
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
                          <div>videos to send on update</div>
                          <p class="text-xs text-zinc-500 dark:text-zinc-400">Add extra rows here. They are saved after the current rows you keep.</p>
                        </div>
                        <button type="button" data-mt-add="videos" class="rounded-xl border border-zinc-200/80 dark:border-white/10 px-3 py-2 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-white/10">
                          Add video
                        </button>
                      </div>
                      <div data-mt-empty class="rounded-xl border border-dashed border-zinc-200/80 dark:border-white/10 bg-zinc-100/60 dark:bg-white/5 px-3 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                        No videos in this technique.
                      </div>
                      <div data-mt-items class="space-y-3"></div>
                    </div>
                    <label class="sm:col-span-2 inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <input type="checkbox" name="clear_videos" class="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500/60" />
                      Start from an empty videos list before saving
                    </label>

                    <label class="text-sm sm:col-span-2">
                      direction
                      <div class="relative mt-1" data-dd-select>
                        <select name="direction" class="hidden">
                          <option value="up" selected>Move up</option>
                          <option value="down">Move down</option>
                        </select>
                        <button
                          type="button"
                          data-dd-btn
                          data-placeholder="Move up"
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Move up</span>
                          <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                          </svg>
                        </button>
                        <div data-dd-list class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl">
                          <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5">
                            <input type="radio" name="direction_ui" value="up" class="accent-emerald-500" checked data-label="Move up" />
                            <span>Move up</span>
                          </label>
                          <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5">
                            <input type="radio" name="direction_ui" value="down" class="accent-emerald-500" data-label="Move down" />
                            <span>Move down</span>
                          </label>
                        </div>
                      </div>
                    </label>

                    <div class="sm:col-span-2 flex flex-wrap items-center gap-2" data-form-actions="1">
                      <button type="submit" class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                        Update
                      </button>
                      <button type="submit" data-submit-action="content-technique-reorder" class="w-full sm:w-auto cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 px-4 py-2 font-semibold hover:bg-zinc-100 dark:hover:bg-white/5">
                        Reorder
                      </button>
                      <button type="submit" data-submit-action="content-technique-delete" class="w-full sm:w-auto cursor-pointer rounded-xl border border-rose-500/40 px-4 py-2 font-semibold text-rose-600 dark:text-rose-300 hover:bg-rose-500/10">
                        Delete
                      </button>
                      <button type="button" data-reset-form class="w-full sm:w-auto cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 px-4 py-2 font-semibold hover:bg-zinc-100 dark:hover:bg-white/5">
                        Reset
                      </button>
                    </div>
                  </form>
                </article>

                <pre data-out="content-techniques-res" class="hidden"></pre>
              </div>
              <div data-subpanel="content-difficulties" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
                  <div class="flex items-center justify-between gap-4">
                    <h3 class="font-semibold">Create movement tech difficulty</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /api/mods/content/movement-tech/difficulties</span>
                  </div>
                  <form data-action="content-difficulty-create" autocomplete="off" class="grid gap-3 sm:grid-cols-2">
                    <label class="text-sm sm:col-span-2">
                      name
                      <input
                        name="name"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="Beginner"
                      />
                    </label>
                    <div class="sm:col-span-2">
                      <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                        Create
                      </button>
                    </div>
                  </form>
                </article>

                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-5">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 class="font-semibold">Manage movement tech difficulties</h3>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">Refresh the live list, pick a difficulty, then update, reorder or delete it from the same panel.</p>
                    </div>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET + PUT + DELETE + POST /api/mods/content/movement-tech/difficulties</span>
                  </div>

                  <form data-action="content-difficulty-list" data-form-ux="1" autocomplete="off" class="flex flex-wrap items-center gap-2">
                    <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                      Refresh difficulties
                    </button>
                    <span data-content-count="difficulties" class="inline-flex items-center rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-3 py-1 text-xs text-zinc-500 dark:text-zinc-300">
                      No items synced
                    </span>
                  </form>

                  <form data-action="content-difficulty-update" data-form-ux="1" autocomplete="off" class="grid gap-4 sm:grid-cols-2">
                    <label class="text-sm sm:col-span-2">
                      difficulty
                      <div class="relative mt-1" data-dd-select data-content-options="difficulties" data-placeholder="Select a difficulty">
                        <select name="id" class="hidden">
                          <option value="">Select a difficulty</option>
                        </select>
                        <button
                          type="button"
                          data-dd-btn
                          data-placeholder="Select a difficulty"
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Select a difficulty</span>
                          <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                          </svg>
                        </button>
                        <div data-dd-list class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"></div>
                      </div>
                    </label>

                    <label class="text-sm">
                      name
                      <input
                        name="name"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="Expert"
                      />
                    </label>

                    <label class="text-sm">
                      direction
                      <div class="relative mt-1" data-dd-select>
                        <select name="direction" class="hidden">
                          <option value="up" selected>Move up</option>
                          <option value="down">Move down</option>
                        </select>
                        <button
                          type="button"
                          data-dd-btn
                          data-placeholder="Move up"
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Move up</span>
                          <svg class="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                          </svg>
                        </button>
                        <div data-dd-list class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl">
                          <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5">
                            <input type="radio" name="direction_ui" value="up" class="accent-emerald-500" checked data-label="Move up" />
                            <span>Move up</span>
                          </label>
                          <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5">
                            <input type="radio" name="direction_ui" value="down" class="accent-emerald-500" data-label="Move down" />
                            <span>Move down</span>
                          </label>
                        </div>
                      </div>
                    </label>

                    <div class="sm:col-span-2 flex flex-wrap items-center gap-2" data-form-actions="1">
                      <button type="submit" class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                        Update
                      </button>
                      <button type="submit" data-submit-action="content-difficulty-reorder" class="w-full sm:w-auto cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 px-4 py-2 font-semibold hover:bg-zinc-100 dark:hover:bg-white/5">
                        Reorder
                      </button>
                      <button type="submit" data-submit-action="content-difficulty-delete" class="w-full sm:w-auto cursor-pointer rounded-xl border border-rose-500/40 px-4 py-2 font-semibold text-rose-600 dark:text-rose-300 hover:bg-rose-500/10">
                        Delete
                      </button>
                      <button type="button" data-reset-form class="w-full sm:w-auto cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 px-4 py-2 font-semibold hover:bg-zinc-100 dark:hover:bg-white/5">
                        Reset
                      </button>
                    </div>
                  </form>
                </article>

                <pre data-out="content-difficulties-res" class="hidden"></pre>
              </div>
            </div>


            {{-- ============ MAPS ============ --}}
            <div data-panel="maps" class="mod-panel hidden space-y-4">
              <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="maps-archive"
                >
                  Archive / Unarchive
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="maps-update"
                >
                  Update
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="maps-submit"
                >
                  Submit
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="maps-search"
                >
                  Search
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="maps-convert"
                >
                  Convert legacy
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(16,185,129,.08)]"
                  data-subtab="maps-edit-request"
                >
                  Edit request
                </button>

              </div>
              <div
                class="empty-state rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 text-zinc-600 dark:text-zinc-300"
              >
                Choose a Maps action.
              </div>

              <div data-subpanel="maps-edit-request" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 class="font-semibold">Create map edit request</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /api/maps/map-edits</span>
                  </div>

                  <form data-action="create-map-edit-request" autocomplete="off" class="grid gap-4">
              <div class="grid gap-4">
                <label class="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Map code <span class="text-zinc-500">(required)</span>
                  <input
                    name="code"
                    type="text"
                    placeholder="e.g. 7M60H"
                    class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                    required
                  />
                </label>

                <div class="flex items-center justify-end gap-2">
                  <button
                    type="submit"
                    class="inline-flex cursor-pointer items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors"
                  >
                    Open form
                  </button>
                </div>
              </div>
                    </form>

                  <div id="mapEditRequestInlineMount" class="hidden mt-6 border-t border-zinc-200/80 dark:border-white/10 pt-6"></div>
                </article>
              </div>

              <div data-subpanel="maps-archive" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Archive or Unarchive maps</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">PATCH /api/v3/maps/archive?code=</span>
                  </div>
                  <form data-action="archive-maps" autocomplete="off" class="grid gap-3">
                    <div class="grid gap-3 sm:grid-cols-3">
                      <label>
                        Status
                        <div class="relative mt-1" data-dd-select>
                          <button
                            type="button"
                            data-dd-btn
                            class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                          >
                            <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Archive</span>
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
                            class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"
                          >
                            <label
                              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                            class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                          >
                            <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Single</span>
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
                          >
                            <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5">
                              <input
                                type="radio"
                                name="mode_ui"
                                value="single"
                                class="accent-emerald-500"
                                checked
                                data-label="Single"
                              />
                              <span>Single</span>
                            </label>

                            <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5">
                              <input
                                type="radio"
                                name="mode_ui"
                                value="bulk"
                                class="accent-emerald-500"
                                data-label="Bulk"
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
                          class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
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
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Update Map</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">PATCH /api/v3/maps/{code}</span>
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
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="01AZC"
                      />
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
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
                    <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 p-4">
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
                                class="block-edit-btn cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-white/10"
                                data-edit-target="u-metaCreatorMain"
                              >
                                Edit
                              </button>
                            </span>

                            <!-- Secondary (même affichage que le primary) -->
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
                                class="block-edit-btn cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-white/10"
                                data-edit-target="u-metaCreatorSecond"
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
                            <div id="u-metaCode" class="text-sm text-zinc-800 dark:text-zinc-200">N/A</div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-white/10"
                              data-edit-target="u-metaCode"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        <!-- Map Name -->
                        <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2">
                          <div class="text-[11px] text-zinc-500 dark:text-zinc-400">Map name</div>
                          <div class="flex items-center gap-2">
                            <div id="u-metaMap" class="text-sm text-zinc-800 dark:text-zinc-200">N/A</div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-white/10"
                              data-edit-target="u-metaMap"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        <!-- Checkpoints -->
                        <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2">
                          <div class="text-[11px] text-zinc-500 dark:text-zinc-400">Checkpoints</div>
                          <div class="flex items-center gap-2">
                            <div id="u-metaCheckpoints" class="text-sm text-zinc-800 dark:text-zinc-200">N/A</div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-white/10"
                              data-edit-target="u-metaCheckpoints"
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
                        <!-- Difficulty -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Select difficulty</label>
                          <div id="u-difficultyDropdown" class="relative">
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

                        <!-- Category -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Select category</label>
                          <div id="u-categoryDropdown" class="relative">
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

                        <!-- Mechanics -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Select mechanics</label>
                          <div id="u-mechanicsDropdown" class="relative">
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

                        <!-- Restrictions -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">
                            Select restrictions
                          </label>
                          <div id="u-restrictionsDropdown" class="relative">
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

                    <!-- FLAGS & REVIEW -->
                    <div class="space-y-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 p-4">
                      <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Flags</h3>
                      <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Hidden -->
                        <label
                          class="flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2"
                        >
                          <input id="u-flagHidden" type="checkbox" class="accent-emerald-500" />
                          <span class="text-sm text-zinc-800 dark:text-zinc-200">Hidden</span>
                        </label>

                        <!-- Archived -->
                        <label
                          class="flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2"
                        >
                          <input id="u-flagArchived" type="checkbox" class="accent-emerald-500" />
                          <span class="text-sm text-zinc-800 dark:text-zinc-200">Archived</span>
                        </label>

                        <!-- Official -->
                        <label
                          class="flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2"
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
                              class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left"
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
                              class="absolute z-20 mt-1 hidden max-h-64 w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"
                            ></div>
                          </div>
                        </div>

                        <div class="sm:col-span-2">
                          <label class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Select tags</label>
                          <div id="u-tagsDropdown" class="relative">
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
                        <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2">
                          <div class="flex items-center justify-between">
                            <div>
                              <div class="text-[11px] text-zinc-500 dark:text-zinc-400">Description</div>
                              <div id="u-optDescription" class="text-sm text-zinc-800 dark:text-zinc-200">N/A</div>
                            </div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-white/10"
                              data-edit-target="u-optDescription"
                            >
                              Edit
                            </button>
                          </div>
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
                                id="u-medalGoldInput"
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
                                id="u-medalSilverInput"
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
                                id="u-medalBronzeInput"
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
                    <div class="flex flex-wrap items-center gap-2">
                      <button
                        type="submit"
                        class="inline-flex cursor-pointer items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Update map
                      </button>
                      <button
                        id="u-releaseCodeBtn"
                        type="button"
                        class="hidden inline-flex cursor-pointer items-center justify-center rounded-xl border border-rose-500/50 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-500/20 dark:text-rose-300"
                      >
                        Release code
                      </button>
                      <button
                        type="button"
                        class="cancel-btn inline-flex cursor-pointer items-center justify-center rounded-lg border border-zinc-200/80 dark:border-white/10 px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
                        onclick="document.getElementById('u-updateMapForm')?.classList.add('hidden')"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              <div data-subpanel="maps-submit" class="hidden min-h-[75vh] space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Submit Map</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /api/maps</span>
                  </div>

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
                </article>
              </div>

              <div data-subpanel="maps-convert" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Convert To Legacy Map</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">
                      POST /api/v3/maps/{code}/legacy?reason=...
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
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="e.g. 123456"
                      />
                    </label>

                    <label class="sm:col-span-2">
                      Reason <span class="text-xs text-zinc-500">(optional)</span>
                      <textarea
                        name="reason"
                        rows="2"
                        maxlength="200"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none resize-y"
                        placeholder="Why converting this map to legacy?"
                      ></textarea>
                      <div class="mt-1 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                        <span>Sent as query (?reason=...)</span>
                        <span data-reason-count>0/200</span>
                      </div>
                    </label>

                    <div class="sm:col-span-3">
                      <button
                        type="submit"
                        class="w-full sm:w-auto cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 px-4 py-2 font-semibold hover:bg-zinc-100 dark:hover:bg-white/5"
                      >
                        Convert
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              <div data-subpanel="maps-search" class="hidden min-h-[75vh] space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Search Map</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET /api/maps?code=</span>
                  </div>

                  <form
                    data-action="search-map"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3"
                  >
                    <label>
                      Map code
                      <input
                        name="code"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="7SFBH"
                      />
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Search
                      </button>
                    </div>
                  </form>

                  <form
                    id="s-submitMapForm"
                    autocomplete="off"
                    class="mt-6 hidden space-y-6"
                    data-readonly="1"
                  >
                    <!-- META -->
                    <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 p-4">
                      <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Creators -->
                        <div class="sm:col-span-2">
                          <span class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Creator</span>
                          <div id="s-metaCreatorsCol" class="flex flex-wrap items-center gap-2">
                            <!-- Primary -->
                            <span
                              class="main-creator-row inline-flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-1.5"
                            >
                              <span
                                id="s-metaCreatorMain"
                                class="text-sm text-zinc-800 dark:text-zinc-200"
                                data-raw-id=""
                              >
                                N/A
                              </span>
                              <button
                                type="button"
                                class="block-edit-btn cursor-not-allowed cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm opacity-50 hover:bg-zinc-100 dark:hover:bg-white/10"
                                disabled
                                data-edit-target="s-metaCreatorMain"
                              >
                                Edit
                              </button>
                            </span>

                            <!-- Secondary -->
                            <span
                              class="secondary-creator-row inline-flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-1.5"
                            >
                              <span
                                id="s-metaCreatorSecond"
                                class="text-sm text-zinc-800 dark:text-zinc-200"
                                data-raw-id=""
                              >
                                N/A
                              </span>
                              <button
                                type="button"
                                class="block-edit-btn cursor-not-allowed cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm opacity-50 hover:bg-zinc-100 dark:hover:bg-white/10"
                                disabled
                                data-edit-target="s-metaCreatorSecond"
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
                            <div id="s-metaCode" class="text-sm text-zinc-800 dark:text-zinc-200">N/A</div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-not-allowed cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm opacity-50 hover:bg-zinc-100 dark:hover:bg-white/10"
                              disabled
                              data-edit-target="s-metaCode"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        <!-- Map Name -->
                        <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2">
                          <div class="text-[11px] text-zinc-500 dark:text-zinc-400">Map name</div>
                          <div class="flex items-center gap-2">
                            <div id="s-metaMap" class="text-sm text-zinc-800 dark:text-zinc-200">N/A</div>
                          </div>
                        </div>

                        <!-- Checkpoints -->
                        <div class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-2">
                          <div class="text-[11px] text-zinc-500 dark:text-zinc-400">Checkpoints</div>
                          <div class="flex items-center gap-2">
                            <div id="s-metaCheckpoints" class="text-sm text-zinc-800 dark:text-zinc-200">N/A</div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-not-allowed cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm opacity-50 hover:bg-zinc-100 dark:hover:bg-white/10"
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
                    <div class="space-y-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 p-4">
                      <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Required</h3>
                      <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Difficulty (radio) -->
                        <div>
                          <label class="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Select difficulty</label>
                          <div id="s-difficultyDropdown" class="relative">
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
                          <div id="s-categoryDropdown" class="relative">
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
                          <div id="s-mechanicsDropdown" class="relative">
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
                          <div id="s-restrictionsDropdown" class="relative">
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
                          <div id="s-tagsDropdown" class="relative">
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
                          <label class="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400" for="s-optTitleInput">
                            Title
                          </label>
                          <input
                            id="s-optTitleInput"
                            type="text"
                            maxlength="128"
                            class="w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                            placeholder="Optional short title (max 128 chars)"
                            disabled
                          />
                        </div>

                        <!-- Custom banner -->
                        <div>
                          <div class="mb-1 text-[11px] text-zinc-500 dark:text-zinc-400">Custom banner</div>
                          <div
                            id="s-bannerDrop"
                            class="group relative flex h-36 items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-200/80 dark:border-white/15 bg-white/60 dark:bg-zinc-900/60"
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
                              <div id="s-optDescription" class="text-sm text-zinc-800 dark:text-zinc-200">N/A</div>
                            </div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-not-allowed cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm opacity-50 hover:bg-zinc-100 dark:hover:bg-white/10"
                              disabled
                              data-edit-target="s-optDescription"
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
                              <div id="s-optGuide" class="text-sm text-zinc-800 dark:text-zinc-200">N/A</div>
                            </div>
                            <button
                              type="button"
                              class="block-edit-btn cursor-not-allowed cursor-pointer rounded-md border border-zinc-200/80 dark:border-white/10 px-2 py-1 text-sm opacity-50 hover:bg-zinc-100 dark:hover:bg-white/10"
                              disabled
                              data-edit-target="s-optGuide"
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
                                id="s-medalGoldInput"
                                type="text"
                                inputmode="decimal"
                                pattern="\\d{1,5}(?:\\.\\d{1,2})?"
                                placeholder="e.g. 5550.23"
                                class="w-40 shrink-0 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                                disabled
                              />
                            </label>

                            <label class="flex items-center gap-2">
                              <span class="inline-flex min-w-0 items-center gap-2">
                                <span class="text-sm text-zinc-800 dark:text-zinc-200">🥈 Silver</span>
                              </span>
                              <input
                                id="s-medalSilverInput"
                                type="text"
                                inputmode="decimal"
                                pattern="\\d{1,5}(?:\\.\\d{1,2})?"
                                placeholder="e.g. 7599.33"
                                class="w-40 shrink-0 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                                disabled
                              />
                            </label>

                            <label class="flex items-center gap-2">
                              <span class="inline-flex min-w-0 items-center gap-2">
                                <span class="text-sm text-zinc-800 dark:text-zinc-200">🥉 Bronze</span>
                              </span>
                              <input
                                id="s-medalBronzeInput"
                                type="text"
                                inputmode="decimal"
                                pattern="\\d{1,5}(?:\\.\\d{1,2})?"
                                placeholder="e.g. 8066.75"
                                class="w-40 shrink-0 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                                disabled
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
                </article>
              </div>
            </div>

            {{-- ============ MODERATION ============ --}}
            <div data-panel="moderation" class="mod-panel hidden space-y-4">
              <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="mod-quality"
                >
                  Override quality
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="mod-suspicious"
                >
                  Set suspicious flag
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="mod-getsusp"
                >
                  Get suspicious flags
                </button>
              </div>
              <div
                class="empty-state rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 text-zinc-600 dark:text-zinc-300"
              >
                Choose a Moderation action.
              </div>

              <div data-subpanel="mod-quality" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Override Quality Votes</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /api/mods/maps/{code}/quality</span>
                  </div>

                  <form
                    data-action="override-quality"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3 sm:items-end"
                  >
                    <label class="block">
                      <span class="block text-xs text-zinc-500 dark:text-zinc-400">Map code</span>
                      <input
                        name="code"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="01AZC"
                      />
                    </label>

                    <label class="block">
                      <span class="block text-xs text-zinc-500 dark:text-zinc-400">Quality (1–6)</span>
                      <div id="q-qualityDropdown" class="relative mt-1">
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Select quality (1–6)</span>
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
                    </label>

                    <div class="sm:col-span-3">
                      <button
                        class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        Apply
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              <!-- Set Suspicious Flag -->
              <div data-subpanel="mod-suspicious" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Set Suspicious Flag</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /api/mods/completions/suspicious</span>
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
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                        placeholder="tool-assisted, impossible, …"
                      />
                    </label>

                    <label>
                      Flag type
                      <div class="relative mt-1" data-dd-select>
                        <button
                          type="button"
                          data-dd-btn
                          class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-left focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                        >
                          <span class="dd-label text-sm text-zinc-600 dark:text-zinc-300">Cheating</span>
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
                          class="absolute z-20 mt-1 hidden w-full overflow-auto rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl"
                        >
                          <label
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/5"
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
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>

                    <label class="sm:col-span-1">
                      Message ID (opt.)
                      <input
                        name="message_id"
                        type="number"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>

                    <label class="sm:col-span-1">
                      Verification ID (opt.)
                      <input
                        name="verification_id"
                        type="number"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>

                    <div class="sm:col-span-3">
                      <button
                        class="w-full sm:w-auto cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 px-4 py-2 font-semibold hover:bg-zinc-100 dark:hover:bg-white/5"
                      >
                        Flag
                      </button>
                    </div>
                  </form>
                </article>
              </div>

              <!-- Get Suspicious Flags -->
              <div data-subpanel="mod-getsusp" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Get Suspicious Flags</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET /api/mods/completions/suspicious</span>
                  </div>
                  <form
                    data-action="get-suspicious"
                    autocomplete="off"
                    class="grid gap-3 sm:grid-cols-3"
                  >
                    <label>
                      User name
                      <input
                        name="user_id"
                        class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"
                      />
                    </label>
                    <div class="sm:col-span-3">
                      <button
                        class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100"
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
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="verif-pending"
                >
                  Verify completions
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="verif-playtest"
                >
                  Verify playtests
                </button>
                <button
                  class="mod-subtab cursor-pointer rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 min-w-0 max-w-full truncate w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(16,185,129,.08)]"
                  data-subtab="verif-edits"
                >
                  Verify edits
                </button>

              </div>
              <div
                class="empty-state rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 text-zinc-600 dark:text-zinc-300"
              >
                Choose a Verifications action.
              </div>

              <div data-subpanel="verif-pending" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-semibold">Get Pending Verifications</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET /api/v3/verifications/pending</span>
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
              <div data-subpanel="verif-edits" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6">
                  <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 class="font-semibold">Verify map edit requests</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET /api/v3/maps/map-edits/pending</span>
                  </div>

                  <form data-action="get-pending-edit-requests" autocomplete="off" class="grid gap-4">
                    <div class="grid gap-3 sm:grid-cols-2">
                      <label class="block text-sm text-zinc-600 dark:text-zinc-300">
                        Resolved by (user_id)
                        <input
                          id="editResolvedByInput"
                          type="text"
                          name="resolved_by_user_id"
                          placeholder="Auto"
                          class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                        />
                      </label>

                      <div class="rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 p-3 text-xs text-zinc-500 dark:text-zinc-400">
                        Accept / Reject will call <span class="font-mono">PUT /resolve</span> with your user_id.
                      </div>
                    </div>

                    <button
                      class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30"
                    >
                      Fetch pending edit requests
                    </button>
                  </form>
                </article>
              </div>
            </div>

            {{-- ============ TOURNAMENT ============ --}}
            <div data-panel="tournament" class="mod-panel hidden space-y-4">
              <div class="sticky top-20 z-10 flex flex-wrap items-center gap-2">
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="tournament-overview"
                  type="button"
                >
                  Overview
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="tournament-categories"
                  type="button"
                >
                  Categories
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="tournament-maps"
                  type="button"
                >
                  Maps
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="tournament-cycles"
                  type="button"
                >
                  Cycles
                </button>
                <button
                  class="mod-subtab rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30 w-full sm:w-auto [&.active]:bg-white/10 [&.active]:shadow-[0_0_0_1px_rgba(255,255,255,.10),0_0_0_6px_rgba(59,130,246,.06)]"
                  data-subtab="tournament-lifecycle"
                  type="button"
                >
                  Lifecycle
                </button>
              </div>

              <div class="empty-state rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 text-zinc-600 dark:text-zinc-300">
                Choose a Tournament action.
              </div>

              <div data-subpanel="tournament-overview" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 class="font-semibold">Tournament overview</h3>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">Loads config, categories, active edition, and active cycles.</p>
                    </div>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET /api/tournaments/*</span>
                  </div>
                  <form data-action="tournament-load-overview" autocomplete="off">
                    <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                      Load overview
                    </button>
                  </form>
                  <div
                    data-tournament-overview-view
                    class="hidden rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-950/40"
                  >
                    <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <div class="h-24 animate-pulse rounded-xl bg-zinc-900/5 dark:bg-white/5"></div>
                      <div class="h-24 animate-pulse rounded-xl bg-zinc-900/5 dark:bg-white/5"></div>
                      <div class="h-24 animate-pulse rounded-xl bg-zinc-900/5 dark:bg-white/5"></div>
                      <div class="h-24 animate-pulse rounded-xl bg-zinc-900/5 dark:bg-white/5"></div>
                    </div>
                  </div>
                  <pre data-out="tournament-overview" class="hidden"></pre>
                </article>
              </div>

              <div data-subpanel="tournament-categories" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h3 class="font-semibold">Category read</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET /api/tournaments/categories</span>
                  </div>
                  <div class="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-950/40">
                    <div class="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 class="font-semibold">Loaded categories</h4>
                        <p class="text-xs text-zinc-500 dark:text-zinc-400">Click a category to fill the update form and reuse its category_id in map/cycle actions.</p>
                      </div>
                      <span data-tournament-category-count class="inline-flex items-center rounded-full border border-zinc-200/80 bg-white/70 px-3 py-1 text-xs text-zinc-500 dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-300">
                        No categories loaded
                      </span>
                    </div>
                    <div data-tournament-category-cards class="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      <div class="rounded-xl border border-dashed border-zinc-300/80 p-3 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
                        Categories will load automatically when this panel opens.
                      </div>
                    </div>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2">
                    <form data-action="tournament-category-list" autocomplete="off">
                      <button class="w-full cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">
                        List categories
                      </button>
                    </form>
                    <form data-action="tournament-category-get" autocomplete="off" class="flex gap-2">
                      <input name="category_id" type="number" min="1" placeholder="category_id" class="min-w-0 flex-1 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                      <button class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Get</button>
                    </form>
                  </div>
                  <pre data-out="tournament-categories-res" class="hidden"></pre>
                </article>

                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h3 class="font-semibold">Create category</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">POST /api/mods/tournaments/categories</span>
                  </div>
                  <form data-action="tournament-category-create" autocomplete="off" class="grid gap-3">
                    <label class="text-sm">
                      name
                      <input name="name" required class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                    </label>
                    <div class="grid gap-2 sm:grid-cols-3">
                      @foreach (['Easy', 'Medium', 'Hard', 'Very Hard', 'Extreme', 'Hell'] as $difficulty)
                        <label class="flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/50 dark:bg-zinc-950/40 px-3 py-2 text-sm">
                          <input type="checkbox" name="difficulties[]" value="{{ $difficulty }}" class="accent-emerald-500" />
                          <span>{{ $difficulty }}</span>
                        </label>
                      @endforeach
                    </div>
                    <div class="grid gap-3 sm:grid-cols-2">
                      <label class="text-sm">
                        participation_xp
                        <input name="participation_xp" type="number" min="0" step="1" placeholder="0" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                      </label>
                      <label class="text-sm">
                        champion_role_id
                        <input name="champion_role_id" inputmode="numeric" placeholder="optional" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                      </label>
                    </div>
                    <div class="grid gap-3 sm:grid-cols-2">
                      <label class="text-sm">
                        placement_xp JSON
                        <textarea name="placement_xp_json" rows="4" placeholder='[{"place":1,"xp":200}]' class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"></textarea>
                      </label>
                      <label class="text-sm">
                        streak_xp JSON
                        <textarea name="streak_xp_json" rows="4" placeholder='[{"threshold":5,"xp":300}]' class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"></textarea>
                      </label>
                    </div>
                    <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Create</button>
                  </form>
                  <pre data-out="tournament-category-create-res" class="hidden"></pre>
                </article>

                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div class="flex flex-wrap items-center gap-2">
                      <h3 class="font-semibold">Update / delete category</h3>
                      <span data-tournament-lock-badge class="hidden inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V8H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm2.5 7V5.5a2.5 2.5 0 0 0-5 0V8h5Z" clip-rule="evenodd"></path></svg>
                        Locked — cycle in progress
                      </span>
                    </div>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">PATCH + DELETE /api/mods/tournaments/categories/{id}</span>
                  </div>
                  <label class="block text-sm">
                    Loaded category
                    <div
                      id="modTournamentCategoryUpdatePicker"
                      class="relative mt-1"
                      data-dd-select
                      data-dd-field="category_pick_update"
                      data-tournament-category-picker="update"
                    >
                      <button
                        type="button"
                        data-dd-btn
                        data-placeholder="Select a loaded category"
                        aria-haspopup="listbox"
                        aria-expanded="false"
                        class="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-left text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
                      >
                        <span class="dd-label truncate">Select a loaded category</span>
                        <svg class="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clip-rule="evenodd"></path>
                        </svg>
                      </button>
                      <div
                        data-dd-list
                        role="listbox"
                        class="custom-multiselect-list absolute left-0 right-0 top-full z-50 mt-1 hidden max-h-[260px] overflow-auto rounded-lg border border-zinc-200/80 bg-white/95 p-1 shadow-xl dark:border-white/10 dark:bg-zinc-900/95"
                      >
                        <div class="px-2 py-2 text-xs text-zinc-500 dark:text-zinc-400">
                          Loading categories...
                        </div>
                      </div>
                      <select name="category_pick_update" class="hidden" aria-hidden="true">
                        <option value="">Select a loaded category</option>
                      </select>
                    </div>
                  </label>
                  <form data-action="tournament-category-update" autocomplete="off" class="grid gap-3">
                    <div class="grid gap-3 sm:grid-cols-3">
                      <label class="text-sm">
                        category_id
                        <input name="category_id" type="number" min="1" required class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                      </label>
                      <label class="text-sm">
                        name
                        <input name="name" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                      </label>
                      <label class="text-sm">
                        is_active
                        <select name="is_active" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none">
                          <option value="">unchanged</option>
                          <option value="1">true</option>
                          <option value="0">false</option>
                        </select>
                      </label>
                    </div>
                    <div class="grid gap-2 sm:grid-cols-3">
                      @foreach (['Easy', 'Medium', 'Hard', 'Very Hard', 'Extreme', 'Hell'] as $difficulty)
                        <label class="flex items-center gap-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/50 dark:bg-zinc-950/40 px-3 py-2 text-sm">
                          <input type="checkbox" name="difficulties[]" value="{{ $difficulty }}" class="accent-emerald-500" />
                          <span>{{ $difficulty }}</span>
                        </label>
                      @endforeach
                    </div>
                    <div class="grid gap-3 sm:grid-cols-3">
                      <label class="text-sm">
                        participation_xp
                        <input name="participation_xp" type="number" min="0" step="1" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                      </label>
                      <label class="text-sm sm:col-span-2">
                        champion_role_id
                        <input name="champion_role_id" inputmode="numeric" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                      </label>
                    </div>
                    <div class="grid gap-3 sm:grid-cols-2">
                      <textarea name="placement_xp_json" rows="4" placeholder="placement_xp JSON" class="w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"></textarea>
                      <textarea name="streak_xp_json" rows="4" placeholder="streak_xp JSON" class="w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-emerald-500/60 focus:outline-none"></textarea>
                    </div>
                    <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Update</button>
                  </form>
                  <form data-action="tournament-category-delete" autocomplete="off" class="grid gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3 sm:grid-cols-[1fr_auto]">
                    <input name="category_id" type="number" min="1" required placeholder="category_id" class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/60 focus:outline-none" />
                    <button class="cursor-pointer rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500">Delete</button>
                  </form>
                  <pre data-out="tournament-category-update-res" class="hidden"></pre>
                  <pre data-out="tournament-category-delete-res" class="hidden"></pre>
                </article>
              </div>

              <div data-subpanel="tournament-maps" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h3 class="font-semibold">Next cycle map</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET / next-cycle + POST/PATCH map actions</span>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2">
                    <form data-action="tournament-next-cycle" autocomplete="off" class="grid gap-3">
                      <input name="category_id" type="number" min="1" required placeholder="category_id" class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                      <button class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Preview next</button>
                    </form>
                    <form data-action="tournament-select-map" autocomplete="off" class="grid gap-3">
                      <input name="category_id" type="number" min="1" required placeholder="category_id" class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                      <button class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Random select</button>
                    </form>
                    <form data-action="tournament-choose-map" autocomplete="off" class="grid gap-3">
                      <input name="category_id" type="number" min="1" required placeholder="category_id" class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                      <input name="map_code" required placeholder="map_code" class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm uppercase focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                      <button class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Choose explicit map</button>
                    </form>
                    <form data-action="tournament-reroll-map" autocomplete="off" class="grid gap-3">
                      <input name="category_id" type="number" min="1" required placeholder="category_id" class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                      <button class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Reroll pending</button>
                    </form>
                  </div>
                  <form data-action="tournament-reroll-active" autocomplete="off" class="grid gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                    <input name="category_id" type="number" min="1" required placeholder="category_id" class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/60 focus:outline-none" />
                    <label class="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="confirm" class="accent-red-500" />
                      <span>Confirm live reroll; this wipes submissions for the active cycle.</span>
                    </label>
                    <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500">Reroll active</button>
                  </form>
                  <pre data-out="tournament-maps-res" class="hidden"></pre>
                </article>
              </div>

              <div data-subpanel="tournament-cycles" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h3 class="font-semibold">Cycles, leaderboard, streaks</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET /api/tournaments/cycles</span>
                  </div>
                  <form data-action="tournament-cycle-list" autocomplete="off" class="grid gap-3 sm:grid-cols-4">
                    <label class="text-sm">
                      status
                      <select name="status" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none">
                        <option value="">any</option>
                        <option value="pending">pending</option>
                        <option value="active">active</option>
                        <option value="finalizing">finalizing</option>
                        <option value="completed">completed</option>
                      </select>
                    </label>
                    <label class="text-sm">
                      category_id
                      <input name="category_id" type="number" min="1" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                    </label>
                    <label class="text-sm">
                      limit
                      <input name="limit" type="number" min="1" max="100" value="20" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                    </label>
                    <label class="text-sm">
                      offset
                      <input name="offset" type="number" min="0" value="0" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                    </label>
                    <div class="sm:col-span-4">
                      <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">List cycles</button>
                    </div>
                  </form>
                  <div class="grid gap-3 sm:grid-cols-2">
                    <form data-action="tournament-leaderboard" autocomplete="off" class="grid gap-3">
                      <input name="cycle_id" type="number" min="1" required placeholder="cycle_id" class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                      <button class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Get leaderboard</button>
                    </form>
                    <form data-action="tournament-streak" autocomplete="off" class="grid gap-3">
                      <input name="user_id" inputmode="numeric" required placeholder="user_id" class="rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                      <button class="cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Get streak</button>
                    </form>
                  </div>
                  <pre data-out="tournament-cycles-res" class="hidden"></pre>
                </article>
              </div>

              <div data-subpanel="tournament-lifecycle" class="hidden space-y-6">
                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h3 class="font-semibold">Global config</h3>
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">GET /api/tournaments/config + PATCH /api/mods/tournaments/config</span>
                  </div>
                  <form data-action="tournament-config-get" autocomplete="off">
                    <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Load config</button>
                  </form>
                  <form data-action="tournament-config-update" autocomplete="off" class="grid gap-3 sm:grid-cols-2">
                    <label class="text-sm">
                      Cadence
                      <select name="cadence" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none">
                        <option value="">Leave unchanged</option>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Biweekly</option>
                      </select>
                      <span class="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">How often a new edition starts.</span>
                    </label>
                    <label class="text-sm">
                      Rotation day
                      <select name="anchor_weekday" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none">
                        <option value="">Leave unchanged</option>
                        <option value="0">Sunday</option>
                        <option value="1">Monday</option>
                        <option value="2">Tuesday</option>
                        <option value="3">Wednesday</option>
                        <option value="4">Thursday</option>
                        <option value="5">Friday</option>
                        <option value="6">Saturday</option>
                      </select>
                      <span class="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">Day of week each edition rolls over.</span>
                    </label>
                    <label class="text-sm">
                      Rotation time
                      <input name="anchor_time" type="time" step="1" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                      <span class="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">Wall-clock time in the timezone below (not UTC).</span>
                    </label>
                    <label class="text-sm">
                      Timezone
                      <input name="anchor_tz" type="text" list="tournamentTimezoneOptions" autocomplete="off" spellcheck="false" placeholder="America/New_York" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                      <datalist id="tournamentTimezoneOptions"></datalist>
                      <span class="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">Type to search IANA zones (e.g. America/Los_Angeles).</span>
                    </label>
                    <label class="text-sm sm:col-span-2">
                      Blacklist window (weeks)
                      <input name="blacklist_weeks" type="number" min="0" step="1" class="mt-1 w-full rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 focus:ring-2 focus:ring-emerald-500/60 focus:outline-none" />
                      <span class="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">Number of weeks a map stays excluded after being used.</span>
                    </label>
                    <div class="sm:col-span-2">
                      <button class="w-full sm:w-auto cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-zinc-900 hover:bg-zinc-100">Save config</button>
                    </div>
                  </form>
                  <pre data-out="tournament-config-res" class="hidden"></pre>
                </article>

                <article class="fade-in rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 space-y-4">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 class="font-semibold">Tournament lifecycle</h3>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">Reads the current edition and shows only the actions that are valid right now.</p>
                    </div>
                    <button type="button" data-tournament-lc-action="refresh" class="w-full sm:w-auto cursor-pointer rounded-lg border border-zinc-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10">
                      Refresh
                    </button>
                  </div>
                  <div data-tournament-lifecycle-panel data-app-env="{{ app()->environment() }}" class="space-y-4">
                    <div class="h-28 animate-pulse rounded-2xl bg-zinc-900/5 dark:bg-white/5"></div>
                  </div>
                  <pre data-out="tournament-lifecycle-res" class="hidden"></pre>
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
