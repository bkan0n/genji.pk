<?php

use App\Http\Controllers\Auth\DiscordAuthController;
use App\Http\Controllers\LanguageController;
use App\Http\Middleware\RequireDiscordEditorRole;
use App\Http\Controllers\Maps\ProtectedMapsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Pages
Route::view('/', 'index')->name('home');
Route::get('rank_card', [DiscordAuthController::class, 'rankCardPage'])->name(
    'rankcard.dashboard',
);
Route::view('newsfeed', 'newsfeed')->name('newsfeed');
Route::view('leaderboard', 'leaderboard')->name('leaderboard');
Route::view('statistics', 'statistics')->name('statistics');
Route::view('tutorials', 'tutorials')->name('tutorials');
Route::view('search', 'search')->name('search');
Route::view('convertor', 'convertor')->name('convertor');
Route::view('lootbox', 'lootbox')->name('lootbox');
Route::view('submit', 'submit')->name('submit');
Route::view('game', 'game')->name('game');
Route::view('dashboard', 'dashboard')->name('dashboard');
Route::view('infos', 'infos')->name('infos');
Route::view('moderator', 'moderator')->middleware('discord.moderator')->name('moderator.panel');
Route::view('/ip', 'ip-temp');
Route::get('/editor', fn () => view('editor'))->middleware(RequireDiscordEditorRole::class);
Route::middleware([RequireDiscordEditorRole::class])->group(function () {
    Route::get('/maps/{path}', ProtectedMapsController::class)
        ->where('path', '.*');
});
// Langues
Route::get('lang/{code}', [LanguageController::class, 'switch'])->name('lang.switch');

// Discord OAuth
Route::get('/login',    [DiscordAuthController::class, 'redirect'])->name('login');
Route::get('/callback', [DiscordAuthController::class, 'callback'])->name('callback');
Route::post('/logout',  [DiscordAuthController::class, 'logout'])->name('logout');

//IP 
Route::get('/api/my-ip', function (Request $request) {
    $cf  = $request->header('CF-Connecting-IP');
    $xff = (string) $request->header('X-Forwarded-For');
    $ip  = $request->ip();

    $xffLeftmost = null;
    if ($xff !== '') {
        $parts = array_map('trim', explode(',', $xff));
        $xffLeftmost = $parts[0] ?? null;
    }

    return response()->json([
        'client_ip'    => $cf ?: $ip,

        'cf'           => $cf,
        'ip'           => $ip,
        'proxy_chain'  => $xff,
        'xff_leftmost' => $xffLeftmost,
        'source'       => $cf ? 'CF-Connecting-IP' : 'Laravel $request->ip()',
    ])->header('Cache-Control', 'no-store');
})->name('api.my_ip');