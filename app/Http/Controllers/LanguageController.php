<?php

// app/Http/Controllers/LanguageController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class LanguageController extends Controller
{
    public function switch(Request $request, string $code)
    {
        $available = array_keys(config('gp.languages', []));
        $default = config('gp.default', 'en');

        $code = strtolower($code);
        if (! in_array($code, $available, true)) {
            $code = $default;
        }

        $request->session()->put('selected_lang', $code);
        Cookie::queue(
            cookie()->make('gp_lang', $code, 60 * 24 * 365, '/', null, false, true, false, 'Lax'),
        );

        $prev = url()->previous() ?: url('/');
        $parts = parse_url($prev);
        // Search URLs repeat map_name for multi-select filters. parse_str()
        // collapses those entries, so preserve the raw pairs when changing locale.
        $query = array_values(array_filter(
            explode('&', $parts['query'] ?? ''),
            static fn (string $pair): bool => $pair !== ''
                && urldecode(explode('=', $pair, 2)[0]) !== 'lang',
        ));
        $query[] = 'lang=' . rawurlencode($code);

        $rebuilt =
          ($parts['scheme'] ?? 'http') .
          '://' .
          ($parts['host'] ?? request()->getHost()) .
          (isset($parts['port']) ? ':' . $parts['port'] : '') .
          ($parts['path'] ?? '/') .
          '?' .
          implode('&', $query);

        return redirect($rebuilt);
    }
}
