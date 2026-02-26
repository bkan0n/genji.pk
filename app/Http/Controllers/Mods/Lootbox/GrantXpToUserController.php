<?php

namespace App\Http\Controllers\Mods\Lootbox;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Throwable;

class GrantXpToUserController extends Controller
{
    private const TYPES = [
        'Map Submission',
        'Playtest',
        'Guide',
        'Completion',
        'Record',
        'World Record',
        'Other',
    ];

    public function __invoke(Request $request, int $user_id)
    {
        $data = $request->validate([
            'amount' => ['nullable', 'integer', 'min:1'],
            'xp'     => ['nullable', 'integer', 'min:1'],

            'type'   => ['nullable', 'string', 'max:32', Rule::in(self::TYPES)],

            'reason'           => ['nullable', 'string', 'max:200'],
            'apply_multiplier' => ['sometimes', 'boolean'],
            'source'           => ['nullable', 'string', 'max:32'],
        ]);

        $amount = $data['amount'] ?? $data['xp'] ?? null;
        if ($amount === null) {
            return response()->json([
                'error'  => 'Validation failed',
                'errors' => ['amount' => ['amount (or xp) is required']],
            ], 422);
        }

        $type = $data['type'] ?? 'Other';

        $cfg = Config::get('services.genji_api', []);
        $apiKey = (string) ($cfg['key'] ?? '');
        $apiRoot = (string) ($cfg['root'] ?? '');
        $verify = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($apiKey === '' || $apiRoot === '') {
            return response()->json(['error' => 'Configuration API manquante'], 500);
        }

        $pathTemplate = (string)($cfg['paths']['lootbox_grant_xp'] ?? "/api/v3/lootbox/users/{user_id}/xp");
        $path = str_replace('{user_id}', (string)$user_id, $pathTemplate);
        $url = rtrim($apiRoot, '/') . $path;

        $payload = [
            'amount' => (int) $amount,
            'type'   => $type,
        ];

        try {
            $client = Http::withOptions(['verify' => $verify, 'timeout' => 15])
                ->withHeaders([
                    'X-API-KEY' => $apiKey,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ]);

            $resp = $client->post($url, $payload);

            if (in_array($resp->status(), [400, 422], true)) {
                $j = $resp->json();
                $txt = is_array($j) ? json_encode($j) : '';
                if ($txt && str_contains($txt, 'Object missing required field `amount`') && str_contains($txt, '"key":"data"')) {
                    $resp2 = $client->post($url, ['data' => $payload]);
                    return response()->json($resp2->json() ?: [], $resp2->status());
                }
            }

            return response()->json($resp->json() ?: [], $resp->status());
        } catch (Throwable $e) {
            Log::error('mods.lootbox.grant-xp', [
                'user_id' => $user_id,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}