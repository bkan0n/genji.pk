<?php

namespace App\Http\Controllers\Newsfeed;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Throwable;

class EmojiController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'emojiId' => ['required', 'numeric'],
            'emojiName' => ['nullable', 'string', 'max:100'],
        ]);

        $emojiId = (string) $validated['emojiId'];
        $emojiName = e((string) ($validated['emojiName'] ?? ''));

        $cfg = Config::get('services.genji_api', []);
        $verify = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        $candidates = [
            "https://cdn.discordapp.com/emojis/{$emojiId}.png",
            "https://cdn.discordapp.com/emojis/{$emojiId}.gif",
            "https://cdn.discordapp.com/emojis/{$emojiId}.webp",
        ];

        $emojiUrl = null;

        foreach ($candidates as $url) {
            try {
                $resp = Http::withOptions(['verify' => $verify])
                    ->timeout(6)
                    ->withHeaders(['Range' => 'bytes=0-0'])
                    ->get($url);

                if ($resp->status() === 200 || $resp->status() === 206) {
                    $emojiUrl = $url;
                    break;
                }
            } catch (Throwable $e) {
            }
        }

        if (! $emojiUrl) {
            return response()->json(['error' => 'Émoji introuvable'], 404);
        }

        return response()->json([
            'emoji' => "<img src='{$emojiUrl}' alt='{$emojiName}' class='discord-emoji'>",
        ]);
    }
}
