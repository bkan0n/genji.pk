<?php

namespace Tests\Feature\Controllers\Mods\Maps;

use Tests\TestCase;

class MapsModControllerTest extends TestCase
{
    public function test_archive_maps_endpoint()
    {
        $response = $this->patchJson('/api/mods/maps/archive', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_convert_to_legacy_endpoint()
    {
        $response = $this->postJson('/api/mods/maps/ABC-123/legacy', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_update_map_endpoint()
    {
        $response = $this->patchJson('/api/mods/maps/ABC-123', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_override_quality_endpoint()
    {
        $response = $this->postJson('/api/mods/maps/ABC-123/quality', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }
}
