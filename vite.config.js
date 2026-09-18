import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: { outDir: "docs", emptyOutDir: false }, // keep docs/data/quotes.json between builds
});
