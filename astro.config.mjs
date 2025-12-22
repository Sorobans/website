import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  srcDir: 'src',
  alias: {
    '@': './src',
  },
  integrations: [
    react(),
    tailwind({
      config: './tailwind.config.mjs',
    }),
  ],
  markdown: {
    remarkPlugins: [],
  },
});
