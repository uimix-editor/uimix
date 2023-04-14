import docgen from "react-docgen-typescript";
import type { ForeignComponent } from "@uimix/asset-types";
import * as path from "node:path";
import { globbySync } from "globby";

function getComponentDocs(dirname: string): docgen.ComponentDoc[] {
  const options = {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
  };

  // TODO: configurable
  const pattern = ["src/stories/*.tsx", "!**/*.stories.tsx"];
  const filePaths = globbySync(pattern, {
    cwd: dirname,
  });
  console.log(filePaths);

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
