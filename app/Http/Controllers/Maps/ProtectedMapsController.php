<?php

namespace App\Http\Controllers\Maps;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProtectedMapsController extends Controller
{
    public function __invoke(Request $request, string $path)
    {
        $path = ltrim($path, '/');

        if ($path === '' || str_contains($path, "\0") || str_contains($path, '..')) {
            abort(404);
        }

        $allowedExt = ['json','glb','gltf','bin','png','jpg','jpeg','webp','ktx2'];
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if ($ext === '' || !in_array($ext, $allowedExt, true)) {
            abort(404);
        }

        $base = realpath(public_path('maps'));
        if (!$base) abort(404);

        $full = realpath($base . DIRECTORY_SEPARATOR . $path);

        if (!$full || !str_starts_with($full, $base . DIRECTORY_SEPARATOR) || !is_file($full)) {
            abort(404);
        }

        return response()->file($full, [
            'Cache-Control' => 'private, max-age=0, no-cache, no-store, must-revalidate',
            'Pragma'        => 'no-cache',
        ]);
    }
}
