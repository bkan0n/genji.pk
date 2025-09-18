<?php

declare(strict_types=1);

namespace App\Http\Controllers\Utilities\Autocomplete;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use Throwable;

final class MapRestrictionsController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $norm = [
            'search' => $request->has('search')
              ? (string) $request->query('search')
              : (string) $request->query('value', ''),
            'limit' => $request->has('limit')
              ? $request->integer('limit')
              : $request->integer('page_size', 50),
        ];

        $data = validator($norm, [
            'search' => ['present', 'string'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:50'],
        ])->validate();

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

        $endpoint = "{$root}/api/v3/utilities/autocomplete/restrictions";

        $limit = (int) max(1, min(50, (int) ($data['limit'] ?? 50)));
        $search = trim((string) ($data['search'] ?? ''));
        $forwardSearch = $search === '' ? '*' : $search;

        try {
            $res = Http::withOptions(['verify' => $verify])
                ->acceptJson()
                ->withHeaders(['X-API-KEY' => $key])
                ->get($endpoint, ['search' => $forwardSearch, 'limit' => $limit]);

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

            $items = $this->extractList($res->json());
            if ($items === null) {
                return response()->json(
                    [
                        'error' => true,
                        'message' => 'Invalid JSON response from upstream.',
                    ],
                    502,
                );
            }

            $items = array_values(array_unique(array_map('strval', $items)));

            return response()->json(array_slice($items, 0, $limit));
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

    private function extractList($json): ?array
    {
        if (! is_array($json)) {
            return null;
        }
        $isList = array_keys($json) === range(0, count($json) - 1);
        if ($isList) {
            return $json;
        }
        if (isset($json['results']) && is_array($json['results'])) {
            return $json['results'];
        }

        return null;
    }
}
