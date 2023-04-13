import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "node:path";
import * as url from "node:url";
import { glob } from "glob";
import docgen from "react-docgen-typescript";
import type {
  ForeignComponent,
  ForeignComponentRenderer,
} from "../editor/src/types/ForeignComponent";

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

function getComponents(): Omit<ForeignComponent, "createRenderer">[] {
  const docs = getComponentDocs();

  const components = docs.map((doc) => {
    const props: ForeignComponent["props"] = [];

    for (const [name, prop] of Object.entries(doc.props)) {
      if (prop.type.name === "string") {
        props.push({
          name,
          type: { type: "string" },
        });
      } else if (prop.type.name === "boolean") {
        props.push({
          name,
          type: { type: "boolean" },
        });
      } else if (prop.type.name === "enum") {
        console.log(prop.type.value);
        props.push({
          name,
          type: {
            type: "enum",
            values: prop.type.value.map((v: any) => JSON.parse(v.value)),
          },
        });
      }
    }

    const component: Omit<ForeignComponent, "createRenderer"> = {
      framework: "react",
      name: doc.displayName,
      path: "",
      props,
    };

    return component;
  });

  return components;
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

console.log(JSON.stringify(getComponents(), null, 2));

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
