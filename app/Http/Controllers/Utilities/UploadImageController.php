<?php

namespace App\Http\Controllers\Utilities;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class UploadImageController extends Controller
{
    public function __invoke(Request $request)
    {
        try {
            $validated = $request->validate([
                'file' => [
                    'required',
                    'mimetypes:image/jpeg,image/png,image/webp,image/avif',
                    'max:10000', // 8MB
                ],
            ]);
        } catch (ValidationException $e) {
            return response()->json(
                [
                    'message' => 'Bad request: invalid file',
                    'errors' => $e->errors(),
                ],
                422,
            );
        }

        $file = $validated['file'];

        $root = rtrim((string) config('services.genji_api.root', ''), '/');
        $apiKey = (string) config('services.genji_api.key', '');
        $verify = (bool) config('services.genji_api.verify', true);

        if ($root === '') {
            return response('Server misconfigured: missing genji_api.root', 500)->header(
                'Content-Type',
                'text/plain',
            );
        }

        $client = new Client([
            'base_uri' => $root,
            'verify' => $verify,
            'timeout' => 30,
        ]);

        $upstreamPath = '/api/v3/utilities/image';

        $mime = $file->getMimeType() ?: 'application/octet-stream';
        $filename = $file->getClientOriginalName() ?: 'upload.' . ($file->extension() ?: 'png');

        try {
            $resp = $client->post($upstreamPath, [
                'headers' => array_filter([
                    'Accept' => 'text/plain',
                    'X-API-Key' => $apiKey ?: null,
                ]),
                'multipart' => [
                    [
                        'name' => 'file',
                        'contents' => fopen($file->getRealPath(), 'r'),
                        'filename' => $filename,
                        'headers' => [
                            'Content-Type' => $mime,
                        ],
                    ],
                ],
            ]);
        } catch (GuzzleException $e) {
            Log::warning('Upstream upload failed', [
                'error' => $e->getMessage(),
            ]);

            return response('Upstream upload failed', 502)->header('Content-Type', 'text/plain');
        }

        $status = $resp->getStatusCode();
        $body = (string) $resp->getBody();

        if ($status >= 200 && $status < 300) {
            return response($body, 201)->header('Content-Type', 'text/plain');
        }

        return response('Upstream error', 502)->header('Content-Type', 'text/plain');
    }
}
