<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Rank Card (FR)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // HEADER & NAV
    // ──────────────────────────────────────────────────────────────────────
    'page_title' => 'Tableau de bord',
    'subtitle'   => 'rank card & badges',

    // ──────────────────────────────────────────────────────────────────────
    // TABS
    // ──────────────────────────────────────────────────────────────────────
    'tab_rankcard' => 'Rank Card',
    'tab_badges'   => 'Badges',

    // ──────────────────────────────────────────────────────────────────────
    // SEARCH & FILTERS
    // ──────────────────────────────────────────────────────────────────────
    'search_placeholder'   => 'Entrez un nom d’utilisateur',
    'search_button'        => 'Rechercher',
    'reset_filter_button'  => 'Réinitialiser',

    // ──────────────────────────────────────────────────────────────────────
    // ACTIONS (buttons)
    // ──────────────────────────────────────────────────────────────────────
    'change_badges_button'     => 'Changer les badges',
    'change_avatar_button'     => 'Changer l’avatar',
    'change_background_button' => 'Changer le fond',
    'change_skin_button'       => 'Changer la skin',
    'change_pose_button'       => 'Changer la pose',
    'reset_badges_button'      => 'Réinitialiser les badges',
    'reset_background_button'  => 'Réinitialiser le fond',
    'reset_avatar_button'      => 'Réinitialiser l’avatar',

    // ──────────────────────────────────────────────────────────────────────
    // STATS SUMMARY
    // ──────────────────────────────────────────────────────────────────────
    'completions'        => 'Completions : {amount}',
    'no_badges_found'    => 'Aucun badge trouvé',
    'no_backgrounds_found'=> 'Aucun fond trouvé',
    'no_type_found'      => 'Aucun {type} trouvé',
    'badges_saved'       => 'Les badges ont été sauvegardés',
    'background_saved'   => 'Le fond a été sauvegardé',
    'avatar_saved'       => 'L’avatar a été sauvegardé',
    'loading_rewards'    => 'Chargement des récompenses…',

    'maps_label'          => 'Maps',
    'playtests_label'     => 'Playtests',
    'world_records_label' => 'Records du monde',
    'completed_total'     => 'Complétés : {completed} / Total : {total}',

    'xp'              => 'XP',
    'prestige_level'  => 'Niveau de prestige',
    'community_rank'  => 'Rang communautaire',

    // ──────────────────────────────────────────────────────────────────────
    // IMAGES ALT TEXTS
    // ──────────────────────────────────────────────────────────────────────
    'alts' => [
        'user_avatar'       => 'Avatar utilisateur',
        'badge_enlarged'    => 'Badge agrandi',
        'background'        => 'Fond',
        'player_rank_badge' => 'Badge de rang',
        'player_avatar'     => 'Avatar du joueur',
        'badge'             => 'Badge',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MEDALS
    // ──────────────────────────────────────────────────────────────────────
    'medals' => [
        'gold'   => 'Or',
        'silver' => 'Argent',
        'bronze' => 'Bronze',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // COMMON
    // ──────────────────────────────────────────────────────────────────────
    'close' => 'Fermer',

    // ──────────────────────────────────────────────────────────────────────
    // ERRORS
    // ──────────────────────────────────────────────────────────────────────
    'errors' => [
        'select_user'          => 'Sélectionnez un utilisateur dans la liste.',
        'api_connection'       => 'Erreur de connexion à l’API.',
        'suggestions_failed'   => 'Échec du chargement des suggestions.',
        'badges_fetch_failed'  => 'Échec du chargement des badges.',
        'badges_save_failed'   => 'Échec de la sauvegarde des badges.',
        'background_save_failed'=> 'Échec de la sauvegarde du fond.',
        'avatar_save_failed'   => 'Échec de la sauvegarde de l’avatar.',
        'skins_fetch_failed'   => 'Échec du chargement des skins.',
        'poses_fetch_failed'   => 'Échec du chargement des poses.',
        'rewards_fetch_failed' => 'Échec du chargement des récompenses.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // DIFFICULTIES
    // ──────────────────────────────────────────────────────────────────────
    'difficulties' => [
        'easy'      => 'Facile',
        'medium'    => 'Moyen',
        'hard'      => 'Difficile',
        'very_hard' => 'Très difficile',
        'extreme'   => 'Extrême',
        'hell'      => 'Infernal',
    ],
];
