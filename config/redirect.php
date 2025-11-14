<?php

return [
    'map' => [
        'localhost' => env('REDIRECT_URL_LOCAL', 'http://genji.test/'),
        'dev.genji.pk' => env('REDIRECT_URL_TEST', 'https://dev.genji.pk/'),
        'genji.pk' => env('REDIRECT_URL_PROD', 'https://genji.pk/'),
    ],
];
