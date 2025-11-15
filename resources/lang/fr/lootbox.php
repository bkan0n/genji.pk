<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Lootbox (FR)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // META
    // ──────────────────────────────────────────────────────────────────────
    'meta' => [
        'title' => 'Genji Parkour - Lootbox',
        'og' => [
            'title'       => 'Lootbox — Genji Parkour',
            'description' => 'Ouvrez des packs, gagnez des récompenses et collectionnez des cosmétiques.',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // HEADER
    // ──────────────────────────────────────────────────────────────────────
    'header' => [
        'title'    => 'Lootbox',
        'subtitle' => 'Ouvrez des packs · Gagnez des récompenses · Collectionnez des cosmétiques',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // UI
    // ──────────────────────────────────────────────────────────────────────
    'ui' => [
        'give_key'        => 'Donner une clé',
        'open_pack'       => 'Ouvrir un pack',
        'select_key_type' => 'Sélectionner un type de clé',
        'info'            => 'Infos',
        'close_modal'     => 'Fermer la fenêtre',

        'pick_a_card' => 'Choisissez une carte',
        'rewards_types' => [
            'spray'      => 'Spray',
            'skin'       => 'Skin',
            'pose'       => 'Pose',
            'background' => 'Fond d’écran',
            'coins'      => 'Crédits',
        ],

        'common'     => 'Commun',
        'rare'       => 'Rare',
        'epic'       => 'Épique',
        'legendary'  => 'Légendaire',

        'drop_rates'     => 'Taux de drop',
        'lootbox_infos'  => 'Vous recevez une clé lorsque vous montez d’un sous-rang. Exemple : de Newcomer I → Newcomer II.',

        'no_keys_available'     => 'Aucune clé disponible',
        'session_expired'       => 'Session expirée. Ouvrez un nouveau pack.',
        'error_fetching_keys'   => 'Erreur lors de la récupération des clés.',
        'error_loading_rewards' => 'Erreur lors du chargement des récompenses.',

        'key_types' => [
            'Classic' => 'Classique',
            'Winter'  => 'Hiver',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // POPUP / ERRORS
    // ──────────────────────────────────────────────────────────────────────
    'popup' => [
        'error_generic'      => 'Une erreur est survenue. Veuillez réessayer.',
        'network_error'      => 'Erreur réseau.',
        'unexpected_format'  => 'Format de récompenses inattendu.',
        'click_required'     => 'Une action de l’utilisateur est requise.',
        'login_required_msg' => 'Connexion requise.',
        'login_required_btn' => 'Connexion',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // LOOTBOX
    // ──────────────────────────────────────────────────────────────────────
    'lootbox' => [
        'no_keys_available' => 'Aucune clé disponible',
        'session_expired'   => 'Session expirée. Ouvrez un nouveau pack.',
    ],
];
