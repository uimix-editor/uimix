import { defineConfig } from "vite";
import macaronLoader from "@macaron-app/loader-vite";

export default defineConfig({
  plugins: [macaronLoader()],
  server: {
    host: true,
    port: 4000,
    fs: {
      // Allow serving files from one level up to the project root
      allow: ["../.."],
    },
  },
});
