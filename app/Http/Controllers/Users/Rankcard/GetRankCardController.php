<?php

namespace App\Http\Controllers\Users\Rankcard;

use Illuminate\Http\Request;

class GetRankCardController extends BaseRankcardController
{
    public function __invoke(Request $request, int $user_id)
    {
        $validated = $request->validate([
            'filter' => ['nullable', 'string', 'in:official_playable,official_all,unofficial_playable,unofficial_all'],
        ]);

        $url = $this->apiRoot() . "/api/v3/users/{$user_id}/rank-card";
        if (! empty($validated['filter'])) {
            $url .= '?' . http_build_query(['filter' => $validated['filter']]);
        }

        $resp = $this->request('GET', $url);

        return $this->proxyOrFail($resp);
    }
}
