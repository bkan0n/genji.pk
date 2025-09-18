<?php

namespace App\Http\Controllers\Mods\Guides;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class EditGuideController extends Controller
{
    public function __invoke(Request $request, string $code, int $user_id)
    {
        $validated = $request->validate([
            'url' => ['required', 'string', 'regex:~^https?://~i'],
        ]);

        $cfg = Config::get('services.genji_api', []);
        $apiKey = (string) ($cfg['key'] ?? '');
        $apiRoot = (string) ($cfg['root'] ?? '');
        $verify = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($apiKey === '' || $apiRoot === '') {
            return response()->json(['error' => 'Missing upstream API configuration'], 500);
        }

        $base = rtrim($apiRoot, '/') . '/api/v3/maps/' . rawurlencode($code) . '/guides/' . $user_id;
        $url = $base . '?' . http_build_query(['url' => $validated['url']]);

        try {
            $resp = Http::withOptions(['verify' => $verify, 'timeout' => 15])
                ->withHeaders([
                    'X-API-KEY' => $apiKey,
                    'Accept' => 'application/json',
                ])
                ->patch($url);

            return response()->json($resp->json() ?: [], $resp->status());
        } catch (Throwable $e) {
            Log::error('mods.guides.edit', [
                'code' => $code,
                'user_id' => $user_id,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}
