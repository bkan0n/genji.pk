<?php

use App\Http\Middleware\RequireDiscordModerator;
use App\Http\Middleware\RequireAuthenticated;
use App\Http\Middleware\EnsureRouteUserMatchesAuthenticatedUser;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Spatie\Csp\AddCspHeaders;
use Sentry\Laravel\Integration;

return Application::configure(basePath: dirname(__DIR__))
    ->withProviders(require __DIR__ . '/providers.php')
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Cloudflare
        $middleware->replace(
            \Illuminate\Http\Middleware\TrustProxies::class,
            \Monicahq\Cloudflare\Http\Middleware\TrustProxies::class
        );

        // Web middleware
        $middleware->group('web', [
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \App\Http\Middleware\HydrateSessionFromDeviceCookie::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \App\Http\Middleware\RememberTokenAuth::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
            \App\Http\Middleware\DetectLanguage::class,
        ]);

        // Aliases
        $middleware->alias([
            'auth.user' => RequireAuthenticated::class,
            'auth.any' => \App\Http\Middleware\AuthenticatedUser::class,
            'auth.verified' => RequireAuthenticated::class,
            'email.verified' => \App\Http\Middleware\EmailVerified::class,
            'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
            'discord.moderator' => RequireDiscordModerator::class,
            'user.matches-route' => EnsureRouteUserMatchesAuthenticatedUser::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->stopIgnoring(HttpException::class);
        Integration::handles($exceptions);
    })
    ->create();
