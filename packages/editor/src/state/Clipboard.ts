import { NodeClipboardData } from "@uimix/node-data";

// const mimeType = "application/x-macaron-nodes";

export class Clipboard {
  static async writeNodes(data: NodeClipboardData) {
    // const json = JSON.stringify(nodes);

    // await navigator.clipboard.write([
    //   new ClipboardItem({
    //     [`web ${mimeType}`]: new Blob([json], {
    //       type: mimeType,
    //     }),
    //   }),
    // ]);

    await navigator.clipboard.writeText(JSON.stringify(data));
  }

  static async readNodes(): Promise<NodeClipboardData | undefined> {
    // const items = await navigator.clipboard.read();
    // const item = items.find((item) => item.types.includes(`web ${mimeType}`));
    // if (!item) {
    // try parsing text as JSON
    const text = await navigator.clipboard.readText();
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
