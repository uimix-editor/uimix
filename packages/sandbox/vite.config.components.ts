import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "node:path";
import * as url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/assets.ts"),
      name: "bundle",
      fileName: "bundle",
    },
    outDir: path.resolve(__dirname, ".uimix/assets"),
  },
  define: {
    "process.env": {
      NODE_ENV: "production",
    },
  },
});
