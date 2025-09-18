<?php

return [
    'signing_key' => env('LOOTBOX_SIGNING_KEY', config('app.key')),
    'token_ttl' => env('LOOTBOX_TOKEN_TTL', 120),
    'cache_prefix' => 'lootbox:jti:',
];
