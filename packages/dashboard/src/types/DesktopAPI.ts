import type { ProjectJSON } from "@uimix/node-data/src/project";

export { ProjectJSON };

export interface DocumentMetadata {
  name: string;
}

export interface DesktopAPI {
  getDocumentMetadata(): Promise<DocumentMetadata>;
  onDocumentMetadataChange(
    callback: (metadata: DocumentMetadata) => void
  ): () => void;

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
