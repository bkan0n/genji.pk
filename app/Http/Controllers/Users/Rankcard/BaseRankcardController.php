<?php

namespace App\Http\Controllers\Users\Rankcard;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

abstract class BaseRankcardController
{
    protected function apiRoot(): string
    {
        $root = (string) (Config::get('services.genji_api.root') ?? '');

        return rtrim($root, '/');
    }

    protected function apiKey(): string
    {
        return (string) (Config::get('services.genji_api.key') ?? '');
    }

    protected function apiVerify(): bool
    {
        return filter_var(Config::get('services.genji_api.verify', true), FILTER_VALIDATE_BOOLEAN);
    }

    protected function request(string $method, string $url, ?array $json = null): Response
    {
        $verify = $this->apiVerify();

        $pending = Http::withHeaders([
            'X-API-KEY' => $this->apiKey(),
            'Content-Type' => 'application/json',
        ])
            ->acceptJson()
            ->withOptions(['verify' => $verify, 'timeout' => 12]);

        return $pending->send(strtoupper($method), $url, $json ? ['json' => $json] : []);
    }

    protected function proxyOrFail(Response $resp)
    {
        if ($resp->ok()) {
            $json = $resp->json();

            return $json !== null
              ? response()->json($json, 200)
              : response($resp->body(), 200)->header(
                  'Content-Type',
                  $resp->header('Content-Type', 'application/json'),
              );
        }

        Log::warning('Rankcard upstream error', [
            'status' => $resp->status(),
            'body' => $resp->json() ?? $resp->body(),
        ]);

        return response()->json(
            [
                'detail' => 'Upstream error',
                'status_code' => $resp->status(),
                'extra' => $resp->json() ?? $resp->body(),
            ],
            502,
        );
    }
}
