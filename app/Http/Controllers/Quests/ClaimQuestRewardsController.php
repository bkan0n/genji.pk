<?php

namespace App\Http\Controllers\Quests;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ClaimQuestRewardsController extends Controller
{
    public function store(Request $request, int $progress_id)
    {
        $validator = Validator::make([
            'progress_id' => $progress_id,
            'user_id'     => $request->input('user_id'),
        ], [
            'progress_id' => ['required', 'integer', 'min:1'],
            'user_id'     => ['required', 'integer', 'min:1'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Bad request',
                'errors'  => $validator->errors(),
            ], 400);
        }

        $userId = (int) $request->input('user_id');

        $apiRoot   = rtrim((string) config('services.genji_api.root', ''), '/');
        $apiKey    = (string) config('services.genji_api.key', '');
        $sslVerify = (bool) config('services.genji_api.verify', true);

        if ($apiRoot === '') {
            return response()->json(['message' => 'Genji API not configured'], 500);
        }

        $endpoint = $apiRoot . '/api/v3/store/quests/' . $progress_id . '/claim';

        try {
            $resp = Http::withHeaders([
                    'Accept'       => 'application/json',
                    'Content-Type' => 'application/json',
                    'X-API-KEY'    => $apiKey,
                ])
                ->withOptions(['verify' => $sslVerify, 'timeout' => 12])
                ->send('POST', $endpoint, [
                    'json' => ['user_id' => $userId],
                ]);

            return response()->json($resp->json() ?? [], $resp->status() ?: 502);
        } catch (\Throwable $e) {
            Log::error('Claim quest rewards upstream exception', [
                'error'       => $e->getMessage(),
                'progress_id' => $progress_id,
                'user_id'     => $userId,
            ]);

            return response()->json([
                'message' => 'Upstream exception',
                'error'   => $e->getMessage(),
            ], 502);
        }
    }
}