<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Leaderboard (EN)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // META
    // ──────────────────────────────────────────────────────────────────────
    'meta' => [
        'title' => 'Genji Parkour - Leaderboard',
        'og' => [
            'title' => 'Leaderboard — Genji Parkour',
            'description' => 'Browse rankings: XP, tiers, skill ranks, and more.',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // HEADER
    // ──────────────────────────────────────────────────────────────────────
    'header' => [
        'title' => 'Leaderboard',
        'subtitle' => 'xp · tiers · skill ranks',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FILTERS
    // ──────────────────────────────────────────────────────────────────────
    'filters' => [
        'player_label' => 'Player',
        'search_placeholder' => 'Search player…',

        'sort_label' => 'Sort by',
        'sort_options' => [
            'xp' => 'XP',
            'wr' => 'World Records',
            'maps' => 'Maps made',
            'votes' => 'Playtest Votes',
            'skill_score' => 'Skill Score',
        ],

        'rank_label' => 'Search rank',
        'rank_options' => [
            'all' => 'All ranks',
            'ninja' => 'Ninja',
            'jumper' => 'Jumper',
            'skilled' => 'Skilled',
            'pro' => 'Pro',
            'master' => 'Master',
            'grandmaster' => 'Grandmaster',
            'god' => 'God',
        ],

        'reset' => 'Reset filters',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TABLE
    // ──────────────────────────────────────────────────────────────────────
    'table' => [
        'number'         => '#',
        'nickname'       => 'Nickname',
        'xp'             => 'XP',
        'tier'           => 'Tier',
        'skill_rank'     => 'Rank',
        'skill_score'    => 'Skill Score',
        'world_records'  => 'World records',
        'maps_made'      => 'Maps made',
        'playtest_votes' => 'Playtest votes',
        'discord_tag'    => 'Discord tag',
    ],
];
