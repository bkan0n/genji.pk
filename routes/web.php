<?php

use App\Http\Controllers\Auth\DiscordAuthController;
use App\Http\Controllers\Auth\BattleNetAuthController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\LanguageController;
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

// Langues
Route::get('lang/{code}', [LanguageController::class, 'switch'])->name('lang.switch');

// Page login
Route::get('/login', [LoginController::class, 'show'])->name('login');

// Discord OAuth 
Route::get('/auth/discord/redirect', [DiscordAuthController::class, 'redirect'])->name('auth.discord.redirect');
Route::get('/callback', [DiscordAuthController::class, 'callback'])->name('callback');
Route::get('/auth/discord/callback', [DiscordAuthController::class, 'callback'])->name('auth.discord.callback');

// Battle.net OAuth
Route::get('/auth/battlenet/redirect', [BattleNetAuthController::class, 'redirect'])->name('auth.battlenet.redirect');
Route::get('/auth/battlenet/callback', [BattleNetAuthController::class, 'callback'])->name('auth.battlenet.callback');

// Logout
Route::post('/logout', [DiscordAuthController::class, 'logout'])->name('logout');

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