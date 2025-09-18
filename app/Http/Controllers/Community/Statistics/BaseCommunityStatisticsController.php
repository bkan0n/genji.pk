<?php

namespace App\Http\Controllers\Community\Statistics;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

abstract class BaseCommunityStatisticsController extends Controller
{
    protected function passThrough(Request $request, string $path, ?array $allow = null)
    {
        $root = rtrim((string) config('services.genji_api.root'), '/');
        if ($root === '') {
            return response()->json(
                [
                    'error' => 'config_missing',
                    'message' => 'services.genji_api.root est manquant dans config/services.php',
                ],
                500,
            );
        }

        $incoming = $request->query();
        if (is_array($allow)) {
            $incoming = array_intersect_key($incoming, array_flip($allow));
        }

        $endpoint = "{$root}/api/v3/community/statistics/" . ltrim($path, '/');

        $http = Http::acceptJson()
            ->withHeaders(['X-API-KEY' => (string) config('services.genji_api.key', '')])
            ->withOptions(['verify' => (bool) config('services.genji_api.verify', true)]);

        $qs = $this->buildFlatQueryString($incoming);
        $url = $qs ? "{$endpoint}?{$qs}" : $endpoint;

        $resp = $http->get($url);

        if (! $resp->successful()) {
            return response()->json(
                [
                    'error' => 'upstream_failed',
                    'status' => $resp->status(),
                    'message' => $resp->body(),
                ],
                $resp->status(),
            );
        }

        $data = json_decode($resp->body(), true);

        return response()->json($data, 200, [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    protected function buildFlatQueryString(array $params): string
    {
        if (empty($params)) {
            return '';
        }
        $parts = [];
        foreach ($params as $k => $v) {
            $key = rawurlencode((string) $k);
            if (is_array($v)) {
                foreach ($v as $item) {
                    if ($item === null || $item === '') {
                        continue;
                    }
                    $parts[] = $key . '=' . rawurlencode((string) $item);
                }
            } elseif ($v !== null && $v !== '') {
                $parts[] = $key . '=' . rawurlencode((string) $v);
            }
        }

        return implode('&', $parts);
    }
}
