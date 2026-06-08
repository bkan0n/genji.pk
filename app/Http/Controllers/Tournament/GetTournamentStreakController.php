<?php

namespace App\Http\Controllers\Tournament;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class GetTournamentStreakController extends BaseTournamentController
{
    public function __invoke(Request $request, string $user): JsonResponse|Response
    {
        return $this->proxy('get', '/streaks/' . rawurlencode($user), 'tournaments.streaks.show', context: [
            'user_id' => $user,
        ]);
    }
}
