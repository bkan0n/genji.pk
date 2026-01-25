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
    'title'    => 'Newsfeed',
    'subtitle' => 'mises à jour · records · guides · annonces',

    // ──────────────────────────────────────────────────────────────────────
    // SEARCH & RESET
    // ──────────────────────────────────────────────────────────────────────
    'search_placeholder' => 'Rechercher des posts, tags, auteurs…',
    'reset'              => 'Réinitialiser',

    // ──────────────────────────────────────────────────────────────────────
    // TABS
    // ──────────────────────────────────────────────────────────────────────
    'tabs' => [
        'newsfeed'    => 'Newsfeed',
        'completions' => 'Completions',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TAGS
    // ──────────────────────────────────────────────────────────────────────
    'tags' => [
        'all'             => 'Tous',
        'announcement'    => 'Annonce',
        'guide'           => 'Guide',
        'new_map'         => 'Nouvelle map',
        'role'            => 'Rôle',
        'record'          => 'Record',
        'map_edit'        => 'Modification de map',
        'legacy_record'   => 'Record legacy',
        'archive'         => 'Archiver',
        'unarchive'       => 'Désarchiver',
        'bulk_archive'    => 'Archivage massif',
        'bulk_unarchive'  => 'Désarchivage massif',
        'linked_map'      => 'Map liée',
        'unlinked_map'    => 'Map délier',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // SIDEBAR
    // ──────────────────────────────────────────────────────────────────────
    'sidebar' => [
        'community_picks' => 'Sélection de la communauté',
        'see_all'         => 'Tout voir →',
        'changelogs'      => 'Changelogs',
        'submit_title'    => 'Soumettre votre map',
        'submit_desc'     => 'Partagez votre création et recevez des retours de la communauté.',
        'submit_cta'      => 'Soumettre',
        'upvotes'         => 'Upvotes',
        'details'         => 'Détails',
        'copy_code'       => 'Copier le code',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // EMPTY STATE
    // ──────────────────────────────────────────────────────────────────────
    'empty' => [
        'title'    => 'Aucun post ne correspond à vos filtres',
        'subtitle' => 'Essayez de changer le tag ou les termes de recherche.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // ACTIONS
    // ──────────────────────────────────────────────────────────────────────
    'load_more' => 'Voir plus',

    // ──────────────────────────────────────────────────────────────────────
    // TABLE HEADERS (shared)
    // ──────────────────────────────────────────────────────────────────────
    'thead' => [
        'mapCheckpoints' => 'Checkpoints',
        'mapQuality'     => 'Qualité',
        'mapDetails'     => 'Détails',
        'mapMechanics'   => 'Mécaniques',
        'mapRestrictions'=> 'Restrictions',
        'mapDescription' => 'Description',
        'mapCategory'    => 'Catégorie',
        'mapCreators'    => 'Créateurs',
        'mapMedals'      => 'Médailles',
        'mapTags'        => 'Tags',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // COMMON
    // ──────────────────────────────────────────────────────────────────────
    'common' => [
        'na'                => 'N/A',
        'no_description'    => 'Aucune description disponible',
        'error'             => 'Erreur',
        'loading'           => 'Chargement…',
        'to_see_details'    => 'pour voir les détails !',
        'timestamp_format'  => '{day} {month} {year} à {hour}:{minute} {AMorPM}',
        'reason'            => 'Raison',
        'not_found'         => 'Introuvable',
        'video_embed_failed'=> 'La vidéo ne peut pas être intégrée.',
        'bot'               => 'BOT',
        'upvote'            => 'Upvote',
        'missing_ids'       => 'ID utilisateur ou message manquant',
        'empty'             => 'Vide',
        'created_at'        => 'Créé le',
        'updated_at'        => 'Mis à jour le',
        'medals' => [
            'gold'   => 'Or',
            'silver' => 'Argent',
            'bronze' => 'Bronze',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PAGINATION
    // ──────────────────────────────────────────────────────────────────────
    'pagination' => [
        'first'   => '« Premier',
        'prev'    => '‹ Préc.',
        'next'    => 'Suivant ›',
        'last'    => 'Dernier »',
        'page_of' => 'Page {current} sur {total}',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MECHANICS
    // ──────────────────────────────────────────────────────────────────────
    'mechanics' => [
        'edge_climb'            => 'Edge Climb',
        'bhop'                  => 'Bhop',
        'crouch_edge'           => 'Crouch Edge',
        'save_climb'            => 'Save Climb',
        'bhop_first'            => 'Bhop First',
        'high_edge'             => 'High Edge',
        'distance_edge'         => 'Distance Edge',
        'quick_climb'           => 'Quick Climb',
        'slide'                 => 'Slide',
        'stall'                 => 'Stall',
        'dash'                  => 'Dash',
        'ultimate'              => 'Ultime',
        'emote_save_bhop'       => 'Emote Save Bhop',
        'death_bhop'            => 'Death Bhop',
        'triple_jump'           => 'Triple Jump',
        'multi_climb'           => 'Multi Climb',
        'vertical_multi_climb'  => 'Vertical Multi Climb',
        'create_bhop'           => 'Create Bhop',
        'standing_create_bhop'  => 'Standing Create Bhop',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // RESTRICTIONS
    // ──────────────────────────────────────────────────────────────────────
    'restrictions' => [
        'dash_start'            => 'Dash Start',
        'triple_jump'           => 'Triple Jump',
        'emote_save_bhop'       => 'Emote Save Bhop',
        'death_bhop'            => 'Death Bhop',
        'multi_climb'           => 'Multi Climb',
        'standing_create_bhop'  => 'Standing Create Bhop',
        'create_bhop'           => 'Create Bhop',
        'wall_climb'            => 'Wall Climb',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // NEWSFEED MESSAGES
    // ──────────────────────────────────────────────────────────────────────
    'newsfeed' => [
        'new_wr'               => '{nickname} a établi un nouveau record du monde !',
        'new_wr_info'          => '{map_name} par {creators} ({map_code})',
        'promoted'             => '{nickname} a été promu !',
        'new_map'              => '{nickname} a soumis une nouvelle map {difficulty} sur {map_name} !',
        'has_posted_guide'     => '{nickname} a publié un guide pour {map_code}',
        'watch_guide'          => 'Voir le guide',
        'changed_code'         => '{map_code} a été modifié :',
        'details_command'      => 'Utilisez la commande',
        'click_here'           => 'Cliquez ici',
        'link'                 => 'Lien',
        'copy_code'            => 'Code de map copié : {code}',
        'copy_clipboard'       => 'Commande copiée dans le presse-papiers',
        'copy_clipboard_error' => 'Échec de la copie de la commande',
        'announcement'         => 'Nouvelle annonce',
        'search_by_filter'     => 'Rechercher par',
        'map_edit_filter'      => 'Modification de map',
        'guide_filter'         => 'Guide',
        'new_map_filter'       => 'Nouvelle map',
        'role_filter'          => 'Rôle',
        'record_filter'        => 'Record',
        'reset_filter'         => 'Réinitialiser le filtre',
        'translate_button'     => 'Traduire',
        'archived_map'         => '{map_code} a été archivé',
        'unarchived_map'       => '{map_code} a été désarchivé',
        'archived_description' => 'Cette map n’apparaîtra plus dans la recherche sauf via un code. Les records ne peuvent plus être soumis pour les maps archivées.',
        'unarchived_description'=> 'Cette map est visible dans la recherche et éligible aux records.',
        'creator'              => 'Créateur',
        'map_code'             => 'Code de la map',
        'difficulty'           => 'Difficulté',
        'bulk_archived'        => 'Plusieurs maps ont été archivées',
        'bulk_unarchived'      => 'Plusieurs maps ont été désarchivées',
        'official'             => 'Officiel',
        'details'              => 'Détails',
        'changes'              => 'Changements',
        'map_name'             => 'Nom de la map',
        'status_unarchived'    => 'Désarchivée',
        'status_archived'      => 'Archivée',
        'guide_badge'          => 'Guide',
        'converted_to_legacy'  => 'Convertie en legacy',
        'legacy'               => 'Legacy',
        'affected'             => 'Affecté',
        'reason'               => 'Raison',

        'no_changes'           => 'Aucun changement.',
        'map_updated'          => '{map_code} a été mise à jour',
        'record_label'         => 'Record',
        'video_label'          => 'Vidéo',
        'translation_failed'   => 'La traduction a échoué.',
        'translation_error'    => 'Une erreur est survenue lors de la traduction.',
        'linked_map_title'     => 'Codes de map liés',
        'playtest_id'          => 'Playtest ID : :id',
        'official_code'        => 'Code officiel',
        'unofficial_code'      => 'Code non officiel',
        'linked_map_hint'      => 'Ces deux codes de map sont maintenant liés.',
        'unlinked_map_title'   => 'Codes de map déliés',
        'unlinked_map_hint'    => 'Ces deux codes de map ne sont plus liés.',
        'unlinked_map_partial' => 'Un des codes est manquant.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // COMPLETIONS
    // ──────────────────────────────────────────────────────────────────────
    'completions' => [
        'new_submission_from' => 'Nouvelle soumission de {nickname}',
        'watch'               => 'Voir',
        'open_screenshot'     => 'Ouvrir la capture',
        'screenshot_alt'      => 'Capture',
        'upvote_failed'       => 'Échec de l’upvote',

        'kv' => [
            'code'       => 'Code',
            'map'        => 'Map',
            'difficulty' => 'Difficulté',
            'time'       => 'Temps',
            'aka'        => 'Aussi connu sous',
        ],

        'status' => [
            'verified_screenshot'       => 'Capture vérifiée ! Une réussite confirmée sans preuve vidéo.',
            'verified_completion_video' => 'Completion vérifiée avec preuve vidéo.',
            'pending_review'            => 'Soumission en attente de revue.',
            'verified_record'           => 'Record / temps vérifié.',
            'under_review'              => 'Soumission en cours de revue.',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // CHANGELOGS
    // ──────────────────────────────────────────────────────────────────────
    'changelogs' => [
        'title'        => 'Changelogs',
        'latest'       => 'Derniers',
        'view_on_github'=> 'Voir sur GitHub',
        'none'         => 'Aucun changelog disponible.',
        'fetch_failed' => 'Échec du chargement des changelogs.',
        'release'      => 'Release',
    ],
];
