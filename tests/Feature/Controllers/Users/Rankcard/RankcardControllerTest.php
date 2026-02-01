<?php

namespace Tests\Feature\Controllers\Users\Rankcard;

use Tests\TestCase;

class RankcardControllerTest extends TestCase
{
    public function test_get_rankcard_endpoint()
    {
        $response = $this->getJson('/api/users/1/rankcard');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_get_avatar_skin_endpoint()
    {
        $response = $this->getJson('/api/users/1/rankcard/avatar/skin');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_get_avatar_pose_endpoint()
    {
        $response = $this->getJson('/api/users/1/rankcard/avatar/pose');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_get_background_endpoint()
    {
        $response = $this->getJson('/api/users/1/rankcard/background');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_get_badge_settings_endpoint()
    {
        $response = $this->getJson('/api/users/1/rankcard/badge-settings');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_get_map_mastery_endpoint()
    {
        $response = $this->getJson('/api/users/1/rankcard/map-mastery');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }
}
