import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { copyFileSync } from "node:fs";

const githubPagesSpaFallback = () => ({
  name: "github-pages-spa-fallback",
  closeBundle() {
    // GitHub Pages serves this fallback for direct requests such as /map.
    // BrowserRouter then resolves the unchanged URL using its basename.
    copyFileSync("docs/index.html", "docs/404.html");
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/digital-benin-bloom/",

  build: {
    outDir: "docs",
    emptyOutDir: true,
  },

  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  plugins: [react(), githubPagesSpaFallback()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
}));
