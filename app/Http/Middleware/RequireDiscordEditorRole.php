<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class RequireDiscordEditorRole
{
    public function handle(Request $request, Closure $next): Response
    {
        $userId = (string) $request->session()->get('user_id', '');
        $token  = (string) $request->session()->get('discord_access_token', '');

        if ($userId === '' || $token === '') {
            return redirect('/')->with('error', 'You must login with Discord.');
        }

        $guildId = (string) config('services.discord.guild_id');
        $roleId  = (string) config('services.discord.editor_role_id');

        if ($guildId === '' || $roleId === '') {
            abort(500, 'Discord guild_id/editor_role_id not configured.');
        }

        $checkedAt = (int) $request->session()->get('discord_member_checked_at', 0);
        $canEdit   = (bool) $request->session()->get('can_edit_3d', false);

        if ($checkedAt > 0 && (time() - $checkedAt) < 300) {
            return $canEdit
                ? $next($request)
                : redirect('/')->with('error', 'You do not have the permission to access this feature.');
        }

        try {
            $verify = $this->httpVerify();

            $resp = Http::withToken($token)
                ->acceptJson()
                ->withOptions(['verify' => $verify, 'timeout' => 10])
                ->get("https://discord.com/api/users/@me/guilds/{$guildId}/member");

            if ($resp->status() === 404) {
                $this->storeResult($request, false);

                return redirect('/')->with('error', 'You do not have the permission to access this feature.');
            }

            if (! $resp->ok()) {
                Log::warning('Discord member check failed', [
                    'status' => $resp->status(),
                    'body'   => $resp->json() ?: $resp->body(),
                ]);

                // secure default: deny
                $this->storeResult($request, false);

                return redirect('/')->with('error', 'You do not have the permission to access this feature.');
            }

            $roles = (array) ($resp->json('roles') ?? []);
            $roles = array_map('strval', $roles);

            $allowed = in_array($roleId, $roles, true);

            $this->storeResult($request, $allowed);

            return $allowed
                ? $next($request)
                : redirect('/')->with('error', 'You do not have the permission to access this feature.');
        } catch (Throwable $e) {
            Log::warning('Discord member check exception', ['error' => $e->getMessage()]);
            $this->storeResult($request, false);

            return redirect('/')->with('error', 'You do not have the permission to access this feature.');
        }
    }

    private function storeResult(Request $request, bool $allowed): void
    {
        $request->session()->put([
            'can_edit_3d'               => $allowed,
            'discord_member_checked_at' => time(),
        ]);
    }

    private function httpVerify(): bool
    {
        return app()->isLocal()
            ? (bool) filter_var(env('X_API_VERIFY', true), FILTER_VALIDATE_BOOLEAN)
            : true;
    }
}
