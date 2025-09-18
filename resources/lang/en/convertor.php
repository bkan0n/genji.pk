<?php

return [
    // Hero / badges / tips
    'badge_tools' => 'Editor & tools',
    'hero_title_top' => 'OverPy → Workshop',
    'hero_title_bottom' => 'Convertor',
    'hero_sub' => 'Paste your OverPy pasta, convert to Workshop code, translate labels, and edit map data before export.',
    'tips_title' => 'Tips',
    'tips_1' => 'Use Convert for pasta → Workshop.',
    'tips_2' => 'Use Translate to change language.',
    'tips_3' => 'Open Map settings to tweak data.',

    // Tabs / actions
    'convert_map' => 'Convert map',
    'help' => 'Help ?',
    'edit_map_data' => 'Edit map data',
    'copy_to_clipboard' => 'Copy map to clipboard',
    'map_placeholder' => 'map pasta here',

    // Descriptions
    'description_line_1' => 'Experimental feature that attempts to load mapdata from map pasta.',
    'description_line_2' => 'Copy the entire mode pasta in the text field, select your client language and press convert.',
    'description_line_3' => 'Only supports data pasted from Overwatch. If you copy straight from the web interface, it might not work.',
    'description_line_4' => 'This might not import everything and it’s on you to check your map for mistakes in converting.',

    // Capability lists
    'yes' => 'Yes',
    'yes_1' => 'Checkpoint positions',
    'yes_2' => 'Teleports',
    'yes_3' => 'Bounce /kill orbs (per cp)',
    'yes_4' => 'Ult and dash plugin',
    'yes_5' => 'Teams in some modes and numbers',
    'yes_6' => 'Workshop bans and bans per cp',

    'maybe' => 'Maybe',
    'maybe_1' => 'Addons rules',
    'maybe_2' => 'Sky cp’s (will load, won’t function)',

    'no' => 'No',
    'no_1' => 'Orbs / kills that work for entire map',
    'no_2' => 'Custom added code',
    'no_3' => 'if’s, returns or aborts in rule data',
    'no_4' => 'everything else',

    // Controls
    'pasta_language' => 'Pasta language',
    'target_language' => 'Target language',
    'convert_data' => 'Convert data',
    'translate_data' => 'Translate data',
    'diffchecker' => 'Diffchecker',
    'global_settings' => 'Global Settings',
    'edit_mode' => 'Edit mode',

    // Footer info
    'footer_made_by' => 'Made by FishoFire / Reworked by Arrow',
    'footer_version' => 'Version 1.10.4A',

    // Help steps
    'step1' => 'Step 1',
    'step1_text' => 'Copy settings from Overwatch. Open the workshop editor on code 54CRY and configure your map. You can also copy the settings from whatever map you want.',
    'step2' => 'Step 2',
    'step2_text' => 'Paste the settings into the text area below.',
    'step3' => 'Step 3',
    'step3_text' => 'Make sure the “Pasta Language” in the selector matches your Overwatch client language. Then choose:',
    'step3_convert' => 'Convert Data to update to the latest framework version',
    'step3_translate' => 'Translate Data to update AND translate your pasta',
    'step4' => 'Step 4',
    'step4_text' => 'Edit map data if needed.',
    'step5' => 'Step 5',
    'step5_text' => 'Paste back into Workshop.',
    'please_use_converter' => 'Please use the convertor first',

    'map_data' => [
        'pasta_language' => 'Pasta language',
        'target_language' => 'Target language',
        'convert_data' => 'Convert data',
        'translate_data' => 'Translate data',
        'diffchecker' => 'Diffchecker',

        'global_settings' => 'Global settings',
        'edit_mode' => 'Edit mode',
        'exit_edit' => 'Exit edit',

        'edit_checkpoint' => 'Edit Checkpoint',
        'save' => 'Save',
        'cancel' => 'Cancel',

        'original_position' => 'Original position : {index}',
        'bounce_orbs' => 'Bounce orbs',
        'abilities' => 'Abilities',
        'ultimate_available' => 'Ultimate available',
        'dash_available' => 'Dash available',
        'bans' => 'Bans',
        'kill_orbs' => 'Kill orbs',
        'teleport' => 'Teleport',
        'portals' => 'Portals',
        'move_up' => 'Move up',
        'move_down' => 'Move down',
        'coordinates' => 'Coordinates (X, Y, Z)',
        'remove_teleport' => 'Remove this teleport',
        'remove_kill_orb' => 'Remove this kill orb',
        'remove_checkpoint' => 'Remove checkpoint',
        'add_portal' => 'Add portal',
        'add_teleport' => 'Add teleport',
        'add_kill_orb' => 'Add kill orb',
        'add_bounce_orb' => 'Add bounce orb',
        'cp_specific_bans' => 'Checkpoint-specific Bans',

        'from_to' => 'From ({sx}, {sy}, {sz}) → To ({ex}, {ey}, {ez})',
        'position_radius' => 'Pos: ({px}, {py}, {pz}), Radius: {r}',
        'lock_orb' => 'Lock',
        'ultimate' => 'Ult',
        'dash' => 'Dash',
        'true' => 'True',
        'false' => 'False',

        'pin_info' => 'Pos: ({x}, {y}, {z}), Strength: {f}, Lock: {locked})',

        'map_name' => 'Map name:',
        'global_bans' => 'Global bans:',
        'editor_mode' => 'Editor mode:',
        'difficulty_displayHUD' => 'Difficulty display HUD:',
        'playtest_display' => 'Playtest display:',
        'basic_validator' => 'Basic map validator:',
        'enable_portals' => 'Enable portals:',
        'off' => 'Off',
        'on' => 'On',
        'dont_display' => "Don't display",
        'playtest' => 'Playtest',
        'custom_portals' => 'Custom portals',
        'mapdata_error' => 'The "map data" rule hasn\'t been extracted correctly.',
    ],

    'newsfeed' => [
        'copy_clipboard' => 'Command has been copied to clipboard',
        'copy_clipboard_error' => 'Failed to copy command to clipboard',
    ],
];
