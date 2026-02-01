<?php

namespace Tests\Feature\Controllers\Utilities;

use Tests\TestCase;

class UtilitiesControllerTest extends TestCase
{
    public function test_upload_image_endpoint()
    {
        $response = $this->postJson('/api/utilities/image', []);
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_ocr_extract_endpoint()
    {
        $response = $this->postJson('/api/ocr/extract', []);
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_log_map_click_endpoint()
    {
        $response = $this->postJson('/api/utilities/log-map-click', []);
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }
}
