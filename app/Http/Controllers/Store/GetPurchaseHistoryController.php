<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class GetPurchaseHistoryController extends Controller
{
    public function index(Request $request, int $user_id)
    {
        $validator = Validator::make(
            array_merge($request->all(), ['user_id' => $user_id]),
            [
                'user_id' => ['required', 'integer', 'min:1'],
                'limit'   => ['nullable', 'integer', 'min:1', 'max:200'],
                'offset'  => ['nullable', 'integer', 'min:0', 'max:1000000'],
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Bad request',
                'errors'  => $validator->errors(),
            ], 400);
        }

        $data = $validator->validated();
        $query = array_filter([
            'limit'  => $data['limit']  ?? null,
            'offset' => $data['offset'] ?? null,
        ], fn ($v) => $v !== null);

        $apiRoot   = rtrim((string) config('services.genji_api.root', ''), '/');
        $apiKey    = (string) config('services.genji_api.key', '');
        $sslVerify = (bool) config('services.genji_api.verify', true);

        if ($apiRoot === '') {
            return response()->json(['message' => 'Genji API not configured'], 500);
        }

        $endpoint = $apiRoot . '/api/v3/store/users/' . $data['user_id'] . '/purchases';

        try {
            $resp = Http::withHeaders([
                    'Accept'    => 'application/json',
                    'X-API-KEY' => $apiKey,
                ])
                ->withOptions(['verify' => $sslVerify, 'timeout' => 10])
                ->get($endpoint, $query);

            return response()->json($resp->json() ?? [], $resp->status() ?: 502);
        } catch (\Throwable $e) {
            Log::error('Store purchase history upstream exception', [
                'error' => $e->getMessage(),
                'user_id' => $data['user_id'],
                'query' => $query,
            ]);

            return response()->json(['message' => 'Upstream exception', 'error' => $e->getMessage()], 502);
        }
    }
}