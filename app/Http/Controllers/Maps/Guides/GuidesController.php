<?php

declare(strict_types=1);

namespace App\Http\Controllers\Maps\Guides;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Throwable;

final class GuidesController extends Controller
{
    public function __invoke(Request $request, string $code): JsonResponse
    {
        $request->validate([
            'include_records' => ['required'],
        ]);
        if (! preg_match('/^[A-Za-z0-9\-]+$/', $code)) {
            return response()->json(
                [
                    'error' => true,
                    'message' => 'Invalid map code.',
                ],
                422,
            );
        }

        $root = rtrim((string) config('services.genji_api.root', ''), '/');
        $key = (string) config('services.genji_api.key', '');
        $verify = (bool) config('services.genji_api.verify', true);

        if ($root === '' || $key === '') {
            return response()->json(
                [
                    'error' => true,
                    'message' => 'API configuration is missing.',
                ],
                500,
            );
        }

        $include = filter_var(
            $request->query('include_records'),
            FILTER_VALIDATE_BOOLEAN,
            FILTER_NULL_ON_FAILURE,
        );
        if ($include === null) {
            return response()->json(
                [
                    'error' => true,
                    'message' => 'include_records must be a boolean.',
                ],
                422,
            );
        }

        $endpoint = $root . '/api/v3/maps/' . rawurlencode($code) . '/guides';

        try {
            $res = Http::withOptions(['verify' => $verify])
                ->acceptJson()
                ->withHeaders(['X-API-KEY' => $key])
                ->get($endpoint, [
                    'include_records' => $include ? 'true' : 'false',
                ]);

            if (! $res->successful()) {
                return response()->json(
                    [
                        'error' => true,
                        'message' => "API request failed with status code {$res->status()}",
                        'response' => $res->json() ?? $res->body(),
                    ],
                    $res->status(),
                );
            }

            $data = $res->json();
            if (! is_array($data)) {
                return response()->json(
                    [
                        'error' => true,
                        'message' => 'Invalid JSON response from upstream.',
                    ],
                    502,
                );
            }

            foreach ($data as &$row) {
                if (is_array($row)) {
                    if (array_key_exists('user_id', $row)) {
                        $row['user_id'] = (string) $row['user_id'];
                    }
                    if (! isset($row['usernames']) || ! is_array($row['usernames'])) {
                        $row['usernames'] = [];
                    }
                }
            }
            unset($row);

            return response()->json($data, 200);
        } catch (Throwable $e) {
            return response()->json(
                [
                    'error' => true,
                    'message' => 'Failed to fetch data from the API: ' . $e->getMessage(),
                ],
                502,
            );
        }
    }
}
