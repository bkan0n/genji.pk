<?php

return [
    'map' => [
        'localhost' => env('REDIRECT_URL_LOCAL', 'http://genji.test/'),
        'test.genji.pk' => env('REDIRECT_URL_TEST', 'https://test.genji.pk/'),
        'genji.pk' => env('REDIRECT_URL_PROD', 'https://genji.pk/'),
    ],
];
