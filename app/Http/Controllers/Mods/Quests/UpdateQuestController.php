<?php

namespace App\Http\Controllers\Mods\Quests;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class UpdateQuestController extends Controller
{
    public function __invoke(Request $request, int $quest_id)
    {
        $validator = Validator::make(
            array_merge($request->all(), ['quest_id' => $quest_id]),
            [
                'quest_id' => ['required', 'integer', 'min:1'],
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Bad request',
                'errors'  => $validator->errors(),
            ], 400);
        }

        $apiRoot   = rtrim((string) config('services.genji_api.root', ''), '/');
        $apiKey    = (string) config('services.genji_api.key', '');
        $sslVerify = (bool) config('services.genji_api.verify', true);

        if ($apiRoot === '') {
            return response()->json(['message' => 'Genji API not configured'], 500);
        }

        $endpoint = $apiRoot . '/api/v3/store/admin/quests/' . $quest_id;

        // si body vide => {}
        $payload = $request->all();
        $json = empty($payload) ? new \stdClass() : $payload;

        try {
            $resp = Http::withHeaders([
                    'Accept'       => 'application/json',
                    'Content-Type' => 'application/json',
                    'X-API-KEY'    => $apiKey,
                ])
                ->withOptions(['verify' => $sslVerify, 'timeout' => 12])
                ->send('PATCH', $endpoint, ['json' => $json]);

            return response()->json($resp->json() ?? [], $resp->status() ?: 502);
        } catch (\Throwable $e) {
            Log::error('Admin quest update upstream exception', [
                'error' => $e->getMessage(),
                'quest_id' => $quest_id,
            ]);

            return response()->json(['message' => 'Upstream exception', 'error' => $e->getMessage()], 502);
        }
    }
}