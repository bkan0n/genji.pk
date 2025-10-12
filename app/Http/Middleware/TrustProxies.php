<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustProxies as Middleware;
use Illuminate\Http\Request;

class TrustProxies extends Middleware
{
    protected $proxies;

    protected $headers =
        Request::HEADER_X_FORWARDED_FOR |
        Request::HEADER_X_FORWARDED_HOST |
        Request::HEADER_X_FORWARDED_PORT |
        Request::HEADER_X_FORWARDED_PROTO;

    public function __construct()
    {
        $value = env('TRUST_PROXIES', '*');

        if ($value === '*' || $value === 'any' || $value === 'true') {
            $this->proxies = '*';
        } elseif ($value === '' || $value === 'null' || $value === 'false') {
            $this->proxies = null;
        } else {
            $this->proxies = array_map('trim', explode(',', $value));
        }
    }
}
