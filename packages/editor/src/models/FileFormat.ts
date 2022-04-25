import type * as hast from "hast";
import { h } from "hastscript";
import { toHtml } from "hast-util-to-html";
import * as parse5 from "parse5";
import { inspect } from "unist-util-inspect";
import { fromParse5 } from "hast-util-from-parse5";
import rehypeMinifyWhitespace from "rehype-minify-whitespace";
import { unified } from "unified";
import { formatHTML } from "../util/Format";
import { Component } from "./Component";
import { Document } from "./Document";
import { DefaultVariant, Variant } from "./Variant";

function dumpComponent(component: Component): hast.Element {
  const children: (hast.Element | string)[] = [];
  children.push("\n", dumpDefaultVariant(component.defaultVariant));

  for (const variant of component.variants) {
    children.push("\n", dumpVariant(variant));
  }

  children.push(
    "\n",
    h("template", ["\n", ...component.rootElement.innerHTML, "\n"]),
    "\n"
  );

  return h(
    "macaron-component",
    {
      name: component.name,
    },
    children
  );
}

function dumpDefaultVariant(variant: DefaultVariant): hast.Element {
  return h("macaron-variant", {
    x: variant.x,
    y: variant.y,
    width: variant.width,
    height: variant.height,
  });
}

function dumpVariant(variant: Variant): hast.Element {
  return h("macaron-variant", {
    selector: variant.selector || undefined,
    mediaQuery: variant.mediaQuery || undefined,
    x: variant.x,
    y: variant.y,
    width: variant.width,
    height: variant.height,
  });
}

function dumpDocument(document: Document): hast.Element[] {
  return document.components.children.map(dumpComponent);
}

export function stringifyDocument(document: Document): string {
  const html = toHtml(dumpDocument(document));
  return formatHTML(html);
}

function loadComponent(node: hast.Element): Component {
  const name = node.properties?.name ?? "unnamed-component";

  const component = new Component();
  component.rename(String(name));

  let variantIndex = 0;

  for (const child of node.children) {
    if (child.type !== "element") {
      continue;
    }

    if (child.tagName === "template" && child.content) {
      const newContent = unified()
        .use(rehypeMinifyWhitespace)
        .runSync(child.content);

      component.rootElement.setInnerHTML(newContent.children);
    }

    if (child.tagName === "macaron-variant") {
      let variant: Variant | DefaultVariant;
      if (variantIndex++ === 0) {
        variant = component.defaultVariant;
      } else {
        variant = new Variant(component);
        variant.selector = String(child.properties?.selector ?? "");
        variant.mediaQuery = String(child.properties?.mediaQuery ?? "");
        component.variants.push(variant);
      }

      variant.x = Number(child.properties?.x ?? 0);
      variant.y = Number(child.properties?.y ?? 0);
      if (child.properties?.width) {
        variant.width = Number(child.properties.width);
      }
      if (child.properties?.height) {
        variant.height = Number(child.properties.height);
      }
    }
  }

  return component;
}

export function parseDocument(data: string): Document {
  const p5ast = parse5.parseFragment(data);
  //@ts-ignore
  let hast: hast.Root = fromParse5(p5ast);
  console.log(inspect(hast));
  hast = unified().use(rehypeMinifyWhitespace).runSync(hast);
  console.log(inspect(hast));

  if (hast.type !== "root") {
    throw new Error("Root node expected");
  }

  const document = new Document();

  for (const child of hast.children) {
    if (child.type === "element" && child.tagName === "macaron-component") {
      const component = loadComponent(child);
      document.components.append(component);
    }
  }

  return document;
}
