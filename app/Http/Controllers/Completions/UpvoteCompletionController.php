<?php

namespace App\Http\Controllers\Completions;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Throwable;

class UpvoteCompletionController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message_id' => ['required', 'regex:/^\d{1,20}$/'],
            'user_id' => ['required', 'regex:/^\d{1,20}$/'],
        ]);

        $base = rtrim((string) config('services.genji_api.root'), '/');
        $apiKey = (string) config('services.genji_api.key');
        $verify = filter_var(config('services.genji_api.verify', true), FILTER_VALIDATE_BOOLEAN);

        if ($base === '') {
            return response()->json(
                [
                    'error' => 'misconfigured',
                    'message' => 'services.genji_api.root est vide ou manquant.',
                ],
                500,
            );
        }

        try {
            $res = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'X-API-KEY' => $apiKey,
                'X-Api-Key' => $apiKey,
            ])
                ->withOptions([
                    'verify' => $verify,
                    'timeout' => 15,
                    'connect_timeout' => 5,
                ])
                ->post($base . '/api/v3/completions/upvoting', [
                    'user_id' => (string) $validated['user_id'],
                    'message_id' => (string) $validated['message_id'],
                ]);

            $status = $res->status();
            $json = $res->json();

            if ($res->failed()) {
                return response()->json(
                    [
                        'error' => 'upstream_failed',
                        'status' => $status,
                        'message' => $res->reason(),
                        'upstream' => $json ?? $res->body(),
                    ],
                    $status ?: 502,
                );
            }

            if (is_numeric($json)) {
                return response()->json(
                    ['count' => (int) $json],
                    $status ?: 201,
                    [],
                    JSON_UNESCAPED_SLASHES,
                );
            }
            if (is_array($json) && isset($json['count'])) {
                return response()->json(
                    ['count' => (int) $json['count']],
                    $status ?: 201,
                    [],
                    JSON_UNESCAPED_SLASHES,
                );
            }

            return response()->json($json, $status ?: 201, [], JSON_UNESCAPED_SLASHES);
        } catch (Throwable $e) {
            return response()->json(
                [
                    'error' => 'http_exception',
                    'message' => $e->getMessage(),
                ],
                502,
            );
        }
    }
}
