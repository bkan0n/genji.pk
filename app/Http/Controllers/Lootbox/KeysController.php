<?php

namespace App\Http\Controllers\Lootbox;

use Illuminate\Http\Request;

class KeysController extends BaseLootboxController
{
    public function index(Request $request)
    {
        $query = array_filter(
            [
                'key_type' => $request->query('key_type'),
            ],
            static fn ($v) => $v !== null && $v !== '',
        );

        $res = $this->http()->get('/api/v3/lootbox/keys', $query)->throw();

        return $this->passthrough($res);
    }

    public function userKeys(int $userId, Request $request)
    {
        $query = array_filter(
            [
                'key_type' => $request->query('key_type'),
            ],
            static fn ($v) => $v !== null && $v !== '',
        );

        $res = $this->http()
            ->get("/api/v3/lootbox/users/{$userId}/keys", $query)
            ->throw();

        return $this->passthrough($res);
    }

    public function drawForUser(int $userId, string $keyType, Request $request)
    {
        $amount = (int) $request->query('amount', 3);

        $res = $this->http()
            ->get("/api/v3/lootbox/users/{$userId}/keys/{$keyType}", ['amount' => $amount])
            ->throw();

        return $this->passthrough($res);
    }
}
