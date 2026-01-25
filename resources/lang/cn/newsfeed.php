<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Newsfeed (ZH)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // HEADER
    // ──────────────────────────────────────────────────────────────────────
    'title'     => '最新消息',
    'subtitle'  => '升级 · 记录 · 视频 · 公告',

    // ──────────────────────────────────────────────────────────────────────
    // SEARCH & RESET
    // ──────────────────────────────────────────────────────────────────────
    'search_placeholder' => '搜索帖子, 标签, 作者...',
    'reset'              => '重置',

    // ──────────────────────────────────────────────────────────────────────
    // TABS
    // ──────────────────────────────────────────────────────────────────────
    'tabs' => [
        'newsfeed'    => '最新消息',
        'completions' => '通关记录',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TAGS
    // ──────────────────────────────────────────────────────────────────────
    'tags' => [
        'all' => 'All',
        'announcement'    => '公告',
        'guide'           => '视频',
        'new_map'         => '新地图',
        'role'            => '角色',
        'record'          => '记录',
        'map_edit'        => '地图编辑',
        'legacy_record'   => '地图损坏存档',
        'archive'         => '地图移除',
        'unarchive'       => '地图回归',
        'bulk_archive'    => '批量移除',
        'bulk_unarchive'  => '批量回归',
        'linked_map'      => '关联地图',
        'unlinked_map'    => '取消关联',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // SIDEBAR
    // ──────────────────────────────────────────────────────────────────────
    'sidebar' => [
        'community_picks' => '高分地图',
        'see_all'         => '查看全部 →',
        'changelogs'      => '改动记录',
        'submit_title'    => '上传你的地图',
        'submit_desc'     => '分享你的灵感、想法, 也可以从社区得到反馈。',
        'submit_cta'      => '提交',
        'upvotes'         => '投票',
        'details'         => '查看详细',
        'copy_code'       => '复制代码',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // EMPTY STATE
    // ──────────────────────────────────────────────────────────────────────
    'empty' => [
        'title'    => '没有帖子符合你的筛选条件',
        'subtitle' => '尝试更改标签或者搜索词',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // ACTIONS
    // ──────────────────────────────────────────────────────────────────────
    'load_more' => '加载更多',

    // ──────────────────────────────────────────────────────────────────────
    // TABLE HEADERS (shared)
    // ──────────────────────────────────────────────────────────────────────
    'thead' => [
        'mapCheckpoints'    => '检查点',
        'mapQuality'        => '评分',
        'mapDetails'        => '详情',
        'mapMechanics'      => '技巧',
        'mapRestrictions'   => '技巧限制',
        'mapDescription'    => '描述',
        'mapCategory'       => '地图类别',
        'mapCreators'       => '作者',
        'mapMedals'         => '奖章',
        'mapTags'           => '地图标签',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // COMMON
    // ──────────────────────────────────────────────────────────────────────
    'common' => [
        'na'                 => '无',
        'no_description'     => '没有描述',
        'error'              => '错误',
        'loading'            => '加载中...',
        'to_see_details'     => '去看具体详情!',
        'timestamp_format'   => '{year} {month} {day} {hour}:{minute} {AMorPM}',
        'reason'             => '原因',
        'not_found'          => 'Not found',
        'video_embed_failed' => '无法嵌入视频',
        'bot'                => 'BOT',
        'upvote'             => '投票',
        'missing_ids'        => '不存在的用户或者消息id',
        'empty'              => '空',
        'created_at'         => '创建于',
        'updated_at'         => '更新于',
        'medals' => [
            'gold'   => '金牌',
            'silver' => '银牌',
            'bronze' => '铜牌',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PAGINATION
    // ──────────────────────────────────────────────────────────────────────
    'pagination' => [
        'first'     => '« 首页',
        'prev'      => '‹ 上一页',
        'next'      => '下一页 ›',
        'last'      => '末页 »',
        'page_of'   => '当前 {current} / {total}',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MECHANICS
    // ──────────────────────────────────────────────────────────────────────
    'mechanics' => [
        'edge_climb'            => '扒边',
        'bhop'                  => '小跳',
        'crouch_edge'           => '蹲扒',
        'save_climb'            => '留爬',
        'bhop_first'            => '滑步',
        'high_edge'             => '弹射',
        'distance_edge'         => '身位',
        'quick_climb'           => '蹭墙',
        'slide'                 => '滑',
        'stall'                 => '系统跳',
        'dash'                  => 'SHIFT',
        'ultimate'              => '刀',
        'emote_save_bhop'       => '表情留小',
        'death_bhop'            => '死小',
        'triple_jump'           => '三段跳',
        'multi_climb'           => '蹭留',
        'vertical_multi_climb'  => '垂直蹭',
        'create_bhop'           => '卡小',
        'standing_create_bhop'  => '站卡',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // RESTRICTIONS
    // ──────────────────────────────────────────────────────────────────────
    'restrictions' => [
        'dash_start'            => '0关卡S',
        'triple_jump'           => '三段跳',
        'emote_save_bhop'       => '表情留小',
        'death_bhop'            => '死小',
        'multi_climb'           => '蹭留',
        'standing_create_bhop'  => '站卡',
        'create_bhop'           => '卡小',
        'wall_climb'            => '爬墙',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // NEWSFEED MESSAGES
    // ──────────────────────────────────────────────────────────────────────
    'newsfeed' => [
        'new_wr'                     => '{nickname} 刷新了新的世界记录!',
        'new_wr_info'                => '{creators} 的 {map_name} ({map_code})',
        'promoted'                   => '{nickname} 升级了!',
        'new_map'                    => '{nickname} 提交了一张新的 {difficulty} {map_name} 地图!',
        'has_posted_guide'           => '{nickname} 为 {map_code} 上传了路线视频',
        'watch_guide'                => '观看路线视频',
        'changed_code'               => '{map_code} 被更改为:',
        'details_command'            => '使用该命令',
        'click_here'                 => '点击此处',
        'link'                       => '链接',
        'copy_code'                  => '地图代码已复制 : {code}',
        'copy_clipboard'             => '命令已复制到剪贴板',
        'copy_clipboard_error'       => '无法将命令复制到剪贴板',
        'announcement'               => '新公告',
        'search_by_filter'           => 'Search by',
        'map_edit_filter'            => '地图编辑',
        'guide_filter'               => '路线视频',
        'new_map_filter'             => '新地图',
        'role_filter'                => '角色',
        'record_filter'              => '记录',
        'reset_filter'               => '重置筛选项',
        'translate_button'           => '翻译',
        'archived_map'               => '{map_code} 已被移除',
        'unarchived_map'             => '{map_code} 已回归',
        'archived_description'       => '这个地图只能通过搜索代码搜索到, 同时你不能上传任何记录关于已移除的地图',
        'unarchived_description'     => '这个地图可以被搜索到了，也可以进行提交通关记录 :)',
        'creator'                    => '作者',
        'map_code'                   => '代码',
        'difficulty'                 => '难度',
        'bulk_archived'              => '多张地图已被移除',
        'bulk_unarchived'            => '多张地图已回归到地图池',
        'official'                   => '国际服',
        'details'                    => '详情',
        'changes'                    => '改动',
        'map_name'                   => '地图名',
        'status_unarchived'          => '地图池内',
        'status_archived'            => '被移除',
        'guide_badge'                => '路线视频',
        'converted_to_legacy'        => '归纳到损坏地图池',
        'legacy'                     => '地图损坏',
        'affected'                   => '生效',
        'reason'                     => '原因',

        'no_changes'                 => '没有改动',
        'map_updated'                => '{map_code} 已被更新',
        'record_label'               => '记录',
        'video_label'                => '视频',
        'translation_failed'         => '翻译失败',
        'translation_error'          => '翻译时出错了...',
        'linked_map_title'           => '关联地图代码',
        'playtest_id'                => 'Playtest ID: :id',
        'official_code'              => '国际服代码',
        'unofficial_code'            => '国服代码',
        'linked_map_hint'            => '这两张图的代码被关联了',
        'unlinked_map_title'         => '国服代码',
        "unlinked_map_hint"          => '这两张图的代码不再相关联了',
        "unlinked_map_partial"       => '其中一个代码失效了',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // COMPLETIONS
    // ──────────────────────────────────────────────────────────────────────
    'completions' => [
        'new_submission_from' => '{nickname} 提交了新的通关记录',
        'watch'               => '观看',
        'open_screenshot'     => '查看截图',
        'screenshot_alt'      => '截图',
        'upvote_failed'       => '投票失败',

        'kv' => [
            'code'          => '代码',
            'map'           => '地图',
            'difficulty'    => '难度',
            'time'          => '时间',
            'aka'           => '别称',
        ],

        'status' => [
            'verified_screenshot'        => '通关截图已验证! 没有附带通关视频',
            'verified_completion_video'  => '通关视频已验证',
            'pending_review'             => '提交待审核',
            'verified_record'            => '新的记录 / time.',
            'under_review'               => '提交审核中...',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // CHANGELOGS
    // ──────────────────────────────────────────────────────────────────────
    'changelogs' => [
        'title'             => '更新日志',
        'latest'            => '最新',
        'view_on_github'    => '在GitHub上查看',
        'none'              => '没有可查看的更新日志了',
        'fetch_failed'      => '更新日志加载失败',
        'release'           => '发行版',
    ],
];