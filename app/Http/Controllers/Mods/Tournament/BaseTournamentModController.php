<?php

namespace App\Http\Controllers\Mods\Tournament;

use App\Http\Controllers\Tournament\BaseTournamentController;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

abstract class BaseTournamentModController extends BaseTournamentController
{
    protected function validateCategoryPayload(Request $request, bool $creating): array
    {
        $required = $creating ? 'required' : 'sometimes';

        $payload = $request->validate([
            'name' => [$required, 'string', 'max:255'],
            'difficulties' => [$required, 'array', 'min:1'],
            'difficulties.*' => [Rule::in(['Easy', 'Medium', 'Hard', 'Very Hard', 'Extreme', 'Hell'])],
            'participation_xp' => ['sometimes', 'integer', 'min:0'],
            'placement_xp' => ['sometimes', 'array'],
            'placement_xp.*.place' => ['required_with:placement_xp', 'integer', 'min:1'],
            'placement_xp.*.xp' => ['required_with:placement_xp', 'integer', 'min:0'],
            'streak_xp' => ['sometimes', 'array'],
            'streak_xp.*.threshold' => ['required_with:streak_xp', 'integer', 'min:1'],
            'streak_xp.*.xp' => ['required_with:streak_xp', 'integer', 'min:0'],
            'champion_role_id' => ['sometimes', 'nullable', 'regex:/^\d{1,20}$/'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($creating) {
            unset($payload['is_active']);
        }

        return $payload;
    }

    protected function validateConfigPayload(Request $request): array
    {
        return $request->validate([
            'blacklist_weeks' => ['sometimes', 'integer', 'min:0', 'max:260'],
            'cadence' => ['sometimes', Rule::in(['weekly', 'biweekly'])],
            'anchor_weekday' => ['sometimes', 'integer', 'min:0', 'max:6'],
            'anchor_time' => ['sometimes', 'string', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
            'anchor_tz' => ['sometimes', 'string', 'max:128'],
        ]);
    }
}
