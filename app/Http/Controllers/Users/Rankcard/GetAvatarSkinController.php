<?php

namespace App\Http\Controllers\Users\Rankcard;

use Illuminate\Http\Request;

class GetAvatarSkinController extends BaseRankcardController
{
    public function __invoke(Request $request, int $user_id)
    {
        $url = $this->apiRoot() . "/api/v3/users/{$user_id}/rank-card/avatar/skin";
        $resp = $this->request('GET', $url);

        return $this->proxyOrFail($resp);
    }
}
