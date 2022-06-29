import { runInAction } from "mobx";
import * as postcss from "postcss";
import { toHtml } from "hast-util-to-html";
import isSvg from "is-svg";
import { stringifyFragment } from "../fileFormat/fragment";
import { Document } from "../models/Document";
import { ElementInstance } from "../models/ElementInstance";
import { positionalStyleKeys } from "../models/Style";
import { EditorState } from "../state/EditorState";
import { appendFragmentStringBeforeSelection } from "./Append";

function createClipboardData(attribute: string, data: string): ClipboardItems {
  const base64 = Buffer.from(data).toString("base64");
  const html = `<span ${attribute}="${base64}"></span>`;

  return [
    new ClipboardItem({
      "text/html": new Blob([html], { type: "text/html" }),
    }),
  ];
}

async function readClipboardData(
  clipboardItems: ClipboardItems,
  attribute: string
): Promise<string | undefined> {
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

export async function copy(document: Document): Promise<void> {
  const fragment = document.selectedFragment;
  if (!fragment) {
    return;
  }
  const fragmentString = stringifyFragment(fragment);

  await navigator.clipboard.write(
    createClipboardData("data-macaron", fragmentString)
  );
}

export async function paste(editorState: EditorState): Promise<boolean> {
  const contents = await navigator.clipboard.read();

  const fragmentString = await readClipboardData(contents, "data-macaron");
  if (fragmentString) {
    await appendFragmentStringBeforeSelection(editorState, fragmentString);
    return true;
  }

  if (await pasteStyle(editorState)) {
    return true;
  }

  const text = await navigator.clipboard.readText();
  if (isSvg(text)) {
    await appendFragmentStringBeforeSelection(editorState, text);
    return true;
  }

  return false;
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
  await navigator.clipboard.write(
    createClipboardData(
      "data-macaron-style",
      instance.style
        .toPostCSS({
          exclude: new Set(positionalStyleKeys),
        })
        .toString()
    )
  );
}

export async function pasteStyle(editorState: EditorState): Promise<boolean> {
  const contents = await navigator.clipboard.read();

  const styleString = await readClipboardData(contents, "data-macaron-style");
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
