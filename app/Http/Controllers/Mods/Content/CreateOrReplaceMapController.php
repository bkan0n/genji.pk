<?php

declare(strict_types=1);

namespace App\Http\Controllers\Mods\Content;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

/**
 * Proxies the moderator dashboard's "create map / replace banner" request to the
 * upstream genji API. The endpoint is a mixed-multipart create (name + banner) that
 * is idempotent upstream: re-posting an existing name returns 201 with
 * {inserted: false} and overwrites the banner. The browser cannot reach the
 * upstream directly (no X-API-KEY), so we forward the multipart body server-side
 * with the injected key — mirroring UploadImageController's file-forward pattern.
 *
 * Upstream: POST {root}/api/v3/content/maps  (multipart: name, banner) → {name, inserted}.
 */
final class CreateOrReplaceMapController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'banner' => [
                    'required',
                    'file',
                    'mimetypes:image/jpeg,image/png,image/webp,image/avif',
                    'max:24576', // kilobytes ≈ 24 MB, mirrors the client-side cap
                ],
            ]);
        } catch (ValidationException $e) {
            return response()->json(
                ['message' => 'Bad request: invalid input', 'errors' => $e->errors()],
                422,
            );
        }

        $root = rtrim((string) config('services.genji_api.root', ''), '/');
        $apiKey = (string) config('services.genji_api.key', '');
        $verify = (bool) config('services.genji_api.verify', true);

        if ($root === '' || $apiKey === '') {
            return response()->json(
                ['message' => 'Server misconfigured: missing upstream API configuration.'],
                500,
            );
        }

        $file = $validated['banner'];
        $mime = $file->getMimeType() ?: 'application/octet-stream';
        $filename = $file->getClientOriginalName() ?: 'banner.' . ($file->extension() ?: 'png');

        $client = new Client(['base_uri' => $root, 'verify' => $verify, 'timeout' => 30]);

        try {
            $resp = $client->post('/api/v3/content/maps', [
                'headers' => [
                    'Accept' => 'application/json',
                    'X-API-KEY' => $apiKey,
                ],
                'multipart' => [
                    ['name' => 'name', 'contents' => $validated['name']],
                    [
                        'name' => 'banner',
                        'contents' => fopen($file->getRealPath(), 'r'),
                        'filename' => $filename,
                        'headers' => ['Content-Type' => $mime],
                    ],
                ],
                'http_errors' => false, // forward upstream 4xx/5xx instead of throwing
            ]);
        } catch (GuzzleException $e) {
            Log::warning('mods.content.maps.create upstream failed', ['error' => $e->getMessage()]);

            return response()->json(['message' => 'Upstream request failed.'], 502);
        }

        $status = $resp->getStatusCode();
        $body = (string) $resp->getBody();
        $data = json_decode($body, true);

        if (! is_array($data)) {
            $data = ['message' => $body !== '' ? $body : 'Unexpected upstream response.'];
        }

        return response()->json($data, $status);
    }
}
