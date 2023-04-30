import * as Data from "@uimix/model/src/data/v1";
import { projectState } from "./ProjectState";
import isSvg from "is-svg";

// const mimeType = "application/x-macaron-nodes";

interface ClipboardHandler {
  get(type: "text" | "image"): Promise<string | undefined>;
  set(type: "text" | "image", textOrDataURL: string): Promise<void>;
}

class DefaultClipboardHandler {
  async get(type: "text" | "image") {
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

        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    }
  }

  async set(type: "text" | "image", textOrDataURL: string) {
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
  }
}

export class Clipboard {
  static handler: ClipboardHandler = new DefaultClipboardHandler();

  static async writeNodes(data: Data.NodeClipboard) {
    const text = JSON.stringify(data);
    await this.handler.set("text", text);
  }

  static async readNodes(): Promise<Data.NodeClipboard | undefined> {
    const imageDataURL = await this.handler.get("image");
    if (imageDataURL) {
      const [hash] = await projectState.project.imageManager.insertDataURL(
        imageDataURL
      );

      return {
        uimixClipboardVersion: "0.0.1",
        type: "nodes",
        nodes: [
          {
            id: "",
            type: "image",
            name: "Image",
            style: { width: "hug", height: "hug", imageHash: hash },
            children: [],
          },
        ],
        images: {},
      };
    }

    const text = await this.handler?.get("text");
    if (text) {
      if (isSvg(text)) {
        return {
          uimixClipboardVersion: "0.0.1",
          type: "nodes",
          nodes: [
            {
              id: "",
              type: "svg",
              name: "SVG",
              style: { width: "hug", height: "hug", svgContent: text },
              children: [],
            },
          ],
          images: {},
        };
      }

      try {
        return Data.NodeClipboard.parse(JSON.parse(text));
      } catch (e) {
        console.error(e);
        return;
      }
    }
  }
}
