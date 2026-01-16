<?php

namespace App\Http\Controllers\Map_edit;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class GetUsersEditRequestsController extends BaseMapEditController
{
    public function index(Request $request, int $user_id)
    {
        $validator = Validator::make(
            array_merge($request->query(), ['user_id' => $user_id]),
            [
                'user_id'          => ['required', 'integer', 'min:1'],
                'include_resolved' => ['sometimes', 'boolean'],
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Bad request',
                'errors'  => $validator->errors(),
            ], 400);
        }

        if ($this->apiRoot() === '') {
            return $this->missingUpstream();
        }

        $includeResolved = (bool) ($validator->validated()['include_resolved'] ?? false);
        $qs = http_build_query(['include_resolved' => $includeResolved ? 'true' : 'false']);

        $endpoint = $this->endpoint('/api/v3/maps/map-edits/user/' . $user_id . '?' . $qs);

        try {
            $resp = $this->http()->get($endpoint);
            return $this->passthrough($resp);

        } catch (\Throwable $e) {
            Log::error('GetUsersEditRequests upstream exception', [
                'user_id' => $user_id,
                'error'   => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Upstream exception',
                'error'   => $e->getMessage(),
            ], 502);
        }
    }
}
