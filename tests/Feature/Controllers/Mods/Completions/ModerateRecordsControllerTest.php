<?php

namespace Tests\Feature\Controllers\Mods\Completions;

use Tests\TestCase;

class ModerateRecordsControllerTest extends TestCase
{
    private array $ok = [200, 300, 301, 302, 303, 304, 305, 400, 401, 403, 404, 422, 500, 502];

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware();
    }

    public function test_list_moderation_records_endpoint()
    {
        $response = $this->getJson('/api/mods/completions/moderation/records?verification_status=All');
        expect($response->status())->toBeIn($this->ok);
    }

    public function test_list_moderation_records_rejects_bad_status()
    {
        $response = $this->getJson('/api/mods/completions/moderation/records?verification_status=Nope');
        expect($response->status())->toBe(422);
    }

    public function test_list_moderation_records_accepts_string_latest_only()
    {
        // The JS client sends latest_only as the string "true"/"false"; validation must accept it (not 422).
        $response = $this->getJson('/api/mods/completions/moderation/records?verification_status=All&latest_only=true');
        expect($response->status())->not->toBe(422);
    }

    public function test_moderate_completion_requires_moderated_by()
    {
        $response = $this->putJson('/api/mods/completions/1/moderate', []);
        expect($response->status())->toBe(422);
    }

    public function test_moderate_completion_endpoint()
    {
        $response = $this->putJson('/api/mods/completions/1/moderate', ['moderated_by' => 123]);
        expect($response->status())->toBeIn($this->ok);
    }
}
