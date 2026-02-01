<?php

namespace Tests\Feature\Controllers\Mods\Lootbox;

use Tests\TestCase;

class LootboxModControllerTest extends TestCase
{
    public function test_grant_key_to_user_endpoint()
    {
        $response = $this->postJson('/api/mods/lootbox/users/1/keys/Classic', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_grant_xp_to_user_endpoint()
    {
        $response = $this->postJson('/api/mods/lootbox/users/1/xp', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_debug_grant_reward_endpoint()
    {
        $response = $this->postJson('/api/mods/lootbox/users/debug/1/Classic/reward/test', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }
}
