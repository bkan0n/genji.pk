<?php

namespace App\Http\Controllers\Tournament;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class GetTournamentConfigController extends BaseTournamentController
{
    public function __invoke(Request $request): JsonResponse|Response
    {
        return $this->proxy('get', '/config', 'tournaments.config.show');
    }
}
