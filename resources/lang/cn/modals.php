<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Modals (ZH)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // COMMON
    // ──────────────────────────────────────────────────────────────────────
    'common' => [
        'na'               => '无',
        'no_description'   => '暂无描述',
        'error'            => '错误',
        'loading'          => '加载中...',
        'to_see_details'   => '查看详情！',
        'timestamp_format' => '{year}年{month}{day}日 {AMorPM}{hour}:{minute}',
    ],


    // ──────────────────────────────────────────────────────────────────────
    // NOTIFICATIONS
    // ──────────────────────────────────────────────────────────────────────
    'notifications' => [
        'title'          => '通知',
        'empty'          => '暂无通知',
        'load_more'      => '加载更多',
        'mark_all_read'  => '全部标为已读',
        'dismiss_all'    => '全部忽略',
        'bell_aria'      => '打开通知',
        'dismiss'        => '忽略',
        'fallback_title' => '通知',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // CREDITS MODAL
    // ──────────────────────────────────────────────────────────────────────
    'credits' => [
        'title'                     => '鸣谢',
        'website_creators'          => '网站制作人员',
        'translation_contributors'  => '翻译贡献者',
        'close'                     => '关闭鸣谢弹窗',

        'role_backend'   => '后端',
        'role_frontend'  => '前端',
        'note_backend'   => 'API、数据模型与机器人集成。',
        'note_frontend'  => 'UI/UX、地图浏览与 OCR 集成。',
        'discord_label'  => 'Discord',

        'thanks' => '感谢所有为 Genji Parkour 项目做出贡献的人。',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // SETTINGS MODAL
    // ──────────────────────────────────────────────────────────────────────
    'settings' => [
        'title' => '设置',
        'tabs' => [
            'overwatch'     => '守望先锋用户名',
            'notifications' => '通知',
        ],
        'overwatch' => [
            'confirm' => '确认',
        ],
        'notifications' => [
            'dm_on_verification'              => '验证通过时私信我',
            'dm_on_skill_role_update'         => '技能身份组更新时私信我',
            'dm_on_lootbox_gain'              => '获得战利品箱时私信我',
            'ping_on_xp_gain'                 => '获得经验值时 @ 我',
            'ping_on_mastery'                 => '精通达成时 @ 我',
            'ping_on_community_rank_update'   => '社区排名更新时 @ 我',

            'channels' => [
                'web'          => 'Web',
                'discord_dm'   => 'Discord 私信',
                'discord_ping' => 'Discord 提及',
            ],
            'columns' => [
                'event' => '事件',
            ],
            'help'                => '选择你希望在每个事件与渠道接收的通知。',
            'footer_hint'         => 'API 返回的新事件类型将在打开此窗口时自动添加。',
            'discord_unavailable' => 'Email 账户无法使用 Discord 通知。',
            'events' => [
                'verification_approved'     => '验证通过',
                'verification_rejected'     => '验证被拒绝',
                'auto_verify_failed'        => '自动验证失败',
                'record_removed'            => '记录已移除',
                'skill_role_update'         => '技能身份组更新',
                'xp_gain'                   => '获得经验值',
                'rank_up'                   => '升级',
                'prestige'                  => '声望提升',
                'mastery_earned'            => '精通达成',
                'lootbox_earned'            => '获得战利品箱',
                'playtest_update'           => '测试更新',
                'record_edited'             => '记录已编辑',
                'map_edit_approved'         => '地图编辑已批准',
                'map_edit_rejected'         => '地图编辑已拒绝',
                'quest_complete'            => '任务已完成',
                'quest_rotation'            => '任务轮换',
                'quest_rival_mention'       => '任务对手提及',
            ],

        ],
        'close' => '关闭设置弹窗',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PROFILE MODAL
    // ──────────────────────────────────────────────────────────────────────
    'profile' => [
        'copy' => '复制',
        'dashboard' => '仪表盘',
        'settings' => '设置',
        'logout' => '退出登录',
        'close' => '关闭个人资料弹窗',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // POPUP / MISC
    // ──────────────────────────────────────────────────────────────────────
    'popup' => [
        'login_required_btn'             => '需要登录',
        'login_required_msg'             => '此页面需要登录',
        'login_required_pr'              => '需要登录才能查看个人记录',
        'login_required_filter'          => '需要登录才能使用此筛选器',
        'login_required_progression'     => '请登录以查看你的进度',
        'map_code_required'              => '请输入地图代码',
        'no_results'                     => '未找到结果',
        'filter_applied'                 => '已应用筛选 {filterId}：{value}',
        'filters_cleared'                => '所有筛选已清除',
        'enter_username'                 => '请输入有效的用户名',
        'username_updated'               => '你的用户名已更新',
        'primary_username_updated'       => '主用户名已更新',
        'already_exist_username'         => '用户名已存在',
        'set_primary_username'           => '设为主用户名',
        'delete_username'                => '删除用户名',
        'no_username_set'                => '未设置用户名',
        'confirm_button'                 => '确认',
        'primary'                        => 'Primary',
        'no_user_id'                     => 'No user ID',
        'max_usernames_allowed'          => 'Maximum 3 usernames allowed',
        'error_loading_username'         => 'Error loading username',
        'error_update_usernames_list'    => 'Error while updating the usernames list',
        'error_delete_username'          => 'Error while deleting the username',
        'error_set_primary_username'     => 'Error while setting primary username',
        'error_add_username'             => 'Error while adding the username',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // RULES MODAL
    // ──────────────────────────────────────────────────────────────────────
    'rules' => [
        'title' => '社区规则',
        'close' => '关闭规则弹窗',

        'rule_1_title' => '1. 相互尊重',
        'rule_1_text'  => '这意味着不要发表刻薄、无礼或骚扰他人的评论。按照你希望被对待的方式对待他人。',

        'rule_2_title' => '2. 不要用 Discord 来发垃圾信息、操纵互动或破坏他人的体验',
        'rule_2_text'  => '包括试图用机器人、虚假账户、多个账户或其他自动化方式来影响或破坏对话。',

        'rule_3_title' => '3. 禁止使用不当语言',
        'rule_3_text'  => '脏话的使用应保持在合理的最低水平。任何针对任何用户的贬低性语言都被禁止。',

        'rule_4_title' => '4. 禁止色情/成人/其他不适宜工作场合的内容',
        'rule_4_text'  => '这是一个社区服务器，不适合分享此类材料。',

        'rule_5_title' => '5. 不要分享你的个人信息',
        'rule_5_text'  => '未经他人同意，不要分享你或其他用户的个人信息。这包括电话号码、地址和任何其他敏感信息。',

        'rule_6_title' => '6. 遵守各频道特定的指南',
        'rule_6_text'  => '服务器中的每个频道都应该有关于允许的内容类型的特定指南。确保遵守这些指南并尊重每个频道的目的。',

        'rule_7_title' => '7. 禁止分享或分发黑客、作弊或其他未经授权的工具或服务',
        'rule_7_text'  => '在服务器上严格禁止分享或分发黑客、作弊或其他未经授权的工具或服务。',
    ],
];