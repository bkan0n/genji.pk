<?php

return [
    // -------------------------------------------------
    // Meta (page <head>)
    // -------------------------------------------------
    'meta' => [
        'title' => 'Genji Parkour - Home',
        'og' => [
            'title' => 'Genji Parkour',
            'description' => 'The Official Genji Parkour Website. Find Genji Parkour maps, open lootboxes, and more!',
        ],
    ],

    // -------------------------------------------------
    // Hero
    // -------------------------------------------------
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
            'languages' => 'multi-languages',
        ],
    ],

    // -------------------------------------------------
    // Top maps (sidebar card)
    // -------------------------------------------------
    'top_maps' => [
        'title' => 'Top maps',
        'see_all' => 'See everything →',
        'play' => 'Play',

        // (facultatif) exemples de lignes affichées dans la carte
        'items' => [
            [
                'name' => 'Shuriken Trials',
                'difficulty' => 'Hard',
                'wr' => '12:34 WR',
            ],
            [
                'name' => 'Dragon’s Path',
                'difficulty' => 'Medium',
                'wr' => '08:12 WR',
            ],
            [
                'name' => 'Blade Rush',
                'difficulty' => 'Easy',
                'wr' => '03:47 WR',
            ],
        ],
    ],

    // -------------------------------------------------
    // Feature cards
    // -------------------------------------------------
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

            'guides' => [
                'title' => 'Guides & tutos',
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
                'description' => 'Convertor OverPy → Workshop, multilingual templates.',
                'links' => [
                    'convertor' => 'Convertor',
                    'api' => 'API',
                ],
            ],
        ],
    ],

    // -------------------------------------------------
    // CTA strip
    // -------------------------------------------------
    'cta' => [
        'title' => 'Ready to climb the leaderboard ?',
        'description' => 'Log in to save your records and unlock rewards.',
        'login' => 'Login',
        'learn_more' => 'Learn more',
    ],
];
