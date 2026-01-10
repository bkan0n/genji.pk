<?php

namespace App\Extensions;

use App\Services\GenjiApiService;
use SessionHandlerInterface;

class ApiSessionHandler implements SessionHandlerInterface
{
    protected GenjiApiService $api;

    public function __construct()
    {
        $this->api = app(GenjiApiService::class);
    }

    public function open(string $path, string $name): bool
    {
        return true;
    }

    public function close(): bool
    {
        return true;
    }

    public function read(string $id): string|false
    {
        $payload = $this->api->sessionRead($id);
        return $payload ?? '';
    }

    public function write(string $id, string $data): bool
    {
        // Try to extract user_id from session data
        $userId = null;
        $decoded = @unserialize($data);
        if (!is_array($decoded)) {
        $decoded = @unserialize(base64_decode($data));
        }
        if (is_array($decoded) && isset($decoded['user_id'])) {
        $userId = (int) $decoded['user_id'];
        }

        return $this->api->sessionWrite($id, $data, $userId);
    }

    public function destroy(string $id): bool
    {
        return $this->api->sessionDestroy($id);
    }

    public function gc(int $max_lifetime): int|false
    {
        return $this->api->sessionGc($max_lifetime);
    }
}
