<?php

namespace App\Http\Controllers\Mods\Users;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class GetOverwatchNamesController extends Controller
{
    public function __invoke(Request $request, int $user_id)
    {
        $cfg = Config::get('services.genji_api', []);
        $apiKey = (string) ($cfg['key'] ?? '');
        $apiRoot = (string) ($cfg['root'] ?? '');
        $verify = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($apiKey === '' || $apiRoot === '') {
            return response()->json(['error' => 'Configuration API manquante'], 500);
        }

        $url = rtrim($apiRoot, '/') . '/api/v3/users/' . $user_id . '/overwatch';

        try {
            $resp = Http::withOptions(['verify' => $verify, 'timeout' => 15])
                ->withHeaders([
                    'X-API-KEY' => $apiKey,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->get($url);

            return response()->json($resp->json() ?: [], $resp->status());
        } catch (Throwable $e) {
            Log::error('mods.users.get-overwatch', ['user_id' => $user_id, 'error' => $e->getMessage()]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}
