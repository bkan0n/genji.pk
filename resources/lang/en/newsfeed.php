<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Newsfeed (EN)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // HEADER
    // ──────────────────────────────────────────────────────────────────────
    'title' => 'Newsfeed',
    'subtitle' => 'updates · records · guides · announcements',

    // ──────────────────────────────────────────────────────────────────────
    // SEARCH & RESET
    // ──────────────────────────────────────────────────────────────────────
    'search_placeholder' => 'Search posts, tags, authors…',
    'reset' => 'Reset',

    // ──────────────────────────────────────────────────────────────────────
    // TABS
    // ──────────────────────────────────────────────────────────────────────
    'tabs' => [
        'newsfeed' => 'Newsfeed',
        'completions' => 'Completions',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TAGS
    // ──────────────────────────────────────────────────────────────────────
    'tags' => [
        'all' => 'All',
        'announcement'    => 'Announcement',
        'guide'           => 'Guide',
        'new_map'         => 'New map',
        'role'            => 'Role',
        'record'          => 'Record',
        'map_edit'        => 'Map edit',
        'legacy_record'   => 'Legacy record',
        'archive'         => 'Archive',
        'unarchive'       => 'Unarchive',
        'bulk_archive'    => 'Bulk archive',
        'bulk_unarchive'  => 'Bulk unarchive',
        'linked_map'      => 'Linked map',
        'unlinked_map'    => 'Unlinked map',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // SIDEBAR
    // ──────────────────────────────────────────────────────────────────────
    'sidebar' => [
        'community_picks' => 'Community Picks',
        'see_all' => 'See all →',
        'changelogs' => 'Changelogs',
        'submit_title' => 'Submit your map',
        'submit_desc' => 'Share your creation and get feedback from the community.',
        'submit_cta' => 'Submit',
        'upvotes' => 'Upvotes',
        'details' => 'Details',
        'copy_code' => 'Copy code',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // EMPTY STATE
    // ──────────────────────────────────────────────────────────────────────
    'empty' => [
        'title' => 'No posts match your filters',
        'subtitle' => 'Try changing the tag or search terms.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // ACTIONS
    // ──────────────────────────────────────────────────────────────────────
    'load_more' => 'Load more',

    // ──────────────────────────────────────────────────────────────────────
    // TABLE HEADERS (shared)
    // ──────────────────────────────────────────────────────────────────────
    'thead' => [
        'mapCheckpoints' => 'Checkpoints',
        'mapQuality' => 'Quality',
        'mapDetails' => 'Details',
        'mapMechanics' => 'Mechanics',
        'mapRestrictions' => 'Restrictions',
        'mapDescription' => 'Description',
        'mapCategory' => 'Category',
        'mapCreators' => 'Creators',
        'mapMedals' => 'Medals',
    ],

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
        'reason' => 'Reason',
        'not_found' => 'Not found',
        'video_embed_failed' => 'The video cannot be embedded.',
        'bot' => 'BOT',
        'upvote' => 'Upvote',
        'missing_ids' => 'Missing user or message id',
        'empty' => 'Empty',
        'created_at' => 'Created at',
        'updated_at' => 'Updated at',
        'medals' => [
            'gold' => 'Gold',
            'silver' => 'Silver',
            'bronze' => 'Bronze',
        ],
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

    // ──────────────────────────────────────────────────────────────────────
    // MECHANICS
    // ──────────────────────────────────────────────────────────────────────
    'mechanics' => [
        'edge_climb' => 'Edge Climb',
        'bhop' => 'Bhop',
        'crouch_edge' => 'Crouch Edge',
        'save_climb' => 'Save Climb',
        'bhop_first' => 'Bhop First',
        'high_edge' => 'High Edge',
        'distance_edge' => 'Distance Edge',
        'quick_climb' => 'Quick Climb',
        'slide' => 'Slide',
        'stall' => 'Stall',
        'dash' => 'Dash',
        'ultimate' => 'Ultimate',
        'emote_save_bhop' => 'Emote Save Bhop',
        'death_bhop' => 'Death Bhop',
        'triple_jump' => 'Triple Jump',
        'multi_climb' => 'Multi Climb',
        'vertical_multi_climb' => 'Vertical Multi Climb',
        'create_bhop' => 'Create Bhop',
        'standing_create_bhop' => 'Standing Create Bhop',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // RESTRICTIONS
    // ──────────────────────────────────────────────────────────────────────
    'restrictions' => [
        'dash_start' => 'Dash Start',
        'triple_jump' => 'Triple Jump',
        'emote_save_bhop' => 'Emote Save Bhop',
        'death_bhop' => 'Death Bhop',
        'multi_climb' => 'Multi Climb',
        'standing_create_bhop' => 'Standing Create Bhop',
        'create_bhop' => 'Create Bhop',
        'wall_climb' => 'Wall Climb',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // NEWSFEED MESSAGES
    // ──────────────────────────────────────────────────────────────────────
    'newsfeed' => [
        'new_wr' => '{nickname} has set a new World Record!',
        'new_wr_info' => '{map_name} by {creators} ({map_code})',
        'promoted' => '{nickname} got promoted!',
        'new_map' => '{nickname} has submitted a new {difficulty} map on {map_name}!',
        'has_posted_guide' => '{nickname} has posted a guide for {map_code}',
        'watch_guide' => 'Watch guide',
        'changed_code' => '{map_code} has been changed:',
        'details_command' => 'Use the command',
        'click_here' => 'Click here',
        'link' => 'Link',
        'copy_code' => 'Map code copied : {code}',
        'copy_clipboard' => 'Command has been copied to clipboard',
        'copy_clipboard_error' => 'Failed to copy command to clipboard',
        'announcement' => 'New announcement',
        'search_by_filter' => 'Search by',
        'map_edit_filter' => 'Map edit',
        'guide_filter' => 'Guide',
        'new_map_filter' => 'New map',
        'role_filter' => 'Role',
        'record_filter' => 'Record',
        'reset_filter' => 'Reset filter',
        'translate_button' => 'Translate',
        'archived_map' => '{map_code} has been archived',
        'unarchived_map' => '{map_code} has been archived',
        'archived_description' => 'This map will not appear in the map search unless searched by map code. You cannot submit records for archived maps',
        'unarchived_description' => 'This map is visible in search and eligible for record submissions',
        'creator' => 'Creator',
        'map_code' => 'Map code',
        'difficulty' => 'Difficulty',
        'bulk_archived' => 'Multiple maps have been archived',
        'bulk_unarchived' => 'Multiple maps have been unarchived',
        'official' => 'Official',
        'details' => 'Details',
        'changes' => 'Changes',
        'map_name' => 'Map name',
        'status_unarchived' => 'Unarchived',
        'status_archived' => 'Archived',
        'guide_badge' => 'Guide',
        'converted_to_legacy' => 'Converted to legacy',
        'legacy' => 'Legacy',
        'affected' => 'Affected',
        'reason' => 'Reason',
        
        'no_changes' => 'No changes.',
        'map_updated' => '{map_code} was updated',
        'record_label' => 'Record',
        'video_label' => 'Video',
        'translation_failed' => 'Translation failed.',
        'translation_error' => 'Error occurred during translation.',
        'linked_map_title' => 'Linked map codes',
        'playtest_id' => 'Playtest ID: :id',
        'official_code' => 'Official code',
        'unofficial_code' => 'Unofficial code',
        'linked_map_hint' => 'These two map codes are now linked together.',
        'unlinked_map_title' => 'Unlinked map codes',
        "unlinked_map_hint" => 'These two map codes are no longer linked.',
        "unlinked_map_partial" => 'One of the codes is missing.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // COMPLETIONS
    // ──────────────────────────────────────────────────────────────────────
    'completions' => [
        'new_submission_from' => 'New Submission from {nickname}',
        'watch' => 'Watch',
        'open_screenshot' => 'Open screenshot',
        'screenshot_alt' => 'Screenshot',
        'upvote_failed' => 'Upvote failed',

        'kv' => [
            'code' => 'Code',
            'map' => 'Map',
            'difficulty' => 'Difficulty',
            'time' => 'Time',
            'aka' => 'Also Known As',
        ],

        'status' => [
            'verified_screenshot' => 'Verified screenshot submission! A clear has been confirmed without video proof.',
            'verified_completion_video' => 'Verified completion with video proof.',
            'pending_review' => 'Submission pending review.',
            'verified_record' => 'Verified record / time.',
            'under_review' => 'Submission under review.',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // CHANGELOGS
    // ──────────────────────────────────────────────────────────────────────
    'changelogs' => [
        'title' => 'Changelogs',
        'latest' => 'Latest',
        'view_on_github' => 'View on GitHub',
        'none' => 'No changelogs available.',
        'fetch_failed' => 'Failed to load changelogs.',
        'release' => 'Release',
    ],
];