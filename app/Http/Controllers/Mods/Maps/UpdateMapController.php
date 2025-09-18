<?php

namespace App\Http\Controllers\Mods\Maps;

use App\Http\Controllers\Controller;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class UpdateMapController extends Controller
{
    public function __invoke(Request $request, string $code)
    {
        $cfg = (array) config('services.genji_api', []);
        $root = rtrim((string) ($cfg['root'] ?? ''), '/');
        $apiKey = (string) ($cfg['key'] ?? '');
        $verify = (bool) ($cfg['verify'] ?? true);

        if ($root === '') {
            return response()->json(
                [
                    'message' => 'services.genji_api.root is not configured',
                ],
                500,
            );
        }

        $url = $root . '/api/v3/maps/' . rawurlencode($code);

        $payload = $this->buildPayload($request);

        try {
            $http = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])
                ->when($apiKey !== '', fn ($h) => $h->withHeaders(['X-API-Key' => $apiKey]))
                ->withOptions([
                    'verify' => $verify,
                    'timeout' => 15,
                ]);

            $resp = $http->patch($url, $payload);

            $contentType = strtolower($resp->header('Content-Type', 'application/json'));
            if (str_contains($contentType, 'application/json')) {
                return response()->json($resp->json(), $resp->status());
            }

            return response($resp->body(), $resp->status())->header(
                'Content-Type',
                $resp->header('Content-Type', 'text/plain'),
            );
        } catch (ConnectionException $e) {
            return response()->json(
                [
                    'message' => 'Upstream connection error',
                    'error' => $e->getMessage(),
                ],
                502,
            );
        }
    }

    private function buildPayload(Request $r): array
    {
        $allowed = [
            'code',
            'map_name',
            'category',
            'creators',
            'checkpoints',
            'difficulty',
            'hidden',
            'official',
            'playtesting',
            'archived',
            'mechanics',
            'restrictions',
            'title',
            'description',
            'guide_url',
            'custom_banner',
            'medals',
        ];

        $in = $r->only($allowed);

        $bool = static function ($v) {
            $res = filter_var($v, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

            return $res;
        };

        foreach (['hidden', 'official', 'archived'] as $k) {
            if (array_key_exists($k, $in)) {
                $cast = $bool($in[$k]);
                if ($cast !== null) {
                    $in[$k] = $cast;
                }
            }
        }

        if (
            array_key_exists('checkpoints', $in) &&
            $in['checkpoints'] !== null &&
            $in['checkpoints'] !== ''
        ) {
            $in['checkpoints'] = (int) $in['checkpoints'];
        }

        foreach (['mechanics', 'restrictions'] as $k) {
            if (array_key_exists($k, $in)) {
                $v = $in[$k];
                if (is_string($v)) {
                    $in[$k] = array_values(array_filter(array_map(fn ($s) => trim($s), explode(',', $v))));
                } elseif (is_array($v)) {
                    $in[$k] = array_values(array_filter(array_map('strval', $v), fn ($s) => $s !== ''));
                }
                if (empty($in[$k])) {
                    unset($in[$k]);
                }
            }
        }

        if (array_key_exists('creators', $in)) {
            $v = $in['creators'];
            if (is_string($v)) {
                $ids = array_values(array_filter(array_map('trim', explode(',', $v))));
                $in['creators'] = array_map(fn ($id) => ['id' => $id, 'is_primary' => false], $ids);
            } elseif (is_array($v)) {
                $norm = [];
                foreach ($v as $row) {
                    if (is_array($row)) {
                        $id = $row['id'] ?? ($row['user_id'] ?? null);
                        if ($id === null || $id === '') {
                            continue;
                        }
                        $norm[] = [
                            'id' => is_numeric($id) ? (int) $id : (string) $id,
                            'is_primary' => (bool) ($row['is_primary'] ?? false),
                        ];
                    } elseif (is_scalar($row)) {
                        $norm[] = ['id' => (string) $row, 'is_primary' => false];
                    }
                }
                if ($norm === []) {
                    unset($in['creators']);
                } else {
                    $in['creators'] = $norm;
                }
            }
        }

        if (array_key_exists('medals', $in) && is_array($in['medals'])) {
            $m = $in['medals'];
            $clean = [];
            foreach (['gold', 'silver', 'bronze'] as $k) {
                if (isset($m[$k]) && $m[$k] !== '' && $m[$k] !== null) {
                    $clean[$k] = (float) $m[$k];
                }
            }
            if ($clean === []) {
                unset($in['medals']);
            } else {
                $in['medals'] = $clean;
            }
        }

        foreach (
            [
                'guide_url',
                'title',
                'description',
                'map_name',
                'category',
                'difficulty',
                'playtesting',
                'custom_banner',
                'code',
            ] as $k
        ) {
            if (array_key_exists($k, $in)) {
                $val = is_string($in[$k]) ? trim($in[$k]) : $in[$k];
                if ($val === '' || $val === null) {
                    unset($in[$k]);
                } else {
                    $in[$k] = $val;
                }
            }
        }

        return $in;
    }
}
