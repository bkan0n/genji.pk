<?php

namespace App\Http\Controllers\Mods\Tournament;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PublishTournamentResultsController extends BaseTournamentModController
{
    public function __invoke(Request $request): JsonResponse|Response
    {
        return $this->proxy('patch', '/publish-results', 'mods.tournaments.publish-results');
    }
}
