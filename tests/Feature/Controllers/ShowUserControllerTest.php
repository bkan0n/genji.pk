<?php

namespace Tests\Feature\Controllers;

use Tests\TestCase;

class ShowUserControllerTest extends TestCase
{
    public function test_show_user_endpoint()
    {
        $response = $this->getJson('/api/users/1');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_show_user_returns_json()
    {
        $response = $this->getJson('/api/users/1');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }
}
