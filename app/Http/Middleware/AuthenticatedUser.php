<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticatedUser
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->session()->has('user_id')) {
            return redirect()->route('home', ['openLogin' => 1, 'tab' => 'email'])
                ->with('error', 'Please log in to access this page.');
        }

        view()->share('currentUser', $request->session()->get('user'));

        return $next($request);
    }
}
