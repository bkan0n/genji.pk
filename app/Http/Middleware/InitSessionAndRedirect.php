<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\View;

class InitSessionAndRedirect
{
    public function handle(Request $request, Closure $next)
    {
        if (! $request->session()->has('LAST_ACTIVITY')) {
            $request->session()->put('LAST_ACTIVITY', now()->timestamp);
        }

        $host = $request->getHost();
        $map = config('redirect.map', []);

        $redirectUrl = $map[$host] ?? config('app.url');
        Config::set('app.redirect_url', $redirectUrl);
        View::share('REDIRECT_URL', $redirectUrl);

        return $next($request);
    }
}
