import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { rm } from 'node:fs/promises';

const sourcePublicDir = {
  name: 'source-public-dir',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const postsDir = new URL('posts/', dir);
      await rm(postsDir, { recursive: true, force: true });
      logger.info('Removed source/posts from build output.');
    },
  },
};

export default defineConfig({
  srcDir: 'src',
  publicDir: 'source',
  alias: {
    '@': './src',
  },
  integrations: [
    sourcePublicDir,
    react(),
    tailwind({
      config: './tailwind.config.mjs',
    }),
  ],
  markdown: {
    remarkPlugins: [],
  },
});
