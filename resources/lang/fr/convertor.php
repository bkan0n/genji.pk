<?php

return [
    // Hero / badges / tips
    'badge_tools' => 'Éditeur & outils',
    'hero_title_top' => 'OverPy → Atelier',
    'hero_title_bottom' => 'Convertisseur',
    'hero_sub' => 'Collez votre pasta OverPy, convertissez-la en code Atelier, traduisez les libellés et modifiez les données de la carte avant l’export.',
    'tips_title' => 'Astuces',
    'tips_1' => 'Utilisez Convert pour passer de la pasta → Atelier.',
    'tips_2' => 'Utilisez Translate pour changer la langue.',
    'tips_3' => 'Ouvrez Paramètres de la carte pour ajuster les données.',

    // Tabs / actions
    'convert_map' => 'Convertir la carte',
    'help' => 'Aide ?',
    'edit_map_data' => 'Modifier les données de la carte',
    'copy_to_clipboard' => 'Copier la carte dans le presse-papiers',
    'map_placeholder' => 'pasta de carte ici',

    // Descriptions
    'description_line_1' => 'Fonctionnalité expérimentale qui tente de charger les données de carte depuis la pasta.',
    'description_line_2' => 'Copiez toute la pasta du mode dans le champ de texte, sélectionnez la langue de votre client et appuyez sur Convert.',
    'description_line_3' => 'Ne prend en charge que les données collées depuis Overwatch. Si vous copiez directement depuis l’interface web, cela peut ne pas fonctionner.',
    'description_line_4' => 'Il se peut que tout ne soit pas importé ; à vous de vérifier votre carte après conversion.',

    // Capability lists
    'yes' => 'Oui',
    'yes_1' => 'Positions des checkpoints',
    'yes_2' => 'Téléportations',
    'yes_3' => 'Orbes de rebond / kill (par CP)',
    'yes_4' => 'Plugin ultime et dash',
    'yes_5' => 'Équipes (certains modes) et numéros',
    'yes_6' => 'Bans Workshop et bans par CP',

    'maybe' => 'Peut-être',
    'maybe_1' => 'Règles des add-ons',
    'maybe_2' => 'CP « Sky » (se chargent, ne fonctionnent pas)',

    'no' => 'Non',
    'no_1' => 'Orbes / kills valables pour toute la carte',
    'no_2' => 'Code personnalisé ajouté',
    'no_3' => 'if, return ou abort dans les données de règles',
    'no_4' => 'tout le reste',

    // Controls
    'pasta_language' => 'Langue de la pasta',
    'target_language' => 'Langue cible',
    'convert_data' => 'Convertir les données',
    'translate_data' => 'Traduire les données',
    'diffchecker' => 'Diffchecker',

    // Footer info
    'footer_made_by' => 'Réalisé par FishoFire / Rework par Arrow',
    'footer_version' => 'Version 1.10.4A',

    // Help steps
    'step1' => 'Étape 1',
    'step1_text' => 'Copiez les paramètres depuis Overwatch. Ouvrez l’éditeur Atelier sur le code 54CRY et configurez votre carte. Vous pouvez aussi copier les paramètres de n’importe quelle carte.',
    'step2' => 'Étape 2',
    'step2_text' => 'Collez les paramètres dans la zone de texte ci-dessous.',
    'step3' => 'Étape 3',
    'step3_text' => 'Assurez-vous que « Pasta Language » dans le sélecteur correspond à la langue de votre client Overwatch. Puis choisissez :',
    'step3_convert' => 'Convert Data pour mettre à jour vers la dernière version du framework',
    'step3_translate' => 'Translate Data pour mettre à jour ET traduire votre pasta',
    'step4' => 'Étape 4',
    'step4_text' => 'Modifiez les données de la carte si nécessaire.',
    'step5' => 'Étape 5',
    'step5_text' => 'Collez à nouveau dans l’Atelier.',
    'please_use_converter' => 'Veuillez d’abord utiliser le convertisseur',

    'map_data' => [
        'pasta_language' => 'Langue de la pasta',
        'target_language' => 'Langue cible',
        'convert_data' => 'Convertir les données',
        'translate_data' => 'Traduire les données',
        'diffchecker' => 'Diffchecker',

        'global_settings' => 'Paramètres globaux',
        'edit_mode' => 'Mode édition',
        'exit_edit' => 'Quitter l’édition',

        'edit_checkpoint' => 'Modifier le checkpoint',
        'save' => 'Enregistrer',
        'cancel' => 'Annuler',

        // JS placeholders ({}), pas les :placeholder Laravel
        'original_position' => 'Position d’origine : {index}',
        'bounce_orbs' => 'Orbes de rebond',
        'abilities' => 'Capacités',
        'ultimate_available' => 'Ultime disponible',
        'dash_available' => 'Dash disponible',
        'bans' => 'Interdictions',
        'kill_orbs' => 'Orbes de kill',
        'teleport' => 'Téléportation',
        'portals' => 'Portails',
        'move_up' => 'Monter',
        'move_down' => 'Descendre',
        'coordinates' => 'Coordonnées (X, Y, Z)',
        'remove_teleport' => 'Supprimer cette téléportation',
        'remove_kill_orb' => 'Supprimer cet orbe de kill',
        'remove_checkpoint' => 'Supprimer le checkpoint',
        'add_portal' => 'Ajouter un portail',
        'add_teleport' => 'Ajouter une téléportation',
        'add_kill_orb' => 'Ajouter un orbe de kill',
        'add_bounce_orb' => 'Ajouter un orbe de rebond',
        'cp_specific_bans' => 'Interdictions spécifiques au checkpoint',

        'from_to' => 'De ({sx}, {sy}, {sz}) → À ({ex}, {ey}, {ez})',
        'position_radius' => 'Pos : ({px}, {py}, {pz}), Rayon : {r}',
        'lock_orb' => 'Verrouiller',
        'ultimate' => 'Ultime',
        'dash' => 'Dash',
        'true' => 'Vrai',
        'false' => 'Faux',

        'pin_info' => 'Pos : ({x}, {y}, {z}), Force : {f}, Verrouillage : {locked})',

        'map_name' => 'Nom de la carte :',
        'global_bans' => 'Interdictions globales :',
        'editor_mode' => 'Mode éditeur :',
        'difficulty_displayHUD' => 'HUD d’affichage de difficulté :',
        'playtest_display' => 'Affichage playtest :',
        'basic_validator' => 'Validation basique de la carte :',
        'enable_portals' => 'Activer les portails :',
        'off' => 'Désactivé',
        'on' => 'Activé',
        'dont_display' => 'Ne pas afficher',
        'playtest' => 'Playtest',
        'custom_portals' => 'Portails personnalisés',
        'mapdata_error' => 'La règle « map data » n’a pas été extraite correctement.',
    ],

    'newsfeed' => [
        'copy_clipboard' => 'La commande a été copiée dans le presse-papiers',
        'copy_clipboard_error' => 'Échec de la copie de la commande dans le presse-papiers',
    ],
];
