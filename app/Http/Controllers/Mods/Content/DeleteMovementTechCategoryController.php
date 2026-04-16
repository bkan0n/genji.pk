<?php

namespace App\Http\Controllers\Mods\Content;

use App\Http\Controllers\Content\BaseMovementTechController;
use Illuminate\Http\JsonResponse;

class DeleteMovementTechCategoryController extends BaseMovementTechController
{
    public function __invoke(int $id): JsonResponse
    {
        return $this->proxy(
            'delete',
            '/api/v3/content/movement-tech/categories/' . $id,
            'mods.content.movement-tech.categories.delete',
            [],
            ['category_id' => $id],
        );
    }
}