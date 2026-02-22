# Genji Parkour

Community platform for the Overwatch Genji parkour scene. Leaderboards, map search, submissions, playtests, newsfeed, statistics, rank cards, a lootbox system, and an OverPy-to-Workshop convertor — all powered by an external API with a Laravel 12 frontend.

Live at [genji.pk](https://genji.pk) | Dev at [dev.genji.pk](https://dev.genji.pk)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 12, PHP 8.3+ |
| Frontend | Blade templates, per-page JS modules, Tailwind CSS v4 |
| Build | Vite 7 |
| Auth | Discord OAuth (Socialite) |
| Data | API-first — all data from the external Genji API |
| Error tracking | Sentry (PHP + browser) |
| Security | Strict CSP with nonce-based scripts (spatie/laravel-csp) |
| i18n | EN, FR, CN, RU |
| Deployment | Docker (PHP 8.3 + Unit), GitHub Actions CI/CD |

## Prerequisites

- PHP >= 8.3.6
- Composer 2
- Node >= 20 and npm

## Local Setup

```bash
git clone <repo-url> genji.pk && cd genji.pk
cp .env.example .env
composer install
npm install
php artisan key:generate
```

Configure your `.env` with the required service credentials (see [Environment Variables](#environment-variables) below).

Start everything in one command:

```bash
composer dev
```

This runs concurrently:
- `php artisan serve` — Laravel dev server (port 8000)
- `npm run dev` — Vite HMR (port 5173)
- `php artisan queue:listen` — Queue worker
- `php artisan pail` — Log tailing

Or run them individually if you prefer.

## Available Commands

| Command | Description |
|---------|-------------|
| `composer dev` | Start all dev services concurrently |
| `composer test` | Run Pest/PHPUnit test suite |
| `composer lint` | Lint PHP (Duster) + JS/CSS/Blade (Prettier) |
| `composer fix` | Auto-fix PHP + JS/CSS/Blade formatting |
| `npm run build` | Production Vite build |
| `npm run dev` | Vite dev server with HMR |
| `npm run format` | Prettier format all files |
| `npm run format:check` | Prettier check without writing |

## Environment Variables

The app is API-first. Most data comes from the external Genji API, so you need valid API credentials to develop locally.

| Variable                      | Purpose                                              |
|-------------------------------|------------------------------------------------------|
| `X_API_ROOT`                  | Genji API base URL                                   |
| `X_API_KEY`                   | Genji API key                                        |
| `X_API_VERIFY`                | SSL verification for API calls                       |
| `DISCORD_CLIENT_ID`           | Discord OAuth app client ID                          |
| `DISCORD_CLIENT_SECRET`       | Discord OAuth app client secret                      |
| `DISCORD_BOT_TOKEN`           | Bot token for moderator role checks and notifications |
| `DISCORD_GUILD_ID`            | Discord server ID for guild membership verification  |
| `DISCORD_MODERATOR_ROLE_IDS`  | Comma-separated role IDs for mod panel access        |
| `TENOR_API_KEY`               | GIF search in newsfeed                               |
| `TRANSLATION_API_ROOT`        | Server-side translation service URL                  |
| `TRANSLATION_API_KEY`         | Translation service key                              |
| `TRANSLATION_API_VERIFY`      | SSL verification for translation API                 |
| `SENTRY_DSN`                  | Sentry error tracking DSN (server)                   |
| `SENTRY_ENVIRONMENT`          | Sentry environment label                             |
| `VITE_SENTRY_DSN`             | Sentry DSN for browser SDK                           |
| `VITE_APP_ENV`                | App environment exposed to frontend                  |
| `VITE_APP_RELEASE`            | Release version exposed to frontend                  |
| `BATTLENET_CLIENT_ID`         | Battle.net OAuth client ID                           |
| `BATTLENET_CLIENT_SECRET`     | Battle.net OAuth secret                              |
| `GITHUB_TOKEN`                | GitHub API for fetching OverPy releases              |
| `SESSION_SECURE_COOKIE`       | Enable secure cookies (set `true` in production)     |
| `SESSION_DOMAIN`              | Cookie domain scope                                  |

## Project Structure

```
app/
├── Console/              Kernel (no custom commands)
├── Extensions/           Custom session handler
├── Http/
│   ├── Controllers/      ~100 controllers across 16 domains
│   │   ├── Auth/         Discord & email authentication
│   │   ├── Maps/         Search, submit, guides, playtests
│   │   ├── Completions/  Records, leaderboard, voting
│   │   ├── Community/    Leaderboard, statistics
│   │   ├── Lootbox/      Keys, rewards, coins
│   │   ├── Newsfeed/     News, changelogs, emojis, GIFs
│   │   ├── Users/        Profiles, settings, rank card
│   │   ├── Mods/         Moderator panel
│   │   └── ...
│   └── Middleware/       14 custom middleware (auth, locale, CSP, Sentry)
├── Models/               User model (session auth)
├── Services/
│   ├── GenjiApiService   Central wrapper for the external Genji API
│   └── GitHubReleases    Fetch OverPy release info
├── Support/
│   ├── helpers.php       csp_nonce(), cdn_asset()
│   └── Translations.php  i18n management
└── Providers/

resources/
├── views/                Blade templates (layouts, pages, partials, modals)
├── js/
│   ├── app.js            Bootstrap & global setup
│   ├── pages/            Per-page JS (leaderboard, search, submit, etc.)
│   ├── components/       Reusable UI components
│   └── utils/            API client, translations, animations
├── css/                  Tailwind + custom styles
└── lang/                 EN, FR, CN, RU translation files

routes/
├── web.php               ~35 page routes
└── api.php               ~100 API proxy routes
```

## Architecture

### API-First

The app is a frontend client for the Genji API. `GenjiApiService` wraps all external API calls with authentication headers (`X-API-KEY`). There is no local database — all data lives in the external API.

### Authentication

1. **Discord OAuth** (primary) — Users log in via Discord. The app stores session data including user ID, name, and coins. A `remember_token` cookie enables persistent login across sessions.
2. **Moderator access** — Verified by checking Discord role IDs against `DISCORD_MODERATOR_ROLE_IDS`.

### Content Security Policy

The app enforces a strict CSP via `spatie/laravel-csp`. All scripts must include a nonce:

```blade
@php($nonce = csp_nonce())
<script nonce="{{ $nonce }}" src="https://cdn.example.com/lib.js" defer></script>
```

Avoid inline styles — use Tailwind utility classes instead.

### Frontend

Each page has its own JS module in `resources/js/pages/`. Shared logic lives in `resources/js/components/` and `resources/js/utils/`. Vite handles bundling with per-page entry points.

The app supports dark and light themes via `[data-theme]` attribute toggling.

### Internationalization

Translation files live in `resources/lang/{en,fr,cn,ru}/`. Language is detected from the `Accept-Language` header, persisted via cookie, and switchable from the navbar. The convertor has its own translation dictionaries in `resources/translations/`.

## Features

- **Leaderboard** — Rankings by XP, skill tier, prestige, world records, maps created
- **Map Search** — Filter by code, name, creator, difficulty, category, mechanics, restrictions, tags
- **Submit & Playtest** — Map and completion submissions, playtest queue with community voting
- **Newsfeed** — Announcements, new maps/records, guides, community picks, changelogs, emoji reactions, GIF support
- **Statistics** — Charts for difficulty distribution, player skill tiers, top creators, most popular maps, time played
- **Rank Card** — Customizable card with avatar, skin, background, badges, and map mastery
- **Lootbox** — Gamification system with keys, rewards, rarities, coins, and XP multipliers
- **Convertor** — OverPy to Overwatch Workshop code translation with diff view and translation helpers
- **Dashboard** — Personal aggregation of completions, maps, and activity
- **Moderator Panel** — User management, map editing, completion verification, playtest management, cache controls
- **Notifications** — Web notifications with per-event preferences (web, Discord DM, Discord ping channels)

## Deployment

### How It Works

Both environments use Docker with a multi-stage build (Node for Vite assets, Composer for PHP deps, then a `serversideup/php:8.3-unit` runtime image). Containers join an external `genji-network` Docker network.

### Production

Automatically deploys on push to `main` via `.github/workflows/prod-deploy.yml`. Builds the Docker image on the server via SSH remote Docker context, then runs `docker compose -f docker-compose.prod.yml up -d --build`.

### Development (Staging)

Triggered by commenting `.deploy` on a PR or via manual workflow dispatch in `.github/workflows/dev-deploy.yml`. Uses `github/branch-deploy` to deploy the PR branch. Admins: `tylovejoy`, `Aiapaec64`.

### Environment secrets

All env vars are injected as GitHub Actions secrets into the Docker Compose environment. No `.env` file is used in production — values come directly from the CI/CD pipeline.

## Contributing

### Getting Started

1. Fork the repo and clone locally
2. Follow [Local Setup](#local-setup) above
3. Create a feature branch from `main`
4. Make your changes

### Code Style

- **PHP**: Run `composer fix` before committing. Uses [Duster](https://github.com/tightenco/duster) (PSR-12) and [Pint](https://laravel.com/docs/pint)
- **JS/CSS/Blade**: Run `npm run format` or `composer fix`. Uses [Prettier](https://prettier.io/) with Blade and Tailwind plugins
- Check everything passes with `composer lint`

### Testing

```bash
composer test
```

Uses [Pest](https://pestphp.com/) with the Laravel plugin.

### Pull Requests

- Keep PRs focused — one feature or fix per PR
- Run `composer lint` and `composer test` before opening
- PRs can be deployed to staging by commenting `.deploy` (admins only)
- Merging to `main` triggers automatic production deployment

### CSP Reminder

If you add external scripts or new JS files, always use `csp_nonce()`. Never add inline `<style>` blocks — use Tailwind classes.

## License

MIT

This project is not affiliated with Blizzard Entertainment. Overwatch and related marks are the property of their respective owners.

## Acknowledgements

- [Laravel](https://laravel.com)
- [Tailwind CSS](https://tailwindcss.com)
- [OverPy](https://github.com/Zezombye/overpy) by Zezombye — powers the Convertor
- The Genji Parkour community — map creators, playtesters, and players
