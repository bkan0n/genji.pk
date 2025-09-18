<?php

namespace App\Http\Controllers\Completions;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Throwable;

class MapLeaderboardController extends Controller
{
    public function __invoke(Request $request, string $code): JsonResponse
    {
        $request->merge(['code' => $code]);
        $request->validate([
            'code' => ['required', 'string', 'regex:/^[A-Za-z0-9\-]{3,10}$/'],
            'page_number' => ['nullable', 'integer', 'min:1'],
            'page_size' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $apiRoot = rtrim((string) config('services.genji_api.root'), '/');
        $apiKey = (string) config('services.genji_api.key');
        $verify = filter_var(config('services.genji_api.verify', true), FILTER_VALIDATE_BOOLEAN);

        if ($apiKey === '' || $apiRoot === '') {
            return response()->json(['error' => 'API not configured.'], 500);
        }

        try {
            $endpoint = "{$apiRoot}/api/v3/completions/" . rawurlencode($code);

            $pageNumber = max(1, (int) $request->query('page_number', 1));
            $pageSize = max(1, min(100, (int) $request->query('page_size', 25)));

            $query = [
                'page_number' => $pageNumber,
                'page_size' => $pageSize,
            ];

            $resp = Http::withHeaders([
                'X-API-KEY' => $apiKey,
                'Accept' => 'application/json',
            ])
                ->withOptions(['verify' => $verify])
                ->get($endpoint, $query);

            if (! $resp->ok()) {
                return response()->json(
                    [
                        'error' => 'Failed to fetch leaderboard.',
                        'status' => $resp->status(),
                        'details' => $resp->json(),
                    ],
                    $resp->status(),
                );
            }

            $payload = $resp->json();

            $list = [];
            $total = null;

            if (is_array($payload)) {
                if (array_is_list($payload)) {
                    $list = $payload;
                } else {
                    if (isset($payload['results']) && is_array($payload['results'])) {
                        $list = $payload['results'];
                    } elseif (isset($payload['data']) && is_array($payload['data'])) {
                        $list = $payload['data'];
                    } elseif (isset($payload['items']) && is_array($payload['items'])) {
                        $list = $payload['items'];
                    }

                    if (isset($payload['total_results']) && is_numeric($payload['total_results'])) {
                        $total = (int) $payload['total_results'];
                    }
                }
            }

            if (
                $total === null &&
                ! empty($list) &&
                is_array($list[0]) &&
                isset($list[0]['total_results']) &&
                is_numeric($list[0]['total_results'])
            ) {
                $total = (int) $list[0]['total_results'];
            }

            $results = array_map(static function (array $row) {
                return [
                    'map_code' => $row['code'] ?? ($row['map_code'] ?? 'N/A'),
                    'nickname' => $row['name'] ?? ($row['nickname'] ?? 'N/A'),
                    'also_known_as' => $row['also_known_as'] ?? null,
                    'discord_tag' => $row['discord_tag'] ?? 'N/A',
                    'time' => isset($row['time']) ? (float) $row['time'] : 0.0,
                    'medal' => $row['medal'] ?? 'N/A',
                    'video' => $row['video'] ?? null,
                    'screenshot' => $row['screenshot'] ?? null,
                    'verified' => (bool) ($row['verified'] ?? false),
                    'completion' => (bool) ($row['completion'] ?? false),
                    'rank' => $row['rank'] ?? null,
                    'map_name' => $row['map_name'] ?? null,
                    'difficulty' => $row['difficulty'] ?? null,
                    'message_id' => $row['message_id'] ?? null,
                    'legacy' => (bool) ($row['legacy'] ?? false),
                    'legacy_medal' => $row['legacy_medal'] ?? null,
                    'suspicious' => (bool) ($row['suspicious'] ?? false),
                    'user_id' => isset($row['user_id']) ? (string) $row['user_id'] : null,
                    'total_results' => isset($row['total_results']) && is_numeric($row['total_results'])
                        ? (int) $row['total_results']
                        : null,
                ];
            }, $list);

            return response()->json(
                [
                    'results' => $results,
                    'total_results' => $total ?? count($results),
                ],
                200,
            );
        } catch (Throwable $e) {
            return response()->json(
                [
                    'error' => 'Request failed: ' . $e->getMessage(),
                ],
                500,
            );
        }
    }
}
