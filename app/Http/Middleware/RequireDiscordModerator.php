<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class RequireDiscordModerator
{
    public function handle(Request $request, Closure $next)
    {
        $userId       = (string) $request->session()->get('user_id', '');
        $accessToken  = (string) $request->session()->get('discord_access_token', '');
        $refreshToken = (string) $request->session()->get('discord_refresh_token', '');
        $expiresAt    = $request->session()->get('discord_token_expires');

        if ($userId === '' || $accessToken === '') {
            return redirect('/')->with('error', 'Please login with Discord.');
        }

        $guildId = (string) Config::get('services.discord.guild_id');
        $roleIds = (array)  Config::get('services.discord.mod_roles', []);
        $verify  = $this->httpVerify();

        if ($guildId === '' || empty($roleIds)) {
            abort(500, 'Discord moderator guard is not configured.');
        }

        if ($this->isExpired($expiresAt)) {
            $new = $this->refreshToken($refreshToken, $verify);
            if (!$new) {
                return redirect('/')->with('error', 'Discord session expired, please login again.');
            }
            $accessToken  = (string) $new['access_token'];
            $refreshToken = (string) ($new['refresh_token'] ?? $refreshToken);
            $request->session()->put([
                'discord_access_token' => $accessToken,
                'discord_refresh_token' => $refreshToken,
                'discord_token_expires' => now()->addSeconds((int) ($new['expires_in'] ?? 3600)),
            ]);
        }

        $member = $this->fetchMember($guildId, $accessToken, $verify, $userId);
        if ($member === '__401__') {
            $new = $this->refreshToken($refreshToken, $verify);
            if (!$new) {
                return redirect('/')->with('error', 'Discord session expired, please login again.');
            }
            $accessToken  = (string) $new['access_token'];
            $refreshToken = (string) ($new['refresh_token'] ?? $refreshToken);
            $request->session()->put([
                'discord_access_token' => $accessToken,
                'discord_refresh_token' => $refreshToken,
                'discord_token_expires' => now()->addSeconds((int) ($new['expires_in'] ?? 3600)),
            ]);

            $member = $this->fetchMember($guildId, $accessToken, $verify, $userId, $useCache = false);
        }

        if ($member === null) {
            abort(403, 'Guild membership required.');
        }
        if ($member === '__ERR__') {
            abort(502, 'Discord API error.');
        }

        $userRoles = collect($member['roles'] ?? [])->map(fn ($id) => (string) $id);
        $allowed = $userRoles->intersect($roleIds)->isNotEmpty();

        if (!$allowed) {
            $request->session()->put('can_moderate', false);

            abort(403, 'Moderator role required.');
        }

        $request->session()->put('can_moderate', true);

        return $next($request);
    }

    private function fetchMember(
        string $guildId,
        string $accessToken,
        bool $verify,
        string $userId,
        bool $useCache = true
    ) {
        $cacheKey = "discord:userMember:{$guildId}:{$userId}";

        if ($useCache && Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        try {
            $resp = Http::withToken($accessToken)
                ->acceptJson()
                ->withOptions(['verify' => $verify, 'timeout' => 10])
                ->get("https://discord.com/api/users/@me/guilds/{$guildId}/member");

            if ($resp->status() === 404) {
                return null;
            }
            if ($resp->status() === 401) {
                return '__401__';
            }
            if (!$resp->ok()) {
                Log::error('Discord API error (member)', [
                    'status' => $resp->status(),
                    'body'   => $resp->json() ?: $resp->body(),
                ]);

                return '__ERR__';
            }

            $json = $resp->json();

            $ttlSeconds = (int) env('DISCORD_MEMBER_CACHE_SECONDS', 60);
            Cache::put($cacheKey, $json, now()->addSeconds($ttlSeconds));

            return $json;
        } catch (Throwable $e) {
            Log::error('Discord member fetch exception', ['error' => $e->getMessage()]);

            return '__ERR__';
        }
    }

    private function isExpired($expiresAt): bool
    {
        try {
            return now()->gte(Carbon::parse($expiresAt)->subSeconds(30));
        } catch (Throwable $e) {
            return true;
        }
    }

    private function refreshToken(string $refreshToken, bool $verify): ?array
    {
        if ($refreshToken === '') {
            return null;
        }

        $clientId     = (string) Config::get('services.discord.client_id');
        $clientSecret = (string) Config::get('services.discord.client_secret');
        $redirectUri  = (string) (env('DISCORD_REDIRECT_URI') ?: Config::get('services.discord.redirect'));

        try {
            $resp = Http::asForm()
                ->withOptions(['verify' => $verify, 'timeout' => 10])
                ->post('https://discord.com/api/oauth2/token', [
                    'client_id'     => $clientId,
                    'client_secret' => $clientSecret,
                    'grant_type'    => 'refresh_token',
                    'refresh_token' => $refreshToken,
                    'redirect_uri'  => $redirectUri,
                ]);

            if (!$resp->ok()) {
                Log::warning('Discord token refresh failed', [
                    'status' => $resp->status(),
                    'body'   => $resp->json() ?: $resp->body(),
                ]);

                return null;
            }

            return $resp->json();
        } catch (Throwable $e) {
            Log::error('Discord token refresh exception', ['error' => $e->getMessage()]);

            return null;
        }
    }

    private function httpVerify(): bool
    {
        return app()->isLocal()
            ? (bool) filter_var(env('X_API_VERIFY', true), FILTER_VALIDATE_BOOLEAN)
            : true;
        }
}
