import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "node:path";
import * as url from "node:url";
import { glob } from "glob";
import docgen from "react-docgen-typescript";

const __filename = url.fileURLToPath(import.meta.url);

const entry = path.resolve(__filename, "../src/dummy.tsx");

function getComponentDocs(): docgen.ComponentDoc[] {
  const options = {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    componentNameResolver: (exp, source) => {
      //console.log(exp, source);
      return exp.name;
    },
  };

  const filePath = "src/stories/*.tsx";
  const ignoreFilePath = "**/*.stories.tsx";

  const ignoreFilePaths = glob.sync(ignoreFilePath);
  const filePaths = glob.sync(filePath, {
    ignore: ignoreFilePaths,
  });

  const docs = docgen.parse(filePaths, options);

  return docs;
}

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

console.log(getComponentDocs());

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
