<?php

declare(strict_types=1);

namespace App\Http\Controllers\Completions;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Throwable;

final class GetCompletionUpvotesController extends Controller
{
    public function __invoke(Request $request, string $message_id): JsonResponse
    {
        $messageId = trim($message_id);

        if (! preg_match('/^\d{1,20}$/', $messageId)) {
            return response()->json(
                [
                    'error' => 'invalid_message_id',
                    'message' => 'message_id must contain 1 to 20 digits.',
                ],
                422,
            );
        }

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
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'X-API-KEY' => $apiKey,
            ])
                ->withOptions([
                    'verify' => $verify,
                    'timeout' => 15,
                    'connect_timeout' => 5,
                ])
                ->get($base . '/api/v3/completions/upvoting/' . $messageId);

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

            $count = $this->extractCount($json);
            if ($count !== null) {
                return response()->json(
                    [
                        'count' => $count,
                        'upvotes' => $count,
                        'message_id' => $messageId,
                    ],
                    $status ?: 200,
                    [],
                    JSON_UNESCAPED_SLASHES,
                );
            }

            return response()->json($json, $status ?: 200, [], JSON_UNESCAPED_SLASHES);
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

    private function extractCount(mixed $payload): ?int
    {
        if (is_numeric($payload)) {
            return (int) $payload;
        }

        if (is_array($payload)) {
            foreach (['upvotes', 'count'] as $key) {
                if (array_key_exists($key, $payload) && is_numeric($payload[$key])) {
                    return (int) $payload[$key];
                }
            }
        }

        return null;
    }
}
