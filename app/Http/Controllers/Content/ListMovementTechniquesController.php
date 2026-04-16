<?php

namespace App\Http\Controllers\Content;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ListMovementTechniquesController extends BaseMovementTechController
{
    public function __invoke(Request $request): JsonResponse
    {
        return $this->proxy(
            'get',
            '/api/v3/content/movement-tech/',
            'content.movement-tech.techniques.index',
        );
    }
}