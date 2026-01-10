<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EmailVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->session()->get('user');

        if (!$user) {
            return redirect()->route('login');
        }

        // Discord users are always "verified"
        if (($user['auth_type'] ?? '') === 'discord') {
            return $next($request);
        }

        // Email users must be verified
        if (($user['auth_type'] ?? '') === 'email' && !($user['email_verified'] ?? false)) {
            return redirect('/?openVerifyEmail=1')
                ->with('warning', __('auth.messages.email_not_verified'));
        }

        return $next($request);
    }
}
