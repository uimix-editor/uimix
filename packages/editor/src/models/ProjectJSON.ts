import { ProjectJSON } from "@uimix/node-data";
import * as Y from "yjs";

export function loadProjectJSON(ydoc: Y.Doc, projectJSON: ProjectJSON): void {
  // TODO: support overwrite

  const nodes = ydoc.getMap("nodes");
  for (const [id, json] of Object.entries(projectJSON.nodes)) {
    const data = new Y.Map();
    for (const [key, value] of Object.entries(json)) {
      data.set(key, value);
    }
    nodes.set(id, data);
  }

  const styles = ydoc.getMap("styles");
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
}

export function toProjectJSON(ydoc: Y.Doc): ProjectJSON {
  const json: ProjectJSON = {
    nodes: ydoc.getMap("nodes").toJSON(),
    styles: ydoc.getMap("styles").toJSON(),
    componentURLs: ydoc.getArray("componentURLs").toJSON(),
    images: ydoc.getMap("images").toJSON(),
  };
  // delete dangling nodes
  for (const id of Object.keys(json.nodes)) {
    if (json.nodes[id].type !== "project" && !json.nodes[id].parent) {
      delete json.nodes[id];
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
