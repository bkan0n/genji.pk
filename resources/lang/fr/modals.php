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
    // NOTIFICATIONS TRAY
    // ──────────────────────────────────────────────────────────────────────
    'notifications' => [
        'title'         => 'Notifications',
        'empty'         => 'Aucune notification',
        'load_more'     => 'Charger plus',
        'mark_all_read' => 'Tout marquer comme lu',
        'dismiss'       => 'Ignorer',
        'bell_aria'     => 'Ouvrir les notifications',
        'fallback_title'=> 'Notification',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // CREDITS MODAL
    // ──────────────────────────────────────────────────────────────────────
    'credits' => [
        'title'                    => 'Crédits',
        'website_creators'         => 'Créateurs du site',
        'translation_contributors' => 'Contributeurs aux traductions',
        'close'                    => 'Fermer la fenêtre des crédits',

        'role_backend'   => 'Back-end',
        'role_frontend'  => 'Front-end',
        'note_backend'   => 'API, modèle de données et intégration du bot.',
        'note_frontend'  => 'UI/UX, navigateur de cartes et intégration OCR.',
        'discord_label'  => 'Discord',

        'thanks' => 'Merci à toutes les personnes qui contribuent au projet Genji Parkour.',
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

            'help'              => 'Choisissez les notifications que vous souhaitez recevoir pour chaque événement et canal.',
            'footer_hint'        => 'Les nouveaux types d’événements renvoyés par l’API seront ajoutés automatiquement à l’ouverture de ce menu.',
            'discord_unavailable'=> 'Les notifications Discord ne sont pas disponibles pour les comptes email.',

            'columns' => [
                'event' => 'Événement',
            ],

            'channels' => [
                'web'          => 'Web',
                'discord_dm'   => 'Discord DM',
                'discord_ping' => 'Discord Ping',
            ],

            'events' => [
                'verification_approved' => 'Vérification approuvée',
                'verification_rejected' => 'Vérification refusée',
                'auto_verify_failed'    => 'Vérification automatique échouée',
                'record_removed'        => 'Record supprimé',
                'skill_role_update'     => 'Mise à jour du rang de compétence',
                'xp_gain'               => 'Gain d’XP',
                'rank_up'               => 'Montée de rang',
                'prestige'              => 'Prestige',
                'mastery_earned'        => 'Maîtrise obtenue',
                'lootbox_earned'        => 'Lootbox obtenue',
                'playtest_update'       => 'Mise à jour de playtest',
                'record_edited'         => 'Record édité',
                'map_edit_approved'     => 'Édition de map approuvée',
                'map_edit_rejected'     => 'Édition de map refusée',
            ],
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
        'login_required_btn'          => 'Connexion requise',
        'login_required_msg'          => 'La connexion est requise sur cette page',
        'login_required_pr'           => 'La connexion est requise pour voir les records personnels',
        'login_required_filter'       => 'La connexion est requise pour utiliser ce filtre',
        'login_required_progression'  => 'Veuillez vous connecter pour voir votre progression',
        'map_code_required'           => 'Entrez un code de carte',
        'no_results'                  => 'Aucun résultat trouvé',
        'filter_applied'              => 'Filtre appliqué pour {filterId} : {value}',
        'filters_cleared'             => 'Tous les filtres ont été réinitialisés',
        'enter_username'              => 'Entrez un pseudo valide',
        'username_updated'            => 'Votre pseudo a été mis à jour',
        'primary_username_updated'    => 'Pseudo principal mis à jour',
        'already_exist_username'      => 'Ce pseudo existe déjà',
        'set_primary_username'        => 'Définir comme pseudo principal',
        'delete_username'             => 'Supprimer le pseudo',
        'no_username_set'             => 'Aucun pseudo défini',
        'confirm_button'              => 'Confirmer',
        'primary'                     => 'Principal',
        'no_user_id'                  => 'No user ID',
        'max_usernames_allowed'       => 'Maximum 3 usernames allowed',
        'error_loading_username'      => 'Error loading username',
        'error_update_usernames_list' => 'Error while updating the usernames list',
        'error_delete_username'       => 'Error while deleting the username',
        'error_set_primary_username'  => 'Error while setting primary username',
        'error_add_username'          => 'Error while adding the username',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // RULES MODAL
    // ──────────────────────────────────────────────────────────────────────
    'rules' => [
        'title' => 'Règles de la communauté',
        'close' => 'Fermer les règles',

        'rule_1_title' => '1. Soyez respectueux',
        'rule_1_text' => 'Cela signifie pas de commentaires méchants, impolis ou harcelants. Traitez les autres comme vous aimeriez être traité.',

        'rule_2_title' => '2. N\'utilisez pas Discord pour spammer, manipuler l\'engagement ou perturber l\'expérience d\'autres personnes',
        'rule_2_text' => 'Y compris essayer d\'influencer ou de perturber les conversations en utilisant des bots, des comptes faux, plusieurs comptes ou d\'autres automatisations.',

        'rule_3_title' => '3. Pas de langage inapproprié',
        'rule_3_text' => 'L\'utilisation de jurons doit être maintenue à un minimum raisonnable. Tout langage dérogatoire envers un utilisateur est interdit.',

        'rule_4_title' => '4. Pas de matériel pornographique/adulte/autre NSFW',
        'rule_4_text' => 'C\'est un serveur communautaire et non destiné à partager ce type de matériel.',

        'rule_5_title' => '5. Ne partagez pas vos informations personnelles',
        'rule_5_text' => 'Ne partagez pas vos informations personnelles ou celles d\'autres utilisateurs sans leur consentement. Cela inclut les numéros de téléphone, les adresses et autres informations sensibles.',

        'rule_6_title' => '6. Respectez les directives spécifiques à chaque canal',
        'rule_6_text' => 'Chaque canal de votre serveur doit avoir des directives spécifiques pour le type de contenu autorisé. Assurez-vous de respecter ces directives et le but de chaque canal.',

        'rule_7_title' => '7. Pas de partage ou de distribution de hacks, triche ou autres outils/services non autorisés',
        'rule_7_text' => 'Le partage ou la distribution de hacks, de triche ou d\'autres outils/services non autorisés est strictement interdit sur le serveur.',
    ],
];
