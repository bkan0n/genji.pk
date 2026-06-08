<?php

namespace App\Http\Controllers\Mods\Tournament;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UpdateTournamentConfigController extends BaseTournamentModController
{
    public function __invoke(Request $request): JsonResponse|Response
    {
        return $this->proxy(
            'patch',
            '/config',
            'mods.tournaments.config.update',
            $this->validateConfigPayload($request),
        );
    }
}
