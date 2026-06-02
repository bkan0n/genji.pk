<?php

namespace App\Http\Controllers\Tournament;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class GetTournamentCategoryController extends BaseTournamentController
{
    public function __invoke(Request $request, int $category): JsonResponse|Response
    {
        return $this->proxy('get', "/categories/{$category}", 'tournaments.categories.show', context: [
            'category_id' => $category,
        ]);
    }
}
