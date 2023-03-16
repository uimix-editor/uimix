import {
  LocalDocument,
  ProjectJSON,
} from "../../dashboard/src/types/DesktopAPI";
import path from "path";
import fs from "fs";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import { dialog } from "electron";
import { createId } from "@paralleldrive/cuid2";

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
    path: path.resolve(__dirname, "../../sandbox/src/components.uimix"),
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

  async createLocalDocument(): Promise<LocalDocument | undefined> {
    const result = await dialog.showSaveDialog({
      title: "Save Project",
      defaultPath: path.resolve(__dirname, "../../sandbox/src"),
      filters: [
        {
          name: "Uimix Project",
          extensions: ["uimix"],
        },
      ],
    });
    const filePath = result.filePath;
    if (!filePath) {
      return;
    }

    const initialContent: ProjectJSON = {
      nodes: {
        project: { type: "project", index: 0 },
        [createId()]: {
          type: "page",
          name: "Page 1",
          parent: "project",
          index: 0,
        },
      },
      styles: {},
    };

    fs.writeFileSync(filePath, formatJSON(JSON.stringify(initialContent)));

    const title = path.basename(filePath, ".uimix");
    const updatedAt = new Date().toString();
    const document: LocalDocument = {
      id: createId(),
      title,
      path: filePath,
      updatedAt,
    };
    all.push(document);

    return document;
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
