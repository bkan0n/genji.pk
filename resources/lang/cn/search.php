<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Search (ZH)
    |--------------------------------------------------------------------------
    */

    // ───────────────────────────────────────────────────────────────────────
    // META / PAGE
    // ───────────────────────────────────────────────────────────────────────
    'page_title' => '搜索',
    'og_title' => 'Genji Parkour - Search',
    'og_description' => 'Find maps, completions, guides and personal records.',

    // ───────────────────────────────────────────────────────────────────────
    // HEADER
    // ───────────────────────────────────────────────────────────────────────
    'title' => '地图',
    'subtitle' => '搜索 · 跑图记录 · 路线视频 · 个人记录',

    // ───────────────────────────────────────────────────────────────────────
    // TABS
    // ───────────────────────────────────────────────────────────────────────
    'map_search' => '地图搜索',
    'completions' => '跑图记录',
    'guides' => '路线视频',
    'personal_records' => '个人记录',

    // ───────────────────────────────────────────────────────────────────────
    // TOOLBAR & HELPERS
    // ───────────────────────────────────────────────────────────────────────
    'select_mode' => '选择搜索模式',
    'add_filter_hint' => '添加筛选条件或点击确认 ✔',
    'screenshot' => '截图',
    'open_screenshot' => '查看截图',
    'no_description' => '暂无描述',
    'watch' => '观看',
    'na' => 'N/A',

    // ───────────────────────────────────────────────────────────────────────
    // PLACEHOLDERS
    // ───────────────────────────────────────────────────────────────────────
    'map_name_placeholder' => '地图名称',
    'map_code_placeholder' => '地图代码',
    'nickname_placeholder' => '昵称',
    'completion' => '完成记录',

    // ───────────────────────────────────────────────────────────────────────
    // FILTERS TOOLBAR (UI toolbar options)
    // ───────────────────────────────────────────────────────────────────────
    'filters_toolbar' => [
        'creator' => '作者',
        'enter_creator' => '输入作者',
        'map_name' => '地图名称',
        'enter_map_name' => '输入地图名称',
        'user' => '用户名',
        'enter_nickname' => '输入用户名',
        'code' => '地图代码',
        'enter_map_code' => '输入地图代码',
        'difficulty_exact' => '难度',
        'beginner' => 'Beginner',
        'easy' => 'Easy',
        'medium' => 'Medium',
        'hard' => 'Hard',
        'very_hard' => 'Very Hard',
        'extreme' => 'Extreme',
        'hell' => 'Hell',
        'category' => '地图类型',
        'classic' => '经典',
        'increasing_difficulty' => '难度递增',
        'tournament' => '比赛',
        'mechanics' => '技巧要求',
        'restrictions' => '技巧ban',
        'playtest_status' => '测试状态',
        'in_progress' => '测试中',
        'approved' => '测试通过',
        'only_true' => '是',
        'only_false' => '否',
        'playtest_filter' => '试玩',
        'playtest_all'    => '全部',
        'playtest_only'   => '仅限试玩',
        'playtest_none'   => '不含试玩',
        'completion_filter' => '是否完成',
        'medal_filter' => '奖牌',
        'participation_filter' => 'Participation filter',
        'participated_yes' => 'Participated',
        'participated_no' => 'Not participated',
        'apply_filters' => '应用筛选',
        'clear_filters' => '重置筛选',
    ],

    // ───────────────────────────────────────────────────────────────────────
    // FILTERS (common labels used across views)
    // ───────────────────────────────────────────────────────────────────────
    'filters' => [
        'map_name' => '地图名称',
        'map_code' => '地图代码',
        'difficulty' => '地图难度',
        'creator' => '作者',
        'mechanics' => '技巧要求',
        'restrictions' => '技巧ban',
        'only_playtest' => '仅测试中地图',
        'only_maps_with_medals' => '仅含奖牌地图',
        'ignore_completions' => '忽略已跑完地图',
        'player_name' => '玩家名称',
    ],

    'card' => [
      'completed'     => '已完成',
      'not_completed' => '未完成',
      'mapped_by'     => '作者',
      'like'          => '点赞',
    ],

    // ───────────────────────────────────────────────────────────────────────
    // MECHANICS
    // ───────────────────────────────────────────────────────────────────────
    'mechanics' => [
        'edge_climb' => '扒边',
        'bhop' => '小跳',
        'crouch_edge' => '蹲扒',
        'save_climb' => '留爬',
        'bhop_first' => '滑步',
        'high_edge' => '弹射',
        'distance_edge' => '身位扒',
        'quick_climb' => '连扒',
        'slide' => '滑',
        'stall' => '系统跳',
        'dash' => 'shift',
        'ultimate' => '刀',
        'emote_save_bhop' => '表情留小',
        'death_bhop' => '死亡留小',
        'triple_jump' => '三段跳',
        'multi_climb' => '蹭留',
        'vertical_multi_climb' => '垂直蹭',
        'create_bhop' => '卡小',
        'standing_create_bhop' => '站卡',
    ],

    // ───────────────────────────────────────────────────────────────────────
    // RESTRICTIONS
    // ───────────────────────────────────────────────────────────────────────
    'restrictions' => [
        'dash_start' => '卡S',
        'triple_jump' => '三段跳',
        'emote_save_bhop' => '表情留小',
        'death_bhop' => '死亡留小',
        'multi_climb' => '蹭留',
        'standing_create_bhop' => '站卡',
        'create_bhop' => '卡小',
        'wall_climb' => '爬墙',
    ],

    // ───────────────────────────────────────────────────────────────────────
    // MAP TYPE
    // ───────────────────────────────────────────────────────────────────────
    'map_type' => [
        'classic' => '经典',
        'increasing_difficulty' => '难度递增',
        'tournament' => '比赛图',
        'practice' => '练习图',
    ],

    // ───────────────────────────────────────────────────────────────────────
    // MAP NAME (canonical list)
    // ───────────────────────────────────────────────────────────────────────
    'map_name' => [
        'aatlis' => '阿特利斯',
        'ayutthaya' => '阿育陀耶',
        'black_forest' => '黑森林',
        'blizzard_world' => '暴雪世界',
        'busan' => '釜山',
        'castillo' => '城堡',
        'chateau_guillard' => '吉拉德堡',
        'circuit_royal' => '皇家赛道',
        'colosseo' => '斗兽场',
        'dorado' => '多拉多',
        'ecopoint_antarctica' => '生态监测站：南极洲',
        'eichenwalde' => '艾兴瓦尔德',
        'esperanca' => '埃斯佩兰萨',
        'hanamura' => '花村',
        'havana' => '哈瓦那',
        'hollywood' => '好莱坞',
        'horizon_lunar_colony' => '地平线月球基地',
        'ilios' => '伊利奥斯',
        'junkertown' => '渣客镇',
        'kanezaka' => '铁坂',
        'kings_row' => '国王大道',
        'lijiang_tower' => '漓江塔',
        'malevento' => '马莱温多',
        'midtown' => '中城',
        'necropolis' => '墓园',
        'nepal' => '尼泊尔',
        'new_queen_street' => '新皇后街',
        'numbani' => '努巴尼',
        'oasis' => '绿洲城',
        'paraiso' => '帕拉伊苏',
        'paris' => '巴黎',
        'petra' => '佩特拉',
        'practice_range' => '训练靶场',
        'rialto' => '里阿尔托',
        'route_66' => '66号公路',
        'temple_of_anubis' => '阿努比斯神殿',
        'volskaya_industries' => '沃斯卡娅工业区',
        'watchpoint_gibraltar' => '观测站：直布罗陀',
        'workshop_chamber' => '地图工坊室内',
        'workshop_expanse' => '地图工坊空地',
        'workshop_green_screen' => '工坊绿幕',
        'workshop_island' => '地图工坊岛屿',
        'framework' => '框架',
        'tools' => '工具',
        'shambali' => '香巴里寺院',
        'chateau_guillard_halloween' => '万圣节吉拉德堡',
        'eichenwalde_halloween' => '万圣节艾兴瓦尔德',
        'hollywood_halloween' => '万圣节好莱坞',
        'black_forest_winter' => '圣诞节黑森林',
        'blizzard_world_winter' => '圣诞节暴雪世界',
        'ecopoint_antarctica_winter' => '圣诞节生态监测站：南极洲',
        'hanamura_winter' => '圣诞节花村',
        'kings_row_winter' => '圣诞节国王大道',
        'busan_lunar_new_year' => '春节釜山',
        'lijiang_tower_lunar_new_year' => '春节漓江塔',
        'antarctic_peninsula' => '南极半岛',
        'suravasa' => '苏拉瓦萨',
        'new_junk_city' => '新渣客城',
        'samoa' => '萨摩亚',
        'hanaoka' => '花冈',
        'runasapi' => '鲁纳塞彼',
        'throne_of_anubis' => '阿努比斯王座'
    ],

    // ───────────────────────────────────────────────────────────────────────
    // POPUP / MISC
    // ───────────────────────────────────────────────────────────────────────
    'popup' => [
        'login_required_btn' => '需要登录',
        'login_required_msg' => '此页面需要登录',
        'login_required_pr' => '使用此功能需要登录',
        'login_required_filter' => '使用此筛选器需要登录',
        'login_required_progression' => '请登录查看你的进度',
        'map_code_required' => '请输入地图代码',
        'no_results' => '未找到结果',
        'filter_applied' => '已应用筛选 {filterId}: {value}',
        'filters_cleared' => '所有筛选已清除',
        'enter_username' => '请输入有效的用户名',
        'username_updated' => '你的用户名已更新',
        'primary_username_updated' => '主用户名已更新',
        'already_exist_username' => '用户名已存在',
        'set_primary_username' => '设为主用户名',
        'delete_username' => '删除用户名',
        'no_username_set' => '未设置用户名',
        'confirm_button' => '确认',
        'copy_map_code' => '复制地图代码',
        'map_code_copied' => '地图代码已复制: {code}',
        'copy_failed' => '复制地图代码失败',
    ],

    // ───────────────────────────────────────────────────────────────────────
    // PAGINATION
    // ───────────────────────────────────────────────────────────────────────
    'pagination' => [
        'first' => '« 首页',
        'prev' => '‹ 上一页',
        'next' => '下一页 ›',
        'last' => '末页 »',
        'page_of' => '第 {current} 页，共 {total} 页',
    ],

    // ───────────────────────────────────────────────────────────────────────
    // CHARTS
    // ───────────────────────────────────────────────────────────────────────
    'chart' => [
        'mapDifficultyDistribution' => '地图难度分布',
        'amountOfMaps' => '地图数量',
        'difficultyLevel' => '难度等级',
        'popularCreators' => '按平均评分排序的地图作者',
        'mapAmountLogScale' => '地图数量 (Log Scale)',
        'averageQuality' => '平均评分',
        'topMapsFor' => '难度 {difficulty} 的热门地图',
        'mapCodes' => '地图代码',
        'completions' => '完成数量',
        'rank' => '段位',
        'playersIn' => '{tier} 段玩家',
        'map' => '地图',
        'quality' => '质量',
        'completionsTooltip' => '{map}: {completions} 次完成提交, 评分: {quality}',
        'playersInTier' => '{tier} 级别有 {amount} 名玩家',
        'tooltipLabel' => '{creator} - 地图数: {mapCount}, 质量: {quality}',
        'tierRank' => '等级排名',
        'skillRank' => '段位排名',
        'easy' => 'Easy',
        'medium' => 'Medium',
        'hard' => 'Hard',
        'very hard' => 'Very Hard',
        'extreme' => 'Extreme',
        'hell' => 'Hell',
        'mapsTooltip' => '{count} 张地图',
        'record_progression_time' => '记录时间一览',
        'user_record_progression' => '你的记录',
        'average_time' => '平均时间',
        'min_time' => '最短时间',
        'max_time' => '最长时间',
        'amount' => '数量',
        'quantity' => '评分',
        'total_amount_time' => '总时长（小时）',
        'time_played_per_difficulty' => '各难度游玩时间',
    ],

    // ───────────────────────────────────────────────────────────────────────
    // TABLE HEADERS
    // ───────────────────────────────────────────────────────────────────────
    'thead' => [
        'mapCode' => '地图代码',
        'mapName' => '地图名',
        'mapType' => '类型',
        'mapCreator' => '作者',
        'mapDifficulty' => '难度',
        'mapCheckpoints' => '检查点数',
        'mapQuality' => '评分',
        'mapGold' => '金牌',
        'mapSilver' => '银牌',
        'mapBronze' => '铜牌',
        'mapDetails' => '详情',
        'mapView' => '查看',
        'mapNickname' => '昵称',
        'mapDiscordTag' => 'Discord 标签',
        'mapTime' => '时间',
        'mapMedal' => '勋章',
        'mapVideo' => '视频',
        'mapXP' => '经验值',
        'mapSkillRank' => '技能排名',
        'mapWR' => '世界纪录',
        'mapMade' => '制作地图',
        'mapPlaytestsVotes' => '测试投票',
        'mapTierRank' => '等级',
        'mapRankDistribution' => '排名分布',
        'mapMechanics' => '技巧',
        'mapRestrictions' => '限制',
        'mapDescription' => '描述',
        'mapUpvotes' => '点赞数',
        'mapVerified' => '已验证',
    ],
];