<?php

namespace App\Http\Controllers\Maps;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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

        $cfg = config('services.genji_api', []);
        $apiRoot = rtrim((string) ($cfg['root'] ?? ''), '/');
        $apiKey = (string) ($cfg['key'] ?? '');
        $sslVerify = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($apiRoot === '') {
            return response()->json([
                'message' => 'Genji API root is not configured (services.genji_api.root).',
            ], 500);
        }

        $endpoint = $apiRoot . '/api/v3/completions/' . urlencode($data['code']) . '/quality';

        try {
            $client = Http::withOptions(['verify' => $sslVerify])
                ->acceptJson()
                ->asJson();

            if ($apiKey !== '') {
                $client = $client->withHeaders(['X-API-KEY' => $apiKey]);
            }

            $resp = $client->post($endpoint, [
                'user_id' => (string) $data['user_id'],
                'quality' => (int) $data['quality'],
            ]);

            $status = $resp->status();

            if ($resp->successful() || $status === 201) {
                $location = $resp->header('Location', $endpoint);

                return response()
                    ->json([
                        'status' => 'created',
                        'map_code' => $data['code'],
                        'user_id' => (string) $data['user_id'],
                        'quality' => (int) $data['quality'],
                    ], 201)
                    ->header('Location', $location);
            }

            $payload = $resp->json();

            return response()->json([
                'message' => 'Upstream error',
                'status' => $status,
                'error' => $payload ?: $resp->body(),
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
                'error' => $e->getMessage(),
            ], 502);
        }
    }
}
