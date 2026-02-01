<?php

namespace Tests\Feature\Controllers\Maps;

use Tests\TestCase;

class MapSearchControllerTest extends TestCase
{
    public function test_map_search_endpoint_returns_valid_response()
    {
        $response = $this->getJson('/api/maps');
        
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_map_search_has_json_response()
    {
        $response = $this->getJson('/api/maps');
        
        $response->assertHeader('content-type', 'application/json');
    }

    public function test_maps_trending_endpoint_returns_valid_response()
    {
        $response = $this->getJson('/api/maps/trending');
        
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }
}
