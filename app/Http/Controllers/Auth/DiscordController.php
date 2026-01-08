<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\GenjiApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class DiscordController extends Controller
{
    protected GenjiApiService $api;

    public function __construct(GenjiApiService $api)
    {
        $this->api = $api;
    }

    /**
     * Redirect to Discord OAuth.
     */
    public function redirect()
    {
        $resp = Socialite::driver('discord')
            ->scopes(['identify'])
            ->redirect();

        try {
            $target = method_exists($resp, 'getTargetUrl') ? $resp->getTargetUrl() : null;
            
            \Illuminate\Support\Facades\Log::debug('Discord OAuth redirect', [
                'generated_target' => $target,
                'configured_redirect' => config('services.discord.redirect'),
                'app_url' => config('app.url'),
            ]);
        } catch (\Throwable $e) {
        }

        return $resp;
    }

    /**
     * Handle Discord OAuth callback.
     */
    public function callback(Request $request)
    {
        try {
            $discordUser = Socialite::driver('discord')->user();

            $userId = (int) $discordUser->getId();
            $globalName = $discordUser->getName() ?? $discordUser->getNickname() ?? 'Unknown';
            $nickname = $discordUser->getNickname() ?? $globalName;

            // Check if user exists
            $exists = $this->api->userExists($userId);

            if ($exists) {
                // Update user names if they've changed
                $this->api->updateUser($userId, $globalName, $nickname);

                // Fetch current user data
                $userData = $this->api->getUser($userId);

                if (!$userData) {
                    Log::error('Failed to fetch existing Discord user', ['user_id' => $userId]);
                    return redirect()->route('login')
                        ->with('error', 'Failed to authenticate. Please try again.');
                }
            } else {
                // Create new user
                $userData = $this->api->createUser($userId, $globalName, $nickname);

                if (!$userData) {
                    Log::error('Failed to create Discord user', ['user_id' => $userId]);
                    return redirect()->route('login')
                        ->with('error', 'Failed to create account. Please try again.');
                }
            }

            // Store user data in session
            $request->session()->put('user_id', $userId);
            $request->session()->put('user', [
                'id' => $userId,
                'nickname' => $userData['nickname'] ?? $nickname,
                'global_name' => $userData['global_name'] ?? $globalName,
                'coins' => $userData['coins'] ?? 0,
                'avatar' => $discordUser->getAvatar(),
                'auth_type' => 'discord',
            ]);

            $request->session()->regenerate();

            return redirect()->intended('/');

        } catch (\Exception $e) {
            Log::error('Discord OAuth error', ['error' => $e->getMessage()]);

            return redirect()->route('login')
                ->with('error', 'Discord authentication failed. Please try again.');
        }
    }

    /**
     * Logout - destroy session.
     */
    public function logout(Request $request)
    {
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
