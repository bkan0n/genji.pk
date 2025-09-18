<?php

namespace App\Http\Controllers\Mods\Verifications;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Throwable;

class CompletionSubmissionController extends Controller
{
    private const JS_MAX_SAFE_INT = 9007199254740991;

    public function show(Request $request, $record_id): JsonResponse
    {
        $request->merge(['record_id' => (string) $record_id]);

        $data = $request->validate([
            'record_id' => ['required', 'string', 'regex:/^\d+$/'],
        ]);

        try {
            $res = $this->client()->get("/api/v3/completions/{$data['record_id']}/submission");
            $json = $this->decodePreservingBigints($res->body());

            $json = $this->stringifyJsUnsafeIntegers($json);

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

    private function stringifyJsUnsafeIntegers($data, ?string $parentKey = null)
    {
        if (is_int($data)) {
            if ($data > self::JS_MAX_SAFE_INT) {
                return (string) $data;
            }
            if ($parentKey !== null && preg_match('/(^id$|_id$)/i', $parentKey)) {
                return (string) $data;
            }

            return $data;
        }

        if (is_string($data)) {
            return $data;
        }

        if (is_array($data)) {
            $out = [];
            foreach ($data as $k => $v) {
                $converted = $this->stringifyJsUnsafeIntegers($v, is_string($k) ? $k : null);

                if (is_string($k) && preg_match('/(^id$|_id$)/i', $k)) {
                    if (is_int($converted)) {
                        $converted = (string) $converted;
                    } elseif (is_string($converted) && ctype_digit($converted)) {
                    }
                }

                if (is_int($converted) && $converted > self::JS_MAX_SAFE_INT) {
                    $converted = (string) $converted;
                }

                $out[$k] = $converted;
            }

            return $out;
        }

        return $data;
    }
}
