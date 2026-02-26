<?php

namespace App\Http\Controllers\Lootbox;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GetUserXpSummaryController extends Controller
{
    public function __invoke(Request $request, int $user)
    {
        if ($user < 1) {
            return response()->json([
                'message' => 'Bad request',
                'errors'  => ['user' => ['user must be a positive integer']],
            ], 400);
        }

        $apiRoot   = rtrim((string) config('services.genji_api.root', ''), '/');
        $apiKey    = (string) config('services.genji_api.key', '');
        $sslVerify = (bool) config('services.genji_api.verify', true);

        if ($apiRoot === '') {
            return response()->json(['message' => 'Genji API not configured'], 500);
        }

        $endpoint = $apiRoot . '/api/v3/lootbox/users/' . $user . '/xp-summary';

        try {
            $resp = Http::withHeaders([
                    'Accept'    => 'application/json',
                    'X-API-KEY' => $apiKey,
                ])
                ->withOptions([
                    'verify'  => $sslVerify,
                    'timeout' => 10,
                ])
                ->get($endpoint);

            return response()->json($resp->json() ?? [], $resp->status() ?: 502);
        } catch (\Throwable $e) {
            Log::error('XP summary upstream exception', [
                'user'  => $user,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Upstream exception',
                'error'   => $e->getMessage(),
            ], 502);
        }
    }
}