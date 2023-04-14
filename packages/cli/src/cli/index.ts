import { cac } from "cac";
import { generateCode } from "../compiler/generateCode";
import * as fs from "fs";
import * as path from "path";
import mkdirp from "mkdirp";
import react from "@vitejs/plugin-react";
import { WorkspaceLoader } from "../project/WorkspaceLoader";
import { NodeFileAccess } from "../project/NodeFileAccess";
import { Plugin, build } from "vite";
import { getComponents } from "./getComponents";

async function compileProject(loader: WorkspaceLoader) {
  const outFiles = await generateCode(loader.rootPath, loader.json);

  for (const outFile of outFiles) {
    const outPath = path.join(loader.rootPath, outFile.filePath);
    const outPathDir = path.dirname(outPath);
    mkdirp.sync(outPathDir);
    fs.writeFileSync(outPath, outFile.content);
  }
}

async function compileCommand(
  rootPath: string,
  options: {
    watch?: boolean;
  }
): Promise<void> {
  const loader = await WorkspaceLoader.load(new NodeFileAccess(rootPath));

  if (options.watch) {
    loader.watch(() => compileProject(loader));
  }

  void compileProject(loader);

  const components = getComponents(rootPath);

  const resolvedVirtualModuleId = "\0:virtual-entry";

  await build({
    root: rootPath,
    plugins: [
      {
        name: "my-plugin", // required, will show up in warnings and errors
        resolveId(id) {
          console.log(id);
          if (id === path.resolve(rootPath, ':virtual-entry"')) {
            return resolvedVirtualModuleId;
          }
        },
        load(id) {
          if (id === resolvedVirtualModuleId) {
            const importPaths = [...new Set(components.map((c) => c.path))];

            // TODO: unique import name
            const importCodes = importPaths.map(
              (path, i) => `import * as _${i} from "./${path}";`
            );

            const componentCodes = components.map((component) => {
              const json = JSON.stringify(component);
              const moduleName = `_${importPaths.indexOf(component.path)}`;

              return (
                json.slice(0, -1) +
                `, createRenderer: e => new ReactRenderer(e, ${moduleName}.${component.name})}`
              );
            });

            return `${reactRendererCode} ${importCodes.join(
              "\n"
            )} export const components = [${componentCodes.join(",")}]`;
          }
        },
      },
      react({ exclude: "**/*" }),
    ],
    build: {
      lib: {
        entry: path.resolve(rootPath, ':virtual-entry"'),
        name: "components",
        fileName: "components",
      },
      outDir: path.resolve(rootPath, ".uimix/assets"),
      // TODO: watch
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

const cli = cac("uimix");

// TODO: output help if unknown command is passed

cli
  .command("compile", "compile UIMix project")
  .option("--root", `[string] root directory`)
  .option("-w, --watch", `[boolean] watch for changes`)
  .action(async (options: { root?: string; watch?: boolean }) => {
    await compileCommand(path.resolve(options.root || "."), options);
  });

cli.help();
cli.version("0.0.1");
cli.parse();
