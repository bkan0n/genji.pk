<?php

namespace App\Http\Controllers\Tournament;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class ListTournamentCyclesController extends BaseTournamentController
{
    public function __invoke(Request $request): JsonResponse|Response
    {
        $query = $request->validate([
            'status' => ['nullable', Rule::in(['pending', 'active', 'finalizing', 'completed'])],
            'category_id' => ['nullable', 'integer', 'min:1'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:100'],
            'offset' => ['nullable', 'integer', 'min:0'],
        ]);

        return $this->proxy('get', '/cycles', 'tournaments.cycles.index', query: $query);
    }
}
