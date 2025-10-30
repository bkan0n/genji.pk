<?php

namespace App\Http\Controllers\Maps;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class QualityVoteController extends Controller
{
    public function store(Request $request, string $code)
    {
        $validator = Validator::make(
            array_merge($request->all(), ['code' => $code]),
            [
                'code'    => ['required', 'regex:/^[A-Za-z0-9\-]+$/'],
                'user_id' => ['required', 'regex:/^\d+$/'],
                'quality' => ['required', 'integer', 'min:1', 'max:6'],
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Bad request',
                'errors'  => $validator->errors(),
            ], 400);
        }

        $data = $validator->validated();

        $apiRoot  = rtrim((string) config('genji_api.root', ''), '/');
        $apiKey   = (string) config('genji_api.key', '');
        $sslVerify = (bool) config('genji_api.verify', true);

        if ($apiRoot !== '') {
            $endpoint = $apiRoot . '/api/v3/completions/' . urlencode($data['code']) . '/quality';

            try {
                $resp = Http::withHeaders([
                        'Accept'       => 'application/json',
                        'Content-Type' => 'application/json',
                        'X-API-KEY'    => $apiKey,
                    ])
                    ->withOptions(['verify' => $sslVerify])
                    ->post($endpoint, [
                        'user_id' => (string) $data['user_id'],
                        'quality' => (int) $data['quality'],
                    ]);

                $status = $resp->status();

                if ($resp->successful() || $status === 201) {
                    return response()
                        ->json([
                            'status'   => 'created',
                            'map_code' => $data['code'],
                            'user_id'  => (string) $data['user_id'],
                            'quality'  => (int) $data['quality'],
                        ], 201)
                        ->header('Location', $endpoint);
                }

                $payload = $resp->json();
                return response()->json([
                    'message' => 'Upstream error',
                    'status'  => $status,
                    'error'   => $payload ?: $resp->body(),
                ], $status ?: 502);

            } catch (\Throwable $e) {
                Log::error('QualityVote upstream exception', [
                    'code' => $data['code'],
                    'user_id' => $data['user_id'],
                    'quality' => $data['quality'],
                    'error' => $e->getMessage(),
                ]);

                return response()->json([
                    'message' => 'Upstream exception',
                    'error'   => $e->getMessage(),
                ], 502);
            }
        }
    }
}
