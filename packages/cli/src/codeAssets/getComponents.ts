import docgen from "react-docgen-typescript";
import type * as CodeAsset from "@uimix/adapter-types";
import * as path from "node:path";
import { globbySync } from "globby";

function getComponentDocs(
  rootPath: string,
  pattern: string[]
): docgen.ComponentDoc[] {
  const options = {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
  };

  const filePaths = globbySync(pattern, { cwd: rootPath });

  // TODO: Load tsconfig
  const docs = docgen.parse(filePaths, options);

  return docs;
}

export function getComponents(
  rootPath: string,
  pattern: string[]
): Omit<CodeAsset.Component, "createRenderer">[] {
  const docs = getComponentDocs(rootPath, pattern);

  const components = docs.map((doc) => {
    const props: CodeAsset.Component["props"] = [];

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
        props.push({
          name,
          type: {
            type: "enum",
            // eslint-disable-next-line
            options: prop.type.value.map((v: any) => JSON.parse(v.value)),
          },
        });
      }
    }

    const component: Omit<CodeAsset.Component, "createRenderer"> = {
      framework: "react",
      name: doc.displayName,
      path: path.relative(rootPath, doc.filePath),
      props,
    };

    return component;
  });

  return components;
}
