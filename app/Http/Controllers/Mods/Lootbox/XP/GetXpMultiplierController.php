<?php

namespace App\Http\Controllers\Mods\Lootbox\XP;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class GetXpMultiplierController extends Controller
{
    public function __invoke(Request $request)
    {
        $cfg = Config::get('services.genji_api', []);
        $apiKey = (string) ($cfg['key'] ?? '');
        $apiRoot = (string) ($cfg['root'] ?? '');
        $verify = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($apiKey === '' || $apiRoot === '') {
            return response()->json(['error' => 'Configuration API manquante'], 500);
        }

        $url = rtrim($apiRoot, '/') . "/api/v3/lootbox/xp/multiplier";

        try {
            $resp = Http::withOptions(['verify' => $verify, 'timeout' => 15])
                ->withHeaders([
                    'X-API-KEY' => $apiKey,
                    'Accept' => 'application/json',
                ])
                ->get($url);

            $raw = trim((string) $resp->body());

            if ($raw === '') {
                return response()->json([], $resp->status());
            }

            if (is_numeric($raw)) {
                return response()->json([
                    'value' => (float) $raw == (int) $raw ? (int) $raw : (float) $raw,
                ], $resp->status());
            }

            try {
                $json = $resp->json();
                return response()->json($json ?: [], $resp->status());
            } catch (Throwable) {
                return response()->json([
                    'raw' => $raw,
                ], $resp->status());
            }
        } catch (Throwable $e) {
            Log::error('mods.lootbox.xp.get-multiplier', [
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}
