<?php

namespace Tests\Feature\Controllers\Maps;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PlaytestVoteControllerTest extends TestCase
{
    public function test_it_returns_detailed_playtest_votes(): void
    {
        $this->withoutMiddleware(\Monicahq\Cloudflare\Http\Middleware\TrustProxies::class);

        config([
            'services.genji_api.root' => 'https://genji-api.test',
            'services.genji_api.key' => 'test-key',
            'services.genji_api.verify' => false,
        ]);

        Http::fake([
            'https://genji-api.test/api/v3/maps/playtests/4378/votes' => Http::response([
                'votes' => [
                    [
                        'difficulty' => 4.71,
                        'name' => 'Player',
                        'user_id' => 685075454503419934,
                    ],
                ],
                'average' => 4.71,
            ]),
        ]);

        $response = $this->getJson('/api/maps/playtests/4378/votes');

        $response
            ->assertOk()
            ->assertJsonPath('votes.0.user_id', '685075454503419934')
            ->assertJsonPath('votes.0.difficulty', 4.71)
            ->assertJsonPath('votes.0.name', 'Player');

        Http::assertSent(
            fn ($request) => $request->url() ===
                'https://genji-api.test/api/v3/maps/playtests/4378/votes'
                && $request->hasHeader('X-API-KEY', 'test-key'),
        );
    }
}
