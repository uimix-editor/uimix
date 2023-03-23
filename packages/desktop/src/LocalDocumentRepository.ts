import { LocalDocument } from "../../dashboard/src/types/DesktopAPI";
import { ProjectJSON } from "../../node-data/src";
import path from "path";
import fs from "fs";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import { dialog } from "electron";
import { createId } from "@paralleldrive/cuid2";
import Store from "electron-store";

interface LocalDocumentRef {
  id: string;
  path: string;
  thumbnail?: string;
}

const store = new Store<{
  documents: LocalDocumentRef[];
}>();

function formatJSON(text: string): string {
  return prettier.format(text, {
    parser: "json",
    plugins: [parserBabel],
  });
}

function refToDocument(ref: LocalDocumentRef): LocalDocument {
  let stats: fs.Stats | undefined;
  try {
    stats = fs.statSync(ref.path);
  } catch {
    // ignore
  }

  return {
    ...ref,
    title: path.basename(ref.path, ".uimix"),
    exists: !!stats,
    updatedAt: (stats?.mtime ?? new Date()).toString(),
  };
}

export class LocalDocumentRepository {
  get documents(): readonly LocalDocumentRef[] {
    return store.get("documents", []);
  }

  set documents(documents: readonly LocalDocumentRef[]) {
    store.set("documents", documents);
  }

  getLocalDocuments(): readonly LocalDocument[] {
    return this.documents.map(refToDocument);
  }

  getLocalDocument(id: string): LocalDocument | undefined {
    // TODO: index
    const ref = this.documents.find((doc) => doc.id === id);
    if (!ref) {
      return;
    }
    return refToDocument(ref);
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

    const ref = {
      id: createId(),
      path: filePath,
    };

    this.documents = [...this.documents, ref];
    return refToDocument(ref);
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

    const existing = this.documents.find((doc) => doc.path === filePath);
    if (existing) {
      return refToDocument(existing);
    }

    const ref: LocalDocumentRef = {
      id: createId(),
      path: filePath,
    };
    this.documents = [...this.documents, ref];

    return refToDocument(ref);
  }

  deleteLocalDocument(id: string): void {
    this.documents = this.documents.filter((doc) => doc.id !== id);
  }

  updateLocalDocumentThumbnail(id: string, pngData: Uint8Array): void {
    const document = this.documents.find((doc) => doc.id === id);
    if (!document) {
      throw new Error("Document not found");
    }
    const thumbnail = `data:image/png;base64,${Buffer.from(pngData).toString(
      "base64"
    )}`;
    this.documents = this.documents.map((doc) =>
      doc.id === id ? { ...doc, thumbnail } : doc
    );
  }

  getLocalDocumentData(id: string): ProjectJSON {
    const document = this.getLocalDocument(id);
    if (!document) {
      throw new Error("Document not found");
    }
    return ProjectJSON.parse(
      JSON.parse(fs.readFileSync(document.path, { encoding: "utf-8" }))
    );
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
