<?php

namespace App\Http\Controllers\Tournament;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class GetTournamentLeaderboardController extends BaseTournamentController
{
    public function __invoke(Request $request, int $cycle): JsonResponse|Response
    {
        return $this->proxy('get', "/cycles/{$cycle}/leaderboard", 'tournaments.leaderboard.show', context: [
            'cycle_id' => $cycle,
        ]);
    }
}
