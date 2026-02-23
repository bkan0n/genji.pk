<?php

namespace App\Http\Controllers\Mods\Quests;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UpdateQuestConfigController extends Controller
{
    public function __invoke(Request $request)
    {
        $apiRoot   = rtrim((string) config('services.genji_api.root', ''), '/');
        $apiKey    = (string) config('services.genji_api.key', '');
        $sslVerify = (bool) config('services.genji_api.verify', true);

        if ($apiRoot === '') {
            return response()->json(['message' => 'Genji API not configured'], 500);
        }

        $endpoint = $apiRoot . '/api/v3/store/admin/quests/config';

        $payload = $request->validate([
            'rotation_day'       => 'sometimes|nullable|integer|min:0|max:7',
            'rotation_hour'      => 'sometimes|nullable|integer|min:0|max:23',
            'easy_quest_count'   => 'sometimes|nullable|integer|min:0|max:1000',
            'medium_quest_count' => 'sometimes|nullable|integer|min:0|max:1000',
            'hard_quest_count'   => 'sometimes|nullable|integer|min:0|max:1000',
        ]);

        if (count($payload) === 0) {
            return response()->json([
                'message' => 'No fields provided.',
                'allowed_fields' => [
                    'rotation_day', 'rotation_hour',
                    'easy_quest_count', 'medium_quest_count', 'hard_quest_count',
                ],
            ], 422);
        }

        try {
            $resp = Http::withHeaders([
                    'Accept'       => 'application/json',
                    'Content-Type' => 'application/json',
                    'X-API-KEY'    => $apiKey,
                ])
                ->withOptions(['verify' => $sslVerify, 'timeout' => 15])
                ->send('PUT', $endpoint, ['json' => $payload]);

            return response()->json($resp->json() ?? [], $resp->status() ?: 502);
        } catch (\Throwable $e) {
            Log::error('Admin quests config update upstream exception', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Upstream exception',
                'error'   => $e->getMessage(),
            ], 502);
        }
    }
}