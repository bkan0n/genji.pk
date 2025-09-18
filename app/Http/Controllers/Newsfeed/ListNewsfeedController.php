<?php

namespace App\Http\Controllers\Newsfeed;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Throwable;

class ListNewsfeedController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'page_size' => 'nullable|integer|in:10,20,25,50',
            'page_number' => 'nullable|integer|min:1',
            'type' => 'nullable|string|in:new_map,record,archive,unarchive,bulk_archive,bulk_unarchive,guide,legacy_record,map_edit,role,announcement',
        ]);

        $pageSize = $validated['page_size'] ?? 10;
        $pageNumber = $validated['page_number'] ?? 1;
        $type = $validated['type'] ?? null;

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

        $query = [
            'page_size' => $pageSize,
            'page_number' => $pageNumber,
        ];
        if ($type !== null && $type !== '') {
            $query['type'] = $type;
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
            ->withQueryParameters($query);

        try {
            $response = $client->get($base . '/api/v3/newsfeed');

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

            $fixSnowflakes = function (&$val) use (&$fixSnowflakes) {
                if (is_array($val)) {
                    foreach ($val as $k => &$v) {
                        if (is_array($v)) {
                            $fixSnowflakes($v);
                        } else {
                            if (
                                in_array((string) $k, ['user_id', 'message_id', 'channel_id', 'guild_id'], true)
                            ) {
                                $val[$k] = (string) $v;
                            }
                        }
                    }
                }
            };
            if (is_array($json)) {
                $fixSnowflakes($json);
            }

            return response()->json($json, $status ?: 200, [], JSON_UNESCAPED_UNICODE);
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
