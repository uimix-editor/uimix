import {
  LocalDocument,
  ProjectJSON,
} from "../../dashboard/src/types/DesktopAPI";
import path from "path";
import fs from "fs";

const all: LocalDocument[] = [
  {
    id: "1",
    title: "sandbox",
    path: path.resolve(__dirname, "../../sandbox"),
    updatedAt: new Date().toString(),
  },
];

export class LocalDocumentRepository {
  getLocalDocuments(): LocalDocument[] {
    return all;
  }

  getLocalDocument(id: string): LocalDocument | undefined {
    return all.find((doc) => doc.id === id);
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
    const jsonPath = path.resolve(
      __dirname,
      "../../sandbox/src/uimix/data.json"
    );
    return JSON.parse(fs.readFileSync(jsonPath, { encoding: "utf-8" }));
  }

  setLocalDocumentData(id: string, data: ProjectJSON): void {
    return;
  }

  saveImage(data: Uint8Array): string {
    return "";
  }
}

export const localDocumentRepository = new LocalDocumentRepository();
