<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class BattleNetAuthController extends Controller
{
    public function redirect(Request $request)
    {
        $region = strtolower((string) $request->query('region', config('services.battlenet.region', 'eu')));
        if (!in_array($region, ['eu', 'us', 'kr', 'tw', 'cn'], true)) {
            $region = 'eu';
        }

        if ($region === 'cn' && $this->cnMode() === 'disabled') {
            return redirect()->route('login')->with('error', 'Battle.net CN is currently disabled.');
        }

        $clientId = $this->clientIdFor($region);
        if (!$clientId) {
            return redirect()->route('login')->with('error', 'Battle.net client_id missing (config/services.php + .env).');
        }

        $state = Str::random(40);
        $request->session()->put('bnet_oauth_state', $state);
        $request->session()->put('bnet_region', $region);

        $prev = url()->previous();
        if ($prev && !str_contains($prev, '/login') && !str_contains($prev, '/auth/')) {
            $request->session()->put('url.intended', $prev);
        }

        $redirectUri = (string) config('services.battlenet.redirect');
        $scope = (string) config('services.battlenet.scope', 'openid');

        $authorizeEndpoint = $this->authorizeEndpoint($region);

        $qs = http_build_query([
            'client_id'     => $clientId,
            'redirect_uri'  => $redirectUri,
            'response_type' => 'code',
            'scope'         => $scope,
            'state'         => $state,
        ], '', '&', PHP_QUERY_RFC3986);

        return redirect()->away($authorizeEndpoint . '?' . $qs);
    }

    public function callback(Request $request)
    {
        if ($request->filled('error')) {
            return redirect()->route('login')->with('error', 'Battle.net: ' . $request->string('error')->toString());
        }

        $incomingState = (string) $request->query('state', '');
        $sessionState  = (string) $request->session()->pull('bnet_oauth_state', '');

        if (!$incomingState || !$sessionState || !hash_equals($sessionState, $incomingState)) {
            abort(403, 'Invalid OAuth state.');
        }

        $code = (string) $request->query('code', '');
        if ($code === '') {
            return redirect()->route('login')->with('error', 'Battle.net: code missing.');
        }

        $region = (string) $request->session()->pull('bnet_region', config('services.battlenet.region', 'eu'));
        if (!in_array($region, ['eu', 'us', 'kr', 'tw', 'cn'], true)) {
            $region = 'eu';
        }

        if ($region === 'cn' && $this->cnMode() === 'disabled') {
            return redirect()->route('login')->with('error', 'Battle.net CN is currently disabled.');
        }

        $clientId = $this->clientIdFor($region);
        $clientSecret = $this->clientSecretFor($region);
        if (!$clientId || !$clientSecret) {
            return redirect()->route('login')->with('error', 'Battle.net credentials missing (client_id/client_secret).');
        }

        $redirectUri = (string) config('services.battlenet.redirect');

        // SSL verify flag
        $verify = config('services.battlenet.verify', true);
        if (is_string($verify)) {
            $verify = filter_var($verify, FILTER_VALIDATE_BOOLEAN);
        }

        // 1) Exchange code -> access_token
        $tokenEndpoint = $this->tokenEndpoint($region);

        $tokenRes = Http::timeout(15)
            ->asForm()
            ->withBasicAuth($clientId, $clientSecret)
            ->withOptions(['verify' => $verify])
            ->post($tokenEndpoint, [
                'grant_type'   => 'authorization_code',
                'code'         => $code,
                'redirect_uri' => $redirectUri,
            ]);

        if ($region === 'cn' && $tokenRes->failed()) {
            $tokenRes = Http::timeout(15)
                ->asForm()
                ->withBasicAuth($clientId, $clientSecret)
                ->withOptions(['verify' => $verify])
                ->post('https://oauth.battle.net/token', [
                    'grant_type'   => 'authorization_code',
                    'code'         => $code,
                    'redirect_uri' => $redirectUri,
                ]);
        }

        if (in_array($tokenRes->status(), [401, 403], true) && $region !== 'cn') {
            $tokenRes = Http::timeout(15)
                ->asForm()
                ->withBasicAuth($clientId, $clientSecret)
                ->withOptions(['verify' => $verify])
                ->post('https://oauth.battle.net/token', [
                    'grant_type'   => 'authorization_code',
                    'code'         => $code,
                    'redirect_uri' => $redirectUri,
                ]);
        }

        if ($tokenRes->failed()) {
            return redirect()->route('login')->with('error', 'Battle.net token error: ' . $tokenRes->body());
        }

        $accessToken = (string) data_get($tokenRes->json(), 'access_token', '');
        if ($accessToken === '') {
            return redirect()->route('login')->with('error', 'Battle.net: access_token missing.');
        }

        $userinfoEndpoints = $this->userinfoEndpoints($region);

        $user = null;
        $lastErr = null;

        foreach ($userinfoEndpoints as $url) {
            $uRes = Http::timeout(15)
                ->withToken($accessToken)
                ->withOptions(['verify' => $verify])
                ->get($url);

            if ($uRes->successful()) {
                $user = $uRes->json();
                break;
            }

            $lastErr = $uRes->body();
        }

        if (!$user && $region === 'cn') {
            $uRes = Http::timeout(15)
                ->withToken($accessToken)
                ->withOptions(['verify' => $verify])
                ->get('https://oauth.battle.net/userinfo');

            if ($uRes->successful()) {
                $user = $uRes->json();
            } else {
                $lastErr = $uRes->body();
            }
        }

        if (!$user) {
            return redirect()->route('login')->with('error', 'Battle.net userinfo error: ' . ($lastErr ?: 'unknown'));
        }

        $sub = (string) data_get($user, 'sub', data_get($user, 'id', ''));
        $battleTag = (string) data_get($user, 'battle_tag', data_get($user, 'battletag', ''));

        if ($sub === '') {
            return redirect()->route('login')->with('error', 'Battle.net: user ID missing.');
        }

        $avatarUrl = $this->placeholderAvatar($battleTag !== '' ? $battleTag : 'BN');

        // Unified session
        $request->session()->put([
            'user_provider'     => 'battlenet',
            'user_id'           => $sub,
            'user_name'         => $battleTag ?: ('Battle.net#' . $sub),
            'user_avatar_url'   => $avatarUrl,
            'bnet_access_token' => $accessToken,
            'can_moderate'      => false,
        ]);

        return redirect()->intended('/');
    }

    private function cnMode(): string
    {
        // global | cn | disabled
        $mode = (string) config('services.battlenet.cn_mode', 'global');
        return in_array($mode, ['global', 'cn', 'disabled'], true) ? $mode : 'global';
    }

    private function cnViaGlobal(): bool
    {
        return $this->cnMode() === 'global';
    }

    private function clientIdFor(string $region): ?string
    {
        if ($region === 'cn') {
            return config('services.battlenet.cn_client_id') ?: config('services.battlenet.client_id');
        }
        return config('services.battlenet.client_id');
    }

    private function clientSecretFor(string $region): ?string
    {
        if ($region === 'cn') {
            return config('services.battlenet.cn_client_secret') ?: config('services.battlenet.client_secret');
        }
        return config('services.battlenet.client_secret');
    }

    private function authorizeEndpoint(string $region): string
    {
        if ($region === 'cn') {
            if ($this->cnMode() === 'disabled') {
                return 'https://oauth.battle.net/authorize';
            }

            // Workaround: CN via endpoints
            if ($this->cnViaGlobal()) {
                return 'https://oauth.battle.net/authorize';
            }

            // endpoint CN
            return 'https://oauth.battlenet.com.cn/authorize';
        }

        return "https://{$region}.battle.net/oauth/authorize";
    }

    private function tokenEndpoint(string $region): string
    {
        if ($region === 'cn') {
            if ($this->cnMode() === 'disabled') {
                return 'https://oauth.battle.net/token';
            }

            // Workaround “global”
            if ($this->cnViaGlobal()) {
                return 'https://oauth.battle.net/token';
            }

            // “vrai” CN (souvent 401)
            return 'https://oauth.battlenet.com.cn/token';
        }

        return "https://{$region}.battle.net/oauth/token";
    }

    private function userinfoEndpoints(string $region): array
    {
        if ($region === 'cn') {
            if ($this->cnMode() === 'disabled') {
                return ['https://oauth.battle.net/userinfo'];
            }

            // Workaround “global”
            if ($this->cnViaGlobal()) {
                return ['https://oauth.battle.net/userinfo'];
            }

            // CN variants
            return [
                'https://oauth.battlenet.com.cn/userinfo',
                'https://www.battlenet.com.cn/oauth/userinfo',
            ];
        }

        return [
            "https://{$region}.battle.net/oauth/userinfo",
            'https://oauth.battle.net/userinfo',
        ];
    }

    private function placeholderAvatar(string $label): string
    {
        $text = mb_strtoupper(mb_substr(trim($label ?: 'BN'), 0, 2));
        $text = preg_replace('/\s+/', '', $text);
        $text = htmlspecialchars($text, ENT_QUOTES, 'UTF-8');

        $svg = <<<SVG
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
            <defs>
                <radialGradient id="bg" cx="30%" cy="20%" r="80%">
                <stop offset="0" stop-color="#1f2937"/>
                <stop offset="1" stop-color="#09090b"/>
                </radialGradient>

                <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#34d399"/>
                <stop offset="1" stop-color="#10b981"/>
                </linearGradient>

                <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#ffffff" stop-opacity="0.18"/>
                <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
                </linearGradient>

                <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity="0.55"/>
                </filter>
            </defs>

            <circle cx="32" cy="32" r="30" fill="url(#bg)" filter="url(#softShadow)"/>
            <circle cx="32" cy="32" r="30" fill="none" stroke="url(#ring)" stroke-opacity="0.55" stroke-width="2"/>
            <circle cx="32" cy="32" r="26" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="2"/>

            <path d="M10,22 C18,10 32,6 46,10 C38,10 28,14 22,22 C18,26 16,30 15,34 C13,30 12,26 10,22 Z"
                    fill="url(#shine)"/>

            <text x="32" y="39" text-anchor="middle"
                    font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
                    font-size="22" font-weight="800"
                    fill="#ffffff" fill-opacity="0.92" letter-spacing="0.5">$text</text>
            </svg>
            SVG;
        return 'data:image/svg+xml,' . rawurlencode($svg);
    }
}
