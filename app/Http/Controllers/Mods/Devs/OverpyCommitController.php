<?php

namespace App\Http\Controllers\Mods\Devs;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class OverpyCommitController extends Controller
{
    private const RE_CONST = '/(const\s+OVERPY_COMMIT\s*=\s*[\'"])([0-9a-fA-F]{7,40})([\'"]\s*;)/';

    private const RE_URL_INLINE = '#(https://cdn\.jsdelivr\.net/gh/[^@]+@)([0-9a-fA-F]{7,40})(/src/data/)#';

    private const RE_URL_TEMPLATE = '#https://cdn\.jsdelivr\.net/gh/[^@]+@\$\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}/src/data/#';

    private const RE_URL_CONCAT = '#https://cdn\.jsdelivr\.net/gh/[^@]+@["\']\s*\+\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\+\s*["\']/src/data/#';

    public function show()
    {
        $bundlePath = $this->locateConvertorBundle();
        [$code, $commit] = $this->readAndExtract($bundlePath);

        if (!$commit) {
            abort(500, 'OVERPY_COMMIT not found in bundle.');
        }

        return response()->json([
            'file'   => $bundlePath,
            'commit' => $commit,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'commit'  => ['required', 'regex:/^[0-9a-fA-F]{7,40}$/'],
            'confirm' => ['accepted'],
        ], [
            'commit.regex' => 'Commit must be a 7–40 hex SHA.',
            'confirm.accepted' => 'Confirmation is required.',
        ]);

        $new = $request->string('commit');

        $bundlePath = $this->locateConvertorBundle();
        [$code, $current] = $this->readAndExtract($bundlePath);

        if (!$current) {
            abort(500, 'OVERPY_COMMIT not found in bundle.');
        }

        if (strcasecmp($new, $current) === 0) {
            return response()->json([
                'file'   => $bundlePath,
                'commit' => $current,
                'message'=> 'No change (same SHA).',
            ]);
        }

        $updated = $this->replaceCommit($code, $new);
        if ($updated === $code) {
            abort(500, 'Unable to update OVERPY_COMMIT in bundle.');
        }

        File::put($bundlePath, $updated);

        [, $after] = $this->readAndExtract($bundlePath);

        return response()->json([
            'file'       => $bundlePath,
            'before'     => $current,
            'after'      => $after,
            'updated_at' => now()->toIso8601String(),
        ]);
    }

    private function locateConvertorBundle(): string
    {
        $manifest = public_path('build/manifest.json');
        if (!File::exists($manifest)) {
            abort(500, 'Vite manifest not found (public/build/manifest.json).');
        }

        $json = json_decode(File::get($manifest), true);
        if (!is_array($json)) {
            abort(500, 'Invalid Vite manifest.');
        }

        $candidate = null;

        foreach ($json as $entry => $meta) {
            if (stripos($entry, 'convertor') !== false && isset($meta['file'])) {
                $candidate = public_path('build/' . ltrim($meta['file'], '/'));
                break;
            }
        }

        if (!$candidate) {
            $assetsDir = public_path('build/assets');
            if (!File::isDirectory($assetsDir)) {
                abort(500, 'Assets directory not found (public/build/assets).');
            }
            foreach (File::files($assetsDir) as $f) {
                if (preg_match('/^convertor-.*\.js$/', $f->getFilename())) {
                    $candidate = $f->getPathname();
                    break;
                }
            }
        }

        if (!$candidate || !File::exists($candidate)) {
            abort(500, 'convertor bundle not found (looked into manifest and assets).');
        }

        return $candidate;
    }

    private function readAndExtract(string $path): array
    {
        $code = File::get($path);
        $commit = $this->extractCommit($code);
        return [$code, $commit];
    }

    private static function varDeclRegex(string $var): string
    {
        $v = preg_quote($var, '/');
        return '/(?:const|let|var)\s+' . $v . '\s*=\s*[\'"]([0-9a-fA-F]{7,40})[\'"]\s*[,;]?/m';
    }

    private static function varAssignInListRegex(string $var): string
    {
        $v = preg_quote($var, '/');
        return '/(?:^|,|\s)' . $v . '\s*=\s*[\'"]([0-9a-fA-F]{7,40})[\'"]\s*(?:,|;|$)/m';
    }

    private function extractCommit(string $code): ?string
    {
        if (preg_match(self::RE_CONST, $code, $m)) {
            return $m[2];
        }

        if (preg_match(self::RE_URL_INLINE, $code, $m)) {
            return $m[2];
        }

        if (preg_match(self::RE_URL_TEMPLATE, $code, $m)) {
            $var = $m[1];
            $re1 = self::varDeclRegex($var);
            if (preg_match($re1, $code, $d)) {
                return $d[1];
            }
            $re2 = self::varAssignInListRegex($var);
            if (preg_match($re2, $code, $d)) {
                return $d[1];
            }
        }

        if (preg_match(self::RE_URL_CONCAT, $code, $m)) {
            $var = $m[1];
            $re1 = self::varDeclRegex($var);
            if (preg_match($re1, $code, $d)) {
                return $d[1];
            }
            $re2 = self::varAssignInListRegex($var);
            if (preg_match($re2, $code, $d)) {
                return $d[1];
            }
        }

        return null;
    }

    private function replaceCommit(string $js, string $newCommit): string
    {
        $newCommit = strtolower($newCommit);

        $rx = '/(_t\s*=\s*)([\'"])[0-9a-f]{7,40}\2/';

        $replaced = preg_replace_callback(
            $rx,
            function (array $m) use ($newCommit) {
                return $m[1] . $m[2] . $newCommit . $m[2];
            },
            $js,
            -1,
            $count
        );

        if ($replaced === null) {
            abort(500, 'Regex error while replacing OVERPY_COMMIT.');
        }
        if ($count === 0) {
            abort(500, 'OVERPY_COMMIT anchor not found in convertor.js.');
        }

        return $replaced;
    }
}
