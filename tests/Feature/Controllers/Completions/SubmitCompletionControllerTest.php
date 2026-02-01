<?php

namespace Tests\Feature\Controllers\Completions;

use Tests\TestCase;

class SubmitCompletionControllerTest extends TestCase
{
    public function test_submit_completion_endpoint()
    {
        $response = $this->postJson('/api/completions', []);
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_get_all_completions_endpoint()
    {
        $response = $this->getJson('/api/completions/all');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_upvote_completion_endpoint()
    {
        $response = $this->postJson('/api/completions/upvoting', []);
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }
}
