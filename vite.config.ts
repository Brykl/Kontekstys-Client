// vite.config.ts или vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "172.30.253.7",
    port: 5173,
  },
});
