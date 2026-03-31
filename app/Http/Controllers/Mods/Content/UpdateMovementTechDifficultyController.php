<?php

namespace App\Http\Controllers\Mods\Content;

use App\Http\Controllers\Content\BaseMovementTechController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UpdateMovementTechDifficultyController extends BaseMovementTechController
{
    public function __invoke(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        return $this->proxy(
            'put',
            '/api/v3/content/movement-tech/difficulties/' . $id,
            'mods.content.movement-tech.difficulties.update',
            $validated,
            ['difficulty_id' => $id],
        );
    }
}