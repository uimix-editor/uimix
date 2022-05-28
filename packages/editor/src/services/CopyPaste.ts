import { runInAction } from "mobx";
import { parseFragment, stringifyFragment } from "../fileFormat/fragment";
import { Document } from "../models/Document";

export async function copyLayers(document: Document): Promise<void> {
  const fragment = document.selectedFragment;
  if (!fragment) {
    return;
  }

  const html = stringifyFragment(fragment);

  const type = "text/html";
  const blob = new Blob([html], { type });
  const data = [new ClipboardItem({ [type]: blob })];

  await navigator.clipboard.write(data);
}

export async function pasteLayers(document: Document): Promise<void> {
  const contents = await navigator.clipboard.read();

  const item = contents.find((i) => i.types.includes("text/html"));
  if (!item) {
    return;
  }

  const html = await (await item.getType("text/html")).text();
  const fragment = parseFragment(html);
  if (fragment) {
    runInAction(() => {
      document.appendFragmentBeforeSelection(fragment);
    });
  }
}
