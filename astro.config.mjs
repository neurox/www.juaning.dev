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
  redirects: {
    '/post/': '/posts/',
    '/post/:slug': '/posts/:slug',
    '/es/post/': '/es/posts/',
    '/es/post/:slug': '/es/posts/:slug',
    '/es/acerca/': '/es/about/',
    '/es/contacto/': '/es/contact/',
    '/es/portafolio/': '/es/portfolio/',
  },
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
      fallbackType: 'rewrite',
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
