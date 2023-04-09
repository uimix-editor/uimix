import { NodeClipboardData } from "@uimix/node-data";

// const mimeType = "application/x-macaron-nodes";

interface ExternalClipboard {
  get(type: "text" | "image"): Promise<string>;
  set(type: "text" | "image", textOrDataURL: string): Promise<void>;
}

export class Clipboard {
  static externalClipboard: ExternalClipboard | undefined;

  static async writeNodes(data: NodeClipboardData) {
    // const json = JSON.stringify(nodes);

    // await navigator.clipboard.write([
    //   new ClipboardItem({
    //     [`web ${mimeType}`]: new Blob([json], {
    //       type: mimeType,
    //     }),
    //   }),
    // ]);

    const text = JSON.stringify(data);
    if (this.externalClipboard) {
      await this.externalClipboard.set("text", text);
    } else {
      await navigator.clipboard.writeText(text);
    }
  }

  static async readNodes(): Promise<NodeClipboardData | undefined> {
    // const items = await navigator.clipboard.read();
    // const item = items.find((item) => item.types.includes(`web ${mimeType}`));
    // if (!item) {
    // try parsing text as JSON
    const text =
      (await this.externalClipboard?.get("text")) ??
      (await navigator.clipboard.readText());
    if (!text) {
      return;
    }
    try {
      return NodeClipboardData.parse(JSON.parse(text));
    } catch (e) {
      console.error(e);
      return;
    }
    // }
    // const blob = await item.getType(`web ${mimeType}`);
    // return JSONClipboardData.parse(JSON.parse(await blob.text()));
  }
}
