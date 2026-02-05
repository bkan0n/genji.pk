@extends('layouts.app')

@section('title', '3D Map Editor')

@push('head')
  @php($nonce = csp_nonce())
@endpush

@section('content')
  <div class="relative min-h-[100vh]">
    <!-- En-tête -->
    <section class="relative">
      <div class="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 sm:pt-14 sm:pb-8 lg:px-8">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
              3D Map Editor
              <span class="block text-sm font-medium text-zinc-300 sm:text-base">
                create · update · publish
              </span>
            </h1>
          </div>
        </div>
      </div>
    </section>

    <!-- Toolbar -->
    <section class="relative">
      <div class="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        {{-- TOOLBAR --}}
        <div id="hudToolbar" class="flex flex-wrap items-center justify-between gap-2 rounded-3xl border border-white/10 bg-black/35 p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_40px_-22px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          {{-- LEFT GROUP --}}
          <div class="flex items-center gap-2 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              id="btnImport"
              class="shrink-0 cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-zinc-100 hover:bg-white/10"
            >
              Import data
            </button>

            <button
              id="btnExport"
              class="shrink-0 cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-zinc-100 hover:bg-white/10"
            >
              Export data
            </button>

            {{-- MAP DROPDOWN --}}
            <div class="shrink-0">
              <button
                id="mapDdBtn"
                type="button"
                class="flex items-center cursor-pointer gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-zinc-100 hover:bg-white/10"
                aria-haspopup="listbox"
                aria-expanded="false"
              >
                <span id="mapDdLabel">Loading maps…</span>
                <svg class="h-4 w-4 opacity-60" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z" clip-rule="evenodd"/>
                </svg>
              </button>

              <ul
                id="mapDdMenu"
                class="invisible pointer-events-none fixed z-[9999] mt-2 max-h-44 w-56 translate-y-1 overflow-y-auto rounded-2xl bg-zinc-900/95 py-2 opacity-0 shadow-lg ring-1 ring-white/10 backdrop-blur transition"
                role="listbox"
              ></ul>

              <select id="mapSelect" class="hidden" tabindex="-1" aria-hidden="true">
                <option value="">Loading maps…</option>
              </select>
            </div>

            {{-- PERF DROPDOWN --}}
            <div class="shrink-0">
              <button
                id="perfDdBtn"
                type="button"
                class="flex items-center cursor-pointer gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-zinc-100 hover:bg-white/10"
                aria-haspopup="listbox"
                aria-expanded="false"
                title="Performance preset"
              >
                <span id="perfDdLabel">Balanced</span>
                <svg class="h-4 w-4 opacity-60" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z" clip-rule="evenodd"/>
                </svg>
              </button>

              <ul
                id="perfDdMenu"
                class="invisible pointer-events-none fixed z-[9999] mt-2 max-h-44 w-56 translate-y-1 overflow-y-auto rounded-2xl bg-zinc-900/95 py-2 opacity-0 shadow-lg ring-1 ring-white/10 backdrop-blur transition"
                role="listbox"
              >
                <li>
                  <button type="button"
                    class="dd-opt flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
                    data-value="performance"
                  >Performance</button>
                </li>
                <li>
                  <button type="button"
                    class="dd-opt flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
                    data-value="balanced"
                  >Balanced</button>
                </li>
                <li>
                  <button type="button"
                    class="dd-opt flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
                    data-value="quality"
                  >Quality</button>
                </li>
              </ul>

              <select id="perfPreset" class="hidden" tabindex="-1" aria-hidden="true" title="Performance preset">
                <option value="performance">Performance</option>
                <option value="balanced" selected>Balanced</option>
                <option value="quality">Quality</option>
              </select>
            </div>

            <button
              id="btnGo"
              class="shrink-0 cursor-pointer rounded-full border border-emerald-300/30 bg-emerald-500/15 px-4 py-2 text-xs font-extrabold text-emerald-100 hover:bg-emerald-500/25"
              title="Load selected map"
            >
              GO
            </button>
          </div>

          {{-- RIGHT GROUP --}}
          <div class="flex items-center gap-2 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              id="langDdBtn"
              type="button"
              class="shrink-0 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-zinc-100 hover:bg-white/10"
              aria-expanded="false"
              aria-controls="langDdMenu"
            >
              <i class="flag flag-us"></i>
              <span class="text-xs font-extrabold text-zinc-100" data-label>English</span>
              <svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    {{-- Language dropdown --}}
    <ul
      id="langDdMenu"
      class="invisible pointer-events-none fixed z-[9999] mt-2 max-h-44 w-48 translate-y-1 overflow-y-auto rounded-2xl bg-zinc-900/95 py-2 opacity-0 shadow-lg ring-1 ring-white/10 backdrop-blur transition"
      role="listbox"
    >
      <li>
        <button type="button"
          class="dd-opt flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
          data-code="en-US" data-flag="flag-us">
          <i class="flag flag-us"></i><span>English</span>
        </button>
      </li>

      <li>
        <button type="button"
          class="dd-opt flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
          data-code="zh-CN" data-flag="flag-china">
          <i class="flag flag-china"></i><span>简体中文</span>
        </button>
      </li>

      <li>
        <button type="button"
          class="dd-opt flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
          data-code="ja-JP" data-flag="flag-japan">
          <i class="flag flag-japan"></i><span>日本語</span>
        </button>
      </li>

      <li>
        <button type="button"
          class="dd-opt flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
          data-code="ko-KR" data-flag="flag-south-korea">
          <i class="flag flag-south-korea"></i><span>한국어</span>
        </button>
      </li>

      <li>
        <button type="button"
          class="dd-opt flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
          data-code="ru-RU" data-flag="flag-russia">
          <i class="flag flag-russia"></i><span>Русский</span>
        </button>
      </li>

      <li>
        <button type="button"
          class="dd-opt flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
          data-code="es-MX" data-flag="flag-mexico">
          <i class="flag flag-mexico"></i><span>Español</span>
        </button>
      </li>

      <li>
        <button type="button"
          class="dd-opt flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
          data-code="pt-BR" data-flag="flag-brazil">
          <i class="flag flag-brazil"></i><span>Português</span>
        </button>
      </li>

      <li>
        <button type="button"
          class="dd-opt flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
          data-code="de-DE" data-flag="flag-germany">
          <i class="flag flag-germany"></i><span>Deutsch</span>
        </button>
      </li>
    </ul>

    {{-- EDITOR BODY --}}
    <div class="mx-auto w-full max-w-[1600px] px-4 pb-24">
    {{-- STAGE --}}
      <div id="editorStage" class="relative h-[78vh] min-h-[620px] w-full overflow-hidden rounded-[32px] border border-white/10 bg-black/45 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_60px_-36px_rgba(0,0,0,0.95)]">
        <canvas id="mapCanvas" class="block h-full w-full"></canvas>

        {{-- BOOT OVERLAY (wait for GO) --}}
        <div id="bootOverlay" class="absolute inset-0 z-30 hidden pointer-events-auto">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
          <div class="absolute left-1/2 top-1/2 w-[520px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-black/55 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_40px_-22px_rgba(0,0,0,0.9)]">
            <div class="text-xs font-extrabold uppercase tracking-[0.22em] text-white/70">Ready to load</div>
            <div id="bootOverlayText" class="mt-2 text-base font-semibold text-white/85">
              Select a map + preset, then click GO.
            </div>
            <div class="mt-4 text-[11px] font-semibold text-white/55">
              Tip: you can still change the selection anytime before loading.
            </div>
          </div>
        </div>

        {{-- HOTKEYS WIDGET (top-left) --}}
        <div id="hudHotkeys" class="absolute left-5 top-5 z-40 pointer-events-auto">
          <div class="rounded-2xl border border-white/10 bg-black/35 px-4 py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2 text-xs font-extrabold text-white/85">
                <span class="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <svg viewBox="0 0 24 24" class="h-4 w-4 text-white/80" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 8h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"/>
                  <path d="M6 12h.01M9 12h.01M12 12h.01M15 12h.01M18 12h.01"/>
                  <path d="M7 16h10"/>
                </svg>
              </span>
                MOVEMENT MODE
                <span class="ml-1 text-white/45 font-semibold">(H)</span>
              </div>

              <button
                type="button"
                data-hud-toggle="hudHotkeysBody"
                data-hud-key="hotkeys"
                class="inline-flex cursor-pointer h-7 w-7 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                title="Collapse / expand"
                aria-label="Collapse / expand"
              >
                ›
              </button>
            </div>

            <div id="hudHotkeysBody" class="mt-2 text-[11px] font-semibold text-white/65 leading-5">
              <div class="text-white/45">F1 · Hide controls</div>
              <div class="text-white/45">F2 · Hide data</div>
              <div class="text-white/45">F3 · Toggle movement mode</div>
              <div class="text-white/45">F4 · Hide mode</div>
              <div class="text-white/45">F5 · Hide quickbar</div>
            </div>
          </div>
        </div>

        {{-- TOP BAR (mode + add badge) --}}
        <div id="hudTopPanel" class="pointer-events-auto absolute left-1/2 top-4 z-40 -translate-x-1/2">
          <div class="rounded-2xl border border-white/10 bg-black/35 px-5 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_40px_-22px_rgba(0,0,0,0.9)] backdrop-blur-xl">
            <div class="flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold tracking-wide text-white/70">
              <span class="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-300/90"></span>
                E · NEXT MODE
              </span>

              <span id="hudAddBadge" class="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/80">
                ADD · OFF <span class="text-white/45 font-semibold">(A/Q)</span>
              </span>

              <span id="hudStatusBadge" class="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/80">
                READY
              </span>
            </div>

            <div id="hudModeTabs" class="mt-2 grid grid-cols-5 gap-1 rounded-2xl border border-white/10 bg-white/5 p-1 pointer-events-auto">
              <button type="button" data-mode="checkpoints" class="inline-flex cursor-pointer h-9 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/0 px-3 text-[11px] font-extrabold text-white/70 hover:bg-white/10" title="Checkpoints">
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="8"/>
                  <path d="M12 8v8M8 12h8"/>
                </svg>
              </button>
              <button type="button" data-mode="boundarySpheres" class="inline-flex cursor-pointer h-9 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/0 px-3 text-[11px] font-extrabold text-white/70 hover:bg-white/10" title="Boundary spheres">
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="M3 12h18M12 3v18"/>
                </svg>
              </button>
              <button type="button" data-mode="functionOrbs" class="inline-flex cursor-pointer h-9 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/0 px-3 text-[11px] font-extrabold text-white/70 hover:bg-white/10" title="Function orbs">
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="7"/>
                  <path d="M12 5v14"/>
                </svg>
              </button>
              <button type="button" data-mode="skillBans" class="inline-flex cursor-pointer h-9 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/0 px-3 text-[11px] font-extrabold text-white/70 hover:bg-white/10" title="Skill bans">
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="M7 17 17 7"/>
                </svg>
              </button>
              <button type="button" data-mode="portals" class="inline-flex cursor-pointer h-9 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/0 px-3 text-[11px] font-extrabold text-white/70 hover:bg-white/10" title="Portals">
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M7 7h10v10H7z"/>
                  <path d="M4 12h3M17 12h3"/>
                </svg>
              </button>
            </div>
            <div class="mt-2">
              <div id="hudModeTitle" class="text-[22px] font-extrabold leading-none tracking-[0.12em] text-white">
                CHECKPOINTS
              </div>
              <div id="hudModeLevel" class="mt-1 text-[11px] font-semibold tracking-wide text-white/60">
                LEVEL 0 / -1
              </div>
            </div>
          </div>

          <div
            id="hudModeList"
            class="mt-2 hidden rounded-2xl border border-white/10 bg-black/55 px-4 py-2 text-[11px] font-semibold text-white/75 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl"
          ></div>
        </div>

        {{-- LEFT DATA PANEL --}}
        <div id="hudLeftPanel" class="absolute left-5 top-28 z-30 w-[340px]">
          <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-white/85 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl">
            <div class="h-2 w-2 rounded-full bg-pink-300/80"></div>
            <div id="hudOrbPortalLimit" class="text-xs font-extrabold tracking-[0.18em]">
              ORB/PORTAL LIMIT: 0/193
            </div>
          </div>

          <div class="mt-3 rounded-2xl border border-white/10 bg-black/35 px-5 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_40px_-22px_rgba(0,0,0,0.9)] backdrop-blur-xl">
            <div class="flex items-center justify-between gap-3">
              <div id="hudDataTitle" class="text-xs font-extrabold uppercase tracking-[0.22em] text-white/80">
                CHECKPOINT DATA
              </div>

              <div class="flex items-center gap-2">
                <div class="text-[11px] font-semibold text-white/50">
                  <span class="text-white/40">View</span> :
                  <span id="hudViewType" class="text-white/75">ALL</span>
                </div>

                <button
                  type="button"
                  data-hud-toggle="hudLeftBody"
                  data-hud-key="left"
                  class="inline-flex cursor-pointer h-7 w-7 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                  title="Collapse / expand"
                  aria-label="Collapse / expand"
                >
                  ›
                </button>
              </div>
            </div>

            <div id="hudLeftBody">
              <div class="mt-3 rounded-xl border border-white/10 bg-black/25 p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                <div id="hudDataBody" class="text-sm text-white/75">NO DATA SELECTED</div>
              </div>

              <div class="mt-3 flex items-center justify-between text-[11px] font-semibold text-white/60">
                <div id="hudSpeed">Camera speed: x1</div>
              </div>
            </div>
          </div>
        </div>

        {{-- RIGHT HELP --}}
        <div id="hudRightPanel" class="absolute right-5 top-5 z-30 w-[380px] pointer-events-auto">
          <div class="rounded-2xl border border-white/10 bg-black/35 px-5 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_40px_-22px_rgba(0,0,0,0.9)] backdrop-blur-xl">
            <div class="flex items-center justify-between gap-3">
              <div class="text-xs font-extrabold uppercase tracking-[0.22em] text-white/70">
                CONTROLS
              </div>

              <button
                type="button"
                data-hud-toggle="hudRightBody"
                data-hud-key="right"
                class="inline-flex cursor-pointer h-7 w-7 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                title="Collapse / expand"
                aria-label="Collapse / expand"
              >
                ›
              </button>
            </div>

            <div id="hudRightBody">
              <div id="hudHelpBody" class="max-h-[48vh] space-y-1 overflow-auto pr-1 text-sm font-semibold text-white/75"></div>
            </div>
          </div>
        </div>

        {{-- QUICKBAR --}}
        <div id="hudQuickbar" class="absolute bottom-5 left-1/2 z-40 -translate-x-1/2 pointer-events-auto">
          <div class="flex flex-wrap items-center justify-center gap-2 rounded-3xl border border-white/10 bg-black/35 p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_40px_-22px_rgba(0,0,0,0.9)] backdrop-blur-xl">
            <button id="hudQMove" type="button" class="rounded-2xl cursor-pointer border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-extrabold text-white/85 hover:bg-white/10">
              MOVE: LOOK
            </button>

            <button id="hudQAdd" type="button" class="rounded-2xl cursor-pointer border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-extrabold text-white/85 hover:bg-white/10">
              PLACE: OFF
            </button>

            <button id="hudQView" type="button" class="rounded-2xl cursor-pointer border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-extrabold text-white/85 hover:bg-white/10">
              VIEW: ALL
            </button>
          </div>
        </div>

        {{-- MODALS --}}
        <div id="modalOverlay" class="pointer-events-none absolute inset-0 z-[60] hidden">
          <div class="absolute inset-0 bg-black/65 backdrop-blur-sm"></div>

          <div class="absolute left-1/2 top-1/2 w-[720px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-[32px] border border-white/10 bg-black/60 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_40px_70px_-40px_rgba(0,0,0,0.95)] backdrop-blur-xl">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div id="modalTitle" class="text-xs font-extrabold uppercase tracking-[0.22em] text-white/70">Modal</div>
                <div id="modalSubtitle" class="mt-1 text-sm font-semibold text-white/60">—</div>
              </div>
              <button
                id="modalClose"
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/85 hover:bg-white/10"
                title="Close"
              >
                <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div id="modalBody" class="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm font-semibold text-white/75 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
              —
            </div>

            <div id="modalFooter" class="mt-4 flex items-center justify-end gap-2">
              <button
                id="modalPrimary"
                type="button"
                class="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-extrabold text-white/85 hover:bg-white/10"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
@endsection

@push('scripts')
  <script nonce="{{ $nonce }}">
    document.documentElement.lang = @json(app()->getLocale());
    window.EDITOR_I18N = @json(\Illuminate\Support\Facades\Lang::get('editor'));
  </script>
  @vite('resources/js/pages/editor.js', null, ['nonce' => csp_nonce()])
@endpush