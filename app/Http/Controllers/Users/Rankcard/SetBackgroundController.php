<?php

namespace App\Http\Controllers\Users\Rankcard;

use Illuminate\Http\Request;

class SetBackgroundController extends BaseRankcardController
{
    public function __invoke(Request $request, int $user_id)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:64'],
        ]);

        $url = $this->apiRoot() . "/api/v3/users/{$user_id}/rank-card/background";
        $resp = $this->request('PUT', $url, $data);

        return $this->proxyOrFail($resp);
    }
}
