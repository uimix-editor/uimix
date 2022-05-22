import type * as hast from "hast";
import { toHtml } from "hast-util-to-html";
import { isNonVisualElement } from "@seanchas116/paintkit/src/util/HTMLTagCategory";
import { parseHTMLFragment } from "../util/Hast";
import { Fragment } from "../models/Fragment";
import { instancesFromHTML } from "../models/ElementInstance";
import { dumpComponent, loadComponent } from "./component";
import { dumpVariant, loadVariant } from "./variant";

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
    case "instances": {
      const hastNodes = fragment.instances.map((i) => i.outerHTML);
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
    type: "instances",
    instances: instancesFromHTML(visualNodes),
  };
}
