import { runInAction } from "mobx";
import * as postcss from "postcss";
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

export async function copyFragments(document: Document): Promise<void> {
  const fragment = document.selectedFragment;
  if (!fragment) {
    return;
  }
  const fragmentString = stringifyFragment(fragment);

  await navigator.clipboard.write(
    createClipboardData("data-macaron", fragmentString)
  );
}

export async function pasteFragments(editorState: EditorState): Promise<void> {
  const contents = await navigator.clipboard.read();

  const fragmentString = await readClipboardData(contents, "data-macaron");
  if (fragmentString) {
    await appendFragmentStringBeforeSelection(editorState, fragmentString);
  }
}

export async function copyHTML(document: Document): Promise<void> {
  const fragment = document.selectedFragment;
  if (!fragment) {
    return;
  }
  const fragmentString = stringifyFragment(fragment);
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

export async function pasteStyle(instance: ElementInstance): Promise<void> {
  const contents = await navigator.clipboard.read();

  const styleString = await readClipboardData(contents, "data-macaron-style");
  if (!styleString) {
    return;
  }
  runInAction(() => {
    const root = postcss.parse(styleString);
    instance.style.loadPostCSS(root, {
      exclude: new Set(positionalStyleKeys),
    });
  });
}
