<?php

namespace App\Http\Controllers\Mods\Content;

use App\Http\Controllers\Content\BaseMovementTechController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UpdateMovementTechCategoryController extends BaseMovementTechController
{
    public function __invoke(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        return $this->proxy(
            'put',
            '/api/v3/content/movement-tech/categories/' . $id,
            'mods.content.movement-tech.categories.update',
            $validated,
            ['category_id' => $id],
        );
    }
}