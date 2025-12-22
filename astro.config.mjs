import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import stylex from '@stylexjs/rollup-plugin';

export default defineConfig({
  srcDir: 'src',
  integrations: [react()],
  markdown: {
    remarkPlugins: [],
  },
  vite: {
    plugins: [
      stylex({
        dev: true,
        useCSSLayers: true,
        classNamePrefix: 'snow',
      }),
    ],
  },
});
