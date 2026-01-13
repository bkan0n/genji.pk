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

    <main class="relative overflow-hidden">
      @yield('content')
      <div class="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div id="prism" class="relative h-full w-full"></div>
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
    @include('modal.notifications-settings')
    @include('modal.credits')
    @include('modal.rules')
    @include('auth.login')
    @include('auth.register')
    @include('auth.forgot-password')
    @include('auth.reset-password')
    @include('auth.verify-email')

    @php($lang = $selectedLang ?? (app()->getLocale() ?? 'en'))
    <script nonce="{{ $nonce }}">
      document.documentElement.lang = @json(app()->getLocale());
      window.NOTIFICATIONS_I18N = @json(\Illuminate\Support\Facades\Lang::get('modals'));
      window.user_id = @json(session('user_id'));
      window.currentLang = @json($lang);
      const CSRF = document.querySelector('meta[name="csrf-token"]')?.content || '';
      
      // Auto-open reset password modal if reset_token is in session
      const hasResetToken = @json(session()->has('reset_token'));
      const openResetParam = new URLSearchParams(window.location.search).get('openResetPassword');
      if (hasResetToken && openResetParam === '1') {
        setTimeout(() => window.openResetPasswordModal?.(), 100);
      }
    </script>
    </body>
</html>
