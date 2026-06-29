<?php

namespace App\Http\Controllers\Mods\Quests;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ListQuestsController extends Controller
{
    public function __invoke(Request $request)
    {
        $apiRoot   = rtrim((string) config('services.genji_api.root', ''), '/');
        $apiKey    = (string) config('services.genji_api.key', '');
        $sslVerify = (bool) config('services.genji_api.verify', true);

        if ($apiRoot === '') {
            return response()->json(['message' => 'Genji API not configured'], 500);
        }

        // Forward only the supported optional filters.
        $query = array_filter(
            $request->only(['is_active', 'difficulty', 'q']),
            static fn ($v) => $v !== null && $v !== ''
        );

        $endpoint = $apiRoot . '/api/v3/store/admin/quests';

        try {
            $resp = Http::withHeaders([
                    'Accept'    => 'application/json',
                    'X-API-KEY' => $apiKey,
                ])
                ->withOptions(['verify' => $sslVerify, 'timeout' => 12])
                ->get($endpoint, $query);

            return response()->json($resp->json() ?? [], $resp->status() ?: 502);
        } catch (\Throwable $e) {
            Log::error('List quests upstream exception', ['error' => $e->getMessage()]);

            return response()->json(['message' => 'Upstream exception', 'error' => $e->getMessage()], 502);
        }
    }
}
