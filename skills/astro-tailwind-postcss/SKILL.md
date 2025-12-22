name: astro-tailwind-postcss
description: Configure and maintain TailwindCSS + PostCSS in Astro projects. Use when adding or troubleshooting @astrojs/tailwind integration, adjusting tailwind.config.mjs/postcss.config.cjs, or wiring Tailwind styles into pages/components.
---

# Astro Tailwind Postcss

## Overview

Wire TailwindCSS into Astro with PostCSS/autoprefixer, keep configs aligned with project paths, and unblock styling issues quickly.

## Quick Start

- Ensure deps exist: `@astrojs/tailwind`, `tailwindcss`, `postcss`, `autoprefixer` (already in package.json).
- Astro integration (astro.config.mjs): keep `tailwind({ config: './tailwind.config.mjs' })` alongside other integrations.
- PostCSS config (`postcss.config.cjs`): minimal setup
```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
```
- Tailwind config (`tailwind.config.mjs`): include Astro file globs `./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}`; set darkMode if needed (`['class', '[data-theme=\"dark\"]']` pattern works with data attributes); extend theme (fonts/colors) under `theme.extend`.
- Base CSS (e.g., `src/styles/global.css`): include
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
and import once in the root layout/page.

## Common Tasks

- **Add plugin/theme tokens**: extend in `tailwind.config.mjs` under `theme.extend`; keep plugins array lean to avoid hydration bloat.
- **Content scanning fixes**: if classes not generated, confirm file path patterns include `.astro`/`.mdx` and any custom dirs; restart dev server after large config edits.
- **JIT purge safety**: avoid dynamic class strings when possible; otherwise whitelist via safelist.
- **Build flow**: run `pnpm build` then `pnpm pagefind` if search indexing relies on compiled `dist` output.

- **Typography**: declare font stack in `theme.extend.fontFamily`, then apply via utility (e.g., `font-sans`). For custom fonts, preload via Astro `<link rel="preload">` and add to stack.
- **Dark/light**: toggle `class` on `<html>` or set `data-theme="dark"` to match `darkMode` config; prefer a single source to avoid mismatches.
