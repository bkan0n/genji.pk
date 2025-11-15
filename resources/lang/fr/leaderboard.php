<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Leaderboard (FR)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // META
    // ──────────────────────────────────────────────────────────────────────
    'meta' => [
        'title' => 'Genji Parkour - Classement',
        'og' => [
            'title'       => 'Classement — Genji Parkour',
            'description' => 'Parcourez les classements : XP, niveaux, rangs de compétence et plus.',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // HEADER
    // ──────────────────────────────────────────────────────────────────────
    'header' => [
        'title'    => 'Classement',
        'subtitle' => 'xp · niveaux · rangs de compétence',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FILTERS
    // ──────────────────────────────────────────────────────────────────────
    'filters' => [
        'player_label'        => 'Joueur',
        'search_placeholder'  => 'Rechercher un joueur…',

        'sort_label' => 'Trier par',
        'sort_options' => [
            'xp'    => 'XP',
            'wr'    => 'Records du monde',
            'maps'  => 'Maps créées',
            'votes' => 'Votes playtest',
        ],

        'rank_label' => 'Rechercher un rang',
        'rank_options' => [
            'all'        => 'Tous les rangs',
            'ninja'      => 'Ninja',
            'jumper'     => 'Jumper',
            'skilled'    => 'Skilled',
            'pro'        => 'Pro',
            'master'     => 'Master',
            'grandmaster'=> 'Grandmaster',
            'god'        => 'God',
        ],

        'reset' => 'Réinitialiser les filtres',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TABLE
    // ──────────────────────────────────────────────────────────────────────
    'table' => [
        'number'         => '#',
        'nickname'       => 'Pseudo',
        'xp'             => 'XP',
        'tier'           => 'Niveau',
        'skill_rank'     => 'Rang de compétence',
        'world_records'  => 'Records du monde',
        'maps_made'      => 'Maps créées',
        'playtest_votes' => 'Votes playtest',
        'discord_tag'    => 'Tag Discord',
    ],
];