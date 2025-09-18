<?php

declare(strict_types=1);

namespace App\Http\Controllers\Users\Overwatch;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use Throwable;

final class ReplaceOverwatchUsernamesController extends Controller
{
    public function __invoke(int $user_id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'usernames' => ['required', 'array', 'min:1'],
            'usernames.*.username' => ['required', 'string', 'max:64'],
            'usernames.*.is_primary' => ['required', 'boolean'],
        ]);

        $items = array_map(
            fn (array $u) => [
                'username' => trim((string) $u['username']),
                'is_primary' => (bool) $u['is_primary'],
            ],
            $validated['usernames'],
        );

        $primaryCount = 0;
        foreach ($items as $u) {
            if ($u['is_primary'] === true) {
                $primaryCount++;
            }
        }
        if ($primaryCount !== 1) {
            return response()->json(
                [
                    'error' => true,
                    'message' => 'Exactly one entry must have is_primary=true.',
                ],
                422,
            );
        }

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
                ->asJson()
                ->withHeaders(['X-API-KEY' => $key])
                ->put($endpoint, ['usernames' => $items]);

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

            return response()->json(is_array($data) ? $data : (object) []);
        } catch (Throwable $e) {
            return response()->json(
                [
                    'error' => true,
                    'message' => 'Failed to replace Overwatch usernames: ' . $e->getMessage(),
                ],
                502,
            );
        }
    }
}
