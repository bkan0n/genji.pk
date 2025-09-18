import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    laravel({
      input: [
        'resources/css/app.css',
        'resources/js/app.js',
        'resources/js/pages/leaderboard.js',
        'resources/js/pages/newsfeed.js',
        'resources/js/pages/statistics.js',
        'resources/js/pages/tutorials.js',
        'resources/js/pages/search.js',
        'resources/js/pages/rank_card.js',
        'resources/js/pages/convertor.js',
        'resources/js/pages/lootbox.js',
        'resources/js/pages/submit.js',
        'resources/js/pages/game.js',
        'resources/js/pages/moderator.js',
        'resources/js/pages/dashboard.js',
      ],
      refresh: true,
    }),
    tailwindcss(),
  ],
});
