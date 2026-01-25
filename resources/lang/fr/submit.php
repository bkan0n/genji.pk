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
        'subtitle' => 'maps · records · feedback',
    ],

    'tabs' => [
        'record'   => 'Soumettre une completion',
        'playtest' => 'Soumettre un vote playtest',
        'map'      => 'Soumettre une map',
    ],

    'help' => [
        'how_to_submit'           => 'Comment soumettre ?',
        'playtesting_info'        => 'Infos playtest',
        'difficulty_techs_info'   => 'Infos difficulté & techs',
        'rank_how_to_submit'      => 'Comment soumettre ?',
        'rank_submission_rules'   => 'Règles de soumission',
        'rank_info_thresholds'    => 'Infos rangs & seuils',
        'medals_info_thresholds'  => 'Infos médailles & seuils',
    ],

    'help_groups' => [
        'map_submission_info' => 'Infos soumission de map',
        'rank_promotion'      => 'Promotion de rang',
    ],

    'notice' => [
        'title'           => 'Soumission de playtest',
        'pending_accept'  => "Votre soumission ne comptera pas pour les records officiels tant que la map n'est pas acceptée.",
        'mutable_difficulty' => 'La difficulté peut changer à tout moment tant que la map n’est pas finalisée.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // RECORD (Submit Record tab)
    // ──────────────────────────────────────────────────────────────────────
    'record' => [
        'select_quality'       => 'Sélectionnez une qualité (1–6)',
        'optional'             => 'Optionnel',
        'video'                => 'Vidéo (URL)',
        'screenshot'           => 'Capture d’écran',
        'drag_and_drop'        => 'Glissez-déposez une image ici ou cliquez pour importer',
        'cancel'               => 'Annuler',
        'submit_label'         => 'Soumettre le record',
        'uploading_screenshot' => 'Importation de la capture d’écran…',
        'ocr_processing'       => 'Traitement OCR…',

        'code_invalid'        => 'Veuillez entrer un code de map valide.',
        'time_label'          => 'Temps du record',
        'time_invalid'        => 'Veuillez entrer un temps valide.',
        'quality_required'    => 'Veuillez sélectionner une qualité.',
        'screenshot_required' => 'Veuillez importer une capture d’écran.',
        'video_invalid'       => 'Veuillez entrer une URL vidéo valide.',
        'confirm'             => 'Votre record a été soumis avec succès.',

        'time_hint' => 'Format de temps invalide : jusqu’à 5 chiffres avant le point et 2 après (ex. 12345.67).',
        'view_modal' => 'Voir le playtest',

        'quality'   => 'Qualité',
        'quality_1' => '1 - Mauvaise',
        'quality_2' => '2 - Faible',
        'quality_3' => '3 - Moyenne',
        'quality_4' => '4 - Bonne',
        'quality_5' => '5 - Très bonne',
        'quality_6' => '6 - Excellente',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MAP
    // ──────────────────────────────────────────────────────────────────────
    'map' => [
        'meta' => [
            'creator'           => 'Créateur',
            'code'              => 'Code',
            'name'              => 'Nom de la carte',
            'checkpoints'       => 'Checkpoints',
            'edit'              => 'Modifier',
            'save'              => 'Enregistrer',
            'cancel'            => 'Annuler',
            'add_creator'       => 'Ajouter un créateur',
            'search_creator'    => 'Rechercher un créateur…',
            'search_map_name'   => 'Rechercher un map name…',
            'official'          => 'Officiel',
            'unofficial'        => 'Non-officiel',
        ],

        'required_title'          => 'Obligatoire',
        'dropdown' => [
            'select_difficulty'   => 'Sélectionner une difficulté',
            'select_category'     => 'Sélectionner une catégorie',
            'select_mechanics'    => 'Sélectionner des mécaniques',
            'select_restrictions' => 'Sélectionner des restrictions',
            'difficulty'          => 'Difficulté',
            'category'            => 'Type de map',
            'mechanics'           => 'Mécaniques',
            'restrictions'        => 'Restrictions',
        ],

        'optional_title'         => 'Optionnel',
        'title_label'            => 'Titre',
        'title_placeholder'      => 'Titre court optionnel (max 128 caractères)',
        'custom_banner'          => 'Bannière personnalisée',
        'banner_hint'            => 'Format recommandé 16:9. JPG/PNG/WebP/AVIF, max 10 Mo.',
        'description_label'      => 'Description',
        'guide_label'            => 'Guide (URL)',
        'guide_hint'             => 'Une URL par ligne ; la première URL valide est utilisée.',
        'medals_hint'            => 'Format : max 5 chiffres avant la décimale et jusqu’à 2 après (ex. 12345.67). Valeurs ≥ 0. Ordre requis : bronze > silver > gold.',
        'remove'                 => 'Supprimer',

        'submit_label' => 'Soumettre la map',

        'val' => [
            'creator'                => 'Veuillez sélectionner un créateur principal.',
            'map_code'               => 'Veuillez entrer un code de map valide.',
            'map_code_already_exist' => 'Ce code de map existe déjà.',
            'map_name'               => 'Veuillez entrer le map name.',
            'checkpoints'            => 'Veuillez sélectionner une difficulté.',
            'map_type'               => 'Veuillez sélectionner un type de map.',
            'mechanics'              => 'Veuillez sélectionner au moins une mécanique.',
            'restrictions'           => 'Veuillez sélectionner au moins une restriction.',
            'medals_generic'         => 'Médailles invalides.',
            'medals_missing'         => 'Veuillez remplir les trois valeurs de médaille.',
            'medals_order'           => 'L’ordre doit être Bronze > Silver > Gold.',
        ],

        'confirm'        => 'Votre map a été soumise avec succès.',

        'no_description' => 'Aucune description fournie.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MAP BANNER UNOFFICIAL NOTICE
    // ──────────────────────────────────────────────────────────────────────
    'unofficial_notice' => [
        'title' => 'Soumission de map non officielle',
        'li1'   => "Il s’agit d’une map non officielle, elle ne passera donc pas par le playtest et vous ne gagnerez pas de rangs ou d’XP pour les completions.",
        'li2'   => "Si un code de map est créé sur des serveurs hors CN, nous pouvons le faire passer en playtest en reliant les codes.",
        'li3'   => "Pour que les completions comptent pour les rangs et l’XP, la map doit être jouée sur des serveurs non CN.",
        'li4'   => "Veuillez indiquer qui « possède » le code CN dans la description afin que nous puissions le ping si la map change.",
    ],

    // ──────────────────────────────────────────────────────────────────────
    // OCR NOTICE
    // ──────────────────────────────────────────────────────────────────────
    'ocr' => [
        'title' => 'OCR sur capture d’écran',
        'li1'   => "Lorsque vous importez une capture, nous essayons de détecter automatiquement le code de la map et le temps.",
        'li2'   => "Vérifiez toujours les valeurs avant de soumettre votre record.",
    ],

    // ──────────────────────────────────────────────────────────────────────
    // HELP MODALS (full texts for modals)
    // ──────────────────────────────────────────────────────────────────────
    'how_to_submit' => [
        'title' => 'Comment soumettre une map ?',
        'intro' => 'Ce dialogue vous guide à travers chaque étape de la section « Soumettre une map ».',

        'meta' => [
            'title'        => 'Métadonnées (map & créateurs)',
            'li_creator'   => 'Créateur principal : rempli automatiquement depuis votre session. Vous pouvez le modifier (et ajouter des co-créateurs si l’option est visible).',
            'li_code'      => 'Code de la map : cliquez sur « Modifier » à côté du champ « Code ». Le code doit être unique (nous vérifions s’il existe déjà).',
            'li_name'      => 'Map name : cliquez sur « Modifier » à côté de « Map name » et choisissez un nom via l’autocomplétion.',
            'li_checkpoints'=> 'Checkpoints : cliquez sur « Modifier » et entrez un nombre strictement positif.',
        ],

        'required' => [
            'title'         => 'Champs obligatoires',
            'p1'            => 'Ces champs doivent être remplis avant de pouvoir soumettre :',
            'li_difficulty' => 'Difficulté : choisissez une valeur (Easy → Hell).',
            'li_category'   => 'Catégorie / type de map : choisissez un type (ex. Classic, Increasing Difficulty).',
            'li_mechanics'  => 'Mécaniques : sélectionnez au moins une.',
            'li_restrictions'=> 'Restrictions : sélectionnez au moins une.',
        ],

        'medals' => [
            'title'    => 'Médailles (optionnel mais validé si présent)',
            'p1'       => 'Vous pouvez définir des temps (en secondes) pour Or, Argent et Bronze.',
            'li_rules' => 'Si vous définissez une médaille, vous devez renseigner les trois.',
            'li_pattern' => 'Format : 1–5 chiffres, optionnellement « . » et 1–2 décimales (ex. 5550.23). Valeurs non négatives.',
            'li_order'   => 'Ordre requis : Bronze > Silver > Gold (Bronze plus grand que Silver, lui-même plus grand que Gold).',
        ],

        'optional' => [
            'title'        => 'Optionnel',
            'li_title'     => 'Titre : court titre optionnel (max 128 caractères).',
            'li_banner'    => 'Bannière personnalisée : glissez-déposez ou cliquez pour importer (JPG/PNG/WebP/AVIF), taille ≤ 8 Mo. 16:9 recommandé.',
            'li_description'=> 'Description : texte libre (si vide, « N/A » s’affiche).',
            'li_guide'     => 'URL(s) de guide : une URL par ligne. La première URL valide est utilisée.',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PLAYTEST (shared modal/labels)
    // ──────────────────────────────────────────────────────────────────────
    'playtest' => [
        'title_suffix'             => 'demande un retour de playtest',
        'votes'                    => 'Votes',
        'difficulty_rating'        => 'Note de difficulté',
        'rating_sub'               => 'Basé sur les votes de la communauté',
        'question_difficulty'      => 'Voter la difficulté de la map',
        'complete_to_vote'         => 'Soumettez une completion pour pouvoir voter',
        'vote_recorded'            => 'Votre vote a été enregistré',
        'vote_updated'             => 'Votre vote a été mis à jour',
        'no_votes'                 => 'Aucun vote pour le moment',
        'cannot_vote_own_map'      => 'Vous ne pouvez pas voter pour votre propre carte',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FILTERS (toolbar + common filter labels)
    // ──────────────────────────────────────────────────────────────────────
    'filters' => [
        'creator'          => 'Créateur',
        'enter_creator'    => 'Entrez un créateur',

        'map_name'         => 'Nom de la carte',
        'enter_map_name'   => 'Entrez le nom de la carte',

        'user'             => 'Nom du joueur',
        'enter_nickname'   => 'Entrez un nom de joueur',

        'code'             => 'Code de la map',
        'map_code'         => 'Code de la map',
        'enter_map_code'   => 'Entrez un code de map',

        'difficulty'       => 'Difficulté',
        'beginner'         => 'Débutant',
        'easy'             => 'Facile',
        'medium'           => 'Moyenne',
        'hard'             => 'Difficile',
        'very_hard'        => 'Très difficile',
        'extreme'          => 'Extrême',
        'hell'             => 'Infernal',

        'category'               => 'Type de map',
        'map_type'               => 'Type de map',
        'classic'                => 'Classique',
        'increasing_difficulty'  => 'Difficulté progressive',
        'tournament'             => 'Tournoi',

        'mechanics'              => 'Mécaniques',
        'restrictions'           => 'Restrictions',

        'playtest_status'        => 'Playtest uniquement',
        'only_true'              => 'Vrai uniquement',
        'only_false'             => 'Faux uniquement',
        'completion_filter'      => 'Completions uniquement',
        'medal_filter'           => 'Médailles uniquement',

        'participation_filter'   => 'Filtre de participation',
        'participated_yes'       => 'A participé',
        'participated_no'        => 'N’a pas participé',

        'apply_filters'          => 'Appliquer les filtres',
        'clear_filters'          => 'Réinitialiser les filtres',

        'tags'                   => 'Tags',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TABLE HEADERS
    // ──────────────────────────────────────────────────────────────────────
    'table' => [
        'code'              => 'Code',
        'map_name'          => 'Nom de la carte',
        'map_type'          => 'Type',
        'creator'           => 'Créateur',
        'difficulty'        => 'Difficulté',
        'checkpoints'       => 'Checkpoints',
        'quality'           => 'Qualité',
        'medals'            => 'Medals',
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
        'playtests_votes'   => 'Votes playtest',
        'mechanics'         => 'Mécaniques',
        'restrictions'      => 'Restrictions',
        'description'       => 'Description',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MESSAGES (confirmations, generic)
    // ──────────────────────────────────────────────────────────────────────
    'messages' => [
        'submit_record_confirm' => 'Votre record a été soumis avec succès.',
        'submit_map_confirm'    => 'Votre map a été soumise avec succès.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // ERRORS
    // ──────────────────────────────────────────────────────────────────────
    'errors' => [
        'server_unreachable'    => 'Serveur injoignable. Veuillez réessayer.',
        'playtests_load_failed' => 'Échec du chargement des playtests. Veuillez réessayer plus tard.',
        'image_type'            => 'Type d’image invalide.',
        'image_too_large'       => 'Image trop volumineuse (max 8 Mo).',
        'upload_failed'         => 'Échec de l’upload.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // POPUP / MISC
    // ──────────────────────────────────────────────────────────────────────
    'popup' => [
        'no_results'             => 'Aucun résultat trouvé.',
        'filter_applied'         => 'Filtre appliqué : {filterId} = {value}',
        'login_required_msg'     => 'Veuillez vous connecter pour utiliser les outils de soumission & playtest',
        'map_code_copied'        => 'Code de map copié : {code}',
        'click_to_copy_map_code' => 'Cliquer pour copier',
        'copied'                 => 'Copié !',
        'copy'                   => 'Copier',
        'copy_failed'            => 'Échec de la copie.',
        'login'                  => 'Connexion',
        'user_id_copied'         => 'User ID {id} copié dans le presse-papiers !',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PAGINATION
    // ──────────────────────────────────────────────────────────────────────
    'pagination' => [
        'first'   => '« Première',
        'prev'    => '‹ Préc.',
        'next'    => 'Suivante ›',
        'last'    => 'Dernière »',
        'page_of' => 'Page {current} sur {total}',
    ],
];