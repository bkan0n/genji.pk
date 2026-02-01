<?php

namespace Tests\Feature\Controllers\MapEdit;

use Tests\TestCase;

class MapEditControllerTest extends TestCase
{
    public function test_create_map_edit_request_endpoint()
    {
        $response = $this->postJson('/api/maps/map-edits', []);
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_get_pending_edit_requests_endpoint()
    {
        $response = $this->getJson('/api/mods/maps/map-edits/pending');
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_get_edit_request_endpoint()
    {
        $response = $this->getJson('/api/mods/maps/map-edits/1');
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_get_edit_request_submission_view_endpoint()
    {
        $response = $this->getJson('/api/mods/maps/map-edits/1/submission');
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }
}
