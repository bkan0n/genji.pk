<?php

return [
    // Narrow this comma-separated list to the VPS Caddy IP/subnet when possible.
    'proxies' => array_values(array_filter(array_map('trim', explode(',', (string) env(
        'TRUSTED_PROXIES',
        '127.0.0.1,::1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,fc00::/7',
    ))))),
];
