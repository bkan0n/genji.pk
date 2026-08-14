<?php

declare(strict_types=1);

namespace Tests\Feature\Security;

use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Monicahq\Cloudflare\Http\Middleware\TrustProxies;
use Tests\TestCase;

final class RouteUserOwnershipTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(TrustProxies::class);

        config([
            'services.genji_api.root' => 'https://genji-api.test',
            'services.genji_api.key' => 'test-key',
            'services.genji_api.verify' => false,
        ]);

        Http::preventStrayRequests();
    }

    public function test_anonymous_users_cannot_reach_user_scoped_mutations(): void
    {
        Http::fake();

        $this->putJson('/api/users/123/overwatch', ['usernames' => []])->assertUnauthorized();
        $this->patchJson('/api/users/123/notifications/NONE')->assertUnauthorized();
        $this->putJson('/api/users/123/rank-card/avatar/pose', ['pose' => 'heroic'])
            ->assertUnauthorized();
        $this->postJson('/api/maps/playtests/1/vote/123', ['difficulty' => 2])
            ->assertUnauthorized();
        $this->getJson('/api/lootbox/users/123/keys/Classic')->assertUnauthorized();

        $this->assertNoProtectedMutationWasForwarded();
    }

    public function test_authenticated_users_cannot_mutate_a_different_user(): void
    {
        Http::fake();
        $session = withSessionUser(['user_id' => '123', 'user' => ['id' => '123']]);

        $this->withSession($session)
            ->putJson('/api/users/456/overwatch', ['usernames' => []])
            ->assertForbidden();
        $this->withSession($session)
            ->patchJson('/api/users/456/notifications/NONE')
            ->assertForbidden();
        $this->withSession($session)
            ->putJson('/api/users/456/rank-card/avatar/skin', ['skin' => 'Overwatch 1'])
            ->assertForbidden();
        $this->withSession($session)
            ->putJson('/api/users/456/rank-card/background', ['name' => 'Default'])
            ->assertForbidden();
        $this->withSession($session)
            ->putJson('/api/users/456/rank-card/badges', [])
            ->assertForbidden();
        $this->withSession($session)
            ->postJson('/api/maps/playtests/1/vote/456', ['difficulty' => 2])
            ->assertForbidden();
        $this->withSession($session)
            ->postJson('/api/lootbox/users/456/Classic/skin/Test', [])
            ->assertForbidden();
        $this->withSession($session)
            ->getJson('/api/lootbox/users/456/keys/Classic')
            ->assertForbidden();

        $this->assertNoProtectedMutationWasForwarded();
    }

    public function test_matching_snowflake_is_forwarded_without_integer_casting(): void
    {
        $userId = '1234567890123456789';

        Http::fake([
            'https://genji-api.test/api/v3/maps/playtests/7/vote/*' => Http::response(
                ['created' => true],
                201,
            ),
        ]);

        $this->withSession(withSessionUser([
            'user_id' => $userId,
            'user' => ['id' => $userId],
        ]))
            ->postJson("/api/maps/playtests/7/vote/{$userId}", ['difficulty' => 2])
            ->assertCreated()
            ->assertJsonPath('created', true);

        Http::assertSent(fn (Request $request): bool => $request->url()
            === "https://genji-api.test/api/v3/maps/playtests/7/vote/{$userId}");
    }

    public function test_numeric_ids_are_compared_as_exact_strings(): void
    {
        Http::fake();

        $this->withSession(withSessionUser(['user_id' => '123']))
            ->postJson('/api/maps/playtests/1/vote/0123', ['difficulty' => 2])
            ->assertForbidden();

        $this->assertNoProtectedMutationWasForwarded();
    }

    private function assertNoProtectedMutationWasForwarded(): void
    {
        Http::assertNotSent(
            fn (Request $request): bool => collect([
                '/api/v3/users/',
                '/api/v3/maps/playtests/',
                '/api/v3/lootbox/users/',
            ])->contains(
                fn (string $path): bool => str_contains($request->url(), $path),
            ),
        );
    }
}
