import { runInAction } from "mobx";
import { parseFragment, stringifyFragment } from "../fileFormat/fragment";
import { Document } from "../models/Document";

export async function copyLayers(document: Document): Promise<void> {
  const fragment = document.selectedFragment;
  if (!fragment) {
    return;
  }

  const fragmentString = stringifyFragment(fragment);
  const base64 = btoa(fragmentString);

  const encoded = `<span data-macaron="${base64}"></span>`;

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

  const match = encoded.match(/<span data-macaron="(.*)">/);
  if (!match) {
    return;
  }

  const base64 = match[1];
  const fragmentString = atob(base64);
  const fragment = parseFragment(fragmentString);
  if (fragment) {
    runInAction(() => {
      document.appendFragmentBeforeSelection(fragment);
    });
  }
}
