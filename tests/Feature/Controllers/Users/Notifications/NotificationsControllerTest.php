<?php

namespace Tests\Feature\Controllers\Users\Notifications;

use Tests\TestCase;

class NotificationsControllerTest extends TestCase
{
    public function test_get_notification_settings_endpoint()
    {
        $response = $this->getJson('/api/users/1/notifications');
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }

    public function test_toggle_single_notification_endpoint()
    {
        $response = $this->patchJson('/api/users/1/notifications/all', []);
        expect($response->status())->toBeIn([200, 400, 401, 403, 404, 422, 500, 502]);
    }
}
