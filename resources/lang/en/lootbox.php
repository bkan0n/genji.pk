<?php
// resources/lang/en/lootbox.php

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
        'title'           => 'Genji Parkour - Lootbox',
        'og' => [
            'title'       => 'Lootbox — Genji Parkour',
            'description' => 'Open packs, earn rewards, and collect cosmetics.',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // HEADER
    // ──────────────────────────────────────────────────────────────────────
    'header' => [
        'title'    => 'Lootbox',
        'subtitle' => 'Open packs · Earn rewards · Collect cosmetics',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // UI
    // ──────────────────────────────────────────────────────────────────────
    'ui' => [
        'give_key'        => 'Give key',
        'open_pack'       => 'Open pack',
        'select_key_type' => 'Select Key Type',
        'info'            => 'Info',
        'close_modal'     => 'Close modal',

        'loading_3d' => 'Loading 3D scene…',
        'loading_3d_failed_title' => '3D failed to load',
        'loading_3d_failed_desc' => 'Try refreshing the page or disable heavy browser extensions.',
        'retry' => 'Retry',

        'pick_a_card'     => 'Pick one card',
        'rewards_types' => [
            'spray'       => 'Spray',
            'skin'        => 'Skin',
            'pose'        => 'Pose',
            'background'  => 'Background',
            'coins'       => 'Coins',
        ],

        'common'                => 'Common',
        'rare'                  => 'Rare',
        'epic'                  => 'Epic',
        'legendary'             => 'Legendary',

        'drop_rates'            => 'Drop Rates',
        'lootbox_infos'         => 'You are granted a key when you rank up to a new sub tier. For example: from Newcomer I → Newcomer II.',

        'no_keys_available'     => 'No keys available',
        'session_expired'       => 'Session expired. Open a new pack.',
        'error_fetching_keys'   => 'Error fetching keys',
        'error_loading_rewards' => 'Error loading rewards.',

        'key_types' => [
            'Classic' => 'Classic',
            'Winter'  => 'Winter',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // STORE (Modal)
    // ──────────────────────────────────────────────────────────────────────
    'store' => [
        'title'                      => 'Store',
        'subtitle'                   => 'Rotation • Keys • Purchases',

        'coins_label'                => 'Coins',

        'rotation_title'             => 'Current Rotation',
        'refresh'                    => 'Refresh',

        'buy_keys_title'             => 'Buy Keys',
        'buy_keys_subtitle'          => 'Bulk discounts included',

        'price_label'                => 'Price',
        'purchase_keys'              => 'Purchase Keys',

        'purchase_history_title'     => 'Purchase History',
        'purchase_history_subtitle'  => 'Latest transactions',

        'loading_rotation'           => 'Loading rotation…',
        'available_until'            => 'Available until :date',
        'rotation_number'            => 'Rotation #:id',

        'login_required'             => 'Login required.',
        'login_required_store'       => 'Login required to use the store.',
        'login_required_purchases'   => 'Login to see purchases.',

        'no_items_rotation'          => 'No items in rotation.',
        'no_purchases'               => 'No purchases yet.',

        'price'                      => 'Price',
        'paid'                       => 'paid',
        'owned'                      => 'OWNED',
        'buy'                        => 'Buy',
        'item'                       => 'Item',

        'item_purchased'             => 'Item purchased!',
        'keys_purchased'             => 'Keys purchased!',
        'purchase_failed'            => 'Purchase failed.',
        'store_refreshed'            => 'Store refreshed',

        'discount'                   => 'Discount: :percent%',
        'no_discount'                => 'No discount',

        'image_unavailable'          => 'Image unavailable',
        'no_image'                   => 'No image',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // POPUP / ERRORS
    // ──────────────────────────────────────────────────────────────────────
    'popup' => [
        'error_generic'          => 'Something went wrong. Please try again.',
        'network_error'          => 'Network error.',
        'unexpected_format'      => 'Unexpected rewards format.',
        'click_required'         => 'A user action is required.',
        'login_required_msg'     => 'Login required.',
        'login_required_btn'     => 'Login',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // LOOTBOX
    // ──────────────────────────────────────────────────────────────────────
    'lootbox' => [
        'no_keys_available' => 'No keys available',
        'session_expired'   => 'Session expired. Open a new pack.',
    ],
];