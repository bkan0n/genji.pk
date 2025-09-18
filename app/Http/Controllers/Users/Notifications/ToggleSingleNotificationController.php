<?php

declare(strict_types=1);

namespace App\Http\Controllers\Users\Notifications;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;
use Throwable;

final class ToggleSingleNotificationController extends Controller
{
    private const TYPES = [
        'NONE',
        'DM_ON_VERIFICATION',
        'DM_ON_SKILL_ROLE_UPDATE',
        'DM_ON_LOOTBOX_GAIN',
        'DM_ON_RECORDS_REMOVAL',
        'DM_ON_PLAYTEST_ALERTS',
        'PING_ON_XP_GAIN',
        'PING_ON_MASTERY',
        'PING_ON_COMMUNITY_RANK_UPDATE',
    ];

    public function __invoke(int $user_id, string $notification_type, Request $request): JsonResponse
    {
        validator(
            ['notification_type' => $notification_type],
            ['notification_type' => [Rule::in(self::TYPES)]],
            ['notification_type.in' => 'Invalid notification type.'],
        )->validate();

        $rawBody = trim((string) $request->getContent());
        $enabled = null;

        if ($rawBody !== '') {
            if (strcasecmp($rawBody, 'true') === 0 || $rawBody === '1') {
                $enabled = true;
            } elseif (strcasecmp($rawBody, 'false') === 0 || $rawBody === '0') {
                $enabled = false;
            }
        } elseif ($request->has('enabled')) {
            $request->validate(['enabled' => ['required', 'boolean']]);
            $enabled = $request->boolean('enabled');
        }

        if (! is_bool($enabled)) {
            return response()->json(
                [
                    'error' => true,
                    'message' => 'Request body must be a JSON boolean (true/false).',
                ],
                422,
            );
        }

        $root = rtrim((string) config('services.genji_api.root', ''), '/');
        $key = (string) config('services.genji_api.key', '');
        $verify = (bool) config('services.genji_api.verify', true);

        if ($root === '' || $key === '') {
            return response()->json(
                [
                    'error' => true,
                    'message' => 'API configuration is missing.',
                ],
                500,
            );
        }

        $endpoint = "{$root}/api/v3/users/{$user_id}/notifications/{$notification_type}";

        try {
            $payload = $enabled ? 'true' : 'false';

            $res = Http::withOptions(['verify' => $verify])
                ->acceptJson()
                ->withHeaders([
                    'X-API-KEY' => $key,
                    'Content-Type' => 'application/json',
                ])
                ->withBody($payload, 'application/json')
                ->patch($endpoint);

            if (! $res->successful()) {
                return response()->json(
                    [
                        'error' => true,
                        'message' => "API request failed with status code {$res->status()}",
                        'response' => $res->json() ?? $res->body(),
                    ],
                    $res->status(),
                );
            }

            $data = $res->json();

            return response()->json(is_array($data) ? $data : (object) []);
        } catch (Throwable $e) {
            return response()->json(
                [
                    'error' => true,
                    'message' => 'Failed to update notification: ' . $e->getMessage(),
                ],
                502,
            );
        }
    }
}
