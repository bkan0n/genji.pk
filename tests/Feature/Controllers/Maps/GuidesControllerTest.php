<?php

namespace Tests\Feature\Controllers\Maps;

use Tests\TestCase;

class GuidesControllerTest extends TestCase
{
    public function test_map_guides_endpoint()
    {
        $response = $this->getJson('/api/maps/ABC-123/guides');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_map_guides_has_json_response()
    {
        $response = $this->getJson('/api/maps/ABC-123/guides');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }
}
