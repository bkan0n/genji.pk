<?php

namespace App\Http\Controllers\Mods\Tournament;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ChooseTournamentNextMapController extends BaseTournamentModController
{
    public function __invoke(Request $request, int $category): JsonResponse|Response
    {
        $payload = $request->validate([
            'map_code' => ['required', 'string', 'max:64'],
        ]);

        return $this->proxy(
            'patch',
            "/categories/{$category}/next-cycle",
            'mods.tournaments.maps.choose-next',
            $payload,
            context: ['category_id' => $category],
        );
    }
}
