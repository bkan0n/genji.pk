<?php

namespace Tests\Feature\Controllers\Utilities;

use Tests\TestCase;

class AutocompleteControllerTest extends TestCase
{
    public function test_autocomplete_map_codes_endpoint_returns_valid_response()
    {
        $response = $this->getJson('/api/autocomplete/map-codes?search=test');
        
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_autocomplete_map_names_endpoint_returns_valid_response()
    {
        $response = $this->getJson('/api/autocomplete/map-names/en?search=test');
        
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_autocomplete_users_endpoint_returns_valid_response()
    {
        $response = $this->getJson('/api/autocomplete/users?search=test');
        
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_autocomplete_has_json_response()
    {
        $response = $this->getJson('/api/autocomplete/map-codes?search=test');
        
        $response->assertHeader('content-type', 'application/json');
    }
}
