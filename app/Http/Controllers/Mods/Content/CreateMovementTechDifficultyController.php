<?php

namespace App\Http\Controllers\Mods\Content;

use App\Http\Controllers\Content\BaseMovementTechController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CreateMovementTechDifficultyController extends BaseMovementTechController
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        return $this->proxy(
            'post',
            '/api/v3/content/movement-tech/difficulties',
            'mods.content.movement-tech.difficulties.create',
            $validated,
        );
    }
}