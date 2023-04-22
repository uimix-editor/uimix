export interface PathTreeModelTarget {
  id: string;
  filePath: string;
}

export interface FolderItem<T extends PathTreeModelTarget> {
  type: "directory";
  id: string;
  path: string;
  name: string;
  children: Item<T>[];
}

export interface FileItem<T extends PathTreeModelTarget> {
  type: "file";
  id: string;
  path: string;
  name: string;
  target: T;
}

export type Item<T extends PathTreeModelTarget> = FolderItem<T> | FileItem<T>;

function build<T extends PathTreeModelTarget>(targets: T[]): FolderItem<T> {
  const root: FolderItem<T> = {
    type: "directory",
    id: "",
    name: "",
    path: "",
    children: [],
  };
  const parents = new Map<string, FolderItem<T>>();
  parents.set("", root);

  const mkdirp = (segments: string[]): FolderItem<T> => {
    if (segments.length === 0) {
      return root;
    }

    const existing = parents.get(segments.join("/"));
    if (existing) {
      return existing;
    }

    const parent = mkdirp(segments.slice(0, -1));
    const dir: FolderItem<T> = {
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

    const item: FileItem<T> = {
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

export const PathHierarchy = {
  build,
  targetsForPath,
};

interface Delegate<T extends PathTreeModelTarget> {
  getTargets: () => T[];
  delete(target: T): void;
  rename(target: T, newName: string): void;
}

export class PathTreeModel<T extends PathTreeModelTarget> {
  constructor(delegate: Delegate<T>) {
    this.delegate = delegate;
  }

  private delegate: Delegate<T>;

  get targets(): T[] {
    return this.delegate.getTargets();
  }

  get root(): FolderItem<T> {
    return build(this.targets);
  }

  delete(path: string) {
    for (const target of PathHierarchy.targetsForPath(this.targets, path)) {
      this.delegate.delete(target);
    }
  }

  rename(path: string, newPath: string) {
    if (path === newPath) {
      return;
    }

    for (const target of PathHierarchy.targetsForPath(this.targets, path)) {
      const newName = newPath + target.filePath.slice(path.length);
      this.delegate.rename(target, newName);
    }
  }
}
