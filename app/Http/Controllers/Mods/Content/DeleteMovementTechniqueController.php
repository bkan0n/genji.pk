<?php

namespace App\Http\Controllers\Mods\Content;

use App\Http\Controllers\Content\BaseMovementTechController;
use Illuminate\Http\JsonResponse;

class DeleteMovementTechniqueController extends BaseMovementTechController
{
    public function __invoke(int $id): JsonResponse
    {
        return $this->proxy(
            'delete',
            '/api/v3/content/movement-tech/techniques/' . $id,
            'mods.content.movement-tech.techniques.delete',
            [],
            ['technique_id' => $id],
        );
    }
}