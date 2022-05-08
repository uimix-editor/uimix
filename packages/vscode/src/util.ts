import * as path from "path";

export function getImportPath(from: string, to: string): string {
  const relative = path.posix.relative(path.dirname(from), to);
  if (!relative.startsWith(".")) {
    return `./${relative}`;
  }
  return relative;
}
