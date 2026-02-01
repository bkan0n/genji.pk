<?php

use Tests\TestCase;

uses(TestCase::class)->in('Feature', 'Unit');

/**
 * Helper: simule un user "connecté" via tes sessions custom (pas Auth::user()).
 */
function withSessionUser(array $overrides = []): array
{
    $base = [
        'user_id' => '123',
        'user_provider' => 'email',
        'user' => [
            'id' => 123,
            'email' => 'user@example.test',
            'username' => 'User',
            'email_verified' => true,
            'coins' => 0,
            'auth_type' => 'email',
            'is_mod' => false,
        ],
        'is_mod' => false,
        'can_moderate' => false,
    ];

    return array_replace_recursive($base, $overrides);
}

beforeEach(function () {
    config(['session.driver' => 'array']);
    $api = Mockery::mock(GenjiApiService::class);

    $api->shouldReceive('sessionRead')
        ->andReturn('');

    $api->shouldReceive('sessionWrite')
        ->andReturnTrue();

    $api->shouldReceive('sessionDestroy')
        ->andReturnTrue();

    $api->shouldReceive('sessionGc')
        ->andReturnTrue();

    app()->instance(GenjiApiService::class, $api);
});