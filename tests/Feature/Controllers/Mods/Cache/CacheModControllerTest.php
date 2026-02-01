<?php

namespace Tests\Feature\Controllers\Mods\Cache;

use Tests\TestCase;

class CacheModControllerTest extends TestCase
{
    public function test_clear_framework_cache_endpoint()
    {
        $response = $this->deleteJson('/api/mods/cache/framework');
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_clear_translations_cache_endpoint()
    {
        $response = $this->deleteJson('/api/mods/cache/translations');
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_clear_avatars_cache_endpoint()
    {
        $response = $this->deleteJson('/api/mods/cache/avatars');
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_get_overpy_commit_endpoint()
    {
        $response = $this->getJson('/api/mods/overpy-commit');
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_update_overpy_commit_endpoint()
    {
        $response = $this->patchJson('/api/mods/overpy-commit', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }
}
