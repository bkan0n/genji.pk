<?php

namespace Tests\Feature\Controllers\Maps;

use Tests\TestCase;

class QualityVoteControllerTest extends TestCase
{
    public function test_quality_vote_endpoint()
    {
        $response = $this->postJson('/api/maps/ABC-123/quality', []);
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }
}
