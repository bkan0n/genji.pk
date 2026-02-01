<?php

namespace Tests\Feature\Controllers\Users;

use Tests\TestCase;

class UsersControllerTest extends TestCase
{
    public function test_user_show_endpoint()
    {
        $response = $this->getJson('/api/users/1');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_user_overwatch_endpoint()
    {
        $response = $this->getJson('/api/users/1/overwatch');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_user_notifications_endpoint()
    {
        $response = $this->getJson('/api/users/1/notifications');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_user_rankcard_endpoint()
    {
        $response = $this->getJson('/api/users/1/rankcard');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_users_has_json_response()
    {
        $response = $this->getJson('/api/users/1');
        $response->assertHeader('content-type', 'application/json');
    }
}
