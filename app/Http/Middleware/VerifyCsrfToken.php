<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VerifyCsrfToken extends Middleware
{
    protected function tokensMatch($request): bool
    {
        $token = (string) $this->getTokenFromRequest($request);
        $sessionToken = (string) $request->session()->token();
        $cookieToken = (string) $request->cookies->get('XSRF-TOKEN', '');

        if ($token !== '' && $sessionToken !== '' && hash_equals($sessionToken, $token)) {
            $this->debug('match_session', $request, $token, $sessionToken, $cookieToken);
            return true;
        }

        if ($token !== '' && $cookieToken !== '' && hash_equals($cookieToken, $token)) {
            if ($request->hasSession()) {
                $request->session()->put('_token', $cookieToken);
            }
            $this->debug('match_cookie', $request, $token, $sessionToken, $cookieToken);
            return true;
        }

        $this->debug('mismatch', $request, $token, $sessionToken, $cookieToken);
        return false;
    }

    private function debug(string $event, Request $request, string $token, string $sessionToken, string $cookieToken): void
    {
        if (!filter_var(env('CSRF_DEBUG', false), FILTER_VALIDATE_BOOLEAN)) {
            return;
        }

        $hash = static fn (string $v) => $v === '' ? '' : substr(hash('sha256', $v), 0, 12);

        $sessionCookie = config('session.cookie');
        $data = [
            'event' => $event,
            'method' => $request->getMethod(),
            'path' => $request->path(),
            'session_id' => (string) $request->session()->getId(),
            'session_cookie' => $sessionCookie,
            'has_session_cookie' => $sessionCookie ? $request->cookies->has($sessionCookie) : null,
            'token_hash' => $hash($token),
            'session_hash' => $hash($sessionToken),
            'cookie_hash' => $hash($cookieToken),
            'header_csrf' => $hash((string) $request->header('X-CSRF-TOKEN', '')),
            'header_xsrf' => $hash((string) $request->header('X-XSRF-TOKEN', '')),
            'input_token' => $hash((string) $request->input('_token', '')),
            'ip' => $request->ip(),
        ];

        try {
            Log::build([
                'driver' => 'single',
                'path' => storage_path('logs/csrf-debug.log'),
            ])->debug('csrf', $data);
        } catch (\Throwable $e) {
            // ignore
        }
    }
}
