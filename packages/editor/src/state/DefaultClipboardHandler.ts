import { ClipboardHandler } from "../types/ClipboardHandler";

export class DefaultClipboardHandler implements ClipboardHandler {
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
