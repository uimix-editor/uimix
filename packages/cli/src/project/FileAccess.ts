export interface Stats {
  type: "file" | "directory";
}

export interface FileAccess {
  watch(cwd: string, patterns: string[], onChange: () => void): () => void;
  glob(cwd: string, patterns: string[]): Promise<string[]>;
  stat(filePath: string): Promise<Stats | undefined>;
  writeFile(filePath: string, data: Buffer): Promise<void>;
  readFile(filePath: string): Promise<Buffer>;
  remove(filePath: string): Promise<void>;
}
