import type * as hast from "hast";
import { h } from "hastscript";
import { toHtml } from "hast-util-to-html";
import { formatHTML } from "../util/Format";
import { Component } from "./Component";
import { Document } from "./Document";

function dumpComponent(component: Component): hast.Element {
  return h("macaron-component", [
    "\n",
    h("template", ["\n", ...component.rootElement.innerHTML, "\n"]),
    "\n",
  ]);
}

function dumpDocument(document: Document): hast.Element[] {
  return document.components.children.map(dumpComponent);
}

export function stringifyDocument(document: Document): string {
  const html = toHtml(dumpDocument(document));
  return formatHTML(html);
}
