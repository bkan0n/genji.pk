<?php

namespace App\Http\Controllers\Mods\Playtests;

use App\Http\Controllers\Controller; 
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Throwable;

class DeletePlaytestVoteController extends Controller
{
    public function destroy(string $thread_id, string $user_id): JsonResponse
    {
        $cfg    = config('services.genji_api', []);
        $root   = rtrim((string) ($cfg['root'] ?? ''), '/');
        $apiKey = (string) ($cfg['key'] ?? '');
        $verify = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($root === '') {
            return response()->json([
                'message' => 'Genji API root is not configured (services.genji_api.root).',
            ], 500);
        }

        $url = "{$root}/api/v3/maps/playtests/{$thread_id}/vote/{$user_id}";

        try {
            $client = Http::withOptions(['verify' => $verify, 'timeout' => 10])->acceptJson();
            if ($apiKey !== '') {
                $client = $client->withHeaders(['X-API-KEY' => $apiKey]);
            }

            $response = $client->delete($url);

            if ($response->status() === 204 || $response->noContent()) {
                return response()->json(null, 204);
            }

            if ($response->status() === 400) {
                return response()->json([
                    'message' => 'Bad request sent to upstream API.',
                    'errors'  => $response->json() ?? $response->body(),
                ], 400);
            }

            return response()->json([
                'message'      => 'Upstream API error',
                'status'       => $response->status(),
                'upstreamBody' => $response->json() ?? $response->body(),
            ], $response->status());
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Unable to reach Genji API.',
                'error'   => $e->getMessage(),
            ], 502);
        }
    }
}