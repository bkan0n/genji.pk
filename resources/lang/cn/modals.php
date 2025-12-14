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
        'na' => '无',
        'no_description' => '暂无描述',
        'error' => '错误',
        'loading' => '加载中...',
        'to_see_details' => '查看详情！',
        'timestamp_format' => '{year}年{month}{day}日 {AMorPM}{hour}:{minute}',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // CREDITS MODAL
    // ──────────────────────────────────────────────────────────────────────
    'credits' => [
        'title' => '鸣谢',
        'website_creators' => '网站制作人员',
        'translation_contributors' => '翻译贡献者',
        'close' => '关闭鸣谢弹窗',

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
            'overwatch' => '守望先锋用户名',
            'notifications' => '通知',
        ],
        'overwatch' => [
            'confirm' => '确认',
        ],
        'notifications' => [
            'dm_on_verification' => '验证通过时私信我',
            'dm_on_skill_role_update' => '技能身份组更新时私信我',
            'dm_on_lootbox_gain' => '获得战利品箱时私信我',
            'ping_on_xp_gain' => '获得经验值时 @ 我',
            'ping_on_mastery' => '精通达成时 @ 我',
            'ping_on_community_rank_update' => '社区排名更新时 @ 我',
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
        'login_required_btn' => '需要登录',
        'login_required_msg' => '此页面需要登录',
        'login_required_pr' => '需要登录才能查看个人记录',
        'login_required_filter' => '需要登录才能使用此筛选器',
        'login_required_progression' => '请登录以查看你的进度',
        'map_code_required' => '请输入地图代码',
        'no_results' => '未找到结果',
        'filter_applied' => '已应用筛选 {filterId}：{value}',
        'filters_cleared' => '所有筛选已清除',
        'enter_username' => '请输入有效的用户名',
        'username_updated' => '你的用户名已更新',
        'primary_username_updated' => '主用户名已更新',
        'already_exist_username' => '用户名已存在',
        'set_primary_username' => '设为主用户名',
        'delete_username' => '删除用户名',
        'no_username_set' => '未设置用户名',
        'confirm_button' => '确认',
    ],
];