import { globSync } from "glob";
import docgen from "react-docgen-typescript";
import type { ForeignComponent } from "@uimix/asset-types";

function getComponentDocs(): docgen.ComponentDoc[] {
  const options = {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
  };

  const filePath = "src/stories/*.tsx";
  const ignoreFilePath = "**/*.stories.tsx";

  const ignoreFilePaths = globSync(ignoreFilePath);
  const filePaths = globSync(filePath, {
    ignore: ignoreFilePaths,
  });

  const docs = docgen.parse(filePaths, options);

  return docs;
}

export function getComponents(): Omit<ForeignComponent, "createRenderer">[] {
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
      path: doc.filePath,
      props,
    };

    return component;
  });

  return components;
}
