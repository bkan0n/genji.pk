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
        'title' => 'Submit & Playtest',
        'subtitle' => 'maps · records · feedback',
    ],

    'tabs' => [
        'record' => 'Submit completion',
        'playtest' => 'Submit playtest',
        'map' => 'Submit map',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // RECORD (Submit Record tab)
    // ──────────────────────────────────────────────────────────────────────
    'record' => [
        'select_quality' => 'Select a quality (1–6)',
        'optional' => 'Optional',
        'video' => 'Video (URL)',
        'screenshot' => 'Screenshot',
        'drag_and_drop' => 'Drag & drop an image here, or click to upload',
        'cancel' => 'Cancel',
        'submit_label' => 'Submit record',

        // validations/messages
        'time_label' => 'Record time',
        'time_invalid' => 'Please enter a valid time.',
        'quality_required' => 'Please select a quality.',
        'screenshot_needed' => 'Please attach a screenshot of your completion.',

        // confirmations
        'confirm' => 'Your record was submitted successfully.',

        // format hints
        'time_hint' => 'Invalid time format: up to 5 digits before the dot and 2 after (e.g. 12345.67).',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MAP (Submit Map tab)
    // ──────────────────────────────────────────────────────────────────────
    'map' => [
        // Meta block
        'meta' => [
            'creator' => 'Creator',
            'code' => 'Code',
            'name' => 'Map name',
            'checkpoints' => 'Checkpoints',
            'edit' => 'Edit',
            'add_creator' => 'Add creator',
            'search_creator' => 'Search a creator…',
            'search_map_name' => 'Search a map name…',
        ],

        // Required block
        'required_title' => 'Required',
        'dropdown' => [
            'select_difficulty' => 'Select difficulty',
            'select_category' => 'Select category',
            'select_mechanics' => 'Select mechanics',
            'select_restrictions' => 'Select restrictions',
            'difficulty' => 'Difficulty',
            'category' => 'Map type',
            'mechanics' => 'Mechanics',
            'restrictions' => 'Restrictions',
        ],

        // Optional block
        'optional_title' => 'Optional',
        'title_label' => 'Title',
        'title_placeholder' => 'Optional short title (max 128 chars)',
        'custom_banner' => 'Custom banner',
        'banner_hint' => 'Recommended 16:9. JPG/PNG/WebP/AVIF, max 10MB.',
        'description_label' => 'Description',
        'guide_label' => 'Guide (URL)',
        'guide_hint' => 'One URL per line; first valid URL is used.',
        'medals_hint' => 'Format: max 5 digits before the decimal and up to 2 after (e.g., 12345.67). Values ≥ 0. Required order: bronze > silver > gold.',
        'remove' => 'Remove',

        // Submit button
        'submit_label' => 'Submit map',

        // Validations
        'val' => [
            'creator' => 'Please select a main creator.',
            'map_code' => 'Please enter a valid map code.',
            'map_name' => 'Please enter the map name.',
            'checkpoints' => 'Please enter a positive number of checkpoints.',
            'difficulty' => 'Please select a difficulty.',
            'map_type' => 'Please select a map type.',
            'mechanics' => 'Please select at least one mechanic.',
            'restrictions' => 'Please select at least one restriction.',
            'medals_generic' => 'Invalid medals.',
            'medals_missing' => 'Please fill all three medal values.',
            'medals_order' => 'Ordering must be Bronze > Silver > Gold.',
        ],

        // Confirmations
        'confirm' => 'Your map was submitted successfully.',

        // Misc
        'no_description' => 'No description provided.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PLAYTEST (shared modal/labels)
    // ──────────────────────────────────────────────────────────────────────
    'playtest' => [
        'title_suffix' => 'is requesting playtest feedback',
        'votes' => 'Votes',
        'difficulty_rating' => 'Difficulty rating',
        'rating_sub' => 'Based on community votes',
        'question_difficulty' => 'How difficult was this map for you?',
        'complete_to_vote' => 'Submit a completion to be able to vote',
        'vote_recorded' => 'Your vote has been submitted',
        'vote_updated' => 'Your vote has been updated',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FILTERS (toolbar + common filter labels)
    // ──────────────────────────────────────────────────────────────────────
    'filters' => [
        'creator' => 'Creator',
        'enter_creator' => 'Enter creator',

        'map_name' => 'Map name',
        'enter_map_name' => 'Enter map name',

        'user' => 'User name',
        'enter_nickname' => 'Enter user name',

        'code' => 'Map code',
        'map_code' => 'Map code',
        'enter_map_code' => 'Enter map code',

        'difficulty' => 'Difficulty',
        'beginner' => 'Beginner',
        'easy' => 'Easy',
        'medium' => 'Medium',
        'hard' => 'Hard',
        'very_hard' => 'Very Hard',
        'extreme' => 'Extreme',
        'hell' => 'Hell',

        'category' => 'Map type',
        'map_type' => 'Map type',
        'classic' => 'Classic',
        'increasing_difficulty' => 'Increasing difficulty',
        'tournament' => 'Tournament',

        'mechanics' => 'Mechanics',
        'restrictions' => 'Restrictions',

        'playtest_status' => 'Only playtest',
        'only_true' => 'True',
        'only_false' => 'False',
        'completion_filter' => 'Only completions',
        'medal_filter' => 'Only medals',

        'participation_filter' => 'Participation filter',
        'participated_yes' => 'Participated',
        'participated_no' => 'Not participated',

        'apply_filters' => 'Apply filters',
        'clear_filters' => 'Clear filters',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TABLE HEADERS
    // ──────────────────────────────────────────────────────────────────────
    'table' => [
        'code' => 'Code',
        'map_name' => 'Name',
        'map_type' => 'Type',
        'creator' => 'Creator',
        'difficulty' => 'Difficulty',
        'checkpoints' => 'Checkpoints',
        'quality' => 'Quality',
        'medal_gold' => 'Gold',
        'medal_silver' => 'Silver',
        'medal_bronze' => 'Bronze',
        'details' => 'Details',
        'view' => 'View',
        'nickname' => 'Nickname',
        'time' => 'Time',
        'medal' => 'Medal',
        'video' => 'Video',
        'xp' => 'XP',
        'playtests_votes' => 'Playtest Votes',
        'mechanics' => 'Mechanics',
        'restrictions' => 'Restrictions',
        'description' => 'Description',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MESSAGES (confirmations, generic)
    // ──────────────────────────────────────────────────────────────────────
    'messages' => [
        'submit_record_confirm' => 'Your record was submitted successfully.',
        'submit_map_confirm' => 'Your map was submitted successfully.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // ERRORS (used in JS)
    // ──────────────────────────────────────────────────────────────────────
    'errors' => [
        'server_unreachable' => 'Server unreachable. Please try again.',
        'playtests_load_failed' => 'Failed to load playtests. Please try again later.',
        'image_type' => 'Invalid image type.',
        'image_too_large' => 'Image too large (max 8MB).',
        'upload_failed' => 'Upload failed.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // POPUP / MISC (used in JS)
    // ──────────────────────────────────────────────────────────────────────
    'popup' => [
        'no_results' => 'No results found.',
        'filter_applied' => 'Filter applied: {filterId} = {value}',
        'login_required_msg' => 'Please log in to use submit & playtest tools',
        'map_code_copied' => 'Map code copied to clipboard!',
        'click_to_copy_map_code' => 'Click to copy',
        'copied' => 'Copied!',
        'copy_failed' => 'Failed to copy.',
        'login' => 'Login',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PAGINATION
    // ──────────────────────────────────────────────────────────────────────
    'pagination' => [
        'first' => '« First',
        'prev' => '‹ Prev',
        'next' => 'Next ›',
        'last' => 'Last »',
        'page_of' => 'Page {current} of {total}',
    ],
];
