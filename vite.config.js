import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  worker: {
    format: 'es',
  },
  resolve: {
    alias: {
      fs: '/resources/js/shims/fs-browser.js',
      path: '/resources/js/shims/path-browser.cjs',
      vm: '/resources/js/shims/vm-browser.cjs',
    },
  },
  plugins: [
    laravel({
      input: [
        'resources/css/app.css',
        'resources/js/app.js',
        'resources/js/pages/index.js',
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
        'resources/js/pages/movement-tech.js',
        'resources/js/pages/dashboard.js',
        'resources/js/pages/infos.js',
        'resources/js/utils/prism.js',
      ],
      refresh: true,
    }),
    tailwindcss(),
  ],
});
