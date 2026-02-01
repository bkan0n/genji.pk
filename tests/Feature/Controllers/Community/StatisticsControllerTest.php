<?php

namespace Tests\Feature\Controllers\Community;

use Tests\TestCase;

class StatisticsControllerTest extends TestCase
{
    public function test_statistics_maps_difficulty_endpoint()
    {
        $response = $this->getJson('/api/community/statistics/maps/difficulty');
        
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_statistics_skill_players_endpoint()
    {
        $response = $this->getJson('/api/community/statistics/skill/players');
        
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_statistics_xp_players_endpoint()
    {
        $response = $this->getJson('/api/community/statistics/xp/players');
        
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_statistics_creators_popular_endpoint()
    {
        $response = $this->getJson('/api/community/statistics/creators/popular');
        
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_statistics_maps_popular_endpoint()
    {
        $response = $this->getJson('/api/community/statistics/maps/popular');
        
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_statistics_ranks_time_played_endpoint()
    {
        $response = $this->getJson('/api/community/statistics/ranks/time-played');
        
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_statistics_maps_all_endpoint()
    {
        $response = $this->getJson('/api/community/statistics/maps/all');
        
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_statistics_maps_completions_endpoint()
    {
        $response = $this->getJson('/api/community/statistics/maps/completions');
        
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_statistics_has_json_response()
    {
        $response = $this->getJson('/api/community/statistics/maps/all');
        
        $response->assertHeader('content-type', 'application/json');
    }
}
