<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Submit & Playtest (EN)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // HERO & TABS
    // ──────────────────────────────────────────────────────────────────────
    'header' => [
        'title'    => 'Submit & Playtest',
        'subtitle' => 'maps · records · feedback',
    ],

    'tabs' => [
        'record'   => 'Submit completion',
        'playtest' => 'Submit playtest vote',
        'map'      => 'Submit map',
    ],

    'help' => [
        'how_to_submit'         => 'How to submit?',
        'playtesting_info'      => 'Playtesting info',
        'difficulty_techs_info' => 'Difficulty & Techs info',
        'rank_how_to_submit'      => 'How to submit?',
        'rank_submission_rules'   => 'Submission Rules',
        'rank_info_thresholds'    => 'Rank info & Thresholds',
        'medals_info_thresholds'  => 'Medals info & Thresholds',
    ],

    'help_groups' => [
        'map_submission_info' => 'Map submission info',
        'rank_promotion'      => 'Rank promotion',
    ],

    'notice' => [
        'title' => 'Playtest submission',
        'pending_accept' => "Your submission won't count towards official records until the map is accepted.",
        'mutable_difficulty' => 'The difficulty may change at any time until the map is finished.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // RECORD (Submit Record tab)
    // ──────────────────────────────────────────────────────────────────────
    'record' => [
        'select_quality'       => 'Select a quality (1–6)',
        'optional'             => 'Optional',
        'video'                => 'Video (URL)',
        'screenshot'           => 'Screenshot',
        'drag_and_drop'        => 'Drag & drop an image here, or click to upload',
        'cancel'               => 'Cancel',
        'submit_label'         => 'Submit record',
        'uploading_screenshot' => 'Uploading screenshot…',
        'ocr_processing'       => 'OCR processing…',

        'code_invalid'        => 'Please enter a valid map code.',
        'time_label'          => 'Record time',
        'time_invalid'        => 'Please enter a valid time.',
        'quality_required'    => 'Please select a quality.',
        'screenshot_required' => 'Please upload a screenshot.',
        'video_invalid'       => 'Please enter a valid video URL.',
        'confirm' => 'Your record was submitted successfully.',

        'time_hint' => 'Invalid time format: up to 5 digits before the dot and 2 after (e.g. 12345.67).',
        'view_modal' => 'View playtest',

        'quality'   => 'Quality',
        'quality_1' => '1 - Poor',
        'quality_2' => '2 - Subpar',
        'quality_3' => '3 - Average',
        'quality_4' => '4 - Good',
        'quality_5' => '5 - Great',
        'quality_6' => '6 - Excellent',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MAP
    // ──────────────────────────────────────────────────────────────────────
    'map' => [
        'meta' => [
            'creator'           => 'Creator',
            'code'              => 'Code',
            'name'              => 'Map name',
            'checkpoints'       => 'Checkpoints',
            'edit'              => 'Edit',
            'save'              => 'Save',
            'cancel'            => 'Cancel',
            'add_creator'       => 'Add creator',
            'search_creator'    => 'Search a creator…',
            'search_map_name'   => 'Search a map name…',
            'official'          => 'Official',
            'unofficial'        => 'Unofficial',
        ],

        'required_title'          => 'Required',
        'dropdown' => [
            'select_difficulty'   => 'Select difficulty',
            'select_category'     => 'Select category',
            'select_mechanics'    => 'Select mechanics',
            'select_restrictions' => 'Select restrictions',
            'difficulty'          => 'Difficulty',
            'category'            => 'Map type',
            'mechanics'           => 'Mechanics',
            'restrictions'        => 'Restrictions',
        ],

        'optional_title'         => 'Optional',
        'title_label'            => 'Title',
        'title_placeholder'      => 'Optional short title (max 128 chars)',
        'custom_banner'          => 'Custom banner',
        'banner_hint'            => 'Recommended 16:9. JPG/PNG/WebP/AVIF, max 10MB.',
        'description_label'      => 'Description',
        'guide_label'            => 'Guide (URL)',
        'guide_hint'             => 'One URL per line; first valid URL is used.',
        'medals_hint'            => 'Format: max 5 digits before the decimal and up to 2 after (e.g., 12345.67). Values ≥ 0. Required order: bronze > silver > gold.',
        'remove'                 => 'Remove',

        'submit_label' => 'Submit map',

        'val' => [
            'creator'                => 'Please select a main creator.',
            'map_code'               => 'Please enter a valid map code.',
            'map_code_already_exist' => 'This map code already exists.',
            'map_name'               => 'Please enter the map name.',
            'checkpoints'            => 'Please select a difficulty.',
            'map_type'               => 'Please select a map type.',
            'mechanics'              => 'Please select at least one mechanic.',
            'restrictions'           => 'Please select at least one restriction.',
            'medals_generic'         => 'Invalid medals.',
            'medals_missing'         => 'Please fill all three medal values.',
            'medals_order'           => 'Ordering must be Bronze > Silver > Gold.',
        ],

        'confirm'        => 'Your map was submitted successfully.',

        'no_description' => 'No description provided.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MAP BANNER UNOFFICIAL NOTICE
    // ──────────────────────────────────────────────────────────────────────
    'unofficial_notice' => [
        'title' => 'Unofficial map submission',
        'li1'   => "This is an unofficial map so it will not go through playtest and you will not gain ranks or XP for completions.",
        'li2'   => "If a map code is created on non CN servers, we can proceed through playtest by linking the code.",
        'li3'   => "For completions to count towards ranks and XP, it must be played on non CN servers.",
        'li4'   => "Please put who 'owns' the CN code in the description so we can ping them if a map changes.",
    ],

    // ──────────────────────────────────────────────────────────────────────
    // OCR NOTICE
    // ──────────────────────────────────────────────────────────────────────
    'ocr' => [
        'title' => 'Screenshot OCR',
        'li1'   => "When you upload a screenshot, we try to automatically detect the map code and time.",
        'li2'   => "Always double-check the values before submitting your record.",
    ],

    // ──────────────────────────────────────────────────────────────────────
    // HELP MODALS (full texts for modals)
    // ──────────────────────────────────────────────────────────────────────
    'how_to_submit' => [
        'title' => 'How to submit a map?',
        'intro' => 'This dialog walks you through every step of the “Submit map” section.',

        'meta' => [
            'title'        => 'Metadata (map & creators)',
            'li_creator'   => 'Main creator: it is auto-filled from your session. You can change it (and add co-creators if the option is visible).',
            'li_code'      => 'Map code: click “Edit” next to the “Code” field. The code must be unique (we check if it already exists).',
            'li_name'      => 'Map name: click “Edit” next to “Map name” and pick a name via autocomplete.',
            'li_checkpoints'=> 'Checkpoints: click “Edit” and enter a strictly positive number.',
        ],

        'required' => [
            'title'        => 'Required fields',
            'p1'           => 'These fields must be provided before you can submit:',
            'li_difficulty'=> 'Difficulty: choose a value (Easy → Hell).',
            'li_category'  => 'Category / Map type: choose a type (e.g., Classic, Increasing Difficulty).',
            'li_mechanics' => 'Mechanics: select at least one.',
            'li_restrictions'=> 'Restrictions: select at least one.',
        ],

        'medals' => [
            'title'  => 'Medals (optional but validated if present)',
            'p1'     => 'You may define times (in seconds) for Gold, Silver, and Bronze.',
            'li_rules'   => 'If you set one medal, you must set all three.',
            'li_pattern' => 'Format: 1–5 digits, optionally “.” and 1–2 decimals (e.g., 5550.23). Non-negative values.',
            'li_order'   => 'Required ordering: Bronze > Silver > Gold (Bronze greater than Silver, which is greater than Gold).',
        ],

        'optional' => [
            'title'      => 'Optional',
            'li_title'   => 'Title: short optional title (max 128 chars).',
            'li_banner'  => 'Custom banner: drag & drop or click to upload (JPG/PNG/WebP/AVIF), size ≤ 8MB. 16:9 recommended.',
            'li_description' => 'Description: free text (if empty, “N/A” is shown).',
            'li_guide'   => 'Guide URL(s): one URL per line. The first valid URL is used.',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PLAYTEST (shared modal/labels)
    // ──────────────────────────────────────────────────────────────────────
    'playtest' => [
        'title_suffix'             => 'is requesting playtest feedback',
        'votes'                    => 'Votes',
        'difficulty_rating'        => 'Difficulty rating',
        'rating_sub'               => 'Based on community votes',
        'question_difficulty'      => 'Vote map difficulty',
        'complete_to_vote'         => 'Submit a completion to be able to vote',
        'vote_recorded'            => 'Your vote has been submitted',
        'vote_updated'             => 'Your vote has been updated',
        'no_votes'                 => 'No votes yet',
        'cannot_vote_own_map'      => 'You cannot vote for your own map',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FILTERS (toolbar + common filter labels)
    // ──────────────────────────────────────────────────────────────────────
    'filters'              => [
        'creator'          => 'Creator',
        'enter_creator'    => 'Enter creator',

        'map_name'         => 'Map name',
        'enter_map_name'   => 'Enter map name',

        'user'             => 'User name',
        'enter_nickname'   => 'Enter user name',

        'code'             => 'Map code',
        'map_code'         => 'Map code',
        'enter_map_code'   => 'Enter map code',

        'difficulty'       => 'Difficulty',
        'beginner'         => 'Beginner',
        'easy'             => 'Easy',
        'medium'           => 'Medium',
        'hard'             => 'Hard',
        'very_hard'        => 'Very Hard',
        'extreme'          => 'Extreme',
        'hell'             => 'Hell',

        'category'               => 'Map type',
        'map_type'               => 'Map type',
        'classic'                => 'Classic',
        'increasing_difficulty'  => 'Increasing difficulty',
        'tournament'             => 'Tournament',

        'mechanics'              => 'Mechanics',
        'restrictions'           => 'Restrictions',

        'playtest_status'        => 'Only playtest',
        'only_true'              => 'True',
        'only_false'             => 'False',
        'completion_filter'      => 'Only completions',
        'medal_filter'           => 'Only medals',

        'participation_filter'   => 'Participation filter',
        'participated_yes'       => 'Participated',
        'participated_no'        => 'Not participated',

        'apply_filters'          => 'Apply filters',
        'clear_filters'          => 'Clear filters',

        'tags'                   => 'Tags',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TABLE HEADERS
    // ──────────────────────────────────────────────────────────────────────
    'table' => [
        'code'              => 'Code',
        'map_name'          => 'Name',
        'map_type'          => 'Type',
        'creator'           => 'Creator',
        'difficulty'        => 'Difficulty',
        'checkpoints'       => 'Checkpoints',
        'quality'           => 'Quality',
        'medals'            => 'Medals',
        'medal_gold'        => 'Gold',
        'medal_silver'      => 'Silver',
        'medal_bronze'      => 'Bronze',
        'details'           => 'Details',
        'view'              => 'View',
        'nickname'          => 'Nickname',
        'time'              => 'Time',
        'medal'             => 'Medal',
        'video'             => 'Video',
        'xp'                => 'XP',
        'playtests_votes'   => 'Playtest Votes',
        'mechanics'         => 'Mechanics',
        'restrictions'      => 'Restrictions',
        'description'       => 'Description',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MESSAGES (confirmations, generic)
    // ──────────────────────────────────────────────────────────────────────
    'messages' => [
        'submit_record_confirm' => 'Your record was submitted successfully.',
        'submit_map_confirm'    => 'Your map was submitted successfully.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // ERRORS
    // ──────────────────────────────────────────────────────────────────────
    'errors' => [
        'server_unreachable'      => 'Server unreachable. Please try again.',
        'playtests_load_failed'   => 'Failed to load playtests. Please try again later.',
        'image_type'              => 'Invalid image type.',
        'image_too_large'         => 'Image too large (max 8MB).',
        'upload_failed'           => 'Upload failed.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // POPUP / MISC
    // ──────────────────────────────────────────────────────────────────────
    'popup' => [
        'no_results'              => 'No results found.',
        'filter_applied'          => 'Filter applied: {filterId} = {value}',
        'login_required_msg'      => 'Please log in to use submit & playtest tools',
        'map_code_copied'         => 'Map code copied: {code}',
        'click_to_copy_map_code'  => 'Click to copy',
        'copied'                  => 'Copied!',
        'copy'                    => 'Copy',
        'copy_failed'             => 'Failed to copy.',
        'login'                   => 'Login',
        'user_id_copied'          => 'User ID {id} copied to clipboard!',
        'none'                    => 'N/A',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PAGINATION
    // ──────────────────────────────────────────────────────────────────────
    'pagination' => [
        'first'     => '« First',
        'prev'      => '‹ Prev',
        'next'      => 'Next ›',
        'last'      => 'Last »',
        'page_of'   => 'Page {current} of {total}',
    ],
];
