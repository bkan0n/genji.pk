<?php

namespace App\Http\Controllers\Newsfeed;

use const CURLOPT_SSL_VERIFYHOST;
use const CURLOPT_SSL_VERIFYPEER;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use League\CommonMark\GithubFlavoredMarkdownConverter;
use Throwable;

use function count;

class ChangelogsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $limit = max(1, min(8, (int) $request->query('limit', 1)));

        $payload = Cache::remember("gh:releases:{$limit}", 600, function () use ($limit) {
            try {
                $repo   = (string) (config('services.github.genji_repo') ?? 'tylovejoy/genji-framework');
                $token  = (string) config('services.github.token', '');
                $verify = filter_var(config('services.genji_api.verify', true), FILTER_VALIDATE_BOOLEAN);

                $client = Http::withHeaders([
                    'Accept'               => 'application/vnd.github.html+json',
                    'X-GitHub-Api-Version' => '2022-11-28',
                    'User-Agent'           => 'GenjiParkour/1.0',
                ])->withOptions([
                    'verify'          => $verify,
                    'timeout'         => 10,
                    'connect_timeout' => 5,
                    'curl'            => [
                        CURLOPT_SSL_VERIFYPEER => $verify ? 1 : 0,
                        CURLOPT_SSL_VERIFYHOST => $verify ? 2 : 0,
                    ],
                ]);

                if ($token !== '') {
                    $client = $client->withToken($token);
                }

                $res = $client->get("https://api.github.com/repos/{$repo}/releases", [
                    'per_page' => $limit,
                ]);

                if ($res->status() === 403 && str_contains((string) $res->body(), 'rate limit')) {
                    return ['rate_limited' => true, 'releases' => []];
                }

                if (! $res->ok()) {
                    return ['releases' => []];
                }

                $out = [];
                foreach ((array) $res->json() as $r) {
                    if (count($out) >= $limit) {
                        break;
                    }

                    $name       = $r['name'] ?? ($r['tag_name'] ?? 'Release');
                    $tag        = $r['tag_name'] ?? '';
                    $url        = $r['html_url'] ?? '';
                    $published  = $r['published_at'] ?? ($r['created_at'] ?? null);
                    $bodyMd     = (string) ($r['body'] ?? '');
                    $bodyHtml   = (string) ($r['body_html'] ?? '');

                    if ($bodyHtml === '' && $bodyMd !== '') {
                        try {
                            if (class_exists(GithubFlavoredMarkdownConverter::class)) {
                                $conv     = new GithubFlavoredMarkdownConverter();
                                $bodyHtml = $conv->convert($bodyMd)->getContent();
                            } else {
                                $bodyHtml = nl2br(e($bodyMd));
                            }
                        } catch (Throwable $e) {
                            $bodyHtml = nl2br(e($bodyMd));
                        }
                    }

                    $out[] = [
                        'name'         => $name,
                        'tag'          => $tag,
                        'url'          => $url,
                        'published_at' => $published,
                        'html'         => $bodyHtml,
                        'lines'        => $this->extractBulletLines($bodyMd, 8),
                    ];
                }

                return ['releases' => $out];
            } catch (Throwable $e) {
                report($e);

                return [
                    'releases' => [],
                    'error'    => 'github_failed',
                ];
            }
        });

        return response()->json($payload, 200, [], JSON_UNESCAPED_UNICODE);
    }

    private function extractBulletLines(string $markdown, int $max = 8): array
    {
        $lines = [];

        foreach (preg_split('/\r?\n/', $markdown) as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '<!--')) {
                continue;
            }

            if (preg_match('/^#{2,3}\s*(.+)$/', $line, $m)) {
                $lines[] = trim($m[1]);
            }
            elseif (preg_match('/^[-*•]\s*(.+)$/', $line, $m)) {
                $lines[] = trim($m[1]);
            }

            if (count($lines) >= $max) {
                break;
            }
        }

        if (empty($lines)) {
            foreach (preg_split('/\r?\n/', $markdown) as $line) {
                $line = trim($line);
                if ($line !== '') {
                    $lines[] = $line;
                }
                if (count($lines) >= $max) {
                    break;
                }
            }
        }

        return $lines;
    }
}
