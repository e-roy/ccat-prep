import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  root: ".",
  publicDir: "public",
  base: process.env.NODE_ENV === "production" ? "/ccat-prep/" : "/",
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
