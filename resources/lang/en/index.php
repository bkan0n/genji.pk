<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Home (EN)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // META (PAGE <HEAD>)
    // ──────────────────────────────────────────────────────────────────────
    'meta' => [
        'title' => 'Genji Parkour - Home',
        'og' => [
            'title' => 'Genji Parkour',
            'description' => 'The Official Genji Parkour Website. Find Genji Parkour maps, open lootboxes, and more!',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // ANNOUNCEMENT
    // ──────────────────────────────────────────────────────────────────────
    'announcement' => [
        'title' => '',
        'text' => '',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // HERO
    // ──────────────────────────────────────────────────────────────────────
    'hero' => [
        'badge' => 'Live community · 24/7',
        'title' => 'GENJI PARKOUR',
        'tagline' => 'maps · rankings · guides',
        'description' => 'Discover, create, and master the most daring maps. Share your records, climb the leaderboard, and join the community.',

        'cta_leaderboard' => 'See the leaderboard',
        'cta_submit' => 'Submit a map',

        'stats' => [
            'players' => '1k+ players',
            'maps' => '300+ maps',
            'languages' => 'multi-language',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TOP MAPS (SIDEBAR CARD)
    // ──────────────────────────────────────────────────────────────────────
    'top_maps' => [
        'title'    => 'Top maps',
        'see_all'  => 'See more top rated maps →',
        'play'     => 'Play',
        'copied'   => 'Copied ✓',

        'score'       => 'score',
        'completions' => 'completions',
        'upvotes'     => 'upvotes',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // DETAILS MODAL (map details)
    // ──────────────────────────────────────────────────────────────────────
    'details' => [
        'overview'    => 'Overview',
        'category'    => 'Category',
        'difficulty'  => 'Difficulty',
        'checkpoints' => 'Checkpoints',
        'official'    => 'Official',
        'yes'         => 'Yes',
        'no'          => 'No',
        'playtesting' => 'Playtesting',
        'mechanics'   => 'Mechanics',
        'restrictions'=> 'Restrictions',
        'creators'    => 'Creators',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FEATURE CARDS
    // ──────────────────────────────────────────────────────────────────────
    'features' => [
        'title' => 'Everything for the community',
        'join' => 'Join →',

        'cards' => [
            'leaderboard' => [
                'title' => 'Active leaderboard',
                'pill' => 'Live',
                'description' => 'Record tracking, difficulty filters, player profiles and badges.',
                'links' => [
                    'leaderboard' => 'Leaderboard',
                    'stats' => 'Stats',
                ],
            ],

            'tournament' => [
                'title' => 'Weekly tournaments',
                'pill' => 'New',
                'description' => 'Compete on rotating maps, climb the active tournament leaderboard, and follow the current champion race.',
                'links' => [
                    'tournaments' => 'View tournaments',
                ],
            ],

            'guides' => [
                'title' => 'Tutorials',
                'pill' => 'New',
                'description' => 'Tips, advanced mechanics, optimized routes, integrated videos.',
                'links' => [
                    'guides' => 'Guides',
                    'submit' => 'Submit',
                ],
            ],

            'tools' => [
                'title' => 'Editor & tools',
                'pill' => 'Beta',
                'description' => 'Converter OverPy → Workshop, multilingual templates.',
                'links' => [
                    'converter' => 'Converter',
                    'api' => 'API',
                ],
            ],
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // CTA STRIP
    // ──────────────────────────────────────────────────────────────────────
    'tournament_spotlight' => [
        'live_label' => 'Current cycle',
        'current_leader' => 'Current leader',
        'current_leaders' => 'Current leaders',
        'live_count' => ':count tournaments',
        'rank_one' => 'Rank 1',
        'time' => 'Time',
        'empty' => 'No tournament leader yet.',
        'empty_short' => 'No leader',
        'unknown_player' => 'Unknown player',
    ],

    'cta' => [
        'title' => 'Ready to climb the leaderboard?',
        'description' => 'Log in to save your records and unlock rewards.',
        'login' => 'Login',
        'learn_more' => 'Learn more',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // ACTIONS / COMMON LABELS
    // ──────────────────────────────────────────────────────────────────────
    'actions' => [
        'copy_code' => 'Copy code',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // POPUP / TOASTS
    // ──────────────────────────────────────────────────────────────────────
    'popup' => [
        'map_code_copied' => 'Map code copied: {code}',
        'copied'          => 'Copied ✓',
        'copy_failed'     => 'Unable to copy this code.',
    ],
];
