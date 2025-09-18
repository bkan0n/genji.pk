<?php

namespace App\Http\Controllers\Newsfeed;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Throwable;

class TranslateController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $text = (string) $request->input('text', '');
        $target = (string) $request->input(
            'targetLang',
            $request->input('target_lang', app()->getLocale() ?? 'en'),
        );

        if ($text === '') {
            return response()->json(['message' => 'Missing "text"'], 422);
        }

        $map = ['jp' => 'ja', 'cn' => 'zh-CN'];
        $target = $map[$target] ?? $target;

        $svc = config('services.translation_api', []);
        $root = rtrim((string) ($svc['root'] ?? ''), '/');
        $key = (string) ($svc['key'] ?? '');
        $verify = (bool) ($svc['verify'] ?? true);

        if ($root === '' || $key === '') {
            return response()->json(['message' => 'Translation service not configured'], 500);
        }

        $url = $root . '/translate';
        $payload = [
            'text' => $text,
            'target_lang' => $target,
        ];

        try {
            $http = Http::withHeaders([
                'Authorization' => 'Bearer ' . $key,
                'Accept' => 'application/json',
            ])
                ->timeout(15)
                ->retry(2, 300);

            if ($verify === false) {
                $http = $http->withoutVerifying();
            }

            $resp = $http->post($url, $payload);
            if ($resp->failed()) {
                return response()->json(
                    [
                        'message' => 'Translation API failed',
                        'details' => $resp->json(),
                    ],
                    $resp->status() ?: 502,
                );
            }

            $json = $resp->json();

            $translated =
              $json['translatedText'] ??
              ($json['data']['translated_text'] ??
                ($json['data']['translation'] ?? ($json['translation'] ?? null)));

            if (! is_string($translated)) {
                return response()->json(
                    [
                        'message' => 'Unexpected translation API response',
                        'details' => $json,
                    ],
                    502,
                );
            }

            return response()->json(['translatedText' => $translated]);
        } catch (Throwable $e) {
            return response()->json(
                [
                    'message' => 'Error calling translation service',
                    'error' => $e->getMessage(),
                ],
                500,
            );
        }
    }
}
