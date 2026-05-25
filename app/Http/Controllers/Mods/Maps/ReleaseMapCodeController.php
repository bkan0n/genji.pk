<?php

namespace App\Http\Controllers\Mods\Maps;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class ReleaseMapCodeController extends Controller
{
    public function __invoke(Request $request, string $code)
    {
        $code = trim($code);

        if ($code === '') {
            return response()->json(['error' => 'Map code is required'], 422);
        }

        $cfg = Config::get('services.genji_api', []);
        $apiKey = (string) ($cfg['key'] ?? '');
        $apiRoot = (string) ($cfg['root'] ?? '');
        $verify = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($apiKey === '' || $apiRoot === '') {
            return response()->json(['error' => 'Missing upstream API configuration'], 500);
        }

        $url = rtrim($apiRoot, '/') . '/api/v3/maps/' . rawurlencode($code) . '/release-code';

        try {
            $resp = Http::withOptions(['verify' => $verify, 'timeout' => 20])
                ->withHeaders([
                    'X-API-KEY' => $apiKey,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->patch($url);

            Log::info('mods.maps.release_code', [
                'code' => $code,
                'status' => $resp->status(),
            ]);

            if ($resp->status() === 204) {
                return response()->noContent();
            }

            $contentType = strtolower($resp->header('Content-Type', 'application/json'));
            if (str_contains($contentType, 'application/json')) {
                return response()->json($resp->json() ?: [], $resp->status());
            }

            return response($resp->body(), $resp->status())->header(
                'Content-Type',
                $resp->header('Content-Type', 'text/plain'),
            );
        } catch (Throwable $e) {
            Log::error('mods.maps.release_code_error', [
                'code' => $code,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}
