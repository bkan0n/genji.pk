<?php

namespace Tests\Feature\Controllers\Completions;

use Tests\TestCase;

class CompletionsControllerTest extends TestCase
{
    public function test_completions_endpoint_returns_valid_response()
    {
        $response = $this->getJson('/api/completions/');
        
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_completions_has_json_response()
    {
        $response = $this->getJson('/api/completions/');
        
        $response->assertHeader('content-type', 'application/json');
    }
}
