<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

beforeEach(function () {
    config(['laravelcloudflare.enabled' => false]);

    Route::get('/_test/proxy', fn (Request $request) => [
        'secure' => $request->isSecure(),
        'ip' => $request->ip(),
        'url' => $request->url(),
    ]);
});

it('recognizes HTTPS and the client address forwarded by the VPS Caddy', function () {
    $this->withServerVariables([
        'REMOTE_ADDR' => '172.20.0.2',
        'HTTP_X_FORWARDED_PROTO' => 'https',
        'HTTP_X_FORWARDED_FOR' => '203.0.113.10',
    ])->get('http://genji.pk/_test/proxy')
        ->assertOk()
        ->assertJson([
            'secure' => true,
            'ip' => '203.0.113.10',
            'url' => 'https://genji.pk/_test/proxy',
        ]);
});

it('ignores forwarded headers sent directly by an untrusted client', function () {
    $this->withServerVariables([
        'REMOTE_ADDR' => '198.51.100.20',
        'HTTP_X_FORWARDED_PROTO' => 'https',
        'HTTP_X_FORWARDED_FOR' => '203.0.113.10',
    ])->get('/_test/proxy')
        ->assertOk()
        ->assertJson([
            'secure' => false,
            'ip' => '198.51.100.20',
        ]);
});
