import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [tailwind(), mdx()],
  site: 'https://pan-resource.pages.dev',
  output: 'static',
  vite: {
    ssr: {
      noExternal: ['@astrojs/mdx'],
    },
  },
});