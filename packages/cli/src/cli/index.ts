import { cac } from "cac";
import { generateCode } from "../compiler/generateCode";
import * as fs from "fs";
import * as path from "path";
import mkdirp from "mkdirp";
import react from "@vitejs/plugin-react";
import { WorkspaceLoader } from "../project/WorkspaceLoader";
import { NodeFileAccess } from "../project/NodeFileAccess";
import { build } from "vite";
import { getComponents } from "./getComponents";
import { codeAssetsDestination } from "./constants";

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

  const patterns = ["src/stories/*.tsx", "!**/*.stories.tsx"];
  const patternsFromRoot = patterns.map((pattern) => {
    if (pattern.startsWith("!")) {
      return pattern;
    }
    return path.join("/", pattern);
  });
  console.log(patternsFromRoot);

  const resolvedVirtualModuleId = "\0:virtual-entry";

  // TODO: make build options configurable

  await build({
    configFile: false,
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
            const components = getComponents(rootPath, patterns);

            const componentCodes = components.map((component) => {
              const json = JSON.stringify(component);

              return (
                json.slice(0, -1) +
                `, createRenderer: e => new ReactRenderer(e, modules[${JSON.stringify(
                  "/" + component.path
                )}].${component.name})}`
              );
            });

            return `${reactRendererCode}
            const modules = import.meta.glob(${JSON.stringify(
              patternsFromRoot
            )}, {eager: true});
            export const components = [${componentCodes.join(",")}]`;
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
      outDir: path.resolve(rootPath, codeAssetsDestination),
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
