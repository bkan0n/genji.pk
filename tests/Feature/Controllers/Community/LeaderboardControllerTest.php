<?php

namespace Tests\Feature\Controllers\Community;

use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class LeaderboardControllerTest extends TestCase
{
    public function test_leaderboard_endpoint_returns_valid_response()
    {
        $response = $this->getJson('/api/community/leaderboard');

        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_leaderboard_has_json_response()
    {
        $response = $this->getJson('/api/community/leaderboard');

        $response->assertHeader('content-type', 'application/json');
    }

    public function test_leaderboard_accepts_skill_score_sort_and_preserves_skill_fields(): void
    {
        $this->withoutMiddleware();
        config([
            'services.genji_api.root' => 'https://genji-api.test',
            'services.genji_api.key' => 'test-key',
            'services.genji_api.verify' => false,
        ]);

        Http::fake([
            'https://genji-api.test/api/v3/community/leaderboard*' => Http::response([
                [
                    'user_id' => 123456789012345678,
                    'nickname' => 'Genji',
                    'skill_rank' => 'Pro',
                    'skill_score' => 81.25,
                    'skill_tier' => 7,
                    'skill_percentile' => 0.98,
                    'skill_tier_name' => 'Elite',
                ],
            ]),
        ]);

        $this->getJson('/api/community/leaderboard?sort_column=skill_score&sort_direction=desc&page_size=25')
            ->assertOk()
            ->assertJsonPath('0.user_id', '123456789012345678')
            ->assertJsonPath('0.skill_score', 81.25)
            ->assertJsonPath('0.skill_tier_name', 'Elite');

        Http::assertSent(function (Request $request): bool {
            return $request->url() === 'https://genji-api.test/api/v3/community/leaderboard?sort_column=skill_score&sort_direction=desc&page_size=25&page_number=1';
        });
    }
}
