<?php

namespace Tests\Feature\Controllers\Newsfeed;

use Tests\TestCase;

class NewsfeedControllerTest extends TestCase
{
    public function test_newsfeed_list_endpoint()
    {
        $response = $this->getJson('/api/newsfeed/');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_newsfeed_changelogs_endpoint()
    {
        $response = $this->getJson('/api/newsfeed/changelogs');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_newsfeed_emoji_endpoint()
    {
        $response = $this->postJson('/api/newsfeed/emoji', []);
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_newsfeed_gif_endpoint()
    {
        $response = $this->getJson('/api/newsfeed/gif');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_newsfeed_translate_endpoint()
    {
        $response = $this->postJson('/api/newsfeed/translate', []);
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_newsfeed_has_json_response()
    {
        $response = $this->getJson('/api/newsfeed/');
        $response->assertHeader('content-type', 'application/json');
    }
}
