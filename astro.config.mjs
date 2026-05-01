import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  site: 'https://rumroom.world',
  integrations: [
    tailwind(),
    sitemap(),
  ],
  output: 'static',
  adapter: vercel(),
});
