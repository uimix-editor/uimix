import {
  LocalDocument,
  ProjectJSON,
} from "../../dashboard/src/types/DesktopAPI";
import path from "path";

const all: LocalDocument[] = [
  {
    id: "1",
    name: "sandbox",
    path: path.resolve(__dirname, "../../sandbox"),
    updatedAt: Date.now(),
  },
];

export class LocalDocumentRepository {
  getLocalDocuments(): LocalDocument[] {
    return all;
  }

  createLocalDocument(): LocalDocument | undefined {
    return undefined;
  }

  addExistingLocalDocument(): LocalDocument | undefined {
    return undefined;
  }

  deleteLocalDocument(id: string): void {
    return;
  }

  getLocalDocumentData(id: string): ProjectJSON {
    return {
      nodes: {},
      styles: {},
    };
  }

  setLocalDocumentData(id: string, data: ProjectJSON): void {
    return;
  }

  saveImage(data: Uint8Array): string {
    return "";
  }
}

export const localDocumentRepository = new LocalDocumentRepository();
