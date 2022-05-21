import type * as hast from "hast";
import { h } from "hastscript";
import * as postcss from "postcss";
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

export function loadGlobalStyle(document: Document, rule: postcss.Rule): void {}
