<?php

declare(strict_types=1);

namespace App\Http\Controllers\Users;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use Throwable;

final class GetUserDashboardCompletionsController extends Controller
{
    public function __invoke(int $user_id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'page_size' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'page_number' => ['sometimes', 'integer', 'min:1', 'max:1000000'],
        ]);

        $pageSize = (int) ($validated['page_size'] ?? 10);
        $pageNumber = (int) ($validated['page_number'] ?? 1);

        $root = rtrim((string) config('services.genji_api.root', ''), '/');
        $key = (string) config('services.genji_api.key', '');
        $verify = (bool) config('services.genji_api.verify', true);

        if ($root === '' || $key === '') {
            return response()->json(
                [
                    'error' => true,
                    'message' => 'API configuration is missing.',
                ],
                500
            );
        }

        $endpoint = "{$root}/api/v3/completions/dashboard";

        try {
            $res = Http::withOptions(['verify' => $verify])
                ->acceptJson()
                ->asJson()
                ->withHeaders(['X-API-KEY' => $key])
                ->get($endpoint, [
                    'user_id' => $user_id,
                    'page_size' => $pageSize,
                    'page_number' => $pageNumber,
                ]);

            if (! $res->successful()) {
                return response()->json(
                    [
                        'error' => true,
                        'message' => "API request failed with status code {$res->status()}",
                        'response' => $res->json() ?? $res->body(),
                    ],
                    $res->status()
                );
            }

            $data = $res->json();

            return response()->json(is_array($data) ? $data : []);
        } catch (Throwable $e) {
            return response()->json(
                [
                    'error' => true,
                    'message' => 'Failed to fetch dashboard completions: ' . $e->getMessage(),
                ],
                502
            );
        }
    }
}