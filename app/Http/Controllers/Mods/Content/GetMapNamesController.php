<?php

declare(strict_types=1);

namespace App\Http\Controllers\Mods\Content;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Proxies the moderator dashboard's "list all map names" request to the upstream
 * genji API. The browser cannot call the upstream directly (it has no X-API-KEY),
 * so this controller injects the server-side key — mirroring every other mods route.
 *
 * Upstream: GET {root}/api/v3/utilities/map-names → bare JSON array of strings.
 */
final class GetMapNamesController extends Controller
{
    public function __invoke(): JsonResponse
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

        try {
            $res = Http::withOptions(['verify' => $verify, 'timeout' => 15])
                ->acceptJson()
                ->withHeaders(['X-API-KEY' => $key])
                ->get("{$root}/api/v3/utilities/map-names");

            if (! $res->successful()) {
                return response()->json(
                    ['error' => true, 'message' => "API request failed with status code {$res->status()}"],
                    $res->status(),
                );
            }

            $payload = $res->json();

            if (! is_array($payload)) {
                return response()->json(
                    ['error' => true, 'message' => 'Invalid JSON response from upstream.'],
                    502,
                );
            }

            // Upstream returns a bare array of strings; pass it through verbatim,
            // dropping any non-string entries defensively.
            $names = array_values(array_filter(
                $payload,
                static fn ($v) => is_string($v),
            ));

            return response()->json($names);
        } catch (Throwable $e) {
            Log::warning('mods.content.maps.names', ['error' => $e->getMessage()]);

            return response()->json(
                ['error' => true, 'message' => 'Failed to fetch data from the API.'],
                502,
            );
        }
    }
}
