@php
  $theme = strtolower(request()->cookie('theme') ?? 'dark');
  $isDark = $theme !== 'light';
  $logoStatic = $isDark ? 'assets/img/favicon-high.png' : 'assets/img/favicon-high-black.png';
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth" data-theme="{{ request()->cookie('theme', 'dark') }}">
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
    <meta name="cdn-url" content="{{ rtrim(config('app.cdn_url') ?: '', '/') }}">
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{{ config('app.url') }}" />
    <meta property="og:image" content="{{ cdn_asset('assets/img/favicon-high.png') }}" />
    <meta name="theme-color" content="#22c55e" />
    <meta name="redirect-url" content="{{ config('app.redirect_url') }}" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta name="csp-nonce" content="{{ $nonce }}" />
    <link rel="preload" as="image" href="{{ cdn_asset($logoStatic) }}">
    <script>
      document.documentElement.classList.add('prism-preload');
    </script>
    <style nonce="{{ $nonce }}">
      html.theme-preload *,
      html.theme-preload {
        transition: none !important;
      }
    </style>
    
    <script nonce="{{ $nonce }}">
      (function () {
        try {
          const root = document.documentElement;
          root.classList.add('theme-preload');

          const readCookie = (name) => {
            try {
              const safe = String(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const m = document.cookie.match(new RegExp('(?:^|;\\s*)' + safe + '=([^;]*)'));
              return m ? decodeURIComponent(m[1]) : '';
            } catch {
              return '';
            }
          };
          const pick = (t) => ((t === 'dark' || t === 'light') ? t : '');

          const saved = pick((localStorage.getItem('theme') || localStorage.getItem('gp-theme') || '').trim());
          const cookieTheme = pick(readCookie('theme').trim());
          const theme = cookieTheme || saved || 'dark';

          root.dataset.theme = theme;
          root.style.colorScheme = theme;

          if (theme === 'dark') root.classList.add('dark');
          else root.classList.remove('dark');

          try { localStorage.setItem('theme', theme); } catch {}
          try { document.cookie = 'theme=' + encodeURIComponent(theme) + '; Path=/; Max-Age=31536000; SameSite=Lax'; } catch {}
        } catch {}
      })();
    </script>

    <link rel="icon" type="image/png" href="{{ cdn_asset('assets/img/favicon.png') }}" />
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
  <body class="selection:bg-brand-500/30 bg-zinc-50 font-sans text-zinc-900 selection:text-white dark:bg-zinc-950 dark:text-zinc-100">
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
