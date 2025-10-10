<?php

declare(strict_types=1);

namespace App\Http\Controllers\Users;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use Throwable;

final class ShowUserController extends Controller
{
    public function __invoke(int $user_id): JsonResponse
    {
        $root   = rtrim((string) config('services.genji_api.root', ''), '/');
        $key    = (string) config('services.genji_api.key', '');
        $verify = (bool)   config('services.genji_api.verify', true);

        if ($root === '' || $key === '') {
            return response()->json(
                ['error' => true, 'message' => 'API configuration is missing.'],
                500
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
                        'error'    => true,
                        'message'  => "API request failed with status code {$res->status()}",
                        'response' => $res->json() ?? $res->body(),
                    ],
                    $res->status()
                );
            }

            $data = $res->json();
            if (! is_array($data)) {
                return response()->json(
                    ['error' => true, 'message' => 'Invalid JSON response from upstream.'],
                    502
                );
            }

            $overwatch = array_values(array_filter(
                (array) ($data['overwatch_usernames'] ?? []),
                fn ($v) => is_string($v) && $v !== ''
            ));

            return response()->json([
                'id'                  => (string) ($data['id'] ?? (string) $user_id),
                'global_name'         => (string) ($data['global_name'] ?? ''),
                'nickname'            => (string) ($data['nickname'] ?? ''),
                'overwatch_usernames' => $overwatch,
                'coalesced_name'      => (string) ($data['coalesced_name']
                                            ?? ($data['nickname'] ?? ($data['global_name'] ?? ''))),
                'coins'               => (int)    ($data['coins'] ?? 0),
            ]);
        } catch (Throwable $e) {
            return response()->json(
                ['error' => true, 'message' => 'Failed to fetch user: '.$e->getMessage()],
                502
            );
        }
    }
}
