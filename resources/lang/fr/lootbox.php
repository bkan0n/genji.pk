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

        'loading_3d'              => 'Chargement de la scène 3D…',
        'loading_3d_failed_title' => 'Échec du chargement 3D',
        'loading_3d_failed_desc'  => 'Essayez de rafraîchir la page ou désactivez les extensions de navigateur lourdes.',
        'retry'                   => 'Réessayer',

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
            'Spring' => 'Printemps',
            'Autumn' => 'Automne',
            'Summer' => 'Été',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // STORE
    // ──────────────────────────────────────────────────────────────────────
    'store' => [
        'title'                     => 'Boutique',
        'subtitle'                  => 'Rotation • Clés • Achats',

        'coins_label'               => 'Crédits',

        'rotation_title'            => 'Rotation actuelle',
        'refresh'                   => 'Actualiser',

        'buy_keys_title'            => 'Acheter des clés',
        'buy_keys_subtitle'         => 'Réductions en lot incluses',

        'price_label'               => 'Prix',
        'purchase_keys'             => 'Acheter des clés',

        'purchase_history_title'    => 'Historique d’achats',
        'purchase_history_subtitle' => 'Dernières transactions',

        'loading_rotation'          => 'Chargement de la rotation…',
        'available_until'           => 'Disponible jusqu’au :date',
        'rotation_number'           => 'Rotation #:id',

        'login_required'            => 'Connexion requise.',
        'login_required_store'      => 'Connexion requise pour utiliser la boutique.',
        'login_required_purchases'  => 'Connectez-vous pour voir vos achats.',

        'no_items_rotation'         => 'Aucun objet dans la rotation.',
        'no_purchases'              => 'Aucun achat pour le moment.',

        'price'                     => 'Prix',
        'paid'                      => 'payé',
        'owned'                     => 'POSSÉDÉ',
        'buy'                       => 'Acheter',
        'item'                      => 'Objet',

        'item_purchased'            => 'Objet acheté !',
        'keys_purchased'            => 'Clés achetées !',
        'purchase_failed'           => 'Échec de l’achat.',
        'store_refreshed'           => 'Boutique actualisée',

        'discount'                  => 'Réduction : :percent%',
        'no_discount'               => 'Aucune réduction',

        'image_unavailable'         => 'Image indisponible',
        'no_image'                  => 'Aucune image',
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
