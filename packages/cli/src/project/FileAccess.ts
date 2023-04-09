export interface FileAccess {
  readonly rootPath: string;
  watch(pattern: string, onChange: () => void): () => void;
  glob(pattern: string): Promise<string[]>;
  writeText(filePath: string, data: string): Promise<void>;
  readText(filePath: string): Promise<string>;
  remove(filePath: string): Promise<void>;
}
