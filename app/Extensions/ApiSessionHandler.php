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
        return is_string($payload) ? $payload : '';
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

        return $this->api->sessionWrite($sessionId, $payload, $userId, $ip, $ua);
    }

    public function destroy($sessionId): bool
    {
        return $this->api->sessionDestroy((string) $sessionId);
    }

    public function gc($maxLifetime): int
    {
        return $this->api->sessionGc((int) $maxLifetime);
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
}
