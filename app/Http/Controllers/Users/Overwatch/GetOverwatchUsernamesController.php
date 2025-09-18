<?php

declare(strict_types=1);

namespace App\Http\Controllers\Users\Overwatch;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use Throwable;

final class GetOverwatchUsernamesController extends Controller
{
    /**
     * GET /api/users/{user_id}/overwatch
     * Proxy -> GET {root}/api/v3/users/{user_id}/overwatch
     */
    public function __invoke(int $user_id): JsonResponse
    {
        $root = rtrim((string) config('services.genji_api.root', ''), '/');
        $key = (string) config('services.genji_api.key', '');
        $verify = (bool) config('services.genji_api.verify', true);

        if ($root === '' || $key === '') {
            return response()->json(
                [
                    'error' => true,
                    'message' => 'API configuration is missing.',
                ],
                500,
            );
        }

        $endpoint = "{$root}/api/v3/users/{$user_id}/overwatch";

        try {
            $res = Http::withOptions(['verify' => $verify])
                ->acceptJson()
                ->withHeaders(['X-API-KEY' => $key])
                ->get($endpoint);

            if (! $res->successful()) {
                return response()->json(
                    [
                        'error' => true,
                        'message' => "API request failed with status code {$res->status()}",
                        'response' => $res->json() ?? $res->body(),
                    ],
                    $res->status(),
                );
            }

            $data = $res->json();
            if (! is_array($data)) {
                return response()->json(
                    [
                        'error' => true,
                        'message' => 'Invalid JSON response from upstream.',
                    ],
                    502,
                );
            }

            return response()->json($data);
        } catch (Throwable $e) {
            return response()->json(
                [
                    'error' => true,
                    'message' => 'Failed to fetch Overwatch usernames: ' . $e->getMessage(),
                ],
                502,
            );
        }
    }
}
