<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureRouteUserMatchesAuthenticatedUser
{
    public function handle(
        Request $request,
        Closure $next,
        string $routeParameter = 'user_id',
    ): Response {
        if (! $request->hasSession()) {
            return $this->unauthenticated();
        }

        $authenticatedUserId = $this->validUserId(
            $request->session()->get('user_id'),
        );

        if ($authenticatedUserId === null) {
            return $this->unauthenticated();
        }

        $routeUserId = $this->validUserId($request->route($routeParameter));

        if ($routeUserId === null || ! hash_equals($authenticatedUserId, $routeUserId)) {
            return response()->json(
                [
                    'error' => true,
                    'message' => 'You cannot modify another user.',
                ],
                403,
            );
        }

        return $next($request);
    }

    private function validUserId(mixed $value): ?string
    {
        if (is_object($value) && method_exists($value, 'getRouteKey')) {
            $value = $value->getRouteKey();
        }

        if (! is_int($value) && ! is_string($value)) {
            return null;
        }

        $value = trim((string) $value);

        return preg_match('/^\d{1,20}$/D', $value) === 1 ? $value : null;
    }

    private function unauthenticated(): JsonResponse
    {
        return response()->json(
            [
                'error' => true,
                'message' => 'Authentication required.',
            ],
            401,
        );
    }
}
