<?php

namespace App\Http\Controllers\Mods\Maps;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Throwable;

class ArchiveMapsController extends Controller
{
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(['Archive', 'Unarchived'])],
            'codes' => ['nullable', 'array'],
            'codes.*' => ['string', 'max:32'],
            'code' => ['nullable', 'string', 'max:32'], // si fourni dans le body
        ]);

        // Détecter le mode et préparer ce qui part en body et en query
        $codesBody = array_values(array_filter((array) ($validated['codes'] ?? [])));
        $codeSingle = (string) ($validated['code'] ?? $request->query('code', ''));

        if (! empty($codesBody)) {
            // BULK
            $codesForBody = $codesBody;
            $codesForQuery = $codesBody; // ?code=a&code=b&...
        } elseif ($codeSingle !== '') {
            // SINGLE
            $codesForBody = [$codeSingle];
            $codesForQuery = [$codeSingle]; // ?code=single
        } else {
            return response()->json(
                ['error' => 'Provide a single code (?code or body.code) or body.codes[]'],
                422,
            );
        }

        $cfg = Config::get('services.genji_api', []);
        $apiKey = (string) ($cfg['key'] ?? '');
        $apiRoot = (string) ($cfg['root'] ?? '');
        $verify = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($apiKey === '' || $apiRoot === '') {
            return response()->json(['error' => 'Missing upstream API configuration'], 500);
        }

        $qs = implode('&', array_map(fn ($c) => 'code=' . rawurlencode($c), $codesForQuery));
        $url = rtrim($apiRoot, '/') . '/api/v3/maps/archive' . ($qs ? '?' . $qs : '');

        try {
            $resp = Http::withOptions(['verify' => $verify, 'timeout' => 20])
                ->withHeaders([
                    'X-API-KEY' => $apiKey,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->patch($url, [
                    'codes' => $codesForBody,
                    'status' => $validated['status'],
                ]);

            return response()->json($resp->json() ?: [], $resp->status());
        } catch (Throwable $e) {
            Log::error('mods.maps.archive', [
                'codesQuery' => $codesForQuery,
                'codesBody' => $codesForBody,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}
