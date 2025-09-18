<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Services tiers
    |--------------------------------------------------------------------------
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'genji_api' => [
        'root' => env('X_API_ROOT', ''),
        'key' => env('X_API_KEY', ''),
        'verify' => env('X_API_VERIFY', true),
    ],

    'discord' => [
        'client_id' => env('DISCORD_CLIENT_ID', ''),
        'client_secret' => env('DISCORD_CLIENT_SECRET', ''),
        'redirect' => env('DISCORD_REDIRECT_URI', ''),
        'authorize_url' => 'https://discord.com/api/oauth2/authorize',
        'token_url' => 'https://discord.com/api/oauth2/token',
        'scope' => env('DISCORD_SCOPE', ''),
        'bot_token' => env('DISCORD_BOT_TOKEN', ''),
        'guild_id' => env('DISCORD_GUILD_ID'),
        'mod_roles' => array_filter(explode(',', (string) env('DISCORD_MODERATOR_ROLE_IDS'))),
        'allow_gif_avatars' => (bool) env('DISCORD_AVATAR_GIF', true),
        'avatar_default_extension' => env('DISCORD_EXTENSION_DEFAULT', 'png'),
    ],

    'tenor' => [
        'key' => env('TENOR_API_KEY', ''),
    ],

    'translation_api' => [
        'root' => env('TRANSLATION_API_ROOT', ''),
        'key' => env('TRANSLATION_API_KEY', ''),
        'verify' => env('TRANSLATION_API_VERIFY', true),
    ],

    'github' => [
        'token' => env('GITHUB_TOKEN'),
        'releases_repo' => env('GITHUB_RELEASES_REPO', 'tylovejoy/genji-framework'),
    ],
];
