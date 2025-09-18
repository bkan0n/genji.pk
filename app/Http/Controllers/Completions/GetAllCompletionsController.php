<?php

namespace App\Http\Controllers\Completions;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Throwable;

class GetAllCompletionsController extends Controller
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
            'X-Api-Key' => $apiKey,
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

            $json = $this->stringifyBigIds($json, ['user_id', 'message_id']);

            return response()->json(
                $json,
                $status ?: 200,
                [],
                JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE | JSON_PRESERVE_ZERO_FRACTION,
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

    private function stringifyBigIds(mixed $data, array $keys)
    {
        if (is_array($data)) {
            $out = [];
            foreach ($data as $k => $v) {
                if (in_array($k, $keys, true) && $v !== null && $v !== '') {
                    $out[$k] = (string) $v;
                } else {
                    $out[$k] = $this->stringifyBigIds($v, $keys);
                }
            }

            return $out;
        }

        if (is_object($data)) {
            foreach ($data as $k => $v) {
                if (in_array($k, $keys, true) && $v !== null && $v !== '') {
                    $data->$k = (string) $v;
                } else {
                    $data->$k = $this->stringifyBigIds($v, $keys);
                }
            }

            return $data;
        }

        return $data;
    }
}
