<?php

namespace App\Http\Controllers\Mods\Devs;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class FrameworkVersionController extends Controller
{
    private const CDN_PREFIX = 'https://cdn.jsdelivr.net/gh/tylovejoy/genji-framework@';

    public function show(Request $request)
    {
        [$path, $js] = $this->readConvertorBundleOrAbort();

        [$version, $fullUrl] = $this->extractVersionOrAbort($js);

        return response()->json([
            'ok'      => true,
            'file'    => $path,
            'version' => $version,
            'url'     => $fullUrl,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'version' => ['required', 'regex:/^[A-Za-z0-9._-]+$/'],
            'confirm' => ['accepted'],
        ]);

        $newVersion = (string) $data['version'];

        [$path, $js] = $this->readConvertorBundleOrAbort();

        $replaced = $this->replaceFrameworkVersion($js, $newVersion, $count);

        if ($replaced === null) {
            abort(500, 'Regex error while replacing framework version.');
        }
        if ($count === 0) {
            abort(500, 'Framework CDN anchor not found in convertor.js.');
        }

        $this->writeFileAtomic($path, $replaced);

        return response()->json([
            'ok'       => true,
            'file'     => $path,
            'version'  => $newVersion,
            'replaced' => $count,
        ]);
    }

    private function readConvertorBundleOrAbort(): array
    {
        $dir = public_path('build/assets');

        if (!is_dir($dir)) {
            abort(500, 'assets directory not found: ' . $dir);
        }

        $candidates = glob($dir . DIRECTORY_SEPARATOR . 'convertor-*.js');
        if (!$candidates || count($candidates) === 0) {
            abort(500, 'convertor-*.js not found in bundle.');
        }

        usort($candidates, fn ($a, $b) => filemtime($b) <=> filemtime($a));
        $path = $candidates[0];

        $js = @file_get_contents($path);
        if ($js === false || $js === '') {
            abort(500, 'Unable to read bundle: ' . $path);
        }

        return [$path, $js];
    }

    private function extractVersionOrAbort(string $js): array
    {
        $rx = '#(https://cdn\.jsdelivr\.net/gh/tylovejoy/genji-framework@)([A-Za-z0-9._-]+)(/)#';

        if (!preg_match($rx, $js, $m)) {
            abort(500, 'Framework CDN anchor not found in convertor.js.');
        }

        $prefix  = $m[1];
        $version = $m[2];
        $suffix  = $m[3];

        return [$version, $prefix . $version . $suffix];
        }

    private function replaceFrameworkVersion(string $js, string $newVersion, ?int &$count = 0): ?string
    {
        $rx = '#(https://cdn\.jsdelivr\.net/gh/tylovejoy/genji-framework@)([A-Za-z0-9._-]+)(/)#';

        $replaced = preg_replace_callback(
            $rx,
            function (array $m) use ($newVersion) {
                return $m[1] . $newVersion . $m[3];
            },
            $js,
            -1,
            $count
        );

        return $replaced;
    }

    private function writeFileAtomic(string $path, string $contents): void
    {
        $tmp = $path . '.tmp';

        if (@file_put_contents($tmp, $contents) === false) {
            abort(500, 'Unable to write temp file: ' . $tmp);
        }

        if (!@rename($tmp, $path)) {
            @unlink($tmp);
            abort(500, 'Unable to replace bundle: ' . $path);
        }
    }
}
