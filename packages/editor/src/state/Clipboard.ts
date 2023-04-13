import { NodeClipboardData } from "@uimix/model/src/data/v1";

// const mimeType = "application/x-macaron-nodes";

interface ClipboardHandler {
  get(type: "text" | "image"): Promise<string>;
  set(type: "text" | "image", textOrDataURL: string): Promise<void>;
}

export class Clipboard {
  static handler: ClipboardHandler = {
    get: async (type: "text" | "image") => {
      return await navigator.clipboard.readText();
    },
    set: async (type: "text" | "image", textOrDataURL: string) => {
      await navigator.clipboard.writeText(textOrDataURL);
    },
  };

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
    await this.handler.set("text", text);
  }

  static async readNodes(): Promise<NodeClipboardData | undefined> {
    // const items = await navigator.clipboard.read();
    // const item = items.find((item) => item.types.includes(`web ${mimeType}`));
    // if (!item) {
    // try parsing text as JSON
    const text = await this.handler?.get("text");
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
