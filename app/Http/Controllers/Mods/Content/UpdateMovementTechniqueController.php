<?php

namespace App\Http\Controllers\Mods\Content;

use App\Http\Controllers\Content\BaseMovementTechController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UpdateMovementTechniqueController extends BaseMovementTechController
{
    public function __invoke(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'instructions' => ['sometimes', 'nullable', 'string'],
            'category_id' => ['sometimes', 'nullable', 'integer'],
            'difficulty_id' => ['sometimes', 'nullable', 'integer'],
            'tips' => ['sometimes', 'array'],
            'tips.*.text' => ['required_with:tips', 'string'],
            'tips.*.sort_order' => ['nullable', 'integer'],
            'videos' => ['sometimes', 'array'],
            'videos.*.url' => ['required_with:videos', 'string'],
            'videos.*.caption' => ['nullable', 'string'],
            'videos.*.sort_order' => ['nullable', 'integer'],
        ]);

        return $this->proxy(
            'put',
            '/api/v3/content/movement-tech/techniques/' . $id,
            'mods.content.movement-tech.techniques.update',
            $validated,
            ['technique_id' => $id],
        );
    }
}
