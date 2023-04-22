import { observable } from "mobx";

export interface PathTreeModelTarget {
  id: string;
  filePath: string;
}

export interface PathTreeModelFolderItem<T extends PathTreeModelTarget> {
  type: "directory";
  id: string;
  path: string;
  name: string;
  children: PathTreeModelItem<T>[];
}

export interface PathTreeModelFileItem<T extends PathTreeModelTarget> {
  type: "file";
  id: string;
  path: string;
  name: string;
  target: T;
}

export type PathTreeModelItem<T extends PathTreeModelTarget> =
  | PathTreeModelFolderItem<T>
  | PathTreeModelFileItem<T>;

function buildTree<T extends PathTreeModelTarget>(
  targets: T[]
): PathTreeModelFolderItem<T> {
  const root: PathTreeModelFolderItem<T> = {
    type: "directory",
    id: "",
    name: "",
    path: "",
    children: [],
  };
  const parents = new Map<string, PathTreeModelFolderItem<T>>();
  parents.set("", root);

  const mkdirp = (segments: string[]): PathTreeModelFolderItem<T> => {
    if (segments.length === 0) {
      return root;
    }

    const existing = parents.get(segments.join("/"));
    if (existing) {
      return existing;
    }

    const parent = mkdirp(segments.slice(0, -1));
    const dir: PathTreeModelFolderItem<T> = {
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

    const item: PathTreeModelFileItem<T> = {
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

function targetsForPath<T extends PathTreeModelTarget>(
  targets: T[],
  path: string
) {
  return targets.filter(
    (page) => page.filePath === path || page.filePath.startsWith(path + "/")
  );
}

interface PathTreeModelDelegate<T extends PathTreeModelTarget> {
  getTargets: () => T[];
  delete(target: T): void;
  rename(target: T, newName: string): T;
}

export class PathTreeModel<T extends PathTreeModelTarget> {
  constructor(delegate: PathTreeModelDelegate<T>) {
    this.delegate = delegate;
  }

  private delegate: PathTreeModelDelegate<T>;

  readonly collapsedPaths = observable.set<string>();

  get targets(): T[] {
    return this.delegate.getTargets();
  }

  get root(): PathTreeModelFolderItem<T> {
    return buildTree(this.targets);
  }

  delete(path: string) {
    for (const target of targetsForPath(this.targets, path)) {
      this.delegate.delete(target);
    }
  }

  rename(path: string, newPath: string): Map<T, T> {
    if (path === newPath) {
      return new Map();
    }

    const oldToNew = new Map<T, T>();

    for (const target of targetsForPath(this.targets, path)) {
      const newName = newPath + target.filePath.slice(path.length);
      const newTarget = this.delegate.rename(target, newName);

      oldToNew.set(target, newTarget);
    }

    return oldToNew;
  }
}
