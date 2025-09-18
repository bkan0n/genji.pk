<?php

declare(strict_types=1);

namespace App\Http\Controllers\Utilities\Autocomplete;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;
use Throwable;

final class MapCodesController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $data = $request->validate([
            'search' => ['required', 'string'],
            'archived' => ['nullable', 'boolean'],
            'hidden' => ['nullable', 'boolean'],
            'playtesting' => ['nullable', 'string', Rule::in(['Approved', 'In Progress', 'Rejected'])],
            'limit' => ['nullable', 'integer', 'min:1', 'max:50'],
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

        $endpoint = "{$root}/api/v3/utilities/autocomplete/codes";

        $query = [
            'search' => trim($data['search']),
            'limit' => (int) ($data['limit'] ?? 5),
        ];
        if (array_key_exists('archived', $data)) {
            $query['archived'] = (bool) $data['archived'];
        }
        if (array_key_exists('hidden', $data)) {
            $query['hidden'] = (bool) $data['hidden'];
        }
        if (! empty($data['playtesting'])) {
            $query['playtesting'] = $data['playtesting'];
        }

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

            $json = $res->json();
            if ($json === null) {
                return response()->json(
                    [
                        'error' => true,
                        'message' => 'Invalid JSON response from upstream.',
                    ],
                    502,
                );
            }

            return response()->json($json);
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
