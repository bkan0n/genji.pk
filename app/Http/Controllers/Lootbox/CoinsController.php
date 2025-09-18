<?php

namespace App\Http\Controllers\Lootbox;

class CoinsController extends BaseLootboxController
{
    public function balance(int $userId)
    {
        $res = $this->http()
            ->post("/api/v3/lootbox/users/{$userId}/coins")
            ->throw();

        return $this->passthrough($res);
    }
}
