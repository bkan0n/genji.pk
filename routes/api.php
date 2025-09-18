<?php

use App\Http\Controllers\Auth\UserAvatarController;
use App\Http\Controllers\Community\LeaderboardController;
use App\Http\Controllers\Community\Statistics\AllMapsByNameController;
use App\Http\Controllers\Community\Statistics\MapCompletionTimesController;
use App\Http\Controllers\Community\Statistics\MapsPerDifficultyController;
use App\Http\Controllers\Community\Statistics\MapUserRecordProgressionController;
use App\Http\Controllers\Community\Statistics\PlayersPerSkillTierController;
use App\Http\Controllers\Community\Statistics\PlayersPerXpTierController;
use App\Http\Controllers\Community\Statistics\TimePlayedPerBaseDifficultyController;
use App\Http\Controllers\Community\Statistics\TopCreatorsByAverageQualityController;
use App\Http\Controllers\Community\Statistics\TopMapsByDifficultyController;
use App\Http\Controllers\CompileController;
use App\Http\Controllers\Completions\GetAllCompletionsController;
use App\Http\Controllers\Completions\MapLeaderboardController;
use App\Http\Controllers\Completions\SubmitCompletionController;
use App\Http\Controllers\Completions\UpvoteCompletionController;
use App\Http\Controllers\Completions\UserCompletionsController;
use App\Http\Controllers\Lootbox\CoinsController;
use App\Http\Controllers\Lootbox\KeysController;
use App\Http\Controllers\Lootbox\RewardsController;
use App\Http\Controllers\Maps\Guides\GuidesController;
use App\Http\Controllers\Maps\MapSearchController;
use App\Http\Controllers\Maps\Playtests\PlaytestVoteController;
use App\Http\Controllers\Maps\SubmitMapController;
use App\Http\Controllers\Mods\Guides\CreateGuideController;
use App\Http\Controllers\Mods\Guides\DeleteGuideController;
use App\Http\Controllers\Mods\Guides\EditGuideController;
use App\Http\Controllers\Mods\Lootbox\DebugGrantRewardWithoutKeyController;
use App\Http\Controllers\Mods\Lootbox\GrantKeyToUserController;
use App\Http\Controllers\Mods\Lootbox\GrantXpToUserController;
use App\Http\Controllers\Mods\Maps\ArchiveMapsController;
use App\Http\Controllers\Mods\Maps\ConvertToLegacyController;
use App\Http\Controllers\Mods\Maps\UpdateMapController;
use App\Http\Controllers\Mods\Moderation\OverrideQualityController;
use App\Http\Controllers\Mods\Moderation\SuspiciousFlagsController;
use App\Http\Controllers\Mods\Users\CreateFakeMemberController;
use App\Http\Controllers\Mods\Users\GetOverwatchNamesController;
use App\Http\Controllers\Mods\Users\GetUserController;
use App\Http\Controllers\Mods\Users\LinkFakeToRealController;
use App\Http\Controllers\Mods\Users\ReplaceOverwatchNamesController;
use App\Http\Controllers\Mods\Users\UpdateUserNamesController;
use App\Http\Controllers\Mods\Verifications\CompletionSubmissionController;
use App\Http\Controllers\Mods\Verifications\PendingVerificationsController;
use App\Http\Controllers\Mods\Verifications\VerifyCompletionController;
use App\Http\Controllers\Newsfeed\ChangelogsController;
use App\Http\Controllers\Newsfeed\EmojiController;
use App\Http\Controllers\Newsfeed\GifController;
use App\Http\Controllers\Newsfeed\ListNewsfeedController;
use App\Http\Controllers\Newsfeed\TranslateController;
use App\Http\Controllers\Users\Notifications\GetNotificationSettingsController;
use App\Http\Controllers\Users\Notifications\ToggleSingleNotificationController;
use App\Http\Controllers\Users\Overwatch\GetOverwatchUsernamesController;
use App\Http\Controllers\Users\Overwatch\ReplaceOverwatchUsernamesController;
use App\Http\Controllers\Users\Rankcard\GetAvatarPoseController;
use App\Http\Controllers\Users\Rankcard\GetAvatarSkinController;
use App\Http\Controllers\Users\Rankcard\GetBackgroundController;
use App\Http\Controllers\Users\Rankcard\GetBadgeSettingsController;
use App\Http\Controllers\Users\Rankcard\GetMapMasteryController;
use App\Http\Controllers\Users\Rankcard\GetRankCardController;
use App\Http\Controllers\Users\Rankcard\SetAvatarPoseController;
use App\Http\Controllers\Users\Rankcard\SetAvatarSkinController;
use App\Http\Controllers\Users\Rankcard\SetBackgroundController;
use App\Http\Controllers\Users\Rankcard\SetBadgeSettingsController;
use App\Http\Controllers\Utilities\Autocomplete\MapCodesController;
use App\Http\Controllers\Utilities\Autocomplete\MapMechanicsController;
use App\Http\Controllers\Utilities\Autocomplete\MapNamesController;
use App\Http\Controllers\Utilities\Autocomplete\MapRestrictionsController;
use App\Http\Controllers\Utilities\Autocomplete\UsersController;
use App\Http\Controllers\Utilities\UploadImageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

/* ================== COMMUNITY ================== */
Route::prefix('community')->group(function () {
    Route::get('leaderboard', [LeaderboardController::class, 'index'])->name(
        'api.community.leaderboard',
    );
});

/* ================== CONVERTOR ================== */
Route::post('compile', [CompileController::class, 'store'])
    ->middleware(['web'])
    ->name('compile.store');

/* ================== MAPS ================== */
Route::prefix('maps')->group(function () {
    Route::get('/', [MapSearchController::class, 'index'])->name('api.maps.index');
    Route::get('{code}/guides', GuidesController::class)
        ->where('code', '[A-Za-z0-9\-]+')
        ->name('api.maps.guides');

    Route::middleware(['web'])->group(function () {
        Route::post('/', SubmitMapController::class)->name('api.maps.submit');
        Route::post('playtests/{thread_id}/vote/{user_id}', [
            PlaytestVoteController::class,
            'store',
        ])->name('playtests.vote.store');
    });
});

/* ================== UTILITIES ================== */
Route::prefix('autocomplete')->group(function () {
    Route::get('map-codes', MapCodesController::class)->name('api.autocomplete.map-codes');
    Route::get('map-mechanics', MapMechanicsController::class)->name(
        'api.autocomplete.map-mechanics',
    );
    Route::get('map-names/{locale?}', MapNamesController::class)
        ->where('locale', '[a-zA-Z_-]+')
        ->name('api.autocomplete.map-names');
    Route::get('map-restrictions', MapRestrictionsController::class)->name(
        'api.autocomplete.map-restrictions',
    );
    Route::get('users', UsersController::class)->name('api.autocomplete.users');
});
Route::middleware(['web'])
    ->post('/utilities/image', UploadImageController::class)
    ->name('utilities.image.upload');

/* ================== COMPLETIONS ================== */
Route::prefix('completions')->group(function () {
    Route::get('/', UserCompletionsController::class)->name('api.completions.user');
    Route::get('{code}', MapLeaderboardController::class)
        ->where('code', '[A-Za-z0-9\-]+')
        ->name('api.completions.map-leaderboard');

    Route::middleware('web')->group(function () {
        Route::post('/', SubmitCompletionController::class)->name('api.completions.submit');
        Route::post('all', GetAllCompletionsController::class)->name('api.completions.all');
        Route::post('upvoting', UpvoteCompletionController::class)->name('api.completions.upvote');
    });
});

/* ================== STATISTICS ================== */
Route::prefix('community/statistics')->group(function () {
    Route::get('maps/difficulty', [MapsPerDifficultyController::class, 'index']);
    Route::get('skill/players', [PlayersPerSkillTierController::class, 'index']);
    Route::get('xp/players', [PlayersPerXpTierController::class, 'index']);
    Route::get('creators/popular', [TopCreatorsByAverageQualityController::class, 'index']);
    Route::get('maps/popular', [TopMapsByDifficultyController::class, 'index']);
    Route::get('ranks/time-played', [TimePlayedPerBaseDifficultyController::class, 'index']);
    Route::get('maps/all', [AllMapsByNameController::class, 'index']);
    Route::get('maps/completions', MapCompletionTimesController::class);
    Route::get('maps/{code}/user/{userId}', MapUserRecordProgressionController::class)->whereNumber(
        'userId',
    );
});

/* ================== SETTINGS ================== */
Route::prefix('users')->group(function () {
    Route::get('{user_id}/overwatch', GetOverwatchUsernamesController::class)
        ->whereNumber('user_id')
        ->name('users.overwatch.index');
    Route::get('{user_id}/notifications', GetNotificationSettingsController::class)
        ->whereNumber('user_id')
        ->name('users.notifications.index');

    Route::middleware('web')->group(function () {
        Route::put('{user_id}/overwatch', ReplaceOverwatchUsernamesController::class)
            ->whereNumber('user_id')
            ->name('users.overwatch.replace');
        Route::patch(
            '{user_id}/notifications/{notification_type}',
            ToggleSingleNotificationController::class,
        )
            ->whereNumber('user_id')
            ->name('users.notifications.toggle');
    });
});

/* ================== LOOTBOX ================== */
Route::prefix('lootbox')->group(function () {
    Route::get('keys', [KeysController::class, 'index']);
    Route::get('users/{user}/keys', [KeysController::class, 'userKeys'])->whereNumber('user');
    Route::get('users/{user}/keys/{keyType}', [KeysController::class, 'drawForUser'])->whereNumber(
        'user',
    );
    Route::get('rewards', [RewardsController::class, 'index']);
    Route::get('users/{user}/rewards', [RewardsController::class, 'userRewards'])->whereNumber(
        'user',
    );

    Route::middleware('web')->group(function () {
        Route::patch('keys/{keyType}', [KeysController::class, 'setActive'])->where(
            'keyType',
            'Classic|Winter',
        );
        Route::post('users/{user}/keys', [KeysController::class, 'grantToUser'])->whereNumber('user');
        Route::post('users/{user}/coins', [CoinsController::class, 'balance'])->whereNumber('user');
        Route::post('users/{user}/{keyType}/{rewardType}/{rewardName}', [
            RewardsController::class,
            'grantToUser',
        ])->whereNumber('user');
    });
});

/* ================== NEWSFEED ================== */
Route::prefix('newsfeed')->group(function () {
    Route::get('/', ListNewsfeedController::class)->name('api.newsfeed.list');
    Route::post('emoji', [EmojiController::class, 'store'])->name('api.newsfeed.emoji.store');
    Route::get('gif', [GifController::class, 'show'])->name('api.newsfeed.gif.show');
    Route::post('translate', TranslateController::class)->name('api.newsfeed.translate');
    Route::get('changelogs', [ChangelogsController::class, 'index'])->name(
        'api.newsfeed.changelogs',
    );
});

/* ================== DISCORD ================== */
Route::get('settings/user-avatar', [UserAvatarController::class, 'show'])->name(
    'api.settings.user-avatar',
);

/* ================== MODERATION ================== */
Route::prefix('mods')
    ->middleware(['web', 'discord.moderator'])
    ->group(function () {
        // USERS (get)
        Route::get('users/{user_id}', GetUserController::class)
            ->whereNumber('user_id')
            ->name('mods.users.get');
        Route::get('users/{user_id}/overwatch', GetOverwatchNamesController::class)
            ->whereNumber('user_id')
            ->name('mods.users.get-overwatch');

        // USERS (post)
        Route::post('users/fake', CreateFakeMemberController::class)->name('mods.users.create-fake');
        Route::put('users/{user_id}/overwatch', ReplaceOverwatchNamesController::class)
            ->whereNumber('user_id')
            ->name('mods.users.replace-overwatch');
        Route::patch('users/{user_id}', UpdateUserNamesController::class)
            ->whereNumber('user_id')
            ->name('mods.users.update-names');
        Route::put('users/fake/{fake_user_id}/link/{real_user_id}', LinkFakeToRealController::class)
            ->whereNumber('fake_user_id')
            ->whereNumber('real_user_id')
            ->name('mods.users.link-fake-to-real');

        // LOOTBOX
        Route::post('lootbox/users/{user_id}/keys/{key_type}', GrantKeyToUserController::class)
            ->whereNumber('user_id')
            ->where('key_type', 'Classic|Winter')
            ->name('mods.lootbox.grant-key');
        Route::post('lootbox/users/{user_id}/xp', GrantXpToUserController::class)
            ->whereNumber('user_id')
            ->name('mods.lootbox.grant-xp');
        Route::post('lootbox/users/debug/{user_id}/{key_type}/{reward_type}/{reward_name}', DebugGrantRewardWithoutKeyController::class)
            ->whereNumber('user_id')
            ->where('key_type', 'Classic|Winter')
            ->name('mods.lootbox.debug-grant');

        // GUIDES
        Route::prefix('maps')->group(function () {
            Route::post('{code}/guides', CreateGuideController::class);
            Route::patch('{code}/guides/{user_id}', EditGuideController::class);
            Route::delete('{code}/guides/{user_id}', DeleteGuideController::class);
        });

        // MAPS
        Route::patch('maps/archive', ArchiveMapsController::class);
        Route::post('maps/{code}/legacy', ConvertToLegacyController::class);
        Route::patch('maps/{code}', UpdateMapController::class);

        // MODERATION
        Route::match(['post', 'patch'], 'maps/{code}/quality', OverrideQualityController::class);
        Route::get('completions/suspicious', [SuspiciousFlagsController::class, 'index']);
        Route::post('completions/suspicious', [SuspiciousFlagsController::class, 'store']);

        // VERIFICATIONS
        Route::get('verifications/pending', [PendingVerificationsController::class, 'index']);
        Route::get('completions/{record_id}/submission', [
            CompletionSubmissionController::class,
            'show',
        ])->whereNumber('record_id');
        Route::put('completions/{record_id}/verification', [
            VerifyCompletionController::class,
            'update',
        ])->whereNumber('record_id');
    });

/* ================== SENTRY ================== */
Route::post('_/e', function (Request $request) {
    try {
        $body = $request->getContent();
        if (! $body) {
            return response('', 204);
        }

        if (strlen($body) > 1_000_000) {
            return response('', 204);
        }

        $parts = preg_split("/\r?\n/", $body, 2);
        $firstLine = $parts[0] ?? '';
        $hdr = json_decode($firstLine, true) ?: [];
        $dsnHeader = $hdr['dsn'] ?? null;
        if (! $dsnHeader) {
            return response('', 204);
        }

        $parseDsn = function (string $dsn): ?array {
            $u = parse_url($dsn);
            if (! $u || empty($u['host']) || empty($u['user']) || empty($u['path'])) {
                return null;
            }

            return [
                'host' => $u['host'],
                'publicKey' => $u['user'],
                'projectId' => ltrim($u['path'], '/'),
            ];
        };

        $envDsn = (string) env('SENTRY_DSN', '');
        $h = $parseDsn($dsnHeader);
        $e = $envDsn ? $parseDsn($envDsn) : null;

        if (! $h || ! $e || $h['publicKey'] !== $e['publicKey'] || $h['projectId'] !== $e['projectId']) {
            Log::warning('Sentry tunnel: DSN rejected', ['header' => $h, 'env' => $e]);

            return response('', 204);
        }

        $origin = $request->headers->get('Origin') ?? '';
        $referer = $request->headers->get('Referer') ?? '';
        $allowedHost = parse_url(config('app.url'), PHP_URL_HOST) ?: $request->getHost();
        $isSameSite = fn (string $url) => $url && parse_url($url, PHP_URL_HOST) === $allowedHost;

        if (($origin && ! $isSameSite($origin)) || ($referer && ! $isSameSite($referer))) {
            Log::warning('Sentry tunnel: origin rejected', compact('origin', 'referer', 'allowedHost'));

            return response('', 204);
        }

        $ingest = "https://{$h['host']}/api/{$h['projectId']}/envelope/";

        $verify = filter_var(env('X_API_VERIFY', true), FILTER_VALIDATE_BOOLEAN);

        $resp = Http::withHeaders(['Content-Type' => 'application/x-sentry-envelope'])
            ->withOptions(['verify' => $verify, 'timeout' => 8])
            ->send('POST', $ingest, ['body' => $body]);

        if (! $resp->successful()) {
            Log::warning('Sentry tunnel forward failed', [
                'status' => $resp->status(),
                'body' => $resp->body(),
            ]);
        }

        return response('', 204);
    } catch (\Throwable $e) {
        Log::warning('Sentry tunnel failed', ['error' => $e->getMessage()]);

        return response('', 204);
    }
})
    ->middleware('throttle:120,1')
    ->name('sentry.tunnel');

/* ================== RANKCARD ================== */
Route::prefix('users/{user_id}/rank-card')
    ->name('rankcard.')
    ->whereNumber('user_id')
    ->group(function () {
        Route::get('avatar/pose', GetAvatarPoseController::class)->name('avatar.pose.get');
        Route::put('avatar/pose', SetAvatarPoseController::class)->name('avatar.pose.set');

        Route::get('avatar/skin', GetAvatarSkinController::class)->name('avatar.skin.get');
        Route::put('avatar/skin', SetAvatarSkinController::class)->name('avatar.skin.set');

        Route::get('background', GetBackgroundController::class)->name('background.get');
        Route::put('background', SetBackgroundController::class)->name('background.set');

        Route::get('badges', GetBadgeSettingsController::class)->name('badges.get');
        Route::put('badges', SetBadgeSettingsController::class)->name('badges.set');

        Route::get('/', GetRankCardController::class)->name('get');
    });
Route::get('rankcard/mastery', GetMapMasteryController::class)->name('rankcard.mastery');
