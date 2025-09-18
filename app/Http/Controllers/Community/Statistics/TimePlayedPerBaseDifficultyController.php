<?php

namespace App\Http\Controllers\Community\Statistics;

use Illuminate\Http\Request;

class TimePlayedPerBaseDifficultyController extends BaseCommunityStatisticsController
{
    public function index(Request $request)
    {
        return $this->passThrough($request, 'ranks/time-played');
    }
}
