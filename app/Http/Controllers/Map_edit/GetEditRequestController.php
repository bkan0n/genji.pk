<?php

namespace App\Http\Controllers\Map_edit;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class GetEditRequestController extends BaseMapEditController
{
    public function show(Request $request, int $edit_id)
    {
        $validator = Validator::make(['edit_id' => $edit_id], [
            'edit_id' => ['required', 'integer', 'min:1'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Bad request',
                'errors'  => $validator->errors(),
            ], 400);
        }

        if ($this->apiRoot() === '') {
            return $this->missingUpstream();
        }

        $endpoint = $this->endpoint('/api/v3/maps/map-edits/' . $edit_id);

        try {
            $resp = $this->http()->get($endpoint);
            return $this->passthrough($resp);

        } catch (\Throwable $e) {
            Log::error('GetEditRequest upstream exception', [
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
