import type { ProjectJSON } from "@uimix/node-data/src/project";

export { ProjectJSON };

export interface DesktopAPI {
  getDocumentData(): Promise<ProjectJSON>;
  setDocumentData(data: ProjectJSON): Promise<void>;
  onDocumentDataChange(callback: (data: ProjectJSON) => void): () => void;
}

export function getDesktopAPI(): DesktopAPI | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return window.uimixDesktopAPI;
}
