<?php

declare(strict_types=1);

namespace App\Http\Controllers\Users;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use Throwable;

final class GetUserController extends Controller
{
    public function __invoke(int $user_id): JsonResponse
    {
        $root = rtrim((string) config('services.genji_api.root', ''), '/');
        $key = (string) config('services.genji_api.key', '');
        $verify = (bool) config('services.genji_api.verify', true);

        if ($root === '' || $key === '') {
            return response()->json(
                ['error' => true, 'message' => 'API configuration is missing.'],
                500,
            );
        }

        $endpoint = "{$root}/api/v3/users/{$user_id}";

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
                    ['error' => true, 'message' => 'Invalid JSON response from upstream.'],
                    502,
                );
            }

            $globalName = trim((string) ($data['global_name'] ?? ''));
            $nickname = trim((string) ($data['nickname'] ?? ''));

            $overwatchUsernames = array_values(array_filter(
                (array) ($data['overwatch_usernames'] ?? []),
                static fn ($value): bool => is_string($value) && trim($value) !== '',
            ));

            $coalescedName = $overwatchUsernames[0] ?? ($nickname !== '' ? $nickname : $globalName);

            return response()->json([
                'id' => (int) ($data['id'] ?? $user_id),
                'global_name' => $globalName,
                'nickname' => $nickname,
                'overwatch_usernames' => $overwatchUsernames,
                'coalesced_name' => $coalescedName,
                'coins' => (int) ($data['coins'] ?? 0),
            ]);
        } catch (Throwable $e) {
            return response()->json(
                ['error' => true, 'message' => 'Failed to fetch user: ' . $e->getMessage()],
                502,
            );
        }
    }
}

