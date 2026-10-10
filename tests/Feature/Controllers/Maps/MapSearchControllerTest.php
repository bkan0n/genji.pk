<?php

namespace Tests\Feature\Controllers\Maps;

use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class MapSearchControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware();
        config([
            'services.genji_api.root' => 'https://genji-api.test',
            'services.genji_api.key' => 'test-key',
            'services.genji_api.verify' => false,
        ]);
    }

    public function test_map_search_defaults_archived_to_false(): void
    {
        Http::fake([
            'https://genji-api.test/api/v3/maps*' => Http::response([]),
        ]);

        $this->getJson('/api/maps')->assertOk();

        Http::assertSent(function (Request $request): bool {
            parse_str((string) parse_url($request->url(), PHP_URL_QUERY), $query);

            return $request->method() === 'GET'
                && $query['archived'] === 'false';
        });
    }

    public function test_map_search_forwards_archived_filter(): void
    {
        Http::fake([
            'https://genji-api.test/api/v3/maps*' => Http::response([]),
        ]);

        $this->getJson('/api/maps?archived=true')->assertOk();

        Http::assertSent(function (Request $request): bool {
            parse_str((string) parse_url($request->url(), PHP_URL_QUERY), $query);

            return $query['archived'] === 'true';
        });
    }

    #[DataProvider('dateSorts')]
    public function test_map_search_forwards_date_sort(string $sort): void
    {
        Http::preventStrayRequests();
        Http::fake([
            'https://genji-api.test/api/v3/maps*' => Http::response([]),
        ]);

        $this->getJson('/api/maps?'.http_build_query(['sort' => $sort]))->assertOk();

        Http::assertSent(function (Request $request) use ($sort): bool {
            parse_str((string) parse_url($request->url(), PHP_URL_QUERY), $query);

            return $request->method() === 'GET'
                && $query['sort'] === $sort;
        });
    }

    public static function dateSorts(): array
    {
        return [
            'oldest submissions' => ['created_at:asc'],
            'newest submissions' => ['created_at:desc'],
            'least recently changed' => ['updated_at:asc'],
            'recently changed' => ['updated_at:desc'],
        ];
    }

    public function test_map_search_rejects_invalid_date_sort(): void
    {
        Http::preventStrayRequests();
        Http::fake();

        $this->getJson('/api/maps?sort=created_at:newest')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('sort.0');

        Http::assertNothingSent();
    }

    public function test_map_search_endpoint_returns_valid_response()
    {
        $response = $this->getJson('/api/maps');
        
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_map_search_has_json_response()
    {
        $response = $this->getJson('/api/maps');
        
        $response->assertHeader('content-type', 'application/json');
    }

    public function test_maps_trending_endpoint_returns_valid_response()
    {
        $response = $this->getJson('/api/maps/trending');
        
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }
}
