import type * as hast from "hast";
import { h } from "hastscript";
import { toHtml } from "hast-util-to-html";
import * as parse5 from "parse5";
import { fromParse5 } from "hast-util-from-parse5";
import rehypeMinifyWhitespace from "rehype-minify-whitespace";
import { unified } from "unified";
import { Rule, Root } from "postcss";
import { isNonVisualElement } from "@seanchas116/paintkit/src/util/HTMLTagCategory";
import { kebabCase } from "lodash-es";
import { formatHTML } from "../util/Format";
import { Component } from "./Component";
import { Document } from "./Document";
import { DefaultVariant, Variant } from "./Variant";
import { nodesFromHTML } from "./Element";
import { Fragment } from "./Fragment";
import { styleKeys } from "./Style";

function dumpComponent(component: Component): hast.Element {
  const children: (hast.Element | string)[] = [];
  children.push("\n", dumpVariant(component.defaultVariant));

  const style = new Root();

  for (const variant of component.variants.children) {
    children.push("\n", dumpVariant(variant));
  }

  for (const variant of component.allVariants) {
    if (variant.type === "defaultVariant") {
      const rootInstance = variant.rootInstance!;

      for (const instance of rootInstance.allDescendants ?? []) {
        if (instance.type !== "element") {
          continue;
        }

        const selector =
          instance === rootInstance ? ":host" : `#${instance.element.id}`;

        const rule = new Rule({ selector });
        for (const key of styleKeys) {
          if (instance.style[key] !== undefined) {
            const value = instance.style[key];
            if (value !== undefined) {
              rule.append({
                prop: kebabCase(key),
                value: value,
              });
            }
          }
        }

        if (rule.nodes.length) {
          style.append(rule);
        }
      }
    }
  }

  children.push(
    "\n",
    h("template", ["\n", ...component.rootElement.innerHTML, "\n"]),
    "\n"
  );

  children.push(h("style", {}, style.toString()));

  return h(
    "macaron-component",
    {
      name: component.name,
    },
    children
  );
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
        loadVariantDimensions(variant, child);
      } else {
        variant = loadVariant(child);
        component.variants.append(variant);
      }
    }
  }

  return component;
}

function dumpVariant(variant: Variant | DefaultVariant): hast.Element {
  return h("macaron-variant", {
    x: variant.x,
    y: variant.y,
    width: variant.width,
    height: variant.height,
    ...(variant.type === "variant"
      ? {
          selector: variant.selector || undefined,
          media: variant.mediaQuery || undefined,
        }
      : undefined),
  });
}

function loadVariantDimensions(
  variant: Variant | DefaultVariant,
  node: hast.Element
) {
  variant.x = Number(node.properties?.x ?? 0);
  variant.y = Number(node.properties?.y ?? 0);
  if (node.properties?.width) {
    variant.width = Number(node.properties.width);
  }
  if (node.properties?.height) {
    variant.height = Number(node.properties.height);
  }
}

function loadVariant(node: hast.Element): Variant {
  const variant = new Variant();
  variant.selector = String(node.properties?.selector ?? "");
  variant.mediaQuery = String(node.properties?.media ?? "");
  loadVariantDimensions(variant, node);
  return variant;
}

function dumpDocument(document: Document): hast.Element[] {
  return document.components.children.map(dumpComponent);
}

function loadDocument(hastNodes: hast.Content[]): Document {
  const document = new Document();

  for (const child of hastNodes) {
    if (child.type === "element" && child.tagName === "macaron-component") {
      const component = loadComponent(child);
      document.components.append(component);
    }
  }

  return document;
}

export function stringifyDocument(document: Document): string {
  const html = toHtml(dumpDocument(document));
  return formatHTML(html);
}

function parseHTMLFragment(data: string): hast.Root {
  const p5ast = parse5.parseFragment(data);
  //@ts-ignore
  const hast: hast.Root = fromParse5(p5ast);
  return unified().use(rehypeMinifyWhitespace).runSync(hast);
}

export function parseDocument(data: string): Document {
  const hast = parseHTMLFragment(data);
  return loadDocument(hast.children);
}

export function stringifyFragment(fragment: Fragment): string {
  switch (fragment.type) {
    case "components": {
      const hastNodes = fragment.components.map(dumpComponent);
      return toHtml(hastNodes);
    }
    case "variants": {
      const hastNodes = fragment.variants.map(dumpVariant);
      return toHtml(hastNodes);
    }
    case "nodes": {
      const hastNodes = fragment.nodes.map((node) => node.outerHTML);
      return toHtml(hastNodes);
    }
  }
}

export function parseFragment(data: string): Fragment | undefined {
  const hast = parseHTMLFragment(data);

  const componentHasts = hast.children.filter(
    (child): child is hast.Element =>
      child.type === "element" && child.tagName === "macaron-component"
  );
  if (componentHasts.length) {
    return {
      type: "components",
      components: componentHasts.map(loadComponent),
    };
  }

  const variantHasts = hast.children.filter(
    (child): child is hast.Element =>
      child.type === "element" && child.tagName === "macaron-variant"
  );
  if (variantHasts.length) {
    return {
      type: "variants",
      variants: variantHasts.map(loadVariant),
    };
  }

  const visualNodes = hast.children.filter((child) => {
    if (child.type === "element" && isNonVisualElement(child.tagName)) {
      return false;
    }
    return true;
  });

  return {
    type: "nodes",
    nodes: nodesFromHTML(visualNodes),
  };
}
