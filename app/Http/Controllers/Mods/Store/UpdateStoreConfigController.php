<?php

namespace App\Http\Controllers\Mods\Store;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class UpdateStoreConfigController extends Controller
{
    public function __invoke(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rotation_period_days' => ['nullable', 'integer', 'min:1', 'max:3650'],
            'active_key_type'      => ['nullable', 'string', 'max:50'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Bad request',
                'errors'  => $validator->errors(),
            ], 400);
        }

        $validated = $validator->validated();
        $payload = [];
        if ($request->has('rotation_period_days')) $payload['rotation_period_days'] = $validated['rotation_period_days'] ?? null;
        if ($request->has('active_key_type'))      $payload['active_key_type']      = $validated['active_key_type'] ?? null;

        $apiRoot   = rtrim((string) config('services.genji_api.root', ''), '/');
        $apiKey    = (string) config('services.genji_api.key', '');
        $sslVerify = (bool) config('services.genji_api.verify', true);

        if ($apiRoot === '') {
            return response()->json(['message' => 'Genji API not configured'], 500);
        }

        $endpoint = $apiRoot . '/api/v3/store/admin/config';

        try {
            $resp = Http::withHeaders([
                    'Accept'       => 'application/json',
                    'Content-Type' => 'application/json',
                    'X-API-KEY'    => $apiKey,
                ])
                ->withOptions(['verify' => $sslVerify, 'timeout' => 12])
                ->send('PUT', $endpoint, ['json' => $payload ?: new \stdClass()]);

            return response()->json($resp->json() ?? [], $resp->status() ?: 502);
        } catch (\Throwable $e) {
            Log::error('Admin store config update upstream exception', ['error' => $e->getMessage(), 'payload' => $payload]);
            return response()->json(['message' => 'Upstream exception', 'error' => $e->getMessage()], 502);
        }
    }
}