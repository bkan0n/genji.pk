<?php

namespace App\Http\Controllers\Maps;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MapSearchController extends Controller
{
    public function index(Request $request)
    {
        $payload = (array) $request->all();

        $boolish = ['archived', 'hidden', 'official', 'return_all'];
        foreach ($boolish as $k) {
            if (array_key_exists($k, $payload)) {
                $payload[$k] = filter_var($payload[$k], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            }
        }

        if (! array_key_exists('archived', $payload)) {
            $payload['archived'] = false;
        }

        $arrayish = [
            'category',
            'map_name',
            'creator_ids',
            'creator_names',
            'mechanics',
            'restrictions',
        ];
        foreach ($arrayish as $k) {
            if (! array_key_exists($k, $payload)) {
                continue;
            }
            $v = $payload[$k];

            if (is_array($v)) {
            } elseif (is_string($v)) {
                $parts = array_map('trim', array_filter(explode(',', $v), static fn ($x) => $x !== ''));
                $payload[$k] = count($parts) > 1 ? $parts : ($v === '' ? [] : [$v]);
            } else {
                $payload[$k] = [$v];
            }
        }

        $validated = validator($payload, [
            'playtest_status' => ['nullable', 'in:Approved,In Progress,Rejected'],
            'archived' => ['nullable', 'boolean'],
            'hidden' => ['nullable', 'boolean'],
            'official' => ['nullable', 'boolean'],
            'playtest_thread_id' => ['nullable', 'integer'],
            'code' => ['nullable', 'string'],

            'category' => ['nullable', 'array'],
            'category.*' => ['string'],

            'map_name' => ['nullable', 'array'],
            'map_name.*' => ['string'],

            'creator_ids' => ['nullable', 'array'],
            'creator_ids.*' => ['string'],

            'creator_names' => ['nullable', 'array'],
            'creator_names.*' => ['string'],

            'mechanics' => ['nullable', 'array'],
            'mechanics.*' => ['string'],

            'restrictions' => ['nullable', 'array'],
            'restrictions.*' => ['string'],

            'difficulty_exact' => ['nullable', 'string'],
            'difficulty_range_min' => ['nullable', 'string'],
            'difficulty_range_max' => ['nullable', 'string'],

            'minimum_quality' => ['nullable', 'integer'],
            'medal_filter' => ['nullable', 'in:All,With,Without'],
            'user_id' => ['nullable', 'integer'],
            'completion_filter' => ['nullable', 'in:All,With,Without'],
            'return_all' => ['nullable', 'boolean'],
            'page_size' => ['nullable', 'integer', 'min:1', 'max:100'],
            'page_number' => ['nullable', 'integer', 'min:1'],
        ])->validate();

        $query = [];

        $boolKeys = ['archived', 'hidden', 'official', 'return_all'];
        foreach ($boolKeys as $k) {
            if (array_key_exists($k, $validated)) {
                $query[$k] = filter_var($validated[$k], FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
            }
        }

        foreach (
            ['playtest_thread_id', 'minimum_quality', 'user_id', 'page_size', 'page_number'] as $k
        ) {
            if (isset($validated[$k])) {
                $query[$k] = (int) $validated[$k];
            }
        }

        foreach (
            [
                'playtest_status',
                'code',
                'difficulty_exact',
                'difficulty_range_min',
                'difficulty_range_max',
                'medal_filter',
                'completion_filter',
            ] as $k
        ) {
            if (! empty($validated[$k])) {
                $query[$k] = trim((string) $validated[$k]);
            }
        }

        $listSanitize = static function (array $list, bool $digitsOnly = false): array {
            $out = [];
            foreach ($list as $v) {
                $s = trim((string) $v);
                if ($s === '') {
                    continue;
                }
                if ($digitsOnly) {
                    $s = preg_replace('/\D+/', '', $s);
                }
                if ($s !== '') {
                    $out[] = $s;
                }
            }

            return array_values(array_unique($out));
        };

        if (isset($validated['category'])) {
            $query['category'] = $listSanitize($validated['category']);
        }
        if (isset($validated['map_name'])) {
            $query['map_name'] = $listSanitize($validated['map_name']);
        }
        if (isset($validated['creator_ids'])) {
            $query['creator_ids'] = $listSanitize($validated['creator_ids'], true);
        }
        if (isset($validated['creator_names'])) {
            $query['creator_names'] = $listSanitize($validated['creator_names']);
        }
        if (isset($validated['mechanics'])) {
            $query['mechanics'] = $listSanitize($validated['mechanics']);
        }
        if (isset($validated['restrictions'])) {
            $query['restrictions'] = $listSanitize($validated['restrictions']);
        }

        $root = rtrim((string) config('services.genji_api.root'), '/');
        if (! $root) {
            return response()->json(
                [
                    'error' => 'config_missing',
                    'message' => 'services.genji_api.root est manquant dans config/services.php',
                ],
                500,
            );
        }

        $http = Http::acceptJson()
            ->withHeaders(['X-API-KEY' => (string) config('services.genji_api.key', '')])
            ->withOptions(['verify' => (bool) config('services.genji_api.verify', true)]);

        $endpoint = "{$root}/api/v3/maps";

        $qs = $this->buildFlatQueryString($query);
        $resp = $http->get($qs ? "{$endpoint}?{$qs}" : $endpoint);

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

        $normalizeIds = function (&$node) use (&$normalizeIds) {
            if (! is_array($node)) {
                return;
            }

            if (isset($node['playtest']['voters']) && is_array($node['playtest']['voters'])) {
                foreach ($node['playtest']['voters'] as &$v) {
                    $v = (string) $v;
                }
                unset($v);
            }
            if (isset($node['voters']) && is_array($node['voters'])) {
                foreach ($node['voters'] as &$v) {
                    $v = (string) $v;
                }
                unset($v);
            }

            foreach ($node as &$v) {
                $normalizeIds($v);
            }
            unset($v);
        };
        $normalizeIds($data);

        $forceCreatorsIdString = function (&$node) use (&$forceCreatorsIdString) {
            if (! is_array($node)) {
                return;
            }
            if (array_key_exists('creators', $node) && is_array($node['creators'])) {
                foreach ($node['creators'] as &$creator) {
                    if (is_array($creator) && array_key_exists('id', $creator)) {
                        $creator['id'] = preg_replace('/\D+/', '', (string) $creator['id']);
                    }
                }
                unset($creator);
            }
            foreach ($node as &$v) {
                $forceCreatorsIdString($v);
            }
            unset($v);
        };
        $forceCreatorsIdString($data);

        $forceThreadIdString = function (&$node) use (&$forceThreadIdString) {
            if (! is_array($node)) {
                return;
            }
            if (
                isset($node['playtest']) &&
                is_array($node['playtest']) &&
                array_key_exists('thread_id', $node['playtest'])
            ) {
                $node['playtest']['thread_id'] = preg_replace(
                    '/\D+/',
                    '',
                    (string) $node['playtest']['thread_id'],
                );
            }
            foreach ($node as &$v) {
                $forceThreadIdString($v);
            }
            unset($v);
        };
        $forceThreadIdString($data);

        return response()->json($data, 200, [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    private function buildFlatQueryString(array $params): string
    {
        $parts = [];
        foreach ($params as $k => $v) {
            $key = rawurlencode((string) $k);
            if (is_array($v)) {
                foreach ($v as $item) {
                    $parts[] = $key . '=' . rawurlencode((string) $item);
                }
            } else {
                $parts[] = $key . '=' . rawurlencode((string) $v);
            }
        }

        return implode('&', $parts);
    }
}
