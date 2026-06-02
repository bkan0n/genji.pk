<?php

namespace App\Http\Controllers\Mods\Tournament;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SelectTournamentMapController extends BaseTournamentModController
{
    public function __invoke(Request $request, int $category): JsonResponse|Response
    {
        return $this->proxy('post', "/categories/{$category}/select-map", 'mods.tournaments.maps.select', context: [
            'category_id' => $category,
        ]);
    }
}
