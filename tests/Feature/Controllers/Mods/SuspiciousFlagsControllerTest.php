<?php

namespace Tests\Feature\Controllers\Mods;

use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SuspiciousFlagsControllerTest extends TestCase
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

    public function test_destroy_forwards_identifiers_to_the_upstream_api(): void
    {
        Http::fake([
            'https://example.test/api/v3/completions/suspicious' => Http::response(1, 200),
        ]);

        $response = $this->deleteJson('/api/mods/completions/suspicious', [
            'message_id' => '123456789012345678',
            'verification_id' => '42',
        ]);

        $response->assertOk();
        $response->assertContent('1');

        Http::assertSent(function (Request $request): bool {
            return $request->method() === 'DELETE'
                && $request->url() === 'https://example.test/api/v3/completions/suspicious'
                && $request['message_id'] === '123456789012345678'
                && $request['verification_id'] === '42';
        });
    }

    public function test_destroy_rejects_non_numeric_identifiers(): void
    {
        Http::fake();

        $response = $this->deleteJson('/api/mods/completions/suspicious', [
            'message_id' => 'not-an-id',
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('message_id');
        Http::assertNothingSent();
    }
}
