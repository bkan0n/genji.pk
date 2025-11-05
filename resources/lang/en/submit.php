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
        'select_quality'    => 'Select a quality (1–6)',
        'optional'          => 'Optional',
        'video'             => 'Video (URL)',
        'screenshot'        => 'Screenshot',
        'drag_and_drop'     => 'Drag & drop an image here, or click to upload',
        'cancel'            => 'Cancel',
        'submit_label'      => 'Submit record',

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
            'add_creator'       => 'Add creator',
            'search_creator'    => 'Search a creator…',
            'search_map_name'   => 'Search a map name…',
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
    // HELP MODALS (full texts for modals)
    // ──────────────────────────────────────────────────────────────────────
    'help_modal' => [
        'common' => [
            'title'       => 'Help',
            'close_label' => 'Close',
            'soon'        => 'Coming soon.',
        ],

        'rank_promotion' => [
            'how_to_submit' => [
                'title' => 'Rank promotion · How to submit?',
            ],
            'submission_rules' => [
                'title' => 'Rank promotion · Submission Rules',
            ],
            'rank_info_thresholds' => [
                'title' => 'Rank info & Thresholds',
            ],
            'medals_info_thresholds' => [
                'title' => 'Medals info & Thresholds',
            ],
        ],

        'how_to_submit' => [
            'title' => 'How to submit a map?',
            'intro' => 'This dialog walks you through every step of the “Submit map” section.',

            'meta' => [
                'title'        => '1) Metadata (map & creators)',
                'li_creator'   => 'Main creator: it is auto-filled from your session. You can change it (and add co-creators if the option is visible).',
                'li_code'      => 'Map code: click “Edit” next to the “Code” field. The code must be unique (we check if it already exists).',
                'li_name'      => 'Map name: click “Edit” next to “Map name” and pick a name via autocomplete.',
                'li_checkpoints'=> 'Checkpoints: click “Edit” and enter a strictly positive number.',
            ],

            'required' => [
                'title'        => '2) Required fields',
                'p1'           => 'These fields must be provided before you can submit:',
                'li_difficulty'=> 'Difficulty: choose a value (Easy → Hell).',
                'li_category'  => 'Category / Map type: choose a type (e.g., Classic, Increasing Difficulty).',
                'li_mechanics' => 'Mechanics: select at least one.',
                'li_restrictions'=> 'Restrictions: select at least one.',
            ],

            'medals' => [
                'title'  => '3) Medals (optional but validated if present)',
                'p1'     => 'You may define times (in seconds) for Gold, Silver, and Bronze.',
                'li_rules'   => 'If you set one medal, you must set all three.',
                'li_pattern' => 'Format: 1–5 digits, optionally “.” and 1–2 decimals (e.g., 5550.23). Non-negative values.',
                'li_order'   => 'Required ordering: Bronze > Silver > Gold (Bronze greater than Silver, which is greater than Gold).',
            ],

            'optional' => [
                'title'      => '4) Optional',
                'li_title'   => 'Title: short optional title (max 128 chars).',
                'li_banner'  => 'Custom banner: drag & drop or click to upload (JPG/PNG/WebP/AVIF), size ≤ 8MB. 16:9 recommended.',
                'li_description' => 'Description: free text (if empty, “N/A” is shown).',
                'li_guide'   => 'Guide URL(s): one URL per line. The first valid URL is used.',
            ],

            'submit' => [
                'title'           => '5) Submit',
                'li_validation'   => 'Click “Submit”. The form validates: main creator, unique code, map name, checkpoints > 0, difficulty, category, ≥1 mechanic and ≥1 restriction, and medal consistency if present.',
                'li_confirmation' => 'On success, a confirmation toast appears and the form resets.',
            ],

            'tips' => [
                'title'    => 'Tips',
                'li_edit'  => 'Fields with an “Edit” button can be quickly corrected inline.',
                'li_guest' => 'If you are not logged in, submission is locked and a “Login required” message is shown.',
                'li_support'=> 'If banner upload fails, try again (≤ 8MB) or contact support.',
            ],
        ],

        'playtesting_info' => [
            'title' => 'Playtesting Info',

            // — Overview / eligibility ---------------------------------------------------------
            'must_submit_completion' => 'You must have submitted a completion for the map to vote!',

            // — Rules -------------------------------------------------------------------------
            'rules' => [
                'title' => 'Playtesting rules',
                'needs_votes_and_completions' => 'Each difficulty requires a specific amount of votes and completion submissions.',
                'creator_cannot_vote' => 'Creators cannot vote for their own map; their map submission contains their best estimate of difficulty.',
                'playtesters_give_tips' => 'Playtesters will provide tips to the creator on how to improve the map, or what must change if there are glaring issues.',
            ],

            // — Process (4 phases + precise steps) -------------------------------------------
            'process' => [
                'title' => 'Process',

                // Phase labels
                'creation'     => 'Creation Phase',
                'testing'      => 'Testing Phase',
                'verification' => 'Verification Phase',
                'acceptance'   => 'Acceptance',

                // Steps (exact labels from the diagram)
                'steps' => [
                    'map_is_made'                               => 'Map is made',
                    'map_submission_form'                       => 'Map submission form',

                    'creator_suggests_difficulty'               => 'Creator suggests difficulty',
                    'testers_submit_completion'                 => 'Testers submit completion',
                    'testers_vote_on_difficulty'                => 'Testers vote on difficulty',
                    'creator_finalizes_submission'              => 'Creator finalizes submission',

                    'sensei_receive_submission_notification'    => 'Sensei receive submission notification',
                    'sensei_approval'                           => 'Sensei approval',
                    'accept'                                    => 'accept',
                    'reject'                                    => 'reject',
                    'map_sent_back_previous_step'               => 'Map is sent back to a previous step*',

                    'map_accepted'                              => 'Map accepted',
                    'map_added_to_pool'                         => 'Map added to map pool',
                    'testers_granted_completion_without_time'   => 'Testers granted completion (without time)',
                ],

                // Notes under/around the diagram
                'notes' => [
                    'change_only_by_sensei' => 'Changing map details can only be done via a Sensei (restrictions, code, etc.).',
                    'sensei_power'          => 'At any point, a Sensei has the ability to manually force any outcome or revert to any step.',
                    'verification_removal'  => '* Completions and votes may be removed at this step.',
                ],
            ],

            // — Required votes table ----------------------------------------------------------
            'votes' => [
                'title' => 'Required votes',
                'votes' => 'votes',
                'vote'  => 'vote',

                // Row labels (left column)
                'beginner_to_hard' => 'Beginner → Hard',
                'very_hard'        => 'Very Hard',
                'extreme'          => 'Extreme',
                'hell'             => 'Hell',

                // Right column if you want to render counts via i18n (optional)
                'counts' => [
                    'beginner_to_hard' => '5 votes',
                    'very_hard'        => '3 votes',
                    'extreme'          => '2 votes',
                    'hell'             => '1 vote',
                ],
            ],
        ],

        'difficulty_techs_info' => [
            'title'        => 'Difficulty & Techs',
            'legend_title' => 'Legend',
            'legend' => [
                'lv1_title' => 'Simple / priority use',
                'lv1_desc'  => 'Simple and easy use of the technique with priority on it.',
                'lv2_title' => 'Common / sometimes advanced',
                'lv2_desc'  => 'Frequent use of the common technique and rare use of advanced forms.',
                'lv3_title' => 'Advanced / demanding',
                'lv3_desc'  => 'Complex and demanding use of the technique.',
            ],
            'matrix_title' => 'Techniques by difficulty',

            // Optional local labels (used as fallback if you don’t want to reuse filters.*)
            'labels' => [
                'beginner'  => 'Beginner',
                'easy'      => 'Easy',
                'medium'    => 'Medium',
                'hard'      => 'Hard',
                'very_hard' => 'Very Hard',
                'extreme'   => 'Extreme',
                'hell'      => 'Hell',
            ],

            // Technique names (rows)
            'techs' => [
                'basics'        => 'Basics*',
                'bhop'          => 'Bhop**',
                'edge_climb'    => 'Edge Climb',
                'stall'         => 'Stall',
                'crouch_edge'   => 'Crouch Edge',
                'save_climb'    => 'Save Climb',
                'distance_edge' => 'Distance Edge',
                'high_edge'     => 'High Edge',
                'multi_climb'   => 'Multi Climb',
                'create_bhop'   => 'Create Bhop',
            ],

            // Footnotes
            'notes' => [
                'star'        => 'Double Jump / Slide / Wall Climb',
                'double_star' => 'Late Bhop / First Bhop / Emote Savebhop / Deathbhop',
            ],
        ],

        'rank_promotion' => [
            'how_to_submit' => [
                'title' => 'Rank promotion · How to submit?',
                'intro' => 'To request a rank promotion, you must submit a completion (“record”) on a valid map and provide a quality rating.',

                'requirements' => [
                    'title' => 'Requirements',
                    'map_in_pool'   => 'Complete a Genji Parkour map that is in the current map pool.',
                    'map_code_note' => "Note: Maps that aren't currently accepted won't appear in the map code field.",
                ],

                'steps' => [
                    'title'            => 'Steps',
                    'open_tab'         => 'Open the “Submit completion” tab.',
                    'enter_code'       => 'Enter the map code and your record time.',
                    'upload_screenshot'=> 'Upload a screenshot (required) and optionally a video URL.',
                    'select_quality'   => 'Select a quality rating (1–6).',
                    'submit'           => 'Click “Submit record”.',
                    'verification'     => 'Your submission will go through a verification process.',
                    'notification'     => "Once verified, you'll receive a notification.",
                ],

                'quality' => [
                    'title' => 'Quality rating scale',
                    'six'   => '6: Excellent',
                    'five'  => '5: Great',
                    'four'  => '4: Good',
                    'three' => '3: Average',
                    'two'   => '2: Subpar',
                    'one'   => '1: Poor',
                ],
            ],

            'submission_rules' => [
                'title' => 'Submission Rules',

                'completion' => [
                    'title' => 'Completion Requirements/Guidelines',
                    'li_code_match'   => 'Map code in the screenshot must match the map code in the bot.',
                    'li_time_display' => 'Time must be displayed in either the Top 5 leaderboard or as the announcement in the middle of the screen. For video submissions, it must show both.',
                    'li_no_edit_map'  => 'You cannot edit the map in any way using Custom Game settings, Workshop Settings, or any other Workshop code. This includes but is not limited to changing tech bans, gravity, etc.',
                    'li_no_scripts'   => 'You are not allowed to use scripts, macros, or anything similar to complete any portion of a map.',
                    'li_no_banned_tech' => 'You may not use a banned tech (restricted via map author / listed in @GenjiBot#9209) where the ban is non-functional due to Workshop bugs.',
                ],

                'records' => [
                    'title' => 'Records Only',
                    'li_time_visible' => 'Time must be fully visible from 0.00 to the finish. Do not fade in or out while the timer is running.',
                    'li_video_required' => 'Video proof is required for World Records and Medals.',
                    'li_no_cuts' => 'Cuts in the video are not allowed (between 0.00 and finish).',
                    'li_sound_not_required' => 'Game sound is not required.',
                    'li_editing_ok_but_no_interfere' => 'Editing before and after is allowed, but it cannot interfere with the timer or any ability to validate the submission.',
                ],

                'reserve_rights' => 'Senseis reserve the right to deny any submission for any reason, regardless if it is listed here or not.',
            ],
            'rank_info_thresholds' => [
                'title' => 'Rank info & Thresholds',

                'info' => [
                    'title' => 'Ranks Info',
                    'li_no_order'   => 'Ranks do not need to be acquired in order.',
                    'li_requirement' => 'To receive a rank you must complete the required amount of maps for that difficulty/rank.',
                    'li_thresholds'  => 'See chart below for rank thresholds.',
                ],

                'table' => [
                    'title' => 'Rank & Difficulty chart',
                    'completions_label' => 'completions',
                    'na' => 'N/A',
                ],

                'rows' => [
                    'ninja' => [
                        'name'  => 'Ninja',
                        'image' => '/assets/ranks/ninja.webp',
                    ],
                    'jumper' => [
                        'name'  => 'Jumper',
                        'image' => '/assets/ranks/jumper.webp',
                    ],
                    'skilled' => [
                        'name'  => 'Skilled',
                        'image' => '/assets/ranks/skilled.webp',
                    ],
                    'pro' => [
                        'name'  => 'Pro',
                        'image' => '/assets/ranks/pro.webp',
                    ],
                    'master' => [
                        'name'  => 'Master',
                        'image' => '/assets/ranks/master.webp',
                    ],
                    'grand_master' => [
                        'name'  => 'Grand Master',
                        'image' => '/assets/ranks/grandmaster.webp',
                    ],
                    'god' => [
                        'name'  => 'God',
                        'image' => '/assets/ranks/god.webp',
                    ],
                ],
            ],

            'medals_info_thresholds' => [
                'title' => 'Medals info & Thresholds',

                'info' => [
                    'title' => 'Medals Info',
                    'li_plus_explain' => 'To get a +, ++ or +++ rank, you must obtain the same amount of Bronze, Silver, or Gold medals as the rank normally requires (see chart below).',
                    'li_time_and_video_required' => 'You must post a completion which includes a time and a video URL showing your run.',
                    'li_icon_next_to_name' => 'You will get an icon next to your name if you have a plus (+, ++, +++) rank!',
                    'li_auto_receive' => "Once verified, you'll automatically receive your medal.",
                    'li_retroactive_credit' => 'If medals are added to a map after you have already submitted, you will still get credit.',
                ],

                'table' => [
                    'title' => 'Medal thresholds by difficulty',
                    'medal_bronze' => 'Bronze',
                    'medal_silver' => 'Silver',
                    'medal_gold'   => 'Gold',
                    'completions_label' => 'medals',
                    'na' => 'N/A',
                ],

                'images' => [
                    'gold'   => '/assets/medals/gold.png',
                    'silver' => '/assets/medals/silver.png',
                    'bronze' => '/assets/medals/bronze.png',
                ],
            ],
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PLAYTEST (shared modal/labels)
    // ──────────────────────────────────────────────────────────────────────
    'playtest' => [
        'title_suffix'         => 'is requesting playtest feedback',
        'votes'                => 'Votes',
        'difficulty_rating'    => 'Difficulty rating',
        'rating_sub'           => 'Based on community votes',
        'question_difficulty'  => 'Vote map difficulty',
        'complete_to_vote'     => 'Submit a completion to be able to vote',
        'vote_recorded'        => 'Your vote has been submitted',
        'vote_updated'         => 'Your vote has been updated',
        'no_votes'             => 'No votes yet',
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
    // ERRORS (used in JS)
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
