<?php

namespace App\Http\Controllers\Utilities;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OcrController extends Controller
{
    public function extract(Request $request)
    {
        try {
            $b64 = (string) $request->input('image_b64', '');

            if (!$b64 && $request->hasFile('file')) {
                $file = $request->file('file');
                if (!$file->isValid()) {
                    return response()->json(['message' => 'invalid upload'], 422);
                }
                $bin = file_get_contents($file->getRealPath());
                $b64 = base64_encode($bin);
            }

            if ($b64 === '') {
                return response()->json(['message' => 'file or image_b64 required'], 422);
            }

            if (str_starts_with($b64, 'data:')) {
                $b64 = explode(',', $b64, 2)[1] ?? '';
            }

            $ocrBase = config('services.ocr.base', env('OCR_BASE', 'http://localhost:8004'));

            $q = http_build_query($request->only(['langs']));
            $url = rtrim($ocrBase, '/') . '/extract' . ($q ? ('?' . $q) : '');

            $resp = Http::timeout(30)
                ->acceptJson()
                ->asJson()
                ->post($url, ['image_b64' => $b64]);

            if (!$resp->ok()) {
                return response()->json(
                    ['message' => $resp->json('detail') ?? $resp->body() ?? 'OCR upstream error'],
                    $resp->status()
                );
            }

            return response()->json($resp->json(), 200);

        } catch (\Throwable $e) {
            Log::error('OCR extract failed', ['ex' => $e->getMessage()]);
            return response()->json(['message' => 'OCR failed'], 500);
        }
    }
}