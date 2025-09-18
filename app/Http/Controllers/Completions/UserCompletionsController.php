<?php

declare(strict_types=1);

namespace App\Http\Controllers\Completions;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use Throwable;

final class UserCompletionsController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => ['required', 'string', 'regex:/^\d+$/', 'max:32'],
            'difficulty' => ['nullable', 'string', 'max:32'],
            'page_number' => ['nullable', 'integer', 'min:1'],
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

        $endpoint = "{$root}/api/v3/completions";
        $pageNumber = max(1, $request->integer('page_number', 1));
        $pageSize = max(1, min($request->integer('page_size', 25), 100));

        $userId = (string) $request->input('user_id');

        try {
            $res = Http::withOptions(['verify' => $verify])
                ->acceptJson()
                ->withHeaders(['X-API-KEY' => $key])
                ->get($endpoint, [
                    'user_id' => $userId,
                    'difficulty' => $request->query('difficulty'),
                    'page_number' => $pageNumber,
                    'page_size' => $pageSize,
                ]);

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

            $data = $this->stringifyKeys($data, ['user_id', 'message_id']);

            return response()->json($data, 200, [], JSON_UNESCAPED_SLASHES);
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

    private function stringifyKeys($payload, array $keys)
    {
        if (! is_array($payload)) {
            return $payload;
        }

        if ($this->isAssoc($payload)) {
            foreach ($keys as $k) {
                if (array_key_exists($k, $payload) && $payload[$k] !== null) {
                    $payload[$k] = (string) $payload[$k];
                }
            }
            foreach ($payload as $kk => $vv) {
                $payload[$kk] = $this->stringifyKeys($vv, $keys);
            }
        } else {
            foreach ($payload as $i => $vv) {
                $payload[$i] = $this->stringifyKeys($vv, $keys);
            }
        }

        return $payload;
    }

    private function isAssoc(array $arr): bool
    {
        return array_keys($arr) !== range(0, count($arr) - 1);
    }
}
