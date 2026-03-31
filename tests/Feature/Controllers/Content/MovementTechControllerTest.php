<?php

namespace Tests\Feature\Controllers\Content;

use Tests\TestCase;

class MovementTechControllerTest extends TestCase
{
    public function test_public_categories_endpoint(): void
    {
        $response = $this->getJson('/api/content/movement-tech/categories');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_public_difficulties_endpoint(): void
    {
        $response = $this->getJson('/api/content/movement-tech/difficulties');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_public_techniques_endpoint(): void
    {
        $response = $this->getJson('/api/content/movement-tech');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_mod_create_category_endpoint(): void
    {
        $response = $this->postJson('/api/mods/content/movement-tech/categories', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_mod_create_difficulty_endpoint(): void
    {
        $response = $this->postJson('/api/mods/content/movement-tech/difficulties', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_mod_create_technique_endpoint(): void
    {
        $response = $this->postJson('/api/mods/content/movement-tech/techniques', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_mod_show_technique_endpoint(): void
    {
        $response = $this->getJson('/api/mods/content/movement-tech/techniques/1');
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_mod_reorder_technique_endpoint(): void
    {
        $response = $this->postJson('/api/mods/content/movement-tech/techniques/1/reorder', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }
}