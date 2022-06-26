import { runInAction } from "mobx";
import { parseFragment, stringifyFragment } from "../fileFormat/fragment";
import { Document } from "../models/Document";

function encodeClipboardDataInHTML(attribute: string, data: string): string {
  const base64 = Buffer.from(data).toString("base64");
  return `<span ${attribute}="${base64}"></span>`;
}

function decodeClipboardDataFromHTML(attribute: string, html: string): string {
  const match = html.match(new RegExp(`<span ${attribute}="(.*?)"></span>`));
  if (match) {
    return Buffer.from(match[1], "base64").toString();
  }
  return "";
}

export async function copyLayers(document: Document): Promise<void> {
  const fragment = document.selectedFragment;
  if (!fragment) {
    return;
  }

  const fragmentString = stringifyFragment(fragment);
  const encoded = encodeClipboardDataInHTML("data-macaron", fragmentString);

  const type = "text/html";
  const blob = new Blob([encoded], { type });
  const data = [new ClipboardItem({ [type]: blob })];

  await navigator.clipboard.write(data);
}

export async function pasteLayers(document: Document): Promise<void> {
  const contents = await navigator.clipboard.read();

  const item = contents.find((i) => i.types.includes("text/html"));
  if (!item) {
    return;
  }

  const encoded = await (await item.getType("text/html")).text();

  const fragmentString = decodeClipboardDataFromHTML("data-macaron", encoded);
  const fragment = parseFragment(fragmentString);
  if (fragment) {
    runInAction(() => {
      document.appendFragmentBeforeSelection(fragment);
    });
  }
}
