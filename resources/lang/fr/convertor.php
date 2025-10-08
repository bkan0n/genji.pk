<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Convertor (FR)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // HERO / BADGES / TIPS
    // ──────────────────────────────────────────────────────────────────────
    'badge_tools' => 'Éditeur & outils',
    'hero_title_top' => 'OverPy → Workshop',
    'hero_title_bottom' => 'Convertisseur',
    'hero_sub' => 'Collez votre pasta OverPy, convertissez en code Workshop, traduisez les libellés et éditez les données de la carte avant l’export.',
    'tips_title' => 'Conseils',
    'tips_1' => 'Utilisez « Convert » pour pasta → Workshop.',
    'tips_2' => 'Utilisez « Translate » pour changer la langue.',
    'tips_3' => 'Ouvrez les paramètres de la carte pour ajuster les données.',

    // ──────────────────────────────────────────────────────────────────────
    // TABS / ACTIONS
    // ──────────────────────────────────────────────────────────────────────
    'convert_map' => 'Convertir la carte',
    'help' => 'Aide ?',
    'edit_map_data' => 'Modifier les données de la carte',
    'copy_to_clipboard' => 'Copier la carte dans le presse-papiers',
    'map_placeholder' => 'pasta de carte ici',

    // ──────────────────────────────────────────────────────────────────────
    // DESCRIPTIONS
    // ──────────────────────────────────────────────────────────────────────
    'description_line_1' => 'Fonction expérimentale qui tente de charger les données de carte à partir de la pasta.',
    'description_line_2' => 'Copiez toute la pasta du mode dans le champ de texte, sélectionnez la langue de votre client et appuyez sur Convert.',
    'description_line_3' => 'Ne prend en charge que les données collées depuis Overwatch. Si vous copiez directement depuis l’interface web, cela peut ne pas fonctionner.',
    'description_line_4' => 'Tout ne sera peut-être pas importé : vérifiez votre carte pour corriger d’éventuelles erreurs de conversion.',

    // ──────────────────────────────────────────────────────────────────────
    // CAPABILITIES
    // ──────────────────────────────────────────────────────────────────────
    'yes' => 'Oui',
    'yes_1' => 'Positions des checkpoints',
    'yes_2' => 'Téléportations',
    'yes_3' => 'Orbes de rebond / kill (par CP)',
    'yes_4' => 'Plugin d’ultime et de dash',
    'yes_5' => 'Équipes dans certains modes et effectifs',
    'yes_6' => 'Bannissements Workshop et par CP',

    'maybe' => 'Peut-être',
    'maybe_1' => 'Règles d’addons',
    'maybe_2' => 'CP aériens (se chargent, ne fonctionnent pas)',

    'no' => 'Non',
    'no_1' => 'Orbes / kills globaux à toute la carte',
    'no_2' => 'Code ajouté manuellement',
    'no_3' => 'ifs, returns ou aborts dans les données de règle',
    'no_4' => 'tout le reste',

    // ──────────────────────────────────────────────────────────────────────
    // CONTROLS
    // ──────────────────────────────────────────────────────────────────────
    'pasta_language'  => 'Langue de la pasta',
    'target_language' => 'Langue cible',
    'convert_data'    => 'Convertir les données',
    'translate_data'  => 'Traduire les données',
    'diffchecker'     => 'Diffchecker',
    'global_settings' => 'Paramètres globaux',
    'edit_mode'       => 'Mode édition',

    // ──────────────────────────────────────────────────────────────────────
    // FOOTER INFO
    // ──────────────────────────────────────────────────────────────────────
    'footer_made_by' => 'Créé par FishoFire / Refondu par Arrow',
    'footer_version' => 'Version 1.10.4D',

    // ──────────────────────────────────────────────────────────────────────
    // HELP STEPS
    // ──────────────────────────────────────────────────────────────────────
    'step1'                     => 'Étape 1',
    'step1_text'                => 'Copiez les paramètres depuis Overwatch. Ouvrez l’éditeur Workshop sur le code 54CRY et configurez votre carte. Vous pouvez aussi copier les paramètres de n’importe quelle carte.',
    'step2'                     => 'Étape 2',
    'step2_text'                => 'Collez les paramètres dans la zone de texte ci-dessous.',
    'step3'                     => 'Étape 3',
    'step3_text'                => 'Assurez-vous que « Pasta Language » dans le sélecteur correspond à la langue de votre client Overwatch. Puis choisissez :',
    'step3_convert'             => 'Convert Data pour mettre à jour vers la dernière version du framework',
    'step3_translate'           => 'Translate Data pour mettre à jour ET traduire votre pasta',
    'step4'                     => 'Étape 4',
    'step4_text'                => 'Éditez les données de la carte si nécessaire.',
    'step5'                     => 'Étape 5',
    'step5_text'                => 'Collez de nouveau dans le Workshop.',
    'please_use_converter'      => 'Veuillez d’abord utiliser le convertisseur',

    // ──────────────────────────────────────────────────────────────────────
    // MAP DATA EDITOR
    // ──────────────────────────────────────────────────────────────────────
    'map_data' => [
        'pasta_language'  => 'Langue de la pasta',
        'target_language' => 'Langue cible',
        'convert_data'    => 'Convertir les données',
        'translate_data'  => 'Traduire les données',
        'diffchecker'     => 'Diffchecker',

        'global_settings' => 'Paramètres globaux',
        'edit_mode'       => 'Mode édition',
        'exit_edit'       => 'Quitter le mode édition',

        'edit_checkpoint' => 'Modifier le checkpoint',
        'save'            => 'Enregistrer',
        'cancel'          => 'Annuler',

        'original_position'     => 'Position originale : {index}',
        'bounce_orbs'           => 'Orbes de rebond',
        'abilities'             => 'Capacités',
        'ultimate_available'    => 'Ultime disponible',
        'dash_available'        => 'Dash disponible',
        'bans'                  => 'Bannissements',
        'kill_orbs'             => 'Orbes de kill',
        'teleport'              => 'Téléportation',
        'portals'               => 'Portails',
        'move_up'               => 'Monter',
        'move_down'             => 'Descendre',
        'coordinates'           => 'Coordonnées',
        'radius'                => 'Rayon',
        'start'                 => 'Début',
        'end'                   => 'Fin',
        'remove_teleport'       => 'Supprimer cette téléportation',
        'remove_kill_orb'       => 'Supprimer cet orbe de kill',
        'remove_checkpoint'     => 'Supprimer le checkpoint',
        'add_portal'            => 'Ajouter un portail',
        'add_teleport'          => 'Ajouter une téléportation',
        'add_kill_orb'          => 'Ajouter un orbe de kill',
        'add_bounce_orb'        => 'Ajouter un orbe de rebond',
        'cp_specific_bans'      => 'Bannissements spécifiques au checkpoint',

        'from_to'               => 'De ({sx}, {sy}, {sz}) → À ({ex}, {ey}, {ez})',
        'position_radius'       => 'Pos : ({px}, {py}, {pz}), Rayon : {r}',
        'lock_orb'              => 'Verrouiller',
        'ultimate'              => 'Ult',
        'dash'                  => 'Dash',
        'true'                  => 'Vrai',
        'false'                 => 'Faux',

        'pin_info'              => 'Pos : ({x}, {y}, {z}), Force : {f}, Verrouillage : {locked})',

        'map_name'              => 'Nom de la carte :',
        'global_bans'           => 'Bannissements globaux :',
        'editor_mode'           => 'Mode éditeur :',
        'difficulty_displayHUD' => 'Affichage de la difficulté (HUD) :',
        'playtest_display'      => 'Affichage du playtest :',
        'basic_validator'       => 'Validateur basique de carte :',
        'enable_portals'        => 'Activer les portails :',
        'off'                   => 'Désactivé',
        'on'                    => 'Activé',
        'dont_display'          => 'Ne pas afficher',
        'playtest'              => 'Playtest',
        'custom_portals'        => 'Portails personnalisés',
        'mapdata_error'         => 'La règle « map data » n’a pas été extraite correctement.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // COMMON MESSAGES
    // ──────────────────────────────────────────────────────────────────────
    'common' => [
        'copy_clipboard'       => 'La commande a été copiée dans le presse-papiers',
        'copy_clipboard_error' => 'Échec de la copie de la commande',
        'save_settings'        => 'Paramètres enregistrés',
        'deleted_checkpoint'   => 'Checkpoint supprimé',
        'cancel_changes'       => 'Modifications annulées',
        'processing'           => 'Traitement…',
        'translating'          => 'Traduction…',
        'converting'           => 'Conversion…',
    ],
];