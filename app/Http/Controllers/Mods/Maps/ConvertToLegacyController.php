<?php

namespace App\Http\Controllers\Mods\Maps;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class ConvertToLegacyController extends Controller
{
    public function __invoke(Request $request, string $code)
    {
        $code = trim($code);
        $reason = (string) $request->query('reason', '');

        $cfg    = Config::get('services.genji_api', []);
        $apiKey = (string) ($cfg['key'] ?? '');
        $apiRoot = (string) ($cfg['root'] ?? '');
        $verify = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($apiKey === '' || $apiRoot === '') {
            return response()->json(['error' => 'Missing upstream API configuration'], 500);
        }

        $url = rtrim($apiRoot, '/') . '/api/v3/maps/' . rawurlencode($code) . '/legacy';

        try {
            $http = Http::withOptions(['verify' => $verify, 'timeout' => 20])
                ->withHeaders([
                    'X-API-KEY'   => $apiKey,
                    'Accept'      => 'application/json',
                    'Content-Type'=> 'application/json',
                ]);

            if ($reason !== '') {
                $http = $http->withQueryParameters(['reason' => $reason]);
            }

            $resp = $http->post($url);

            Log::info('mods.maps.convert_legacy', [
                'code' => $code,
                'reason' => $reason,
                'status' => $resp->status(),
            ]);

            return response()->json($resp->json() ?: [], $resp->status());
        } catch (Throwable $e) {
            Log::error('mods.maps.convert_legacy_error', [
                'code' => $code,
                'reason' => $reason,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}