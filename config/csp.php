<?php

use Spatie\Csp\Directive;
use Spatie\Csp\Keyword;

return [
    'policy' => null,
    'report_only' => false,
    'nonce_generator' => App\Support\ViteNonceGenerator::class,

    'directives' => [
        [Directive::BASE, [Keyword::SELF]],
        [Directive::DEFAULT, [Keyword::SELF]],
        [Directive::FORM_ACTION, [Keyword::SELF]],
        [Directive::OBJECT, [Keyword::NONE]],
        [Directive::FRAME_ANCESTORS, [Keyword::NONE]],

        [
            Directive::SCRIPT,
            [
                Keyword::SELF,
                Keyword::STRICT_DYNAMIC,
                'https://browser.sentry-cdn.com',
                'https://static.cloudflareinsights.com',
                'https://ajax.googleapis.com',
                'https://code.jquery.com',
                'https://cdn.jsdelivr.net',
                'https://cdnjs.cloudflare.com',
                'https://kit.fontawesome.com',
                'https://www.youtube.com',
                'https://youtu.be',
            ],
        ],

        [
            Directive::STYLE,
            [
                Keyword::SELF,
                'https://fonts.googleapis.com',
                'https://cdnjs.cloudflare.com',
                'https://use.fontawesome.com',
                'https://kit.fontawesome.com',
            ],
        ],

        [
            Directive::FONT,
            [Keyword::SELF, 'https://fonts.gstatic.com', 'https://use.fontawesome.com', 'data:'],
        ],

        [
            Directive::IMG,
            [
                Keyword::SELF,
                'data:',
                'https://cdn.discordapp.com',
                'https://media.discordapp.net',
                'https://tenor.com',
                'https://media.tenor.com',
                'https://c.tenor.com',
                'https://mdbootstrap.com',
                'https://bkan0n.com',
                'https://cdn.bkan0n.com',
            ],
        ],

        [
            Directive::FRAME,
            [
                Keyword::SELF,
                'https://www.youtube.com',
                'https://tenor.com',
                'https://media.tenor.com',
                'https://c.tenor.com',
            ],
        ],

        [
            Directive::CONNECT,
            [
                Keyword::SELF,
                'https://fonts.googleapis.com',
                'https://fonts.gstatic.com',
                'https://analytics.bkan0n.com',
                'https://glitchtip.genji.pk',
                'https://cdn.jsdelivr.net',
                'data:',
            ],
        ],
    ],
];
