<?php

namespace App\Http\Controllers\Mods\Tournament;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RerollTournamentMapController extends BaseTournamentModController
{
    public function __invoke(Request $request, int $category): JsonResponse|Response
    {
        return $this->proxy('post', "/categories/{$category}/reroll", 'mods.tournaments.maps.reroll', context: [
            'category_id' => $category,
        ]);
    }
}
