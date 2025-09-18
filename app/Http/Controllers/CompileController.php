<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

use function dirname;

class CompileController extends Controller
{
    public function store(Request $request)
    {
        $payload = $request->json()->all() ?: $request->all();
        $module = $payload['module'] ?? null;

        if (! is_string($module)) {
            return response()->json(['error' => 'Missing module field'], 400);
        }

        $fileParam = $request->query('file', 'framework-template.js');
        if (! is_string($fileParam)) {
            return response()->json(['error' => 'Invalid file path'], 400);
        }

        if (
            strpos($fileParam, "\0") !== false ||
            Str::contains($fileParam, ['../']) ||
            Str::startsWith($fileParam, ['./', '/'])
        ) {
            return response()->json(['error' => 'Invalid file path'], 400);
        }

        $target = public_path($fileParam);
        $dir = dirname($target);

        if (! is_dir($dir)) {
            if (! mkdir($dir, 0755, true) && ! is_dir($dir)) {
                return response()->json(['error' => 'Failed to create directory'], 500);
            }
        }

        if (@file_put_contents($target, $module, LOCK_EX) === false) {
            return response()->json(['error' => 'Failed to write file'], 500);
        }

        return response()->json(['ok' => true]);
    }
}
