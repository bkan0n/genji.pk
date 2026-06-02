<?php

namespace App\Http\Controllers\Mods\Tournament;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CreateTournamentCategoryController extends BaseTournamentModController
{
    public function __invoke(Request $request): JsonResponse|Response
    {
        return $this->proxy(
            'post',
            '/categories',
            'mods.tournaments.categories.create',
            $this->validateCategoryPayload($request, true),
        );
    }
}
