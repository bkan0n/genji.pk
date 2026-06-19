<?php

namespace App\Http\Controllers\Skill;

use App\Http\Controllers\Controller;
use Illuminate\Http\Client\Response as ClientResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SkillController extends Controller
{
    public function summary(string $user_id)
    {
        $response = $this->get('/api/v3/skill/users/'.rawurlencode($user_id));
        $payload = $response->json();

        if (is_array($payload) && array_key_exists('user_id', $payload)) {
            $payload['user_id'] = (string) $payload['user_id'];
        }

        return $this->proxyResponse($response, $payload);
    }

    public function breakdown(string $user_id)
    {
        $response = $this->get('/api/v3/skill/users/'.rawurlencode($user_id).'/breakdown');

        return $this->proxyResponse($response, $response->json());
    }

    public function history(Request $request, string $user_id)
    {
        $window = trim((string) ($request->query('window') ?? $request->query('range', '')));
        $path = '/api/v3/skill/users/'.rawurlencode($user_id).'/history';

        if ($window !== '') {
            $path .= '?'.http_build_query(['window' => $window]);
        }

        $response = $this->get($path);
        $payload = $response->json();

        if (is_array($payload) && array_key_exists('user_id', $payload)) {
            $payload['user_id'] = (string) $payload['user_id'];
        }

        return $this->proxyResponse($response, $payload);
    }

    public function changes(Request $request, string $user_id)
    {
        $query = array_filter([
            'window' => trim((string) ($request->query('window') ?? $request->query('range', ''))),
            'limit' => $request->query('limit'),
            'offset' => $request->query('offset'),
        ], fn ($value): bool => $value !== null && $value !== '');

        $path = '/api/v3/skill/users/'.rawurlencode($user_id).'/changes';

        if ($query !== []) {
            $path .= '?'.http_build_query($query);
        }

        $response = $this->get($path);

        return $this->proxyResponse($response, $response->json());
    }

    public function changeDetail(string $user_id, int $change_id)
    {
        $response = $this->get(
            '/api/v3/skill/users/'.rawurlencode($user_id).'/changes/'.rawurlencode((string) $change_id),
        );

        return $this->proxyResponse($response, $response->json());
    }

    public function tiers()
    {
        $response = $this->get('/api/v3/skill/tiers');

        return $this->proxyResponse($response, $response->json());
    }

    public function config()
    {
        $response = $this->get('/api/v3/skill/config');

        return $this->proxyResponse($response, $response->json());
    }

    private function get(string $path): ClientResponse
    {
        $apiRoot = rtrim((string) config('services.genji_api.root', ''), '/');
        $apiKey = (string) config('services.genji_api.key', '');
        $sslVerify = (bool) config('services.genji_api.verify', true);

        if ($apiRoot === '') {
            abort(response()->json(['message' => 'Genji API not configured'], 500));
        }

        try {
            return Http::withHeaders([
                'Accept' => 'application/json',
                'X-API-KEY' => $apiKey,
            ])
                ->withOptions(['verify' => $sslVerify, 'timeout' => 12])
                ->get($apiRoot.$path);
        } catch (\Throwable $e) {
            Log::error('Skill API upstream exception', [
                'path' => $path,
                'error' => $e->getMessage(),
            ]);

            abort(response()->json([
                'message' => 'Upstream exception',
                'error' => $e->getMessage(),
            ], 502));
        }
    }

    private function proxyResponse(ClientResponse $response, mixed $payload)
    {
        if ($payload === null && trim($response->body()) !== 'null') {
            $payload = ['message' => $response->body()];
        }

        return response()->json($payload ?? [], $response->status() ?: 502);
    }
}
