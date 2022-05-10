import * as fs from "fs";
import * as prettier from "prettier";
import { upperFirst, camelCase } from "lodash-es";
import { parseHTMLFragment } from "./util";

export function compileFile(filePath: string): void {
  const data = fs.readFileSync(filePath, "utf8");
  const out = compile(data);
  fs.writeFileSync(filePath.replace(/\.macaron$/, ".js"), out);
}

export function compile(data: string): string {
  const ast = parseHTMLFragment(data);
  console.log(ast);

  const outputs: string[] = [];

  for (const child of ast.children) {
    if (child.type === "element" && child.tagName === "macaron-component") {
      const name = child.properties?.name?.toString();
      if (!name) {
        throw new Error("macaron-component must have a name");
      }

      const className = upperFirst(camelCase(name));

      outputs.push(`
        class ${className} extends HTMLElement {
          constructor() {
            super();
            this.attachShadow({ mode: "open" });
            this.shadowRoot.innerHTML = ${"`<style>${style}</style>${template}`"};
          }
        }
      `);
    }
  }

  const output = outputs.join("");

  return prettier.format(output, {
    parser: "babel",
  });
}
