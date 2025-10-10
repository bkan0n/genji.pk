<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Submit & Playtest (FR)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // HERO & TABS
    // ──────────────────────────────────────────────────────────────────────
    'header' => [
        'title'    => 'Soumettre & Playtest',
        'subtitle' => 'cartes · records · retours',
    ],

    'tabs' => [
        'record'   => 'Soumettre un achèvement',
        'playtest' => 'Soumettre un vote playtest',
        'map'      => 'Soumettre une carte',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // RECORD (Submit Record tab)
    // ──────────────────────────────────────────────────────────────────────
    'record' => [
        'select_quality'    => 'Sélectionnez une qualité (1–6)',
        'optional'          => 'Optionnel',
        'video'             => 'Vidéo (URL)',
        'screenshot'        => 'Capture d’écran',
        'drag_and_drop'     => 'Glissez-déposez une image ici, ou cliquez pour téléverser',
        'cancel'            => 'Annuler',
        'submit_label'      => 'Soumettre le record',

        'code_invalid'        => 'Veuillez saisir un code de carte valide.',
        'time_label'          => 'Temps du record',
        'time_invalid'        => 'Veuillez saisir un temps valide.',
        'quality_required'    => 'Veuillez sélectionner une qualité.',
        'screenshot_required' => 'Veuillez téléverser une capture d’écran.',
        'video_invalid'       => 'Veuillez saisir une URL vidéo valide.',
        'confirm'             => 'Votre record a été soumis avec succès.',

        'time_hint' => 'Format de temps invalide : jusqu’à 5 chiffres avant le point et 2 après (ex. 12345.67).',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MAP
    // ──────────────────────────────────────────────────────────────────────
    'map' => [
        'meta' => [
            'creator'           => 'Créateur',
            'code'              => 'Code',
            'name'              => 'Nom de la carte',
            'checkpoints'       => 'Points de contrôle',
            'edit'              => 'Modifier',
            'add_creator'       => 'Ajouter un créateur',
            'search_creator'    => 'Rechercher un créateur…',
            'search_map_name'   => 'Rechercher un nom de carte…',
        ],

        'required_title' => 'Obligatoire',
        'dropdown' => [
            'select_difficulty'   => 'Sélectionner la difficulté',
            'select_category'     => 'Sélectionner la catégorie',
            'select_mechanics'    => 'Sélectionner les mécaniques',
            'select_restrictions' => 'Sélectionner les restrictions',
            'difficulty'          => 'Difficulté',
            'category'            => 'Type de carte',
            'mechanics'           => 'Mécaniques',
            'restrictions'        => 'Restrictions',
        ],

        'optional_title'         => 'Optionnel',
        'title_label'            => 'Titre',
        'title_placeholder'      => 'Titre court optionnel (128 caractères max)',
        'custom_banner'          => 'Bannière personnalisée',
        'banner_hint'            => 'Recommandé 16:9. JPG/PNG/WebP/AVIF, 10 Mo max.',
        'description_label'      => 'Description',
        'guide_label'            => 'Guide (URL)',
        'guide_hint'             => 'Une URL par ligne ; la première URL valide est utilisée.',
        'medals_hint'            => 'Format : max 5 chiffres avant la décimale et jusqu’à 2 après (ex. 12345.67). Valeurs ≥ 0. Ordre requis : bronze > argent > or.',
        'remove'                 => 'Supprimer',

        'submit_label' => 'Soumettre la carte',

        'val' => [
            'creator'                => 'Veuillez sélectionner un créateur principal.',
            'map_code'               => 'Veuillez saisir un code de carte valide.',
            'map_code_already_exist' => 'Ce code de carte existe déjà.',
            'map_name'               => 'Veuillez saisir le nom de la carte.',
            'checkpoints'            => 'Veuillez sélectionner une difficulté.',
            'map_type'               => 'Veuillez sélectionner un type de carte.',
            'mechanics'              => 'Veuillez sélectionner au moins une mécanique.',
            'restrictions'           => 'Veuillez sélectionner au moins une restriction.',
            'medals_generic'         => 'Médailles invalides.',
            'medals_missing'         => 'Veuillez remplir les trois valeurs de médaille.',
            'medals_order'           => 'L’ordre doit être Bronze > Argent > Or.',
        ],

        'confirm'        => 'Votre carte a été soumise avec succès.',

        'no_description' => 'Aucune description fournie.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PLAYTEST (shared modal/labels)
    // ──────────────────────────────────────────────────────────────────────
    'playtest' => [
        'title_suffix'         => 'demande des retours de playtest',
        'votes'                => 'Votes',
        'difficulty_rating'    => 'Évaluation de la difficulté',
        'rating_sub'           => 'Basé sur les votes de la communauté',
        'question_difficulty'  => 'Cette carte était-elle difficile pour vous ?',
        'complete_to_vote'     => 'Soumettez un achèvement pour pouvoir voter',
        'vote_recorded'        => 'Votre vote a été envoyé',
        'vote_updated'         => 'Votre vote a été mis à jour',
        'no_votes'             => 'Aucun vote pour l’instant',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FILTERS (toolbar + common filter labels)
    // ──────────────────────────────────────────────────────────────────────
    'filters' => [
        'creator'          => 'Créateur',
        'enter_creator'    => 'Saisir un créateur',

        'map_name'         => 'Nom de la carte',
        'enter_map_name'   => 'Saisir le nom de la carte',

        'user'             => 'Nom d’utilisateur',
        'enter_nickname'   => 'Saisir le nom d’utilisateur',

        'code'             => 'Code de la carte',
        'map_code'         => 'Code de la carte',
        'enter_map_code'   => 'Saisir le code de la carte',

        'difficulty'       => 'Difficulté',
        'beginner'         => 'Débutant',
        'easy'             => 'Facile',
        'medium'           => 'Moyenne',
        'hard'             => 'Difficile',
        'very_hard'        => 'Très difficile',
        'extreme'          => 'Extrême',
        'hell'             => 'Enfer',

        'category'               => 'Type de carte',
        'map_type'               => 'Type de carte',
        'classic'                => 'Classique',
        'increasing_difficulty'  => 'Difficulté progressive',
        'tournament'             => 'Tournoi',

        'mechanics'              => 'Mécaniques',
        'restrictions'           => 'Restrictions',

        'playtest_status'        => 'Playtest uniquement',
        'only_true'              => 'Oui',
        'only_false'             => 'Non',
        'completion_filter'      => 'Completions uniquement',
        'medal_filter'           => 'Médailles uniquement',

        'participation_filter'   => 'Filtre de participation',
        'participated_yes'       => 'A participé',
        'participated_no'        => 'N’a pas participé',

        'apply_filters'          => 'Appliquer les filtres',
        'clear_filters'          => 'Réinitialiser les filtres',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TABLE HEADERS
    // ──────────────────────────────────────────────────────────────────────
    'table' => [
        'code'              => 'Code',
        'map_name'          => 'Nom',
        'map_type'          => 'Type',
        'creator'           => 'Créateur',
        'difficulty'        => 'Difficulté',
        'checkpoints'       => 'Points de contrôle',
        'quality'           => 'Qualité',
        'medal_gold'        => 'Or',
        'medal_silver'      => 'Argent',
        'medal_bronze'      => 'Bronze',
        'details'           => 'Détails',
        'view'              => 'Voir',
        'nickname'          => 'Pseudo',
        'time'              => 'Temps',
        'medal'             => 'Médaille',
        'video'             => 'Vidéo',
        'xp'                => 'XP',
        'playtests_votes'   => 'Votes de playtest',
        'mechanics'         => 'Mécaniques',
        'restrictions'      => 'Restrictions',
        'description'       => 'Description',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MESSAGES (confirmations, generic)
    // ──────────────────────────────────────────────────────────────────────
    'messages' => [
        'submit_record_confirm' => 'Votre record a été soumis avec succès.',
        'submit_map_confirm'    => 'Votre carte a été soumise avec succès.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // ERRORS (used in JS)
    // ──────────────────────────────────────────────────────────────────────
    'errors' => [
        'server_unreachable'      => 'Serveur injoignable. Veuillez réessayer.',
        'playtests_load_failed'   => 'Échec du chargement des playtests. Veuillez réessayer plus tard.',
        'image_type'              => 'Type d’image invalide.',
        'image_too_large'         => 'Image trop volumineuse (8 Mo max).',
        'upload_failed'           => 'Échec de l’envoi.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // POPUP / MISC (used in JS)
    // ──────────────────────────────────────────────────────────────────────
    'popup' => [
        'no_results'              => 'Aucun résultat.',
        'filter_applied'          => 'Filtre appliqué : {filterId} = {value}',
        'login_required_msg'      => 'Veuillez vous connecter pour utiliser les outils de soumission & de playtest',
        'map_code_copied'         => 'Code de carte copié dans le presse-papiers !',
        'click_to_copy_map_code'  => 'Cliquer pour copier',
        'copied'                  => 'Copié !',
        'copy'                    => 'Copier',
        'copy_failed'             => 'Échec de la copie.',
        'login'                   => 'Connexion',
        'user_id_copied'          => 'ID utilisateur {id} copié dans le presse-papiers !',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PAGINATION
    // ──────────────────────────────────────────────────────────────────────
    'pagination' => [
        'first'     => '« Premier',
        'prev'      => '‹ Précédent',
        'next'      => 'Suivant ›',
        'last'      => 'Dernier »',
        'page_of'   => 'Page {current} sur {total}',
    ],
];