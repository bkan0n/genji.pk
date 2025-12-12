<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Submit & Playtest (ZH)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // HERO & TABS
    // ──────────────────────────────────────────────────────────────────────
    'header' => [
        'title'    => '提交 & 地图测试',
        'subtitle' => '地图 · 记录 · 反馈',
    ],

    'tabs' => [
        'record'   => '提交通关记录',
        'playtest' => '提交地图测试投票',
        'map'      => '上传地图',
    ],

    'help' => [
        'how_to_submit'         => '如何提交?',
        'playtesting_info'      => '地图测试信息',
        'difficulty_techs_info' => '难度与技术信息',
        'rank_how_to_submit'      => '如何提交?',
        'rank_submission_rules'   => '提交规则',
        'rank_info_thresholds'    => '段位信息',
        'medals_info_thresholds'  => '奖牌信息',
    ],

    'help_groups' => [
        'map_submission_info' => '地图提交信息',
        'rank_promotion'      => '段位晋升',
    ],

    'notice' => [
        'title' => '地图测试提交',
        'pending_accept' => '在地图被通过前，您的提交将不计入系统记录',
        'mutable_difficulty' => '在地图被通过前，难度可能随时更改',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // RECORD (Submit Record tab)
    // ──────────────────────────────────────────────────────────────────────
    'record' => [
        'select_quality'    => '选择评分 (1–6)',
        'optional'          => '可选',
        'video'             => '视频 (URL)',
        'screenshot'        => '截图',
        'drag_and_drop'     => '拖放图片至此, 或点击上传',
        'cancel'            => '取消',
        'submit_label'      => '提交记录',

        'code_invalid'        => '请输入有效的地图代码。',
        'time_label'          => '完成时间',
        'time_invalid'        => '请输入有效的时间',
        'quality_required'    => '请选择评分',
        'screenshot_required' => '请上传截图',
        'video_invalid'       => '请输入有效的视频 URL',
        'confirm' => '你的跑图记录已成功提交',

        'time_hint' => '无效的时间格式: 小数点前最多5位数字，小数点后最多2位 (例如：12345.67)',
        'view_modal' => '查看游玩测试',

        'quality'   => '评分',
        'quality_1' => '1 - 差',
        'quality_2' => '2 - 一般',
        'quality_3' => '3 - 普通',
        'quality_4' => '4 - 良好',
        'quality_5' => '5 - 优秀',
        'quality_6' => '6 - 极佳',
    ],

    // ───────────────────────────────────────────────────────────────────────
    // MAP
    // ───────────────────────────────────────────────────────────────────────
    'map' => [
        'meta' => [
            'creator'           => '作者',
            'code'              => '地图代码',
            'name'              => '地图名',
            'checkpoints'       => '检查点数',
            'edit'              => '编辑',
            'add_creator'       => '添加创作者',
            'search_creator'    => '搜索创作者…',
            'search_map_name'   => '搜索地图名称…',
            'official'   => '官方',
            'unofficial' => '非官方',
        ],

        'required_title'          => '必填',
        'dropdown' => [
            'select_difficulty'   => '选择难度',
            'select_category'     => '选择类别',
            'select_mechanics'    => '选择技巧',
            'select_restrictions' => '选择技巧ban',
            'difficulty'          => '难度',
            'category'            => '地图类型',
            'mechanics'           => '技巧',
            'restrictions'        => '技巧ban',
        ],

        'optional_title'         => '可选',
        'title_label'            => '标题',
        'title_placeholder'      => '可选的简短标题(最多128字符)',
        'custom_banner'          => '自定义横幅图片',
        'banner_hint'            => '推荐16:9比例, JPG/PNG/WebP/AVIF格式, 最大10MB',
        'description_label'      => '描述',
        'guide_label'            => '指南 (URL)',
        'guide_hint'             => '每行一个URL；使用第一个有效的URL。',
        'medals_hint'            => '格式：小数点前最多5位数字，小数点后最多2位（例如：12345.67）。值≥0。必须的顺序：铜牌 > 银牌 > 金牌。',
        'remove'                 => '移除',

        'submit_label' => '提交地图',

        'val' => [
            'creator'                => '请选择一位主要作者',
            'map_code'               => '请输入有效的地图代码',
            'map_code_already_exist' => '此地图代码已存在',
            'map_name'               => '请输入地图名称',
            'checkpoints'            => '请选择难度',
            'map_type'               => '请选择地图类型',
            'mechanics'              => '请至少选择一种技巧',
            'restrictions'           => '请至少选择一种技巧ban',
            'medals_generic'         => '无效的奖牌设置',
            'medals_missing'         => '请填写全部三个奖牌所需时间',
            'medals_order'           => '时间值必须为铜牌 > 银牌 > 金牌。',
        ],

        'confirm'        => '你的地图已成功提交',

        'no_description' => '未提供描述',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MAP BANNER UNOFFICIAL NOTICE
    // ──────────────────────────────────────────────────────────────────────
    'unofficial_notice' => [
        'title' => '国服地图提交',
        'li1'   => '这是一张国服地图, 不会有地图测试环节, 玩家也不会因通关获得等级或经验',
        'li2'   => '如果地图代码是在国际服上创建的, 可以通过相关联的代码进行地图测试',
        'li3'   => '要使通关记录计入等级和经验, 必须是在国际服上通关',
        'li4'   => '请在描述中注明谁“拥有”国服代码, 以便在地图更改时我们可以通知他(她)',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // OCR NOTICE
    // ──────────────────────────────────────────────────────────────────────
    'ocr' => [
        'title' => '截图 OCR 识别',
        'li1'   => '当您上传截图时, 我们会尝试自动识别地图代码和时间',
        'li2'   => '在提交记录之前, 请务必仔细核对识别出的数值',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // HELP MODALS (full texts for modals)
    // ──────────────────────────────────────────────────────────────────────
    'how_to_submit' => [
        'title' => '如何提交地图?',
        'intro' => '本对话框将引导您完成“提交地图”部分的每一步。',

        'meta' => [
            'title'        => '元数据(地图 & 作者)',
            'li_creator'   => '主要作者: 系统(有可能)自动填充, 您可以更改它 (如果选项可见, 还可以添加共同创作者)',
            'li_code'      => '地图代码: 点击"地图代码"旁边的"编辑", 代码必须是唯一的 (系统会检查是否已存在)',
            'li_name'      => '地图名称: 点击"地图名称"旁边的"编辑", 通过自动完成功能选择一个名称',
            'li_checkpoints'=> '检查点数: 点击"编辑"并输入一个正整数',
        ],

        'required' => [
            'title'        => '必填字段',
            'p1'           => '在提交之前必须提供以下字段:',
            'li_difficulty'=> '难度: 选择一个难度(Easy → Hell)',
            'li_category'  => '地图类别: 选择一个类型(例如, 经典、难度递增)',
            'li_mechanics' => '技巧: 至少选择一种',
            'li_restrictions'=> '技巧ban: 至少选择一种',
        ],

        'medals' => [
            'title'  => '奖牌(可选, 但如果设置提交通关记录时需验证)',
            'p1'     => '你可以设置金、银、铜牌的时间 (以秒为单位)',
            'li_rules'   => '如果你设置了一个奖牌, 则必须设置全部三个',
            'li_pattern' => '格式: 1–5位数字, 可选"."和1–2位小数 (例如：5550.23) 为非负值',
            'li_order'   => '顺序: 铜牌 > 银牌 > 金牌 (铜牌时间大于银牌, 银牌大于金牌)',
        ],

        'optional' => [
            'title'      => '可选',
            'li_title'   => '标题： 可选的简短标题 (最多128个字符)',
            'li_banner'  => '自定义横幅图片: 拖放或点击上传(JPG/PNG/WebP/AVIF格式), 大小≤8MB, 推荐16:9比例',
            'li_description' => '描述: 自由文本(如果为空, 则显示"N/A")',
            'li_guide'   => '路线视频 URL: 每行一个URL, 系统使用第一个有效的URL',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PLAYTEST (shared modal/labels)
    // ──────────────────────────────────────────────────────────────────────
    'playtest' => [
        'title_suffix'         => '请求地图测试反馈',
        'votes'                => '投票数',
        'difficulty_rating'    => '难度评价',
        'rating_sub'           => '基于社区投票',
        'question_difficulty'  => '为地图难度投票',
        'complete_to_vote'     => '提交一次通关记录即可参与投票',
        'vote_recorded'        => '投票已提交',
        'vote_updated'         => '投票已更新',
        'no_votes'             => '暂无投票',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FILTERS (toolbar + common filter labels)
    // ──────────────────────────────────────────────────────────────────────
    'filters'              => [
        'creator'          => '作者',
        'enter_creator'    => '输入作者',

        'map_name'         => '地图名称',
        'enter_map_name'   => '输入地图名称',

        'user'             => '用户名',
        'enter_nickname'   => '输入用户名',

        'code'             => '地图代码',
        'map_code'         => '地图代码',
        'enter_map_code'   => '输入地图代码',

        'difficulty'       => '难度',
        'beginner'         => 'Beginner',
        'easy'             => 'Easy',
        'medium'           => 'Medium',
        'hard'             => 'Hard',
        'very_hard'        => 'Very Hard',
        'extreme'          => 'Extreme',
        'hell'             => 'Hell',

        'category'               => '地图类型',
        'map_type'               => '地图类型',
        'classic'                => '经典',
        'increasing_difficulty'  => '难度递增',
        'tournament'             => '比赛图',

        'mechanics'              => '技巧',
        'restrictions'           => '技巧ban',

        'playtest_status'        => '游玩测试状态',
        'only_true'              => '是',
        'only_false'             => '否',
        'completion_filter'      => '是否通关',
        'medal_filter'           => '含有勋章',

        'participation_filter'   => '参与筛选',
        'participated_yes'       => '已参与',
        'participated_no'        => '未参与',

        'apply_filters'          => '应用筛选',
        'clear_filters'          => '清除筛选',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TABLE HEADERS
    // ──────────────────────────────────────────────────────────────────────
    'table' => [
        'code'              => '地图代码',
        'map_name'          => '地图名称',
        'map_type'          => '地图类型',
        'creator'           => '作者',
        'difficulty'        => '难度',
        'checkpoints'       => '检查点数',
        'quality'           => '评分',
        'medal_gold'        => '金牌',
        'medal_silver'      => '银牌',
        'medal_bronze'      => '铜牌',
        'details'           => '详情',
        'view'              => '查看',
        'nickname'          => '昵称',
        'time'              => '时间',
        'medal'             => '奖牌',
        'video'             => '视频',
        'xp'                => '经验',
        'playtests_votes'   => '地图测试投票',
        'mechanics'         => '技巧',
        'restrictions'      => '技巧ban',
        'description'       => '描述',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MESSAGES (confirmations, generic)
    // ──────────────────────────────────────────────────────────────────────
    'messages' => [
        'submit_record_confirm' => '你的记录已成功提交。',
        'submit_map_confirm'    => '你的地图已成功提交。',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // ERRORS
    // ──────────────────────────────────────────────────────────────────────
    'errors' => [
        'server_unreachable'      => '服务器无法连接, 请重试',
        'playtests_load_failed'   => '加载地图测试失败, 请稍后再试',
        'image_type'              => '无效的图片类型',
        'image_too_large'         => '图片过大 (最大8MB)',
        'upload_failed'           => '上传失败',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // POPUP / MISC
    // ──────────────────────────────────────────────────────────────────────
    'popup' => [
        'no_results'              => '未找到结果。',
        'filter_applied'          => '筛选已应用: {filterId} = {value}',
        'login_required_msg'      => '请登录提交',
        'map_code_copied'         => '地图代码已复制: {code}',
        'click_to_copy_map_code'  => '点击复制',
        'copied'                  => '已复制!',
        'copy'                    => '复制',
        'copy_failed'             => '复制失败',
        'login'                   => '登录',
        'user_id_copied'          => '用户 ID {id} 已复制到剪贴板！',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PAGINATION
    // ──────────────────────────────────────────────────────────────────────
    'pagination' => [
        'first'     => '« 首页',
        'prev'      => '‹ 上一页',
        'next'      => '下一页 ›',
        'last'      => '末页 »',
        'page_of'   => '第 {current} 页，共 {total} 页',
    ],
];