<?php

namespace App\Http\Controllers\Newsfeed;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Throwable;

class GifController extends Controller
{
    public function show(Request $request)
    {
        $request->validate([
            'gifId' => ['required', 'string', 'max:64'],
        ]);

        $gifId = $request->query('gifId');

        $tenorApiKey = Config::get('services.tenor.key', env('TENOR_API_KEY'));
        if (! $tenorApiKey) {
            return response()->json(['error' => 'Clé Tenor manquante (TENOR_API_KEY)'], 500);
        }

        $apiUrl = "https://tenor.googleapis.com/v2/posts?ids={$gifId}&key={$tenorApiKey}";

        try {
            $resp = Http::timeout(12)->acceptJson()->get($apiUrl);
            if (! $resp->ok()) {
                return response()->json(
                    [
                        'error' => 'Erreur lors de la récupération du GIF.',
                        'status' => $resp->status(),
                    ],
                    502,
                );
            }

            return response($resp->body(), 200)->header('Content-Type', 'application/json');
        } catch (Throwable $e) {
            return response()->json(['error' => 'Erreur lors de la récupération du GIF.'], 500);
        }
    }
}
