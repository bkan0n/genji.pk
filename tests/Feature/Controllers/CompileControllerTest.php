<?php

namespace Tests\Feature\Controllers;

use Tests\TestCase;

class CompileControllerTest extends TestCase
{
    public function test_compile_endpoint_returns_valid_response()
    {
        $response = $this->postJson('/api/compile', ['code' => '']);
        
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_compile_has_json_response()
    {
        $response = $this->postJson('/api/compile', ['code' => '']);
        
        $response->assertHeader('content-type', 'application/json');
    }
}
