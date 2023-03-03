import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    server: {
      ...(mode === "development"
        ? {
            proxy: {
              "/panel": "http://localhost:4000",
              "/trpc": {
                target: "ws://localhost:4000",
                ws: true,
              },
              "/project": "http://localhost:4000",
            },
          }
        : {}),
    },
    plugins: [
      react({
        babel: {
          parserOpts: {
            plugins: ["decorators-legacy"],
          },
        },
      }),
    ],
    build: {
      target: "esnext",
    },
  };
});
