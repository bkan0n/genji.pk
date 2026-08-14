<?php

namespace Tests\Feature\Controllers\Completions;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class UserCompletionsControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.genji_api.root' => 'https://api.test',
            'services.genji_api.key' => 'test-key',
            'services.genji_api.verify' => false,
        ]);

        Http::fake([
            'api.test/*' => Http::response(['results' => [], 'total_results' => 0], 200),
        ]);
    }

    private function upstreamQuery(): array
    {
        $request = Http::recorded()[0][0] ?? null;
        $this->assertNotNull($request, 'Expected an upstream request to have been sent.');

        parse_str(parse_url($request->url(), PHP_URL_QUERY) ?? '', $query);

        return $query;
    }

    public function test_archived_filter_is_forwarded_upstream()
    {
        $response = $this->getJson('/api/completions?user_id=123&archived=not_archived');

        $response->assertOk();
        $this->assertSame('not_archived', $this->upstreamQuery()['archived'] ?? null);
    }

    public function test_archived_accepts_each_supported_value()
    {
        foreach (['all', 'archived', 'not_archived'] as $value) {
            Http::fake([
                'api.test/*' => Http::response(['results' => [], 'total_results' => 0], 200),
            ]);

            $this->getJson("/api/completions?user_id=123&archived={$value}")->assertOk();

            $this->assertSame($value, $this->upstreamQuery()['archived'] ?? null);
        }
    }

    public function test_archived_is_omitted_when_not_supplied()
    {
        $this->getJson('/api/completions?user_id=123')->assertOk();

        $this->assertArrayNotHasKey('archived', $this->upstreamQuery());
    }

    public function test_invalid_archived_value_is_rejected_without_calling_upstream()
    {
        $response = $this->getJson('/api/completions?user_id=123&archived=bogus');

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('archived');

        Http::assertNothingSent();
    }
}
