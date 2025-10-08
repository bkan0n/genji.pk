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
            'title' => 'Classement — Genji Parkour',
            'description' => 'Parcourez les classements : XP, rangs, niveaux de compétence, et plus.',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // HEADER
    // ──────────────────────────────────────────────────────────────────────
    'header' => [
        'title' => 'Classement',
        'subtitle' => 'xp · rangs · niveaux de compétence',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FILTERS
    // ──────────────────────────────────────────────────────────────────────
    'filters' => [
        'player_label' => 'Joueur',
        'search_placeholder' => 'Rechercher un joueur…',

        'sort_label' => 'Trier par',
        'sort_options' => [
            'xp' => 'XP',
            'wr' => 'Records du monde',
            'maps' => 'Cartes créées',
            'votes' => 'Votes de playtest',
        ],

        'rank_label' => 'Rechercher un rang',
        'rank_options' => [
            'all' => 'Tous les rangs',
            'ninja' => 'Ninja',
            'jumper' => 'Jumper',
            'skilled' => 'Skilled',
            'pro' => 'Pro',
            'master' => 'Maître',
            'grandmaster' => 'Grand Maître',
            'god' => 'Dieu',
        ],

        'reset' => 'Réinitialiser les filtres',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TABLE
    // ──────────────────────────────────────────────────────────────────────
    'table' => [
        'number' => '#',
        'nickname' => 'Pseudo',
        'xp' => 'XP',
        'tier' => 'Rang',
        'skill_rank' => 'Niveau de compétence',
        'world_records' => 'Records du monde',
        'maps_made' => 'Cartes créées',
        'playtest_votes' => 'Votes de playtest',
        'discord_tag' => 'Tag Discord',
    ],
];