<?php

use App\Http\Controllers\Auth\DiscordAuthController;
use App\Http\Controllers\LanguageController;
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
Route::view('moderator', 'moderator')->middleware('discord.moderator')->name('moderator.panel');

// Langues
Route::get('lang/{code}', [LanguageController::class, 'switch'])->name('lang.switch');

// Discord OAuth
Route::get('discord/login', [DiscordAuthController::class, 'redirect'])->name('discord.redirect');
Route::get('discord/callback', [DiscordAuthController::class, 'callback'])->name(
    'discord.callback',
);
Route::post('discord/logout', [DiscordAuthController::class, 'logout'])->name('discord.logout');
