<?php

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;
use Throwable;

class LeaderboardController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:64'],
            'tier_name' => ['nullable', 'string', 'max:32'],
            'skill_rank' => ['nullable', 'string', 'max:32'],

            'sort_column' => [
                'nullable',
                Rule::in([
                    'xp_amount',
                    'nickname',
                    'prestige_level',
                    'wr_count',
                    'map_count',
                    'playtest_count',
                    'discord_tag',
                    'skill_rank',
                ]),
            ],
            'sort_direction' => ['nullable', Rule::in(['asc', 'desc'])],

            'page_size' => ['nullable', 'integer', Rule::in([10, 20, 25, 50])],
            'page_number' => ['nullable', 'integer', 'min:1'],
        ]);

        $query = [
            'sort_column' => $validated['sort_column'] ?? 'xp_amount',
            'sort_direction' => $validated['sort_direction'] ?? 'asc',
            'page_size' => (int) ($validated['page_size'] ?? 10),
            'page_number' => (int) ($validated['page_number'] ?? 1),
        ];

        foreach (['name', 'tier_name', 'skill_rank'] as $k) {
            if (! empty($validated[$k])) {
                $query[$k] = trim($validated[$k]);
            }
        }

        $root = rtrim(config('services.genji_api.root', ''), '/');
        $verify = (bool) config('services.genji_api.verify', true);
        $key = config('services.genji_api.key', '');

        if (empty($root) || empty($key)) {
            return response()->json(
                [
                    'error' => 'misconfigured',
                    'status' => 500,
                    'message' => 'Missing GENJI API root or key.',
                ],
                500,
            );
        }

        try {
            $resp = Http::withHeaders(['X-API-KEY' => $key])
                ->withOptions(['verify' => $verify])
                ->get($root . '/api/v3/community/leaderboard', $query);

            if ($resp->successful()) {
                $payload = $resp->json();

                if (is_array($payload)) {
                    foreach ($payload as &$row) {
                        if (is_array($row) && array_key_exists('user_id', $row)) {
                            $row['user_id'] = (string) $row['user_id'];
                        }
                    }
                    unset($row);
                }

                return response()->json($payload, 200);
            }

            return response()->json(
                [
                    'error' => 'upstream_failed',
                    'status' => $resp->status(),
                    'message' => $resp->json()['message'] ?? $resp->body(),
                ],
                $resp->status(),
            );
        } catch (Throwable $e) {
            return response()->json(
                [
                    'error' => 'exception',
                    'status' => 500,
                    'message' => $e->getMessage(),
                ],
                500,
            );
        }
    }
}
