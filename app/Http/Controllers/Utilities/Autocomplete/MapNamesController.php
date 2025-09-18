<?php

declare(strict_types=1);

namespace App\Http\Controllers\Utilities\Autocomplete;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use Throwable;

final class MapNamesController extends Controller
{
    public function __invoke(Request $request, string $locale = 'en'): JsonResponse
    {
        $request->validate([
            'value' => ['required', 'string'],
            'page_size' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

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

        $endpoint = "{$root}/api/v3/utilities/autocomplete/names";

        $limit = (int) $request->integer('page_size', 10);
        $limit = max(1, min(50, $limit));

        $query = [
            'search' => $request->query('value'),
            'limit' => $limit,
            'locale' => $locale ?: 'en',
        ];

        try {
            $res = Http::withOptions(['verify' => $verify])
                ->acceptJson()
                ->withHeaders(['X-API-KEY' => $key])
                ->get($endpoint, $query);

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

            $payload = $res->json();

            if (! is_array($payload)) {
                return response()->json(
                    [
                        'error' => true,
                        'message' => 'Invalid JSON response from upstream.',
                    ],
                    502,
                );
            }

            $results = [];
            foreach ($payload as $item) {
                if (is_string($item)) {
                    $results[] = [
                        'map_name' => $item,
                        'translated_map_name' => $item,
                    ];
                } elseif (is_array($item)) {
                    $name = $item['map_name'] ?? ($item['name'] ?? '');
                    $tname = $item['translated_map_name'] ?? $name;
                    if ($name !== '') {
                        $results[] = [
                            'map_name' => $name,
                            'translated_map_name' => $tname,
                        ];
                    }
                }
            }

            return response()->json($results);
        } catch (Throwable $e) {
            return response()->json(
                [
                    'error' => true,
                    'message' => 'Failed to fetch data from the API: ' . $e->getMessage(),
                ],
                502,
            );
        }
    }
}
