<?php

namespace App\Http\Controllers\Maps\Playtests;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Throwable;

class PlaytestVoteController extends Controller
{
    public function index(string $thread_id): JsonResponse
    {
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

        $url = "{$root}/api/v3/maps/playtests/{$thread_id}/votes";

        try {
            $client = Http::withOptions([
                'verify' => $verify,
                'timeout' => 10,
            ])->acceptJson();

            if ($apiKey !== '') {
                $client = $client->withHeaders(['X-API-KEY' => $apiKey]);
            }

            $response = $client->get($url);

            if ($response->successful()) {
                $body = $response->json() ?? ['votes' => []];

                if (isset($body['votes']) && is_array($body['votes'])) {
                    foreach ($body['votes'] as &$vote) {
                        if (is_array($vote) && array_key_exists('user_id', $vote)) {
                            $vote['user_id'] = (string) $vote['user_id'];
                        }
                    }
                    unset($vote);
                }

                return response()->json($body, $response->status());
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

    public function store(Request $request, string $thread_id, string $user_id): JsonResponse
    {
        $data = $request->validate([
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
