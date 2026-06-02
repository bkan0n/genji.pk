<?php

namespace App\Http\Controllers\Tournament;

use App\Http\Controllers\Controller;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response as HttpResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

abstract class BaseTournamentController extends Controller
{
    protected const BASE_PATH = '/api/v3/tournaments';

    protected function proxy(
        string $method,
        string $path,
        string $logKey,
        array $payload = [],
        array $query = [],
        array $context = [],
    ): JsonResponse|Response {
        $config = $this->upstreamConfig();

        if ($config === null) {
            return response()->json(['error' => 'Missing upstream API configuration'], 500);
        }

        $url = rtrim($config['root'], '/') . self::BASE_PATH . $path;

        try {
            $response = $this->sendRequest(
                $this->makeClient($config['key'], $config['verify']),
                $method,
                $url,
                $payload,
                $query,
            );

            return $this->forwardResponse($response);
        } catch (Throwable $e) {
            Log::error($logKey, array_merge($context, [
                'path' => $path,
                'error' => $e->getMessage(),
            ]));

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    protected function normalizePayload(array $payload): array
    {
        foreach ($payload as $key => $value) {
            if (is_array($value)) {
                $payload[$key] = $this->normalizePayload($value);
                continue;
            }

            if ($value !== null && $this->shouldStringifyIntegerKey((string) $key)) {
                $payload[$key] = (string) $value;
            }
        }

        return $payload;
    }

    private function upstreamConfig(): ?array
    {
        $cfg = Config::get('services.genji_api', []);
        $apiKey = (string) ($cfg['key'] ?? '');
        $apiRoot = (string) ($cfg['root'] ?? '');
        $verify = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($apiKey === '' || $apiRoot === '') {
            return null;
        }

        return [
            'key' => $apiKey,
            'root' => $apiRoot,
            'verify' => $verify,
        ];
    }

    private function makeClient(string $apiKey, bool $verify): PendingRequest
    {
        return Http::withOptions(['verify' => $verify, 'timeout' => 15])
            ->withHeaders([
                'X-API-KEY' => $apiKey,
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ]);
    }

    private function sendRequest(
        PendingRequest $client,
        string $method,
        string $url,
        array $payload,
        array $query,
    ): HttpResponse {
        return match (strtolower($method)) {
            'get' => $client->get($url, $query),
            'post' => $client->post($this->withQuery($url, $query), $payload),
            'patch' => $client->patch($this->withQuery($url, $query), $payload),
            'delete' => empty($payload)
                ? $client->delete($this->withQuery($url, $query))
                : $client->send('DELETE', $this->withQuery($url, $query), ['json' => $payload]),
            default => throw new \InvalidArgumentException("Unsupported method [$method]"),
        };
    }

    private function withQuery(string $url, array $query): string
    {
        $query = array_filter($query, static fn ($value) => $value !== null && $value !== '');

        if ($query === []) {
            return $url;
        }

        return $url . '?' . http_build_query($query);
    }

    private function forwardResponse(HttpResponse $response): JsonResponse|Response
    {
        if ($response->status() === 204) {
            return response()->noContent();
        }

        if (! $response->body()) {
            return response()->json([], $response->status());
        }

        $contentType = strtolower($response->header('Content-Type', 'application/json'));

        if (! str_contains($contentType, 'application/json')) {
            return response($response->body(), $response->status())->header(
                'Content-Type',
                $response->header('Content-Type', 'text/plain'),
            );
        }

        $payload = $response->json();

        if (! is_array($payload)) {
            return response()->json($payload, $response->status());
        }

        return response()->json($this->normalizePayload($payload), $response->status());
    }

    private function shouldStringifyIntegerKey(string $key): bool
    {
        return $key === 'user_id'
            || $key === 'winner_user_id'
            || $key === 'champion_role_id';
    }
}
