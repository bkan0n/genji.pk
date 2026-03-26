<?php

declare(strict_types=1);

namespace App\Http\Controllers\Completions;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Throwable;

final class ListAllCompletionsController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'page_size' => 'nullable|integer|in:10,20,25,50',
            'page_number' => 'nullable|integer|min:1',
        ]);

        $pageSize = $validated['page_size'] ?? 10;
        $pageNumber = $validated['page_number'] ?? 1;

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

        $client = Http::withHeaders([
            'Accept' => 'application/json',
            'X-API-KEY' => $apiKey,
        ])
            ->withOptions([
                'verify' => $verify,
                'timeout' => 15,
                'connect_timeout' => 5,
            ])
            ->withQueryParameters([
                'page_size' => $pageSize,
                'page_number' => $pageNumber,
            ]);

        try {
            $response = $client->post($base . '/api/v3/completions/all');

            $status = $response->status();
            $json = $response->json();

            if ($response->failed()) {
                return response()->json(
                    [
                        'error' => 'upstream_failed',
                        'status' => $status,
                        'message' => $response->reason(),
                        'upstream' => $json ?? $response->body(),
                    ],
                    $status ?: 502,
                );
            }

            if (! is_array($json)) {
                return response()->json(
                    [
                        'error' => 'invalid_upstream_json',
                        'message' => 'Invalid JSON response from upstream.',
                    ],
                    502,
                );
            }

            $json = $this->stringifyKeys($json, ['user_id', 'message_id']);

            return response()->json(
                $json,
                $status ?: 200,
                [],
                JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE | JSON_PRESERVE_ZERO_FRACTION,
            );
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

    private function stringifyKeys($payload, array $keys)
    {
        if (! is_array($payload)) {
            return $payload;
        }

        if ($this->isAssoc($payload)) {
            foreach ($keys as $key) {
                if (array_key_exists($key, $payload) && $payload[$key] !== null) {
                    $payload[$key] = (string) $payload[$key];
                }
            }

            foreach ($payload as $nestedKey => $value) {
                $payload[$nestedKey] = $this->stringifyKeys($value, $keys);
            }
        } else {
            foreach ($payload as $index => $value) {
                $payload[$index] = $this->stringifyKeys($value, $keys);
            }
        }

        return $payload;
    }

    private function isAssoc(array $arr): bool
    {
        return array_keys($arr) !== range(0, count($arr) - 1);
    }
}
