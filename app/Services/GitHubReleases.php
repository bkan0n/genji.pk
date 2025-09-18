<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class GitHubReleases
{
    public function latest(int $count = 3): array
    {
        $repo = config('services.github.releases_repo');
        $key = "gh:releases:{$repo}:{$count}";

        return Cache::remember($key, now()->addMinutes(30), function () use ($repo, $count) {
            $http = Http::withHeaders([
                'Accept' => 'application/vnd.github+json',
                'X-GitHub-Api-Version' => '2022-11-28',
                'User-Agent' => config('app.name', 'GenjiParkour'),
            ]);

            if ($token = config('services.github.token')) {
                $http = $http->withToken($token);
            }

            $res = $http->get("https://api.github.com/repos/{$repo}/releases", [
                'per_page' => $count,
            ]);

            if (! $res->ok()) {
                return [];
            }

            return collect($res->json())
                ->take($count)
                ->map(function ($r) {
                    $html = method_exists(Str::class, 'markdown')
                      ? Str::markdown($r['body'] ?? '')
                      : e($r['body'] ?? '');

                    return [
                        'name' => $r['name'] ?: $r['tag_name'],
                        'tag' => $r['tag_name'],
                        'url' => $r['html_url'],
                        'published_at' => $r['published_at'],
                        'body_html' => $html,
                    ];
                })
                ->all();
        });
    }
}
