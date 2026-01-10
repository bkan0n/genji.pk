<?php

namespace App\Http\Middleware;

use App\Services\GenjiApiService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RememberTokenAuth
{
    public function __construct(private GenjiApiService $api) {}

    public function handle(Request $request, Closure $next): Response
    {
        if ($request->session()->has('user_id')) {
            return $next($request);
        }

        $rememberToken = (string) $request->cookie('remember_token', '');
        if ($rememberToken === '') {
            return $next($request);
        }

        $userId = $this->api->validateRememberToken($rememberToken);
        if (!$userId) {
            cookie()->queue(cookie()->forget('remember_token'));
            return $next($request);
        }

        $userData = $this->api->getUser($userId);
        if (!$userData) {
            cookie()->queue(cookie()->forget('remember_token'));
            return $next($request);
        }

        $isDiscord = strlen((string) $userId) >= 17;

        $request->session()->put('user_id', $userId);

        if ($isDiscord) {
            $request->session()->put('user', [
                'id' => $userId,
                'nickname' => $userData['nickname'] ?? ($userData['username'] ?? null),
                'global_name' => $userData['global_name'] ?? null,
                'coins' => $userData['coins'] ?? 0,
                'auth_type' => 'discord',
            ]);

            $request->session()->put('user_provider', 'discord');
            $request->session()->put('user_name', $userData['nickname'] ?? ($userData['username'] ?? ''));
        } else {
            $request->session()->put('user', [
                'id' => $userId,
                'email' => $userData['email'] ?? null,
                'username' => $userData['username'] ?? ($userData['nickname'] ?? null),
                'email_verified' => (bool) ($userData['email_verified'] ?? false),
                'coins' => $userData['coins'] ?? 0,
                'auth_type' => 'email',
            ]);

            $request->session()->put('user_provider', 'email');
            $request->session()->put('user_name', $userData['username'] ?? '');
        }

        $request->session()->regenerate();

        return $next($request);
    }
}
