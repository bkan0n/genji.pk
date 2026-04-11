<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response as HttpResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

abstract class BaseMovementTechController extends Controller
{
    protected function proxy(string $method, string $path, string $logKey, array $payload = [], array $context = []): JsonResponse|Response
    {
        $config = $this->upstreamConfig();

        if ($config === null) {
            return response()->json(['error' => 'Missing upstream API configuration'], 500);
        }

        $url = rtrim($config['root'], '/') . $path;

        try {
            $response = $this->sendRequest(
                $this->makeClient($config['key'], $config['verify']),
                $method,
                $url,
                $payload,
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

    private function sendRequest(PendingRequest $client, string $method, string $url, array $payload): HttpResponse
    {
        return match (strtolower($method)) {
            'get' => $client->get($url, $payload),
            'post' => $client->post($url, $payload),
            'put' => $client->put($url, $payload),
            'patch' => $client->patch($url, $payload),
            'delete' => empty($payload)
                ? $client->delete($url)
                : $client->send('DELETE', $url, ['json' => $payload]),
            default => throw new \InvalidArgumentException("Unsupported method [$method]"),
        };
    }

    private function forwardResponse(HttpResponse $response): JsonResponse|Response
    {
        if ($response->status() === 204) {
            return response()->noContent();
        }

        if (! $response->body()) {
            return response()->json([], $response->status());
        }

        $payload = $response->json();

        if (! is_array($payload)) {
            return response()->json([], $response->status());
        }

        return response()->json($this->normalizeMovementTechPayload($payload), $response->status());
    }

    private function normalizeMovementTechPayload(array $payload): array
    {
        if (array_key_exists('techniques', $payload) && is_array($payload['techniques'])) {
            $payload['techniques'] = $this->normalizeTechniqueCollection($payload['techniques']);

            return $payload;
        }

        if ($this->looksLikeTechnique($payload)) {
            return $this->normalizeTechnique($payload);
        }

        return $payload;
    }

    private function normalizeTechniqueCollection(array $techniques): array
    {
        $normalized = [];
        $indexByKey = [];

        foreach ($techniques as $technique) {
            if (! is_array($technique)) {
                $normalized[] = $technique;
                continue;
            }

            $key = $this->techniqueKey($technique);

            if ($key === null || ! array_key_exists($key, $indexByKey)) {
                $normalized[] = $this->normalizeTechnique($technique);

                if ($key !== null) {
                    $indexByKey[$key] = array_key_last($normalized);
                }

                continue;
            }

            $existingIndex = $indexByKey[$key];
            $normalized[$existingIndex] = $this->normalizeTechnique(
                $this->mergeTechniquePayloads($normalized[$existingIndex], $technique)
            );
        }

        return array_values($normalized);
    }

    private function mergeTechniquePayloads(array $base, array $incoming): array
    {
        $merged = $base;

        foreach ($incoming as $key => $value) {
            if (in_array($key, ['tips', 'videos'], true)) {
                $baseRows = is_array($merged[$key] ?? null) ? $merged[$key] : [];
                $incomingRows = is_array($value) ? $value : [];
                $merged[$key] = array_merge($baseRows, $incomingRows);
                continue;
            }

            if (! array_key_exists($key, $merged) || $merged[$key] === null || $merged[$key] === '') {
                $merged[$key] = $value;
            }
        }

        return $merged;
    }

    private function looksLikeTechnique(array $payload): bool
    {
        if (array_key_exists('instructions', $payload)) {
            return true;
        }

        return array_key_exists('tips', $payload)
            || array_key_exists('videos', $payload)
            || array_key_exists('display_order', $payload);
    }

    private function techniqueKey(array $technique): ?string
    {
        if (isset($technique['id']) && is_numeric($technique['id'])) {
            return 'id:' . (int) $technique['id'];
        }

        if (isset($technique['name']) && $technique['name'] !== '') {
            return 'name:' . (string) $technique['name'];
        }

        return null;
    }

    private function normalizeTechnique(array $technique): array
    {
        if (array_key_exists('tips', $technique) && is_array($technique['tips'])) {
            $technique['tips'] = $this->dedupeMovementTechRows(
                $technique['tips'],
                ['id', 'text', 'sort_order']
            );
        }

        if (array_key_exists('videos', $technique) && is_array($technique['videos'])) {
            $technique['videos'] = $this->dedupeMovementTechRows(
                $technique['videos'],
                ['id', 'url', 'caption', 'sort_order']
            );
        }

        return $technique;
    }

    private function dedupeMovementTechRows(array $rows, array $signatureFields): array
    {
        $unique = [];
        $seen = [];

        foreach ($rows as $row) {
            if (! is_array($row)) {
                $unique[] = $row;
                continue;
            }

            $key = $this->movementTechRowKey($row, $signatureFields);

            if (isset($seen[$key])) {
                continue;
            }

            $seen[$key] = true;
            $unique[] = $row;
        }

        return array_values($unique);
    }

    private function movementTechRowKey(array $row, array $signatureFields): string
    {
        if (isset($row['id']) && is_numeric($row['id'])) {
            return 'id:' . (int) $row['id'];
        }

        $parts = [];

        foreach ($signatureFields as $field) {
            $parts[] = json_encode($row[$field] ?? null, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        return 'sig:' . sha1(implode('|', $parts));
    }
}
