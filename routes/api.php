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
use App\Http\Controllers\Completions\GetCompletionUpvotesController;
use App\Http\Controllers\Completions\ListAllCompletionsController;
use App\Http\Controllers\Completions\MapLeaderboardController;
use App\Http\Controllers\Completions\SubmitCompletionController;
use App\Http\Controllers\Completions\UpvoteCompletionController;
use App\Http\Controllers\Completions\UserCompletionsController;
use App\Http\Controllers\Content\ListMovementTechCategoriesController;
use App\Http\Controllers\Content\ListMovementTechDifficultiesController;
use App\Http\Controllers\Content\ListMovementTechniquesController;
use App\Http\Controllers\Lootbox\GetUserXpSummaryController;
use App\Http\Controllers\Lootbox\KeysController;
use App\Http\Controllers\Lootbox\RewardsController;
use App\Http\Controllers\Map_edit\CreateMapEditRequestController;
use App\Http\Controllers\Map_edit\GetEditRequestController;
use App\Http\Controllers\Map_edit\GetEditRequestSubmissionViewController;
use App\Http\Controllers\Map_edit\GetPendingEditRequestsController;
use App\Http\Controllers\Map_edit\ResolveEditRequestController;
use App\Http\Controllers\Maps\Guides\GuidesController;
use App\Http\Controllers\Maps\MapSearchController;
use App\Http\Controllers\Maps\Playtests\PlaytestVoteController;
use App\Http\Controllers\Maps\QualityVoteController;
use App\Http\Controllers\Maps\SubmitMapController;
use App\Http\Controllers\Maps\TrendingMapsController;
use App\Http\Controllers\Mods\Content\CreateMovementTechCategoryController;
use App\Http\Controllers\Mods\Content\CreateMovementTechDifficultyController;
use App\Http\Controllers\Mods\Content\CreateMovementTechniqueController;
use App\Http\Controllers\Mods\Content\CreateOrReplaceMapController;
use App\Http\Controllers\Mods\Content\GetMapNamesController;
use App\Http\Controllers\Mods\Content\DeleteMovementTechCategoryController;
use App\Http\Controllers\Mods\Content\DeleteMovementTechDifficultyController;
use App\Http\Controllers\Mods\Content\DeleteMovementTechniqueController;
use App\Http\Controllers\Mods\Content\GetMovementTechniqueController;
use App\Http\Controllers\Mods\Content\ReorderMovementTechCategoryController;
use App\Http\Controllers\Mods\Content\ReorderMovementTechDifficultyController;
use App\Http\Controllers\Mods\Content\ReorderMovementTechniqueController;
use App\Http\Controllers\Mods\Content\UpdateMovementTechCategoryController;
use App\Http\Controllers\Mods\Content\UpdateMovementTechDifficultyController;
use App\Http\Controllers\Mods\Content\UpdateMovementTechniqueController;
use App\Http\Controllers\Mods\Completions\ModerationRecordsController;
use App\Http\Controllers\Mods\Devs\CacheController;
use App\Http\Controllers\Mods\Devs\FrameworkVersionController;
use App\Http\Controllers\Mods\Devs\OverpyCommitController;
use App\Http\Controllers\Mods\Guides\CreateGuideController;
use App\Http\Controllers\Mods\Guides\DeleteGuideController;
use App\Http\Controllers\Mods\Guides\EditGuideController;
use App\Http\Controllers\Mods\Lootbox\DebugGrantRewardWithoutKeyController;
use App\Http\Controllers\Mods\Lootbox\GrantKeyToUserController;
use App\Http\Controllers\Mods\Lootbox\GrantXpToUserController;
use App\Http\Controllers\Mods\Lootbox\SetActiveKeyTypeController;
use App\Http\Controllers\Mods\Lootbox\XP\ChangeXpMultiplierController;
use App\Http\Controllers\Mods\Lootbox\XP\GetXpMultiplierController;
use App\Http\Controllers\Mods\Maps\ArchiveMapsController;
use App\Http\Controllers\Mods\Maps\ConvertToLegacyController;
use App\Http\Controllers\Mods\Maps\ReleaseMapCodeController;
use App\Http\Controllers\Mods\Maps\UpdateMapController;
use App\Http\Controllers\Mods\Moderation\OverrideQualityController;
use App\Http\Controllers\Mods\Moderation\SuspiciousFlagsController;
use App\Http\Controllers\Mods\Playtests\ApprovePlaytestController;
use App\Http\Controllers\Mods\Playtests\DeleteAllPlaytestVotesController;
use App\Http\Controllers\Mods\Playtests\DeletePlaytestVoteController;
use App\Http\Controllers\Mods\Playtests\ForceAcceptPlaytestController;
use App\Http\Controllers\Mods\Playtests\ForceDenyPlaytestController;
use App\Http\Controllers\Mods\Playtests\ResetPlaytestController;
use App\Http\Controllers\Mods\Quests\GenerateQuestRotationController;
use App\Http\Controllers\Mods\Quests\GetQuestConfigController;
use App\Http\Controllers\Mods\Quests\ListQuestsController;
use App\Http\Controllers\Mods\Quests\UpdateQuestConfigController;
use App\Http\Controllers\Mods\Quests\UpdateQuestController;
use App\Http\Controllers\Mods\Quests\UpdateUserQuestProgressController;
use App\Http\Controllers\Mods\Skill\SkillConfigController;
use App\Http\Controllers\Mods\Skill\SkillTiersController;
use App\Http\Controllers\Mods\Store\GenerateNewRotationController;
use App\Http\Controllers\Mods\Store\GetStoreConfigController;
use App\Http\Controllers\Mods\Store\UpdateStoreConfigController;
use App\Http\Controllers\Mods\Tournament\BootstrapTournamentEditionController;
use App\Http\Controllers\Mods\Tournament\ChooseTournamentNextMapController;
use App\Http\Controllers\Mods\Tournament\CreateTournamentCategoryController;
use App\Http\Controllers\Mods\Tournament\DebugTournamentCycleLengthController;
use App\Http\Controllers\Mods\Tournament\DeleteTournamentCategoryController;
use App\Http\Controllers\Mods\Tournament\PauseTournamentTransitionsController;
use App\Http\Controllers\Mods\Tournament\PublishTournamentResultsController;
use App\Http\Controllers\Mods\Tournament\RerollActiveTournamentMapController;
use App\Http\Controllers\Mods\Tournament\RerollTournamentMapController;
use App\Http\Controllers\Mods\Tournament\SelectTournamentMapController;
use App\Http\Controllers\Mods\Tournament\UpdateTournamentCategoryController;
use App\Http\Controllers\Mods\Tournament\UpdateTournamentConfigController;
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
use App\Http\Controllers\Notifications\WebNotificationsController;
use App\Http\Controllers\Quests\ClaimQuestRewardsController;
use App\Http\Controllers\Quests\GetQuestHistoryController;
use App\Http\Controllers\Quests\GetWeeklyQuestsController;
use App\Http\Controllers\Skill\SkillController;
use App\Http\Controllers\Store\GetCurrentRotationController;
use App\Http\Controllers\Store\GetKeyPricingController;
use App\Http\Controllers\Store\GetPurchaseHistoryController;
use App\Http\Controllers\Store\PurchaseItemController;
use App\Http\Controllers\Store\PurchaseKeysController;
use App\Http\Controllers\Store\UserCoinsController;
use App\Http\Controllers\Tournament\GetActiveTournamentEditionController;
use App\Http\Controllers\Tournament\GetTournamentCategoryController;
use App\Http\Controllers\Tournament\GetTournamentConfigController;
use App\Http\Controllers\Tournament\GetTournamentLeaderboardController;
use App\Http\Controllers\Tournament\GetTournamentNextCycleController;
use App\Http\Controllers\Tournament\GetTournamentStreakController;
use App\Http\Controllers\Tournament\ListTournamentCategoriesController;
use App\Http\Controllers\Tournament\ListTournamentCyclesController;
use App\Http\Controllers\Users\GetUserController as PublicGetUserController;
use App\Http\Controllers\Users\GetUserDashboardCompletionsController;
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
use App\Http\Controllers\Utilities\Autocomplete\TagsController;
use App\Http\Controllers\Utilities\Autocomplete\UsersController;
use App\Http\Controllers\Utilities\LogMapClickController;
use App\Http\Controllers\Utilities\OcrController;
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

/* ================== SKILL ================== */
Route::prefix('skill')->group(function () {
    Route::get('config', [SkillController::class, 'config']);
    Route::get('users/{user_id}', [SkillController::class, 'summary'])
        ->where('user_id', '\d{1,20}');
    Route::get('users/{user_id}/breakdown', [SkillController::class, 'breakdown'])
        ->where('user_id', '\d{1,20}');
    Route::get('users/{user_id}/history', [SkillController::class, 'history'])
        ->where('user_id', '\d{1,20}');
    Route::get('users/{user_id}/changes', [SkillController::class, 'changes'])
        ->where('user_id', '\d{1,20}');
    Route::get('users/{user_id}/changes/{change_id}', [SkillController::class, 'changeDetail'])
        ->where('user_id', '\d{1,20}')
        ->whereNumber('change_id');
    Route::get('tiers', [SkillController::class, 'tiers']);
});

/* ================== CONTENT ================== */
Route::prefix('content/movement-tech')->group(function () {
    Route::get('/', ListMovementTechniquesController::class);
    Route::get('categories', ListMovementTechCategoriesController::class);
    Route::get('difficulties', ListMovementTechDifficultiesController::class);
});

/* ================== TOURNAMENTS ================== */
Route::prefix('tournaments')->group(function () {
    Route::get('config', GetTournamentConfigController::class);
    Route::get('categories', ListTournamentCategoriesController::class);
    Route::get('categories/{category}', GetTournamentCategoryController::class)->whereNumber('category');
    Route::get('categories/{category}/next-cycle', GetTournamentNextCycleController::class)->whereNumber('category');
    Route::get('cycles', ListTournamentCyclesController::class);
    Route::get('cycles/{cycle}/leaderboard', GetTournamentLeaderboardController::class)->whereNumber('cycle');
    Route::get('editions/active', GetActiveTournamentEditionController::class);
    Route::get('streaks/{user}', GetTournamentStreakController::class)->where('user', '\d{1,20}');
});

/* ================== CONVERTER ================== */
Route::post('compile', [CompileController::class, 'store'])
    ->middleware(['web'])
    ->name('compile.store');

/* ================== MAPS ================== */
Route::prefix('maps')->group(function () {
    Route::get('/', [MapSearchController::class, 'index'])->name('api.maps.index');
    Route::get('playtests/{thread_id}/votes', [PlaytestVoteController::class, 'index'])
        ->whereNumber('thread_id')
        ->name('playtests.votes.index');
    Route::get('{code}/guides', GuidesController::class)
        ->where('code', '[A-Za-z0-9\-]+')
        ->name('api.maps.guides');
    Route::get('trending', TrendingMapsController::class)->name('api.maps.trending');

    Route::middleware(['web'])->group(function () {
        Route::post('/', SubmitMapController::class)->name('api.maps.submit');
        Route::post('playtests/{thread_id}/vote/{user_id}', [
            PlaytestVoteController::class,
            'store',
        ])->name('playtests.vote.store');
        Route::post('{code}/quality', [QualityVoteController::class, 'store'])
            ->where('code', '[A-Za-z0-9\-]+')
            ->name('api.maps.quality.store');
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
    Route::get('tags', TagsController::class)->name('api.autocomplete.tags');
    Route::get('users', UsersController::class)->name('api.autocomplete.users');
});
Route::middleware(['web'])->prefix('utilities')->name('utilities.')->group(function () {
    Route::post('/image', UploadImageController::class)->name('image.upload');
    Route::post('/log-map-click', LogMapClickController::class)->name('utilities.log_map_click');
});
Route::post('/ocr/extract', [OcrController::class, 'extract'])->name('ocr.extract');

/* ================== COMPLETIONS ================== */
Route::prefix('completions')->group(function () {
    Route::get('/', UserCompletionsController::class)->name('api.completions.user');
    Route::get('{code}', MapLeaderboardController::class)
        ->where('code', '[A-Za-z0-9\-]+')
        ->name('api.completions.map-leaderboard');

    Route::middleware('web')->group(function () {
        Route::post('/', SubmitCompletionController::class)->name('api.completions.submit');
        Route::get('all', ListAllCompletionsController::class)->name('api.completions.all');
        Route::get('upvoting/{message_id}', GetCompletionUpvotesController::class)
            ->where('message_id', '\d{1,20}')
            ->name('api.completions.upvotes.show');
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
    Route::get('{user_id}', PublicGetUserController::class)
        ->whereNumber('user_id')
        ->name('users.show');

    Route::get('{user_id}/completions/dashboard', GetUserDashboardCompletionsController::class)
        ->whereNumber('user_id')
        ->name('users.completions.dashboard');
});

/* ================== LOOTBOX ================== */
Route::prefix('lootbox')->group(function () {
    Route::get('keys', [KeysController::class, 'index']);
    Route::get('users/{user}/keys', [KeysController::class, 'userKeys'])->whereNumber('user');
    Route::get('users/{user}/keys/{keyType}', [KeysController::class, 'drawForUser'])->whereNumber('user');
    Route::get('rewards', [RewardsController::class, 'index']);
    Route::get('users/{user}/rewards', [RewardsController::class, 'userRewards'])->whereNumber('user');

    Route::get('users/{user}/xp-summary', GetUserXpSummaryController::class)->whereNumber('user');

    Route::middleware('web')->group(function () {
        Route::patch('keys/{keyType}', SetActiveKeyTypeController::class)
            ->where('keyType', 'Classic|Winter');

        Route::get('xp/multiplier', GetXpMultiplierController::class);
        Route::post('xp/multiplier', ChangeXpMultiplierController::class);

        Route::post('users/{user}/keys', [KeysController::class, 'grantToUser'])->whereNumber('user');
        Route::post('users/{user}/{keyType}/{rewardType}/{rewardName}', [RewardsController::class, 'grantToUser'])
            ->whereNumber('user');
    });
});

// ================== STORE ==================
Route::prefix('store')->group(function () {
    Route::get('keys', [GetKeyPricingController::class, 'index']);
    Route::get('rotation', [GetCurrentRotationController::class, 'index']);
    Route::get('users/{user_id}/purchases', [GetPurchaseHistoryController::class, 'index'])->whereNumber('user_id');
    Route::get('/users/{user_id}/coins', UserCoinsController::class);

    Route::middleware('web')->group(function () {
        Route::post('purchase/item', [PurchaseItemController::class, 'store']);
        Route::post('purchase/keys', [PurchaseKeysController::class, 'store']);
    });
});

// ================== QUESTS ==================
Route::prefix('quests')->group(function () {
    Route::get('/', [GetWeeklyQuestsController::class, 'index']);
    Route::get('users/{user_id}/history', [GetQuestHistoryController::class, 'index'])
        ->whereNumber('user_id');

    Route::middleware('web')->group(function () {
        Route::post('{progress_id}/claim', [ClaimQuestRewardsController::class, 'store'])
            ->whereNumber('progress_id');
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
    ->middleware(['web', \App\Http\Middleware\RequireDiscordModerator::class])
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

        // CONTENT
        Route::prefix('content/movement-tech')->group(function () {
            Route::post('categories', CreateMovementTechCategoryController::class);
            Route::put('categories/{id}', UpdateMovementTechCategoryController::class)->whereNumber('id');
            Route::delete('categories/{id}', DeleteMovementTechCategoryController::class)->whereNumber('id');
            Route::post('categories/{id}/reorder', ReorderMovementTechCategoryController::class)->whereNumber('id');

            Route::post('difficulties', CreateMovementTechDifficultyController::class);
            Route::put('difficulties/{id}', UpdateMovementTechDifficultyController::class)->whereNumber('id');
            Route::delete('difficulties/{id}', DeleteMovementTechDifficultyController::class)->whereNumber('id');
            Route::post('difficulties/{id}/reorder', ReorderMovementTechDifficultyController::class)->whereNumber('id');

            Route::post('techniques', CreateMovementTechniqueController::class);
            Route::get('techniques/{id}', GetMovementTechniqueController::class)->whereNumber('id');
            Route::put('techniques/{id}', UpdateMovementTechniqueController::class)->whereNumber('id');
            Route::delete('techniques/{id}', DeleteMovementTechniqueController::class)->whereNumber('id');
            Route::post('techniques/{id}/reorder', ReorderMovementTechniqueController::class)->whereNumber('id');
        });

        // CONTENT — Overwatch maps (add map / replace banner)
        Route::get('content/maps/names', GetMapNamesController::class)->name('mods.content.maps.names');
        Route::post('content/maps', CreateOrReplaceMapController::class)->name('mods.content.maps.create');

        // LOOTBOX
        Route::post('lootbox/users/{user_id}/keys/{key_type}', GrantKeyToUserController::class)
            ->whereNumber('user_id')
            ->where('key_type', 'Classic|Winter|Autumn|Spring|Summer')
            ->name('mods.lootbox.grant-key');
        Route::post('lootbox/users/{user_id}/xp', GrantXpToUserController::class)
            ->whereNumber('user_id')
            ->name('mods.lootbox.grant-xp');
        Route::post('lootbox/users/debug/{user_id}/{key_type}/{reward_type}/{reward_name}', DebugGrantRewardWithoutKeyController::class)
            ->whereNumber('user_id')
            ->where('key_type', 'Classic|Winter')
            ->name('mods.lootbox.debug-grant');

        // STORE
        Route::prefix('store')->group(function () {
            Route::post('rotation/generate', GenerateNewRotationController::class);
            Route::get('config', GetStoreConfigController::class);
            Route::put('config', UpdateStoreConfigController::class);
        });

        // SKILL
        Route::prefix('skill')->group(function () {
            Route::get('config', [SkillConfigController::class, 'show']);
            Route::patch('config', [SkillConfigController::class, 'update']);
            Route::patch('tiers', [SkillTiersController::class, 'update']);
        });

        // QUESTS
        Route::prefix('quests')->group(function () {
            Route::get('/', ListQuestsController::class);
            Route::post('rotation/generate', GenerateQuestRotationController::class);
            Route::get('config', GetQuestConfigController::class);
            Route::put('config', UpdateQuestConfigController::class);
            Route::patch('{quest_id}', UpdateQuestController::class)->whereNumber('quest_id');
            Route::patch('admin/users/{user_id}/progress/{progress_id}', UpdateUserQuestProgressController::class)
                ->whereNumber('user_id')
                ->whereNumber('progress_id');
        });

        // TOURNAMENTS
        Route::prefix('tournaments')->group(function () {
            Route::post('categories', CreateTournamentCategoryController::class);
            Route::patch('categories/{category}', UpdateTournamentCategoryController::class)->whereNumber('category');
            Route::delete('categories/{category}', DeleteTournamentCategoryController::class)->whereNumber('category');
            Route::patch('config', UpdateTournamentConfigController::class);
            Route::post('categories/{category}/select-map', SelectTournamentMapController::class)->whereNumber('category');
            Route::post('categories/{category}/reroll', RerollTournamentMapController::class)->whereNumber('category');
            Route::post('categories/{category}/reroll-active', RerollActiveTournamentMapController::class)->whereNumber('category');
            Route::patch('categories/{category}/next-cycle', ChooseTournamentNextMapController::class)->whereNumber('category');
            Route::post('bootstrap', BootstrapTournamentEditionController::class);
            Route::patch('publish-results', PublishTournamentResultsController::class);
            Route::patch('pause', PauseTournamentTransitionsController::class);
            Route::patch('debug-cycle-length', DebugTournamentCycleLengthController::class);
        });

        // GUIDES
        Route::prefix('maps')->group(function () {
            Route::post('{code}/guides', CreateGuideController::class);
            Route::patch('{code}/guides/{user_id}', EditGuideController::class);
            Route::delete('{code}/guides/{user_id}', DeleteGuideController::class);
        });

        // MAPS
        Route::patch('maps/archive', ArchiveMapsController::class);
        Route::post('maps/{code}/legacy', ConvertToLegacyController::class);
        Route::patch('maps/{code}/release-code', ReleaseMapCodeController::class);
        Route::patch('maps/{code}', UpdateMapController::class);

        // MODERATION
        Route::match(['post', 'patch'], 'maps/{code}/quality', OverrideQualityController::class);
        Route::get('completions/suspicious', [SuspiciousFlagsController::class, 'index']);
        Route::post('completions/suspicious', [SuspiciousFlagsController::class, 'store']);
        Route::delete('completions/suspicious', [SuspiciousFlagsController::class, 'destroy']);
        Route::get('completions/moderation/records', [ModerationRecordsController::class, 'index'])
            ->name('mods.completions.moderation.records');

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

        // DEVS
        Route::prefix('cache')->group(function () {
            Route::delete('framework',    [CacheController::class, 'clearFramework'])->name('mods.cache.framework.clear');
            Route::delete('translations', [CacheController::class, 'clearTranslations'])->name('mods.cache.translations.clear');
            Route::delete('avatars',      [CacheController::class, 'clearAvatars'])->name('mods.cache.avatars.clear');
        });
        Route::get('overpy-commit',  [OverpyCommitController::class, 'show'])->name('mods.overpy.commit.show');
        Route::patch('overpy-commit',[OverpyCommitController::class, 'update'])->name('mods.overpy.commit.update');
        Route::get('/framework-version',  [FrameworkVersionController::class, 'show']);
        Route::patch('/framework-version', [FrameworkVersionController::class, 'update']);

        // PLAYTESTS
        Route::prefix('playtests')->group(function () {
            Route::post('{thread_id}/approve', [ApprovePlaytestController::class, 'store'])->whereNumber('thread_id')->name('mods.playtests.approve');
            Route::post('{thread_id}/force_accept',[ForceAcceptPlaytestController::class, 'store'])->whereNumber('thread_id') ->name('mods.playtests.force_accept');
            Route::post('{thread_id}/force_deny', [ForceDenyPlaytestController::class, 'store'])->whereNumber('thread_id') ->name('mods.playtests.force_deny');
            Route::post('{thread_id}/reset', [ResetPlaytestController::class, 'store'])->whereNumber('thread_id') ->name('mods.playtests.reset');
            Route::delete('{thread_id}/vote',[DeleteAllPlaytestVotesController::class, 'destroy'])->whereNumber('thread_id')->name('mods.playtests.votes.delete_all');
            Route::delete('{thread_id}/vote/{user_id}', [DeletePlaytestVoteController::class, 'destroy'])->whereNumber('thread_id')->whereNumber('user_id')->name('mods.playtests.votes.delete_one');
        });

        // MAP EDIT REQUESTS
        Route::prefix('maps')->group(function () {
            Route::get('/map-edits/pending', [GetPendingEditRequestsController::class, 'index']);
            Route::get('/map-edits/{edit_id}', [GetEditRequestController::class, 'show'])->whereNumber('edit_id');
            Route::get('/map-edits/{edit_id}/submission', [GetEditRequestSubmissionViewController::class, 'show'])->whereNumber('edit_id');
            Route::put('/map-edits/{edit_id}/resolve', [ResolveEditRequestController::class, 'update'])->whereNumber('edit_id');
        });
});

/* ================== NOTIFICATIONS ================== */

Route::prefix('notifications')
    ->middleware([
        'web',
        \App\Http\Middleware\RequireAuthenticated::class,
    ])
    ->group(function () {

        // Tray
        Route::get('/unread-count', [WebNotificationsController::class, 'unreadCount']);
        Route::get('/events', [WebNotificationsController::class, 'events']);

        Route::patch('/events/{eventId}/read', [WebNotificationsController::class, 'markRead'])
            ->whereNumber('eventId');

        Route::patch('/events/{eventId}/dismiss', [WebNotificationsController::class, 'dismiss'])
            ->whereNumber('eventId');

        Route::patch('/read-all', [WebNotificationsController::class, 'markAllRead']);

        Route::patch('/dismiss-all', [WebNotificationsController::class, 'dismissAll']);

        // Preferences
        Route::get('/preferences', [WebNotificationsController::class, 'preferences']);

        Route::put('/preferences/bulk', [WebNotificationsController::class, 'bulkUpdatePreferences']);

        Route::put('/preferences/{eventType}/{channel}', [WebNotificationsController::class, 'updatePreference'])
            ->where('eventType', '[a-z_]+')
            ->where('channel', 'web|discord_dm|discord_ping');

        // Should deliver
        Route::get('/should-deliver', [WebNotificationsController::class, 'shouldDeliver']);
    });

/* ================== MAP EDIT ================== */
Route::prefix('maps/map-edits')->group(function () {
    Route::post('/', [CreateMapEditRequestController::class, 'store']);
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
