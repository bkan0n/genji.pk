<?php

namespace App\Http\Controllers\Lootbox;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class DrawController extends Controller
{
    public function draw(Request $request, int $user, string $keyType)
    {
        $authId = (int) $request->user()->id;
        abort_unless($authId === $user, Response::HTTP_FORBIDDEN, 'Forbidden');

        $keyType = ucfirst(strtolower($keyType));
        abort_unless(in_array($keyType, ['Classic', 'Winter'], true), 422, 'Invalid key type');

        $amount = (int) $request->integer('amount', 3);
        $amount = max(1, min($amount, 3));

        $client = Http::baseUrl(config('services.genji_api.root'))
            ->withHeaders(['X-API-KEY' => config('services.genji_api.key')])
            ->acceptJson()
            ->withOptions(['verify' => (bool) config('services.genji_api.verify', true)]);

        $res = $client->get('/lootbox/random', [
            'user_id' => $authId,
            'key_type' => $keyType,
            'amount' => $amount,
        ]);

        abort_unless($res->successful(), $res->status(), $res->body());

        $payload = $res->json();
        $rewards = is_array($payload) ? $payload : $payload['rewards'] ?? [];
        abort_unless(is_array($rewards) && count($rewards) > 0, 502, 'Invalid upstream payload');

        $nonce = (string) Str::uuid();
        Cache::put("lootbox:{$authId}:{$nonce}", $rewards, now()->addMinutes(5));

        return response()->json([
            'nonce' => $nonce,
            'rewards' => $rewards,
        ]);
    }
}
