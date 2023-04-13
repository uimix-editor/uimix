import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "node:path";
import * as url from "node:url";
const __filename = url.fileURLToPath(import.meta.url);

const entry = path.resolve(__filename, "../src/dummy.tsx");

export function virtualModulePlugin() {
  const virtualModuleId = "virtual:my-module";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "my-plugin", // required, will show up in warnings and errors
    resolveId(id) {
      if (entry === id) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const msg = "from virtual module"`;
      }
    },
    transform(src, id) {},
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  // disable refresh of all components
  // otherwise "Error: @vitejs/plugin-react can't detect preamble. Something is wrong." is thrown
  plugins: [virtualModulePlugin(), react({ exclude: "**/*" })],

  build: {
    lib: {
      entry: path.resolve(__filename, "../src/dummy.tsx"),
      name: "components",
      fileName: "components",
    },
    outDir: path.resolve(__filename, "../dist-components"),
  },

  define: {
    "process.env": {
      NODE_ENV: "production",
    },
  },
});
