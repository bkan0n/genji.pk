<?php

namespace App\Http\Controllers\Users\Rankcard;

use Illuminate\Http\Request;

class SetBadgeSettingsController extends BaseRankcardController
{
    public function __invoke(Request $request, int $user_id)
    {
        $rules = [];
        foreach (range(1, 6) as $i) {
            $rules["badge_name{$i}"] = ['nullable', 'string', 'max:64'];
            $rules["badge_type{$i}"] = ['nullable', 'string', 'max:64'];
            $rules["badge_url{$i}"] = ['nullable', 'url', 'max:2048'];
        }
        $data = $request->validate($rules);

        $url = $this->apiRoot() . "/api/v3/users/{$user_id}/rank-card/badges";
        $resp = $this->request('PUT', $url, $data);

        return $this->proxyOrFail($resp);
    }
}
