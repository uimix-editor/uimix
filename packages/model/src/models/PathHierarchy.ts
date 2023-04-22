export interface PathHierarchyTarget {
  id: string;
  filePath: string;
}

export interface PathHierarchyFolder<T extends PathHierarchyTarget> {
  type: "directory";
  id: string;
  path: string;
  name: string;
  children: PathHierarchy<T>[];
}

export interface PathHierarchyFile<T extends PathHierarchyTarget> {
  type: "file";
  id: string;
  path: string;
  name: string;
  target: T;
}

export type PathHierarchy<T extends PathHierarchyTarget> =
  | PathHierarchyFolder<T>
  | PathHierarchyFile<T>;

function build<T extends PathHierarchyTarget>(
  targets: T[]
): PathHierarchyFolder<T> {
  const root: PathHierarchyFolder<T> = {
    type: "directory",
    id: "",
    name: "",
    path: "",
    children: [],
  };
  const parents = new Map<string, PathHierarchyFolder<T>>();
  parents.set("", root);

  const mkdirp = (segments: string[]): PathHierarchyFolder<T> => {
    if (segments.length === 0) {
      return root;
    }

    const existing = parents.get(segments.join("/"));
    if (existing) {
      return existing;
    }

    const parent = mkdirp(segments.slice(0, -1));
    const dir: PathHierarchyFolder<T> = {
      type: "directory",
      id: segments.join("/"),
      name: segments[segments.length - 1],
      path: segments.join("/"),
      children: [],
    };
    parent.children.push(dir);
    parents.set(segments.join("/"), dir);
    return dir;
  };

  targets = [...targets].sort((a, b) => a.filePath.localeCompare(b.filePath));

  for (const target of targets) {
    const segments = target.filePath.split("/");
    const parent = mkdirp(segments.slice(0, -1));

    const item: PathHierarchyFile<T> = {
      type: "file",
      id: target.id,
      name: segments[segments.length - 1],
      path: target.filePath,
      target,
    };
    parent.children.push(item);
  }

  return root;
}

function targetsForPath<T extends PathHierarchyTarget>(
  targets: T[],
  path: string
) {
  return targets.filter(
    (page) => page.filePath === path || page.filePath.startsWith(path + "/")
  );
}

export const PathHierarchy = {
  build,
  targetsForPath,
};
