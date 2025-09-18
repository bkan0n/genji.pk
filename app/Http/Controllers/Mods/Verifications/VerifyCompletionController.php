<?php

namespace App\Http\Controllers\Mods\Verifications;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Throwable;

class VerifyCompletionController extends Controller
{
    public function update(Request $request, $record_id): JsonResponse
    {
        $request->merge(['record_id' => (string) $record_id]);

        $request->validate([
            'record_id' => ['required', 'string', 'regex:/^\d+$/'],
        ]);

        $payload = $request->validate([
            'verified' => ['required', 'boolean'],
            'verified_by' => ['required', 'string', 'regex:/^\d+$/'],
            'reason' => ['nullable', 'string'],
        ]);

        try {
            $res = $this->client()->put(
                "/api/v3/completions/{$request->input('record_id')}/verification",
                $payload,
            );
            $json = $this->decodePreservingBigints($res->body());

            return response()->json($json, $res->status());
        } catch (Throwable $e) {
            return response()->json(
                [
                    'error' => 'Upstream unavailable',
                    'detail' => $e->getMessage(),
                ],
                502,
            );
        }
    }

    protected function client()
    {
        $base = rtrim((string) config('services.genji_api.root'), '/');
        $verify = (bool) config('services.genji_api.verify', true);
        $key = (string) config('services.genji_api.key', '');

        $http = Http::withOptions(['verify' => $verify])->acceptJson();
        if ($base !== '') {
            $http = $http->baseUrl($base);
        }
        if ($key !== '') {
            $http = $http->withHeaders([
                'X-API-Key' => $key,
                'x-api-key' => $key,
            ]);
        }

        return $http;
    }

    protected function decodePreservingBigints(string $body)
    {
        if ($body === '') {
            return [];
        }
        try {
            return json_decode($body, true, 512, JSON_BIGINT_AS_STRING | JSON_THROW_ON_ERROR);
        } catch (Throwable $e) {
            return [];
        }
    }
}
