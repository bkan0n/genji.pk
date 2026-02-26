<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class UserCoinsController extends Controller
{
    public function __invoke(Request $request, string $user_id)
    {
        // Validation (même style que QualityVoteController)
        $validator = Validator::make(
            array_merge($request->all(), ['user_id' => $user_id]),
            [
                'user_id' => ['required', 'regex:/^\d+$/'],
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Bad request',
                'errors'  => $validator->errors(),
            ], 400);
        }

        $data = $validator->validated();
        $uid  = (int) $data['user_id'];

        $apiRoot   = rtrim((string) config('services.genji_api.root', ''), '/');
        $apiKey    = (string) config('services.genji_api.key', '');
        $sslVerify = (bool) config('services.genji_api.verify', true);

        if ($apiRoot === '') {
            return response()->json([
                'message' => 'API root not configured',
                'error'   => 'genji_api.root is empty',
            ], 500);
        }

        $endpoint = $apiRoot . "/api/v3/lootbox/users/{$uid}/coins";

        try {
            $http = Http::withHeaders(array_filter([
                'Accept'    => 'application/json',
                'X-API-KEY' => $apiKey ?: null,
            ]))
            ->withOptions(['verify' => $sslVerify]);

            $resp   = $http->get($endpoint);
            $status = $resp->status();

            if ($resp->successful()) {
                $json  = $resp->json();
                $coins = null;

                if (is_array($json)) {
                    $coins = $json['coins'] ?? ($json['data']['coins'] ?? null);
                } elseif (is_numeric($json)) {
                    $coins = $json;
                } else {
                    $coins = trim((string) $resp->body());
                }

                $coinsInt = is_numeric($coins) ? (int) $coins : 0;

                return response()->json([
                    'user_id' => (string) $uid,
                    'coins'   => $coinsInt,
                ], 200);
            }

            $payload = $resp->json();

            Log::warning('UserCoins upstream error', [
                'user_id'  => $uid,
                'status'   => $status,
                'endpoint' => $endpoint,
                'error'    => $payload ?: $resp->body(),
            ]);

            return response()->json([
                'message' => 'Upstream error',
                'status'  => $status ?: 502,
                'error'   => $payload ?: $resp->body(),
            ], $status ?: 502);

        } catch (\Throwable $e) {
            Log::error('UserCoins upstream exception', [
                'user_id'  => $uid,
                'endpoint' => $endpoint,
                'error'    => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Upstream exception',
                'error'   => $e->getMessage(),
            ], 502);
        }
    }
}