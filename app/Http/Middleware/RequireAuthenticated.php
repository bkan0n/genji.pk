<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireAuthenticated
{
    /**
     * Handle an incoming request.
     * Allow Discord users and verified Email users.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->session()->get('user');

        // Not authenticated at all
        if (!$user || !isset($user['id'])) {
            return redirect('/?openLogin=1')
                ->with('error', __('auth.messages.invalid_credentials'));
        }

        // Discord users are always allowed
        if (($user['auth_type'] ?? '') === 'discord') {
            return $next($request);
        }

        // Email users must be verified
        if (($user['auth_type'] ?? '') === 'email' && !($user['email_verified'] ?? false)) {
            return redirect('/?openVerifyEmail=1')
                ->with('warning', __('auth.messages.email_not_verified'));
        }

        // All other cases (verified email users) are allowed
        return $next($request);
    }
}
