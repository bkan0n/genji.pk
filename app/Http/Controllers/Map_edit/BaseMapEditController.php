<?php

namespace App\Http\Controllers\Map_edit;

use App\Http\Controllers\Controller;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

abstract class BaseMapEditController extends Controller
{
    protected function apiRoot(): string
    {
        return rtrim((string) config('services.genji_api.root', ''), '/');
    }

    protected function apiKey(): string
    {
        return (string) config('services.genji_api.key', '');
    }

    protected function sslVerify(): bool
    {
        $verify = config('services.genji_api.verify', true);

        if (is_string($verify)) {
            $verify = filter_var($verify, FILTER_VALIDATE_BOOLEAN);
        }

        return (bool) $verify;
    }

    protected function http(): PendingRequest
    {
        return Http::withHeaders([
                'Accept'       => 'application/json',
                'Content-Type' => 'application/json',
                'X-API-Key'    => $this->apiKey(),
            ])
            ->withOptions(['verify' => $this->sslVerify()]);
    }

    protected function endpoint(string $path): string
    {
        return $this->apiRoot() . $path;
    }

    protected function missingUpstream()
    {
        return response()->json([
            'message' => 'Upstream not configured',
            'hint'    => 'Set genji_api.root and genji_api.key in your config/.env',
        ], 500);
    }

    protected function passthrough(Response $resp, ?string $location = null)
    {
        $status = $resp->status() ?: 502;

        $body = $resp->body();
        $json = null;

        if (is_string($body) && $body !== '') {
            $json = $resp->json();
        }

        $out = response()->json($json ?? (string) $body, $status);

        if ($location) {
            $out->header('Location', $location);
        }

        return $out;
    }
}
