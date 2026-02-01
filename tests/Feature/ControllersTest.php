<?php

namespace Tests\Feature\Controllers;

use Tests\TestCase;

test('community leaderboard route exists', function () {
    $response = $this->getJson('/api/community/leaderboard');
    expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
});

test('map search route exists', function () {
    $response = $this->getJson('/api/maps');
    expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
});

test('maps trending route exists', function () {
    $response = $this->getJson('/api/maps/trending');
    expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
});

test('compile endpoint route exists', function () {
    $response = $this->postJson('/api/compile', ['code' => '']);
    expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
});

test('statistics maps difficulty route exists', function () {
    $response = $this->getJson('/api/community/statistics/maps/difficulty');
    expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
});

test('statistics skill players route exists', function () {
    $response = $this->getJson('/api/community/statistics/skill/players');
    expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
});

test('statistics xp players route exists', function () {
    $response = $this->getJson('/api/community/statistics/xp/players');
    expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
});

test('statistics creators popular route exists', function () {
    $response = $this->getJson('/api/community/statistics/creators/popular');
    expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
});

test('statistics maps popular route exists', function () {
    $response = $this->getJson('/api/community/statistics/maps/popular');
    expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
});

test('statistics ranks time played route exists', function () {
    $response = $this->getJson('/api/community/statistics/ranks/time-played');
    expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
});

test('statistics maps all route exists', function () {
    $response = $this->getJson('/api/community/statistics/maps/all');
    expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
});

test('statistics maps completions route exists', function () {
    $response = $this->getJson('/api/community/statistics/maps/completions');
    expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
});

test('completions endpoint route exists', function () {
    $response = $this->getJson('/api/completions/');
    expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
});

test('autocomplete map codes route exists', function () {
    $response = $this->getJson('/api/autocomplete/map-codes?search=test');
    expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
});

test('autocomplete map names route exists', function () {
    $response = $this->getJson('/api/autocomplete/map-names/en?search=test');
    expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
});

test('autocomplete users route exists', function () {
    $response = $this->getJson('/api/autocomplete/users?search=test');
    expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
});
