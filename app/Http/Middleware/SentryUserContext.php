<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Sentry\State\HubInterface;

class SentryUserContext
{
    public function __construct(private HubInterface $sentry) {}

    public function handle(Request $request, Closure $next)
    {
        if (! $request->hasSession()) {
            return $next($request);
        }

        $id = $request->session()->get('user_id');
        $name = $request->session()->get('discord_global_name') ?? $request->session()->get('username');

        if ($id) {
            $this->sentry->configureScope(function ($scope) use ($id, $name) {
                $scope->setUser([
                    'id' => (string) $id,
                    'username' => $name,
                ]);
                $scope->setTag('app.area', 'backend');
            });
        }

        return $next($request);
    }
}
