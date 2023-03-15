import { LocalDocument } from "./types/LocalDocument";
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

  getLocalDocumentData(id: string): Uint8Array {
    return new Uint8Array();
  }

  setLocalDocumentData(id: string, data: Uint8Array): void {
    return;
  }

  saveImage(data: Uint8Array): string {
    return "";
  }
}

export const localDocumentRepository = new LocalDocumentRepository();
