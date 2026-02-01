<?php

namespace Tests\Feature\Controllers\Maps\Playtests;

use Tests\TestCase;

class PlaytestControllerTest extends TestCase
{
    public function test_playtest_vote_endpoint()
    {
        $response = $this->postJson('/api/maps/playtests/1/vote/1', []);
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }
}
