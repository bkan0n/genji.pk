<?php

namespace App\Http\Middleware;

use App\Services\GenjiApiService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RememberTokenAuth
{
    private const DEVICE_SESSION_COOKIE = 'device_session_id';

    public function __construct(private GenjiApiService $api)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        if ($request->session()->has('user_id')) {
            $this->syncDeviceSessionCookie($request);

            if (!$request->session()->has('is_mod') && (bool) $request->session()->get('can_moderate', false) === true) {
                $request->session()->put('is_mod', true);
            }

            $this->syncModeratorFlagFromSession($request);
            return $next($request);
        }

        $rememberToken = (string) $request->cookie('remember_token', '');
        if ($rememberToken === '') {
            return $next($request);
        }

        $previousDeviceSessionId = (string) $request->cookie(self::DEVICE_SESSION_COOKIE, '');
        $preAuthSessionId = (string) $request->session()->getId();

        $rememberedIsMod = null;

        $cookieCanModerate = $request->cookie('discord_can_moderate', null);
        if ($cookieCanModerate !== null && $cookieCanModerate !== '') {
            $v = strtolower(trim((string) $cookieCanModerate));
            if (in_array($v, ['1', 'true', 'yes', 'on'], true)) {
                $rememberedIsMod = true;
            }
        }

        if ($rememberedIsMod === null && $previousDeviceSessionId !== '') {
            $rememberedIsMod = $this->api->sessionIsMod($previousDeviceSessionId);
        }


        $userId = $this->api->validateRememberToken($rememberToken);
        if (!$userId) {
            cookie()->queue(cookie()->forget('remember_token'));
            cookie()->queue(cookie()->forget(self::DEVICE_SESSION_COOKIE));
            $this->forgetRememberProfileCookies();
            return $next($request);
        }

        $userData = $this->api->getUser($userId);
        if (!$userData) {
            cookie()->queue(cookie()->forget('remember_token'));
            cookie()->queue(cookie()->forget(self::DEVICE_SESSION_COOKIE));
            $this->forgetRememberProfileCookies();
            return $next($request);
        }

        $isDiscord = strlen((string) $userId) >= 17;

        $request->session()->put('user_id', $userId);

        if ($isDiscord) {
            $nickname = (string) ($userData['nickname'] ?? ($userData['username'] ?? ''));
            $globalName = (string) ($userData['global_name'] ?? '');

            $request->session()->put('user', [
                'id' => $userId,
                'nickname' => $nickname !== '' ? $nickname : null,
                'global_name' => $globalName !== '' ? $globalName : null,
                'coins' => $userData['coins'] ?? 0,
                'auth_type' => 'discord',
            ]);

            $request->session()->put('user_provider', 'discord');
            $request->session()->put('user_name', $nickname);

            $request->session()->put([
                'username' => $nickname,
                'discord_username' => $nickname,
                'discord_global_name' => $globalName !== '' ? $globalName : $nickname,
            ]);

            $this->hydrateDiscordSessionFromRememberCookies($request, (int) $userId, $userData);
        } else {
            $username = (string) ($userData['username'] ?? ($userData['nickname'] ?? ''));

            $request->session()->put('user', [
                'id' => $userId,
                'email' => $userData['email'] ?? null,
                'username' => $username !== '' ? $username : null,
                'email_verified' => (bool) ($userData['email_verified'] ?? false),
                'coins' => $userData['coins'] ?? 0,
                'auth_type' => 'email',
            ]);

            $request->session()->put('user_provider', 'email');
            $request->session()->put('user_name', $username);

            $request->session()->put([
                'username' => $username,
            ]);
        }

        if ($isDiscord && $rememberedIsMod === true) {
            $request->session()->put('can_moderate', true);
            $request->session()->put('is_mod', true);

            $user = $request->session()->get('user');
            if (is_array($user)) {
                $user['is_mod'] = true;
                $request->session()->put('user', $user);
            }
        }

        if (!$isDiscord) {
            $request->session()->put('is_mod', (bool) ($userData['is_mod'] ?? false));
        }

        $incomingCsrf = $this->isStateChanging($request)
            ? $this->getIncomingCsrfToken($request)
            : '';

        $request->session()->regenerate(true);

        if ($incomingCsrf !== '') {
            $request->session()->put('_token', $incomingCsrf);
        }

        $newSessionId = (string) $request->session()->getId();

        if ($previousDeviceSessionId !== '' && $previousDeviceSessionId !== $newSessionId) {
            $this->api->sessionDestroy($previousDeviceSessionId);
        }

        if ($preAuthSessionId !== '' && $preAuthSessionId !== $newSessionId && $preAuthSessionId !== $previousDeviceSessionId) {
            $this->api->sessionDestroy($preAuthSessionId);
        }

        $this->queueDeviceSessionCookie($request, $newSessionId);

        return $next($request);
    }

    private function forgetRememberProfileCookies(): void
    {
        cookie()->queue(cookie()->forget('discord_avatar'));
        cookie()->queue(cookie()->forget('discord_avatar_url'));
        cookie()->queue(cookie()->forget('discord_banner'));
        cookie()->queue(cookie()->forget('discord_public_flags'));
        cookie()->queue(cookie()->forget('discord_premium_type'));
        cookie()->queue(cookie()->forget('discord_can_moderate'));
    }

    private function hydrateDiscordSessionFromRememberCookies(Request $request, int $userId, array $userData): void
    {
        $avatarHash = (string) ($userData['avatar'] ?? ($userData['discord_avatar'] ?? ''));
        if ($avatarHash === '') {
            $avatarHash = (string) $request->cookie('discord_avatar', '');
        }

        $avatarUrl = (string) ($userData['avatar_url'] ?? ($userData['discord_avatar_url'] ?? ''));
        if ($avatarUrl === '') {
            $avatarUrl = (string) $request->cookie('discord_avatar_url', '');
        }

        if ($avatarUrl === '' && $avatarHash !== '' && $userId) {
            $ext = str_starts_with($avatarHash, 'a_') ? 'gif' : 'png';
            $avatarUrl = "https://cdn.discordapp.com/avatars/{$userId}/{$avatarHash}.{$ext}";
        }

        if ($avatarUrl === '' && $userId) {
            $avatarUrl = 'https://cdn.discordapp.com/embed/avatars/' . ((int) ($userId % 5)) . '.png';
        }

        if ($avatarHash !== '') {
            $request->session()->put('user_avatar', $avatarHash);
        }
        if ($avatarUrl !== '') {
            $request->session()->put('discord_avatar_url', $avatarUrl);
            $request->session()->put('user_avatar_url', $avatarUrl);
        }

        $bannerHash = (string) ($userData['banner'] ?? ($userData['discord_banner'] ?? ''));
        if ($bannerHash === '') {
            $bannerHash = (string) $request->cookie('discord_banner', '');
        }
        if ($bannerHash !== '') {
            $request->session()->put('user_banner', $bannerHash);
            $request->session()->put('discord_banner', $bannerHash);
        }

        $flags = $userData['public_flags'] ?? ($userData['discord_public_flags'] ?? null);
        if ($flags === null || $flags === '') {
            $flags = $request->cookie('discord_public_flags', null);
        }
        if ($flags !== null && $flags !== '') {
            $flagsInt = is_numeric($flags) ? (int) $flags : 0;
            $request->session()->put('user_flags', $flagsInt);
            $request->session()->put('discord_public_flags', $flagsInt);
        }

        $premium = $userData['premium_type'] ?? ($userData['discord_premium_type'] ?? null);
        if ($premium === null || $premium === '') {
            $premium = $request->cookie('discord_premium_type', null);
        }
        if ($premium !== null && $premium !== '') {
            $premiumInt = is_numeric($premium) ? (int) $premium : 0;
            $request->session()->put('user_premium', $premiumInt);
            $request->session()->put('discord_premium_type', $premiumInt);
        }

        $cm = $request->cookie('discord_can_moderate', null);
        if ($cm !== null && $cm !== '') {
            $v = strtolower(trim((string) $cm));
            if (in_array($v, ['1', 'true', 'yes', 'on'], true)) {
                $request->session()->put('can_moderate', true);
                if (!$request->session()->has('is_mod')) {
                    $request->session()->put('is_mod', true);
                }
            }
        }


    }

    private function syncDeviceSessionCookie(Request $request): void
    {
        $sid = (string) $request->session()->getId();
        if ($sid === '') {
            return;
        }

        $cookieSid = (string) $request->cookie(self::DEVICE_SESSION_COOKIE, '');
        if ($cookieSid !== $sid) {
            $this->queueDeviceSessionCookie($request, $sid);
        }
    }

    private function queueDeviceSessionCookie(Request $request, string $sessionId): void
    {
        $minutes = 60 * 24 * 365; // 1 year
        $cookie = cookie(
            self::DEVICE_SESSION_COOKIE,
            $sessionId,
            $minutes,
            '/',
            config('session.domain'),
            (bool) (config('session.secure') ?? $request->isSecure()),
            true,
            false,
            config('session.same_site', 'lax'),
        );

        cookie()->queue($cookie);
    }

    /**
     * Ensure session('is_mod') is available for navbar + middleware checks.
     * Source of truth is the Genji API session endpoint (read) which returns `is_mod`.
     */
    private function syncModeratorFlagFromSession(Request $request): void
    {
        if ($request->session()->has('is_mod')) {
            return;
        }

        $sessionId = (string) $request->session()->getId();
        if ($sessionId === '') {
            return;
        }

        $cacheKey = "session:is_mod:{$sessionId}";
        $cached = Cache::get($cacheKey);

        if ($cached !== null) {
            $request->session()->put('is_mod', (bool) $cached);
            return;
        }

        try {
            $isMod = $this->api->sessionIsMod($sessionId);

            if ($isMod === null) {
                return;
            }

            $request->session()->put('is_mod', (bool) $isMod);

            $ttl = (int) env('SESSION_IS_MOD_TTL_SECONDS', 120);
            Cache::put($cacheKey, (bool) $isMod, now()->addSeconds(max(10, $ttl)));
        } catch (\Throwable $e) {
            Log::warning('syncModeratorFlagFromSession failed', ['error' => $e->getMessage()]);
        }
    }

    private function isStateChanging(Request $request): bool
    {
        return !in_array(strtoupper((string) $request->method()), ['GET', 'HEAD', 'OPTIONS'], true);
    }

    private function getIncomingCsrfToken(Request $request): string
    {
        $token = (string) $request->header('X-CSRF-TOKEN', '');
        if ($token !== '') {
            return $token;
        }

        $token = (string) $request->header('X-XSRF-TOKEN', '');
        if ($token !== '') {
            return $token;
        }

        $token = (string) $request->input('_token', '');
        if ($token !== '') {
            return $token;
        }

        return (string) $request->cookies->get('XSRF-TOKEN', '');
    }
}
