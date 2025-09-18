<?php

// app/Http/Middleware/DetectLanguage.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class DetectLanguage
{
    public function handle(Request $request, Closure $next)
    {
        $cfg = config('gp');
        $languages = $cfg['languages'] ?? [];
        $default = $cfg['default'] ?? 'en';

        $code = strtolower((string) $request->query('lang', ''));
        if ($code === '' || ! isset($languages[$code])) {
            $code = strtolower(
                (string) $request->cookie('gp_lang', $request->session()->get('selected_lang', $default)),
            );
            if (! isset($languages[$code])) {
                $code = $default;
            }
        }

        $request->session()->put('selected_lang', $code);
        app()->setLocale($code);

        $translations = $this->loadTranslations($code, $usedFile);

        view()->share([
            'languages' => $languages,
            'selectedLang' => $code,
            'selectedLangData' => $languages[$code] ?? ['name' => strtoupper($code), 'flag' => ''],
            'translations' => $translations,
        ]);

        $response = $next($request);
        $response->headers->set('X-GP-Lang', $code);
        $response->headers->set('X-GP-Trans-File', basename((string) $usedFile));

        return $response;
    }

    protected function loadTranslations(string $code, ?string &$usedFile = null): array
    {
        $base = config('gp.translations_path');
        $file = rtrim($base, '/\\') . DIRECTORY_SEPARATOR . "{$code}.php";
        if (! is_file($file)) {
            $fallback = rtrim($base, '/\\') . DIRECTORY_SEPARATOR . config('gp.default', 'en') . '.php';
            $file = is_file($fallback) ? $fallback : null;
        }
        $usedFile = $file;

        return $file ? include $file : [];
    }
}
