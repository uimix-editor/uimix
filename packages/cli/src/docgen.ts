import * as path from "path";
import { globSync } from "glob";
import docgen from "react-docgen-typescript";
import { Plugin as VitePlugin } from "vite";

export function generateDocs(rootDir: string): docgen.ComponentDoc[] {
  const options: docgen.ParserOptions = {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    componentNameResolver: (exp, source) => {
      //console.log(exp, source);
      return exp.name;
    },
  };

  const filePath = "src/**/*.tsx";
  //const ignoreFilePath = "src/**/*.stories.tsx";

  //const ignoreFilePaths = glob.sync(ignoreFilePath);
  const filePaths = globSync(filePath, {
    cwd: rootDir,
    //ignore: ignoreFilePaths,
  });

  // Parse a file for docgen info
  const docs = docgen
    .withCustomConfig(path.resolve(rootDir, "tsconfig.json"), options)
    .parse(filePaths.map((filePath) => path.resolve(rootDir, filePath)));

  return docs.map((doc) => ({
    ...doc,
    filePath: path.relative(rootDir, doc.filePath),
  }));
}

export function componentsVirtualModulePlugin(rootDir: string): VitePlugin {
  const virtualModuleId = "/virtual:components";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  const docs = generateDocs(rootDir);

  const content = `
    import React from "react";
    import ReactDOM from "react-dom/client";
    export const components = ${JSON.stringify(docs)};
    export { React, ReactDOM };
  `;

  return {
    name: "uimix:react-components",
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return content;
      }
    },
    handleHotUpdate({ server }) {
      console.log("TODO: handleHotUpdate");
      return [];
    },
  };
}
