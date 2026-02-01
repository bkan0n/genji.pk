<?php

namespace App\Http\Controllers\Notifications;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WebNotificationsController extends Controller
{
    private function http()
    {
        $root = rtrim((string) config('services.genji_api.root'), '/');
        $apiKey = (string) config('services.genji_api.key');

        $verify = config('services.genji_api.verify', true);
        if (is_string($verify)) {
            $verify = filter_var($verify, FILTER_VALIDATE_BOOLEAN);
        }

        return Http::baseUrl($root)
            ->asJson()
            ->withHeaders([
                'Accept' => 'application/json',
                'X-API-Key' => $apiKey,
            ])
            ->withOptions(['verify' => $verify])
            ->timeout(10);
    }

    private function userId(Request $request): int
    {
        $u = $request->user();
        if ($u) {
            return (int) ($u->user_id ?? $u->id ?? 0);
        }

        $sid = (int) $request->session()->get('user_id', 0);
        if ($sid > 0) return $sid;

        $su = $request->session()->get('user', null);
        if (is_array($su)) {
            return (int) ($su['user_id'] ?? $su['id'] ?? 0);
        }

        return 0;
    }

    private function jsonOk(array $payload = [], int $status = 200)
    {
        return response()->json($payload, $status);
    }

    private function passthroughSafe($response, array $fallback = ['ok' => true])
    {
        $status = (int) $response->status();

        if ($status === 204) {
            return $this->jsonOk($fallback, 200);
        }

        try {
            $json = $response->json();
        } catch (\Throwable $e) {
            $json = null;
        }

        if ($json === null) {
            return $this->jsonOk($fallback, 200);
        }

        return response()->json($json, $status);
    }

    // ─────────────────────────────────────────────────────────────
    // TRAY
    // ─────────────────────────────────────────────────────────────

    public function unreadCount(Request $request)
    {
        $userId = $this->userId($request);
        if ($userId <= 0) {
            return $this->jsonOk(['unread_count' => 0, 'count' => 0], 200);
        }

        try {
            $res = $this->http()->get("/api/v3/notifications/users/{$userId}/unread-count");
            $data = $res->json() ?? [];
            $count = (int) ($data['count'] ?? $data['unread_count'] ?? 0);

            return $this->jsonOk([
                'unread_count' => $count,
                'count' => $count,
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Notifications unreadCount proxy failed', ['error' => $e->getMessage()]);
            return $this->jsonOk(['unread_count' => 0, 'count' => 0], 200);
        }
    }

    public function events(Request $request)
    {
        $userId = $this->userId($request);
        if ($userId <= 0) {
            return $this->jsonOk(['events' => [], 'total' => null, 'has_more' => false], 200);
        }

        $limit = (int) $request->query('limit', 20);
        $offset = (int) $request->query('offset', 0);
        $unreadOnly = $request->query('unread_only', 'false');

        $limit = max(1, min($limit, 50));
        $offset = max(0, $offset);
        $unreadOnlyBool = filter_var($unreadOnly, FILTER_VALIDATE_BOOLEAN);

        try {
            $res = $this->http()->get("/api/v3/notifications/users/{$userId}/events", [
                'unread_only' => $unreadOnlyBool ? 'true' : 'false',
                'limit' => $limit,
                'offset' => $offset,
            ]);

            $data = $res->json();

            $events = is_array($data) ? $data : [];
            $hasMore = count($events) >= $limit;

            return $this->jsonOk([
                'events' => $events,
                'total' => null,
                'has_more' => $hasMore,
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Notifications events proxy failed', ['error' => $e->getMessage()]);
            return $this->jsonOk(['events' => [], 'total' => null, 'has_more' => false], 200);
        }
    }

    public function markRead(Request $request, int $eventId)
    {
        try {
            $res = $this->http()->patch("/api/v3/notifications/events/{$eventId}/read");
            return $this->passthroughSafe($res, ['ok' => true]);
        } catch (\Throwable $e) {
            Log::error('Notifications markRead proxy failed', ['eventId' => $eventId, 'error' => $e->getMessage()]);
            return $this->jsonOk(['ok' => false], 500);
        }
    }

    public function dismiss(Request $request, int $eventId)
    {
        try {
            $res = $this->http()->patch("/api/v3/notifications/events/{$eventId}/dismiss");
            return $this->passthroughSafe($res, ['ok' => true]);
        } catch (\Throwable $e) {
            Log::error('Notifications dismiss proxy failed', ['eventId' => $eventId, 'error' => $e->getMessage()]);
            return $this->jsonOk(['ok' => false], 500);
        }
    }

    public function markAllRead(Request $request)
    {
        $userId = $this->userId($request);
        if ($userId <= 0) {
            return $this->jsonOk(['ok' => true], 200);
        }

        try {
            $res = $this->http()->patch("/api/v3/notifications/users/{$userId}/read-all");
            return $this->passthroughSafe($res, ['ok' => true]);
        } catch (\Throwable $e) {
            Log::error('Notifications markAllRead proxy failed', ['error' => $e->getMessage()]);
            return $this->jsonOk(['ok' => false], 500);
        }
    }

    public function dismissAll(Request $request)
    {
        $userId = $this->userId($request);
        if ($userId <= 0) {
            return $this->jsonOk(['ok' => true], 200);
        }

        try {
            $res = $this->http()->patch("/api/v3/notifications/users/{$userId}/dismiss-all");
            return $this->passthroughSafe($res, ['ok' => true]);
        } catch (\Throwable $e) {
            Log::error('Notifications dismissAll proxy failed', ['error' => $e->getMessage()]);
            return $this->jsonOk(['ok' => false], 500);
        }
    }

    // ─────────────────────────────────────────────────────────────
    // PREFERENCES
    // ─────────────────────────────────────────────────────────────

    public function preferences(Request $request)
    {
        $userId = $this->userId($request);
        if ($userId <= 0) {
            return $this->jsonOk(['preferences' => []], 200);
        }

        try {
            $res = $this->http()->get("/api/v3/notifications/users/{$userId}/preferences");
            $data = $res->json();
            $prefs = is_array($data) ? $data : [];

            return $this->jsonOk(['preferences' => $prefs], 200);
        } catch (\Throwable $e) {
            Log::error('Notifications preferences proxy failed', ['error' => $e->getMessage()]);
            return $this->jsonOk(['preferences' => []], 200);
        }
    }

    public function updatePreference(Request $request, string $eventType, string $channel)
    {
        $userId = $this->userId($request);
        if ($userId <= 0) {
            return $this->jsonOk(['ok' => false], 401);
        }

        $enabled = $request->query('enabled', null);
        if ($enabled === null) {
            $enabled = $request->input('enabled', null);
        }

        $enabledBool = filter_var($enabled, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        if ($enabledBool === null) {
            return $this->jsonOk(['ok' => false, 'message' => 'enabled is required (true/false)'], 422);
        }

        try {
            $url = "/api/v3/notifications/users/{$userId}/preferences/{$eventType}/{$channel}?enabled=" . ($enabledBool ? 'true' : 'false');
            $res = $this->http()->put($url, []); // body vide, doc => query param
            return $this->passthroughSafe($res, ['ok' => true]);
        } catch (\Throwable $e) {
            Log::error('Notifications updatePreference proxy failed', [
                'eventType' => $eventType,
                'channel' => $channel,
                'error' => $e->getMessage(),
            ]);
            return $this->jsonOk(['ok' => false], 500);
        }
    }

    public function bulkUpdatePreferences(Request $request)
    {
        $userId = $this->userId($request);
        if ($userId <= 0) {
            return $this->jsonOk(['ok' => false], 401);
        }

        $payload = $request->all();
        if (!is_array($payload)) {
            return $this->jsonOk(['ok' => false, 'message' => 'Body must be an array'], 422);
        }

        foreach ($payload as $i => $row) {
            if (!is_array($row)) {
                return $this->jsonOk(['ok' => false, 'message' => "Row {$i} must be an object"], 422);
            }
            if (!isset($row['event_type'], $row['channel'], $row['enabled'])) {
                return $this->jsonOk(['ok' => false, 'message' => "Row {$i} requires event_type, channel, enabled"], 422);
            }
        }

        try {
            $res = $this->http()->put("/api/v3/notifications/users/{$userId}/preferences/bulk", $payload);
            return $this->passthroughSafe($res, ['ok' => true]);
        } catch (\Throwable $e) {
            Log::error('Notifications bulkUpdatePreferences proxy failed', ['error' => $e->getMessage()]);
            return $this->jsonOk(['ok' => false], 500);
        }
    }

    public function shouldDeliver(Request $request)
    {
        $userId = $this->userId($request);
        if ($userId <= 0) {
            return $this->jsonOk(['should_deliver' => false], 200);
        }

        $eventType = (string) $request->query('event_type', '');
        $channel = (string) $request->query('channel', '');

        if ($eventType === '' || $channel === '') {
            return $this->jsonOk(['should_deliver' => false, 'message' => 'event_type and channel are required'], 422);
        }

        try {
            $res = $this->http()->get("/api/v3/notifications/users/{$userId}/should-deliver", [
                'event_type' => $eventType,
                'channel' => $channel,
            ]);

            return $this->passthroughSafe($res, ['should_deliver' => false]);
        } catch (\Throwable $e) {
            Log::error('Notifications shouldDeliver proxy failed', ['error' => $e->getMessage()]);
            return $this->jsonOk(['should_deliver' => false], 200);
        }
    }
}
