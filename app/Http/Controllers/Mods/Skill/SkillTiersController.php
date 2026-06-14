<?php

namespace App\Http\Controllers\Mods\Skill;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class SkillTiersController extends Controller
{
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'percentiles' => ['required', 'array', 'size:7'],
            'percentiles.*' => ['required', 'numeric', 'gt:0', 'lt:1'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Bad request',
                'errors' => $validator->errors(),
            ], 400);
        }

        $percentiles = array_map('floatval', $validator->validated()['percentiles']);
        for ($index = 1; $index < count($percentiles); $index++) {
            if ($percentiles[$index] <= $percentiles[$index - 1]) {
                return response()->json([
                    'message' => 'Percentiles must be strictly increasing.',
                    'errors' => [
                        'percentiles' => ['Percentiles must be strictly increasing.'],
                    ],
                ], 400);
            }
        }

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
                ->send('PATCH', $apiRoot.'/api/v3/skill/tiers', [
                    'json' => ['percentiles' => $percentiles],
                ]);

            return response()->json($response->json() ?? [], $response->status() ?: 502);
        } catch (\Throwable $e) {
            Log::error('Skill tiers upstream exception', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Upstream exception',
                'error' => $e->getMessage(),
            ], 502);
        }
    }
}
