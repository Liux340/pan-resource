import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [tailwind(), mdx()],
  site: 'https://pan.quicktoollab.top',
  output: 'static',
  vite: {
    ssr: {
      noExternal: ['@astrojs/mdx'],
    },
  },
});