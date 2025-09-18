<?php

namespace App\Http\Controllers\Maps\Playtests;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Throwable;

class PlaytestVoteController extends Controller
{
    public function store(Request $request, string $thread_id, string $user_id): JsonResponse
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'min:4', 'max:6', 'regex:/^[A-Z0-9]+$/'],
            'difficulty' => ['required', 'numeric'],
        ]);

        $cfg = config('services.genji_api', []);
        $root = rtrim((string) ($cfg['root'] ?? ''), '/');
        $apiKey = (string) ($cfg['key'] ?? '');
        $verify = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($root === '') {
            return response()->json(
                [
                    'message' => 'Genji API root is not configured (services.genji_api.root).',
                ],
                500,
            );
        }

        $url = "{$root}/api/v3/maps/playtests/{$thread_id}/vote/{$user_id}";

        try {
            $client = Http::withOptions([
                'verify' => $verify,
                'timeout' => 10,
            ])->acceptJson();

            if ($apiKey !== '') {
                $client = $client->withHeaders(['X-API-KEY' => $apiKey]);
            }

            $response = $client->post($url, $data);

            if ($response->status() === 201 || $response->successful()) {
                $body = $response->json();

                return response()->json($body ?? ['message' => 'Document created'], 201);
            }

            if ($response->status() === 400) {
                return response()->json(
                    [
                        'message' => 'Bad request sent to upstream API.',
                        'errors' => $response->json() ?? $response->body(),
                    ],
                    400,
                );
            }

            return response()->json(
                [
                    'message' => 'Upstream API error',
                    'status' => $response->status(),
                    'upstreamBody' => $response->json() ?? $response->body(),
                ],
                $response->status(),
            );
        } catch (Throwable $e) {
            return response()->json(
                [
                    'message' => 'Unable to reach Genji API.',
                    'error' => $e->getMessage(),
                ],
                502,
            );
        }
    }
}
