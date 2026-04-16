<?php

namespace App\Http\Controllers\Content;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ListMovementTechDifficultiesController extends BaseMovementTechController
{
    public function __invoke(Request $request): JsonResponse
    {
        return $this->proxy(
            'get',
            '/api/v3/content/movement-tech/difficulties',
            'content.movement-tech.difficulties.index',
        );
    }
}