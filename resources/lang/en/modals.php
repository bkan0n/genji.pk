<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Modals (EN)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // COMMON
    // ──────────────────────────────────────────────────────────────────────
    'common' => [
        'na' => 'N/A',
        'no_description' => 'No description available',
        'error' => 'Error',
        'loading' => 'Loading...',
        'to_see_details' => 'to see the details!',
        'timestamp_format' => '{month} {day}, {year} at {hour}:{minute} {AMorPM}',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // CREDITS MODAL
    // ──────────────────────────────────────────────────────────────────────
    'credits' => [
        'title' => 'Credits',
        'website_creators' => 'Website creators',
        'translation_contributors' => 'Translation contributors',
        'close' => 'Close credits modal',

        'role_backend'   => 'Backend',
        'role_frontend'  => 'Frontend',
        'note_backend'   => 'API, data model & bot integration.',
        'note_frontend'  => 'UI/UX, map browser & OCR integration.',
        'discord_label'  => 'Discord',

        'thanks' => 'Thanks to everyone contributing to the Genji Parkour project.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // SETTINGS MODAL
    // ──────────────────────────────────────────────────────────────────────
    'settings' => [
        'title' => 'Settings',
        'tabs' => [
            'overwatch' => 'Overwatch usernames',
            'notifications' => 'Notifications',
        ],
        'overwatch' => [
            'confirm' => 'Confirm',
        ],
        'notifications' => [
            'dm_on_verification' => 'Message me on verification',
            'dm_on_skill_role_update' => 'Message me on skill role update',
            'dm_on_lootbox_gain' => 'Message me on lootbox gain',
            'ping_on_xp_gain' => 'Ping me on XP gain',
            'ping_on_mastery' => 'Ping me on mastery',
            'ping_on_community_rank_update' => 'Ping me on community rank update',
        ],
        'close' => 'Close settings modal',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PROFILE MODAL
    // ──────────────────────────────────────────────────────────────────────
    'profile' => [
        'copy' => 'Copy',
        'dashboard' => 'Dashboard',
        'settings' => 'Settings',
        'logout' => 'Logout',
        'close' => 'Close profile modal',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // POPUP / MISC
    // ──────────────────────────────────────────────────────────────────────
    'popup' => [
        'login_required_btn' => 'Login required',
        'login_required_msg' => 'Login is required on this page',
        'login_required_pr' => 'Login is required to view personal records',
        'login_required_filter' => 'Login is required to use this filter',
        'login_required_progression' => 'Please login to see your progression',
        'map_code_required' => 'Enter a map code',
        'no_results' => 'No results found',
        'filter_applied' => 'Filter applied for {filterId}: {value}',
        'filters_cleared' => 'All filters have been cleared',
        'enter_username' => 'Enter a valid username',
        'username_updated' => 'Your username has been updated',
        'primary_username_updated' => 'Primary username updated',
        'already_exist_username' => 'Username already exist',
        'set_primary_username' => 'Set as primary username',
        'delete_username' => 'Delete username',
        'no_username_set' => 'No username set',
        'confirm_button' => 'Confirm',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // RULES MODAL
    // ──────────────────────────────────────────────────────────────────────
    'rules' => [
        'title' => 'Community Rules',
        'close' => 'Close rules modal',

        'rule_1_title' => '1. Be respectful',
        'rule_1_text' => 'This means no mean, rude, or harassing comments. Treat others the way you want to be treated.',

        'rule_2_title' => '2. Don\'t use Discord to spam, manipulate engagement, or disrupt other people\'s experience',
        'rule_2_text' => 'Including trying to influence or disrupt conversations using bots, fake accounts, multiple accounts, or other automation.',

        'rule_3_title' => '3. No inappropriate language',
        'rule_3_text' => 'Use of profanity should be kept to a reasonable minimum. Any derogatory language towards any user is prohibited.',

        'rule_4_title' => '4. No pornographic/adult/other NSFW material',
        'rule_4_text' => 'This is a community server and not meant to share this kind of material.',

        'rule_5_title' => '5. Don\'t share your personal information',
        'rule_5_text' => 'Do not share your personal information or the personal information of other users without their consent. This includes phone numbers, addresses, and any other sensitive information.',

        'rule_6_title' => '6. Follow the channel-specific guidelines',
        'rule_6_text' => 'Each channel in your server should have specific guidelines for the type of content that is allowed. Make sure to follow these guidelines and respect the purpose of each channel.',

        'rule_7_title' => '7. No sharing or distributing hacks, cheats, or other unauthorized tools or services',
        'rule_7_text' => 'Sharing or distributing hacks, cheats, or other unauthorized tools or services is strictly prohibited on the server.',
    ],
];