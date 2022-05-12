import * as fs from "fs";
import type * as hast from "hast";
import * as prettier from "prettier";
import { upperFirst, camelCase } from "lodash-es";
import { toHtml } from "hast-util-to-html";
import { parseHTMLFragment } from "./util";
import { fixAssetPathInCSS, fixAssetPathInHTMLTree } from "./fix-asset-path";

export function compileFile(filePath: string): void {
  const data = fs.readFileSync(filePath, "utf8");
  const out = compile(data);
  fs.writeFileSync(filePath.replace(/\.macaron$/, ".js"), out);
}

function compileComponent(ast: hast.Element): string {
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
      fixAssetPathInHTMLTree(content);
      template = toHtml(child.content!).replace(/&#x22;/g, '"');
    }
    if (child.type === "element" && child.tagName === "style") {
      style = (child.children[0] as hast.Text).value;
      style = fixAssetPathInCSS(style);
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

export function compile(data: string): string {
  const ast = parseHTMLFragment(data);

  const outputs: string[] = [];

  for (const child of ast.children) {
    if (child.type === "element" && child.tagName === "macaron-component") {
      outputs.push(compileComponent(child));
    }
  }

  const output = outputs.join("");

  return prettier.format(output, {
    parser: "babel",
  });
}
