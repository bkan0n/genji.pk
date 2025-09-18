<?php

declare(strict_types=1);

namespace App\Http\Controllers\Completions;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

final class SubmitCompletionController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'min:4', 'max:6', 'regex:/^[A-Z0-9]+$/'],
            'user_id' => ['required', 'regex:/^\d+$/'],
            'time' => ['required', 'numeric', 'min:0'],
            'screenshot' => ['required', 'url', 'regex:/^https?:\/\//i'],
            'video' => ['nullable', 'string'],
        ]);

        $root = rtrim((string) config('services.genji_api.root', ''), '/');
        $key = (string) config('services.genji_api.key', '');

        $verifyRaw = config('services.genji_api.verify', true);
        $verify = filter_var($verifyRaw, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        if ($verify === null) {
            $verify = (bool) $verifyRaw;
        }

        if ($root === '' || $key === '') {
            Log::error('SubmitCompletion: missing API config', [
                'has_root' => $root !== '',
                'has_key' => $key !== '',
                'hint' => 'Set X_API_ROOT and X_API_KEY in your .env',
            ]);

            return response()->json(
                [
                    'error' => true,
                    'message' => 'API configuration is missing. Please set X_API_ROOT and X_API_KEY.',
                ],
                500,
            );
        }

        $endpoint = "{$root}/api/v3/completions";

        try {
            $userId = (string) $validated['user_id'];

            $video = null;
            if (array_key_exists('video', $validated)) {
                $v = trim((string) ($validated['video'] ?? ''));
                if ($v !== '') {
                    if (! preg_match('/^https?:\/\//i', $v)) {
                        $v = 'https://' . $v;
                    }
                    $video = $v;
                }
            }

            $payload = [
                'code' => $validated['code'],
                'user_id' => $userId,
                'time' => (float) $validated['time'],
                'screenshot' => $validated['screenshot'],
                'video' => $video,
            ];

            $res = Http::withOptions(['verify' => $verify])
                ->acceptJson()
                ->asJson()
                ->withHeaders([
                    'X-API-KEY' => $key,
                    'Content-Type' => 'application/json',
                ])
                ->post($endpoint, $payload);

            if (! $res->successful()) {
                Log::error('SubmitCompletion: upstream error', [
                    'status' => $res->status(),
                    'endpoint' => $endpoint,
                    'payload' => $payload,
                    'body' => $res->body(),
                ]);

                return response()->json(
                    [
                        'error' => true,
                        'message' => "API request failed with status code {$res->status()}",
                        'response' => $res->json() ?? $res->body(),
                    ],
                    $res->status(),
                );
            }

            $body = trim((string) $res->body());
            $json = $res->json();

            if (is_array($json)) {
                return response()->json($json, $res->status());
            }

            if ($body !== '' && is_numeric($body)) {
                return response()->json(['id' => (int) $body], $res->status());
            }

            return response()->json(['result' => $body], $res->status());
        } catch (Throwable $e) {
            Log::error('SubmitCompletion: exception', [
                'message' => $e->getMessage(),
                'endpoint' => $endpoint ?? null,
            ]);

            return response()->json(
                [
                    'error' => true,
                    'message' => 'Failed to submit completion: ' . $e->getMessage(),
                ],
                502,
            );
        }
    }
}
