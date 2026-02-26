<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class GetCurrentRotationController extends Controller
{
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => ['nullable', 'integer', 'min:1'],
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

        $endpoint = $apiRoot . '/api/v3/store/rotation';

        try {
            $resp = Http::withHeaders([
                    'Accept'    => 'application/json',
                    'X-API-KEY' => $apiKey,
                ])
                ->withOptions(['verify' => $sslVerify, 'timeout' => 10])
                ->get($endpoint, $data);

            return response()->json($resp->json() ?? [], $resp->status() ?: 502);
        } catch (\Throwable $e) {
            Log::error('Store rotation upstream exception', ['error' => $e->getMessage(), 'query' => $data]);
            return response()->json(['message' => 'Upstream exception', 'error' => $e->getMessage()], 502);
        }
    }
}