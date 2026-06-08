<?php

namespace App\Http\Controllers\Mods\Tournament;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PauseTournamentTransitionsController extends BaseTournamentModController
{
    public function __invoke(Request $request): JsonResponse|Response
    {
        $payload = $request->validate([
            'paused' => ['required', 'boolean'],
        ]);

        return $this->proxy('patch', '/pause', 'mods.tournaments.pause', $payload);
    }
}
