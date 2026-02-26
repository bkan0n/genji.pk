<?php

namespace App\Http\Controllers\Mods\Store;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class GenerateNewRotationController extends Controller
{
    public function __invoke(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'item_count' => ['required', 'integer', 'min:1', 'max:100'],
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

        $endpoint = $apiRoot . '/api/v3/store/admin/rotation/generate';

        try {
            $resp = Http::withHeaders([
                    'Accept'       => 'application/json',
                    'Content-Type' => 'application/json',
                    'X-API-KEY'    => $apiKey,
                ])
                ->withOptions(['verify' => $sslVerify, 'timeout' => 15])
                ->post($endpoint, $data);

            return response()->json($resp->json() ?? [], $resp->status() ?: 502);
        } catch (\Throwable $e) {
            Log::error('Admin store rotation generate upstream exception', ['error' => $e->getMessage(), 'payload' => $data]);
            return response()->json(['message' => 'Upstream exception', 'error' => $e->getMessage()], 502);
        }
    }
}