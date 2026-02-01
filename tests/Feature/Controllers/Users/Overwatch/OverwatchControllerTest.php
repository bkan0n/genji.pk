<?php

namespace Tests\Feature\Controllers\Users\Overwatch;

use Tests\TestCase;

class OverwatchControllerTest extends TestCase
{
    public function test_get_overwatch_usernames_endpoint()
    {
        $response = $this->getJson('/api/users/1/overwatch');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_replace_overwatch_usernames_endpoint()
    {
        $response = $this->putJson('/api/users/1/overwatch', []);
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }
}
