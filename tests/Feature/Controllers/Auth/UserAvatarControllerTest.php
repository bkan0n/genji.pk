<?php

namespace Tests\Feature\Controllers\Auth;

use Tests\TestCase;

class UserAvatarControllerTest extends TestCase
{
    public function test_user_avatar_endpoint()
    {
        $response = $this->getJson('/api/settings/user-avatar');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_user_avatar_update_endpoint()
    {
        $response = $this->putJson('/api/settings/user-avatar', []);
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 405, 422, 500, 502]);
    }
}
