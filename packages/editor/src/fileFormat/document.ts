import type * as hast from "hast";
import { h } from "hastscript";
import { toHtml } from "hast-util-to-html";
import { isEqual } from "lodash-es";
import { formatHTML } from "../util/Format";
import { parseHTMLFragment } from "../util/Hast";
import { Document } from "../models/Document";
import { dumpComponent, loadComponent } from "./component";
import { dumpGlobalStyle } from "./globalStyle";

function dumpDocument(document: Document): hast.Element[] {
  const components = document.components.children.map(dumpComponent);

  const globalStyle = h("style", {}, dumpGlobalStyle(document).toString());

  const preludeScripts = document.preludeScripts.map((src) =>
    h("script", {
      type: "module",
      src,
    })
  );
  const preludeStyleSheets = document.preludeStyleSheets.map((href) =>
    h("link", {
      rel: "stylesheet",
      href,
    })
  );

  return [...preludeStyleSheets, ...preludeScripts, globalStyle, ...components];
}

function loadDocument(hastNodes: hast.Content[]): Document {
  const document = new Document();

  for (const child of hastNodes) {
    if (child.type !== "element") {
      continue;
    }

    if (child.tagName === "macaron-component") {
      const component = loadComponent(child);
      document.components.append(component);
      continue;
    }

    if (
      child.tagName === "script" &&
      child.properties?.type === "module" &&
      child.properties?.src
    ) {
      document.preludeScripts.push(String(child.properties.src));
      continue;
    }

    if (
      child.tagName === "link" &&
      isEqual(child.properties?.rel, ["stylesheet"]) &&
      child.properties?.href
    ) {
      document.preludeStyleSheets.push(String(child.properties.href));
      continue;
    }
  }

  return document;
}

export function stringifyDocument(document: Document): string {
  const html = toHtml(dumpDocument(document));
  return formatHTML(html);
}

export function parseDocument(data: string): Document {
  const hast = parseHTMLFragment(data);
  return loadDocument(hast.children);
}
