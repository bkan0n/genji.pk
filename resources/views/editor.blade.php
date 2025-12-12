@extends('layouts.app')

@section('title', '3D Map Editor')

@push('head')
  @php($nonce = csp_nonce())
@endpush

@section('content')
  <div class="mx-auto max-w-7xl px-4 py-10">
    <div class="mb-4">
      <h1 class="text-xl font-bold text-zinc-100">3D Map Editor</h1>
      <p class="text-sm text-zinc-400">Click on the map to place checkpoints (0-based). Drag with gizmo to adjust.</p>
    </div>

    {{-- TOOLBAR (OUTSIDE CANVAS) --}}
    <div class="mb-3">
      <div class="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-zinc-950/40 p-2 shadow-[0_20px_70px_-25px_rgba(0,0,0,0.9)] ring-1 ring-white/10 backdrop-blur-xl">
        {{-- LEFT GROUP --}}
        <div class="flex items-center gap-2 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            id="btnAdd"
            class="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-zinc-100 hover:bg-white/10"
          >
            Add: OFF (A/Q)
          </button>

          <button
            id="btnSnap"
            class="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-zinc-100 hover:bg-white/10"
          >
            Snap to ground <span class="text-white/45 font-semibold">(G)</span>
          </button>

          <button
            id="btnExport"
            class="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-zinc-100 hover:bg-white/10"
          >
            Export JSON
          </button>

          <button
            id="btnImport"
            class="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-zinc-100 hover:bg-white/10"
          >
            Import data
          </button>

          <select
            id="mapSelect"
            class="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-zinc-100 hover:bg-white/10"
          >
            <option value="">Loading maps…</option>
          </select>
        </div>

        {{-- RIGHT GROUP --}}
        <div class="flex items-center gap-2 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div class="shrink-0 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            <span class="px-2 text-[10px] font-extrabold text-zinc-200">View</span>
            <button id="viewAllBtn" class="rounded-full px-3 py-1 text-[10px] font-extrabold text-zinc-100 bg-white/10">
              All
            </button>
            <button id="viewOnlyBtn" class="rounded-full px-3 py-1 text-[10px] font-extrabold text-zinc-100 hover:bg-white/10">
              Only
            </button>
          </div>

          {{-- Checkpoint picker --}}
          <div class="shrink-0 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            <button id="cpPrev" class="rounded-full px-3 py-1 text-[10px] font-extrabold text-zinc-100 hover:bg-white/10">◀</button>
            <select id="checkpointSelect" class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-extrabold text-zinc-100">
              <option value="0">CP 0</option>
            </select>
            <button id="cpNext" class="rounded-full px-3 py-1 text-[10px] font-extrabold text-zinc-100 hover:bg-white/10">▶</button>
          </div>

          {{-- Fullscreen (still relevant here too) --}}
          <button
            id="btnFullscreen"
            type="button"
            class="shrink-0 group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-white/85 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl hover:bg-white/10 hover:text-white"
            title="Fullscreen (F)"
          >
            <span class="inline-block h-2 w-2 rounded-full bg-sky-300/80 group-hover:bg-sky-200"></span>
            FULLSCREEN
            <span class="text-white/50 font-semibold">(F)</span>
          </button>
        </div>
      </div>
    </div>

    {{-- STAGE (CANVAS + HUD) --}}
    <div
      id="editorStage"
      class="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/40 ring-1 ring-white/10 shadow-[0_20px_70px_-25px_rgba(0,0,0,0.9)]
            h-[72vh]"
    >
      {{-- Premium background --}}
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute inset-0 bg-[radial-gradient(1000px_500px_at_50%_0%,rgba(16,185,129,0.16),transparent_60%),radial-gradient(900px_520px_at_85%_75%,rgba(59,130,246,0.12),transparent_60%)]"></div>
        <div class="absolute inset-0 opacity-[0.35] bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(closest-side,black,transparent)]"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-black/40"></div>
      </div>

      <canvas id="mapCanvas" class="block h-full w-full"></canvas>

      {{-- HOTKEYS WIDGET (top-left) --}}
      <div id="hudHotkeys" class="absolute left-5 top-5 z-40 pointer-events-auto">
        <div class="rounded-2xl border border-white/10 bg-black/35 px-3 py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl">
          <div class="flex items-center gap-2 text-xs font-extrabold text-white/85">
            <span class="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-white/10 bg-white/5">
              <svg viewBox="0 0 24 24" class="h-4 w-4 text-white/80" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 8h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"/>
                <path d="M6 12h.01M9 12h.01M12 12h.01M15 12h.01M18 12h.01"/>
                <path d="M7 16h10"/>
              </svg>
            </span>
            SHORTCUTS
            <span class="ml-1 text-white/45 font-semibold">(H)</span>
          </div>

          <div class="mt-2 text-[11px] font-semibold text-white/65 leading-5">
            <div>F1 Help · F2 Data · F6 Perf</div>
            <div class="text-white/45">Move: ZQSD / WASD · Add: A(AZERTY) / Q(QWERTY)</div>
          </div>
        </div>
      </div>

      {{-- TOP BAR (mode + add badge) --}}
      <div id="hudTopPanel" class="pointer-events-none absolute left-1/2 top-4 z-40 -translate-x-1/2">
        <div class="rounded-2xl border border-white/10 bg-black/35 px-4 py-2 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_40px_-22px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div class="flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold tracking-wide text-white/70">
            <span class="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-300/90"></span>
              E · MODE
            </span>

            <span id="hudAddBadge" class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/80">
              ADD · OFF <span class="text-white/45 font-semibold">(A/Q)</span>
            </span>

            <span id="hudStatusBadge" class="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/80">
              READY
            </span>
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
          class="mt-2 hidden w-[340px] rounded-2xl border border-white/10 bg-black/35 p-3 text-sm shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_40px_-22px_rgba(0,0,0,0.9)] backdrop-blur-xl"
        ></div>
      </div>

      {{-- LEFT DATA PANEL --}}
      <div id="hudLeftPanel" class="absolute left-5 top-28 z-30 w-[340px]">
        <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-white/85 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl">
          <div class="h-2 w-2 rounded-full bg-pink-300/80"></div>
          <div id="hudOrbPortalLimit" class="text-xs font-extrabold tracking-[0.18em]">
            ORB/PORTAL LIMIT: 0/193
          </div>
        </div>

        <div class="mt-3 rounded-2xl border border-white/10 bg-black/35 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_40px_-22px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div class="flex items-center justify-between gap-3">
            <div id="hudDataTitle" class="text-xs font-extrabold uppercase tracking-[0.22em] text-white/80">
              CHECKPOINT DATA
            </div>
            <div class="text-[11px] font-semibold text-white/50">
              <span class="text-white/40">View</span> :
              <span id="hudViewType" class="text-white/75">ALL</span>
            </div>
          </div>

          <div class="mt-3 rounded-xl border border-white/10 bg-black/25 p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
            <div id="hudDataBody" class="text-sm text-white/75">NO DATA SELECTED</div>
          </div>

          <div class="mt-3 flex items-center justify-between text-[11px] font-semibold text-white/60">
            <div id="hudSpeed">Speed: x1</div>
            <div class="text-white/40">[ / ] CP · Del remove</div>
          </div>
        </div>
      </div>

      {{-- RIGHT HELP --}}
      <div id="hudRightPanel" class="absolute right-5 top-28 z-30 w-[380px] pointer-events-none">
        <div class="rounded-2xl border border-white/10 bg-black/35 p-4 text-right shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_40px_-22px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div class="mb-2 text-xs font-extrabold uppercase tracking-[0.22em] text-white/70">
            CONTROLS
          </div>
          <div id="hudHelpBody" class="max-h-[48vh] space-y-1 overflow-hidden text-sm font-semibold text-white/75"></div>
          <div class="mt-3 text-[11px] font-semibold text-white/45">
            Tip: hold <span class="text-white/70">RMB</span> to look
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