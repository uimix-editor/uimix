import type * as Data from "@uimix/model/src/data/v1";

type ProjectJSON = Data.Project;

export type { ProjectJSON };

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
