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
            'title' => 'Genji Parkour',
            'description' => 'Le site officiel de Genji Parkour. Trouvez des cartes Genji Parkour, ouvrez des lootboxes, et plus encore !',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // HERO
    // ──────────────────────────────────────────────────────────────────────
    'hero' => [
        'badge' => 'Communauté en direct · 24/7',
        'title' => 'GENJI PARKOUR',
        'tagline' => 'cartes · classements · guides',
        'description' => 'Découvrez, créez et maîtrisez les cartes les plus audacieuses. Partagez vos records, grimpez au classement et rejoignez la communauté.',

        'cta_leaderboard' => 'Voir le classement',
        'cta_submit' => 'Soumettre une carte',

        'stats' => [
            'players' => '1k+ joueurs',
            'maps' => '300+ cartes',
            'languages' => 'multilingue',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TOP MAPS (SIDEBAR CARD)
    // ──────────────────────────────────────────────────────────────────────
    'top_maps' => [
        'title' => 'Meilleures cartes',
        'see_all' => 'Tout voir →',
        'play' => 'Jouer',

        'items' => [
            [
                'name' => 'Shuriken Trials',
                'difficulty' => 'Difficile',
                'wr' => '12:34 WR',
            ],
            [
                'name' => 'Dragon’s Path',
                'difficulty' => 'Moyenne',
                'wr' => '08:12 WR',
            ],
            [
                'name' => 'Blade Rush',
                'difficulty' => 'Facile',
                'wr' => '03:47 WR',
            ],
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FEATURE CARDS
    // ──────────────────────────────────────────────────────────────────────
    'features' => [
        'title' => 'Tout pour la communauté',
        'join' => 'Rejoindre →',

        'cards' => [
            'leaderboard' => [
                'title' => 'Classement actif',
                'pill' => 'En direct',
                'description' => 'Suivi des records, filtres de difficulté, profils joueurs et badges.',
                'links' => [
                    'leaderboard' => 'Classement',
                    'stats' => 'Stats',
                ],
            ],

            'guides' => [
                'title' => 'Guides & tutos',
                'pill' => 'Nouveau',
                'description' => 'Astuces, mécaniques avancées, routes optimisées, vidéos intégrées.',
                'links' => [
                    'guides' => 'Guides',
                    'submit' => 'Soumettre',
                ],
            ],

            'tools' => [
                'title' => 'Éditeur & outils',
                'pill' => 'Bêta',
                'description' => 'Convertisseur OverPy → Workshop, modèles multilingues.',
                'links' => [
                    'convertor' => 'Convertisseur',
                    'api' => 'API',
                ],
            ],
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // CTA STRIP
    // ──────────────────────────────────────────────────────────────────────
    'cta' => [
        'title' => 'Prêt à grimper au classement ?',
        'description' => 'Connectez-vous pour sauvegarder vos records et débloquer des récompenses.',
        'login' => 'Connexion',
        'learn_more' => 'En savoir plus',
    ],
];
