export interface Stats {
  type: "file" | "directory";
}

export interface FileAccess {
  readonly rootPath: string;
  watch(pattern: string, onChange: () => void): () => void;
  glob(pattern: string): Promise<string[]>;
  stat(filePath: string): Promise<Stats | undefined>;
  writeFile(filePath: string, data: Buffer): Promise<void>;
  readFile(filePath: string): Promise<Buffer>;
  remove(filePath: string): Promise<void>;
}
