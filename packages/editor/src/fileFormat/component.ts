import type * as hast from "hast";
import { h } from "hastscript";
import { toHtml } from "hast-util-to-html";
import rehypeMinifyWhitespace from "rehype-minify-whitespace";
import { unified } from "unified";
import * as postcss from "postcss";
import { Component } from "../models/Component";
import { DefaultVariant, Variant } from "../models/Variant";
import { getInstance } from "../models/InstanceRegistry";
import { dumpComponentStyles, loadComponentStyles } from "./style";
import { dumpVariant, loadVariantDimensions, loadVariant } from "./variant";

export function dumpComponent(component: Component): hast.Element {
  const children: (hast.Element | string)[] = [];
  children.push("\n", dumpVariant(component.defaultVariant));

  for (const variant of component.variants.children) {
    children.push("\n", dumpVariant(variant));
  }

  children.push(
    "\n",
    h("template", ["\n", ...component.rootElement.innerHTML, "\n"]),
    "\n",
    h("style", {}, dumpComponentStyles(component).toString()),
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

export function loadComponent(node: hast.Element): Component {
  const name = node.properties?.name ?? "unnamed-component";

  const component = new Component();
  component.rename(String(name));

  let variantIndex = 0;

  let styleElement: hast.Element | undefined;

  for (const child of node.children) {
    if (child.type !== "element") {
      continue;
    }

    if (child.tagName === "template" && child.content) {
      const newContent = unified()
        .use(rehypeMinifyWhitespace)
        .runSync(child.content);

      getInstance(undefined, component.rootElement).setInnerHTML(
        newContent.children
      );
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

    if (child.tagName === "style") {
      styleElement = child;
    }
  }

  if (styleElement && styleElement.children.length) {
    loadComponentStyles(
      component,
      postcss.parse(toHtml(styleElement.children))
    );
  }

  return component;
}
