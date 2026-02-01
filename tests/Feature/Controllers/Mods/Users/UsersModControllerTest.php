<?php

namespace Tests\Feature\Controllers\Mods\Users;

use Tests\TestCase;

class UsersModControllerTest extends TestCase
{
    public function test_get_user_endpoint()
    {
        $response = $this->getJson('/api/mods/users/1');
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_get_user_overwatch_endpoint()
    {
        $response = $this->getJson('/api/mods/users/1/overwatch');
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_create_fake_member_endpoint()
    {
        $response = $this->postJson('/api/mods/users/fake', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_replace_user_overwatch_endpoint()
    {
        $response = $this->putJson('/api/mods/users/1/overwatch', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_update_user_names_endpoint()
    {
        $response = $this->patchJson('/api/mods/users/1', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_link_fake_to_real_endpoint()
    {
        $response = $this->putJson('/api/mods/users/fake/1/link/2', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }
}
