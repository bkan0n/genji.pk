@extends('layouts.app')

@section('title', 'My IP')
@section('og:title', 'My IP')
@section('og:description', 'Show your IP address in one click')

@push('head')
  @php($nonce = csp_nonce())
@endpush

@section('content')
  <!-- Hero -->
  <section class="relative overflow-visible">
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 min-h-[100vh]">
      <div class="grid items-center gap-10 lg:grid-cols-12">
        <div class="space-y-6 lg:col-span-7">
          <span
            class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
          >
            <span class="bg-brand-400 inline-block h-2 w-2 rounded-full"></span>
            Temporary tool
          </span>

          <h1
            class="overflow-visible text-4xl leading-[1.15] font-black tracking-tight sm:text-5xl sm:leading-[1.12]"
          >
            Show my IP address
            <span
              class="from-brand-300 block bg-gradient-to-r via-emerald-200 to-white bg-clip-text pb-1 text-transparent sm:pb-1.5"
            >
              in one click
            </span>
          </h1>

          <p class="max-w-2xl text-zinc-300">
            Click the button below to reveal the IP address detected by the server.
          </p>

          <div class="flex flex-wrap items-center gap-3">
            <button
              id="showIpBtn"
              type="button"
              class="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
              aria-controls="ipResult"
              aria-expanded="false"
            >
              Show my IP
              <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M14 3l7 7-7 7v-4H3v-6h11V3z" />
              </svg>
            </button>
          </div>

          <div class="pt-2 text-sm text-zinc-400">
            <span class="bg-brand-400 h-2 w-2 rounded-full inline-block mr-2"></span>
            No requests to external services: rendered by the server.
          </div>
        </div>

        <!-- Result card -->
        <div class="lg:col-span-5">
          <div
            id="ipCard"
            class="relative rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl"
            data-server-ip="{{ request()->ip() }}"
          >
            <div class="rounded-xl bg-zinc-900/50 p-6">
              <div class="mb-4 flex items-center justify-between text-xs text-zinc-400">
                <span>Result</span>
              </div>

              <div id="ipResult" class="space-y-3" aria-live="polite">
                <div
                  id="ipRow"
                  class="flex items-center justify-between gap-3 rounded-lg border border-white/10 p-3"
                  hidden
                >
                  <div>
                    <div class="font-semibold">IP Address</div>
                    <div id="ipValue" class="text-sm text-zinc-300"></div>
                  </div>
                  <span
                    id="ipBadge"
                    class="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300 ring-1 ring-emerald-400/25 hidden"
                  >
                    Copied ✓
                  </span>
                </div>

                <div id="ipHint" class="text-xs text-zinc-400">
                  Click “Show my IP” to reveal it.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  @push('scripts')
    <script nonce="{{ $nonce }}">
      (function () {
        const btnShow  = document.getElementById('showIpBtn');
        const row      = document.getElementById('ipRow');
        const valueEl  = document.getElementById('ipValue');
        const hint     = document.getElementById('ipHint');
        const badge    = document.getElementById('ipBadge');
        const card     = document.getElementById('ipCard');

        function reveal(ip) {
          valueEl.textContent = ip || 'N/A';
          row.hidden = false;
          btnShow.setAttribute('aria-expanded', 'true');
          if (hint) hint.textContent = 'Click “Copy” to put the IP into your clipboard.';
        }

        btnShow?.addEventListener('click', async () => {
          btnShow.disabled = true;
          const original = btnShow.innerHTML;
          btnShow.innerHTML = 'Loading…';
          try {
            const ip = card?.dataset?.serverIp || '';
            await new Promise(r => setTimeout(r, 180));
            reveal(ip);
          } finally {
            btnShow.disabled = false;
            btnShow.innerHTML = original;
          }
        });
      })();
    </script>
  @endpush
@endsection