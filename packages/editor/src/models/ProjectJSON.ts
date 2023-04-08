import { getURLSafeBase64Hash } from "@uimix/foundation/src/utils/Hash";
import { ProjectJSON } from "@uimix/node-data";
import * as Y from "yjs";
import { isEqual, omit } from "lodash-es";

export function loadProjectJSON(ydoc: Y.Doc, projectJSON: ProjectJSON): void {
  const nodes = ydoc.getMap("nodes");
  nodes.clear();
  for (const [id, json] of Object.entries(projectJSON.nodes)) {
    const data = new Y.Map();
    for (const [key, value] of Object.entries(json)) {
      data.set(key, value);
    }
    nodes.set(id, data);
  }

  const styles = ydoc.getMap("styles");
  styles.clear();
  for (const [id, json] of Object.entries(projectJSON.styles)) {
    const data = new Y.Map();
    for (const [key, value] of Object.entries(json)) {
      data.set(key, value);
    }
    styles.set(id, data);
  }

  const componentURLs = ydoc.getArray("componentURLs");
  componentURLs.delete(0, componentURLs.length);
  for (const url of projectJSON.componentURLs ?? []) {
    componentURLs.push([url]);
  }

  const images = ydoc.getMap("images");
  images.clear();
  for (const [hash, url] of Object.entries(projectJSON.images ?? {})) {
    images.set(hash, url);
  }

  const colors = ydoc.getMap("colors");
  colors.clear();
  for (const [name, json] of Object.entries(projectJSON.colors ?? {})) {
    const data = new Y.Map(Object.entries(json));
    colors.set(name, data);
  }
}

export function toProjectJSON(ydoc: Y.Doc): ProjectJSON {
  const json: ProjectJSON = {
    nodes: ydoc.getMap("nodes").toJSON(),
    styles: ydoc.getMap("styles").toJSON(),
    componentURLs: ydoc.getArray("componentURLs").toJSON(),
    images: ydoc.getMap("images").toJSON(),
    colors: ydoc.getMap("colors").toJSON(),
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

  // TODO: delete dangling images

  return json;
}

export function getPageID(pageName: string): string {
  return getURLSafeBase64Hash(pageName);
}

export function compareProjectJSONs(a: ProjectJSON, b: ProjectJSON): boolean {
  // skipping images as they may be very large
  return isEqual(omit(a, "images"), omit(b, "images"));
}
