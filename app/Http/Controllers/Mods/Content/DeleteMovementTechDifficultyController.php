<?php

namespace App\Http\Controllers\Mods\Content;

use App\Http\Controllers\Content\BaseMovementTechController;
use Illuminate\Http\JsonResponse;

class DeleteMovementTechDifficultyController extends BaseMovementTechController
{
    public function __invoke(int $id): JsonResponse
    {
        return $this->proxy(
            'delete',
            '/api/v3/content/movement-tech/difficulties/' . $id,
            'mods.content.movement-tech.difficulties.delete',
            [],
            ['difficulty_id' => $id],
        );
    }
}