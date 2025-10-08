<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Newsfeed (FR)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // HEADER
    // ──────────────────────────────────────────────────────────────────────
    'title' => 'Fil d’actualités',
    'subtitle' => 'mises à jour · records · guides · annonces',

    // ──────────────────────────────────────────────────────────────────────
    // SEARCH & RESET
    // ──────────────────────────────────────────────────────────────────────
    'search_placeholder' => 'Rechercher des posts, tags, auteurs…',
    'reset' => 'Réinitialiser',

    // ──────────────────────────────────────────────────────────────────────
    // TABS
    // ──────────────────────────────────────────────────────────────────────
    'tabs' => [
        'newsfeed' => 'Fil',
        'completions' => 'Completions',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TAGS
    // ──────────────────────────────────────────────────────────────────────
    'tags' => [
        'all' => 'Tous',
        'announcement' => 'Annonce',
        'guide' => 'Guide',
        'new_map' => 'Nouvelle carte',
        'role' => 'Rôle',
        'record' => 'Record',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // SIDEBAR
    // ──────────────────────────────────────────────────────────────────────
    'sidebar' => [
        'community_picks' => 'Coups de cœur de la communauté',
        'see_all' => 'Tout voir →',
        'changelogs' => 'Changelogs',
        'submit_title' => 'Soumettez votre carte',
        'submit_desc' => 'Partagez votre création et obtenez des retours de la communauté.',
        'submit_cta' => 'Soumettre',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // EMPTY STATE
    // ──────────────────────────────────────────────────────────────────────
    'empty' => [
        'title' => 'Aucune publication ne correspond à vos filtres',
        'subtitle' => 'Essayez de changer le tag ou les termes de recherche.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // ACTIONS
    // ──────────────────────────────────────────────────────────────────────
    'load_more' => 'Charger plus',

    // ──────────────────────────────────────────────────────────────────────
    // TABLE HEADERS (shared)
    // ──────────────────────────────────────────────────────────────────────
    'thead' => [
        'mapCheckpoints' => 'Points de contrôle',
        'mapQuality' => 'Qualité',
        'mapDetails' => 'Détails',
        'mapMechanics' => 'Mécaniques',
        'mapRestrictions' => 'Restrictions',
        'mapDescription' => 'Description',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // COMMON
    // ──────────────────────────────────────────────────────────────────────
    'common' => [
        'na' => 'N/A',
        'no_description' => 'Aucune description disponible',
        'error' => 'Erreur',
        'loading' => 'Chargement...',
        'to_see_details' => 'pour voir les détails !',
        'timestamp_format' => '{month} {day}, {year} at {hour}:{minute} {AMorPM}',
        'reason' => 'Raison',
        'not_found' => 'Introuvable',
        'video_embed_failed' => 'La vidéo ne peut pas être intégrée.',
        'bot' => 'BOT',
        'upvote' => 'Vote positif',
        'missing_ids' => 'ID utilisateur ou message manquant',
        'empty' => 'Vide',
        'medals' => [
            'gold' => 'Or',
            'silver' => 'Argent',
            'bronze' => 'Bronze',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PAGINATION
    // ──────────────────────────────────────────────────────────────────────
    'pagination' => [
        'first' => '« Premier',
        'prev' => '‹ Précédent',
        'next' => 'Suivant ›',
        'last' => 'Dernier »',
        'page_of' => 'Page {current} sur {total}',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MECHANICS
    // ──────────────────────────────────────────────────────────────────────
    'mechanics' => [
        'edge_climb' => 'Edge Climb',
        'bhop' => 'Bhop',
        'crouch_edge' => 'Crouch Edge',
        'save_climb' => 'Save Climb',
        'bhop_first' => 'Bhop First',
        'high_edge' => 'High Edge',
        'distance_edge' => 'Distance Edge',
        'quick_climb' => 'Quick Climb',
        'slide' => 'Slide',
        'stall' => 'Stall',
        'dash' => 'Dash',
        'ultimate' => 'Ultimate',
        'emote_save_bhop' => 'Emote Save Bhop',
        'death_bhop' => 'Death Bhop',
        'triple_jump' => 'Triple Jump',
        'multi_climb' => 'Multi Climb',
        'vertical_multi_climb' => 'Vertical Multi Climb',
        'create_bhop' => 'Create Bhop',
        'standing_create_bhop' => 'Standing Create Bhop',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // RESTRICTIONS
    // ──────────────────────────────────────────────────────────────────────
    'restrictions' => [
        'dash_start' => 'Dash Start',
        'triple_jump' => 'Triple Jump',
        'emote_save_bhop' => 'Emote Save Bhop',
        'death_bhop' => 'Death Bhop',
        'multi_climb' => 'Multi Climb',
        'standing_create_bhop' => 'Standing Create Bhop',
        'create_bhop' => 'Create Bhop',
        'wall_climb' => 'Wall Climb',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // NEWSFEED MESSAGES
    // ──────────────────────────────────────────────────────────────────────
    'newsfeed' => [
        'new_wr' => '{nickname} a établi un nouveau record du monde !',
        'new_wr_info' => '{map_name} par {creators} ({map_code})',
        'promoted' => '{nickname} a été promu !',
        'new_map' => '{nickname} a soumis une nouvelle carte {difficulty} sur {map_name} !',
        'has_posted_guide' => '{nickname} a publié un guide pour {map_code}',
        'watch_guide' => 'Voir le guide',
        'changed_code' => '{map_code} a été modifié :',
        'details_command' => 'Utilisez la commande',
        'click_here' => 'Cliquez ici',
        'link' => 'Lien',
        'copy_clipboard' => 'La commande a été copiée dans le presse-papiers',
        'copy_clipboard_error' => 'Échec de la copie de la commande',
        'announcement' => 'Nouvelle annonce',
        'search_by_filter' => 'Rechercher par',
        'map_edit_filter' => 'Édition de carte',
        'guide_filter' => 'Guide',
        'new_map_filter' => 'Nouvelle carte',
        'role_filter' => 'Rôle',
        'record_filter' => 'Record',
        'reset_filter' => 'Réinitialiser le filtre',
        'translate_button' => 'Traduire',
        'archived_map' => '{map_code} a été archivée',
        'archived_description' => 'Cette carte n’apparaîtra pas dans la recherche sauf par code. Vous ne pouvez pas soumettre de records pour les cartes archivées.',
        'creator' => 'Créateur',
        'map_code' => 'Code de la carte',
        'difficulty' => 'Difficulté',
        'bulk_archived' => 'Plusieurs cartes ont été archivées',
        'bulk_unarchived' => 'Plusieurs cartes ont été désarchivées',

        'no_changes' => 'Aucun changement.',
        'map_updated' => '{map_code} a été mise à jour',
        'record_label' => 'Record',
        'video_label' => 'Vidéo',
        'translation_failed' => 'Échec de la traduction.',
        'translation_error' => 'Une erreur est survenue pendant la traduction.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // COMPLETIONS
    // ──────────────────────────────────────────────────────────────────────
    'completions' => [
        'new_submission_from' => 'Nouvelle soumission de {nickname}',
        'watch' => 'Regarder',
        'open_screenshot' => 'Ouvrir la capture d’écran',
        'screenshot_alt' => 'Capture d’écran',
        'upvote_failed' => 'Échec du vote positif',

        'kv' => [
            'code' => 'Code',
            'map' => 'Carte',
            'difficulty' => 'Difficulté',
            'time' => 'Temps',
            'aka' => 'Alias',
        ],

        'status' => [
            'verified_screenshot' => 'Capture d’écran vérifiée ! Une réussite a été confirmée sans preuve vidéo.',
            'verified_completion_video' => 'Achèvement vérifié avec preuve vidéo.',
            'pending_review' => 'Soumission en attente de vérification.',
            'verified_record' => 'Record / temps vérifié.',
            'under_review' => 'Soumission en cours d’examen.',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // CHANGELOGS
    // ──────────────────────────────────────────────────────────────────────
    'changelogs' => [
        'title' => 'Changelogs',
        'latest' => 'Dernières',
        'view_on_github' => 'Voir sur GitHub',
        'none' => 'Aucun changelog disponible.',
        'fetch_failed' => 'Échec du chargement des changelogs.',
        'release' => 'Version',
    ],
];
