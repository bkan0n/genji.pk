<?php

namespace App\Extensions;

use App\Services\GenjiApiService;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use SessionHandlerInterface;
use Throwable;

class ApiSessionHandler implements SessionHandlerInterface
{
    public function __construct(private GenjiApiService $api)
    {
    }

    public function open($savePath, $sessionName): bool
    {
        return true;
    }

    public function close(): bool
    {
        return true;
    }

    public function read($sessionId): string
    {
        $payload = $this->api->sessionRead((string) $sessionId);
        $value = is_string($payload) ? $payload : '';
        $this->debug('read', [
            'session_id' => $this->hashId((string) $sessionId),
            'payload_len' => strlen($value),
        ]);

        return $value;
    }

    public function write($sessionId, $data): bool
    {
        $sessionId = (string) $sessionId;
        $payload = (string) $data;

        $userId = $this->extractUserIdFromPayload($payload);

        if ($userId === null) {
            try {
                if (function_exists('session')) {
                    $sid = session('user_id');
                    if ($sid !== null && $sid !== '') {
                        $userId = (string) $sid;
                    }
                }
            } catch (Throwable $e) {
                // ignore
            }
        }

        $ip = null;
        $ua = null;
        try {
            if (function_exists('request')) {
                $req = request();
                if ($req) {
                    $ip = method_exists($req, 'ip') ? $req->ip() : null;
                    $ua = method_exists($req, 'userAgent') ? $req->userAgent() : null;
                }
            }
        } catch (Throwable $e) {
            // ignore
        }

        $ok = $this->api->sessionWrite($sessionId, $payload, $userId, $ip, $ua);
        $this->debug('write', [
            'session_id' => $this->hashId($sessionId),
            'payload_len' => strlen($payload),
            'user_id' => $this->safeUserId($userId),
            'ok' => $ok,
        ]);

        return $ok;
    }

    public function destroy($sessionId): bool
    {
        $ok = $this->api->sessionDestroy((string) $sessionId);
        $this->debug('destroy', [
            'session_id' => $this->hashId((string) $sessionId),
            'ok' => $ok,
        ]);

        return $ok;
    }

    public function gc($maxLifetime): int
    {
        $count = $this->api->sessionGc((int) $maxLifetime);
        $this->debug('gc', [
            'max_lifetime' => (int) $maxLifetime,
            'count' => $count,
        ]);

        return $count;
    }

    private function extractUserIdFromPayload(string $payload): int|string|null
    {
        $plain = (string) $payload;

        try {
            $decrypted = Crypt::decryptString($payload);
            if (is_string($decrypted) && $decrypted !== '') {
                $plain = $decrypted;
            }
        } catch (Throwable $e) {
            // ignore
        }
        $data = null;

        try {
            $data = @unserialize($plain);
        } catch (Throwable $e) {
            $data = null;
        }

        if (!is_array($data)) {
            $json = json_decode($plain, true);
            if (is_array($json)) {
                $data = $json;
            }
        }

        if (!is_array($data)) {
            return null;
        }

        $uid = $data['user_id'] ?? null;

        if ($uid === null && isset($data['user']) && is_array($data['user'])) {
            $uid = $data['user']['id'] ?? null;
        }
        if ($uid === null && isset($data['user']) && is_object($data['user'])) {
            $uid = $data['user']->id ?? null;
        }

        if ($uid === null || $uid === '') {
            return null;
        }

        if (is_numeric($uid)) {
            return (int) $uid;
        }

        return (string) $uid;
    }

    private function debug(string $event, array $data = []): void
    {
        if (!filter_var(env('SESSION_HANDLER_DEBUG', false), FILTER_VALIDATE_BOOLEAN)) {
            return;
        }

        try {
            Log::build([
                'driver' => 'single',
                'path' => storage_path('logs/session-handler-debug.log'),
            ])->debug('session_handler', array_merge(['event' => $event], $data));
        } catch (Throwable $e) {
            // ignore
        }
    }

    private function hashId(string $value): string
    {
        if ($value === '') {
            return '';
        }

        return substr(hash('sha256', $value), 0, 12);
    }

    private function safeUserId(int|string|null $userId): int|string|null
    {
        if ($userId === null || $userId === '') {
            return null;
        }

        if (is_int($userId)) {
            return $userId;
        }

        $value = (string) $userId;
        return $value === '' ? null : $value;
    }
}
