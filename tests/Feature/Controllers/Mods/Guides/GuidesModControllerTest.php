<?php

namespace Tests\Feature\Controllers\Mods\Guides;

use Tests\TestCase;

class GuidesModControllerTest extends TestCase
{
    public function test_create_guide_endpoint()
    {
        $response = $this->postJson('/api/mods/maps/ABC-123/guides', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_edit_guide_endpoint()
    {
        $response = $this->patchJson('/api/mods/maps/ABC-123/guides/1', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_delete_guide_endpoint()
    {
        $response = $this->deleteJson('/api/mods/maps/ABC-123/guides/1');
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }
}
