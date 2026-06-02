<?php

namespace App\Http\Controllers\Mods\Tournament;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DebugTournamentCycleLengthController extends BaseTournamentModController
{
    public function __invoke(Request $request): JsonResponse|Response
    {
        $payload = $request->validate([
            'seconds' => ['present', 'nullable', 'integer', 'min:1'],
        ]);

        return $this->proxy('patch', '/debug-cycle-length', 'mods.tournaments.debug-cycle-length', $payload);
    }
}
