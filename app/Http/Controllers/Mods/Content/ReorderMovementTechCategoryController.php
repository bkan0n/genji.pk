<?php

namespace App\Http\Controllers\Mods\Content;

use App\Http\Controllers\Content\BaseMovementTechController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReorderMovementTechCategoryController extends BaseMovementTechController
{
    public function __invoke(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'direction' => ['required', 'string', Rule::in(['up', 'down'])],
        ]);

        return $this->proxy(
            'post',
            '/api/v3/content/movement-tech/categories/' . $id . '/reorder',
            'mods.content.movement-tech.categories.reorder',
            $validated,
            ['category_id' => $id],
        );
    }
}