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
        'title' => 'Ready to scale your parkour career?',
        'subtitle_part_1' => 'Ready to scale your',
        'subtitle_part_2' => 'parkour career?',
        'description' => 'Log in to sync your profile, access personal records, earn rewards and unlock community features — all with one click.',
        'fast' => 'Fast',
        'fast_desc' => 'One-click OAuth login.',
        'secure' => 'Secure',
        'secure_desc' => 'No passwords stored.',
        'sign_in' => 'Sign in',
        'discord_login' => 'Continue with Discord',
        'email_login' => 'Sign in with Email',
        'email_tab' => 'Email',
        'discord_tab' => 'Discord',
        'email_label' => 'Email',
        'password_label' => 'Password',
        'forgot_password' => 'Forgot password?',
        'create_account' => 'Create account',
        'no_account' => "Don't have an account?",
        'no_account_action' => 'Sign up',
        'submit_button' => 'Log In',
        'please_fix' => 'Please fix:',
        'providers_description' => 'Continue with your preferred provider.',
        'agreement' => 'By continuing, you agree to our community rules.',
        'recommended' => 'Recommended',
        'password_badge' => 'Password',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // REGISTER
    // ──────────────────────────────────────────────────────────────────────
    'register' => [
        'title' => 'Create your account',
        'description' => 'Register with email to unlock personal records, rewards, and community features.',
        'private' => 'Private',
        'private_desc' => "We don't expose your email publicly.",
        'verified' => 'Verified',
        'verified_desc' => "We'll send a verification email.",
        'sign_up' => 'Sign up',
        'sign_up_title' => 'Sign up',
        'sign_up_desc' => 'Create your email account in seconds.',
        'please_fix' => 'Please fix:',
        'username_label' => 'Username',
        'email_label' => 'Email',
        'password_label' => 'Password',
        'password_confirm_label' => 'Confirm password',
        'username_placeholder' => 'GenjiMain',
        'email_placeholder' => 'you@example.com',
        'password_placeholder' => '••••••••',
        'submit_button' => 'Create account',
        'recommended' => 'Recommended',
        'password_badge' => 'Password',
        'already_have_account' => 'Already have an account?',
        'sign_in' => 'Sign in',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FORGOT PASSWORD
    // ──────────────────────────────────────────────────────────────────────
    'forgot_password' => [
        'badge' => 'Password reset',
        'title' => 'Forgot your password?',
        'description' => "Enter your email and we'll send you a reset link.",
        'email_label' => 'Email',
        'email_placeholder' => 'you@example.com',
        'submit_button' => 'Send reset link',
        'back_to_login' => 'Back to login',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // RESET PASSWORD
    // ──────────────────────────────────────────────────────────────────────
    'reset_password' => [
        'badge' => 'Password reset',
        'title' => 'Reset password',
        'password_label' => 'New password',
        'password_confirm_label' => 'Confirm password',
        'submit_button' => 'Reset password',
        'back_to_login' => 'Back to login',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // EMAIL VERIFICATION
    // ──────────────────────────────────────────────────────────────────────
    'verify_email' => [
        'title' => 'Verify your email',
        'description' => 'We sent you a verification link. Click it to activate your account.',
        'email_label' => 'Email',
        'email_placeholder' => 'you@example.com',
        'resend_button' => 'Resend verification email',
        'back_to_login' => 'Back to login',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MESSAGES
    // ──────────────────────────────────────────────────────────────────────
    'messages' => [
        'register_success' => 'Registration successful! Please check your email to verify your account.',
        'login_success' => 'Login successful!',
        'verify_success' => 'Email verified successfully! You can now access all features.',
        'reset_sent' => 'If an account exists with this email, a reset link has been sent.',
        'reset_success' => 'Password reset successfully! You can now log in.',
        'invalid_credentials' => 'Invalid email or password.',
        'email_not_verified' => 'Please verify your email to access all features.',
        'invalid_reset_link' => 'Invalid reset link.',
        'registration_failed' => 'Registration failed.',
        'login_failed' => 'Login failed (invalid API response).',
        'reset_failed' => 'Password reset failed.',
        'verification_resent' => 'Verification email has been resent.',
        'resend_verification_failed' => 'Unable to resend verification email.',
    ],
];
