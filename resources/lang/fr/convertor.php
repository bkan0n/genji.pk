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
    'badge_tools'        => "Éditeur & outils",
    'hero_title_top'     => "OverPy → Workshop",
    'hero_title_bottom'  => "Convertisseur",
    'hero_sub'           => "Collez votre pasta OverPy, convertissez-la en code Workshop, traduisez les labels et modifiez les données de la carte avant l’export.",
    'tips_title'         => "Astuces",
    'tips_1'             => "Utilisez Convert pour transformer la pasta → Workshop.",
    'tips_2'             => "Utilisez Translate pour changer la langue.",
    'tips_3'             => "Ouvrez Map settings pour ajuster les données.",

    // ──────────────────────────────────────────────────────────────────────
    // TABS / ACTIONS
    // ──────────────────────────────────────────────────────────────────────
    'convert_map'        => "Convertir la carte",
    'help'               => "Aide ?",
    'edit_map_data'      => "Modifier les données",
    'copy_to_clipboard'  => "Copier la carte dans le presse-papiers",
    'map_placeholder'    => "pasta de carte ici",

    // ──────────────────────────────────────────────────────────────────────
    // DESCRIPTIONS
    // ──────────────────────────────────────────────────────────────────────
    'description_line_1' => "Fonctionnalité expérimentale qui tente de charger mapdata à partir de la pasta.",
    'description_line_2' => "Copiez toute la pasta du mode dans le champ de texte, choisissez la langue de votre client et appuyez sur Convert.",
    'description_line_3' => "Ne prend en charge que les données copiées depuis Overwatch. Si vous copiez depuis l’interface web, cela peut ne pas fonctionner.",
    'description_line_4' => "Il se peut que tout ne soit pas importé : c'est à vous de vérifier votre carte pour détecter d'éventuelles erreurs.",

    // ──────────────────────────────────────────────────────────────────────
    // CAPABILITIES
    // ──────────────────────────────────────────────────────────────────────
    'yes'    => "Oui",
    'yes_1'  => "Positions des checkpoints",
    'yes_2'  => "Téléports",
    'yes_3'  => "Orbes rebond/kill (par CP)",
    'yes_4'  => "Plugin d’ultime et dash",
    'yes_5'  => "Équipes dans certains modes et leurs indices",
    'yes_6'  => "Workshop bans et bans par CP",

    'maybe'    => "Peut-être",
    'maybe_1'  => "Règles d’addons",
    'maybe_2'  => "Sky CP (chargera, mais ne fonctionnera pas)",

    'no'    => "Non",
    'no_1'  => "Orbes/kills globaux sur toute la carte",
    'no_2'  => "Code ajouté manuellement",
    'no_3'  => "if, return ou abort dans les règles",
    'no_4'  => "tout le reste",

    // ──────────────────────────────────────────────────────────────────────
    // CONTROLS
    // ──────────────────────────────────────────────────────────────────────
    'pasta_language'  => "Langue de la pasta",
    'target_language' => "Langue cible",
    'convert_data'    => "Convertir",
    'translate_data'  => "Traduire",
    'diffchecker'     => "Diffchecker",
    'global_settings' => "Paramètres globaux",
    'edit_mode'       => "Mode édition",

    // ──────────────────────────────────────────────────────────────────────
    // FOOTER INFO
    // ──────────────────────────────────────────────────────────────────────
    'footer_made_by' => "Réalisé par FishoFire / Retouché par Arrow",
    'footer_version' => "Version 1.10.4D",

    // ──────────────────────────────────────────────────────────────────────
    // HELP STEPS
    // ──────────────────────────────────────────────────────────────────────
    'step1'         => "Étape 1",
    'step1_text'    => "Copiez les paramètres depuis Overwatch. Ouvrez l’éditeur Workshop sur le code 54CRY et configurez votre carte. Vous pouvez aussi copier les paramètres de n’importe quelle carte.",
    'step2'         => "Étape 2",
    'step2_text'    => "Collez les paramètres dans la zone de texte ci-dessous.",
    'step3'         => "Étape 3",
    'step3_text'    => "Assurez-vous que la “Langue de la pasta” correspond à la langue de votre client Overwatch. Ensuite choisissez :",
    'step3_convert' => "Convert Data pour mettre à jour vers la dernière version du framework",
    'step3_translate' => "Translate Data pour mettre à jour **et** traduire votre pasta",
    'step4'         => "Étape 4",
    'step4_text'    => "Modifiez les données de la carte si nécessaire.",
    'step5'         => "Étape 5",
    'step5_text'    => "Collez à nouveau dans Workshop.",
    'please_use_converter' => "Veuillez d’abord utiliser le convertisseur",

    // ──────────────────────────────────────────────────────────────────────
    // MAP DATA EDITOR
    // ──────────────────────────────────────────────────────────────────────
    'map_data' => [
        'pasta_language'  => "Langue de la pasta",
        'target_language' => "Langue cible",
        'convert_data'    => "Convertir",
        'translate_data'  => "Traduire",
        'diffchecker'     => "Diffchecker",

        'global_settings' => "Paramètres globaux",
        'edit_mode'       => "Mode édition",
        'exit_edit'       => "Quitter le mode édition",

        'edit_checkpoint' => "Modifier le checkpoint",
        'save'            => "Enregistrer",
        'cancel'          => "Annuler",

        'original_position' => "Position originale : {index}",
        'bounce_orbs'       => "Orbes rebond",
        'abilities'         => "Capacités",
        'ultimate_available'=> "Ultime disponible",
        'dash_available'    => "Dash disponible",
        'bans'              => "Bans",
        'kill_orbs'         => "Orbes kill",
        'teleport'          => "Téléport",
        'portals'           => "Portails",
        'move_up'           => "Monter",
        'move_down'         => "Descendre",
        'coordinates'       => "Coordonnées",
        'radius'            => "Rayon",
        'start'             => "Début",
        'end'               => "Fin",
        'remove_teleport'   => "Supprimer ce téléport",
        'remove_kill_orb'   => "Supprimer cet orbe kill",
        'remove_checkpoint' => "Supprimer le checkpoint",
        'add_portal'        => "Ajouter un portail",
        'add_teleport'      => "Ajouter un téléport",
        'add_kill_orb'      => "Ajouter un orbe kill",
        'add_bounce_orb'    => "Ajouter un orbe rebond",
        'cp_specific_bans'  => "Bans spécifiques au checkpoint",

        'from_to'           => "De ({sx}, {sy}, {sz}) → À ({ex}, {ey}, {ez})",
        'position_radius'   => "Pos : ({px}, {py}, {pz}), Rayon : {r}",
        'lock_orb'          => "Verrouiller",
        'ultimate'          => "Ult",
        'dash'              => "Dash",
        'true'              => "Vrai",
        'false'             => "Faux",

        'pin_info'          => "Pos : ({x}, {y}, {z}), Force : {f}, Lock : {locked})",

        'map_name'          => "Nom de la carte :",
        'global_bans'       => "Bans globaux :",
        'editor_mode'       => "Mode éditeur :",
        'difficulty_displayHUD' => "Affichage difficulté HUD :",
        'playtest_display'      => "Affichage playtest :",
        'basic_validator'       => "Validateur basique de carte :",
        'enable_portals'        => "Activer les portails :",
        'off'                   => "Off",
        'on'                    => "On",
        'dont_display'          => "Ne pas afficher",
        'playtest'              => "Playtest",
        'custom_portals'        => "Portails personnalisés",
        'mapdata_error'         => 'La règle "map data" n’a pas été extraite correctement.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // COMMON MESSAGES
    // ──────────────────────────────────────────────────────────────────────
    'common' => [
        'copy_clipboard'       => "Commande copiée dans le presse-papiers",
        'copy_clipboard_error' => "Échec de la copie dans le presse-papiers",
        'save_settings'        => "Paramètres enregistrés",
        'deleted_checkpoint'   => "Checkpoint supprimé",
        'cancel_changes'       => "Modifications annulées",
        'processing'           => "Traitement…",
        'translating'          => "Traduction…",
        'converting'           => "Conversion…",
    ],
];
