<?php

namespace App\Http\Controllers\Mods\Maps;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class ConvertToLegacyController extends Controller
{
    public function __invoke(string $code)
    {
        $code = trim($code);

        $cfg = Config::get('services.genji_api', []);
        $apiKey = (string) ($cfg['key'] ?? '');
        $apiRoot = (string) ($cfg['root'] ?? '');
        $verify = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($apiKey === '' || $apiRoot === '') {
            return response()->json(['error' => 'Missing upstream API configuration'], 500);
        }

        // Suivre la doc: POST /api/v3/maps/{code}/legacy
        $url = rtrim($apiRoot, '/') . '/api/v3/maps/' . rawurlencode($code) . '/legacy';

        try {
            $resp = Http::withOptions(['verify' => $verify, 'timeout' => 20])
                ->withHeaders([
                    'X-API-KEY' => $apiKey,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post($url);

            return response()->json($resp->json() ?: [], $resp->status());
        } catch (Throwable $e) {
            Log::error('mods.maps.convert_legacy', ['code' => $code, 'error' => $e->getMessage()]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}
