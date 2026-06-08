<?php

namespace App\Http\Controllers\Mods\Tournament;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UpdateTournamentCategoryController extends BaseTournamentModController
{
    public function __invoke(Request $request, int $category): JsonResponse|Response
    {
        return $this->proxy(
            'patch',
            "/categories/{$category}",
            'mods.tournaments.categories.update',
            $this->validateCategoryPayload($request, false),
            context: ['category_id' => $category],
        );
    }
}
