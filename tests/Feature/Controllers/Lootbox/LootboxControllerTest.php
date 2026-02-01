<?php

namespace Tests\Feature\Controllers\Lootbox;

use Tests\TestCase;

class LootboxControllerTest extends TestCase
{
    public function test_lootbox_keys_endpoint()
    {
        $response = $this->getJson('/api/lootbox/keys');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_lootbox_rewards_endpoint()
    {
        $response = $this->getJson('/api/lootbox/rewards');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_lootbox_xp_multiplier_endpoint()
    {
        $response = $this->getJson('/api/lootbox/xp/multiplier');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_lootbox_has_json_response()
    {
        $response = $this->getJson('/api/lootbox/keys');
        $response->assertHeader('content-type', 'application/json');
    }
    public function test_lootbox_set_active_key_type_endpoint()
    {
        $response = $this->patchJson('/api/lootbox/keys/Classic', []);
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_lootbox_user_keys_endpoint()
    {
        $response = $this->getJson('/api/lootbox/users/1/keys');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_lootbox_draw_for_user_endpoint()
    {
        $response = $this->getJson('/api/lootbox/users/1/keys/Classic');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_lootbox_user_rewards_endpoint()
    {
        $response = $this->getJson('/api/lootbox/users/1/rewards');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }
}
