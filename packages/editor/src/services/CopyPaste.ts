import { runInAction } from "mobx";
import * as postcss from "postcss";
import { toHtml } from "hast-util-to-html";
import { stringifyFragment } from "../fileFormat/fragment";
import { Document } from "../models/Document";
import { ElementInstance } from "../models/ElementInstance";
import { positionalStyleKeys } from "../models/Style";
import { EditorState } from "../state/EditorState";
import { appendFragmentStringBeforeSelection } from "./Append";

export async function copy(document: Document): Promise<void> {
  return copyFragment(document);
}

export async function paste(editorState: EditorState): Promise<void> {
  if (await pasteFragment(editorState)) {
    return;
  }
  if (await pasteStyle(editorState)) {
    return;
  }
  await pasteHTML(editorState);
}

export async function copyFragment(document: Document): Promise<void> {
  const fragment = document.selectedFragment;
  if (!fragment) {
    return;
  }
  const fragmentString = stringifyFragment(fragment);
  const text = toHtml(document.selectedNodes.map((node) => node.outerHTML));
  await writeCustomData("data-macaron", fragmentString, text);
}

export async function pasteFragment(
  editorState: EditorState
): Promise<boolean> {
  const fragmentString = await readCustomData("data-macaron");
  if (!fragmentString) {
    return false;
  }
  await appendFragmentStringBeforeSelection(editorState, fragmentString);
  return true;
}

export async function copyHTML(document: Document): Promise<void> {
  const nodes = document.selectedNodes;
  if (!nodes.length) {
    return;
  }
  const fragmentString = toHtml(nodes.map((node) => node.outerHTML));
  await navigator.clipboard.writeText(fragmentString);
}

export async function pasteHTML(editorState: EditorState): Promise<void> {
  const text = await navigator.clipboard.readText();
  await appendFragmentStringBeforeSelection(editorState, text);
}

export async function copyStyle(instance: ElementInstance): Promise<void> {
  const style = instance.style
    .toPostCSS({
      exclude: new Set(positionalStyleKeys),
    })
    .toString();

  await writeCustomData("data-macaron-style", style, style);
}

export async function pasteStyle(editorState: EditorState): Promise<boolean> {
  const styleString = await readCustomData("data-macaron-style");
  if (!styleString) {
    return false;
  }
  runInAction(() => {
    const root = postcss.parse(styleString);

    for (const instance of editorState.document.selectedElementInstances) {
      instance.style.loadPostCSS(root, {
        exclude: new Set(positionalStyleKeys),
      });
    }
  });
  return true;
}

async function writeCustomData(
  attribute: string,
  data: string,
  alt: string
): Promise<void> {
  const base64 = Buffer.from(data).toString("base64");
  const html = `<span ${attribute}="${base64}"></span>`;

  const items = [
    new ClipboardItem({
      "text/html": new Blob([html], { type: "text/html" }),
      "text/plain": new Blob([alt], { type: "text/plain" }),
    }),
  ];

  await navigator.clipboard.write(items);
}

async function readCustomData(attribute: string): Promise<string | undefined> {
  const clipboardItems = await navigator.clipboard.read();

  const item = clipboardItems.find((i) => i.types.includes("text/html"));
  if (!item) {
    return;
  }

  const html = await (await item.getType("text/html")).text();

  const match = html.match(new RegExp(`<span ${attribute}="(.*?)"></span>`));
  if (!match) {
    return;
  }
  return Buffer.from(match[1], "base64").toString();
}
