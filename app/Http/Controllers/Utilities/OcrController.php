<?php

namespace App\Http\Controllers\Utilities;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class OcrController extends Controller
{
    public function extract(Request $request)
    {
        $data = $request->validate([
            'image_url' => ['required', 'string', 'url'],
            'code'      => ['nullable', 'string'],
            'time'      => ['nullable', 'numeric'],
            'names'     => ['nullable', 'array'],
            'names.*'   => ['nullable', 'string'],
        ]);

        $url = trim($data['image_url'] ?? '');

        if ($url === '') {
            return response()->json([
                'error'   => 'invalid_image_url',
                'message' => 'Empty image_url after normalization.',
            ], 400);
        }

        if (! str_starts_with($url, 'http://') && ! str_starts_with($url, 'https://')) {
            return response()->json([
                'error'   => 'invalid_image_url',
                'message' => 'image_url must start with http:// or https://.',
            ], 400);
        }

        $base = rtrim((string) config('services.ocr.base_url'), '/');
        if ($base === '') {
            throw new RuntimeException('services.ocr.base_url is not configured');
        }

        $endpoint = $base . '/extract';

        // Build payload with all provided fields
        $payload = [
            'image_url' => $url,
        ];
        
        if (isset($data['code'])) {
            $payload['code'] = $data['code'];
        }
        if (isset($data['time'])) {
            $payload['time'] = $data['time'];
        }
        if (isset($data['names'])) {
            $names = array_map(fn($n) => $n === null ? '' : (string)$n, $data['names']);
            $payload['names'] = $names;
        }

        $resp = Http::acceptJson()
            ->timeout((int) config('services.ocr.timeout', 10))
            ->post($endpoint, $payload);

        if (! $resp->successful()) {
            return response()->json([
                'error'   => 'ocr_upstream_failed',
                'status'  => $resp->status(),
                'message' => $resp->body(),
            ], $resp->status());
        }

        return response()->json(
            $resp->json(),
            200,
            [],
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );
    }
}
