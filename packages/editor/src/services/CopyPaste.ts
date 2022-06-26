import { runInAction } from "mobx";
import { parseFragment, stringifyFragment } from "../fileFormat/fragment";
import { Document } from "../models/Document";
import { ElementInstance } from "../models/ElementInstance";

function createClipboardData(attribute: string, data: string): ClipboardItems {
  const base64 = Buffer.from(data).toString("base64");
  const html = `<span ${attribute}="${base64}"></span>`;

  return [
    new ClipboardItem({ "text/html": new Blob([html], { type: "text/html" }) }),
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

export async function copyLayers(document: Document): Promise<void> {
  const fragment = document.selectedFragment;
  if (!fragment) {
    return;
  }
  const fragmentString = stringifyFragment(fragment);

  await navigator.clipboard.write(
    createClipboardData("data-macaron", fragmentString)
  );
}

export async function pasteLayers(document: Document): Promise<void> {
  const contents = await navigator.clipboard.read();

  const fragmentString = await readClipboardData(contents, "data-macaron");
  if (!fragmentString) {
    return;
  }
  const fragment = parseFragment(fragmentString);
  if (!fragment) {
    return;
  }
  runInAction(() => {
    document.appendFragmentBeforeSelection(fragment);
  });
}

export async function copyStyle(instance: ElementInstance): Promise<void> {
  await navigator.clipboard.write(
    createClipboardData("data-macaron-style", instance.style.toString())
  );
}

export async function pasteStyle(instance: ElementInstance): Promise<void> {
  const contents = await navigator.clipboard.read();

  const styleString = await readClipboardData(contents, "data-macaron-style");
  if (!styleString) {
    return;
  }
  runInAction(() => {
    instance.style.loadString(styleString);
  });
}
