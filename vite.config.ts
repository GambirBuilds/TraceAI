import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": currentDirectory,
    },
  },

  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    hmr: process.env.DISABLE_HMR !== "true",

    // Disable file watching during AI Studio agent edits.
    watch: process.env.DISABLE_HMR === "true" ? null : {},
  },
}));
