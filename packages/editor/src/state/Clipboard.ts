import { NodeClipboardData } from "@uimix/model/src/data/v1";
import { projectState } from "./ProjectState";
import { DefaultClipboardHandler } from "./DefaultClipboardHandler";
import { ClipboardHandler } from "../types/ClipboardHandler";

// const mimeType = "application/x-macaron-nodes";

export class Clipboard {
  static handler: ClipboardHandler = new DefaultClipboardHandler();

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
    const imageDataURL = await this.handler.get("image");
    if (imageDataURL) {
      const blob = await fetch(imageDataURL).then((r) => r.blob());
      const [hash] = await projectState.project.imageManager.insert(blob);

      return {
        uimixClipboardVersion: "0.0.1",
        type: "nodes",
        nodes: [
          {
            id: "",
            type: "image",
            name: "Image",
            style: {
              imageHash: hash,
            },
            children: [],
          },
        ],
        images: {},
      };
    }

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
