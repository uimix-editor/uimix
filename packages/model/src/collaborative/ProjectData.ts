import {
  ColorToken,
  Image,
  NodeJSON,
  ProjectJSON,
  StyleJSON,
} from "../data/v1";
import * as Y from "yjs";

export class ProjectData {
  constructor(doc: Y.Doc = new Y.Doc()) {
    this.doc = doc;
  }

  readonly doc: Y.Doc;

  get nodes(): Y.Map<Y.Map<NodeJSON[keyof NodeJSON]>> {
    return this.doc.getMap("nodes");
  }

  get styles(): Y.Map<Y.Map<StyleJSON[keyof StyleJSON]>> {
    return this.doc.getMap("styles");
  }

  get componentURLs(): Y.Array<string> {
    return this.doc.getArray("componentURLs");
  }

  get colors(): Y.Map<Y.Map<ColorToken[keyof ColorToken]>> {
    return this.doc.getMap("colors");
  }

  get images(): Y.Map<Image> {
    return this.doc.getMap("images");
  }

  get selection(): Y.Map<true> {
    return this.doc.getMap("selection");
  }

  loadJSON(projectJSON: ProjectJSON): void {
    this.doc.transact(() => {
      const nodes = this.nodes;
      nodes.clear();
      for (const [id, json] of Object.entries(projectJSON.nodes)) {
        const data = new Y.Map<NodeJSON[keyof NodeJSON]>();
        for (const [key, value] of Object.entries(json)) {
          data.set(key, value);
        }
        nodes.set(id, data);
      }

      const styles = this.styles;
      styles.clear();
      for (const [id, json] of Object.entries(projectJSON.styles)) {
        const data = new Y.Map<StyleJSON[keyof StyleJSON]>();
        for (const [key, value] of Object.entries(json)) {
          data.set(key, value);
        }
        styles.set(id, data);
      }

      const componentURLs = this.componentURLs;
      componentURLs.delete(0, componentURLs.length);
      for (const url of projectJSON.componentURLs ?? []) {
        componentURLs.push([url]);
      }

      const images = this.images;
      images.clear();
      for (const [hash, url] of Object.entries(projectJSON.images ?? {})) {
        images.set(hash, url);
      }

      const colors = this.colors;
      colors.clear();
      for (const [name, json] of Object.entries(projectJSON.colors ?? {})) {
        const data = new Y.Map<ColorToken[keyof ColorToken]>(
          Object.entries(json)
        );
        colors.set(name, data);
      }
    });
  }

  toJSON(): ProjectJSON {
    const json: ProjectJSON = {
      nodes: this.nodes.toJSON(),
      styles: this.styles.toJSON(),
      componentURLs: this.componentURLs.toJSON(),
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
