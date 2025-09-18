<?php

return [
    'meta' => [
        'title' => 'Genji Parkour - Classement',
        'og' => [
            'title' => 'Classement — Genji Parkour',
            'description' => 'Parcourez les classements : XP, paliers, rangs de compétence, records mondiaux, et plus encore.',
        ],
    ],

    'header' => [
        'title' => 'Classement',
        'subtitle' => 'xp · paliers · rangs de compétence',
    ],

    'filters' => [
        'player_label' => 'Joueur',
        'search_placeholder' => 'Rechercher un joueur…',

        'sort_label' => 'Trier par',
        'sort_options' => [
            'xp' => 'XP',
            'wr' => 'Records mondiaux',
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
            'master' => 'Master',
            'grandmaster' => 'Grandmaster',
            'god' => 'God',
        ],

        'reset' => 'Réinitialiser les filtres',
    ],

    'table' => [
        'number' => '#',
        'nickname' => 'Pseudo',
        'xp' => 'XP',
        'tier' => 'Palier',
        'skill_rank' => 'Rang de compétence',
        'world_records' => 'Records mondiaux',
        'maps_made' => 'Cartes créées',
        'playtest_votes' => 'Votes de playtest',
        'discord_tag' => 'Tag Discord',
    ],
];
