<?php

namespace App\Http\Controllers\Maps;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TrendingMapsController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $allowed = [1, 3, 5, 10, 15, 20, 25];
        $limit   = (int) $request->query('limit', 10);

        if (! in_array($limit, $allowed, true)) {
            return response()->json([
                'message' => 'Invalid "limit". Allowed: ' . implode(', ', $allowed),
            ], 422);
        }

        $svc    = config('services.genji_api', []);
        $root   = rtrim((string) ($svc['root'] ?? ''), '/');
        $key    = (string) ($svc['key'] ?? '');
        $verify = filter_var($svc['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($root === '') {
            return response()->json(['message' => 'Genji API root not configured'], 500);
        }

        $url = "{$root}/api/v3/maps/trending?limit={$limit}";

        $headers = [
            'Accept'       => 'application/json',
        ];
        if ($key !== '') {
            $headers['Authorization'] = 'Bearer ' . $key;
            $headers['X-API-Key']     = $key;
        }

        try {
            $resp = Http::withHeaders($headers)
                ->withOptions(['verify' => $verify, 'timeout' => 8])
                ->get($url);

            if (! $resp->successful()) {
                return response()->json([
                    'message' => 'Upstream error',
                    'status'  => $resp->status(),
                    'body'    => $resp->json() ?? $resp->body(),
                ], $resp->status() ?: 502);
            }

            return response()->json($resp->json(), 200);

        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Failed to contact upstream service',
            ], 502);
        }
    }
}