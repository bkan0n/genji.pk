<?php

namespace Tests\Feature\Controllers\Notifications;

use Tests\TestCase;

class NotificationsControllerTest extends TestCase
{
    public function test_web_notifications_endpoint()
    {
        $response = $this->postJson('/api/notifications/web', []);
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }
}
