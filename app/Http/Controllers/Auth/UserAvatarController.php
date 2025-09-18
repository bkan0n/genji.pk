<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class UserAvatarController extends Controller
{
    public function show(Request $request)
    {
        $userIdParam = (string) $request->query('user_id', '');
        if ($userIdParam === '') {
            return response()->json(['error' => 'Missing user_id'], 400);
        }

        $rawIds = array_map('trim', explode(',', $userIdParam));
        $ids = [];
        foreach ($rawIds as $rid) {
            $id = preg_replace('/\D/', '', $rid);
            if ($id !== '') {
                $ids[$id] = $id;
            }
        }
        $ids = array_values($ids);
        if (empty($ids)) {
            return response()->json(['error' => 'Invalid user_id'], 400);
        }

        $disk = Storage::disk('local');
        $cacheDir = 'cache';
        if (! $disk->exists($cacheDir)) {
            $disk->makeDirectory($cacheDir);
        }
        $ttl = 7 * 24 * 60 * 60;

        $verify = filter_var(config('services.genji_api.verify', true), FILTER_VALIDATE_BOOLEAN);
        $botToken = (string) config('services.discord.bot_token', env('DISCORD_BOT_TOKEN'));

        $out = [];

        foreach ($ids as $uid) {
            $cacheFile = "{$cacheDir}/avatar_{$uid}.json";

            if ($disk->exists($cacheFile)) {
                $last = $disk->lastModified($cacheFile);
                if (time() - $last < $ttl) {
                    $cached = @json_decode($disk->get($cacheFile), true);
                    if (is_array($cached) && isset($cached['avatar_url'])) {
                        $out[$uid] = $cached;

                        continue;
                    }
                }
            }

            $entry = null;

            if (! empty($botToken)) {
                $url = "https://discord.com/api/v10/users/{$uid}";
                $resp = Http::withHeaders([
                    'Authorization' => "Bot {$botToken}",
                    'User-Agent' => 'AvatarFetcher (laravel)',
                    'Accept' => 'application/json',
                ])
                    ->timeout(5)
                    ->withOptions(['verify' => $verify])
                    ->get($url);

                if ($resp->ok()) {
                    $data = $resp->json();
                    if (is_array($data) && isset($data['id'])) {
                        $avatarHash = $data['avatar'] ?? null;
                        $discriminator = (string) ($data['discriminator'] ?? '0');
                        $ext = $avatarHash && str_starts_with($avatarHash, 'a_') ? 'gif' : 'png';
                        $avatarUrl = $avatarHash
                          ? "https://cdn.discordapp.com/avatars/{$data['id']}/{$avatarHash}.{$ext}"
                          : 'https://cdn.discordapp.com/embed/avatars/' . ((int) ($data['id'] % 5)) . '.png';

                        $entry = [
                            'user_id' => (string) $data['id'],
                            'username' => $data['username'] ?? null,
                            'avatar_hash' => $avatarHash,
                            'discriminator' => $discriminator,
                            'avatar_url' => $avatarUrl,
                        ];
                    }
                }
            }

            if ($entry === null) {
                $idx = (int) ($uid % 5);
                $entry = [
                    'user_id' => (string) $uid,
                    'username' => null,
                    'avatar_hash' => null,
                    'discriminator' => '0',
                    'avatar_url' => "https://cdn.discordapp.com/embed/avatars/{$idx}.png",
                    'fallback' => true,
                ];
            }

            $out[$uid] = $entry;
            $disk->put(
                $cacheFile,
                json_encode($entry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'private',
            );
        }

        return response()->json(count($out) === 1 ? reset($out) : $out);
    }
}
