<?php

namespace App\Http\Controllers\Map_edit;

use Illuminate\Support\Facades\Log;

class GetPendingEditRequestsController extends BaseMapEditController
{
    public function index()
    {
        if ($this->apiRoot() === '') {
            return $this->missingUpstream();
        }

        $endpoint = $this->endpoint('/api/v3/maps/map-edits/pending');

        try {
            $resp = $this->http()->get($endpoint);
            return $this->passthrough($resp);

        } catch (\Throwable $e) {
            Log::error('GetPendingEditRequests upstream exception', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Upstream exception',
                'error'   => $e->getMessage(),
            ], 502);
        }
    }
}
