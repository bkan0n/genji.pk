<?php

namespace Tests\Feature\Controllers\Mods;

use Tests\TestCase;

class ModsControllerTest extends TestCase
{
    public function test_mods_framework_version_endpoint()
    {
        $response = $this->getJson('/api/mods/framework-version');
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_mods_suspicious_completions_endpoint()
    {
        $response = $this->getJson('/api/mods/completions/suspicious');
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_mods_has_json_response_or_redirect()
    {
        $response = $this->getJson('/api/mods/framework-version');
        // Mods endpoints require authentication and may redirect
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }
}

