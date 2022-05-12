import * as fs from "fs";
import type * as hast from "hast";
import * as prettier from "prettier";
import { upperFirst, camelCase } from "lodash-es";
import { toHtml } from "hast-util-to-html";
import { parseHTMLFragment } from "./util";

export interface CompileOptions {
  publicPath: string;
}

export function compileFile(filePath: string, options: CompileOptions): void {
  const data = fs.readFileSync(filePath, "utf8");
  const out = compile(data, options);
  fs.writeFileSync(filePath.replace(/\.macaron$/, ".js"), out);
}

function compileComponent(ast: hast.Element, options: CompileOptions): string {
  const name = ast.properties?.name?.toString();
  if (!name) {
    throw new Error("macaron-component must have a name");
  }

  const className = upperFirst(camelCase(name));

  let style: string = "";
  let template: string = "";

  // TODO: fix asset URL based on publicPath

  for (const child of ast.children) {
    if (child.type === "element" && child.tagName === "template") {
      template = toHtml(child.content!);
    }
    if (child.type === "element" && child.tagName === "style") {
      style = (child.children[0] as hast.Text).value;
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

export function compile(data: string, options: CompileOptions): string {
  const ast = parseHTMLFragment(data);
  console.log(ast);

  const outputs: string[] = [];

  for (const child of ast.children) {
    if (child.type === "element" && child.tagName === "macaron-component") {
      outputs.push(compileComponent(child, options));
    }
  }

  const output = outputs.join("");

  return prettier.format(output, {
    parser: "babel",
  });
}
