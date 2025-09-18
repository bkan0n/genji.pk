<?php

namespace App\Http\Controllers\Lootbox;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Routing\Controller as LaravelController;
use Illuminate\Support\Facades\Http;

abstract class BaseLootboxController extends LaravelController
{
    protected function http(): PendingRequest
    {
        $root = rtrim((string) config('services.genji_api.root'), '/');
        $apiKey = (string) config('services.genji_api.key');

        $verify = config('services.genji_api.verify', true);
        if (is_string($verify)) {
            $verify = filter_var($verify, FILTER_VALIDATE_BOOLEAN);
        }

        return Http::baseUrl($root)
            ->withHeaders([
                'Accept' => 'application/json',
                'X-API-Key' => $apiKey,
            ])
            ->withOptions(['verify' => $verify]);
    }

    protected function passthrough($response)
    {
        return response()->json($response->json(), $response->status());
    }
}
