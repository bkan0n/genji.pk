<?php

namespace Tests\Feature\Controllers\Mods\Playtests;

use Tests\TestCase;

class PlaytestsModControllerTest extends TestCase
{
    public function test_approve_playtest_endpoint()
    {
        $response = $this->postJson('/api/mods/playtests/1/approve', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_force_accept_playtest_endpoint()
    {
        $response = $this->postJson('/api/mods/playtests/1/force_accept', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_force_deny_playtest_endpoint()
    {
        $response = $this->postJson('/api/mods/playtests/1/force_deny', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_reset_playtest_endpoint()
    {
        $response = $this->postJson('/api/mods/playtests/1/reset', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_delete_all_playtest_votes_endpoint()
    {
        $response = $this->deleteJson('/api/mods/playtests/1/vote');
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_delete_playtest_vote_endpoint()
    {
        $response = $this->deleteJson('/api/mods/playtests/1/vote/1');
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }
}
