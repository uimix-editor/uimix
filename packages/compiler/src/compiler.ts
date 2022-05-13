import path from "path";
import fs from "fs";
import type * as hast from "hast";
import * as prettier from "prettier";
import { upperFirst, camelCase } from "lodash-es";
import { toHtml } from "hast-util-to-html";
import { parseHTMLFragment } from "./util";
import { fixAssetPathInCSS, fixAssetPathInHTMLTree } from "./fix-asset-path";

export function compileFile(filePath: string, outputDir?: string): void {
  const data = fs.readFileSync(filePath, "utf8");

  const outFileName = path.basename(filePath).replace(/\.macaron$/, ".js");
  const outFilePath = path.join(
    outputDir ?? path.dirname(filePath),
    outFileName
  );

  const out = compile(data, filePath, outFilePath);
  fs.writeFileSync(outFilePath, out);
}

function compileComponent(
  ast: hast.Element,
  filePath: string,
  outFilePath: string
): string {
  const name = ast.properties?.name?.toString();
  if (!name) {
    throw new Error("macaron-component must have a name");
  }

  const className = upperFirst(camelCase(name));

  let style = "";
  let template = "";

  for (const child of ast.children) {
    if (child.type === "element" && child.tagName === "template") {
      const content = child.content!;
      fixAssetPathInHTMLTree(content, filePath, outFilePath);
      template = toHtml(child.content!).replace(/&#x22;/g, '"');
    }
    if (child.type === "element" && child.tagName === "style") {
      style = (child.children[0] as hast.Text).value;
      style = fixAssetPathInCSS(style, filePath, outFilePath);
    }
  }

  return `
    class ${className} extends HTMLElement {
      constructor() {
        super();

        const style = \`${style}\`;
        const template = \`${template}\`;

        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = ${"`<style>${style}</style>${template}`"};
      }
    }

    customElements.define(${JSON.stringify(name)}, ${className});
  `;
}

export function compile(
  data: string,
  filePath: string,
  outFilePath: string
): string {
  const ast = parseHTMLFragment(data);

  const outputs: string[] = [];

  for (const child of ast.children) {
    if (child.type === "element" && child.tagName === "macaron-component") {
      outputs.push(compileComponent(child, filePath, outFilePath));
    }
  }

  const output = outputs.join("");

  return prettier.format(output, {
    parser: "babel",
  });
}
