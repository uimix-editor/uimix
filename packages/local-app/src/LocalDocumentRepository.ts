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
import Store from "electron-store";

const store = new Store<{
  documents: LocalDocument[];
}>();

function formatJSON(text: string): string {
  return prettier.format(text, {
    parser: "json",
    plugins: [parserBabel],
  });
}

export class LocalDocumentRepository {
  get documents(): readonly LocalDocument[] {
    return store.get("documents", []);
  }

  set documents(documents: readonly LocalDocument[]) {
    store.set("documents", documents);
  }

  getLocalDocuments(): readonly LocalDocument[] {
    return this.documents;
  }

  getLocalDocument(id: string): LocalDocument | undefined {
    // TODO: index
    return this.documents.find((doc) => doc.id === id);
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
    this.documents = [...this.documents, document];

    return document;
  }

  async addExistingLocalDocument(): Promise<LocalDocument | undefined> {
    // open file dialog
    // add to store

    const result = await dialog.showOpenDialog({
      title: "Open Project",
      defaultPath: path.resolve(__dirname, "../../sandbox/src"),
      filters: [
        {
          name: "Uimix Project",
          extensions: ["uimix"],
        },
      ],
    });
    const filePath = result.filePaths[0];
    if (!filePath) {
      return;
    }

    const title = path.basename(filePath, ".uimix");
    const updatedAt = new Date().toString();
    const document: LocalDocument = {
      id: createId(),
      title,
      path: filePath,
      updatedAt,
    };
    this.documents = [...this.documents, document];

    return document;
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
}

export const localDocumentRepository = new LocalDocumentRepository();
