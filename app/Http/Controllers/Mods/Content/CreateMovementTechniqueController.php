<?php

namespace App\Http\Controllers\Mods\Content;

use App\Http\Controllers\Content\BaseMovementTechController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CreateMovementTechniqueController extends BaseMovementTechController
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'instructions' => ['nullable', 'string'],
            'category_id' => ['nullable', 'integer'],
            'difficulty_id' => ['nullable', 'integer'],
            'tips' => ['nullable', 'array'],
            'tips.*.text' => ['required_with:tips', 'string'],
            'tips.*.sort_order' => ['nullable', 'integer'],
            'videos' => ['nullable', 'array'],
            'videos.*.url' => ['required_with:videos', 'string'],
            'videos.*.caption' => ['nullable', 'string'],
            'videos.*.sort_order' => ['nullable', 'integer'],
        ]);

        return $this->proxy(
            'post',
            '/api/v3/content/movement-tech/techniques',
            'mods.content.movement-tech.techniques.create',
            $validated,
        );
    }
}
