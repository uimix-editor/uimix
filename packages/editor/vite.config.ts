import { defineConfig } from "vite";
import commonConfig from "./vite.config.common";

export default defineConfig({
  ...commonConfig,
  server: {
    hmr: {
      host: "localhost",
    },
  },
});
