import * as path from "path";
import react from "@vitejs/plugin-react";
import { build } from "vite";
import { getComponents } from "../codeAssets/getComponents";
import { codeAssetsDestination } from "./constants";
import * as Data from "@uimix/model/src/data/v1";

export async function buildCodeAssets(
  rootPath: string,
  manifest: Data.ProjectManifest,
  options: {
    watch?: boolean;
  }
): Promise<void> {
  const patterns = manifest.components?.react ?? [];
  const patternsFromRoot = patterns.map((pattern) => {
    if (pattern.startsWith("!")) {
      return pattern;
    }
    return path.join("/", pattern);
  });

  const resolvedVirtualModuleId = "\0:virtual-entry";

  // TODO: make build options configurable

  await build({
    configFile: false,
    root: rootPath,
    plugins: [
      {
        name: "my-plugin", // required, will show up in warnings and errors
        resolveId(id) {
          if (id === path.resolve(rootPath, ':virtual-entry"')) {
            return resolvedVirtualModuleId;
          }
        },
        load(id) {
          if (id === resolvedVirtualModuleId) {
            const components = getComponents(rootPath, patterns);

            console.log("Found Components:");
            for (const component of components) {
              console.log(`  ${component.name} (${component.path})`);
            }

            const componentCodes = components.map((component) => {
              const json = JSON.stringify(component);

              return (
                json.slice(0, -1) +
                `, createRenderer: e => new ReactRenderer(e, modules[${JSON.stringify(
                  "/" + component.path
                )}].${component.name})}`
              );
            });

            const tokensCode = manifest.designTokens
              ? `export { default as tokens } from "${manifest.designTokens}";`
              : `export const tokens = {};`;

            return `${reactRendererCode}
            const modules = import.meta.glob(${JSON.stringify(
              patternsFromRoot
            )}, {eager: true});
            export const components = [${componentCodes.join(",")}]
            ${tokensCode}
            `;
          }
        },
      },
      react(),
    ],
    build: {
      lib: {
        entry: path.resolve(rootPath, ':virtual-entry"'),
        name: "bundle",
        fileName: "bundle",
      },
      outDir: path.resolve(rootPath, codeAssetsDestination.directory),
      watch: options.watch ? {} : undefined,
    },
    define: {
      "process.env": {
        NODE_ENV: "production",
      },
    },
  });
}

const reactRendererCode = `
import React from "react";
import ReactDOM from "react-dom/client";

class ReactRenderer {
  constructor(element, Component) {
    this.reactRoot = ReactDOM.createRoot(element);
    this.component = Component;
  }

  render(props) {
    return new Promise((resolve) => {
      this.reactRoot.render(
        React.createElement("div", { ref: () => resolve(), style: { display: "contents" } }, React.createElement(this.component, props))
      );
    });
  }

  dispose() {
    this.reactRoot.unmount();
  }
}
`;
