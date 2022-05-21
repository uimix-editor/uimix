import { Color } from "@seanchas116/paintkit/src/util/Color";
import type * as hast from "hast";
import { toHtml } from "hast-util-to-html";
import { h } from "hastscript";
import * as postcss from "postcss";
import { CSSVariable } from "../models/CSSVariable";
import { Document } from "../models/Document";

export function dumpGlobalStyle(document: Document): hast.Element {
  const root = new postcss.Rule({
    selector: ":root",
  });

  for (const variable of document.cssVariables.children) {
    root.append(
      new postcss.Declaration({
        prop: "--" + variable.name,
        value: variable.color.toString(),
      })
    );
  }

  return h("style", {}, root.toString());
}

export function loadGlobalStyle(
  document: Document,
  element: hast.Element
): void {
  const parsed = postcss.parse(toHtml(element.children));

  for (const rule of parsed.nodes) {
    if (rule.type === "rule" && rule.selector === ":root") {
      const root = rule;

      for (const declaration of root.nodes) {
        if (declaration.type === "decl" && declaration.prop.startsWith("--")) {
          const name = declaration.prop.slice(2);
          document.cssVariables.append(
            new CSSVariable({
              name,
              color: Color.from(declaration.value),
            })
          );
        }
      }
    }
  }
}
