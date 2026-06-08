<?php

namespace App\Http\Controllers\Mods\Tournament;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BootstrapTournamentEditionController extends BaseTournamentModController
{
    public function __invoke(Request $request): JsonResponse|Response
    {
        return $this->proxy('post', '/bootstrap', 'mods.tournaments.bootstrap');
    }
}
