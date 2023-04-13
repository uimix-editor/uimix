export interface ClipboardHandler {
  get(type: "text" | "image"): Promise<string>;
  set(type: "text" | "image", textOrDataURL: string): Promise<void>;
}
