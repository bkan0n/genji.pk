<?php

namespace App\Http\Controllers\Community\Statistics;

use Illuminate\Http\Request;

class PlayersPerSkillTierController extends BaseCommunityStatisticsController
{
    public function index(Request $request)
    {
        return $this->passThrough($request, 'skill/players');
    }
}
