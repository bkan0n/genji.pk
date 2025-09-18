<?php

namespace App\Http\Controllers\Mods\Guides;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class DeleteGuideController extends Controller
{
    public function __invoke(string $code, int $user_id)
    {
        $cfg = Config::get('services.genji_api', []);
        $apiKey = (string) ($cfg['key'] ?? '');
        $apiRoot = (string) ($cfg['root'] ?? '');
        $verify = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($apiKey === '' || $apiRoot === '') {
            return response()->json(['error' => 'Missing upstream API configuration'], 500);
        }

        $url = rtrim($apiRoot, '/') . '/api/v3/maps/' . rawurlencode($code) . '/guides/' . $user_id;

        try {
            $resp = Http::withOptions(['verify' => $verify, 'timeout' => 15])
                ->withHeaders([
                    'X-API-KEY' => $apiKey,
                    'Accept' => 'application/json',
                ])
                ->delete($url);

            return response()->json($resp->body() ? ($resp->json() ?: []) : [], $resp->status());
        } catch (Throwable $e) {
            Log::error('mods.guides.delete', [
                'code' => $code,
                'user_id' => $user_id,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}
