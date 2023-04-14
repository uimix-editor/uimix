import { globSync } from "glob";
import docgen from "react-docgen-typescript";
import type { ForeignComponent } from "@uimix/asset-types";
import * as path from "node:path";

function getComponentDocs(dirname: string): docgen.ComponentDoc[] {
  const options = {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
  };

  // TODO: configurable
  const filePath = "src/stories/*.tsx";
  const ignoreFilePath = "**/*.stories.tsx";

  const ignoreFilePaths = globSync(ignoreFilePath, {
    cwd: dirname,
  });
  const filePaths = globSync(filePath, {
    ignore: ignoreFilePaths,
    cwd: dirname,
  });

  // TODO: Load tsconfig
  const docs = docgen.parse(filePaths, options);

  return docs;
}

export function getComponents(
  dirname: string
): Omit<ForeignComponent, "createRenderer">[] {
  const docs = getComponentDocs(dirname);

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
      path: path.relative(dirname, doc.filePath),
      props,
    };

    return component;
  });

  return components;
}
