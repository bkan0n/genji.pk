<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Infos (ZH)
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
        'badge'    => '规则 · 段位 · 帮助',
        'title'    => '信息 & 规则',
        'subtitle' => '升级 · 测图 · 新图 & 跑图 · 技巧',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TABS
    // ──────────────────────────────────────────────────────────────────────
    'tabs' => [
        'ranking_process'  => '升段流程',
        'ranks_threshold'  => '段位门槛',
        'playtesting'      => '地图测试',
        'submit_map'       => '跑图提交',
        'techs'            => '技巧与难度',
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
            'soon' => '即将推出',
        ],

        // ──────────────────────────────────────────────────────────────────────
        // Rank Promotion
        // ──────────────────────────────────────────────────────────────────────
        'rank_promotion' => [

            // ──────────────────────────────────────────────────────────────
            // HOW TO SUBMIT (RANK PROMOTION COMPLETION)
            // ──────────────────────────────────────────────────────────────
            'how_to_submit' => [
                'title' => '怎么提升你的段位',
                'intro' => '在国际服且未被下架的地图代码上提供跑图通关证明, 并且给出你对地图的评分',

                'requirements' => [
                    'title'         => '要求',
                    'map_in_pool'   => '完成一张在当前地图池中的源氏跑酷地图',
                    'map_code_note' => '注意：当前不允许提交通关记录的地图不会出现在常规搜索中, 除非你直接搜索代码',
                ],

                'steps' => [
                    'title'             => '步骤',
                    'open_tab'          => '打开 “提交通关记录” 标签页',
                    'enter_code'        => '输入地图代码和你的通关时间',
                    'upload_screenshot' => '上传通关截图(必需)且可选提供通关视频',
                    'select_quality'    => '选择你对该地图的评分 (1–6).',
                    'submit'            => '点击 “提交记录” 按钮',
                    'verification'      => '你的通关记录将进入到验证流程中',
                    'notification'      => '等待验证通过, 你将收到通知',
                ],

                'quality' => [
                    'title' => '地图评分标准',
                    'six'   => '6: 绝世好图',
                    'five'  => '5: 十分nice',
                    'four'  => '4: 很棒',
                    'three' => '3: 一般般',
                    'two'   => '2: 吊图',
                    'one'   => '1: 大芬',
                ],
            ],

            // ──────────────────────────────────────────────────────────────
            // SUBMISSION RULES (FOR RANK PROMOTION / RECORDS)
            // ──────────────────────────────────────────────────────────────
            'submission_rules' => [
                'title' => '通关记录提交须知',

                'completion' => [
                    'title'             => '应该遵循以下所有要求',
                    'li_code_match'     => '截图中的地图代码必须与 机器人/网站 中的地图代码匹配',
                    'li_time_display'   => '通关时间必须显示在前5名排行榜中 或 屏幕中央的大字体消息中。对于视频提交, 两者必须同时显示',
                    'li_no_edit_map'    => '你不能更改自定义游戏设置、工坊设置或任何其他工坊代码以及任何方式编辑地图。包括但不限于更改技巧封禁、英雄重力等等',
                    'li_no_scripts'     => '不能用脚本、宏以及类似的工具来完成地图任何一个部分',
                    'li_no_banned_tech' => '如果由于工坊错误导致技巧封禁失效, 你不得使用被禁止的技巧 (由地图作者在@GenjiBot#9209中列出',
                ],

                'records' => [
                    'title'                         => '视频验证规则',
                    'li_time_visible'               => '时间必须从0.00到完成全程可见。计时器运行时视频不要淡入或淡出',
                    'li_video_required'             => '世界纪录和获取奖牌 “必须” 提供视频证明',
                    'li_no_cuts'                    => '不允许视频剪辑(在0.00到完成之间)',
                    'li_sound_not_required'         => '不需要游戏声音',
                    'li_editing_ok_but_no_interfere'=> '允许在视频前后进行编辑, 但不能对计时器进行处理或其他影响验证提交的情况',
                ],

                'reserve_rights' => '管理员保留以任何理由拒绝任何提交的权利, 无论是否在此列出',
            ],

            // ──────────────────────────────────────────────────────────────
            // RANK INFO & THRESHOLDS
            // ──────────────────────────────────────────────────────────────
            'rank_info_thresholds' => [
                'info' => [
                    'title'       => '段位详情',
                    'subtitle'    => '对不同段位的能力要求以及如何升段',
                    'li_no_order' => '提升段位并不需要从下往上, 没有固定顺序',
                    'li_requirement' => '要得到段位标识, 你必须完成该段位所指定难度 指定数量的地图',
                    'li_thresholds'  => '详细见下方段位门槛图表',
                ],

                'table' => [
                    'title'             => '段位与难度表',
                    'completions_label' => '完成数量',
                    'na'                => '无',
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
                    'title'                     => '竞速奖牌',
                    'subtitle'                  => '如何在你的段位后面多上+、++、+++ ?',
                    'li_plus_explain'           => '你需要获得与该段位所要求数量的奖牌, 详细见下方表格',
                    'li_time_and_video_required'=> '获取奖牌时你需要发布一个完整且显示你跑图时间的视频链接在提交通关记录中',
                    'li_icon_next_to_name'      => '如果你符合要求你的段位标签后面会自动加上(+、++、++)',
                    'li_auto_receive'           => '验证通过后系统会自动为你颁发奖牌',
                    'li_retroactive_credit'     => '如果在你提交了通关记录后地图才添加了奖牌, 系统会自动为你颁发奖牌',
                ],

                'table' => [
                    'title'             => '按难度划分的门槛表',
                    'completions_label' => '奖牌数',
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
            'title'    => '地图测试',
            'subtitle' => '地图如何被测试、投票并被纳入地图池',

            'must_submit_completion' => '你必须提交了该地图的完成记录才能投票!',

            'rules' => [
                'title'                      => '地图测试规则',
                'needs_votes_and_completions'=> '每个难度需要一定数量的投票和完成记录提交',
                'creator_cannot_vote'        => '地图作者不能为自己的地图投票, 但在提交新地图时需要填写自己对该地图的难度估计值',
                'playtesters_give_tips'      => '参与地图测试的玩家可以向作者提出改进建议等...',
            ],

            'votes' => [
                'title' => '地图难度所需票数',

                'beginner_to_hard' => 'Beginner → Hard',
                'very_hard'        => 'Very Hard',
                'extreme'          => 'Extreme',
                'hell'             => 'Hell',

                'votes' => '票数',
                'vote'  => '票数',

                'counts' => [
                    'beginner_to_hard' => '5 票数',
                    'very_hard'        => '3 票数',
                    'extreme'          => '2 票数',
                    'hell'             => '1 票数',
                ],
            ],

            'process' => [
                'title'       => '流程',
                'creation'    => '作图阶段',
                'testing'     => '测试阶段',
                'verification'=> '管理员验证',
                'acceptance'  => '测试完成',

                'steps' => [
                    'map_is_made'                        => '地图完成创作',
                    'map_submission_form'                => '填写提交表单',
                    'creator_suggests_difficulty'        => '作者估计难度',
                    'testers_submit_completion'          => '测试玩家提交跑图记录',
                    'testers_vote_on_difficulty'         => '测试玩家投票表决难度',
                    'creator_finalizes_submission'       => '作者结束投票环节',
                    'sensei_receive_submission_notification' => '管理员收到地图上传信息',
                    'accept'                             => '通过',
                    'reject'                             => '打回',
                    'map_sent_back_previous_step'        => '地图被送到上一环节*',
                    'map_accepted'                       => '地图通过',
                    'map_added_to_pool'                  => '添加进地图池',
                    'testers_granted_completion_without_time' => '测试玩家获得通关记录(但没有时间)',
                ],

                'notes' => [
                    'change_only_by_sensei' => '更改地图的详细信息只能由管理员进行(技巧ban、代码等...)',
                    'verification_removal'  => '* 完成记录和投票可能在此步骤被移除',
                    'sensei_power'          => '在任何时候, 管理员都有权力手动强制结束或恢复到任一步骤',
                ],
            ],
        ],

        // ──────────────────────────────────────────────────────────────────────
        // Map Submission (Submit Map page)
        // ──────────────────────────────────────────────────────────────────────
        'how_to_submit' => [
            'title'    => '如何上传地图',
            'subtitle' => '告诉你如何一步步提交地图',
            'intro'    => '对话框将引导你完成"提交地图"部分的每一步',

            'meta' => [
                'title'          => '1) 元数据 (地图数据 & 作者)',
                'li_creator'     => '作者: 系统会自动填充, 你也可以进行更改 (如果选项可见, 可以添加其他作者)',
                'li_code'        => '代码: 点击"代码"字段旁边的"编辑", 代码必须唯一(系统会检查是否已存在)',
                'li_name'        => '地图: 点击"地图名称"旁边的"编辑", 选择匹配的地图名',
                'li_checkpoints' => '检查点数: 点击"编辑"并输入一个正数',
            ],

            'required' => [
                'title' => '2) 必填字段',
                'p1'    => '必须填写这些字段才能完成提交:',
                'li_difficulty'   => '难度: 选择一个难度 (Easy → Hell)',
                'li_category'     => '地图类别: 选择一个类型(例如，经典、递增难度)',
                'li_mechanics'    => '所需技巧: 至少选择一个',
                'li_restrictions' => '技巧ban: 至少选择一个',
            ],

            'medals' => [
                'title'     => '3) 奖牌 (可选，但如果存在则验证)',
                'p1'        => '你可以定义通关时间多少(单位 秒)可获取金、银、铜奖牌',
                'li_rules'  => '如果设置了一个奖牌, 必须设置所有三个',
                'li_pattern'=> '格式: 1-5位数字，可选 "." 和 1-2位小数(例如，5550.23) 非负值',
                'li_order'  => '顺序: 铜牌 > 银牌 > 金牌 (通关时间排序)',
            ],

            'optional' => [
                'title'         => '4) 可选',
                'li_title'      => '标题: 简短的标题 (最多128字符)',
                'li_banner'     => '横幅图片: 拖放或点击上传(JPG/PNG/WebP/AVIF), 大小≤8MB, 推荐16:9',
                'li_description'=> '描述: 不限制内容(如果为空, 显示"N/A")',
                'li_guide'      => '路线视频: 每行一个链接, 系统自动使用第一个有效链接',
            ],

            'submit' => [
                'title'          => '5) 提交',
                'li_validation'  => '点击"提交", 填写的提交表单进行验证: 作者、唯一代码、地图名称、检查点>0、难度、类别、≥1个所需技巧和≥1个技巧ban, 以及如果存在奖牌的一致性。',
                'li_confirmation'=> '成功时, 会出现确认提示且表单重置',
            ],

            'tips' => [
                'title'    => '提示',
                'li_edit'  => '带有"编辑"按钮的字段可以快速内联更正',
                'li_guest' => '如果未登录, 提交将被锁定, 并显示"需要登录"消息',
                'li_support' => '如果横幅图片上传失败, 请重试（≤8MB）或向管理员请求支持',
            ],
        ],

        // ──────────────────────────────────────────────────────────────────────
        // Difficulty & Techs Info
        // ──────────────────────────────────────────────────────────────────────
        'difficulty_techs_info' => [
            'legend_title' => '图例',
            'matrix_title' => '各难度技巧要求',
            'subtitle'     => '各难度级别中每种技巧的常见程度概览',

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
                'basics'        => '基础*',
                'bhop'          => '小跳**',
                'edge_climb'    => '扒边',
                'stall'         => '系统跳',
                'crouch_edge'   => '蹲扒',
                'save_climb'    => '留爬',
                'distance_edge' => '身位扒',
                'high_edge'     => '弹射',
                'multi_climb'   => '蹭留',
                'create_bhop'   => '卡小',
            ],

            'legend' => [
                'lv1_title' => '较少 / 优先使用',
                'lv1_desc'  => '简单且优先使用该技巧,',
                'lv2_title' => '常见 / 较进阶',
                'lv2_desc'  => '较频繁使用常见技巧',
                'lv3_title' => '进阶 / 高要求',
                'lv3_desc'  => '对技巧使用高开发与高要求',
            ],

            'notes' => [
                'star'        => '(留)二段跳(非留二段扒边) / 滑 / 爬墙',
                'double_star' => '留小跳 / 滑步 / 表情留小 / 死亡留小',
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
