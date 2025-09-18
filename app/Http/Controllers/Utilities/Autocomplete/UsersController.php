<?php

declare(strict_types=1);

namespace App\Http\Controllers\Utilities\Autocomplete;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use Throwable;

final class UsersController extends Controller
{
    public function __invoke(Request $request): JsonResponse
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

        $endpoint = "{$root}/api/v3/utilities/autocomplete/users";
        $limit = max(1, min(50, $request->integer('page_size', 10)));

        try {
            $res = Http::withOptions(['verify' => $verify])
                ->acceptJson()
                ->withHeaders(['X-API-KEY' => $key])
                ->get($endpoint, [
                    'search' => $request->query('value'),
                    'limit' => $limit,
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
            foreach ($data as &$user) {
                if (is_array($user)) {
                    if (array_key_exists('user_id', $user)) {
                        $user['user_id'] = (string) $user['user_id'];
                    }
                    elseif (array_key_exists(0, $user)) {
                        $user[0] = (string) $user[0];
                    }
                } elseif (is_int($user) || is_float($user)) {
                    $user = (string) $user;
                }
            }
            unset($user);
            if (! is_array($data)) {
                return response()->json(
                    [
                        'error' => true,
                        'message' => 'Invalid JSON response from upstream.',
                    ],
                    502,
                );
            }

            foreach ($data as &$user) {
                if (is_array($user) && array_key_exists('user_id', $user)) {
                    $user['user_id'] = (string) $user['user_id'];
                }
            }
            unset($user);

            return response()->json($data);
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
