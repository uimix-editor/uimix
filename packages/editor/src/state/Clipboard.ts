import { NodeClipboardData } from "@uimix/model/src/data/v1";
import { ClipboardHandler } from "../types/ClipboardHandler";

// const mimeType = "application/x-macaron-nodes";

export class Clipboard {
  static handler: ClipboardHandler = {
    get: async (type: "text" | "image") => {
      switch (type) {
        case "text":
          return await navigator.clipboard.readText();
        case "image": {
          const items = await navigator.clipboard.read();
          const item = items.find((item) => item.types.includes(`image/png`));
          if (!item) {
            return;
          }
          const blob = await item.getType(`image/png`);

          return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        }
      }
    },
    set: async (type: "text" | "image", textOrDataURL: string) => {
      switch (type) {
        case "text":
          await navigator.clipboard.writeText(textOrDataURL);
        case "image": {
          const blob = await fetch(textOrDataURL).then((r) => r.blob());
          await navigator.clipboard.write([
            new ClipboardItem({
              "image/png": blob,
            }),
          ]);
        }
      }
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
