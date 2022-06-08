import type * as hast from "hast";
import { upperFirst, camelCase } from "lodash-es";
import { toHtml } from "hast-util-to-html";
import dedent from "dedent";
import { parseHTMLFragment } from "./util";
import { fixAssetPathInCSS, fixAssetPathInHTMLTree } from "./fix-asset-path";
import { resetCSS } from "./resetCSS";

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

    const style = \`\n${resetCSS}\n${dedent(style)}\`;
    const template = \`\n${dedent(template)}\`;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = ${"`<style>${style}</style>${template}`"};
  }
}

customElements.define(${JSON.stringify(name)}, ${className});
`;
}

function compileGlobalStyle(ast: hast.Element): string {
  const style = (ast.children[0] as hast.Text).value;
  return `
const style = \`${dedent(style)}\`;
const styleElement = document.createElement("style");
styleElement.innerHTML = style;
document.head.appendChild(styleElement);
`;
}

function compileImports(ast: hast.Root): string[] {
  const scriptTags = ast.children.filter(
    (child): child is hast.Element =>
      child.type === "element" &&
      child.tagName === "script" &&
      child.properties?.type === "module"
  );

  const imports = scriptTags.map((script) => {
    const src = script.properties?.src?.toString();
    if (!src) {
      throw new Error("script must have a src");
    }

    return `import "${src}";\n`;
  });

  return imports;
}

export function compile(data: string): string {
  const ast = parseHTMLFragment(data);

  const outputs: string[] = [];

  outputs.push(...compileImports(ast));

  for (const child of ast.children) {
    if (child.type === "element" && child.tagName === "macaron-component") {
      outputs.push(compileComponent(child));
    }
    if (child.type === "element" && child.tagName === "style") {
      outputs.push(compileGlobalStyle(child));
    }
  }

  return outputs.join("");
}
