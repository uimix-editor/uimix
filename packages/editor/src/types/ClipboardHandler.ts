export interface ClipboardHandler {
  get(type: "text" | "image"): Promise<string | undefined>;
  set(type: "text" | "image", textOrDataURL: string): Promise<void>;
}
