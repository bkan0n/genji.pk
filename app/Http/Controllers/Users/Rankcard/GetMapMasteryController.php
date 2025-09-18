<?php

namespace App\Http\Controllers\Users\Rankcard;

use Illuminate\Http\Request;

class GetMapMasteryController extends BaseRankcardController
{
    public function __invoke(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer'],
            'map_name' => ['nullable', 'string', 'max:64'],
        ]);

        $qs = http_build_query(
            array_filter(
                [
                    'user_id' => $data['user_id'],
                    'map_name' => $data['map_name'] ?? null,
                ],
                static fn ($v) => ! is_null($v) && $v !== '',
            ),
        );

        $url = $this->apiRoot() . '/api/v3/maps/mastery' . ($qs ? '?' . $qs : '');
        $resp = $this->request('GET', $url);

        return $this->proxyOrFail($resp);
    }
}
