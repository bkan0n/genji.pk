<?php

namespace App\Http\Controllers\Utilities;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;

class LogMapClickController extends Controller
{
    public function store(Request $request)
    {
        $ip = $this->resolveClientIp($request);
        $merged = array_merge(['ip_address' => $ip, 'source' => 'web'], $request->all());

        $v = Validator::make($merged, [
            'code'       => ['required', 'string', 'min:4', 'max:6', 'regex:/^[A-Z0-9]+$/'],
            'ip_address' => ['required', 'ip'],
            'user_id'    => ['nullable', 'regex:/^\d+$/'],
            'source'     => ['nullable', 'in:web,bot'],
        ], [
            'code.regex' => 'The code must contain only A–Z and 0–9.',
        ]);

        if ($v->fails()) {
            return response()->json([
                'message' => 'Bad request',
                'errors'  => $v->errors(),
            ], 400);
        }

        $data = $v->validated();
        $data['source'] = $data['source'] ?? 'web';

        if (array_key_exists('user_id', $data) && $data['user_id'] !== null && $data['user_id'] !== '') {
            $data['user_id'] = (int) $data['user_id'];
        } else {
            $data['user_id'] = null;
        }

        $apiRoot   = rtrim((string) config('genji_api.root', ''), '/');
        $apiKey    = (string) config('genji_api.key', '');
        $sslVerify = (bool) config('genji_api.verify', true);

        if ($apiRoot !== '') {
            $endpoint = $apiRoot . '/api/v3/utilities/log-map-click';

            try {
                $resp = Http::withHeaders([
                        'Accept'       => 'application/json',
                        'Content-Type' => 'application/json',
                        'X-API-KEY'    => $apiKey,
                    ])
                    ->withOptions(['verify' => $sslVerify])
                    ->post($endpoint, [
                        'code'       => $data['code'],
                        'ip_address' => $data['ip_address'],
                        'user_id'    => $data['user_id'],
                        'source'     => $data['source'],
                    ]);

                if ($resp->successful() || $resp->status() === 201) {
                    return response()
                        ->json([
                            'status'     => 'created',
                            'code'       => $data['code'],
                            'ip_address' => $data['ip_address'],
                            'user_id'    => $data['user_id'],
                            'source'     => $data['source'],
                        ], 201)
                        ->header('Location', $endpoint);
                }

                return response()->json([
                    'message' => 'Upstream error',
                    'status'  => $resp->status(),
                    'error'   => $resp->json() ?: $resp->body(),
                ], $resp->status() ?: 502);

            } catch (\Throwable $e) {
                Log::error('log-map-click upstream exception', [
                    'code'       => $data['code'],
                    'ip_address' => $data['ip_address'],
                    'user_id'    => $data['user_id'],
                    'source'     => $data['source'],
                    'error'      => $e->getMessage(),
                ]);

                return response()->json([
                    'message' => 'Upstream exception',
                    'error'   => $e->getMessage(),
                ], 502);
            }
        }
    }

    private function resolveClientIp(Request $request): string
    {
        $cfcip = $request->header('CF-Connecting-IP');
        if ($cfcip && filter_var($cfcip, FILTER_VALIDATE_IP)) {
            return $cfcip;
        }

        $xff = $request->header('X-Forwarded-For');
        if ($xff) {
            foreach (explode(',', $xff) as $part) {
                $ip = trim($part);
                if (filter_var($ip, FILTER_VALIDATE_IP)) {
                    return $ip;
                }
            }
        }

        $real = $request->header('X-Real-IP');
        if ($real && filter_var($real, FILTER_VALIDATE_IP)) {
            return $real;
        }

        return $request->ip();
    }
}