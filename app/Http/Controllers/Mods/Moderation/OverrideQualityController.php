<?php

namespace App\Http\Controllers\Mods\Moderation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Throwable;

class OverrideQualityController extends Controller
{
    public function __invoke(Request $request, string $code)
    {
        $payload = $request->validate([
            'value' => ['required', 'integer', 'min:1', 'max:6'],
        ]);

        $root = rtrim(config('services.genji_api.root', ''), '/');
        $key = (string) config('services.genji_api.key', '');
        $verify = filter_var(config('services.genji_api.verify', true), FILTER_VALIDATE_BOOL);

        if ($root === '') {
            return response()->json(
                [
                    'message' => 'Genji API root is not configured (services.genji_api.root).',
                ],
                500,
            );
        }

        try {
            $http = Http::withOptions(['verify' => $verify])->withHeaders(
                array_filter([
                    'X-API-KEY' => $key ?: null,
                    'Authorization' => $key ? "Bearer {$key}" : null,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ]),
            );

            $upstream = $http->post("{$root}/api/v3/maps/{$code}/quality", $payload);

            if ($upstream->status() === 201) {
                $resp = response()->noContent(201);
                if ($loc = $upstream->header('Location')) {
                    $resp->header('Location', $loc);
                }

                return $resp;
            }

            $body = $upstream->json();

            return $body !== null
              ? response()->json($body, $upstream->status())
              : response($upstream->body(), $upstream->status());
        } catch (Throwable $e) {
            return response()->json(
                [
                    'message' => 'Upstream request failed.',
                    'error' => $e->getMessage(),
                ],
                502,
            );
        }
    }
}
