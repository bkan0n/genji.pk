<?php

namespace App\Support;

use Spatie\Csp\Nonce\NonceGenerator;

class ViteNonceGenerator implements NonceGenerator
{
    private const ATTR = '_csp_nonce';

    public function generate(): string
    {
        $request = request();

        if ($request && $request->attributes->has(self::ATTR)) {
            return (string) $request->attributes->get(self::ATTR);
        }

        $nonce = rtrim(strtr(base64_encode(random_bytes(16)), '+/', '-_'), '=');

        if ($request) {
            $request->attributes->set(self::ATTR, $nonce);
        }

        return $nonce;
    }
}
