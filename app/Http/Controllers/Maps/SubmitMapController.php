<?php

declare(strict_types=1);

namespace App\Http\Controllers\Maps;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;
use Throwable;

final class SubmitMapController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => ['required', 'string', Rule::in(['Classic', 'Increasing Difficulty'])],
            'checkpoints' => ['required', 'integer', 'min:0'],
            'code' => ['required', 'string', 'regex:/^[A-Z0-9]{4,6}$/'],
            'creators' => ['required', 'array', 'min:1'],
            'creators.*.id' => ['required', 'integer', 'min:1'],
            'creators.*.is_primary' => ['required', 'boolean'],

            'difficulty' => ['required', 'string', 'max:32'],
            'map_name' => ['required', 'string', 'max:64'],

            'official' => ['sometimes', 'boolean'],
            'hidden' => ['sometimes', 'boolean'],
            'archived' => ['sometimes', 'boolean'],
            'playtesting' => ['sometimes', 'string', Rule::in(['Approved', 'In Progress', 'Rejected'])],

            'mechanics' => ['sometimes', 'array'],
            'mechanics.*' => ['string', 'max:64'],
            'restrictions' => ['sometimes', 'array'],
            'restrictions.*' => ['string', 'max:64'],

            'custom_banner' => ['sometimes', 'nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'guide_url' => ['sometimes', 'nullable', 'string', 'max:255'],
            'medals' => ['sometimes', 'array'],
            'title' => ['sometimes', 'nullable', 'string', 'max:128'],
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

        $endpoint = "{$root}/api/v3/maps";

        $payload = [
            'category' => $validated['category'],
            'checkpoints' => (int) $validated['checkpoints'],
            'code' => $validated['code'],
            'creators' => array_values(
                array_map(
                    fn (array $c) => ['id' => (int) $c['id'], 'is_primary' => (bool) $c['is_primary']],
                    $validated['creators'],
                ),
            ),
            'difficulty' => $validated['difficulty'],
            'map_name' => $validated['map_name'],
        ];

        foreach (['official', 'hidden', 'archived'] as $b) {
            if (array_key_exists($b, $validated)) {
                $payload[$b] = (bool) $validated[$b];
            }
        }
        foreach (['playtesting', 'custom_banner', 'description', 'guide_url', 'title'] as $s) {
            if (array_key_exists($s, $validated)) {
                $payload[$s] = $validated[$s];
            }
        }
        foreach (['mechanics', 'restrictions', 'medals'] as $arr) {
            if (array_key_exists($arr, $validated)) {
                $payload[$arr] = $validated[$arr];
            }
        }

        try {
            $res = Http::withOptions(['verify' => $verify])
                ->acceptJson()
                ->withHeaders(['X-API-KEY' => $key])
                ->post($endpoint, $payload);

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

            return response()->json($data, 201);
        } catch (Throwable $e) {
            return response()->json(
                [
                    'error' => true,
                    'message' => 'Failed to submit map: ' . $e->getMessage(),
                ],
                502,
            );
        }
    }
}
