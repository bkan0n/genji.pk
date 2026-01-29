<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HydrateSessionFromDeviceCookie
{
    private const DEVICE_SESSION_COOKIE = 'device_session_id';

    public function handle(Request $request, Closure $next): Response
    {
        $sessionCookie = (string) config('session.cookie', '');
        if ($sessionCookie === '') {
            return $next($request);
        }

        $current = (string) $request->cookies->get($sessionCookie, '');
        if ($current !== '') {
            return $next($request);
        }

        $deviceSessionId = (string) $request->cookies->get(self::DEVICE_SESSION_COOKIE, '');
        if ($deviceSessionId !== '') {
            $request->cookies->set($sessionCookie, $deviceSessionId);
        }

        return $next($request);
    }
}
