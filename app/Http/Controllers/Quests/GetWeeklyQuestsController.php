<?php

namespace App\Http\Controllers\Quests;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class GetWeeklyQuestsController extends Controller
{
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => ['required', 'integer', 'min:1'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Bad request',
                'errors'  => $validator->errors(),
            ], 400);
        }

        $data = $validator->validated();

        $apiRoot   = rtrim((string) config('services.genji_api.root', ''), '/');
        $apiKey    = (string) config('services.genji_api.key', '');
        $sslVerify = (bool) config('services.genji_api.verify', true);

        if ($apiRoot === '') {
            return response()->json(['message' => 'Genji API not configured'], 500);
        }

        $endpoint = $apiRoot . '/api/v3/store/quests';

        try {
            $resp = Http::withHeaders([
                    'Accept'    => 'application/json',
                    'X-API-KEY' => $apiKey,
                ])
                ->withOptions(['verify' => $sslVerify, 'timeout' => 10])
                ->get($endpoint, $data);

            $status = $resp->status() ?: 502;
            $json = $resp->json();

            if (!is_array($json)) {
                return response()->json($json ?? [], $status);
            }

            if (isset($json['quests']) && is_array($json['quests'])) {
                foreach ($json['quests'] as $i => $q) {
                    if (!is_array($q)) continue;

                    $rival = $q['progress']['rival_user_id'] ?? null;

                    if ($rival !== null) {
                        $json['quests'][$i]['progress']['rival_user_id'] = (string) $rival;
                    }
                }
            }

            return response()->json($json, $status);
        } catch (\Throwable $e) {
            Log::error('Weekly quests upstream exception', ['error' => $e->getMessage(), 'query' => $data]);
            return response()->json(['message' => 'Upstream exception', 'error' => $e->getMessage()], 502);
        }
    }
}