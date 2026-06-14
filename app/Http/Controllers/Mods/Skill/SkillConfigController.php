<?php

namespace App\Http\Controllers\Mods\Skill;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class SkillConfigController extends Controller
{
    private const FIELDS = [
        'diff_base',
        'gamma',
        'time_bonus',
        'shrink_k',
        'wr_bonus',
        'partial_factor',
        'medal_gold',
        'medal_silver',
        'medal_bronze',
    ];

    public function show()
    {
        return $this->proxy('GET');
    }

    public function update(Request $request)
    {
        $rules = array_fill_keys(self::FIELDS, ['sometimes', 'numeric']);
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Bad request',
                'errors' => $validator->errors(),
            ], 400);
        }

        $payload = array_intersect_key($validator->validated(), array_flip(self::FIELDS));
        if ($payload === []) {
            return response()->json([
                'message' => 'At least one skill weight is required.',
            ], 400);
        }

        if (array_key_exists('gamma', $payload) && (float) $payload['gamma'] < 0.5) {
            return response()->json([
                'message' => 'Gamma must be at least 0.5.',
                'errors' => ['gamma' => ['Gamma must be at least 0.5.']],
            ], 422);
        }

        return $this->proxy('PATCH', $payload);
    }

    private function proxy(string $method, array $payload = [])
    {
        $apiRoot = rtrim((string) config('services.genji_api.root', ''), '/');
        $apiKey = (string) config('services.genji_api.key', '');
        $sslVerify = (bool) config('services.genji_api.verify', true);

        if ($apiRoot === '') {
            return response()->json(['message' => 'Genji API not configured'], 500);
        }

        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'X-API-KEY' => $apiKey,
            ])
                ->withOptions(['verify' => $sslVerify, 'timeout' => 30])
                ->send($method, $apiRoot.'/api/v3/skill/config', $payload === [] ? [] : ['json' => $payload]);

            return response()->json($response->json() ?? [], $response->status() ?: 502);
        } catch (\Throwable $e) {
            Log::error('Skill config upstream exception', [
                'method' => $method,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Upstream exception',
                'error' => $e->getMessage(),
            ], 502);
        }
    }
}
