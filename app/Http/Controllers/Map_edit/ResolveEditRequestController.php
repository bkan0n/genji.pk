<?php

namespace App\Http\Controllers\Map_edit;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ResolveEditRequestController extends BaseMapEditController
{
    public function update(Request $request, int $edit_id)
    {
        $validator = Validator::make(
            array_merge($request->all(), ['edit_id' => $edit_id]),
            [
                'edit_id'          => ['required', 'integer', 'min:1'],
                'accepted'         => ['required', 'boolean'],
                'resolved_by'      => ['required', 'integer', 'min:1'],
                'rejection_reason' => ['sometimes', 'nullable', 'string', 'max:2000'],
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

        $data = $validator->validated();
        unset($data['edit_id']);

        $endpoint = $this->endpoint('/api/v3/maps/map-edits/' . $edit_id . '/resolve');

        try {
            $resp = $this->http()->put($endpoint, $data);
            return $this->passthrough($resp);

        } catch (\Throwable $e) {
            Log::error('ResolveEditRequest upstream exception', [
                'edit_id' => $edit_id,
                'error'   => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Upstream exception',
                'error'   => $e->getMessage(),
            ], 502);
        }
    }
}
