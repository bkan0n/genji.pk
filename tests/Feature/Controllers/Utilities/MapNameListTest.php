<?php

namespace Tests\Feature\Controllers\Utilities;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class MapNameListTest extends TestCase
{
    public function test_public_list_preserves_the_complete_upstream_dataset(): void
    {
        config(['services.genji_api.root' => 'https://maps.test', 'services.genji_api.key' => 'test-key']);
        $names = array_map(fn ($i) => "Map {$i}", range(1, 125));
        Http::fake(['maps.test/api/v3/utilities/map-names' => Http::response($names)]);

        $this->getJson('/api/map-names')->assertOk()->assertExactJson($names);
        Http::assertSent(fn ($request) => $request->url() === 'https://maps.test/api/v3/utilities/map-names'
            && $request->hasHeader('X-API-KEY', 'test-key'));
    }

    public function test_upstream_failure_is_exposed_as_a_failure(): void
    {
        config(['services.genji_api.root' => 'https://maps.test', 'services.genji_api.key' => 'test-key']);
        Http::fake(['maps.test/api/v3/utilities/map-names' => Http::response([], 503)]);

        $this->getJson('/api/map-names')->assertStatus(503)->assertJson(['error' => true]);
    }
}
