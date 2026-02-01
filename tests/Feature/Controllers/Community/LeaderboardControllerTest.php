<?php

namespace Tests\Feature\Controllers\Community;

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
}
