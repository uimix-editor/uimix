import * as Data from "../data/v1";
import * as Y from "yjs";

export class ProjectData {
  constructor(doc: Y.Doc = new Y.Doc()) {
    this.doc = doc;
  }

  readonly doc: Y.Doc;

  get nodes(): Y.Map<Y.Map<Data.Node[keyof Data.Node]>> {
    return this.doc.getMap("nodes");
  }

  get styles(): Y.Map<Y.Map<Data.Style[keyof Data.Style]>> {
    return this.doc.getMap("styles");
  }

  get componentURLs(): Y.Array<string> {
    return this.doc.getArray("componentURLs");
  }

  get colors(): Y.Map<Y.Map<Data.ColorToken[keyof Data.ColorToken]>> {
    return this.doc.getMap("colors");
  }

  get images(): Y.Map<Data.Image> {
    return this.doc.getMap("images");
  }

  get selection(): Y.Map<true> {
    return this.doc.getMap("selection");
  }

  clear() {
    this.doc.transact(() => {
      this.nodes.clear();
      this.styles.clear();
      this.componentURLs.delete(0, this.componentURLs.length);
      this.colors.clear();
      this.images.clear();
      this.selection.clear();
    });
  }

  loadJSON(projectJSON: Data.Project): void {
    this.doc.transact(() => {
      this.clear();

      const nodes = this.nodes;
      for (const [id, json] of Object.entries(projectJSON.nodes)) {
        const data = new Y.Map<Data.Node[keyof Data.Node]>();
        for (const [key, value] of Object.entries(json)) {
          data.set(key, value);
        }
        nodes.set(id, data);
      }

      const styles = this.styles;
      for (const [id, json] of Object.entries(projectJSON.styles)) {
        const data = new Y.Map<Data.Style[keyof Data.Style]>();
        for (const [key, value] of Object.entries(json)) {
          data.set(key, value);
        }
        styles.set(id, data);
      }

      const componentURLs = this.componentURLs;
      for (const url of projectJSON.componentURLs ?? []) {
        componentURLs.push([url]);
      }

      const images = this.images;
      for (const [hash, url] of Object.entries(projectJSON.images ?? {})) {
        images.set(hash, url);
      }

      const colors = this.colors;
      for (const [name, json] of Object.entries(projectJSON.colors ?? {})) {
        const data = new Y.Map<Data.ColorToken[keyof Data.ColorToken]>(
          Object.entries(json)
        );
        colors.set(name, data);
      }
    });
  }

  toJSON(): Data.Project {
    const json: Data.Project = {
      nodes: this.nodes.toJSON(),
      styles: this.styles.toJSON(),
      componentURLs: this.componentURLs.toJSON() as string[],
      images: this.images.toJSON(),
      colors: this.colors.toJSON(),
    };

    // delete dangling nodes

    const ids = new Set(Object.keys(json.nodes));
    for (;;) {
      let deleted = false;
      for (const id of ids) {
        const node = json.nodes[id];
        if (node.type === "project") {
          continue;
        }

        if (!node.parent || !ids.has(node.parent)) {
          delete json.nodes[id];
          deleted = true;
          ids.delete(id);
        }
      }

      if (!deleted) {
        break;
      }
    }

    // delete styles for deleted nodes
    for (const styleID of Object.keys(json.styles)) {
      const ids = styleID.split(":");
      for (const id of ids) {
        if (!json.nodes[id]) {
          delete json.styles[styleID];
        }
      }
    }

    return json;
  }
}
