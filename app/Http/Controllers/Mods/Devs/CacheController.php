<?php

namespace App\Http\Controllers\Mods\Devs;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

class CacheController extends Controller
{
    public function clearFramework(Request $request)
    {
        $dir = public_path('framework-templates');

        if (!File::exists($dir)) {
            return Response::json([
                'ok' => true,
                'message' => 'Directory not found, nothing to delete.',
                'path' => $dir,
            ]);
        }

        try {
            File::cleanDirectory($dir);
            return Response::json([
                'ok' => true,
                'message' => 'Framework cache cleared.',
                'path' => $dir,
            ]);
        } catch (\Throwable $e) {
            return Response::json([
                'ok' => false,
                'message' => 'Failed to clear framework cache.',
                'error' => $e->getMessage(),
                'path' => $dir,
            ], 500);
        }
    }

    public function clearTranslations(Request $request)
    {
        $allowed = [
            'gamemodes.json',
            'heroes.json',
            'values.json',
            'other.json',
            'maps.json',
            'localizedStrings.json',
            'customGameSettings.json',
            'constants.json',
            'actions.json',
        ];

        $fromClient  = (array) $request->input('files', []);
        $targetFiles = count($fromClient) ? array_values(array_intersect($fromClient, $allowed)) : $allowed;

        $base = public_path('translations');
        $deleted = [];
        $missing = [];
        $failed  = [];

        try {
            foreach ($targetFiles as $name) {
                $name = basename($name);
                $path = $base . DIRECTORY_SEPARATOR . $name;

                if (!File::exists($path)) {
                    $missing[] = $name;
                    continue;
                }

                try {
                    File::delete($path);
                    $deleted[] = $name;
                } catch (\Throwable $e) {
                    $failed[] = ['file' => $name, 'error' => $e->getMessage()];
                }
            }

            $ok = empty($failed);
            return Response::json([
                'ok' => $ok,
                'message' => $ok ? 'Translations cache cleared.' : 'Some files could not be deleted.',
                'base' => $base,
                'deleted' => $deleted,
                'missing' => $missing,
                'failed'  => $failed,
            ], $ok ? 200 : 207);
        } catch (\Throwable $e) {
            return Response::json([
                'ok' => false,
                'message' => 'Failed to clear translations cache.',
                'error' => $e->getMessage(),
                'base' => $base,
            ], 500);
        }
    }

    public function clearAvatars(Request $request)
    {
        $dir = storage_path('app/private/cache');

        if (!File::exists($dir)) {
            return Response::json([
                'ok' => true,
                'message' => 'Directory not found, nothing to delete.',
                'path' => $dir,
            ]);
        }

        try {
            File::ensureDirectoryExists($dir);
            File::cleanDirectory($dir);

            return Response::json([
                'ok' => true,
                'message' => 'Avatar cache cleared.',
                'path' => $dir,
            ]);
        } catch (\Throwable $e) {
            return Response::json([
                'ok' => false,
                'message' => 'Failed to clear avatar cache.',
                'error' => $e->getMessage(),
                'path' => $dir,
            ], 500);
        }
    }
}
