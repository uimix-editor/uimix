import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "node:path";
import * as url from "node:url";
const __filename = url.fileURLToPath(import.meta.url);

// https://vitejs.dev/config/
export default defineConfig({
  // disable refresh of all components
  // otherwise "Error: @vitejs/plugin-react can't detect preamble. Something is wrong." is thrown
  plugins: [react({ exclude: "**/*" })],

  build: {
    lib: {
      entry: path.resolve(__filename, "../src/uimix-components.tsx"),
      name: "components",
      fileName: "components",
    },
  },
});
