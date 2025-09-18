<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;
use Throwable;

class DiscordAuthController extends Controller
{
    public function redirect(Request $request)
    {
        $redirectUri = (string) (
            env('DISCORD_REDIRECT_URI')
            ?: config('services.discord.redirect')
            ?: route('discord.callback')
        );

        $scopeStr = (string) config('services.discord.scope', 'identify guilds.members.read');
        $scopes = $this->normalizeScopes($scopeStr);

        abort_if(
            (string) config('services.discord.client_id') === '' || $redirectUri === '',
            500,
            'Discord OAuth is not configured'
        );

        return $this->makeDiscordProvider($scopes, $redirectUri)->redirect();
    }

    public function callback(Request $request)
    {
        $redirectUri = (string) (
            env('DISCORD_REDIRECT_URI')
            ?: config('services.discord.redirect')
            ?: route('discord.callback')
        );

        $scopeStr = (string) config('services.discord.scope', 'identify guilds.members.read');
        $scopes = $this->normalizeScopes($scopeStr);

        try {
            $d = $this->makeDiscordProvider($scopes, $redirectUri)->user();
        } catch (InvalidStateException $e) {
            Log::warning('Discord OAuth state invalid', ['error' => $e->getMessage()]);

            return redirect('/')->with('error', 'Discord login failed (state).');
        } catch (Throwable $e) {
            Log::error('Discord Socialite callback failed', ['error' => $e->getMessage()]);

            return redirect('/')->with('error', 'Discord login failed.');
        }

        $id = (string) $d->getId();
        $username = (string) ($d->getNickname() ?? ($d->getName() ?? ''));
        $raw = method_exists($d, 'getRaw') ? (array) $d->getRaw() : ((array) ($d->user ?? []));
        $globalName = (string) ($raw['global_name'] ?? '');
        $discriminator = (string) ($raw['discriminator'] ?? '0');
        $avatarHash = $raw['avatar'] ?? null;
        $bannerHash = $raw['banner'] ?? null;
        $publicFlags = (int) ($raw['public_flags'] ?? 0);
        $premiumType = (int) ($raw['premium_type'] ?? 0);

        $accessToken = (string) ($d->token ?? '');
        $refreshToken = (string) ($d->refreshToken ?? '');
        $expiresIn = (int) ($d->expiresIn ?? 3600);

        if ($id === '' || $accessToken === '') {
            Log::error('Discord Socialite missing essentials', [
                'discord_id' => $id,
                'has_token' => $accessToken !== '',
            ]);

            return redirect('/')->with('error', 'Discord login failed (missing data).');
        }

        $allowGif = (bool) config('services.discord.allow_gif_avatars', true);
        $defaultExt = (string) config('services.discord.avatar_default_extension', 'png');
        $ext = $avatarHash && Str::startsWith((string) $avatarHash, 'a_') && $allowGif ? 'gif' : $defaultExt;

        $avatarUrl = $avatarHash
            ? "https://cdn.discordapp.com/avatars/{$id}/{$avatarHash}.{$ext}"
            : 'https://cdn.discordapp.com/embed/avatars/' . ((int) ($id % 5)) . '.png';

        $tag = $discriminator !== '0' ? "{$username}#{$discriminator}" : $username;

        $request->session()->regenerate();
        $request->session()->put([
            'user_id' => $id,
            'username' => $username,
            'discord_username' => $username,
            'discord_global_name' => $globalName,
            'discord_discriminator' => $discriminator,
            'discord_tag' => $tag,

            'user_avatar' => $avatarHash,
            'discord_avatar_url' => $avatarUrl,
            'user_banner' => $bannerHash,
            'discord_banner' => $bannerHash,

            'user_flags' => $publicFlags,
            'discord_public_flags' => $publicFlags,
            'user_premium' => $premiumType,
            'discord_premium_type' => $premiumType,

            'discord_access_token' => $accessToken,
            'discord_refresh_token' => $refreshToken,
            'discord_token_expires' => now()->addSeconds($expiresIn),
        ]);

        $guildId = (string) config('services.discord.guild_id');
        $roleIds = (array) config('services.discord.mod_roles', []);
        $verify = $this->httpVerify();

        $canModerate = false;
        if ($guildId && !empty($roleIds)) {
            try {
                $memberResp = Http::withToken($accessToken)
                    ->acceptJson()
                    ->withOptions(['verify' => $verify, 'timeout' => 10])
                    ->get("https://discord.com/api/users/@me/guilds/{$guildId}/member");

                if ($memberResp->ok()) {
                    $roles = collect($memberResp->json('roles') ?? [])->map(fn ($r) => (string) $r);
                    $canModerate = $roles->intersect($roleIds)->isNotEmpty();
                } else {
                    Log::debug('Discord member check non-OK', [
                        'status' => $memberResp->status(),
                        'body'   => $memberResp->json() ?: $memberResp->body(),
                    ]);
                }
            } catch (Throwable $e) {
                Log::debug('Discord member check exception', ['error' => $e->getMessage()]);
            }
        }
        $request->session()->put('can_moderate', $canModerate);

        return redirect()->intended('/');
    }

    public function logout(Request $request)
    {
        try {
            $verify = $this->httpVerify();
            $accessToken  = (string) $request->session()->get('discord_access_token', '');
            if ($accessToken !== '') {
                Http::asForm()
                    ->withOptions(['verify' => $verify, 'timeout' => 10])
                    ->post('https://discord.com/api/oauth2/token/revoke', [
                        'client_id'     => (string) config('services.discord.client_id'),
                        'client_secret' => (string) config('services.discord.client_secret'),
                        'token'         => $accessToken,
                    ]);
            }
        } catch (Throwable $e) {
            Log::debug('Discord revoke failed', ['e' => $e->getMessage()]);
        }

        $request->session()->forget([
            'user_id',
            'username',
            'discord_username',
            'discord_global_name',
            'discord_discriminator',
            'discord_tag',
            'user_avatar',
            'discord_avatar_url',
            'user_banner',
            'discord_banner',
            'user_flags',
            'discord_public_flags',
            'user_premium',
            'discord_premium_type',
            'discord_access_token',
            'discord_refresh_token',
            'discord_token_expires',
            'can_moderate',
        ]);

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function globalName(Request $request)
    {
        $request->validate([
            'user_id' => ['required', 'regex:/^\d+$/', 'max:32'],
        ]);

        $userId = (string) $request->query('user_id');

        if ((string) $request->session()->get('user_id', '') !== $userId) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $cfg    = Config::get('services.genji_api', []);
        $apiKey = (string) ($cfg['key']  ?? '');
        $apiRoot= (string) ($cfg['root'] ?? '');
        $verify = app()->isLocal()
            ? (bool) filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN)
            : true;

        if (!$apiKey || !$apiRoot) {
            return response()->json(
                ['error' => 'Configuration API manquante (X_API_KEY / X_API_ROOT)'],
                500
            );
        }

        $url = rtrim($apiRoot, '/') . '/v1/newsfeed/discord/' . $userId;

        try {
            $resp = Http::withOptions(['verify' => $verify])
                ->timeout(10)
                ->withHeaders([
                    'X-API-KEY'   => $apiKey,
                    'Content-Type'=> 'application/json',
                ])
                ->acceptJson()
                ->get($url);

            if (!$resp->ok()) {
                return response()->json(
                    ['error' => 'Upstream error', 'status' => $resp->status()],
                    502
                );
            }

            $payload = $resp->json();
            if (!is_array($payload)) {
                return response()->json(['error' => 'Invalid upstream JSON'], 502);
            }

            if (array_key_exists('name', $payload)) {
                return response()->json(['name' => $payload['name']]);
            }

            if (isset($payload['data']['name'])) {
                return response()->json(['name' => $payload['data']['name']]);
            }

            return response()->json(['error' => 'Bad request syntax or unsupported method'], 400);
        } catch (Throwable $e) {
            Log::error('discord.globalName failed', [
                'user_id' => $userId,
                'error'   => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    public function rankCardPage(Request $request)
    {
        $user_id = (string) $request->session()->get('user_id');
        $username = (string) (
            $request->session()->get('discord_global_name')
            ?: $request->session()->get('username', 'Guest')
        );
        $avatar_url = $request->session()->get('discord_avatar_url')
            ?: asset('assets/img/default-avatar.jpg');

        return view('rank_card', compact('username', 'avatar_url', 'user_id'));
    }

    private function makeDiscordProvider(array $scopes, string $redirectUri)
    {
        $provider = Socialite::driver('discord')
            ->redirectUrl($redirectUri)
            ->scopes($scopes)
            ->with(['prompt' => 'consent']);

        $verify = $this->httpVerify();

        $provider->setHttpClient(
            new Client([
                'verify'  => $verify,
                'timeout' => (int) env('X_API_TIMEOUT', 10),
            ])
        );

        return $provider;
    }

    private function normalizeScopes(string $scopeStr): array
    {
        $parts = preg_split('/[\s,]+/', trim($scopeStr), -1, PREG_SPLIT_NO_EMPTY) ?: [];
        $parts = array_map('strval', $parts);

        if (!in_array('identify', $parts, true)) {
            $parts[] = 'identify';
        }
        if (!in_array('guilds.members.read', $parts, true)) {
            $parts[] = 'guilds.members.read';
        }

        return array_values(array_unique($parts));
    }

    private function httpVerify(): bool
    {
        return app()->isLocal()
            ? (bool) filter_var(env('X_API_VERIFY', true), FILTER_VALIDATE_BOOLEAN)
            : true;
    }
}
