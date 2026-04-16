<?php

namespace Tests\Feature\Controllers\Content;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class MovementTechResponseNormalizationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Config::set('services.genji_api', [
            'root' => 'https://example.test',
            'key' => 'test-key',
            'verify' => false,
        ]);

        Config::set('laravelcloudflare.enabled', false);

        $this->withoutMiddleware();
    }

    public function test_show_endpoint_dedupes_duplicate_tip_and_video_rows(): void
    {
        Http::fake([
            'https://example.test/api/v3/content/movement-tech/techniques/3' => Http::response([
                'id' => 3,
                'name' => 'Edge Climb',
                'description' => 'Example',
                'display_order' => 1,
                'category_id' => 1,
                'category_name' => 'Climb & Vertical',
                'difficulty_id' => 1,
                'difficulty_name' => 'Beginner',
                'tips' => [
                    ['id' => 47, 'text' => 'Tip A', 'sort_order' => 1],
                    ['id' => 47, 'text' => 'Tip A', 'sort_order' => 1],
                    ['id' => 48, 'text' => 'Tip B', 'sort_order' => 2],
                    ['id' => 48, 'text' => 'Tip B', 'sort_order' => 2],
                ],
                'videos' => [
                    ['id' => 3, 'url' => 'https://google.com', 'caption' => 'Edge Climb', 'sort_order' => 1],
                    ['id' => 3, 'url' => 'https://google.com', 'caption' => 'Edge Climb', 'sort_order' => 1],
                ],
            ], 200),
        ]);

        $response = $this->getJson('/api/mods/content/movement-tech/techniques/3');

        $response->assertOk();
        $response->assertJsonCount(2, 'tips');
        $response->assertJsonCount(1, 'videos');
        $response->assertJsonPath('tips.0.id', 47);
        $response->assertJsonPath('tips.1.id', 48);
        $response->assertJsonPath('videos.0.id', 3);
    }

    public function test_update_endpoint_dedupes_upstream_children_even_when_payload_is_clean(): void
    {
        Http::fake([
            'https://example.test/api/v3/content/movement-tech/techniques/3' => Http::response([
                'id' => 3,
                'name' => 'Edge Climb',
                'description' => 'Example',
                'display_order' => 1,
                'category_id' => 1,
                'category_name' => 'Climb & Vertical',
                'difficulty_id' => 1,
                'difficulty_name' => 'Beginner',
                'tips' => [
                    ['id' => 47, 'text' => 'Tip A', 'sort_order' => 1],
                    ['id' => 47, 'text' => 'Tip A', 'sort_order' => 1],
                    ['id' => 48, 'text' => 'Tip B', 'sort_order' => 2],
                    ['id' => 48, 'text' => 'Tip B', 'sort_order' => 2],
                ],
                'videos' => [
                    ['id' => 3, 'url' => 'https://google.com', 'caption' => 'Edge Climb', 'sort_order' => 1],
                    ['id' => 3, 'url' => 'https://google.com', 'caption' => 'Edge Climb', 'sort_order' => 1],
                ],
            ], 200),
        ]);

        $payload = [
            'name' => 'Edge Climb',
            'tips' => [
                ['text' => 'Tip A', 'sort_order' => 1],
                ['text' => 'Tip B', 'sort_order' => 2],
            ],
            'videos' => [
                ['url' => 'https://google.com', 'caption' => 'Edge Climb', 'sort_order' => 1],
            ],
        ];

        $response = $this->putJson('/api/mods/content/movement-tech/techniques/3', $payload);

        $response->assertOk();
        $response->assertJsonCount(2, 'tips');
        $response->assertJsonCount(1, 'videos');

        Http::assertSent(function ($request) use ($payload) {
            return $request->method() === 'PUT'
                && $request->url() === 'https://example.test/api/v3/content/movement-tech/techniques/3'
                && $request['tips'] === $payload['tips']
                && $request['videos'] === $payload['videos'];
        });
    }

    public function test_list_endpoint_merges_duplicate_technique_rows_and_dedupes_children(): void
    {
        Http::fake([
            'https://example.test/api/v3/content/movement-tech/' => Http::response([
                'techniques' => [
                    [
                        'id' => 3,
                        'name' => 'Edge Climb',
                        'description' => 'Example',
                        'display_order' => 1,
                        'tips' => [
                            ['id' => 47, 'text' => 'Tip A', 'sort_order' => 1],
                        ],
                        'videos' => [
                            ['id' => 3, 'url' => 'https://google.com', 'caption' => 'Edge Climb', 'sort_order' => 1],
                        ],
                    ],
                    [
                        'id' => 3,
                        'name' => 'Edge Climb',
                        'description' => 'Example',
                        'display_order' => 1,
                        'tips' => [
                            ['id' => 47, 'text' => 'Tip A', 'sort_order' => 1],
                            ['id' => 48, 'text' => 'Tip B', 'sort_order' => 2],
                        ],
                        'videos' => [
                            ['id' => 3, 'url' => 'https://google.com', 'caption' => 'Edge Climb', 'sort_order' => 1],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->getJson('/api/content/movement-tech');

        $response->assertOk();
        $response->assertJsonCount(1, 'techniques');
        $response->assertJsonCount(2, 'techniques.0.tips');
        $response->assertJsonCount(1, 'techniques.0.videos');
    }
}
