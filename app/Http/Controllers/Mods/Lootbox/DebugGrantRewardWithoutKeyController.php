<?php

namespace App\Http\Controllers\Mods\Lootbox;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class DebugGrantRewardWithoutKeyController extends Controller
{
    public function __invoke(
        Request $request,
        int $user_id,
        string $key_type,
        string $reward_type,
        string $reward_name,
    ) {
        $request->merge(compact('user_id', 'key_type', 'reward_type', 'reward_name'));
        $request->validate([
            'user_id' => ['required', 'integer'],
            'key_type' => ['required', 'in:Classic,Winter'],
            'reward_type' => ['required', 'string', 'max:64'],
            'reward_name' => ['required', 'string', 'max:128'],
        ]);

        $cfg = Config::get('services.genji_api', []);
        $apiKey = (string) ($cfg['key'] ?? '');
        $apiRoot = (string) ($cfg['root'] ?? '');
        $verify = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($apiKey === '' || $apiRoot === '') {
            return response()->json(['error' => 'Configuration API manquante'], 500);
        }

        $url =
          rtrim($apiRoot, '/') .
          "/api/v3/lootbox/users/debug/{$user_id}/{$key_type}/{$reward_type}/{$reward_name}";

        try {
            $resp = Http::withOptions(['verify' => $verify, 'timeout' => 15])
                ->withHeaders([
                    'X-API-KEY' => $apiKey,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post($url);

            return response()->json($resp->json() ?: [], $resp->status());
        } catch (Throwable $e) {
            Log::error('mods.lootbox.debug-grant', [
                'user_id' => $user_id,
                'key_type' => $key_type,
                'reward_type' => $reward_type,
                'reward_name' => $reward_name,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}
