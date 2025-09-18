<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark scroll-smooth">
  <head>
    @php($nonce = csp_nonce())
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>@yield('title', config('app.name'))</title>
    <meta property="og:title" content="@yield('og:title', config('app.name'))" />
    <meta
      property="og:description"
      content="@yield('og:description', 'The Official Genji Parkour Website.')"
    />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{{ config('app.url') }}" />
    <meta property="og:image" content="{{ asset('assets/img/favicon-high.png') }}" />
    <meta name="theme-color" content="#22c55e" />
    <meta name="redirect-url" content="{{ config('app.redirect_url') }}" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta name="csp-nonce" content="{{ $nonce }}" />

    <link rel="icon" type="image/png" href="{{ asset('assets/img/favicon.png') }}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />

    @vite(['resources/js/app.js'], null, ['nonce' => $nonce])

    @stack('head')

    @php($inlineCss = trim($__env->yieldPushContent('inline-styles')))
    @if ($inlineCss !== '')
      <style nonce="{{ $nonce }}">
        {!! $inlineCss !!}
      </style>
    @endif
  </head>
  <body class="selection:bg-brand-500/30 bg-zinc-950 font-sans text-zinc-100 selection:text-white">
    @include('partials.navbar')

    <main class="relative overflow-hidden">
      @yield('content')
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div class="bg-zinc-930 absolute inset-0"></div>
        <div
          class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_65%)]"
        ></div>
        <div
          class="motion-safe:u-soft-drift absolute -inset-28 opacity-70 mix-blend-screen blur-3xl [background:radial-gradient(60%_40%_at_20%_25%,rgba(57,255,20,.18),transparent_62%),radial-gradient(50%_45%_at_78%_30%,rgba(57,255,20,.14),transparent_64%),radial-gradient(55%_60%_at_60%_80%,rgba(57,255,20,.16),transparent_66%)]"
        ></div>
        <div class="absolute inset-0">
          <div
            class="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.055)_0,rgba(255,255,255,0.055)_0.5px,transparent_0.5px,transparent_22px)] [background-size:160%_160%] opacity-35 motion-safe:animate-[diagDrift_80s_linear_infinite]"
          ></div>
          <div
            class="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_0.5px,transparent_0.5px,transparent_18px)] [mask-image:radial-gradient(120%_90%_at_28%_55%,#000_42%,#0000_68%),radial-gradient(120%_90%_at_78%_35%,#000_40%,#0000_66%)] [background-size:180%_180%] [background-position:20%_25%] opacity-24 motion-safe:animate-[diagDrift_100s_linear_infinite_reverse]"
          ></div>
          <div
            class="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.04)_0,rgba(255,255,255,0.04)_0.4px,transparent_0.4px,transparent_26px)] [background-size:200%_200%] [background-position:80%_40%] opacity-16 motion-safe:animate-[diagDrift_120s_linear_infinite]"
          ></div>
        </div>
        <div
          class="motion-safe:u-shimmer-x absolute inset-x-[-25%] top-1/3 h-20 opacity-45 mix-blend-screen blur-2xl [background:linear-gradient(90deg,transparent,rgba(57,255,20,.22),transparent)]"
        ></div>
        <div
          class="motion-safe:u-grain-breath absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:3px_3px] opacity-12 mix-blend-overlay"
        ></div>
        <div
          class="absolute inset-0 [mask-image:radial-gradient(120%_90%_at_50%_60%,black_58%,#0000_88%)] ring-1 ring-white/5 ring-inset"
        ></div>
      </div>
    </main>

    @include('partials.footer')

    @stack('scripts')

    @php($inlineJs = trim($__env->yieldPushContent('inline-scripts')))
    @if ($inlineJs !== '')
      <script nonce="{{ $nonce }}">
        {!! $inlineJs !!};
      </script>
    @endif

    @include('modal.profile')
    @include('modal.notifications')
    @include('modal.credits')

    @php($lang = $selectedLang ?? (app()->getLocale() ?? 'en'))
    <script nonce="{{ $nonce }}">
      document.documentElement.lang = @json(app()->getLocale());
      window.NOTIFICATIONS_I18N = @json(\Illuminate\Support\Facades\Lang::get('modals'));
      window.user_id = @json(session('user_id'));
      window.currentLang = @json($lang);
      const CSRF = document.querySelector('meta[name="csrf-token"]')?.content || '';
    </script>
  </body>
</html>
