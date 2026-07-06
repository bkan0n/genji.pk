<?php

namespace App\Http\Controllers\Mods\Completions;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Throwable;

class ModerateCompletionController extends Controller
{
    public function update(Request $request, $record_id): JsonResponse
    {
        $request->merge(['record_id' => (string) $record_id]);
        $request->validate([
            'record_id' => ['required', 'string', 'regex:/^\d+$/'],
        ]);

        $payload = $request->validate([
            'moderated_by' => ['required', 'string', 'regex:/^\d+$/'],
            'time' => ['nullable', 'numeric'],
            'time_change_reason' => ['nullable', 'string'],
            'verified' => ['nullable', 'boolean'],
            'verification_reason' => ['nullable', 'string'],
            'mark_suspicious' => ['nullable', 'boolean'],
            'unmark_suspicious' => ['nullable', 'boolean'],
            'suspicious_context' => ['nullable', 'string'],
            'suspicious_flag_type' => ['nullable', 'in:Cheating,Scripting'],
        ]);

        // Upstream types moderated_by as integer; the client sends a digit-string.
        $payload['moderated_by'] = (int) $payload['moderated_by'];

        try {
            $res = $this->client()->put(
                "/api/v3/completions/{$request->input('record_id')}/moderate",
                $payload,
            );

            return response()->json($this->decodePreservingBigints($res->body()), $res->status());
        } catch (Throwable $e) {
            return response()->json(
                ['error' => 'Upstream unavailable', 'detail' => $e->getMessage()],
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
            $http = $http->withHeaders(['X-API-Key' => $key, 'x-api-key' => $key]);
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
