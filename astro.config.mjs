// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import AstroPWA from "@vite-pwa/astro";

// https://astro.build/config
export default defineConfig({
  site: "https://carincon93.github.io",
  base: "matching-madness",
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react(),
    AstroPWA({
      mode: "development",
      base: "/matching-madness/",
      scope: "/matching-madness/",
      includeAssets: ["favicon.svg"],
      registerType: "autoUpdate",
      manifest: {
        name: "Astro PWA",
        short_name: "Astro PWA",
        theme_color: "#ffffff",
        icons: [],
      },
      workbox: {
        navigateFallback: "/matching-madness/index.html",
        globPatterns: ["**/*.{css,js,html,svg,ttf,woff,woff2,eot,png,webp,ico,txt}"],
      },
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\/$/],
      },
      experimental: {
        directoryAndTrailingSlashHandler: true,
      },
    }),
  ],
});