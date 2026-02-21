<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PurchaseItemController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'   => ['required', 'regex:/^\d+$/', 'not_in:0', 'max:25'],
            'item_name' => ['required', 'string', 'max:120'],
            'item_type' => ['required', 'string', 'max:50'],
            'key_type'  => ['required', 'string', 'max:50'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Bad request',
                'errors'  => $validator->errors(),
            ], 400);
        }

        $data = $validator->validated();

        $data['user_id'] = (string) $data['user_id'];

        $apiRoot   = rtrim((string) config('services.genji_api.root', ''), '/');
        $apiKey    = (string) config('services.genji_api.key', '');
        $sslVerify = (bool) config('services.genji_api.verify', true);

        if ($apiRoot === '') {
            return response()->json(['message' => 'Genji API not configured'], 500);
        }

        $endpoint = $apiRoot . '/api/v3/store/purchase/item';

        try {
            $resp = Http::withHeaders([
                    'Accept'       => 'application/json',
                    'Content-Type' => 'application/json',
                    'X-API-KEY'    => $apiKey,
                ])
                ->withOptions(['verify' => $sslVerify, 'timeout' => 12])
                ->post($endpoint, $data);

            return response()->json($resp->json() ?? [], $resp->status() ?: 502);

        } catch (\Throwable $e) {
            Log::error('Store purchase item upstream exception', [
                'error'   => $e->getMessage(),
                'payload' => $data,
            ]);

            return response()->json([
                'message' => 'Upstream exception',
                'error'   => $e->getMessage(),
            ], 502);
        }
    }
}