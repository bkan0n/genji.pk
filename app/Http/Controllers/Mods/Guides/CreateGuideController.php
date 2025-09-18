<?php

namespace App\Http\Controllers\Mods\Guides;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class CreateGuideController extends Controller
{
    public function __invoke(Request $request, string $code)
    {
        $validated = $request->validate([
            'url' => ['required', 'string', 'regex:~^https?://~i'],
            'user_id' => ['required', 'integer'],
        ]);

        $cfg = Config::get('services.genji_api', []);
        $apiKey = (string) ($cfg['key'] ?? '');
        $apiRoot = (string) ($cfg['root'] ?? '');
        $verify = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($apiKey === '' || $apiRoot === '') {
            return response()->json(['error' => 'Missing upstream API configuration'], 500);
        }

        $url = rtrim($apiRoot, '/') . '/api/v3/maps/' . rawurlencode($code) . '/guides';

        try {
            $resp = Http::withOptions(['verify' => $verify, 'timeout' => 15])
                ->withHeaders([
                    'X-API-KEY' => $apiKey,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post($url, [
                    'url' => $validated['url'],
                    'user_id' => (int) $validated['user_id'],
                ]);

            return response()->json($resp->json() ?: [], $resp->status());
        } catch (Throwable $e) {
            Log::error('mods.guides.create', ['code' => $code, 'error' => $e->getMessage()]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}
