<?php

namespace App\Http\Controllers\Utilities;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class LogMapClickController extends Controller
{
    public function __invoke(Request $request)
    {
        $input = $request->all();
        $payload = [
            'code'       => strtoupper((string)($input['code'] ?? '')),
            'ip_address' => (string)($input['ip_address'] ?? $this->resolveClientIp($request)),
            'source'     => (string)($input['source'] ?? 'web'),
        ];
        if (isset($input['user_id']) && $input['user_id'] !== '' && $input['user_id'] !== null) {
            $payload['user_id'] = (int) $input['user_id'];
        }

        $request->merge($payload);
        $validated = $request->validate([
            'code'       => ['required', 'string', 'min:4', 'max:6', 'regex:/^[A-Z0-9]+$/'],
            'ip_address' => ['required', 'ip'],
            'source'     => ['required', 'in:web,bot'],
            'user_id'    => ['nullable', 'integer'],
        ], [
            'code.regex' => 'The code must contain only A–Z and 0–9.',
        ]);

        $cfg    = Config::get('services.genji_api', []);
        $apiKey = (string) ($cfg['key'] ?? '');
        $apiRoot = (string) ($cfg['root'] ?? '');
        $verify  = filter_var($cfg['verify'] ?? true, FILTER_VALIDATE_BOOLEAN);

        if ($apiKey === '' || $apiRoot === '') {
            return response()->json(['error' => 'Missing upstream API configuration'], 500);
        }

        $url = $apiRoot . '/api/v3/utilities/log-map-click';

        try {
            $resp = Http::withOptions(['verify' => $verify, 'timeout' => 15])
                ->withHeaders([
                    'X-API-KEY'     => $apiKey,
                    'Accept'        => 'application/json',
                    'Content-Type'  => 'application/json',
                ])
                ->post($url, $validated);

            $data = $resp->json();
            $data = is_array($data) ? $data : [];

            $out = response()->json($data, $resp->status());

            if ($location = $resp->header('Location')) {
                $out->header('Location', $location);
            }

            return $out;
        } catch (Throwable $e) {
            Log::error('utilities.log_map_click', [
                'code'  => $validated['code'] ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    private function resolveClientIp(Request $request): string
    {
        if ($v = $request->header('CF-Connecting-IP')) {
            return trim(explode(',', $v)[0]);
        }
        if ($v = $request->header('X-Forwarded-For')) {
            return trim(explode(',', $v)[0]);
        }
        if ($v = $request->header('X-Real-IP')) {
            return trim($v);
        }
        return (string) $request->ip();
    }
}