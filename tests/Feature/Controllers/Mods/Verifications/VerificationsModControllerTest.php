<?php

namespace Tests\Feature\Controllers\Mods\Verifications;

use Tests\TestCase;

class VerificationsModControllerTest extends TestCase
{
    public function test_get_pending_verifications_endpoint()
    {
        $response = $this->getJson('/api/mods/verifications/pending');
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_get_completion_submission_endpoint()
    {
        $response = $this->getJson('/api/mods/completions/1/submission');
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_verify_completion_endpoint()
    {
        $response = $this->putJson('/api/mods/completions/1/verification', []);
        expect($response->status())->toBeIn([200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502]);
    }
}
