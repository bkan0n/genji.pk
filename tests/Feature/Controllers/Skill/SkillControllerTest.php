<?php

namespace Tests\Feature\Controllers\Skill;

use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SkillControllerTest extends TestCase
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

    public function test_user_skill_summary_is_proxied_and_keeps_user_id_as_a_string(): void
    {
        Http::fake([
            'https://genji-api.test/api/v3/skill/users/123456789012345678' => Http::response([
                'user_id' => 123456789012345678,
                'skill_score' => 42.75,
                'tier' => 4,
                'skill_tier_name' => 'Emerald',
            ]),
        ]);

        $this->getJson('/api/skill/users/123456789012345678')
            ->assertOk()
            ->assertJsonPath('user_id', '123456789012345678')
            ->assertJsonPath('skill_score', 42.75);
    }

    public function test_user_skill_breakdown_and_tiers_are_proxied(): void
    {
        Http::fake([
            'https://genji-api.test/api/v3/skill/users/42/breakdown' => Http::response([
                ['map_name' => 'Eichenwalde', 'contribution' => 9.5],
            ]),
            'https://genji-api.test/api/v3/skill/tiers' => Http::response([
                'boundaries' => [10, 20, 30, 40, 50, 60, 70],
                'percentiles' => [0.1, 0.2, 0.3, 0.4, 0.5, 0.7, 0.9],
            ]),
        ]);

        $this->getJson('/api/skill/users/42/breakdown')
            ->assertOk()
            ->assertJsonPath('0.map_name', 'Eichenwalde');

        $this->getJson('/api/skill/tiers')
            ->assertOk()
            ->assertJsonCount(7, 'percentiles');
    }

    public function test_public_skill_config_is_proxied_read_only(): void
    {
        Http::fake([
            'https://genji-api.test/api/v3/skill/config' => Http::response([
                'diff_base' => 1.44,
                'gamma' => 0.68,
                'time_bonus' => 0.55,
                'shrink_k' => 10,
                'wr_bonus' => 0.1,
                'partial_factor' => 0.6,
                'medal_gold' => 1.12,
                'medal_silver' => 1.07,
                'medal_bronze' => 1.03,
            ]),
        ]);

        $this->getJson('/api/skill/config')
            ->assertOk()
            ->assertJsonPath('diff_base', 1.44)
            ->assertJsonPath('gamma', 0.68)
            ->assertJsonPath('shrink_k', 10);

        Http::assertSent(fn (Request $request): bool => $request->method() === 'GET'
            && $request->url() === 'https://genji-api.test/api/v3/skill/config');
    }

    public function test_moderator_can_load_and_update_skill_config(): void
    {
        Http::fake([
            'https://genji-api.test/api/v3/skill/config' => Http::response([
                'diff_base' => 1,
                'gamma' => 0.8,
            ]),
        ]);

        $this->getJson('/api/mods/skill/config')
            ->assertOk()
            ->assertJsonPath('gamma', 0.8);

        $this->patchJson('/api/mods/skill/config', [
            'gamma' => 0.75,
            'wr_bonus' => 2,
        ])->assertOk();

        Http::assertSent(function (Request $request): bool {
            return $request->method() === 'PATCH'
                && $request->url() === 'https://genji-api.test/api/v3/skill/config'
                && $request['gamma'] === 0.75
                && $request['wr_bonus'] === 2;
        });
    }

    public function test_skill_config_rejects_gamma_below_floor(): void
    {
        Http::fake();

        $this->patchJson('/api/mods/skill/config', ['gamma' => 0.49])
            ->assertStatus(422)
            ->assertJsonValidationErrors('gamma');

        Http::assertNothingSent();
    }

    public function test_skill_tiers_require_seven_strictly_increasing_percentiles(): void
    {
        Http::fake([
            'https://genji-api.test/api/v3/skill/tiers' => Http::response([
                'percentiles' => [0.1, 0.2, 0.3, 0.4, 0.5, 0.7, 0.9],
            ]),
        ]);

        $this->patchJson('/api/mods/skill/tiers', [
            'percentiles' => [0.1, 0.2, 0.2, 0.4, 0.5, 0.7, 0.9],
        ])->assertStatus(400);

        $this->patchJson('/api/mods/skill/tiers', [
            'percentiles' => [0.1, 0.2, 0.3, 0.4, 0.5, 0.7, 0.9],
        ])->assertOk();

        Http::assertSent(function (Request $request): bool {
            return $request->method() === 'PATCH'
                && $request->url() === 'https://genji-api.test/api/v3/skill/tiers'
                && $request['percentiles'] === [0.1, 0.2, 0.3, 0.4, 0.5, 0.7, 0.9];
        });
    }
}
