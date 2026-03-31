<?php

namespace App\Http\Controllers\Content;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ListMovementTechCategoriesController extends BaseMovementTechController
{
    public function __invoke(Request $request): JsonResponse
    {
        return $this->proxy(
            'get',
            '/api/v3/content/movement-tech/categories',
            'content.movement-tech.categories.index',
        );
    }
}