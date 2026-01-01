<?php

namespace App\Http\Controllers\Mods\Lootbox\XP;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class ChangeXpMultiplierController extends Controller
{
    public function __invoke(Request $request)
    {
        $data = $request->validate([
            'value' => ['required', 'numeric', 'min:1', 'max:10'],
        ]);

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
                    'Content-Type' => 'application/json',
                ])
                ->post($url, ['value' => $data['value']]);

            $body = (string) $resp->body();
            if (trim($body) === '') {
                return response()->json([
                    'ok' => $resp->successful(),
                    'value' => $data['value'],
                ], $resp->status());
            }

            try {
                $json = $resp->json();
                return response()->json($json ?: [], $resp->status());
            } catch (Throwable) {
                return response()->json([
                    'ok' => $resp->successful(),
                    'value' => $data['value'],
                    'raw' => $body,
                ], $resp->status());
            }
        } catch (Throwable $e) {
            Log::error('mods.lootbox.xp.change-multiplier', [
                'value' => $data['value'] ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}
