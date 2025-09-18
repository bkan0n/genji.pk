<?php

namespace App\Http\Controllers\Community\Statistics;

use Illuminate\Http\Request;

class TopCreatorsByAverageQualityController extends BaseCommunityStatisticsController
{
    public function index(Request $request)
    {
        return $this->passThrough($request, 'creators/popular');
    }
}
