<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetLocaleFromCookie
{
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->query('lang', $request->cookie('lang', config('app.locale', 'en')));

        if (! preg_match('/^[a-z]{2}(-[A-Z]{2})?$/', $locale)) {
            $locale = 'en';
        }

        app()->setLocale($locale);

        if ($request->has('lang')) {
            cookie()->queue(
                cookie(
                    'lang',
                    $locale,
                    60 * 24 * 365,
                    path: '/',
                    secure: $request->isSecure(),
                    httpOnly: false,
                    sameSite: 'Lax',
                ),
            );
        }

        return $next($request);
    }
}
