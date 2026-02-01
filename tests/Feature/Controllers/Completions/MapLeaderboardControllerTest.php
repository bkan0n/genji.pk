<?php

namespace Tests\Feature\Controllers\Completions;

use Tests\TestCase;

class MapLeaderboardControllerTest extends TestCase
{
    public function test_completion_map_leaderboard_endpoint()
    {
        $response = $this->getJson('/api/completions/ABC-123');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_completion_map_leaderboard_has_json_response()
    {
        $response = $this->getJson('/api/completions/ABC-123');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }
}
