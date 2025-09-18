<?php

namespace App\Http\Controllers\Community\Statistics;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MapUserRecordProgressionController extends BaseCommunityStatisticsController
{
    public function __invoke(Request $request, string $code, int $userId): JsonResponse
    {
        $code = strtoupper($code);

        return $this->passThrough($request, "maps/{$code}/user/{$userId}");
    }
}
