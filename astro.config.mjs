// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages *user* site: served at the root of https://aberson.github.io,
// so `base` is '/'. This keeps a later custom-domain switch to a one-line
// `site` change plus a `public/CNAME` file (no asset-path base rewrite).
//
// Tailwind integration note: the vendored brand theme (`src/assets/theme.tw.css`)
// is authored for Tailwind v4 (`@theme` block, "import after `@import 'tailwindcss'`").
// The plan (§2) named the older `@astrojs/tailwind` (Tailwind v3), which is now
// deprecated. We use the current, non-deprecated `@tailwindcss/vite` plugin (v4)
// so the vendored token file drops in cleanly. Sitemap stays an Astro integration.
export default defineConfig({
  site: "https://aberson.github.io",
  base: "/",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
