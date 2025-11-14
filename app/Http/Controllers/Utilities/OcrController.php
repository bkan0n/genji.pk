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
            'image_b64' => ['required', 'string'],
        ]);

        $b64 = $data['image_b64'] ?? '';

        if (str_starts_with($b64, 'data:')) {
            $b64 = explode(',', $b64, 2)[1] ?? '';
        }

        $b64 = trim($b64);

        if ($b64 === '') {
            return response()->json([
                'error'   => 'invalid_base64',
                'message' => 'Empty base64 payload after normalization.',
            ], 400);
        }

        if (! preg_match('~^[A-Za-z0-9+/=]+$~', $b64)) {
            return response()->json([
                'error'   => 'invalid_base64',
                'message' => 'Base64 payload contains invalid characters.',
            ], 400);
        }

        $base = rtrim((string) config('services.ocr.base_url'), '/');
        if ($base === '') {
            throw new RuntimeException('services.ocr.base_url is not configured');
        }

        $endpoint = $base . '/extract';

        $resp = Http::acceptJson()
            ->timeout((int) config('services.ocr.timeout', 10))
            ->post($endpoint, [
                'image_b64' => $b64,
            ]);

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
