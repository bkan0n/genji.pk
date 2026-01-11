<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Auth Pages (EN)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // LOGIN
    // ──────────────────────────────────────────────────────────────────────
    'login' => [
        'title' => '准备成为源跑糕手了吗?',
        'subtitle_part_1' => '准备成为',
        'subtitle_part_2' => '源跑糕手了吗?',
        'description' => '登录以同步你的个人资料, 访问个人记录, 获得奖励, 并解锁社区功能',
        'fast' => '快捷',
        'fast_desc' => '一键验证登录',
        'secure' => '安全',
        'secure_desc' => '无需存储密码',
        'sign_in' => '登录',
        'discord_login' => '使用Discord登录',
        'email_login' => '使用电子邮件登录',
        'email_tab' => '邮箱',
        'discord_tab' => 'Discord',
        'email_label' => '邮箱',
        'password_label' => '密码',
        'forgot_password' => '忘记密码?',
        'create_account' => '注册账号',
        'no_account' => "还没有账号?",
        'no_account_action' => '注册',
        'submit_button' => '登录',
        'please_fix' => '请修改:',
        'providers_description' => '请选择你的选项并继续',
        'agreement' => '登录后即表示你同意我们的社区规则',
        'recommended' => '推荐',
        'password_badge' => '密码',
        'remember_me' => '记住我',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // REGISTER
    // ──────────────────────────────────────────────────────────────────────
    'register' => [
        'title' => '创建你的账号',
        'description' => '通过电子邮件注册以解锁个人记录、奖励和社区功能',
        'private' => '保密',
        'private_desc' => '我们不会公开你的电子邮件',
        'verified' => '已验证',
        'verified_desc' => '我们将发送一封验证邮件',
        'sign_up' => '注册',
        'sign_up_title' => '注册',
        'sign_up_desc' => '几秒钟内创建你的电子邮件账号',
        'please_fix' => '请修改:',
        'username_label' => '用户名',
        'email_label' => '电子邮件',
        'password_label' => '密码',
        'password_confirm_label' => '确认密码',
        'username_placeholder' => 'GenjiMain',
        'email_placeholder' => 'you@example.com',
        'password_placeholder' => '••••••••',
        'submit_button' => '创建账号',
        'recommended' => '推荐',
        'password_badge' => '密码',
        'already_have_account' => '已经有账户?',
        'sign_in' => '登录',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FORGOT PASSWORD
    // ──────────────────────────────────────────────────────────────────────
    'forgot_password' => [
        'badge' => '重置密码',
        'title' => '忘记密码了?',
        'description' => '输入你的电子邮件, 我们将发送重置链接',
        'email_label' => '电子邮件',
        'email_placeholder' => 'you@example.com',
        'submit_button' => '发送重置链接',
        'back_to_login' => '返回登录',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // RESET PASSWORD
    // ──────────────────────────────────────────────────────────────────────
    'reset_password' => [
        'badge' => '重置密码',
        'title' => '重置密码',
        'password_label' => '新密码',
        'password_confirm_label' => '确认密码',
        'submit_button' => '重置密码',
        'back_to_login' => '返回登录',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // EMAIL VERIFICATION
    // ──────────────────────────────────────────────────────────────────────
    'verify_email' => [
        'title' => '验证你的电子邮件',
        'description' => '我们已向你发送验证链接, 点击链接以激活你的账户',
        'email_label' => '电子邮件',
        'email_placeholder' => 'you@example.com',
        'resend_button' => '重新发送验证邮件',
        'back_to_login' => '返回登录',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MESSAGES
    // ──────────────────────────────────────────────────────────────────────
    'messages' => [
        'register_success' => '注册成功! 请检查你的电子邮件以验证你的账户',
        'login_success' => '登录成功!',
        'verify_success' => '电子邮件验证成功! 你现在可以访问所有功能',
        'reset_sent' => '如果该电子邮件存在, 重置链接已发送',
        'reset_success' => '密码重置成功! 你现在可以登录',
        'invalid_credentials' => '无效的电子邮件或密码',
        'email_not_verified' => '请验证你的电子邮件以访问所有功能',
        'invalid_reset_link' => '无效的重置链接',
        'registration_failed' => '注册失败',
        'login_failed' => '登录失败（无效的API响应）',
        'reset_failed' => '密码重置失败',
        'verification_resent' => '验证邮件已重新发送',
        'resend_verification_failed' => '无法重新发送验证邮件',
    ],
];
