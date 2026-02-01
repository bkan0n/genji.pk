<?php

namespace App\Http\Controllers\Map_edit;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CreateMapEditRequestController extends BaseMapEditController
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // required
            'code'       => ['required', 'string', 'min:4', 'max:6', 'regex:/^[A-Z0-9]+$/'],
            'created_by' => ['required', 'integer', 'min:1'],
            'reason'     => ['required', 'string', 'min:1', 'max:2000'],

            // optional
            'new_code'       => ['sometimes', 'nullable', 'string', 'min:4', 'max:6', 'regex:/^[A-Z0-9]+$/'],
            'map_name'       => ['sometimes', 'nullable', 'string', 'max:80'],
            'category'       => ['sometimes', 'nullable', 'string', 'max:64'],
            'checkpoints'    => ['sometimes', 'nullable', 'integer', 'min:0', 'max:9999'],
            'difficulty'     => ['sometimes', 'nullable', 'string', 'max:32'],
            'hidden'         => ['sometimes', 'nullable', 'boolean'],
            'archived'       => ['sometimes', 'nullable', 'boolean'],
            'official'       => ['sometimes', 'nullable', 'boolean'],
            'custom_banner'  => ['sometimes', 'nullable', 'string', 'max:255'],
            'title'          => ['sometimes', 'nullable', 'string', 'max:120'],
            'description'    => ['sometimes', 'nullable', 'string', 'max:5000'],

            'mechanics'      => ['sometimes', 'nullable', 'array'],
            'mechanics.*'    => ['string', 'max:64'],

            'restrictions'   => ['sometimes', 'nullable', 'array'],
            'restrictions.*' => ['string', 'max:64'],

            'tags'           => ['sometimes', 'nullable', 'array'],
            'tags.*'         => ['string', Rule::in(['Other Heroes', 'XP Based', 'Custom Grav/Speed'])],

            'medals'         => ['sometimes', 'nullable', 'array'],

            'creators'              => ['sometimes', 'nullable', 'array'],
            'creators.*.id'         => ['required_with:creators', 'integer', 'min:1'],
            'creators.*.is_primary' => ['sometimes', 'boolean'],
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

        $data = $validator->validated();
        $endpoint = $this->endpoint('/api/v3/maps/map-edits');

        try {
            $resp = $this->http()->post($endpoint, $data);

            $status = $resp->status();
            if ($resp->successful() || $status === 201) {
                return $this->passthrough($resp, $endpoint);
            }

            return response()->json([
                'message' => 'Upstream error',
                'status'  => $status,
                'error'   => $resp->json() ?: $resp->body(),
            ], $status ?: 502);

        } catch (\Throwable $e) {
            Log::error('CreateMapEditRequest upstream exception', [
                'code'  => $data['code'] ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Upstream exception',
                'error'   => $e->getMessage(),
            ], 502);
        }
    }
}
