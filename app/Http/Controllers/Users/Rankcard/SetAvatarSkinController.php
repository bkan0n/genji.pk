<?php

namespace App\Http\Controllers\Users\Rankcard;

use Illuminate\Http\Request;

class SetAvatarSkinController extends BaseRankcardController
{
    public function __invoke(Request $request, int $user_id)
    {
        $data = $request->validate([
            'skin' => ['required', 'string', 'max:64'],
        ]);

        $url = $this->apiRoot() . "/api/v3/users/{$user_id}/rank-card/avatar/skin";
        $resp = $this->request('PUT', $url, $data);

        return $this->proxyOrFail($resp);
    }
}
