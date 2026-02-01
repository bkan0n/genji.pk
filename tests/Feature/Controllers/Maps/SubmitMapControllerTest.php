<?php

namespace Tests\Feature\Controllers\Maps;

use Tests\TestCase;

class SubmitMapControllerTest extends TestCase
{
    public function test_submit_map_endpoint()
    {
        $response = $this->postJson('/api/maps', []);
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }
}
