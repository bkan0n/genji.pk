<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Home (FR)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // META (PAGE <HEAD>)
    // ──────────────────────────────────────────────────────────────────────
    'meta' => [
        'title' => 'Genji Parkour - Accueil',
        'og' => [
            'title'       => 'Genji Parkour',
            'description' => "Le site officiel de Genji Parkour. Trouvez des cartes, ouvrez des lootboxes et bien plus encore !",
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
        'badge'       => 'Communauté active · 24/7',
        'title'       => 'GENJI PARKOUR',
        'tagline'     => 'cartes · classements · guides',
        'description' => 'Découvrez, créez et maîtrisez les cartes les plus audacieuses. Partagez vos records, grimpez dans le classement et rejoignez la communauté.',

        'cta_leaderboard' => 'Voir le classement',
        'cta_submit'      => 'Proposer une carte',

        'stats' => [
            'players'   => '1k+ joueurs',
            'maps'      => '300+ cartes',
            'languages' => 'multilingue',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TOP MAPS (SIDEBAR CARD)
    // ──────────────────────────────────────────────────────────────────────
    'top_maps' => [
        'title'    => 'Top cartes',
        'see_all'  => 'Voir plus de cartes populaires →',
        'play'     => 'Jouer',
        'copied'   => 'Copié ✓',

        'score'       => 'score',
        'completions' => 'terminaisons',
        'upvotes'     => 'upvotes',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // DETAILS MODAL (map details)
    // ──────────────────────────────────────────────────────────────────────
    'details' => [
        'overview'    => 'Aperçu',
        'category'    => 'Catégorie',
        'difficulty'  => 'Difficulté',
        'checkpoints' => 'Checkpoints',
        'official'    => 'Officielle',
        'yes'         => 'Oui',
        'no'          => 'Non',
        'playtesting' => 'Playtest',
        'mechanics'   => 'Mécaniques',
        'restrictions'=> 'Restrictions',
        'creators'    => 'Créateurs',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FEATURE CARDS
    // ──────────────────────────────────────────────────────────────────────
    'features' => [
        'title' => 'Tout pour la communauté',
        'join'  => 'Rejoindre →',

        'cards' => [
            'leaderboard' => [
                'title'       => 'Classement actif',
                'pill'        => 'Live',
                'description' => 'Suivi des records, filtres de difficulté, profils joueurs et badges.',
                'links' => [
                    'leaderboard' => 'Classement',
                    'stats'       => 'Statistiques',
                ],
            ],

            'guides' => [
                'title'       => 'Tutoriels',
                'pill'        => 'Nouveau',
                'description' => 'Astuces, mécaniques avancées, routes optimisées, vidéos intégrées.',
                'links' => [
                    'guides' => 'Guides',
                    'submit' => 'Proposer',
                ],
            ],

            'tools' => [
                'title'       => 'Éditeur & outils',
                'pill'        => 'Beta',
                'description' => 'Convertisseur OverPy → Workshop, modèles multilingues.',
                'links' => [
                    'convertor' => 'Convertisseur',
                    'api'       => 'API',
                ],
            ],
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // CTA STRIP
    // ──────────────────────────────────────────────────────────────────────
    'cta' => [
        'title'       => 'Prêt à grimper dans le classement ?',
        'description' => 'Connectez-vous pour sauvegarder vos records et débloquer des récompenses.',
        'login'       => 'Connexion',
        'learn_more'  => 'En savoir plus',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // ACTIONS / COMMON LABELS
    // ──────────────────────────────────────────────────────────────────────
    'actions' => [
        'copy_code' => 'Copier le code',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // POPUP / TOASTS
    // ──────────────────────────────────────────────────────────────────────
    'popup' => [
        'map_code_copied' => 'Code de carte copié : {code}',
        'copied'          => 'Copié ✓',
        'copy_failed'     => 'Impossible de copier ce code.',
    ],
];