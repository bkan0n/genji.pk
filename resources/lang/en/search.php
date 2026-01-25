<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Search (EN)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // META / PAGE
    // ──────────────────────────────────────────────────────────────────────
    'page_title' => 'Search',
    'og_title' => 'Genji Parkour - Search',
    'og_description' => 'Find maps, completions, guides and personal records.',

    // ──────────────────────────────────────────────────────────────────────
    // HEADER
    // ──────────────────────────────────────────────────────────────────────
    'title' => 'Maps',
    'subtitle' => 'search · completions · guides · personal records',

    // ──────────────────────────────────────────────────────────────────────
    // TABS
    // ──────────────────────────────────────────────────────────────────────
    'map_search' => 'Map Search',
    'completions' => 'Completions',
    'guides' => 'Guides',
    'personal_records' => 'Personal Records',

    // ──────────────────────────────────────────────────────────────────────
    // TOOLBAR & HELPERS
    // ──────────────────────────────────────────────────────────────────────
    'select_mode' => 'Select a search mode',
    'add_filter_hint' => 'Add a filter or click ✔',
    'screenshot' => 'Screenshot',
    'open_screenshot' => 'Open screenshot',
    'no_description' => 'No description',
    'watch' => 'Watch',
    'na' => 'N/A',

    // ──────────────────────────────────────────────────────────────────────
    // PLACEHOLDERS
    // ──────────────────────────────────────────────────────────────────────
    'map_name_placeholder' => 'Map Name',
    'map_code_placeholder' => 'Map Code',
    'nickname_placeholder' => 'Nickname',
    'completion' => 'Completion',

    // ──────────────────────────────────────────────────────────────────────
    // UNOFFICIAL NOTICE
    // ──────────────────────────────────────────────────────────────────────
    'unofficial_notice' => [
        'title' => 'Unofficial code search',
        'li1'   => 'Unofficial codes are playable only on CN servers.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FILTERS TOOLBAR (UI toolbar options)
    // ──────────────────────────────────────────────────────────────────────
    'filters_toolbar' => [
        'creator'               => 'Creator',
        'enter_creator'         => 'Enter creator',
        'map_name'              => 'Map name',
        'enter_map_name'        => 'Enter map name',
        'user'                  => 'User name',
        'enter_nickname'        => 'Enter user name',
        'code'                  => 'Map code',
        'enter_map_code'        => 'Enter map code',
        'difficulty_exact'      => 'Difficulty',
        'beginner'              => 'Beginner',
        'easy'                  => 'Easy',
        'medium'                => 'Medium',
        'hard'                  => 'Hard',
        'very_hard'             => 'Very Hard',
        'extreme'               => 'Extreme',
        'hell'                  => 'Hell',
        'category'              => 'Map type',
        'classic'               => 'Classic',
        'increasing_difficulty' => 'Increasing difficulty',
        'tournament'            => 'Tournament',
        'mechanics'             => 'Mechanics',
        'restrictions'          => 'Restrictions',
        'playtest_status'       => 'In Playtest',
        'in_progress'           => 'In Progress',
        'approved'              => 'Approved',
        'only_true'             => 'True',
        'only_false'            => 'False',
        'playtest_filter'       => 'Playtest',
        'playtest_all'          => 'All',
        'playtest_only'         => 'Only',
        'playtest_none'         => 'None',
        'completion_filter'     => 'Completed',
        'medal_filter'          => 'Medals',
        'participation_filter'  => 'Participation filter',
        'participated_yes'      => 'Participated',
        'participated_no'       => 'Not participated',
        'official'              => 'Official',
        'server'                => 'Server',
        'global_server'         => 'Global',
        'china_server'          => 'China',
        'apply_filters'         => 'Apply filters',
        'clear_filters'         => 'Clear filters',
        'tags'                  => 'Tags',
        'sort'                  => 'Sort',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FILTERS (common labels used across views)
    // ──────────────────────────────────────────────────────────────────────
    'filters' => [
        'map_name' => 'Map Name',
        'map_code' => 'Map Code',
        'difficulty' => 'Map Difficulty',
        'creator' => 'Map Creator',
        'mechanics' => 'Mechanics',
        'restrictions' => 'Restrictions',
        'only_playtest' => 'Only Playtest',
        'only_maps_with_medals' => 'Only Medals',
        'ignore_completions' => 'Only Completions',
        'player_name' => 'Player Name',
    ],

    'card' => [
        'completed'     => 'Completed',
        'not_completed' => 'Not completed',
        'mapped_by'     => 'Creator(s)',
        'like'          => 'Like',
        'official'      => 'Official',
        'unofficial'    => 'Unofficial',
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
    // MAP TYPE
    // ──────────────────────────────────────────────────────────────────────
    'map_type' => [
        'classic' => 'Classic',
        'increasing_difficulty' => 'Increasing Difficulty',
        'tournament' => 'Tournament',
        'practice' => 'Practice',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MAP NAME (canonical list)
    // ──────────────────────────────────────────────────────────────────────
    'map_name' => [
        'aatlis' => 'Aatlis',
        'ayutthaya' => 'Ayutthaya',
        'black_forest' => 'Black Forest',
        'blizzard_world' => 'Blizzard World',
        'busan' => 'Busan',
        'castillo' => 'Castillo',
        'chateau_guillard' => 'Chateau Guillard',
        'circuit_royal' => 'Circuit Royal',
        'colosseo' => 'Colosseo',
        'dorado' => 'Dorado',
        'ecopoint_antarctica' => 'Ecopoint: Antarctica',
        'eichenwalde' => 'Eichenwalde',
        'esperanca' => 'Esperanca',
        'hanamura' => 'Hanamura',
        'havana' => 'Havana',
        'hollywood' => 'Hollywood',
        'horizon_lunar_colony' => 'Horizon Lunar Colony',
        'ilios' => 'Ilios',
        'junkertown' => 'Junkertown',
        'kanezaka' => 'Kanezaka',
        'kings_row' => 'King\'s Row',
        'lijiang_tower' => 'Lijiang Tower',
        'malevento' => 'Malevento',
        'midtown' => 'Midtown',
        'necropolis' => 'Necropolis',
        'nepal' => 'Nepal',
        'new_queen_street' => 'New Queen Street',
        'numbani' => 'Numbani',
        'oasis' => 'Oasis',
        'paraiso' => 'Paraiso',
        'paris' => 'Paris',
        'petra' => 'Petra',
        'practice_range' => 'Practice Range',
        'rialto' => 'Rialto',
        'route_66' => 'Route 66',
        'temple_of_anubis' => 'Temple of Anubis',
        'volskaya_industries' => 'Volskaya Industries',
        'watchpoint_gibraltar' => 'Watchpoint: Gibraltar',
        'workshop_chamber' => 'Workshop Chamber',
        'workshop_expanse' => 'Workshop Expanse',
        'workshop_green_screen' => 'Workshop Green Screen',
        'workshop_island' => 'Workshop Island',
        'framework' => 'Framework',
        'tools' => 'Tools',
        'shambali' => 'Shambali',
        'chateau_guillard_halloween' => 'Chateau Guillard (Halloween)',
        'eichenwalde_halloween' => 'Eichenwalde (Halloween)',
        'hollywood_halloween' => 'Hollywood (Halloween)',
        'black_forest_winter' => 'Black Forest (Winter)',
        'blizzard_world_winter' => 'Blizzard World (Winter)',
        'ecopoint_antarctica_winter' => 'Ecopoint: Antarctica (Winter)',
        'hanamura_winter' => 'Hanamura (Winter)',
        'kings_row_winter' => 'King\'s Row (Winter)',
        'busan_lunar_new_year' => 'Busan (Lunar New Year)',
        'lijiang_tower_lunar_new_year' => 'Lijiang Tower (Lunar New Year)',
        'antarctic_peninsula' => 'Antarctic Peninsula',
        'suravasa' => 'Suravasa',
        'new_junk_city' => 'New Junk City',
        'samoa' => 'Samoa',
        'hanaoka' => 'Hanaoka',
        'runasapi' => 'Runasapi',
        'throne_of_anubis' => 'Throne of Anubis',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MAP EDIT REQUEST
    // ──────────────────────────────────────────────────────────────────────
    'map_edit_request' => [
        'title' => 'Map edit request',
        'subtitle' => 'Propose changes to a map',

        'map_edit_btn' => 'Create a map edit request',
        'map_edit_btn_login' => 'Login to create a map edit request',

        'code' => 'Code',
        'created_by' => 'Created by',
        'reason' => 'Reason',
        'reason_placeholder' => 'Explain why you want to change this map…',

        'send' => 'Send map edit request',
        'close' => 'Close',

        'proposed_changes' => 'Proposed changes',
        'proposed_hint' => 'Only changed fields will be sent',

        'official' => 'Official',
        'unofficial' => 'Unofficial',
        'visible' => 'Visible',
        'hidden' => 'Hidden',
        'active' => 'Active',
        'archived' => 'Archived',

        'new_code' => 'New code',
        'new_code_placeholder' => 'Leave empty to keep current',

        'map_name' => 'Map name',
        'checkpoints' => 'Checkpoints',
        'creators' => 'Creators',

        'creator_search' => 'Search a user…',
        'creator_hint' => 'Select users to add. First creator is primary.',

        'select' => 'Select…',
        'selected_count' => '{count} selected',

        'category' => 'Category',
        'difficulty' => 'Difficulty',
        'mechanics' => 'Mechanics',
        'restrictions' => 'Restrictions',

        'optional_title' => 'Title',
        'custom_banner' => 'Custom banner',
        'drag_and_drop' => 'Drag & drop or click to upload',
        'banner_hint' => 'Recommended 16:9. JPG/PNG/WebP/AVIF, max 10MB.',
        'remove' => 'Remove',

        'optional_description' => 'Description',
        'medal_gold' => 'Gold medal',
        'medal_silver' => 'Silver medal',
        'medal_bronze' => 'Bronze medal',

        'uploading' => 'Uploading…',
        'uploaded' => 'Uploaded',

        'login_required' => 'You must be logged in to send a map edit request.',
        'reason_required' => 'Please provide a reason.',
        'sending' => 'Sending…',
        'sent' => 'Map edit request sent ✅',

        'na' => 'N/A',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // POPUP / MISC
    // ──────────────────────────────────────────────────────────────────────
    'popup' => [
        'login_required_btn' => 'Login required',
        'login_required_msg' => 'Login is required on this page',
        'login_required_pr' => 'Login is required to use this functionality',
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
        'copy_map_code' => 'Copy map code',
        'map_code_copied' => 'Map code copied: {code}',
        'copy_failed' => 'Failed to copy map code',
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
    // CHARTS
    // ──────────────────────────────────────────────────────────────────────
    'chart' => [
        'mapDifficultyDistribution' => 'Map difficulty Distribution',
        'amountOfMaps' => 'Amount of maps',
        'difficultyLevel' => 'Difficulty level',
        'popularCreators' => 'Map creators by Average quality',
        'mapAmountLogScale' => 'Amount of maps (Log Scale)',
        'averageQuality' => 'Average quality',
        'topMapsFor' => 'Most popular maps for difficulty {difficulty}',
        'mapCodes' => 'Map codes',
        'completions' => 'Completions',
        'rank' => 'Rank',
        'playersIn' => 'Players in {tier}',
        'map' => 'Maps',
        'quality' => 'Quality',
        'completionsTooltip' => '{map}: {completions} Completions, Quality: {quality}',
        'playersInTier' => '{amount} players in {tier}',
        'tooltipLabel' => '{creator} - Maps : {mapCount}, Quality : {quality}',
        'tierRank' => 'Tier rank',
        'skillRank' => 'Skill rank',
        'easy' => 'Easy',
        'medium' => 'Medium',
        'hard' => 'Hard',
        'very hard' => 'Very Hard',
        'extreme' => 'Extreme',
        'hell' => 'Hell',
        'mapsTooltip' => '{count} maps',
        'record_progression_time' => 'Record progression over time',
        'user_record_progression' => 'Your progression',
        'average_time' => 'Average time',
        'min_time' => 'Minimum time',
        'max_time' => 'Maximum time',
        'amount' => 'Amount',
        'quantity' => 'Quantity',
        'total_amount_time' => 'Total in hours',
        'time_played_per_difficulty' => 'Time played per difficulty',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TABLE HEADERS
    // ──────────────────────────────────────────────────────────────────────
    'thead' => [
        'mapCode' => 'Code',
        'unofficialCode' => 'Unofficial code',
        'officialCode' => 'Official code',
        'mapName' => 'Name',
        'mapType' => 'Type',
        'mapCreator' => 'Creator',
        'mapDifficulty' => 'Difficulty',
        'mapCheckpoints' => 'Checkpoints',
        'mapQuality' => 'Quality',
        'mapGold' => 'Gold',
        'mapSilver' => 'Silver',
        'mapBronze' => 'Bronze',
        'mapDetails' => 'Details',
        'mapView' => 'View',
        'mapNickname' => 'Nickname',
        'mapDiscordTag' => 'Discord Tag',
        'mapTime' => 'Time',
        'mapMedal' => 'Medal',
        'mapVideo' => 'Video',
        'mapXP' => 'XP',
        'mapSkillRank' => 'Skill Rank',
        'mapWR' => 'World Records',
        'mapMade' => 'Maps Made',
        'mapPlaytestsVotes' => 'Playtest Votes',
        'mapTierRank' => 'Tier',
        'mapRankDistribution' => 'Ranks distribution',
        'mapMechanics' => 'Mechanics',
        'mapRestrictions' => 'Restrictions',
        'mapDescription' => 'Description',
        'mapUpvotes' => 'Upvotes',
        'mapVerified' => 'Verified',
        'mapStatus' => 'Status',
        'mapTags' => 'Map tags',
    ],
];
