<?php

namespace App\Http\Controllers\Mods\Lootbox;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Throwable;

class SetActiveKeyTypeController extends Controller
{
    public function __invoke(Request $request, string $keyType)
    {
        validator(
            ['keyType' => $keyType],
            ['keyType' => ['required', Rule::in(['Classic', 'Winter'])]],
        )->validate();

        $cfg = Config::get('services.genji_api', []);
        $apiKey = (string) ($cfg['key'] ?? '');
        $apiRoot = (string) ($cfg['root'] ?? '');
        $verify = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($apiKey === '' || $apiRoot === '') {
            return response()->json(['error' => 'API Configuration Missing'], 500);
        }

        $url = rtrim($apiRoot, '/') . "/api/v3/lootbox/keys/{$keyType}";

        try {
            $resp = Http::withOptions(['verify' => $verify, 'timeout' => 15])
                ->withHeaders([
                    'X-API-KEY' => $apiKey,
                    'Accept' => 'application/json',
                ])
                ->patch($url);

            $body = (string) $resp->body();
            if ($body === '') {
                return response()->json([
                    'ok' => $resp->successful(),
                    'active_key_type' => $keyType,
                ], $resp->status());
            }

            try {
                $json = $resp->json();
                return response()->json($json ?: [], $resp->status());
            } catch (Throwable) {
                return response()->json([
                    'ok' => $resp->successful(),
                    'active_key_type' => $keyType,
                    'raw' => $body,
                ], $resp->status());
            }
        } catch (Throwable $e) {
            Log::error('mods.lootbox.set-active-key-type', [
                'keyType' => $keyType,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}