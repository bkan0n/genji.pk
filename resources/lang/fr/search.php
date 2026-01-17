<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Search (FR)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // META / PAGE
    // ──────────────────────────────────────────────────────────────────────
    'page_title'      => 'Recherche',
    'og_title'        => 'Genji Parkour - Recherche',
    'og_description'  => 'Trouvez des cartes, des completions, des guides et des records personnels.',

    // ──────────────────────────────────────────────────────────────────────
    // HEADER
    // ──────────────────────────────────────────────────────────────────────
    'title'    => 'Cartes',
    'subtitle' => 'recherche · completions · guides · records personnels',

    // ──────────────────────────────────────────────────────────────────────
    // TABS
    // ──────────────────────────────────────────────────────────────────────
    'map_search'       => 'Recherche de maps',
    'completions'      => 'Completions',
    'guides'           => 'Guides',
    'personal_records' => 'Records personnels',

    // ──────────────────────────────────────────────────────────────────────
    // TOOLBAR & HELPERS
    // ──────────────────────────────────────────────────────────────────────
    'select_mode'       => 'Sélectionnez un mode de recherche',
    'add_filter_hint'   => 'Ajoutez un filtre ou cliquez sur ✔',
    'screenshot'        => 'Capture d’écran',
    'open_screenshot'   => 'Ouvrir la capture',
    'no_description'    => 'Aucune description',
    'watch'             => 'Voir',
    'na'                => 'N/A',

    // ──────────────────────────────────────────────────────────────────────
    // PLACEHOLDERS
    // ──────────────────────────────────────────────────────────────────────
    'map_name_placeholder' => 'Nom de la map',
    'map_code_placeholder' => 'Code de la map',
    'nickname_placeholder' => 'Pseudo',
    'completion'           => 'Completion',

    // ──────────────────────────────────────────────────────────────────────
    // UNOFFICIAL NOTICE
    // ──────────────────────────────────────────────────────────────────────
    'unofficial_notice' => [
        'title' => 'Recherche de code non officiel',
        'li1'   => 'Les codes non officiels ne sont jouables que sur les serveurs CN.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FILTERS TOOLBAR (UI toolbar options)
    // ──────────────────────────────────────────────────────────────────────
    'filters_toolbar' => [
        'creator'              => 'Créateur',
        'enter_creator'        => 'Entrez un créateur',
        'map_name'             => 'Nom de la map',
        'enter_map_name'       => 'Entrez le nom de la map',
        'user'                 => 'Nom du joueur',
        'enter_nickname'       => 'Entrez un nom de joueur',
        'code'                 => 'Code de la map',
        'enter_map_code'       => 'Entrez un code de map',
        'difficulty_exact'     => 'Difficulté',
        'beginner'             => 'Débutant',
        'easy'                 => 'Easy',
        'medium'               => 'Medium',
        'hard'                 => 'Hard',
        'very_hard'            => 'Very Hard',
        'extreme'              => 'Extreme',
        'hell'                 => 'Hell',
        'category'             => 'Type de map',
        'classic'              => 'Classique',
        'increasing_difficulty'=> 'Difficulté progressive',
        'tournament'           => 'Tournoi',
        'mechanics'            => 'Mechanics',
        'restrictions'         => 'Restrictions',
        'playtest_status'      => 'En playtest',
        'in_progress'          => 'En cours',
        'approved'             => 'Approuvé',
        'only_true'            => 'Vrai uniquement',
        'only_false'           => 'Faux uniquement',
        'playtest_filter'      => 'Playtest',
        'playtest_all'         => 'Tous',
        'playtest_only'        => 'Uniquement',
        'playtest_none'        => 'Aucun',
        'completion_filter'    => 'Complétée',
        'medal_filter'         => 'Médailles',
        'participation_filter' => 'Filtre de participation',
        'participated_yes'     => 'A participé',
        'participated_no'      => 'N’a pas participé',
        'official'             => 'Officiel',
        'server'               => 'Serveur',
        'global_server'        => 'Global',
        'china_server'         => 'Chine',
        'apply_filters'        => 'Appliquer les filtres',
        'clear_filters'        => 'Réinitialiser les filtres',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FILTERS (common labels used across views)
    // ──────────────────────────────────────────────────────────────────────
    'filters' => [
        'map_name'              => 'Nom de la map',
        'map_code'              => 'Code de la map',
        'difficulty'            => 'Difficulté de la map',
        'creator'               => 'Créateur de la map',
        'mechanics'             => 'Mechanics',
        'restrictions'          => 'Restrictions',
        'only_playtest'         => 'Playtest uniquement',
        'only_maps_with_medals' => 'Maps avec médailles uniquement',
        'ignore_completions'    => 'Completions uniquement',
        'player_name'           => 'Nom du joueur',
    ],

    'card' => [
        'completed'     => 'Complétée',
        'not_completed' => 'Non complétée',
        'mapped_by'     => 'Créateur(s)',
        'like'          => 'Like',
        'official'      => 'Officiel',
        'unofficial'    => 'Non-officiel',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MECHANICS
    // ──────────────────────────────────────────────────────────────────────
    'mechanics' => [
        'edge_climb'           => 'Edge Climb',
        'bhop'                 => 'Bhop',
        'crouch_edge'          => 'Crouch Edge',
        'save_climb'           => 'Save Climb',
        'bhop_first'           => 'Bhop First',
        'high_edge'            => 'High Edge',
        'distance_edge'        => 'Distance Edge',
        'quick_climb'          => 'Quick Climb',
        'slide'                => 'Slide',
        'stall'                => 'Stall',
        'dash'                 => 'Dash',
        'ultimate'             => 'Ultimate',
        'emote_save_bhop'      => 'Emote Save Bhop',
        'death_bhop'           => 'Death Bhop',
        'triple_jump'          => 'Triple Jump',
        'multi_climb'          => 'Multi Climb',
        'vertical_multi_climb' => 'Vertical Multi Climb',
        'create_bhop'          => 'Create Bhop',
        'standing_create_bhop' => 'Standing Create Bhop',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // RESTRICTIONS
    // ──────────────────────────────────────────────────────────────────────
    'restrictions' => [
        'dash_start'           => 'Dash Start',
        'triple_jump'          => 'Triple Jump',
        'emote_save_bhop'      => 'Emote Save Bhop',
        'death_bhop'           => 'Death Bhop',
        'multi_climb'          => 'Multi Climb',
        'standing_create_bhop' => 'Standing Create Bhop',
        'create_bhop'          => 'Create Bhop',
        'wall_climb'           => 'Wall Climb',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MAP TYPE
    // ──────────────────────────────────────────────────────────────────────
    'map_type' => [
        'classic'              => 'Classique',
        'increasing_difficulty'=> 'Difficulté progressive',
        'tournament'           => 'Tournoi',
        'practice'             => 'Entraînement',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MAP NAME (canonical list)
    // ──────────────────────────────────────────────────────────────────────
    'map_name' => [
        'aatlis'                        => 'Aatlis',
        'ayutthaya'                     => 'Ayutthaya',
        'black_forest'                  => 'Black Forest',
        'blizzard_world'                => 'Blizzard World',
        'busan'                         => 'Busan',
        'castillo'                      => 'Castillo',
        'chateau_guillard'             => 'Chateau Guillard',
        'circuit_royal'                => 'Circuit Royal',
        'colosseo'                     => 'Colosseo',
        'dorado'                       => 'Dorado',
        'ecopoint_antarctica'          => 'Ecopoint: Antarctica',
        'eichenwalde'                  => 'Eichenwalde',
        'esperanca'                    => 'Esperanca',
        'hanamura'                     => 'Hanamura',
        'havana'                       => 'Havana',
        'hollywood'                    => 'Hollywood',
        'horizon_lunar_colony'         => 'Horizon Lunar Colony',
        'ilios'                        => 'Ilios',
        'junkertown'                   => 'Junkertown',
        'kanezaka'                     => 'Kanezaka',
        'kings_row'                    => 'King\'s Row',
        'lijiang_tower'                => 'Lijiang Tower',
        'malevento'                    => 'Malevento',
        'midtown'                      => 'Midtown',
        'necropolis'                   => 'Necropolis',
        'nepal'                        => 'Nepal',
        'new_queen_street'             => 'New Queen Street',
        'numbani'                      => 'Numbani',
        'oasis'                        => 'Oasis',
        'paraiso'                      => 'Paraiso',
        'paris'                        => 'Paris',
        'petra'                        => 'Petra',
        'practice_range'               => 'Practice Range',
        'rialto'                       => 'Rialto',
        'route_66'                     => 'Route 66',
        'temple_of_anubis'             => 'Temple of Anubis',
        'volskaya_industries'          => 'Volskaya Industries',
        'watchpoint_gibraltar'         => 'Watchpoint: Gibraltar',
        'workshop_chamber'             => 'Workshop Chamber',
        'workshop_expanse'             => 'Workshop Expanse',
        'workshop_green_screen'        => 'Workshop Green Screen',
        'workshop_island'              => 'Workshop Island',
        'framework'                    => 'Framework',
        'tools'                        => 'Tools',
        'shambali'                     => 'Shambali',
        'chateau_guillard_halloween'   => 'Chateau Guillard (Halloween)',
        'eichenwalde_halloween'        => 'Eichenwalde (Halloween)',
        'hollywood_halloween'          => 'Hollywood (Halloween)',
        'black_forest_winter'          => 'Black Forest (Winter)',
        'blizzard_world_winter'        => 'Blizzard World (Winter)',
        'ecopoint_antarctica_winter'   => 'Ecopoint: Antarctica (Winter)',
        'hanamura_winter'              => 'Hanamura (Winter)',
        'kings_row_winter'             => 'King\'s Row (Winter)',
        'busan_lunar_new_year'         => 'Busan (Lunar New Year)',
        'lijiang_tower_lunar_new_year' => 'Lijiang Tower (Lunar New Year)',
        'antarctic_peninsula'          => 'Antarctic Peninsula',
        'suravasa'                     => 'Suravasa',
        'new_junk_city'                => 'New Junk City',
        'samoa'                        => 'Samoa',
        'hanaoka'                      => 'Hanaoka',
        'runasapi'                     => 'Runasapi',
        'throne_of_anubis'             => 'Throne of Anubis',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MAP EDIT REQUEST
    // ──────────────────────────────────────────────────────────────────────
    'map_edit_request' => [
        'title' => 'Demande de modification de map',
        'subtitle' => 'Proposer des modifications pour une map',

        'map_edit_btn' => 'Créer une demande de modification de map',
        'map_edit_btn_login' => 'Connectez-vous pour créer une demande de modification de map',

        'code' => 'Code',
        'created_by' => 'Créée par',
        'reason' => 'Raison',
        'reason_placeholder' => 'Expliquez pourquoi vous souhaitez modifier cette map…',

        'send' => 'Envoyer la demande de modification',
        'close' => 'Fermer',

        'proposed_changes' => 'Modifications proposées',
        'proposed_hint' => 'Seuls les champs modifiés seront envoyés',

        'official' => 'Officielle',
        'unofficial' => 'Non officielle',
        'visible' => 'Visible',
        'hidden' => 'Masquée',
        'active' => 'Active',
        'archived' => 'Archivée',

        'new_code' => 'Nouveau code',
        'new_code_placeholder' => 'Laissez vide pour conserver l’actuel',

        'map_name' => 'Nom de la map',
        'checkpoints' => 'Checkpoints',
        'creators' => 'Créateurs',

        'creator_search' => 'Rechercher un utilisateur…',
        'creator_hint' => 'Sélectionnez des utilisateurs à ajouter. Le premier créateur est principal.',

        'select' => 'Sélectionner…',
        'selected_count' => '{count} sélectionné(s)',

        'category' => 'Catégorie',
        'difficulty' => 'Difficulté',
        'mechanics' => 'Mécaniques',
        'restrictions' => 'Restrictions',

        'optional_title' => 'Titre',
        'custom_banner' => 'Bannière personnalisée',
        'drag_and_drop' => 'Glissez-déposez ou cliquez pour envoyer',
        'banner_hint' => 'Recommandé 16:9. JPG/PNG/WebP/AVIF, max 10 Mo.',
        'remove' => 'Retirer',

        'optional_description' => 'Description',
        'medal_gold' => 'Médaille d’or',
        'medal_silver' => 'Médaille d’argent',
        'medal_bronze' => 'Médaille de bronze',

        'uploading' => 'Envoi en cours…',
        'uploaded' => 'Envoyé',

        'login_required' => 'Vous devez être connecté pour envoyer une demande de modification de map.',
        'reason_required' => 'Veuillez indiquer une raison.',
        'sending' => 'Envoi…',
        'sent' => 'Demande de modification envoyée ✅',

        'na' => 'N/A',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // POPUP / MISC
    // ──────────────────────────────────────────────────────────────────────
    'popup' => [
        'login_required_btn'        => 'Connexion requise',
        'login_required_msg'        => 'La connexion est requise sur cette page',
        'login_required_pr'         => 'La connexion est requise pour utiliser cette fonctionnalité',
        'login_required_filter'     => 'La connexion est requise pour utiliser ce filtre',
        'login_required_progression'=> 'Veuillez vous connecter pour voir votre progression',
        'map_code_required'         => 'Entrez un code de map',
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
        'copy_map_code'             => 'Copier le code de la map',
        'map_code_copied'           => 'Code de map copié : {code}',
        'copy_failed'               => 'Échec de la copie du code de map',
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

    // ──────────────────────────────────────────────────────────────────────
    // CHARTS
    // ──────────────────────────────────────────────────────────────────────
    'chart' => [
        'mapDifficultyDistribution'  => 'Répartition des difficultés de maps',
        'amountOfMaps'               => 'Nombre de maps',
        'difficultyLevel'            => 'Niveau de difficulté',
        'popularCreators'            => 'Créateurs par qualité moyenne',
        'mapAmountLogScale'          => 'Nombre de maps (échelle log)',
        'averageQuality'             => 'Qualité moyenne',
        'topMapsFor'                 => 'Maps les plus populaires pour la difficulté {difficulty}',
        'mapCodes'                   => 'Codes de map',
        'completions'                => 'Completions',
        'rank'                       => 'Rang',
        'playersIn'                  => 'Joueurs dans {tier}',
        'map'                        => 'Maps',
        'quality'                    => 'Qualité',
        'completionsTooltip'         => '{map} : {completions} completions, Qualité : {quality}',
        'playersInTier'              => '{amount} joueurs dans {tier}',
        'tooltipLabel'               => '{creator} - Maps : {mapCount}, Qualité : {quality}',
        'tierRank'                   => 'Rang de tier',
        'skillRank'                  => 'Rang de compétence',
        'easy'                       => 'Facile',
        'medium'                     => 'Moyen',
        'hard'                       => 'Difficile',
        'very hard'                  => 'Très difficile',
        'extreme'                    => 'Extrême',
        'hell'                       => 'Infernal',
        'mapsTooltip'                => '{count} maps',
        'record_progression_time'    => 'Progression des records dans le temps',
        'user_record_progression'    => 'Votre progression',
        'average_time'               => 'Temps moyen',
        'min_time'                   => 'Temps minimum',
        'max_time'                   => 'Temps maximum',
        'amount'                     => 'Quantité',
        'quantity'                   => 'Nombre',
        'total_amount_time'          => 'Total en heures',
        'time_played_per_difficulty' => 'Temps de jeu par difficulté',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TABLE HEADERS
    // ──────────────────────────────────────────────────────────────────────
    'thead' => [
        'mapCode'              => 'Code',
        'unofficialCode'       => 'Code non-officiel',
        'officialCode'         => 'Code officiel',
        'mapName'              => 'Nom',
        'mapType'              => 'Type',
        'mapCreator'           => 'Créateur',
        'mapDifficulty'        => 'Difficulté',
        'mapCheckpoints'       => 'Checkpoints',
        'mapQuality'           => 'Qualité',
        'mapGold'              => 'Or',
        'mapSilver'            => 'Argent',
        'mapBronze'            => 'Bronze',
        'mapDetails'           => 'Détails',
        'mapView'              => 'Voir',
        'mapNickname'          => 'Pseudo',
        'mapDiscordTag'        => 'Tag Discord',
        'mapTime'              => 'Temps',
        'mapMedal'             => 'Médaille',
        'mapVideo'             => 'Vidéo',
        'mapXP'                => 'XP',
        'mapSkillRank'         => 'Rang de compétence',
        'mapWR'                => 'Records du monde',
        'mapMade'              => 'Maps créées',
        'mapPlaytestsVotes'    => 'Votes playtest',
        'mapTierRank'          => 'Tier',
        'mapRankDistribution'  => 'Répartition des rangs',
        'mapMechanics'         => 'Mechanics',
        'mapRestrictions'      => 'Restrictions',
        'mapDescription'       => 'Description',
        'mapUpvotes'           => 'Upvotes',
        'mapVerified'          => 'Vérifié',
        'mapStatus'            => 'Statut',
    ],
];
