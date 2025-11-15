<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Infos (FR)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // META (PAGE <HEAD>)
    // ──────────────────────────────────────────────────────────────────────
    'meta' => [
        'title' => 'Genji Parkour - Infos & Règles',
        'og' => [
            'title'       => 'Genji Parkour · Infos & Règles',
            'description' => 'Découvrez comment fonctionnent les promotions de rang, les médailles, le playtest, les soumissions de cartes et les niveaux de difficulté dans Genji Parkour.',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // HERO
    // ──────────────────────────────────────────────────────────────────────
    'hero' => [
        'badge'    => 'Règles · Rangs · Aide',
        'title'    => 'Informations & règles',
        'subtitle' => 'monter en rang · playtesting · soumettre cartes & records · techniques',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TABS
    // ──────────────────────────────────────────────────────────────────────
    'tabs' => [
        'ranking_process'  => 'Processus de classement',
        'ranks_threshold'  => 'Seuils de rangs',
        'playtesting'      => 'Playtesting',
        'submit_map'       => 'Soumission de cartes',
        'techs'            => 'Techniques & difficultés',
    ],


    /*
    |--------------------------------------------------------------------------
    | HELP MODAL TRANSLATIONS (infos.help_modal.*)
    |--------------------------------------------------------------------------
    */
    'help_modal' => [

        // ──────────────────────────────────────────────────────────────────────
        // Common
        // ──────────────────────────────────────────────────────────────────────
        'common' => [
            'soon' => 'Bientôt disponible.',
        ],

        // ──────────────────────────────────────────────────────────────────────
        // Rank Promotion
        // ──────────────────────────────────────────────────────────────────────
        'rank_promotion' => [

            // ──────────────────────────────────────────────────────────────
            // HOW TO SUBMIT (RANK PROMOTION COMPLETION)
            // ──────────────────────────────────────────────────────────────
            'how_to_submit' => [
                'title' => 'Comment monter en rang',
                'intro' => 'Pour monter en rang, vous devez soumettre des complétions (records) sur des cartes valides et fournir une note de qualité.',

                'requirements' => [
                    'title'         => 'Conditions',
                    'map_in_pool'   => 'Compléter une carte Genji Parkour présente dans le pool actuel.',
                    'map_code_note' => 'Note : Les cartes non acceptées n’apparaîtront pas dans le champ du code.',
                ],

                'steps' => [
                    'title'             => 'Étapes',
                    'open_tab'          => 'Ouvrez l’onglet « Soumettre une complétion ».',
                    'enter_code'        => 'Entrez le code de la carte et votre temps.',
                    'upload_screenshot' => 'Téléversez une capture d’écran (obligatoire) et éventuellement une vidéo.',
                    'select_quality'    => 'Sélectionnez une note de qualité (1–6).',
                    'submit'            => 'Cliquez sur « Soumettre le record ».',
                    'verification'      => 'Votre soumission passera par un processus de vérification.',
                    'notification'      => 'Une fois vérifiée, vous recevrez une notification.',
                ],

                'quality' => [
                    'title' => 'Échelle de qualité',
                    'six'   => '6 : Excellent',
                    'five'  => '5 : Très bon',
                    'four'  => '4 : Bon',
                    'three' => '3 : Moyen',
                    'two'   => '2 : Faible',
                    'one'   => '1 : Mauvais',
                ],
            ],

            // ──────────────────────────────────────────────────────────────
            // SUBMISSION RULES (FOR RANK PROMOTION / RECORDS)
            // ──────────────────────────────────────────────────────────────
            'submission_rules' => [
                'title' => 'Règles de soumission de rang',

                'completion' => [
                    'title'             => 'Conditions / directives de complétion',
                    'li_code_match'     => 'Le code sur la capture doit correspondre au code indiqué sur le site/bot.',
                    'li_time_display'   => 'Le temps doit être affiché soit dans le Top 5 soit dans l’annonce centrale. Pour une vidéo, les deux doivent apparaître.',
                    'li_no_edit_map'    => 'Aucune modification de la carte n’est autorisée via les paramètres du mode personnalisé ou du Workshop.',
                    'li_no_scripts'     => 'Les scripts, macros ou outils similaires sont interdits.',
                    'li_no_banned_tech' => 'Vous ne pouvez pas utiliser une technique bannie même si le ban est buggué dans le Workshop.',
                ],

                'records' => [
                    'title'                         => 'Records vidéo',
                    'li_time_visible'               => 'Le temps doit être visible de 0.00 jusqu’à la fin.',
                    'li_video_required'             => 'Une vidéo est obligatoire pour les World Records et les médailles.',
                    'li_no_cuts'                    => 'Aucune coupure dans la vidéo entre 0.00 et la fin.',
                    'li_sound_not_required'         => 'Le son n’est pas obligatoire.',
                    'li_editing_ok_but_no_interfere'=> 'Le montage est autorisé avant/après mais ne doit pas gêner la validation.',
                ],

                'reserve_rights' => 'Les Senseis se réservent le droit de refuser toute soumission pour n’importe quelle raison.',
            ],

            // ──────────────────────────────────────────────────────────────
            // RANK INFO & THRESHOLDS
            // ──────────────────────────────────────────────────────────────
            'rank_info_thresholds' => [
                'info' => [
                    'title'       => 'Infos sur les rangs',
                    'subtitle'    => 'Relation entre rangs, difficultés et nombre de cartes requises.',
                    'li_no_order' => 'Les rangs n’ont pas besoin d’être obtenus dans un ordre particulier.',
                    'li_requirement' => 'Pour obtenir un rang, vous devez compléter le nombre requis de cartes de la difficulté correspondante.',
                    'li_thresholds'  => 'Voir le tableau des seuils ci-dessous.',
                ],

                'table' => [
                    'title'             => 'Tableau Rang & Difficulté',
                    'completions_label' => 'complétions',
                    'na'                => 'N/A',
                ],

                'rows' => [
                    'ninja' => [
                        'name'  => 'Ninja',
                        'image' => '/assets/ranks/ninja.webp',
                    ],
                    'jumper' => [
                        'name'  => 'Jumper',
                        'image' => '/assets/ranks/jumper.webp',
                    ],
                    'skilled' => [
                        'name'  => 'Skilled',
                        'image' => '/assets/ranks/skilled.webp',
                    ],
                    'pro' => [
                        'name'  => 'Pro',
                        'image' => '/assets/ranks/pro.webp',
                    ],
                    'master' => [
                        'name'  => 'Master',
                        'image' => '/assets/ranks/master.webp',
                    ],
                    'grand_master' => [
                        'name'  => 'Grand Master',
                        'image' => '/assets/ranks/grandmaster.webp',
                    ],
                    'god' => [
                        'name'  => 'God',
                        'image' => '/assets/ranks/god.webp',
                    ],
                ],
            ],

            // ──────────────────────────────────────────────────────────────
            // MEDALS INFO & THRESHOLDS
            // ──────────────────────────────────────────────────────────────
            'medals_info_thresholds' => [
                'info' => [
                    'title'                     => 'Infos Médailles',
                    'subtitle'                  => 'Comment obtenir les rangs +, ++ et +++ grâce aux médailles.',
                    'li_plus_explain'           => 'Pour obtenir un +, ++ ou +++, vous devez obtenir autant de Bronze, Silver, ou Gold que requis par le rang (voir tableau).',
                    'li_time_and_video_required'=> 'Une vidéo avec un temps visible est obligatoire.',
                    'li_icon_next_to_name'      => 'Une icône (+, ++, +++) apparaît à côté de votre nom.',
                    'li_auto_receive'           => 'Une fois vérifiée, la médaille est attribuée automatiquement.',
                    'li_retroactive_credit'     => 'Si des médailles sont ajoutées après votre soumission, vous recevrez quand même le crédit.',
                ],

                'table' => [
                    'title'             => 'Seuils de médailles par difficulté',
                    'completions_label' => 'médailles',
                    'na'                => 'N/A',
                    'medal_gold'        => 'Or',
                    'medal_silver'      => 'Argent',
                    'medal_bronze'      => 'Bronze',
                ],

                'images' => [
                    'gold'   => '/assets/medals/gold.png',
                    'silver' => '/assets/medals/silver.png',
                    'bronze' => '/assets/medals/bronze.png',
                ],
            ],
        ],

        // ──────────────────────────────────────────────────────────────────────
        // Map Submission (Submit Map page)
        // ──────────────────────────────────────────────────────────────────────
        'playtesting_info' => [
            'title'    => 'Playtesting',
            'subtitle' => 'Comment les cartes sont testées, votées et acceptées dans le pool.',

            'must_submit_completion' => 'Vous devez avoir soumis une complétion pour pouvoir voter !',

            'rules' => [
                'title'                      => 'Règles du playtest',
                'needs_votes_and_completions'=> 'Chaque difficulté requiert un nombre spécifique de votes et de complétions.',
                'creator_cannot_vote'        => 'Les créateurs ne peuvent pas voter pour leur propre carte.',
                'playtesters_give_tips'      => 'Les testeurs donnent des conseils pour améliorer la carte ou signaler des problèmes importants.',
            ],

            'votes' => [
                'title' => 'Votes requis',

                'beginner_to_hard' => 'Beginner → Hard',
                'very_hard'        => 'Very Hard',
                'extreme'          => 'Extreme',
                'hell'             => 'Hell',

                'votes' => 'votes',
                'vote'  => 'vote',

                'counts' => [
                    'beginner_to_hard' => '5 votes',
                    'very_hard'        => '3 votes',
                    'extreme'          => '2 votes',
                    'hell'             => '1 vote',
                ],
            ],

            'process' => [
                'title'       => 'Processus',
                'creation'    => 'Phase de création',
                'testing'     => 'Phase de test',
                'verification'=> 'Phase de vérification',
                'acceptance'  => 'Acceptation',

                'steps' => [
                    'map_is_made'                        => 'La carte est créée',
                    'map_submission_form'                => 'Formulaire de soumission',
                    'creator_suggests_difficulty'        => 'Le créateur propose une difficulté',
                    'testers_submit_completion'          => 'Les testeurs soumettent une complétion',
                    'testers_vote_on_difficulty'         => 'Les testeurs votent sur la difficulté',
                    'creator_finalizes_submission'       => 'Le créateur finalise la soumission',
                    'sensei_receive_submission_notification' => 'Les Senseis reçoivent une notification',
                    'accept'                             => 'accepter',
                    'reject'                             => 'rejeter',
                    'map_sent_back_previous_step'        => 'La carte est renvoyée à une étape précédente*',
                    'map_accepted'                       => 'Carte acceptée',
                    'map_added_to_pool'                  => 'Carte ajoutée au pool',
                    'testers_granted_completion_without_time' => 'Les testeurs reçoivent une complétion (sans temps)',
                ],

                'notes' => [
                    'change_only_by_sensei' => 'Seuls les Senseis peuvent modifier les détails de la carte.',
                    'verification_removal'  => '* Les complétions et votes peuvent être supprimés à cette étape.',
                    'sensei_power'          => 'Un Sensei peut forcer ou annuler n’importe quelle étape.',
                ],
            ],
        ],

        // ──────────────────────────────────────────────────────────────────────
        // Map Submission (Submit Map page)
        // ──────────────────────────────────────────────────────────────────────
        'how_to_submit' => [
            'title'    => 'Comment soumettre une carte',
            'subtitle' => 'Explication détaillée de chaque champ dans « Soumettre une carte ».',
            'intro'    => 'Cette fenêtre vous guide étape par étape dans la soumission d’une carte.',

            'meta' => [
                'title'          => '1) Métadonnées (carte & créateurs)',
                'li_creator'     => 'Créateur principal : pré-rempli selon votre session.',
                'li_code'        => 'Code : cliquez sur « Modifier ». Le code doit être unique.',
                'li_name'        => 'Nom : cliquez sur « Modifier » et utilisez l’autocomplétion.',
                'li_checkpoints' => 'Checkpoints : cliquez sur « Modifier » et entrez un nombre positif.',
            ],

            'required' => [
                'title' => '2) Champs obligatoires',
                'p1'    => 'Ces champs doivent être remplis :',
                'li_difficulty'   => 'Difficulté : choisir une valeur (Easy → Hell).',
                'li_category'     => 'Type de carte : choisir un type.',
                'li_mechanics'    => 'Mécaniques : au moins une.',
                'li_restrictions' => 'Restrictions : au moins une.',
            ],

            'medals' => [
                'title'     => '3) Médailles (optionnelles mais validées si présentes)',
                'p1'        => 'Vous pouvez définir des temps pour Or, Argent et Bronze.',
                'li_rules'  => 'Si une médaille est définie, les trois doivent l’être.',
                'li_pattern'=> 'Format : 1–5 chiffres, optionnellement “.” et 1–2 décimales.',
                'li_order'  => 'Ordre requis : Bronze > Silver > Gold.',
            ],

            'optional' => [
                'title'         => '4) Optionnel',
                'li_title'      => 'Titre court (max 128 caractères).',
                'li_banner'     => 'Bannière personnalisée.',
                'li_description'=> 'Description libre.',
                'li_guide'      => 'Guides : une URL par ligne.',
            ],

            'submit' => [
                'title'          => '5) Soumettre',
                'li_validation'  => 'Le formulaire valide tous les champs obligatoires.',
                'li_confirmation'=> 'Un message de confirmation apparaît si tout est correct.',
            ],

            'tips' => [
                'title'    => 'Astuces',
                'li_edit'  => 'Les champs « Modifier » peuvent être mis à jour rapidement.',
                'li_guest' => 'Si vous n’êtes pas connecté, la soumission est verrouillée.',
                'li_support' => 'En cas d’erreur, réessayez (≤ 8MB) ou contactez le support.',
            ],
        ],

        // ──────────────────────────────────────────────────────────────────────
        // Difficulty & Techs Info
        // ──────────────────────────────────────────────────────────────────────
        'difficulty_techs_info' => [
            'legend_title' => 'Légende',
            'matrix_title' => 'Techniques par difficulté',
            'subtitle'     => 'Aperçu de la fréquence des techniques selon la difficulté.',

            'labels' => [
                'beginner'  => 'Débutant',
                'easy'      => 'Facile',
                'medium'    => 'Moyen',
                'hard'      => 'Difficile',
                'very_hard' => 'Très difficile',
                'extreme'   => 'Extrême',
                'hell'      => 'Enfer',
            ],

            'techs' => [
                'basics'        => 'Bases*',
                'bhop'          => 'Bhop**',
                'edge_climb'    => 'Edge Climb',
                'stall'         => 'Stall',
                'crouch_edge'   => 'Crouch Edge',
                'save_climb'    => 'Save Climb',
                'distance_edge' => 'Distance Edge',
                'high_edge'     => 'High Edge',
                'multi_climb'   => 'Multi Climb',
                'create_bhop'   => 'Create Bhop',
            ],

            'legend' => [
                'lv1_title' => 'Simple / utilisation prioritaire',
                'lv1_desc'  => 'Utilisation simple et fréquente.',
                'lv2_title' => 'Courant / parfois avancé',
                'lv2_desc'  => 'Utilisé fréquemment, parfois sous forme avancée.',
                'lv3_title' => 'Avancé / exigeant',
                'lv3_desc'  => 'Utilisation complexe et difficile.',
            ],

            'notes' => [
                'star'        => 'Double saut / Slide / Wall climb',
                'double_star' => 'Late Bhop / First Bhop / Emote save / Deathbhop',
            ],
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // Filters
    // ──────────────────────────────────────────────────────────────────────
    'filters' => [
        'beginner'  => 'Débutant',
        'easy'      => 'Facile',
        'medium'    => 'Moyen',
        'hard'      => 'Difficile',
        'very_hard' => 'Très difficile',
        'extreme'   => 'Extrême',
        'hell'      => 'Enfer',
    ],
];
