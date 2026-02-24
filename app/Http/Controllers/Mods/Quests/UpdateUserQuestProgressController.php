<?php

namespace App\Http\Controllers\Mods\Quests;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class UpdateUserQuestProgressController extends Controller
{
    public function __invoke(Request $request, string $user_id, int $progress_id)
    {
        $validator = Validator::make([
            'user_id'     => $user_id,
            'progress_id' => $progress_id,
        ], [
            'user_id'     => ['required', 'regex:/^\d+$/'],
            'progress_id' => ['required', 'integer', 'min:1'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Bad request',
                'errors'  => $validator->errors(),
            ], 400);
        }

        $apiRoot   = rtrim((string) config('services.genji_api.root', ''), '/');
        $apiKey    = (string) config('services.genji_api.key', '');
        $sslVerify = (bool) config('services.genji_api.verify', true);

        if ($apiRoot === '') {
            return response()->json(['message' => 'Genji API not configured'], 500);
        }

        $endpoint = $apiRoot . '/api/v3/store/admin/users/' . $user_id . '/quests/' . $progress_id;

        $payload = $request->only(['completed', 'claimed', 'quest_data', 'progress']);

        if (isset($payload['progress']) && is_array($payload['progress'])) {
            if (array_key_exists('details', $payload['progress']) && is_array($payload['progress']['details'])) {
                $payload['progress']['details'] = (object) [];
            }
        }

        $forceStringDigits = function (&$arr, string $key) {
            if (!is_array($arr) || !array_key_exists($key, $arr) || $arr[$key] === null) return;
            $v = $arr[$key];
            if (is_int($v)) {
                $arr[$key] = (string) $v;
                return;
            }
            if (is_float($v)) {
                $arr[$key] = rtrim(rtrim(sprintf('%.0f', $v), '0'), '.');
                return;
            }
            if (is_string($v)) {
                $arr[$key] = preg_replace('/\D+/', '', $v) ?? $v;
                return;
            }
        };

        if (isset($payload['quest_data']) && is_array($payload['quest_data'])) {
            if (isset($payload['quest_data']['requirements']) && is_array($payload['quest_data']['requirements'])) {
                $forceStringDigits($payload['quest_data']['requirements'], 'rival_user_id');
            }
        }

        if (isset($payload['progress']) && is_array($payload['progress'])) {
            $forceStringDigits($payload['progress'], 'rival_user_id');
        }

        try {
            $resp = Http::withHeaders([
                    'Accept'       => 'application/json',
                    'Content-Type' => 'application/json',
                    'X-API-KEY'    => $apiKey,
                ])
                ->withOptions(['verify' => $sslVerify, 'timeout' => 12])
                ->send('PATCH', $endpoint, [
                    'json' => $payload,
                ]);

            return response()->json($resp->json() ?? [], $resp->status() ?: 502);
        } catch (\Throwable $e) {
            Log::error('Update user quest progress upstream exception', [
                'error'       => $e->getMessage(),
                'user_id'     => $user_id,
                'progress_id' => $progress_id,
            ]);

            return response()->json([
                'message' => 'Upstream exception',
                'error'   => $e->getMessage(),
            ], 502);
        }
    }
}