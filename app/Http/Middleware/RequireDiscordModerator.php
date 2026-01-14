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

        if ((bool) $request->session()->get('is_mod', false) === true) {
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

            if (method_exists($this->api, 'sessionReadWithMeta')) {
                $meta = $this->api->sessionReadWithMeta($sessionId);
                if (is_array($meta)) {
                    $isMod = (bool) ($meta['is_mod'] ?? false);

                    $ttl = (int) (env('SESSION_IS_MOD_TTL_SECONDS', 120));
                    if ($ttl <= 0) {
                        $ttl = 120;
                    }

                    Cache::put($cacheKey, $isMod, now()->addSeconds($ttl));
                    $request->session()->put('is_mod', $isMod);

                    if ($isMod) {
                        return $next($request);
                    }

                    abort(403, 'Moderator role required.');
                }
            }
        }

        $request->session()->put('is_mod', false);
        abort(403, 'Moderator role required.');
    }
}
