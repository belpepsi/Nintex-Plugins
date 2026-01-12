import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "docs",
    emptyOutDir: false,
    lib: {
      entry: "src/central-table-grid.js",
      name: "CentralTableGridPlugin",
      formats: ["iife"],                 // <-- IMPORTANT (not "es")
      fileName: () => "central-table-grid.js"
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
});

