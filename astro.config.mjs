import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://vdac.vn',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [mdx(), react(), markdoc(), keystatic()],
  i18n: { defaultLocale: 'vi', locales: ['vi', 'en'], routing: { prefixDefaultLocale: false } }
});
