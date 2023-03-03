import { ProjectJSON } from "@uimix/node-data";
import { Project } from "@uimix/render";
import { camelCase, kebabCase } from "lodash-es";
import { formatCSS, formatTypeScript } from "../format.js";
import * as fs from "fs";
import * as path from "path";
import { CSSGenerator, cssRuleToString } from "./CSSGenerator.js";

export function generateCode(
  projectJSON: ProjectJSON,
  imageFiles: string[]
): {
  "index.ts": string;
  "index.css": string;
} {
  const images = imageFiles
    .map((file) => {
      const extname = path.extname(file);
      const hash = path.basename(file).slice(0, -extname.length);
      return [hash, `./images/${file}`] as const;
    })
    .filter(([hash]) => hash);

  const project = new Project(projectJSON);

  const externalModules = new Set<string>();
  for (const style of project.styleMap.values()) {
    if (style.foreignComponentID?.path) {
      externalModules.add(style.foreignComponentID.path);
    }
  }

  const moduleImports = new Map(
    [...externalModules].map((modulePath) => {
      const name = camelCase(
        path.basename(modulePath, path.extname(modulePath))
      );
      return [
        modulePath,
        {
          name,
          statement: `import * as ${name} from "../../${modulePath.replace(
            /\.[jt]sx?$/,
            ""
          )}";`,
        },
      ];
    })
  );

  const imageHashToJSName = (hash: string) => {
    return "image_" + hash.replaceAll("-", "$").replaceAll("=", "");
  };

  const tsContent = formatTypeScript(`
    import React from "react";
    import {createReactComponents} from "@uimix/render";
    import './index.css';
    ${[...moduleImports.values()].map(({ statement }) => statement).join("\n")}
    ${images
      .map(([hash, path]) => {
        return `import ${imageHashToJSName(hash)} from "${path}";`;
      })
      .join("\n")}

    const components = createReactComponents(${JSON.stringify(projectJSON)}, {
        ${images.map(([hash]) => {
          return `"${hash}": ${imageHashToJSName(hash)}`;
        })}
      }, {
        ${[...moduleImports].map(
          // TODO: extname handling
          ([path, { name }]) => `"${path}": ${name}`
        )}
    });
    ${[...project.components.values()]
      .map(
        (component) =>
          `
          export const ${component.name} = components.get("${
            component.name
          }") as React.FC<JSX.IntrinsicElements["div"] & {
            overrides?: {
              ${[...component.refIDs].map(([id, refID]) => {
                const node = project.getNode(id);
                const style = project.getStyle([id]);
                const tagName = project.getStyle([id]).tagName ?? "div";
                if (node?.type === "foreign" && style.foreignComponentID) {
                  const exportName = style.foreignComponentID.name;
                  const moduleName = moduleImports.get(
                    style.foreignComponentID.path
                  )?.name;
                  if (moduleName) {
                    return `"${refID}"?: Partial<React.ComponentProps<typeof ${moduleName}.${exportName}>>`;
                  }
                }

                return `"${refID}"?: JSX.IntrinsicElements["${tagName}"]`;
              })}
            }
          }>;
          `
      )
      .join("\n")}
    `);

  const cssRules = new CSSGenerator(project, new Map(images)).generateCSS();

  const cssContent = formatCSS(
    cssRules.map((rule) => cssRuleToString(project, rule)).join("\n")
  );

  return {
    "index.ts": tsContent,
    "index.css": cssContent,
  };
}
