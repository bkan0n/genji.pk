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

    @vite(['resources/js/app.js'])

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

    <main class="relative overflow-hidden min-h-[100vh]">
      @yield('content')
      <div class="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div id="prism" class="relative h-full w-full"></div>
      </div>
    </main>
    @if (session('error'))
      <div class="mx-auto max-w-7xl px-4 pt-4">
        <div class="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
          <div class="font-extrabold">Access denied</div>
          <div class="mt-1 text-red-100/80">{{ session('error') }}</div>
        </div>
      </div>
    @endif

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
</html>
