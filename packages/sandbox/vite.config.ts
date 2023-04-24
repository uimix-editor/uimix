import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  ...(mode === "production"
    ? {
        define: {
          // workaround for mui https://github.com/vitejs/vite/issues/9186#issuecomment-1189228653
          "process.env.NODE_ENV": '"production"',
        },
      }
    : {}),
}));
