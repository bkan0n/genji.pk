<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Lootbox (EN)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // META
    // ──────────────────────────────────────────────────────────────────────
    'meta' => [
        'title' => 'Genji Parkour - Lootbox',
        'og' => [
            'title' => 'Lootbox — Genji Parkour',
            'description' => 'Open packs, earn rewards, and collect cosmetics.',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // HEADER
    // ──────────────────────────────────────────────────────────────────────
    'header' => [
        'title' => 'Lootbox',
        'subtitle' => 'Open packs · Earn rewards · Collect cosmetics',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // UI
    // ──────────────────────────────────────────────────────────────────────
    'ui' => [
        'give_key' => 'Give key',
        'open_pack' => 'Open pack',
        'select_key_type' => 'Select Key Type',
        'info' => 'Info',
        'close_modal' => 'Close modal',

        'pick_a_card' => 'Pick one card',
        'rewards_types' => [
            'spray' => 'Spray',
            'skin' => 'Skin',
            'pose' => 'Pose',
            'background' => 'Background',
            'coins' => 'Coins',
        ],

        'common' => 'Common',
        'rare' => 'Rare',
        'epic' => 'Epic',
        'legendary' => 'Legendary',

        'drop_rates' => 'Drop Rates',
        'lootbox_infos' => 'You are granted a key when you rank up to a new sub tier. For example: from Newcomer I → Newcomer II.',

        'no_keys_available' => 'No keys available',
        'session_expired' => 'Session expired. Open a new pack.',
        'error_fetching_keys' => 'Error fetching keys',
        'error_loading_rewards' => 'Error loading rewards.',

        'key_types' => [
            'Classic' => 'Classic',
            'Winter'  => 'Winter',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // POPUP / ERRORS
    // ──────────────────────────────────────────────────────────────────────
    'popup' => [
        'error_generic' => 'Something went wrong. Please try again.',
        'network_error' => 'Network error.',
        'unexpected_format' => 'Unexpected rewards format.',
        'click_required' => 'A user action is required.',
        'login_required_msg' => 'Login required.',
        'login_required_btn' => 'Login',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // LOOTBOX
    // ──────────────────────────────────────────────────────────────────────
    'lootbox' => [
        'no_keys_available' => 'No keys available',
        'session_expired'   => 'Session expired. Open a new pack.',
    ],
];
