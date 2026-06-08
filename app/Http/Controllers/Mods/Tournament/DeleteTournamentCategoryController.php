<?php

namespace App\Http\Controllers\Mods\Tournament;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DeleteTournamentCategoryController extends BaseTournamentModController
{
    public function __invoke(Request $request, int $category): JsonResponse|Response
    {
        return $this->proxy('delete', "/categories/{$category}", 'mods.tournaments.categories.delete', context: [
            'category_id' => $category,
        ]);
    }
}
