import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.juaning.dev',
  output: 'static',
  integrations: [
    react(),
    tailwind(),
    sitemap(),
  ],
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
    fallback: {
      es: 'en',
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'dracula',
    },
  },
});
