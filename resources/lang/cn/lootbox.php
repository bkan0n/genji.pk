<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Lootbox (ZH)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // META
    // ──────────────────────────────────────────────────────────────────────
    'meta' => [
        'title'           => '源氏跑酷 - 补给箱',
        'og' => [
            'title'       => 'Lootbox — Genji Parkour',
            'description' => 'Open packs, earn rewards, and collect cosmetics.',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // HEADER
    // ──────────────────────────────────────────────────────────────────────
    'header' => [
        'title'      => '补给箱',
        'subtitle'   => '开箱 · 装饰 · 物品',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // UI
    // ──────────────────────────────────────────────────────────────────────
    'ui' => [
        'give_key'           => 'Give key',
        'open_pack'          => '开箱',
        'select_key_type'    => '选择箱子类型',
        'info'               => '详情',
        'close_modal'        => '关闭',

        'loading_3d'              => '正在加载 3D 场景…',
        'loading_3d_failed_title' => '3D 加载失败',
        'loading_3d_failed_desc'  => '请尝试刷新页面，或禁用较重的浏览器扩展。',
        'retry'                   => '重试',

        'pick_a_card'     => '选择一张卡面',
        'rewards_types' => [
            'spray'       => '喷漆',
            'skin'        => '皮肤',
            'pose'        => '姿势',
            'background'  => '背景',
            'coins'       => '金币',
        ],

        'common'                => '普通',
        'rare'                  => '稀有',
        'epic'                  => '史诗',
        'legendary'             => '传说',

        'drop_rates'            => '抽取概率',
        'lootbox_infos'         => '当你升级时你会获得1个箱子, 比如: 从 Newcomer I → Newcomer II',

        'no_keys_available'     => '还没有箱子哦',
        'session_expired'       => '对话过期, 请打开新箱子',
        'error_fetching_keys'   => '开箱时出错',
        'error_loading_rewards' => '加载奖励出错',

        'key_types' => [
            'Classic' => '经典',
            'Winter'  => '圣诞节',
            'Spring' => '春季',
            'Autumn' => '秋季',
            'Summer' => '夏季',
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // STORE
    // ──────────────────────────────────────────────────────────────────────
    'store' => [
        'title'                     => '商店',
        'subtitle'                  => '轮换 • 钥匙 • 购买',

        'coins_label'               => '金币',

        'rotation_title'            => '当前轮换',
        'refresh'                   => '刷新',

        'buy_keys_title'            => '购买钥匙',
        'buy_keys_subtitle'         => '已包含批量折扣',

        'price_label'               => '价格',
        'purchase_keys'             => '购买钥匙',

        'purchase_history_title'    => '购买记录',
        'purchase_history_subtitle' => '最新交易',

        'loading_rotation'          => '正在加载轮换…',
        'available_until'           => '截止日期：:date',
        'rotation_number'           => '轮换 #:id',

        'login_required'            => '需要登录。',
        'login_required_store'      => '使用商店需要登录。',
        'login_required_purchases'  => '登录后查看购买记录。',

        'no_items_rotation'         => '轮换中没有物品。',
        'no_purchases'              => '暂无购买记录。',

        'price'                     => '价格',
        'paid'                      => '已支付',
        'owned'                     => '已拥有',
        'buy'                       => '购买',
        'item'                      => '物品',

        'item_purchased'            => '购买成功！',
        'keys_purchased'            => '钥匙购买成功！',
        'purchase_failed'           => '购买失败。',
        'store_refreshed'           => '商店已刷新',

        'discount'                  => '折扣：:percent%',
        'no_discount'               => '无折扣',

        'image_unavailable'         => '图片不可用',
        'no_image'                  => '无图片',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // POPUP / ERRORS
    // ──────────────────────────────────────────────────────────────────────
    'popup' => [
        'error_generic'      => '出错了, 请重试',
        'network_error'      => '网络异常',
        'unexpected_format'  => '未知格式',
        'click_required'     => '需要用户点击',
        'login_required_msg' => '请登录',
        'login_required_btn' => '登录',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // LOOTBOX
    // ──────────────────────────────────────────────────────────────────────
    'lootbox' => [
        'no_keys_available' => '没有箱子可以打开',
        'session_expired'   => '对话过期, 请开箱',
    ],
];
