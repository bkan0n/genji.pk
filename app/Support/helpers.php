<?php

if (! function_exists('csp_nonce')) {
    function csp_nonce(): string
    {
        if (app()->bound('csp-nonce')) {
            return app('csp-nonce');
        }

        $nonce = base64_encode(random_bytes(16));
        app()->instance('csp-nonce', $nonce);

        return $nonce;
    }
}
