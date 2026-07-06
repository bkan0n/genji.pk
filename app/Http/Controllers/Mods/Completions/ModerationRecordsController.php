<?php

namespace App\Http\Controllers\Mods\Completions;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Throwable;

class ModerationRecordsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['nullable', 'string', 'max:6'],
            'user_id' => ['nullable', 'string', 'regex:/^\d+$/'],
            'verification_status' => ['nullable', 'in:Verified,Unverified,All'],
            'latest_only' => ['nullable', 'in:true,false,1,0'],
            'page_size' => ['nullable', 'integer', 'min:1', 'max:100'],
            'page_number' => ['nullable', 'integer', 'min:1'],
        ]);

        $query = [
            'verification_status' => $validated['verification_status'] ?? 'All',
            'latest_only' => $request->boolean('latest_only', true),
            'page_size' => (int) ($validated['page_size'] ?? 20),
            'page_number' => (int) ($validated['page_number'] ?? 1),
        ];
        if (! empty($validated['code'])) {
            $query['code'] = strtoupper($validated['code']);
        }
        if (! empty($validated['user_id'])) {
            $query['user_id'] = $validated['user_id'];
        }

        try {
            $res = $this->client()->get('/api/v3/completions/moderation/records', $query);

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
