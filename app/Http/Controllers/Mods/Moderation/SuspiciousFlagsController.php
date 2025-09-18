<?php

namespace App\Http\Controllers\Mods\Moderation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Client\Response as HttpResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;
use Throwable;

class SuspiciousFlagsController extends Controller
{
    private const JS_SAFE_MAX_INT = 9007199254740991;

    public function index(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => ['required', 'string', 'regex:/^\d+$/'],
        ]);

        try {
            $res = $this->client()->get('/api/v3/completions/suspicious', $data);
            $json = $this->decodeUpstreamPreserveBigInts($res);

            return response()->json(is_string($json) ? ['raw' => $json] : $json ?? [], $res->status());
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

    public function store(Request $request): JsonResponse
    {
        $input = $request->only([
            'context',
            'flag_type',
            'flagged_by',
            'message_id',
            'verification_id',
        ]);
        foreach (['message_id', 'verification_id'] as $k) {
            if (($input[$k] ?? '') === '') {
                $input[$k] = null;
            }
        }

        $payload = validator($input, [
            'context' => ['required', 'string'],
            'flag_type' => ['required', 'string', Rule::in(['Cheating', 'Scripting'])],
            'flagged_by' => ['required', 'string', 'regex:/^\d+$/'],
            'message_id' => ['nullable', 'string', 'regex:/^\d+$/'],
            'verification_id' => ['nullable', 'string', 'regex:/^\d+$/'],
        ])->validate();

        try {
            $res = $this->client()->post('/api/v3/completions/suspicious', $payload);
            $json = $this->decodeUpstreamPreserveBigInts($res);

            return response()->json(is_string($json) ? ['raw' => $json] : $json ?? [], $res->status());
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

    private function stringifyJsUnsafeIntegers($value)
    {
        if (is_array($value)) {
            foreach ($value as $k => $v) {
                $value[$k] = $this->stringifyJsUnsafeIntegers($v);
            }

            return $value;
        }
        if (is_int($value)) {
            if ($value > self::JS_SAFE_MAX_INT || $value < -self::JS_SAFE_MAX_INT) {
                return (string) $value;
            }
        }

        return $value;
    }

    private function decodeUpstreamPreserveBigInts(HttpResponse $res)
    {
        $body = $res->body();
        $data = json_decode($body, true, 512, JSON_BIGINT_AS_STRING);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return $body;
        }

        return $this->stringifyJsUnsafeIntegers($data);
    }
}
