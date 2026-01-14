<?php

namespace App\Http\Middleware;

use App\Services\GenjiApiService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class RequireDiscordModerator
{
    public function __construct(private GenjiApiService $api) {}

    public function handle(Request $request, Closure $next): Response
    {
        $userId = (string) $request->session()->get('user_id', '');
        if ($userId === '') {
            return redirect('/')->with('error', 'Please login.');
        }

        if ((bool) $request->session()->get('is_mod', false) === true
            || (bool) $request->session()->get('can_moderate', false) === true) {
            $request->session()->put('is_mod', true);
            return $next($request);
        }

        $sessionId = (string) $request->session()->getId();
        if ($sessionId !== '') {
            $cacheKey = "session:is_mod:{$sessionId}";

            if (Cache::has($cacheKey)) {
                $isMod = (bool) Cache::get($cacheKey);
                $request->session()->put('is_mod', $isMod);

                if ($isMod) {
                    return $next($request);
                }

                abort(403, 'Moderator role required.');
            }

            $isMod = $this->api->sessionIsMod($sessionId);

            if ($isMod !== null) {
                $ttl = max(10, (int) env('SESSION_IS_MOD_TTL_SECONDS', 120));
                Cache::put($cacheKey, (bool) $isMod, now()->addSeconds($ttl));
                $request->session()->put('is_mod', (bool) $isMod);

                if ($isMod) return $next($request);

                abort(403, 'Moderator role required.');
            }
        }

        $request->session()->put('is_mod', false);
        abort(403, 'Moderator role required.');
    }
}
