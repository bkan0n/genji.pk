<?php

namespace App\Http\Controllers\Mods\Tournament;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RerollActiveTournamentMapController extends BaseTournamentModController
{
    public function __invoke(Request $request, int $category): JsonResponse|Response
    {
        return $this->proxy('post', "/categories/{$category}/reroll-active", 'mods.tournaments.maps.reroll-active', context: [
            'category_id' => $category,
        ]);
    }
}
