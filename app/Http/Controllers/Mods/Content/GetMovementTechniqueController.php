<?php

namespace App\Http\Controllers\Mods\Content;

use App\Http\Controllers\Content\BaseMovementTechController;
use Illuminate\Http\JsonResponse;

class GetMovementTechniqueController extends BaseMovementTechController
{
    public function __invoke(int $id): JsonResponse
    {
        return $this->proxy(
            'get',
            '/api/v3/content/movement-tech/techniques/' . $id,
            'mods.content.movement-tech.techniques.show',
            [],
            ['technique_id' => $id],
        );
    }
}