<?php

use App\Http\Controllers\Auth\DiscordController;
use App\Http\Controllers\Auth\EmailAuthController;
use App\Http\Controllers\Auth\DiscordAuthController;
use App\Http\Controllers\LanguageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// =============================================================================
// Pages
// =============================================================================
Route::view('/', 'index')->name('home');
Route::get('rank_card', [DiscordAuthController::class, 'rankCardPage'])->middleware('auth.user')->name('rankcard.dashboard');
Route::view('lootbox', 'lootbox')->name('lootbox');
Route::view('submit', 'submit')->middleware('auth.user')->name('submit');
Route::view('dashboard', 'dashboard')->middleware('auth.user')->name('dashboard');
Route::view('newsfeed', 'newsfeed')->name('newsfeed');
Route::view('leaderboard', 'leaderboard')->name('leaderboard');
Route::view('statistics', 'statistics')->name('statistics');
Route::view('tutorials', 'tutorials')->name('tutorials');
Route::view('similar-communities', 'similar-communities')->name('similar-communities');
Route::view('search', 'search')->name('search');
Route::view('movement-tech', 'movement-tech')->name('movement-tech');
Route::view('convertor', 'convertor')->name('convertor');
Route::view('game', 'game')->name('game');
Route::view('infos', 'infos')->name('infos');
Route::view('moderator', 'moderator')->middleware('discord.moderator')->name('moderator.panel');
Route::view('/ip', 'ip-temp');
Route::view('dashboard', 'dashboard')->middleware('auth.user')->name('dashboard');

// Langues
Route::get('lang/{code}', [LanguageController::class, 'switch'])->name('lang.switch');

// =============================================================================
// Guest routes
// =============================================================================

Route::middleware('guest')->group(function () {
    // Email
    Route::get('/login', [EmailAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [EmailAuthController::class, 'login'])->name('login.submit');

    Route::get('/register', [EmailAuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [EmailAuthController::class, 'register'])->name('register.submit');

    Route::get('/forgot-password', [EmailAuthController::class, 'showForgotPassword'])->name('password.request');
    Route::post('/forgot-password', [EmailAuthController::class, 'forgotPassword'])->name('password.email');

    Route::get('/reset-password', [EmailAuthController::class, 'showResetPassword'])->name('password.reset');
    Route::post('/reset-password', [EmailAuthController::class, 'resetPassword'])->name('password.update');

    // Discord OAuth
    Route::get('/auth/discord', [DiscordAuthController::class, 'redirect'])->name('auth.discord.redirect');
    Route::get('/callback', [DiscordAuthController::class, 'callback'])->name('auth.discord.callback');
});


// =============================================================================
// Email verification
// =============================================================================

Route::get('/verify-email', [EmailAuthController::class, 'verifyEmail'])->name('verification.verify');
Route::get('/email/verify', [EmailAuthController::class, 'showVerifyNotice'])->middleware('auth.any')->name('verification.notice');
Route::post('/email/resend', [EmailAuthController::class, 'resendVerification'])->middleware('auth.any')->name('verification.resend');


// =============================================================================
// Logout
// =============================================================================

Route::post('/logout', [EmailAuthController::class, 'logout'])->middleware('auth.any')->name('logout');

//CSRF refresh
Route::get('/csrf-token', function (Request $request) {
    return response()
        ->json(['csrf_token' => csrf_token()])
        ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
})->name('csrf.token');

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
