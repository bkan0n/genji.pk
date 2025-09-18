<?php

namespace App\Http\Controllers\Community\Statistics;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MapCompletionTimesController extends BaseCommunityStatisticsController
{
    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'max:32'],
        ]);

        if ($code = $request->query('code')) {
            $request->merge(['code' => strtoupper($code)]);
        }

        return $this->passThrough($request, 'maps/completions', ['code']);
    }
}
