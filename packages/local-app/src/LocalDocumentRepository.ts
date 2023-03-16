import {
  LocalDocument,
  ProjectJSON,
} from "../../dashboard/src/types/DesktopAPI";
import path from "path";
import fs from "fs";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";

function formatJSON(text: string): string {
  return prettier.format(text, {
    parser: "json",
    plugins: [parserBabel],
  });
}

const all: LocalDocument[] = [
  {
    id: "1",
    title: "sandbox",
    path: path.resolve(__dirname, "../../sandbox/src/uimix/data.json"),
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
    const document = this.getLocalDocument(id);
    if (!document) {
      throw new Error("Document not found");
    }
    return JSON.parse(fs.readFileSync(document.path, { encoding: "utf-8" }));
  }

  setLocalDocumentData(id: string, data: ProjectJSON): void {
    const document = this.getLocalDocument(id);
    if (!document) {
      throw new Error("Document not found");
    }
    fs.writeFileSync(document.path, formatJSON(JSON.stringify(data)));
  }

  saveImage(data: Uint8Array): string {
    return "";
  }
}

export const localDocumentRepository = new LocalDocumentRepository();
