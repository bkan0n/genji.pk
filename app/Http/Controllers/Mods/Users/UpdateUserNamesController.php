<?php

namespace App\Http\Controllers\Mods\Users;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class UpdateUserNamesController extends Controller
{
    public function __invoke(Request $request, int $user_id)
    {
        $validated = $request->validate([
            'global_name' => ['nullable', 'string', 'max:100'],
            'nickname' => ['nullable', 'string', 'max:100'],
        ]);

        if (is_null($validated['global_name'] ?? null) && is_null($validated['nickname'] ?? null)) {
            return response()->json(
                ['error' => 'At least one of global_name or nickname is required.'],
                422,
            );
        }

        $cfg = Config::get('services.genji_api', []);
        $apiKey = (string) ($cfg['key'] ?? '');
        $apiRoot = (string) ($cfg['root'] ?? '');
        $verify = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($apiKey === '' || $apiRoot === '') {
            return response()->json(['error' => 'Configuration API manquante'], 500);
        }

        $url = rtrim($apiRoot, '/') . '/api/v3/users/' . $user_id;

        try {
            $body = [];
            if (! is_null($validated['global_name'] ?? null)) {
                $body['global_name'] = $validated['global_name'];
            }
            if (! is_null($validated['nickname'] ?? null)) {
                $body['nickname'] = $validated['nickname'];
            }

            $resp = Http::withOptions(['verify' => $verify, 'timeout' => 15])
                ->withHeaders([
                    'X-API-KEY' => $apiKey,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->patch($url, $body);

            return response()->json($resp->json() ?: [], $resp->status());
        } catch (Throwable $e) {
            Log::error('mods.users.update-names', ['user_id' => $user_id, 'error' => $e->getMessage()]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}
