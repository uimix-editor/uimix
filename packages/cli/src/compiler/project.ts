import {
  NodeJSON,
  PageJSON,
  ProjectJSON,
  ProjectManifestJSON,
} from "@uimix/node-data";
import { omit } from "lodash-es";
import { mkdirpSync } from "mkdirp";
import { globSync } from "glob";
import path from "path";
import fs from "fs";
import { sha256 } from "js-sha256";
import { formatJSON } from "../format";

interface HierarchicalNodeJSON extends NodeJSON {
  id: string;
  children: HierarchicalNodeJSON[];
}

function toHierarchicalNodeJSONs(
  nodes: Record<string, NodeJSON>
): HierarchicalNodeJSON[] {
  const hierarchicalNodes: Record<string, HierarchicalNodeJSON> = {};

  for (const [id, node] of Object.entries(nodes)) {
    hierarchicalNodes[id] = {
      ...node,
      id,
      children: [],
    };
  }

  for (const [id, node] of Object.entries(nodes)) {
    if (node.parent) {
      hierarchicalNodes[node.parent].children.push(hierarchicalNodes[id]);
    }
  }

  for (const node of Object.values(hierarchicalNodes)) {
    node.children.sort((a, b) => a.index - b.index);
  }

  return Object.values(hierarchicalNodes).filter((node) => !node.parent);
}

interface ProjectJSONFiles {
  manifest: ProjectManifestJSON;
  pages: Map<string /* file path */, PageJSON>;
}

export function projectJSONToFiles(projectJSON: ProjectJSON): ProjectJSONFiles {
  const manifest: ProjectManifestJSON = {
    componentURLs: projectJSON.componentURLs,
    images: projectJSON.images,
    colors: projectJSON.colors,
  };

  const hierarchicalNodes = toHierarchicalNodeJSONs(projectJSON.nodes);
  const projectNode = hierarchicalNodes.find((node) => node.type === "project");
  if (!projectNode) {
    throw new Error("Project node not found");
  }

  const pages = new Map<string, PageJSON>();
  const nodeIDToPageJSON = new Map<string, PageJSON>();
  for (const page of projectNode.children) {
    if (page.type !== "page") {
      throw new Error("expected page node");
    }
    if (!page.name) {
      throw new Error("page name is empty");
    }

    const pageJSON: PageJSON = {
      nodes: {},
      styles: {},
    };
    const addNodeRecursively = (node: HierarchicalNodeJSON) => {
      pageJSON.nodes[node.id] = omit(node, ["children", "id"]);
      nodeIDToPageJSON.set(node.id, pageJSON);
      for (const child of node.children) {
        addNodeRecursively(child);
      }
    };
    for (const child of page.children) {
      addNodeRecursively(omit(child, ["parent"]));
    }
    pages.set(page.name, pageJSON);
  }

  for (const [id, style] of Object.entries(projectJSON.styles)) {
    const idPath = id.split(":");
    const pageJSON = nodeIDToPageJSON.get(idPath[0]);
    if (pageJSON) {
      pageJSON.styles[id] = style;
    }
  }

  return {
    manifest,
    pages,
  };
}

export function saveProjectToDirectory(
  projectDirPath: string,
  files: ProjectJSONFiles
): void {
  mkdirpSync(path.resolve(projectDirPath, "uimix"));
  mkdirpSync(path.resolve(projectDirPath, "uimix/images"));

  fs.writeFileSync(
    path.resolve(projectDirPath, "uimix/project.json"),
    formatJSON(JSON.stringify(files.manifest))
  );

  for (const [hash, image] of Object.entries(files.manifest.images ?? {})) {
    const dataURL = image.url;
    // data url to buffer
    const base64 = dataURL.split(",")[1];
    const buffer = Buffer.from(base64, "base64");

    fs.writeFileSync(
      path.resolve(projectDirPath, `uimix/images/${hash}.png`),
      buffer
    );
  }

  const pagePathsToDelete = new Set(
    globSync("**/*.uimix", {
      cwd: projectDirPath,
    })
  );

  for (const [pageName, pageJSON] of files.pages) {
    const pagePath = pageName + ".uimix";
    const pageDirPath = path.dirname(pagePath);
    mkdirpSync(path.resolve(projectDirPath, pageDirPath));
    fs.writeFileSync(
      path.resolve(projectDirPath, pagePath),
      formatJSON(JSON.stringify(pageJSON))
    );
    pagePathsToDelete.delete(pagePath);
  }

  for (const pagePath of pagePathsToDelete) {
    fs.rmSync(path.resolve(projectDirPath, pagePath));
  }
}

export function filesToProjectJSON(files: ProjectJSONFiles): ProjectJSON {
  // TODO: detect ID conflicts between files (and provide way to resolve them)

  const projectJSON: ProjectJSON = {
    nodes: {},
    styles: {},
    componentURLs: files.manifest.componentURLs,
    images: files.manifest.images,
    colors: files.manifest.colors,
  };

  const projectNode: NodeJSON = {
    type: "project",
    index: 0,
  };
  projectJSON.nodes["project"] = projectNode;

  let pageIndex = 0;
  for (const [pageName, pageJSON] of files.pages) {
    const pageID: string = sha256(pageName);

    const pageNode: NodeJSON = {
      type: "page",
      index: pageIndex++,
      name: pageName,
      parent: "project",
    };
    projectJSON.nodes[pageID] = pageNode;

    for (const [id, node] of Object.entries(pageJSON.nodes)) {
      projectJSON.nodes[id] = {
        ...node,
        parent: node.parent ?? pageID,
      };
    }

    for (const [id, style] of Object.entries(pageJSON.styles)) {
      projectJSON.styles[id] = style;
    }
  }

  return projectJSON;
}

export function loadProjectFromDirectory(
  projectDirPath: string
): ProjectJSONFiles {
  const manifestPath = path.resolve(projectDirPath, "uimix/project.json");
  let manifest: ProjectManifestJSON;
  try {
    manifest = ProjectManifestJSON.parse(
      JSON.parse(fs.readFileSync(manifestPath, { encoding: "utf-8" }))
    );
  } catch {
    manifest = { componentURLs: [], images: {}, colors: {} };
  }

  const pages = new Map<string, PageJSON>();

  const pagePaths = globSync("**/*.uimix", {
    cwd: projectDirPath,
  });

  for (const pagePath of pagePaths) {
    const pageJSON = PageJSON.parse(
      JSON.parse(
        fs.readFileSync(path.resolve(projectDirPath, pagePath), {
          encoding: "utf-8",
        })
      )
    );
    pages.set(pagePath.replace(/\.uimix$/, ""), pageJSON);
  }

  return {
    manifest,
    pages,
  };
}
