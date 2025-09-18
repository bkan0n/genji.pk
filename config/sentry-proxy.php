<?php

return [
    'dsn' => env('SENTRY_DSN'),
    'verify_ssl' => (bool) env('SENTRY_PROXY_VERIFY_SSL', true),
    'client' => env('SENTRY_PROXY_CLIENT', 'laravel-proxy/1.0'),
];
