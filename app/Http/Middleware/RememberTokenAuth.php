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
            $this->forgetRememberProfileCookies();
            return $next($request);
        }

        $userData = $this->api->getUser($userId);
        if (!$userData) {
            cookie()->queue(cookie()->forget('remember_token'));
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

            $this->hydrateDiscordSessionFromRememberCookies($request, $userId, $userData);
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

        $request->session()->regenerate();

        return $next($request);
    }

    private function forgetRememberProfileCookies(): void
    {
        cookie()->queue(cookie()->forget('discord_avatar'));
        cookie()->queue(cookie()->forget('discord_avatar_url'));
        cookie()->queue(cookie()->forget('discord_banner'));
        cookie()->queue(cookie()->forget('discord_public_flags'));
        cookie()->queue(cookie()->forget('discord_premium_type'));
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
    }

}
