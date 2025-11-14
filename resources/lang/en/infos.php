<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Infos (EN)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // META (PAGE <HEAD>)
    // ──────────────────────────────────────────────────────────────────────
    'meta' => [
        'title' => 'Genji Parkour - Infos & Rules',
        'og' => [
            'title'       => 'Genji Parkour · Infos & Rules',
            'description' => 'Learn how rank promotions, medals, playtesting, map submissions, and difficulty tiers work in Genji Parkour.',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // HERO
    // ──────────────────────────────────────────────────────────────────────
    'hero' => [
        'badge'    => 'Rules · Ranks · Help',
        'title'    => 'Information & rules',
        'subtitle' => 'rank up · playtesting · submit maps & completions · techniques',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TABS
    // ──────────────────────────────────────────────────────────────────────
    'tabs' => [
        'ranking_process'  => 'Ranking process',
        'ranks_threshold'  => 'Ranks threshold',
        'playtesting'      => 'Playtesting',
        'submit_map'       => 'Map submissions',
        'techs'            => 'Techs & difficulties',
    ],


    /*
    |--------------------------------------------------------------------------
    | HELP MODAL TRANSLATIONS (infos.help_modal.*)
    |--------------------------------------------------------------------------
    */
    'help_modal' => [

        // ──────────────────────────────────────────────────────────────────────
        // Common
        // ──────────────────────────────────────────────────────────────────────
        'common' => [
            'soon' => 'Coming soon.',
        ],

        // ──────────────────────────────────────────────────────────────────────
        // Rank Promotion
        // ──────────────────────────────────────────────────────────────────────
        'rank_promotion' => [

            // ──────────────────────────────────────────────────────────────
            // HOW TO SUBMIT (RANK PROMOTION COMPLETION)
            // ──────────────────────────────────────────────────────────────
            'how_to_submit' => [
                'title' => 'How to rank up',
                'intro' => 'To rank up, you must submit completions (records) on a valid maps and provide a quality rating.',

                'requirements' => [
                    'title'         => 'Requirements',
                    'map_in_pool'   => 'Complete a Genji Parkour map that is in the current map pool.',
                    'map_code_note' => 'Note: Maps that aren\'t currently accepted won\'t appear in the map code field.',
                ],

                'steps' => [
                    'title'             => 'Steps',
                    'open_tab'          => 'Open the “Submit completion” tab.',
                    'enter_code'        => 'Enter the map code and your record time.',
                    'upload_screenshot' => 'Upload a screenshot (required) and optionally a video URL.',
                    'select_quality'    => 'Select a quality rating (1–6).',
                    'submit'            => 'Click “Submit record”.',
                    'verification'      => 'Your submission will go through a verification process.',
                    'notification'      => 'Once verified, you\'ll receive a notification.',
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

            // ──────────────────────────────────────────────────────────────
            // SUBMISSION RULES (FOR RANK PROMOTION / RECORDS)
            // ──────────────────────────────────────────────────────────────
            'submission_rules' => [
                'title' => 'Rank submission rules',

                'completion' => [
                    'title'             => 'Completion Requirements/Guidelines',
                    'li_code_match'     => 'Map code in the screenshot must match the map code in the bot/website.',
                    'li_time_display'   => 'Time must be displayed in either the Top 5 leaderboard or as the announcement in the middle of the screen. For video submissions, it must show both.',
                    'li_no_edit_map'    => 'You cannot edit the map in any way using Custom Game settings, Workshop Settings, or any other Workshop code. This includes but is not limited to changing tech bans, gravity, etc.',
                    'li_no_scripts'     => 'You are not allowed to use scripts, macros, or anything similar to complete any portion of a map.',
                    'li_no_banned_tech' => 'You may not use a banned tech (restricted via map author / listed in @GenjiBot#9209) where the ban is non-functional due to Workshop bugs.',
                ],

                'records' => [
                    'title'                         => 'Videos Records',
                    'li_time_visible'               => 'Time must be fully visible from 0.00 to the finish. Do not fade in or out while the timer is running.',
                    'li_video_required'             => 'Video proof is required for World Records and Medals.',
                    'li_no_cuts'                    => 'Cuts in the video are not allowed (between 0.00 and finish).',
                    'li_sound_not_required'         => 'Game sound is not required.',
                    'li_editing_ok_but_no_interfere'=> 'Editing before and after is allowed, but it cannot interfere with the timer or any ability to validate the submission.',
                ],

                'reserve_rights' => 'Senseis reserve the right to deny any submission for any reason, regardless if it is listed here or not.',
            ],

            // ──────────────────────────────────────────────────────────────
            // RANK INFO & THRESHOLDS
            // ──────────────────────────────────────────────────────────────
            'rank_info_thresholds' => [
                'info' => [
                    'title'       => 'Ranks Info',
                    'subtitle'    => 'How ranks relate to difficulties and how many maps are needed.',
                    'li_no_order' => 'Ranks do not need to be acquired in order.',
                    'li_requirement' => 'To receive a rank you must complete the required amount of maps for that difficulty/rank.',
                    'li_thresholds'  => 'See chart below for rank thresholds.',
                ],

                'table' => [
                    'title'             => 'Rank & Difficulty chart',
                    'completions_label' => 'completions',
                    'na'                => 'N/A',
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

            // ──────────────────────────────────────────────────────────────
            // MEDALS INFO & THRESHOLDS
            // ──────────────────────────────────────────────────────────────
            'medals_info_thresholds' => [
                'info' => [
                    'title'                     => 'Medals Info',
                    'subtitle'                  => 'How +, ++ and +++ ranks are obtained with medals.',
                    'li_plus_explain'           => 'To get a +, ++ or +++ rank, you must obtain the same amount of Bronze, Silver, or Gold medals as the rank normally requires (see chart below).',
                    'li_time_and_video_required'=> 'You must post a completion which includes a time and a video URL showing your run.',
                    'li_icon_next_to_name'      => 'You will get an icon next to your name if you have a plus (+, ++, +++) rank!',
                    'li_auto_receive'           => 'Once verified, you\'ll automatically receive your medal.',
                    'li_retroactive_credit'     => 'If medals are added to a map after you have already submitted, you will still get credit.',
                ],

                'table' => [
                    'title'             => 'Medal thresholds by difficulty',
                    'completions_label' => 'medals',
                    'na'                => 'N/A',
                    'medal_gold'        => 'Gold',
                    'medal_silver'      => 'Silver',
                    'medal_bronze'      => 'Bronze',
                ],

                'images' => [
                    'gold'   => '/assets/medals/gold.png',
                    'silver' => '/assets/medals/silver.png',
                    'bronze' => '/assets/medals/bronze.png',
                ],
            ],
        ],

        // ──────────────────────────────────────────────────────────────────────
        // Map Submission (Submit Map page)
        // ──────────────────────────────────────────────────────────────────────
        'playtesting_info' => [
            'title'    => 'Playtesting',
            'subtitle' => 'How maps are tested, voted and accepted into the pool.',

            'must_submit_completion' => 'You must have submitted a completion for the map to vote!',

            'rules' => [
                'title'                      => 'Playtesting rules',
                'needs_votes_and_completions'=> 'Each difficulty requires a specific amount of votes and completion submissions.',
                'creator_cannot_vote'        => 'Creators cannot vote for their own map; their map submission contains their best estimate of difficulty.',
                'playtesters_give_tips'      => 'Playtesters will provide tips to the creator on how to improve the map, or what must change if there are glaring issues.',
            ],

            'votes' => [
                'title' => 'Required votes',

                'beginner_to_hard' => 'Beginner → Hard',
                'very_hard'        => 'Very Hard',
                'extreme'          => 'Extreme',
                'hell'             => 'Hell',

                'votes' => 'votes',
                'vote'  => 'vote',

                'counts' => [
                    'beginner_to_hard' => '5 votes',
                    'very_hard'        => '3 votes',
                    'extreme'          => '2 votes',
                    'hell'             => '1 vote',
                ],
            ],

            'process' => [
                'title'       => 'Process',
                'creation'    => 'Creation Phase',
                'testing'     => 'Testing Phase',
                'verification'=> 'Verification Phase',
                'acceptance'  => 'Acceptance',

                'steps' => [
                    'map_is_made'                        => 'Map is made',
                    'map_submission_form'                => 'Map submission form',
                    'creator_suggests_difficulty'        => 'Creator suggests difficulty',
                    'testers_submit_completion'          => 'Testers submit completion',
                    'testers_vote_on_difficulty'         => 'Testers vote on difficulty',
                    'creator_finalizes_submission'       => 'Creator finalizes submission',
                    'sensei_receive_submission_notification' => 'Sensei receive submission notification',
                    'accept'                             => 'accept',
                    'reject'                             => 'reject',
                    'map_sent_back_previous_step'        => 'Map is sent back to a previous step*',
                    'map_accepted'                       => 'Map accepted',
                    'map_added_to_pool'                  => 'Map added to map pool',
                    'testers_granted_completion_without_time' => 'Testers granted completion (without time)',
                ],

                'notes' => [
                    'change_only_by_sensei' => 'Changing map details can only be done via a Sensei (restrictions, code, etc.).',
                    'verification_removal'  => '* Completions and votes may be removed at this step.',
                    'sensei_power'          => 'At any point, a Sensei has the ability to manually force any outcome or revert to any step.',
                ],
            ],
        ],

        // ──────────────────────────────────────────────────────────────────────
        // Map Submission (Submit Map page)
        // ──────────────────────────────────────────────────────────────────────
        'how_to_submit' => [
            'title'    => 'How to submit a map',
            'subtitle' => 'Step-by-step explanation of every field in the “Submit map” section.',
            'intro'    => 'This dialog walks you through every step of the “Submit map” section.',

            'meta' => [
                'title'          => '1) Metadata (map & creators)',
                'li_creator'     => 'Main creator: it is auto-filled from your session. You can change it (and add co-creators if the option is visible).',
                'li_code'        => 'Map code: click “Edit” next to the “Code” field. The code must be unique (we check if it already exists).',
                'li_name'        => 'Map name: click “Edit” next to “Map name” and pick a name via autocomplete.',
                'li_checkpoints' => 'Checkpoints: click “Edit” and enter a strictly positive number.',
            ],

            'required' => [
                'title' => '2) Required fields',
                'p1'    => 'These fields must be provided before you can submit:',
                'li_difficulty'   => 'Difficulty: choose a value (Easy → Hell).',
                'li_category'     => 'Category / Map type: choose a type (e.g., Classic, Increasing Difficulty).',
                'li_mechanics'    => 'Mechanics: select at least one.',
                'li_restrictions' => 'Restrictions: select at least one.',
            ],

            'medals' => [
                'title'     => '3) Medals (optional but validated if present)',
                'p1'        => 'You may define times (in seconds) for Gold, Silver, and Bronze.',
                'li_rules'  => 'If you set one medal, you must set all three.',
                'li_pattern'=> 'Format: 1–5 digits, optionally “.” and 1–2 decimals (e.g., 5550.23). Non-negative values.',
                'li_order'  => 'Required ordering: Bronze > Silver > Gold (Bronze greater than Silver, which is greater than Gold).',
            ],

            'optional' => [
                'title'         => '4) Optional',
                'li_title'      => 'Title: short optional title (max 128 chars).',
                'li_banner'     => 'Custom banner: drag & drop or click to upload (JPG/PNG/WebP/AVIF), size ≤ 8MB. 16:9 recommended.',
                'li_description'=> 'Description: free text (if empty, “N/A” is shown).',
                'li_guide'      => 'Guide URL(s): one URL per line. The first valid URL is used.',
            ],

            'submit' => [
                'title'          => '5) Submit',
                'li_validation'  => 'Click “Submit”. The form validates: main creator, unique code, map name, checkpoints > 0, difficulty, category, ≥1 mechanic and ≥1 restriction, and medal consistency if present.',
                'li_confirmation'=> 'On success, a confirmation toast appears and the form resets.',
            ],

            'tips' => [
                'title'    => 'Tips',
                'li_edit'  => 'Fields with an “Edit” button can be quickly corrected inline.',
                'li_guest' => 'If you are not logged in, submission is locked and a “Login required” message is shown.',
                'li_support' => 'If banner upload fails, try again (≤ 8MB) or contact support.',
            ],
        ],

        // ──────────────────────────────────────────────────────────────────────
        // Difficulty & Techs Info
        // ──────────────────────────────────────────────────────────────────────
        'difficulty_techs_info' => [
            'legend_title' => 'Legend',
            'matrix_title' => 'Techniques by difficulty',
            'subtitle'     => 'Overview of how common each technique is across difficulty levels.',

            'labels' => [
                'beginner'  => 'Beginner',
                'easy'      => 'Easy',
                'medium'    => 'Medium',
                'hard'      => 'Hard',
                'very_hard' => 'Very Hard',
                'extreme'   => 'Extreme',
                'hell'      => 'Hell',
            ],

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

            'legend' => [
                'lv1_title' => 'Simple / priority use',
                'lv1_desc'  => 'Simple and easy use of the technique with priority on it.',
                'lv2_title' => 'Common / sometimes advanced',
                'lv2_desc'  => 'Frequent use of the common technique and rare use of advanced forms.',
                'lv3_title' => 'Advanced / demanding',
                'lv3_desc'  => 'Complex and demanding use of the technique.',
            ],

            'notes' => [
                'star'        => 'Double Jump / Slide / Wall Climb',
                'double_star' => 'Late Bhop / First Bhop / Emote Savebhop / Deathbhop',
            ],
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // Filters
    // ──────────────────────────────────────────────────────────────────────
    'filters' => [
        'beginner'  => 'Beginner',
        'easy'      => 'Easy',
        'medium'    => 'Medium',
        'hard'      => 'Hard',
        'very_hard' => 'Very Hard',
        'extreme'   => 'Extreme',
        'hell'      => 'Hell',
    ],
];
