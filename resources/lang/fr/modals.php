<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Modals (FR)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // COMMON
    // ──────────────────────────────────────────────────────────────────────
    'common' => [
        'na'               => 'N/A',
        'no_description'   => 'Aucune description disponible',
        'error'            => 'Erreur',
        'loading'          => 'Chargement…',
        'to_see_details'   => 'pour voir les détails !',
        'timestamp_format' => '{day} {month} {year} à {hour}:{minute} {AMorPM}',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // CREDITS MODAL
    // ──────────────────────────────────────────────────────────────────────
    'credits' => [
        'title'                    => 'Crédits',
        'website_creators'         => 'Créateurs du site',
        'translation_contributors' => 'Contributeurs aux traductions',
        'close'                    => 'Fermer la fenêtre des crédits',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // SETTINGS MODAL
    // ──────────────────────────────────────────────────────────────────────
    'settings' => [
        'title' => 'Paramètres',
        'tabs' => [
            'overwatch'     => 'Pseudos Overwatch',
            'notifications' => 'Notifications',
        ],
        'overwatch' => [
            'confirm' => 'Confirmer',
        ],
        'notifications' => [
            'dm_on_verification'            => 'M’envoyer un message lors d’une vérification',
            'dm_on_skill_role_update'       => 'M’envoyer un message lors d’une mise à jour de rang de compétence',
            'dm_on_lootbox_gain'            => 'M’envoyer un message lors d’un gain de lootbox',
            'ping_on_xp_gain'               => 'Me ping lors d’un gain d’XP',
            'ping_on_mastery'               => 'Me ping lors d’un nouveau palier de maîtrise',
            'ping_on_community_rank_update' => 'Me ping lors d’un changement de rang communautaire',
        ],
        'close' => 'Fermer les paramètres',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PROFILE MODAL
    // ──────────────────────────────────────────────────────────────────────
    'profile' => [
        'copy'     => 'Copier',
        'dashboard'=> 'Tableau de bord',
        'settings' => 'Paramètres',
        'logout'   => 'Déconnexion',
        'close'    => 'Fermer le profil',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // POPUP / MISC
    // ──────────────────────────────────────────────────────────────────────
    'popup' => [
        'login_required_btn'        => 'Connexion requise',
        'login_required_msg'        => 'La connexion est requise sur cette page',
        'login_required_pr'         => 'La connexion est requise pour voir les records personnels',
        'login_required_filter'     => 'La connexion est requise pour utiliser ce filtre',
        'login_required_progression'=> 'Veuillez vous connecter pour voir votre progression',
        'map_code_required'         => 'Entrez un code de carte',
        'no_results'                => 'Aucun résultat trouvé',
        'filter_applied'            => 'Filtre appliqué pour {filterId} : {value}',
        'filters_cleared'           => 'Tous les filtres ont été réinitialisés',
        'enter_username'            => 'Entrez un pseudo valide',
        'username_updated'          => 'Votre pseudo a été mis à jour',
        'primary_username_updated'  => 'Pseudo principal mis à jour',
        'already_exist_username'    => 'Ce pseudo existe déjà',
        'set_primary_username'      => 'Définir comme pseudo principal',
        'delete_username'           => 'Supprimer le pseudo',
        'no_username_set'           => 'Aucun pseudo défini',
        'confirm_button'            => 'Confirmer',
    ],
];
