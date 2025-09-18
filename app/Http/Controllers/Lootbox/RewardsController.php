<?php

namespace App\Http\Controllers\Lootbox;

use Illuminate\Http\Request;

class RewardsController extends BaseLootboxController
{
    public function index(Request $request)
    {
        $query = array_filter(
            [
                'reward_type' => $request->query('reward_type'),
                'key_type' => $request->query('key_type'),
                'rarity' => $request->query('rarity'),
            ],
            static fn ($v) => $v !== null && $v !== '',
        );

        $res = $this->http()->get('/api/v3/lootbox/rewards', $query)->throw();

        return $this->passthrough($res);
    }

    public function userRewards(int $userId, Request $request)
    {
        $query = array_filter(
            [
                'reward_type' => $request->query('reward_type'),
                'key_type' => $request->query('key_type'),
                'rarity' => $request->query('rarity'),
            ],
            static fn ($v) => $v !== null && $v !== '',
        );

        $res = $this->http()
            ->get("/api/v3/lootbox/users/{$userId}/rewards", $query)
            ->throw();

        return $this->passthrough($res);
    }

    public function grantToUser(int $userId, string $keyType, string $rewardType, string $rewardName)
    {
        $path = "/api/v3/lootbox/users/{$userId}/{$keyType}/{$rewardType}/{$rewardName}";

        $res = $this->http()->post($path)->throw();

        return $this->passthrough($res);
    }
}
