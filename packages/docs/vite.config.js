import { defineConfig } from "vite";
import macaronLoader from "@macaron-app/loader-vite";

export default defineConfig({
  plugins: [macaronLoader()],
  server: {
    port: 4000,
  },
});
