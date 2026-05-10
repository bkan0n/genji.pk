  <h1>Genji Parkour — Community &amp; Tools (Laravel 12)</h1>

  <p align="center">
    <a href="https://laravel.com" target="_blank">
      <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="340" alt="Laravel Logo">
    </a>
  </p>

  <p align="center">
    <img alt="Laravel" src="https://img.shields.io/badge/Laravel-12-red">
    <img alt="PHP" src="https://img.shields.io/badge/PHP-%E2%89%A5%208.2-777bb3">
    <img alt="Node" src="https://img.shields.io/badge/Node-%E2%89%A5%2020-43853d">
    <img alt="Build" src="https://img.shields.io/badge/Build-Vite-informational">
    <img alt="CSS" src="https://img.shields.io/badge/TailwindCSS-Enabled-38B2AC">
    <img alt="License" src="https://img.shields.io/badge/License-MIT-green">
  </p>

  <p>
    <strong>Genji Parkour</strong> is a community website for Overwatch Genji parkour maps:
    <em>leaderboards</em>, <em>powerful search</em>, <em>submissions &amp; playtests</em>, <em>newsfeed</em>,
    <em>statistics/graphs</em>, and a <strong>Converter (OverPy → Workshop)</strong> with multilingual support.
    This repository hosts the <strong>Laravel 12</strong> application that serves the UI
    (dark theme, Tailwind, Blade + per-page JS).
    The app is <strong>API-first</strong> by default and can optionally use a local database for specific modules.
  </p>

  <hr>

  <h2>✨ Features</h2>
  <ul>
    <li><strong>Leaderboard</strong> — XP, tiers, skill ranks, world records, maps made, playtest votes.</li>
    <li><strong>Maps Search</strong> — rich filters (code, creator, name, difficulty, type, mechanics, restrictions, flags).</li>
    <li><strong>Submit &amp; Playtest</strong> — submit maps/records, playtest queue, difficulty pills, custom dropdowns.</li>
    <li><strong>Newsfeed</strong> — announcements, new maps/records, guides, community picks, changelogs.</li>
    <li><strong>Statistics</strong> — charts &amp; insights (difficulty distribution, popularity, time played, rank distribution).</li>
    <li><strong>Converter (Beta)</strong> — OverPy → Workshop, translation helpers, map-data editor.</li>
    <li><strong>Multi-language</strong> — EN/FR (extensible), language detection &amp; user selection.</li>
    <li><strong>Discord OAuth</strong> — login, navbar avatar, profile/notifications modals.</li>
    <li><strong>Strict CSP</strong> — <code>csp_nonce()</code> for scripts (including CDN), no inline styles.</li>
    <li><strong>API-first</strong> — UI reads from an external API secured. Local DB mode is optional.</li>
  </ul>

  <h2>🧱 Tech Stack</h2>
  <ul>
    <li><strong>Backend:</strong> Laravel 12 (PHP ≥ 8.2), custom middlewares (language, user context, Sentry).</li>
    <li><strong>Frontend:</strong> Blade, modular page-scoped JS, Tailwind CSS, Vite.</li>
    <li><strong>i18n:</strong> <code>resources/lang/{en,fr}</code> + Converter dictionaries.</li>
    <li><strong>Data:</strong> External API (default). Local DB is optional for persistence-heavy modules.</li>
  </ul>

</code></pre>

  <h2>🚀 Getting Started</h2>

  <h3>1) Requirements</h3>
  <ul>
    <li><strong>PHP ≥ 8.2</strong></li>
    <li><strong>Composer 2</strong></li>
    <li><strong>Node ≥ 20</strong> and <strong>npm</strong></li>
    <li><strong>SQLite / MySQL / PostgreSQL</strong> (only if you enable local DB mode)</li>
  </ul>

  <h3>2) Installation</h3>
  <pre><code>git clone &lt;your-repo-url&gt; genji
cd genji
cp .env.example .env
composer install
npm install
php artisan key:generate
</code></pre>

  <h3>3) Configure <code>.env</code></h3>

  <h4>Default: API-first (recommended)</h4>
  <pre><code>APP_NAME="Genji Parkour"
APP_ENV=local
APP_URL=http://genji.test
APP_DEBUG=true

# Sessions &amp; cache
SESSION_DRIVER=file
CACHE_STORE=file

# External API (required)
API_ROOT="https://your.own.api/"   # example base URL
API_KEY="your-api-key"

# Discord OAuth
DISCORD_CLIENT_ID="..."
DISCORD_CLIENT_SECRET="..."
DISCORD_REDIRECT="${APP_URL}/callback"

# Sentry via proxy (optional)
SENTRY_DSN=""
SENTRY_ENV="${APP_ENV}"

# Localization
FALLBACK_LOCALE=en
</code></pre>

  <p>
    In API-first mode, the UI fetches data from the external API (leaderboard, maps, newsfeed, etc.).
    It’s ideal for quick deployments and avoids heavy SQL on the web server.
  </p>

  <h4>Optional: Local Database (hybrid or DB-driven modules)</h4>
  <pre><code>DB_CONNECTION=pgsql   # or mysql/sqlite
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=genji
DB_USERNAME=genji
DB_PASSWORD=secret
SESSION_DRIVER=database
CACHE_STORE=database
</code></pre>

  <p>Then run migrations (if present):</p>
  <pre><code>php artisan migrate --seed
</code></pre>

  <p>You can combine API usage and a local DB if some modules need persistence. API-first remains the default for public pages.</p>

  <h3>4) Run the App</h3>
  <pre><code># Dev (Vite + HMR)
npm run dev

# Laravel server
php artisan serve
</code></pre>

  <p>Open: <code>http://127.0.0.1:8000</code> (or <code>APP_URL</code>).</p>

  <h3>5) Production Build</h3>
  <pre><code>npm run build
php artisan optimize
</code></pre>

  <h2>🔐 Security &amp; Content Security Policy (CSP)</h2>
  <ul>
    <li>The project enforces a <strong>strict CSP</strong>. Always use the nonce from <code>csp_nonce()</code> on scripts (including CDN imports):</li>
  </ul>

  <pre><code>&#64;push('head')
  &#64;php($nonce = csp_nonce())
  &lt;script nonce="{{ $nonce }}" src="https://cdn.jsdelivr.net/gh/Zezombye/overpy@master/out/overpy_standalone.js" defer&gt;&lt;/script&gt;
  &lt;script nonce="{{ $nonce }}" src="https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js" defer&gt;&lt;/script&gt;
&#64;endpush
</code></pre>

  <ul>
    <li>Avoid inline styles; prefer Tailwind utility classes.</li>
    <li>Never commit secrets (API keys, Discord credentials, Sentry DSN, etc.).</li>
  </ul>

  <h2>🌍 Internationalization (i18n)</h2>
  <ul>
    <li>Core translations live in <code>resources/lang/{en,fr}</code>.</li>
    <li>Converter &amp; domain dictionaries live in <code>resources/translations</code> and feature files (e.g., <code>resources/lang/en/converter.php</code>).</li>
    <li>Language is selected in the navbar; middleware aids detection and persistence via cookie.</li>
  </ul>

  <h2>🧩 Pages &amp; Scripts Mapping</h2>

  <table>
    <thead>
      <tr>
        <th align="left">Page</th>
        <th align="left">Blade View</th>
        <th align="left">Page Script</th>
        <th align="left">Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Home</td><td><code>resources/views/index.blade.php</code></td><td>(landing logic / optional prism.js)</td><td>Hero + top maps</td></tr>
      <tr><td>Leaderboard</td><td><code>resources/views/leaderboard.blade.php</code></td><td><code>resources/js/pages/leaderboard.js</code></td><td>filters, ranks, WR</td></tr>
      <tr><td>Search / Maps</td><td><code>resources/views/search.blade.php</code></td><td><code>resources/js/pages/search.js</code></td><td>tabs: Search / Completions / Guides / PR</td></tr>
      <tr><td>Submit &amp; Playtest</td><td><code>resources/views/submit.blade.php</code></td><td><code>resources/js/pages/submit.js</code></td><td>custom dropdowns, difficulty pills</td></tr>
      <tr><td>Statistics</td><td><code>resources/views/statistics.blade.php</code></td><td><code>resources/js/pages/statistics.js</code></td><td>charts &amp; insights</td></tr>
      <tr><td>Newsfeed</td><td><code>resources/views/newsfeed.blade.php</code></td><td><code>resources/js/pages/newsfeed.js</code></td><td>tags, community picks, changelogs</td></tr>
      <tr><td>Dashboard</td><td><code>resources/views/dashboard.blade.php</code></td><td><code>resources/js/pages/dashboard.js</code></td><td>personal aggregation</td></tr>
      <tr><td>Lootbox</td><td><code>resources/views/lootbox.blade.php</code></td><td><code>resources/js/pages/lootbox.js</code></td><td>effects, rarities, keys</td></tr>
      <tr><td>Rank Card</td><td><code>resources/views/rank_card.blade.php</code></td><td><code>resources/js/pages/rank_card.js</code></td><td>skeleton + render</td></tr>
      <tr><td>Converter</td><td><code>resources/views/converter.blade.php</code></td><td><code>resources/js/pages/converter.js</code></td><td>OverPy → Workshop, translations</td></tr>
    </tbody>
  </table>

  <h2>🔌 API Usage</h2>
  <p>The UI is API-first. Requests include an <code>API-KEY</code> header and use same-origin credentials when relevant.</p>

  <pre><code>async function api(path, opts = {}) {
  const headers = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'API-KEY': (import.meta.env &amp;&amp; import.meta.env.VITE_API_KEY) ?? window.API_KEY,
    ...(opts.headers || {}),
  };

  return fetch(`${window.API_ROOT}${path}`, {
    method: 'GET',
    credentials: 'same-origin',
    ...opts,
    headers,
  }).then((r) => (r.ok ? r.json() : Promise.reject(r)));
}
</code></pre>

  <p>For POST/PUT/DELETE from Blade pages, also include the CSRF header from the meta tag and the <code>XSRF-TOKEN</code> cookie (Laravel defaults).</p>

  <h2>🧪 Testing</h2>
  <p>Add PHPUnit/Pest for backend and Vitest/Playwright for UI as needed. For now, rely on <code>npm run build</code>, <code>php artisan optimize</code>, and visual verification of core pages.</p>

  <h2>📜 License &amp; Trademarks</h2>
  <ul>
    <li>Code: <strong>MIT</strong> unless otherwise stated for specific assets.</li>
    <li>This project is <strong>not affiliated</strong> with Blizzard Entertainment. Overwatch™ and related marks are the property of their respective owners.</li>
  </ul>

  <h2>🙏 Acknowledgements</h2>
  <ul>
    <li><strong>Laravel</strong> and its community.</li>
    <li><strong>Tailwind CSS</strong>.</li>
    <li><strong>OverPy</strong> by Zezombye (used by the Converter).</li>
    <li>All map creators, playtesters, and contributors of the <strong>Genji Parkour</strong> community.</li>
  </ul>

  <h2>📬 Support</h2>
  <p>Open an issue or discussion for bugs and feature requests. For sensitive matters (security, API keys), contact the maintainers privately.</p>

  <h2>TL;DR</h2>
  <ul>
    <li><strong>API-first</strong> by default: set <code>API_ROOT</code> + <code>API_KEY</code>. Local DB is optional.</li>
    <li>Start: <code>composer install</code> → <code>npm install</code> → <code>php artisan key:generate</code> → <code>npm run dev</code> + <code>php artisan serve</code>.</li>
    <li><strong>CSP:</strong> always use the nonce and avoid inline styles.</li>
  </ul>

</div>